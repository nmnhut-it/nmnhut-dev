# Thợ Rèn + Bom Mật Ngữ — design plan

Owner idea (2026-07-04): the V2 reward badges (HUY HIỆU) aren't just
collectibles — the student takes them to a BLACKSMITH (THỢ RÈN), forges
them into a **BOM MẬT NGỮ** (spell bomb), and deploys it in a boss fight
for a big diagonal "bùm chéo" strike. Closes the loop:

> **HỌC** (qua quiz → nhận huy hiệu) → **RÈN** (ghép huy hiệu thành bom) →
> **ĐÁNH BOSS** (ném bom = đòn lớn).

## Hard rule: ADDITIVE, never a gate

No badges / no bombs → every boss plays EXACTLY as today. Bombs are a BONUS
power (a big-damage shortcut / round-skip), never required to win, never a
dead end. A kid who ignores the forge still finishes every node.

## The three pieces

### 1. Badge inventory (persistence)
- `localStorage` `magicdust.badges` = array of earned badge ids.
- The existing `{gift:{glyph,name,blurb}}` cell, when the gift is a BADGE
  (mark badge gifts with `badge:true` or a `badgeId`), pushes its id into
  the inventory on claim (idempotent — re-claiming the same node doesn't
  dupe). Non-badge gifts (spells/scrolls) unchanged.
- Small helper module `lessons/engine/inventory.js` (pure-ish: get/add/
  spend badges + bombs, all localStorage-backed) — unit-testable.

### 2. Thợ Rèn (forge screen)
- A `{forge:{...}}` cell (new platform cell, sibling to gift-cell) placed
  in a node BEFORE its boss (or reachable from the boss intro). Shows the
  student's badges; a FORGE action combines **N badges → 1 BOM MẬT NGỮ**
  (default N=2; bombs stored in `magicdust.bombs`). Themed: anvil + Pip the
  blacksmith, hammer-strike beat (reuse existing spark/flash FX, no new
  engine). Gesture-first option: hold ✋ over the anvil to "strike" (reuse
  armActHoldGate — fingertip FX automatic), tap fallback.
- If < N badges → forge shows "còn thiếu huy hiệu" (not a dead end, just
  informational; the node continues).

### 3. Boss bomb-deploy ("bùm chéo")
- In the boss arena (boss-fight.js), if `magicdust.bombs > 0`, show a
  "💣 BOM MẬT NGỮ ×N" button. Deploy = spend one bomb → a big diagonal
  explosion FX sweeping the boss (reuse flash/shake + a diagonal streak),
  a large HP chunk (e.g. −150, tunable) OR auto-clear the current round.
  Debounced, one per round. No bombs → button hidden, boss unchanged.
- Space-cheat: register the deploy so the cheat can trigger it too.

## Pedagogy guard
Bombs reward UNDERSTANDING (badges come from passing retrieval quizzes),
not grinding — so the badge→bomb ratio stays meaningful (a bomb costs 2
badges = 2 concepts truly learned). Don't inflate badge sources.

## Boss art (separate track — spritesheet)
Owner: bosses need Gemini art, and "gen 1 lần 8 ảnh trong 1 hình theo
spritesheet — không cần boss to ảnh tốt, cần animation mượt". So: one
Gemini image per boss = a grid of ~8 frames (idle bob / hit-flash / attack
lunge); wire as a CSS `steps()` sprite animation on the boss-art element.
Risk: Gemini isn't a sprite tool — frames may not align/stay consistent.
Fallback if the sheet is unusable: keep the single boss image + CSS
transform idle (bob/breathe) and a hit-shake on STRIKE. Attempt sheet
first, document. THIS TRACK RUNS AFTER the forge merges (both touch
boss-fight.js — sequence to avoid conflicts).

**SHIPPED APPROACH — MOTION (owner-corrected 2026-07-04): SMOOTH, not
stepped.** Owner rejected the hard `--bf` frame-jump as choppy ("giật"),
wants "animation xịn mượt". So the boss idle is now pure **interpolated CSS
transforms** on the art element (node.css `.bossface img/.gglyph/.bsheet`):
four looping animations — `bfFloat` (translate), `bfBreathe` (scale),
`bfSway` (rotate), `bfGlow` (filter) — each on a SEPARATE composable
property at a DIFFERENT period (5s/3.7s/6.3s/4.3s) so they never lock-step.
Reactions ride on `.bossface` (parent) transform and COMPOSE with the child
idle: **hit** = a smooth back-eased recoil punch + brightness flash (NO
frame swap — `.hit` is a transient class stripped by JS so idle resumes);
**heal/stagger** = the state frame CROSS-DISSOLVES in on a second
`.bsheet.pose` overlay (opacity transition) over the always-idle
`.bsheet.base`, never a hard cut. Every boss face type (sheet/img/glyph)
gets the smooth idle with no per-boss code — even glyph bosses now float.

**ART pipeline (still valid for making more sheets):** both bug-wraith and
syntax-serpent art were generated in the SAME Gemini chat ("Retro Computer
Game Asset Generation", app/ecf18d5ae3185742) so the whole boss family
stays on-model — reuse that chat. Gemini emits a **2×2 square** grid even
when asked for a horizontal row; slice the 1024² into quadrants and
rearrange into a horizontal `FS*4 × FS` row in engine order [TL=idle,
TR=hit, BL=heal, BR=stagger] with PIL (see the syntax-serpent commit). Keep
the flat navy background BAKED IN (do NOT chroma-key) — `.bsheet{mix-blend-
mode:screen}` melts it. With the crossfade model only the heal + stagger
frames show as art (hit is transform-only; idle uses the base frame) — the
sheet is still worth making for those green/dizzy poses.

## Terminology fix folded in
"hàm" → "lệnh" everywhere student-facing (functions aren't taught yet;
say()/read()/watch() are "lệnh"). Applies to V2 clones + existing
checkpoints. The V2-rollout agent owns this sweep.

## Gacha add-on: "rèn hụt" retry loop (owner add-on, 2026-07-04)
Forging is probabilistic, not guaranteed: `inventory.forgeBomb(cost, {rand,
bonus})` rolls against `FORGE_SUCCESS_BASE` (constants.js, 0.55). A FAIL
never spends badges — the cost of failing is one extra practice question
(from `{forge:{practice:[...]}}`, the node's own already-taught vocab),
never lost progress. Each practice CLEARED adds
`FORGE_SUCCESS_BONUS_PER_PRACTICE` (0.20) to the odds, cumulative, capped at
`FORGE_SUCCESS_CAP` (1.0) — so a persistent kid is GUARANTEED to forge
within ~2-3 practices. `rand`/`bonus` are injectable so `test-inventory.mjs`
can force either branch deterministically.

## Status
| Piece | Status |
|---|---|
| V2 rollout (all nodes) + hàm→lệnh | delegated |
| 1. Badge inventory (`inventory.js`) + gift-cell persistence hook | **shipped** |
| 2. Forge cell (`forge-cell.js`, gacha/practice loop) | **shipped** |
| 3. Boss bomb deploy (`boss-fight.js`'s 💣 control) | **shipped** |
| Badge claim gesture: 🤙 shaka hold (`isShaka`/`armShakaHoldGate`) replacing ring-catch high-five | **shipped** (2026-07-05) |
| Badge visual: forged crest medallion (`gift-cell.js#crestFace`, replaces emoji glyph) | **shipped** (2026-07-05) |
| Forge/boss loop legibility (forge cell states cost/inventory on screen; boss shows a "no bomb yet → go forge" hint) | **shipped** (2026-07-05) |
| **BOSS CONCEPT V2 — node02 slice** (gesture-only KO boss `ko:true` + quiz-driven forge `forge.quiz` + `inventory.addBomb`) | **shipped** (2026-07-05, commit `38a2455`) — node02 only; browser-verified (forge quiz + boss no-bomb/aim). Nodes 03-07 still on legacy `rounds` (backward compatible), pending owner review of node02 then batch. |
| Boss spritesheet art | **engine shipped** (4-frame STATE sheet idle/hit/heal/stagger via `sheet:{src}` + `.bsheet`/`--bf` + CSS bob/hit/heal/stagger/dissolve). Animated so far: **bug-wraith** (node02), **syntax-serpent** (node04). Still glyph-only, pending art: MIRROR WRAITH (node03), PARADOX SPHINX (node05), BOUNDARY GOLEM (node06), ENDLESS WYRM (node07) — batch after owner reviews the serpent. |

## BOSS CONCEPT V2 (owner, 2026-07-05) — forge weapon → 1-hit KO → phong ấn

MAJOR reframe of the boss encounter. Replaces the multi-round HP grind +
"bomb as one finisher among rounds" with a single climactic forged-weapon
strike that ALSO seals the node (no separate ritual/seal step).

**New flow per boss node:**
1. Learn through the node → earn badges → **forge the BOM MẬT NGỮ** (the
   THỢ RÈN cell; gacha "rèn hụt→học thêm" stays). The forged bomb IS the
   weapon that can kill the boss.
2. Boss appears. Instead of grinding HP over many rounds, the boss is
   defeated in **ONE HIT** by the forged BOM MẬT NGỮ.
3. **The KO gesture = ngón trỏ (index, 1 finger) to AIM/charge, then
   high-five ✋ to UNLEASH** — a ritual strike. The bomb **khống chế
   (subdues) + phong ấn (seals/imprisons)** the boss.
4. **"Khỏi cần seal gì hết"** — there is NO separate ritual-seal cell
   anymore. The 1-hit-KO-with-forged-bomb IS the seal: subduing + phong ấn
   the boss is what unlocks the next node.

**Implications to implement (dedicated pass, AFTER prose-render +
gesture-fx-fix merge — this touches boss-fight.js + ritual-controller.js +
node.js arc + content boss/ritual cells, which overlap those agents):**
- boss-fight.js: collapse the round-HP model — the boss encounter becomes
  the forge check + the 1-hit KO ritual (index-aim + ✋-unleash). Keep
  quiz/code rounds ONLY if they serve as "charging the weapon" flavor, else
  drop them; the KILL is the ritual strike, not accumulated STRIKEs.
- Merge boss + ritual: the separate `ritual` seal cell is removed from
  boss nodes; the boss KO does the seal (`progressStore` unlock). Reuse the
  ritual vortex/FX for the KO+phong-ấn moment.
- No-dead-end: a kid who hasn't forged a bomb must still be guided to forge
  one (the node's forge cell) — the boss can't be passed without the weapon,
  but forging is guaranteed (gacha escalates to 100%). So "must forge to
  win" is OK because forging is guaranteed-with-practice, not luck-gated.
- Every V2 boss node (02-07) gets: a forge beat + this KO-ritual ending.
  (Supersedes the earlier "add old-style forge beats to 05/06/07" task —
  do it uniformly in this redesign.)
- Content: rewrite the boss/ritual framing in Pip's voice ("rèn xong BOM
  MẬT NGỮ chưa? Giơ ngón trỏ ngắm… rồi ✋ HIGH FIVE phong ấn nó!").

### FINALIZED (owner, 2026-07-05) — quiz moves OUT of the boss, INTO the forge

Two clarifications that lock the design (owner: "đánh boss giờ không cần quiz
gì cả mà chỉ cần đúng gesture để kích hoạt bom mật ngữ thôi" · "chuyển quiz
qua lúc rèn nhé"):

1. **The boss has ZERO quiz/code rounds** — not even "charging flavor". The
   boss encounter is PURELY the gesture ritual: hold **☝ (1 finger) to
   aim/lock** → charge (reuse the ritual vortex) → **✋ high-five to detonate**
   the forged BOM MẬT NGỮ → 1-hit KO → phong ấn → next node unlocks. No
   `.qopt` buttons, no code editor, no HP grind in the boss at all. `boss.hp`
   and streak/hearts math are retired for the fight (a bomb = the kill).
2. **All the learning/assessment moves to the FORGE.** The quiz questions that
   used to live in `boss.rounds[]` relocate into the THỢ RÈN cell: answering
   them correctly is what FORGES the bomb. Wrong answer → the existing "rèn
   hụt" loop (playful, more practice, odds escalate to guaranteed). So the
   forge is now the node's real test; the boss is the reward payoff.

**No-bomb handling (owner-confirmed):** reaching the boss with `bombCount()==0`
does NOT let you fight — the boss cell shows a "quay lại THỢ RÈN để rèn BOM
trước" prompt and routes back to the forge. This is allowed to block because
forging is GUARANTEED-with-practice (rèn hụt → practice → 100% odds), never
luck-gated — so it is not a dead end.

**Concrete shape:**
- `boss:{name, art|sheet|glyph, seal?}` — drop `rounds/hp/hearts/baseDmg/…`
  from the fight logic (keep art/name; `seal` optional flavor text for the
  phong-ấn beat). boss-fight.js becomes an aim→charge→unleash ritual gated on
  `inventory.bombCount()>0`, ending in the vortex/phong-ấn seal + `onComplete`.
- `forge:{quiz:[{q,a,correct}], practice?:[…], cost?}` — the migrated boss
  questions go in `quiz`; answering the set correctly forges the bomb (each
  correct = a hammer strike / progress; a wrong one drops into the rèn-hụt
  practice retry). `practice` stays the fail-loop pool. The forge is where
  badges/quizzes convert to the bomb.
- **Checkpoint-first:** build node02 (BUG WRAITH) end-to-end FIRST — engine +
  forge + node02 content migration — get owner review, THEN batch the content
  migration for nodes 03-07 (mechanical repeat of the same pattern).
  **DONE for node02** (commit `38a2455`, 2026-07-05): boss-fight.js `#ko` mode,
  forge-cell.js `forge.quiz`, inventory.addBomb(), node02v2.js migrated,
  validator updated, tests green, browser-verified.
  **Vortex juice DONE** (commit `e806a07`): the KO now drives the real ritual
  particle vortex (ritual-vortex.js) — aim ☝ charges the funnel, ✋ unleashes +
  burst(), boss sucked into the magic circle (phong ấn). The detonation already
  IS the ritual, beautiful.
  **MERGE RITUAL INTO KO — CONFIRMED (owner, 2026-07-05):** "nếu có đánh boss
  nổ rồi thì không cần ritual đâu — kích hoạt bom giống ritual rồi." → the
  separate node-ending `ritual:` cell is REDUNDANT for ko-boss nodes and must
  be dropped: the boss KO's phong-ấn IS the node seal + unlock. **TODO (do in
  the 03-07 batch + retrofit node02):** suppress the auto-appended `{ritual}`
  cell when the node ends in a defeated ko-boss, and route the boss victory()
  into the same node-seal/unlock the ritual's onSealed did (node.js arc +
  notebook-runner buildCells). Non-boss nodes (0,1) keep the ritual.
