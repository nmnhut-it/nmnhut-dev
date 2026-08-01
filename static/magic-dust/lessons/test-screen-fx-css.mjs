// node lessons/test-screen-fx-css.mjs
// Static regression for AR screen filters that must survive CameraEngine.release().
// release() paints the last video frame into #camstill, which is what remains
// visible after the webcam track stops. Persistent camera_charm filters must
// therefore target both #cam and #camstill.
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./node.css', import.meta.url), 'utf8');

function ruleFor(cls) {
  const pattern = new RegExp(`#scenepanel\\.${cls}\\s+#cam\\s*,\\s*#scenepanel\\.${cls}\\s+#camstill\\s*\\{([^}]*)\\}`);
  const match = css.match(pattern);
  assert.ok(match, `${cls} must target both #cam and #camstill`);
  return match[1];
}

assert.match(ruleFor('fx-sepia'), /filter\s*:\s*sepia\(/);
assert.match(ruleFor('fx-invert'), /filter\s*:\s*invert\(/);
assert.match(ruleFor('fx-gray'), /filter\s*:\s*grayscale\(/);
assert.match(ruleFor('fx-mirror'), /transform\s*:\s*scaleX\(1\)/);

console.log('screen-fx CSS persistence checks passed');
