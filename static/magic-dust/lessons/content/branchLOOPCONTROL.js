import { codeTask, learningBranch } from "./python-path-builders.js";

const task = config => codeTask(config);
const cells = [
  { intro: { title: "✦ NHÁNH ĐIỀU KHIỂN VÒNG LẶP ✦", hook: "Không phải vòng lặp nào cũng chờ tới điều kiện cuối. Python có cách thoát sớm, bỏ qua một lượt và lặp cho tới khi nhận dữ liệu hợp lệ.", art: "assets/future-machine.webp" } },
  { quiz: { title: "Ôn mốc dừng", questions: [
    { q: "Đoạn code sau in bao nhiêu dòng?\n```python\ncount = 3\nwhile count > 0:\n    print(count)\n    count -= 1\n```", a: ["3 dòng", "2 dòng", "Vòng lặp không dừng"], correct: 0 },
  ] } },
  { npc: "`break` dừng ngay vòng lặp gần nhất. Những dòng còn lại trong thân vòng lặp ở lượt đó không chạy; chương trình tiếp tục từ dòng đầu tiên nằm sau vòng lặp." },
  ...task({ label: "loop_break_demo.py", starter: "for number in range(1, 10):\n    if number == 4:\n        break\n    print(number)\nprint(\"DONE\")\n", note: "RUN KIỂM CHỨNG\nKhông có INPUT. PROCESS: duyệt từ 1; khi `number == 4`, `break` thoát vòng lặp trước khi in 4. OUTPUT gồm `1`, `2`, `3`, rồi `DONE`.", expectOut: { all: [{ minLines: 4 }, /^1$/, /^2$/, /^3$/, /^DONE$/] }, solution: "for number in range(1, 10):\n    if number == 4:\n        break\n    print(number)\nprint(\"DONE\")\n" }),
  ...task({ label: "loop_break_fix.py", starter: "for number in range(1, 8):\n    print(number)\n    if number == 3:\n        print(\"STOP\")\n", note: "ĐỀ BÀI\nKhông có INPUT. Thêm `break` vào đúng khối để vòng lặp dừng sau số 3. OUTPUT phải là `1`, `2`, `3`, `STOP` và không có số 4.", expectOut: { all: [{ minLines: 4 }, /^1$/, /^2$/, /^3$/, /^STOP$/] }, solution: "for number in range(1, 8):\n    print(number)\n    if number == 3:\n        print(\"STOP\")\n        break\n" }),
  { checkpoint: { text: "`break` kết thúc ngay vòng `for` hoặc `while` gần nhất. Chương trình bỏ phần còn lại của vòng lặp và chạy tiếp ở dòng nằm sau vòng lặp." } },
  { quiz: { title: "Thoát vòng bằng break", questions: [
    { q: "Đoạn code sau in gì?\n```python\nfor number in range(5):\n    if number == 2:\n        break\n    print(number)\n```", a: ["`0` rồi `1`", "`0`, `1`, `2`", "`2`, `3`, `4`"], correct: 0 },
  ] } },
  { npc: "`continue` chỉ bỏ phần còn lại của lượt hiện tại rồi chuyển sang lượt kế tiếp. Nó không kết thúc cả vòng lặp như `break`." },
  ...task({ label: "loop_continue_demo.py", starter: "for number in range(1, 6):\n    if number == 3:\n        continue\n    print(number)\n", note: "RUN KIỂM CHỨNG\nKhông có INPUT. PROCESS: khi gặp 3, `continue` bỏ lệnh `print(number)` của riêng lượt đó. OUTPUT là `1`, `2`, `4`, `5`.", expectOut: { all: [{ minLines: 4 }, /^1$/, /^2$/, /^4$/, /^5$/] }, solution: "for number in range(1, 6):\n    if number == 3:\n        continue\n    print(number)\n" }),
  ...task({ label: "loop_continue_fix.py", starter: "for letter in \"KOTO\":\n    print(letter)\n", note: "ĐỀ BÀI\nCho sẵn chuỗi `KOTO`; không có INPUT. Dùng `continue` để bỏ qua mọi ký tự `O`. OUTPUT phải có đúng hai dòng `K` rồi `T`.", expectOut: { all: [{ minLines: 2 }, /^K$/, /^T$/] }, solution: "for letter in \"KOTO\":\n    if letter == \"O\":\n        continue\n    print(letter)\n" }),
  { checkpoint: { text: "`continue` bỏ phần còn lại của lượt hiện tại và chuyển sang lượt kế tiếp. `break` kết thúc toàn bộ vòng lặp gần nhất." } },
  { quiz: { title: "Bỏ một lượt hay dừng cả vòng", questions: [
    { q: "Muốn duyệt các số nhưng không xử lý riêng số 5, rồi vẫn tiếp tục với số 6, nên dùng từ khóa nào khi gặp 5?", a: ["`continue`", "`break`", "`else`"], correct: 0 },
  ] } },
  { npc: "`while True:` tạo vòng lặp có điều kiện luôn đúng. Vì vậy bên trong phải có một đường đi tới `break`; nếu không, chương trình sẽ lặp mãi." },
  ...task({ label: "loop_while_true_demo.py", starter: "count = 1\nwhile True:\n    print(count)\n    if count == 3:\n        break\n    count += 1\nprint(\"DONE\")\n", note: "RUN KIỂM CHỨNG\nCho sẵn `count = 1`; không có INPUT. PROCESS: lặp vô hạn về hình thức nhưng dùng `break` khi count bằng 3. OUTPUT là `1`, `2`, `3`, `DONE`.", expectOut: { all: [{ minLines: 4 }, /^1$/, /^2$/, /^3$/, /^DONE$/] }, solution: "count = 1\nwhile True:\n    print(count)\n    if count == 3:\n        break\n    count += 1\nprint(\"DONE\")\n" }),
  ...task({ label: "loop_retry_password.py", starter: "while True:\n    password = input(\"Mật khẩu: \" )\n    # Nếu password là KOTO thì in OPEN và thoát vòng.\n", note: "XƯỞNG PHÉP\nHai INPUT thật lần lượt là `SAI` và `KOTO`. PROCESS: dùng `while True`, mỗi lượt đọc một mật khẩu; chỉ khi bằng `KOTO` mới in `OPEN` và `break`. OUTPUT phải chỉ có một dòng `OPEN`.", sampleInput: ["SAI", "KOTO"], expectOut: /^OPEN$/, solution: "while True:\n    password = input(\"Mật khẩu: \" )\n    if password == \"KOTO\":\n        print(\"OPEN\")\n        break\n" }),
  { checkpoint: { text: "`while True:` lặp cho tới khi một nhánh bên trong chạy `break`. Mẫu này phù hợp khi số lượt chưa biết trước, chẳng hạn hỏi lại cho tới khi người dùng nhập đúng." } },
  { quiz: { title: "Vòng lặp hỏi lại", questions: [
    { q: "Đoạn code nào chắc chắn có đường thoát khỏi `while True` khi INPUT bằng `YES`?", a: ["```python\nwhile True:\n    answer = input(\"> \" )\n    if answer == \"YES\":\n        break\n```", "```python\nwhile True:\n    answer = input(\"> \" )\n    print(answer)\n```", "```python\nwhile True:\n    continue\n```"], correct: 0 },
  ] } },
];

export default learningBranch({ id: "branchLOOPCONTROL", title: "NHÁNH ĐIỀU KHIỂN VÒNG LẶP", subtitle: "break, continue, while True và hỏi lại cho tới khi đúng", machineName: "MÁY GÁC VÒNG", machineBlurb: "thoát sớm, bỏ qua một lượt và điều khiển vòng lặp chưa biết trước số lần chạy", cells });
