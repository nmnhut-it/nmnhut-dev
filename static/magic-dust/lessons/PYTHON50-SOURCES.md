# Nguồn và phạm vi chuyển thể của Đường Đua Python

## Nguồn chính

- Đơn vị: Học viện Công nghệ TICA.
- Tài liệu: *Tổng hợp 50 bài tập Python cơ bản - nâng cao*.
- Tác giả ghi trên tài liệu: Thầy Thịnh.
- Bản PDF: <https://www.tica.edu.vn/wp-content/uploads/2020/10/Ba%CC%80i-ta%CC%A3%CC%82p-python.pdf>
- Bản đối chiếu trong repo: `research/python-exercises-tica.pdf` (17 trang).

Saga không chứa 50 node. Đây là **14 chặng tuyển chọn**, được viết lại thành
bài mẫu, bài sửa lỗi và bài áp dụng chạy trong Magic Dust. UI phải dùng đúng
tên này để học sinh và phụ huynh không hiểu nhầm.

## Bảng đối chiếu

| Chặng | Bài nguồn | Mức chuyển thể | Quyết định sư phạm |
|---:|---:|---|---|
| 0 | 35 | Nhiều | Giữ máy tính cộng/trừ; tách phần viết hàm vì học sinh mới cần luyện chắc `if`/`elif`. |
| 1 | 5 | Sát nguồn | Giữ đơn giá 100 đồng, mốc 10.000 đồng và mức giảm 10%; thêm bài thử đúng tại mốc. |
| 2 | 29 | Có lược bớt | Giữ ba khoảng tốc độ 60/80 và diễn đạt kết quả thành không phạt/phạt nhẹ/phạt nặng; lược luật sinh nhật để tập trung vào ranh giới các nhánh. |
| 3 | 4 | Có giàn giáo | Giữ tối đa năm lượt; phần mẫu dùng số đích cố định thay cho số ngẫu nhiên để vòng lặp có thể kiểm chứng. |
| 4 | 1 | Sát nguồn | Dạy `% 10`, rồi áp dụng đúng yêu cầu in `YES` khi chữ số cuối là 7. |
| 5 | 23 | Sát nguồn | Giữ đủ quy tắc chia hết cho 4, 100 và 400; nhấn mạnh thứ tự trường hợp đặc biệt. |
| 6 | 25 | Sát nguồn | Liệt kê và đếm ước của một số nguyên dương. Mapping cũ sang Bài 12 đã bị bỏ vì không đúng đề. |
| 7 | 13 | Rút nhỏ | Thay việc in mọi số nguyên tố nhỏ hơn `n` bằng kiểm tra một số thông qua số lượng ước. Không gắn Bài 26 vì chưa dạy phân tích thừa số nguyên tố. |
| 8 | 3, 6, 7, 14 | Tổng hợp | Gom các bài quét list: tính tổng, đếm số chẵn và tìm cực trị không dùng giá trị khởi tạo đoán trước. |
| 9 | 10 | Sát nguồn | Tìm hai mức điểm cao nhất khi list có phần tử lặp; hai hạng phải có giá trị khác nhau. Mapping cũ sang Bài 8 là sai. |
| 10 | 9 | Có giàn giáo | Bỏ phần tử lặp; dùng sắp xếp đã học để các bản sao đứng cạnh nhau. Không gắn Bài 34 vì bài đó cấm `sort()`. |
| 11 | 40, 46 | Tổng hợp | Giữ bài đối xứng; dùng ý tưởng quét ký tự để luyện đếm. Các mapping cũ sang Bài 27, 28, 45 không khớp nội dung đã viết. |
| 12 | 11, 38, 39 | Nhiều | Giữ khung “viết hàm nhận dữ liệu và trả kết quả”; thay hình học/index chữ hoa bằng ví dụ số học ngắn. |
| 13 | 50 | Có lược bớt | Giữ thuật toán đếm tần suất; bỏ đọc/ghi file và cho sẵn list để chạy được trong trình duyệt. |

Metadata thực thi nằm trong `lessons/content/python50-curriculum.js`. Mỗi node
có `sourceExercises` và `sourceNote`; test bảo đảm số bài nằm trong khoảng
1–50 và chặng 9 trỏ đúng Bài 10.

## Độ khó đối với học sinh vừa học xong lớp 6

- Khi mới hoàn thành `if`/`elif`, chỉ chặng 0 được mở. Chặng này dùng phép cộng,
  trừ và hai nhánh; phù hợp để luyện lại kiến thức vừa học.
- Các chặng về `while`, `%`, `for`, list, chuỗi, hàm và dictionary chỉ mở sau
  node tương ứng ở saga chính. Chúng không nên xuất hiện như bài bắt buộc ngay
  từ đầu.
- Chặng 7, 9, 12 và 13 có tải nhận thức cao hơn. Chúng được đặt muộn và có bài
  mẫu trước bài sửa lỗi; không nên hạ điều kiện mở khóa.
- Chặng 3 dùng số đích cố định trong bài mẫu; yếu tố ngẫu nhiên chỉ nên quay lại
  ở một dự án mở rộng sau khi học sinh hiểu điều kiện dừng.

## Attribution và quyền sử dụng

UI ghi gọn “chuyển thể từ Bài … của TICA”, còn cuối bản đồ có link tới PDF.
Không chép lời giải hay toàn bộ đề nguyên văn vào game.

PDF công khai nhưng tài liệu không nêu giấy phép tái sử dụng. Việc trích nguồn
là cần thiết để minh bạch, nhưng không tự thay thế quyền sử dụng. Nếu sản phẩm
được phát hành thương mại hoặc phân phối rộng ngoài lớp học, chủ dự án nên xin
TICA xác nhận quyền chuyển thể.
