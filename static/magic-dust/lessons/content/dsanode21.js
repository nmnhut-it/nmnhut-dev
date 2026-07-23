import { dsaNode } from "./dsa-builders.js";

export default dsaNode(21, {
  subtitle: "đi hết một nhánh trước khi quay lại",
  machineName: "DÂY DẪN ĐƯỜNG DFS",
  machineBlurb: "ghi những nơi đã thăm để đi sâu qua cây và mạng lưới",
  cells: [
    { quiz: { title: "Ôn cây dữ liệu", questions: [
      { q: "Cho `children = {'root': ['a'], 'a': ['b'], 'b': []}`. Nút nào là lá và có độ sâu 2?", a: ["`b`", "`a`", "`root`"], correct: 0 },
    ] } },
    { npc: "Cây vừa rồi không có đường quay lại một nút cũ. Mạng lưới thì có thể nối vòng, nên máy phải nhớ nơi đã thăm để không đi mãi." },
    { npc: "DFS duyệt sâu theo một nhánh trước rồi mới quay lại nhánh khác. Bản lặp dùng stack; bản đệ quy dùng các lần gọi hàm đang chờ. Đồ thị có đường vòng thì cần thêm `visited`." },
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
        for neighbor in reversed(graph[node]):
            stack.append(neighbor)
`, label: "dfs_stack_demo.py", note: "RUN KIỂM CHỨNG: Đồ thị đã cho sẵn. Bản DFS dùng stack, đánh dấu mỗi nút trước khi mở rộng các nút kề. OUTPUT theo thứ tự là `A`, `B`, `D`, `C`.", expectOut: { all: [/^A$/m, /^B$/m, /^D$/m, /^C$/m], minLines: 4 }, solution: `graph = {
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
    { npc: "Bản đệ quy dưới có đường nối vòng `A -> B -> A` nhưng chưa kiểm tra `visited` trước khi gọi tiếp. Máy sẽ gọi `visit('A')`, rồi `visit('B')`, rồi lại `visit('A')` và không dừng đúng lúc." },
    { code: `graph = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": []
}
visited = set()

def visit(node):
    visited.add(node)
    for neighbor in graph[node]:
        visit(neighbor)

visit("A")
print(len(visited))
`, label: "dfs_recursive_fix.py", note: "ĐỀ BÀI: Đồ thị có một đường nối vòng. Hãy sửa hàm đệ quy để chỉ gọi tiếp với nút chưa có trong `visited`. OUTPUT đúng là `3`, vì mỗi nút `A`, `B`, `C` được thăm một lần.", expectOut: /^3$/, solution: `graph = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": []
}
visited = set()

def visit(node):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            visit(neighbor)

visit("A")
print(len(visited))
` },
    { code: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": ["D"],
    "D": ["C"],
    "E": []
}
visited = set()
region_count = 0

# Dùng DFS để đếm các vùng không nối với nhau.

print(region_count)
`, label: "connected_regions_task.py", note: "ĐỀ BÀI: Đồ thị vô hướng đã cho sẵn gồm các vùng `{A, B}`, `{C, D}` và `{E}`. Hãy dùng DFS cùng `visited` để đếm số vùng liên thông. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `graph = {
    "A": ["B"],
    "B": ["A"],
    "C": ["D"],
    "D": ["C"],
    "E": []
}
visited = set()
region_count = 0

for start in graph:
    if start not in visited:
        region_count = region_count + 1
        stack = [start]
        while stack:
            node = stack.pop()
            if node not in visited:
                visited.add(node)
                for neighbor in graph[node]:
                    if neighbor not in visited:
                        stack.append(neighbor)

print(region_count)
` },
    { code: `graph = {
    "gate": ["well", "tower"],
    "well": ["gate"],
    "tower": ["gate", "vault"],
    "vault": ["tower"]
}
target = "vault"
stack = ["gate"]
visited = set()
found = False

# Dùng DFS để xác định target có tới được từ gate hay không.

print(found)
`, label: "dfs_reach_task.py", note: "ĐỀ BÀI: Bản đồ và đích `vault` đã cho sẵn. Hãy dùng DFS để kiểm tra có thể đi từ `gate` tới `vault` hay không. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `graph = {
    "gate": ["well", "tower"],
    "well": ["gate"],
    "tower": ["gate", "vault"],
    "vault": ["tower"]
}
target = "vault"
stack = ["gate"]
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
    { checkpoint: { text: "DFS đi hết một nhánh trước khi xét nhánh khác. Có thể dùng stack hoặc hàm đệ quy, nhưng với đồ thị có đường vòng phải kiểm tra `visited` để mỗi nút chỉ được mở rộng một lần." } },
    { quiz: { title: "Đi sâu mà không đi vòng", questions: [
      { q: "Đồ thị có hai cạnh `A-B` và `B-A`. Một DFS đệ quy gọi tiếp mọi nút kề mà không kiểm tra `visited`. Điều gì dễ xảy ra?", a: ["Các lần gọi lặp qua lại giữa A và B", "DFS tự chuyển thành BFS", "Nút B tự bị xóa"], correct: 0 },
      { q: "Đồ thị gồm `{A, B}` nối nhau và nút `C` đứng riêng. Vòng ngoài bắt đầu một DFS ở mỗi nút chưa thăm sẽ đếm được bao nhiêu vùng liên thông?", a: ["2", "1", "3"], correct: 0 },
    ] } },
  ],
});
