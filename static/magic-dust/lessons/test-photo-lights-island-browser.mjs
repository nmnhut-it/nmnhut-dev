// Requires `python serve.py 8123` and Playwright Chromium.
// Runs real camera-free light-board cells through Python/Pyodide and checks every visible frame.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from './node_modules/playwright/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const CAPTURE_DIR = process.env.PHOTO_LIGHT_CAPTURE_DIR || '';
if (CAPTURE_DIR) await mkdir(CAPTURE_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const pageErrors = []; const consoleErrors = [];
page.on('pageerror', error => pageErrors.push(error.stack || error.message));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: `
  (() => {
    window.monaco = {
      KeyMod: { Shift: 1 }, KeyCode: { Enter: 2 }, editor: {
        defineTheme() {}, create(_host, options) { let value = options.value; const listeners = []; return {
          getValue: () => value, setValue(next) { value = String(next); listeners.forEach(fn => fn()); },
          getModel: () => ({ getLineCount: () => value.split('\\n').length }),
          onDidChangeModelContent(fn) { listeners.push(fn); return { dispose() {} }; }, addCommand() {}, layout() {},
        }; },
      },
    };
    const amd = (_deps, callback) => queueMicrotask(callback); amd.config = () => {}; window.require = amd;
  })();
` }));

async function openCell(label) {
  await page.evaluate(target => window.nodeDev.toCell(target), label);
  try {
    await page.waitForFunction(target => {
      const cell = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
      const button = cell?.querySelector('.crun');
      return !!(cell?._editor && button && !button.disabled);
    }, label, { timeout: 30_000 });
  } catch (error) {
    const state = await page.evaluate(target => { const cell = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target)), button = cell?.querySelector('.crun'); return {
      cell: !!cell, editor: !!cell?._editor, disabled: button?.disabled, python: document.querySelector('#pystat')?.textContent,
      text: document.body.innerText.slice(0, 700),
    }; }, label);
    throw new Error(`Cell ${label} did not become runnable: ${JSON.stringify({ state, pageErrors, consoleErrors })}`, { cause: error });
  }
  return page.locator('.codecell').filter({ hasText: label }).first();
}

async function clickRunAndStart(cell) {
  const run = cell.locator('.crun'); await run.click({ force: true });
  const start = page.locator('.light-board-start button'); await start.waitFor({ state: 'visible', timeout: 20_000 });
  assert.equal((await start.textContent()).trim(), 'BẮT ĐẦU');
  assert.ok(await run.evaluate(button => button.classList.contains('is-stop')), 'Python must wait at the learner start gate');
  assert.equal(await page.locator('.light-board-bulb').count(), 0, 'no bulb may appear before BẮT ĐẦU');
  const centered = await page.evaluate(() => {
    const screen = document.querySelector('.light-board-grid').getBoundingClientRect();
    const button = document.querySelector('.light-board-start button').getBoundingClientRect();
    return Math.abs(button.left + button.width / 2 - (screen.left + screen.width / 2)) < 5
      && Math.abs(button.top + button.height / 2 - (screen.top + screen.height / 2)) < 5;
  });
  assert.equal(centered, true, 'BẮT ĐẦU must be centered over the board screen');
  return { run, start };
}

try {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${BASE}/lessons/islandPHOTOLIGHTS.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.nodeDev?.toCell, null, { timeout: 10_000 });

  const bulbCell = await openCell('ba_bong_dau_tien.py');
  const first = await clickRunAndStart(bulbCell);
  const art = page.locator('.light-board-art');
  await art.waitFor({ state: 'visible' });
  assert.ok(await art.evaluate(img => img.complete && img.naturalWidth > 0), 'generated board artwork must load');
  if (CAPTURE_DIR) await bulbCell.screenshot({ path: path.join(CAPTURE_DIR, '00-start.png') });
  await page.evaluate(() => {
    window.__bulbFrames = [];
    window.__bulbObserver = new MutationObserver(() => {
      const bulbs = [...document.querySelectorAll('.light-board-bulb')];
      if (bulbs.length <= window.__bulbFrames.length) return;
      const bulb = bulbs.at(-1), style = getComputedStyle(bulb), rect = bulb.getBoundingClientRect();
      window.__bulbFrames.push({ count: bulbs.length, left: bulb.style.left, color: style.backgroundColor, visible: rect.width > 0 && rect.height > 0, at: performance.now() });
    });
    window.__bulbObserver.observe(document.querySelector('.light-board-bulbs'), { childList: true });
  });
  await first.start.click();
  for (let frame = 1; frame <= 3; frame++) {
    await page.waitForFunction(n => window.__bulbFrames?.length >= n, frame, { timeout: 4_000 });
    if (CAPTURE_DIR) await bulbCell.screenshot({ path: path.join(CAPTURE_DIR, `0${frame}-bulb.png`) });
  }
  await page.waitForFunction(target => [...document.querySelectorAll('.codecell')].some(cell => cell.textContent.includes(target) && cell.classList.contains('done')), 'ba_bong_dau_tien.py', { timeout: 10_000 });
  const bulbFrames = await page.evaluate(() => { window.__bulbObserver.disconnect(); return window.__bulbFrames; });
  assert.deepEqual(bulbFrames.map(({ count, left, color }) => ({ count, left, color })), [
    { count: 1, left: '25%', color: '#9b3845' },
    { count: 2, left: '50%', color: '#f4c85a' },
    { count: 3, left: '75%', color: '#78b2a5' },
  ]);
  assert.ok(bulbFrames.every(frame => frame.visible), 'every bulb frame must be visible');
  assert.ok(bulbFrames[1].at - bulbFrames[0].at >= 500 && bulbFrames[2].at - bulbFrames[1].at >= 500, 'delay must keep each installation frame visible');

  const gridCell = await openCell('chu_chay_demo.py');
  const second = await clickRunAndStart(gridCell);
  await page.evaluate(() => {
    window.__gridFrames = [];
    window.__gridObserver = new MutationObserver(() => {
      const stat = document.querySelector('#scstat')?.textContent || '';
      const match = stat.match(/FRAME\s+(\d+)/); if (!match) return;
      const offset = Number(match[1]); if (window.__gridFrames.at(-1)?.offset === offset) return;
      const pixels = [...document.querySelectorAll('.light-board-grid i')];
      window.__gridFrames.push({ offset, pixels: pixels.length, visible: pixels.every(pixel => { const r = pixel.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) });
    });
    window.__gridObserver.observe(document.querySelector('#scenepanel'), { childList: true, subtree: true, characterData: true });
  });
  await second.start.click();
  const expectedFrames = 39;
  try {
    await page.waitForFunction(n => window.__gridFrames?.length >= n, expectedFrames, { timeout: 15_000 });
  } catch (error) {
    const state = await page.evaluate(() => ({ frames: window.__gridFrames, stat: document.querySelector('#scstat')?.textContent,
      output: [...document.querySelectorAll('.codecell')].find(cell => cell.textContent.includes('chu_chay_demo.py'))?.innerText.slice(-1200) }));
    throw new Error(`Scrolling grid stopped before all frames: ${JSON.stringify(state)}`, { cause: error });
  }
  await page.waitForFunction(target => [...document.querySelectorAll('.codecell')].some(cell => cell.textContent.includes(target) && cell.classList.contains('done')), 'chu_chay_demo.py', { timeout: 15_000 });
  if (CAPTURE_DIR) await gridCell.screenshot({ path: path.join(CAPTURE_DIR, '04-grid-final.png') });
  const gridFrames = await page.evaluate(() => { window.__gridObserver.disconnect(); return window.__gridFrames; });
  assert.equal(gridFrames.length, expectedFrames, `expected every scrolling frame, got ${gridFrames.length}`);
  assert.deepEqual(gridFrames.map(frame => frame.offset), Array.from({ length: expectedFrames }, (_, i) => i));
  assert.ok(gridFrames.some(frame => frame.pixels > 0), 'scrolling text must produce lit grid pixels');
  assert.ok(gridFrames.filter(frame => frame.pixels > 0).every(frame => frame.visible), 'every lit grid pixel must occupy visible screen space');
  assert.deepEqual(pageErrors, []);
  assert.ok(!consoleErrors.some(line => /uncaught|syntaxerror|traceback/i.test(line)), consoleErrors.join('\n'));
  console.log('  ok — real island showed 3 timed bulb frames and all 39 scrolling-grid frames without a camera');
} finally {
  await browser.close();
}
