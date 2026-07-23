import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐẢO GƯƠNG PIXEL ✦", hook: "Những hình trên đảo được ghép từ các ô 0 và 1. Bạn sẽ đọc từng hàng, so hai phía của trục giữa và hoàn thiện hình đối xứng.", art: "assets/future-machine.webp" } },
  { quiz: { title: "Ôn hàng và cột", questions: [
    { q: "Cho `grid = [[1, 0, 1], [0, 1, 0]]`. Giá trị `grid[1][0]` là gì?", a: ["1", "[0, 1, 0]", "0"], correct: 2 },
  ] } },
  { npc: "Mỗi `row` là một hàng ba ô: `row[0]` là ô trái, `row[1]` là ô giữa và `row[2]` là ô phải." },
  { npc: "Hàng đối xứng qua ô giữa khi ô trái bằng ô phải. Ví dụ, `[1, 0, 1]` đối xứng; `[1, 0, 0]` không đối xứng vì hai ô ngoài khác nhau." },
  { code: `from old_computer import say_num

grid = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 1, 1]
]

symmetric_rows = 0

for row in grid:
    if row[0] == row[2]:
        symmetric_rows = symmetric_rows + 1

say_num(symmetric_rows)
`, label: "math6_symmetry_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn grid ba hàng; không có INPUT. PROCESS: mỗi hàng so ô cột 0 với ô cột 2. OUTPUT đúng là `3` hàng đối xứng.", expectOut: /^3$/, solution: `from old_computer import say_num

grid = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 1, 1]
]

symmetric_rows = 0

for row in grid:
    if row[0] == row[2]:
        symmetric_rows = symmetric_rows + 1

say_num(symmetric_rows)
` },
  { code: `from old_computer import say_num

grid = [
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
]

for row in grid:
    row[1] = row[0]

say_num(grid[0][2])
say_num(grid[1][2])
say_num(grid[2][2])
`, label: "math6_symmetry_fix.py", note: "ĐỀ BÀI\nCho sẵn một grid có ba cột; không có INPUT. Ở mỗi hàng, hãy gán giá trị của ô trái `row[0]` cho ô phải `row[2]` để hình đối xứng qua cột giữa. Ví dụ, hàng `[1, 0, 0]` sẽ thành `[1, 0, 1]`. OUTPUT đúng gồm `1, 0, 1`.", expectOut: { all: [{ minLines: 3 }, /^1$/, /^0$/, /^1$/] }, solution: `from old_computer import say_num

grid = [
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1]
]

for row in grid:
    row[2] = row[0]

say_num(grid[0][2])
say_num(grid[1][2])
say_num(grid[2][2])
` },
  { checkpoint: { text: "Với grid ba cột có trục ở cột 1, mỗi hàng đối xứng khi `row[0] == row[2]`. Có thể hoàn thiện phía phải bằng `row[2] = row[0]`." } },
  { quiz: { title: "Đối xứng qua cột giữa", questions: [
    { q: "Hàng nào đối xứng qua ô giữa?", a: ["`[1, 0, 0]`", "`[1, 0, 1]`", "`[0, 1, 1]`"], correct: 1 },
    { q: "Trong grid ba cột, dòng nào chép giá trị bên trái sang đúng ô bên phải của mỗi hàng?", a: ["`row[2] = row[0]`", "`row[0] = row[1]`", "`row[1] = row[2]`"], correct: 0 },
  ] } },
  { code: `from old_computer import say_num

grid = [
    [1, 0, 0],
    [0, 1, 0],
    [1, 0, 0]
]

for row in grid:
    row[2] = row[0]

passed = 0
for row in grid:
    if row[0] == row[2]:
        passed = passed + 1

say_num(passed)
`, label: "math6_symmetry_apply.py", note: "RUN KIỂM CHỨNG\nCho sẵn nửa trái của grid ba cột; không có INPUT. PROCESS: hoàn thiện phía phải rồi đếm số hàng đối xứng qua cột giữa. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `from old_computer import say_num

grid = [
    [1, 0, 0],
    [0, 1, 0],
    [1, 0, 0]
]

for row in grid:
    row[2] = row[0]

passed = 0
for row in grid:
    if row[0] == row[2]:
        passed = passed + 1

say_num(passed)
` },
  { remember: "Đối xứng trên grid trở thành phép kiểm tra ô cụ thể: mỗi hàng lấy dữ liệu từ cột bên trái, đặt vào cột tương ứng bên phải, rồi so hai ô để kiểm chứng." },
];

export default math6Lesson(11, { subtitle: "đọc grid và hoàn thiện hình đối xứng qua cột giữa", machineName: "MÁY GƯƠNG PIXEL", machineBlurb: "so từng cặp ô hai phía và bổ sung phần còn thiếu của hình", cells });
