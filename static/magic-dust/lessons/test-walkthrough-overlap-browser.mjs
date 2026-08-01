import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from './node_modules/playwright/index.mjs';

const BASE = process.env.MAGIC_DUST_URL || 'http://127.0.0.1:8123';
const outDir = process.env.WALKTHROUGH_CAPTURE_DIR || path.resolve('tmp/walkthrough-overlap');
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];

async function metrics(page, viewport, state) {
  const report = await page.evaluate(({ viewport, state }) => {
    const shape = r => ({ x: r.left, y: r.top, left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: Math.max(0, r.right - r.left), height: Math.max(0, r.bottom - r.top) });
    const rawRect = el => shape(el.getBoundingClientRect());
    const visibleRect = el => {
      let box = rawRect(el), parent = el.parentElement;
      while (parent && box.width > 0 && box.height > 0) {
        const style = getComputedStyle(parent), clipX = /(auto|scroll|hidden|clip)/.test(style.overflowX), clipY = /(auto|scroll|hidden|clip)/.test(style.overflowY);
        if (clipX || clipY) {
          const p = rawRect(parent);
          if (clipX) { box.left = Math.max(box.left, p.left); box.right = Math.min(box.right, p.right); }
          if (clipY) { box.top = Math.max(box.top, p.top); box.bottom = Math.min(box.bottom, p.bottom); }
          box = shape(box);
        }
        parent = parent.parentElement;
      }
      box.left = Math.max(0, box.left); box.right = Math.min(innerWidth, box.right); box.top = Math.max(0, box.top); box.bottom = Math.min(innerHeight, box.bottom);
      return shape(box);
    };
    const rect = selector => { const el = document.querySelector(selector); return el ? visibleRect(el) : null; };
    const overlap = (a, b) => {
      if (!a || !b) return { width: 0, height: 0, area: 0, ratio: 0 };
      const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      const area = width * height, smaller = Math.max(1, Math.min(a.width * a.height, b.width * b.height));
      return { width, height, area, ratio: area / smaller };
    };
    const boxes = {
      header: rect('.hdr'), cell: rect('.walkthrough:not(.veiled)'), head: rect('.walkthrough:not(.veiled) .wthead'),
      code: rect('.walkthrough:not(.veiled) .wtcode'), observe: rect('.walkthrough:not(.veiled) .wtobserve'),
      scene: rect('.walkthrough:not(.veiled) .wtscene'), pip: rect('.walkthrough:not(.veiled) .wtpip'),
      memory: rect('.walkthrough:not(.veiled) .wtmemory'), controls: rect('.walkthrough:not(.veiled) .wtcontrols'),
      next: rect('.walkthrough:not(.veiled) .wtcontrols button'), activeLine: rect('.walkthrough:not(.veiled) .wtline.active'),
      startButton: rect('.light-board-start button'), bulb: rect('.light-board-bulb'),
    };
    const rawBoxes = Object.fromEntries(Object.entries({
      header: '.hdr', cell: '.walkthrough:not(.veiled)', head: '.walkthrough:not(.veiled) .wthead', code: '.walkthrough:not(.veiled) .wtcode', observe: '.walkthrough:not(.veiled) .wtobserve',
      scene: '.walkthrough:not(.veiled) .wtscene', pip: '.walkthrough:not(.veiled) .wtpip', memory: '.walkthrough:not(.veiled) .wtmemory', controls: '.walkthrough:not(.veiled) .wtcontrols',
    }).map(([name, selector]) => { const el = document.querySelector(selector); return [name, el ? rawRect(el) : null]; }));
    const pairs = [['header','cell'],['header','head'],['code','observe'],['scene','pip'],['pip','memory'],['memory','controls'],['scene','controls'],['activeLine','observe']];
    const overlaps = Object.fromEntries(pairs.map(([a,b]) => [`${a}:${b}`, overlap(boxes[a], boxes[b])]));
    const outside = Object.fromEntries(Object.entries(boxes).filter(([, b]) => b).map(([name, b]) => [name, {
      left: Math.max(0, -b.left), right: Math.max(0, b.right - innerWidth), top: Math.max(0, -b.top), bottom: Math.max(0, b.bottom - innerHeight),
    }]));
    return { viewport, state, innerWidth, innerHeight, scrollWidth: document.documentElement.scrollWidth, observeScale: Number(document.querySelector('.wtobserve-shell')?.dataset.scale || 1), boxes, rawBoxes, overlaps, outside };
  }, { viewport, state });
  reports.push(report); return report;
}

function assertNoAccidentalOverlap(report) {
  assert.ok(report.scrollWidth <= report.innerWidth + 1, JSON.stringify(report));
  assert.ok(report.observeScale >= .82 && report.observeScale <= 1, `invalid right-column scale: ${report.observeScale}`);
  for (const key of ['header:cell','header:head','code:observe','scene:pip','pip:memory','memory:controls','scene:controls','activeLine:observe']) {
    assert.ok(report.overlaps[key].area <= 1, `${key} overlaps in ${report.viewport.width} ${report.state}: ${JSON.stringify({ overlap: report.overlaps[key], a: report.boxes[key.split(':')[0]], b: report.boxes[key.split(':')[1]] })}`);
  }
  for (const key of ['cell','head','code','observe','scene','pip','memory','controls','next','activeLine']) {
    const outside = report.outside[key]; if (!outside) continue;
    assert.ok(outside.left <= 1 && outside.right <= 1, `${key} outside horizontally: ${JSON.stringify(report)}`);
  }
  for (const key of ['cell','head','controls','next']) {
    const outside = report.outside[key]; if (!outside) continue;
    assert.ok(outside.top <= 1 && outside.bottom <= 1, `${key} outside vertically: ${JSON.stringify(report)}`);
  }
  if (report.boxes.startButton) {
    const b = report.boxes.startButton, scene = report.boxes.scene;
    assert.ok(b.left >= scene.left && b.right <= scene.right && b.top >= scene.top && b.bottom <= scene.bottom, 'BẮT ĐẦU must stay inside scene');
  }
  if (report.boxes.bulb) {
    const b = report.boxes.bulb, scene = report.boxes.scene;
    assert.ok(b.left >= scene.left && b.right <= scene.right && b.top >= scene.top && b.bottom <= scene.bottom, 'bulb must stay inside scene');
  }
}

try {
  const cases = [
    { width: 1600, height: 1000, physical: '1280x800', zoom: 0.8 },
    { width: 1280, height: 800, physical: '1280x800', zoom: 1 },
    { width: 1024, height: 640, physical: '1280x800', zoom: 1.25 },
    { width: 853, height: 533, physical: '1280x800', zoom: 1.5 },
    { width: 768, height: 900, physical: '768x900', zoom: 1 },
    { width: 390, height: 844, physical: '390x844', zoom: 1 },
    { width: 360, height: 800, physical: '360x800', zoom: 1 },
  ];
  for (const viewport of cases) {
    const page = await browser.newPage({ viewport });
    await page.route('https://cdn.jsdelivr.net/pyodide/**', route => route.fulfill({ contentType: 'application/javascript', body: `self.loadPyodide=async()=>({FS:{writeFile(){}},runPythonAsync:async()=>{}});` }));
    await page.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', route => route.fulfill({ contentType: 'application/javascript', body: `
      (()=>{window.monaco={KeyMod:{Shift:1},KeyCode:{Enter:2},editor:{defineTheme(){},create(_h,o){let value=o.value;return{getValue:()=>value,setValue:v=>value=String(v),getModel:()=>({getLineCount:()=>value.split('\\n').length}),onDidChangeModelContent:()=>({dispose(){}}),addCommand(){},layout(){}}}}};const amd=(_d,cb)=>queueMicrotask(cb);amd.config=()=>{};window.require=amd;})();
    ` }));
    await page.addInitScript(() => localStorage.clear());
    await page.goto(`${BASE}/lessons/islandPHOTOLIGHTS.html?v=overlap-test`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.nodeDev?.toCell); await page.evaluate(() => window.nodeDev.toCell('walk_mot_bong'));
    const cell = page.locator('.walkthrough').filter({ hasText: 'BƯỚC 1 — MỘT DÒNG' }); await cell.waitFor({ state: 'visible' });
    await page.waitForTimeout(650);
    let report = await metrics(page, viewport, 'initial'); assertNoAccidentalOverlap(report);
    const shot = `${viewport.physical}-zoom-${Math.round(viewport.zoom * 100)}`;
    await page.screenshot({ path: path.join(outDir, `${shot}-01-initial.png`) });

    const next = cell.locator('.wtcontrols button'); await next.click(); await next.click();
    await page.locator('.light-board-start button').waitFor({ state: 'visible' });
    await page.waitForTimeout(100);
    report = await metrics(page, viewport, 'waiting-start'); assertNoAccidentalOverlap(report);
    await page.screenshot({ path: path.join(outDir, `${shot}-02-waiting-start.png`) });

    await page.locator('.light-board-start button').click(); await page.waitForFunction(() => !document.querySelector('.walkthrough:not(.veiled) .wtcontrols button').disabled);
    await next.click(); await page.waitForFunction(() => document.querySelectorAll('.light-board-bulb').length === 1);
    await page.waitForTimeout(100);
    report = await metrics(page, viewport, 'one-bulb'); assertNoAccidentalOverlap(report);
    await page.screenshot({ path: path.join(outDir, `${shot}-03-one-bulb.png`) });
    console.log(`  ok — ${viewport.physical} at ${Math.round(viewport.zoom * 100)}% zoom (CSS ${viewport.width}x${viewport.height}): overlap = 0 px²`); await page.close();
  }
  await writeFile(path.join(outDir, 'bounding-box-report.json'), JSON.stringify(reports, null, 2));
} finally { await browser.close(); }
