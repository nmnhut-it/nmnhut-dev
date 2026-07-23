// islandLISTDRILLS.js — bonus side-island for common list-scan exercises after
// node14: sum a list, count matching values, find the largest value, and find
// the first position of a target. Reuses already-taught list, index, if,
// for, comparisons, and accumulation.
export default {
  index: -1,
  sideIslandId: "islandLISTDRILLS",
  title: "ĐẢO QUÉT LIST",
  subtitle: "tính tổng, đếm, tìm lớn nhất, và tìm vị trí đầu tiên",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ QUÉT LIST" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY SOI HÀNG Ô NHỚ",
    blurb: "một trạm phụ để luyện các dạng bài list dễ gặp bằng cách đi qua từng phần tử",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO QUÉT LIST ✦",
        hook: "Một list giống một hàng ô nhớ. Muốn biết tổng, số lượng, giá trị lớn nhất, hay vị trí của một mục tiêu, mình đi qua từng ô một lần và cập nhật biến kết quả.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Đảo này không dạy lệnh có sẵn. Pip muốn bạn tự quét list bằng vòng `for`, để nhìn rõ mỗi vòng đang đọc phần tử nào và cập nhật biến nào.",
    },

    {
      quiz: {
        title: "Tổng các phần tử",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\na = [2, 4, 6]\ntotal = 0\nfor x in a:\n    total = total + x\nsay_num(total)\n```",
            a: ["6", "12", "24"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

a = [2, 4, 6]
total = 0
for x in a:
    total = total + x

say_num(total)
`,
      label: "list_sum_demo.py",
      note: "RUN KIỂM CHỨNG\nVòng `for x in a` đi qua 2, 4, 6. Mỗi vòng cộng `x` vào `total`, nên tổng là 12.",
      expectOut: /^12$/,
      solution: `from old_computer import say_num

a = [2, 4, 6]
total = 0
for x in a:
    total = total + x

say_num(total)
`,
    },
    {
      code: `from old_computer import say_num

a = [3, 5, 7]
total = 0
for x in a:
    total = x

say_num(total)
`,
      label: "list_sum_fix.py",
      note: "ĐỀ BÀI\nBài cần tính tổng `3 + 5 + 7 = 15`. Dòng trong vòng lặp đang gán lại `total = x`, làm mất tổng cũ. Sửa thành `total = total + x`.",
      expectOut: /^15$/,
      solution: `from old_computer import say_num

a = [3, 5, 7]
total = 0
for x in a:
    total = total + x

say_num(total)
`,
    },
    {
      checkpoint: {
        text: "Tính tổng list: đặt `total = 0`, rồi quét từng phần tử bằng `for x in a:`. Mỗi vòng chạy `total = total + x` để giữ tổng cũ và cộng thêm phần tử hiện tại.",
      },
    },
    {
      quiz: {
        title: "Gán lại hay cộng thêm",
        questions: [
          {
            q: "Trong bài tính tổng list, vì sao `total = x` bị sai?",
            a: ["Vì nó ghi đè tổng cũ bằng phần tử hiện tại, không giữ phần đã cộng trước đó", "Vì list không cho dùng biến `x`", "Vì `total` phải bắt đầu từ 1"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Đếm trong list cũng giống đếm trong vòng số. Mỗi khi phần tử thỏa điều kiện, `count` tăng thêm 1.",
    },
    {
      code: `from old_computer import say_num

a = [5, 2, 5, 7, 5]
target = 5

count = 0
for x in a:
    if x == target:
        count = count + 1

say_num(count)
`,
      label: "list_count_demo.py",
      note: "RUN KIỂM CHỨNG\nList có ba phần tử bằng 5, nên `count` tăng ba lần.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

a = [5, 2, 5, 7, 5]
target = 5

count = 0
for x in a:
    if x == target:
        count = count + 1

say_num(count)
`,
    },
    {
      code: `from old_computer import say_num

a = [1, 4, 4, 2, 4]
target = 4

count = 0
for x in a:
    if x > target:
        count = count + 1

say_num(count)
`,
      label: "list_count_fix.py",
      note: "ĐỀ BÀI\nBài cần đếm phần tử đúng bằng `target` là 4. List có ba số 4, nên output đúng là 3. Sửa điều kiện trong nhánh `if`.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

a = [1, 4, 4, 2, 4]
target = 4

count = 0
for x in a:
    if x == target:
        count = count + 1

say_num(count)
`,
    },
    {
      checkpoint: {
        text: "Đếm phần tử trong list: đặt `count = 0`, quét từng `x`, và nếu `x` thỏa điều kiện thì `count = count + 1`. Đổi điều kiện là đổi thứ mình muốn đếm.",
      },
    },
    {
      quiz: {
        title: "Đếm phần tử bằng mục tiêu",
        questions: [
          {
            q: "`a = [2, 3, 2, 5]`, `target = 2`. Nếu quét list và tăng `count` mỗi khi `x == target`, cuối cùng `count` bằng bao nhiêu?",
            a: ["1", "2", "4"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "Tìm số lớn nhất cần một biến giữ giá trị tốt nhất đang thấy. Đừng bắt đầu bằng 0 nếu list có thể chứa số âm; lấy phần tử đầu tiên của list làm mốc ban đầu sẽ chắc hơn.",
    },
    {
      quiz: {
        title: "Lớn nhất trong list",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\na = [3, 9, 4]\nmax_value = a[0]\nfor x in a:\n    if x > max_value:\n        max_value = x\nsay_num(max_value)\n```",
            a: ["3", "9", "4"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

a = [3, 9, 4]
max_value = a[0]
for x in a:
    if x > max_value:
        max_value = x

say_num(max_value)
`,
      label: "list_max_demo.py",
      note: "RUN KIỂM CHỨNG\n`max_value` bắt đầu bằng phần tử đầu tiên. Gặp 9 lớn hơn 3, máy gán lại `max_value = 9`. Sau đó 4 không lớn hơn 9, nên kết quả vẫn là 9.",
      expectOut: /^9$/,
      solution: `from old_computer import say_num

a = [3, 9, 4]
max_value = a[0]
for x in a:
    if x > max_value:
        max_value = x

say_num(max_value)
`,
    },
    {
      code: `from old_computer import say_num

a = [-8, -3, -5]
max_value = 0
for x in a:
    if x > max_value:
        max_value = x

say_num(max_value)
`,
      label: "list_max_start_fix.py",
      note: "ĐỀ BÀI\nList này toàn số âm, số lớn nhất thật là -3. Nếu đặt `max_value = 0`, mốc ban đầu không nằm trong list và kết quả sai. Sửa mốc ban đầu thành `a[0]`.",
      expectOut: /^-3$/,
      solution: `from old_computer import say_num

a = [-8, -3, -5]
max_value = a[0]
for x in a:
    if x > max_value:
        max_value = x

say_num(max_value)
`,
    },
    {
      checkpoint: {
        text: "Tìm lớn nhất trong list: đặt `max_value = a[0]`, quét từng `x`, và nếu `x > max_value` thì gán lại `max_value = x`. Dùng phần tử đầu tiên làm mốc giúp bài vẫn đúng khi list toàn số âm.",
      },
    },
    {
      quiz: {
        title: "Mốc ban đầu của lớn nhất",
        questions: [
          {
            q: "Vì sao `max_value = a[0]` chắc hơn `max_value = 0` khi tìm số lớn nhất?",
            a: ["Vì `a[0]` là một giá trị thật trong list, còn 0 có thể lớn hơn mọi phần tử nếu list toàn số âm", "Vì `a[0]` luôn là số lớn nhất", "Vì biến không được gán bằng 0"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài cuối là tìm vị trí đầu tiên của mục tiêu. Ta giữ hai biến: `chi_so` đang đếm vị trí hiện tại, còn `position` giữ kết quả tìm được. Ban đầu `position = -1` nghĩa là chưa tìm thấy.",
    },
    {
      code: `from old_computer import say_num

a = [4, 7, 9, 7]
target = 7

position = -1
chi_so = 0
for x in a:
    if x == target:
        if position == -1:
            position = chi_so
    chi_so = chi_so + 1

say_num(position)
`,
      label: "find_first_demo.py",
      note: "RUN KIỂM CHỨNG\nSố 7 xuất hiện ở vị trí 1 và 3, nhưng bài cần vị trí đầu tiên. Khi `position` đã đổi khỏi -1, máy không gán lại nữa.",
      expectOut: /^1$/,
      solution: `from old_computer import say_num

a = [4, 7, 9, 7]
target = 7

position = -1
chi_so = 0
for x in a:
    if x == target:
        if position == -1:
            position = chi_so
    chi_so = chi_so + 1

say_num(position)
`,
    },
    {
      code: `from old_computer import say_num

a = [5, 8, 5, 2]
target = 5

position = -1
chi_so = 0
for x in a:
    if x == target:
        position = chi_so
    chi_so = chi_so + 1

say_num(position)
`,
      label: "find_first_fix.py",
      note: "ĐỀ BÀI\nBài cần vị trí đầu tiên của số 5, tức là 0. Đoạn đang chạy gán lại `position` mỗi lần gặp 5 nên giữ vị trí cuối cùng là 2. Thêm một lớp `if position == -1:` trước khi gán.",
      expectOut: /^0$/,
      solution: `from old_computer import say_num

a = [5, 8, 5, 2]
target = 5

position = -1
chi_so = 0
for x in a:
    if x == target:
        if position == -1:
            position = chi_so
    chi_so = chi_so + 1

say_num(position)
`,
    },
    {
      quiz: {
        title: "Vị trí đầu tiên",
        questions: [
          {
            q: "`a = [6, 4, 6, 9]`, `target = 6`. Nếu cần vị trí đầu tiên của 6, kết quả phải là index nào?",
            a: ["0", "2", "3"],
            correct: 0,
          },
          {
            q: "Trong bài tìm vị trí đầu tiên, `position = -1` ban đầu có nghĩa gì?",
            a: ["Chưa tìm thấy mục tiêu", "Mục tiêu nằm ở cuối list", "List bắt đầu từ -1"],
            correct: 0,
          },
        ],
      },
    },
    {
      checkpoint: {
        text: "Tìm vị trí đầu tiên: đặt `position = -1`, quét list cùng biến `chi_so`; khi `x == target` và `position` vẫn là -1, gán `position = chi_so`. Điều kiện `position == -1` giúp máy không ghi đè vị trí đầu tiên bằng các lần gặp sau.",
      },
    },
    {
      quiz: {
        title: "Không ghi đè vị trí đầu tiên",
        questions: [
          {
            q: "`a = [5, 8, 5]`, `target = 5`. Nếu chỉ gán `position` khi `position == -1`, kết quả cuối cùng là index nào?",
            a: ["0", "2", "-1"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Bốn dạng bài quét list: tổng dùng `total = total + x`; đếm dùng `count = count + 1` khi điều kiện đúng; tìm lớn nhất dùng mốc ban đầu `a[0]`; tìm vị trí đầu tiên dùng `position = -1` và chỉ gán khi chưa tìm thấy trước đó.",
    },
  ],
};
