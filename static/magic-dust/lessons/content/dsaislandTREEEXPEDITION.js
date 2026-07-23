import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": []
}

stack = ["root"]

while stack:
    node = stack.pop()
    print(node)
    for child in reversed(children[node]):
        stack.append(child)
`, label: "tree_dfs_order.py", note: "RUN KIỂM CHỨNG\nCho sẵn cây bằng dict `children`; không có INPUT. PROCESS: dùng stack để DFS, đi hết nhánh `hall` trước nhánh `garden`. OUTPUT là `root`, `hall`, `desk`, `garden`.", expectOut: { all: [{ minLines: 4 }, /^root$/, /^hall$/, /^desk$/, /^garden$/] }, solution: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": []
}

stack = ["root"]

while stack:
    node = stack.pop()
    print(node)
    for child in reversed(children[node]):
        stack.append(child)
` },
  { code: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk", "lamp"],
    "garden": [],
    "desk": [],
    "lamp": []
}

leaf_count = 0
for node in children:
    if node == "":
        leaf_count = leaf_count + 1

print(leaf_count)
`, label: "tree_leaf_repair.py", note: "ĐỀ BÀI\nCho sẵn cây có ba nút lá; không có INPUT. Điều kiện hiện kiểm tra tên nút thay vì list con. Sửa điều kiện để nút có list con rỗng được tính là lá. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk", "lamp"],
    "garden": [],
    "desk": [],
    "lamp": []
}

leaf_count = 0
for node in children:
    if len(children[node]) == 0:
        leaf_count = leaf_count + 1

print(leaf_count)
` },
  { code: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": ["drawer"],
    "drawer": []
}

stack = [("root", 0, "root")]
max_depth = 0
deepest_path = "root"

# Tìm độ sâu lớn nhất và đường từ root tới nút đó.
`, label: "tree_depth_path.py", note: "ĐỀ BÀI\nCho sẵn cây và stack chứa `(node, depth, path)`; không có INPUT. PROCESS: DFS để tìm độ sâu lớn nhất và đường tương ứng. OUTPUT đúng là `3 root->hall->desk->drawer`.", expectOut: /^3 root->hall->desk->drawer$/, solution: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": ["drawer"],
    "drawer": []
}

stack = [("root", 0, "root")]
max_depth = 0
deepest_path = "root"

while stack:
    node, depth, path = stack.pop()
    if depth > max_depth:
        max_depth = depth
        deepest_path = path
    for child in children[node]:
        stack.append((child, depth + 1, path + "->" + child))

print(max_depth, deepest_path)
` },
  { code: `children = {
    "root": ["cave", "tower"],
    "cave": ["well"],
    "tower": ["vault"],
    "well": [],
    "vault": []
}
target = "vault"
stack = ["root"]
found = False

# Dùng DFS để kiểm tra target có trong cây hay không.
`, label: "tree_find_target.py", note: "XƯỞNG THÁM HIỂM\nCho sẵn cây và `target = \"vault\"`; không có INPUT. PROCESS: dùng DFS với stack để kiểm tra target có thể được thăm từ `root`. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `children = {
    "root": ["cave", "tower"],
    "cave": ["well"],
    "tower": ["vault"],
    "well": [],
    "vault": []
}
target = "vault"
stack = ["root"]
found = False

while stack:
    node = stack.pop()
    if node == target:
        found = True
        break
    for child in children[node]:
        stack.append(child)

print(found)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ RỪNG CÂY PHÂN NHÁNH ✦",
  introHook: "Mỗi ngã rẽ dẫn tới các nhánh con. Bạn sẽ đọc cây từ dict, nhận ra lá và dùng DFS để đi sâu mà vẫn giữ được đường đã qua.",
  reviewTitle: "Ôn cây và DFS",
  reviewQuestions: [
    { q: "Cho `children = {'root': ['a', 'b'], 'a': [], 'b': ['c'], 'c': []}`. Những nút nào là lá?", a: ["`a` và `c`", "`root` và `b`", "Chỉ `b`"], correct: 0 },
    { q: "DFS dùng stack với `A` ở đỉnh. Khi pop `A`, thao tác nào giúp thuật toán tiếp tục đi qua các nhánh?", a: ["Thêm các nút kề của `A` vào stack", "Xóa toàn bộ stack", "Sắp xếp tên mọi nút rồi dừng"], correct: 0 },
  ],
  definition: "Trong dict `children`, mỗi khóa là một nút và list đi kèm chứa các nút con trực tiếp. List con rỗng đánh dấu nút lá. DFS dùng stack để đi sâu qua một nhánh trước.",
  tasks,
  checkpoint: "Với cây biểu diễn bằng `children`, `children[node]` cho các nút con trực tiếp và list rỗng đánh dấu một lá. DFS bằng stack có thể giữ thêm độ sâu hoặc đường đi trong cùng phần tử stack.",
  quizTitle: "Đọc nhánh và độ sâu",
  quizQuestions: [
    { q: "Cho `children = {'root': ['a'], 'a': ['b'], 'b': []}`. Nếu stack giữ `('a', 1)`, cặp nào phải được thêm khi mở rộng nút `a`?", a: ["`('b', 2)`", "`('b', 1)`", "`('root', 2)`"], correct: 0 },
    { q: "Một DFS tìm đường đang giữ `(node, path)`. Từ `hall` đi sang nút con `desk`, đường mới nên dựa trên dữ liệu nào?", a: ["Đường tới `hall` rồi nối thêm `desk`", "Chỉ chuỗi `desk` và bỏ đường cũ", "Tên của một nút lá bất kỳ"], correct: 0 },
  ],
  remember: "Trước khi duyệt cây, hãy nói rõ stack cần giữ gì ngoài tên nút. Nếu bài hỏi độ sâu hoặc đường đi, lưu thông tin đó cùng nút ngay khi thêm nút con vào stack.",
});

export default dsaIsland("tree-expedition", { subtitle: "luyện biểu diễn cây, đếm lá, giữ độ sâu và tìm đường bằng DFS", machineName: "DÂY THÁM HIỂM CÂY", machineBlurb: "giữ nút, độ sâu và đường đi khi tiến qua từng nhánh", cells });
