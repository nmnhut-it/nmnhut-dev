// node lessons/test-progress-versioning.mjs — pure-function tests for
// progress-versioning.js (no DOM/worker needed, same pattern as
// test-cell-validation.mjs).
// progress-versioning.js is loaded as a plain <script> global in the browser
// (module.exports guarded by `typeof module !== 'undefined'`) — but lessons/
// got a package.json with "type":"module" (2026-07-05, for the Playwright
// harness), so Node now treats every .js here as ESM by default and
// createRequire() silently resolves the file as an empty ESM namespace
// instead of running its CJS guard (no throw — Node 24's require(ESM)
// interop just returns {}). Load it as CommonJS explicitly via the vm
// module instead of relying on file-extension-driven module resolution.
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Wrap-and-run in THIS realm (not vm.runInNewContext, which returns objects
// from a separate realm — assert.deepStrictEqual then fails on prototype
// identity even when structurally identical).
function loadCjs(rel) {
  const filename = path.join(__dirname, rel);
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(filename, 'utf8'))(mod, mod.exports);
  return mod.exports;
}
const { contentVersion, decideResume } = loadCjs('./progress-versioning.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}

const cellsA = [{ npc: 'hi' }, { code: 'print(1)', label: 'a.py' }, { npc: 'bye' }];
const cellsB = [{ npc: 'hi' }, { code: 'print(2)', label: 'a.py' }, { npc: 'bye' }]; // one field changed

t('matching version resumes at saved index', () => {
  const v = contentVersion(cellsA);
  const r = decideResume({ savedVersion: v, currentVersion: v, savedIndex: 1, currentCellCount: cellsA.length });
  assert.deepStrictEqual(r, { resume: true, index: 1 });
});
t('mismatched version resets to 0', () => {
  const vSaved = contentVersion(cellsA), vNow = contentVersion(cellsB);
  const r = decideResume({ savedVersion: vSaved, currentVersion: vNow, savedIndex: 1, currentCellCount: cellsB.length });
  assert.deepStrictEqual(r, { resume: false, index: 0 });
});
t('matching version but out-of-range saved index clamps/resets', () => {
  const v = contentVersion(cellsA);
  const r1 = decideResume({ savedVersion: v, currentVersion: v, savedIndex: 99, currentCellCount: cellsA.length });
  assert.deepStrictEqual(r1, { resume: false, index: 0 });
  const r2 = decideResume({ savedVersion: v, currentVersion: v, savedIndex: -3, currentCellCount: cellsA.length });
  assert.deepStrictEqual(r2, { resume: false, index: 0 });
  const r3 = decideResume({ savedVersion: v, currentVersion: v, savedIndex: cellsA.length, currentCellCount: cellsA.length });
  assert.deepStrictEqual(r3, { resume: false, index: 0 });
});
t('hash stability — same content produces same version twice', () => {
  assert.strictEqual(contentVersion(cellsA), contentVersion(cellsA));
  assert.strictEqual(contentVersion(cellsA), contentVersion(JSON.parse(JSON.stringify(cellsA))));
});
t('hash sensitivity — changed content produces different version', () => {
  assert.notStrictEqual(contentVersion(cellsA), contentVersion(cellsB));
});
t('savedIndex of 0 (default) does not count as a resume', () => {
  const v = contentVersion(cellsA);
  const r = decideResume({ savedVersion: v, currentVersion: v, savedIndex: 0, currentCellCount: cellsA.length });
  assert.deepStrictEqual(r, { resume: false, index: 0 });
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
