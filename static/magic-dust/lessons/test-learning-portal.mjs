import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { MATH6_NODES } from "./content/math6-curriculum.js";
import { PYTHON50_NODES } from "./content/python50-curriculum.js";
import { PYTHON_KIDS_NODES } from "./content/python-kids-curriculum.js";
import { VISION_NODES } from "./content/vision-curriculum.js";
import { DSA_ISLANDS, DSA_NODES, DSA_TOWERS } from "./content/dsa-curriculum.js";
import { LEET_SETS } from "./content/leet-curriculum.js";

const expectedCollectibles = MATH6_NODES.length
  + PYTHON50_NODES.length
  + PYTHON_KIDS_NODES.length
  + VISION_NODES.filter(node => node.ready).length
  + DSA_NODES.length
  + DSA_ISLANDS.length
  + DSA_TOWERS.length
  + LEET_SETS.length;

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const mime = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
  const full = normalize(join(root, pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) return response.writeHead(404).end("not found");
  response.writeHead(200, { "content-type": mime[extname(full).toLowerCase()] || "application/octet-stream" });
  createReadStream(full).pipe(response);
});
await new Promise(done => server.listen(0, "127.0.0.1", done));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    localStorage.setItem("magicdust.saga", "21");
    localStorage.setItem("magicdust.math6.node.0", "1");
    localStorage.setItem("magicdust.python50.node.0", "1");
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/learning-portal.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".saga-card").count(), 6);
  assert.match(await page.locator(".wallet").textContent(), /200 XP/);
  assert.equal(await page.locator(".collectible").count(), expectedCollectibles);
  assert.equal(await page.locator(".collectible:not(.locked)").count(), 2);
  assert.equal(await page.locator(".gift").count(), 5);
  assert.equal(await page.locator(".vision").evaluate(element => element.tagName), "A");
  assert.equal(await page.locator(".vision").getAttribute("href"), "./vision.html");
  assert.equal(await page.locator(".world-portal.dsa").getAttribute("href"), "./dsa.html");
  assert.equal(await page.locator(".world-portal.leet").getAttribute("href"), "./leet.html");
  assert.equal(await page.locator(".world-portal.challenge").count(), 2);
  assert.equal(await page.locator(".world-portal.challenge").nth(1).getAttribute("href"), "./python-kids.html");
  await page.locator('[data-open-modal="album-modal"]').click();
  assert.equal(await page.locator("#album-modal").getAttribute("class"), "game-modal open");
  await page.locator("#album-modal [data-close-modal]").click();
  await page.locator('[data-open-modal="gift-modal"]').click();
  assert.equal(await page.locator("#gift-modal").getAttribute("class"), "game-modal open");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#gift-modal").evaluate(element => element.classList.contains("open")), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.goto(`http://127.0.0.1:${port}/python50.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".p50node").count(), 14);
  assert.equal(await page.locator('.p50node[data-id="0"]').getAttribute("class"), "p50node done");
  assert.equal(await page.locator('.p50node[data-id="1"]').getAttribute("class"), "p50node current");
  assert.equal(await page.locator(".p50node img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  console.log("✓ Portal game-room + saga 50: mobile, XP, modal quà và 14 node đều đúng");
  await context.close();
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
