import { dsaNode } from "./dsa-builders.js";

export default dsaNode(4, {
  subtitle: "thêm và lấy dữ liệu ở cùng một đầu bằng push, pop và peek",
  machineName: "TÚI STACK",
  machineBlurb: "giữ phần tử mới nhất ở trên cùng để lấy ra trước",
  cells: [
    { quiz: { title: "Ôn số bước", questions: [
      { q: "Tìm lần lượt số 8 trong `[3, 5, 8, 9]` và dừng khi gặp. Có bao nhiêu phép so sánh với mục tiêu?", a: ["3", "1", "4"], correct: 0 },
      { q: "Hai vòng lồng nhau đều chạy n lượt. Khi n tăng từ 3 lên 6, số cặp thao tác đổi từ 9 thành bao nhiêu?", a: ["36", "18", "12"], correct: 0 },
    ] } },
    { npc: "Có những bài toán luôn cần xử lý thứ mới thêm gần đây nhất: lấy chiếc đĩa trên cùng hoặc quay lại thao tác vừa làm. Stack phục vụ đúng thứ tự đó." },
    { npc: "Stack hoạt động theo nguyên tắc vào sau, ra trước. Với list Python, `append(value)` là push để thêm lên đỉnh, `pop()` lấy và xóa phần tử trên đỉnh, còn `stack[-1]` là peek để xem đỉnh mà không xóa." },
    { code: `stack = []
stack.append("map")
stack.append("key")
stack.append("gem")

print("PEEK", stack[-1])
print("POP", stack.pop())
print("TOP", stack[-1])
`, label: "stack_actions.py", note: "RUN KIỂM CHỨNG\nCho sẵn stack rỗng; không có INPUT. PROCESS: push ba món, peek đỉnh, pop một món rồi xem đỉnh mới. OUTPUT là `PEEK gem`, `POP gem`, `TOP key`.", expectOut: { all: [{ minLines: 3 }, /^PEEK gem$/, /^POP gem$/, /^TOP key$/] }, solution: `stack = []
stack.append("map")
stack.append("key")
stack.append("gem")

print("PEEK", stack[-1])
print("POP", stack.pop())
print("TOP", stack[-1])
` },
    { npc: "`pop()` trên stack rỗng làm chương trình báo lỗi. Trước khi lấy phần tử, hãy kiểm tra stack còn dữ liệu bằng `if stack:`." },
    { code: `stack = []

item = stack.pop()
print(item)
`, label: "safe_pop_fix.py", note: "ĐỀ BÀI\nCho sẵn stack rỗng; không có INPUT. Đoạn code hiện gọi `pop()` khi không có phần tử. Sửa bằng điều kiện kiểm tra stack; nếu rỗng, OUTPUT đúng là `EMPTY`.", expectOut: /^EMPTY$/, solution: `stack = []

if stack:
    item = stack.pop()
    print(item)
else:
    print("EMPTY")
` },
    { checkpoint: { text: "Stack xử lý phần tử theo thứ tự vào sau, ra trước. Với list Python: `append(value)` thực hiện push, `pop()` lấy và xóa đỉnh, `stack[-1]` peek đỉnh; phải kiểm tra stack không rỗng trước khi pop hoặc peek." } },
    { quiz: { title: "Lần theo stack", questions: [
      { q: "Bắt đầu với stack rỗng, chương trình push `A`, push `B`, rồi pop một lần. Giá trị được pop và stack còn lại là gì?", a: ["Pop `B`, còn `[A]`", "Pop `A`, còn `[B]`", "Pop `B`, stack vẫn còn `[A, B]`"], correct: 0 },
      { q: "Cho `stack = [\"map\", \"key\"]`. Dòng nào xem `key` nhưng vẫn giữ nguyên cả hai phần tử?", a: ["`print(stack[-1])`", "`print(stack.pop())`", "`print(stack[0])`"], correct: 0 },
    ] } },
    { npc: "Stack có thể đảo thứ tự vì phần tử được thêm cuối cùng sẽ được lấy ra đầu tiên. Bạn hãy hoàn thiện cỗ máy đọc ngược ba tín hiệu." },
    { code: `signals = ["red", "green", "blue"]
stack = []

for signal in signals:
    stack.append(signal)

# Lấy và in các phần tử cho tới khi stack rỗng.
`, label: "reverse_with_stack.py", note: "XƯỞNG PHÉP\nCho sẵn ba tín hiệu; không có INPUT. PROCESS: dùng stack để lấy tín hiệu theo thứ tự vào sau, ra trước. OUTPUT là `blue`, `green`, `red`, mỗi từ trên một dòng.", expectOut: { all: [{ minLines: 3 }, /^blue$/, /^green$/, /^red$/] }, solution: `signals = ["red", "green", "blue"]
stack = []

for signal in signals:
    stack.append(signal)

while stack:
    print(stack.pop())
` },
    { checkpoint: { text: "Khi bài toán luôn cần phần tử mới thêm gần đây nhất, stack là cấu trúc phù hợp. Việc chỉ push và pop ở đỉnh giữ đúng thứ tự vào sau, ra trước." } },
    { quiz: { title: "Chọn stack cho tình huống mới", questions: [
      { q: "Một trình chỉnh sửa cần mở lại thao tác vừa bị đóng gần đây nhất trước các thao tác cũ hơn. Cách xử lý nào phù hợp?", a: ["Push mỗi thao tác vào stack và pop thao tác trên đỉnh", "Luôn lấy thao tác ở đầu list", "Dùng set để xóa thứ tự thao tác"], correct: 0 },
    ] } },
  ],
});
