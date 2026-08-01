import assert from 'node:assert/strict';
import node13 from './content/node13.js';
import node14 from './content/node14.js';
import node15 from './content/node15.js';

const byLabel = (lesson, label) => lesson.cells.find(cell => cell.label === label);
const checkExecution = (lesson, label) => {
  const cell = byLabel(lesson, label)?.execution;
  assert.ok(cell, `node${lesson.index}: missing execution ${label}`);
  assert.ok(Array.isArray(cell.code) && cell.code.length > 0, `${label}: full code must stay visible`);
  assert.ok(Array.isArray(cell.frames) && cell.frames.length > 0, `${label}: frames are required`);
  for (const frame of cell.frames) {
    assert.ok(frame.line >= 1 && frame.line <= cell.code.length, `${label}: frame must point to a real Python line`);
    assert.ok(frame.observeMs >= 1200, `${label}: learner needs observation time`);
    assert.equal(frame.state?.visual?.kind, 'value', `${label}: only the shipped value renderer is allowed`);
  }
  return cell;
};

for (const label of ['list_build_first_boxes', 'list_update_one_box_steps', 'list_last_index_steps']) checkExecution(node13, label);
assert.deepEqual(byLabel(node13, 'list_build_first_boxes').execution.frames.at(-1).state.variables.a, '[4, 9, 2]');
assert.equal(byLabel(node13, 'list_last_index_steps').execution.frames.at(-1).state.variables.last_index, '2');

for (const label of ['scan_total_steps', 'scan_count_steps', 'scan_best_steps', 'scan_found_steps']) checkExecution(node14, label);
assert.equal(byLabel(node14, 'scan_total_steps').execution.frames.at(-1).state.variables.result, '12');
assert.equal(byLabel(node14, 'scan_count_steps').execution.frames.at(-1).state.variables.result, '2');
assert.equal(byLabel(node14, 'scan_best_steps').execution.frames.at(-1).state.variables.result, '9');
assert.equal(byLabel(node14, 'scan_found_steps').execution.frames.at(-1).state.variables.result, 'True');

for (const label of ['grid_from_one_cell_steps', 'grid_row_column_steps', 'grid_nested_loop_steps']) checkExecution(node15, label);
assert.equal(byLabel(node15, 'grid_from_one_cell_steps').execution.frames.at(-1).state.variables.grid, '[[7]]');
assert.equal(byLabel(node15, 'grid_row_column_steps').execution.frames.at(-1).state.variables.same_value, '9');
assert.equal(byLabel(node15, 'grid_nested_loop_steps').execution.frames.at(-1).state.variables.result, '10');

const restored = {
  13: ['imp_first_box.py', 'imp_wrong_update.py', 'imp_final_last.py'],
  14: ['count_even_demo.py', 'count_even_fix.py', 'shade_sum_start.py', 'shade_max_sign.py', 'shade_final_count_even.py'],
  15: ['shade_row_col.py', 'shade_wrong_row_sum.py', 'shade_final_count_grid.py'],
};
for (const lesson of [node13, node14, node15]) {
  for (const label of restored[lesson.index]) {
    const cell = byLabel(lesson, label);
    assert.ok(cell?.code && cell?.solution && cell?.expectOut, `node${lesson.index}: historical exercise ${label} must be restored as a complete code task`);
  }
}

assert.ok(node13.cells.indexOf(byLabel(node13, 'list_build_first_boxes')) < node13.cells.indexOf(byLabel(node13, 'list_three_boxes.py')));
assert.ok(node14.cells.indexOf(byLabel(node14, 'scan_total_steps')) < node14.cells.indexOf(byLabel(node14, 'scan_sum_demo.py')));
assert.ok(node15.cells.indexOf(byLabel(node15, 'grid_nested_loop_steps')) < node15.cells.indexOf(byLabel(node15, 'grid_total_demo.py')));

console.log('node13-15 guided content: cumulative code, observable state and restored historical practice pass');
