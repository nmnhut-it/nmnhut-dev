import assert from 'node:assert';
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp' };
const server = http.createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname);
  const full = normalize(join(root, path === '/' ? 'fingertips-lesson.html' : path));
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
    await page.goto(`http://127.0.0.1:${server.address().port}/fingertips-lesson.html`, { waitUntil:'networkidle' });
    await page.waitForFunction(() => window.fingertipsLesson?.deck?.isReady?.());
    assert.strictEqual(await page.locator('.reveal .slides section').count(), 9);
    assert(await page.locator('.camera-hand').isVisible(), 'slide 1 must show the hand before the first click');
    assert.strictEqual(await page.locator('[data-grid="meaning"] i').count(), 45);
    assert.strictEqual(await page.locator('.neighbor-svg rect').count(), 5);
    assert.strictEqual(await page.locator('.pip-tests .test-card').count(), 5);

    await page.evaluate(() => fingertipsDeck.slide(6));
    await page.locator('[data-choice="noise"]').click();
    assert((await page.locator('#choiceFeedback').innerText()).includes('phía dưới'));
    await page.locator('[data-choice="valid"]').click();
    assert((await page.locator('#choiceFeedback').innerText()).includes('nối với bàn tay'));

    await page.evaluate(() => fingertipsDeck.slide(7));
    for (let step = 0; step < 7; step += 1) await page.locator('#scanNext').click();
    assert.strictEqual(await page.locator('#scanCount').innerText(), '3');
    assert.strictEqual(await page.locator('#scanVerdict').innerText(), 'QUÉT XONG');

    await page.evaluate(() => fingertipsDeck.slide(8));
    for (let test = 0; test < 5; test += 1) await page.locator('#runTests').click();
    assert.strictEqual(await page.locator('.test-card.pass').count(), 5);
    assert.strictEqual(await page.locator('#testResult').innerText(), 'RESULT 5/5');
    await page.evaluate(() => {
      const link = document.getElementById('challengeLink');
      link.addEventListener('click', event => event.preventDefault(), { once:true, capture:true });
      link.click();
    });
    await page.waitForFunction(() => localStorage.getItem('magicdust.fingertips.lecture.v2') === '1');
    assert.strictEqual(await page.locator('#challengeLink').getAttribute('href'), './islandFINGERTIPS.html');
    assert.deepStrictEqual(errors, []);
    await page.close();
  }
  console.log('Fingertips SVG lesson passed desktop/mobile interactions');
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
