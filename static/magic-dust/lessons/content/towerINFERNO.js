// towerINFERNO.js — nhánh luyện tập mở sau node10. Tháp chỉ dùng kiến thức
// đã có trên đường chính: biến, phép tính, if/elif/else, and/or/not, while,
// for và range(). Mỗi tầng code có lời giải cùng giải thích từng dòng.
export default {
  index: -1,
  sideIslandId: "towerINFERNO",
  title: "THÁP LUYỆN NGỤC",
  subtitle: "15 tầng luyện phản xạ — tự dựng PROCESS, giữ 3 mạng và leo tới đỉnh",
  bundle: { art: "assets/rookie-bundle.webp", name: "CHÌA KHÓA LUYỆN NGỤC" },
  machine: {
    art: "assets/old-computer.webp",
    name: "BÀN RÈN PHẢN XẠ",
    blurb: "mở nhánh luyện sau for/range — mỗi tầng buộc bạn tự ghép nhiều kiến thức đã học",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    { npc: "Một đường đá đỏ tách khỏi lối chính và dẫn xuống THÁP LUYỆN NGỤC. Nơi này không trao lệnh Python mới; nó bắt bạn dùng lại kiến thức đã học cho tới khi tự viết được." },
    { npc: "Tháp có 15 tầng và 3 mạng. Tầng code chỉ cho dữ kiện cùng OUTPUT cần đạt; phần PROCESS là việc của bạn. Sau khi mở đáp án, bạn có thể đọc phần GIẢI THÍCH TỪNG DÒNG." },
    { quiz: { title: "Kiểm tra hành trang", questions: [
      { q: "Đoạn code dưới đây chạy với `score = 4`:\n```python\nif score >= 5:\n    say(\"PASS\")\nelse:\n    say(\"TRY\")\n```\nOUTPUT là gì?", a: ["`PASS`", "`TRY`", "Máy không in gì"], correct: 1 },
      { q: "Đoạn code dưới đây dùng `range(1, 4)`:\n```python\nfor number in range(1, 4):\n    say_num(number)\n```\nBa dòng OUTPUT lần lượt là gì?", a: ["`1`, `2`, `3`", "`1`, `2`, `3`, `4`", "`0`, `1`, `2`"], correct: 0 },
    ] } },

    { npc: "TẦNG 1 — Nồi Thuốc Gấp Đôi. Ba giá trị đã được đặt lên bàn; bạn phải tính toàn bộ mẻ thuốc bằng một PROCESS rõ ràng." },
    { code: `from old_computer import say_num

base = 7
bonus = 5
multiplier = 2

# Viết PROCESS và OUTPUT ở dưới dòng này.
`,
      label: "inferno01_potion_total.py", floorNum: 1,
      note: "ĐỀ BÀI\nCho sẵn `base = 7`, `bonus = 5`, `multiplier = 2`; không có INPUT từ bên ngoài. PROCESS: cộng `base` với `bonus`, rồi nhân tổng đó với `multiplier`. OUTPUT phải là `24`.",
      expectOut: /^24$/,
      solution: `from old_computer import say_num

base = 7
bonus = 5
multiplier = 2

total = (base + bonus) * multiplier
say_num(total)
`,
      solutionExplanation: [
        { line: 3, text: "Gán sức mạnh nền `7` vào biến `base`." },
        { line: 4, text: "Gán phần tăng thêm `5` vào `bonus`." },
        { line: 5, text: "Gán hệ số nhân `2` vào `multiplier`." },
        { line: 7, text: "Dấu ngoặc làm `base + bonus` được tính trước; kết quả đó mới nhân với `multiplier` và được gán vào `total`." },
        { line: 8, text: "In giá trị trong `total`, nên OUTPUT là `24`." },
      ] },

    { npc: "TẦNG 2 — Chuông Báo Nhiệt. Cửa không cần nhiều nhánh, nhưng điều kiện phải đặt đúng mốc." },
    { code: `from old_computer import say

temperature = 32

# Viết if/else để in HOT hoặc COOL.
`,
      label: "inferno02_temperature.py", floorNum: 2,
      note: "ĐỀ BÀI\nCho sẵn `temperature = 32`; không có INPUT từ bên ngoài. PROCESS: nếu nhiệt độ từ 30 trở lên thì chọn `HOT`, trường hợp còn lại chọn `COOL`. OUTPUT đúng là `HOT`.",
      expectOut: /^HOT$/,
      solution: `from old_computer import say

temperature = 32

if temperature >= 30:
    say("HOT")
else:
    say("COOL")
`,
      solutionExplanation: [
        { line: 3, text: "Gán nhiệt độ cần kiểm tra vào `temperature`." },
        { line: 5, text: "Kiểm tra nhiệt độ có lớn hơn hoặc bằng mốc 30 hay không." },
        { line: 6, text: "Vì 32 đạt mốc, nhánh `if` in `HOT`." },
        { line: 7, text: "`else` giữ trường hợp còn lại khi điều kiện ở dòng 5 sai." },
        { line: 8, text: "Dòng này chỉ chạy với nhiệt độ nhỏ hơn 30." },
      ] },

    { npc: "TẦNG 3 — Cổng Ba Lứa Tuổi. Lần này một mốc chưa đủ; máy phải chọn đúng một trong ba nhánh." },
    { code: `from old_computer import say

age = 13

# Viết chuỗi if/elif/else để phân nhóm tuổi.
`,
      label: "inferno03_age_gate.py", floorNum: 3,
      note: "ĐỀ BÀI\nCho sẵn `age = 13`; không có INPUT từ bên ngoài. PROCESS: tuổi từ 12 trở xuống in `CHILD`; từ 13 đến 17 in `TEEN`; các tuổi còn lại in `ADULT`. OUTPUT đúng là `TEEN`.",
      expectOut: /^TEEN$/,
      solution: `from old_computer import say

age = 13

if age <= 12:
    say("CHILD")
elif age <= 17:
    say("TEEN")
else:
    say("ADULT")
`,
      solutionExplanation: [
        { line: 3, text: "Gán tuổi cần phân nhóm vào `age`." },
        { line: 5, text: "Nhánh đầu giữ toàn bộ tuổi từ 12 trở xuống." },
        { line: 7, text: "Dòng `elif` chỉ được hỏi sau khi biết tuổi lớn hơn 12, nên điều kiện `age <= 17` bao phủ nhóm 13–17." },
        { line: 8, text: "Giá trị 13 đi vào nhánh này, vì vậy máy in `TEEN`." },
        { line: 9, text: "`else` nhận mọi tuổi không thuộc hai nhóm trước." },
      ] },

    { npc: "TẦNG 4 — Đồng Hồ Đếm Ngược. Bạn phải giữ vòng `while` chạy đủ bốn lượt rồi dừng đúng lúc." },
    { code: `from old_computer import say, say_num

count = 4

# Viết vòng while, sau đó in DONE.
`,
      label: "inferno04_countdown.py", floorNum: 4,
      note: "ĐỀ BÀI\nCho sẵn `count = 4`; không có INPUT từ bên ngoài. PROCESS: dùng `while` để in lần lượt 4, 3, 2, 1, rồi giảm `count` sau mỗi lượt. Khi vòng lặp kết thúc, in `DONE`. OUTPUT phải có đúng năm dòng theo thứ tự đó.",
      expectOut: { all: [{ minLines: 5 }, /^4$/, /^3$/, /^2$/, /^1$/, /^DONE$/] },
      solution: `from old_computer import say, say_num

count = 4

while count > 0:
    say_num(count)
    count = count - 1

say("DONE")
`,
      solutionExplanation: [
        { line: 3, text: "Bắt đầu biến đếm ở 4." },
        { line: 5, text: "Lặp khi `count` vẫn lớn hơn 0; khi về 0, điều kiện sai và vòng lặp dừng." },
        { line: 6, text: "In giá trị hiện tại trước khi thay đổi nó." },
        { line: 7, text: "Giảm `count` đi 1 để lượt sau tiến gần mốc dừng." },
        { line: 9, text: "Dòng này nằm ngoài vòng lặp nên chỉ chạy một lần, sau khi đã in đủ 4, 3, 2, 1." },
      ] },

    { npc: "TẦNG 5 — TRÙNG GÁC LÒ THAN đang chặn cầu thang. Trả lời ba tình huống mới để rèn BOM MẬT NGỮ." },
    { forge: { quiz: [
      { q: "Với đoạn code sau, OUTPUT là gì?\n```python\nvalue = 6\nif value > 6:\n    say(\"HIGH\")\nelse:\n    say(\"LOW\")\n```", a: ["`HIGH`", "`LOW`", "`6`"], correct: 1 },
      { q: "Đoạn code cần in `3`, `2`, `1` rồi dừng. Dòng cập nhật nào giúp `count` tiến tới 0?\n```python\ncount = 3\nwhile count > 0:\n    say_num(count)\n    # dòng cần điền\n```", a: ["`count = count - 1`", "`count = count + 1`", "`count = 3`"], correct: 0 },
      { q: "Với `age = 18`, chuỗi nhánh sau in gì?\n```python\nif age <= 12:\n    say(\"CHILD\")\nelif age <= 17:\n    say(\"TEEN\")\nelse:\n    say(\"ADULT\")\n```", a: ["`CHILD`", "`TEEN`", "`ADULT`"], correct: 2 },
    ] } },
    { boss: { name: "TRÙNG GÁC LÒ THAN", sheet: { src: "assets/tower-warden-05-sheet.webp" }, art: "assets/tower-warden-05.webp", glyph: "🐛", ko: true }, floorNum: 5 },

    { npc: "TẦNG 6 — Tổng Năm Bậc. `for` và `range()` phải phối hợp với một biến giữ tổng." },
    { code: `from old_computer import say_num

total = 0

# Dùng for/range để tính tổng từ 1 đến 5.
`,
      label: "inferno06_sum_range.py", floorNum: 6,
      note: "ĐỀ BÀI\nCho sẵn `total = 0`; không có INPUT từ bên ngoài. PROCESS: dùng `for` với `range()` để cộng các số 1, 2, 3, 4, 5 vào `total`. OUTPUT phải là `15`.",
      expectOut: /^15$/,
      solution: `from old_computer import say_num

total = 0

for number in range(1, 6):
    total = total + number

say_num(total)
`,
      solutionExplanation: [
        { line: 3, text: "Khởi tạo `total` bằng 0 trước khi bắt đầu cộng." },
        { line: 5, text: "`range(1, 6)` tạo các giá trị 1, 2, 3, 4, 5; mốc 6 không được lấy." },
        { line: 6, text: "Mỗi lượt gán lại `total` bằng tổng cũ cộng với `number` hiện tại." },
        { line: 8, text: "Sau khi vòng `for` kết thúc, in tổng cuối cùng là 15." },
      ] },

    { npc: "TẦNG 7 — Đếm Giá Trị Vượt Mốc. Bài này cần vừa duyệt vừa chọn bằng `if`." },
    { code: `from old_computer import say_num

count = 0

# Đếm các số lớn hơn 6 trong khoảng từ 1 đến 10.
`,
      label: "inferno07_count_above.py", floorNum: 7,
      note: "ĐỀ BÀI\nCho sẵn khoảng số từ 1 đến 10; không có INPUT từ bên ngoài. PROCESS: dùng `for`, `range()` và `if` để đếm những số lớn hơn 6. OUTPUT phải là `4`, tương ứng với 7, 8, 9, 10.",
      expectOut: /^4$/,
      solution: `from old_computer import say_num

count = 0

for number in range(1, 11):
    if number > 6:
        count = count + 1

say_num(count)
`,
      solutionExplanation: [
        { line: 3, text: "`count` bắt đầu từ 0 vì chưa có giá trị nào được tính." },
        { line: 5, text: "Vòng `for` đưa `number` qua mọi số từ 1 đến 10." },
        { line: 6, text: "Chỉ chọn những giá trị lớn hơn 6." },
        { line: 7, text: "Mỗi giá trị đạt điều kiện làm `count` tăng thêm 1." },
        { line: 9, text: "In số lượng đã đếm được sau khi duyệt hết khoảng số." },
      ] },

    { npc: "TẦNG 8 — Tích Liên Hoàn. Thay vì cộng vào tổng, lần này bạn cập nhật một tích qua từng lượt." },
    { code: `from old_computer import say_num

product = 1

# Tính tích 1 * 2 * 3 * 4 * 5.
`,
      label: "inferno08_product.py", floorNum: 8,
      note: "ĐỀ BÀI\nCho sẵn `product = 1`; không có INPUT từ bên ngoài. PROCESS: dùng `for` và `range()` để nhân lần lượt các số từ 1 đến 5 vào `product`. OUTPUT phải là `120`.",
      expectOut: /^120$/,
      solution: `from old_computer import say_num

product = 1

for number in range(1, 6):
    product = product * number

say_num(product)
`,
      solutionExplanation: [
        { line: 3, text: "Bắt đầu `product` ở 1 vì nhân với 1 không làm thay đổi giá trị kế tiếp." },
        { line: 5, text: "`number` lần lượt nhận 1, 2, 3, 4, 5." },
        { line: 6, text: "Mỗi lượt gán lại `product` bằng tích cũ nhân với `number` hiện tại." },
        { line: 8, text: "Sau năm lượt, `product` giữ 120 và được in ra." },
      ] },

    { npc: "TẦNG 9 — Sáu Bậc Chẵn. Hãy dùng tham số bước đi của `range()` thay vì viết sáu lệnh riêng." },
    { code: `from old_computer import say_num

count = 0

# Đếm các giá trị do range(2, 13, 2) tạo ra.
`,
      label: "inferno09_range_step.py", floorNum: 9,
      note: "ĐỀ BÀI\nCho sẵn `count = 0`; không có INPUT từ bên ngoài. PROCESS: dùng `for number in range(2, 13, 2)` và tăng `count` một lần cho mỗi giá trị. Khoảng này tạo 2, 4, 6, 8, 10, 12 nên OUTPUT phải là `6`.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

count = 0

for number in range(2, 13, 2):
    count = count + 1

say_num(count)
`,
      solutionExplanation: [
        { line: 3, text: "`count` giữ số lượt đã đi qua và bắt đầu từ 0." },
        { line: 5, text: "`range(2, 13, 2)` bắt đầu ở 2, dừng trước 13 và tăng 2 sau mỗi lượt." },
        { line: 6, text: "Mỗi giá trị được tạo ra làm số lượt tăng thêm 1." },
        { line: 8, text: "Có sáu giá trị nên OUTPUT là 6." },
      ] },

    { npc: "TẦNG 10 — TRÙNG GÁC VÒNG LẶP đã nghe tiếng bước chân. Ba câu vận dụng sẽ quyết định quả bom có được rèn xong hay không." },
    { forge: { quiz: [
      { q: "Đoạn code sau in số nào?\n```python\ntotal = 0\nfor number in range(2, 5):\n    total = total + number\nsay_num(total)\n```", a: ["`9`", "`14`", "`6`"], correct: 0 },
      { q: "Đoạn code sau chạy bao nhiêu lượt?\n```python\nfor number in range(3, 10, 3):\n    say_num(number)\n```", a: ["3 lượt: 3, 6, 9", "4 lượt: 3, 6, 9, 12", "7 lượt: từ 3 đến 9"], correct: 0 },
      { q: "Muốn tính tích `1 * 2 * 3`, giá trị bắt đầu nào phù hợp cho `product`?", a: ["`product = 1`", "`product = 0`", "`product = 3`"], correct: 0 },
    ] } },
    { boss: { name: "TRÙNG GÁC VÒNG LẶP", sheet: { src: "assets/tower-warden-10-sheet.webp" }, art: "assets/tower-warden-10.webp", glyph: "🐜", ko: true }, floorNum: 10 },

    { npc: "TẦNG 11 — Hai Hàng Ba Dấu Sao. Đây là bài ghép hai vòng `for`: vòng ngoài tạo hàng, vòng trong tạo ba ký tự cho hàng đó." },
    { code: `from old_computer import say

# Tạo hai dòng, mỗi dòng chứa đúng ba dấu *.
`,
      label: "inferno11_nested_pattern.py", floorNum: 11,
      note: "ĐỀ BÀI\nKhông có INPUT và không có giá trị cho sẵn. PROCESS: dùng một vòng `for` chạy 2 lượt; trong mỗi lượt, dùng vòng `for` thứ hai để nối 3 dấu `*` vào `line`, rồi in `line`. OUTPUT phải gồm đúng hai dòng `***`.",
      expectOut: { all: [{ minLines: 2 }, /^\*\*\*$/] },
      solution: `from old_computer import say

for row in range(2):
    line = ""
    for col in range(3):
        line = line + "*"
    say(line)
`,
      solutionExplanation: [
        { line: 3, text: "Vòng ngoài chạy hai lượt, mỗi lượt tương ứng với một hàng OUTPUT." },
        { line: 4, text: "Tạo lại chuỗi rỗng `line` ở đầu mỗi hàng để hàng mới không giữ ký tự của hàng trước." },
        { line: 5, text: "Vòng trong chạy ba lượt cho ba vị trí trong hàng." },
        { line: 6, text: "Mỗi lượt nối thêm một dấu `*` vào cuối `line`." },
        { line: 7, text: "Sau khi vòng trong kết thúc, `line` là `***` và được in đúng một lần." },
      ] },

    { npc: "TẦNG 12 — Bình Năng Lượng Cạn Dần. Bạn cần cập nhật giá trị trong `energy` và chỉ báo hết năng lượng sau khi vòng lặp dừng." },
    { code: `from old_computer import say, say_num

energy = 3

# In 3, 2, 1 rồi in EMPTY.
`,
      label: "inferno12_energy.py", floorNum: 12,
      note: "ĐỀ BÀI\nCho sẵn `energy = 3`; không có INPUT từ bên ngoài. PROCESS: dùng `while` để in mức năng lượng hiện tại rồi giảm đi 1 cho tới khi `energy` bằng 0. Sau vòng lặp, in `EMPTY`. OUTPUT phải là 3, 2, 1, `EMPTY` trên bốn dòng.",
      expectOut: { all: [{ minLines: 4 }, /^3$/, /^2$/, /^1$/, /^EMPTY$/] },
      solution: `from old_computer import say, say_num

energy = 3

while energy > 0:
    say_num(energy)
    energy = energy - 1

say("EMPTY")
`,
      solutionExplanation: [
        { line: 3, text: "Bình bắt đầu với mức năng lượng 3." },
        { line: 5, text: "Vòng lặp tiếp tục khi năng lượng vẫn lớn hơn 0." },
        { line: 6, text: "In mức hiện tại trước khi giảm, vì vậy dòng đầu là 3." },
        { line: 7, text: "Giảm `energy` để vòng lặp lần lượt đi qua 2, 1 rồi 0." },
        { line: 9, text: "Khi `energy` bằng 0, vòng lặp kết thúc và chương trình in `EMPTY`." },
      ] },

    { npc: "TẦNG 13 — Phí Chuyển Phát. Điều kiện lần này kết hợp hai dữ kiện bằng `and`." },
    { code: `from old_computer import say_num

weight = 4
distance = 12

# Tính fee theo luật trong đề.
`,
      label: "inferno13_delivery_fee.py", floorNum: 13,
      note: "ĐỀ BÀI\nCho sẵn `weight = 4`, `distance = 12`; không có INPUT từ bên ngoài. PROCESS: nếu `weight <= 5` và `distance <= 10` thì phí là 20; nếu chỉ `weight <= 5` thì phí là 30; các trường hợp còn lại có phí 50. OUTPUT đúng là `30`.",
      expectOut: /^30$/,
      solution: `from old_computer import say_num

weight = 4
distance = 12

if weight <= 5 and distance <= 10:
    fee = 20
elif weight <= 5:
    fee = 30
else:
    fee = 50

say_num(fee)
`,
      solutionExplanation: [
        { line: 3, text: "Gán khối lượng kiện hàng vào `weight`." },
        { line: 4, text: "Gán quãng đường vận chuyển vào `distance`." },
        { line: 6, text: "Nhánh đầu chỉ đúng khi cả hai điều kiện hai bên `and` cùng đúng." },
        { line: 8, text: "Nếu nhánh đầu sai, `elif` kiểm tra riêng trường hợp kiện hàng nhẹ." },
        { line: 9, text: "Kiện hàng nặng 4 nhưng đi 12 đơn vị nên nhận phí 30 ở nhánh này." },
        { line: 13, text: "Sau khi một nhánh gán `fee`, dòng cuối in phí đã chọn." },
      ] },

    { npc: "TẦNG 14 — Đèn A/B Luân Phiên. Một biến `bool` sẽ ghi nhớ ký hiệu cần in ở lượt tiếp theo." },
    { code: `from old_computer import say

use_a = True

# Dùng for và if/else để in A, B, A, B.
`,
      label: "inferno14_toggle.py", floorNum: 14,
      note: "ĐỀ BÀI\nCho sẵn `use_a = True`; không có INPUT từ bên ngoài. PROCESS: chạy vòng `for` 4 lượt. Nếu `use_a` là `True`, in `A` rồi gán nó thành `False`; trường hợp còn lại in `B` rồi gán lại thành `True`. OUTPUT phải là A, B, A, B trên bốn dòng.",
      expectOut: { all: [{ minLines: 4 }, /^A$/, /^B$/] },
      solution: `from old_computer import say

use_a = True

for step in range(4):
    if use_a == True:
        say("A")
        use_a = False
    else:
        say("B")
        use_a = True
`,
      solutionExplanation: [
        { line: 3, text: "`use_a` bắt đầu là `True`, nên lượt đầu sẽ chọn A." },
        { line: 5, text: "Vòng `for` chạy đúng bốn lượt để tạo bốn dòng OUTPUT." },
        { line: 6, text: "Mỗi lượt kiểm tra giá trị hiện tại của `use_a`." },
        { line: 8, text: "Sau khi in A, gán `use_a = False` để lượt sau chuyển sang nhánh `else`." },
        { line: 10, text: "Nhánh `else` in B khi `use_a` là `False`." },
        { line: 11, text: "Gán lại `True` để lượt tiếp theo quay về A." },
      ] },

    { npc: "TẦNG 15 — CHÚA NGỤC TRO TÀN xuất hiện ở đỉnh tháp. Đây là lượt kiểm tra cuối: đọc code, lần theo biến và chọn kết quả." },
    { forge: { quiz: [
      { q: "Đoạn code sau tạo OUTPUT nào?\n```python\nfor row in range(2):\n    line = \"\"\n    for col in range(2):\n        line = line + \"#\"\n    say(line)\n```", a: ["Hai dòng `##`", "Một dòng `####`", "Bốn dòng `#`"], correct: 0 },
      { q: "Với dữ liệu dưới đây, `fee` nhận giá trị nào?\n```python\nweight = 7\ndistance = 4\nif weight <= 5 and distance <= 10:\n    fee = 20\nelif weight <= 5:\n    fee = 30\nelse:\n    fee = 50\n```", a: ["`20`", "`30`", "`50`"], correct: 2 },
      { q: "Đoạn code sau in gì?\n```python\nuse_a = False\nfor step in range(3):\n    if use_a == True:\n        say(\"A\")\n        use_a = False\n    else:\n        say(\"B\")\n        use_a = True\n```", a: ["`B`, `A`, `B`", "`A`, `B`, `A`", "`B`, `B`, `B`"], correct: 0 },
    ] } },
    { boss: { name: "CHÚA NGỤC TRO TÀN", sheet: { src: "assets/tower-warden-15-sheet.webp" }, art: "assets/tower-warden-15.webp", glyph: "🦂", ko: true }, floorNum: 15 },

    { remember: "Tháp Luyện Ngục dùng lại bốn mẫu chính: chọn nhánh bằng `if/elif/else`; dừng `while` bằng cách cập nhật biến; duyệt số lượt bằng `for` và `range()`; giữ kết quả qua nhiều lượt bằng biến đếm, tổng, tích hoặc giá trị `bool`." },
  ],
};
