// node lessons/test-cell-validation.mjs — pure-function tests for cell-validation.js
// (no DOM/worker needed; node.js itself can't be require()d standalone since it touches
// document/window at load time, so this exercises cellOutputSatisfies in isolation).
// cell-validation.js is loaded as a plain <script> global in the browser
// (module.exports guarded by `typeof module !== 'undefined'`) — but lessons/
// got a package.json with "type":"module" (2026-07-05, for the Playwright
// harness), so Node now treats every .js here as ESM by default and
// createRequire() silently resolves the file as an empty ESM namespace
// instead of running its CJS guard (no throw — Node 24's require(ESM)
// interop just returns {}). Load it as CommonJS explicitly instead of
// relying on file-extension-driven module resolution — see
// test-progress-versioning.mjs's loadCjs for the same fix.
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
const { cellOutputSatisfies, expectOutHint } = loadCjs('./cell-validation.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}

t('string substring match (case-insensitive)', () => {
  assert.ok(cellOutputSatisfies('tamer!', [{ kind: 'terminal', text: 'Rex the dragon tamer!' }]));
});
t('regex match', () => {
  assert.ok(cellOutputSatisfies(/conjure/i, [{ kind: 'terminal', text: '✨ conjure!' }]));
});
t('array of options — any match (OR)', () => {
  assert.ok(cellOutputSatisfies([/frost/i, /fire/i], [{ kind: 'spell', text: 'fire' }]));
});
t('no match fails correctly', () => {
  assert.strictEqual(cellOutputSatisfies(/conjure/i, [{ kind: 'terminal', text: 'nope' }]), false);
});
t('held-count map — branch 1 selected', () => {
  const exp = { 1: /fire/i, 3: /light/i, 4: /dark/i };
  assert.ok(cellOutputSatisfies(exp, [{ kind: 'spell', text: 'fire' }], 1));
});
t('held-count map — branch 3 selected', () => {
  const exp = { 1: /fire/i, 3: /light/i, 4: /dark/i };
  assert.ok(cellOutputSatisfies(exp, [{ kind: 'screen', text: 'lighten' }], 3));
});
t('held-count map — branch 4 selected, wrong output fails', () => {
  const exp = { 1: /fire/i, 3: /light/i, 4: /dark/i };
  assert.strictEqual(cellOutputSatisfies(exp, [{ kind: 'screen', text: 'lighten' }], 4), false);
});
t('held-count map — missing key passes (no expectation for that branch)', () => {
  const exp = { 1: /fire/i };
  assert.ok(cellOutputSatisfies(exp, [], 3));
});
t('empty captured array fails a regex expectation', () => {
  assert.strictEqual(cellOutputSatisfies(/conjure/i, []), false);
});
t('null expectOut always passes', () => {
  assert.ok(cellOutputSatisfies(null, []));
});
t('{all:[...]} — every entry must match (AND), all present passes', () => {
  const exp = { all: [/x 1 =/, /x 2 =/] };
  assert.ok(cellOutputSatisfies(exp, [{ kind: 'terminal', text: '3 x 1 = 3' }, { kind: 'terminal', text: '3 x 2 = 6' }]));
});
t('{all:[...]} — missing one entry fails', () => {
  const exp = { all: [/x 1 =/, /x 2 =/] };
  assert.strictEqual(cellOutputSatisfies(exp, [{ kind: 'terminal', text: '3 x 1 = 3' }]), false);
});
t('{minLines:N} — enough captured lines passes regardless of content', () => {
  const exp = { minLines: 2 };
  assert.ok(cellOutputSatisfies(exp, [{ kind: 'terminal', text: 'Hello, Lan!' }, { kind: 'terminal', text: 'anything at all' }]));
});
t('{minLines:N} — too few captured lines fails', () => {
  const exp = { minLines: 2 };
  assert.strictEqual(cellOutputSatisfies(exp, [{ kind: 'terminal', text: 'Hello, Lan!' }]), false);
});
t('{kind,minCount,text} counts only matching valid frame events', () => {
  const exp = { kind: 'image_frame', minCount: 2, text: /"image"\s*:\s*\[\[/ };
  const captured = [
    { kind: 'hand_position', text: '{"action":"hand_position"}' },
    { kind: 'image_frame', text: '{"action":"image_frame","image":null}' },
    { kind: 'image_frame', text: '{"action":"image_frame","image":[[[0,0,0,0]]]}' },
    { kind: 'delay', text: '{"seconds":0.3}' },
  ];
  assert.strictEqual(cellOutputSatisfies(exp, captured), false);
  captured.push({ kind: 'image_frame', text: '{"action":"image_frame","image":[[[255,0,0,255]]]}' });
  assert.ok(cellOutputSatisfies(exp, captured));
});
t('expectOutHint {kind,minCount,text} reports matching frame progress', () => {
  const hint = expectOutHint({ kind: 'image_frame', minCount: 8, text: /\[\[/ }, [
    { kind: 'image_frame', text: '{"image":[[]]}' },
    { kind: 'delay', text: 'waited' },
  ]);
  assert.ok(/8/.test(hint) && /1/.test(hint), `hint should name both 8 and 1, got: ${hint}`);
});

t('expectOutHint {minLines:N} names the actual N and how many the run had', () => {
  const exp = { minLines: 2 };
  const hint = expectOutHint(exp, [{ kind: 'terminal', text: 'only one line' }]);
  assert.ok(/2/.test(hint) && /1/.test(hint), `hint should name both 2 and 1, got: ${hint}`);
});
t('expectOutHint {minLines:N} on zero captured lines still names N', () => {
  const exp = { minLines: 3 };
  const hint = expectOutHint(exp, []);
  assert.ok(/3/.test(hint), `hint should name 3, got: ${hint}`);
});
t('expectOutHint string/regex/array gives a general nudge (no leaked answer)', () => {
  assert.ok(typeof expectOutHint(/conjure/i, []) === 'string');
  assert.ok(typeof expectOutHint('conjure', []) === 'string');
  assert.ok(typeof expectOutHint([/a/, /b/], []) === 'string');
});
t('expectOutHint {heldCount} map gives a gesture-specific nudge', () => {
  const exp = { 1: /fire/i, 3: /light/i };
  const hint = expectOutHint(exp, [{ kind: 'spell', text: 'wrong' }], 1);
  assert.ok(typeof hint === 'string' && hint.length > 0);
});
t('expectOutHint {all:[...]} surfaces the failing sub-hint (minLines part)', () => {
  const exp = { all: [{ minLines: 2 }, /xin chao/i] };
  const hint = expectOutHint(exp, [{ kind: 'terminal', text: 'xin chao' }]);
  assert.ok(/2/.test(hint) && /1/.test(hint), `hint should surface the minLines gap, got: ${hint}`);
});
t('expectOutHint returns null when expectOut is null (unaffected cells)', () => {
  assert.strictEqual(expectOutHint(null, []), null);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
