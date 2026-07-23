# Magic Dust — Teaching Platform

> **Designing/reworking a lesson? Read [`PEDAGOGY-METHOD.md`](PEDAGOGY-METHOD.md)
> first** — the canonical teaching-design method. `AUTHORING.md` is the
> 30-minute build checklist; `validate-content.mjs` mechanizes the rules.

This repo now holds **two things**. Don't confuse them:

1. **The original VFX app** — `index.html` + `src/` at the repo root. Open-palm
   summon → charge → whirlpool vortex → cast, with the tuned particle system.
   Untouched by the teaching work. See the root `CLAUDE.md`.
2. **The teaching platform** — `lessons/`, `py/`, `engine/`. Browser-based coding
   lessons where students write **pure Python** that drives the AR/VFX. This doc.

## The saga game (product direction — where this is heading)

**Story canon: [`STORY.md`](STORY.md)** — the Kotopia story bible (world,
characters, per-node beats, the fixed "Mật Ngữ" terminology, the Pip voice
guide + anti-AI-slop rules, and the "CODE!" onboarding spec). Read it
before writing any narrative content; the onboarding implementation plan is
[`ONBOARD-PLAN.md`](ONBOARD-PLAN.md).

The teaching platform is becoming a **saga game**: a level-**map** home page
(Candy-Crush-style) of lesson nodes, unlocked in order, progress saved in
`localStorage`. Each node is a lesson with a **ritual arc**:

> **enter** → **open a "bundle"** (loot-box reveal that grants a "machine" /
> toy) → **learn** via Jupyter-notebook-style coding cells → **perform a
> RITUAL** (a real gesture + the vortex VFX) to **unlock the next node.**

The map itself is **SVG**, with Gemini-generated illustrations as node art
(see "Art pipeline" below).

### Node plan
| Node | Title | Bundle → machine | Teaches | Coding |
|---|---|---|---|---|
| 1 | Old Computer: Words & Numbers | rookie bundle → **OLD COMPUTER** (console only) | computer anatomy: input devices → processor/GPU "brain" → output devices | simple read/print — an **ECHO** machine ("repeats everything it prints") — plus a calculator (`read_num`/`say_num`) |
| 2 | Input and Output | future-packet bundle → **FUTURE MACHINE** (camera + finger-count input) | **conditionals** | hook: `if 1 finger then …`; then exercises (`if 2 fingers`, `if full palm`, …), notebook-style |

Gesture verbs beyond hold-N-fingers (swipe, chase-a-drifting-target) are
tracked in `lessons/GESTURE-QUIZ-EXPANSION.md` — two are piloted in real
content (2026-07-03), the rest is still a plan.

Status (Phases 1–3 + 5 of `SAGA-DESIGN.md` built; 2026-07-02):

- **Map home** (`lessons/index.html` + `saga.js`/`saga.css`): a tall
  **scrollable world** (~220vh, `MAP-REDESIGN-PLAN.md` P1 — world skeleton,
  existing art only) with a winding SVG trail through a hand-tuned `ROUTE`
  layout table (world-space x%/y%, data not formula — P2 will nudge these
  per real island art), lit reveal, a fogged `???` mystery node, and a
  reserved `#tower` set-piece slot at the world's top. **Node hierarchy
  (P2b, from a Candy Crush/Mario reference study)**: the island sprite is
  big scenery (~260-300px, 150-220px on short viewports) and is NOT the
  click target — a small rune **pin** (~44px, number only, ✓ badge when
  done) sits on the trail at the island's base and is the visual
  affordance (whole node card stays clickable for a forgiving big tap
  target). The old machine-medallion (`.orb`/`.art`) is gone from the map
  entirely — machines are revealed in-node, not painted on the world. Node
  states: locked=dim pin+darkened island, current=beacon pin + breathing
  glow + Pip (`assets/pip.webp`) bobbing beside the pin, done=lit/warm pin
  + rim glow. Only the current node gets a title banner; other nodes show
  their title in a `.tip` tooltip chip on tap/hover (`.tipshown`).
  `#worldbg`/`#stars` are fixed far/mid parallax layers
  (translate at ~35%/60% of scroll); the trail+nodes live in `#world` and
  scroll 1:1 with the page. Auto-smooth-scrolls to the current node on load
  after a beat. `localStorage` progress (`magicdust.saga` = # completed).
  Console dev API: `saga.complete()` / `saga.reset()` / `saga.set(n)`.
  **Arrival fanfare**: sealing a ritual sets `sessionStorage`
  `magicdust.sealed`; back on the map the newly-unlocked node pops in with a
  snap-in pulsing frame and a flashing START, auto-scrolls into view, and
  steers the student straight into the next node.
- **Node shell** (`node.js`/`node.css`): the full ritual arc — ENTER splash →
  BUNDLE tap-to-open reveal ("YOU GOT: …" card) → LEARN as a **Jupyter-style
  notebook** (NPC "Pip the dust sprite" speech bubbles with typewriter text +
  `In [n]` code cells: per-cell Run/output, Shift+Enter, ↺ reset, shared
  Python state in one Pyodide worker, progressive reveal that blocks at
  interactive cells) → RITUAL overlay. `lesson00.html`/`lesson01.html` are
  now node pages driven by a per-page `window.NODE` config.
- **In-node resume** (`progress-versioning.js` + `node.js`): saves how far a
  student got *inside* a node (cell index + boss/gift sub-state) to
  `localStorage` `magicdust.node.<index>.progress`, separate from the
  across-node `magicdust.saga` counter above. The blob is content-versioned
  (`contentVersion(N.cells)`, a djb2 hash + cell count) so an edited lesson
  or an out-of-range saved index resets to cell 0 instead of resuming
  somewhere wrong; corrupt JSON is swallowed defensively. Cleared on ritual
  seal. Pure logic tested standalone in `lessons/test-progress-versioning.mjs`
  (`node lessons/test-progress-versioning.mjs`).
- **Node 0 content**: interactive anatomy widget (hold 1/2/3 fingers — or
  tap — to inspect input-devices → brain → output-devices) + the ECHO
  machine (`py/old_computer` — string-safe `read`/`say`) + a greet exercise
  + two solo challenges + the **SPELL HOSPITAL** (read-the-complaint
  healing: misspelled name in `wish.py`, lost closing quote in `quote.py`,
  rogue indent in `indent.py` — all compile/run-time errors the student
  fixes by reading the machine's complaint) + the node's **BOSS: THE BUG
  WRAITH** (see boss fight below) whose rounds are the THREE PARTS +
  SPELL HOSPITAL questions plus five classic-typo code rounds (misspell,
  lost quote, forgotten quotes, unclosed `(`, capital letter, rogue indent). **Quiz by hand** (`{quiz:…}` cell in `node.js`): hold up
  1/2/3 fingers to arm that option — the armed button swells/glows in place
  (`--qp`) and a right answer pops a spark burst on the button itself (no
  full-cell vortex; it distracted from the question). Tap fallback.
  **Content rule:** a numeric answer option must sit on the button whose
  number equals it (answer "3" on button 3), so fingers and labels agree.
- **Node 1 content** (step-by-step, `py/camera_charm`): rules on PAPER
  first — `finger = 0` + `if finger == 1: say("✨ FIRE!")` on the old
  computer (run the SILENCE as-is, then a second copy of the same rule where
  the student changes 0→1 to make it TRUE) → the **CAMERA CHARM** gift
  unlocks the machine's eye → swap ONLY the input (`finger = watch()`) →
  swap ONLY the output (`fire_vortex()` — the real vortex-and-FIRE cast) →
  hospital wing (`cracked_rule.py`, missing colon) → **☀ SCROLL OF LIGHT
  gift unlocks `lighten()`** → `elif finger == 3: lighten()` exercise →
  **🌙 SCROLL OF DARK gift unlocks `darken()`** → `three_rules.py`
  build-from-nothing (1 fire_vortex / 3 lighten / 4 darken) → `photo_booth()`
  treat → **BOSS: THE SYNTAX SERPENT** guarding the seal (THE RULES
  questions + rule-bug code rounds: missing colon, `=` vs `==`, unindented
  body, capital `If`). Typed fallback when no camera. **New words are LOOT**: each spell is gifted
  after completing an exercise (glyph-faced gift cells — `{gift:{glyph}}`
  when there's no art asset). **Sign vocabulary rule: 2 fingers is NEVER a
  lesson rule** — ✌ belongs to the booth's SNAP; one sign must never mean
  two things. `lighten()`/`darken()` (worker kind `screen`) wash the panel
  light/dark (`#sclight`, persists until the next run — the changed screen
  IS the output, no freeze-frame). **No `while True` in student code** — the booth
  loop lives inside `camera_charm.photo_booth()` (an error or a lost gesture
  can't wedge the cell); loops get written by the student in a later node.
- **Ritual = real gesture** (Phase 4): hold the node's sign at the camera
  (✋ open palm for both nodes today — `ritual.gesture` maps to a finger
  count). Holding it charges the seal (2.2s; decays if you drop the sign) —
  the `--rc` CSS var lights the scene (camera brightens, glow, glyph
  swells) — then flash + shake + "NODE SEALED ✦" → progress → map.
  A press-and-hold button appears only as the no-camera fallback (it drives
  the same charge). Test hook: `nodeDev.force(n)` feeds a fake finger count.
- **Ritual vortex + magic circle** (Phase 6, `ritual-vortex.js`): the REAL
  particle engine behind the ritual — a canvas-2D port of the root
  `src/main.js` whirlpool motes (same gather → back-eased collapse →
  `1+SWIRL_K/r` differential-spin constants), lazy-loaded on first ritual
  open and driven by the same charge. Ambient dust orbits a **magic circle**
  (rings + three triangles fanned 40° apart — a nine-point mandala whose
  spins drift and realign — + orbiting runes fading on their own clocks);
  charge winds the whole engine up and funnels the dust into the core; the
  seal bursts it outward as dying embers while the circle flares out. If the
  script can't load, the old CSS rings remain as the fallback.
- **Themes** (`theme.js`, loaded by the map + every node page): per-player
  palette + Pip art + fx style, persisted in `localStorage`
  `magicdust.theme`. Two themes today — **✦ SPARK** (cyan/violet, soft glow
  fx, `assets/pip.webp`) and **❀ BLOOM** (pink/gold, **pixel fx** — square
  grid-snapped motes, crisp strokes, square sparks — `assets/pip-bloom.webp`,
  the girl-friendly variant). Everything reads CSS vars (`--c`, `--c2`,
  `--bg`, `--pip`) plus the `:root.fx-pixel` class, so the map trail, CTAs,
  Pip's avatar, the vortex engine and even the **root VFX app** (theme
  bridge in `src/main.js`) follow the swap; adding a theme = adding a
  `THEMES` entry. Cycle button in the map header.
- **Gesture language** (consistent everywhere): **☝ one finger to START**
  (node splash AND the BEGIN-THE-RITUAL cell; button fallback) · **✋ HIGH
  FIVE to OPEN** (bundles AND mid-notebook gift cells; tap fallback) ·
  **✋ HIGH FIVE to SEAL** (every ritual; hold-button fallback) · **hold
  1/2/3 fingers to CHOOSE** (quiz options AND anatomy parts; tap fallback).
  One generic act gate in `node.js` (`armActGate`): hold the sign, the gauge
  fills (soft decay when dropped), the charge fx rides the hold (bundle
  vortex, gift shimmer `--gc`, CTA glow), completion fires the act. Cells
  with an `_arm` hook (quiz/gift/anatomy/ritual) arm their gate on reveal.
  A RUNNING cell's camera ask outranks the armed act gate (rerunning a
  `watch()` cell above a gated cell still works), and gate `dt` is capped so
  resuming after a pause can't dump a huge hold. The YOU GOT card
  auto-advances into the notebook (no TAKE IT button). Deliberately still
  tap/click-only: RUN (typing context), NPC bubble skip, polaroid ⬇ SAVE,
  map node START.
- **Boss fight** (`{boss:…}` cell, `bossCell` in `node.js`): the node's
  GATE — quiz questions and code exercises become **attack turns** against
  a boss with an HP bar. A right answer (hold 1/2/3 fingers or tap) or a
  clean code run lands a hit; **consecutive hits multiply** (streak ×1 →
  ×1.5 → ×2); a wrong answer / crashed run **heals the boss** (+10), breaks
  the streak and costs a ♥; all 3 hearts gone → the boss taunts and fully
  heals (soft fail, no lockout). Missed questions rotate back into the
  pool; broken-code rounds stay in place until healed (the student's
  fix-in-progress is never wiped). HP 0 → it staggers: **✋ high-five the
  camera (or tap the beast) to land the killing blow** — victory reveals
  what follows (the ritual), so **mastery is the only unlock**. Balancing
  per node config: `{hp, baseDmg, streakMul, heal, hearts, rounds}` —
  default 100 HP / 20 base / heal 10 means ~75%+ accuracy wins in one pool
  pass and heavy guessing can't. Score + best streak persist per node in
  `localStorage` `magicdust.stats`. Boss face = art or glyph (`👾`/`🐍`
  until the Gemini sheet lands).
- **One run at a time, never stuck** (`runCell`/`pendingAskCancel` in
  `node.js` + the `'\x18'` sentinel in `worker.js`): one Pyodide = one run,
  so RUN buttons disable while a cell executes. If the previous run is
  parked on an input (typed prompt or hold-fingers ask — e.g. a forgotten
  rerun), pressing RUN on any other cell **cancels that ask**: the sentinel
  makes `bridge.ask` throw `__MDCANCEL__`, the stuck run unwinds ("⏹
  stopped — you ran another cell") and the new run starts automatically. If
  the runtime is genuinely computing, a toast explains and scrolls to the
  busy cell.
- **Camera lifecycle** (`ensureCamera`/`maybeReleaseCamera` in `node.js`):
  the webcam is acquired on demand and **released (LED off) when nothing
  needs it**. node.js OWNS the pipeline — its own `getUserMedia` + one rAF
  loop feeding MediaPipe Hands (never re-entrant, skips paused frames; the
  MediaPipe `Camera` driver is NOT used — its `stop()` left a zombie loop,
  and two loops feeding `hands.send()` kill landmark detection while the
  video still looks live). Release stops tracks only (a frozen frame stays
  visible); re-acquisition makes a new stream and `syncCamViews()` refreshes
  every live chip video. Release checks run deferred after each run and
  cell completion; an armed act gate, a live ask, the ritual, or a start in
  flight keeps it alive. Camera asks have an **800ms get-ready grace**
  (booth: 400ms) so a hand entering the frame can't lock ✋5 before the
  student poses, and are **cancellable from the instant they start**. The
  camera panel is **4:3** (full frame, no crop), centered at ≤480px.
  **Watchdog**: if a gate/ask is armed and frames should be flowing but
  MediaPipe results stop for >3.5s, the camera force-restarts itself
  (`restartCamera` — fresh stream, gates survive, chips repointed).
  **Hidden expectations**: a code cell may carry `expect: n | [n,…]` (page
  config only — never the student's editor): its camera ask locks ONLY on a
  matching count, so a flaky read can never derail the exercise — the
  student holds their sign until it registers ("hold your sign steady…").
  Node 1: real_input/real_output/cracked_rule expect 1, two_rules [1,3],
  three_rules [1,3,4].
  **Output expectations**: a code cell may also carry `expectOut` (page
  config only) — checked in `onWorker`'s `done` handler before
  `completeCell`, against `el._captured` (every `tell` payload the run
  produced, pushed regardless of which fx it dispatches to) and
  `el._heldCount` (the finger count resolved by the run's `fingerAsk`, if
  any). Fixes a real gap: a clean run used to always advance, even an
  unedited fill-in-the-blank starter that produced no/wrong output. Shape:
  string (case-insensitive substring) | RegExp | array (OR of either) |
  object map keyed by held finger count (for cells with more than one
  branch, e.g. `{1: /fire/i, 3: /light/i}` — a missing key passes, since
  there's no expectation for that branch). Lives in the standalone
  `cell-validation.js` (`cellOutputSatisfies`, pure, no DOM) loaded before
  `node.js`; also fixed the typed no-camera fallback (`fingerAskStub`) to
  re-prompt on a count not in `expect`, matching the camera gate instead of
  accepting any typed number. See `lessons/test-cell-validation.mjs`.
- **Pip-paced reveal**: npc bubbles are soft gates — the next cell stays
  hidden until the typewriter finishes (or the bubble is click-skipped);
  `typeBubble` calls `completeCell` at the end.
- **`{remember:'…' | ['…',…]}` cells**: short, concise takeaway callout
  cards (✦ REMEMBER), ~3 per node after each key concept; an array renders
  stacked lines — Node 1 uses one for the full **if-rule anatomy** (fires
  only when TRUE · ends with `:` · body indented · `==` vs `=`) right after
  the two paper examples, before the camera charm.
- **Cheats / dev testing**: type **`pip`** on any node page (or open with
  `#cheat`) → panel: skip cell · to boss · to ritual · cast fire · lighten /
  darken · boss 1hp · win boss · seal node. Same functions on
  `window.nodeDev` (`skip/toBoss/toRitual/cast/screen/bossHp/winBoss/seal`,
  plus the existing `force(n)` ritual finger override). On the MAP, `pip`
  (or `#cheat`) → unlock node N / all sealed / reset / replay onboarding
  (wraps the `saga.*` console API). `toBoss`/`toRitual` work from the
  splash — they drive the enter/bundle acts first.
- **Space = instantly pass the current gate**, but ONLY while the cheat
  panel is open (same on/off switch as `pip`/`#cheat` — students never see
  the panel, so Space is silently inert for them). Design: a tiny bypass
  registry (`engine/bypass-registry.js`) — every site that arms a camera/
  voice gate (act-transition holds, quiz hold/track questions, boss hold/
  swipe rounds, the gift's timed catch, the python fingers-ask camera cell,
  the ritual) registers `{label, resolve}` there when it arms and
  unregisters when it disarms/completes; a global `keydown` (guarded against
  typing in inputs/code editors) calls the most recently registered
  `resolve()`. Quiz/boss resolve to the CORRECT answer/direction, the gift
  resolves to a perfect catch, the fingers-ask feeds the cell's expected
  count, and the ritual calls its own existing `forceFingerCount`/
  `forceChant` hooks — a small "⏭ CHEAT" toast confirms it fired.
- **`serve.py` is threaded** (`ThreadingHTTPServer`) — the old
  single-threaded server wedged on one stalled keep-alive connection,
  hanging every later request with zero console errors.
- **Homepage entry funnel** (`lessons/entry.js`+`entry.css`, `index.html`):
  before the map is usable, a fullscreen one-gesture entry (reusing
  `stage-player.js`'s `mountGestureTitle` — same look/feel as
  `kickoff.html`'s default deck) breathes "Kotopia đang chờ cậu" over the
  living magic circle; camera auto-arms silently, hold ✋ charges, full
  charge seals (flash/burst). `index.html` boots `theme.js` → `saga.js`
  (renders the map first) → `onboard.js` (loaded with `data-manual`, so its
  own auto-mount is disabled) → `entry.js` last, which overlays `#entry` on
  top of the already-rendered map. On seal (or an instant tap/Enter/→/Space
  skip — never a dead end): first-ever visit
  (`localStorage['magicdust.onboard']` unset) → `Onboard.mount({onDone:
  revealMap})`; returning player → straight to the map. `?noentry` skips
  the entry layer entirely (dev bypass). `ENTRY_EVERY_VISIT` (top of
  `entry.js`) is the one-line flip between "gesture entry every visit"
  (current default — gesture-first is the brand) and "only ever once."
  See `KICKOFF-PLAN.md`'s §C for the full design note.
- **Onboarding** (`onboard.js`, mounted manually by `entry.js` on a first
  visit, or via `onboard.html`'s always-replayable dev harness): "✋ HIGH
  FIVE TO ENTER" over live camera + the vortex engine; the five flashes and
  Pip pops in with a typewriter intro (sentence-aware pacing) → LET'S GO.
  `saga.reonboard()` replays; tap the hand = no-camera fallback.
- **Spell cast = the root arc with the ROOT ENGINE** (`lessons/spell-vfx.js`
  + `castSpell`/`doCast` in `node.js`): `fire_vortex()` (worker kind `spell`)
  runs the actual fine-tuned WebGL mote system from `src/main.js` — a verbatim port
  (same pooled-mote constants, same additive point shader with the fx-pixel
  theme variant, same summon→gather→whirlpool→burst math) with a real
  **UnrealBloomPass**, panel-sized. Lazy ES-module import against the same
  three.js import map as the root app (now in each lesson page's head); one
  engine per page mounts over the camera panel (`#svfx`) and `cast(color,
  bloom)` runs the arc — dust pours from the centre (0.8s summon), the
  vortex grabs and funnels it (1.1s charge, spell-colored, bloom ramps),
  detonation resolves the promise so the flash/freeze-frame lands on the
  burst. The canvas-2D `ritual-vortex.js` stays for story beats (act gates,
  gift shimmer, booth pour, ritual) and as the cast fallback if the module
  can't load. **The FINE-GRAINED FIRE VORTEX timeline is the root cast
  cloned exactly**: 1.2s full-power pour → 0.22s GATHERING settle (intensity
  eases 0→`STILL_I`, near-zero spin) → **LINEAR** charge climb at
  `1/CHARGE_SEC` (never smoothstep — easing rushes the c≈.3–.7 window where
  the whirlpool winds its spiral arms) → detonation; the attract point
  sways gently like the root's live fingertip.
  **Panel adaptations (do NOT "fix" back to root values)** —
  the whirlpool math is verbatim but a 480px panel is not a 1080p screen:
  mote size keeps the root's ABSOLUTE pixel footprint (`SCALE_MIN` floor —
  proportional scaling shrank motes to dim single pixels with nothing for
  bloom to bleed), the pool is HALVED (root density whites the collapsed
  core into a structureless blob), the pixel/BLOOM shader alpha is dimmed
  ~45% (flat-fill squares carry 4-6× the soft sprite's energy), the pour
  runs at full `summonRamp` (the 1s cast summon can't ramp like a held
  palm), and `.casting` darkens the camera plate (additive dust needs
  darkness — root's `updatePresence`). Manual API: `summon(on)`,
  `setCharge(c)`, `burst()`, `setColor(hex)` (root parity + testing).
- **Node 1 photo booth** (`camera_charm.photo_booth()` + `node.js`): one
  student line — the ✋/☝/✌ loop is wound inside the module. ✋ open palm
  **pours motes from the hand itself** (engine `emit()`, root-app summon
  physics), ☝ whirls the cloud into the funnel, ✌ SNAP — a mirrored
  **beauty-filtered** polaroid (tone lift + soft blurred skin pass) with the
  particle canvas burned in, framed + captioned, with a ⬇ SAVE link — and
  the internal loop breaks. The booth gesture ask (worker kind `gesture`)
  only accepts the three booth signs; HUD reads ✋ pour · ☝ whirl · ✌ snap.

**Locked design principles (don't undo):** explicit machine names at the call
site (`old_computer_ask` vs `future_machine_ask`; swap = find-replace; the
import abstraction is *revealed* later, not up front); action outputs
(`fire`/`freeze`); pure/minimal student code (no ABCs/pipelines); the run
"ends on the fx"; SVG for the map with generated illustrations as node art.

## Art pipeline (node/asset illustrations — the standard)

### Current saga-map runtime contract (supersedes the legacy map notes below)

The canonical visual and delivery rules are in `ART-DIRECTION.md`. Saga map
locations live under `assets/storybook/` as one transparent `520x520` WebP per
location (quality 82, target <=120 KB); locked/current/done are CSS states.
Large opaque backgrounds prefer AVIF with WebP and PNG fallbacks. Only the
current node loads eager/high priority; other locations lazy-load and decode
asynchronously.

Do not build a location atlas: the measured atlas saved only about 1.1% over
26 individual WebPs and would defeat per-location lazy loading. Spritesheets
remain useful for frames of one real animation, such as the RPS token sheet.
Process runtime assets with:

```powershell
python lessons/tools/art-post.py <input-dir> <output-dir> --no-cutout --size 520 --format webp --quality 82 --budget-kb 120
```

The world-backdrop, old lighthouse-pair, and dark-navy sections below are
historical pipeline notes. Do not use their PNG pairs or palette as the saga
map runtime contract.

Illustrations are **generated via Gemini using Chrome browser control** (the
user is logged into `gemini.google.com`; keep prompts in the **same chat** for
style consistency).

**Style:** dark navy (`#0a0f1b`) background, cyan (`#7ce7ff`) / violet
(`#a98bff`) magical dust, friendly digital-painting, **single centered
subject**.

**Save gotcha (important):** generated images are same-origin `blob:` URLs
(1024²). A `fetch()` of the blob URL **fails — it gets revoked**. Robust save:
draw the `<img>` to a `<canvas>` → `canvas.toBlob()` → `<a download>`. Then
move the file from Downloads to `lessons/assets/` and **optimize with Python
PIL**: `thumbnail((768,768))` + `optimize=True` → ~700 KB.

### Assets
Target set (in `lessons/assets/`): `old-computer`, `rookie-bundle`,
`future-machine`, `future-packet`, `brain`/`GPU`, `input-devices`,
`output-devices`, `photo-charm` (Node 1's gift camera), plus Pip's avatars
`pip` (cyan, SPARK) and `pip-bloom` (pink/gold, BLOOM).
- **Present today:** the full set above (~400–765 KB each, PIL-optimized).

### World backdrop — frame-mined from the cutscene (`lessons/assets/world/`)
The map's background (`saga.js`'s `#worldbg`, styled in `saga.css`) is not
Gemini-generated — it's **mined directly from `assets/cutscenes/act1-oneshot.mp4`**
(the canon Kotopia reveal: bedroom → magic-circle portal → light tunnel →
floating islands/lighthouses/winding path/dark distant tower), since the
cutscene's own render already IS the target look, at a resolution/detail
Gemini's flat-icon style can't match. Workflow:
1. **Extract** frames with `lessons/tools/extract-frames.py <video> <outdir> --fps 2`
   (wraps `ffmpeg`; also supports `--at 1.0,4.5,7.0` for explicit timestamps).
   Dumped frames are scratch — never committed.
2. **Pick** the best beat frames by eye (a quick PIL contact-sheet montage
   helps scan a clip's ~20 frames at once).
3. **Grade toward navy** with PIL so UI glows still read over the backdrop:
   `ImageEnhance.Brightness`/`Color` to darken+desaturate, then
   `Image.blend` against `#0a0f1b` navy at ~20-30% — see the grading recipe
   used for `world-map-bg.webp`/`bedroom-portal.webp`/`portal-tunnel.webp`.
   Resize to 1920w, save as JPEG `quality=82, optimize=True` (~70-135 KB).
4. **Square crops** (`crop-*.jpg`) of distinct islands/lighthouses/flora
   clusters are cut from the same graded source for reuse as node-art bases
   or map decorations later — pad-to-square with navy letterbox before
   resizing so nothing stretches.
5. **Gemini pass (optional, for content frames can't provide)** — same
   Gemini-via-Chrome workflow as node art, but **upload an extracted frame
   as a style reference** (drag/attach into the chat) before prompting, so
   any generated piece matches the mined frames' exact palette/rendering,
   not just the text-described style.
Present: `world-map-bg.webp` (the map's `#worldbg` layer), `bedroom-portal.webp`
+ `portal-tunnel.webp` (future backdrops, not yet wired), plus 4 `crop-*.jpg`
detail crops (lighthouse isle, dark-tower isles, glow flora, purple isle).

### Island sprites & cloud strips (`lessons/assets/world/islands/`)
Generated via the scripted `.claude/skills/gemini-art/SKILL.md` pipeline in
the same "Magical Portal to Fantasy World" chat as the world backdrop crops,
then cut out with `lessons/tools/art-post.py` (edge-flood-fill keying +
stray-component scrub, `--tolerance 20 --feather 1.5`). 4 lighthouse-island
variants (unlit/lit pairs, ~200-260KB each) rotate across the map's regular
nodes (`saga.js`'s `ISLAND_VARIANTS`): `island-lighthouse-*`, `island-spire-*`,
`island-pancake-*`, `island-rocklets-*`. `island-boss-mystery.webp` (no lit
variant — stays ominous) is the mystery/boss node's island. Two wide cloud
strips (`cloud-strip-1.png`/`cloud-strip-2.png`) are tiled parallax layers
(`#clouds1`/`#clouds2` in `saga.css`) between the worldbg and star layers.

### Animation / sprite sheets (PENDING — not decided)
Assets also need **animation** — idle float, glow pulse, sparkle, and state
frames. Candidate approaches (open design, pick later):
- **CSS/JS animation of the static PNGs** for idle/float/glow (cheapest;
  likely default for ambient motion).
- **Optional multi-frame Gemini generation** for genuine state changes.
- A **sprite-sheet convention** if we go the multi-frame route.
None chosen yet — treat as an open question.

## The idea (pedagogy — read this first)

A lesson is a **tiny, run-once pure-Python program**. The student edits it and
watches it run. The recurring lesson move: **the logic stays; the machine
changes.** Swapping which "machine" you call flips the whole I/O world — from a
plain terminal to an AR camera game — without touching the logic.

What ships today (as saga node pages, see the status list above):

- **Node 0 — "Old Computer: Anatomy of a Machine"** (`content/node00.js`):
  the interactive anatomy widget teaches INPUT → PROCESS → OUTPUT, then a
  single `say("Hello, wizard!")` cell teaches OUTPUT alone — no INPUT yet,
  so this node stays to one new concept (the three-part shape + `say()`).
- **Node 1 — "Old Computer: Words"** (`content/node01.js`): teaches
  `read()` (INPUT — `say()` is already known from Node 0) via the **ECHO
  machine** (`text = read(...)`, `say(text)`), then string concatenation
  with `+` (greet exercise), the variable concept (re-running greet with a
  different name), multi-line output, two syntax-error drills (unclosed
  quote / wrong variable name), and gluing 3+ pieces together.
- **Node 2 — "Old Computer: Numbers"** (`content/node02.js`): `read_num()`/
  `say_num()`, the four arithmetic operators, two more syntax-error drills
  (mismatched quotes+stray colon, bad indentation), then a boss fight
  (THE BUG WRAITH) reviewing the whole node — finisher round has the
  student read a number and `say_num()` its 1×–9× multiplication table.
- **Node 3 — "Input and Output"** (`content/node03.js`): **conditionals**
  on the camera — `finger = watch()`, then `if finger == 1: fire_vortex()`, add
  `elif finger == 3: lighten()`, then a fourth rule for `darken()`. Two
  fingers stay reserved for the photo booth's SNAP gesture, so it's never
  used as a rule trigger. Ends with accumulator variables
  (`damage = damage + 1`) and a boss fight (THE SYNTAX SERPENT).
- **Node 4 — "Choices: Else and Everything Else"** (`content/node04.js`):
  **`else`** (the one new syntax concept) — everything else is deliberate
  RECOMBINATION of prior nodes' vocabulary, not new teaching, and every
  exercise reads its numbers from real `watch()` camera reads (not typed
  `read_num()`), per the "logic stays, machine changes" idea. Two new
  `camera_charm` functions are given as gifts mid-node at near-zero engine
  cost (the FX/bridge plumbing already existed, just unused):
  `freeze()` (❄ FROST, twin of `fire_vortex()`) and `display(v)` (AR overlay
  text, vs. `say()`'s console-only output). Three combinatorial exercises:
  a fortune machine (`if/elif/else` picking `fire_vortex`/`lighten`/
  `darken`/`freeze` by finger count), a calculator with a given operator
  (two real `watch()` reads + arithmetic), and an operator-guessing chain
  (comparing a precomputed expression against `a+b`/`a-b` via `==`). Ends
  with a boss fight (THE PARADOX SPHINX) reviewing all of it, finisher
  round accumulates across 3 sequential real `watch()` reads and picks
  `fire_vortex()` vs `freeze()` by the total. See `lessons/NODE04-PLAN.md`
  for the full design rationale.
- **Node 5 — "Boundaries: More or Less"** (`content/node05.js`): the
  comparison family `> < >= <=` (the one new concept), taught through a
  Kotopia stone gate that only opens for "đủ mạnh". Mindset-first per
  `NODE-EXPANSION-PLAN.md`: predict-before-run quiz beats, the **boundary
  bug** (`>` where the sign says "3 TRỞ LÊN" — felt at exactly 3 before
  `>=` is introduced), a cursed-gate hospital drill ported from the
  reference course's `broken_discount_calculator` (evidence → smallest
  failing input → fix → re-verify at the mốc), an ordered `<=` elif ladder
  (power meter), and a boss (THE BOUNDARY GOLEM) whose code rounds are all
  boundary/direction/ladder-order bugs; finisher accumulates three
  `watch()` reads to exactly 12.
- **Node 6 — "Repeat: The While Loop"** (`content/node06.js`): **`while`**
  — pays node 3's promise that the student would write `photo_booth()`'s
  hidden loop. Motivated by felt pain (the golem fight's three copy-pasted
  accumulate lines → "what about 100?"), then: charge-up loop (`while
  suc_manh < 6:` + `watch()`, the machine stops itself), edit the stop
  condition to 12 (`expectOut /^1[2-6]$/` blocks passing it unedited),
  infinite-loop curse taught as a PREDICT quiz only (see safety rule),
  countdown `3,2,1,BUM!` predicted before running, cracked-countdown
  hospital, and the wait-for-high-five machine (`while finger < 5:`) that
  reveals the booth's secret. Boss: THE ENDLESS WYRM (trace rounds,
  never-runs `<0` bug, unindented body, finisher: charge to EXACTLY 12 or
  it freezes you). **Safety rule:** runnable student `while` loops either
  terminate deterministically or contain `watch()`/`read()` in the body
  (asks make a wedged run cancellable); the forgot-to-change-the-counter
  loop is never given as runnable code.
- The **odd/even machine-swap** program (change every `old_computer` →
  `future_machine`; `is_odd` never moves — the purest "machine changes"
  moment) is preserved in `lesson01_odd_even/lesson.py`, slated for
  **Node 7** (see `NODE-EXPANSION-PLAN.md` — `%`/parity, then `def`,
  params/`return`, and the studio capstone as nodes 8–10).

Design decisions (deliberate — don't "simplify" away):
- **Explicit machine names at the call site** (`old_computer_ask` vs
  `future_machine_ask`) — the machine is visible where it's used, not hidden in
  an import. The exercise is a find-replace. (Planned Lesson 2 reveal: "you
  changed the same word 4 times — what if you swap it once?" → introduce the
  import abstraction, motivated by the felt pain.)
- **Actions, not just prints:** `fire`/`freeze` (and `tell`) so a condition
  connects to a consequence.
- **`is_odd`/`is_even` live in `rules`** — the logic, unchanged across machines.

## How to run

Lessons need `SharedArrayBuffer` (blocking terminal input + finger read), which
requires **cross-origin isolation**. The stock `python -m http.server` will NOT
work — use the included server:

```bash
python serve.py                 # http://localhost:8123  (COOP/COEP headers)
# then open http://localhost:8123/lessons/lesson00.html  (or lesson01.html)
```

The original app has no such requirement; run it however (a plain
`python -m http.server 8090` is fine): `http://localhost:8090/index.html`.

## Architecture

**Layer map (CONTENT / PLATFORM / ENGINE):** see the "Layer map" section of
`engine/ARCHITECTURE.md` for the precise import rules and how content
actually loads at runtime; enforced by `node lessons/check-layers.mjs`.
Authors writing a new node should start at `lessons/AUTHORING.md` instead.

The student's Python runs in a **Web Worker** (Pyodide) so `ask()` can BLOCK
synchronously like a real shell. Blocking works over a `SharedArrayBuffer`:

```
page (main thread)                     worker (Pyodide)
  ── run(code) ────────────────────▶   runs student Python
                                        machine.ask()/tell() → self.bridge
  ◀── postMessage {req:'ask'|'tell'} ── bridge.ask(): Atomics.wait on the SAB
  do the I/O (terminal / camera),
  write reply to SAB, Atomics.notify ─▶ wakes, returns the value
```

Message `kind` routes the I/O and drives the terminal⇄game mode:
`keyboard`/`terminal` → terminal · `fingers`/`spell`/`label` → game scene.

### File / module map
| Path | Role |
|---|---|
| `serve.py` | Static server with COOP/COEP (enables SharedArrayBuffer). |
| `lessons/index.html` + `saga.js`/`saga.css` | Saga map home: 220vh scrollable world (`MAP-REDESIGN-PLAN.md` P1), `NODES` registry (title/art/page) + `ROUTE` world-position table, `localStorage` progress, lit trail. P2b: big island scenery + small rune pin as click affordance (no more machine medallion), current-only banner + tooltip chip elsewhere, Pip bobbing at the current pin. Add a node = add a `NODES` entry + a `ROUTE` position. |
| `lessons/entry.js`/`entry.css` | The map's one-gesture entry funnel, layered over the map on boot (see README's "Homepage entry funnel" + `KICKOFF-PLAN.md` §C). Reuses `stage-player.js`'s `mountGestureTitle`; hands off to `onboard.js`'s manual mount API on a first visit. |
| `lessons/lessonNN.html` | Node page: sets `window.NODE` (index, title, bundle, machine, modules, cells, ritual) + includes the node shell. |
| `lessons/node.js` / `node.css` | Node shell: splash → bundle reveal → notebook (NPC/widget/code cells, one shared worker) → ritual overlay + progress write. |
| `lessons/progress-versioning.js` | Pure in-node resume helpers (content-hash + resume/reset decision); `test-progress-versioning.mjs` covers it. |
| `lessons/engine/gesture-math.js` | Pure swipe/track detection math (`detectSwipe`, `trackDistance`) shared by `gesture-dispatcher.js`'s new verb gates; `test-gesture-math.mjs` covers it. |
| `lessons/onboard.js` | The Kotopia cold-open as a module (`Onboard.mount({force,onDone})`): cutscene → "CODE!" gate (✋ palm + voice chant) → blast + Pip reveal. Auto-mounts once per player on the map (`magicdust.onboard`); see `ONBOARD-PLAN.md`. |
| `lessons/onboard.html` | Dev harness for onboarding: always replayable (`force:true`, never writes the flag) + buttons (replay / to gate / five / chant) + a live transcript-matcher probe. |
| `lessons/engine/chant-match.js` | Pure word-level matcher: `matchChant`/`CHANT_WORD`/`CHANT_ACCEPT` for onboarding's "CODE!" chant (accept set + edit distance ≤1 + phonetic K…T/o-core tier from real captures), plus generalized `matchWord(transcript, target, accept)` for any node's `ritual.chant` (same tiers, but the loose edit-distance/phonetic tiers are skipped for targets ≤3 letters — see `SHORT_TARGET_LEN`). `test-chant-match.mjs` covers both. |
| `lessons/engine/voice-gate.js` | Reusable voice-chant listener: en-US SpeechRecognition (one live session per page), 7s session recycle, joined-utterance + n-best matching via chant-match, `onDown` downgrade on persistent errors. |
| `lessons/engine/gesture-ui.js` | `armStatusHandler` (swipe/track hint+gauge wiring, shared by quiz-cell/boss-fight) + `HoldChoiceGate` — pure "hold N fingers = pick option N" state machine for `ritual.choice` (KICKOFF-PLAN.md Part B), same shape as quiz-cell's `armHoldQuestion`; `test-ritual-choice.mjs` covers it with a fake clock. |
| `lessons/engine/mic-meter.js` | Live mic waveform on a canvas (own getUserMedia + AnalyserNode) — "is my voice reaching the machine, how loud?" feedback for voice gates. |
| `lessons/validate-content.mjs` | Dev-time content schema check for `lessons/content/node*.js` — see "Content validator" below. |
| `lessons/engine/gesture-registry.js` + `test-gesture-registry.mjs` | Declarative ARM→CAPTURE gesture-verb registry (verb → pure capture factory; single source of the allowed `gesture:` verb list for `armVerbGate`, boss-round dispatch and the content validator — a new verb is one `registerVerb` entry, not a new dispatcher method); the test proves a verb registered at test time works end-to-end through `armVerbGate`/`TwoPhaseGate` and that unknown verbs throw. Run: `node lessons/test-gesture-registry.mjs`. |
| `lessons/test-dispatcher.mjs` | Pins `GestureDispatcher.onHands`'s priority ladder (ritual > actGate/motionGate > frozen > booth pour > hud > fingerGate) with synthetic 21-point hand frames (no DOM/camera), plus an end-to-end arm→capture→swipe run through a real `TwoPhaseGate`, and a replay test loading `lessons/traces/synthetic-swipe-right.json`. Record a real trace from the running app's console with `nodeDev.recordHands(seconds)` (dev-only, gated the same as the rest of `window.nodeDev` — see `lessons/engine/cheat-panel.js`); it downloads a `{t, lm}` JSON file — drop it in `lessons/traces/` and feed it through the same replay path to tune `SWIPE_MIN_DIST`/`TRACK_CATCH_RADIUS` against real data. |
| `lessons/lesson.css` / `lesson.js` | **Legacy** IDE-style shell (editor left / stage right). No page uses it anymore; kept for reference until the engine/ P0 refactor. |
| `lessons/worker.js` | Pyodide worker; installs modules; `bridge.ask/tell` over the SAB. Unchanged — Python globals persist across cell runs (notebook semantics). |
| `lessons/lessonNN_*/lesson.py` | **Legacy** student programs (node pages embed cell code in `window.NODE`). The odd/even machine-swap program is preserved for a future node. |
| `py/rules/__init__.py` | `is_odd` / `is_even` — the logic. |
| `py/machines/__init__.py` | `old_computer_*` / `future_machine_*`: `ask` / `tell` / `fire` / `freeze`. |
| `py/old_computer/__init__.py` | Node 0's ECHO machine: `read` (string, no int cast) / `say`. |
| `py/camera_charm/__init__.py` | Node 1's charm: `watch` (steady finger count) / `fire_vortex` (vortex + FIRE) / `freeze` (vortex + FROST, unused until node04) / `lighten` / `darken` (screen wash) / `display` (AR overlay text, unused until node04) / `photo_booth` (the ✋☝✌ loop, abstracted inside the module). 2 fingers reserved for ✌ snap. |
| `py/test_modules.py` | `python py/test_modules.py` — assert-based tests for all 4 `py/` modules above. `rules` is tested directly (pure Python); `old_computer`/`camera_charm`/`machines` all do `from js import bridge` (Pyodide-only), so a fake `js.bridge` recording every `tell`/`ask` call is installed into `sys.modules` before each import. |
| `lessons/spell-vfx.js` | The REAL cast engine: verbatim WebGL port of the root mote system + UnrealBloomPass, panel-sized ES module; `mount(host).cast(color, bloom)`. |
| `lessons/ritual-vortex.js` | Canvas-2D replica of the whirlpool math — story beats (act gates, gift, booth pour, ritual, onboarding) + cast fallback. |
| `engine/` | The extractable JS engine + `config.js` + `ARCHITECTURE.md` (P0, in progress). |

### `window.NODE` config (per node page)
`{ index, title, subtitle, bundle:{art,name}, machine:{art,name,blurb},
   modules:{name:path}, cells:[…], ritual:{gesture,prompt,chant,chantAccept,theme} }`
- `index` — 0-based saga node; sealing writes `max(progress, index+1)`.
- `modules` — name→path; the worker installs each as an importable module.
- `cells` — in order; kinds: `{npc:"…"}` speech bubble · `{widget:'anatomy'}`
  named interactive widget · `{code, label, note}` runnable cell ·
  `{checkpoint:{text, sign?}}` a small celebratory ✋ HIGH-FIVE stamp cell
  dropped after a practice arc (worked example → student exercise), Pip
  recaps the takeaway (`text`), armActHoldGate hold-gate (default sign 5) or
  a plain tap on the button completes it — sparks + a brief flash, then the
  notebook reveals onward (`lessons/engine/checkpoint-cell.js`). Reveal stops
  at each interactive cell until it completes (code = one successful run).
- `ritual.chant` (optional string) — the node's taught word; when present the
  ritual invites yelling it (concept-chant, RITUAL-VARIANTS-PLAN.md Part B).
  **Bonus-only, never a gate** (2026-07-04 live test: SR missed a real
  kid-yelled "say"): the correct sign alone always charges to 100% at normal
  speed; a `chant-match.js#matchWord` hit on a live transcript while charge
  ≥30% (`RITUAL_CHANT_ARM_MIN`) surges instantly to 100% — same surge feel
  as onboarding's "CODE!" gate, minus the hard requirement.
  `ritual.forceChant(text?)` (dev hook, cheat-panel "🗣 chant") injects a
  fake transcript through the real matcher.
- `ritual.chantAccept` (optional string array) — hand-tuned likely vi-VN/en-US
  mishearings of `chant`, same discipline as `chant-match.js`'s
  `CHANT_ACCEPT`; required whenever `chant` is a short (≤3-letter) target,
  since `matchWord`'s loose edit-distance/phonetic tiers are deliberately
  disabled for short targets (too collision-prone with real words) —
  see `engine/chant-match.js`.
- `ritual.choice` (optional `{q, a:[2-5 strings], correct}`, KICKOFF-PLAN.md
  Part B) — a pre-seal knowledge check. When present, opening the ritual
  runs a CHOICE PHASE first: the question + option buttons render inside
  the ritual overlay (`.rchoice`, reusing quiz-cell's `.qopt`/`.qn`/`.qfill`
  styling); hold up N fingers for option N (same hold-charge shape as
  quiz-cell's `armHoldQuestion`, extracted pure as `HoldChoiceGate` in
  `engine/gesture-ui.js`) or tap. A wrong pick shakes + shows a brief
  encouragement line and stays live for a retry — never a dead end; the
  correct pick sparks and transitions into the unchanged SEAL PHASE
  (sign-hold + vortex, chant still a bonus surge if it lands). Runs INSIDE
  the ritual's own frame handler (`gestureDispatcher.setRitual`), never
  `armActGate`/`armMotionGate` — those are mutually exclusive/throw on
  double-arm, and the ritual already owns the hand for its whole
  open()→seal() lifetime. No camera → tap still resolves it (built
  immediately on `open()`, not gated behind the camera promise). Omit
  `choice` and a node's ritual behaves exactly as before (straight to the
  seal). `choice.a`'s wrong options MAY be real programming words the kids
  meet later (e.g. `print` vs the taught `say`) — a recognition check, so
  it's exempt from the made-up-distractor rule used in track quizzes (see
  `validate-content.mjs#validateRitualChoice`). `ritual.forceChoice(i?)`
  (dev hook, defaults to the correct option) resolves the choice phase
  instantly; no Space-bypass/cheat registry existed yet when this was
  written, so it's wired as a plain `window.nodeDev.choice(i)` console hook
  like `chant`, not a bulk-skip key.
- (`window.LESSON`/`gameTrigger` belong to the legacy `lesson.js` shell.)

### Ritual theme system (`ritual.theme`, RITUAL-VARIANTS-PLAN.md §A)

Every node can carry an optional `theme` on its `ritual` config, consumed by
`ritual-vortex.js` via the pure resolver `engine/ritual-theme.js`
(`resolveTheme`/`themeIssues`, tested by `test-ritual-theme.mjs`). Absent
`theme` resolves to `DEFAULT_THEME` — pixel-identical to the pre-theme-system
look (hard backward-compat requirement); every key is optional and content
may pass either a preset name (a `RITUAL_THEMES` key) or a partial object
(which may itself set `motion` to seed from a preset before its own keys win):

| Key | Shape | Meaning | Default |
|---|---|---|---|
| `palette` | `{core,dust,rune}` (hex strings) | `core` overrides the spell color normally read from the host's `--c` CSS var; `dust` tints the drifting glyph motes, `rune` tints the magic-circle strokes/runes | `null` (derive from `--c`) |
| `circle.rings` | number | secondary ring count on the magic circle (main outer ring is always drawn) | `3` (today's exact rings) |
| `circle.poly` | `'triangle'\|'square'\|'penta'\|'none'` | the circle's central polygon — `'triangle'` draws today's rigid two-triangle hexagram, the others draw one n-gon, `'none'` skips it | `'triangle'` |
| `circle.spin` | number | scales the whole plate's rotation speed (rune bands + polygon) | `1` |
| `glyphs` | string | the node's taught word, spelled out as the runes/medallions ON the circle (pedagogy: the circle IS the word); empty/absent keeps today's random-rune look | `''` |
| `glow` | number | brightness scalar — multiplies shadow blur + mote alpha | `1` |
| `scale` | number | multiplies circle radius, mote size, and ambient dust spread | `1` |
| `motion` | `'orbit'\|'spiral-in'\|'rain'\|'pulse'\|'comet'` | how the idle ambient dust moves before the charge takes over (orbit = today's default; every motion still converges on the same back-eased vortex collapse once charge passes `VORTEX_AT`, so the seal moment always reads the same) | `'orbit'` |

Per-node assignment shipped: node00 `orbit` cyan (`say`) · node01 `comet`
cyan/green (`say`) · node02 `pulse` gold (`read`) · node03 `spiral-in`
violet (`if`) · node04 `rain` orange (`else`) · node05 `comet` cyan/pink
two-tone (`==`) · node06 `rain` green (`while`). The validator
(`validate-content.mjs`) flags unknown theme keys, preset names, motion
names, or `circle.poly` names as ERRORs.

## Kick-off stage (teacher-only presentation)

`lessons/kickoff.html` is a spectacular, teacher-driven intro sequence for
the first class — NOT reachable by students (same stance as `dev-test.html`:
no link from the saga map; it's a URL the teacher types directly).

**v2 (2026-07-04, current default) — one gesture, zero keyboard.** Owner
feedback on v1's multi-scene deck: "vui đấy nhưng nhìn chưa ok, chưa khoe
được phần gesture của mình, không đủ ít thao tác — chỉ cần 1 dòng 'Kotopia
chờ bạn', xong ritual phát là được, tự động luôn không cần gì hết." The
default `STAGE` in `kickoff.js` is now: a single `gesture-title` scene → the
act1 clip (`autoNext:true`) → `go`. On load, the camera pipeline arms
itself immediately (no click/tap/keypress needed — `getUserMedia` only
needs *permission*, not a user gesture, so on an already-granted origin
tracking goes live silently). The instant a hand enters frame it gets the
upgraded fingertip FX (mini spinning magic circles + drifting rune-glyph
trails per fingertip, `engine/gesture-ui.js`'s `FingertipFxPainter` —
this IS the "show off our gesture tech" beat, no instruction needed).
Fingertip fx is armed automatically by every camera gate — `armActHoldGate`/
`armTimedCatchGate`/`armVerbGate` in `gesture-dispatcher.js` each arm and
disarm it internally (opt out per-call via `{noFingertipFx:true}`); nobody
wires it per cell anymore (see `test-fingertip-fx-wiring.mjs`).
Holding an open palm (5 fingers) charges the vortex over `RITUAL_SEC`
(2.2s) with `RITUAL_DECAY` soft-decay on drop (same feel as
`ritual-controller.js`'s charge step, copied not imported — that class owns
a DOM ritual overlay this page doesn't have); full charge → white flash +
`burst()` → auto-advance to the clip → auto-advance to the map. A hint
line ("giơ ✋ lên nào") only fades in once tracking is confirmed live AND no
hand has been seen for ~7s (never nags a simply-idle backdrop). No
`AudioContext` anywhere on this scene — it may never see a user gesture at
all, so sound is skipped entirely rather than risk an autoplay rejection
with no error UI to catch it. If the camera is denied/unsupported, the page
just stays a beautiful ambient breathing title — the same →/Space/Esc
keyboard fallback below still silently works.

The v1 multi-scene deck (title card → live `embed` of the root VFX app →
portal-dive `video` → map) is still reachable at `kickoff.html?deck=full`
— decks are data, which is exactly the reusability the player was built
for.

**Powered by `engine/stage-player.js`** — a reusable, dependency-light scene
player (ENGINE layer: only imports other engine/*.js files, no
`node.js`/notebook coupling). A presentation is just a `STAGE` array of
pure data:
```js
STAGE = [
  { kind:'gesture-title', title:'Kotopia đang chờ cậu', hint:'giơ ✋ lên nào', theme:'pulse', next:'auto' },
  { kind:'title', title:'MAGIC DUST', subtitle:'…' },
  { kind:'embed', src:'/index.html' },                 // fullscreen iframe, allow="camera; microphone"
  { kind:'video', src:'./assets/cutscenes/foo.mp4', capMs:11500, autoNext:true },  // tap-to-skip + hard cap; autoNext (opt-in) fires advance() instead of freezing
  { kind:'go', href:'index.html' },
];
```
`stage-player.js`'s scene-advance state machine (index clamp, Esc-jumps-to-
final-`go`, no-op at either edge) is factored into pure functions
(`nextIndex`/`prevIndex`/`lastGoIndex`/`clampIndex`/`isAutoNext`) driving a
plain `StagePlayer` class with no DOM — tested headlessly by
`lessons/test-stage-player.mjs`. `mount(stage, host, opts)` wraps that in
the DOM: → / Space / tap-right-half advances, ← / tap-left-half goes back,
Esc jumps straight to the last `go` scene; a scene-dots indicator tracks
position; embed scenes are torn down (iframe `src` blanked) on exit so the
camera LED goes off; the title scene reuses `ritual-vortex.js`'s
`RitualVortex.mount()` as its particle/magic-circle backdrop (no new
particle code). A `ritual` scene kind (`{kind:'ritual', theme:'pulse'}`, a
preset name or object per `engine/ritual-theme.js`) is the live showcase:
`RitualVortex` fullscreen, its charge driven by a slow sine so the circle
breathes forever, with ↑/↓ cycling live through the 5 motion presets
(`orbit`/`spiral-in`/`rain`/`pulse`/`comet`) while a corner label names the
current one and fades after a second — built for an owner standing in
front of the class flipping variants while talking.

**Scenes park by default, video/gesture-title can opt into autoNext**: a
`video` scene reaching `ended`/error/its hard `capMs` cap freezes on a
dimmed last frame with a pulsing → hint UNLESS `autoNext:true`, in which
case it calls `advance()` instead (v2's kickoff flow); a `gesture-title`
scene always auto-advances on full charge (`next:'auto'` is really just
documentation — the scene has no other way to complete). Everything else
(title/ritual/embed) still never auto-advances; the mouse cursor hides
itself after ~2.5s idle and reappears on the next move.

**iframe-focus gotcha (fixed):** once the teacher clicks INTO the `embed`
scene's iframe (a separate document — the root VFX app), clicks/keydowns
no longer bubble to the parent page, so the normal tap-to-advance/→/Esc
stop working. `mount()` therefore renders three tiny always-on-top nav
elements (thin edge strips + a corner ⏭) as permanent siblings of the
scene container (never wiped by scene teardown, always the topmost
element at that pixel even with an iframe filling the background) — these
are the one control surface guaranteed to work no matter which document
currently has focus. Verified in a real browser: clicking inside the
embedded root app, then clicking the corner ⏭, still jumps straight to the
saga map.

**To add a new teacher demo**: write a new `STAGE` array (see
`lessons/kickoff.js`) and call `StagePlayer.mount(STAGE, host, opts)` from a
new tiny HTML+JS pair — the player itself needs no changes.

## Adding a node
1. `py/…` module(s) if new machines/rules are needed.
2. `lessons/lessonNN.html` — copy an existing node page, edit `window.NODE`
   (cells embed the student code as strings).
3. Add the map entry in `saga.js` `NODES`.
No shell changes needed.

Content authoring rule: learner-visible code uses English ASCII variable names
(`score`, `count`, `total`, `digit`, `result`, etc.) while Vietnamese prose
explains what they mean. Every definition, quiz, and `{code}` task should stand
alone with a clear INPUT / PROCESS / OUTPUT contract: which values are
given/preset, which values are real input read from outside the program, what
the learner must write/do, and what exact output proves success.
For number tasks, `%` and `//` are acceptable when the prompt explains what the
number represents and what the operation does. Do not label starter assignments
as INPUT; call them given/preset values unless the value is read from the
learner, camera, or another real input source.

## Thợ Rèn & Bom Mật Ngữ (reward economy — additive only)

Design doc: `lessons/FORGE-PLAN.md`. The loop: lesson badges → forge into a
BOM MẬT NGỮ → deploy in a boss fight for a big "bùm chéo" strike. **Hard
rule: additive, never a gate** — with no badges/bombs earned, every boss and
every node plays exactly as it did before this system existed.

**BOSS CONCEPT V2 (node02 shipped `38a2455`, `FORGE-PLAN.md` "FINALIZED"):**
the boss can instead be a PURE GESTURE ritual with NO quiz/code rounds, and
the quiz moves INTO the forge. A `{boss:{name,art|sheet|glyph,ko:true}}` boss
(no `rounds`) gates on `inventory.bombCount()>0` — no bomb shows a "về THỢ
RÈN" prompt (never a true dead end, forging is guaranteed) — then hold ☝ to
AIM → ✋ to UNLEASH the forged bomb → 1-hit KO → phong ấn seal (see
`boss-fight.js#armGateKo/#detonate`). Its forge uses `{forge:{quiz:[{q,a,
correct}]}}`: answering the migrated boss questions IS the forge trial and
forges the bomb (`inventory.addBomb`, no badge cost, wrong just retries).
The forge quiz is answered GESTURE-FIRST like every other quiz: hold 1/2/3…
fingers to charge option N (shared `HoldChoiceGate` + the `.qopt` charge
fill/fingertip fx; tap stays the fallback), each correct answer visibly
stokes the forge fire (`--heat` 0→1: the flame behind the anvil grows, the
anvil's glow builds), and the final ✋ anvil hold drives live strike fx
(`--strikep` swell/shake — winding up the hammer blow). The
legacy `{boss:{…,rounds:[…]}}` round-HP path is fully preserved for nodes
03-07 until they're batch-migrated. The separate `ritual:` seal cell still
runs after a `ko` boss for now (a later pass folds it into the KO beat).

- **`lessons/engine/inventory.js`** — the badge/bomb store, a small class
  (`Inventory`) wrapped around an injectable `{getItem,setItem}` shim (so
  it's unit-testable without real `localStorage` — see `test-inventory.mjs`)
  plus a ready-to-use `inventory` singleton over real `localStorage`
  (`magicdust.badges` = array of `{id,spent}`, `magicdust.bombs` = int).
  API: `addBadge(id)` (idempotent), `hasBadge(id)`, `badgeCount({unspentOnly})`,
  `forgeBomb(cost=2, {rand,bonus})` (gacha roll, see below),
  `bombCount()`, `spendBomb()` (floors at 0).
- **Badge gifts** — `{gift:{...,badge:true,badgeId}}` cells call
  `inventory.addBadge(badgeId)` on claim (`gift-cell.js`); non-badge gifts
  are unaffected. **Claim gesture (2026-07-05, owner redesign):** a badge
  gift is claimed by holding the 🤙 **shaka** sign (thumb + pinky out, the
  middle three fingers curled) steady for `GESTURE_HOLD_MS` (constants.js,
  700ms) — `gesture-dispatcher.js#armShakaHoldGate`, which reads
  `camera-engine.js#isShaka(lm)` (composed from the same `extFinger`/
  `thumbUp` primitives `countFingers` already uses — see
  `test-camera-engine.mjs` for the fixtures). A tap/`registerBypass`
  fallback always still claims it (camera-noise no-dead-end, same
  discipline as every other gate). **Visual (owner: "huy hiệu bị cùi bắp vì
  dùng emoji"):** a badge's face is a forged CREST medallion, not an emoji
  glyph — `gift-cell.js#crestFace` draws a cyan/violet rune ring with a
  metallic conic-gradient rim, glow, and the badge's initial, injected via a
  one-time `<style id="badgecss">` tag (gift-cell.js doesn't touch
  `node.css`). Non-badge gifts are pixel-identical to before (same
  ring-catch high-five, same glyph/art face).
- **Forge cell** — `{forge:{cost?,practice?}}` (`lessons/engine/
  forge-cell.js`, dispatched by `notebook-runner.js`): an anvil/blacksmith
  screen, ✋-hold-to-strike (`armActHoldGate`) or tap. States up front
  ("Dùng N HUY HIỆU đã thu thập để rèn 1 BOM MẬT NGỮ — mang bom đó vào trận
  đấu BOSS phía sau!") plus a live `huy hiệu đang có: X / N cần · bom mật
  ngữ đã rèn: Y` readout, so the badge→bomb link is visible on screen, not
  just mechanically true. Forging is a GACHA roll, not guaranteed: `forgeBomb`
  rolls against `FORGE_SUCCESS_BASE`
  (constants.js, 0.55). A FAIL ("rèn hụt") never spends badges — Pip cracks
  a playful joke and ONE practice question from `forge.practice` appears; a
  wrong answer just retries, a correct one adds
  `FORGE_SUCCESS_BONUS_PER_PRACTICE` (0.20) to the next attempt's odds,
  cumulative, capped at `FORGE_SUCCESS_CAP` (1.0) — a persistent kid is
  GUARANTEED to forge within ~2-3 practices. A "bỏ qua" skip button always
  completes the cell, forged or not.
- **Boss bomb deploy** — once `inventory.bombCount() > 0`, the boss arena
  (`boss-fight.js`) shows a "💣 BOM MẬT NGỮ ×N" control automatically (no
  content changes needed per-node). Deploy spends one bomb → `FORGE_BOMB_
  DAMAGE` (constants.js, 150) flat HP off the boss + a diagonal "bùm chéo"
  sweep/shake FX, debounced to one deploy per round. **Zero bombs** → the
  control stays hidden and a small `.bnobomb` hint takes its place ("⚒ chưa
  có BOM — quay lại THỢ RÈN để rèn từ huy hiệu đã thu thập!") so the
  forge→boss link is legible even when there's nothing to deploy yet — the
  fight itself is otherwise identical to before this feature.
- **Dev hooks**: cheat panel (`#cheat`/typing "pip") has "🔨 grant badges"
  and "💣 grant + deploy bomb"; console: `nodeDev.grantBadge(id)`,
  `nodeDev.grantBadges(n)`, `nodeDev.grantBombs(n)`, `nodeDev.deployBomb()`,
  and `window.inventory` for direct access.

## Content validator

`node lessons/validate-content.mjs` — a dev-time Node script (not shipped
to the browser runtime, like the `test-*.mjs` files above) that loads every
`lessons/content/node*.js` and checks each cell against the real shapes the
engine reads (derived from `notebook-runner.js`, `quiz-cell.js`,
`boss-fight.js`, `gift-cell.js`, `cameo-cell.js`, `code-cells.js`,
`cell-validation.js` — not invented from field names alone). ERRORs exit
the process non-zero; WARNs print but don't fail the run. Catches: an
unknown cell type (falls through to a silent broken ritual-cell placeholder
at runtime otherwise), a quiz/boss question missing `q`/`a`/`correct` or
`correct` out of range, too many answer options for finger-count picking, an
unknown `gesture:` verb, a `gesture:'swipe'` boss round without exactly 2
options, a malformed `expectOut` shape, an unknown `ritual.theme` key/preset
name/motion/`circle.poly` name (see the ritual theme table above), and (as a
warning) a `{code:...}` cell with no `expectOut` or an empty `npc`/`remember` cell. The schema table
lives at the top of the file — extend it there when a new cell type or
gesture verb ships. Pass a path/glob as the first arg to point it at a
different file (used for ad-hoc testing); with no args it scans the real
`lessons/content/` directory.

## Content editor

`lessons/editor.html` (+ `editor.js`/`editor.css`/`editor-serializer.mjs`) —
a TEACHER-ONLY workbench for hand-editing `lessons/content/node*.js` without
asking an AI to touch the JS ("JSON này khó sửa quá"). Same stance as
`dev-test.html`/`kickoff.html`: not linked from the game, only reachable by
typing the URL. Node picker → loads a node, edit the header/ritual and every
cell type (npc/code/quiz/checkpoint/remember/gift/widget/cameo/boss) in
per-type forms, including a structured `expectOut` editor (none/text-contains
/regex/minLines/heldCount-map/all-of) and boss rounds (question or code, with
`dmg`/`finisher`). Reorder/duplicate/delete/insert cells; a 👁 Preview button
per cell opens `dev-test.html?src=…&only=…` in a new tab.

**Save flow:** `editor-serializer.mjs` turns the edited object back into
`export default {...};` source (RegExp → literal, multi-line strings →
template literals, unquoted identifier keys, 2-space indent) and POSTs it to
`serve.py`'s `POST /api/save-node`, which writes the file atomically, makes
a `<file>.bak` first, and runs `validate-content.mjs` — the result (incl.
warnings/errors) is shown inline in the editor. If the endpoint is missing
(plain `python -m http.server`), Save falls back to downloading the file.

⚠ **Comment loss:** the serializer is a data round-tripper, not a
source-preserving formatter — every comment in a `node*.js` file is lost on
save (only the data survives). Git keeps history; **commit before a big
hand-edit session**. `lessons/test-editor-serializer.mjs` proves the
load→serialize→reload round-trip is data-lossless (RegExp source/flags
included) across all 8 real node files + TEMPLATE.js.

Known v1 gaps: the expectOut editor doesn't support arbitrary nesting (e.g.
a `heldCount` map nested inside `all-of`) — such cells render read-only with
a raw JSON preview instead of form fields, and are left untouched unless you
switch their type away (which does discard the old shape); `ritual.theme`
and `modules` are raw-JSON textareas, not structured forms.

## Gotchas
- **Must serve via `serve.py`** or the page shows a "needs SharedArrayBuffer" wall.
- **Partial swap:** mixing `old_computer_` and `future_machine_` → `NameError`.
  The cell output shows `✖ …` + a "make them all the same machine" hint.
  (This is the usual "changing it did nothing" report.)
- **Pyodide / Monaco / MediaPipe load from CDNs** under COEP `credentialless`.
  Verified working (MediaPipe hand-tracking loads). If a browser blocks them,
  vendor them locally. **SRI is not yet pinned** on the CDN `<script>` tags —
  do that before hosting.
- Camera prompts on the first `future_machine_ask`; falls back to a typed box if
  denied. Finger read = hold a count steady ~0.85s (a commit gate).

## Tower-climb mode — THÁP VÔ ĐỊNH (`TOWER-CLIMB-PLAN.md`)

An optional, additive side mode: climb the Dark Lord's tower floor by floor,
30 floors total, 3 lives, score = floor reached. **Not part of the main saga
trail** — reached via its own map pin (`saga.js`'s `SIDE_ISLANDS`, id
`tower`, unlocked after node 4 like the other side islands) and never writes
the main `magicdust.saga` counter.

- `lessons/tower.html` + `lessons/tower.js` — composition root, a fork of
  `island.js` (same splash → bundle → notebook acts, every `engine/*.js`
  module reused unmodified). Adds a floor/lives/score HUD and a results
  screen (retry / back-to-map) on top, without editing `notebook-runner.js`:
  it polls `notebookRunner.seq` for floor cells (each floor cell in
  `content/tower.js` carries an extra `floorNum` property notebook-runner.js
  ignores) flipping `done`, and watches `#book` for injected `.t-fail`/
  `.t-err` output lines to detect a failed attempt.
- `lessons/content/tower.js` — the 30 floors. Floors 1–3 (warmup, `if`/`==`),
  4/6–9 (`while` arithmetic), 11–14 (string tools: indexing, `len()`,
  `.isupper()`/`.islower()`, `in`, `%` parity), 16–19 (capstone string/number
  floors, `ord()`), 21–24 (quét danh sách), 26–29 (Euclid, số nguyên tố,
  kiểm tra thứ tự, tìm kiếm nhị phân). Floors **5/10/15/20/25/30 are gesture-KO bosses**
  (`boss:{ko:true}`, reusing `boss-fight.js`'s aim-☝/unleash-✋ 1-hit-KO
  mode exactly as node02v2+ does) — a `{forge:{quiz:[...]}}` review quiz
  right before each boss forges the BOM MẬT NGỮ, same pattern as the main
  path's BOSS CONCEPT V2 nodes.
- `lessons/tower-state.js` — pure `TowerState` (lives/floor/score, no DOM),
  persisted to `localStorage` (`magicdust.tower.progress`) versioned by
  `progress-versioning.js`'s `contentVersion()` — editing the floor list
  resets an in-progress climb rather than resuming stale. Tested by
  `lessons/test-tower-state.mjs` (`node lessons/test-tower-state.mjs`).
- Every floor's `expectOut` was verified against a real `python3` run of the
  reference solution (see `TOWER-CLIMB-PLAN.md`'s status table), not left as
  a drafted guess from `TOWER-FLOOR-CANDIDATES.md`.
- Floor problem shapes are freshly-written Vietnamese prose modeled after
  (not translated from) LeetCode Easy problems — credits line: *"Một số thử
  thách phỏng theo các bài toán lập trình phổ biến (LeetCode Easy), viết lại
  hoàn toàn bằng tiếng Việt."* (see `TOWER-FLOOR-CANDIDATES.md`'s
  provenance note).
- Dev-hook escape path (no camera required, per this project's
  no-dead-end convention): `nodeDev.toBoss(n=1)` jumps to the nth boss floor
  (1-6 → floors 5/10/15/20/25/30), `nodeDev.grantBombs(n)` seeds the forge without
  replaying the quiz, and `nodeDev.bossHp(v)`/`winBoss()`/`koDetonate()`
  resolve the fight headlessly (same hooks `node.js` exposes for node02's
  boss — `boss-fight.js`'s `_dev` is the single shared mechanism, not a
  tower-specific fork).
- **Unverified in-browser** (no headless camera/gesture harness exists for
  this repo): the gesture-KO boss floors, the HUD/results-screen wiring
  against the live Pyodide worker, and the saga map pin. A human must open
  `tower.html` via `serve.py` to confirm these — see that doc's status table
  for the exact manual QA steps.

## Pending / next work
- **Polish (Phase 6)**: transitions, sound, sprite animation if desired; decide
  the **animation / sprite-sheet** approach (still open). ~~Upgrade the
  ritual's CSS rings to a real particle vortex~~ ✅ done — `ritual-vortex.js`
  (particle whirlpool + magic circle, see above).
- Wire the **real particle engine** (root `src/`) into the cells' `fire`/
  `freeze`/scene, replacing the CSS-vortex stand-in (the `engine/` P0 refactor).
- **Nodes 7–10**: designed in `NODE-EXPANSION-PLAN.md` (mined from the
  reference course at `D:/introduction-to-computer-science`) — Node 7 `%` /
  odd-even + the preserved **machine-swap** lesson and the
  **import-abstraction reveal**; Node 8 `def`; Node 9 params/`return`;
  Node 10 studio capstone vs the Dark Lord at the time-space portal.
- GitLab: pushed — `https://gitlab.zingplay.com/nhutnm3/magic-dust` (private),
  `master` tracks `origin/master`. Deployed publicly at
  `https://nmnhut.dev/magic-dust/` (see the deploy recipe in the project
  memory / `D:/nmnhut-dev` repo — the copy there is a snapshot; re-copy +
  `npm run deploy` after new commits).
