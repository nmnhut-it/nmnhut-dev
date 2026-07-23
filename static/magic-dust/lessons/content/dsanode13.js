import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ KHÓA GHÉP HAI DÃY ✦", hook: "Hai list đã tăng dần có thể ghép thành một list tăng dần mà không cần tìm lại từ đầu. Mỗi lần, máy chỉ nhìn hai giá trị đang chờ.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn recursion", questions: [
    { q: "Hàm `walk(step)` gọi `walk(step - 1)`. Nếu bắt đầu với `step = 3`, điều kiện nào là base case phù hợp để hàm dừng?", a: ["`step == 0`", "`step == 4`", "`step < 10`"], correct: 0 },
  ] } },
  { npc: "Merge nhận hai list đã sắp xếp. Hai index chỉ vào phần tử chưa dùng; máy thêm giá trị nhỏ hơn vào `result` và tăng index tương ứng. Khi một list hết, máy thêm phần còn lại của list kia." },
  { code: `left = [1, 4, 8]
right = [2, 3, 9]
result = []
left_index = 0
right_index = 0

while left_index < len(left) and right_index < len(right):
    if left[left_index] <= right[right_index]:
        result.append(left[left_index])
        left_index += 1
    else:
        result.append(right[right_index])
        right_index += 1

result = result + left[left_index:]
result = result + right[right_index:]
print(result)
`, label: "merge_sorted_demo.py", note: "RUN KIỂM CHỨNG\nHai list tăng dần `[1, 4, 8]` và `[2, 3, 9]` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: merge bằng hai index và giữ thứ tự tăng dần. OUTPUT đúng là `[1, 2, 3, 4, 8, 9]`.", expectOut: /^\[1, 2, 3, 4, 8, 9\]$/, solution: `left = [1, 4, 8]
right = [2, 3, 9]
result = []
left_index = 0
right_index = 0

while left_index < len(left) and right_index < len(right):
    if left[left_index] <= right[right_index]:
        result.append(left[left_index])
        left_index += 1
    else:
        result.append(right[right_index])
        right_index += 1

result = result + left[left_index:]
result = result + right[right_index:]
print(result)
` },
  { npc: "Vòng `while` đầu dừng ngay khi một list đã hết. Nếu không thêm phần còn lại, kết quả có thể vẫn tăng dần nhưng bị mất dữ liệu ở cuối; OUTPUT đúng phải giữ đủ mọi phần tử." },
  { code: `left = [1, 4, 6]
right = [2, 3]
result = []
left_index = 0
right_index = 0

while left_index < len(left) and right_index < len(right):
    if left[left_index] <= right[right_index]:
        result.append(left[left_index])
        left_index += 1
    else:
        result.append(right[right_index])
        right_index += 1

print(result)
`, label: "merge_remainder_fix.py", note: "ĐỀ BÀI\nHai list tăng dần được cho sẵn; không có INPUT từ ngoài chương trình. Đoạn merge đang mất giá trị còn lại sau khi list `right` hết. Hoàn thiện kết quả để OUTPUT là `[1, 2, 3, 4, 6]`.", expectOut: /^\[1, 2, 3, 4, 6\]$/, solution: `left = [1, 4, 6]
right = [2, 3]
result = []
left_index = 0
right_index = 0

while left_index < len(left) and right_index < len(right):
    if left[left_index] <= right[right_index]:
        result.append(left[left_index])
        left_index += 1
    else:
        result.append(right[right_index])
        right_index += 1

result = result + left[left_index:]
result = result + right[right_index:]
print(result)
` },
  { code: `def merge_sorted(left, right):
    result = []
    left_index = 0
    right_index = 0
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1
    result = result + left[left_index:]
    result = result + right[right_index:]
    return result

print(merge_sorted([1, 3, 3], [2, 3, 5]))
`, label: "merge_keep_duplicates.py", note: "RUN TRƯỜNG HỢP KHÓ\nHai list tăng dần có ba giá trị bằng 3 được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: merge và giữ nguyên mọi lần xuất hiện của giá trị trùng. OUTPUT đúng là `[1, 2, 3, 3, 3, 5]`.", expectOut: /^\[1, 2, 3, 3, 3, 5\]$/, solution: `def merge_sorted(left, right):
    result = []
    left_index = 0
    right_index = 0
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            result.append(left[left_index])
            left_index += 1
        else:
            result.append(right[right_index])
            right_index += 1
    result = result + left[left_index:]
    result = result + right[right_index:]
    return result

print(merge_sorted([1, 3, 3], [2, 3, 5]))
` },
  { checkpoint: { text: "Merge cần hai list đã sắp xếp. Hai index theo dõi phần tử chưa dùng; mỗi lượt thêm giá trị nhỏ hơn, rồi sau vòng lặp phải thêm toàn bộ phần còn lại của cả hai list." } },
  { quiz: { title: "Chọn giá trị tiếp theo khi merge", questions: [
    { q: "Đang merge `left = [2, 7]` và `right = [3, 5]`; hai index đều ở 0. Giá trị nào được thêm vào `result` trước?", a: ["2", "3", "5"], correct: 0 },
    { q: "Sau khi merge, `result = [1, 2, 4]`, list trái đã hết nhưng list phải còn `[6, 9]`. Kết quả đầy đủ phải là gì?", a: ["`[1, 2, 4, 6, 9]`", "`[1, 2, 4]`", "`[6, 9, 1, 2, 4]`"], correct: 0 },
  ] } },
];

export default dsaNode(13, { subtitle: "ghép hai list tăng dần bằng hai index", machineName: "KHÓA GHÉP ĐÔI", machineBlurb: "chọn giá trị nhỏ hơn đang chờ và giữ lại toàn bộ dữ liệu", cells });
