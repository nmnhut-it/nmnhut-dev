# Magic Dust teaching platform

This directory is the browser-based Python learning game. It has no bundler:
HTML pages import ES modules directly, and Python runs in Pyodide through
`worker.js` and `engine/py-bridge.js`.

## Read before changing lessons

Read, in order:

1. root `AGENTS.md` and `CLAUDE.md`;
2. `PEDAGOGY-METHOD.md` and `STORY.md`;
3. `ART-DIRECTION.md` and `COLOR-SYSTEM.md` for visible UI or art;
4. the design/implementation document for the saga being changed;
5. `skills/magic-dust-vietnamese-voice/SKILL.md` for learner-facing text.

Learner content is data under `content/`. Keep student-visible identifiers in
English ASCII. Every code task must identify preset data or real INPUT, the
PROCESS to practise, and the exact OUTPUT used to verify completion.

## Saga boundaries

- Main story: `saga.js`, `lessonNNv2.html`, `content/nodeNNv2.js`.
- Toán 6: `math6*.js/html/css`, `content/math6*.js`.
- Python challenges: `python50*.js/html/css`, `content/python50*.js`.
- Computer Vision: `vision*.js/html/css`, `content/vision*.js`, with the source
  of truth in `COMPUTER-VISION-SAGA-DESIGN.md` and
  `COMPUTER-VISION-IMPLEMENTATION-PLAN.md`.

Each optional saga owns its completion keys and must never write
`magicdust.saga`. It may read that key only to check whether prerequisite
Python tools have been learned.

## Computer Vision contract

- Use a lab arc distinct from the main Python saga: model/notation slides →
  derivation or measured evidence → one substantial project → project defense.
- One primary project is the default completion unit. Do not fragment a vision
  concept into several tiny RUN/fix cells merely to reuse the Python-saga rhythm.
- Teach the mechanism with small matrices/numbers before calling OpenCV.
- Keep preset images and frame sequences as the default path.
- Camera use is opt-in, requested only after a learner action, never required
  for XP, collectibles, or completion.
- Do not build face, identity, emotion, or personal-attribute recognition.
- Geometric diagrams, kernels, heatmaps and boxes are code-native SVG/canvas;
  generated bitmaps are for storybook locations and collectibles only.
- A map node becomes clickable only when its content, solution checks, runtime
  dependencies and required art are all ready. Never link to an empty lesson.

## Verification

For a changed learner content file:

```powershell
node lessons/check-voice-terms.mjs lessons/content/<file>.js
node lessons/validate-content.mjs lessons/content/<file>.js
node lessons/test-content-solutions.mjs
```

For Computer Vision infrastructure:

```powershell
node lessons/test-vision-map.mjs
node lessons/test-learning-portal.mjs
node lessons/test-collectible-store.mjs
node lessons/audit-theme-colors.mjs
```

Serve through `python serve.py 8765` for browser testing. Production publishing
uses `.claude/skills/deploy-nmnhut/SKILL.md`; never deploy through Dokploy.
