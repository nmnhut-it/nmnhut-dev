import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ KHO BÁU BỐN PHÉP TÍNH ✦", hook: "Cánh cổng Toán đầu tiên không dạy cú pháp mới. Bạn sẽ dùng biến, phép tính và OUTPUT đã học để kiểm tra những rương kho báu của Kotopia.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn phép tính và nhánh", questions: [
    { q: "Đọc đoạn code:\n```python\nscore = 7 + 5\nif score == 12:\n    say(\"DUNG\")\nelif score == 10:\n    say(\"THU LAI\")\n```\nMáy in gì?", a: ["DUNG", "THU LAI", "Không in gì"], correct: 0 },
  ] } },
  { npc: "Một biến có thể giữ kết quả của phép tính. Khi viết `total = 8 + 5`, Python tính trước rồi gán 13 vào `total`; lệnh `say_num(total)` sẽ in số 13." },
  { code: `from old_computer import say_num

total = 8 + 5
tiles = 4 * 6

say_num(total)
say_num(tiles)
`, label: "math6_basic_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn hai phép tính; không có INPUT. PROCESS: Python tính tổng `8 + 5` và tích `4 * 6`. OUTPUT gồm hai dòng: `13` rồi `24`.", expectOut: { all: [{ minLines: 2 }, /^13$/, /^24$/] }, solution: `from old_computer import say_num

total = 8 + 5
tiles = 4 * 6

say_num(total)
say_num(tiles)
` },
  { code: `from old_computer import say_num

coins = 50
spent = 18
left = coins + spent

say_num(left)
`, label: "math6_money_fix.py", note: "ĐỀ BÀI\nCho sẵn 50 đồng và đã dùng 18 đồng; không có INPUT. Sửa phép tính để `left` giữ số tiền còn lại. OUTPUT đúng là `32`.", expectOut: /^32$/, solution: `from old_computer import say_num

coins = 50
spent = 18
left = coins - spent

say_num(left)
` },
  { checkpoint: { text: "Python tính biểu thức ở bên phải dấu `=` trước, rồi gán kết quả vào biến ở bên trái. Các phép `+`, `-`, `*`, `/` lần lượt dùng để cộng, trừ, nhân và chia." } },
  { quiz: { title: "Chọn phép tính theo tình huống", questions: [
    { q: "Một hộp có 6 bút và có 4 hộp như nhau. Dòng nào tính tổng số bút?", a: ["`total = 6 * 4`", "`total = 6 + 4`", "`total = 6 - 4`"], correct: 0 },
    { q: "Cho `coins = 40` và `spent = 13`. Đoạn code `left = coins - spent; say_num(left)` in số nào?", a: ["27", "53", "13"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

length = read_num("Chieu dai: ")
width = read_num("Chieu rong: ")
area = length + width

say_num(area)
`, label: "math6_rectangle_input.py", note: "ĐỀ BÀI\nINPUT mẫu gồm chiều dài 8 và chiều rộng 5. PROCESS: sửa phép tính diện tích hình chữ nhật. OUTPUT đúng là `40`.", sampleInput: ["8", "5"], expectOut: /^40$/, solution: `from old_computer import read_num, say_num

length = read_num("Chieu dai: ")
width = read_num("Chieu rong: ")
area = length * width

say_num(area)
` },
  { remember: "Biến giữ kết quả sau khi Python tính biểu thức. Chọn phép toán theo ý nghĩa của bài: gộp dùng `+`, tìm phần còn lại dùng `-`, nhiều nhóm bằng nhau dùng `*`, chia thành các phần bằng nhau dùng `/`." },
];

export default math6Lesson(0, { subtitle: "ôn biến, bốn phép tính và OUTPUT bằng các bài Toán 6 ngắn", machineName: "MÁY KIỂM TRA PHÉP TÍNH", machineBlurb: "giữ dữ kiện trong biến, tính đúng phép toán rồi in kết quả để kiểm chứng", cells });
