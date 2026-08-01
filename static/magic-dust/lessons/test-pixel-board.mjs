// node lessons/test-pixel-board.mjs — the maths behind the hand-editing board
// (engine/plates.js). Pure functions, no DOM: selection rectangles, the
// clamped +/- that mirrors the lesson's own max(0,...)/min(255,...) loop, and
// the challenge that stops a learner clicking past without touching a number.
import assert from 'node:assert';
import { copyGrid, inBox, selectionBox, shiftRegion, taskProgress } from './engine/plates.js';

const SIDE = 4;
const build = value => Array.from({ length: SIDE }, () => Array.from({ length: SIDE }, () => [value, value, value]));

// -- selection: a rectangle, dragged in any direction, clamped to the grid ----
assert.deepEqual(selectionBox({ row: 1, col: 1 }, { row: 2, col: 3 }, SIDE, SIDE), { row0: 1, row1: 2, col0: 1, col1: 3, cells: 6 });
assert.deepEqual(selectionBox({ row: 2, col: 3 }, { row: 1, col: 1 }, SIDE, SIDE), { row0: 1, row1: 2, col0: 1, col1: 3, cells: 6 }, 'dragging up-left selects the same box');
assert.deepEqual(selectionBox({ row: 0, col: 0 }, { row: 99, col: 99 }, SIDE, SIDE), { row0: 0, row1: 3, col0: 0, col1: 3, cells: 16 }, 'a drag off the edge stops at the edge');
assert.equal(selectionBox(null, { row: 0, col: 0 }, SIDE, SIDE), null);
const box = selectionBox({ row: 1, col: 1 }, { row: 2, col: 2 }, SIDE, SIDE);
assert.equal(inBox(box, 1, 2), true);
assert.equal(inBox(box, 0, 2), false);

// -- shifting: only the selection moves, and it clamps at both ends ----------
const grid = build(100);
shiftRegion(grid, box, 50);
assert.deepEqual(grid[1][1], [150, 150, 150]);
assert.deepEqual(grid[0][0], [100, 100, 100], 'cells outside the selection are untouched');
shiftRegion(grid, box, -500);
assert.deepEqual(grid[1][1], [0, 0, 0], 'subtracting past 0 stops at 0, never negative');
shiftRegion(grid, box, 999);
assert.deepEqual(grid[1][1], [255, 255, 255], 'adding past 255 stops at 255');
const untouched = build(10);
assert.deepEqual(shiftRegion(untouched, null, 50), build(10), 'no selection, no change');

// -- the challenge -----------------------------------------------------------
const before = build(200);
const half = { col0: 0, col1: 1 };                       // "nửa trái"
const task = { mode: 'dim', amount: 100, region: half };
assert.deepEqual(taskProgress(before, copyGrid(before), task), { done: false, moved: 0, total: 8 });

const partly = copyGrid(before);
shiftRegion(partly, { row0: 0, row1: 1, col0: 0, col1: 1 }, -100);
assert.deepEqual(taskProgress(before, partly, task), { done: false, moved: 4, total: 8 }, 'half the region is not the region');

const all = copyGrid(before);
shiftRegion(all, { row0: 0, row1: 3, col0: 0, col1: 1 }, -100);
assert.equal(taskProgress(before, all, task).done, true);

const wrongWay = copyGrid(before);
shiftRegion(wrongWay, { row0: 0, row1: 3, col0: 0, col1: 1 }, 100);
assert.equal(taskProgress(before, wrongWay, task).done, false, 'brightening does not satisfy a dim challenge');

const outside = copyGrid(before);
shiftRegion(outside, { row0: 0, row1: 3, col0: 2, col1: 3 }, -200);
assert.equal(taskProgress(before, outside, task).done, false, 'darkening the OTHER half is not the task');

// a real plate is mostly dark: a cell at 30 cannot drop 100, but pushing it to
// 0 is everything the learner can do, so the floor counts as satisfied
const dark = build(200);
dark[0][0] = [30, 30, 30];
// clamping is per channel, so a cell whose channels differ is only "all the
// way down" once EVERY channel reached 0 — [0, 10, 0] still has light in it
const uneven = build(200);
uneven[0][0] = [10, 60, 30];
const oncePressed = copyGrid(uneven);
shiftRegion(oncePressed, { row0: 0, row1: 3, col0: 0, col1: 1 }, -50);
assert.deepEqual(oncePressed[0][0], [0, 10, 0]);
assert.equal(taskProgress(uneven, oncePressed, task).done, false, 'a channel still lit is not "hết cỡ"');
const twicePressed = copyGrid(oncePressed);
shiftRegion(twicePressed, { row0: 0, row1: 3, col0: 0, col1: 1 }, -50);
assert.equal(taskProgress(uneven, twicePressed, task).done, true, 'every channel at 0 counts, however small the drop was');
const dimmed = copyGrid(dark);
shiftRegion(dimmed, { row0: 0, row1: 3, col0: 0, col1: 1 }, -100);
assert.equal(taskProgress(dark, dimmed, task).done, true, 'a cell driven to 0 counts however far it fell');
const notQuite = copyGrid(dark);
shiftRegion(notQuite, { row0: 0, row1: 3, col0: 0, col1: 1 }, -50);
assert.equal(taskProgress(dark, notQuite, task).done, false, 'one press is not enough for the cells that can still fall');

// no region: any move anywhere counts; no task at all: nothing to do
const anywhere = copyGrid(before);
shiftRegion(anywhere, { row0: 3, row1: 3, col0: 3, col1: 3 }, -100);
assert.equal(taskProgress(before, anywhere, { mode: 'dim', amount: 100 }).done, true);
assert.equal(taskProgress(before, copyGrid(before), null).done, true);

// -- copyGrid really copies (the board must be able to show the original) ----
const original = build(120), working = copyGrid(original);
shiftRegion(working, selectionBox({ row: 0, col: 0 }, { row: 3, col: 3 }, SIDE, SIDE), -50);
assert.deepEqual(original[0][0], [120, 120, 120]);

console.log('pixel-board: all assertions passed');
