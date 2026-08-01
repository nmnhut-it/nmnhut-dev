"""leet_pointers — cụm hai con trỏ, cửa sổ trượt và sửa mảng tại chỗ.

Dùng như leet_arrays:

    from leet_pointers import check

    def sort_colors(nums):
        ...

    check("sort-colors", sort_colors)

Bài đang có: three-sum-closest · four-sum · next-permutation · sort-colors
· remove-duplicates-ii · two-sum-sorted · rotate-array
· minimum-size-subarray-sum · product-except-self

Xem README "Auto-graded algorithm problems" cho ý nghĩa từng field.
"""

import itertools
import random

from leet_judge import check, list_problems, problem

OK = "ĐÁP ÁN HỢP LỆ"
# Oracle của next-permutation và four-sum liệt kê mọi khả năng, nên ca ngẫu
# nhiên phải nhỏ; ca biên viết tay lo phần còn lại.
BRUTE_CAP = 8


def _nums(rng, size, low=-20, high=20):
    return [rng.randint(low, high) for _ in range(size)]


def _ramp(size):
    """Dữ liệu ca đo giờ: dãy tăng dần, không phụ thuộc máy chấm."""
    return list(range(size))


def _cap_first_arg(args, ret):
    """Bài sửa tại chỗ: kết quả nằm trong list đã bị sửa, không phải giá trị trả về."""
    return args[0]


# --- 16. 3Sum Closest ---------------------------------------------------------


def _gen_three_closest(rng, size):
    return (_nums(rng, max(3, size)), rng.randint(-30, 30))


def _oracle_three_closest(nums, target):
    best = None
    for triple in itertools.combinations(nums, 3):
        total = sum(triple)
        if best is None or abs(total - target) < abs(best - target):
            best = total
    return best


def _cap_three_closest(args, ret):
    """Hai tổng có thể cách target bằng nhau (14 và 16 với target 15), và cả
    hai đều là đáp án đúng. Nên chấm khoảng cách tới target, kèm điều kiện tổng
    đó phải thật sự lấy được từ ba phần tử — nếu không thì trả bừa `target` là
    qua."""
    nums, target = args
    if not isinstance(ret, int):
        return "phải trả về tổng của ba phần tử"
    reachable = set(sum(triple) for triple in itertools.combinations(nums, 3))
    if ret not in reachable:
        return "không có ba phần tử nào cộng lại ra số đó"
    return abs(ret - target)


problem(
    "three-sum-closest", title="16. 3Sum Closest",
    gen=_gen_three_closest, oracle=_oracle_three_closest, capture=_cap_three_closest,
    cases=[([-1, 2, 1, -4], 1), ([0, 0, 0], 1), ([1, 1, 1, 0], -100), ([4, 0, 5, -5, 3, 3, 0, -4, -5], -2)],
)


# --- 18. 4Sum -----------------------------------------------------------------


def _gen_four_sum(rng, size):
    return (_nums(rng, min(size, BRUTE_CAP + 2), -6, 6), rng.randint(-8, 8))


def _oracle_four_sum(nums, target):
    found = set()
    for quad in itertools.combinations(nums, 4):
        if sum(quad) == target:
            found.add(tuple(sorted(quad)))
    return [list(quad) for quad in found]


def _norm_quads(value):
    """Thứ tự bộ bốn và thứ tự trong bộ bốn đều tự do; không được có bộ trùng."""
    if not isinstance(value, (list, tuple)):
        return "phải trả về danh sách các bộ bốn"
    quads = []
    for item in value:
        if not isinstance(item, (list, tuple)) or len(item) != 4:
            return "mỗi phần tử phải là một bộ bốn số"
        quads.append(tuple(sorted(item)))
    if len(set(quads)) != len(quads):
        return "danh sách có bộ bốn bị lặp — kết quả phải không trùng"
    return sorted(quads)


problem(
    "four-sum", title="18. 4Sum",
    gen=_gen_four_sum, oracle=_oracle_four_sum, normalize=_norm_quads,
    cases=[([], 0), ([1, 0, -1, 0, -2, 2], 0), ([2, 2, 2, 2, 2], 8), ([0, 0, 0, 0], 0)],
)


# --- 31. Next Permutation -----------------------------------------------------


def _gen_next_perm(rng, size):
    return (_nums(rng, min(max(1, size), BRUTE_CAP), 0, 3),)


def _oracle_next_perm(nums):
    """Liệt kê mọi hoán vị rồi lấy cái kế tiếp — chậm nhưng không thể sai."""
    ordered = sorted(set(itertools.permutations(nums)))
    position = ordered.index(tuple(nums))
    nums[:] = list(ordered[(position + 1) % len(ordered)])


problem(
    "next-permutation", title="31. Next Permutation",
    gen=_gen_next_perm, oracle=_oracle_next_perm, capture=_cap_first_arg,
    cases=[([1],), ([1, 2, 3],), ([3, 2, 1],), ([1, 1, 5],), ([2, 3, 1],), ([1, 3, 2],)],
)


# --- 75. Sort Colors ----------------------------------------------------------


def _gen_colors(rng, size):
    return (_nums(rng, size, 0, 2),)


def _oracle_sort_colors(nums):
    nums.sort()


problem(
    "sort-colors", title="75. Sort Colors",
    gen=_gen_colors, oracle=_oracle_sort_colors, capture=_cap_first_arg,
    cases=[([],), ([2],), ([2, 0, 2, 1, 1, 0],), ([2, 0, 1],), ([0, 0, 0],), ([2, 2, 2],)],
)


# --- 80. Remove Duplicates from Sorted Array II -------------------------------


def _gen_remove_dups_ii(rng, size):
    return (sorted(rng.randint(0, 4) for _ in range(size)),)


def _oracle_remove_dups_ii(nums):
    kept = []
    for value in nums:
        if len(kept) < 2 or kept[-2] != value:
            kept.append(value)
    nums[:len(kept)] = kept
    return len(kept)


def _cap_prefix(args, ret):
    if not isinstance(ret, int):
        return "phải trả về số phần tử còn lại"
    return (ret, args[0][:ret])


problem(
    "remove-duplicates-ii", title="80. Remove Duplicates from Sorted Array II",
    gen=_gen_remove_dups_ii, oracle=_oracle_remove_dups_ii, capture=_cap_prefix,
    cases=[([],), ([1],), ([1, 1, 1, 2, 2, 3],), ([0, 0, 1, 1, 1, 1, 2, 3, 3],), ([1, 1],)],
)


# --- 167. Two Sum II — Input Array Is Sorted ----------------------------------


def _gen_two_sum_sorted(rng, size):
    nums = sorted(_nums(rng, max(2, size)))
    left = rng.randrange(len(nums) - 1)
    right = rng.randrange(left + 1, len(nums))
    return (nums, nums[left] + nums[right])


def _oracle_two_sum_sorted(numbers, target):
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1]
    return []


def _cap_two_sum_sorted(args, ret):
    """Đáp án đánh số từ 1, và có thể có nhiều cặp đúng nên chấm tính hợp lệ."""
    numbers, target = args
    if not isinstance(ret, (list, tuple)) or len(ret) != 2:
        return "cần trả về đúng hai vị trí"
    first, second = ret
    if not isinstance(first, int) or not isinstance(second, int):
        return "hai phần tử trả về phải là số nguyên"
    if not (1 <= first < second <= len(numbers)):
        return "hai vị trí phải đánh số từ 1 và vị trí trước phải nhỏ hơn vị trí sau"
    if numbers[first - 1] + numbers[second - 1] != target:
        return "hai giá trị tại hai vị trí đó không cộng ra target"
    return OK


def _big_two_sum_sorted(size):
    """Cặp duy nhất nằm ở CUỐI mảng, xem _big_two_sum bên leet_arrays.

    Đặt ở hai đầu thì cách quét đôi tìm thấy ngay ở vòng lặp đầu tiên nên vẫn
    kịp giờ; ở cuối thì nó phải duyệt trọn n^2 / 2 lần.
    """
    numbers = [index * 2 for index in range(size)]
    return (numbers, numbers[-1] + numbers[-2])


problem(
    "two-sum-sorted", title="167. Two Sum II - Input Array Is Sorted",
    gen=_gen_two_sum_sorted, oracle=_oracle_two_sum_sorted, capture=_cap_two_sum_sorted,
    cases=[([2, 7, 11, 15], 9), ([2, 3, 4], 6), ([-1, 0], -1), ([1, 1], 2)],
    big=_big_two_sum_sorted, sizes=(250, 1000, 12000),
)


# --- 189. Rotate Array --------------------------------------------------------


def _gen_rotate(rng, size):
    return (_nums(rng, max(1, size)), rng.randint(0, 3 * size + 2))


def _oracle_rotate(nums, k):
    shift = k % len(nums)
    nums[:] = nums[len(nums) - shift:] + nums[:len(nums) - shift]


problem(
    "rotate-array", title="189. Rotate Array",
    gen=_gen_rotate, oracle=_oracle_rotate, capture=_cap_first_arg,
    cases=[([1], 0), ([1], 5), ([1, 2, 3, 4, 5, 6, 7], 3), ([-1, -100, 3, 99], 2), ([1, 2], 3)],
    big=lambda size: (_ramp(size), size // 2), fast_oracle=_oracle_rotate,
    sizes=(250, 1000, 12000),
)


# --- 209. Minimum Size Subarray Sum -------------------------------------------


def _gen_min_window(rng, size):
    nums = [rng.randint(1, 10) for _ in range(size)]
    return (rng.randint(1, 40), nums)


def _oracle_min_window(target, nums):
    best = 0
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            if total >= target:
                if best == 0 or j - i + 1 < best:
                    best = j - i + 1
                break
    return best


def _fast_min_window(target, nums):
    best, total, left = 0, 0, 0
    for right, value in enumerate(nums):
        total += value
        while total >= target:
            if best == 0 or right - left + 1 < best:
                best = right - left + 1
            total -= nums[left]
            left += 1
    return best


def _big_min_window(size):
    """Không có đoạn nào đủ tổng, nên cách quét đôi không thoát sớm được."""
    return (size * 100, [1] * size)


problem(
    "minimum-size-subarray-sum", title="209. Minimum Size Subarray Sum",
    gen=_gen_min_window, oracle=_oracle_min_window,
    cases=[(7, [2, 3, 1, 2, 4, 3]), (4, [1, 4, 4]), (11, [1, 1, 1, 1, 1, 1, 1, 1]), (1, []), (5, [5])],
    big=_big_min_window, fast_oracle=_fast_min_window, sizes=(250, 1000, 12000),
)


# --- 238. Product of Array Except Self ----------------------------------------


def _gen_product(rng, size):
    return ([rng.randint(-4, 4) for _ in range(max(2, size))],)


def _oracle_product(nums):
    out = []
    for i in range(len(nums)):
        product = 1
        for j in range(len(nums)):
            if j != i:
                product *= nums[j]
        out.append(product)
    return out


def _fast_product(nums):
    out = [1] * len(nums)
    running = 1
    for i in range(len(nums)):
        out[i] = running
        running *= nums[i]
    running = 1
    for i in range(len(nums) - 1, -1, -1):
        out[i] *= running
        running *= nums[i]
    return out


problem(
    "product-except-self", title="238. Product of Array Except Self",
    gen=_gen_product, oracle=_oracle_product,
    cases=[([1, 2, 3, 4],), ([-1, 1, 0, -3, 3],), ([0, 0],), ([1, 0],), ([2, 3],)],
    # Số 1 để tích không phình thành số nguyên lớn, che mất khác biệt tốc độ.
    big=lambda size: ([1] * size,), fast_oracle=_fast_product, sizes=(250, 1000, 8000),
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_three_closest(nums, target):
    nums = sorted(nums)
    best = nums[0] + nums[1] + nums[2]
    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if abs(total - target) < abs(best - target):
                best = total
            if total < target:
                left += 1
            elif total > target:
                right -= 1
            else:
                return total
    return best


def _good_four_sum(nums, target):
    nums = sorted(nums)
    found = set()
    for i in range(len(nums) - 3):
        for j in range(i + 1, len(nums) - 2):
            left, right = j + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[j] + nums[left] + nums[right]
                if total < target:
                    left += 1
                elif total > target:
                    right -= 1
                else:
                    found.add((nums[i], nums[j], nums[left], nums[right]))
                    left += 1
    return [list(quad) for quad in found]


def _good_next_permutation(nums):
    pivot = len(nums) - 2
    while pivot >= 0 and nums[pivot] >= nums[pivot + 1]:
        pivot -= 1
    if pivot >= 0:
        swap = len(nums) - 1
        while nums[swap] <= nums[pivot]:
            swap -= 1
        nums[pivot], nums[swap] = nums[swap], nums[pivot]
    nums[pivot + 1:] = reversed(nums[pivot + 1:])


def _good_sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
        else:
            mid += 1


def _good_remove_duplicates_ii(nums):
    write = 0
    for value in nums:
        if write < 2 or nums[write - 2] != value:
            nums[write] = value
            write += 1
    return write


def _good_two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1
        else:
            right -= 1
    return []


def _good_rotate(nums, k):
    shift = k % len(nums)
    nums.reverse()
    nums[:shift] = reversed(nums[:shift])
    nums[shift:] = reversed(nums[shift:])


def _slow_rotate(nums, k):
    """Đúng nhưng dịch từng bước một, nên tốn O(n * k).

    Phải dịch bằng vòng for của Python: `nums.insert(0, nums.pop())` cũng là
    O(n * k) nhưng phần dịch chạy bằng C nên vẫn kịp giờ, không lộ ra là chậm.
    """
    for _ in range(k % len(nums)):
        last = nums[-1]
        for index in range(len(nums) - 1, 0, -1):
            nums[index] = nums[index - 1]
        nums[0] = last


SAMPLES = {
    "three-sum-closest": {
        "good": _good_three_closest,
        "hardcoded": lambda nums, target: 2,
        "wrong": lambda nums, target: sum(sorted(nums)[:3]),
    },
    "four-sum": {
        "good": _good_four_sum,
        "hardcoded": lambda nums, target: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]],
        "wrong": lambda nums, target: [],
    },
    "next-permutation": {
        "good": _good_next_permutation,
        "hardcoded": lambda nums: nums.__setitem__(slice(None), [1, 3, 2]),
        "wrong": lambda nums: nums.sort(),
    },
    "sort-colors": {
        "good": _good_sort_colors,
        "hardcoded": lambda nums: nums.__setitem__(slice(None), [0, 0, 1, 1, 2, 2]),
        "wrong": lambda nums: nums.reverse(),
    },
    "remove-duplicates-ii": {
        "good": _good_remove_duplicates_ii,
        "hardcoded": lambda nums: 5,
        "wrong": lambda nums: len(nums),
    },
    "two-sum-sorted": {
        "good": _good_two_sum_sorted,
        "hardcoded": lambda numbers, target: [1, 2],
        "wrong": lambda numbers, target: [0, 1],
        "slow": _oracle_two_sum_sorted,
    },
    "rotate-array": {
        "good": _good_rotate,
        "hardcoded": lambda nums, k: nums.__setitem__(slice(None), [5, 6, 7, 1, 2, 3, 4]),
        "wrong": lambda nums, k: nums.__setitem__(slice(None), nums[k:] + nums[:k]),
        "slow": _slow_rotate,
    },
    "minimum-size-subarray-sum": {
        "good": _fast_min_window,
        "hardcoded": lambda target, nums: 2,
        "wrong": lambda target, nums: len(nums),
        "slow": _oracle_min_window,
    },
    "product-except-self": {
        "good": _fast_product,
        "hardcoded": lambda nums: [24, 12, 8, 6],
        "wrong": lambda nums: [sum(nums) - value for value in nums],
        "slow": _oracle_product,
    },
}
