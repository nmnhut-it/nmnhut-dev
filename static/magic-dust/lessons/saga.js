// Saga map home (lessons/index.html): a tall scrollable WORLD (~220vh) with a
// winding bottom→top trail of storybook lesson islands. Runtime locations are
// budgeted WebPs; CSS owns their locked/current/done states and off-screen art
// lazy-loads (ART-DIRECTION.md). Add a
// node = add a NODES entry + a ROUTE position. Progress = localStorage
// 'magicdust.saga' (# of completed nodes, unlocked in order). Node states:
// done (check, warm lit rim) · current (breathing glow, beacon+START in the
// banner) · locked (island darkened/desaturated; click = shake + toast).
// Mystery/future nodes are veiled in a CSS fog. The lit trail reveals up to
// the current node. Ritual pages will call saga.complete() later (Phase 4);
// until then it's the console dev API: saga.complete() / saga.reset() / saga.set(n).
const KEY = 'magicdust.saga';
const COURSE_V26_MIGRATION_KEY = 'magicdust.saga.course-v26';
const SIDE_SOLVED_FLAG = 'magicdust.sideisland.justSolved';
const SIDE_DISCOVERY_KEY = 'magicdust.sideislands.discovery.v1';
const MAP_ASSET_VERSION = '20260723-webp';
const mapAsset = src => `${src}?v=${MAP_ASSET_VERSION}`;
// Arrival fanfare: node.js sets 'magicdust.sealed' right before sending us
// home — the newly-woken node gets a snap-in frame + flashing START so the
// student steps straight into it. Read-and-clear; survives resize re-renders.
const SEAL_FLAG = 'magicdust.sealed';
const sealedIdx = sessionStorage.getItem(SEAL_FLAG); sessionStorage.removeItem(SEAL_FLAG);
const arriveIdx = sealedIdx === null ? -1 : parseInt(sealedIdx, 10) + 1;
// The previous map ended after node 21. A saved show-all value from that map
// must not mark the newly inserted graphics nodes complete on first load.
if (!localStorage.getItem(COURSE_V26_MIGRATION_KEY)) {
  const saved = parseInt(localStorage.getItem(KEY), 10) || 0;
  if (saved > 22) localStorage.setItem(KEY, '22');
  localStorage.setItem(COURSE_V26_MIGRATION_KEY, '1');
}
const NODES = [
  { title: 'Máy Tính Thực Hiện Lệnh',             art: 'assets/old-computer.webp',   page: 'node00-lesson.html', island: { unlit: 'assets/world/node-islands/node00-machine-anatomy-unlit.png', lit: 'assets/world/node-islands/node00-machine-anatomy-lit.png' } },
  { title: 'Chuỗi Văn Bản',                       art: 'assets/old-computer.webp',   page: 'lesson01v2.html', island: { unlit: 'assets/world/node-islands/node01-words-unlit.png', lit: 'assets/world/node-islands/node01-words-lit.png' } },
  { title: 'Số và Phép Tính',                     art: 'assets/old-computer.webp',   page: 'lesson02v2.html', island: { unlit: 'assets/world/node-islands/node02-numbers-unlit.png', lit: 'assets/world/node-islands/node02-numbers-lit.png' } },
  { title: 'INPUT và OUTPUT',                     art: 'assets/future-machine.webp', page: 'lesson03v2.html', island: { unlit: 'assets/world/node-islands/node03-input-output-unlit.png', lit: 'assets/world/node-islands/node03-input-output-lit.png' } },
  { title: 'Điều Kiện if và elif',                art: 'assets/future-machine.webp', page: 'lesson04v2.html', island: { unlit: 'assets/world/node-islands/node04-rules-unlit.png', lit: 'assets/world/node-islands/node04-rules-lit.png' } },
  { title: 'Nhánh else',                          art: 'assets/future-machine.webp', page: 'lesson05v2.html', island: { unlit: 'assets/world/node-islands/node05-else-choices-unlit.png', lit: 'assets/world/node-islands/node05-else-choices-lit.png' } },
  { title: 'So Sánh và Giá Trị Biên',             art: 'assets/future-machine.webp', page: 'lesson06v2.html', island: { unlit: 'assets/world/node-islands/node06-boundaries-unlit.png', lit: 'assets/world/node-islands/node06-boundaries-lit.png' } },
  { title: 'Vòng Lặp while',                      art: 'assets/future-machine.webp', page: 'lesson07v2.html', island: { unlit: 'assets/world/node-islands/node07-while-loop-unlit.png', lit: 'assets/world/node-islands/node07-while-loop-lit.png' } },
  { title: 'Kiểu Dữ Liệu str, int và bool',       art: 'assets/old-computer.webp',   page: 'lesson08v2.html', island: { unlit: 'assets/world/node-islands/node08-types-unlit.png', lit: 'assets/world/node-islands/node08-types-lit.png' } },
  { title: 'Điều Kiện and, or và not',            art: 'assets/future-machine.webp', page: 'lesson09v2.html', island: { unlit: 'assets/world/node-islands/node09-logic-gates-unlit.png', lit: 'assets/world/node-islands/node09-logic-gates-lit.png' } },
  { title: 'Vòng Lặp for và range()',             art: 'assets/future-machine.webp', page: 'lesson10v2.html', island: { unlit: 'assets/world/node-islands/node10-for-range-unlit.png', lit: 'assets/world/node-islands/node10-for-range-lit.png' } },
  { title: 'Luồng Lệnh và GOTO',                  art: 'assets/old-computer.webp',   page: 'lesson11v2.html', island: { unlit: 'assets/world/node-islands/node11-goto-unlit.png', lit: 'assets/world/node-islands/node11-goto-lit.png' } },
  { title: 'Biến và Ô Nhớ',                       art: 'assets/future-machine.webp', page: 'lesson12v2.html', island: { unlit: 'assets/world/node-islands/node12-memory-unlit.png', lit: 'assets/world/node-islands/node12-memory-lit.png' } },
  { title: 'List và Index',                       art: 'assets/future-machine.webp', page: 'lesson13v2.html', island: { unlit: 'assets/world/node-islands/node13-lists-unlit.png', lit: 'assets/world/node-islands/node13-lists-lit.png' } },
  { title: 'Quét List để Tính và Đếm',            art: 'assets/future-machine.webp', page: 'lesson14v2.html', island: { unlit: 'assets/world/node-islands/node14-scan-patterns-unlit.png', lit: 'assets/world/node-islands/node14-scan-patterns-lit.png' } },
  { title: 'Grid: Hàng và Cột',                   art: 'assets/future-machine.webp', page: 'node15-lesson.html', island: { unlit: 'assets/world/node-islands/node15-grid-memory-unlit.png', lit: 'assets/world/node-islands/node15-grid-memory-lit.png' } },
  { title: 'Tìm Kiếm và Sắp Xếp',                 art: 'assets/future-machine.webp', page: 'node16-lesson.html', island: { unlit: 'assets/world/node-islands/node16-search-sort-unlit.png', lit: 'assets/world/node-islands/node16-search-sort-lit.png' } },
  { title: 'Ký Tự và Cắt Chuỗi',                  art: 'assets/old-computer.webp',   page: 'node17-lesson.html', island: { unlit: 'assets/world/node-islands/node17-string-tools-unlit.png', lit: 'assets/world/node-islands/node17-string-tools-lit.png' } },
  { title: 'Function: Đóng Gói Các Bước',         art: 'assets/future-machine.webp', page: 'node18-lesson.html', island: { unlit: 'assets/world/node-islands/node18-functions-unlit.png', lit: 'assets/world/node-islands/node18-functions-lit.png' } },
  { title: 'return: Trả Kết Quả từ Function',      art: 'assets/future-machine.webp', page: 'node19-lesson.html', island: { unlit: 'assets/world/node-islands/node19-return-unlit.png', lit: 'assets/world/node-islands/node19-return-lit.png' } },
  { title: 'Dictionary: Khóa và Giá Trị',         art: 'assets/future-machine.webp', page: 'node20-lesson.html', island: { unlit: 'assets/world/node-islands/node20-dictionaries-unlit.png', lit: 'assets/world/node-islands/node20-dictionaries-lit.png' } },
  { title: 'Dự Án Dictionary',                    art: 'assets/future-machine.webp', page: 'node21-lesson.html', island: { unlit: 'assets/world/node-islands/node21-data-project-unlit.png', lit: 'assets/world/node-islands/node21-data-project-lit.png' } },
  { title: 'Particle: Vị Trí, Vận Tốc và Tuổi Thọ', art: 'assets/future-machine.webp', page: 'node22-lesson.html', island: { unlit: 'assets/world/node-islands/node22-particle-lab-unlit.png', lit: 'assets/world/node-islands/node22-particle-lab-lit.png' } },
  { title: 'Framebuffer và Lớp Ảnh AR',            art: 'assets/future-machine.webp', page: 'node23-lesson.html', island: { unlit: 'assets/world/node-islands/node23-hand-ar-unlit.png', lit: 'assets/world/node-islands/node23-hand-ar-lit.png' } },
  { title: 'Vòng Lặp INPUT–UPDATE–RENDER',         art: 'assets/future-machine.webp', page: 'node24-lesson.html', island: { unlit: 'assets/world/node-islands/node24-interaction-loop-unlit.png', lit: 'assets/world/node-islands/node24-interaction-loop-lit.png' } },
  { title: 'Dự Án Tương Tác Trực Tiếp',           art: 'assets/future-machine.webp', page: 'node25-lesson.html', island: { unlit: 'assets/world/node-islands/node25-live-studio-unlit.png', lit: 'assets/world/node-islands/node25-live-studio-lit.png' } },
  { title: '? ? ?',                              art: null,                        page: null },
];
const STARS = 90, SPARKS = 14;

const progress = () => Math.max(0, Math.min(NODES.length, parseInt(localStorage.getItem(KEY), 10) || 0));
const set = n => { localStorage.setItem(KEY, n); render(); };
window.saga = { complete: () => set(Math.min(progress() + 1, NODES.length)), reset: () => set(0), set, showAll };

// P1: world skeleton. The map is now a tall scrollable WORLD (WORLD_VH% of
// viewport height) instead of one cramped viewport — a hand-tuned winding
// route through world-space (x%, yw% of the world height), bottom→top:
// node 0 near the bottom, the '???' mystery node + the dark-tower slot at
// the very top. Data, not formula, so P2 can nudge per-island positions to
// match real sprite art without touching layout logic.
const LEGACY_WORLD_VH = 540;
const TOP_EXTENSION_VH = 285;
const WORLD_VH = LEGACY_WORLD_VH + TOP_EXTENSION_VH;
const liftLegacyY = y => (TOP_EXTENSION_VH + y * (LEGACY_WORLD_VH / 100)) / (WORLD_VH / 100);
const LEGACY_ROUTE = [
  { x: 22, y: 96 }, // 0
  { x: 62, y: 91 }, // 1
  { x: 30, y: 86 }, // 2
  { x: 68, y: 81 }, // 3
  { x: 26, y: 76 }, // 4
  { x: 64, y: 71 }, // 5
  { x: 32, y: 66 }, // 6
  { x: 60, y: 61 }, // 7
  { x: 42, y: 56 }, // 8 (node08 Types)
  { x: 24, y: 51 }, // 9 (node09 Logic Gates)
  { x: 56, y: 46 }, // 10 (node10 for / range())
  { x: 74, y: 41 }, // 11 (node11 GOTO / pc)
  { x: 45, y: 36 }, // 12 (node12 Memory Island)
  { x: 18, y: 31 }, // 13 (node13 Lists)
  { x: 52, y: 26 }, // 14 (node14 Scan Patterns)
  { x: 78, y: 21 }, // 15 (node15 Grid)
  { x: 38, y: 16 }, // 16 (node16 Search & Sort)
  { x: 66, y: 11 }, // 17 (node17 String Tools)
  { x: 28, y: 6 },  // 18 (node18 Functions)
];
const ROUTE = [
  ...LEGACY_ROUTE.map(({ x, y }) => ({ x, y: liftLegacyY(y) })),
  { x: 66, y: 34.35 }, // 19 (return values)
  { x: 30, y: 30.16 }, // 20 (dictionaries)
  { x: 72, y: 25.98 }, // 21 (gift data)
  { x: 38, y: 21.80 }, // 22 (pixel graphics)
  { x: 68, y: 17.60 }, // 23 (hand AR)
  { x: 30, y: 13.40 }, // 24 (interaction loop)
  { x: 66, y: 9.20 },  // 25 (final project)
  { x: 42, y: 5.00 },  // 26 (??? mystery)
];
const TOWER_SLOT = { x: 88, y: 5.3 }; // reserved interview-question tower set-piece; visible but not unlocked/clickable yet

// Side islands (bonus, non-linear practice — owner: "sợ ít bài tập quá, làm
// đảo phụ lơ lửng ngoài đường chính"): a SEPARATE list, NOT part of NODES/
// ROUTE's index-positional trail. Each gets its own off-trail (x,y), its own
// unlock condition (main-line `progress()` reaching `unlockAt`), and its own
// completion flag `magicdust.sideisland.<id>` (written by island.js's finish
// card, never touching the main NODES counter — see island.js's header
// comment for why reusing the main ritual/seal path would be unsafe).
const SIDE_ISLANDS = [
  { id: 'islandRETURNLAB', title: 'Xưởng Hàm Trả Kết Quả', page: 'islandRETURNLAB.html', unlockAt: 20, art: 'assets/world/side-islands/island-return-lab-unlit.png', litArt: 'assets/world/side-islands/island-return-lab-lit.png', pos: { x: 96, y: 33 }, mapPos: { x: 98, y: 35.5 } },
  { id: 'islandDICTLOOKUP', title: 'Trạm Tra Cứu Dữ Liệu', page: 'islandDICTLOOKUP-lesson.html', unlockAt: 21, art: 'assets/world/side-islands/island-dict-lookup-unlit.png', litArt: 'assets/world/side-islands/island-dict-lookup-lit.png', pos: { x: 3, y: 28 }, mapPos: { x: 2, y: 25.0 } },
  { id: 'islandGIFTSETUP', title: 'Xưởng Chuẩn Bị Quà Tặng', page: 'islandGIFTSETUP-lesson.html', unlockAt: 22, art: 'assets/world/side-islands/island-gift-setup-unlit.png', litArt: 'assets/world/side-islands/island-gift-setup-lit.png', pos: { x: 96, y: 22 }, mapPos: { x: 98, y: 22.0 } },
  { id: 'islandPARTICLELIFE', title: 'Đảo Vòng Đời Hạt', page: 'islandPARTICLELIFE-lesson.html', unlockAt: 23, art: 'assets/world/side-islands/island-particle-life-unlit.png', litArt: 'assets/world/side-islands/island-particle-life-lit.png', pos: { x: 2, y: 18 }, mapPos: { x: 2, y: 18.0 } },
  { id: 'islandEMITTERLAB', title: 'Xưởng Bộ Phát Hạt', page: 'islandEMITTERLAB-lesson.html', unlockAt: 25, art: 'assets/world/side-islands/island-emitter-lab-unlit.png', litArt: 'assets/world/side-islands/island-emitter-lab-lit.png', pos: { x: 2, y: 11 }, mapPos: { x: 2, y: 11.0 } },
  { id: 'island01', title: 'Đảo Luyện Chữ', page: 'island01.html', unlockAt: 2, branchFrom: 1, art: 'assets/world/side-islands/island-letter-unlit.png', litArt: 'assets/world/side-islands/island-letter-lit.png', pos: { x: 96, y: 80 } },
  { id: 'island02', title: 'Đảo Luyện Số', page: 'island02.html', unlockAt: 3, art: 'assets/world/side-islands/island-number-unlit.png', litArt: 'assets/world/side-islands/island-number-lit.png', pos: { x: 4, y: 72 } },
  { id: 'islandIO', title: 'Đảo Input/Output', page: 'islandIO.html', unlockAt: 2, art: 'assets/world/side-islands/island-io-unlit.png', litArt: 'assets/world/side-islands/island-io-lit.png', pos: { x: 42, y: 92 } },
  { id: 'islandVARHOSP', title: 'Bệnh Viện Tên Biến', page: 'islandVARHOSP.html', unlockAt: 2, art: 'assets/world/side-islands/island-variable-hospital-unlit.png', litArt: 'assets/world/side-islands/island-variable-hospital-lit.png', pos: { x: 94, y: 88 } },
  { id: 'islandSTRINGLAB', title: 'Phòng Thí Nghiệm Chuỗi', page: 'islandSTRINGLAB.html', unlockAt: 2, art: 'assets/world/side-islands/island-string-lab-unlit.png', litArt: 'assets/world/side-islands/island-string-lab-lit.png', pos: { x: 8, y: 89 } },
  { id: 'islandMARKET', title: 'Chợ Bụi Phép', page: 'islandMARKET.html', unlockAt: 3, art: 'assets/world/side-islands/island-market-unlit.png', litArt: 'assets/world/side-islands/island-market-lit.png', pos: { x: 2, y: 84 } },
  { id: 'islandUNITS', title: 'Đảo Đổi Đơn Vị', page: 'islandUNITS.html', unlockAt: 3, art: 'assets/world/side-islands/island-units-unlit.png', litArt: 'assets/world/side-islands/island-units-lit.png', pos: { x: 82, y: 74 } },
  { id: 'islandSCORE', title: 'Đảo Bảng Điểm', page: 'islandSCORE.html', unlockAt: 3, art: 'assets/world/side-islands/island-score-unlit.png', litArt: 'assets/world/side-islands/island-score-lit.png', pos: { x: 48, y: 73 } },
  { id: 'islandEFFECTSTAGE', title: 'Rạp Nối Hiệu Ứng', page: 'islandEFFECTSTAGE.html', unlockAt: 4, art: 'assets/world/side-islands/island-effect-stage-unlit.png', litArt: 'assets/world/side-islands/island-effect-stage-lit.png', pos: { x: 94, y: 67 } },
  { id: 'islandAR', title: 'Đảo Phép Camera', page: 'islandAR.html', unlockAt: 5, art: 'assets/world/side-islands/island-camera-unlit.png', litArt: 'assets/world/side-islands/island-camera-lit.png', pos: { x: 88, y: 45 } },
  { id: 'islandBRANCH', title: 'Đảo Nhánh Rẽ', page: 'islandBRANCH.html', unlockAt: 6, art: 'assets/world/side-islands/island-branch-unlit.png', litArt: 'assets/world/side-islands/island-branch-lit.png', pos: { x: 12, y: 36 } },
  { id: 'islandCOMPARE', title: 'Đảo So Sánh', page: 'islandCOMPARE.html', unlockAt: 7, art: 'assets/world/side-islands/island-compare-unlit.png', litArt: 'assets/world/side-islands/island-compare-lit.png', pos: { x: 85, y: 28 } },
  { id: 'islandWHILE', title: 'Đảo Vòng Lặp', page: 'islandWHILE.html', unlockAt: 8, branchFrom: 7, art: 'assets/world/side-islands/island-while-unlit.png', litArt: 'assets/world/side-islands/island-while-lit.png', pos: { x: 72, y: 15 } },
  { id: 'islandTYPES', title: 'Đảo Kiểu Dữ Liệu', page: 'islandTYPES.html', unlockAt: 9, art: 'assets/world/side-islands/island-types-unlit.png', litArt: 'assets/world/side-islands/island-types-lit.png', pos: { x: 8, y: 14 } },
  { id: 'islandPROJECT1', title: 'Đảo Dự Án I', page: 'islandPROJECT1.html', unlockAt: 9, art: 'assets/world/side-islands/island-project-gate-unlit.png', litArt: 'assets/world/side-islands/island-project-gate-lit.png', pos: { x: 10, y: 10 } },
  { id: 'islandRPS', title: 'Đảo Oẳn Tù Tì', page: 'islandRPS.html', unlockAt: 10, art: 'assets/world/side-islands/island-rps-unlit.png', litArt: 'assets/world/side-islands/island-rps-lit.png', pos: { x: 66, y: 30 } },
  { id: 'islandIFPATTERNS', title: 'Đảo Bài Điều Kiện Hay Gặp', page: 'islandIFPATTERNS.html', unlockAt: 10, art: 'assets/world/side-islands/island-if-patterns-unlit.png', litArt: 'assets/world/side-islands/island-if-patterns-lit.png', pos: { x: 4, y: 55 } },
  { id: 'islandPASSWORD', title: 'Đảo Mật Khẩu', page: 'islandPASSWORD.html', unlockAt: 10, art: 'assets/world/side-islands/island-password-unlit.png', litArt: 'assets/world/side-islands/island-password-lit.png', pos: { x: 40, y: 50 }, mapPos: { x: 72, y: 67.30 } },
  { id: 'islandMODCHECKS', title: 'Đảo Chia Hết', page: 'islandMODCHECKS.html', unlockAt: 10, art: 'assets/world/side-islands/island-mod-checks-unlit.png', litArt: 'assets/world/side-islands/island-mod-checks-lit.png', pos: { x: 4, y: 44 } },
  { id: 'islandGEOMETRY', title: 'Đảo Hình Học Nhỏ', page: 'islandGEOMETRY.html', unlockAt: 10, art: 'assets/world/side-islands/island-geometry-unlit.png', litArt: 'assets/world/side-islands/island-geometry-lit.png', pos: { x: 96, y: 49 } },
  { id: 'islandAR2', title: 'Đảo Phép Camera II', page: 'islandAR2.html', unlockAt: 8, art: 'assets/world/side-islands/island-camera-filters-unlit.png', litArt: 'assets/world/side-islands/island-camera-filters-lit.png', pos: { x: 24, y: 44 } },
  { id: 'islandPATTERN', title: 'Đảo Họa Tiết', page: 'islandPATTERN.html', unlockAt: 11, art: 'assets/world/side-islands/island-pattern-unlit.png', litArt: 'assets/world/side-islands/island-pattern-lit.png', pos: { x: 92, y: 7 } },
  { id: 'islandNESTEDFOR', title: 'Đảo Vòng Lồng', page: 'islandNESTEDFOR.html', unlockAt: 11, art: 'assets/world/side-islands/island-nested-loop-unlit.png', litArt: 'assets/world/side-islands/island-nested-loop-lit.png', pos: { x: 88, y: 14 } },
  { id: 'islandLOOPMATH', title: 'Đảo Cộng Dồn', page: 'islandLOOPMATH.html', unlockAt: 11, art: 'assets/world/side-islands/island-loop-math-unlit.png', litArt: 'assets/world/side-islands/island-loop-math-lit.png', pos: { x: 96, y: 32 } },
  { id: 'islandLISTSUM', title: 'Đảo Cộng Dồn List', page: 'islandLISTSUM.html', unlockAt: 15, branchFrom: 14, storybook: false, art: 'assets/storybook/side-islands/storybook-island-list-drills-lit.webp', pos: { x: 28, y: 22 } },
  { id: 'islandLISTCOUNT', title: 'Đảo Máy Đếm', page: 'islandLISTCOUNT.html', unlockAt: 15, requiresSide: 'islandLISTSUM', branchFromSide: 'islandLISTSUM', storybook: false, art: 'assets/storybook/side-islands/storybook-island-score-lit.webp', pos: { x: 42, y: 18 } },
  { id: 'islandLISTEXTREMES', title: 'Đảo Mốc Cao Thấp', page: 'islandLISTEXTREMES.html', unlockAt: 15, requiresSide: 'islandLISTCOUNT', branchFromSide: 'islandLISTCOUNT', storybook: false, art: 'assets/storybook/side-islands/storybook-island-compare-lit.webp', pos: { x: 15, y: 18 } },
  { id: 'islandLISTREVERSE', title: 'Đảo Thứ Tự Ngược', page: 'islandLISTREVERSE.html', unlockAt: 15, requiresSide: 'islandLISTEXTREMES', branchFromSide: 'islandLISTEXTREMES', storybook: false, art: 'assets/storybook/side-islands/storybook-island-list-tools-lit.webp', pos: { x: 39, y: 9 } },
  { id: 'islandLISTFILTER', title: 'Đảo Chọn Lọc', page: 'islandLISTFILTER.html', unlockAt: 15, requiresSide: 'islandLISTREVERSE', branchFromSide: 'islandLISTREVERSE', storybook: false, art: 'assets/storybook/side-islands/storybook-island-if-patterns-lit.webp', pos: { x: 85, y: -5 } },
  { id: 'islandINPUTLIST', title: 'Đảo Nhập List', page: 'islandINPUTLIST.html', unlockAt: 15, art: 'assets/world/side-islands/island-input-list-unlit.png', litArt: 'assets/world/side-islands/island-input-list-lit.png', pos: { x: 8, y: 29 }, mapPos: { x: 1, y: 52.33 } },
  { id: 'islandPHOTOLIGHTS', title: 'Dự Án Khung Ảnh Ánh Sáng', page: 'islandPHOTOLIGHTS.html', unlockAt: 19, art: 'assets/world/side-islands/island-photo-lights-unlit.png', litArt: 'assets/world/side-islands/island-photo-lights-lit.png', pos: { x: 31, y: 39 }, mapPos: { x: 31, y: 60.00 } },
  { id: 'islandGRIDBASIC', title: 'Đảo Bảng Số', page: 'islandGRIDBASIC.html', unlockAt: 16, art: 'assets/world/side-islands/island-grid-basic-unlit.png', litArt: 'assets/world/side-islands/island-grid-basic-lit.png', pos: { x: 1, y: 3 } },
  { id: 'islandGRIDOPS', title: 'Đảo Phép Toán Bảng', page: 'islandGRIDOPS.html', unlockAt: 16, art: 'assets/world/side-islands/island-grid-ops-unlit.png', litArt: 'assets/world/side-islands/island-grid-ops-lit.png', pos: { x: 34, y: -6 }, mapPos: { x: 3, y: 30.16 } },
  { id: 'islandFINGERTIPS', title: 'Bài Giảng Dấu Chạm', page: 'fingertips-lesson.html', unlockAt: 16, branchFrom: 15, art: 'assets/world/side-islands/island-fingertips-unlit.png', litArt: 'assets/world/side-islands/island-fingertips-lit.png', pos: { x: 52, y: -8 }, mapPos: { x: 60, y: 30.16 } },
  { id: 'islandGRIDQUEST', title: 'Đảo Truy Tìm Lưới', page: 'islandGRIDQUEST.html', unlockAt: 16, art: 'assets/world/side-islands/island-grid-quest-unlit.png', litArt: 'assets/world/side-islands/island-grid-quest-lit.png', pos: { x: 97, y: 23 } },
  { id: 'islandPIXELART', title: 'Đảo Tranh Điểm Ảnh', page: 'islandPIXELART.html', unlockAt: 16, art: 'assets/world/side-islands/island-pixel-art-unlit.png', litArt: 'assets/world/side-islands/island-pixel-art-lit.png', pos: { x: 4, y: 24 } },
  { id: 'islandEDGE', title: 'Đảo Viền Ảnh', page: 'islandEDGE.html', unlockAt: 16, art: 'assets/world/side-islands/island-edge-unlit.png', litArt: 'assets/world/side-islands/island-edge-lit.png', pos: { x: 97, y: -5 }, mapPos: { x: 97, y: 30.16 } },
  { id: 'islandIMAGEOPS', title: 'Đảo Xử Lý Ảnh RGB', page: 'islandIMAGEOPS.html', unlockAt: 16, art: 'assets/world/side-islands/island-image-ops-unlit.png', litArt: 'assets/world/side-islands/island-image-ops-lit.png', pos: { x: 78, y: -9 }, mapPos: { x: 100, y: 24.30 } },
  { id: 'islandLISTTOOLS', title: 'Đảo Dụng Cụ List', page: 'islandLISTTOOLS.html', unlockAt: 18, branchFrom: 17, art: 'assets/world/side-islands/island-list-tools-unlit.png', litArt: 'assets/world/side-islands/island-list-tools-lit.png', pos: { x: 96, y: 17 } },
  { id: 'islandSTRINGCHECKS', title: 'Đảo Soi Chuỗi', page: 'islandSTRINGCHECKS.html', unlockAt: 18, art: 'assets/world/side-islands/island-string-checks-unlit.png', litArt: 'assets/world/side-islands/island-string-checks-lit.png', pos: { x: 58, y: -8 }, mapPos: { x: 44, y: 25.98 } },
  { id: 'branchSTANDARDIO', title: 'Nhánh Python Chuẩn', page: 'branch.html?course=standardio', unlockAt: 9, branchFrom: 8, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-standard-io.webp', storybook: false, pos: { x: 76, y: 76 }, mapPos: { x: 76, y: 76.4 } },
  { id: 'towerSTANDARDIO', title: 'Tháp Nhập Xuất', page: 'tower.html?course=standardio', unlockAt: 9, requiresSide: 'branchSTANDARDIO', branchFromSide: 'branchSTANDARDIO', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-standard-io.webp', storybook: false, pos: { x: 97, y: 69 }, mapPos: { x: 97, y: 68.8 } },
  { id: 'branchOPERATORS', title: 'Nhánh Toán Tử', page: 'branch.html?course=operators', unlockAt: 11, branchFrom: 10, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-operators.webp', storybook: false, pos: { x: 4, y: 66 }, mapPos: { x: 4, y: 65.5 } },
  { id: 'towerOPERATORS', title: 'Tháp Toán Tử', page: 'tower.html?course=operators', unlockAt: 11, requiresSide: 'branchOPERATORS', branchFromSide: 'branchOPERATORS', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-operators.webp', storybook: false, pos: { x: 2, y: 47 }, mapPos: { x: 2, y: 47.0 } },
  { id: 'branchLOOPCONTROL', title: 'Nhánh Điều Khiển Vòng', page: 'branch.html?course=loopcontrol', unlockAt: 11, branchFrom: 10, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-loop-control.webp', storybook: false, pos: { x: 40, y: 63 }, mapPos: { x: 40, y: 62.5 } },
  { id: 'towerLOOPCONTROL', title: 'Tháp Điều Khiển Vòng', page: 'tower.html?course=loopcontrol', unlockAt: 11, requiresSide: 'branchLOOPCONTROL', branchFromSide: 'branchLOOPCONTROL', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-loop-control.webp', storybook: false, pos: { x: 20, y: 42 }, mapPos: { x: 20, y: 42.0 } },
  { id: 'branchCOLLECTIONS', title: 'Nhánh Dụng Cụ Collection', page: 'branch.html?course=collections', unlockAt: 18, branchFrom: 17, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-collections.webp', storybook: false, pos: { x: 70, y: 37 }, mapPos: { x: 70, y: 37.3 } },
  { id: 'towerCOLLECTIONS', title: 'Tháp Collection', page: 'tower.html?course=collections', unlockAt: 18, requiresSide: 'branchCOLLECTIONS', branchFromSide: 'branchCOLLECTIONS', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-collections.webp', storybook: false, pos: { x: 96, y: 41 }, mapPos: { x: 96, y: 41.0 } },
  { id: 'branchDICTIONARIES', title: 'Nhánh Từ Điển Nâng Cao', page: 'branch.html?course=dictionaries', unlockAt: 21, branchFrom: 20, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-dictionaries.webp', storybook: false, pos: { x: 8, y: 34 }, mapPos: { x: 8, y: 33.6 } },
  { id: 'towerDICTIONARIES', title: 'Tháp Từ Điển', page: 'tower.html?course=dictionaries', unlockAt: 21, requiresSide: 'branchDICTIONARIES', branchFromSide: 'branchDICTIONARIES', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-dictionaries.webp', storybook: false, pos: { x: 2, y: 28 }, mapPos: { x: 2, y: 27.8 } },
  { id: 'branchERRORS', title: 'Nhánh Xử Lý Lỗi', page: 'branch.html?course=errors', unlockAt: 21, requiresSide: 'branchLOOPCONTROL', branchFrom: 20, featured: true, gate: false, kind: 'learning-branch', art: 'assets/storybook/branches/branch-errors.webp', storybook: false, pos: { x: 82, y: 36 }, mapPos: { x: 82, y: 36.3 } },
  { id: 'towerERRORS', title: 'Tháp Xử Lý Lỗi', page: 'tower.html?course=errors', unlockAt: 21, requiresSide: 'branchERRORS', branchFromSide: 'branchERRORS', featured: true, gate: false, kind: 'practice-tower', art: 'assets/storybook/towers/tower-errors.webp', storybook: false, pos: { x: 84, y: 28 }, mapPos: { x: 84, y: 27.5 } },
  { id: 'towerINFERNO', title: 'Tháp Luyện Ngục', page: 'tower.html?course=inferno', unlockAt: 11, branchFrom: 10, featured: true, gate: false, kind: 'tower', art: 'assets/storybook/island-dark-v2.webp', storybook: false, pos: { x: 96, y: 36 }, mapPos: { x: 96, y: 59 } },
  { id: 'tower', title: 'Tháp Vô Định', page: 'tower.html', unlockAt: 21, gate: false, kind: 'tower', art: 'assets/storybook/side-islands/storybook-tower-island-lit.webp', storybook: false, pos: { x: 92, y: 56 } },
];
const sideDone = id => localStorage.getItem(`magicdust.sideisland.${id}`) === '1';
function readSideDiscovery() {
  try {
    const raw = JSON.parse(localStorage.getItem(SIDE_DISCOVERY_KEY) || '{}');
    return {
      discovered: Array.isArray(raw.discovered) ? raw.discovered : [],
      gatePassed: Array.isArray(raw.gatePassed) ? raw.gatePassed : [],
    };
  } catch {
    return { discovered: [], gatePassed: [] };
  }
}
function writeSideDiscovery(d) {
  try {
    localStorage.setItem(SIDE_DISCOVERY_KEY, JSON.stringify({
      discovered: [...new Set(d.discovered || [])],
      gatePassed: [...new Set(d.gatePassed || [])],
    }));
  } catch { /* storage may be unavailable */ }
}
function markDiscovered(id) {
  const d = readSideDiscovery();
  if (!d.discovered.includes(id)) { d.discovered.push(id); writeSideDiscovery(d); }
}
function sideGatePassed(id) {
  if (sideDone(id)) return true;
  return readSideDiscovery().gatePassed.includes(id);
}
function markSideGatePassed(id) {
  const d = readSideDiscovery();
  if (!d.gatePassed.includes(id)) d.gatePassed.push(id);
  if (!d.discovered.includes(id)) d.discovered.push(id);
  writeSideDiscovery(d);
}
function showAll() {
  const ids = SIDE_ISLANDS.map(s => s.id);
  writeSideDiscovery({ discovered: ids, gatePassed: ids });
  set(NODES.length);
}
function sideEligible(s, mainDone) {
  if (sideDone(s.id)) return true;
  return mainDone >= s.unlockAt && (!s.requiresSide || sideDone(s.requiresSide));
}
function visibleSideIslands(mainDone = progress()) {
  const d = readSideDiscovery();
  const ids = new Set(SIDE_ISLANDS.filter(s => sideDone(s.id)).map(s => s.id));
  const discovered = new Set(d.discovered || []);
  SIDE_ISLANDS.filter(s => s.featured && sideEligible(s, mainDone)).forEach(s => {
    ids.add(s.id);
    if (!discovered.has(s.id)) markDiscovered(s.id);
  });
  const discoveredEligible = SIDE_ISLANDS.filter(s => sideEligible(s, mainDone) && !sideDone(s.id) && discovered.has(s.id));
  discoveredEligible.forEach(s => ids.add(s.id));
  const active = discoveredEligible[0] || SIDE_ISLANDS.find(s => sideEligible(s, mainDone) && !sideDone(s.id));
  if (active && !ids.has(active.id)) {
    ids.add(active.id);
    markDiscovered(active.id);
  }
  return SIDE_ISLANDS.filter(s => ids.has(s.id));
}
function revealedAfter(id, mainDone = progress()) {
  if (!id) return [];
  return visibleSideIslands(mainDone).filter(s => !sideDone(s.id));
}

// Node i's position in WORLD coordinates: x/y are both % of the world box
// (the world box itself is WORLD_VH tall, so y=0 is the very top of the
// scrollable world and y=100 is the very bottom).
function posFor(i) { return ROUTE[i] || ROUTE[ROUTE.length - 1]; }

// Smooth Catmull-Rom curve through the points (start → nodes → beyond-the-top).
function pathThrough(pts) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}` +
         ` ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

// Fraction of the trail's length nearest to point p (for the lit reveal).
function fractionAt(path, p) {
  const total = path.getTotalLength(); let best = 0, bd = Infinity;
  for (let l = 0; l <= total; l += total / 300) {
    const q = path.getPointAtLength(l), d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
    if (d < bd) { bd = d; best = l; }
  }
  return best / total;
}

// Layering (far→near): #worldbg (fixed, slow parallax) → #stars (fixed, mid
// parallax) → #world (normal flow, WORLD_VH tall — trail + nodes scroll 1:1
// with the page, since it's the one real-height block driving body scroll).
// #sparks stay fixed (ambient, viewport-relative rising embers).
document.body.innerHTML = `
  <div id="worldbg"><picture><source srcset="${mapAsset('assets/storybook/kotopia-world-v2.avif')}" type="image/avif"><source srcset="${mapAsset('assets/storybook/kotopia-world-v2.webp')}" type="image/webp"><img src="${mapAsset('assets/storybook/kotopia-world-v2.webp')}" alt="" decoding="async" fetchpriority="high" onerror="this.closest('#worldbg').classList.add('imgfail')"></picture></div>
  <div id="clouds1"></div><div id="clouds2"></div>
  <div id="stars"></div><div id="sparks"></div>
  <div id="world">
    <svg id="sky" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g id="branchTrails"></g>
      <path id="trail" d=""></path><path id="trailLit" d="" pathLength="100"></path>
    </svg>
    <div id="tower" title="???"><img src="${mapAsset('assets/storybook/side-islands/storybook-tower-island-lit.webp')}" alt="" loading="lazy" decoding="async" fetchpriority="low"></div>
    <div id="nodes"></div>
  </div>
  <header class="hdr">
    <div class="logo">✦ MAGIC&nbsp;DUST <small>saga</small></div>
    <a class="mathportal" id="mathportal" href="./learning-portal.html">CỔNG SAGA</a>
    <div class="prog" id="prog"></div>
    <button class="themebtn" id="themebtn" title="change the magic's colors"></button>
  </header>
  <div class="toast" id="toast"></div>`;
const $ = id => document.getElementById(id);
$('world').style.height = WORLD_VH + 'vh';
$('tower').style.left = TOWER_SLOT.x + '%'; $('tower').style.top = TOWER_SLOT.y + '%';

// Theme cycle (theme.js applies at load; CSS vars restyle the page live).
if (self.SagaTheme) {
  const label = () => { $('themebtn').textContent = SagaTheme.THEMES[SagaTheme.current()].label; };
  $('themebtn').onclick = () => { const t = SagaTheme.cycle(); label(); toast(`${t.label} — ${t.blurb}`); };
  label();
} else $('themebtn').style.display = 'none';

function scatter(host, count, cls, decorate) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div'); s.className = cls;
    s.style.left = Math.random() * 100 + '%'; decorate(s, i); host.appendChild(s);
  }
}
scatter($('stars'), STARS, 'star', s => {
  const z = 1 + Math.random() * 2;
  s.style.top = Math.random() * 100 + '%'; s.style.width = s.style.height = z + 'px';
  s.style.animationDuration = 2.5 + Math.random() * 4 + 's'; s.style.animationDelay = -Math.random() * 6 + 's';
});
scatter($('sparks'), SPARKS, 'spark', s => {
  const z = 2 + Math.random() * 3;
  s.style.width = s.style.height = z + 'px';
  s.style.animationDuration = 9 + Math.random() * 14 + 's'; s.style.animationDelay = -Math.random() * 20 + 's';
});

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function shake(el) {
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}

// Legacy keys below preserve the original topic slugs. Runtime resolves every
// key to one canonical Kotopia storybook WebP; CSS renders locked/current/done.
// This keeps each node recognizable without shipping duplicate lit/unlit art.
const ISLAND_VARIANTS = [
  { unlit: 'assets/world/islands/island-lighthouse-unlit.webp', lit: 'assets/world/islands/island-lighthouse-lit.webp' },
  { unlit: 'assets/world/islands/island-spire-unlit.webp',      lit: 'assets/world/islands/island-spire-lit.webp' },
  { unlit: 'assets/world/islands/island-pancake-unlit.webp',    lit: 'assets/world/islands/island-pancake-lit.webp' },
  { unlit: 'assets/world/islands/island-rocklets-unlit.webp',   lit: 'assets/world/islands/island-rocklets-lit.webp' },
];
const BOSS_ISLAND = 'assets/storybook/island-dark-v2.webp';
const litAssetName = src => src.split('/').pop().replace(/-unlit\.png$/, '-lit.webp').replace(/-lit\.png$/, '-lit.webp');
const storybookNodeArt = src => `assets/storybook/node-islands/storybook-${litAssetName(src)}`;
const storybookSideArt = src => `assets/storybook/side-islands/storybook-${litAssetName(src)}`;

// P2b (MAP-REDESIGN-PLAN.md): island = big scenery, the star of the map —
// no longer the click target. The click target is the small rune PIN
// sitting on the trail at the island's base (number only; ✓ when done).
// The machine medallion (.orb + .art) is gone from the map entirely —
// machines are revealed in-node (bundle beat), not painted on the world.
// Only the CURRENT node gets a title banner; everyone else gets a
// tap/hover tooltip chip so the map stays uncluttered.
function nodeEl(n, i, state) {
  const el = document.createElement('div'), p = posFor(i);
  const arrive = state === 'current' && i === arriveIdx;
  const mystery = !n.art; // the '???' node — half-veiled in fog regardless of lock state
  el.className = 'node ' + state + (arrive ? ' arrive' : '') + (mystery ? ' mystery-node' : '');
  el.dataset.index = String(i);
  el.style.left = p.x + '%'; el.style.top = p.y + '%'; el.style.setProperty('--i', i);
  // Mystery/boss stays ominous. Regular nodes normalize their legacy key to
  // one storybook source; completion state is expressed by CSS and the pin.
  const islandPair = n.island || ISLAND_VARIANTS[i % ISLAND_VARIANTS.length];
  const islandSrc = mystery ? BOSS_ISLAND : (state === 'done' ? islandPair.lit : islandPair.unlit);
  const renderedIslandSrc = mystery ? islandSrc : storybookNodeArt(islandSrc);
  const runeLabel = mystery ? '?' : i;
  const imagePriority = state === 'current'
    ? 'loading="eager" fetchpriority="high"'
    : 'loading="lazy" fetchpriority="low"';
  el.innerHTML = `
    <div class="float">
      ${arrive ? '<div class="frame"></div>' : ''}
      <div class="island real"><img src="${mapAsset(renderedIslandSrc)}" alt="" ${imagePriority} decoding="async"></div>
      ${mystery ? '<div class="fog"></div>' : ''}
      ${state === 'current' ? `<div class="pip"><img src="${mapAsset('assets/storybook/pip-storybook-v2.webp')}" alt="Pip" loading="eager" decoding="async" fetchpriority="high"></div>` : ''}
      <div class="pin"><div class="pulse"></div><span class="rune">${runeLabel}</span><span class="pincheck">✓</span></div>
      ${state === 'current'
        ? `<div class="banner"><span class="beacon"></span><b>${i}</b> ${n.title} <span class="start">START</span></div>`
        : `<div class="tip">${n.title}</div>`}
    </div>`;
  const go = () => {
    if (state === 'locked') { shake(el.querySelector('.pin')); toast('Complete the ritual to unlock ✨'); return; }
    if (!n.page) { toast('This node is still forming…'); return; }
    location.href = n.page;
  };
  // Current node: single tap/click navigates straight in (it's the "you are
  // here" spot, no ambiguity). Other nodes: forgiving tap-then-tap — first
  // tap/hover reveals the tooltip title, a second tap (or desktop hover+click)
  // navigates, so a stray touch doesn't accidentally launch the wrong lesson.
  if (state === 'current') el.onclick = go;
  else {
    el.onmouseenter = () => el.classList.add('tipshown');
    el.onmouseleave = () => el.classList.remove('tipshown');
    el.onclick = () => { if (el.classList.contains('tipshown')) go(); else el.classList.add('tipshown'); };
  }
  return el;
}

// Side-island marker — a standalone sprite off the main trail. The small
// pin is just a state badge so these read as optional extra islands, not
// numbered required nodes.
function sideIslandEl(s, unlocked, done) {
  const el = document.createElement('div');
  const gated = s.gate !== false && unlocked && !done && !sideGatePassed(s.id);
  el.className = 'sidenode' + (unlocked ? '' : ' locked') + (done ? ' done' : '') + (!done ? ' secret' : '') + (gated ? ' gated' : '');
  el.dataset.id = s.id;
  if (s.kind) el.dataset.kind = s.kind;
  const mapPos = s.mapPos || { x: s.pos.x, y: liftLegacyY(s.pos.y) };
  el.style.left = mapPos.x + '%'; el.style.top = mapPos.y + '%';
  const icon = done ? '✓' : (gated ? '✊' : '✦');
  const suffix = done ? (s.kind === 'learning-branch' ? ' · đã học' : ' · đã luyện')
    : (gated ? ' · oẳn tù tì để vào'
      : (s.kind === 'learning-branch' ? ' · nhánh học mới'
        : (s.kind === 'practice-tower' || s.kind === 'tower' ? ' · tháp luyện' : (s.featured ? ' · nhánh luyện' : ' · đảo bí mật'))));
  if (s.storybook !== false) s = { ...s, art: storybookSideArt(s.art), litArt: storybookSideArt(s.litArt || s.art) };
  const sideArt = done && s.litArt ? s.litArt : s.art;
  el.innerHTML = `
    <div class="sideart"><img src="${mapAsset(sideArt)}" alt="" loading="lazy" decoding="async" fetchpriority="low"></div>
    <div class="sidepin"><span class="sideicon">${icon}</span></div>
    <div class="sidetip">${s.title}${suffix}</div>`;
  const go = () => {
    if (!unlocked) { shake(el.querySelector('.sidepin')); toast('Học xong node trước đã, rồi ghé lại nhé ✨'); return; }
    if (gated) {
      const gate = self.SideRpsGate;
      if (!gate || typeof gate.open !== 'function') { toast('Cổng oẳn tù tì chưa kịp mở, vào đảo trước nhé'); location.href = s.page; return; }
      gate.open({ islandId: s.id, title: s.title }).then(ok => { if (ok) { markSideGatePassed(s.id); location.href = s.page; } });
      return;
    }
    location.href = s.page;
  };
  el.onmouseenter = () => el.classList.add('tipshown');
  el.onmouseleave = () => el.classList.remove('tipshown');
  el.onclick = () => { if (el.classList.contains('tipshown')) go(); else el.classList.add('tipshown'); };
  return el;
}

function render() {
  const done = progress(), current = Math.min(done, NODES.length - 1);
  $('mathportal').classList.toggle('available', done >= 5);
  // #sky is WORLD_VH-tall (not the viewport), so the viewBox aspect must
  // track the WORLD's pixel aspect ratio (width=innerWidth, height=world
  // px height), not the viewport's — otherwise strokes/dashes distort.
  const worldPxH = innerHeight * (WORLD_VH / 100);
  const A = innerWidth / Math.max(worldPxH, 1), U = p => ({ x: p.x * A, y: p.y });
  $('sky').setAttribute('viewBox', `0 0 ${100 * A} 100`);
  const pts = [{ x: 18, y: 99 }, ...NODES.map((_, i) => posFor(i)), TOWER_SLOT];
  const d = pathThrough(pts.map(U));
  $('trail').setAttribute('d', d); $('trailLit').setAttribute('d', d);
  const lit = done >= NODES.length ? 1 : fractionAt($('trail'), U(posFor(current)));
  $('trailLit').style.strokeDasharray = `${lit * 100} 100`;
  const host = $('nodes'); host.innerHTML = '';
  const visibleSides = visibleSideIslands(done);
  const branchHost = $('branchTrails'); branchHost.innerHTML = '';
  visibleSides.filter(s => Number.isInteger(s.branchFrom) || s.branchFromSide).forEach(s => {
    const parent = s.branchFromSide ? SIDE_ISLANDS.find(item => item.id === s.branchFromSide) : null;
    if (s.branchFromSide && !parent) return;
    const from = U(parent ? (parent.mapPos || { x: parent.pos.x, y: liftLegacyY(parent.pos.y) }) : posFor(s.branchFrom));
    const rawTo = s.mapPos || { x: s.pos.x, y: liftLegacyY(s.pos.y) };
    const to = U(rawTo);
    const bend = (to.x - from.x) * .58;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend * .35} ${to.y}, ${to.x} ${to.y}`);
    path.setAttribute('class', `branchtrail${sideDone(s.id) ? ' done' : ''}`);
    path.dataset.id = s.id;
    branchHost.appendChild(path);
  });
  NODES.forEach((n, i) => host.appendChild(nodeEl(n, i, i < done ? 'done' : i === done ? 'current' : 'locked')));
  visibleSides.forEach(s => host.appendChild(sideIslandEl(s, sideEligible(s, done), sideDone(s.id))));
  $('prog').textContent = done >= NODES.length ? 'ALL NODES SEALED ✦' : `NODE ${done} / ${NODES.length - 1}`; // zero-indexed, like a real machine
  return current;
}
const currentIdx = render();
const justSolvedSide = sessionStorage.getItem(SIDE_SOLVED_FLAG); sessionStorage.removeItem(SIDE_SOLVED_FLAG);
const newlyRevealed = justSolvedSide ? revealedAfter(justSolvedSide, progress()) : [];
if (arriveIdx >= 0 && arriveIdx < NODES.length) toast('✦ NODE SEALED — a new node awakens');
if (newlyRevealed.length) setTimeout(() => toast(`Một đảo bí mật vừa hiện ra: ${newlyRevealed[0].title}`), arriveIdx >= 0 ? 900 : 250);

// Scroll world: parallax the fixed far/mid layers against the 1:1-scrolling
// #world (trail+nodes), passive listener only — no per-frame JS loop.
function worldScrollY() { return scrollY || document.documentElement.scrollTop || 0; }
function onScroll() {
  const y = worldScrollY();
  $('worldbg').style.transform = `translateY(${-y * .35}px)`;
  $('clouds1').style.transform = `translateY(${-y * .45}px)`;
  $('clouds2').style.transform = `translateY(${-y * .52}px)`;
  $('stars').style.transform = `translateY(${-y * .6}px)`;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Auto-smooth-scroll to the current node on load, after a beat so the
// player first sees the wider world before being carried to their place in it.
function scrollToNode(i, smooth) {
  const p = posFor(i), worldPxH = innerHeight * (WORLD_VH / 100);
  const targetY = worldPxH * (p.y / 100) - innerHeight / 2;
  scrollTo({ top: Math.max(0, targetY), behavior: smooth ? 'smooth' : 'auto' });
}
setTimeout(() => scrollToNode(arriveIdx >= 0 ? arriveIdx : currentIdx, true), 650);

// Map cheat: type  p i p  (or open with #cheat) → progress buttons, same
// API as the console saga.* helpers. Type  show_all  → instantly unlocks
// every node and reveals every side island without opening the panel.
let cheatEl = null, cheatBuf = '';
function toggleCheat() {
  if (cheatEl) { cheatEl.remove(); cheatEl = null; return; }
  cheatEl = document.createElement('div'); cheatEl.id = 'cheat';
  cheatEl.innerHTML = '<b>✦ CHEATS</b>';
   [...NODES.map((_, i) => [`unlock node ${i}`, () => set(i)]),
    ['show all', showAll], ['reset', () => set(0)],
    ['replay onboarding', () => { localStorage.removeItem('magicdust.onboard'); location.reload(); }],
  ].forEach(([t, fn]) => { const b = document.createElement('button'); b.textContent = t; b.onclick = fn; cheatEl.appendChild(b); });
  document.body.appendChild(cheatEl);
}
addEventListener('keydown', e => {
  cheatBuf = (cheatBuf + e.key).slice(-8);
  if (cheatBuf.endsWith('pip')) { cheatBuf = ''; toggleCheat(); }
  else if (cheatBuf === 'show_all') { cheatBuf = ''; showAll(); }
});
if (location.hash === '#cheat') toggleCheat();
let resizeTimer;
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(render, 150); });
console.info('%c✦ saga dev: saga.complete() · saga.reset() · saga.set(n)', 'color:#78b2a5');
