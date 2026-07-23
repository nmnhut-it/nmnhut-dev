import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ TRẠM MÓC NỐI ✦", hook: "Mỗi mảnh bản đồ chỉ giữ tên của mảnh kế tiếp. Bạn sẽ lần theo, chèn và bỏ một mảnh bằng cách sửa đúng liên kết.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn set và dict", questions: [
    { q: "Một trạm cần lưu `name` và ID của trạm kế tiếp. Cấu trúc nào giúp đọc hai giá trị bằng các key có tên rõ ràng?", a: ["Dictionary", "Set", "Một số nguyên"], correct: 0 },
    { q: "Với `nodes = {\"A\": {\"next\": \"B\"}}`, biểu thức nào đọc ID của nút đứng sau `A`?", a: ['`nodes["A"]["next"]`', '`nodes["next"]["A"]`', '`nodes[0]`'], correct: 0 },
  ] } },
  { npc: "Chuỗi liên kết là một dãy nút. Trong bài này, mỗi nút nằm trong dictionary `nodes`, có một `value` và một `next`; biến `head` giữ ID của nút đầu tiên. Giá trị `None` ở `next` cho biết chuỗi đã hết." },
  { code: `nodes = {
    "A": {"value": "MAP", "next": "B"},
    "B": {"value": "KEY", "next": "C"},
    "C": {"value": "GATE", "next": None}
}
head = "A"

current = head
while current is not None:
    print(nodes[current]["value"])
    current = nodes[current]["next"]
`, label: "linked_traverse_demo.py", note: "RUN KIỂM CHỨNG\nDictionary `nodes` và `head = \"A\"` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: lần theo key `next` cho tới `None`. OUTPUT lần lượt là `MAP`, `KEY`, `GATE`.", expectOut: { all: [{ minLines: 3 }, /^MAP$/, /^KEY$/, /^GATE$/] }, solution: `nodes = {
    "A": {"value": "MAP", "next": "B"},
    "B": {"value": "KEY", "next": "C"},
    "C": {"value": "GATE", "next": None}
}
head = "A"

current = head
while current is not None:
    print(nodes[current]["value"])
    current = nodes[current]["next"]
` },
  { npc: "Muốn chèn `X` giữa `A` và `B`, hãy cho `X` trỏ tới `B` và gán lại để `A` trỏ tới `X`. Nếu không sửa liên kết của `A`, đường đi từ `head` sẽ bỏ qua `X`." },
  { code: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": None}
}
head = "A"

nodes["X"] = {"value": "X", "next": "B"}
nodes["A"]["next"] = "B"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
`, label: "linked_insert_fix.py", note: "ĐỀ BÀI\n`nodes` và `head` được gán sẵn; không có INPUT từ ngoài chương trình. Nút `X` đã được tạo nhưng chuỗi vẫn bỏ qua nó. Sửa liên kết của `A` để chèn `X` giữa `A` và `B`. OUTPUT đúng là `['A', 'X', 'B']`.", expectOut: /^\['A', 'X', 'B'\]$/, solution: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": None}
}
head = "A"

nodes["X"] = {"value": "X", "next": "B"}
nodes["A"]["next"] = "X"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
` },
  { code: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": "C"},
    "C": {"value": "C", "next": None}
}
head = "A"

nodes["A"]["next"] = "B"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
`, label: "linked_remove_middle.py", note: "ĐỀ BÀI\nChuỗi `A → B → C` được cho sẵn; không có INPUT từ ngoài chương trình. Hãy bỏ `B` khỏi đường đi bằng cách gán lại một liên kết, không xóa dữ liệu trong dictionary. OUTPUT đúng là `['A', 'C']`.", expectOut: /^\['A', 'C'\]$/, solution: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": "C"},
    "C": {"value": "C", "next": None}
}
head = "A"

nodes["A"]["next"] = "C"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
` },
  { checkpoint: { text: "Trong chuỗi liên kết, `head` giữ ID đầu tiên và `nodes[current][\"next\"]` cho ID kế tiếp. Chèn hoặc bỏ một nút cần gán lại các key `next` để đường đi từ `head` dẫn qua đúng các nút." } },
  { quiz: { title: "Lần theo liên kết mới", questions: [
    { q: "Cho `A.next = \"B\"`, `B.next = \"C\"`, `C.next = None` và `head = \"A\"`. Nếu gán `A.next = \"C\"`, thứ tự ID khi lần theo từ `head` là gì?", a: ["A, C", "A, B, C", "B, C"], correct: 0 },
    { q: "Chuỗi đang là `A → B`. Đã tạo `X.next = \"B\"`. Cần gán thêm dòng nào để chuỗi từ `head = \"A\"` trở thành `A → X → B`?", a: ['`nodes["A"]["next"] = "X"`', '`nodes["B"]["next"] = "X"`', '`head = "B"`'], correct: 0 },
  ] } },
];

export default dsaNode(8, { subtitle: "lần theo, chèn và bỏ nút bằng ID cùng key next", machineName: "BÀN MÓC NỐI", machineBlurb: "giữ mỗi nút bằng một ID và chỉ đường tới nút kế tiếp", cells });
