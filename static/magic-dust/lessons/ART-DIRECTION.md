# Kotopia Storybook Art Direction

## Mục tiêu

Magic Dust dùng một ngôn ngữ hình ảnh hoạt hình cổ tích riêng: sáng, trẻ trung,
dễ đọc với học sinh 10–12 tuổi. Thế giới vẫn là Kotopia với đảo nổi, bụi phép,
hải đăng và công nghệ được làm như đồ thủ công; không mô phỏng studio hay họa
sĩ cụ thể.

## Hệ thống hình ảnh

- Nền hero: `assets/storybook/kotopia-world-v2.avif` là nguồn runtime ưu tiên;
  `<picture>` giữ WebP làm fallback.
- Nền cuộn: `assets/storybook/kotopia-sky-tile-v2.avif` lặp dọc dưới toàn bộ map;
  CSS `image-set()` giữ WebP làm fallback.
  tâm ảnh ít chi tiết để trail, node và chữ luôn dễ đọc.
- Node chính: `assets/storybook/node-islands/*.webp`; state locked/current/done do
  CSS xử lý bằng độ bão hòa, ánh viền và pin, không sửa silhouette.
- Đảo luyện tập: `assets/storybook/side-islands/*.webp`, luôn nhỏ hơn 45% node
  chính trên desktop và mobile.
- Boss/tower: `assets/storybook/island-dark-v2.webp`; tối hơn nhưng vẫn là cổ tích
  thiếu nhi, không dùng horror.
- Pip: `assets/storybook/pip-storybook-v2.webp`; turquoise, viền vàng ấm, silhouette
  rõ ở avatar nhỏ.

### Một ngôn ngữ art duy nhất

- Mọi hình xuất hiện trên saga map phải thuộc Kotopia storybook: gouache/watercolor
  sáng, khối tròn thân thiện, vật liệu thủ công, bảng màu turquoise–green–cream–
  coral–honey. Không trộn lại bộ đảo đá đen, tinh thể tím/cyan và kiến trúc gothic
  của art direction cũ.
- Mỗi địa điểm chỉ giữ **một WebP runtime**. Trạng thái `locked`, `current` và `done`
  được tạo bằng CSS (độ bão hòa, độ sáng, viền sáng và pin), không lưu thêm bản
  `-unlit` giống hệt. Quy tắc này giữ nguyên silhouette và giảm dung lượng.
- Node hoặc nhánh có chủ đề riêng phải thể hiện chủ đề bằng một cơ chế cụ thể có
  thể nhìn thấy: ví dụ hàng ngăn kéo cho list, cặp chìa khóa–ổ khóa cho dictionary,
  đường dẫn rẽ nhánh cho điều kiện. Không dùng chữ, số, logo Python hoặc ký hiệu UI
  để thay cho ý tưởng.
- Nhánh học dùng đảo workshop sáng và thân thiện. Tháp luyện của cùng chủ đề phải
  giữ lại các vật thể nhận diện đó nhưng có silhouette cao hơn, màu teal/indigo
  đậm hơn và ánh cửa sổ amber. Tháp được phép căng thẳng, nhưng không gothic,
  horror, gai nhọn hoặc cảm giác công trình của phản diện.
- Asset map chính thức nằm trong `assets/storybook/`. Không đưa lại asset từ
  `assets/world/node-islands/` hoặc `assets/world/side-islands/` vào đường render.

### Kích thước và ngân sách

- Ảnh map là WebP nền trong suốt, khung vuông `520x520`, chủ thể nằm gọn và đọc rõ
  ở 100–160px.
- Mục tiêu không quá 120 KB cho một địa điểm sau hậu kỳ. Không wire ảnh raw 1–8 MB vào
  runtime.
- Nền chroma chỉ tồn tại ở thư mục batch tạm; phải gỡ sạch và kiểm tra alpha trước
  khi copy asset vào thư mục chính thức.

### Định dạng, tải ảnh và spritesheet

- Dùng `art-post.py --format webp --quality 82 --size 520` cho node, đảo phụ,
  nhánh và tháp. Dùng AVIF khoảng quality 55 cho nền lớn không có alpha; luôn
  tạo WebP fallback cho nền.
- **Không ship PNG/JPG.** Toàn bộ ảnh runtime là WebP (hoặc AVIF cho nền lớn).
  Ảnh nhiều màu dùng lossy `quality 82`; ảnh đã giảm bảng màu (spritesheet boss,
  huy hiệu crest — dưới 4096 màu) dùng WebP **lossless** để viền pixel không bị
  nhòe. PNG chỉ tồn tại như file nguồn trong thư mục làm việc, không nằm trong
  `assets/` chính thức. Đợt chuyển 2026-07-23: 108 ảnh, 49.4 MB → 6.4 MB.
- Node `current` là ảnh map duy nhất được `loading="eager"` và
  `fetchpriority="high"`. Các node khác, toàn bộ đảo phụ và tháp dùng
  `loading="lazy"`, `fetchpriority="low"`, `decoding="async"`.
- Không ghép các địa điểm trên map vào một spritesheet. Benchmark 26 node cho
  thấy 26 WebP riêng là 1.65 MB, atlas WebP là 1.63 MB: chỉ giảm khoảng 1.1%
  nhưng buộc tải tất cả node ngay từ đầu. Spritesheet chỉ dùng cho nhiều frame
  của cùng một animation, ví dụ bộ token RPS.
- Mỗi đợt thay asset phải tăng `MAP_ASSET_VERSION` trong `saga.js` và version
  trong `cache-version.json`/`index.html` để production không giữ ảnh cũ.

## Design tokens

- Turquoise chính: `#169c9a`
- Coral phụ: `#ef826c`
- Honey highlight: `#fff1ad`
- Paper panel: `#fff9e9`
- Ink: `#183f49`
- Success green: `#2f9d62`

Code/editor và boss arena giữ nền teal đậm để đảm bảo contrast. Nội dung học,
quiz và checkpoint dùng paper panel; không đặt chữ trắng trực tiếp trên paper.

## Prompt set đã dùng

Tất cả asset dùng built-in image generation, taxonomy `illustration-story`:

1. `kotopia-world-v2`: panorama 16:9 của vương quốc đảo nổi vào buổi sáng, gouache
   và watercolor, turquoise–green–cream–coral–honey, khoảng trống cho UI; không
   text/logo/character, không cyberpunk, không mô phỏng studio hay họa sĩ.
2. `pip-storybook-v2`: mascot bụi phép turquoise hình tròn, tai lá, tay ngắn,
   comet tail, biểu cảm thân thiện, nền chroma `#ff00ff`; không sci-fi/hologram.
3. `island-main-v2`: đảo nổi có hải đăng kem, đồng cỏ, đường đá, crystal và suối
   bụi phép; isometric, silhouette rõ ở 160px, nền chroma `#ff00ff`.
4. `island-practice-v2`: workshop cottage thủ công, sách, bánh răng gỗ, hoa và
   bụi phép; silhouette rõ ở 100px, nền chroma `#ff00ff`.
5. `island-dark-v2`: tháp gai của Chúa tể Vô Định, nguy hiểm nhưng không horror,
   teal/indigo/amber, nền chroma `#ff00ff`.
6. `kotopia-sky-tile-v2`: nền dọc pale aqua–cream, watercolor cloud, landmark rất
   mờ, tâm ít chi tiết, mép trên/dưới gần cùng sắc độ để repeat-y.

## QC bắt buộc

Art dành riêng cho Saga Mắt Máy Kotopia được sản xuất theo từng batch trong
[`COMPUTER-VISION-ART-ROADMAP.md`](./COMPUTER-VISION-ART-ROADMAP.md). Các diagram
hình học, kernel, heatmap và detection overlay phải là SVG/canvas/code-native;
bitmap chỉ dùng cho location và collectible storybook.

Chạy server rồi chụp ma trận visual:

```powershell
python serve.py 8765
node lessons/test-storybook-visual.mjs
```

Ảnh nằm tại `test-results/storybook-qc/`. Phải kiểm tra saga desktop/mobile ở
top–middle–bottom; node 00, 10, 25; đảo IO và GRIDOPS; code, checkpoint, boss và
tower. Sau thay đổi map, chạy thêm:

```powershell
node lessons/test-saga-node-island-assets.mjs
node lessons/test-saga-side-island-assets.mjs
node lessons/test-saga-map-layout.mjs
```
