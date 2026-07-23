# Framework plan — turn Magic Dust's lesson engine into a reusable platform

Goal (from the 2026-07-03 conversation): make the teaching platform a
**framework of its own** — three declared layers, so that adding a new
lesson ("lắp kiến thức/quiz vào") means writing a DATA file against a
schema, never touching engine code.

```
CONTENT   lessons/content/node*.js   — pure data (window.NODE), schema-checked
PLATFORM  node shell, saga map, progress, boss, ritual, dev harness
ENGINE    camera + gesture verbs + Pyodide runner + validation ("Dust Engine")
```

Market survey conclusion (see conversation): no off-the-shelf product
combines camera gesture verbs + in-browser Python cells + saga game.
We keep our engine; we borrow *concepts*: H5P's content-schema contract,
Fingerpose's declarative gesture definitions, MediaPipe Tasks'
GestureRecognizer (later, step 6).

Hard constraints (unchanged from CLAUDE.md):
- **Runtime stays no-build** — CDN/script-tag only; all new tooling is
  dev-time Node scripts (`node lessons/*.mjs`), like the existing tests.
- **Dense single-line JS style** — match it, don't reformat.
- Comments explain *why*, not *what*; sparse.

## Step 1 — Content schema + validator  ⟵ HIGHEST LEVERAGE

**Deliverable:** `lessons/validate-content.mjs` — a dev-time Node script
that loads every `lessons/content/node*.js` (they are ES modules —
`export default {...}` — so plain dynamic `import()` works in Node) and
validates each cell against a schema, exiting non-zero with a readable
per-file/per-cell error list.

Checks (ERROR = exit 1, WARN = printed but exit 0):
- ERROR: unknown cell type (allowed: npc/code/quiz/boss/gift/widget/cameo/
  ritual — derive the exact list + per-type required fields from
  `node.js`/`notebook-runner.js` and the five existing content files).
- ERROR: quiz cell missing `title`/`questions`; a question missing
  `q`/`a`/`correct`; `correct` out of range of `a`; more than ~5 answer
  options (finger-count picking maxes out).
- ERROR: boss round with unknown `gesture:` verb (allowed today: absent/
  'hold', 'swipe', 'track'); a `gesture:'swipe'` round without exactly 2
  options.
- ERROR: malformed `expectOut` (must satisfy the shapes documented in
  `cell-validation.js`: string / RegExp / array of either /
  `{heldCount}` / `{all:[...]}`).
- WARN: a `{code:...}` cell (including boss code rounds) with **no**
  `expectOut` — per CLAUDE.md this is allowed only for open-ended/camera
  cells, so it's a warning, not an error.
- WARN: duplicate quiz titles within a node; empty npc text.
- The schema itself lives as a data table at the top of the validator (one
  place to extend when a new cell type/verb is added).

Also: run it over node00–node04 and fix any *content* violations found
(content fixes only — engine bugs get reported in the final summary, not
fixed in this step). Wire a mention into `lessons/README.md` (how to run,
what it checks).

**Acceptance:** `node lessons/validate-content.mjs` passes on all five
nodes; deliberately corrupting a field makes it fail with a pointed
message naming file + cell + field.

## Step 2 — TwoPhaseGate: dedupe the gesture gates + make them testable

**Problem:** `gesture-dispatcher.js`'s `armSwipeGate` / `armTrackGate` /
`armMultiTrackGate` copy the identical ARM phase (hold ✋=5 to charge with
soft decay ×2.2, gauge via `onState('arm', p)`, flip to capture at
`GESTURE_ARM_MS`) three times, and all gates read `performance.now()`
directly — the ARM/CAPTURE state machine is untestable.

**Deliverable:** a pure class `TwoPhaseGate` in a new
`lessons/engine/two-phase-gate.js`:
- No DOM, no camera, no `performance.now()` — the caller feeds it frames:
  `step(now, {lm, has, count})` (clock injected via the `now` arg).
- Owns: arm charge/decay, arm→capture flip, capture timeout → re-arm
  (soft retry), `onState(phase, progress)` callbacks.
- Capture behaviour is a pluggable per-verb function the constructor takes
  (swipe: push fingertip history → `detectSwipe`; track/multi-track:
  charge-per-target via `trackDistance`) returning either `null`
  (continue) or a done-value that resolves the gate.
- `gesture-dispatcher.js`'s three `armXGate` methods become thin wrappers:
  camera ensure + chip video + `armMotionGate(frame => gate.step(performance.now(), frame))`
  — **public signatures unchanged**, so `boss-fight.js`/`quiz-cell.js`
  need no edits (verify with a grep for the call sites anyway).
- Enforce the comment-only invariant: arming an act gate while a motion
  gate is armed (or vice versa) throws — a loud dev error instead of one
  gate silently shadowing the other. Check first that no current caller
  legitimately overlaps them (ritual/act/finger arming order in `node.js`,
  `boss-fight.js`, `quiz-cell.js`, `gift-cell.js`); if one does, fix the
  caller, don't soften the invariant.

**Tests:** `lessons/test-two-phase-gate.mjs` (same assert style as the
existing .mjs tests) driving `step()` with synthetic frames + fake clock:
- arm charges to 1.0 and flips to capture at GESTURE_ARM_MS
- dropping ✋ mid-arm decays (×2.2) instead of resetting
- capture timeout re-arms and emits `onState('timeout', 0)`
- swipe verb: rightward fingertip trail resolves 'right'; jitter doesn't
- track verb: sitting on a target for TRACK_HOLD_MS resolves that key;
  hopping between targets doesn't leak charge to the right answer
- dt clamp: a 5s frame gap must not add >100ms of charge
- the act/motion double-arm invariant throws

**Acceptance:** all existing tests still pass, new suite passes, the three
gate bodies in `gesture-dispatcher.js` no longer duplicate the arm phase.

## Step 3 — Fake camera + record/replay (after step 2)

Every frame already funnels through `GestureDispatcher.onHands(res)`.
Build `lessons/test-dispatcher.mjs`: construct a dispatcher with stub
deps, inject synthetic `res` frames, and assert the **priority ladder**
(ritual > actGate/motionGate > frozen > booth pour > HUD > fingerGate)
and gate combinations end-to-end. Stretch: a dev-page hook to RECORD real
landmark traces to JSON and replay them in tests — turns
`SWIPE_MIN_DIST`/`TRACK_CATCH_RADIUS` tuning into data, not guesswork.

## Step 4 — Declare the three layers

Engine files must not know content; platform loads content through one
loader; document the layer map in `engine/ARCHITECTURE.md`. Name the
engine layer ("Dust Engine") to mark it as the reusable unit.

## Step 5 — Authoring kit

Template node + "write a node in 30 minutes" doc + promote
`dev-test.html` to the official content playground. Content-lint
extensions: one-new-concept sequencing heuristics, quiz level-2+ hints.

## Step 6 — Declarative gestures + MediaPipe Tasks (later)

Gesture registry (Fingerpose-style: new verb = declarative entry + pure
math fn) and evaluate migrating legacy `@mediapipe/hands` →
MediaPipe Tasks GestureRecognizer.

## Execution status

| Step | Status | Where |
|---|---|---|
| 1 validator | done 2026-07-03 (Sonnet, worktree) | `validate-content.mjs` |
| 2 TwoPhaseGate | done 2026-07-03 (Sonnet, worktree) | `two-phase-gate.js`, `test-two-phase-gate.mjs` |
| 3 dispatcher tests + record/replay | done 2026-07-03 (Sonnet, worktree) | `test-dispatcher.mjs`, `node.js`'s `nodeDev.recordHands`, `traces/` |
| 4 layer declaration | done 2026-07-03 (Sonnet, worktree) | `engine/ARCHITECTURE.md`'s "Layer map", `check-layers.mjs` |
| 5 authoring kit | done 2026-07-03 (Sonnet, worktree) | `content/TEMPLATE.js`, `AUTHORING.md`, `validate-content.mjs` heuristics |
| 6 | done 2026-07-04 (registry shipped; Tasks migration = evaluated, see MEDIAPIPE-TASKS-EVAL.md) | `engine/gesture-registry.js`, `test-gesture-registry.mjs`, `MEDIAPIPE-TASKS-EVAL.md` |
