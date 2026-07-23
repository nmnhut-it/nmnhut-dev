export default {
  index: 19,
  title: "Return: Hàm Trả Kết Quả",
  subtitle: "dùng return để đưa giá trị đã tính ra ngoài hàm, lưu kết quả, và tiếp tục xử lý",
  bundle: { art: "assets/future-packet.webp", name: "RETURN PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY TRẢ GIÁ TRỊ",
    blurb: "nhận dữ liệu, tính bên trong hàm, rồi đưa kết quả về chỗ gọi hàm",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn hàm và tham số",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef show_name(name):\n    say(name)\n\nshow_name(\"Mira\")\n```\nChuỗi nào được truyền vào tham số `name`?",
            a: ['`"Mira"`', '`"name"`', '`"show_name"`'],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef show_star():\n    say(\"STAR\")\n\nshow_star()\nshow_star()\n```\nOUTPUT có bao nhiêu dòng `STAR`?",
            a: ["2 dòng", "1 dòng", "0 dòng"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Ở node trước, hàm làm việc bằng cách gọi `say()` ngay bên trong. Nhưng nếu tụi mình muốn lấy kết quả của hàm để tính tiếp thì chỉ nhìn kết quả trên màn hình vẫn chưa đủ.",
    },
    {
      code: `from old_computer import say

def show_double(number):
    say(number * 2)

show_double(6)
`,
      label: "show_double_problem.py",
      note: "RUN KIỂM CHỨNG\nCho sẵn số 6. Hàm nhân số đó với 2 rồi gọi `say()` để OUTPUT hiện 12. Kết quả đã hiện ra, nhưng chỗ gọi hàm chưa nhận được giá trị để dùng tiếp.",
      expectOut: /^12$/,
      solution: `from old_computer import say

def show_double(number):
    say(number * 2)

show_double(6)
`,
    },
    {
      npc: "`return` giải quyết đúng việc đó. Trong `def double(number):`, dòng `return number * 2` tính một giá trị rồi đưa giá trị ấy về chỗ gọi hàm. Vì vậy `result = double(6)` gán số 12 vào biến `result`.",
    },
    {
      code: `from old_computer import say

def double(number):
    return number * 2

result = double(6)
say(result)
`,
      label: "first_return_demo.py",
      note: "RUN KIỂM CHỨNG\nCho sẵn số 6. Hàm dùng `return` để đưa kết quả phép nhân về chỗ gọi; biến `result` giữ giá trị đó. OUTPUT đúng là 12.",
      expectOut: /^12$/,
      solution: `from old_computer import say

def double(number):
    return number * 2

result = double(6)
say(result)
`,
    },
    {
      npc: "Pip kể cách khác nhé: tham số giống nguyên liệu đi vào xưởng, còn `return` là cửa giao thành phẩm. Luật kỹ thuật là `return` đưa một giá trị về đúng chỗ đã gọi hàm.",
    },
    {
      code: `from old_computer import say

def add_bonus(score, bonus):
    total = score + bonus

result = add_bonus(8, 3)
say(result)
`,
      label: "missing_return_demo.py",
      note: "RUN KIỂM CHỨNG\nCho sẵn `score = 8` và `bonus = 3` qua hai đối số. Hàm có tính `total`, nhưng chưa có `return`. Khi chỗ gọi không nhận được giá trị, OUTPUT là `None`.",
      expectOut: /^None$/,
      solution: `from old_computer import say

def add_bonus(score, bonus):
    total = score + bonus

result = add_bonus(8, 3)
say(result)
`,
    },
    {
      npc: "`None` báo rằng lời gọi hàm không nhận được giá trị nào để dùng. Muốn biến `result` giữ số 11, hàm phải ghi rõ `return total`.",
    },
    {
      code: `from old_computer import say

def add_bonus(score, bonus):
    total = score + bonus
    # Viết dòng return ở đây

result = add_bonus(8, 3)
say(result)
`,
      label: "missing_return_fix.py",
      note: "ĐỀ BÀI\nCho sẵn điểm 8 và điểm thưởng 3. Thêm một dòng `return` trong hàm để đưa `total` về chỗ gọi. OUTPUT đúng là 11.",
      expectOut: /^11$/,
      solution: `from old_computer import say

def add_bonus(score, bonus):
    total = score + bonus
    return total

result = add_bonus(8, 3)
say(result)
`,
    },
    {
      checkpoint: {
        text: "Trong một hàm, `return value` đưa `value` về chỗ gọi hàm. Nếu hàm không chạy dòng `return`, lời gọi nhận `None` thay vì kết quả cần dùng.",
      },
    },
    {
      quiz: {
        title: "Giá trị được trả về",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef add_one(number):\n    return number + 1\n\nresult = add_one(9)\n```\nGiá trị nào được gán vào `result`?",
            a: ["10", "9", "None"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef add_one(number):\n    total = number + 1\n\nresult = add_one(9)\n```\nVì hàm không có `return`, `result` giữ giá trị nào?",
            a: ["None", "10", "9"],
            correct: 0,
          },
          {
            q: "Muốn hàm dưới đây đưa số đã tính về chỗ gọi, nên thêm dòng nào?\n```python\ndef make_total(a, b):\n    total = a + b\n```",
            a: ["`return total`", "`say = total`", "`total return`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giá trị do hàm trả về không bị buộc phải hiện ngay lên màn hình. Bạn có thể lưu nó trong biến, dùng trong phép tính khác, rồi chỉ gọi `say()` khi thật sự cần tạo OUTPUT.",
    },
    {
      code: `from old_computer import say

def double(number):
    return number * 2

first = double(4)
final = first + 3
say(first)
say(final)
`,
      label: "reuse_return_demo.py",
      note: "RUN KIỂM CHỨNG\nCho sẵn số 4. Hàm trả về 8 và biến `first` giữ giá trị đó; phép cộng tiếp theo tạo 11. OUTPUT gồm hai dòng: 8 rồi 11.",
      expectOut: { all: [{ minLines: 2 }, /^8$/, /^11$/] },
      solution: `from old_computer import say

def double(number):
    return number * 2

first = double(4)
final = first + 3
say(first)
say(final)
`,
    },
    {
      code: `from old_computer import say

def double(number):
    # Viết dòng return để tính gấp đôi number

first = double(5)
second = double(7)
say(first)
say(second)
`,
      label: "double_return_write.py",
      note: "ĐỀ BÀI\nHàm được gọi với hai số cho sẵn là 5 và 7. Viết một dòng `return` để mỗi lời gọi nhận số gấp đôi tham số `number`. OUTPUT phải có hai dòng: 10 rồi 14.",
      expectOut: { all: [{ minLines: 2 }, /^10$/, /^14$/] },
      solution: `from old_computer import say

def double(number):
    return number * 2

first = double(5)
second = double(7)
say(first)
say(second)
`,
    },
    {
      checkpoint: {
        text: "Một giá trị được trả về có thể gán vào biến rồi dùng trong phép tính tiếp theo. Mỗi lời gọi hàm tính lại kết quả từ các đối số của lần gọi đó.",
      },
    },
    {
      quiz: {
        title: "Dùng kết quả để tính tiếp",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef triple(number):\n    return number * 3\n\nresult = triple(4) + 2\nsay(result)\n```\nOUTPUT là gì?",
            a: ["14", "12", "6"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef length_with_bonus(text):\n    return len(text) + 1\n\na = length_with_bonus(\"PIP\")\nb = length_with_bonus(\"KOTO\")\nsay(a + b)\n```\nOUTPUT là gì?",
            a: ["9", "7", "2"],
            correct: 0,
          },
          {
            q: "Một hàm `clean(text)` trả về chuỗi đã được `strip()`. Dòng nào lưu kết quả khi gọi hàm với chuỗi `\"  KOTO  \"`?",
            a: ['`result = clean("  KOTO  ")`', '`return = clean("  KOTO  ")`', '`clean = result("  KOTO  ")`'],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Có một chỗ rất dễ nhầm: `say(value)` tạo OUTPUT trên màn hình, còn `return value` đưa giá trị về chỗ gọi hàm. `return` không tự in gì cả.",
    },
    {
      code: `from old_computer import say

def make_label(name):
    return "[" + name + "]"

label = make_label("MIRA")
say(label)
`,
      label: "return_then_say_demo.py",
      note: "RUN KIỂM CHỨNG\nCho sẵn tên MIRA. Hàm trả về chuỗi `[MIRA]`, biến `label` giữ chuỗi đó, rồi `say(label)` tạo OUTPUT là `[MIRA]`.",
      expectOut: /^\[MIRA\]$/,
      solution: `from old_computer import say

def make_label(name):
    return "[" + name + "]"

label = make_label("MIRA")
say(label)
`,
    },
    {
      code: `from old_computer import say

def clean_name(name):
    return name.strip().upper()

result = clean_name("  mira  ")
# Thêm lệnh tạo OUTPUT ở đây
`,
      label: "show_returned_value_fix.py",
      note: "ĐỀ BÀI\nCho sẵn chuỗi `\"  mira  \"`. Hàm đã bỏ khoảng trắng, đổi thành chữ hoa, và trả về `MIRA`. Thêm một lệnh `say()` để OUTPUT hiện đúng MIRA.",
      expectOut: /^MIRA$/,
      solution: `from old_computer import say

def clean_name(name):
    return name.strip().upper()

result = clean_name("  mira  ")
say(result)
`,
    },
    {
      checkpoint: {
        text: "`return value` và `say(value)` làm hai việc khác nhau: `return` giao giá trị cho chỗ gọi hàm; `say()` mới tạo OUTPUT nhìn thấy trên màn hình.",
      },
    },
    {
      quiz: {
        title: "Phân biệt return và say",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef make_word():\n    return \"KOTO\"\n\nmake_word()\n```\nChương trình không có `say()`. Điều gì xuất hiện trong OUTPUT?",
            a: ["Không có dòng nào", "KOTO", "None"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef make_word():\n    return \"KOTO\"\n\nword = make_word()\nsay(word)\n```\nDòng nào tạo OUTPUT nhìn thấy trên màn hình?",
            a: ["`say(word)`", "`return \"KOTO\"`", "`word = make_word()`"],
            correct: 0,
          },
          {
            q: "Một chương trình cần tính giá sau giảm giá rồi tiếp tục cộng phí vận chuyển. Hàm tính giảm giá nên làm gì để chỗ gọi dùng kết quả trong phép cộng tiếp theo?",
            a: ["Dùng `return` để đưa giá đã tính về chỗ gọi", "Chỉ dùng `say()` để hiện giá", "Đổi tên hàm thành `result`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "XƯỞNG PHÉP hôm nay cần ghép sức mạnh của hai viên đá. Mỗi viên có sức mạnh nền và điểm tăng cường riêng; hàm sẽ tính từng viên, còn phần bên ngoài hàm cộng hai kết quả.",
    },
    {
      code: `from old_computer import say

def forge_power(base, bonus):
    # Viết dòng return để tính sức mạnh của một viên đá

first = forge_power(7, 3)
second = forge_power(4, 2)
total = first + second

say(first)
say(second)
say("TOTAL=" + str(total))
`,
      label: "return_forge_project.py",
      note: "XƯỞNG PHÉP\nCho sẵn hai viên đá: viên thứ nhất có `base = 7`, `bonus = 3`; viên thứ hai có `base = 4`, `bonus = 2`. Viết `return` trong hàm để trả về tổng `base + bonus` của từng viên. OUTPUT phải là 10, 6, rồi `TOTAL=16`.",
      expectOut: { all: [{ minLines: 3 }, /^10$/, /^6$/, /^TOTAL=16$/] },
      solution: `from old_computer import say

def forge_power(base, bonus):
    return base + bonus

first = forge_power(7, 3)
second = forge_power(4, 2)
total = first + second

say(first)
say(second)
say("TOTAL=" + str(total))
`,
    },
    {
      gift: {
        glyph: "↩",
        name: "HUY HIỆU RETURN",
        blurb: "dùng `return` để hàm giao một giá trị về chỗ gọi, rồi lưu hoặc tiếp tục xử lý giá trị đó",
        badge: true,
        badgeId: "huy_hieu_return",
      },
    },
    {
      npc: "LÒ RÈN sẽ kiểm tra đúng ba việc: giá trị đi về đâu, vì sao thiếu `return` lại nhận `None`, và lúc nào cần `say()`. Qua được thì BOM MẬT NGỮ sẽ sẵn sàng.",
    },
    {
      forge: {
        quiz: [
          {
            q: "Đọc đoạn code:\n```python\ndef square(number):\n    return number * number\n\nresult = square(5)\n```\n`result` giữ giá trị nào?",
            a: ["25", "10", "5"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef square(number):\n    value = number * number\n\nresult = square(5)\n```\nVì hàm không có `return`, `result` giữ giá trị nào?",
            a: ["None", "25", "5"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef add(a, b):\n    return a + b\n\nresult = add(2, 3) * 2\nsay(result)\n```\nOUTPUT là gì?",
            a: ["10", "5", "7"],
            correct: 0,
          },
          {
            q: "Hàm `make_tag(name)` cần đưa chuỗi `\"<PIP>\"` về chỗ gọi để lưu vào biến. Thân hàm nào đúng?",
            a: ['`return "<" + name + ">"`', '`say("<" + name + ">")`', '`name = "<PIP>"`'],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndef clean(text):\n    return text.strip()\n\nword = clean(\"  CODE  \")\nsay(word.lower())\n```\nOUTPUT là gì?",
            a: ["code", "CODE", "  CODE  "],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "THE EMPTY-HAND SHADE nuốt những kết quả bị bỏ quên trong hàm. Nhưng lần này giá trị của bạn đã được `return` đưa về đúng chỗ, nên nó không còn gì để ăn nữa.",
    },
    {
      boss: { name: "THE EMPTY-HAND SHADE", art: "assets/logic-shade.webp", glyph: "↩", ko: true },
    },
    {
      npc: "Giờ hàm của bạn đã làm đủ một chuyến: nhận dữ liệu qua tham số, xử lý bên trong, rồi trả kết quả ra ngoài. Chỗ gọi hàm có thể lưu, ghép, tính tiếp, hoặc dùng `say()` để tạo OUTPUT.",
    },
  ],
  ritual: {
    gesture: "☝",
    prompt: "GIƠ NGÓN TAY NIÊM PHONG RETURN PACKET",
    theme: {
      motion: "orbit",
      palette: { core: "#78b2a5", dust: "#d9eee5", rune: "#f4c85a" },
      glyphs: "return value result function output",
    },
  },
};
