import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ ĐÀI TÌM KIẾM ✦", hook: "Một cách kiểm tra từng vị trí. Một cách loại bỏ nửa vùng còn lại sau mỗi lần so sánh. Bạn sẽ đo cả kết quả lẫn số việc máy làm.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn chuỗi liên kết", questions: [
    { q: "Cho `head = \"A\"`, `A.next = \"B\"`, `B.next = None`. Muốn bỏ qua `B` và kết thúc ngay sau `A`, cần gán gì?", a: ["`A.next = None`", "`head = \"B\"`", "`B.next = \"A\"`"], correct: 0 },
  ] } },
  { npc: "Linear search kiểm tra từng phần tử từ đầu list. Binary search cần dữ liệu đã sắp xếp; nó so với phần tử giữa rồi loại bỏ nửa không thể chứa mục tiêu. Cả hai trả index hoặc `-1`." },
  { code: `values = [3, 8, 12, 17, 21]
target = 17
found_index = -1
comparison_count = 0

for index in range(len(values)):
    comparison_count += 1
    if values[index] == target:
        found_index = index
        break

print(found_index)
print(comparison_count)
`, label: "linear_search_demo.py", note: "RUN KIỂM CHỨNG\nList đã sắp xếp và `target = 17` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: linear search từ index 0 và đếm mỗi lần so sánh. OUTPUT là index `3`, rồi số lần so sánh `4`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^4$/] }, solution: `values = [3, 8, 12, 17, 21]
target = 17
found_index = -1
comparison_count = 0

for index in range(len(values)):
    comparison_count += 1
    if values[index] == target:
        found_index = index
        break

print(found_index)
print(comparison_count)
` },
  { npc: "Trong binary search, `left` và `right` bao quanh vùng còn có thể chứa mục tiêu. Nếu giá trị giữa nhỏ hơn mục tiêu, `left` phải chuyển sang bên phải của `middle`; chuyển nhầm biên sẽ bỏ mất vùng cần tìm." },
  { code: `values = [2, 5, 9, 14, 20, 27, 31]
target = 27
left = 0
right = len(values) - 1
found_index = -1
comparison_count = 0

while left <= right:
    middle = (left + right) // 2
    comparison_count += 1
    if values[middle] == target:
        found_index = middle
        break
    elif values[middle] < target:
        right = middle - 1
    else:
        right = middle - 1

print(found_index)
print(comparison_count)
`, label: "binary_search_fix.py", note: "ĐỀ BÀI\nList tăng dần và `target = 27` được cho sẵn; không có INPUT từ ngoài chương trình. Binary search đang cập nhật sai biên khi giá trị giữa nhỏ hơn mục tiêu. Sửa nhánh đó. OUTPUT đúng là index `5`, rồi `2` lần so sánh.", expectOut: { all: [{ minLines: 2 }, /^5$/, /^2$/] }, solution: `values = [2, 5, 9, 14, 20, 27, 31]
target = 27
left = 0
right = len(values) - 1
found_index = -1
comparison_count = 0

while left <= right:
    middle = (left + right) // 2
    comparison_count += 1
    if values[middle] == target:
        found_index = middle
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(found_index)
print(comparison_count)
` },
  { code: `values = [2, 5, 9, 14, 20, 27, 31]
target = 31

linear_count = 0
for value in values:
    linear_count += 1
    if value == target:
        break

left = 0
right = len(values) - 1
binary_count = 0
while left <= right:
    middle = (left + right) // 2
    binary_count += 1
    if values[middle] == target:
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(linear_count)
print(binary_count)
`, label: "search_count_compare.py", note: "RUN SO SÁNH\nList tăng dần và `target = 31` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: tìm cùng một giá trị bằng linear search và binary search, đồng thời đếm số lần so sánh. OUTPUT là `7` rồi `3`.", expectOut: { all: [{ minLines: 2 }, /^7$/, /^3$/] }, solution: `values = [2, 5, 9, 14, 20, 27, 31]
target = 31

linear_count = 0
for value in values:
    linear_count += 1
    if value == target:
        break

left = 0
right = len(values) - 1
binary_count = 0
while left <= right:
    middle = (left + right) // 2
    binary_count += 1
    if values[middle] == target:
        break
    elif values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(linear_count)
print(binary_count)
` },
  { checkpoint: { text: "Linear search dùng được với list bất kỳ và kiểm tra lần lượt. Binary search cần list đã sắp xếp; sau mỗi lần so sánh, `left = middle + 1` hoặc `right = middle - 1` loại bỏ nửa vùng không thể chứa mục tiêu." } },
  { quiz: { title: "Chọn cách tìm và cập nhật biên", questions: [
    { q: "Binary search đang tìm `30` trong list tăng dần. Giá trị tại `middle` là `18`. Cập nhật nào giữ lại đúng vùng còn có thể chứa `30`?", a: ["`left = middle + 1`", "`right = middle - 1`", "Giữ nguyên cả hai biên"], correct: 0 },
    { q: "Danh sách tên `['Mira', 'An', 'Pip']` chưa được sắp xếp. Muốn tìm `An` ngay mà không đổi thứ tự list, cách nào có điều kiện sử dụng phù hợp?", a: ["Linear search", "Binary search", "Chỉ kiểm tra phần tử giữa"], correct: 0 },
  ] } },
];

export default dsaNode(9, { subtitle: "so sánh linear search và binary search bằng số bước", machineName: "LA BÀN TÌM KIẾM", machineBlurb: "tìm index của mục tiêu và ghi lại số lần so sánh", cells });
