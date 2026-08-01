"""leet_backtrack — cụm đi thử rồi lùi lại (backtracking).

    from leet_backtrack import check

    def subsets(nums):
        ...

    check("subsets", subsets)

Cả cụm này trả về MỘT DANH SÁCH CÁC LỜI GIẢI, và thứ tự các lời giải luôn tự
do, nên không bài nào so bằng `==` thẳng được. `_norm_groups` chuẩn hoá: sắp
xếp danh sách ngoài, và với bài mà thứ tự bên trong cũng tự do (tập con, tổ
hợp) thì sắp xếp cả bên trong. Nó cũng bắt lỗi TRÙNG — hầu hết các bài ở đây
đòi kết quả không lặp, và một lời giải quên chặn nhánh trùng vẫn ra đủ đáp án
nhưng kèm bản sao.

Số lượng hoán vị phình theo giai thừa, nên các bài hoán vị chặn kích thước ca
ngẫu nhiên ở `PERM_CAP`; oracle liệt kê thẳng bằng itertools.

Bài đang có: combination-sum · combination-sum-ii · combination-sum-iii
· permutations · permutations-ii · subsets · subsets-ii · n-queens
· word-search-ii
"""

import itertools

from leet_judge import check, list_problems, problem

PERM_CAP = 6
QUEEN_CAP = 7
BOARD_LETTERS = "AB"
SMALL_COUNT = 40


def _norm_groups(value, sort_inner, unique=True):
    """Chuẩn hoá một danh sách các lời giải để so sánh."""
    if not isinstance(value, (list, tuple)):
        return "phải trả về một danh sách các lời giải"
    groups = []
    for item in value:
        if not isinstance(item, (list, tuple)):
            return "mỗi lời giải phải là một list"
        groups.append(tuple(sorted(item)) if sort_inner else tuple(item))
    if unique and len(set(groups)) != len(groups):
        return "kết quả có lời giải bị lặp — mỗi lời giải chỉ được xuất hiện một lần"
    return sorted(groups)


def _norm_sets(value):
    return _norm_groups(value, True)


def _norm_ordered(value):
    return _norm_groups(value, False)


# --- 78. Subsets --------------------------------------------------------------


def _gen_distinct(rng, size):
    return (rng.sample(range(-9, 10), min(max(size, 0), 9)),)


def _oracle_subsets(nums):
    out = []
    for size in range(len(nums) + 1):
        out.extend([list(combo) for combo in itertools.combinations(nums, size)])
    return out


problem(
    "subsets", title="78. Subsets",
    gen=_gen_distinct, oracle=_oracle_subsets, normalize=_norm_sets,
    cases=[([],), ([0],), ([1, 2, 3],), ([9, -1],)],
)


# --- 90. Subsets II -----------------------------------------------------------


def _gen_with_dups(rng, size):
    return ([rng.randint(0, 3) for _ in range(min(max(size, 0), 8))],)


def _oracle_subsets_ii(nums):
    found = set()
    for size in range(len(nums) + 1):
        for combo in itertools.combinations(nums, size):
            found.add(tuple(sorted(combo)))
    return [list(combo) for combo in found]


problem(
    "subsets-ii", title="90. Subsets II",
    gen=_gen_with_dups, oracle=_oracle_subsets_ii, normalize=_norm_sets,
    cases=[([],), ([1, 2, 2],), ([0],), ([2, 2, 2],), ([4, 4, 4, 1, 4],)],
)


# --- 46. Permutations ---------------------------------------------------------


def _gen_perm(rng, size):
    return (rng.sample(range(-9, 10), min(max(size, 1), PERM_CAP)),)


def _oracle_permutations(nums):
    return [list(order) for order in itertools.permutations(nums)]


problem(
    "permutations", title="46. Permutations",
    gen=_gen_perm, oracle=_oracle_permutations, normalize=_norm_ordered,
    cases=[([1],), ([0, 1],), ([1, 2, 3],)],
)


# --- 47. Permutations II ------------------------------------------------------


def _gen_perm_dups(rng, size):
    return ([rng.randint(0, 2) for _ in range(min(max(size, 1), PERM_CAP))],)


def _oracle_permutations_ii(nums):
    return [list(order) for order in set(itertools.permutations(nums))]


problem(
    "permutations-ii", title="47. Permutations II",
    gen=_gen_perm_dups, oracle=_oracle_permutations_ii, normalize=_norm_ordered,
    cases=[([1],), ([1, 1],), ([1, 1, 2],), ([1, 2, 3],), ([2, 2, 1, 1],)],
)


# --- 39. Combination Sum ------------------------------------------------------


def _gen_combination_sum(rng, size):
    candidates = rng.sample(range(2, 12), min(max(size, 1), 5))
    return (candidates, rng.randint(1, 16))


def _pick_with_repeats(candidates, target, start):
    """Liệt kê mọi cách cộng ra `target`, mỗi số dùng lại bao nhiêu lần cũng được."""
    if target == 0:
        return [[]]
    out = []
    for index in range(start, len(candidates)):
        value = candidates[index]
        if value <= target:
            for rest in _pick_with_repeats(candidates, target - value, index):
                out.append([value] + rest)
    return out


def _oracle_combination_sum(candidates, target):
    return _pick_with_repeats(sorted(candidates), target, 0)


problem(
    "combination-sum", title="39. Combination Sum",
    gen=_gen_combination_sum, oracle=_oracle_combination_sum, normalize=_norm_sets,
    cases=[([2, 3, 6, 7], 7), ([2, 3, 5], 8), ([2], 1), ([3], 9), ([7, 3, 2], 18)],
)


# --- 40. Combination Sum II ---------------------------------------------------


def _gen_combination_sum_ii(rng, size):
    candidates = [rng.randint(1, 8) for _ in range(min(max(size, 1), 8))]
    return (candidates, rng.randint(1, 14))


def _oracle_combination_sum_ii(candidates, target):
    found = set()
    for size in range(len(candidates) + 1):
        for combo in itertools.combinations(candidates, size):
            if sum(combo) == target:
                found.add(tuple(sorted(combo)))
    return [list(combo) for combo in found]


problem(
    "combination-sum-ii", title="40. Combination Sum II",
    gen=_gen_combination_sum_ii, oracle=_oracle_combination_sum_ii, normalize=_norm_sets,
    cases=[([10, 1, 2, 7, 6, 1, 5], 8), ([2, 5, 2, 1, 2], 5), ([1], 1), ([1], 2), ([], 0)],
)


# --- 216. Combination Sum III -------------------------------------------------


def _gen_combination_sum_iii(rng, size):
    return (rng.randint(1, 4), rng.randint(1, 25))


def _oracle_combination_sum_iii(k, n):
    out = []
    for combo in itertools.combinations(range(1, 10), k):
        if sum(combo) == n:
            out.append(list(combo))
    return out


problem(
    "combination-sum-iii", title="216. Combination Sum III",
    gen=_gen_combination_sum_iii, oracle=_oracle_combination_sum_iii, normalize=_norm_sets,
    cases=[(3, 7), (3, 9), (4, 1), (2, 17), (9, 45)],
)


# --- 51. N-Queens -------------------------------------------------------------


def _safe(columns):
    """Không hai hậu nào cùng cột hoặc cùng đường chéo."""
    for row, col in enumerate(columns):
        for other_row in range(row + 1, len(columns)):
            if abs(columns[other_row] - col) == other_row - row:
                return False
    return True


def _board(columns):
    side = len(columns)
    return ["." * col + "Q" + "." * (side - col - 1) for col in columns]


def _oracle_n_queens(n):
    """Thử mọi hoán vị cột — chắc chắn đúng, chỉ dùng được với n nhỏ."""
    return [_board(order) for order in itertools.permutations(range(n)) if _safe(order)]


def _gen_queens(rng, size):
    return (min(max(size, 1), QUEEN_CAP),)


problem(
    "n-queens", title="51. N-Queens",
    gen=_gen_queens, oracle=_oracle_n_queens, normalize=_norm_ordered,
    count=SMALL_COUNT, cases=[(1,), (2,), (3,), (4,)],
)


# --- 212. Word Search II ------------------------------------------------------
#
# Cách dò một từ giống bài 79 bên leet_matrix, nhưng chép lại chứ không import:
# mỗi bài học chỉ nạp đúng module của đảo mình vào Pyodide, nên leet_backtrack
# phải tự đứng được.


def _walk(board, word, row, col, index, used):
    if index == len(word):
        return True
    if not (0 <= row < len(board) and 0 <= col < len(board[0])):
        return False
    if (row, col) in used or board[row][col] != word[index]:
        return False
    if index + 1 == len(word):
        return True
    used.add((row, col))
    for step_row, step_col in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        if _walk(board, word, row + step_row, col + step_col, index + 1, used):
            used.discard((row, col))
            return True
    used.discard((row, col))
    return False


def _found(board, word):
    for row in range(len(board)):
        for col in range(len(board[0])):
            if _walk(board, word, row, col, 0, set()):
                return True
    return False


def _oracle_find_words(board, words):
    return [word for word in words if _found(board, word)]


def _gen_word_board(rng, size):
    rows, cols = max(1, size % 3 + 1), max(1, size % 3 + 1)
    board = [[rng.choice(BOARD_LETTERS) for _ in range(cols)] for _ in range(rows)]
    words = ["".join(rng.choice(BOARD_LETTERS) for _ in range(rng.randint(1, 4)))
             for _ in range(rng.randint(1, 4))]
    return (board, sorted(set(words)))


def _cap_find_words(args, ret):
    """Thứ tự từ tìm được tự do, và không được trả về từ ngoài danh sách."""
    words = args[1]
    if not isinstance(ret, (list, tuple)):
        return "phải trả về một list các từ"
    if len(set(ret)) != len(ret):
        return "một từ bị trả về nhiều lần"
    for word in ret:
        if word not in words:
            return "trả về từ " + repr(word) + " không có trong danh sách đã cho"
    return sorted(ret)


problem(
    "word-search-ii", title="212. Word Search II",
    gen=_gen_word_board, oracle=_oracle_find_words, capture=_cap_find_words,
    count=SMALL_COUNT,
    cases=[([["A"]], ["A", "B"]), ([["A", "B"], ["B", "A"]], ["AB", "ABA", "BB"])],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_subsets(nums):
    out = [[]]
    for value in nums:
        out += [group + [value] for group in out]
    return out


def _good_subsets_ii(nums):
    nums = sorted(nums)
    out = [[]]
    start = 0
    for index, value in enumerate(nums):
        begin = start if index and value == nums[index - 1] else 0
        start = len(out)
        out += [out[position] + [value] for position in range(begin, start)]
    return out


def _good_permutations(nums):
    if not nums:
        return [[]]
    out = []
    for index, value in enumerate(nums):
        for rest in _good_permutations(nums[:index] + nums[index + 1:]):
            out.append([value] + rest)
    return out


def _good_permutations_ii(nums):
    nums = sorted(nums)
    out = []
    for index, value in enumerate(nums):
        if index and value == nums[index - 1]:
            continue
        for rest in _good_permutations_ii(nums[:index] + nums[index + 1:]):
            out.append([value] + rest)
    return out or [[]]


def _good_combination_sum(candidates, target):
    return _pick_with_repeats(sorted(candidates), target, 0)


def _good_combination_sum_ii(candidates, target):
    candidates = sorted(candidates)
    out = []

    def walk(start, left, picked):
        if left == 0:
            out.append(list(picked))
            return
        for index in range(start, len(candidates)):
            if index > start and candidates[index] == candidates[index - 1]:
                continue
            if candidates[index] > left:
                break
            walk(index + 1, left - candidates[index], picked + [candidates[index]])

    walk(0, target, [])
    return out


def _good_combination_sum_iii(k, n):
    out = []

    def walk(start, left, picked):
        if len(picked) == k:
            if left == 0:
                out.append(list(picked))
            return
        for value in range(start, 10):
            if value > left:
                break
            walk(value + 1, left - value, picked + [value])

    walk(1, n, [])
    return out


def _good_n_queens(n):
    out = []

    def walk(columns):
        row = len(columns)
        if row == n:
            out.append(_board(columns))
            return
        for col in range(n):
            if all(other != col and abs(other - col) != row - index
                   for index, other in enumerate(columns)):
                walk(columns + [col])

    walk([])
    return out


def _good_find_words(board, words):
    return [word for word in words if _found(board, word)]


SAMPLES = {
    "subsets": {
        "good": _good_subsets,
        "hardcoded": lambda nums: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]],
        "wrong": lambda nums: [[value] for value in nums],
    },
    "subsets-ii": {
        "good": _good_subsets_ii,
        "hardcoded": lambda nums: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]],
        # Quên chặn nhánh trùng: đủ đáp án nhưng kèm bản sao.
        "wrong": _good_subsets,
    },
    "permutations": {
        "good": _good_permutations,
        "hardcoded": lambda nums: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
        "wrong": lambda nums: [list(nums)],
    },
    "permutations-ii": {
        "good": _good_permutations_ii,
        "hardcoded": lambda nums: [[1, 1, 2], [1, 2, 1], [2, 1, 1]],
        "wrong": _good_permutations,
    },
    "combination-sum": {
        "good": _good_combination_sum,
        "hardcoded": lambda candidates, target: [[2, 2, 3], [7]],
        "wrong": lambda candidates, target: [[value] for value in candidates if value == target],
    },
    "combination-sum-ii": {
        "good": _good_combination_sum_ii,
        "hardcoded": lambda candidates, target: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]],
        "wrong": lambda candidates, target: [],
    },
    "combination-sum-iii": {
        "good": _good_combination_sum_iii,
        "hardcoded": lambda k, n: [[1, 2, 4]],
        "wrong": lambda k, n: [[1] * k] if k == n else [],
    },
    "n-queens": {
        "good": _good_n_queens,
        "hardcoded": lambda n: [[".Q..", "...Q", "Q...", "..Q."],
                                ["..Q.", "Q...", "...Q", ".Q.."]],
        "wrong": lambda n: [],
    },
    "word-search-ii": {
        "good": _good_find_words,
        "hardcoded": lambda board, words: ["A"],
        "wrong": lambda board, words: list(words),
    },
}
