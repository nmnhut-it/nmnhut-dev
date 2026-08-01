// node lessons/test-saga-node10-gate.mjs -- focused browser test for the saga
// map's node10 wiring and direct node entry.
//
// SETUP (one-time): npm i -D playwright && npx playwright install chromium
// RUN (serve.py must already be running, port 8123):
//   node lessons/test-saga-node10-gate.mjs [--headed] [--base http://localhost:8123]
import assert from 'node:assert';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const headed = args.includes('--headed');
const baseArgIdx = args.indexOf('--base');
const BASE = baseArgIdx >= 0 ? args[baseArgIdx + 1] : 'http://localhost:8123';
const MAP_URL = `${BASE}/lessons/index.html?noentry`;

function trackErrors(page, allErrors) {
  let label = 'boot';
  page.on('pageerror', e => allErrors.push(`${label}: [pageerror] ${e.stack || e.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error') allErrors.push(`${label}: [console.error] ${msg.text()}`);
  });
  return l => { label = l; };
}

function normalizeText(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

async function gotoMap(page) {
  await page.goto(MAP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.saga && document.querySelectorAll('#nodes .node').length >= 12, null, { timeout: 15_000 });
}

async function getNodeInfo(page, index) {
  return page.evaluate(i => {
    const el = document.querySelectorAll('#nodes .node')[i];
    if (!el) return null;
    return {
      className: el.className,
      rune: el.querySelector('.rune')?.textContent?.trim() || '',
      title: (el.querySelector('.banner, .tip')?.textContent || '').replace(/\s+/g, ' ').trim(),
      hasFog: !!el.querySelector('.fog'),
    };
  }, index);
}

async function gateVisible(page) {
  return page.evaluate(() => {
    const gate = document.querySelector('#78b2a5eessgate');
    if (!gate) return false;
    const style = getComputedStyle(gate);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  });
}

async function waitForPath(page, suffix, timeout = 5_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    let pathname = '';
    try { pathname = new URL(page.url()).pathname; } catch {}
    if (pathname.endsWith(suffix)) return;
    await page.waitForTimeout(50);
  }
  throw new Error(`expected URL path to end with ${suffix}, got ${page.url()}`);
}

async function withSeededPage(browser, allErrors, label, seed, fn) {
  const context = await browser.newContext({ permissions: [], viewport: { width: 1280, height: 860 } });
  const page = await context.newPage();
  const setLabel = trackErrors(page, allErrors);
  await page.addInitScript(seed);
  try {
    setLabel(label);
    await fn(page, setLabel);
  } finally {
    await context.close();
  }
}

async function verifyNode10Wiring(browser, allErrors) {
  await withSeededPage(
    browser,
    allErrors,
    'node10/map',
    () => {
      localStorage.setItem('magicdust.onboard', '1');
      localStorage.setItem('magicdust.saga', '10');
      localStorage.removeItem('magicdust.accesscode');
    },
    async page => {
      console.log('> verifying node10 map wiring');
      await gotoMap(page);

      const count = await page.locator('#nodes .node').count();
      assert.ok(count >= 20, `expected main saga to include nodes 0-18 plus a mystery node, found ${count}`);

      const node10 = await getNodeInfo(page, 10);
      assert.ok(node10, 'expected node index 10 to exist');
      assert.match(node10.className, /\bcurrent\b/, `expected node10 to be current, got class="${node10.className}"`);
      assert.strictEqual(node10.rune, '10', `expected node10 rune "10", got "${node10.rune}"`);
      assert.ok(
        node10.title.includes('Repeat: for / range()'),
        `expected node10 title to include "Repeat: for / range()", got "${node10.title}"`,
      );

      const node11 = await getNodeInfo(page, 11);
      assert.ok(node11, 'expected node index 11 to exist');
      assert.match(node11.className, /\blocked\b/, `expected node11 to still be locked at progress 10, got "${node11.className}"`);
      assert.strictEqual(node11.rune, '11', `expected node11 rune "11", got "${node11.rune}"`);
      assert.ok(
        node11.title.includes('Super Old Computer: GOTO'),
        `expected node11 title to include "Super Old Computer: GOTO", got "${node11.title}"`,
      );
      assert.strictEqual(node11.hasFog, false, 'expected node11 to be a revealed future node, not a mystery placeholder');

      const mystery = await getNodeInfo(page, count - 1);
      assert.ok(mystery, 'expected final mystery placeholder to exist');
      assert.match(mystery.className, /\bmystery-node\b/, `expected mystery node to have mystery-node class, got "${mystery.className}"`);
      assert.match(mystery.className, /\blocked\b/, `expected mystery node to be locked at progress 10, got "${mystery.className}"`);
      assert.strictEqual(mystery.rune, '?', `expected mystery rune "?", got "${mystery.rune}"`);
      assert.strictEqual(mystery.title, '? ? ?', `expected mystery title "? ? ?", got "${mystery.title}"`);
      assert.strictEqual(mystery.hasFog, true, 'expected mystery placeholder to render fog');
      console.log('  ok - node10 is current, node11 is locked, and the final mystery placeholder remains fogged');
    },
  );
}

async function verifyDirectNodeEntry(browser, allErrors) {
  await withSeededPage(
    browser,
    allErrors,
    'direct-entry/map',
    () => {
      localStorage.setItem('magicdust.onboard', '1');
      localStorage.setItem('magicdust.saga', '6');
      localStorage.removeItem('magicdust.accesscode');
    },
    async (page, setLabel) => {
      console.log('> verifying direct node entry');
      // This test is about saga.js choosing the right destination URL without
      // the old access-code speed bump. The lesson page itself imports CDN
      // assets, which can emit unrelated network console errors in
      // offline/restricted runners.
      await page.route('**/lessons/lesson06v2.html', route => route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><meta charset="utf-8"><title>lesson06v2 navigation target</title>',
      }));
      await gotoMap(page);

      const node6 = page.locator('#nodes .node').nth(6);
      await node6.scrollIntoViewIfNeeded();
      setLabel('direct-entry/click');
      await node6.click({ force: true });
      await waitForPath(page, '/lessons/lesson06v2.html');
      await page.evaluate(() => window.stop()).catch(() => {});
      assert.strictEqual(await gateVisible(page).catch(() => false), false, 'expected no access gate when entering unlocked node6');
      console.log('  ok - unlocked node6 enters directly without access code');
    },
  );
}

async function main() {
  const browser = await chromium.launch({ headless: !headed });
  const allErrors = [];
  try {
    console.log(`saga node10/direct-entry test: base=${BASE} mode=${headed ? 'headed' : 'headless'}`);
    await verifyNode10Wiring(browser, allErrors);
    await verifyDirectNodeEntry(browser, allErrors);
    if (allErrors.length) {
      throw new Error(`captured ${allErrors.length} unexpected browser error(s):\n${allErrors.map(e => `  ${e}`).join('\n')}`);
    }
    console.log('\n2 checks passed, 0 failed');
  } finally {
    await browser.close();
  }
}

main().catch(e => {
  console.error('\ntest-saga-node10-gate: fatal');
  console.error(e.stack || e.message);
  process.exitCode = 1;
});
