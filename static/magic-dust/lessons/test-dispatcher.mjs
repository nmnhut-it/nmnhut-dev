// node lessons/test-dispatcher.mjs — pins GestureDispatcher's onHands()
// priority ladder (see the load-bearing comment atop gesture-dispatcher.js)
// with synthetic MediaPipe-shaped frames, no DOM/camera needed. Also runs
// one end-to-end arm→capture→swipe test through a real TwoPhaseGate fed
// through onHands, and replays a checked-in JSON trace (see traces/).
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';
import { countFingers, pickClosestHand, handSize } from './engine/camera-engine.js';
import { TwoPhaseGate, makeSwipeCapture } from './engine/two-phase-gate.js';
import { GESTURE_ARM_MS } from './engine/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

// ── synthetic hand builder — derived from camera-engine.js's countFingers:
// handSize = hypot(lm0-lm9); a finger counts extended when
// (pip.y-tip.y)/handSize*4.5 > FT_EXT(0.55); thumb counts when
// hypot(lm4-lm17) > hypot(lm2-lm17)*TH_RATIO(1.12). ──
function pt(x, y) { return { x, y }; }
function makeHand(fingerCount) {
  if (fingerCount < 0 || fingerCount > 5) throw new Error('makeHand: 0..5 only');
  const lm = new Array(21);
  lm[0] = pt(0.5, 0.9); lm[9] = pt(0.5, 0.6);           // wrist / mid-MCP → handSize = 0.3
  // four fingers: [pip, tip] index pairs, extended when tip.y is well above pip.y
  const fingers = [[6, 8], [10, 12], [14, 16], [18, 20]];
  const extendCount = Math.min(fingerCount, 4);
  fingers.forEach(([pip, tip], i) => {
    lm[pip] = pt(0.5, 0.6);
    lm[tip] = i < extendCount ? pt(0.5, 0.45) : pt(0.5, 0.6); // extended: diff .15 >> .55*.3/4.5=.0367
  });
  lm[17] = pt(0.7, 0.6);                                // pinky MCP, used only as thumbUp's reference point
  const thumbExtended = fingerCount === 5;               // only the 5th finger (thumb) distinguishes 4 vs 5
  lm[2] = thumbExtended ? pt(0.7, 0.6) : pt(0.9, 0.6);    // near lm17 when extended (small denominator)
  lm[4] = thumbExtended ? pt(0.9, 0.6) : pt(0.7, 0.6);    // far from lm17 when extended (large numerator)
  // lm[8] (index fingertip, read by swipe/track/booth-emit) is already set by
  // the fingers loop above — do NOT overwrite it here, or fingerCount=0's
  // non-extended index tip gets forced back to the "extended" position.
  for (let i = 0; i < 21; i++) if (!lm[i]) lm[i] = pt(0.5, 0.6); // fill any unused indices so countFingers never reads undefined
  return lm;
}
function frame(fingerCount) { return { multiHandLandmarks: [makeHand(fingerCount)] }; }

// sanity: makeHand actually round-trips through the real countFingers
t('makeHand(n) synthesizes a hand that countFingers reads back as n, for n=0..5', () => {
  for (let n = 0; n <= 5; n++) assert.strictEqual(countFingers(makeHand(n)), n, `expected ${n} fingers`);
});

// ── pickClosestHand (camera-engine.js): pure "pick the biggest/closest hand"
// selector. handSize only reads lm[0] (wrist) and lm[9] (mid-MCP), so these
// fixtures only need those two landmarks set. ──
const handAt = (size) => { const lm = []; lm[0] = { x: 0, y: 0 }; lm[9] = { x: size, y: 0 }; return lm; };

t('pickClosestHand: picks the hand with the larger handSize (closer to camera)', () => {
  const small = handAt(0.12), big = handAt(0.30);
  assert.strictEqual(pickClosestHand([small, big]), big);
  assert.strictEqual(pickClosestHand([big, small]), big); // order-independent
});
t('pickClosestHand: a single hand is returned as-is', () => {
  const only = handAt(0.2);
  assert.strictEqual(pickClosestHand([only]), only);
});
t('pickClosestHand: empty list returns null', () => {
  assert.strictEqual(pickClosestHand([]), null);
});
t('pickClosestHand: sanity — handSize really is bigger for the "big" fixture', () => {
  assert.ok(handSize(handAt(0.30)) > handSize(handAt(0.12)));
});

function deps(overrides = {}) {
  const calls = { hud: [], actGate: [], fingerGate: [], motionGate: [], boothEmit: [] };
  const gd = new GestureDispatcher({
    isRunning: overrides.isRunning || (() => false),
    frozenCheck: overrides.frozenCheck || (() => false),
    boothSummon: overrides.boothSummon || (() => false),
    boothEmit: (x, y, n) => calls.boothEmit.push([x, y, n]),
    hud: (count, has) => calls.hud.push([count, has]),
  });
  return { gd, calls };
}

t('priority 1: an active ritual starves everything else', () => {
  const { gd, calls } = deps();
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  const ritualFrames = [];
  gd.setRitual({ onFrame: (count, has) => ritualFrames.push([count, has]) });
  gd.onHands(frame(3));
  assert.deepStrictEqual(ritualFrames, [[3, true]]);
  assert.strictEqual(calls.hud.length, 0);
  assert.strictEqual(calls.fingerGate.length, 0);
});

t('priority 2: actGate armed + not running → actGate fires, hud does not', () => {
  const { gd, calls } = deps();
  gd.armActGate((count, has) => calls.actGate.push([count, has]));
  gd.onHands(frame(2));
  assert.deepStrictEqual(calls.actGate, [[2, true]]);
  assert.strictEqual(calls.hud.length, 0);
});

t('priority 2 (motion tier): motionGate armed + not running → receives raw lm', () => {
  const { gd, calls } = deps();
  const lm = makeHand(3);
  gd.armMotionGate((lm2, has, count) => calls.motionGate.push([lm2, has, count]));
  gd.onHands({ multiHandLandmarks: [lm] });
  assert.strictEqual(calls.motionGate.length, 1);
  assert.strictEqual(calls.motionGate[0][0], lm);        // same landmark array reference — raw, unprocessed
  assert.strictEqual(calls.motionGate[0][1], true);
  assert.strictEqual(calls.motionGate[0][2], 3);
});

t('isRunning() true skips armed act/motion gates entirely', () => {
  const { gd, calls } = deps({ isRunning: () => true });
  gd.armActGate((count, has) => calls.actGate.push([count, has]));
  gd.onHands(frame(1));
  assert.strictEqual(calls.actGate.length, 0);
  assert.strictEqual(calls.hud.length, 1);                // falls through to hud once actGate is skipped
});

t('frozenCheck() true → no hud, no fingerGate', () => {
  const { gd, calls } = deps({ frozenCheck: () => true });
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  gd.onHands(frame(4));
  assert.strictEqual(calls.hud.length, 0);
  assert.strictEqual(calls.fingerGate.length, 0);
});

t('booth pour: summon armed + open palm (5) emits mirrored x, then still falls through to hud', () => {
  const { gd, calls } = deps({ boothSummon: () => true });
  const lm = makeHand(5);
  gd.onHands({ multiHandLandmarks: [lm] });
  assert.strictEqual(calls.boothEmit.length, 1);
  assert.strictEqual(calls.boothEmit[0][0], 1 - lm[9].x);
  assert.strictEqual(calls.boothEmit[0][1], lm[9].y);
  assert.strictEqual(calls.boothEmit[0][2], 5);
  assert.strictEqual(calls.hud.length, 1, 'booth emit does not early-return — hud must still paint');
});

t('booth pour: summon armed but NOT open palm (count != 5) → no emit', () => {
  const { gd, calls } = deps({ boothSummon: () => true });
  gd.onHands(frame(3));
  assert.strictEqual(calls.boothEmit.length, 0);
  assert.strictEqual(calls.hud.length, 1);
});

t('fingerGate fires last, only when armed, after hud', () => {
  const order = [];
  const gd = new GestureDispatcher({
    isRunning: () => false, frozenCheck: () => false, boothSummon: () => false, boothEmit: () => {},
    hud: () => order.push('hud'),
  });
  gd.armFingerGate(() => order.push('fingerGate'));
  gd.onHands(frame(2));
  assert.deepStrictEqual(order, ['hud', 'fingerGate']);
});

t('fingerGate is NOT called when unarmed (no crash, just absent)', () => {
  const { gd, calls } = deps();
  gd.onHands(frame(2));
  assert.strictEqual(calls.fingerGate.length, 0);
  assert.strictEqual(calls.hud.length, 1);
});

t('onHands: with two detected hands, the CLOSER one (bigger handSize) drives count/lm — the far hand is ignored', () => {
  const { gd, calls } = deps();
  const near = makeHand(1);                        // 1 finger, real countFingers-compatible hand, handSize=0.3 (see makeHand)
  const far = makeHand(5);                          // 5 fingers, but shrunk to look farther away
  const shrink = 0.4;                               // scale every landmark toward the wrist so handSize drops proportionally
  const wrist = far[0];
  for (let i = 0; i < far.length; i++) far[i] = { x: wrist.x + (far[i].x - wrist.x) * shrink, y: wrist.y + (far[i].y - wrist.y) * shrink };
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  gd.onHands({ multiHandLandmarks: [far, near] });   // far listed FIRST — proves it's picked by size, not array order
  assert.strictEqual(calls.fingerGate.length, 1);
  assert.strictEqual(calls.fingerGate[0][0], 1, 'expected the near (bigger) hand\'s finger count (1), not the far hand\'s (5)');
});

// ── onLandmarks: passive observer tap (Feature B seam for the fingertip-fx
// overlay) — fires every frame regardless of which consumer (if any) owns
// the ladder, never consumes, never alters the ladder, and a throwing
// observer must not break anyone else. ──
t('onLandmarks fires even when NOTHING is armed (no ritual/actGate/motionGate/fingerGate)', () => {
  const { gd } = deps();
  const seen = [];
  gd.onLandmarks((lm, has, count) => seen.push([has, count]));
  gd.onHands(frame(3));
  assert.deepStrictEqual(seen, [[true, 3]]);
});

t('onLandmarks fires regardless of which consumer owns the frame (ritual, actGate, motionGate, fingerGate)', () => {
  const { gd, calls } = deps();
  const seen = [];
  gd.onLandmarks((lm, has, count) => seen.push(count));
  gd.setRitual({ onFrame: () => {} });
  gd.onHands(frame(1));
  gd.setRitual(null);
  gd.armActGate(() => {});
  gd.onHands(frame(2));
  gd.disarmActGate();
  gd.armMotionGate(() => {});
  gd.onHands(frame(3));
  gd.disarmMotionGate();
  gd.armFingerGate(() => {});
  gd.onHands(frame(4));
  assert.deepStrictEqual(seen, [1, 2, 3, 4]);
});

t('onLandmarks receives the raw landmark array reference, same as motionGate', () => {
  const { gd } = deps();
  const lm = makeHand(2);
  let seenLm = null;
  gd.onLandmarks(lm2 => { seenLm = lm2; });
  gd.onHands({ multiHandLandmarks: [lm] });
  assert.strictEqual(seenLm, lm);
});

t('onLandmarks never consumes: the normal ladder still runs untouched alongside it', () => {
  const { gd, calls } = deps();
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  gd.onLandmarks(() => {});
  gd.onHands(frame(2));
  assert.deepStrictEqual(calls.fingerGate, [[2, true]]);
  assert.strictEqual(calls.hud.length, 1);
});

t('a throwing onLandmarks observer is caught and does not break the ladder for other observers or consumers', () => {
  const { gd, calls } = deps();
  const order = [];
  gd.onLandmarks(() => { order.push('boom'); throw new Error('observer bug'); });
  gd.onLandmarks(() => { order.push('second'); });
  gd.armFingerGate((count, has) => { order.push('fingerGate'); calls.fingerGate.push([count, has]); });
  assert.doesNotThrow(() => gd.onHands(frame(1)));
  assert.deepStrictEqual(order, ['boom', 'second', 'fingerGate']);
  assert.strictEqual(calls.fingerGate.length, 1);
});

t('onLandmarks: the returned unsubscribe stops further calls', () => {
  const { gd } = deps();
  let n = 0;
  const off = gd.onLandmarks(() => n++);
  gd.onHands(frame(1));
  off();
  gd.onHands(frame(1));
  assert.strictEqual(n, 1);
});

t('no-hand frame with multiHandLandmarks:[] reaches the armed consumer as has=false, count=0', () => {
  const { gd, calls } = deps();
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  gd.onHands({ multiHandLandmarks: [] });
  assert.deepStrictEqual(calls.fingerGate, [[0, false]]);
});

t('no-hand frame missing multiHandLandmarks entirely does not throw, count=0, has=false', () => {
  const { gd, calls } = deps();
  gd.armFingerGate((count, has) => calls.fingerGate.push([count, has]));
  assert.doesNotThrow(() => gd.onHands({}));
  // The old QUIRK here (has=undefined, not false, for a missing key) is gone
  // as a side effect of the multi-hand pickClosestHand refactor: onHands now
  // normalizes via `res.multiHandLandmarks || []` before checking `.length`,
  // so a missing key and an empty array both give a real `false`.
  assert.strictEqual(calls.fingerGate.length, 1);
  assert.strictEqual(calls.fingerGate[0][0], 0);
  assert.strictEqual(calls.fingerGate[0][1], false);
});

// ── end-to-end: arm a real TwoPhaseGate as the dispatcher's motion gate,
// feed synthetic frames through onHands, prove a full arm→capture→swipe
// run resolves through the dispatcher path (no DOM/camera). ──
t('end-to-end: TwoPhaseGate armed as the motion gate resolves a rightward swipe via onHands', () => {
  const { gd } = deps();
  let done = null;
  const gate = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: v => { done = v; gd.disarmMotionGate(); } });
  let now = 0;
  gd.armMotionGate((lm, has, count) => gate.step(now, { lm, has, count }));
  for (; now <= GESTURE_ARM_MS; now += 50) gd.onHands(frame(5));       // ARM: hold open palm
  assert.strictEqual(gate.phase, 'capture');
  // CAPTURE: feed real 21-point hands but with lm[8] (fingertip) driving the swipe; mirrored: 1-lm[8].x goes 0.2→0.8 = rightward
  const start = makeHand(1); start[8] = pt(0.8, 0.5);
  const end = makeHand(1); end[8] = pt(0.2, 0.5);
  now += 50; gd.onHands({ multiHandLandmarks: [start] });
  now += 300; gd.onHands({ multiHandLandmarks: [end] });
  assert.strictEqual(done, 'right');
  assert.strictEqual(gd.motionGateArmed, false);
});

// ── replay: load the checked-in synthetic trace and feed it through a
// fresh dispatcher + TwoPhaseGate at its recorded timestamps, printing
// what resolves. This is the tuning tool for SWIPE_MIN_DIST/TRACK_CATCH_RADIUS
// against real data later — exercised here so it stays wired up. ──
t('replay: traces/synthetic-swipe-right.json resolves a rightward swipe through onHands', () => {
  const tracePath = join(__dirname, 'traces', 'synthetic-swipe-right.json');
  const trace = JSON.parse(readFileSync(tracePath, 'utf8'));
  assert.ok(Array.isArray(trace) && trace.length > 5, 'trace must have frames');
  const { gd } = deps();
  let done = null;
  const gate = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: v => { done = v; gd.disarmMotionGate(); } });
  gd.armMotionGate((lm, has, count) => gate.step(currentT, { lm, has, count }));
  let currentT = 0;
  for (const f of trace) {
    currentT = f.t;
    gd.onHands({ multiHandLandmarks: f.lm ? [f.lm] : [] });
    if (done) break;
  }
  console.log(`    replay resolved: ${done}`);
  assert.strictEqual(done, 'right');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
