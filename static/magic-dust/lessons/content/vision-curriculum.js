export const VISION_BATCHES = Object.freeze([
  { id: 1, title: "Ánh sáng vào máy", nodeIds: [0, 1, 2] },
  { id: 2, title: "Xưởng xử lý pixel", nodeIds: [3, 4, 5, 6] },
  { id: 3, title: "Truy tìm mẫu", nodeIds: [7, 8, 9, 10] },
  { id: 4, title: "Không gian và chuyển động", nodeIds: [11, 12, 13] },
]);

export const VISION_PINHOLE_LAB_ART = "assets/storybook/vision-saga/vision-node00-pinhole-lab-v1.webp";
export const VISION_LOCATION_ART = Object.freeze([
  VISION_PINHOLE_LAB_ART,
  ...Array.from({ length: 13 }, (_, index) => `assets/storybook/vision-saga/vision-node${String(index + 1).padStart(2, "0")}-location-v1.webp`),
]);

const VISION_NODE_DEFINITIONS = [
  ["Camera Lỗ Kim", "Tia sáng đi thẳng và ảnh thật bị đảo chiều", 5],
  ["Từ Điểm 3D Đến Điểm Ảnh", "Chiếu (x, y, z) thành tọa độ ảnh (u, v)", 7],
  ["Ảnh Là Ma Trận RGB", "Đọc pixel, kênh màu và ảnh xám", 16],
  ["Kernel: Ma Trận Lọc Nhỏ", "Trượt khung 3×3 và tính nhân-cộng", 16],
  ["Blur: Làm Mờ Để Giảm Nhiễu", "So độ mịn với phần chi tiết bị mất", 16],
  ["Đo Viền Ảnh", "Đo thay đổi độ sáng theo hai hướng", 16],
  ["Threshold: Chọn Theo Ngưỡng", "Tạo mask 0/1 và đếm vùng tiền cảnh", 16],
  ["SAD/SSD: Đo Sai Khác Với Mẫu", "Tính tổng sai khác tại từng vị trí", 20],
  ["NCC: Chuẩn Hóa Điểm Khớp", "So mẫu khi độ sáng thay đổi", 20],
  ["NMS: Bỏ Các Khung Chồng Nhau", "Giữ điểm khớp tốt và bỏ box trùng", 20],
  ["OpenCV Không Phải Hộp Đen", "Đối chiếu vòng lặp với cv2.matchTemplate", 20],
  ["Nắn Phối Cảnh", "Đưa bốn góc xiên về hình chữ nhật", 20],
  ["Theo Dõi Chuyển Động Qua Các Frame", "Nối tâm vật qua một chuỗi ảnh liên tiếp", 24],
  ["Pipeline Tìm và Theo Dõi Mẫu", "Ghép các bước xử lý và báo rõ ca không tìm thấy", 25],
];

const VISION_COLLECTIBLES = [
  ["Hộp Tối Bỏ Túi", "◉"],
  ["Thước Tiêu Cự", "⌖"],
  ["Tinh Thể RGB", "◆"],
  ["Khung Quan Sát 3×3", "▦"],
  ["Hạt Khử Nhiễu", "✦"],
  ["Bút Vẽ Viền", "◇"],
  ["Mặt Nạ Tiền Cảnh", "◐"],
  ["Mảnh Mẫu SAD", "▣"],
  ["Bản Đồ Đáp Ứng", "▤"],
  ["Ấn Cực Đại", "♢"],
  ["Chìa Khóa OpenCV", "⚿"],
  ["Khung Phối Cảnh", "▱"],
  ["La Bàn Chuyển Động", "⌁"],
  ["Kính Thị Giác Kotopia", "◈"],
];

const READY_NODE_IDS = new Set(VISION_NODE_DEFINITIONS.map((_, id) => id));

export const VISION_NODES = Object.freeze(VISION_NODE_DEFINITIONS.map((definition, id) => ({
  id,
  title: definition[0],
  mechanism: definition[1],
  mainRequired: definition[2],
  batch: VISION_BATCHES.find(batch => batch.nodeIds.includes(id)).id,
  ready: READY_NODE_IDS.has(id),
  art: VISION_LOCATION_ART[id],
  collectible: {
    name: VISION_COLLECTIBLES[id][0],
    glyph: VISION_COLLECTIBLES[id][1],
  },
})));

export const visionCompletionKey = id => `magicdust.vision.node.${id}`;
export const visionLessonPage = id => `vision-lesson.html?node=${id}`;

export const visionReward = node => ({
  track: "vision",
  nodeId: node.id,
  xp: 100,
  collectible: node.collectible,
  completionKey: visionCompletionKey(node.id),
});
