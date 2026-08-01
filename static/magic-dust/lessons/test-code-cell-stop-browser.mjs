// node lessons/test-code-cell-stop-browser.mjs [--base http://localhost:8123]
// Focused browser integration test for the code-cell STOP button. With no
// --base it starts serve.py on a temporary localhost port and shuts it down.
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const baseArgIdx = args.indexOf('--base');
const BASE_ARG = baseArgIdx >= 0 ? args[baseArgIdx + 1] : null;

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function waitForServer(base, proc) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (proc && proc.exitCode !== null) throw new Error(`serve.py exited early with code ${proc.exitCode}`);
    try {
      const res = await fetch(`${base}/api/editor-ping`);
      if (res.ok) return;
    } catch {}
    await delay(200);
  }
  throw new Error(`server did not become ready at ${base}`);
}

async function startServerIfNeeded() {
  if (BASE_ARG) return { base: BASE_ARG, stop: async () => {} };
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const proc = spawn(process.env.PYTHON || 'python', ['serve.py', String(port)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  proc.stdout.on('data', d => { log += d.toString(); });
  proc.stderr.on('data', d => { log += d.toString(); });
  await waitForServer(base, proc).catch(e => {
    proc.kill();
    e.message += log ? `\nserve.py log:\n${log}` : '';
    throw e;
  });
  return {
    base,
    stop: async () => {
      if (proc.exitCode === null) proc.kill();
      await new Promise(resolve => proc.once('exit', resolve)).catch(() => {});
    },
  };
}

async function main() {
  const { base, stop } = await startServerIfNeeded();
  let browser = null;
  const pageErrors = [];
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ permissions: [] });
    const page = await context.newPage();
    page.on('pageerror', e => pageErrors.push(e.stack || e.message));

    await page.goto(`${base}/lessons/dev-test.html?src=node00v2&only=code:first_say.py`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const cell = document.querySelector('.codecell');
      const btn = cell && cell.querySelector('.crun');
      return !!(window.nodeDev && cell && cell._editor && btn && !btn.disabled);
    }, null, { timeout: 120_000 });

    const runBtn = page.locator('.codecell .crun').first();
    await page.evaluate(() => {
      document.querySelector('.codecell')._editor.setValue('while True:\n    pass\n');
    });

    await runBtn.click({ force: true });
    await page.waitForFunction(() => {
      const btn = document.querySelector('.codecell .crun');
      return !!(btn && btn.classList.contains('is-stop') && !btn.disabled && btn.textContent.includes('STOP'));
    }, null, { timeout: 5_000 });

    await runBtn.click({ force: true });
    await page.waitForFunction(() => {
      const btn = document.querySelector('.codecell .crun');
      return !!(btn && !btn.classList.contains('is-stop') && !btn.textContent.includes('STOP'));
    }, null, { timeout: 5_000 });

    await page.waitForFunction(() => {
      const btn = document.querySelector('.codecell .crun');
      return !!(btn && !btn.disabled && !btn.classList.contains('is-stop') && btn.dataset.runState === 'idle');
    }, null, { timeout: 90_000 });

    await page.evaluate(() => {
      const cell = document.querySelector('.codecell');
      cell._stopCompletes = true;
      cell._expectOut = { minLines: 3 };
      cell._editor.setValue('from old_computer import say\nfrom time import sleep\n\nwhile True:\n    say("frame")\n    sleep(0.02)\n');
    });
    await runBtn.click({ force: true });
    await page.waitForFunction(() => document.querySelectorAll('.codecell .cout .t-out').length >= 3, null, { timeout: 10_000 });
    await page.evaluate(() => document.querySelector('.codecell .crun').onclick());
    await page.waitForFunction(() => {
      return [...document.querySelectorAll('.codecell .cout .t-sys')]
        .some(el => /đã dừng|đang yêu cầu dừng|STOP hoàn tất project|cần \d+ frame/i.test(el.textContent || ''));
    }, null, { timeout: 10_000 });
    const stopFeedback = await page.locator('.codecell .cout .t-sys').allTextContents();
    assert.match(stopFeedback.join('\n'), /STOP hoàn tất project/i, `unexpected STOP feedback: ${stopFeedback.join(' | ')}`);
    await page.waitForFunction(() => {
      const btn = document.querySelector('.codecell .crun');
      return !!(btn && !btn.disabled && btn.dataset.runState === 'idle');
    }, null, { timeout: 90_000 });

    await page.evaluate(() => {
      const cell = document.querySelector('.codecell');
      cell._stopCompletes = false;
      cell._expectOut = /after stop/i;
      cell._editor.setValue('from old_computer import say\n\nsay("after stop")\n');
    });
    await page.evaluate(() => document.querySelector('.codecell .crun').onclick());
    await page.waitForTimeout(5000);
    const rerunState = await page.evaluate(() => {
      const cell = document.querySelector('.codecell');
      const btn = cell.querySelector('.crun');
      return { output: cell.querySelector('.cout').textContent || '', runState: btn.dataset.runState, disabled: btn.disabled, python: document.querySelector('#pystat')?.textContent || '' };
    });
    assert.match(rerunState.output, /after stop/i, `rerun after STOP failed: ${JSON.stringify(rerunState)}`);

    await page.goto(`${base}/lessons/dev-test.html?src=islandPHOTOLIGHTS&only=code:ba_chu_ky_chop.py`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => {
      const cell = document.querySelector('.codecell');
      const btn = cell && cell.querySelector('.crun');
      return !!(window.nodeDev && cell && cell._editor && btn && !btn.disabled);
    }, null, { timeout: 120_000 });
    const stickyCell = page.locator('.codecell').first();
    await stickyCell.locator('.crun').click({ force: true });
    const boardStart = page.locator('.light-board-start button');
    await boardStart.waitFor({ state: 'visible', timeout: 20_000 });
    await boardStart.click();
    await page.waitForFunction(() => document.querySelector('.codecell.done') && document.querySelector('.light-board-project'), null, { timeout: 20_000 });
    const stickyScrollY = await page.evaluate(() => window.scrollY);
    await delay(2_200);
    assert.ok(await page.locator('.light-board-project').count(), 'Light Board output should remain visible after a successful RUN');
    assert.strictEqual(await page.evaluate(() => window.scrollY), stickyScrollY, 'Light Board should not auto-scroll to the next cell');

    assert.deepStrictEqual(pageErrors, []);
    await context.close();
  } finally {
    if (browser) await browser.close().catch(() => {});
    await stop();
  }
  console.log('  ok - browser STOP handles runaway cells; Light Board keeps successful output in place');
}

main().catch(e => { console.error(`FAIL - ${e.stack || e.message}`); process.exitCode = 1; });
