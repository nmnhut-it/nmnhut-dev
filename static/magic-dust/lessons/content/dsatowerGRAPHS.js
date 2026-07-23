import { dsaTower } from "./dsa-builders.js";
import { makeTowerCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `children = {
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
`, label: "graphs_floor_01_leaves.py", note: "TẦNG 1\nCho sẵn cây bằng dict `children`; không có INPUT. PROCESS: nhận một nút là lá khi list con của nó rỗng và đếm mọi nút lá. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `children = {
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

stack = [("root", 0)]
max_depth = 0

# Dùng DFS để tìm độ sâu lớn nhất.
`, label: "graphs_floor_02_depth.py", note: "TẦNG 2\nCho sẵn cây và stack chứa `(node, depth)`; không có INPUT. PROCESS: DFS qua mọi nút và giữ độ sâu lớn nhất tính từ `root` có độ sâu 0. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": ["drawer"],
    "drawer": []
}

stack = [("root", 0)]
max_depth = 0

while stack:
    node, depth = stack.pop()
    if depth > max_depth:
        max_depth = depth
    for child in children[node]:
        stack.append((child, depth + 1))

print(max_depth)
` },
  { code: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": [],
    "D": []
}
stack = ["A"]
visited = set()

while stack:
    node = stack.pop()
    if node not in visited:
        visited.add(node)
        print(node)
        for neighbor in graph[node]:
            stack.append(neighbor)
`, label: "graphs_floor_03_dfs_order_fix.py", note: "TẦNG 3\nCho sẵn đồ thị; không có INPUT. DFS hiện thêm `B` rồi `C`, nên stack lấy `C` trước. Sửa cách thêm các nút kề để đi nhánh `B` trước. OUTPUT đúng là `A`, `B`, `D`, `C`.", expectOut: { all: [{ minLines: 4 }, /^A$/, /^B$/, /^D$/, /^C$/] }, solution: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": [],
    "D": []
}
stack = ["A"]
visited = set()

while stack:
    node = stack.pop()
    if node not in visited:
        visited.add(node)
        print(node)
        for neighbor in reversed(graph[node]):
            stack.append(neighbor)
` },
  { code: `graph = {
    "gate": ["well", "tower"],
    "well": ["gate"],
    "tower": ["gate", "vault"],
    "vault": ["tower"]
}
start = "gate"
target = "vault"
stack = [start]
visited = set()
found = False

# Dùng DFS để kiểm tra target có tới được từ start hay không.
`, label: "graphs_floor_04_dfs_reach.py", note: "TẦNG 4\nCho sẵn đồ thị có các cạnh hai chiều, điểm đầu và đích; không có INPUT. PROCESS: dùng DFS cùng `visited` để kiểm tra khả năng đi tới đích. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `graph = {
    "gate": ["well", "tower"],
    "well": ["gate"],
    "tower": ["gate", "vault"],
    "vault": ["tower"]
}
start = "gate"
target = "vault"
stack = [start]
visited = set()
found = False

while stack:
    node = stack.pop()
    if node not in visited:
        visited.add(node)
        if node == target:
            found = True
            break
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)

print(found)
` },
  { code: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["E"],
    "D": [],
    "E": []
}
queue = ["A"]
head = 0
visited = {"A"}

while head < len(queue):
    node = queue[head]
    head = head + 1
    print(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)
`, label: "graphs_floor_05_bfs_order.py", note: "TẦNG 5\nCho sẵn đồ thị; không có INPUT. PROCESS: BFS bằng queue, đánh dấu nút ở lần thêm vào queue đầu tiên và in theo từng lớp. OUTPUT là `A`, `B`, `C`, `D`, `E`.", expectOut: { all: [{ minLines: 5 }, /^A$/, /^B$/, /^C$/, /^D$/, /^E$/] }, solution: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["E"],
    "D": [],
    "E": []
}
queue = ["A"]
head = 0
visited = {"A"}

while head < len(queue):
    node = queue[head]
    head = head + 1
    print(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)
` },
  { code: `graph = {
    "camp": ["bridge", "hill"],
    "bridge": ["camp", "village"],
    "hill": ["camp", "cave"],
    "village": ["bridge", "tower"],
    "cave": ["hill"],
    "tower": ["village"]
}
start = "camp"
target = "tower"
queue = [start]
head = 0
distance = {start: 0}

# Dùng BFS để tìm số cạnh ít nhất tới target.
`, label: "graphs_floor_06_shortest.py", note: "TẦNG 6\nCho sẵn bản đồ, điểm đầu và đích; không có INPUT. PROCESS: BFS ghi khoảng cách ở lần phát hiện đầu tiên. OUTPUT là số cạnh ít nhất từ `camp` tới `tower`: `3`.", expectOut: /^3$/, solution: `graph = {
    "camp": ["bridge", "hill"],
    "bridge": ["camp", "village"],
    "hill": ["camp", "cave"],
    "village": ["bridge", "tower"],
    "cave": ["hill"],
    "tower": ["village"]
}
start = "camp"
target = "tower"
queue = [start]
head = 0
distance = {start: 0}

while head < len(queue):
    node = queue[head]
    head = head + 1
    for neighbor in graph[node]:
        if neighbor not in distance:
            distance[neighbor] = distance[node] + 1
            queue.append(neighbor)

print(distance[target])
` },
  { code: `parent = {
    "gate": None,
    "bridge": "gate",
    "village": "bridge",
    "tower": "village"
}
target = "tower"
path = []
current = target

while current is not None:
    path.append(current)
    current = parent[current]

print(" -> ".join(path))
`, label: "graphs_floor_07_path_fix.py", note: "TẦNG 7\nCho sẵn bảng `parent` của một BFS; không có INPUT. Đường hiện được in từ đích về điểm đầu. PROCESS: sửa phần dựng đường để đi đúng chiều. OUTPUT là `gate -> bridge -> village -> tower`.", expectOut: /^gate -> bridge -> village -> tower$/, solution: `parent = {
    "gate": None,
    "bridge": "gate",
    "village": "bridge",
    "tower": "village"
}
target = "tower"
path = []
current = target

while current is not None:
    path.append(current)
    current = parent[current]

path.reverse()
print(" -> ".join(path))
` },
  { code: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": []
}
start = "A"
target = "C"

# Dùng BFS với parent; báo khi target không thể tới được.
`, label: "graphs_floor_08_unreachable.py", note: "TẦNG 8\nCho sẵn đồ thị có `C` tách riêng, điểm đầu và đích; không có INPUT. PROCESS: chạy BFS với `parent` và chỉ dựng đường khi đích được phát hiện. OUTPUT đúng là `Không có đường`.", expectOut: /^Không có đường$/, solution: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": []
}
start = "A"
target = "C"
queue = [start]
head = 0
parent = {start: None}

while head < len(queue):
    node = queue[head]
    head = head + 1
    for neighbor in graph[node]:
        if neighbor not in parent:
            parent[neighbor] = node
            queue.append(neighbor)

if target not in parent:
    print("Không có đường")
else:
    path = []
    current = target
    while current is not None:
        path.append(current)
        current = parent[current]
    path.reverse()
    print(" -> ".join(path))
` },
  { code: `graph = {
    "gate": ["tower"],
    "tower": ["gate"]
}
start = "gate"
target = "gate"
parent = {start: None}

# Dựng đường khi điểm đầu cũng chính là đích.
`, label: "graphs_floor_09_same_point.py", note: "TẦNG 9\nCho sẵn bản đồ với `start == target`; không có INPUT. PROCESS: dùng bảng `parent` đã chứa điểm đầu để dựng đường. Đường có một địa điểm nên OUTPUT đúng là `gate`.", expectOut: /^gate$/, solution: `graph = {
    "gate": ["tower"],
    "tower": ["gate"]
}
start = "gate"
target = "gate"
parent = {start: None}

path = []
current = target
while current is not None:
    path.append(current)
    current = parent[current]
path.reverse()
print(" -> ".join(path))
` },
  { code: `graph = {
    "harbor": ["forest", "bridge"],
    "forest": ["harbor", "tower"],
    "bridge": ["harbor", "tower"],
    "tower": ["forest", "bridge", "portal"],
    "portal": ["tower"]
}
start = "harbor"
target = "portal"

# Dùng BFS và parent để in một đường có số cạnh ít nhất.
`, label: "graphs_floor_10_route.py", note: "TẦNG 10\nCho sẵn bản đồ Kotopia, điểm đầu và đích; không có INPUT. PROCESS: BFS ghi `parent`, rồi dựng một đường có số cạnh ít nhất. OUTPUT đúng là `harbor -> forest -> tower -> portal`.", expectOut: /^harbor -> forest -> tower -> portal$/, solution: `graph = {
    "harbor": ["forest", "bridge"],
    "forest": ["harbor", "tower"],
    "bridge": ["harbor", "tower"],
    "tower": ["forest", "bridge", "portal"],
    "portal": ["tower"]
}
start = "harbor"
target = "portal"
queue = [start]
head = 0
parent = {start: None}

while head < len(queue):
    node = queue[head]
    head = head + 1
    for neighbor in graph[node]:
        if neighbor not in parent:
            parent[neighbor] = node
            queue.append(neighbor)

path = []
current = target
while current is not None:
    path.append(current)
    current = parent[current]
path.reverse()
print(" -> ".join(path))
` },
];

const cells = makeTowerCells({
  introTitle: "✦ THÁP CÂY VÀ ĐỒ THỊ ✦",
  introHook: "Mười tầng nối từ cây phân cấp tới bản đồ Kotopia. Mỗi tầng yêu cầu bạn chọn đúng stack hoặc queue và giữ đủ dấu vết để giải thích kết quả.",
  reviewTitle: "Ôn đường đi trên bản đồ",
  reviewQuestions: [
    { q: "Cho cây `root -> hall -> desk`, trong đó `root` có độ sâu 0. Độ sâu của `desk` là bao nhiêu?", a: ["2", "1", "3"], correct: 0 },
    { q: "Một bản đồ cần tìm đường có số cạnh ít nhất từ `A` tới `F`. Cách duyệt nào phù hợp với yêu cầu này?", a: ["BFS bằng queue", "DFS bất kỳ rồi lấy đường đầu tiên", "Đếm nút lá của cây"], correct: 0 },
    { q: "Cho `parent = {'A': None, 'B': 'A', 'C': 'B'}`. Sau khi lần từ `C` về `None` rồi đảo list, đường nào được tạo ra?", a: ["`A -> B -> C`", "`C -> B -> A`", "`A -> C`"], correct: 0 },
  ],
  tasks,
  checkpoint: "Cây dùng `children[node]` để đọc các nút con. DFS dùng stack để đi sâu và cần `visited` khi có đường vòng. BFS dùng queue, đánh dấu ở lần phát hiện đầu tiên và có thể ghi `distance` hoặc `parent`.",
  quizTitle: "Chọn đúng dấu vết",
  quizQuestions: [
    { q: "Một DFS trên đồ thị hai chiều không giữ `visited`. Khi đi qua cạnh `A-B`, lỗi nào có thể xảy ra?", a: ["Thuật toán thêm A và B qua lại, không dừng đúng lúc", "DFS tự tìm được đường ngắn nhất", "Cạnh A-B tự biến mất"], correct: 0 },
    { q: "BFS đang xử lý nút có `distance = 3` và lần đầu phát hiện một nút kề. Giá trị nào phải được ghi cho nút kề?", a: ["4", "3", "2"], correct: 0 },
    { q: "BFS kết thúc nhưng đích không có trong `parent`. Chương trình dựng đường phải làm gì?", a: ["Báo không có đường", "Gán parent của đích bằng chính nó", "In riêng tên đích"], correct: 0 },
    { q: "Nếu `start` và `target` cùng là `gate`, đường hợp lệ chứa dữ liệu nào?", a: ["Một địa điểm `gate`", "List rỗng", "Hai lần `gate`"], correct: 0 },
  ],
  remember: "Hãy chọn cấu trúc theo câu hỏi: stack cho DFS đi sâu, queue cho BFS theo lớp. Nếu cần trả đường chứ không chỉ trả số chặng, ghi `parent` ngay khi một nút được phát hiện lần đầu.",
});

export default dsaTower("graphs", { subtitle: "10 tầng ôn cây, DFS, BFS và dựng lại đường đi", machineName: "THÁP LA BÀN KOTOPIA", machineBlurb: "kiểm tra cách duyệt, khoảng cách, nút trước đó và các trường hợp không có đường", cells });
