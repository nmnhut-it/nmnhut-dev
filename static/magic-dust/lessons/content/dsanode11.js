import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ BÀN CHÈN THẺ ✦", hook: "Một dãy thẻ bên trái luôn có thứ tự. Mỗi thẻ mới được giữ tạm, các thẻ lớn hơn dịch sang phải để nhường đúng chỗ.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn selection sort", questions: [
    { q: "Selection sort đang xử lý `[3, 8, 5, 6]` với `start = 1`. Giá trị nhỏ nhất trong phần chưa xếp là gì?", a: ["5", "3", "8"], correct: 0 },
  ] } },
  { npc: "Insertion sort xem phần bên trái của list là phần đã có thứ tự. Nó giữ giá trị tại `start` trong `key`, dịch các giá trị lớn hơn `key` sang phải, rồi đặt `key` vào chỗ trống còn lại." },
  { code: `values = [6, 2, 5, 3]

for start in range(1, len(values)):
    key = values[start]
    position = start - 1
    while position >= 0 and values[position] > key:
        values[position + 1] = values[position]
        position -= 1
    values[position + 1] = key

print(values)
`, label: "insertion_sort_demo.py", note: "RUN KIỂM CHỨNG\nList `[6, 2, 5, 3]` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: insertion sort mở rộng phần đã có thứ tự từ trái sang phải. OUTPUT đúng là `[2, 3, 5, 6]`.", expectOut: /^\[2, 3, 5, 6\]$/, solution: `values = [6, 2, 5, 3]

for start in range(1, len(values)):
    key = values[start]
    position = start - 1
    while position >= 0 and values[position] > key:
        values[position + 1] = values[position]
        position -= 1
    values[position + 1] = key

print(values)
` },
  { npc: "Điều kiện dịch thẻ quyết định thứ tự cuối cùng. Khi cần xếp tăng dần, chỉ những giá trị lớn hơn `key` mới dịch sang phải; dùng dấu `<` sẽ tạo ra thứ tự ngược lại." },
  { code: `values = [4, 1, 3, 2]

for start in range(1, len(values)):
    key = values[start]
    position = start - 1
    while position >= 0 and values[position] < key:
        values[position + 1] = values[position]
        position -= 1
    values[position + 1] = key

print(values)
`, label: "insertion_condition_fix.py", note: "ĐỀ BÀI\nList bốn số được cho sẵn; không có INPUT từ ngoài chương trình. Insertion sort đang dùng sai dấu so sánh nên không xếp tăng dần. Đổi điều kiện dịch phần tử. OUTPUT đúng là `[1, 2, 3, 4]`.", expectOut: /^\[1, 2, 3, 4\]$/, solution: `values = [4, 1, 3, 2]

for start in range(1, len(values)):
    key = values[start]
    position = start - 1
    while position >= 0 and values[position] > key:
        values[position + 1] = values[position]
        position -= 1
    values[position + 1] = key

print(values)
` },
  { code: `scores = [2, 5, 8, 11]
scores.append(7)

start = len(scores) - 1
key = scores[start]
position = start - 1
while position >= 0 and scores[position] > key:
    scores[position + 1] = scores[position]
    position -= 1
scores[position + 1] = key

print(scores)
`, label: "insert_new_score.py", note: "RUN THỰC HÀNH\nList `[2, 5, 8, 11]` đã tăng dần và điểm `7` vừa được thêm vào cuối; không có INPUT từ ngoài chương trình. PROCESS: thực hiện một lượt insertion sort cho điểm mới. OUTPUT đúng là `[2, 5, 7, 8, 11]`.", expectOut: /^\[2, 5, 7, 8, 11\]$/, solution: `scores = [2, 5, 8, 11]
scores.append(7)

start = len(scores) - 1
key = scores[start]
position = start - 1
while position >= 0 and scores[position] > key:
    scores[position + 1] = scores[position]
    position -= 1
scores[position + 1] = key

print(scores)
` },
  { checkpoint: { text: "Insertion sort giữ phần bên trái đã có thứ tự. Mỗi lượt giữ `key`, dịch các giá trị lớn hơn `key` sang phải, rồi gán `key` vào `position + 1`." } },
  { quiz: { title: "Chọn chỗ cho thẻ mới", questions: [
    { q: "Phần bên trái đang là `[2, 5, 9]` và `key = 6`. Những giá trị nào phải dịch sang phải trước khi đặt `key`?", a: ["Chỉ số 9", "Số 5 và số 9", "Không có số nào"], correct: 0 },
    { q: "Trong insertion sort tăng dần, điều kiện `values[position] > key` đúng thì máy làm gì?", a: ["Dịch giá trị lớn hơn sang phải để nhường chỗ", "Xóa `key` khỏi list", "Đổi sang binary search"], correct: 0 },
  ] } },
];

export default dsaNode(11, { subtitle: "giữ giá trị mới và chèn vào phần đã có thứ tự", machineName: "BÀN CHÈN THẺ", machineBlurb: "dịch các giá trị lớn hơn để đặt thẻ mới vào đúng chỗ", cells });
