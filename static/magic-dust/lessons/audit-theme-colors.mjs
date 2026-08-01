import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const lessons = dirname(fileURLToPath(import.meta.url));
const repo = resolve(lessons, '..');
const palette = JSON.parse(await readFile(resolve(lessons, 'theme-palette.json'), 'utf8'));
const colors = new Map(palette.colors.map(color => [color.token, color]));
const allowedBase = new Set(palette.colors.map(color => color.hex.toLowerCase()));
const colorPattern = /(?<![\w.])#[0-9a-f]{3,8}(?![0-9a-f])/gi;
const rgbPattern = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)/gi;
const allowedRgb = new Set(palette.colors.map(color => {
  const hex = color.hex.slice(1);
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',');
}));
const excluded = /(^|[\\/])(?:node_modules|temp|tmp|test-results|reference-sat0ru|assets|\.git|\.agents|\.claude|\.codex)([\\/]|$)|(^|[\\/])lessons[\\/]tools[\\/]nlp([\\/]|$)/;

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + .05) / (lo + .05);
}

function baseHex(value) {
  let hex = value.toLowerCase();
  if (hex.length === 4 || hex.length === 5) hex = '#' + [...hex.slice(1, 4)].map(x => x + x).join('');
  return hex.slice(0, 7);
}

console.log('| Token | Hex | Role |');
console.log('|---|---|---|');
for (const color of palette.colors) console.log(`| \`${color.token}\` | \`${color.hex}\` | ${color.role} |`);

let failed = false;
console.log('\nContrast pairs');
for (const pair of palette.contrastPairs) {
  const ratio = contrast(colors.get(pair.foreground).hex, colors.get(pair.background).hex);
  const passes = ratio >= pair.min;
  failed ||= !passes;
  console.log(`${passes ? 'PASS' : 'FAIL'} ${pair.foreground} on ${pair.background}: ${ratio.toFixed(2)}:1`);
}

const files = execFileSync('rg', [
  '--files', '-g', '*.css', '-g', '*.html', '-g', '*.js', '-g', '*.mjs',
  '-g', '!**/node_modules/**', '-g', '!temp/**', '-g', '!tmp/**',
  '-g', '!test-results/**', '-g', '!reference-sat0ru/**', '-g', '!assets/**',
  '-g', '!lessons/assets/**', '-g', '!lessons/tools/nlp/**',
], { cwd: repo, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);

const counts = new Map(), violations = [];
for (const relative of files) {
  if (excluded.test(relative)) continue;
  const source = await readFile(resolve(repo, relative), 'utf8');
  for (const match of source.matchAll(colorPattern)) {
    const value = match[0].toLowerCase();
    if (extname(relative) !== '.css' && value.length < 7) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
    const isPaletteDeclaration = relative.replaceAll('\\', '/') === 'lessons/palette.css';
    const rawCssOutsidePalette = extname(relative) === '.css' && !isPaletteDeclaration;
    if (!allowedBase.has(baseHex(value)) || rawCssOutsidePalette) {
      const line = source.slice(0, match.index).split('\n').length;
      violations.push(`${relative}:${line} ${value}${rawCssOutsidePalette ? ' (CSS must use var())' : ''}`);
    }
  }
  for (const match of source.matchAll(rgbPattern)) {
    const value = match[0].toLowerCase();
    const base = match.slice(1, 4).map(Number).join(',');
    counts.set(value, (counts.get(value) || 0) + 1);
    const rawCss = extname(relative) === '.css';
    if (!allowedRgb.has(base) || rawCss) {
      const line = source.slice(0, match.index).split('\n').length;
      violations.push(`${relative}:${line} ${value}${rawCss ? ' (CSS must use var()/color-mix())' : ''}`);
    }
  }
}

console.log(`\nProject inventory: ${counts.size} literal variants, ${[...counts.values()].reduce((a, b) => a + b, 0)} uses.`);
console.log(`Palette limit: ${allowedBase.size} base colors across hex/rgb; alpha variants may reuse only those bases.`);
if (violations.length) {
  failed = true;
  console.error(`\nPalette violations (${violations.length}):`);
  violations.forEach(item => console.error(item));
} else {
  console.log('PASS no color outside the palette and no raw hex in component CSS.');
}

const paletteCss = await readFile(resolve(lessons, 'palette.css'), 'utf8');
for (const color of palette.colors) {
  const declaration = `${color.token}:${color.hex}`;
  if (!paletteCss.toLowerCase().includes(declaration)) {
    failed = true;
    console.error(`Missing palette declaration: ${declaration}`);
  }
}
if (failed) process.exitCode = 1;
