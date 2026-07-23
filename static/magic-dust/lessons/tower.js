// tower.js — composition root for THÁP VÔ ĐỊNH (tower-climb mode). A fork of
// island.js (same splash → bundle → notebook acts, every engine/*.js module
// reused UNTOUCHED) — like a side island, its closing act is a plain finish
// card, NEVER ritual-controller.js's seal() (that writes the main
// 'magicdust.saga' counter keyed to N.index; a tower run must never touch
// it). On top of island.js's plumbing this file adds the tower-specific
// pieces TOWER-CLIMB-PLAN.md calls for: a lives/floor/score HUD backed by
// tower-state.js's pure TowerState, and a results screen shown on death or
// on clearing the top floor.
//
// Floor-boundary tracking: each floor's cell in content/tower.js carries an
// extra `floorNum` property that notebook-runner.js's buildCells() simply
// ignores (it only reads its own known keys — npc/code/quiz/boss/…, see that
// file's isKnownType()). After buildCells() runs, notebookRunner.seq is a
// public array of {cfg, el, done} in cell order — this file polls it for
// cfg.floorNum entries flipping done:false -> true to know when a floor
// clears, and watches #book for injected `.t-fail`/`.t-err` output lines
// (notebook-runner.js's onDone/onError, unmodified) to know when a code
// attempt failed, without editing notebook-runner.js at all.
import { $, mountPage, warnIfNotIsolated, scenePanelHtml } from './engine/dom-scaffold.js';
import { ProgressStore } from './engine/progress-store.js';
import { castSpell, showValue, screenFx, createFxQueue } from './engine/casting.js';
import { CameraEngine } from './engine/camera-engine.js';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';
import { PyBridge } from './engine/py-bridge.js?v=20260714-165347';
import { NotebookRunner } from './engine/notebook-runner.js?v=20260714-165347';
import { PhotoBooth } from './engine/photo-booth.js';
import { AskGate } from './engine/ask-gate.js';
import { installCheatToggle } from './engine/cheat-panel.js';
import { registerBypass, installBypassKey } from './engine/bypass-registry.js';
import { inventory } from './engine/inventory.js';
import { telemetry } from './engine/telemetry.js';

const N = window.NODE || { index: -1, title: 'Tower', cells: [] };
mountPage(N);
warnIfNotIsolated();

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

const scenePanel = document.createElement('div'); scenePanel.id = 'scenepanel';
scenePanel.innerHTML = scenePanelHtml();

const progressStore = new ProgressStore(N.index, N.cells, N.sideIslandId);
const fxQueue = createFxQueue();
const askGate = new AskGate();

function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
let vfxLoading = null;
function loadVortex() {
  vfxLoading ||= (self.RitualVortex ? Promise.resolve() : loadScript('./ritual-vortex.js')).catch(() => {});
  return vfxLoading;
}

let photoBooth = null, notebookRunner = null;
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
  onFrame: res => { gestureDispatcher.onHands(res); },
  watchdogActive: () => gestureDispatcher.hasActiveConsumer() || fxQueue.busy > 0,
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
  bridge: pyBridge, gestureDispatcher, cameraEngine, progressStore, casting: castingApi, photoBooth,
  scenePanel, bookEl: $('book'), pystatEl: $('pystat'), toast, askGate, loadVortex,
});

// ── TOWER HUD: lives/floor/score, backed by tower-state.js's pure TowerState
// (loaded as a bare global by tower.html, same convention as cell-validation.js
// — see that file's header). contentVersion()/window.contentVersion comes
// from progress-versioning.js, also a bare global, also already loaded. ──
const TOP_FLOOR = (N.cells || []).reduce((m, c) => Math.max(m, c.floorNum || 0), 0) || 20;
const towerVersion = window.contentVersion ? window.contentVersion(N.cells) : String((N.cells || []).length);
const towerId = N.sideIslandId || 'tower';
let towerState = window.loadTowerState ? window.loadTowerState(towerVersion, towerId) : { lives: 3, floor: 1, score: 0, over: false, won: false };
function persistTower() { if (window.saveTowerState) window.saveTowerState(towerState, towerVersion, towerId); }

const hud = document.createElement('div'); hud.id = 'towerhud';
hud.innerHTML = `<span class="thfloor">TẦNG <b>1</b>/${TOP_FLOOR}</span><span class="thlives">MẠNG <b>♥♥♥</b></span><span class="thscore">ĐIỂM <b>0</b></span>`;
const pythonStatus = $('pystat');
pythonStatus.setAttribute('aria-live', 'polite');
hud.appendChild(pythonStatus);
document.body.appendChild(hud);
function renderHud() {
  hud.querySelector('.thfloor b').textContent = `${Math.min(towerState.floor, TOP_FLOOR)}`;
  hud.querySelector('.thlives b').textContent = '♥'.repeat(towerState.lives) || '—';
  hud.querySelector('.thscore b').textContent = String(towerState.score);
}
renderHud();

// results screen — shown on death (lives==0) or on clearing the top floor.
function showResults() {
  gestureDispatcher.disarmActGate();
  telemetry.track('tower_result', {
    floor: towerState.floor,
    score: towerState.score,
    lives: towerState.lives,
    won: towerState.won,
  });
  if (towerState.won) telemetry.courseComplete(N, { completion: 'tower', floor: towerState.floor, score: towerState.score, won: true });
  const overlay = document.createElement('div'); overlay.id = 'towerresults';
  overlay.innerHTML = `
    <div class="trcard">
      <div class="trtitle">${towerState.won ? `✦ CHINH PHỤC ${N.title}! ✦` : '✦ RỚT KHỎI THÁP ✦'}</div>
      <div class="trsub">${towerState.won ? `Bạn đã leo hết cả ${TOP_FLOOR} tầng!` : `Bạn trụ tới tầng ${towerState.floor}/${TOP_FLOOR} rồi hết mạng.`}</div>
      <div class="trstats"><div>TẦNG ĐÃ LEO: <b>${Math.min(towerState.floor, TOP_FLOOR)}</b></div><div>ĐIỂM: <b>${towerState.score}</b></div></div>
      <div class="tractions"><button class="trretry">↺ LEO LẠI</button><button class="trmap">✦ VỀ BẢN ĐỒ</button></div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.trretry').onclick = () => {
    if (window.clearTowerState) window.clearTowerState(towerId);
    progressStore.clear();
    location.reload();
  };
  overlay.querySelector('.trmap').onclick = () => {
    if (window.clearTowerState) window.clearTowerState(towerId);
    progressStore.clear();
    location.href = './index.html';
  };
}

// Poll notebookRunner.seq for floor cells flipping done, and watch #book for
// failed-run output lines — see this file's header comment for why polling +
// a MutationObserver is used instead of editing notebook-runner.js.
const floorSeen = new Set();
let hudTimer = null;
function pollFloors() {
  if (towerState.over) return;
  const seq = notebookRunner.seq || [];
  for (const s of seq) {
    const fn = s.cfg && s.cfg.floorNum;
    if (!fn || floorSeen.has(fn) || !s.done) continue;
    floorSeen.add(fn);
    towerState.recordFloorClear(TOP_FLOOR);
    persistTower(); renderHud();
    if (towerState.over) { clearInterval(hudTimer); setTimeout(showResults, towerState.won ? 900 : 300); return; }
  }
}
hudTimer = setInterval(pollFloors, 300);

let missObserver = null;
function armMissWatch() {
  if (missObserver) return;
  missObserver = new MutationObserver(muts => {
    if (towerState.over) return;
    for (const m of muts) for (const node of m.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.classList.contains('t-fail') || node.classList.contains('t-err')) {
        towerState.recordMiss(); persistTower(); renderHud();
        if (towerState.over) { clearInterval(hudTimer); setTimeout(showResults, 300); return; }
      }
    }
  });
  missObserver.observe($('book'), { childList: true, subtree: true });
}

// side-island finish card — same as island.js's, closing the tower run
// WITHOUT ever touching ritual-controller.js/the main saga counter.
const SIDE_KEY = N.sideIslandId ? `magicdust.sideisland.${N.sideIslandId}` : null;
function finishFactory() {
  const el = document.createElement('div'); el.className = 'islandfinish';
  el.innerHTML = `
    <div class="iftitle">✦ XONG RỒI! ✦</div>
    <div class="ifsub">Bạn vừa chinh phục ${N.title}. Về lại bản đồ nào!</div>
    <button class="ifbtn"><i class="iffill"></i><span>✋ VỀ BẢN ĐỒ</span></button>
    <div class="bcam"><video playsinline muted></video><div class="bgauge"><i></i></div></div>`;
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    if (SIDE_KEY) try { localStorage.setItem(SIDE_KEY, '1'); } catch { /* storage may be unavailable */ }
    gestureDispatcher.disarmActGate(); el.querySelector('.bcam').classList.remove('on');
    if (window.clearTowerState) window.clearTowerState(towerId);
    progressStore.clear();
    telemetry.courseComplete(N, { completion: 'tower-exit', floor: towerState.floor, score: towerState.score, won: towerState.won });
    location.href = './index.html';
  };
  el.querySelector('.ifbtn').onclick = finish;
  el._arm = () => {
    const off = registerBypass(`${N.title.toLowerCase()} — về bản đồ (giữ ✋)`, () => { off(); finish(); });
    gestureDispatcher.armActHoldGate(cameraEngine, el.querySelector('.bcam'), 5, () => !done,
      p => el.style.setProperty('--ifc', p), () => { off(); finish(); });
  };
  return el;
}
notebookRunner.setRitualCellFactory(finishFactory);

// ── acts: splash → bundle → book (identical to island.js/node.js) ──
let bundleVfx = null, bundleBypassOff = null;
function enterNode() {
  if (bundleBypassOff) { bundleBypassOff(); bundleBypassOff = null; }
  gestureDispatcher.disarmActGate(); $('scam').classList.remove('on');
  $('splash').classList.add('gone'); $('bundleAct').classList.remove('gone');
  loadVortex().then(() => {
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
  if (bundleVfx) bundleVfx.burst();
  g.classList.add('opening'); $('gifthint').textContent = '…';
  setTimeout(() => { g.classList.add('gone'); $('gifthint').classList.add('gone');
    $('bundleAct').querySelector('.actsub').style.display = 'none'; $('got').classList.remove('gone');
    setTimeout(enterBook, 1900);
  }, 850);
}
function enterBook() {
  if (bundleVfx) { bundleVfx.stop(); bundleVfx = null; }
  $('bundleAct').classList.add('gone'); $('book').classList.remove('gone'); notebookRunner.buildCells();
  armMissWatch();
}
$('enterBtn').onclick = enterNode;
$('giftwrap').onclick = openGift;
let splashBypassOff = registerBypass(`vào ${N.title.toLowerCase()} (giơ ☝)`, () => { if (splashBypassOff) { splashBypassOff(); splashBypassOff = null; } enterNode(); });
setTimeout(() => gestureDispatcher.armActHoldGate(cameraEngine, $('scam'), 1, () => !$('splash').classList.contains('gone'),
  p => $('enterBtn').style.setProperty('--gc', p), () => { if (splashBypassOff) { splashBypassOff(); splashBypassOff = null; } enterNode(); }), 0);

installBypassKey(() => toast('⏭ CHEAT'));

async function fetchText(u) { try { const r = await fetch(u); return r.ok ? await r.text() : null; } catch { return null; } }
async function boot() {
  if (!self.crossOriginIsolated) return;
  const sources = {};
  for (const [name, path] of Object.entries(N.modules || {})) sources[name] = await fetchText(path);
  await pyBridge.boot(sources);
}
// tower.html resolves the selected course with dynamic imports before loading
// this module. On a warm cache the window load event may already be over, so
// registering only a load listener leaves every tower's Python worker asleep.
if (document.readyState === 'complete') boot();
else window.addEventListener('load', boot, { once: true });

window.nodeDev = {
  force: () => {},
  skip: () => notebookRunner.devForce(notebookRunner.seq[notebookRunner.frontier]),
  toFirst: () => notebookRunner.devTo(() => true, () => { enterNode(); openGift(); }),
  toRitual: () => notebookRunner.devTo(c => !!c.ritual, () => { enterNode(); openGift(); }),
  // toBoss()/nth boss floor — every 5th floor is a boss:{ko:true} gesture-KO
  // fight (boss-fight.js, same shape node02 uses); `n` jumps to the nth boss
  // encountered in floor order (floors 5/10/15/20/25/30).
  toBoss: (n = 1) => { let seen = 0; return notebookRunner.devTo(c => !!c.boss && ++seen >= n, () => { enterNode(); openGift(); }); },
  // dev-hook escape path for the boss:{ko:true} fights (mirrors node.js's
  // bossHp/winBoss/koDetonate) — required so every camera-gated cell here
  // stays resolvable headlessly, no webcam needed.
  bossHp: (v = 1) => notebookRunner.devBoss()?._dev.setHp(v),
  winBoss: () => notebookRunner.devBoss()?._dev.win(),
  koDetonate: () => notebookRunner.devBoss()?._dev.koDetonate(),
  cast: (k = 'fire') => { notebookRunner.devScene($('book').classList.contains('gone')); castingApi.castSpell(k); },
  screen: m => { notebookRunner.devScene($('book').classList.contains('gone')); screenFx(scenePanel, m || 'lighten', t => notebookRunner.outLine('t-sys', t)); },
  grantBadge: (id = `dev-${Date.now()}`) => inventory.addBadge(id),
  grantBadges: (n = 2) => { for (let i = 0; i < n; i++) inventory.addBadge(`dev-${Date.now()}-${i}`); },
  grantBombs: (n = 1) => { for (let i = 0; i < n; i++) inventory.forgeBomb(0, { bonus: 1 }); },
  // tower-only dev hooks
  towerMiss: () => { towerState.recordMiss(); persistTower(); renderHud(); if (towerState.over) showResults(); },
  towerFloor: () => { towerState.recordFloorClear(TOP_FLOOR); persistTower(); renderHud(); if (towerState.over) showResults(); },
  towerState: () => ({ ...towerState }),
};
window.inventory = inventory;
installCheatToggle(window.nodeDev);
