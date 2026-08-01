import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  MATH6_NODES,
  math6CompletionKey,
} from "./content/math6-curriculum.js";
import {
  completedMath6Ids,
  isMath6Unlocked,
  math6Status,
} from "./math6-state.js";

const here = dirname(fileURLToPath(import.meta.url));

assert.equal(MATH6_NODES.length, 18, "Saga Toán 6 phải có đúng 18 bài");
assert.deepEqual(
  MATH6_NODES.map(node => node.id),
  Array.from({ length: 18 }, (_, index) => index),
  "ID bài Toán 6 phải liên tục từ 0 đến 17",
);
assert.deepEqual(
  MATH6_NODES.map(node => node.mainRequired),
  [5, 5, 5, 5, 6, 7, 7, 7, 11, 15, 15, 16, 16, 16, 16, 16, 16, 16],
  "Mỗi bài Toán phải chờ đúng công cụ Python ở saga chính",
);

function storageWith(doneIds = []) {
  const values = new Map(doneIds.map(id => [math6CompletionKey(id), "1"]));
  return { getItem: key => values.get(key) ?? null };
}

let completed = completedMath6Ids(storageWith());
assert.equal(math6Status(0, 4, completed), "locked", "Chưa xong Node 04 thì chưa được vào saga Toán");
assert.equal(math6Status(0, 5, completed), "current", "Xong Node 04 thì bài Toán đầu tiên mở");
assert.equal(math6Status(1, 5, completed), "locked", "Không được bỏ qua bài Toán trước");

completed = completedMath6Ids(storageWith([0, 1, 2, 3]));
assert.equal(math6Status(3, 5, completed), "done");
assert.equal(isMath6Unlocked(4, 5, completed), false, "Bài dùng else phải chờ main Node 05");
assert.equal(isMath6Unlocked(4, 6, completed), true);

completed = completedMath6Ids(storageWith(Array.from({ length: 8 }, (_, index) => index)));
assert.equal(isMath6Unlocked(8, 10, completed), false, "Bài ước và bội phải chờ for/range");
assert.equal(isMath6Unlocked(8, 11, completed), true);

for (const meta of MATH6_NODES) {
  assert.ok((await stat(join(here, meta.art))).isFile(), `Thiếu ảnh bản đồ: ${meta.art}`);
  const module = await import(`./content/math6node${String(meta.id).padStart(2, "0")}.js`);
  const lesson = module.default;
  assert.equal(lesson.kind, "math-saga", `Bài ${meta.id} phải thuộc saga Toán`);
  assert.equal(lesson.title, meta.title);
  assert.equal(lesson.mainRequired, meta.mainRequired);
  assert.equal(lesson.completionKey, math6CompletionKey(meta.id));
  assert.equal(lesson.returnPage, "./math6.html");
  assert.equal(lesson.cameraFree, true);
  assert.equal(lesson.sideIslandId, `math6-${String(meta.id).padStart(2, "0")}`);

  const codeCells = lesson.cells.filter(cell => cell.code);
  assert.ok(codeCells.length >= 3, `Bài ${meta.id} cần ít nhất 3 lượt thực hành`);
  for (const cell of codeCells) {
    assert.ok(cell.expectOut, `${cell.label} phải nêu OUTPUT kiểm chứng`);
    assert.ok(cell.solution, `${cell.label} phải có nghiệm mẫu`);
  }

  lesson.cells.forEach((cell, index) => {
    if (!cell.checkpoint) return;
    assert.ok(lesson.cells[index + 1]?.quiz, `Checkpoint trong bài ${meta.id} phải có quiz ngay sau đó`);
  });
}

const [mapHtml, wrapperHtml, mapJs, sagaJs, islandJs, scaffoldJs] = await Promise.all([
  readFile(join(here, "math6.html"), "utf8"),
  readFile(join(here, "math6-lesson.html"), "utf8"),
  readFile(join(here, "math6-map.js"), "utf8"),
  readFile(join(here, "saga.js"), "utf8"),
  readFile(join(here, "island.js"), "utf8"),
  readFile(join(here, "engine", "dom-scaffold.js"), "utf8"),
]);

assert.match(mapHtml, /math6-map\.js/);
assert.match(wrapperHtml, /meta\.mainRequired/);
assert.match(wrapperHtml, /math6CompletionKey\(id - 1\)/);
assert.match(mapJs, /math6Status/);
assert.match(sagaJs, /id="mathportal"/);
assert.match(sagaJs, /done >= 5/);
assert.match(islandJs, /N\.completionKey/);
assert.match(islandJs, /N\.returnPage/);
assert.match(scaffoldJs, /N\.returnPage/);

console.log("✓ Saga Toán 6: 18 bài, khóa tiến độ, cấu trúc bài và đường về bản đồ đều hợp lệ");
