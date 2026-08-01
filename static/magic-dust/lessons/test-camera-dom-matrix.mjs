// test-camera-dom-matrix.mjs — real-browser matrix test for camera/DOM
// display invariants (owner ask: "check camera state + elements not
// overlapping + camera hidden after resolve"). Unlike this repo's unit
// tests (assert-based, fake stubs, no browser — see INTERACTION-MATRIX.md's
// stated philosophy of citing source over faking a browser harness) this
// ONE thing genuinely cannot be verified without real layout: whether
// #scenepanel's bounding rect actually overlaps another cell. jsdom doesn't
// lay out CSS and this repo has no jsdom dependency anyway. Playwright is
// already a devDependency (see playtest-full.mjs) — reused here, scoped
// narrowly to this one concern instead of a full playthrough.
//
// The shared check both this script AND a human at devtools can run is
// engine/dom-invariants.js's checkCellDisplayInvariants(), wired onto
// window.nodeDev.checkDisplay() in node.js — every `.cell` visible & non-
// overlapping, #scenepanel/#cam/#camstill singleton and correctly contained
// in whichever cell is running. That check does NOT require a working
// camera, so it runs unconditionally below.
//
// The camera-track-lifecycle assertions (live while armed, readyState
// 'ended' after release()) DO require a functioning fake video device.
// `--use-fake-device-for-media-stream` + granting the 'camera' permission
// is the documented way to get one, but some headless/sandboxed Chromium
// builds still reject getUserMedia with "Not supported" (no real capture
// backend available in that environment) — this script PROBES for that
// upfront and skips (loudly, not silently) rather than reporting a false
// pass or a confusing timeout. On a normal dev machine this probe succeeds
// and the full matrix runs.
//
// STATE A (armed)    — click ▶ RUN for real on node03v2's watch_print.py;
//                       its Python calls watch() -> bridge.ask('fingers')
//                       -> fingerAsk() -> cameraEngine.ensure() ->
//                       #mountScene() (notebook-runner.js). #mountScene()
//                       runs regardless of whether ensure() ultimately
//                       resolves (camera OK) or rejects (falls back to
//                       fingerAskStub's typed-count UI) — see fingerAsk()'s
//                       body — so the DOM/parenting checks are exercised
//                       either way; only the "track is live" check needs
//                       the probe to have succeeded.
// STATE B (released) — click ▶ RUN again on the EARLIER finger_var.py
//                       cell. Per notebook-runner.js's runCell(): a
//                       DIFFERENT cell running while askGate.isArmed
//                       cancels the pending ask (interaction-matrix Row
//                       2/C5, logic-tested elsewhere; here driven for real)
//                       -> #clearRunning schedules cameraEngine.release()
//                       after OUTPUT_DWELL_MS+400. finger_var.py itself
//                       needs no camera, so nothing re-arms the watchdog
//                       before release() actually fires this time.
//
// SETUP (one-time): npm i -D playwright && npx playwright install chromium
// RUN (serve.py must already be running — python serve.py, port 8123):
//   node lessons/test-camera-dom-matrix.mjs [--base http://localhost:8123]
import { chromium } from 'playwright';
import assert from 'node:assert';

const args = process.argv.slice(2);
const baseArgIdx = args.indexOf('--base');
const BASE = baseArgIdx >= 0 ? args[baseArgIdx + 1] : 'http://localhost:8123';
const RELEASE_WAIT_MS = 1400 + 400 + 500; // OUTPUT_DWELL_MS + 400 (engine/constants.js) + margin — kept in sync by hand, no build step to import it

let passed = 0, failed = 0, skipped = 0;
async function t(name, fn) {
  try { await fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
function skip(name, reason) { skipped++; console.log(`  SKIP — ${name}: ${reason}`); }

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--use-fake-device-for-media-stream'] });
  const context = await browser.newContext({ permissions: ['camera'] });
  const page = await context.newPage();
  page.on('pageerror', e => console.log('  [pageerror]', e.stack || e.message));

  await page.goto(`${BASE}/lessons/lesson03v2.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.nodeDev, null, { timeout: 15000 });

  const gum = await page.evaluate(async () => {
    try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); s.getTracks().forEach(tr => tr.stop()); return { ok: true }; }
    catch (e) { return { ok: false, err: e.message }; }
  });
  if (!gum.ok) console.log(`  ⚠ this environment's headless Chromium does not support getUserMedia (${gum.err}) — camera-track-liveness checks below are SKIPPED, not faked. DOM/overlap/singleton checks (which don't need a real stream) still run.`);

  // reveal watch_print.py without running anything past it for real
  await page.evaluate(() => window.nodeDev.toCell('watch_print.py'));
  const runBtn = page.locator('.codecell:has(.clabel:text-is("watch_print.py")) .crun');
  await runBtn.waitFor({ state: 'visible', timeout: 10000 });
  // .crun starts HTML-disabled until the Pyodide worker finishes booting
  // (code-cells.js: `if (workerUp()) el.querySelector('.crun').disabled = false`)
  // — a disabled button never fires its click listener even with force:true,
  // so wait for the real enabled state first (worker boot can take a few
  // seconds), THEN force past the gift cell's fullscreen .bcam overlay below.
  await page.waitForFunction(() => {
    const b = [...document.querySelectorAll('.codecell')].find(el => el.querySelector('.clabel')?.textContent === 'watch_print.py')?.querySelector('.crun');
    return b && !b.disabled;
  }, null, { timeout: 20000 });

  await t('STATE A — running watch_print.py mounts #scenepanel parented inside itself', async () => {
    // force:true — the preceding gift cell's OWN .bcam gesture chip renders
    // fullscreen (position:fixed;inset:0, node.css ~line 297) while armed,
    // which can intercept pointer events over later cells; force bypasses
    // that so this test still drives the intended click. Whether that gift
    // gate should have disarmed itself by now is a separate finding, called
    // out to the owner rather than silently masked here.
    await runBtn.click({ force: true });
    await page.waitForFunction(() => {
      const p = document.querySelector('#scenepanel');
      return p && p.closest('.codecell')?.querySelector('.clabel')?.textContent === 'watch_print.py';
    }, null, { timeout: 10000 });
    const report = await page.evaluate(() => window.nodeDev.checkDisplay());
    assert.ok(report.ok, `display invariants failed: ${JSON.stringify(report.issues)}`);
  });

  if (gum.ok) {
    await t('STATE A — the camera track is actually live while the ask is pending', async () => {
      await page.waitForFunction(() => {
        const v = document.querySelector('#cam');
        return v && v.srcObject && v.srcObject.getTracks().some(tr => tr.readyState === 'live');
      }, null, { timeout: 10000 });
    });
  } else skip('STATE A — the camera track is actually live while the ask is pending', 'getUserMedia unsupported in this environment');

  await t('STATE B — rerunning a DIFFERENT, camera-free cell cancels the pending ask', async () => {
    // the .crun button is HTML-disabled while another cell is running (see
    // notebook-runner.js#setRunning) — the real user affordance for "rerun a
    // DIFFERENT cell while one is pending" is Monaco's Shift+Enter binding
    // (code-cells.js: bound unconditionally, not gated on button.disabled),
    // so drive it the same way a human would instead of a disabled click.
    await page.locator('.codecell:has(.clabel:text-is("finger_var.py")) .ced').click({ force: true });
    await page.keyboard.press('Shift+Enter');
    await page.waitForTimeout(RELEASE_WAIT_MS);
    const report = await page.evaluate(() => window.nodeDev.checkDisplay());
    assert.ok(report.ok, `display invariants failed after release: ${JSON.stringify(report.issues)}`);
  });

  if (gum.ok) {
    await t('STATE B — every camera track is readyState "ended" after the release delay', async () => {
      const tracksEnded = await page.evaluate(() => {
        const v = document.querySelector('#cam');
        return !!v.srcObject && v.srcObject.getTracks().every(tr => tr.readyState === 'ended');
      });
      assert.ok(tracksEnded, 'expected every camera track to be readyState "ended" after the release delay elapsed');
    });
  } else skip('STATE B — every camera track is readyState "ended" after the release delay', 'getUserMedia unsupported in this environment');

  await t('no duplicate #scenepanel/#cam/#camstill ever existed across the whole run', async () => {
    const counts = await page.evaluate(() => ({
      panel: document.querySelectorAll('#scenepanel').length,
      cam: document.querySelectorAll('#cam').length,
      still: document.querySelectorAll('#camstill').length,
    }));
    assert.strictEqual(counts.panel, 1); assert.strictEqual(counts.cam, 1); assert.ok(counts.still <= 1);
  });

  await browser.close();
  console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
  if (failed) process.exitCode = 1;
}

main().catch(e => { console.error('FATAL:', e.stack || e.message); process.exitCode = 1; });
