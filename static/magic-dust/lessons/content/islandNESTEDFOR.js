// islandNESTEDFOR.js — ĐẢO VÒNG LỒNG, a bonus side-island (island.js, not
// node.js): after node10's for/range(), this island teaches the composition
// pattern "outer for chooses a row/item, inner for handles each column/detail".
// It uses only previously unlocked syntax: for/range, variables, arithmetic,
// str(), if/else, and and. Gated at unlockAt:11 in saga.js.
export default {
  index: -1,
  sideIslandId: "islandNESTEDFOR",
  title: "ĐẢO VÒNG LỒNG",
  subtitle: "giải bài toán hàng-cột, bảng nhân, bản đồ tọa độ, và mã khóa hai số",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ VÒNG LỒNG" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY GIẢI CÂU ĐỐ LƯỚI",
    blurb: "một cỗ máy phụ để luyện bài toán có nhiều hàng, nhiều cột, nhiều cặp lựa chọn",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO VÒNG LỒNG ✦",
        hook: "Có những bài toán không chỉ lặp một việc đơn. Xếp ghế có nhiều hàng và nhiều ghế; bảng nhân có nhiều số nhân với nhiều số; bản đồ có hàng và cột. Đảo này luyện đúng kiểu bài đó.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Trước khi học vòng lồng nhau, tụi mình nhắc lại `for` một vòng đã. `for turn in range(3):` chạy khối thụt lề đúng ba lần, với `turn` lần lượt là 0, 1, 2.",
    },
    {
      quiz: {
        title: "Ôn một vòng `for`",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nfor turn in range(3):\n    say_num(turn)\n```\nMáy in ra những số nào?",
            a: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "▦",
        name: "KÍNH VÒNG LỒNG",
        blurb: "cách nhìn bài toán hai tầng: vòng ngoài chọn một mục lớn, vòng trong xử lý từng mục nhỏ bên trong",
      },
    },
    {
      npc: "Định nghĩa thẳng nhé: vòng for lồng nhau là đặt một `for` bên trong khối thụt lề của một `for` khác. Vòng ngoài chọn HÀNG. Với mỗi hàng đó, vòng trong chạy hết các CỘT.",
    },
    {
      code: 'from old_computer import say\n\nfor row in range(1, 3):\n    for seat in range(1, 4):\n        say("H" + str(row) + "-G" + str(seat))\n',
      label: "seat_labels_demo.py",
      note: "RUN KIỂM CHỨNG\nRạp nhỏ này có 2 hàng, mỗi hàng 3 ghế. Vòng ngoài chọn hàng; vòng trong gắn nhãn từng ghế trong hàng đó.",
      expectOut: { all: [{ minLines: 6 }, /H1-G1/, /H1-G3/, /H2-G1/, /H2-G3/] },
      solution: 'from old_computer import say\n\nfor row in range(1, 3):\n    for seat in range(1, 4):\n        say("H" + str(row) + "-G" + str(seat))\n',
    },
    {
      checkpoint: {
        text: "Trong vòng lồng nhau, mỗi lần vòng ngoài chọn một hàng thì vòng trong chạy hết các giá trị của nó cho hàng hiện tại. Vì vậy 2 hàng và 3 ghế mỗi hàng tạo ra `2 * 3 = 6` dòng.",
      },
    },
    {
      quiz: {
        title: "Đếm số lượt thật",
        questions: [
          {
            q: "Một đoạn code có `for row in range(1, 4):` ở ngoài và `for seat in range(1, 3):` ở trong. Có 3 hàng, mỗi hàng 2 ghế. Máy in tổng cộng bao nhiêu nhãn ghế?",
            a: ["5 nhãn", "6 nhãn", "9 nhãn"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "Giờ tới bài toán thực tế đầu tiên: in nhãn hộp trong kho. Có 3 kệ, mỗi kệ 2 hộp. Nếu chỉ dùng một vòng, máy chỉ biết kệ; muốn biết từng hộp trong từng kệ, cần vòng thứ hai.",
    },
    {
      code: 'from old_computer import say\n\nfor shelf in range(1, 4):\n    # lượt của bạn: với mỗi kệ, in các hộp trên kệ đó\n    say("KE " + str(shelf))\n',
      label: "shelf_boxes.py",
      note: "ĐỀ BÀI\nSửa đoạn code để in đủ `K1-H1`, `K1-H2`, `K2-H1`, `K2-H2`, `K3-H1`, `K3-H2`. Với mỗi kệ, cần đi qua hai hộp của kệ đó.",
      expectOut: { all: [{ minLines: 6 }, /K1-H1/, /K1-H2/, /K2-H1/, /K2-H2/, /K3-H1/, /K3-H2/] },
      solution: 'from old_computer import say\n\nfor shelf in range(1, 4):\n    for box in range(1, 3):\n        say("K" + str(shelf) + "-H" + str(box))\n',
    },
    {
      npc: "Cách đọc không đổi: vòng ngoài chọn kệ, vòng trong đi qua từng hộp trên kệ đó. Hai vòng ghép lại thành mọi cặp kệ-hộp.",
    },

    {
      npc: "Bài toán thứ hai: làm bảng nhân nhỏ. Vòng ngoài chọn số ở đầu hàng; vòng trong nhân số đó với từng số ở đầu cột.",
    },
    {
      code: 'from old_computer import say\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 4):\n        line = line + str(row * col) + " "\n    say(line)\n',
      label: "multiplication_grid.py",
      note: "RUN KIỂM CHỨNG\nBảng nhân 3x3 này dùng cùng một khung: vòng ngoài chọn `row`, vòng trong chạy `col` qua 1, 2, 3 rồi ghép kết quả vào một dòng.",
      expectOut: { all: [/^1 2 3\s*$/, /^2 4 6\s*$/, /^3 6 9\s*$/] },
      solution: 'from old_computer import say\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 4):\n        line = line + str(row * col) + " "\n    say(line)\n',
    },
    {
      checkpoint: {
        text: "Với bảng hai chiều, vòng ngoài thường chọn giá trị đầu hàng; vòng trong chọn giá trị đầu cột. Mỗi ô là kết quả ghép từ cả hai biến, ví dụ `row * col`.",
      },
    },
    {
      quiz: {
        title: "Đọc một ô trong bảng",
        questions: [
          {
            q: "Trong bảng nhân này:\n```python\nfor row in range(1, 4):\n    for col in range(1, 4):\n        say_num(row * col)\n```\nKhi `row = 2` và `col = 3`, máy in số nào cho ô đó?",
            a: ["5", "6", "23"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "Câu đố thứ ba giống bản đồ kho báu. Bản đồ có hàng và cột. Vòng ngoài đi từng hàng; vòng trong đi từng cột. Khi gặp đúng tọa độ, máy đặt dấu `X`.",
    },
    {
      code: 'from old_computer import say\n\ntreasure_row = 2\ntreasure_col = 4\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 6):\n        # lượt của bạn: ghép X đúng ô kho báu, các ô khác ghép dấu chấm\n        line = line + "."\n    say(line)\n',
      label: "treasure_map.py",
      note: "ĐỀ BÀI\nSửa vòng trong để bản đồ 3x5 có dấu `X` ở hàng 2, cột 4. Mỗi ô cần xét cả hàng và cột hiện tại.",
      expectOut: { all: [/^\.\.\.\.\.$/, /^\.\.\.X\.$/] },
      solution: 'from old_computer import say\n\ntreasure_row = 2\ntreasure_col = 4\n\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 6):\n        if row == treasure_row and col == treasure_col:\n            line = line + "X"\n        else:\n            line = line + "."\n    say(line)\n',
    },
    {
      checkpoint: {
        text: "Khi cần kiểm tra một ô trong lưới, dùng cả hai biến `row` và `col`. Điều kiện kiểu `row == 2 and col == 4` chỉ đúng tại đúng một ô.",
      },
    },
    {
      quiz: {
        title: "Tọa độ trong lưới",
        questions: [
          {
            q: "Bản đồ có 3 hàng và 5 cột. Nếu điều kiện là `row == 3 and col == 1`, dấu `X` nằm ở đâu?",
            a: ["Hàng 1, cột 3", "Hàng 3, cột 1", "Mọi ô trong hàng 3"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "Câu đố cuối không vẽ lưới, nhưng vẫn cần hai vòng. Ổ khóa có hai bánh số: bánh trái và bánh phải. Muốn thử mọi cặp số có thể, vòng ngoài thử bánh trái, vòng trong thử bánh phải.",
    },
    {
      code: 'from old_computer import say\n\nfor left in range(0, 6):\n    for right in range(0, 6):\n        if left + right == 5 and left == right + 1:\n            say("MÃ " + str(left) + str(right))\n',
      label: "two_digit_lock.py",
      note: "RUN GIẢI CÂU ĐỐ\nỔ khóa chỉ mở khi hai số cộng lại bằng 5, và số bên trái lớn hơn số bên phải đúng 1. Vòng lồng nhau thử mọi cặp từ 00 đến 55 rồi in mã đúng.",
      expectOut: /MÃ 32/i,
      solution: 'from old_computer import say\n\nfor left in range(0, 6):\n    for right in range(0, 6):\n        if left + right == 5 and left == right + 1:\n            say("MÃ " + str(left) + str(right))\n',
    },
    {
      quiz: {
        title: "Vì sao cần hai vòng?",
        questions: [
          {
            q: "Ổ khóa có hai bánh số: `left` và `right`. Muốn thử mọi cặp từ 00 đến 55, vì sao cần vòng for lồng nhau?",
            a: [
              "Vì một vòng chọn số bên trái, vòng còn lại thử từng số bên phải cho số bên trái đó",
              "Vì `if` tự tạo ra mọi cặp số",
              "Vì `range(6)` tự có hai số trong một lượt",
            ],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Xưởng cuối cùng để bạn tự mở rộng. Bạn có thể đổi kích thước rạp ghế, đổi bảng nhân thành 4x4, đổi tọa độ kho báu, hoặc tự đặt luật mới cho ổ khóa hai số.",
    },
    {
      code: 'from old_computer import say\n\n# xưởng của bạn — chọn một bài toán hai tầng rồi sửa bên dưới\nfor row in range(1, 4):\n    line = ""\n    for col in range(1, 4):\n        line = line + "*"\n    say(line)\n',
      label: "nested_for_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài hướng dễ bắt đầu:\n" +
        "• LỊCH TRỰC — vòng ngoài là ngày, vòng trong là ca sáng/chiều.\n" +
        "• RẠP GHẾ — vòng ngoài là hàng, vòng trong là ghế.\n" +
        "• BẢN ĐỒ — vòng ngoài là hàng, vòng trong là cột, dùng `if` để đặt dấu `X`.\n" +
        "• Ổ KHÓA — vòng ngoài thử số trái, vòng trong thử số phải, dùng `if` để tìm cặp đúng.",
    },
    {
      gift: {
        glyph: "▦",
        name: "HUY HIỆU VÒNG LỒNG",
        blurb: "vòng ngoài chọn nhóm lớn, vòng trong xử lý từng phần bên trong — dùng được cho ghế, lịch, bảng, bản đồ, và mã khóa",
        badge: true,
        badgeId: "huy_hieu_vong_long",
      },
    },
    {
      remember:
        "Vòng for lồng nhau dùng khi mỗi lựa chọn lớn còn chứa nhiều lựa chọn nhỏ: hàng có cột, kệ có hộp, ngày có ca, bánh số trái có nhiều bánh số phải. Hỏi hai câu trước khi viết: vòng ngoài chọn gì, vòng trong chạy qua gì?",
    },
  ],
};
