// island02.js — ĐẢO LUYỆN SỐ, a bonus side-island (island.js, not node.js):
// extra reps for node02/node02v2's vocabulary (read_num/say_num/+ - * /).
// Exercise IDEAS adapted from classic beginner-programming practice sets
// (area/total-cost/average calculators — the same exercise shapes as
// w3resource's "Python Math" set and PYnative's "Python Basic Exercise for
// Beginners", reworded into Kotopia's read_num()/say_num() vocabulary, no
// modulus/exponent/operator-precedence puzzles since those aren't taught).
// NOT part of the main saga trail — see island01.js's header for why.
export default {
  index: -1,
  sideIslandId: "island02",
  title: "ĐẢO LUYỆN SỐ",
  subtitle: "luyện thêm read_num(), say_num(), và bốn phép tính + - * /",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ TÍNH TOÁN" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY LUYỆN SỐ",
    blurb: "một cỗ máy phụ để luyện tính toán — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO LUYỆN SỐ ✦",
        hook: "Một hòn đảo nhỏ khác, dành riêng cho việc luyện read_num()/say_num() và bốn phép tính. Không quái lỗi, không bắt buộc — càng luyện tay càng quen, mấy đảo sau sẽ dễ thở hơn nhiều!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn quay lại luyện số! Lần này mình sẽ tính diện tích, tổng tiền, điểm trung bình... — toàn là kiểu bài thật hay gặp, dùng đúng read_num()/say_num() và + - * / bạn đã học.",
    },

    // ── bài 1: đoán-output — tính diện tích (w*h), bài kinh điển ──
    {
      code: 'from old_computer import say_num\n\nwidth = 6\nheight = 3\nsay_num(width * height)\n',
      label: "island_predict2.py",
      note: "ĐỀ BÀI (đoán trước khi RUN)\nĐây là công thức tính DIỆN TÍCH (rộng × dài). Đoán xem máy in ra SỐ nào trước, rồi bấm ▶ RUN kiểm tra lại.",
      expectOut: /^\s*18\s*$/m,
      solution: 'from old_computer import say_num\n\nwidth = 6\nheight = 3\nsay_num(width * height)\n',
    },
    {
      quiz: {
        title: "Đoán kết quả",
        questions: [
          {
            q: "Nếu đổi `width = 6` thành `width = 10` (giữ `height = 3`), `say_num(width * height)` in ra số nào?",
            a: ["30", "18", "13"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: sửa lỗi — dùng sai phép tính (bài "tổng tiền" kinh điển) ──
    {
      code: 'from old_computer import say_num\n\nprice = 15000\nqty = 4\nsay_num(price + qty)   # SAI phép tính — tổng tiền phải là GIÁ NHÂN SỐ LƯỢNG, không phải cộng\n',
      label: "island_fix2.py",
      note: 'ĐỀ BÀI (sửa lỗi)\nTính TỔNG TIỀN khi mua `qty` món giá `price` mỗi món phải NHÂN, không phải cộng — đoạn này đang gõ sai phép tính, sửa `+` thành đúng dấu rồi RUN lại.',
      expectOut: /^\s*60000\s*$/m,
      solution: 'from old_computer import say_num\n\nprice = 15000\nqty = 4\nsay_num(price * qty)\n',
    },

    // ── bài 3: tự viết — tổng hai số (bài đầu tiên ai học lập trình cũng gặp) ──
    {
      code: 'from old_computer import read_num, say_num\n\na = read_num("Số thứ nhất: ")   # input\nb = read_num("Số thứ hai: ")    # input\n# lượt của bạn: say_num tổng của a và b\n',
      label: "island_write3.py",
      note: "ĐỀ BÀI (tự làm)\nINPUT thật: hai dòng `read_num(...)` đọc hai số bạn nhập và gán vào `a`, `b`.\nViệc cần làm: tính `a + b`.\nOUTPUT: dùng `say_num(a + b)` để in tổng hai số vừa nhập.",
      expectOut: { minLines: 1 },
      solution: 'from old_computer import read_num, say_num\n\na = read_num("Số thứ nhất: ")\nb = read_num("Số thứ hai: ")\nsay_num(a + b)\n',
    },

    // ── bài 4: điểm trung bình (average calculator — bài kinh điển khác) ──
    {
      code: 'from old_computer import read_num, say_num\n\nscore1 = read_num("Điểm bài 1: ")   # input\nscore2 = read_num("Điểm bài 2: ")   # input\n# lượt của bạn: say_num điểm TRUNG BÌNH của hai bài — (score1 + score2) / 2\n',
      label: "island_write4.py",
      note: "ĐỀ BÀI\nINPUT thật: hai dòng `read_num(...)` đọc hai điểm số bạn nhập và gán vào `score1`, `score2`.\nViệc cần làm: tính trung bình `(score1 + score2) / 2`.\nOUTPUT: dùng `say_num(...)` để in điểm trung bình.",
      expectOut: { minLines: 1 },
      solution: 'from old_computer import read_num, say_num\n\nscore1 = read_num("Điểm bài 1: ")\nscore2 = read_num("Điểm bài 2: ")\nsay_num((score1 + score2) / 2)\n',
    },
    {
      quiz: {
        title: "Chọn đúng phép tính",
        questions: [
          {
            q: "Muốn tính GIÁ TRỊ TRUNG BÌNH của hai số `a` và `b`, biểu thức nào đúng?",
            a: ["`(a + b) / 2`", "`a + b * 2`", "`(a - b) / 2`"],
            correct: 0,
          },
          {
            q: "Muốn tính TỔNG TIỀN khi mua `qty` món giá `price`, phép tính nào đúng?",
            a: ["`price * qty`", "`price + qty`", "`price / qty`"],
            correct: 0,
          },
        ],
      },
    },

    {
      checkpoint: {
        text: "Bốn phép tính `+ - * /` áp dụng được vào nhiều bài toán thật — diện tích dùng `*`, trung bình dùng `+` rồi `/`, tổng tiền dùng `*` — chọn đúng phép tính theo ý nghĩa của bài toán, không phải theo thói quen.",
      },
    },
    {
      quiz: {
        title: "Tổng hợp",
        questions: [
          {
            q: 'Cho `a = 20`, `b = 8`. `say_num(a - b)` in ra số nào?',
            a: ["12", "28", "160"],
            correct: 0,
          },
        ],
      },
    },

    {
      remember:
        "Luyện thêm không bắt buộc — nhưng càng quen tay chọn đúng phép tính (`+ - * /`) theo bài toán thật, những đảo nhánh rẽ sau sẽ càng dễ vì phần tính toán đã vững.",
    },
  ],
};
