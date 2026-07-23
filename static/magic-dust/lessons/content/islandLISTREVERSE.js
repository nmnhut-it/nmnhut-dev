import { listPracticeIsland } from "./list-practice-builders.js";

const cells = [
  { npc: "Đảo này chưa dùng slice. Máy bắt đầu ở index cuối `len(values) - 1`, rồi giảm index từng bước để đọc các phần tử từ phải sang trái và thêm chúng vào list kết quả." },
  { code: `from old_computer import say

values = [2, 4, 6, 8]
reversed_values = []
for index in range(len(values) - 1, -1, -1):
    reversed_values.append(values[index])

say(reversed_values)
`, label: "list_reverse_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list; không có INPUT. PROCESS: đọc index 3, 2, 1, 0 và thêm từng giá trị vào list kết quả. OUTPUT là `[8, 6, 4, 2]`.", expectOut: /^\[8, 6, 4, 2\]$/, solution: `from old_computer import say

values = [2, 4, 6, 8]
reversed_values = []
for index in range(len(values) - 1, -1, -1):
    reversed_values.append(values[index])

say(reversed_values)
` },
  { code: `from old_computer import say

values = [1, 3, 5]
reversed_values = []
for index in range(0, len(values)):
    reversed_values.append(values[index])

say(reversed_values)
`, label: "list_reverse_fix.py", note: "ĐỀ BÀI\nCho sẵn list; không có INPUT. Vòng lặp đang đọc từ trái sang phải. Sửa `range` để đọc index 2, 1, 0. OUTPUT đúng là `[5, 3, 1]`.", expectOut: /^\[5, 3, 1\]$/, solution: `from old_computer import say

values = [1, 3, 5]
reversed_values = []
for index in range(len(values) - 1, -1, -1):
    reversed_values.append(values[index])

say(reversed_values)
` },
  { quiz: { title: "Đọc index từ cuối về đầu", questions: [{ q: "Cho list có 4 phần tử. `range(len(values) - 1, -1, -1)` đưa `index` qua dãy nào?", a: ["0, 1, 2, 3", "3, 2, 1, 0", "4, 3, 2, 1"], correct: 1 }] } },
  { code: `from old_computer import say

words = ["START", "CHECK", "OPEN"]
result = []
# Dùng for, range và append để tạo thứ tự ngược lại.

say(result)
say(words)
`, label: "list_reverse_apply.py", note: "ĐỀ BÀI\nCho sẵn `words`; không có INPUT. Tạo `result` theo thứ tự ngược lại nhưng không sửa `words`. OUTPUT phải là `['OPEN', 'CHECK', 'START']` rồi list ban đầu.", expectOut: { all: [{ minLines: 2 }, /^\['OPEN', 'CHECK', 'START'\]$/, /^\['START', 'CHECK', 'OPEN'\]$/] }, solution: `from old_computer import say

words = ["START", "CHECK", "OPEN"]
result = []
for index in range(len(words) - 1, -1, -1):
    result.append(words[index])

say(result)
say(words)
` },
  { checkpoint: { text: "Tạo list có thứ tự ngược lại mà không sửa list ban đầu: đặt list kết quả rỗng, dùng `range(len(values) - 1, -1, -1)` để đọc index từ cuối về 0, rồi `append()` từng giá trị." } },
  { quiz: { title: "Giữ nguyên list ban đầu", questions: [{ q: "Cho `values = [2, 5, 8]`. Sau khi đọc từ cuối và `append()` vào `result`, hai list nào đúng?", a: ["`values = [8, 5, 2]`, `result = []`", "`values = [2, 5, 8]`, `result = [8, 5, 2]`", "Cả hai list đều thành `[8, 5, 2]`"], correct: 1 }] } },
];

export default listPracticeIsland({ id: "islandLISTREVERSE", title: "ĐẢO THỨ TỰ NGƯỢC", subtitle: "đọc từ phần tử cuối và tạo một list kết quả riêng", machineName: "MÁY ĐỌC NGƯỢC", machineBlurb: "đọc index từ cuối về đầu mà không sửa list ban đầu", hook: "Một thông điệp đang được lưu theo thứ tự từ trái sang phải. Bạn sẽ điều khiển index để đọc từ phần tử cuối và tạo một list kết quả riêng.", cells });
