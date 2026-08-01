// node lessons/test-stage-player.mjs — pure scene-advance state machine tests
// for engine/stage-player.js (index clamp / esc-to-last-'go' / lifecycle
// callback ordering). No DOM — StagePlayer + the index-math helpers are
// exported specifically so this can run headless.
import assert from 'node:assert';
import { StagePlayer, nextIndex, prevIndex, lastGoIndex, clampIndex, isAutoNext } from './engine/stage-player.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

t('clampIndex bounds to [0, len-1]', () => {
  assert.strictEqual(clampIndex(-3, 4), 0);
  assert.strictEqual(clampIndex(99, 4), 3);
  assert.strictEqual(clampIndex(2, 4), 2);
});

t('nextIndex/prevIndex clamp at the ends (no wraparound)', () => {
  assert.strictEqual(nextIndex(3, 4), 3);   // already last
  assert.strictEqual(nextIndex(1, 4), 2);
  assert.strictEqual(prevIndex(0, 4), 0);   // already first
  assert.strictEqual(prevIndex(2, 4), 1);
});

t('lastGoIndex finds the final go scene, not just the last scene', () => {
  const stage = [{ kind: 'title' }, { kind: 'go' }, { kind: 'video' }, { kind: 'go' }];
  assert.strictEqual(lastGoIndex(stage), 3);
});

t('lastGoIndex falls back to the last scene when no go scene exists', () => {
  const stage = [{ kind: 'title' }, { kind: 'video' }];
  assert.strictEqual(lastGoIndex(stage), 1);
});

t('StagePlayer.start enters scene 0 exactly once', () => {
  const stage = [{ kind: 'title' }, { kind: 'go' }];
  const events = [];
  const p = new StagePlayer(stage, { onEnter: (s, i) => events.push(['enter', i]), onExit: (s, i) => events.push(['exit', i]) });
  p.start();
  assert.deepStrictEqual(events, [['enter', 0]]);
  assert.strictEqual(p.index, 0);
});

t('StagePlayer.next exits current then enters next, in order', () => {
  const stage = [{ kind: 'title' }, { kind: 'embed' }, { kind: 'go' }];
  const events = [];
  const p = new StagePlayer(stage, { onEnter: (s, i) => events.push(['enter', i]), onExit: (s, i) => events.push(['exit', i]) });
  p.start(); p.next();
  assert.deepStrictEqual(events, [['enter', 0], ['exit', 0], ['enter', 1]]);
});

t('StagePlayer.next at the last scene is a no-op (no churn)', () => {
  const stage = [{ kind: 'title' }, { kind: 'go' }];
  const events = [];
  const p = new StagePlayer(stage, { onEnter: (s, i) => events.push(['enter', i]), onExit: (s, i) => events.push(['exit', i]) });
  p.start(); p.next(); p.next(); p.next();
  assert.deepStrictEqual(events, [['enter', 0], ['exit', 0], ['enter', 1]]);
  assert.strictEqual(p.index, 1);
});

t('StagePlayer.prev at scene 0 is a no-op', () => {
  const stage = [{ kind: 'title' }, { kind: 'go' }];
  const events = [];
  const p = new StagePlayer(stage, { onEnter: (s, i) => events.push(['enter', i]), onExit: (s, i) => events.push(['exit', i]) });
  p.start(); p.prev();
  assert.deepStrictEqual(events, [['enter', 0]]);
});

t('StagePlayer.jumpToEnd (Esc) jumps straight to the final go scene, skipping intermediates', () => {
  const stage = [{ kind: 'title' }, { kind: 'embed' }, { kind: 'video' }, { kind: 'go' }];
  const events = [];
  const p = new StagePlayer(stage, { onEnter: (s, i) => events.push(['enter', i]), onExit: (s, i) => events.push(['exit', i]) });
  p.start(); p.jumpToEnd();
  assert.deepStrictEqual(events, [['enter', 0], ['exit', 0], ['enter', 3]]);
  assert.strictEqual(p.scene.kind, 'go');
});

t('StagePlayer throws on an empty stage (never a silent no-op)', () => {
  assert.throws(() => new StagePlayer([], {}), /non-empty/);
});

// ── v2: autoNext / gesture-complete → next (KICKOFF-PLAN v2) ──
// isAutoNext is the pure predicate mount()'s video/gesture-title renderers
// consult to decide whether to self-advance on completion (video ended/cap,
// gesture full charge) instead of parking for a teacher tap — DOM-level
// wiring (mountVideo/mountGestureTitle calling the `advance` closure) isn't
// reachable headlessly, but the predicate itself is, and is the one piece
// content authors actually set fields on.
t('isAutoNext: video scene opts in via autoNext:true', () => {
  assert.strictEqual(isAutoNext({ kind: 'video', autoNext: true }), true);
  assert.strictEqual(isAutoNext({ kind: 'video' }), false);            // v1 decks default to parked (no regression)
});
t('isAutoNext: gesture-title scene opts in via next:"auto"', () => {
  assert.strictEqual(isAutoNext({ kind: 'gesture-title', next: 'auto' }), true);
  assert.strictEqual(isAutoNext({ kind: 'gesture-title' }), false);
});
t('isAutoNext: unrelated scene kinds/fields never accidentally trip it', () => {
  assert.strictEqual(isAutoNext({ kind: 'title' }), false);
  assert.strictEqual(isAutoNext({ kind: 'video', next: 'manual' }), false);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
