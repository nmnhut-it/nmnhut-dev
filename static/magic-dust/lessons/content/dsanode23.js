import { dsaNode } from "./dsa-builders.js";

export default dsaNode(23, {
  subtitle: "lưu nút trước đó và dựng lại một lộ trình ngắn nhất",
  machineName: "LA BÀN KOTOPIA",
  machineBlurb: "dùng BFS cùng bảng parent để trả về cả đường đi",
  cells: [
    { quiz: { title: "Ôn BFS", questions: [
      { q: "Trong BFS, `distance[node] = 2`. Khi lần đầu phát hiện một nút kề chưa thăm, khoảng cách của nút kề được gán thế nào?", a: ["`3`", "`2`", "`1`"], correct: 0 },
    ] } },
    { npc: "Số chặng ít nhất chưa đủ cho đội cứu hộ. Họ cần biết phải đi qua những địa điểm nào theo đúng thứ tự." },
    { npc: "Trong BFS, bảng `parent` ghi nút đã dẫn tới mỗi nút mới: khi phát hiện `neighbor` từ `node`, gán `parent[neighbor] = node`. Từ đích, lần theo `parent` về điểm đầu rồi đảo list để có lộ trình đúng chiều." },
    { code: `graph = {
    "gate": ["bridge", "hill"],
    "bridge": ["gate", "village"],
    "hill": ["gate"],
    "village": ["bridge", "tower"],
    "tower": ["village"]
}
start = "gate"
target = "tower"
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
`, label: "route_demo.py", note: "RUN KIỂM CHỨNG: Bản đồ, điểm đầu và đích đã cho sẵn. BFS ghi `parent`, sau đó dựng lại đường đi. OUTPUT đúng là `gate -> bridge -> village -> tower`.", expectOut: /^gate -> bridge -> village -> tower$/, solution: `graph = {
    "gate": ["bridge", "hill"],
    "bridge": ["gate", "village"],
    "hill": ["gate"],
    "village": ["bridge", "tower"],
    "tower": ["village"]
}
start = "gate"
target = "tower"
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
    { npc: "Bản dưới lần từ đích về gốc nhưng in ngay list đó. Các địa điểm vì thế xuất hiện theo chiều `tower` về `gate`, ngược với hướng đội cứu hộ cần đi." },
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
`, label: "route_reverse_fix.py", note: "ĐỀ BÀI: Bảng `parent` đã cho sẵn. Hãy sửa phần dựng lộ trình để OUTPUT đi từ điểm đầu tới đích: `gate -> bridge -> village -> tower`.", expectOut: /^gate -> bridge -> village -> tower$/, solution: `parent = {
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

# Dùng BFS và in "Không có đường" nếu target không được phát hiện.
`, label: "route_unreachable_task.py", note: "ĐỀ BÀI: Bản đồ có `C` tách riêng. Hãy dùng BFS với `parent`; chỉ dựng lộ trình nếu `target` được phát hiện. OUTPUT đúng là `Không có đường`.", expectOut: /^Không có đường$/, solution: `graph = {
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

# In lộ trình đúng khi điểm đầu cũng chính là đích.
`, label: "route_same_point_task.py", note: "ĐỀ BÀI: `start` và `target` đều là `gate`. Hãy xử lý trường hợp này bằng cùng bảng `parent`. Lộ trình có đúng một địa điểm, nên OUTPUT phải là `gate`.", expectOut: /^gate$/, solution: `graph = {
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

# Hoàn thành la bàn: in một đường có số cạnh ít nhất từ start tới target.
`, label: "kotopia_route_capstone.py", note: "XƯỞNG PHÉP: Bản đồ Kotopia, `start` và `target` đã cho sẵn. Hãy dùng BFS với queue và bảng `parent`, rồi dựng lại một lộ trình ngắn nhất. OUTPUT hợp lệ là `harbor -> forest -> tower -> portal` hoặc `harbor -> bridge -> tower -> portal`.", expectOut: /^(harbor -> forest -> tower -> portal|harbor -> bridge -> tower -> portal)$/, solution: `graph = {
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
    { checkpoint: { text: "Trong BFS, gán `parent[start] = None`. Khi lần đầu phát hiện `neighbor` từ `node`, gán `parent[neighbor] = node`. Nếu đích có trong `parent`, lần ngược từ đích về `None` rồi đảo list để dựng lộ trình từ điểm đầu." } },
    { quiz: { title: "Dựng lại đường đi", questions: [
      { q: "Cho `parent = {'A': None, 'B': 'A', 'C': 'B'}` và đích là `C`. Sau khi lần ngược rồi đảo list, lộ trình nào đúng?", a: ["`A -> B -> C`", "`C -> B -> A`", "`A -> C`"], correct: 0 },
      { q: "BFS kết thúc nhưng `target` không có trong `parent`. Chương trình dựng đường nên làm gì?", a: ["Báo không có đường", "Gán cha của đích bằng chính nó", "In riêng tên đích"], correct: 0 },
      { q: "Nếu `start == target`, lộ trình đúng có bao nhiêu địa điểm?", a: ["Một địa điểm là chính `start`", "Không có địa điểm nào", "Hai địa điểm giống nhau"], correct: 0 },
    ] } },
  ],
});
