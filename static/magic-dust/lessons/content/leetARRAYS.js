// Đảo luyện tập LeetCode — nhóm mảng và hai con trỏ.
//
// Khác các đảo DSA cũ: ở đây không so khớp một dòng output cố định. Mỗi cell
// gọi `check(pid, ham_cua_ban)` trong py/leet_judge, bộ chấm tự sinh hàng trăm
// ca (ca biên viết tay + ca ngẫu nhiên đối chiếu lời giải brute-force + ca lớn
// đo giờ), nên viết sẵn đáp án vào code là trượt ngay.
//
// Thêm bài: đăng ký trong py/leet_arrays/__init__.py rồi thêm một cell ở đây.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ ĐẤU TRƯỜNG MẢNG ✦",
    hook: "Ở đây không ai chấm bạn bằng một ví dụ duy nhất. Mỗi lần bạn bấm RUN, bộ chấm dựng ra hàng trăm dữ liệu khác nhau — mảng rỗng, mảng một phần tử, mảng toàn số trùng, rồi một mảng dài hàng nghìn số — và so từng đáp án với lời giải chậm mà chắc đúng. Viết sẵn kết quả vào code sẽ lộ ngay từ ca thứ hai.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Mỗi bài bạn viết một hàm, rồi gọi `check(\"tên-bài\", tên_hàm)` ở dòng cuối. Máy chấm in ra `ALL TESTS PASSED` khi hàm đúng với mọi ca thử." },

  { npc: "Còn khi sai, nó in ra đúng dữ liệu làm hàm sai, đáp án đúng là gì và hàm của bạn trả về gì. Bạn đọc mấy dòng đó rồi sửa, khỏi phải đoán." },

  task("two-sum", "two_sum.py",
    "ĐỀ BÀI\nCho sẵn một list số nguyên `nums` và một số `target`. Trong mảng luôn tồn tại hai vị trí khác nhau có tổng đúng bằng `target`.\nPROCESS: viết hàm `two_sum(nums, target)`.\nOUTPUT: trả về list hai index của hai vị trí đó. Hai index nào cũng được, miễn khác nhau và hai giá trị tại đó cộng lại bằng `target`.\nVí dụ: `nums = [2, 7, 11, 15]`, `target = 9` thì `[0, 1]` hợp lệ.\nMảng ở ca lớn có hàng nghìn số, nên cách so từng cặp một sẽ quá giờ.",
    `from leet_arrays import check


def two_sum(nums, target):
    # lượt của bạn
    return []


check("two-sum", two_sum)
`,
    `from leet_arrays import check


def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        if target - value in seen:
            return [seen[target - value], index]
        seen[value] = index
    return []


check("two-sum", two_sum)
`),

  task("remove-duplicates", "remove_duplicates.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần, có thể có số trùng nhau.\nPROCESS: viết hàm `remove_duplicates(nums)` sửa thẳng trên `nums`, dồn mỗi giá trị chỉ còn một bản về đầu list, giữ nguyên thứ tự tăng dần. Không được tạo list mới rồi trả về nó — bộ chấm đọc chính `nums` sau khi hàm chạy xong.\nOUTPUT: trả về số phần tử còn lại. Phần `nums` từ index đó trở đi ra sao cũng được.\nVí dụ: `[0, 0, 1, 1, 2]` thành `[0, 1, 2, ...]` và trả về `3`. List rỗng trả về `0`.",
    `from leet_arrays import check


def remove_duplicates(nums):
    # lượt của bạn
    return len(nums)


check("remove-duplicates", remove_duplicates)
`,
    `from leet_arrays import check


def remove_duplicates(nums):
    write = 0
    for value in nums:
        if write == 0 or nums[write - 1] != value:
            nums[write] = value
            write += 1
    return write


check("remove-duplicates", remove_duplicates)
`),

  task("remove-element", "remove_element.py",
    "ĐỀ BÀI\nCho sẵn list `nums` chưa sắp xếp và một số `val`.\nPROCESS: viết hàm `remove_element(nums, val)` sửa thẳng trên `nums`, dồn mọi phần tử khác `val` về đầu list. Thứ tự các phần tử còn lại tự do.\nOUTPUT: trả về số phần tử còn lại.\nVí dụ: `nums = [3, 2, 2, 3]`, `val = 3` thì trả về `2` và hai ô đầu của `nums` là hai số `2`.",
    `from leet_arrays import check


def remove_element(nums, val):
    # lượt của bạn
    return len(nums)


check("remove-element", remove_element)
`,
    `from leet_arrays import check


def remove_element(nums, val):
    write = 0
    for value in nums:
        if value != val:
            nums[write] = value
            write += 1
    return write


check("remove-element", remove_element)
`),

  { checkpoint: { text: "Bài sửa tại chỗ trả về một con số, nhưng kết quả thật nằm trong list đã bị sửa. Một biến `write` chạy chậm hơn biến duyệt là đủ: đọc tới đâu, ghi giá trị được giữ lại vào vị trí `write` rồi tăng `write` lên." } },

  { quiz: { title: "Dồn phần tử về đầu list", questions: [
    { q: "Hàm dưới đây chạy trên `nums = [1, 2, 1, 3]` với `val = 1`.\n\n```python\ndef remove_element(nums, val):\n    write = 0\n    for value in nums:\n        if value != val:\n            nums[write] = value\n            write += 1\n    return write\n```\n\nSau khi hàm chạy xong, hai ô `nums[0]` và `nums[1]` mang giá trị nào?",
      a: ["`2` và `3`", "`1` và `2`", "`1` và `1`", "`3` và `2`"], correct: 0 },
    { q: "Vẫn hàm trên, nếu đổi `nums[write] = value` thành `nums[write] = val` thì chuyện gì xảy ra?",
      a: ["Đầu list toàn là giá trị cần bỏ, nên kết quả sai dù số trả về vẫn đúng", "Hàm báo lỗi vì `val` không phải index", "Không có gì đổi, vì `val` và `value` là một", "Số trả về giảm đi một"], correct: 0 },
    { q: "Vì sao hàm không được viết `nums = [v for v in nums if v != val]` rồi trả về `len(nums)`?",
      a: ["Vì phép gán đó chỉ đổi tên `nums` bên trong hàm, list gốc bên ngoài không đổi", "Vì list comprehension chạy chậm hơn vòng for", "Vì `len` không dùng được với list", "Vì như vậy thứ tự bị đảo ngược"], correct: 0 },
  ] } },

  task("merge-sorted-array", "merge_sorted_array.py",
    "ĐỀ BÀI\nCho sẵn `nums1` dài `m + n`: `m` ô đầu là các số đã sắp xếp tăng dần, `n` ô cuối là số `0` chỗ trống. `nums2` có `n` số cũng đã sắp xếp tăng dần.\nPROCESS: viết hàm `merge(nums1, m, nums2, n)` trộn hai dãy vào thẳng `nums1` sao cho cả `nums1` tăng dần.\nOUTPUT: hàm không cần trả về gì; bộ chấm đọc `nums1` sau khi hàm chạy xong.\nVí dụ: `nums1 = [1, 2, 3, 0, 0, 0]`, `m = 3`, `nums2 = [2, 5, 6]`, `n = 3` cho `[1, 2, 2, 3, 5, 6]`.",
    `from leet_arrays import check


def merge(nums1, m, nums2, n):
    # lượt của bạn
    pass


check("merge-sorted-array", merge)
`,
    `from leet_arrays import check


def merge(nums1, m, nums2, n):
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


check("merge-sorted-array", merge)
`),

  task("container-with-most-water", "container_with_most_water.py",
    "ĐỀ BÀI\nCho sẵn list `height`, mỗi số là chiều cao một cây cột dựng thẳng, cột thứ `i` ở toạ độ `i`. Chọn hai cột làm thành một cái bể; nước chứa được bằng khoảng cách giữa hai cột nhân với chiều cao của cột thấp hơn.\nPROCESS: viết hàm `max_area(height)`.\nOUTPUT: trả về lượng nước lớn nhất chứa được.\nVí dụ: `[1, 8, 6, 2, 5, 4, 8, 3, 7]` cho `49`.\nCa lớn có hàng nghìn cột, nên thử hết mọi cặp cột sẽ quá giờ.",
    `from leet_arrays import check


def max_area(height):
    # lượt của bạn
    return 0


check("container-with-most-water", max_area)
`,
    `from leet_arrays import check


def max_area(height):
    left, right, best = 0, len(height) - 1, 0
    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best


check("container-with-most-water", max_area)
`),

  task("maximum-subarray", "maximum_subarray.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một số, có thể có số âm.\nPROCESS: viết hàm `max_sub_array(nums)` tìm đoạn liền nhau (ít nhất một phần tử) có tổng lớn nhất.\nOUTPUT: trả về tổng lớn nhất đó.\nVí dụ: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` cho `6`, là tổng của đoạn `[4, -1, 2, 1]`. Với `[-3, -1, -7]` đáp án là `-1`, vì vẫn phải lấy ít nhất một phần tử.\nCa lớn có hàng nghìn số, nên cộng lại mọi đoạn sẽ quá giờ.",
    `from leet_arrays import check


def max_sub_array(nums):
    # lượt của bạn
    return 0


check("maximum-subarray", max_sub_array)
`,
    `from leet_arrays import check


def max_sub_array(nums):
    best = running = nums[0]
    for value in nums[1:]:
        running = max(value, running + value)
        best = max(best, running)
    return best


check("maximum-subarray", max_sub_array)
`),

  task("three-sum", "three_sum.py",
    "ĐỀ BÀI\nCho sẵn list `nums`.\nPROCESS: viết hàm `three_sum(nums)` tìm mọi bộ ba giá trị lấy từ ba vị trí khác nhau và cộng lại bằng `0`.\nOUTPUT: trả về list các bộ ba. Thứ tự các bộ ba và thứ tự số trong mỗi bộ ba đều tự do, nhưng hai bộ ba cùng tập giá trị chỉ được xuất hiện một lần.\nVí dụ: `[-1, 0, 1, 2, -1, -4]` cho hai bộ ba là `[-1, -1, 2]` và `[-1, 0, 1]`. Với `[0, 0, 0, 0]` chỉ có một bộ ba là `[0, 0, 0]`.",
    `from leet_arrays import check


def three_sum(nums):
    # lượt của bạn
    return []


check("three-sum", three_sum)
`,
    `from leet_arrays import check


def three_sum(nums):
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


check("three-sum", three_sum)
`),

  task("trapping-rain-water", "trapping_rain_water.py",
    "ĐỀ BÀI\nCho sẵn list `height`, mỗi số là chiều cao một cột trong dãy cột sát nhau. Mưa xuống, nước đọng lại trong các chỗ trũng.\nPROCESS: viết hàm `trap(height)` tính tổng lượng nước đọng lại. Nước trên đầu một cột dâng tới mức thấp hơn giữa cột cao nhất bên trái và cột cao nhất bên phải của nó.\nOUTPUT: trả về tổng lượng nước. List rỗng cho `0`.\nVí dụ: `[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]` cho `6`.\nCa lớn có tới hai mươi nghìn cột, nên quét lại cả hai bên cho từng cột sẽ quá giờ.",
    `from leet_arrays import check


def trap(height):
    # lượt của bạn
    return 0


check("trapping-rain-water", trap)
`,
    `from leet_arrays import check


def trap(height):
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


check("trapping-rain-water", trap)
`),

  { remember: "Bảy bài vừa rồi đều đi theo một kiểu: đặt hai vị trí ở hai đầu hoặc hai tốc độ khác nhau trên cùng một list, rồi mỗi bước dịch vị trí nào đang giữ giá trị không thể tốt hơn được nữa. Nhờ vậy mỗi phần tử chỉ được nhìn một lần, thay vì đem so với mọi phần tử còn lại." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · MẢNG",
  sideIslandId: "leet-arrays",
  completionKey: "magicdust.leet.set.arrays",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Đấu Trường Mảng",
  subtitle: "tám bài LeetCode chấm bằng hàng trăm ca tự sinh, không phải một ví dụ",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ MẢNG" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "sinh ca thử rồi đối chiếu với lời giải chậm mà chắc đúng" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_arrays: "../py/leet_arrays/__init__.py",
  },
  cells,
  finish: { title: "ĐẤU TRƯỜNG ĐÃ SẠCH", sub: "tám bài, không bài nào qua được bằng đáp án viết sẵn", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
