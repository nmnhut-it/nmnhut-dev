import assert from "node:assert";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const server = http.createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url || "/", "http://x").pathname);
  const file = normalize(join(root, path));
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));

const browser = await chromium.launch();
try {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    for (const node of [21, 22]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/node${node}-lesson.html`, { waitUntil: "networkidle" });
      await page.waitForFunction((index) => {
        const lecture = window[`node${index}Lesson`];
        return lecture?.isReady?.() || lecture?.deck?.isReady?.();
      }, node);
      assert.equal(await page.locator(".practice").getAttribute("href"), `./lesson${node}v2.html`);
      assert(await page.locator(".practice").isVisible());
      const lectureText = await page.locator(".slides").innerText();
      assert(lectureText.includes("Theo em") || lectureText.includes("Dự đoán"));

      if (node === 21) {
        assert.equal(await page.locator(".slides section").count(), 3);
        await page.locator("#cleanText").click();
        assert.equal(await page.locator("#cleanValue").innerText(), "FLOWER");
        await page.evaluate(() => node21Lesson.slide(1));
        await page.locator("#buildRecord").click();
        assert.equal(await page.locator("#rEffect").innerText(), "BURST");
        await page.evaluate(() => node21Lesson.slide(2));
        await page.locator("#fixReturn").click();
        assert.equal(await page.locator("#taskOutput").innerText(), "LAN:GLOW");
      } else {
        assert.equal(await page.locator(".slides section").count(), 4);
        await page.locator("#emitNext").click();
        assert.equal(await page.locator(".mote").count(), 8);
        await page.evaluate(() => node22Lesson.deck.slide(1));
        await page.locator("#runUpdate").click();
        assert.equal(await page.locator("#uAlpha").innerText(), "191");
        await page.evaluate(() => node22Lesson.deck.slide(2));
        for (let index = 0; index < 3; index += 1) await page.locator("#lifeNext").click();
        assert((await page.locator("#lifeExplain").innerText()).includes("y = 39"));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false);
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log("Node 21/22 lectures passed desktop/mobile");
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
