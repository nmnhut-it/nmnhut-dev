import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐÀI NHIỆT ĐỘ ✦", hook: "Nhiệt độ ở Kotopia có thể xuống dưới 0. Bạn sẽ dùng số nguyên và các dấu so sánh để đọc đúng trạng thái của đài.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn dấu so sánh", questions: [
    { q: "Với `temperature = -3`, điều kiện nào đúng?", a: ["`temperature < 0`", "`temperature > 0`", "`temperature == 3`"], correct: 0 },
  ] } },
  { npc: "Số nguyên âm biểu diễn những giá trị thấp hơn 0, chẳng hạn nhiệt độ -5°C hoặc tầng -2. Trên trục số, số nằm bên phải lớn hơn số nằm bên trái; vì vậy -2 lớn hơn -7." },
  { code: `from old_computer import say_num

temperature = -4
change = 7
new_temperature = temperature + change

say_num(new_temperature)
`, label: "math6_temperature_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn nhiệt độ -4°C và tăng 7°C; không có INPUT. PROCESS: cộng mức thay đổi vào nhiệt độ ban đầu. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `from old_computer import say_num

temperature = -4
change = 7
new_temperature = temperature + change

say_num(new_temperature)
` },
  { code: `from old_computer import say

temperature = -6

if temperature > 0:
    say("DUOI KHONG")
elif temperature == 0:
    say("BANG KHONG")
else:
    say("TREN KHONG")
`, label: "math6_temperature_fix.py", note: "ĐỀ BÀI\nCho sẵn nhiệt độ -6°C; không có INPUT. Các OUTPUT trong nhánh đang đặt sai. Sửa để máy in `DUOI KHONG`.", expectOut: /^DUOI KHONG$/, solution: `from old_computer import say

temperature = -6

if temperature < 0:
    say("DUOI KHONG")
elif temperature == 0:
    say("BANG KHONG")
else:
    say("TREN KHONG")
` },
  { checkpoint: { text: "Số nguyên âm nhỏ hơn 0. Chuỗi `if value < 0`, `elif value == 0`, `else` phân loại một số thành âm, bằng 0 hoặc dương." } },
  { quiz: { title: "Số nguyên trong tình huống", questions: [
    { q: "Buổi sáng nhiệt độ là -2°C, sau đó giảm thêm 5°C. Đoạn code `new_temperature = -2 - 5` cho kết quả nào?", a: ["-7", "3", "7"], correct: 0 },
    { q: "Với `floor = -1`, chuỗi nhánh kiểm tra `floor < 0` trước. Nhánh này cho biết điều gì?", a: ["Tầng nằm dưới tầng 0", "Tầng nằm trên tầng 0", "Tầng bằng tầng 1"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say

height = read_num("Do cao so voi muc bien: ")

if height > 0:
    say("TREN MUC BIEN")
elif height == 0:
    say("NGANG MUC BIEN")
else:
    say("DUOI MUC BIEN")
`, label: "math6_sea_level_input.py", note: "ĐỀ BÀI\nINPUT mẫu là độ cao -12 mét so với mực nước biển. PROCESS: so sánh INPUT với 0. OUTPUT đúng là `DUOI MUC BIEN`.", sampleInput: "-12", expectOut: /^DUOI MUC BIEN$/, solution: `from old_computer import read_num, say

height = read_num("Do cao so voi muc bien: ")

if height > 0:
    say("TREN MUC BIEN")
elif height == 0:
    say("NGANG MUC BIEN")
else:
    say("DUOI MUC BIEN")
` },
  { remember: "Khi một giá trị có thể âm, bằng 0 hoặc dương, hãy xét đủ ba trường hợp. Dấu `<` và `>` chỉ hướng trên trục số, còn `==` kiểm tra đúng giá trị mốc." },
];

export default math6Lesson(5, { subtitle: "cộng trừ và so sánh số nguyên qua nhiệt độ, độ cao và tầng hầm", machineName: "MÁY ĐỌC SỐ NGUYÊN", machineBlurb: "theo dõi giá trị dưới 0, tại 0 và trên 0 bằng các nhánh rõ ràng", cells });

