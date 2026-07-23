const MATH6_COLLECTIBLES = [
  "La bàn Bốn Phép Tính", "Thước Đổi Đơn Vị", "Túi Tiền Kotopia", "Bản Vẽ Hình Phẳng",
  "Hộp Chia Đều", "Nhiệt Kế Số Nguyên", "Mảnh Cầu Phân Số", "Kính Phần Trăm",
  "Tinh Thể Số Nguyên Tố", "Xúc Xắc Dữ Liệu", "Ăng-ten Thống Kê", "Gương Pixel",
  "Bảng Tổng Hàng", "La Bàn Tổng Cột", "Kính Đếm Ô", "Huy Hiệu Hàng Cao", "Khuôn Đúc Bảng", "Gương Lưới",
];

const nodes = [
  { id: 0, title: "Bốn Phép Tính", short: "Bốn phép tính", mainRequired: 5, art: "assets/world/islands/island-lighthouse-lit.webp" },
  { id: 1, title: "Đổi Đơn Vị", short: "Đổi đơn vị", mainRequired: 5, art: "assets/world/islands/island-spire-lit.webp" },
  { id: 2, title: "Tính Tiền", short: "Tính tiền", mainRequired: 5, art: "assets/world/islands/island-pancake-lit.webp" },
  { id: 3, title: "Chu Vi và Diện Tích", short: "Chu vi và diện tích", mainRequired: 5, art: "assets/world/islands/island-rocklets-lit.webp" },
  { id: 4, title: "Thương và Phần Dư", short: "Thương và phần dư", mainRequired: 6, art: "assets/world/islands/island-lighthouse-lit.webp" },
  { id: 5, title: "Số Nguyên và Nhiệt Độ", short: "Số nguyên", mainRequired: 7, art: "assets/world/islands/island-spire-lit.webp" },
  { id: 6, title: "Phân Số", short: "Phân số", mainRequired: 7, art: "assets/world/islands/island-pancake-lit.webp" },
  { id: 7, title: "Số Thập Phân và Phần Trăm", short: "Số thập phân", mainRequired: 7, art: "assets/world/islands/island-rocklets-lit.webp" },
  { id: 8, title: "Ước, Bội và Số Nguyên Tố", short: "Ước, bội, số nguyên tố", mainRequired: 11, art: "assets/world/islands/island-lighthouse-lit.webp" },
  { id: 9, title: "Xác Suất Thực Nghiệm", short: "Xác suất thực nghiệm", mainRequired: 15, art: "assets/world/islands/island-spire-lit.webp" },
  { id: 10, title: "Quét và Tóm Tắt Dữ Liệu", short: "Quét dữ liệu", mainRequired: 15, art: "assets/world/islands/island-pancake-lit.webp" },
  { id: 11, title: "Đối Xứng Trên Grid", short: "Đối xứng dọc trên grid ba cột", mainRequired: 16, art: "assets/world/islands/island-rocklets-lit.webp" },
  { id: 12, title: "Tính Tổng Từng Hàng", short: "Tính tổng từng hàng trong grid", mainRequired: 16, art: "assets/world/islands/island-lighthouse-lit.webp" },
  { id: 13, title: "Tính Tổng Từng Cột", short: "Tính tổng từng cột trong grid", mainRequired: 16, art: "assets/world/islands/island-spire-lit.webp" },
  { id: 14, title: "Đếm Ô Theo Điều Kiện", short: "Đếm giá trị thỏa điều kiện trong cả grid", mainRequired: 16, art: "assets/world/islands/island-pancake-lit.webp" },
  { id: 15, title: "So Sánh Tổng Các Hàng", short: "Tìm hàng có tổng lớn nhất", mainRequired: 16, art: "assets/world/islands/island-rocklets-lit.webp" },
  { id: 16, title: "Tạo Grid Từ Công Thức", short: "Tạo grid mới từ công thức hàng và cột", mainRequired: 16, art: "assets/world/islands/island-lighthouse-lit.webp" },
  { id: 17, title: "Hoàn Thiện Grid Đối Xứng", short: "Hoàn thiện và kiểm tra đối xứng", mainRequired: 16, art: "assets/world/islands/island-spire-lit.webp" },
];

export const MATH6_NODES = nodes.map(node => ({
  ...node,
  collectible: { name: MATH6_COLLECTIBLES[node.id], glyph: ["✦", "◆", "◇", "❖"][node.id % 4] },
}));

export const math6CompletionKey = id => `magicdust.math6.node.${id}`;
export const math6LessonPage = id => `math6-lesson.html?node=${id}`;
export const mainLessonBeforeMathNode = node => Math.max(0, node.mainRequired - 1);
export const math6Reward = node => ({
  track: "math6",
  nodeId: node.id,
  xp: 100,
  collectible: node.collectible,
  completionKey: math6CompletionKey(node.id),
});
