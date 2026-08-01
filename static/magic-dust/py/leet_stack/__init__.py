"""leet_stack — cụm ngăn xếp đơn điệu, cửa sổ trượt có đống, và quét.

    from leet_stack import check

    def largest_rectangle_area(heights):
        ...

    check("largest-rectangle", largest_rectangle_area)

Điểm chung: cách hiển nhiên là với mỗi vị trí lại nhìn lại toàn bộ phía trước
hoặc toàn bộ cửa sổ. Cách nhanh giữ sẵn một cấu trúc đã lọc bớt — ngăn xếp chỉ
chứa những cột còn có thể thắng, hàng đợi chỉ chứa những giá trị còn có thể là
lớn nhất.

Bài đang có: evaluate-rpn · kth-largest · count-primes · maximum-gap
· sliding-window-maximum · largest-rectangle · maximal-rectangle
· max-points-on-a-line · skyline
"""

import itertools

from leet_judge import check, list_problems, problem

GRID_CAP = 4
SMALL_COUNT = 40
BIG_SIZES = (250, 1000, 8000)


# --- 150. Evaluate Reverse Polish Notation ------------------------------------


def _apply(left, right, token):
    if token == "+":
        return left + right
    if token == "-":
        return left - right
    if token == "*":
        return left * right
    # Phép chia của đề cắt về phía 0, khác `//` của Python với số âm.
    return -(-left // right) if (left < 0) != (right < 0) else left // right


def _gen_rpn(rng, size):
    """Dựng biểu thức hợp lệ, vừa sinh vừa TÍNH để không tạo ra phép chia cho 0.

    Chỉ đếm số toán hạng trên ngăn xếp là chưa đủ: một biểu thức con hoàn toàn
    hợp lệ vẫn có thể ra 0, và toán tử `/` ngay sau đó làm chính oracle nổ.
    """
    values = [rng.randint(-9, 9)]
    tokens = [str(values[0])]
    for _ in range(min(size, 6)):
        allowed = ["+", "-", "*"] + (["/"] if len(values) >= 2 and values[-1] else [])
        if len(values) >= 2 and rng.random() < 0.5:
            token = rng.choice(allowed)
            right = values.pop()
            values.append(_apply(values.pop(), right, token))
            tokens.append(token)
        else:
            values.append(rng.randint(1, 9))
            tokens.append(str(values[-1]))
    while len(values) > 1:
        token = rng.choice(["+", "-", "*"])
        right = values.pop()
        values.append(_apply(values.pop(), right, token))
        tokens.append(token)
    return (tokens,)


def _oracle_rpn(tokens):
    stack = []
    for token in tokens:
        if token in ("+", "-", "*", "/"):
            right = stack.pop()
            left = stack.pop()
            stack.append(_apply(left, right, token))
        else:
            stack.append(int(token))
    return stack[-1]


problem(
    "evaluate-rpn", title="150. Evaluate Reverse Polish Notation",
    gen=_gen_rpn, oracle=_oracle_rpn,
    cases=[(["3"],), (["2", "1", "+", "3", "*"],), (["4", "13", "5", "/", "+"],),
           (["-7", "2", "/"],), (["7", "-2", "/"],)],
)


# --- 215. Kth Largest Element in an Array -------------------------------------


def _gen_kth(rng, size):
    nums = [rng.randint(-20, 20) for _ in range(max(1, size))]
    return (nums, rng.randint(1, len(nums)))


def _oracle_kth_largest(nums, k):
    return sorted(nums)[-k]


problem(
    "kth-largest", title="215. Kth Largest Element in an Array",
    gen=_gen_kth, oracle=_oracle_kth_largest,
    cases=[([1], 1), ([3, 2, 1, 5, 6, 4], 2), ([3, 2, 3, 1, 2, 4, 5, 5, 6], 4),
           ([2, 2], 2)],
)


# --- 204. Count Primes --------------------------------------------------------


def _gen_limit(rng, size):
    return (rng.randint(0, 60 * max(1, size)),)


def _oracle_count_primes(n):
    """Thử chia từng số cho mọi số nhỏ hơn nó — chậm nhưng khỏi bàn cãi."""
    found = 0
    for value in range(2, n):
        prime = True
        for divisor in range(2, value):
            if value % divisor == 0:
                prime = False
                break
        if prime:
            found += 1
    return found


def _fast_count_primes(n):
    if n < 3:
        return 0
    sieve = [True] * n
    sieve[0] = sieve[1] = False
    step = 2
    while step * step < n:
        if sieve[step]:
            for multiple in range(step * step, n, step):
                sieve[multiple] = False
        step += 1
    return sum(sieve)


problem(
    "count-primes", title="204. Count Primes",
    gen=_gen_limit, oracle=_oracle_count_primes, count=SMALL_COUNT,
    cases=[(0,), (1,), (2,), (3,), (10,), (100,)],
    big=lambda size: (size,), fast_oracle=_fast_count_primes,
    sizes=(2000, 20000, 120000),
)


# --- 164. Maximum Gap ---------------------------------------------------------


def _gen_gap(rng, size):
    return ([rng.randint(0, 60) for _ in range(max(1, size))],)


def _oracle_maximum_gap(nums):
    if len(nums) < 2:
        return 0
    ordered = sorted(nums)
    return max(ordered[index + 1] - ordered[index] for index in range(len(ordered) - 1))


problem(
    "maximum-gap", title="164. Maximum Gap",
    gen=_gen_gap, oracle=_oracle_maximum_gap,
    cases=[([],), ([1],), ([3, 6, 9, 1],), ([10],), ([1, 1, 1],), ([1, 10000000],)],
)


# --- 239. Sliding Window Maximum ----------------------------------------------


def _gen_window(rng, size):
    nums = [rng.randint(-15, 15) for _ in range(max(1, size))]
    return (nums, rng.randint(1, len(nums)))


def _oracle_window_max(nums, k):
    return [max(nums[start:start + k]) for start in range(len(nums) - k + 1)]


def _fast_window_max(nums, k):
    """Hàng đợi chỉ giữ những vị trí còn có thể là lớn nhất, giảm dần theo giá trị."""
    keep = []
    out = []
    for index, value in enumerate(nums):
        while keep and nums[keep[-1]] <= value:
            keep.pop()
        keep.append(index)
        if keep[0] <= index - k:
            keep.pop(0)
        if index >= k - 1:
            out.append(nums[keep[0]])
    return out


def _slow_window_max(nums, k):
    """Quét trọn từng cửa sổ bằng vòng `for` của Python.

    Viết `max(nums[start:start + k])` cũng là O(n * k) nhưng cắt list và `max`
    đều chạy bằng C, nhanh gấp chục lần — mẫu chậm kiểu đó vẫn kịp giờ ở ca lớn.
    """
    out = []
    for start in range(len(nums) - k + 1):
        best = nums[start]
        for index in range(start, start + k):
            if nums[index] > best:
                best = nums[index]
        out.append(best)
    return out


def _big_window(size):
    """Cửa sổ rộng nửa mảng, giá trị TĂNG dần.

    Cách quét trọn cửa sổ vẫn phải nhìn đủ k phần tử mỗi bước. Còn cách hàng đợi
    thì với dãy tăng dần, mỗi giá trị mới đẩy sạch hàng đợi nên nó luôn ngắn —
    nếu để dãy giảm dần, hàng đợi phình tới k và mỗi lần bỏ đầu lại tốn O(k),
    làm chính lời giải đúng cũng chậm đi.
    """
    return (list(range(size)), size // 2)


problem(
    "sliding-window-maximum", title="239. Sliding Window Maximum",
    gen=_gen_window, oracle=_oracle_window_max,
    cases=[([1], 1), ([1, 3, -1, -3, 5, 3, 6, 7], 3), ([1, -1], 1), ([9, 11], 2),
           ([4, -2], 2)],
    big=_big_window, fast_oracle=_fast_window_max, sizes=(250, 1000, 24000),
)


# --- 84. Largest Rectangle in Histogram ---------------------------------------


def _gen_bars(rng, size):
    return ([rng.randint(0, 9) for _ in range(size)],)


def _oracle_largest_rectangle(heights):
    """Với mỗi cặp mốc, chiều cao là cột thấp nhất trong đoạn."""
    best = 0
    for start in range(len(heights)):
        lowest = heights[start]
        for end in range(start, len(heights)):
            lowest = min(lowest, heights[end])
            best = max(best, lowest * (end - start + 1))
    return best


def _fast_largest_rectangle(heights):
    """Ngăn xếp chỉ giữ các cột có chiều cao tăng dần."""
    stack = []
    best = 0
    for index, height in enumerate(list(heights) + [0]):
        while stack and heights[stack[-1]] >= height:
            top = heights[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            best = max(best, top * (index - left))
        stack.append(index)
    return best


problem(
    "largest-rectangle", title="84. Largest Rectangle in Histogram",
    gen=_gen_bars, oracle=_oracle_largest_rectangle,
    cases=[([],), ([2],), ([2, 1, 5, 6, 2, 3],), ([2, 4],), ([0, 0],), ([5, 5, 5],)],
    big=lambda size: ([index % 97 for index in range(size)],),
    fast_oracle=_fast_largest_rectangle, sizes=(250, 1000, 8000),
)


# --- 85. Maximal Rectangle ----------------------------------------------------


def _gen_binary_grid(rng, size):
    rows = max(1, size % GRID_CAP + 1)
    cols = max(1, size % (GRID_CAP + 1) + 1)
    return ([[1 if rng.random() < 0.6 else 0 for _ in range(cols)] for _ in range(rows)],)


def _oracle_maximal_rectangle(matrix):
    """Thử mọi hình chữ nhật, kiểm từng ô."""
    rows, cols = len(matrix), len(matrix[0])
    best = 0
    for top in range(rows):
        for bottom in range(top, rows):
            for left in range(cols):
                for right in range(left, cols):
                    cells = [matrix[row][col] for row in range(top, bottom + 1)
                             for col in range(left, right + 1)]
                    if all(cell == 1 for cell in cells):
                        best = max(best, len(cells))
    return best


def _fast_maximal_rectangle(matrix):
    """Mỗi hàng là đáy của một biểu đồ cột, rồi dùng lại bài 84."""
    cols = len(matrix[0])
    heights = [0] * cols
    best = 0
    for row in matrix:
        for col in range(cols):
            heights[col] = heights[col] + 1 if row[col] == 1 else 0
        best = max(best, _fast_largest_rectangle(heights))
    return best


problem(
    "maximal-rectangle", title="85. Maximal Rectangle",
    gen=_gen_binary_grid, oracle=_oracle_maximal_rectangle, count=SMALL_COUNT,
    cases=[([[0]],), ([[1]],), ([[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1],
                                [1, 0, 0, 1, 0]],), ([[1, 1], [1, 1]],)],
)


# --- 149. Max Points on a Line ------------------------------------------------


def _gen_points(rng, size):
    seen = set()
    while len(seen) < max(1, min(size, 9)):
        seen.add((rng.randint(-4, 4), rng.randint(-4, 4)))
    return ([list(point) for point in seen],)


def _oracle_max_points(points):
    """Thử mọi cặp làm đường thẳng rồi đếm điểm nằm trên nó."""
    if len(points) <= 2:
        return len(points)
    best = 2
    for first, second in itertools.combinations(range(len(points)), 2):
        ax, ay = points[first]
        bx, by = points[second]
        on_line = 0
        for cx, cy in points:
            if (bx - ax) * (cy - ay) == (by - ay) * (cx - ax):
                on_line += 1
        best = max(best, on_line)
    return best


problem(
    "max-points-on-a-line", title="149. Max Points on a Line",
    gen=_gen_points, oracle=_oracle_max_points, count=SMALL_COUNT,
    cases=[([[0, 0]],), ([[1, 1], [2, 2]],), ([[1, 1], [2, 2], [3, 3]],),
           ([[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]],), ([[0, 0], [0, 1], [1, 0]],)],
)


# --- 218. The Skyline Problem -------------------------------------------------


def _gen_buildings(rng, size):
    out = []
    for _ in range(max(1, min(size, 7))):
        left = rng.randint(0, 14)
        out.append([left, left + rng.randint(1, 6), rng.randint(1, 9)])
    return (sorted(out),)


def _oracle_skyline(buildings):
    """Quét từng toạ độ nguyên, ghi lại mỗi lần chiều cao đổi."""
    lowest = min(item[0] for item in buildings)
    highest = max(item[1] for item in buildings)
    out = []
    previous = 0
    for x in range(lowest, highest + 1):
        tallest = 0
        for left, right, height in buildings:
            if left <= x < right:
                tallest = max(tallest, height)
        if tallest != previous:
            out.append([x, tallest])
            previous = tallest
    return out


problem(
    "skyline", title="218. The Skyline Problem",
    gen=_gen_buildings, oracle=_oracle_skyline, count=SMALL_COUNT,
    cases=[([[0, 2, 3]],), ([[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10],
                            [19, 24, 8]],), ([[0, 2, 3], [2, 5, 3]],),
           ([[1, 2, 1], [1, 2, 2]],)],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_kth_largest(nums, k):
    return sorted(nums, reverse=True)[k - 1]


def _good_maximal_rectangle(matrix):
    return _fast_maximal_rectangle(matrix)


def _good_max_points(points):
    if len(points) <= 2:
        return len(points)
    best = 2
    for first in range(len(points)):
        slopes = {}
        ax, ay = points[first]
        for second in range(len(points)):
            if second == first:
                continue
            bx, by = points[second]
            dx, dy = bx - ax, by - ay
            step = _gcd(abs(dx), abs(dy))
            dx, dy = dx // step, dy // step
            if dx < 0 or (dx == 0 and dy < 0):
                dx, dy = -dx, -dy
            slopes[(dx, dy)] = slopes.get((dx, dy), 1) + 1
            best = max(best, slopes[(dx, dy)])
    return best


def _gcd(first, second):
    while second:
        first, second = second, first % second
    return first or 1


def _good_skyline(buildings):
    """Quét theo mốc sự kiện: mỗi toà nhà mở ở mép trái và đóng ở mép phải."""
    events = sorted(set([item[0] for item in buildings] + [item[1] for item in buildings]))
    out = []
    previous = 0
    for x in events:
        tallest = 0
        for left, right, height in buildings:
            if left <= x < right:
                tallest = max(tallest, height)
        if tallest != previous:
            out.append([x, tallest])
            previous = tallest
    return out


SAMPLES = {
    "evaluate-rpn": {
        "good": _oracle_rpn,
        "hardcoded": lambda tokens: 9,
        # Dùng `//` của Python: với số âm nó làm tròn xuống thay vì cắt về 0.
        "wrong": lambda tokens: sum(int(token) for token in tokens
                                    if token not in ("+", "-", "*", "/")),
    },
    "kth-largest": {
        "good": _good_kth_largest,
        "hardcoded": lambda nums, k: 5,
        # Nhầm "lớn thứ k" thành "nhỏ thứ k".
        "wrong": lambda nums, k: sorted(nums)[k - 1],
    },
    "count-primes": {
        "good": _fast_count_primes,
        "hardcoded": lambda n: 4,
        # Đếm cả n, trong khi đề chỉ đếm các số NHỎ HƠN n.
        "wrong": lambda n: _fast_count_primes(n + 1),
        "slow": _oracle_count_primes,
    },
    "maximum-gap": {
        "good": _oracle_maximum_gap,
        "hardcoded": lambda nums: 3,
        # Lấy hiệu lớn nhất trừ nhỏ nhất, không phải khoảng cách hai số kề nhau.
        "wrong": lambda nums: max(nums) - min(nums) if nums else 0,
    },
    "sliding-window-maximum": {
        "good": _fast_window_max,
        "hardcoded": lambda nums, k: [3, 3, 5, 5, 6, 7],
        "wrong": lambda nums, k: [max(nums)] * max(0, len(nums) - k + 1),
        "slow": _slow_window_max,
    },
    "largest-rectangle": {
        "good": _fast_largest_rectangle,
        "hardcoded": lambda heights: 10,
        # Chỉ xét từng cột một, bỏ qua hình chữ nhật trải qua nhiều cột.
        "wrong": lambda heights: max(heights) if heights else 0,
        "slow": _oracle_largest_rectangle,
    },
    "maximal-rectangle": {
        "good": _good_maximal_rectangle,
        "hardcoded": lambda matrix: 6,
        # Hình vuông lớn nhất, không phải hình chữ nhật lớn nhất.
        "wrong": lambda matrix: max((sum(row) for row in matrix), default=0),
    },
    "max-points-on-a-line": {
        "good": _good_max_points,
        "hardcoded": lambda points: 4,
        "wrong": lambda points: 2 if len(points) >= 2 else len(points),
    },
    "skyline": {
        "good": _good_skyline,
        "hardcoded": lambda buildings: [[2, 10], [3, 15], [7, 12], [12, 0], [15, 10],
                                        [20, 8], [24, 0]],
        # Ghi mốc cho mọi mép nhà, kể cả khi chiều cao không đổi.
        "wrong": lambda buildings: [[item[0], item[2]] for item in buildings],
    },
}
