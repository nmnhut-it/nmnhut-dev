import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ XƯỞNG DỰNG BẢNG ✦", hook: "Thay vì đọc một grid có sẵn, bạn sẽ tạo một grid mới. Công thức dùng `row_index` và `column_index` để tính giá trị cho từng ô.", art: "assets/future-machine.webp" } },
  { npc: "Mỗi lượt của vòng ngoài tạo `new_row = []`. Vòng trong tính một giá trị cho từng cột và thêm vào hàng mới. Khi hàng đã đủ ô, máy thêm cả hàng vào `grid`." },
  { code: `from old_computer import say

grid = []
for row_index in range(2):
    new_row = []
    for column_index in range(3):
        new_row.append(row_index + column_index)
    grid.append(new_row)
say(grid)
`, label: "math6_build_grid_demo.py", note: "RUN KIỂM CHỨNG\nKhông có INPUT. PROCESS: tạo 2 hàng, mỗi hàng có 3 giá trị `row_index + column_index`. OUTPUT là `[[0, 1, 2], [1, 2, 3]]`.", expectOut: /^\[\[0, 1, 2\], \[1, 2, 3\]\]$/, solution: `from old_computer import say

grid = []
for row_index in range(2):
    new_row = []
    for column_index in range(3):
        new_row.append(row_index + column_index)
    grid.append(new_row)
say(grid)
` },
  { code: `from old_computer import say

grid = []
new_row = []
for row_index in range(2):
    for column_index in range(2):
        new_row.append(row_index * 2 + column_index)
    grid.append(new_row)
say(grid)
`, label: "math6_build_grid_fix.py", note: "ĐỀ BÀI\nMỗi hàng cần một list riêng. Chuyển `new_row = []` vào đầu vòng ngoài để OUTPUT là `[[0, 1], [2, 3]]`.", expectOut: /^\[\[0, 1\], \[2, 3\]\]$/, solution: `from old_computer import say

grid = []
for row_index in range(2):
    new_row = []
    for column_index in range(2):
        new_row.append(row_index * 2 + column_index)
    grid.append(new_row)
say(grid)
` },
  { checkpoint: { text: "Dựng grid: tạo `grid = []`; mỗi lượt vòng ngoài tạo một `new_row = []`; vòng trong thêm các giá trị vào hàng; sau vòng trong, thêm `new_row` vào `grid`." } },
  { quiz: { title: "Tạo hàng mới đúng lúc", questions: [{ q: "Muốn tạo grid có 3 hàng tách biệt, dòng `new_row = []` phải chạy khi nào?", a: ["Một lần trước cả hai vòng", "Ở đầu mỗi lượt của vòng ngoài", "Sau khi đã thêm hàng vào grid"], correct: 1 }] } },
  { code: `from old_computer import say

grid = []
# Tạo grid 3 × 3; mỗi ô giữ (row_index + 1) * (column_index + 1).
say(grid)
`, label: "math6_multiplication_grid_apply.py", note: "ĐỀ BÀI\nKhông có INPUT. Tạo bảng nhân 3 × 3 bằng công thức cho sẵn. OUTPUT là `[[1, 2, 3], [2, 4, 6], [3, 6, 9]]`.", expectOut: /^\[\[1, 2, 3\], \[2, 4, 6\], \[3, 6, 9\]\]$/, solution: `from old_computer import say

grid = []
for row_index in range(3):
    new_row = []
    for column_index in range(3):
        new_row.append((row_index + 1) * (column_index + 1))
    grid.append(new_row)
say(grid)
` },
  { remember: "Mỗi lượt của vòng ngoài phải tạo lại `new_row = []`. Nếu không, `new_row` vẫn chứa các giá trị đã thêm cho hàng trước, nên hàng sau không bắt đầu từ một list rỗng." },
];
export default math6Lesson(16, { subtitle: "tạo từng hàng và từng ô của một grid mới", machineName: "MÁY ĐÚC GRID", machineBlurb: "tạo grid mới từ công thức dùng index hàng và index cột", cells });
