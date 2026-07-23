import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐẢO SO SÁNH HÀNG ✦", hook: "Mỗi hàng có một tổng riêng. Bạn sẽ tính tổng từng hàng rồi so với `best_total` để tìm hàng có tổng lớn nhất.", art: "assets/old-computer.webp" } },
  { npc: "Bài luôn cho grid không rỗng. `best_total` giữ tổng lớn nhất đã gặp; `best_row` giữ index của chính hàng có tổng nằm trong `best_total`." },
  { code: `from old_computer import say_num

grid = [[2, 3], [7, 1], [4, 2]]
best_total = 0
best_row = 0
for row_index in range(len(grid)):
    row_total = 0
    for value in grid[row_index]:
        row_total = row_total + value
    if row_total > best_total:
        best_total = row_total
        best_row = row_index
say_num(best_row)
say_num(best_total)
`, label: "math6_best_row_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn grid; không có INPUT. Tổng các hàng là 5, 8, 6. OUTPUT là index hàng `1` rồi tổng `8`.", expectOut: { all: [{ minLines: 2 }, /^1$/, /^8$/] }, solution: `from old_computer import say_num

grid = [[2, 3], [7, 1], [4, 2]]
best_total = 0
best_row = 0
for row_index in range(len(grid)):
    row_total = 0
    for value in grid[row_index]:
        row_total = row_total + value
    if row_total > best_total:
        best_total = row_total
        best_row = row_index
say_num(best_row)
say_num(best_total)
` },
  { code: `from old_computer import say_num

grid = [[5, 5], [8, 4], [7, 1]]
best_total = 0
best_row = 0
for row_index in range(len(grid)):
    row_total = 0
    for value in grid[row_index]:
        row_total = row_total + value
    if row_total < best_total:
        best_total = row_total
        best_row = row_index
say_num(best_row)
say_num(best_total)
`, label: "math6_best_row_fix.py", note: "ĐỀ BÀI\nBài cần hàng có tổng lớn nhất. Sửa dấu so sánh để OUTPUT là index `1` rồi tổng `12`.", expectOut: { all: [{ minLines: 2 }, /^1$/, /^12$/] }, solution: `from old_computer import say_num

grid = [[5, 5], [8, 4], [7, 1]]
best_total = 0
best_row = 0
for row_index in range(len(grid)):
    row_total = 0
    for value in grid[row_index]:
        row_total = row_total + value
    if row_total > best_total:
        best_total = row_total
        best_row = row_index
say_num(best_row)
say_num(best_total)
` },
  { checkpoint: { text: "Tìm hàng có tổng lớn nhất: tính `row_total` cho từng hàng. Khi `row_total > best_total`, gán `best_total = row_total` và `best_row = row_index` trong cùng khối `if`." } },
  { quiz: { title: "Giữ đúng hàng và tổng", questions: [{ q: "Grid có tổng các hàng lần lượt là 4, 9, 6. Kết quả `(best_row, best_total)` là gì?", a: ["(9, 1)", "(2, 6)", "(1, 9)"], correct: 2 }] } },
  { code: `from old_computer import say_num

grid = [[3, 2, 1], [4, 4, 4], [9, 0, 1]]
# Tìm index hàng có tổng lớn nhất và chính tổng đó.
`, label: "math6_best_row_apply.py", note: "ĐỀ BÀI\nCho sẵn grid; không có INPUT. Tổng các hàng là 6, 12, 10. OUTPUT phải là index `1` rồi `12`.", expectOut: { all: [{ minLines: 2 }, /^1$/, /^12$/] }, solution: `from old_computer import say_num

grid = [[3, 2, 1], [4, 4, 4], [9, 0, 1]]
best_total = 0
best_row = 0
for row_index in range(len(grid)):
    row_total = 0
    for value in grid[row_index]:
        row_total = row_total + value
    if row_total > best_total:
        best_total = row_total
        best_row = row_index
say_num(best_row)
say_num(best_total)
` },
  { remember: "Mỗi khi gặp một tổng lớn hơn, hãy gán lại cả tổng lớn nhất và index của hàng tạo ra tổng đó trong cùng một khối `if`." },
];
export default math6Lesson(15, { subtitle: "tính tổng từng hàng rồi giữ hàng có tổng lớn nhất", machineName: "MÁY SO HÀNG", machineBlurb: "giữ đồng thời index hàng và tổng của hàng đó", cells });
