// node lessons/test-mediapipe-script-dedup.mjs — regression for the owner
// bug "Uncaught Error: Can only have one anonymous define call per script
// file … lâu lâu hay gặp làm cho mediapipe bị chết": camera-engine.js's own
// loadScript() used to gate on a per-module-call-site check of `!self.Hands`
// right before its own `await` — safe against races WITHIN one CameraEngine
// instance's own ensure() (memoized via #starting), but NOT against a
// completely separate, non-cooperating loader on the same page (the legacy
// onboard.js/lesson.js onboarding flows, which load the exact same MediaPipe
// CDN scripts with their own copy-pasted loadScript). Two such loaders
// racing before either's <script onload> fires both see `!self.Hands` as
// true and both inject a <script src=".../hands.js">. MediaPipe's bundle is
// UMD/AMD, and Monaco's loader.js (present on every lesson page) installs a
// real AMD loader — executing the same AMD script twice throws "Can only
// have one anonymous define call per script file" and kills MediaPipe for
// the rest of that page load. Fix: key the in-flight/settled load promise on
// `self.__mdScriptLoads[src]` — a PAGE-WIDE cache every loader (regardless
// of file) shares, so only one <script> is ever injected per URL.
import assert from 'node:assert';

let scriptsCreated = [];
class FakeScriptEl {
  constructor() { this._listeners = {}; scriptsCreated.push(this); }
  set onload(fn) { this._onload = fn; }
  set onerror(fn) { this._onerror = fn; }
  fireLoad() { if (this._onload) this._onload(); }
}
globalThis.self = globalThis;
globalThis.document = {
  createElement: tag => tag === 'script' ? new FakeScriptEl() : { classList: { add() {}, remove() {} } },
  head: { appendChild(s) { setTimeout(() => s.fireLoad(), 0); } },
  getElementById: () => null,
};

const { CameraEngine } = await import('./engine/camera-engine.js');

let passed = 0, failed = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}

// A minimal stand-in for onboard.js's/lesson.js's OWN copy-pasted
// loadScript — patched (per the fix) to share the same page-wide cache key
// camera-engine.js uses, instead of injecting independently.
function legacyLoadScript(src) {
  self.__mdScriptLoads ||= {};
  return self.__mdScriptLoads[src] ||= new Promise(res => {
    const s = document.createElement('script'); s.onload = res; document.head.appendChild(s);
  });
}

await t('two independent loaders racing for the same MediaPipe script inject exactly one <script> tag', async () => {
  scriptsCreated = [];
  delete self.Hands;
  self.__mdScriptLoads = {};
  const fakeVideo = { srcObject: null, play: () => Promise.resolve(), paused: true };
  const engine = new CameraEngine(fakeVideo, { onFrame: () => {}, watchdogActive: () => false });
  // Fire camera-engine.js's real ensure() (which will try to load hands.js
  // and camera_utils-less MediaPipe Hands) AND a "foreign" legacy loader for
  // the exact same URL, at the same tick — the real-world race.
  self.Hands = undefined; // simulate the not-yet-loaded state both sides check
  const url = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
  const p1 = legacyLoadScript(url);
  // engine.ensure() will itself call the module's internal loadScript for
  // the SAME url (camera-engine.js checks `!self.Hands` too) — since
  // getUserMedia isn't mocked, ensure() will reject after the script load
  // step; that's fine, we only care how many <script> tags got created.
  const p2 = engine.ensure().catch(() => {});
  await Promise.all([p1, p2]);
  const handsScripts = scriptsCreated; // getUserMedia mock absent means camera_utils/hands.js loadScript is the only script path exercised here
  assert.ok(handsScripts.length <= 1, `expected at most 1 <script> tag for the shared URL, got ${handsScripts.length} — two loaders raced and both injected it, which crashes MediaPipe's AMD define on the second execution`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
