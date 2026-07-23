# Cổng Saga và vòng Hook collectible

## Mục tiêu

Hai saga phụ dùng chung một vòng tiến bộ:

- **Toán 6 × Python:** ôn kiến thức Toán 6 bằng công cụ Python đã học.
- **50 bài Python:** các thử thách được tuyển chọn và viết lại từ tài liệu TICA.
- Hoàn thành một node lần đầu nhận **100 XP** và một collectible cố định.
- Tổng cộng 26 node, tối đa **2.600 XP lõi**. XP không đến từ việc chạy lại một bài.

## Hook an toàn cho học sinh nhỏ tuổi

Mô hình gốc có bốn bước Trigger → Action → Variable Reward → Investment. Ở đây,
“variable” là **nội dung collectible khác nhau**, không phải tỉ lệ may rủi.

1. **Trigger:** Cổng Saga sáng sau main Node 04; portal chỉ rõ node nào vừa mở và
   còn thiếu công cụ Python nào.
2. **Action:** học sinh chọn một trong hai saga và hoàn thành một node ngắn, có
   OUTPUT kiểm chứng. Không có streak ngày, đồng hồ đếm ngược hay phạt vì nghỉ.
3. **Reward:** mỗi node luôn cho 100 XP; collectible của node được công khai trước.
   Không có loot box, gacha, mua lượt hoặc phần thưởng ngẫu nhiên.
4. **Investment:** album dần đầy, đường đi sáng lên, XP mở các phiếu quà. Học sinh
   được chọn saga tiếp theo nhưng không thể bỏ qua điều kiện kiến thức.

Thiết kế này giữ cảm giác năng lực, lựa chọn và tiến bộ nhìn thấy được. Ba nhu cầu
autonomy, competence và relatedness của Self-Determination Theory đều liên quan
đến động lực trong trải nghiệm game-learning:
https://doi.org/10.1348/014466607X238797

Hook Model gốc:
https://www.nirandfar.com/how-to-manufacture-desire/

Nguyên tắc an toàn cho trẻ: không dùng dark pattern, FOMO hay nudge kéo dài thời
gian sử dụng; luôn có thể dừng và quay lại mà không mất tiến độ:
https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/

## Nhịp XP và quà

| Tổng XP | Phiếu mở khóa | Ý nghĩa |
|---:|---|---|
| 300 | Huy hiệu Khởi Hành | phản hồi sớm sau ba node |
| 700 | Phiếu Quà Đồng | đã duy trì qua nhiều nhóm kỹ năng |
| 1.200 | Phiếu Chọn Quà | có thể đạt bằng cách hoàn thành một saga |
| 1.800 | Phiếu Quà Bạc | đã phối hợp nhiều nhóm kỹ năng ở cả hai saga |
| 2.500 | Phiếu Quà Vàng | gần hoàn thành cả hai saga |

Phiếu được nhận một lần và không trừ XP. Mã phiếu chỉ lưu trên thiết bị; học sinh
đưa mã cho thầy cô/người lớn để đổi món quà đã thống nhất ngoài hệ thống. Đây
không phải cơ chế xác thực hay giao quà bằng backend.

## Quy tắc dữ liệu

- Completion của từng saga vẫn có namespace riêng.
- Award key: `magicdust.collectible.award.<track>.<node>`.
- Tổng XP được tính từ các award hợp lệ, không tin một biến tổng có thể cộng lặp.
- Gift key: `magicdust.collectible.gift.<gift-id>` chứa mã phiếu đã nhận.
- Portal đồng bộ XP cũ cho các node đã hoàn thành trước khi hệ thưởng xuất hiện.
- Xóa dữ liệu trình duyệt sẽ xóa tiến độ, XP và mã phiếu; UI phải nhắc học sinh
chụp/lưu mã sau khi nhận.

## Loss aversion không làm mất thành quả

XP lõi, collectible và phiếu đã nhận không bao giờ bị trừ. Cơ chế “portal nguội”
chỉ tác động tới **Bụi thưởng** của lần hoàn thành mới tiếp theo:

| Thời gian từ lần học gần nhất | Bụi thưởng của node mới |
|---:|---:|
| lần đầu | +20 |
| không quá 3 ngày | +30 |
| 4–7 ngày | +20 |
| 8–14 ngày | +10 |
| trên 14 ngày | +0 |

Hoàn thành một node sẽ đặt lại mốc hoạt động. Bụi thưởng là collectible phụ, không
được dùng để khóa kiến thức hoặc quyết định khả năng nhận quà. UI không dùng đồng
hồ đếm ngược, thông báo đe dọa, streak bị vỡ hay câu chữ gây tội lỗi; chỉ nói rằng
“năng lượng portal đã nguội” và mời học sinh nạp lại bằng một bài vừa sức.

## Nguồn saga 50 bài

PDF tham khảo được giữ ngoài thư mục deploy tại
`research/python-exercises-tica.pdf`. Nội dung saga phải viết lại theo giọng Magic
Dust, chọn bài phù hợp độ tuổi và công cụ Python đã học; không sao chép nguyên
văn hoặc phát tán lại PDF.
