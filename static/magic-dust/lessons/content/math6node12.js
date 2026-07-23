import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ BẾN TỔNG TỪNG HÀNG ✦", hook: "`grid` là một bảng dữ liệu gồm nhiều hàng; mỗi hàng là một list số. Bạn sẽ tính tổng riêng cho từng hàng rồi in kết quả.", art: "assets/old-computer.webp" } },
  { npc: "Vòng `for` bên ngoài lấy từng hàng và đặt cả hàng đó vào `row`. Với hàng hiện tại, vòng `for` thụt vào bên trong lấy lần lượt từng ô và đặt giá trị ô vào `value`." },
  { npc: "Trước khi cộng các ô của hàng mới, máy gán `row_total = 0`. Nhờ vậy, kết quả của hàng trước không bị cộng vào hàng hiện tại." },
  { code: `from old_computer import say_num

grid = [[2, 3, 1], [4, 0, 5]]
for row in grid:
    row_total = 0
    for value in row:
        row_total = row_total + value
    say_num(row_total)
`, label: "math6_row_sum_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn grid hai hàng; không có INPUT. PROCESS: tính tổng riêng cho từng hàng. OUTPUT là `6` rồi `9`.", expectOut: { all: [{ minLines: 2 }, /^6$/, /^9$/] }, solution: `from old_computer import say_num

grid = [[2, 3, 1], [4, 0, 5]]
for row in grid:
    row_total = 0
    for value in row:
        row_total = row_total + value
    say_num(row_total)
` },
  { code: `from old_computer import say_num

grid = [[1, 2], [3, 4]]
row_total = 0
for row in grid:
    for value in row:
        row_total = row_total + value
    say_num(row_total)
`, label: "math6_row_sum_fix.py", note: "ĐỀ BÀI\nCho sẵn grid; không có INPUT. `row_total` chưa được đặt lại khi sang hàng mới. Chuyển dòng khởi tạo vào đúng chỗ để OUTPUT là `3` rồi `7`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^7$/] }, solution: `from old_computer import say_num

grid = [[1, 2], [3, 4]]
for row in grid:
    row_total = 0
    for value in row:
        row_total = row_total + value
    say_num(row_total)
` },
  { checkpoint: { text: "Tổng từng hàng: vòng ngoài lấy một `row`; đặt `row_total = 0` cho hàng đó; vòng trong cộng từng `value`; in tổng trước khi vòng ngoài chuyển sang hàng tiếp theo." } },
  { quiz: { title: "Đặt lại tổng đúng lúc", questions: [{ q: "Cho `grid = [[2, 2], [5, 1]]`. Khi đặt lại `row_total = 0` ở đầu mỗi lượt của vòng ngoài, máy in gì?", a: ["4 rồi 10", "4 rồi 6", "10 rồi 10"], correct: 1 }] } },
  { code: `from old_computer import say_num

grid = [[3, 1, 2], [5, 2, 1], [4, 4, 0]]
# In tổng của từng hàng.
`, label: "math6_row_sum_apply.py", note: "ĐỀ BÀI\nCho sẵn grid ba hàng; không có INPUT. Dùng hai vòng `for` để in tổng từng hàng. OUTPUT là `6`, `8`, `8`.", expectOut: { all: [{ minLines: 3 }, /^6$/, /^8$/, /^8$/] }, solution: `from old_computer import say_num

grid = [[3, 1, 2], [5, 2, 1], [4, 4, 0]]
for row in grid:
    row_total = 0
    for value in row:
        row_total = row_total + value
    say_num(row_total)
` },
  { remember: "Mỗi hàng cần một kết quả riêng, vì vậy biến tổng phải được đặt lại khi vòng ngoài bắt đầu đọc hàng mới." },
];
export default math6Lesson(12, { subtitle: "dùng vòng lặp lồng nhau để tính tổng riêng của mỗi hàng", machineName: "MÁY CỘNG HÀNG", machineBlurb: "đặt lại tổng khi chuyển sang hàng mới", cells });
