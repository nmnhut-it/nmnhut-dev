import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = new URL(".", import.meta.url).pathname.replace(/^\/(.:)/, "$1").replaceAll("/", "\\");
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    const file = normalize(join(root, decodeURIComponent((req.url || "/").split("?")[0])));
    if (!file.startsWith(normalize(root))) throw new Error("outside root");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" }); res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

const browser = await chromium.launch({ headless: true });
try {
  const shotDir = join(root, "test-artifacts", "giftsetup-lesson");
  await mkdir(shotDir, { recursive: true });
  for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/islandGIFTSETUP-lesson.html`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.giftSetupLecture?.isReady());
    const base = await page.evaluate(() => {
      const slide = document.querySelector(".slides section.present") || document.querySelector(".slides section");
      const title = document.querySelector(".lecture-title");
      const ctaElement = document.querySelector(".cta");
      const slideRect = slide.getBoundingClientRect();
      const ctaRect = ctaElement.getBoundingClientRect();
      return {
      slides: giftSetupLecture.getTotalSlides(), cta: ctaElement.getAttribute("href"),
      prompts: [...document.querySelectorAll(".predict")].map(node => node.textContent),
      theoryOrder: [...document.querySelectorAll(".theory-slide .lecture-kicker")].map(node => node.textContent),
      semantic: [...document.querySelectorAll("section[data-station]")].every(section => {
        const predict = section.querySelector(".predict-box");
        const run = section.querySelector(".run-demo");
        const observation = section.querySelector(".observation");
        return predict && run && observation
          && Boolean(predict.compareDocumentPosition(run) & Node.DOCUMENT_POSITION_FOLLOWING)
          && Boolean(run.compareDocumentPosition(observation) & Node.DOCUMENT_POSITION_FOLLOWING);
      }),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      titleFont: parseFloat(getComputedStyle(title).fontSize), slideWidth: slideRect.width, slideHeight: slideRect.height,
      ctaTop: ctaRect.top, ctaRight: ctaRect.right,
    }});
    const minSlideWidth = viewport.width < 700 ? 350 : 900;
    const minSlideHeight = viewport.width < 700 ? 670 : 650;
    if (base.slides !== 6 || base.cta !== "./islandGIFTSETUP.html" || base.prompts.length !== 4 || base.prompts.some(text => !text.includes("Theo em")) || !base.semantic || !base.theoryOrder[0].includes("LÝ THUYẾT 1") || !base.theoryOrder[1].includes("LÝ THUYẾT 2") || base.overflow || base.titleFont < 18 || base.slideWidth < minSlideWidth || base.slideHeight < minSlideHeight || base.ctaTop < 0 || base.ctaTop >= 50 || base.ctaRight > viewport.width) throw new Error(`base ${viewport.width}: ${JSON.stringify(base)}`);
    for (let slide = 0; slide < 6; slide++) {
      await page.evaluate(({ index, mobile }) => {
        if (mobile) document.querySelectorAll(".slides section")[index].scrollIntoView({ block: "center" });
        else giftSetupLecture.slide(index);
      }, { index: slide, mobile: viewport.width < 600 });
      await page.waitForTimeout(900);
      await page.screenshot({ path: join(shotDir, `${viewport.width === 1280 ? "desktop" : "mobile"}-slide-${slide + 1}.png`) });
    }
    await page.evaluate(() => giftSetupLecture.slide(2));
    for (let i = 0; i < 3; i++) await page.evaluate(() => cleanSender.click());
    if (await page.textContent("#cleanAfter") !== "MIRA") throw new Error("clean_sender result");
    await page.evaluate(() => giftSetupLecture.slide(3));
    for (let i = 0; i < 2; i++) await page.evaluate(() => conditionNext.click());
    if (!(await page.textContent("#conditionProof")).includes("GLOW")) throw new Error("effect_for result");
    await page.evaluate(() => giftSetupLecture.slide(4));
    await page.evaluate(() => stampNext.click()); await page.evaluate(() => stampNext.click());
    if (await page.textContent("#currentEffect") !== "GLOW") throw new Error("gift loop result");
    await page.evaluate(() => giftSetupLecture.slide(5));
    for (let i = 0; i < 4; i++) await page.evaluate(() => searchNext.click());
    if (await page.textContent("#searchResult") !== "8") throw new Error("lookup result");
    const task = await page.textContent(".final-task");
    if (!task.includes("MIRA") || !task.includes("HEART:SPARK") || !task.includes("COMET:GLOW")) throw new Error("practice parity");
    if (errors.length) throw new Error(errors.join("; "));
    await page.close();
  }
  console.log("gift setup lesson: desktop/mobile PASS");
} finally { await browser.close(); server.close(); }
