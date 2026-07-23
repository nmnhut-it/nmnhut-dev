# Boss-fight mini-project — "tự viết đoạn code đánh boss"

Owner idea (2026-07-05): after learning `if`, students should get a **project**
— build their OWN boss-fight game. Give them extra "charms" (helper spells) and
guide them to script the battle: *when the boss does X, you do Y; the boss is
random; how many turns to win?* A project-based capstone where the student is
the CASTER writing the Mật Ngữ that drives the duel (not the gesture boss —
this is a CODING project the student types).

## Two tiers (the loop is HIDDEN in tier 1, REVEALED in tier 2)

Originally the split was forced by when `while` is taught — but the owner's
"ma pháp vô tận" idea (hidden-loop via source-wrapping, see that section below)
removes the force: the FULL turn-based game can land at node04 with the loop
hidden. So the split is now pedagogical, not technical:

- **Tier 1 — node04 (right after `if`/`elif`/`else`):** the FULL game, but the
  turn loop is HIDDEN ("ma pháp vô tận"). The student writes only the flat
  per-turn brain (read the boss's random move → if/elif counter → update
  `mau_boss`); the engine wraps it in a provided loop so a whole multi-turn
  fight runs and reports **how many turns** ("bao nhiêu lượt"). Student never
  writes or sees `while`. Pure if/elif practice, real game payoff, lands exactly
  "sau khi học if".
- **Tier 2 — node07 (after `while`):** the REVEAL. "Ma pháp vô tận chính là
  `while`." The student now re-writes the SAME game with the loop VISIBLE and
  written by them. Reuses everything: while + if/elif + == + biến + phép tính +
  random, and closes the loop opened at node04.

**Checkpoint-first:** build the node04 tier FIRST (incl. the hidden-loop engine
wrap), owner review, THEN the node07 reveal.

## The provided "charm" module (extra phép bùa)

A new Python module in the same shape as `old_computer` / `camera_charm`, e.g.
`battle_charm` (name TBD), giving the student ready spells so they focus on the
LOGIC, not plumbing. Keep the surface SMALL and reuse known verbs:

- `boss_ra_chieu()` → returns a random move string, one of a FIXED small set:
  `"chém"`, `"thủ"`, `"bắn"`. `random` is hidden INSIDE the charm (student
  doesn't import/learn `random` yet — they just see "the boss picks on its
  own"). At node07 we can optionally lift the lid and teach `random.choice`.
- `say(...)`, `say_num(...)` — already known (output).
- HP: keep it a plain student-managed **variable** (`mau_boss = 100`, then
  `mau_boss = mau_boss - 20`) — reinforces variables + arithmetic, no hidden
  state. (Alternative: a `danh_boss(sat_thuong)` charm — decide during build;
  the plain-variable version teaches more and is preferred.)

The counter table (rock-paper-scissors-ish, so if/elif has real stakes):
| Boss ra chiêu | Đáp đúng (trừ máu boss) |
|---|---|
| `"chém"` | giơ khiên **đỡ** |
| `"thủ"`  | **vòng ra sau** lưng |
| `"bắn"`  | **né** sang bên |
Right counter → boss takes damage; wrong → you take damage (or just "trượt").

## Tier 1 — node04-mini, step-by-step cells (one new idea per cell, expectOut-graded)

1. **npc intro** — Pip: giờ bạn tự viết đoạn code điều khiển trận đánh của chính mình.
2. **code** — `chieu = boss_ra_chieu()` then `say(chieu)`: experience the random
   move (open-ended output — no expectOut, or a loose regex over the 3 words).
3. **code** — ONE branch: `if chieu == "chém": say("giơ khiên đỡ!")` — new idea:
   applying `==` to the charm's output. expectOut checks the branch.
4. **code** — add `elif "thủ"` + `else` — the elif ladder (taught node04) put to
   work. expectOut per move.
5. **code** — damage: `mau_boss = 100`; on the correct counter
   `mau_boss = mau_boss - 20`; `say_num(mau_boss)` — variable + arithmetic.
6. **checkpoint** + **quiz** — seal "một chiêu → một phản đòn" (if/elif maps a
   value to an action), level 2+.
7. **reward tie-in** — completing it grants a badge / a "đoạn code tự rèn" toward
   the forge (ties into FORGE-PLAN economy).

Grade every deterministic cell with `expectOut`; the random-move print (cell 2)
is the only open-ended one (regex over the 3 legal words is fine).

## Tier 2 — node07-capstone (after `while`), what the student now writes themselves

- `mau_boss = 100`, `luot = 0`
- `while mau_boss > 0:` — the turn loop (student-written now).
  - `chieu = boss_ra_chieu()` (random each turn)
  - if/elif/else counter → `mau_boss = mau_boss - 20` on a hit
  - `luot = luot + 1`
- After the loop: `say_num(luot)` — "thắng sau N lượt" (the "bao nhiêu lượt" beat).
- Extensions (optional, for fast finishers / half-guided cells): player HP too,
  variable damage, a boss that hits back, naming your own moves.

## Hidden loop — "ma pháp vô tận" (owner, 2026-07-05): student never writes/sees `while`

Owner: "ý tưởng vòng lặp thì mình hint trước cũng được — ví dụ ma pháp vô tận —
sau đó dẫn qua vòng lặp ở node sau… làm trước các phần để học sinh không cần
viết `while` và cũng không cần thấy `while`."

**Mechanism (clean, no new Python concept exposed): engine-side source-wrapping.**
A project code-cell gets a new `wrap` config: the student edits only the FLAT
per-turn brain (read `chieu`, if/elif counter, update `mau_boss`), and the
engine INDENTS that editor content inside a provided loop template before
sending it to Pyodide:

```
# provided, hidden from the student (the "ma pháp vô tận" Pip cast):
mau_boss = 100
luot = 0
while mau_boss > 0:            # <- injected, never shown/edited
    chieu = boss_ra_chieu()
    luot = luot + 1
    <STUDENT'S FLAT BRAIN, auto-indented here>
say_num(luot)                 # <- injected: "thắng sau N lượt"
```

So the student writes a single-round brain but SEES a multi-turn fight run —
they experience the loop (repetition, "bao nhiêu lượt") long before the syntax.
This lets the FULL turn-based game land as early as **node04-mini** without
`while`. In-world: Pip casts **"ma pháp vô tận"** (bùa lặp vô tận) around your
brain so it repeats every turn.

**Reveal later (node07, when `while` is taught):** "còn nhớ ma pháp vô tận
không? Bí mật của nó chính là `while` — giờ bạn tự viết được rồi." The node07
capstone re-does the SAME game with the loop now visible and student-written.

**Engine work this needs (small, additive):** a code-cell `wrap:{pre, post}`
(or `loopWrap:true` with a template) that composes `pre + indent(editorSrc) +
post` as the runnable source while the editor shows only the student's part;
`expectOut` still grades the composed run. Build + test this in code-cells.js /
notebook-runner before authoring the content. Keep it opt-in so every existing
code cell is unaffected.

## Animated boss — game feel, not a static image (owner, 2026-07-05)

Owner: "con boss là một tấm hình tĩnh (mà còn cute) nên boss fight chưa ngon —
giống app chứ không phải game." Options, honestly assessed:

- **Sprite-frame animation (RECOMMENDED, do first):** generate a real cycle per
  boss — idle breathe/float (4-6 frames), attack lunge, hit-flash, seal/death —
  via the `gemini-art` skill (Gemini) or GPT-image-3, then play with `steps()`.
  The engine already supports `sheet:{src}` + `--bf` frame indexing + CSS
  bob/hit/heal/stagger; this just needs MORE frames + a continuous idle loop
  wired. Achievable now with the image-gen tools, low risk, big jump in "chất
  game". This is the extension of FORGE-PLAN's "Boss spritesheet art" track.
- **Spine skeletal animation (later / optional, heavier):** true 2D skeletal
  animation. REALITY CHECK: Gemini / GPT-image-3 generate FRAMES (images), NOT a
  rigged Spine skeleton — Spine needs manual rigging in the Spine editor + a
  spine-ts runtime loaded via CDN (workable under no-build, but it's a real
  pipeline, not "gen phát ra luôn"). Treat as an optional upgrade if the
  frame-animation ceiling isn't enough; not the first move.

**Root cause of the failed 2026-07-05 batch (owner diagnosis) + the fix:** the
gen ran ALL bosses in ONE Gemini chat, so each character conditioned on the
earlier ones and they COLLAPSED into one generic glowing serpent (bug-wraith
the cat came out as a serpent). Fix: **one isolated chat PER DISTINCT
CHARACTER** — draft/lock the base design in its own fresh chat, do that
character's frames in the SAME isolated chat, never share a chat across
different bosses (see the `gemini-art` skill's Batching etiquette). Better yet
for on-model MOTION, avoid text-to-image frames entirely — animate the actual
art via **image-to-video (Veo)** or a **2D mesh-warp** (see the algorithm
options the owner and I settled on: img2video / Live2D-style mesh deform /
RIFE-FILM interpolation / Meta AnimatedDrawings — image-to-video or mesh-warp
are the on-model winners).

Recommendation: ship the richer **sprite-frame animation** for the bosses
(starting with the node02 BUG WRAITH + the gesture-KO seal) to make the fight
feel alive; revisit Spine only if we want to invest in a rig pipeline. This
applies to the gesture-KO boss (BOSS CONCEPT V2) too, not just this project.

**Owner directive (2026-07-05):** "cần ĐỦ animation theo frame, không chỉ 1
frame/pose — gen luôn, không cần duyệt." So: generate FULL multi-frame cycles
per boss (idle breathe/float loop of several frames + attack + hit + seal), not
a single state pose, and proceed without a style-approval checkpoint. Roster of
6 bosses (node02-07: BUG WRAITH, MIRROR WRAITH, SYNTAX SERPENT, PARADOX SPHINX,
BOUNDARY GOLEM, ENDLESS WYRM) + the unbuilt finale LORD NULL (node08). Design
the 4 art-less bosses (mirror/sphinx/golem/wyrm) + Lord Null ONCE (same canon
Gemini chat for style), reuse the design for arena animation AND the
CUTSCENE-PLAN enter/seal cutscenes (they overlap — don't gen separately).

## Doctrine (must follow — see PEDAGOGY-METHOD.md)

- One new concept per cell; every new idea gets a verifying quiz.
- Ôn cũ trước, trải nghiệm trước khái niệm (print the random move BEFORE writing
  logic about it).
- No-dead-end: every cell completable; expectOut hints on failure.
- Pip voice per STORY.md (in-world terms; no reverse-translated English).
- Checkpoint-first: node04-mini → owner review → node07 capstone.

## Open decisions for owner (defaults chosen, change if you disagree)

- **Placement:** BOTH tiers (mini @ node04, full @ node07) — the single-round vs
  looped split is forced by when `while` is taught. *(Default; the owner asked
  "sau khi học if" which the node04-mini satisfies, and "bao nhiêu lượt" which
  only node07 can.)*
- **Guidance:** step-by-step guided (one concept per cell, graded) for the mini;
  half-guided extension cells for fast finishers in the capstone.
- **Charm HP model:** plain student variable (teaches more) over a hidden
  `danh_boss()` helper.
- **`random`:** hidden inside the charm at node04; optionally lift the lid to
  teach `random.choice` at node07.

## Status
| Piece | Status |
|---|---|
| This plan | drafted 2026-07-05, refined w/ hidden-loop + animation — awaiting owner review |
| Hidden-loop engine wrap (code-cell `wrap`/`loopWrap`) | not started (build + test before content) |
| `battle_charm` module (py/) | not started |
| node04 content (Tier 1, full game / hidden loop) | not started (build first, then review) |
| node07 reveal content (Tier 2, `while` unveiled) | not started (after Tier 1 review) |
| Boss sprite-frame animation (idle/attack/hit/seal cycles, gemini-art / GPT-image-3) | not started — recommended first move for "game feel"; extends FORGE-PLAN "Boss spritesheet art" |
| Spine skeletal animation | optional/later — needs a rig pipeline, not gen-only (see Animated boss section) |
