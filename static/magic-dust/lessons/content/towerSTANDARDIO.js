import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut, sampleInput) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut, sampleInput });
const tasks = [
  t(1, "Tuổi Năm Sau", "stdio01.py", "age = input(\"Tuổi: \" )\n# Chuyển INPUT thành int, cộng 1 rồi in.\n", "ĐỀ BÀI\nINPUT thật là `14`. PROCESS: dùng `int(input(...))`, cộng 1. OUTPUT phải là `15`.", "age = int(input(\"Tuổi: \"))\nnext_age = age + 1\nprint(next_age)\n", /^15$/, "14"),
  t(2, "Hai Vé Tàu", "stdio02.py", "price = input(\"Giá vé: \" )\n# Tính giá hai vé.\n", "ĐỀ BÀI\nINPUT thật là `7.5`. PROCESS: đọc bằng `float(input(...))`, nhân 2. OUTPUT phải là `15.0`.", "price = float(input(\"Giá vé: \"))\ntotal = price * 2\nprint(total)\n", /^15\.0$/, "7.5"),
  t(3, "Bảng Điểm Một Dòng", "stdio03.py", "name = \"An\"\nscore = 8\n# Dùng print với nhiều giá trị.\n", "ĐỀ BÀI\nCho sẵn tên và điểm; không có INPUT. PROCESS: dùng một `print()` với nhiều đối số. OUTPUT phải là `An 8 điểm`.", "name = \"An\"\nscore = 8\nprint(name, score, \"điểm\")\n", /^An 8 điểm$/),
  t(4, "Nhãn Hành Trang", "stdio04.py", "item = \"gem\"\ncount = 4\n# In bằng f-string.\n", "ĐỀ BÀI\nCho sẵn `item` và `count`; không có INPUT. PROCESS: tạo f-string. OUTPUT phải là `Có 4 gem`.", "item = \"gem\"\ncount = 4\nprint(f\"Có {count} {item}\")\n", /^Có 4 gem$/),
  t(6, "Hóa Đơn Ba INPUT", "stdio06.py", "name = input(\"Món: \" )\nprice = input(\"Giá: \" )\ncount = input(\"Số lượng: \" )\n# Đổi kiểu, tính total và in bằng f-string.\n", "ĐỀ BÀI\nBa INPUT thật là `vở`, `6.5`, `3`. PROCESS: giữ tên là chuỗi, đổi giá thành float, số lượng thành int, tính tổng. OUTPUT phải là `3 vở = 19.5`.", "name = input(\"Món: \" )\nprice = float(input(\"Giá: \"))\ncount = int(input(\"Số lượng: \"))\ntotal = price * count\nprint(f\"{count} {name} = {total}\")\n", /^3 vở = 19\.5$/, ["vở", "6.5", "3"]),
  t(7, "Đổi Nhiệt Độ", "stdio07.py", "celsius = input(\"Độ C: \" )\n# Đổi kiểu và tính F = C * 9 / 5 + 32.\n", "ĐỀ BÀI\nINPUT thật là `25`. PROCESS: đọc float và tính theo công thức đã cho. OUTPUT phải là `25.0 C = 77.0 F` bằng f-string.", "celsius = float(input(\"Độ C: \"))\nfahrenheit = celsius * 9 / 5 + 32\nprint(f\"{celsius} C = {fahrenheit} F\")\n", /^25\.0 C = 77\.0 F$/, "25"),
  t(8, "Trung Bình Ba Điểm", "stdio08.py", "first = input(\"Điểm 1: \" )\nsecond = input(\"Điểm 2: \" )\nthird = input(\"Điểm 3: \" )\n# Đổi kiểu rồi tính trung bình.\n", "ĐỀ BÀI\nBa INPUT thật là `6`, `8`, `10`. PROCESS: đổi cả ba thành float, cộng rồi chia 3. OUTPUT phải là `Average: 8.0`.", "first = float(input(\"Điểm 1: \"))\nsecond = float(input(\"Điểm 2: \"))\nthird = float(input(\"Điểm 3: \"))\naverage = (first + second + third) / 3\nprint(\"Average:\", average)\n", /^Average: 8\.0$/, ["6", "8", "10"]),
  t(9, "Thẻ Người Chơi", "stdio09.py", "name = input(\"Tên: \" )\nlevel = input(\"Cấp: \" )\nenergy = input(\"Năng lượng: \" )\n# Đổi hai số và in một f-string.\n", "ĐỀ BÀI\nBa INPUT thật là `Pip`, `5`, `12.5`. PROCESS: đổi level thành int, energy thành float. OUTPUT phải là `Pip | level 5 | energy 12.5`.", "name = input(\"Tên: \" )\nlevel = int(input(\"Cấp: \"))\nenergy = float(input(\"Năng lượng: \"))\nprint(f\"{name} | level {level} | energy {energy}\")\n", /^Pip \| level 5 \| energy 12\.5$/, ["Pip", "5", "12.5"]),
];

const explanations = {
  1: [
    { match: "age = int", text: "`input()` nhận phần người học gõ dưới dạng chuỗi; `int(...)` đổi chuỗi `14` thành số nguyên 14 và gán vào `age`." },
    { match: "next_age =", text: "Lấy tuổi hiện tại trong `age`, cộng thêm 1 rồi giữ kết quả 15 trong `next_age`." },
    { match: "print(next_age)", text: "In giá trị đã tính, nên OUTPUT chứng minh phép chuyển kiểu và phép cộng đều đúng." },
  ],
  2: [
    { match: "price = float", text: "Giá vé có thể có phần thập phân, nên `float(input(...))` giữ được INPUT `7.5` thay vì yêu cầu số nguyên." },
    { match: "total =", text: "Nhân giá của một vé với 2 để tính đúng số tiền cho hai vé." },
    { match: "print(total)", text: "In `total`; Python biểu diễn kết quả float này là `15.0`." },
  ],
  3: [
    { match: "name =", text: "Gán sẵn chuỗi tên người chơi vào `name`; đây là dữ kiện, không phải INPUT từ bên ngoài." },
    { match: "score =", text: "Gán sẵn điểm số nguyên 8 vào `score`." },
    { match: "print(name", text: "Truyền ba giá trị cho cùng một `print()`; Python tự đặt khoảng trắng giữa `An`, `8` và `điểm`." },
  ],
  4: [
    { match: "item =", text: "`item` giữ tên món đồ sẽ xuất hiện trong câu kết quả." },
    { match: "count =", text: "`count` giữ số lượng 4 dưới dạng số nguyên." },
    { match: "print(f", text: "Chữ `f` cho phép Python thay `{count}` và `{item}` bằng giá trị hiện tại, tạo đúng một chuỗi OUTPUT hoàn chỉnh." },
  ],
  6: [
    { match: "name = input", text: "Tên món vẫn là chữ nên giữ nguyên chuỗi mà `input()` trả về." },
    { match: "price = float", text: "Đơn giá `6.5` cần phần thập phân, vì vậy chuyển INPUT bằng `float`." },
    { match: "count = int", text: "Số lượng là số nguyên, vì vậy chuyển INPUT `3` bằng `int`." },
    { match: "total =", text: "Nhân đơn giá 6.5 với số lượng 3 để nhận tổng tiền 19.5." },
    { match: "print(f", text: "F-string đặt số lượng, tên món và tổng tiền vào đúng vị trí của hóa đơn." },
  ],
  7: [
    { match: "celsius = float", text: "Đọc nhiệt độ dưới dạng float để công thức vẫn dùng được với INPUT có phần thập phân." },
    { match: "fahrenheit =", text: "Thực hiện đúng công thức đổi độ: nhân 9, chia 5, rồi cộng 32; với 25.0 kết quả là 77.0." },
    { match: "print(f", text: "F-string trình bày cả giá trị ban đầu lẫn kết quả đổi đơn vị trên một dòng dễ kiểm tra." },
  ],
  8: [
    { match: "first = float", text: "Chuyển điểm thứ nhất thành float để phép chia trung bình cho kết quả thập phân khi cần." },
    { match: "second = float", text: "Đọc và chuyển riêng điểm thứ hai; mỗi lần gọi `input()` lấy một INPUT tiếp theo." },
    { match: "third = float", text: "Đọc điểm thứ ba, hoàn tất ba dữ kiện cần cho phép tính." },
    { match: "average =", text: "Dấu ngoặc cộng đủ ba điểm trước; sau đó chia tổng 24.0 cho 3 để được 8.0." },
    { match: "print(\"Average", text: "`print()` nhận nhãn và số trung bình như hai giá trị, tự thêm khoảng trắng thành `Average: 8.0`." },
  ],
  9: [
    { match: "name = input", text: "Tên người chơi là dữ liệu chữ nên không cần chuyển kiểu." },
    { match: "level = int", text: "Cấp độ phải dùng như số nguyên, nên chuyển INPUT bằng `int`." },
    { match: "energy = float", text: "Năng lượng có thể là `12.5`, nên chuyển bằng `float` để không mất phần thập phân." },
    { match: "print(f", text: "F-string ghép ba biến khác kiểu vào một thẻ người chơi mà không cần tự gọi `str()`." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });

const bosses = {
  5: { name: "KẺ NUỐT DỮ LIỆU", glyph: "⌨", quiz: [
    { q: "INPUT là `3.5`. Dòng nào đọc được giá trị để nhân với 2?", a: ["`value = float(input(\"> \"))`", "`value = int(input(\"> \"))`", "`value = print(3.5)`"], correct: 0 },
    { q: "Cho `name = \"An\"`, `score = 9`. Dòng nào in `An: 9`?", a: ["`print(f\"{name}: {score}\")`", "`print(\"{name}: {score}\")`", "`input(name, score)`"], correct: 0 },
    { q: "`print(\"A\", 3, \"B\")` tạo OUTPUT nào?", a: ["`A 3 B`", "`A3B`", "`A, 3, B`"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP NHẬP XUẤT", glyph: "▣", quiz: [
    { q: "Hai INPUT là `2.5` và `4`. Đoạn code `price = float(input()); count = int(input()); print(price * count)` in gì?", a: ["`10.0`", "`2.54`", "`10` dưới dạng chuỗi"], correct: 0 },
    { q: "Cho `count = 2`, `item = \"book\"`. F-string nào tạo `2 book`?", a: ["`f\"{count} {item}\"`", "`\"{count} {item}\"`", "`f(count + item)`"], correct: 0 },
    { q: "Người dùng có thể gõ `12.75`. Cách chuyển kiểu nào giữ được phần thập phân?", a: ["`float(input())`", "`int(input())`", "`print(input())`"], correct: 0 },
  ] },
};

export default makeTower({ id: "towerSTANDARDIO", title: "THÁP NHẬP XUẤT", subtitle: "10 tầng đọc đúng kiểu và trình bày OUTPUT", intro: "Tháp này chỉ dùng `input`, `int`, `float`, `print` và f-string đã học ở NHÁNH PYTHON CHUẨN. Mỗi tầng buộc bạn tự nối INPUT với PROCESS rồi chứng minh bằng OUTPUT.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
