// Sổ đăng ký các đảo LeetCode — nguồn duy nhất cho bản đồ (leet-map.js), cổng
// saga (learning-portal.js) và phần thưởng.
//
// Mỗi đảo là một file `lessons/content/leet<MODULE>.js` chấm bằng py/leet_judge.
// Thêm đảo mới: thêm một dòng ở đây, tạo content + trang HTML cùng tên, đăng ký
// module Python trong py/test_leet_judge.py. Xem README "Auto-graded algorithm
// problems".

// `numbers` là số hiệu bài trên LeetCode, dùng để hiển thị và để soát trùng.
const set = (id, module, title, short, glyph, numbers) => ({
  id, module, title, short, glyph, numbers,
});

export const LEET_SETS = [
  set("arrays", "ARRAYS", "Đấu Trường Mảng",
    "gom, dồn và quét một lượt trên mảng", "✦",
    [1, 26, 27, 88, 11, 53, 42, 15]),
  set("pointers", "POINTERS", "Vách Đá Hai Đầu",
    "hai con trỏ, cửa sổ trượt và sửa mảng tại chỗ", "◆",
    [16, 18, 31, 75, 80, 167, 189, 209, 238]),
  set("search", "SEARCH", "Giếng Chia Đôi",
    "nhị phân — chấm bằng số lần đọc mảng", "◇",
    [4, 33, 34, 35, 74, 81, 153, 154, 162]),
  set("matrix", "MATRIX", "Sân Gạch Vuông",
    "lưới hai chiều: xoắn ốc, xoay hình, quay lui", "❖",
    [36, 37, 48, 54, 59, 73, 79]),
];

// Mở cùng lúc với saga DSA: các bài này giả định đã biết list, dict và vòng lặp.
export const LEET_MAIN_REQUIRED = 21;

export const leetSetCompletionKey = id => `magicdust.leet.set.${id}`;
export const leetSetPage = meta => `leet${meta.module}.html`;
export const leetProblemCount = LEET_SETS.reduce((total, meta) => total + meta.numbers.length, 0);

export const leetReward = meta => ({
  track: "leet",
  nodeId: `set:${meta.id}`,
  xp: 40 * meta.numbers.length,
  collectible: { name: `Huy hiệu ${meta.title}`, glyph: meta.glyph },
  completionKey: leetSetCompletionKey(meta.id),
});
