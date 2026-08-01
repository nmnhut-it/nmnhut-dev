// node lessons/test-bypass-registry.mjs — pins bypass-registry.js: the
// Space-cheat stack (register/fire/unregister), the cheat-mode gate, and
// installBypassKey's guards (typing in inputs/editors must never fire it).
import assert from 'node:assert';
import { registerBypass, fireBypass, setCheatOn, isCheatOn, clearAllBypasses, currentBypassLabel, installBypassKey } from './engine/bypass-registry.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
function reset() { clearAllBypasses(); setCheatOn(false); }

t('fireBypass() with nothing registered returns false, does not throw', () => {
  reset();
  assert.strictEqual(fireBypass(), false);
});

t('registerBypass then fireBypass invokes resolve exactly once', () => {
  reset();
  let n = 0;
  registerBypass('x', () => n++);
  assert.strictEqual(fireBypass(), true);
  assert.strictEqual(n, 1);
});

t('a later registration shadows an earlier one (stack, not queue) — fireBypass calls the most recent', () => {
  reset();
  const order = [];
  registerBypass('first', () => order.push('first'));
  registerBypass('second', () => order.push('second'));
  assert.strictEqual(currentBypassLabel(), 'second');
  fireBypass();
  assert.deepStrictEqual(order, ['second']);
});

t('unregister removes only its own entry, by identity — a stale unregister after something newer replaced it is a no-op', () => {
  reset();
  const order = [];
  const offFirst = registerBypass('first', () => order.push('first'));
  registerBypass('second', () => order.push('second'));
  offFirst();                                    // first already isn't on top; this must not touch 'second'
  assert.strictEqual(currentBypassLabel(), 'second');
  fireBypass();
  assert.deepStrictEqual(order, ['second']);
});

t('unregister of the top entry restores the previous one underneath (real stack semantics)', () => {
  reset();
  const order = [];
  registerBypass('first', () => order.push('first'));
  const offSecond = registerBypass('second', () => order.push('second'));
  offSecond();
  assert.strictEqual(currentBypassLabel(), 'first');
  fireBypass();
  assert.deepStrictEqual(order, ['first']);
});

t('setCheatOn/isCheatOn round-trip', () => {
  setCheatOn(false); assert.strictEqual(isCheatOn(), false);
  setCheatOn(true); assert.strictEqual(isCheatOn(), true);
  setCheatOn(false); assert.strictEqual(isCheatOn(), false);
});

// ── installBypassKey — needs a minimal DOM shim (no jsdom dependency in this
// project; a tiny fake EventTarget-shaped `document`/`addEventListener` is
// enough to pin the guard logic). ──
function fakeGlobalKeydown() {
  let handler = null;
  global.addEventListener = (type, fn) => { if (type === 'keydown') handler = fn; };
  return { fire: e => handler(e) };
}

t('installBypassKey: Space fires the bypass when cheat mode is on and focus is not in an input', () => {
  reset(); setCheatOn(true);
  const { fire } = fakeGlobalKeydown();
  let fired = 0, resolved = 0;
  registerBypass('x', () => resolved++);
  installBypassKey(() => fired++);
  let prevented = false;
  fire({ code: 'Space', target: { tagName: 'DIV' }, preventDefault: () => { prevented = true; } });
  assert.strictEqual(resolved, 1);
  assert.strictEqual(fired, 1);
  assert.strictEqual(prevented, true);
});

t('installBypassKey: Space does NOT fire when cheat mode is off', () => {
  reset(); setCheatOn(false);
  const { fire } = fakeGlobalKeydown();
  let resolved = 0, fired = 0;
  registerBypass('x', () => resolved++);
  installBypassKey(() => fired++);
  fire({ code: 'Space', target: { tagName: 'DIV' }, preventDefault: () => {} });
  assert.strictEqual(resolved, 0);
  assert.strictEqual(fired, 0);
});

t('installBypassKey: Space typed into an INPUT/TEXTAREA never fires, even with cheat on', () => {
  reset(); setCheatOn(true);
  const { fire } = fakeGlobalKeydown();
  let resolved = 0;
  registerBypass('x', () => resolved++);
  installBypassKey(() => {});
  fire({ code: 'Space', target: { tagName: 'INPUT' }, preventDefault: () => {} });
  fire({ code: 'Space', target: { tagName: 'TEXTAREA' }, preventDefault: () => {} });
  assert.strictEqual(resolved, 0);
});

t('installBypassKey: Space inside a code-cell editor (.monaco-editor) never fires', () => {
  reset(); setCheatOn(true);
  const { fire } = fakeGlobalKeydown();
  let resolved = 0;
  registerBypass('x', () => resolved++);
  installBypassKey(() => {});
  const editorNode = { tagName: 'DIV', closest: sel => sel.includes('.monaco-editor') ? editorNode : null };
  fire({ code: 'Space', target: editorNode, preventDefault: () => {} });
  assert.strictEqual(resolved, 0);
});

t('installBypassKey: non-Space keys never fire the bypass', () => {
  reset(); setCheatOn(true);
  const { fire } = fakeGlobalKeydown();
  let resolved = 0;
  registerBypass('x', () => resolved++);
  installBypassKey(() => {});
  fire({ code: 'Enter', target: { tagName: 'DIV' }, preventDefault: () => {} });
  assert.strictEqual(resolved, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
