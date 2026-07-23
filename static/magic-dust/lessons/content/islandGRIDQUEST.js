// islandGRIDQUEST.js — ĐẢO TRUY TÌM & BIẾN HÌNH, a bonus side-island
// (island.js, not node.js): the hardest of the three grid islands, gated
// after node15 ("Grid Memory: Hàng và Cột"). It composes patterns the
// student already owns — grid[hang][cot], row = grid[i], nested for, a
// boolean flag, a running max, a second pre-sized grid to write into — into
// three advanced-but-bookkeeping-only puzzles: search a position, rotate 90°,
// and a magic-square check.
// Uses ONLY previously unlocked syntax: list/grid literals, index read/write,
// len/range, for/while, if/elif/else, and/or/not, comparisons, arithmetic,
// str(), string concat, nested for, say()/say_num() from old_computer.
// No def, no .append, no sort/sorted, no slicing, no comprehensions.
export default {
  index: -1,
  sideIslandId: "islandGRIDQUEST",
  title: "ĐẢO TRUY TÌM & BIẾN HÌNH",
  subtitle: "truy tìm tọa độ, xoay lưới, và kiểm tra ô vuông thần kỳ — vẫn chỉ là vòng lồng nhau",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ TRUY TÌM" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY TRUY TÌM & BIẾN HÌNH",
    blurb: "một cỗ máy phụ để luyện những bài lưới khó hơn: tìm vị trí, xoay hình, và kiểm tra ô vuông thần kỳ",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO TRUY TÌM & BIẾN HÌNH ✦",
        hook: "Đây là đảo lưới khó hơn một chút, nhưng không có phép mới nào cả. Mỗi câu đố chỉ ghép lại những thứ bạn đã có: đọc `grid[row][col]`, dùng vòng lặp lồng nhau để quét lưới, một biến đánh dấu, và một bảng mới để ghi kết quả.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Pip nhắc lại một nhịp cho chắc: `grid[row][col]` đọc một ô, index đầu là hàng, index sau là cột, cả hai đếm từ 0. Vòng ngoài `for row` chọn hàng, vòng trong `for col` đi qua từng cột của hàng đó. Nhớ từng đó là đủ để vào đảo.",
    },
    {
      quiz: {
        title: "Ôn đọc lưới",
        questions: [
          {
            q: "Đọc bảng này:\n```python\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9]\n]\n```\n`grid[1][2]` cho giá trị nào?",
            a: ["9", "1", "3"],
            correct: 0,
          },
          {
            q: "Muốn quét đủ mọi ô của một bảng 2 hàng 3 cột, cần bao nhiêu vòng `for` lồng nhau?",
            a: ["Hai vòng: một chọn hàng, một đi qua từng cột", "Một vòng là đủ cho cả bảng", "Ba vòng cho ba cột"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "◈",
        name: "KÍNH TRUY TÌM",
        blurb: "cách nhìn bài lưới khó: hỏi mình cần một biến đánh dấu, một cặp tọa độ, hay một bảng mới để ghi — rồi dùng vòng lặp lồng nhau để quét lưới",
      },
    },

    // ── Concept 1: search a target's (hàng, cột) position ──────────────
    {
      npc: "Câu đố đầu tiên: đi tìm một con số trong lưới và nói xem nó nằm ở hàng nào, cột nào. Pip dùng một biến đánh dấu `found`, khởi đầu là `False`. Khi quét trúng số cần tìm, mình đặt nó thành `True` và ghi lại hàng, cột.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9],\n    [2, 7, 5]\n]\ntarget = 9\nfound = False\nfound_row = 0\nfound_col = 0\n\nfor row in range(3):\n    for col in range(3):\n        if grid[row][col] == target:\n            found = True\n            found_row = row\n            found_col = col\n\nif found:\n    say("Tìm thấy ở hàng " + str(found_row) + " cột " + str(found_col))\nelse:\n    say("Không tìm thấy")\n',
      label: "grid_search_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để quét cả lưới tìm số 9. Vì `9` nằm ở hàng 1, cột 2, máy in đúng vị trí đó. Nếu quét hết mà `found` vẫn là `False`, khối `else` sẽ báo không tìm thấy.",
      expectOut: /Tìm thấy ở hàng 1 cột 2/i,
      solution: 'from old_computer import say\n\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9],\n    [2, 7, 5]\n]\ntarget = 9\nfound = False\nfound_row = 0\nfound_col = 0\n\nfor row in range(3):\n    for col in range(3):\n        if grid[row][col] == target:\n            found = True\n            found_row = row\n            found_col = col\n\nif found:\n    say("Tìm thấy ở hàng " + str(found_row) + " cột " + str(found_col))\nelse:\n    say("Không tìm thấy")\n',
    },
    {
      npc: "Giờ tới lượt bạn sửa một lỗi nhỏ. Bài dưới đi tìm số `7`; kết quả đúng phải in ra `hàng 2, cột 1`, nhưng hai dòng gán đang ghi nhầm hàng và cột. Tìm hai dòng gán sai rồi sửa lại cho đúng.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9],\n    [2, 7, 5]\n]\ntarget = 7\nfound = False\nfound_row = 0\nfound_col = 0\n\nfor row in range(3):\n    for col in range(3):\n        if grid[row][col] == target:\n            found = True\n            found_row = col\n            found_col = row\n\nif found:\n    say("Tìm thấy ở hàng " + str(found_row) + " cột " + str(found_col))\nelse:\n    say("Không tìm thấy")\n',
      label: "grid_search_fix.py",
      note: "ĐỀ BÀI\nSố `7` nằm ở hàng 2, cột 1. Output đúng phải là `Tìm thấy ở hàng 2 cột 1`. Sửa hai dòng gán `found_row` và `found_col` cho đúng biến.",
      expectOut: /Tìm thấy ở hàng 2 cột 1/i,
      solution: 'from old_computer import say\n\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9],\n    [2, 7, 5]\n]\ntarget = 7\nfound = False\nfound_row = 0\nfound_col = 0\n\nfor row in range(3):\n    for col in range(3):\n        if grid[row][col] == target:\n            found = True\n            found_row = row\n            found_col = col\n\nif found:\n    say("Tìm thấy ở hàng " + str(found_row) + " cột " + str(found_col))\nelse:\n    say("Không tìm thấy")\n',
    },
    {
      checkpoint: {
        text: "Để tìm vị trí một giá trị trong lưới, dùng vòng lặp lồng nhau để đi qua từng ô và giữ một biến đánh dấu `found` khởi đầu `False`; khi trúng thì đặt `True` và ghi lại `row`, `col`. Nếu quét xong `found` vẫn `False`, nghĩa là không có giá trị đó.",
      },
    },
    {
      quiz: {
        title: "Truy tìm tọa độ",
        questions: [
          {
            q: "Cho lưới:\n```python\ngrid = [\n    [4, 8, 1],\n    [6, 3, 9]\n]\n```\nQuét tìm số `6`. Khi tìm thấy thì ghi `row` và `col` của ô đó. Kết quả là hàng nào, cột nào?",
            a: ["Hàng 1, cột 0", "Hàng 0, cột 1", "Hàng 6, cột 6"],
            correct: 0,
          },
          {
            q: "Quét hết cả lưới mà biến `found` vẫn là `False`. Điều đó nghĩa là gì?",
            a: ["Giá trị cần tìm không có trong lưới", "Lưới rỗng nên máy bỏ qua", "Máy tìm thấy nhưng quên in"],
            correct: 0,
          },
        ],
      },
    },


    // ── Concept 2: rotate a square grid 90° clockwise into a new grid ──
    {
      npc: "Câu đố thứ hai: xoay một lưới vuông 90 độ theo chiều kim đồng hồ. Trước khi viết code, nhìn bốn góc của lưới 3x3 này cho quen mắt: số `1` đang ở góc trên-trái, xoay xong nó qua góc trên-phải; `3` từ góc trên-phải xuống góc dưới-phải; `9` từ góc dưới-phải qua góc dưới-trái; `7` từ góc dưới-trái lên góc trên-trái.",
    },
    {
      npc: "Cả bốn góc đều dịch một bước theo chiều kim đồng hồ — và mọi ô khác cũng vậy. Công thức gói gọn quy luật đó: `new_grid[col][n - 1 - row] = grid[row][col]`, với `n` là cạnh lưới. Pip chuẩn bị sẵn một bảng `new_grid` toàn số 0 cùng cỡ để ghi kết quả vào, vì mình chưa có cách tạo bảng rỗng rồi thêm dần.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nn = 3\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(n):\n    for col in range(n):\n        new_grid[col][n - 1 - row] = grid[row][col]\n\nfor row in range(n):\n    line = ""\n    for col in range(n):\n        line = line + str(new_grid[row][col]) + " "\n    say(line)\n',
      label: "rotate_90_demo.py",
      note: "RUN KIỂM CHỨNG\nVòng lồng nhau chép từng ô của `grid` sang đúng chỗ mới trong `new_grid` theo công thức `new_grid[col][n - 1 - row]`. Xoay xong, lưới in ra là `7 4 1`, `8 5 2`, `9 6 3`.",
      expectOut: { all: [/7 4 1/, /8 5 2/, /9 6 3/] },
      solution: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nn = 3\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(n):\n    for col in range(n):\n        new_grid[col][n - 1 - row] = grid[row][col]\n\nfor row in range(n):\n    line = ""\n    for col in range(n):\n        line = line + str(new_grid[row][col]) + " "\n    say(line)\n',
    },
    {
      npc: "Bài sửa lỗi: có người viết `new_grid[col][row]`, tức là chỉ đổi chỗ hàng-cột chứ chưa xoay. Kết quả sai thành `1 4 7`, `2 5 8`, `3 6 9`. Thêm phần `n - 1 - row` vào đúng chỗ để thành phép xoay thật.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nn = 3\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(n):\n    for col in range(n):\n        new_grid[col][row] = grid[row][col]\n\nfor row in range(n):\n    line = ""\n    for col in range(n):\n        line = line + str(new_grid[row][col]) + " "\n    say(line)\n',
      label: "rotate_90_fix.py",
      note: "ĐỀ BÀI\nDòng gán đang chỉ đổi chỗ hàng-cột chứ chưa xoay. Sửa cột đích thành `n - 1 - row` để lưới xoay đúng: `7 4 1`, `8 5 2`, `9 6 3`.",
      expectOut: { all: [/7 4 1/, /8 5 2/, /9 6 3/] },
      solution: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nn = 3\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(n):\n    for col in range(n):\n        new_grid[col][n - 1 - row] = grid[row][col]\n\nfor row in range(n):\n    line = ""\n    for col in range(n):\n        line = line + str(new_grid[row][col]) + " "\n    say(line)\n',
    },
    {
      checkpoint: {
        text: "Xoay lưới vuông 90 độ theo chiều kim đồng hồ: chuẩn bị một bảng mới cùng cỡ toàn số 0, rồi chép mỗi ô bằng `new_grid[col][n - 1 - row] = grid[row][col]`. Thiếu phần `n - 1 - row` thì chỉ đổi chỗ hàng-cột, chưa phải xoay.",
      },
    },
    {
      quiz: {
        title: "Xoay lưới 90 độ",
        questions: [
          {
            q: "Xoay lưới 3x3 dưới đây 90 độ theo chiều kim đồng hồ:\n```python\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n```\nSố `1` đang ở góc trên-trái, sau khi xoay nó về góc nào?",
            a: ["Góc trên-phải", "Góc dưới-trái", "Vẫn ở góc trên-trái"],
            correct: 0,
          },
          {
            q: "Vì sao phải ghi kết quả xoay vào một bảng `new_grid` mới thay vì sửa thẳng trên `grid`?",
            a: ["Vì ghi đè lên `grid` sẽ làm hỏng những ô chưa kịp chép đi", "Vì `grid` không cho phép đọc", "Vì bảng mới luôn tự xoay lưới"],
            correct: 0,
          },
        ],
      },
    },


    // ── Concept 3: magic-square check on a 3×3 grid ───────────────────
    {
      npc: "Câu đố thứ ba: kiểm tra một lưới 3x3 có phải ô vuông thần kỳ không. Ô vuông thần kỳ là khi tổng mỗi hàng, tổng mỗi cột, và tổng hai đường chéo ĐỀU bằng nhau. Ví dụ: lưới trong bài ngay dưới có mọi hàng, cột, và đường chéo đều tổng 15, nên là ô vuông thần kỳ. Thay vì so từng cặp, Pip chọn cách gọn: lấy tổng hàng đầu làm `target`, rồi so từng tổng còn lại với `target`.",
    },
    {
      npc: "Cách đó đơn giản vì nếu mọi thứ đều bằng cùng một con số `target`, thì đương nhiên chúng bằng nhau. Pip dùng một biến đánh dấu `is_magic_square` khởi đầu `True`; hễ gặp một tổng khác `target`, đặt nó thành `False`. Quét xong, nếu vẫn còn `True` thì đúng là ô vuông thần kỳ.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [2, 7, 6],\n    [9, 5, 1],\n    [4, 3, 8]\n]\n\ntarget = grid[0][0] + grid[0][1] + grid[0][2]\nis_magic_square = True\n\nfor row in range(3):\n    row_total = 0\n    for col in range(3):\n        row_total = row_total + grid[row][col]\n    if row_total != target:\n        is_magic_square = False\n\nfor col in range(3):\n    col_total = 0\n    for row in range(3):\n        col_total = col_total + grid[row][col]\n    if col_total != target:\n        is_magic_square = False\n\ndiag1 = grid[0][0] + grid[1][1] + grid[2][2]\ndiag2 = grid[0][2] + grid[1][1] + grid[2][0]\nif diag1 != target:\n    is_magic_square = False\nif diag2 != target:\n    is_magic_square = False\n\nif is_magic_square:\n    say("Là ô vuông thần kỳ")\nelse:\n    say("Không phải")\n',
      label: "magic_square_demo.py",
      note: "RUN KIỂM CHỨNG\nMọi hàng, mọi cột, và hai đường chéo của lưới này đều có tổng 15, nên `is_magic_square` giữ nguyên `True` và máy in `Là ô vuông thần kỳ`.",
      expectOut: /Là ô vuông thần kỳ/i,
      solution: 'from old_computer import say\n\ngrid = [\n    [2, 7, 6],\n    [9, 5, 1],\n    [4, 3, 8]\n]\n\ntarget = grid[0][0] + grid[0][1] + grid[0][2]\nis_magic_square = True\n\nfor row in range(3):\n    row_total = 0\n    for col in range(3):\n        row_total = row_total + grid[row][col]\n    if row_total != target:\n        is_magic_square = False\n\nfor col in range(3):\n    col_total = 0\n    for row in range(3):\n        col_total = col_total + grid[row][col]\n    if col_total != target:\n        is_magic_square = False\n\ndiag1 = grid[0][0] + grid[1][1] + grid[2][2]\ndiag2 = grid[0][2] + grid[1][1] + grid[2][0]\nif diag1 != target:\n    is_magic_square = False\nif diag2 != target:\n    is_magic_square = False\n\nif is_magic_square:\n    say("Là ô vuông thần kỳ")\nelse:\n    say("Không phải")\n',
    },
    {
      npc: "Bài sửa lỗi cuối cùng: đường chéo phụ `diag2` bị lấy nhầm một ô. Đường chéo phụ đi từ góc trên-phải xuống góc dưới-trái, tức là `grid[0][2]`, `grid[1][1]`, `grid[2][0]`. Sửa ô cuối của `diag2` cho đúng góc dưới-trái.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [2, 7, 6],\n    [9, 5, 1],\n    [4, 3, 8]\n]\n\ntarget = grid[0][0] + grid[0][1] + grid[0][2]\nis_magic_square = True\n\nfor row in range(3):\n    row_total = 0\n    for col in range(3):\n        row_total = row_total + grid[row][col]\n    if row_total != target:\n        is_magic_square = False\n\nfor col in range(3):\n    col_total = 0\n    for row in range(3):\n        col_total = col_total + grid[row][col]\n    if col_total != target:\n        is_magic_square = False\n\ndiag1 = grid[0][0] + grid[1][1] + grid[2][2]\ndiag2 = grid[0][2] + grid[1][1] + grid[2][1]\nif diag1 != target:\n    is_magic_square = False\nif diag2 != target:\n    is_magic_square = False\n\nif is_magic_square:\n    say("Là ô vuông thần kỳ")\nelse:\n    say("Không phải")\n',
      label: "magic_square_fix.py",
      note: "ĐỀ BÀI\nĐường chéo phụ phải gồm `grid[0][2]`, `grid[1][1]`, `grid[2][0]`. Sửa ô cuối của `diag2` để máy nhận đúng lưới này là ô vuông thần kỳ, in `Là ô vuông thần kỳ`.",
      expectOut: /Là ô vuông thần kỳ/i,
      solution: 'from old_computer import say\n\ngrid = [\n    [2, 7, 6],\n    [9, 5, 1],\n    [4, 3, 8]\n]\n\ntarget = grid[0][0] + grid[0][1] + grid[0][2]\nis_magic_square = True\n\nfor row in range(3):\n    row_total = 0\n    for col in range(3):\n        row_total = row_total + grid[row][col]\n    if row_total != target:\n        is_magic_square = False\n\nfor col in range(3):\n    col_total = 0\n    for row in range(3):\n        col_total = col_total + grid[row][col]\n    if col_total != target:\n        is_magic_square = False\n\ndiag1 = grid[0][0] + grid[1][1] + grid[2][2]\ndiag2 = grid[0][2] + grid[1][1] + grid[2][0]\nif diag1 != target:\n    is_magic_square = False\nif diag2 != target:\n    is_magic_square = False\n\nif is_magic_square:\n    say("Là ô vuông thần kỳ")\nelse:\n    say("Không phải")\n',
    },
    {
      checkpoint: {
        text: "Kiểm tra ô vuông thần kỳ: lấy tổng hàng đầu làm `target`, giữ một biến đánh dấu `is_magic_square` khởi đầu `True`, rồi so từng tổng hàng, tổng cột, và hai tổng đường chéo với `target`. Gặp một tổng khác thì đặt `is_magic_square = False`.",
      },
    },
    {
      quiz: {
        title: "Ô vuông thần kỳ",
        questions: [
          {
            q: "Một lưới 3x3 được gọi là ô vuông thần kỳ khi những tổng nào phải bằng nhau?",
            a: ["Tổng mỗi hàng, mỗi cột, và cả hai đường chéo", "Chỉ tổng ba hàng với nhau", "Chỉ hai đường chéo với nhau"],
            correct: 0,
          },
          {
            q: "Cho lưới:\n```python\ngrid = [\n    [2, 7, 6],\n    [9, 5, 1],\n    [4, 3, 8]\n]\n```\nĐường chéo phụ (từ góc trên-phải xuống góc dưới-trái) gồm những ô nào?",
            a: ["`grid[0][2]`, `grid[1][1]`, `grid[2][0]`", "`grid[0][0]`, `grid[1][1]`, `grid[2][2]`", "`grid[0][2]`, `grid[1][1]`, `grid[2][1]`"],
            correct: 0,
          },
        ],
      },
    },

    // ── Free-play + badge + closing ───────────────────────────────────
    {
      npc: "Xưởng cuối là của bạn. Đổi con số cần truy tìm, xoay một lưới khác, hoặc thử một lưới 3x3 khác xem có phải ô vuông thần kỳ không. Không chấm điểm — thử thoải mái.",
    },
    {
      code: 'from old_computer import say\n\n# xưởng của bạn — chọn một câu đố rồi sửa bên dưới\ngrid = [\n    [3, 1, 4],\n    [1, 5, 9],\n    [2, 6, 5]\n]\ntarget = 5\nfound = False\nfound_row = 0\nfound_col = 0\n\nfor row in range(3):\n    for col in range(3):\n        if grid[row][col] == target:\n            found = True\n            found_row = row\n            found_col = col\n\nif found:\n    say("Tìm thấy ở hàng " + str(found_row) + " cột " + str(found_col))\nelse:\n    say("Không tìm thấy")\n',
      label: "gridquest_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài hướng dễ bắt đầu:\n" +
        "• TRUY TÌM — đổi `target` sang một số không có trong lưới để thấy nhánh `Không tìm thấy` chạy.\n" +
        "• XOAY LƯỚI — chép một lưới 3x3 khác vào bảng mới bằng `new_grid[col][n - 1 - row]`.\n" +
        "• Ô VUÔNG THẦN KỲ — sửa một ô cho lệch để thấy máy in `Không phải`.",
    },
    {
      gift: {
        glyph: "◈",
        name: "HUY HIỆU TRUY TÌM & BIẾN HÌNH",
        blurb: "phần thưởng cho việc truy tìm tọa độ, xoay lưới, và kiểm tra ô vuông thần kỳ — tất cả chỉ bằng vòng lồng nhau và một chút ghi chép cẩn thận",
        badge: true,
        badgeId: "huy_hieu_truy_tim",
      },
    },
    {
      remember:
        "Bài lưới càng khó thì càng nên hỏi: mình cần công cụ ghi chép nào? Một biến đánh dấu để nhớ đã tìm thấy chưa, một cặp tọa độ (hàng, cột), hay một bảng mới để ghi kết quả vào. Chọn đúng công cụ rồi dùng vòng lặp lồng nhau để đi qua từng ô — không có phép mới nào, chỉ là ghép những mẫu bạn đã quen.",
    },
  ],
};
