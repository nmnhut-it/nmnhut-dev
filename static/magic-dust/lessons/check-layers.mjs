// node lessons/check-layers.mjs — dev-time layer-boundary lint (Framework
// Plan Step 4). Statically greps `import ... from '...'` specifiers (regex,
// not a real parser — this is a lightweight lint like validate-content.mjs,
// not a build tool) and enforces:
//   ENGINE  (lessons/engine/<ENGINE_FILES>)  — may not import ../content/
//                                              or platform files (../node.js,
//                                              ../saga.js, or any PLATFORM
//                                              file in lessons/engine/)
//   CONTENT (lessons/content/node*.js, excluding TEMPLATE.js — same glob as
//            validate-content.mjs)            — may not import ANYTHING
// See engine/ARCHITECTURE.md's "Layer map" section for the full contract,
// including why lessons/engine/ physically holds both ENGINE and PLATFORM
// files (a pre-existing directory-naming wrinkle, not fixed here).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_DIR = path.join(__dirname, 'engine');
const CONTENT_DIR = path.join(__dirname, 'content');

// Files under lessons/engine/ that ARE the Dust Engine proper (camera,
// gesture verbs, Pyodide bridge, low-level constants/validation). Everything
// else in that directory is PLATFORM (notebook/boss/quiz/gift/ritual/dev
// harness) that happens to live in the same folder — see ARCHITECTURE.md.
const ENGINE_FILES = new Set([
  'camera-engine.js', 'gesture-dispatcher.js', 'gesture-math.js', 'gesture-registry.js',
  'two-phase-gate.js', 'constants.js', 'gesture-ui.js', 'py-bridge.js', 'casting.js',
  'ritual-theme.js', 'chant-match.js', 'voice-gate.js', 'stage-player.js',
  'inventory.js',    // THỢ RÈN badge/bomb store — pure logic over a storage shim, imports only constants.js
  'prose.js',        // pure prose→HTML renderer (escaping/inline-code/fenced-block) — no DOM/camera deps
]);

// ── GRANDFATHERED ALLOWLIST ──
// Entries: {file, specifier} — a real violation as of 2026-07-03, found by
// this script's first run, deliberately NOT refactored here (Step 4/5 is
// docs+tooling only, no runtime restructure — see FRAMEWORK-PLAN.md's "Hard
// constraints"). Reported in the Step 4/5 delivery summary.
const ALLOWLIST = [
  // (none found as of 2026-07-03 — the real ENGINE_FILES only import each
  // other, and every lessons/content/node*.js file has zero imports)
];
function isAllowlisted(file, specifier) {
  return ALLOWLIST.some(a => a.file === file && a.specifier === specifier);
}

// findImports(src) → [{line, specifier}] — matches `import ... from '...'`
// and `import '...'` (side-effect-only) on a single line each, which is how
// every real file in this repo writes them (dense-single-line style).
function findImports(src) {
  const out = [];
  const lines = src.split('\n');
  const re = /\bimport\b[^;\n]*?\bfrom\s+['"]([^'"]+)['"]|\bimport\s+['"]([^'"]+)['"]/g;
  lines.forEach((line, i) => {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line))) out.push({ line: i + 1, specifier: m[1] || m[2] });
  });
  return out;
}

function main() {
  const violations = [];

  // ── ENGINE files: no ../content/, no platform files ──
  const engineFiles = fs.readdirSync(ENGINE_DIR).filter(f => f.endsWith('.js') && ENGINE_FILES.has(f));
  for (const f of engineFiles) {
    const full = path.join(ENGINE_DIR, f);
    const rel = path.relative(process.cwd(), full);
    const src = fs.readFileSync(full, 'utf8');
    for (const { line, specifier } of findImports(src)) {
      const bad = specifier.includes('../content/') || specifier === '../node.js' || specifier === '../saga.js' ||
        (specifier.startsWith('./') && !ENGINE_FILES.has(path.basename(specifier)) && path.dirname(specifier) === '.');
      if (!bad) continue;
      if (isAllowlisted(f, specifier)) continue;
      violations.push(`${rel}:${line} — ENGINE file imports "${specifier}" (engine may only import other ENGINE files; not content, not platform)`);
    }
  }

  // ── CONTENT files: no imports at all (same glob as validate-content.mjs: node*.js, excludes TEMPLATE.js) ──
  const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => /^(node|island).*\.js$/.test(f)).sort();
  for (const f of contentFiles) {
    const full = path.join(CONTENT_DIR, f);
    const rel = path.relative(process.cwd(), full);
    const src = fs.readFileSync(full, 'utf8');
    for (const { line, specifier } of findImports(src)) {
      if (isAllowlisted(f, specifier)) continue;
      violations.push(`${rel}:${line} — CONTENT file has an import ("${specifier}") — content must be pure data, zero imports`);
    }
  }

  if (violations.length) {
    console.log(`✖ ${violations.length} layer violation(s):`);
    violations.forEach(v => console.log(`  ${v}`));
    process.exit(1);
  }
  console.log(`✓ layers clean — ${engineFiles.length} engine file(s), ${contentFiles.length} content file(s) checked, ${ALLOWLIST.length} allowlisted`);
}
main();
