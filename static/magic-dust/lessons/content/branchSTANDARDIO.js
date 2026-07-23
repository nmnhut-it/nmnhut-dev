import { codeTask, learningBranch } from "./python-path-builders.js";

const task = config => codeTask(config);
const cells = [
  { intro: { title: "✦ NHÁNH PYTHON CHUẨN ✦", hook: "Cỗ máy cổ đã biết `input()` và `print()`. Nhánh này giúp nó đọc số thật, in nhiều giá trị và tạo câu bằng f-string.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Kiểm tra INPUT và OUTPUT", questions: [
    { q: "Với INPUT là `An`, đoạn code sau in gì?\n```python\nname = input(\"Tên: \")\nprint(\"Chào \" + name)\n```", a: ["`Chào An`", "`Tên: An`", "`name`"], correct: 0 },
  ] } },
  { npc: "`input()` luôn trả về một chuỗi. Khi cần tính với số nguyên, đặt nó bên trong `int(...)`: `age = int(input(\"Tuổi: \"))`. Máy đọc chữ trước rồi chuyển chữ số thành giá trị kiểu `int`." },
  ...task({ label: "standard_int_demo.py", starter: "age = int(input(\"Tuổi: \"))\nnext_age = age + 1\nprint(next_age)\n", note: "RUN KIỂM CHỨNG\nINPUT thật: gõ `12`. PROCESS: `input()` đọc chuỗi, `int(...)` chuyển thành số nguyên rồi cộng 1. OUTPUT phải là `13`.", sampleInput: "12", expectOut: /^13$/, solution: "age = int(input(\"Tuổi: \"))\nnext_age = age + 1\nprint(next_age)\n" }),
  ...task({ label: "standard_int_fix.py", starter: "number = input(\"Số: \" )\nresult = number + 5\nprint(result)\n", note: "ĐỀ BÀI\nINPUT thật là `7`. Đoạn code sai vì `input()` trả về chuỗi. Sửa dòng đầu bằng `int(input(...))`; PROCESS cộng 5. OUTPUT đúng là `12`.", sampleInput: "7", expectOut: /^12$/, solution: "number = int(input(\"Số: \"))\nresult = number + 5\nprint(result)\n" }),
  { checkpoint: { text: "`input()` trả về chuỗi. Mẫu `number = int(input(prompt))` đọc INPUT rồi chuyển nó thành số nguyên để dùng phép tính." } },
  { quiz: { title: "Chuyển INPUT thành int", questions: [
    { q: "INPUT là `8`. Dòng nào tạo số `8` để có thể tính `number * 2`?", a: ["`number = int(input(\"Số: \"))`", "`number = input(\"Số: \")`", "`number = print(8)`"], correct: 0 },
  ] } },
  { npc: "Số có phần thập phân dùng kiểu `float`. Mẫu `height = float(input(\"Chiều cao: \"))` đọc được giá trị như `1.55`. Nếu chỉ dùng `int(...)`, chữ `1.55` không phải một số nguyên hợp lệ." },
  ...task({ label: "standard_float_demo.py", starter: "price = float(input(\"Giá: \"))\ntotal = price * 2\nprint(total)\n", note: "RUN KIỂM CHỨNG\nINPUT thật là `12.5`. PROCESS: `float(input(...))` đọc số thập phân rồi nhân 2. OUTPUT phải là `25.0`.", sampleInput: "12.5", expectOut: /^25\.0$/, solution: "price = float(input(\"Giá: \"))\ntotal = price * 2\nprint(total)\n" }),
  ...task({ label: "standard_float_fix.py", starter: "length = int(input(\"Chiều dài: \"))\nwidth = 2.0\narea = length * width\nprint(area)\n", note: "ĐỀ BÀI\nINPUT thật là `3.5`. Sửa lệnh chuyển kiểu để nhận số thập phân. PROCESS nhân chiều dài với `width = 2.0`. OUTPUT đúng là `7.0`.", sampleInput: "3.5", expectOut: /^7\.0$/, solution: "length = float(input(\"Chiều dài: \"))\nwidth = 2.0\narea = length * width\nprint(area)\n" }),
  { checkpoint: { text: "`float(input(prompt))` dùng khi INPUT có thể có phần thập phân, chẳng hạn `3.5`. `int(input(prompt))` dùng cho số nguyên như `3`." } },
  { quiz: { title: "Chọn int hay float", questions: [
    { q: "Người dùng có thể gõ cân nặng `42.5`. Dòng nào đọc đúng INPUT để tiếp tục tính?", a: ["`weight = float(input(\"Cân nặng: \"))`", "`weight = int(input(\"Cân nặng: \"))`", "`weight = print(42.5)`"], correct: 0 },
  ] } },
  { npc: "`print()` có thể nhận nhiều giá trị, ngăn cách bằng dấu phẩy: `print(\"Điểm:\", score)`. Python tự đặt một khoảng trắng giữa chúng, nên không cần tự đổi số thành chuỗi." },
  ...task({ label: "standard_print_many.py", starter: "name = \"An\"\nscore = 9\nprint(\"Bạn\", name, \"được\", score, \"điểm\")\n", note: "RUN KIỂM CHỨNG\nCho sẵn `name = \"An\"` và `score = 9`; không có INPUT bên ngoài. PROCESS: truyền năm giá trị cho `print()`. OUTPUT phải là `Bạn An được 9 điểm`.", expectOut: /^Bạn An được 9 điểm$/, solution: "name = \"An\"\nscore = 9\nprint(\"Bạn\", name, \"được\", score, \"điểm\")\n" }),
  { npc: "F-string đặt chữ `f` trước dấu nháy và đặt biểu thức trong `{}`. Ví dụ `f\"Bạn {name} được {score} điểm\"` tạo một chuỗi hoàn chỉnh từ chữ và giá trị hiện tại của biến." },
  ...task({ label: "standard_fstring_fix.py", starter: "item = \"sách\"\ncount = 3\nprint(\"Có {count} quyển {item}\")\n", note: "ĐỀ BÀI\nCho sẵn `item = \"sách\"`, `count = 3`; không có INPUT bên ngoài. Thêm phần còn thiếu để Python thay hai biểu thức trong `{}`. OUTPUT đúng là `Có 3 quyển sách`.", expectOut: /^Có 3 quyển sách$/, solution: "item = \"sách\"\ncount = 3\nprint(f\"Có {count} quyển {item}\")\n" }),
  { checkpoint: { text: "`print(a, b)` in nhiều giá trị và tự ngăn chúng bằng khoảng trắng. F-string có mẫu `f\"... {expression} ...\"` để đặt giá trị vào đúng vị trí trong chuỗi." } },
  { quiz: { title: "Tạo câu OUTPUT", questions: [
    { q: "Cho `name = \"Bình\"`, `level = 4`. Dòng nào in đúng `Bình đang ở tầng 4`?", a: ["`print(f\"{name} đang ở tầng {level}\")`", "`print(\"{name} đang ở tầng {level}\")`", "`input(name, level)`"], correct: 0 },
  ] } },
  ...task({ label: "standard_receipt_project.py", starter: "name = input(\"Tên món: \" )\nprice = float(input(\"Đơn giá: \"))\ncount = int(input(\"Số lượng: \"))\n\n# Tính total rồi in một câu bằng f-string.\n", note: "XƯỞNG PHÉP\nBa INPUT thật lần lượt là `bút`, `2.5`, `4`. PROCESS: đọc đúng kiểu, tính `price * count`, rồi dùng f-string. OUTPUT chính xác là `4 bút: 10.0`.", sampleInput: ["bút", "2.5", "4"], expectOut: /^4 bút: 10\.0$/, solution: "name = input(\"Tên món: \" )\nprice = float(input(\"Đơn giá: \"))\ncount = int(input(\"Số lượng: \"))\n\ntotal = price * count\nprint(f\"{count} {name}: {total}\")\n" }),
];

export default learningBranch({ id: "branchSTANDARDIO", title: "NHÁNH PYTHON CHUẨN", subtitle: "int(input()), float(input()), print nhiều giá trị và f-string", machineName: "MÁY NHẬP XUẤT CHUẨN", machineBlurb: "đọc dữ liệu bằng input(), đổi đúng kiểu rồi trình bày OUTPUT bằng print()", cells });
