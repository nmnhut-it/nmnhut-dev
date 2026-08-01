// node lessons/test-saga-map-layout.mjs
// Browser regression for saga map layout: map art must stay inside the world,
// side islands should remain smaller, and no island/tower art may collide.
import assert from 'node:assert';
import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const sideIds = [
  'island01', 'island02', 'islandIO', 'islandVARHOSP', 'islandSTRINGLAB', 'islandMARKET', 'islandEFFECTSTAGE',
  'islandUNITS', 'islandSCORE',
  'islandAR', 'islandBRANCH', 'islandCOMPARE', 'islandWHILE',
  'islandTYPES', 'islandPROJECT1', 'islandRPS', 'islandAR2', 'islandPATTERN', 'islandNESTEDFOR',
  'islandRETURNLAB', 'islandDICTLOOKUP', 'islandGIFTSETUP', 'islandPARTICLELIFE', 'islandEMITTERLAB', 'towerINFERNO', 'tower',
  'islandIFPATTERNS', 'islandPASSWORD', 'islandMODCHECKS', 'islandGEOMETRY', 'islandLOOPMATH', 'islandLISTSUM', 'islandLISTCOUNT', 'islandLISTEXTREMES', 'islandLISTREVERSE', 'islandLISTFILTER', 'islandINPUTLIST', 'islandPHOTOLIGHTS',
  'islandGRIDBASIC', 'islandGRIDOPS', 'islandFINGERTIPS', 'islandGRIDQUEST', 'islandPIXELART', 'islandEDGE', 'islandIMAGEOPS', 'islandFXFORGE', 'islandLISTTOOLS', 'islandSTRINGCHECKS',
  'branchSTANDARDIO', 'towerSTANDARDIO', 'branchOPERATORS', 'towerOPERATORS', 'branchLOOPCONTROL', 'towerLOOPCONTROL',
  'branchCOLLECTIONS', 'towerCOLLECTIONS', 'branchDICTIONARIES', 'towerDICTIONARIES', 'branchERRORS', 'towerERRORS',
];
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url || '/', 'http://127.0.0.1');
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/') pathname = '/index.html';
  const full = normalize(join(root, pathname));
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': mime[extname(full).toLowerCase()] || 'application/octet-stream' });
  createReadStream(full).pipe(res);
});

function overlapArea(a, b, pad = 0) {
  const width = Math.min(a.right + pad, b.right + pad) - Math.max(a.left - pad, b.left - pad);
  const height = Math.min(a.bottom + pad, b.bottom + pad) - Math.max(a.top - pad, b.top - pad);
  return width > 0 && height > 0 ? Math.round(width * height) : 0;
}

async function captureLayout(browser, port, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await context.addInitScript((ids) => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', '999');
    for (const id of ids) localStorage.setItem(`magicdust.sideisland.${id}`, '1');
  }, sideIds);

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/index.html?noentry`, { waitUntil: 'networkidle' });
  // The production map intentionally lazy-loads off-screen locations. Sweep
  // the full route here because this test validates every sprite, while the
  // separate network-budget test validates that first load does not do so.
  await page.evaluate(async () => {
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const step = Math.max(320, Math.floor(innerHeight * 0.75));
    for (let y = 0; y <= max; y += step) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    scrollTo(0, max);
  });
  try {
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
  } catch {
    const failedImages = await page.evaluate(() => [...document.images]
      .filter(img => !img.complete || img.naturalWidth === 0)
      .map(img => img.getAttribute('src')));
    assert.fail(`map images failed to load: ${failedImages.join(', ')}`);
  }
  const layout = await page.evaluate(() => {
    const rect = (element, label) => {
      const r = element.getBoundingClientRect();
      return {
        label,
        left: r.left + scrollX,
        top: r.top + scrollY,
        right: r.right + scrollX,
        bottom: r.bottom + scrollY,
        width: r.width,
        height: r.height,
      };
    };
    return {
      world: rect(document.querySelector('#world'), 'world'),
      nodes: [...document.querySelectorAll('.node')]
        .map(el => rect(el.querySelector('.island'), `node${el.dataset.index}`)),
      sides: [...document.querySelectorAll('.sidenode')]
        .map(el => ({ ...rect(el.querySelector('.sideart'), el.dataset.id || 'side'), src: el.querySelector('.sideart img').getAttribute('src') })),
      tower: rect(document.querySelector('#tower'), 'reserved-tower'),
      branches: [...document.querySelectorAll('.branchtrail')].map(el => el.dataset.id),
    };
  });
  await context.close();
  return layout;
}

async function visibleSides(browser, port, { progress = 16, doneIds = [], discovery = null } = {}) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
  await context.addInitScript(({ progress, doneIds, discovery }) => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', String(progress));
    for (const id of doneIds) localStorage.setItem(`magicdust.sideisland.${id}`, '1');
    if (discovery) localStorage.setItem('magicdust.sideislands.discovery.v1', JSON.stringify(discovery));
  }, { progress, doneIds, discovery });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/index.html?noentry`, { waitUntil: 'networkidle' });
  const ids = await page.evaluate(() => [...document.querySelectorAll('.sidenode')].map(el => el.dataset.id));
  await context.close();
  return ids;
}

async function assertRpsGateOpens(browser, port) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    localStorage.setItem('magicdust.onboard', '1');
    localStorage.setItem('magicdust.saga', '16');
  });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/index.html?noentry`, { waitUntil: 'networkidle' });
  const first = page.locator('.sidenode[data-id="island01"]');
  await first.scrollIntoViewIfNeeded();
  // The island intentionally floats while hovered. A forced click still uses
  // the real DOM handler without asking Playwright to wait for that animation
  // to become geometrically still.
  await first.click({ force: true });
  try {
    await page.waitForSelector('.rpsgate.on', { timeout: 1000 });
  } catch {
    await first.click({ force: true });
    await page.waitForSelector('.rpsgate.on');
  }
  const current = new URL(page.url());
  assert.ok(current.pathname.endsWith('/index.html') && current.searchParams.has('noentry'), 'RPS gate should not navigate before a win');
  assert.strictEqual(await page.locator('.rps-actions [data-choice]').count(), 3, 'RPS gate should expose three tap fallback choices');
  await context.close();
}

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

try {
  const browser = await chromium.launch();
  assert.deepStrictEqual(await visibleSides(browser, port, { progress: 16 }), ['island01', 'branchSTANDARDIO', 'branchOPERATORS', 'branchLOOPCONTROL', 'towerINFERNO'], 'one secret island plus every eligible featured learning branch should be visible');
  assert.deepStrictEqual(await visibleSides(browser, port, { progress: 16, doneIds: ['branchSTANDARDIO'] }), ['island01', 'branchSTANDARDIO', 'towerSTANDARDIO', 'branchOPERATORS', 'branchLOOPCONTROL', 'towerINFERNO'], 'finishing a learning branch should reveal its own practice tower');
  assert.deepStrictEqual(await visibleSides(browser, port, { progress: 21, doneIds: ['branchLOOPCONTROL'] }), ['islandRETURNLAB', 'branchSTANDARDIO', 'branchOPERATORS', 'branchLOOPCONTROL', 'towerLOOPCONTROL', 'branchCOLLECTIONS', 'branchDICTIONARIES', 'branchERRORS', 'towerINFERNO'], 'the error-handling branch should appear only after its loop-control prerequisite');
  assert.deepStrictEqual(await visibleSides(browser, port, { progress: 16, doneIds: ['island01'] }), ['island01', 'island02', 'branchSTANDARDIO', 'branchOPERATORS', 'branchLOOPCONTROL', 'towerINFERNO'], 'solving the visible island should reveal the next secret without hiding learning branches');
  assert.deepStrictEqual(await visibleSides(browser, port, { progress: 16, doneIds: ['island01'], discovery: { discovered: ['islandMARKET'], gatePassed: [] } }), ['island01', 'islandMARKET', 'branchSTANDARDIO', 'branchOPERATORS', 'branchLOOPCONTROL', 'towerINFERNO'], 'a discovered secret and featured learning branches should remain visible together');
  await assertRpsGateOpens(browser, port);

  const viewports = [
    { name: 'desktop', viewport: { width: 1366, height: 768 }, pad: 8 },
    { name: 'mobile', viewport: { width: 390, height: 844 }, pad: 4 },
  ];

  for (const item of viewports) {
    const layout = await captureLayout(browser, port, item.viewport);
    const main = layout.nodes[0];
    const side = layout.sides[0];
    const towerIsland = layout.sides.find(art => art.label === 'tower');
    const infernoTower = layout.sides.find(art => art.label === 'towerINFERNO');
    assert.ok(side.width <= main.width * 0.45, `${item.name}: side islands should be clearly narrower than main islands`);
    assert.ok(side.height <= main.height * 0.45, `${item.name}: side islands should be clearly shorter than main islands`);
    assert.ok(towerIsland, `${item.name}: tower side island should be rendered`);
    assert.ok(infernoTower, `${item.name}: inferno tower branch should be rendered`);
    assert.ok(layout.branches.includes('towerINFERNO'), `${item.name}: inferno tower should have a visible branch from the main route`);
    assert.ok(towerIsland.width >= side.width * 1.5, `${item.name}: tower side island should stand above regular side islands`);
    assert.ok(towerIsland.src.includes('assets/storybook/side-islands/storybook-tower-island-lit.webp'), `${item.name}: tower should use its distinct storybook art`);
    assert.ok(infernoTower.src.includes('assets/storybook/island-dark-v2.webp'), `${item.name}: inferno tower should use its dedicated storybook challenge art`);
    const towerMinWidth = item.name === 'mobile' ? 140 : 250;
    assert.ok(layout.tower.width >= towerMinWidth, `${item.name}: tower should remain a prominent map set-piece`);

    for (const art of [...layout.nodes, ...layout.sides, layout.tower]) {
      assert.ok(art.top >= layout.world.top, `${item.name}: ${art.label} must not extend above the world`);
      assert.ok(art.bottom <= layout.world.bottom, `${item.name}: ${art.label} must not extend below the world`);
    }

    const mainCollisions = [];
    for (let i = 0; i < layout.nodes.length; i++) {
      for (let j = i + 1; j < layout.nodes.length; j++) {
        const area = overlapArea(layout.nodes[i], layout.nodes[j], item.pad);
        if (area) mainCollisions.push(`node ${layout.nodes[i].label} vs ${layout.nodes[j].label}: ${area}`);
      }
    }
    assert.deepStrictEqual(mainCollisions, [], `${item.name}: main node island bounding boxes must not collide`);

    const collisions = [];
    for (let i = 0; i < layout.sides.length; i++) {
      for (let j = i + 1; j < layout.sides.length; j++) {
        const area = overlapArea(layout.sides[i], layout.sides[j], item.pad);
        if (area) collisions.push(`side ${layout.sides[i].label} vs ${layout.sides[j].label}: ${area}`);
      }
      for (const node of layout.nodes) {
        const area = overlapArea(layout.sides[i], node, item.pad);
        if (area) collisions.push(`side ${layout.sides[i].label} vs ${node.label}: ${area}`);
      }
      const towerArea = overlapArea(layout.sides[i], layout.tower, item.pad);
      if (towerArea) collisions.push(`side ${layout.sides[i].label} vs reserved tower: ${towerArea}`);
    }
    for (const node of layout.nodes) {
      const area = overlapArea(layout.tower, node, item.pad);
      if (area) collisions.push(`reserved tower vs ${node.label}: ${area}`);
    }
    assert.deepStrictEqual(collisions, [], `${item.name}: side island bounding boxes must not collide`);
  }

  await browser.close();
  console.log('saga map layout collision checks passed');
} finally {
  await new Promise(resolve => server.close(resolve));
}
