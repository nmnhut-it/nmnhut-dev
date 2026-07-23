// islandSTRINGCHECKS.js — bonus side-island for common string exercises after
// node17 string tools: normalize text, count/find/replace, and compare a
// string with the same characters in reverse order. Reuses string index/slice
// and methods already taught in node17.
export default {
  index: -1,
  sideIslandId: "islandSTRINGCHECKS",
  title: "ĐẢO SOI CHUỖI",
  subtitle: "chuẩn hóa chữ, đếm ký tự, tìm/thay chữ, và kiểm tra chuỗi đối xứng",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ SOI CHUỖI" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI DÒNG CHỮ",
    blurb: "một trạm phụ để luyện các dạng bài chuỗi dễ gặp bằng công cụ đã học",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO SOI CHUỖI ✦",
        hook: "Chuỗi là một hàng ký tự. Khi đã biết `strip()`, `lower()`, `count()`, `find()`, `replace()`, index và slice, bạn có thể giải rất nhiều bài nhỏ: làm sạch chữ, đếm ký tự, tìm vị trí, thay chữ, và so chuỗi với bản đảo thứ tự ký tự.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Đảo này không cần lệnh lạ. Mình chỉ dùng công cụ chuỗi đã có, nhưng ghép thành các bài hay gặp hơn.",
    },

    {
      quiz: {
        title: "Làm sạch chữ trước khi so",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\ntext = \"  Koto  \"\nclean = text.strip()\nclean = clean.lower()\nsay(clean)\n```",
            a: ["koto", "Koto", "  Koto  "],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say

text = "  Koto  "
clean = text.strip()
clean = clean.lower()
say(clean)
`,
      label: "normalize_text_demo.py",
      note: "RUN KIỂM CHỨNG\n`strip()` bỏ khoảng trắng hai đầu. `lower()` đổi chữ hoa thành chữ thường. Kết quả là `koto`.",
      expectOut: /^koto$/,
      solution: `from old_computer import say

text = "  Koto  "
clean = text.strip()
clean = clean.lower()
say(clean)
`,
    },
    {
      code: `from old_computer import say

text = "  MAGIC  "
clean = text.strip()
# Đến lượt của bạn: đổi clean thành chữ thường trước khi in.
say(clean)
`,
      label: "normalize_text_fix.py",
      note: "ĐỀ BÀI\nOutput đúng phải là `magic`: bỏ khoảng trắng hai đầu rồi đổi thành chữ thường. Thêm dòng `clean = clean.lower()` trước `say(clean)`.",
      expectOut: /^magic$/,
      solution: `from old_computer import say

text = "  MAGIC  "
clean = text.strip()
clean = clean.lower()
say(clean)
`,
    },
    {
      checkpoint: {
        text: "Khi so sánh chuỗi do người dùng gõ, thường cần chuẩn hóa trước: `strip()` bỏ khoảng trắng hai đầu, `lower()` đổi về chữ thường để `Koto`, `koto`, và `  KOTO  ` dễ được xử lý giống nhau.",
      },
    },
    {
      quiz: {
        title: "Thứ tự làm sạch",
        questions: [
          {
            q: "`text = \"  YES  \"`. Sau hai dòng `clean = text.strip()` rồi `clean = clean.lower()`, `clean` giữ chuỗi nào?",
            a: ["yes", "YES", "  yes  "],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài tiếp theo là đếm. Nếu chỉ cần đếm một ký tự hoặc một cụm chữ, `count()` làm rất gọn.",
    },
    {
      code: `from old_computer import say_num

text = "banana"
say_num(text.count("a"))
say_num(text.count("na"))
`,
      label: "string_count_demo.py",
      note: "RUN KIỂM CHỨNG\nTrong `banana`, chữ `a` xuất hiện 3 lần. Cụm `na` xuất hiện 2 lần.",
      expectOut: { all: [{ minLines: 2 }, /^3$/, /^2$/] },
      solution: `from old_computer import say_num

text = "banana"
say_num(text.count("a"))
say_num(text.count("na"))
`,
    },
    {
      code: `from old_computer import say_num

text = "kotopia"
# Đến lượt của bạn: đếm chữ o trong text.
say_num(text.count("a"))
`,
      label: "string_count_fix.py",
      note: "ĐỀ BÀI\nChuỗi `kotopia` có hai chữ `o`. Sửa đối số trong `count(...)` để output là 2.",
      expectOut: /^2$/,
      solution: `from old_computer import say_num

text = "kotopia"
say_num(text.count("o"))
`,
    },
    {
      checkpoint: {
        text: "`text.count(x)` đếm số lần `x` xuất hiện trong chuỗi. `x` có thể là một ký tự như `\"o\"` hoặc một cụm chữ như `\"na\"`.",
      },
    },
    {
      quiz: {
        title: "Đếm ký tự",
        questions: [
          {
            q: "`text = \"abracadabra\"`. Dòng `say_num(text.count(\"a\"))` in ra số nào?",
            a: ["2", "5", "11"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "`find()` cho biết vị trí đầu tiên của một cụm chữ. Nếu không tìm thấy, nó trả về `-1`. Nhớ: chuỗi cũng đếm index từ 0.",
    },
    {
      code: `from old_computer import say_num

text = "magic dust"
say_num(text.find("dust"))
say_num(text.find("bug"))
`,
      label: "string_find_demo.py",
      note: "RUN KIỂM CHỨNG\n`dust` bắt đầu ở index 6. Cụm `bug` không có trong chuỗi, nên `find()` cho ra -1.",
      expectOut: { all: [{ minLines: 2 }, /^6$/, /^-1$/] },
      solution: `from old_computer import say_num

text = "magic dust"
say_num(text.find("dust"))
say_num(text.find("bug"))
`,
    },
    {
      code: `from old_computer import say

text = "portal open"
position = text.find("close")

if position == -1:
    say("CHUA CO")
else:
    say("DA CO")
`,
      label: "string_find_check.py",
      note: "RUN KIỂM CHỨNG\n`close` không có trong `portal open`, nên `find()` trả về -1 và máy in `CHUA CO`.",
      expectOut: /^CHUA CO$/,
      solution: `from old_computer import say

text = "portal open"
position = text.find("close")

if position == -1:
    say("CHUA CO")
else:
    say("DA CO")
`,
    },
    {
      quiz: {
        title: "find không tìm thấy",
        questions: [
          {
            q: "`text = \"magic dust\"`. Nếu chạy `text.find(\"stone\")`, kết quả là gì?",
            a: ["-1", "0", "10"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "`text.find(x)` trả về index đầu tiên của `x`; nếu không tìm thấy thì trả về `-1`. Vì vậy có thể kiểm tra `if position == -1:` để biết chuỗi chưa có cụm cần tìm.",
    },

    {
      npc: "Thay chữ cũng là một dạng bài hay gặp. `replace(old_text, new_text)` tạo chuỗi mới trong đó các cụm `old_text` được thay bằng `new_text`.",
    },
    {
      code: `from old_computer import say

text = "bug bug fixed"
fixed = text.replace("bug", "dust")
say(fixed)
`,
      label: "string_replace_demo.py",
      note: "RUN KIỂM CHỨNG\n`replace(\"bug\", \"dust\")` thay cả hai cụm `bug`, nên output là `dust dust fixed`.",
      expectOut: /^dust dust fixed$/,
      solution: `from old_computer import say

text = "bug bug fixed"
fixed = text.replace("bug", "dust")
say(fixed)
`,
    },
    {
      code: `from old_computer import say

text = "red door, red key"
fixed = text.replace("door", "blue")
say(fixed)
`,
      label: "string_replace_fix.py",
      note: "ĐỀ BÀI\nBài cần đổi mọi chữ `red` thành `blue`, để output là `blue door, blue key`. Sửa đối số đầu tiên của `replace(...)`.",
      expectOut: /^blue door, blue key$/,
      solution: `from old_computer import say

text = "red door, red key"
fixed = text.replace("red", "blue")
say(fixed)
`,
    },
    {
      remember:
        "`text.replace(old_text, new_text)` tạo chuỗi mới sau khi thay mọi cụm `old_text` bằng `new_text`. Nếu muốn giữ kết quả, gán vào biến mới như `fixed = text.replace(\"red\", \"blue\")`.",
    },

    {
      npc: "Dạng bài cuối: chuỗi đối xứng. Một chuỗi đối xứng là chuỗi vẫn giống nhau sau khi đảo thứ tự ký tự. Ví dụ: `level` là chuỗi đối xứng vì đảo xong vẫn là `level`; `koto` không đối xứng vì đảo thành `otok`. Ta có thể lấy chuỗi đảo thứ tự bằng slice `text[::-1]`.",
    },
    {
      quiz: {
        title: "Chuỗi sau khi đảo thứ tự ký tự",
        questions: [
          {
            q: "`text = \"level\"`. Dòng `text[::-1]` tạo chuỗi nào?",
            a: ["level", "lev", "el"],
            correct: 0,
          },
          {
            q: "`text = \"koto\"`. Dòng `text[::-1]` tạo chuỗi nào?",
            a: ["otok", "koto", "toko"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say

text = "level"
reversed_text = text[::-1]

if text == reversed_text:
    say("GIONG NHAU")
else:
    say("KHAC NHAU")
`,
      label: "string_mirror_demo.py",
      note: "RUN KIỂM CHỨNG\n`level` sau khi đảo thứ tự ký tự vẫn là `level`, nên máy in `GIONG NHAU`.",
      expectOut: /^GIONG NHAU$/,
      solution: `from old_computer import say

text = "level"
reversed_text = text[::-1]

if text == reversed_text:
    say("GIONG NHAU")
else:
    say("KHAC NHAU")
`,
    },
    {
      code: `from old_computer import say

text = "  RaceCar  "
clean = text.strip()
reversed_text = clean[::-1]

if clean == reversed_text:
    say("GIONG NHAU")
else:
    say("KHAC NHAU")
`,
      label: "string_mirror_fix.py",
      note: "ĐỀ BÀI\nBài cần xem `RaceCar` là đối xứng nếu không phân biệt chữ hoa/thường. Output đúng phải là `GIONG NHAU`. Sau `strip()`, thêm dòng đổi `clean` thành chữ thường trước khi tạo `reversed_text`.",
      expectOut: /^GIONG NHAU$/,
      solution: `from old_computer import say

text = "  RaceCar  "
clean = text.strip()
clean = clean.lower()
reversed_text = clean[::-1]

if clean == reversed_text:
    say("GIONG NHAU")
else:
    say("KHAC NHAU")
`,
    },
    {
      checkpoint: {
        text: "Kiểm tra chuỗi đối xứng: chuẩn hóa chuỗi nếu cần (`strip()`, `lower()`), tạo `reversed_text = clean[::-1]`, rồi so `clean == reversed_text`.",
      },
    },
    {
      quiz: {
        title: "So với chuỗi đảo thứ tự",
        questions: [
          {
            q: "`clean = \"madam\"`, `reversed_text = clean[::-1]`. Điều kiện `clean == reversed_text` đúng hay sai?",
            a: ["Đúng", "Sai", "Máy báo lỗi"],
            correct: 0,
          },
          {
            q: "`clean = \"magic\"`, `reversed_text = clean[::-1]`. Điều kiện `clean == reversed_text` đúng hay sai?",
            a: ["Sai", "Đúng", "Máy báo lỗi"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Bốn dạng bài chuỗi dễ gặp: chuẩn hóa bằng `strip()` và `lower()`; đếm bằng `count()`; tìm bằng `find()` và kiểm tra `-1`; thay chữ bằng `replace()`; kiểm tra chuỗi đối xứng bằng cách so với `text[::-1]` sau khi đã làm sạch chuỗi.",
    },
  ],
};
