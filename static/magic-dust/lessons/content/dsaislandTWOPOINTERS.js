import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = [1, 3, 4, 7, 10]
target = 11
left = 0
right = len(values) - 1
answer = "NONE"

while left < right:
    current_sum = values[left] + values[right]
    if current_sum == target:
        answer = str(values[left]) + "+" + str(values[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1

print(answer)
`, label: "dsa_pointers_pair_sum.py", note: "RUN KIỂM CHỨNG\nCho sẵn list đã xếp và tổng mục tiêu 11; không có INPUT. PROCESS: dùng hai con trỏ ở hai đầu để tìm một cặp phù hợp. OUTPUT đúng là `1+10`.", expectOut: /^1\+10$/, solution: `values = [1, 3, 4, 7, 10]
target = 11
left = 0
right = len(values) - 1
answer = "NONE"

while left < right:
    current_sum = values[left] + values[right]
    if current_sum == target:
        answer = str(values[left]) + "+" + str(values[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1

print(answer)
` },
  { code: `text = "LEVEL"
left = 0
right = len(text) - 1
same = True

while left < right:
    if text[left] != text[right]:
        same = False
    left = left + 1
    right = right - 1

print(same)
`, label: "dsa_pointers_palindrome.py", note: "ĐỀ BÀI\nCho sẵn chuỗi `LEVEL`; không có INPUT. PROCESS: so các ký tự đối xứng bằng hai con trỏ tiến từ hai đầu vào giữa. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `text = "LEVEL"
left = 0
right = len(text) - 1
same = True

while left < right:
    if text[left] != text[right]:
        same = False
    left = left + 1
    right = right - 1

print(same)
` },
  { code: `first = [1, 2, 4, 7]
second = [2, 3, 4, 8]
left = 0
right = 0
common = []

while left < len(first) and right < len(second):
    if first[left] == second[right]:
        common.append(first[left])
        left = left + 1
        right = right + 1
    elif first[left] < second[right]:
        left = left + 1
    else:
        right = right + 1

print(common)
`, label: "dsa_pointers_intersection.py", note: "ĐỀ BÀI\nCho sẵn hai list đã xếp; không có INPUT. PROCESS: dùng một con trỏ cho mỗi list để tìm các giá trị chung. OUTPUT là `[2, 4]`.", expectOut: /^\[2, 4\]$/, solution: `first = [1, 2, 4, 7]
second = [2, 3, 4, 8]
left = 0
right = 0
common = []

while left < len(first) and right < len(second):
    if first[left] == second[right]:
        common.append(first[left])
        left = left + 1
        right = right + 1
    elif first[left] < second[right]:
        left = left + 1
    else:
        right = right + 1

print(common)
` },
  { code: `values = [0, 5, 0, 3, 8]
write = 0

for read in range(len(values)):
    if values[read] != 0:
        values[write] = values[read]
        write = write + 1

while write < len(values):
    values[write] = 0
    write = write + 1

print(values)
`, label: "dsa_pointers_move_zero.py", note: "XƯỞNG HAI CON TRỎ\nCho sẵn list có hai số 0; không có INPUT. PROCESS: dùng `read` để quét và `write` để ghi các số khác 0 theo thứ tự cũ. OUTPUT là `[5, 3, 8, 0, 0]`.", expectOut: /^\[5, 3, 8, 0, 0\]$/, solution: `values = [0, 5, 0, 3, 8]
write = 0

for read in range(len(values)):
    if values[read] != 0:
        values[write] = values[read]
        write = write + 1

while write < len(values):
    values[write] = 0
    write = write + 1

print(values)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ CẦU HAI CON TRỎ ✦", introHook: "Hai dấu mốc có thể tiến từ hai đầu hoặc cùng đi về một phía. Nhờ mỗi dấu mốc giữ một vị trí, thuật toán tránh phải thử lại mọi cặp dữ liệu.",
  reviewTitle: "Đọc hai vị trí", reviewQuestions: [{ q: "Trong list tăng dần, tổng của hai đầu đang nhỏ hơn mục tiêu. Muốn tổng lớn hơn, nên di chuyển con trỏ nào?", a: ["Con trỏ trái sang phải", "Con trỏ phải sang trái", "Cả hai ra ngoài list"], correct: 0 }],
  definition: "Mẫu hai con trỏ giữ hai vị trí đang đọc. Quy tắc di chuyển phải dựa trên dữ liệu: với list tăng dần và tổng còn nhỏ, tăng con trỏ trái; khi tổng quá lớn, giảm con trỏ phải.", tasks,
  checkpoint: "Hai con trỏ chỉ hiệu quả khi mỗi lần so sánh cho biết con trỏ nào cần di chuyển. Với pair sum trên list tăng dần, tổng nhỏ thì tăng `left`, tổng lớn thì giảm `right`.",
  quizTitle: "Di chuyển đúng dấu mốc", quizQuestions: [
    { q: "Cho list tăng dần `[1, 4, 6, 9]`, mục tiêu 10. Hai đầu tạo tổng 10. Thuật toán nên làm gì?", a: ["Ghi nhận cặp 1 và 9", "Tăng con trỏ trái", "Giảm con trỏ phải"], correct: 0 },
    { q: "Khi kiểm tra palindrome, sau khi hai ký tự ở `left` và `right` bằng nhau, cập nhật nào đúng?", a: ["Tăng `left` và giảm `right`", "Giảm cả hai", "Chỉ tăng `right`"], correct: 0 },
  ], remember: "Hai con trỏ không có một quy tắc di chuyển chung cho mọi bài. Hãy nêu rõ mỗi con trỏ đại diện cho gì và kết quả so sánh nào làm nó đổi vị trí.",
});

export default dsaIsland("two-pointers", { subtitle: "luyện pair sum, palindrome, giao list và ghi dữ liệu bằng hai vị trí", machineName: "CẦU HAI DẤU MỐC", machineBlurb: "giữ hai vị trí đang đọc để loại bỏ những cặp không cần thử", cells });
