import assert from 'node:assert/strict';
import { derivePrediction, normalizeCodeTrace } from './engine/code-trace-cell.js';

const trace = normalizeCodeTrace({
  title: 'Kiểu dữ liệu',
  code: ['value = "5"', 'show(value)'],
  frames: [
    { line: 1, explain: 'Gán chuỗi.', observeMs: 1500, state: { variables: { value: '"5"' }, output: [], visual: { kind: 'value' } } },
    { line: 9, explain: 'In chuỗi.', observeMs: 9999, state: { output: ['5'] } },
  ],
});

assert.equal(trace.title, 'Kiểu dữ liệu');
assert.deepEqual(trace.code, ['value = "5"', 'show(value)']);
assert.equal(trace.frames[0].line, 1);
assert.equal(trace.frames[1].line, 2, 'frame line clamps to visible source');
assert.equal(trace.frames[1].observeMs, 4000, 'observation delay is bounded');
assert.deepEqual(trace.frames[0].state.variables, { value: '"5"' });
assert.deepEqual(trace.frames[1].state.output, ['5']);
assert.match(trace.frames[0].predict.q, /`value`/);
assert.equal(trace.frames[0].predict.options[trace.frames[0].predict.correct], '"5"');
assert.match(trace.frames[1].predict.q, /OUTPUT/);
assert.equal(trace.frames[1].predict.options[trace.frames[1].predict.correct], '5');
assert.equal(derivePrediction({ line: 1, state: { variables: {}, output: [] } }), null, 'preparation lines without a state change do not force a trivial prediction');

console.log('execution cell: state snapshots, observation delay and active-recall predictions normalize correctly');
