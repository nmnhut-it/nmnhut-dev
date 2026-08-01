import assert from "node:assert";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url || "/", "http://x").pathname,
  );
  const file = normalize(
    join(root, pathname === "/" ? "node20-lesson.html" : pathname),
  );
  if (
    !file.startsWith(root) ||
    !existsSync(file) ||
    statSync(file).isDirectory()
  ) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, {
    "content-type":
      { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[
        extname(file)
      ] || "application/octet-stream",
  });
  createReadStream(file).pipe(res);
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));

const browser = await chromium.launch();
try {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      `http://127.0.0.1:${server.address().port}/node20-lesson.html`,
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() => node20Lesson?.deck?.isReady?.());
    assert(
      parseFloat(
        await page
          .locator("h1")
          .evaluate((element) => getComputedStyle(element).fontSize),
      ) >= 24,
    );
    assert(
      parseFloat(
        await page
          .locator(".prediction")
          .first()
          .evaluate((element) => getComputedStyle(element).fontSize),
      ) >= 10,
    );
    assert.equal(await page.locator("section").count(), 4);
    assert(await page.locator(".practice").isVisible());
    assert.equal(
      await page.locator(".practice").getAttribute("href"),
      "./lesson20v2.html",
    );
    assert(
      (await page.locator("section").first().innerText()).includes(
        "thẻ Pip có nhiều thuộc tính",
      ),
    );

    await page.locator("#showPowerPair").click();
    assert(
      (await page.locator("#pairMessage").innerText()).includes("lưu một cặp"),
    );
    assert(
      await page
        .locator('[data-card="intro"] [data-key="power"]')
        .evaluate((node) => node.classList.contains("active")),
    );

    await page.evaluate(() => node20Deck.slide(1));
    await page.locator("#lookupPower").click();
    assert.equal(await page.locator("#lookupResult").innerText(), "7");

    await page.evaluate(() => node20Deck.slide(2));
    await page.locator("#updatePower").click();
    assert.equal(
      await page
        .locator('[data-card="update"] [data-key="power"] span')
        .innerText(),
      "10",
    );
    assert.equal(
      await page
        .locator('[data-card="update"] [data-key="name"] span')
        .innerText(),
      "Pip",
    );
    assert.equal(
      await page
        .locator('[data-card="update"] [data-key="color"] span')
        .innerText(),
      "cyan",
    );
    await page.evaluate(() => node20Deck.slide(3));
    assert(
      (await page.locator("section").nth(3).innerText()).includes(
        "Đổi tên thông tin",
      ),
    );
    assert((await page.locator("section").nth(3).innerText()).includes("OPEN"));
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
console.log("Node 20 dictionary concept passed desktop/mobile");
