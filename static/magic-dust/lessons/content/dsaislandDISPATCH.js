import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `queue = ["A", "B", "C"]
head = 0

print(queue[head])
head = head + 1
print(queue[head])
`, label: "dsa_dispatch_queue.py", note: "RUN KIỂM CHỨNG\nCho sẵn hàng chờ A, B, C; không có INPUT. PROCESS: dùng `head` để phục vụ theo thứ tự vào trước ra trước. OUTPUT là `A` rồi `B`.", expectOut: { all: [{ minLines: 2 }, /^A$/, /^B$/] }, solution: `queue = ["A", "B", "C"]
head = 0

print(queue[head])
head = head + 1
print(queue[head])
` },
  { code: `requests = ["R1", "R2", "R1", "R3", "R2"]
seen = set()
unique = []

for request in requests:
    if request not in seen:
        unique.append(request)
        seen.add(request)

print(unique)
`, label: "dsa_dispatch_unique.py", note: "ĐỀ BÀI\nCho sẵn năm yêu cầu có mã trùng; không có INPUT. PROCESS: dùng set để chỉ đưa mỗi mã vào hàng xử lý một lần. OUTPUT đúng là `['R1', 'R2', 'R3']`.", expectOut: /^\['R1', 'R2', 'R3'\]$/, solution: `requests = ["R1", "R2", "R1", "R3", "R2"]
seen = set()
unique = []

for request in requests:
    if request not in seen:
        unique.append(request)
        seen.add(request)

print(unique)
` },
  { code: `events = ["OPEN", "MOVE", "OPEN", "OPEN", "MOVE"]
frequency = {}

for event in events:
    if event not in frequency:
        frequency[event] = 0
    frequency[event] = frequency[event] + 1

print(frequency["OPEN"])
print(frequency["MOVE"])
`, label: "dsa_dispatch_frequency.py", note: "ĐỀ BÀI\nCho sẵn năm sự kiện; không có INPUT. PROCESS: dùng dict để đếm số lần từng tên xuất hiện. OUTPUT là `3` rồi `2`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^2$/] }, solution: `events = ["OPEN", "MOVE", "OPEN", "OPEN", "MOVE"]
frequency = {}

for event in events:
    if event not in frequency:
        frequency[event] = 0
    frequency[event] = frequency[event] + 1

print(frequency["OPEN"])
print(frequency["MOVE"])
` },
  { code: `value = {"A": "START", "B": "BRIDGE", "C": "EXIT", "D": "REPAIR"}
next_id = {"A": "B", "B": "C", "C": None, "D": None}

next_id["B"] = "D"
next_id["D"] = "C"

current = "A"
while current is not None:
    print(value[current])
    current = next_id[current]
`, label: "dsa_dispatch_rewire.py", note: "XƯỞNG ĐIỀU PHỐI\nCho sẵn chuỗi A → B → C và nút D; không có INPUT. PROCESS: đổi hai liên kết để chèn D sau B. OUTPUT là `START`, `BRIDGE`, `REPAIR`, `EXIT`.", expectOut: { all: [{ minLines: 4 }, /^START$/, /^BRIDGE$/, /^REPAIR$/, /^EXIT$/] }, solution: `value = {"A": "START", "B": "BRIDGE", "C": "EXIT", "D": "REPAIR"}
next_id = {"A": "B", "B": "C", "C": None, "D": None}

next_id["B"] = "D"
next_id["D"] = "C"

current = "A"
while current is not None:
    print(value[current])
    current = next_id[current]
` },
];

const cells = makePracticeCells({
  introTitle: "✦ TRUNG TÂM ĐIỀU PHỐI ✦", introHook: "Trung tâm nhận yêu cầu theo hàng chờ, bỏ mã gửi trùng, đếm loại sự kiện và đổi tuyến khi một trạm mới được chèn vào chuỗi liên kết.",
  reviewTitle: "Chọn cấu trúc theo thao tác", reviewQuestions: [{ q: "Trung tâm cần phục vụ người đến trước trước. Cấu trúc nào thể hiện trực tiếp quy tắc này?", a: ["Queue", "Stack", "Set"], correct: 0 }],
  definition: "Mỗi cấu trúc hợp với một nhóm thao tác: queue giữ thứ tự đến, set kiểm tra đã thấy, dict tra cứu theo khóa, còn chuỗi liên kết đổi tuyến bằng cách cập nhật ID của nút tiếp theo.", tasks,
  checkpoint: "Chọn cấu trúc theo thao tác cần làm: queue cho thứ tự vào trước ra trước, set cho dữ liệu không trùng, dict cho tra cứu theo khóa và liên kết cho việc đổi nút tiếp theo.",
  quizTitle: "Điều phối đúng cấu trúc", quizQuestions: [
    { q: "Một hệ thống cần biết mã `R7` đã được nhận hay chưa, không cần lưu số lần. Cấu trúc nào phù hợp nhất?", a: ["Set", "Queue", "Stack"], correct: 0 },
    { q: "Một hệ thống cần đếm mỗi loại lỗi xuất hiện bao nhiêu lần. Cấu trúc nào phù hợp nhất?", a: ["Dict với tên lỗi làm khóa", "Set chứa tên lỗi", "Một biến duy nhất"], correct: 0 },
  ], remember: "Không có cấu trúc tốt nhất cho mọi bài. Hãy xác định thao tác quan trọng trước: giữ thứ tự, chống trùng, tra cứu theo khóa hay thay đổi liên kết.",
});

export default dsaIsland("dispatch-center", { subtitle: "ghép queue, set, dict và chuỗi liên kết trong một hệ điều phối nhỏ", machineName: "MÁY ĐIỀU PHỐI", machineBlurb: "chọn cấu trúc phù hợp cho từng loại thao tác", cells });
