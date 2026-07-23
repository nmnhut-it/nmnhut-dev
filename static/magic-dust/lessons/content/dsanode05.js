import { dsaNode } from "./dsa-builders.js";

export default dsaNode(5, {
  subtitle: "lưu lịch sử Undo và kiểm tra các cặp ngoặc bằng stack",
  machineName: "NÚT HOÀN TÁC",
  machineBlurb: "lấy lại thao tác gần nhất và ghép mỗi dấu đóng với dấu mở phù hợp",
  cells: [
    { quiz: { title: "Ôn thao tác stack", questions: [
      { q: "Bắt đầu với stack rỗng, push `map`, push `key`, push `gem`, rồi pop. Phần tử nào được lấy ra?", a: ["`gem`", "`map`", "`key`"], correct: 0 },
      { q: "Cho `stack = [3, 7]`. Muốn xem số 7 mà không xóa nó, dùng biểu thức nào?", a: ["`stack[-1]`", "`stack.pop()`", "`stack[0]`"], correct: 0 },
    ] } },
    { npc: "Undo phải lấy thao tác gần nhất trước. Mỗi khi trạng thái sắp thay đổi, chương trình push trạng thái hiện tại vào stack; khi Undo, chương trình pop trạng thái đó để khôi phục." },
    { npc: "Lịch sử Undo là một ứng dụng trực tiếp của quy tắc vào sau, ra trước. Thao tác mới nhất nằm trên đỉnh nên được khôi phục trước những thao tác cũ." },
    { code: `history = []
text = "A"

history.append(text)
text = text + "B"
history.append(text)
text = text + "C"

print("NOW", text)
text = history.pop()
print("UNDO", text)
text = history.pop()
print("UNDO", text)
`, label: "undo_history.py", note: "RUN KIỂM CHỨNG\nCho sẵn văn bản bắt đầu là `A`; không có INPUT. PROCESS: lưu trạng thái trước hai lần sửa, rồi Undo hai lần bằng stack. OUTPUT là `NOW ABC`, `UNDO AB`, `UNDO A`.", expectOut: { all: [{ minLines: 3 }, /^NOW ABC$/, /^UNDO AB$/, /^UNDO A$/] }, solution: `history = []
text = "A"

history.append(text)
text = text + "B"
history.append(text)
text = text + "C"

print("NOW", text)
text = history.pop()
print("UNDO", text)
text = history.pop()
print("UNDO", text)
` },
    { npc: "Nếu lưu trạng thái sau khi sửa, Undo sẽ lấy lại chính trạng thái đang thấy và dường như không làm gì. Trạng thái cũ phải được push trước khi thay đổi." },
    { code: `history = []
text = "A"

text = text + "B"
history.append(text)

text = history.pop()
print(text)
`, label: "undo_order_fix.py", note: "ĐỀ BÀI\nCho sẵn văn bản `A`; không có INPUT. Lịch sử hiện được lưu sau khi nối `B`. Sửa thứ tự hai dòng để Undo khôi phục trạng thái trước lần sửa. OUTPUT đúng là `A`.", expectOut: /^A$/, solution: `history = []
text = "A"

history.append(text)
text = text + "B"

text = history.pop()
print(text)
` },
    { checkpoint: { text: "Để Undo, push trạng thái hiện tại vào stack trước khi thay đổi. Mỗi lần Undo, pop trạng thái trên đỉnh để khôi phục thay đổi gần nhất trước." } },
    { quiz: { title: "Khôi phục đúng trạng thái", questions: [
      { q: "Văn bản đổi lần lượt từ `A` thành `AB`, rồi `ABC`. Nếu lưu trạng thái cũ trước mỗi lần sửa, Undo một lần phải cho kết quả nào?", a: ["`AB`", "`A`", "`ABC`"], correct: 0 },
      { q: "Chương trình muốn Undo phép đổi `score` từ 5 thành 8. Thứ tự nào đúng?", a: ["Push 5 vào history, gán score = 8, rồi khi Undo thì pop", "Gán score = 8 rồi chỉ push 8", "Xóa history trước khi Undo"], correct: 0 },
    ] } },
    { npc: "Stack còn kiểm tra ngoặc cân bằng. Gặp dấu mở thì push; gặp dấu đóng thì nó phải khớp với dấu mở trên đỉnh. Cuối cùng stack phải rỗng." },
    { code: `text = "([{}])"
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
`, label: "balanced_brackets.py", note: "XƯỞNG PHÉP\nCho sẵn chuỗi `([{}])`; không có INPUT. PROCESS: dùng stack ghép từng dấu đóng với dấu mở gần nhất, rồi kiểm tra không còn dấu mở. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `text = "([{}])"
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
    { checkpoint: { text: "Chuỗi ngoặc cân bằng khi mỗi dấu đóng khớp với dấu mở trên đỉnh stack, không có dấu đóng xuất hiện lúc stack rỗng và không còn dấu mở nào sau khi đọc hết chuỗi." } },
    { quiz: { title: "Ghép ngoặc theo thứ tự", questions: [
      { q: "Khi kiểm tra chuỗi `([)]`, tới dấu `)` thì đỉnh stack đang là `[`. Chương trình phải kết luận gì?", a: ["Không cân bằng, vì `)` không khớp với `[`", "Cân bằng, vì số dấu mở bằng số dấu đóng", "Bỏ qua dấu `)` và đọc tiếp"], correct: 0 },
      { q: "Chuỗi `((` không có dấu đóng sai loại, nhưng sau khi đọc hết stack còn hai dấu `(`. Kết luận đúng là gì?", a: ["Không cân bằng vì vẫn còn dấu mở", "Cân bằng vì không gặp dấu đóng", "Cân bằng nếu stack có hai phần tử"], correct: 0 },
    ] } },
  ],
});
