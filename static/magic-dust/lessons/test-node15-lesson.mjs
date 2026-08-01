import assert from 'node:assert';
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname);
  const full = normalize(join(root, pathname === '/' ? 'node15-lesson.html' : pathname));
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
    await page.goto(`http://127.0.0.1:${server.address().port}/node15-lesson.html`, { waitUntil:'networkidle' });
    await page.waitForFunction(() => window.node15Lesson?.deck?.isReady?.());
    assert.strictEqual(await page.locator('.slides section').count(), 3);
    assert.strictEqual(await page.locator('.number-grid').count(), 3);
    assert.strictEqual(await page.locator('.number-grid .cell').count(), 18);
    assert(await page.locator('.practice-link').isVisible(), 'CTA must always be visible');
    assert.strictEqual(await page.locator('.practice-link').getAttribute('href'), './lesson15v2.html');

    await page.evaluate(() => node15Deck.slide(1));
    await page.locator('#addressNext').click();
    assert.strictEqual(await page.locator('[data-grid="address"] .row-active').count(), 3, 'row must highlight first');
    assert.strictEqual(await page.locator('[data-grid="address"] .cell-active').count(), 0, 'cell must not highlight before next click');
    await page.locator('#addressNext').click();
    assert.strictEqual(await page.locator('[data-grid="address"] .cell-active').innerText(), '10');

    await page.evaluate(() => node15Deck.slide(2));
    await page.locator('#taskNext').click();
    assert.strictEqual(await page.locator('[data-grid="task"] .row-active').count(), 3);
    await page.locator('#taskNext').click();
    assert.strictEqual(await page.locator('[data-grid="task"] .cell-active').innerText(), '10');
    await page.locator('#taskNext').click();
    assert.strictEqual(await page.locator('#taskAddress').innerText(), '[1][0]');
    assert((await page.locator('#taskMessage').innerText()).includes('OUTPUT 10'));
    assert(await page.locator('.practice-link').isVisible(), 'CTA must remain visible on final slide');
    assert.deepStrictEqual(errors, []);
    await page.close();
  }
  console.log('Node 15 lesson passed desktop/mobile interactions');
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
