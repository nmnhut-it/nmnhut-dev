// Đảo luyện tập LeetCode — cụm hai con trỏ, cửa sổ trượt và sửa mảng tại chỗ.
// Chấm bằng py/leet_judge như leetARRAYS; xem file đó cho khuôn chung.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ VÁCH ĐÁ HAI ĐẦU ✦",
    hook: "Đảo trước bạn học đặt hai vị trí ở hai đầu một list rồi cho chúng đi vào giữa. Chín bài ở đây đều xoay quanh đúng ý đó, nhưng mỗi bài bẻ nó một kiểu khác: hai vị trí cùng chiều, một cửa sổ co giãn, hay một vòng quét ngược từ cuối lên.",
    art: "assets/old-computer.webp",
  } },

  { quiz: { title: "Nhớ lại đảo trước", questions: [
    { q: "Một list đã sắp xếp tăng dần, bạn đặt `left` ở đầu và `right` ở cuối, rồi xét `nums[left] + nums[right]`. Tổng đang NHỎ HƠN target thì nên dịch vị trí nào?",
      a: ["Dịch `left` sang phải, vì chỉ cách đó mới làm tổng tăng lên", "Dịch `right` sang trái, để thu hẹp khoảng cách", "Dịch cả hai vào giữa cùng lúc", "Quay lại đặt `left` về `0`"], correct: 0 },
    { q: "Vì sao cách hai con trỏ chỉ dùng được khi list ĐÃ sắp xếp?",
      a: ["Vì nhờ có thứ tự mới biết chắc dịch vị trí nào thì tổng tăng, dịch vị trí nào thì tổng giảm", "Vì list chưa sắp xếp thì không lấy được `nums[left]`", "Vì `while` chỉ chạy được trên list đã sắp xếp", "Vì list chưa sắp xếp luôn có phần tử trùng nhau"], correct: 0 },
  ] } },

  { npc: "Ở đảo này có bốn bài sửa thẳng trên list được truyền vào. Máy chấm đọc chính list đó sau khi hàm chạy xong, nên tạo một list mới rồi trả về là trượt." },

  task("sort-colors", "sort_colors.py",
    "ĐỀ BÀI\nCho sẵn list `nums` chỉ gồm ba giá trị `0`, `1` và `2`.\nPROCESS: viết hàm `sort_colors(nums)` sắp xếp thẳng trên `nums` cho các số `0` dồn về đầu, rồi tới các số `1`, cuối cùng là các số `2`.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `nums` sau khi hàm chạy xong. List rỗng vẫn phải chạy được.\nVí dụ: `[2, 0, 2, 1, 1, 0]` thành `[0, 0, 1, 1, 2, 2]`.",
    `from leet_pointers import check


def sort_colors(nums):
    # lượt của bạn
    pass


check("sort-colors", sort_colors)
`,
    `from leet_pointers import check


def sort_colors(nums):
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


check("sort-colors", sort_colors)
`),

  task("remove-duplicates-ii", "remove_duplicates_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần.\nPROCESS: viết hàm `remove_duplicates(nums)` sửa thẳng trên `nums`, giữ lại mỗi giá trị NHIỀU NHẤT HAI lần, thứ tự tăng dần không đổi.\nOUTPUT: trả về số phần tử còn lại; phần `nums` từ index đó trở đi ra sao cũng được.\nVí dụ: `[1, 1, 1, 2, 2, 3]` thành `[1, 1, 2, 2, 3, ...]` và trả về `5`. Với `[1, 1]` thì không bỏ gì cả, trả về `2`.",
    `from leet_pointers import check


def remove_duplicates(nums):
    # lượt của bạn
    return len(nums)


check("remove-duplicates-ii", remove_duplicates)
`,
    `from leet_pointers import check


def remove_duplicates(nums):
    write = 0
    for value in nums:
        if write < 2 or nums[write - 2] != value:
            nums[write] = value
            write += 1
    return write


check("remove-duplicates-ii", remove_duplicates)
`),

  { checkpoint: { text: "Bài giữ lại nhiều nhất hai bản của mỗi giá trị vẫn dùng đúng một biến `write` như bài giữ một bản. Chỗ khác duy nhất là điều kiện: so giá trị đang xét với `nums[write - 2]` thay vì `nums[write - 1]`, tức là nhìn lùi hai ô đã ghi thay vì một." } },

  { quiz: { title: "Nhìn lùi bao nhiêu ô", questions: [
    { q: "Hàm dưới đây chạy trên `nums = [1, 1, 1, 2]`.\n\n```python\ndef remove_duplicates(nums):\n    write = 0\n    for value in nums:\n        if write < 2 or nums[write - 2] != value:\n            nums[write] = value\n            write += 1\n    return write\n```\n\nHàm trả về số nào?",
      a: ["`3`", "`4`", "`2`", "`1`"], correct: 0 },
    { q: "Vẫn hàm trên, vì sao điều kiện phải có thêm vế `write < 2`?",
      a: ["Vì lúc mới ghi được 0 hoặc 1 phần tử thì chưa có ô `write - 2` để so, và `nums[-1]` sẽ lấy nhầm phần tử cuối list", "Vì `write` không được là số âm", "Vì list luôn có ít nhất hai phần tử", "Vì nếu thiếu nó thì hàm trả về số lớn hơn thực tế"], correct: 0 },
  ] } },

  task("two-sum-sorted", "two_sum_sorted.py",
    "ĐỀ BÀI\nCho sẵn list `numbers` ĐÃ sắp xếp tăng dần và một số `target`. Trong list luôn tồn tại hai vị trí khác nhau có tổng bằng `target`.\nPROCESS: viết hàm `two_sum(numbers, target)`.\nOUTPUT: trả về list hai vị trí, ĐÁNH SỐ TỪ 1 (phần tử đầu list là vị trí `1`), và vị trí nhỏ đứng trước.\nVí dụ: `numbers = [2, 7, 11, 15]`, `target = 9` cho `[1, 2]`.\nCa lớn có hàng nghìn số và chỉ đúng một cặp hợp lệ, nên cách so từng cặp sẽ quá giờ. List đã sắp xếp — hãy tận dụng điều đó.",
    `from leet_pointers import check


def two_sum(numbers, target):
    # lượt của bạn
    return []


check("two-sum-sorted", two_sum)
`,
    `from leet_pointers import check


def two_sum(numbers, target):
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


check("two-sum-sorted", two_sum)
`),

  task("three-sum-closest", "three_sum_closest.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất ba phần tử, và một số `target`.\nPROCESS: viết hàm `three_sum_closest(nums, target)` chọn ba phần tử ở ba vị trí khác nhau sao cho tổng của chúng gần `target` nhất.\nOUTPUT: trả về chính tổng đó. Nếu có hai tổng cách `target` bằng nhau thì trả về tổng nào cũng được.\nVí dụ: `nums = [-1, 2, 1, -4]`, `target = 1` cho `2`, là tổng của `-1 + 2 + 1`.",
    `from leet_pointers import check


def three_sum_closest(nums, target):
    # lượt của bạn
    return 0


check("three-sum-closest", three_sum_closest)
`,
    `from leet_pointers import check


def three_sum_closest(nums, target):
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


check("three-sum-closest", three_sum_closest)
`),

  task("four-sum", "four_sum.py",
    "ĐỀ BÀI\nCho sẵn list `nums` và một số `target`.\nPROCESS: viết hàm `four_sum(nums, target)` tìm mọi bộ bốn giá trị lấy từ bốn vị trí khác nhau và cộng lại bằng `target`.\nOUTPUT: trả về list các bộ bốn. Thứ tự các bộ bốn và thứ tự số trong mỗi bộ bốn đều tự do, nhưng hai bộ bốn cùng tập giá trị chỉ được xuất hiện một lần.\nVí dụ: `nums = [1, 0, -1, 0, -2, 2]`, `target = 0` cho ba bộ bốn: `[-2, -1, 1, 2]`, `[-2, 0, 0, 2]` và `[-1, 0, 0, 1]`. Với list rỗng thì trả về list rỗng.",
    `from leet_pointers import check


def four_sum(nums, target):
    # lượt của bạn
    return []


check("four-sum", four_sum)
`,
    `from leet_pointers import check


def four_sum(nums, target):
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


check("four-sum", four_sum)
`),

  task("minimum-size-subarray-sum", "minimum_size_subarray_sum.py",
    "ĐỀ BÀI\nCho sẵn số `target` và list `nums` gồm các số nguyên dương.\nPROCESS: viết hàm `min_sub_array_len(target, nums)` tìm đoạn liền nhau NGẮN NHẤT có tổng lớn hơn hoặc bằng `target`.\nOUTPUT: trả về độ dài đoạn đó. Nếu không có đoạn nào đủ tổng thì trả về `0`.\nVí dụ: `target = 7`, `nums = [2, 3, 1, 2, 4, 3]` cho `2`, là đoạn `[4, 3]`.\nCa lớn có hàng nghìn số và không đoạn nào đủ tổng, nên cộng lại mọi đoạn sẽ quá giờ.",
    `from leet_pointers import check


def min_sub_array_len(target, nums):
    # lượt của bạn
    return 0


check("minimum-size-subarray-sum", min_sub_array_len)
`,
    `from leet_pointers import check


def min_sub_array_len(target, nums):
    best, total, left = 0, 0, 0
    for right, value in enumerate(nums):
        total += value
        while total >= target:
            if best == 0 or right - left + 1 < best:
                best = right - left + 1
            total -= nums[left]
            left += 1
    return best


check("minimum-size-subarray-sum", min_sub_array_len)
`),

  task("rotate-array", "rotate_array.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử và một số `k` không âm. `k` có thể lớn hơn độ dài list.\nPROCESS: viết hàm `rotate(nums, k)` xoay các phần tử sang PHẢI `k` bước, sửa thẳng trên `nums`.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `nums` sau khi hàm chạy xong.\nVí dụ: `nums = [1, 2, 3, 4, 5, 6, 7]`, `k = 3` cho `[5, 6, 7, 1, 2, 3, 4]`. Với `nums = [1, 2]`, `k = 3` thì kết quả giống như xoay `1` bước.\nCa lớn có `k` cỡ nửa độ dài list, nên xoay một bước rồi lặp lại `k` lần sẽ quá giờ.",
    `from leet_pointers import check


def rotate(nums, k):
    # lượt của bạn
    pass


check("rotate-array", rotate)
`,
    `from leet_pointers import check


def rotate(nums, k):
    shift = k % len(nums)
    nums.reverse()
    nums[:shift] = reversed(nums[:shift])
    nums[shift:] = reversed(nums[shift:])


check("rotate-array", rotate)
`),

  task("next-permutation", "next_permutation.py",
    "ĐỀ BÀI\nCho sẵn list `nums`. Xếp mọi cách sắp xếp lại các phần tử của nó theo thứ tự từ điển (so phần tử đầu trước, bằng nhau thì so phần tử sau).\nPROCESS: viết hàm `next_permutation(nums)` đổi `nums` thành cách sắp xếp ĐỨNG NGAY SAU nó trong thứ tự đó. Nếu `nums` đã là cách lớn nhất thì quay về cách nhỏ nhất. Sửa thẳng trên `nums`.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `nums` sau khi hàm chạy xong.\nVí dụ: `[1, 2, 3]` thành `[1, 3, 2]`; `[1, 3, 2]` thành `[2, 1, 3]`; `[3, 2, 1]` đã là lớn nhất nên quay về `[1, 2, 3]`.",
    `from leet_pointers import check


def next_permutation(nums):
    # lượt của bạn
    pass


check("next-permutation", next_permutation)
`,
    `from leet_pointers import check


def next_permutation(nums):
    pivot = len(nums) - 2
    while pivot >= 0 and nums[pivot] >= nums[pivot + 1]:
        pivot -= 1
    if pivot >= 0:
        swap = len(nums) - 1
        while nums[swap] <= nums[pivot]:
            swap -= 1
        nums[pivot], nums[swap] = nums[swap], nums[pivot]
    nums[pivot + 1:] = reversed(nums[pivot + 1:])


check("next-permutation", next_permutation)
`),

  task("product-except-self", "product_except_self.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất hai phần tử.\nPROCESS: viết hàm `product_except_self(nums)` tính, cho mỗi vị trí, tích của TẤT CẢ các phần tử khác vị trí đó. Không được dùng phép chia — list có thể chứa số `0`.\nOUTPUT: trả về một list mới cùng độ dài với `nums`.\nVí dụ: `[1, 2, 3, 4]` cho `[24, 12, 8, 6]`. Với `[0, 0]` cho `[0, 0]`.\nCa lớn có hàng nghìn số, nên với mỗi vị trí lại nhân lại cả list sẽ quá giờ.",
    `from leet_pointers import check


def product_except_self(nums):
    # lượt của bạn
    return []


check("product-except-self", product_except_self)
`,
    `from leet_pointers import check


def product_except_self(nums):
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


check("product-except-self", product_except_self)
`),

  { remember: "Chín bài này chia làm ba nhóm. Hai vị trí đi ngược chiều nhau dùng cho list đã sắp xếp. Một cửa sổ có hai mép cùng đi sang phải dùng khi cần đoạn liền nhau ngắn nhất hoặc dài nhất. Còn nhóm thứ ba quét một lượt xuôi rồi một lượt ngược, mỗi lượt mang theo một giá trị cộng dồn — nhờ vậy tránh được việc quét lại cả list cho từng vị trí." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · HAI CON TRỎ",
  sideIslandId: "leet-pointers",
  completionKey: "magicdust.leet.set.pointers",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Vách Đá Hai Đầu",
  subtitle: "chín bài LeetCode về hai con trỏ, cửa sổ trượt và sửa mảng tại chỗ",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ HAI ĐẦU" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "sinh ca thử rồi đối chiếu với lời giải chậm mà chắc đúng" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_pointers: "../py/leet_pointers/__init__.py",
  },
  cells,
  finish: { title: "VÁCH ĐÁ ĐÃ QUA", sub: "chín bài, không bài nào qua được bằng đáp án viết sẵn", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
