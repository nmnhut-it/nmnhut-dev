// islandLISTTOOLS.js — bonus side-island for practicing Python's compact list
// tools after learners have seen string index/slice in node17. This island is
// not part of the main NODES trail; island.js owns its completion flag.
export default {
  index: -1,
  sideIslandId: "islandLISTTOOLS",
  title: "ĐẢO DỤNG CỤ LIST",
  subtitle: "đọc, cắt, copy(), thêm nhiều phần tử, lấy/xóa, sắp xếp và tìm trong list",
  bundle: { art: "assets/rookie-bundle.webp", name: "LIST TOOLKIT" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY XẾP TÚI ĐỒ",
    blurb: "một trạm phụ để luyện list như một túi đồ có thể đọc, cắt, thêm, bớt, và đảo thứ tự",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO DỤNG CỤ LIST ✦",
        hook: "Một đảo phụ vừa hiện ra cạnh đường chính. Ở đây không có boss; chỉ có một túi đồ cần xếp lại cho gọn bằng vài công cụ list rất hữu ích.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Bạn vừa dùng negative index và slice với chuỗi. Tin vui: list cũng dùng cùng ý tưởng đó. `a[-1]` lấy phần tử cuối, `a[1:4]` cắt một mảnh list từ index 1 tới trước index 4.",
    },
    {
      quiz: {
        title: "Chuyển từ chuỗi sang list",
        questions: [
          {
            q: "`text = \"KOTOPIA\"`; `text[-1]` lấy ký tự cuối. Vậy `a = [10, 20, 30]`; `a[-1]` lấy gì?",
            a: ["30", "10", "-1"],
            correct: 0,
          },
          {
            q: "`text[0:2]` lấy từ index 0 tới trước index 2. Vậy `a[0:2]` lấy phần nào của `[5, 6, 7]`?",
            a: ["[5, 6]", "[5, 6, 7]", "[6, 7]"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

a = [4, 8, 15, 16]
say_num(a[-1])
say_num(a[-2])
`,
      label: "list_negative_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để đọc list từ cuối: `a[-1]` là phần tử cuối, `a[-2]` là phần tử sát cuối.",
      expectOut: { all: [{ minLines: 2 }, /^16$/, /^15$/] },
      solution: `from old_computer import say_num

a = [4, 8, 15, 16]
say_num(a[-1])
say_num(a[-2])
`,
    },
    {
      code: `from old_computer import say_num

a = [2, 4, 6, 8]
say_num(a[0])      # Sửa để lấy phần tử cuối
say_num(a[1])      # Sửa để lấy phần tử sát cuối
`,
      label: "list_negative_fix.py",
      note: "ĐỀ BÀI\nSửa hai dòng cuối bằng negative index để output lần lượt là 8 rồi 6.",
      expectOut: { all: [{ minLines: 2 }, /^8$/, /^6$/] },
      solution: `from old_computer import say_num

a = [2, 4, 6, 8]
say_num(a[-1])
say_num(a[-2])
`,
    },
    {
      checkpoint: {
        text: "Negative index của list giống chuỗi: `a[-1]` lấy phần tử cuối, `a[-2]` lấy phần tử sát cuối. Nó gọn hơn tự viết `a[len(a) - 1]`.",
      },
    },
    {
      quiz: {
        title: "Phần tử cuối list",
        questions: [
          {
            q: "`a = [3, 6, 9, 12]`. Dòng `say_num(a[-1])` in gì?",
            a: ["12", "3", "9"],
            correct: 0,
          },
          {
            q: "`a = [3, 6, 9, 12]`. Dòng `say_num(a[-2])` in gì?",
            a: ["9", "12", "6"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Slice cũng áp dụng cho list: `a[start:stop]` tạo ra một list mới chứa các phần tử từ `start` tới trước `stop`. Bỏ `start` nghĩa là lấy từ đầu; bỏ `stop` nghĩa là lấy tới cuối.",
    },
    {
      code: `from old_computer import say

a = [1, 2, 3, 4, 5, 6]
say(a[1:4])
say(a[:3])
say(a[-2:])
`,
      label: "list_slice_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để xem list bị cắt thành các list nhỏ hơn.",
      expectOut: { all: [{ minLines: 3 }, /^\[2, 3, 4\]$/, /^\[1, 2, 3\]$/, /^\[5, 6\]$/] },
      solution: `from old_computer import say

a = [1, 2, 3, 4, 5, 6]
say(a[1:4])
say(a[:3])
say(a[-2:])
`,
    },
    {
      code: `from old_computer import say

a = [10, 20, 30, 40, 50]
say(a[1:3])      # Sửa để lấy [30, 40, 50]
`,
      label: "list_slice_fix.py",
      note: "ĐỀ BÀI\nSửa slice để output đúng là `[30, 40, 50]`.",
      expectOut: /^\[30, 40, 50\]$/,
      solution: `from old_computer import say

a = [10, 20, 30, 40, 50]
say(a[2:])
`,
    },
    {
      checkpoint: {
        text: "Slice list dùng cùng mẫu `a[start:stop]`: lấy từ `start` tới trước `stop`. `a[:3]` lấy ba phần tử đầu, `a[2:]` lấy từ index 2 tới cuối, `a[-2:]` lấy hai phần tử cuối.",
      },
    },
    {
      quiz: {
        title: "Cắt list",
        questions: [
          {
            q: "`a = [1, 2, 3, 4]`. Dòng `say(a[1:3])` in gì?",
            a: ["[2, 3]", "[1, 2, 3]", "[3, 4]"],
            correct: 0,
          },
          {
            q: "`a = [1, 2, 3, 4]`. Dòng `say(a[-2:])` in gì?",
            a: ["[3, 4]", "[1, 2]", "[2, 3, 4]"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Hai slice rất hay gặp: `a[:]` tạo một bản copy nông của list, còn `a[::-1]` tạo một list mới theo thứ tự ngược. Đây là phần hơi ảo diệu của Python, nhưng vẫn cùng một ý: lấy một mảnh list theo bước đi đã chọn.",
    },
    {
      code: `from old_computer import say

a = [1, 2, 3]
b = a[:]
b[0] = 9
say(a)
say(b)
say(a[::-1])
`,
      label: "copy_reverse_demo.py",
      note: "RUN KIỂM CHỨNG\n`a[:]` tạo bản copy nên sửa `b[0]` không làm đổi `a`. `a[::-1]` tạo list đảo ngược.",
      expectOut: { all: [{ minLines: 3 }, /^\[1, 2, 3\]$/, /^\[9, 2, 3\]$/, /^\[3, 2, 1\]$/] },
      solution: `from old_computer import say

a = [1, 2, 3]
b = a[:]
b[0] = 9
say(a)
say(b)
say(a[::-1])
`,
    },
    {
      code: `from old_computer import say

a = ["A", "B", "C"]
reversed_a = a
say(reversed_a)      # Sửa để output là ['C', 'B', 'A']
`,
      label: "reverse_slice_fix.py",
      note: "ĐỀ BÀI\nSửa `reversed_a` bằng slice đảo ngược để output đúng là `['C', 'B', 'A']`.",
      expectOut: /^\['C', 'B', 'A'\]$/,
      solution: `from old_computer import say

a = ["A", "B", "C"]
reversed_a = a[::-1]
say(reversed_a)
`,
    },
    {
      checkpoint: {
        text: "`a[:]` copy cả list. `a[::-1]` tạo list mới theo thứ tự ngược. Cả hai đều là slice, chỉ khác ở phần bước đi phía sau dấu hai chấm thứ hai.",
      },
    },
    {
      quiz: {
        title: "Copy và đảo list",
        questions: [
          {
            q: "Dòng nào tạo bản copy của `a`?",
            a: ["`b = a[:]`", "`b = a[-1]`", "`b = a[0]`"],
            correct: 0,
          },
          {
            q: "`a = [1, 2, 3]`. Dòng `say(a[::-1])` in gì?",
            a: ["[3, 2, 1]", "[1, 2, 3]", "[2]"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Cuối đảo là các công cụ làm thay đổi list: `append(x)` thêm vào cuối, `pop()` lấy và xóa phần tử cuối, `insert(i, x)` chèn vào index `i`, `remove(x)` xóa giá trị `x` đầu tiên gặp được.",
    },
    {
      code: `from old_computer import say

bag = ["lua", "bang"]
bag.append("gio")
say(bag)

last = bag.pop()
say(last)
say(bag)
`,
      label: "append_pop_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để thêm một món vào cuối túi, rồi lấy món cuối ra bằng `pop()`.",
      expectOut: { all: [{ minLines: 3 }, /^\['lua', 'bang', 'gio'\]$/, /^gio$/, /^\['lua', 'bang'\]$/] },
      solution: `from old_computer import say

bag = ["lua", "bang"]
bag.append("gio")
say(bag)

last = bag.pop()
say(last)
say(bag)
`,
    },
    {
      npc: "`append(x)` thêm đúng một phần tử; nếu `x` là list, cả list nằm trong một ô mới. `extend(items)` nối từng phần tử vào cuối. `pop(index)` lấy và xóa phần tử ở index đã chọn.",
    },
    {
      code: `from old_computer import say

bag = ["lua"]
bag.append(["bang", "gio"])
say(bag)

bag = ["lua"]
bag.extend(["bang", "gio"])
say(bag)

picked = bag.pop(1)
say(picked)
say(bag)
`,
      label: "append_extend_pop_index_demo.py",
      note: "RUN KIỂM CHỨNG\nHai list đồ được cho sẵn; không có INPUT từ bên ngoài. `append()` thêm cả list vào một ô, còn `extend()` thêm riêng từng món. Sau đó `pop(1)` lấy và xóa phần tử ở index 1. OUTPUT lần lượt cho thấy hai cấu trúc khác nhau, món `bang`, rồi list `['lua', 'gio']`.",
      expectOut: { all: [{ minLines: 4 }, /^\['lua', \['bang', 'gio'\]\]$/, /^\['lua', 'bang', 'gio'\]$/, /^bang$/, /^\['lua', 'gio'\]$/] },
      solution: `from old_computer import say

bag = ["lua"]
bag.append(["bang", "gio"])
say(bag)

bag = ["lua"]
bag.extend(["bang", "gio"])
say(bag)

picked = bag.pop(1)
say(picked)
say(bag)
`,
    },
    {
      code: `from old_computer import say

bag = ["Pip", "Mira"]
bag.append("Bo")          # Sửa để Bo đứng ở index 1
bag.remove("Pip")         # Sửa để xóa Mira
say(bag)
`,
      label: "insert_remove_fix.py",
      note: "ĐỀ BÀI\nSửa hai dòng giữa: chèn Bo vào index 1, rồi xóa Mira. Output phải là `['Pip', 'Bo']`.",
      expectOut: /^\['Pip', 'Bo'\]$/,
      solution: `from old_computer import say

bag = ["Pip", "Mira"]
bag.insert(1, "Bo")
bag.remove("Mira")
say(bag)
`,
    },
    {
      code: `from old_computer import say

bag = ["key", "map", "gem"]
bag.clear()
say(bag)
`,
      label: "clear_list_demo.py",
      note: "RUN KIỂM CHỨNG\nList có ba món được cho sẵn; không có INPUT từ bên ngoài. `clear()` xóa toàn bộ phần tử đang có, nên OUTPUT là list rỗng `[]`.",
      expectOut: /^\[\]$/,
      solution: `from old_computer import say

bag = ["key", "map", "gem"]
bag.clear()
say(bag)
`,
    },
    {
      checkpoint: {
        text: "`append(x)` thêm một phần tử; `extend(items)` nối từng phần tử; `pop()` lấy và xóa phần tử cuối, còn `pop(i)` làm việc đó tại index `i`. `insert(i, x)` chèn, `remove(x)` xóa giá trị đầu tiên, và `clear()` làm list rỗng.",
      },
    },
    {
      quiz: {
        title: "Thêm và xóa list",
        questions: [
          {
            q: "`bag = [\"A\"]`, rồi `bag.append(\"B\")`. Sau đó `bag` là gì?",
            a: ['["A", "B"]', '["B", "A"]', '["A"]'],
            correct: 0,
          },
          {
            q: "`bag = [\"A\", \"B\"]`, rồi `last = bag.pop()`. `last` giữ gì?",
            a: ['"B"', '"A"', '["A", "B"]'],
            correct: 0,
          },
          {
            q: "`bag = [\"A\", \"B\"]`, muốn chèn \"X\" vào giữa thì dùng dòng nào?",
            a: ['`bag.insert(1, "X")`', '`bag.append(1, "X")`', '`bag.remove("X")`'],
            correct: 0,
          },
          {
            q: '`bag = ["A"]`. Sau `bag.extend(["B", "C"])`, `bag` là gì?',
            a: ['`["A", "B", "C"]`', '`["A", ["B", "C"]]`', '`["B", "C", "A"]`'],
            correct: 0,
          },
          {
            q: '`bag = ["A", "B", "C"]`; chạy `picked = bag.pop(1)`. `picked` giữ gì và `bag` còn gì?',
            a: ['`picked` là `"B"`; `bag` là `["A", "C"]`', '`picked` là `"C"`; `bag` là `["A", "B"]`', '`picked` là `1`; `bag` không đổi'],
            correct: 0,
          },
          {
            q: '`bag = ["A", "B"]`. Sau `bag.clear()`, giá trị nào được in bởi `say(bag)`?',
            a: ["`[]`", '`["A"]`', '`["A", "B"]`'],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "List cũng có công cụ soi bên trong: `count(x)` đếm giá trị `x` xuất hiện mấy lần, `index(x)` trả về index đầu tiên của `x`. Nếu không chắc có `x` hay không, hãy dò bằng mẫu tìm kiếm bạn đã học trước khi gọi `index(x)`.",
    },
    {
      code: `from old_computer import say_num

bag = ["key", "gem", "key", "map"]
say_num(bag.count("key"))
say_num(bag.index("map"))
`,
      label: "list_count_index_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để đếm key và tìm index đầu tiên của map trong list.",
      expectOut: { all: [{ minLines: 2 }, /^2$/, /^3$/] },
      solution: `from old_computer import say_num

bag = ["key", "gem", "key", "map"]
say_num(bag.count("key"))
say_num(bag.index("map"))
`,
    },
    {
      npc: "`copy()` tạo một list riêng có cùng phần tử. `sort()` sắp xếp chính list hiện tại theo thứ tự tăng dần hoặc theo bảng chữ cái; `reverse()` đảo thứ tự của chính list đó.",
    },
    {
      code: `from old_computer import say

scores = [8, 3, 5]
backup = scores.copy()

scores.sort()
say(backup)
say(scores)

scores.reverse()
say(scores)
`,
      label: "copy_sort_reverse_demo.py",
      note: "RUN KIỂM CHỨNG\nList điểm được cho sẵn; không có INPUT từ bên ngoài. `copy()` giữ một bản riêng theo thứ tự cũ. `sort()` sắp xếp `scores` tăng dần, rồi `reverse()` đảo thành giảm dần. OUTPUT lần lượt là `[8, 3, 5]`, `[3, 5, 8]`, `[8, 5, 3]`.",
      expectOut: { all: [{ minLines: 3 }, /^\[8, 3, 5\]$/, /^\[3, 5, 8\]$/, /^\[8, 5, 3\]$/] },
      solution: `from old_computer import say

scores = [8, 3, 5]
backup = scores.copy()

scores.sort()
say(backup)
say(scores)

scores.reverse()
say(scores)
`,
    },
    {
      code: `from old_computer import say

scores = [7, 2, 9]
backup = scores             # Sửa để backup là một list riêng
scores.sort()
scores.reverse()

say(backup)
say(scores)
`,
      label: "copy_before_sort_fix.py",
      note: "ĐỀ BÀI\nList điểm được cho sẵn; không có INPUT từ bên ngoài. Hãy sửa dòng gán `backup` để việc sắp xếp `scores` không làm đổi bản lưu. OUTPUT đúng là `[7, 2, 9]` rồi `[9, 7, 2]`.",
      expectOut: { all: [{ minLines: 2 }, /^\[7, 2, 9\]$/, /^\[9, 7, 2\]$/] },
      solution: `from old_computer import say

scores = [7, 2, 9]
backup = scores.copy()
scores.sort()
scores.reverse()

say(backup)
say(scores)
`,
    },
    {
      quiz: {
        title: "Copy và sắp xếp list",
        questions: [
          {
            q: "Đoạn code chạy như sau:\n```python\na = [3, 1, 2]\nb = a.copy()\na.sort()\n```\nSau khi chạy, `a` và `b` giữ giá trị nào?",
            a: ["`a` là `[1, 2, 3]`; `b` là `[3, 1, 2]`", "Cả hai đều là `[1, 2, 3]`", "Cả hai đều là `[3, 1, 2]`"],
            correct: 0,
          },
          {
            q: "Đoạn code chạy như sau:\n```python\na = [2, 5, 1]\na.sort()\na.reverse()\n```\n`say(a)` in gì?",
            a: ["`[5, 2, 1]`", "`[1, 2, 5]`", "`[2, 5, 1]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say

line = ["Pip", "Koto"]
line.append("Mira")
line.insert(1, "Bo")
line.remove("Koto")
say(line)
say(line[-1])
`,
      label: "queue_toolkit.py",
      note: "THỬ THÁCH NHỎ\nBấm RUN để kiểm tra cả chuỗi thao tác: thêm Mira cuối hàng, chèn Bo vào index 1, xóa Koto, rồi đọc người cuối hàng.",
      expectOut: { all: [{ minLines: 2 }, /^\['Pip', 'Bo', 'Mira'\]$/, /^Mira$/] },
      solution: `from old_computer import say

line = ["Pip", "Koto"]
line.append("Mira")
line.insert(1, "Bo")
line.remove("Koto")
say(line)
say(line[-1])
`,
    },
    {
      code: `from old_computer import say, say_num

scores = [7, 4]
scores.append([9, 6])      # Sửa để thêm riêng hai điểm 9 và 6
removed = scores.pop()     # Sửa để lấy và xóa điểm ở index 1
scores.sort()

say_num(removed)
say(scores)
`,
      label: "score_list_toolkit.py",
      note: "THỬ THÁCH NHỎ\nList ban đầu là `[7, 4]`; không có INPUT từ bên ngoài. Hãy thêm riêng hai điểm 9 và 6, lấy và xóa điểm ở index 1, rồi sắp xếp các điểm còn lại tăng dần. OUTPUT đúng là `4` và `[6, 7, 9]`.",
      expectOut: { all: [{ minLines: 2 }, /^4$/, /^\[6, 7, 9\]$/] },
      solution: `from old_computer import say, say_num

scores = [7, 4]
scores.extend([9, 6])
removed = scores.pop(1)
scores.sort()

say_num(removed)
say(scores)
`,
    },
    {
      remember:
        "List dùng negative index và slice giống chuỗi. `append()` thêm một phần tử; `extend()` nối nhiều phần tử; `pop()`, `insert()`, `remove()`, `clear()` thay đổi nội dung. `copy()` tạo bản riêng; `sort()` sắp xếp; `reverse()` đảo thứ tự. `count()` đếm và `index()` tìm vị trí đầu tiên.",
    },
  ],
};
