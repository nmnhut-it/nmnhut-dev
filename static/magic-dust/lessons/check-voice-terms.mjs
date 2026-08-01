import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const dictionaryPath = path.join(scriptDir, 'voice-avoid-terms.json');
const skipDirs = new Set(['.git', 'node_modules', '.venv', '__pycache__']);

function usage() {
  return `Usage: node lessons/check-voice-terms.mjs [--strict] [file|dir|glob ...]

Default globs come from lessons/voice-avoid-terms.json.
The checker exits 1 for severity=error matches. With --strict, warnings also fail.`;
}

function normalizeForDisplay(file) {
  return path.relative(repoRoot, file).replace(/\\/g, '/');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasGlob(value) {
  return /[*?]/.test(value);
}

function globToRegExp(pattern) {
  const normalized = pattern.replace(/\\/g, '/');
  let out = '^';
  for (let i = 0; i < normalized.length; i += 1) {
    const ch = normalized[i];
    if (ch === '*') {
      if (normalized[i + 1] === '*') {
        out += '.*';
        i += 1;
      } else {
        out += '[^/]*';
      }
    } else if (ch === '?') {
      out += '[^/]';
    } else {
      out += escapeRegex(ch);
    }
  }
  return new RegExp(`${out}$`, 'u');
}

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function expandPlainTarget(rawTarget, baseDir) {
  const fullPath = path.resolve(baseDir, rawTarget);
  let stat;
  try {
    stat = await fs.stat(fullPath);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  if (stat.isDirectory()) return walk(fullPath);
  if (stat.isFile()) return [fullPath];
  return [];
}

async function expandGlobTarget(rawTarget, baseDir) {
  const absolutePattern = path.resolve(baseDir, rawTarget);
  const normalizedPattern = absolutePattern.replace(/\\/g, '/');
  const segments = normalizedPattern.split('/');
  const firstGlobIndex = segments.findIndex(hasGlob);
  const baseSegments = firstGlobIndex >= 0 ? segments.slice(0, firstGlobIndex) : segments;
  const scanBase = baseSegments.join('/') || path.parse(absolutePattern).root;
  const relativePattern = path.relative(scanBase, absolutePattern).replace(/\\/g, '/');
  const matcher = globToRegExp(relativePattern);
  const candidates = await walk(scanBase);
  return candidates.filter((file) => matcher.test(path.relative(scanBase, file).replace(/\\/g, '/')));
}

async function expandTargets(targets, baseDir) {
  const files = new Set();
  for (const target of targets) {
    const expanded = hasGlob(target)
      ? await expandGlobTarget(target, baseDir)
      : await expandPlainTarget(target, baseDir);
    for (const file of expanded) {
      if (path.extname(file) === '.js') files.add(path.resolve(file));
    }
  }
  return [...files].sort((a, b) => normalizeForDisplay(a).localeCompare(normalizeForDisplay(b)));
}

function compileTerm(entry) {
  const flags = entry.flags ?? (entry.caseSensitive ? 'gu' : 'giu');
  const source = entry.pattern ?? escapeRegex(entry.term);
  return new RegExp(source, flags.includes('g') ? flags : `${flags}g`);
}

function findMatches(text, file, compiledTerms) {
  const matches = [];
  const lines = text.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (const item of compiledTerms) {
      item.regex.lastIndex = 0;
      let match;
      while ((match = item.regex.exec(line)) !== null) {
        matches.push({
          file,
          line: lineIndex + 1,
          col: match.index + 1,
          match: match[0],
          entry: item.entry,
          snippet: line.trim()
        });
        if (match[0].length === 0) item.regex.lastIndex += 1;
      }
    }
  }
  return matches;
}

function printMatches(matches) {
  for (const hit of matches) {
    const level = hit.entry.severity.toUpperCase();
    const label = hit.entry.term ?? hit.entry.id;
    console.log(`${normalizeForDisplay(hit.file)}:${hit.line}:${hit.col} ${level} ${JSON.stringify(hit.match)} (${label})`);
    console.log(`  suggestion: ${hit.entry.suggestion}`);
    console.log(`  reason: ${hit.entry.reason}`);
    console.log(`  text: ${hit.snippet}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }
  const strict = args.includes('--strict');
  const targetsFromArgs = args.filter((arg) => arg !== '--strict');

  const dictionary = JSON.parse(await fs.readFile(dictionaryPath, 'utf8'));
  const targets = targetsFromArgs.length > 0 ? targetsFromArgs : dictionary.scanDefaults;
  const baseDir = targetsFromArgs.length > 0 ? process.cwd() : repoRoot;
  const files = await expandTargets(targets, baseDir);
  const compiledTerms = dictionary.terms.map((entry) => ({
    entry,
    regex: compileTerm(entry)
  }));

  const allMatches = [];
  for (const file of files) {
    const text = await fs.readFile(file, 'utf8');
    allMatches.push(...findMatches(text, file, compiledTerms));
  }

  if (allMatches.length === 0) {
    console.log(`voice terms: ok (${files.length} files scanned)`);
    return;
  }

  printMatches(allMatches);
  const errorCount = allMatches.filter((hit) => hit.entry.severity === 'error').length;
  const warnCount = allMatches.length - errorCount;
  console.log(`voice terms: ${errorCount} error(s), ${warnCount} warning(s), ${files.length} files scanned`);
  if (errorCount > 0 || (strict && warnCount > 0)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
