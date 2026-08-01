// Requires `python serve.py 8123` and Playwright Chromium.
import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const browser = await chromium.launch({ headless: true });
let passed = 0;
try {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const pageErrors = []; page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(`${BASE}/lessons/lesson21v2.html?noentry`, { waitUntil: 'domcontentloaded' });
    const report = await page.evaluate(async () => {
      const { InteractiveStudio } = await import('./engine/interactive-studio.js');
      const { walkthroughCell } = await import('./engine/walkthrough-cell.js');
      const panel = document.createElement('div'); panel.id = 'scenepanel'; panel.style.width = 'min(480px, calc(100vw - 20px))';
      panel.innerHTML = '<video id="cam"></video><div id="scstat"></div>'; document.body.appendChild(panel);
      let observer = null;
      const dispatcher = { onLandmarks(fn) { observer = fn; return () => observer = null; } };
      const camera = { ensure: () => Promise.reject(new Error('browser test has no camera')) };
      const factory = { mount(host) { const canvas = document.createElement('canvas'); canvas.id = 'rvortex'; canvas.width = host.clientWidth; canvas.height = host.clientHeight;
        const ctx = canvas.getContext('2d'); host.appendChild(canvas); return {
          emit(x, y) { ctx.fillStyle = '#9b3845'; ctx.fillRect(x * canvas.width - 8, y * canvas.height - 8, 16, 16); },
          burst() { ctx.fillStyle = '#fffdf5'; ctx.fillRect(canvas.width / 2 - 4, canvas.height / 2 - 4, 8, 8); }, stop() { canvas.remove(); },
        }; } };
      const studio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory });
      const start = await studio.start('{"action":"studio_start","title":"Linh Live"}');
      studio.handle('{"action":"particle_style","color":"#9b3845","symbols":"LINH","motion":"comet","size":1.2,"density":0.8,"glow":1.2}');
      studio.handle('{"action":"sticker_attach","symbol":"STAR","anchor":"index_tip","size":1.2}');
      const lm = Array.from({ length: 21 }, () => ({ x: .5, y: .5 })); lm[8] = { x: .2, y: .3 }; observer(lm, true, 1);
      const hand = JSON.parse(await studio.readHandPosition('{"action":"hand_position","anchor":"index_tip"}'));
      studio.handle('{"action":"sticker_at","symbol":"PIN","x":25,"y":75,"size":1}');
      const firstFrame = [{ x: 10, y: 20, symbol: 'A', color: '#9b3845', size: 1 }]; studio.drawParticleFrame(JSON.stringify({ action: 'particle_frame', particles: firstFrame }));
      const beforeMove = panel.querySelector('.studio-particle-frame i').style.left;
      const moved = Array.from({ length: 140 }, (_, i) => ({ x: i === 0 ? 80 : i, y: i === 0 ? 60 : 20, symbol: '.', color: i === 0 ? 'rgb(255,120,40)' : '#78b2a5', size: 1 }));
      studio.drawParticleFrame(JSON.stringify({ action: 'particle_frame', particles: moved, guide: { action: 'UPDATE', title: 'Một hạt đang rơi', formula: 'y = y + vy', fields: [{ label: 'y', value: '20 → 28' }], caption: 'Dữ liệu đổi trước khi frame mới được vẽ.' } }));
      const particleFrame = panel.querySelector('.studio-particle-frame'), afterMove = particleFrame.children[0].style.left,
        afterColor = particleFrame.children[0].style.color, particleCount = particleFrame.querySelectorAll(':scope > i').length,
        particleGuide = particleFrame.querySelector('.studio-particle-guide').textContent;
      const imageStatus = studio.presentImageFrame(JSON.stringify({ action: 'image_frame', image: [
        [[255, 0, 17], [0, 128, 255, 64]],
        [[300, -5, 12, 999], [0, 0, 0, 0]],
      ] }));
      studio.handle('{"action":"gift","sender":"An","gift":"Heart","symbol":"LOVE","message":"Thanks"}');
      studio.handle('{"action":"particle_burst","anchor":"index_tip"}'); await new Promise(r => setTimeout(r, 90));
      const sticker = panel.querySelector('.ar-sticker'), staticSticker = panel.querySelector('.studio-static-sticker'), imageCanvas = panel.querySelector('.studio-image-frame'), gift = panel.querySelector('.studio-gift'), canvas = panel.querySelector('#rvortex');
      const pr = panel.getBoundingClientRect(), sr = sticker.getBoundingClientRect(), xr = staticSticker.getBoundingClientRect();
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      const framebuffer = [...imageCanvas.getContext('2d').getImageData(0, 0, 2, 2).data];
      const result = { start, hand, sticker: sticker.textContent, gift: gift.textContent,
        inside: sr.left >= pr.left && sr.right <= pr.right && sr.top >= pr.top && sr.bottom <= pr.bottom,
        explicit: Math.abs((xr.left + xr.width / 2 - pr.left) / pr.width * 100 - 25) < 1 && Math.abs((xr.top + xr.height / 2 - pr.top) / pr.height * 100 - 75) < 1,
        beforeMove, afterMove, afterColor, particleCount, particleGuide, imageStatus, framebuffer, pixelated: imageCanvas.style.imageRendering === 'pixelated', nonblank: pixels.some(v => v !== 0) && framebuffer.some(v => v !== 0) };
      studio.handle('{"action":"studio_frame_clear"}'); result.frameCleared = !panel.querySelector('.studio-static-sticker') && !panel.querySelector('.studio-particle-frame') && !panel.querySelector('.studio-image-frame');
      studio.stop(); result.cleaned = !panel.querySelector('.ar-sticker') && !panel.querySelector('.studio-gift') && !panel.querySelector('#rvortex');
      result.particleStageStart = await studio.start('{"action":"particle_stage_start","title":"Particle Lab"}');
      studio.drawParticleFrame(JSON.stringify({ action: 'particle_frame', particles: [{ x: 25, y: 60, symbol: 'STAR', color: '#7ce7ff', size: 2, alpha: 128 }] }));
      const stageParticle = panel.querySelector('.studio-particle-frame i');
      result.particleStage = { camera: studio.cameraAvailable, left: stageParticle.style.left, top: stageParticle.style.top,
        fontSize: stageParticle.style.fontSize, opacity: stageParticle.style.opacity, symbol: stageParticle.textContent };
      studio.stop();
      const photoWaits = []; const photoStudio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory,
        pickPhoto: () => Promise.resolve('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="cyan"/></svg>'), wait: ms => { photoWaits.push(ms); return Promise.resolve(); } });
      result.photoUpload = await photoStudio.start('{"action":"photo_upload"}');
      const startPending = photoStudio.start('{"action":"photo_start"}'), startButton = panel.querySelector('.photo-light-start button');
      const panelRect = panel.getBoundingClientRect(), startRect = startButton.getBoundingClientRect();
      result.startButtonText = startButton.textContent; result.startButtonCentered = Math.abs(startRect.left + startRect.width / 2 - (panelRect.left + panelRect.width / 2)) < 2 && Math.abs(startRect.top + startRect.height / 2 - (panelRect.top + panelRect.height / 2)) < 2;
      startButton.click(); result.photoStarted = await startPending; result.photoDelay = await photoStudio.start('{"action":"delay","seconds":0.7}'); result.photoDelayMs = photoWaits[0];
      await photoStudio.start('{"action":"photo_light","index":0,"color":"green"}'); await photoStudio.start('{"action":"photo_light","index":1,"color":"red"}');
      await photoStudio.start('{"action":"photo_lights","colors":["green","red","yellow"],"mode":"shift","step":2}');
      const photo = panel.querySelector('.photo-light-picture'), lamps = panel.querySelector('.photo-light-ring');
      result.photoVisible = !!photo && photo.src.startsWith('data:image/svg+xml'); result.lampCount = lamps.children.length; result.firstLamp = lamps.children[0].style.backgroundColor;
      photoStudio.stop(); result.photoCleaned = !panel.querySelector('.photo-light-project');
      const imageGridStudio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory });
      const sampleGrid = JSON.parse(await imageGridStudio.start('{"action":"image_sample_grid","size":16}'));
      const brightness = pixel => Math.floor((pixel[0] + pixel[1] + pixel[2]) / 3);
      result.sampleGrid = { rows: sampleGrid.length, cols: sampleGrid[0].length, channels: sampleGrid[0][0].length,
        cornerBrightness: brightness(sampleGrid[0][0]), subjectBrightness: brightness(sampleGrid[7][8]), visible: !!panel.querySelector('.photo-light-picture') };
      imageGridStudio.stop();
      const boardStudio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory, wait: () => Promise.resolve() });
      const boardPending = boardStudio.start('{"action":"light_board_start"}'), boardButton = panel.querySelector('.light-board-start button');
      const screenRect = panel.querySelector('.light-board-grid').getBoundingClientRect(), boardButtonRect = boardButton.getBoundingClientRect();
      result.boardStartCentered = Math.abs(boardButtonRect.left + boardButtonRect.width / 2 - (screenRect.left + screenRect.width / 2)) < 2
        && Math.abs(boardButtonRect.top + boardButtonRect.height / 2 - (screenRect.top + screenRect.height / 2)) < 2;
      boardButton.click(); result.boardStarted = await boardPending;
      for (const [x, color] of [[25, 'red'], [50, 'yellow'], [75, 'green']]) await boardStudio.start(JSON.stringify({ action: 'light_board_bulb', x, y: 15, color }));
      result.boardBulbs = [...panel.querySelectorAll('.light-board-bulb')].map(bulb => ({ left: bulb.style.left, visible: bulb.getBoundingClientRect().width > 0 }));
      await boardStudio.start('{"action":"light_board_clear"}'); result.boardCleared = !panel.querySelector('.light-board-bulb');
      const codeGrid = [[0,1,1,0,1,1,1,0,1,1,0,0,1,1,1],[1,0,0,0,1,0,1,0,1,0,1,0,1,0,0],[1,0,0,0,1,0,1,0,1,0,1,0,1,1,0],[1,0,0,0,1,0,1,0,1,0,1,0,1,0,0],[0,1,1,0,1,1,1,0,1,1,0,0,1,1,1]];
      result.boardFrames = [];
      for (let offset = 0; offset < 39; offset++) {
        await boardStudio.start(JSON.stringify({ action: 'light_board_grid', grid: codeGrid, offset, color: 'cyan' }));
        const framePixels = [...panel.querySelectorAll('.light-board-grid i')];
        result.boardFrames.push({ offset, pixels: framePixels.length, visible: framePixels.every(pixel => { const rect = pixel.getBoundingClientRect(); return rect.width > 0 && rect.height > 0; }) });
      }
      boardStudio.stop(); result.boardCleaned = !panel.querySelector('.light-board-project');
      let walkthroughDone = false;
      const walkthroughStudio = new InteractiveStudio(panel, { cameraEngine: camera, gestureDispatcher: dispatcher, loadVortex: () => Promise.resolve(), getVortex: () => factory, wait: () => Promise.resolve() });
      const walkthrough = walkthroughCell({ walkthrough: {
        title: 'Từng dòng', intro: 'Chỉ chạy một dòng.', code: ['prepare()', 'start_board()', 'place_bulb(50, 20, "yellow")'],
        steps: [
          { line: 1, explain: 'Dòng này chỉ chuẩn bị.', memory: 'Đã chuẩn bị.' },
          { line: 2, explain: 'Dòng này mở bảng.', action: { action: 'light_board_start' }, memory: 'Đã mở.' },
          { line: 3, explain: 'Dòng này lắp một bóng.', action: { action: 'light_board_bulb', x: 50, y: 20, color: 'yellow' }, memory: 'Có một bóng.' },
        ],
      } }, { studio: walkthroughStudio, scenePanel: panel, completeCell: () => { walkthroughDone = true; } });
      document.body.appendChild(walkthrough); const walkButton = walkthrough.querySelector('.wtcontrols button');
      const walkRect = walkthrough.querySelector('.wtlayout').getBoundingClientRect();
      result.walkColumns = getComputedStyle(walkthrough.querySelector('.wtlayout')).gridTemplateColumns.split(' ').length;
      result.walkFits = walkRect.left >= 0 && walkRect.right <= innerWidth + 1;
      walkButton.click(); await new Promise(resolve => setTimeout(resolve, 5));
      result.walkFirstMemory = walkthrough.querySelector('.wtmemory').textContent;
      walkButton.click(); await new Promise(resolve => setTimeout(resolve, 5)); panel.querySelector('.light-board-start button').click(); await new Promise(resolve => setTimeout(resolve, 5));
      walkButton.click(); await new Promise(resolve => setTimeout(resolve, 30));
      result.walkBulbs = panel.querySelectorAll('.light-board-bulb').length; result.walkActiveLine = walkthrough.querySelector('.wtline.active').dataset.line;
      walkButton.click(); result.walkDone = walkthroughDone;
      walkthroughStudio.stop(); walkthrough.remove(); panel.remove(); return result;
    });
    assert.equal(report.start, 'unavailable'); assert.equal(report.sticker, 'STAR'); assert.match(report.gift, /An sent Heart/);
    assert.deepEqual(report.hand, { visible: true, x: 80, y: 30 }); assert.equal(report.inside, true); assert.equal(report.explicit, true);
    assert.equal(report.beforeMove, '10%'); assert.equal(report.afterMove, '80%'); assert.equal(report.afterColor, 'rgb(255, 120, 40)'); assert.equal(report.particleCount, 120); assert.match(report.particleGuide, /UPDATE.*Một hạt đang rơi.*y = y \+ vy.*20 → 28/); assert.equal(report.frameCleared, true);
    assert.equal(report.imageStatus, 'drawn'); assert.equal(report.pixelated, true);
    assert.deepEqual(report.framebuffer, [255, 0, 17, 255, 0, 128, 255, 64, 255, 0, 12, 255, 0, 0, 0, 0]);
    assert.equal(report.nonblank, true); assert.equal(report.cleaned, true); assert.equal(report.photoUpload, 'uploaded'); assert.equal(report.photoVisible, true);
    assert.equal(report.particleStageStart, 'started'); assert.deepEqual({ ...report.particleStage, opacity: undefined }, { camera: false, left: '25%', top: '60%', fontSize: '28px', opacity: undefined, symbol: 'STAR' });
    assert.ok(Math.abs(Number(report.particleStage.opacity) - 128 / 255) < 0.000001);
    assert.equal(report.startButtonText, 'BẮT ĐẦU'); assert.equal(report.startButtonCentered, true); assert.equal(report.photoStarted, 'started'); assert.equal(report.photoDelay, 'waited'); assert.equal(report.photoDelayMs, 700);
    assert.equal(report.lampCount, 28); assert.ok(['#f4c85a', 'rgb(244, 200, 90)'].includes(report.firstLamp)); assert.equal(report.photoCleaned, true);
    assert.deepEqual({ rows: report.sampleGrid.rows, cols: report.sampleGrid.cols, channels: report.sampleGrid.channels, visible: report.sampleGrid.visible }, { rows: 16, cols: 16, channels: 3, visible: true });
    assert.ok(report.sampleGrid.cornerBrightness < 128); assert.ok(report.sampleGrid.subjectBrightness >= 128);
    assert.equal(report.boardStartCentered, true); assert.equal(report.boardStarted, 'started'); assert.equal(report.boardCleared, true); assert.equal(report.boardCleaned, true);
    assert.deepEqual(report.boardBulbs.map(bulb => bulb.left), ['25%', '50%', '75%']); assert.ok(report.boardBulbs.every(bulb => bulb.visible));
    assert.deepEqual(report.boardFrames.map(frame => frame.offset), Array.from({ length: 39 }, (_, i) => i)); assert.ok(report.boardFrames.some(frame => frame.pixels > 0));
    assert.ok(report.boardFrames.filter(frame => frame.pixels > 0).every(frame => frame.visible));
    assert.equal(report.walkFirstMemory, 'Đã chuẩn bị.'); assert.equal(report.walkBulbs, 1); assert.equal(report.walkActiveLine, '3'); assert.equal(report.walkDone, true); assert.equal(report.walkFits, true);
    assert.equal(report.walkColumns, viewport.width > 780 ? 2 : 1); passed++;
    assert.deepEqual(pageErrors, []);
    console.log(`  ok — studio browser render ${viewport.width}x${viewport.height}`); await page.close();
  }
} finally { await browser.close(); }
console.log(`\n${passed} passed, 0 failed`);
