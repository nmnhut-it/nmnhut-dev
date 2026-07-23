import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = [7, 5, 3, 2]
smallest_index = 0

for index in range(1, len(values)):
    if values[index] < values[smallest_index]:
        smallest_index = index

values[0], values[smallest_index] = values[smallest_index], values[0]
print(values)
`, label: "dsa_sort_selection_pass.py", note: "RUN KIỂM CHỨNG\nCho sẵn bốn số; không có INPUT. PROCESS: thực hiện lượt đầu của selection sort bằng cách đưa giá trị nhỏ nhất về index 0. OUTPUT là `[2, 5, 3, 7]`.", expectOut: /^\[2, 5, 3, 7\]$/, solution: `values = [7, 5, 3, 2]
smallest_index = 0

for index in range(1, len(values)):
    if values[index] < values[smallest_index]:
        smallest_index = index

values[0], values[smallest_index] = values[smallest_index], values[0]
print(values)
` },
  { code: `values = [2, 5, 7, 4]
current = values[3]
position = 3

while position > 0 and values[position - 1] < current:
    values[position] = values[position - 1]
    position = position - 1

values[position] = current
print(values)
`, label: "dsa_sort_insertion_fix.py", note: "ĐỀ BÀI\nCho sẵn phần `[2, 5, 7]` đã tăng dần và giá trị mới 4; không có INPUT. Sửa dấu so sánh để chèn 4 vào đúng chỗ. OUTPUT là `[2, 4, 5, 7]`.", expectOut: /^\[2, 4, 5, 7\]$/, solution: `values = [2, 5, 7, 4]
current = values[3]
position = 3

while position > 0 and values[position - 1] > current:
    values[position] = values[position - 1]
    position = position - 1

values[position] = current
print(values)
` },
  { code: `left_values = [1, 4, 4, 9]
right_values = [2, 4, 7]
merged = []
left = 0
right = 0

while left < len(left_values) and right < len(right_values):
    if left_values[left] <= right_values[right]:
        merged.append(left_values[left])
        left = left + 1
    else:
        merged.append(right_values[right])
        right = right + 1

merged.extend(left_values[left:])
merged.extend(right_values[right:])
print(merged)
`, label: "dsa_sort_merge_duplicates.py", note: "ĐỀ BÀI\nCho sẵn hai list đã tăng dần và có giá trị trùng; không có INPUT. PROCESS: ghép bằng hai vị trí đang đọc và giữ đủ bản sao. OUTPUT là `[1, 2, 4, 4, 4, 7, 9]`.", expectOut: /^\[1, 2, 4, 4, 4, 7, 9\]$/, solution: `left_values = [1, 4, 4, 9]
right_values = [2, 4, 7]
merged = []
left = 0
right = 0

while left < len(left_values) and right < len(right_values):
    if left_values[left] <= right_values[right]:
        merged.append(left_values[left])
        left = left + 1
    else:
        merged.append(right_values[right])
        right = right + 1

merged.extend(left_values[left:])
merged.extend(right_values[right:])
print(merged)
` },
  { code: `values = [1, 2, 3, 5, 4]
shift_count = 0

for index in range(1, len(values)):
    current = values[index]
    position = index
    while position > 0 and values[position - 1] > current:
        values[position] = values[position - 1]
        position = position - 1
        shift_count = shift_count + 1
    values[position] = current

print(values)
print(shift_count)
`, label: "dsa_sort_nearly_sorted.py", note: "XƯỞNG SO SÁNH\nCho sẵn list gần có thứ tự; không có INPUT. PROCESS: dùng insertion sort và đếm số lần dịch phần tử. OUTPUT là `[1, 2, 3, 4, 5]` và chỉ `1` lần dịch.", expectOut: { all: [{ minLines: 2 }, /^\[1, 2, 3, 4, 5\]$/, /^1$/] }, solution: `values = [1, 2, 3, 5, 4]
shift_count = 0

for index in range(1, len(values)):
    current = values[index]
    position = index
    while position > 0 and values[position - 1] > current:
        values[position] = values[position - 1]
        position = position - 1
        shift_count = shift_count + 1
    values[position] = current

print(values)
print(shift_count)
` },
];

const cells = makePracticeCells({
  introTitle: "✦ ĐẤU TRƯỜNG SẮP XẾP ✦", introHook: "Cùng một list có thể được sắp xếp bằng nhiều cách. Đấu trường không chỉ kiểm tra kết quả cuối mà còn cho bạn quan sát số lần so sánh, đổi chỗ và dịch dữ liệu.",
  reviewTitle: "Nhận ra cơ chế sắp xếp", reviewQuestions: [{ q: "Cách nào xây phần đã có thứ tự bằng cách chèn từng giá trị mới vào đúng vị trí?", a: ["Insertion sort", "Selection sort", "Binary search"], correct: 0 }],
  definition: "Selection sort chọn giá trị nhỏ nhất còn lại. Insertion sort chèn giá trị mới vào phần đã xếp. Merge sort chia dữ liệu rồi ghép các list đã có thứ tự. Ba cách làm lượng công việc khác nhau.", tasks,
  checkpoint: "Selection sort chọn phần tử nhỏ nhất còn lại. Insertion sort dịch các giá trị lớn hơn để chèn `current`. Merge giữ hai vị trí đọc trên hai list đã có thứ tự.",
  quizTitle: "Chọn cách xếp theo dữ liệu", quizQuestions: [
    { q: "List `[1, 2, 3, 5, 4]` gần có thứ tự. Cách nào thường chỉ cần dịch rất ít phần tử?", a: ["Insertion sort", "Selection sort", "Quét tìm tuyến tính"], correct: 0 },
    { q: "Khi ghép `[1, 6]` và `[2, 5]`, giá trị nào được đưa vào list kết quả ngay sau 1?", a: ["2", "5", "6"], correct: 0 },
  ], remember: "Không chỉ hỏi list đã được xếp đúng chưa. Hãy quan sát dữ liệu ban đầu và đếm công việc: số so sánh, đổi chỗ, dịch phần tử hoặc lượt ghép.",
});

export default dsaIsland("sorting-arena", { subtitle: "so sánh cơ chế và số bước của selection, insertion và merge", machineName: "SÀN ĐẤU SẮP XẾP", machineBlurb: "cho nhiều thuật toán xử lý cùng dữ liệu rồi đối chiếu công việc", cells });
