import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { PYTHON_KIDS_NODES, pythonKidsCompletionKey, pythonKidsLessonPage, pythonKidsReward } from "./content/python-kids-curriculum.js";
import node0 from "./content/python-kidsnode00.js";
import node1 from "./content/python-kidsnode01.js";
import node2 from "./content/python-kidsnode02.js";
import node3 from "./content/python-kidsnode03.js";
import node4 from "./content/python-kidsnode04.js";
import node5 from "./content/python-kidsnode05.js";
import node6 from "./content/python-kidsnode06.js";
import node7 from "./content/python-kidsnode07.js";
import node8 from "./content/python-kidsnode08.js";
import node9 from "./content/python-kidsnode09.js";
import node10 from "./content/python-kidsnode10.js";
import node11 from "./content/python-kidsnode11.js";
import node12 from "./content/python-kidsnode12.js";
import node13 from "./content/python-kidsnode13.js";
import node14 from "./content/python-kidsnode14.js";
import pixels from "./content/islandPYKIDPIXELS.js";
import words from "./content/islandPYKIDSWORDS.js";
import robot from "./content/islandPYKIDSROBOT.js";
import functions from "./content/islandPYKIDSFUNCTIONS.js";
import numbers from "./content/islandPYKIDSNUMBERS.js";
import choice from "./content/islandPYKIDSCHOICE.js";
import loops from "./content/islandPYKIDSLOOPS.js";
import tests from "./content/islandPYKIDSTESTS.js";

assert.deepEqual(PYTHON_KIDS_NODES.map(node => node.id), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
assert.equal(pythonKidsCompletionKey(1), "magicdust.pythonKids.node.1");
assert.equal(pythonKidsLessonPage(14), "python-kids-lesson.html?node=14");
assert.ok(PYTHON_KIDS_NODES.every(node => pythonKidsReward(node).collectible.glyph), "every node needs a reward glyph");
assert.deepEqual([node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14].map(node => node.modules.python_kids), [
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
]);
assert.equal(pixels.sideIslandId, "islandPYKIDPIXELS");
assert.deepEqual([words, robot, functions, numbers, choice, loops, tests].map(lesson => lesson.modules.python_kids), [
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
  "../py/python_kids/__init__.py",
]);
for (const lesson of [pixels, words, robot, functions, numbers, choice, loops, tests]) {
  assert.ok(existsSync(new URL(`./${lesson.sideIslandId}.html`, import.meta.url)), `${lesson.title} needs an HTML entry page`);
  assert.equal(lesson.cells.some(cell => cell.code && cell.code !== cell.solution), true, `${lesson.title} needs a repair path`);
}
for (const lesson of [node0, node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14, pixels, words, robot, functions, numbers, choice, loops, tests]) {
  const codeCells = lesson.cells.filter(cell => cell.code);
  assert.ok(codeCells.length >= 2, `${lesson.title} needs a demo and an edit cell`);
  assert.ok(codeCells.every(cell => cell.code !== cell.solution), `${lesson.title} must keep starter and solution distinct`);
  assert.ok(codeCells.every(cell => cell.expectOut), `${lesson.title} code cells need output contracts`);
}
console.log(`python-kids saga: ${PYTHON_KIDS_NODES.length} nodes + 8 practice islands — ok`);
