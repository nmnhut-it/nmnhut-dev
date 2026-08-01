// node lessons/test-interaction-matrix.mjs — regression tests for the camera
// interaction edge cases catalogued in lessons/INTERACTION-MATRIX.md. Drives
// the REAL GestureDispatcher/TwoPhaseGate/AskGate code (pure JS, no DOM
// needed beyond the same minimal chip/camera stubs test-gesture-registry.mjs
// already uses) — not a reimplementation. Matches this repo's existing
// assert-based, no-framework test style.
import assert from 'node:assert';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';
import { TwoPhaseGate, makeSwipeCapture } from './engine/two-phase-gate.js';
import { AskGate } from './engine/ask-gate.js';
import { GESTURE_ARM_MS, GESTURE_CAPTURE_MS } from './engine/constants.js';

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

// ── same synthetic-hand builder as test-dispatcher.mjs/test-gesture-registry.mjs ──
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
// See test-gesture-registry.mjs's fakeChip for why 'canvas.fxdots' needs its
// own fake now: fingertip-fx is armed by the gate seams themselves (gesture-
// dispatcher.js#armActHoldGate/armTimedCatchGate/armVerbGate), so armFingertipFx
// runs unconditionally and must not blow up on a chip stub with no `document`.
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

// ── 1. hand lost mid-arm decays (does not hard-reset) the arm progress ──
// (TwoPhaseGate-level; two-phase-gate.js's own decay formula: armHeld = max(0,
// armHeld - dt*ARM_DECAY) on a lost/wrong-count frame, never a hard 0 reset.)
t('hand lost mid-arm decays the arm progress instead of hard-resetting to 0', () => {
  const states = [];
  const gate = new TwoPhaseGate({ capture: { reset(){}, step: () => ({ done: null, progress: 0 }) }, onState: (p, v) => states.push([p, v]) });
  let now = 0;
  for (; now <= 200; now += 50) gate.step(now, { lm: {}, has: true, count: 5 });   // charge ~200ms of ARM
  now += 50; gate.step(now, { lm: null, has: false, count: 0 });                   // hand lost — one dropped frame
  let armed = false, framesToArm = 0;
  for (; framesToArm < 1000 && !armed; framesToArm++) { now += 50; gate.step(now, { lm: {}, has: true, count: 5 }); if (gate.phase === 'capture') armed = true; }
  assert.ok(armed, 'must still be able to re-arm after a dropped frame');
  const freshFrames = Math.ceil(GESTURE_ARM_MS / 50);
  assert.ok(framesToArm <= freshFrames, `partial charge must carry over — expected <= ${freshFrames} frames to finish arming, got ${framesToArm}`);
});

// ── 2. alive() flipping false mid-gate disarms the gate + removes the chip's
// 'on' class WITHOUT firing onDone (gesture-dispatcher.js#armVerbGate's
// `if (!alive()) { this.disarmMotionGate(); chip.classList.remove('on'); return; }` guard). ──
await ta('alive() flipping false mid-gate disarms the gate and never fires onDone', async () => {
  const gd = makeGd(), chip = fakeChip();
  let done = null, live = true;
  gd.armVerbGate('swipe', fakeCam, chip, { axis: 'any' }, () => live, () => {}, v => { done = v; });
  await sleep(30);                                       // let ensure() resolve and the motion gate arm
  assert.strictEqual(gd.motionGateArmed, true);
  assert.ok(chip._cls.has('on'));
  // reach capture phase (hold the arm sign)
  const t0 = Date.now();
  while (gd.motionGateArmed && Date.now() - t0 < GESTURE_ARM_MS * 6) {
    gd.onHands({ multiHandLandmarks: [makeHand(5)] });
    await sleep(20);
    if (!gd.motionGateArmed) break;                       // shouldn't happen here, but guard the loop
  }
  live = false;                                           // student navigates away / cell no longer alive
  gd.onHands({ multiHandLandmarks: [makeHand(1)] });       // a frame arrives after alive() went false
  assert.strictEqual(gd.motionGateArmed, false, 'onHands must disarm the motion gate once alive() is false');
  assert.ok(!chip._cls.has('on'), 'chip light must turn off');
  assert.strictEqual(done, null, 'onDone must never fire once the cell is no longer alive');
});

// ── 3. gesture capture timeout re-arms the gate (returns to ARM phase)
// rather than getting stuck (two-phase-gate.js: `if (elapsed >= captureMs) {
// this.#phase = 'arm'; ... }`) — driven end-to-end through the real
// GestureDispatcher/armVerbGate wiring, then proven a FRESH arm+capture
// cycle after the timeout still resolves normally. ──
await ta('a capture timeout re-arms the gate, and a subsequent attempt still resolves', async () => {
  const gd = makeGd(), chip = fakeChip();
  let done = null, phase = 'arm';
  gd.armVerbGate('swipe', fakeCam, chip, { axis: 'any' }, () => true, p => { phase = p; }, v => { done = v; });
  await sleep(30);
  // ARM: hold ✋ until capture opens — stop the INSTANT it flips, so no
  // stray arm-sign frames leak into the swipe capture's history.
  const t0 = Date.now();
  while (phase !== 'capture' && Date.now() - t0 < GESTURE_ARM_MS * 6) {
    gd.onHands({ multiHandLandmarks: [makeHand(5)] });
    await sleep(20);
  }
  assert.strictEqual(phase, 'capture');
  assert.strictEqual(gd.motionGateArmed, true, 'still armed after ARM phase (waiting in capture)');
  // let the whole CAPTURE window expire with no swipe — no hand at all
  const t1 = Date.now();
  while (Date.now() - t1 < GESTURE_CAPTURE_MS + 400) {
    gd.onHands({ multiHandLandmarks: [] });
    await sleep(20);
  }
  assert.strictEqual(phase, 'arm', 'must have re-armed (returned to ARM phase) after the capture timeout');
  assert.strictEqual(gd.motionGateArmed, true, 'gate must still be armed, not stuck/dead');
  assert.strictEqual(done, null, 'a timeout must not resolve onDone');
  // NOW perform a real swipe — must still work after the re-arm. Stop the
  // ARM loop the instant it flips back to capture, same as above.
  const t2 = Date.now();
  while (phase !== 'capture' && Date.now() - t2 < GESTURE_ARM_MS * 6) {
    gd.onHands({ multiHandLandmarks: [makeHand(5)] });
    await sleep(20);
  }
  assert.strictEqual(phase, 'capture', 'must re-enter capture on the second attempt');
  const a = makeHand(1); a[8] = pt(0.8, 0.5);
  const b = makeHand(1); b[8] = pt(0.2, 0.5);
  gd.onHands({ multiHandLandmarks: [a] });
  await sleep(300);
  gd.onHands({ multiHandLandmarks: [b] });
  assert.strictEqual(done, 'right', 'a fresh capture attempt after the timeout re-arm must still resolve');
});

// ── 4. a resolved gate never double-fires onDone even if more frames arrive
// after resolution (TwoPhaseGate.step's `if (this.#done) return;` guard). ──
t('a resolved TwoPhaseGate never double-fires onDone on further frames', () => {
  let calls = 0;
  const gate = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: () => { calls++; } });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, { lm: {}, has: true, count: 5 });
  gate.step(now += 50, { lm: { 8: { x: 0.8, y: 0.5 } }, has: true, count: 1 });
  gate.step(now += 300, { lm: { 8: { x: 0.2, y: 0.5 } }, has: true, count: 1 });
  assert.strictEqual(calls, 1, 'must resolve exactly once');
  // feed many more frames after resolution — including frames that would
  // otherwise "resolve" a fresh swipe, and frames after the old capture
  // window would have timed out
  for (let i = 0; i < 80; i++) { gate.step(now += 50, { lm: { 8: { x: i % 2 ? 0.8 : 0.2, y: 0.5 } }, has: true, count: 1 }); }
  assert.strictEqual(calls, 1, 'onDone must never fire again once done');
  assert.strictEqual(gate.done, true);
});

// ── 5. arming a fresh gate after a previous timeout works correctly (no
// stuck state carried over) — a NEW TwoPhaseGate/capture instance (as
// armVerbGate constructs on every armVerbGate() call, e.g. a new boss round
// or a new quiz question), never inherits a previous gate's leftover phase. ──
t('a fresh gate constructed after a previous one timed out starts clean in ARM phase', () => {
  const first = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: () => {} });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) first.step(now, { lm: {}, has: true, count: 5 });
  assert.strictEqual(first.phase, 'capture');
  for (; now <= GESTURE_ARM_MS + GESTURE_CAPTURE_MS + 100; now += 50) first.step(now, { lm: null, has: false, count: 0 });
  assert.strictEqual(first.phase, 'arm', 'first gate timed out back to arm');
  // a brand new gate (e.g. the next quiz question/boss round) must not
  // inherit any of that — starts at phase 'arm', 0 progress
  const second = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: () => {} });
  assert.strictEqual(second.phase, 'arm');
  let now2 = 0, resolvedEarly = false;
  second.step(now2, { lm: {}, has: true, count: 5 });
  if (second.phase === 'capture') resolvedEarly = true;
  assert.ok(!resolvedEarly, 'a fresh gate must not already be in capture after a single frame');
});

// ── AskGate: the pending-ask cancel-slot mechanics that back the '\x18'
// sentinel path (ask-gate.js). The Pyodide/worker half of that path (worker.js
// throwing on '\x18', node.js's __MDCANCEL__ handling) needs a real worker/SAB
// and is NOT drivable headless — see INTERACTION-MATRIX.md's note on this.
// This is the pure-JS half of the mechanism, exercised directly. ──
t('AskGate.cancel() invokes the armed callback exactly once and clears pending', () => {
  const ag = new AskGate();
  assert.strictEqual(ag.isArmed, false);
  let calls = 0;
  ag.arm(() => { calls++; });
  assert.strictEqual(ag.isArmed, true);
  ag.cancel();
  assert.strictEqual(calls, 1);
  assert.strictEqual(ag.isArmed, false);
  ag.cancel();                          // cancelling again with nothing pending must be a silent no-op
  assert.strictEqual(calls, 1);
});

t('AskGate.clear() clears without invoking the pending callback (the normal resolve path)', () => {
  const ag = new AskGate();
  let calls = 0;
  ag.arm(() => { calls++; });
  ag.clear();
  assert.strictEqual(ag.isArmed, false);
  assert.strictEqual(calls, 0, 'a normal resolve (clear) must not fire the cancel callback');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
