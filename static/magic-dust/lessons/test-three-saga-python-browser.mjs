// Browser regression for the shared Pyodide runtime used by all four sagas.
// Run with an existing isolated server via:
//   node lessons/test-three-saga-python-browser.mjs --base http://127.0.0.1:8765
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
const targets = [
  ['Saga chính', '/lessons/lesson00v2.html'],
  ['Saga Toán 6', '/lessons/math6-lesson.html?node=0'],
  ['Đường đua Python', '/lessons/python50-lesson.html?node=0'],
  ['Saga DSA', '/lessons/dsa-lesson.html?type=node&id=0'],
];

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function startServer() {
  if (requestedBase) return { base: requestedBase, stop: async () => {} };
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const serverProcess = spawn(process.env.PYTHON || 'python', ['serve.py', String(port)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (serverProcess.exitCode !== null) throw new Error(`serve.py exited with code ${serverProcess.exitCode}`);
    try {
      const response = await fetch(`${base}/api/editor-ping`);
      if (response.ok) return {
        base,
        stop: async () => {
          if (serverProcess.exitCode === null) serverProcess.kill();
          await new Promise(resolve => serverProcess.once('exit', resolve)).catch(() => {});
        },
      };
    } catch { /* server is still starting */ }
    await delay(200);
  }
  serverProcess.kill();
  throw new Error(`serve.py did not start at ${base}`);
}

const { base, stop } = await startServer();
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, pathname] of targets) {
    const context = await browser.newContext();
    await context.addInitScript(() => localStorage.setItem('magicdust.saga', '99'));
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(`pageerror: ${error.message}`));
    page.on('requestfailed', request => {
      if (/pyodide|worker\.js|\.wasm/i.test(request.url())) {
        failures.push(`${request.url()}: ${request.failure()?.errorText || 'request failed'}`);
      }
    });

    const started = Date.now();
    await page.goto(`${base}${pathname}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForFunction(
      () => /Python ready/i.test(document.querySelector('#pystat')?.textContent || ''),
      null,
      { timeout: 90_000 },
    );
    await page.evaluate(async () => {
      const label = window.NODE.cells.find(cell => cell.code !== undefined)?.label;
      await window.nodeDev.toCell(label);
    });
    await page.waitForFunction(() => {
      const cell = [...document.querySelectorAll('.codecell')].find(item => !item.classList.contains('veiled'));
      return !!(cell?._editor && cell.querySelector('.crun:not(:disabled)'));
    }, null, { timeout: 30_000 });
    await page.evaluate(() => {
      const cell = [...document.querySelectorAll('.codecell')].find(item => !item.classList.contains('veiled'));
      cell._expectOut = /PYTHON_SMOKE_OK/;
      cell._editor.setValue('from old_computer import say\nsay("PYTHON_SMOKE_OK")\n');
      cell.querySelector('.crun').click();
    });
    await page.waitForFunction(
      () => [...document.querySelectorAll('.t-out')].some(item => item.textContent.includes('PYTHON_SMOKE_OK')),
      null,
      { timeout: 30_000 },
    );
    if (failures.length) throw new Error(`${name}: ${failures.join('\n')}`);
    console.log(`✓ ${name}: Python ready và chạy code thật (${Date.now() - started} ms)`);
    await context.close();
  }
} finally {
  await browser.close().catch(() => {});
  await stop();
}
