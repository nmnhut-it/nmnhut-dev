// Browser regression for the learner-visible Python boot failure and Monaco fallback.
// Run standalone or attach to an existing isolated server with --base.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const requestedBase = baseIndex >= 0 ? args[baseIndex + 1] : null;

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function startServer() {
  if (requestedBase) return { base: requestedBase, stop: async () => {} };
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const serverProcess = spawn(process.env.PYTHON || 'python', ['serve.py', String(port)], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (serverProcess.exitCode !== null) throw new Error(`serve.py exited with code ${serverProcess.exitCode}`);
    try {
      const response = await fetch(`${base}/api/editor-ping`);
      if (response.ok) return { base, stop: async () => { if (serverProcess.exitCode === null) serverProcess.kill(); await new Promise(resolve => serverProcess.once('exit', resolve)).catch(() => {}); } };
    } catch { /* server is still starting */ }
    await delay(200);
  }
  serverProcess.kill(); throw new Error(`serve.py did not start at ${base}`);
}

const { base, stop } = await startServer();
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => localStorage.setItem('magicdust.saga', '99'));
  const blockPyodide = route => route.abort('internetdisconnected');
  const blockMonaco = route => route.abort('internetdisconnected');
  await context.route('https://cdn.jsdelivr.net/pyodide/**', blockPyodide);
  await context.route('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', blockMonaco);
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${base}/lessons/python50-lesson.html?node=0`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForFunction(() => !!window.NODE, null, { timeout: 30_000 });
  const status = page.locator('#pystat');
  await status.waitFor({ state: 'visible', timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector('#pystat')?.classList.contains('error'), null, { timeout: 30_000 });
  assert.match(await status.textContent(), /Không tải được Python/);
  assert.equal(await status.getAttribute('role'), 'button');

  await page.evaluate(async () => window.nodeDev.toCell('p50_two_commands_fix.py'));
  const fixCell = page.locator('.codecell').filter({ has: page.locator('.clabel', { hasText: 'p50_two_commands_fix.py' }) });
  const fallback = fixCell.locator('.ced-fallback');
  await fallback.waitFor({ state: 'visible', timeout: 30_000 });
  assert.match(await fallback.inputValue(), /if command == 2:[\s\S]*elif command == 1:/);
  assert.equal(await fixCell.locator('.crun').isDisabled(), true);

  await context.unroute('https://cdn.jsdelivr.net/pyodide/**', blockPyodide);
  await context.unroute('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/**', blockMonaco);
  await status.click();
  await page.waitForFunction(() => /Python ready/i.test(document.querySelector('#pystat')?.textContent || ''), null, { timeout: 120_000 });
  await page.waitForFunction(() => {
    const cell = [...document.querySelectorAll('.codecell')].find(item => item.querySelector('.clabel')?.textContent.trim() === 'p50_two_commands_fix.py');
    return cell && !cell.querySelector('.crun')?.disabled;
  }, null, { timeout: 10_000 });
  await page.evaluate(() => {
    const cell = [...document.querySelectorAll('.codecell')].find(item => item.querySelector('.clabel')?.textContent.trim() === 'p50_two_commands_fix.py');
    const authored = window.NODE.cells.find(item => item.label === 'p50_two_commands_fix.py');
    cell._editor.setValue(authored.solution);
    cell.querySelector('.crun').click();
  });
  await page.waitForFunction(() => [...document.querySelectorAll('.t-out')].some(item => item.textContent.trim() === '12'), null, { timeout: 30_000 });
  assert.deepEqual(pageErrors, []);
  console.log('✓ Python boot fallback: bounded failure, mobile retry, textarea editor và lời giải chặng 00 đều hoạt động');
  await context.close();
} finally {
  await browser.close().catch(() => {});
  await stop();
}
