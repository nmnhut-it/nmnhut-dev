# Gemini Art Replacement Plan

> Scope note: the boss, loot, and character prompt guidance in this file is
> still useful. Saga map islands, branches, and towers now follow
> `ART-DIRECTION.md`; its bright Kotopia storybook palette and WebP/AVIF
> runtime contract supersede map-related dark-navy and PNG instructions here.

This file is the working prompt sheet for replacing emoji/character fallback
art with real Gemini-generated assets. It is based on the current Magic Dust
asset style, `lessons/README.md` art pipeline, `FORGE-PLAN.md` boss pipeline,
and the active V2 route wired in `lessons/saga.js`.

## Style Read

Canonical Magic Dust art uses:

- Very dark navy background: `#0a0f1b`.
- Cyan/violet magic dust: `#7ce7ff` and `#a98bff`.
- Friendly digital painting with a readable centered subject.
- Soft glow, rune/circuit/code energy, and strong silhouette.
- Single subject per asset. Avoid crowded compositions.
- No UI, no labels, no readable text. Abstract rune-like marks are fine.
- Bosses should feel like game enemies, not cute icons or emoji stickers.

Do not replace gesture/system marks as main art work. `high five`, `one finger`,
`two fingers`, shaka, checkmarks, stars, and inline code symbols are part of
the interaction language. The targets here are boss faces, loot objects, and
major world/game objects that currently fall back to `glyph`.

## Current Render Rules

Boss rendering chooses:

1. `boss.sheet`
2. `boss.art`
3. `boss.glyph`

Gift rendering chooses:

1. `gift.art`
2. badge crest visual for `gift.badge === true`
3. `gift.glyph`

This means many badge data entries still contain `glyph`, but they are not the
highest priority because badge gifts render as forged crest medallions.

## Priority

### P0: Main Boss Art

These affect the strongest game moments.

| Area | Current state | Target asset |
|---|---|---|
| `node09v2` - THE LOGIC SHADE | glyph-only boss | `assets/logic-shade.webp`, `assets/logic-shade-sheet.webp` |
| `node06v2` - BOUNDARY GOLEM | static art only | `assets/boundary-golem-sheet.webp` |
| `node07v2` - ENDLESS WYRM | static art only | `assets/endless-wyrm-sheet.webp` |
| `node08v2` - THE TYPE MIMIC | reuses mirror wraith art | `assets/type-mimic.webp`, `assets/type-mimic-sheet.webp` |
| `node10v2` - THE COUNT SHADE | reuses mirror wraith art | `assets/count-shade.webp`, `assets/count-shade-sheet.webp` |
| `tower` floor 5 | glyph-only tower boss | `assets/tower-warden-05.webp`, `assets/tower-warden-05-sheet.webp` |
| `tower` floor 10 | glyph-only tower boss | `assets/tower-warden-10.webp`, `assets/tower-warden-10-sheet.webp` |
| `tower` floor 15 | glyph-only tower boss | `assets/tower-warden-15.webp`, `assets/tower-warden-15-sheet.webp` |
| `tower` floor 20 | glyph-only final boss | `assets/lord-null.webp`, `assets/lord-null-sheet.webp` |

Use one isolated Gemini chat per distinct boss character. Do not generate
multiple different boss characters in one chat. For a single boss, keep base
design and frames in that same chat.

### P1: Real Loot Art For Non-Badge Gifts

These are currently true glyph-faced gift objects, not badge crest variants.

| Content | Gift | Target asset |
|---|---|---|
| `node05v2` | SCROLL OF FROST | `assets/scroll-of-frost.webp` |
| `node05v2` | SCROLL OF DISPLAY | `assets/scroll-of-display.webp` |
| `node06v2` | SCROLL OF MEASURE | `assets/scroll-of-measure.webp` |
| `node07v2` | SCROLL OF REPEAT | `assets/scroll-of-repeat.webp` |
| `node08v2` | SCROLL OF TYPE | `assets/scroll-of-type.webp` |
| `node09v2` | SCROLL OF BOTH | `assets/scroll-of-both.webp` |
| `node09v2` | SCROLL OF EITHER | `assets/scroll-of-either.webp` |
| `node09v2` | SCROLL OF FLIP | `assets/scroll-of-flip.webp` |
| `node10v2` | SCROLL OF COUNTED LOOP | `assets/scroll-of-counted-loop.webp` |
| `islandRPS` | dice/random gift | `assets/rps-random-charm.webp` |
| `islandPATTERN` | KÍNH HÀNG/CỘT | `assets/pattern-grid-lens.webp` |

Batch these as similar loot objects in one chat, but stop after 3-4 generations
to review consistency. Unlike bosses, a loot-family chat is acceptable because
the objects are meant to share a family look.

### P2: Optional Map And Side-Island Enrichment

Side islands currently render as simple bonus pins. If the map still feels
placeholder-heavy after P0/P1, generate small island sprites for each side
island family:

- word practice island
- number practice island
- input/output island
- camera island
- branch/logic island
- compare island
- loop island
- type island
- project island
- rock-paper-scissors island
- pattern/loop-art island (`islandPATTERN`)
- tower approach island

Use the existing island sprite prompt style and `art-post.py` cutout workflow.
Suggested target for the new pattern island: `assets/world/islands/side-island-pattern.png`.

### P2 Side-Island Prompt: Pattern Island

```text
Create a small floating side-island sprite for Magic Dust: PATTERN LOOP ISLAND.

Concept: a tiny magical island workshop for loop patterns, with a glowing grid loom, stepped star-pattern tiles, and a small lighthouse-like beacon made of stacked rows. It should visually suggest rows and columns, counted repetition, and drawing shapes with loops, but use no readable text, no digits, no UI, and no emoji.

Match the existing Magic Dust world-island style: transparent-cutout potential, dark navy #0a0f1b flat background for post-processing, cyan #7ce7ff and violet #a98bff magical dust, friendly fantasy game art, readable silhouette, single compact island subject centered in frame.
```

## Pipeline

### For Item, Island, And Cutout Assets

1. Generate in Gemini with a flat dark navy background.
2. Save raw downloads into a scratch folder, for example:
   `lessons/assets/_gen_batch/raw/gifts/`
3. Post-process:

```powershell
python lessons/tools/art-post.py lessons/assets/_gen_batch/raw/gifts lessons/assets/_gen_batch/out/gifts --tolerance 20 --feather 1.5 --size 768
```

4. Review `lessons/assets/_gen_batch/out/gifts/previews/`.
5. Copy approved PNGs to `lessons/assets/`.
6. Wire `gift.art` or `boss.art` into the active `node*v2.js` file.

If cutout quality is bad after two tolerance attempts, keep the flat navy
background rather than shipping a halo or damaged subject.

### For Boss Sheets

The engine expects a horizontal 4-frame sheet. Gemini often produces a 2x2
square grid even when asked for a row.

Recommended flow:

1. Prompt Gemini for a 2x2 state sheet.
2. Keep the dark navy background baked in for sheets.
3. Slice 1024x1024 into quadrants.
4. Rearrange into horizontal engine order:
   `TL = idle`, `TR = hit`, `BL = powered/exposed`, `BR = sealed/staggered`.
5. Save as `assets/<boss-name>-sheet.png`.
6. Optionally crop `TL` as `assets/<boss-name>.png`.
7. Wire:

```js
boss: {
  name: "THE LOGIC SHADE",
  sheet: { src: "assets/logic-shade-sheet.webp" },
  art: "assets/logic-shade.webp",
  glyph: "..."
}
```

Keep `glyph` as fallback, but it should no longer be the primary art path.

## Master Prompt

Use this at the start of every Gemini art request:

```text
Use the established Magic Dust / Kotopia visual style: dark navy #0a0f1b background, cyan #7ce7ff and violet #a98bff magical dust, friendly high-quality digital painting, luminous code-runes, soft glow, readable silhouette, single centered subject.

No emoji, no UI, no text labels, no readable words. Abstract runes and code-like marks are okay, but they must not form real text. The image must feel like a game asset, not an icon sticker. Keep the subject isolated and centered with strong transparent-cutout potential. Use a perfectly flat solid #0a0f1b background unless this is a boss sheet that should keep the navy background baked in.
```

## Boss Sheet Prompt Template

```text
Create a 2x2 square sprite/state sheet for [BOSS NAME], matching the Magic Dust / Kotopia style.

Character concept: [SHORT CONCEPT].

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose.
TOP RIGHT: hit / recoiling pose.
BOTTOM LEFT: powered / exposed / unstable pose.
BOTTOM RIGHT: sealed / staggered / defeated pose with magic-circle energy.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

## P0 Boss Prompts

### THE LOGIC SHADE

```text
Create a 2x2 square sprite/state sheet for THE LOGIC SHADE, matching the Magic Dust / Kotopia style.

Character concept: a semi-transparent shadow mage made of torn logic threads, broken gate locks, and glowing condition fragments. Its body is fog and code dust, with two overlapping lock rings orbiting the torso. It represents `and`, `or`, `not`, and mistaken conditions, but do not write any readable words.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, floating calmly with two lock rings orbiting.
TOP RIGHT: hit / recoiling pose, logic threads snapping and cyan dust bursting.
BOTTOM LEFT: powered / exposed / unstable pose, inner violet core visible, lock rings misaligned.
BOTTOM RIGHT: sealed / staggered / defeated pose, trapped in a cyan/violet magic circle.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### BOUNDARY GOLEM Sheet

Use `assets/boundary-golem.webp` as image reference if Gemini allows upload.

```text
Create a 2x2 square sprite/state sheet for BOUNDARY GOLEM, matching the attached reference character and Magic Dust / Kotopia style.

Character concept: a heavy stone-and-metal guardian with glowing comparison runes, cyan/violet seams, massive fists, and boundary gate energy. Keep the same armor shape and silhouette as the reference.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, grounded and watchful.
TOP RIGHT: hit / recoiling pose, cracks flashing cyan.
BOTTOM LEFT: powered / exposed / unstable pose, comparison runes glowing brighter.
BOTTOM RIGHT: sealed / staggered / defeated pose, kneeling or locked inside a magic circle.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### ENDLESS WYRM Sheet

Use `assets/endless-wyrm.webp` as image reference if Gemini allows upload.

```text
Create a 2x2 square sprite/state sheet for ENDLESS WYRM, matching the attached reference character and Magic Dust / Kotopia style.

Character concept: an infinity-shaped loop serpent made of dark teal scales, violet shadow flames, and glowing code-runes along its body. It represents an endless while loop and a broken stop condition. Keep the same infinity-loop silhouette as the reference.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, loop body coiled in an infinity shape.
TOP RIGHT: hit / recoiling pose, loop breaking open with cyan sparks.
BOTTOM LEFT: powered / exposed / unstable pose, stop-condition core glowing inside the loop.
BOTTOM RIGHT: sealed / staggered / defeated pose, loop pinned by a magic circle and unraveling into dust.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### THE TYPE MIMIC

```text
Create a 2x2 square sprite/state sheet for THE TYPE MIMIC, matching the Magic Dust / Kotopia style.

Character concept: a masked mimic creature made of shifting value shards: string ribbons, number crystals, and boolean light/dark facets. It wears a theatrical mask that changes expression, with a small lens-like core showing hidden types. No readable text.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, mask floating in front of shifting shards.
TOP RIGHT: hit / recoiling pose, mask cracking, value shards scattering.
BOTTOM LEFT: powered / exposed / unstable pose, inner type-lens core revealed.
BOTTOM RIGHT: sealed / staggered / defeated pose, mask locked in a cyan/violet magic circle.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### THE COUNT SHADE

```text
Create a 2x2 square sprite/state sheet for THE COUNT SHADE, matching the Magic Dust / Kotopia style.

Character concept: a clockwork shadow wrapped in bead-count loops and step markers, a calm but dangerous counting spirit. It represents counted loops and range steps. Use glowing tick marks and bead trails, but no readable numbers or text.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, bead loop orbiting evenly.
TOP RIGHT: hit / recoiling pose, bead loop snapping out of rhythm.
BOTTOM LEFT: powered / exposed / unstable pose, counting core overcharging.
BOTTOM RIGHT: sealed / staggered / defeated pose, trapped inside a timed magic circle.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### Tower Warden Floor 5

```text
Create a 2x2 square sprite/state sheet for TOWER WARDEN 05, matching the Magic Dust / Kotopia style.

Character concept: a compact armored gate bug construct made of dark obsidian plates and cyan code seams. It is the first tower checkpoint guardian, small but tough, with simple horns and glowing eyes.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose.
TOP RIGHT: hit / recoiling pose.
BOTTOM LEFT: powered / exposed / unstable pose.
BOTTOM RIGHT: sealed / staggered / defeated pose with magic-circle energy.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### Tower Warden Floor 10

```text
Create a 2x2 square sprite/state sheet for TOWER WARDEN 10, matching the Magic Dust / Kotopia style.

Character concept: a larger armored gate insect construct, evolved from TOWER WARDEN 05, with thicker shell plates, violet corruption seams, and stronger cyan code energy. It should feel like the same tower guardian family, but clearly more dangerous.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose.
TOP RIGHT: hit / recoiling pose.
BOTTOM LEFT: powered / exposed / unstable pose.
BOTTOM RIGHT: sealed / staggered / defeated pose with magic-circle energy.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### Tower Warden Floor 15

```text
Create a 2x2 square sprite/state sheet for TOWER WARDEN 15, matching the Magic Dust / Kotopia style.

Character concept: an elite tower guardian insect construct with sharp segmented armor, scorpion-like silhouette, cyan code seams, and violet shadow spikes. It belongs to the same tower warden family as floor 5 and floor 10, but is more intimidating and angular.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose.
TOP RIGHT: hit / recoiling pose.
BOTTOM LEFT: powered / exposed / unstable pose.
BOTTOM RIGHT: sealed / staggered / defeated pose with magic-circle energy.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

### LORD NULL

```text
Create a 2x2 square sprite/state sheet for LORD NULL, the final tower boss, matching the Magic Dust / Kotopia style.

Character concept: a void-crowned dark sorcerer silhouette with a torn cloak made of broken code fragments, cyan/violet cracks glowing through the darkness, and one hand controlling a sealed magic circle. It should feel grand, dangerous, and final-boss level, not cute and not emoji-like.

Four equal quadrants, same character identity, same scale, same camera angle, centered in each frame:
TOP LEFT: idle / ready pose, floating with cloak fragments orbiting.
TOP RIGHT: hit / recoiling pose, crown and cloak cracking with cyan sparks.
BOTTOM LEFT: powered / exposed / unstable pose, void core visible in the chest.
BOTTOM RIGHT: sealed / staggered / defeated pose, trapped in a huge cyan/violet magic circle and dissolving into dust.

Dark navy #0a0f1b baked background in every quadrant, cyan/violet code-rune glow, no labels, no UI, no emoji, no readable text. Maintain identical silhouette and proportions across all four frames so it can be sliced into a game sprite sheet.
```

## P1 Gift Prompt Template

```text
Create a single magical loot item for Magic Dust: [ITEM NAME].

It should look like a tangible reward object, not a symbol. Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

## P1 Gift Prompts

### SCROLL OF FROST

```text
Create a single magical loot item for Magic Dust: SCROLL OF FROST.

Design an icy parchment scroll with a frost crystal seal, pale cyan-white vapor, and tiny violet dust motes. It unlocks the freeze spell. The object should feel cold, magical, and readable at small size.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF DISPLAY

```text
Create a single magical loot item for Magic Dust: SCROLL OF DISPLAY.

Design a floating AR glass plaque or hologram-frame scroll, with a translucent projection surface and cyan/violet rune dust around it. It represents displaying a value on screen instead of in the console. No readable text.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF MEASURE

```text
Create a single magical loot item for Magic Dust: SCROLL OF MEASURE.

Design a compact magical measuring artifact: a small balance scale blended with a glowing ruler and comparison gauge. Use cyan/violet rune marks, but no real symbols or readable text. It represents greater than, less than, and boundary checks.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF REPEAT

```text
Create a single magical loot item for Magic Dust: SCROLL OF REPEAT.

Design a looped parchment ribbon forming a circular path, with cyan/violet dust repeatedly flowing around it. It should suggest repetition and a stop condition without using readable text or symbols.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF TYPE

```text
Create a single magical loot item for Magic Dust: SCROLL OF TYPE.

Design a tag-shaped lens charm attached to a small scroll, revealing layered value shards inside: a string ribbon, a number crystal, and a true/false light-dark facet. No readable text.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF BOTH

```text
Create a single magical loot item for Magic Dust: SCROLL OF BOTH.

Design two small gate locks joined by one glowing bridge of cyan magic. Both locks are lit at the same time, showing that two conditions must both be true. Do not use written words, symbols, or labels.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF EITHER

```text
Create a single magical loot item for Magic Dust: SCROLL OF EITHER.

Design a forked gate charm with two possible paths, where either path can glow open. Use cyan/violet dust, two small doorways or runic arches, and a clear branching shape. Do not use written words, symbols, or labels.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF FLIP

```text
Create a single magical loot item for Magic Dust: SCROLL OF FLIP.

Design a small mirror-coin charm flipping between light and dark faces, with a cyan rim and violet shadow trail. It represents reversing a true/false result. Do not use written words, symbols, or labels.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### SCROLL OF COUNTED LOOP

```text
Create a single magical loot item for Magic Dust: SCROLL OF COUNTED LOOP.

Design a bead-count loop charm with several glowing step beads moving around a small scroll. It should suggest a known number of repeated steps without using actual digits, text, or labels.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### RPS Random Charm

```text
Create a single magical loot item for Magic Dust: RANDOM CHARM.

Design a small enchanted dice-orb with three abstract facets for choice, chance, and game moves. It should feel like a magical randomizer for a rock-paper-scissors practice island, but do not draw hands, emoji, readable text, or UI.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

### KÍNH HÀNG/CỘT

```text
Create a single magical loot item for Magic Dust: PATTERN GRID LENS.

Design a small enchanted lens or monocle over a glowing row-column grid, with a few tiny star-pattern tiles floating around it. It represents seeing loops as rows and columns. The object should feel tangible, like a magical tool a student receives, not a flat icon. Do not use readable text, digits, UI, or emoji.

Centered object, dark navy #0a0f1b flat background, cyan/violet dust spiral, small warm gold accents only if useful, no text, no UI, no emoji, no readable letters. Friendly high-quality digital painting, matching the existing Magic Dust scroll and charm assets.
```

## Wiring Checklist

After approved assets are in `lessons/assets/`:

- Add `art: "assets/<name>.png"` to non-badge gifts.
- Add `sheet: { src: "assets/<name>-sheet.png" }` to bosses with sheets.
- For `islandPATTERN`, wire `gift.art: "assets/pattern-grid-lens.webp"` after the loot item is approved.
- If side-island sprites are implemented, wire `assets/world/islands/side-island-pattern.png` into the side-island map rendering path for `islandPATTERN`.
- Keep existing `glyph` as fallback only.
- Run focused tests or page smoke checks for any content files changed.
- Inspect at least one desktop and one mobile viewport for text/art overlap.

## Do Not Do

- Do not generate all distinct bosses in one Gemini chat.
- Do not accept emoji-like outputs as final art.
- Do not wire raw 4-8 MB Gemini downloads directly into `assets/`.
- Do not assume Gemini output has transparency.
- Do not remove gesture/system glyphs that teach interactions.
- Do not replace badge crest behavior unless there is a separate design pass.
