// Đảo luyện tập LeetCode — cụm tham lam, khoảng và xâu chuỗi kết quả.
// Chấm bằng py/leet_judge; xem py/leet_greedy cho từng bài.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ BẾN THAM LAM ✦",
    hook: "Chín bài ở đây đều giải được bằng một quy tắc chọn rất ngắn: cứ lấy thứ tốt nhất trước mắt rồi đi tiếp. Cái bẫy là quy tắc ngắn thường ngắn quá — đúng với ví dụ trong đề, sai với ca thứ tám mươi. Máy chấm ở đảo này chính là thứ chỉ ra chỗ ngắn quá đó.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Ba bài mở đầu không có bẫy tốc độ, chúng có bẫy TRƯỜNG HỢP BIÊN: chữ số nhớ tràn ra, khoảng chỉ có một số, hai khoảng chạm nhau đúng một đầu." },

  task("plus-one", "plus_one.py",
    "ĐỀ BÀI\nCho sẵn list `digits` biểu diễn một số nguyên không âm, mỗi phần tử là một chữ số từ `0` tới `9`, chữ số hàng cao nhất đứng đầu list. Số có nhiều hơn một chữ số thì không bắt đầu bằng `0`.\nPROCESS: viết hàm `plus_one(digits)` cộng thêm `1` vào số đó.\nOUTPUT: trả về một list các chữ số của kết quả.\nVí dụ: `[1, 2, 3]` cho `[1, 2, 4]`. `[9]` cho `[1, 0]`. `[9, 9]` cho `[1, 0, 0]`.\nBẪY: khi mọi chữ số đều là `9`, kết quả DÀI HƠN list ban đầu một chữ số.",
    `from leet_greedy import check


def plus_one(digits):
    # lượt của bạn
    return digits


check("plus-one", plus_one)
`,
    `from leet_greedy import check


def plus_one(digits):
    out = list(digits)
    index = len(out) - 1
    while index >= 0:
        if out[index] < 9:
            out[index] += 1
            return out
        out[index] = 0
        index -= 1
    return [1] + out


check("plus-one", plus_one)
`),

  task("summary-ranges", "summary_ranges.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần, các phần tử KHÁC NHAU đôi một.\nPROCESS: viết hàm `summary_ranges(nums)` gom các số LIÊN TIẾP thành từng khoảng.\nOUTPUT: trả về list các chuỗi. Khoảng có từ hai số trở lên viết là `\"a->b\"` với `a` là số đầu và `b` là số cuối; khoảng chỉ có một số thì viết chính số đó, KHÔNG viết `\"a->a\"`. List rỗng cho list rỗng.\nVí dụ: `[0, 1, 2, 4, 5, 7]` cho `[\"0->2\", \"4->5\", \"7\"]`. `[0]` cho `[\"0\"]`.",
    `from leet_greedy import check


def summary_ranges(nums):
    # lượt của bạn
    return []


check("summary-ranges", summary_ranges)
`,
    `from leet_greedy import check


def summary_ranges(nums):
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


check("summary-ranges", summary_ranges)
`),

  task("merge-intervals", "merge_intervals.py",
    "ĐỀ BÀI\nCho sẵn `intervals` là list các khoảng, mỗi khoảng là `[start, end]` với `start` không lớn hơn `end`. Các khoảng CHƯA được sắp xếp và có thể chồng lên nhau.\nPROCESS: viết hàm `merge(intervals)` gộp mọi nhóm khoảng CHỒNG nhau thành một khoảng. Hai khoảng chồng nhau khi chúng có ít nhất một điểm chung, kể cả khi chỉ chạm nhau đúng một đầu như `[1, 4]` và `[4, 5]`.\nOUTPUT: trả về list các khoảng sau khi gộp, sắp xếp tăng dần theo `start`. List rỗng cho list rỗng.\nVí dụ: `[[1, 3], [2, 6], [8, 10], [15, 18]]` cho `[[1, 6], [8, 10], [15, 18]]`.\nLƯU Ý: `[15, 16]` và `[17, 21]` KHÔNG chồng nhau nên giữ nguyên hai khoảng, dù trên trục số nguyên chúng nằm sát nhau.",
    `from leet_greedy import check


def merge(intervals):
    # lượt của bạn
    return []


check("merge-intervals", merge)
`,
    `from leet_greedy import check


def merge(intervals):
    out = []
    for start, end in sorted(intervals):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


check("merge-intervals", merge)
`),

  { checkpoint: { text: "Gộp khoảng phải SẮP XẾP theo `start` trước. Sau khi sắp xếp, chỉ cần so khoảng đang xét với khoảng CUỐI CÙNG trong kết quả: nếu `start <= out[-1][1]` thì chồng nhau, nới `end` ra bằng `max` — dùng `max` chứ không gán thẳng, vì khoảng mới có thể nằm gọn bên trong khoảng cũ." } },

  { quiz: { title: "Gộp khoảng hỏng ở đâu", questions: [
    { q: "Với `intervals = [[1, 10], [2, 3]]` đã sắp xếp, nếu khi gộp bạn gán `out[-1][1] = end` thay vì `max(out[-1][1], end)` thì kết quả ra gì?",
      a: ["`[[1, 3]]` — khoảng bị co lại, mất mất phần từ `3` tới `10`", "`[[1, 10]]` — vẫn đúng", "`[[1, 10], [2, 3]]`", "`[[2, 3]]`"], correct: 0 },
    { q: "Hai khoảng `[15, 16]` và `[17, 21]` có được gộp không?",
      a: ["Không, vì chúng không có điểm chung nào", "Có, vì trên trục số nguyên `16` và `17` sát nhau", "Có, vì khoảng sau bắt đầu ngay sau khoảng trước", "Tuỳ cách sắp xếp"], correct: 0 },
    { q: "Nếu QUÊN sắp xếp `intervals` trước khi gộp thì chuyện gì xảy ra với `[[8, 10], [1, 3], [2, 6]]`?",
      a: ["`[8, 10]` bị giữ riêng rồi `[1, 3]` mở khoảng mới, nên hai khoảng đáng gộp là `[1, 3]` và `[2, 6]` may mắn gộp được còn kết quả vẫn sai thứ tự", "Kết quả vẫn đúng hoàn toàn", "Hàm báo lỗi", "Mọi khoảng đều bị gộp làm một"], correct: 0 },
  ] } },

  task("insert-interval", "insert_interval.py",
    "ĐỀ BÀI\nCho sẵn `intervals` là list các khoảng ĐÃ sắp xếp tăng dần theo `start` và KHÔNG chồng nhau, cùng một khoảng mới `new_interval`.\nPROCESS: viết hàm `insert(intervals, new_interval)` chèn khoảng mới vào rồi gộp lại nếu có chồng nhau.\nOUTPUT: trả về list các khoảng sau khi chèn và gộp, vẫn sắp xếp tăng dần theo `start` và không chồng nhau.\nVí dụ: `intervals = [[1, 3], [6, 9]]`, `new_interval = [2, 5]` cho `[[1, 5], [6, 9]]`. `intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]]` với `new_interval = [4, 8]` cho `[[1, 2], [3, 10], [12, 16]]`.\n`intervals` có thể rỗng, khi đó kết quả chỉ có khoảng mới.",
    `from leet_greedy import check


def insert(intervals, new_interval):
    # lượt của bạn
    return []


check("insert-interval", insert)
`,
    `from leet_greedy import check


def insert(intervals, new_interval):
    out = []
    for start, end in sorted(list(intervals) + [list(new_interval)]):
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


check("insert-interval", insert)
`),

  task("gas-station", "gas_station.py",
    "ĐỀ BÀI\nCho sẵn hai list `gas` và `cost` cùng độ dài, mô tả các trạm xăng xếp thành VÒNG TRÒN. Ở trạm `i` bạn bơm được `gas[i]` lít, và đi từ trạm `i` sang trạm kế tiếp tốn `cost[i]` lít. Xe bắt đầu với bình rỗng và phải đi hết đúng một vòng, không lúc nào được để bình âm.\nPROCESS: viết hàm `can_complete_circuit(gas, cost)`.\nOUTPUT: trả về index của một trạm xuất phát đi được trọn vòng, hoặc `-1` nếu không có trạm nào.\nVí dụ: `gas = [1, 2, 3, 4, 5]`, `cost = [3, 4, 5, 1, 2]` cho `3`. `gas = [2, 3, 4]`, `cost = [3, 4, 3]` cho `-1`.\nCa lớn có hàng nghìn trạm và chỉ trạm CUỐI đi được, nên thử lần lượt từng trạm sẽ quá giờ.\nGợi ý: nếu tổng `gas` nhỏ hơn tổng `cost` thì chắc chắn không có đáp án. Còn nếu đi từ trạm `s` mà cạn xăng ở trạm `k`, thì mọi trạm giữa `s` và `k` cũng không thể là điểm xuất phát.",
    `from leet_greedy import check


def can_complete_circuit(gas, cost):
    # lượt của bạn
    return -1


check("gas-station", can_complete_circuit)
`,
    `from leet_greedy import check


def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    start, tank = 0, 0
    for index in range(len(gas)):
        tank += gas[index] - cost[index]
        if tank < 0:
            start, tank = index + 1, 0
    return start


check("gas-station", can_complete_circuit)
`),

  { checkpoint: { text: "Hai nhận xét gộp lại thành lời giải một vòng lặp. Một: tổng `gas` nhỏ hơn tổng `cost` thì chắc chắn `-1`, còn không nhỏ hơn thì chắc chắn CÓ đáp án. Hai: nếu xuất phát từ `s` mà cạn xăng đúng ở trạm `k`, thì mọi trạm từ `s` tới `k` đều không đi nổi, nên nhảy thẳng điểm xuất phát tới `k + 1` thay vì thử lại từng trạm một." } },

  { quiz: { title: "Vì sao được nhảy qua cả đoạn", questions: [
    { q: "Xuất phát từ trạm `0`, xe cạn xăng đúng khi tới trạm `4`. Kết luận nào là ĐÚNG?",
      a: ["Mọi trạm từ `0` tới `4` đều không thể là điểm xuất phát, nên thử tiếp từ trạm `5`", "Chỉ trạm `0` là không được, phải thử lại từ trạm `1`", "Trạm `4` chắc chắn là đáp án", "Không kết luận được gì, phải thử lại từ đầu"], correct: 0 },
    { q: "Vì sao xuất phát từ trạm `2` (nằm giữa `0` và `4`) cũng không đi nổi tới `4`?",
      a: ["Vì đi từ `0` tới `2` bình vẫn không âm, nên khởi hành ở `2` bình chỉ ít xăng hơn hoặc bằng lúc đi ngang qua `2`", "Vì trạm `2` không có xăng", "Vì trạm `2` nằm sau trạm `0`", "Vì bình luôn rỗng khi tới trạm `2`"], correct: 0 },
    { q: "Khi tổng `gas` lớn hơn hoặc bằng tổng `cost`, điều gì chắc chắn đúng?",
      a: ["Luôn tồn tại ít nhất một trạm xuất phát đi được trọn vòng", "Trạm `0` luôn đi được", "Có thể vẫn không có trạm nào đi được", "Mọi trạm đều đi được"], correct: 0 },
  ] } },

  task("candy", "candy.py",
    "ĐỀ BÀI\nCho sẵn list `ratings`, `ratings[i]` là điểm của đứa trẻ thứ `i` đứng thành một HÀNG THẲNG. Phát kẹo theo hai luật: mỗi đứa được ít nhất `1` cái, và đứa nào có điểm CAO HƠN đứa đứng ngay cạnh (trái hoặc phải) thì phải được NHIỀU kẹo hơn đứa đó.\nPROCESS: viết hàm `candy(ratings)` tính số kẹo ÍT NHẤT phải phát.\nOUTPUT: trả về tổng số kẹo.\nVí dụ: `[1, 0, 2]` cho `5` — phát `2, 1, 2`. `[1, 2, 2]` cho `4` — phát `1, 2, 1`. `[1]` cho `1`.\nBẪY: chỉ so với đứa bên TRÁI là chưa đủ, luật ràng buộc cả hai phía.\nCa lớn có hàng nghìn đứa trẻ với điểm tăng dần, nên cách cứ ai thiệt thì thêm một cái rồi lặp lại sẽ quá giờ.",
    `from leet_greedy import check


def candy(ratings):
    # lượt của bạn
    return 0


check("candy", candy)
`,
    `from leet_greedy import check


def candy(ratings):
    candies = [1] * len(ratings)
    for index in range(1, len(ratings)):
        if ratings[index] > ratings[index - 1]:
            candies[index] = candies[index - 1] + 1
    for index in range(len(ratings) - 2, -1, -1):
        if ratings[index] > ratings[index + 1]:
            candies[index] = max(candies[index], candies[index + 1] + 1)
    return sum(candies)


check("candy", candy)
`),

  { checkpoint: { text: "Luật ràng buộc cả hai phía, nên quét MỘT lượt là không đủ. Quét xuôi lo xong mọi ràng buộc với bên trái, quét ngược lo nốt bên phải — và lượt ngược phải dùng `max(candies[index], candies[index + 1] + 1)`, vì gán thẳng sẽ phá kết quả mà lượt xuôi vừa dựng." } },

  { quiz: { title: "Vì sao phải quét hai lượt", questions: [
    { q: "Với `ratings = [1, 3, 2]`, chỉ quét XUÔI và cho thêm kẹo khi điểm cao hơn đứa bên trái thì được `[1, 2, 1]`. Cách phát đó có hợp luật không?",
      a: ["Có, vì đứa giữa điểm `3` đang nhiều kẹo hơn cả hai bên", "Không, vì đứa cuối điểm `2` cần nhiều kẹo hơn đứa giữa", "Không, vì tổng kẹo chưa nhỏ nhất", "Không, vì đứa đầu chỉ có `1` cái"], correct: 0 },
    { q: "Với `ratings = [1, 2, 3, 1]`, lượt xuôi cho `[1, 2, 3, 1]`. Lượt ngược sửa ô nào?",
      a: ["Ô cuối giữ nguyên `1`, còn ô thứ ba giữ `3` vì `max(3, 1 + 1)` vẫn là `3`", "Ô thứ ba tăng lên `2`", "Ô cuối tăng lên `4`", "Không ô nào bị đụng tới"], correct: 0 },
    { q: "Vì sao lượt ngược phải dùng `max` chứ không gán thẳng `candies[index + 1] + 1`?",
      a: ["Vì gán thẳng sẽ ghi đè mất số kẹo mà lượt xuôi đã dựng cho ràng buộc bên trái", "Vì `max` chạy nhanh hơn", "Vì `candies[index + 1]` có thể âm", "Vì như vậy tổng mới nhỏ nhất"], correct: 0 },
  ] } },

  task("contains-duplicate-iii", "contains_duplicate_iii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` và hai số không âm `index_diff`, `value_diff`.\nPROCESS: viết hàm `contains_nearby_almost_duplicate(nums, index_diff, value_diff)` xét xem có hai vị trí khác nhau `i` và `j` nào thoả CẢ HAI điều kiện hay không: `abs(i - j)` không vượt quá `index_diff`, VÀ `abs(nums[i] - nums[j])` không vượt quá `value_diff`.\nOUTPUT: trả về `True` hoặc `False`.\nVí dụ: `nums = [1, 2, 3, 1]`, `index_diff = 3`, `value_diff = 0` cho `True`. `nums = [1, 5, 9, 1, 5, 9]`, `index_diff = 2`, `value_diff = 3` cho `False`. `index_diff = 0` luôn cho `False`.\nCa lớn có hàng chục nghìn số và `index_diff` bằng nửa mảng, nên so từng cặp trong cửa sổ sẽ quá giờ.\nGợi ý: chia trục giá trị thành các RỔ rộng đúng `value_diff + 1`. Hai số rơi cùng một rổ thì chắc chắn đủ gần; hai số ở hai rổ KỀ NHAU thì phải kiểm lại; xa hơn thì khỏi xét.",
    `from leet_greedy import check


def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
    # lượt của bạn
    return False


check("contains-duplicate-iii", contains_nearby_almost_duplicate)
`,
    `from leet_greedy import check


def contains_nearby_almost_duplicate(nums, index_diff, value_diff):
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


check("contains-duplicate-iii", contains_nearby_almost_duplicate)
`),

  task("largest-number", "largest_number.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số nguyên không âm.\nPROCESS: viết hàm `largest_number(nums)` xếp lại thứ tự các số rồi VIẾT LIỀN chúng thành một dãy chữ số, sao cho số thu được LỚN NHẤT.\nOUTPUT: trả về kết quả dưới dạng CHUỖI. Nếu kết quả toàn số `0` thì trả về `\"0\"` chứ không phải `\"00\"`.\nVí dụ: `[10, 2]` cho `\"210\"`. `[3, 30, 34, 5, 9]` cho `\"9534330\"`. `[0, 0]` cho `\"0\"`.\nBẪY: sắp xếp theo GIÁ TRỊ giảm dần là sai — `[3, 30]` phải cho `\"330\"` chứ không phải `\"303\"`.\nGợi ý: so hai số `a` và `b` bằng cách so hai chuỗi ghép `a + b` và `b + a`, cái nào lớn hơn thì cách ghép đó tốt hơn.",
    `from leet_greedy import check


def largest_number(nums):
    # lượt của bạn
    return ""


check("largest-number", largest_number)
`,
    `from leet_greedy import check


def largest_number(nums):
    parts = [str(value) for value in nums]
    for i in range(len(parts)):
        for j in range(i + 1, len(parts)):
            if parts[i] + parts[j] < parts[j] + parts[i]:
                parts[i], parts[j] = parts[j], parts[i]
    return str(int("".join(parts)))


check("largest-number", largest_number)
`),

  { npc: "Bài cuối là bài dài nhất đảo. Nó không khó về ý tưởng, chỉ khó ở chỗ đếm khoảng trắng cho đúng — và dòng cuối cùng có luật riêng." },

  task("text-justification", "text_justification.py",
    "ĐỀ BÀI\nCho sẵn list các chuỗi `words` và số nguyên dương `max_width`. Mỗi từ có độ dài không vượt quá `max_width`.\nPROCESS: viết hàm `full_justify(words, max_width)` xếp các từ thành các dòng, mỗi dòng đúng `max_width` ký tự. Nhồi vào mỗi dòng nhiều từ nhất có thể, giữ nguyên thứ tự từ, giữa hai từ luôn có ít nhất một khoảng trắng. Với dòng nhiều từ, rải khoảng trắng cho đều; nếu không chia đều được thì các khe BÊN TRÁI nhận nhiều hơn.\nBA TRƯỜNG HỢP RIÊNG: dòng chỉ có một từ thì canh TRÁI, phần còn lại là khoảng trắng. Dòng CUỐI CÙNG cũng canh trái, các từ cách nhau đúng một khoảng trắng. Cả hai vẫn phải đủ `max_width` ký tự.\nOUTPUT: trả về list các dòng.\nVí dụ: `words = [\"This\", \"is\", \"an\", \"example\", \"of\", \"text\", \"justification.\"]`, `max_width = 16` cho ba dòng: `\"This    is    an\"`, `\"example  of text\"`, `\"justification.  \"`.",
    `from leet_greedy import check


def full_justify(words, max_width):
    # lượt của bạn
    return []


check("text-justification", full_justify)
`,
    `from leet_greedy import check


def pack(line, length, max_width):
    if len(line) == 1:
        return line[0] + " " * (max_width - length)
    gaps = len(line) - 1
    base = (max_width - length) // gaps
    extra = (max_width - length) % gaps
    out = ""
    for index, word in enumerate(line[:-1]):
        out += word + " " * (base + (1 if index < extra else 0))
    return out + line[-1]


def full_justify(words, max_width):
    lines, line, length = [], [], 0
    for word in words:
        if line and length + len(line) + len(word) > max_width:
            lines.append(pack(line, length, max_width))
            line, length = [], 0
        line.append(word)
        length += len(word)
    last = " ".join(line)
    lines.append(last + " " * (max_width - len(last)))
    return lines


check("text-justification", full_justify)
`),

  { remember: "Quy tắc tham lam nào cũng cần một lý do vì sao nó không bỏ sót, và lý do đó thường là một nhận xét ngắn: đã đi qua trạm `k` mà bình không âm thì khởi hành ở `k` không thể tốt hơn; hai chuỗi ghép lại cái nào lớn hơn thì thứ tự đó tốt hơn. Khi chưa tìm được nhận xét ấy thì đừng vội tin quy tắc — hãy tìm ca làm nó sai. Và ba bài mở đầu nhắc một chuyện khác: phần lớn lỗi ở đảo này không nằm ở ý tưởng mà ở trường hợp biên." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · THAM LAM",
  sideIslandId: "leet-greedy",
  completionKey: "magicdust.leet.set.greedy",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Bến Tham Lam",
  subtitle: "chín bài chọn tại chỗ, khoảng và trường hợp biên",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ THAM LAM" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "tìm đúng cái ca làm quy tắc ngắn của bạn sai" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_greedy: "../py/leet_greedy/__init__.py",
  },
  cells,
  finish: { title: "BẾN ĐÃ YÊN", sub: "chín bài, mỗi quy tắc chọn đều đứng vững trước hàng trăm ca", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
