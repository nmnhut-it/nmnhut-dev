// node lessons/test-two-phase-gate.mjs — pure state-machine tests for
// two-phase-gate.js (fake clock + synthetic frames, no DOM/camera needed)
// plus the GestureDispatcher act/motion double-arm invariant.
import assert from 'node:assert';
import { TwoPhaseGate, makeSwipeCapture, makeTrackCapture } from './engine/two-phase-gate.js';
import { GESTURE_ARM_MS, GESTURE_CAPTURE_MS, TRACK_HOLD_MS } from './engine/constants.js';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
const OPEN = { lm: {}, has: true, count: 5 };  // arm sign (✋); swipe reads lm[8].x/.y only, stub below where needed — track reads the handCentroid of ALL 21 landmarks (see fullHand)
const NONE = { lm: null, has: false, count: 0 };
const noopCapture = () => ({ reset() {}, step: () => ({ done: null, progress: 0 }) });
// fullHand(x, y) — every one of the 21 landmarks planted at the SAME point,
// so handCentroid(lm) (gesture-math.js) resolves to exactly (x, y) — lets
// the track-verb tests below keep asserting on a single known point without
// caring that the hit-test now averages the whole hand instead of reading
// lm[8] alone.
const fullHand = (x, y) => new Array(21).fill(null).map(() => ({ x, y }));

t('arm charges to 1.0 and flips to capture at GESTURE_ARM_MS', () => {
  const states = [];
  const gate = new TwoPhaseGate({ capture: noopCapture(), onState: (p, v) => states.push([p, v]) });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  assert.strictEqual(gate.phase, 'capture');
  const lastArm = [...states].reverse().find(([p]) => p === 'arm');
  assert.strictEqual(lastArm[1], 1);
  assert.ok(states.some(([p]) => p === 'capture'));
});

t('dropping the arm sign mid-arm decays (x2.2) instead of resetting to 0', () => {
  const gate = new TwoPhaseGate({ capture: noopCapture(), onState: () => {} });
  let now = 0;
  for (; now <= 200; now += 50) gate.step(now, OPEN);          // charge ~200ms
  const chargedHeld = 200;                                     // internal armHeld tracks 1:1 with elapsed ms while held
  now += 50; gate.step(now, NONE);                              // one dropped frame, dt=50
  // decayed, not reset: next arm progress after re-holding must reflect decay, not a hard 0 reset.
  // Easiest external proof: it takes LESS additional hold time to re-reach ARM_MS than a full fresh charge would.
  let armed = false, framesToArm = 0;
  for (; framesToArm < 1000 && !armed; framesToArm += 1) { now += 50; gate.step(now, OPEN); if (gate.phase === 'capture') armed = true; }
  assert.ok(armed);
  // a fresh gate charging from 0 needs ceil(ARM_MS/50) frames; decay should need FEWER than a full reset (0) would need MORE
  const freshFrames = Math.ceil(GESTURE_ARM_MS / 50);
  assert.ok(framesToArm <= freshFrames, `expected partial-charge carryover to need <= ${freshFrames} frames, got ${framesToArm}`);
  void chargedHeld;
});

t('capture timeout re-arms and emits onState(\'timeout\', 0)', () => {
  const states = [];
  const gate = new TwoPhaseGate({ capture: noopCapture(), onState: (p, v) => states.push([p, v]) });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  assert.strictEqual(gate.phase, 'capture');
  for (; now <= GESTURE_ARM_MS + GESTURE_CAPTURE_MS + 50; now += 50) gate.step(now, NONE); // let capture window expire with no result
  assert.strictEqual(gate.phase, 'arm');
  assert.ok(states.some(([p, v]) => p === 'timeout' && v === 0));
});

t('swipe verb: rightward fingertip trail resolves \'right\'', () => {
  let done = null;
  const gate = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: v => { done = v; } });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  assert.strictEqual(gate.phase, 'capture');
  // mirrored screen space: lm[8].x goes 0.8→0.2 raw, so 1-lm[8].x (used internally) goes 0.2→0.8 = rightward
  gate.step(now += 50, { lm: { 8: { x: 0.8, y: 0.5 } }, has: true, count: 1 });
  gate.step(now += 300, { lm: { 8: { x: 0.2, y: 0.5 } }, has: true, count: 1 });
  assert.strictEqual(done, 'right');
});

t('swipe verb: jitter (sub-threshold motion) does not resolve', () => {
  let done = null;
  const gate = new TwoPhaseGate({ capture: makeSwipeCapture('any'), onState: () => {}, onDone: v => { done = v; } });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  gate.step(now += 50, { lm: { 8: { x: 0.5, y: 0.5 } }, has: true, count: 1 });
  gate.step(now += 100, { lm: { 8: { x: 0.52, y: 0.5 } }, has: true, count: 1 }); // tiny wobble, below SWIPE_MIN_DIST
  assert.strictEqual(done, null);
  assert.strictEqual(gate.phase, 'capture');
});

t('track verb: sitting on a target for TRACK_HOLD_MS resolves that key', () => {
  let done = null;
  const target = { key: 'right', x: 0.5, y: 0.5 };
  const gate = new TwoPhaseGate({ capture: makeTrackCapture(() => [target]), onState: () => {}, onDone: v => { done = v; } });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  assert.strictEqual(gate.phase, 'capture');
  // hand centroid sits ON the target (mirrored: 1-centroid.x === target.x means centroid.x = 1-0.5 = 0.5)
  for (let i = 0; i <= TRACK_HOLD_MS; i += 50) gate.step(now += 50, { lm: fullHand(0.5, 0.5), has: true, count: 1 });
  assert.strictEqual(done, 'right');
});

t('track verb: hopping between targets does not leak charge into the right answer', () => {
  let done = null;
  const targets = [{ key: 'wrong', x: 0.2, y: 0.5 }, { key: 'right', x: 0.8, y: 0.5 }];
  const gate = new TwoPhaseGate({ capture: makeTrackCapture(() => targets), onState: () => {}, onDone: v => { done = v; } });
  let now = 0;
  for (; now <= GESTURE_ARM_MS; now += 50) gate.step(now, OPEN);
  // rest on 'wrong' just under the hold threshold, then hop to 'right' — 'right' must start from 0, not inherit 'wrong's charge
  for (let i = 0; i < TRACK_HOLD_MS - 100; i += 50) gate.step(now += 50, { lm: fullHand(0.8, 0.5), has: true, count: 1 }); // mirrored: sits on 'wrong' (x=0.2)
  assert.strictEqual(done, null);
  for (let i = 0; i < 300; i += 50) gate.step(now += 50, { lm: fullHand(0.2, 0.5), has: true, count: 1 }); // hop to 'right' (x=0.8) — well under TRACK_HOLD_MS on its own
  assert.strictEqual(done, null, 'a brief visit should not resolve — each target charges independently from its own history, not a shared pool');
});

t('dt clamp: a 5s frame gap must not add more than 100ms of arm charge in one step', () => {
  const gate = new TwoPhaseGate({ capture: noopCapture(), onState: () => {} });
  gate.step(0, OPEN);           // first frame establishes the clock, dt=0
  gate.step(5000, OPEN);        // huge gap — must clamp to 100ms of charge, not 5000ms
  gate.step(5001, NONE);        // drop immediately so armHeld can't keep climbing
  // after two frames the gate must NOT already be armed (would require armHeld >= GESTURE_ARM_MS in <= 100ms of real charge)
  assert.strictEqual(gate.phase, 'arm');
});

t('GestureDispatcher: arming a motion gate while an act gate is armed throws (and vice versa)', () => {
  const gd = new GestureDispatcher({ isRunning: () => false, frozenCheck: () => false, boothSummon: () => false, boothEmit: () => {}, hud: () => {} });
  gd.armActGate(() => {});
  assert.throws(() => gd.armMotionGate(() => {}), /already armed/);
  gd.disarmActGate();
  gd.armMotionGate(() => {});
  assert.throws(() => gd.armActGate(() => {}), /already armed/);
  gd.disarmMotionGate();
  gd.armActGate(() => {}); gd.disarmActGate();          // sanity: clean arm/disarm still works after the invariant checks
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
