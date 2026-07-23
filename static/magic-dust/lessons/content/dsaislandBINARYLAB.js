import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = [2, 5, 8, 12, 16, 21, 30]
target = 16
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(position)
`, label: "dsa_binary_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list đã xếp và mục tiêu 16; không có INPUT. PROCESS: dùng binary search để thu hẹp đoạn từ `left` đến `right`. OUTPUT là index `4`.", expectOut: /^4$/, solution: `values = [2, 5, 8, 12, 16, 21, 30]
target = 16
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(position)
` },
  { code: `values = [3, 6, 9, 12, 15]
target = 15
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    elif values[middle] < target:
        right = middle - 1
    else:
        left = middle + 1

print(position)
`, label: "dsa_binary_direction_fix.py", note: "ĐỀ BÀI\nCho sẵn list đã xếp và mục tiêu 15; không có INPUT. Hai nhánh thu hẹp đang đổi sai phía. Sửa điều kiện cập nhật biên để OUTPUT là index `4`.", expectOut: /^4$/, solution: `values = [3, 6, 9, 12, 15]
target = 15
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(position)
` },
  { code: `values = [4, 7, 10, 13, 18]
target = 11
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    if values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(position)
`, label: "dsa_binary_missing.py", note: "ĐỀ BÀI\nCho sẵn list đã xếp nhưng không có số 11; không có INPUT. PROCESS: giữ `position = -1` nếu đoạn tìm kiếm đã hết mà chưa thấy mục tiêu. OUTPUT đúng là `-1`.", expectOut: /^-1$/, solution: `values = [4, 7, 10, 13, 18]
target = 11
left = 0
right = len(values) - 1
position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        position = middle
        break
    if values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(position)
` },
  { code: `values = [2, 5, 5, 5, 9, 12]
target = 5
left = 0
right = len(values) - 1
first_position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        first_position = middle
        right = middle - 1
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(first_position)
`, label: "dsa_binary_first_duplicate.py", note: "XƯỞNG TÌM KIẾM\nCho sẵn list đã xếp có ba số 5; không có INPUT. PROCESS: sau khi thấy 5, tiếp tục tìm ở phần bên trái để lấy vị trí đầu tiên. OUTPUT đúng là index `1`.", expectOut: /^1$/, solution: `values = [2, 5, 5, 5, 9, 12]
target = 5
left = 0
right = len(values) - 1
first_position = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] == target:
        first_position = middle
        right = middle - 1
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(first_position)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ ĐÀI QUAN SÁT TÌM KIẾM ✦", introHook: "Mỗi lần nhìn vào vị trí giữa, đài quan sát bỏ được một nửa vùng không thể chứa mục tiêu. Các bài ở đây tập trung vào biên trái, biên phải và dữ liệu trùng.",
  reviewTitle: "Điều kiện dùng binary search", reviewQuestions: [{ q: "Danh sách nào có thể dùng binary search ngay mà không cần sắp xếp lại?", a: ["`[2, 5, 9, 14]`", "`[9, 2, 14, 5]`", "`[5, 2, 9, 14]`"], correct: 0 }],
  definition: "Binary search cần dữ liệu đã có thứ tự. Nếu giá trị giữa nhỏ hơn mục tiêu, giữ phần bên phải; nếu lớn hơn, giữ phần bên trái. Mỗi lượt loại bỏ vị trí giữa khỏi vùng còn lại.", tasks,
  checkpoint: "Với list tăng dần, khi `values[middle] < target` thì gán `left = middle + 1`; khi lớn hơn thì gán `right = middle - 1`.",
  quizTitle: "Thu hẹp đúng nửa", quizQuestions: [
    { q: "Cho `values = [2, 6, 9, 14, 20]`, `target = 20` và `middle = 2`. Vì `values[2]` là 9, cần giữ phần nào?", a: ["Phần bên phải", "Phần bên trái", "Dừng và báo không thấy"], correct: 0 },
    { q: "Binary search tìm số 7 trong `[1, 3, 5, 9]`. Khi `left > right` mà chưa thấy mục tiêu, OUTPUT vị trí nên là gì theo quy ước của bài?", a: ["-1", "0", "4"], correct: 0 },
  ], remember: "Binary search cần dữ liệu đã có thứ tự và hai biên luôn thu hẹp. Với giá trị trùng, phải nói rõ cần vị trí bất kỳ, đầu tiên hay cuối cùng.",
});

export default dsaIsland("binary-lab", { subtitle: "luyện cập nhật biên, mục tiêu vắng và vị trí đầu tiên trong dữ liệu trùng", machineName: "KÍNH TÌM KIẾM CHẶT ĐÔI", machineBlurb: "nhìn vị trí giữa rồi loại bỏ nửa không thể chứa mục tiêu", cells });
