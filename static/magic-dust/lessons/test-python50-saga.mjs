import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PYTHON50_NODES,
  PYTHON50_SOURCE_TITLE,
  PYTHON50_SOURCE_URL,
  python50CompletionKey,
} from "./content/python50-curriculum.js";
import { completedPython50Ids, python50Status } from "./python50-state.js";

const here = dirname(fileURLToPath(import.meta.url));
assert.equal(PYTHON50_NODES.length, 14);
assert.deepEqual(PYTHON50_NODES.map(node => node.id), Array.from({ length: 14 }, (_, id) => id));
assert.deepEqual(PYTHON50_NODES.map(node => node.mainRequired), [5,6,7,8,10,10,11,11,15,15,17,18,20,21]);
assert.equal(PYTHON50_SOURCE_TITLE, "Tổng hợp 50 bài tập Python cơ bản - nâng cao");
assert.match(PYTHON50_SOURCE_URL, /^https:\/\/www\.tica\.edu\.vn\//);
assert.ok(PYTHON50_NODES.every(node => node.sourceExercises.length > 0));
assert.ok(PYTHON50_NODES.flatMap(node => node.sourceExercises).every(exerciseId => exerciseId >= 1 && exerciseId <= 50));
assert.deepEqual(PYTHON50_NODES[9].sourceExercises, [10]);
const firstLesson = (await import('./content/python50node00.js')).default;
const firstFix = firstLesson.cells.find(cell => cell.label === 'p50_two_commands_fix.py');
const firstApply = firstLesson.cells.find(cell => cell.label === 'p50_two_commands_input.py');
assert.match(firstFix.code, /if command == 2:[\s\S]*elif command == 1:/, 'chặng 00 phải yêu cầu sửa ánh xạ mã lệnh trước');
assert.match(firstFix.solution, /if command == 1:[\s\S]*elif command == 2:/, 'lời giải chặng 00 phải đưa mã 1 về cộng và mã 2 về trừ');
assert.match(firstApply.code, /elif command == 2:\n    result = first \+ second/, 'bài INPUT phải dùng một lỗi phép toán khác bài sửa điều kiện');
assert.match(firstApply.code, /chỉ nhập 1 hoặc 2/, 'prompt INPUT phải nói rõ miền mã lệnh hợp lệ');
const storage = ids => ({ getItem: key => ids.some(id => key === python50CompletionKey(id)) ? "1" : null });
assert.equal(python50Status(0, 4, completedPython50Ids(storage([]))), "locked");
assert.equal(python50Status(0, 5, completedPython50Ids(storage([]))), "current");
assert.equal(python50Status(1, 8, completedPython50Ids(storage([]))), "locked");
assert.equal(python50Status(1, 8, completedPython50Ids(storage([0]))), "current");

for (const meta of PYTHON50_NODES) {
  assert.ok((await stat(join(here, meta.art))).isFile(), `Thiếu ảnh ${meta.art}`);
  const lesson = (await import(`./content/python50node${String(meta.id).padStart(2, "0")}.js`)).default;
  assert.equal(lesson.kind, "python-challenge-saga");
  assert.equal(lesson.title, meta.title);
  assert.equal(lesson.completionKey, python50CompletionKey(meta.id));
  assert.equal(lesson.returnPage, "./python50.html");
  assert.equal(lesson.reward.track, "python50");
  assert.equal(lesson.reward.xp, 100);
  assert.deepEqual(lesson.source.exerciseIds, meta.sourceExercises);
  assert.match(lesson.subtitle, /chuyển thể từ Bài/);
  const codeCells = lesson.cells.filter(cell => cell.code);
  assert.equal(codeCells.length, 3);
  assert.ok(codeCells.every(cell => cell.expectOut && cell.solution));
  assert.notEqual(codeCells[1].code, codeCells[1].solution, `Chặng ${meta.id}: bài sửa lỗi phải cần học sinh chỉnh code`);
  assert.notEqual(codeCells[2].code, codeCells[2].solution, `Chặng ${meta.id}: bài áp dụng không được chứa sẵn toàn bộ lời giải`);
  lesson.cells.forEach((cell, index) => { if (cell.checkpoint) assert.ok(lesson.cells[index + 1]?.quiz); });
}

const [map, wrapper] = await Promise.all([
  readFile(join(here, "python50-map.js"), "utf8"),
  readFile(join(here, "python50-lesson.html"), "utf8"),
]);
assert.match(map, /python50Status/);
assert.match(map, /14 chặng tuyển chọn/);
assert.match(map, /PYTHON50_SOURCE_URL/);
assert.match(wrapper, /python50CompletionKey\(id - 1\)/);
console.log("✓ Đường Đua Python: 14 chặng tuyển chọn, nguồn, khóa công cụ và XP đều hợp lệ");
