import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const framesDir = fileURLToPath(new URL("../../artifacts/lotus-atlas-frames/", import.meta.url));
const sourceAtlas = `${framesDir}lotus-source-atlas.png`;
const output = fileURLToPath(new URL("../assets/camera-effects/generated/lotus-neutral-atlas-20x4.png", import.meta.url));
await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 256, height: 256 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8765/lessons/weather-lab/lotus-atlas-render.html", { waitUntil: "networkidle" });
await page.waitForFunction(() => Boolean(window.lotusAtlas));
for (let index = 0; index < 80; index += 1) {
  const phase = index % 20;
  const angle = Math.floor(index / 20);
  const opening = phase <= 10 ? phase / 10 : (19 - phase) / 9;
  await page.evaluate(({ age, yaw }) => window.lotusAtlas.render(age, yaw), {
    age: 1450 + opening * 5200,
    yaw: angle * Math.PI / 2,
  });
  await page.locator("canvas").screenshot({
    path: `${framesDir}frame-${String(index).padStart(2, "0")}.png`,
    omitBackground: true,
  });
}
await browser.close();

const ffmpeg = spawnSync("ffmpeg", [
  "-y", "-framerate", "1", "-i", `${framesDir}frame-%02d.png`,
  "-vf", "tile=20x4:padding=0:margin=0", "-frames:v", "1", sourceAtlas,
], { encoding: "utf8" });
if (ffmpeg.status !== 0) throw new Error(ffmpeg.stderr || "ffmpeg atlas render failed");
const neutral = spawnSync("ffmpeg", [
  "-y", "-i", sourceAtlas,
  "-vf", "hue=s=0,eq=brightness=0.16:contrast=0.82,scale=3840:768:flags=lanczos,format=rgba",
  "-frames:v", "1", output,
], { encoding: "utf8" });
if (neutral.status !== 0) throw new Error(neutral.stderr || "ffmpeg neutral atlas conversion failed");
console.log(output);
