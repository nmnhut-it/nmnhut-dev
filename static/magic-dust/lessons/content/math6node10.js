import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ ĐÀI DỮ LIỆU ✦", hook: "Đài quan sát có một list số liệu nhưng chưa biết tổng, trung bình hay giá trị lớn nhất. Bạn sẽ quét từng giá trị để tạo các kết quả đó.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn biến cộng dồn", questions: [
    { q: "Cho `values = [2, 5, 1]` và `total = 0`. Sau vòng lặp cộng từng `value` vào `total`, kết quả là bao nhiêu?", a: ["5", "8", "3"], correct: 1 },
  ] } },
  { npc: "Vòng `for` lấy lần lượt từng số trong list, từ trái sang phải. Bài này gọi thao tác đó là quét list. Với list không rỗng, trung bình bằng tổng chia cho số lượng." },
  { npc: "Khi tìm số lớn nhất trong `[12, 5, 18, 9]`, đặt `best = 12`. Gặp 5 thì giữ 12; gặp 18 thì gán lại `best = 18`; gặp 9 thì tiếp tục giữ 18." },
  { code: `from old_computer import say_num

values = [6, 8, 7, 9]
total = 0

for value in values:
    total = total + value

average = total / len(values)
say_num(total)
say_num(average)
`, label: "math6_data_average_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn bốn số liệu; không có INPUT. PROCESS: cộng toàn bộ list rồi chia cho số phần tử. OUTPUT gồm `30` rồi `7.5`.", expectOut: { all: [{ minLines: 2 }, /^30$/, /^7\.5$/] }, solution: `from old_computer import say_num

values = [6, 8, 7, 9]
total = 0

for value in values:
    total = total + value

average = total / len(values)
say_num(total)
say_num(average)
` },
  { code: `from old_computer import say_num

values = [12, 5, 18, 9]
best = 0

for value in values:
    if value < best:
        best = value

say_num(best)
`, label: "math6_data_max_fix.py", note: "ĐỀ BÀI\nCho sẵn list `[12, 5, 18, 9]`; không có INPUT. Bài cần tìm giá trị lớn nhất. Sửa giá trị bắt đầu và dấu so sánh. OUTPUT đúng là `18`.", expectOut: /^18$/, solution: `from old_computer import say_num

values = [12, 5, 18, 9]
best = values[0]

for value in values:
    if value > best:
        best = value

say_num(best)
` },
  { checkpoint: { text: "Với list không rỗng, trung bình là `total / len(values)` sau khi cộng mọi giá trị. Tìm lớn nhất bắt đầu từ `values[0]` rồi gán lại khi gặp `value > best`." } },
  { quiz: { title: "Đọc kết quả thống kê", questions: [
    { q: "Dãy `[4, 6, 8]` có tổng 18 và có 3 giá trị. Trung bình là bao nhiêu?", a: ["18", "3.0", "6.0"], correct: 2 },
    { q: "Khi tìm lớn nhất trong list có thể chứa số âm, vì sao nên bắt đầu bằng `best = values[0]` thay vì `best = 0`?", a: ["Vì mọi số trong list có thể nhỏ hơn 0", "Vì index 0 luôn là số lớn nhất", "Vì `best` không được nhận số 0"], correct: 0 },
  ] } },
  { code: `from old_computer import say_num

values = [7, 10, 5, 10, 8]
target = 10
count = 0

for value in values:
    if value == target:
        count = count + 1

say_num(count)
`, label: "math6_data_count_apply.py", note: "RUN KIỂM CHỨNG\nCho sẵn list điểm và mốc `target = 10`; không có INPUT. PROCESS: đếm các giá trị bằng mốc. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `from old_computer import say_num

values = [7, 10, 5, 10, 8]
target = 10
count = 0

for value in values:
    if value == target:
        count = count + 1

say_num(count)
` },
  { remember: "Quét list giúp biến dữ liệu thô thành thông tin: tổng và trung bình cho mức chung, giá trị lớn nhất cho mốc cao nhất, biến đếm cho biết một điều kiện xuất hiện bao nhiêu lần." },
];

export default math6Lesson(10, { subtitle: "tính tổng, trung bình, giá trị lớn nhất và số lần xuất hiện trong list", machineName: "MÁY TÓM TẮT DỮ LIỆU", machineBlurb: "quét một dãy số rồi tạo các kết quả thống kê dễ kiểm tra", cells });
