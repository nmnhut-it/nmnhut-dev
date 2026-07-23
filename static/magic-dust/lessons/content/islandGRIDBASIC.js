// islandGRIDBASIC.js — ĐẢO BẢNG SỐ, a bonus side-island (island.js, not
// node.js): after node15 ("Grid Memory: Hàng và Cột") it drills the
// whole-grid scan patterns — build from a formula, tổng, đếm, trung bình,
// lớn nhất, tổng một hàng / một cột, lớn nhất mỗi hàng. It reuses only
// previously unlocked syntax: grid[hang][cot] read/write, row = grid[i],
// len(), range(), for/while, if/elif/else, and/or/not, comparisons,
// arithmetic, str(), string concat, nested for. No boss — skill-drill
// island like islandNESTEDFOR. Gated at unlockAt:16 in saga.js.
export default {
  index: -1,
  sideIslandId: "islandGRIDBASIC",
  title: "ĐẢO BẢNG SỐ",
  subtitle: "luyện quét cả bảng: dựng bảng từ công thức, tính tổng, đếm, trung bình, lớn nhất, tổng một hàng và một cột",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ BẢNG SỐ" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY QUÉT BẢNG SỐ",
    blurb: "một cỗ máy phụ để luyện những bài toán đi qua từng ô của một bảng nhiều hàng nhiều cột",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO BẢNG SỐ ✦",
        hook: "Ở đảo trước bạn đã học đọc một ô bằng `grid[row][col]`. Đảo này đi xa hơn một bước: làm sao đi qua HẾT mọi ô của bảng để tính tổng, đếm, tìm số lớn nhất, hay dựng cả một bảng mới từ công thức.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Pip nhắc lại nhé: một bảng là một list gồm nhiều hàng, và mỗi hàng lại là một list. `grid[row][col]` đọc đúng một ô — số đầu chọn hàng, số sau chọn cột, cả hai đếm từ 0.",
    },
    {
      quiz: {
        title: "Ôn đọc một ô",
        questions: [
          {
            q: "Đọc bảng này:\n```python\ngrid = [\n  [4, 5, 6],\n  [7, 8, 9]\n]\n```\n`grid[1][2]` cho ra số nào?",
            a: ["9", "6", "8"],
            correct: 0,
          },
          {
            q: "Trong `grid[row][col]`, muốn đọc số ở hàng 0 cột 1 của `[[4,5,6],[7,8,9]]` thì viết gì?",
            a: ["`grid[0][1]`", "`grid[1][0]`", "`grid[1][1]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "▦",
        name: "KÍNH QUÉT BẢNG",
        blurb: "cách nhìn một bài toán trên bảng: vòng ngoài đi qua từng hàng, vòng trong đi qua từng cột, cộng lại là đã ghé mọi ô",
      },
    },

    {
      npc: "Khởi động bằng bài đọc ô cho quen tay. Bảng dưới đây có 2 hàng, 3 cột. Bấm RUN để xem máy đọc ba ô ở ba vị trí khác nhau.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [5, 8, 2],\n    [7, 1, 9]\n]\n\nsay_num(grid[0][0])\nsay_num(grid[1][2])\nsay_num(grid[0][1])\n',
      label: "grid_warmup_demo.py",
      note: "RUN KIỂM CHỨNG\n`grid[0][0]` là hàng 0 cột 0; `grid[1][2]` là hàng 1 cột 2; `grid[0][1]` là hàng 0 cột 1.",
      expectOut: { all: [/^5$/, /^9$/, /^8$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [5, 8, 2],\n    [7, 1, 9]\n]\n\nsay_num(grid[0][0])\nsay_num(grid[1][2])\nsay_num(grid[0][1])\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [5, 8, 2],\n    [7, 1, 9]\n]\n\n# lượt của bạn — đề cần đọc ô ở hàng 1 cột 0, output đúng là 7\nsay_num(grid[0][1])\n',
      label: "grid_warmup_fix.py",
      note: "ĐỀ BÀI\nBài cần đọc hàng 1 cột 0. Sửa lại hai chỉ số cho đúng để output là `7`.",
      expectOut: /^7$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [5, 8, 2],\n    [7, 1, 9]\n]\n\nsay_num(grid[1][0])\n',
    },

    {
      npc: "Giờ tới việc mới: DỰNG một bảng từ công thức. Mẹo là chuẩn bị sẵn một bảng toàn số 0 đúng kích thước, rồi dùng vòng lặp lồng nhau ghi giá trị vào từng ô.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(3):\n    line = ""\n    for col in range(3):\n        grid[row][col] = row * col\n        line = line + str(grid[row][col]) + " "\n    say(line)\n',
      label: "grid_build_demo.py",
      note: "RUN KIỂM CHỨNG\nMỗi ô nhận giá trị `row * col`. Bảng toàn 0 có sẵn được ghi đè từng ô, rồi in ra theo từng hàng.",
      expectOut: { all: [/^0 0 0\s*$/, /^0 1 2\s*$/, /^0 2 4\s*$/] },
      solution: 'from old_computer import say\n\ngrid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(3):\n    line = ""\n    for col in range(3):\n        grid[row][col] = row * col\n        line = line + str(grid[row][col]) + " "\n    say(line)\n',
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(3):\n    line = ""\n    for col in range(3):\n        grid[row][col] = row + col   # đề cần TÍCH row * col, không phải tổng\n        line = line + str(grid[row][col]) + " "\n    say(line)\n',
      label: "grid_build_fix.py",
      note: "ĐỀ BÀI\nĐề muốn mỗi ô bằng `row * col`. Ba hàng đúng phải là `0 0 0`, `0 1 2`, `0 2 4`. Sửa đúng một chỗ trong công thức.",
      expectOut: { all: [/^0 0 0\s*$/, /^0 1 2\s*$/, /^0 2 4\s*$/] },
      solution: 'from old_computer import say\n\ngrid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(3):\n    line = ""\n    for col in range(3):\n        grid[row][col] = row * col\n        line = line + str(grid[row][col]) + " "\n    say(line)\n',
    },
    {
      remember:
        "Muốn dựng một bảng mới, chuẩn bị sẵn bảng đúng kích thước toàn `0`, rồi ghi từng ô bằng `grid[row][col] = <công thức>` trong vòng lặp lồng nhau. Không thể thêm ô mới, chỉ ghi đè ô đã có.",
    },
    {
      quiz: {
        title: "Dựng bảng từ công thức",
        questions: [
          {
            q: "Dựng bảng bằng đoạn này:\n```python\ngrid = [[0,0,0],[0,0,0]]\nfor row in range(2):\n    for col in range(3):\n        grid[row][col] = row * col\n```\nSau khi chạy, `grid[1][2]` là bao nhiêu?",
            a: ["2", "3", "0"],
            correct: 0,
          },
          {
            q: "Vì sao cần khai báo sẵn `grid = [[0,0,0],[0,0,0],[0,0,0]]` trước khi ghi giá trị bằng vòng lặp?",
            a: [
              "Vì phải có sẵn ô ở mỗi hàng, mỗi cột thì mới ghi đè `grid[row][col]` vào được",
              "Vì số `0` là giá trị bắt buộc của mọi bảng",
              "Vì vòng lặp không chạy được nếu bảng chưa in ra",
            ],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bài quét đầu tiên: tính TỔNG mọi ô trong bảng. Bí quyết cũ vẫn đúng — một biến `total` bắt đầu bằng 0, rồi cộng dồn từng ô khi đi qua.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
      label: "grid_sum_demo.py",
      note: "RUN KIỂM CHỨNG\n`len(grid)` là số hàng, `len(grid[0])` là số cột. Hai vòng đi qua mọi ô và cộng dồn vào `total`, ra 21.",
      expectOut: /^21$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [2, 4],\n    [6, 8]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[0][col]   # đề cần cộng ô đang xét, không phải luôn hàng 0\n\nsay_num(total)\n',
      label: "grid_sum_fix.py",
      note: "ĐỀ BÀI\nTổng đúng của cả bảng là `2 + 4 + 6 + 8 = 20`. Dòng cộng đang kẹt ở hàng 0. Sửa để nó cộng đúng ô `grid[row][col]`.",
      expectOut: /^20$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [2, 4],\n    [6, 8]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
    },
    {
      checkpoint: {
        text: "Để tính tổng cả bảng: đặt `total = 0` trước vòng lặp, dùng `for row in range(len(grid))` và `for col in range(len(grid[0]))` để ghé mọi ô, rồi `total = total + grid[row][col]`.",
      },
    },
    {
      quiz: {
        title: "Tổng cả bảng",
        questions: [
          {
            q: "Với `grid = [[1,2],[3,4]]`, quét mọi ô và cộng dồn vào `total` (bắt đầu từ 0) thì kết quả cuối là gì?",
            a: ["10", "7", "4"],
            correct: 0,
          },
          {
            q: "Trong `for col in range(len(grid[0])):`, `len(grid[0])` cho biết điều gì của bảng?",
            a: ["Số cột trong một hàng", "Số hàng của bảng", "Giá trị ô đầu tiên"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bài kế: ĐẾM. Cùng khung quét, nhưng thay vì cộng giá trị, mình cộng thêm 1 mỗi khi gặp ô thỏa một điều kiện.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [0, 3, 0],\n    [5, 0, 2]\n]\n\ncount = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > 0:\n            count = count + 1\n\nsay_num(count)\n',
      label: "grid_count_demo.py",
      note: "RUN KIỂM CHỨNG\nBảng có ba ô lớn hơn 0 (là 3, 5, 2). Điều kiện `> 0` đúng ở ba ô đó nên `count` lên 3.",
      expectOut: /^3$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [0, 3, 0],\n    [5, 0, 2]\n]\n\ncount = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > 0:\n            count = count + 1\n\nsay_num(count)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 1],\n    [2, 1, 2]\n]\ntarget = 2\n\ncount = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > target:   # đề cần đếm ô BẰNG target\n            count = count + 1\n\nsay_num(count)\n',
      label: "grid_count_fix.py",
      note: "ĐỀ BÀI\nĐề cần đếm số ô có giá trị đúng bằng `target` (là 2). Bảng có ba ô bằng 2, nên output đúng là 3. Sửa phép so sánh.",
      expectOut: /^3$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 1],\n    [2, 1, 2]\n]\ntarget = 2\n\ncount = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] == target:\n            count = count + 1\n\nsay_num(count)\n',
    },
    {
      checkpoint: {
        text: "Để đếm số ô thỏa một điều kiện: đặt `count = 0`, quét mọi ô, và mỗi lần điều kiện `if` đúng thì `count = count + 1`. Đổi điều kiện (`> 0`, `== target`, `!= 0`...) là đổi được thứ mình muốn đếm.",
      },
    },
    {
      quiz: {
        title: "Đếm ô theo điều kiện",
        questions: [
          {
            q: "Với `grid = [[1,0,1],[1,1,0]]`, đoạn đếm ô bằng 1 dưới đây in ra số nào?\n```python\ncount = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] == 1:\n            count = count + 1\n```",
            a: ["4", "2", "6"],
            correct: 0,
          },
          {
            q: "Muốn ĐẾM ô mà không muốn cộng giá trị của ô, thân vòng lặp nên làm gì khi điều kiện đúng?",
            a: ["`count = count + 1`", "`count = count + grid[row][col]`", "`count = grid[row][col]`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Có tổng rồi thì tính TRUNG BÌNH cũng dễ: lấy tổng chia cho số ô. Số ô bằng số hàng nhân số cột, mà mình đã có `len(grid)` và `len(grid[0])`.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [2, 4],\n    [6, 8]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nso_o = len(grid) * len(grid[0])\nsay_num(total / so_o)\n',
      label: "grid_average_demo.py",
      note: "RUN KIỂM CHỨNG\nTổng là 20, bảng có `2 * 2 = 4` ô, nên trung bình là `20 / 4 = 5.0`. Phép chia `/` luôn cho ra số thập phân.",
      expectOut: /^5\.0$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [2, 4],\n    [6, 8]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nso_o = len(grid) * len(grid[0])\nsay_num(total / so_o)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 3, 5],\n    [7, 9, 11]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nso_o = len(grid)   # đề cần SỐ Ô = số hàng nhân số cột\nsay_num(total / so_o)\n',
      label: "grid_average_fix.py",
      note: "ĐỀ BÀI\nBảng có 6 ô, tổng là 36, nên trung bình đúng là `36 / 6 = 6.0`. Dòng tính `so_o` mới chỉ đếm số hàng. Sửa để nhân với số cột.",
      expectOut: /^6\.0$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 3, 5],\n    [7, 9, 11]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nso_o = len(grid) * len(grid[0])\nsay_num(total / so_o)\n',
    },
    {
      remember:
        "Trung bình cả bảng = tổng chia cho số ô. Số ô bằng `len(grid) * len(grid[0])` (số hàng nhân số cột). Phép `/` cho ra số thập phân, ví dụ `20 / 4` là `5.0`.",
    },
    {
      quiz: {
        title: "Trung bình cả bảng",
        questions: [
          {
            q: "Bảng `[[2,4],[6,8]]` có tổng là 20. Trung bình các ô bằng bao nhiêu?",
            a: ["5.0", "20", "4"],
            correct: 0,
          },
          {
            q: "Bảng có 3 hàng và 4 cột. `len(grid) * len(grid[0])` cho biết gì?",
            a: ["Tổng số ô của bảng (12)", "Số hàng (3)", "Giá trị ô lớn nhất"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bài tìm số LỚN NHẤT của cả bảng. Cách nghĩ giống lúc tìm số lớn nhất trong một list: giữ ô đầu tiên trong `max_value`; gặp ô nào lớn hơn thì gán lại `max_value`.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [3, 7, 2],\n    [9, 1, 4]\n]\n\nmax_value = grid[0][0]\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > max_value:\n            max_value = grid[row][col]\n\nsay_num(max_value)\n',
      label: "grid_max_demo.py",
      note: "RUN KIỂM CHỨNG\n`max_value` khởi đầu bằng ô đầu tiên (3). Đi qua mọi ô, gặp ô lớn hơn thì cập nhật; ô lớn nhất là 9.",
      expectOut: /^9$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [3, 7, 2],\n    [9, 1, 4]\n]\n\nmax_value = grid[0][0]\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > max_value:\n            max_value = grid[row][col]\n\nsay_num(max_value)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [8, 2, 6],\n    [1, 5, 3]\n]\n\nmax_value = grid[0][0]\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] < max_value:   # đề cần TÌM lớn nhất\n            max_value = grid[row][col]\n\nsay_num(max_value)\n',
      label: "grid_max_fix.py",
      note: "ĐỀ BÀI\nĐề cần số lớn nhất của bảng, đúng ra là 8. Phép so sánh đang tìm số nhỏ nhất. Sửa dấu so sánh cho đúng.",
      expectOut: /^8$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [8, 2, 6],\n    [1, 5, 3]\n]\n\nmax_value = grid[0][0]\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        if grid[row][col] > max_value:\n            max_value = grid[row][col]\n\nsay_num(max_value)\n',
    },
    {
      checkpoint: {
        text: "Tìm ô lớn nhất cả bảng: đặt `max_value = grid[0][0]` làm mốc, quét mọi ô, và `if grid[row][col] > max_value` thì gán mốc mới. Đổi dấu thành `<` là thành bài tìm ô nhỏ nhất.",
      },
    },
    {
      quiz: {
        title: "Lớn nhất cả bảng",
        questions: [
          {
            q: "Với `grid = [[3,7,2],[9,1,4]]`, ô lớn nhất của cả bảng là số nào?",
            a: ["9", "7", "4"],
            correct: 0,
          },
          {
            q: "Vì sao nên đặt `max_value = grid[0][0]` làm mốc ban đầu thay vì `max_value = 0`?",
            a: [
              "Vì nếu mọi ô đều nhỏ hơn 0 thì mốc 0 sẽ cho kết quả sai; lấy một ô thật của bảng thì luôn đúng",
              "Vì `grid[0][0]` luôn là ô lớn nhất",
              "Vì `0` không phải là số dùng được trong bảng",
            ],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Hai bài tổng đặc biệt: tổng MỘT hàng và tổng MỘT cột. Tổng một hàng thì dễ, vì một hàng chính là một list. Tổng một cột mới lạ: cột cố định, còn hàng thay đổi.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\nrow = grid[1]\nrow_total = 0\nfor x in row:\n    row_total = row_total + x\n\ncol_total = 0\nfor row in range(len(grid)):\n    col_total = col_total + grid[row][0]\n\nsay_num(row_total)\nsay_num(col_total)\n',
      label: "row_col_sum_demo.py",
      note: "RUN KIỂM CHỨNG\nTổng hàng 1 lấy `row = grid[1]` rồi quét như một list: `4+5+6 = 15`. Tổng cột 0 thì dùng `grid[row][0]`: thay `row`, giữ `0`, nên có `1+4+7 = 12`.",
      expectOut: { all: [/^15$/, /^12$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\nrow = grid[1]\nrow_total = 0\nfor x in row:\n    row_total = row_total + x\n\ncol_total = 0\nfor row in range(len(grid)):\n    col_total = col_total + grid[row][0]\n\nsay_num(row_total)\nsay_num(col_total)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\ncol_total = 0\nfor row in range(len(grid)):\n    col_total = col_total + grid[0][row]   # đề cần tổng CỘT 2: cột cố định, hàng chạy\n\nsay_num(col_total)\n',
      label: "col_sum_fix.py",
      note: "ĐỀ BÀI\nĐề cần tổng cột 2, đúng ra là `3 + 6 + 9 = 18`. Muốn đi dọc một cột thì cột phải cố định còn `row` mới thay đổi. Sửa lại thành `grid[row][2]`.",
      expectOut: /^18$/,
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\ncol_total = 0\nfor row in range(len(grid)):\n    col_total = col_total + grid[row][2]\n\nsay_num(col_total)\n',
    },
    {
      checkpoint: {
        text: "Tổng một hàng: lấy `row = grid[row]` rồi quét `row` như một list. Tổng một cột: giữ cột cố định và thay hàng — `grid[row][cot_co_dinh]`. Đi ngang một hàng: giữ `row`, thay `col`; đi dọc một cột: thay `row`, giữ `col`.",
      },
    },
    {
      quiz: {
        title: "Hàng đi ngang, cột đi dọc",
        questions: [
          {
            q: "Với `grid = [[1,2,3],[4,5,6],[7,8,9]]`, tổng của cột 0 (các số `1`, `4`, `7`) là bao nhiêu?",
            a: ["12", "6", "15"],
            correct: 0,
          },
          {
            q: "Muốn cộng dọc theo cột 2, dòng nào bên trong `for row in range(len(grid)):` là đúng?",
            a: ["`total = total + grid[row][2]`", "`total = total + grid[2][row]`", "`total = total + grid[row][row]`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bài cuối gộp hai ý đã học: tìm ô lớn nhất của MỖI hàng, in mỗi hàng một dòng. Vòng ngoài chọn hàng, bên trong dùng đúng mẫu tìm lớn nhất trên hàng đó.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [3, 7, 2],\n    [9, 1, 4],\n    [5, 6, 8]\n]\n\nfor row in range(len(grid)):\n    row = grid[row]\n    max_value = row[0]\n    for x in row:\n        if x > max_value:\n            max_value = x\n    say_num(max_value)\n',
      label: "max_each_row_demo.py",
      note: "RUN KIỂM CHỨNG\nMỗi vòng ngoài lấy một hàng, tìm ô lớn nhất riêng của hàng đó, rồi in ra. Ba hàng cho ba số: 7, 9, 8.",
      expectOut: { all: [/^7$/, /^9$/, /^8$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [3, 7, 2],\n    [9, 1, 4],\n    [5, 6, 8]\n]\n\nfor row in range(len(grid)):\n    row = grid[row]\n    max_value = row[0]\n    for x in row:\n        if x > max_value:\n            max_value = x\n    say_num(max_value)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [2, 8, 5],\n    [6, 3, 1]\n]\n\nfor row in range(len(grid)):\n    row = grid[row]\n    max_value = row[0]\n    for x in row:\n        if x > max_value:\n            max_value = x\nsay_num(max_value)   # đề cần in lớn nhất của MỖI hàng, mỗi hàng một dòng\n',
      label: "max_each_row_fix.py",
      note: "ĐỀ BÀI\nĐề cần in ô lớn nhất của TỪNG hàng: hàng 0 là 8, hàng 1 là 6. Dòng `say_num` đang nằm ngoài vòng ngoài nên chỉ in một số. Đưa nó vào trong vòng `row` (thụt lề thêm một bậc).",
      expectOut: { all: [/^8$/, /^6$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [2, 8, 5],\n    [6, 3, 1]\n]\n\nfor row in range(len(grid)):\n    row = grid[row]\n    max_value = row[0]\n    for x in row:\n        if x > max_value:\n            max_value = x\n    say_num(max_value)\n',
    },
    {
      remember:
        "Xử lý từng hàng riêng: vòng ngoài lấy `row = grid[row]`, bên trong tìm lớn nhất trên `row`, rồi in NGAY trong vòng ngoài. Lệnh in phải thụt lề bên trong vòng `row` thì mới ra một dòng cho mỗi hàng.",
    },
    {
      quiz: {
        title: "Lớn nhất mỗi hàng",
        questions: [
          {
            q: "Với `grid = [[3,7,2],[9,1,4]]`, in ô lớn nhất của từng hàng thì máy in ra những số nào?",
            a: ["7 rồi 9", "9 rồi 9", "7 rồi 4"],
            correct: 0,
          },
          {
            q: "Muốn mỗi hàng in ra một dòng kết quả, lệnh `say_num(max_value)` phải đặt ở đâu?",
            a: ["Thụt lề bên trong vòng ngoài `for row`, sau khi tìm xong lớn nhất của hàng đó", "Ngoài mọi vòng lặp, ở cuối bài", "Bên trong vòng trong `for x`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Xưởng cuối là sân chơi tự do. Bạn có thể đổi kích thước bảng, đổi công thức dựng bảng, đếm theo điều kiện khác, tính tổng một cột khác, hay tìm ô nhỏ nhất mỗi hàng.",
    },
    {
      code: 'from old_computer import say_num\n\n# sân chơi tự do — chọn một bài quét bảng rồi thử biến tấu bên dưới\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
      label: "grid_basic_sangtao.py",
      expectOut: null,
      solution: 'from old_computer import say_num\n\n# sân chơi tự do — chọn một bài quét bảng rồi thử biến tấu bên dưới\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[0])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài hướng dễ bắt đầu:\n" +
        "• ĐỔI BẢNG — thêm một hàng hoặc một cột rồi tính lại tổng và trung bình.\n" +
        "• DỰNG BẢNG — dùng bảng `0` sẵn rồi ghi `grid[row][col] = row + col` xem bảng ra sao.\n" +
        "• ĐẾM KHÁC — đếm số ô chẵn bằng `grid[row][col] % 2 == 0`.\n" +
        "• CỘT KHÁC — đổi cột cố định để tính tổng một cột khác.\n" +
        "• NHỎ NHẤT — đổi dấu `>` thành `<` để tìm ô nhỏ nhất của mỗi hàng.",
    },
    {
      gift: {
        glyph: "▦",
        name: "HUY HIỆU BẢNG SỐ",
        blurb: "quét cả bảng bằng vòng lặp lồng nhau — tính tổng, đếm, trung bình, lớn nhất, và tổng theo hàng hay theo cột",
        badge: true,
        badgeId: "huy_hieu_bang_so",
      },
    },
    {
      remember:
        "Mọi bài trên bảng đều bắt đầu từ một câu hỏi: mình cần ghé những ô nào? Ghé CẢ bảng thì dùng hai vòng `for row` và `for col`. Đi ngang MỘT hàng thì cột đổi, hàng đứng yên. Đi dọc MỘT cột thì hàng đổi, cột đứng yên. Chọn đúng vòng lặp trước, rồi mới cộng, đếm, hay so sánh bên trong.",
    },
  ],
};
