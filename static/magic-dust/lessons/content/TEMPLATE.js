// TEMPLATE.js — a heavily commented skeleton node for authoring a new
// lesson. Copy this file to lessons/content/nodeNN.js and fill it in — see
// lessons/AUTHORING.md for the full "write a node in 30 minutes" checklist.
//
// IMPORTANT: this file is DELIBERATELY named "TEMPLATE.js", not
// "nodeNN.js" — both lessons/validate-content.mjs and lessons/check-layers.mjs
// glob-match `node*.js` in lessons/content/, so a file named "TEMPLATE.js"
// is automatically excluded from both and never gets scanned as if it were
// real content (verify: `node lessons/validate-content.mjs` lists real
// nodeNN.js files only, never TEMPLATE.js).
//
// Layer contract (see engine/ARCHITECTURE.md's "Layer map"): this file is
// CONTENT — pure data, ZERO imports, ever. It is consumed by lessonNN.html
// (`import N from './content/nodeNN.js'; window.NODE = N;`), which then
// hands it to lessons/node.js as a global — see notebook-runner.js's
// buildCells() for exactly how each cell type below turns into UI.
export default {
  // index — 0-based saga node number (nodes display ZERO-indexed — "real
  // machines count from 0"). Consumed by lessons/node.js (progress writes
  // `max(progress, index+1)` on ritual seal) and lessons/engine/progress-store.js
  // (localStorage key `magicdust.node.<index>.progress`).
  index: 99,
  // title/subtitle — shown in the node splash + notebook header. Consumed
  // by lessons/engine/dom-scaffold.js's mountPage().
  title: "TEMPLATE — Replace Me",
  subtitle: "one short line: what this node teaches, in-world flavor text",
  // bundle — the loot-box reveal shown on node ENTER, granting the
  // "machine" (toy) below. Consumed by lessons/node.js's bundle-open act.
  bundle: { art: "assets/rookie-bundle.webp", name: "YOUR BUNDLE NAME" },
  // machine — the toy/tool this node grants (shown after the bundle opens).
  // Consumed by lessons/node.js's bundle-open act.
  machine: { art: "assets/old-computer.webp", name: "YOUR MACHINE NAME", blurb: "one line: what it does" },
  // modules — name -> Python source path; lessons/engine/py-bridge.js's
  // worker installs each as an importable module inside the Pyodide worker
  // (see worker.js), so a code cell can `from <name> import <fn>`.
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    // ── {npc:...} — a Pip speech-bubble cell. Consumed by
    // notebook-runner.js's buildCells() -> a plain typewriter bubble; the
    // next cell stays hidden until this one finishes typing (or is
    // click-skipped) — see lessons/README.md's "Pip-paced reveal".
    {
      npc: "Pip's narration goes here — set up what the student is about to do.",
    },

    // ── {code:...} — a runnable Monaco cell, one Python concept at a time
    // (see root CLAUDE.md's "Lesson-content sequencing rules": one new
    // concept per cell; diff this cell's vocabulary against everything
    // taught earlier in this node + prior nodes before shipping it).
    // Consumed by lessons/engine/code-cells.js (codeCell — mounts the
    // editor) and lessons/engine/notebook-runner.js's onWorker 'done'
    // handler (checks expectOut before completeCell — see below).
    {
      code: 'from old_computer import say\n\nsay("Hello, wizard!")   # OUTPUT — the machine speaks\n',
      // label — cell title AND the ?only=code:<label> matcher key used by
      // lessons/dev-test.html to isolate this exact cell for preview.
      label: "template_example.py",
      // note — the "ĐỀ BÀI" problem statement shown above the editor.
      note: "ĐỀ BÀI\nWhat the student should do / expect to see when they RUN this.",
      // expectOut — REQUIRED unless genuinely open-ended/camera-input-only
      // (root CLAUDE.md's "Code-cell grading" section). Checked by
      // notebook-runner.js's onWorker 'done' handler via cell-validation.js's
      // cellOutputSatisfies() before completeCell() advances the lesson —
      // a clean-but-wrong run must NOT be treated as success. Shapes:
      // string (case-insensitive substring) | RegExp | array (OR of either)
      // | {all:[...]} | {minLines:N} | held-finger-count map e.g. {1:/fire/i,3:/light/i}.
      expectOut: /hello, wizard!/i,
      // solution — OPTIONAL: the COMPLETE, runnable Python shown when the
      // student clicks "Xem đáp án" (show answer). Only needed when this cell
      // is a graded exercise (has `expectOut`); it must be finished code that
      // actually produces output satisfying `expectOut`, NOT a restatement of
      // the "# lượt của bạn ..." placeholder comment. For a fill-in-the-blank cell,
      // fill in every blank here (see content/islandRPS.js's rps_recipe.py).
      solution: 'from old_computer import say\n\nsay("Hello, wizard!")   # OUTPUT — the machine speaks\n',
      // expect — OPTIONAL, page-config-only (never in the student's
      // editable code): if this cell's RUN triggers a camera finger-count
      // ask, lock ONLY on this count/array-of-counts (see node.js's camera
      // ask "Hidden expectations"). Omit if the cell has no camera ask.
      // expect: 1,
    },

    // ── {remember:...} — a short "✦ REMEMBER" takeaway callout, ~1 per key
    // concept, right after it's taught. Consumed by notebook-runner.js
    // (plain render). String or array-of-strings (stacked lines).
    {
      remember: "One crisp takeaway sentence about the concept the cell above just taught.",
    },

    // ── {checkpoint:{text, sign?}} — a small celebratory ✋ HIGH-FIVE stamp,
    // dropped after a practice arc (worked example → student exercise) so
    // the student physically "stamps" what they just learned. Consumed by
    // lessons/engine/checkpoint-cell.js (checkpointCell — armActHoldGate
    // hold gate, default sign 5; tap the button also completes it, no
    // camera required). `text` is Pip's one-line takeaway recap (≤40 words).
    {
      checkpoint: { text: "One-line recap of what the student just practiced." },
      // sign: 5,   // optional — override the finger count to hold (default 5)
    },

    // ── {quiz:...} — a level 2+ quiz checkpoint (Vietnam 4-level cognitive
    // taxonomy: Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao — default 2+,
    // a CONCRETE EXAMPLE, not bare recall like "X là gì?"; see skill
    // quiz-design and root CLAUDE.md's "Quiz/assessment content" section).
    // Consumed by lessons/engine/quiz-cell.js (quizCell — hold 1/2/3
    // fingers or tap to pick). `a` maxes at 5 options (finger-count
    // picking). `correct` is a 0-based index into `a`.
    {
      quiz: {
        title: "Short quiz title (unique within this node — dup titles WARN)",
        questions: [
          {
            // level 2+: a concrete example/scenario, not "say() là gì?"
            q: 'Chạy `say("Xin chao")`, máy sẽ làm gì?',
            a: ["In ra đúng dòng chữ đó", "Hỏi lại người dùng một câu", "Tính một phép cộng"],
            correct: 0,
            // gesture — OPTIONAL, only 'track' is special-cased by
            // quiz-cell.js today (drifting-target chase, see
            // lessons/GESTURE-QUIZ-EXPANSION.md); omit for the default
            // hold-N-fingers/tap picker.
            // gesture: "track",
          },
        ],
      },
    },

    // ── {gift:...} — a "you learned a new word" loot-reveal cell (glyph or
    // art-based). Consumed by lessons/engine/gift-cell.js (giftCell — high
    // five to open).
    {
      gift: { glyph: "✦", name: "YOUR GIFT NAME", blurb: "one line: what new power this unlocks" },
    },

    // ── {boss:...} — the node's GATE: quiz questions + code exercises
    // become attack turns against a boss with an HP bar (see
    // lessons/README.md's "Boss fight" section). Consumed by
    // lessons/engine/boss-fight.js (bossCell).
    {
      boss: {
        name: "THE TEMPLATE GOLEM",
        glyph: "👾",
        hp: 100,          // total HP; ~75%+ accuracy should clear one pool pass at default baseDmg/heal
        baseDmg: 20,       // damage per correct hit (streak multiplies this: x1 -> x1.5 -> x2)
        streakMul: [1, 1.5, 2],
        heal: 10,          // boss self-heals this much on a wrong answer / crashed run
        hearts: 3,         // student lives before a soft-fail (boss taunts + fully heals, no lockout)
        rounds: [
          // ── a hold round: plain {q,a,correct} question round, same shape
          // as a quiz question (checkQaShape in validate-content.mjs).
          // Default input is hold-N-fingers/tap (no `gesture:` key needed).
          {
            q: "One example question reviewing something this node taught.",
            a: ["Correct-sounding wrong answer", "The right answer", "Another distractor"],
            correct: 1,
          },
          // ── a gesture:'swipe' round: exactly 2 options (left/right
          // choice), validated by validate-content.mjs's checkBossRound
          // (a swipe round with != 2 options is an ERROR).
          {
            gesture: "swipe",
            q: "A two-way choice question — QUẸT sang bên đúng!",
            a: ["Option A (swipe left)", "Option B (swipe right)"],
            correct: 1,
          },
          // A boss round may also be a {code, note, dmg, expectOut} round
          // (a "heal the spell" bugfix exercise) instead of a {q,a,correct}
          // round — see lessons/content/node00.js / node02.js for real
          // examples; omitted here to keep this template's two round kinds
          // minimal per the Step-5 spec (one hold round, one swipe round).
        ],
      },
    },

    {
      npc: "Closing narration before the ritual — recap what was learned.",
    },
  ],
  // ritual — the hold-this-sign-to-seal gate at the end of every node.
  // Consumed by lessons/engine/ritual-controller.js (RitualController).
  ritual: {
    gesture: "✋",         // maps to a finger count via GESTURE_FINGERS in constants.js
    prompt: "GIƠ TAY NIÊM PHONG GIAO KÈO",
  },
};
