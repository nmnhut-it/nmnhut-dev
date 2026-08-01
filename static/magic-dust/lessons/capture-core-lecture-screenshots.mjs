import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright";
const root = resolve("lessons"),
  out = resolve("test-results/core-lectures");
await mkdir(out, { recursive: true });
const server = createServer((req, res) => {
  const path = normalize(
    join(root, decodeURIComponent(new URL(req.url, "http://x").pathname)),
  );
  if (
    !path.startsWith(root) ||
    !existsSync(path) ||
    statSync(path).isDirectory()
  ) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, {
    "content-type":
      { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[
        extname(path)
      ] || "application/octet-stream",
  });
  createReadStream(path).pipe(res);
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const browser = await chromium.launch();
try {
  for (const deck of [
    ["node19", 3],
    ["node20", 4],
    ["node21", 3],
    ["particle-life", 6],
  ])
    for (const size of [
      ["desktop", 1280, 720],
      ["mobile", 390, 844],
    ]) {
      const page = await browser.newPage({
        viewport: { width: size[1], height: size[2] },
      });
      await page.goto(
        `http://127.0.0.1:${server.address().port}/${deck[0] === "particle-life" ? "islandPARTICLELIFE" : deck[0]}-lesson.html`,
        { waitUntil: "networkidle" },
      );
      for (let slide = 0; slide < deck[1]; slide++) {
        if (slide) await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(650);
        await page.screenshot({
          path: join(out, `${deck[0]}-${size[0]}-${slide + 1}.png`),
        });
      }
      await page.close();
    }
} finally {
  await browser.close();
  server.close();
}
console.log("core lecture screenshots captured");
