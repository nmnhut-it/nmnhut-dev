import assert from 'node:assert/strict';
import { deriveProgramCounterPrediction, normalizeProgramCounter, traceProgramCounter } from './engine/program-counter-cell.js';

const normalized = normalizeProgramCounter({
  title: 'Hai thẻ',
  start: 10,
  end: 99,
  observeMs: 9999,
  history: true,
  cards: [
    { number: 10, output: 'BOOT', goto: 20 },
    { number: 20, output: 'OPEN', goto: 99 },
  ],
});
assert.equal(normalized.observeMs, 4000);
assert.equal(normalized.history, true);
assert.deepEqual(normalized.cards.map(card => card.number), [10, 20]);

const { steps } = traceProgramCounter(normalized);
assert.deepEqual(steps.map(step => step.phase), ['start', 'select', 'output', 'goto', 'select', 'output', 'goto']);
assert.deepEqual(steps.map(step => step.pc), [10, 10, 10, 20, 20, 20, 99]);
assert.deepEqual(steps.at(-1).output, ['BOOT', 'OPEN']);
const predictions = steps.map((step, index) => deriveProgramCounterPrediction(step, steps[index - 1], normalized));
assert.equal(predictions[0], null, 'startup explanation does not ask a trivial prediction');
assert.equal(predictions[1].options[predictions[1].correct], 'Thẻ 10');
assert.equal(predictions[2].options[predictions[2].correct], 'BOOT');
assert.equal(predictions[3].options[predictions[3].correct], 'pc = 20');
assert.match(steps.at(-1).message, /END.*không tìm thẻ 99/i);

const missing = traceProgramCounter({ cards: [{ number: 10, output: 'A', goto: 30 }] }).steps;
assert.equal(missing.at(-1).phase, 'missing');
assert.equal(missing.at(-1).pc, 30);

const branch = traceProgramCounter({ cards: [
  { number: 10, test: 'ready', result: false, yes: 20, no: 30 },
  { number: 20, output: 'YES', goto: 99 },
  { number: 30, output: 'NO', goto: 99 },
] }).steps;
assert.deepEqual(branch.filter(step => step.phase === 'select').map(step => step.card), [10, 30]);
const testStep = branch.find(step => step.phase === 'test');
assert.equal(deriveProgramCounterPrediction(testStep, branch[branch.indexOf(testStep) - 1], normalized).options[1], 'SAI');
assert.match(branch.find(step => step.phase === 'test').memory, /ready.*SAI/);

const scripted = traceProgramCounter({
  cards: [{ number: 10, action: 'count = count - 1', goto: 10 }],
  frames: [{ phase: 'action', pc: 10, card: 10, output: [], memory: 'count = 1', message: 'Giảm count.' }],
}).steps;
assert.equal(scripted.length, 1);
assert.equal(scripted[0].memory, 'count = 1');
assert.equal(deriveProgramCounterPrediction(scripted[0], null, normalized).options[0], 'count = 1');

console.log('program-counter cell: output, TEST branches, ACTION state, custom frames and missing-card state pass');
