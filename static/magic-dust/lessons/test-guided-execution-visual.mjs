import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';
import { GUIDED_NODE_CONTRACTS } from './node08-15-quality-contract.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const args = process.argv.slice(2);
const requestedNode = args.includes('--node') ? args[args.indexOf('--node') + 1] : null;
const requestedCase = args.includes('--case') ? args[args.indexOf('--case') + 1] : null;
const contracts = Object.entries(GUIDED_NODE_CONTRACTS).filter(([name]) => !requestedNode || name === requestedNode);
assert.ok(contracts.length, requestedNode ? `unknown node contract: ${requestedNode}` : 'no node contracts');

const cases = [
  ['80pct', 1600, 1000], ['100pct', 1280, 800], ['125pct', 1024, 640],
  ['150pct', 854, 534], ['laptop-short', 1366, 640], ['mobile-small', 360, 640], ['mobile-tall', 390, 844],
].filter(([name]) => !requestedCase || name === requestedCase);
assert.ok(cases.length, requestedCase ? `unknown visual case: ${requestedCase}` : 'no visual cases');
const browser = await chromium.launch({ headless: true });
const failures = [];
let checked = 0;

try {
  for (const [nodeName, contract] of contracts) {
    const lesson = (await import(`./content/${contract.file.split('/').pop()}?visual=${Date.now()}`)).default;
    const traces = lesson.cells.filter(cell => cell.execution);
    for (const traceCell of traces) {
      assert.ok(traceCell.label, `${nodeName}: every execution cell needs a stable label for visual testing`);
      for (const [caseName, width, height] of cases) {
        const page = await browser.newPage({ viewport: { width, height } });
        await page.addInitScript(() => {
          const native = window.setTimeout.bind(window);
          window.setTimeout = (fn, delay = 0, ...rest) => native(fn, Math.min(delay, 400), ...rest);
        });
        await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: 'const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;' }));
        const only = encodeURIComponent(`code:${traceCell.label}`);
        await page.goto(`${BASE}/lessons/dev-test.html?src=${nodeName}&only=${only}`, { waitUntil: 'domcontentloaded' });
        const cell = page.locator('.code-trace');
        await cell.waitFor({ state: 'visible' });
        const button = cell.locator('.ctcontrols button');
        const measure = () => cell.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const viewport = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
          const code = element.querySelector('.ctcode').getBoundingClientRect();
          const observe = element.querySelector('.ctobserve').getBoundingClientRect();
          const overlap = Math.max(0, Math.min(code.right, observe.right) - Math.max(code.left, observe.left)) * Math.max(0, Math.min(code.bottom, observe.bottom) - Math.max(code.top, observe.top));
          const internal = [...element.querySelectorAll('.ctfit,.ctlayout,.ctcode,.ctobserve')]
            .map(node => ({ x: node.scrollWidth - node.clientWidth, y: node.scrollHeight - node.clientHeight }))
            .filter(item => item.x > 1 || item.y > 1);
          return {
            active: element.querySelector('.ctline.active')?.dataset.line,
            phase: element.dataset.phase,
            scale: Number(element.dataset.scale),
            outside: Math.max(0, -rect.left) + Math.max(0, rect.right - viewport.width) + Math.max(0, -rect.top) + Math.max(0, rect.bottom - viewport.height),
            overlap, internal, docX: document.documentElement.scrollWidth - viewport.width,
          };
        });
        for (let frame = 0; frame < traceCell.execution.frames.length; frame++) {
          const expected = traceCell.execution.frames[frame];
          const predictionOption = cell.locator('.ctpredict:not([hidden]) .ctpredict-option').first();
          if (await predictionOption.count()) {
            const predictionResult = await measure();
            if (predictionResult.active !== String(expected.line) || predictionResult.scale < .78 || predictionResult.outside > 1 || predictionResult.overlap > .5 || predictionResult.internal.length || predictionResult.docX > 1) failures.push(`${nodeName}/${traceCell.label}/${caseName}/frame${frame + 1}/predict: ${JSON.stringify(predictionResult)}`);
            await predictionOption.click();
          }
          await button.click();
          await page.waitForFunction(line => { const cell = document.querySelector('.code-trace'); return cell?.dataset.phase === 'state' && cell.dataset.line === String(line); }, expected.line);
          const result = await measure();
          if (result.active !== String(expected.line) || result.scale < .78 || result.outside > 1 || result.overlap > .5 || result.internal.length || result.docX > 1) {
            failures.push(`${nodeName}/${traceCell.label}/${caseName}/frame${frame + 1}: ${JSON.stringify(result)}`);
          }
          const expectedOutput = expected.state.output.length ? expected.state.output.join(' → ') : '(trống)';
          assert.equal(await cell.locator('.ctoutput span').textContent(), expectedOutput, `${nodeName}/${traceCell.label}/frame${frame + 1}: wrong visible OUTPUT`);
          await page.waitForFunction(() => document.querySelector('.code-trace')?.dataset.phase !== 'state');
          checked++;
        }
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}

assert.ok(checked > 0, requestedNode ? `${requestedNode}: no execution frames found` : 'no execution frames found');
assert.deepEqual(failures, [], failures.join('\n'));
console.log(`guided execution visual gate: ${checked} frame/view combinations fit without hidden content or overlap`);
