// islandGRIDOPS.js — ĐẢO PHÉP TOÁN BẢNG, a bonus side-island (island.js, not
// node.js): after node15 ("Grid Memory: Hàng và Cột"), this island teaches the
// intermediate grid-operation patterns — cộng hai bảng, nhân vô hướng, chuyển
// vị, đổi hàng/cột, đường chéo, kiểm tra đối xứng, và viền bảng. Every "build a
// new grid" step uses a pre-sized literal filled by index assignment inside a
// nested loop, exactly like node15. It uses only previously unlocked syntax:
// grid[row][col] read/write, row = grid[i], len(), range(), for/while,
// if/elif/else, and/or/not, comparisons, arithmetic, str(), string concat,
// nested for, và say()/say_num() từ old_computer. Gated at unlockAt:16 in saga.js.
export default {
  index: -1,
  sideIslandId: "islandGRIDOPS",
  title: "ĐẢO PHÉP TOÁN BẢNG",
  subtitle: "cộng bảng, nhân bảng, chuyển vị, đổi hàng/cột, đường chéo, đối xứng và viền bảng — tất cả bằng cùng một kiểu quét lồng nhau",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ PHÉP TOÁN BẢNG" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY BIẾN HÌNH BẢNG",
    blurb: "một cỗ máy phụ để luyện biến đổi cả một bảng số: cộng, nhân, xoay chỗ, và kiểm tra hình dạng",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO PHÉP TOÁN BẢNG ✦",
        hook: "Ở Đảo Grid Memory, bạn đã đọc và sửa từng ô. Trên đảo này, tụi mình xử lý cả một bảng cùng lúc: cộng hai bảng, nhân mọi ô, xoay hàng thành cột. Bí mật là: mọi phép toán bảng đều dùng chung một kiểu quét lồng nhau — chỉ đổi việc làm ở mỗi ô mà thôi.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Pip nhắc lại một mẹo đã học nhé: muốn dựng một bảng mới, mình viết sẵn nó bằng số 0, rồi điền từng ô bằng vòng lặp lồng nhau. Ví dụ `result = [[0, 0], [0, 0]]` là một bảng 2 hàng 2 cột toàn số 0, chờ được điền.",
    },
    {
      quiz: {
        title: "Ôn dựng bảng trống",
        questions: [
          {
            q: "Muốn có một bảng mới gồm 2 hàng, 3 cột, toàn số 0 để điền dần, viết thế nào?",
            a: ["`[[0, 0, 0], [0, 0, 0]]`", "`[0, 0, 0, 0, 0, 0]`", "`[[0, 0], [0, 0], [0, 0]]`"],
            correct: 0,
          },
        ],
      },
    },

    // ── 1. Cộng hai bảng cùng cỡ vào một bảng MỚI ──
    {
      npc: "Việc đầu tiên: cộng hai bảng cùng cỡ. Có bảng `a` và bảng `b`, mình muốn một bảng `result` mà mỗi ô là tổng hai ô cùng vị trí. Vì `result` là kết quả mới, mình dựng nó trống rồi điền.",
    },
    {
      code: 'from old_computer import say_num\n\na = [\n    [1, 2],\n    [3, 4]\n]\nb = [\n    [10, 20],\n    [30, 40]\n]\nresult = [\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(a)):\n    for col in range(len(a[row])):\n        result[row][col] = a[row][col] + b[row][col]\n\nsay_num(result[0][0])\nsay_num(result[0][1])\nsay_num(result[1][0])\nsay_num(result[1][1])\n',
      label: "grid_add_demo.py",
      note: "RUN KIỂM CHỨNG\nMỗi ô của `result` là tổng của ô cùng vị trí ở `a` và `b`. Vòng ngoài đi từng hàng, vòng trong đi từng cột, và `result[row][col]` nhận `a[row][col] + b[row][col]`.",
      expectOut: { all: [/^11$/, /^22$/, /^33$/, /^44$/] },
      solution: 'from old_computer import say_num\n\na = [\n    [1, 2],\n    [3, 4]\n]\nb = [\n    [10, 20],\n    [30, 40]\n]\nresult = [\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(a)):\n    for col in range(len(a[row])):\n        result[row][col] = a[row][col] + b[row][col]\n\nsay_num(result[0][0])\nsay_num(result[0][1])\nsay_num(result[1][0])\nsay_num(result[1][1])\n',
    },
    {
      code: 'from old_computer import say_num\n\na = [\n    [1, 2],\n    [3, 4]\n]\nb = [\n    [10, 20],\n    [30, 40]\n]\nresult = [\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(a)):\n    for col in range(len(a[row])):\n        result[row][col] = a[row][col]\n\nsay_num(result[0][0])\nsay_num(result[0][1])\nsay_num(result[1][0])\nsay_num(result[1][1])\n',
      label: "grid_add_fix.py",
      note: "ĐỀ BÀI\nBài này quên cộng bảng `b`, nên mới chỉ chép lại `a`. Sửa dòng gán để mỗi ô là tổng hai bảng. Output đúng là 11, 22, 33, 44.",
      expectOut: { all: [/^11$/, /^22$/, /^33$/, /^44$/] },
      solution: 'from old_computer import say_num\n\na = [\n    [1, 2],\n    [3, 4]\n]\nb = [\n    [10, 20],\n    [30, 40]\n]\nresult = [\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(a)):\n    for col in range(len(a[row])):\n        result[row][col] = a[row][col] + b[row][col]\n\nsay_num(result[0][0])\nsay_num(result[0][1])\nsay_num(result[1][0])\nsay_num(result[1][1])\n',
    },

    // ── 2. Nhân vô hướng, sửa NGAY trên bảng cũ ──
    {
      npc: "Việc thứ hai đổi cách nghĩ một chút. Lần này mình nhân mọi ô của một bảng với cùng một con số, và ghi kết quả NGAY vào chính bảng đó — không cần bảng mới. Mỗi ô được gán lại bằng giá trị cũ của nó nhân với `factor`.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nfactor = 10\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        grid[row][col] = grid[row][col] * factor\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[1][2])\n',
      label: "grid_scale_demo.py",
      note: "RUN KIỂM CHỨNG\nKhông có bảng mới nào cả: `grid[row][col]` được gán lại bằng giá trị cũ của nó nhân `factor`. Không tạo bảng khác; các giá trị trong `grid` đều gấp 10 lần.",
      expectOut: { all: [/^10$/, /^30$/, /^60$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nfactor = 10\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        grid[row][col] = grid[row][col] * factor\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[1][2])\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nfactor = 2\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        grid[row][col] = grid[row][col] + factor\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[1][2])\n',
      label: "grid_scale_fix.py",
      note: "ĐỀ BÀI\nĐề muốn NHÂN ĐÔI mọi ô (hệ số 2), nhưng bài đang cộng thêm 2 thay vì nhân. Sửa lại phép toán để output đúng là 2, 6, 12.",
      expectOut: { all: [/^2$/, /^6$/, /^12$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nfactor = 2\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        grid[row][col] = grid[row][col] * factor\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[1][2])\n',
    },
    {
      checkpoint: {
        text: "Có hai kiểu phép toán bảng. Cộng hai bảng cần một bảng MỚI dựng sẵn (`result[row][col] = a[row][col] + b[row][col]`); nhân mọi ô với một số thì sửa NGAY bảng cũ (`grid[row][col] = grid[row][col] * factor`). Khung quét lồng nhau y hệt, chỉ khác chỗ ghi kết quả.",
      },
    },
    {
      quiz: {
        title: "Bảng mới hay bảng cũ?",
        questions: [
          {
            q: "Đọc đoạn này:\n```python\nresult = [[0, 0], [0, 0]]\nfor row in range(2):\n    for col in range(2):\n        result[row][col] = a[row][col] + b[row][col]\n```\nTrong bốn dòng này, `result` phải được dựng sẵn trước vòng lặp để làm gì?",
            a: [
              "Để có sẵn các ô trống mà ghi tổng vào, vì mình không sửa `a` hay `b`",
              "Để máy tự biết `a` cộng `b` mà không cần vòng lặp",
              "Để `a` và `b` tự động bị nhân đôi",
            ],
            correct: 0,
          },
          {
            q: "Khi nhân mọi ô của một bảng với 3 và muốn giữ nguyên bảng đó (không tạo bảng mới), dòng trong vòng lặp nên là gì?",
            a: ["`grid[row][col] = grid[row][col] * 3`", "`result[row][col] = grid[row][col] * 3`", "`grid[row][col] = 3`"],
            correct: 0,
          },
        ],
      },
    },

    // ── 3. Chuyển vị: hàng thành cột ──
    {
      npc: "Việc thứ ba là CHUYỂN VỊ: ô cũ `grid[h][c]` được chép sang `new_grid[c][h]`. Ô ở hàng `h` cột `c` của bảng cũ sẽ nằm ở hàng `c` cột `h` của bảng mới. Chú ý cỡ bảng: nếu bảng cũ 2 hàng 3 cột, bảng mới phải 3 hàng 2 cột.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\n# grid có 2 hàng, 3 cột -> bảng mới phải có 3 hàng, 2 cột\nnew_grid = [\n    [0, 0],\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        new_grid[col][row] = grid[row][col]\n\nsay_num(new_grid[0][0])\nsay_num(new_grid[0][1])\nsay_num(new_grid[2][0])\nsay_num(new_grid[2][1])\n',
      label: "grid_transpose_demo.py",
      note: "RUN KIỂM CHỨNG\nChìa khóa nằm ở dòng gán: `new_grid[col][row] = grid[row][col]`. Hàng và cột đổi chỗ cho nhau. Bảng mới thành `[[1, 4], [2, 5], [3, 6]]`.",
      expectOut: { all: [/^1$/, /^4$/, /^3$/, /^6$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nnew_grid = [\n    [0, 0],\n    [0, 0],\n    [0, 0]\n]\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        new_grid[col][row] = grid[row][col]\n\nsay_num(new_grid[0][0])\nsay_num(new_grid[0][1])\nsay_num(new_grid[2][0])\nsay_num(new_grid[2][1])\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        new_grid[row][col] = grid[row][col]\n\nsay_num(new_grid[0][1])\nsay_num(new_grid[1][0])\n',
      label: "grid_transpose_fix.py",
      note: "ĐỀ BÀI\nBài này chép thẳng ô sang bảng mới mà chưa hoán vị, nên chưa phải chuyển vị. Sửa dòng gán để hàng đổi thành cột. Chuyển vị đúng thì `new_grid[0][1]` là 4 và `new_grid[1][0]` là 2.",
      expectOut: { all: [/^4$/, /^2$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nnew_grid = [\n    [0, 0, 0],\n    [0, 0, 0],\n    [0, 0, 0]\n]\n\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        new_grid[col][row] = grid[row][col]\n\nsay_num(new_grid[0][1])\nsay_num(new_grid[1][0])\n',
    },
    {
      checkpoint: {
        text: "Chuyển vị đổi hàng thành cột bằng dòng gán `new_grid[col][row] = grid[row][col]`. Nếu bảng cũ có `m` hàng và `n` cột thì bảng mới phải được dựng sẵn với `n` hàng và `m` cột.",
      },
    },
    {
      quiz: {
        title: "Đổi hàng thành cột",
        questions: [
          {
            q: "Chuyển vị một bảng bằng vòng lặp lồng nhau. Dòng gán nào đổi đúng hàng thành cột?",
            a: ["`new_grid[col][row] = grid[row][col]`", "`new_grid[row][col] = grid[row][col]`", "`new_grid[col][row] = grid[col][row]`"],
            correct: 0,
          },
          {
            q: "Bảng cũ có 4 hàng và 2 cột. Bảng mới để chứa bản chuyển vị phải được dựng sẵn với cỡ nào?",
            a: ["2 hàng, 4 cột", "4 hàng, 2 cột", "4 hàng, 4 cột"],
            correct: 0,
          },
        ],
      },
    },

    // ── 4. Đổi chỗ hai hàng / hai cột ──
    {
      npc: "Việc thứ tư: đổi chỗ. Đổi hai HÀNG thì dễ hơn tưởng tượng, vì một hàng vốn đã là một list. Mình chỉ cần một biến tạm giữ nguyên cả hàng, rồi tráo chỗ — giống như đổi chỗ hai cuốn sách bằng một chỗ để tạm.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\n# đổi chỗ hàng 0 và hàng 2\ntemp = grid[0]\ngrid[0] = grid[2]\ngrid[2] = temp\n\nsay_num(grid[0][0])\nsay_num(grid[2][0])\n',
      label: "grid_swap_rows_demo.py",
      note: "RUN KIỂM CHỨNG\nVì mỗi hàng là một list nguyên vẹn, đổi chỗ hai hàng chỉ cần ba dòng với một biến tạm `temp`. Sau khi tráo, hàng 0 bắt đầu bằng 7, hàng 2 bắt đầu bằng 1.",
      expectOut: { all: [/^7$/, /^1$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\ntemp = grid[0]\ngrid[0] = grid[2]\ngrid[2] = temp\n\nsay_num(grid[0][0])\nsay_num(grid[2][0])\n',
    },
    {
      npc: "Đổi hai CỘT lại khó hơn hẳn, và đây là lý do: không có sẵn một list nào chứa \"cả một cột\". Cột nằm rải ra ở mọi hàng. Nên mình phải đi từng hàng, và tại mỗi hàng, tráo hai ô của hai cột đó bằng một biến tạm riêng.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ncol1 = 0\ncol2 = 2\n\nfor row in range(len(grid)):\n    temp = grid[row][col1]\n    grid[row][col1] = grid[row][col2]\n    grid[row][col2] = temp\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[2][0])\nsay_num(grid[2][2])\n',
      label: "grid_swap_cols_demo.py",
      note: "RUN KIỂM CHỨNG\nĐổi chỗ cột 0 và cột 2. Phải quét từng hàng, mỗi hàng tráo hai ô bằng một biến tạm. Sau khi tráo, hàng 0 thành `[3, 2, 1]`, hàng 2 thành `[9, 8, 7]`.",
      expectOut: { all: [/^3$/, /^1$/, /^9$/, /^7$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ncol1 = 0\ncol2 = 2\n\nfor row in range(len(grid)):\n    temp = grid[row][col1]\n    grid[row][col1] = grid[row][col2]\n    grid[row][col2] = temp\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\nsay_num(grid[2][0])\nsay_num(grid[2][2])\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ncol1 = 0\ncol2 = 2\n\nfor row in range(len(grid)):\n    grid[row][col1] = grid[row][col2]\n    grid[row][col2] = grid[row][col1]\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\n',
      label: "grid_swap_cols_fix.py",
      note: "ĐỀ BÀI\nBài này quên biến tạm, nên khi ghi đè ô cột 0 xong thì giá trị cũ đã mất, làm hai cột giống hệt nhau. Thêm một biến tạm `temp` giữ giá trị cũ trước khi ghi đè. Đổi đúng thì `grid[0][0]` là 3 và `grid[0][2]` là 1.",
      expectOut: { all: [/^3$/, /^1$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\ncol1 = 0\ncol2 = 2\n\nfor row in range(len(grid)):\n    temp = grid[row][col1]\n    grid[row][col1] = grid[row][col2]\n    grid[row][col2] = temp\n\nsay_num(grid[0][0])\nsay_num(grid[0][2])\n',
    },
    {
      checkpoint: {
        text: "Đổi hai HÀNG chỉ cần ba dòng vì một hàng là một list nguyên vẹn: `temp = grid[0]; grid[0] = grid[2]; grid[2] = temp`. Đổi hai CỘT cần vòng lặp quét từng hàng, và tại mỗi hàng phải dùng một biến tạm để không mất giá trị cũ khi ghi đè.",
      },
    },
    {
      quiz: {
        title: "Đổi hàng và đổi cột",
        questions: [
          {
            q: "Vì sao đổi chỗ hai cột của một bảng lại cần vòng lặp, còn đổi chỗ hai hàng thì không?",
            a: [
              "Vì một hàng đã là một list sẵn để tráo, còn một cột nằm rải ở mọi hàng nên phải quét từng hàng",
              "Vì Python cấm đổi chỗ hai hàng bằng vòng lặp",
              "Vì cột luôn nhiều hơn hàng",
            ],
            correct: 0,
          },
          {
            q: "Khi tráo hai ô trong một hàng, vì sao phải dùng biến tạm `temp`?",
            a: [
              "Vì nếu ghi đè ô thứ nhất trước, giá trị cũ của nó mất, làm hai ô thành giống nhau",
              "Vì `temp` giúp vòng lặp chạy nhanh hơn",
              "Vì không có `temp` thì máy báo lỗi cú pháp",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── 5. Đường chéo chính, đường chéo phụ, và hiệu hai tổng ──
    {
      npc: "Việc thứ năm chơi với đường chéo của một bảng vuông. Đường chéo CHÍNH đi từ góc trên-trái xuống góc dưới-phải: đó là các ô `grid[i][i]`. Đường chéo PHỤ đi từ góc trên-phải xuống góc dưới-trái: các ô `grid[i][n - 1 - i]`. Ví dụ: với bảng 3x3, đường chéo chính gồm `grid[0][0]`, `grid[1][1]`, `grid[2][2]`; đường chéo phụ gồm `grid[0][2]`, `grid[1][1]`, `grid[2][0]`.",
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 10]\n]\nn = len(grid)\n\nmain_total = 0\nanti_total = 0\nfor i in range(n):\n    main_total = main_total + grid[i][i]\n    anti_total = anti_total + grid[i][n - 1 - i]\n\nsay_num(main_total)\nsay_num(anti_total)\nsay_num(main_total - anti_total)\n',
      label: "grid_diagonals_demo.py",
      note: "RUN KIỂM CHỨNG\nChỉ cần MỘT vòng lặp `i` cho bảng vuông. Đường chéo chính là `1 + 5 + 10 = 16`; đường chéo phụ là `3 + 5 + 7 = 15`; hiệu hai tổng là `1`.",
      expectOut: { all: [/^16$/, /^15$/, /^1$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 10]\n]\nn = len(grid)\n\nmain_total = 0\nanti_total = 0\nfor i in range(n):\n    main_total = main_total + grid[i][i]\n    anti_total = anti_total + grid[i][n - 1 - i]\n\nsay_num(main_total)\nsay_num(anti_total)\nsay_num(main_total - anti_total)\n',
    },
    {
      code: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 10]\n]\nn = len(grid)\n\nmain_total = 0\nanti_total = 0\nfor i in range(n):\n    main_total = main_total + grid[i][i]\n    anti_total = anti_total + grid[i][i]\n\nsay_num(main_total)\nsay_num(anti_total)\n',
      label: "grid_diagonals_fix.py",
      note: "ĐỀ BÀI\nDòng tính đường chéo phụ đang lặp lại công thức của đường chéo chính. Sửa lại chỉ số cột thành `n - 1 - i` để cộng đúng đường chéo phụ. Output đúng là 16 rồi 15.",
      expectOut: { all: [/^16$/, /^15$/] },
      solution: 'from old_computer import say_num\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 10]\n]\nn = len(grid)\n\nmain_total = 0\nanti_total = 0\nfor i in range(n):\n    main_total = main_total + grid[i][i]\n    anti_total = anti_total + grid[i][n - 1 - i]\n\nsay_num(main_total)\nsay_num(anti_total)\n',
    },
    {
      remember:
        "Trên bảng vuông cỡ `n`, đường chéo chính là các ô `grid[i][i]` và đường chéo phụ là các ô `grid[i][n - 1 - i]`, với `i` chạy từ 0 tới `n - 1`. Cả hai chỉ cần một vòng lặp `i`, không cần vòng lồng nhau.",
    },
    {
      quiz: {
        title: "Hai đường chéo",
        questions: [
          {
            q: "Bảng vuông cỡ `n = 4`. Ô nào KHÔNG nằm trên đường chéo phụ (các ô `grid[i][n - 1 - i]`)?",
            a: ["`grid[1][1]`", "`grid[0][3]`", "`grid[3][0]`"],
            correct: 0,
          },
          {
            q: "Đọc đoạn này với `n = 3`:\n```python\nfor i in range(n):\n    total = total + grid[i][n - 1 - i]\n```\n`total` cộng những ô nào?",
            a: ["`grid[0][2]`, `grid[1][1]`, `grid[2][0]`", "`grid[0][0]`, `grid[1][1]`, `grid[2][2]`", "`grid[0][0]`, `grid[0][1]`, `grid[0][2]`"],
            correct: 0,
          },
        ],
      },
    },

    // ── 6. Kiểm tra bảng đối xứng bằng cờ boolean ──
    {
      npc: "Việc thứ sáu: kiểm tra một bảng vuông có ĐỐI XỨNG không, tức là ô `grid[row][col]` luôn bằng ô ở vị trí đổi hàng-cột `grid[col][row]`. Ví dụ: nếu `grid[0][1]` và `grid[1][0]` đều là 2 thì cặp đó khớp; nếu một bên là 2 còn bên kia là 9 thì bảng không đối xứng. Mình chưa có cách dừng giữa chừng, nên dùng một mẹo quen thuộc: đặt `is_symmetric = True`; gặp ô lệch thì gán `is_symmetric = False`.",
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [2, 5, 6],\n    [3, 6, 9]\n]\nn = len(grid)\n\nis_symmetric = True\nfor row in range(n):\n    for col in range(n):\n        if grid[row][col] != grid[col][row]:\n            is_symmetric = False\n\nif is_symmetric:\n    say("ĐỐI XỨNG")\nelse:\n    say("KHÔNG ĐỐI XỨNG")\n',
      label: "grid_symmetric_demo.py",
      note: "RUN KIỂM CHỨNG\nBảng này đối xứng qua đường chéo chính: ô `[0][1]` và `[1][0]` đều là 2, ô `[0][2]` và `[2][0]` đều là 3. Không ô nào lệch, nên cờ `is_symmetric` giữ nguyên `True` và máy in ĐỐI XỨNG.",
      expectOut: /^ĐỐI XỨNG$/,
      solution: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [2, 5, 6],\n    [3, 6, 9]\n]\nn = len(grid)\n\nis_symmetric = True\nfor row in range(n):\n    for col in range(n):\n        if grid[row][col] != grid[col][row]:\n            is_symmetric = False\n\nif is_symmetric:\n    say("ĐỐI XỨNG")\nelse:\n    say("KHÔNG ĐỐI XỨNG")\n',
    },
    {
      code: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [9, 5, 6],\n    [3, 6, 9]\n]\nn = len(grid)\n\nis_symmetric = True\nfor row in range(n):\n    for col in range(n):\n        if grid[row][col] != grid[row][col]:\n            is_symmetric = False\n\nif is_symmetric:\n    say("ĐỐI XỨNG")\nelse:\n    say("KHÔNG ĐỐI XỨNG")\n',
      label: "grid_symmetric_fix.py",
      note: "ĐỀ BÀI\nĐiều kiện đang so một ô với chính nó (`grid[row][col] != grid[row][col]`) nên không bao giờ đúng, cờ luôn giữ `True`. Bảng này lệch ở ô `[0][1]` là 2 nhưng `[1][0]` là 9. Sửa vế thứ hai thành ô đổi hàng-cột `grid[col][row]` để máy in KHÔNG ĐỐI XỨNG.",
      expectOut: /^KHÔNG ĐỐI XỨNG$/,
      solution: 'from old_computer import say\n\ngrid = [\n    [1, 2, 3],\n    [9, 5, 6],\n    [3, 6, 9]\n]\nn = len(grid)\n\nis_symmetric = True\nfor row in range(n):\n    for col in range(n):\n        if grid[row][col] != grid[col][row]:\n            is_symmetric = False\n\nif is_symmetric:\n    say("ĐỐI XỨNG")\nelse:\n    say("KHÔNG ĐỐI XỨNG")\n',
    },
    {
      checkpoint: {
        text: "Khi cần trả lời \"có phải MỌI ô đều thỏa điều kiện không\" mà chưa biết cách dừng sớm, dùng một biến cờ: đặt `is_symmetric = True` trước vòng lặp, rồi gán `is_symmetric = False` ngay khi gặp một ô lệch (`grid[row][col] != grid[col][row]`). Chỉ cần một ô lệch là cả bảng không đối xứng.",
      },
    },
    {
      quiz: {
        title: "Cờ đúng/sai cho cả bảng",
        questions: [
          {
            q: "Một bảng đối xứng nghĩa là mọi cặp ô gương bằng nhau. Cặp ô nào phải bằng nhau để bảng đối xứng?",
            a: ["`grid[row][col]` và `grid[col][row]`", "`grid[row][col]` và `grid[row][col]`", "`grid[0][0]` và `grid[n - 1][n - 1]`"],
            correct: 0,
          },
          {
            q: "Vì sao nên đặt cờ `is_symmetric = True` từ đầu rồi mới gán `is_symmetric = False` khi gặp ô lệch, thay vì ngược lại?",
            a: [
              "Vì chỉ cần một ô lệch là đủ kết luận không đối xứng, nên mặc định đúng rồi bắt lỗi sẽ gọn hơn",
              "Vì `True` chạy nhanh hơn `False`",
              "Vì Python không cho gán `False` trong vòng lặp",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── 7. Bảng có viền: 1 ở viền, 0 ở trong ──
    {
      npc: "Việc cuối: vẽ một bảng có VIỀN. Ô nằm ở mép ngoài — hàng đầu, hàng cuối, cột đầu, hoặc cột cuối — mang số 1; mọi ô bên trong mang số 0. Một ô là viền nếu THỎA một trong bốn điều kiện đó, nên mình nối chúng bằng `or`.",
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import pixel_display\n\ngrid = [\n    [0, 0, 0, 0],\n    [0, 0, 0, 0],\n    [0, 0, 0, 0]\n]\nrow_count = len(grid)\ncol_count = len(grid[0])\n\nfor row in range(row_count):\n    line = ""\n    for col in range(col_count):\n        if row == 0 or row == row_count - 1 or col == 0 or col == col_count - 1:\n            grid[row][col] = 1\n        line = line + str(grid[row][col])\n    say(line)\n\npixel_display(grid)\n',
      label: "grid_border_demo.py",
      note: "RUN KIỂM CHỨNG\nMột ô là viền nếu chạm một trong bốn cạnh. OUTPUT chính là khung 3×4 được tô trực tiếp trong vùng xem trước; ba dòng `1111`, `1001`, `1111` chỉ là kiểm chứng phụ cho từng hàng.",
      expectOut: { all: [/^1111$/, /^1001$/, /#/] },
      solution: 'from old_computer import say\nfrom camera_charm import pixel_display\n\ngrid = [\n    [0, 0, 0, 0],\n    [0, 0, 0, 0],\n    [0, 0, 0, 0]\n]\nrow_count = len(grid)\ncol_count = len(grid[0])\n\nfor row in range(row_count):\n    line = ""\n    for col in range(col_count):\n        if row == 0 or row == row_count - 1 or col == 0 or col == col_count - 1:\n            grid[row][col] = 1\n        line = line + str(grid[row][col])\n    say(line)\n\npixel_display(grid)\n',
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import pixel_display\n\ngrid = [\n    [0, 0, 0, 0],\n    [0, 0, 0, 0],\n    [0, 0, 0, 0]\n]\nrow_count = len(grid)\ncol_count = len(grid[0])\n\nfor row in range(row_count):\n    line = ""\n    for col in range(col_count):\n        if row == 0 or row == row_count - 1 or col == 0:\n            grid[row][col] = 1\n        line = line + str(grid[row][col])\n    say(line)\n\npixel_display(grid)\n',
      label: "grid_border_fix.py",
      note: "ĐỀ BÀI\nĐiều kiện đang thiếu cạnh phải, nên hình trong vùng xem trước bị hở. Thêm `or col == col_count - 1` để OUTPUT trở thành một khung kín; hàng giữa kiểm chứng phải là `1001`.",
      expectOut: { all: [/^1111$/, /^1001$/, /#/] },
      solution: 'from old_computer import say\nfrom camera_charm import pixel_display\n\ngrid = [\n    [0, 0, 0, 0],\n    [0, 0, 0, 0],\n    [0, 0, 0, 0]\n]\nrow_count = len(grid)\ncol_count = len(grid[0])\n\nfor row in range(row_count):\n    line = ""\n    for col in range(col_count):\n        if row == 0 or row == row_count - 1 or col == 0 or col == col_count - 1:\n            grid[row][col] = 1\n        line = line + str(grid[row][col])\n    say(line)\n\npixel_display(grid)\n',
    },
    {
      remember:
        "Ô viền của một bảng thỏa `row == 0 or row == row_count - 1 or col == 0 or col == col_count - 1`. Bốn điều kiện nối bằng `or` vì chỉ cần chạm MỘT cạnh bất kỳ là ô đó đã ở viền.",
    },
    {
      quiz: {
        title: "Ô nào là viền?",
        questions: [
          {
            q: "Bảng có `row_count = 3` và `col_count = 4`. Theo điều kiện `row == 0 or row == row_count - 1 or col == 0 or col == col_count - 1`, ô nào KHÔNG phải viền?",
            a: ["`grid[1][1]`", "`grid[0][2]`", "`grid[2][3]`"],
            correct: 0,
          },
          {
            q: "Vì sao bốn điều kiện viền phải nối bằng `or` chứ không phải `and`?",
            a: [
              "Vì một ô chỉ cần chạm một cạnh bất kỳ là đã ở viền, không cần chạm cả bốn",
              "Vì `and` không dùng được với số",
              "Vì `or` luôn cho kết quả True",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── Xưởng sáng tạo ──
    {
      npc: "Đến xưởng tự do rồi! Mọi phép toán bảng ở đây đều là cùng một khung quét lồng nhau — bạn chỉ cần đổi việc làm ở mỗi ô, và chọn xem ghi vào bảng mới hay sửa ngay bảng cũ. Thử pha trộn các ý tưởng bên dưới nhé.",
    },
    {
      code: 'from old_computer import say_num\n\n# xưởng của bạn — chọn một phép toán bảng rồi sửa bên dưới\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\ntotal = 0\nfor row in range(len(grid)):\n    for col in range(len(grid[row])):\n        total = total + grid[row][col]\n\nsay_num(total)\n',
      label: "grid_ops_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài hướng dễ bắt đầu:\n" +
        "• TRỪ HAI BẢNG — như phép cộng, đổi `+` thành `-` khi điền bảng `result`.\n" +
        "• CHIA ĐÔI — nhân vô hướng nhưng thay `* factor` bằng `/ 2`, sửa ngay bảng cũ.\n" +
        "• CHUYỂN VỊ BẢNG VUÔNG — `new_grid[col][row] = grid[row][col]` cho bảng 3x3.\n" +
        "• TÔ ĐƯỜNG CHÉO — dùng `if row == col:` để đặt số 1 dọc đường chéo chính.\n" +
        "• VIỀN HAI LỚP — mở rộng điều kiện viền để tô cả lớp ô thứ hai.",
    },
    {
      gift: {
        glyph: "⊞",
        name: "HUY HIỆU PHÉP TOÁN BẢNG",
        blurb: "phần thưởng cho việc cộng, nhân, chuyển vị, đổi hàng/cột, tính đường chéo, kiểm tra đối xứng và dựng viền cho cả một bảng",
        badge: true,
        badgeId: "huy_hieu_phep_toan_bang",
      },
    },
    {
      remember:
        "Mọi phép toán bảng đều là CÙNG MỘT kiểu quét lồng nhau — vòng ngoài đi từng hàng, vòng trong đi từng cột — chỉ khác việc làm ở mỗi ô. Câu hỏi thiết kế quan trọng nhất là: ghi kết quả vào một bảng MỚI dựng sẵn (như cộng bảng, chuyển vị), hay sửa NGAY trên bảng cũ (như nhân vô hướng, đổi cột)? Trả lời được câu đó là bạn viết được phép toán bảng bất kỳ.",
    },
  ],
};
