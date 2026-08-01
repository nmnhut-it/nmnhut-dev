# lessons/traces/

Recorded (or synthetic) `{t, lm}` hand-landmark traces for replaying through
`GestureDispatcher.onHands` in tests / tuning, without a camera.

- `synthetic-swipe-right.json` — **synthetic**, not a real recording.
  Generated: hold a 5-finger open palm past `GESTURE_ARM_MS` to arm, then a
  fingertip (landmark 8) trail sweeping raw x from 0.8→0.2 (mirrored screen
  space 1-x: 0.2→0.8, i.e. rightward) to resolve the swipe. Used by
  `lessons/test-dispatcher.mjs`'s replay test.
- Record a **real** trace via the browser console: `nodeDev.recordHands(seconds)`
  (see `lessons/engine/cheat-panel.js` / `lessons/node.js`) — downloads a
  JSON file of the same `[{t, lm}, …]` shape, drop it here to replay/tune
  `SWIPE_MIN_DIST`/`TRACK_CATCH_RADIUS` against real camera data.
