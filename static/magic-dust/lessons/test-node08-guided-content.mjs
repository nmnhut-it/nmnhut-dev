import assert from 'node:assert/strict';
import N from './content/node08v2.js';

const index = N.cells.findIndex(cell => cell.label === 'types_first_steps');
const cell = N.cells[index]?.execution;
assert.ok(cell, 'node08v2 must contain the first guided execution');
assert.equal(N.cells.slice(0, index).some(item => item.code !== undefined), false, 'guided experience must precede editable code');
assert.deepEqual(cell.code, [
  'from old_computer import say, say_num', '', 'text_result = "5" + "3"',
  'number_result = 5 + 3', 'say(text_result)', 'say_num(number_result)',
]);
assert.deepEqual(cell.frames.map(frame => frame.line), [1, 3, 4, 5, 6]);
assert.ok(cell.frames.every(frame => frame.observeMs >= 1200));
assert.deepEqual(cell.frames.at(-1).state.output, ['53', '8']);
assert.deepEqual(cell.frames.at(-1).state.visual.items.map(item => item.type), ['str', 'int']);
assert.ok(N.cells.findIndex(item => item.label === 'type_probe.py') > index, 'learner edits type() only after the guided model');
console.log('node08 guided content: smallest correct example and full state progression pass');
