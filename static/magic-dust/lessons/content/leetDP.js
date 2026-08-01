// Đảo luyện tập LeetCode — cụm quy hoạch động cơ bản. Chấm bằng py/leet_judge.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ THÁC BẬC THANG ✦",
    hook: "Chín bài ở đây có chung một hình dáng: đáp án cho một chỗ tính được từ đáp án của vài chỗ ngay trước nó. Ai cũng giải được chúng bằng cách thử mọi đường đi, và ai làm vậy cũng sẽ ngồi chờ. Ghi lại kết quả từng bước rồi dùng lại, thay vì tính lại từ đầu mỗi lần — đó là toàn bộ ý tưởng.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Bốn bài trong đảo có ca dữ liệu lớn để đo giờ. Lời giải thử mọi đường vẫn đúng ở ca nhỏ rồi trượt ở ca lớn với dòng `TOO SLOW`." },

  task("pascals-triangle", "pascals_triangle.py",
    "ĐỀ BÀI\nCho sẵn số nguyên dương `num_rows`.\nPROCESS: viết hàm `generate(num_rows)` dựng `num_rows` hàng đầu của tam giác Pascal. Hàng đầu là `[1]`. Mỗi hàng sau bắt đầu và kết thúc bằng `1`, còn mỗi số ở giữa bằng TỔNG của hai số đứng ngay trên nó ở hàng trước.\nOUTPUT: trả về list các hàng.\nVí dụ: `num_rows = 5` cho `[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]`.",
    `from leet_dp import check


def generate(num_rows):
    # lượt của bạn
    return []


check("pascals-triangle", generate)
`,
    `from leet_dp import check


def generate(num_rows):
    rows = []
    for index in range(num_rows):
        row = [1] * (index + 1)
        for col in range(1, index):
            row[col] = rows[index - 1][col - 1] + rows[index - 1][col]
        rows.append(row)
    return rows


check("pascals-triangle", generate)
`),

  task("pascals-triangle-ii", "pascals_triangle_ii.py",
    "ĐỀ BÀI\nCho sẵn số nguyên không âm `row_index`.\nPROCESS: viết hàm `get_row(row_index)` trả về ĐÚNG MỘT hàng của tam giác Pascal — hàng số `row_index`, đánh số từ `0`. Hàng số `0` là `[1]`.\nOUTPUT: trả về hàng đó dưới dạng list.\nVí dụ: `row_index = 3` cho `[1, 3, 3, 1]`; `row_index = 0` cho `[1]`.\nKhông cần giữ lại các hàng trước: một hàng dựng được từ hàng liền trước, nên chỉ cần một biến mang hàng hiện tại và cập nhật nó dần lên.",
    `from leet_dp import check


def get_row(row_index):
    # lượt của bạn
    return []


check("pascals-triangle-ii", get_row)
`,
    `from leet_dp import check


def get_row(row_index):
    row = [1]
    for index in range(row_index):
        row = [1] + [row[col] + row[col + 1] for col in range(len(row) - 1)] + [1]
    return row


check("pascals-triangle-ii", get_row)
`),

  { checkpoint: { text: "Bảng quy hoạch động không phải lúc nào cũng cần giữ đủ. Nếu mỗi hàng chỉ dùng tới hàng liền trước, một biến mang hàng hiện tại là đủ, và bộ nhớ tụt từ cả tam giác xuống một dòng. Quy tắc chung: giữ đúng những gì bước sau còn cần đọc." } },

  { quiz: { title: "Giữ lại bao nhiêu bảng", questions: [
    { q: "Hàng số `4` của tam giác Pascal dựng được từ những gì?",
      a: ["Chỉ từ hàng số `3`", "Từ tất cả các hàng từ `0` tới `3`", "Từ hàng số `0`", "Không dựng được, phải tính lại từ đầu"], correct: 0 },
    { q: "Đoạn dưới đây dựng hàng tiếp theo.\n\n```python\nrow = [1] + [row[col] + row[col + 1] for col in range(len(row) - 1)] + [1]\n```\n\nVới `row = [1, 2, 1]`, dòng này cho ra gì?",
      a: ["`[1, 3, 3, 1]`", "`[1, 2, 1, 1]`", "`[1, 3, 1]`", "`[1, 1, 3, 3, 1, 1]`"], correct: 0 },
  ] } },

  task("best-time-to-buy-and-sell-stock", "best_time_to_buy_and_sell_stock.py",
    "ĐỀ BÀI\nCho sẵn list `prices`, `prices[i]` là giá cổ phiếu ở ngày thứ `i`.\nPROCESS: viết hàm `max_profit(prices)` chọn MỘT ngày để mua và MỘT ngày SAU ĐÓ để bán, sao cho lãi lớn nhất.\nOUTPUT: trả về số lãi lớn nhất. Nếu không có cách nào có lãi thì trả về `0`. List rỗng cũng trả về `0`.\nVí dụ: `[7, 1, 5, 3, 6, 4]` cho `5` — mua ở giá `1`, bán ở giá `6`. `[7, 6, 4, 3, 1]` cho `0` vì giá chỉ giảm.\nBẪY: lấy `max(prices) - min(prices)` là sai khi ngày giá cao nằm TRƯỚC ngày giá thấp.\nCa lớn có hàng nghìn ngày, nên thử mọi cặp ngày sẽ quá giờ.",
    `from leet_dp import check


def max_profit(prices):
    # lượt của bạn
    return 0


check("best-time-to-buy-and-sell-stock", max_profit)
`,
    `from leet_dp import check


def max_profit(prices):
    best, cheapest = 0, None
    for price in prices:
        if cheapest is None or price < cheapest:
            cheapest = price
        else:
            best = max(best, price - cheapest)
    return best


check("best-time-to-buy-and-sell-stock", max_profit)
`),

  task("best-time-to-buy-and-sell-stock-ii", "best_time_to_buy_and_sell_stock_ii.py",
    "ĐỀ BÀI\nCho sẵn list `prices`, `prices[i]` là giá cổ phiếu ở ngày thứ `i`. Lần này được mua bán BAO NHIÊU LẦN CŨNG ĐƯỢC, nhưng mỗi lúc trong tay nhiều nhất một cổ phiếu — muốn mua lại thì phải bán cái đang cầm trước.\nPROCESS: viết hàm `max_profit(prices)` tính tổng lãi lớn nhất.\nOUTPUT: trả về tổng lãi. Không có cách nào có lãi thì trả về `0`.\nVí dụ: `[7, 1, 5, 3, 6, 4]` cho `7` — mua `1` bán `5` được `4`, rồi mua `3` bán `6` được `3`. `[1, 2, 3, 4, 5]` cho `4`.",
    `from leet_dp import check


def max_profit(prices):
    # lượt của bạn
    return 0


check("best-time-to-buy-and-sell-stock-ii", max_profit)
`,
    `from leet_dp import check


def max_profit(prices):
    total = 0
    for index in range(1, len(prices)):
        total += max(0, prices[index] - prices[index - 1])
    return total


check("best-time-to-buy-and-sell-stock-ii", max_profit)
`),

  { checkpoint: { text: "Khi được mua bán không giới hạn số lần, mọi đoạn giá đi lên đều nhặt được trọn vẹn: mua ở đáy bán ở đỉnh cho đúng bằng tổng các chênh lệch dương của hai ngày liền nhau. Nên bài này rút gọn thành cộng dồn `max(0, prices[i] - prices[i - 1])`, không cần bảng." } },

  { quiz: { title: "Một lần hay nhiều lần", questions: [
    { q: "Với `prices = [1, 5, 3, 6]`, lãi lớn nhất khi CHỈ được mua bán MỘT lần là bao nhiêu?",
      a: ["`5`", "`7`", "`4`", "`3`"], correct: 0 },
    { q: "Vẫn `prices = [1, 5, 3, 6]`, nhưng được mua bán bao nhiêu lần cũng được. Lãi lớn nhất là bao nhiêu?",
      a: ["`7`", "`5`", "`6`", "`4`"], correct: 0 },
    { q: "Vì sao `max(prices) - min(prices)` là lời giải SAI cho bài chỉ mua bán một lần?",
      a: ["Vì ngày giá cao nhất có thể nằm trước ngày giá thấp nhất, mà đã bán thì không mua lùi lại được", "Vì `max` và `min` không dùng được với list", "Vì kết quả luôn nhỏ hơn đáp án đúng", "Vì nó không xử lý được list rỗng"], correct: 0 },
  ] } },

  task("jump-game", "jump_game.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số không âm, có ít nhất một phần tử. Bạn đứng ở vị trí `0`; đứng ở vị trí `i` thì nhảy được tối đa `nums[i]` bước sang phải.\nPROCESS: viết hàm `can_jump(nums)` xét xem có tới được vị trí CUỐI CÙNG hay không.\nOUTPUT: trả về `True` hoặc `False`. List một phần tử luôn cho `True` vì bạn đã đứng sẵn ở đó.\nVí dụ: `[2, 3, 1, 1, 4]` cho `True`. `[3, 2, 1, 0, 4]` cho `False` vì mọi đường đều dừng ở ô `0`.\nCa lớn có hàng nghìn ô và mỗi ô nhảy được rất xa, nên đánh dấu từng ô tới được cho từng bước nhảy sẽ quá giờ. Chỉ cần theo dõi VỊ TRÍ XA NHẤT tới được cho tới lúc này.",
    `from leet_dp import check


def can_jump(nums):
    # lượt của bạn
    return False


check("jump-game", can_jump)
`,
    `from leet_dp import check


def can_jump(nums):
    furthest = 0
    for index, value in enumerate(nums):
        if index > furthest:
            return False
        furthest = max(furthest, index + value)
    return True


check("jump-game", can_jump)
`),

  task("jump-game-ii", "jump_game_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số nguyên dương, có ít nhất một phần tử. Bạn đứng ở vị trí `0`; đứng ở vị trí `i` thì nhảy được tối đa `nums[i]` bước sang phải. Đề bảo đảm luôn tới được vị trí cuối.\nPROCESS: viết hàm `jump(nums)` tìm SỐ LẦN NHẢY ÍT NHẤT để tới vị trí cuối cùng.\nOUTPUT: trả về số lần nhảy. List một phần tử cho `0`.\nVí dụ: `[2, 3, 1, 1, 4]` cho `2` — nhảy từ vị trí `0` sang `1`, rồi từ `1` tới thẳng cuối.\nCa lớn có hàng nghìn ô, nên tính số bước cho từng ô một sẽ quá giờ.",
    `from leet_dp import check


def jump(nums):
    # lượt của bạn
    return 0


check("jump-game-ii", jump)
`,
    `from leet_dp import check


def jump(nums):
    jumps, edge, furthest = 0, 0, 0
    for index in range(len(nums) - 1):
        furthest = max(furthest, index + nums[index])
        if index == edge:
            jumps += 1
            edge = furthest
    return jumps


check("jump-game-ii", jump)
`),

  { npc: "Ba bài cuối đi trên lưới, và cả ba dùng chung một câu hỏi: muốn biết đáp án ở ô này, cần biết đáp án ở những ô nào? Trả lời được câu đó là bảng tự viết ra." },

  task("minimum-path-sum", "minimum_path_sum.py",
    "ĐỀ BÀI\nCho sẵn `grid` là lưới các số không âm. Bạn đi từ ô trên trái tới ô dưới phải, mỗi bước chỉ được sang PHẢI hoặc XUỐNG.\nPROCESS: viết hàm `min_path_sum(grid)` tìm đường có TỔNG các số đi qua nhỏ nhất.\nOUTPUT: trả về tổng nhỏ nhất đó, tính cả ô đầu và ô cuối.\nVí dụ: `[[1, 3, 1], [1, 5, 1], [4, 2, 1]]` cho `7` — đường `1 → 3 → 1 → 1 → 1`.\nBẪY: mỗi bước chọn ô nhỏ hơn ngay trước mắt là sai; một ô rẻ có thể dẫn vào vùng đắt.",
    `from leet_dp import check


def min_path_sum(grid):
    # lượt của bạn
    return 0


check("minimum-path-sum", min_path_sum)
`,
    `from leet_dp import check


def min_path_sum(grid):
    best = list(grid[0])
    for col in range(1, len(best)):
        best[col] += best[col - 1]
    for row in range(1, len(grid)):
        best[0] += grid[row][0]
        for col in range(1, len(best)):
            best[col] = grid[row][col] + min(best[col], best[col - 1])
    return best[-1]


check("minimum-path-sum", min_path_sum)
`),

  task("unique-paths-ii", "unique_paths_ii.py",
    "ĐỀ BÀI\nCho sẵn `grid` là lưới chỉ gồm `0` và `1`: `0` là ô đi được, `1` là chướng ngại vật. Bạn đi từ ô trên trái tới ô dưới phải, mỗi bước chỉ được sang PHẢI hoặc XUỐNG, và không được giẫm lên ô `1`. Ô xuất phát luôn là `0`.\nPROCESS: viết hàm `unique_paths_with_obstacles(grid)` ĐẾM số đường đi khác nhau.\nOUTPUT: trả về số đường. Nếu ô đích là chướng ngại vật hoặc bị chặn hết đường thì trả về `0`.\nVí dụ: `[[0, 0, 0], [0, 1, 0], [0, 0, 0]]` cho `2`. Lưới `[[0]]` cho `1` vì đứng sẵn ở đích cũng tính là một đường.",
    `from leet_dp import check


def unique_paths_with_obstacles(grid):
    # lượt của bạn
    return 0


check("unique-paths-ii", unique_paths_with_obstacles)
`,
    `from leet_dp import check


def unique_paths_with_obstacles(grid):
    cols = len(grid[0])
    ways = [0] * cols
    ways[0] = 1
    for row in grid:
        for col in range(cols):
            if row[col] == 1:
                ways[col] = 0
            elif col:
                ways[col] += ways[col - 1]
    return ways[-1]


check("unique-paths-ii", unique_paths_with_obstacles)
`),

  task("triangle", "triangle.py",
    "ĐỀ BÀI\nCho sẵn `triangle` là list các hàng, hàng thứ `i` có đúng `i + 1` số. Bạn bắt đầu ở số duy nhất của hàng đầu và đi xuống từng hàng một; đứng ở vị trí `col` của hàng `row` thì bước tiếp chỉ được sang vị trí `col` hoặc `col + 1` của hàng dưới.\nPROCESS: viết hàm `minimum_total(triangle)` tìm đường từ đỉnh xuống hàng cuối có TỔNG nhỏ nhất. Các số có thể âm.\nOUTPUT: trả về tổng nhỏ nhất đó.\nVí dụ: `[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]` cho `11` — đường `2 → 3 → 5 → 1`.\nGợi ý: tính từ hàng CUỐI ngược lên thì mỗi ô chỉ cần nhìn hai ô ngay dưới nó, không phải đoán trước tương lai.",
    `from leet_dp import check


def minimum_total(triangle):
    # lượt của bạn
    return 0


check("triangle", minimum_total)
`,
    `from leet_dp import check


def minimum_total(triangle):
    best = list(triangle[-1])
    for row in range(len(triangle) - 2, -1, -1):
        best = [triangle[row][col] + min(best[col], best[col + 1])
                for col in range(row + 1)]
    return best[0]


check("triangle", minimum_total)
`),

  { remember: "Cả chín bài đều bắt đầu bằng cùng một câu hỏi: đáp án ở chỗ này tính được từ đáp án ở những chỗ nào? Trả lời xong thì chỉ còn hai việc. Một là chọn chiều đi sao cho những chỗ cần đọc đã được tính trước — bài tam giác dễ hơn hẳn khi đi từ hàng cuối ngược lên. Hai là bỏ bớt phần bảng không ai còn đọc nữa, như ba bài cuối chỉ giữ đúng một dòng thay vì cả lưới." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · QUY HOẠCH ĐỘNG",
  sideIslandId: "leet-dp",
  completionKey: "magicdust.leet.set.dp",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Thác Bậc Thang",
  subtitle: "chín bài quy hoạch động: bảng số, đường trên lưới, mua bán",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ BẬC THANG" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "ca nhỏ đối chiếu cách thử mọi đường, ca lớn đo giờ" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_dp: "../py/leet_dp/__init__.py",
  },
  cells,
  finish: { title: "THÁC ĐÃ LẶNG", sub: "chín bài, không bài nào còn phải tính lại thứ đã tính", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
