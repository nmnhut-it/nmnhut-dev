+++
date = '2026-07-02T14:00:00+07:00'
draft = false
title = 'Magic Dust — learn Python by casting spells at your webcam'
description = 'A browser coding game for kids: an AR spellcasting toy plus a saga-map course where pure Python drives hand-gesture VFX. No install, everything runs in the browser.'
tags = ['projects', 'education', 'python', 'webgl']
+++

**Magic Dust** is a small browser experiment in two parts, both running
entirely client-side (camera stays on your machine — nothing is uploaded):

- **[The spellcasting toy](/magic-dust/index.html)** — show an open palm to
  the webcam to summon glowing dust from your hand, then hold one or two
  fingers still: a whirlpool vortex gathers your dust and casts. MediaPipe
  hand-tracking + a Three.js additive particle system.

- **[The saga](/magic-dust/lessons/index.html)** — a level-map coding course
  where kids write **pure Python** (Pyodide, in a worker) inside a
  Jupyter-style notebook narrated by Pip the dust sprite. The gesture
  language runs through everything: ☝ one finger starts a node, ✋ a high
  five opens bundles and seals rituals, and Node 2's PHOTO CHARM ends with a
  conditionals ladder that snaps a beauty-filtered polaroid of you wrapped
  in dust you conjured yourself.

Works in Chrome/Edge on a laptop with a webcam. Two themes — ✦ SPARK and
❀ BLOOM — restyle everything from the map trail down to the particle
shaders.
