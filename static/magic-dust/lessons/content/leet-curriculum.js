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
    [1, 11, 15, 26, 27, 41, 42, 53, 88]),
  set("pointers", "POINTERS", "Vách Đá Hai Đầu",
    "hai con trỏ, cửa sổ trượt và sửa mảng tại chỗ", "◆",
    [16, 18, 31, 75, 80, 167, 189, 209, 238]),
  set("search", "SEARCH", "Giếng Chia Đôi",
    "nhị phân — chấm bằng số lần đọc mảng", "◇",
    [4, 33, 34, 35, 74, 81, 153, 154, 162]),
  set("matrix", "MATRIX", "Sân Gạch Vuông",
    "lưới hai chiều: xoắn ốc, xoay hình, quay lui", "❖",
    [36, 37, 48, 54, 59, 73, 79]),
  set("backtrack", "BACKTRACK", "Rừng Rẽ Nhánh",
    "liệt kê mọi đáp án: chọn, đi tiếp, dọn lại", "✧",
    [39, 40, 46, 47, 51, 78, 90, 212, 216]),
  set("dp", "DP", "Thác Bậc Thang",
    "quy hoạch động: bảng số, đường trên lưới, mua bán", "◈",
    [45, 55, 63, 64, 118, 119, 120, 121, 122]),
  set("dphard", "DPHARD", "Hang Nhiều Tầng",
    "quy hoạch động có trạng thái: cầm hay không, đã bán mấy lần", "◉",
    [123, 139, 140, 152, 174, 188, 198, 213, 221]),
  set("hash", "HASH", "Chợ Đếm Đầu",
    "đổi vòng dò thành một lần tra bảng", "◍",
    [14, 49, 128, 136, 137, 169, 217, 219, 229]),
  set("greedy", "GREEDY", "Bến Tham Lam",
    "chọn tại chỗ, gộp khoảng và trường hợp biên", "◐",
    [56, 57, 66, 68, 134, 135, 179, 220, 228]),
  set("stack", "STACK", "Cầu Thang Xếp Chồng",
    "ngăn xếp đơn điệu, cửa sổ trượt và quét", "◒",
    [84, 85, 149, 150, 164, 204, 215, 218, 239]),
  set("tree", "TREE", "Rừng Có Gốc",
    "dựng cây từ dấu vết, và lan trên lưới", "❉",
    [105, 106, 108, 130, 163, 200]),
  set("design", "DESIGN", "Xưởng Đồ Nghề",
    "nộp một class, chấm bằng cả một kịch bản gọi", "◑",
    [157, 158, 170]),
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
