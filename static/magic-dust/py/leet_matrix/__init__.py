"""leet_matrix — cụm bài trên lưới hai chiều.

    from leet_matrix import check

    def rotate(matrix):
        ...

    check("rotate-image", rotate)

Ô trống của Sudoku ở đây là số `0`, không phải chuỗi `"."` như trên LeetCode —
lưới toàn số nguyên nên học sinh không phải đổi kiểu giữa chừng.

Hai bài Sudoku có `count` nhỏ hơn mặc định: mỗi ca đều phải dựng một lưới giải
được rồi khoét lỗ, và bài 37 còn phải giải lại bằng quay lui để đối chiếu.

Bài đang có: valid-sudoku · sudoku-solver · rotate-image · spiral-matrix
· spiral-matrix-ii · set-matrix-zeroes · word-search
"""

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"
SIDE = 9
BOX = 3
SUDOKU_COUNT = 12
WORD_COUNT = 60
LETTERS = "ABC"


def _cap_first_arg(args, ret):
    """Bài sửa tại chỗ: kết quả nằm trong lưới đã bị sửa."""
    return args[0]


def _grid(rng, rows, cols, low=-9, high=9):
    return [[rng.randint(low, high) for _ in range(cols)] for _ in range(rows)]


# --- Sudoku dùng chung --------------------------------------------------------


def _solved_board(rng):
    """Một lưới đã giải xong: dựng theo công thức rồi xáo cho khác nhau."""
    board = [[(BOX * (row % BOX) + row // BOX + col) % SIDE + 1
              for col in range(SIDE)] for row in range(SIDE)]
    digits = list(range(1, SIDE + 1))
    rng.shuffle(digits)
    board = [[digits[value - 1] for value in row] for row in board]
    for band in range(BOX):
        order = list(range(BOX))
        rng.shuffle(order)
        rows = [board[band * BOX + offset] for offset in order]
        board[band * BOX:band * BOX + BOX] = rows
    return board


def _punch(board, rng, holes):
    """Khoét `holes` ô thành 0."""
    spots = [(row, col) for row in range(SIDE) for col in range(SIDE)]
    rng.shuffle(spots)
    for row, col in spots[:holes]:
        board[row][col] = 0
    return board


def _groups(board):
    """Chín hàng, chín cột và chín ô vuông 3x3, bỏ qua ô trống."""
    for row in board:
        yield [value for value in row if value]
    for col in range(SIDE):
        yield [board[row][col] for row in range(SIDE) if board[row][col]]
    for band in range(BOX):
        for stack in range(BOX):
            cells = [board[band * BOX + row][stack * BOX + col]
                     for row in range(BOX) for col in range(BOX)]
            yield [value for value in cells if value]


def _oracle_valid_sudoku(board):
    for group in _groups(board):
        if len(set(group)) != len(group):
            return False
    return True


def _gen_valid_sudoku(rng, size):
    board = _punch(_solved_board(rng), rng, 30 + size)
    if rng.random() < 0.5:                      # cố ý làm hỏng một ô
        row, col = rng.randrange(SIDE), rng.randrange(SIDE)
        board[row][col] = rng.randint(1, SIDE)
    return (board,)


problem(
    "valid-sudoku", title="36. Valid Sudoku",
    gen=_gen_valid_sudoku, oracle=_oracle_valid_sudoku, count=SUDOKU_COUNT,
    cases=[([[0] * SIDE for _ in range(SIDE)],),
           ([[1 if (row, col) == (0, 0) or (row, col) == (0, 8) else 0
              for col in range(SIDE)] for row in range(SIDE)],)],
)


# --- 37. Sudoku Solver --------------------------------------------------------


def _solve(board):
    for row in range(SIDE):
        for col in range(SIDE):
            if board[row][col]:
                continue
            for value in range(1, SIDE + 1):
                board[row][col] = value
                if _oracle_valid_sudoku(board) and _solve(board):
                    return True
                board[row][col] = 0
            return False
    return True


def _oracle_solve_sudoku(board):
    _solve(board)


def _gen_sudoku_puzzle(rng, size):
    """Khoét ít lỗ thôi: lưới càng nhiều lỗ, quay lui để đối chiếu càng lâu."""
    return (_punch(_solved_board(rng), rng, 8 + size),)


def _cap_sudoku(args, ret):
    """Đề bảo đảm lời giải là duy nhất, nhưng vẫn chấm theo luật cho chắc:
    lưới phải đầy, hợp lệ, và không được sửa những ô đã cho sẵn."""
    board = args[0]
    if any(0 in row for row in board):
        return "còn ô trống — lưới chưa được điền hết"
    if not _oracle_valid_sudoku(board):
        return "lưới đã đầy nhưng có hàng, cột hoặc ô vuông 3x3 bị trùng số"
    return OK


problem(
    "sudoku-solver", title="37. Sudoku Solver",
    gen=_gen_sudoku_puzzle, oracle=_oracle_solve_sudoku, capture=_cap_sudoku,
    count=SUDOKU_COUNT,
)


# --- 48. Rotate Image ---------------------------------------------------------


def _gen_square(rng, size):
    side = max(1, size)
    return (_grid(rng, side, side),)


def _oracle_rotate_image(matrix):
    side = len(matrix)
    rotated = [[matrix[side - 1 - col][row] for col in range(side)] for row in range(side)]
    matrix[:] = rotated


problem(
    "rotate-image", title="48. Rotate Image",
    gen=_gen_square, oracle=_oracle_rotate_image, capture=_cap_first_arg,
    cases=[([[1]],), ([[1, 2], [3, 4]],), ([[1, 2, 3], [4, 5, 6], [7, 8, 9]],)],
)


# --- 54. Spiral Matrix --------------------------------------------------------


def _gen_rect(rng, size):
    return (_grid(rng, max(1, size % 5 + 1), max(1, size % 4 + 1)),)


def _oracle_spiral(matrix):
    """Bóc từng hàng trên cùng rồi xoay lưới còn lại — chậm nhưng khó sai."""
    rest = [list(row) for row in matrix]
    out = []
    while rest:
        out.extend(rest.pop(0))
        rest = [list(row) for row in zip(*rest)][::-1] if rest else []
    return out


problem(
    "spiral-matrix", title="54. Spiral Matrix",
    gen=_gen_rect, oracle=_oracle_spiral,
    cases=[([[1]],), ([[1, 2, 3], [4, 5, 6], [7, 8, 9]],),
           ([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],), ([[1], [2], [3]],)],
)


# --- 59. Spiral Matrix II -----------------------------------------------------


def _gen_side(rng, size):
    return (max(1, size),)


def _oracle_spiral_ii(n):
    """Dựng bằng cách đi theo hướng và quay phải khi chạm mép hoặc ô đã ghi."""
    matrix = [[0] * n for _ in range(n)]
    moves = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    row, col, facing = 0, 0, 0
    for value in range(1, n * n + 1):
        matrix[row][col] = value
        step_row, step_col = moves[facing]
        if not (0 <= row + step_row < n and 0 <= col + step_col < n
                and matrix[row + step_row][col + step_col] == 0):
            facing = (facing + 1) % len(moves)
            step_row, step_col = moves[facing]
        row, col = row + step_row, col + step_col
    return matrix


problem(
    "spiral-matrix-ii", title="59. Spiral Matrix II",
    gen=_gen_side, oracle=_oracle_spiral_ii,
    cases=[(1,), (2,), (3,), (4,)],
)


# --- 73. Set Matrix Zeroes ----------------------------------------------------


def _gen_zero_grid(rng, size):
    rows, cols = max(1, size % 5 + 1), max(1, size % 4 + 1)
    return ([[0 if rng.random() < 0.2 else rng.randint(1, 9) for _ in range(cols)]
             for _ in range(rows)],)


def _oracle_set_zeroes(matrix):
    zero_rows = {row for row, line in enumerate(matrix) if 0 in line}
    zero_cols = {col for line in matrix for col, value in enumerate(line) if value == 0}
    for row, line in enumerate(matrix):
        for col in range(len(line)):
            if row in zero_rows or col in zero_cols:
                matrix[row][col] = 0


problem(
    "set-matrix-zeroes", title="73. Set Matrix Zeroes",
    gen=_gen_zero_grid, oracle=_oracle_set_zeroes, capture=_cap_first_arg,
    cases=[([[1]],), ([[0]],), ([[1, 1, 1], [1, 0, 1], [1, 1, 1]],),
           ([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]],)],
)


# --- 79. Word Search ----------------------------------------------------------


def _gen_word_grid(rng, size):
    rows, cols = max(1, size % 4 + 1), max(1, size % 3 + 1)
    board = [[rng.choice(LETTERS) for _ in range(cols)] for _ in range(rows)]
    word = "".join(rng.choice(LETTERS) for _ in range(rng.randint(1, 4)))
    return (board, word)


def _walk(board, word, row, col, index, used):
    if index == len(word):
        return True
    if not (0 <= row < len(board) and 0 <= col < len(board[0])):
        return False
    if (row, col) in used or board[row][col] != word[index]:
        return False
    used.add((row, col))
    for step_row, step_col in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        if _walk(board, word, row + step_row, col + step_col, index + 1, used):
            used.discard((row, col))
            return True
    if index + 1 == len(word):
        used.discard((row, col))
        return True
    used.discard((row, col))
    return False


def _oracle_word_search(board, word):
    for row in range(len(board)):
        for col in range(len(board[0])):
            if _walk(board, word, row, col, 0, set()):
                return True
    return False


problem(
    "word-search", title="79. Word Search",
    gen=_gen_word_grid, oracle=_oracle_word_search, count=WORD_COUNT,
    cases=[([["A"]], "A"), ([["A"]], "B"),
           ([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"),
           ([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB")],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_valid_sudoku(board):
    for group in _groups(board):
        if len(set(group)) != len(group):
            return False
    return True


def _good_solve_sudoku(board):
    _solve(board)


def _good_rotate_image(matrix):
    side = len(matrix)
    for row in range(side):
        for col in range(row + 1, side):
            matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]
    for row in matrix:
        row.reverse()


def _good_spiral(matrix):
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


def _good_spiral_ii(n):
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


def _good_set_zeroes(matrix):
    zero_rows = {row for row, line in enumerate(matrix) if 0 in line}
    zero_cols = {col for line in matrix for col, value in enumerate(line) if value == 0}
    for row, line in enumerate(matrix):
        for col in range(len(line)):
            if row in zero_rows or col in zero_cols:
                matrix[row][col] = 0


def _good_word_search(board, word):
    return _oracle_word_search(board, word)


def _wrong_rotate_image(matrix):
    """Xoay ngược chiều — đúng hình dạng, sai hướng."""
    side = len(matrix)
    matrix[:] = [[matrix[col][side - 1 - row] for col in range(side)] for row in range(side)]


def _wrong_set_zeroes(matrix):
    """Quét tới đâu xoá tới đó, nên số 0 mới đẻ ra số 0 khác."""
    for row, line in enumerate(matrix):
        for col, value in enumerate(line):
            if value == 0:
                for other in range(len(line)):
                    matrix[row][other] = 0
                for other in range(len(matrix)):
                    matrix[other][col] = 0


SAMPLES = {
    "valid-sudoku": {
        "good": _good_valid_sudoku,
        "hardcoded": lambda board: True,
        "wrong": lambda board: False,
    },
    "sudoku-solver": {
        "good": _good_solve_sudoku,
        "hardcoded": lambda board: None,
        "wrong": lambda board: board.__setitem__(
            slice(None), [[(col + 1) for col in range(SIDE)] for _ in range(SIDE)]),
    },
    "rotate-image": {
        "good": _good_rotate_image,
        "hardcoded": lambda matrix: matrix.__setitem__(slice(None), [[3, 1], [4, 2]]),
        "wrong": _wrong_rotate_image,
    },
    "spiral-matrix": {
        "good": _good_spiral,
        "hardcoded": lambda matrix: [1, 2, 3, 6, 9, 8, 7, 4, 5],
        "wrong": lambda matrix: [value for row in matrix for value in row],
    },
    "spiral-matrix-ii": {
        "good": _good_spiral_ii,
        "hardcoded": lambda n: [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
        "wrong": lambda n: [[row * n + col + 1 for col in range(n)] for row in range(n)],
    },
    "set-matrix-zeroes": {
        "good": _good_set_zeroes,
        "hardcoded": lambda matrix: None,
        "wrong": _wrong_set_zeroes,
    },
    "word-search": {
        "good": _good_word_search,
        "hardcoded": lambda board, word: True,
        "wrong": lambda board, word: any(word[0] == cell for row in board for cell in row),
    },
}
