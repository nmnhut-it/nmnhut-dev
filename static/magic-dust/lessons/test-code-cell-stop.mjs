// node lessons/test-code-cell-stop.mjs
// Unit regressions for code-cell STOP behavior: NotebookRunner's button state
// and PyBridge's hard worker stop/reboot path.
import assert from 'node:assert';

class FakeClassList {
  #s = new Set();
  add(...cs) { for (const c of cs) this.#s.add(c); }
  remove(...cs) { for (const c of cs) this.#s.delete(c); }
  contains(c) { return this.#s.has(c); }
  toggle(c, on) {
    const shouldAdd = on === undefined ? !this.#s.has(c) : !!on;
    shouldAdd ? this.add(c) : this.remove(c);
    return shouldAdd;
  }
}

class FakeEl {
  constructor(tag = 'div', classes = '') {
    this.tag = tag;
    this.children = [];
    this.parentElement = null;
    this.classList = new FakeClassList();
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this.textContent = '';
    this.innerHTML = '';
    this.disabled = false;
    this.title = '';
    this.listeners = {};
    for (const c of String(classes).split(/\s+/).filter(Boolean)) this.classList.add(c);
  }
  appendChild(c) { this.children.push(c); c.parentElement = this; return c; }
  replaceChildren(...children) { this.children = []; for (const child of children) this.appendChild(child); }
  addEventListener(type, handler) { (this.listeners[type] ||= []).push(handler); }
  dispatch(type, event = {}) { for (const handler of this.listeners[type] || []) handler(event); }
  querySelector(sel) { return this._qs ? this._qs(sel) : null; }
  querySelectorAll() { return []; }
  closest(sel) {
    let cur = this;
    const want = String(sel).split(',').map(s => s.trim()).filter(s => s.startsWith('.')).map(s => s.slice(1));
    while (cur) {
      if (want.some(c => cur.classList.contains(c))) return cur;
      cur = cur.parentElement;
    }
    return null;
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  removeAttribute(k) { delete this.attributes[k]; }
  remove() {}
  scrollIntoView() {}
}

const runButtons = [];
globalThis.document = {
  createElement: tag => new FakeEl(tag),
  querySelectorAll: sel => sel === '.crun' ? runButtons : [],
};
globalThis.self = { crossOriginIsolated: true };
globalThis.cellOutputSatisfies = (expect, captured) => !expect?.minLines || captured.length >= expect.minLines;
globalThis.expectOutHint = (expect, captured) => `cần ${expect?.minLines || 0} frame, hiện có ${captured.length}`;

const workers = [];
class FakeWorker {
  constructor(url) {
    this.url = url;
    this.messages = [];
    this.terminated = false;
    workers.push(this);
  }
  postMessage(msg) { this.messages.push(msg); }
  terminate() { this.terminated = true; }
}
globalThis.Worker = FakeWorker;

const { NotebookRunner } = await import('./engine/notebook-runner.js');
const { PyBridge } = await import('./engine/py-bridge.js');
const { mountEditor } = await import('./engine/code-cells.js');

let passed = 0, failed = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.log(`  FAIL - ${name}: ${e.stack || e.message}`); }
}

function makeCodeEl(label, code) {
  const el = new FakeEl('div', 'codecell');
  const cout = new FakeEl('div', 'cout');
  const inlbl = new FakeEl('span', 'inlbl');
  const btn = new FakeEl('button', 'crun');
  btn.textContent = 'RUN';
  el._editor = { getValue: () => code };
  el._qs = sel => sel === '.cout' ? cout : sel === '.inlbl' ? inlbl : sel === '.crun' ? btn : null;
  el.appendChild(btn);
  runButtons.push(btn);
  return { el, cout, inlbl, btn, label };
}

function makeRunner() {
  runButtons.length = 0;
  const runs = [];
  let stops = 0, bootRetries = 0;
  const bridge = {
    isUp: true,
    run: code => runs.push(code),
    stop: () => { stops++; bridge.isUp = false; return true; },
    retryBoot: () => { bootRetries++; return true; },
    respond: () => {},
  };
  const scenePanel = new FakeEl('div');
  const pystatEl = new FakeEl('div');
  const light = new FakeEl('div');
  scenePanel._qs = sel => sel === '#sclight' ? light : null;
  const runner = new NotebookRunner({}, {
    bridge,
    gestureDispatcher: { actGateArmed: false, fingerGateArmed: false, hasActiveConsumer: () => false },
    cameraEngine: { isReady: false, release: () => {}, ensure: () => Promise.resolve() },
    progressStore: { save: () => {}, decideResume: () => ({ resume: false }), clear: () => {} },
    casting: {},
    photoBooth: {},
    scenePanel,
    bookEl: new FakeEl('div'),
    pystatEl,
    toast: () => {},
  });
  return { runner, bridge, runs, pystatEl, getStops: () => stops, getBootRetries: () => bootRetries };
}

await t('NotebookRunner shows STOP for the active cell and stop reboots through the bridge', () => {
  const { runner, bridge, runs, getStops } = makeRunner();
  const a = makeCodeEl('a.py', 'while True:\n    pass\n');
  const b = makeCodeEl('b.py', 'print("other")\n');

  runner.runCell(a.el);
  assert.deepStrictEqual(runs, ['while True:\n    pass\n']);
  assert.strictEqual(a.btn.disabled, false);
  assert.strictEqual(a.btn.textContent, 'STOP');
  assert.strictEqual(a.btn.dataset.runState, 'stop');
  assert.ok(a.btn.classList.contains('is-stop'));
  assert.strictEqual(b.btn.disabled, true);

  runner.runCell(a.el);
  assert.strictEqual(getStops(), 1);
  assert.strictEqual(a.inlbl.textContent, 'In [stop]');
  assert.strictEqual(a.btn.disabled, true);
  assert.strictEqual(a.btn.dataset.runState, 'disabled');
  assert.ok(!a.btn.classList.contains('is-stop'));
  assert.match(a.cout.children.map(c => c.textContent).join('\n'), /đã dừng/);

  bridge.isUp = true;
  runner.onReady();
  assert.strictEqual(a.btn.disabled, false);
  assert.strictEqual(b.btn.disabled, false);
  assert.strictEqual(a.btn.textContent, 'RUN');
});

await t('code cells fall back to an editable textarea when Monaco is unavailable', () => {
  delete globalThis.monaco;
  const el = new FakeEl('div', 'codecell');
  const host = new FakeEl('div', 'ced');
  el._qs = sel => sel === '.ced' ? host : null;
  let runs = 0;
  const editor = mountEditor(el, 'score = 1\n', () => { runs++; });
  assert.strictEqual(editor.getValue(), 'score = 1\n');
  editor.setValue('score = 2\n');
  assert.strictEqual(editor.getValue(), 'score = 2\n');
  assert.strictEqual(host.children.length, 2);
  const textarea = host.children[1];
  textarea.dispatch('keydown', { shiftKey: true, key: 'Enter', preventDefault: () => {} });
  assert.strictEqual(runs, 1);
});

await t('an intentional while True project completes only after enough output and STOP', async () => {
  const { runner, bridge } = makeRunner();
  const project = makeCodeEl('live.py', 'while True:\n    show_frame()\n');
  project.el._stopCompletes = true; project.el._expectOut = { minLines: 3 };
  let completed = 0; runner.completeCell = el => { if (el === project.el) completed++; };

  runner.runCell(project.el); runner.onTell('terminal', 'frame 1'); runner.runCell(project.el);
  await new Promise(resolve => setTimeout(resolve, 0)); assert.strictEqual(completed, 0);
  assert.match(project.cout.children.map(c => c.textContent).join('\n'), /cần 3 frame/);

  bridge.isUp = true; runner.onReady(); runner.runCell(project.el);
  runner.onTell('terminal', 'frame 1'); runner.onTell('terminal', 'frame 2'); runner.onTell('terminal', 'frame 3'); runner.runCell(project.el);
  await new Promise(resolve => setTimeout(resolve, 0)); assert.strictEqual(completed, 1);
});

await t('NotebookRunner shows bounded boot retries and exposes a keyboard retry action', () => {
  const { runner, pystatEl: status, getBootRetries } = makeRunner();
  runner.onBootStatus({ state: 'retrying', retry: 2, totalRetries: 3 });
  assert.match(status.textContent, /thử lại 2\/3/);
  assert.ok(status.classList.contains('retrying'));
  runner.onBootStatus({ state: 'failed' });
  assert.match(status.textContent, /Không tải được Python/);
  assert.ok(status.classList.contains('error'));
  status.onclick();
  assert.strictEqual(getBootRetries(), 1);
});

await t('PyBridge.stop terminates the busy worker, boots a replacement, and ignores stale responses', async () => {
  workers.length = 0;
  let ready = 0, asks = 0;
  const bridge = new PyBridge({
    onReady: () => { ready++; },
    onDone: () => {},
    onError: () => {},
    onTell: () => {},
    onAsk: () => { asks++; },
  });

  await bridge.boot({ old_computer: 'def say(x): pass\n' });
  assert.strictEqual(workers.length, 1);
  assert.strictEqual(workers[0].messages[0].cmd, 'boot');

  workers[0].onmessage({ data: { evt: 'ready' } });
  assert.strictEqual(ready, 1);
  assert.strictEqual(bridge.isUp, true);

  bridge.run('while True:\n    pass\n');
  assert.strictEqual(workers[0].messages.at(-1).cmd, 'run');
  workers[0].onmessage({ data: { req: 'ask', kind: 'keyboard', prompt: '?' } });
  assert.strictEqual(asks, 1);

  assert.strictEqual(bridge.stop(), true);
  assert.strictEqual(workers[0].terminated, true);
  assert.strictEqual(bridge.isUp, false);
  assert.strictEqual(workers.length, 2);
  assert.strictEqual(workers[1].messages[0].cmd, 'boot');
  assert.strictEqual(bridge.respond('late answer'), false);

  workers[1].onmessage({ data: { evt: 'ready' } });
  assert.strictEqual(ready, 2);
  assert.strictEqual(bridge.isUp, true);
});

await t('PyBridge bounds boot retries, stops after failure, and supports manual retry', async () => {
  workers.length = 0;
  const statuses = [];
  const bridge = new PyBridge({
    onReady: () => {}, onDone: () => {}, onError: () => {}, onTell: () => {}, onAsk: () => {},
    onBootStatus: state => statuses.push(state), bootRetryDelays: [0, 0],
  });
  await bridge.boot({ old_computer: 'def say(x): pass\n' });
  assert.strictEqual(workers.length, 1);
  workers[0].onmessage({ data: { evt: 'boot-error', msg: 'offline' } });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.strictEqual(workers.length, 2);
  workers[1].onmessage({ data: { evt: 'boot-error', msg: 'offline' } });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.strictEqual(workers.length, 3);
  workers[2].onmessage({ data: { evt: 'boot-error', msg: 'offline' } });
  assert.strictEqual(statuses.at(-1).state, 'failed');
  assert.strictEqual(bridge.isUp, false);
  assert.strictEqual(bridge.retryBoot(), true);
  assert.strictEqual(workers.length, 4);
  workers[3].onmessage({ data: { evt: 'ready' } });
  assert.strictEqual(bridge.isUp, true);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
