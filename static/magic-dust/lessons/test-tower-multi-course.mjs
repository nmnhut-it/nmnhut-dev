import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import inferno from './content/towerINFERNO.js';
import standardio from './content/towerSTANDARDIO.js';
import operators from './content/towerOPERATORS.js';
import loopcontrol from './content/towerLOOPCONTROL.js';
import collections from './content/towerCOLLECTIONS.js';
import dictionaries from './content/towerDICTIONARIES.js';
import errors from './content/towerERRORS.js';

const floors = inferno.cells.filter(cell => Number.isInteger(cell.floorNum));
const codeFloors = floors.filter(cell => typeof cell.code === 'string');
const bossFloors = floors.filter(cell => cell.boss);

assert.strictEqual(inferno.sideIslandId, 'towerINFERNO');
assert.deepStrictEqual(floors.map(cell => cell.floorNum), Array.from({ length: 15 }, (_, i) => i + 1), 'inferno floors should be contiguous from 1 to 15');
assert.strictEqual(codeFloors.length, 12, 'inferno should contain twelve coding floors');
assert.strictEqual(bossFloors.length, 3, 'inferno should contain one boss every five floors');
for (const cell of codeFloors) {
  assert.ok(cell.solution && cell.expectOut, `${cell.label} needs a solution and output contract`);
  assert.ok(Array.isArray(cell.solutionExplanation) && cell.solutionExplanation.length >= 4, `${cell.label} needs line-by-line explanation`);
  const lineCount = cell.solution.split(/\r?\n/).length;
  for (const item of cell.solutionExplanation) assert.ok(item.line >= 1 && item.line <= lineCount, `${cell.label} explanation points to an existing line`);
}

const branchTowers = [standardio, operators, loopcontrol, collections, dictionaries, errors];
for (const tower of branchTowers) {
  const towerFloors = tower.cells.filter(cell => Number.isInteger(cell.floorNum));
  const towerCode = towerFloors.filter(cell => typeof cell.code === 'string');
  const towerBosses = towerFloors.filter(cell => cell.boss);
  assert.deepStrictEqual(towerFloors.map(cell => cell.floorNum), Array.from({ length: 10 }, (_, i) => i + 1), `${tower.sideIslandId} floors should be contiguous from 1 to 10`);
  assert.strictEqual(towerCode.length, 8, `${tower.sideIslandId} should have eight code floors`);
  assert.deepStrictEqual(towerBosses.map(cell => cell.floorNum), [5, 10], `${tower.sideIslandId} should have bosses at floors 5 and 10`);
  for (const cell of towerCode) {
    const nonBlank = cell.solution.split(/\r?\n/).map((line, index) => line.trim() ? index + 1 : null).filter(Boolean);
    const explained = cell.solutionExplanation.map(item => item.line);
    assert.deepStrictEqual(explained, nonBlank, `${cell.label} should have a curated explanation for every non-blank solution line`);
    assert.ok(cell.solutionExplanation.every(item => !/thực hiện thao tác Python này|dòng này thực hiện/i.test(item.text)), `${cell.label} should not contain generic line explanations`);
  }
}

const towerHtml = readFileSync(new URL('./tower.html', import.meta.url), 'utf8');
assert.match(towerHtml, /inferno:\s*'\.\/content\/towerINFERNO\.js'/, 'tower loader should expose the inferno course');
for (const course of ['standardio', 'operators', 'loopcontrol', 'collections', 'dictionaries', 'errors']) {
  assert.match(towerHtml, new RegExp(`${course}:\\s*'\\.\\/content\\/tower`, 'i'), `tower loader should expose ${course}`);
}

const saga = readFileSync(new URL('./saga.js', import.meta.url), 'utf8');
assert.match(saga, /id: 'towerINFERNO'[\s\S]*?branchFrom: 10[\s\S]*?featured: true/, 'saga should expose inferno as a featured branch after node10');
assert.match(saga, /id: 'tower'[\s\S]*?unlockAt: 21/, 'endgame tower should wait until dictionary prerequisites are complete');
for (const id of ['STANDARDIO', 'OPERATORS', 'LOOPCONTROL', 'COLLECTIONS', 'DICTIONARIES', 'ERRORS']) {
  assert.match(saga, new RegExp(`id: 'branch${id}'[^\\n]*kind: 'learning-branch'`), `saga should expose branch${id} as a learning branch`);
  assert.match(saga, new RegExp(`id: 'tower${id}'[^\\n]*requiresSide: 'branch${id}'`), `tower${id} should require its teaching branch`);
}

console.log('multi-course tower checks passed');
