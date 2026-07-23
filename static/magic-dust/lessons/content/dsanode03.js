import { dsaNode } from "./dsa-builders.js";

export default dsaNode(3, {
  subtitle: "đếm phép so sánh và nhận ra tốc độ tăng của số bước",
  machineName: "ĐỒNG HỒ SỐ BƯỚC",
  machineBlurb: "đo số thao tác chính khi lượng dữ liệu tăng lên",
  cells: [
    { quiz: { title: "Ôn kiểm thử có hệ thống", questions: [
      { q: "Luật đậu là `score >= 6`. Bộ ba nào kiểm tra sát ranh giới?", a: ["5, 6, 7", "1, 3, 9", "6, 12, 18"], correct: 0 },
      { q: "Một hàm tìm kiếm đã được thử với mục tiêu ở đầu list. Ca nào giúp kiểm tra hàm có đọc tới cuối list?", a: ["Đặt mục tiêu ở phần tử cuối", "Đặt lại mục tiêu ở phần tử đầu", "Dùng lại đúng dữ liệu cũ"], correct: 0 },
    ] } },
    { npc: "Hai chương trình có thể cho cùng kết quả nhưng làm số việc rất khác nhau. Mình đo điều đó bằng cách đếm thao tác chính, chẳng hạn số lần so sánh hai giá trị." },
    { npc: "O(1) làm lượng việc gần như cố định; O(n) tăng theo số phần tử; O(n²) thường có hai vòng cùng đi qua n vị trí. Các ký hiệu này mô tả tốc độ tăng, không phải số giây." },
    { code: `values = [4, 8, 1, 6]
target = 6
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print("FOUND", value == target)
print("COMPARISONS", comparison_count)
`, label: "count_linear_search.py", note: "RUN KIỂM CHỨNG\nCho sẵn bốn số và mục tiêu 6; không có INPUT. PROCESS: tìm lần lượt và tăng bộ đếm cho mỗi phép so sánh. OUTPUT là `FOUND True` và `COMPARISONS 4`.", expectOut: { all: [{ minLines: 2 }, /^FOUND True$/, /^COMPARISONS 4$/] }, solution: `values = [4, 8, 1, 6]
target = 6
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print("FOUND", value == target)
print("COMPARISONS", comparison_count)
` },
    { npc: "Bộ đếm phải tăng đúng lúc thao tác được thực hiện. Nếu chỉ tăng khi tìm thấy mục tiêu, nó không đếm các phép so sánh thất bại trước đó." },
    { code: `values = [4, 8, 1, 6]
target = 6
comparison_count = 0

for value in values:
    if value == target:
        comparison_count = comparison_count + 1
        break

print("COMPARISONS", comparison_count)
`, label: "counter_position_fix.py", note: "ĐỀ BÀI\nCho sẵn bốn số và mục tiêu ở cuối; không có INPUT. Bộ đếm hiện chỉ tăng khi so sánh thành công. Sửa vị trí dòng tăng bộ đếm để mỗi lần kiểm tra `value == target` đều được tính. OUTPUT đúng là `COMPARISONS 4`.", expectOut: /^COMPARISONS 4$/, solution: `values = [4, 8, 1, 6]
target = 6
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print("COMPARISONS", comparison_count)
` },
    { checkpoint: { text: "Để đo thuật toán, hãy chọn một thao tác chính rồi tăng biến đếm đúng một lần mỗi khi thao tác đó xảy ra. Với tìm kiếm lần lượt, thao tác chính thường là phép so sánh phần tử hiện tại với mục tiêu." } },
    { quiz: { title: "Đếm đúng thao tác", questions: [
      { q: "Tìm lần lượt số 7 trong `[2, 7, 9, 7]` và dừng ở lần gặp đầu tiên. Phép so sánh `value == 7` được thực hiện mấy lần?", a: ["2 lần", "1 lần", "4 lần"], correct: 0 },
      { q: "Tìm lần lượt số 5 trong `[1, 2, 3, 4]` nhưng không thấy. Nếu đếm mỗi phép so sánh với mục tiêu, bộ đếm cuối bằng bao nhiêu?", a: ["4", "0", "5"], correct: 0 },
    ] } },
    { npc: "Một vòng duyệt list thường tăng gần theo n. Hai vòng lồng nhau chạy mọi cặp vị trí thường tăng gần theo n²: khi n tăng gấp đôi, số cặp tăng khoảng bốn lần." },
    { code: `for size in [2, 4, 8]:
    pair_count = 0
    for left in range(size):
        for right in range(size):
            pair_count = pair_count + 1
    print(size, pair_count)
`, label: "quadratic_growth.py", note: "XƯỞNG PHÉP\nCho sẵn ba kích thước 2, 4, 8; không có INPUT. PROCESS: đếm số cặp vị trí do hai vòng `for` lồng nhau tạo ra. OUTPUT là `2 4`, `4 16`, `8 64`.", expectOut: { all: [{ minLines: 3 }, /^2 4$/, /^4 16$/, /^8 64$/] }, solution: `for size in [2, 4, 8]:
    pair_count = 0
    for left in range(size):
        for right in range(size):
            pair_count = pair_count + 1
    print(size, pair_count)
` },
    { checkpoint: { text: "O(1), O(n) và O(n²) mô tả tốc độ tăng của lượng việc khi n tăng. Một lần lấy phần tử theo index gần O(1), một vòng duyệt n phần tử gần O(n), còn hai vòng cùng duyệt n vị trí gần O(n²)." } },
    { quiz: { title: "Nhận ra tốc độ tăng", questions: [
      { q: "Một thuật toán chạy hai vòng lồng nhau, mỗi vòng đi qua toàn bộ n phần tử. Khi n tăng từ 5 lên 10, số cặp thao tác dự kiến đổi từ 25 thành bao nhiêu?", a: ["100", "50", "10"], correct: 0 },
      { q: "Chương trình chỉ đọc `values[0]` một lần dù list có 10 hay 10.000 phần tử. Mô tả trực giác nào phù hợp nhất?", a: ["O(1), vì lượng việc gần như cố định", "O(n), vì phải đọc mọi phần tử", "O(n²), vì có hai vòng lặp"], correct: 0 },
    ] } },
  ],
});
