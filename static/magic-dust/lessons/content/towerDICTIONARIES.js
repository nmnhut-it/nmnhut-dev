import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut });
const tasks = [
  t(1, "Tra Khóa Vắng Mặt", "dict01.py", "stock = {\"pen\": 4}\n# Tra book, mặc định 0.\n", "ĐỀ BÀI\nCho sẵn dictionary chưa có book; không có INPUT. PROCESS: dùng `get(\"book\", 0)`. OUTPUT phải là `0`.", "stock = {\"pen\": 4}\namount = stock.get(\"book\", 0)\nprint(amount)\n", /^0$/),
  t(2, "Liệt Kê Khóa", "dict02.py", "hero = {\"name\": \"Pip\", \"level\": 3}\n# In từng khóa theo thứ tự.\n", "ĐỀ BÀI\nCho sẵn dictionary; không có INPUT. PROCESS: duyệt `keys()`. OUTPUT là `name` rồi `level`.", "hero = {\"name\": \"Pip\", \"level\": 3}\nfor key in hero.keys():\n    print(key)\n", { all: [{ minLines: 2 }, /^name$/, /^level$/] }),
  t(3, "Tổng Mọi Giá Trị", "dict03.py", "stock = {\"pen\": 3, \"book\": 2, \"eraser\": 4}\ntotal = 0\n# Duyệt values và cộng.\n", "ĐỀ BÀI\nCho sẵn ba số lượng; không có INPUT. PROCESS: duyệt `values()` và cộng bằng `+=`. OUTPUT phải là `9`.", "stock = {\"pen\": 3, \"book\": 2, \"eraser\": 4}\ntotal = 0\nfor amount in stock.values():\n    total += amount\nprint(total)\n", /^9$/),
  t(4, "In Cặp Dữ Liệu", "dict04.py", "scores = {\"An\": 8, \"Bình\": 9}\n# Duyệt items và in tên, điểm.\n", "ĐỀ BÀI\nCho sẵn hai cặp; không có INPUT. PROCESS: dùng `for name, score in scores.items()`. OUTPUT là `An 8`, `Bình 9`.", "scores = {\"An\": 8, \"Bình\": 9}\nfor name, score in scores.items():\n    print(name, score)\n", { all: [{ minLines: 2 }, /^An 8$/, /^Bình 9$/] }),
  t(6, "Phát Hiện None", "dict06.py", "profile = {\"name\": \"Pip\"}\nlevel = profile.get(\"level\")\n# Nếu là None, in MISSING.\n", "ĐỀ BÀI\nCho sẵn profile thiếu level; không có INPUT. PROCESS: kiểm tra `is None`. OUTPUT phải là MISSING.", "profile = {\"name\": \"Pip\"}\nlevel = profile.get(\"level\")\nif level is None:\n    print(\"MISSING\")\nelse:\n    print(level)\n", /^MISSING$/),
  t(7, "Lọc Món Còn Hàng", "dict07.py", "stock = {\"pen\": 2, \"book\": 0, \"map\": 1}\n# In món có số lượng > 0.\n", "ĐỀ BÀI\nCho sẵn kho hàng; không có INPUT. PROCESS: duyệt items, chỉ in giá trị dương. OUTPUT là `pen 2`, `map 1`.", "stock = {\"pen\": 2, \"book\": 0, \"map\": 1}\nfor name, amount in stock.items():\n    if amount > 0:\n        print(name, amount)\n", { all: [{ minLines: 2 }, /^pen 2$/, /^map 1$/] }),
  t(8, "Tìm Điểm Cao Nhất", "dict08.py", "scores = {\"An\": 7, \"Bình\": 9, \"Chi\": 8}\nbest_name = \"\"\nbest_score = -1\n# Duyệt items để tìm cặp có điểm lớn nhất.\n", "ĐỀ BÀI\nCho sẵn ba điểm; không có INPUT. PROCESS: duyệt items, cập nhật tên và điểm khi gặp giá trị lớn hơn. OUTPUT phải là `Bình 9`.", "scores = {\"An\": 7, \"Bình\": 9, \"Chi\": 8}\nbest_name = \"\"\nbest_score = -1\nfor name, score in scores.items():\n    if score > best_score:\n        best_name = name\n        best_score = score\nprint(best_name, best_score)\n", /^Bình 9$/),
  t(9, "Cập Nhật Có Mặc Định", "dict09.py", "counts = {}\nletters = \"KOTO\"\n# Đếm chữ bằng get(letter, 0) + 1.\n", "ĐỀ BÀI\nCho sẵn chuỗi KOTO và dictionary rỗng; không có INPUT. PROCESS: mỗi ký tự cập nhật số đếm bằng `get(..., 0)`. OUTPUT phải là `{'K': 1, 'O': 2, 'T': 1}`.", "counts = {}\nletters = \"KOTO\"\nfor letter in letters:\n    counts[letter] = counts.get(letter, 0) + 1\nprint(counts)\n", /^\{'K': 1, 'O': 2, 'T': 1\}$/),
];
const explanations = {
  1: [
    { match: "stock =", text: "Dictionary chỉ có khóa `pen`; cố tra `book` bằng dấu ngoặc sẽ làm chương trình báo lỗi." },
    { match: "amount =", text: "`get(\"book\", 0)` không tìm thấy khóa nên dùng giá trị mặc định 0 và gán nó vào `amount`." },
    { match: "print(amount)", text: "In 0 để chương trình trả lời rõ ràng rằng số lượng book hiện tại bằng không." },
  ],
  2: [
    { match: "hero =", text: "Dictionary lưu hai cặp theo thứ tự `name` rồi `level`." },
    { match: "for key", text: "`keys()` cho lần lượt hai khóa; mỗi lượt đặt khóa hiện tại vào biến `key`." },
    { match: "print(key)", text: "In chính khóa, nên OUTPUT cho biết cấu trúc của dictionary chứ không phải các giá trị Pip và 3." },
  ],
  3: [
    { match: "stock =", text: "Ba giá trị số lượng 3, 2, 4 là dữ liệu cần cộng; tên món không tham gia phép tính." },
    { match: "total =", text: "Khởi tạo tổng ở 0 trước khi nhận bất kỳ số lượng nào." },
    { match: "for amount", text: "`values()` đưa thẳng từng số 3, 2, 4 vào `amount`, nên không cần tra lại bằng khóa." },
    { match: "total +=", text: "Cập nhật tổng qua từng lượt: 0 thành 3, rồi 5, cuối cùng 9." },
    { match: "print(total)", text: "In sau vòng lặp để nhận tổng của toàn bộ dictionary, không phải tổng tạm giữa chừng." },
  ],
  4: [
    { match: "scores =", text: "Dictionary liên kết mỗi tên với đúng điểm của người đó." },
    { match: "for name", text: "`items()` cho từng cặp; Python đặt phần khóa vào `name` và phần giá trị vào `score`." },
    { match: "print(name", text: "Mỗi lượt in hai phần của cùng một cặp, nên tên không bị ghép nhầm với điểm khác." },
  ],
  6: [
    { match: "profile =", text: "Profile chỉ có tên và chưa lưu khóa `level`." },
    { match: "level =", text: "`get(\"level\")` không có giá trị mặc định, nên trả về `None` khi khóa vắng mặt." },
    { match: "if level", text: "`is None` kiểm tra đúng giá trị đặc biệt biểu thị chưa có dữ liệu." },
    { match: "print(\"MISSING", text: "Nhánh này chạy vì level chưa tồn tại, tạo OUTPUT `MISSING`." },
    { match: "else:", text: "`else` giữ trường hợp profile đã có một level thật sự." },
    { match: "print(level)", text: "Dòng này chỉ in số level khi kết quả không phải None; ở dữ liệu hiện tại nó không chạy." },
  ],
  7: [
    { match: "stock =", text: "Kho có hai món còn hàng và `book` có số lượng 0." },
    { match: "for name", text: "Mỗi lượt nhận đồng thời tên món và số lượng từ `items()`." },
    { match: "if amount", text: "Chỉ cho phép số lượng lớn hơn 0 đi tiếp, nên món hết hàng không được in." },
    { match: "print(name", text: "In `pen 2` và `map 1`; cặp `book 0` bị loại bởi điều kiện." },
  ],
  8: [
    { match: "scores =", text: "Dictionary chứa ba ứng viên cần so sánh theo điểm." },
    { match: "best_name =", text: "Tên tốt nhất bắt đầu rỗng vì chưa duyệt ứng viên nào." },
    { match: "best_score =", text: "Bắt đầu điểm mốc ở -1, thấp hơn mọi điểm cho sẵn, để ứng viên đầu tiên chắc chắn được nhận." },
    { match: "for name", text: "Duyệt từng cặp tên–điểm cùng nhau bằng `items()`." },
    { match: "if score", text: "Chỉ cập nhật khi điểm hiện tại lớn hơn điểm tốt nhất đã thấy trước đó." },
    { match: "best_name = name", text: "Giữ lại tên đi cùng điểm mới cao hơn; khi gặp Bình, tên tốt nhất đổi thành `Bình`." },
    { match: "best_score = score", text: "Cập nhật mốc lên điểm mới để các lượt sau phải vượt qua 9 mới thay thế được." },
    { match: "print(best_name", text: "Sau khi duyệt hết, in cặp tốt nhất còn giữ lại là `Bình 9`." },
  ],
  9: [
    { match: "counts =", text: "Dictionary rỗng sẽ dần lưu số lần xuất hiện của mỗi chữ." },
    { match: "letters =", text: "Chuỗi KOTO cung cấp bốn lượt dữ liệu, trong đó O xuất hiện hai lần." },
    { match: "for letter", text: "Mỗi lượt chọn một ký tự làm khóa đang cần cập nhật." },
    { match: "counts[letter]", text: "`get(letter, 0)` lấy số đếm cũ hoặc 0 nếu khóa mới; cộng 1 rồi gán lại vào đúng khóa đó." },
    { match: "print(counts)", text: "Dictionary cuối cùng ghi K một lần, O hai lần, T một lần, đúng theo thứ tự gặp đầu tiên." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });
const bosses = {
  5: { name: "KẺ ĐÁNH CẮP KHÓA", glyph: "{}", quiz: [
    { q: "`data.get(\"x\", 0)` trả gì khi x vắng mặt?", a: ["0", "None trong mọi trường hợp", "Máy luôn báo lỗi"], correct: 0 },
    { q: "Công cụ nào cho từng cặp khóa–giá trị?", a: ["`items()`", "`keys()`", "`values()`"], correct: 0 },
    { q: "Duyệt trực tiếp `for key in data` nhận gì?", a: ["Khóa", "Giá trị", "Cả khóa và giá trị"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP TỪ ĐIỂN", glyph: "◇", quiz: [
    { q: "Cho `data = {}` và `result = data.get(\"score\")`. Điều kiện nào đúng với kết quả vừa nhận?", a: ["`result is None`", "`result == False`", "`result is 0`"], correct: 0 },
    { q: "Mẫu nào nhận cả name và score?", a: ["`for name, score in data.items():`", "`for name in data.values():`", "`for score in data.keys():`"], correct: 0 },
    { q: "Cho `counts = {}` và ký tự đầu tiên là `K`. Dòng nào tạo khóa `K` với số đếm 1 mà không làm máy báo lỗi?", a: ["`counts[ch] = counts.get(ch, 0) + 1`", "`counts[ch] = counts[ch] + 1`", "`counts.get(ch)` không cần gán"], correct: 0 },
  ] },
};
export default makeTower({ id: "towerDICTIONARIES", title: "THÁP TỪ ĐIỂN", subtitle: "10 tầng tra cứu, duyệt và tổng hợp dictionary", intro: "THÁP TỪ ĐIỂN buộc bạn dùng `get`, `keys`, `values`, `items` và `None` để xử lý dữ liệu thiếu hoặc nhiều cặp.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
