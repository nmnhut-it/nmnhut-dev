import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐÀI ĐẾM Ô ✦", hook: "Đài quan sát cần biết có bao nhiêu ô mang giá trị đạt điều kiện. Hai vòng lặp sẽ đưa từng ô của cả grid vào phép kiểm tra.", art: "assets/old-computer.webp" } },
  { npc: "Đặt `count = 0` trước cả hai vòng lặp. Mỗi khi `value` thỏa điều kiện, máy tăng `count` thêm 1. Không đặt lại `count` khi đổi hàng." },
  { code: `from old_computer import say_num

grid = [[2, 5, 4], [7, 6, 1]]
count = 0
for row in grid:
    for value in row:
        if value % 2 == 0:
            count = count + 1
say_num(count)
`, label: "math6_grid_even_count_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn grid; không có INPUT. PROCESS: kiểm tra mọi ô và đếm số chẵn. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `from old_computer import say_num

grid = [[2, 5, 4], [7, 6, 1]]
count = 0
for row in grid:
    for value in row:
        if value % 2 == 0:
            count = count + 1
say_num(count)
` },
  { code: `from old_computer import say_num

grid = [[8, 3], [6, 9], [2, 7]]
count = 0
for row in grid:
    count = 0
    for value in row:
        if value >= 6:
            count = count + 1
say_num(count)
`, label: "math6_grid_count_fix.py", note: "ĐỀ BÀI\nBài cần đếm trong toàn bộ grid. Dòng đặt lại `count` ở mỗi hàng làm mất kết quả cũ. Bỏ dòng đó để OUTPUT là `4`.", expectOut: /^4$/, solution: `from old_computer import say_num

grid = [[8, 3], [6, 9], [2, 7]]
count = 0
for row in grid:
    for value in row:
        if value >= 6:
            count = count + 1
say_num(count)
` },
  { checkpoint: { text: "Đếm trong cả grid: đặt `count = 0` trước vòng ngoài; duyệt từng hàng rồi từng giá trị; tăng `count` khi điều kiện đúng. Không đặt lại biến đếm khi chuyển hàng." } },
  { quiz: { title: "Đếm trên toàn bảng", questions: [{ q: "Grid `[[1, 6], [8, 3]]` có bao nhiêu giá trị lớn hơn 5?", a: ["1", "4", "2"], correct: 2 }] } },
  { code: `from old_computer import say_num

grid = [[-2, 4, 0], [3, -1, 5]]
# Đếm các giá trị từ 0 trở lên.
`, label: "math6_grid_non_negative_apply.py", note: "ĐỀ BÀI\nCho sẵn grid; không có INPUT. Đếm mọi giá trị từ 0 trở lên. OUTPUT đúng là `4`.", expectOut: /^4$/, solution: `from old_computer import say_num

grid = [[-2, 4, 0], [3, -1, 5]]
count = 0
for row in grid:
    for value in row:
        if value >= 0:
            count = count + 1
say_num(count)
` },
  { remember: "Muốn đếm toàn bảng, chỉ gán `count = 0` một lần trước hai vòng lặp. Khi chuyển sang hàng mới, không gán `count` về 0, để máy giữ số ô đã đếm ở các hàng trước." },
];
export default math6Lesson(14, { subtitle: "quét mọi ô và đếm các giá trị đạt điều kiện", machineName: "MÁY ĐẾM Ô", machineBlurb: "giữ một biến đếm cho toàn bộ grid", cells });
