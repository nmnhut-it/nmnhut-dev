# Gesture-quiz & boss-move expansion — design plan

Captures ideas from the 2026-07-03 conversation about making quiz/boss
answering feel more physical and varied, and about upping quiz density in
the non-boss nodes.

## Status (2026-07-03): pilots SHIPPED, rest is still plan

The two pilots from §6 are built and wired into real content:

- **`swipe`** gesture verb — `gesture-dispatcher.js#armSwipeGate` (ARM via
  ✋ hold, then CAPTURE a left/right swipe within `GESTURE_CAPTURE_MS`,
  axis-restricted to horizontal so vertical wobble can't misfire). Wired
  into `boss-fight.js` (`#armSwipe`/`#armForRound`, a round with
  `gesture: 'swipe'` renders as a 2-option left/right choice, `.qopts.swipe`
  in `node.css`) and piloted as one round in node02's Bug Wraith fight
  (`content/node02.js`, "`say(...)` thuộc phần nào?").
- **`track`** gesture verb — `gesture-dispatcher.js#armMultiTrackGate`
  (ARM via ✋ hold, then CAPTURE: chase a drifting target with your
  fingertip, each candidate target charges independently so briefly
  resting on the wrong one doesn't help the right one). Wired into
  `quiz-cell.js` (`armTrackQuestion`, `.qtarget` fixed-position drifting
  chips positioned by the shared `trackPos(i, now)` formula so the visual
  and the hit-test never disagree) and piloted as one quiz question in
  node00 ("Đuổi theo đáp án" — say() vs a made-up distractor, not a real
  not-yet-taught keyword like watch() — see "vocabulary sequencing" note below).
- **Testing shortcuts (dev-only, never shown to students)** — two layers:
  1. **`cheat-panel.js`** ("pip" typed anywhere, or `#cheat` in the URL) —
     buttons that fast-forward a REAL node page: **🎯 track quiz** (first
     quiz cell using any new gesture verb — the node00 pilot), **🖐 swipe
     round** (jumps to the boss, pulls its first `gesture:'swipe'` round to
     the front — the node02 pilot, instantly instead of 6 rounds in), **🏁
     finisher round** (same, for whichever round has `finisher:true` —
     otherwise only reachable by clearing every earlier round for real),
     **☀🌙 light/dark cell** (node03's `three_rules.py`, the real-camera
     fire_vortex/lighten/darken cell). Backed by `BossFight#toGestureRound`/
     `#toFinisherRound` (boss-fight.js) and `window.nodeDev` (node.js).
  2. **`dev-test.html`** — a standalone harness page (unreachable from the
     saga map — `saga.js`'s `NODES` list is a hardcoded set of `lesson*.html`
     filenames, so this file never surfaces to a student). Loads one real
     node's content, keeps ONLY the cell(s) matching `?only=`
     (`boss`/`quiz:<title>`/`code:<label>`/`widget`/`gift:<name>`/`cameo`/
     `ritual`), and auto-skips splash/bundle (`nodeDev.toFirst`) so the
     target cell is the first and only thing on screen — no replaying
     earlier npc/code/quiz cells to reach it. E.g.
     `dev-test.html?src=node03&only=gift:CAMERA CHARM`.
  - **Known remaining gaps** (not yet built, lower priority): no dev hook
    to drive `photo_booth()`'s pour/whirl/snap stages without a live
    camera (`photo-booth.js`'s `gestureAsk()`/`act()`); no generalized
    "force a fingers-ask result" for arbitrary `expect`-gated code cells —
    only the ritual has `ritual.forceFingerCount(n)` today, sequential
    multi-stage cells (e.g. the 5-step finisher in node03's
    `mat_ngu_ket_lieu.py`) still need real camera gestures end to end.
- Pure math lives in the new `gesture-math.js` (`detectSwipe`,
  `trackDistance`) — no DOM/camera deps, so it's unit-testable in
  isolation if a test harness is ever added for this repo.
- The ARM/CAPTURE hint-text + gauge-fill wiring (identical phrasing in both
  callers) is deduped into `gesture-ui.js#armStatusHandler`, shared by
  `boss-fight.js#armSwipe` and `quiz-cell.js#armTrackQuestion` — don't
  re-inline this per caller if a third verb/site is added later.
- Both verbs share the same ARM-then-CAPTURE shape (`GESTURE_ARM_MS`,
  `GESTURE_CAPTURE_MS`, `SWIPE_MIN_DIST`/`SWIPE_MAX_MS`,
  `TRACK_CATCH_RADIUS`/`TRACK_HOLD_MS` in `constants.js`) — this directly
  answers the "gestures need an explicit start point" feedback: every new
  verb shows a "giơ ✋ để khoá tay — NN%" arm bar before capture opens, and
  a capture timeout just re-arms (soft retry, never a hard fail).

**Not yet built** (everything else below in this doc): punch/jab, trace-a-
circle, wider quiz-density pass across node00-02, rolling swipe/track out
to MORE rounds/questions beyond the one pilot each. Tune `SWIPE_MIN_DIST` /
`TRACK_CATCH_RADIUS` etc. against a real camera before expanding — these
are first-guess values, not measured.

## 1. Problem statement

- **Only one interaction exists today**: hold up N fingers steady for
  `QUIZ_HOLD_MS`/`ACT_HOLD_MS` to pick option N (`quiz-cell.js`,
  `gesture-dispatcher.js#armActGate`). Every quiz, every boss round, every
  gift/ritual claim — all the same "hold a finger count" gate. It works,
  but it's the only verb in the game.
- **Quiz density is uneven.** Node 0/1/2 (no boss, or boss at the very end
  only) have comparatively few quiz checks between teaching cells; node 2's
  boss is the main place repetition/review happens. The user wants more
  "what will this code print?" prediction-style quizzes sprinkled through
  node00–02, not just recall-the-term questions.
- **Boss fights want more "spell casting" variety** — different rounds
  should call for different physical gestures (not just re-picking a
  finger-count option), themed as "different moves in your spellbook":
  e.g. a swipe/slice motion (Fruit-Ninja-style) to strike, a fingertip
  trace-a-circle to "channel", a quick punch/jab at a screen zone to
  "strike a target", hand-tracking a moving/scrolling prompt.

## 2. What the engine already supports (feasibility check)

Read from `gesture-dispatcher.js`, `camera-engine.js`, `quiz-cell.js`:

- `onHands(res)` receives the RAW MediaPipe hand landmarks
  (`res.multiHandLandmarks[0]`) every frame, not just a finger count —
  `countFingers(lm)` is a derived summary. The booth-pour effect already
  reads a raw landmark position (`lm[9].x/y`, the middle-MCP) directly in
  the dispatcher. So position-based and motion-based gestures are
  reachable — they are not blocked by missing camera data, only by the
  fact that no consumer besides finger-count currently exists.
- The dispatcher already has THREE distinct gate shapes, not just one:
  `armActHoldGate` (charge-and-hold, soft-decay), `armTimedCatchGate`
  (rhythm — catch the moment, no charge), and the raw `armActGate`
  callback quiz-cell builds its own hold logic on top of. New gesture
  verbs should follow this same pattern: a new `armXGate` method on
  `GestureDispatcher`, fed by a small pure-math helper (new file, sibling
  to `gestures.js` in the root app or a new `lessons/engine/gesture-math.js`)
  that turns a landmark trajectory into a detected "swipe" / "circle
  traced" / "punch" event.
- Everything is still finger-count driven for CHOOSING an option (1..4 =
  button 1..4) — that convention should stay for simple multiple choice,
  since it's clear and already documented as a content rule. New gesture
  types are for a NEW class of interaction, not a replacement.

## 3. Proposed new interaction verbs

Each is a candidate `armXGate(cameraEngine, chip, spec, alive, onProgress,
onDone)` method, mirroring the existing gate signatures.

| Verb | Detection sketch | Use case |
|---|---|---|
| **Swipe/slice** ("cắt táo") | Track fingertip (lm[8]) velocity vector over a short window; a swipe = displacement > threshold within a short time budget, direction bucketed (left/right/up/down or "any"). | Boss round: "slice" through the right answer among several floating/scrolling options — pick by swiping across it, not by finger count. |
| **Trace-a-circle** | Sample fingertip position over ~1-2s; check the path's angular sweep sums to ~360° around its own centroid (a simple accumulated-angle check, not shape-matching). | "Channel the spell" — used for a "gather" moment, thematically tying back to the ritual vortex's own circular motion. |
| **Punch/jab at a zone** | Detect a fast forward Z-ish or rapid growth in hand bounding-box size (hand approaching camera) OR a fast position jump into a specific on-screen zone, debounced like `armTimedCatchGate`. | "Strike" a specific on-screen target (e.g. the boss's weak point) — a timed-catch variant, reusing that gate's "moment matters, not duration" model. |
| **Follow/track a moving prompt** | A quiz answer option scrolls/drifts across the screen; correctness is decided by whether the tracked fingertip stays within some radius of the CORRECT option's current position for a sustained duration (reuses the existing hold-charge math, just against a moving target position instead of a fixed button). | "Chase" quiz variant for node00 — the user's literal ask: "chữ trôi trên màn hình, dùng tay với theo". |
| **Point-and-hold at a screen zone** (no finger-count semantics) | Same as today's hold gate, but keyed by fingertip screen-position bucket instead of finger count — lets an answer be "the option your hand is nearest to" rather than "the Nth option". | Free-form matching quizzes where there are more than ~4 options (finger count maxes out around 4-5). |

Open question for the user: which 2 of these to build FIRST (recommend
starting with **swipe** and **follow-a-moving-prompt**, since they're the
two explicitly asked for and don't require new precision like circle-angle
math or Z-depth punch detection, which are noisier signals with a single
RGB camera).

## 4. Quiz density pass (node00–02)

Add more prediction-style quiz questions ("đoạn code này chạy ra gì?") in
addition to the existing recall/vocabulary questions, following the
existing `quiz-design` skill's 4-level taxonomy (level 2+ preferred). Concretely:

- **Node 0**: after `first_say.py`, add a predict-output question showing a
  DIFFERENT `say("...")` string than the one just run, asking what it
  prints — reinforces `say()` beyond rote recall.
- **Node 1**: after each of `greet.py` / `intro.py` / `wish.py`, add one
  "what does this print" question using a NEW literal string (not the one
  the student just ran), so it's inference, not memory of the last RUN.
- **Node 2**: after `calc.py`/`calc_full.py`, add "if a=3, b=4, what does
  `say_num(a*b)` print" style arithmetic-prediction questions, before the
  boss fight (which already reviews via its own rounds).
- Keep every new question at quiz-design's level 2+ bar — concrete
  worked example, not bare definition recall.

## 5. Boss-move variety

Reframe boss `rounds[]` entries as "spells you cast", each requiring the
gesture verb thematically matched to its flavor text — e.g.:
- multiple-choice knowledge check → existing hold-a-finger-count (unchanged)
- a "STRIKE" round → punch/jab gate at the boss's glyph
- a "channel" / gather-themed round → trace-a-circle gate
- a scrolling-option review round → follow/track gate

This only changes ROUND METADATA (`rounds[i].gesture: 'punch'|'swipe'|
'circle'|'hold'|'track'`, defaulting to `'hold'` for full backward
compat) plus `boss-fight.js` dispatching to the matching new
`armXGate` — existing rounds keep working unmodified.

## 6. Suggested build order

1. Ship **swipe** gate + wire into ONE boss round in node02 (Bug Wraith) as
   a pilot, verify it feels good hands-on before generalizing.
2. Ship **follow/track** gate + one node00 quiz using it (the "chữ trôi"
   idea), pilot similarly.
3. Only after both pilots feel right: expand quiz density per §4, and roll
   the two gates out across more boss rounds / quizzes.
4. Punch and trace-circle are stretch goals — noisier single-camera
   signals; prototype only if the first two land well.

## 7. Non-goals / risks to flag

- Don't reshuffle the finger-count "which button" convention for
  ordinary multiple-choice — only add NEW verbs for NEW situations, to
  avoid relearning cost for kids mid-node.
- Swipe/circle/punch detection will need real hands-on tuning (threshold
  values) — expect a few iterations against the live camera, not a
  one-shot correct implementation.
- Keep the "one new concept per teaching step" sequencing rule (see root
  `CLAUDE.md`) in mind for whichever node introduces a NEW gesture verb
  for the first time — the gesture itself is a "new machine skill" and
  probably deserves its own tiny intro moment (like Camera Charm's
  `watch()` reveal in node03), not a silent appearance in a quiz.
