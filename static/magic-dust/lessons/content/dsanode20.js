import { dsaNode } from "./dsa-builders.js";

export default dsaNode(20, {
  subtitle: "biểu diễn dữ liệu phân cấp bằng quan hệ cha-con",
  machineName: "MẦM CÂY DỮ LIỆU",
  machineBlurb: "ghi các nút con của mỗi nút để đọc một cấu trúc phân cấp",
  cells: [
    { quiz: { title: "Ôn trạm dữ liệu", questions: [
      { q: "Một báo cáo cần tìm tổng lớn nhất của đúng 5 ngày liên tiếp. Trong ba mẫu đã học, nên chọn mẫu nào?", a: ["Cửa sổ trượt cố định", "`dict` tần suất", "Tổng cộng dồn cho một truy vấn bất kỳ"], correct: 0 },
    ] } },
    { npc: "Bản đồ thư viện không nằm trên một hàng. Một khu chính chứa nhiều phòng, mỗi phòng lại có thể chứa các kệ nhỏ hơn." },
    { npc: "Cây là cấu trúc phân cấp gồm các nút. Nút đầu là gốc; nút không có con là lá. Trong `dict` dưới đây, mỗi khóa là một nút, còn list đi kèm chứa các nút con trực tiếp." },
    { code: `children = {
    "root": ["maps", "spells"],
    "maps": ["north", "south"],
    "spells": [],
    "north": [],
    "south": []
}

print(children["root"])
print(children["maps"])
`, label: "tree_demo.py", note: "RUN KIỂM CHỨNG: Cây đã cho sẵn bằng `dict`. OUTPUT cho thấy `root` có hai nút con `maps`, `spells`; còn `maps` có hai nút con `north`, `south`.", expectOut: { all: [/\['maps', 'spells'\]/, /\['north', 'south'\]/], minLines: 2 }, solution: `children = {
    "root": ["maps", "spells"],
    "maps": ["north", "south"],
    "spells": [],
    "north": [],
    "south": []
}

print(children["root"])
print(children["maps"])
` },
    { npc: "Bản đúng nhận một nút là lá khi list các nút con rỗng. Bản dưới lại kiểm tra tên nút có phải chuỗi rỗng không; mọi tên đều có chữ, nên máy đếm được 0 lá." },
    { code: `children = {
    "root": ["maps", "spells"],
    "maps": ["north", "south"],
    "spells": [],
    "north": [],
    "south": []
}

leaf_count = 0
for node in children:
    if node == "":
        leaf_count = leaf_count + 1

print(leaf_count)
`, label: "leaf_fix.py", note: "ĐỀ BÀI: Cây đã cho sẵn. Hãy sửa điều kiện để nhận một nút là lá khi list các nút con của nó rỗng. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `children = {
    "root": ["maps", "spells"],
    "maps": ["north", "south"],
    "spells": [],
    "north": [],
    "south": []
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
    "desk": []
}

# In từng nút con trực tiếp của root, mỗi nút trên một dòng.
`, label: "direct_children_task.py", note: "ĐỀ BÀI: Cây đã cho sẵn. Hãy đọc list tại khóa `root` và in từng nút con trực tiếp. OUTPUT phải là `hall` rồi `garden` trên hai dòng. Không in nút `desk` vì đó không phải con trực tiếp của `root`.", expectOut: { all: [/^hall$/m, /^garden$/m], minLines: 2 }, solution: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": []
}

for child in children["root"]:
    print(child)
` },
    { npc: "Độ sâu cho biết một nút cách gốc bao nhiêu cạnh. Gốc có độ sâu 0; con trực tiếp của gốc có độ sâu 1. Có thể giữ cặp `(node, depth)` trong một stack để đi qua cây." },
    { code: `children = {
    "root": ["hall", "garden"],
    "hall": ["desk"],
    "garden": [],
    "desk": ["drawer"],
    "drawer": []
}

stack = [("root", 0)]
max_depth = 0

# Đi qua cây và tìm độ sâu lớn nhất.

print(max_depth)
`, label: "tree_depth_task.py", note: "ĐỀ BÀI: Cây và stack ban đầu đã cho sẵn. Hãy dùng các cặp `(node, depth)` để tìm độ sâu lớn nhất tính từ `root`. OUTPUT đúng là `3`, ứng với đường `root -> hall -> desk -> drawer`.", expectOut: /^3$/, solution: `children = {
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
    { checkpoint: { text: "Trong cây, gốc không có nút cha; mỗi cạnh nối một nút cha với một nút con; nút có list con rỗng là lá. Với biểu diễn `children`, `children[node]` chứa các nút con trực tiếp của `node`." } },
    { quiz: { title: "Đọc một cây dữ liệu", questions: [
      { q: "Cho `children = {'root': ['a', 'b'], 'a': ['c'], 'b': [], 'c': []}`. Những nút nào là lá?", a: ["`b` và `c`", "Chỉ `root`", "`a` và `b`"], correct: 0 },
      { q: "Trong cùng cây, đường từ `root` tới `c` đi qua hai cạnh. Nếu gốc có độ sâu 0 thì `c` có độ sâu bao nhiêu?", a: ["2", "1", "3"], correct: 0 },
    ] } },
  ],
});
