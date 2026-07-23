import { codeTask, learningBranch } from "./python-path-builders.js";

const task = config => codeTask(config);
const cells = [
  { intro: { title: "✦ NHÁNH TOÁN TỬ ✦", hook: "Những cánh cửa ở đây chỉ mở khi bạn hiểu phần dư, thương nguyên, lũy thừa, thứ tự tính và phép gán rút gọn.", art: "assets/future-machine.webp" } },
  { quiz: { title: "Ôn phép tính", questions: [
    { q: "Cho `total = 4 + 3 * 2`. Theo thứ tự phép tính, `total` bằng bao nhiêu?", a: ["10", "14", "12"], correct: 0 },
  ] } },
  { npc: "`a % b` lấy phần dư khi chia `a` cho `b`; `a // b` lấy phần thương nguyên. Ví dụ `17 % 5` là `2`, còn `17 // 5` là `3` vì `17 = 3 * 5 + 2`." },
  ...task({ label: "operators_division_demo.py", starter: "items = 17\nbox_size = 5\nprint(items // box_size)\nprint(items % box_size)\n", note: "RUN KIỂM CHỨNG\nCho sẵn 17 món và mỗi hộp chứa 5 món; không có INPUT. PROCESS: dùng `//` để tính số hộp đầy và `%` để tính số món còn lại. OUTPUT lần lượt là `3` rồi `2`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^2$/] }, solution: "items = 17\nbox_size = 5\nprint(items // box_size)\nprint(items % box_size)\n" }),
  ...task({ label: "operators_division_fix.py", starter: "minutes = 135\nhours = minutes / 60\nleft = minutes / 60\nprint(hours, left)\n", note: "ĐỀ BÀI\nCho sẵn `minutes = 135`; không có INPUT. Sửa hai phép toán: số giờ đầy dùng `//`, số phút còn lại dùng `%`. OUTPUT đúng là `2 15`.", expectOut: /^2 15$/, solution: "minutes = 135\nhours = minutes // 60\nleft = minutes % 60\nprint(hours, left)\n" }),
  { checkpoint: { text: "Với số nguyên dương, `a // b` lấy phần thương nguyên và `a % b` lấy phần dư. Ví dụ `17 // 5 == 3` và `17 % 5 == 2`." } },
  { quiz: { title: "Thương và phần dư", questions: [
    { q: "Có 23 viên bi, mỗi túi chứa 6 viên. Hai biểu thức nào cho số túi đầy và số viên còn lại?", a: ["`23 // 6` và `23 % 6`", "`23 / 6` và `23 * 6`", "`23 % 6` và `23 // 6`"], correct: 0 },
  ] } },
  { npc: "`a ** b` là lũy thừa: `2 ** 3` bằng `2 * 2 * 2`, tức `8`. Lũy thừa được tính trước nhân/chia, rồi mới tới cộng/trừ; dấu ngoặc luôn có thể đổi thứ tự đó." },
  ...task({ label: "operators_power_demo.py", starter: "print(2 ** 3)\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)\n", note: "RUN KIỂM CHỨNG\nKhông có INPUT. PROCESS: tính lũy thừa, rồi so sánh biểu thức theo thứ tự mặc định với biểu thức có dấu ngoặc. OUTPUT lần lượt là `8`, `14`, `20`.", expectOut: { all: [{ minLines: 3 }, /^8$/, /^14$/, /^20$/] }, solution: "print(2 ** 3)\nprint(2 + 3 * 4)\nprint((2 + 3) * 4)\n" }),
  ...task({ label: "operators_precedence_fix.py", starter: "base = 3\nheight = 4\narea = base + height / 2\nprint(area)\n", note: "ĐỀ BÀI\nCho sẵn đáy 3 và chiều cao 4; không có INPUT. PROCESS đúng của diện tích tam giác là `(base * height) / 2`. Sửa biểu thức để OUTPUT là `6.0`.", expectOut: /^6\.0$/, solution: "base = 3\nheight = 4\narea = (base * height) / 2\nprint(area)\n" }),
  { checkpoint: { text: "Python tính `**` trước, rồi `* / // %`, rồi `+ -`. Dấu ngoặc làm phần bên trong được tính trước; dùng nó khi biểu thức cần thể hiện rõ nhóm phép tính." } },
  { quiz: { title: "Thứ tự phép tính", questions: [
    { q: "Đoạn code `print(2 ** 3 + 1)` in gì?", a: ["9", "16", "7"], correct: 0 },
    { q: "Dòng nào tính bình phương của tổng `a + b`?", a: ["`(a + b) ** 2`", "`a + b ** 2`", "`a ** 2 + b`"], correct: 0 },
  ] } },
  { npc: "Phép gán rút gọn vừa tính vừa gán lại: `score += 2` tương đương `score = score + 2`. Tương tự có `-=`, `*=`, `/=`, `//=`, `%=` và `**=`." },
  ...task({ label: "operators_augmented_fix.py", starter: "energy = 10\nenergy = energy - 3\nenergy = energy * 2\nprint(energy)\n", note: "ĐỀ BÀI\nCho sẵn `energy = 10`; không có INPUT. Viết lại hai dòng gán bằng `-=` và `*=` nhưng giữ nguyên PROCESS. OUTPUT vẫn phải là `14`.", expectOut: /^14$/, solution: "energy = 10\nenergy -= 3\nenergy *= 2\nprint(energy)\n" }),
  { npc: "`in` kiểm tra một giá trị có nằm trong chuỗi hay không; `not in` kiểm tra điều ngược lại. Ví dụ `\"dust\" in \"magic dust\"` cho `True`, còn `\"bug\" not in \"magic dust\"` cũng cho `True`." },
  ...task({ label: "operators_membership.py", starter: "message = \"magic dust\"\nif \"dust\" in message:\n    print(\"FOUND\")\nif \"bug\" not in message:\n    print(\"SAFE\")\n", note: "RUN KIỂM CHỨNG\nCho sẵn chuỗi `magic dust`; không có INPUT. PROCESS: dùng `in` và `not in` để kiểm tra hai cụm chữ. OUTPUT gồm `FOUND` rồi `SAFE`.", expectOut: { all: [{ minLines: 2 }, /^FOUND$/, /^SAFE$/] }, solution: "message = \"magic dust\"\nif \"dust\" in message:\n    print(\"FOUND\")\nif \"bug\" not in message:\n    print(\"SAFE\")\n" }),
  { checkpoint: { text: "`x += y` là dạng rút gọn của `x = x + y`. `piece in text` kiểm tra `piece` có trong chuỗi; `piece not in text` kiểm tra nó không có trong chuỗi." } },
  { quiz: { title: "Gán lại và kiểm tra chuỗi", questions: [
    { q: "Cho `score = 5`, sau `score += 3` rồi `score *= 2`, `score` bằng bao nhiêu?", a: ["16", "11", "13"], correct: 0 },
    { q: "Cho `code = \"AB-123\"`. Điều kiện nào đúng?", a: ["`\"-\" in code`", "`\"Z\" in code`", "`\"123\" not in code`"], correct: 0 },
  ] } },
];

export default learningBranch({ id: "branchOPERATORS", title: "NHÁNH TOÁN TỬ", subtitle: "% // **, thứ tự tính, phép gán rút gọn, in và not in", machineName: "MÁY TÁCH THƯƠNG VÀ DƯ", machineBlurb: "tính phần dư, lũy thừa và cập nhật biến bằng các toán tử Python chuẩn", cells });
