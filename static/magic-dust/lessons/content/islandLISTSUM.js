import { listPracticeIsland } from "./list-practice-builders.js";

const cells = [
  { npc: "Vòng `for` lấy lần lượt từng số trong list. Đặt `total = 0` trước vòng lặp; mỗi lượt dùng `total = total + value` để giữ tổng cũ và cộng thêm số hiện tại." },
  { code: `from old_computer import say_num

values = [3, 5, 2, 4]
total = 0
for value in values:
    total = total + value

say_num(total)
`, label: "list_sum_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list `[3, 5, 2, 4]`; không có INPUT. PROCESS: cộng lần lượt 3, 5, 2, 4 vào `total`. OUTPUT đúng là `14`.", expectOut: /^14$/, solution: `from old_computer import say_num

values = [3, 5, 2, 4]
total = 0
for value in values:
    total = total + value

say_num(total)
` },
  { code: `from old_computer import say_num

values = [6, 1, 8]
total = 0
for value in values:
    total = value

say_num(total)
`, label: "list_sum_fix.py", note: "ĐỀ BÀI\nCho sẵn ba số; không có INPUT. Dòng trong vòng lặp đang ghi đè tổng cũ. Sửa dòng đó để cộng cả list. OUTPUT đúng là `15`.", expectOut: /^15$/, solution: `from old_computer import say_num

values = [6, 1, 8]
total = 0
for value in values:
    total = total + value

say_num(total)
` },
  { quiz: { title: "Theo dõi biến total", questions: [{ q: "Cho `values = [2, 7, 1]`. Nếu `total` bắt đầu bằng 0 và mỗi lượt chạy `total = total + value`, giá trị cuối là bao nhiêu?", a: ["7", "10", "3"], correct: 1 }] } },
  { code: `from old_computer import say_num

values = [4, 7, 2, 9, 6]
total = 0
# Chỉ cộng các số chẵn vào total.

say_num(total)
`, label: "list_even_sum_apply.py", note: "ĐỀ BÀI\nCho sẵn list; không có INPUT. Dùng `for` và `if value % 2 == 0` để chỉ cộng các số chẵn. OUTPUT đúng là `12`.", expectOut: /^12$/, solution: `from old_computer import say_num

values = [4, 7, 2, 9, 6]
total = 0
for value in values:
    if value % 2 == 0:
        total = total + value

say_num(total)
` },
  { checkpoint: { text: "Tính tổng list: đặt `total = 0`, duyệt từng `value`, rồi dùng `total = total + value`. Nếu chỉ cộng một nhóm giá trị, đặt phép cộng bên trong khối `if` mô tả đúng nhóm đó." } },
  { quiz: { title: "Chọn đúng phép cộng", questions: [{ q: "Cho `[1, 4, 6]`. Nếu chỉ cộng các số lớn hơn 3, `total` cuối cùng bằng bao nhiêu?", a: ["11", "10", "2"], correct: 1 }] } },
];

export default listPracticeIsland({ id: "islandLISTSUM", title: "ĐẢO CỘNG DỒN LIST", subtitle: "tính tổng cả list và tổng các giá trị thỏa điều kiện", machineName: "MÁY GOM TỔNG", machineBlurb: "đọc từng số và giữ tổng đã tính được", hook: "Các viên đá mang số đang nằm thành một hàng. Bạn sẽ đọc từng viên và cập nhật một biến để không làm mất phần tổng đã tính trước đó.", cells });
