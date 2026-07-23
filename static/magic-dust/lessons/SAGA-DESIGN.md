# Magic Dust — Saga Game Design

The design spec for the teaching platform's next phase: a **coder's saga**. This
is the plan to build (nothing here is built yet — see `lessons/README.md` for
what ships today). Art is the Gemini set in `lessons/assets/`; motion via CSS.

## 1. The experience
A level **MAP** of nodes. Each node is a bite-size lesson framed as **acquiring
and mastering a "machine."** You unlock nodes **in order** by completing a
**ritual** — a real hand gesture that fires the vortex VFX. Progress saves
locally. The loop: *arrive → open a loot bundle → get a machine → learn by coding
→ perform the ritual → next node lights up.*

## 2. Saga map — home (`lessons/index.html`, new)
- Full-screen dark cosmic SVG scene; a **winding path** rising bottom→top.
- **Nodes = glowing orbs** on the path, each showing its **machine art** (e.g.
  `old-computer`, `future-machine`) and a title banner.
- **States:** `locked` (dim + padlock), `current` (breathing glow, "▶ START"),
  `done` (check + calm glow). The path lights up to the current frontier.
- **Interactions:** click current/done → its node page; click locked → gentle
  shake + "Complete the ritual to unlock."
- **Progress:** `localStorage` `magicdust.saga` = # completed nodes (unlock in
  order). Data-driven **`NODES` registry** (title, machine art, page) so adding a
  node = data + a lesson script.
- **Motion (CSS):** nodes idle-float (bob), glow-pulse, sparkle drift; current
  node breathes brighter.

## 3. Node shell — the ritual arc (reused by every node)
A node page runs four acts as a guided vertical flow:
1. **ENTER** — title splash for the node.
2. **BUNDLE** — chest/packet **reveal animation** → grants the machine (a card
   flips in): *"You got: OLD COMPUTER."*
3. **LEARN** — lesson body: lore/anatomy + **notebook-style coding cells**
   (run-as-you-go, revealed progressively).
4. **RITUAL** — full-screen **gesture ceremony**: "Hold ✌ two fingers"; the
   **vortex VFX** spins up; on commit → node marked done, flash/burst, *"Node
   unlocked!"* → back to the map with the next node lit.

## 4. Node 1 — "Old Computer: Words & Numbers"
- **Bundle:** `rookie-bundle` → **OLD COMPUTER** (console only).
- **Anatomy (interactive diagram):** `input-devices` → `brain` → `output-devices`
  art, wired left→right. Tap each to learn its job. Lands the core idea: **every
  computer is input → process → output.**
- **Coding — the ECHO machine** (simplest possible; "it repeats everything"):
  ```python
  from old_computer import read, say      # read=ask (keyboard), say=tell (console)
  text = read("Say something: ")
  say(text)                                # the machine repeats it
  ```
  Notebook cells: (1) run echo; (2) exercise — say it twice / add a greeting.
- **Ritual:** hold ✌ → vortex → unlock Node 2.

## 5. Node 2 — "Input and Output (it can vary)"
- **Bundle:** `future-packet` → **FUTURE MACHINE** (camera + finger-count input).
- **Lore:** inputs/outputs can differ — *this machine SEES your hand.*
- **Coding — conditionals**, notebook cells building up (real camera finger input,
  already wired):
  - Cell 1 (hook): `if fingers == 1: fire()`
  - Cell 2 (exercise): add `elif fingers == 2: freeze()`
  - Cell 3 (exercise): `if full palm: …`
- **Ritual** → unlock Node 3 (future).

## 6. The ritual (gesture + vortex)
Full-screen dark overlay, prompt "Hold ✌ steady to seal it." Reuse the root
`src/` vortex engine (or the lesson camera + a vortex effect) with the
hold-steady commit gate; on success → burst + mark node done in `localStorage`,
return to map. This is where the tuned VFX pays off — as the ceremonial gate.

## 7. Notebook cells (the LEARN coding surface)
A vertical stack of **markdown/lore cells + code cells**. Each code cell: a Run
button + its own output (terminal or scene), **sharing one Pyodide worker +
Python state** across the node's cells. Cells **reveal progressively** (finish
cell 1 to unlock cell 2) to keep beginners on rails. Reuses the worker/SAB
bridge; adds multi-cell run + per-cell output routing.

## 8. Technical architecture
**Reuse:** Pyodide worker + SAB bridge (`worker.js`), `serve.py` (COOP/COEP),
`py/machines` + `py/rules`, the root `src/` engine (vortex ritual), and the
`lesson.js`/`lesson.css` shell (generalized into the node shell).
**New:**
- `lessons/saga.(js|css)` — the map + `NODES` registry + `localStorage` progress.
- `lessons/node.(js|css)` — the node arc (bundle → learn/notebook → ritual).
- Components: bundle-reveal, anatomy panel, ritual overlay, notebook cell.
- `py/old_computer` (echo `read`/`say`) or aliases over `machines`.
Keep it **data-driven** (a `NODES` array + per-node lesson script) so new nodes
are cheap — matches the modularity goal.

## 9. Animation
CSS keyframes on the PNGs: idle float (`translateY` bob), glow pulse
(`filter`/`box-shadow`), sparkle drift (a CSS/particle layer); bundle-open =
scale+rotate+flash; ritual = the real vortex. **Sprite sheets deferred** — CSS
gives ambient life now (see the pending-animation memory).

## 10. Build order (phases)
1. **Saga map home** — SVG map, nodes, progress, CSS animation; nodes link to the
   existing lesson pages as placeholders. ✅ **DONE** — `lessons/index.html` +
   `saga.js`/`saga.css`; dev unlock via console `saga.complete()` until Phase 4.
2. **Node shell** — bundle reveal + machine-granted card wrapping a lesson body.
   ✅ **DONE** — `lessons/node.(js|css)`: splash → bundle → notebook (NPC "Pip"
   + code cells, shared worker state, progressive reveal) → ritual overlay.
3. **Node 1 content** — anatomy diagram + echo notebook. ✅ **DONE**
   (`lesson00.html` + `py/old_computer` read/say).
4. **Ritual overlay** — gesture + vortex; wire unlock → map. ✅ **DONE** —
   real hand gesture: hold the node's sign (✋=5 / ✌=2, from
   `ritual.gesture`) at the camera; charge (2.2s, decays if lost) drives
   `--rc` → scene lights up (camera brightens, glow, glyph swells) →
   flash + shake + seal → map. Hold-button remains as the no-camera
   fallback (it drives the same charge).
5. **Node 2 content** — conditionals notebook. ✅ **DONE** (`lesson01.html`,
   camera finger cells with typed fallback).
6. **Polish** — transitions, sound, sprite animation if desired.
   - **Real particle vortex + magic circle** ✅ **DONE** —
     `lessons/ritual-vortex.js`, lazy-loaded on first ritual open
     (`ensureVortex()` in `node.js`; the CSS `.rrings` stay as the
     script-blocked fallback, hidden via the overlay's `.pvx` class).
     Canvas-2D port of the root `src/main.js` whirlpool motes with the SAME
     constants (gather → back-eased collapse → `1+SWIRL_K/r` differential
     spin), driven by the ritual charge; `burst()` on seal flings the field
     out as dying embers. Plus a **magic circle**: rings + three triangles
     evenly fanned 40° apart (a third of the triangle's 120° symmetry → a
     nine-point mandala, spins drifting apart/realigning) + orbiting runes
     (Unicode runic, `Segoe UI Historic`) fading on their own clocks —
     everything brightens/accelerates with charge and flares out on seal.
   - **Pip avatar + themes** ✅ **DONE** — Gemini-generated Pip portraits
     (`assets/pip.webp` cyan / `assets/pip-bloom.webp` pink-gold) shown in the
     NPC bubble via the `--pip` CSS var; `theme.js` THEMES registry (SPARK /
     BLOOM) persisted in `localStorage` `magicdust.theme`, cycle button in
     the map header, applied on every page through CSS vars.
   - Still open: sound, sprite/state animation.
7. **Gesture-first sweep** ✅ **DONE** — the saga's gesture language:
   ☝ one finger STARTS a node · ✋ high five OPENS bundles · ✋ high five
   SEALS rituals (buttons/taps remain as fallbacks). First-visit
   onboarding: high-five gate → Pip intro (`onboard.js`,
   `magicdust.onboard`). Act gates charge the vortex engine live (dust
   hugs + gift quavers + burst on completion). Node 2 rebuilt around the
   PHOTO CHARM: fire rule → gift → student adds conjure (palm-summon
   motes pour from the hand) → student adds ✌ capture (beauty-filtered
   polaroid + save). Typewriter breathes at sentence ends; one Pip bubble
   at a time. Root app joins the theme (pink/pixel BLOOM bridge) and
   charges ~2.4× faster.
