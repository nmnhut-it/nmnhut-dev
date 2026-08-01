import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const captureDir = process.env.WALKTHROUGH_CAPTURE_DIR || '';
if (captureDir) await mkdir(captureDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of [{ width: 768, height: 900 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
    const page = await browser.newPage({ viewport });
    await page.route('https://cdn.jsdelivr.net/pyodide/**', route => route.fulfill({ contentType: 'application/javascript', body: `self.loadPyodide=async()=>({FS:{writeFile(){}},runPythonAsync:async()=>{}});` }));
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: `
      (()=>{window.monaco={KeyMod:{Shift:1},KeyCode:{Enter:2},editor:{defineTheme(){},create(_h,o){let value=o.value;return{getValue:()=>value,setValue:v=>value=String(v),getModel:()=>({getLineCount:()=>value.split('\\n').length}),onDidChangeModelContent:()=>({dispose(){}}),addCommand(){},layout(){}}}}};const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;})();
    ` }));
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`${BASE}/lessons/islandPHOTOLIGHTS.html?v=responsive-test`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.nodeDev?.toCell); await page.evaluate(() => window.nodeDev.toCell('walk_mot_bong'));
    const cell = page.locator('.walkthrough').filter({ hasText: 'BƯỚC 1 — MỘT DÒNG' }); await cell.waitFor({ state: 'visible' });
    const report = await page.evaluate(() => {
      const pick = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
      const all = [...document.querySelectorAll('body *')].map(el => ({ el, rect: el.getBoundingClientRect() })).filter(item => item.rect.right > innerWidth + 1 || item.rect.left < -1);
      return {
        viewport: innerWidth, viewportHeight: innerHeight, scrollWidth: document.documentElement.scrollWidth,
        cell: pick('.walkthrough'), layout: pick('.wtlayout'), code: pick('.wtcode'), observe: pick('.wtobserve'), controls: pick('.wtcontrols'),
        columns: getComputedStyle(document.querySelector('.wtlayout')).gridTemplateColumns,
        overflow: all.slice(0, 12).map(item => ({ cls: item.el.className, tag: item.el.tagName, left: item.rect.left, right: item.rect.right, width: item.rect.width })),
      };
    });
    if (captureDir) await cell.screenshot({ path: path.join(captureDir, `responsive-${viewport.width}.png`) });
    assert.ok(report.scrollWidth <= report.viewport + 1, JSON.stringify(report));
    for (const key of ['cell', 'layout', 'code', 'observe', 'controls']) assert.ok(report[key].left >= -1 && report[key].right <= report.viewport + 1, `${key}: ${JSON.stringify(report)}`);
    assert.equal(report.columns.split(' ').length, viewport.width > 640 ? 2 : 1, `unexpected walkthrough columns at ${viewport.width}px`);
    assert.ok(report.cell.height <= report.viewportHeight, `walkthrough should fit one viewport at ${viewport.width}px: ${JSON.stringify(report)}`);
    console.log(`  ok — walkthrough fits ${viewport.width}px without horizontal overflow`); await page.close();
  }
} finally { await browser.close(); }
