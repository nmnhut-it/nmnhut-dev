import assert from "node:assert";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url || "/", "http://x").pathname);
  const f = normalize(join(root, p === "/" ? "node19-lesson.html" : p));
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
      "http://127.0.0.1:" + server.address().port + "/node19-lesson.html",
      { waitUntil: "networkidle" },
    );
    await page.waitForFunction(() => node19Lecture?.isReady?.());
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
          .locator(".instruction")
          .first()
          .evaluate((element) => getComputedStyle(element).fontSize),
      ) >= 10,
    );
    assert.equal(await page.locator("section").count(), 3);
    assert(
      await page
        .locator("h1")
        .innerText()
        .then((t) => t.includes("kết quả")),
    );
    await page.locator("#computeInside").click();
    assert.equal(await page.locator("#insideValue").innerText(), "12");
    assert(
      (await page.locator("#insideMessage").innerText()).includes(
        "bên trong hàm",
      ),
    );
    await page.evaluate(() => node19Lecture.slide(1));
    await page.locator("#sendReturn").click();
    assert.equal(await page.locator("#callToken").innerText(), "12");
    assert.equal(await page.locator("#resultState").innerText(), "result = 12");
    await page.evaluate(() => node19Lecture.slide(2));
    assert(
      (await page.locator("section").nth(2).innerText()).includes(
        "OUTPUT cần đạt",
      ),
    );
    await page.locator("#repairReturn").click();
    assert.equal(await page.locator("#repairLine").innerText(), "return total");
    assert.equal(
      await page.locator("#repairResult").innerText(),
      "result = 11",
    );
    assert.equal(
      await page.locator(".final-practice").getAttribute("href"),
      "./lesson19v2.html",
    );
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
console.log("Node 19 return lesson passed desktop/mobile");
