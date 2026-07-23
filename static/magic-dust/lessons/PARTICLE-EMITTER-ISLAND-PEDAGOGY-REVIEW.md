# Review sư phạm: đảo Particle và Emitter

## Vị trí trong lộ trình

- `islandPARTICLELIFE` mở ở `unlockAt: 23`, sau Node 22.
- `islandEMITTERLAB` mở ở `unlockAt: 25`, sau Node 24.
- Hai đảo dùng sân khấu xem trước và dữ liệu gán sẵn, không đọc INPUT từ camera.

## Đảo Vòng Đời Hạt: trải nghiệm trước, đặt tên sau

Đảo không bắt đầu bằng định nghĩa dictionary. Học sinh tự hình thành khái niệm qua chuỗi sau:

1. Tạo một dictionary `image`, nhưng chưa thấy hình.
2. Gọi `draw_particle_frame([image])` để nhìn thấy đúng một hình.
3. Dùng `for` và `delay` để xem nhiều frame giống nhau; học sinh nhận ra vòng lặp không tự tạo chuyển động.
4. Thêm `move_image(...)` sau mỗi lần vẽ và nhìn thấy hình đổi vị trí.
5. Thêm `scale_image(...)` và nhìn thấy hình nhỏ dần.
6. Thêm `fade_image(...)`, dùng `life` làm số frame và nhìn thấy hình mờ dần rồi kết thúc.
7. Lúc này bài mới gọi cơ chế vừa tạo là particle và đối chiếu từng key với thay đổi đã quan sát.
8. Tạo tám particle có vận tốc khác nhau, rồi cập nhật cả list để thành pháo hoa.

| Khái niệm hoặc thuật ngữ | Học sinh trải nghiệm trước khi gọi tên | Trạng thái |
|---|---|---|
| Dictionary hình | Tạo dữ liệu rồi chạy riêng dòng vẽ | Được nhìn thấy trực tiếp |
| Frame | Vẽ một lần, rồi vẽ năm lần | Được so sánh trực tiếp |
| `delay` | Giữ từng frame đủ lâu để quan sát | Được trải nghiệm |
| Move, `x/y`, `vx/vy` | Thêm lời gọi move và nhìn hình đổi vị trí | Được trải nghiệm trước khi khái quát |
| Scale, `size` | Thêm lời gọi scale và nhìn hình nhỏ dần | Được trải nghiệm trước khi khái quát |
| Fade, `alpha` | Giảm alpha và nhìn hình mờ dần | Được trải nghiệm trước khi khái quát |
| Lifespan, `life` | Dùng `life` làm số lượt của vòng frame | Được trải nghiệm trước khi khái quát |
| Particle | Chỉ đặt tên sau khi move, scale và fade đã chạy | Không còn là định nghĩa trừu tượng |
| Pháo hoa | Tám hình cùng điểm đầu, khác vận tốc | Học sinh tự lắp từ nhiều particle |

`start_particle_stage()` được bổ sung để mở sân khấu hạt mà không xin quyền camera. `draw_particle_frame()` hiển thị chính xác list dictionary do code học sinh cung cấp; engine không tự di chuyển hoặc tự tạo thêm hạt.

## Xưởng Bộ Phát Hạt

| Khái niệm hoặc thuật ngữ | Tình trạng trước đảo | Cách xử lý trong đảo | Kết luận |
|---|---|---|---|
| Bộ phát hạt / emitter | Node 22 và trải nghiệm pháo hoa ở đảo trước | Quiz phân biệt EMIT–UPDATE–RENDER | Ôn tập |
| Phát theo đợt và phát liên tục | Node 22, Node 24 | Chọn kiểu phát theo tình huống | Ôn tập |
| Điểm phát và trạng thái ban đầu | Đảo trước vừa tạo tám hạt cùng điểm | Tạo các dictionary cùng `x/y` | Ôn tập |
| `count` | Node 24 | Đổi số hạt trong một đợt | Ôn tập |
| `rate` | Node 24 có cơ chế nhưng chưa đặt tên tham số | Định nghĩa là số hạt mới mỗi frame trước bài tập | Dạy trước khi dùng |
| `spread` | Đảo trước có nhiều hướng nhưng chưa đặt tên tham số | Định nghĩa là khoảng cách giữa các vận tốc trước bài tập | Dạy trước khi dùng |
| `max_particles` và ngân sách hạt | Chưa có trong tuyến chính | Định nghĩa giới hạn tối đa trước bài ngân sách | Dạy trước khi dùng |
| Slice list `[-max_particles:]` | Node 17 dạy slice trên chuỗi | Giải thích cách lấy các ô cuối ngay trước bài sửa | Dạy tại chỗ |
| `palette` | Chưa dùng như biến điều khiển | Định nghĩa là list màu trước bài cuối | Dạy trước khi dùng |
| `pattern` | Học sinh đã biết list vận tốc | Định nghĩa là list các cặp `[vx, vy]` | Dạy trước khi dùng |

## Kiểm tra tải nhận thức

- Bài particle chỉ yêu cầu thêm một dòng mới ở mỗi bước: draw → move → scale → fade → update.
- Các hàm helper có thân hàm ngắn và hiển thị ngay trong code; cơ chế không bị giấu trong engine.
- Sau mỗi thay đổi đều có OUTPUT số và thay đổi trực quan trên sân khấu.
- Quiz hỏi dự đoán hình sẽ thay đổi thế nào, không hỏi học thuộc định nghĩa particle.
- Bài emitter được đặt sau khi học sinh đã tự tạo một pháo hoa tám hạt.

## Điểm đã sửa sau review

1. Viết lại toàn bộ đảo particle theo hướng trải nghiệm trước, đặt tên sau.
2. Thêm sân khấu hạt không dùng camera và hỗ trợ alpha nhìn thấy được.
3. Bỏ phép trọng lực chưa được dạy khỏi dự án emitter.
4. Giải thích slice trên list trước bài ngân sách hạt.
5. Không dùng cú pháp nối list màu chưa được học.
6. Định nghĩa `rate`, `spread`, `max_particles`, `palette` và `pattern` trước khi yêu cầu học sinh dùng.
7. Ép tiến trình PhoBERT đọc stdin bằng UTF-8 để audit tiếng Việt không bị lỗi trên Windows.

Kết luận: học sinh nhìn thấy một hình biến đổi qua từng dòng code trước khi gặp định nghĩa particle; không còn cơ chế nào xuất hiện trong nhiệm vụ trước khi được trải nghiệm hoặc giải thích.
