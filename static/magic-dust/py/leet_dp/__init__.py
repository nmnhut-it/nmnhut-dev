"""leet_dp — cụm quy hoạch động cơ bản: bảng số, đường đi trên lưới, mua bán.

    from leet_dp import check

    def max_profit(prices):
        ...

    check("best-time-to-buy-and-sell-stock", max_profit)

Oracle của các bài lưới liệt kê thẳng mọi đường đi, nên số đường phình theo tổ
hợp: `GRID_CAP` chặn ca ngẫu nhiên ở lưới nhỏ, và ca lớn (nếu có) đo giờ bằng
`fast_oracle` chứ không bằng oracle liệt kê.

Bài đang có: pascals-triangle · pascals-triangle-ii · best-time-to-buy-and-sell-stock
· best-time-to-buy-and-sell-stock-ii · jump-game · jump-game-ii · minimum-path-sum
· unique-paths-ii · triangle
"""

from leet_judge import check, list_problems, problem

GRID_CAP = 5
TRIANGLE_CAP = 7
ROWS_CAP = 12
BIG_SIZES = (250, 1000, 8000)
# Hai bài nhảy siết giới hạn còn 1 giây thay vì đẩy bậc thang lên 12000.
# Bậc 12000 tách bạch được hai cách làm, nhưng máy chấm chỉ kết luận quá giờ SAU
# KHI bậc đó chạy XONG — trong Pyodide (chậm hơn CPython vài lần) học sinh viết
# lời giải O(n^2) phải ngồi chờ cả phút mới được báo. Ở 8000 với ngưỡng 1 giây,
# cách lan dần mất ~2 giây trên CPython và ~10 giây trong trình duyệt: vẫn tách
# bạch gấp đôi ngưỡng, mà phản hồi tới tay học sinh nhanh hơn nhiều.
JUMP_SIZES = (250, 1000, 8000)
JUMP_SECONDS = 1.0


def _flat(size, value=1):
    return [value] * size


# --- 118. Pascal's Triangle ---------------------------------------------------


def _gen_rows(rng, size):
    return (min(max(size, 1), ROWS_CAP),)


def _oracle_pascal(num_rows):
    rows = []
    for index in range(num_rows):
        row = [1] * (index + 1)
        for col in range(1, index):
            row[col] = rows[index - 1][col - 1] + rows[index - 1][col]
        rows.append(row)
    return rows


problem(
    "pascals-triangle", title="118. Pascal's Triangle",
    gen=_gen_rows, oracle=_oracle_pascal,
    cases=[(1,), (2,), (5,), (12,)],
)


# --- 119. Pascal's Triangle II ------------------------------------------------


def _gen_row_index(rng, size):
    return (min(max(size, 0), ROWS_CAP) - 1 if size > 1 else 0,)


def _oracle_pascal_row(row_index):
    return _oracle_pascal(row_index + 1)[row_index]


problem(
    "pascals-triangle-ii", title="119. Pascal's Triangle II",
    gen=_gen_row_index, oracle=_oracle_pascal_row,
    cases=[(0,), (1,), (3,), (10,), (20,)],
)


# --- 121. Best Time to Buy and Sell Stock -------------------------------------


def _gen_prices(rng, size):
    return ([rng.randint(0, 30) for _ in range(size)],)


def _oracle_max_profit(prices):
    best = 0
    for buy in range(len(prices)):
        for sell in range(buy + 1, len(prices)):
            best = max(best, prices[sell] - prices[buy])
    return best


def _fast_max_profit(prices):
    best, cheapest = 0, None
    for price in prices:
        if cheapest is None or price < cheapest:
            cheapest = price
        else:
            best = max(best, price - cheapest)
    return best


def _big_prices(size):
    """Giá giảm dần rồi vọt lên ở cuối: cách quét mọi cặp không thoát sớm được."""
    return ([size - index for index in range(size - 1)] + [size * 2],)


problem(
    "best-time-to-buy-and-sell-stock", title="121. Best Time to Buy and Sell Stock",
    gen=_gen_prices, oracle=_oracle_max_profit,
    cases=[([],), ([1],), ([7, 1, 5, 3, 6, 4],), ([7, 6, 4, 3, 1],), ([2, 2, 2],)],
    big=_big_prices, fast_oracle=_fast_max_profit, sizes=BIG_SIZES,
)


# --- 122. Best Time to Buy and Sell Stock II ----------------------------------


def _oracle_max_profit_ii(prices):
    """Bảng hai trạng thái: đang cầm cổ phiếu hoặc không."""
    holding, free = None, 0
    for price in prices:
        new_free = free if holding is None else max(free, holding + price)
        new_holding = free - price if holding is None else max(holding, free - price)
        holding, free = new_holding, new_free
    return free


problem(
    "best-time-to-buy-and-sell-stock-ii", title="122. Best Time to Buy and Sell Stock II",
    gen=_gen_prices, oracle=_oracle_max_profit_ii,
    cases=[([],), ([1],), ([7, 1, 5, 3, 6, 4],), ([1, 2, 3, 4, 5],), ([7, 6, 4, 3, 1],)],
)


# --- 55. Jump Game ------------------------------------------------------------


def _gen_jumps(rng, size):
    return ([rng.randint(0, 3) for _ in range(max(1, size))],)


def _oracle_can_jump(nums):
    """Đánh dấu lan dần từ vị trí 0 — O(n^2) nhưng không thể sai."""
    reachable = [False] * len(nums)
    reachable[0] = True
    for index in range(len(nums)):
        if reachable[index]:
            for step in range(1, nums[index] + 1):
                if index + step < len(nums):
                    reachable[index + step] = True
    return reachable[-1]


def _fast_can_jump(nums):
    furthest = 0
    for index, value in enumerate(nums):
        if index > furthest:
            return False
        furthest = max(furthest, index + value)
    return True


def _big_jumps(size):
    """Mỗi ô nhảy được nửa mảng, nên cách lan dần phải chạm n^2 / 2 lần.

    Để mỗi ô nhảy một bước thì vòng lan dần bên trong chỉ chạy một lần, và cách
    O(n^2) hoá ra vẫn chỉ tốn O(n) — ca đo giờ khi đó không chặn được gì.
    """
    return (_flat(size, max(1, size // 2)),)


problem(
    "jump-game", title="55. Jump Game",
    gen=_gen_jumps, oracle=_oracle_can_jump,
    cases=[([0],), ([2, 3, 1, 1, 4],), ([3, 2, 1, 0, 4],), ([1, 0, 1],), ([2, 0, 0],)],
    big=_big_jumps, fast_oracle=_fast_can_jump, sizes=JUMP_SIZES,
    seconds=JUMP_SECONDS,
)


# --- 45. Jump Game II ---------------------------------------------------------


def _gen_reachable_jumps(rng, size):
    """Đề bảo đảm luôn tới được ô cuối, nên mỗi ô phải nhảy được ít nhất một bước."""
    return ([rng.randint(1, 3) for _ in range(max(1, size))],)


def _oracle_min_jumps(nums):
    steps = [0] + [None] * (len(nums) - 1)
    for index in range(len(nums)):
        if steps[index] is None:
            continue
        for step in range(1, nums[index] + 1):
            target = index + step
            if target < len(nums) and (steps[target] is None or steps[index] + 1 < steps[target]):
                steps[target] = steps[index] + 1
    return steps[-1]


def _fast_min_jumps(nums):
    jumps, edge, furthest = 0, 0, 0
    for index in range(len(nums) - 1):
        furthest = max(furthest, index + nums[index])
        if index == edge:
            jumps += 1
            edge = furthest
    return jumps


problem(
    "jump-game-ii", title="45. Jump Game II",
    gen=_gen_reachable_jumps, oracle=_oracle_min_jumps,
    cases=[([0],), ([2, 3, 1, 1, 4],), ([2, 3, 0, 1, 4],), ([1, 1, 1],), ([5, 1, 1, 1, 1],)],
    big=lambda size: (_flat(size, max(1, size // 2)),), fast_oracle=_fast_min_jumps, sizes=JUMP_SIZES, seconds=JUMP_SECONDS,
)


# --- 64. Minimum Path Sum -----------------------------------------------------


def _gen_cost_grid(rng, size):
    rows = max(1, size % GRID_CAP + 1)
    cols = max(1, size % (GRID_CAP - 1) + 1)
    return ([[rng.randint(0, 9) for _ in range(cols)] for _ in range(rows)],)


def _oracle_min_path(grid):
    """Đi thử mọi đường xuống-phải; chỉ dùng được với lưới nhỏ."""
    def walk(row, col):
        if row == len(grid) - 1 and col == len(grid[0]) - 1:
            return grid[row][col]
        options = []
        if row + 1 < len(grid):
            options.append(walk(row + 1, col))
        if col + 1 < len(grid[0]):
            options.append(walk(row, col + 1))
        return grid[row][col] + min(options)
    return walk(0, 0)


problem(
    "minimum-path-sum", title="64. Minimum Path Sum",
    gen=_gen_cost_grid, oracle=_oracle_min_path,
    cases=[([[0]],), ([[1, 3, 1], [1, 5, 1], [4, 2, 1]],), ([[1, 2, 3], [4, 5, 6]],),
           ([[1], [2], [3]],)],
)


# --- 63. Unique Paths II ------------------------------------------------------


def _gen_obstacle_grid(rng, size):
    rows = max(1, size % GRID_CAP + 1)
    cols = max(1, size % (GRID_CAP - 1) + 1)
    grid = [[1 if rng.random() < 0.25 else 0 for _ in range(cols)] for _ in range(rows)]
    grid[0][0] = 0
    return (grid,)


def _oracle_unique_paths(grid):
    def walk(row, col):
        if row >= len(grid) or col >= len(grid[0]) or grid[row][col] == 1:
            return 0
        if row == len(grid) - 1 and col == len(grid[0]) - 1:
            return 1
        return walk(row + 1, col) + walk(row, col + 1)
    return walk(0, 0)


problem(
    "unique-paths-ii", title="63. Unique Paths II",
    gen=_gen_obstacle_grid, oracle=_oracle_unique_paths,
    cases=[([[0]],), ([[0, 0], [0, 0]],), ([[0, 0, 0], [0, 1, 0], [0, 0, 0]],),
           ([[0, 1], [0, 0]],), ([[0, 0], [1, 1], [0, 0]],)],
)


# --- 120. Triangle ------------------------------------------------------------


def _gen_triangle(rng, size):
    rows = min(max(size, 1), TRIANGLE_CAP)
    return ([[rng.randint(-9, 9) for _ in range(index + 1)] for index in range(rows)],)


def _oracle_triangle(triangle):
    def walk(row, col):
        if row == len(triangle) - 1:
            return triangle[row][col]
        return triangle[row][col] + min(walk(row + 1, col), walk(row + 1, col + 1))
    return walk(0, 0)


problem(
    "triangle", title="120. Triangle",
    gen=_gen_triangle, oracle=_oracle_triangle,
    cases=[([[1]],), ([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]],), ([[-10]],),
           ([[1], [2, 3]],)],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_pascal(num_rows):
    return _oracle_pascal(num_rows)


def _good_pascal_row(row_index):
    row = [1]
    for index in range(row_index):
        row = [1] + [row[col] + row[col + 1] for col in range(len(row) - 1)] + [1]
    return row


def _good_max_profit_ii(prices):
    total = 0
    for index in range(1, len(prices)):
        total += max(0, prices[index] - prices[index - 1])
    return total


def _good_min_path(grid):
    best = list(grid[0])
    for col in range(1, len(best)):
        best[col] += best[col - 1]
    for row in range(1, len(grid)):
        best[0] += grid[row][0]
        for col in range(1, len(best)):
            best[col] = grid[row][col] + min(best[col], best[col - 1])
    return best[-1]


def _good_unique_paths(grid):
    cols = len(grid[0])
    ways = [0] * cols
    ways[0] = 1
    for row in grid:
        for col in range(cols):
            if row[col] == 1:
                ways[col] = 0
            elif col:
                ways[col] += ways[col - 1]
    return ways[-1]


def _good_triangle(triangle):
    best = list(triangle[-1])
    for row in range(len(triangle) - 2, -1, -1):
        best = [triangle[row][col] + min(best[col], best[col + 1])
                for col in range(row + 1)]
    return best[0]


SAMPLES = {
    "pascals-triangle": {
        "good": _good_pascal,
        "hardcoded": lambda num_rows: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]],
        "wrong": lambda num_rows: [[1] * (index + 1) for index in range(num_rows)],
    },
    "pascals-triangle-ii": {
        "good": _good_pascal_row,
        "hardcoded": lambda row_index: [1, 3, 3, 1],
        "wrong": lambda row_index: [1] * (row_index + 1),
    },
    "best-time-to-buy-and-sell-stock": {
        "good": _fast_max_profit,
        "hardcoded": lambda prices: 5,
        # Bán trước mua sau: chênh lệch lớn nhất bất kể thứ tự.
        "wrong": lambda prices: max(prices) - min(prices) if prices else 0,
        "slow": _oracle_max_profit,
    },
    "best-time-to-buy-and-sell-stock-ii": {
        "good": _good_max_profit_ii,
        "hardcoded": lambda prices: 7,
        "wrong": _fast_max_profit,
    },
    "jump-game": {
        "good": _fast_can_jump,
        "hardcoded": lambda nums: True,
        "wrong": lambda nums: 0 not in nums,
        "slow": _oracle_can_jump,
    },
    "jump-game-ii": {
        "good": _fast_min_jumps,
        "hardcoded": lambda nums: 2,
        "wrong": lambda nums: len(nums) - 1,
        "slow": _oracle_min_jumps,
    },
    "minimum-path-sum": {
        "good": _good_min_path,
        "hardcoded": lambda grid: 7,
        # Mỗi bước chọn ô rẻ hơn ngay trước mắt, không nhìn xa hơn.
        "wrong": lambda grid: sum(min(row) for row in grid),
    },
    "unique-paths-ii": {
        "good": _good_unique_paths,
        "hardcoded": lambda grid: 2,
        "wrong": lambda grid: 1,
    },
    "triangle": {
        "good": _good_triangle,
        "hardcoded": lambda triangle: 11,
        "wrong": lambda triangle: sum(min(row) for row in triangle),
    },
}
