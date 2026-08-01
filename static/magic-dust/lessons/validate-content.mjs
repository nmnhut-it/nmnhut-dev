// node lessons/validate-content.mjs [glob] — dev-time content schema check
// for lessons/content/node*.js. These files are plain `window.NODE = {...}`
// scripts (not ES modules — node.js loads them via a <script> tag), so we
// load them with node:vm + a stub `window` instead of import(). Never
// shipped to the browser runtime; this is a Node-only authoring tool, like
// test-cell-validation.mjs / test-progress-versioning.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { GESTURE_VERBS, GESTURE_VERB_NAMES } from './engine/gesture-registry.js';
import { themeIssues } from './engine/ritual-theme.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── schema table — one place to extend when a new cell type/verb ships ──
// Each cell-type entry: required top-level key on the cell object, plus a
// `check(cellPayload, ctx)` that pushes {level, path, msg} into ctx.issues.
// Derived from the real branches in notebook-runner.js#buildCells (the
// npc/code/widget/gift/quiz/boss/cameo/remember chain) and each cell
// factory's own field reads (quiz-cell.js, boss-fight.js, gift-cell.js,
// cameo-cell.js, code-cells.js, widget-cell.js) — NOT invented from the
// field names alone.
const MAX_QUIZ_OPTIONS = 5;     // finger-count picking maxes out around one hand
const MAX_NPC_WORDS = 40;       // STORY.md / PEDAGOGY-METHOD.md: one short idea per Pip bubble
// gesture verb lists come from the registry (engine/gesture-registry.js) —
// registering a new verb there extends the schema here with no edit. Boss
// rounds may declare any registered verb (unwired ones fall back to
// finger-count, see boss-fight.js#armForRound); quiz questions only the
// verbs quiz-cell.js actually renders (registry's quizWired flag).
const BOSS_GESTURE_VERBS = [undefined, 'hold', ...GESTURE_VERB_NAMES];
const QUIZ_GESTURE_VERBS = [undefined, 'hold', ...GESTURE_VERB_NAMES.filter(n => GESTURE_VERBS[n].quizWired)];

function isPlainObject(v) { return v != null && typeof v === 'object' && !Array.isArray(v); }

// validateExpectOut mirrors cell-validation.js's cellOutputSatisfies shape
// contract exactly (string / RegExp / array / {all:[...]} / {minLines:N} /
// {kind,minCount,text?} / held-count map) — any other shape is silently a no-op pass at runtime,
// which would hide a typo, so it's an ERROR here.
function validateExpectOut(v, p, issues) {
  if (v == null) return;
  if (v instanceof RegExp || typeof v === 'string') return;
  if (Array.isArray(v)) { v.forEach((sub, i) => validateExpectOut(sub, `${p}[${i}]`, issues)); return; }
  if (isPlainObject(v)) {
    if (Array.isArray(v.all)) { v.all.forEach((sub, i) => validateExpectOut(sub, `${p}.all[${i}]`, issues)); return; }
    if (Array.isArray(v.sequence)) { v.sequence.forEach((sub, i) => validateExpectOut(sub, `${p}.sequence[${i}]`, issues)); return; }
    if (typeof v.minLines === 'number') return;
    if (typeof v.kind === 'string') {
      if (!v.kind.trim()) issues.push({ level: 'ERROR', path: `${p}.kind`, msg: 'expectOut event kind must not be empty' });
      if (v.minCount !== undefined && (!Number.isInteger(v.minCount) || v.minCount < 1))
        issues.push({ level: 'ERROR', path: `${p}.minCount`, msg: 'expectOut event minCount must be a positive integer' });
      if (v.text !== undefined) validateExpectOut(v.text, `${p}.text`, issues);
      if (v.exact !== undefined && typeof v.exact !== 'string') issues.push({ level: 'ERROR', path: `${p}.exact`, msg: 'expectOut event exact must be a string' });
      for (const key of Object.keys(v)) if (!['kind', 'minCount', 'text', 'exact'].includes(key))
        issues.push({ level: 'ERROR', path: `${p}.${key}`, msg: `unknown expectOut event field "${key}"` });
      return;
    }
    // held-finger-count map: every key must be a small integer string, every value a valid expectOut
    for (const [k, sub] of Object.entries(v)) {
      if (!/^\d+$/.test(k)) { issues.push({ level: 'ERROR', path: `${p}`, msg: `expectOut held-count key "${k}" is not a plain integer` }); continue; }
      validateExpectOut(sub, `${p}[${k}]`, issues);
    }
    return;
  }
  issues.push({ level: 'ERROR', path: p, msg: `expectOut has an illegal shape (${JSON.stringify(v)}) — must be string/RegExp/array/{all:[...]}/{minLines:N}/{kind,minCount,text?}/held-count map` });
}

// a {code:...} cell (bare or inside a boss round) with no expectOut is only
// legitimate for genuinely open-ended/camera-driven output (CLAUDE.md).
function warnMissingExpectOut(cell, p, issues) {
  if (cell.expectOut === undefined) issues.push({ level: 'WARN', path: p, msg: 'code cell has no expectOut — a clean-but-wrong run will still be treated as success unless this is intentionally open-ended' });
}

// checkQaShape(q, p, issues) — the {q, a, correct} shape shared by quiz
// questions and boss question-rounds; gesture verbs differ per caller
// (boss rounds only special-case 'swipe', quiz questions only 'track'), so
// gesture is validated by the caller, not here.
function checkQaShape(q, p, issues) {
  if (typeof q.q !== 'string' || !q.q.trim()) issues.push({ level: 'ERROR', path: `${p}.q`, msg: 'question missing `q` (prompt text)' });
  if (!Array.isArray(q.a)) { issues.push({ level: 'ERROR', path: `${p}.a`, msg: 'question missing `a` (answer options array)' }); }
  else {
    if (q.a.length > MAX_QUIZ_OPTIONS) issues.push({ level: 'ERROR', path: `${p}.a`, msg: `question has ${q.a.length} options — finger-count picking maxes out around ${MAX_QUIZ_OPTIONS}` });
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.a.length)
      issues.push({ level: 'ERROR', path: `${p}.correct`, msg: `\`correct\` (${q.correct}) is out of range for ${q.a.length} option(s)` });
  }
}
function checkQuizQuestion(q, p, issues) {
  checkQaShape(q, p, issues);
  if (!QUIZ_GESTURE_VERBS.includes(q.gesture)) issues.push({ level: 'ERROR', path: `${p}.gesture`, msg: `unknown quiz gesture verb "${q.gesture}" — allowed: ${QUIZ_GESTURE_VERBS.map(String).join(', ')}` });
}

function checkBossRound(r, p, issues) {
  if (!BOSS_GESTURE_VERBS.includes(r.gesture)) issues.push({ level: 'ERROR', path: `${p}.gesture`, msg: `unknown boss round gesture verb "${r.gesture}" — allowed: ${BOSS_GESTURE_VERBS.map(String).join(', ')}` });
  if (r.q !== undefined) {
    // question round — same {q,a,correct} shape as a quiz question, plus the swipe 2-option rule
    checkQaShape(r, p, issues);
    if (r.gesture === 'swipe' && (!Array.isArray(r.a) || r.a.length !== 2))
      issues.push({ level: 'ERROR', path: `${p}.a`, msg: `gesture:'swipe' round must have exactly 2 options (left/right), got ${Array.isArray(r.a) ? r.a.length : 'none'}` });
  } else {
    // code round — heal-the-spell / strike round
    if (typeof r.code !== 'string' || !r.code.trim()) issues.push({ level: 'ERROR', path: `${p}.code`, msg: 'boss code round missing `code`' });
    warnMissingExpectOut(r, `${p}.expectOut`, issues);
    validateExpectOut(r.expectOut, `${p}.expectOut`, issues);
  }
}

// CELL_SCHEMA — keyed by the cell's discriminating field, matching the exact
// ternary chain notebook-runner.js#buildCells uses to pick a cell factory.
// 'ritual' is deliberately NOT a legal key here: node.js only ever appends
// one synthetic `{ritual:true}` cell itself (see buildCells) — a content
// file should never author one; see the reported engine gotcha below.
const CELL_SCHEMA = {
  npc: {
    check(c, p, issues) {
      if (typeof c.npc !== 'string' || !c.npc.trim()) {
        issues.push({ level: 'WARN', path: `${p}.npc`, msg: 'npc cell has empty text' });
        return;
      }
      const wordCount = c.npc.trim().split(/\s+/u).length;
      if (wordCount > MAX_NPC_WORDS)
        issues.push({ level: 'WARN', path: `${p}.npc`, msg: `Pip bubble has ${wordCount} words — keep it at ${MAX_NPC_WORDS} or fewer and one idea per bubble` });
    }
  },
  walkthrough: {
    check(c, p, issues) {
      const w = c.walkthrough;
      if (!isPlainObject(w)) { issues.push({ level: 'ERROR', path: `${p}.walkthrough`, msg: 'walkthrough cell missing `walkthrough` object' }); return; }
      if (typeof w.title !== 'string' || !w.title.trim()) issues.push({ level: 'ERROR', path: `${p}.walkthrough.title`, msg: 'walkthrough missing `title`' });
      if (w.intro !== undefined && (typeof w.intro !== 'string' || !w.intro.trim())) issues.push({ level: 'ERROR', path: `${p}.walkthrough.intro`, msg: 'walkthrough.intro, if given, must be a non-empty string' });
      if (!Array.isArray(w.code) || !w.code.length || w.code.some(line => typeof line !== 'string')) {
        issues.push({ level: 'ERROR', path: `${p}.walkthrough.code`, msg: 'walkthrough.code must be a non-empty array of source lines' });
      }
      if (!Array.isArray(w.steps) || !w.steps.length) { issues.push({ level: 'ERROR', path: `${p}.walkthrough.steps`, msg: 'walkthrough.steps must be a non-empty array' }); return; }
      if (w.executedNote !== undefined && typeof w.executedNote !== 'string') issues.push({ level: 'ERROR', path: `${p}.walkthrough.executedNote`, msg: 'walkthrough.executedNote must be a string' });
      if (w.executedLines !== undefined && (!Array.isArray(w.executedLines) || w.executedLines.some(line => !Number.isInteger(line) || line < 1 || (Array.isArray(w.code) && line > w.code.length)))) issues.push({ level: 'ERROR', path: `${p}.walkthrough.executedLines`, msg: 'walkthrough.executedLines must contain existing 1-based code lines' });
      if (w.observeTitle !== undefined && typeof w.observeTitle !== 'string') issues.push({ level: 'ERROR', path: `${p}.walkthrough.observeTitle`, msg: 'walkthrough.observeTitle must be a string' });
      if (w.codeTitle !== undefined && typeof w.codeTitle !== 'string') issues.push({ level: 'ERROR', path: `${p}.walkthrough.codeTitle`, msg: 'walkthrough.codeTitle must be a string' });
      if (w.hint !== undefined && typeof w.hint !== 'string') issues.push({ level: 'ERROR', path: `${p}.walkthrough.hint`, msg: 'walkthrough.hint must be a string' });
      if (w.placeholder !== undefined && w.placeholder !== false && (!isPlainObject(w.placeholder) || typeof w.placeholder.src !== 'string' || !w.placeholder.src.trim())) issues.push({ level: 'ERROR', path: `${p}.walkthrough.placeholder`, msg: 'walkthrough.placeholder must be false or an object with non-empty src' });
      if (w.continueScene !== undefined && typeof w.continueScene !== 'boolean') issues.push({ level: 'ERROR', path: `${p}.walkthrough.continueScene`, msg: 'walkthrough.continueScene must be a boolean' });
      w.steps.forEach((step, index) => {
        const sp = `${p}.walkthrough.steps[${index}]`;
        if (!isPlainObject(step)) { issues.push({ level: 'ERROR', path: sp, msg: 'walkthrough step must be an object' }); return; }
        if (!Number.isInteger(step.line) || step.line < 1 || (Array.isArray(w.code) && step.line > w.code.length)) issues.push({ level: 'ERROR', path: `${sp}.line`, msg: 'step.line must point to an existing 1-based code line' });
        if (step.label !== undefined && (typeof step.label !== 'string' || !step.label.trim())) issues.push({ level: 'ERROR', path: `${sp}.label`, msg: 'step.label, if given, must be a non-empty string' });
        if (typeof step.explain !== 'string' || !step.explain.trim()) issues.push({ level: 'ERROR', path: `${sp}.explain`, msg: 'step missing a learner-facing explanation' });
        if (step.action !== undefined && (!isPlainObject(step.action) || typeof step.action.action !== 'string' || !step.action.action.trim())) issues.push({ level: 'ERROR', path: `${sp}.action`, msg: 'step.action must be an object with a non-empty action name' });
        if (step.observeMs !== undefined && (typeof step.observeMs !== 'number' || step.observeMs < 0 || step.observeMs > 4000)) issues.push({ level: 'ERROR', path: `${sp}.observeMs`, msg: 'step.observeMs must be between 0 and 4000' });
        if (step.memory !== undefined && typeof step.memory !== 'string') issues.push({ level: 'ERROR', path: `${sp}.memory`, msg: 'step.memory must be a string' });
      });
    },
  },
  programCounter: {
    check(c, p, issues) {
      const pc = c.programCounter;
      if (!isPlainObject(pc)) { issues.push({ level: 'ERROR', path: `${p}.programCounter`, msg: 'programCounter cell missing object' }); return; }
      if (typeof pc.title !== 'string' || !pc.title.trim()) issues.push({ level: 'ERROR', path: `${p}.programCounter.title`, msg: 'programCounter missing title' });
      if (typeof pc.intro !== 'string' || !pc.intro.trim()) issues.push({ level: 'ERROR', path: `${p}.programCounter.intro`, msg: 'programCounter missing learner-facing intro' });
      if (!Array.isArray(pc.cards) || !pc.cards.length) { issues.push({ level: 'ERROR', path: `${p}.programCounter.cards`, msg: 'programCounter.cards must be a non-empty array' }); return; }
      const numbers = new Set();
      pc.cards.forEach((card, index) => {
        const cp = `${p}.programCounter.cards[${index}]`;
        if (!isPlainObject(card)) { issues.push({ level: 'ERROR', path: cp, msg: 'card must be an object' }); return; }
        if (!Number.isInteger(card.number)) issues.push({ level: 'ERROR', path: `${cp}.number`, msg: 'card.number must be an integer' });
        else if (numbers.has(card.number)) issues.push({ level: 'ERROR', path: `${cp}.number`, msg: `duplicate card number ${card.number}` });
        else numbers.add(card.number);
        if (card.test !== undefined) {
          if (typeof card.test !== 'string' || !card.test.trim()) issues.push({ level: 'ERROR', path: `${cp}.test`, msg: 'test card needs a non-empty test' });
          if (!Number.isInteger(card.yes) || !Number.isInteger(card.no)) issues.push({ level: 'ERROR', path: cp, msg: 'test card needs integer yes and no targets' });
          if (card.result !== undefined && typeof card.result !== 'boolean') issues.push({ level: 'ERROR', path: `${cp}.result`, msg: 'test card result must be boolean' });
        } else if (card.action !== undefined) {
          if (typeof card.action !== 'string' || !card.action.trim()) issues.push({ level: 'ERROR', path: `${cp}.action`, msg: 'action card needs a non-empty action' });
          if (!Number.isInteger(card.goto)) issues.push({ level: 'ERROR', path: `${cp}.goto`, msg: 'action card goto must be an integer' });
        } else {
          if (typeof card.output !== 'string') issues.push({ level: 'ERROR', path: `${cp}.output`, msg: 'output card needs an output string' });
          if (!Number.isInteger(card.goto)) issues.push({ level: 'ERROR', path: `${cp}.goto`, msg: 'output card goto must be an integer' });
        }
      });
      if (pc.start !== undefined && !Number.isInteger(pc.start)) issues.push({ level: 'ERROR', path: `${p}.programCounter.start`, msg: 'programCounter.start must be an integer' });
      if (pc.end !== undefined && !Number.isInteger(pc.end)) issues.push({ level: 'ERROR', path: `${p}.programCounter.end`, msg: 'programCounter.end must be an integer' });
      if (pc.observeMs !== undefined && (typeof pc.observeMs !== 'number' || pc.observeMs < 0 || pc.observeMs > 4000)) issues.push({ level: 'ERROR', path: `${p}.programCounter.observeMs`, msg: 'programCounter.observeMs must be between 0 and 4000' });
      if (pc.history !== undefined && typeof pc.history !== 'boolean') issues.push({ level: 'ERROR', path: `${p}.programCounter.history`, msg: 'programCounter.history must be a boolean' });
      if (pc.frames !== undefined) {
        if (!Array.isArray(pc.frames) || !pc.frames.length) issues.push({ level: 'ERROR', path: `${p}.programCounter.frames`, msg: 'programCounter.frames must be a non-empty array' });
        else pc.frames.forEach((step, index) => {
          const sp = `${p}.programCounter.frames[${index}]`;
          if (!isPlainObject(step) || typeof step.phase !== 'string' || !Number.isInteger(step.pc) || typeof step.message !== 'string' || !step.message.trim()) issues.push({ level: 'ERROR', path: sp, msg: 'trace step needs phase, integer pc, and message' });
          if (step.card !== undefined && step.card !== null && !Number.isInteger(step.card)) issues.push({ level: 'ERROR', path: `${sp}.card`, msg: 'trace card must be null or integer' });
          if (step.output !== undefined && (!Array.isArray(step.output) || step.output.some(value => typeof value !== 'string'))) issues.push({ level: 'ERROR', path: `${sp}.output`, msg: 'trace output must be an array of strings' });
          if (step.memory !== undefined && typeof step.memory !== 'string') issues.push({ level: 'ERROR', path: `${sp}.memory`, msg: 'trace memory must be a string' });
        });
      }
    },
  },
  execution: {
    check(c, p, issues) {
      const trace = c.execution;
      if (!isPlainObject(trace)) { issues.push({ level: 'ERROR', path: `${p}.execution`, msg: 'execution cell missing object' }); return; }
      if (typeof trace.title !== 'string' || !trace.title.trim()) issues.push({ level: 'ERROR', path: `${p}.execution.title`, msg: 'execution missing title' });
      if (typeof trace.intro !== 'string' || !trace.intro.trim()) issues.push({ level: 'ERROR', path: `${p}.execution.intro`, msg: 'execution missing learner-facing intro' });
      if (!Array.isArray(trace.code) || !trace.code.length || trace.code.some(line => typeof line !== 'string')) issues.push({ level: 'ERROR', path: `${p}.execution.code`, msg: 'execution.code must be a non-empty array of lines' });
      if (!Array.isArray(trace.frames) || !trace.frames.length) { issues.push({ level: 'ERROR', path: `${p}.execution.frames`, msg: 'execution.frames must be a non-empty array' }); return; }
      trace.frames.forEach((frame, index) => {
        const fp = `${p}.execution.frames[${index}]`;
        if (!isPlainObject(frame)) { issues.push({ level: 'ERROR', path: fp, msg: 'codeTrace frame must be an object' }); return; }
        if (!Number.isInteger(frame.line) || frame.line < 1 || (Array.isArray(trace.code) && frame.line > trace.code.length)) issues.push({ level: 'ERROR', path: `${fp}.line`, msg: 'frame.line must point to an existing code line' });
        if (typeof frame.explain !== 'string' || !frame.explain.trim()) issues.push({ level: 'ERROR', path: `${fp}.explain`, msg: 'frame needs a learner-facing explanation' });
        if (frame.predict !== undefined) {
          if (!isPlainObject(frame.predict)) issues.push({ level: 'ERROR', path: `${fp}.predict`, msg: 'frame.predict must be an object' });
          else {
            if (typeof frame.predict.q !== 'string' || !frame.predict.q.trim()) issues.push({ level: 'ERROR', path: `${fp}.predict.q`, msg: 'prediction needs a concrete question' });
            if (!Array.isArray(frame.predict.options) || frame.predict.options.length < 2 || frame.predict.options.length > 3 || frame.predict.options.some(value => typeof value !== 'string' || !value.trim())) issues.push({ level: 'ERROR', path: `${fp}.predict.options`, msg: 'prediction needs 2-3 non-empty options' });
            if (!Number.isInteger(frame.predict.correct) || !Array.isArray(frame.predict.options) || frame.predict.correct < 0 || frame.predict.correct >= frame.predict.options.length) issues.push({ level: 'ERROR', path: `${fp}.predict.correct`, msg: 'prediction.correct must point to an option' });
          }
        }
        if (typeof frame.observeMs !== 'number' || frame.observeMs < 1200 || frame.observeMs > 4000) issues.push({ level: 'ERROR', path: `${fp}.observeMs`, msg: 'frame.observeMs must be between 1200 and 4000' });
        if (!isPlainObject(frame.state)) { issues.push({ level: 'ERROR', path: `${fp}.state`, msg: 'frame.state must be an object' }); return; }
        if (frame.state.variables !== undefined && !isPlainObject(frame.state.variables)) issues.push({ level: 'ERROR', path: `${fp}.state.variables`, msg: 'state.variables must be an object' });
        if (frame.state.output !== undefined && (!Array.isArray(frame.state.output) || frame.state.output.some(value => typeof value !== 'string'))) issues.push({ level: 'ERROR', path: `${fp}.state.output`, msg: 'state.output must be an array of strings' });
        if (frame.state.visual !== undefined && (!isPlainObject(frame.state.visual) || typeof frame.state.visual.kind !== 'string')) issues.push({ level: 'ERROR', path: `${fp}.state.visual`, msg: 'state.visual must be an object with kind' });
      });
    },
  },
  code: {
    check(c, p, issues) {
      if (typeof c.code !== 'string' || !c.code.trim()) issues.push({ level: 'ERROR', path: `${p}.code`, msg: 'code cell missing `code` (source string)' });
      warnMissingExpectOut(c, `${p}.expectOut`, issues);
      validateExpectOut(c.expectOut, `${p}.expectOut`, issues);
      // `solution` (optional): the correct/completed source for a "tự làm"
      // (fill-in) or "sửa lỗi" (fix-the-bug) cell — i.e. one whose starter
      // `code` is NOT expected to satisfy `expectOut` as authored. Read
      // directly by playtest-full.mjs's CodeSolver (no cheat/guessing: it
      // types the SAME fix a student is meant to arrive at, straight from
      // the content the node's own author wrote) instead of reverse-
      // engineering a fix from generic bug-pattern heuristics. Skip it only
      // when the starter `code` already satisfies `expectOut` as-is (a
      // runnable "bài mẫu" needs no separate solution).
      if (c.solution !== undefined && (typeof c.solution !== 'string' || !c.solution.trim()))
        issues.push({ level: 'ERROR', path: `${p}.solution`, msg: 'code.solution, if given, must be a non-empty string' });
      if (c.solutionExplanation !== undefined) {
        if (!Array.isArray(c.solutionExplanation) || !c.solutionExplanation.length) {
          issues.push({ level: 'ERROR', path: `${p}.solutionExplanation`, msg: 'code.solutionExplanation must be a non-empty array' });
        } else {
          const solutionLines = typeof c.solution === 'string' ? c.solution.split(/\r?\n/).length : 0;
          c.solutionExplanation.forEach((item, i) => {
            const ep = `${p}.solutionExplanation[${i}]`;
            if (!isPlainObject(item) || !Number.isInteger(item.line) || item.line < 1 || item.line > solutionLines || typeof item.text !== 'string' || !item.text.trim())
              issues.push({ level: 'ERROR', path: ep, msg: 'each explanation needs an existing 1-based solution line and non-empty text' });
          });
        }
        if (typeof c.solution !== 'string' || !c.solution.trim())
          issues.push({ level: 'ERROR', path: `${p}.solutionExplanation`, msg: 'code.solutionExplanation requires code.solution' });
      }
      if (c.stopCompletes !== undefined && typeof c.stopCompletes !== 'boolean')
        issues.push({ level: 'ERROR', path: `${p}.stopCompletes`, msg: 'code.stopCompletes, if given, must be true or false' });
      if (c.stopCompletes === true && c.expectOut === undefined)
        issues.push({ level: 'WARN', path: `${p}.stopCompletes`, msg: 'a STOP-completes cell should carry expectOut so stopping immediately cannot pass' });
      if (c.stickyOutput !== undefined && typeof c.stickyOutput !== 'boolean')
        issues.push({ level: 'ERROR', path: `${p}.stickyOutput`, msg: 'code.stickyOutput, if given, must be true or false' });
      // `sampleInput` (optional): what to type for this cell's read()/
      // read_num() prompt(s), in call order, when `expectOut` requires a
      // SPECIFIC literal value (e.g. "Tiểu hoàng tử"/"Tiểu công chúa") that a
      // generic placeholder answer can't satisfy. A string covers a single
      // read(); an array covers a cell with multiple read() calls, in order.
      // Read by playtest-full.mjs's ReadInputSolver — same "read the
      // authored answer, never guess" contract as `solution` above.
      if (c.sampleInput !== undefined) {
        const bad = typeof c.sampleInput === 'string' ? !c.sampleInput.trim()
          : Array.isArray(c.sampleInput) ? !c.sampleInput.length || c.sampleInput.some(v => typeof v !== 'string')
          : true;
        if (bad) issues.push({ level: 'ERROR', path: `${p}.sampleInput`, msg: 'code.sampleInput, if given, must be a non-empty string or a non-empty array of strings' });
      }
    },
  },
  widget: {
    check(c, p, issues) {
      const knownWidgets = new Set(['anatomy', 'pinhole', 'vision-lab']);
      if (typeof c.widget !== 'string' || !knownWidgets.has(c.widget)) {
        issues.push({ level: 'ERROR', path: `${p}.widget`, msg: `unknown widget "${c.widget}" — allowed: ${[...knownWidgets].join(', ')}` });
      }
      if (c.widget === 'vision-lab' && (!Array.isArray(c.deck) || c.deck.length !== 3)) {
        issues.push({ level: 'ERROR', path: `${p}.deck`, msg: 'vision-lab requires exactly three academic slides' });
      }
    },
  },
  gift: {
    check(c, p, issues) {
      const g = c.gift;
      if (!isPlainObject(g)) { issues.push({ level: 'ERROR', path: `${p}.gift`, msg: 'gift cell missing `gift` object' }); return; }
      if (typeof g.name !== 'string' || !g.name.trim()) issues.push({ level: 'ERROR', path: `${p}.gift.name`, msg: 'gift missing `name`' });
      // badge variant (PEDAGOGY-V2-PLAN.md reward beats): `badge` must be a
      // boolean, and when true, `badgeId` must be a non-empty string —
      // cross-node uniqueness is checked globally in main() (WARN only, see there).
      if (g.badge !== undefined && typeof g.badge !== 'boolean') issues.push({ level: 'ERROR', path: `${p}.gift.badge`, msg: 'gift.badge must be a boolean' });
      if (g.badge === true && (typeof g.badgeId !== 'string' || !g.badgeId.trim())) issues.push({ level: 'ERROR', path: `${p}.gift.badgeId`, msg: 'gift.badge is true but `badgeId` is missing/empty — badgeId must be a non-empty string' });
      if (g.badgeId !== undefined && typeof g.badgeId !== 'string') issues.push({ level: 'ERROR', path: `${p}.gift.badgeId`, msg: 'gift.badgeId must be a string' });
    },
  },
  quiz: {
    check(c, p, issues) {
      const q = c.quiz;
      if (!isPlainObject(q)) { issues.push({ level: 'ERROR', path: `${p}.quiz`, msg: 'quiz cell missing `quiz` object' }); return; }
      if (!Array.isArray(q.questions) || !q.questions.length) { issues.push({ level: 'ERROR', path: `${p}.quiz.questions`, msg: 'quiz missing a non-empty `questions` array' }); return; }
      q.questions.forEach((qq, i) => checkQuizQuestion(qq, `${p}.quiz.questions[${i}]`, issues));
    },
  },
  boss: {
    check(c, p, issues) {
      const b = c.boss;
      if (!isPlainObject(b)) { issues.push({ level: 'ERROR', path: `${p}.boss`, msg: 'boss cell missing `boss` object' }); return; }
      if (typeof b.name !== 'string' || !b.name.trim()) issues.push({ level: 'ERROR', path: `${p}.boss.name`, msg: 'boss missing `name`' });
      // BOSS CONCEPT V2 (FORGE-PLAN.md "FINALIZED"): `ko:true` bosses are a
      // pure gesture 1-hit-KO ritual (boss-fight.js#armGateKo) — NO round-HP
      // model, so hp/baseDmg/rounds are intentionally absent. The learning is
      // in the node's forge (`forge.quiz`), not the boss.
      if (b.ko === true) {
        if (b.rounds !== undefined) issues.push({ level: 'WARN', path: `${p}.boss.rounds`, msg: 'ko:true boss ignores `rounds` — the fight is gesture-only; move any questions into the forge cell (`forge.quiz`)' });
        return;
      }
      if (typeof b.hp !== 'number' || b.hp <= 0) issues.push({ level: 'ERROR', path: `${p}.boss.hp`, msg: 'boss missing a positive `hp`' });
      if (typeof b.baseDmg !== 'number' || b.baseDmg <= 0) issues.push({ level: 'ERROR', path: `${p}.boss.baseDmg`, msg: 'boss missing a positive `baseDmg`' });
      if (!Array.isArray(b.rounds) || !b.rounds.length) { issues.push({ level: 'ERROR', path: `${p}.boss.rounds`, msg: 'boss missing a non-empty `rounds` array (or set `ko:true` for a gesture-only KO boss)' }); return; }
      b.rounds.forEach((r, i) => checkBossRound(r, `${p}.boss.rounds[${i}]`, issues));
    },
  },
  cameo: {
    check(c, p, issues) {
      const cm = c.cameo;
      if (!isPlainObject(cm)) { issues.push({ level: 'ERROR', path: `${p}.cameo`, msg: 'cameo cell missing `cameo` object' }); return; }
      if (typeof cm.art !== 'string' || !cm.art.trim()) issues.push({ level: 'ERROR', path: `${p}.cameo.art`, msg: 'cameo missing `art`' });
    },
  },
  // intro: {title, hook, art?} — the cinematic title-card cell dropped as
  // the node's FIRST cell (engine/intro-cell.js). Non-blocking (tap or
  // auto-advance), so no required field beyond having something to show.
  intro: {
    check(c, p, issues) {
      const it = c.intro;
      if (!isPlainObject(it)) { issues.push({ level: 'ERROR', path: `${p}.intro`, msg: 'intro cell missing `intro` object' }); return; }
      if (typeof it.title !== 'string' || !it.title.trim()) issues.push({ level: 'ERROR', path: `${p}.intro.title`, msg: 'intro missing `title`' });
      if (typeof it.hook !== 'string' || !it.hook.trim()) issues.push({ level: 'ERROR', path: `${p}.intro.hook`, msg: 'intro missing `hook`' });
      if (it.art !== undefined && (typeof it.art !== 'string' || !it.art.trim())) issues.push({ level: 'ERROR', path: `${p}.intro.art`, msg: 'intro.art, if given, must be a non-empty string' });
    },
  },
  remember: {
    check(c, p, issues) {
      const r = c.remember;
      const lines = [].concat(r);
      if (!lines.length || lines.some(l => typeof l !== 'string' || !l.trim())) issues.push({ level: 'ERROR', path: `${p}.remember`, msg: 'remember cell has no text (must be a non-empty string or array of strings)' });
    },
  },
  checkpoint: {
    check(c, p, issues) {
      const ck = c.checkpoint;
      if (!isPlainObject(ck)) { issues.push({ level: 'ERROR', path: `${p}.checkpoint`, msg: 'checkpoint cell missing `checkpoint` object' }); return; }
      if (typeof ck.text !== 'string' || !ck.text.trim()) issues.push({ level: 'ERROR', path: `${p}.checkpoint.text`, msg: 'checkpoint missing `text`' });
      if (ck.sign !== undefined && (typeof ck.sign !== 'number' || ck.sign < 0 || ck.sign > 5)) issues.push({ level: 'ERROR', path: `${p}.checkpoint.sign`, msg: 'checkpoint.sign must be a finger count 0-5' });
      const known = new Set(['text', 'sign']);
      Object.keys(ck).forEach(k => { if (!known.has(k)) issues.push({ level: 'ERROR', path: `${p}.checkpoint.${k}`, msg: `unknown checkpoint key "${k}" — allowed: text, sign` }); });
    },
  },
  // pixelBoard: {plate, size?, text, task?} — the hand-editing board
  // (engine/pixel-board-cell.js). The task is what stops a learner clicking
  // past without touching a number, so its shape is checked strictly.
  pixelBoard: {
    check(c, p, issues) {
      const pb = c.pixelBoard;
      if (!isPlainObject(pb)) { issues.push({ level: 'ERROR', path: `${p}.pixelBoard`, msg: 'pixelBoard cell missing `pixelBoard` object' }); return; }
      if (typeof pb.text !== 'string' || !pb.text.trim()) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.text`, msg: 'pixelBoard missing `text` (say what to do)' });
      if (pb.plate !== undefined && typeof pb.plate !== 'string') issues.push({ level: 'ERROR', path: `${p}.pixelBoard.plate`, msg: 'pixelBoard.plate must be a plate name' });
      if (pb.size !== undefined && (typeof pb.size !== 'number' || pb.size < 4 || pb.size > 16)) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.size`, msg: 'pixelBoard.size must be 4-16 — past that the digits stop being readable' });
      if (pb.task !== undefined) {
        const t = pb.task;
        if (!isPlainObject(t)) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.task`, msg: 'pixelBoard.task must be an object' });
        else {
          if (t.mode !== 'dim' && t.mode !== 'brighten') issues.push({ level: 'ERROR', path: `${p}.pixelBoard.task.mode`, msg: 'pixelBoard.task.mode must be "dim" or "brighten"' });
          if (typeof t.amount !== 'number' || t.amount <= 0) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.task.amount`, msg: 'pixelBoard.task.amount must be a positive number' });
          if (t.label !== undefined && typeof t.label !== 'string') issues.push({ level: 'ERROR', path: `${p}.pixelBoard.task.label`, msg: 'pixelBoard.task.label must be a string naming the region' });
          if (t.region !== undefined && !isPlainObject(t.region)) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.task.region`, msg: 'pixelBoard.task.region must be {row0,row1,col0,col1}' });
        }
      }
      const known = new Set(['plate', 'size', 'text', 'task']);
      Object.keys(pb).forEach(k => { if (!known.has(k)) issues.push({ level: 'ERROR', path: `${p}.pixelBoard.${k}`, msg: `unknown pixelBoard key "${k}" — allowed: plate, size, text, task` }); });
    },
  },
  // forge: {cost?, practice?:[{q,a,correct}, …]} — THỢ RÈN cell
  // (engine/forge-cell.js). ADDITIVE ONLY per FORGE-PLAN.md: no schema field
  // here is required to be present — an empty {forge:{}} is legal (no
  // practice pool just means a "rèn hụt" retries the anvil directly).
  forge: {
    check(c, p, issues) {
      const f = c.forge;
      if (!isPlainObject(f)) { issues.push({ level: 'ERROR', path: `${p}.forge`, msg: 'forge cell missing `forge` object' }); return; }
      if (f.cost !== undefined && (typeof f.cost !== 'number' || f.cost <= 0)) issues.push({ level: 'ERROR', path: `${p}.forge.cost`, msg: 'forge.cost must be a positive number' });
      if (f.practice !== undefined) {
        if (!Array.isArray(f.practice) || !f.practice.length) issues.push({ level: 'ERROR', path: `${p}.forge.practice`, msg: 'forge.practice, if given, must be a non-empty array' });
        else f.practice.forEach((q, i) => checkQaShape(q, `${p}.forge.practice[${i}]`, issues));
      }
      // forge.quiz (BOSS CONCEPT V2): the migrated boss questions — answering
      // them IS the forge trial (forge-cell.js). Same {q,a,correct} shape as a
      // quiz question; if present it must be a non-empty array.
      if (f.quiz !== undefined) {
        if (!Array.isArray(f.quiz) || !f.quiz.length) issues.push({ level: 'ERROR', path: `${p}.forge.quiz`, msg: 'forge.quiz, if given, must be a non-empty array' });
        else f.quiz.forEach((q, i) => checkQaShape(q, `${p}.forge.quiz[${i}]`, issues));
      }
    },
  },
};
const CELL_KEYS = Object.keys(CELL_SCHEMA);

function checkCell(c, i, issues, seenQuizTitles) {
  const p = `cells[${i}]`;
  if (!isPlainObject(c)) { issues.push({ level: 'ERROR', path: p, msg: 'cell is not an object' }); return; }
  const matched = CELL_KEYS.filter(k => c[k] !== undefined);
  if (!matched.length) { issues.push({ level: 'ERROR', path: p, msg: `unknown cell type — none of {${CELL_KEYS.join(', ')}} present (falls through to a silent ritual-cell placeholder at runtime, see notebook-runner.js#buildCells)` }); return; }
  if (matched.length > 1) issues.push({ level: 'WARN', path: p, msg: `cell has more than one cell-type key (${matched.join(', ')}) — only the first in the npc/code/widget/gift/quiz/boss/cameo/remember chain is used` });
  CELL_SCHEMA[matched[0]].check(c, p, issues);
  if (matched[0] === 'quiz' && isPlainObject(c.quiz) && typeof c.quiz.title === 'string') {
    if (seenQuizTitles.has(c.quiz.title)) issues.push({ level: 'WARN', path: `${p}.quiz.title`, msg: `duplicate quiz title "${c.quiz.title}" earlier in this node` });
    seenQuizTitles.add(c.quiz.title);
  }
}

// ── HEURISTIC WARN checks (Framework Plan Step 5) ──
// Both are content-sequencing smells, not schema violations: WARN severity
// ONLY, must never contribute to exit code 1. Tuned against the real
// node00–node06 content (see the Step 4/5 delivery report for the final hit
// list); tighten further here if either fires noisily on new content.

// (a) bare-recall quiz smell: a question ending "là gì?" / "nghĩa là gì" is
// often level-1 recall ("say() là gì?") unless it's actually a concrete
// example/scenario (a backtick, a digit, or something snippet-like already
// makes it concrete, e.g. an error message or a piece of code quoted in the
// prompt) — see skill quiz-design / root CLAUDE.md's "Quiz/assessment
// content" (default level 2+).
const BARE_RECALL_RE = /(là gì\??|nghĩa là gì)\s*$/i;
const SNIPPET_LOOKING_RE = /[`(){}\[\]=]|'[A-Za-z_][\w]*'|"[A-Za-z_][\w]*"/;
function warnBareRecallQuiz(q, p, issues) {
  const t = (q.q || '').trim();
  if (!t) return;
  if (!BARE_RECALL_RE.test(t)) return;
  if (/\d/.test(t) || SNIPPET_LOOKING_RE.test(t)) return;   // has a digit or code-snippet-looking substring — treat as already concrete
  issues.push({ level: 'WARN', path: `${p}.q`, msg: `possible level-1 bare-recall quiz question (heuristic): "${t}"` });
}

// A quiz is rendered one question at a time. References such as "máy ở trên"
// or "vừa rồi" therefore hide data/code that the learner cannot see on the
// current card. Keep the regex narrow so ordinary phrases such as "trên cổng"
// or "hàng ở trên cùng" do not fire.
const HIDDEN_QUIZ_CONTEXT_RE = /(?:trong|ở)\s+(?:bài|đoạn|máy|thẻ|bảng|ví dụ|code)\s+(?:ở\s+)?trên|(?:bài|đoạn|thẻ|bảng|ví dụ|câu hỏi|lời đoán)\s+vừa\s+rồi|(?<![\p{L}\p{N}])ở\s+trên(?!\s+cùng)/iu;
function warnHiddenQuizContext(q, p, issues) {
  const t = (q.q || '').trim();
  if (t && HIDDEN_QUIZ_CONTEXT_RE.test(t))
    issues.push({ level: 'WARN', path: `${p}.q`, msg: 'quiz depends on nearby content (for example "ở trên"/"vừa rồi") — restate the needed data, rule, and code in this question' });
}
function warnHiddenTaskContext(N, issues) {
  (N.cells || []).forEach((c, i) => {
    if (typeof c.note === 'string' && HIDDEN_QUIZ_CONTEXT_RE.test(c.note))
      issues.push({ level: 'WARN', path: `cells[${i}].note`, msg: 'code task depends on nearby content (for example "ở trên"/"vừa rồi") — restate INPUT, PROCESS, and expected OUTPUT in this note' });
  });
}

// Threshold order is not universally low-to-high or high-to-low. It depends
// on the direction and overlap of the actual conditions. Warn when learner
// prose teaches an order but does not show <= or >= in the same statement.
const THRESHOLD_ORDER_RE = /(?:xếp|kiểm tra|hỏi)[^.!?\n]{0,100}mốc[^.!?\n]{0,50}(?:thấp[^.!?\n]{0,25}cao|cao[^.!?\n]{0,25}thấp)/iu;
function warnUnscopedThresholdOrder(N, issues) {
  (N.cells || []).forEach((c, i) => {
    const prose = glossaryProse(c);
    if (isPlainObject(c.forge) && Array.isArray(c.forge.quiz)) {
      c.forge.quiz.forEach((q, qi) => {
        if (typeof q.q === 'string') prose.push([`forge.quiz[${qi}].q`, q.q]);
        (Array.isArray(q.a) ? q.a : []).forEach((a, ai) => { if (typeof a === 'string') prose.push([`forge.quiz[${qi}].a[${ai}]`, a]); });
      });
    }
    for (const [suffix, text] of prose) {
      if (!THRESHOLD_ORDER_RE.test(text) || /(?:<=|>=)/.test(text)) continue;
      issues.push({ level: 'WARN', path: `cells[${i}].${suffix}`, msg: 'threshold order is stated without its comparison direction — scope the rule to the actual `<=` or `>=` conditions; low-to-high is not universal' });
    }
  });
}

// Student-visible identifiers must be English ASCII. Accented identifiers are
// always suspicious; the small ASCII deny-list catches common Vietnamese
// transliterations that Unicode checks cannot distinguish from valid Python.
const VIETNAMESE_ASCII_IDENTIFIERS = [
  'vang', 'tong', 'dem', 'chu_so', 'ket_qua', 'mat_khau', 'diem_so', 'tuoi', 'ten',
  'dieu_kien', 'da', 'so', 'diem', 'nam_sinh', 'con_vat', 'mon_an', 'so_hang',
  'so_cot', 'hang', 'cot', 'moi', 'cu'
];
const VIETNAMESE_ASCII_ID_SOURCE = VIETNAMESE_ASCII_IDENTIFIERS.join('|');
const ASSIGNED_IDENTIFIER_RE = /(?:^|\n)\s*([\p{L}_][\p{L}\p{N}_]*)\s*=/gmu;
const CONTROL_IDENTIFIER_RE = new RegExp(`\\b(?:if|elif|while)\\s+(${VIETNAMESE_ASCII_ID_SOURCE})\\b`, 'giu');
const INLINE_CODE_RE = /`([^`\n]+)`/gu;
function suspiciousIdentifiers(source) {
  const hits = new Set();
  for (const match of source.matchAll(ASSIGNED_IDENTIFIER_RE)) {
    const id = match[1];
    if (/[^\x00-\x7F]/u.test(id) || VIETNAMESE_ASCII_IDENTIFIERS.includes(id.toLowerCase())) hits.add(id);
  }
  for (const match of source.matchAll(CONTROL_IDENTIFIER_RE)) hits.add(match[1]);
  if (VIETNAMESE_ASCII_IDENTIFIERS.includes(source.trim().toLowerCase())) hits.add(source.trim());
  return [...hits];
}
function warnVietnameseIdentifiers(N, issues) {
  const scan = (source, path) => suspiciousIdentifiers(source).forEach(id => {
    issues.push({ level: 'WARN', path, msg: `student-visible variable "${id}" looks Vietnamese — use a descriptive English ASCII name such as score, count, total, digit, result, or gold` });
  });
  (N.cells || []).forEach((c, i) => {
    if (typeof c.code === 'string') scan(c.code, `cells[${i}].code`);
    if (typeof c.solution === 'string') scan(c.solution, `cells[${i}].solution`);
    const scanQa = (q, base) => {
      if (typeof q.q === 'string') for (const match of q.q.matchAll(INLINE_CODE_RE)) scan(match[1], `${base}.q`);
      (Array.isArray(q.a) ? q.a : []).forEach((a, ai) => {
        if (typeof a !== 'string') return;
        for (const match of a.matchAll(INLINE_CODE_RE)) scan(match[1], `${base}.a[${ai}]`);
      });
    };
    if (isPlainObject(c.quiz) && Array.isArray(c.quiz.questions)) c.quiz.questions.forEach((q, qi) => scanQa(q, `cells[${i}].quiz.questions[${qi}]`));
    if (isPlainObject(c.forge) && Array.isArray(c.forge.quiz)) c.forge.quiz.forEach((q, qi) => scanQa(q, `cells[${i}].forge.quiz[${qi}]`));
    if (isPlainObject(c.boss) && Array.isArray(c.boss.rounds)) c.boss.rounds.forEach((q, qi) => {
      if (q.q !== undefined) scanQa(q, `cells[${i}].boss.rounds[${qi}]`);
      if (typeof q.code === 'string') scan(q.code, `cells[${i}].boss.rounds[${qi}].code`);
      if (typeof q.solution === 'string') scan(q.solution, `cells[${i}].boss.rounds[${qi}].solution`);
    });
  });
}

// (b) untaught-vocabulary smell in boss code rounds: an identifier called
// (`identifier(`) in a boss round's code that never appeared as a call in
// any EARLIER {code:...} cell (or earlier boss round) in the SAME node is
// suspicious — it may be an untaught function smuggled into a boss finisher
// (the real bug root CLAUDE.md's "Lesson-content sequencing rules" section
// was written after — see notes there). Deliberately scoped per-node, not
// cross-node (a function taught in an earlier NODE and reused here is a
// legitimate "recombination" per node04's design notes) — so this can WARN
// on cross-node reuse; read the WARN, don't blindly silence it.
const CALL_RE = /\b([a-zA-Z_][a-zA-Z0-9_]{1,})\(/g;
function calledIdentifiers(code) {
  return Array.from(code.matchAll(CALL_RE)).map(m => m[1]).filter(id => id.length > 1 && id !== id.toUpperCase());
}
function warnUntaughtVocab(N, issues) {
  const taught = new Set();
  (N.cells || []).forEach((c, i) => {
    if (typeof c.code === 'string') { calledIdentifiers(c.code).forEach(id => taught.add(id)); return; }
    if (isPlainObject(c.boss) && Array.isArray(c.boss.rounds)) {
      c.boss.rounds.forEach((r, ri) => {
        if (typeof r.code !== 'string') return;
        const ids = calledIdentifiers(r.code);
        ids.forEach(id => { if (!taught.has(id)) issues.push({ level: 'WARN', path: `cells[${i}].boss.rounds[${ri}].code`, msg: `possible untaught vocabulary (heuristic): "${id}(" not seen in any earlier {code:...} cell in this node` }); });
        ids.forEach(id => taught.add(id));
      });
    }
  });
}

// validateRitualChant(N, issues) — the concept-chant ritual gate
// (RITUAL-VARIANTS-PLAN.md Part B). Both keys are optional (full backward
// compat with the existing gesture/prompt-only ritual shape); `chantAccept`
// only makes sense paired with `chant`.
// NEW HEURISTIC (checkpoint doctrine): a {checkpoint} cell not immediately
// followed by a {quiz} cell in the same node's cells array — the doctrine
// (root CLAUDE.md's "Checkpoint cells") requires checkpoint -> quiz
// retrieval practice right after, never checkpoint alone or checkpoint ...
// (something else) ... quiz.
function warnCheckpointNotFollowedByQuiz(N, issues) {
  const cells = N.cells || [];
  cells.forEach((c, i) => {
    if (!isPlainObject(c.checkpoint)) return;
    const next = cells[i + 1];
    if (!next || !isPlainObject(next.quiz)) issues.push({ level: 'WARN', path: `cells[${i}].checkpoint`, msg: 'checkpoint cell is not immediately followed by a quiz cell (checkpoint doctrine: exercise -> checkpoint -> quiz)' });
  });
}

// NEW HEURISTIC (checkpoint doctrine): density cap — more than 4 checkpoint
// cells in one node is too many per the 2-4/node cap in root CLAUDE.md.
const MAX_CHECKPOINTS_PER_NODE = 4;
function warnTooManyCheckpoints(N, issues) {
  const count = (N.cells || []).filter(c => isPlainObject(c.checkpoint)).length;
  if (count > MAX_CHECKPOINTS_PER_NODE) issues.push({ level: 'WARN', path: 'cells', msg: `${count} checkpoint cells in this node — checkpoint doctrine caps density at ${MAX_CHECKPOINTS_PER_NODE}/node` });
}

// NEW HEURISTIC (checkpoint doctrine): checkpoint text must be a precise
// technical statement, not gamification fluff — flag obvious praise-word/
// emoji-confetti/exclamation-spam markers (root CLAUDE.md's "Checkpoint
// cells": the high-five FX itself is the celebration, the words are pure
// technique).
const CHECKPOINT_FLUFF_RE = /giỏi quá|tuyệt vời|🎉|!{2,}/i;
function warnFluffyCheckpointText(N, issues) {
  (N.cells || []).forEach((c, i) => {
    if (!isPlainObject(c.checkpoint) || typeof c.checkpoint.text !== 'string') return;
    if (CHECKPOINT_FLUFF_RE.test(c.checkpoint.text)) issues.push({ level: 'WARN', path: `cells[${i}].checkpoint.text`, msg: 'checkpoint text looks like gamification fluff (heuristic: praise word / emoji confetti / exclamation spam) — should be a precise technical statement instead' });
  });
}

// NEW HEURISTIC: a "sửa lỗi"/"tự làm" code cell (starter `code` is NOT
// meant to satisfy `expectOut` as authored) should carry its own `solution`
// — the exact fixed/completed source — so tooling (playtest-full.mjs's
// CodeSolver) can resolve it from the CONTENT the author actually wrote,
// instead of reverse-engineering a fix from generic bug-pattern heuristics.
const FIXIT_NOTE_RE = /sửa lỗi|sửa lại|tự làm|tự viết|gõ sai|SAI tên biến|thụt vào vô cớ|thụt (lề|vào) (sai|sát)|kéo (nó |dòng )?sát|đổi (dấu|thành)|thêm (một |MỘT )?dòng/i;
// a fill-in-the-blank starter also gives itself away in the CODE, not just
// the note: an inline "# lượt bạn:"/"# your turn" comment, or a literal
// `"..."` placeholder left for the student to replace.
// `["']\.\.\.["']` (a placeholder VALUE, the whole string is just dots, e.g.
// `pet = "..."`) — not a bare `\.\.\.` anywhere, which false-positives on a
// real ellipsis inside authored prose/output text (e.g. `say("...đóng...")`).
const FIXIT_CODE_RE = /lượt bạn|["']\.\.\.["']/;
function warnFixItCellMissingSolution(N, issues) {
  (N.cells || []).forEach((c, i) => {
    if (c.code === undefined || c.solution !== undefined) return;
    if ((typeof c.note === 'string' && FIXIT_NOTE_RE.test(c.note)) || FIXIT_CODE_RE.test(c.code))
      issues.push({ level: 'WARN', path: `cells[${i}].solution`, msg: 'code cell reads as "sửa lỗi"/"tự làm" (per its note or an inline "lượt bạn"/"..." placeholder) but has no `solution` — add the correct/completed source so tooling can resolve it without guessing' });
  });
}

// ── GLOSSARY — pedagogical-term introduction map ──
// Each entry: the term (display name), a unicode-word-boundary regex, and
// where the term is first DEFINED for the student: `node` = NODE.index,
// optional `cell` = index of the defining cell inside that node. WARN-only
// heuristic (warnGlossaryForwardRefs): the term appearing in student-visible
// PROSE (npc / quiz title+q+a / boss round q+a+note / remember / checkpoint
// / code-cell note) in an EARLIER node — or the same node BEFORE its intro
// cell — is a forward reference; fix by rewording, adding a one-line
// mini-intro earlier, or relocating the definition (then update this table).
// Code bodies are exempt — warnUntaughtVocab covers called functions there.
// Gift blurbs / cameo captions / ritual text are not scanned (they often ARE
// the reveal of a new word). Deliberately EXCLUDED as ordinary child
// vocabulary that would only make noise: số, lỗi, lệnh, mốc, so sánh (bare
// verb — only the operator coinage "dấu so sánh" is gated), thần chú,
// câu phép, "ghép" alone, boss proper names (each lives only in its node).
// JS \b is ASCII-only and breaks on đ/ế/…, so uword() builds the boundary
// from \p{L}\p{N} lookarounds instead.
const uword = src => new RegExp(`(?<![\\p{L}\\p{N}])(?:${src})(?![\\p{L}\\p{N}])`, 'iu');
const GLOSSARY = [
  { term: 'INPUT/PROCESS/OUTPUT', re: uword('INPUT|PROCESS|OUTPUT'), node: 0, cell: 4 },
  { term: 'mật ngữ', re: uword('mật ngữ'), node: 0, cell: 2 },
  { term: 'vòng tròn phép thuật', re: uword('vòng tròn phép thuật'), node: 0, cell: 1 },
  { term: 'chuỗi', re: uword('chuỗi'), node: 0, cell: 11 },          // foreshadow in node00's say() checkpoint; full definition = node01 cell 0 (string arc)
  { term: 'hàm', re: uword('hàm'), node: 1, cell: 7 },
  { term: 'trả về', re: uword('trả về'), node: 1, cell: 7 },
  { term: 'biến', re: uword('(?<!ảm )biến'), node: 1, cell: 15 },    // (?<!ảm ) skips the compound "cảm biến" (sensor)
  { term: 'gán', re: uword('gán'), node: 1, cell: 18 },
  { term: 'ghép chữ/nối chuỗi', re: uword('ghép chữ|nối chuỗi'), node: 1, cell: 11 },
  { term: 'phép tính', re: uword('phép tính'), node: 2, cell: 0 },
  { term: 'thụt lề/thụt dòng', re: uword('thụt'), node: 2, cell: 14 },
  { term: 'điều kiện', re: uword('điều kiện'), node: 4, cell: 0 },
  { term: 'if', re: uword('if'), node: 4, cell: 0 },
  { term: 'elif', re: uword('elif'), node: 4, cell: 17 },
  { term: 'LOOP', re: uword('LOOP'), node: 4, cell: 26 },
  { term: 'else', re: uword('else'), node: 5, cell: 2 },
  { term: 'dấu so sánh', re: uword('dấu so sánh'), node: 6, cell: 4 },
  { term: 'bug ranh giới', re: uword('ranh giới'), node: 6, cell: 10 },
  { term: 'while', re: uword('while'), node: 7, cell: 5 },
  { term: 'vòng lặp', re: uword('vòng lặp'), node: 7, cell: 5 },
  { term: 'luật DỪNG', re: uword('luật dừng'), node: 7, cell: 0 },
];
// glossaryProse(c) — the student-visible prose strings of one cell, tagged
// with their field path suffix for the WARN message.
function glossaryProse(c) {
  const out = [];
  if (typeof c.npc === 'string') out.push(['npc', c.npc]);
  if (typeof c.note === 'string') out.push(['note', c.note]);
  if (isPlainObject(c.walkthrough)) {
    if (typeof c.walkthrough.title === 'string') out.push(['walkthrough.title', c.walkthrough.title]);
    if (typeof c.walkthrough.intro === 'string') out.push(['walkthrough.intro', c.walkthrough.intro]);
    if (typeof c.walkthrough.executedNote === 'string') out.push(['walkthrough.executedNote', c.walkthrough.executedNote]);
    if (typeof c.walkthrough.observeTitle === 'string') out.push(['walkthrough.observeTitle', c.walkthrough.observeTitle]);
    if (typeof c.walkthrough.codeTitle === 'string') out.push(['walkthrough.codeTitle', c.walkthrough.codeTitle]);
    if (typeof c.walkthrough.hint === 'string') out.push(['walkthrough.hint', c.walkthrough.hint]);
    (Array.isArray(c.walkthrough.steps) ? c.walkthrough.steps : []).forEach((step, si) => {
      if (typeof step.explain === 'string') out.push([`walkthrough.steps[${si}].explain`, step.explain]);
      if (typeof step.label === 'string') out.push([`walkthrough.steps[${si}].label`, step.label]);
      if (typeof step.memory === 'string') out.push([`walkthrough.steps[${si}].memory`, step.memory]);
    });
  }
  if (c.remember !== undefined) [].concat(c.remember).forEach((l, li) => { if (typeof l === 'string') out.push([`remember[${li}]`, l]); });
  if (isPlainObject(c.checkpoint) && typeof c.checkpoint.text === 'string') out.push(['checkpoint.text', c.checkpoint.text]);
  if (isPlainObject(c.quiz)) {
    if (typeof c.quiz.title === 'string') out.push(['quiz.title', c.quiz.title]);
    (Array.isArray(c.quiz.questions) ? c.quiz.questions : []).forEach((q, qi) => {
      if (typeof q.q === 'string') out.push([`quiz.questions[${qi}].q`, q.q]);
      (Array.isArray(q.a) ? q.a : []).forEach((a, ai) => { if (typeof a === 'string') out.push([`quiz.questions[${qi}].a[${ai}]`, a]); });
    });
  }
  if (isPlainObject(c.boss)) (Array.isArray(c.boss.rounds) ? c.boss.rounds : []).forEach((r, ri) => {
    if (typeof r.q === 'string') out.push([`boss.rounds[${ri}].q`, r.q]);
    (Array.isArray(r.a) ? r.a : []).forEach((a, ai) => { if (typeof a === 'string') out.push([`boss.rounds[${ri}].a[${ai}]`, a]); });
    if (typeof r.note === 'string') out.push([`boss.rounds[${ri}].note`, r.note]);
  });
  return out;
}
// isV2Variant(file) — pedagogy-V2 pilot clones (lessons/content/nodeNNv2.js,
// see lessons/PEDAGOGY-V2-PLAN.md) deliberately reorder cells within a node
// vs the canonical file sharing the same `index`. GLOSSARY's `cell` offsets
// are hardcoded against the CANONICAL file's array positions, so the
// same-node cell-position check below would misfire (false "forward
// reference") purely from an intentional, manually-reviewed reorder — not a
// real pedagogy bug. Detected by filename, not content, since it's a naming
// convention for the pilot, not a schema field.
function isV2Variant(file) { return /node\d+v2\.js$/i.test(path.basename(file)); }

function warnGlossaryForwardRefs(N, issues, opts = {}) {
  if (typeof N.index !== 'number') return;   // node index is the glossary's time axis
  // side islands (island.js content, N.index === -1 by convention — see
  // island01.js's header) sit OUTSIDE the linear curriculum timeline: they're
  // bonus review content authored to reuse only already-taught vocabulary,
  // not a point on the GLOSSARY's node axis, so the forward-ref check (which
  // assumes N.index IS that axis) doesn't apply and would only ever false-fire.
  if (N.index < 0) return;
  const looseSameNodeOrder = !!opts.looseSameNodeOrder;
  (N.cells || []).forEach((c, i) => {
    for (const g of GLOSSARY) {
      const crossNodeEarly = N.index < g.node;
      const sameNodeEarly = !looseSameNodeOrder && N.index === g.node && g.cell != null && i < g.cell;
      const early = crossNodeEarly || sameNodeEarly;
      if (!early) continue;
      const hit = glossaryProse(c).find(([, t]) => g.re.test(t));
      if (hit) issues.push({ level: 'WARN', path: `cells[${i}].${hit[0]}`, msg: `pedagogical term "${g.term}" used before its introduction (node ${g.node}${g.cell != null ? `, cell ${g.cell}` : ''}) — reword, add a mini-intro before it, or update GLOSSARY` });
    }
  });
}

function validateRitualChant(N, issues) {
  const r = N.ritual;
  if (!isPlainObject(r)) return;
  if (r.chant !== undefined && (typeof r.chant !== 'string' || !r.chant.trim()))
    issues.push({ level: 'ERROR', path: 'ritual.chant', msg: 'ritual.chant must be a non-empty string' });
  if (r.chantAccept !== undefined) {
    if (!Array.isArray(r.chantAccept) || r.chantAccept.some(x => typeof x !== 'string'))
      issues.push({ level: 'ERROR', path: 'ritual.chantAccept', msg: 'ritual.chantAccept must be an array of strings' });
    if (r.chant === undefined) issues.push({ level: 'ERROR', path: 'ritual.chantAccept', msg: 'ritual.chantAccept given without ritual.chant' });
  }
}

// validateRitualChoice(N, issues) — ritual word-choice (KICKOFF-PLAN.md Part
// B): optional pre-seal knowledge check, `ritual.choice: {q, a:[2-5], correct}`.
// NOTE the deliberate exemption: unlike track/quiz distractors elsewhere
// (which must be made-up, not real words a kid could confuse with trivia),
// `choice.a`'s WRONG options here MAY be real programming words the student
// will meet later (e.g. "print" vs the taught "say") — this is a
// recognition check of THIS node's taught word, not a knowledge trap, so a
// real-word distractor is fine and expected (see KICKOFF-PLAN.md's note).
function validateRitualChoice(N, issues) {
  const r = N.ritual;
  if (!isPlainObject(r) || r.choice === undefined) return;
  const c = r.choice;
  if (!isPlainObject(c)) { issues.push({ level: 'ERROR', path: 'ritual.choice', msg: 'ritual.choice must be an object {q, a, correct}' }); return; }
  if (typeof c.q !== 'string' || !c.q.trim()) issues.push({ level: 'ERROR', path: 'ritual.choice.q', msg: 'ritual.choice.q must be a non-empty string' });
  if (!Array.isArray(c.a) || c.a.length < 2 || c.a.length > 5 || c.a.some(x => typeof x !== 'string' || !x.trim()))
    issues.push({ level: 'ERROR', path: 'ritual.choice.a', msg: 'ritual.choice.a must be an array of 2-5 non-empty strings' });
  if (!Number.isInteger(c.correct) || (Array.isArray(c.a) && (c.correct < 0 || c.correct >= c.a.length)))
    issues.push({ level: 'ERROR', path: 'ritual.choice.correct', msg: 'ritual.choice.correct must be an integer index within ritual.choice.a' });
}

function validateNode(N, file) {
  const issues = [];
  if (!Array.isArray(N.cells)) { issues.push({ level: 'ERROR', path: 'cells', msg: 'NODE.cells is missing or not an array' }); return issues; }
  if (N.stickyCodeOutput !== undefined && typeof N.stickyCodeOutput !== 'boolean')
    issues.push({ level: 'ERROR', path: 'stickyCodeOutput', msg: 'NODE.stickyCodeOutput, if given, must be true or false' });
  validateRitualChant(N, issues);
  validateRitualChoice(N, issues);
  const seenQuizTitles = new Set();
  N.cells.forEach((c, i) => checkCell(c, i, issues, seenQuizTitles));
  N.cells.forEach((c, i) => {
    const p = `cells[${i}]`;
    const checkQuestion = (q, qp) => {
      warnBareRecallQuiz(q, qp, issues);
      warnHiddenQuizContext(q, qp, issues);
    };
    if (isPlainObject(c.quiz) && Array.isArray(c.quiz.questions)) c.quiz.questions.forEach((q, qi) => checkQuestion(q, `${p}.quiz.questions[${qi}]`));
    if (isPlainObject(c.forge) && Array.isArray(c.forge.quiz)) c.forge.quiz.forEach((q, qi) => checkQuestion(q, `${p}.forge.quiz[${qi}]`));
    if (isPlainObject(c.boss) && Array.isArray(c.boss.rounds)) c.boss.rounds.forEach((r, ri) => { if (r.q !== undefined) checkQuestion(r, `${p}.boss.rounds[${ri}]`); });
  });
  warnUntaughtVocab(N, issues);
  warnGlossaryForwardRefs(N, issues, { looseSameNodeOrder: isV2Variant(file) });
  warnUnscopedThresholdOrder(N, issues);
  warnVietnameseIdentifiers(N, issues);
  warnHiddenTaskContext(N, issues);
  warnCheckpointNotFollowedByQuiz(N, issues);
  warnTooManyCheckpoints(N, issues);
  warnFluffyCheckpointText(N, issues);
  warnFixItCellMissingSolution(N, issues);
  if (isPlainObject(N.ritual) && N.ritual.theme !== undefined)
    themeIssues(N.ritual.theme).forEach(msg => issues.push({ level: 'ERROR', path: 'ritual.theme', msg }));
  return issues;
}

// loadNode(file) — lessons/content/node*.js are `export default {...}` ES
// modules (see lessonNN.html: `import N from './content/nodeNN.js';
// window.NODE = N`) — a real Node dynamic import is simpler and more
// faithful than re-implementing module semantics over node:vm.
async function loadNode(file) {
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

async function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const argGlob = args.find(arg => arg !== '--strict');
  const dir = argGlob ? path.dirname(argGlob) : path.join(__dirname, 'content');
  // Default covers the main line, bonus islands, optional learning branches,
  // and tower courses. They share the same content schema and safety rules.
  const patterns = argGlob ? [path.basename(argGlob)] : ['node*.js', 'island*.js', 'branch*.js', 'tower*.js', 'visionnode*.js'];
  const res = patterns.map(p => new RegExp('^' + p.replace(/[.]/g, '\\.').replace(/\*/g, '.*') + '$'));
  const files = fs.readdirSync(dir).filter(f => res.some(re => re.test(f))).sort().map(f => path.join(dir, f));

  if (!files.length) { console.log(`no files matched ${path.join(dir, pattern)}`); process.exit(1); }

  let totalErrors = 0, totalWarns = 0;
  const badgeIdSeenIn = new Map();   // badgeId -> [relative file paths] — cross-node uniqueness (WARN-only)
  for (const file of files) {
    let N;
    try { N = await loadNode(file); }
    catch (e) { console.log(`✖ ${file} — failed to load: ${e.message}`); totalErrors++; continue; }
    if (!isPlainObject(N)) { console.log(`✖ ${file} — did not set window.NODE`); totalErrors++; continue; }
    const issues = validateNode(N, file);
    (N.cells || []).forEach(c => {
      if (isPlainObject(c.gift) && c.gift.badge === true && typeof c.gift.badgeId === 'string' && c.gift.badgeId.trim()) {
        const rel = path.relative(process.cwd(), file);
        const list = badgeIdSeenIn.get(c.gift.badgeId) || []; list.push(rel); badgeIdSeenIn.set(c.gift.badgeId, list);
      }
    });
    const errs = issues.filter(x => x.level === 'ERROR'), warns = issues.filter(x => x.level === 'WARN');
    totalErrors += errs.length; totalWarns += warns.length;
    if (!issues.length) { console.log(`✓ ${path.relative(process.cwd(), file)} — clean`); continue; }
    console.log(`${errs.length ? '✖' : '~'} ${path.relative(process.cwd(), file)} — ${errs.length} error(s), ${warns.length} warning(s)`);
    issues.forEach(x => console.log(`  ${x.level === 'ERROR' ? 'ERROR' : 'WARN '} ${x.path}: ${x.msg}`));
  }
  // cross-node badgeId uniqueness — WARN only (see validateNode's per-cell ERROR checks for shape)
  for (const [badgeId, list] of badgeIdSeenIn) {
    if (list.length > 1) { console.log(`~ badgeId "${badgeId}" duplicated across: ${list.join(', ')}`); totalWarns++; }
  }
  console.log(`\n${files.length} file(s) — ${totalErrors} error(s), ${totalWarns} warning(s)`);
  if (totalErrors > 0 || (strict && totalWarns > 0)) process.exit(1);
}
main();
