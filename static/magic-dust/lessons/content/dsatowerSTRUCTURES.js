import { dsaTower } from "./dsa-builders.js";
import { makeTowerCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `stack = []
stack.append("map")
stack.append("key")
stack.append("gem")

print(stack[-1])
print(stack.pop())
print(stack[-1])
`, label: "structures_01_stack_actions.py", note: "TẦNG 1 · STACK\nStack rỗng và ba món được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: push ba món, peek, pop, rồi peek lại. OUTPUT là `gem`, `gem`, `key`.", expectOut: { all: [{ minLines: 3 }, /^gem$/, /^key$/] }, solution: `stack = []
stack.append("map")
stack.append("key")
stack.append("gem")

print(stack[-1])
print(stack.pop())
print(stack[-1])
` },
  { code: `stack = []

if stack:
    print(stack.pop())
else:
    print("EMPTY")
`, label: "structures_02_safe_pop.py", note: "TẦNG 2 · STACK RỖNG\nMột stack rỗng được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: kiểm tra trước khi pop để chương trình không báo lỗi. OUTPUT đúng là `EMPTY`.", expectOut: /^EMPTY$/, solution: `stack = []

if stack:
    print(stack.pop())
else:
    print("EMPTY")
` },
  { code: `history = []
text = "A"

text = text + "B"
history.append(text)

text = history.pop()
print(text)
`, label: "structures_03_undo_fix.py", note: "TẦNG 3 · UNDO\nVăn bản `A` được gán sẵn; không có INPUT từ ngoài chương trình. Lịch sử đang lưu trạng thái sau khi sửa. Sửa PROCESS để một lần Undo khôi phục trạng thái cũ. OUTPUT đúng là `A`.", expectOut: /^A$/, solution: `history = []
text = "A"

history.append(text)
text = text + "B"

text = history.pop()
print(text)
` },
  { code: `text = "([)]"
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
balanced = True

for char in text:
    if char in "([{":
        stack.append(char)
    elif char in ")]}":
        if not stack or stack.pop() != pairs[char]:
            balanced = False
            break

if stack:
    balanced = False
print(balanced)
`, label: "structures_04_bracket_check.py", note: "TẦNG 4 · GHÉP NGOẶC\nChuỗi `([)]` được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: dùng stack ghép mỗi dấu đóng với dấu mở gần nhất và kiểm tra stack cuối cùng. OUTPUT đúng là `False`.", expectOut: /^False$/, solution: `text = "([)]"
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
balanced = True

for char in text:
    if char in "([{":
        stack.append(char)
    elif char in ")]}":
        if not stack or stack.pop() != pairs[char]:
            balanced = False
            break

if stack:
    balanced = False
print(balanced)
` },
  { code: `queue = ["An", "Bo", "Chi"]
head = 0

print(queue[head])
head = head + 1
print(queue[head])
head = head + 1
print(len(queue) - head)
`, label: "structures_05_queue_head.py", note: "TẦNG 5 · QUEUE\nQueue ba tên và `head = 0` được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: phục vụ hai người theo FIFO và tính số người còn chờ. OUTPUT là `An`, `Bo`, `1`.", expectOut: { all: [{ minLines: 3 }, /^An$/, /^Bo$/, /^1$/] }, solution: `queue = ["An", "Bo", "Chi"]
head = 0

print(queue[head])
head = head + 1
print(queue[head])
head = head + 1
print(len(queue) - head)
` },
  { code: `codes = ["K1", "K2", "K1", "K3", "K2"]
seen = set()

for code in codes:
    seen.add(code)

print(len(seen))
print("K3" in seen)
`, label: "structures_06_unique_set.py", note: "TẦNG 6 · SET\nNăm mã được gán sẵn và có mã trùng; không có INPUT từ ngoài chương trình. PROCESS: dùng set để giữ mã khác nhau và kiểm tra `K3`. OUTPUT là `3`, rồi `True`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^True$/] }, solution: `codes = ["K1", "K2", "K1", "K3", "K2"]
seen = set()

for code in codes:
    seen.add(code)

print(len(seen))
print("K3" in seen)
` },
  { code: `items = ["gem", "key", "gem", "map", "gem"]
counts = {}

for item in items:
    if item in counts:
        counts[item] = counts[item] + 1
    else:
        counts[item] = 0

print(counts["gem"])
print(counts["key"])
`, label: "structures_07_frequency_fix.py", note: "TẦNG 7 · DICT TẦN SUẤT\nNăm món được gán sẵn; không có INPUT từ ngoài chương trình. Lần gặp đầu đang được đếm là 0. Sửa PROCESS để OUTPUT là `3`, rồi `1`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^1$/] }, solution: `items = ["gem", "key", "gem", "map", "gem"]
counts = {}

for item in items:
    if item in counts:
        counts[item] = counts[item] + 1
    else:
        counts[item] = 1

print(counts["gem"])
print(counts["key"])
` },
  { code: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": None},
    "X": {"value": "X", "next": "B"}
}
head = "A"
nodes["A"]["next"] = "B"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
`, label: "structures_08_rewire_chain.py", note: "TẦNG 8 · CHUỖI LIÊN KẾT\nChuỗi `A → B` và nút `X` trỏ tới `B` được gán sẵn; không có INPUT từ ngoài chương trình. Sửa một liên kết để PROCESS tạo đường đi `A → X → B`. OUTPUT đúng là `['A', 'X', 'B']`.", expectOut: /^\['A', 'X', 'B'\]$/, solution: `nodes = {
    "A": {"value": "A", "next": "B"},
    "B": {"value": "B", "next": None},
    "X": {"value": "X", "next": "B"}
}
head = "A"
nodes["A"]["next"] = "X"

order = []
current = head
while current is not None:
    order.append(nodes[current]["value"])
    current = nodes[current]["next"]
print(order)
` },
];

const cells = makeTowerCells({
  introTitle: "✦ THÁP CẤU TRÚC DỮ LIỆU ✦",
  introHook: "Tám tầng sẽ đổi liên tục giữa stack, queue, set, dict và chuỗi liên kết. Mỗi tầng chỉ hỏi thứ tự xử lý hoặc dữ liệu cần giữ.",
  reviewTitle: "Chọn đúng cấu trúc",
  reviewQuestions: [
    { q: "Một nút Undo cần lấy thay đổi mới nhất trước. Cấu trúc nào phù hợp?", a: ["Stack", "Queue", "Set"], correct: 0 },
    { q: "Một quầy vé phải phục vụ người đến trước. Cấu trúc nào giữ đúng thứ tự?", a: ["Queue", "Stack", "Set"], correct: 0 },
  ],
  tasks,
  checkpoint: "Stack lấy phần tử mới nhất; queue lấy phần tử đến sớm nhất; set giữ giá trị không trùng; dict giữ thông tin theo khóa; chuỗi liên kết dùng `head` và key `next` để xác định đường đi.",
  quizTitle: "Ghép cấu trúc với tình huống",
  quizQuestions: [
    { q: "Một trình chỉnh sửa cần Undo thay đổi mới nhất, còn máy in cần xử lý tài liệu gửi sớm nhất. Cặp cấu trúc nào đúng?", a: ["Undo dùng stack; máy in dùng queue", "Undo dùng queue; máy in dùng stack", "Cả hai dùng set"], correct: 0 },
    { q: "Các lượt bình chọn là `[\"sun\", \"moon\", \"sun\"]`. Muốn biết mỗi tên có bao nhiêu phiếu, cấu trúc nào giữ đủ thông tin?", a: ["Dict nối tên với số lần xuất hiện", "Set chỉ giữ hai tên", "Stack chỉ giữ phiếu cuối"], correct: 0 },
    { q: "Cho `A.next = \"B\"`, `B.next = \"C\"`, `C.next = None`. Sau khi gán `A.next = \"C\"`, đường đi từ `A` là gì?", a: ["A, C", "A, B, C", "B, C"], correct: 0 },
  ],
  remember: "Hãy chọn cấu trúc theo thứ tự và thông tin bài toán cần giữ: mới nhất, sớm nhất, không trùng, giá trị theo khóa hoặc nút kế tiếp.",
});

export default dsaTower("structures", { subtitle: "tám tầng stack, queue, set, dict và liên kết", machineName: "BÀN ĐIỀU PHỐI CẤU TRÚC", machineBlurb: "chọn đúng quy tắc lấy dữ liệu và cập nhật đúng trạng thái", cells });
