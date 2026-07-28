# Xưởng VFX Camera

Project trình duyệt dành cho học sinh lớp 5–6 và nhóm lớn hơn. Camera được xử
lý ngay trên thiết bị; chương trình không gửi hình ảnh lên máy chủ.

## Chạy

Mở một HTTP server tại thư mục gốc của repository, sau đó truy cập:

- `lessons/weather-lab/demo.html`: bản biểu diễn hoàn chỉnh.
- `lessons/weather-lab/index.html`: bản học sinh có bài tập RGB và thuật toán
  nhận dạng tổ hợp ngón.

Không mở trực tiếp bằng `file://`, vì camera trên trình duyệt cần secure context
hoặc `localhost`.

## INPUT và OUTPUT

- Chỉ giơ ngón trỏ, chạm vùng bắt đầu và vẽ một vòng khép kín → Nebulus.
- Vẽ nét ngang → blur; chữ V → sharpen; nét dọc → pixel; zigzag → cartoon.
- Mở hai lòng bàn tay cạnh nhau và giữ khoảng 0,8 giây → Thanh Liên.
- Khi sen đã nở, nói “Bùng nổ” hoặc bấm KÍCH NỔ → cánh hoa rơi toàn màn hình.

Đường sáng trên camera cho biết PROCESS đang ghi được bao nhiêu phần của nét
bùa; tên rune và hiệu ứng trên camera là OUTPUT. Màu lõi Nebulus có thể lấy từ
preset hoặc ô chọn màu tự do.

## VFX và giấy phép

Sprite sheet, flipbook và particle texture trong `brackeys-runtime/` được lấy
từ Brackeys' VFX Bundle, phát hành theo CC0. `LICENSE.txt` được giữ cùng asset.
Runtime chỉ chứa các file được dùng, không chép toàn bộ gói nguồn.

## Quay màn phép

Nút **Quay màn phép** ghép camera đã áp dụng blur, sharpen, pixel hoặc cartoon với
canvas VFX và tải xuống một file WebM. Chrome hoặc Edge mới được khuyến nghị.

## Kiểm tra

```bash
node lessons/test-weather-lab.mjs
node --check lessons/weather-lab/weather-core.js
```
