#!/usr/bin/env node
// gen-bye-video.mjs — generate the onboarding's farewell cutscene via Veo
// (OpenRouter's unified video API), image-to-video from the CODE! gate's
// rune-circle screenshot. Mirrors onboard.js's ACT1 (assets/cutscenes/
// act1-oneshot.mp4): a single Veo one-shot clip, no stitching.
//
// The API key is never pasted into chat or committed: this script reads it
// straight out of an existing local .env (path via --env-file, default the
// nlp-master-midterm-proj one the user pointed at) at run time.
//
// Usage:
//   node lessons/tools/gen-bye-video.mjs
//   node lessons/tools/gen-bye-video.mjs --env-file D:/other/.env --out lessons/assets/cutscenes/bye-oneshot.mp4

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
    return acc;
  }, [])
);

const ENV_FILE = args['env-file'] || 'D:/nlp-master-midterm-proj/.env';
const FRAME_IMG = args.frame || 'lessons/assets/cutscenes/bye-frame-source.jpg';
const OUT = args.out || 'lessons/assets/cutscenes/bye-oneshot.mp4';
const MODEL = args.model || 'google/veo-3.1';
const POLL_MS = 6000;
const MAX_POLLS = 60; // 6 min ceiling

function readKey(envPath) {
  const text = readFileSync(envPath, 'utf8');
  const m = text.split('\n').find((l) => l.startsWith('OPENROUTER_API_KEY='));
  if (!m) throw new Error(`OPENROUTER_API_KEY not found in ${envPath}`);
  return m.slice('OPENROUTER_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
}

const PROMPT =
  'The camera slowly pulls back from a glowing blue magic rune circle floating in misty air, ' +
  'the runic symbols and star pattern gently dim and dissolve into drifting sparkles, ' +
  'the sparkles swirl outward and fade into darkness, warm gentle fade to black, ' +
  'dreamy fantasy storybook atmosphere, soft cinematic lighting, no text on screen';

async function main() {
  const key = readKey(resolve(ENV_FILE));
  const framePath = resolve(FRAME_IMG);
  if (!existsSync(framePath)) throw new Error(`frame image not found: ${framePath}`);
  const b64 = readFileSync(framePath).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${b64}`;

  console.log(`[gen-bye-video] submitting ${MODEL} job (image-to-video)…`);
  const submitRes = await fetch('https://openrouter.ai/api/v1/videos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt: PROMPT,
      resolution: '1080p',
      aspect_ratio: '16:9',
      frame_images: [{ type: 'image_url', image_url: { url: dataUrl }, frame_type: 'first_frame' }],
    }),
  });
  if (!submitRes.ok) throw new Error(`submit failed: ${submitRes.status} ${await submitRes.text()}`);
  const job = await submitRes.json();
  console.log(`[gen-bye-video] job id ${job.id}, status ${job.status}`);

  let status = job.status;
  for (let i = 0; i < MAX_POLLS && status !== 'completed' && status !== 'failed'; i++) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    const pollRes = await fetch(`https://openrouter.ai/api/v1/videos/${job.id}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!pollRes.ok) throw new Error(`poll failed: ${pollRes.status} ${await pollRes.text()}`);
    const j = await pollRes.json();
    status = j.status;
    console.log(`[gen-bye-video] poll ${i + 1}: ${status}`);
  }
  if (status !== 'completed') throw new Error(`job ended with status ${status}`);

  const dlRes = await fetch(`https://openrouter.ai/api/v1/videos/${job.id}/content?index=0`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!dlRes.ok) throw new Error(`download failed: ${dlRes.status} ${await dlRes.text()}`);
  const buf = Buffer.from(await dlRes.arrayBuffer());
  writeFileSync(resolve(OUT), buf);
  console.log(`[gen-bye-video] saved ${OUT} (${(buf.length / 1e6).toFixed(1)} MB)`);
}

main().catch((err) => {
  console.error('[gen-bye-video] FAILED:', err.message);
  process.exit(1);
});
