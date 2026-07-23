import { dsaIsland } from "./dsa-builders.js";
import { makePracticeCells } from "./dsa-practice-builders.js";

const tasks = [
  { code: `values = []

if len(values) == 0:
    print("EMPTY")
else:
    print(values[0])
`, label: "dsa_edge_empty_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list rỗng; không có INPUT. PROCESS: kiểm tra số phần tử trước khi đọc index 0. OUTPUT đúng là `EMPTY`.", expectOut: /^EMPTY$/, solution: `values = []

if len(values) == 0:
    print("EMPTY")
else:
    print(values[0])
` },
  { code: `values = [4, 7, 9]
last = 0

for index in range(len(values) - 1):
    last = values[index]

print(last)
`, label: "dsa_edge_last_fix.py", note: "ĐỀ BÀI\nCho sẵn list `[4, 7, 9]`; không có INPUT. PROCESS: sửa khoảng chạy để vòng lặp đọc cả phần tử cuối. OUTPUT đúng là `9`.", expectOut: /^9$/, solution: `values = [4, 7, 9]
last = 0

for index in range(len(values)):
    last = values[index]

print(last)
` },
  { code: `values = [8, 3, 3, 6]
target = 3
position = -1

for index in range(len(values)):
    if values[index] == target and position == -1:
        position = index

print(position)
`, label: "dsa_edge_duplicate_first.py", note: "ĐỀ BÀI\nCho sẵn list có hai số 3; không có INPUT. PROCESS: dùng quét list và chỉ ghi vị trí khi chưa tìm thấy trước đó. OUTPUT là index đầu tiên của 3, tức `1`.", expectOut: /^1$/, solution: `values = [8, 3, 3, 6]
target = 3
position = -1

for index in range(len(values)):
    if values[index] == target and position == -1:
        position = index

print(position)
` },
  { code: `def first_or_empty(values):
    if len(values) == 0:
        return "EMPTY"
    return values[0]

tests = [[], [7], [2, 2], [9, 1, 4]]
for values in tests:
    print(first_or_empty(values))
`, label: "dsa_edge_test_suite.py", note: "XƯỞNG KIỂM THỬ\nCho sẵn bốn ca kiểm thử; không có INPUT. PROCESS: chạy cùng một hàm với list rỗng, một phần tử, phần tử trùng và nhiều phần tử. OUTPUT lần lượt là `EMPTY`, `7`, `2`, `9`.", expectOut: { all: [{ minLines: 4 }, /^EMPTY$/, /^7$/, /^2$/, /^9$/] }, solution: `def first_or_empty(values):
    if len(values) == 0:
        return "EMPTY"
    return values[0]

tests = [[], [7], [2, 2], [9, 1, 4]]
for values in tests:
    print(first_or_empty(values))
` },
];

const cells = makePracticeCells({
  introTitle: "✦ BỆNH VIỆN TRƯỜNG HỢP KHÓ ✦", introHook: "Một thuật toán có thể chạy đúng với list quen thuộc nhưng vẫn hỏng khi dữ liệu rỗng, có phần tử trùng hoặc không có mục tiêu. Trạm này giúp bạn tìm những vết nứt đó trước khi chúng gây lỗi.",
  reviewTitle: "Nhận ra ca kiểm thử biên", reviewQuestions: [{ q: "Một hàm đọc `values[0]`. Ca nào dễ làm máy báo lỗi nhất?", a: ["`values = []`", "`values = [5]`", "`values = [5, 8]`"], correct: 0 }],
  definition: "Ca kiểm thử biên dùng dữ liệu sát giới hạn: list rỗng, một phần tử, giá trị trùng hoặc không có mục tiêu. Lời giải phải cho OUTPUT đúng ở cả ca thường lẫn ca biên.", tasks,
  checkpoint: "Trước khi đọc `values[0]`, cần xử lý trường hợp `len(values) == 0`. Khi tìm kiếm, phải quy định rõ cần vị trí đầu tiên, vị trí bất kỳ hay tất cả vị trí trùng.",
  quizTitle: "Chọn test làm lộ lỗi", quizQuestions: [
    { q: "Đoạn code `last = values[len(values) - 1]` cần ca nào để kiểm tra trường hợp không có phần tử?", a: ["`values = []`", "`values = [4]`", "`values = [4, 7]`"], correct: 0 },
    { q: "Một hàm tìm vị trí đầu tiên của 3. List nào kiểm tra được cách hàm xử lý phần tử trùng?", a: ["`[8, 3, 3, 6]`", "`[8, 3, 6]`", "`[8, 6]`"], correct: 0 },
  ], remember: "Mỗi thuật toán cần test bình thường và test biên. Bộ test tối thiểu thường gồm dữ liệu rỗng, một phần tử, giá trị trùng và trường hợp không tìm thấy.",
});

export default dsaIsland("edge-cases", { subtitle: "luyện cách tìm lỗi chỉ xuất hiện ở dữ liệu rỗng, trùng hoặc sát biên", machineName: "MÁY SOI CA KIỂM THỬ", machineBlurb: "chạy cùng một thuật toán trên nhiều dạng dữ liệu để tìm vết nứt", cells });
