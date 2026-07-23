# Art roadmap · Mắt Máy Kotopia

## Art pillar

Saga mang cảm giác **xưởng quang học trong truyện tranh Kotopia**: camera lỗ kim,
thấu kính, màn hứng, bàn thử nghiệm và các tia sáng trở thành đồ vật trong thế giới.
Hình ảnh phải gợi tò mò trước, sau đó giúp học sinh nhìn ra cơ chế đang học.

Mỗi location art có ba lớp đọc được ngay ở kích thước nhỏ:

1. **Silhouette thế giới**: một địa điểm có hình dáng riêng, không chỉ là một icon UI.
2. **Cơ cấu quang học**: lỗ kim, thấu kính, kernel, khung mẫu hoặc mặt phẳng ảnh.
3. **Tín hiệu học tập**: đường tia, ô pixel, heatmap hoặc bounding box cho biết node dạy gì.

Không dùng cyberpunk, camera giám sát, nhận diện khuôn mặt, giao diện CCTV, ảnh máy ảnh
chụp thật hoặc chữ được vẽ sẵn trong bitmap. Không trộn lại nhóm background cinematic cũ.

## Hợp đồng màu

- Mọi UI, HUD, nút, trạng thái khóa và lớp phủ dùng biến trong `palette.css`.
- CSS của saga không chứa mã màu hex/RGB trực tiếp.
- Honey dành cho hành động và phần thưởng. Mint chỉ dùng cho bề mặt nhạt, đường viền,
  luồng sáng hoặc trạng thái thông tin; không dùng teal đậm làm nút hành động.
- Màu vẽ nằm bên trong PNG có thể dùng dải màu storybook để tạo vật liệu gỗ, đồng,
  kính và bầu trời. Màu đó không trở thành màu chrome của UI.
- Heatmap phải có thêm số, đường đồng mức hoặc marker; không bắt học sinh phân biệt chỉ
  bằng màu.

## Bộ asset

| Nhóm | Số lượng đích | Định dạng | Cách dùng |
|---|---:|---|---|
| Portal key art | 1 | PNG/WebP trong suốt | Đại Sảnh Cổng; bản đầu dùng camera island hiện có |
| Location art | 14 | PNG/WebP trong suốt, nguồn 520×520 | Một silhouette riêng cho mỗi node |
| Collectible | 14 | HTML/CSS medallion + glyph | Hiện khi hoàn thành node và trong album; luôn theo palette |
| Batch seal | 4 | SVG/CSS | Cho biết batch đang xây, sẵn sàng hoặc đã mở |
| Teaching diagram | 8–10 | SVG/canvas/code-native | Hình chính xác có thể đổi dữ liệu và chạy animation |
| Detection overlay | 1 bộ component | HTML/SVG/canvas | Box, điểm khớp, vector chuyển động, confidence |

Đã hoàn thành đủ 14 location art 520×520, WebP trong suốt. Node 00 dùng
`vision-node00-pinhole-lab-v1.webp`; Node 01–13 dùng mẫu tên
`vision-nodeNN-location-v1.webp`. Mười bốn collectible dùng tên riêng và glyph
trong medallion HTML/CSS để màu thưởng luôn theo `palette.css`.

Trạng thái `locked`, `current`, `completed` dùng CSS trên cùng một location asset. Không
nhân đôi ảnh lit/unlit. Text, nhãn node, XP và tiến độ luôn là HTML để rõ ở mọi màn hình.

## Diagram phải dựng bằng code

Các hình sau không dùng ảnh AI vì cần đúng hình học và phản ứng theo dữ liệu:

- đường tia của camera lỗ kim và mặt phẳng ảnh đảo chiều;
- chiếu điểm 3D sang `(u, v)` và đối chiếu với `image[row][col]`;
- cửa sổ trượt, kernel 3×3 và phép nhân-cộng đang chạy;
- so sánh ảnh gốc, blur, edge và threshold mask;
- response map với vị trí template hiện tại;
- NMS trước/sau khi loại các box trùng;
- bốn điểm nguồn-đích của perspective transform;
- tâm vật và vector chuyển động qua nhiều frame.

Animation ngắn 500–900 ms, dừng được, tôn trọng `prefers-reduced-motion`. Học sinh phải
có nút chạy từng bước; animation không thay thế OUTPUT số hoặc ma trận.

## Danh sách location art

Tên file dự kiến dưới `assets/storybook/vision-saga/`:

| Node | File | Motif chính |
|---:|---|---|
| 0 | `vision-node00-pinhole-lab` | Phòng tối, lỗ kim và hai tia cắt nhau |
| 1 | `vision-node01-location-v1.webp` | Điểm 3D, thấu kính và mặt phẳng ảnh |
| 2 | `vision-node02-location-v1.webp` | Ba tinh thể kênh màu ghép thành pixel |
| 3 | `vision-node03-location-v1.webp` | Khung 3×3 trượt trên bàn pixel |
| 4 | `vision-node04-location-v1.webp` | Bụi sáng được làm dịu qua thấu kính |
| 5 | `vision-node05-location-v1.webp` | Viền vật thể phát sáng ở nơi đổi độ sáng |
| 6 | `vision-node06-location-v1.webp` | Cổng tách foreground và background |
| 7 | `vision-node07-location-v1.webp` | Mảnh mẫu được tìm trong bức tường ký hiệu |
| 8 | `vision-node08-location-v1.webp` | Bản đồ điểm khớp trên bàn thiên văn |
| 9 | `vision-node09-location-v1.webp` | Nhiều tín hiệu chồng nhau, một đỉnh được giữ |
| 10 | `vision-node10-location-v1.webp` | Máy cơ khí nối từng bước với OpenCV |
| 11 | `vision-node11-location-v1.webp` | Tấm bảng hình thang nắn thành hình chữ nhật |
| 12 | `vision-node12-location-v1.webp` | Các frame nối thành quỹ đạo chuyển động |
| 13 | `vision-node13-location-v1.webp` | Trạm capstone ghép toàn bộ pipeline |

## Lộ trình theo batch

### Batch 0 · Cổng và pilot · hoàn thành

- Đại Sảnh Cổng đã dùng key art `portal-courtyard-v3.webp`; cổng Mắt Máy dẫn tới
  roadmap và hiển thị tiến độ pilot.
- Component diagram code-native và pilot Node 00 đã qua QC desktop/mobile.
- Node 07 và toàn bộ ngôn ngữ template matching đã qua QC chung.
- Đủ 14 location đã được tạo sau khi hai đầu pinhole/template được kiểm tra.

### Batch 1 · Ánh sáng vào máy

- Node 0–2: pinhole, projection, RGB.
- 3 location, 3 collectible, portal key art chính thức.
- Mở cổng khi cả nội dung, solution, validation và asset của ba node đều sẵn sàng.

### Batch 2 · Xưởng xử lý pixel

- Node 3–6: kernel, blur, edge, threshold.
- 4 location, 4 collectible và diagram cửa sổ trượt dùng chung.
- Giữ ảnh nhỏ để học sinh thấy rõ từng phép tính, không biến thành bảng điều khiển chuyên nghiệp.

### Batch 3 · Truy tìm mẫu

- Node 7–10: SAD/SSD, NCC, response map, NMS và OpenCV.
- 4 location, 4 collectible, heatmap và detection overlay dùng chung.
- Art phải minh họa cả kết quả đúng lẫn false positive; không thể hiện OpenCV như phép màu.

### Batch 4 · Không gian và chuyển động

- Node 11–13: perspective, tracking và capstone.
- 3 location, 3 collectible, perspective diagram và motion overlay.
- Camera thật là lựa chọn thêm; art và bài học mặc định vẫn chạy trọn vẹn với frame preset.

## Definition of done cho từng batch

- Asset trong suốt, silhouette đọc được khi hiển thị ở 120–160 px.
- Nguồn 520×520; bản giao tối ưu WebP/PNG và mục tiêu dưới 350 KB mỗi ảnh.
- Không chữ, logo, watermark, khuôn mặt hay chi tiết nhận diện trẻ em trong bitmap.
- UI qua `node lessons/audit-theme-colors.mjs`.
- Desktop và mobile không che node, HUD, toast hoặc dock phần thưởng.
- Mọi node hiển thị đều có bài học chạy được; không có cổng hoặc node click vào trang trống.
- Snapshot art được duyệt cạnh node 0 và node 7 pilot trước khi sản xuất hàng loạt.

## Prompt skeleton cho asset mới

```text
Kotopia storybook game location, [LOCATION MOTIF], one strong readable silhouette,
warm hand-painted fantasy workshop, visible [OPTICAL MECHANISM], small magical dust
accents, child-friendly, isolated transparent background, no text, no logo, no
interface, no photoreal camera, no people, centered 520x520 composition
```

Mỗi prompt chỉ đổi `LOCATION MOTIF` và `OPTICAL MECHANISM`; ánh sáng, góc nhìn,
silhouette và tỉ lệ phải giữ nhất quán với hai pilot đã duyệt.
