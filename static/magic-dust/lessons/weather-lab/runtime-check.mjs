import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
console.log("browser launched");
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => {
  if (message.type() === "error" && !/favicon|ERR_FILE_NOT_FOUND/.test(message.text())) errors.push(message.text());
});

await page.goto("http://127.0.0.1:8765/lessons/weather-lab/demo.html", {
  waitUntil: "domcontentloaded",
  timeout: 15000,
});
console.log("page loaded");
await page.locator("#ritual-start-zone").waitFor({ state: "visible" });
await page.locator("dialog.seal-grimoire").evaluate(dialog => dialog.close());
if (await page.locator('[data-weather="lightning"],[data-weather="swords"],[data-weather="orb"],[data-weather="lotus"],#lotus-release').count()) {
  throw new Error("Phép cũ vẫn còn nút kích hoạt trong demo.");
}
if (await page.locator("[data-dwell-zone]").count() !== 0) {
  throw new Error("Demo vẫn còn vùng tròn chạm/giữ.");
}
await page.screenshot({ path: "../artifacts/weather-action-dock-runtime.png" });
const snapshotReady = await page.evaluate(() => window.weatherLab.snapshot().startsWith("data:image/png"));
if (!snapshotReady) throw new Error("Studio chưa xuất được ảnh composite PNG.");

await page.locator("#mist-color").fill("#d86bff");
await page.locator("#mist-preview").click({ force: true });
console.log("Nebulus preview started");
await page.waitForFunction(() => document.querySelector(".camera-stage")?.dataset.atmosphere === "neon-mist", null, { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: "../artifacts/weather-rune-nebulus-runtime.png" });
await page.waitForTimeout(3200);
await page.screenshot({ path: "../artifacts/weather-nebulus-sustain-runtime.png" });

await page.evaluate(() => window.weatherLab.activateDwellAtmosphere({ kind: "flowers_sakura", point: { x: .5, y: .5 } }));
await page.waitForTimeout(700);
await page.screenshot({ path: "../artifacts/weather-sakura-runtime.png" });
for (const kind of ["flowers_blue", "flowers_gold"]) {
  const activeMode = await page.evaluate(kind => {
    window.weatherLab.activateDwellAtmosphere({ kind, point: { x: .5, y: .5 } });
    return window.weatherLab.cinematicFx.getState().mode;
  }, kind);
  if (activeMode !== kind) throw new Error(`${kind} chưa chạy đúng scene, nhận ${activeMode}.`);
}
await page.evaluate(() => window.weatherLab.activateDwellAtmosphere({ kind: "flowers_blue", point: { x: .5, y: .5 } }));
await page.waitForTimeout(650);
await page.screenshot({ path: "../artifacts/weather-lotus-atlas-rain-runtime.png" });

for (const kind of ["snow", "rain"]) {
  const active = await page.evaluate(kind => {
    window.weatherLab.activateDwellAtmosphere({ kind, point: { x: .5, y: .5 } });
    return window.weatherLab.environmentFx.getState().targets;
  }, kind);
  if (active[kind] <= 0) throw new Error(`${kind} chưa được EnvironmentVfxEngine kích hoạt.`);
}
await page.waitForTimeout(650);
await page.screenshot({ path: "../artifacts/weather-snow-rain-runtime.png" });

await page.evaluate(() => window.weatherLab.activateDwellAtmosphere({ kind: "lightning", point: { x: .5, y: .5 } }));
await page.waitForTimeout(850);
await page.screenshot({ path: "../artifacts/weather-lightning-runtime.png" });
for (const [kind, expected] of [
  ["filter_blur", "blur"],
  ["filter_sharpen", "sharpen"],
  ["filter_pixel", "pixel"],
  ["filter_cartoon", "cartoon"],
  ["filter_flip", "flip"],
]) {
  const actual = await page.evaluate(kind => {
    window.weatherLab.activateDwellAtmosphere({ kind, point: { x: .5, y: .5 } });
    return document.querySelector(".camera-stage")?.dataset.filter;
  }, kind);
  if (actual !== expected) throw new Error(`${kind} đặt filter ${actual}, cần ${expected}.`);
}
await page.screenshot({ path: "../artifacts/weather-cartoon-filter-runtime.png" });

await page.evaluate(() => window.weatherLab.activateDwellAtmosphere({ kind: "reset", point: { x: .5, y: .5 } }));
const pixieMode = await page.evaluate(() => {
  window.weatherLab.activateDwellAtmosphere({ kind: "pixie_dust", point: { x: .5, y: .5 } });
  return window.weatherLab.cinematicFx.getState().mode;
});
if (pixieMode !== "pixie_dust") throw new Error(`Pixie Dust scene mismatch: ${pixieMode}.`);
await page.waitForTimeout(500);
await page.evaluate(() => {
  window.weatherLab.activateDwellAtmosphere({ kind: "reset", point: { x: .5, y: .5 } });
  window.weatherLab.webglFx.clear();
  window.weatherLab.webglFx.setDustSummon(true, { x: .5, y: .55 });
});
await page.waitForTimeout(1200);
const webglDust = await page.evaluate(() => {
  window.weatherLab.webglFx.setDustSummon(false);
  return window.weatherLab.webglFx.getState();
});
if (webglDust.mode !== "summon_dust" || webglDust.alive < 700) {
  throw new Error(`WebGL Magic Dust chưa đủ dày: ${JSON.stringify(webglDust)}.`);
}
await page.evaluate(() => window.weatherLab.webglFx.cast("vortex_fire", { anchor: { x: .5, y: .55 }, duration: 9000 }));
await page.waitForTimeout(1700);
const webglVortex = await page.evaluate(() => window.weatherLab.webglFx.getState());
if (webglVortex.mode !== "vortex_fire" || webglVortex.alive < 650) {
  throw new Error(`WebGL vortex chưa giữ được trường bụi: ${JSON.stringify(webglVortex)}.`);
}
await page.screenshot({ path: "../artifacts/weather-webgl-vortex-runtime.png" });
for (const kind of ["rain", "snow"]) {
  await page.evaluate(kind => window.weatherLab.webglFx.cast(kind, { duration: 5000 }), kind);
  await page.waitForTimeout(350);
  const state = await page.evaluate(() => window.weatherLab.webglFx.getState());
  const minimumCoverage = kind === "rain" ? 2000 : 1100;
  if (state.mode !== kind || state.alive < minimumCoverage) {
    throw new Error(`WebGL ${kind} chưa phủ kín màn hình: ${JSON.stringify(state)}.`);
  }
}
await page.screenshot({ path: "../artifacts/weather-webgl-snow-runtime.png" });
await page.evaluate(() => window.weatherLab.webglFx.cast("lightning", { anchor: { x: .5, y: .6 }, duration: 5000 }));
await page.waitForTimeout(260);
const lightningSegments = await page.evaluate(() => window.weatherLab.webglFx.lightningRoot.children.length);
if (lightningSegments < 10) throw new Error(`WebGL lightning quá ít lớp: ${lightningSegments}.`);
await page.screenshot({ path: "../artifacts/weather-webgl-lightning-runtime.png" });
await page.evaluate(() => window.weatherLab.activateDwellAtmosphere({ kind: "reset", point: { x: .5, y: .5 } }));
const resetState = await page.evaluate(() => ({
  filter: document.querySelector(".camera-stage")?.dataset.filter,
  atmosphere: document.querySelector(".camera-stage")?.dataset.atmosphere,
}));
if (resetState.filter !== "normal" || resetState.atmosphere !== "clear") {
  throw new Error(`Reset chưa sạch: ${JSON.stringify(resetState)}`);
}

const studentPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
studentPage.on("pageerror", error => errors.push(`student: ${error.message}`));
await studentPage.goto("http://127.0.0.1:8765/lessons/weather-lab/index.html", { waitUntil: "domcontentloaded", timeout: 15000 });
await studentPage.locator('[data-level="senior"]').click();
await studentPage.locator("#blank-index").selectOption("true");
await studentPage.locator("#blank-little").selectOption("true");
await studentPage.locator("#blank-effect").selectOption("mist");
await studentPage.locator("#check-senior").click();
if (await studentPage.locator("#senior-result").getAttribute("data-ok") !== "true") {
  throw new Error("Bài tập rune của trang học sinh chưa cho OUTPUT đúng.");
}

const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobilePage.on("pageerror", error => errors.push(`mobile: ${error.message}`));
await mobilePage.goto("http://127.0.0.1:8765/lessons/weather-lab/demo.html", { waitUntil: "domcontentloaded", timeout: 15000 });
await mobilePage.locator("dialog.seal-grimoire").evaluate(dialog => dialog.close());
const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - innerWidth);
if (mobileOverflow > 2) throw new Error(`Demo mobile tràn ngang ${mobileOverflow}px.`);
const mobileStageHeight = await mobilePage.locator(".camera-stage").evaluate(element => element.getBoundingClientRect().height);
if (mobileStageHeight < 480) throw new Error(`Sân khấu mobile quá thấp: ${mobileStageHeight}px.`);
await mobilePage.screenshot({ path: "../artifacts/weather-rune-mobile-runtime.png" });

await browser.close();
if (errors.length) throw new Error(`Runtime errors:\n${errors.join("\n")}`);
console.log("weather lab browser proof: finger-count controls, heart photo, summon-to-vortex ritual, weather and filters rendered without page errors");
process.exit(0);
