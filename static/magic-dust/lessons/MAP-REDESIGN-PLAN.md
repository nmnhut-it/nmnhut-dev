# Map redesign — from "app" to "game world"

> Historical implementation plan. For current storybook style, one-file CSS
> states, WebP/AVIF budgets, lazy loading, and asset locations, follow
> `ART-DIRECTION.md`. Do not restore the lit/unlit PNG pairs described below.

Owner verdict (2026-07-04, after the worldbg landed): "layout của các node
nhìn như app chứ không phải game" — two columns of circular orbs floating
over a photo is a settings screen with a wallpaper. The fix is not more
polish on the orbs; it's making the nodes BE part of the world.

## The concept (straight from STORY canon — no new lore needed)

STORY.md/the cutscene already give us: *floating islands, a row of UNLIT
lighthouses along a winding path, a distant dark tower.* So:

> **Mỗi node = một hòn đảo nổi có NGỌN HẢI ĐĂNG. Học xong node → hải đăng
> THẮP SÁNG. Con đường ánh sáng nối đảo này sang đảo kia, mỗi node xong thì
> sáng thêm một đoạn. Cuối con đường: tòa tháp đen (Chúa tể Vô Định).**

Progress IS the world lighting up. That's a game, and it's the exact
promise the intro clip makes (the camera flies past dark lighthouses).

## What changes

1. **Vertical scrolling world** (~220vh tall, Candy-Crush posture): the map
   is taller than the screen; it auto-scrolls to the current node on load
   (smooth), drag/wheel to look around. One viewport of cramped columns is
   the single biggest "app" tell today.
2. **Node = island, not orb**: each node is an island sprite (transparent
   PNG) with its lighthouse + the node's machine sitting on it; the node
   TITLE on a small signpost/banner in the world style; START = a glowing
   beacon pulse + Pip hovering at the current island, not a pill button.
3. **Node states in-world**: locked = island in shadow, lighthouse dark
   (no padlock emoji); current = beacon slowly sweeping + Pip bobbing;
   done = lighthouse LIT (warm beam) + the path segment behind it lit.
   Mystery future nodes = islands half-hidden in cloud.
4. **Path**: a painted/glowing route winding island-to-island (replaces the
   dashed SVG line look), lit progressively. The dark tower is a fixed
   set-piece at the top — visible from node 0, unreachable until the end.
5. **Atmosphere layers**: 2-3 parallax cloud strips between islands
   (drift slowly; scroll at different speeds), fireflies/dust motes near
   lit islands. worldbg stays as the far layer.
6. **HUD stays minimal**: logo + NODE n/m chip + SPARK theme button as-is —
   the header being app-like is fine; the WORLD must not be.

## Asset plan (mine video first, Gemini for the rest — owner's directive)

Style anchors: extracted frames (already in `lessons/assets/world/`) +
palette #0a0f1b/#7ce7ff/#a98bff. All Gemini gens attach a frame as style
reference (workflow documented in README "Art pipeline"; upload tool was
broken for a subagent — if it still is, the owner drag-drops 1 image into
the chat once, then all prompts run in that chat).

| Asset | Count | Source |
|---|---|---|
| Island sprite w/ lighthouse, UNLIT (transparent bg) | 3-4 shape variants | Gemini (ref: crop-lighthouse-isle.webp) — one prompt, "same island, no background, PNG", then vary silhouette |
| Same islands, LIT beam version | 1 per variant | Gemini edit of each ("light the lantern, warm beam") — or CSS glow overlay if the gen is inconsistent (fallback: light with a radial-gradient + beam cone drawn in CSS, only the lantern window needs an art swap) |
| Boss/mystery island (darker, thorns) | 1-2 | Gemini |
| Dark tower set-piece | 1 | extract from video (tower frames exist) + Gemini cleanup if needed |
| Cloud strips (transparent, tileable-ish) | 2-3 | Gemini or extracted+cut |
| Pip hover sprite | reuse existing pip.webp | — |
| Machine medallions | reuse current node art, shrunk, sitting ON the island | — |

PIL pass on everything (transparent PNG for sprites, ≤250KB each).
**Owner checkpoints art by image before mass generation** (project rule):
generate ONE island unlit+lit pair first, show it, get the gật, then batch.

## Implementation phases (each a commit, each shippable)

- **P1 — world skeleton, existing art**: scrolling 220vh map, auto-scroll
  to current, parallax worldbg, islands MOCKED with current orbs sitting
  on crop-*.jpg squares — proves layout/scroll/states with zero new art.
  saga.js/saga.css only; NODES data unchanged (positions become
  world-coordinates in the layout table).
- **P2 — island sprites in**: swap mocks for real sprites (after the art
  checkpoint), signposts, dark tower set-piece, lit/unlit lighthouse
  states wired to progress.
- **P3 — life**: beacon sweep on current, path-lighting animation on
  seal-return (extends the existing arrival fanfare), cloud parallax,
  firefly motes near lit islands, Pip hover at current island.

Non-goals: no engine changes, no content changes, no touch to
entry/onboard/kickoff. The map page only. Perf budget: school laptop —
sprites are static PNGs, animation is CSS/opacity only, no per-frame JS
beyond the existing spark field.

## Status
| Phase | Status |
|---|---|
| Plan | this doc — awaiting owner GO |
| P1 skeleton | **done** — `saga.js`/`saga.css`: 220vh scrollable world, hand-tuned `ROUTE` layout table (world-space x%/y%, replaces the two-column `posFor` formula), auto-smooth-scroll to current node after a beat, `#worldbg`/`#stars` fixed far/mid parallax layers (translate at 35%/60% of scroll) vs. the 1:1-scrolling `#world` (trail+nodes), island mocks (rotating `crop-*.jpg` under an oval CSS mask + drop shadow) under each node, locked=darkened island (🔒 emoji dropped), current=stronger glow + beacon-dot/START in the banner, done=warm rim glow, mystery node fogged (blurred radial gradient), reserved `#tower` set-piece slot at the top. Arrival fanfare (sealed-return pop-in + auto-scroll) preserved. |
| Art checkpoint (1 island pair) | **1 pair generated (Gemini, text-only prompt — `upload_image` not retried after the known-broken report), awaiting owner review** — `lessons/assets/world/islands/island-lighthouse-{unlit,lit}.png` (~220KB/~199KB, 600x327, transparent PNG cutout via PIL near-black threshold — clean over the site's navy bg). Wired live as node 0's island, swapping unlit→lit on `done` state (`saga.js#nodeEl`/`REAL_ISLAND`, `saga.css` `.island.real`). Dark tower set-piece also landed this pass (extracted from `act1-oneshot.mp4` frame, graded toward navy, `lessons/assets/world/tower.webp`, wired into `#tower`) — not gated on the checkpoint since it's mined footage, not a Gemini gen. |
| P2 sprites | **done** — owner-approved checkpoint pair batched to the rest: 3 more lighthouse-island variants (spire/pancake/rocklets, unlit+lit each), 1 boss/mystery island (no lit variant, stays ominous), via `.claude/skills/gemini-art/SKILL.md`'s scripted Gemini pipeline (same "Magical Portal to Fantasy World" chat, no re-rolls needed — all 9 gens landed on-model first try). `art-post.py` gained a stray-component scrub (drops disconnected alpha blobs <1% of image area, also re-applied to the original approved pair which had a stray sparkle glyph). `saga.js`'s `ISLAND_VARIANTS` table rotates the 4 lighthouse islands across every regular node (lit/unlit by `done` state, generalizing node 0's old special-case); the mystery/boss node (no `.art`) always gets `BOSS_ISLAND` regardless of state. `saga.css`'s old oval-mask mock path (`ISLAND_CROPS`) is gone — `.island` is now always the real transparent-PNG sprite. |
| P2b hierarchy | **done** — `saga.js`/`saga.css`: island grown to 260-300px scenery (150-220px in the short-viewport media query) and pulled out of flow (no longer the click target); `.orb`/`.art`/`.badge` machine-medallion markup+CSS removed entirely from the map; a new 44px (32px short-viewport) `.pin` rune bead (number only, ✓ badge when done) is the click affordance and anchors `.node`'s centering so it sits close to the trail line; title `.banner` renders only for the current node, other nodes get a `.tip` chip shown via tap-then-tap/hover (`.tipshown`); `assets/pip.webp` bobs beside the current pin via `.pip`/`pipbob`. Whole node card stays clickable (kid-friendly big tap target) — visual affordance is the pin, per the plan's own allowance. |
| P3 clouds | **done** — 2 Gemini-generated cloud-strip sprites (`assets/world/islands/cloud-strip-{1,2}.png`), wired as `#clouds1`/`#clouds2` fixed parallax layers between `#worldbg` (35% scroll) and `#stars` (60% scroll) — each tiled `repeat-x` and drifting sideways on its own slow CSS keyframe loop so the two layers don't lock-step. Rest of P3 (beacon sweep polish, firefly motes near lit islands) still open. |

## P2b — node hierarchy redesign (2026-07-04, from reference study)

Vision study of Candy Crush Saga + Super Mario World overworlds (the owner's
ask — "đảo bị hình computer che hết, tham khảo game khác"):

- **Nodes are SMALL; the world is BIG.** CC level buttons ≈5-8% of screen
  width (number only); Mario's dots are tinier still. Scenery (trees,
  houses, characters) is LARGER than the buttons and sits beside the path.
- **The path is the spine** — thick, unmistakable; buttons sit ON it.
- **Current level = a character standing there** (avatar bobbing), not a
  bigger button.
- Level names live in HUD/popup, not painted next to every stop.

Applied to us:
1. **Island sprite becomes the star** (~240-300px wide scenery, lit/unlit
   lighthouse states) — it is NOT the click target.
2. **Click target = a small rune PIN (~44px) on the path** at the island's
   base: node number only; done=lit rune, locked=dim, current=beacon ring.
3. **Machine medallion leaves the map** — machines are revealed in-node
   (bundle beat); the map is world, not inventory.
4. **Title banner only on the CURRENT node** (+ hover/tap tooltip for
   others).
5. **Pip sprite bobbing at the current pin** (pip.webp reuse) — the "you
   are here" character, per both references.
