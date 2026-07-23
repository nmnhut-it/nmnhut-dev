import { listPracticeIsland } from "./list-practice-builders.js";

const cells = [
  { npc: "Biến `count` không cộng giá trị đang đọc. Mỗi khi một giá trị thỏa điều kiện, máy chỉ tăng `count` thêm 1 để ghi nhận một lần xuất hiện." },
  { code: `from old_computer import say_num

values = [5, 2, 5, 7, 5]
count = 0
for value in values:
    if value == 5:
        count = count + 1

say_num(count)
`, label: "list_count_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list; không có INPUT. PROCESS: tăng `count` khi gặp số 5. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `from old_computer import say_num

values = [5, 2, 5, 7, 5]
count = 0
for value in values:
    if value == 5:
        count = count + 1

say_num(count)
` },
  { code: `from old_computer import say_num

values = [3, 8, 6, 1, 4]
count = 0
for value in values:
    if value < 5:
        count = count + value

say_num(count)
`, label: "list_count_fix.py", note: "ĐỀ BÀI\nBài cần đếm các số nhỏ hơn 5, không tính tổng của chúng. Sửa dòng cập nhật `count`. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `from old_computer import say_num

values = [3, 8, 6, 1, 4]
count = 0
for value in values:
    if value < 5:
        count = count + 1

say_num(count)
` },
  { quiz: { title: "Đếm hay tính tổng", questions: [{ q: "Cho `[2, 6, 4, 7]`. Muốn đếm số chẵn, dòng nào phải chạy khi `value % 2 == 0`?", a: ["`count = count + value`", "`count = value`", "`count = count + 1`"], correct: 2 }] } },
  { code: `from old_computer import say_num

scores = [7, 10, 5, 10, 8]
target = 10
count = 0
# Duyệt scores và đếm các giá trị bằng target.

say_num(count)
`, label: "list_target_count_apply.py", note: "ĐỀ BÀI\nCho sẵn list điểm và `target = 10`; không có INPUT. Dùng `for` và `if` để đếm điểm bằng mốc. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `from old_computer import say_num

scores = [7, 10, 5, 10, 8]
target = 10
count = 0
for score in scores:
    if score == target:
        count = count + 1

say_num(count)
` },
  { checkpoint: { text: "Đếm theo điều kiện: đặt `count = 0`; mỗi khi điều kiện đúng, chạy `count = count + 1`. Tính tổng cộng chính giá trị hiện tại; đếm chỉ cộng thêm một lần." } },
  { quiz: { title: "Đếm giá trị đạt mốc", questions: [{ q: "Cho `[3, 7, 8, 2]`. Nếu tăng `count` khi `value >= 7`, kết quả cuối là gì?", a: ["15", "4", "2"], correct: 2 }] } },
];

export default listPracticeIsland({ id: "islandLISTCOUNT", title: "ĐẢO MÁY ĐẾM", subtitle: "đếm số lần một điều kiện xuất hiện trong list", machineName: "MÁY ĐẾM DẤU", machineBlurb: "ghi thêm một dấu mỗi khi giá trị đạt điều kiện", hook: "Một số viên đá giống nhau đang lẫn trong hàng. Bạn sẽ dùng điều kiện để nhận đúng loại cần tìm và đếm số lần nó xuất hiện.", cells });
