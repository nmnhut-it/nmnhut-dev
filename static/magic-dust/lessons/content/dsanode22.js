import { dsaNode } from "./dsa-builders.js";

export default dsaNode(22, {
  subtitle: "duyệt theo từng lớp để tìm số cạnh ít nhất",
  machineName: "ĐÈN HÀNG ĐỢI BFS",
  machineBlurb: "mở rộng các điểm gần trước bằng queue và ghi khoảng cách",
  cells: [
    { quiz: { title: "Ôn DFS", questions: [
      { q: "Một đồ thị có đường nối vòng. Muốn DFS không mở rộng cùng một nút nhiều lần, cần giữ cấu trúc nào?", a: ["`visited`", "`prefix`", "Cửa sổ trượt"], correct: 0 },
    ] } },
    { npc: "DFS giỏi tìm xem một nơi có thể tới được hay không, nhưng nó có thể lao sâu vào một đường dài trước. Trạm cứu hộ cần đường có ít chặng nhất." },
    { npc: "BFS duyệt theo từng lớp khoảng cách. Nó dùng queue: điểm được thêm trước sẽ được lấy ra trước. Khi phát hiện điểm kề chưa thăm, máy thêm điểm đó vào cuối queue và ghi khoảng cách ngắn nhất." },
    { code: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D", "E"],
    "D": ["F"],
    "E": ["F"],
    "F": []
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

print(distance["F"])
`, label: "bfs_demo.py", note: "RUN KIỂM CHỨNG: Đồ thị đã cho sẵn. BFS dùng queue và `distance` để đi theo từng lớp từ `A`. Đường ít cạnh nhất tới `F` có 3 cạnh, nên OUTPUT là `3`.", expectOut: /^3$/, solution: `graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D", "E"],
    "D": ["F"],
    "E": ["F"],
    "F": []
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

print(distance["F"])
` },
    { npc: "Bản dưới thêm mọi nút kề vào queue, kể cả nút đã có khoảng cách. Với cạnh hai chiều, các nút liên tục đưa nhau trở lại hàng đợi. Cần chỉ thêm nút chưa có trong `distance`." },
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
`, label: "bfs_visited_fix.py", note: "ĐỀ BÀI: Đồ thị hai chiều đã cho sẵn. Hãy sửa vòng lặp để chỉ ghi khoảng cách và đưa vào queue những nút chưa có trong `distance`. Sau khi sửa, OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `graph = {
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
`, label: "bfs_shortest_task.py", note: "ĐỀ BÀI: Bản đồ, `start` và `target` đã cho sẵn. Hãy dùng BFS cùng queue để tìm số cạnh ít nhất từ `camp` tới `tower`. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `graph = {
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
target = "C"

# Dùng BFS và in -1 nếu target không thể tới được.
`, label: "bfs_unreachable_task.py", note: "ĐỀ BÀI: Đồ thị có nút `C` tách riêng. Hãy dùng BFS từ `A`; nếu `target` không có trong bảng khoảng cách sau khi duyệt, in `-1`. OUTPUT đúng là `-1`.", expectOut: /^-1$/, solution: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": []
}
start = "A"
target = "C"
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

if target in distance:
    print(distance[target])
else:
    print(-1)
` },
    { checkpoint: { text: "BFS dùng queue để duyệt các nút theo từng lớp. Gán `distance[start] = 0`; khi gặp một `neighbor` chưa thăm, gán `distance[neighbor] = distance[node] + 1` và thêm nó vào cuối queue." } },
    { quiz: { title: "Đường ít chặng", questions: [
      { q: "BFS bắt đầu ở `A`. Nút `B` cách A một cạnh, còn `C` được phát hiện từ B. Giá trị đúng của `distance['C']` là bao nhiêu?", a: ["2", "1", "3"], correct: 0 },
      { q: "Sau khi BFS kết thúc, `target` không có trong `distance`. Kết luận nào đúng?", a: ["Không có đường từ điểm bắt đầu tới `target`", "`target` cách đúng 0 cạnh", "Cần sắp xếp tên các nút"], correct: 0 },
    ] } },
  ],
});
