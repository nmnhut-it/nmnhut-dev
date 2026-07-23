import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut });
const tasks = [
  t(1, "Kiểm Tra Chẵn", "op01.py", "number = 38\n# Dùng phần dư để in EVEN hoặc ODD.\n", "ĐỀ BÀI\nCho sẵn `number = 38`; không có INPUT. PROCESS: dùng `% 2` trong điều kiện. OUTPUT phải là `EVEN`.", "number = 38\nif number % 2 == 0:\n    print(\"EVEN\")\nelse:\n    print(\"ODD\")\n", /^EVEN$/),
  t(2, "Đổi Giây", "op02.py", "seconds = 367\n# Tính phút đầy và giây còn lại.\n", "ĐỀ BÀI\nCho sẵn 367 giây; không có INPUT. PROCESS: dùng `// 60` và `% 60`. OUTPUT phải là `6 phút 7 giây`.", "seconds = 367\nminutes = seconds // 60\nleft = seconds % 60\nprint(minutes, \"phút\", left, \"giây\")\n", /^6 phút 7 giây$/),
  t(3, "Diện Tích Hình Vuông", "op03.py", "side = 9\n# Dùng ** để tính bình phương.\n", "ĐỀ BÀI\nCho sẵn cạnh 9; không có INPUT. PROCESS: dùng lũy thừa bậc 2. OUTPUT phải là `81`.", "side = 9\narea = side ** 2\nprint(area)\n", /^81$/),
  t(4, "Dấu Ngoặc Cứu Hộ", "op04.py", "base = 7\nbonus = 3\nmultiplier = 4\n# Tính (base + bonus) * multiplier.\n", "ĐỀ BÀI\nCho sẵn ba giá trị; không có INPUT. PROCESS: dùng dấu ngoặc để cộng trước rồi nhân. OUTPUT phải là `40`.", "base = 7\nbonus = 3\nmultiplier = 4\nresult = (base + bonus) * multiplier\nprint(result)\n", /^40$/),
  t(6, "Năng Lượng Qua Ba Trạm", "op06.py", "energy = 5\n# Mỗi trạm cộng 3 bằng +=, có 3 trạm.\n", "ĐỀ BÀI\nCho sẵn năng lượng 5; không có INPUT. PROCESS: vòng for ba lượt, mỗi lượt `energy += 3`. OUTPUT phải là `14`.", "energy = 5\nfor station in range(3):\n    energy += 3\nprint(energy)\n", /^14$/),
  t(7, "Mật Mã Có Dấu Gạch", "op07.py", "code = \"MD-2048\"\n# Dùng in và not in để kiểm tra.\n", "ĐỀ BÀI\nCho sẵn mã; không có INPUT. PROCESS: nếu có `-` và không có khoảng trắng thì in `VALID`. OUTPUT phải là `VALID`.", "code = \"MD-2048\"\nif \"-\" in code and \" \" not in code:\n    print(\"VALID\")\nelse:\n    print(\"INVALID\")\n", /^VALID$/),
  t(8, "Tách Chữ Số Cuối", "op08.py", "number = 538\n# In chữ số hàng chục rồi hàng đơn vị.\n", "ĐỀ BÀI\nCho sẵn `538`; không có INPUT. PROCESS: dùng `//` và `%` để lấy hàng chục 3, hàng đơn vị 8. OUTPUT phải là `3 8`.", "number = 538\ntens = number // 10 % 10\nones = number % 10\nprint(tens, ones)\n", /^3 8$/),
  t(9, "Bước Nhảy Bình Phương", "op09.py", "total = 0\n# Cộng bình phương các số 1, 2, 3, 4.\n", "ĐỀ BÀI\nCho sẵn `total = 0`; không có INPUT. PROCESS: dùng for, `** 2` và `+=`. OUTPUT phải là `30`.", "total = 0\nfor number in range(1, 5):\n    total += number ** 2\nprint(total)\n", /^30$/),
];
const explanations = {
  1: [
    { match: "number =", text: "`number` giữ giá trị 38 đang cần phân loại; đây là dữ kiện cho sẵn." },
    { match: "if number %", text: "`number % 2` lấy phần dư khi chia 38 cho 2. Phần dư 0 làm điều kiện bằng nhau đúng, nên số này chẵn." },
    { match: "print(\"EVEN", text: "Nhánh đúng in `EVEN`, là OUTPUT phù hợp với phần dư vừa tính." },
    { match: "else:", text: "`else` giữ toàn bộ trường hợp phần dư khác 0, tức các số lẻ." },
    { match: "print(\"ODD", text: "Dòng này chỉ chạy cho trường hợp lẻ; với 38, nó được bỏ qua." },
  ],
  2: [
    { match: "seconds =", text: "`seconds` giữ tổng thời gian 367 giây cần đổi đơn vị." },
    { match: "minutes =", text: "`367 // 60` lấy 6 nhóm 60 giây đầy đủ, nên có 6 phút trọn vẹn." },
    { match: "left =", text: "`367 % 60` lấy phần còn lại sau 6 phút, tức 7 giây." },
    { match: "print(minutes", text: "In thương và phần dư kèm tên đơn vị, tạo OUTPUT `6 phút 7 giây`." },
  ],
  3: [
    { match: "side =", text: "`side` giữ độ dài cạnh hình vuông là 9." },
    { match: "area =", text: "`side ** 2` là 9 lũy thừa 2, tương đương 9 nhân 9, nên diện tích bằng 81." },
    { match: "print(area)", text: "In diện tích đã tính để đối chiếu với OUTPUT yêu cầu." },
  ],
  4: [
    { match: "base =", text: "`base` giữ sức mạnh nền 7." },
    { match: "bonus =", text: "`bonus` giữ phần cộng thêm 3." },
    { match: "multiplier =", text: "`multiplier` giữ hệ số nhân 4 sẽ áp dụng cho cả tổng." },
    { match: "result =", text: "Dấu ngoặc buộc máy tính `7 + 3` trước; kết quả 10 mới nhân 4 để được 40." },
    { match: "print(result)", text: "In `result` để chứng minh thứ tự phép tính đã được nhóm đúng." },
  ],
  6: [
    { match: "energy =", text: "Bắt đầu với 5 đơn vị năng lượng trước khi đi qua các trạm." },
    { match: "for station", text: "`range(3)` tạo đúng ba lượt, tương ứng ba trạm; giá trị `station` không cần dùng thêm." },
    { match: "energy +=", text: "Mỗi lượt gán lại `energy` bằng giá trị cũ cộng 3: 5 thành 8, rồi 11, rồi 14." },
    { match: "print(energy)", text: "Dòng nằm ngoài vòng lặp nên chỉ in một lần, sau khi đã cộng đủ ba lượt." },
  ],
  7: [
    { match: "code =", text: "`code` giữ chuỗi mã cần kiểm tra là `MD-2048`." },
    { match: "if \"-\"", text: "Điều kiện yêu cầu đồng thời có dấu gạch và không có khoảng trắng; cả hai vế đều đúng với mã đã cho." },
    { match: "print(\"VALID", text: "Vì toàn bộ điều kiện đúng, nhánh `if` in `VALID`." },
    { match: "else:", text: "`else` nhận mọi mã thiếu dấu gạch hoặc có khoảng trắng." },
    { match: "print(\"INVALID", text: "Dòng này không chạy với `MD-2048`, nhưng cung cấp OUTPUT rõ ràng cho trường hợp sai." },
  ],
  8: [
    { match: "number =", text: "`number` giữ số 538; mục tiêu là tách hai chữ số cuối mà không đổi nó thành chuỗi." },
    { match: "tens =", text: "`number // 10` bỏ chữ số cuối, tạo 53; `% 10` tiếp tục lấy chữ số cuối của 53, tức hàng chục 3." },
    { match: "ones =", text: "`number % 10` lấy trực tiếp phần dư khi chia 538 cho 10, tức hàng đơn vị 8." },
    { match: "print(tens", text: "In hai chữ số theo thứ tự hàng chục rồi hàng đơn vị thành `3 8`." },
  ],
  9: [
    { match: "total =", text: "Khởi tạo tổng bằng 0 vì chưa cộng bình phương nào." },
    { match: "for number", text: "`range(1, 5)` đưa `number` lần lượt qua 1, 2, 3, 4; mốc 5 không được lấy." },
    { match: "total +=", text: "Mỗi lượt cộng `number ** 2` vào tổng cũ: 1, rồi 5, rồi 14, cuối cùng 30." },
    { match: "print(total)", text: "Chỉ in sau khi vòng lặp kết thúc, nên OUTPUT là tổng của cả bốn bình phương." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });
const bosses = {
  5: { name: "QUÁI PHẦN DƯ", glyph: "%", quiz: [
    { q: "`23 // 5` và `23 % 5` lần lượt bằng gì?", a: ["4 và 3", "4.6 và 0", "3 và 4"], correct: 0 },
    { q: "`2 + 3 ** 2` bằng bao nhiêu?", a: ["11", "25", "10"], correct: 0 },
    { q: "Dòng nào tăng `score` thêm 5?", a: ["`score += 5`", "`score =+ 5`", "`score **= 5`"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP TOÁN TỬ", glyph: "**", quiz: [
    { q: "Cho `number = 472`. Biểu thức nào lấy chữ số hàng chục là 7?", a: ["`number // 10 % 10`", "`number % 10`", "`number // 100`"], correct: 0 },
    { q: "Điều kiện nào đúng với `code = \"MD-7\"`?", a: ["`\"MD\" in code`", "`\"-\" not in code`", "`\"X\" in code`"], correct: 0 },
    { q: "Cho `x = 2`; sau `x **= 3`, x bằng bao nhiêu?", a: ["8", "6", "5"], correct: 0 },
  ] },
};
export default makeTower({ id: "towerOPERATORS", title: "THÁP TOÁN TỬ", subtitle: "10 tầng thương, dư, lũy thừa và cập nhật biến", intro: "THÁP TOÁN TỬ không dạy ký hiệu mới. Nó trộn `%`, `//`, `**`, dấu ngoặc, phép gán rút gọn và kiểm tra `in` thành các bài nhiều bước.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
