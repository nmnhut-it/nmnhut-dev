import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';
import N from './content/node08v2.js';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const cfg = N.cells.find(cell => cell.label === 'types_first_steps').execution;
const cases = [
  ['80pct', 1600, 1000], ['100pct', 1280, 800], ['125pct', 1024, 640],
  ['150pct', 854, 534], ['laptop-short', 1366, 640], ['mobile-small', 360, 640], ['mobile-tall', 390, 844],
];
const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const [name, width, height] of cases) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() => { const native = window.setTimeout.bind(window); window.setTimeout = (fn, delay = 0, ...args) => native(fn, Math.min(delay, 400), ...args); });
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: 'const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;' }));
    await page.goto(`${BASE}/lessons/dev-test.html?src=node08v2&only=code:types_first_steps`, { waitUntil: 'domcontentloaded' });
    const cell = page.locator('.code-trace'); await cell.waitFor({ state: 'visible' });
    const button = cell.locator('.ctcontrols button');
    for (let frame = 0; frame < cfg.frames.length; frame++) {
      const expected = cfg.frames[frame];
      const predictionOption = cell.locator('.ctpredict:not([hidden]) .ctpredict-option').first();
      if (await predictionOption.count()) await predictionOption.click();
      await button.click();
      await page.waitForFunction(line => { const cell = document.querySelector('.code-trace'); return cell?.dataset.phase === 'state' && cell.dataset.line === String(line); }, expected.line);
      const result = await cell.evaluate((element, line) => {
        const r = element.getBoundingClientRect();
        const viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
        const left = element.querySelector('.ctcode').getBoundingClientRect();
        const right = element.querySelector('.ctobserve').getBoundingClientRect();
        const overlap = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left)) * Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
        const internal = [...element.querySelectorAll('.ctfit,.ctlayout,.ctcode,.ctobserve')].map(node => ({ x: node.scrollWidth - node.clientWidth, y: node.scrollHeight - node.clientHeight })).filter(item => item.x > 1 || item.y > 1);
        return { active: element.querySelector('.ctline.active')?.dataset.line, scale: Number(element.dataset.scale), outside: Math.max(0, -r.left) + Math.max(0, r.right - viewport.width) + Math.max(0, -r.top) + Math.max(0, r.bottom - viewport.height), overlap, internal, docX: document.documentElement.scrollWidth - viewport.width, line };
      }, expected.line);
      if (result.active !== String(expected.line) || result.scale < .78 || result.outside > 1 || result.overlap > .5 || result.internal.length || result.docX > 1) failures.push(`${name}/frame${frame}: ${JSON.stringify(result)}`);
      assert.equal(await cell.locator('.ctoutput span').textContent(), expected.state.output.length ? expected.state.output.join(' → ') : '(trống)');
      await page.waitForFunction(() => document.querySelector('.code-trace')?.dataset.phase !== 'state');
    }
    await page.close();
  }
} finally { await browser.close(); }

assert.deepEqual(failures, [], failures.join('\n'));
console.log('node08 guided visual: every frame fits at zoom 80–150%, laptop-short and mobile with readable scale');
