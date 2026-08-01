import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const browser = await chromium.launch({ headless: true });

function layout(page) {
  return page.evaluate(() => {
    const cell = document.querySelector('.codecell');
    const editor = cell.querySelector('.ced').getBoundingClientRect();
    const output = cell.querySelector('.coutput').getBoundingClientRect();
    return {
      cellWidth: cell.getBoundingClientRect().width,
      sideBySide: output.left >= editor.right - 1 && Math.abs(output.top - editor.top) < 1,
      stacked: output.top >= editor.bottom - 1,
      overflow: document.documentElement.scrollWidth - innerWidth,
      emptyCopy: getComputedStyle(cell.querySelector('.cout'), '::before').content,
    };
  });
}

async function waitForCodeCell(page) {
  await page.waitForFunction(() => {
    const cell = document.querySelector('.codecell');
    return window.nodeDev && cell?._editor && !cell.querySelector('.crun').disabled;
  }, null, { timeout: 60_000 });
}

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(`${BASE}/lessons/dev-test.html?src=node25&only=code:project_emitter_demo.py`, { waitUntil: 'domcontentloaded' });
  await waitForCodeCell(page);
  const desktop = await layout(page);
  assert.equal(desktop.sideBySide, true);
  assert.equal(desktop.overflow, 0);
  assert.match(desktop.emptyCopy, /Kết quả và hình ảnh/);

  await page.locator('.crun').click({ force: true });
  await page.waitForFunction(() => document.querySelector('.codecell.done'), null, { timeout: 30_000 });
  assert.match(await page.locator('.cout').innerText(), /5\s+-4\s+0\s+4/);

  await page.setViewportSize({ width: 1024, height: 640 });
  const laptop = await layout(page);
  assert.equal(laptop.sideBySide, true);
  assert.equal(laptop.overflow, 0);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await layout(page);
  assert.equal(mobile.stacked, true);
  assert.equal(mobile.overflow, 0);

  await page.setViewportSize({ width: 1024, height: 640 });
  await page.goto(`${BASE}/lessons/dev-test.html?src=node25&only=code:project_rasterizer_demo.py`, { waitUntil: 'domcontentloaded' });
  await waitForCodeCell(page);
  await page.locator('.crun').click({ force: true });
  await page.waitForFunction(() => document.querySelector('.studio-image-frame') && document.querySelector('.codecell.done'), null, { timeout: 30_000 });
  const visual = await page.evaluate(() => {
    const output = document.querySelector('.coutput').getBoundingClientRect();
    const terminal = document.querySelector('.cout');
    const canvas = document.querySelector('.studio-image-frame').getBoundingClientRect();
    return {
      contained: canvas.left >= output.left && canvas.right <= output.right + 1 && canvas.top >= output.top && canvas.bottom <= output.bottom + 1,
      noOutputScroll: terminal.scrollHeight <= terminal.clientHeight + 1,
      visible: canvas.top >= 0 && canvas.bottom <= innerHeight,
    };
  });
  assert.deepEqual(visual, { contained: true, noOutputScroll: true, visible: true });
  assert.deepEqual(errors, []);
  await page.close();
} finally {
  await browser.close();
}

console.log('code cell IDE layout: ok');
