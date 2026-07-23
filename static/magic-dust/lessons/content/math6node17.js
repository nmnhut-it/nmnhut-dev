import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐẢO GƯƠNG LƯỚI ✦", hook: "Hình có năm cột và trục ở cột giữa. Bạn sẽ chép dữ liệu từ phía trái sang đúng cột tương ứng bên phải rồi kiểm tra từng cặp ô.", art: "assets/future-machine.webp" } },
  { npc: "Trong hàng năm cột, cột 0 tương ứng với cột 4, cột 1 tương ứng với cột 3, còn cột 2 nằm trên trục và được giữ nguyên." },
  { code: `from old_computer import say

grid = [[1, 0, 1, 0, 0], [0, 1, 0, 0, 0]]
for row in grid:
    row[4] = row[0]
    row[3] = row[1]
say(grid)
`, label: "math6_grid_mirror_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn nửa trái và cột giữa; không có INPUT. PROCESS: cột 4 lấy dữ liệu từ cột 0, cột 3 lấy từ cột 1. OUTPUT là grid đối xứng.", expectOut: /^\[\[1, 0, 1, 0, 1\], \[0, 1, 0, 1, 0\]\]$/, solution: `from old_computer import say

grid = [[1, 0, 1, 0, 0], [0, 1, 0, 0, 0]]
for row in grid:
    row[4] = row[0]
    row[3] = row[1]
say(grid)
` },
  { code: `from old_computer import say

grid = [[1, 1, 0, 0, 0]]
for row in grid:
    row[3] = row[0]
    row[4] = row[1]
say(grid)
`, label: "math6_grid_mirror_fix.py", note: "ĐỀ BÀI\nHai phép gán bên phải đang dùng sai cột nguồn. Sửa để `row[4]` nhận giá trị của `row[0]` và `row[3]` nhận giá trị của `row[1]`. OUTPUT là `[[1, 1, 0, 1, 1]]`.", expectOut: /^\[\[1, 1, 0, 1, 1\]\]$/, solution: `from old_computer import say

grid = [[1, 1, 0, 0, 0]]
for row in grid:
    row[4] = row[0]
    row[3] = row[1]
say(grid)
` },
  { checkpoint: { text: "Đối xứng qua cột giữa của hàng năm ô: `row[0] == row[4]` và `row[1] == row[3]`; cột 2 nằm trên trục. Hoàn thiện phía phải bằng `row[4] = row[0]` và `row[3] = row[1]`." } },
  { quiz: { title: "Ghép đúng cặp cột", questions: [{ q: "Trong hàng năm cột đối xứng qua cột 2, cặp cột nào tương ứng với nhau?", a: ["0 với 3; 1 với 4", "0 với 4; 1 với 3", "0 với 2; 3 với 4"], correct: 1 }] } },
  { code: `from old_computer import say_num

grid = [[1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 1, 0, 0, 1]]
passed = 0
# Đếm các hàng đối xứng qua cột 2.
say_num(passed)
`, label: "math6_grid_symmetry_check_apply.py", note: "ĐỀ BÀI\nCho sẵn ba hàng; không có INPUT. Một hàng đối xứng khi `row[0] == row[4]` và `row[1] == row[3]`. Dùng `for` và `and` để đếm. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `from old_computer import say_num

grid = [[1, 0, 1, 0, 1], [0, 1, 0, 1, 0], [1, 1, 0, 0, 1]]
passed = 0
for row in grid:
    if row[0] == row[4] and row[1] == row[3]:
        passed = passed + 1
say_num(passed)
` },
  { remember: "Đối xứng được kiểm tra bằng các cặp ô cách trục giữa một khoảng bằng nhau; ô nằm trên trục không cần chép sang vị trí khác." },
];
export default math6Lesson(17, { subtitle: "hoàn thiện và kiểm tra hình đối xứng trên grid năm cột", machineName: "MÁY GƯƠNG LƯỚI", machineBlurb: "ghép đúng các cột nằm hai phía của trục giữa", cells });
