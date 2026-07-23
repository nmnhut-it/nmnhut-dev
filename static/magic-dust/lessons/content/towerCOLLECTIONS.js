import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut });
const tasks = [
  t(1, "Nối Hai Túi Đồ", "col01.py", "bag = [\"key\"]\nmore = [\"map\", \"gem\"]\n# Nối từng phần tử của more rồi thêm coin.\n", "ĐỀ BÀI\nCho sẵn hai list; không có INPUT. PROCESS: dùng `extend(more)` rồi `append(\"coin\")`. OUTPUT phải là `['key', 'map', 'gem', 'coin']`.", "bag = [\"key\"]\nmore = [\"map\", \"gem\"]\nbag.extend(more)\nbag.append(\"coin\")\nprint(bag)\n", /^\['key', 'map', 'gem', 'coin'\]$/),
  t(2, "Lấy Đầu Và Cuối", "col02.py", "queue = [10, 20, 30, 40]\n# Pop đầu và cuối, rồi in list còn lại.\n", "ĐỀ BÀI\nCho sẵn list bốn số; không có INPUT. PROCESS: `pop(0)` lấy đầu, `pop()` lấy cuối. OUTPUT là `10 40` rồi `[20, 30]`.", "queue = [10, 20, 30, 40]\nfirst = queue.pop(0)\nlast = queue.pop()\nprint(first, last)\nprint(queue)\n", { all: [{ minLines: 2 }, /^10 40$/, /^\[20, 30\]$/] }),
  t(3, "Đếm Và Tìm", "col03.py", "items = [\"a\", \"b\", \"a\", \"c\"]\n# In số lần có a và index của c.\n", "ĐỀ BÀI\nCho sẵn list bốn chữ; không có INPUT. PROCESS: dùng `count` và `index`. OUTPUT là `2` rồi `3`.", "items = [\"a\", \"b\", \"a\", \"c\"]\nprint(items.count(\"a\"))\nprint(items.index(\"c\"))\n", { all: [{ minLines: 2 }, /^2$/, /^3$/] }),
  t(4, "Sắp Xếp Không Phá Bản Gốc", "col04.py", "scores = [9, 4, 7]\n# Tạo bản tăng dần, giữ scores nguyên.\n", "ĐỀ BÀI\nCho sẵn ba điểm; không có INPUT. PROCESS: dùng `sorted`, sau đó in list gốc và list mới. OUTPUT là `[9, 4, 7]` rồi `[4, 7, 9]`.", "scores = [9, 4, 7]\nordered = sorted(scores)\nprint(scores)\nprint(ordered)\n", { all: [{ minLines: 2 }, /^\[9, 4, 7\]$/, /^\[4, 7, 9\]$/] }),
  t(6, "Bảng Thống Kê", "col06.py", "values = [4, 8, 1, 7]\n# In tổng, nhỏ nhất, lớn nhất.\n", "ĐỀ BÀI\nCho sẵn list số; không có INPUT. PROCESS: dùng `sum`, `min`, `max`. OUTPUT là `20 1 8`.", "values = [4, 8, 1, 7]\nprint(sum(values), min(values), max(values))\n", /^20 1 8$/),
  t(7, "Đánh Số Từ Một", "col07.py", "names = [\"An\", \"Bình\", \"Chi\"]\n# Dùng enumerate, in số thứ tự bắt đầu từ 1.\n", "ĐỀ BÀI\nCho sẵn ba tên; không có INPUT. PROCESS: dùng `enumerate`, in `index + 1`. OUTPUT là `1 An`, `2 Bình`, `3 Chi`.", "names = [\"An\", \"Bình\", \"Chi\"]\nfor index, name in enumerate(names):\n    print(index + 1, name)\n", { all: [{ minLines: 3 }, /^1 An$/, /^2 Bình$/, /^3 Chi$/] }),
  t(8, "Lọc Tên File Python", "col08.py", "files = [\"main.py\", \"notes.txt\", \"test.py\"]\n# Chỉ in tên kết thúc bằng .py.\n", "ĐỀ BÀI\nCho sẵn list tên file; không có INPUT. PROCESS: duyệt list và dùng `endswith(\".py\")`. OUTPUT là `main.py` rồi `test.py`.", "files = [\"main.py\", \"notes.txt\", \"test.py\"]\nfor filename in files:\n    if filename.endswith(\".py\"):\n        print(filename)\n", { all: [{ minLines: 2 }, /^main\.py$/, /^test\.py$/] }),
  t(9, "Kho Mã Hợp Lệ", "col09.py", "codes = [\"MD-12\", \"XX\", \"MD-7A\", \"MD-88\"]\nvalid = []\n# Chọn mã bắt đầu MD- và phần sau chỉ có số.\n", "ĐỀ BÀI\nCho sẵn bốn mã; không có INPUT. PROCESS: dùng `startswith`, slice và `isdigit`, append mã hợp lệ. OUTPUT phải là `['MD-12', 'MD-88']`.", "codes = [\"MD-12\", \"XX\", \"MD-7A\", \"MD-88\"]\nvalid = []\nfor code in codes:\n    if code.startswith(\"MD-\") and code[3:].isdigit():\n        valid.append(code)\nprint(valid)\n", /^\['MD-12', 'MD-88'\]$/),
];
const explanations = {
  1: [
    { match: "bag =", text: "`bag` bắt đầu với một phần tử `key`; đây là list sẽ được thay đổi." },
    { match: "more =", text: "`more` giữ hai phần tử cần nối riêng lẻ vào túi đồ." },
    { match: "bag.extend", text: "`extend(more)` lấy lần lượt `map` và `gem` từ `more`, thêm thành hai ô mới ở cuối `bag`." },
    { match: "bag.append", text: "`append(\"coin\")` thêm đúng một phần tử `coin` sau ba phần tử hiện có." },
    { match: "print(bag)", text: "In trạng thái cuối của list để kiểm tra cả thứ tự lẫn số phần tử." },
  ],
  2: [
    { match: "queue =", text: "`queue` giữ hàng đợi bốn số theo thứ tự từ đầu đến cuối." },
    { match: "first =", text: "`pop(0)` lấy giá trị ở index 0 là 10 và đồng thời xóa nó khỏi list." },
    { match: "last =", text: "Sau lần xóa đầu, `pop()` lấy phần tử cuối còn lại là 40." },
    { match: "print(first", text: "In hai giá trị đã lấy ra để chứng minh `pop` vừa trả về dữ liệu vừa xóa nó." },
    { match: "print(queue)", text: "List còn `[20, 30]`, cho thấy hai phần tử giữa được giữ nguyên." },
  ],
  3: [
    { match: "items =", text: "List có hai lần xuất hiện của `a` và một `c` ở index 3." },
    { match: "count(\"a", text: "`count(\"a\")` duyệt nội dung và trả về số lần xuất hiện là 2." },
    { match: "index(\"c", text: "`index(\"c\")` trả về vị trí đầu tiên của c; vì list đếm từ 0 nên kết quả là 3." },
  ],
  4: [
    { match: "scores =", text: "`scores` giữ thứ tự ban đầu 9, 4, 7 để lát nữa kiểm tra nó có bị thay đổi hay không." },
    { match: "ordered =", text: "`sorted(scores)` tạo một list mới tăng dần và gán nó vào `ordered`; nó không sửa `scores`." },
    { match: "print(scores)", text: "In list gốc trước, xác nhận thứ tự vẫn là `[9, 4, 7]`." },
    { match: "print(ordered)", text: "In list mới đã sắp xếp là `[4, 7, 9]`." },
  ],
  6: [
    { match: "values =", text: "`values` chứa toàn bộ bốn số dùng cho ba phép tổng hợp." },
    { match: "print(sum", text: "`sum` tính 20, `min` lấy 1, `max` lấy 8; một `print()` đặt ba kết quả trên cùng một dòng." },
  ],
  7: [
    { match: "names =", text: "List giữ ba tên theo thứ tự cần đánh số." },
    { match: "for index", text: "`enumerate(names)` cung cấp cả index 0, 1, 2 và tên tương ứng trong mỗi lượt." },
    { match: "print(index", text: "Cộng 1 vào index chỉ khi trình bày để số thứ tự bắt đầu từ 1; vị trí thật trong list vẫn bắt đầu từ 0." },
  ],
  8: [
    { match: "files =", text: "List chứa hai file Python và một file văn bản, giữ nguyên thứ tự cần duyệt." },
    { match: "for filename", text: "Mỗi lượt đưa một tên file vào `filename`." },
    { match: "if filename", text: "`endswith(\".py\")` chỉ đúng khi phần cuối tên file chính xác là hậu tố `.py`." },
    { match: "print(filename)", text: "Chỉ `main.py` và `test.py` đạt điều kiện nên được in; `notes.txt` bị bỏ qua." },
  ],
  9: [
    { match: "codes =", text: "List chứa hai mã hợp lệ và hai trường hợp sai khác nhau để kiểm tra cả hai điều kiện." },
    { match: "valid =", text: "Bắt đầu list kết quả rỗng vì chưa kiểm tra mã nào." },
    { match: "for code", text: "Duyệt từng mã theo thứ tự gốc để list kết quả giữ cùng thứ tự." },
    { match: "if code.startswith", text: "Điều kiện thứ nhất yêu cầu đầu `MD-`; điều kiện thứ hai cắt phần sau index 3 và đòi mọi ký tự đều là chữ số." },
    { match: "valid.append", text: "Chỉ khi cả hai điều kiện đúng mới thêm nguyên mã vào list `valid`." },
    { match: "print(valid)", text: "Sau khi duyệt hết, list chỉ còn `MD-12` và `MD-88`, đúng hai mã hợp lệ." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });
const bosses = {
  5: { name: "QUÁI LIST LỒNG", glyph: "[]", quiz: [
    { q: "Muốn thêm từng phần tử của `[2, 3]` vào list `a`, dùng gì?", a: ["`a.extend([2, 3])`", "`a.append([2, 3])`", "`a.insert([2, 3])`"], correct: 0 },
    { q: "Lệnh nào lấy và xóa phần tử cuối?", a: ["`a.pop()`", "`a.remove()`", "`a.clear()`"], correct: 0 },
    { q: "Lệnh nào tạo list mới đã sắp xếp và giữ list cũ nguyên?", a: ["`sorted(a)`", "`a.sort()`", "`a.reverse()`"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP COLLECTION", glyph: "Σ", quiz: [
    { q: "Cho `a = [3, 8, 2]`. `sum(a), min(a), max(a)` cho gì?", a: ["13, 2, 8", "13, 8, 2", "3, 8, 2"], correct: 0 },
    { q: "Điều kiện nào nhận đúng tên file `game.py`?", a: ["`name.endswith(\".py\")`", "`name.isdigit()`", "`name.startswith(\".py\")`"], correct: 0 },
    { q: "`enumerate(names)` giúp mỗi lượt nhận gì?", a: ["Index và phần tử", "Chỉ tổng số phần tử", "List đã sắp xếp"], correct: 0 },
  ] },
};
export default makeTower({ id: "towerCOLLECTIONS", title: "THÁP COLLECTION", subtitle: "10 tầng list, tổng hợp và kiểm tra chuỗi", intro: "THÁP COLLECTION trộn các dụng cụ list với vòng lặp và phép kiểm tra chuỗi. Không có lệnh mới; mỗi tầng là một bài xử lý dữ liệu hoàn chỉnh.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
