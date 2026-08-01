"""leet_arrays — nhóm bài mảng và hai con trỏ, đăng ký vào `leet_judge`.

Học sinh chỉ cần:

    from leet_arrays import check

    def two_sum(nums, target):
        ...

    check("two-sum", two_sum)

Mỗi bài khai báo `oracle` brute-force (chậm nhưng chắc đúng) để đối chiếu, và
bài nào cấm cách làm O(n^2) thì có thêm `big` + `fast_oracle` để đo giờ.

Bài đang có: two-sum · remove-duplicates · remove-element · merge-sorted-array
· container-with-most-water · maximum-subarray · trapping-rain-water · three-sum
"""

import random

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"

# --- helpers dùng chung -------------------------------------------------------


def _nums(rng, size, low=-50, high=50):
    return [rng.randint(low, high) for _ in range(size)]


def _sorted_nums(rng, size, low=-30, high=30):
    return sorted(_nums(rng, size, low, high))


def _big_nums(size, low=0, high=10 ** 6):
    """Dữ liệu ca đo giờ — seed cố định nên mọi máy chấm ra cùng một kết quả."""
    rng = random.Random(7)
    return [rng.randint(low, high) for _ in range(size)]


# --- 1. Two Sum ---------------------------------------------------------------


def _gen_two_sum(rng, size):
    nums = _nums(rng, max(2, size))
    left = rng.randrange(len(nums))
    right = rng.randrange(len(nums))
    while right == left:
        right = rng.randrange(len(nums))
    return (nums, nums[left] + nums[right])


def _oracle_two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


def _big_two_sum(size):
    """Ca đo giờ chỉ có ĐÚNG MỘT cặp hợp lệ, nên cách quét đôi phải duyệt hết.

    Dùng các số chẵn 0, 2, 4, … và target là tổng hai số lớn nhất: muốn
    2a + 2b bằng tổng đó thì a + b phải bằng đúng mức lớn nhất có thể, và chỉ
    hai số lớn nhất đạt được. Nếu để dữ liệu ngẫu nhiên thì sẽ có cặp khác
    trùng tổng nằm ở đầu mảng, và cách quét đôi thoát sớm nên vẫn kịp giờ.
    Cặp đó nằm ở cuối mảng, nên cách quét đôi phải duyệt trọn n^2 / 2 lần.
    """
    nums = [index * 2 for index in range(size)]
    return (nums, (size - 1) * 2 + (size - 2) * 2)


def _cap_two_sum(args, ret):
    """Bài này có thể có nhiều cặp index đúng, nên chấm tính hợp lệ."""
    nums, target = args
    if not isinstance(ret, (list, tuple)) or len(ret) != 2:
        return "cần trả về đúng hai index"
    i, j = ret
    if not isinstance(i, int) or not isinstance(j, int):
        return "hai phần tử trả về phải là số nguyên (index)"
    if i == j:
        return "hai index không được trùng nhau"
    if not (0 <= i < len(nums)) or not (0 <= j < len(nums)):
        return "index nằm ngoài mảng"
    if nums[i] + nums[j] != target:
        return "hai giá trị tại hai index đó không cộng ra target"
    return OK


problem(
    "two-sum", title="1. Two Sum",
    gen=_gen_two_sum, oracle=_oracle_two_sum, capture=_cap_two_sum,
    cases=[([2, 7, 11, 15], 9), ([3, 2, 4], 6), ([3, 3], 6), ([0, 0], 0)],
    big=_big_two_sum, sizes=(250, 1000, 12000),
)


# --- 26. Remove Duplicates from Sorted Array ----------------------------------


def _gen_remove_dups(rng, size):
    return (sorted(rng.randint(-6, 6) for _ in range(size)),)


def _oracle_remove_dups(nums):
    kept = []
    for value in nums:
        if not kept or kept[-1] != value:
            kept.append(value)
    nums[:len(kept)] = kept
    return len(kept)


def _cap_prefix(args, ret):
    """Bài sửa tại chỗ: chấm cả số trả về lẫn phần đầu mảng đã bị sửa."""
    if not isinstance(ret, int):
        return "phải trả về số phần tử còn lại"
    return (ret, args[0][:ret])


problem(
    "remove-duplicates", title="26. Remove Duplicates from Sorted Array",
    gen=_gen_remove_dups, oracle=_oracle_remove_dups, capture=_cap_prefix,
    cases=[([],), ([1],), ([1, 1, 2],), ([0, 0, 1, 1, 1, 2, 2, 3, 3, 4],)],
)


# --- 27. Remove Element -------------------------------------------------------


def _gen_remove_element(rng, size):
    return (_nums(rng, size, 0, 4), rng.randint(0, 4))


def _oracle_remove_element(nums, val):
    kept = [value for value in nums if value != val]
    nums[:len(kept)] = kept
    return len(kept)


def _cap_prefix_unordered(args, ret):
    """Thứ tự phần còn lại không quan trọng, nên sắp xếp trước khi so."""
    if not isinstance(ret, int):
        return "phải trả về số phần tử còn lại"
    return (ret, sorted(args[0][:ret]))


problem(
    "remove-element", title="27. Remove Element",
    gen=_gen_remove_element, oracle=_oracle_remove_element,
    capture=_cap_prefix_unordered,
    cases=[([], 0), ([3, 2, 2, 3], 3), ([0, 1, 2, 2, 3, 0, 4, 2], 2), ([2, 2, 2], 2)],
)


# --- 88. Merge Sorted Array ---------------------------------------------------


def _gen_merge(rng, size):
    m = rng.randint(0, size)
    n = rng.randint(0, size)
    return (_sorted_nums(rng, m) + [0] * n, m, _sorted_nums(rng, n), n)


def _oracle_merge(nums1, m, nums2, n):
    nums1[:] = sorted(nums1[:m] + nums2[:n])
    return None


def _cap_first_arg(args, ret):
    return args[0]


problem(
    "merge-sorted-array", title="88. Merge Sorted Array",
    gen=_gen_merge, oracle=_oracle_merge, capture=_cap_first_arg,
    cases=[([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3), ([1], 1, [], 0), ([0], 0, [1], 1)],
)


# --- 11. Container With Most Water -------------------------------------------


def _gen_heights(rng, size):
    return ([rng.randint(0, 40) for _ in range(max(2, size))],)


def _oracle_container(height):
    best = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            best = max(best, (j - i) * min(height[i], height[j]))
    return best


def _fast_container(height):
    left, right, best = 0, len(height) - 1, 0
    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best


problem(
    "container-with-most-water", title="11. Container With Most Water",
    gen=_gen_heights, oracle=_oracle_container,
    cases=[([1, 8, 6, 2, 5, 4, 8, 3, 7],), ([1, 1],), ([0, 0],), ([1, 2, 1],)],
    # 4000 nằm sát ngưỡng 2 giây nên có máy cho lọt cách quét đôi; 8000 thì không.
    big=lambda size: (_big_nums(size, 0, 10 ** 4),), fast_oracle=_fast_container,
    sizes=(250, 1000, 8000),
)


# --- 53. Maximum Subarray -----------------------------------------------------


def _gen_nonempty(rng, size):
    return (_nums(rng, max(1, size)),)


def _oracle_max_subarray(nums):
    best = nums[0]
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            best = max(best, total)
    return best


def _fast_max_subarray(nums):
    best = running = nums[0]
    for value in nums[1:]:
        running = max(value, running + value)
        best = max(best, running)
    return best


problem(
    "maximum-subarray", title="53. Maximum Subarray",
    gen=_gen_nonempty, oracle=_oracle_max_subarray,
    cases=[([-2, 1, -3, 4, -1, 2, 1, -5, 4],), ([1],), ([-1],), ([-2, -1],), ([5, 4, -1, 7, 8],)],
    big=lambda size: (_big_nums(size, -1000, 1000),), fast_oracle=_fast_max_subarray,
    sizes=(250, 1000, 8000),
)


# --- 42. Trapping Rain Water --------------------------------------------------


def _oracle_trap(height):
    total = 0
    for i in range(len(height)):
        left = max(height[:i + 1])
        right = max(height[i:])
        total += min(left, right) - height[i]
    return total


def _fast_trap(height):
    if not height:
        return 0
    left, right = 0, len(height) - 1
    left_max, right_max, total = height[0], height[-1], 0
    while left < right:
        if left_max <= right_max:
            left += 1
            left_max = max(left_max, height[left])
            total += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            total += right_max - height[right]
    return total


def _gen_bars(rng, size):
    return ([rng.randint(0, 8) for _ in range(size)],)


problem(
    "trapping-rain-water", title="42. Trapping Rain Water",
    gen=_gen_bars, oracle=_oracle_trap,
    cases=[([],), ([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],), ([4, 2, 0, 3, 2, 5],), ([3, 3, 3],)],
    # Thang cao hơn mặc định: cách quét lại `max(height[:i])` chạy bằng C nên ở
    # n = 4000 vẫn kịp giờ; phải tới 20000 mới lộ ra là O(n^2).
    big=lambda size: (_big_nums(size, 0, 10 ** 4),), fast_oracle=_fast_trap,
    sizes=(250, 2000, 20000),
)


# --- 15. 3Sum -----------------------------------------------------------------


def _gen_three_sum(rng, size):
    return (_nums(rng, size, -8, 8),)


def _oracle_three_sum(nums):
    found = set()
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            for k in range(j + 1, len(nums)):
                if nums[i] + nums[j] + nums[k] == 0:
                    found.add(tuple(sorted((nums[i], nums[j], nums[k]))))
    return [list(triple) for triple in found]


def _norm_triples(value):
    """Thứ tự bộ ba và thứ tự trong bộ ba đều tự do, nên chuẩn hoá cả hai."""
    if isinstance(value, str):
        return value
    if not isinstance(value, (list, tuple)):
        return "phải trả về danh sách các bộ ba"
    triples = []
    for item in value:
        if not isinstance(item, (list, tuple)) or len(item) != 3:
            return "mỗi phần tử phải là một bộ ba số"
        triples.append(tuple(sorted(item)))
    if len(set(triples)) != len(triples):
        return "danh sách có bộ ba bị lặp — kết quả phải không trùng"
    return sorted(triples)


problem(
    "three-sum", title="15. 3Sum",
    gen=_gen_three_sum, oracle=_oracle_three_sum, normalize=_norm_triples,
    cases=[([],), ([0, 0, 0],), ([-1, 0, 1, 2, -1, -4],), ([1, 2, 3],), ([0, 0, 0, 0],)],
)


# --- 41. First Missing Positive -----------------------------------------------


def _has_slowly(nums, wanted):
    """Dò bằng vòng `for` của Python — `wanted in nums` chạy bằng C, nhanh gấp
    chục lần, và mẫu chậm dựa vào nó sẽ vẫn kịp giờ ở ca lớn."""
    for value in nums:
        if value == wanted:
            return True
    return False


def _gen_missing_positive(rng, size):
    return ([rng.randint(-3, size + 2) for _ in range(size)],)


def _oracle_first_missing(nums):
    candidate = 1
    while _has_slowly(nums, candidate):
        candidate += 1
    return candidate


def _fast_first_missing(nums):
    pool = set(nums)
    candidate = 1
    while candidate in pool:
        candidate += 1
    return candidate


problem(
    "first-missing-positive", title="41. First Missing Positive",
    gen=_gen_missing_positive, oracle=_oracle_first_missing,
    cases=[([],), ([1],), ([2],), ([1, 2, 0],), ([3, 4, -1, 1],), ([7, 8, 9, 11, 12],),
           ([1, 1],), ([-5, -3],)],
    # Đủ mọi số từ 1 tới n: cách dò từng số phải quét trọn mảng n lần.
    # 12000 cho cách dò từng số ~2,8 giây — ngay sát ngưỡng 2 giây nên có lần
    # máy đo được dưới ngưỡng; 20000 đưa nó lên ~8,6 giây, hết chập chờn.
    big=lambda size: (list(range(1, size + 1)),),
    fast_oracle=_fast_first_missing, sizes=(250, 1000, 20000),
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------
#
# py/test_leet_judge.py đọc bảng này: mỗi bài phải có lời giải ĐÚNG (bắt buộc
# qua), một bản HARD-CODE và một bản SAI LOGIC (bắt buộc trượt), và bài nào có
# `big` thì thêm một bản ĐÚNG NHƯNG CHẬM (cũng phải trượt). Thiếu một ô là test
# đỏ — nhờ vậy không thêm được bài mà quên kiểm tra chính bộ chấm.


def _good_two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        if target - value in seen:
            return [seen[target - value], index]
        seen[value] = index
    return []


def _good_remove_duplicates(nums):
    write = 0
    for value in nums:
        if write == 0 or nums[write - 1] != value:
            nums[write] = value
            write += 1
    return write


def _good_remove_element(nums, val):
    write = 0
    for value in nums:
        if value != val:
            nums[write] = value
            write += 1
    return write


def _good_merge(nums1, m, nums2, n):
    write = m + n - 1
    i, j = m - 1, n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[write] = nums1[i]
            i -= 1
        else:
            nums1[write] = nums2[j]
            j -= 1
        write -= 1


def _good_three_sum(nums):
    nums = sorted(nums)
    out = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                out.append([nums[i], nums[left], nums[right]])
                left += 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
    return out


SAMPLES = {
    "two-sum": {
        "good": _good_two_sum,
        "hardcoded": lambda nums, target: [0, 1],
        "wrong": lambda nums, target: [0, 0],
        "slow": _oracle_two_sum,
    },
    "remove-duplicates": {
        "good": _good_remove_duplicates,
        "hardcoded": lambda nums: 5,
        "wrong": lambda nums: len(nums),
    },
    "remove-element": {
        "good": _good_remove_element,
        "hardcoded": lambda nums, val: 2,
        "wrong": lambda nums, val: len(nums),
    },
    "merge-sorted-array": {
        "good": _good_merge,
        "hardcoded": lambda nums1, m, nums2, n: None,
        "wrong": lambda nums1, m, nums2, n: nums1.sort(),
    },
    "container-with-most-water": {
        "good": _fast_container,
        "hardcoded": lambda height: 49,
        "wrong": lambda height: max(height),
        "slow": _oracle_container,
    },
    "maximum-subarray": {
        "good": _fast_max_subarray,
        "hardcoded": lambda nums: 6,
        "wrong": lambda nums: max(sum(nums), max(nums)),
        "slow": _oracle_max_subarray,
    },
    "trapping-rain-water": {
        "good": _fast_trap,
        "hardcoded": lambda height: 6,
        "wrong": lambda height: sum(height),
        "slow": _oracle_trap,
    },
    "first-missing-positive": {
        "good": _fast_first_missing,
        "hardcoded": lambda nums: 2,
        # Quên rằng số bị thiếu có thể lớn hơn mọi số dương đang có.
        "wrong": lambda nums: min([v for v in nums if v > 0], default=1),
        "slow": _oracle_first_missing,
    },
    "three-sum": {
        "good": _good_three_sum,
        "hardcoded": lambda nums: [[-1, -1, 2], [-1, 0, 1]],
        "wrong": lambda nums: [[0, 0, 0]],
    },
}
