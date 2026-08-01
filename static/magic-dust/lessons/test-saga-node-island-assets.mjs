// node lessons/test-saga-node-island-assets.mjs
// Static regression: each main node owns one canonical storybook asset.
// Locked/current/done are visual states applied by CSS, not duplicate sprites.
import assert from 'node:assert';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

const saga = readFileSync(new URL('./saga.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('./saga.css', import.meta.url), 'utf8');
const lessonsDir = new URL('./', import.meta.url);
const storybookDir = new URL('./assets/storybook/node-islands/', import.meta.url);

const nodesBlock = saga.match(/const NODES = \[([\s\S]*?)\];/);
assert.ok(nodesBlock, 'NODES block must exist');

const entries = [...nodesBlock[1].matchAll(/title: '([^']+)'[\s\S]*?island: \{ unlit: '([^']+)', lit: '([^']+)' \}/g)]
  .map((match, index) => ({ index, title: match[1], legacyUnlit: match[2], legacyLit: match[3] }));

assert.strictEqual(entries.length, 26, 'nodes 0-25 must each declare a topic-specific island key');

const canonical = entries.map(entry => {
  const filename = entry.legacyLit.split('/').pop().replace(/\.png$/, '.webp');
  return `assets/storybook/node-islands/storybook-${filename}`;
});
assert.strictEqual(new Set(canonical).size, entries.length, 'main node storybook assets must be unique');

for (const [index, asset] of canonical.entries()) {
  assert.ok(asset.endsWith('-lit.webp'), `node ${index} canonical art should use the single WebP source`);
  assert.ok(existsSync(new URL(asset, lessonsDir)), `node ${index} storybook art file is missing: ${asset}`);
  assert.ok(statSync(new URL(asset, lessonsDir)).size <= 120 * 1024, `node ${index} WebP should stay within the 120KB runtime budget`);
}

const runtimePngs = readdirSync(storybookDir).filter(name => name.endsWith('.png'));
assert.deepStrictEqual(runtimePngs, [], 'storybook node-islands must not keep PNG duplicates beside runtime WebPs');
assert.match(saga, /const litAssetName = src =>[\s\S]*'-lit\.webp'/, 'node art lookup must normalize legacy keys to one canonical WebP asset');
assert.match(saga, /state === 'current'[\s\S]*loading="eager" fetchpriority="high"[\s\S]*loading="lazy" fetchpriority="low"/, 'only the current main node should load eagerly');
assert.match(css, /\.node\.locked \.island img\{filter:/, 'locked node state must be rendered with CSS');

console.log(`node island asset checks passed (${entries.length} budgeted WebPs, CSS states, lazy loading)`);
