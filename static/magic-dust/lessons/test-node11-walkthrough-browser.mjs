import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';
import N from './content/node11.js';
import { traceProgramCounter } from './engine/program-counter-cell.js';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const scenarios = [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];
const labels = ['one_card_machine', 'two_card_machine', 'three_card_machine', 'pc_order_machine', 'if_to_goto_machine', 'while_to_goto_machine'];
const configs = Object.fromEntries(labels.map(label => [label, N.cells.find(cell => cell.label === label).programCounter]));

const browser = await chromium.launch({ headless: true });
try {
  for (const scenario of scenarios) {
    const page = await browser.newPage({ viewport: scenario.viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      const nativeTimeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay = 0, ...args) => nativeTimeout(callback, Math.min(delay, 400), ...args);
    });
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({
      contentType: 'application/javascript',
      body: 'const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;',
    }));

    for (const label of labels) {
      const expected = traceProgramCounter(configs[label]).steps;
      await page.goto(`${BASE}/lessons/dev-test.html?src=node11&only=code:${label}`, { waitUntil: 'domcontentloaded' });
      const cell = page.locator('.program-counter');
      await cell.waitFor({ state: 'visible' });
      assert.equal(await page.locator('.walkthrough').count(), 0, `${scenario.name}/${label}: old line walkthrough must not render`);
      const button = cell.locator('.pccontrols button');
      if (label === 'one_card_machine') {
        assert.equal(await cell.locator('.pchistory').count(), 1, `${scenario.name}: punch-card history panel must be visible first`);
        assert.equal(await cell.locator('.punch-card-sample .punch-holes i').count(), 50, `${scenario.name}: physical punch-card hole grid must be visible`);
        assert.match(await cell.locator('.pchistory-copy').textContent(), /INPUT vật lý.*không phải bản sao chính xác/is);
        await button.click();
        await cell.locator('.pclayout').waitFor({ state: 'visible' });
      } else {
        assert.equal(await cell.locator('.pchistory').count(), 0, `${scenario.name}/${label}: history panel should not repeat`);
      }
      assert.match(await cell.locator('.pccontrols>span').textContent(), /không phải trình chạy từng dòng Python/i);
      assert.equal(await cell.locator('.pccard-holes i').count(), configs[label].cards.length * 24, `${scenario.name}/${label}: every program card must look punched`);

      const geometry = await cell.evaluate(element => {
        const box = element.getBoundingClientRect();
        const left = element.querySelector('.pcprogram').getBoundingClientRect();
        const right = element.querySelector('.pcmachine').getBoundingClientRect();
        const overlap = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left))
          * Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
        return { overflowX: element.scrollWidth - element.clientWidth, overlap, inViewport: box.left >= -1 && box.right <= innerWidth + 1 };
      });
      assert.ok(geometry.overflowX <= 1, `${scenario.name}/${label}: horizontal overflow`);
      assert.ok(geometry.overlap <= .5, `${scenario.name}/${label}: program and machine overlap (${geometry.overlap}px²)`);
      assert.equal(geometry.inViewport, true, `${scenario.name}/${label}: cell exceeds viewport`);

      for (let frame = 0; frame < expected.length; frame++) {
        const step = expected[frame];
        const predictionOption = cell.locator('.pcpredict:not([hidden]) .pcpredict-option').first();
        if (await predictionOption.count()) await predictionOption.click();
        await button.click();
        await page.waitForFunction(({ phase, pc, output }) => {
          const el = document.querySelector('.program-counter');
          return el?.dataset.phase === phase && el?.dataset.pc === String(pc) && el?.dataset.output === output.join('|');
        }, step);
        assert.equal(await cell.locator('.pcstate strong').textContent(), `pc = ${step.pc}`, `${scenario.name}/${label}/frame ${frame}: wrong pc`);
        assert.equal(await cell.locator('.pcoutput>div').textContent(), step.output.length ? step.output.join(' → ') : '(trống)', `${scenario.name}/${label}/frame ${frame}: wrong output`);
        if (step.memory) assert.match(await cell.locator('.pcmemory').textContent(), new RegExp(step.memory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.equal(await cell.locator('.pccard.active').count(), step.card === null ? 0 : 1, `${scenario.name}/${label}/frame ${frame}: wrong selected-card count`);
        if (step.card !== null) assert.equal(await cell.locator('.pccard.active').getAttribute('data-card'), String(step.card));
        await page.waitForFunction(() => document.querySelector('.program-counter')?.dataset.viewPhase !== 'state');
      }
      assert.deepEqual(errors, [], `${scenario.name}/${label}: page errors`);
    }
    await page.close();
  }
  console.log('node11 browser: every machine action is visible and correct on desktop/mobile');
} finally {
  await browser.close();
}
