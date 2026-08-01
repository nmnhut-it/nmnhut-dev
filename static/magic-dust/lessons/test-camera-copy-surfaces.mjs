import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { CHECKPOINT_READ_MS } from './engine/checkpoint-cell.js';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.mjs': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
let localServer = null;
let BASE = process.env.MAGIC_DUST_URL;
if (!BASE) {
  localServer = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let filename = path.resolve(repoRoot, `.${pathname}`);
      if (!filename.startsWith(repoRoot)) throw new Error('path traversal');
      if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
      const body = await readFile(filename);
      response.writeHead(200, {
        'Content-Type': types[path.extname(filename).toLowerCase()] || 'application/octet-stream',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'credentialless',
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((resolve, reject) => {
    localServer.once('error', reject);
    localServer.listen(0, '127.0.0.1', resolve);
  });
  BASE = `http://127.0.0.1:${localServer.address().port}`;
}
const browser = await chromium.launch();
const watchdog = setTimeout(() => {
  console.error('camera-copy surface test exceeded 60 seconds');
  process.exit(1);
}, 60_000);

const hasSurface = value => value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)';

async function open(path) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.setDefaultTimeout(15_000);
  await page.addInitScript(() => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', '26');
  });
  await page.goto(`${BASE}/lessons/${path}`, { waitUntil: 'domcontentloaded' });
  return page;
}

async function backgrounds(page, selectors) {
  return page.evaluate(items => Object.fromEntries(items.map(selector => {
    const element = document.querySelector(selector);
    return [selector, element ? getComputedStyle(element).backgroundColor : null];
  })), selectors);
}

try {
  assert.equal(CHECKPOINT_READ_MS, 10_000, 'checkpoint must reserve ten seconds for reading');

  console.log('checking checkpoint reading gate');
  const checkpoint = await open('dev-test.html?src=node10v2&only=checkpoint');
  await checkpoint.waitForSelector('.checkpointcell:not(.veiled)');
  const activeCheckpoint = checkpoint.locator('.checkpointcell:not(.veiled)').first();
  const highFive = activeCheckpoint.locator('.ckholdbtn');
  assert.equal(await highFive.isDisabled(), true, 'High Five starts locked');
  assert.equal(await activeCheckpoint.locator('.bcam').evaluate(el => el.classList.contains('on')), false, 'camera stays off while the learner reads');
  await checkpoint.waitForTimeout(8_000);
  assert.equal(await highFive.isDisabled(), true, 'High Five cannot finish before the reading beat');
  await checkpoint.waitForFunction(() => !document.querySelector('.checkpointcell:not(.veiled) .ckholdbtn').disabled, null, { timeout: 3_000 });
  await checkpoint.close();

  const cases = [
    ['dev-test.html?src=node00&only=widget', ['.anatomy .part', '.anatomy .caption']],
    ['dev-test.html?src=node07v2&only=forge', ['.forgehead', '.forgeexplain', '.forgestat', '.forgehint']],
    ['dev-test.html?src=node10v2', ['.quizcell .qq', '.quizcell .qhint', '.quizcell .qopt']],
  ];
  for (const [path, selectors] of cases) {
    console.log(`checking camera-copy surfaces: ${path}`);
    const page = await open(path);
    await page.waitForSelector(selectors[0], { state: 'attached' });
    const colors = await backgrounds(page, selectors);
    for (const selector of selectors) assert.ok(hasSurface(colors[selector]), `${selector} needs a stable surface over camera; got ${colors[selector]}`);
    await page.close();
  }

  console.log('camera-copy surfaces and 10-second checkpoint reading gate passed');
} finally {
  clearTimeout(watchdog);
  await browser.close();
  if (localServer) await new Promise(resolve => localServer.close(resolve));
}
