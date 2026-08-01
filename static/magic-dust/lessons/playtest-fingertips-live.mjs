import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const base = process.env.FINGERTIP_BASE || 'https://nmnhut.dev/magic-dust/lessons';
await page.goto(`${base}/islandFINGERTIPS.html?v=${Date.now()}`, { waitUntil: 'networkidle', timeout: 120000 });
await page.locator('#enterBtn').click();
await page.locator('#giftwrap').click({ force: true });
await page.waitForFunction(() => !document.getElementById('book').classList.contains('gone'), null, { timeout: 30000 });
await page.waitForTimeout(5000);
await page.screenshot({ path: '../artifacts-fingertips-island-render.png', fullPage: true });
for (let turn = 0; turn < 30; turn += 1) {
  const active = page.locator('#book > .cell:not(.veiled):not(.done)').last();
  if (!await active.count()) break;
  const className = await active.getAttribute('class') || '';
  if (className.includes('codecell')) {
    const finalCell = (await active.innerText()).includes('fingertip_final_tests.py');
    const codeCell = finalCell ? page.locator('.codecell').filter({ hasText: 'fingertip_final_tests.py' }) : page.locator('.codecell').filter({ hasText: 'fingertip_peak_challenge.py' });
    if (finalCell) {
      await page.waitForFunction(el => Boolean(el?._editor), await codeCell.elementHandle(), { timeout: 30000 });
      await codeCell.locator('.csolution').click();
    }
    await codeCell.locator('.crun').click();
    await codeCell.locator('.cout').waitFor({ state: 'visible' });
    await page.waitForFunction(el => el?.textContent?.includes('RESULT'), await codeCell.elementHandle(), { timeout: 30000 });
    if (finalCell) {
      await codeCell.scrollIntoViewIfNeeded();
      await page.screenshot({ path: '../artifacts-fingertips-practice-5-of-5.png', fullPage: false });
      break;
    }
  } else if (className.includes('quizcell')) {
    const option = active.locator('.qopt').first();
    if (await option.count()) await option.click(); else await active.click({ force: true });
  } else if (className.includes('giftcell') || className.includes('islandfinish')) {
    break;
  } else {
    await active.click({ force: true });
  }
  await page.waitForTimeout(700);
}
console.log(JSON.stringify({
  title: await page.title(),
  text: (await page.locator('body').innerText()).slice(0, 1600),
  errors,
  elements: await page.locator('body *').count(),
  runButtons: await page.locator('.crun').count(),
  result: await page.locator('.codecell .cout').last().innerText(),
  buttons: await page.locator('button').evaluateAll(items => items.map(item => ({ text: item.textContent.trim(), className: item.className })).slice(0, 30)),
  bookChildren: await page.locator('#book > *').evaluateAll(items => items.map(item => ({ tag: item.tagName, className: item.className, text: item.textContent.trim().slice(0, 80) })).slice(0, 20)),
}, null, 2));
await browser.close();
