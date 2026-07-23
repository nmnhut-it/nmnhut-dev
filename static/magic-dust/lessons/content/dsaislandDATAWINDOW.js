import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = [4, 2, 7, 1, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    print(window_sum)
`, label: "data_window_fixed.py", note: "RUN KIỂM CHỨNG\nCho sẵn năm giá trị và cửa sổ dài 3; không có INPUT. PROCESS: giữ tổng của đúng ba phần tử liên tiếp, trừ giá trị rời đoạn và cộng giá trị mới đi vào. OUTPUT là `13`, `10`, `14`.", expectOut: { all: [{ minLines: 3 }, /^13$/, /^10$/, /^14$/] }, solution: `values = [4, 2, 7, 1, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    print(window_sum)
` },
  { code: `values = [3, 5, 2, 6]
prefix = [0, 3, 8, 10, 16]
left = 1
right = 3

range_sum = prefix[right] - prefix[left]
print(range_sum)
`, label: "data_range_edge_fix.py", note: "ĐỀ BÀI\nCho sẵn list tổng cộng dồn và đoạn từ index 1 đến 3, tính cả hai đầu; không có INPUT. Phép tính hiện bỏ sót giá trị tại index 3. Sửa index dùng ở đầu phải. OUTPUT đúng là `13`.", expectOut: /^13$/, solution: `values = [3, 5, 2, 6]
prefix = [0, 3, 8, 10, 16]
left = 1
right = 3

range_sum = prefix[right + 1] - prefix[left]
print(range_sum)
` },
  { code: `energy = [2, 4, 1, 3, 5]
prefix = [0]

for value in energy:
    prefix.append(prefix[-1] + value)

queries = [(0, 1), (1, 3), (2, 4)]

# In tổng của từng đoạn, tính cả left và right.
`, label: "data_multiple_queries.py", note: "ĐỀ BÀI\nCho sẵn năm mức năng lượng và ba truy vấn đoạn; không có INPUT. Mỗi cặp `(left, right)` tính cả hai đầu. PROCESS: dùng cùng list `prefix` để trả lời từng truy vấn. OUTPUT là `6`, `8`, `9`.", expectOut: { all: [{ minLines: 3 }, /^6$/, /^8$/, /^9$/] }, solution: `energy = [2, 4, 1, 3, 5]
prefix = [0]

for value in energy:
    prefix.append(prefix[-1] + value)

queries = [(0, 1), (1, 3), (2, 4)]

for left, right in queries:
    print(prefix[right + 1] - prefix[left])
` },
  { code: `steps = [5, 1, 4, 7, 2, 6]
size = 3
window_sum = sum(steps[0:size])
best_sum = window_sum
best_start = 0

# Tìm đoạn size ngày liên tiếp có tổng lớn nhất.
`, label: "data_best_window.py", note: "XƯỞNG DỮ LIỆU\nCho sẵn số bước của sáu ngày và `size = 3`; không có INPUT. PROCESS: dùng cửa sổ trượt cố định để tìm tổng lớn nhất và index bắt đầu của đoạn đó. OUTPUT đúng là `15 3`.", expectOut: /^15 3$/, solution: `steps = [5, 1, 4, 7, 2, 6]
size = 3
window_sum = sum(steps[0:size])
best_sum = window_sum
best_start = 0

for right in range(size, len(steps)):
    left_out = right - size
    window_sum = window_sum - steps[left_out] + steps[right]
    if window_sum > best_sum:
        best_sum = window_sum
        best_start = left_out + 1

print(best_sum, best_start)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ TRẠM CỬA SỔ DỮ LIỆU ✦",
  introHook: "Một báo cáo hỏi về đoạn liên tiếp cố định, báo cáo khác hỏi nhiều đoạn có hai đầu bất kỳ. Bạn sẽ chọn đúng mẫu rồi kiểm tra từng index.",
  reviewTitle: "Ôn hai mẫu tính tổng",
  reviewQuestions: [
    { q: "Cửa sổ dài 3 đang phủ `[4, 2, 7]` với tổng 13 rồi dịch sang `[2, 7, 1]`. Phép cập nhật nào cho tổng mới?", a: ["`13 - 4 + 1`", "`13 - 2 + 1`", "`13 + 1`"], correct: 0 },
    { q: "Cho `prefix = [0, 3, 8, 10, 16]`. Biểu thức nào lấy tổng từ index 1 đến 3, tính cả hai đầu?", a: ["`prefix[4] - prefix[1]`", "`prefix[3] - prefix[1]`", "`prefix[4] - prefix[3]`"], correct: 0 },
  ],
  definition: "Cửa sổ trượt cập nhật tổng của các đoạn liên tiếp cùng độ dài. Với tổng cộng dồn, `prefix[i]` là tổng của `i` phần tử đầu; tổng đoạn tính cả hai đầu bằng `prefix[right + 1] - prefix[left]`.",
  tasks,
  checkpoint: "Với đoạn có độ dài cố định, cửa sổ mới bằng tổng cũ trừ giá trị rời đi rồi cộng giá trị đi vào. Với nhiều truy vấn hai đầu bất kỳ, dùng `prefix[right + 1] - prefix[left]` để tính cả `left` và `right`.",
  quizTitle: "Chọn mẫu và giữ đúng biên",
  quizQuestions: [
    { q: "Một cảm biến cần tìm tổng lớn nhất của đúng 5 giây liên tiếp trong một list dài. Mẫu nào tránh cộng lại toàn bộ năm số sau mỗi lần dịch?", a: ["Cửa sổ trượt cố định", "Bảng tần suất", "DFS"], correct: 0 },
    { q: "Cho `prefix = [0, 2, 7, 11]`. Truy vấn từ index 0 đến 2, tính cả hai đầu, dùng biểu thức nào?", a: ["`prefix[3] - prefix[0]`", "`prefix[2] - prefix[0]`", "`prefix[3] - prefix[2]`"], correct: 0 },
  ],
  remember: "Hãy viết rõ đoạn có tính cả hai đầu hay không trước khi dùng index. Sai lệch một vị trí ở `right` có thể làm mọi truy vấn đều bỏ sót phần tử cuối.",
});

export default dsaIsland("data-window", { subtitle: "luyện cửa sổ cố định, tổng cộng dồn và truy vấn đoạn không lệch index", machineName: "TRẠM ĐO ĐOẠN DỮ LIỆU", machineBlurb: "cập nhật đoạn liên tiếp và trả lời nhiều truy vấn bằng các mốc tổng", cells });
