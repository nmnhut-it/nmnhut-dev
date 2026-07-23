import { dsaNode } from "./dsa-builders.js";

const mergeFunction = `def merge_sorted(left, right):
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
    return result + left[left_index:] + right[right_index:]
`;

const cells = [
  { intro: { title: "✦ XƯỞNG CHIA RỒI GHÉP ✦", hook: "Một list lớn được chia thành các list rất nhỏ. Khi từng mảnh đã có thứ tự, khóa merge ghép chúng trở lại.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn merge", questions: [
    { q: "Merge hai list tăng dần `[1, 6]` và `[2, 4, 7]` cho kết quả nào?", a: ["`[1, 2, 4, 6, 7]`", "`[1, 6, 2, 4, 7]`", "`[2, 4, 7, 1, 6]`"], correct: 0 },
  ] } },
  { npc: "Merge sort dùng recursion. Base case là list có 0 hoặc 1 phần tử. Trường hợp còn lại chia list thành hai nửa, sắp xếp từng nửa, rồi dùng merge để tạo kết quả tăng dần." },
  { code: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

print(merge_sort([8, 3, 6, 1, 5]))
`, label: "merge_sort_demo.py", note: "RUN KIỂM CHỨNG\nList `[8, 3, 6, 1, 5]` được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: merge sort chia bằng recursion rồi ghép các nửa đã xếp. OUTPUT đúng là `[1, 3, 5, 6, 8]`.", expectOut: /^\[1, 3, 5, 6, 8\]$/, solution: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

print(merge_sort([8, 3, 6, 1, 5]))
` },
  { npc: "Chia xong chưa tạo ra kết quả có thứ tự. Nếu hàm chỉ nối hai nửa, các giá trị ở ranh giới vẫn có thể nằm sai chỗ. Dòng trả kết quả phải merge hai nửa đã xếp." },
  { code: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return left + right

print(merge_sort([7, 2, 6, 1]))
`, label: "merge_sort_return_fix.py", note: "ĐỀ BÀI\nList `[7, 2, 6, 1]` được cho sẵn; không có INPUT từ ngoài chương trình. Hai nửa đã được sắp xếp nhưng dòng `return` chỉ nối chúng lại. Sửa dòng trả kết quả để dùng merge sort đúng. OUTPUT là `[1, 2, 6, 7]`.", expectOut: /^\[1, 2, 6, 7\]$/, solution: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

print(merge_sort([7, 2, 6, 1]))
` },
  { code: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

print(merge_sort([]))
print(merge_sort([4, 1, 4, 2]))
`, label: "merge_sort_edge_cases.py", note: "RUN TRƯỜNG HỢP KHÓ\nMột list rỗng và một list có giá trị trùng được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: dùng cùng hàm merge sort cho cả hai trường hợp. OUTPUT là `[]`, rồi `[1, 2, 4, 4]`.", expectOut: { all: [{ minLines: 2 }, /^\[\]$/, /^\[1, 2, 4, 4\]$/] }, solution: `${mergeFunction}
def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge_sorted(left, right)

print(merge_sort([]))
print(merge_sort([4, 1, 4, 2]))
` },
  { checkpoint: { text: "Merge sort trả ngay list có `len(values) <= 1`. Với list dài hơn, hàm sắp xếp hai nửa bằng recursion rồi trả `merge_sorted(left, right)`; chỉ nối `left + right` không bảo đảm thứ tự toàn list." } },
  { quiz: { title: "Theo dõi chia và ghép", questions: [
    { q: "Merge sort nhận list `[8, 3, 5, 1]`. Sau lần chia đầu tiên, hai nửa là gì?", a: ["`[8, 3]` và `[5, 1]`", "`[8, 5]` và `[3, 1]`", "`[1]` và `[8, 3, 5]`"], correct: 0 },
    { q: "Hai lời gọi recursion đã trả `left = [2, 7]` và `right = [1, 5]`. Dòng nào tạo kết quả tăng dần của bước hiện tại?", a: ["`return merge_sorted(left, right)`", "`return left + right`", "`return values`"], correct: 0 },
  ] } },
];

export default dsaNode(14, { subtitle: "chia list bằng recursion rồi ghép các nửa đã xếp", machineName: "MẢNH GHÉP SẮP XẾP", machineBlurb: "chia dữ liệu tới base case rồi ghép lại theo thứ tự", cells });
