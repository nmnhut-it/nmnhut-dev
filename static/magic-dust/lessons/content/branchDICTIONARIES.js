import { codeTask, learningBranch } from "./python-path-builders.js";

const task = config => codeTask(config);
const cells = [
  { intro: { title: "✦ NHÁNH TỪ ĐIỂN NÂNG CAO ✦", hook: "Một cuốn sổ khóa–giá trị không chỉ để tra bằng dấu ngoặc. Python còn có cách tra an toàn và duyệt toàn bộ dữ liệu.", art: "assets/future-machine.webp" } },
  { quiz: { title: "Ôn khóa và giá trị", questions: [
    { q: "Cho `hero = {\"name\": \"Pip\", \"level\": 3}`. Biểu thức nào lấy số 3?", a: ["`hero[\"level\"]`", "`hero[3]`", "`hero[\"Pip\"]`"], correct: 0 },
  ] } },
  { npc: "`dictionary.get(key)` tra cứu an toàn. Nếu khóa có mặt, nó trả về giá trị; nếu khóa vắng mặt, nó trả về `None` thay vì làm chương trình dừng vì lỗi." },
  ...task({ label: "dict_get_demo.py", starter: "hero = {\"name\": \"Pip\", \"level\": 3}\nprint(hero.get(\"level\"))\nprint(hero.get(\"power\"))\n", note: "RUN KIỂM CHỨNG\nCho sẵn dictionary hai cặp dữ liệu; không có INPUT. PROCESS: dùng `get()` tra một khóa có mặt và một khóa vắng mặt. OUTPUT là `3` rồi `None`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^None$/] }, solution: "hero = {\"name\": \"Pip\", \"level\": 3}\nprint(hero.get(\"level\"))\nprint(hero.get(\"power\"))\n" }),
  { npc: "`get(key, default)` cho phép chọn giá trị thay thế khi khóa không có. Ví dụ `hero.get(\"power\", 0)` trả về `0` nếu dictionary chưa lưu `power`." },
  ...task({ label: "dict_get_default_fix.py", starter: "hero = {\"name\": \"Pip\"}\npower = hero[\"power\"]\nprint(power)\n", note: "ĐỀ BÀI\nCho sẵn dictionary chưa có khóa `power`; không có INPUT. Sửa phép tra cứu bằng `get()` và giá trị mặc định 0 để chương trình không dừng. OUTPUT đúng là `0`.", expectOut: /^0$/, solution: "hero = {\"name\": \"Pip\"}\npower = hero.get(\"power\", 0)\nprint(power)\n" }),
  { checkpoint: { text: "`data.get(key)` trả về `None` khi khóa vắng mặt. `data.get(key, default)` trả về `default` trong trường hợp đó; phép tra bằng `data[key]` sẽ báo lỗi nếu không có khóa." } },
  { quiz: { title: "Tra cứu an toàn", questions: [
    { q: "Cho `stock = {\"pen\": 4}`. Biểu thức nào cho kết quả 0 khi khóa `book` chưa có?", a: ["`stock.get(\"book\", 0)`", "`stock[\"book\"]`", "`stock.get(0)`"], correct: 0 },
  ] } },
  { npc: "`keys()` cho các khóa, `values()` cho các giá trị, còn `items()` cho từng cặp khóa–giá trị. Có thể chuyển kết quả thành list để nhìn rõ toàn bộ dữ liệu." },
  ...task({ label: "dict_views_demo.py", starter: "prices = {\"pen\": 5, \"book\": 12}\nprint(list(prices.keys()))\nprint(list(prices.values()))\nprint(list(prices.items()))\n", note: "RUN KIỂM CHỨNG\nCho sẵn dictionary theo đúng thứ tự `pen`, `book`; không có INPUT. PROCESS: chuyển ba dạng xem dữ liệu thành list. OUTPUT lần lượt là danh sách khóa, giá trị và cặp dữ liệu.", expectOut: { all: [{ minLines: 3 }, /^\['pen', 'book'\]$/, /^\[5, 12\]$/, /^\[\('pen', 5\), \('book', 12\)\]$/] }, solution: "prices = {\"pen\": 5, \"book\": 12}\nprint(list(prices.keys()))\nprint(list(prices.values()))\nprint(list(prices.items()))\n" }),
  { npc: "Duyệt trực tiếp một dictionary bằng `for key in data:` sẽ đưa từng khóa vào biến `key`. Từ khóa đó, dùng `data[key]` để lấy giá trị tương ứng." },
  ...task({ label: "dict_iterate_keys.py", starter: "scores = {\"An\": 8, \"Bình\": 9}\nfor name in scores:\n    print(name, scores[name])\n", note: "RUN KIỂM CHỨNG\nCho sẵn hai cặp tên–điểm; không có INPUT. PROCESS: duyệt từng khóa rồi tra giá trị bằng khóa hiện tại. OUTPUT là `An 8` rồi `Bình 9`.", expectOut: { all: [{ minLines: 2 }, /^An 8$/, /^Bình 9$/] }, solution: "scores = {\"An\": 8, \"Bình\": 9}\nfor name in scores:\n    print(name, scores[name])\n" }),
  { npc: "Mẫu `for key, value in data.items():` nhận khóa và giá trị cùng lúc. Đây là cách gọn khi mỗi lượt đều cần cả hai phần của một cặp dữ liệu." },
  ...task({ label: "dict_iterate_items_fix.py", starter: "prices = {\"pen\": 5, \"book\": 12}\nfor item in prices:\n    print(item)\n", note: "ĐỀ BÀI\nCho sẵn hai cặp món–giá; không có INPUT. Sửa vòng `for` bằng `items()` để mỗi dòng in cả khóa và giá trị. OUTPUT là `pen 5` rồi `book 12`.", expectOut: { all: [{ minLines: 2 }, /^pen 5$/, /^book 12$/] }, solution: "prices = {\"pen\": 5, \"book\": 12}\nfor item, price in prices.items():\n    print(item, price)\n" }),
  { checkpoint: { text: "`keys()` cho các khóa, `values()` cho các giá trị, `items()` cho các cặp. `for key in data` duyệt khóa; `for key, value in data.items()` nhận cả hai phần." } },
  { quiz: { title: "Duyệt dictionary", questions: [
    { q: "Muốn tính tổng mọi giá trong `prices = {\"pen\": 5, \"book\": 12}`, vòng lặp nào cung cấp trực tiếp từng số 5 rồi 12?", a: ["`for price in prices.values():`", "`for price in prices.keys():`", "`for price in prices.items():`"], correct: 0 },
  ] } },
  { npc: "`None` là giá trị đặc biệt biểu thị chưa có kết quả. Kiểm tra nó bằng `is None` hoặc `is not None`, chẳng hạn `if result is None:`." },
  ...task({ label: "dict_none_check.py", starter: "profile = {\"name\": \"Pip\"}\nresult = profile.get(\"level\")\nif result is None:\n    print(\"MISSING\")\nelse:\n    print(result)\n", note: "RUN KIỂM CHỨNG\nCho sẵn dictionary chưa có `level`; không có INPUT. PROCESS: dùng `get()` rồi kiểm tra `is None`. OUTPUT phải là `MISSING`.", expectOut: /^MISSING$/, solution: "profile = {\"name\": \"Pip\"}\nresult = profile.get(\"level\")\nif result is None:\n    print(\"MISSING\")\nelse:\n    print(result)\n" }),
  ...task({ label: "dict_inventory_project.py", starter: "stock = {\"pen\": 3, \"book\": 2, \"eraser\": 0}\ntotal = 0\n# Duyệt items(), chỉ cộng số lượng lớn hơn 0.\n", note: "XƯỞNG PHÉP\nCho sẵn dictionary kho hàng; không có INPUT. PROCESS: duyệt `items()`, in các món còn hàng theo mẫu `name amount`, cộng tổng số lượng. OUTPUT là `pen 3`, `book 2`, rồi `TOTAL 5`.", expectOut: { all: [{ minLines: 3 }, /^pen 3$/, /^book 2$/, /^TOTAL 5$/] }, solution: "stock = {\"pen\": 3, \"book\": 2, \"eraser\": 0}\ntotal = 0\nfor name, amount in stock.items():\n    if amount > 0:\n        print(name, amount)\n        total += amount\nprint(\"TOTAL\", total)\n" }),
  { checkpoint: { text: "`None` biểu thị chưa có giá trị. Dùng `is None` để nhận trường hợp đó và `is not None` để nhận trường hợp đã có một giá trị khác." } },
  { quiz: { title: "Nhận biết None", questions: [
    { q: "Cho `data = {}` và `result = data.get(\"score\")`. Điều kiện nào đúng?", a: ["`result is None`", "`result == 0`", "`result is True`"], correct: 0 },
  ] } },
];

export default learningBranch({ id: "branchDICTIONARIES", title: "NHÁNH TỪ ĐIỂN NÂNG CAO", subtitle: "get, keys, values, items, duyệt dictionary và None", machineName: "MÁY TRA SỔ AN TOÀN", machineBlurb: "tra cứu khóa vắng mặt và duyệt đầy đủ khóa–giá trị mà không làm mất dữ liệu", cells });
