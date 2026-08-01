// Requires `python serve.py 8123` and Playwright Chromium.
//
// The hand-editing board is the cell where a learner first touches a pixel, so
// what matters is that the touching WORKS and that it cannot be skipped: drag
// a rectangle over the digits, press TỐI/SÁNG, watch the picture beside it
// change, and only then does XONG open. Pure maths lives in test-pixel-board.mjs;
// this is the part only a real browser can answer.
import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.stack || error.message));

const board = () => page.locator('.pbcell').first();
const digit = (row, col) => page.evaluate(([r, c]) => document.querySelector(`.pbcell .pbtable i[data-row="${r}"][data-col="${c}"]`)?.textContent, [row, col]);
const corner = () => page.evaluate(() => {
  const canvas = document.querySelector('.pbcell canvas');
  const d = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
});
async function dragOver(fromRow, fromCol, toRow, toCol) {
  const a = await board().locator(`.pbtable i[data-row="${fromRow}"][data-col="${fromCol}"]`).boundingBox();
  const b = await board().locator(`.pbtable i[data-row="${toRow}"][data-col="${toCol}"]`).boundingBox();
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 });
  await page.mouse.up();
}

try {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${BASE}/lessons/islandFXFORGE.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.nodeDev?.toPixelBoard, null, { timeout: 20_000 });
  await page.evaluate(() => window.nodeDev.toPixelBoard());     // stops AT the board, does not force past it
  await page.waitForSelector('.pbcell .pbtable i', { timeout: 30_000 });
  // the notebook smooth-scrolls a freshly revealed cell into view; dragging
  // while the page is still moving lands the pointer on the wrong cells
  await page.evaluate(() => new Promise(resolve => {
    let last = -1, still = 0;
    const tick = () => {
      const y = document.querySelector('.pbcell').getBoundingClientRect().top;
      still = Math.abs(y - last) < 0.5 ? still + 1 : 0; last = y;
      still >= 3 ? resolve() : requestAnimationFrame(tick);
    };
    tick();
  }));

  assert.equal(await board().evaluate(el => el.classList.contains('done')), false, 'the board must not arrive already finished');
  assert.equal(await board().locator('.pbgo').isDisabled(), true, 'XONG stays shut until the challenge is met');
  assert.equal(await board().locator('.pbup').isDisabled(), true, 'nothing to brighten before a selection exists');
  assert.equal(await page.locator('.pbcell .pbtable i').count(), 64, 'an 8×8 plate, every cell a readable digit');

  await dragOver(0, 0, 7, 3);
  assert.equal(await page.locator('.pbcell .pbtable i.on').count(), 32, 'the drag selects the left half');
  assert.equal(await board().locator('.pbdown').isDisabled(), false);
  assert.match(await board().locator('.pbstat').textContent(), /8×4/);

  const wasCorner = await corner(), wasDigit = Number(await digit(0, 0)), rightEdge = await digit(0, 7);
  await board().locator('.pbdown').click();
  assert.ok(Number(await digit(0, 0)) < wasDigit || wasDigit === 0, 'the digit under the selection drops');
  assert.notDeepEqual(await corner(), wasCorner, 'the picture beside the digits must change with them');
  assert.match(await board().locator('.pbgoal').textContent(), /đã đạt \d+\/32 ô/, 'progress counts up as they work');

  // the plate is dark, and clamping is per channel, so the darkest cells need a
  // few presses to be driven all the way to black — the challenge is met when
  // every cell in the left half has either dropped 100 or bottomed out
  let presses = 1;
  while (await board().locator('.pbgo').isDisabled() && presses < 8) { await board().locator('.pbdown').click(); presses++; }
  assert.equal(await board().locator('.pbgo').isDisabled(), false, `left half never went dark enough after ${presses} presses`);
  assert.ok(presses <= 6, `challenge should take a handful of presses, took ${presses}`);
  assert.match(await board().locator('.pbgoal').textContent(), /ĐẠT RỒI/);
  assert.equal(await digit(0, 7), rightEdge, 'the unselected half never moved');
  console.log(`  · left half went dark in ${presses} presses of TỐI −50`);

  await board().locator('.pbreset').click();
  assert.equal(Number(await digit(0, 0)), wasDigit, 'VỀ ẢNH GỐC restores the plate');
  assert.deepEqual(await corner(), wasCorner);
  assert.equal(await board().locator('.pbgo').isDisabled(), false, 'a met challenge stays met after going back to the original');
  assert.match(await board().locator('.pbgoal').textContent(), /ĐẠT RỒI/, 'and the line must not contradict the open button');

  await board().locator('.pbgo').click();
  await page.waitForFunction(() => document.querySelector('.pbcell')?.classList.contains('done'), null, { timeout: 5_000 });
  await page.waitForFunction(() => [...document.querySelectorAll('.cell')].some(cell => !cell.classList.contains('veiled') && cell.compareDocumentPosition(document.querySelector('.pbcell')) & Node.DOCUMENT_POSITION_PRECEDING), null, { timeout: 5_000 });

  assert.deepEqual(pageErrors, []);
  console.log('  ok — dragged a selection, shifted it by hand, watched the picture follow, and the cell gated until it did');
} finally {
  await browser.close();
}
