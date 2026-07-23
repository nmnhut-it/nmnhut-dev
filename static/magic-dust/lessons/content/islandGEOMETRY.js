// islandGEOMETRY.js - geometry practice using arithmetic plus if/elif/else.
export default {
  index: -1,
  sideIslandId: "islandGEOMETRY",
  title: "ĐẢO HÌNH HỌC NHỎ",
  subtitle: "kiểm tra tam giác và tính diện tích vài hình quen thuộc",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI THƯỚC HÌNH HỌC" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY ĐO HÌNH",
    blurb: "một trạm phụ để ghép phép tính với if/elif/else trong các bài hình học nhỏ",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO HÌNH HỌC NHỎ ✦",
        hook: "Đảo này gom các bài hình học dễ gặp: diện tích hình chữ nhật, diện tích hình vuông, kiểm tra ba cạnh có tạo thành tam giác không, rồi chọn công thức theo tên hình.",
        art: "assets/old-computer.webp",
      },
    },
    {
      quiz: {
        title: "Ôn điều kiện nối bằng and",
        questions: [
          {
            q: "Điều kiện `a > 0 and b > 0` chỉ đúng khi nào?",
            a: ["Cả `a > 0` và `b > 0` đều đúng", "Chỉ cần một phía đúng", "Luôn đúng vì có hai điều kiện"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bắt đầu bằng diện tích hình chữ nhật nhé. Công thức chỉ là dài nhân rộng, nên máy chưa cần rẽ nhánh.",
    },
    {
      code: `from old_computer import say_num

length = 6
width = 4
area = length * width

say_num(area)
`,
      label: "dien_tich_chu_nhat.py",
      note: "RUN KIỂM CHỨNG\nHình chữ nhật có `length = 6` và `width = 4`, nên diện tích là `6 * 4 = 24`.",
      expectOut: /^24$/,
      solution: `from old_computer import say_num

length = 6
width = 4
area = length * width

say_num(area)
`,
    },
    {
      code: `from old_computer import say_num

canh = 5

# Đến lượt của bạn: diện tích hình vuông là cạnh nhân cạnh.
area = canh + canh
say_num(area)
`,
      label: "dien_tich_hinh_vuong_fix.py",
      note: "ĐỀ BÀI\nHình vuông có cạnh bằng 5, nên diện tích đúng là 25. Sửa phép cộng thành phép nhân cạnh với chính nó.",
      expectOut: /^25$/,
      solution: `from old_computer import say_num

canh = 5

area = canh * canh
say_num(area)
`,
    },
    {
      checkpoint: {
        text: "Diện tích hình chữ nhật là `length * width`; diện tích hình vuông là `canh * canh`. Khi công thức không cần chọn nhánh, máy chỉ chạy lần lượt các dòng tính toán.",
      },
    },
    {
      quiz: {
        title: "Diện tích cơ bản",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\nlength = 7\nwidth = 3\narea = length * width\nsay_num(area)\n```",
            a: ["21", "10", "73"],
            correct: 0,
          },
          {
            q: "Hình vuông có `canh = 4`. Dòng nào tính diện tích đúng?",
            a: ["`area = canh * canh`", "`area = canh + canh`", "`area = canh - canh`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ mới cần `if`. Ba cạnh tạo được tam giác khi mỗi cặp cạnh cộng lại lớn hơn cạnh còn lại. Ví dụ: 3, 4, 5 tạo được tam giác; 2, 3, 5 không tạo được vì 2 + 3 chỉ bằng 5, chưa lớn hơn 5. Chỉ cần một phía không đủ lớn là không thành tam giác.",
    },
    {
      code: `from old_computer import say

a = 3
b = 4
c = 5

if a + b > c and a + c > b and b + c > a:
    say("TAM GIAC")
else:
    say("KHONG TAM GIAC")
`,
      label: "tam_giac_demo.py",
      note: "RUN KIỂM CHỨNG\nBa cạnh 3, 4, 5 tạo được tam giác vì cả ba điều kiện cộng cạnh đều đúng.",
      expectOut: /^TAM GIAC$/,
      solution: `from old_computer import say

a = 3
b = 4
c = 5

if a + b > c and a + c > b and b + c > a:
    say("TAM GIAC")
else:
    say("KHONG TAM GIAC")
`,
    },
    {
      code: `from old_computer import say

a = 2
b = 3
c = 5

# Đến lượt của bạn: 2 + 3 chỉ bằng 5, chưa lớn hơn 5.
if a + b >= c and a + c >= b and b + c >= a:
    say("TAM GIAC")
else:
    say("KHONG TAM GIAC")
`,
      label: "tam_giac_fix.py",
      note: "ĐỀ BÀI\nBa cạnh 2, 3, 5 không tạo thành tam giác vì `2 + 3` chỉ bằng 5. Sửa các dấu `>=` thành `>` để máy in `KHONG TAM GIAC`.",
      expectOut: /^KHONG TAM GIAC$/,
      solution: `from old_computer import say

a = 2
b = 3
c = 5

if a + b > c and a + c > b and b + c > a:
    say("TAM GIAC")
else:
    say("KHONG TAM GIAC")
`,
    },
    {
      checkpoint: {
        text: "Ba cạnh `a`, `b`, `c` tạo thành tam giác khi cả ba điều kiện đều đúng: `a + b > c`, `a + c > b`, và `b + c > a`. Dùng `and` vì thiếu một điều kiện là không đủ.",
      },
    },
    {
      quiz: {
        title: "Ba cạnh có đủ không",
        questions: [
          {
            q: "Ba cạnh `a = 4`, `b = 4`, `c = 9`. Điều kiện đầu `a + b > c` có đúng không?",
            a: ["Sai, vì 4 + 4 không lớn hơn 9", "Đúng, vì 4 + 4 bằng 8", "Đúng, vì cả ba số đều dương"],
            correct: 0,
          },
          {
            q: "Muốn kiểm tra ba cạnh tạo thành tam giác, vì sao cần nối ba điều kiện bằng `and`?",
            a: ["Vì cả ba phép so sánh đều phải đúng", "Vì chỉ cần một phép so sánh đúng", "Vì `and` tự tính diện tích"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Khi đã biết chắc là tam giác, diện tích theo đáy và chiều cao cũng nhẹ thôi: đáy nhân chiều cao rồi chia 2.",
    },
    {
      code: `from old_computer import say_num

base = 8
height = 3
area = base * height / 2

say_num(area)
`,
      label: "dien_tich_tam_giac.py",
      note: "RUN KIỂM CHỨNG\nTam giác có đáy 8 và chiều cao 3, nên diện tích là `8 * 3 / 2 = 12`. Python có thể in kết quả là `12.0` vì có phép chia.",
      expectOut: /^12(\.0)?$/,
      solution: `from old_computer import say_num

base = 8
height = 3
area = base * height / 2

say_num(area)
`,
    },
    {
      code: `from old_computer import say_num

shape = "tam_giac"
a = 6
b = 4

if shape == "chu_nhat":
    say_num(a * b)
elif shape == "vuong":
    say_num(a * a)
else:
    # Đến lượt của bạn: với temp giác, a là đáy và b là chiều height.
    say_num(a + b)
`,
      label: "chon_cong_thuc_fix.py",
      note: "ĐỀ BÀI\n`shape = \"tam_giac\"`, `a = 6`, `b = 4`. Ở nhánh `else`, sửa công thức thành `a * b / 2` để output đúng là 12.",
      expectOut: /^12(\.0)?$/,
      solution: `from old_computer import say_num

shape = "tam_giac"
a = 6
b = 4

if shape == "chu_nhat":
    say_num(a * b)
elif shape == "vuong":
    say_num(a * a)
else:
    say_num(a * b / 2)
`,
    },
    {
      checkpoint: {
        text: "Khi biến `shape` quyết định công thức, dùng chuỗi `if`/`elif`/`else`: hình chữ nhật dùng `a * b`, hình vuông dùng `a * a`, tam giác dùng `a * b / 2` nếu `a` là đáy và `b` là chiều cao.",
      },
    },
    {
      quiz: {
        title: "Chọn công thức",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\nshape = \"tam_giac\"\na = 10\nb = 2\nif shape == \"chu_nhat\":\n    say_num(a * b)\nelif shape == \"vuong\":\n    say_num(a * a)\nelse:\n    say_num(a * b / 2)\n```",
            a: ["10.0", "20", "100"],
            correct: 0,
          },
          {
            q: "`shape = \"vuong\"` và `a = 5`. Trong chuỗi if/elif/else chọn công thức, nhánh nào nên tính diện tích?",
            a: ["Nhánh `elif shape == \"vuong\"` với `a * a`", "Nhánh `else` với `a * b / 2`", "Nhánh `if shape == \"chu_nhat\"` với `a * b`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Ba nhóm bài hình học nhỏ: tính diện tích bằng phép nhân; kiểm tra tam giác bằng ba điều kiện nối `and`; chọn công thức bằng chuỗi `if`/`elif`/`else` theo biến `shape`.",
    },
  ],
};
