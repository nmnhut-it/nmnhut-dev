import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ MỎ ƯỚC VÀ BỘI ✦", hook: "Những viên đá trong mỏ mang các số khác nhau. Vòng `for` sẽ thử từng số để tìm ước, bội và nhận ra số nguyên tố.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn for và range", questions: [
    { q: "Đoạn code `for number in range(1, 5): say_num(number)` in những số nào?", a: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4"], correct: 1 },
  ] } },
  { npc: "Muốn kiểm tra `factor` có phải là ước hay không, máy chia `number` cho `factor`. Nếu phần dư bằng 0 thì `factor` là một ước của `number`. Ví dụ: `12 % 3 == 0`, nên 3 là ước của 12." },
  { npc: "Muốn tạo các bội của `number`, máy nhân `number` lần lượt với 1, 2, 3, ... Ví dụ, các kết quả đầu tiên của `4 * times` là 4, 8 và 12." },
  { code: `from old_computer import say_num

number = 12

for factor in range(1, number + 1):
    if number % factor == 0:
        say_num(factor)
`, label: "math6_divisors_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn `number = 12`; không có INPUT. PROCESS: thử từng `factor` từ 1 đến 12 và in khi phần dư bằng 0. OUTPUT gồm `1, 2, 3, 4, 6, 12`.", expectOut: { all: [{ minLines: 6 }, /^1$/, /^2$/, /^3$/, /^4$/, /^6$/, /^12$/] }, solution: `from old_computer import say_num

number = 12

for factor in range(1, number + 1):
    if number % factor == 0:
        say_num(factor)
` },
  { code: `from old_computer import say_num

number = 10
count = 0

for factor in range(1, number):
    if number % factor == 1:
        count = count + 1

say_num(count)
`, label: "math6_factor_count_fix.py", note: "ĐỀ BÀI\nCho sẵn `number = 10`; không có INPUT. Bài cần đếm tất cả các ước của 10. Sửa mốc cuối của `range` và điều kiện phần dư. OUTPUT đúng là `4`.", expectOut: /^4$/, solution: `from old_computer import say_num

number = 10
count = 0

for factor in range(1, number + 1):
    if number % factor == 0:
        count = count + 1

say_num(count)
` },
  { code: `from old_computer import say_num

number = 4

for times in range(1, 6):
    multiple = number * times
    say_num(multiple)
`, label: "math6_multiples_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn `number = 4`; không có INPUT. PROCESS: nhân 4 lần lượt với 1 đến 5. OUTPUT gồm `4, 8, 12, 16, 20`.", expectOut: { all: [{ minLines: 5 }, /^4$/, /^8$/, /^12$/, /^16$/, /^20$/] }, solution: `from old_computer import say_num

number = 4

for times in range(1, 6):
    multiple = number * times
    say_num(multiple)
` },
  { checkpoint: { text: "`factor` là ước khi `number % factor == 0`; `number * times` tạo một bội. Số nguyên tố là số nguyên lớn hơn 1 và chỉ có hai ước dương: 1 và chính nó. Ví dụ 7 là nguyên tố; 1 và 9 không phải." } },
  { quiz: { title: "Ước và số nguyên tố", questions: [
    { q: "Với `number = 15` và `factor = 5`, điều kiện `number % factor == 0` cho kết quả gì?", a: ["Sai, vì 15 lớn hơn 5", "Sai, vì phần dư bằng 5", "Đúng, vì chia 15 cho 5 được phần dư 0"], correct: 2 },
    { q: "Số 9 có ba ước dương là 1, 3 và 9. Vì sao 9 không phải số nguyên tố?", a: ["Vì 9 có nhiều hơn hai ước dương", "Vì 9 là số lẻ", "Vì 9 lớn hơn 1"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say

number = read_num("Nhap so lon hon 1: ")
count = 0

for factor in range(1, number + 1):
    if number % factor == 0:
        count = count + 1

if count == 2:
    say("SO NGUYEN TO")
else:
    say("KHONG PHAI SO NGUYEN TO")
`, label: "math6_prime_input.py", note: "ĐỀ BÀI\nINPUT mẫu là 13. PROCESS: đếm các ước dương rồi kiểm tra số lượng ước. OUTPUT đúng là `SO NGUYEN TO`.", sampleInput: "13", expectOut: /^SO NGUYEN TO$/, solution: `from old_computer import read_num, say

number = read_num("Nhap so lon hon 1: ")
count = 0

for factor in range(1, number + 1):
    if number % factor == 0:
        count = count + 1

if count == 2:
    say("SO NGUYEN TO")
else:
    say("KHONG PHAI SO NGUYEN TO")
` },
  { remember: "Vòng `for` có thể thử mọi ứng viên trong một khoảng. Kết hợp `for` với `%` để liệt kê ước, đếm ước và nhận ra số nguyên tố." },
];

export default math6Lesson(8, { subtitle: "dùng for, range và % để tìm ước, bội và số nguyên tố", machineName: "MÁY THỬ ƯỚC", machineBlurb: "thử từng số trong một khoảng và giữ lại những số chia hết", cells });
