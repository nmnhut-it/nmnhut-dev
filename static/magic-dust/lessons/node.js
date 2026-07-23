// Node shell — the saga's ritual arc, shared by every node page. Per-node
// content = window.NODE {index, title, subtitle, bundle, machine, modules,
// cells, ritual}. Four acts: ENTER splash → BUNDLE reveal (grants the machine)
// → LEARN (a Jupyter-style notebook: NPC bubbles + code cells sharing one
// Pyodide worker + Python state, revealed progressively) → RITUAL (hold-to-
// seal) which marks the node done in localStorage 'magicdust.saga' and
// returns to the map. This file is the COMPOSITION ROOT ONLY — every
// subsystem lives in engine/*.js; see lessons/README.md for the module map.
import { $, mountPage, warnIfNotIsolated, scenePanelHtml } from './engine/dom-scaffold.js';
import { ProgressStore } from './engine/progress-store.js';
import { castSpell, showValue, screenFx, createFxQueue } from './engine/casting.js';
import { CameraEngine } from './engine/camera-engine.js';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';
import { PyBridge } from './engine/py-bridge.js?v=20260714-165347';
import { NotebookRunner } from './engine/notebook-runner.js?v=20260714-165347';
import { PhotoBooth } from './engine/photo-booth.js';
import { InteractiveStudio } from './engine/interactive-studio.js';
import { RitualController } from './engine/ritual-controller.js';
import { AskGate } from './engine/ask-gate.js';
import { installCheatToggle } from './engine/cheat-panel.js';
import { registerBypass, installBypassKey } from './engine/bypass-registry.js';
import { armFullscreenFingertipFx } from './engine/gesture-ui.js';
import { mountTuneOverlay } from './engine/tune-overlay.js';
import { GESTURE_FINGERS } from './engine/constants.js';
import { inventory } from './engine/inventory.js';
import { checkCellDisplayInvariants } from './engine/dom-invariants.js';

const N = window.NODE || { index: 0, title: 'Node', cells: [] };
mountPage(N);
warnIfNotIsolated();

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── shared camera/fx panel (mounted into whichever cell output needs it) ──
const scenePanel = document.createElement('div'); scenePanel.id = 'scenepanel';
scenePanel.innerHTML = scenePanelHtml();

const progressStore = new ProgressStore(N.index, N.cells);
const fxQueue = createFxQueue();
const askGate = new AskGate();

function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
let vfxLoading = null;
function loadVortex() {
  vfxLoading ||= (self.RitualVortex ? Promise.resolve() : loadScript('./ritual-vortex.js')).catch(() => {});
  return vfxLoading;                                  // script blocked → CSS-ring fallbacks stay
}

// Forward-declared: closed over by gestureDispatcher's predicates below (the
// only acceptable "not-yet-built" closures in this composition root — every
// other dependency is constructed leaf-first).
let photoBooth = null, notebookRunner = null, studio = null;
const gestureDispatcher = new GestureDispatcher({
  isRunning: () => notebookRunner?.isRunning ?? false,
  frozenCheck: () => scenePanel.classList.contains('frozen'),
  boothSummon: () => photoBooth?.isSummoning ?? false,
  boothEmit: (x, y, n) => photoBooth?.emit(x, y, n),
  hud: (count, has) => {
    scenePanel.querySelector('#scstat').textContent = has ? 'giữ yên tay nhé…' : 'giơ bàn tay ✋ cho máy thấy nào';
    scenePanel.querySelector('#sccount').textContent = has ? count : '—';
  },
});
const cameraEngine = new CameraEngine(scenePanel.querySelector('#cam'), {
  onFrame: res => { recordHandFrame(res); gestureDispatcher.onHands(res); },
  watchdogActive: () => gestureDispatcher.hasActiveConsumer() || fxQueue.busy > 0 || (studio?.isActive ?? false), // live studio tracking and fx both own the camera
});
mountTuneOverlay(gestureDispatcher); // ?tune URL param → tiny fps/finger-count/gate HUD, invisible otherwise

studio = new InteractiveStudio(scenePanel, {
  cameraEngine, gestureDispatcher, loadVortex,
  outLine: t => notebookRunner?.outLine('t-sys', t),
});

const castingApi = {
  castSpell: name => castSpell(name, { scenePanel, fxQueue, vortexShare: photoBooth.vortexShare, loadVortex }),
  showValue: (sp, v) => showValue(sp, v),
  screenFx: (sp, mode, outLine) => screenFx(sp, mode, outLine),
};

photoBooth = new PhotoBooth(scenePanel, {
  cameraEngine, gestureDispatcher, loadVortex, fxQueue, askGate,
  outLine: t => notebookRunner?.outLine('t-sys', t),
  appendOutput: node => notebookRunner?.appendOutput(node),
});

const pyBridge = new PyBridge({
  onReady: () => notebookRunner.onReady(),
  onBootStatus: state => notebookRunner.onBootStatus(state),
  onDone: () => notebookRunner.onDone(),
  onError: msg => notebookRunner.onError(msg),
  onTell: (kind, text) => notebookRunner.onTell(kind, text),
  onAsk: (kind, prompt) => notebookRunner.onAsk(kind, prompt),
});

notebookRunner = new NotebookRunner(N, {
  bridge: pyBridge, gestureDispatcher, cameraEngine, progressStore, casting: castingApi, photoBooth, studio,
  scenePanel, bookEl: $('book'), pystatEl: $('pystat'), toast, askGate, loadVortex,
});

const ritual = new RitualController($('ritualOverlay'), N, {
  cameraEngine, gestureDispatcher, progressStore, loadVortex, onSealed: () => location.href = './index.html',
});
// Ritual bypass: two phases, neither reachable via armActHoldGate (the
// ritual owns the hand through gestureDispatcher.setRitual — dispatcher
// priority tier 1, above the act/motion gates armActHoldGate builds on).
// (1) BEFORE open: the ritual cell's own "hold ☝ to begin" gate — wrap the
// factory (not ritual-controller.js, off-limits) so entering this cell
// registers a bypass that just calls ritual.open(). (2) WHILE active: a
// MutationObserver on the overlay's 'gone' class (the only externally
// visible signal ritual-controller.js gives for "now charging") swaps in a
// bypass that drives the EXISTING forceFingerCount/forceChant hooks.
let ritualActiveOff = null;
// Fullscreen fingertip fx for the ritual's choice/seal phases: the ritual
// owns the hand via gestureDispatcher.setRitual (dispatcher tier 1, above
// the armActHoldGate/armVerbGate seams), so none of the three gate methods
// ever see its frames — armed/disarmed here instead, off the SAME 'gone'
// class toggle ritual-controller.js already exposes, rather than adding a
// hook inside that file.
let ritualFxCanvas = null, ritualFxOff = null;
function ritualFxCanvasEl() {
  if (!ritualFxCanvas) {
    ritualFxCanvas = document.createElement('canvas'); ritualFxCanvas.className = 'rfx';
    ritualFxCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5';
    $('ritualOverlay').appendChild(ritualFxCanvas);
  }
  return ritualFxCanvas;
}
new MutationObserver(() => {
  const opened = !$('ritualOverlay').classList.contains('gone');
  if (opened && !ritualActiveOff) {
    ritualActiveOff = registerBypass('nghi lễ — giữ dấu hiệu + hét', () => {
      const fingers = N.ritual?.fingers ?? GESTURE_FINGERS[N.ritual?.gesture] ?? 5;
      ritual.forceFingerCount(fingers); ritual.forceChant();
    });
  } else if (!opened && ritualActiveOff) { ritualActiveOff(); ritualActiveOff = null; }
  if (opened && !ritualFxOff) {
    const canvas = ritualFxCanvasEl();
    canvas.width = canvas.clientWidth || innerWidth; canvas.height = canvas.clientHeight || innerHeight;
    ritualFxOff = armFullscreenFingertipFx(gestureDispatcher, canvas, { scale: 1.6 });
  } else if (!opened && ritualFxOff) { ritualFxOff(); ritualFxOff = null; }
}).observe($('ritualOverlay'), { attributes: true, attributeFilter: ['class'] });
const ritualCellFactory = () => {
  const el = ritual.ritualCellEl();
  const origArm = el._arm;
  el._arm = () => {
    const off = registerBypass('bắt đầu nghi lễ (giơ ☝)', () => { off(); ritual.open(); });
    origArm();                                        // origArm's armActHoldGate now arms its own fingertip fx
  };
  return el;
};
notebookRunner.setRitualCellFactory(ritualCellFactory);

// ── acts: splash → bundle → book. The saga's gesture language: ☝ one finger
// to START · ✋ high five to OPEN · ✋ high five to SEAL — every act gate is
// the same machine (gestureDispatcher.armActHoldGate): hold the sign, the
// gauge fills (soft decay if dropped), the fx charge follows, done. ──
let bundleVfx = null, bundleBypassOff = null;
function enterNode() {
  if (bundleBypassOff) { bundleBypassOff(); bundleBypassOff = null; }
  gestureDispatcher.disarmActGate(); $('scam').classList.remove('on');
  $('splash').classList.add('gone'); $('bundleAct').classList.remove('gone');
  loadVortex().then(() => {                           // dust hugging the gift; the high-five hold winds it into the funnel
    if (self.RitualVortex && !$('bundleAct').classList.contains('gone') && !$('giftwrap').classList.contains('opening'))
      bundleVfx = self.RitualVortex.mount($('bundleAct'), { circle: false, cy: .45, spread: .26 });
  });
  bundleBypassOff = registerBypass('mở túi quà (giơ ✋)', () => { if (bundleBypassOff) { bundleBypassOff(); bundleBypassOff = null; } openGift(); });
  gestureDispatcher.armActHoldGate(cameraEngine, $('bcam'), 5,
    () => !$('bundleAct').classList.contains('gone') && !$('giftwrap').classList.contains('opening'),
    p => { $('bundleAct').style.setProperty('--bc', p); $('giftwrap').classList.toggle('charging', p > .06);
           if (bundleVfx) bundleVfx.setCharge(p * .95); },
    openGift);
}
function openGift() {
  const g = $('giftwrap'); if (g.classList.contains('opening')) return;
  if (bundleBypassOff) { bundleBypassOff(); bundleBypassOff = null; }
  gestureDispatcher.disarmActGate(); $('bcam').classList.remove('on'); g.classList.remove('charging');
  if (bundleVfx) bundleVfx.burst();                   // the charged dust detonates as the wrap tears
  g.classList.add('opening'); $('gifthint').textContent = '…';
  setTimeout(() => { g.classList.add('gone'); $('gifthint').classList.add('gone');
    $('bundleAct').querySelector('.actsub').style.display = 'none'; $('got').classList.remove('gone');
    setTimeout(enterBook, 1900);                      // no TAKE IT — savour the card, then straight into the notebook
  }, 850);
}
function enterBook() {
  if (bundleVfx) { bundleVfx.stop(); bundleVfx = null; }
  $('bundleAct').classList.add('gone'); $('book').classList.remove('gone'); notebookRunner.buildCells();
}
$('enterBtn').onclick = enterNode;
$('giftwrap').onclick = openGift;
// BUG FIX (owner: "lúc nào vào cũng có hộp quà chờ bạn" — the gift/bundle
// act was replaying on EVERY page load, even when returning mid-lesson to a
// node already entered this session/before). The splash→bundle act is meant
// to run once per fresh entry; a valid resume checkpoint (progressStore's
// decideResume, same check buildCells() uses to jump back into the
// notebook) means the player already opened the bundle and got the machine
// — skip both acts silently and drop straight into the book at the saved
// cell. A missing/invalid checkpoint (first visit, or a sealed-then-cleared
// node) still plays the full splash → bundle ritual as designed.
if (progressStore.decideResume(N.cells.length).resume) { $('splash').classList.add('gone'); enterBook(); }
else {
  let splashBypassOff = registerBypass('vào node (giơ ☝)', () => { if (splashBypassOff) { splashBypassOff(); splashBypassOff = null; } enterNode(); });
  setTimeout(() => gestureDispatcher.armActHoldGate(cameraEngine, $('scam'), 1, () => !$('splash').classList.contains('gone'),
    p => $('enterBtn').style.setProperty('--gc', p), () => { if (splashBypassOff) { splashBypassOff(); splashBypassOff = null; } enterNode(); }), 0); // after script eval — camera helpers live below this section
}

// ── Space bypass (cheat mode only) — see engine/bypass-registry.js. ──
installBypassKey(() => toast('⏭ CHEAT'));

// ── worker boot: one Pyodide worker; Python globals persist across cells ──
async function fetchText(u) { try { const r = await fetch(u); return r.ok ? await r.text() : null; } catch { return null; } }
async function boot() {
  if (!self.crossOriginIsolated) return;
  const sources = {};
  for (const [name, path] of Object.entries(N.modules || {})) sources[name] = await fetchText(path);
  await pyBridge.boot(sources);
}
window.addEventListener('load', boot);

// ── dev-only hand recorder for nodeDev.recordHands() below: taps every
// frame gestureDispatcher.onHands already sees (via cameraEngine's onFrame,
// wired above), so recording never changes the live gesture-dispatch path —
// it just observes. Downloads {t, lm} JSON on stop; see lessons/traces/. ──
let handRecording = null;
function recordHandFrame(res) {
  if (!handRecording) return;
  const has = res.multiHandLandmarks && res.multiHandLandmarks.length > 0;
  handRecording.frames.push({ t: performance.now() - handRecording.t0, lm: has ? res.multiHandLandmarks[0] : null });
}

// ── CHEAT PANEL (dev/testing) + window.nodeDev console API ──
window.nodeDev = {
  force: n => ritual.forceFingerCount(n),
  chant: t => ritual.forceChant(t),        // dev hook: inject a fake transcript through the real matcher (RITUAL-VARIANTS-PLAN.md Part B)
  choice: i => ritual.forceChoice(i),      // dev hook: resolve the ritual's pre-seal choice phase (defaults to the correct option) — KICKOFF-PLAN.md Part B. No Space-bypass registry existed yet at the time of writing; this is a plain console/cheat-panel hook like `chant`, not wired to any bulk-skip key.
  // recordHands(seconds=5) — console-only (never surfaced in cheat-panel.js's
  // buttons, so it stays unreachable from student-facing UI): starts the
  // camera, records raw {t, lm} frames for `seconds`, then downloads a JSON
  // trace — the record half of the record/replay workflow (see
  // lessons/test-dispatcher.mjs's replay test + lessons/traces/README.md).
  recordHands: (seconds = 5) => {
    if (handRecording) { console.warn('nodeDev.recordHands: already recording'); return; }
    cameraEngine.ensure().then(() => {
      handRecording = { t0: performance.now(), frames: [] };
      console.log(`nodeDev.recordHands: recording for ${seconds}s…`);
      setTimeout(() => {
        const { frames } = handRecording; handRecording = null;
        const blob = new Blob([JSON.stringify(frames)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `hand-trace-${Date.now()}.json`;
        document.body.appendChild(a); a.click(); a.remove();
        console.log(`nodeDev.recordHands: captured ${frames.length} frames`, frames);
      }, seconds * 1000);
    });
  },
  skip: () => notebookRunner.devForce(notebookRunner.seq[notebookRunner.frontier]),
  // skip splash/bundle straight into the book at cell 0 without forcing any
  // cells past — used by dev-test.html so a trimmed-down NODE.cells (see
  // that file) opens directly on the one cell being tested
  toFirst: () => notebookRunner.devTo(() => true, () => { enterNode(); openGift(); }),
  toBoss: () => notebookRunner.devTo(c => !!c.boss, () => { enterNode(); openGift(); }),
  toRitual: () => notebookRunner.devTo(c => !!c.ritual, () => { enterNode(); openGift(); }),
  // jump straight to whichever quiz cell first uses a non-default gesture
  // verb (e.g. the node00 'track' pilot) — for testing new verbs without
  // replaying the whole node
  toGestureQuiz: () => notebookRunner.devTo(c => !!(c.quiz && c.quiz.questions.some(q => q.gesture)), () => { enterNode(); openGift(); }),
  // jump straight to node03's three_rules.py — the code cell that actually
  // exercises fire_vortex()/lighten()/darken() via real camera finger counts
  // (1/3/4), instead of replaying two_rules.py + the gifts first
  toLightenDarken: () => notebookRunner.devTo(c => c.label === 'three_rules.py', () => { enterNode(); openGift(); }),
  // jump to the boss AND pull its first round matching `gesture` to the
  // front (e.g. the node02 'swipe' pilot) — for testing new boss verbs
  toGestureRound: async (g = 'swipe') => { await notebookRunner.devTo(c => !!c.boss, () => { enterNode(); openGift(); });
    notebookRunner.devBoss()?._dev.toGesture(g); },
  // jump to the boss AND pull its `finisher:true` round to the front —
  // otherwise only reachable by clearing every earlier round for real
  toFinisherRound: async () => { await notebookRunner.devTo(c => !!c.boss, () => { enterNode(); openGift(); });
    notebookRunner.devBoss()?._dev.toFinisher(); },
  cast: (k = 'fire') => { notebookRunner.devScene($('book').classList.contains('gone')); castingApi.castSpell(k); },
  screen: m => { notebookRunner.devScene($('book').classList.contains('gone')); screenFx(scenePanel, m || 'lighten', t => notebookRunner.outLine('t-sys', t)); },
  bossHp: (v = 1) => notebookRunner.devBoss()?._dev.setHp(v),
  winBoss: () => notebookRunner.devBoss()?._dev.win(),
  // koDetonate() — dev/testing hook for BOSS CONCEPT V2's gesture-only KO
  // fight (boss-fight.js's `boss:{ko:true}`, e.g. node02 + every THÁP VÔ
  // ĐỊNH boss floor): forces the aim→unleash ritual straight to detonation,
  // same "no camera → still resolvable headlessly" convention as bossHp/
  // winBoss above — see boss-fight.js#koDetonate.
  koDetonate: () => notebookRunner.devBoss()?._dev.koDetonate(),
  // deployBomb() — dev/testing hook for THỢ RÈN's boss bomb control
  // (boss-fight.js#deployBomb): fires the same debounced-per-round "bùm
  // chéo" deploy the visible 💣 button does, no forged bomb required to
  // reach it in a dev session (spendBomb() still runs for real — grant one
  // via nodeDev.grantBombs(1) first, or this is a no-op with 0 bombs).
  deployBomb: () => notebookRunner.devBoss()?._dev.deployBomb(),
  // grantBadge(id)/grantBadges(n)/grantBombs(n) — dev/testing shortcuts to
  // populate the THỢ RÈN inventory without replaying gift cells for real.
  grantBadge: (id = `dev-${Date.now()}`) => inventory.addBadge(id),
  grantBadges: (n = 2) => { for (let i = 0; i < n; i++) inventory.addBadge(`dev-${Date.now()}-${i}`); },
  // cost:0 + bonus:1 (guaranteed-success chance) forges without touching real
  // badges at all — a clean way to grant bombs for boss-deploy testing.
  grantBombs: (n = 1) => { for (let i = 0; i < n; i++) inventory.forgeBomb(0, { bonus: 1 }); },
  seal: () => ritual.seal(),
  // jump straight to a specific cell by its content `label` (e.g. a node's
  // `watch_print.py`) — a generic version of toLightenDarken/toBoss above,
  // for tests/console work that need one particular cell without hand-
  // authoring a new devTo predicate per target.
  toCell: label => notebookRunner.devTo(c => c.label === label, () => { enterNode(); openGift(); }),
  // checkDisplay() — run the shared display-invariants check (engine/dom-
  // invariants.js) from the console or a Playwright script: every live cell
  // actually visible, no two cells overlapping, #scenepanel/#cam singleton
  // and correctly contained in whichever cell is running. Returns
  // {ok, issues}; logs issues to console for a human at devtools.
  checkDisplay: () => { const r = checkCellDisplayInvariants(); if (!r.ok) console.warn('nodeDev.checkDisplay:', r.issues); return r; },
};
window.inventory = inventory;   // THỢ RÈN console access for dev/testing (nodeDev.grant* above are the friendlier wrappers)
installCheatToggle(window.nodeDev);
