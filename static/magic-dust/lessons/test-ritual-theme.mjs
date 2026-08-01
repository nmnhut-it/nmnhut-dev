// node lessons/test-ritual-theme.mjs — pure-function tests for
// engine/ritual-theme.js's resolveTheme/themeIssues (no DOM/canvas needed;
// the particle rendering itself is verified by eye, per RITUAL-VARIANTS-PLAN.md §A).
import assert from 'node:assert';
import { resolveTheme, themeIssues, DEFAULT_THEME, RITUAL_THEMES } from './engine/ritual-theme.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}

t('resolveTheme(undefined) matches DEFAULT_THEME exactly (backward compat)', () => {
  assert.deepStrictEqual(resolveTheme(undefined), DEFAULT_THEME);
});
t('resolveTheme(null) also matches DEFAULT_THEME', () => {
  assert.deepStrictEqual(resolveTheme(null), DEFAULT_THEME);
});
t('resolveTheme(undefined) circle is a fresh clone, not the DEFAULT_THEME.circle reference', () => {
  const r = resolveTheme(undefined); assert.notStrictEqual(r.circle, DEFAULT_THEME.circle);
});
t('resolveTheme("pulse") pulls the preset and fills the rest from defaults', () => {
  const r = resolveTheme('pulse');
  assert.strictEqual(r.motion, 'pulse'); assert.strictEqual(r.circle.poly, 'square'); assert.strictEqual(r.circle.rings, 2);
  assert.strictEqual(r.glyphs, DEFAULT_THEME.glyphs); assert.strictEqual(r.palette, null);
});
t('resolveTheme(unknown preset name) fails safe to DEFAULT_THEME', () => {
  assert.deepStrictEqual(resolveTheme('nonexistent'), DEFAULT_THEME);
});
t('resolveTheme(partial object) merges over defaults, keeps unset keys', () => {
  const r = resolveTheme({ glyphs: 'say', glow: 1.3 });
  assert.strictEqual(r.glyphs, 'say'); assert.strictEqual(r.glow, 1.3); assert.strictEqual(r.motion, 'orbit'); assert.strictEqual(r.circle.rings, 3);
});
t('resolveTheme(object naming a known motion) seeds from that preset, then applies overrides', () => {
  const r = resolveTheme({ motion: 'comet', glyphs: 'while' });
  assert.strictEqual(r.circle.poly, 'penta'); assert.strictEqual(r.glyphs, 'while'); assert.strictEqual(r.glow, RITUAL_THEMES.comet.glow);
});
t('resolveTheme(object) explicit circle keys win over the seeded preset', () => {
  const r = resolveTheme({ motion: 'rain', circle: { spin: 2.5 } });
  assert.strictEqual(r.circle.spin, 2.5); assert.strictEqual(r.circle.poly, 'none'); // 'poly' still comes from the rain preset
});
t('resolveTheme(object) explicit palette wins over a seeded preset palette', () => {
  const r = resolveTheme({ motion: 'pulse', palette: { core: '#183f49' } });
  assert.deepStrictEqual(r.palette, { core: '#183f49' });
});

t('themeIssues(undefined) — no issues (absent theme is always legal)', () => {
  assert.deepStrictEqual(themeIssues(undefined), []);
});
t('themeIssues(known preset name) — no issues', () => {
  assert.deepStrictEqual(themeIssues('spiral-in'), []);
});
t('themeIssues(unknown preset name) — one issue', () => {
  assert.strictEqual(themeIssues('nonexistent-preset').length, 1);
});
t('themeIssues(valid object) — no issues', () => {
  assert.deepStrictEqual(themeIssues({ motion: 'pulse', glow: 1.2, circle: { poly: 'square', rings: 2, spin: 1 } }), []);
});
t('themeIssues — unknown top-level key is an error', () => {
  assert.ok(themeIssues({ bogus: 1 }).some(m => m.includes('bogus')));
});
t('themeIssues — unknown motion name is an error', () => {
  assert.ok(themeIssues({ motion: 'teleport' }).some(m => m.includes('motion')));
});
t('themeIssues — unknown circle.poly is an error', () => {
  assert.ok(themeIssues({ circle: { poly: 'hexagon' } }).some(m => m.includes('poly')));
});
t('themeIssues — unknown circle key is an error', () => {
  assert.ok(themeIssues({ circle: { radius: 5 } }).some(m => m.includes('radius')));
});
t('themeIssues — unknown palette key is an error', () => {
  assert.ok(themeIssues({ palette: { accent: '#fffdf5' } }).some(m => m.includes('accent')));
});
t('themeIssues — non-object, non-string theme is an error', () => {
  assert.strictEqual(themeIssues(42).length, 1);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
