import assert from 'node:assert/strict';
import { chromium } from './node_modules/playwright/index.mjs';
import N from './content/node11.js';
import { traceProgramCounter } from './engine/program-counter-cell.js';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const args = process.argv.slice(2);
const requestedCase = args.includes('--case') ? args[args.indexOf('--case') + 1] : null;
const requestedLabel = args.includes('--label') ? args[args.indexOf('--label') + 1] : null;
const cases = [
  { name: 'desktop-80pct', width: 1600, height: 1000 },
  { name: 'desktop-100pct', width: 1280, height: 800 },
  { name: 'desktop-125pct', width: 1024, height: 640 },
  { name: 'desktop-150pct', width: 854, height: 534 },
  { name: 'laptop-short', width: 1366, height: 640 },
  { name: 'mobile-small', width: 360, height: 640 },
  { name: 'mobile-tall', width: 390, height: 844 },
].filter(item => !requestedCase || item.name === requestedCase);
const labels = ['one_card_machine', 'two_card_machine', 'three_card_machine', 'pc_order_machine', 'if_to_goto_machine', 'while_to_goto_machine'].filter(label => !requestedLabel || label === requestedLabel);
assert.ok(cases.length && labels.length, 'unknown node11 visual case or label');
const configs = Object.fromEntries(labels.map(label => [label, N.cells.find(cell => cell.label === label).programCounter]));
const machineSelectors = ['.pccard', '.pccycle', '.pcstate', '.pcmemory', '.pcoutput', '.pcpip', '.pccontrols'];
const machinePairs = [
  ['.pcprogram', '.pcmachine'], ['.pclayout', '.pccontrols'],
  ['.pccycle', '.pcstate'], ['.pcstate', '.pcmemory'], ['.pcmemory', '.pcoutput'], ['.pcstate', '.pcoutput'], ['.pcoutput', '.pcpip'],
];

async function measure(cell, selectors, pairs) {
  return cell.evaluate((element, spec) => {
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };
    const area = r => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top);
    const intersect = (a, b) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });
    const viewport = { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight };
    const overlapArea = (a, b) => area(intersect(rect(a), rect(b)));
    const visibleRatio = node => {
      let visible = intersect(rect(node), viewport);
      for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (/(hidden|auto|scroll|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`)) visible = intersect(visible, rect(parent));
      }
      return area(visible) / Math.max(1, area(rect(node)));
    };
    const clipped = spec.selectors.flatMap(selector => [...element.querySelectorAll(selector)]
      .filter(node => getComputedStyle(node).display !== 'none')
      .map((node, index) => ({ selector, index, ratio: visibleRatio(node) })))
      .filter(item => item.ratio < .995);
    const scrollContainers = ['.pcfit', '.pclayout', '.pcprogram', '.pcmachine'].map(selector => {
      const node = element.querySelector(selector);
      return { selector, overflowX: node.scrollWidth - node.clientWidth, overflowY: node.scrollHeight - node.clientHeight };
    }).filter(item => item.overflowX > 1 || item.overflowY > 1);
    const overlaps = spec.pairs.map(([a, b]) => {
      const left = element.querySelector(a), right = element.querySelector(b);
      return { a, b, area: left && right && getComputedStyle(left).display !== 'none' && getComputedStyle(right).display !== 'none' ? overlapArea(left, right) : 0 };
    }).filter(item => item.area > .5);
    const cellRect = rect(element);
    return {
      viewport: { width: viewport.right, height: viewport.bottom },
      scale: Number(element.dataset.scale || 1),
      documentOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      cellOutsideX: Math.max(0, viewport.left - cellRect.left) + Math.max(0, cellRect.right - viewport.right),
      cellOutsideY: Math.max(0, viewport.top - cellRect.top) + Math.max(0, cellRect.bottom - viewport.bottom),
      clipped, scrollContainers, overlaps,
    };
  }, { selectors, pairs });
}

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const viewport of cases) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    await page.addInitScript(() => {
      const nativeTimeout = window.setTimeout.bind(window);
      window.setTimeout = (callback, delay = 0, ...args) => nativeTimeout(callback, Math.min(delay, 400), ...args);
    });
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({
      contentType: 'application/javascript',
      body: 'const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;',
    }));

    for (const label of labels) {
      await page.goto(`${BASE}/lessons/dev-test.html?src=node11&only=code:${label}`, { waitUntil: 'domcontentloaded' });
      const cell = page.locator('.program-counter');
      await cell.waitFor({ state: 'visible' });
      await page.addStyleTag({ content: '.cell{animation:none!important}' });
      await page.waitForTimeout(80);
      await cell.evaluate(element => element.scrollIntoView({ block: 'start' }));

      const record = async (stage, selectors, pairs) => {
        await page.waitForTimeout(50);
        const result = await measure(cell, selectors, pairs);
        const problems = [];
        if (result.documentOverflowX > 1) problems.push(`document overflow x=${result.documentOverflowX}`);
        if (result.cellOutsideX > 1) problems.push(`cell outside viewport x=${result.cellOutsideX}`);
        if (result.cellOutsideY > 1) problems.push(`cell outside viewport y=${result.cellOutsideY}`);
        if (result.clipped.length) problems.push(`clipped=${JSON.stringify(result.clipped)}`);
        if (result.scrollContainers.length) problems.push(`internal scrollbar=${JSON.stringify(result.scrollContainers)}`);
        if (result.overlaps.length) problems.push(`overlap=${JSON.stringify(result.overlaps)}`);
        if (problems.length) {
          failures.push(`${viewport.name}/${label}/${stage}: ${problems.join('; ')}`);
          await page.screenshot({ path: `test-results/node11-visual-failure-${viewport.name}-${label}-${stage}.png`, fullPage: true });
        }
      };

      const button = cell.locator('.pccontrols button');
      if (label === 'one_card_machine') {
        await record('history', ['.pchistory-art', '.pchistory-copy', '.punch-card-sample', '.pccontrols'], [['.pchistory-art', '.pchistory-copy'], ['.pchistory', '.pccontrols']]);
        await button.click();
        await cell.locator('.pclayout').waitFor({ state: 'visible' });
      }
      const frames = traceProgramCounter(configs[label]).steps;
      for (let frame = 0; frame < frames.length; frame++) {
        const predictionOption = cell.locator('.pcpredict:not([hidden]) .pcpredict-option').first();
        if (await predictionOption.count()) {
          await record(`predict-${frame}`, ['.pcpredict', '.pcprogram', '.pccontrols'], [['.pcprogram', '.pcpredict'], ['.pcpredict', '.pccontrols']]);
          await predictionOption.click();
        }
        await button.click();
        await page.waitForFunction(() => document.querySelector('.program-counter')?.dataset.viewPhase === 'state');
        await record(`machine-${frame}`, machineSelectors, machinePairs);
        await page.waitForFunction(() => document.querySelector('.program-counter')?.dataset.viewPhase !== 'state');
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}

assert.deepEqual(failures, [], `node11 visual failures:\n${failures.join('\n')}`);
console.log(`node11 visual: every one of ${cases.length * labels.reduce((sum, label) => sum + traceProgramCounter(configs[label]).steps.length, 1)} history/machine frames fits one viewport, with scrollbar gutter accounted for`);
