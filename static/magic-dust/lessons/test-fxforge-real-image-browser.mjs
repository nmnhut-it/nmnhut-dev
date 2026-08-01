// Requires `python serve.py 8123` and Playwright Chromium.
//
// The FX-forge island's transform exercises must run on the REAL picture, not
// on a 16x16 grid paired with a pre-baked "correct" plate — a learner's wrong
// flip has to look wrong, and their right flip has to look right. That needs
// three things to hold at once, all checked here against the running island:
//   1. a 256x256 plate survives the bridge (py-bridge's reply buffer used to cap
//      at 64KB, which is why the lessons were stuck on pixel mush);
//   2. the whole run stays under a second — 512 is the plates' native size but
//      costs 2-3.5s per RUN in bridge JSON, for detail a ~340px frame cannot show;
//   3. the viewer draws THEIR grid at that size, with no plate photo beside it.
import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const CELL = 'viet_lenh_lat_anh.py';
const SIDE = 256;
const RUN_BUDGET_MS = 4000;
// The rest of the island's transform cells, each run from its own solution:
// same three guarantees, plus the one teaching cell that must KEEP its coarse
// grid and readable digits — pixels are how the idea is introduced.
const SWEEP = [
  { cell: 'chinh_do_sang_ca_tam_anh.py', side: SIDE, panels: 3, photos: 0, says: [/EVERY CELL LOST 50 LIGHT/, /NOTHING WENT BELOW 0/, /ALL CHANNELS WITHIN 255/, /EFFECT AREA GOT BRIGHTER/] },
  { cell: 'viet_lenh_cong_hai_lop.py', side: SIDE, panels: 3, photos: 0, says: [/ALL CHANNELS WITHIN 255/, /EFFECT AREA GOT BRIGHTER/] },
  // The burn cell is the one exercise whose verdict depends on real artwork:
  // a flat stub has no partially-overflowing pixel, so only a real bright base
  // proves the learner's if actually fired.
  { cell: 'chay_trang_thay_vi_lech_mau.py', side: SIDE, panels: 2, photos: 0, says: [/OVERBRIGHT CELLS BURNED WHITE/, /CALM CELLS KEPT THEIR COLOUR/] },
  { cell: 'giai_cau_do_mo_man.py', side: SIDE, panels: 4, photos: 1, says: [/DRAGON IS OVER THE BEAST/] },
  { cell: 'tu_to_mot_vung.py', side: 8, panels: 2, photos: 1, says: [/^16$/m], numbers: true },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.stack || error.message));

const readPanels = () => page.evaluate(() => [...document.querySelectorAll('.ilab-panel')].map(panel => ({
  label: panel.querySelector('.ilab-cap')?.textContent || '',
  canvases: [...panel.querySelectorAll('canvas.ilab-art')].map(c => ({ w: c.width, h: c.height })),
  photos: panel.querySelectorAll('img.ilab-photo').length,
  numbers: !!panel.querySelector('.ilab-nums'),
  tags: [...panel.querySelectorAll('.ilab-tag')].map(t => t.textContent),
})));

async function openCell(label) {
  await page.evaluate(target => window.nodeDev.toCell(target), label);
  await page.waitForFunction(target => {
    const cell = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    const button = cell?.querySelector('.crun');
    return !!(cell?._editor && button && !button.disabled);
  }, label, { timeout: 60_000 });
  return page.locator('.codecell').filter({ hasText: label }).first();
}

// Runs a cell from its own author solution, so the sweep checks the shipped
// answer end-to-end rather than a copy that can drift away from the content.
async function runSolution(label) {
  const cell = await openCell(label);
  await cell.locator('.csolution').click();
  await page.waitForFunction(target => {
    const host = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    return host?._editor?.getValue().includes('compare_frames');
  }, label, { timeout: 10_000 });
  const started = Date.now();
  await cell.locator('.crun').click({ force: true });
  await page.locator('.ilab').waitFor({ state: 'visible', timeout: RUN_BUDGET_MS });
  const elapsed = Date.now() - started;
  const panels = await readPanels();
  await page.locator('.ilab-go').click();
  await page.locator('.ilab').waitFor({ state: 'detached', timeout: 10_000 }).catch(() => {});
  await page.waitForFunction(target => [...document.querySelectorAll('.codecell')]
    .some(item => item.textContent.includes(target) && item.classList.contains('done')), label, { timeout: 20_000 });
  return { elapsed, panels, output: await cell.innerText() };
}

try {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${BASE}/lessons/islandFXFORGE.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.nodeDev?.toCell, null, { timeout: 15_000 });
  await page.evaluate(target => window.nodeDev.toCell(target), CELL);
  await page.waitForFunction(target => {
    const cell = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    const button = cell?.querySelector('.crun');
    return !!(cell?._editor && button && !button.disabled);
  }, CELL, { timeout: 60_000 });

  const cell = page.locator('.codecell').filter({ hasText: CELL }).first();
  // type the correct flip, the same line the solution holds
  await page.evaluate(target => {
    const host = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    host._editor.setValue(host._editor.getValue().replace('fx[row][col]  # lượt của bạn: đổi thành ô đối xứng', 'fx[row][last - col]'));
  }, CELL);

  const started = Date.now();
  await cell.locator('.crun').click({ force: true });
  const lab = page.locator('.ilab');
  try { await lab.waitFor({ state: 'visible', timeout: RUN_BUDGET_MS }); }
  catch (error) {
    const state = await page.evaluate(target => { const host = [...document.querySelectorAll('.codecell')].find(i => i.textContent.includes(target)); return { text: host?.innerText.slice(-1500), py: document.querySelector('#pystat')?.textContent }; }, CELL);
    throw new Error(`no viewer after the run: ${JSON.stringify(state)}`, { cause: error });
  }
  const elapsed = Date.now() - started;

  const frames = await page.evaluate(() => [...document.querySelectorAll('.ilab-panel')].map(panel => ({
    label: panel.querySelector('.ilab-cap')?.textContent || '',
    canvases: [...panel.querySelectorAll('canvas.ilab-art')].map(c => ({ w: c.width, h: c.height })),
    photos: panel.querySelectorAll('img.ilab-photo').length,
    tags: [...panel.querySelectorAll('.ilab-tag')].map(t => t.textContent),
  })));

  assert.equal(frames.length, 2, 'BEFORE and AFTER, nothing else');
  for (const frame of frames) {
    assert.deepEqual(frame.canvases, [{ w: SIDE, h: SIDE }], `${frame.label} must draw the learner's own ${SIDE}x${SIDE} pixels`);
    assert.equal(frame.photos, 0, `${frame.label} must not sit beside a pre-baked plate photo`);
    const wanted = /AFTER/.test(frame.label) ? /KẾT QUẢ — chính đoạn code của bạn/ : /ẢNH VÀO — tấm máy đưa cho bạn/;
    assert.ok(frame.tags.every(tag => wanted.test(tag)),
      `${frame.label} must say whether it is their result or the machine's input: ${frame.tags.join(' | ')}`);
  }

  // the flip really happened: row 0 of AFTER is row 0 of BEFORE, reversed
  const flipped = await page.evaluate(side => {
    const rowOf = index => {
      const canvas = document.querySelectorAll('.ilab-panel')[index].querySelector('canvas.ilab-art');
      const pixels = canvas.getContext('2d').getImageData(0, 0, side, 1).data;
      return Array.from({ length: side }, (_, c) => [pixels[c * 4], pixels[c * 4 + 1], pixels[c * 4 + 2]].join(','));
    };
    return { before: rowOf(0), after: rowOf(1) };
  }, SIDE);
  assert.deepEqual(flipped.after, [...flipped.before].reverse(), 'AFTER must be BEFORE mirrored, pixel for pixel');
  assert.notDeepEqual(flipped.after, flipped.before, 'the plate must not be left-right symmetric, or this proves nothing');

  await page.locator('.ilab-go').click();
  await page.waitForFunction(target => [...document.querySelectorAll('.codecell')]
    .some(item => item.textContent.includes(target) && item.classList.contains('done')), CELL, { timeout: 15_000 });
  const output = await cell.innerText();
  assert.ok(/IMAGE CHANGED SIDES/.test(output) && /TWO FLIPS RESTORE THE SOURCE/.test(output), `Pip must grade after the viewer: ${output.slice(-400)}`);
  assert.ok(output.indexOf('IMAGE CHANGED SIDES') > 0, 'the grade is printed once the learner has seen the result');

  assert.ok(elapsed < RUN_BUDGET_MS, `a ${SIDE}x${SIDE} flip took ${elapsed}ms`);
  console.log(`  ok — real ${SIDE}x${SIDE} plate flipped by the learner's own loop in ${elapsed}ms, drawn from their pixels`);

  for (const step of SWEEP) {
    const { elapsed: took, panels, output } = await runSolution(step.cell);
    assert.equal(panels.length, step.panels, `${step.cell} panel count`);
    const gridded = panels.filter(panel => panel.canvases.length);
    assert.ok(gridded.length > 0, `${step.cell} must draw the learner's own pixels`);
    for (const panel of gridded) assert.deepEqual(panel.canvases, [{ w: step.side, h: step.side }], `${step.cell} · ${panel.label}`);
    assert.equal(panels.reduce((n, panel) => n + panel.photos, 0), step.photos, `${step.cell} plate photos (only a GOAL reference card may be one)`);
    assert.equal(panels.some(panel => panel.numbers), !!step.numbers, `${step.cell} digit table: on only for the coarse teaching grid`);
    for (const line of step.says) assert.match(output, line, `${step.cell} output`);
    // every panel explains itself: their result, a readable grid, shipped artwork
    for (const panel of panels) for (const tag of panel.tags) {
      assert.match(tag, /KẾT QUẢ|ẢNH VÀO|LƯỚI SỐ|ẢNH GỐC|ẢNH MẪU/, `${step.cell} · ${panel.label} unexplained panel: ${tag}`);
    }
    if (step.numbers) assert.ok(panels.some(panel => panel.tags.some(tag => /LƯỚI SỐ/.test(tag))), `${step.cell} coarse grid must say it is not the real picture`);
    if (step.photos) assert.ok(panels.some(panel => panel.tags.some(tag => /ẢNH GỐC|ẢNH MẪU/.test(tag))), `${step.cell} shipped artwork must say it is not their result`);
    assert.ok(panels.some(panel => panel.tags.some(tag => /KẾT QUẢ/.test(tag))), `${step.cell} must mark the panel the learner's code built`);
    assert.ok(took < RUN_BUDGET_MS, `${step.cell} took ${took}ms`);
    console.log(`  ok — ${step.cell} ran on ${step.side}x${step.side} in ${took}ms`);
  }

  assert.deepEqual(pageErrors, []);
} finally {
  await browser.close();
}
