import { dsaTower } from "./dsa-builders.js";
import { makeTowerCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `numbers = [8, 3, 6, 1]
target = 6
found_index = -1

# Hoàn thành phép tìm lần lượt.

print(found_index)
`, label: "TẦNG 1 · linear_search.py", note: "ĐỀ BÀI: Cho sẵn list và `target = 6`; bài không đọc INPUT bên ngoài. PROCESS dùng linear search để tìm index đầu tiên có giá trị bằng `target`. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `numbers = [8, 3, 6, 1]
target = 6
found_index = -1

for index in range(len(numbers)):
    if numbers[index] == target:
        found_index = index
        break

print(found_index)
` },
  { code: `numbers = [2, 5, 8, 11, 14, 17]
target = 14
left = 0
right = len(numbers) - 1
found_index = -1

# Hoàn thành binary search trên list đã sắp xếp.

print(found_index)
`, label: "TẦNG 2 · binary_search.py", note: "ĐỀ BÀI: Cho sẵn list tăng dần và `target = 14`; bài không có INPUT thật. PROCESS dùng binary search và thu hẹp đoạn `left..right`. OUTPUT đúng là index `4`.", expectOut: /^4$/, solution: `numbers = [2, 5, 8, 11, 14, 17]
target = 14
left = 0
right = len(numbers) - 1
found_index = -1

while left <= right:
    middle = (left + right) // 2
    if numbers[middle] == target:
        found_index = middle
        break
    elif numbers[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print(found_index)
` },
  { code: `numbers = [7, 2, 5, 1]

# Sắp xếp numbers bằng selection sort.

print(numbers)
`, label: "TẦNG 3 · selection_sort.py", note: "ĐỀ BÀI: List bốn số đã cho sẵn; không có INPUT từ bên ngoài. PROCESS dùng selection sort để đặt phần tử nhỏ nhất còn lại vào từng vị trí. OUTPUT đúng là `[1, 2, 5, 7]`.", expectOut: /^\[1, 2, 5, 7\]$/, solution: `numbers = [7, 2, 5, 1]

for start in range(len(numbers)):
    min_index = start
    for index in range(start + 1, len(numbers)):
        if numbers[index] < numbers[min_index]:
            min_index = index
    numbers[start], numbers[min_index] = numbers[min_index], numbers[start]

print(numbers)
` },
  { code: `numbers = [3, 8, 5, 6]

# Sắp xếp numbers bằng insertion sort.

print(numbers)
`, label: "TẦNG 4 · insertion_sort.py", note: "ĐỀ BÀI: List đã cho sẵn và hai số đầu đang có thứ tự; bài không đọc INPUT. PROCESS dùng insertion sort để chèn từng giá trị vào phần bên trái đã xếp. OUTPUT đúng là `[3, 5, 6, 8]`.", expectOut: /^\[3, 5, 6, 8\]$/, solution: `numbers = [3, 8, 5, 6]

for index in range(1, len(numbers)):
    current = numbers[index]
    position = index - 1
    while position >= 0 and numbers[position] > current:
        numbers[position + 1] = numbers[position]
        position = position - 1
    numbers[position + 1] = current

print(numbers)
` },
  { code: `numbers = [4, 1, 3, 2]

def recursive_sum(values, index):
    # Hoàn thành hàm với một điểm dừng.
    pass

print(recursive_sum(numbers, 0))
`, label: "TẦNG 5 · recursive_sum.py", note: "ĐỀ BÀI: List và lời gọi hàm đã cho sẵn; không có INPUT thật. PROCESS dùng hàm tự gọi với điểm dừng để tính tổng từ `index` tới cuối list. OUTPUT đúng là `10`.", expectOut: /^10$/, solution: `numbers = [4, 1, 3, 2]

def recursive_sum(values, index):
    if index == len(values):
        return 0
    return values[index] + recursive_sum(values, index + 1)

print(recursive_sum(numbers, 0))
` },
  { code: `left_values = [1, 4, 8]
right_values = [2, 4, 7]
merged = []

# Ghép hai list đã xếp vào merged.

print(merged)
`, label: "TẦNG 6 · merge_lists.py", note: "ĐỀ BÀI: Hai list tăng dần đã cho sẵn; bài không đọc INPUT bên ngoài. PROCESS dùng hai vị trí đang đọc để ghép và giữ cả hai số 4. OUTPUT đúng là `[1, 2, 4, 4, 7, 8]`.", expectOut: /^\[1, 2, 4, 4, 7, 8\]$/, solution: `left_values = [1, 4, 8]
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

while left < len(left_values):
    merged.append(left_values[left])
    left = left + 1
while right < len(right_values):
    merged.append(right_values[right])
    right = right + 1

print(merged)
` },
  { code: `def merge_sort(values):
    # Hoàn thành merge sort.
    pass

numbers = [9, 3, 7, 1, 5]
print(merge_sort(numbers))
`, label: "TẦNG 7 · merge_sort.py", note: "ĐỀ BÀI: Hàm và list năm số đã cho sẵn; không có INPUT thật. PROCESS dùng merge sort với điểm dừng, chia list và ghép hai kết quả đã xếp. OUTPUT đúng là `[1, 3, 5, 7, 9]`.", expectOut: /^\[1, 3, 5, 7, 9\]$/, solution: `def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left_values = merge_sort(values[:middle])
    right_values = merge_sort(values[middle:])
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
    return merged

numbers = [9, 3, 7, 1, 5]
print(merge_sort(numbers))
` },
  { code: `players = [
    ["An", 12],
    ["Binh", 18],
    ["Chi", 12],
    ["Dung", 15]
]
target_score = 12

# Sắp xếp theo điểm rồi in các tên có target_score.
`, label: "TẦNG 8 · ranking_project.py", note: "ĐỀ BÀI: Bảng người chơi và `target_score = 12` đã cho sẵn; không có INPUT bên ngoài. PROCESS sắp xếp theo điểm tăng dần rồi tìm mọi người có điểm bằng mục tiêu. OUTPUT phải là `An` và `Chi`, mỗi tên trên một dòng.", expectOut: { all: [/^An$/m, /^Chi$/m], minLines: 2 }, solution: `players = [
    ["An", 12],
    ["Binh", 18],
    ["Chi", 12],
    ["Dung", 15]
]
target_score = 12

for index in range(1, len(players)):
    current = players[index]
    position = index - 1
    while position >= 0 and players[position][1] > current[1]:
        players[position + 1] = players[position]
        position = position - 1
    players[position + 1] = current

for player in players:
    if player[1] == target_score:
        print(player[0])
` },
];

export default dsaTower("search-sort", {
  subtitle: "tám tầng ôn tìm kiếm, sắp xếp, recursion và merge",
  machineName: "THÁP TÌM KIẾM VÀ SẮP XẾP",
  machineBlurb: "luyện lại cách tìm, xếp và ghép dữ liệu bằng những bài chạy độc lập",
  cells: makeTowerCells({
    introTitle: "THÁP III · TÌM KIẾM VÀ SẮP XẾP",
    introHook: "Tám tầng này chỉ dùng các cơ chế đã học từ binary search tới dự án bảng xếp hạng. Mỗi tầng có dữ liệu riêng và OUTPUT cụ thể để bạn tự kiểm tra.",
    reviewTitle: "Chọn cách tìm phù hợp",
    reviewQuestions: [
      { q: "Cho list chưa sắp xếp `[9, 2, 7, 4]` và cần tìm số 7. Cách nào dùng được ngay mà không chuẩn bị thêm?", a: ["Linear search", "Binary search", "Merge hai list"], correct: 0 },
      { q: "Cho list tăng dần `[2, 5, 8, 11, 14]`. Binary search đang xét 8 và cần tìm 14. Phần nào còn cần giữ?", a: ["Phần bên phải của 8", "Phần bên trái của 8", "Chỉ giữ số 8"], correct: 0 },
    ],
    tasks,
    checkpoint: "Binary search cần dữ liệu đã sắp xếp; selection sort chọn phần tử nhỏ nhất còn lại; insertion sort chèn vào phần đã xếp. Hàm tự gọi cần điểm dừng, còn merge luôn ghép từ hai list đã có thứ tự.",
    quizTitle: "Đọc trạng thái giữa thuật toán",
    quizQuestions: [
      { q: "Insertion sort đang có phần bên trái `[2, 6, 9]` và giá trị mới là 5. Sau khi chèn đúng chỗ, phần này trở thành gì?", a: ["`[2, 5, 6, 9]`", "`[5, 2, 6, 9]`", "`[2, 6, 9, 5]`"], correct: 0 },
      { q: "Khi ghép `[1, 7]` với `[2, 6]`, hai giá trị đang đọc đầu tiên là 1 và 2. Giá trị nào được đưa vào kết quả trước?", a: ["`1`", "`2`", "`7`"], correct: 0 },
    ],
    remember: "Tìm kiếm và sắp xếp không phải một công thức duy nhất. Trước khi viết, hãy kiểm tra dữ liệu đã có thứ tự chưa, kết quả cần một vị trí hay cả list, và mỗi bước có làm phần chưa xử lý nhỏ lại không.",
  }),
});
