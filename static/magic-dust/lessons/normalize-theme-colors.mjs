import { readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = resolve(fileURLToPath(new URL('..', import.meta.url)));
const palette = JSON.parse(await readFile(resolve(repo, 'lessons/theme-palette.json'), 'utf8')).colors;
const colorPattern = /(?<![\w.])#[0-9a-f]{3,8}(?![0-9a-f])/gi;
const rgbPattern = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)/gi;
const excluded = [
  /(^|[\\/])(?:node_modules|temp|tmp|test-results|reference-sat0ru|assets|\.git|\.agents|\.claude|\.codex)([\\/]|$)/,
  /(^|[\\/])lessons[\\/]tools[\\/]nlp([\\/]|$)/,
  /(?:palette\.css|theme-palette\.json|COLOR-SYSTEM\.md|audit-theme-colors\.mjs|normalize-theme-colors\.mjs)$/,
];

function parseHex(value) {
  let hex = value.slice(1);
  if (hex.length === 3 || hex.length === 4) hex = [...hex].map(x => x + x).join('');
  const alpha = hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1;
  return { rgb: [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)), alpha };
}

function nearestRgb(rgb) {
  let best = null;
  for (const candidate of palette) {
    const target = parseHex(candidate.hex);
    const distance = rgb.reduce((sum, channel, i) => {
      const weight = [0.3, 0.59, 0.11][i];
      return sum + weight * (channel - target.rgb[i]) ** 2;
    }, 0);
    if (!best || distance < best.distance) best = { ...candidate, distance };
  }
  return best;
}

function nearestToken(value) {
  const source = parseHex(value);
  return { ...nearestRgb(source.rgb), alpha: source.alpha };
}

function cssColor(value) {
  const match = nearestToken(value);
  if (match.alpha >= .995) return `var(${match.token})`;
  return `color-mix(in srgb,var(${match.token}) ${Math.round(match.alpha * 100)}%,transparent)`;
}

function literalColor(value) {
  const match = nearestToken(value);
  if (match.alpha >= .995) return match.hex;
  return match.hex + Math.round(match.alpha * 255).toString(16).padStart(2, '0');
}

function cssRgb(_, red, green, blue, alpha = '1') {
  const match = nearestRgb([red, green, blue].map(Number));
  const opacity = Number(alpha);
  return opacity >= .995 ? `var(${match.token})` : `color-mix(in srgb,var(${match.token}) ${Math.round(opacity * 100)}%,transparent)`;
}

function literalRgb(_, red, green, blue, alpha = '1') {
  const match = nearestRgb([red, green, blue].map(Number));
  const opacity = Number(alpha);
  if (opacity >= .995) return match.hex;
  const { rgb } = parseHex(match.hex);
  return `rgba(${rgb.join(',')},${alpha})`;
}

const files = execFileSync('rg', [
  '--files', '-g', '*.css', '-g', '*.html', '-g', '*.js', '-g', '*.mjs',
  '-g', '!**/node_modules/**', '-g', '!temp/**', '-g', '!tmp/**',
  '-g', '!test-results/**', '-g', '!reference-sat0ru/**', '-g', '!assets/**',
  '-g', '!lessons/assets/**', '-g', '!lessons/tools/nlp/**',
], { cwd: repo, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);

let changedFiles = 0, replacements = 0;
for (const relative of files) {
  if (excluded.some(pattern => pattern.test(relative))) continue;
  const path = resolve(repo, relative);
  const before = await readFile(path, 'utf8');
  const isCss = extname(path) === '.css';
  let after = before;
  if (isCss || extname(path) === '.html') after = after.replace(colorPattern, value => {
    replacements++;
    return isCss ? cssColor(value) : literalColor(value);
  });
  after = after.replace(rgbPattern, (...args) => {
    replacements++;
    return isCss ? cssRgb(...args) : literalRgb(...args);
  });
  if (after === before) continue;
  await writeFile(path, after, 'utf8');
  changedFiles++;
}

console.log(`Normalized ${replacements} color literals in ${changedFiles} files.`);
