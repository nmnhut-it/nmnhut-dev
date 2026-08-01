// node lessons/test-interactive-studio.mjs — pure/fake-DOM coverage for the
// Python-driven hand AR studio. No camera, WebGL, or browser process needed.
import assert from 'node:assert/strict';
import { InteractiveStudio, normalizeImageFrame, normalizePhotoLightColors, normalizeStudioStyle, photoLightFrame, photoLightSlots, rgbaToImageGrid, studioAnchorPoint } from './engine/interactive-studio.js';

let passed = 0, failed = 0;
async function t(name, fn) { try { await fn(); console.log('  ok — ' + name); passed++; } catch (e) { console.error('  FAIL — ' + name + '\n', e); failed++; } }

class FakeClassList {
  constructor() { this.values = new Set(); }
  add(...names) { names.forEach(n => this.values.add(n)); }
  remove(...names) { names.forEach(n => this.values.delete(n)); }
  contains(name) { return this.values.has(name); }
  toggle(name, on) { const add = on === undefined ? !this.values.has(name) : !!on; add ? this.values.add(name) : this.values.delete(name); return add; }
}
class FakeElement {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase(); this.children = []; this.parentElement = null; this.className = ''; this.id = '';
    this.textContent = ''; this.clientWidth = 480; this.clientHeight = 360; this.classList = new FakeClassList(); this.dataset = {};
    this.style = { values: {}, setProperty: (k, v) => { this.style.values[k] = v; } };
  }
  appendChild(el) { el.parentElement = this; this.children.push(el); return el; }
  replaceChildren(...elements) { this.children.forEach(el => { el.parentElement = null; }); this.children = []; elements.forEach(el => this.appendChild(el)); }
  remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(c => c !== this); this.parentElement = null; }
  scrollIntoView() {}
  querySelector(selector) {
    const match = el => selector[0] === '#' ? el.id === selector.slice(1) : selector[0] === '.' ? el.className.split(/\s+/).includes(selector.slice(1)) : el.tagName.toLowerCase() === selector;
    const stack = [...this.children]; while (stack.length) { const el = stack.shift(); if (match(el)) return el; stack.push(...el.children); } return null;
  }
  getContext(kind) {
    if (this.tagName !== 'CANVAS' || kind !== '2d') return null;
    if (!this._context) this._context = {
      imageSmoothingEnabled: true, lastImageData: null,
      createImageData: (width, height) => ({ width, height, data: new Uint8ClampedArray(width * height * 4) }),
      putImageData: imageData => { this._context.lastImageData = imageData; },
    };
    return this._context;
  }
}
globalThis.document = { createElement: tag => new FakeElement(tag) };

function fixture(cameraOk = true, options = {}) {
  const panel = new FakeElement(); const stat = new FakeElement(); stat.id = 'scstat'; panel.appendChild(stat);
  let observer = null; const dispatcher = { onLandmarks(fn) { observer = fn; return () => { observer = null; }; }, emit(lm, has = true) { if (observer) observer(lm, has, 1); } };
  const camera = { ensure: () => cameraOk ? Promise.resolve() : Promise.reject(new Error('no camera')) };
  const calls = { mounts: [], emits: [], bursts: 0, stops: 0, lines: [] };
  const factory = { mount(_host, opts) { calls.mounts.push(opts); return {
    emit(x, y, n) { calls.emits.push({ x, y, n }); }, burst() { calls.bursts++; }, stop() { calls.stops++; },
  }; } };
  const studio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory, outLine: line => calls.lines.push(line), ...options });
  return { panel, dispatcher, studio, calls };
}
function hand() { return Array.from({ length: 21 }, () => ({ x: .5, y: .5, z: 0 })); }

await t('normalizeStudioStyle clamps numeric settings and rejects unknown motion/color', () => {
  assert.deepEqual(normalizeStudioStyle({ color: 'red', symbols: 'ABCDEFGHIJKLMNO', motion: 'explode', size: 99, density: 0, glow: -4 }), {
    color: '#78b2a5', symbols: 'ABCDEFGHIJKL', motion: 'orbit', size: 2, density: .15, glow: .5,
  });
});

await t('studioAnchorPoint mirrors x and supports wrist/palm/index_tip with a centered fallback', () => {
  const lm = hand(); lm[0] = { x: .1, y: .2 }; lm[9] = { x: .3, y: .4 }; lm[8] = { x: .7, y: .8 };
  assert.deepEqual(studioAnchorPoint(lm, 'wrist'), { x: .9, y: .2 });
  assert.deepEqual(studioAnchorPoint(lm, 'palm'), { x: .7, y: .4 });
  assert.deepEqual(studioAnchorPoint(lm, 'index_tip'), { x: .30000000000000004, y: .8 });
  assert.deepEqual(studioAnchorPoint(null, 'palm'), { x: .5, y: .5 });
});

await t('a sticker visibly follows the selected landmark in object-fit cover space', async () => {
  const { panel, dispatcher, studio } = fixture(); assert.equal(await studio.start('{"title":"Linh Live"}'), 'ready');
  studio.handle('{"action":"sticker_attach","symbol":"STAR","anchor":"index_tip","size":1.4}');
  const lm = hand(); lm[8] = { x: .2, y: .3 }; dispatcher.emit(lm);
  const sticker = panel.querySelector('.ar-sticker'); assert.ok(sticker); assert.equal(sticker.textContent, 'STAR');
  assert.equal(sticker.style.left, '384px'); assert.equal(sticker.style.top, '108px'); assert.equal(sticker.style.fontSize, '59px');
  studio.stop(); assert.equal(panel.querySelector('.ar-sticker'), null);
});

await t('readHandPosition returns a visible 0..100 dictionary shape from the requested anchor', async () => {
  const { dispatcher, studio } = fixture(); await studio.start('{}'); const lm = hand(); lm[0] = { x: .8, y: .7 }; dispatcher.emit(lm);
  assert.deepEqual(JSON.parse(await studio.readHandPosition('{"action":"hand_position","anchor":"wrist"}')), { visible: true, x: 20, y: 70 });
  dispatcher.emit(null, false); assert.deepEqual(JSON.parse(await studio.readHandPosition('{"anchor":"palm"}')), { visible: false, x: 50, y: 50 });
});

await t('explicit sticker coordinates clamp to the studio frame and clear independently', async () => {
  const { panel, studio } = fixture(); await studio.start('{}'); studio.handle('{"action":"sticker_at","symbol":"S","x":125,"y":-8,"size":9}');
  const sticker = panel.querySelector('.studio-static-sticker'); assert.equal(sticker.style.left, '100%'); assert.equal(sticker.style.top, '0%'); assert.equal(sticker.style.fontSize, '105px');
  studio.handle('{"action":"studio_frame_clear"}'); assert.equal(panel.querySelector('.studio-static-sticker'), null);
});

await t('particle frames are synchronized, bounded, capped, and replace the previous frame', async () => {
  const { panel, studio } = fixture(); assert.equal(await studio.start('{"action":"particle_stage_start","title":"Particle Lab"}'), 'started');
  assert.equal(studio.cameraAvailable, false); assert.match(panel.querySelector('#scstat').textContent, /từng frame/);
  assert.equal(studio.drawParticleFrame(JSON.stringify({ action: 'particle_frame', particles: [{ x: -5, y: 150, symbol: 'A', color: 'red', size: 9, alpha: 128 }] })), 'drawn');
  let frame = panel.querySelector('.studio-particle-frame'); assert.equal(frame.children.length, 1); assert.equal(frame.children[0].style.left, '0%'); assert.equal(frame.children[0].style.top, '100%'); assert.equal(frame.children[0].style.color, '#78b2a5'); assert.equal(frame.children[0].style.fontSize, '42px');
  assert.equal(frame.children[0].style.opacity, String(128 / 255));
  const particles = Array.from({ length: 150 }, (_, i) => ({ x: i, y: 20, symbol: '.', color: '#78b2a5', size: 1 })); studio.drawParticleFrame(JSON.stringify({ action: 'particle_frame', particles }));
  frame = panel.querySelector('.studio-particle-frame'); assert.equal(frame.children.length, 120); assert.equal(frame.children[0].style.left, '0%'); assert.equal(frame.children[50].style.left, '50%');
});

await t('image framebuffer preserves exact RGB/alpha, clamps channels, caps dimensions, and replaces prior output', async () => {
  const { panel, studio } = fixture(); await studio.start('{}');
  const raw = [[[255, 0, 17], [0, 128, 255, 64]], [[300, -5, 12, 999], null]];
  assert.equal(studio.presentImageFrame(JSON.stringify({ action: 'image_frame', image: raw })), 'drawn');
  const canvas = panel.querySelector('.studio-image-frame'), ctx = canvas.getContext('2d');
  assert.equal(canvas.width, 2); assert.equal(canvas.height, 2); assert.equal(canvas.style.imageRendering, 'pixelated'); assert.equal(ctx.imageSmoothingEnabled, false);
  assert.deepEqual([...ctx.lastImageData.data], [255, 0, 17, 255, 0, 128, 255, 64, 255, 0, 12, 255, 0, 0, 0, 0]);
  const oversized = Array.from({ length: 60 }, () => Array.from({ length: 70 }, () => [1, 2, 3, 4]));
  const normalized = normalizeImageFrame(oversized); assert.equal(normalized.width, 64); assert.equal(normalized.height, 48); assert.equal(normalized.data.length, 64 * 48 * 4);
  assert.equal(studio.presentImageFrame('{"action":"image_frame","image":[]}'), 'invalid'); assert.equal(panel.querySelector('.studio-image-frame'), null);
});

await t('image input becomes a bounded 2D RGB grid and falls back to the generated sample', async () => {
  assert.deepEqual(rgbaToImageGrid(new Uint8ClampedArray([1, 2, 3, 255, 4, 5, 6, 20]), 2, 1), [[[1, 2, 3], [4, 5, 6]]]);
  const decoded = []; const grid = [[[10, 20, 30]]];
  const { panel, studio } = fixture(true, {
    pickPhoto: () => Promise.resolve(null),
    decodePhoto: (source, size) => { decoded.push({ source, size }); return Promise.resolve(grid); },
  });
  assert.deepEqual(JSON.parse(await studio.start('{"action":"image_pick_grid","size":99}')), grid);
  assert.deepEqual(decoded[0], { source: 'assets/pixel-art-magic-owl.webp', size: 24 });
  assert.equal(panel.querySelector('.photo-light-picture').src, 'assets/pixel-art-magic-owl.webp');
  assert.match(panel.querySelector('#scstat').textContent, /ảnh mẫu 24×24/);
});

await t('image input reads the learner-selected local file without uploading it', async () => {
  const decoded = []; const grid = [[[200, 210, 220]]];
  const { panel, studio } = fixture(true, {
    pickPhoto: () => Promise.resolve('data:image/png;base64,LOCAL'),
    decodePhoto: (source, size) => { decoded.push({ source, size }); return Promise.resolve(grid); },
  });
  assert.deepEqual(JSON.parse(await studio.start('{"action":"image_pick_grid","size":16}')), grid);
  assert.deepEqual(decoded[0], { source: 'data:image/png;base64,LOCAL', size: 16 });
  assert.equal(panel.querySelector('.photo-light-picture').src, 'data:image/png;base64,LOCAL');
  assert.match(panel.querySelector('#scstat').textContent, /đã đọc ảnh thành bảng 16×16/);
});

await t('photo light helpers repeat safe colors around the frame and compute off/shift states', () => {
  assert.deepEqual(normalizePhotoLightColors(['green', 'red', 'yellow']), ['#78b2a5', '#9b3845', '#f4c85a']);
  assert.equal(photoLightSlots().length, 28);
  const shifted = photoLightFrame(['green', 'red', 'yellow'], 'shift', 1); assert.equal(shifted[0].color, '#9b3845'); assert.equal(shifted[0].on, true);
  assert.ok(photoLightFrame(['green'], 'off', 0).every(lamp => lamp.on === false));
});

await t('photo project keeps the upload local and renders steady, off, and shifting lamp frames', async () => {
  const { panel, studio } = fixture(true, { pickPhoto: () => Promise.resolve('data:image/png;base64,LOCAL'), wait: () => Promise.resolve() });
  assert.equal(await studio.start('{"action":"photo_upload"}'), 'uploaded');
  assert.equal(panel.querySelector('.photo-light-picture').src, 'data:image/png;base64,LOCAL');
  assert.equal(await studio.start('{"action":"photo_light","index":0,"color":"green"}'), 'drawn');
  assert.equal(await studio.start('{"action":"photo_light","index":1,"color":"red"}'), 'drawn');
  let ring = panel.querySelector('.photo-light-ring'); assert.equal(ring.children[0].style.backgroundColor, '#78b2a5'); assert.equal(ring.children[1].style.backgroundColor, '#9b3845');
  assert.equal(await studio.start('{"action":"photo_lights","colors":["green","red","yellow"],"mode":"shift","step":2}'), 'drawn');
  ring = panel.querySelector('.photo-light-ring'); assert.equal(ring.children.length, 28); assert.equal(ring.children[0].style.backgroundColor, '#f4c85a');
  assert.equal(await studio.start('{"action":"photo_lights","colors":["green","red","yellow"],"mode":"off","step":1}'), 'drawn');
  ring = panel.querySelector('.photo-light-ring'); assert.ok(ring.children.every(lamp => lamp.className === 'off'));
  studio.stop(); assert.equal(panel.querySelector('.photo-light-project'), null);
});

await t('photo project waits at a centered BẮT ĐẦU gate and delay holds the current frame', async () => {
  const waits = []; const { panel, studio } = fixture(true, { pickPhoto: () => Promise.resolve(null), wait: ms => { waits.push(ms); return Promise.resolve(); } });
  await studio.start('{"action":"photo_upload"}');
  const pending = studio.start('{"action":"photo_start"}'), gate = panel.querySelector('.photo-light-start'), button = gate && gate.querySelector('button');
  assert.ok(gate); assert.ok(button); assert.equal(button.textContent, 'BẮT ĐẦU');
  button.onclick(); assert.equal(await pending, 'started'); assert.equal(panel.querySelector('.photo-light-start'), null);
  assert.equal(await studio.start('{"action":"delay","seconds":0.7}'), 'waited'); assert.deepEqual(waits, [700]);
  const cancelled = studio.start('{"action":"photo_start"}'); studio.stop(); assert.equal(await cancelled, 'cancelled');
});

await t('camera-free light board waits for start, places bulbs, clears them, and renders grid frames', async () => {
  const waits = []; const { panel, studio } = fixture(false, { wait: ms => { waits.push(ms); return Promise.resolve(); } });
  const pending = studio.start('{"action":"light_board_start"}');
  const board = panel.querySelector('.light-board-project'), button = panel.querySelector('.light-board-start')?.querySelector('button');
  assert.ok(board); assert.equal(board.querySelector('.light-board-art').src, 'assets/electronic-marquee-board.webp');
  assert.ok(button); button.onclick(); assert.equal(await pending, 'started');
  assert.equal(await studio.start('{"action":"light_board_bulb","x":25,"y":15,"color":"red"}'), 'drawn');
  assert.equal(await studio.start('{"action":"light_board_bulb","x":50,"y":15,"color":"yellow"}'), 'drawn');
  const bulbs = panel.querySelector('.light-board-bulbs'); assert.equal(bulbs.children.length, 2);
  assert.equal(bulbs.children[0].style.left, '25%'); assert.equal(bulbs.children[1].style.backgroundColor, '#f4c85a');
  assert.equal(await studio.start('{"action":"light_board_clear"}'), 'cleared'); assert.equal(bulbs.children.length, 0);
  const grid = [[0,1,0],[1,1,1]]; assert.equal(await studio.start(JSON.stringify({ action: 'light_board_grid', grid, offset: 24, color: 'cyan' })), 'drawn');
  assert.equal(panel.querySelector('.light-board-grid').children.length, 4);
  assert.equal(await studio.start('{"action":"delay","seconds":0.4}'), 'waited'); assert.ok(waits.includes(400));
  studio.stop(); assert.equal(panel.querySelector('.light-board-project'), null); assert.equal(panel.classList.contains('light-board-live'), false);
});

await t('dictionary style config reaches RitualVortex and burst emits custom symbols at the tracked anchor', async () => {
  const { panel, dispatcher, studio, calls } = fixture(); await studio.start('{}');
  studio.handle(JSON.stringify({ action: 'particle_style', color: '#9b3845', symbols: 'LINH', motion: 'comet', size: 1.2, density: .75, glow: 1.3 }));
  const opts = calls.mounts.at(-1); assert.equal(opts.theme.palette.core, '#9b3845'); assert.equal(opts.theme.glyphs, 'LINH'); assert.equal(opts.theme.motion, 'comet');
  const lm = hand(); lm[9] = { x: .25, y: .6 }; dispatcher.emit(lm); studio.handle('{"action":"particle_burst","anchor":"palm"}');
  const symbols = panel.querySelector('.studio-particles'); assert.ok(symbols); assert.equal(symbols.className, 'studio-particles motion-comet'); assert.equal(symbols.children[0].textContent, 'L'); assert.equal(symbols.children.length, 22);
  await new Promise(r => setTimeout(r, 90)); assert.deepEqual(calls.emits.at(-1), { x: .75, y: .6, n: 99 }); assert.equal(calls.bursts, 1);
});

await t('gift text uses text nodes, triggers particles, and stop tears down studio state', async () => {
  const { panel, studio, calls } = fixture(); await studio.start('{}');
  studio.handle(JSON.stringify({ action: 'gift', sender: '<b>An</b>', gift: 'Heart', symbol: 'LOVE', message: 'Thanks' }));
  const gift = panel.querySelector('.studio-gift'); assert.ok(gift); assert.equal(gift.children[1].textContent, '<b>An</b> sent Heart · Thanks');
  assert.equal(calls.emits.length, 1); studio.handle('{"action":"studio_stop"}'); assert.equal(studio.isActive, false); assert.equal(panel.querySelector('.studio-gift'), null);
});

await t('camera failure returns unavailable but keeps a centered preview usable', async () => {
  const { panel, studio, calls } = fixture(false); assert.equal(await studio.start('{"title":"Offline"}'), 'unavailable'); assert.equal(studio.cameraAvailable, false);
  studio.handle('{"action":"sticker_attach","symbol":"X","anchor":"palm","size":1}'); const sticker = panel.querySelector('.ar-sticker');
  assert.equal(sticker.style.left, '240px'); assert.equal(sticker.style.top, '180px'); assert.match(calls.lines[0], /chế độ xem trước/); studio.stop();
});

console.log(`\n${passed} passed, ${failed} failed`); if (failed) process.exit(1);
