export default {
  index: 17,
  title: "String Tools: Ký Tự và Cắt Chuỗi",
  subtitle: "đọc, cắt, làm sạch, tìm/thay, rồi tách và nối chuỗi bằng các công cụ có dấu chấm",
  bundle: { art: "assets/rookie-bundle.webp", name: "STRING TOOLKIT" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY CẮT CHUỖI",
    blurb: "một old computer nhỏ chuyên đọc từng ký tự và cắt chuỗi thành mảnh vừa dùng",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn list trước khi qua chuỗi",
        questions: [
          {
            q: "`a = [10, 20, 30]`. Dòng `say_num(a[1])` in gì?",
            a: ["20", "10", "1"],
            correct: 0,
          },
          {
            q: "`a = [4, 8, 15]`. Dòng `say_num(len(a))` in gì?",
            a: ["3", "15", "4"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bạn đã biết list là một hàng ô nhớ.",
    },
    {
      npc: "Chuỗi cũng có thể đọc như một hàng ký tự: ký tự đầu có index `0`, ký tự kế tiếp có index `1`, và `len(text)` cho biết chuỗi dài bao nhiêu ký tự.",
    },
    {
      code: `from old_computer import say, say_num

text = "KOTOPIA"
say(text[0])
say(text[3])
say_num(len(text))
`,
      label: "string_index_demo.py",
      note: "ĐỀ BÀI\nBấm RUN để đọc ký tự trong chuỗi. `text[0]` là K, `text[3]` là O, và chuỗi KOTOPIA dài 7 ký tự.",
      expectOut: { all: [{ minLines: 3 }, /^K$/, /^O$/, /^7$/] },
      solution: `from old_computer import say, say_num

text = "KOTOPIA"
say(text[0])
say(text[3])
say_num(len(text))
`,
    },
    {
      code: `from old_computer import say

word = "PIP"
say(word[1])      # Sửa dòng này để lấy ký tự đầu tiên
`,
      label: "first_char_fix.py",
      note: "ĐỀ BÀI\nBài đang in I vì `word[1]` là ký tự thứ hai. Sửa index để output là P đầu tiên.",
      expectOut: /^P$/,
      solution: `from old_computer import say

word = "PIP"
say(word[0])
`,
    },
    {
      checkpoint: {
        text: "Chuỗi đọc được bằng index giống list: `text[0]` lấy ký tự đầu, `text[1]` lấy ký tự thứ hai. `len(text)` đếm số ký tự trong chuỗi.",
      },
    },
    {
      quiz: {
        title: "Index trong chuỗi",
        questions: [
          {
            q: '`text = "MAGIC"`. Dòng `say(text[2])` in gì?',
            a: ["G", "M", "A"],
            correct: 0,
          },
          {
            q: '`text = "DUST"`. Dòng `say_num(len(text))` in gì?',
            a: ["4", "3", "D"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Python còn có negative index: `-1` nghĩa là ký tự cuối, `-2` là ký tự sát cuối. Đây là cách rất gọn khi bạn cần lấy đuôi chuỗi mà không muốn tự tính `len(text) - 1`.",
    },
    {
      code: `from old_computer import say

text = "PORTAL"
say(text[-1])
say(text[-2])
`,
      label: "negative_index_demo.py",
      note: "ĐỀ BÀI\nBấm RUN để đọc từ cuối chuỗi đi ngược lại. `text[-1]` là L, `text[-2]` là A.",
      expectOut: { all: [{ minLines: 2 }, /^L$/, /^A$/] },
      solution: `from old_computer import say

text = "PORTAL"
say(text[-1])
say(text[-2])
`,
    },
    {
      code: `from old_computer import say

word = "KOTOPIA"
say(word[0])      # Sửa dòng này để lấy ký tự cuối cùng
`,
      label: "last_char_fix.py",
      note: "ĐỀ BÀI\nBài đang in ký tự đầu tiên. Dùng negative index để output là A, ký tự cuối của KOTOPIA.",
      expectOut: /^A$/,
      solution: `from old_computer import say

word = "KOTOPIA"
say(word[-1])
`,
    },
    {
      checkpoint: {
        text: "Negative index đọc từ cuối chuỗi: `text[-1]` là ký tự cuối, `text[-2]` là ký tự sát cuối. Nó giúp lấy phần đuôi mà không cần tự đếm chiều dài.",
      },
    },
    {
      quiz: {
        title: "Đọc từ cuối chuỗi",
        questions: [
          {
            q: '`text = "BROOM"`. Dòng `say(text[-1])` in gì?',
            a: ["M", "B", "O"],
            correct: 0,
          },
          {
            q: '`text = "BROOM"`. Dòng `say(text[-2])` in gì?',
            a: ["O", "M", "R"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ tới phép cắt chuỗi. Python gọi kiểu cắt này là slice: `text[start:stop]`. Nó lấy từ index `start` tới ngay trước index `stop`. Vì vậy `text[0:4]` lấy các ô 0, 1, 2, 3, nhưng không lấy ô 4.",
    },
    {
      code: `from old_computer import say

text = "KOTOPIA"
say(text[0:4])
say(text[4:])
say(text[:4])
say(text[-3:])
`,
      label: "slice_demo.py",
      note: "ĐỀ BÀI\nBấm RUN để xem bốn kiểu cắt: có đủ start/stop, bỏ stop, bỏ start, và cắt ba ký tự cuối bằng negative index.",
      expectOut: { all: [{ minLines: 4 }, /^KOTO$/, /^PIA$/, /^KOTO$/, /^PIA$/] },
      solution: `from old_computer import say

text = "KOTOPIA"
say(text[0:4])
say(text[4:])
say(text[:4])
say(text[-3:])
`,
    },
    {
      code: `from old_computer import say

secret = "MAGICDUST"
say(secret[0:4])      # Sửa để lấy MAGIC
say(secret[4:])       # Sửa để lấy DUST
`,
      label: "slice_fix.py",
      note: "ĐỀ BÀI\nCắt `MAGICDUST` thành hai mảnh đúng: dòng đầu output MAGIC, dòng sau output DUST.",
      expectOut: { all: [{ minLines: 2 }, /^MAGIC$/, /^DUST$/] },
      solution: `from old_computer import say

secret = "MAGICDUST"
say(secret[0:5])
say(secret[5:])
`,
    },
    {
      checkpoint: {
        text: "Slice dùng mẫu `text[start:stop]`, lấy từ `start` tới trước `stop`. Bỏ `start` nghĩa là bắt đầu từ đầu chuỗi, bỏ `stop` nghĩa là lấy tới cuối chuỗi. `text[-3:]` lấy ba ký tự cuối.",
      },
    },
    {
      quiz: {
        title: "Cắt bằng start:stop",
        questions: [
          {
            q: '`text = "PYTHON"`. Dòng `say(text[0:2])` in gì?',
            a: ["PY", "P", "YT"],
            correct: 0,
          },
          {
            q: '`text = "PYTHON"`. Dòng `say(text[-3:])` in gì?',
            a: ["HON", "PYT", "TH"],
            correct: 0,
          },
          {
            q: "Trong `text[start:stop]`, index `stop` có được lấy vào mảnh cắt không?",
            a: ["Không, mảnh cắt dừng ngay trước `stop`", "Có, luôn lấy cả `stop`", "Chỉ lấy khi `stop` là số âm"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Chuỗi còn có các công cụ gắn sau dấu chấm. Bạn chưa cần gọi tên chúng theo kiểu khó; chỉ cần nhớ mẫu: `text.strip()` gọt khoảng trắng hai đầu, `text.lower()` đưa về chữ thường, `text.upper()` đưa về chữ hoa.",
    },
    {
      code: `from old_computer import say

text = "  Pip CODE  "
say(text.strip())
say(text.lower())
say(text.upper())
`,
      label: "clean_case_demo.py",
      note: "ĐỀ BÀI\nBấm RUN để thấy ba công cụ chuỗi: gọt khoảng trắng, đổi chữ thường, đổi chữ hoa.",
      expectOut: { all: [{ minLines: 3 }, /^Pip CODE$/, /^  pip code  $/, /^  PIP CODE  $/] },
      solution: `from old_computer import say

text = "  Pip CODE  "
say(text.strip())
say(text.lower())
say(text.upper())
`,
    },
    {
      code: `from old_computer import say

spell = "   CODE   "
clean = spell
say(clean)       # Sửa phía trên để output là code, không còn khoảng trắng và chữ hoa
`,
      label: "strip_lower_fix.py",
      note: "ĐỀ BÀI\nSửa biến `clean` bằng cách dùng `strip()` rồi `lower()` để output đúng là code.",
      expectOut: /^code$/,
      solution: `from old_computer import say

spell = "   CODE   "
clean = spell.strip().lower()
say(clean)
`,
    },
    {
      npc: "Ghi nhớ nhanh: `strip()` bỏ khoảng trắng ở hai đầu, `lower()` đổi về chữ thường, `upper()` đổi về chữ hoa. Có thể nối công cụ như `spell.strip().lower()` để dọn xong rồi đổi chữ thường.",
    },
    {
      quiz: {
        title: "Dọn chữ nhập vào",
        questions: [
          {
            q: '`text = "  CODE  "`. Dòng nào tạo ra đúng `"code"`?',
            a: ["`text.strip().lower()`", "`text.lower().upper()`", "`text[0:2]`"],
            correct: 0,
          },
          {
            q: '`text = "Pip"`. Dòng `say(text.upper())` in gì?',
            a: ["PIP", "pip", "Pip"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nhóm công cụ cuối giúp soi và thay chữ bên trong chuỗi: `count(piece)` đếm một mảnh xuất hiện bao nhiêu lần, `find(piece)` trả về index đầu tiên của mảnh đó, `replace(old, new)` thay mảnh cũ bằng mảnh mới.",
    },
    {
      code: `from old_computer import say, say_num

text = "mama magic"
say_num(text.count("ma"))
say_num(text.find("magic"))
say(text.replace("magic", "dust"))
`,
      label: "find_replace_demo.py",
      note: "ĐỀ BÀI\nBấm RUN để đếm mảnh `ma`, tìm vị trí chữ `magic`, rồi thay `magic` thành `dust`.",
      expectOut: { all: [{ minLines: 3 }, /^3$/, /^5$/, /^mama dust$/] },
      solution: `from old_computer import say, say_num

text = "mama magic"
say_num(text.count("ma"))
say_num(text.find("magic"))
say(text.replace("magic", "dust"))
`,
    },
    {
      code: `from old_computer import say, say_num

text = "red red blue"
say_num(text.count("red"))
fixed = text.replace("green", "gold")      # Sửa để thay blue thành gold
say(fixed)
`,
      label: "replace_fix.py",
      note: "ĐỀ BÀI\nDòng đầu phải đếm được 2 chữ red. Dòng sau phải in `red red gold` bằng cách thay đúng mảnh `blue`.",
      expectOut: { all: [{ minLines: 2 }, /^2$/, /^red red gold$/] },
      solution: `from old_computer import say, say_num

text = "red red blue"
say_num(text.count("red"))
fixed = text.replace("blue", "gold")
say(fixed)
`,
    },
    {
      npc: "`split()` tách một chuỗi thành list. `text.split()` tách theo khoảng trắng; `text.split(\",\")` tách tại mỗi dấu phẩy. Chiều ngược lại, `separator.join(parts)` nối các chuỗi trong list và đặt `separator` vào giữa từng phần.",
    },
    {
      code: `from old_computer import say

text = "lua,bang,gio"
parts = text.split(",")
say(parts)
say(" + ".join(parts))
`,
      label: "split_join_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn là chuỗi `lua,bang,gio`; không có INPUT từ bên ngoài. `split(\",\")` tách chuỗi thành list ba phần. Sau đó `\" + \".join(parts)` nối ba phần thành OUTPUT `lua + bang + gio`.",
      expectOut: { all: [{ minLines: 2 }, /^\['lua', 'bang', 'gio'\]$/, /^lua \+ bang \+ gio$/] },
      solution: `from old_computer import say

text = "lua,bang,gio"
parts = text.split(",")
say(parts)
say(" + ".join(parts))
`,
    },
    {
      code: `from old_computer import say

text = "Pip Koto Mira"
parts = text.split(",")       # Sửa dấu dùng để tách chuỗi
result = "-".join(parts)      # Sửa phần chữ đặt giữa các tên
say(result)
`,
      label: "split_join_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn là `Pip Koto Mira`; không có INPUT từ bên ngoài. Hãy tách chuỗi tại khoảng trắng, rồi nối các tên bằng ` -> `. OUTPUT đúng là `Pip -> Koto -> Mira`.",
      expectOut: /^Pip -> Koto -> Mira$/,
      solution: `from old_computer import say

text = "Pip Koto Mira"
parts = text.split()
result = " -> ".join(parts)
say(result)
`,
    },
    {
      checkpoint: {
        text: "`count(piece)` đếm, `find(piece)` tìm index đầu tiên, `replace(old, new)` tạo chuỗi đã thay chữ. `split(separator)` tách chuỗi thành list; `separator.join(parts)` nối list các chuỗi thành một chuỗi mới.",
      },
    },
    {
      quiz: {
        title: "Soi và thay chuỗi",
        questions: [
          {
            q: '`text = "ha ha ho"`. Dòng `say_num(text.count("ha"))` in gì?',
            a: ["2", "1", "0"],
            correct: 0,
          },
          {
            q: '`text = "abcabc"`. Dòng `say_num(text.find("bc"))` in gì?',
            a: ["1", "2", "3"],
            correct: 0,
          },
          {
            q: '`text = "cat cat"`. Dòng nào tạo chuỗi `"dog dog"`?',
            a: ['`text.replace("cat", "dog")`', '`text.find("dog")`', '`text.count("cat")`'],
            correct: 0,
          },
          {
            q: '`text = "red,blue,green"`. Dòng `text.split(",")` tạo giá trị nào?',
            a: ['`["red", "blue", "green"]`', '`"redbluegreen"`', '`["red,blue,green"]`'],
            correct: 0,
          },
          {
            q: '`parts = ["A", "B", "C"]`. Dòng nào tạo chuỗi `"A-B-C"`?',
            a: ['`"-".join(parts)`', '`parts.split("-")`', '`parts.join()`'],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Gom lại thành một mật thư nhỏ: làm sạch chuỗi, thay chữ, tách các phần, rồi nối lại bằng dấu dễ đọc. Đây là lúc các công cụ chuỗi phối hợp trong cùng một chương trình.",
    },
    {
      code: `from old_computer import say

raw = "  KOTO-MAGIC-PORTAL  "
clean = raw
clean = clean.replace("magic", "dust")
parts = clean.split("-")
result = " / ".join(parts)
say(result)
`,
      label: "secret_cleaner.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn là `  KOTO-MAGIC-PORTAL  `; không có INPUT từ bên ngoài. Hãy gọt khoảng trắng, đổi về chữ thường, thay `magic` bằng `dust`, tách tại dấu `-`, rồi nối lại bằng ` / `. OUTPUT đúng là `koto / dust / portal`.",
      expectOut: /^koto \/ dust \/ portal$/,
      solution: `from old_computer import say

raw = "  KOTO-MAGIC-PORTAL  "
clean = raw.strip().lower()
clean = clean.replace("magic", "dust")
parts = clean.split("-")
result = " / ".join(parts)
say(result)
`,
    },
    {
      gift: {
        glyph: "Aa",
        name: "HUY HIỆU CẮT CHUỖI",
        blurb: "đọc và cắt chuỗi, dọn chữ, tìm/thay, rồi chuyển qua lại giữa chuỗi và list bằng split()/join()",
        badge: true,
        badgeId: "huy_hieu_cat_chuoi",
      },
    },
    {
      npc: "MÁY CẮT CHUỖI đã ổn định. Khi gặp một chuỗi dài, bạn có thể đọc từng ký tự, cắt mảnh, dọn chữ, đếm, tìm, thay, rồi dùng `split()` và `join()` để chuyển qua lại giữa chuỗi với list.",
    },
  ],
  ritual: {
    gesture: "✌",
    prompt: "GIƠ HAI NGÓN TAY NIÊM PHONG STRING TOOLKIT",
    theme: {
      motion: "orbit",
      palette: { core: "#f4c85a", dust: "#78b2a5", rune: "#d9eee5" },
      glyphs: "string index slice strip replace split join",
    },
  },
};
