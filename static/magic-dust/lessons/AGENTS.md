# Lesson agent guide

These instructions apply to every file under `lessons/` and extend the root
`AGENTS.md`.

## Before editing

- Read `CLAUDE.md`, `PEDAGOGY-METHOD.md`, `STORY.md`, and the relevant saga
  design/plan.
- Inspect the importer, imported modules and targeted tests before changing a
  shared runtime file.
- Preserve unrelated changes in this dirty shared workspace.

## Learner content

- Follow the V2 sequence: prior knowledge → direct definition → correct example
  → failure case → learner task → checkpoint → level-2+ quiz → reward.
- Introduce at most one new mechanism per step. An analogy may reinforce a
  definition but may not replace it.
- Use English ASCII names in visible code: `image_size`, `object_distance`,
  `kernel`, `row`, `col`, `score`, `response`.
- A preset value is “cho sẵn”, not INPUT. Use INPUT only for data read from a
  learner, camera, file picker or other outside source.
- Put complete solutions only in `solution`; task copy may name the method but
  must not leak every implementation step.

## Computer Vision saga

- Teach each node as a compact academic lab: precise diagram and notation,
  derivation/experiment, one main project, then a level-2+ project defense.
- Prefer one complete program with several related decisions over a sequence of
  small demo/fix/RUN cells. Small runs are allowed only when they measure
  something the main project needs.
- Runtime names: `vision.html`, `vision-map.js`, `vision-state.js`,
  `vision-lesson.html`, `content/vision-curriculum.js`,
  `content/vision-builders.js`, and `content/visionnodeNN.js`.
- Completion key: `magicdust.vision.node.<id>`. Reward track: `vision`.
- Nodes marked `ready: false` remain roadmap beacons. They show information but
  never navigate to a lesson page.
- Node 0–9 use pure Python and tiny preset data. OpenCV is introduced only after
  the learner has implemented the corresponding mechanism.
- Every OpenCV node needs a pure-Python fallback and a numerical OUTPUT check.
- Do not use `cv2.imshow()` or `cv2.VideoCapture()` in Pyodide.
- Do not upload or persist camera frames. Stop media tracks when leaving the
  active cell.

## UI and art

- CSS uses variables from `palette.css`; no direct hex/RGB values in saga CSS.
- Follow `ART-DIRECTION.md` and `COMPUTER-VISION-ART-ROADMAP.md`.
- Location/collectible bitmaps contain no text, numbers, logos or UI.
- Preserve keyboard/tap fallbacks, focus states, 48px mobile targets and
  `prefers-reduced-motion` behavior.

## Definition of done

A Computer Vision node is ready only when its content validates cleanly, every
solution passes the real output matcher, map/portal tests pass, desktop/mobile
browser QC has no page errors, and source metadata is present.
