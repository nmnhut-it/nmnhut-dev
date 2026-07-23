import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ XƯỞNG CHỌN NHỎ NHẤT ✦", hook: "Mỗi lượt, chiếc kẹp tìm phần tử nhỏ nhất trong phần chưa xếp và đưa nó tới đúng vị trí đầu tiên còn trống.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn binary search", questions: [
    { q: "Binary search tìm `7` trong list tăng dần `[1, 4, 7, 9, 12]`. Ngay lần đầu, `middle` trỏ tới `7`. Máy cần bao nhiêu lần so sánh?", a: ["1", "3", "5"], correct: 0 },
    { q: "List nào đáp ứng điều kiện để binary search tìm số theo thứ tự tăng dần?", a: ["`[2, 5, 8, 11]`", "`[8, 2, 11, 5]`", "`[5, 2, 8, 11]`"], correct: 0 },
  ] } },
  { npc: "Selection sort chia list thành phần đã xếp bên trái và phần chưa xếp bên phải. Tại mỗi `start`, thuật toán tìm index của giá trị nhỏ nhất trong phần chưa xếp, rồi đổi chỗ hai phần tử." },
  { code: `values = [7, 3, 5, 1]

for start in range(len(values)):
    min_index = start
    for index in range(start + 1, len(values)):
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
`, label: "selection_sort_demo.py", note: "RUN KIỂM CHỨNG\nList `[7, 3, 5, 1]` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: selection sort chọn giá trị nhỏ nhất còn lại cho từng vị trí. OUTPUT đúng là `[1, 3, 5, 7]`.", expectOut: /^\[1, 3, 5, 7\]$/, solution: `values = [7, 3, 5, 1]

for start in range(len(values)):
    min_index = start
    for index in range(start + 1, len(values)):
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
` },
  { npc: "Khi bắt đầu một lượt mới, `min_index` phải là chính `start`. Nếu cứ đặt nó về index 0, thuật toán sẽ quay lại phần đã xếp và có thể kéo giá trị nhỏ nhất ra khỏi vị trí đúng." },
  { code: `values = [4, 2, 3, 1]

for start in range(len(values)):
    min_index = 0
    for index in range(start + 1, len(values)):
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
`, label: "selection_start_fix.py", note: "ĐỀ BÀI\nList `[4, 2, 3, 1]` được cho sẵn; không có INPUT từ ngoài chương trình. Selection sort đang cho `min_index` quay lại phần đã xếp. Sửa giá trị khởi đầu của `min_index`. OUTPUT đúng là `[1, 2, 3, 4]`.", expectOut: /^\[1, 2, 3, 4\]$/, solution: `values = [4, 2, 3, 1]

for start in range(len(values)):
    min_index = start
    for index in range(start + 1, len(values)):
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
` },
  { code: `values = [6, 1, 4, 2]
comparison_count = 0

for start in range(len(values)):
    min_index = start
    for index in range(start + 1, len(values)):
        comparison_count += 0
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
print(comparison_count)
`, label: "selection_count_work.py", note: "ĐỀ BÀI\nList bốn số được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: dùng selection sort và tăng `comparison_count` đúng một lần cho mỗi lần so sánh hai giá trị. OUTPUT là `[1, 2, 4, 6]`, rồi `6`.", expectOut: { all: [{ minLines: 2 }, /^\[1, 2, 4, 6\]$/, /^6$/] }, solution: `values = [6, 1, 4, 2]
comparison_count = 0

for start in range(len(values)):
    min_index = start
    for index in range(start + 1, len(values)):
        comparison_count += 1
        if values[index] < values[min_index]:
            min_index = index
    values[start], values[min_index] = values[min_index], values[start]

print(values)
print(comparison_count)
` },
  { checkpoint: { text: "Selection sort giữ phần bên trái đã có thứ tự. Ở mỗi `start`, đặt `min_index = start`, tìm phần tử nhỏ nhất trong phần còn lại, rồi đổi chỗ nó với `values[start]`." } },
  { quiz: { title: "Lần theo một lượt selection sort", questions: [
    { q: "List đang là `[2, 7, 4, 5]`; index 0 đã xếp xong và lượt mới có `start = 1`. Giá trị nào được chọn để đưa vào index 1?", a: ["4", "2", "7"], correct: 0 },
    { q: "Khi `start = 2`, vì sao selection sort phải đặt `min_index = 2` thay vì `0`?", a: ["Để chỉ tìm trong phần chưa xếp từ index 2 trở đi", "Để xóa phần bên trái", "Để binary search chạy được"], correct: 0 },
  ] } },
];

export default dsaNode(10, { subtitle: "chọn phần tử nhỏ nhất còn lại và đổi chỗ", machineName: "KẸP CHỌN NHỎ NHẤT", machineBlurb: "đưa giá trị nhỏ nhất còn lại tới vị trí đầu tiên chưa xếp", cells });
