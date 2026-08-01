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
  await context.addInitScript(() => localStorage.setItem("magicdust.saga", "21"));
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/dsa.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".dsacard");

  assert.equal(await page.locator(".dsachapter").count(), 5);
  assert.equal(await page.locator(".dsacard.node").count(), 24);
  assert.equal(await page.locator(".dsacard.island").count(), 10);
  assert.equal(await page.locator(".dsacard.tower").count(), 5);
  assert.equal(await page.locator(".dsacard.node.current").count(), 1);
  assert.equal(await page.locator(".dsacard.node.locked").count(), 23);
  assert.equal(await page.locator("img").count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "Bản đồ DSA không được tràn ngang trên mobile");

  await page.locator(".dsacard.node").nth(1).click();
  assert.match(await page.locator(".dsatoast").textContent(), /node ngay trước/);

  await page.evaluate(() => localStorage.setItem("magicdust.dsa.node.0", "1"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".dsacard.node.done").count(), 1);
  assert.equal(await page.locator(".dsacard.node.current").count(), 1);

  await page.evaluate(() => {
    localStorage.setItem("magicdust.dsa.node.1", "1");
    localStorage.setItem("magicdust.dsa.node.2", "1");
  });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".dsacard.island.current").count(), 1);
  assert.equal(await page.locator(".dsacard.tower.current").count(), 0);

  await page.evaluate(() => localStorage.setItem("magicdust.dsa.node.3", "1"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".dsacard.island.current").count(), 2);
  assert.equal(await page.locator(".dsacard.tower.current").count(), 1);

  console.log("✓ Map DSA: mobile, 24 node, 10 đảo, 5 tháp và các mốc mở khóa đều hợp lệ");
  await context.close();
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
