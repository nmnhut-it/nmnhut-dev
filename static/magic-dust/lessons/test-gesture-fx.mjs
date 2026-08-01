// node lessons/test-gesture-fx.mjs — pure glyph-particle math tests for
// engine/gesture-ui.js's FingertipFxPainter (spawn/age/step), the piece
// that fell out as testable when the fingertip FX was upgraded from plain
// glow dots to mini magic circles + emitting rune glyphs. No canvas/DOM
// needed — spawnGlyphParticle/stepGlyphParticles are dt-driven, no
// wall-clock reads inside.
import assert from 'node:assert';
import { spawnGlyphParticle, stepGlyphParticles, FINGER_STYLE, SHAPES } from './engine/gesture-ui.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

t('spawnGlyphParticle starts at the given point with age 0', () => {
  const p = spawnGlyphParticle(10, 20, 'A', () => .5);
  assert.strictEqual(p.x, 10); assert.strictEqual(p.y, 20); assert.strictEqual(p.age, 0); assert.strictEqual(p.ch, 'A');
  assert.ok(p.life > 0);
});

t('spawnGlyphParticle drifts mostly upward (negative vy)', () => {
  const p = spawnGlyphParticle(0, 0, 'X', () => .5);   // rand()=.5 → no angle spread
  assert.ok(p.vy < 0, `expected upward drift, got vy=${p.vy}`);
});

t('stepGlyphParticles advances position/age by dt and does not mutate input', () => {
  const list = [{ x: 0, y: 0, vx: 10, vy: -10, age: 0, life: 1, ch: 'a', rot: 0, vrot: 1 }];
  const next = stepGlyphParticles(list, .5);
  assert.strictEqual(list[0].x, 0);           // original untouched
  assert.strictEqual(next[0].x, 5); assert.strictEqual(next[0].y, -5);
  assert.strictEqual(next[0].age, .5);
  assert.strictEqual(next[0].rot, .5);
});

t('stepGlyphParticles drops particles once age reaches their life', () => {
  const list = [{ x: 0, y: 0, vx: 0, vy: 0, age: .9, life: 1, ch: 'a', rot: 0, vrot: 0 }];
  const next = stepGlyphParticles(list, .2);
  assert.strictEqual(next.length, 0);
});

t('stepGlyphParticles keeps particles still under their life', () => {
  const list = [{ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, ch: 'a', rot: 0, vrot: 0 }];
  const next = stepGlyphParticles(list, .3);
  assert.strictEqual(next.length, 1);
});

t('stepGlyphParticles on an empty list stays empty', () => {
  assert.deepStrictEqual(stepGlyphParticles([], .5), []);
});

// ── 5-distinct-magic-circles (owner 2026-07-04, "5 ngón tay nên có 5 mào
// magic circle khác nhau") — FINGER_STYLE/SHAPES pure-data assertions.
// drawMiniCircle itself needs a canvas ctx (covered by browser verification),
// but the SELECTION of shape/hue/spin-direction per fingertip is plain data
// and fully testable here without one. ──
const FINGER_IDX = [4, 8, 12, 16, 20];

t('FINGER_STYLE defines all 5 fingertips (thumb/index/middle/ring/pinky)', () => {
  FINGER_IDX.forEach(i => assert.ok(FINGER_STYLE[i], `missing FINGER_STYLE for landmark ${i}`));
});

t('every fingertip has a genuinely different shape — no two share one', () => {
  const shapes = FINGER_IDX.map(i => FINGER_STYLE[i].shape);
  assert.strictEqual(new Set(shapes).size, shapes.length, `expected 5 distinct shapes, got ${shapes.join(',')}`);
});

t('every fingertip has a distinct glyph and a distinct hue (double-checks the pre-existing hue-only variation still holds)', () => {
  const glyphs = FINGER_IDX.map(i => FINGER_STYLE[i].glyph), hues = FINGER_IDX.map(i => FINGER_STYLE[i].hue);
  assert.strictEqual(new Set(glyphs).size, glyphs.length, 'glyphs must all differ');
  assert.strictEqual(new Set(hues).size, hues.length, 'hues must all differ');
});

t('not every fingertip spins the same direction (neighbors visibly counter-rotate)', () => {
  const dirs = new Set(FINGER_IDX.map(i => FINGER_STYLE[i].dir ?? 1));
  assert.ok(dirs.size > 1, 'expected at least two different spin directions across the 5 fingertips');
});

t('SHAPES: every FINGER_STYLE shape key resolves to a known entry in SHAPES', () => {
  FINGER_IDX.forEach(i => assert.ok(Object.prototype.hasOwnProperty.call(SHAPES, FINGER_STYLE[i].shape), `unknown shape "${FINGER_STYLE[i].shape}"`));
});

t('SHAPES: square/triangle have polygon vertices, ring/rings are polygon-free (pure ring look)', () => {
  assert.strictEqual(SHAPES.square.length, 4);
  assert.strictEqual(SHAPES.triangle.length, 3);
  assert.strictEqual(SHAPES.ring.length, 0);
  assert.strictEqual(SHAPES.rings.length, 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
