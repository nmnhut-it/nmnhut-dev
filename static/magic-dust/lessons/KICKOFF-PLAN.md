# Kick-off stage + ritual word-choice — design plan

From the 2026-07-04 conversation, two asks, both built for REUSE:

## A. Kick-off stage page (`lessons/kickoff.html`) — "sân khấu giới thiệu"

A spectacular teacher-driven presentation page for introducing the game to
kids. It is a SEQUENCE OF SCENES the teacher advances live (→ / Space /
tap); the page is the backdrop while the teacher performs (e.g. the
open-palm dust summon from the ORIGINAL root app) and then "falls into"
Kotopia.

**Systematic core — a tiny scene-player module** (`lessons/engine/
stage-player.js` or kickoff-local if truly one-off is cheaper — prefer the
engine module: the same player can later run other assemblies/demos):

```js
STAGE = [                       // pure data — a presentation is CONTENT
  { kind:'title', ... },        // hero title card, starfield + magic circle
  { kind:'embed', src:'/index.html' },        // live iframe — the ROOT VFX app (múa triệu hồi bụi)
  { kind:'video', src:'assets/cutscenes/act1-oneshot.mp4' }, // the portal dive
  { kind:'go',    href:'index.html' },        // land on the saga map (Kotopia)
]
```

- Scene kinds: `title` (big text + subtitle + ambient dust canvas — reuse
  `ritual-vortex.js` or `spell-vfx.js` for the backdrop, don't write new
  particles), `embed` (fullscreen iframe — the root app already does
  camera+summon standalone; serve.py serves the repo root so `/index.html`
  works), `video` (fullscreen, tap-to-skip, hard-cap like onboarding —
  never wait on `ended` alone), `go` (navigate).
- Teacher controls: → / Space = next scene, ← = back, Esc = jump to last
  ('go'). Big invisible hotzones for touch. A tiny scene-dots indicator.
- Aesthetic: same design language (navy #0a0f1b, cyan/violet glow, dense);
  title card must feel "hoành tráng" — big glow type, slow magic circle,
  drifting dust.
- NOT reachable by students (same stance as dev-test.html: no link from
  the map; it's the teacher's URL).

## B. Ritual word-choice (thay chant bằng thủ ấn chọn)

Live test showed SR can't reliably catch a kid-yelled word → chant is
already demoted to bonus-only. The knowledge check moves to a GESTURE
CHOICE: before the seal-hold, the ritual asks the node's key question with
2-3 word options; the student picks by finger count (reusing the quiz
convention: N fingers = option N — already muscle memory from quiz cells).

```js
ritual: { sign:'✋', choice: { q:'Câu thần chú để máy NÓI là gì?',
  a:['say','print'], correct:0 }, chant:'say', theme:{...} }
```

- Flow: ritual opens → CHOICE PHASE (options rendered like quiz buttons,
  hold N fingers or tap; wrong pick = shake + retry, never a dead end) →
  correct → SEAL PHASE (existing sign-hold + vortex, chant still a bonus
  surge if it lands).
- REUSE, do not fork: the option-hold charge loop already exists in
  quiz-cell's `armHoldQuestion` — extract/share rather than duplicate
  (same discipline as gesture-ui's armStatusHandler).
- `choice` optional — nodes without it keep today's straight seal.
- Validator: `choice.q` non-empty, 2–5 options, `correct` in range.
- Content note: distractors here MAY be real programming words the kids
  will meet later (e.g. `print` vs `say` — the user's own example) — this
  is a recognition check, exempt from the made-up-distractor rule used in
  track quizzes; note that exemption in the validator comment/docs.
- node00 pilot: q về say vs print. Rollout to other nodes after the pilot
  feels right (per-node q derives from each node's taught word).

## Execution status

| Item | Status |
|---|---|
| A kickoff stage page + scene player | v2 2026-07-04 — see "A v2" below. Base player: `engine/stage-player.js` (ENGINE, pure state machine + DOM mount) + `kickoff.html`/`kickoff.css`/`kickoff.js`; tested by `test-stage-player.mjs` (13/13); title card reuses `ritual-vortex.js`'s `RitualVortex.mount()`; `ritual` showcase scene (↑/↓ cycles the 5 motion presets live) |
| B ritual word-choice + node00 pilot | DONE 2026-07-04 — `ritual.choice` config, choice phase in `ritual-controller.js` (runs inside the ritual's own frame handler, never armActGate/armMotionGate), pure `HoldChoiceGate` in `gesture-ui.js` (`test-ritual-choice.mjs`), validator, node00 pilot (say vs print), README config reference. `ritual.forceChoice(i?)` dev hook added as a plain `nodeDev.choice(i)` console hook — Space-bypass registry landed concurrently; wiring choice into it = follow-up. |

## A v2 — one-gesture auto flow (2026-07-04, owner feedback on v1)

Owner verdict on the v1 multi-scene deck (shipped an hour earlier): "vui đấy
nhưng nhìn chưa ok, chưa khoe được phần gesture của mình, không đủ ít thao
tác — chỉ cần 1 dòng 'Kotopia chờ bạn', xong ritual phát là được, tự động
luôn không cần gì hết." Then sharpened further: the ritual must be
completely hidden and automatic — camera arms itself at page load (zero
click/tap/keypress, not even a first one), and there is no visible "start"
affordance of any kind.

- New default `STAGE` (`kickoff.js`): `[{gesture-title}, {video autoNext},
  {go}]`. v1's deck (title/ritual-showcase/embed/video/go) moved behind
  `kickoff.html?deck=full`.
- New scene kind `gesture-title` (`stage-player.js#mountGestureTitle`): one
  breathing title line over the living magic circle. `cameraEngine.ensure()`
  fires the instant the scene mounts (scene 0 = page load) — `getUserMedia`
  needs permission, not a user gesture, so an already-granted origin goes
  hot silently; denied/unsupported just leaves a beautiful ambient title
  (no error UI). The moment a hand is seen, `gesture-ui.js`'s upgraded
  fingertip FX (see below) is the whole show-off beat with zero
  instruction. Holding ✋ (5 fingers) charges over `RITUAL_SEC` (2.2s) with
  `RITUAL_DECAY` soft-decay on drop (copied from `ritual-controller.js`'s
  charge step, not imported — that class owns a DOM overlay this scene
  doesn't have); full charge → flash + `RitualVortex.burst()` → auto
  `advance()`. Hint line only fades in once tracking is confirmed live AND
  no hand has been seen for ~7s. No `AudioContext` anywhere on this scene
  (it may never see a user gesture at all).
- `stage-player.js` additions, kept generic: `autoNext:true` on `video`
  scenes (opt-in — v1-style decks still freeze-and-wait by default);
  `isAutoNext(scene)` pure predicate; `next:'auto'` on `gesture-title`.
  Keyboard (→/Space/Esc) and the corner ⏭ stay wired as a silent fallback
  the whole time. `test-stage-player.mjs` covers `isAutoNext`.
- Fingertip FX upgrade (`engine/gesture-ui.js`, owner: "ngón tay phát sáng
  nhìn phèn dã man"): one shared `FingertipFxPainter` now backs all three
  call sites (chip overlay `armFingertipFx`, fullscreen track dot
  `armScreenFingertipDot`, new fullscreen `armFullscreenFingertipFx`) —
  each fingertip gets a small spinning ring + tick marks + inner triangle
  (echoing `ritual-vortex.js`'s big circle), success = brighter + faster
  spin (not a color swap), plus a low-rate capped (~36) rune-glyph
  particle emitter per tip that drifts/fades/rotates — fast hand motion
  reads as a trail. Pure spawn/step math (`spawnGlyphParticle`/
  `stepGlyphParticles`) is unit-tested in `test-gesture-fx.mjs`.
- Glyph-dust density: `ritual-vortex.js` mount option `density` (0..1,
  default 1) thins the ambient/idle glyph-dust count for showcase
  fullscreen mounts only (burst/summoned motes never thinned) — the
  gesture-title scene mounts at `density:.35` to fix the "phèn dã man"
  glyph storm on a fullscreen backdrop.

## C. Homepage entry funnel (2026-07-04, owner feedback: the map was a naked
drop-off, the beautiful one-gesture entry was stuck in teacher-only
kickoff.html)

`lessons/index.html` (the saga map) now boots through the same one-gesture
entry as kickoff.html's default deck, instead of showing the naked map:

- **New**: `lessons/entry.js` (module) + `lessons/entry.css`. `entry.js`
  imports `mountGestureTitle` — now exported from `stage-player.js` alongside
  the existing `mount`/`StagePlayer` exports, no logic change needed since
  its signature (`scene, host, advance`) was already generic/DOM-only.
  `entry.css` copies (doesn't `@import`) the `.stg-gtitle` look from
  `kickoff.css`, scoped under `#entry` — kickoff.css stays teacher-stage-only.
- **Boot order** (`index.html`): `theme.js` → `saga.js` (renders the map,
  replacing `document.body.innerHTML` synchronously) → `onboard.js` (now
  loaded with a `data-manual` attribute, so its own auto-mount line is
  skipped) → `entry.js` (module scripts execute in document order alongside
  `defer` scripts, so this really does run last). `entry.js` appends its
  overlay AFTER saga.js has already built the map underneath — never before,
  or the map's own `innerHTML` write would wipe it.
- **Flow**: fullscreen `#entry` gesture-title scene (auto-arms the camera,
  same charge/seal feel as kickoff's default deck) → on seal, if
  `localStorage['magicdust.onboard']` is unset (first-ever visit) →
  dynamic `import('./onboard.js')` then `Onboard.mount({onDone: revealMap})`;
  otherwise straight to `revealMap()` (a no-op — the map's already rendered,
  `#entry` is just gone). Any tap or Enter/→/Space instantly skips `#entry`
  (same soft posture as stage-player scenes) — camera is released either way
  since `mountGestureTitle`'s own returned teardown fn is always called.
- **z-index**: `#entry` sits at 90 — above the map's header (10) but the
  handoff to onboarding (`#ob`, z-index 40) is sequential, never stacked,
  since `#entry` is torn down and removed from the DOM before
  `Onboard.mount()` is ever called.
- **Escape hatches**: `?noentry` URL param skips `#entry` entirely (dev
  bypass, documented in README). `ENTRY_EVERY_VISIT` (top of `entry.js`,
  currently `true`) is the one-line flip if the gesture entry should only
  ever show once instead of every visit — owner's stated intent for now is
  every visit, since the gesture ritual IS the brand.
- Verified in Chrome via a local `python -m http.server`: fresh profile →
  entry renders over the map → Enter skips → onboarding's ACT1 cutscene
  mounts, no console errors. `magicdust.onboard` flag set → entry → skip →
  straight to the map, no console errors. `?noentry` → map immediately, no
  overlay ever created. Full `expectOut`/layer/content test sweep stayed
  green (unrelated pre-existing warnings only).
