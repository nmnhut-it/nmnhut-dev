const chapter = (id, title, subtitle) => ({ id, title, subtitle });

export const DSA_CHAPTERS = [
  chapter(0, "Tư duy thuật toán", "mô hình dữ liệu, kiểm thử và số bước"),
  chapter(1, "Cấu trúc tuyến tính", "stack, queue, set, dict và liên kết"),
  chapter(2, "Tìm kiếm và sắp xếp", "binary search, ba cách sắp xếp và recursion"),
  chapter(3, "Mẫu xử lý list", "hai con trỏ, cửa sổ trượt và tổng cộng dồn"),
  chapter(4, "Cây và đồ thị", "DFS, BFS và dựng lại đường đi"),
];

const node = (id, chapterId, title, short, collectible) => ({ id, chapterId, title, short, collectible: { name: collectible, glyph: ["✦", "◆", "◇", "❖"][id % 4] } });

export const DSA_NODES = [
  node(0, 0, "Chọn Cách Cất Dữ Liệu", "list, set hay dict", "Bản Đồ Dữ Liệu"),
  node(1, 0, "Theo Dõi Từng Bước", "bảng trạng thái thuật toán", "Kính Lần Theo"),
  node(2, 0, "Thử Trường Hợp Khó", "test thường và test biên", "Hộp Ca Kiểm Thử"),
  node(3, 0, "Đếm Việc Máy Làm", "số lần so sánh và tốc độ tăng", "Đồng Hồ Số Bước"),
  node(4, 1, "Stack: Vào Sau Ra Trước", "push, pop và peek", "Túi Stack"),
  node(5, 1, "Hoàn Tác Bằng Stack", "Undo và kiểm tra ngoặc", "Nút Hoàn Tác"),
  node(6, 1, "Queue: Vào Trước Ra Trước", "enqueue, dequeue và lượt chờ", "Vé Hàng Đợi"),
  node(7, 1, "Set và Dict", "không trùng và bảng tần suất", "Con Dấu Không Trùng"),
  node(8, 1, "Chuỗi Liên Kết", "giá trị và nút tiếp theo", "Móc Nối Dữ Liệu"),
  node(9, 2, "Tìm Lần Lượt hay Chặt Đôi", "linear và binary search", "La Bàn Tìm Kiếm"),
  node(10, 2, "Selection Sort", "chọn phần tử nhỏ nhất còn lại", "Kẹp Chọn Nhỏ Nhất"),
  node(11, 2, "Insertion Sort", "chèn vào phần đã có thứ tự", "Thẻ Chèn Đúng Chỗ"),
  node(12, 2, "Hàm Tự Gọi", "điểm dừng và call stack", "Chuông Điểm Dừng"),
  node(13, 2, "Ghép Hai List Đã Xếp", "merge và hai vị trí đang đọc", "Khóa Ghép Đôi"),
  node(14, 2, "Merge Sort", "chia nhỏ rồi ghép lại", "Mảnh Ghép Sắp Xếp"),
  node(15, 2, "Dự Án Bảng Xếp Hạng", "sắp xếp, tìm kiếm và điểm bằng nhau", "Cúp Bảng Xếp Hạng"),
  node(16, 3, "Hai Con Trỏ", "đọc dữ liệu từ hai phía", "Cặp Kim Chỉ Hướng"),
  node(17, 3, "Cửa Sổ Trượt", "cập nhật một đoạn liên tiếp", "Khung Quan Sát"),
  node(18, 3, "Tổng Cộng Dồn", "prefix sum và truy vấn đoạn", "Dải Tổng Tích Lũy"),
  node(19, 3, "Dự Án Trạm Dữ Liệu", "tần suất, cửa sổ và truy vấn", "Tinh Thể Dữ Liệu"),
  node(20, 4, "Cây: Cha, Con và Lá", "biểu diễn dữ liệu phân cấp", "Mầm Cây Dữ Liệu"),
  node(21, 4, "DFS: Đi Sâu rồi Quay Lại", "stack, recursion và vùng liên thông", "Dây Dẫn Đường DFS"),
  node(22, 4, "Đồ Thị và BFS", "adjacency list và đường ít chặng", "Đèn Hàng Đợi BFS"),
  node(23, 4, "Dự Án Bản Đồ Đường Đi", "lưu parent và dựng lại lộ trình", "La Bàn Kotopia"),
];

const support = (id, chapterId, module, title, short, unlockAfter, glyph) => ({ id, chapterId, module, title, short, unlockAfter, glyph });

export const DSA_ISLANDS = [
  support("edge-cases", 0, "EDGECASES", "Luyện Trường Hợp Biên", "list rỗng, một phần tử, trùng và giá trị sát mốc", 2, "!"),
  support("step-counter", 0, "STEPCOUNTER", "Luyện Đếm Bước", "đếm phép so sánh và quan sát tốc độ tăng", 3, "#"),
  support("stack-puzzles", 1, "STACKPUZZLES", "Luyện Stack", "Undo, ghép ngoặc và thao tác đối nhau", 5, "↶"),
  support("dispatch-center", 1, "DISPATCH", "Luyện Queue, Set và Dict", "chọn cấu trúc theo thứ tự, tính duy nhất và khóa tra cứu", 8, "⇥"),
  support("binary-lab", 2, "BINARYLAB", "Luyện Binary Search", "giữ đúng biên tìm kiếm trên dữ liệu đã sắp xếp", 9, "⌕"),
  support("sorting-arena", 2, "SORTINGARENA", "So Sánh Cách Sắp Xếp", "đếm số bước của các thuật toán sắp xếp", 14, "≋"),
  support("two-pointers", 3, "TWOPOINTERS", "Luyện Hai Con Trỏ", "cặp có tổng cho trước, chuỗi đối xứng và giao hai list", 16, "↔"),
  support("data-window", 3, "DATAWINDOW", "Luyện Cửa Sổ và Tổng Cộng Dồn", "cửa sổ trượt, prefix sum và lỗi lệch index", 18, "▣"),
  support("tree-expedition", 4, "TREEEXPEDITION", "Luyện Duyệt Cây", "duyệt cây, đếm nút lá và tính độ sâu", 21, "Y"),
  support("rescue-network", 4, "RESCUENETWORK", "Luyện BFS", "tìm đường ít cạnh và nhận ra đích không thể tới", 22, "◎"),
];

export const DSA_TOWERS = [
  support("reasoning", 0, "REASONING", "Tháp Tư Duy Thuật Toán", "10 tầng kiểm thử và đếm bước", 3, "I"),
  support("structures", 1, "STRUCTURES", "Tháp Cấu Trúc Dữ Liệu", "10 tầng stack, queue, set và liên kết", 8, "II"),
  support("search-sort", 2, "SEARCHSORT", "Tháp Tìm Kiếm và Sắp Xếp", "10 tầng tìm, xếp và recursion", 15, "III"),
  support("patterns", 3, "PATTERNS", "Tháp Mẫu Xử Lý List", "10 tầng con trỏ, window và prefix", 19, "IV"),
  support("graphs", 4, "GRAPHS", "Tháp Cây và Đồ Thị", "10 tầng DFS, BFS và đường đi", 23, "V"),
];

export const DSA_MAIN_REQUIRED = 21;
export const dsaNodeCompletionKey = id => `magicdust.dsa.node.${id}`;
export const dsaIslandCompletionKey = id => `magicdust.dsa.island.${id}`;
export const dsaTowerCompletionKey = id => `magicdust.dsa.tower.${id}`;
export const dsaLessonPage = (type, id) => `dsa-lesson.html?type=${type}&id=${encodeURIComponent(id)}`;

export const dsaReward = (type, meta) => ({
  track: "dsa",
  nodeId: `${type}:${meta.id}`,
  xp: type === "tower" ? 180 : type === "island" ? 80 : 120,
  collectible: meta.collectible || { name: type === "tower" ? `Ấn ${meta.title}` : `Huy hiệu ${meta.title}`, glyph: meta.glyph || "✦" },
  completionKey: type === "node" ? dsaNodeCompletionKey(meta.id) : type === "island" ? dsaIslandCompletionKey(meta.id) : dsaTowerCompletionKey(meta.id),
});
