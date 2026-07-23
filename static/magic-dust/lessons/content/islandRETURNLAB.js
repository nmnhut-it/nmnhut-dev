// Bonus practice after node19. This side island only reuses functions,
// parameters, return values, variables, conditions, and say().
export default {
  index: -1,
  sideIslandId: "islandRETURNLAB",
  title: "Xưởng Hàm Trả Kết Quả",
  subtitle: "luyện đưa giá trị về chỗ gọi hàm, lưu lại và dùng tiếp",
  bundle: { art: "assets/rookie-bundle.webp", name: "BỘ DỤNG CỤ RETURN" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY THỬ KẾT QUẢ",
    blurb: "một bàn thử để kiểm tra giá trị được trả về, được lưu ở đâu và được dùng tiếp như thế nào",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ XƯỞNG HÀM TRẢ KẾT QUẢ ✦",
        hook: "Ở xưởng này, mỗi hàm phải giao đúng kết quả về chỗ đã gọi nó. Bạn sẽ sửa bốn đoạn code ngắn rồi kiểm tra kết quả bằng OUTPUT.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Mình bắt đầu từ việc rõ nhất: hàm tính xong phải dùng `return` để đưa giá trị về chỗ gọi. Sau đó biến ở bên ngoài mới giữ được kết quả ấy.",
    },
    {
      code: `from old_computer import say_num

def add_points(score, bonus):
    total = score + bonus
    # Viết dòng return ở đây

result = add_points(7, 5)
say_num(result)
`,
      label: "return_total.py",
      note: "ĐỀ BÀI\nCho sẵn `score = 7` và `bonus = 5` qua hai đối số; không có INPUT từ ngoài chương trình. Trong hàm, cộng hai giá trị rồi dùng `return` để đưa `total` về chỗ gọi. OUTPUT đúng là 12.",
      expectOut: /^12$/,
      solution: `from old_computer import say_num

def add_points(score, bonus):
    total = score + bonus
    return total

result = add_points(7, 5)
say_num(result)
`,
    },
    {
      checkpoint: {
        text: "Trong hàm, `return value` đưa `value` về chỗ gọi. Dòng `result = add_points(7, 5)` gán giá trị được trả về vào biến `result`.",
      },
    },
    {
      quiz: {
        title: "Giá trị đi về đâu?",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef triple(number):\n    return number * 3\n\nscore = triple(4)\n```\nSau khi chương trình chạy, `score` giữ giá trị nào?",
            a: ["12", "4", "None"],
            correct: 0,
          },
          {
            q: "Một hàm tính `total = price + fee` nhưng chỗ gọi đang nhận `None`. Dòng nào cần có trong hàm để chỗ gọi nhận giá trị đã tính?",
            a: ["`return total`", "`say_num(total)`", "`total = None`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "`return` không tự tạo OUTPUT. Hàm có thể giao một chuỗi về chỗ gọi, còn `say()` ở bên ngoài mới làm chuỗi đó xuất hiện trên màn hình.",
    },
    {
      code: `from old_computer import say

def make_label(name):
    return "[" + name + "]"

label = make_label("PIP")
# Thêm một lệnh để tạo OUTPUT
`,
      label: "show_returned_label.py",
      note: "ĐỀ BÀI\nCho sẵn tên `PIP`; không có INPUT từ ngoài chương trình. Hàm đã ghép và trả về chuỗi `[PIP]`. Thêm một lệnh `say(...)` ở bên ngoài hàm để OUTPUT hiện đúng `[PIP]`.",
      expectOut: /^\[PIP\]$/,
      solution: `from old_computer import say

def make_label(name):
    return "[" + name + "]"

label = make_label("PIP")
say(label)
`,
    },
    {
      checkpoint: {
        text: "`return value` giao giá trị cho chỗ gọi hàm. `say(value)` tạo OUTPUT nhìn thấy trên màn hình. Hai lệnh này làm hai việc khác nhau.",
      },
    },
    {
      quiz: {
        title: "Return và OUTPUT",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef make_word():\n    return \"KOTO\"\n\nword = make_word()\n```\nChương trình không gọi `say()`. OUTPUT có gì?",
            a: ["Không có dòng nào", "KOTO", "None"],
            correct: 0,
          },
          {
            q: "Hàm `make_word()` trả về `\"KOTO\"`. Cặp dòng nào vừa lưu kết quả vừa tạo OUTPUT?",
            a: ["`word = make_word()` rồi `say(word)`", "`say = make_word()` rồi `return word`", "`word = return()` rồi `say(make_word)`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Một kết quả đã được trả về có thể tham gia phép tính tiếp theo. Mỗi lần gọi hàm dùng đối số của lần đó để tạo một kết quả riêng.",
    },
    {
      code: `from old_computer import say_num

def double(number):
    # Viết dòng return để tính số gấp đôi

first = double(4)
second = double(6)
total = first + second

say_num(first)
say_num(second)
say_num(total)
`,
      label: "reuse_two_results.py",
      note: "ĐỀ BÀI\nCho sẵn hai số 4 và 6; không có INPUT từ ngoài chương trình. Viết một dòng `return` để mỗi lời gọi nhận số gấp đôi đối số. Sau đó chương trình cộng hai kết quả. OUTPUT phải gồm ba dòng: 8, 12, rồi 20.",
      expectOut: { all: [{ minLines: 3 }, /^8$/, /^12$/, /^20$/] },
      solution: `from old_computer import say_num

def double(number):
    return number * 2

first = double(4)
second = double(6)
total = first + second

say_num(first)
say_num(second)
say_num(total)
`,
    },
    {
      checkpoint: {
        text: "Giá trị được trả về có thể gán vào biến rồi dùng trong phép tính khác. Hai lời gọi `double(4)` và `double(6)` chạy cùng một hàm nhưng tạo hai kết quả khác nhau.",
      },
    },
    {
      quiz: {
        title: "Dùng kết quả để tính tiếp",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef add_one(number):\n    return number + 1\n\na = add_one(3)\nb = add_one(8)\nsay_num(a + b)\n```\nOUTPUT là gì?",
            a: ["13", "11", "9"],
            correct: 0,
          },
          {
            q: "Một chương trình cần tính giá sau giảm rồi cộng phí giao hàng. Cách nào cho phép dùng kết quả của hàm trong phép cộng tiếp theo?",
            a: ["Hàm `return` giá đã giảm, rồi chỗ gọi lưu giá trị đó", "Hàm chỉ `say()` giá đã giảm", "Hàm đổi tên tham số thành `output`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "`return` cũng có thể nằm trong các nhánh điều kiện. Nhánh nào chạy thì nhánh đó đưa kết quả phù hợp về chỗ gọi.",
    },
    {
      code: `from old_computer import say

def status_for(points):
    if points >= 8:
        return "SANG"
    elif points >= 5:
        return "SANG"  # Sửa kết quả của nhánh này
    else:
        return "LUYEN"

say(status_for(6))
`,
      label: "return_from_branch.py",
      note: "ĐỀ BÀI\nCho sẵn `points = 6` khi gọi hàm; không có INPUT từ ngoài chương trình. Hàm kiểm tra lần lượt các mốc điểm. Sửa giá trị được trả về trong nhánh `elif` để điểm từ 5 đến 7 tạo OUTPUT là `SAN SANG`.",
      expectOut: /^SAN SANG$/,
      solution: `from old_computer import say

def status_for(points):
    if points >= 8:
        return "SANG"
    elif points >= 5:
        return "SAN SANG"
    else:
        return "LUYEN"

say(status_for(6))
`,
    },
    {
      checkpoint: {
        text: "Một hàm có thể `return` ở nhiều nhánh. Với một lần gọi, điều kiện chọn nhánh nào thì giá trị của nhánh đó được đưa về chỗ gọi.",
      },
    },
    {
      quiz: {
        title: "Return trong nhánh điều kiện",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef size_for(score):\n    if score >= 10:\n        return \"BIG\"\n    else:\n        return \"SMALL\"\n\nsay(size_for(7))\n```\nOUTPUT là gì?",
            a: ["SMALL", "BIG", "7"],
            correct: 0,
          },
          {
            q: "Hàm cần trả `\"PASS\"` khi `score >= 5`, còn lại trả `\"TRY\"`. Với `score = 5`, nhánh đúng phải trả giá trị nào?",
            a: ["PASS", "TRY", "None"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "`return` đưa một giá trị về chỗ gọi hàm. Chỗ gọi có thể lưu giá trị trong biến, dùng nó trong phép tính tiếp theo hoặc truyền nó cho `say()` để tạo OUTPUT.",
    },
  ],
};
