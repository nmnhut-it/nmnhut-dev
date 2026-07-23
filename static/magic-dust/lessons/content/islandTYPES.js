// islandTYPES.js — ĐẢO KIỂU DỮ LIỆU, a bonus side-island (island.js, not
// node.js): extra reps for node08's vocabulary (`type()`, `str`, `int`,
// `bool`, string-vs-number behavior, and bool values from comparisons).
// node08 may be authored in parallel, so this island uses only the handed-off
// node08 vocabulary list. Per PEDAGOGY-METHOD.md this reuses ONLY
// already-taught vocabulary (no new concept — pure retrieval + practice).
// Gated unlockAt:9 (after node08 — primitive data types — is done).
export default {
  index: -1,
  sideIslandId: "islandTYPES",
  title: "ĐẢO KIỂU DỮ LIỆU",
  subtitle: "luyện thêm type(), str/int/bool, và lỗi ghép chữ với số",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ SOI KIỂU" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI KIỂU DỮ LIỆU",
    blurb: "một cỗ máy phụ để luyện str/int/bool — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO KIỂU DỮ LIỆU ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Ai muốn luyện mắt nhận ra đâu là chữ, đâu là số, đâu là đúng/sai, thì cứ ghé qua!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Kiểu Dữ Liệu! Ở đây Pip chỉ ôn lại ba kiểu cơ bản bạn vừa học: `str` là chữ, `int` là số nguyên, `bool` là kết quả đúng/sai. `type(...)` là kính lúp để soi một giá trị thuộc kiểu nào.",
    },

    // ── bài 1: dự đoán type() của literal và biến ──
    {
      quiz: {
        title: "Soi kiểu trước khi RUN — types1.py",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nname = "Pip"\npower = 7\ngate_open = power > 5\nsay(type(name))\nsay(type(power))\nsay(type(gate_open))\n```\nBa dòng `type(...)` hiện theo thứ tự nào?',
            a: ["str, int, bool", "int, str, bool", "bool, int, str"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\nname = "Pip"\npower = 7\ngate_open = power > 5\nsay(type(name))\nsay(type(power))\nsay(type(gate_open))\n',
      label: "types1.py",
      note: "RUN KIỂM CHỨNG\nCác giá trị `name`, `power`, `gate_open` đều được gán sẵn trong code, không phải INPUT.\nBấm ▶ RUN để soi ba biến bằng `type(...)` theo đúng thứ tự bạn vừa đoán.",
      expectOut: { all: [{ minLines: 3 }, /str/i, /int/i, /bool/i] },
      solution: 'from old_computer import say\n\nname = "Pip"\npower = 7\ngate_open = power > 5\nsay(type(name))\nsay(type(power))\nsay(type(gate_open))\n',
    },
    {
      code: 'from old_computer import say\n\nitem = "bụi phép"\npower = 4\n# lượt của bạn — tạo biến enough_power bằng phép so sánh power >= 4, rồi say(type(...)) cho cả ba biến\n',
      label: "types_write1.py",
      note: "ĐỀ BÀI (tự viết)\nGiá trị cho sẵn: `item = \"bụi phép\"`, `power = 4`. Không có INPUT từ ngoài chương trình.\nTạo `enough_power = power >= 4`. Sau đó dùng `say(type(item))`, `say(type(power))`, và `say(type(enough_power))` để máy hiện đủ str, int, bool.",
      expectOut: { all: [{ minLines: 3 }, /str/i, /int/i, /bool/i] },
      solution: 'from old_computer import say\n\nitem = "bụi phép"\npower = 4\nenough_power = power >= 4\nsay(type(item))\nsay(type(power))\nsay(type(enough_power))\n',
    },
    {
      checkpoint: {
        text: "`type(x)` cho biết kiểu dữ liệu hiện tại của `x`: chữ nằm trong dấu nháy là `str`, số nguyên như `7` là `int`, còn kết quả so sánh như `power > 5` là `bool`.",
      },
    },
    {
      quiz: {
        title: "type() của biến mới",
        questions: [
          {
            q: '`score = 3`, `result = score >= 5`, rồi `say(type(result))`. Máy hiện kiểu nào?',
            a: ["int", "str", "bool — vì `result` giữ kết quả đúng/sai của phép so sánh"],
            correct: 2,
          },
        ],
      },
    },

    // ── bài 2: "5"+"3" khác 5+3 ──
    {
      npc: "Giờ nhìn một cặp rất dễ nhầm: chữ số trong dấu nháy vẫn là CHỮ. Vì vậy `\"5\" + \"3\"` là nối chuỗi thành `53`, còn `5 + 3` mới là phép cộng ra 8.",
    },
    {
      quiz: {
        title: "Chữ 5 khác số 5",
        questions: [
          {
            q: 'Hai dòng này chạy liên tiếp:\n```python\nsay("5" + "3")\nsay_num(5 + 3)\n```\nMáy in gì?',
            a: ["53 rồi 8", "8 rồi 8", "53 rồi 53"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say, say_num\n\nsay("5" + "3")\nsay_num(5 + 3)\n',
      label: "string_vs_int.py",
      note: "RUN KIỂM CHỨNG\nBấm ▶ RUN để thấy cùng ký hiệu `+`, nhưng `str + str` nối chữ, còn `int + int` cộng số.",
      expectOut: { all: [{ minLines: 2 }, /^53$/, /^8$/] },
      solution: 'from old_computer import say, say_num\n\nsay("5" + "3")\nsay_num(5 + 3)\n',
    },
    {
      code: 'from old_computer import say_num\n\na = "5"\nb = "3"\n# lượt của bạn — dùng int(a) và int(b) để cộng ra số 8\nsay_num(a + b)\n',
      label: "int_fix_sum.py",
      note: "ĐỀ BÀI (sửa lỗi)\n`a + b` đang nối hai chuỗi thành 53. Sửa dòng cuối thành `say_num(int(a) + int(b))` để đổi hai chữ số thành số nguyên trước khi cộng.",
      expectOut: /^8$/,
      solution: 'from old_computer import say_num\n\na = "5"\nb = "3"\nsay_num(int(a) + int(b))\n',
    },
    {
      checkpoint: {
        text: "Dấu `+` làm việc theo kiểu dữ liệu: `str + str` nối chuỗi, còn `int + int` cộng số. Muốn cộng chữ số như `\"5\"`, phải đổi nó thành số bằng `int(\"5\")` trước.",
      },
    },
    {
      quiz: {
        title: "Dự đoán + theo kiểu",
        questions: [
          {
            q: '`a = "2"`, `b = "4"`. Muốn kết quả là số 6, dòng nào đúng?',
            a: ['`say(a + b)`', "`say_num(int(a) + int(b))`", '`say("a" + "b")`'],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 3: bool như một giá trị bình thường ──
    {
      npc: "Kết quả so sánh không chỉ để đặt ngay sau `if`. Bạn có thể cất nó vào một biến, rồi `say(...)` ra để soi. Biến đó giữ một giá trị `bool`: True hoặc False.",
    },
    {
      quiz: {
        title: "Bool cất trong biến",
        questions: [
          {
            q: 'Cho `a = 2`, `b = 5`, rồi `result = a > b`. Nếu `say(result)`, máy in gì?',
            a: ["True", "False — vì 2 không lớn hơn 5", "2 > 5"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\na = 7\nb = 3\nresult = a > b\nsay(result)\n\na = 2\nb = 5\nresult = a > b\nsay(result)\n\na = 4\nb = 4\nresult = a >= b\nsay(result)\n',
      label: "bool_pairs.py",
      note: "RUN KIỂM CHỨNG\nBa cặp số khác nhau tạo ra ba giá trị bool. Bấm ▶ RUN và đọc từng dòng True/False theo phép so sánh ngay phía trên nó.",
      expectOut: { all: [{ minLines: 3 }, /^True$/, /^False$/] },
      solution: 'from old_computer import say\n\na = 7\nb = 3\nresult = a > b\nsay(result)\n\na = 2\nb = 5\nresult = a > b\nsay(result)\n\na = 4\nb = 4\nresult = a >= b\nsay(result)\n',
    },
    {
      code: 'from old_computer import say\n\na = 3\nb = 6\n# lượt của bạn — cất kết quả a > b vào biến result, rồi say(result)\n',
      label: "bool_write.py",
      note: "ĐỀ BÀI (tự viết)\nGiá trị cho sẵn: `a = 3`, `b = 6`. Không có INPUT từ ngoài chương trình.\nViết `result = a > b`, rồi `say(result)`. Vì 3 không lớn hơn 6, máy phải nói False.",
      expectOut: /^False$/,
      solution: 'from old_computer import say\n\na = 3\nb = 6\nresult = a > b\nsay(result)\n',
    },
    {
      checkpoint: {
        text: "Một phép so sánh như `a > b` tạo ra giá trị `bool`; giá trị đó có thể cất vào biến (`result = a > b`) và in ra y như chữ hoặc số.",
      },
    },
    {
      quiz: {
        title: "So sánh tạo bool",
        questions: [
          {
            q: "`a = 9`, `b = 9`, `result = a > b`. Dòng `say(result)` in gì?",
            a: ["True", "False — vì 9 không lớn hơn hẳn 9", "bool"],
            correct: 1,
          },
          {
            q: "`a = 9`, `b = 9`, `result = a >= b`. Dòng `say(result)` in gì?",
            a: ["True — vì `>=` có tính trường hợp bằng", "False", "int"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 4: lỗi str + int khi ghép câu ──
    {
      npc: "Vết nứt cuối đảo: ghép chữ với số nguyên trực tiếp. Máy hiểu `\"Sức mạnh: \"` là `str`, còn `5` là `int`; hai kiểu đó không tự nối vào nhau được. Muốn ghép vào câu, đổi số thành chữ bằng `str(...)` trước.",
    },
    {
      quiz: {
        title: "str + int bị nứt",
        questions: [
          {
            q: 'Đoạn code viết `say("Sức mạnh: " + 5)`. Vì sao máy báo lỗi?',
            a: [
              "Vì đang ghép một `str` với một `int`; phải đổi 5 thành `str(5)` trước",
              "Vì số 5 không được dùng trong say()",
              "Vì dấu + chỉ dùng được cho phép cộng, không dùng với chữ",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\npower = 5\nsay("Sức mạnh: " + power)\n',
      label: "concat_fix.py",
      note: "ĐỀ BÀI (sửa lỗi)\nGiá trị cho sẵn: `power = 5`. Không có INPUT từ ngoài chương trình.\nĐoạn code đang ghép `str` với `int`. Sửa dòng cuối thành `say(\"Sức mạnh: \" + str(power))` để máy nói đúng `Sức mạnh: 5`.",
      expectOut: /sức mạnh: 5/i,
      solution: 'from old_computer import say\n\npower = 5\nsay("Sức mạnh: " + str(power))\n',
    },
    {
      checkpoint: {
        text: "Khi ghép câu bằng `+`, hai vế phải cùng là `str`; nếu một vế là `int`, dùng `str(number)` để đổi số thành chữ trước khi nối chuỗi.",
      },
    },
    {
      quiz: {
        title: "Sửa ghép chữ với số",
        questions: [
          {
            q: '`name = "Pip"`, `power = 7`. Dòng nào tạo được câu "Pip có 7 sức mạnh" mà không làm máy báo lỗi?',
            a: ['`say(name + " có " + power + " sức mạnh")`', '`say(name + " có " + str(power) + " sức mạnh")`', '`say(str(name + power))`'],
            correct: 1,
          },
        ],
      },
    },

    {
      remember:
        "Kiểu dữ liệu quyết định cách máy xử lý giá trị: `str` dùng để nối chữ, `int` dùng để tính số, `bool` giữ True/False từ phép so sánh. Dùng `type(...)` để soi kiểu, `int(...)` để đổi chữ số thành số, và `str(...)` để đổi số thành chữ khi cần ghép câu.",
    },
  ],
};
