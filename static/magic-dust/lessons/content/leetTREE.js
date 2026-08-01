// Đảo luyện tập LeetCode — cây nhị phân và lan trên lưới. Chấm bằng py/leet_judge.
//
// Cây ở đây là list lồng nhau `[giá_trị, trái, phải]`, cây rỗng là None — không
// dùng class như trên LeetCode, để cây so sánh được bằng `==`. Xem py/leet_tree.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ RỪNG CÓ GỐC ✦",
    hook: "Sáu bài cuối cùng của đấu trường. Ba bài dựng cây từ những dấu vết mà cây để lại khi bị đọc, ba bài còn lại lan từ một ô ra cả một vùng. Cả sáu đều gọn lạ thường khi bạn để hàm tự gọi lại chính nó — cây con cũng là một cái cây, vùng còn lại cũng là một cái lưới.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Ở đảo này một nút cây là list `[giá_trị, cây_con_trái, cây_con_phải]`, và cây rỗng là `None`. Ví dụ cây một nút mang số `5` viết là `[5, None, None]`." },

  { quiz: { title: "Đọc cây viết bằng list lồng nhau", questions: [
    { q: "Cây `[3, [9, None, None], [20, None, None]]` có bao nhiêu nút?",
      a: ["`3`", "`2`", "`1`", "`5`"], correct: 0 },
    { q: "Đọc cây `[1, None, [2, None, None]]` theo THỨ TỰ GIỮA — tức đọc hết cây con trái, rồi tới gốc, rồi tới cây con phải — cho ra dãy nào?",
      a: ["`1, 2`", "`2, 1`", "`1`", "`2`"], correct: 0 },
  ] } },

  task("number-of-islands", "number_of_islands.py",
    "ĐỀ BÀI\nCho sẵn `grid` là lưới, mỗi ô là chuỗi `\"1\"` (đất) hoặc `\"0\"` (nước).\nPROCESS: viết hàm `num_islands(grid)` đếm số ĐẢO. Một đảo là một cụm các ô đất nối với nhau qua cạnh chung theo bốn hướng trên, dưới, trái, phải — nối chéo KHÔNG tính.\nOUTPUT: trả về số đảo.\nVí dụ: `[[\"1\", \"1\", \"0\"], [\"1\", \"0\", \"0\"], [\"0\", \"0\", \"1\"]]` cho `2`. Lưới toàn `\"0\"` cho `0`.\nGợi ý: duyệt từng ô; gặp ô đất chưa thăm thì tăng bộ đếm rồi LAN ra đánh dấu cả cụm chứa nó, để cụm đó không bị đếm lại.",
    `from leet_tree import check


def num_islands(grid):
    # lượt của bạn
    return 0


check("number-of-islands", num_islands)
`,
    `from leet_tree import check


def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    seen = set()
    found = 0
    for row in range(rows):
        for col in range(cols):
            if grid[row][col] != "1" or (row, col) in seen:
                continue
            found += 1
            todo = [(row, col)]
            seen.add((row, col))
            while todo:
                r, c = todo.pop()
                for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1" \\
                            and (nr, nc) not in seen:
                        seen.add((nr, nc))
                        todo.append((nr, nc))
    return found


check("number-of-islands", num_islands)
`),

  { checkpoint: { text: "Đánh dấu ĐÃ THĂM ngay lúc đưa một ô vào danh sách chờ, không phải lúc lấy nó ra. Nếu đánh dấu lúc lấy ra, một ô có thể được hai hàng xóm cùng đưa vào và bị xử lý hai lần — với lưới lớn thì danh sách chờ phình lên rất nhanh." } },

  { quiz: { title: "Đánh dấu lúc nào", questions: [
    { q: "Với lưới `[[\"1\", \"1\"], [\"1\", \"1\"]]`, nếu chỉ đánh dấu đã thăm lúc LẤY RA khỏi danh sách chờ thì chuyện gì xảy ra?",
      a: ["Một ô bị đưa vào danh sách chờ nhiều lần vì nhiều hàng xóm cùng thấy nó chưa được đánh dấu", "Số đảo đếm ra sẽ là `4`", "Hàm báo lỗi vượt ngoài lưới", "Không có gì khác, chỉ tốn thêm bộ nhớ không đáng kể"], correct: 0 },
    { q: "Vì sao gặp ô đất ĐÃ được đánh dấu thì không tăng bộ đếm đảo?",
      a: ["Vì nó đã thuộc một cụm được đếm trước đó rồi", "Vì ô đó thật ra là nước", "Vì bộ đếm chỉ tăng ở hàng đầu tiên", "Vì như vậy sẽ đếm thiếu"], correct: 0 },
  ] } },

  task("surrounded-regions", "surrounded_regions.py",
    "ĐỀ BÀI\nCho sẵn `board` là lưới, mỗi ô là chuỗi `\"X\"` hoặc `\"O\"`.\nPROCESS: viết hàm `solve(board)` lấp mọi vùng `\"O\"` bị VÂY KÍN thành `\"X\"`. Một vùng `\"O\"` là các ô `\"O\"` nối nhau qua cạnh chung; vùng bị vây kín khi KHÔNG có ô nào của nó chạm mép lưới. Sửa thẳng trên `board`.\nOUTPUT: hàm không cần trả về gì; máy chấm đọc `board` sau khi hàm chạy xong.\nVí dụ: `[[\"X\", \"X\", \"X\"], [\"X\", \"O\", \"X\"], [\"X\", \"X\", \"X\"]]` thành lưới toàn `\"X\"`. Còn `[[\"O\", \"O\"], [\"O\", \"O\"]]` giữ nguyên vì mọi ô đều chạm mép.\nGợi ý: đi ngược lại thì dễ hơn — thay vì tìm vùng bị vây, hãy lan từ các ô `\"O\"` NẰM Ở MÉP vào trong để đánh dấu những ô AN TOÀN; mọi ô `\"O\"` còn lại chính là ô cần lấp.",
    `from leet_tree import check


def solve(board):
    # lượt của bạn
    pass


check("surrounded-regions", solve)
`,
    `from leet_tree import check


def solve(board):
    rows, cols = len(board), len(board[0])
    todo = []
    for row in range(rows):
        for col in range(cols):
            on_edge = row == 0 or row == rows - 1 or col == 0 or col == cols - 1
            if board[row][col] == "O" and on_edge:
                todo.append((row, col))
    safe = set(todo)
    while todo:
        row, col = todo.pop()
        for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            r, c = row + dr, col + dc
            if 0 <= r < rows and 0 <= c < cols and board[r][c] == "O" \\
                    and (r, c) not in safe:
                safe.add((r, c))
                todo.append((r, c))
    for row in range(rows):
        for col in range(cols):
            if board[row][col] == "O" and (row, col) not in safe:
                board[row][col] = "X"


check("surrounded-regions", solve)
`),

  { npc: "Đổi chiều câu hỏi là mẹo đáng nhớ nhất của bài vừa rồi. Tìm trực tiếp vùng bị vây thì phải chứng minh nó không chạm mép ở bất cứ đâu; lan từ mép vào thì chỉ cần đi tới." },

  task("missing-ranges", "missing_ranges.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần với các phần tử khác nhau đôi một, cùng hai số `lower` và `upper`. Mọi phần tử của `nums` đều nằm trong đoạn từ `lower` tới `upper`.\nPROCESS: viết hàm `find_missing_ranges(nums, lower, upper)` tìm mọi số nguyên trong đoạn `[lower, upper]` mà KHÔNG có trong `nums`, rồi gom các số vắng liên tiếp thành từng khoảng.\nOUTPUT: trả về list các khoảng `[start, end]` theo thứ tự tăng dần. Khoảng chỉ có một số vẫn viết là `[x, x]`. Nếu không thiếu số nào thì trả về list rỗng.\nVí dụ: `nums = [0, 1, 3, 50, 75]`, `lower = 0`, `upper = 99` cho `[[2, 2], [4, 49], [51, 74], [76, 99]]`. `nums = []` với `lower = 1`, `upper = 1` cho `[[1, 1]]`.",
    `from leet_tree import check


def find_missing_ranges(nums, lower, upper):
    # lượt của bạn
    return []


check("missing-ranges", find_missing_ranges)
`,
    `from leet_tree import check


def find_missing_ranges(nums, lower, upper):
    out = []
    edge = lower
    for value in list(nums) + [upper + 1]:
        if value > edge:
            out.append([edge, value - 1])
        edge = value + 1
    return out


check("missing-ranges", find_missing_ranges)
`),

  task("sorted-array-to-bst", "sorted_array_to_bst.py",
    "ĐỀ BÀI\nCho sẵn list `nums` đã sắp xếp tăng dần, các phần tử khác nhau đôi một.\nPROCESS: viết hàm `sorted_array_to_bst(nums)` dựng một cây nhị phân tìm kiếm CÂN BẰNG chứa đúng các số đó. Cây nhị phân tìm kiếm nghĩa là đọc theo thứ tự giữa sẽ ra đúng `nums`; cân bằng nghĩa là tại MỌI nút, chiều cao hai cây con lệch nhau không quá một tầng.\nOUTPUT: trả về cây dưới dạng list lồng nhau `[giá_trị, trái, phải]`, cây rỗng là `None`. Bài này có nhiều cây đúng, máy chấm kiểm theo hai luật trên chứ không so với một cây cụ thể.\nVí dụ: `[1, 2, 3]` có thể cho `[2, [1, None, None], [3, None, None]]`. `[]` cho `None`.\nGợi ý: lấy phần tử GIỮA làm gốc thì hai nửa còn lại chênh nhau nhiều nhất một phần tử.",
    `from leet_tree import check


def sorted_array_to_bst(nums):
    # lượt của bạn
    return None


check("sorted-array-to-bst", sorted_array_to_bst)
`,
    `from leet_tree import check


def sorted_array_to_bst(nums):
    if not nums:
        return None
    middle = len(nums) // 2
    return [nums[middle],
            sorted_array_to_bst(nums[:middle]),
            sorted_array_to_bst(nums[middle + 1:])]


check("sorted-array-to-bst", sorted_array_to_bst)
`),

  { checkpoint: { text: "Hàm dựng cây tự gọi lại chính nó trên hai nửa mảng, và trường hợp dừng là mảng rỗng trả về `None`. Chọn phần tử GIỮA làm gốc là thứ giữ cho cây cân bằng: hai nửa chênh nhau nhiều nhất một phần tử, nên chiều cao hai cây con chênh nhau nhiều nhất một tầng." } },

  { quiz: { title: "Vì sao lấy phần tử giữa", questions: [
    { q: "Với `nums = [1, 2, 3, 4, 5, 6, 7]`, lấy phần tử ĐẦU làm gốc rồi lặp lại cho phần còn lại thì cây có hình gì?",
      a: ["Một chuỗi dài lệch hẳn sang phải, cao `7` tầng", "Một cây cân bằng cao `3` tầng", "Một cây chỉ có gốc", "Một chuỗi lệch sang trái"], correct: 0 },
    { q: "Cây chuỗi dài đó có phải cây nhị phân tìm kiếm không, và nó hỏng ở luật nào?",
      a: ["Vẫn là cây tìm kiếm vì thứ tự giữa vẫn đúng, nhưng hỏng luật CÂN BẰNG", "Không phải cây tìm kiếm vì thứ tự giữa sai", "Đúng cả hai luật", "Hỏng cả hai luật"], correct: 0 },
    { q: "Với `nums` có `7` phần tử, cây dựng bằng cách lấy phần tử giữa cao mấy tầng?",
      a: ["`3`", "`7`", "`4`", "`2`"], correct: 0 },
  ] } },

  task("build-tree-pre-in", "build_tree_pre_in.py",
    "ĐỀ BÀI\nCho sẵn hai list `preorder` và `inorder`, là kết quả đọc CÙNG MỘT cây nhị phân theo hai kiểu. Thứ tự TRƯỚC đọc gốc rồi cây con trái rồi cây con phải; thứ tự GIỮA đọc cây con trái rồi gốc rồi cây con phải. Các giá trị trong cây khác nhau đôi một.\nPROCESS: viết hàm `build_tree(preorder, inorder)` dựng lại chính cây đó.\nOUTPUT: trả về cây dưới dạng list lồng nhau `[giá_trị, trái, phải]`, cây rỗng là `None`.\nVí dụ: `preorder = [3, 9, 20, 15, 7]` và `inorder = [9, 3, 15, 20, 7]` cho `[3, [9, None, None], [20, [15, None, None], [7, None, None]]]`.\nGợi ý: phần tử ĐẦU của thứ tự trước chính là gốc. Tìm gốc đó trong thứ tự giữa thì mọi thứ bên trái nó thuộc cây con trái, mọi thứ bên phải thuộc cây con phải — và số phần tử đó cũng cho biết cắt thứ tự trước ở đâu.",
    `from leet_tree import check


def build_tree(preorder, inorder):
    # lượt của bạn
    return None


check("build-tree-pre-in", build_tree)
`,
    `from leet_tree import check


def build_tree(preorder, inorder):
    if not preorder:
        return None
    cut = inorder.index(preorder[0])
    return [preorder[0],
            build_tree(preorder[1:cut + 1], inorder[:cut]),
            build_tree(preorder[cut + 1:], inorder[cut + 1:])]


check("build-tree-pre-in", build_tree)
`),

  task("build-tree-in-post", "build_tree_in_post.py",
    "ĐỀ BÀI\nCho sẵn hai list `inorder` và `postorder`, là kết quả đọc CÙNG MỘT cây nhị phân theo hai kiểu. Thứ tự GIỮA đọc cây con trái rồi gốc rồi cây con phải; thứ tự SAU đọc cây con trái rồi cây con phải rồi mới tới gốc. Các giá trị trong cây khác nhau đôi một.\nPROCESS: viết hàm `build_tree(inorder, postorder)` dựng lại chính cây đó.\nOUTPUT: trả về cây dưới dạng list lồng nhau `[giá_trị, trái, phải]`, cây rỗng là `None`.\nVí dụ: `inorder = [9, 3, 15, 20, 7]` và `postorder = [9, 15, 7, 20, 3]` cho `[3, [9, None, None], [20, [15, None, None], [7, None, None]]]`.\nGợi ý: lần này gốc nằm ở CUỐI thứ tự sau. Phần còn lại làm y như bài trước, chỉ khác chỗ cắt.",
    `from leet_tree import check


def build_tree(inorder, postorder):
    # lượt của bạn
    return None


check("build-tree-in-post", build_tree)
`,
    `from leet_tree import check


def build_tree(inorder, postorder):
    if not inorder:
        return None
    cut = inorder.index(postorder[-1])
    return [postorder[-1],
            build_tree(inorder[:cut], postorder[:cut]),
            build_tree(inorder[cut + 1:], postorder[cut:-1])]


check("build-tree-in-post", build_tree)
`),

  { remember: "Hai bài dựng cây cho thấy một chuyện: thứ tự giữa nói cây con trái và cây con phải gồm những nút NÀO, còn thứ tự trước hay thứ tự sau nói nút nào là GỐC. Thiếu một trong hai thì không dựng lại được. Và cả sáu bài đảo này đều gọn nhờ cùng một cách nghĩ — cây con cũng là một cái cây, vùng chưa thăm cũng là một cái lưới — nên hàm chỉ cần biết làm một bước rồi giao phần còn lại cho chính nó." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · CÂY VÀ LƯỚI",
  sideIslandId: "leet-tree",
  completionKey: "magicdust.leet.set.tree",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Rừng Có Gốc",
  subtitle: "sáu bài dựng cây và lan trên lưới",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ CÓ GỐC" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "bài nhiều cây đúng thì chấm theo luật, không so với một cây" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_tree: "../py/leet_tree/__init__.py",
  },
  cells,
  finish: { title: "RỪNG ĐÃ CÓ GỐC", sub: "sáu bài, và cả đấu trường LeetCode đã sạch", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
