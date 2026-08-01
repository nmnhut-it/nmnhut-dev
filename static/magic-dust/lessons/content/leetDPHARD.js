// Đảo luyện tập LeetCode — quy hoạch động có trạng thái. Chấm bằng py/leet_judge.
//
// Khác đảo Thác Bậc Thang ở chỗ mỗi ô của bảng không còn là một con số mà là
// một NHÓM trạng thái: đang cầm hay không cầm cổ phiếu, đã mua bán mấy lần.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ HANG NHIỀU TẦNG ✦",
    hook: "Ở thác bậc thang, mỗi chỗ chỉ cần nhớ một con số. Chín bài trong hang này thì không: muốn biết hôm nay lãi nhất bao nhiêu, phải biết cả hai chuyện — đang cầm cổ phiếu hay không, và đã mua bán mấy lần rồi. Một ô của bảng trở thành một nhóm trạng thái, và đó là toàn bộ chỗ khó.",
    art: "assets/old-computer.webp",
  } },

  { quiz: { title: "Nhớ lại thác bậc thang", questions: [
    { q: "Bài tìm đường có tổng nhỏ nhất trên lưới chỉ cho đi PHẢI hoặc XUỐNG. Muốn biết đáp án tại ô `(row, col)`, cần biết đáp án tại những ô nào?",
      a: ["Ô ngay trên và ô ngay bên trái nó", "Cả bốn ô kề cạnh", "Ô ngay dưới và ô ngay bên phải nó", "Chỉ ô đầu tiên của lưới"], correct: 0 },
    { q: "Vì sao bài tam giác dễ hơn hẳn khi tính từ hàng CUỐI ngược lên?",
      a: ["Vì khi đó mỗi ô chỉ cần đọc hai ô ngay dưới, mà hai ô đó đã được tính xong", "Vì hàng cuối có nhiều số nhất", "Vì vòng `for` chạy ngược nhanh hơn", "Vì tổng của hàng cuối luôn nhỏ nhất"], correct: 0 },
  ] } },

  task("house-robber", "house_robber.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số không âm, có ít nhất một phần tử; `nums[i]` là số tiền trong nhà thứ `i`, các nhà xếp thành một HÀNG THẲNG. Không được lấy hai nhà KỀ NHAU.\nPROCESS: viết hàm `rob(nums)` tìm số tiền lớn nhất lấy được.\nOUTPUT: trả về số tiền đó.\nVí dụ: `[1, 2, 3, 1]` cho `4` — lấy nhà `0` và nhà `2`. `[2, 7, 9, 3, 1]` cho `12` — lấy nhà `0`, `2` và `4`.\nBẪY: lấy hết các nhà ở vị trí chẵn không phải lúc nào cũng tốt nhất; thử `[2, 1, 1, 2]`.\nCa lớn có hàng nghìn nhà, nên thử mọi cách chọn sẽ quá giờ.",
    `from leet_dphard import check


def rob(nums):
    # lượt của bạn
    return 0


check("house-robber", rob)
`,
    `from leet_dphard import check


def rob(nums):
    skip, take = 0, 0
    for value in nums:
        skip, take = max(skip, take), skip + value
    return max(skip, take)


check("house-robber", rob)
`),

  { checkpoint: { text: "Tới nhà thứ `i`, chỉ có hai tình huống: vừa lấy nhà đó, hoặc vừa bỏ qua nó. Giữ hai con số `take` và `skip` cho hai tình huống ấy là đủ, và cập nhật bằng `skip, take = max(skip, take), skip + value` — vế phải tính xong trước khi gán, nên `skip + value` vẫn dùng giá trị `skip` CŨ, đúng như ý muốn." } },

  { quiz: { title: "Hai trạng thái của một bước", questions: [
    { q: "Với `nums = [2, 1, 1, 2]`, lấy hết các nhà ở vị trí CHẴN được bao nhiêu tiền?",
      a: ["`3`", "`4`", "`5`", "`6`"], correct: 0 },
    { q: "Vẫn `nums = [2, 1, 1, 2]`, số tiền lớn nhất thật sự lấy được là bao nhiêu?",
      a: ["`4`, bằng cách lấy nhà đầu và nhà cuối", "`3`", "`5`", "`2`"], correct: 0 },
    { q: "Dòng `skip, take = max(skip, take), skip + value` dùng giá trị `skip` nào để tính `skip + value`?",
      a: ["Giá trị `skip` CŨ, vì cả vế phải được tính xong rồi mới gán", "Giá trị `skip` MỚI vừa gán ở vế trái", "Tuỳ phiên bản Python", "Giá trị `take` cũ"], correct: 0 },
  ] } },

  task("house-robber-ii", "house_robber_ii.py",
    "ĐỀ BÀI\nGiống bài trước, nhưng các nhà xếp thành một VÒNG TRÒN: nhà đầu tiên và nhà cuối cùng cũng kề nhau, nên không được lấy cả hai.\nPROCESS: viết hàm `rob(nums)` tìm số tiền lớn nhất lấy được. `nums` có ít nhất một phần tử.\nOUTPUT: trả về số tiền đó. List một phần tử thì lấy luôn nhà đó.\nVí dụ: `[2, 3, 2]` cho `3` — không lấy được cả hai nhà `2` vì chúng kề nhau qua vòng. `[1, 2, 3, 1]` cho `4`.\nGợi ý: nếu đã quyết bỏ hẳn nhà đầu, hoặc bỏ hẳn nhà cuối, thì phần còn lại là một HÀNG THẲNG — đúng bài trước.\nCa lớn có hàng nghìn nhà.",
    `from leet_dphard import check


def rob(nums):
    # lượt của bạn
    return 0


check("house-robber-ii", rob)
`,
    `from leet_dphard import check


def rob_line(nums):
    skip, take = 0, 0
    for value in nums:
        skip, take = max(skip, take), skip + value
    return max(skip, take)


def rob(nums):
    if len(nums) == 1:
        return nums[0]
    return max(rob_line(nums[1:]), rob_line(nums[:-1]))


check("house-robber-ii", rob)
`),

  task("maximum-product-subarray", "maximum_product_subarray.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử, có thể có số âm và số `0`.\nPROCESS: viết hàm `max_product(nums)` tìm đoạn liền nhau (ít nhất một phần tử) có TÍCH lớn nhất.\nOUTPUT: trả về tích lớn nhất đó.\nVí dụ: `[2, 3, -2, 4]` cho `6`, là tích của `[2, 3]`. `[-2, 0, -1]` cho `0`.\nBẪY: chỉ nhớ tích lớn nhất là không đủ. Một tích ÂM RẤT NHỎ khi gặp thêm một số âm sẽ hoá thành số dương rất lớn, nên phải nhớ cả tích nhỏ nhất.\nCa lớn có hàng nghìn số, nên nhân lại mọi đoạn sẽ quá giờ.",
    `from leet_dphard import check


def max_product(nums):
    # lượt của bạn
    return 0


check("maximum-product-subarray", max_product)
`,
    `from leet_dphard import check


def max_product(nums):
    best = high = low = nums[0]
    for value in nums[1:]:
        options = (value, high * value, low * value)
        high, low = max(options), min(options)
        best = max(best, high)
    return best


check("maximum-product-subarray", max_product)
`),

  { checkpoint: { text: "Với phép nhân, giá trị NHỎ NHẤT cũng là một trạng thái phải mang theo: `-8` gặp `-3` thành `24`, lớn hơn mọi tích dương đang có. Nên mỗi bước tính cả `high` lẫn `low` từ ba lựa chọn — bắt đầu lại từ chính số đó, nhân vào `high` cũ, hoặc nhân vào `low` cũ — và phải lấy `high` cũ trước khi ghi đè nó." } },

  { quiz: { title: "Vì sao phải nhớ cả tích nhỏ nhất", questions: [
    { q: "Đang xét `nums = [2, -3, -4]`. Sau hai số đầu, tích lớn nhất kết thúc tại đó là `2` và tích nhỏ nhất là `-6`. Gặp số `-4`, tích lớn nhất mới là bao nhiêu?",
      a: ["`24`, từ `-6 * -4`", "`-8`, từ `2 * -4`", "`2`, giữ nguyên", "`-4`, bắt đầu lại từ chính nó"], correct: 0 },
    { q: "Đoạn dưới đây cập nhật hai trạng thái.\n\n```python\noptions = (value, high * value, low * value)\nhigh, low = max(options), min(options)\n```\n\nVì sao phải gom cả ba khả năng vào `options` rồi mới gán, thay vì gán `high` trước rồi tính `low`?",
      a: ["Vì `low` cần dùng `high` CŨ; gán `high` trước thì `low` tính theo giá trị đã bị ghi đè", "Vì `max` phải chạy trước `min`", "Vì tuple nhanh hơn list", "Vì `options` cần đúng ba phần tử"], correct: 0 },
  ] } },

  task("best-time-iii", "best_time_iii.py",
    "ĐỀ BÀI\nCho sẵn list `prices`, `prices[i]` là giá cổ phiếu ngày thứ `i`. Được mua bán NHIỀU NHẤT HAI lần, và mỗi lúc trong tay nhiều nhất một cổ phiếu — muốn mua lại thì phải bán cái đang cầm trước.\nPROCESS: viết hàm `max_profit(prices)` tính tổng lãi lớn nhất.\nOUTPUT: trả về tổng lãi. Không có cách nào có lãi thì trả về `0`. List rỗng cũng cho `0`.\nVí dụ: `[3, 3, 5, 0, 0, 3, 1, 4]` cho `6` — mua `0` bán `3` được `3`, rồi mua `1` bán `4` được `3`. `[7, 6, 4, 3, 1]` cho `0`.\nGợi ý: mỗi ngày, trạng thái của bạn gồm hai thông tin — đã bán xong mấy lần, và đang cầm cổ phiếu hay không.",
    `from leet_dphard import check


def max_profit(prices):
    # lượt của bạn
    return 0


check("best-time-iii", max_profit)
`,
    `from leet_dphard import check


def max_profit(prices):
    limit = 2
    holding = [None] * (limit + 1)
    free = [0] * (limit + 1)
    for price in prices:
        for deals in range(limit, 0, -1):
            if holding[deals] is not None:
                free[deals] = max(free[deals], holding[deals] + price)
            candidate = free[deals - 1] - price
            if holding[deals] is None:
                holding[deals] = candidate
            else:
                holding[deals] = max(holding[deals], candidate)
    return max(free)


check("best-time-iii", max_profit)
`),

  task("best-time-iv", "best_time_iv.py",
    "ĐỀ BÀI\nCho sẵn số nguyên không âm `k` và list `prices`, `prices[i]` là giá cổ phiếu ngày thứ `i`. Được mua bán NHIỀU NHẤT `k` lần, mỗi lúc trong tay nhiều nhất một cổ phiếu.\nPROCESS: viết hàm `max_profit(k, prices)` tính tổng lãi lớn nhất.\nOUTPUT: trả về tổng lãi. `k = 0` hoặc `prices` rỗng thì cho `0`.\nVí dụ: `k = 2`, `prices = [3, 2, 6, 5, 0, 3]` cho `7`. `k = 2`, `prices = [2, 4, 1]` cho `2`.\nĐây chính là bài trước với số `2` thay bằng `k`, nên nếu bài trước bạn viết bảng theo số lần đã bán thì bài này gần như không phải sửa gì.",
    `from leet_dphard import check


def max_profit(k, prices):
    # lượt của bạn
    return 0


check("best-time-iv", max_profit)
`,
    `from leet_dphard import check


def max_profit(k, prices):
    if not prices or k == 0:
        return 0
    holding = [None] * (k + 1)
    free = [0] * (k + 1)
    for price in prices:
        for deals in range(k, 0, -1):
            if holding[deals] is not None:
                free[deals] = max(free[deals], holding[deals] + price)
            candidate = free[deals - 1] - price
            if holding[deals] is None:
                holding[deals] = candidate
            else:
                holding[deals] = max(holding[deals], candidate)
    return max(free)


check("best-time-iv", max_profit)
`),

  { quiz: { title: "Bảng có mấy chiều", questions: [
    { q: "Bài mua bán nhiều nhất `k` lần cần bảng theo những chiều nào?",
      a: ["Theo ngày, theo số lần đã bán, và theo việc đang cầm hay không cầm cổ phiếu", "Chỉ theo ngày", "Chỉ theo số lần đã bán", "Theo ngày và theo giá cổ phiếu"], correct: 0 },
    { q: "Trong vòng cập nhật, vì sao `for deals` nên chạy NGƯỢC từ `k` về `1`?",
      a: ["Để mỗi ngày, ô ứng với `deals` đọc được giá trị của `deals - 1` từ ngày trước chứ không phải giá trị vừa cập nhật trong chính ngày này", "Vì chạy ngược thì nhanh hơn", "Vì `range` chỉ chạy ngược được", "Vì như vậy `free[0]` mới được cập nhật"], correct: 0 },
  ] } },

  task("word-break", "word_break.py",
    "ĐỀ BÀI\nCho sẵn chuỗi `text` và list các chuỗi `word_dict`.\nPROCESS: viết hàm `word_break(text, word_dict)` xét xem `text` có cắt được thành một dãy các từ đều thuộc `word_dict` hay không. Mỗi từ được dùng lại bao nhiêu lần cũng được, và các mảnh cắt ra phải ghép liền lại đúng bằng `text`.\nOUTPUT: trả về `True` hoặc `False`. Chuỗi rỗng cho `True` vì không cần cắt gì cả.\nVí dụ: `text = \"leetcode\"`, `word_dict = [\"leet\", \"code\"]` cho `True`. `text = \"catsandog\"` với `[\"cats\", \"dog\", \"sand\", \"and\", \"cat\"]` cho `False`.\nCa lớn là chuỗi hai nghìn chữ `a` với bộ từ `[\"a\", \"aa\", \"aaa\"]`, nên thử mọi chỗ cắt sẽ quá giờ.",
    `from leet_dphard import check


def word_break(text, word_dict):
    # lượt của bạn
    return False


check("word-break", word_break)
`,
    `from leet_dphard import check


def word_break(text, word_dict):
    reachable = [True] + [False] * len(text)
    for end in range(1, len(text) + 1):
        for word in word_dict:
            start = end - len(word)
            if start >= 0 and reachable[start] and text[start:end] == word:
                reachable[end] = True
                break
    return reachable[-1]


check("word-break", word_break)
`),

  { checkpoint: { text: "Bài cắt chuỗi biến thành bảng khi đổi câu hỏi thành: cắt được tới vị trí `end` hay không? Trả lời cho `end` chỉ cần nhìn các vị trí `start` trước nó mà đoạn `text[start:end]` là một từ trong danh sách. Nhờ mỗi vị trí chỉ được trả lời MỘT lần, chuỗi hai nghìn chữ `a` không còn làm bùng nổ số nhánh." } },

  { quiz: { title: "Bảng cắt tới đâu", questions: [
    { q: "Với `text = \"aab\"` và `word_dict = [\"a\", \"aa\"]`, list `reachable` có `len(text) + 1` ô. Ô `reachable[0]` mang giá trị nào và có nghĩa gì?",
      a: ["`True` — chuỗi rỗng luôn cắt được vì không phải cắt gì cả", "`False` — chưa cắt được chữ nào", "`True` — vì chữ đầu tiên là `\"a\"` nằm trong danh sách", "Không có ô `reachable[0]`"], correct: 0 },
    { q: "Vẫn `text = \"aab\"` với `word_dict = [\"a\", \"aa\"]`. Sau khi chạy xong, `reachable[2]` và `reachable[3]` lần lượt là gì?",
      a: ["`True` và `False`, vì cắt được `\"aa\"` nhưng không có từ nào phủ được chữ `\"b\"`", "`True` và `True`", "`False` và `False`", "`False` và `True`"], correct: 0 },
  ] } },

  task("word-break-ii", "word_break_ii.py",
    "ĐỀ BÀI\nCho sẵn chuỗi `text` và list các chuỗi `word_dict`.\nPROCESS: viết hàm `word_break(text, word_dict)` liệt kê MỌI cách cắt `text` thành dãy các từ thuộc `word_dict`.\nOUTPUT: trả về list các câu, mỗi câu là các từ đã cắt nối lại bằng MỘT dấu cách. Thứ tự các câu tự do, nhưng không được có câu lặp. Nếu không cắt được thì trả về list rỗng; nếu `text` rỗng thì trả về `[\"\"]`.\nVí dụ: `text = \"catsanddog\"` với `[\"cat\", \"cats\", \"and\", \"sand\", \"dog\"]` cho hai câu: `\"cats and dog\"` và `\"cat sand dog\"`.\nGợi ý: bài này phải liệt kê nên không tránh được việc đi mọi nhánh, nhưng những đoạn đuôi giống nhau thì kết quả cũng giống nhau — ghi nhớ lại theo phần đuôi còn lại.",
    `from leet_dphard import check


def word_break(text, word_dict):
    # lượt của bạn
    return []


check("word-break-ii", word_break)
`,
    `from leet_dphard import check


def word_break(text, word_dict):
    cache = {}

    def walk(rest):
        if rest in cache:
            return cache[rest]
        if not rest:
            return [""]
        out = []
        for word in word_dict:
            if rest.startswith(word):
                for tail in walk(rest[len(word):]):
                    out.append(word if not tail else word + " " + tail)
        cache[rest] = out
        return out

    return walk(text)


check("word-break-ii", word_break)
`),

  task("maximal-square", "maximal_square.py",
    "ĐỀ BÀI\nCho sẵn `matrix` là lưới chỉ gồm `0` và `1`.\nPROCESS: viết hàm `maximal_square(matrix)` tìm hình VUÔNG lớn nhất mà mọi ô bên trong đều là `1`.\nOUTPUT: trả về DIỆN TÍCH của hình vuông đó, tức cạnh nhân cạnh. Không có ô `1` nào thì trả về `0`.\nVí dụ: `[[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]]` cho `4`, là hình vuông cạnh `2`.\nGợi ý: hỏi ở mỗi ô — hình vuông toàn `1` lớn nhất có GÓC DƯỚI PHẢI tại ô này thì cạnh bằng bao nhiêu? Cạnh đó bị chặn bởi ba ô kề: trên, trái, và chéo trên trái.\nCa lớn là lưới hàng nghìn ô toàn `1`.",
    `from leet_dphard import check


def maximal_square(matrix):
    # lượt của bạn
    return 0


check("maximal-square", maximal_square)
`,
    `from leet_dphard import check


def maximal_square(matrix):
    rows, cols = len(matrix), len(matrix[0])
    sides = [[0] * cols for _ in range(rows)]
    best = 0
    for row in range(rows):
        for col in range(cols):
            if matrix[row][col] == 1:
                if row == 0 or col == 0:
                    sides[row][col] = 1
                else:
                    sides[row][col] = 1 + min(sides[row - 1][col], sides[row][col - 1],
                                              sides[row - 1][col - 1])
                best = max(best, sides[row][col])
    return best * best


check("maximal-square", maximal_square)
`),

  task("dungeon-game", "dungeon_game.py",
    "ĐỀ BÀI\nCho sẵn `dungeon` là lưới các số. Hiệp sĩ đi từ ô trên trái tới ô dưới phải, mỗi bước chỉ được sang PHẢI hoặc XUỐNG. Bước vào một ô thì máu cộng thêm số ở ô đó (số âm là mất máu), tính cả ô xuất phát và ô đích. Máu phải LUÔN LỚN HƠN HOẶC BẰNG `1` ở mọi thời điểm.\nPROCESS: viết hàm `calculate_minimum_hp(dungeon)` tìm lượng máu KHỞI ĐIỂM nhỏ nhất đủ để đi tới đích.\nOUTPUT: trả về lượng máu đó, luôn ít nhất là `1`.\nVí dụ: `[[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]` cho `7`. Lưới `[[3]]` cho `1` vì không mất máu.\nGợi ý: tính từ ô ĐÍCH ngược về ô xuất phát. Đi xuôi thì không biết phía trước còn hụt bao nhiêu máu, còn đi ngược thì mỗi ô chỉ cần hỏi: muốn sống tới đích, rời ô này phải còn ít nhất bao nhiêu máu?",
    `from leet_dphard import check


def calculate_minimum_hp(dungeon):
    # lượt của bạn
    return 1


check("dungeon-game", calculate_minimum_hp)
`,
    `from leet_dphard import check


def calculate_minimum_hp(dungeon):
    rows, cols = len(dungeon), len(dungeon[0])
    need = [[0] * cols for _ in range(rows)]
    for row in range(rows - 1, -1, -1):
        for col in range(cols - 1, -1, -1):
            if row == rows - 1 and col == cols - 1:
                ahead = 1
            elif row == rows - 1:
                ahead = need[row][col + 1]
            elif col == cols - 1:
                ahead = need[row + 1][col]
            else:
                ahead = min(need[row + 1][col], need[row][col + 1])
            need[row][col] = max(1, ahead - dungeon[row][col])
    return need[0][0]


check("dungeon-game", calculate_minimum_hp)
`),

  { remember: "Hai điều rút ra từ hang này. Thứ nhất, khi một con số không đủ mô tả tình hình thì hãy thêm chiều cho bảng: đang cầm hay không, đã bán mấy lần, tích lớn nhất và tích nhỏ nhất. Thứ hai, chiều đi quan trọng ngang với công thức. Bài hang ngục đi xuôi thì không tính nổi vì không biết phía trước còn hụt bao nhiêu máu; đi ngược từ đích về thì mỗi ô chỉ còn một câu hỏi đơn giản." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · QHĐ NÂNG CAO",
  sideIslandId: "leet-dphard",
  completionKey: "magicdust.leet.set.dphard",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Hang Nhiều Tầng",
  subtitle: "chín bài mà mỗi ô của bảng là một nhóm trạng thái, không phải một số",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ NHIỀU TẦNG" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "ca nhỏ đối chiếu cách thử mọi khả năng, ca lớn đo giờ" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_dphard: "../py/leet_dphard/__init__.py",
  },
  cells,
  finish: { title: "HANG ĐÃ SÁNG", sub: "chín bài, mỗi bảng đều đủ chiều để không phải đoán", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
