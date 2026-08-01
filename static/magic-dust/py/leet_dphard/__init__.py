"""leet_dphard — cụm quy hoạch động có trạng thái: cướp nhà, mua bán có giới
hạn số lần, cắt chuỗi, ô vuông lớn nhất, hang ngục.

    from leet_dphard import check

    def rob(nums):
        ...

    check("house-robber", rob)

Khác cụm cơ bản ở chỗ mỗi ô của bảng không còn là một con số mà là MỘT NHÓM
trạng thái: đang cầm hay không cầm cổ phiếu, đã mua bán mấy lần, cắt tới đâu.

Oracle của mấy bài này liệt kê thẳng nên phình theo hàm mũ; `WORD_CAP` và
`SMALL_COUNT` chặn ca ngẫu nhiên lại, còn ca lớn đo giờ bằng `fast_oracle`.

Bài đang có: house-robber · house-robber-ii · maximum-product-subarray
· word-break · word-break-ii · best-time-iii · best-time-iv · maximal-square
· dungeon-game
"""

import itertools

from leet_judge import check, list_problems, problem

WORD_CAP = 10
GRID_CAP = 4
SMALL_COUNT = 40
BIG_SIZES = (250, 1000, 8000)
# Cách quét lại O(n^2) của bài cướp nhà mất ~2 giây ở n = 8000, đúng ngay ngưỡng
# nên dễ chập chờn theo máy; 12000 cho nó cách xa ngưỡng hẳn.
ROB_SIZES = (250, 1000, 12000)
LETTERS = "ab"


def _side(size):
    """Cạnh lưới vuông cho ca đo giờ."""
    root = 1
    while (root + 1) * (root + 1) <= size:
        root += 1
    return root


def _grid(rng, rows, cols, low, high):
    return [[rng.randint(low, high) for _ in range(cols)] for _ in range(rows)]


# --- 198. House Robber --------------------------------------------------------


def _gen_houses(rng, size):
    return ([rng.randint(0, 20) for _ in range(max(1, min(size, 14)))],)


def _oracle_rob(nums):
    """Thử mọi cách chọn nhà, loại các cách có hai nhà kề nhau."""
    best = 0
    for taken in itertools.product([0, 1], repeat=len(nums)):
        if any(taken[index] and taken[index + 1] for index in range(len(taken) - 1)):
            continue
        best = max(best, sum(value for value, keep in zip(nums, taken) if keep))
    return best


def _slow_rob(nums):
    """Đúng nhưng mỗi nhà lại quét lại mọi nhà trước đó: O(n^2).

    Mẫu "chậm" bắt buộc phải là cách làm ĐA THỨC. Nếu để oracle liệt kê mọi
    cách chọn (2^n) làm mẫu chậm thì nó bị chạy cả trên ca lớn n = 8000 và treo
    vĩnh viễn — bộ chấm chỉ dừng được ở bậc thang khi bậc đó CHẠY XONG.

    Vòng quét lại phải viết bằng `for` của Python, không viết `max(best[:i])`:
    cắt list rồi `max` cũng là O(n^2) nhưng chạy bằng C nên vẫn kịp giờ.
    """
    best = [0] * (len(nums) + 1)
    for index in range(len(nums)):
        earlier = 0
        for before in range(max(0, index - 1)):
            if best[before + 1] > earlier:
                earlier = best[before + 1]
        best[index + 1] = max(best[index], nums[index] + earlier)
    return best[-1]


def _fast_rob(nums):
    skip, take = 0, 0
    for value in nums:
        skip, take = max(skip, take), skip + value
    return max(skip, take)


problem(
    "house-robber", title="198. House Robber",
    gen=_gen_houses, oracle=_oracle_rob, count=SMALL_COUNT,
    cases=[([1],), ([1, 2, 3, 1],), ([2, 7, 9, 3, 1],), ([0, 0],), ([5, 5, 5],)],
    big=lambda size: ([index % 17 for index in range(size)],),
    fast_oracle=_fast_rob, sizes=ROB_SIZES,
)


# --- 213. House Robber II -----------------------------------------------------


def _oracle_rob_circle(nums):
    """Nhà đầu và nhà cuối kề nhau, nên loại thêm các cách lấy cả hai."""
    if len(nums) == 1:
        return nums[0]
    best = 0
    for taken in itertools.product([0, 1], repeat=len(nums)):
        if any(taken[index] and taken[index + 1] for index in range(len(taken) - 1)):
            continue
        if taken[0] and taken[-1]:
            continue
        best = max(best, sum(value for value, keep in zip(nums, taken) if keep))
    return best


def _slow_rob_circle(nums):
    if len(nums) == 1:
        return nums[0]
    return max(_slow_rob(nums[1:]), _slow_rob(nums[:-1]))


def _fast_rob_circle(nums):
    if len(nums) == 1:
        return nums[0]
    return max(_fast_rob(nums[1:]), _fast_rob(nums[:-1]))


problem(
    "house-robber-ii", title="213. House Robber II",
    gen=_gen_houses, oracle=_oracle_rob_circle, count=SMALL_COUNT,
    cases=[([1],), ([2, 3, 2],), ([1, 2, 3, 1],), ([1, 2, 3],), ([5, 5],)],
    big=lambda size: ([index % 17 for index in range(size)],),
    fast_oracle=_fast_rob_circle, sizes=ROB_SIZES,
)


# --- 152. Maximum Product Subarray --------------------------------------------


def _gen_products(rng, size):
    return ([rng.randint(-3, 3) for _ in range(max(1, size))],)


def _oracle_max_product(nums):
    best = nums[0]
    for start in range(len(nums)):
        running = 1
        for index in range(start, len(nums)):
            running *= nums[index]
            best = max(best, running)
    return best


def _fast_max_product(nums):
    best = high = low = nums[0]
    for value in nums[1:]:
        options = (value, high * value, low * value)
        high, low = max(options), min(options)
        best = max(best, high)
    return best


problem(
    "maximum-product-subarray", title="152. Maximum Product Subarray",
    gen=_gen_products, oracle=_oracle_max_product,
    cases=[([2, 3, -2, 4],), ([-2, 0, -1],), ([-2],), ([0, 2],), ([-1, -2, -3],)],
    # Toàn số 1 để tích không phình thành số nguyên lớn, che mất khác biệt tốc độ.
    big=lambda size: ([1] * size,), fast_oracle=_fast_max_product, sizes=BIG_SIZES,
)


# --- 139. Word Break ----------------------------------------------------------


def _gen_word_break(rng, size):
    text = "".join(rng.choice(LETTERS) for _ in range(max(1, min(size, WORD_CAP))))
    words = sorted({"".join(rng.choice(LETTERS) for _ in range(rng.randint(1, 3)))
                    for _ in range(rng.randint(1, 4))})
    return (text, words)


def _oracle_word_break(text, word_dict):
    """Thử mọi chỗ cắt — hàm mũ, chỉ dùng được với chuỗi ngắn."""
    if not text:
        return True
    for word in word_dict:
        if text.startswith(word) and _oracle_word_break(text[len(word):], word_dict):
            return True
    return False


def _fast_word_break(text, word_dict):
    reachable = [True] + [False] * len(text)
    for end in range(1, len(text) + 1):
        for word in word_dict:
            start = end - len(word)
            if start >= 0 and reachable[start] and text[start:end] == word:
                reachable[end] = True
                break
    return reachable[-1]


def _big_word_break(size):
    """Chuỗi KHÔNG cắt được: toàn 'a' rồi một chữ 'b' lạc loài ở cuối.

    Nếu để chuỗi toàn 'a' thì cách thử mọi chỗ cắt khớp ngay từ từ đầu tiên và
    trả lời sau đúng n bước — nhanh y như bảng. Phải để nó KHÔNG cắt được thì
    mới bắt buộc đi hết mọi nhánh, và số nhánh mới phình theo hàm mũ.
    """
    return ("a" * size + "b", ["a", "aa", "aaa"])


problem(
    "word-break", title="139. Word Break",
    gen=_gen_word_break, oracle=_oracle_word_break, count=SMALL_COUNT,
    cases=[("", ["a"]), ("leetcode", ["leet", "code"]), ("applepenapple", ["apple", "pen"]),
           ("catsandog", ["cats", "dog", "sand", "and", "cat"])],
    big=_big_word_break, fast_oracle=_fast_word_break, sizes=(12, 20, 26),
)


# --- 140. Word Break II -------------------------------------------------------


def _oracle_word_break_ii(text, word_dict):
    if not text:
        return [""]
    out = []
    for word in word_dict:
        if text.startswith(word):
            for rest in _oracle_word_break_ii(text[len(word):], word_dict):
                out.append(word if not rest else word + " " + rest)
    return out


def _norm_sentences(value):
    if not isinstance(value, (list, tuple)):
        return "phải trả về một list các câu"
    if any(not isinstance(item, str) for item in value):
        return "mỗi câu phải là một chuỗi"
    if len(set(value)) != len(value):
        return "có câu bị lặp — mỗi cách cắt chỉ được xuất hiện một lần"
    return sorted(value)


problem(
    "word-break-ii", title="140. Word Break II",
    gen=_gen_word_break, oracle=_oracle_word_break_ii, normalize=_norm_sentences,
    count=SMALL_COUNT,
    cases=[("", ["a"]), ("catsanddog", ["cat", "cats", "and", "sand", "dog"]),
           ("aaa", ["a", "aa"]), ("abcd", ["a", "bc"])],
)


# --- 123 / 188. Best Time to Buy and Sell Stock III & IV ----------------------


def _gen_prices(rng, size):
    return ([rng.randint(0, 20) for _ in range(min(size, 12))],)


def _best_with_limit(prices, limit):
    """Bảng theo (số lần đã bán, đang cầm hay không) — chậm nhưng thẳng thớm."""
    if not prices or limit == 0:
        return 0
    holding = [None] * (limit + 1)
    free = [0] * (limit + 1)
    for price in prices:
        for deals in range(limit, 0, -1):
            if holding[deals] is not None:
                free[deals] = max(free[deals], holding[deals] + price)
            candidate = free[deals - 1] - price
            holding[deals] = candidate if holding[deals] is None else max(holding[deals], candidate)
    return max(free)


def _oracle_best_iii(prices):
    """Cắt dãy ngày làm hai nửa, mỗi nửa mua bán một lần — chậm nhưng khó cãi."""
    def once(window):
        best, cheapest = 0, None
        for price in window:
            cheapest = price if cheapest is None else min(cheapest, price)
            best = max(best, price - cheapest)
        return best
    best = 0
    for cut in range(len(prices) + 1):
        best = max(best, once(prices[:cut]) + once(prices[cut:]))
    return best


def _gen_prices_with_limit(rng, size):
    return (rng.randint(0, 3), [rng.randint(0, 20) for _ in range(min(size, 12))])


def _oracle_best_iv(k, prices):
    return _best_with_limit(prices, k)


problem(
    "best-time-iii", title="123. Best Time to Buy and Sell Stock III",
    gen=_gen_prices, oracle=_oracle_best_iii,
    cases=[([],), ([1],), ([3, 3, 5, 0, 0, 3, 1, 4],), ([1, 2, 3, 4, 5],), ([7, 6, 4, 3, 1],)],
)

problem(
    "best-time-iv", title="188. Best Time to Buy and Sell Stock IV",
    gen=_gen_prices_with_limit, oracle=_oracle_best_iv,
    cases=[(0, [1, 2]), (2, [2, 4, 1]), (2, [3, 2, 6, 5, 0, 3]), (1, []), (5, [1, 2, 3])],
)


# --- 221. Maximal Square ------------------------------------------------------


def _gen_binary_grid(rng, size):
    rows = max(1, size % GRID_CAP + 1)
    cols = max(1, size % (GRID_CAP + 1) + 1)
    return ([[1 if rng.random() < 0.6 else 0 for _ in range(cols)] for _ in range(rows)],)


def _oracle_maximal_square(matrix):
    """Thử mọi ô góc trên trái và mọi cạnh, kiểm từng ô một."""
    best = 0
    for row in range(len(matrix)):
        for col in range(len(matrix[0])):
            side = 1
            while row + side <= len(matrix) and col + side <= len(matrix[0]):
                cells = [matrix[row + dr][col + dc]
                         for dr in range(side) for dc in range(side)]
                if all(cell == 1 for cell in cells):
                    best = max(best, side)
                    side += 1
                else:
                    break
    return best * best


def _fast_maximal_square(matrix):
    rows, cols = len(matrix), len(matrix[0])
    sides = [[0] * cols for _ in range(rows)]
    best = 0
    for row in range(rows):
        for col in range(cols):
            if matrix[row][col] == 1:
                if row == 0 or col == 0:
                    sides[row][col] = 1
                else:
                    sides[row][col] = 1 + min(sides[row - 1][col], sides[row][col - 1],
                                              sides[row - 1][col - 1])
                best = max(best, sides[row][col])
    return best * best


problem(
    "maximal-square", title="221. Maximal Square",
    gen=_gen_binary_grid, oracle=_oracle_maximal_square,
    cases=[([[0]],), ([[1]],), ([[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1],
                                [1, 0, 0, 1, 0]],), ([[1, 1], [1, 1]],)],
    # Lưới vuông toàn 1: cách thử mọi cạnh tốn cỡ cạnh^5, nên 34x34 đã quá giờ
    # còn 17x17 thì chưa — đủ tách bạch mà không bậc nào chạy quá vài giây.
    big=lambda size: ([[1] * _side(size) for _ in range(_side(size))],),
    fast_oracle=_fast_maximal_square, sizes=(300, 1200, 6000),
)


# --- 174. Dungeon Game --------------------------------------------------------


def _gen_dungeon(rng, size):
    rows = max(1, size % GRID_CAP + 1)
    cols = max(1, size % (GRID_CAP - 1) + 2)
    return (_grid(rng, rows, cols, -6, 6),)


def _oracle_dungeon(dungeon):
    """Thử mọi đường xuống-phải, đường nào cần ít máu khởi điểm nhất."""
    rows, cols = len(dungeon), len(dungeon[0])

    def walk(row, col, health, lowest):
        health += dungeon[row][col]
        lowest = min(lowest, health)
        if row == rows - 1 and col == cols - 1:
            return lowest
        options = []
        if row + 1 < rows:
            options.append(walk(row + 1, col, health, lowest))
        if col + 1 < cols:
            options.append(walk(row, col + 1, health, lowest))
        return max(options)

    return max(1, 1 - walk(0, 0, 0, 0))


def _fast_dungeon(dungeon):
    rows, cols = len(dungeon), len(dungeon[0])
    need = [[0] * cols for _ in range(rows)]
    for row in range(rows - 1, -1, -1):
        for col in range(cols - 1, -1, -1):
            if row == rows - 1 and col == cols - 1:
                ahead = 1
            elif row == rows - 1:
                ahead = need[row][col + 1]
            elif col == cols - 1:
                ahead = need[row + 1][col]
            else:
                ahead = min(need[row + 1][col], need[row][col + 1])
            need[row][col] = max(1, ahead - dungeon[row][col])
    return need[0][0]


problem(
    "dungeon-game", title="174. Dungeon Game",
    gen=_gen_dungeon, oracle=_oracle_dungeon, count=SMALL_COUNT,
    cases=[([[0]],), ([[-5]],), ([[3]],), ([[-2, -3, 3], [-5, -10, 1], [10, 30, -5]],)],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_word_break_ii(text, word_dict):
    cache = {}

    def walk(rest):
        if rest in cache:
            return cache[rest]
        if not rest:
            return [""]
        out = []
        for word in word_dict:
            if rest.startswith(word):
                for tail in walk(rest[len(word):]):
                    out.append(word if not tail else word + " " + tail)
        cache[rest] = out
        return out

    return walk(text)


def _good_best_iii(prices):
    return _best_with_limit(prices, 2)


def _good_best_iv(k, prices):
    return _best_with_limit(prices, k)


SAMPLES = {
    "house-robber": {
        "good": _fast_rob,
        "hardcoded": lambda nums: 4,
        # Lấy hết nhà ở vị trí chẵn — bỏ qua các cách xen kẽ khác.
        "wrong": lambda nums: sum(nums[::2]),
        "slow": _slow_rob,
    },
    "house-robber-ii": {
        "good": _fast_rob_circle,
        "hardcoded": lambda nums: 3,
        # Quên rằng nhà đầu và nhà cuối kề nhau.
        "wrong": _fast_rob,
        "slow": _slow_rob_circle,
    },
    "maximum-product-subarray": {
        "good": _fast_max_product,
        "hardcoded": lambda nums: 6,
        # Chỉ nhớ tích lớn nhất, quên rằng một tích âm rất nhỏ gặp số âm sẽ hoá lớn.
        "wrong": lambda nums: max(nums),
        "slow": _oracle_max_product,
    },
    "word-break": {
        "good": _fast_word_break,
        "hardcoded": lambda text, word_dict: True,
        "wrong": lambda text, word_dict: any(text.startswith(word) for word in word_dict),
        "slow": _oracle_word_break,
    },
    "word-break-ii": {
        "good": _good_word_break_ii,
        "hardcoded": lambda text, word_dict: ["cat sand dog", "cats and dog"],
        "wrong": lambda text, word_dict: [],
    },
    "best-time-iii": {
        "good": _good_best_iii,
        "hardcoded": lambda prices: 6,
        # Không giới hạn số lần mua bán.
        "wrong": lambda prices: sum(max(0, prices[i] - prices[i - 1])
                                    for i in range(1, len(prices))),
    },
    "best-time-iv": {
        "good": _good_best_iv,
        "hardcoded": lambda k, prices: 2,
        "wrong": lambda k, prices: sum(max(0, prices[i] - prices[i - 1])
                                       for i in range(1, len(prices))),
    },
    "maximal-square": {
        "good": _fast_maximal_square,
        "hardcoded": lambda matrix: 4,
        # Trả về cạnh thay vì diện tích.
        "wrong": lambda matrix: max((sum(row) for row in matrix), default=0),
        "slow": _oracle_maximal_square,
    },
    "dungeon-game": {
        "good": _fast_dungeon,
        "hardcoded": lambda dungeon: 7,
        # Cộng dồn cả đường rồi bù một lần, quên rằng máu không được chạm 0 giữa chừng.
        "wrong": lambda dungeon: max(1, 1 - sum(min(row) for row in dungeon)),
    },
}
