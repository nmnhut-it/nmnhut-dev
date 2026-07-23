import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ CẦU PHÂN SỐ ✦", hook: "Cây cầu nhận các phân số có mẫu số dương. Bạn sẽ giữ tử số và mẫu số trong biến riêng, rồi so sánh mà không đổi thành số thập phân gần đúng.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn phân số bằng nhau", questions: [
    { q: "Hai phân số 1/2 và 2/4 có bằng nhau không?", a: ["Có, vì `1 * 4 == 2 * 2`", "Không, vì tử số khác nhau", "Không, vì mẫu số khác nhau"], correct: 0 },
  ] } },
  { npc: "Trong bài này `b > 0` và `d > 0`. Hai phân số `a/b`, `c/d` bằng nhau khi `a * d == b * c`. Ví dụ 1/2 bằng 2/4." },
  { code: `from old_computer import say

a = 1
b = 2
c = 2
d = 4

if a * d == b * c:
    say("BANG NHAU")
else:
    say("KHAC NHAU")
`, label: "math6_fraction_equal_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn hai phân số 1/2 và 2/4; không có INPUT. PROCESS: so sánh hai tích chéo. OUTPUT đúng là `BANG NHAU`.", expectOut: /^BANG NHAU$/, solution: `from old_computer import say

a = 1
b = 2
c = 2
d = 4

if a * d == b * c:
    say("BANG NHAU")
else:
    say("KHAC NHAU")
` },
  { code: `from old_computer import say

a = 3
b = 5
c = 2
d = 3

left = a * c
right = b * d

if left > right:
    say("PHAN SO DAU LON HON")
else:
    say("PHAN SO SAU LON HON")
`, label: "math6_fraction_compare_fix.py", note: "ĐỀ BÀI\nCho sẵn 3/5 và 2/3; không có INPUT. Hai tích dùng để so sánh đang ghép sai. Sửa để OUTPUT là `PHAN SO SAU LON HON`.", expectOut: /^PHAN SO SAU LON HON$/, solution: `from old_computer import say

a = 3
b = 5
c = 2
d = 3

left = a * d
right = b * c

if left > right:
    say("PHAN SO DAU LON HON")
else:
    say("PHAN SO SAU LON HON")
` },
  { checkpoint: { text: "So sánh `a/b` với `c/d` bằng hai tích `a * d` và `b * c`. Hai tích bằng nhau thì hai phân số bằng nhau; tích nào lớn hơn thì phân số tương ứng lớn hơn." } },
  { quiz: { title: "So sánh bằng tích chéo", questions: [
    { q: "So sánh 2/3 và 3/5. Hai tích chéo là `2 * 5 = 10` và `3 * 3 = 9`. Phân số nào lớn hơn?", a: ["2/3", "3/5", "Hai phân số bằng nhau"], correct: 0 },
    { q: "Điều kiện nào kiểm tra `a/b` bằng `c/d`?", a: ["`a * d == b * c`", "`a * b == c * d`", "`a + d == b + c`"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

total = read_num("Tong so: ")
numerator = read_num("Tu so: ")
denominator = read_num("Mau so: ")

part = total / numerator * denominator
say_num(part)
`, label: "math6_fraction_of_input.py", note: "ĐỀ BÀI\nINPUT mẫu là tổng 40, tử số 3 và mẫu số dương 5. PROCESS: tính 3/5 của 40. Sửa biểu thức để OUTPUT đúng là `24.0`.", sampleInput: ["40", "3", "5"], expectOut: /^24\.0$/, solution: `from old_computer import read_num, say_num

total = read_num("Tong so: ")
numerator = read_num("Tu so: ")
denominator = read_num("Mau so: ")

part = total * numerator / denominator
say_num(part)
` },
  { remember: "Giữ tử số và mẫu số trong các biến riêng giúp Python làm đúng phép toán phân số. So sánh dùng tích chéo; tính một phân số của một số dùng `total * numerator / denominator`." },
];

export default math6Lesson(6, { subtitle: "kiểm tra phân số bằng nhau, so sánh phân số và tính một phần của số", machineName: "MÁY CÂN PHÂN SỐ", machineBlurb: "so sánh tử số và mẫu số bằng tích chéo mà không làm tròn", cells });
