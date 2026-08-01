import assert from 'node:assert/strict';
import fs from 'node:fs';

const mod = { exports: {} };
new Function('module', 'exports', fs.readFileSync(new URL('./cell-validation.js', import.meta.url), 'utf8'))(mod, mod.exports);
const { cellOutputSatisfies } = mod.exports;
const lesson = (await import('./content/islandPHOTOLIGHTS.js')).default;

assert.equal(lesson.cameraFree, true, 'the whole island must opt out of camera gates');
const thirdBulb = lesson.cells.find(cell => cell.label === 'tu_dat_bong_thu_ba.py');
const correct = [
  { kind: 'studio_start', text: '{"action":"light_board_start"}' },
  { kind: 'studio_start', text: '{"action":"light_board_bulb","x":35,"y":50,"color":"yellow"}' },
  { kind: 'studio_start', text: '{"action":"light_board_bulb","x":65,"y":50,"color":"blue"}' },
  { kind: 'studio_start', text: '{"action":"light_board_bulb","x":50,"y":25,"color":"green"}' },
  { kind: 'studio_start', text: '{"action":"delay","seconds":2}' },
];
assert.equal(cellOutputSatisfies(thirdBulb.expectOut, correct), true, 'the authored solution must pass with exactly five bridge events');
const unchanged = correct.map(event => ({ ...event, text: event.text.replace('"y":25', '"y":50') }));
assert.equal(cellOutputSatisfies(thirdBulb.expectOut, unchanged), false, 'leaving the third bulb on the same row must fail');

const continued = lesson.cells.find(cell => cell.label === 'walk_ba_bong').walkthrough;
assert.deepEqual(continued.executedLines, [1, 2, 3]);
assert.equal(continued.code.length, 4); assert.equal(continued.steps[0].line, 4);
console.log('  ok — camera-free island accepts the five-event third-bulb solution and preserves prior code in the next cell');
