import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
const cellValidation = { exports: {} };
const validationSource = await (await import("node:fs/promises")).readFile(new URL("./cell-validation.js", import.meta.url), "utf8");
new Function("module", "exports", validationSource)(cellValidation, cellValidation.exports);
const { cellOutputSatisfies } = cellValidation.exports;

const contentDir = fileURLToPath(new URL("./content/", import.meta.url));
const files = (await readdir(contentDir))
  .filter(name => /^(python-kidsnode\d+|islandPYKIDS.*)\.js$/.test(name));
const cells = [];
for (const file of files) {
  const lesson = (await import(pathToFileURL(join(contentDir, file)).href)).default;
  for (const cell of lesson.cells ?? []) if (cell.code && cell.expectOut != null) cells.push({ file, label: cell.label, expectOut: cell.expectOut });
}

// Every authored contract must reject a completely unrelated answer.
for (const cell of cells) {
  assert.equal(
    cellOutputSatisfies(cell.expectOut, [{ kind: "terminal", text: "WRONG ANSWER: 9999" }], 5),
    false,
    `${cell.file} :: ${cell.label} accepts an unrelated answer`,
  );
}

// Substring contracts must not be used for deterministic single-output cells:
// otherwise a wrong line can be appended while the answer still passes.
const weak = cells.filter(({ expectOut }) => expectOut instanceof RegExp && !expectOut.source.startsWith("^") && !expectOut.source.endsWith("$"));
assert.deepEqual(weak.map(cell => `${cell.file}::${cell.label}`).sort(), [
  "python-kidsnode13.js::kids_test_bug.py",
  "python-kidsnode14.js::kids_final_project.py",
  "python-kidsnode14.js::kids_final_project_example.py",
].sort(), "Unexpected weak grading contracts; review before shipping.");

console.log(`python-kids grading negatives: ${cells.length} contracts reject unrelated output; ${weak.length} intentionally flagged for strict-contract review`);
