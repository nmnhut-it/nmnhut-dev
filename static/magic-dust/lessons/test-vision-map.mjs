import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  VISION_BATCHES,
  VISION_NODES,
  VISION_LOCATION_ART,
  VISION_PINHOLE_LAB_ART,
  visionCompletionKey,
  visionReward,
} from "./content/vision-curriculum.js";
import { visionStatus } from "./vision-state.js";
import node00 from "./content/visionnode00.js";
const visionLessons = await Promise.all(VISION_NODES.map(async node => {
  const path = `./content/visionnode${String(node.id).padStart(2, "0")}.js`;
  return (await import(path)).default;
}));

const here = dirname(fileURLToPath(import.meta.url));
assert.equal(VISION_NODES.length, 14);
assert.equal(VISION_BATCHES.length, 4);
assert.deepEqual(VISION_BATCHES.flatMap(batch => batch.nodeIds), VISION_NODES.map(node => node.id));
assert.ok(VISION_NODES.some(node => /SAD\/SSD/.test(node.title)));
assert.ok(VISION_NODES.some(node => /OpenCV/.test(node.title)));
assert.ok(VISION_NODES.every(node => node.mainRequired >= 5));
assert.deepEqual(VISION_NODES.filter(node => node.ready).map(node => node.id), VISION_NODES.map(node => node.id));
assert.equal(VISION_NODES[0].art, VISION_PINHOLE_LAB_ART);
assert.equal(VISION_LOCATION_ART.length, 14);
assert.deepEqual(VISION_NODES.map(node => node.art), VISION_LOCATION_ART);
assert.equal(visionStatus(VISION_NODES[0], 5, new Set()), "current");
assert.equal(visionStatus(VISION_NODES[0], 4, new Set()), "locked");
assert.equal(visionStatus(VISION_NODES[0], 5, new Set([0])), "done");
assert.equal(visionStatus(VISION_NODES[1], 99, new Set()), "locked");
assert.equal(visionStatus(VISION_NODES[1], 99, new Set([0])), "current");
assert.equal(visionReward(VISION_NODES[0]).completionKey, visionCompletionKey(0));
assert.equal(node00.kind, "vision-saga");
assert.equal(node00.cameraFree, true);
assert.ok(node00.cells.some(cell => cell.widget === "pinhole"));
assert.ok(node00.cells.filter(cell => cell.code).every(cell => cell.expectOut && cell.solution));
assert.equal(node00.cells.filter(cell => cell.code).length, 1);
assert.equal(node00.cells.find(cell => cell.code).label, "vision_pinhole_design_project.py");
assert.doesNotMatch(JSON.stringify(node00.cells), /\b(?:INPUT|PROCESS|OUTPUT)\b/);
for (const [id, lesson] of visionLessons.entries()) {
  assert.equal(lesson.kind, "vision-saga");
  assert.equal(lesson.cameraFree, true);
  const codeCells = lesson.cells.filter(cell => cell.code);
  assert.equal(codeCells.length, id === 13 ? 3 : 1);
  assert.ok(codeCells.every(cell => cell.solution));
  assert.ok(codeCells.every(cell => cell.expectOut));
  assert.doesNotMatch(JSON.stringify(lesson.cells), /\b(?:INPUT|PROCESS|OUTPUT)\b/);
  if (id > 0) {
    const deck = lesson.cells.find(cell => cell.widget === "vision-lab")?.deck;
    assert.equal(deck?.length, 3);
    assert.ok(deck.every(slide => slide.tab && slide.title && slide.lead && slide.visual));
    assert.equal(lesson.cells.find(cell => cell.quiz)?.quiz.questions.length >= 2, true);
  }
}
assert.deepEqual(visionLessons[10].pythonPackages, ["opencv-python"]);

const [portal, map, page] = await Promise.all([
  readFile(join(here, "learning-portal.js"), "utf8"),
  readFile(join(here, "vision-map.js"), "utf8"),
  readFile(join(here, "vision.html"), "utf8"),
]);
await Promise.all(VISION_LOCATION_ART.map(path => readFile(join(here, path))));
assert.match(portal, /href: "\.\/vision\.html"/);
assert.match(map, /VISION_NODES\.map\(renderNode\)/);
assert.match(map, /vision-location/);
assert.match(page, /vision-map\.js/);
console.log("✓ Saga Mắt Máy: Node 00, reward, landmark art và bản đồ 14 node đã được nối");
