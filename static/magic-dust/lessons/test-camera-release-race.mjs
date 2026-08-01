// node lessons/test-camera-release-race.mjs — regression for the owner bug
// "camera stops detecting the hand right after the boss's code round":
// notebook-runner.js#clearRunning used to schedule an UNCONDITIONAL
// cameraEngine.release() (OUTPUT_DWELL_MS+400 later) on every code-cell
// finish, racing boss-fight.js#armForRound's own explicit release (entering
// a code round) / re-acquire (leaving it for the next gesture round) of the
// SAME shared CameraEngine singleton — two uncoordinated managers. Boss
// rounds now skip that redundant release entirely (see #clearRunning's
// `wasBossRound` guard) since the boss owns its camera lifecycle end-to-end;
// normal (non-boss) cells keep the original deferred release.
// No real DOM under plain node (see CLAUDE.md) — a minimal fake `document`/
// element is installed below, just enough for notebook-runner.js's
// querySelector/querySelectorAll calls in the runCell/onDone/#clearRunning
// path to not throw.
import assert from 'node:assert';

class FakeClassList {
  #s = new Set();
  add(c) { this.#s.add(c); } remove(c) { this.#s.delete(c); } contains(c) { return this.#s.has(c); } toggle(c, on) { on ? this.add(c) : this.remove(c); }
}
class FakeEl {
  constructor(tag) { this.tag = tag; this.children = []; this.classList = new FakeClassList(); this.style = {}; this.textContent = ''; this.innerHTML = ''; this.disabled = false; }
  appendChild(c) { this.children.push(c); c.parentEl = this; return c; }
  querySelector(sel) { return this._qs ? this._qs(sel) : null; }
  querySelectorAll() { return []; }
  remove() {}
  scrollIntoView() {}
}
globalThis.document = { createElement: tag => new FakeEl(tag), querySelectorAll: () => [] };

const { NotebookRunner } = await import('./engine/notebook-runner.js');
const { OUTPUT_DWELL_MS } = await import('./engine/constants.js');

let passed = 0, failed = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

// makeRunner() — a NotebookRunner with every dependency stubbed to the bare
// minimum runCell()/onDone()/#clearRunning() actually touch. Returns the
// runner plus a live count of cameraEngine.release() calls.
function makeRunner() {
  let releaseCalls = 0;
  const cameraEngine = { release: () => { releaseCalls++; }, isReady: false, ensure: () => Promise.resolve() };
  const gestureDispatcher = { actGateArmed: false, fingerGateArmed: false, hasActiveConsumer: () => false };
  const bridge = { isUp: true, run: () => {}, respond: () => {} };
  const scenePanel = new FakeEl('div');
  const bookEl = new FakeEl('div');
  const pystatEl = new FakeEl('div');
  const runner = new NotebookRunner({}, {
    bridge, gestureDispatcher, cameraEngine, progressStore: { save: () => {} },
    casting: {}, photoBooth: {}, scenePanel, bookEl, pystatEl, toast: () => {},
  });
  return { runner, getReleaseCalls: () => releaseCalls };
}
// makeCodeEl(isBossRound) — a fake code-cell element shaped like what
// runCell()/onDone() need: an editor, a `.cout`/`.inlbl` pair, and (for the
// boss case) an `_fight` callback marking it as a boss round.
function makeCodeEl(isBossRound) {
  const el = new FakeEl('div');
  const cout = new FakeEl('div'), inlbl = new FakeEl('span');
  el._qs = sel => sel === '.cout' ? cout : sel === '.inlbl' ? inlbl : null;
  el._editor = { getValue: () => 'say("hi")' };
  if (isBossRound) el._fight = () => {}; // presence alone is what #clearRunning checks
  return el;
}
const wait = ms => new Promise(r => setTimeout(r, ms));

await t('boss code round: onDone does NOT schedule a redundant cameraEngine.release()', async () => {
  const { runner, getReleaseCalls } = makeRunner();
  const el = makeCodeEl(true);
  runner.runCell(el);
  runner.onDone();
  await wait(OUTPUT_DWELL_MS + 700);
  assert.strictEqual(getReleaseCalls(), 0, 'a boss round must own its own camera lifecycle — notebook-runner must not race it');
});

await t('normal (non-boss) code cell: onDone still releases the camera after the deferred window', async () => {
  const { runner, getReleaseCalls } = makeRunner();
  const el = makeCodeEl(false);
  runner.runCell(el);
  runner.onDone();
  assert.strictEqual(getReleaseCalls(), 0, 'must not release immediately — completeCell/revealNext may still arm a gesture gate first');
  await wait(OUTPUT_DWELL_MS + 700);
  assert.strictEqual(getReleaseCalls(), 1, 'a normal cell keeps its original deferred release behavior');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
