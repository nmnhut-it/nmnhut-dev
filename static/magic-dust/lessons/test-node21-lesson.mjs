import assert from "node:assert";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url || "/", "http://x").pathname);
  const f = normalize(join(root, p === "/" ? "node21-lesson.html" : p));
  if (!f.startsWith(root) || !existsSync(f) || statSync(f).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, {
    "content-type":
      { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[
        extname(f)
      ] || "application/octet-stream",
  });
  createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch();
try {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      "http://127.0.0.1:" + server.address().port + "/node21-lesson.html",
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() => node21Lesson?.isReady?.());
    assert(
      parseFloat(
        await page
          .locator("h1")
          .evaluate((element) => getComputedStyle(element).fontSize),
      ) >= 22,
    );
    assert(
      parseFloat(
        await page
          .locator(".prediction")
          .first()
          .evaluate((element) => getComputedStyle(element).fontSize),
      ) >= 10,
    );
    assert.equal(await page.locator("section").count(), 3);
    assert((await page.locator("h1").innerText()).includes("Cùng một tên"));
    await page.locator("#cleanText").click();
    assert.equal(await page.locator("#cleanValue").innerText(), "FLOWER");
    await page.evaluate(() => node21Lesson.slide(1));
    await page.locator("#buildRecord").click();
    assert.equal(await page.locator("#rSender").innerText(), "BINH");
    assert.equal(await page.locator("#rEffect").innerText(), "BURST");
    await page.evaluate(() => node21Lesson.slide(2));
    assert(
      (await page.locator("section").nth(2).innerText()).includes(
        "target = FLOWER",
      ),
    );
    await page.locator("#fixReturn").click();
    assert.equal(await page.locator("#returnLine").innerText(), "return item");
    assert.equal(await page.locator("#taskOutput").innerText(), "LAN:GLOW");
    assert.equal(
      await page.locator(".final-cta").getAttribute("href"),
      "./lesson21v2.html",
    );
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log("Node 21 data pipeline lesson passed desktop/mobile");
