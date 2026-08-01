import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const screenshotDir = join(repoRoot, "tmp", "vision-saga-browser");
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
  const full = normalize(join(repoRoot, pathname));
  if (!full.startsWith(repoRoot) || !existsSync(full) || statSync(full).isDirectory()) {
    return response.writeHead(404).end("not found");
  }
  response.writeHead(200, {
    "content-type": mime[extname(full).toLowerCase()] || "application/octet-stream",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-embedder-policy": "require-corp",
  });
  createReadStream(full).pipe(response);
});

await mkdir(screenshotDir, { recursive: true });
await new Promise(done => server.listen(0, "127.0.0.1", done));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });
const errors = [];

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    if (!localStorage.getItem("magicdust.saga")) localStorage.setItem("magicdust.saga", "21");
  });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(`http://127.0.0.1:${port}/lessons/vision.html`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".vision-node").count(), 14);
  assert.equal(await page.locator(".vision-location img").count(), 14);
  assert.equal(await page.locator(".vision-location img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  assert.match(await page.locator('[data-node="0"]').getAttribute("class"), /current/);
  assert.equal(await page.locator('[data-node="0"] .vision-location img').evaluate(image => image.complete && image.naturalWidth > 0), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: join(screenshotDir, "vision-map-mobile.png"), fullPage: true });

  await page.locator('[data-node="0"]').click();
  await page.waitForURL(/vision-lesson\.html\?node=0/);
  await page.waitForFunction(() => Boolean(window.nodeDev));
  await page.locator("#enterBtn").click();
  await page.evaluate(async () => {
    await window.nodeDev.toFirst();
    window.nodeDev.skip();
    window.nodeDev.skip();
  });
  await page.locator(".pinhole-model:not(.veiled)").waitFor();
  assert.equal(await page.locator(".pinhole-model svg .ph-ray").count(), 2);
  await page.locator('.pinhole-controls button[data-preset="0"]').click();
  assert.match(await page.locator(".pinhole-caption").textContent(), /D = 36 cm.*h = 6 cm/);
  await page.locator('.pinhole-controls button[data-preset="2"]').click();
  assert.match(await page.locator(".pinhole-caption").textContent(), /D = 108 cm.*h = 2 cm/);
  await page.screenshot({ path: join(screenshotDir, "vision-node00-slide-model-mobile.png"), fullPage: true });
  await page.locator('[data-lab-slide="ratio"]').click();
  assert.match(await page.locator('[data-lab-panel="ratio"] .vision-formula-card').textContent(), /h = H × d \/ D/);
  await page.screenshot({ path: join(screenshotDir, "vision-node00-slide-ratio-mobile.png"), fullPage: true });
  await page.locator('[data-lab-slide="design"]').click();
  assert.equal(await page.locator(".vision-design-table tbody tr").count(), 3);
  assert.equal(await page.locator(".vision-slide-tabs button.seen").count(), 3);
  await page.screenshot({ path: join(screenshotDir, "vision-node00-slide-design-mobile.png"), fullPage: true });
  await page.waitForTimeout(750);
  await page.evaluate(async () => window.nodeDev.toCell("vision_pinhole_design_project.py"));
  await page.locator('.codecell:not(.veiled) .clabel').filter({ hasText: "vision_pinhole_design_project.py" }).waitFor();
  assert.doesNotMatch(await page.locator('.codecell:not(.veiled) .cnote').textContent(), /\b(?:INPUT|PROCESS|OUTPUT)\b/);
  await page.screenshot({ path: join(screenshotDir, "vision-node00-project-mobile.png"), fullPage: true });

  await page.setViewportSize({ width: 1365, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/lessons/vision.html`, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: join(screenshotDir, "vision-map-desktop.png"), fullPage: true });

  await page.evaluate(() => {
    localStorage.setItem("magicdust.saga", "25");
    for (let id = 0; id < 13; id += 1) localStorage.setItem(`magicdust.vision.node.${id}`, "1");
  });
  const selectedLabId = Number.parseInt(process.env.VISION_LAB_ID || "", 10);
  const labIds = Number.isInteger(selectedLabId) ? [selectedLabId] : Array.from({ length: 13 }, (_, index) => index + 1);
  for (const id of labIds) {
    console.log(`  checking Vision Lab ${String(id).padStart(2, "0")}`);
    const labPage = await context.newPage();
    labPage.on("pageerror", error => errors.push(error.message));
    await labPage.goto(`http://127.0.0.1:${port}/lessons/vision-lesson.html?node=${id}`, { waitUntil: "domcontentloaded" });
    try {
      await labPage.waitForFunction(expected => window.NODE?.reward?.nodeId === expected && Boolean(window.nodeDev), id);
    } catch (error) {
      console.error("  failed URL", labPage.url());
      console.error("  storage", await labPage.evaluate(() => ({ saga: localStorage.getItem("magicdust.saga"), previous: localStorage.getItem("magicdust.vision.node.11") })));
      console.error("  page errors", errors);
      throw error;
    }
    await labPage.locator("#enterBtn").click();
    await labPage.evaluate(async () => {
      await window.nodeDev.toFirst();
      window.nodeDev.skip();
      window.nodeDev.skip();
    });
    const deck = labPage.locator(".vision-lab-deck:not(.veiled)");
    await deck.waitFor();
    assert.equal(await deck.locator("[data-lab-slide]").count(), 3);
    for (const slideId of ["0", "1", "2"]) await deck.locator(`[data-lab-slide="${slideId}"]`).click();
    assert.equal(await deck.locator(".vision-slide-tabs button.seen").count(), 3);
    assert.equal(await labPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (id === 10) {
      await labPage.waitForFunction(
        () => /Python ready/i.test(document.querySelector("#pystat")?.textContent || ""),
        null,
        { timeout: 150_000 },
      );
      await labPage.evaluate(async () => window.nodeDev.toCell("vision_project_10_opencv_check.py"));
      await labPage.waitForFunction(() => {
        const cell = [...document.querySelectorAll(".codecell")].find(item => !item.classList.contains("veiled"));
        return Boolean(cell?._editor && cell.querySelector(".crun:not(:disabled)"));
      });
      await labPage.evaluate(() => {
        const content = window.NODE.cells.find(cell => cell.label === "vision_project_10_opencv_check.py");
        const cell = [...document.querySelectorAll(".codecell")].find(item => !item.classList.contains("veiled"));
        cell._editor.setValue(content.solution);
        cell.querySelector(".crun").click();
      });
      await labPage.waitForFunction(
        () => {
          const output = [...document.querySelectorAll(".t-out")].map(item => item.textContent).join("\n");
          return /BACKEND OPENCV/.test(output) && /MATCH True/.test(output);
        },
        null,
        { timeout: 60_000 },
      );
    }
    if (id === 13) await labPage.screenshot({ path: join(screenshotDir, "vision-node13-capstone-desktop.png"), fullPage: true });
    await labPage.close();
  }

  assert.deepEqual(errors, []);
  console.log(`✓ Saga Mắt Máy browser: map, Node 00 và academic deck của đủ 13 project còn lại đều đúng (${screenshotDir})`);
  await context.close();
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
}
