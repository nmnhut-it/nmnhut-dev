// Đảo luyện tập LeetCode — cụm đi thử rồi lùi lại. Chấm bằng py/leet_judge.
//
// Cả cụm trả về một DANH SÁCH CÁC LỜI GIẢI với thứ tự tự do, nên máy chấm
// chuẩn hoá trước khi so, và bắt luôn lỗi trùng — xem `_norm_groups` trong
// py/leet_backtrack.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ RỪNG RẼ NHÁNH ✦",
    hook: "Chín bài ở đây không hỏi một đáp án, chúng hỏi TẤT CẢ đáp án. Cách làm luôn giống nhau: đặt một lựa chọn xuống, đi tiếp, và khi đường cụt thì DỌN LẠI đúng thứ vừa đặt rồi thử lựa chọn khác. Quên bước dọn là chỗ hỏng thường gặp nhất của cả cụm.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Thứ tự các lời giải bạn trả về không quan trọng, máy chấm sắp lại trước khi so. Nhưng nó bắt lỗi TRÙNG: bảy trong chín bài đòi mỗi lời giải chỉ xuất hiện một lần." },

  task("subsets", "subsets.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số khác nhau đôi một.\nPROCESS: viết hàm `subsets(nums)` liệt kê mọi TẬP CON của `nums` — tức mọi cách chọn ra một nhóm phần tử, kể cả nhóm rỗng và nhóm lấy hết.\nOUTPUT: trả về list các tập con, mỗi tập con là một list. Thứ tự các tập con và thứ tự trong mỗi tập con đều tự do, nhưng không được có tập con lặp lại.\nVí dụ: `[1, 2, 3]` cho tám tập con: `[]`, `[1]`, `[2]`, `[3]`, `[1, 2]`, `[1, 3]`, `[2, 3]`, `[1, 2, 3]`. List rỗng cho đúng một tập con là `[]`.",
    `from leet_backtrack import check


def subsets(nums):
    # lượt của bạn
    return []


check("subsets", subsets)
`,
    `from leet_backtrack import check


def subsets(nums):
    out = [[]]
    for value in nums:
        out += [group + [value] for group in out]
    return out


check("subsets", subsets)
`),

  { checkpoint: { text: "Mỗi phần tử chỉ có hai khả năng: có mặt trong tập con, hoặc không. Nên `n` phần tử cho đúng `2 ** n` tập con, và cách dựng ngắn nhất là: bắt đầu với danh sách chỉ chứa tập rỗng, rồi với mỗi phần tử mới, nhân đôi danh sách bằng cách thêm phần tử đó vào mọi tập đang có." } },

  { quiz: { title: "Đếm số tập con", questions: [
    { q: "List `[4, 7, 9, 11]` có bao nhiêu tập con, tính cả tập rỗng?",
      a: ["`16`", "`8`", "`4`", "`24`"], correct: 0 },
    { q: "Đoạn dưới đây chạy trên `nums = [1, 2]`.\n\n```python\nout = [[]]\nfor value in nums:\n    out += [group + [value] for group in out]\n```\n\nSau vòng lặp, `out` có bao nhiêu phần tử?",
      a: ["`4`", "`2`", "`3`", "`5`"], correct: 0 },
    { q: "Vẫn đoạn trên, vì sao viết `group + [value]` chứ không viết `group.append(value)`?",
      a: ["Vì `append` sửa thẳng vào tập đang có, làm mất bản không chứa `value`, còn `group + [value]` tạo một list mới", "Vì `append` chỉ dùng được với số", "Vì `append` trả về list mới", "Vì hai cách giống hệt nhau, viết cách nào cũng được"], correct: 0 },
  ] } },

  task("subsets-ii", "subsets_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums`, lần này CÓ THỂ có phần tử trùng nhau.\nPROCESS: viết hàm `subsets_with_dup(nums)` liệt kê mọi tập con KHÁC NHAU. Hai tập con gồm cùng những giá trị đó, dù lấy từ vị trí khác nhau trong list, vẫn tính là một.\nOUTPUT: trả về list các tập con, không được lặp.\nVí dụ: `[1, 2, 2]` cho sáu tập con: `[]`, `[1]`, `[2]`, `[1, 2]`, `[2, 2]`, `[1, 2, 2]` — chứ không phải tám, vì hai số `2` cho ra những tập giống nhau.\nGợi ý: sắp xếp `nums` trước thì các giá trị bằng nhau nằm cạnh nhau, dễ nhận ra nhánh nào là bản sao.",
    `from leet_backtrack import check


def subsets_with_dup(nums):
    # lượt của bạn
    return []


check("subsets-ii", subsets_with_dup)
`,
    `from leet_backtrack import check


def subsets_with_dup(nums):
    nums = sorted(nums)
    out = [[]]
    start = 0
    for index, value in enumerate(nums):
        begin = start if index and value == nums[index - 1] else 0
        start = len(out)
        out += [out[position] + [value] for position in range(begin, start)]
    return out


check("subsets-ii", subsets_with_dup)
`),

  task("permutations", "permutations.py",
    "ĐỀ BÀI\nCho sẵn list `nums` các số khác nhau đôi một, có ít nhất một phần tử.\nPROCESS: viết hàm `permute(nums)` liệt kê mọi cách SẮP XẾP LẠI toàn bộ các phần tử.\nOUTPUT: trả về list các cách sắp xếp, mỗi cách là một list đủ mọi phần tử. Thứ tự các cách là tự do, nhưng thứ tự BÊN TRONG mỗi cách thì có nghĩa: `[1, 2]` và `[2, 1]` là hai đáp án khác nhau.\nVí dụ: `[1, 2, 3]` cho sáu cách: `[1, 2, 3]`, `[1, 3, 2]`, `[2, 1, 3]`, `[2, 3, 1]`, `[3, 1, 2]`, `[3, 2, 1]`.",
    `from leet_backtrack import check


def permute(nums):
    # lượt của bạn
    return []


check("permutations", permute)
`,
    `from leet_backtrack import check


def permute(nums):
    if not nums:
        return [[]]
    out = []
    for index, value in enumerate(nums):
        for rest in permute(nums[:index] + nums[index + 1:]):
            out.append([value] + rest)
    return out


check("permutations", permute)
`),

  { checkpoint: { text: "Hàm tự gọi lại chính nó cần một trường hợp dừng. Với bài liệt kê hoán vị, trường hợp dừng là list rỗng, và nó phải trả về `[[]]` — một danh sách chứa đúng một cách sắp xếp là cách rỗng — chứ không phải `[]`. Trả về `[]` thì vòng `for rest in ...` không chạy lần nào và cả hàm ra danh sách rỗng." } },

  { quiz: { title: "Trường hợp dừng của hàm tự gọi", questions: [
    { q: "Trong hàm liệt kê hoán vị, khi `nums` rỗng thì phải trả về gì?",
      a: ["`[[]]` — một danh sách chứa đúng một cách sắp xếp, là cách rỗng", "`[]` — không có cách nào", "`None`", "`[0]`"], correct: 0 },
    { q: "Nếu trường hợp dừng trả về `[]` thay vì `[[]]` thì hàm cho ra kết quả gì với `nums = [1, 2]`?",
      a: ["List rỗng, vì vòng lặp trên kết quả của lần gọi trong cùng không chạy lần nào", "Đúng hai hoán vị như thường", "Máy báo lỗi vượt độ sâu đệ quy", "Chỉ ra một hoán vị"], correct: 0 },
    { q: "`nums` có `4` phần tử khác nhau thì có bao nhiêu cách sắp xếp?",
      a: ["`24`", "`16`", "`12`", "`8`"], correct: 0 },
  ] } },

  task("permutations-ii", "permutations_ii.py",
    "ĐỀ BÀI\nCho sẵn list `nums` có ít nhất một phần tử, lần này CÓ THỂ có phần tử trùng nhau.\nPROCESS: viết hàm `permute_unique(nums)` liệt kê mọi cách sắp xếp lại KHÁC NHAU. Hai cách cho ra cùng một dãy giá trị thì chỉ tính một lần.\nOUTPUT: trả về list các cách sắp xếp, không được lặp.\nVí dụ: `[1, 1, 2]` chỉ cho ba cách: `[1, 1, 2]`, `[1, 2, 1]`, `[2, 1, 1]` — chứ không phải sáu.\nGợi ý: sắp xếp trước, rồi ở mỗi bước chọn, bỏ qua giá trị nào vừa được chọn ở đúng bước đó.",
    `from leet_backtrack import check


def permute_unique(nums):
    # lượt của bạn
    return []


check("permutations-ii", permute_unique)
`,
    `from leet_backtrack import check


def permute_unique(nums):
    nums = sorted(nums)
    out = []
    for index, value in enumerate(nums):
        if index and value == nums[index - 1]:
            continue
        for rest in permute_unique(nums[:index] + nums[index + 1:]):
            out.append([value] + rest)
    return out or [[]]


check("permutations-ii", permute_unique)
`),

  task("combination-sum", "combination_sum.py",
    "ĐỀ BÀI\nCho sẵn list `candidates` các số nguyên dương khác nhau đôi một, và một số `target`.\nPROCESS: viết hàm `combination_sum(candidates, target)` liệt kê mọi cách cộng ra đúng `target`. MỖI SỐ ĐƯỢC DÙNG LẠI BAO NHIÊU LẦN CŨNG ĐƯỢC.\nOUTPUT: trả về list các cách, mỗi cách là list các số đã dùng. Hai cách chỉ khác nhau ở thứ tự thì tính là một.\nVí dụ: `candidates = [2, 3, 6, 7]`, `target = 7` cho hai cách: `[2, 2, 3]` và `[7]`. Với `target` mà không cách nào cộng ra thì trả về list rỗng.",
    `from leet_backtrack import check


def combination_sum(candidates, target):
    # lượt của bạn
    return []


check("combination-sum", combination_sum)
`,
    `from leet_backtrack import check


def combination_sum(candidates, target):
    candidates = sorted(candidates)

    def walk(start, left):
        if left == 0:
            return [[]]
        out = []
        for index in range(start, len(candidates)):
            value = candidates[index]
            if value <= left:
                for rest in walk(index, left - value):
                    out.append([value] + rest)
        return out

    return walk(0, target)


check("combination-sum", combination_sum)
`),

  { checkpoint: { text: "Để hai cách chỉ khác thứ tự không bị đếm hai lần, mỗi bước chọn chỉ được lấy từ vị trí `start` trở đi. Bài cho dùng lại một số thì bước sau truyền `index` (đứng yên tại chỗ đó); bài mỗi số dùng một lần thì truyền `index + 1` (đi tiếp). Đúng một ký tự khác nhau giữa hai bài." } },

  { quiz: { title: "start, index hay index + 1", questions: [
    { q: "Trong bài cho phép dùng lại một số nhiều lần, lời gọi tiếp theo truyền vào vị trí bắt đầu nào?",
      a: ["`index` — đứng yên tại vị trí đó, để số đó còn được chọn lại", "`index + 1` — đi sang số tiếp theo", "`0` — quay lại từ đầu", "`start` — giữ nguyên vị trí bắt đầu cũ"], correct: 0 },
    { q: "Nếu lời gọi tiếp theo truyền `0` thay vì `index` thì chuyện gì xảy ra với `candidates = [2, 3]`, `target = 5`?",
      a: ["Cả `[2, 3]` lẫn `[3, 2]` đều được sinh ra, nên kết quả có hai cách trùng nội dung", "Kết quả vẫn đúng, chỉ chậm hơn", "Hàm không tìm ra cách nào", "Máy báo lỗi vượt độ sâu đệ quy"], correct: 0 },
  ] } },

  task("combination-sum-ii", "combination_sum_ii.py",
    "ĐỀ BÀI\nCho sẵn list `candidates` các số nguyên dương, CÓ THỂ trùng nhau, và một số `target`.\nPROCESS: viết hàm `combination_sum2(candidates, target)` liệt kê mọi cách cộng ra đúng `target`, nhưng MỖI PHẦN TỬ TRONG LIST CHỈ ĐƯỢC DÙNG MỘT LẦN. Hai phần tử trùng giá trị ở hai vị trí khác nhau vẫn là hai phần tử, dùng được cả hai.\nOUTPUT: trả về list các cách, không được có cách nào lặp lại.\nVí dụ: `candidates = [10, 1, 2, 7, 6, 1, 5]`, `target = 8` cho bốn cách: `[1, 1, 6]`, `[1, 2, 5]`, `[1, 7]`, `[2, 6]`.",
    `from leet_backtrack import check


def combination_sum2(candidates, target):
    # lượt của bạn
    return []


check("combination-sum-ii", combination_sum2)
`,
    `from leet_backtrack import check


def combination_sum2(candidates, target):
    candidates = sorted(candidates)
    out = []

    def walk(start, left, picked):
        if left == 0:
            out.append(list(picked))
            return
        for index in range(start, len(candidates)):
            if index > start and candidates[index] == candidates[index - 1]:
                continue
            if candidates[index] > left:
                break
            walk(index + 1, left - candidates[index], picked + [candidates[index]])

    walk(0, target, [])
    return out


check("combination-sum-ii", combination_sum2)
`),

  task("combination-sum-iii", "combination_sum_iii.py",
    "ĐỀ BÀI\nCho sẵn hai số nguyên dương `k` và `n`.\nPROCESS: viết hàm `combination_sum3(k, n)` liệt kê mọi cách chọn ĐÚNG `k` số KHÁC NHAU trong khoảng từ `1` tới `9` sao cho tổng của chúng bằng `n`.\nOUTPUT: trả về list các cách, mỗi cách là list `k` số. Hai cách chỉ khác thứ tự tính là một.\nVí dụ: `k = 3`, `n = 7` cho đúng một cách là `[1, 2, 4]`. `k = 3`, `n = 9` cho ba cách: `[1, 2, 6]`, `[1, 3, 5]`, `[2, 3, 4]`. `k = 4`, `n = 1` không có cách nào nên trả về list rỗng.",
    `from leet_backtrack import check


def combination_sum3(k, n):
    # lượt của bạn
    return []


check("combination-sum-iii", combination_sum3)
`,
    `from leet_backtrack import check


def combination_sum3(k, n):
    out = []

    def walk(start, left, picked):
        if len(picked) == k:
            if left == 0:
                out.append(list(picked))
            return
        for value in range(start, 10):
            if value > left:
                break
            walk(value + 1, left - value, picked + [value])

    walk(1, n, [])
    return out


check("combination-sum-iii", combination_sum3)
`),

  task("n-queens", "n_queens.py",
    "ĐỀ BÀI\nCho sẵn một số nguyên dương `n`.\nPROCESS: viết hàm `solve_n_queens(n)` tìm mọi cách đặt `n` quân hậu lên bàn cờ `n` hàng `n` cột sao cho không hai quân nào ăn được nhau. Hai quân ăn được nhau khi chúng cùng hàng, cùng cột, hoặc cùng một đường chéo.\nOUTPUT: trả về list các cách đặt. MỖI CÁCH là một list `n` chuỗi, mỗi chuỗi dài `n` ký tự mô tả một hàng: `\"Q\"` ở ô có hậu và `\".\"` ở ô trống. Thứ tự các cách tự do, nhưng thứ tự các hàng trong một cách thì phải từ trên xuống.\nVí dụ: `n = 1` cho một cách là `[\"Q\"]`. `n = 2` và `n = 3` không có cách nào, trả về list rỗng. `n = 4` có đúng hai cách, một trong đó là `[\".Q..\", \"...Q\", \"Q...\", \"..Q.\"]`.\nGợi ý: mỗi hàng đặt đúng một quân, nên chỉ cần đi lần lượt từng hàng và thử từng cột.",
    `from leet_backtrack import check


def solve_n_queens(n):
    # lượt của bạn
    return []


check("n-queens", solve_n_queens)
`,
    `from leet_backtrack import check


def solve_n_queens(n):
    out = []

    def board(columns):
        return ["." * col + "Q" + "." * (n - col - 1) for col in columns]

    def walk(columns):
        row = len(columns)
        if row == n:
            out.append(board(columns))
            return
        for col in range(n):
            if all(other != col and abs(other - col) != row - index
                   for index, other in enumerate(columns)):
                walk(columns + [col])

    walk([])
    return out


check("n-queens", solve_n_queens)
`),

  { npc: "Bài hậu gọn được vì mỗi hàng chắc chắn có đúng một quân, nên chỉ cần nhớ CỘT của từng hàng. Hai quân cùng đường chéo khi hiệu cột bằng hiệu hàng." },

  task("word-search-ii", "word_search_ii.py",
    "ĐỀ BÀI\nCho sẵn `board` là lưới các chữ cái (mỗi ô là một chuỗi một ký tự) và `words` là list các chuỗi.\nPROCESS: viết hàm `find_words(board, words)` chọn ra những từ trong `words` đánh vần được bằng một đường đi trong lưới. Mỗi bước chỉ sang ô kề cạnh theo bốn hướng trên, dưới, trái, phải — không đi chéo — và một ô không được dùng lại trong cùng một đường.\nOUTPUT: trả về list các từ tìm được. Thứ tự tự do, mỗi từ chỉ được xuất hiện một lần, và không được trả về từ nào ngoài `words`.\nVí dụ: với `board = [[\"A\", \"B\"], [\"B\", \"A\"]]` và `words = [\"AB\", \"ABA\", \"BB\"]` thì `\"AB\"` và `\"ABA\"` đánh vần được, còn `\"BB\"` thì không vì hai ô chữ `B` không kề cạnh nhau.",
    `from leet_backtrack import check


def find_words(board, words):
    # lượt của bạn
    return []


check("word-search-ii", find_words)
`,
    `from leet_backtrack import check


def find_words(board, words):
    rows, cols = len(board), len(board[0])

    def walk(row, col, word, index, used):
        if not (0 <= row < rows and 0 <= col < cols):
            return False
        if (row, col) in used or board[row][col] != word[index]:
            return False
        if index + 1 == len(word):
            return True
        used.add((row, col))
        for step_row, step_col in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            if walk(row + step_row, col + step_col, word, index + 1, used):
                used.discard((row, col))
                return True
        used.discard((row, col))
        return False

    def found(word):
        for row in range(rows):
            for col in range(cols):
                if walk(row, col, word, 0, set()):
                    return True
        return False

    return [word for word in words if found(word)]


check("word-search-ii", find_words)
`),

  { remember: "Chín bài này đều là một khung ba phần: chọn, đi tiếp, dọn lại. Hai chi tiết quyết định đúng sai. Thứ nhất, vị trí bắt đầu của lời gọi sau — `index` cho phép dùng lại, `index + 1` thì không — quyết định kết quả có bị đếm trùng do đổi thứ tự hay không. Thứ hai, khi dữ liệu vào có phần tử trùng nhau, hãy sắp xếp trước rồi ở mỗi bước bỏ qua giá trị vừa được thử ở đúng bước đó; đó là cách chặn bản sao mà không phải gom kết quả rồi lọc lại." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · QUAY LUI",
  sideIslandId: "leet-backtrack",
  completionKey: "magicdust.leet.set.backtrack",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Rừng Rẽ Nhánh",
  subtitle: "chín bài liệt kê mọi đáp án bằng cách đi thử rồi lùi lại",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ RẼ NHÁNH" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "sắp lại mọi lời giải trước khi so, và bắt cả lỗi trùng" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_backtrack: "../py/leet_backtrack/__init__.py",
  },
  cells,
  finish: { title: "RỪNG ĐÃ THÔNG", sub: "chín bài, mọi nhánh đều được đi và mọi bản sao đều bị chặn", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
