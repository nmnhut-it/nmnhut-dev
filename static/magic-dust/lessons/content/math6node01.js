import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ TRẠM ĐỔI ĐƠN VỊ ✦", hook: "Đồng hồ và thước đo trong trạm đang dùng lẫn phút, giây, mét và xăng-ti-mét. Bạn sẽ đưa các số về cùng đơn vị trước khi tính.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn INPUT và OUTPUT", questions: [
    { q: "Đoạn code `minutes = read_num(\"So phut: \")` nhận giá trị từ đâu?", a: ["Từ phần người học gõ vào", "Từ một giá trị đã gán sẵn", "Từ OUTPUT của `say_num()`"], correct: 0 },
  ] } },
  { npc: "Đổi từ đơn vị lớn sang đơn vị nhỏ thường dùng phép nhân. Một phút bằng 60 giây, nên `seconds = minutes * 60`. Khi cộng hai số đo, tụi mình cần đưa chúng về cùng đơn vị trước." },
  { code: `from old_computer import say_num

minutes = 3
seconds = minutes * 60

say_num(seconds)
`, label: "math6_minutes_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn `minutes = 3`; không có INPUT. PROCESS: nhân số phút với 60. OUTPUT đúng là `180` giây.", expectOut: /^180$/, solution: `from old_computer import say_num

minutes = 3
seconds = minutes * 60

say_num(seconds)
` },
  { code: `from old_computer import say_num

meters = 2
centimeters = 35
total_centimeters = meters + centimeters

say_num(total_centimeters)
`, label: "math6_length_fix.py", note: "ĐỀ BÀI\nCho sẵn 2 mét và 35 xăng-ti-mét; không có INPUT. Đưa 2 mét về xăng-ti-mét trước khi cộng. OUTPUT đúng là `235`.", expectOut: /^235$/, solution: `from old_computer import say_num

meters = 2
centimeters = 35
total_centimeters = meters * 100 + centimeters

say_num(total_centimeters)
` },
  { checkpoint: { text: "Trước khi cộng hai số đo, đưa chúng về cùng đơn vị. Đổi phút sang giây dùng `minutes * 60`; đổi mét sang xăng-ti-mét dùng `meters * 100`." } },
  { quiz: { title: "Đưa về cùng đơn vị", questions: [
    { q: "Một đoạn dây dài 3 mét 20 xăng-ti-mét. Biểu thức nào tính toàn bộ độ dài theo xăng-ti-mét?", a: ["`3 * 100 + 20`", "`3 + 20`", "`3 * 60 + 20`"], correct: 0 },
    { q: "Cho `hours = 2`. Đoạn code `minutes = hours * 60; say_num(minutes)` in gì?", a: ["120", "62", "30"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

hours = read_num("So gio: ")
minutes = read_num("So phut them: ")
total_minutes = hours + minutes

say_num(total_minutes)
`, label: "math6_time_input.py", note: "ĐỀ BÀI\nINPUT mẫu là 2 giờ và thêm 15 phút. PROCESS: đưa số giờ về phút rồi cộng. OUTPUT đúng là `135`.", sampleInput: ["2", "15"], expectOut: /^135$/, solution: `from old_computer import read_num, say_num

hours = read_num("So gio: ")
minutes = read_num("So phut them: ")
total_minutes = hours * 60 + minutes

say_num(total_minutes)
` },
  { remember: "Muốn cộng các số đo, trước hết phải đưa chúng về cùng đơn vị. Hệ số đổi đơn vị quyết định phép nhân: 1 giờ = 60 phút, 1 phút = 60 giây, 1 mét = 100 xăng-ti-mét." },
];

export default math6Lesson(1, { subtitle: "đổi thời gian và độ dài bằng phép nhân trước khi cộng", machineName: "MÁY ĐỔI ĐƠN VỊ", machineBlurb: "đưa các số đo về cùng đơn vị để phép tính có ý nghĩa", cells });
