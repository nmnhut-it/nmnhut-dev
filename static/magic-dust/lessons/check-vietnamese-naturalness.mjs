import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const lessonsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(lessonsDir);
const scorerPath = path.join(lessonsDir, 'tools', 'nlp', 'phobert_pll.py');
const skipDirs = new Set(['.git', 'node_modules', '.venv', '__pycache__']);
const skipKeys = new Set([
  'art', 'litArt', 'unlit', 'page', 'id', 'sideIslandId', 'badgeId',
  'glyph', 'glyphs', 'chant', 'chantAccept', 'gesture', 'palette',
  'modules', 'solution', 'expectOut', 'correct',
]);

function usage() {
  return `Usage:
  node lessons/check-vietnamese-naturalness.mjs --candidate "câu 1" --candidate "câu 2"
  node lessons/check-vietnamese-naturalness.mjs [--top 20] [--offline] [--exact] <lesson.js|dir|glob ...>

Candidate mode ranks alternatives from most to least natural. File mode prints
the lowest-scoring learner-facing sentences for human review. It does not fail
the build: PhoBERT is a review signal, not a hard language rule.`;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function globToRegExp(pattern) {
  const normalized = pattern.replace(/\\/g, '/');
  let out = '^';
  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    if (ch === '*') {
      if (normalized[i + 1] === '*') { out += '.*'; i += 1; }
      else out += '[^/]*';
    } else if (ch === '?') out += '[^/]';
    else out += escapeRegex(ch);
  }
  return new RegExp(`${out}$`, 'u');
}

async function walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

async function expandTargets(targets) {
  const files = new Set();
  for (const target of targets) {
    if (/[*?]/.test(target)) {
      const absolute = path.resolve(target).replace(/\\/g, '/');
      const firstGlob = absolute.search(/[*?]/);
      const slash = absolute.lastIndexOf('/', firstGlob);
      const base = absolute.slice(0, slash) || path.parse(absolute).root;
      const matcher = globToRegExp(absolute.slice(slash + 1));
      for (const file of await walk(base)) {
        const relative = path.relative(base, file).replace(/\\/g, '/');
        if (matcher.test(relative) && path.extname(file) === '.js') files.add(path.resolve(file));
      }
      continue;
    }
    const full = path.resolve(target);
    let stat;
    try { stat = await fs.stat(full); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (stat.isDirectory()) {
      for (const file of await walk(full)) if (path.extname(file) === '.js') files.add(path.resolve(file));
    } else if (stat.isFile() && path.extname(full) === '.js') files.add(full);
  }
  return [...files].sort();
}

function codeComments(code) {
  return code.split(/\r?\n/).flatMap((line) => {
    const index = line.indexOf('#');
    return index >= 0 && line.slice(index + 1).trim() ? [line.slice(index + 1).trim()] : [];
  });
}

function collectStrings(value, source, key = '', pointer = '', out = []) {
  if (value == null) return out;
  if (typeof value === 'string') {
    const texts = key === 'code' ? codeComments(value) : (skipKeys.has(key) ? [] : [value]);
    for (const text of texts) out.push({ source, pointer, text });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, source, key, `${pointer}[${index}]`, out));
    return out;
  }
  if (typeof value === 'object') {
    for (const [childKey, child] of Object.entries(value)) {
      collectStrings(child, source, childKey, pointer ? `${pointer}.${childKey}` : childKey, out);
    }
  }
  return out;
}

function splitSentences(item) {
  return item.text
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/(?<=[.!?…])\s+|\r?\n+/u)
    .map((text) => text.trim())
    .filter((text) => {
      if (!/[À-ỹĐđ]/u.test(text) || text.length < 12) return false;
      const wordCount = (text.match(/[\p{L}\p{N}_]+/gu) || []).length;
      return /[.!?…]$/u.test(text) || wordCount >= 7;
    })
    .map((text) => ({ ...item, text }));
}

function parseArgs(args) {
  const options = { candidates: [], targets: [], top: 20, offline: false, exact: false, model: null, python: 'python' };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--candidate') options.candidates.push(args[++i]);
    else if (arg === '--top') options.top = Number(args[++i]);
    else if (arg === '--model') options.model = args[++i];
    else if (arg === '--python') options.python = args[++i];
    else if (arg === '--offline') options.offline = true;
    else if (arg === '--exact') options.exact = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else options.targets.push(arg);
  }
  return options;
}

function runScorer(items, options) {
  const args = [scorerPath];
  if (options.model) args.push('--model', options.model);
  if (options.offline) args.push('--offline');
  if (!options.candidates.length && !options.exact) args.push('--mask-stride', '4');
  const input = items.map((item) => JSON.stringify(item)).join('\n') + '\n';
  const result = spawnSync(options.python, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    input,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`PhoBERT scorer failed (${result.status ?? 'no exit code'}):\n${detail}`);
  }
  return result.stdout.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

async function fileItems(targets) {
  const files = await expandTargets(targets);
  const items = [];
  for (const file of files) {
    const module = await import(`${pathToFileURL(file).href}?naturalness=${Date.now()}-${Math.random()}`);
    const source = path.relative(repoRoot, file).replace(/\\/g, '/');
    for (const item of collectStrings(module.default, source)) items.push(...splitSentences(item));
  }
  return items;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { console.log(usage()); return; }
  if (options.candidates.length && options.targets.length) throw new Error('Use candidates or files, not both.');

  if (options.candidates.length) {
    if (options.candidates.length < 2) throw new Error('Candidate mode needs at least two alternatives.');
    const scored = runScorer(options.candidates.map((text, index) => ({ index, text })), options)
      .sort((a, b) => b.avg_log_prob - a.avg_log_prob);
    console.log('Vietnamese naturalness ranking (best first):');
    scored.forEach((item, rank) => {
      console.log(`${rank + 1}. ppl=${item.pseudo_perplexity.toFixed(2)}  ${item.text}`);
    });
    return;
  }

  const targets = options.targets.length ? options.targets : ['lessons/content/node*.js', 'lessons/content/island*.js'];
  const items = await fileItems(targets);
  const scored = runScorer(items, options).sort((a, b) => a.avg_log_prob - b.avg_log_prob);
  console.log(`Vietnamese naturalness review: ${items.length} sentence(s) scored; showing worst ${Math.min(options.top, scored.length)}.`);
  for (const item of scored.slice(0, options.top)) {
    console.log(`${item.source} ${item.pointer} ppl=${item.pseudo_perplexity.toFixed(2)}`);
    console.log(`  ${item.text}`);
  }
  console.log('Review hints only: compare nearby alternatives before rewriting or adding a hard rule.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
