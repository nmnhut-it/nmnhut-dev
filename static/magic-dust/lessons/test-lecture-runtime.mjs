import assert from 'node:assert';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { LECTURES } from './content/lecture-manifest.js';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
assert.strictEqual(LECTURES.length, 85, 'manifest must cover 26 main nodes and 59 Saga locations');
assert.strictEqual(new Set(LECTURES.map(item => item.id)).size, LECTURES.length, 'lecture ids must be unique');
const sagaSource = readFileSync(join(root, 'saga.js'), 'utf8');
const nodeIds = Array.from({ length:26 }, (_, index) => `node${String(index).padStart(2, '0')}`);
const sideBlock = sagaSource.slice(sagaSource.indexOf('const SIDE_ISLANDS'), sagaSource.indexOf('function sideDone'));
const sideIds = [...sideBlock.matchAll(/\{ id: '([^']+)'/g)].map(match => match[1]);
assert.strictEqual(sideIds.length, 59, 'Saga side-location inventory changed; update lecture coverage deliberately');
assert.deepStrictEqual(new Set(LECTURES.map(item => item.id)), new Set([...nodeIds, ...sideIds]), 'every Saga location must have exactly one lecture');
for (const lecture of LECTURES) {
  assert(lecture.id && lecture.title && lecture.practicePage && lecture.objective, `${lecture.id || 'unknown'} is missing required metadata`);
  assert(lecture.given && lecture.machineDoes && lecture.learnerDoes && lecture.output, `${lecture.id} must state GIVEN, machine work, learner work and OUTPUT`);
  assert(lecture.slides.length >= 6, `${lecture.id} needs at least six teaching slides`);
  const path = lecture.practicePage.split('?')[0];
  assert(existsSync(join(root, path)), `${lecture.id} practice route does not exist: ${path}`);
}

const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.webp':'image/webp', '.png':'image/png' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname);
  const full = normalize(join(root, pathname === '/' ? 'lecture.html' : pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': mime[extname(full)] || 'application/octet-stream' });
  createReadStream(full).pipe(res);
});
await new Promise(done => server.listen(0, '127.0.0.1', done));

const browser = await chromium.launch();
try {
  for (const viewport of [{ width:1280, height:720 }, { width:390, height:844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/lecture.html?id=islandFINGERTIPS`, { waitUntil:'networkidle' });
    try {
      await page.waitForFunction(() => window.magicDustLecture?.deck?.isReady?.(), null, { timeout:10000 });
    } catch (error) {
      throw new Error(`lecture did not boot: ${errors.join(' | ') || await page.locator('#lectureError').textContent()}`);
    }
    assert((await page.locator('.reveal .slides section').count()) >= 8);
    assert((await page.locator('.visual-grid').count()) >= 1, 'reference deck must contain a data diagram');
    if (viewport.width === 1280) {
      await page.evaluate(() => magicDustLecture.deck.slide(1));
      await page.waitForTimeout(400);
      await page.screenshot({ path:join(root, '..', 'artifacts-saga-lecture-fingertips.png'), fullPage:true });
    }
    await page.evaluate(() => magicDustLecture.deck.slide(magicDustLecture.deck.getSlides().length - 1));
    await page.evaluate(() => {
      const link = document.getElementById('practiceLink');
      link.addEventListener('click', event => event.preventDefault(), { once:true, capture:true });
      link.click();
    });
    await page.waitForFunction(() => localStorage.getItem('magicdust.lecture.islandFINGERTIPS.v1') === '1');
    assert.strictEqual(await page.locator('#practiceLink').getAttribute('href'), 'islandFINGERTIPS.html');
    assert.deepStrictEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
console.log(`lecture manifest/runtime passed for ${LECTURES.length} decks on desktop and mobile`);
