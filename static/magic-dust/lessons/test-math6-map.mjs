import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
  const full = normalize(join(root, pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) {
    response.writeHead(404).end("not found");
    return;
  }
  response.writeHead(200, { "content-type": mime[extname(full).toLowerCase()] || "application/octet-stream" });
  createReadStream(full).pipe(response);
});

await new Promise(resolveListen => server.listen(0, "127.0.0.1", resolveListen));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    if (localStorage.getItem("magicdust.saga") === null) localStorage.setItem("magicdust.saga", "5");
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/math6.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".mathnode");

  assert.equal(await page.locator(".mathnode").count(), 18);
  assert.equal(await page.locator('.mathnode[data-id="0"]').getAttribute("class"), "mathnode current");
  assert.equal(await page.locator(".mathnode.locked").count(), 17);
  assert.equal(await page.locator(".mathnode img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Map Toán không được tràn ngang trên mobile");

  await page.locator('.mathnode[data-id="4"]').click();
  assert.match(await page.locator(".mathtoast").textContent(), /Node 05/);

  await page.evaluate(() => localStorage.setItem("magicdust.math6.node.0", "1"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('.mathnode[data-id="0"]').getAttribute("class"), "mathnode done");
  assert.equal(await page.locator('.mathnode[data-id="1"]').getAttribute("class"), "mathnode current");

  await page.evaluate(() => {
    for (let id = 0; id <= 3; id += 1) localStorage.setItem(`magicdust.math6.node.${id}`, "1");
  });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('.mathnode[data-id="4"]').getAttribute("class"), "mathnode locked");

  await page.evaluate(() => localStorage.setItem("magicdust.saga", "6"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator('.mathnode[data-id="4"]').getAttribute("class"), "mathnode current");

  await page.locator('.mathnode[data-id="17"]').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.mathnode[data-id="17"]').isVisible(), true);

  console.log("✓ Map Toán 6: mobile, ảnh, 18 node và các mốc mở khóa đều hợp lệ");
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
