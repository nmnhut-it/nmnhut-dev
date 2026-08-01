// node lessons/test-fingertip-fx-wiring.mjs — proves the fingertip-fx overlay
// (gesture-ui.js#armFingertipFx) is now wired INTO the three shared gate
// seams (gesture-dispatcher.js's armActHoldGate/armTimedCatchGate/
// armVerbGate) instead of per-call-site, and that arming is idempotent: a
// gate that arms fx once registers exactly ONE onLandmarks observer, and
// disarming (done / camera lost) removes it again — re-arming the same chip
// never leaks a second subscription. No real DOM available under plain
// node (this repo has no build/test tooling, see CLAUDE.md) — a minimal
// fake `document`/canvas/2D-context is installed below, just enough for
// gesture-ui.js's `document.createElement`/`chip.querySelector` calls and
// FingertipFxPainter's canvas drawing calls to not throw. performance.now()
// is faked too (a mutable clock we advance ourselves) so the real-time hold
// gates (ACT_HOLD_MS=900ms etc.) resolve in a tight synchronous loop instead
// of needing real wall-clock time to pass.
import assert from 'node:assert';

// ── fake clock: gesture-dispatcher.js/two-phase-gate.js read performance.now()
// directly (no clock injection) — override it globally, advance manually. ──
let fakeNow = 0;
globalThis.performance.now = () => fakeNow;
function tick(ms = 20) { fakeNow += ms; }

// ── minimal fake DOM: fake elements + a no-op 2D context ──
function fakeCtx() {
  const noop = () => {};
  return { save: noop, restore: noop, clearRect: noop, fillRect: noop, strokeRect: noop,
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, fill: noop, stroke: noop,
    translate: noop, rotate: noop, scale: noop, fillText: noop, drawImage: noop, setTransform: noop };
}
class FakeClassList {
  #set = new Set();
  add(c) { this.#set.add(c); } remove(c) { this.#set.delete(c); } contains(c) { return this.#set.has(c); } toggle(c, on) { on ? this.add(c) : this.remove(c); }
}
class FakeEl {
  constructor(tag) { this.tag = tag; this.children = []; this.classList = new FakeClassList(); this.style = {}; this.width = 0; this.height = 0; this.clientWidth = 100; this.clientHeight = 100; }
  appendChild(c) { this.children.push(c); c.parentEl = this; return c; }
  remove() { if (this.parentEl) this.parentEl.children = this.parentEl.children.filter(c => c !== this); }
  querySelector() { return null; }
  getContext() { return fakeCtx(); }
  play() { return Promise.resolve(); }
}
function fakeChip() {
  const chip = new FakeEl('div');
  chip.classList.add('bcam');
  const video = new FakeEl('video'); chip.appendChild(video);
  const gauge = new FakeEl('div'); const gaugeFill = new FakeEl('i'); gauge.appendChild(gaugeFill); chip.appendChild(gauge);
  chip.querySelector = sel => {
    if (sel === 'canvas.fxdots') return chip.children.find(c => c.tag === 'canvas' && c.classList.contains('fxdots')) || null;
    if (sel === 'video') return video;
    if (sel === '.bgauge i') return gaugeFill;
    return null;
  };
  return chip;
}
globalThis.document = { createElement: tag => new FakeEl(tag) };

const { GestureDispatcher } = await import('./engine/gesture-dispatcher.js');
const { armFingertipFx } = await import('./engine/gesture-ui.js');
const { GESTURE_ARM_MS } = await import('./engine/constants.js');

let passed = 0, failed = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

function fakeCamera() { return { ensure: () => Promise.resolve(), stream: {} }; }
// countingDispatcher() — wraps onLandmarks to track how many live subscriptions exist right now
function countingDispatcher() {
  const gd = new GestureDispatcher({ isRunning: () => false, frozenCheck: () => false, boothSummon: () => false, boothEmit: () => {}, hud: () => {} });
  let live = 0;
  const origOn = gd.onLandmarks.bind(gd);
  gd.onLandmarks = fn => { live++; const off = origOn(fn); let released = false; return () => { if (released) return; released = true; live--; off(); }; };
  return { gd, liveCount: () => live };
}
// synthetic hand builder (same construction as test-dispatcher.mjs's makeHand)
function makeHand(fingerCount) {
  const lm = new Array(21);
  lm[0] = { x: .5, y: .9 }; lm[9] = { x: .5, y: .6 };
  const fingers = [[6, 8], [10, 12], [14, 16], [18, 20]];
  const extendCount = Math.min(fingerCount, 4);
  fingers.forEach(([pip, tip], i) => { lm[pip] = { x: .5, y: .6 }; lm[tip] = i < extendCount ? { x: .5, y: .45 } : { x: .5, y: .6 }; });
  lm[17] = { x: .7, y: .6 };
  const thumbExtended = fingerCount === 5;
  lm[2] = thumbExtended ? { x: .7, y: .6 } : { x: .9, y: .6 };
  lm[4] = thumbExtended ? { x: .9, y: .6 } : { x: .7, y: .6 };
  for (let i = 0; i < 21; i++) if (!lm[i]) lm[i] = { x: .5, y: .6 };
  return lm;
}
async function settle() { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); }

await t('armActHoldGate arms exactly one fingertip-fx onLandmarks observer', async () => {
  const { gd, liveCount } = countingDispatcher();
  gd.armActHoldGate(fakeCamera(), fakeChip(), 5, () => true, () => {}, () => {});
  await settle();
  assert.strictEqual(liveCount(), 1, 'expected exactly one onLandmarks observer after arming');
});

await t('armActHoldGate: driving the hold to completion disarms the fx observer', async () => {
  const { gd, liveCount } = countingDispatcher();
  let done = false;
  gd.armActHoldGate(fakeCamera(), fakeChip(), 3, () => true, () => {}, () => { done = true; });
  await settle();
  assert.strictEqual(liveCount(), 1, 'fx armed');
  for (let i = 0; i < 200 && !done; i++) { tick(20); gd.onHands({ multiHandLandmarks: [makeHand(3)] }); }
  assert.strictEqual(done, true, 'expected the hold gate to complete within the loop');
  assert.strictEqual(liveCount(), 0, 'fx observer must be gone once the gate is done');
});

await t('armActHoldGate: camera going !alive() disarms the fx observer too', async () => {
  const { gd, liveCount } = countingDispatcher();
  let alive = true;
  gd.armActHoldGate(fakeCamera(), fakeChip(), 3, () => alive, () => {}, () => {});
  await settle();
  assert.strictEqual(liveCount(), 1);
  alive = false;
  tick(20); gd.onHands({ multiHandLandmarks: [makeHand(3)] });
  assert.strictEqual(liveCount(), 0, 'fx observer must be removed once alive() goes false');
});

await t('armTimedCatchGate arms and disarms exactly one fx observer', async () => {
  const { gd, liveCount } = countingDispatcher();
  let caught = false;
  gd.armTimedCatchGate(fakeCamera(), fakeChip(), 5, () => true, () => { caught = true; });
  await settle();
  assert.strictEqual(liveCount(), 1);
  for (let i = 0; i < 20 && !caught; i++) { tick(20); gd.onHands({ multiHandLandmarks: [makeHand(5)] }); }
  assert.strictEqual(caught, true);
  assert.strictEqual(liveCount(), 0);
});

await t('armVerbGate (swipe) arms exactly one fx observer through arm+capture, disarms on done', async () => {
  const { gd, liveCount } = countingDispatcher();
  let doneVal = null;
  gd.armVerbGate('swipe', fakeCamera(), fakeChip(), { axis: 'any' }, () => true, () => {}, v => { doneVal = v; });
  await settle();
  assert.strictEqual(liveCount(), 1, 'fx armed during ARM phase');
  // ARM: hold open palm (5) for exactly GESTURE_ARM_MS worth of frames — no more
  // (overshooting into CAPTURE with extra count=5 frames would pollute the
  // swipe capture's fingertip history and change which direction resolves).
  for (let held = 0; held <= GESTURE_ARM_MS; held += 20) { tick(20); gd.onHands({ multiHandLandmarks: [makeHand(5)] }); }
  assert.strictEqual(liveCount(), 1, 'fx still armed entering CAPTURE');
  // CAPTURE: sweep the fingertip rightward across two frames (mirrored: 1-x)
  const left = makeHand(1); left[8] = { x: .8, y: .5 };
  const right = makeHand(1); right[8] = { x: .2, y: .5 };
  tick(20); gd.onHands({ multiHandLandmarks: [left] });
  tick(300); gd.onHands({ multiHandLandmarks: [right] });
  assert.strictEqual(doneVal, 'right', 'expected the swipe to resolve rightward');
  assert.strictEqual(liveCount(), 0, 'fx observer must be gone once the verb gate resolves');
});

await t('opts.noFingertipFx skips arming fx entirely (escape hatch respected)', async () => {
  const { gd, liveCount } = countingDispatcher();
  gd.armActHoldGate(fakeCamera(), fakeChip(), 5, () => true, () => {}, () => {}, { noFingertipFx: true });
  await settle();
  assert.strictEqual(liveCount(), 0, 'noFingertipFx must skip the fx subscription');
});

await t('armFingertipFx itself is idempotent per chip: re-arming without disarming first does not leak', async () => {
  const { gd, liveCount } = countingDispatcher();
  const chip = fakeChip();
  armFingertipFx(gd, chip, () => false);
  assert.strictEqual(liveCount(), 1);
  const off2 = armFingertipFx(gd, chip, () => false);   // re-arm WITHOUT calling the first disarm — must replace, not stack
  assert.strictEqual(liveCount(), 1, 're-arming the same chip must replace, not stack, the observer');
  off2();
  assert.strictEqual(liveCount(), 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
