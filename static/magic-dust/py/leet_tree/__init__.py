"""leet_tree — cụm cây nhị phân và lan trên lưới.

    from leet_tree import check

    def num_islands(grid):
        ...

    check("number-of-islands", num_islands)

CÁCH BIỂU DIỄN CÂY: một nút là list `[giá_trị, cây_con_trái, cây_con_phải]`, và
cây rỗng là `None`. Không dùng class như trên LeetCode, để cây so sánh được
bằng `==` và sao chép được bằng `deepcopy`.

    [3, [9, None, None], [20, [15, None, None], [7, None, None]]]

Oracle của hai bài dựng cây liệt kê MỌI cây nhị phân có thứ tự giữa cho trước
rồi chọn cây khớp — chậm theo số Catalan nên ca ngẫu nhiên phải nhỏ, nhưng bù
lại nó thật sự độc lập với lời giải cắt-mảng mà học sinh viết.

Bài đang có: build-tree-pre-in · build-tree-in-post · sorted-array-to-bst
· surrounded-regions · number-of-islands · missing-ranges
"""

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"
TREE_CAP = 7
SMALL_COUNT = 40


def _all_trees(values):
    """Mọi cây nhị phân có thứ tự giữa đúng bằng `values`."""
    if not values:
        yield None
        return
    for index in range(len(values)):
        for left in _all_trees(values[:index]):
            for right in _all_trees(values[index + 1:]):
                yield [values[index], left, right]


def _preorder(tree):
    if tree is None:
        return []
    return [tree[0]] + _preorder(tree[1]) + _preorder(tree[2])


def _inorder(tree):
    if tree is None:
        return []
    return _inorder(tree[1]) + [tree[0]] + _inorder(tree[2])


def _postorder(tree):
    if tree is None:
        return []
    return _postorder(tree[1]) + _postorder(tree[2]) + [tree[0]]


def _random_tree(rng, values):
    if not values:
        return None
    cut = rng.randrange(len(values))
    return [values[cut], _random_tree(rng, values[:cut]), _random_tree(rng, values[cut + 1:])]


def _tree_values(rng, size):
    return rng.sample(range(-20, 20), min(max(size, 0), TREE_CAP))


# --- 105. Construct Binary Tree from Preorder and Inorder ---------------------


def _gen_pre_in(rng, size):
    tree = _random_tree(rng, _tree_values(rng, size))
    return (_preorder(tree), _inorder(tree))


def _oracle_build_pre_in(preorder, inorder):
    for tree in _all_trees(inorder):
        if _preorder(tree) == preorder:
            return tree
    return None


problem(
    "build-tree-pre-in", title="105. Construct Binary Tree from Preorder and Inorder Traversal",
    gen=_gen_pre_in, oracle=_oracle_build_pre_in, count=SMALL_COUNT,
    cases=[([], []), ([1], [1]), ([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]),
           ([1, 2], [2, 1]), ([1, 2], [1, 2])],
)


# --- 106. Construct Binary Tree from Inorder and Postorder --------------------


def _gen_in_post(rng, size):
    tree = _random_tree(rng, _tree_values(rng, size))
    return (_inorder(tree), _postorder(tree))


def _oracle_build_in_post(inorder, postorder):
    for tree in _all_trees(inorder):
        if _postorder(tree) == postorder:
            return tree
    return None


problem(
    "build-tree-in-post", title="106. Construct Binary Tree from Inorder and Postorder Traversal",
    gen=_gen_in_post, oracle=_oracle_build_in_post, count=SMALL_COUNT,
    cases=[([], []), ([1], [1]), ([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]),
           ([2, 1], [2, 1]), ([1, 2], [2, 1])],
)


# --- 108. Convert Sorted Array to Binary Search Tree --------------------------


def _gen_sorted(rng, size):
    return (sorted(rng.sample(range(-30, 30), min(max(size, 0), 12))),)


def _height(tree):
    if tree is None:
        return 0
    return 1 + max(_height(tree[1]), _height(tree[2]))


def _balanced(tree):
    if tree is None:
        return True
    if abs(_height(tree[1]) - _height(tree[2])) > 1:
        return False
    return _balanced(tree[1]) and _balanced(tree[2])


def _oracle_sorted_to_bst(nums):
    if not nums:
        return None
    middle = len(nums) // 2
    return [nums[middle], _oracle_sorted_to_bst(nums[:middle]),
            _oracle_sorted_to_bst(nums[middle + 1:])]


def _cap_bst(args, ret):
    """Bài này có nhiều cây đúng, nên chấm theo LUẬT chứ không so với một cây."""
    nums = args[0]
    if _inorder(ret) != nums:
        return "đọc cây theo thứ tự giữa phải ra đúng list ban đầu"
    if not _balanced(ret):
        return "cây chưa cân bằng — có nút mà hai cây con lệch nhau quá một tầng"
    return OK


problem(
    "sorted-array-to-bst", title="108. Convert Sorted Array to Binary Search Tree",
    gen=_gen_sorted, oracle=_oracle_sorted_to_bst, capture=_cap_bst,
    cases=[([],), ([0],), ([-10, -3, 0, 5, 9],), ([1, 3],), ([1, 2, 3, 4, 5, 6, 7],)],
)


# --- 200. Number of Islands ---------------------------------------------------


def _gen_island_grid(rng, size):
    rows = max(1, size % 5 + 1)
    cols = max(1, size % 4 + 1)
    return ([["1" if rng.random() < 0.55 else "0" for _ in range(cols)]
             for _ in range(rows)],)


def _oracle_num_islands(grid):
    """Gán cho mỗi ô đất một số riêng rồi cho hàng xóm lấy số nhỏ nhất, lặp tới
    khi ổn định. Bao nhiêu số còn sót lại là bấy nhiêu đảo."""
    rows, cols = len(grid), len(grid[0])
    label = [[row * cols + col if grid[row][col] == "1" else None
              for col in range(cols)] for row in range(rows)]
    changed = True
    while changed:
        changed = False
        for row in range(rows):
            for col in range(cols):
                if label[row][col] is None:
                    continue
                for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                    r, c = row + dr, col + dc
                    if 0 <= r < rows and 0 <= c < cols and label[r][c] is not None \
                            and label[r][c] < label[row][col]:
                        label[row][col] = label[r][c]
                        changed = True
    return len({label[row][col] for row in range(rows) for col in range(cols)
                if label[row][col] is not None})


problem(
    "number-of-islands", title="200. Number of Islands",
    gen=_gen_island_grid, oracle=_oracle_num_islands,
    cases=[([["0"]],), ([["1"]],),
           ([["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"],
             ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]],),
           ([["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]],)],
)


# --- 130. Surrounded Regions --------------------------------------------------


def _gen_region_grid(rng, size):
    rows = max(1, size % 5 + 1)
    cols = max(1, size % 4 + 1)
    return ([["O" if rng.random() < 0.5 else "X" for _ in range(cols)]
             for _ in range(rows)],)


def _oracle_surround(board):
    """Đánh dấu lan từ mép vào, ô O nào không tới được thì bị lấp."""
    rows, cols = len(board), len(board[0])
    safe = set()
    for row in range(rows):
        for col in range(cols):
            if board[row][col] == "O" and (row in (0, rows - 1) or col in (0, cols - 1)):
                safe.add((row, col))
    changed = True
    while changed:
        changed = False
        for row, col in list(safe):
            for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                r, c = row + dr, col + dc
                if 0 <= r < rows and 0 <= c < cols and board[r][c] == "O" \
                        and (r, c) not in safe:
                    safe.add((r, c))
                    changed = True
    for row in range(rows):
        for col in range(cols):
            if board[row][col] == "O" and (row, col) not in safe:
                board[row][col] = "X"


def _cap_first_arg(args, ret):
    return args[0]


problem(
    "surrounded-regions", title="130. Surrounded Regions",
    gen=_gen_region_grid, oracle=_oracle_surround, capture=_cap_first_arg,
    cases=[([["O"]],), ([["X"]],),
           ([["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"],
             ["X", "O", "X", "X"]],),
           ([["O", "O"], ["O", "O"]],)],
)


# --- 163. Missing Ranges ------------------------------------------------------


def _gen_missing(rng, size):
    lower = rng.randint(-5, 5)
    upper = lower + rng.randint(0, 20)
    nums = sorted(rng.sample(range(lower, upper + 1),
                             min(max(size, 0), upper - lower + 1)))
    return (nums, lower, upper)


def _oracle_missing_ranges(nums, lower, upper):
    """Đánh dấu từng số nguyên trong đoạn rồi gom các số vắng thành khoảng."""
    present = set(nums)
    out = []
    for value in range(lower, upper + 1):
        if value in present:
            continue
        if out and out[-1][1] == value - 1:
            out[-1][1] = value
        else:
            out.append([value, value])
    return out


problem(
    "missing-ranges", title="163. Missing Ranges",
    gen=_gen_missing, oracle=_oracle_missing_ranges,
    cases=[([], 1, 1), ([], 1, 5), ([0, 1, 3, 50, 75], 0, 99), ([-1], -1, -1),
           ([1, 2, 3], 1, 3)],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_build_pre_in(preorder, inorder):
    if not preorder:
        return None
    cut = inorder.index(preorder[0])
    return [preorder[0],
            _good_build_pre_in(preorder[1:cut + 1], inorder[:cut]),
            _good_build_pre_in(preorder[cut + 1:], inorder[cut + 1:])]


def _good_build_in_post(inorder, postorder):
    if not inorder:
        return None
    cut = inorder.index(postorder[-1])
    return [postorder[-1],
            _good_build_in_post(inorder[:cut], postorder[:cut]),
            _good_build_in_post(inorder[cut + 1:], postorder[cut:-1])]


def _good_num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    seen = set()
    found = 0
    for row in range(rows):
        for col in range(cols):
            if grid[row][col] != "1" or (row, col) in seen:
                continue
            found += 1
            todo = [(row, col)]
            seen.add((row, col))
            while todo:
                r, c = todo.pop()
                for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1" \
                            and (nr, nc) not in seen:
                        seen.add((nr, nc))
                        todo.append((nr, nc))
    return found


def _good_surround(board):
    rows, cols = len(board), len(board[0])
    todo = [(row, col) for row in range(rows) for col in range(cols)
            if board[row][col] == "O" and (row in (0, rows - 1) or col in (0, cols - 1))]
    safe = set(todo)
    while todo:
        row, col = todo.pop()
        for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            r, c = row + dr, col + dc
            if 0 <= r < rows and 0 <= c < cols and board[r][c] == "O" and (r, c) not in safe:
                safe.add((r, c))
                todo.append((r, c))
    for row in range(rows):
        for col in range(cols):
            if board[row][col] == "O" and (row, col) not in safe:
                board[row][col] = "X"


def _good_missing_ranges(nums, lower, upper):
    out = []
    edge = lower
    for value in list(nums) + [upper + 1]:
        if value > edge:
            out.append([edge, value - 1])
        edge = value + 1
    return out


SAMPLES = {
    "build-tree-pre-in": {
        "good": _good_build_pre_in,
        "hardcoded": lambda preorder, inorder: [3, [9, None, None],
                                                [20, [15, None, None], [7, None, None]]],
        # Xếp mọi nút thành một chuỗi bên trái, bỏ qua thứ tự giữa.
        "wrong": lambda preorder, inorder: None,
    },
    "build-tree-in-post": {
        "good": _good_build_in_post,
        "hardcoded": lambda inorder, postorder: [3, [9, None, None],
                                                 [20, [15, None, None], [7, None, None]]],
        "wrong": lambda inorder, postorder: None,
    },
    "sorted-array-to-bst": {
        "good": _oracle_sorted_to_bst,
        "hardcoded": lambda nums: [0, [-10, None, [-3, None, None]],
                                   [5, None, [9, None, None]]],
        # Cứ nối thành một chuỗi dài: vẫn đúng thứ tự giữa nhưng không cân bằng.
        "wrong": lambda nums: None if not nums else
                 [nums[0], None, _chain(nums[1:])],
    },
    "number-of-islands": {
        "good": _good_num_islands,
        "hardcoded": lambda grid: 3,
        # Đếm mọi ô đất thay vì đếm cụm.
        "wrong": lambda grid: sum(row.count("1") for row in grid),
    },
    "surrounded-regions": {
        "good": _good_surround,
        "hardcoded": lambda board: None,
        # Lấp mọi ô O, kể cả những ô chạm mép.
        "wrong": lambda board: board.__setitem__(
            slice(None), [["X"] * len(board[0]) for _ in board]),
    },
    "missing-ranges": {
        "good": _good_missing_ranges,
        "hardcoded": lambda nums, lower, upper: [[2, 2], [4, 49], [51, 74], [76, 99]],
        "wrong": lambda nums, lower, upper: [],
    },
}


def _chain(nums):
    """Cây lệch hẳn sang phải — dùng cho lời giải mẫu sai của bài 108."""
    if not nums:
        return None
    return [nums[0], None, _chain(nums[1:])]
