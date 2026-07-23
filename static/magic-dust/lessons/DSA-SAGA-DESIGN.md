# Saga Cấu trúc dữ liệu và Thuật toán

## Mục tiêu

Đây là saga độc lập dành cho học sinh đã hoàn thành Node 20 của saga Python
chính. Saga không dạy lại cú pháp `list`, vòng lặp, hàm hay `dict`. Mỗi bài
buộc học sinh chọn cách tổ chức dữ liệu, lần theo trạng thái, kiểm thử trường
hợp biên và so sánh lượng công việc của các cách giải.

Saga dùng Python thuần trong Pyodide, không dùng camera và không cần asset
hình ảnh riêng. Bản đồ giai đoạn đầu được dựng hoàn toàn bằng HTML/CSS.

## Phạm vi đã duyệt

- 24 node đường chính, chia thành 5 chương.
- 10 đảo luyện tập, mỗi đảo chỉ dùng kiến thức đã mở trên đường chính.
- 5 tháp tổng hợp, mỗi tháp ôn lại một chương và không dạy kiến thức mới.
- Mọi tiến độ dùng khóa `magicdust.dsa.*`; saga không ghi vào
  `magicdust.saga`.
- Node đầu tiên mở khi `magicdust.saga >= 21`, tức học sinh đã hoàn thành
  Node 20 về dictionary.

## Trình tự đường chính

1. Chọn cấu trúc dữ liệu; lần theo trạng thái; kiểm thử; đếm số bước.
2. Stack; Undo bằng stack; queue; set/dict; chuỗi liên kết.
3. Linear/binary search; selection sort; insertion sort; recursion; merge;
   merge sort; dự án bảng xếp hạng.
4. Hai con trỏ; cửa sổ trượt; tổng cộng dồn; dự án phân tích dữ liệu.
5. Cây; DFS; đồ thị/BFS; dự án dựng lại đường đi.

## Hợp đồng bài học

Node đi theo nhịp V2: ôn kiến thức cũ → định nghĩa trực tiếp → ví dụ đúng →
ví dụ sai và sửa → học sinh tự làm → checkpoint → quiz mức Thông hiểu trở
lên. Mỗi node có ít nhất ba bài code chạy thật. Mỗi bài code nêu rõ dữ liệu
cho sẵn hoặc INPUT thật, PROCESS cần luyện và OUTPUT chính xác.

Đảo có ít nhất bốn bài code và ba câu quiz. Tháp có mười tầng: trace, sửa lỗi,
tự viết, trường hợp biên, chọn cách giải và một bài tổng hợp. Đảo và tháp
không khóa đường chính.

## Danh sách đảo

| ID | Mở sau | Trọng tâm |
|---|---:|---|
| `edge-cases` | 2 | dữ liệu rỗng, một phần tử, trùng, không tìm thấy |
| `step-counter` | 3 | đếm so sánh và quan sát tốc độ tăng |
| `stack-puzzles` | 5 | push/pop, Undo, kiểm tra ngoặc |
| `dispatch-center` | 8 | queue, set/dict và nối lại liên kết |
| `binary-lab` | 9 | biên trái/phải và điều kiện dữ liệu đã sắp xếp |
| `sorting-arena` | 14 | so sánh bubble, selection, insertion, merge |
| `two-pointers` | 16 | cặp tổng, palindrome, giao hai list |
| `data-window` | 18 | sliding window, prefix sum và lệch index |
| `tree-expedition` | 21 | duyệt cây, đếm lá, độ sâu và DFS |
| `rescue-network` | 22 | adjacency list, BFS và vùng không thể tới |

## Tháp

Các tháp `reasoning`, `structures`, `search-sort`, `patterns`, `graphs` mở
sau node cuối của chương tương ứng. Hoàn thành tháp chỉ cấp phần thưởng DSA;
không mở khóa node đường chính.

## Định nghĩa hoàn thành

- Registry, khóa tiến độ và wrapper được kiểm thử bằng Node.
- Mọi content file qua `check-voice-terms.mjs` và `validate-content.mjs`.
- Mọi `solution` chạy qua matcher thật trong `test-content-solutions.mjs`.
- Bản đồ và trang bài học qua browser smoke ở desktop và mobile.

