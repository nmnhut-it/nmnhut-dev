import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const browser = await chromium.launch({ headless: true });

async function advance(cell) {
  const button = cell.locator('.wtcontrols button');
  await button.click();
  await cell.page().waitForFunction(element => !element.querySelector('.wtcontrols button').disabled, await cell.elementHandle(), { timeout: 5_000 });
  await cell.page().waitForTimeout(20);
  const fit = await cell.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const active = element.querySelector('.wtline.active')?.getBoundingClientRect();
    const code = element.querySelector('.wtcode')?.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      activeVisible: !active || !code || (active.top >= code.top - 1 && active.bottom <= code.bottom + 1),
      scrollY,
    };
  });
  assert.equal(fit.activeVisible, true, 'the active source line must auto-scroll inside the code panel');
  assert.ok(fit.top >= 60 && fit.bottom <= await cell.page().evaluate(() => innerHeight + 3), 'walkthrough controls must stay inside the viewport');
  return fit.scrollY;
}

async function openWalkthrough(page, label, title) {
  await page.evaluate(target => window.nodeDev.toCell(target), label);
  const cell = page.locator('.walkthrough').filter({ hasText: title }).last();
  await cell.waitFor({ state: 'visible', timeout: 10_000 });
  assert.match(await cell.locator('.wtcontrols button').textContent(), /BẮT ĐẦU/);
  return cell;
}

try {
  for (const viewport of [{ width: 1024, height: 640 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://cdn.jsdelivr.net/pyodide/**', route => route.fulfill({ contentType: 'application/javascript', body: 'self.loadPyodide=async()=>({FS:{writeFile(){}},runPythonAsync:async()=>{}})' }));
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`${BASE}/lessons/lesson22v2.html?noentry&particle-principles-test`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.nodeDev?.toCell);

    const one = await openWalkthrough(page, 'particle_cycle_walkthrough', 'TỪ MỘT HẠT ĐỨNG YÊN');
    const oneScroll = [];
    oneScroll.push(await advance(one)); // stage
    oneScroll.push(await advance(one)); // dictionary
    oneScroll.push(await advance(one)); // first visible particle
    const initial = await page.locator('.studio-particle-frame > i').last().evaluate(element => ({ left: element.style.left, top: element.style.top, fontSize: element.style.fontSize }));
    assert.deepEqual(initial, { left: '50%', top: '15%', fontSize: '42px' });
    assert.match(await page.locator('.studio-particle-guide').textContent(), /Particle vừa xuất hiện.*x = 50, y = 15.*chưa có UPDATE/s);
    for (let index = 0; index < 4; index++) oneScroll.push(await advance(one)); // speed, move, scale, render
    const moved = await page.locator('.studio-particle-frame > i').last().evaluate(element => ({ top: element.style.top, fontSize: element.style.fontSize }));
    assert.deepEqual(moved, { top: '23%', fontSize: '35px' });
    assert.match(await page.locator('.studio-particle-guide').textContent(), /MOVE \+ SCALE.*15 → 23.*3 → 2.5/s);
    oneScroll.push(await advance(one));
    oneScroll.push(await advance(one));
    assert.match(await page.locator('.studio-particle-guide').textContent(), /KẾT QUẢ.*15 → 39.*3 → 1.5/s);
    assert.ok(Math.max(...oneScroll) - Math.min(...oneScroll) <= 2, 'one-particle steps must not scroll the page');

    const snow = await openWalkthrough(page, 'snowfall_principles_walkthrough', 'TỪ MỘT PARTICLE ĐẾN FX TUYẾT RƠI');
    const snowScroll = [];
    for (let index = 0; index < 5; index++) snowScroll.push(await advance(snow));
    assert.equal(await page.locator('.studio-particle-frame > i').count(), 6);
    assert.match(await page.locator('.studio-particle-guide').textContent(), /Sáu dictionary.*count 6.*vy 4\.\.8/s);
    snowScroll.push(await advance(snow));
    const flakes = await page.locator('.studio-particle-frame > i').evaluateAll(elements => elements.map(element => element.style.top));
    assert.ok(new Set(flakes).size > 2, 'random initial state and per-particle speed must produce visibly different snow positions');
    snowScroll.push(await advance(snow));
    snowScroll.push(await advance(snow));
    assert.ok(Math.max(...snowScroll) - Math.min(...snowScroll) <= 2, 'snow steps must not scroll the page');
    assert.deepEqual(errors, []);
    console.log(`  ok — one particle, speed, scale, many particles, random and snow at ${viewport.width}x${viewport.height}`);
    await page.close();
  }
} finally {
  await browser.close();
}

console.log('\nparticle principles walkthrough: ok');
