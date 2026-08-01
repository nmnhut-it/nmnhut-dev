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
  const full = normalize(join(root, pathname === '/' ? 'node16-lesson.html' : pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type':mime[extname(full)] || 'application/octet-stream' });
  createReadStream(full).pipe(res);
});
await new Promise(done => server.listen(0, '127.0.0.1', done));

const browser = await chromium.launch();
try {
  for (const viewport of [{ width:1280, height:720 }, { width:390, height:844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/node16-lesson.html`, { waitUntil:'networkidle' });
    await page.waitForFunction(() => window.node16Lesson?.deck?.isReady?.());
    assert.strictEqual(await page.locator('.reveal .slides section').count(), 3);
    assert.strictEqual(await page.locator('#practiceCta').getAttribute('href'), './lesson16v2.html');
    assert(await page.locator('#practiceCta').isVisible(), 'CTA must be visible on first slide');
    assert.strictEqual(await page.locator('#searchRail .rail-cell').count(), 4);

    for (let i=0;i<4;i+=1) await page.locator('#searchNext').click();
    assert.strictEqual(await page.locator('#searchFound').innerText(), 'True');
    assert((await page.locator('#searchCompare').innerText()).includes('DỪNG'));
    assert.strictEqual(await page.locator('#searchRail .uninspected').count(), 2);
    assert((await page.locator('#searchEvidence').innerText()).includes('OUTPUT là CO'));

    await page.evaluate(() => node16Lesson.deck.slide(1));
    assert(await page.locator('#practiceCta').isVisible(), 'CTA must remain visible on sort slide');
    const expected = ['[2, 5, 4, 1]','[2, 4, 5, 1]','[2, 4, 1, 5]'];
    for (const state of expected) {
      await page.locator('#sortNext').click();
      assert((await page.locator('#sortEvidence').innerText()).includes(state));
    }
    assert.strictEqual(await page.locator('#sortRail .rail-cell').nth(3).innerText(), '5\nindex 3');

    await page.evaluate(() => node16Lesson.deck.slide(2));
    assert(await page.locator('#practiceCta').isVisible(), 'CTA must remain visible on recap slide');
    assert.strictEqual(await page.locator('.pip-proof').count(), 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.strictEqual(overflow, false, `no horizontal overflow at ${viewport.width}`);
    assert.deepStrictEqual(errors, []);
    await page.close();
  }
  console.log('Node 16 search/sort lecture passed desktop/mobile interactions');
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
