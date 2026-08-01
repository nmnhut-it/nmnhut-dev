import { chromium } from 'playwright';
import path from 'node:path';
import { mkdirSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const output = path.join(process.env.TEMP || '.', 'magic-dust-lecture-review');
mkdirSync(output, { recursive: true });

await page.goto('http://127.0.0.1:8765/lessons/node15-lesson.html#/1', { waitUntil: 'networkidle' });
await page.click('#addressNext');
await page.click('#addressNext');
await page.screenshot({ path: path.join(output, 'node15-address.png'), fullPage: true });

await page.goto('http://127.0.0.1:8765/lessons/node16-lesson.html#/1', { waitUntil: 'networkidle' });
for (let step = 0; step < 3; step += 1) await page.click('#sortNext');
await page.screenshot({ path: path.join(output, 'node16-sort.png'), fullPage: true });

await page.goto('http://127.0.0.1:8765/lessons/node17-lesson.html#/1', { waitUntil: 'networkidle' });
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
await page.screenshot({ path: path.join(output, 'node17-slice.png'), fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:8765/lessons/node17-lesson.html', { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.node17Deck?.isReady());
await page.evaluate(() => window.node17Deck.slide(3));
await page.screenshot({ path: path.join(output, 'node17-mobile-final.png') });

await page.setViewportSize({ width: 1440, height: 900 });
for (const node of [18, 19, 20, 21, 22, 23, 24, 25]) {
  await page.goto(`http://127.0.0.1:8765/lessons/node${node}-lesson.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(output, `node${node}-first.png`) });
}

for (const lecture of ['emitter-lab', 'islandDICTLOOKUP', 'islandGIFTSETUP', 'islandPARTICLELIFE']) {
  await page.goto(`http://127.0.0.1:8765/lessons/${lecture}-lesson.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(output, `${lecture}-first.png`) });
}

await browser.close();
console.log('Captured node 15-17 lecture screenshots.');
