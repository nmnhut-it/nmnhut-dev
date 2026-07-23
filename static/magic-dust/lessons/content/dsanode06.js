import { dsaNode } from "./dsa-builders.js";

export default dsaNode(6, {
  subtitle: "thêm ở cuối và xử lý người đến trước bằng chỉ số head",
  machineName: "VÉ HÀNG ĐỢI",
  machineBlurb: "giữ thứ tự vào trước, ra trước mà không phải xóa đầu list",
  cells: [
    { quiz: { title: "Ôn stack", questions: [
      { q: "Stack nhận `A`, rồi `B`, rồi `C`. Khi pop hai lần, thứ tự lấy ra là gì?", a: ["`C`, rồi `B`", "`A`, rồi `B`", "`B`, rồi `C`"], correct: 0 },
      { q: "Khi kiểm tra chuỗi ngoặc, gặp dấu `]` nhưng đỉnh stack là `(`. Kết luận nào đúng?", a: ["Chuỗi không cân bằng vì hai dấu không khớp", "Chuỗi cân bằng vì đều là dấu ngoặc", "Push thêm dấu `]` vào stack"], correct: 0 },
    ] } },
    { npc: "Stack ưu tiên thứ mới nhất, nhưng hàng chờ hỗ trợ phải phục vụ người đến trước. Queue giữ thứ tự vào trước, ra trước, còn gọi là FIFO." },
    { npc: "Trong bài này, queue dùng một list và biến `head`. Enqueue dùng `append()` để thêm cuối. Dequeue đọc `queue[head]` rồi tăng `head`; phần đang chờ nằm từ `head` tới cuối list." },
    { code: `queue = []
head = 0

queue.append("An")
queue.append("Binh")
queue.append("Chi")

print("SERVE", queue[head])
head = head + 1
print("SERVE", queue[head])
head = head + 1
print("WAITING", len(queue) - head)
`, label: "queue_head.py", note: "RUN KIỂM CHỨNG\nCho sẵn queue rỗng; không có INPUT. PROCESS: enqueue ba tên, phục vụ hai người bằng `head` rồi tính số người còn chờ. OUTPUT là `SERVE An`, `SERVE Binh`, `WAITING 1`.", expectOut: { all: [{ minLines: 3 }, /^SERVE An$/, /^SERVE Binh$/, /^WAITING 1$/] }, solution: `queue = []
head = 0

queue.append("An")
queue.append("Binh")
queue.append("Chi")

print("SERVE", queue[head])
head = head + 1
print("SERVE", queue[head])
head = head + 1
print("WAITING", len(queue) - head)
` },
    { npc: "Nếu quên tăng `head`, chương trình sẽ phục vụ cùng một người nhiều lần. Mỗi lần dequeue thành công phải chuyển `head` sang vị trí kế tiếp." },
    { code: `queue = ["An", "Binh", "Chi"]
head = 0

print(queue[head])
print(queue[head])
`, label: "advance_head_fix.py", note: "ĐỀ BÀI\nCho sẵn queue ba tên; không có INPUT. Đoạn code hiện in `An` hai lần. Sửa bằng cách cập nhật `head` sau lần phục vụ đầu. OUTPUT đúng là `An` rồi `Binh`.", expectOut: { all: [{ minLines: 2 }, /^An$/, /^Binh$/] }, solution: `queue = ["An", "Binh", "Chi"]
head = 0

print(queue[head])
head = head + 1
print(queue[head])
` },
    { checkpoint: { text: "Queue xử lý theo thứ tự vào trước, ra trước. Với list và `head`, enqueue dùng `append(value)`; dequeue đọc `queue[head]` rồi tăng `head`. Queue còn phần tử khi `head < len(queue)`." } },
    { quiz: { title: "Lần theo hàng đợi", questions: [
      { q: "Cho `queue = [\"A\", \"B\", \"C\"]` và `head = 1`. Người kế tiếp được phục vụ và số người còn chờ là gì?", a: ["`B` và 2 người", "`A` và 3 người", "`C` và 1 người"], correct: 0 },
      { q: "Queue đang có `head = 2`, `len(queue) = 2`. Điều kiện nào cho biết không còn ai chờ?", a: ["`head == len(queue)`", "`head < len(queue)`", "`head == 0`"], correct: 0 },
    ] } },
    { npc: "Khi đang xử lý hàng đợi, yêu cầu mới vẫn có thể được append vào cuối. Vòng lặp tiếp tục cho tới khi `head` bắt kịp độ dài list." },
    { code: `queue = ["print-map", "send-letter"]
head = 0

queue.append("open-gate")

# In và xử lý mọi yêu cầu theo thứ tự đến.
`, label: "process_queue.py", note: "XƯỞNG PHÉP\nCho sẵn hai yêu cầu và một yêu cầu được enqueue thêm; không có INPUT. PROCESS: dùng `head` để xử lý toàn bộ queue theo FIFO. OUTPUT là `print-map`, `send-letter`, `open-gate`, mỗi yêu cầu trên một dòng.", expectOut: { all: [{ minLines: 3 }, /^print-map$/, /^send-letter$/, /^open-gate$/] }, solution: `queue = ["print-map", "send-letter"]
head = 0

queue.append("open-gate")

while head < len(queue):
    print(queue[head])
    head = head + 1
` },
    { checkpoint: { text: "Stack và queue khác nhau ở phần tử được lấy trước: stack lấy phần tử mới nhất, queue lấy phần tử đến sớm nhất. Hãy chọn theo thứ tự xử lý mà bài toán yêu cầu." } },
    { quiz: { title: "Chọn đúng thứ tự xử lý", questions: [
      { q: "Máy in phải xử lý tài liệu theo đúng thứ tự người dùng gửi: tài liệu gửi trước được in trước. Cấu trúc nào phù hợp?", a: ["Queue với FIFO", "Stack với vào sau ra trước", "Set không giữ thứ tự gửi"], correct: 0 },
      { q: "Nút Undo phải lấy thay đổi mới nhất; quầy vé phải phục vụ người đến sớm nhất. Chọn cách cất dữ liệu đáp ứng cả hai yêu cầu.", a: ["Undo dùng stack; quầy vé dùng queue", "Undo dùng queue; quầy vé dùng stack", "Cả hai đều dùng set"], correct: 0 },
    ] } },
  ],
});
