// islandPATTERN.js — ĐẢO HỌA TIẾT VÒNG LẶP, a bonus side-island
// (island.js, not node.js): after node10's for/range(), this island turns
// counted loops into visible patterns, reversed patterns, number rules, small
// accumulator math, and a watch()-driven camera pattern using already-taught
// `watch()`. Gated unlockAt:11 (after node10 — for/range — is done), number it
// can reuse `for`, `range(a, b)`, `str()`, string concatenation, if/else,
// and arithmetic already taught earlier.
export default {
  index: -1,
  sideIslandId: "islandPATTERN",
  title: "ĐẢO HỌA TIẾT VÒNG LẶP",
  subtitle: "vẽ hình bằng hàng/cột, đảo chiều, in số theo quy luật, cộng dồn",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ HÀNG/CỘT" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY DỆT HỌA TIẾT",
    blurb: "một cỗ máy phụ để luyện vòng lặp bằng hình vẽ, quy luật số, và bài toán cộng dồn",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO HỌA TIẾT VÒNG LẶP ✦",
        hook: "Một hòn đảo luyện tay sau Cổng Nhịp Đếm: dùng vòng lặp để vẽ hình, đảo hình, in số theo quy luật, rồi giải vài bài toán nhỏ. Không bắt buộc, nhưng ai qua đảo này sẽ nhìn vòng lặp ra hình ngay.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Luật của đảo này rất rõ: vòng ngoài chọn HÀNG, vòng trong ghép từng ký tự vào `line` cho hàng đó. Mỗi hàng bắt đầu bằng `line = \"\"`, ghép đủ ký tự xong mới `say(line)`.",
    },
    {
      gift: {
        art: "assets/pattern-grid-lens.webp",
        glyph: "▦",
        name: "KÍNH HÀNG/CỘT",
        blurb: "cách nhìn mới cho vòng lặp: hàng là vòng ngoài, cột là vòng trong",
      },
    },

    // ── bài 1: nested counted loops build a triangle ──
    {
      quiz: {
        title: "Soi hàng trước khi RUN",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nfor row in range(1, 4):\n    line = ""\n    for col in range(row):\n        line = line + "*"\n    say(line)\n```\nKhi `row` bằng 2, dòng được in ra là gì?',
            a: ["*", "**", "***"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(row):\n        line = line + "*"\n    say(line)\n',
      label: "draw_triangle.py",
      note: "RUN KIỂM CHỨNG\nVòng ngoài đi qua các hàng 1, 2, 3. Vòng trong thêm đúng số dấu `*` bằng số hàng, rồi máy in cả dòng.",
      expectOut: { all: [/^\*$/, /^\*\*$/, /^\*\*\*$/] },
      solution: 'from old_computer import say\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(row):\n        line = line + "*"\n    say(line)\n',
    },
    {
      checkpoint: {
        text: "Vòng ngoài như `for row in range(...)` chọn từng hàng; vòng trong như `for col in range(row)` xây nội dung của hàng hiện tại trước khi `say(line)`.",
      },
    },
    {
      quiz: {
        title: "Vòng trong chạy mấy lần",
        questions: [
          {
            q: "Trong `draw_triangle.py`, khi `row = 3`, vòng `for col in range(row):` thêm bao nhiêu dấu `*` vào `line`?",
            a: ["2 dấu", "3 dấu", "4 dấu"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 2: reverse the loop shape without range-step syntax ──
    {
      npc: "Giờ đảo hình. Mình chưa cần cú pháp mới nào cả: giữ một biến `star_count`, mỗi hàng vẽ xong thì giảm nó đi 1. Số ký tự trên hàng sẽ đi từ nhiều xuống ít.",
    },
    {
      code: 'from old_computer import say\n\nstar_count = 4\nfor row in range(4):\n    line = ""\n    # lượt của bạn: xây dòng hiện tại bằng đúng số star đang có\n    say(line)\n    star_count = star_count - 1\n',
      label: "reverse_triangle.py",
      note: "ĐỀ BÀI (tự viết)\nCho sẵn `star_count = 4`. Mỗi hàng cần ghép đúng số dấu `*` đang nằm trong `star_count`, rồi sau đó số sao giảm đi 1. Output cần là 4 sao, 3 sao, 2 sao, 1 sao.",
      expectOut: { all: [/^\*\*\*\*$/, /^\*\*\*$/, /^\*\*$/, /^\*$/] },
      solution: 'from old_computer import say\n\nstar_count = 4\nfor row in range(4):\n    line = ""\n    for col in range(star_count):\n        line = line + "*"\n    say(line)\n    star_count = star_count - 1\n',
    },
    {
      checkpoint: {
        text: "Muốn đảo hình, cho một biến điều khiển số ký tự mỗi hàng, ví dụ `star_count`; sau mỗi hàng, cập nhật `star_count = star_count - 1` để hàng sau ngắn hơn.",
      },
    },
    {
      quiz: {
        title: "Đảo số ký tự mỗi hàng",
        questions: [
          {
            q: "`star_count = 3`. Mỗi hàng vẽ xong chạy `star_count = star_count - 1`. Hàng thứ hai sẽ có mấy dấu `*`?",
            a: ["3", "2", "1"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 3: number-pattern rows ──
    {
      npc: "Hình không chỉ có dấu sao. Nếu vòng trong ghép `str(col)`, mỗi hàng có thể trở thành một dòng số theo quy luật: 1, rồi 12, rồi 123.",
    },
    {
      code: 'from old_computer import say\n\nfor row in range(1, 5):\n    line = ""\n    for col in range(1, row + 1):\n        line = line + "*"\n    say(line)\n',
      label: "number_stairs.py",
      note: "ĐỀ BÀI (sửa quy luật)\nHiện máy đang vẽ sao. Hãy đổi phần ghép trong vòng trong để mỗi hàng in dãy số theo cột: 1, 12, 123, 1234.",
      expectOut: { all: [/^1$/, /^12$/, /^123$/, /^1234$/] },
      solution: 'from old_computer import say\n\nfor row in range(1, 5):\n    line = ""\n    for col in range(1, row + 1):\n        line = line + str(col)\n    say(line)\n',
    },
    {
      remember:
        "`str(col)` đổi số thành chữ để ghép vào chuỗi `line`; nhờ vậy vòng trong có thể xây các dòng số như `1`, `12`, `123`.",
    },
    {
      quiz: {
        title: "Quy luật số trong hàng",
        questions: [
          {
            q: "`row = 4`, vòng trong là `for col in range(1, row + 1):`. Các giá trị của `col` trong hàng đó là gì?",
            a: ["0, 1, 2, 3", "1, 2, 3", "1, 2, 3, 4"],
            correct: 2,
          },
        ],
      },
    },

    // ── bài 4: accumulator math with the same loop mental model ──
    {
      npc: "Giải toán bằng vòng lặp cũng dùng cùng một khung: có một biến gom kết quả, mỗi vòng thêm một mảnh mới. Vẽ hình thì gom ký tự vào `line`; tính tổng thì gom số vào `total`.",
    },
    {
      code: 'from old_computer import say_num\n\nn = 5\ntotal = 0\nfor number in range(1, n + 1):\n    total = total\n\nsay_num(total)\n',
      label: "sum_one_to_n.py",
      note: "ĐỀ BÀI (tự viết)\nCho sẵn `n = 5`. Hãy cập nhật biến tổng trong mỗi vòng để tính tổng 1 + 2 + 3 + 4 + 5. Máy cần in ra 15.",
      expectOut: /^\s*15\s*$/,
      solution: 'from old_computer import say_num\n\nn = 5\ntotal = 0\nfor number in range(1, n + 1):\n    total = total + number\n\nsay_num(total)\n',
    },
    {
      checkpoint: {
        text: "Cộng dồn dùng biến tổng bắt đầu từ `0`; mỗi vòng chạy `total = total + number` để giữ tổng cũ rồi cộng thêm giá trị `number` của vòng hiện tại.",
      },
    },
    {
      quiz: {
        title: "Cộng dồn từng vòng",
        questions: [
          {
            q: "`total = 0`, rồi lặp `number` qua 1, 2, 3, 4 và mỗi vòng làm `total = total + number`. Cuối cùng `total` bằng bao nhiêu?",
            a: ["4", "10", "24"],
            correct: 1,
          },
        ],
      },
    },

    // ── final mini-project: a real pattern with spaces + stars ──
    {
      npc: "Bài cuối vẽ một hình đầy đủ hơn: tháp sao có khoảng trắng bên trái, thân sao ở giữa, và chân tháp ở dưới. Đây là cùng một ý tưởng hàng/cột, chỉ thêm một vòng xây khoảng trắng trước vòng xây sao.",
    },
    {
      code: 'from old_computer import say\n\nheight = 4\nfor row in range(1, height + 1):\n    line = ""\n    for space in range(height - row):\n        line = line + " "\n    for star in range(row):\n        line = line + "*"\n    say(line)\n\nsay("  | |")\nsay("  |_|")\n',
      label: "star_lighthouse.py",
      note: "ĐỀ BÀI (sửa hình)\nPhần khoảng trắng đã đúng. Phần sao đang tăng 1, 2, 3, 4 nên tháp bị mảnh. Hãy sửa số sao mỗi hàng để thân tháp lần lượt có 1, 3, 5, 7 dấu sao.",
      expectOut: { all: [/^\s*\*$/, /^\s*\*\*\*\s*$/, /^\s*\*\*\*\*\*\s*$/, /^\*\*\*\*\*\*\*$/, /\| \|/, /\|_\|/] },
      solution: 'from old_computer import say\n\nheight = 4\nfor row in range(1, height + 1):\n    line = ""\n    for space in range(height - row):\n        line = line + " "\n    for star in range(row * 2 - 1):\n        line = line + "*"\n    say(line)\n\nsay("  | |")\nsay("  |_|")\n',
    },

    // ── camera column pattern: turn a finger count into row/column data ──
    {
      npc: "Giờ áp KÍNH HÀNG/CỘT lên camera thật. Không dùng lệnh camera mới nào cả: `watch()` chỉ đưa số ngón tay, rồi vòng lặp biến số đó thành cột sáng trong một lá cờ 3 hàng.",
    },
    {
      npc: "Quy ước lá cờ 3x5: mỗi hàng có 5 cột. Nếu `lit_col = 4`, cột thứ 4 của mọi hàng là `X`, các cột còn lại là `.`.",
    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say\n\nlit_col = watch()\ndisplay("C" + str(lit_col))\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 6):\n        # lượt của bạn: ghép X ở cột được chọn, các cột khác ghép dấu chấm\n        line = line + "."\n    say(line)\n',
      label: "camera_column_pattern.py",
      note: "ĐỀ BÀI (camera thật)\nGiơ 1 đến 5 ngón để chọn cột sáng. Sửa phần trong vòng lặp trong để mỗi hàng in `X` đúng ở cột đó, các cột khác là `.`.",
      expectOut: { all: [{ minLines: 4 }, /X/] },
      solution: 'from camera_charm import watch, display\nfrom old_computer import say\n\nlit_col = watch()\ndisplay("C" + str(lit_col))\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 6):\n        if col == lit_col:\n            line = line + "X"\n        else:\n            line = line + "."\n    say(line)\n',
    },
    {
      checkpoint: {
        text: "Camera chỉ đưa input qua `watch()`. Phần lập trình nằm ở đoạn sau: đổi số ngón thành cột, rồi dùng `if` bên trong vòng lặp để quyết định ký tự nào được ghép vào từng hàng.",
      },
    },
    {
      quiz: {
        title: "Dữ liệu từ số ngón tay",
        questions: [
          {
            q: "`lit_col = 4`; vòng trong chạy `col` qua 1, 2, 3, 4, 5. Với luật `if col == lit_col`, ký tự `X` nằm ở đâu?",
            a: ["Cột 4 của mỗi hàng", "Hàng 4 của lá cờ", "Mọi cột trừ cột 4"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "▦",
        name: "HUY HIỆU HÀNG/CỘT",
        blurb: "vòng ngoài chọn hàng, vòng trong xây dòng — dùng được cho hình vẽ, quy luật số, bài toán cộng dồn, và lưới camera",
        badge: true,
        badgeId: "huy_hieu_hang_cot",
      },
    },
    {
      remember:
        "Với lưới camera, ta không cần mô tả cả bức hình một lần. Mình đặt quy ước lưới, đổi vị trí thành số ô/hàng/cột, rồi dùng dữ liệu đó trong `if` và vòng lặp như mọi bài Python khác.",
    },
  ],
};
