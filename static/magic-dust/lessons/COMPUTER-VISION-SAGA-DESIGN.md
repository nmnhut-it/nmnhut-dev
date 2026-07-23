# Saga Mắt Máy Kotopia

## Lời hứa học tập

Saga này đi từ mô hình camera lỗ kim đến template matching, OpenCV và theo dõi
chuyển động. Đây là một **learning saga** vì có dạy khái niệm mới, không phải một
đảo luyện tập. Tiến độ tách khỏi saga chính; mỗi node chỉ mở khi học sinh đã có
công cụ Python cần thiết.

Nguyên tắc bắt buộc: giải thích và chạy nguyên lý trước, sau đó mới ánh xạ sang
OpenCV. Học sinh không được kết thúc bài với một lời gọi thư viện mà không biết
ma trận đầu vào, phép tính trung gian và OUTPUT kiểm chứng.

Art và nhịp phát hành theo từng batch được chốt tại
[`COMPUTER-VISION-ART-ROADMAP.md`](./COMPUTER-VISION-ART-ROADMAP.md). Cổng chỉ mở
khi toàn bộ nội dung, runtime, test và asset của batch tương ứng đã sẵn sàng.

## Trạng thái triển khai

Ngày 2026-07-14, portal, bản đồ và đủ 14 node đã có route thật. Mỗi node có ba
slide học thuật dựng bằng SVG/HTML, một project Python có lời giải và kết quả
kiểm chứng, checkpoint, câu hỏi bảo vệ mức 2+ và phần thưởng 100 XP kèm
collectible. Toàn bộ node đã được đánh dấu `ready`; gate theo tiến độ saga chính
và thứ tự hoàn thành Vision Saga vẫn được giữ.

Node 00 dùng landmark camera lỗ kim riêng. Node 01–13 dùng 13 WebP 520 px tại
`assets/storybook/vision-saga/vision-nodeNN-location-v1.webp`. Tranh location
được tạo bằng ImageGen và tách nền; sơ đồ tia, ma trận, kernel, response, box,
phối cảnh và track vẫn là code-native để giữ đúng số liệu và palette runtime.

## Tiến trình 14 node

| # | Node | `mainRequired` | Cơ chế học và OUTPUT | Collectible |
|---:|---|---:|---|---|
| 0 | Phòng Tối Lỗ Kim | 5 | Tính chiều cao ảnh từ chiều cao vật, khoảng cách vật và khoảng cách màn; đổi khoảng cách để thấy vật xa cho ảnh nhỏ hơn, ảnh thật bị đảo chiều | Hộp Tối Bỏ Túi |
| 1 | Từ Điểm 3D Đến Điểm Ảnh | 7 | Tính `u = focal * x / z + center_u`, `v = focal * y / z + center_v`; phân biệt `(u, v)` với `image[row][col]` | Thước Tiêu Cự |
| 2 | Ảnh Là Ma Trận RGB | 16 | Đọc ảnh mẫu nhỏ, lấy một pixel RGB và tạo ảnh xám; rút ngắn phần ôn nếu đã xong đảo RGB | Tinh Thể RGB |
| 3 | Cửa Sổ Trượt Và Kernel | 16 | Trích cửa sổ 3×3, tính số vị trí hợp lệ và thực hiện phép nhân-cộng tại một pixel; nêu rõ cách xử lý biên | Khung Quan Sát 3×3 |
| 4 | Lọc Nhiễu Bằng Blur | 16 | Dùng kernel trung bình, so pixel trước/sau và so kernel 1×1, 3×3, 5×5 để thấy cả giảm nhiễu lẫn mất chi tiết | Hạt Khử Nhiễu |
| 5 | Máy Tìm Viền | 16 | Tính thay đổi trái-phải, trên-dưới hoặc Sobel; thử vùng đồng màu, đường thẳng và nhiễu | Bút Vẽ Viền |
| 6 | Threshold Và Phân Đoạn | 16 | Tạo mask 0/1, đổi threshold, đếm foreground; quan sát thất bại khi ánh sáng không đều | Mặt Nạ Tiền Cảnh |
| 7 | Truy Tìm Mẫu Bằng SAD/SSD | 20 | Trượt template trên scene nhỏ, tính SAD và SSD, in vị trí có điểm thấp nhất và khoanh vùng | Mảnh Mẫu SAD |
| 8 | NCC Và Bản Đồ Điểm Khớp | 20 | So SAD/SSD với tương quan chuẩn hóa khi ảnh sáng hơn; tạo response map và heatmap | Bản Đồ Đáp Ứng |
| 9 | Nhiều Kết Quả Và NMS | 20 | Lọc response theo ngưỡng, giữ cực đại cục bộ; thử họa tiết lặp, đổi góc, scale và ánh sáng | Ấn Cực Đại |
| 10 | OpenCV Không Phải Hộp Đen | 20 | Chạy cùng dữ liệu qua bản tự viết và `cv2.matchTemplate`; hai bản phải tìm cùng vị trí | Chìa Khóa OpenCV |
| 11 | Nắn Phối Cảnh | 20 | Ghép bốn góc nguồn-đích, dùng perspective transform và quan sát nội suy pixel | Khung Phối Cảnh |
| 12 | Từ Frame Đến Chuyển Động | 24 | Trừ các frame preset, threshold vùng đổi, tìm tâm box và nối thành track; optical flow là phần mở rộng | La Bàn Chuyển Động |
| 13 | Trạm Săn Ấn Cổ | 25 | Capstone: grayscale → blur → response → threshold → NMS → box → track; báo confidence và trình bày một ca thất bại | Kính Thị Giác Kotopia |

Mỗi node là một lab khoảng 15–25 phút, không dùng nhịp nhiều đoạn RUN nhỏ của
saga Python. Nhịp chuẩn là: slide mô hình và ký hiệu → suy ra công thức hoặc đo
dữ liệu → một project hoàn chỉnh → checkpoint kỹ thuật → bảo vệ project bằng
câu hỏi mức 2+ → collectible. Tên biến học sinh thấy dùng English ASCII:
`image`, `template`, `kernel`, `row`, `col`, `score`, `response`, `detections`,
`track`.

## Template matching và OpenCV

Trình tự không được đảo:

```text
ảnh là ma trận
→ cửa sổ trượt
→ SAD / SSD
→ trực giác NCC
→ response heatmap
→ threshold
→ local maximum / NMS
→ thí nghiệm thất bại
→ cv2.matchTemplate
```

Node OpenCV ánh xạ từng cơ chế:

- vòng trượt → `cv2.matchTemplate`;
- SAD/SSD → họ phương pháp `TM_SQDIFF`, trong đó điểm thấp tốt hơn;
- NCC → `TM_CCOEFF_NORMED`, trong đó điểm cao tốt hơn;
- response → ma trận điểm;
- chọn vị trí → `minMaxLoc`, threshold và NMS.

Template matching chỉ so pixel với một mẫu cố định. Nó không “hiểu” vật thể và
dễ sai khi mẫu đổi tỉ lệ, xoay, xiên, đổi sáng mạnh hoặc nằm trong họa tiết lặp.
Học sinh phải nhìn ít nhất một false positive và một false negative.

## Hợp đồng runtime

Repo dùng Pyodide 0.26.4. Runtime nhận metadata package từ bài học và gọi
`pyodide.loadPackage()` trong worker. Node 10 khai báo:

```js
pythonPackages: ["opencv-python"]
```

Worker chỉ tải package ở node OpenCV và giữ metadata để tải lại nếu worker phải
reboot. Node 0–9 dùng list nhỏ và Python thuần. Node 10 có bản SSD thuần Python
làm phép đo độc lập và cũng là fallback nếu CDN OpenCV không tải được. Không dùng
`cv2.imshow()` hay `cv2.VideoCapture()` trong worker.

## Camera và quyền riêng tư

- Ảnh và chuỗi frame preset là đường mặc định; từ chối camera không mất XP, Bụi
  thưởng hoặc collectible.
- Chỉ xin quyền khi học sinh chủ động chọn camera; hiện rõ “CAMERA ĐANG BẬT” và
  dừng media track ngay khi rời cell.
- Không lưu frame vào localStorage, không upload, không giữ metadata tệp.
- Không dạy nhận diện khuôn mặt, danh tính, cảm xúc hay thuộc tính cá nhân.
- Capstone live chỉ dùng marker in hoặc đồ vật; không yêu cầu quay mặt.
- Phiên bản đầu chỉ lấy một snapshot kích thước nhỏ, không truyền video liên tục
  vào Python.

## Nguồn chuẩn

- [OpenCV: pinhole camera model và camera matrix](https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html)
- [OpenCV: convolution, averaging và Gaussian blur](https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html)
- [OpenCV: threshold](https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html)
- [OpenCV: Canny pipeline](https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html)
- [OpenCV: template matching và nhiều kết quả](https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html)
- [OpenCV: công thức `matchTemplate`](https://docs.opencv.org/4.x/de/da9/tutorial_template_matching.html)
- [OpenCV: perspective transform](https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html)
- [OpenCV: optical flow](https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html)
- [Pyodide 0.26.4: packages in Pyodide](https://pyodide.org/en/0.26.4/usage/packages-in-pyodide.html)
- [AI4K12: Perception](https://ai4k12.org/big-idea-1-overview/)
- [W3C: Media Capture privacy and security](https://www.w3.org/TR/mediacapture-streams/)
- [FTC: COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [ICO: nudge techniques and children](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/)
