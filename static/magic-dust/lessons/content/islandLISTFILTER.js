import { listPracticeIsland } from "./list-practice-builders.js";

const cells = [
  { npc: "Lọc list nghĩa là tạo một list kết quả mới và chỉ thêm những giá trị thỏa điều kiện. List ban đầu vẫn được giữ nguyên để máy có thể dùng lại." },
  { code: `from old_computer import say

values = [3, 8, 2, 9, 6]
selected = []
for value in values:
    if value >= 6:
        selected.append(value)

say(selected)
`, label: "list_filter_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list và mốc 6; không có INPUT. PROCESS: chỉ thêm giá trị từ 6 trở lên vào `selected`. OUTPUT là `[8, 9, 6]`.", expectOut: /^\[8, 9, 6\]$/, solution: `from old_computer import say

values = [3, 8, 2, 9, 6]
selected = []
for value in values:
    if value >= 6:
        selected.append(value)

say(selected)
` },
  { code: `from old_computer import say

values = [1, 4, 7, 2, 8]
even_values = []
for value in values:
    if value % 2 == 1:
        even_values.append(value)

say(even_values)
`, label: "list_filter_fix.py", note: "ĐỀ BÀI\nBài cần giữ các số chẵn. Điều kiện hiện chọn số lẻ. Sửa điều kiện để OUTPUT là `[4, 2, 8]`.", expectOut: /^\[4, 2, 8\]$/, solution: `from old_computer import say

values = [1, 4, 7, 2, 8]
even_values = []
for value in values:
    if value % 2 == 0:
        even_values.append(value)

say(even_values)
` },
  { quiz: { title: "List nào bị thay đổi", questions: [{ q: "Đoạn code tạo `selected = []` rồi chỉ gọi `selected.append(value)`. Sau vòng lặp, điều nào đúng?", a: ["List ban đầu bị xóa các giá trị không đạt", "List ban đầu được giữ nguyên; `selected` chứa các giá trị đạt điều kiện", "Hai list luôn giống hệt nhau"], correct: 1 }] } },
  { code: `from old_computer import say

temperatures = [-2, 4, -1, 7, 0]
non_negative = []
# Duyệt temperatures và giữ các giá trị từ 0 trở lên.

say(non_negative)
say(temperatures)
`, label: "list_filter_apply.py", note: "ĐỀ BÀI\nCho sẵn nhiệt độ; không có INPUT. Tạo list mới chỉ chứa giá trị từ 0 trở lên và giữ nguyên list ban đầu. OUTPUT là `[4, 7, 0]` rồi toàn bộ list cũ.", expectOut: { all: [{ minLines: 2 }, /^\[4, 7, 0\]$/, /^\[-2, 4, -1, 7, 0\]$/] }, solution: `from old_computer import say

temperatures = [-2, 4, -1, 7, 0]
non_negative = []
for temperature in temperatures:
    if temperature >= 0:
        non_negative.append(temperature)

say(non_negative)
say(temperatures)
` },
  { checkpoint: { text: "Lọc list: tạo list kết quả rỗng, duyệt từng giá trị, rồi gọi `result.append(value)` bên trong khối `if`. Chỉ list kết quả thay đổi; list ban đầu được giữ nguyên." } },
  { quiz: { title: "Chọn đúng giá trị cần giữ", questions: [{ q: "Cho `[1, 6, 3, 8]`. Nếu chỉ `append(value)` khi `value > 5`, list kết quả là gì?", a: ["`[1, 3]`", "`[1, 6, 3, 8]`", "`[6, 8]`"], correct: 2 }] } },
];

export default listPracticeIsland({ id: "islandLISTFILTER", title: "ĐẢO CHỌN LỌC", subtitle: "tạo list mới chỉ chứa các giá trị thỏa điều kiện", machineName: "MÁY CHỌN GIÁ TRỊ", machineBlurb: "kiểm tra từng giá trị và thêm đúng giá trị cần giữ", hook: "Kho dữ liệu có cả giá trị cần dùng và giá trị không phù hợp. Bạn sẽ tạo một list mới, chỉ thêm các giá trị vượt qua điều kiện kiểm tra.", cells });
