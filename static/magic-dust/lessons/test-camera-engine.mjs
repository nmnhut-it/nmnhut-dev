// node lessons/test-camera-engine.mjs — regression test for the "giơ 1 nó
// không nhận" bug (owner: holding just the index finger for a node06
// exercise wasn't registering as count===1). Root cause: camera-engine.js's
// thumbUp() only checked the thumb tip/IP's distance to the pinky MCP(17);
// a realistic "index only" hand (thumb curled IN, resting across the front
// of the folded fingers — the natural way most people make this sign) can
// still have its tip end up farther from landmark 17 than its own IP joint,
// falsely reading as "extended" and inflating a real 1-finger hold to a
// reported 2. Uses a hand-authored, anatomically-plausible landmark set
// (not the idealized fixtures in test-dispatcher.mjs's makeHand, which
// place the thumb tip exactly at landmark 17 when tucked and so never hit
// this bug) to reproduce it end to end through the real functions.
import assert from 'node:assert';
import { countFingers, extendedFingerTips, handAngleDegrees, isShaka } from './engine/camera-engine.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
const pt = (x, y) => ({ x, y });

// A realistic "index only" hand: only the index finger raised, thumb
// curled across the front of the folded middle/ring/pinky (common natural
// pose), other three fingers curled into the palm. Coordinates are
// hand-plausible MediaPipe-style normalized landmarks (mirrored screen
// space, y increasing downward), not tuned to any particular assertion.
function indexOnlyHand() {
  const lm = new Array(21);
  lm[0] = pt(0.50, 0.85);  // wrist
  lm[1] = pt(0.42, 0.80); lm[2] = pt(0.36, 0.72); lm[3] = pt(0.33, 0.65); lm[4] = pt(0.31, 0.60); // thumb — curled across the palm
  lm[5] = pt(0.45, 0.65); lm[6] = pt(0.45, 0.50); lm[7] = pt(0.45, 0.38); lm[8] = pt(0.45, 0.28); // index — raised
  lm[9] = pt(0.50, 0.65); lm[10] = pt(0.52, 0.60); lm[11] = pt(0.54, 0.68); lm[12] = pt(0.55, 0.75); // middle — curled
  lm[13] = pt(0.55, 0.66); lm[14] = pt(0.57, 0.62); lm[15] = pt(0.58, 0.70); lm[16] = pt(0.59, 0.77); // ring — curled
  lm[17] = pt(0.60, 0.68); lm[18] = pt(0.61, 0.64); lm[19] = pt(0.62, 0.71); lm[20] = pt(0.63, 0.78); // pinky — curled
  return lm;
}

t('countFingers — a realistic index-only hand (thumb curled across the palm) reads as exactly 1, not 2', () => {
  const lm = indexOnlyHand();
  assert.strictEqual(countFingers(lm), 1, 'index-only hold must count as 1 — this is the exact "giơ 1 nó không nhận" bug');
});
t('extendedFingerTips — a realistic index-only hand reports only the index tip (8), not the thumb (4) too', () => {
  const lm = indexOnlyHand();
  assert.deepStrictEqual(extendedFingerTips(lm), [8]);
});

// Sanity: a genuinely open palm (all 5 spread, thumb sticking well out to
// the side away from the hand) must still read as 5 — the fix must not
// have overcorrected into never detecting a real extended thumb.
function openPalmHand() {
  const lm = new Array(21);
  lm[0] = pt(0.50, 0.85);
  lm[1] = pt(0.42, 0.80); lm[2] = pt(0.35, 0.70); lm[3] = pt(0.27, 0.62); lm[4] = pt(0.18, 0.55); // thumb — spread well out to the side
  lm[5] = pt(0.40, 0.65); lm[6] = pt(0.40, 0.50); lm[7] = pt(0.40, 0.38); lm[8] = pt(0.40, 0.28); // index — raised
  lm[9] = pt(0.50, 0.65); lm[10] = pt(0.50, 0.48); lm[11] = pt(0.50, 0.35); lm[12] = pt(0.50, 0.25); // middle — raised
  lm[13] = pt(0.58, 0.66); lm[14] = pt(0.59, 0.50); lm[15] = pt(0.60, 0.38); lm[16] = pt(0.61, 0.28); // ring — raised
  lm[17] = pt(0.66, 0.68); lm[18] = pt(0.68, 0.54); lm[19] = pt(0.70, 0.42); lm[20] = pt(0.71, 0.32); // pinky — raised
  return lm;
}
t('countFingers — a genuinely open palm (thumb spread well away from the hand) still reads as 5', () => {
  assert.strictEqual(countFingers(openPalmHand()), 5);
});
t('handAngleDegrees — wrist to middle-base pointing upward is the neutral zero-degree pose', () => {
  assert.ok(Math.abs(handAngleDegrees(openPalmHand())) < 1e-9);
});
t('handAngleDegrees — rotating the wrist-to-middle-base vector right produces about 90 degrees', () => {
  const hand = openPalmHand();
  hand[9] = pt(0.70, 0.85);
  assert.ok(Math.abs(handAngleDegrees(hand) - 90) < 1e-9);
});

// isShaka (🤙 badge-claim sign, FORGE-PLAN.md/README.md): thumb+pinky out,
// middle three curled. A synthetic shaka hand — thumb spread well out (like
// openPalmHand's thumb), pinky raised, index/middle/ring curled into the palm.
function shakaHand() {
  const lm = new Array(21);
  lm[0] = pt(0.50, 0.85);
  lm[1] = pt(0.42, 0.80); lm[2] = pt(0.35, 0.70); lm[3] = pt(0.27, 0.62); lm[4] = pt(0.18, 0.55); // thumb — spread well out to the side
  lm[5] = pt(0.45, 0.65); lm[6] = pt(0.45, 0.58); lm[7] = pt(0.46, 0.63); lm[8] = pt(0.47, 0.68); // index — curled
  lm[9] = pt(0.50, 0.65); lm[10] = pt(0.51, 0.58); lm[11] = pt(0.52, 0.64); lm[12] = pt(0.53, 0.70); // middle — curled
  lm[13] = pt(0.55, 0.66); lm[14] = pt(0.56, 0.60); lm[15] = pt(0.57, 0.66); lm[16] = pt(0.58, 0.72); // ring — curled
  lm[17] = pt(0.60, 0.68); lm[18] = pt(0.61, 0.54); lm[19] = pt(0.62, 0.42); lm[20] = pt(0.63, 0.32); // pinky — raised
  return lm;
}
t('isShaka — thumb+pinky out, middle three curled reads as true', () => {
  assert.strictEqual(isShaka(shakaHand()), true);
});
t('isShaka — a genuine open palm (all 5 extended) is NOT a shaka (middle three not curled)', () => {
  assert.strictEqual(isShaka(openPalmHand()), false);
});
t('isShaka — an index-only hold (thumb curled in, pinky curled) is NOT a shaka', () => {
  assert.strictEqual(isShaka(indexOnlyHand()), false);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
