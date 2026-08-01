// Đảo luyện tập LeetCode — ngăn xếp đơn điệu, cửa sổ trượt, quét.
// Chấm bằng py/leet_judge; xem py/leet_stack.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ CẦU THANG XẾP CHỒNG ✦",
    hook: "Chín bài ở đây có cùng một chỗ tốn kém: với mỗi vị trí lại nhìn lại toàn bộ phía trước, hoặc quét trọn cửa sổ. Cách nhanh không nhìn ít hơn — nó GIỮ SẴN một danh sách đã lọc, chỉ còn những thứ vẫn còn cơ hội thắng. Thứ bị loại thì loại hẳn, không bao giờ phải xét lại.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Ngăn xếp ở đây không dùng để nhớ mọi thứ, nó dùng để QUÊN có kỷ luật: hễ gặp thứ tốt hơn thì mọi thứ kém hơn đứng trước bị đẩy ra luôn." },

  task("evaluate-rpn", "evaluate_rpn.py",
    "ĐỀ BÀI\nCho sẵn list `tokens` là một biểu thức viết theo lối HẬU TỐ: toán tử đứng SAU hai toán hạng của nó. Mỗi phần tử là một chuỗi, hoặc một số nguyên, hoặc một trong bốn dấu `\"+\"`, `\"-\"`, `\"*\"`, `\"/\"`. Biểu thức luôn hợp lệ và không có phép chia cho `0`.\nPROCESS: viết hàm `eval_rpn(tokens)` tính giá trị biểu thức. Phép chia LẤY PHẦN NGUYÊN CẮT VỀ PHÍA `0`: `-7 / 2` cho `-3` chứ không phải `-4`.\nOUTPUT: trả về kết quả là một số nguyên.\nVí dụ: `[\"2\", \"1\", \"+\", \"3\", \"*\"]` cho `9`, tức `(2 + 1) * 3`. `[\"4\", \"13\", \"5\", \"/\", \"+\"]` cho `6`.\nLƯU Ý: `//` của Python làm tròn XUỐNG, nên với số âm nó không khớp với luật của đề.",
    `from leet_stack import check


def eval_rpn(tokens):
    # lượt của bạn
    return 0


check("evaluate-rpn", eval_rpn)
`,
    `from leet_stack import check


def apply_op(left, right, token):
    if token == "+":
        return left + right
    if token == "-":
        return left - right
    if token == "*":
        return left * right
    if (left < 0) != (right < 0):
        return -(-left // right)
    return left // right


def eval_rpn(tokens):
    stack = []
    for token in tokens:
        if token in ("+", "-", "*", "/"):
            right = stack.pop()
            left = stack.pop()
            stack.append(apply_op(left, right, token))
        else:
            stack.append(int(token))
    return stack[-1]


check("evaluate-rpn", eval_rpn)
`),

  { checkpoint: { text: "Biểu thức hậu tố tính được bằng một ngăn xếp và một vòng lặp: gặp số thì đẩy vào, gặp toán tử thì lấy ra HAI số, tính, rồi đẩy kết quả trở lại. Thứ tự lấy ra quan trọng — số lấy ra TRƯỚC là toán hạng BÊN PHẢI, nên với `\"-\"` và `\"/\"` phải viết `left` trước `right`." } },

  { quiz: { title: "Thứ tự lấy ra khỏi ngăn xếp", questions: [
    { q: "Đang tính `[\"5\", \"2\", \"-\"]`. Ngăn xếp có `[5, 2]`, gặp dấu `\"-\"`. Số lấy ra TRƯỚC là số nào, và nó đóng vai trò gì?",
      a: ["Lấy ra `2` trước, và nó là toán hạng BÊN PHẢI, nên kết quả là `5 - 2`", "Lấy ra `5` trước, và nó là toán hạng bên phải, nên kết quả là `2 - 5`", "Lấy ra `2` trước và nó là toán hạng bên trái", "Thứ tự không quan trọng vì phép trừ đối xứng"], correct: 0 },
    { q: "Trong Python, `-7 // 2` cho ra số nào?",
      a: ["`-4`, vì `//` làm tròn XUỐNG", "`-3`, vì `//` cắt về phía `0`", "`-3.5`", "`3`"], correct: 0 },
    { q: "Đề đòi phép chia cắt về phía `0`, tức `-7 / 2` phải cho `-3`. Cách nào cho đúng kết quả đó?",
      a: ["Khi hai số khác dấu thì tính `-(-left // right)`", "Dùng thẳng `left // right`", "Dùng `round(left / right)`", "Dùng `left % right`"], correct: 0 },
  ] } },

  task("kth-largest", "kth_largest.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử và số nguyên `k` với `1 <= k <= len(nums)`.\nPROCESS: viết hàm `find_kth_largest(nums, k)` tìm phần tử LỚN THỨ `k` khi xếp các phần tử theo thứ tự giảm dần. Phần tử trùng nhau vẫn được đếm riêng: trong `[3, 2, 3, 1, 2, 4, 5, 5, 6]`, lớn thứ `4` là `4`.\nOUTPUT: trả về giá trị đó.\nVí dụ: `[3, 2, 1, 5, 6, 4]` với `k = 2` cho `5`. `[2, 2]` với `k = 2` cho `2`.",
    `from leet_stack import check


def find_kth_largest(nums, k):
    # lượt của bạn
    return 0


check("kth-largest", find_kth_largest)
`,
    `from leet_stack import check


def find_kth_largest(nums, k):
    return sorted(nums, reverse=True)[k - 1]


check("kth-largest", find_kth_largest)
`),

  task("maximum-gap", "maximum_gap.py",
    "ĐỀ BÀI\nCho sẵn list `nums`.\nPROCESS: viết hàm `maximum_gap(nums)` sắp các số theo thứ tự tăng dần rồi tìm khoảng cách LỚN NHẤT giữa hai số ĐỨNG KỀ NHAU trong dãy đã sắp.\nOUTPUT: trả về khoảng cách đó. Nếu list có ít hơn hai phần tử thì trả về `0`.\nVí dụ: `[3, 6, 9, 1]` cho `3` — sắp lại thành `1, 3, 6, 9`, các khoảng cách là `2, 3, 3`. `[10]` cho `0`.\nBẪY: `max(nums) - min(nums)` là khoảng cách hai đầu, không phải khoảng cách giữa hai số kề nhau.",
    `from leet_stack import check


def maximum_gap(nums):
    # lượt của bạn
    return 0


check("maximum-gap", maximum_gap)
`,
    `from leet_stack import check


def maximum_gap(nums):
    if len(nums) < 2:
        return 0
    ordered = sorted(nums)
    best = 0
    for index in range(len(ordered) - 1):
        best = max(best, ordered[index + 1] - ordered[index])
    return best


check("maximum-gap", maximum_gap)
`),

  task("count-primes", "count_primes.py",
    "ĐỀ BÀI\nCho sẵn số nguyên không âm `n`.\nPROCESS: viết hàm `count_primes(n)` đếm xem có bao nhiêu số nguyên tố NHỎ HƠN `n`. Số nguyên tố là số từ `2` trở lên chỉ chia hết cho `1` và chính nó.\nOUTPUT: trả về số lượng đó.\nVí dụ: `n = 10` cho `4`, là `2, 3, 5, 7`. `n = 0`, `n = 1` và `n = 2` đều cho `0`.\nLƯU Ý: đếm các số NHỎ HƠN `n`, nên `n = 3` cho `1` chứ không phải `2`.\nCa lớn có `n` tới hơn trăm nghìn, nên thử chia từng số cho mọi số nhỏ hơn nó sẽ quá giờ.\nGợi ý: thay vì kiểm từng số, hãy đi GẠCH BỎ — với mỗi số nguyên tố tìm được, gạch hết các bội của nó.",
    `from leet_stack import check


def count_primes(n):
    # lượt của bạn
    return 0


check("count-primes", count_primes)
`,
    `from leet_stack import check


def count_primes(n):
    if n < 3:
        return 0
    is_prime = [True] * n
    is_prime[0] = False
    is_prime[1] = False
    step = 2
    while step * step < n:
        if is_prime[step]:
            for multiple in range(step * step, n, step):
                is_prime[multiple] = False
        step += 1
    return sum(is_prime)


check("count-primes", count_primes)
`),

  { checkpoint: { text: "Sàng số nguyên tố đảo ngược câu hỏi: thay vì hỏi từng số có phải nguyên tố không, nó đi gạch bỏ các bội. Hai chi tiết làm nó nhanh — bắt đầu gạch từ `step * step` vì các bội nhỏ hơn đã bị các số nguyên tố nhỏ hơn gạch rồi, và dừng khi `step * step >= n` vì mọi bội còn lại đều đã bị gạch." } },

  { quiz: { title: "Sàng gạch từ đâu tới đâu", questions: [
    { q: "Khi sàng với `step = 5`, vì sao bắt đầu gạch từ `25` chứ không từ `10`?",
      a: ["Vì `10`, `15`, `20` đều là bội của một số nguyên tố nhỏ hơn nên đã bị gạch từ trước", "Vì `10` không phải bội của `5`", "Vì gạch từ `10` sẽ gạch nhầm số nguyên tố", "Vì `25` là số nguyên tố"], correct: 0 },
    { q: "Với `n = 30`, vòng sàng chạy `step` tới giá trị nào là dừng được?",
      a: ["Tới `5`, vì `6 * 6` đã vượt `30`", "Tới `29`", "Tới `15`", "Tới `30`"], correct: 0 },
    { q: "`count_primes(3)` phải trả về số nào?",
      a: ["`1`, vì chỉ có số `2` nhỏ hơn `3`", "`2`, vì có `2` và `3`", "`0`", "`3`"], correct: 0 },
  ] } },

  task("sliding-window-maximum", "sliding_window_maximum.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử và số `k` với `1 <= k <= len(nums)`. Một cửa sổ rộng `k` trượt từ trái sang phải, mỗi bước một vị trí.\nPROCESS: viết hàm `max_sliding_window(nums, k)` ghi lại giá trị LỚN NHẤT trong cửa sổ ở từng vị trí.\nOUTPUT: trả về list các giá trị lớn nhất đó, theo thứ tự cửa sổ trượt. List có đúng `len(nums) - k + 1` phần tử.\nVí dụ: `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3` cho `[3, 3, 5, 5, 6, 7]`.\nCa lớn có cửa sổ rộng bằng nửa mảng, nên gọi `max` cho từng cửa sổ sẽ quá giờ.\nGợi ý: giữ một danh sách các VỊ TRÍ, luôn giảm dần theo giá trị. Giá trị mới lớn hơn thì mọi vị trí kém hơn ở cuối danh sách bị bỏ hẳn, vì chừng nào giá trị mới còn trong cửa sổ thì chúng không bao giờ là lớn nhất nữa.",
    `from leet_stack import check


def max_sliding_window(nums, k):
    # lượt của bạn
    return []


check("sliding-window-maximum", max_sliding_window)
`,
    `from leet_stack import check


def max_sliding_window(nums, k):
    keep = []
    out = []
    for index, value in enumerate(nums):
        while keep and nums[keep[-1]] <= value:
            keep.pop()
        keep.append(index)
        if keep[0] <= index - k:
            keep.pop(0)
        if index >= k - 1:
            out.append(nums[keep[0]])
    return out


check("sliding-window-maximum", max_sliding_window)
`),

  { checkpoint: { text: "Danh sách vị trí ở bài cửa sổ trượt bị cắt ở HAI đầu, vì hai lý do khác nhau. Cuối danh sách: một vị trí bị bỏ vì có giá trị mới lớn hơn nó, nó không còn cơ hội thắng. Đầu danh sách: một vị trí bị bỏ vì đã TRƯỢT RA NGOÀI cửa sổ. Mỗi vị trí vào một lần và ra một lần, nên tổng công việc chỉ bằng độ dài mảng." } },

  { quiz: { title: "Bỏ khỏi hàng đợi vì lý do gì", questions: [
    { q: "Hàng đợi đang giữ các vị trí có giá trị `[9, 5, 2]` và giá trị mới là `6`. Những vị trí nào bị bỏ khỏi CUỐI hàng đợi?",
      a: ["Hai vị trí mang `5` và `2`, vì chừng nào `6` còn trong cửa sổ thì chúng không thể là lớn nhất", "Chỉ vị trí mang `2`", "Cả ba vị trí", "Không vị trí nào, vì `6` nhỏ hơn `9`"], correct: 0 },
    { q: "Một vị trí bị bỏ khỏi ĐẦU hàng đợi vì lý do gì?",
      a: ["Vì nó đã trượt ra ngoài cửa sổ, dù giá trị của nó có lớn tới đâu", "Vì giá trị của nó nhỏ hơn giá trị mới", "Vì hàng đợi đã đầy", "Vì nó đã được ghi vào kết quả"], correct: 0 },
    { q: "Vì sao tổng công việc của cách này chỉ bằng độ dài mảng, dù trong vòng lặp có một vòng `while` nữa?",
      a: ["Vì mỗi vị trí chỉ được thêm vào đúng một lần và bị bỏ ra nhiều nhất một lần", "Vì vòng `while` chạy nhiều nhất hai lần mỗi bước", "Vì hàng đợi luôn có nhiều nhất `k` phần tử", "Vì `k` luôn nhỏ hơn độ dài mảng"], correct: 0 },
  ] } },

  task("largest-rectangle", "largest_rectangle.py",
    "ĐỀ BÀI\nCho sẵn list `heights` các số không âm, mỗi số là chiều cao một cột rộng đúng `1` đơn vị, các cột dựng sát nhau.\nPROCESS: viết hàm `largest_rectangle_area(heights)` tìm hình chữ nhật có DIỆN TÍCH lớn nhất nằm gọn trong biểu đồ. Hình chữ nhật có thể trải qua nhiều cột, khi đó chiều cao của nó bằng cột THẤP NHẤT trong đoạn đó.\nOUTPUT: trả về diện tích lớn nhất. List rỗng cho `0`.\nVí dụ: `[2, 1, 5, 6, 2, 3]` cho `10`, là hình chữ nhật cao `5` rộng `2` phủ hai cột `5` và `6`.\nCa lớn có hàng nghìn cột, nên thử mọi đoạn sẽ quá giờ.\nGợi ý: giữ một ngăn xếp các cột có chiều cao TĂNG DẦN. Gặp cột thấp hơn thì các cột cao đang nằm ở đỉnh ngăn xếp không thể kéo dài thêm sang phải nữa — đó đúng là lúc chốt diện tích của chúng.",
    `from leet_stack import check


def largest_rectangle_area(heights):
    # lượt của bạn
    return 0


check("largest-rectangle", largest_rectangle_area)
`,
    `from leet_stack import check


def largest_rectangle_area(heights):
    stack = []
    best = 0
    for index, height in enumerate(list(heights) + [0]):
        while stack and heights[stack[-1]] >= height:
            top = heights[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            best = max(best, top * (index - left))
        stack.append(index)
    return best


check("largest-rectangle", largest_rectangle_area)
`),

  { npc: "Cột `0` gắn thêm ở cuối là mẹo nhỏ mà quan trọng: nó thấp hơn mọi cột nên buộc ngăn xếp chốt nốt những cột còn sót lại." },

  task("maximal-rectangle", "maximal_rectangle.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là lưới chỉ gồm `0` và `1`.\nPROCESS: viết hàm `maximal_rectangle(matrix)` tìm hình CHỮ NHẬT lớn nhất mà mọi ô bên trong đều là `1`.\nOUTPUT: trả về DIỆN TÍCH của hình chữ nhật đó, tức số ô nó phủ. Không có ô `1` nào thì trả về `0`.\nVí dụ: `[[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]` cho `6`.\nGợi ý: coi MỖI HÀNG là đáy của một biểu đồ cột — chiều cao tại mỗi cột là số ô `1` liên tiếp tính ngược lên từ hàng đó. Khi ấy mỗi hàng thành một bài biểu đồ cột, và diện tích lớn nhất của cả lưới là diện tích lớn nhất trong các hàng.",
    `from leet_stack import check


def maximal_rectangle(matrix):
    # lượt của bạn
    return 0


check("maximal-rectangle", maximal_rectangle)
`,
    `from leet_stack import check


def largest_rectangle_area(heights):
    stack = []
    best = 0
    for index, height in enumerate(list(heights) + [0]):
        while stack and heights[stack[-1]] >= height:
            top = heights[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            best = max(best, top * (index - left))
        stack.append(index)
    return best


def maximal_rectangle(matrix):
    cols = len(matrix[0])
    heights = [0] * cols
    best = 0
    for row in matrix:
        for col in range(cols):
            if row[col] == 1:
                heights[col] += 1
            else:
                heights[col] = 0
        best = max(best, largest_rectangle_area(heights))
    return best


check("maximal-rectangle", maximal_rectangle)
`),

  task("max-points-on-a-line", "max_points_on_a_line.py",
    "ĐỀ BÀI\nCho sẵn list `points`, mỗi phần tử là `[x, y]` toạ độ một điểm, các điểm KHÁC NHAU đôi một.\nPROCESS: viết hàm `max_points(points)` tìm số điểm nhiều nhất cùng nằm trên MỘT đường thẳng.\nOUTPUT: trả về số điểm đó. Một điểm cho `1`, hai điểm luôn cho `2` vì qua hai điểm luôn có một đường thẳng.\nVí dụ: `[[1, 1], [2, 2], [3, 3]]` cho `3`. `[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]` cho `4`.\nGợi ý: đứng ở từng điểm, nhóm các điểm còn lại theo HƯỚNG nhìn từ điểm đó. Đừng dùng phép chia để tính độ dốc — hãy rút gọn cặp `(dx, dy)` bằng ước chung lớn nhất rồi chuẩn hoá dấu, như vậy tránh được cả số thực lẫn trường hợp đường thẳng đứng.",
    `from leet_stack import check


def max_points(points):
    # lượt của bạn
    return 0


check("max-points-on-a-line", max_points)
`,
    `from leet_stack import check


def gcd(first, second):
    while second:
        first, second = second, first % second
    return first or 1


def max_points(points):
    if len(points) <= 2:
        return len(points)
    best = 2
    for first in range(len(points)):
        directions = {}
        ax, ay = points[first]
        for second in range(len(points)):
            if second == first:
                continue
            dx = points[second][0] - ax
            dy = points[second][1] - ay
            step = gcd(abs(dx), abs(dy))
            dx, dy = dx // step, dy // step
            if dx < 0 or (dx == 0 and dy < 0):
                dx, dy = -dx, -dy
            directions[(dx, dy)] = directions.get((dx, dy), 1) + 1
            best = max(best, directions[(dx, dy)])
    return best


check("max-points-on-a-line", max_points)
`),

  task("skyline", "skyline.py",
    "ĐỀ BÀI\nCho sẵn `buildings` là list các toà nhà, mỗi toà là `[left, right, height]` — mép trái, mép phải và chiều cao. Toà nhà phủ đoạn từ `left` tới ngay TRƯỚC `right`.\nPROCESS: viết hàm `get_skyline(buildings)` mô tả ĐƯỜNG VIỀN nhìn từ xa: mỗi lần chiều cao viền thay đổi thì ghi lại một mốc.\nOUTPUT: trả về list các mốc `[x, height]` theo thứ tự `x` tăng dần, trong đó `x` là chỗ chiều cao đổi và `height` là chiều cao MỚI. Chỗ hết nhà thì `height` là `0`. Không được ghi hai mốc liên tiếp cùng chiều cao.\nVí dụ: `[[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]` cho `[[2, 10], [3, 15], [7, 12], [12, 0], [15, 10], [20, 8], [24, 0]]`.\nGợi ý: chiều cao viền chỉ có thể đổi tại MÉP của một toà nhà nào đó, nên chỉ cần xét các toạ độ mép.",
    `from leet_stack import check


def get_skyline(buildings):
    # lượt của bạn
    return []


check("skyline", get_skyline)
`,
    `from leet_stack import check


def get_skyline(buildings):
    edges = set()
    for left, right, height in buildings:
        edges.add(left)
        edges.add(right)
    out = []
    previous = 0
    for x in sorted(edges):
        tallest = 0
        for left, right, height in buildings:
            if left <= x < right:
                tallest = max(tallest, height)
        if tallest != previous:
            out.append([x, tallest])
            previous = tallest
    return out


check("skyline", get_skyline)
`),

  { remember: "Ba bài nặng nhất đảo này — biểu đồ cột, cửa sổ trượt, hình chữ nhật trong lưới — đều dùng chung một câu hỏi: thứ nào trong danh sách đang giữ VĨNH VIỄN không còn cơ hội thắng nữa? Trả lời được thì bỏ nó đi luôn, và vì mỗi thứ chỉ vào một lần rồi ra một lần nên tổng công việc chỉ bằng số phần tử. Bài lưới còn thêm một mẹo đáng nhớ: đổi một bài hai chiều thành nhiều lần chạy của một bài một chiều đã giải xong." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · NGĂN XẾP",
  sideIslandId: "leet-stack",
  completionKey: "magicdust.leet.set.stack",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Cầu Thang Xếp Chồng",
  subtitle: "chín bài giữ sẵn danh sách đã lọc thay vì nhìn lại từ đầu",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ XẾP CHỒNG" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "ca lớn dựng đúng dữ liệu làm cách quét lại không thoát sớm được" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_stack: "../py/leet_stack/__init__.py",
  },
  cells,
  finish: { title: "CẦU THANG ĐÃ GỌN", sub: "chín bài, mỗi phần tử chỉ vào một lần rồi ra một lần", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
