// node lessons/test-editor-serializer.mjs
// Round-trip proof for editor-serializer.mjs: for every real
// lessons/content/node*.js (+ TEMPLATE.js), import the original, serialize
// it, write the result to a temp file, re-import THAT, and deep-compare
// against the original (RegExp compared by .source/.flags since RegExp
// objects are never === across two literal instances). House assert style
// (no test framework in this repo) — see test-cell-validation.mjs.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { serializeNode } from './editor-serializer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, 'content');

let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; }
  else { fail++; console.error(`FAIL: ${msg}`); }
}

// deepEqual — RegExp-aware structural comparison. Key order is irrelevant
// (this proves DATA equality, not textual/formatting equality).
function deepEqual(a, b, path0) {
  path0 = path0 || '$';
  if (a === b) return true;
  if (a instanceof RegExp || b instanceof RegExp) {
    if (!(a instanceof RegExp) || !(b instanceof RegExp)) { console.error(`  mismatch @ ${path0}: RegExp vs non-RegExp`); return false; }
    const ok = a.source === b.source && a.flags === b.flags;
    if (!ok) console.error(`  mismatch @ ${path0}: /${a.source}/${a.flags} vs /${b.source}/${b.flags}`);
    return ok;
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) { console.error(`  mismatch @ ${path0}: array vs non-array`); return false; }
    if (a.length !== b.length) { console.error(`  mismatch @ ${path0}: array length ${a.length} vs ${b.length}`); return false; }
    return a.every((v, i) => deepEqual(v, b[i], `${path0}[${i}]`));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ak = Object.keys(a).filter(k => a[k] !== undefined).sort();
    const bk = Object.keys(b).filter(k => b[k] !== undefined).sort();
    if (ak.length !== bk.length || ak.some((k, i) => k !== bk[i])) {
      console.error(`  mismatch @ ${path0}: keys [${ak}] vs [${bk}]`);
      return false;
    }
    return ak.every(k => deepEqual(a[k], b[k], `${path0}.${k}`));
  }
  console.error(`  mismatch @ ${path0}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
  return false;
}

async function testFile(file) {
  const url = pathToFileURL(file).href;
  const original = (await import(`${url}?orig`)).default;
  const source = serializeNode(original);

  // must be syntactically valid JS we can re-import
  const tmp = path.join(os.tmpdir(), `editor-serializer-test-${path.basename(file, '.js')}-${Date.now()}.mjs`);
  fs.writeFileSync(tmp, source, 'utf8');
  let reloaded;
  try {
    reloaded = (await import(pathToFileURL(tmp).href)).default;
  } catch (e) {
    assert(false, `${path.basename(file)}: serialized output failed to re-import: ${e.message}`);
    fs.unlinkSync(tmp);
    return;
  }
  fs.unlinkSync(tmp);

  const ok = deepEqual(original, reloaded);
  assert(ok, `${path.basename(file)}: round-trip deep-equal`);
}

async function main() {
  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => /^(node0[0-7]|TEMPLATE)\.js$/.test(f))
    .sort()
    .map(f => path.join(CONTENT_DIR, f));

  assert(files.length === 9, `expected 9 content files (node00-07 + TEMPLATE), found ${files.length}: ${files.map(f => path.basename(f))}`);

  for (const f of files) {
    console.log(`-- ${path.basename(f)} --`);
    await testFile(f);
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main();
