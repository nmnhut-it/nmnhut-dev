import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const lessonRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const outputRoot = resolve(lessonRoot, '..');
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.webp':'image/webp' };
const server = http.createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url || '/', 'http://127.0.0.1').pathname);
  const full = normalize(join(lessonRoot, path === '/' ? 'fingertips-lesson.html' : path));
  if (!full.startsWith(lessonRoot) || !existsSync(full) || statSync(full).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type':mime[extname(full)] || 'application/octet-stream' });
  createReadStream(full).pipe(res);
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport:{ width:1280, height:720 } });
  await page.goto(`http://127.0.0.1:${server.address().port}/fingertips-lesson.html`, { waitUntil:'networkidle' });
  await page.waitForFunction(() => window.fingertipsLesson?.deck?.isReady?.());
  await page.addStyleTag({ content:'*,*::before,*::after{animation:none!important;transition:none!important}.camera-flash{display:none!important}' });
  const capture = async (slide, name) => {
    await page.evaluate(index => fingertipsDeck.slide(index), slide);
    await page.waitForTimeout(450);
    await page.evaluate(() => { for (let step = 0; step < 20; step += 1) fingertipsDeck.nextFragment(); });
    await page.waitForTimeout(80);
    await page.screenshot({ path:join(outputRoot, name), fullPage:true });
  };
  await capture(0, 'artifacts-fingertips-svg-camera.png');
  await capture(2, 'artifacts-fingertips-svg-pipeline.png');
  await capture(5, 'artifacts-fingertips-svg-neighbors.png');
  await page.evaluate(() => fingertipsDeck.slide(7));
  for (let step = 0; step < 6; step += 1) await page.locator('#scanNext').click();
  await page.screenshot({ path:join(outputRoot, 'artifacts-fingertips-svg-scan.png'), fullPage:true });
  await capture(8, 'artifacts-fingertips-svg-tests.png');
  console.log('captured five Fingertips SVG lesson screenshots');
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
