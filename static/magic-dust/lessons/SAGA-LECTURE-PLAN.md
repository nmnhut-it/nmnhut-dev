# Kế hoạch: bài giảng trước mỗi địa điểm Saga

## Kết quả học tập mong muốn

Khi học sinh bấm một node, nhánh, tháp hoặc đảo phụ trên bản đồ, các em được
xem một bài giảng trực quan ngắn trước khi vào phần code. Bài giảng phải trả lời
được bốn câu hỏi theo đúng thứ tự:

1. Máy đang nhận dữ liệu gì từ thế giới thật hoặc từ chương trình?
2. Máy biến đổi dữ liệu đó qua những bước nào?
3. Bài toán nào đã được máy làm sẵn, và phần việc nào thuộc về học sinh?
4. OUTPUT nào chứng minh lời giải đúng?

Deck `fingertips-lesson.html` là mẫu chuẩn cho nhóm xử lý ảnh: ảnh camera →
tách nền → số hóa → ma trận → quy tắc cần viết → Pip tự chạy test.

## Phạm vi

- 26 node chính, từ `node00` đến `node25`.
- 6 nhánh học Python: standard I/O, operators, loop control, collections,
  dictionaries và errors.
- 8 tháp luyện tập, gồm 6 tháp đi sau nhánh, Inferno và tháp mặc định.
- Mọi đảo phụ có route trong `SIDE_ISLANDS`.
- Các Saga DSA, Vision và Math 6 dùng cùng cơ chế sau khi Saga Python ổn định.

## Luồng điều hướng an toàn

Giai đoạn đầu chỉ đổi link xuất phát từ bản đồ Saga:

```text
BẢN ĐỒ
  → lecture.html?id=<location-id>&practice=<exact-url>
  → các slide có animation và speaker notes
  → nút VÀO THỰC HÀNH
  → trang node / branch / tower / island hiện tại
```

Không redirect từ trang thực hành. Cách này giữ bookmark, URL test và chế độ
replay hoạt động như cũ. Với route dùng chung, query phải được giữ nguyên, ví
dụ `tower.html?course=operators`.

Tiến độ slide dùng namespace riêng:

```text
magicdust.lecture.<location-id>.v1 = 1
```

Runtime bài giảng không được ghi hoặc xóa `magicdust.saga`,
`magicdust.node.*.progress` hay `magicdust.sideisland.*`.

Khi học sinh đã xem xong, bản đồ vẫn mở bài giảng trước nhưng hiển thị nút
`VÀO THỰC HÀNH NGAY` bên cạnh nút `XEM LẠI`. Sau khi kiểm chứng với học sinh,
có thể đổi thành bỏ qua tự động; đây không phải hành vi của bản đầu.

## Kiến trúc nội dung

Một runtime dùng chung:

- `lecture.html`: Reveal.js shell, điều hướng bàn phím/chạm, nút về bản đồ.
- `lecture.css`: layout responsive và các primitive minh họa.
- `lecture.js`: đọc `id`, dựng slide, animation, speaker notes và CTA.
- `content/lecture-manifest.js`: ánh xạ ID ổn định tới tiêu đề, URL thực hành,
  mục tiêu và danh sách slide.
- `content/lectures/*.js`: dữ liệu của từng cụm bài; không sửa runtime.

Mỗi entry phải khai báo rõ:

```js
{
  id,
  title,
  practicePage,
  objective,
  given,
  machineDoes,
  learnerDoes,
  output,
  slides
}
```

Không suy ra `id` từ tên file. `lesson11v2.html` trở đi không có quy luật tên
content giống nhóm đầu; branch và tower còn dùng chung một file HTML.

## Sáu primitive minh họa dùng lại

1. **Pipeline:** INPUT → PROCESS → OUTPUT, sáng từng chặng.
2. **Hộp giá trị / ô nhớ:** giá trị đi vào hộp, được gán lại và đi ra.
3. **Con trỏ chạy code:** tô dòng đang chạy và cập nhật output cạnh bên.
4. **Đường rẽ quyết định:** dữ liệu đi qua điều kiện rồi vào đúng nhánh.
5. **Con trỏ quét collection:** chạy qua list, chuỗi hoặc ma trận và cập nhật
   biến đếm/tổng.
6. **Khung gọi hàm / dataflow:** input đi vào hàm, return đi ra nơi gọi.

Nhóm hình ảnh có thêm bốn primitive, vẫn dựng bằng HTML/SVG để số và mũi tên
luôn chính xác:

- ảnh ↔ lưới pixel crossfade;
- kính phóng đại một pixel;
- bộ kiểm tra bốn ô lân cận;
- vòng lặp INPUT → UPDATE → RENDER.

Ảnh raster chỉ dùng làm cảnh hoặc nguồn camera. Ma trận, pixel, nhãn, mũi tên,
trạng thái test và vùng highlight phải là HTML/SVG có thể animate.

## Cấu trúc một deck

Deck tiêu chuẩn dài 6–9 slide, mỗi slide chỉ mang một ý:

1. Trải nghiệm/hiện tượng cụ thể, chưa nêu thuật ngữ mới.
2. Toàn cảnh pipeline.
3. Phần máy đã làm sẵn.
4. Dữ liệu học sinh thật sự nhận được.
5. Quy tắc/pattern cần phát hiện bằng animation từng bước.
6. Một phản ví dụ để chặn hiểu lầm.
7. Code và hình thay đổi đồng bộ.
8. Pip tự chạy test, có PASS/FAIL và lý do.
9. Tóm tắt GIVEN → PROCESS → OUTPUT, rồi vào thực hành.

Nhánh học mới dùng slide 1–7 để dạy cú pháp trước khi luyện. Tháp và đảo phụ
không dạy cú pháp mới; deck của chúng chỉ ôn mẫu đã học và giải thích cách Pip
chấm tự động.

## Chia lô thực hiện

### Lô A — nền tảng Python

- node00–03: máy tính, từ, số, input/output.
- node04–10: điều kiện, biên, while, kiểu dữ liệu, logic, for/range.
- node11–17: luồng chạy, bộ nhớ, list, quét, grid, search/sort, chuỗi.
- node18–21: hàm, return, dictionary và dự án dữ liệu.

### Lô B — hình ảnh và tương tác

- node22–25.
- `islandAR`, `islandAR2`, `islandPHOTOLIGHTS`, `islandPIXELART`,
  `islandEDGE`, `islandIMAGEOPS`, `islandFINGERTIPS`.
- Trục giảng chung: thế giới/ảnh → dữ liệu máy → biểu diễn số → bài toán học
  sinh → tự động test.

### Lô C — particle và dự án

- `islandPARTICLELIFE`, `islandEMITTERLAB`, `islandEFFECTSTAGE`,
  `islandPROJECT1` và các node22/24/25 liên quan.
- Trục giảng chung: trạng thái của một hạt → thay đổi qua từng frame → nhiều
  hạt từ emitter → ghép vào vòng input/update/render.

### Lô D — branch, tower và các đảo luyện còn lại

- Branch: kiểm tra bài cũ → định nghĩa trực tiếp → ví dụ đúng → ví dụ sai →
  tự làm → checkpoint.
- Tower: nhắc pattern đã học → đọc đề GIVEN/PROCESS/OUTPUT → Pip chạy bộ test.
- Đảo phụ: chỉ dùng vốn từ đã mở trước `unlockAt`, không âm thầm dạy cú pháp mới.

Subagent chỉ sửa file nội dung của lô được giao. Runtime, manifest và routing
do agent chính giữ để tránh xung đột.

## Điều kiện nghiệm thu mỗi địa điểm

- Học sinh nhìn slide đầu hiểu ngữ cảnh trước khi thấy code.
- Có một sơ đồ chuyển đổi dữ liệu, không chỉ có lời kể.
- Animation thể hiện thứ tự xử lý, không chỉ trang trí.
- Nêu rõ GIVEN/preset, INPUT thật nếu có, PROCESS và OUTPUT.
- Không dùng thuật ngữ trước khi định nghĩa; biến code dùng English ASCII.
- Có ít nhất một phản ví dụ và một mô phỏng Pip chạy test.
- CTA giữ đúng route thực hành, kể cả query string.
- Desktop 1280×720 và mobile 390×844 không tràn/cắt nội dung chính.
- Bàn phím, chạm, nút điều hướng và `prefers-reduced-motion` đều hoạt động.
- Không có lỗi console và không thay đổi progress nếu chỉ xem slide.

## Kiểm thử bắt buộc

1. Test manifest: ID duy nhất, mọi URL tồn tại, mọi địa điểm Saga có lecture.
2. Test progress isolation: snapshot localStorage trước/sau deck.
3. Test route: đặc biệt branch/tower phải giữ nguyên `course`.
4. Browser test desktop/mobile cho runtime và từng primitive.
5. Voice/content validation trên mọi file tiếng Việt thay đổi.
6. Playtest từ bản đồ → slide → thực hành → chấm tự động → quay lại bản đồ.
7. Chạy các test Saga/map/network hiện có trước deploy.

## Thứ tự phát hành

1. Runtime + manifest + deck Fingertips làm mẫu chuẩn.
2. Nhóm hình ảnh/particle, vì đây là nơi sơ đồ tạo khác biệt lớn nhất.
3. Bốn cụm node chính.
4. Branch và tower.
5. Các đảo luyện còn lại.
6. Mở rộng runtime sang Vision, DSA và Math 6.

Mỗi lô chỉ nối vào Saga sau khi test và playtest lô đó đạt. Không phát hành
toàn bộ bằng placeholder hoặc slide chỉ có chữ.
