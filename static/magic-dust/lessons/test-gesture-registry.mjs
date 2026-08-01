// node lessons/test-gesture-registry.mjs — pins the gesture verb registry
// (gesture-registry.js) + GestureDispatcher#armVerbGate: the registered verb
// list is the single source of truth for dispatch/schema, an unknown verb
// throws loudly, and a verb registered at test time gets a WORKING gate
// end-to-end (armVerbGate → armMotionGate → onHands → TwoPhaseGate →
// captureFactory → onDone) with only a registry entry — the whole point of
// the registry. Uses a real clock (armVerbGate reads performance.now()), so
// the e2e tests hold ✋ frames for ~GESTURE_ARM_MS of wall time.
import assert from 'node:assert';
import { GESTURE_VERBS, GESTURE_VERB_NAMES, registerVerb, getVerb } from './engine/gesture-registry.js';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';
import { countFingers } from './engine/camera-engine.js';
import { GESTURE_ARM_MS } from './engine/constants.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
async function ta(name, fn) {
  try { await fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── same synthetic-hand builder as test-dispatcher.mjs (see the derivation
// comment there) — so frames go through the REAL onHands/countFingers path ──
function pt(x, y) { return { x, y }; }
function makeHand(fingerCount) {
  const lm = new Array(21);
  lm[0] = pt(0.5, 0.9); lm[9] = pt(0.5, 0.6);
  const fingers = [[6, 8], [10, 12], [14, 16], [18, 20]];
  fingers.forEach(([pip, tip], i) => { lm[pip] = pt(0.5, 0.6); lm[tip] = i < Math.min(fingerCount, 4) ? pt(0.5, 0.45) : pt(0.5, 0.6); });
  lm[17] = pt(0.7, 0.6);
  lm[2] = fingerCount === 5 ? pt(0.7, 0.6) : pt(0.9, 0.6);
  lm[4] = fingerCount === 5 ? pt(0.9, 0.6) : pt(0.7, 0.6);
  for (let i = 0; i < 21; i++) if (!lm[i]) lm[i] = pt(0.5, 0.6);
  return lm;
}

// minimal DOM/camera stand-ins — armVerbGate touches chip.querySelector('video'),
// chip.classList, and (since fingertip-fx is now armed by the gate seams
// themselves, see gesture-dispatcher.js#armVerbGate) chip.querySelector
// ('canvas.fxdots') + a 2D-context-shaped canvas, so armFingertipFx never
// needs a real `document`. A single video-shaped fake answered every
// selector before this — armFingertipFx would otherwise call .getContext()
// on that video stub and throw (silently swallowed by armVerbGate's
// .catch(), which used to break the whole gate before this fix).
function fakeChip() {
  const cls = new Set();
  const noop = () => {};
  const fakeCanvas = { className: '', width: 0, height: 0, clientWidth: 100, clientHeight: 100,
    getContext: () => ({ save: noop, restore: noop, clearRect: noop, beginPath: noop, closePath: noop,
      moveTo: noop, lineTo: noop, arc: noop, fill: noop, stroke: noop, translate: noop, rotate: noop, fillText: noop }),
    remove: noop };
  return {
    classList: { add: c => cls.add(c), remove: c => cls.delete(c), contains: c => cls.has(c) },
    querySelector: sel => sel === 'canvas.fxdots' ? fakeCanvas : { set srcObject(v) {}, play: () => ({ catch() {} }) },
    _cls: cls,
  };
}
const fakeCam = { stream: null, ensure: () => Promise.resolve() };
function makeGd() {
  return new GestureDispatcher({ isRunning: () => false, frozenCheck: () => false, boothSummon: () => false, boothEmit: () => {}, hud: () => {} });
}

t('registered verb list is exactly the shipped verbs (swipe, track)', () => {
  assert.deepStrictEqual([...GESTURE_VERB_NAMES].slice(0, 2), ['swipe', 'track']);
  for (const n of GESTURE_VERB_NAMES) assert.strictEqual(typeof GESTURE_VERBS[n].captureFactory, 'function', `${n} needs a captureFactory`);
});

t('getVerb on an unknown verb throws loudly (names the registered verbs)', () => {
  assert.throws(() => getVerb('punch'), /unknown verb "punch".*swipe.*track/s);
});

t('armVerbGate with an unknown verb throws synchronously at the call site', () => {
  const gd = makeGd();
  assert.throws(() => gd.armVerbGate('circle', fakeCam, fakeChip(), {}, () => true, () => {}, () => {}), /unknown verb "circle"/);
  assert.strictEqual(gd.motionGateArmed, false);
});

t('registerVerb rejects duplicates and missing captureFactory', () => {
  assert.throws(() => registerVerb('swipe', { captureFactory: () => {} }), /already registered/);
  assert.throws(() => registerVerb('broken', {}), /captureFactory/);
  assert.ok(!GESTURE_VERB_NAMES.includes('broken'));
});

// drive a gate armed via armVerbGate: hold ✋ through real onHands frames
// until the arm phase flips, then hand the clock to `duringCapture`.
async function driveGate(gd, duringCapture) {
  const t0 = Date.now();
  let phase = 'arm';
  gd._seenPhase = p => { phase = p; };
  while (phase === 'arm' && Date.now() - t0 < GESTURE_ARM_MS * 6) { gd.onHands({ multiHandLandmarks: [makeHand(5)] }); await sleep(20); }
  assert.strictEqual(phase, 'capture', 'gate must reach capture phase');
  await duringCapture();
}

await ta('a synthetic verb registered at test time works end-to-end through armVerbGate/TwoPhaseGate', async () => {
  // "poke": resolves with the spec's token on the first capture frame that
  // shows exactly 1 finger — a brand-new verb, zero dispatcher edits.
  registerVerb('poke', { captureFactory: spec => ({ reset() {}, step: ({ has, count }) => ({ done: has && count === 1 ? spec.token : null, progress: 0 }) }) });
  assert.ok(GESTURE_VERB_NAMES.includes('poke'));
  const gd = makeGd(), chip = fakeChip();
  let done = null;
  gd.armVerbGate('poke', fakeCam, chip, { token: 'POKED' }, () => true, (p) => gd._seenPhase && gd._seenPhase(p), v => { done = v; });
  await sleep(30);                                    // let ensure() resolve and the motion gate arm
  assert.strictEqual(gd.motionGateArmed, true);
  assert.ok(chip._cls.has('on'));
  await driveGate(gd, async () => { gd.onHands({ multiHandLandmarks: [makeHand(1)] }); });
  assert.strictEqual(done, 'POKED');
  assert.strictEqual(gd.motionGateArmed, false, 'gate must disarm itself on done');
  assert.ok(!chip._cls.has('on'), 'chip light must turn off on done');
});

await ta('the armSwipeGate alias still resolves a rightward swipe through the registry path', async () => {
  const gd = makeGd(), chip = fakeChip();
  let done = null;
  gd.armSwipeGate(fakeCam, chip, () => true, (p) => gd._seenPhase && gd._seenPhase(p), dir => { done = dir; }, 'x');
  await sleep(30);
  await driveGate(gd, async () => {
    const a = makeHand(1); a[8] = pt(0.8, 0.5);       // mirrored: 1-x goes 0.2→0.8 = rightward
    const b = makeHand(1); b[8] = pt(0.2, 0.5);
    gd.onHands({ multiHandLandmarks: [a] });
    await sleep(300);
    gd.onHands({ multiHandLandmarks: [b] });
  });
  assert.strictEqual(done, 'right');
});

t('sanity: makeHand round-trips through countFingers (arm frames really read as 5)', () => {
  assert.strictEqual(countFingers(makeHand(5)), 5);
  assert.strictEqual(countFingers(makeHand(1)), 1);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
