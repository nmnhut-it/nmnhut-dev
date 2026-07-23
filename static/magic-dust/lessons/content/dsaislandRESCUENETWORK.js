import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
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
`, label: "rescue_bfs_order.py", note: "RUN KIỂM CHỨNG\nCho sẵn đồ thị bằng danh sách kề; không có INPUT. PROCESS: BFS dùng queue để thăm từng lớp và đánh dấu khi thêm vào queue. OUTPUT là `A`, `B`, `C`, `D`, `E`.", expectOut: { all: [{ minLines: 5 }, /^A$/, /^B$/, /^C$/, /^D$/, /^E$/] }, solution: `graph = {
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
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"]
}

queue = ["A"]
head = 0
distance = {"A": 0}

while head < len(queue):
    node = queue[head]
    head = head + 1
    for neighbor in graph[node]:
        distance[neighbor] = distance[node] + 1
        queue.append(neighbor)
    if head > 8:
        break

print(distance["C"])
`, label: "rescue_repeat_fix.py", note: "ĐỀ BÀI\nCho sẵn đồ thị hai chiều; không có INPUT. Đoạn code hiện thêm lại cả nút đã có khoảng cách. Sửa để chỉ ghi và enqueue nút chưa có trong `distance`. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `graph = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"]
}

queue = ["A"]
head = 0
distance = {"A": 0}

while head < len(queue):
    node = queue[head]
    head = head + 1
    for neighbor in graph[node]:
        if neighbor not in distance:
            distance[neighbor] = distance[node] + 1
            queue.append(neighbor)

print(distance["C"])
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

# Dùng BFS để in số cạnh ít nhất từ start tới target.
`, label: "rescue_shortest_edges.py", note: "ĐỀ BÀI\nCho sẵn bản đồ, `start` và `target`; không có INPUT. PROCESS: dùng BFS cùng queue và bảng khoảng cách để tìm số cạnh ít nhất. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `graph = {
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
  { code: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": []
}
start = "A"
targets = ["B", "C"]

# Chạy một BFS rồi in khoảng cách tới từng target; in -1 nếu không tới được.
`, label: "rescue_unreachable.py", note: "XƯỞNG CỨU HỘ\nCho sẵn đồ thị, điểm bắt đầu và hai đích; không có INPUT. PROCESS: chạy BFS một lần, dùng bảng khoảng cách trả lời từng đích và in `-1` cho nơi không thể tới. OUTPUT là `1` rồi `-1`.", expectOut: { all: [{ minLines: 2 }, /^1$/, /^-1$/] }, solution: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": []
}
start = "A"
targets = ["B", "C"]
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

for target in targets:
    if target in distance:
        print(distance[target])
    else:
        print(-1)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ MẠNG LƯỚI CỨU HỘ ✦",
  introHook: "Tín hiệu cứu hộ cần lan qua các điểm gần trước. Bạn sẽ đọc danh sách kề, giữ queue đúng thứ tự và nhận ra nơi không có đường tới.",
  reviewTitle: "Ôn BFS theo từng lớp",
  reviewQuestions: [
    { q: "BFS bắt đầu ở `A`. Hai nút `B`, `C` kề trực tiếp với `A`, còn `D` chỉ kề với `B`. Nút nào có khoảng cách 2 cạnh từ `A`?", a: ["`D`", "`B`", "`C`"], correct: 0 },
    { q: "Trong BFS, `B` đã có trong bảng `distance`. Khi gặp lại `B` từ một nút khác, chương trình nên làm gì?", a: ["Không ghi lại và không thêm `B` vào queue", "Thêm `B` vào queue lần nữa", "Xóa khoảng cách của `B`"], correct: 0 },
  ],
  definition: "Danh sách kề lưu các nút nối trực tiếp với từng nút. BFS dùng queue để mở rộng theo từng lớp. Nút mới nhận khoảng cách của nút hiện tại cộng 1 rồi được thêm vào cuối queue.",
  tasks,
  checkpoint: "BFS đánh dấu một nút ngay khi phát hiện và thêm nó vào queue. Với `distance[start] = 0`, lần đầu gán `distance[neighbor] = distance[node] + 1` cho biết số cạnh ít nhất từ điểm bắt đầu.",
  quizTitle: "Giữ khoảng cách ngắn nhất",
  quizQuestions: [
    { q: "BFS đang xử lý nút có khoảng cách 2 và phát hiện một nút kề chưa thăm. Khoảng cách của nút kề phải được gán bằng bao nhiêu?", a: ["3", "2", "1"], correct: 0 },
    { q: "Sau khi BFS từ `gate` kết thúc, khóa `vault` không có trong dict `distance`. Báo cáo nào đúng?", a: ["Không có đường từ `gate` tới `vault`", "`vault` cách `gate` 0 cạnh", "Phải đổi BFS thành sắp xếp"], correct: 0 },
  ],
  remember: "BFS chỉ bảo đảm số cạnh ít nhất khi queue giữ thứ tự vào trước, ra trước và mỗi nút được đánh dấu ở lần phát hiện đầu tiên. Nút không có trong bảng khoảng cách sau khi duyệt là nút không thể tới từ điểm bắt đầu.",
});

export default dsaIsland("rescue-network", { subtitle: "luyện thứ tự BFS, khoảng cách ít cạnh nhất và trường hợp không có đường", machineName: "ĐÈN MẠNG LƯỚI CỨU HỘ", machineBlurb: "lan tín hiệu theo từng lớp và ghi khoảng cách lần đầu tới mỗi điểm", cells });
