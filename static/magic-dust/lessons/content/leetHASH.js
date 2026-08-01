// Đảo luyện tập LeetCode — cụm đếm và nhóm. Chấm bằng py/leet_judge.
//
// Sáu trong chín bài có ca đo giờ, và mẫu "chậm" luôn là cách so từng cặp —
// đúng nhưng O(n^2). Xem py/leet_hash.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ CHỢ ĐẾM ĐẦU ✦",
    hook: "Chín bài ở đây đều có một lời giải hiển nhiên: với mỗi phần tử, dò lại cả list xem có gì giống nó không. Đúng, và chậm gấp hàng nghìn lần cần thiết. Đổi một vòng dò thành một lần tra bảng — đó là chỗ `set` và `dict` kiếm cơm.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Trong Python, `x in list` phải dò từng phần tử, còn `x in set` hay `x in dict` chỉ tra một lần là biết. Cùng một dòng code, khác nhau ở kiểu dữ liệu bên dưới." },

  task("contains-duplicate", "contains_duplicate.py",
    "ĐỀ BÀI\nCho sẵn list `nums`.\nPROCESS: viết hàm `contains_duplicate(nums)` xét xem có giá trị nào xuất hiện từ HAI lần trở lên hay không.\nOUTPUT: trả về `True` hoặc `False`. List rỗng cho `False`.\nVí dụ: `[1, 2, 3, 1]` cho `True`; `[1, 2, 3, 4]` cho `False`.\nCa lớn có hàng nghìn số KHÁC NHAU hết, nên cách so từng cặp phải duyệt trọn và sẽ quá giờ.",
    `from leet_hash import check


def contains_duplicate(nums):
    # lượt của bạn
    return False


check("contains-duplicate", contains_duplicate)
`,
    `from leet_hash import check


def contains_duplicate(nums):
    return len(set(nums)) != len(nums)


check("contains-duplicate", contains_duplicate)
`),

  { checkpoint: { text: "`set(nums)` bỏ hết giá trị trùng, nên `len(set(nums)) != len(nums)` đúng khi và chỉ khi có giá trị lặp. Cách này duyệt list một lần thay vì so mọi cặp, và đó là lý do nó qua được ca lớn." } },

  { quiz: { title: "Tra bảng thay vì dò list", questions: [
    { q: "`len(set([1, 2, 2, 3]))` cho ra số nào?",
      a: ["`3`", "`4`", "`2`", "`1`"], correct: 0 },
    { q: "Với list `nums` có `n` phần tử, phép `x in nums` phải làm gì trong trường hợp tệ nhất?",
      a: ["So `x` với từng phần tử, tức `n` lần so sánh", "Tra đúng một lần là biết", "Sắp xếp `nums` trước rồi tìm", "Cắt đôi `nums` mỗi bước"], correct: 0 },
    { q: "Đổi `nums` thành `set` rồi hỏi `x in nums` thì khác gì?",
      a: ["Chỉ cần tra một lần, không phụ thuộc list dài bao nhiêu", "Vẫn phải so với từng phần tử", "Chậm hơn vì phải dựng `set`", "Chỉ dùng được khi `nums` đã sắp xếp"], correct: 0 },
  ] } },

  task("contains-nearby-duplicate", "contains_nearby_duplicate.py",
    "ĐỀ BÀI\nCho sẵn list `nums` và số nguyên không âm `k`.\nPROCESS: viết hàm `contains_nearby_duplicate(nums, k)` xét xem có HAI vị trí khác nhau `i` và `j` nào mà `nums[i] == nums[j]` VÀ khoảng cách `abs(i - j)` không vượt quá `k` hay không.\nOUTPUT: trả về `True` hoặc `False`.\nVí dụ: `nums = [1, 2, 3, 1]`, `k = 3` cho `True`. Cùng list đó với `k = 2` cho `False` vì hai số `1` cách nhau `3` vị trí. `k = 0` luôn cho `False`.\nBẪY: chỉ kiểm có số trùng là chưa đủ, phải xét cả khoảng cách.\nCa lớn có `k` bằng nửa độ dài list, nên so từng cặp trong cửa sổ sẽ quá giờ. Gợi ý: nhớ VỊ TRÍ XUẤT HIỆN GẦN NHẤT của mỗi giá trị.",
    `from leet_hash import check


def contains_nearby_duplicate(nums, k):
    # lượt của bạn
    return False


check("contains-nearby-duplicate", contains_nearby_duplicate)
`,
    `from leet_hash import check


def contains_nearby_duplicate(nums, k):
    last = {}
    for index, value in enumerate(nums):
        if value in last and index - last[value] <= k:
            return True
        last[value] = index
    return False


check("contains-nearby-duplicate", contains_nearby_duplicate)
`),

  task("single-number", "single_number.py",
    "ĐỀ BÀI\nCho sẵn list `nums` trong đó mỗi giá trị xuất hiện ĐÚNG HAI lần, trừ đúng một giá trị chỉ xuất hiện một lần.\nPROCESS: viết hàm `single_number(nums)` tìm giá trị lẻ loi đó.\nOUTPUT: trả về giá trị đó.\nVí dụ: `[4, 1, 2, 1, 2]` cho `4`; `[1]` cho `1`.\nCa lớn có hàng nghìn số, nên với mỗi số lại đếm lại cả list sẽ quá giờ.\nGợi ý: phép `^` (XOR) có hai tính chất đáng nhớ — `a ^ a` bằng `0`, và `a ^ 0` bằng `a`.",
    `from leet_hash import check


def single_number(nums):
    # lượt của bạn
    return 0


check("single-number", single_number)
`,
    `from leet_hash import check


def single_number(nums):
    answer = 0
    for value in nums:
        answer ^= value
    return answer


check("single-number", single_number)
`),

  { checkpoint: { text: "XOR dồn cả list lại thành một số: mỗi giá trị xuất hiện hai lần tự triệt tiêu nhau vì `a ^ a` bằng `0`, nên thứ còn sót lại chính là giá trị lẻ loi. Cách này chỉ cần một biến, không cần bảng đếm nào." } },

  { quiz: { title: "XOR triệt tiêu cặp", questions: [
    { q: "`5 ^ 5` cho ra số nào?",
      a: ["`0`", "`5`", "`10`", "`1`"], correct: 0 },
    { q: "Đoạn dưới đây chạy trên `nums = [2, 3, 2]`.\n\n```python\nanswer = 0\nfor value in nums:\n    answer ^= value\n```\n\nSau vòng lặp, `answer` bằng bao nhiêu?",
      a: ["`3`", "`2`", "`0`", "`7`"], correct: 0 },
    { q: "Vì sao cách XOR KHÔNG dùng được cho bài mỗi giá trị xuất hiện BA lần?",
      a: ["Vì ba bản của cùng một giá trị XOR lại vẫn còn chính giá trị đó, không triệt tiêu hết", "Vì XOR chỉ chạy được với list chẵn phần tử", "Vì XOR không dùng được với số âm", "Vì kết quả khi đó luôn bằng `0`"], correct: 0 },
  ] } },

  task("single-number-ii", "single_number_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` trong đó mỗi giá trị xuất hiện ĐÚNG BA lần, trừ đúng một giá trị chỉ xuất hiện một lần.\nPROCESS: viết hàm `single_number(nums)` tìm giá trị lẻ loi đó.\nOUTPUT: trả về giá trị đó.\nVí dụ: `[0, 1, 0, 1, 0, 1, 99]` cho `99`; `[2, 2, 3, 2]` cho `3`.\nCa lớn có hàng nghìn số. Cách XOR của bài trước không dùng được ở đây, nhưng một bảng đếm số lần xuất hiện thì được.",
    `from leet_hash import check


def single_number(nums):
    # lượt của bạn
    return 0


check("single-number-ii", single_number)
`,
    `from leet_hash import check


def single_number(nums):
    counts = {}
    for value in nums:
        counts[value] = counts.get(value, 0) + 1
    for value, times in counts.items():
        if times == 1:
            return value
    return 0


check("single-number-ii", single_number)
`),

  task("majority-element", "majority_element.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử. Đề bảo đảm luôn có một giá trị xuất hiện QUÁ NỬA số phần tử.\nPROCESS: viết hàm `majority_element(nums)` tìm giá trị đó.\nOUTPUT: trả về giá trị đó.\nVí dụ: `[2, 2, 1, 1, 1, 2, 2]` cho `2`; `[3]` cho `3`.\nCa lớn có hàng chục nghìn số và giá trị chiếm đa số nằm ở CUỐI list, nên với mỗi số lại đếm lại cả list sẽ quá giờ.",
    `from leet_hash import check


def majority_element(nums):
    # lượt của bạn
    return 0


check("majority-element", majority_element)
`,
    `from leet_hash import check


def majority_element(nums):
    winner, votes = None, 0
    for value in nums:
        if votes == 0:
            winner = value
        votes += 1 if value == winner else -1
    return winner


check("majority-element", majority_element)
`),

  { npc: "Cách vừa rồi gọi là bỏ phiếu triệt tiêu: giữ một ứng viên và một bộ đếm, gặp số giống thì cộng, gặp số khác thì trừ. Vì ứng viên thật chiếm quá nửa, nó không thể bị trừ hết." },

  task("majority-element-ii", "majority_element_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử.\nPROCESS: viết hàm `majority_element(nums)` tìm MỌI giá trị xuất hiện nhiều hơn `len(nums) // 3` lần. Lưu ý phép chia lấy phần nguyên: với list `8` phần tử thì ngưỡng là `2`, tức giá trị phải xuất hiện từ `3` lần trở lên.\nOUTPUT: trả về list các giá trị đó, thứ tự tự do, mỗi giá trị chỉ một lần. Có thể không có giá trị nào, khi đó trả về list rỗng.\nVí dụ: `[1, 1, 1, 3, 3, 2, 2, 2]` cho `[1, 2]`. `[3, 2, 3]` cho `[3]`. `[1, 2]` cho cả `[1, 2]` vì ngưỡng là `0`.",
    `from leet_hash import check


def majority_element(nums):
    # lượt của bạn
    return []


check("majority-element-ii", majority_element)
`,
    `from leet_hash import check


def majority_element(nums):
    counts = {}
    for value in nums:
        counts[value] = counts.get(value, 0) + 1
    return [value for value, times in counts.items() if times > len(nums) // 3]


check("majority-element-ii", majority_element)
`),

  task("longest-consecutive", "longest_consecutive.py",
    "ĐỀ BÀI\nCho sẵn list `nums`, có thể có giá trị trùng nhau.\nPROCESS: viết hàm `longest_consecutive(nums)` tìm dãy số nguyên LIÊN TIẾP dài nhất mà mọi số trong dãy đều có mặt trong `nums`. Các số KHÔNG cần nằm cạnh nhau trong list.\nOUTPUT: trả về độ dài dãy đó. List rỗng cho `0`.\nVí dụ: `[100, 4, 200, 1, 3, 2]` cho `4`, là dãy `1, 2, 3, 4`. `[1, 1, 1]` cho `1`.\nCa lớn có hàng chục nghìn số rời rạc, nên với mỗi số lại dò cả list để tìm số kế tiếp sẽ quá giờ.\nGợi ý: một dãy chỉ nên được đếm từ ĐẦU dãy, tức từ số mà `value - 1` không có mặt.",
    `from leet_hash import check


def longest_consecutive(nums):
    # lượt của bạn
    return 0


check("longest-consecutive", longest_consecutive)
`,
    `from leet_hash import check


def longest_consecutive(nums):
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


check("longest-consecutive", longest_consecutive)
`),

  { checkpoint: { text: "Dòng `if value - 1 in pool: continue` là thứ giữ cho hàm chạy nhanh. Không có nó, một dãy dài `k` bị đếm lại từ mọi số trong dãy, tốn `k` lần thay vì một. Có nó, mỗi dãy chỉ được đếm đúng một lần từ đầu dãy, nên tổng công việc bằng số phần tử." } },

  { quiz: { title: "Chỉ đếm từ đầu dãy", questions: [
    { q: "Với `pool = {1, 2, 3, 4}`, những giá trị nào KHÔNG bị dòng `if value - 1 in pool: continue` bỏ qua?",
      a: ["Chỉ `1`", "Chỉ `4`", "Cả `1` và `4`", "Không giá trị nào"], correct: 0 },
    { q: "Nếu BỎ dòng `continue` đó đi thì hàm còn đúng không, và tốc độ thay đổi ra sao?",
      a: ["Vẫn đúng, nhưng chậm hơn hẳn vì mỗi dãy bị đếm lại từ mọi số trong nó", "Sai kết quả vì đếm thừa", "Vẫn đúng và nhanh y như cũ", "Hàm chạy mãi không dừng"], correct: 0 },
  ] } },

  task("group-anagrams", "group_anagrams.py",
    "ĐỀ BÀI\nCho sẵn list các chuỗi `strs`. Hai chuỗi gọi là ĐẢO CHỮ của nhau nếu chuỗi này sắp xếp lại các chữ cái thì thành chuỗi kia — ví dụ `\"eat\"` và `\"tea\"`.\nPROCESS: viết hàm `group_anagrams(strs)` gom các chuỗi là đảo chữ của nhau vào cùng một nhóm.\nOUTPUT: trả về list các nhóm, mỗi nhóm là một list chuỗi. Thứ tự các nhóm và thứ tự trong mỗi nhóm đều tự do, nhưng mỗi chuỗi phải nằm đúng một nhóm.\nVí dụ: `[\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]` cho ba nhóm: `[\"eat\", \"tea\", \"ate\"]`, `[\"tan\", \"nat\"]`, `[\"bat\"]`.\nGợi ý: hai chuỗi là đảo chữ của nhau khi và chỉ khi sắp xếp chữ cái của chúng cho ra CÙNG một chuỗi — dùng chuỗi đã sắp xếp đó làm khoá của `dict`.",
    `from leet_hash import check


def group_anagrams(strs):
    # lượt của bạn
    return []


check("group-anagrams", group_anagrams)
`,
    `from leet_hash import check


def group_anagrams(strs):
    groups = {}
    for word in strs:
        key = "".join(sorted(word))
        if key not in groups:
            groups[key] = []
        groups[key].append(word)
    return list(groups.values())


check("group-anagrams", group_anagrams)
`),

  task("longest-common-prefix", "longest_common_prefix.py",
    "ĐỀ BÀI\nCho sẵn list các chuỗi `strs` có ít nhất một chuỗi.\nPROCESS: viết hàm `longest_common_prefix(strs)` tìm phần ĐẦU dài nhất mà MỌI chuỗi trong list đều bắt đầu bằng nó.\nOUTPUT: trả về chuỗi phần đầu chung đó. Nếu không có phần đầu chung nào thì trả về chuỗi rỗng `\"\"`.\nVí dụ: `[\"flower\", \"flow\", \"flight\"]` cho `\"fl\"`. `[\"dog\", \"racecar\", \"car\"]` cho `\"\"`. `[\"a\"]` cho `\"a\"`.\nLưu ý: list có thể chứa chuỗi rỗng, khi đó đáp án chắc chắn là chuỗi rỗng.",
    `from leet_hash import check


def longest_common_prefix(strs):
    # lượt của bạn
    return ""


check("longest-common-prefix", longest_common_prefix)
`,
    `from leet_hash import check


def longest_common_prefix(strs):
    prefix = strs[0]
    for word in strs[1:]:
        while not word.startswith(prefix):
            prefix = prefix[:-1]
    return prefix


check("longest-common-prefix", longest_common_prefix)
`),

  { remember: "Cả chín bài đều đi theo một hướng: thay một vòng DÒ bằng một lần TRA. `set` trả lời câu hỏi có mặt hay không; `dict` trả lời thêm được bao nhiêu lần, hoặc ở vị trí nào. Khi chưa nghĩ ra, hãy hỏi: mình đang dò đi dò lại thứ gì, và có thể ghi sẵn nó vào một cái bảng không? Riêng hai bài lẻ loi và đa số cho thấy đôi khi còn gọn hơn thế — một biến XOR, hoặc một ứng viên kèm bộ đếm, là đủ." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · ĐẾM VÀ NHÓM",
  sideIslandId: "leet-hash",
  completionKey: "magicdust.leet.set.hash",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Chợ Đếm Đầu",
  subtitle: "chín bài đổi vòng dò thành một lần tra bảng",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ ĐẾM ĐẦU" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "ca lớn toàn số khác nhau, cách so từng cặp không thoát sớm được" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_hash: "../py/leet_hash/__init__.py",
  },
  cells,
  finish: { title: "CHỢ ĐÃ VẮNG", sub: "chín bài, không bài nào còn phải dò lại cả list", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
