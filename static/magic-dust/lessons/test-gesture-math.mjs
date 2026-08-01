// node lessons/test-gesture-math.mjs — pure-function tests for gesture-math.js
// (no DOM/camera needed; exercises detectSwipe/trackDistance in isolation).
import assert from 'node:assert';
import { detectSwipe, trackDistance, gridCellAt, smoothLandmarks, handCentroid, coverMap } from './engine/gesture-math.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.message}`); }
}
const hist = pts => pts.map(([x, y, t]) => ({ x, y, t }));

t('detectSwipe — not enough samples returns null', () => {
  assert.strictEqual(detectSwipe(hist([[0.5, 0.5, 0]])), null);
});
t('detectSwipe — clear rightward motion detected as right', () => {
  assert.strictEqual(detectSwipe(hist([[0.2, 0.5, 0], [0.6, 0.5, 300]])), 'right');
});
t('detectSwipe — clear leftward motion detected as left', () => {
  assert.strictEqual(detectSwipe(hist([[0.6, 0.5, 0], [0.2, 0.5, 300]])), 'left');
});
t('detectSwipe — clear downward motion detected as down', () => {
  assert.strictEqual(detectSwipe(hist([[0.5, 0.2, 0], [0.5, 0.6, 300]])), 'down');
});
t('detectSwipe — small jitter below threshold returns null', () => {
  assert.strictEqual(detectSwipe(hist([[0.5, 0.5, 0], [0.52, 0.5, 300]])), null);
});
t("detectSwipe — axis:'x' ignores a vertical-only motion", () => {
  assert.strictEqual(detectSwipe(hist([[0.5, 0.2, 0], [0.5, 0.6, 300]]), 'x'), null);
});
t("detectSwipe — axis:'x' still detects horizontal motion", () => {
  assert.strictEqual(detectSwipe(hist([[0.2, 0.5, 0], [0.6, 0.5, 300]]), 'x'), 'right');
});
t('detectSwipe — only samples within SWIPE_MAX_MS of the newest count (stale start ignored)', () => {
  // a huge jump 5s ago shouldn't count; only the recent, sub-threshold wiggle should
  assert.strictEqual(detectSwipe(hist([[0.05, 0.5, 0], [0.5, 0.5, 5000], [0.52, 0.5, 5300]])), null);
});
t('trackDistance — zero for identical points', () => {
  assert.strictEqual(trackDistance(0.3, 0.4, 0.3, 0.4), 0);
});
t('trackDistance — matches Euclidean distance (3-4-5 triangle)', () => {
  assert.strictEqual(trackDistance(0, 0, 0.3, 0.4), 0.5);
});

t('gridCellAt — maps a 3x3 grid left-to-right, top-to-bottom', () => {
  assert.deepStrictEqual(gridCellAt(0.1, 0.1, 3, 3), { row: 1, col: 1, cell: 1 });
  assert.deepStrictEqual(gridCellAt(0.5, 0.5, 3, 3), { row: 2, col: 2, cell: 5 });
  assert.deepStrictEqual(gridCellAt(0.9, 0.9, 3, 3), { row: 3, col: 3, cell: 9 });
});
t('gridCellAt — clamps border values into the nearest valid cell', () => {
  assert.deepStrictEqual(gridCellAt(1, 1, 3, 3), { row: 3, col: 3, cell: 9 });
  assert.deepStrictEqual(gridCellAt(-0.2, 1.4, 2, 4), { row: 2, col: 1, cell: 5 });
});

t('smoothLandmarks — no previous frame returns raw unchanged', () => {
  const raw = [{ x: 0.5, y: 0.5 }];
  assert.strictEqual(smoothLandmarks(null, raw, 0.5), raw);
});
t('smoothLandmarks — blends toward raw by alpha, does not jump straight to it', () => {
  const prev = [{ x: 0, y: 0 }];
  const raw = [{ x: 1, y: 0 }];
  const out = smoothLandmarks(prev, raw, 0.5);
  assert.strictEqual(out[0].x, 0.5); // 0 + (1-0)*0.5
});
t('smoothLandmarks — alpha=1 is an alias for raw (no smoothing lag)', () => {
  const prev = [{ x: 0, y: 0 }];
  const raw = [{ x: 1, y: 0.3 }];
  const out = smoothLandmarks(prev, raw, 1);
  assert.strictEqual(out[0].x, 1); assert.strictEqual(out[0].y, 0.3);
});
t('smoothLandmarks — converges toward raw over repeated frames', () => {
  let prev = [{ x: 0, y: 0 }];
  const raw = [{ x: 1, y: 0 }];
  for (let i = 0; i < 20; i++) prev = smoothLandmarks(prev, raw, 0.55);
  assert.ok(Math.abs(prev[0].x - 1) < 0.001, `expected convergence near 1, got ${prev[0].x}`);
});

t('handCentroid — all points identical returns that point', () => {
  const lm = new Array(21).fill(null).map(() => ({ x: 0.4, y: 0.6 }));
  const c = handCentroid(lm);
  assert.ok(Math.abs(c.x - 0.4) < 1e-9); assert.ok(Math.abs(c.y - 0.6) < 1e-9);
});
t('handCentroid — simple average of two points', () => {
  const c = handCentroid([{ x: 0, y: 0 }, { x: 1, y: 0.5 }]);
  assert.strictEqual(c.x, 0.5); assert.strictEqual(c.y, 0.25);
});
t('handCentroid — a single jittery landmark moves the centroid far less than moving the whole hand', () => {
  const base = new Array(21).fill(null).map(() => ({ x: 0.5, y: 0.5 }));
  const oneJitters = base.map((p, i) => i === 8 ? { x: 0.7, y: 0.5 } : p); // only landmark 8 (fingertip) wiggles
  const wholeHandMoves = base.map(p => ({ x: p.x + 0.2, y: p.y }));        // every landmark shifts together
  const cJitter = handCentroid(oneJitters), cMove = handCentroid(wholeHandMoves);
  assert.ok(Math.abs(cJitter.x - 0.5) < Math.abs(cMove.x - 0.5), 'single-landmark jitter should move the centroid less than whole-hand translation');
});

// ── coverMap (object-fit:cover landmark→canvas mapping, see gesture-ui.js's
// FingertipFxPainter — the fix for "circles land in the wrong place") ──
t('coverMap — video-center always maps to canvas-center, any aspect', () => {
  const cases = [[100, 100, 480, 360], [480, 360, 480, 360], [1920, 1080, 480, 360], [300, 900, 480, 360]];
  for (const [w, h, vw, vh] of cases) {
    const p = coverMap(0.5, 0.5, w, h, vw, vh);
    assert.ok(Math.abs(p.x - w / 2) < 1e-9, `x center mismatch for ${w}x${h} from ${vw}x${vh}`);
    assert.ok(Math.abs(p.y - h / 2) < 1e-9, `y center mismatch for ${w}x${h} from ${vw}x${vh}`);
  }
});
t('coverMap — same aspect ratio (canvas == source aspect) is a plain scale, no crop', () => {
  const p = coverMap(0.25, 0.75, 480, 360, 480, 360);
  assert.ok(Math.abs(p.x - 120) < 1e-9); assert.ok(Math.abs(p.y - 270) < 1e-9);
});
t('coverMap — canvas wider (relative to its height) than the source: source cropped top/bottom, x fills exactly', () => {
  // source 480x360 (aspect 1.333) into a 960x360 canvas (aspect 2.667 > source) —
  // cover scales up to fill the WIDTH (the binding axis), overflowing height → crops y
  const left = coverMap(0, 0.5, 960, 360, 480, 360);
  assert.ok(Math.abs(left.x - 0) < 1e-9, 'x=0 should land exactly on the left edge, uncropped');
  const top = coverMap(0.5, 0, 960, 360, 480, 360);
  assert.ok(top.y < 0, 'top of source should be cropped off above the canvas (negative y)');
});
t('coverMap — canvas narrower (relative to its height) than the source: source cropped left/right, y fills exactly', () => {
  // source 480x360 (aspect 1.333) into a 480x720 canvas (aspect 0.667 < source) —
  // cover scales up to fill the HEIGHT (the binding axis), overflowing width → crops x
  const top = coverMap(0.5, 0, 480, 720, 480, 360);
  assert.ok(Math.abs(top.y - 0) < 1e-9, 'y=0 should land exactly on the top edge, uncropped');
  const left = coverMap(0, 0.5, 480, 720, 480, 360);
  assert.ok(left.x < 0, 'left of source should be cropped off to the left of the canvas (negative x)');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
