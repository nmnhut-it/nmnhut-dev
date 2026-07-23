# Pedagogy V2 — direct-first, analogy-second (rollout plan)

Status: ROLLOUT COMPLETE for all 8 nodes (node00v2…node07v2 all exist).
Still EXPERIMENT-only by design — none of the v2 files are wired into
`saga.js`'s `NODES`; each is reachable only via its own `lessonNNv2.html`
URL or `dev-test.html?src=nodeNNv2`. The original `node00.js`…`node07.js` /
`lesson00.html`…`lesson07.html` are untouched — v2 files are full clones
with `index` unchanged (they are alternates for the SAME map stop, not new
nodes).

## Rollout summary (node00v2/02v2/03v2/05v2/06v2/07v2)

The pilot (node01v2/node04v2, see below) found a real analogy-first
violation only in node01 (`biến` taught as a "box" before its technical
definition); node04 had none. Auditing the remaining six originals
(node00/02/03/05/06/07) found **no further analogy-first violations** —
every one of them already teaches its core mechanism directly/technically
first (read_num()/say_num(), watch()/display()/fire_vortex(), else,
comparison operators, while) with no "tưởng tượng như…" metaphor language
at all. Per the plan's own fallback ("apply timing fixes + add badge beats
+ fill in any missing retrieval quiz" when there's no reorder to do), each
of these six got the narrower treatment: verified no quiz/checkpoint timing
gaps (none found — the checkpoint→quiz doctrine was already respected
throughout), then added exactly **one reward badge** at that node's single
biggest earned-milestone quiz cluster (1/node, well under the 1-2 cap).
Wording/code in every cell is byte-for-byte the original file's — only a
`{gift:{...,badge:true}}` cell was inserted and the title got a `(V2)`
suffix; see each file's own header comment for the exact insertion point.

## All badge IDs across the V2 rollout (unique, checked by validate-content.mjs)

| Node file | badgeId | name | placed after quiz |
|---|---|---|---|
| node00v2.js | `huy_hieu_noi_to` | HUY HIỆU NÓI TO | "say() là gì" |
| node01v2.js | `xau_chuoi` (📿 HUY HIỆU XÂU CHUỖI) / `ghep_bien` (🧵 HUY HIỆU GHÉP BIẾN) | see below | "Chuỗi hợp lệ" / "Ghép nhiều biến" |
| node02v2.js | `huy_hieu_may_tinh_tuoi` | HUY HIỆU MÁY TÍNH TUỔI | "Tính tuổi" |
| node03v2.js | `huy_hieu_hien_hinh` | HUY HIỆU HIỆN HÌNH | "Hiện lên màn hình" |
| node04v2.js | `ba_luat` (📜 HUY HIỆU BA LUẬT) | see below | "Ba luật cùng lúc" |
| node05v2.js | `huy_hieu_luat_day_du` | HUY HIỆU LUẬT ĐẦY ĐỦ | "Nhánh đúng đầu tiên" |
| node06v2.js | `huy_hieu_ranh_gioi` | HUY HIỆU RANH GIỚI | "Bắt bug ranh giới" |
| node07v2.js | `huy_hieu_luat_dung` | HUY HIỆU LUẬT DỪNG | "Bùa vòng lặp vô tận" |

Note: node01v2.js/node04v2.js (the original pilot) predate the `badgeId`
field (added later alongside the schema in `validate-content.mjs` /
`gift-cell.js` for this rollout) — their gift cells carry `name`/`glyph`/
`blurb` only, no `badge:true`/`badgeId`, so they're informational rows
above, not enforced-unique IDs. Only the 6 new v2 files (and any future
edit to node01v2/node04v2) participate in the `badgeId` uniqueness check.

## Why

Owner's review of the shipped nodes found some concept clusters teach the
ANALOGY first (e.g. node01's `biến` introduced as "a box" before any
technical framing) and only state the precise technical definition
afterwards, once the metaphor has already anchored the student's mental
model on the metaphor instead of the mechanism. The owner's fix: metaphor
should CEMENT a concept the student already has stated precisely, not
REPLACE the precise statement. This plan is the checklist for restructuring
a concept cluster to that order, piloted on two already-shipped nodes
before wider rollout.

## The per-cluster checklist

Apply this to one "concept cluster" at a time (one cohesive teaching unit —
e.g. "what is `biến`", not the whole node):

1. **ĐƯỜNG CHÍNH (direct) first** — a `{npc:...}` cell states the concept
   precisely and technically: exact rule, real Python syntax, one worked
   example if not already run. No metaphor, no "tưởng tượng như…" language.
   Reuses the existing shipped code cell that demonstrates the concept if
   one already runs right before this point (see "experience-first" note
   below) — don't re-run it, just name what was just seen.
2. **ANALOGY second** — a separate `{npc:...}` cell, framed as "Pip kể cách
   khác nè…", RE-explains the same concept via a metaphor. It must restate
   the same rule the direct cell just gave, in different words — never
   introduce new information the direct cell didn't cover. Where the v1
   node already had metaphor language (just misordered), reuse that text
   nearly verbatim here instead of writing new copy.
3. **Practice with right/wrong** — unchanged from today's practice
   philosophy (owner rates it "khá tốt"): a code cell (ideally with a
   `expectOut`-graded outcome) that exercises the concept just taught.
   **Timing fix**: this cell must sit immediately after step 1+2's cluster,
   never several clusters early/late and never before the concept exists.
   If a v1 exercise/quiz tests concept X but is physically positioned
   before X's teaching cell or several clusters after it, relocate it here.
4. **Retrieval quiz** — immediately after practice, testing exactly what
   the cluster just taught (existing checkpoint doctrine: exercise →
   `{checkpoint}` → `{quiz}` right after, never quiz-then-checkpoint).
5. **[Gift if cluster is badge-worthy]** — after the cluster's quiz is
   PASSED, a `{gift:{glyph,name,blurb}}` cell awards a themed "HUY HIỆU"
   (badge) — glyph-faced, no art needed (`gift-cell.js` renders a big
   glyph when `art` is absent). Cap: **1-2 per node** — badges are for
   genuinely earned milestones (a whole concept mastered), not participation
   confetti. Not every cluster gets one; pick the 1-2 biggest concept
   payoffs in the node.
6. **Checkpoint density cap still applies** (2-4/node, existing doctrine) —
   if a node is already at the cap, don't add a new `{checkpoint}` cell for
   a restructured cluster; a quiz right after the analogy is still a valid
   retrieval check without a checkpoint stamp.

### Note: this does NOT touch the existing "experience-before-concept" rule

Root `CLAUDE.md`'s sequencing rules already mandate "trải nghiệm trước khái
niệm" — running code that uses a not-yet-named concept BEFORE the concept is
named (node03/04's input/output-vs-if split is the canonical example). V2
does not change that. The direct-then-analogy order is specifically about
metaphor-vs-technical-framing ordering for concepts that get an explicit
name/definition cell — a cluster can still open with an experience-first
code cell, then have its direct-definition cell, then its analogy cell.

## Pilot scope

Two clones, chosen because they represent the two ends of the spectrum:

- **`node01v2.js`** (strings/read/say/variables) — HAS a real analogy-first
  violation (`biến` taught as "a box" before the technical definition) —
  the clearest test case for the direct→analogy reorder.
- **`node04v2.js`** (if/elif) — a freshly-restructured node with NO
  analogy-first violation (if/elif are taught technically throughout,
  no metaphor language at all) — a test case for "does the template hold
  up when there's nothing to reorder, only timing/reward gaps to fix."

## What changed — node01v2.js

**Restructured cluster: `biến` (variable).** V1 order was:
`greet.py` (experience) → `+` operator explained → **analogy ("name như
một chiếc HỘP") appears here, before any technical framing** → "thử đổi
nội dung" instruction → `greet_again.py` (experience #2) → **direct
definition of `biến` appears here, last** → quiz "Ghép chữ" (testing the
`+` operator, but placed AFTER the whole biến discussion — several
concepts late) → quiz "Vì sao gọi là biến".

V2 order: `greet.py` (experience, unchanged) → `+` operator explained
(unchanged) → **quiz "Ghép chữ" MOVED UP to sit right here** (it tests the
`+`/ghép concept just explained, not `biến` — it was mistimed 5 cells late
in v1) → **NEW direct cell**: precise technical definition of `biến`
("một cái tên do mình đặt ra để máy CẤT một giá trị... giữ NGUYÊN cho tới
khi GÁN LẠI bằng `=`") → **analogy cell reusing v1's box text nearly
verbatim**, reframed as "Pip kể cách khác nè" → "thử đổi nội dung xem sao"
(unchanged, now sits right before the practice it introduces) →
`greet_again.py` (practice, unchanged) → quiz "Vì sao gọi là biến"
(unchanged content, now sits immediately after the analogy+practice it
tests, instead of two cells later). V1's closing restatement cell ("Nội
dung của name THAY ĐỔI được... BIẾN") was folded into the new direct cell
instead of kept as a separate redundant cell.

**Badges added (2, at the cap):**
1. `HUY HIỆU XÂU CHUỖI` (glyph 📿) — right after quiz "Chuỗi hợp lệ" (the
   string arc's retrieval quiz).
2. `HUY HIỆU GHÉP BIẾN` (glyph 🧵) — right after quiz "Ghép nhiều biến"
   (the multi-variable string-glue arc's retrieval quiz).

No new checkpoint cells added — node01 was already at the 4/node cap; the
restructured `biến` cluster gets a quiz but no checkpoint stamp (per §6
above).

## What changed — node04v2.js

No analogy-first violation existed (if/elif are taught technically
throughout). Change here is narrower:

**Timing/reward gap found:** the "three rules" cluster (`three_rules.py`
— student writes all three `if`/`elif`/`elif` branches from scratch) had
**no retrieval quiz at all** before the node moved on to `photo_booth.py`
— a real gap under "new knowledge needs a verifying quiz" (the cluster is
the first time the student must produce a full 3-branch `if`/`elif`/`elif`
unassisted; nothing checked whether that stuck).

**Added:** a new quiz "Ba luật cùng lúc" immediately after `three_rules.py`
(level 2+: a scenario — "máy có `if`/`elif`/`elif` cho 1/3/4 ngón, giơ 4
ngón — máy làm gì?" — not bare recall), then **one badge**, `HUY HIỆU BA
LUẬT` (glyph 📜), right after that quiz. (The task brief said "after the
else catch-all cluster" — node04 never teaches `else` at all, per
`validate-content.mjs`'s GLOSSARY table `else` is node05 — so this is
interpreted as the closest equivalent: the multi-branch/"catch-all of
rules" cluster in THIS node, i.e. the three-rules exercise. Documented here
as a deliberate reinterpretation, not an oversight.)

Everything else (paper-rule intro, `==`/`:`/indentation teaching,
`elif` intro, `damage = damage + 1` accumulator arc, the SYNTAX SERPENT
boss) is unchanged — already direct-first, already correctly timed.

## Validator compatibility

`validate-content.mjs` globs `content/node*.js`, so `node01v2.js`/
`node04v2.js` are picked up automatically (regex `^node.*\.js$` matches).
Two things were checked:

1. **Node-index-based rules apply correctly.** GLOSSARY entries and
   forward-ref checks key off `N.index` (the exported node's own `index`
   field, e.g. `1` for node01v2), not the filename — a v2 file exporting
   `index:1` correctly inherits node-1 glossary rules. No change needed
   for this part.
2. **Cell-position-based rules misfire on reordered clones.** GLOSSARY
   entries also carry a `cell` (the cell array position where a term is
   first DEFINED in the CANONICAL file) — e.g. `biến` is `{node:1, cell:15}`.
   Since node01v2.js deliberately moves `biến`'s definition to an earlier
   array position, the heuristic's same-node check
   (`N.index === g.node && i < g.cell`) would spuriously flag every mention
   between the new (earlier) definition and the old hardcoded position 15
   as a "used before its introduction" forward reference — a false
   positive purely from the reorder, not a real pedagogy bug.
   **Fix applied** (`validate-content.mjs`): `warnGlossaryForwardRefs` now
   accepts an `opts.looseSameNodeOrder` flag; when set, the same-node
   cell-position check is skipped and only the cross-node check
   (`N.index < g.node`) still applies (that one is unaffected by internal
   reordering — a v2 file for node index 1 still can't legally use a
   node-4 term). `main()` detects the flag via a new `isV2Variant(file)`
   helper (`/node\d+v2\.js$/i` on the basename) and passes it through.
   This is intentionally narrow: it only relaxes the ONE heuristic that
   depends on exact intra-file cell position, and only for files matching
   the `v2` naming convention — a manually-reviewed reorder is trusted not
   to reintroduce a real forward reference; a *cross-node* forward
   reference is still caught.

`dev-test.html` needed no change — `?src=` does a plain
`import('./content/${src}.js')` with no name-pattern restriction, so
`?src=node01v2` and `?src=node04v2` already work.

## How to compare v1 vs v2

Side-by-side via two browser tabs pointed at:
- `lesson01.html` vs `lesson01v2.html` (or `dev-test.html?src=node01` vs
  `?src=node01v2` for a single cluster via `?only=`)
- `lesson04.html` vs `lesson04v2.html`

Things to actually watch for while comparing: does the direct-first
definition land BEFORE any "tưởng tượng như…" language; does the analogy
cell restate (not add) information; does the retrieval quiz for a concept
sit right after that concept's practice, not several cells early/late;
does a badge only appear right after a passed quiz, not before.

No student-facing A/B routing exists — this is a manual-comparison
pilot, not a live experiment framework. If the direct-first order reads
better, the plan is to fold the same restructuring into the canonical
`node01.js`/`node04.js` (and audit the rest of the nodes for the same
analogy-first smell) rather than keep permanent parallel v1/v2 files.
