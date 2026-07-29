# Generated VFX plates

## `cinematic-lightning-strike-v1.png`

- Generated with the built-in OpenAI image generation tool on 2026-07-26.
- The generated source used a flat green chroma-key background.
- Alpha was produced locally with the imagegen skill's
  `remove_chroma_key.py` helper using soft matte and despill.
- Runtime dimensions: `1254 × 1254`, RGBA PNG.

Final prompt:

> One photorealistic cinematic lightning strike plate for browser camera
> compositing: a thick irregular main return-stroke descending from storm sky
> to a target point, many fine fractal side branches, uneven channel thickness,
> hot white core, pale blue-violet corona, localized bloom, and natural
> asymmetry. Avoid cartoon icons, smooth vector curves, uniform-width strokes,
> straight sticks, repeated symmetrical branches, text, and watermarks.

The chroma-key generation source is not required by the runtime.

## `fog-drift-v1-alpha.webm`, `fog-drift-v1.mp4`, `explosion-burst-v1-alpha.webm`

Generated with Gemini (Veo) on 2026-07-29 to replace the FootageCrate downloads
that used to live in `../footagecrate-runtime/`. Those were licensed to the
user's ProductionCrate account with "do not redistribute as a standalone asset
pack" — fine while they sat in a private working tree, wrong the moment this
project ships as a public repo students clone. The folder is gone.

Fog prompt:

> Thick volumetric fog drifting slowly across the frame from left to right, soft
> billowing wisps, pale grey-white smoke with gentle internal turbulence, filling
> the whole frame evenly, on a pure solid black background, nothing else in the
> shot, no sky, no ground, no room, no walls, no people, no objects, no text, no
> watermark, no logo, static locked-off camera, no camera movement, seamless slow
> continuous motion.

Explosion prompt:

> A single bright orange-white explosion bursting outward from the centre of the
> frame, expanding fireball with debris sparks and a shockwave ring, dissipating
> into embers, on a pure solid black background, nothing else in the shot, no
> sky, no ground, no room, no people, no objects, no text, no watermark, no logo,
> static locked-off camera, no camera movement.

Both downloads are 1280x720 H.264. Alpha was derived locally from luminance —
the plates are lit on black, so brightness IS opacity:

```bash
ffmpeg -i in.mp4 -an -r 24 -filter_complex   "[0:v]scale=960:-2,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':   a='clip(((r(X,Y)+g(X,Y)+b(X,Y))/3-14)*1.7,0,255)'[v]"   -map "[v]" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 900k out-alpha.webm
```

`geq` has no `lum()` in RGBA mode, hence the hand-rolled average. Verified in a
real browser over a magenta page: 11% fully transparent, 86% partial, 2% solid.
Each clip carries Google's SynthID watermark (a small ✦ near a corner).
