import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DSA_CHAPTERS,
  DSA_ISLANDS,
  DSA_MAIN_REQUIRED,
  DSA_NODES,
  DSA_TOWERS,
  dsaIslandCompletionKey,
  dsaNodeCompletionKey,
  dsaTowerCompletionKey,
} from "./content/dsa-curriculum.js";
import {
  completedDsaIslandIds,
  completedDsaNodeIds,
  completedDsaTowerIds,
  dsaNodeStatus,
  dsaSupportStatus,
} from "./dsa-state.js";

const here = dirname(fileURLToPath(import.meta.url));
assert.equal(DSA_MAIN_REQUIRED, 21);
assert.equal(DSA_CHAPTERS.length, 5);
assert.equal(DSA_NODES.length, 24);
assert.equal(DSA_ISLANDS.length, 10);
assert.equal(DSA_TOWERS.length, 5);
assert.deepEqual(DSA_NODES.map(node => node.id), Array.from({ length: 24 }, (_, id) => id));
assert.equal(new Set(DSA_ISLANDS.map(item => item.id)).size, DSA_ISLANDS.length);
assert.equal(new Set(DSA_TOWERS.map(item => item.id)).size, DSA_TOWERS.length);
assert.ok([...DSA_ISLANDS, ...DSA_TOWERS].every(item => item.unlockAfter >= 0 && item.unlockAfter < DSA_NODES.length));
assert.ok(DSA_NODES.every(node => !Object.hasOwn(node, "art")), "Bản đồ DSA giai đoạn đầu không phụ thuộc asset hình");

function storageWith(entries = []) {
  const values = new Map(entries);
  return { getItem: key => values.get(key) ?? null };
}

let storage = storageWith();
let doneNodes = completedDsaNodeIds(storage);
assert.equal(dsaNodeStatus(0, 20, doneNodes), "locked");
assert.equal(dsaNodeStatus(0, 21, doneNodes), "current");
assert.equal(dsaNodeStatus(1, 21, doneNodes), "locked");

storage = storageWith([[dsaNodeCompletionKey(0), "1"], [dsaNodeCompletionKey(1), "1"], [dsaNodeCompletionKey(2), "1"]]);
doneNodes = completedDsaNodeIds(storage);
assert.equal(dsaNodeStatus(0, 21, doneNodes), "done");
assert.equal(dsaNodeStatus(3, 21, doneNodes), "current");
assert.equal(dsaSupportStatus(DSA_ISLANDS[0], 21, doneNodes, completedDsaIslandIds(storage)), "current");
assert.equal(dsaSupportStatus(DSA_ISLANDS[1], 21, doneNodes, completedDsaIslandIds(storage)), "locked");

storage = storageWith([[dsaNodeCompletionKey(3), "1"], [dsaIslandCompletionKey("edge-cases"), "1"], [dsaTowerCompletionKey("reasoning"), "1"]]);
doneNodes = completedDsaNodeIds(storage);
assert.equal(dsaSupportStatus(DSA_ISLANDS[0], 21, doneNodes, completedDsaIslandIds(storage)), "done");
assert.equal(dsaSupportStatus(DSA_TOWERS[0], 21, doneNodes, completedDsaTowerIds(storage)), "done");

function assertLessonShape(lesson, type, meta, codeMinimum) {
  assert.equal(lesson.kind, type === "node" ? "dsa-saga" : type === "island" ? "dsa-island" : "dsa-tower");
  assert.equal(lesson.title, meta.title);
  assert.equal(lesson.returnPage, "./dsa.html");
  assert.equal(lesson.cameraFree, true);
  assert.equal(lesson.reward.track, "dsa");
  const codeCells = lesson.cells.filter(cell => cell.code);
  assert.ok(codeCells.length >= codeMinimum, `${type} ${meta.id} cần ít nhất ${codeMinimum} bài code`);
  for (const cell of codeCells) {
    assert.ok(cell.expectOut, `${cell.label} phải có OUTPUT kiểm chứng`);
    assert.ok(cell.solution, `${cell.label} phải có solution`);
  }
  lesson.cells.forEach((cell, index) => {
    if (cell.checkpoint) assert.ok(lesson.cells[index + 1]?.quiz, `Checkpoint của ${meta.id} phải có quiz ngay sau`);
  });
}

for (const meta of DSA_NODES) {
  const filename = `content/dsanode${String(meta.id).padStart(2, "0")}.js`;
  assert.ok((await stat(join(here, filename))).isFile());
  const lesson = (await import(`./${filename}`)).default;
  assert.equal(lesson.completionKey, dsaNodeCompletionKey(meta.id));
  assertLessonShape(lesson, "node", meta, 3);
}

for (const meta of DSA_ISLANDS) {
  const filename = `content/dsaisland${meta.module}.js`;
  assert.ok((await stat(join(here, filename))).isFile());
  const lesson = (await import(`./${filename}`)).default;
  assert.equal(lesson.completionKey, dsaIslandCompletionKey(meta.id));
  assertLessonShape(lesson, "island", meta, 4);
}

for (const meta of DSA_TOWERS) {
  const filename = `content/dsatower${meta.module}.js`;
  assert.ok((await stat(join(here, filename))).isFile());
  const lesson = (await import(`./${filename}`)).default;
  assert.equal(lesson.completionKey, dsaTowerCompletionKey(meta.id));
  assertLessonShape(lesson, "tower", meta, 8);
  assert.ok(lesson.cells.length >= 12, `Tháp ${meta.id} cần đủ nhịp 10 tầng và phần dẫn`);
}

const [mapHtml, mapJs, mapCss, wrapper] = await Promise.all([
  readFile(join(here, "dsa.html"), "utf8"),
  readFile(join(here, "dsa-map.js"), "utf8"),
  readFile(join(here, "dsa.css"), "utf8"),
  readFile(join(here, "dsa-lesson.html"), "utf8"),
]);
assert.match(mapHtml, /dsa-map\.js/);
assert.doesNotMatch(mapHtml + mapJs, /<img\b/i, "Bản đồ DSA chưa dùng hình ảnh");
assert.doesNotMatch(mapCss, /#[0-9a-f]{3,8}\b|rgba?\s*\(/i, "CSS DSA phải dùng palette variables");
assert.match(mapJs, /DSA_ISLANDS/);
assert.match(mapJs, /DSA_TOWERS/);
assert.match(wrapper, /dsaNodeCompletionKey/);
assert.match(wrapper, /dsaisland\$\{meta\.module\}/);
assert.match(wrapper, /dsatower\$\{meta\.module\}/);

console.log("✓ Saga DSA: 24 node, 10 đảo, 5 tháp, tiến độ riêng và bản đồ không cần hình ảnh");
