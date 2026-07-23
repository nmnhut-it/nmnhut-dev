import { dsaTower } from "./dsa-builders.js";
import { makeTowerCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `numbers = [1, 4, 6, 8, 11]
target = 12
left = 0
right = len(numbers) - 1
found = False

# Dùng hai con trỏ để kiểm tra có cặp đạt target hay không.

print(found)
`, label: "TẦNG 1 · pair_sum.py", note: "ĐỀ BÀI: List tăng dần và `target = 12` đã cho sẵn; không có INPUT thật. PROCESS dùng hai con trỏ để kiểm tra một cặp có tổng bằng mục tiêu. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `numbers = [1, 4, 6, 8, 11]
target = 12
left = 0
right = len(numbers) - 1
found = False

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        found = True
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1

print(found)
` },
  { code: `text = "kotok"
left = 0
right = len(text) - 1
is_palindrome = True

# Kiểm tra text bằng hai con trỏ.

print(is_palindrome)
`, label: "TẦNG 2 · palindrome.py", note: "ĐỀ BÀI: Chuỗi `kotok` đã cho sẵn; bài không đọc INPUT bên ngoài. PROCESS so các cặp ký tự từ hai phía để kiểm tra đối xứng. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `text = "kotok"
left = 0
right = len(text) - 1
is_palindrome = True

while left < right:
    if text[left] != text[right]:
        is_palindrome = False
        break
    left = left + 1
    right = right - 1

print(is_palindrome)
` },
  { code: `values = [2, 7, 1, 5, 4]
size = 3
best_sum = 0

# Tìm tổng lớn nhất của đúng size phần tử liên tiếp.

print(best_sum)
`, label: "TẦNG 3 · best_window.py", note: "ĐỀ BÀI: List và cửa sổ dài 3 đã cho sẵn; không có INPUT thật. PROCESS dùng cửa sổ trượt cố định để tìm tổng lớn nhất. OUTPUT đúng là `13`.", expectOut: /^13$/, solution: `values = [2, 7, 1, 5, 4]
size = 3
window_sum = sum(values[0:size])
best_sum = window_sum

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    if window_sum > best_sum:
        best_sum = window_sum

print(best_sum)
` },
  { code: `values = [5, 1, 4, 4, 2]
size = 2
limit = 8
count = 0

# Đếm các cửa sổ có tổng ít nhất limit.

print(count)
`, label: "TẦNG 4 · count_windows.py", note: "ĐỀ BÀI: List, cửa sổ dài 2 và `limit = 8` đã cho sẵn; bài không đọc INPUT. PROCESS cập nhật tổng cửa sổ để đếm các đoạn đạt ngưỡng. OUTPUT đúng là `1`.", expectOut: /^1$/, solution: `values = [5, 1, 4, 4, 2]
size = 2
limit = 8
window_sum = sum(values[0:size])
count = 0

if window_sum >= limit:
    count = count + 1
for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    if window_sum >= limit:
        count = count + 1

print(count)
` },
  { code: `values = [3, 1, 6, 2]
prefix = [0]

# Tạo prefix cho values.

print(prefix)
`, label: "TẦNG 5 · build_prefix.py", note: "ĐỀ BÀI: List bốn số đã cho sẵn; không có INPUT bên ngoài. PROCESS tạo tổng cộng dồn bắt đầu bằng 0. OUTPUT đúng là `[0, 3, 4, 10, 12]`.", expectOut: /^\[0, 3, 4, 10, 12\]$/, solution: `values = [3, 1, 6, 2]
prefix = [0]

for value in values:
    prefix.append(prefix[-1] + value)

print(prefix)
` },
  { code: `prefix = [0, 3, 4, 10, 12]
queries = [(0, 1), (1, 3)]

# In tổng của từng đoạn, tính cả hai đầu.
`, label: "TẦNG 6 · range_queries.py", note: "ĐỀ BÀI: `prefix` và hai truy vấn `(left, right)` đã cho sẵn; bài không đọc INPUT. PROCESS dùng hiệu hai giá trị trong `prefix`, tính cả hai đầu đoạn. OUTPUT phải là `4` rồi `9`.", expectOut: { all: [/^4$/m, /^9$/m], minLines: 2 }, solution: `prefix = [0, 3, 4, 10, 12]
queries = [(0, 1), (1, 3)]

for left, right in queries:
    print(prefix[right + 1] - prefix[left])
` },
  { code: `signals = [2, 3, 2, 5, 2, 1]
size = 3

# In số lần tín hiệu 2 xuất hiện và tổng cửa sổ lớn nhất.
`, label: "TẦNG 7 · frequency_window.py", note: "ĐỀ BÀI: Dãy tín hiệu và cửa sổ dài 3 đã cho sẵn; không có INPUT thật. PROCESS dùng `dict` tần suất và cửa sổ trượt. OUTPUT phải là `3` rồi `10`.", expectOut: { all: [/^3$/m, /^10$/m], minLines: 2 }, solution: `signals = [2, 3, 2, 5, 2, 1]
size = 3

frequency = {}
for signal in signals:
    frequency[signal] = frequency.get(signal, 0) + 1

window_sum = sum(signals[0:size])
best_sum = window_sum
for right in range(size, len(signals)):
    left_out = right - size
    window_sum = window_sum - signals[left_out] + signals[right]
    if window_sum > best_sum:
        best_sum = window_sum

print(frequency[2])
print(best_sum)
` },
  { code: `energy = [4, 1, 3, 2, 6]
queries = [(0, 2), (2, 4), (1, 1)]

# Tạo prefix rồi in tổng của ba truy vấn.
`, label: "TẦNG 8 · prefix_report.py", note: "ĐỀ BÀI: Dãy năng lượng và ba truy vấn đã cho sẵn; bài không đọc INPUT bên ngoài. PROCESS chuẩn bị một list tổng cộng dồn rồi trả lời từng đoạn, tính cả hai đầu. OUTPUT phải là `8`, `11`, `1`.", expectOut: { all: [/^8$/m, /^11$/m, /^1$/m], minLines: 3 }, solution: `energy = [4, 1, 3, 2, 6]
queries = [(0, 2), (2, 4), (1, 1)]
prefix = [0]

for value in energy:
    prefix.append(prefix[-1] + value)

for left, right in queries:
    print(prefix[right + 1] - prefix[left])
` },
];

export default dsaTower("patterns", {
  subtitle: "tám tầng ôn hai con trỏ, cửa sổ và tổng cộng dồn",
  machineName: "THÁP MẪU XỬ LÝ LIST",
  machineBlurb: "luyện chọn và dùng lại ba mẫu xử lý trên những bộ dữ liệu nhỏ",
  cells: makeTowerCells({
    introTitle: "THÁP IV · MẪU XỬ LÝ LIST",
    introHook: "Tám tầng này chỉ ghép lại các mẫu đã học ở chương trước. Dữ liệu đều được cho sẵn để bạn tập trung chọn đúng cách xử lý và kiểm tra OUTPUT.",
    reviewTitle: "Nhận ra mẫu qua dữ liệu",
    reviewQuestions: [
      { q: "Cho list tăng dần `[1, 4, 7, 10]` và cần biết có cặp nào tổng bằng 11. Mẫu nào phù hợp?", a: ["Hai con trỏ", "Tổng cộng dồn", "Đếm tần suất"], correct: 0 },
      { q: "Một máy cần tổng lớn nhất của đúng 4 phút liên tiếp. Mẫu nào tránh cộng lại cả đoạn sau mỗi lần dịch?", a: ["Cửa sổ trượt cố định", "Binary search", "Selection sort"], correct: 0 },
    ],
    tasks,
    checkpoint: "Hai con trỏ thu hẹp dữ liệu từ hai phía; cửa sổ trượt cập nhật một đoạn có độ dài cố định; tổng cộng dồn chuẩn bị `prefix` để trả lời nhiều truy vấn bằng `prefix[right + 1] - prefix[left]`.",
    quizTitle: "Chọn đúng phép cập nhật",
    quizQuestions: [
      { q: "Cửa sổ dài 3 đang phủ `[2, 5, 1]` với tổng 8, rồi dịch sang `[5, 1, 4]`. Phép cập nhật nào đúng?", a: ["`8 - 2 + 4`", "`8 + 4`", "`8 - 5 + 4`"], correct: 0 },
      { q: "Cho `prefix = [0, 2, 7, 8, 12]`. Tổng từ index 1 đến index 3, tính cả hai đầu, dùng biểu thức nào?", a: ["`prefix[4] - prefix[1]`", "`prefix[3] - prefix[1]`", "`prefix[4] - prefix[3]`"], correct: 0 },
    ],
    remember: "Trước khi viết code, hãy hỏi dữ liệu có thứ tự không, đoạn cần xét có độ dài cố định không, và có bao nhiêu truy vấn. Ba câu trả lời đó thường chỉ ra hai con trỏ, cửa sổ trượt hay tổng cộng dồn.",
  }),
});
