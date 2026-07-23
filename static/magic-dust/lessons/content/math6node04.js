import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ BẾN CHIA ĐỀU ✦", hook: "Bến hàng cần biết có bao nhiêu thùng đầy và còn lại bao nhiêu món. Hai toán tử `//` và `%` sẽ tách đúng hai kết quả đó.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn nhánh còn lại", questions: [
    { q: "Đọc đoạn code:\n```python\nnumber = 7\nif number == 6:\n    say(\"SÁU\")\nelse:\n    say(\"KHÁC SÁU\")\n```\nMáy in gì?", a: ["KHÁC SÁU", "SÁU", "7"], correct: 0 },
  ] } },
  { npc: "Với hai số nguyên dương, `a // b` lấy thương nguyên, còn `a % b` lấy phần dư. Ví dụ: 17 món chia thành các nhóm 5 món được 3 nhóm và dư 2 món." },
  { code: `from old_computer import say_num

items = 17
box_size = 5

full_boxes = items // box_size
left = items % box_size

say_num(full_boxes)
say_num(left)
`, label: "math6_division_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn 17 món và mỗi hộp chứa 5 món; không có INPUT. PROCESS: `//` tính số hộp đầy, `%` tính số món còn lại. OUTPUT gồm `3` rồi `2`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^2$/] }, solution: `from old_computer import say_num

items = 17
box_size = 5

full_boxes = items // box_size
left = items % box_size

say_num(full_boxes)
say_num(left)
` },
  { code: `from old_computer import say_num

minutes = 135
hours = minutes / 60
left_minutes = minutes / 60

say_num(hours)
say_num(left_minutes)
`, label: "math6_time_remainder_fix.py", note: "ĐỀ BÀI\nCho sẵn 135 phút; không có INPUT. Sửa hai phép toán để tìm số giờ đầy và số phút còn lại. OUTPUT gồm `2` rồi `15`.", expectOut: { all: [{ minLines: 2 }, /^2$/, /^15$/] }, solution: `from old_computer import say_num

minutes = 135
hours = minutes // 60
left_minutes = minutes % 60

say_num(hours)
say_num(left_minutes)
` },
  { checkpoint: { text: "Với số nguyên dương, `a // b` lấy phần thương nguyên và `a % b` lấy phần dư. Nếu `number % m == 0` thì `number` chia hết cho `m`." } },
  { quiz: { title: "Thương và phần dư", questions: [
    { q: "Có 23 viên bi, mỗi túi chứa 6 viên. Hai biểu thức nào cho số túi đầy và số viên còn lại?", a: ["`23 // 6` và `23 % 6`", "`23 / 6` và `23 * 6`", "`23 % 6` và `23 // 6`"], correct: 0 },
    { q: "Để kiểm tra 18 có chia hết cho 3 hay không, điều kiện nào đúng?", a: ["`18 % 3 == 0`", "`18 // 3 == 0`", "`18 / 3 == 0`"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say

number = read_num("Nhap so: ")

if number % 2 == 0:
    say("CHAN")
else:
    say("LE")
`, label: "math6_even_input.py", note: "ĐỀ BÀI\nINPUT mẫu là số 19. PROCESS: lấy phần dư khi chia cho 2 rồi chọn nhánh chẵn hoặc lẻ. OUTPUT đúng là `LE`.", sampleInput: "19", expectOut: /^LE$/, solution: `from old_computer import read_num, say

number = read_num("Nhap so: ")

if number % 2 == 0:
    say("CHAN")
else:
    say("LE")
` },
  { remember: "`//` trả lời “chia được bao nhiêu nhóm đầy”, còn `%` trả lời “còn dư bao nhiêu”. Phần dư bằng 0 là dấu hiệu chia hết." },
];

export default math6Lesson(4, { subtitle: "dùng // và % để tìm phần thương nguyên, phần dư và tính chia hết", machineName: "MÁY CHIA ĐỀU", machineBlurb: "tách số nhóm đầy và phần còn lại trong cùng một phép chia", cells });
