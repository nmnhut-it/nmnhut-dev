import assert from "node:assert/strict";
import project from "./content/junior-camera-project.js";

assert.equal(project.title, "XƯỞNG CAMERA NHÍ");
assert.equal(project.returnPage, "./learning-portal.html");
assert.equal(project.modules.camera_charm, "../py/camera_charm/__init__.py");

const codeCells = project.cells.filter(cell => typeof cell.code === "string");
assert.equal(codeCells.length, 5);
assert.deepEqual(
  codeCells.map(cell => cell.label),
  [
    "01_camera_thay_gi.py",
    "02_chia_doi.py",
    "03_sua_luat_cam_xuc.py",
    "04_nap_nang_luong.py",
    "05_guong_cua_toi.py",
  ],
);

for (const cell of codeCells) {
  assert.match(cell.code, /\bwatch\(\)/, `${cell.label} phải dùng camera thật`);
  assert.match(cell.note, /INPUT thật:/, `${cell.label} phải nói rõ INPUT thật`);
  assert.match(cell.note, /PROCESS:/, `${cell.label} phải nói rõ PROCESS`);
  assert.match(cell.note, /OUTPUT:/, `${cell.label} phải nói rõ OUTPUT`);
  assert.doesNotMatch(cell.code, /\b(?:diem|ngon|ket_qua|cam_xuc)\b/i, `${cell.label} dùng tên biến English ASCII`);
}

assert.equal(codeCells.at(-1).expectOut, null);
assert.match(codeCells.at(-1).note, /blur\(\).*sharpen\(\).*flip_mirror\(\).*rotate_with_hand\(\).*fire_vortex\(\)/s);

console.log("✓ Xưởng Camera Nhí có 5 chặng, camera thật, nhiệm vụ rõ INPUT/PROCESS/OUTPUT");
