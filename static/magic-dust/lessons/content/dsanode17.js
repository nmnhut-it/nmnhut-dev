import { dsaNode } from "./dsa-builders.js";

export default dsaNode(17, {
  subtitle: "cập nhật tổng của một đoạn có độ dài cố định",
  machineName: "KHUNG QUAN SÁT",
  machineBlurb: "giữ một đoạn liên tiếp và cập nhật khi khung dịch sang phải",
  cells: [
    { quiz: { title: "Ôn hai con trỏ", questions: [
      { q: "Cho list tăng dần `[1, 5, 8, 12]` và cần tìm tổng 13. Hai đầu đang cho `1 + 12 = 13`. Bước đúng là gì?", a: ["Ghi nhận đã tìm thấy cặp", "Tăng `left` rồi mới kiểm tra", "Giảm `right` rồi mới kiểm tra"], correct: 0 },
    ] } },
    { npc: "Trạm này theo dõi ba tín hiệu liên tiếp. Nếu mỗi lần dịch sang phải mà cộng lại cả ba số, máy sẽ lặp lại nhiều phép cộng không cần thiết." },
    { npc: "Cửa sổ trượt cố định là một đoạn liên tiếp dài `size`. Khi cửa sổ dịch sang phải, tổng mới bằng tổng cũ trừ giá trị vừa rời đoạn rồi cộng giá trị vừa đi vào." },
    { code: `values = [3, 1, 4, 2, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    print(window_sum)
`, label: "window_demo.py", note: "RUN KIỂM CHỨNG: Cho sẵn năm giá trị và cửa sổ dài 3. Đoạn code cập nhật tổng của từng đoạn liên tiếp. Ba dòng OUTPUT phải lần lượt là `8`, `7`, `12`.", expectOut: { all: [/^8$/m, /^7$/m, /^12$/m], minLines: 3 }, solution: `values = [3, 1, 4, 2, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    print(window_sum)
` },
    { npc: "Bản dưới chỉ cộng giá trị mới mà không trừ giá trị đã rời khung. Vì vậy `window_sum` trở thành tổng của ngày càng nhiều số, không còn là tổng đúng ba số liên tiếp." },
    { code: `values = [3, 1, 4, 2, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum + values[right]
    print(window_sum)
`, label: "window_fix.py", note: "ĐỀ BÀI: Dữ liệu và `size = 3` đã cho sẵn. Hãy sửa dòng cập nhật để mỗi tổng chỉ thuộc về đúng ba phần tử liên tiếp. OUTPUT phải là ba dòng `8`, `7`, `12`.", expectOut: { all: [/^8$/m, /^7$/m, /^12$/m], minLines: 3 }, solution: `values = [3, 1, 4, 2, 6]
size = 3
window_sum = sum(values[0:size])
print(window_sum)

for right in range(size, len(values)):
    left_out = right - size
    window_sum = window_sum - values[left_out] + values[right]
    print(window_sum)
` },
    { code: `steps = [4, 2, 7, 1, 8, 3]
size = 3
best_sum = 0

# Tìm tổng lớn nhất của một đoạn gồm đúng size giá trị liên tiếp.

print(best_sum)
`, label: "best_window_task.py", note: "ĐỀ BÀI: Cho sẵn số bước của sáu ngày và cửa sổ dài 3 ngày. Hãy dùng cửa sổ trượt để tìm tổng lớn nhất của ba ngày liên tiếp. OUTPUT đúng là `16`. Bài này không đọc dữ liệu từ bên ngoài.", expectOut: /^16$/, solution: `steps = [4, 2, 7, 1, 8, 3]
size = 3
window_sum = sum(steps[0:size])
best_sum = window_sum

for right in range(size, len(steps)):
    left_out = right - size
    window_sum = window_sum - steps[left_out] + steps[right]
    if window_sum > best_sum:
        best_sum = window_sum

print(best_sum)
` },
    { code: `signals = [5, 5, 1, 1]
size = 2
window_sum = sum(signals[0:size])
count = 0

if window_sum >= 8:
    count = count + 1

# Kiểm tra các cửa sổ còn lại.

print(count)
`, label: "window_count_task.py", note: "ĐỀ BÀI: Cho sẵn bốn tín hiệu và cửa sổ dài 2. Hãy đếm số đoạn hai tín hiệu liên tiếp có tổng ít nhất 8. PROCESS dùng tổng cửa sổ được cập nhật; OUTPUT đúng là `1`.", expectOut: /^1$/, solution: `signals = [5, 5, 1, 1]
size = 2
window_sum = sum(signals[0:size])
count = 0

if window_sum >= 8:
    count = count + 1

for right in range(size, len(signals)):
    left_out = right - size
    window_sum = window_sum - signals[left_out] + signals[right]
    if window_sum >= 8:
        count = count + 1

print(count)
` },
    { checkpoint: { text: "Với cửa sổ cố định dài `size`, khi đầu phải tới index `right`, giá trị rời cửa sổ nằm ở `right - size`. Tổng mới được cập nhật bằng cách trừ giá trị rời đi và cộng giá trị tại `right`." } },
    { quiz: { title: "Cập nhật một cửa sổ", questions: [
      { q: "Cho `values = [2, 6, 1, 5]`, cửa sổ dài 2 và tổng cửa sổ đầu là 8. Khi dịch từ `[2, 6]` sang `[6, 1]`, phép cập nhật nào cho tổng đúng?", a: ["`8 - 2 + 1`", "`8 + 1`", "`8 - 6 + 1`"], correct: 0 },
      { q: "Một chương trình cần tìm tổng lớn nhất của đúng 4 ngày liên tiếp. Biến `size` nên giữ giá trị nào?", a: ["`4`", "Số ngày trong cả list", "Tổng của bốn ngày đầu"], correct: 0 },
    ] } },
  ],
});
