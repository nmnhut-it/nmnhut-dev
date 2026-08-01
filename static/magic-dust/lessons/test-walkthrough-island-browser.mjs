import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const captureDir = process.env.WALKTHROUGH_CAPTURE_DIR || '';
if (captureDir) await mkdir(captureDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = []; page.on('pageerror', error => errors.push(error.message));

await page.route('https://cdn.jsdelivr.net/pyodide/**', route => route.fulfill({ contentType: 'application/javascript', body: `
  self.loadPyodide = async () => ({ FS: { writeFile() {} }, runPythonAsync: async () => {} });
` }));
await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: `
  (() => { window.monaco = { KeyMod:{Shift:1}, KeyCode:{Enter:2}, editor:{ defineTheme(){}, create(_h,o){ let value=o.value; return { getValue:()=>value,setValue:v=>value=String(v),getModel:()=>({getLineCount:()=>value.split('\\n').length}),onDidChangeModelContent:()=>({dispose(){}}),addCommand(){},layout(){} }; } } };
  const amd=(_d,cb)=>queueMicrotask(cb); amd.config=()=>{}; window.require=amd; })();
` }));

try {
  await page.addInitScript(() => {
    localStorage.clear(); window.__cameraCalls = 0;
    if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = async () => { window.__cameraCalls++; throw new Error('camera must not be requested'); };
  });
  await page.goto(`${BASE}/lessons/islandPHOTOLIGHTS.html?v=walkthrough-test`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.nodeDev?.toCell);
  await page.evaluate(() => window.nodeDev.toCell('walk_mot_bong'));
  const first = page.locator('.walkthrough').filter({ hasText: 'BƯỚC 1 — MỘT DÒNG TẠO MỘT BÓNG' });
  await first.waitFor({ state: 'visible', timeout: 10_000 });
  assert.equal(await first.locator('.wtline.active').getAttribute('data-line'), '1');
  assert.equal((await first.locator('.wtlayout').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)), 2);
  const next = first.locator('.wtcontrols button');
  await next.click();
  assert.match(await first.locator('.wtmemory').textContent(), /start_board/);
  assert.equal(await first.locator('.wtline.active').getAttribute('data-line'), '2');
  await next.click();
  const start = page.locator('.light-board-start button'); await start.waitFor({ state: 'visible' });
  assert.equal(await next.isDisabled(), true, 'next line must stay locked while the board waits for BẮT ĐẦU');
  if (captureDir) await first.screenshot({ path: path.join(captureDir, '01-waiting-start.png') });
  await start.click(); await page.waitForFunction(() => !document.querySelector('.walkthrough .wtcontrols button').disabled);
  assert.equal(await first.locator('.wtline.active').getAttribute('data-line'), '3');
  const startedAt = Date.now(); await next.click();
  assert.equal(await next.isDisabled(), true, 'observation pause must lock the next button');
  await page.waitForFunction(() => document.querySelectorAll('.light-board-bulb').length === 1);
  if (captureDir) await first.screenshot({ path: path.join(captureDir, '02-one-bulb.png') });
  await page.waitForFunction(() => !document.querySelector('.walkthrough .wtcontrols button').disabled, null, { timeout: 4_000 });
  assert.ok(Date.now() - startedAt >= 1450, 'the learner must receive real observation time');
  assert.match(await first.locator('.wtmemory').textContent(), /x = 35, y = 50/);
  await next.click(); assert.ok(await first.evaluate(el => el.classList.contains('done')));

  await page.evaluate(() => window.nodeDev.toCell('walk_ba_bong'));
  const second = page.locator('.walkthrough').filter({ hasText: 'BƯỚC 2 — THÊM MỘT BÓNG' }); await second.waitFor({ state: 'visible' });
  assert.equal(await second.locator('.wtline').count(), 4); assert.equal(await second.locator('.wtline.executed').count(), 3);
  assert.equal(await second.locator('.wtline.active').getAttribute('data-line'), '4'); assert.match(await second.locator('.wtside-title small').textContent(), /cell trước/);
  if (captureDir) await second.screenshot({ path: path.join(captureDir, '03-next-cell-keeps-code.png') });
  const secondNext = second.locator('.wtcontrols button'); await secondNext.click(); await page.waitForFunction(() => document.querySelectorAll('.light-board-bulb').length === 2);
  await page.waitForFunction(el => !el.querySelector('.wtcontrols button').disabled, await second.elementHandle(), { timeout: 4_000 }); await secondNext.click();

  await page.evaluate(() => window.nodeDev.toCell('walk_for_positions'));
  const loop = page.locator('.walkthrough').filter({ hasText: 'BƯỚC 3 — FOR LẤY TỪNG VỊ TRÍ' });
  await loop.waitFor({ state: 'visible' }); const loopNext = loop.locator('.wtcontrols button');
  const moments = [];
  for (let i = 0; i < 11; i++) {
    const beforeLine = await loop.locator('.wtline.active').getAttribute('data-line');
    await loopNext.click();
    await page.waitForFunction(el => !el.querySelector('.wtcontrols button').disabled, await loop.elementHandle(), { timeout: 4_000 });
    moments.push({ line: beforeLine, bulbs: await page.locator('.light-board-bulb').count(), memory: await loop.locator('.wtmemory').textContent() });
  }
  assert.deepEqual(moments.filter(moment => moment.line === '6').map(moment => moment.bulbs), [1, 2, 3, 4, 5, 6]);
  assert.ok(moments.some(moment => moment.line === '5' && /x = 30/.test(moment.memory)), 'Pip must expose the changing loop variable');
  if (captureDir) await loop.screenshot({ path: path.join(captureDir, '04-for-six-bulbs.png') });
  assert.deepEqual(errors, []);
  assert.equal(await page.evaluate(() => window.__cameraCalls), 0, 'Photo Lights must never request camera access');
  console.log('  ok — actual island locks each line, waits for observation, and narrates all six for-loop iterations');
} finally {
  await browser.close();
}
