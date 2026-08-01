// node lessons/test-tower-state.mjs — pure-function tests for tower-state.js
// (no DOM/worker needed). Mirrors test-cell-validation.mjs's loadCjs pattern
// (lessons/ is "type":"module" but tower-state.js is a CJS-guarded bare
// global — see that file's header for why plain require() can't be used).
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function loadCjs(rel) {
  const filename = path.join(__dirname, rel);
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(filename, 'utf8'))(mod, mod.exports);
  return mod.exports;
}
const { TowerState, loadTowerState, saveTowerState, clearTowerState, towerStorageKey, START_LIVES, FLOOR_SCORE } = loadCjs('./tower-state.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}

t('fresh state starts at floor 1, full lives, zero score, not over', () => {
  const s = new TowerState();
  assert.strictEqual(s.floor, 1); assert.strictEqual(s.lives, START_LIVES);
  assert.strictEqual(s.score, 0); assert.strictEqual(s.over, false); assert.strictEqual(s.won, false);
});
t('recordMiss() costs exactly one life', () => {
  const s = new TowerState(); s.recordMiss();
  assert.strictEqual(s.lives, START_LIVES - 1); assert.strictEqual(s.over, false);
});
t('recordMiss() down to 0 lives ends the run as over (not won)', () => {
  const s = new TowerState({ lives: 1 }); s.recordMiss();
  assert.strictEqual(s.lives, 0); assert.strictEqual(s.over, true); assert.strictEqual(s.won, false);
});
t('recordMiss() after the run is already over is a no-op (no negative lives)', () => {
  const s = new TowerState({ lives: 0, over: true }); s.recordMiss();
  assert.strictEqual(s.lives, 0);
});
t('recordFloorClear() advances the floor and awards points scaled by floor', () => {
  const s = new TowerState({ floor: 3, score: 0 }); s.recordFloorClear(20);
  assert.strictEqual(s.floor, 4); assert.strictEqual(s.score, FLOOR_SCORE * 3); assert.strictEqual(s.over, false);
});
t('recordFloorClear() at the top floor ends the run as won, does not advance past it', () => {
  const s = new TowerState({ floor: 20 }); s.recordFloorClear(20);
  assert.strictEqual(s.floor, 20); assert.strictEqual(s.over, true); assert.strictEqual(s.won, true);
});
t('recordFloorClear() after the run is over is a no-op', () => {
  const s = new TowerState({ floor: 5, over: true, won: true }); s.recordFloorClear(20);
  assert.strictEqual(s.floor, 5); assert.strictEqual(s.score, 0);
});
t('toJSON()/fromJSON() round-trips exactly', () => {
  const s = new TowerState({ lives: 2, floor: 7, score: 900, over: false, won: false });
  const round = TowerState.fromJSON(s.toJSON());
  assert.deepStrictEqual(round.toJSON(), s.toJSON());
});
t('loadTowerState() with no saved data returns a fresh state', () => {
  globalThis.localStorage = { store: {}, getItem(k) { return this.store[k] ?? null; }, setItem(k, v) { this.store[k] = String(v); }, removeItem(k) { delete this.store[k]; } };
  clearTowerState();
  const s = loadTowerState('v1');
  assert.strictEqual(s.floor, 1); assert.strictEqual(s.lives, START_LIVES);
});
t('saveTowerState()/loadTowerState() round-trips when the version matches', () => {
  const s = new TowerState({ lives: 1, floor: 12, score: 4200 });
  saveTowerState(s, 'v1');
  const loaded = loadTowerState('v1');
  assert.deepStrictEqual(loaded.toJSON(), s.toJSON());
});
t('loadTowerState() resets on a version mismatch (content changed since save)', () => {
  const s = new TowerState({ lives: 1, floor: 12, score: 4200 });
  saveTowerState(s, 'v1');
  const loaded = loadTowerState('v2-different-content');
  assert.strictEqual(loaded.floor, 1); assert.strictEqual(loaded.lives, START_LIVES);
});
t('loadTowerState() tolerates corrupt JSON in storage (falls back to fresh)', () => {
  localStorage.setItem('magicdust.tower.progress', '{not valid json');
  const loaded = loadTowerState('v1');
  assert.strictEqual(loaded.floor, 1);
});
t('clearTowerState() removes the saved run', () => {
  saveTowerState(new TowerState({ floor: 9 }), 'v1');
  clearTowerState();
  const loaded = loadTowerState('v1');
  assert.strictEqual(loaded.floor, 1);
});

t('different tower ids use different storage keys', () => {
  assert.notStrictEqual(towerStorageKey('tower'), towerStorageKey('towerINFERNO'));
  assert.strictEqual(towerStorageKey('towerINFERNO'), 'magicdust.tower.progress.towerINFERNO');
});

t('two tower runs persist independently', () => {
  clearTowerState('tower'); clearTowerState('towerINFERNO');
  saveTowerState(new TowerState({ floor: 4 }), 'v1', 'tower');
  saveTowerState(new TowerState({ floor: 9 }), 'v1', 'towerINFERNO');
  assert.strictEqual(loadTowerState('v1', 'tower').floor, 4);
  assert.strictEqual(loadTowerState('v1', 'towerINFERNO').floor, 9);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
