// Đảo luyện tập LeetCode — cụm lưới hai chiều. Chấm bằng py/leet_judge.
// Ô trống của Sudoku ở đây là số 0 chứ không phải chuỗi ".", để cả lưới chỉ có
// một kiểu dữ liệu; xem py/leet_matrix.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ SÂN GẠCH VUÔNG ✦",
    hook: "Bảy bài trên một tấm lưới. Cái khó của lưới không nằm ở thuật toán mà ở chỗ dễ lẫn: `matrix[row][col]` — hàng đứng trước, cột đứng sau. Đổi chỗ hai cái đó thì code vẫn chạy, vẫn ra một lưới trông có vẻ hợp lý, và sai.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Lưới ở đây luôn là list của các list. `len(matrix)` cho số HÀNG, còn `len(matrix[0])` cho số CỘT. Lưới không phải lúc nào cũng vuông, nên đừng dùng chung một con số cho cả hai." },

  task("spiral-matrix", "spiral_matrix.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là list các hàng, mỗi hàng là một list số. Lưới có thể không vuông.\nPROCESS: viết hàm `spiral_order(matrix)` đọc các số theo đường xoắn ốc: hết hàng trên cùng từ trái sang phải, xuống cột phải ngoài cùng, ngược hàng dưới cùng từ phải sang trái, lên cột trái ngoài cùng, rồi lặp lại với phần lưới còn lại bên trong.\nOUTPUT: trả về list các số theo đúng thứ tự đọc được.\nVí dụ: `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]` cho `[1, 2, 3, 6, 9, 8, 7, 4, 5]`. Lưới một cột `[[1], [2], [3]]` cho `[1, 2, 3]`.",
    `from leet_matrix import check


def spiral_order(matrix):
    # lượt của bạn
    return []


check("spiral-matrix", spiral_order)
`,
    `from leet_matrix import check


def spiral_order(matrix):
    out = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            out.append(matrix[top][col])
        top += 1
        for row in range(top, bottom + 1):
            out.append(matrix[row][right])
        right -= 1
        if top <= bottom:
            for col in range(right, left - 1, -1):
                out.append(matrix[bottom][col])
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                out.append(matrix[row][left])
            left += 1
    return out


check("spiral-matrix", spiral_order)
`),

  { checkpoint: { text: "Vòng xoắn ốc giữ bốn biên `top`, `bottom`, `left`, `right`, và mỗi lượt đi xong một cạnh thì thu biên đó vào. Hai cạnh cuối của mỗi vòng phải hỏi lại `if top <= bottom` và `if left <= right`: khi phần còn lại chỉ có một hàng hoặc một cột, cạnh đó đã được đi ở lượt trước và đi lại sẽ ghi trùng." } },

  { quiz: { title: "Vì sao xoắn ốc ghi trùng", questions: [
    { q: "Với `matrix = [[1, 2, 3]]` — một hàng duy nhất — sau khi đi xong cạnh trên thì `top` thành `1` còn `bottom` vẫn là `0`. Nếu KHÔNG có `if top <= bottom` trước cạnh dưới thì kết quả ra sao?",
      a: ["Cạnh dưới đi lại chính hàng đó theo chiều ngược, nên list có thêm `3, 2, 1` thừa", "Máy báo lỗi vì `bottom` nhỏ hơn `top`", "Kết quả vẫn đúng, chỉ chậm hơn", "Vòng `while` dừng ngay lập tức"], correct: 0 },
    { q: "Trong `matrix[row][col]`, chỉ số nào đứng trước?",
      a: ["`row` — chọn hàng trước, rồi mới chọn ô trong hàng đó", "`col` — chọn cột trước", "Cái nào trước cũng được", "Tuỳ lưới vuông hay không"], correct: 0 },
  ] } },

  task("spiral-matrix-ii", "spiral_matrix_ii.py",
    "ĐỀ BÀI\nCho sẵn một số nguyên dương `n`.\nPROCESS: viết hàm `generate_matrix(n)` dựng lưới vuông `n` hàng `n` cột, điền các số từ `1` tới `n * n` theo đúng đường xoắn ốc: từ góc trên trái, sang phải, xuống, sang trái, lên, rồi vòng vào trong.\nOUTPUT: trả về lưới đó dưới dạng list các hàng.\nVí dụ: `n = 3` cho `[[1, 2, 3], [8, 9, 4], [7, 6, 5]]`. `n = 1` cho `[[1]]`.",
    `from leet_matrix import check


def generate_matrix(n):
    # lượt của bạn
    return []


check("spiral-matrix-ii", generate_matrix)
`,
    `from leet_matrix import check


def generate_matrix(n):
    matrix = [[0] * n for _ in range(n)]
    top, bottom, left, right, value = 0, n - 1, 0, n - 1, 1
    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            matrix[top][col] = value
            value += 1
        top += 1
        for row in range(top, bottom + 1):
            matrix[row][right] = value
            value += 1
        right -= 1
        if top <= bottom:
            for col in range(right, left - 1, -1):
                matrix[bottom][col] = value
                value += 1
            bottom -= 1
        if left <= right:
            for row in range(bottom, top - 1, -1):
                matrix[row][left] = value
                value += 1
            left += 1
    return matrix


check("spiral-matrix-ii", generate_matrix)
`),

  task("rotate-image", "rotate_image.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là lưới VUÔNG các số.\nPROCESS: viết hàm `rotate(matrix)` xoay lưới 90 độ theo chiều KIM ĐỒNG HỒ, sửa thẳng trên `matrix`. Không được tạo lưới mới rồi trả về nó.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `matrix` sau khi hàm chạy xong.\nVí dụ: `[[1, 2], [3, 4]]` thành `[[3, 1], [4, 2]]` — hàng đầu tiên của kết quả chính là cột đầu tiên của lưới cũ đọc từ dưới lên.",
    `from leet_matrix import check


def rotate(matrix):
    # lượt của bạn
    pass


check("rotate-image", rotate)
`,
    `from leet_matrix import check


def rotate(matrix):
    side = len(matrix)
    for row in range(side):
        for col in range(row + 1, side):
            matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]
    for row in matrix:
        row.reverse()


check("rotate-image", rotate)
`),

  { checkpoint: { text: "Xoay lưới vuông tại chỗ làm được bằng hai bước đơn giản hơn: lật qua đường chéo (đổi chỗ `matrix[row][col]` với `matrix[col][row]`), rồi đảo ngược từng hàng. Vòng lật chéo phải cho `col` chạy từ `row + 1`, vì nếu cho chạy từ `0` thì mỗi cặp bị đổi hai lần và lưới trở về như cũ." } },

  { quiz: { title: "Lật chéo hai lần thành không lật", questions: [
    { q: "Đoạn lật qua đường chéo viết `for col in range(row + 1, side)`. Nếu đổi thành `range(side)` thì lưới ra sao?",
      a: ["Mỗi cặp ô bị đổi chỗ hai lần nên lưới quay về đúng như ban đầu", "Máy báo lỗi vượt ngoài lưới", "Chỉ nửa trên của lưới bị lật", "Lưới bị lật theo đường chéo còn lại"], correct: 0 },
    { q: "Sau khi lật qua đường chéo, `[[1, 2], [3, 4]]` thành `[[1, 3], [2, 4]]`. Cần làm gì tiếp để ra kết quả xoay theo chiều kim đồng hồ là `[[3, 1], [4, 2]]`?",
      a: ["Đảo ngược từng hàng", "Đảo ngược thứ tự các hàng", "Lật qua đường chéo thêm lần nữa", "Đổi chỗ hàng đầu với hàng cuối"], correct: 0 },
  ] } },

  task("set-matrix-zeroes", "set_matrix_zeroes.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là lưới các số, có thể không vuông.\nPROCESS: viết hàm `set_zeroes(matrix)`: với MỖI ô đang mang giá trị `0` TRONG LƯỚI BAN ĐẦU, đặt cả hàng và cả cột chứa ô đó thành `0`. Sửa thẳng trên `matrix`.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `matrix` sau khi hàm chạy xong.\nVí dụ: `[[1, 1, 1], [1, 0, 1], [1, 1, 1]]` thành `[[1, 0, 1], [0, 0, 0], [1, 0, 1]]`.\nBẫy: nếu vừa quét vừa xoá thì những số `0` bạn mới ghi ra sẽ bị đọc nhầm thành số `0` có sẵn, và cả lưới thành `0` hết.",
    `from leet_matrix import check


def set_zeroes(matrix):
    # lượt của bạn
    pass


check("set-matrix-zeroes", set_zeroes)
`,
    `from leet_matrix import check


def set_zeroes(matrix):
    zero_rows = {row for row, line in enumerate(matrix) if 0 in line}
    zero_cols = {col for line in matrix for col, value in enumerate(line) if value == 0}
    for row, line in enumerate(matrix):
        for col in range(len(line)):
            if row in zero_rows or col in zero_cols:
                matrix[row][col] = 0


check("set-matrix-zeroes", set_zeroes)
`),

  task("valid-sudoku", "valid_sudoku.py",
    "ĐỀ BÀI\nCho sẵn `board` là lưới 9 hàng 9 cột các số nguyên; ô trống mang giá trị `0`, ô đã điền mang giá trị từ `1` tới `9`.\nPROCESS: viết hàm `is_valid_sudoku(board)` kiểm tra lưới có hợp lệ không. Hợp lệ nghĩa là trong mỗi hàng, mỗi cột, và mỗi ô vuông 3x3, các số ĐÃ ĐIỀN không được trùng nhau. Ô trống bỏ qua, và lưới KHÔNG cần điền đủ.\nOUTPUT: trả về `True` hoặc `False`.\nVí dụ: lưới toàn số `0` là hợp lệ. Lưới có hai số `1` cùng nằm ở hàng đầu là không hợp lệ.\nGợi ý về ô vuông 3x3: ô ở `(row, col)` thuộc ô vuông thứ `row // 3` theo chiều dọc và `col // 3` theo chiều ngang.",
    `from leet_matrix import check


def is_valid_sudoku(board):
    # lượt của bạn
    return True


check("valid-sudoku", is_valid_sudoku)
`,
    `from leet_matrix import check


def is_valid_sudoku(board):
    groups = []
    for row in board:
        groups.append([value for value in row if value])
    for col in range(9):
        groups.append([board[row][col] for row in range(9) if board[row][col]])
    for band in range(3):
        for stack in range(3):
            cells = [board[band * 3 + row][stack * 3 + col]
                     for row in range(3) for col in range(3)]
            groups.append([value for value in cells if value])
    for group in groups:
        if len(set(group)) != len(group):
            return False
    return True


check("valid-sudoku", is_valid_sudoku)
`),

  task("word-search", "word_search.py",
    "ĐỀ BÀI\nCho sẵn `board` là lưới các chữ cái (mỗi ô là một chuỗi một ký tự) và một chuỗi `word`.\nPROCESS: viết hàm `exist(board, word)` xét xem có đi được một đường trong lưới đánh vần đúng `word` hay không. Mỗi bước chỉ được sang ô kề cạnh theo bốn hướng trên, dưới, trái, phải — không đi chéo — và MỘT Ô KHÔNG ĐƯỢC DÙNG LẠI trong cùng một đường.\nOUTPUT: trả về `True` hoặc `False`.\nVí dụ: với `board = [[\"A\", \"B\", \"C\", \"E\"], [\"S\", \"F\", \"C\", \"S\"], [\"A\", \"D\", \"E\", \"E\"]]` thì `word = \"ABCCED\"` cho `True`, còn `word = \"ABCB\"` cho `False` vì phải dùng lại ô chữ `B`.",
    `from leet_matrix import check


def exist(board, word):
    # lượt của bạn
    return False


check("word-search", exist)
`,
    `from leet_matrix import check


def exist(board, word):
    rows, cols = len(board), len(board[0])

    def walk(row, col, index, used):
        if index == len(word):
            return True
        if not (0 <= row < rows and 0 <= col < cols):
            return False
        if (row, col) in used or board[row][col] != word[index]:
            return False
        used.add((row, col))
        for step_row, step_col in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            if walk(row + step_row, col + step_col, index + 1, used):
                used.discard((row, col))
                return True
        found = index + 1 == len(word)
        used.discard((row, col))
        return found

    for row in range(rows):
        for col in range(cols):
            if walk(row, col, 0, set()):
                return True
    return False


check("word-search", exist)
`),

  { npc: "Bài cuối là bài nặng nhất: điền cả một lưới Sudoku. Vẫn cách đi thử rồi lùi lại, chỉ khác là mỗi ô có chín lựa chọn thay vì bốn hướng." },

  task("sudoku-solver", "sudoku_solver.py",
    "ĐỀ BÀI\nCho sẵn `board` là lưới Sudoku 9 hàng 9 cột các số nguyên, ô trống mang giá trị `0`. Lưới luôn giải được.\nPROCESS: viết hàm `solve_sudoku(board)` điền hết các ô trống sao cho mỗi hàng, mỗi cột và mỗi ô vuông 3x3 chứa đủ chín số từ `1` tới `9` không trùng nhau. Sửa thẳng trên `board`.\nCÁCH LÀM: tìm một ô trống, thử lần lượt các số từ `1` tới `9`; số nào không phạm luật thì đặt vào rồi gọi lại chính hàm này để giải phần còn lại. Nếu phần còn lại bế tắc thì trả ô đó về `0` và thử số tiếp theo.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `board` sau khi hàm chạy xong, và đòi lưới phải đầy, hợp lệ.",
    `from leet_matrix import check


def solve_sudoku(board):
    # lượt của bạn
    pass


check("sudoku-solver", solve_sudoku)
`,
    `from leet_matrix import check


def allowed(board, row, col, value):
    for index in range(9):
        if board[row][index] == value or board[index][col] == value:
            return False
    band, stack = row // 3 * 3, col // 3 * 3
    for step_row in range(3):
        for step_col in range(3):
            if board[band + step_row][stack + step_col] == value:
                return False
    return True


def solve_sudoku(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] != 0:
                continue
            for value in range(1, 10):
                if allowed(board, row, col, value):
                    board[row][col] = value
                    if solve_sudoku(board):
                        return True
                    board[row][col] = 0
            return False
    return True


check("sudoku-solver", solve_sudoku)
`),

  { remember: "Bảy bài trên lưới chia hai nhóm. Nhóm đi theo biên — xoắn ốc, xoay hình — chỉ cần giữ đúng bốn mép và nhớ thu mép lại sau mỗi cạnh. Nhóm đi thử rồi lùi — đánh vần chữ, điền Sudoku — luôn có cùng ba phần: đặt một lựa chọn xuống, gọi lại chính hàm đó cho phần còn lại, và nếu bế tắc thì DỌN LẠI đúng thứ vừa đặt trước khi thử lựa chọn khác. Quên bước dọn là chỗ hỏng thường gặp nhất." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · LƯỚI",
  sideIslandId: "leet-matrix",
  completionKey: "magicdust.leet.set.matrix",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Sân Gạch Vuông",
  subtitle: "bảy bài trên lưới hai chiều, từ xoắn ốc tới điền Sudoku",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ LƯỚI" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "dựng lưới thử rồi đối chiếu với lời giải chậm mà chắc đúng" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_matrix: "../py/leet_matrix/__init__.py",
  },
  cells,
  finish: { title: "SÂN GẠCH ĐÃ SẠCH", sub: "bảy bài trên lưới, kể cả lưới Sudoku điền kín", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
