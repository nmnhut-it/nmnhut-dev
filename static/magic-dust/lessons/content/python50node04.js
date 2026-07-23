import { code, makePython50Lesson } from "./python50-template.js";
export default makePython50Lesson(4, {
  subtitle: "lấy chữ số hàng đơn vị bằng % rồi kiểm tra số 7",
  machineName: "MÁY TÁCH CHỮ SỐ", machineBlurb: "lấy phần dư khi chia cho 10",
  intro: "Chặng này giới thiệu một công cụ nhỏ: `number % 10` lấy chữ số hàng đơn vị của một số nguyên không âm.",
  prior: ["17 chia 10 được dư bao nhiêu?", ["`7`", "`1`", "`10`"]],
  teach: "Dấu `%` cho phần dư. Vì các chục đều chia hết cho 10, `number % 10` giữ lại đúng chữ số hàng đơn vị.",
  demo: { starter: code(["from old_computer import say_num","","number = 347","digit = number % 10","","say_num(digit)"]), label: "p50_last_digit_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn số 347; bài này không đọc INPUT. Phần dư khi chia 347 cho 10 là chữ số hàng đơn vị, nên OUTPUT đúng là `7`.", expectOut: /^7$/ },
  fix: { starter: code(["from old_computer import say_num","","number = 582","digit = number / 10","","say_num(digit)"]), solution: code(["from old_computer import say_num","","number = 582","digit = number % 10","","say_num(digit)"]), label: "p50_last_digit_fix.py", note: "ĐỀ BÀI: Cho sẵn số 582; bài này không đọc INPUT. Đổi phép toán để lấy chữ số hàng đơn vị và tạo OUTPUT `2`.", expectOut: /^2$/ },
  check: "`number % 10` lấy chữ số hàng đơn vị. Sau đó, điều kiện `digit == 7` kiểm tra chữ số vừa lấy có phải là 7 hay không.",
  quiz: ["Cho `number = 135`. Đoạn code `digit = number % 10` gán gì vào `digit`?", ["`5`", "`13`", "`1`"]],
  apply: { starter: code(["from old_computer import read_num, say","","number = read_num(\"Số nguyên không âm: \")","digit = number / 10","","if digit == 7:","    say(\"YES\")","else:","    say(\"NO\")"]), solution: code(["from old_computer import read_num, say","","number = read_num(\"Số nguyên không âm: \")","digit = number % 10","","if digit == 7:","    say(\"YES\")","else:","    say(\"NO\")"]), label: "p50_last_digit_input.py", note: "ĐỀ BÀI: Chương trình đọc INPUT mẫu là số nguyên không âm `127`. Sửa phép toán lấy chữ số hàng đơn vị, rồi kiểm tra chữ số đó có bằng 7 không. OUTPUT đúng là `YES`.", sampleInput: "127", expectOut: /^YES$/ },
  remember: "Dùng `% 10` để lấy chữ số hàng đơn vị; sau đó so chính chữ số này với giá trị mà đề bài yêu cầu."
});
