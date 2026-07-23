import { dsaTower } from "./dsa-builders.js";
import { makeTowerCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `visits = ["An", "Bo", "An", "Chi"]
unique_visits = visits
print(len(unique_visits))
`, label: "reasoning_01_choose_set.py", note: "TẦNG 1 · CHỌN CẤU TRÚC\nBốn lượt ghé được gán sẵn và `An` xuất hiện hai lần; không có INPUT từ ngoài chương trình. PROCESS: dùng cấu trúc chỉ giữ mỗi tên một lần. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `visits = ["An", "Bo", "An", "Chi"]
unique_visits = set(visits)
print(len(unique_visits))
` },
  { code: `prices = {
    "map": 9,
    "key": 4,
    "lamp": 7
}

print(prices["map"])
`, label: "reasoning_02_dict_lookup.py", note: "TẦNG 2 · TRA BẰNG KHÓA\nDictionary giá được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: tra giá trị bằng khóa của `lamp`. OUTPUT đúng là `7`.", expectOut: /^7$/, solution: `prices = {
    "map": 9,
    "key": 4,
    "lamp": 7
}

print(prices["lamp"])
` },
  { code: `values = [3, 6, 2]
total = 0

for index in range(len(values)):
    total = total + values[index]
    print(index, total)
`, label: "reasoning_03_lan_theo_total.py", note: "TẦNG 3 · LẦN THEO TRẠNG THÁI\nList ba số được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: cộng dồn và in `index total` sau mỗi lượt. OUTPUT là `0 3`, `1 9`, `2 11`.", expectOut: { all: [{ minLines: 3 }, /^0 3$/, /^1 9$/, /^2 11$/] }, solution: `values = [3, 6, 2]
total = 0

for index in range(len(values)):
    total = total + values[index]
    print(index, total)
` },
  { code: `scores = [5, 2, 8, 4]
best = scores[0]

for index in range(len(scores)):
    best = scores[index]
    print(index, best)
`, label: "reasoning_04_best_state_fix.py", note: "TẦNG 4 · SỬA TRẠNG THÁI\nBốn điểm được gán sẵn; không có INPUT từ ngoài chương trình. `best` phải giữ điểm lớn nhất đã đọc nhưng đang bị gán lại ở mọi lượt. Sửa PROCESS để OUTPUT là `0 5`, `1 5`, `2 8`, `3 8`.", expectOut: { all: [{ minLines: 4 }, /^0 5$/, /^1 5$/, /^2 8$/, /^3 8$/] }, solution: `scores = [5, 2, 8, 4]
best = scores[0]

for index in range(len(scores)):
    if scores[index] > best:
        best = scores[index]
    print(index, best)
` },
  { code: `def contains(values, target):
    for value in values:
        if value == target:
            return True
        return False

print(contains([2, 4, 9], 9))
print(contains([], 9))
`, label: "reasoning_05_test_late_match.py", note: "TẦNG 5 · CA KIỂM THỬ KHÓ\nMột list có mục tiêu ở cuối và một list rỗng được gán sẵn; không có INPUT từ ngoài chương trình. Sửa vị trí kết luận không tìm thấy để PROCESS kiểm tra đủ dữ liệu. OUTPUT là `True`, rồi `False`.", expectOut: { all: [{ minLines: 2 }, /^True$/, /^False$/] }, solution: `def contains(values, target):
    for value in values:
        if value == target:
            return True
    return False

print(contains([2, 4, 9], 9))
print(contains([], 9))
` },
  { code: `def access(level):
    if level > 5:
        return "OPEN"
    return "LOCKED"

for level in [4, 5, 6]:
    print(level, access(level))
`, label: "reasoning_06_boundary_fix.py", note: "TẦNG 6 · TEST RANH GIỚI\nLuật là từ level 5 được mở cổng và ba level sát mốc được gán sẵn; không có INPUT từ ngoài chương trình. Sửa điều kiện. OUTPUT là `4 LOCKED`, `5 OPEN`, `6 OPEN`.", expectOut: { all: [{ minLines: 3 }, /^4 LOCKED$/, /^5 OPEN$/, /^6 OPEN$/] }, solution: `def access(level):
    if level >= 5:
        return "OPEN"
    return "LOCKED"

for level in [4, 5, 6]:
    print(level, access(level))
` },
  { code: `values = [4, 7, 1, 9]
target = 1
comparison_count = 0

for value in values:
    if value == target:
        comparison_count = comparison_count + 1
        break

print(comparison_count)
`, label: "reasoning_07_count_every_compare.py", note: "TẦNG 7 · ĐẾM VIỆC MÁY LÀM\nList và mục tiêu 1 được gán sẵn; không có INPUT từ ngoài chương trình. Bộ đếm phải tăng khi mỗi phép so sánh xảy ra. Sửa PROCESS để OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `values = [4, 7, 1, 9]
target = 1
comparison_count = 0

for value in values:
    comparison_count = comparison_count + 1
    if value == target:
        break

print(comparison_count)
` },
  { code: `for size in [3, 6]:
    pair_count = 0
    for left in range(size):
        for right in range(size):
            pair_count = pair_count + 1
    print(size, pair_count)
`, label: "reasoning_08_growth_compare.py", note: "TẦNG 8 · TỐC ĐỘ TĂNG\nHai kích thước 3 và 6 được gán sẵn; không có INPUT từ ngoài chương trình. PROCESS: đếm số cặp do hai vòng cùng duyệt `size` vị trí. OUTPUT là `3 9`, rồi `6 36`.", expectOut: { all: [{ minLines: 2 }, /^3 9$/, /^6 36$/] }, solution: `for size in [3, 6]:
    pair_count = 0
    for left in range(size):
        for right in range(size):
            pair_count = pair_count + 1
    print(size, pair_count)
` },
];

const cells = makeTowerCells({
  introTitle: "✦ THÁP TƯ DUY THUẬT TOÁN ✦",
  introHook: "Tám tầng sẽ kiểm tra cách chọn nơi cất dữ liệu, lần theo trạng thái, thiết kế test và đo số việc máy làm.",
  reviewTitle: "Mở khóa tầng đầu",
  reviewQuestions: [
    { q: "Một ứng dụng cần lưu thứ tự các lượt bấm, kể cả lượt trùng. Dữ liệu nào phù hợp nhất?", a: ["List các lượt bấm", "Set các lượt bấm", "Một biến chỉ giữ lượt cuối"], correct: 0 },
    { q: "Luật đậu là `score >= 10`. Bộ ba nào kiểm tra sát ranh giới?", a: ["9, 10, 11", "1, 5, 20", "10, 20, 30"], correct: 0 },
  ],
  tasks,
  checkpoint: "Chọn cấu trúc theo thao tác cần làm; ghi trạng thái sau cùng một thời điểm ở mỗi lượt; test cả ca thường, ca biên và ca đặc biệt; tăng bộ đếm đúng lúc thao tác chính xảy ra.",
  quizTitle: "Ghép bốn kỹ năng",
  quizQuestions: [
    { q: "Một hàm tìm số 8 chỉ được thử với `[8, 2, 3]`. Ca nào phát hiện lỗi hàm dừng sau phần tử đầu?", a: ["Tìm 8 trong `[2, 3, 8]` và mong đợi `True`", "Tìm 8 trong `[8]` và mong đợi `True`", "Chạy lại `[8, 2, 3]`"], correct: 0 },
    { q: "Tìm lần lượt 6 trong `[1, 4, 6, 9]` và dừng khi gặp. Nếu đếm mỗi phép so sánh, kết quả là bao nhiêu?", a: ["3", "1", "4"], correct: 0 },
    { q: "Hai vòng lồng nhau đều chạy 5 lượt. Có bao nhiêu cặp thao tác?", a: ["25", "10", "5"], correct: 0 },
  ],
  remember: "Tháp này chỉ ôn bốn quyết định: cất dữ liệu đúng mục đích, lần theo đúng trạng thái, thử dữ liệu có sức phát hiện lỗi và đo đúng thao tác chính.",
});

export default dsaTower("reasoning", { subtitle: "tám tầng chọn dữ liệu, lần theo, kiểm thử và đếm bước", machineName: "ĐỒNG HỒ TƯ DUY", machineBlurb: "kiểm tra từng quyết định trước khi thuật toán được xem là hoàn chỉnh", cells });
