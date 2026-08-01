// playtest-full.mjs — REAL playthrough smoke test: onboarding → map → every
// node00v2..node07v2 → both bonus islands. NO cheat/bypass/nodeDev shortcuts
// for normal resolution — every cell is resolved via the exact same real DOM
// affordance a camera-less human would use (the tap/click fallback every
// gesture gate in this codebase ships with, per PEDAGOGY-METHOD.md's "no
// dead ends" rule). The ONE exception (owner-approved): if the SAME live
// cell hasn't budged for STUCK_MS despite every solver getting a turn each
// poll — a genuine engine edge case no click/type sequence can resolve, not
// something a real player could work around either — driveNotebook flips on
// cheat mode for real (types "pip", same as a human dev would) and force-
// completes via window.nodeDev.skip(). This is loud, not silent: the run is
// marked `cheated` and the summary flags it so a cheated pass is never
// mistaken for a clean one.
//
// ARCHITECTURE: one CellSolver subclass per cell/act TYPE — each is fully
// self-contained (its own selectors + its own resolve logic, nothing shared
// but the base contract), so adding/fixing support for one cell type never
// touches another. The driving loop (see driveNotebook) just asks each
// registered solver "is your thing live right now?" in priority order and
// lets the first match resolve itself — no giant if/else, no cross-type
// knowledge leaking between handlers.
//
// SETUP (one-time):
//   npm i -D playwright && npx playwright install chromium
// RUN (serve.py must already be running — python serve.py, port 8123):
//   node lessons/playtest-full.mjs [--headed] [--demo] [--base http://localhost:8123]
//   node lessons/playtest-full.mjs --only towers --base http://localhost:8123
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const demo = args.includes('--demo');
const headed = args.includes('--headed') || demo;
const baseArgIdx = args.indexOf('--base');
const BASE = baseArgIdx >= 0 ? args[baseArgIdx + 1] : 'http://localhost:8123';
const onlyArgIdx = args.indexOf('--only');
const ONLY = onlyArgIdx >= 0 ? args[onlyArgIdx + 1] : null; // e.g. --only node3  or  --only island01 — fast single-page debug iteration
const screensArgIdx = args.indexOf('--screens');
const SCREEN_DIR = screensArgIdx >= 0 ? args[screensArgIdx + 1] : (process.env.PLAYTEST_SCREENSHOTS || null);
const beat = async page => { if (demo) await page.waitForTimeout(900); };

const NODE_PAGES = Array.from({ length: 8 }, (_, i) => i).filter(i => !ONLY || ONLY === `node${i}`).map(i => ({ i, file: `lesson0${i}v2.html` }));
const ISLAND_PAGES = [
  { id: 'island01', file: 'island01.html' },
  { id: 'island02', file: 'island02.html' },
  { id: 'islandIO', file: 'islandIO.html' },
  { id: 'islandVARHOSP', file: 'islandVARHOSP.html' },
  { id: 'islandSTRINGLAB', file: 'islandSTRINGLAB.html' },
  { id: 'islandMARKET', file: 'islandMARKET.html' },
  { id: 'islandEFFECTSTAGE', file: 'islandEFFECTSTAGE.html' },
  { id: 'islandFXFORGE', file: 'islandFXFORGE.html' },
  { id: 'islandAR', file: 'islandAR.html' },
  { id: 'islandBRANCH', file: 'islandBRANCH.html' },
  { id: 'islandCOMPARE', file: 'islandCOMPARE.html' },
  { id: 'islandWHILE', file: 'islandWHILE.html' },
  { id: 'islandTYPES', file: 'islandTYPES.html' },
  { id: 'islandPROJECT1', file: 'islandPROJECT1.html' },
  { id: 'islandRPS', file: 'islandRPS.html' },
  { id: 'islandAR2', file: 'islandAR2.html' },
  { id: 'islandPATTERN', file: 'islandPATTERN.html' },
  { id: 'islandNESTEDFOR', file: 'islandNESTEDFOR.html' },
].filter(p => !ONLY || p.id === ONLY || p.file.startsWith(ONLY));
const TOWER_PAGES = [
  { id: 'tower', course: 'tower', title: 'Tháp Vô Định' },
  { id: 'towerINFERNO', course: 'inferno', title: 'Tháp Luyện Ngục' },
  { id: 'towerSTANDARDIO', course: 'standardio', title: 'Tháp Nhập Xuất' },
  { id: 'towerOPERATORS', course: 'operators', title: 'Tháp Toán Tử' },
  { id: 'towerLOOPCONTROL', course: 'loopcontrol', title: 'Tháp Điều Khiển Vòng' },
  { id: 'towerCOLLECTIONS', course: 'collections', title: 'Tháp Collection' },
  { id: 'towerDICTIONARIES', course: 'dictionaries', title: 'Tháp Từ Điển' },
  { id: 'towerERRORS', course: 'errors', title: 'Tháp Xử Lý Lỗi' },
].filter(p => ONLY && (ONLY === 'towers' || p.id === ONLY || p.course === ONLY));
let shotSeq = 0;
const safeFile = s => String(s || 'state').normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'state';

// Real engine timing constants this script must respect for the ritual's
// no-camera hold fallback (engine/constants.js) — kept in sync by hand since
// this script has no build step / import access into the browser bundle.
const CAMERA_WAIT_MS = 5000;   // ritual: no-camera fallback (#holdBtn) appears after this
const HOLD_SEC = 2;            // #holdBtn must be held this long to seal
// the one currently-interactive notebook cell. `.remember` is excluded on
// purpose: it's the ONLY cell type notebook-runner.js's isBlocking() treats
// as non-blocking (see revealNext()) — it gets `.veiled` removed like any
// other cell but NEVER gains `.done` (nothing ever calls completeCell on
// it), so without this exclusion every remember callout a node has already
// shown would match `:not(.veiled):not(.done)` FOREVER, alongside whatever
// is genuinely live — solvers would then act on the wrong (stale) cell.
const LIVE = '.cell:not(.veiled):not(.done):not(.remember)';

function trackErrors(page, allErrors) {
  let label = 'boot';
  page.on('pageerror', e => allErrors.push(`${label}: [pageerror] ${e.message}`));
  page.on('console', msg => { if (msg.type() === 'error') allErrors.push(`${label}: [console.error] ${msg.text()}`); });
  return l => { label = l; };
}

// clickBox(page, locator) — a real click via Playwright's own `.click()`
// (auto-waits for the element to be visible/enabled first). A raw
// `page.mouse.click(x, y)` at a pre-computed bounding box was tried first and
// silently missed live targets mid-animation (charge/fade-in fx running on
// quiz options etc.) — no error, just a click that landed on nothing
// actionable, which drained the answer queue on every "miss" retry without
// ever actually resolving the question. `.click()` fixes that, BUT several
// of this game's own cells carry a permanent CSS pulse/breathing animation
// (giftwrap's glow, the pin's beacon, etc.) that never satisfies
// Playwright's "stable position across two frames" check — `force: true`
// skips ONLY that stability wait (still a real click at the current visible
// position, still waits for visible+enabled), which is the correct fix for
// an intentionally-always-animating target, not a workaround for a miss.
async function clickBox(page, locator) {
  await locator.click({ timeout: 10_000, force: true });
}

// buildAnswerQueue(node) — every quiz-like question this node will show, IN
// DOCUMENT ORDER (top-level quiz cells → forge.quiz → legacy boss.rounds'
// quiz-shaped rounds → the ritual's word-choice, if any) — matches the exact
// order NotebookRunner reveals them, so QuizSolver/RitualChoiceSolver can
// just pop the next expected correct index off the SAME shared queue.
function buildAnswerQueue(node) {
  const q = [];
  for (const c of node.cells || []) {
    if (c.quiz) for (const item of c.quiz.questions) q.push(item.correct);
    if (c.forge && Array.isArray(c.forge.quiz)) for (const item of c.forge.quiz) q.push(item.correct);
    if (c.boss && Array.isArray(c.boss.rounds)) for (const r of c.boss.rounds) if (Array.isArray(r.a) && typeof r.correct === 'number') q.push(r.correct);
  }
  if (node.ritual && node.ritual.choice) q.push(node.ritual.choice.correct);
  return q;
}

// buildSolutionMap(node) — label -> the cell's own authored `solution`
// field (see validate-content.mjs's `code.solution` schema entry), for
// every code cell that has one. This is the PRIMARY way CodeSolver resolves
// a "tự làm"/"sửa lỗi" cell: read the fix the content's own author wrote,
// never guess one. autoFixPython (below) only covers the rare case a cell
// needs fixing but has no `solution` yet (flagged by validate-content.mjs's
// warnFixItCellMissingSolution — treat that WARN as "add a solution", not
// as permission to keep relying on the heuristic fallback).
function buildSolutionMap(node) {
  const m = new Map();
  for (const c of node.cells || []) {
    if (c.code !== undefined && typeof c.solution === 'string' && c.label) m.set(c.label, c.solution);
    if (c.boss && Array.isArray(c.boss.rounds)) for (const r of c.boss.rounds) if (r.code !== undefined && typeof r.solution === 'string' && r.label) m.set(r.label, r.solution);
  }
  return m;
}

// buildExpectOutLabels(node) — labels of code cells that actually HAVE an
// `expectOut` — a cell without one can never legitimately fail a grading
// check (notebook-runner.js#onDone only runs the expectOut comparison when
// `el._expectOut` is truthy), so CodeSolver must never try to "fix" one —
// any `.t-sys` line it shows (e.g. FingerAskSolver's own no-camera notice)
// is incidental, not a failure signal, and chasing it would just re-run the
// cell forever for nothing.
function buildExpectOutLabels(node) {
  const s = new Set();
  for (const c of node.cells || []) {
    if (c.code !== undefined && c.expectOut !== undefined && c.label) s.add(c.label);
    if (c.boss && Array.isArray(c.boss.rounds)) for (const r of c.boss.rounds) if (r.code !== undefined && r.expectOut !== undefined && r.label) s.add(r.label);
  }
  return s;
}

// buildInputMap(node) — label -> [sampleInput...] (normalized to an array),
// for every code cell that authored one — see validate-content.mjs's
// `code.sampleInput` schema entry. Read by ReadInputSolver instead of
// falling back to a generic placeholder for cells whose expectOut requires
// a specific literal value.
function buildInputMap(node) {
  const m = new Map();
  for (const c of node.cells || []) {
    if (c.code !== undefined && c.sampleInput !== undefined && c.label) m.set(c.label, [].concat(c.sampleInput));
    if (c.boss && Array.isArray(c.boss.rounds)) for (const r of c.boss.rounds) if (r.code !== undefined && r.sampleInput !== undefined && r.label) m.set(r.label, [].concat(r.sampleInput));
  }
  return m;
}

// buildFingerHints(node) — label -> the cell's own `expect` field (the
// finger count(s) notebook-runner.js's fingerAsk() ACTUALLY validates the
// typed answer against — ask-gate.js/fingerAsk rejects and re-prompts on
// any value not in this set, independent of expectOut). Every watch()-based
// cell that cares which finger count comes back already authors `expect`,
// so FingerAskSolver can use it as a scalable default (no separate
// `sampleInput` needed per cell) — found via node05v2.js's first_else.py,
// which looped on FingerAskSolver's generic "3" default forever because
// `expect: 5` rejected it every time.
function buildFingerHints(node) {
  const m = new Map();
  for (const c of node.cells || []) {
    if (c.code !== undefined && c.expect !== undefined && c.label) m.set(c.label, [].concat(c.expect).map(String));
    // legacy boss rounds (node.js's rounds[] combat, still used by node03)
    // author `expect` the exact same way top-level code cells do — missing
    // this scan meant a boss round's finger-count code cell (e.g.
    // watch_strike.py) never got its hint, looping on the generic "3"
    // default against an `exp` that only accepted a different value.
    if (c.boss && Array.isArray(c.boss.rounds)) for (const r of c.boss.rounds) if (r.code !== undefined && r.expect !== undefined && r.label) m.set(r.label, [].concat(r.expect).map(String));
  }
  return m;
}

// autoFixPython(src) — LAST-RESORT mechanical fallback for a code cell that
// needs fixing but has no authored `solution` yet (see buildSolutionMap
// above — that's the correct fix; this is a stopgap for what validate-
// content.mjs's warnFixItCellMissingSolution should already be flagging).
// Covers only the three bug shapes this game's own "sửa lỗi" cells teach
// (missing `:` on a control-flow header, a block statement not indented
// under one, an unfilled "..." placeholder in an otherwise-complete "tự
// làm" template) — never per-node hardcoding.
function autoFixPython(src) {
  let lines = src.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const header = lines[i].match(/^(\s*)(if|elif|else|while)\b.*[^:\s]$/);
    if (header && lines[i + 1] !== undefined && lines[i + 1].trim() !== '') lines[i] = lines[i] + ':';
  }
  for (let i = 0; i < lines.length - 1; i++) {
    const header = lines[i].match(/^(\s*)(if|elif|else|while)\b.*:\s*$/);
    if (!header) continue;
    const headIndent = header[1].length, next = lines[i + 1];
    if (next === undefined || next.trim() === '') continue;
    const nextIndent = (next.match(/^(\s*)/) || ['', ''])[1].length;
    if (nextIndent <= headIndent) lines[i + 1] = ' '.repeat(headIndent + 4) + next.trim();
  }
  return lines.join('\n').replace(/"\.\.\."/g, '"abc"');
}

// ════════════════════════════════════════════════════════════════════════
// CellSolver — the abstract contract every concrete solver implements:
//   detect(page): Promise<boolean> — is MY kind of thing live right now?
//     (encapsulated: only this class knows its own selectors/DOM shape)
//   act(page, ctx): Promise<void>  — resolve it for real (click/hold/type),
//     no cheat, no bypass-registry, no nodeDev.
// A subclass never needs to know about any other cell type — isolation.
// ════════════════════════════════════════════════════════════════════════
class CellSolver {
  get label() { return this.constructor.name; }
  async detect(_page) { throw new Error(`${this.label}.detect() not implemented`); }
  async act(_page, _ctx) { throw new Error(`${this.label}.act() not implemented`); }
}

// ── act-level solvers (outside the notebook's .cell flow) ──

class SplashSolver extends CellSolver {
  async detect(page) {
    return page.evaluate(() => {
      const s = document.querySelector('#splash');
      return !!(s && !s.classList.contains('gone') && document.querySelector('#enterBtn'));
    });
  }
  async act(page) { await clickBox(page, page.locator('#enterBtn')); }
}

class BundleGiftSolver extends CellSolver {
  async detect(page) {
    return page.evaluate(() => {
      const b = document.querySelector('#bundleAct');
      if (!b || b.classList.contains('gone')) return false;
      const gw = document.querySelector('#giftwrap');
      return !!(gw && !gw.classList.contains('gone') && !gw.classList.contains('opening'));
    });
  }
  async act(page) { await clickBox(page, page.locator('#giftwrap')); }
}

// ritual's word-choice lives in the fullscreen #ritualOverlay, OUTSIDE the
// notebook's .cell flow entirely (ritual-controller.js opens it directly) —
// its own solver, sharing the SAME answer queue as QuizSolver since it's
// just another quiz-shaped question in the same document-order sequence.
class RitualChoiceSolver extends CellSolver {
  constructor(answerQueue) { super(); this.answerQueue = answerQueue; }
  // STALENESS GUARD: unlike quiz-cell.js's pick() (which disables every
  // .qopt synchronously on a correct answer), ritual-controller.js's
  // #onChoiceResult only adds a `.yes` class and waits 620ms before
  // #enterSealPhase() — the buttons stay enabled the whole time. Without
  // checking for `.yes` here, a poll landing in that 620ms window would
  // shift ANOTHER index off the queue for a click that's actually a no-op
  // (#pickChoice already early-returns once `#choiceResolved` is true) —
  // silently draining the queue for nothing.
  async detect(page) { return page.evaluate(() => {
    const host = document.querySelector('#ritualOverlay .rchoice'); if (!host) return false;
    if (host.querySelector('.qopt.yes')) return false;
    return host.querySelectorAll('.qopts .qopt:not(:disabled)').length > 0;
  }); }
  async act(page, ctx) {
    const idx = this.answerQueue.shift();
    if (idx === undefined) throw new Error(`${ctx.label}: answerQueue ran dry but the ritual's word-choice is live`);
    await clickBox(page, page.locator('#ritualOverlay .rchoice .qopts .qopt:not(:disabled)').nth(idx));
  }
}

// ── notebook cell solvers (each scoped to the single live `.cell`) ──

class IntroSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => !!document.querySelector(sel)?.classList.contains('introcell'), LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE}.introcell`)); }
}

class CameoSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => !!document.querySelector(sel)?.classList.contains('cameo'), LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE}.cameo`)); }
}

class GiftSolver extends CellSolver {
  // gift-cell.js's open() guards on `.opened` and hides `.giftmini` once
  // called (`.giftwrap` gets `.gone`) — same staleness shape as anatomy's:
  // completeCell() fires ~1.2s AFTER open(), so a re-detect() on the next
  // driving-loop tick can still see this cell (not yet .done) even though
  // it's already opened; without the `.opened` exclusion here, a second
  // act() would try to click a now-hidden `.giftmini` and fail as "not visible".
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && !c.classList.contains('opened') && c.querySelector('.giftmini'));
  }, LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE} .giftmini`)); }
}

class CheckpointSolver extends CellSolver {
  // `.stamped` excluded for the same reason as GiftSolver's `.opened` guard:
  // checkpoint-cell.js's completeCell() also fires on a delay after stamp(),
  // so an already-stamped cell can still be "live" for a beat — clicking the
  // button again is harmless there (stamp() re-guards internally) but wastes
  // a cycle for nothing; skip it once actually stamped.
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && !c.classList.contains('stamped') && c.querySelector('.ckholdbtn'));
  }, LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE} .ckholdbtn`)); }
}

// widget-cell.js's interactive anatomy diagram: #inspect() clears `.lit` off
// EVERY part on each click (only the current one carries it, "already seen"
// is never marked in the DOM) — so a `:not(.lit)` poll would ping-pong
// between two parts forever. This solver instead clicks every `.part` once,
// in DOM order, in a single pass the first time it detects the cell.
class AnatomySolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => !!document.querySelector(sel)?.classList.contains('anatomy'), LIVE); }
  async act(page) {
    // clicking the last part schedules completeCell() ~900ms later (see
    // widget-cell.js#inspect) — this act() call itself finishes well before
    // that timer fires, so a re-detect() on the NEXT driving-loop tick can
    // still see this same still-not-.done cell and call act() again. Each
    // click is checked live (re-count before every click, not once up
    // front) so a re-entrant pass stops the moment the cell has actually
    // gone .done/veiled underneath it, instead of timing out on a locator
    // for a part that no longer matches the (now-gone) live cell.
    for (let i = 0; i < 8; i++) { // ANATOMY.length is 3 today; 8 is a generous ceiling, not a magic count
      const count = await page.locator(`${LIVE} .part`).count();
      if (i >= count) return;
      await clickBox(page, page.locator(`${LIVE} .part`).nth(i));
      await page.waitForTimeout(250);
    }
  }
}

// covers quiz-cell.js's .quizcell, forge-cell.js's quiz-mode (.fpopts.qopts),
// and legacy boss.rounds' quiz-shaped rounds — all three reuse the exact
// same `.qopts .qopt` button convention, so one solver + the shared answer
// queue handles every one of them uniformly.
class QuizSolver extends CellSolver {
  constructor(answerQueue) { super(); this.answerQueue = answerQueue; }
  async detect(page) { return (await page.locator(`${LIVE} .qopts .qopt:not(:disabled)`).count()) > 0; }
  async act(page, ctx) {
    const idx = this.answerQueue.shift();
    if (idx === undefined) throw new Error(`${ctx.label}: answerQueue ran dry but a quiz-shaped question is still live`);
    const options = page.locator(`${LIVE} .qopts .qopt:not(:disabled)`);
    if (process.env.PLAYTEST_TRACE) {
      const prompt = await page.locator(`${LIVE} .qq, ${LIVE} .fpq`).first().textContent().catch(() => 'quiz');
      ctx.log(`  [${ctx.label}] pick answer ${idx + 1}/${await options.count()} for ${String(prompt).trim().slice(0, 90)}`);
    }
    const answer = options.nth(idx);
    await answer.scrollIntoViewIfNeeded();
    const hitTarget = await answer.evaluate(el => {
      const box = el.getBoundingClientRect();
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      const topBox = top?.getBoundingClientRect();
      return {
        clickable: top === el || el.contains(top),
        answer: { x: box.x, y: box.y, width: box.width, height: box.height },
        covering: top ? { tag: top.tagName, className: top.className, text: top.textContent?.trim().slice(0, 40), x: topBox.x, y: topBox.y, width: topBox.width, height: topBox.height } : null,
      };
    });
    if (!hitTarget.clickable) throw new Error(`${ctx.label}: quiz answer is covered and cannot be clicked like a learner ${JSON.stringify(hitTarget)}`);
    await answer.click({ timeout: 10_000 });
  }
}

// covers code-cells.js's top-level .codecell AND legacy boss code rounds
// (rendered inside .bround) — same `.crun`/`._editor` convention either way.
// Real Pyodide execution + real expectOut gate; a "tự làm"/"sửa lỗi" cell
// whose starter code doesn't pass gets ONE mechanical autofix attempt (own
// A running code cell that calls read()/read_num() pauses mid-execution on
// notebook-runner.js#cellAsk, which appends a real `<input class="tin">`
// into the cell's `.cout` and waits for Enter — this is a SEPARATE live
// state from "the RUN button is enabled" (the cell is mid-run, .crun is
// disabled), so it needs its own solver, checked BEFORE CodeSolver would
// otherwise just sit waiting for a button that isn't there yet. "7" is a
// safe universal answer: valid for read_num() (parses as a number) AND for
// read()'s free-text prompts (a non-empty string satisfies every
// `{minLines}`/regex-shaped expectOut this game's "tự làm" cells use).
class ReadInputSolver extends CellSolver {
  #inputs;             // label -> [sampleInput...] (buildInputMap) — authored answers, in call order
  constructor(inputs) { super(); this.#inputs = inputs; }
  async detect(page) { return (await page.locator(`${LIVE} .cout .tin`).count()) > 0; }
  async act(page) {
    const input = page.locator(`${LIVE} .cout .tin`).last();
    const label = await input.evaluate(el => el.closest('.codecell,.bround')?.querySelector('.clabel')?.textContent || 'unlabeled')
      .catch(() => null);
    if (label === null) return; // raced the prompt resolving/disappearing between detect() and here — nothing to do
    const queue = this.#inputs.get(label);
    // runCell() clears `.cout` for every RUN, so prompt echoes provide a
    // per-run index and naturally reset sampleInput after a rerun.
    const idx = await input.evaluate(el => el.closest('.codecell,.bround')?.querySelectorAll('.cout .t-echo').length || 0);
    // "7" is the universal safe default (valid for read_num(), and a
    // non-empty string for read()'s open-ended prompts) — only reached for
    // cells whose expectOut is CONTENT-independent. A cell whose expectOut
    // requires a specific literal (e.g. "Tiểu hoàng tử") must carry an
    // authored `sampleInput` (validate-content.mjs's schema entry) — read
    // it here instead of guessing.
    const value = queue && queue[idx] !== undefined ? queue[idx] : '7';
    // FLAKINESS FIX: a cell with multiple read()s in a row (e.g. name+class)
    // showed intermittent hangs on the 2nd+ prompt — .fill()+.press('Enter')
    // could race the notebook's own DOM swap (cellAsk() replaces the whole
    // `<input>` with a plain echo line on submit), leaving this solver
    // uncertain whether the answer actually landed. Confirm submission by
    // waiting for THIS specific input to detach before advancing the
    // consumed-counter and returning — if it doesn't detach in time, don't
    // advance the counter, so the NEXT act() retries the SAME answer against
    // what is presumably still the same live prompt instead of skipping ahead.
    await input.fill(value).catch(() => {});
    await input.press('Enter').catch(() => {});
    await input.waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});
  }
}

// A running cell that calls watch() (camera finger-count) pauses on
// ask-gate.js's fingerAskStub, which shows the shared `#scask` number input
// (engine/dom-scaffold.js — NOT scoped to the cell, it's a fixed part of
// the scene panel) instead of ask-cell's `.tin` — a separate solver, same
// "read the authored answer, don't guess" contract as ReadInputSolver.
class FingerAskSolver extends CellSolver {
  #inputs; #fingerHints; #consumed = new Map(); // same per-label queue shape as ReadInputSolver
  constructor(inputs, fingerHints) { super(); this.#inputs = inputs; this.#fingerHints = fingerHints; }
  async detect(page) { return page.evaluate(() => {
    const ask = document.querySelector('#scask'); return !!(ask && ask.style.display !== 'none' && getComputedStyle(ask).display !== 'none');
  }); }
  async act(page) {
    const label = await page.evaluate(() => {
      const live = document.querySelector('.cell:not(.veiled):not(.done):not(.remember)');
      return live?.querySelector('.clabel')?.textContent || live?.querySelector('.qq')?.textContent || 'unlabeled';
    });
    const queue = this.#inputs.get(label);
    const idx = this.#consumed.get(label) || 0;
    // Priority: an explicit authored `sampleInput` first, then the cell's
    // own `expect` field (ask-gate.js/fingerAsk REJECTS and re-prompts any
    // typed count not in `expect` — independent of expectOut — so a generic
    // guess can loop forever; `expect` is the exact value(s) it validates
    // against, already authored on every cell that cares), then "3" as a
    // last-resort generic default for cells with neither.
    const hints = this.#fingerHints.get(label);
    const value = queue && queue[idx] !== undefined ? queue[idx] : hints && hints.length ? hints[0] : '3';
    this.#consumed.set(label, idx + 1);
    const input = page.locator('#scask input');
    await input.fill(String(value));
    await input.press('Enter');
  }
}

// internal state — encapsulated, no other solver touches it) before this
// solver reports the cell as genuinely unresolved (never fakes success).
class CodeSolver extends CellSolver {
  #solutions;              // label -> authored `solution` source (buildSolutionMap) — the PRIMARY fix path
  #hasExpectOut;           // Set<label> — see buildExpectOutLabels; a cell without one can never fail grading
  #triedFix = new Map();   // cell label -> already attempted a fix (authored solution, or autoFixPython as last resort) once
  #launched = new Set();   // cell label -> RUN already clicked once — see detect()'s staleness note
  #launchedAt = new Map(); // cell label -> first click time; lets strict E2E retry a visibly dropped RUN
  #solveFirst;
  constructor(solutions, hasExpectOut, { solveFirst = false } = {}) {
    super();
    this.#solutions = solutions;
    this.#hasExpectOut = hasExpectOut;
    this.#solveFirst = solveFirst;
  }
  // short timeout + catch: `.evaluate()` waits (default 30s) for a matching
  // element to exist — if the notebook advances PAST this code cell in the
  // gap between `.count()` seeing it and `.evaluate()` running (the cell
  // finished for real right as we were about to check it), the locator
  // never resolves again. Racing the transition should fail fast, not hang.
  async #label(locator) {
    return locator.evaluate(el => el.closest('.codecell,.bround')?.querySelector('.clabel')?.textContent
      || el.closest('.codecell,.bround')?.querySelector('.qq')?.textContent || 'unlabeled', { timeout: 2000 })
      .catch(() => null);
  }
  async detect(page) {
    const btn = page.locator(`${LIVE} .crun:not([disabled]):not(.is-stop)`).first();
    if (!(await btn.count())) return false;
    const label = await this.#label(btn);
    if (label === null) return false; // raced the cell disappearing — nothing to act on
    if (!this.#launched.has(label)) return true;
    // A cell with no authored `expectOut` can NEVER fail grading —
    // notebook-runner.js#onDone only runs the comparison when `_expectOut`
    // is truthy, so it always auto-completes. Never re-act on one: any
    // `.t-sys` line it shows (e.g. FingerAskSolver's own "không mở được
    // camera" notice) is incidental chatter, not a failure signal — without
    // this guard CodeSolver would misread that notice as "needs a fix" and
    // re-run the cell forever for a cell that was never actually stuck
    // (found via node05v2's gap_in_rules.py, which has no expectOut at all).
    if (!this.#hasExpectOut.has(label)) return false;
    // STALENESS GUARD: notebook-runner.js's #clearRunning() re-enables EVERY
    // `.crun` on the page the moment ANY run finishes — including a run that
    // just SUCCEEDED, well before its OUTPUT_DWELL_MS-delayed completeCell()
    // actually marks the cell `.done`. Without this guard, the next driving-
    // loop tick sees "an enabled RUN button, cell not .done yet" on an
    // already-launched cell and clicks "▶ RUN LẠI" needlessly — which, for a
    // cell using read()/read_num(), re-opens a NEW input ask nothing is
    // listening for, wedging the Python worker forever. So: once launched,
    // only re-act if the PREVIOUS run genuinely needs a fix — either a real
    // Python error (`.cout .t-err`) or a CLEAN run that failed `expectOut`
    // (notebook-runner.js#onDone appends a `.r.t-fail` hint line for that
    // case, NOT `.t-err` — missing this the first time around was the bug:
    // a clean-but-wrong run left the cell permanently unresolved, since
    // nothing ever indicated it needed another look). A launched cell with
    // NEITHER present is just dwelling toward `.done` on its own — leave it.
    // `.t-fail` (not plain `.t-sys`) is load-bearing: fingerAsk()'s own
    // routine "👁 thấy N ngón tay" / "không mở được camera" notices ALSO carry
    // the plain t-sys class (same visual style) but are not failure signals —
    // matching bare `.t-sys` here misread that chatter as "needs a fix" and
    // re-ran/mangled an already-succeeding cell (found via node05v2.js's
    // too_narrow_rule.py, a finger-ask cell whose confirmation line tripped
    // this check well before the real expectOut verdict was even in).
    const state = await btn.evaluate(b => {
      const cell = b.closest('.codecell,.bround');
      return {
        failed: !!cell?.querySelector('.cout .t-err, .cout .r.t-fail'),
        output: cell?.querySelector('.cout')?.textContent?.trim() || '',
      };
    }, { timeout: 2000 }).catch(() => null);
    if (!state) return false;
    if (state.failed) return true;
    // A long shared-browser sweep can occasionally lose a RUN before Python
    // emits even one output token. A learner sees an enabled RUN button and
    // an empty console and presses it again; strict tower E2E should do the
    // same, while still leaving successful dwell states alone.
    return this.#solveFirst && !state.output && Date.now() - (this.#launchedAt.get(label) || Date.now()) > 8_000;
  }
  async act(page, ctx) {
    const runBtn = page.locator(`${LIVE} .crun:not([disabled]):not(.is-stop)`).first();
    // .closest() FROM the button itself — the editor container may BE the
    // live `.cell` (top-level code cell) or a nested `.bround` (boss round);
    // a descendant search from the outer cell misses the self-is-container case.
    const cellLabel = await this.#label(runBtn);
    if (cellLabel === null) return; // raced the cell disappearing between detect() and act() — nothing to do
    const erroredAlready = this.#launched.has(cellLabel);
    this.#launched.add(cellLabel);
    if (!erroredAlready) this.#launchedAt.set(cellLabel, Date.now());
    if (!erroredAlready && this.#solveFirst) {
      const authored = this.#solutions.get(cellLabel);
      if (authored === undefined) throw new Error(`${ctx.label}: tower code cell "${cellLabel}" has no authored solution`);
      await runBtn.evaluate((btn, src) => { btn.closest('.codecell,.bround')._editor.setValue(src); }, authored);
      await clickBox(page, runBtn);
      await page.waitForTimeout(1800);
      return;
    }
    if (erroredAlready) {
      // already tried a plain run once and it genuinely errored — go
      // straight to the fix instead of re-running the SAME known-broken
      // starter code (which would just re-open the same read() ask/error
      // loop for nothing).
      if (this.#triedFix.get(cellLabel)) throw new Error(`${ctx.label}: code cell "${cellLabel}" still unresolved after a fix attempt — needs a real fix in content, not faked`);
      this.#triedFix.set(cellLabel, true);
      await this.#applyFix(runBtn, cellLabel);
      return;
    }
    await clickBox(page, runBtn);
    await page.waitForTimeout(1800);
    if (!(await page.locator(`${LIVE} .crun:not([disabled]):not(.is-stop)`).count())) return; // advanced for real — nothing more to do
    // still live right after the FIRST click: either genuinely errored
    // already (rare — most errors surface after an intervening read() ask
    // ReadInputSolver handles on a later tick) or expectOut failed on a
    // clean run. Either way, apply the fix now.
    if (this.#triedFix.get(cellLabel)) throw new Error(`${ctx.label}: code cell "${cellLabel}" still unresolved after a fix attempt — needs a real fix in content, not faked`);
    this.#triedFix.set(cellLabel, true);
    await this.#applyFix(page.locator(`${LIVE} .crun:not([disabled]):not(.is-stop)`).first(), cellLabel);
  }
  // #applyFix(runBtn, cellLabel) — PRIMARY: the content's own authored
  // `solution` (buildSolutionMap) — exactly the fix a student is meant to
  // arrive at. Fall back to the mechanical autoFixPython heuristic ONLY if
  // the cell has none yet (validate-content.mjs's warnFixItCellMissingSolution
  // should be flagging that gap in content, not this script papering over it).
  async #applyFix(runBtn, cellLabel) {
    const authored = this.#solutions.get(cellLabel);
    const patched = authored !== undefined ? authored : autoFixPython(
      await runBtn.evaluate(btn => { const c = btn.closest('.codecell,.bround'); return c && c._editor ? c._editor.getValue() : ''; }));
    await runBtn.evaluate((btn, src) => { btn.closest('.codecell,.bround')._editor.setValue(src); }, patched);
    await clickBox(runBtn.page(), runBtn);
    await runBtn.page().waitForTimeout(1800);
  }
}

class ForgeAnvilSolver extends CellSolver {
  // `.forged` excluded — same delayed-completeCell staleness shape as
  // GiftSolver/CheckpointSolver above (forge-cell.js's finish() also fires
  // ~2.3s after a successful strike).
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && c.classList.contains('forgecell') && !c.classList.contains('forged') && c.querySelector('.anvil'));
  }, LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE} .anvil`)); }
}

// real content bug, not a script problem, when this fires: the forge before
// a KO boss didn't leave a bomb forged. Clicks the real "VỀ THỢ RÈN"
// fallback (boss-fight.js's own no-dead-end escape hatch) and scrolls there;
// ForgeAnvilSolver/QuizSolver pick the forge back up on the next poll.
class BossNoBombSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && c.classList.contains('bosscell') && c.querySelector('.konobomb:not(.gone)'));
  }, LIVE); }
  async act(page) { await clickBox(page, page.locator(`${LIVE} .kobackforge`)); await page.waitForTimeout(500); }
}

// BOSS CONCEPT V2's gesture-only KO fight: ☝ aim then ✋ unleash, both now
// real click targets on `.kobossholder` (a genuine tap-fallback fix added to
// boss-fight.js's #armKoAim/#armKoUnleash — see that file's header comment;
// every other hold gate in this codebase already had one, KO mode didn't).
class BossKoSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && c.classList.contains('bosscell') && c.querySelector('.kobossholder'));
  }, LIVE); }
  async clickLiveHolder(page) {
    const holder = page.locator(`${LIVE} .kobossholder`);
    if (!(await holder.count())) return false;
    const box = await holder.boundingBox().catch(() => null);
    if (!box) return false;
    // The boss is a large fixed target whose centre does not move during its
    // scale animation. A real mouse click avoids locator.click() waiting for
    // the cell's post-KO transition as if it were a navigation; that wait can
    // time out after the click already landed and "PHONG ẤN!" is visible.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    return true;
  }
  async act(page) {
    if (!(await this.clickLiveHolder(page))) return;
    await page.waitForTimeout(700); // aim
    await this.clickLiveHolder(page); // unleash
  }
}

// on a KO-boss node the boss fight IS the seal — the trailing ritual cell
// (`.ritualcell.koseal`) just auto-fires seal() on its own after a beat.
// Genuinely nothing to click; this solver only exists so the driving loop
// doesn't misreport it as an unresolved state.
class RitualAutoSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => !!document.querySelector(sel)?.classList.contains('ritualcell')
    && document.querySelector(sel).classList.contains('koseal'), LIVE); }
  async act(page) { await page.waitForTimeout(1400); }
}

class RitualStartSolver extends CellSolver {
  // #ritualBtn stays structurally present in the notebook cell even after
  // ritual.open() shows the fullscreen #ritualOverlay on top of it — without
  // checking the overlay's own `.gone` class, this solver would keep
  // re-clicking the (still-visible-underneath) button and calling
  // ritual.open() again on every poll, which — since no camera permission
  // means `#active` never becomes true — never early-returns, endlessly
  // restarting the camera-wait timer instead of ever reaching #holdBtn.
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel);
    const overlay = document.querySelector('#ritualOverlay');
    return !!(c && c.classList.contains('ritualcell') && !c.classList.contains('koseal')
      && document.querySelector('#ritualBtn') && overlay && overlay.classList.contains('gone'));
  }, LIVE); }
  async act(page) { await clickBox(page, page.locator('#ritualBtn')); }
}

// non-KO nodes' real ritual seal: no camera granted → #holdBtn fallback
// appears after CAMERA_WAIT_MS; must be held (real mousedown/up) for the
// full HOLD_SEC, exactly like a camera-less human would.
class RitualHoldSolver extends CellSolver {
  async detect(page) { return page.evaluate(() => {
    const hb = document.querySelector('#holdBtn'); return !!(hb && !hb.classList.contains('gone'));
  }); }
  async act(page) {
    const box = await page.locator('#holdBtn').boundingBox();
    if (!box) { await page.waitForTimeout(300); return; }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(HOLD_SEC * 1000 + 400); // real press-and-hold, full duration + margin
    await page.mouse.up();
  }
}

class IslandFinishSolver extends CellSolver {
  async detect(page) {
    if (await page.evaluate(() => typeof window.nodeDev?.towerState === 'function')) return false;
    return page.locator('.islandfinish:not(.veiled):not(.done) .ifbtn:visible').count().then(n => n > 0);
  }
  async act(page) { await clickBox(page, page.locator('.islandfinish:not(.veiled):not(.done) .ifbtn:visible')); }
}

// A complete tower shows its results overlay above the trailing finish card.
// Validate the real tower state before using the visible "VỀ BẢN ĐỒ" action.
class TowerResultsSolver extends CellSolver {
  async detect(page) { return (await page.locator('#towerresults .trmap:visible').count()) > 0; }
  async act(page, ctx) {
    const outcome = await page.evaluate(() => {
      const state = window.nodeDev?.towerState?.();
      const floorText = document.querySelector('#towerhud .thfloor')?.textContent || '';
      const match = floorText.match(/(\d+)\s*\/\s*(\d+)/);
      return {
        won: Boolean(state?.won),
        floor: Number(state?.floor || 0),
        topFloor: match ? Number(match[2]) : 0,
        score: Number(state?.score || 0),
        title: document.querySelector('#towerresults .trtitle')?.textContent || '',
      };
    });
    if (!outcome.won || outcome.floor !== outcome.topFloor || outcome.score <= 0 || !/CHINH PHỤC/.test(outcome.title)) {
      throw new Error(`${ctx.label}: invalid tower result ${JSON.stringify(outcome)}`);
    }
    ctx.towerOutcome = outcome;
    await clickBox(page, page.locator('#towerresults .trmap:visible'));
  }
}

// npc bubbles (typewriter, auto-advances on its own) and remember callouts
// (non-blocking per notebook-runner.js's isBlocking) need no action at all —
// this solver exists purely so the driving loop recognizes "nothing to do,
// it'll resolve itself" instead of logging it as unrecognized.
class PassiveWaitSolver extends CellSolver {
  async detect(page) { return page.evaluate(sel => {
    const c = document.querySelector(sel); return !!(c && (c.classList.contains('npc') || c.classList.contains('remember')));
  }, LIVE); }
  async act(page) { await page.waitForTimeout(400); }
}

// buildSolvers(answerQueue) — priority order matters: act-level gates first
// (splash/bundle/ritual-choice sit outside or before the notebook flow),
// then notebook cell types from most-specific to most-generic.
function buildSolvers(answerQueue, solutions, inputs, hasExpectOut, fingerHints, options = {}) {
  return [
    new SplashSolver(),
    new BundleGiftSolver(),
    new RitualChoiceSolver(answerQueue),
    new IntroSolver(),
    new CameoSolver(),
    new GiftSolver(),
    new CheckpointSolver(),
    new AnatomySolver(),
    new BossNoBombSolver(),
    new BossKoSolver(),
    // QuizSolver BEFORE ForgeAnvilSolver: forge-cell.js's `.anvil` element
    // exists in the DOM from construction regardless of quiz phase (it only
    // no-ops on click until canStrike()), so ForgeAnvilSolver would win every
    // priority tie-break and starve the quiz questions if it went first.
    new QuizSolver(answerQueue),
    new ReadInputSolver(inputs),
    new FingerAskSolver(inputs, fingerHints),
    new CodeSolver(solutions, hasExpectOut, options),
    new ForgeAnvilSolver(),
    new RitualAutoSolver(),
    new RitualStartSolver(),
    new RitualHoldSolver(),
    new TowerResultsSolver(),
    new IslandFinishSolver(),
    new PassiveWaitSolver(),
  ];
}

// driveNotebook(page, label, answerQueue, log) — ask each solver in turn "is
// your thing live?", let the first match resolve it, repeat until the
// ritual/finish card navigates home for real, or nothing resolves in time.
// diagnose(page) — the live cell's className + a text snippet, so a thrown
// error is actionable instead of a bare message (debug aid, not a solver).
async function diagnose(page) {
  return page.evaluate(sel => {
    const c = document.querySelector(sel);
    if (!c) return '(no live .cell — act-level state, check #splash/#bundleAct/#ritualOverlay)';
    const crun = c.querySelector('.crun');
    const crunInfo = crun ? ` crun[disabled=${crun.disabled}]` : ' (no .crun found)';
    const cout = c.querySelector('.cout');
    const coutInfo = cout ? ` cout="${cout.textContent.trim().slice(0, 200)}"` : '';
    return `class="${c.className}"${crunInfo}${coutInfo} text="${(c.textContent || '').trim().slice(0, 140)}"`;
  }, LIVE).catch(() => '(diagnose failed)');
}

// isNavAway(e) — the ritual/island-finish's own real navigation (seal() →
// onSealed() → location.href = './index.html') can fire WHILE a solver's
// page.evaluate() is still in flight, since it races the timer that
// triggers it — Playwright surfaces that as a generic "Execution context
// was destroyed" error, not a distinguishable success signal. Recognize it
// by message and let the caller re-check page.url() instead of treating a
// real, successful seal as a driving failure.
function isNavAway(e) { return /Execution context was destroyed|Target closed|Target page.*closed/i.test(e.message); }

// cellSignature(page) — a cheap "has the live thing actually changed" probe
// (class + a short text slice, ignoring volatile bits like crun[disabled]),
// used only to detect genuine stuck-ness for the last-resort cheat fallback
// below — NOT part of any solver's own resolve logic.
// Deliberately NOT raw textContent: a `.cout .tin` input mid-fill (this
// solver types into it, then waits for Enter to swap it for an echo line)
// makes the surrounding text flicker character-by-character for the ~50-100ms
// a fill takes — comparing full text on every 300ms poll falsely read that as
// "still changing" and could mask a genuinely stuck cell for a while, or
// (worse, the actual bug found) intermittently reset stuckSince right when a
// real hang started, delaying the cheat fallback well past STUCK_MS. Track
// STRUCTURAL progress instead — how many output lines exist, whether the
// pending `.tin` input is present at all, and the cell's own transient state
// classes (opened/stamped/forged/done-ish) — none of which flicker mid-type.
// text LENGTH (not the full string) — a cheap monotonic proxy that correctly
// tracks an npc bubble's typewriter still growing char-by-char (that cell has
// no `.cout`/state-class signal at all, so a purely structural signature
// went blind to it and could misfire the cheat fallback mid-typing) while
// staying far less noisy than a full-text diff (which flickered on a
// `.tin` input's OWN fill/submit cycle and delayed real-stuck detection).
async function cellSignature(page) {
  return page.evaluate(sel => {
    const c = document.querySelector(sel);
    if (!c) return '(none)';
    const cout = c.querySelector('.cout');
    const lineCount = cout ? cout.children.length : -1;
    const hasPendingAsk = !!(cout && cout.querySelector('.tin'));
    const stateFlags = ['opened', 'stamped', 'forged', 'yes', 'nope'].filter(f => c.querySelector(`.${f}`)).join(',');
    const textLen = (c.textContent || '').length;
    return `${c.className}|lines=${lineCount}|ask=${hasPendingAsk}|${stateFlags}|len=${textLen}`;
  }, LIVE).catch(() => '(unreadable)');
}

// STUCK_MS — if the SAME live thing hasn't budged for this long despite
// every real solver having a turn each poll, something genuinely
// unresolvable via click/type has happened (an engine edge case, not a
// gesture a normal player could work around either) — owner-approved
// last resort: flip on cheat mode for real (type "pip", same as a human
// dev would) and force-complete via the existing window.nodeDev.skip()
// hook, loudly logged so it's never mistaken for a real pass.
const STUCK_MS = 15_000;

async function cheatPastStuckCell(page, label, log) {
  log(`  [${label}] ⚠ CHEAT FALLBACK — stuck ${STUCK_MS / 1000}s on the same cell with no real solver able to resolve it; forcing past it (see summary)`);
  // Only RELOAD when the stuck cell is a code cell genuinely MID-RUN (crun
  // disabled — Python parked on a real ask() for a gesture that will now
  // never come): force-skipping it in place would leave the Pyodide WORKER
  // permanently wedged inside that abandoned Atomics.wait (found via
  // node04v2.js's photo_booth.py). A reload boots a fresh worker and
  // resumes via progress-versioning.js's own checkpoint. For every OTHER
  // stuck state (checkpoint/quiz/npc/etc — nothing running, no worker to
  // wedge) a plain in-place `nodeDev.skip()` is enough and avoids reload's
  // own reset/timing churn, which was observed to just relocate the
  // stuck-ness to a neighboring cell rather than fixing anything for those cases.
  const midRun = await page.locator(`${LIVE} .crun.is-stop, ${LIVE} .crun[disabled]`).count().catch(() => 0);
  if (midRun > 0) await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.keyboard.press('p'); await page.keyboard.press('i'); await page.keyboard.press('p'); // cheat-panel.js's typed toggle
  await page.waitForFunction(() => !!window.nodeDev, null, { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => window.nodeDev && window.nodeDev.skip && window.nodeDev.skip()).catch(() => {});
}

// cellLabel(page) — the STABLE identity of the live thing (its `.clabel`
// text if it's a code cell, else the signature itself) — used ALONGSIDE the
// fine-grained signature check for a second, coarser stuck detector: some
// interactions (photo_booth()'s repeated ✋/☝/✌ gesture-ask sequence, found
// via node04v2.js) keep generating genuine micro-changes every cycle (a new
// "👁 thấy N ngón tay" line each guess) that reset the fine signature forever,
// even though the CELL ITSELF never actually advances past its own label —
// no amount of guessing the wrong gesture in a fixed retry cap resolves a
// multi-stage sequence expecting a specific ORDER of holds.
async function cellLabel(page) {
  return page.evaluate(sel => document.querySelector(sel)?.querySelector('.clabel')?.textContent || null, LIVE).catch(() => null);
}
async function liveIdentity(page) {
  return page.evaluate(sel => {
    const cells = [...document.querySelectorAll('.cell')];
    const c = document.querySelector(sel);
    if (!c) {
      const splash = document.querySelector('#splash:not(.gone)');
      const bundle = document.querySelector('#bundleAct:not(.gone)');
      const overlay = document.querySelector('#ritualOverlay:not(.gone)');
      if (splash) return 'act-splash';
      if (bundle) return 'act-bundle';
      if (overlay) return 'act-ritual';
      return 'act-none';
    }
    const idx = cells.indexOf(c);
    const type = [...c.classList].filter(x => x !== 'cell' && x !== 'veiled' && x !== 'done').join('.');
    const label = c.querySelector('.clabel')?.textContent
      || c.querySelector('.qtitle')?.textContent
      || c.querySelector('.introtitle')?.textContent
      || c.querySelector('.remember h3')?.textContent
      || c.querySelector('.ctext')?.textContent
      || c.querySelector('.npc')?.textContent
      || c.textContent
      || 'cell';
    return `cell-${String(idx).padStart(2, '0')}-${type}-${label.trim().slice(0, 60)}`;
  }, LIVE).catch(() => null);
}
async function captureLive(page, runLabel, identity, log) {
  if (!SCREEN_DIR || !identity) return;
  try {
    await mkdir(SCREEN_DIR, { recursive: true });
    const file = `${String(++shotSeq).padStart(3, '0')}-${safeFile(runLabel)}-${safeFile(identity)}.png`;
    await page.screenshot({ path: path.join(SCREEN_DIR, file), fullPage: true });
  } catch (e) {
    log(`  [${runLabel}] screenshot failed for ${identity}: ${e.message}`);
  }
}
const STUCK_LABEL_MS = 30_000; // generous — real multi-stage interactions (forge, boss KO) legitimately take a while

async function driveNotebook(page, label, answerQueue, solutions, inputs, hasExpectOut, fingerHints, log, options = {}) {
  const solvers = buildSolvers(answerQueue, solutions, inputs, hasExpectOut, fingerHints, options);
  const ctx = { label, log };
  // 300s (not 180s): a reload-based cheat recovery (page reload + pyodide
  // reboot + replaying every earlier cell to resume) eats a real chunk of
  // wall-clock time on its own — a node that needs it and THEN hits a
  // second, unrelated stuck point shortly after was running out of overall
  // budget before STUCK_MS could even trigger a second time (found via
  // node04v2.js's photo_booth.py → checkpoint stamp sequence).
  const deadline = Date.now() + (options.deadlineMs || 300_000);
  let lastSig = null, stuckSince = Date.now(), cheated = false;
  let lastLabel = null, labelSince = Date.now();
  let lastShotIdentity = null;
  while (Date.now() < deadline) {
    if (/index\.html$/.test(new URL(page.url()).pathname)) return { sealed: true, cheated, towerOutcome: ctx.towerOutcome }; // sealed/finished and navigated home for real
    const shotIdentity = await liveIdentity(page);
    if (shotIdentity && shotIdentity !== lastShotIdentity) {
      lastShotIdentity = shotIdentity;
      await page.waitForTimeout(250);
      await captureLive(page, label, shotIdentity, log);
    }
    const sig = await cellSignature(page);
    if (sig !== lastSig) { lastSig = sig; stuckSince = Date.now(); }
    const curLabel = await cellLabel(page);
    if (curLabel !== lastLabel) { lastLabel = curLabel; labelSince = Date.now(); }
    if (Date.now() - stuckSince > STUCK_MS || (curLabel && Date.now() - labelSince > STUCK_LABEL_MS)) {
      if (options.allowCheat === false) throw new Error(`${label}: stuck during strict no-cheat playthrough — live cell: ${await diagnose(page)}`);
      await cheatPastStuckCell(page, label, log);
      cheated = true; stuckSince = Date.now(); lastSig = await cellSignature(page);
      labelSince = Date.now(); lastLabel = await cellLabel(page);
    }
    let acted = false;
    for (const solver of solvers) {
      let isLive;
      try { isLive = await solver.detect(page); }
      catch (e) { if (isNavAway(e)) { await page.waitForLoadState('domcontentloaded').catch(() => {}); break; } throw new Error(`${solver.label}.detect() threw: ${e.message} — live cell: ${await diagnose(page)}`); }
      if (isLive) {
        if (process.env.PLAYTEST_TRACE) log(`  [${ctx.label}] ${solver.label} → queue=${answerQueue.length} live=${await diagnose(page)}`);
        try { await solver.act(page, ctx); }
        catch (e) { if (isNavAway(e)) { await page.waitForLoadState('domcontentloaded').catch(() => {}); acted = true; break; } throw new Error(`${solver.label}.act() threw: ${e.message} — live cell: ${await diagnose(page)}`); }
        acted = true; break;
      }
    }
    if (!acted) await page.waitForTimeout(300);
    else await beat(page);
  }
  throw new Error(`${label}: driving loop timed out — live cell: ${await diagnose(page)}`);
}

async function main() {
  const browser = await chromium.launch({ headless: !headed, slowMo: demo ? 200 : 0 });
  const context = await browser.newContext({ permissions: [], viewport: demo ? { width: 1280, height: 860 } : undefined });
  const page = await context.newPage();
  const allErrors = [];
  const setLabel = trackErrors(page, allErrors);
  const results = [];

  console.log(`▶ playtest-full (REAL, no-cheat, OOP solvers): base=${BASE}${demo ? ' — DEMO' : ''}`);

  setLabel('boot/map');
  if (!demo) await page.addInitScript(() => { localStorage.setItem('magicdust.onboard', '1'); });
  await page.goto(`${BASE}/lessons/index.html${demo ? '' : '?noentry'}`, { waitUntil: 'domcontentloaded' });
  if (demo) {
    await page.waitForFunction(() => !!window.obDev, null, { timeout: 15000 }).catch(() => {});
    await beat(page);
    await page.evaluate(() => window.obDev && window.obDev.act && window.obDev.act(3)).catch(() => {});
    await beat(page);
    await page.evaluate(() => window.obDev && window.obDev.five && window.obDev.five()).catch(() => {});
    await beat(page);
  }
  await page.waitForSelector('#nodes', { timeout: 15000 });
  console.log('✓ map booted');
  await page.evaluate(() => window.saga && window.saga.reset());

  for (const { i, file } of NODE_PAGES) {
    const label = `node${i}`;
    setLabel(label);
    console.log(`▶ ${label} (${file}) — playing for real, no cheat…`);
    await page.goto(`${BASE}/lessons/${file}`, { waitUntil: 'domcontentloaded' });
    const node = await page.waitForFunction(() => !!window.NODE, null, { timeout: 15000 }).then(() => page.evaluate(() => window.NODE));
    const answerQueue = buildAnswerQueue(node);
    const solutions = buildSolutionMap(node);
    const inputs = buildInputMap(node);
    const hasExpectOut = buildExpectOutLabels(node);
    const fingerHints = buildFingerHints(node);
    try {
      const { cheated } = await driveNotebook(page, label, answerQueue, solutions, inputs, hasExpectOut, fingerHints, console.log);
      const done = await page.evaluate(() => parseInt(localStorage.getItem('magicdust.saga'), 10) || 0);
      console.log(`  [${label}] sealed for real — magicdust.saga now = ${done}`);
      results.push({ label, ok: true, cheated });
    } catch (e) {
      console.error(`  [${label}] ✗ ${e.message}`);
      results.push({ label, ok: false, error: e.message });
    }
  }

  for (const { id, file } of ISLAND_PAGES) {
    const label = id;
    setLabel(label);
    console.log(`▶ ${label} (${file}) — playing for real, no cheat…`);
    await page.goto(`${BASE}/lessons/${file}`, { waitUntil: 'domcontentloaded' });
    const node = await page.waitForFunction(() => !!window.NODE, null, { timeout: 15000 }).then(() => page.evaluate(() => window.NODE));
    const answerQueue = buildAnswerQueue(node);
    const solutions = buildSolutionMap(node);
    const inputs = buildInputMap(node);
    const hasExpectOut = buildExpectOutLabels(node);
    const fingerHints = buildFingerHints(node);
    try {
      const { cheated } = await driveNotebook(page, label, answerQueue, solutions, inputs, hasExpectOut, fingerHints, console.log);
      const flag = await page.evaluate(id => localStorage.getItem(`magicdust.sideisland.${id}`), id);
      console.log(`  [${label}] finished for real — side flag = ${flag}`);
      results.push({ label, ok: true, cheated });
    } catch (e) {
      console.error(`  [${label}] ✗ ${e.message}`);
      results.push({ label, ok: false, error: e.message });
    }
  }

  for (const { id, course, title } of TOWER_PAGES) {
    const label = id;
    setLabel(label);
    console.log(`▶ ${label} (${title}) — climbing every floor through the real UI…`);
    const query = new URLSearchParams({ course, e2e: String(Date.now()) });
    await page.goto(`${BASE}/lessons/tower.html?${query}`, { waitUntil: 'domcontentloaded' });
    const node = await page.waitForFunction(() => !!window.NODE, null, { timeout: 15_000 }).then(() => page.evaluate(() => window.NODE));
    const answerQueue = buildAnswerQueue(node);
    const solutions = buildSolutionMap(node);
    const inputs = buildInputMap(node);
    const hasExpectOut = buildExpectOutLabels(node);
    const fingerHints = buildFingerHints(node);
    try {
      const { cheated, towerOutcome } = await driveNotebook(
        page, label, answerQueue, solutions, inputs, hasExpectOut, fingerHints, console.log,
        { solveFirst: true, allowCheat: false, deadlineMs: course === 'tower' ? 900_000 : 420_000 },
      );
      if (cheated) throw new Error(`${label}: strict tower run used a cheat fallback`);
      if (answerQueue.length) throw new Error(`${label}: ${answerQueue.length} authored quiz answer(s) were not exercised`);
      if (!towerOutcome?.won) throw new Error(`${label}: results overlay did not report a win`);
      console.log(`  [${label}] conquered ${towerOutcome.floor}/${towerOutcome.topFloor} floors — score ${towerOutcome.score}`);
      results.push({ label, ok: true, cheated: false });
    } catch (e) {
      console.error(`  [${label}] ✗ ${e.message}`);
      results.push({ label, ok: false, error: e.message });
    }
  }

  await browser.close();

  console.log('\n════════ SUMMARY ════════');
  results.forEach(r => console.log(`  ${r.ok ? '✓' : '✗'} ${r.label}${r.cheated ? ' ⚠ (used cheat fallback — NOT a clean no-cheat pass)' : ''}${r.ok ? '' : ' — ' + r.error}`));
  if (allErrors.length) { console.log(`\n${allErrors.length} JS issue(s) captured:`); allErrors.forEach(e => console.log('  ' + e)); }
  process.exitCode = results.some(r => !r.ok) ? 1 : 0;
}

main().catch(e => { console.error('playtest-full: fatal', e); process.exitCode = 1; });
