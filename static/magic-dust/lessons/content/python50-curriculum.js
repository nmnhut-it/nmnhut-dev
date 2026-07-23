export const PYTHON50_SOURCE_TITLE = "Tổng hợp 50 bài tập Python cơ bản - nâng cao";
export const PYTHON50_SOURCE_URL = "https://www.tica.edu.vn/wp-content/uploads/2020/10/Ba%CC%80i-ta%CC%A3%CC%82p-python.pdf";

export const PYTHON50_SOURCE = Object.freeze({
  organization: "Học viện Công nghệ TICA",
  title: PYTHON50_SOURCE_TITLE,
  url: PYTHON50_SOURCE_URL,
});

const NODE_ARTS = [
  "assets/world/islands/island-lighthouse-lit.webp",
  "assets/world/islands/island-spire-lit.webp",
  "assets/world/islands/island-pancake-lit.webp",
  "assets/world/islands/island-rocklets-lit.webp",
];

const COLLECTIBLE_GLYPHS = ["✦", "◆", "◇", "❖"];

const PYTHON50_NODE_DEFINITIONS = [
  { id: 0, title: "Máy Tính Hai Lệnh", short: "if / elif với hai phép tính", mainRequired: 5, collectibleName: "Chip Hai Lệnh", sourceExercises: [35], sourceNote: "Giữ máy tính cộng/trừ; tách phần viết hàm để học sinh luyện if/elif trước." },
  { id: 1, title: "Quầy Giảm Giá", short: "điều kiện theo ngưỡng", mainRequired: 6, collectibleName: "Thẻ Giảm Giá", sourceExercises: [5], sourceNote: "Giữ giá 100 đồng mỗi món và quy tắc giảm 10% khi tổng tiền lớn hơn 10.000 đồng." },
  { id: 2, title: "Trạm Ba Mức", short: "ba khoảng và giá trị biên", mainRequired: 7, collectibleName: "Thẻ Ba Mức", sourceExercises: [29], sourceNote: "Giữ ba khoảng tốc độ; lược nhánh sinh nhật để tập trung vào giá trị biên." },
  { id: 3, title: "Đoán Số Cố Định", short: "while và số lượt thử", mainRequired: 8, collectibleName: "Kính Đếm Lượt", sourceExercises: [4], sourceNote: "Thay số ngẫu nhiên bằng số đích cho sẵn ở phần mẫu để học sinh quan sát vòng lặp." },
  { id: 4, title: "Mã Chữ Số Cuối", short: "% và chữ số hàng đơn vị", mainRequired: 10, collectibleName: "Mảnh Mã Số", sourceExercises: [1], sourceNote: "Dạy rõ number % 10 trước khi áp dụng đúng yêu cầu kiểm tra chữ số cuối là 7." },
  { id: 5, title: "Lịch Năm Nhuận", short: "kết hợp điều kiện chia hết", mainRequired: 10, collectibleName: "Lá Lịch Bốn Mùa", sourceExercises: [23], sourceNote: "Giữ nguyên các quy tắc năm nhuận của đề nguồn và thêm bài sửa thứ tự nhánh." },
  { id: 6, title: "Xưởng Ước Số", short: "for, range và chia hết", mainRequired: 11, collectibleName: "Búa Tìm Ước", sourceExercises: [25], sourceNote: "Chuyển yêu cầu liệt kê ước thành ba bước mẫu, sửa lỗi và đếm ước." },
  { id: 7, title: "Thám Tử Số Nguyên Tố", short: "đếm ước để phân loại", mainRequired: 11, collectibleName: "Kính Nguyên Tố", sourceExercises: [13], sourceNote: "Rút nhỏ từ liệt kê mọi số nguyên tố dưới n thành kiểm tra một số bằng cách đếm ước." },
  { id: 8, title: "Đội Quét List", short: "tổng, số chẵn và cực trị", mainRequired: 15, collectibleName: "Máy Quét List", sourceExercises: [3, 6, 7, 14], sourceNote: "Gom bốn bài cùng dùng mẫu quét list thành một chặng luyện tổng, đếm và cực trị." },
  { id: 9, title: "Huy Chương Hạng Nhì", short: "giá trị lớn thứ hai không trùng hạng nhất", mainRequired: 15, collectibleName: "Huy Chương Bạc", sourceExercises: [10], sourceNote: "Làm rõ hai hạng phải có mức điểm khác nhau khi list có phần tử lặp." },
  { id: 10, title: "Kho Lọc Bản Sao", short: "sắp xếp để bỏ giá trị lặp", mainRequired: 17, collectibleName: "Khay Lọc Bản Sao", sourceExercises: [9], sourceNote: "Giữ yêu cầu bỏ phần tử lặp; dùng công cụ sắp xếp đã học để các bản sao đứng cạnh nhau." },
  { id: 11, title: "Phòng Chuỗi", short: "đếm và kiểm tra chuỗi", mainRequired: 18, collectibleName: "Ống Kính Chuỗi", sourceExercises: [40, 46], sourceNote: "Giữ bài kiểm tra đối xứng và chuyển bài đếm chữ thành luyện quét từng ký tự." },
  { id: 12, title: "Lò Đúc Hàm", short: "tham số và return", mainRequired: 20, collectibleName: "Khuôn Đúc Hàm", sourceExercises: [11, 38, 39], sourceNote: "Dùng các yêu cầu viết hàm làm khung; thay dữ liệu hình học bằng ví dụ số học ngắn đã học." },
  { id: 13, title: "Lễ Hội Dữ Liệu", short: "tần suất bằng dictionary", mainRequired: 21, collectibleName: "Cúp Dữ Liệu", sourceExercises: [50], sourceNote: "Bỏ đọc và ghi file; cho sẵn list để luyện trọn thuật toán tần suất trong trình duyệt." },
];

export const PYTHON50_NODES = PYTHON50_NODE_DEFINITIONS.map(definition => ({
  id: definition.id,
  title: definition.title,
  short: definition.short,
  mainRequired: definition.mainRequired,
  art: NODE_ARTS[definition.id % NODE_ARTS.length],
  sourceExercises: definition.sourceExercises,
  sourceNote: definition.sourceNote,
  collectible: {
    name: definition.collectibleName,
    glyph: COLLECTIBLE_GLYPHS[definition.id % COLLECTIBLE_GLYPHS.length],
  },
}));

export const python50CompletionKey = id => `magicdust.python50.node.${id}`;
export const python50LessonPage = id => `python50-lesson.html?node=${id}`;

export const python50Reward = node => ({
  track: "python50",
  nodeId: node.id,
  xp: 100,
  collectible: node.collectible,
  completionKey: python50CompletionKey(node.id),
});
