// node lessons/test-saga-network-budget.mjs
// Browser regression for the saga map's first-load image budget.
import assert from 'node:assert';
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const mime = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const full = normalize(join(root, pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, {
    'cache-control': 'public, max-age=31536000, immutable',
    'content-type': mime[extname(full).toLowerCase()] || 'application/octet-stream',
  });
  createReadStream(full).pipe(res);
});

await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', '16');
  });
  const page = await context.newPage();
  const failed = [];
  page.on('response', response => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(`http://127.0.0.1:${port}/index.html?noentry`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const report = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource').map(entry => ({
      bytes: entry.encodedBodySize || entry.transferSize || 0,
      name: entry.name,
    }));
    const images = entries.filter(entry => /\.(avif|png|webp)(\?|$)/i.test(entry.name));
    const locations = images.filter(entry => /\/assets\/storybook\/(node-islands|side-islands|branches|towers)\//.test(entry.name));
    return {
      imageBytes: images.reduce((sum, entry) => sum + entry.bytes, 0),
      imageRequests: images.length,
      locationRequests: locations.length,
      pngLocations: locations.filter(entry => /\.png(\?|$)/i.test(entry.name)).map(entry => entry.name),
      locationUrls: locations.map(entry => entry.name),
    };
  });

  assert.deepStrictEqual(failed, [], 'saga first load must not request missing assets');
  assert.deepStrictEqual(report.pngLocations, [], 'map locations must load WebP, not PNG duplicates');
  assert.ok(report.imageBytes <= 4 * 1024 * 1024, `initial images exceed 4MB: ${(report.imageBytes / 1024 / 1024).toFixed(2)}MB`);
  assert.ok(report.locationRequests <= 40, `initial load should fetch at most 40/73 nearby map locations (${report.locationRequests} requested)`);
  assert.ok(report.locationUrls.some(url => /node16-search-sort-lit\.webp/.test(url)), 'the current node image should load eagerly');

  console.log(`saga network budget passed (${report.imageRequests} images, ${(report.imageBytes / 1024 / 1024).toFixed(2)}MB, ${report.locationRequests}/73 locations requested)`);
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
