"""leet_hash — cụm đếm và nhóm: bảng tần suất, tập hợp, XOR.

    from leet_hash import check

    def contains_duplicate(nums):
        ...

    check("contains-duplicate", contains_duplicate)

Điểm chung của cụm: cách làm hiển nhiên là so từng cặp một, đúng nhưng O(n^2).
Nên phần lớn bài ở đây có ca đo giờ, và mẫu "chậm" chính là cách so từng cặp.

Bài đang có: longest-common-prefix · group-anagrams · longest-consecutive
· single-number · single-number-ii · majority-element · majority-element-ii
· contains-duplicate · contains-nearby-duplicate
"""

from leet_judge import check, list_problems, problem

LETTERS = "abc"
BIG_SIZES = (250, 1000, 8000)
# Vòng `for` trần của Python chạy được cỡ 7e7 vòng mỗi giây, nên n = 8000 chỉ
# tốn ~1 giây cho cách O(n^2) — chưa quá ngưỡng. Mấy bài đó cần thang cao hơn.
WIDE_SIZES = (250, 1000, 20000)


def _count_slowly(nums, wanted):
    """Đếm bằng vòng `for` của Python, không dùng `nums.count`.

    `nums.count(x)` và `x in nums` cũng là O(n) nhưng chạy bằng C, nhanh gấp
    hàng chục lần. Mẫu "chậm" nào dựa vào chúng sẽ vẫn kịp giờ ở ca lớn, và ca
    đo giờ khi đó không chặn được gì.
    """
    found = 0
    for value in nums:
        if value == wanted:
            found += 1
    return found


def _has_slowly(nums, wanted):
    for value in nums:
        if value == wanted:
            return True
    return False


def _words(rng, count, length=4):
    return ["".join(rng.choice(LETTERS) for _ in range(rng.randint(0, length)))
            for _ in range(count)]


def _norm_groups(value):
    """Thứ tự các nhóm và thứ tự trong mỗi nhóm đều tự do."""
    if not isinstance(value, (list, tuple)):
        return "phải trả về một list các nhóm"
    groups = []
    for item in value:
        if not isinstance(item, (list, tuple)):
            return "mỗi nhóm phải là một list"
        groups.append(tuple(sorted(item)))
    return sorted(groups)


# --- 14. Longest Common Prefix ------------------------------------------------


def _gen_strs(rng, size):
    """Cho các chuỗi dùng chung một phần đầu, nếu không thì đáp án hầu như luôn rỗng."""
    shared = "".join(rng.choice(LETTERS) for _ in range(rng.randint(0, 3)))
    return ([shared + word for word in _words(rng, max(1, size % 5 + 1))],)


def _oracle_common_prefix(strs):
    prefix = ""
    for index in range(min(len(word) for word in strs)):
        letter = strs[0][index]
        if any(word[index] != letter for word in strs):
            break
        prefix += letter
    return prefix


problem(
    "longest-common-prefix", title="14. Longest Common Prefix",
    gen=_gen_strs, oracle=_oracle_common_prefix,
    cases=[(["flower", "flow", "flight"],), (["dog", "racecar", "car"],), (["a"],),
           ([""],), (["ab", "ab"],)],
)


# --- 49. Group Anagrams -------------------------------------------------------


def _gen_anagrams(rng, size):
    return (_words(rng, max(1, size)),)


def _oracle_group_anagrams(strs):
    groups = {}
    for word in strs:
        groups.setdefault("".join(sorted(word)), []).append(word)
    return list(groups.values())


problem(
    "group-anagrams", title="49. Group Anagrams",
    gen=_gen_anagrams, oracle=_oracle_group_anagrams, normalize=_norm_groups,
    cases=[([""],), (["a"],), (["eat", "tea", "tan", "ate", "nat", "bat"],),
           (["ab", "ba", "abc"],)],
)


# --- 128. Longest Consecutive Sequence ----------------------------------------


def _gen_runs(rng, size):
    return ([rng.randint(-12, 12) for _ in range(size)],)


def _oracle_longest_consecutive(nums):
    """Với mỗi số, đếm chuỗi liên tiếp bắt đầu từ nó bằng cách dò cả list."""
    best = 0
    for value in nums:
        length = 1
        nxt = value + 1
        while _has_slowly(nums, nxt):
            length += 1
            nxt += 1
        best = max(best, length)
    return best


def _fast_longest_consecutive(nums):
    pool = set(nums)
    best = 0
    for value in pool:
        if value - 1 in pool:
            continue
        length = 1
        while value + length in pool:
            length += 1
        best = max(best, length)
    return best


problem(
    "longest-consecutive", title="128. Longest Consecutive Sequence",
    gen=_gen_runs, oracle=_oracle_longest_consecutive,
    cases=[([],), ([1],), ([100, 4, 200, 1, 3, 2],), ([0, 3, 7, 2, 5, 8, 4, 6, 0, 1],),
           ([1, 1, 1],)],
    # Toàn số khác nhau và rời rạc: `nxt in nums` phải quét cả list mỗi lần.
    big=lambda size: ([index * 3 for index in range(size)],),
    fast_oracle=_fast_longest_consecutive, sizes=WIDE_SIZES,
)


# --- 136. Single Number -------------------------------------------------------


def _gen_pairs(rng, size, copies=2):
    values = rng.sample(range(-40, 40), max(1, size % 9 + 1))
    numbers = []
    for value in values[1:]:
        numbers.extend([value] * copies)
    numbers.append(values[0])
    rng.shuffle(numbers)
    return (numbers,)


def _oracle_single_number(nums):
    for value in nums:
        if _count_slowly(nums, value) == 1:
            return value
    return 0


problem(
    "single-number", title="136. Single Number",
    gen=_gen_pairs, oracle=_oracle_single_number,
    cases=[([1],), ([2, 2, 1],), ([4, 1, 2, 1, 2],), ([0, 1, 0],)],
    # Mỗi số xuất hiện đúng hai lần trừ một số: `nums.count` quét cả list mỗi lần.
    big=lambda size: (list(range(size)) + list(range(size)) + [-1],),
    fast_oracle=lambda nums: -1, sizes=BIG_SIZES,
)


# --- 137. Single Number II ----------------------------------------------------


def _gen_triples(rng, size):
    return _gen_pairs(rng, size, copies=3)


def _oracle_single_number_ii(nums):
    for value in nums:
        if _count_slowly(nums, value) == 1:
            return value
    return 0


problem(
    "single-number-ii", title="137. Single Number II",
    gen=_gen_triples, oracle=_oracle_single_number_ii,
    cases=[([1],), ([2, 2, 3, 2],), ([0, 1, 0, 1, 0, 1, 99],), ([-2, -2, 1, -2],)],
    big=lambda size: (list(range(size)) * 3 + [-1],),
    fast_oracle=lambda nums: -1, sizes=BIG_SIZES,
)


# --- 169. Majority Element ----------------------------------------------------


def _big_majority(size):
    """Các số lẻ loi đứng TRƯỚC, phần tử chiếm đa số dồn về sau.

    Nếu để phần tử đa số đứng đầu thì cách đếm-từng-giá-trị trúng ngay ở lần
    đếm đầu tiên và thoát sau O(n) — ca đo giờ khi đó không chặn được gì.
    """
    return (list(range(1, size - size // 2)) + [0] * (size // 2 + 1),)


def _gen_majority(rng, size):
    """Đề bảo đảm luôn có phần tử xuất hiện quá nửa."""
    length = max(1, size)
    winner = rng.randint(0, 5)
    numbers = [winner] * (length // 2 + 1)
    numbers += [rng.randint(0, 5) for _ in range(length - len(numbers))]
    rng.shuffle(numbers)
    return (numbers,)


def _oracle_majority(nums):
    for value in nums:
        if _count_slowly(nums, value) > len(nums) // 2:
            return value
    return 0


problem(
    "majority-element", title="169. Majority Element",
    gen=_gen_majority, oracle=_oracle_majority,
    cases=[([3],), ([3, 2, 3],), ([2, 2, 1, 1, 1, 2, 2],), ([1, 1],)],
    big=_big_majority, fast_oracle=lambda nums: 0, sizes=WIDE_SIZES,
)


# --- 229. Majority Element II -------------------------------------------------


def _gen_thirds(rng, size):
    return ([rng.randint(0, 4) for _ in range(max(1, size))],)


def _oracle_majority_ii(nums):
    return [value for value in set(nums) if nums.count(value) > len(nums) // 3]


def _norm_values(value):
    if not isinstance(value, (list, tuple)):
        return "phải trả về một list"
    if len(set(value)) != len(value):
        return "có giá trị bị lặp — mỗi giá trị chỉ được xuất hiện một lần"
    return sorted(value)


problem(
    "majority-element-ii", title="229. Majority Element II",
    gen=_gen_thirds, oracle=_oracle_majority_ii, normalize=_norm_values,
    cases=[([3],), ([1, 2],), ([3, 2, 3],), ([1, 1, 1, 3, 3, 2, 2, 2],), ([2, 2],)],
)


# --- 217. Contains Duplicate --------------------------------------------------


def _gen_maybe_dup(rng, size):
    return ([rng.randint(0, max(2, size)) for _ in range(size)],)


def _oracle_contains_duplicate(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False


problem(
    "contains-duplicate", title="217. Contains Duplicate",
    gen=_gen_maybe_dup, oracle=_oracle_contains_duplicate,
    cases=[([],), ([1],), ([1, 2, 3, 1],), ([1, 2, 3, 4],), ([1, 1, 1, 3, 3, 4, 3, 2, 4, 2],)],
    # Toàn số khác nhau: cách so từng cặp phải duyệt trọn n^2 / 2 lần.
    big=lambda size: (list(range(size)),),
    fast_oracle=lambda nums: False, sizes=(250, 1000, 12000),
)


# --- 219. Contains Duplicate II -----------------------------------------------


def _gen_nearby(rng, size):
    return ([rng.randint(0, max(2, size // 2)) for _ in range(size)], rng.randint(0, 4))


def _oracle_contains_nearby(nums, k):
    for i in range(len(nums)):
        for j in range(i + 1, min(len(nums), i + k + 1)):
            if nums[i] == nums[j]:
                return True
    return False


problem(
    "contains-nearby-duplicate", title="219. Contains Duplicate II",
    gen=_gen_nearby, oracle=_oracle_contains_nearby,
    cases=[([], 0), ([1, 2, 3, 1], 3), ([1, 0, 1, 1], 1), ([1, 2, 3, 1, 2, 3], 2),
           ([1, 1], 0)],
    # k bằng nửa mảng và không có số nào trùng: cửa sổ so từng cặp tốn n^2 / 2.
    big=lambda size: (list(range(size)), size // 2),
    fast_oracle=lambda nums, k: False, sizes=WIDE_SIZES,
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


def _good_common_prefix(strs):
    prefix = strs[0]
    for word in strs[1:]:
        while not word.startswith(prefix):
            prefix = prefix[:-1]
    return prefix


def _good_group_anagrams(strs):
    groups = {}
    for word in strs:
        groups.setdefault("".join(sorted(word)), []).append(word)
    return list(groups.values())


def _good_single_number(nums):
    answer = 0
    for value in nums:
        answer ^= value
    return answer


def _good_single_number_ii(nums):
    counts = {}
    for value in nums:
        counts[value] = counts.get(value, 0) + 1
    for value, times in counts.items():
        if times == 1:
            return value
    return 0


def _good_majority(nums):
    winner, votes = None, 0
    for value in nums:
        if votes == 0:
            winner = value
        votes += 1 if value == winner else -1
    return winner


def _good_majority_ii(nums):
    counts = {}
    for value in nums:
        counts[value] = counts.get(value, 0) + 1
    return [value for value, times in counts.items() if times > len(nums) // 3]


def _good_contains_duplicate(nums):
    return len(set(nums)) != len(nums)


def _good_contains_nearby(nums, k):
    last = {}
    for index, value in enumerate(nums):
        if value in last and index - last[value] <= k:
            return True
        last[value] = index
    return False


SAMPLES = {
    "longest-common-prefix": {
        "good": _good_common_prefix,
        "hardcoded": lambda strs: "fl",
        "wrong": lambda strs: strs[0],
    },
    "group-anagrams": {
        "good": _good_group_anagrams,
        "hardcoded": lambda strs: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
        # Nhóm theo chữ cái đầu thay vì theo tập chữ cái.
        "wrong": lambda strs: [[word] for word in strs],
    },
    "longest-consecutive": {
        "good": _fast_longest_consecutive,
        "hardcoded": lambda nums: 4,
        "wrong": lambda nums: len(set(nums)),
        "slow": _oracle_longest_consecutive,
    },
    "single-number": {
        "good": _good_single_number,
        "hardcoded": lambda nums: 1,
        "wrong": lambda nums: nums[0],
        "slow": _oracle_single_number,
    },
    "single-number-ii": {
        "good": _good_single_number_ii,
        "hardcoded": lambda nums: 99,
        "wrong": _good_single_number,
        "slow": _oracle_single_number_ii,
    },
    "majority-element": {
        "good": _good_majority,
        "hardcoded": lambda nums: 3,
        "wrong": lambda nums: max(nums),
        "slow": _oracle_majority,
    },
    "majority-element-ii": {
        "good": _good_majority_ii,
        "hardcoded": lambda nums: [1, 2],
        # Nhầm "quá một phần ba" thành "quá một nửa".
        "wrong": lambda nums: [value for value in set(nums)
                               if nums.count(value) > len(nums) // 2],
    },
    "contains-duplicate": {
        "good": _good_contains_duplicate,
        "hardcoded": lambda nums: True,
        "wrong": lambda nums: False,
        "slow": _oracle_contains_duplicate,
    },
    "contains-nearby-duplicate": {
        "good": _good_contains_nearby,
        "hardcoded": lambda nums, k: True,
        # Quên điều kiện khoảng cách: chỉ cần có số trùng là đã trả về True.
        "wrong": lambda nums, k: len(set(nums)) != len(nums),
        "slow": _oracle_contains_nearby,
    },
}
