import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ TRẠM TỔNG TỪNG CỘT ✦", hook: "Muốn cộng một cột, máy giữ nguyên `column_index` rồi cho `row_index` lần lượt chỉ vào từng hàng để đọc `grid[row_index][column_index]`.", art: "assets/old-computer.webp" } },
  { npc: "`row_index` là vị trí hàng và `column_index` là vị trí cột; cả hai đều được đánh số từ 0. Với grid ba cột, `column_index` lần lượt nhận 0, 1, 2." },
  { code: `from old_computer import say_num

grid = [[1, 2, 3], [4, 5, 6]]
for column_index in range(3):
    column_total = 0
    for row_index in range(2):
        column_total = column_total + grid[row_index][column_index]
    say_num(column_total)
`, label: "math6_column_sum_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn grid 2 hàng, 3 cột; không có INPUT. PROCESS: cộng từng cột. OUTPUT là `5`, `7`, `9`.", expectOut: { all: [{ minLines: 3 }, /^5$/, /^7$/, /^9$/] }, solution: `from old_computer import say_num

grid = [[1, 2, 3], [4, 5, 6]]
for column_index in range(3):
    column_total = 0
    for row_index in range(2):
        column_total = column_total + grid[row_index][column_index]
    say_num(column_total)
` },
  { code: `from old_computer import say_num

grid = [[2, 1], [3, 4], [5, 0]]
for column_index in range(2):
    column_total = 0
    for row_index in range(2):
        column_total = column_total + grid[row_index][column_index]
    say_num(column_total)
`, label: "math6_column_sum_fix.py", note: "ĐỀ BÀI\nGrid có 3 hàng, nhưng vòng trong chỉ đọc 2 hàng. Sửa mốc của `range` để OUTPUT là `10` rồi `5`.", expectOut: { all: [{ minLines: 2 }, /^10$/, /^5$/] }, solution: `from old_computer import say_num

grid = [[2, 1], [3, 4], [5, 0]]
for column_index in range(2):
    column_total = 0
    for row_index in range(3):
        column_total = column_total + grid[row_index][column_index]
    say_num(column_total)
` },
  { checkpoint: { text: "Tổng từng cột: vòng ngoài giữ nguyên một `column_index`; đặt `column_total = 0`; vòng trong cho `row_index` đi qua mọi hàng và cộng `grid[row_index][column_index]`." } },
  { quiz: { title: "Giữ cột, đổi hàng", questions: [{ q: "Cho `grid = [[2, 7], [3, 1]]`. Tổng của cột 1 được tính từ những ô nào?", a: ["`grid[0][1]` và `grid[1][1]`", "`grid[1][0]` và `grid[1][1]`", "`grid[0][0]` và `grid[0][1]`"], correct: 0 }] } },
  { code: `from old_computer import say_num

grid = [[4, 1, 2], [0, 3, 5], [6, 2, 1]]
# In tổng của từng cột.
`, label: "math6_column_sum_apply.py", note: "ĐỀ BÀI\nCho sẵn grid 3 × 3; không có INPUT. Dùng hai vòng `for` và đọc từng ô bằng `grid[row_index][column_index]`. OUTPUT là `10`, `6`, `8`.", expectOut: { all: [{ minLines: 3 }, /^10$/, /^6$/, /^8$/] }, solution: `from old_computer import say_num

grid = [[4, 1, 2], [0, 3, 5], [6, 2, 1]]
for column_index in range(3):
    column_total = 0
    for row_index in range(3):
        column_total = column_total + grid[row_index][column_index]
    say_num(column_total)
` },
  { remember: "Cộng theo cột nghĩa là giữ nguyên `column_index`, rồi cho `row_index` lần lượt nhận index của từng hàng để đọc các ô cùng cột." },
];
export default math6Lesson(13, { subtitle: "giữ một cột và cộng ô của cột đó ở mọi hàng", machineName: "MÁY CỘNG CỘT", machineBlurb: "giữ nguyên cột trong khi đi qua các hàng", cells });
