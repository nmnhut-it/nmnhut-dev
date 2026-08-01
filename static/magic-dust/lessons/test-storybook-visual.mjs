import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = 'http://127.0.0.1:8765/lessons/';
const out = new URL('../test-results/storybook-qc/', import.meta.url);
const only = new Set((process.env.QC_ONLY || '').split(',').map(s => s.trim()).filter(Boolean));
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

async function open(viewport, progress = 16) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.addInitScript(({ progress }) => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', String(progress));
  }, { progress });
  return page;
}

async function captureScroll({ name, url, viewport, progress = 16, points = ['top', 'middle', 'bottom'], enter = false, advance = 0, jump = '', settle = 900 }) {
  if (only.size && !only.has(name)) return;
  const page = await open(viewport, progress);
  await page.goto(base + url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(settle);
  if (jump) {
    await page.evaluate(label => window.nodeDev?.toCell(label), jump);
    await page.waitForTimeout(3400);
  }
  if (enter) {
    await page.locator('#enterBtn').click();
    await page.waitForTimeout(350);
    if (await page.locator('#giftwrap').isVisible()) await page.locator('#giftwrap').dispatchEvent('click');
    await page.waitForTimeout(3100);
    for (let i = 0; i < advance; i++) {
      await page.evaluate(() => window.nodeDev?.skip());
      await page.waitForTimeout(260);
    }
  }
  for (const point of points) {
    await page.evaluate(point => {
      const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      const y = point === 'top' ? 0 : point === 'middle' ? max / 2 : max;
      scrollTo(0, y);
    }, point);
    await page.waitForTimeout(250);
    await page.screenshot({ path: fileURLToPath(new URL(`${name}-${point}.png`, out)), animations: 'disabled' });
  }
  const report = await page.evaluate(() => ({
    url: location.pathname,
    width: innerWidth,
    height: innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
    bodyColor: getComputedStyle(document.body).color,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    nodeArt: [...document.querySelectorAll('.node .island img')].map(img => img.getAttribute('src')),
    sideArt: [...document.querySelectorAll('.sidenode .sideart img')].map(img => img.getAttribute('src')),
  }));
  console.log(name, JSON.stringify(report));
  await page.close();
}

const desktop = { width: 1366, height: 768 };
const mobile = { width: 390, height: 844 };
await captureScroll({ name: 'saga-desktop', url: 'index.html?noentry', viewport: desktop, progress: 16 });
await captureScroll({ name: 'saga-mobile', url: 'index.html?noentry', viewport: mobile, progress: 16 });
if (process.env.QC_SAGA_ONLY) { await browser.close(); process.exit(0); }
await captureScroll({ name: 'node00-desktop', url: 'lesson00v2.html', viewport: desktop, progress: 1, enter: true, advance: 6 });
await captureScroll({ name: 'node10-desktop', url: 'lesson10v2.html', viewport: desktop, progress: 11, enter: true, advance: 6 });
await captureScroll({ name: 'node25-mobile', url: 'lesson25v2.html', viewport: mobile, progress: 26, enter: true, advance: 6 });
await captureScroll({ name: 'island-io-desktop', url: 'islandIO.html', viewport: desktop, progress: 16, enter: true, advance: 6 });
await captureScroll({ name: 'island-grid-mobile', url: 'islandGRIDOPS.html', viewport: mobile, progress: 17, enter: true, advance: 6 });
await captureScroll({ name: 'code-mobile', url: 'dev-test.html?src=node04v2&only=code:make_it_true.py', viewport: mobile, progress: 5, points: ['top'], settle: 4300 });
await captureScroll({ name: 'checkpoint-desktop', url: 'dev-test.html?src=node10v2&only=checkpoint', viewport: desktop, progress: 11, points: ['top'], settle: 4300 });
await captureScroll({ name: 'boss-desktop', url: 'dev-test.html?src=node10v2&only=boss', viewport: desktop, progress: 11, points: ['top'], settle: 4300 });
await captureScroll({ name: 'forge-desktop', url: 'dev-test.html?src=node07v2&only=forge', viewport: desktop, progress: 8, points: ['top'], settle: 4300 });
await captureScroll({ name: 'widget-desktop', url: 'dev-test.html?src=node00&only=widget', viewport: desktop, progress: 1, points: ['top'], settle: 4300 });
await captureScroll({ name: 'walkthrough-desktop', url: 'islandPHOTOLIGHTS.html', viewport: desktop, progress: 20, points: ['top', 'middle', 'bottom'], jump: 'walk_mot_bong' });
await captureScroll({ name: 'trace-desktop', url: 'lesson10v2.html', viewport: desktop, progress: 11, points: ['top'], jump: 'for_smallest_steps' });
await captureScroll({ name: 'program-counter-desktop', url: 'lesson11v2.html', viewport: desktop, progress: 12, points: ['top'], jump: 'one_card_machine' });
await captureScroll({ name: 'tower-desktop', url: 'tower.html', viewport: desktop, progress: 26 });

await browser.close();
