// Đảo luyện tập LeetCode — cụm tìm kiếm nhị phân.
//
// Khác hai đảo trước: ở đây máy chấm không bấm giờ mà ĐẾM SỐ LẦN ĐỌC mảng
// (py/leet_search dùng hook `probe` của leet_judge). Lý do: quét tuyến tính
// 20000 phần tử trong Python vẫn xong tức thì, nên đồng hồ không phân biệt
// được nó với nhị phân, còn số lần đọc thì lệch nhau ba bậc.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ GIẾNG CHIA ĐÔI ✦",
    hook: "Chín bài ở đây đều có một lời giải chạy được mà máy chấm vẫn đánh trượt: đi từ đầu list tới cuối để tìm. Đúng thì đúng, nhưng đảo này đếm xem bạn đọc mảng bao nhiêu lần. Trên hai mươi nghìn phần tử, cách quét cần hai mươi nghìn lần đọc, còn cách chia đôi chỉ cần chừng mười lăm.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Nếu hàm bạn đúng nhưng đọc mảng quá nhiều lần, máy chấm in ra `WRONG APPROACH` kèm số lần đọc thật và mức cho phép. Đó không phải lỗi cú pháp — đó là lời nhắc đổi cách làm." },

  task("search-insert-position", "search_insert_position.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần, các phần tử khác nhau đôi một, và một số `target`.\nPROCESS: viết hàm `search_insert(nums, target)`.\nOUTPUT: nếu `target` có trong list thì trả về index của nó; nếu không thì trả về index mà `target` cần được chèn vào để list vẫn tăng dần.\nVí dụ: `nums = [1, 3, 5, 6]` với `target = 5` cho `2`, với `target = 2` cho `1`, với `target = 7` cho `4`. List rỗng cho `0`.\nMáy chấm đếm số lần bạn đọc mảng, nên đi từng phần tử một sẽ trượt.",
    `from leet_search import check


def search_insert(nums, target):
    # lượt của bạn
    return 0


check("search-insert-position", search_insert)
`,
    `from leet_search import check


def search_insert(nums, target):
    low, high = 0, len(nums)
    while low < high:
        mid = (low + high) // 2
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid
    return low


check("search-insert-position", search_insert)
`),

  { checkpoint: { text: "Vòng nhị phân giữ hai biên `low` và `high` bao lấy đáp án, và mỗi vòng lặp phải làm khoảng cách giữa chúng NHỎ ĐI. Gán `low = mid + 1` hoặc `high = mid` thì khoảng cách chắc chắn giảm; gán `low = mid` thì khi `high - low` bằng `1`, `mid` lại chính là `low` và vòng lặp đứng yên mãi mãi." } },

  { quiz: { title: "Vì sao vòng nhị phân treo", questions: [
    { q: "Với `low = 3` và `high = 4`, `mid = (low + high) // 2` cho ra số nào?",
      a: ["`3`", "`4`", "`3.5`", "`0`"], correct: 0 },
    { q: "Vẫn với `low = 3`, `high = 4`. Nếu một nhánh trong vòng lặp viết `low = mid` thì chuyện gì xảy ra?",
      a: ["`low` vẫn là `3`, hai biên không đổi, nên vòng `while` chạy mãi không dừng", "`low` thành `4` và vòng lặp kết thúc", "Máy báo lỗi vì `mid` bằng `low`", "Vòng lặp bỏ qua phần tử ở index `3`"], correct: 0 },
    { q: "Đoạn dưới đây tìm vị trí chèn.\n\n```python\nlow, high = 0, len(nums)\nwhile low < high:\n    mid = (low + high) // 2\n    if nums[mid] < target:\n        low = mid + 1\n    else:\n        high = mid\n```\n\nVì sao `high` khởi tạo bằng `len(nums)` chứ không phải `len(nums) - 1`?",
      a: ["Vì đáp án có thể là vị trí ngay sau phần tử cuối, khi `target` lớn hơn mọi phần tử", "Vì `nums[len(nums)]` là phần tử cuối cùng", "Vì `while` cần `high` là số chẵn", "Vì như vậy vòng lặp chạy thêm được một lần"], correct: 0 },
  ] } },

  task("search-range", "search_range.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần, CÓ THỂ có phần tử trùng nhau, và một số `target`.\nPROCESS: viết hàm `search_range(nums, target)` tìm vị trí ĐẦU TIÊN và vị trí CUỐI CÙNG mà `target` xuất hiện.\nOUTPUT: trả về list hai index đó. Nếu `target` không có trong list thì trả về `[-1, -1]`.\nVí dụ: `nums = [5, 7, 7, 8, 8, 10]` với `target = 8` cho `[3, 4]`, với `target = 6` cho `[-1, -1]`.\nMáy chấm đếm số lần đọc mảng, nên tìm được một chỗ rồi bò sang hai bên để dò hết vùng trùng cũng sẽ trượt.",
    `from leet_search import check


def search_range(nums, target):
    # lượt của bạn
    return [-1, -1]


check("search-range", search_range)
`,
    `from leet_search import check


def bound(nums, target, first):
    low, high = 0, len(nums)
    while low < high:
        mid = (low + high) // 2
        value = nums[mid]
        if value > target or (first and value == target):
            high = mid
        else:
            low = mid + 1
    return low


def search_range(nums, target):
    start = bound(nums, target, True)
    if start == len(nums) or nums[start] != target:
        return [-1, -1]
    return [start, bound(nums, target, False) - 1]


check("search-range", search_range)
`),

  task("find-min-rotated", "find_min_rotated.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số khác nhau đôi một. Ban đầu nó tăng dần, rồi bị xoay đi một số bước — ví dụ `[0, 1, 2, 4, 5, 6, 7]` xoay bốn bước thành `[4, 5, 6, 7, 0, 1, 2]`. Xoay `0` bước cũng được tính.\nPROCESS: viết hàm `find_min(nums)`.\nOUTPUT: trả về GIÁ TRỊ nhỏ nhất trong list.\nVí dụ: `[3, 4, 5, 1, 2]` cho `1`; `[11, 13, 15, 17]` cho `11`.\nMáy chấm đếm số lần đọc mảng, nên `min(nums)` sẽ trượt.",
    `from leet_search import check


def find_min(nums):
    # lượt của bạn
    return 0


check("find-min-rotated", find_min)
`,
    `from leet_search import check


def find_min(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[high]:
            low = mid + 1
        else:
            high = mid
    return nums[low]


check("find-min-rotated", find_min)
`),

  task("search-rotated", "search_rotated.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số khác nhau đôi một, ban đầu tăng dần rồi bị xoay đi một số bước, và một số `target`.\nPROCESS: viết hàm `search(nums, target)`. Mẹo dùng được: khi cắt đôi, LUÔN có ít nhất một nửa còn giữ nguyên thứ tự tăng dần, và với nửa đó bạn biết chắc `target` có nằm trong nó hay không.\nOUTPUT: trả về index của `target`, hoặc `-1` nếu không có.\nVí dụ: `nums = [4, 5, 6, 7, 0, 1, 2]` với `target = 0` cho `4`, với `target = 3` cho `-1`.\nMáy chấm đếm số lần đọc mảng.",
    `from leet_search import check


def search(nums, target):
    # lượt của bạn
    return -1


check("search-rotated", search)
`,
    `from leet_search import check


def search(nums, target):
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


check("search-rotated", search)
`),

  { checkpoint: { text: "Mảng xoay không còn tăng dần trên toàn bộ, nhưng cắt ở `mid` thì một trong hai nửa luôn còn tăng dần: nhận ra nửa đó bằng cách so `nums[low]` với `nums[mid]`. Với nửa đang tăng dần, chỉ cần so `target` với hai đầu của nó là biết `target` có ở trong hay không, rồi bỏ hẳn nửa kia." } },

  { quiz: { title: "Nửa nào còn tăng dần", questions: [
    { q: "Với `nums = [4, 5, 6, 7, 0, 1, 2]`, `low = 0`, `high = 6` nên `mid = 3` và `nums[mid] = 7`. Nửa nào đang còn tăng dần?",
      a: ["Nửa trái `[4, 5, 6, 7]`, vì `nums[low]` là `4` không lớn hơn `nums[mid]` là `7`", "Nửa phải `[7, 0, 1, 2]`, vì nó chứa số nhỏ nhất", "Cả hai nửa đều còn tăng dần", "Không nửa nào còn tăng dần"], correct: 0 },
    { q: "Vẫn ví dụ trên, với `target = 0`. Sau bước này nên bỏ nửa nào?",
      a: ["Bỏ nửa trái, vì `0` không nằm giữa `4` và `7` nên chắc chắn không ở trong đó", "Bỏ nửa phải, vì `0` nhỏ hơn `4`", "Không bỏ nửa nào, phải dò cả hai", "Bỏ nửa trái, vì nửa trái luôn bị bỏ trước"], correct: 0 },
  ] } },

  task("find-peak-element", "find_peak_element.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử, và không có hai phần tử kề nhau bằng nhau. Một phần tử được gọi là ĐỈNH nếu nó lớn hơn cả hai phần tử kề bên; phần tử ở mép chỉ cần lớn hơn phần tử kề duy nhất của nó.\nPROCESS: viết hàm `find_peak_element(nums)`.\nOUTPUT: trả về index của MỘT đỉnh bất kỳ. List có nhiều đỉnh thì trả về đỉnh nào cũng được.\nVí dụ: `[1, 2, 3, 1]` cho `2`. Với `[1, 2, 1, 3, 5, 6, 4]` thì cả `1` và `5` đều được chấp nhận.\nMáy chấm đếm số lần đọc mảng, nên dò từng phần tử sẽ trượt.",
    `from leet_search import check


def find_peak_element(nums):
    # lượt của bạn
    return 0


check("find-peak-element", find_peak_element)
`,
    `from leet_search import check


def find_peak_element(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] < nums[mid + 1]:
            low = mid + 1
        else:
            high = mid
    return low


check("find-peak-element", find_peak_element)
`),

  task("search-2d-matrix", "search_2d_matrix.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là list các hàng, mỗi hàng là một list số. Trong mỗi hàng các số tăng dần, và số đầu của một hàng luôn lớn hơn số cuối của hàng ngay trước nó — nghĩa là đọc hết hàng này sang hàng kia thì cả bảng tăng dần. Cho thêm một số `target`.\nPROCESS: viết hàm `search_matrix(matrix, target)`.\nOUTPUT: trả về `True` nếu `target` có trong bảng, `False` nếu không.\nVí dụ: với `matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]` thì `target = 3` cho `True`, `target = 13` cho `False`.\nMáy chấm đếm số lần bạn lấy một HÀNG ra khỏi `matrix`, nên duyệt lần lượt từng hàng sẽ trượt.",
    `from leet_search import check


def search_matrix(matrix, target):
    # lượt của bạn
    return False


check("search-2d-matrix", search_matrix)
`,
    `from leet_search import check


def search_matrix(matrix, target):
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


check("search-2d-matrix", search_matrix)
`),

  { npc: "Ba bài cuối có phần tử trùng nhau. Lúc đó nhìn vào giữa không còn đủ để biết bỏ nửa nào, nên máy chấm không đếm số lần đọc nữa." },

  task("search-rotated-ii", "search_rotated_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` ban đầu tăng dần rồi bị xoay đi một số bước, và một số `target`. Lần này list CÓ THỂ có phần tử trùng nhau.\nPROCESS: viết hàm `search(nums, target)`. Khi `nums[low]`, `nums[mid]` và `nums[high]` bằng nhau cả ba thì không biết nửa nào còn tăng dần; lúc đó hãy thu hẹp hai biên vào một bước rồi xét tiếp.\nOUTPUT: trả về `True` nếu `target` có trong list, `False` nếu không.\nVí dụ: `nums = [2, 5, 6, 0, 0, 1, 2]` với `target = 0` cho `True`, với `target = 3` cho `False`.",
    `from leet_search import check


def search(nums, target):
    # lượt của bạn
    return False


check("search-rotated-ii", search)
`,
    `from leet_search import check


def search(nums, target):
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


check("search-rotated-ii", search)
`),

  task("find-min-rotated-ii", "find_min_rotated_ii.py",
    "ĐỀ BÀI\nGiống bài tìm số nhỏ nhất trong mảng xoay, nhưng list CÓ THỂ có phần tử trùng nhau.\nPROCESS: viết hàm `find_min(nums)`. Khi `nums[mid]` bằng đúng `nums[high]` thì chưa biết số nhỏ nhất nằm ở nửa nào, nhưng bỏ bớt một phần tử ở biên phải thì vẫn an toàn vì vẫn còn một bản khác của giá trị đó.\nOUTPUT: trả về GIÁ TRỊ nhỏ nhất trong list.\nVí dụ: `[2, 2, 2, 0, 1]` cho `0`; `[3, 3, 1, 3]` cho `1`; `[1, 1, 1]` cho `1`.",
    `from leet_search import check


def find_min(nums):
    # lượt của bạn
    return 0


check("find-min-rotated-ii", find_min)
`,
    `from leet_search import check


def find_min(nums):
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


check("find-min-rotated-ii", find_min)
`),

  task("median-two-sorted", "median_two_sorted.py",
    "ĐỀ BÀI\nCho sẵn hai list `nums1` và `nums2`, mỗi list đã sắp xếp tăng dần và có thể rỗng, nhưng không rỗng cả hai. TRUNG VỊ của một dãy đã sắp xếp là phần tử đứng giữa nếu dãy có lẻ phần tử, còn nếu chẵn thì là trung bình cộng của hai phần tử giữa.\nPROCESS: viết hàm `find_median(nums1, nums2)` tìm trung vị của TẤT CẢ các số trong hai list gộp lại.\nOUTPUT: trả về trung vị đó dưới dạng số thực.\nVí dụ: `[1, 3]` và `[2]` cho `2.0`; `[1, 2]` và `[3, 4]` cho `2.5`.\nMáy chấm đếm số lần đọc hai list, nên gộp rồi sắp xếp lại sẽ trượt. Hãy cắt mỗi list làm hai phần sao cho gộp hai phần trái lại thì được đúng nửa đầu của dãy chung.",
    `from leet_search import check


def find_median(nums1, nums2):
    # lượt của bạn
    return 0.0


check("median-two-sorted", find_median)
`,
    `from leet_search import check


def find_median(nums1, nums2):
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


check("median-two-sorted", find_median)
`),

  { remember: "Nhị phân không chỉ dùng để tìm một giá trị có sẵn. Chín bài này đều quy về cùng một câu hỏi: nhìn vào phần tử giữa, có kết luận chắc chắn nào cho phép vứt hẳn một nửa đi không? Với mảng xoay, kết luận đó là nửa nào còn tăng dần; với bài tìm đỉnh, là sườn dốc đang đi lên phía nào; với bài trung vị, là chỗ cắt hiện tại đang lệch về bên nào." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · NHỊ PHÂN",
  sideIslandId: "leet-search",
  completionKey: "magicdust.leet.set.search",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Giếng Chia Đôi",
  subtitle: "chín bài nhị phân, chấm bằng số lần đọc mảng chứ không bằng đồng hồ",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ CHIA ĐÔI" },
  machine: { art: "assets/old-computer.webp", name: "MÁY ĐẾM LẦN ĐỌC", blurb: "đưa cho hàm một mảng tự đếm số lần bị đọc" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_search: "../py/leet_search/__init__.py",
  },
  cells,
  finish: { title: "GIẾNG ĐÃ CẠN", sub: "chín bài, không bài nào qua được bằng cách quét từ đầu tới cuối", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
