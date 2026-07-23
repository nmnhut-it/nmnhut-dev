// islandIFPATTERNS.js — bonus side-island for common beginner condition
// exercises after logic gates: choose a larger value, classify by ordered
// thresholds, check a range with and, and choose an operation by a text token.
// No new syntax; this is retrieval practice for if/elif/else, comparisons,
// and/or, variables, strings, and arithmetic.
export default {
  index: -1,
  sideIslandId: "islandIFPATTERNS",
  title: "ĐẢO BÀI ĐIỀU KIỆN HAY GẶP",
  subtitle: "chọn số lớn, xếp loại, kiểm tra khoảng, và chọn phép tính nhỏ",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ ĐIỀU KIỆN" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI LUẬT NHỎ",
    blurb: "một trạm phụ để luyện các dạng bài if/elif/else hay gặp, không mở kiến thức mới",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO BÀI ĐIỀU KIỆN ✦",
        hook: "Đảo này gom vài bài nhỏ rất hay gặp: chọn số lớn hơn, xếp loại theo điểm, kiểm tra một số có nằm trong khoảng không, rồi chọn phép tính theo ký hiệu. Không có boss; chỉ có nhiều lượt đọc luật và sửa luật cho chắc tay.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Pip gọi đây là đảo soi luật. Mỗi bài chỉ hỏi một việc: điều kiện nào đúng, nhánh nào chạy, và output cuối cùng là gì. Nếu đọc được bằng mắt trước khi RUN, bạn đang thật sự điều khiển được if/elif/else.",
    },

    {
      quiz: {
        title: "Chọn số lớn hơn",
        questions: [
          {
            q: "Đoạn này in ra số nào?\n```python\na = 7\nb = 4\nif a > b:\n    say_num(a)\nelse:\n    say_num(b)\n```",
            a: ["7", "4", "11"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

a = 7
b = 4

if a > b:
    say_num(a)
else:
    say_num(b)
`,
      label: "choose_bigger_demo.py",
      note: "RUN KIỂM CHỨNG\nBài này chọn số lớn hơn trong hai số. Vì `a` là 7 và `b` là 4, nhánh `if a > b` chạy.",
      expectOut: /^7$/,
      solution: `from old_computer import say_num

a = 7
b = 4

if a > b:
    say_num(a)
else:
    say_num(b)
`,
    },
    {
      code: `from old_computer import say_num

a = 3
b = 9

# Đến lượt của bạn: sửa điều kiện để máy in số lớn hơn.
if a > b:
    say_num(a)
else:
    say_num(a)
`,
      label: "choose_bigger_fix.py",
      note: "ĐỀ BÀI\nHai số là `a = 3` và `b = 9`. Output đúng phải là 9. Bài đang sai ở nhánh `else`: khi `a` không lớn hơn `b`, cần in `b`.",
      expectOut: /^9$/,
      solution: `from old_computer import say_num

a = 3
b = 9

if a > b:
    say_num(a)
else:
    say_num(b)
`,
    },
    {
      checkpoint: {
        text: "Cách làm bài chọn số lớn hơn: so sánh `a > b`; nếu đúng thì dùng `a`, nếu sai thì dùng `b`. Nhánh `else` không cần điều kiện riêng vì nó bắt phần còn lại của phép so sánh.",
      },
    },
    {
      quiz: {
        title: "Nhánh còn lại giữ giá trị nào",
        questions: [
          {
            q: "`a = 2`, `b = 8`. Muốn in số lớn hơn bằng cách `if a > b: ... else: ...`, nhánh `else` phải in gì?",
            a: ["`b`", "`a`", "`a + b`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài thứ hai là xếp loại theo nhiều mốc. Với các mốc dùng `>=`, mình phải kiểm tra mốc cao trước. Nếu đặt mốc thấp trước, máy sẽ dừng quá sớm ở nhánh dễ đúng hơn.",
    },
    {
      quiz: {
        title: "Xếp loại theo điểm",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\nscore = 82\nif score >= 90:\n    say(\"XUAT SAC\")\nelif score >= 75:\n    say(\"TOT\")\nelse:\n    say(\"CAN LUYEN\")\n```",
            a: ["XUAT SAC", "TOT", "CAN LUYEN"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from old_computer import say

score = 82

if score >= 90:
    say("XUAT SAC")
elif score >= 75:
    say("TOT")
else:
    say("CAN LUYEN")
`,
      label: "grade_band_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `score = 82`. Không có INPUT từ ngoài chương trình.\n`score` không đạt mốc 90, nhưng đạt mốc 75, nên máy in `TOT`.",
      expectOut: /^TOT$/,
      solution: `from old_computer import say

score = 82

if score >= 90:
    say("XUAT SAC")
elif score >= 75:
    say("TOT")
else:
    say("CAN LUYEN")
`,
    },
    {
      code: `from old_computer import say

score = 95

# Đến lượt của bạn: sửa thứ tự các mốc để điểm 95 được xếp XUAT SAC.
if score >= 75:
    say("TOT")
elif score >= 90:
    say("XUAT SAC")
else:
    say("CAN LUYEN")
`,
      label: "grade_band_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `score = 95`. Không có INPUT từ ngoài chương trình.\n`score = 95` phải in `XUAT SAC`. Bài đang kiểm tra `score >= 75` trước, nên máy dừng quá sớm ở nhánh `TOT`. Sắp xếp mốc 90 trước mốc 75.",
      expectOut: /^XUAT SAC$/,
      solution: `from old_computer import say

score = 95

if score >= 90:
    say("XUAT SAC")
elif score >= 75:
    say("TOT")
else:
    say("CAN LUYEN")
`,
    },
    {
      checkpoint: {
        text: "Với chuỗi `if`/`elif` dùng nhiều mốc `>=`, đặt mốc cao trước mốc thấp. Máy chạy nhánh đúng đầu tiên rồi bỏ qua các nhánh dưới, nên thứ tự mốc quyết định kết quả.",
      },
    },
    {
      quiz: {
        title: "Mốc cao phải đứng trước",
        questions: [
          {
            q: "Luật muốn: 90 trở lên là `A`, 70 trở lên là `B`, còn lại là `C`. Điều kiện nào nên đứng trước?",
            a: ["`score >= 90`", "`score >= 70`", "`score < 70`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài thứ ba là kiểm tra một số có nằm trong khoảng không. Đây là lúc `and` rất hữu ích: cả điều kiện bên trái và bên phải đều phải đúng.",
    },
    {
      code: `from old_computer import say

number = 14

if number >= 10 and number <= 20:
    say("TRONG KHOANG")
else:
    say("NGOAI KHOANG")
`,
      label: "range_check_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `number = 14`. Không có INPUT từ ngoài chương trình.\n`number` vừa đạt `number >= 10`, vừa đạt `number <= 20`, nên toàn bộ điều kiện nối bằng `and` là đúng.",
      expectOut: /^TRONG KHOANG$/,
      solution: `from old_computer import say

number = 14

if number >= 10 and number <= 20:
    say("TRONG KHOANG")
else:
    say("NGOAI KHOANG")
`,
    },
    {
      code: `from old_computer import say

number = 25

# Đến lượt của bạn: luật cần 10 đến 20, nhưng điều kiện bên phải đang sai mốc.
if number >= 10 and number <= 30:
    say("TRONG KHOANG")
else:
    say("NGOAI KHOANG")
`,
      label: "range_check_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `number = 25`. Không có INPUT từ ngoài chương trình.\nKhoảng đúng là từ 10 đến 20. `number = 25` phải in `NGOAI KHOANG`. Sửa mốc bên phải để điều kiện là `number <= 20`.",
      expectOut: /^NGOAI KHOANG$/,
      solution: `from old_computer import say

number = 25

if number >= 10 and number <= 20:
    say("TRONG KHOANG")
else:
    say("NGOAI KHOANG")
`,
    },
    {
      checkpoint: {
        text: "Cách kiểm tra khoảng: `number >= start and number <= end`. Với `and`, toàn bộ điều kiện chỉ đúng khi cả hai phía đều đúng.",
      },
    },
    {
      quiz: {
        title: "Cả hai phía của and",
        questions: [
          {
            q: "`number = 9`. Điều kiện `number >= 10 and number <= 20` có đúng không?",
            a: ["Sai, vì 9 không đạt phía `number >= 10`", "Đúng, vì 9 vẫn nhỏ hơn 20", "Đúng, vì chỉ cần một phía đúng"],
            correct: 0,
          },
          {
            q: "`number = 20`. Điều kiện `number >= 10 and number <= 20` có đúng không?",
            a: ["Đúng, vì 20 nằm đúng tại mốc cuối và `<= 20` có tính bằng", "Sai, vì 20 là mốc cuối", "Sai, vì phải dùng `< 20`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài cuối là máy tính nhỏ: ký hiệu trong biến `phep` quyết định nhánh nào chạy. Đây chỉ là if/elif/else với chuỗi, cộng thêm phép tính bạn đã biết.",
    },
    {
      code: `from old_computer import say_num

a = 6
b = 3
op = "*"

if op == "+":
    say_num(a + b)
elif op == "-":
    say_num(a - b)
elif op == "*":
    say_num(a * b)
else:
    say_num(a / b)
`,
      label: "tiny_calculator_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `op = \"*\"`. Không có INPUT từ ngoài chương trình.\n`op` là ký hiệu phép tính cần chạy, nên máy chạy nhánh nhân và in `6 * 3 = 18`.",
      expectOut: /^18$/,
      solution: `from old_computer import say_num

a = 6
b = 3
op = "*"

if op == "+":
    say_num(a + b)
elif op == "-":
    say_num(a - b)
elif op == "*":
    say_num(a * b)
else:
    say_num(a / b)
`,
    },
    {
      code: `from old_computer import say_num

a = 8
b = 2
op = "-"

# Đến lượt của bạn: điền các nhánh còn thiếu để phép "-" in ra 6.
if op == "+":
    say_num(a + b)
else:
    say_num(a / b)
`,
      label: "tiny_calculator_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `a = 8`, `b = 2`, `op = \"-\"`. Không có INPUT từ ngoài chương trình.\nThêm nhánh `elif op == \"-\":` để máy in `a - b`. Output đúng là 6.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

a = 8
b = 2
op = "-"

if op == "+":
    say_num(a + b)
elif op == "-":
    say_num(a - b)
else:
    say_num(a / b)
`,
    },
    {
      quiz: {
        title: "Chọn nhánh theo ký hiệu",
        questions: [
          {
            q: "`a = 8`, `b = 2`, `op = \"-\"`. Trong chuỗi if/elif, nhánh nào cần chạy để output là 6?",
            a: ["`elif op == \"-\": say_num(a - b)`", "`if op == \"+\": say_num(a + b)`", "`else: say_num(a / b)`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Bốn dạng bài điều kiện dễ gặp: chọn số lớn hơn bằng `if a > b`; xếp loại bằng mốc cao trước mốc thấp; kiểm tra khoảng bằng `number >= start and number <= end`; chọn phép tính bằng chuỗi `op` và chuỗi `if`/`elif`.",
    },
  ],
};
