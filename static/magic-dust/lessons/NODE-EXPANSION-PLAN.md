# Node expansion plan — nodes 5–10 (mindset-first)

Status (2026-07-03): nodes 5 and 6 BUILT (`content/node05.js` + `lesson05.html`,
`content/node06.js` + `lesson06.html`, registered in `saga.js`). Nodes 7–10
are designed here, not yet written. Source material: the reference curriculum
at `D:/introduction-to-computer-science` (mindset habits, exercise banks,
MIT 6.0001 mining) — see the "mining map" at the bottom.

## Where the student stands after node 4

Knows: `say/read/read_num/say_num` · `watch/fire_vortex/freeze/lighten/
darken/display/photo_booth` · `+ - * /` · `=` vs `==` · variables ·
accumulation (`x = x + 1`) · `if/elif/else`.
Does NOT know: comparisons (`< > <= >=`), loops, `%`, `def`, params/`return`,
lists. Node 3 openly PROMISED the student they'd write `photo_booth()`'s
hidden loop "in a later node" — that promise is paid in node 6, and `while`
needs a stop condition, so comparisons must land first (node 5), exactly as
NODE04-PLAN reserved them.

## The mindset thread (from the reference course — applies to EVERY new node)

The reference course's thesis: *"the first mindset shift is from vague human
intention to precise, testable thinking"*. Its kid loop — **Notice → Rule →
Predict → Try → Fix → Explain** — maps onto beats our engine already has, so
mindset teaching costs content conventions, not engine work:

1. **Predict-before-run**: before a teaching cell RUNs, a 1-question
   `{quiz:…}` asks "đoán xem máy sẽ nói gì?" — running code you haven't
   predicted is the reference course's cardinal sin ("learners confuse
   running code with understanding code").
2. **"Máy không hư — luật sai"**: every hospital/bug drill repeats the
   framing *the machine did exactly what the rule said; fix the rule, not
   the machine* ("A bug isn't the machine misbehaving. It's our rule not
   saying what we meant").
3. **Debugging = evidence, not guessing**: bug drills name the *smallest
   failing input* (đầu vào ngay TẠI MỐC) and make the student reproduce the
   failure BEFORE fixing it (`expectOut` already enforces re-verification).
4. **Boundary thinking**: `>` vs `>=` ("20 or more" includes 20) is the
   reference's richest bug family — node 5 is built on it, and later nodes
   keep planting boundary distractors in quizzes.
5. **Late word**: do the thing first, name it after (Pip names the concept
   once it's been felt) — matches how node 4 taught `else`.
6. **Remember cards carry the mindset sentence**, not just syntax.

Kotopia canon (see memory / future `STORY.md`): bosses are the Dark Lord's
error-monster minions and EAT mistakes to heal (the existing heal mechanic);
node rituals seal waystones on the road to the time-space portal home.

## Node 5 — "Boundaries: More or Less" (BUILT)

- **One new concept:** the comparison family `> < >= <=` (one concept, four
  signs, introduced two at a time).
- **Story:** a stone gate of the Dark Lord blocks the road; it only opens
  for "đủ mạnh". Boss: **THE BOUNDARY GOLEM** (Golem Gác Cổng).
- **Mindset spine:** `==` is too rigid (run it, feel it) → `>` fixes it →
  the *boundary moment*: sign says "3 TRỞ LÊN", you hold exactly 3, `> 3`
  keeps you out — predicted BEFORE running → `>=`. Then the cursed-gate
  hospital is a direct port of the reference's `broken_discount_calculator`
  (`>` where the rule says "at least"), with the "smallest failing input"
  question, plus a "7 opens the gate, so no bug, right?" evidence quiz.
- **Exercises (all camera-driven):** rigid gate (`==`, feel the failure) ·
  fix to `>` · boundary predict + verify at exactly 3 · fix to `>=` · night
  guard (`<`, wrong-direction starter) · big gate (two `watch()` reads,
  `a+b >= 6`, tested AT the boundary) · cursed gate hospital (`>`→`>=`) ·
  power meter (ordered `elif` ladder `<=1 / <=3 / else`) · boss (2 bug-fix
  code rounds + boundary/evidence quizzes + reordered-ladder round +
  finisher: three reads accumulate to exactly 12 → fire at the mốc).

## Node 6 — "Repeat: The While Loop" (BUILT)

- **One new concept:** `while` (uses node 5's `<` as its heart).
- **Story:** the Whirl Vale, cursed so wanderers walk in circles forever.
  Boss: **THE ENDLESS WYRM** (Trùng Vô Tận) — the minion of infinite loops;
  the student defeats it with the thing it fears: the STOP rule.
- **Mindset spine:** motivation from felt pain (the golem fight's three
  copy-pasted lines — "what about 100 times?") → while anatomy as the five
  machine verbs (look/check/change/loop/stop) → trace quizzes (how many
  passes?) → the infinite-loop curse taught as a PREDICT quiz (see safety
  rule below) → countdown taught predict-FIRST then run-to-verify →
  photo_booth()'s secret revealed and re-built by the student.
- **Exercises:** charge-up loop (`while suc_manh < 6: … + watch()`, run
  as-is, machine stops itself) · raise the target to 12 (edit the stop
  condition; `expectOut /^1[2-6]$/` blocks passing it unedited) · countdown
  `3,2,1,BUM!` (predict quiz BEFORE the cell) · cracked-countdown hospital
  (missing `:`) · wait-for-high-five (`while finger < 5: finger = watch()`
  — the booth's secret) · boss (trace quizzes, `<0`-never-runs round,
  body-unindented round, zero-pass high-five trace, finisher: charge to
  EXACTLY 12 or the wyrm freezes you).
- **Safety rule (load-bearing):** a runnable student `while` must either
  terminate deterministically (countdowns) or contain `watch()`/`read()`
  in its body (the ask makes a wedged run cancellable via the existing
  `'\x18'` sentinel). The forgot-to-change-the-counter infinite loop is
  taught ONLY as a predict quiz — never as runnable starter code.

## Node 7 — "The Remainder: Even & Odd" (planned)

- **One new concept:** `%` (số dư). The reference's crown jewel: turn "even
  *feels* even" into an exact check ("remainder after ÷2 is 0") — *"how did
  you know that so fast? You didn't even do any math"*.
- **Story hook:** the Dark Lord's vault door opens on even counts only.
- **Exercises to mine:** odd/even sort of 6,7,8,9 (predict table first) ·
  remainder table for 10,11,12,13 · chẵn/lẻ fire-vs-freeze on `watch()` ·
  "why isn't 'it feels even' enough for a machine" quiz · the preserved
  **machine-swap** lesson (`lesson01_odd_even/lesson.py`): `is_odd` never
  moves while every `old_computer` → `camera_charm` — the purest "logic
  stays, machine changes" moment — and the **import-abstraction reveal**
  its repetition motivates ("you changed the same word 4 times…").
- Boss candidate: **THE PARITY PHANTOM**.

## Node 8 — "Def: Name Your Spell" (planned)

- **One new concept:** `def` with no params — *"a function is a named
  idea"*, the decomposition habit. Tell for a bad split: *"if the name
  needs 'and', the function is doing two jobs"*.
- **Exercises to mine:** name-a-combo (`def double_fire():` two casts, call
  it thrice — repetition pain again) · refactor-the-tangled-scroll (port of
  the reference's `refactor_long_script_starter`: one long working script →
  three named spells) · "which verb deserves a name?" quizzes.

## Node 9 — "Info In, Answer Out" (planned)

- **One new concept:** parameters + `return` — the reference's program
  model made literal (params = information in, return = answer out).
- **Exercises to mine:** `odd_or_even(number)` and a Kotopia-skinned
  `is_strong(power)` (the reference's canonical functions, minus the
  untaught pieces) · predict-a-return drills (`odd_or_even(9)` before
  running) · trace tables.

## Node 10 — "Studio: The Portal" (planned — capstone)

- **No new syntax.** The reference's Small Problem Studio + Modeling Loop
  as a game arc: picture it → represent → rule → predict → break it (one
  edge case) → refine. Builds one machine end-to-end; the ritual is the
  time-space portal itself (endgame per Kotopia canon — final boss = the
  Dark Lord, rounds drawn from EVERY prior node's pool).
- Assessment style: the reference's 0/1/2 performance-check rubric maps to
  boss round damage; "normal case + tricky case + one improvement" =
  finisher structure.

## Conventions for whoever builds 7–10

- One new concept per node; every new item gets a level-2+ verifying quiz
  (skill `quiz-design`); every deterministic code cell carries `expectOut`;
  boss code rounds re-checked against cumulative vocabulary (CLAUDE.md).
- Numeric quiz options 1–3 must sit on the matching button.
- Pip's voice: natural children's-book Vietnamese, full sentences, Pip
  xưng "Pip", "tụi mình"; technical words stay English but glossed in a
  full sentence (see memory `pip-voice-style`).
- New bosses/gifts ship with glyphs; Gemini art (gate, golem, wyrm, vault…)
  follows the art pipeline later.

## MIT 6.0001 transcript mining (mindset thread #2)

Mined from `research/mit-6.0001/transcripts-text/L01…L12` (Ana Bell +
Eric Grimson, Fall 2016). The high-value steals, mapped to nodes:

- **"Computers only do what you tell them... They're not magical. They
  don't have a mind."** (L1) — IS Magic Dust's own framing; use as Pip's
  day-one mantra and repeat it at every "máy không hư — luật sai" beat.
- **Recipe with a STOP** (L1: "you don't want to keep baking bread
  forever") — reinforces node 6's luật DỪNG framing.
- **The halving game is the course's spine**: guess-my-number 0–100 in ~6
  guesses (L3 bisection) → bisection debugging ("print at the halfway
  point", L7) → binary search (L11). A future node candidate ("Săn số" /
  guess-and-check → bisection) — guess-and-check is taught as a LEGITIMATE
  named algorithm, and the same "throw half away" verb can return as a
  debugging technique when student programs get longer. Needs `while` +
  comparisons only — both taught after node 6.
- **Debugging = scientific method** (L7): "look at the data → hypothesis →
  repeatable experiment → simple test case"; "don't ask WHAT is wrong —
  figure out HOW that result took place"; print statements as hypothesis
  tests; "save a copy before you change a version that almost works".
  Upgrade material for later hospital drills (nodes 7+ can ask for a
  hypothesis quiz BEFORE allowing the fix).
- **Bugs made playful, not shameful** (L7): soup-with-bugs, the real moth,
  rubber-duck explaining. "Crashing is okay — go back and figure out what
  was wrong" (L1), errors are "angry text" but "pointing me to the exact
  line" — Pip's tone for every hospital wing.
- **Two hats: builder vs user** (L4) + **projector black-box** abstraction
  — the exact framing for node 8 (`def`) and the import-abstraction reveal.
- **Function = a little machine: feed input, it does a task, gives
  something back** (L4) — node 9's params/`return` in one sentence.
- **Predict-before-run culture** (L2 "what do you think will print?",
  L5 draw-the-pointers, L11 count-steps-before-reading-code) — same
  mandate as the reference course; already a convention above.
- **Growth-mindset refrains to reuse verbatim**: "practice, like math or
  reading"; "looks intimidating but it's not so bad"; "an infinite loop is
  not the end of the world"; "take a break, sit down with paper, go back
  to basics" (L7); the instructor models her OWN live bugs (L3/L6/L11).
- **Approximation / good-enough + tradeoffs** (L3 epsilon: accuracy vs
  speed) and **"if I double the input, does the time double?"** (L10) —
  seeds for the studio node's "compare tradeoffs" habit.

## Mining map (reference repo)

| Want | Read |
|---|---|
| Mindset habits + instructor moves | `course/mindset/00…06-*.md` |
| Exercise bank per topic | `course/exercises/module-practice-bank.md`, `drills-and-checkpoints.md` |
| Boundary-bug source | `course/exercises/python/broken_discount_calculator.py` |
| Decomposition exercise source | `course/exercises/python/refactor_long_script_starter.py` |
| Canonical functions (nodes 7/9) | `course/exercises/python/student_exercises.py` + solutions |
| Quiz style w/ misconception distractors | `course/assessments/expanded-quiz-bank.md` |
| Kid-facing framings to quote | `course/content/00-the-big-idea-pattern-to-rule.md`, `00-computers-need-clear-instructions.md` |
