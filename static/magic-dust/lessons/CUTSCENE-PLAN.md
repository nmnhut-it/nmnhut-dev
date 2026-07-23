# Cutscene plan — enter + seal per node

Owner (2026-07-05): every node should have a cutscene at START and END (e.g.
after beating a boss, a cutscene of the boss being **phong ấn** / sealed).
Generating cutscenes is EXPENSIVE, so plan it fully first — coherent story,
consistent style + characters, storyboard — THEN generate. Canon:
`STORY.md`. Style DNA: the "Magical Portal to Fantasy World" Gemini chat +
`assets/cutscenes/act1-oneshot.mp4` + the island/boss art already shipped.

## 1. Considerations (things to get right BEFORE generating)

- **Story coherence across nodes.** Each node's cutscenes must advance ONE
  arc, not be isolated. The arc (from STORY.md): kid falls into Kotopia →
  Pip companion → learn Mật Ngữ node by node → each node a boss (a guardian/
  echo of the Dark Lord) → defeat+phong-ấn it → its LIGHTHOUSE lights → the
  path extends toward the dark tower → final: face **Chúa tể Vô Định** →
  open the **Cổng Thời Không** (portal home).
- **Character consistency (a bible, section 3).** Same Pip, same look for
  each recurring boss, same Dark Lord, same world. A boss seen at its ENTER
  cutscene must be the same creature at its SEAL cutscene. Use the existing
  shipped sprites as the canonical reference for each boss.
- **POV convention.** The kid is FIRST-PERSON, never shown on screen
  (established by the onboarding act1 clip). Cutscenes are the kid's POV +
  Pip beside/ahead. Never render the kid's face/body.
- **Style + palette lock.** Dark navy #0a0f1b, cyan #7ce7ff, violet #a98bff;
  the cinematic digital-painting look of act1-oneshot. ALL gens from the one
  canon Gemini chat (style consistency is free that way).
- **Cost tiering (section 4).** 8 nodes × 2 = up to 16 cutscenes is a lot of
  expensive video. NOT all need full Veo generation — reuse the existing
  consistent art with motion for lighter beats; spend real Veo budget only
  on the big story beats. Decide the tier per cutscene.
- **Ties to the boss-concept redesign (FORGE-PLAN.md "BOSS CONCEPT V2").**
  The SEAL cutscene IS the boss defeat: forged BOM MẬT NGỮ → 1-hit KO →
  boss khống chế + phong ấn (sealed in a magic circle) → lighthouse lights.
  So the seal cutscene and the new boss ending are the SAME beat — design
  them together.
- **No-dead-end / skippable.** Every cutscene is tap/skip-to-end, hard-cap
  timed (never wait on `ended` alone) — same discipline as onboard.js. A
  cutscene must never trap a kid or block progress.
- **Length.** Short. ~4-8s each. Kids re-enter nodes (resume) — a long
  unskippable cutscene every entry is punishing; enter-cutscene plays ONCE
  (first entry, flag in localStorage), seal-cutscene plays on the victory.

## 2. Story arc + storyboard (per node)

Boss roster (verified from content): node02 BUG WRAITH · node03 MIRROR
WRAITH · node04 SYNTAX SERPENT · node05 PARADOX SPHINX · node06 BOUNDARY
GOLEM · node07 ENDLESS WYRM · node08(???) CHÚA TỂ VÔ ĐỊNH (final).

| Node | ENTER cutscene | SEAL cutscene (after boss) |
|---|---|---|
| 0 Anatomy | Arrive on the first dim island; the OLD COMPUTER sits dark; BUG WRAITH's eyes flicker inside it — Chúa tể's first threat (cameo exists). | (no boss) — a spark of light as the machine wakes; lighthouse flickers on faintly. |
| 1 Words | The machine glows; Pip shows the words drifting as dust-glyphs. | (no boss) — the island's flora blooms as words come alive; small light beat. |
| 2 Numbers | The BUG WRAITH tears loose from the machine — first real enemy, coils of buggy code. | Forged BOM MẬT NGỮ strikes → BUG WRAITH frozen in a magic circle, **phong ấn**; lighthouse #2 lights; path extends. |
| 3 Input/Output | A MIRROR WRAITH rises from the camera's eye, reflecting the kid's hand. | Bomb → shatters the mirror-self → sealed; lighthouse lights. |
| 4 Rules if/elif | The SYNTAX SERPENT coils around a broken rule-gate. | Bomb → serpent bound in a rune circle, phong ấn; lighthouse lights. |
| 5 Choices/else | The PARADOX SPHINX blocks the path with an unanswerable riddle. | Bomb → sphinx turns to stone, sealed; lighthouse lights. |
| 6 Boundaries | The BOUNDARY GOLEM guards a threshold gate (≤ ≥). | Bomb → golem crumbles into a sealed cairn; lighthouse lights. |
| 7 While loop | The ENDLESS WYRM loops endlessly, biting its tail. | Bomb → the loop is broken/sealed; the LAST lighthouse lights — the path to the tower opens. |
| 8 ??? Finale | The dark tower looms; CHÚA TỂ VÔ ĐỊNH revealed. | All lighthouses blaze → Chúa tể defeated → **Cổng Thời Không opens** → the kid goes home (Pip farewell). The big Veo beat. |

## 3. Consistency bible (reference sheets to lock before batch)

Generate/lock these references FIRST (one per, from the canon chat), then
every cutscene draws from them:
- **Pip** — existing `assets/pip.webp` sprite (cut-out) is canonical. Reuse.
- **Each boss** — the shipped boss sprites (bug-wraith, syntax-serpent, etc.)
  are canonical refs; the cutscene shows the SAME creature. Bosses without
  art yet (mirror-wraith/sphinx/golem/wyrm) need a design pass FIRST (this
  overlaps the boss-art track — do it once, reuse for both arena + cutscene).
- **Chúa tể Vô Định (Lord Null)** — NOT yet designed. Needs a canonical
  design: a void/erasure-themed dark figure atop the black tower. Design
  once here; it's the finale's face.
- **World** — island/world art + `tower.webp` are canonical. Reuse.
- **Palette/POV** — as section 1.

## 4. Production plan (cost-aware, checkpoint-first)

- **Tier A (full Veo video, big beats):** the finale (node08), and 1-2
  marquee boss seals. Real Veo generation (like act1-oneshot). Expensive —
  keep to a handful.
- **Tier B (composited motion, cheap + consistent):** most enter/seal beats
  = the EXISTING island + boss + Pip sprites composited with camera
  motion/parallax + the ritual-vortex FX + a phong-ấn magic-circle overlay,
  rendered as a short clip or even a CSS/canvas scene (no new Veo gen). This
  reuses locked-consistent art → guaranteed style match, near-zero gen cost.
  RECOMMENDED default; reserve Veo for Tier A.
- **CHECKPOINT-FIRST (hard rule, art-checkpoint):** build ONE representative
  pair — node02 ENTER + node02 SEAL (BUG WRAITH, the first real fight) — in
  the chosen tier, show the owner, get the gật, THEN batch the rest. Do NOT
  gen all 16 blind. Generation etiquette + tooling: the `gemini-art` skill.
- **Wiring:** enter-cutscene plays once on first node entry (localStorage
  flag), before the splash; seal-cutscene plays on boss victory (merges with
  the BOSS CONCEPT V2 phong-ấn ending). Reuse `stage-player.js`'s scene/video
  kinds + onboard's hard-cap/skip discipline. New cutscene assets go in
  `assets/cutscenes/`.

## Status
| Piece | Status |
|---|---|
| Plan + storyboard + bible | this doc — awaiting owner review |
| Lord Null + missing boss designs | not started (design once, reuse arena+cutscene) |
| node02 checkpoint pair (enter+seal) | not started (build first, then batch) |
| Batch remaining cutscenes | after checkpoint OK |
