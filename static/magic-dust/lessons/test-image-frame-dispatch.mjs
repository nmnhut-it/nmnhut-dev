// node lessons/test-image-frame-dispatch.mjs
// Focused bridge coverage for camera_charm.present_image_frame(image).
import assert from 'node:assert/strict';
import { NotebookRunner } from './engine/notebook-runner.js';

function makeRunner(studio) {
  const responses = [];
  const runner = new NotebookRunner({ cells: [] }, {
    bridge: { respond: value => responses.push(value) },
    gestureDispatcher: {}, cameraEngine: {}, progressStore: {}, casting: {}, photoBooth: {}, studio,
    scenePanel: {}, bookEl: {}, pystatEl: {}, toast: () => {},
  });
  return { runner, responses };
}

const payload = '{"action":"image_frame","image":[[[255,0,0,128]]]}';
let received = null;
const live = makeRunner({ presentImageFrame(raw) { received = raw; return 'drawn'; } });
await live.runner.onAsk('image_frame', payload);
assert.equal(received, payload);
assert.deepEqual(live.responses, ['drawn']);

const missing = makeRunner(null);
await missing.runner.onAsk('image_frame', payload);
assert.deepEqual(missing.responses, ['skipped']);

console.log('  ok - image_frame ask reaches the framebuffer renderer and has a bounded fallback');
