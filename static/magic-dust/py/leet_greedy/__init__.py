"""leet_greedy — cụm tham lam, khoảng và xâu chuỗi kết quả.

    from leet_greedy import check

    def merge(intervals):
        ...

    check("merge-intervals", merge)

Điểm chung: đáp án dựng dần theo một quy tắc chọn tại chỗ, và cái khó nằm ở
chỗ chứng minh quy tắc đó không bỏ sót — nên phần lớn bài có oracle liệt kê
hoặc lặp-tới-khi-ổn-định để đối chiếu.

Bài đang có: merge-intervals · insert-interval · plus-one · text-justification
· gas-station · candy · largest-number · summary-ranges · contains-duplicate-iii
"""

import itertools

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"
PERM_CAP = 6
BIG_SIZES = (250, 1000, 20000)


def _intervals(rng, size):
    out = []
    for _ in range(size):
        start = rng.randint(0, 20)
        out.append([start, start + rng.randint(0, 5)])
    return out


# --- 56. Merge Intervals ------------------------------------------------------


def _gen_intervals(rng, size):
    return (_intervals(rng, max(0, min(size, 8))),)


def _oracle_merge(intervals):
    """Gộp hai khoảng CHỒNG NHAU bất kỳ, lặp tới khi không còn cặp nào.

    Cách đánh dấu từng điểm nguyên rồi gom lại thì sai: [15, 16] và [17, 21]
    liền nhau trên trục số nguyên nên bị gộp thành [15, 21], trong khi đề chỉ
    gộp các khoảng CHỒNG nhau — hai khoảng đó phải giữ nguyên.
    """
    out = [list(item) for item in intervals]
    merged = True
    while merged:
        merged = False
        for i in range(len(out)):
            for j in range(i + 1, len(out)):
                first, second = out[i], out[j]
                if first[0] <= second[1] and second[0] <= first[1]:
                    out[i] = [min(first[0], second[0]), max(first[1], second[1])]
                    out.pop(j)
                    merged = True
                    break
            if merged:
                break
    return sorted(out)


problem(
    "merge-intervals", title="56. Merge Intervals",
    gen=_gen_intervals, oracle=_oracle_merge,
    cases=[([],), ([[1, 3]],), ([[1, 3], [2, 6], [8, 10], [15, 18]],),
           ([[1, 4], [4, 5]],), ([[1, 4], [0, 4]],), ([[1, 4], [2, 3]],)],
)


# --- 57. Insert Interval ------------------------------------------------------


def _merge_plain(intervals):
    out = []
    for start, end in sorted(intervals):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


def _gen_insert(rng, size):
    existing = _merge_plain(_intervals(rng, max(0, min(size, 7))))
    start = rng.randint(0, 20)
    return (existing, [start, start + rng.randint(0, 6)])


def _oracle_insert(intervals, new_interval):
    return _oracle_merge(list(intervals) + [list(new_interval)])


problem(
    "insert-interval", title="57. Insert Interval",
    gen=_gen_insert, oracle=_oracle_insert,
    cases=[([], [5, 7]), ([[1, 3], [6, 9]], [2, 5]),
           ([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]),
           ([[1, 5]], [2, 3]), ([[1, 5]], [6, 8])],
)


# --- 66. Plus One -------------------------------------------------------------


def _gen_digits(rng, size):
    digits = [rng.randint(0, 9) for _ in range(max(1, size))]
    if len(digits) > 1 and digits[0] == 0:
        digits[0] = rng.randint(1, 9)
    return (digits,)


def _oracle_plus_one(digits):
    value = int("".join(str(digit) for digit in digits)) + 1
    return [int(letter) for letter in str(value)]


problem(
    "plus-one", title="66. Plus One",
    gen=_gen_digits, oracle=_oracle_plus_one,
    cases=[([0],), ([9],), ([1, 2, 3],), ([9, 9],), ([4, 3, 2, 1],), ([1, 9, 9],)],
)


# --- 68. Text Justification ---------------------------------------------------


def _pack(line, length, max_width):
    """Rải khoảng trắng cho một dòng đã chốt; dòng một từ thì canh trái."""
    if len(line) == 1:
        return line[0] + " " * (max_width - length)
    gaps = len(line) - 1
    base, extra = divmod(max_width - length, gaps)
    out = ""
    for index, word in enumerate(line[:-1]):
        out += word + " " * (base + (1 if index < extra else 0))
    return out + line[-1]


def _oracle_justify(words, max_width):
    lines, line, length = [], [], 0
    for word in words:
        if line and length + len(line) + len(word) > max_width:
            lines.append(_pack(line, length, max_width))
            line, length = [], 0
        line.append(word)
        length += len(word)
    last = " ".join(line)
    lines.append(last + " " * (max_width - len(last)))
    return lines


def _gen_words(rng, size):
    max_width = rng.randint(4, 12)
    words = ["".join(rng.choice("abc") for _ in range(rng.randint(1, max_width)))
             for _ in range(max(1, min(size, 9)))]
    return (words, max_width)


problem(
    "text-justification", title="68. Text Justification",
    gen=_gen_words, oracle=_oracle_justify,
    cases=[(["a"], 1), (["a", "b"], 1),
           (["This", "is", "an", "example", "of", "text", "justification."], 16),
           (["What", "must", "be", "acknowledgment", "shall", "be"], 16)],
)


# --- 134. Gas Station ---------------------------------------------------------


def _gen_gas(rng, size):
    length = max(1, min(size, 10))
    gas = [rng.randint(0, 6) for _ in range(length)]
    cost = [rng.randint(0, 6) for _ in range(length)]
    return (gas, cost)


def _oracle_gas_station(gas, cost):
    """Thử xuất phát từ mọi trạm, chạy hết một vòng."""
    for start in range(len(gas)):
        tank = 0
        for step in range(len(gas)):
            here = (start + step) % len(gas)
            tank += gas[here] - cost[here]
            if tank < 0:
                break
        else:
            return start
    return -1


def _cap_gas(args, ret):
    """Có thể có nhiều trạm xuất phát chạy được, đề chỉ đòi một trạm hợp lệ."""
    gas, cost = args
    if not isinstance(ret, int):
        return "phải trả về một số nguyên"
    if ret == -1:
        return "KHÔNG CÓ TRẠM NÀO" if _oracle_gas_station(gas, cost) == -1 else \
            "trả về -1 nhưng thật ra có trạm xuất phát chạy được"
    if not 0 <= ret < len(gas):
        return "index trạm nằm ngoài danh sách"
    tank = 0
    for step in range(len(gas)):
        here = (ret + step) % len(gas)
        tank += gas[here] - cost[here]
        if tank < 0:
            return "xuất phát từ trạm đó thì hết xăng giữa đường"
    return OK


def _big_gas(size):
    """Chỉ trạm CUỐI chạy được, và mọi trạm khác chỉ hết xăng ở gần cuối vòng.

    Đặt chỗ thiếu xăng ngay đầu danh sách thì mọi trạm đều chết ở bước đầu tiên
    và cách thử mọi trạm chỉ tốn O(n). Đặt nó ở áp chót thì trạm k phải chạy
    gần trọn một vòng mới biết là hỏng, nên tổng công việc thành n^2 / 2.
    """
    gas = [1] * size
    cost = [1] * size
    cost[size - 2] = 2
    cost[size - 1] = 0
    return (gas, cost)


def _fast_gas_station(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    start, tank = 0, 0
    for index in range(len(gas)):
        tank += gas[index] - cost[index]
        if tank < 0:
            start, tank = index + 1, 0
    return start


problem(
    "gas-station", title="134. Gas Station",
    gen=_gen_gas, oracle=_oracle_gas_station, capture=_cap_gas,
    cases=[([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), ([2, 3, 4], [3, 4, 3]),
           ([5], [4]), ([1], [2]), ([0, 0], [0, 0])],
    big=_big_gas, fast_oracle=_fast_gas_station, sizes=(250, 1000, 8000),
)


# --- 135. Candy ---------------------------------------------------------------


def _gen_ratings(rng, size):
    return ([rng.randint(0, 4) for _ in range(max(1, size))],)


def _oracle_candy(ratings):
    """Cứ ai bị thiệt thì cho thêm một cái, lặp tới khi không ai kêu nữa."""
    candies = [1] * len(ratings)
    changed = True
    while changed:
        changed = False
        for index in range(len(ratings)):
            left_bad = index and ratings[index] > ratings[index - 1] \
                and candies[index] <= candies[index - 1]
            right_bad = index + 1 < len(ratings) and ratings[index] > ratings[index + 1] \
                and candies[index] <= candies[index + 1]
            if left_bad or right_bad:
                candies[index] += 1
                changed = True
    return sum(candies)


def _fast_candy(ratings):
    candies = [1] * len(ratings)
    for index in range(1, len(ratings)):
        if ratings[index] > ratings[index - 1]:
            candies[index] = candies[index - 1] + 1
    for index in range(len(ratings) - 2, -1, -1):
        if ratings[index] > ratings[index + 1]:
            candies[index] = max(candies[index], candies[index + 1] + 1)
    return sum(candies)


problem(
    "candy", title="135. Candy",
    gen=_gen_ratings, oracle=_oracle_candy,
    cases=[([1],), ([1, 0, 2],), ([1, 2, 2],), ([1, 2, 3, 4],), ([4, 3, 2, 1],),
           ([1, 3, 2, 2, 1],)],
    # Điểm tăng dần: vòng lặp-tới-khi-ổn-định phải chạy lại rất nhiều lượt.
    big=lambda size: (list(range(size)),),
    fast_oracle=_fast_candy, sizes=(200, 700, 4500),
)


# --- 179. Largest Number ------------------------------------------------------


def _gen_number_parts(rng, size):
    return ([rng.randint(0, 60) for _ in range(max(1, min(size, PERM_CAP)))],)


def _oracle_largest_number(nums):
    """Thử mọi thứ tự ghép — chỉ dùng được với ít số."""
    best = None
    for order in itertools.permutations(str(value) for value in nums):
        joined = "".join(order)
        if best is None or int(joined) > int(best):
            best = joined
    return str(int(best))


problem(
    "largest-number", title="179. Largest Number",
    gen=_gen_number_parts, oracle=_oracle_largest_number,
    cases=[([0],), ([0, 0],), ([10, 2],), ([3, 30, 34, 5, 9],), ([1],), ([12, 121],)],
)


# --- 228. Summary Ranges ------------------------------------------------------


def _gen_sorted_distinct(rng, size):
    return (sorted(rng.sample(range(-15, 15), min(size, 25))),)


def _oracle_summary_ranges(nums):
    out = []
    index = 0
    while index < len(nums):
        start = index
        while index + 1 < len(nums) and nums[index + 1] == nums[index] + 1:
            index += 1
        if start == index:
            out.append(str(nums[start]))
        else:
            out.append(str(nums[start]) + "->" + str(nums[index]))
        index += 1
    return out


problem(
    "summary-ranges", title="228. Summary Ranges",
    gen=_gen_sorted_distinct, oracle=_oracle_summary_ranges,
    cases=[([],), ([0],), ([0, 1, 2, 4, 5, 7],), ([0, 2, 3, 4, 6, 8, 9],), ([-1, 0],)],
)


# --- 220. Contains Duplicate III ----------------------------------------------


def _gen_close(rng, size):
    return ([rng.randint(0, 12) for _ in range(size)], rng.randint(0, 4), rng.randint(0, 3))


def _oracle_close_pair(nums, index_diff, value_diff):
    for i in range(len(nums)):
        for j in range(i + 1, min(len(nums), i + index_diff + 1)):
            if abs(nums[i] - nums[j]) <= value_diff:
                return True
    return False


def _fast_close_pair(nums, index_diff, value_diff):
    """Chia giá trị thành các rổ rộng `value_diff + 1`: hai số cùng rổ chắc chắn
    đủ gần, còn hai rổ kề nhau thì phải kiểm lại."""
    if index_diff <= 0 or value_diff < 0:
        return False
    width = value_diff + 1
    buckets = {}
    for index, value in enumerate(nums):
        if index > index_diff:
            buckets.pop(nums[index - index_diff - 1] // width, None)
        key = value // width
        if key in buckets:
            return True
        for near in (key - 1, key + 1):
            if near in buckets and abs(buckets[near] - value) <= value_diff:
                return True
        buckets[key] = value
    return False


problem(
    "contains-duplicate-iii", title="220. Contains Duplicate III",
    gen=_gen_close, oracle=_oracle_close_pair,
    cases=[([], 1, 1), ([1, 2, 3, 1], 3, 0), ([1, 5, 9, 1, 5, 9], 2, 3),
           ([1, 2], 0, 5), ([8, 7, 15, 1, 6, 1, 9, 15], 1, 3)],
    # Giá trị cách nhau xa và index_diff bằng nửa mảng: cửa sổ so từng cặp tốn n^2 / 2.
    big=lambda size: ([index * 10 for index in range(size)], size // 2, 3),
    fast_oracle=_fast_close_pair, sizes=BIG_SIZES,
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_merge(intervals):
    out = []
    for start, end in sorted(intervals):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


def _good_insert(intervals, new_interval):
    return _good_merge(list(intervals) + [list(new_interval)])


def _good_plus_one(digits):
    out = list(digits)
    index = len(out) - 1
    while index >= 0:
        if out[index] < 9:
            out[index] += 1
            return out
        out[index] = 0
        index -= 1
    return [1] + out


def _good_largest_number(nums):
    parts = [str(value) for value in nums]
    for i in range(len(parts)):
        for j in range(i + 1, len(parts)):
            if parts[i] + parts[j] < parts[j] + parts[i]:
                parts[i], parts[j] = parts[j], parts[i]
    return str(int("".join(parts)))


SAMPLES = {
    "merge-intervals": {
        "good": _good_merge,
        "hardcoded": lambda intervals: [[1, 6], [8, 10], [15, 18]],
        # Quên sắp xếp trước, nên chỉ gộp được các khoảng vốn đã liền nhau.
        "wrong": lambda intervals: [list(item) for item in intervals],
    },
    "insert-interval": {
        "good": _good_insert,
        "hardcoded": lambda intervals, new_interval: [[1, 5], [6, 9]],
        "wrong": lambda intervals, new_interval: [list(item) for item in intervals]
                 + [list(new_interval)],
    },
    "plus-one": {
        "good": _good_plus_one,
        "hardcoded": lambda digits: [1, 2, 4],
        # Quên trường hợp nhớ tràn ra chữ số mới, như [9, 9] thành [1, 0, 0].
        "wrong": lambda digits: (list(digits[:-1]) + [digits[-1] + 1]) if digits[-1] < 9
                 else list(digits),
    },
    "text-justification": {
        "good": _oracle_justify,
        "hardcoded": lambda words, max_width: ["This    is    an", "example  of text",
                                               "justification.  "],
        # Canh đều cả dòng cuối, trong khi dòng cuối phải canh trái.
        "wrong": lambda words, max_width: [" ".join(words)],
    },
    "gas-station": {
        "good": _fast_gas_station,
        "hardcoded": lambda gas, cost: 3,
        "wrong": lambda gas, cost: 0,
        "slow": _oracle_gas_station,
    },
    "candy": {
        "good": _fast_candy,
        "hardcoded": lambda ratings: 5,
        # Chỉ so với bạn bên trái, quên chiều ngược lại.
        "wrong": lambda ratings: len(ratings),
        "slow": _oracle_candy,
    },
    "largest-number": {
        "good": _good_largest_number,
        "hardcoded": lambda nums: "9534330",
        # Sắp xếp theo giá trị số thay vì theo thứ tự ghép.
        "wrong": lambda nums: str(int("".join(str(value)
                                              for value in sorted(nums, reverse=True)))),
    },
    "summary-ranges": {
        "good": _oracle_summary_ranges,
        "hardcoded": lambda nums: ["0->2", "4->5", "7"],
        # Luôn viết dạng a->b, kể cả khi khoảng chỉ có một số.
        "wrong": lambda nums: [str(value) + "->" + str(value) for value in nums],
    },
    "contains-duplicate-iii": {
        "good": _fast_close_pair,
        "hardcoded": lambda nums, index_diff, value_diff: True,
        # Quên điều kiện khoảng cách vị trí.
        "wrong": lambda nums, index_diff, value_diff: len(set(nums)) != len(nums),
        "slow": _oracle_close_pair,
    },
}
