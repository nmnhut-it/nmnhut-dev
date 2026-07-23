import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = [5, 2, 8, 1, 7]
target = 7
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print(comparison_count)
`, label: "dsa_steps_linear_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn năm số và mục tiêu 7; không có INPUT. PROCESS: tăng biến đếm mỗi lần so sánh một phần tử với mục tiêu. OUTPUT đúng là `5`.", expectOut: /^5$/, solution: `values = [5, 2, 8, 1, 7]
target = 7
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print(comparison_count)
` },
  { code: `values = [2, 4, 6, 8]
comparison_count = 0

for left in range(len(values)):
    for right in range(left + 1, len(values)):
        comparison_count = comparison_count + 0

print(comparison_count)
`, label: "dsa_steps_pairs_fix.py", note: "ĐỀ BÀI\nCho sẵn bốn số; không có INPUT. PROCESS: sửa dòng cập nhật để đếm mỗi cặp vị trí khác nhau đúng một lần. Có 6 cặp nên OUTPUT đúng là `6`.", expectOut: /^6$/, solution: `values = [2, 4, 6, 8]
comparison_count = 0

for left in range(len(values)):
    for right in range(left + 1, len(values)):
        comparison_count = comparison_count + 1

print(comparison_count)
` },
  { code: `for size in [4, 8, 16]:
    linear_steps = size
    square_steps = size * size
    print(size, linear_steps, square_steps)
`, label: "dsa_steps_growth.py", note: "ĐỀ BÀI\nCho sẵn ba kích thước; không có INPUT. PROCESS: tính số bước theo hai mẫu `n` và `n * n`. OUTPUT là `4 4 16`, `8 8 64`, `16 16 256`.", expectOut: { all: [{ minLines: 3 }, /^4 4 16$/, /^8 8 64$/, /^16 16 256$/] }, solution: `for size in [4, 8, 16]:
    linear_steps = size
    square_steps = size * size
    print(size, linear_steps, square_steps)
` },
  { code: `values = [9, 4, 7, 2, 6, 1, 8, 3]

first = values[0]
last = values[len(values) - 1]
constant_steps = 2

print(first, last)
print(constant_steps)
`, label: "dsa_steps_constant.py", note: "XƯỞNG SO SÁNH\nCho sẵn list tám số; không có INPUT. PROCESS: đọc trực tiếp phần tử đầu và cuối rồi ghi số lần đọc. OUTPUT là `9 3` và `2`; số phần tử tăng không làm thao tác này cần quét cả list.", expectOut: { all: [{ minLines: 2 }, /^9 3$/, /^2$/] }, solution: `values = [9, 4, 7, 2, 6, 1, 8, 3]

first = values[0]
last = values[len(values) - 1]
constant_steps = 2

print(first, last)
print(constant_steps)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ XƯỞNG ĐẾM BƯỚC ✦", introHook: "Đồng hồ ở đây không đo giây. Nó đếm số lần thuật toán đọc, so sánh hoặc cập nhật dữ liệu, nhờ vậy tụi mình có thể so sánh hai cách giải một cách ổn định.",
  reviewTitle: "Đếm đúng thao tác", reviewQuestions: [{ q: "Một vòng `for value in values` chạy qua list có 6 phần tử đúng một lần. Nếu mỗi lượt có một phép so sánh, biến đếm tăng bao nhiêu lần?", a: ["6", "12", "36"], correct: 0 }],
  definition: "Số bước là số thao tác quan trọng của thuật toán. Một vòng quét thường tăng theo `n`; hai vòng cùng quét dữ liệu có thể tăng gần `n * n`. Với bài nhỏ, tụi mình đếm trực tiếp trước.", tasks,
  checkpoint: "Đặt biến đếm ngay tại thao tác cần đo. Một vòng quét list thường có số bước tăng theo `n`; hai vòng lồng nhau có thể tăng theo `n * n`.",
  quizTitle: "So sánh tốc độ tăng", quizQuestions: [
    { q: "Khi kích thước tăng từ 8 lên 16, số bước `n` tăng từ 8 lên 16. Số bước `n * n` tăng thế nào?", a: ["Từ 64 lên 256", "Từ 64 lên 128", "Từ 8 lên 32"], correct: 0 },
    { q: "Đoạn code chỉ đọc `values[0]` và `values[-1]`. Khi list dài gấp đôi, số lần đọc trực tiếp trong đoạn này thay đổi thế nào?", a: ["Vẫn là 2", "Tăng gấp đôi", "Tăng thành bình phương"], correct: 0 },
  ], remember: "Đừng đo thuật toán chỉ bằng cảm giác nhanh hay chậm. Hãy chọn thao tác quan trọng, đặt biến đếm đúng chỗ và quan sát số bước khi kích thước dữ liệu tăng.",
});

export default dsaIsland("step-counter", { subtitle: "đếm thao tác để so sánh các cách giải mà không phụ thuộc tốc độ máy", machineName: "ĐỒNG HỒ THAO TÁC", machineBlurb: "ghi lại mỗi lần đọc, so sánh hoặc xử lý một cặp dữ liệu", cells });
