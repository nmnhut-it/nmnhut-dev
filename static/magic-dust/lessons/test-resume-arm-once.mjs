// node lessons/test-resume-arm-once.mjs — regression for the owner bug
// "reconnect vào node, camera vẫn không tắt được" (resume into a node leaves
// a fullscreen camera stuck on): tryResume() fast-forwards through already-
// completed history via devForce(), and devForce() routes through the SAME
// completeCell() a real cell-finish uses — which used to call revealNext()
// unconditionally whenever the just-forced cell sat exactly at the frontier.
// revealNext() both un-veils AND `_arm()`s the NEXT cell, so every single
// historical cell's forcing also armed-then-abandoned the FOLLOWING cell's
// camera gate — and GestureDispatcher.armActGate() just overwrites `#actGate`
// with no check, so an earlier cell's gate callback (the one whose own code
// path would have removed its chip's fullscreen `.on` class) never runs
// again once superseded. Only the REAL frontier cell (after resume finishes)
// should ever `_arm()` — see notebook-runner.js's `#resuming` flag.
// No real DOM under plain node (see CLAUDE.md) — a minimal fake `document`/
// element is installed below, same pattern as test-camera-release-race.mjs.
import assert from 'node:assert';

class FakeClassList {
  #s = new Set();
  add(c) { this.#s.add(c); } remove(c) { this.#s.delete(c); } contains(c) { return this.#s.has(c); } toggle(c, on) { on ? this.add(c) : this.remove(c); }
}
class FakeEl {
  constructor(tag) { this.tag = tag; this.children = []; this.classList = new FakeClassList(); this.style = {}; this.textContent = ''; this.innerHTML = ''; this.disabled = false; }
  appendChild(c) { this.children.push(c); c.parentEl = this; return c; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  remove() {}
  scrollIntoView() {}
}
globalThis.document = { createElement: tag => new FakeEl(tag), querySelectorAll: () => [] };

const { NotebookRunner } = await import('./engine/notebook-runner.js');

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

// makeCells(n) — n gated cells (content irrelevant — only `_arm`
// presence/count is under test). {ritual:true} is a real known cell type
// whose factory is swappable via setRitualCellFactory(), so each cell gets a
// FRESH spy'd element without needing to fake the real checkpoint/quiz/gift
// DOM structure. buildCells() appends one more {ritual:true} automatically,
// so the real total is n+1.
const makeCells = n => Array.from({ length: n }, () => ({ ritual: true }));

// resumeOnce(totalCells, resumeIndex) — builds ONE fresh NotebookRunner (the
// real-world equivalent of ONE page load/reconnect: every class here is
// freshly constructed, exactly like node.js's composition root on reload —
// there is no module-level/static state in NotebookRunner, GestureDispatcher,
// or CameraEngine that could leak from a PRIOR reconnect into this one) and
// returns which cell indices ever got `_arm()`'d.
function resumeOnce(totalCells, resumeIndex) {
  const N = { index: 0, cells: makeCells(totalCells - 1) }; // -1: buildCells() adds the trailing ritual cell
  const armedIndices = [];
  const cameraEngine = { release: () => {}, isReady: false, ensure: () => Promise.resolve() };
  const gestureDispatcher = { actGateArmed: false, fingerGateArmed: false, hasActiveConsumer: () => false };
  const bridge = { isUp: true, run: () => {}, respond: () => {} };
  const scenePanel = new FakeEl('div'), bookEl = new FakeEl('div'), pystatEl = new FakeEl('div');
  const progressStore = { decideResume: () => ({ resume: true, index: resumeIndex }), save: () => {}, saved: null, clear: () => {} };
  const runner = new NotebookRunner(N, {
    bridge, gestureDispatcher, cameraEngine, progressStore,
    casting: {}, photoBooth: {}, scenePanel, bookEl, pystatEl, toast: () => {},
  });
  let spyIndex = 0;
  runner.setRitualCellFactory(() => {
    const el = new FakeEl('div');
    const myIndex = spyIndex++;
    el._arm = () => armedIndices.push(myIndex);
    return el;
  });
  runner.buildCells();
  return armedIndices;
}

t('resume mid-node: only the real frontier cell ever arms its gesture gate', () => {
  const armed = resumeOnce(5, 3); // resume before index 3 of 5 — cells 0,1,2 replay as done history
  assert.strictEqual(armed.length, 1, `expected exactly one _arm() call (the real frontier), got ${armed.length} at indices [${armed}] — an earlier cell's camera gate got orphaned mid-resume`);
  assert.deepStrictEqual(armed, [3], 'the ONE arm must be the actual resume point (index 3), not a historical cell');
});

// "rồi lỡ reconnect nhiều lần thì sao?" (owner) — every reconnect is a full
// page reload in the real app: a BRAND NEW NotebookRunner/GestureDispatcher/
// CameraEngine per reconnect, reading whatever index localStorage has by
// then. So "reconnect N times" == "call resumeOnce() N times with fresh
// instances at progressively later save points" — there is no cross-reload
// state to accumulate. Assert the single-arm invariant holds independently
// at every depth a student could plausibly reconnect at, not just one spot.
t('reconnecting repeatedly (at deeper and deeper save points) never accumulates orphaned gates', () => {
  const total = 8;
  for (let resumeIndex = 1; resumeIndex < total; resumeIndex++) {
    const armed = resumeOnce(total, resumeIndex);
    assert.strictEqual(armed.length, 1, `reconnect at index ${resumeIndex}/${total}: expected exactly 1 arm, got ${armed.length} at [${armed}]`);
    assert.deepStrictEqual(armed, [resumeIndex], `reconnect at index ${resumeIndex}/${total}: armed the wrong cell`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
