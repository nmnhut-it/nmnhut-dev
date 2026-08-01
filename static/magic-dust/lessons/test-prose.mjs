// node lessons/test-prose.mjs — pure-function tests for prose.js (no DOM
// needed; exercises renderProse/segmentsOf in isolation).
import assert from 'node:assert';
import { renderProse, segmentsOf } from './engine/prose.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}

t('no backticks — passthrough unchanged (plain escape only)', () => {
  assert.strictEqual(renderProse('hello world'), 'hello world');
});
t('escapes bare < and > (the a + b < 6 case)', () => {
  assert.strictEqual(renderProse('a + b < 6'), 'a + b &lt; 6');
});
t('escapes & and quotes', () => {
  assert.strictEqual(renderProse('cats & "dogs"'), 'cats &amp; &quot;dogs&quot;');
});
t('inline code renders as a code chip', () => {
  assert.strictEqual(renderProse('use `say()` here'), 'use <code class="ic">say()</code> here');
});
t('inline code preserves and escapes special chars inside backticks', () => {
  assert.strictEqual(renderProse('`if finger == 1:`'), '<code class="ic">if finger == 1:</code>');
});
t('inline code with < inside backticks is escaped, not raw HTML', () => {
  assert.strictEqual(renderProse('`a + b < 6`'), '<code class="ic">a + b &lt; 6</code>');
});
t('multiple inline code spans on one line', () => {
  assert.strictEqual(renderProse('`a` and `b`'), '<code class="ic">a</code> and <code class="ic">b</code>');
});
t('fenced block renders as a pre/code block, preserving newlines', () => {
  const out = renderProse('before\n```\nif x:\n    y()\n```\nafter');
  assert.ok(out.includes('<pre class="cb"><code>'), out);
  assert.ok(out.includes('<span class="tok-kw">if</span>'), out);
  assert.ok(out.includes('\n    <span class="tok-fn">y</span>'), out);
  assert.ok(out.includes('</code></pre>'), out);
  assert.ok(out.startsWith('before'));
  assert.ok(out.endsWith('after'));
});
t('fenced block content is escaped too', () => {
  const out = renderProse('```\na < b\n```');
  assert.ok(out.includes('a <span class="tok-op">&lt;</span> b'), out);
  assert.ok(!out.includes('a < b'), out);
});
t('mixed inline + fenced + escaping in one string', () => {
  const out = renderProse('Try `x = 1` then:\n```\nif x < 2:\n    win()\n```\nDone.');
  assert.ok(out.includes('<code class="ic">x = 1</code>'));
  assert.ok(out.includes('<span class="tok-kw">if</span> x <span class="tok-op">&lt;</span> <span class="tok-num">2</span><span class="tok-op">:</span>\n    <span class="tok-fn">win</span><span class="tok-op">(</span><span class="tok-op">)</span>'));
  assert.ok(out.includes('Done.'));
});
t('blank line becomes a paragraph break', () => {
  const out = renderProse('first\n\nsecond');
  assert.strictEqual(out, 'first</p><p>second');
});
t('single newline becomes a <br>', () => {
  assert.strictEqual(renderProse('first\nsecond'), 'first<br>second');
});
t('bold passthrough', () => {
  assert.strictEqual(renderProse('**important**'), '<b>important</b>');
});
t('unmatched single backtick is left as a literal escaped char (no crash)', () => {
  assert.strictEqual(renderProse('a `b'), 'a `b');
});
t('segmentsOf splits text/code/block segments', () => {
  const segs = segmentsOf('a `b` c');
  assert.deepStrictEqual(segs.map(s => s.type), ['text', 'code', 'text']);
});
t('empty/null input renders empty string', () => {
  assert.strictEqual(renderProse(''), '');
  assert.strictEqual(renderProse(null), '');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
