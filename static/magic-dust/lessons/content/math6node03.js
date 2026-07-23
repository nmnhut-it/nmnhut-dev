import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ XƯỞNG HÌNH PHẲNG ✦", hook: "Những tấm kính trong xưởng có hình vuông, hình chữ nhật và hình tam giác. Bạn sẽ chọn đúng công thức rồi kiểm tra kết quả bằng OUTPUT.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn chọn công thức", questions: [
    { q: "Một hình chữ nhật có chiều dài 7 và chiều rộng 4. Biểu thức nào tính diện tích?", a: ["`7 * 4`", "`7 + 4`", "`(7 + 4) * 2`"], correct: 0 },
  ] } },
  { npc: "Diện tích hình vuông là cạnh nhân cạnh; diện tích hình chữ nhật là chiều dài nhân chiều rộng; diện tích hình tam giác là đáy nhân chiều cao rồi chia 2. Mã hình sẽ giúp máy chọn công thức." },
  { code: `from old_computer import say_num

shape = 2
length = 8
width = 5

if shape == 1:
    area = length * length
elif shape == 2:
    area = length * width

say_num(area)
`, label: "math6_shape_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn mã hình 2, chiều dài 8 và chiều rộng 5; không có INPUT. PROCESS: nhánh mã 2 tính diện tích hình chữ nhật. OUTPUT đúng là `40`.", expectOut: /^40$/, solution: `from old_computer import say_num

shape = 2
length = 8
width = 5

if shape == 1:
    area = length * length
elif shape == 2:
    area = length * width

say_num(area)
` },
  { code: `from old_computer import say_num

shape = 3
base = 6
height = 4

if shape == 1:
    area = base * base
elif shape == 2:
    area = base * height
elif shape == 3:
    area = base + height / 2

say_num(area)
`, label: "math6_triangle_fix.py", note: "ĐỀ BÀI\nCho sẵn mã hình 3, đáy 6 và chiều cao 4; không có INPUT. Sửa công thức diện tích tam giác. OUTPUT đúng là `12.0`.", expectOut: /^12\.0$/, solution: `from old_computer import say_num

shape = 3
base = 6
height = 4

if shape == 1:
    area = base * base
elif shape == 2:
    area = base * height
elif shape == 3:
    area = base * height / 2

say_num(area)
` },
  { checkpoint: { text: "Diện tích hình vuông là `side * side`; hình chữ nhật là `length * width`; hình tam giác là `base * height / 2`. Có thể dùng mã hình và `if/elif` để chọn công thức." } },
  { quiz: { title: "Công thức theo hình", questions: [
    { q: "Hình tam giác có đáy 10 và chiều cao 3. Dòng `area = base * height / 2` cho diện tích bao nhiêu?", a: ["15.0", "30", "6.5"], correct: 0 },
    { q: "Với hình vuông cạnh 6, biểu thức nào cho diện tích 36?", a: ["`side * side`", "`side + side`", "`side * 4`"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

length = read_num("Chieu dai: ")
width = read_num("Chieu rong: ")
perimeter = length + width * 2

say_num(perimeter)
`, label: "math6_perimeter_input.py", note: "ĐỀ BÀI\nINPUT mẫu là chiều dài 9 và chiều rộng 4. PROCESS: tính chu vi hình chữ nhật bằng hai lần tổng chiều dài và chiều rộng. OUTPUT đúng là `26`.", sampleInput: ["9", "4"], expectOut: /^26$/, solution: `from old_computer import read_num, say_num

length = read_num("Chieu dai: ")
width = read_num("Chieu rong: ")
perimeter = (length + width) * 2

say_num(perimeter)
` },
  { remember: "Khi đề bài cho tên hoặc mã hình, trước hết chọn đúng công thức. Dấu ngoặc trong `(length + width) * 2` cho máy cộng hai cạnh trước rồi mới nhân 2." },
];

export default math6Lesson(3, { subtitle: "chọn công thức chu vi và diện tích bằng if/elif", machineName: "MÁY ĐO HÌNH PHẲNG", machineBlurb: "nhận số đo, chọn công thức theo mã hình và in kết quả", cells });
