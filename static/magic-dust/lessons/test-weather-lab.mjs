import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  clampChannel,
  DwellZoneRecognizer,
  FINGER_COUNT_ACTIONS,
  FingerCountRecognizer,
  FingerTrailRecognizer,
  HandSealRecognizer,
  heartGestureMetrics,
  lotusPairMetrics,
  matchIncantation,
  palmCenter,
  totalRaisedFingers,
} from "./weather-lab/weather-core.js";

assert.equal(clampChannel(-20), 0);
assert.equal(clampChannel(128.7), 129);
assert.equal(clampChannel(999), 255);
assert.equal(matchIncantation("Phật nộ hỏa liên"), "lotus");
assert.equal(matchIncantation("Bùng nổ"), "lotus");

const openPalm = (dx = 0, dy = 0) => {
  const p = (x, y) => ({ x: x + dx, y: y + dy });
  const lm = new Array(21);
  lm[0]=p(.50,.85); lm[1]=p(.42,.80); lm[2]=p(.35,.70); lm[3]=p(.27,.62); lm[4]=p(.18,.55);
  lm[5]=p(.40,.65); lm[6]=p(.40,.50); lm[7]=p(.40,.38); lm[8]=p(.40,.28);
  lm[9]=p(.50,.65); lm[10]=p(.50,.48); lm[11]=p(.50,.35); lm[12]=p(.50,.25);
  lm[13]=p(.58,.66); lm[14]=p(.59,.50); lm[15]=p(.60,.38); lm[16]=p(.61,.28);
  lm[17]=p(.66,.68); lm[18]=p(.68,.54); lm[19]=p(.70,.42); lm[20]=p(.71,.32);
  return lm;
};

const landmarks = openPalm();
assert.ok(Math.abs(palmCenter(landmarks).x - .528) < 1e-9);
assert.ok(Math.abs(palmCenter(landmarks).y - .698) < 1e-9);

const lotusHands = [openPalm(-.18, 0), openPalm(.18, 0)];
const lotusMetrics = lotusPairMetrics(lotusHands);
assert.equal(lotusMetrics.active, true);
assert.ok(Number.isFinite(lotusMetrics.anchor.x) && Number.isFinite(lotusMetrics.anchor.y));
const lotusSeal = new HandSealRecognizer();
assert.equal(lotusSeal.sample(lotusHands, 0), null);
assert.equal(lotusSeal.sample(lotusHands, 800), "lotus");

// Các thủ ấn cũ không còn được phép kích hoạt hiệu ứng.
const oneHand = new HandSealRecognizer();
assert.equal(oneHand.sample([openPalm()], 0), null);
assert.equal(oneHand.sample([openPalm()], 1200), null);

const recognizer = new FingerTrailRecognizer();
const raw = screenPoints => screenPoints.map(point => ({ x: 1 - point.x, y: point.y }));
const circle = raw(Array.from({ length: 32 }, (_, index) => {
  const angle = index / 31 * Math.PI * 2;
  return { x: .38 + Math.cos(angle) * .18, y: .48 + Math.sin(angle) * .18 };
}));
const horizontal = raw([{x:.12,y:.72},{x:.24,y:.72},{x:.38,y:.71},{x:.55,y:.72}]);
const vertical = raw([{x:.15,y:.72},{x:.15,y:.6},{x:.15,y:.46},{x:.15,y:.3}]);
const vee = raw([{x:.15,y:.7},{x:.28,y:.82},{x:.42,y:.52}]);
const zigzag = raw([{x:.15,y:.72},{x:.3,y:.62},{x:.18,y:.52},{x:.36,y:.42},{x:.2,y:.32},{x:.42,y:.24}]);
assert.equal(recognizer.classify(circle), "mist");
assert.equal(recognizer.classify(horizontal), "filter_blur");
assert.equal(recognizer.classify(vertical), "filter_pixel");
assert.equal(recognizer.classify(vee), "filter_sharpen");
assert.equal(recognizer.classify(zigzag), "filter_cartoon");
assert.equal(recognizer.rank(circle)[0].kind, "mist");
assert.equal(recognizer.rank(horizontal)[0].kind, "filter_blur");
assert.equal(recognizer.rank(vertical)[0].kind, "filter_pixel");
assert.equal(recognizer.rank(vee)[0].kind, "filter_sharpen");
assert.equal(recognizer.rank(zigzag)[0].kind, "filter_cartoon");

const indexOnlyAt = (screenX, screenY) => {
  const hand = openPalm();
  hand[4] = { x: .41, y: .66 };
  hand[6] = { x: 1 - screenX, y: Math.min(.92, screenY + .22) };
  hand[8] = { x: 1 - screenX, y: screenY };
  hand[12] = { x: .50, y: .72 };
  hand[16] = { x: .60, y: .73 };
  hand[20] = { x: .69, y: .74 };
  return hand;
};
const confirmRecognizer = new FingerTrailRecognizer({ threshold: .12 });
const confirmPath = Array.from({ length: 18 }, (_, index) => {
  const angle = index / 17 * Math.PI * 2;
  return { x: .5 + Math.cos(angle) * .11, y: .51 + Math.sin(angle) * .11 };
});
for (let index = 0; index < confirmPath.length; index += 1) {
  const point = confirmPath[index];
  assert.equal(confirmRecognizer.sample([indexOnlyAt(point.x, point.y)], index * 90), null);
}
assert.equal(confirmRecognizer.sample([], 1800), null, "mất tracking không được tự cast");
assert.equal(confirmRecognizer.progress().awaitingConfirm, true);
const confirmedRune = confirmRecognizer.sample([openPalm()], 1900);
assert.equal(confirmedRune.kind, "mist");
assert.ok(confirmedRune.points.length > confirmPath.length, "camera FPS thấp phải được nội suy thêm điểm");

const dwellRecognizer = new DwellZoneRecognizer({ dwellMs: 1000, cooldownMs: 1500 });
assert.equal(dwellRecognizer.sample([indexOnlyAt(.84, .3)], 0), null);
assert.equal(dwellRecognizer.sample([indexOnlyAt(.84, .3)], 700), null);
assert.equal(dwellRecognizer.progress(700).kind, "snow");
assert.equal(dwellRecognizer.sample([indexOnlyAt(.84, .3)], 1100).kind, "snow");
assert.equal(dwellRecognizer.sample([indexOnlyAt(.84, .3)], 1500), null, "cooldown phải chặn trigger lặp");
assert.equal(heartGestureMetrics([openPalm(-.18, 0), openPalm(.18, 0)]).active, false);
const heartHands = [openPalm(-.12, 0), openPalm(.12, 0)];
heartHands[0][8] = { x: .49, y: .38 };
heartHands[1][8] = { x: .51, y: .38 };
heartHands[0][4] = { x: .49, y: .56 };
heartHands[1][4] = { x: .51, y: .56 };
assert.equal(heartGestureMetrics(heartHands).active, true);
assert.equal(FINGER_COUNT_ACTIONS[1], "vortex_fire");
assert.equal(FINGER_COUNT_ACTIONS[5], "summon_dust");
assert.equal(FINGER_COUNT_ACTIONS[9], "reset");
assert.equal(FINGER_COUNT_ACTIONS[10], undefined, "10 ngón phải dành khoảng trống cho cử chỉ trái tim");
assert.equal(totalRaisedFingers([indexOnlyAt(.5, .5)]), 1);
assert.equal(totalRaisedFingers([openPalm(-.15, 0), openPalm(.15, 0)]), 10);
const fingerCountRecognizer = new FingerCountRecognizer({ holdMs: 500, cooldownMs: 0 });
assert.equal(fingerCountRecognizer.sample([indexOnlyAt(.5, .5)], 1), null);
assert.equal(fingerCountRecognizer.sample([indexOnlyAt(.5, .5)], 600).kind, "vortex_fire");
assert.equal(fingerCountRecognizer.sample([openPalm()], 700), null);
assert.equal(fingerCountRecognizer.sample([openPalm()], 1300), null, "đổi thẳng 1 → 5 không được phát phép thứ hai");
fingerCountRecognizer.sample([], 1400);
fingerCountRecognizer.sample([], 1650);
assert.equal(fingerCountRecognizer.sample([openPalm(-.15, 0), openPalm(.15, 0)], 1700), null);
assert.equal(fingerCountRecognizer.sample([openPalm(-.15, 0), openPalm(.15, 0)], 2300), null);

const ritualRecognizer = new FingerCountRecognizer({ holdMs: 300, cooldownMs: 0 });
assert.equal(ritualRecognizer.sample([openPalm()], 0), null);
assert.equal(ritualRecognizer.sample([openPalm()], 350).kind, "summon_dust");
assert.equal(ritualRecognizer.sample([indexOnlyAt(.5, .5)], 400), null);
assert.equal(ritualRecognizer.sample([indexOnlyAt(.5, .5)], 750).kind, "vortex_fire", "5 → 1 là chuyển phép duy nhất không cần thả tay");
assert.equal(ritualRecognizer.sample([openPalm()], 800), null);
assert.equal(ritualRecognizer.sample([openPalm()], 1200), null, "sau vortex phải thả tay mới được summon lại");

const [demoHtml, coreSource, cinematicSource, magic3dSource, webglSource, environmentSource, stylesSource, redesignSource] = await Promise.all([
  readFile(new URL("./weather-lab/demo.html", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/weather-core.js", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/cinematic-vfx.js", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/lotus-3d.js", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/webgl-particle-vfx.js", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/environment-vfx.js", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/styles.css", import.meta.url), "utf8"),
  readFile(new URL("./weather-lab/demo-redesign.css", import.meta.url), "utf8"),
]);

assert.doesNotMatch(demoHtml, /data-weather="lotus"/);
assert.doesNotMatch(demoHtml, /id="lotus-release"/);
assert.match(demoHtml, /Hai tay tạo trái tim/);
assert.match(demoHtml, /id="ritual-start-zone"/);
assert.match(demoHtml, /id="camera-filter-layer"/);
assert.match(demoHtml, /id="mist-color"/);
assert.match(demoHtml, /data-rune-card="summon_dust"/);
assert.match(demoHtml, /GIỮ SỐ NGÓN TAY/);
assert.equal((demoHtml.match(/data-dwell-zone=/g) || []).length, 0);
assert.match(demoHtml, /id="photo-countdown"/);
assert.match(demoHtml, /id="rune-match-score"/);
assert.doesNotMatch(demoHtml, /data-weather="(?:lightning|swords|orb)"/);
assert.doesNotMatch(demoHtml, /data-environment=/);

assert.match(coreSource, /new FingerCountRecognizer/);
assert.match(coreSource, /new WebglParticleVfx/);
assert.match(coreSource, /updateRuneMatch/);
assert.match(coreSource, /activateDwellAtmosphere/);
assert.match(coreSource, /heartGestureMetrics/);
assert.match(coreSource, /recorder\.snapshot/);
assert.match(coreSource, /updateHeartCapture\(hands, now\)/);
assert.match(cinematicSource, /lotus: \{ duration:/);
assert.match(cinematicSource, /flowers_sakura/);
assert.match(cinematicSource, /flowers_blue/);
assert.match(cinematicSource, /flowers_gold/);
assert.match(cinematicSource, /pixie_dust/);
assert.match(cinematicSource, /renderPixieDust/);
assert.match(cinematicSource, /vortex_fire/);
assert.match(cinematicSource, /renderFireVortex/);
assert.match(cinematicSource, /renderSummonedDust/);
assert.match(cinematicSource, /setDustSummon/);
assert.match(cinematicSource, /lotus-neutral-atlas-20x4\.png/);
assert.match(cinematicSource, /LOTUS_COLORS/);
assert.match(cinematicSource, /drawLotusField/);
assert.match(cinematicSource, /Math\.round\(72 \* multiplier\)/);
assert.match(webglSource, /count = 2800/);
assert.match(webglSource, /2600 \* dt/);
assert.match(webglSource, /captureVortex/);
assert.match(webglSource, /buildLightning/);
assert.match(cinematicSource, /explosion-burst-v1-alpha\.webm/);
assert.doesNotMatch(cinematicSource, /fireball-1\.webm|fire-track-right\.webm/);
assert.match(magic3dSource, /this\.buildLotus\(\)/);
assert.doesNotMatch(magic3dSource.slice(magic3dSource.indexOf("this.buildLotus()"), magic3dSource.indexOf("this.loop =")), /buildSwords|buildLightning|buildOrb/);
assert.match(environmentSource, /fog-drift-v1-alpha\.webm/);
assert.match(environmentSource, /renderRitualPath/);
assert.match(environmentSource, /renderRitualSeal/);
assert.match(environmentSource, /ritualClouds/);
assert.match(environmentSource, /wispLength/);
assert.match(environmentSource, /fogTintCanvas/);
assert.match(environmentSource, /setMistColor/);
assert.match(environmentSource, /mist:\s*60000/);
assert.match(environmentSource, /snow:\s*36000/);
assert.match(environmentSource, /renderSnow/);
assert.match(coreSource, /quantizeStep\s*=\s*42/);
assert.match(coreSource, /edgeStrength\s*>\s*edgeThreshold/);
assert.match(stylesSource, /\.ritual-start-zone/);
assert.match(stylesSource, /data-filter="pixel"/);
assert.match(stylesSource, /data-filter="cartoon"/);
assert.match(redesignSource, /\.rune-match-panel/);
assert.match(redesignSource, /\.rune-card\.matching/);

// The fog and explosion plates are self-generated now (Gemini/Veo, see
// generated/SOURCE.md) — the FootageCrate downloads they replaced could not be
// redistributed, and this project ships publicly.
for (const file of ["fog-drift-v1-alpha.webm", "explosion-burst-v1-alpha.webm", "SOURCE.md"]) {
  await access(new URL(`./assets/camera-effects/generated/${file}`, import.meta.url));
}

await access(new URL("./weather-lab/GEMINI-VIDEO-CONCEPT-PROMPT.md", import.meta.url));
await access(new URL("./assets/camera-effects/generated/lotus-neutral-atlas-20x4.png", import.meta.url));

console.log("weather lab: two-spell runtime, rune filters and learner controls passed");
