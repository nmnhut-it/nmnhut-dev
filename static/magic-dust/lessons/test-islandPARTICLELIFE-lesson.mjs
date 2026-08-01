import assert from "node:assert";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
const root = new URL(".", import.meta.url).pathname
    .replace(/^\/(.:)/, "$1")
    .replaceAll("/", "\\"),
  mime = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript",
    ".css": "text/css",
    ".woff2": "font/woff2",
  };
const server = createServer(async (req, res) => {
  try {
    const file = normalize(
      join(root, decodeURIComponent((req.url || "/").split("?")[0])),
    );
    if (!file.startsWith(normalize(root))) throw 0;
    res.writeHead(200, {
      "content-type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true }),
  output = join(root, "..", "test-results", "particle-life-lecture");
await mkdir(output, { recursive: true });
try {
  for (const viewport of [
    { name: "desktop", width: 1280, height: 720 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport }),
      errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      `http://127.0.0.1:${server.address().port}/islandPARTICLELIFE-lesson.html`,
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() => particleLifeLecture?.isReady());
    assert.equal(await page.locator("section").count(), 6);
    assert.equal(await page.locator(".prediction").count(), 4);
    for (let slide = 0; slide < 6; slide++) {
      if (slide > 0) await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(120);
      await page.screenshot({
        path: join(output, `${viewport.name}-slide-${slide + 1}.png`),
        fullPage: false,
      });
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 2,
      );
      assert.equal(overflow, false);
    }
    await page.evaluate(() => particleLifeLecture.slide(2));
    await page.locator("#renderOne").click();
    assert((await page.locator("#renderProof").innerText()).includes("hàm vẽ"));
    await page.evaluate(() => particleLifeLecture.slide(3));
    await page.locator("#runMove").click();
    await page.waitForFunction(
      () => document.querySelectorAll("#moveStrip .visible").length === 3,
    );
    assert((await page.locator("#moveProof").innerText()).includes("(36, 62)"));
    await page.evaluate(() => particleLifeLecture.slide(4));
    await page.locator("#runLife").click();
    await page.waitForFunction(
      () => document.querySelectorAll("#lifeStrip .visible").length === 6,
    );
    assert((await page.locator("#lifeProof").innerText()).includes("life = 0"));
    await page.evaluate(() => particleLifeLecture.slide(5));
    await page.locator("#runPractice").click();
    assert.equal(
      await page.locator("#practiceLine").innerText(),
      "update_particle(particle)",
    );
    assert(
      (await page.locator("#practiceProof").innerText()).includes(
        "OUTPUT đúng",
      ),
    );
    assert.equal(
      await page.locator(".final-cta").getAttribute("href"),
      "./islandPARTICLELIFE.html",
    );
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log("particle life frame-strip lesson: desktop/mobile PASS");
