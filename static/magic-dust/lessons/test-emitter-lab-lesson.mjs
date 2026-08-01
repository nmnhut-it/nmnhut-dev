import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = new URL(".", import.meta.url).pathname.replace(/^\/(.:)/, "$1").replaceAll("/", "\\");
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    const file = normalize(join(root, decodeURIComponent((req.url || "/").split("?")[0])));
    if (!file.startsWith(normalize(root))) throw new Error("outside root");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/emitter-lab-lesson.html`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.emitterLessonDeck?.isReady());
    const base = await page.evaluate(() => ({
      slides: emitterLessonDeck.getTotalSlides(),
      cta: document.querySelector(".cta").getAttribute("href"),
      top: document.querySelector(".cta").getBoundingClientRect().top,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      velocity: velocityReadout.textContent,
      task: document.querySelector(".direct-task").textContent,
      rows: [...document.querySelectorAll("#frameTable tr")].map(row => [...row.cells].map(cell => cell.textContent).join(" ")),
    }));
    if (base.slides !== 4 || base.cta !== "./islandEMITTERLAB.html" || base.top > 40 || base.overflow) throw new Error(`base ${viewport.width}: ${JSON.stringify(base)}`);
    if (base.velocity !== "vx: -4 · -2 · 0 · 2 · 4" || !base.task.includes("emit_burst")) throw new Error(`count/spread contract: ${JSON.stringify(base)}`);
    if (base.rows.join("|") !== "1 2 2|2 2 4|3 2 6|4 2 6|5 2 6") throw new Error(`frame table: ${JSON.stringify(base.rows)}`);

    await page.click("#spreadKnob");
    if (await page.textContent("#velocityReadout") !== "vx: -6 · -3 · 0 · 3 · 6") throw new Error("spread assertion");
    await page.evaluate(() => emitterLessonDeck.slide(1));
    for (let i = 0; i < 4; i++) await page.click("#playSeq");
    if (await page.textContent("#seqTotal") !== "8") throw new Error("rate 2 assertion");
    await page.click('[data-rate="3"]');
    for (let i = 0; i < 3; i++) await page.click("#playSeq");
    if (await page.textContent("#seqTotal") !== "9") throw new Error("rate 3 assertion");
    await page.evaluate(() => emitterLessonDeck.slide(2));
    await page.click("#applyBudget");
    if (await page.textContent("#budgetResult") !== "4 · 5 · 6 · 7 · 8") throw new Error("budget assertion");
    await page.evaluate(() => emitterLessonDeck.slide(3));
    for (let i = 0; i < 5; i++) await page.click("#runStudio");
    const final = await page.evaluate(() => ({
      frame: studioFrame.textContent,
      count: studioCount.textContent,
      current: [...document.querySelector("#frameTable tr.current").cells].map(cell => cell.textContent).join(" "),
      hasFunction: document.querySelector(".final-task code").textContent.includes("def emit_particles"),
    }));
    if (final.frame !== "5" || final.count !== "6" || final.current !== "5 2 6" || !final.hasFunction) throw new Error(`final studio: ${JSON.stringify(final)}`);
    if (errors.length) throw new Error(errors.join("; "));
    await page.close();
  }
  console.log("emitter lab lesson: desktop/mobile PASS");
} finally { await browser.close(); server.close(); }
