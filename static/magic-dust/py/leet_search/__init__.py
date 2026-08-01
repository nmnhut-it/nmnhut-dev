"""leet_search — cụm tìm kiếm nhị phân.

    from leet_search import check

    def search_insert(nums, target):
        ...

    check("search-insert-position", search_insert)

Cụm này không chấm được bằng đồng hồ. Quét tuyến tính 20000 phần tử trong
Python vẫn xong trong tích tắc, nên một lời giải `nums.index(target)` sẽ qua
mọi ca đo giờ dù nó chính là cách làm bài này cấm.

Nên ở đây dùng `probe`: mảng đưa cho học sinh là một list tự đếm số lần bị đọc,
và hàm phải trả lời trong khoảng mấy chục lần đọc. Nhị phân dùng ~log2(n) lần;
quét tuyến tính dùng n lần, lệch nhau ba bậc nên không thể lẫn.

Hai bài có phần tử trùng nhau (81, 154) không có `probe`: khi mảng toàn giá trị
giống nhau thì chính lời giải đúng cũng buộc phải đọc gần hết mảng.

Bài đang có: search-insert-position · search-rotated · search-rotated-ii
· search-range · search-2d-matrix · find-min-rotated · find-min-rotated-ii
· find-peak-element · median-two-sorted
"""

import math

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"
PROBE_SIZES = (2000, 20000)
# Nhị phân trên 20000 phần tử tốn ~15 lần đọc; cho rộng gấp mấy lần để lời giải
# đọc lặp hay chạy hai vòng nhị phân vẫn lọt, còn quét tuyến tính thì không.
PROBE_SLACK = 60
PROBE_PER_STEP = 6


class _Counted(list):
    """List tự đếm số lần bị đọc — cách duy nhất phân biệt nhị phân với quét.

    Phải bọc cả `__iter__` và `__contains__`: `for value in nums` và
    `target in nums` chạy thẳng bằng C của list gốc, không đi qua
    `__getitem__`, nên nếu chỉ bọc `__getitem__` thì một vòng quét tuyến tính
    sẽ hiện ra là không đọc lần nào.
    """

    def __init__(self, values):
        list.__init__(self, values)
        self.reads = 0

    def __getitem__(self, index):
        if isinstance(index, slice):
            self.reads += len(range(*index.indices(list.__len__(self))))
        else:
            self.reads += 1
        return list.__getitem__(self, index)

    def __iter__(self):
        for position in range(list.__len__(self)):
            self.reads += 1
            yield list.__getitem__(self, position)

    def __contains__(self, value):
        self.reads += list.__len__(self)
        return list.__contains__(self, value)


def _budget(span):
    return PROBE_SLACK + PROBE_PER_STEP * int(math.log2(span) + 1)


def _read_probe(build):
    """Tạo probe từ `build(size) -> (args, [list đếm đọc])`.

    Hạn mức tính theo TỔNG ĐỘ DÀI các list đếm được, không theo `size`. Bài ma
    trận chỉ đếm được lần đọc HÀNG, nên nếu lấy hạn mức theo số ô thì cách duyệt
    từng hàng của ma trận 142x142 vẫn lọt — 142 lần đọc dưới mức của 20000 ô.
    """
    def probe(fn):
        for size in PROBE_SIZES:
            args, counters = build(size)
            fn(*args)
            reads = sum(counter.reads for counter in counters)
            span = sum(len(counter) for counter in counters)
            allowed = _budget(span)
            if reads > allowed:
                return ("trên dữ liệu " + str(span) + " phần tử, hàm đọc "
                        + str(reads) + " lần, quá mức " + str(allowed)
                        + " lần cho phép — cách này đang duyệt gần hết dữ liệu"
                        " thay vì mỗi bước bỏ đi một nửa")
        return None
    return probe


def _rotate(values, shift):
    return values[shift:] + values[:shift]


# --- 35. Search Insert Position -----------------------------------------------


def _gen_sorted_distinct(rng, size):
    values = sorted(rng.sample(range(-40, 40), min(size, 60)))
    return (values, rng.randint(-42, 42))


def _oracle_search_insert(nums, target):
    for index, value in enumerate(nums):
        if value >= target:
            return index
    return len(nums)


problem(
    "search-insert-position", title="35. Search Insert Position",
    gen=_gen_sorted_distinct, oracle=_oracle_search_insert,
    cases=[([], 5), ([1, 3, 5, 6], 5), ([1, 3, 5, 6], 2), ([1, 3, 5, 6], 7), ([1, 3, 5, 6], 0)],
    probe=_read_probe(lambda size: (
        lambda nums: ((nums, size * 2 + 1), [nums]))(_Counted(range(0, size * 2, 2)))),
)


# --- 33. Search in Rotated Sorted Array ---------------------------------------


def _gen_rotated(rng, size):
    values = sorted(rng.sample(range(-40, 40), min(max(size, 1), 60)))
    values = _rotate(values, rng.randrange(len(values)))
    target = rng.choice(values) if rng.random() < 0.7 else rng.randint(-42, 42)
    return (values, target)


def _oracle_search_rotated(nums, target):
    for index, value in enumerate(nums):
        if value == target:
            return index
    return -1


problem(
    "search-rotated", title="33. Search in Rotated Sorted Array",
    gen=_gen_rotated, oracle=_oracle_search_rotated,
    cases=[([1], 0), ([1], 1), ([4, 5, 6, 7, 0, 1, 2], 0), ([4, 5, 6, 7, 0, 1, 2], 3), ([3, 1], 1)],
    probe=_read_probe(lambda size: (
        lambda nums: ((nums, 1), [nums]))(_Counted(_rotate(list(range(size)), size // 3)))),
)


# --- 81. Search in Rotated Sorted Array II ------------------------------------


def _gen_rotated_dups(rng, size):
    values = sorted(rng.randint(0, 5) for _ in range(max(size, 1)))
    values = _rotate(values, rng.randrange(len(values)))
    return (values, rng.randint(0, 6))


def _oracle_search_rotated_ii(nums, target):
    for value in nums:
        if value == target:
            return True
    return False


problem(
    "search-rotated-ii", title="81. Search in Rotated Sorted Array II",
    gen=_gen_rotated_dups, oracle=_oracle_search_rotated_ii,
    cases=[([1], 1), ([1], 0), ([2, 5, 6, 0, 0, 1, 2], 0), ([2, 5, 6, 0, 0, 1, 2], 3), ([1, 1, 1, 1], 1)],
)


# --- 34. Find First and Last Position -----------------------------------------


def _gen_sorted_dups(rng, size):
    return (sorted(rng.randint(0, 6) for _ in range(size)), rng.randint(0, 7))


def _oracle_search_range(nums, target):
    first = last = -1
    for index, value in enumerate(nums):
        if value == target:
            if first == -1:
                first = index
            last = index
    return [first, last]


problem(
    "search-range", title="34. Find First and Last Position of Element in Sorted Array",
    gen=_gen_sorted_dups, oracle=_oracle_search_range,
    cases=[([], 0), ([5, 7, 7, 8, 8, 10], 8), ([5, 7, 7, 8, 8, 10], 6), ([1], 1), ([2, 2, 2], 2)],
    probe=_read_probe(lambda size: (
        lambda nums: ((nums, size // 2), [nums]))(_Counted(range(size)))),
)


# --- 74. Search a 2D Matrix ---------------------------------------------------


def _gen_matrix(rng, size):
    rows = max(1, size % 4 + 1)
    cols = max(1, size % 3 + 1)
    values = sorted(rng.sample(range(-30, 60), rows * cols))
    matrix = [values[row * cols:(row + 1) * cols] for row in range(rows)]
    target = rng.choice(values) if rng.random() < 0.6 else rng.randint(-32, 62)
    return (matrix, target)


def _oracle_search_matrix(matrix, target):
    for row in matrix:
        for value in row:
            if value == target:
                return True
    return False


def _build_matrix_probe(size):
    """Ma trận vuông; chỉ đếm lần đọc HÀNG, đủ để lộ cách duyệt từng hàng."""
    side = int(math.sqrt(size)) + 1
    matrix = _Counted([list(range(row * side, (row + 1) * side)) for row in range(side)])
    return ((matrix, side * side - 1), [matrix])


problem(
    "search-2d-matrix", title="74. Search a 2D Matrix",
    gen=_gen_matrix, oracle=_oracle_search_matrix,
    cases=[([[1]], 1), ([[1]], 2), ([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3),
           ([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13)],
    probe=_read_probe(_build_matrix_probe),
)


# --- 153. Find Minimum in Rotated Sorted Array --------------------------------


def _gen_rotated_min(rng, size):
    values = sorted(rng.sample(range(-40, 40), min(max(size, 1), 60)))
    return (_rotate(values, rng.randrange(len(values))),)


def _oracle_find_min(nums):
    smallest = nums[0]
    for value in nums:
        if value < smallest:
            smallest = value
    return smallest


problem(
    "find-min-rotated", title="153. Find Minimum in Rotated Sorted Array",
    gen=_gen_rotated_min, oracle=_oracle_find_min,
    cases=[([1],), ([3, 4, 5, 1, 2],), ([4, 5, 6, 7, 0, 1, 2],), ([11, 13, 15, 17],), ([2, 1],)],
    probe=_read_probe(lambda size: (
        lambda nums: ((nums,), [nums]))(_Counted(_rotate(list(range(size)), size // 3)))),
)


# --- 154. Find Minimum in Rotated Sorted Array II -----------------------------


def _gen_rotated_min_dups(rng, size):
    values = sorted(rng.randint(0, 5) for _ in range(max(size, 1)))
    return (_rotate(values, rng.randrange(len(values))),)


problem(
    "find-min-rotated-ii", title="154. Find Minimum in Rotated Sorted Array II",
    gen=_gen_rotated_min_dups, oracle=_oracle_find_min,
    cases=[([1],), ([1, 3, 5],), ([2, 2, 2, 0, 1],), ([3, 3, 1, 3],), ([1, 1, 1],)],
)


# --- 162. Find Peak Element ---------------------------------------------------


def _gen_peak(rng, size):
    """Không có hai phần tử kề nhau bằng nhau, đúng ràng buộc của đề."""
    values = [rng.randint(-20, 20)]
    while len(values) < max(1, size):
        nxt = rng.randint(-20, 20)
        if nxt != values[-1]:
            values.append(nxt)
    return (values,)


def _oracle_find_peak(nums):
    best = 0
    for index, value in enumerate(nums):
        if value > nums[best]:
            best = index
    return best


def _cap_peak(args, ret):
    """Mảng có thể có nhiều đỉnh, và đề nhận đỉnh nào cũng được."""
    nums = args[0]
    if not isinstance(ret, int) or not (0 <= ret < len(nums)):
        return "phải trả về một index nằm trong mảng"
    if ret > 0 and nums[ret - 1] >= nums[ret]:
        return "phần tử bên trái không nhỏ hơn, nên đây không phải đỉnh"
    if ret < len(nums) - 1 and nums[ret + 1] >= nums[ret]:
        return "phần tử bên phải không nhỏ hơn, nên đây không phải đỉnh"
    return OK


def _build_peak_probe(size):
    """Dãy tăng dần: đỉnh duy nhất nằm ở cuối, cách quét phải đi hết mảng."""
    nums = _Counted(range(size))
    return ((nums,), [nums])


problem(
    "find-peak-element", title="162. Find Peak Element",
    gen=_gen_peak, oracle=_oracle_find_peak, capture=_cap_peak,
    cases=[([1],), ([1, 2, 3, 1],), ([1, 2, 1, 3, 5, 6, 4],), ([3, 2, 1],), ([1, 2],)],
    probe=_read_probe(_build_peak_probe),
)


# --- 4. Median of Two Sorted Arrays -------------------------------------------


def _gen_two_sorted(rng, size):
    first = sorted(rng.randint(-20, 20) for _ in range(rng.randint(0, size)))
    second = sorted(rng.randint(-20, 20) for _ in range(rng.randint(0, size)))
    if not first and not second:
        first = [rng.randint(-20, 20)]
    return (first, second)


def _oracle_median(nums1, nums2):
    merged = sorted(list(nums1) + list(nums2))
    middle = len(merged) // 2
    if len(merged) % 2:
        return float(merged[middle])
    return (merged[middle - 1] + merged[middle]) / 2


def _norm_median(value):
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        return "phải trả về một số"
    return round(float(value), 6)


def _build_median_probe(size):
    first = _Counted(range(0, size * 2, 2))
    second = _Counted(range(1, size * 2, 2))
    return ((first, second), [first, second])


problem(
    "median-two-sorted", title="4. Median of Two Sorted Arrays",
    gen=_gen_two_sorted, oracle=_oracle_median, normalize=_norm_median,
    cases=[([1, 3], [2]), ([1, 2], [3, 4]), ([], [1]), ([2], []), ([1, 1], [1, 1])],
    probe=_read_probe(_build_median_probe),
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_search_insert(nums, target):
    low, high = 0, len(nums)
    while low < high:
        mid = (low + high) // 2
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid
    return low


def _good_search_rotated(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        value = nums[mid]
        if value == target:
            return mid
        if nums[low] <= value:
            if nums[low] <= target < value:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if value < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1


def _good_search_rotated_ii(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        value = nums[mid]
        if value == target:
            return True
        if nums[low] == value == nums[high]:
            low += 1
            high -= 1
        elif nums[low] <= value:
            if nums[low] <= target < value:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if value < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    return False


def _bound(nums, target, first):
    low, high = 0, len(nums)
    while low < high:
        mid = (low + high) // 2
        value = nums[mid]
        if value > target or (first and value == target):
            high = mid
        else:
            low = mid + 1
    return low


def _good_search_range(nums, target):
    start = _bound(nums, target, True)
    if start == len(nums) or nums[start] != target:
        return [-1, -1]
    return [start, _bound(nums, target, False) - 1]


def _good_search_matrix(matrix, target):
    rows, cols = len(matrix), len(matrix[0])
    low, high = 0, rows * cols - 1
    while low <= high:
        mid = (low + high) // 2
        value = matrix[mid // cols][mid % cols]
        if value == target:
            return True
        if value < target:
            low = mid + 1
        else:
            high = mid - 1
    return False


def _good_find_min(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[high]:
            low = mid + 1
        else:
            high = mid
    return nums[low]


def _good_find_min_ii(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[high]:
            low = mid + 1
        elif nums[mid] < nums[high]:
            high = mid
        else:
            high -= 1
    return nums[low]


def _good_find_peak(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] < nums[mid + 1]:
            low = mid + 1
        else:
            high = mid
    return low


def _good_median(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    short, long = len(nums1), len(nums2)
    half = (short + long + 1) // 2
    low, high = 0, short
    while low <= high:
        cut = (low + high) // 2
        other = half - cut
        left1 = nums1[cut - 1] if cut > 0 else float("-inf")
        right1 = nums1[cut] if cut < short else float("inf")
        left2 = nums2[other - 1] if other > 0 else float("-inf")
        right2 = nums2[other] if other < long else float("inf")
        if left1 > right2:
            high = cut - 1
        elif left2 > right1:
            low = cut + 1
        elif (short + long) % 2:
            return float(max(left1, left2))
        else:
            return (max(left1, left2) + min(right1, right2)) / 2
    return 0.0


SAMPLES = {
    "search-insert-position": {
        "good": _good_search_insert,
        "hardcoded": lambda nums, target: 2,
        "wrong": lambda nums, target: len(nums),
        "linear": _oracle_search_insert,
    },
    "search-rotated": {
        "good": _good_search_rotated,
        "hardcoded": lambda nums, target: 4,
        "wrong": lambda nums, target: -1,
        "linear": _oracle_search_rotated,
    },
    "search-rotated-ii": {
        "good": _good_search_rotated_ii,
        "hardcoded": lambda nums, target: True,
        "wrong": lambda nums, target: False,
    },
    "search-range": {
        "good": _good_search_range,
        "hardcoded": lambda nums, target: [3, 4],
        "wrong": lambda nums, target: [-1, -1],
        "linear": _oracle_search_range,
    },
    "search-2d-matrix": {
        "good": _good_search_matrix,
        "hardcoded": lambda matrix, target: True,
        "wrong": lambda matrix, target: False,
        "linear": _oracle_search_matrix,
    },
    "find-min-rotated": {
        "good": _good_find_min,
        "hardcoded": lambda nums: 1,
        "wrong": lambda nums: nums[0],
        "linear": _oracle_find_min,
    },
    "find-min-rotated-ii": {
        "good": _good_find_min_ii,
        "hardcoded": lambda nums: 0,
        "wrong": lambda nums: nums[0],
    },
    "find-peak-element": {
        "good": _good_find_peak,
        "hardcoded": lambda nums: 2,
        "wrong": lambda nums: 0,
        "linear": _oracle_find_peak,
    },
    "median-two-sorted": {
        "good": _good_median,
        "hardcoded": lambda nums1, nums2: 2.0,
        "wrong": lambda nums1, nums2: 0.0,
        "linear": _oracle_median,
    },
}
