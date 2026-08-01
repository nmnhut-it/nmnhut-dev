// Runs every authored reference solution against the same expectOut matcher used
// by lesson code cells. Camera/keyboard I/O is supplied by a deterministic fake
// bridge so this stays runnable from Node without Pyodide or a browser.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const lessonsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(lessonsDir);
const contentDir = path.join(lessonsDir, 'content');

function loadCjs(filename) {
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(filename, 'utf8'))(mod, mod.exports);
  return mod.exports;
}

const { cellOutputSatisfies } = loadCjs(path.join(lessonsDir, 'cell-validation.js'));

const pythonHarness = String.raw`
import json
import sys
import types
import builtins

MARKER = "__MAGIC_DUST_EVENT__"
REAL_PRINT = print
held_count = int(sys.argv[1])
keyboard_inputs = json.loads(sys.argv[2])
finger_inputs = json.loads(sys.argv[3])

class Bridge:
    def __init__(self):
        self.gesture_reads = 0
        self.keyboard_reads = 0
        self.finger_reads = 0
        self.voice_reads = 0

    def tell(self, kind, text):
        REAL_PRINT(MARKER + json.dumps({"kind": str(kind), "text": str(text)}, ensure_ascii=True))

    def ask(self, kind, prompt=""):
        if kind == "fingers":
            value = finger_inputs[min(self.finger_reads, len(finger_inputs) - 1)]
            self.finger_reads += 1
            return str(value)
        if kind == "gesture":
            sequence = [5, 1, 2]
            value = sequence[min(self.gesture_reads, len(sequence) - 1)]
            self.gesture_reads += 1
            return str(value)
        if kind == "keyboard":
            value = keyboard_inputs[min(self.keyboard_reads, len(keyboard_inputs) - 1)]
            self.keyboard_reads += 1
            return str(value)
        if kind == "grid":
            return "5"
        if kind == "studio_start":
            self.tell(kind, prompt)
            try:
                action = json.loads(prompt).get("action", "")
            except (TypeError, ValueError):
                action = ""
            if action in ("image_sample_grid", "image_pick_grid"):
                grid = []
                for row in range(16):
                    line = []
                    for col in range(16):
                        line.append([240, 220, 160] if 4 <= row <= 11 and 4 <= col <= 11 else [12, 16, 28])
                    grid.append(line)
                return json.dumps(grid)
            if action == "voice_listen":
                # Headless, the mirror walks DOWN the offered list: first call
                # hears the first spell, next call the next, and it settles on
                # the last one. A fixed answer would spin a while-True loop
                # forever, since the loop only ends when it hears its stop word
                # — so a listening loop is only testable if this advances.
                spoken = json.loads(prompt).get("words", [])
                if not spoken:
                    return ""
                heard = spoken[min(self.voice_reads, len(spoken) - 1)]
                self.voice_reads += 1
                return str(heard)
            if action == "human_mask":
                # a person-shaped blob in the middle, so a loop over it is real
                side = max(8, min(24, int(json.loads(prompt).get("size", 16))))
                return json.dumps([[1 if side*0.25 <= c <= side*0.75 and r >= side*0.2 else 0
                                    for c in range(side)] for r in range(side)])
            if action == "image_plate_grid":
                # Deliberately left-right asymmetric so a flip is a real change,
                # and sized from the request so resolution cells read honestly.
                request = json.loads(prompt)
                name = request.get("name", "stag")
                side = max(8, min(24, int(request.get("size", 16))))
                dark = [8, 10, 18] if name != "scene" else [40, 52, 70]
                # The base's bright band and an effect layer's bright band must
                # NOT sit on the same columns: when they overlapped, every sum a
                # blend cell produced was either dark+dark or saturated+saturated,
                # so clamping bugs had nowhere to show and the stub silently
                # passed cells that only differ on partially-overflowing pixels.
                shift = 0.0 if name == "scene" else 0.3
                grid = []
                for row in range(side):
                    line = []
                    for col in range(side):
                        glow = side * (0.55 - shift) <= col <= side * (0.85 - shift) and side * 0.2 <= row <= side * 0.8
                        line.append([200, 225, 255] if glow else dark)
                    grid.append(line)
                return json.dumps(grid)
            return {
                "studio_start": "ready",
                "photo_upload": "uploaded",
                "photo_start": "started",
                "delay": "waited",
                "photo_lights": "drawn",
                "photo_light": "drawn",
                "frame_compare": "closed",
                "effect_play": "played",
                "human_layers": "played",
            }.get(action, "ready")
        if kind == "hand_position":
            self.tell(kind, prompt)
            return json.dumps({"visible": True, "x": 50, "y": 50})
        if kind in ("image_frame", "particle_frame"):
            self.tell(kind, prompt)
            return "drawn"
        return "5"

js = types.ModuleType("js")
js.bridge = Bridge()
sys.modules["js"] = js
builtins.input = lambda prompt="": js.bridge.ask("keyboard", prompt)
builtins.print = lambda *values, sep=" ", end="\n", **kwargs: js.bridge.tell("terminal", sep.join(str(value) for value in values))

exec(sys.stdin.read(), {})
`;

function heldCounts(expectOut) {
  if (!expectOut || expectOut instanceof RegExp || Array.isArray(expectOut) || typeof expectOut !== 'object') return [5];
  if (Array.isArray(expectOut.all) || typeof expectOut.minLines === 'number') return [5];
  const keys = Object.keys(expectOut).filter(key => /^\d+$/.test(key)).map(Number);
  return keys.length ? keys : [5];
}

const gestureFixtures = {
  'node03.js::watch_strike.py': [2],
  'node03.js::mat_ngu_ket_lieu.py': [5],
  'node03v2.js::xuong_phep_bang_tay.py': [4],
  'node03v2.js::mat_ngu_ket_lieu.py': [5],
  'node04.js::real_rule.py': [1],
  'node04.js::elif_crack.py': [3],
  'node04.js::mat_ngu_ket_lieu.py': [1, 2, 3, 4, 5],
  'node04v2.js::real_rule.py': [1],
  'node04v2.js::cracked_rule.py': [1],
  'node05.js::final_choice.py': [1, 1, 1],
  'node05v2.js::calc_with_given_op.py': [4, 4],
  'node06.js::big_gate.py': [3, 3],
  'node06.js::cursed_gate.py': [3, 3],
  'node06.js::golem_curse.py': [2],
  'node06.js::shuffled_meter.py': [1],
  'node06.js::final_weigh.py': [4, 4, 4],
  'node06v2.js::big_gate.py': [3, 3],
  'node06v2.js::cursed_gate.py': [3, 3],
  'node07.js::final_charge.py': [4, 4, 4],
};

function asInputs(value, fallback) {
  if (Array.isArray(value) && value.length) return value.map(String);
  if (value != null && value !== '') return [String(value)];
  return fallback.map(String);
}

function collectCases(value, source, trail = []) {
  if (!value || typeof value !== 'object') return [];
  const found = [];
  if (typeof value.solution === 'string' && value.expectOut != null) {
    const label = value.label || value.name || trail.join('.') || '(unlabelled)';
    for (const heldCount of heldCounts(value.expectOut)) {
      const key = `${source}::${label}`;
      const keyboardInputs = asInputs(value.sampleInput, ['3']);
      let fingerInputs = asInputs(gestureFixtures[key] ?? value.sampleInput, [heldCount]);
      if (heldCounts(value.expectOut).length > 1) fingerInputs = /\bwhile\b/.test(value.solution) ? [String(heldCount), '5'] : [String(heldCount)];
      fingerInputs = fingerInputs.filter(input => /^\d+$/.test(input));
      if (!fingerInputs.length) fingerInputs = [String(heldCount)];
      found.push({ source, label, heldCount, keyboardInputs, fingerInputs, solution: value.solution, expectOut: value.expectOut });
    }
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === 'solution' || key === 'expectOut') continue;
    found.push(...collectCases(child, source, [...trail, key]));
  }
  return found;
}

function runPython(testCase) {
  return new Promise(resolve => {
    const child = spawn('python', ['-X', 'utf8', '-c', pythonHarness, String(testCase.heldCount), JSON.stringify(testCase.keyboardInputs), JSON.stringify(testCase.fingerInputs)], {
      cwd: repoRoot,
      env: { ...process.env, PYTHONPATH: path.join(repoRoot, 'py'), PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
      windowsHide: true,
    });
    let stdout = '', stderr = '', timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, 3000);
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.stdin.end(testCase.solution);
    child.on('close', code => {
      clearTimeout(timer);
      const captured = [];
      const raw = [];
      for (const line of stdout.replace(/\r/g, '').split('\n').filter(Boolean)) {
        if (!line.startsWith('__MAGIC_DUST_EVENT__')) { raw.push(line); continue; }
        try { captured.push(JSON.parse(line.slice('__MAGIC_DUST_EVENT__'.length))); }
        catch { raw.push(line); }
      }
      for (const text of raw) captured.push({ kind: 'terminal', text });
      resolve({ ...testCase, code, timedOut, captured, stderr: stderr.trim() });
    });
  });
}

async function runPool(items, concurrency) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await runPython(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

const files = (await fsp.readdir(contentDir)).filter(name => name.endsWith('.js')).sort();
const cases = [];
for (const filename of files) {
  const module = await import(pathToFileURL(path.join(contentDir, filename)).href);
  cases.push(...collectCases(module.default, filename));
}

// Starting 32 Python interpreters at once is unreliable on Windows: correct
// solutions spend their whole three-second budget waiting for a process slot.
// Keep enough parallelism for a fast audit without turning machine load into
// false lesson failures.
const concurrency = process.platform === 'win32' ? 4 : 16;
const results = await runPool(cases, concurrency);
const failures = results.filter(result =>
  result.timedOut || result.code !== 0 || !cellOutputSatisfies(result.expectOut, result.captured, result.heldCount));

for (const result of failures) {
  const reason = result.timedOut ? 'timeout' : result.code !== 0 ? `python exit ${result.code}` : 'expectOut mismatch';
  console.error(`FAIL ${result.source} :: ${result.label} [held=${result.heldCount}] — ${reason}`);
  const captured = result.captured.length > 20 ? [...result.captured.slice(0, 20), { kind: 'audit', text: `... ${result.captured.length - 20} more` }] : result.captured;
  console.error(`  captured: ${JSON.stringify(captured)}`);
  if (result.stderr) console.error(`  stderr: ${result.stderr}`);
}

console.log(`${cases.length - failures.length}/${cases.length} solution branches passed across ${files.length} content files`);
if (failures.length) process.exit(1);
