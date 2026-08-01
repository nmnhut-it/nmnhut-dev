// node lessons/test-saga-side-island-assets.mjs
// Static regression: side locations render one canonical storybook WebP each;
// locked/done differences are CSS states, not duplicate image files.
import assert from 'node:assert';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

const saga = readFileSync(new URL('./saga.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('./saga.css', import.meta.url), 'utf8');
const lessonsDir = new URL('./', import.meta.url);
const storybookDir = new URL('./assets/storybook/side-islands/', import.meta.url);

const sideBlock = saga.match(/const SIDE_ISLANDS = \[([\s\S]*?)\];/);
assert.ok(sideBlock, 'SIDE_ISLANDS block must exist');

const entries = [...sideBlock[1].matchAll(/^\s*\{ id: '([^']+)'[^\n]+/gm)].map(match => {
  const row = match[0];
  return {
    id: match[1],
    art: row.match(/art: '([^']+)'/)[1],
    storybook: !/storybook:\s*false/.test(row),
  };
});

assert.strictEqual(entries.length, 59, 'every side island/learning branch/tower must declare art');
for (const entry of entries) {
  const asset = entry.storybook
    ? `assets/storybook/side-islands/storybook-${entry.art.split('/').pop().replace(/-unlit\.png$/, '-lit.webp').replace(/-lit\.png$/, '-lit.webp')}`
    : entry.art;
  assert.ok(asset.startsWith('assets/storybook/'), `${entry.id} must render from the canonical storybook tree`);
  assert.ok(existsSync(new URL(asset, lessonsDir)), `${entry.id} storybook art file is missing: ${asset}`);
  assert.ok(asset.endsWith('.webp'), `${entry.id} runtime art should be WebP`);
  assert.ok(statSync(new URL(asset, lessonsDir)).size <= 120 * 1024, `${entry.id} WebP should stay within the 120KB runtime budget`);
}

const runtimePngs = readdirSync(storybookDir).filter(name => name.endsWith('.png'));
assert.deepStrictEqual(runtimePngs, [], 'storybook side-islands must not keep PNG duplicates beside runtime WebPs');
for (const folder of ['branches', 'towers']) {
  const pngs = readdirSync(new URL(`./assets/storybook/${folder}/`, import.meta.url)).filter(name => name.endsWith('.png'));
  assert.deepStrictEqual(pngs, [], `storybook ${folder} must not keep PNG duplicates beside runtime WebPs`);
}
assert.match(css, /\.sidenode\.locked \.sideart img\{filter:/, 'locked side-island state must be rendered with CSS');
assert.match(css, /\.sidenode\.done \.sideart img\{filter:/, 'done side-island state must be rendered with CSS');
assert.match(saga, /<div class="sideart"><img src="\$\{mapAsset\(sideArt\)\}" alt="" loading="lazy" decoding="async" fetchpriority="low"><\/div>/, 'sideIslandEl must version and lazy-load canonical art');
assert.match(saga, /<div class="sidepin"><span class="sideicon">/, 'side pin state badge should remain');
assert.match(saga, /SIDE_DISCOVERY_KEY/, 'side island map should use discovery storage');
assert.match(saga, /SideRpsGate/, 'unsolved side islands should enter through the RPS gate');
assert.ok(existsSync(new URL('assets/world/rps/rps-tokens.webp', lessonsDir)), 'RPS token sprite sheet is missing');
// Dimensions live in a different place per WebP flavour: alpha art becomes a
// VP8X container, opaque lossy stays a bare VP8 frame, palettised art is VP8L.
function webpSize(b) {
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8X') return [(b.readUIntLE(24, 3) & 0xffffff) + 1, (b.readUIntLE(27, 3) & 0xffffff) + 1];
  if (kind === 'VP8L') { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}
const [rpsW, rpsH] = webpSize(readFileSync(new URL('assets/world/rps/rps-tokens.webp', lessonsDir)));
assert.strictEqual(rpsW, 1536, 'RPS token sprite sheet width should be exactly 1536px');
assert.strictEqual(rpsH, 512, 'RPS token sprite sheet height should be exactly 512px');

console.log(`side-island asset checks passed (${entries.length} budgeted WebPs, CSS states, lazy loading)`);
