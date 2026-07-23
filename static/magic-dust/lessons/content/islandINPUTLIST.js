// islandINPUTLIST.js - bonus side-island after list scan patterns. Teaches how
// to collect real input into a list with append(), then scan that list.
export default {
  index: -1,
  sideIslandId: "islandINPUTLIST",
  title: "ĐẢO NHẬP LIST",
  subtitle: "tạo list rỗng, đọc nhiều input, append vào list, rồi quét lại",
  bundle: { art: "assets/future-packet.webp", name: "TÚI GOM DỮ LIỆU" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY GOM LIST",
    blurb: "một trạm phụ để biến nhiều dòng input thành một list rõ ràng",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO NHẬP LIST ✦",
        hook: "Bạn đã đọc được list cho sẵn và quét list. Nhưng đề thi thật hay bắt mình nhập nhiều số trước. Đảo này dạy cách gom từng số vừa nhập vào một list bằng `append()`.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "List rỗng viết là `scores = []`. Mỗi lần có một giá trị mới, `scores.append(x)` thêm `x` vào cuối list. Nghĩa là list dài thêm một ô.",
    },
    {
      quiz: {
        title: "Thêm vào cuối list",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\nscores = []\nscores.append(4)\nscores.append(7)\n```\nSau hai dòng `append`, `scores` là gì?",
            a: ["[4, 7]", "[7, 4]", "[]"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say, say_num

scores = []
scores.append(4)
scores.append(7)

say(scores)
say_num(len(scores))
`,
      label: "append_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: 4 và 7. Không có INPUT từ ngoài chương trình.\nPROCESS: bắt đầu bằng list rỗng `[]`, rồi dùng `append` để thêm từng số vào cuối.\nOUTPUT là list `[4, 7]`, sau đó là độ dài 2.",
      expectOut: { all: [/^\[4, 7\]$/, /^2$/] },
      solution: `from old_computer import say, say_num

scores = []
scores.append(4)
scores.append(7)

say(scores)
say_num(len(scores))
`,
    },
    {
      code: `from old_computer import say

scores = []
first = 5
second = 8

# Đến lượt của bạn: thêm first và second vào cuối list.
scores = [first]
say(scores)
`,
      label: "append_two_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `first = 5`, `second = 8`. Không có INPUT từ ngoài chương trình.\nPROCESS đúng: bắt đầu từ `scores = []`, rồi gọi `scores.append(first)` và `scores.append(second)`.\nOUTPUT đúng là `[5, 8]`.",
      expectOut: /^\[5, 8\]$/,
      solution: `from old_computer import say

scores = []
first = 5
second = 8

scores.append(first)
scores.append(second)
say(scores)
`,
    },
    {
      checkpoint: {
        text: "`a = []` tạo list rỗng. `a.append(x)` thêm giá trị `x` vào cuối list, làm list dài thêm một ô.",
      },
    },
    {
      quiz: {
        title: "List rỗng và append",
        questions: [
          {
            q: "`a = []`; chạy `a.append(3)` rồi `a.append(9)`. List `a` thành gì?",
            a: ["[3, 9]", "[9, 3]", "[3]"],
            correct: 0,
          },
          {
            q: "Muốn thêm giá trị trong biến `x` vào cuối list `a`, dòng nào đúng?",
            a: ["`a.append(x)`", "`x.append(a)`", "`a = x`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ ghép với INPUT thật. Mỗi vòng lặp đọc một số bằng `read_num()`, cất vào biến `score`, rồi append `score` vào list.",
    },
    {
      code: `from old_computer import read_num, say

scores = []

for i in range(3):
    score = read_num("Điểm: ")
    scores.append(score)

say(scores)
`,
      label: "input_three_scores_demo.py",
      note: "ĐỀ BÀI\nINPUT thật: vòng lặp đọc 3 điểm từ người dùng.\nPROCESS: mỗi điểm vừa đọc nằm trong `score`, rồi `scores.append(score)` thêm điểm đó vào list.\nVới input mẫu 4, 5, 6, OUTPUT đúng là `[4, 5, 6]`.",
      sampleInput: ["4", "5", "6"],
      expectOut: /^\[4, 5, 6\]$/,
      solution: `from old_computer import read_num, say

scores = []

for i in range(3):
    score = read_num("Điểm: ")
    scores.append(score)

say(scores)
`,
    },
    {
      code: `from old_computer import read_num, say

numbers = []

for i in range(3):
    number = read_num("Số: ")
    numbers = [number]      # Đến lượt của bạn: dòng này đang tạo lại list mỗi vòng.

say(numbers)
`,
      label: "input_list_overwrite_fix.py",
      note: "ĐỀ BÀI\nINPUT thật: vòng lặp đọc 3 số.\nPROCESS đúng: mỗi số đọc được phải được thêm vào cuối `numbers` bằng `numbers.append(number)`.\nVới input mẫu 2, 3, 4, OUTPUT đúng là `[2, 3, 4]`.",
      sampleInput: ["2", "3", "4"],
      expectOut: /^\[2, 3, 4\]$/,
      solution: `from old_computer import read_num, say

numbers = []

for i in range(3):
    number = read_num("Số: ")
    numbers.append(number)

say(numbers)
`,
    },
    {
      checkpoint: {
        text: "Khi đọc nhiều input vào list, tạo list rỗng trước vòng lặp. Bên trong mỗi vòng: đọc một giá trị, rồi gọi `a.append(value)`.",
      },
    },
    {
      quiz: {
        title: "Đọc rồi append trong vòng lặp",
        questions: [
          {
            q: "Trong mẫu nhập 3 điểm, vì sao `scores = []` phải đặt trước vòng lặp?",
            a: ["Để list không bị tạo lại từ đầu ở mỗi vòng", "Để `read_num()` tự cộng điểm", "Để máy không cần INPUT"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\nnumbers = []\nfor i in range(2):\n    x = read_num(\"x: \")\n    numbers.append(x)\n```\nNếu input là 8 rồi 9, `numbers` thành gì?",
            a: ["[8, 9]", "[9]", "[]"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Sau khi đã có list, mình quét list giống node trước: cộng tổng, đếm, hoặc tìm lớn nhất. Điểm mới là list này do INPUT tạo ra, không phải viết sẵn trong code.",
    },
    {
      code: `from old_computer import read_num, say_num

n = read_num("Có bao nhiêu số? ")
numbers = []

for i in range(n):
    number = read_num("Số: ")
    numbers.append(number)

total = 0
for number in numbers:
    total = total + number

say_num(total)
`,
      label: "input_list_sum_demo.py",
      note: "ĐỀ BÀI\nINPUT thật: số đầu là `n`, sau đó có `n` số cần gom vào list.\nPROCESS: append từng số vào `numbers`, rồi quét `numbers` để tính tổng.\nVới input mẫu 3, 4, 5, 6, OUTPUT đúng là 15.",
      sampleInput: ["3", "4", "5", "6"],
      expectOut: /^15$/,
      solution: `from old_computer import read_num, say_num

n = read_num("Có bao nhiêu số? ")
numbers = []

for i in range(n):
    number = read_num("Số: ")
    numbers.append(number)

total = 0
for number in numbers:
    total = total + number

say_num(total)
`,
    },
    {
      code: `from old_computer import read_num, say_num

n = read_num("Có bao nhiêu điểm? ")
scores = []

for i in range(n):
    score = read_num("Điểm: ")
    scores.append(score)

total = 0
for score in scores:
    total = total + score

# Đến lượt của bạn: in điểm trung bình.
say_num(total)
`,
      label: "input_list_average_fix.py",
      note: "ĐỀ BÀI\nINPUT thật: số đầu là `n`, sau đó có `n` điểm.\nPROCESS đúng: gom điểm vào `scores`, tính `total`, rồi lấy trung bình bằng `total / len(scores)`.\nVới input mẫu 4, 6, 8, 10, 12, OUTPUT đúng là 9.",
      sampleInput: ["4", "6", "8", "10", "12"],
      expectOut: /^9(\.0)?$/,
      solution: `from old_computer import read_num, say_num

n = read_num("Có bao nhiêu điểm? ")
scores = []

for i in range(n):
    score = read_num("Điểm: ")
    scores.append(score)

total = 0
for score in scores:
    total = total + score

say_num(total / len(scores))
`,
    },
    {
      checkpoint: {
        text: "Mẫu đầy đủ: đọc `n`, tạo list rỗng, lặp `n` lần để `append` từng input, rồi quét list vừa tạo để tính kết quả.",
      },
    },
    {
      quiz: {
        title: "Gom input rồi quét",
        questions: [
          {
            q: "Input là 3, rồi 2, 5, 7. Nếu số đầu là `n`, list dữ liệu sau khi append đủ là gì?",
            a: ["[2, 5, 7]", "[3, 2, 5, 7]", "[7]"],
            correct: 0,
          },
          {
            q: "Sau khi đã có `scores = [6, 8, 10, 12]` và `total = 36`, dòng nào in trung bình?",
            a: ["`say_num(total / len(scores))`", "`say_num(len(scores) / total)`", "`say_num(total + len(scores))`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Khi đề yêu cầu nhập nhiều giá trị rồi xử lý cả nhóm, hãy tạo list rỗng trước: `a = []`. Mỗi lần đọc một input, dùng `a.append(value)`. Sau đó quét list để cộng tổng, đếm, tìm lớn nhất, hoặc tính trung bình.",
    },
  ],
};
