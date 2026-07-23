# Write a node in 30 minutes

A checklist, not an essay. See `engine/ARCHITECTURE.md`'s "Layer map" for the
full contract this is built on, and **[`PEDAGOGY-METHOD.md`](PEDAGOGY-METHOD.md)
for the teaching-design method** (sequencing, checkpoint doctrine, reward
economy, terminology) — the WHY behind the rules this checklist enforces.

Hand-editing an existing node's cells directly (instead of writing raw JS)?
Use `lessons/editor.html` (teacher-only, not linked from the game) — see
`lessons/README.md`'s "Content editor" section. It edits per-cell forms and
saves straight back to `lessons/content/nodeNN.js` via `serve.py`'s
`/api/save-node`, but it LOSES comments on save — commit first.

## 1. The 3-layer contract — you only write CONTENT

You are writing a **CONTENT** file: pure data, zero imports, ever. You never
touch `lessons/node.js`, `lessons/saga.js`, or anything in `lessons/engine/`
— those are PLATFORM/ENGINE and already know how to read your data.

## 2. Copy the template, three real files

Based on how node05/node06 were actually added (`git log`, commit `e5d0eba`)
and `lessons/saga.js`'s `NODES` array:

1. **`lessons/content/TEMPLATE.js` → `lessons/content/nodeNN.js`** — the new
   node's content, `index: NN`. Fill in every commented field; delete the
   parts of the template you don't need (extra cells, etc).
2. **`lessons/lessonNN.html`** — copy any existing `lessonNN.html` (e.g.
   `lesson05.html`) verbatim and change one line:
   `import N from './content/node05.js';` → `'./content/nodeNN.js'`. Nothing
   else in the file changes — it's the same importmap/theme/worker
   boilerplate for every node.
3. **`lessons/saga.js`'s `NODES` array** — add `{ title, art, page:
   'lessonNN.html' }` in map order. **Real gap, not idealized:** as of this
   writing `node05.js`/`node06.js`/`lesson05.html`/`lesson06.html` exist but
   were never wired into `NODES` — the map still stops at a `{title:'? ? ?',
   page:null}` placeholder. A node with a content file + HTML page but no
   `NODES` entry is unreachable from the map (only reachable via
   `dev-test.html?src=nodeNN` or by typing the URL directly). Don't repeat
   this gap for your node — add the `NODES` entry in the same commit.

No shell changes needed for any of the above (per `lessons/README.md`'s
"Adding a node").

## 3. Lint before shipping

```bash
node lessons/validate-content.mjs      # schema — must exit 0 (errors fail the build)
node lessons/check-layers.mjs          # layer boundaries — must exit 0
```

Read every WARN too — they're heuristics (missing `expectOut`, possible
bare-recall quiz, possible untaught vocabulary in a boss round) that don't
fail the build but usually mean something's off.

## 4. Preview in isolation

`lessons/dev-test.html` is the official content playground — never shipped
to students, reachable only by typing the URL. It loads ONE node
(`?src=nodeNN`) and can filter to ONE cell (`?only=`) so you don't have to
click through the whole node to reach the thing you're editing.

`?only=` matchers (comma-separated, OR'd — read straight from
`dev-test.html`'s query-param handling):
- `boss` — the cell with a `boss` fight
- `quiz:<title>` — the `{quiz:{title,...}}` cell with that exact title
- `code:<label>` — the `{code:...}` cell with that exact `label`
- `widget` — the `{widget:...}` cell
- `gift:<name>` — the `{gift:{name,...}}` cell with that exact `name`
- `cameo` — the `{cameo:...}` intro cell
- `ritual` — isolates just the closing ritual (drops all real cells; the
  synthetic ritual cell `notebook-runner.js` always appends becomes the
  only thing shown)

Examples:
```
dev-test.html?src=node05&only=boss
dev-test.html?src=node05&only=code:my_new_cell.py
dev-test.html?src=node05&only=quiz:My Quiz Title
```
Omit `?only=` to preview the whole node, same as the real lesson page.

## 5. Content rules (root `CLAUDE.md`'s "Lesson-content sequencing rules")

- **One new concept per cell.** A cell introduces at most one genuinely new
  piece of Python (function/operator/keyword) not seen in an earlier
  cell/node.
- **Check every `{code:...}` cell (including boss `rounds[]`) against
  "what's new here?"** — diff its vocabulary against everything taught so
  far in this node and prior nodes before shipping it.
- **New vocabulary needs a verifying quiz** before/around it — level 2+ (a
  concrete example, not bare recall), per skill `quiz-design`'s 4-level
  taxonomy.
- **Student-visible variable names must be English ASCII.** Use identifiers
  such as `score`, `count`, `total`, `digit`, `result`, `word`, `text` in
  starter code, solutions, quiz snippets, and code comments. Explain them in
  Vietnamese prose, but do not use Vietnamese identifiers in new learner code.
- **Every exercise states INPUT / PROCESS / OUTPUT.** The `note` or immediate
  prompt must say what the learner has to do, which values are given/preset,
  which values are real input read from outside the program, what process to
  use, and what exact output proves success. Avoid "fix this" prompts whose
  expected result only lives in the previous NPC bubble.
- **Named concepts must have examples.** When a task introduces a label like
  `số tự hào`, `hợp lệ`, `đối xứng`, `số hoàn hảo`, or `ô vuông thần kỳ`, put
  a concrete `Ví dụ:` in the same note or adjacent prompt. If learners might
  overgeneralize, add one short non-example. Keep examples conceptual; do not
  reveal the whole solution algorithm.
- **But prompts must not give away the algorithm.** `note`, NPC prose,
  checkpoints, and starter-code comments should name the concept, data
  contract, target behavior, and expected output, but not the full ordered
  solution. Do not list every loop update, helper variable, branch order, or
  exact expression the learner should type. Put that reasoning in `solution`
  only; give a small hint only when the task would otherwise be ambiguous.
- **Distinguish preset values from real INPUT.** `number = 153` in starter
  code is a given/preset value, not INPUT. Use INPUT only for values read by
  `read()`, `read_num()`, `watch()`, camera, or another actual input source.
  Number tasks may use `%` and `//`, but must explain what the number means
  and what the operation does in context (`% 10` gets the last digit, `// 10`
  removes the last digit, `% 2` checks the remainder when dividing by 2).
- **Format code inside quiz text for `renderProse()`.** Use inline backticks
  for short code (`x > 3`, `say()`), but use a fenced block
  (opening ```` ```python ````, closing bare ```` ``` ````) whenever the
  learner must read multiple statements, indentation/control flow, a compact
  one-line `if/for/while`, or a long `say(...)`/`display(...)` call. Never
  write raw code in `q` or `a`, and don't flatten branches with `·`
  separators. This applies to `{quiz:...}`, `forge.quiz`, and boss question
  rounds.
- **Use `skills/quiz-design` wording for every quiz/forge/boss question.**
  Use `thông báo lỗi`/`máy báo lỗi`, `lệnh`, `dòng`, `khối if`, `nhánh
  if/elif`, `mốc dừng`, and plausible misconception distractors. Avoid
  `máy than`, `than phiền`, `câu lệnh`, `câu if`, `mốc dừng trước`, clipped
  labels like `lượt bạn`, and joke-only answers such as "Python đói bụng".
- **Run a learner-Vietnamese pass, not only a dictionary pass.** Flag any
  phrase made from valid Vietnamese words that still sounds like English or
  algorithm shorthand: `số lật`, `số gốc`, `lật ngược so`, `lật luật`,
  `chữ số mới`, `thành một số mới`. Replace it with the actual operation or
  a full noun phrase: `reversed_number` is "số sau khi đảo thứ tự chữ số", `number` is
  "số ban đầu" or "giá trị ban đầu trong `number`", and a loop should say what
  each vòng làm (`n % 10`, update variable, `n // 10`). Student-visible code
  comments count as lesson text.
- **Use the 3-option anti-slop pass for suspicious wording.** For every compact
  phrase that might be translated English, write three alternatives, remove the
  terse/calque one, and keep the clearest sentence that names the exact code
  action. Examples: avoid `đổ a sang b`, `biến con`, `bẻ hàng ô`, `cờ bật`,
  `hạ xuống False`, `lật chéo bảng`; prefer `gán a = b`, `mỗi ô list là một
  chỗ nhớ riêng có index`, `mở rộng hàng ô thành bảng`, `found đổi thành
  True`, `gán is_symmetric = False`, `đổi chỗ hàng-cột`.
- **`expectOut` is required on every deterministic `{code:...}` cell**
  (including boss code rounds) — skip it only when the correct output is
  genuinely open-ended or depends on live camera input the grader can't
  predict.

## 6. Checkpoint cells

`{checkpoint:{text}}` (`lessons/engine/checkpoint-cell.js`) is a ✋
high-five stamp dropped after a practice arc. Order matters: exercise →
`checkpoint` → `quiz` *immediately after*, testing exactly the checkpoint's
claim — never quiz-then-checkpoint. Prefer relocating a nearby existing
quiz over writing a new one. Checkpoint `text` is a precise technical
statement — concrete syntax in backticks, the rule, the consequence — no
praise words, no exclamation spam (the high-five FX is the celebration).
Model: "Biến có thể được gán thẳng bằng một chuỗi: `mood = "vui vẻ"`. Máy
giữ giá trị đó cho tới khi mình gán lại." Cap at 2-4 checkpoints per node
(short nodes lean toward 1-2) — see root `CLAUDE.md`'s "Checkpoint cells".

## 6b. Mini-projects

A mini-project ("XƯỞNG PHÉP") is practice-by-building: consolidation of a
node's teaching arcs into ONE small machine with a story reason, not "bài
tập N". Full catalog + rationale: `lessons/MINI-PROJECTS-PLAN.md`. Shape (no
new engine needed, only existing cell kinds):

1. `npc` — Pip states the build goal in one line (what machine, for whom).
2. `code` — starter labeled `🔧 XƯỞNG PHÉP: <tên máy>`, comment khung tiếng
   Việt. `expectOut` = the loosest correct check (regex on the essential
   line(s); `{all:[...]}` for multi-line; open-ended only when truly
   student-dependent — pair a fixed label/frame string in the starter so the
   grader still has something deterministic to check).
3. Optional second `code` — `🔧 nâng cấp máy: <tên máy>`, one extension step
   (add a variable/output line). Same machine, one step further.
4. `checkpoint` (→ `quiz` immediately after, per §6's doctrine) **or**, if
   the node is already at/over the 2-4 checkpoint cap, a `remember` cell
   instead (skips the density cap; retrieval `quiz` still follows for the
   pedagogy even though the heuristic doesn't require it after `remember`).

Budget: one project ≈ 3-5 cells ≈ 3-4 min, max two per node. Placement:
AFTER the node's teaching/practice arcs, BEFORE the boss (if the node has
one) or the ritual (if it doesn't) — projects are consolidation, the
boss/ritual stays the finale. Vocab-gate exactly like any other cell: only
functions/keywords already taught earlier in the node (or an earlier node).

## 6c. THỢ RÈN — badge gifts + the forge cell

See `lessons/FORGE-PLAN.md` for the full reward-economy design. ADDITIVE
ONLY: a node with none of this authored plays exactly as before.

- **Badge gifts** — mark a `{gift:{...}}` cell as a badge by adding
  `badge:true, badgeId:'<unique-string>'` (any other gift fields — `art`,
  `name`, `blurb`, `glyph` — unchanged). `gift-cell.js` calls
  `inventory.addBadge(badgeId)` on claim, idempotent (re-claiming the same
  node/badge never dupes). Pick a badgeId that's stable and unique across
  the whole saga (e.g. `'node06-ranh-gioi'`), not just within one node.
- **Forge cell** — `{forge:{cost?, practice?:[{q,a,correct}, …]}}`
  (`lessons/engine/forge-cell.js`), placed in a node AFTER at least one
  badge gift (typically right before the boss). `cost` defaults to
  `DEFAULT_FORGE_COST` (2, in `inventory.js`) badges per bomb. `practice`
  is an optional pool of quiz-shaped `{q,a,correct}` questions drawn from
  the node's own already-taught vocabulary (same vocab-gate rule as any
  other cell) — shown only after a failed forge roll ("rèn hụt"); omit it
  and a failed roll just re-arms the anvil directly. The cell is a
  gacha loop (constants.js's `FORGE_SUCCESS_BASE`/`FORGE_SUCCESS_BONUS_PER_
  PRACTICE`/`FORGE_SUCCESS_CAP`): fail keeps the badges and offers one
  practice question; each one cleared raises the next attempt's odds until
  it's guaranteed. Always has a "bỏ qua" skip — a kid who doesn't care
  about bombs never gets stuck here.
- **Boss bomb deploy** — once a bomb exists (`inventory.bombCount() > 0`),
  the boss arena (`boss-fight.js`) shows a "💣 BOM MẬT NGỮ ×N" button with no
  content-file changes needed — it's automatic for every `{boss:...}` cell.
  Nothing to author here beyond the forge cell existing somewhere earlier.

## 7. Run the test suite

```bash
node lessons/validate-content.mjs
node lessons/check-layers.mjs
node lessons/test-dispatcher.mjs
node lessons/test-two-phase-gate.mjs
node lessons/test-gesture-registry.mjs  # the legal `gesture:` verb list lives in engine/gesture-registry.js, not in this doc
node lessons/test-gesture-math.mjs
node lessons/test-cell-validation.mjs
node lessons/test-progress-versioning.mjs
node test-gestures.mjs               # repo root, unrelated VFX-app test — keep green too
python py/test_modules.py            # if you added/edited a py/ module
```

All must stay green before you consider the node shippable.
