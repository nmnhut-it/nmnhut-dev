import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ PHỐ PHẦN TRĂM ✦", hook: "Biển giá trong phố dùng số thập phân và phần trăm. Bạn sẽ tính phần của một lượng, giảm giá và làm tròn kết quả khi cần.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn tỉ số phần trăm", questions: [
    { q: "25% của 80 được tính bằng biểu thức nào?", a: ["`80 * 25 / 100`", "`80 + 25 / 100`", "`80 / 25 * 100`"], correct: 0 },
  ] } },
  { npc: "`percent` phần trăm của `total` được tính bằng `total * percent / 100`. Lệnh `round(value, 2)` làm tròn `value` đến hai chữ số sau dấu chấm; đây là công cụ mới của bài này." },
  { code: `from old_computer import say_num

total = 80
percent = 25
part = total * percent / 100

say_num(part)
`, label: "math6_percent_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn tổng 80 và tỉ lệ 25%; không có INPUT. PROCESS: nhân tổng với tỉ lệ rồi chia 100. OUTPUT đúng là `20.0`.", expectOut: /^20\.0$/, solution: `from old_computer import say_num

total = 80
percent = 25
part = total * percent / 100

say_num(part)
` },
  { code: `from old_computer import say_num

price = 120
discount_percent = 15
discount = price * discount_percent / 100
final_price = price + discount

say_num(final_price)
`, label: "math6_discount_fix.py", note: "ĐỀ BÀI\nCho sẵn giá 120 đồng và giảm 15%; không có INPUT. Sửa phép tính giá sau giảm. OUTPUT đúng là `102.0`.", expectOut: /^102\.0$/, solution: `from old_computer import say_num

price = 120
discount_percent = 15
discount = price * discount_percent / 100
final_price = price - discount

say_num(final_price)
` },
  { code: `from old_computer import say_num

value = 12.346
rounded_value = round(value, 2)

say_num(rounded_value)
`, label: "math6_round_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn số 12.346; không có INPUT. PROCESS: `round(value, 2)` làm tròn đến hai chữ số sau dấu chấm. OUTPUT đúng là `12.35`.", expectOut: /^12\.35$/, solution: `from old_computer import say_num

value = 12.346
rounded_value = round(value, 2)

say_num(rounded_value)
` },
  { checkpoint: { text: "`percent` phần trăm của `total` là `total * percent / 100`. Giá sau giảm bằng giá ban đầu trừ số tiền được giảm. `round(value, 2)` làm tròn đến hai chữ số sau dấu chấm." } },
  { quiz: { title: "Phần trăm và làm tròn", questions: [
    { q: "Một món đồ giá 200 đồng, giảm 10%. Số tiền được giảm là bao nhiêu?", a: ["20.0", "190.0", "10.0"], correct: 0 },
    { q: "Đoạn code `round(12.346, 2)` cho kết quả nào?", a: ["12.35", "12.34", "12.3"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

votes = read_num("So phieu: ")
total = read_num("Tong so phieu: ")

rate = votes / total * 10
rounded_rate = round(rate, 1)
say_num(rounded_rate)
`, label: "math6_vote_rate_input.py", note: "ĐỀ BÀI\nINPUT mẫu là 18 phiếu trên tổng 24 phiếu. PROCESS: tính tỉ lệ phần trăm và làm tròn đến một chữ số sau dấu chấm. OUTPUT đúng là `75.0`.", sampleInput: ["18", "24"], expectOut: /^75\.0$/, solution: `from old_computer import read_num, say_num

votes = read_num("So phieu: ")
total = read_num("Tong so phieu: ")

rate = votes / total * 100
rounded_rate = round(rate, 1)
say_num(rounded_rate)
` },
  { remember: "Tỉ lệ phần trăm luôn so một phần với tổng rồi nhân 100. Khi tiền hoặc số đo có nhiều chữ số thập phân, dùng `round()` để làm tròn đến số chữ số đề bài yêu cầu." },
];

export default math6Lesson(7, { subtitle: "tính phần trăm, giảm giá và làm tròn số thập phân", machineName: "MÁY TÍNH PHẦN TRĂM", machineBlurb: "đổi tỉ số thành phần trăm và làm tròn kết quả theo yêu cầu", cells });
