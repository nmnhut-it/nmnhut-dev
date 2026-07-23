# Implementation plan · Mắt Máy Kotopia

## Product rule

This is an optional learning saga for a learner who has completed grade 6.
Progress is independent from the main story. Main-saga progress unlocks the
Python tools required by a node; completing Computer Vision never changes
`magicdust.saga`.

The release unit is a batch. A batch opens only when content, runtime, tests and
art are ready together. Nodes still being built remain visible as construction
beacons and do not link to empty pages.

## Status

| Area | Status | Exit condition |
|---|---|---|
| Portal + 14-node roadmap | Done | Three physical portals and a CV route are live |
| Shared CV state/reward contract | Done | Completion, one-time XP and resume are tested |
| Pilot Node 00 · Pinhole | Done | Three-slide academic lab and one checked design project |
| Nodes 01–13 · project labs | Done | 13 three-slide decks and 13 checked Python projects |
| Vision location art | Done | 14 optimized transparent WebPs load on the map |
| OpenCV package loading | Done | Node 10 lazy-loads package with pure-Python fallback |
| Full verification | Done | 1041/1041 solution branches and 14-node browser sweep pass |

## Milestone 0 · Infrastructure and pilot

- Add scoped `lessons/CLAUDE.md` and `lessons/AGENTS.md`.
- Add `vision-state.js`, `vision-lesson.html` and a reusable lesson builder.
- Mark readiness in curriculum data; only ready nodes navigate.
- Add the `vision` track to XP/collectible synchronization.
- Add a three-slide code-native lab: projection model, similar-triangle
  derivation and engineering constraints.
- Ship Node 00 as one camera-design project using arithmetic and `if/elif`
  already learned in the main saga.

Acceptance: Node 00 opens at `mainRequired: 5`, awards 100 XP once, returns to
the CV map as completed, and works without camera permission.

## Batch 1 · Ánh sáng vào máy

1. Node 00: pinhole rays, inverse size relationship, inverted real image.
2. Node 01: 3D point projection and the `(u, v)` versus `[row][col]` distinction.
3. Node 02: RGB matrix recap with a diagnostic shortcut for learners who
   completed the existing image operations island.
4. Produce three location assets and three collectibles after Node 00 visual
   language passes desktop/mobile QC.

## Batch 2 · Xưởng xử lý pixel

Build shared matrix renderers first, then Nodes 03–06: sliding window, kernel,
blur, edge and threshold. Every diagram steps through one numeric operation and
also prints the resulting number/matrix.

## Batch 3 · Truy tìm mẫu

Build Node 07 in pure Python before package work. Then add NCC, response maps,
threshold/NMS and finally Node 10, where the learner compares their result with
`cv2.matchTemplate` on the same data.

## Batch 4 · Không gian và chuyển động

Add perspective mapping, preset frame tracking and the capstone. Camera remains
optional and snapshot-only; the complete learning path runs on preset data.

## Required checks per node

```powershell
node lessons/check-voice-terms.mjs lessons/content/visionnodeNN.js
node lessons/validate-content.mjs lessons/content/visionnodeNN.js
node lessons/test-content-solutions.mjs
node lessons/test-vision-map.mjs
node lessons/test-learning-portal.mjs
```

Before opening a batch, also run browser desktop/mobile QC and
`node lessons/audit-theme-colors.mjs`. The repeatable browser check is:

```powershell
node lessons/test-vision-browser.mjs
```

It writes review screenshots to `tmp/vision-saga-browser/`.
