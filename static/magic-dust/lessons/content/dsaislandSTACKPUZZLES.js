import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `stack = []
stack.append("A")
stack.append("B")
stack.append("C")

print(stack.pop())
print(stack)
`, label: "dsa_stack_steps.py", note: "RUN KIỂM CHỨNG\nCho sẵn ba thao tác đưa A, B, C vào stack; không có INPUT. PROCESS: lấy phần tử ở đỉnh bằng `pop()`. OUTPUT là `C` rồi `['A', 'B']`.", expectOut: { all: [{ minLines: 2 }, /^C$/, /^\['A', 'B'\]$/] }, solution: `stack = []
stack.append("A")
stack.append("B")
stack.append("C")

print(stack.pop())
print(stack)
` },
  { code: `actions = ["TYPE A", "TYPE B", "DELETE"]
undo_stack = []

for action in actions:
    undo_stack.append(action)

last_action = undo_stack[0]
print(last_action)
`, label: "dsa_stack_undo_fix.py", note: "ĐỀ BÀI\nCho sẵn ba thao tác; không có INPUT. PROCESS: sửa cách đọc để lấy thao tác mới nhất trên đỉnh stack. OUTPUT đúng là `DELETE`.", expectOut: /^DELETE$/, solution: `actions = ["TYPE A", "TYPE B", "DELETE"]
undo_stack = []

for action in actions:
    undo_stack.append(action)

last_action = undo_stack[-1]
print(last_action)
` },
  { code: `text = "(()())"
stack = []
valid = True

for char in text:
    if char == "(":
        stack.append(char)
    else:
        if len(stack) == 0:
            valid = False
        else:
            stack.pop()

if len(stack) != 0:
    valid = False

print(valid)
`, label: "dsa_stack_parentheses.py", note: "ĐỀ BÀI\nCho sẵn chuỗi `(()())`; không có INPUT. PROCESS: dùng stack để ghép mỗi dấu đóng với một dấu mở gần nhất. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `text = "(()())"
stack = []
valid = True

for char in text:
    if char == "(":
        stack.append(char)
    else:
        if len(stack) == 0:
            valid = False
        else:
            stack.pop()

if len(stack) != 0:
    valid = False

print(valid)
` },
  { code: `moves = ["L", "R", "U", "U", "D"]
opposite = {"L": "R", "R": "L", "U": "D", "D": "U"}
stack = []

for move in moves:
    if len(stack) > 0 and opposite[move] == stack[-1]:
        stack.pop()
    else:
        stack.append(move)

print(stack)
`, label: "dsa_stack_cancel_moves.py", note: "XƯỞNG STACK\nCho sẵn chuỗi di chuyển; không có INPUT. PROCESS: dùng stack để hủy hai bước liên tiếp ngược hướng. OUTPUT còn lại là `['U']`.", expectOut: /^\['U'\]$/, solution: `moves = ["L", "R", "U", "U", "D"]
opposite = {"L": "R", "R": "L", "U": "D", "D": "U"}
stack = []

for move in moves:
    if len(stack) > 0 and opposite[move] == stack[-1]:
        stack.pop()
    else:
        stack.append(move)

print(stack)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ KHO CÂU ĐỐ STACK ✦", introHook: "Các cánh cửa trong kho chỉ mở theo thứ tự ngược với lúc đóng. Bạn sẽ dùng stack để lấy thao tác mới nhất, hoàn tác và ghép các cặp dấu ngoặc.",
  reviewTitle: "Nhận ra đỉnh stack", reviewQuestions: [{ q: "Cho `stack = [\"A\", \"B\", \"C\"]`. Lệnh `stack.pop()` trả về giá trị nào?", a: ["`C`", "`A`", "Cả ba giá trị"], correct: 0 }],
  definition: "Stack tuân theo quy tắc vào sau ra trước. `append(value)` đưa dữ liệu lên đỉnh; `pop()` lấy và xóa giá trị trên đỉnh; `stack[-1]` chỉ đọc giá trị trên đỉnh.", tasks,
  checkpoint: "Stack xử lý phần tử mới nhất trước. Dùng `append()` để đưa dữ liệu lên đỉnh, `stack[-1]` để đọc đỉnh và `pop()` để lấy đồng thời xóa phần tử đó.",
  quizTitle: "Chọn thao tác stack", quizQuestions: [
    { q: "Một trình soạn thảo lưu các thao tác theo thứ tự xảy ra. Khi bấm Undo, thao tác nào cần được xử lý trước?", a: ["Thao tác mới nhất", "Thao tác đầu tiên", "Mọi thao tác cùng lúc"], correct: 0 },
    { q: "Khi kiểm tra ngoặc, gặp dấu `)` nhưng stack đang rỗng thì kết luận nào đúng?", a: ["Chuỗi không hợp lệ", "Bỏ qua dấu đó", "Đưa dấu đóng vào stack"], correct: 0 },
  ], remember: "Stack phù hợp khi bài toán cần quay lại điều mới xảy ra nhất: Undo, lịch sử quay lui, ghép ngoặc và DFS.",
});

export default dsaIsland("stack-puzzles", { subtitle: "luyện thao tác trên đỉnh stack qua Undo, dấu ngoặc và bước đi đối nhau", machineName: "KHO STACK", machineBlurb: "giữ thao tác mới nhất ở đỉnh để xử lý trước", cells });
