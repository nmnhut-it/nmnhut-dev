import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = new URL(".", import.meta.url).pathname.replace(/^\/(.:)/, "$1").replaceAll("/", "\\");
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    const clean = decodeURIComponent((req.url || "/").split("?")[0]);
    const file = normalize(join(root, clean === "/" ? "node17-lesson.html" : clean));
    if (!file.startsWith(normalize(root))) throw new Error("outside root");
    const body = await readFile(file); res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" }); res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/node17-lesson.html`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.node17Deck?.isReady());
    const result = await page.evaluate(() => ({
      slides: window.node17Deck.getTotalSlides(),
      cta: document.querySelector(".practice-cta")?.getAttribute("href"),
      ctaVisible: getComputedStyle(document.querySelector(".practice-cta")).display !== "none",
      indexed: document.querySelectorAll("#indexStage .char-ribbon i").length,
      sliced: document.querySelectorAll("#sliceStage .char-ribbon i").length,
      output: document.querySelector(".secret-output")?.textContent.trim(),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));
    if (result.slides !== 4) throw new Error(`expected 4 slides, got ${result.slides}`);
    if (result.cta !== "./lesson17v2.html" || !result.ctaVisible) throw new Error("CTA contract failed");
    if (result.indexed !== 7 || result.sliced !== 9) throw new Error("ribbon data mismatch");
    if (result.output !== "koto / dust / portal") throw new Error("secret output mismatch");
    if (result.overflow) throw new Error(`horizontal overflow at ${viewport.width}`);
    if (errors.length) throw new Error(errors.join("\n"));
    await page.close();
  }
  console.log("node17 lesson: desktop/mobile PASS");
} finally { await browser.close(); server.close(); }
