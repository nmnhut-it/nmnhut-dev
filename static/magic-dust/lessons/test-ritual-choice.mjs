// node lessons/test-ritual-choice.mjs — pure state-machine tests for
// gesture-ui.js's HoldChoiceGate (KICKOFF-PLAN.md Part B: ritual
// word-choice). Fake clock + synthetic (count, has) frames, no DOM/camera
// needed — mirrors test-two-phase-gate.mjs's approach to TwoPhaseGate.
import assert from 'node:assert';
import { HoldChoiceGate } from './engine/gesture-ui.js';
import { QUIZ_HOLD_MS } from './engine/constants.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

t('charges to a pick at hold-time (holding option N for holdMs resolves N)', () => {
  const gate = new HoldChoiceGate(2, 0, QUIZ_HOLD_MS);      // 2 options, option 0 ("1 finger") is correct
  let now = 0, res = null;
  for (; now <= QUIZ_HOLD_MS && !res; now += 50) res = gate.step(now, 1, true);
  assert.ok(res);
  assert.deepStrictEqual(res, { idx: 0, ok: true });
  assert.strictEqual(gate.resolved, true);
});

t('switching fingers mid-hold resets the charge (no partial carryover)', () => {
  const gate = new HoldChoiceGate(2, 1, QUIZ_HOLD_MS);      // option 1 ("2 fingers") is correct
  let now = 0;
  for (; now <= QUIZ_HOLD_MS * 0.6; now += 50) gate.step(now, 1, true);  // charge option 0 partway
  assert.ok(gate.progress > 0.3);
  now += 50; gate.step(now, 2, true);                       // switch target — hard reset, not soft decay
  assert.strictEqual(gate.target, 1);
  assert.strictEqual(gate.progress, 0);
});

t('losing the hand (has=false) also resets the charge, no soft decay for choice', () => {
  const gate = new HoldChoiceGate(2, 0, QUIZ_HOLD_MS);
  let now = 0;
  for (; now <= QUIZ_HOLD_MS * 0.5; now += 50) gate.step(now, 1, true);
  assert.ok(gate.progress > 0);
  now += 50; gate.step(now, 1, false);
  assert.strictEqual(gate.target, -1);
  assert.strictEqual(gate.progress, 0);
});

t('a wrong pick does not resolve the gate — it stays live for a retry', () => {
  const gate = new HoldChoiceGate(3, 2, QUIZ_HOLD_MS);      // correct = option 2 ("3 fingers")
  const res = gate.pick(0);                                 // tap the wrong option
  assert.deepStrictEqual(res, { idx: 0, ok: false });
  assert.strictEqual(gate.resolved, false);
  // still resolvable afterwards — never a dead end
  const res2 = gate.pick(2);
  assert.deepStrictEqual(res2, { idx: 2, ok: true });
  assert.strictEqual(gate.resolved, true);
});

t('a wrong hold also doesn\'t resolve, and the same option can still hold-charge to correct after', () => {
  const gate = new HoldChoiceGate(2, 1, QUIZ_HOLD_MS);
  let now = 0, res = null;
  for (; now <= QUIZ_HOLD_MS && !res; now += 50) res = gate.step(now, 1, true);   // hold the WRONG option to completion
  assert.deepStrictEqual(res, { idx: 0, ok: false });
  assert.strictEqual(gate.resolved, false);
  now += 50; res = null;
  for (; now <= QUIZ_HOLD_MS * 3 && !res; now += 50) res = gate.step(now, 2, true); // now hold the correct one
  assert.deepStrictEqual(res, { idx: 1, ok: true });
  assert.strictEqual(gate.resolved, true);
});

t('once resolved, further steps/picks are no-ops (resolves exactly once)', () => {
  const gate = new HoldChoiceGate(2, 0, QUIZ_HOLD_MS);
  assert.deepStrictEqual(gate.pick(0), { idx: 0, ok: true });
  assert.strictEqual(gate.pick(1), null);
  assert.strictEqual(gate.step(9999, 2, true), null);
});

t('tap path resolves independent of any camera/hold state', () => {
  const gate = new HoldChoiceGate(3, 1, QUIZ_HOLD_MS);
  // no step() ever called (no camera) — tap alone must resolve
  const res = gate.pick(1);
  assert.deepStrictEqual(res, { idx: 1, ok: true });
  assert.strictEqual(gate.resolved, true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
