# MediaPipe Tasks migration evaluation (Framework Plan Step 6, Part B)

Evaluation only — **no camera-pipeline code was changed**. Date: 2026-07-04.

## Verdict

**GO — but as its own scheduled step, not a drive-by.** Legacy
`@mediapipe/hands` has been frozen/unsupported since **March 1, 2023**
(3+ years now); everything our code consumes survives the migration
(21-point landmark topology, normalized coords, our own mirroring), and the
entire touch surface is behind the `camera-engine.js` seam plus one root-app
file. Keep `countFingers` (our landmark math) — the built-in
GestureRecognizer does NOT cover finger-count 1–4 answer picking. Main risk:
~9–14 MB model+wasm download from two CDN hosts on school networks
(self-hostable, which also fits the no-build constraint).

## Current wiring (what exists today)

Two independent consumers of legacy `@mediapipe/hands@0.4.1675469240`
(a Jan-2023 build — the last one ever published):

**Teaching platform — `lessons/engine/camera-engine.js`** (sole owner):
- Lazy `loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')`
  inside `ensure()`; `new self.Hands({locateFile})` pointed at the same CDN.
- `setOptions({maxNumHands:1, modelComplexity:1, minDetectionConfidence:.7,
  minTrackingConfidence:.6, selfieMode:false})`.
- **Push model**: our own single rAF loop calls `hands.send({image: videoEl})`
  (never re-entrant — `#sending` flag), results arrive via the
  `hands.onResults(cb)` callback; `#lastResult` timestamp doubles as the
  **watchdog heartbeat** (silent pipeline death → `restart()`).
- Deliberately does NOT use `@mediapipe/camera_utils` (its `stop()` left a
  zombie frame loop — see the file's header comment).
- Downstream, `GestureDispatcher.onHands(res)` reads
  `res.multiHandLandmarks[0]` and all landmark math mirrors x itself
  (`1 - lm[8].x` etc.) since `selfieMode:false`.

**Root VFX app — `index.html` + `src/main.js`**:
- Three `<script>` tags: `@mediapipe/{camera_utils,drawing_utils,hands}`
  (pinned versions, jsdelivr).
- `new Hands({locateFile})`, `hands.onResults(...)` reading
  `res.multiHandLandmarks[0]`, and it DOES use the `Camera` driver
  (`camera_utils`) for its frame loop.

## Where MediaPipe Tasks Vision stands (checked July 2026)

- **Legacy is dead, not just deprecated**: Google ended support for all
  Legacy Solutions (incl. Hands) on 2023-03-01; the npm package + CDN files
  remain available "as-is" with no further updates.
  https://developers.google.com/edge/mediapipe/solutions/guide ·
  https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md ·
  https://github.com/google-ai-edge/mediapipe/issues/4142
- **Successor**: `@mediapipe/tasks-vision` (npm, actively released — 0.10.x
  line current), CDN-served from jsdelivr. Two relevant tasks:
  - **HandLandmarker** — same 21 landmarks:
    https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js
  - **GestureRecognizer** — landmarks PLUS canned gesture classification:
    https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer/web_js
- **Loading shape (fits no-build)**: ESM from CDN —
  `import { FilesetResolver, HandLandmarker } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@<ver>/vision_bundle.mjs'`
  (or a plain `<script>` UMD build), then
  `FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@<ver>/wasm')`
  and `HandLandmarker.createFromOptions(fileset, {baseOptions:{modelAssetPath, delegate:'GPU'}, runningMode:'VIDEO', numHands:1})`.
  https://www.npmjs.com/package/@mediapipe/tasks-vision
- **Model hosting/size**: `.task` model files are hosted on
  `storage.googleapis.com/mediapipe-models/...` — `hand_landmarker.task`
  ≈ 8–12 MB (float16 variant ~7.8 MB), plus the wasm runtime (~4–6 MB on
  disk; npm reports the package at ~860 kB gz). Legacy hands also pulled
  several MB of wasm+tflite from jsdelivr, so the delta is real but not
  order-of-magnitude. https://bundlephobia.com/package/@mediapipe/tasks-vision ·
  https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker

## API mapping (old → new)

| Legacy `@mediapipe/hands` | Tasks `HandLandmarker`/`GestureRecognizer` |
|---|---|
| `<script src=.../hands.js>` + `new Hands({locateFile})` | ESM/UMD from `@mediapipe/tasks-vision` + `FilesetResolver.forVisionTasks(wasmDir)` + `createFromOptions()` |
| `setOptions({maxNumHands, modelComplexity, minDetectionConfidence, minTrackingConfidence, selfieMode})` | `createFromOptions({numHands, minHandDetectionConfidence, minHandPresenceConfidence, minTrackingConfidence, runningMode:'VIDEO'})` — no `modelComplexity` (one model), **no `selfieMode`** |
| `hands.send({image: video})` → async, results later via callback | `landmarker.detectForVideo(video, timestampMs)` / `recognizer.recognizeForVideo(video, ts)` — **synchronous, returns the result** (blocks the calling thread) |
| `hands.onResults(res => ...)` | no callback — the return value IS the result; our rAF loop calls detect and dispatches inline |
| `res.multiHandLandmarks: [ [21 pts] ]` | `result.landmarks: [ [21 pts] ]` (+ `worldLandmarks`, `handednesses`; GestureRecognizer adds `gestures: [[{categoryName, score}]]`) |
| landmark `{x, y, z}` normalized to image | unchanged — same 21-point topology, same indices (0 wrist, 9 mid-MCP, 8 index tip), same normalized coords |
| mirroring: we do `1 - x` ourselves (`selfieMode:false`) | unchanged — Tasks never mirrors; all our `1 - lm[i].x` math carries over verbatim |

## What our code relies on that changes

- **`res.multiHandLandmarks`** — read in `gesture-dispatcher.js#onHands`,
  `src/main.js`, tests' synthetic frames. Rename to `result.landmarks` **or**
  (cheaper) have `camera-engine.js` adapt: wrap the Tasks result back into
  `{multiHandLandmarks: result.landmarks}` before calling `#onFrame` — then
  ZERO downstream files change and every existing test stays valid as-is.
- **Callback → sync**: our rAF loop already exists and already guards
  re-entrancy; it becomes `const r = landmarker.detectForVideo(video, now)`
  followed directly by `this.#onResults(adapt(r))`. The `#sending` flag and
  the watchdog survive (a wedged pipeline now shows up as a thrown/hung call
  instead of silent callback loss — watchdog threshold logic unchanged).
- **`video.currentTime`-based timestamps**: `detectForVideo` needs a
  monotonically increasing timestamp; guard against sending the same frame
  twice (docs recommend comparing `video.currentTime`).
- **Landmark indexing / coords / mirroring**: no change (verified above) —
  `countFingers`, `detectSwipe`, `trackDistance`, ritual math all untouched.
- **`camera_utils` (root app only)**: drop it; port the root app to the same
  self-owned rAF loop `camera-engine.js` already proved out.

## Could ✋ / finger-count come free from GestureRecognizer?

Partially — not enough to delete our math:
- Built-in categories: `None, Closed_Fist, Open_Palm, Pointing_Up,
  Thumb_Down, Thumb_Up, Victory, ILoveYou`. `Open_Palm` ≈ our ✋ arm/summon
  sign, `Victory` ≈ ✌ (2), `Pointing_Up` ≈ ☝ (1).
- **No canned 3/4-finger categories** — quiz answer picking (hold 1..4
  fingers = option N) and `GESTURE_FINGERS` still need `countFingers` over
  raw landmarks. GestureRecognizer also costs a second model download.
- Sensible shape IF adopted later: HandLandmarker only + keep our math
  (recommended), or GestureRecognizer with its landmarks feeding our math and
  `Open_Palm` as a robustness assist for the ARM sign. Custom-training a
  finger-count model is possible but is a build-pipeline commitment we don't
  want.

## Risks

- **Download size on school networks**: ~9–14 MB (wasm + .task) on first
  load, from TWO hosts — jsdelivr AND `storage.googleapis.com` (the latter is
  more likely to be filtered at schools). Mitigation: self-host the `.task`
  and wasm dir as static files next to the app (they're plain files — fits
  the no-build rule) exactly like `lessons/assets/`; also keeps versions
  pinned forever.
- **No-build constraint**: satisfied — `vision_bundle.mjs`/UMD via CDN
  `<script>`/importmap, no bundler needed.
- **Sync `detectForVideo` blocks the main thread** (docs explicitly warn);
  our Pyodide already lives in a worker but MediaPipe would still share the
  UI thread, same as legacy effectively did. Watch frame pacing on low-end
  school hardware; `delegate:'GPU'` is the default mitigation.
- **Behavior drift**: new model ≠ old model; `FT_EXT`/`TH_RATIO`/swipe-trace
  tuning may need re-validation — this is exactly what the record/replay
  harness (`nodeDev.recordHands` + `traces/`, Step 3) was built for.
- **Pinned-version discipline**: use an exact `@mediapipe/tasks-vision@x.y.z`
  URL, never `@latest` (the docs' `@latest` examples have broken people
  before).

## Migration checklist (when scheduled)

1. Record real landmark traces (✋ hold, 1/2/3 fingers, swipe, track) via
   `nodeDev.recordHands` against the CURRENT pipeline → check into `traces/`.
2. `camera-engine.js`: swap `loadScript(hands.js)` for the tasks-vision ESM
   import; `Hands`+`setOptions` → `FilesetResolver`+
   `HandLandmarker.createFromOptions` (runningMode VIDEO, numHands 1);
   rAF loop calls `detectForVideo(video, performance.now())` and **adapts the
   result to `{multiHandLandmarks}`** so nothing downstream changes.
3. Keep the watchdog + `release()`/`restart()`/`syncViews()` semantics
   identical (they're stream/loop-level, not MediaPipe-level).
4. Self-host wasm dir + `hand_landmarker.task` under `lessons/vendor/` (or
   keep CDN with pinned version — decide after a school-network test).
5. Replay the recorded traces + run every `.mjs` suite (they're synthetic-
   frame based, so they pass regardless — the traces are the real gate);
   hand-verify ritual/quiz/boss/swipe/track and re-tune `FT_EXT`/`TH_RATIO`/
   `SWIPE_*`/`TRACK_*` if drift shows.
6. Port root `index.html`/`src/main.js` second (drop `camera_utils`, reuse
   the camera-engine loop pattern); the two apps can migrate independently.
7. Only after landmarker parity: optionally evaluate GestureRecognizer's
   `Open_Palm` as an ARM-sign assist (extra model download — measure first).

## Sources

- https://developers.google.com/edge/mediapipe/solutions/guide (legacy support ended 2023-03-01)
- https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js
- https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer/web_js (canned gesture list, VIDEO mode, sync/blocking note)
- https://www.npmjs.com/package/@mediapipe/tasks-vision (CDN/ESM usage, versions)
- https://bundlephobia.com/package/@mediapipe/tasks-vision (package size)
- https://github.com/google-ai-edge/mediapipe/issues/4142 (deprecation fallout/migration path discussion)
- https://github.com/google-ai-edge/mediapipe/blob/master/docs/solutions/hands.md (frozen legacy docs)
