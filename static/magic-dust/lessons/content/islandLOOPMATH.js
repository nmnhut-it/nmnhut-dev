// islandLOOPMATH.js — bonus side-island for common counted-loop math exercises
// after node10's for/range(): sum, product, count with an if, and a small
// multiplication table. Reuses old_computer plus already-taught arithmetic,
// variables, if, and for/range.
export default {
  index: -1,
  sideIslandId: "islandLOOPMATH",
  title: "ĐẢO CỘNG DỒN",
  subtitle: "tính tổng từ 1 đến n, tính tích, đếm theo điều kiện, và in bảng nhân nhỏ",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ VÒNG ĐẾM" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY GOM SỐ",
    blurb: "một trạm phụ để luyện các bài toán dùng vòng for và một biến gom kết quả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO CỘNG DỒN ✦",
        hook: "Có nhiều bài trông khác nhau nhưng cùng một khung: đặt một biến kết quả trước vòng lặp, rồi cập nhật biến đó trong mỗi vòng. Đảo này gom bốn dạng bài: tính tổng, tính tích, đếm số thỏa điều kiện, và in bảng nhân.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Mẹo của Pip: trước khi viết vòng lặp, hãy hỏi biến nào đang giữ kết quả tạm. Khi tính tổng, biến đó thường là `total`; khi tính tích, biến đó thường là `product`; khi đếm, biến đó thường là `count`.",
    },

    {
      quiz: {
        title: "Tổng từ 1 đến n",
        questions: [
          {
            q: "Đoạn này in ra số nào?\n```python\nn = 4\ntotal = 0\nfor number in range(1, n + 1):\n    total = total + number\nsay_num(total)\n```",
            a: ["4", "10", "24"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

n = 4
total = 0
for number in range(1, n + 1):
    total = total + number

say_num(total)
`,
      label: "sum_to_n_demo.py",
      note: "RUN KIỂM CHỨNG\n`range(1, n + 1)` đi qua 1, 2, 3, 4. Mỗi vòng cộng thêm `number` vào `total`, nên kết quả là 10.",
      expectOut: /^10$/,
      solution: `from old_computer import say_num

n = 4
total = 0
for number in range(1, n + 1):
    total = total + number

say_num(total)
`,
    },
    {
      code: `from old_computer import say_num

n = 5
total = 0
for number in range(1, n + 1):
    total = total

say_num(total)
`,
      label: "sum_to_n_fix.py",
      note: "ĐỀ BÀI\nSửa dòng trong vòng lặp thành `total = total + number` để tính `1 + 2 + 3 + 4 + 5`. Output đúng là 15.",
      expectOut: /^15$/,
      solution: `from old_computer import say_num

n = 5
total = 0
for number in range(1, n + 1):
    total = total + number

say_num(total)
`,
    },
    {
      checkpoint: {
        text: "Cách làm bài tính tổng: đặt `total = 0` trước vòng lặp; mỗi vòng chạy `total = total + number`. Biến `total` giữ kết quả đã gom từ các vòng trước.",
      },
    },
    {
      quiz: {
        title: "Biến tổng giữ gì",
        questions: [
          {
            q: "`total = 0`, rồi vòng lặp cộng lần lượt 1, 2, 3 vào `total`. Sau ba vòng, `total` bằng bao nhiêu?",
            a: ["3", "6", "0"],
            correct: 1,
          },
        ],
      },
    },

    {
      npc: "`product` giữ tích tạm. Đặt `product = 1`; trong mỗi vòng, gán `product = product * number`. Nếu bắt đầu từ 0, kết quả sẽ luôn bằng 0.",
    },
    {
      code: `from old_computer import say_num

n = 4
product = 1
for number in range(1, n + 1):
    product = product * number

say_num(product)
`,
      label: "product_to_n_demo.py",
      note: "RUN KIỂM CHỨNG\n`1 * 2 * 3 * 4` bằng 24. Biến `product` bắt đầu từ 1 để không làm mất kết quả ngay vòng đầu.",
      expectOut: /^24$/,
      solution: `from old_computer import say_num

n = 4
product = 1
for number in range(1, n + 1):
    product = product * number

say_num(product)
`,
    },
    {
      code: `from old_computer import say_num

n = 3
product = 0
for number in range(1, n + 1):
    product = product * number

say_num(product)
`,
      label: "product_start_fix.py",
      note: "ĐỀ BÀI\nBài cần tính `1 * 2 * 3 = 6`, nhưng `product` bắt đầu từ 0 nên kết quả bị kẹt ở 0. Sửa giá trị ban đầu của `product`.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

n = 3
product = 1
for number in range(1, n + 1):
    product = product * number

say_num(product)
`,
    },
    {
      checkpoint: {
        text: "Cách tính tích của nhiều số: đặt `product = 1` trước vòng lặp; trong mỗi vòng, chạy `product = product * number`. Không đặt `product = 0`, vì nhân với 0 sẽ làm kết quả luôn bằng 0.",
      },
    },
    {
      quiz: {
        title: "Bắt đầu tính tích từ số nào?",
        questions: [
          {
            q: "Vì sao `product` nên bắt đầu từ 1 trước vòng lặp tính tích?",
            a: ["Vì 1 không làm thay đổi phép nhân đầu tiên", "Vì 1 là số lớn nhất", "Vì vòng for chỉ chạy khi biến bắt đầu từ 1"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Đếm theo điều kiện cũng là một biến gom kết quả. Nhưng thay vì cộng thêm chính `number`, mình chỉ cộng thêm 1 khi điều kiện đúng.",
    },
    {
      quiz: {
        title: "Đếm số đạt mốc",
        questions: [
          {
            q: "Đoạn này đếm bao nhiêu số từ 1 đến 6 lớn hơn hoặc bằng 4?\n```python\ncount = 0\nfor number in range(1, 7):\n    if number >= 4:\n        count = count + 1\nsay_num(count)\n```",
            a: ["2", "3", "4"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

count = 0
for number in range(1, 7):
    if number >= 4:
        count = count + 1

say_num(count)
`,
      label: "count_threshold_demo.py",
      note: "RUN KIỂM CHỨNG\nCác số đạt điều kiện `number >= 4` là 4, 5, 6. Có 3 số như vậy, nên `count` tăng ba lần.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

count = 0
for number in range(1, 7):
    if number >= 4:
        count = count + 1

say_num(count)
`,
    },
    {
      code: `from old_computer import say_num

count = 0
for number in range(1, 8):
    if number > 5:
        count = count + 1

say_num(count)
`,
      label: "count_threshold_fix.py",
      note: "ĐỀ BÀI\nĐề cần đếm số từ 1 đến 7 lớn hơn hoặc bằng 5. Các số đúng là 5, 6, 7, nên output phải là 3. Sửa dấu so sánh trong điều kiện.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

count = 0
for number in range(1, 8):
    if number >= 5:
        count = count + 1

say_num(count)
`,
    },
    {
      checkpoint: {
        text: "Cách làm bài đếm: đặt `count = 0`; quét các giá trị; nếu điều kiện đúng thì chạy `count = count + 1`. Đếm khác tính tổng: mình cộng thêm 1 lượt, không cộng giá trị đang xét.",
      },
    },
    {
      quiz: {
        title: "Đếm khác cộng tổng",
        questions: [
          {
            q: "Muốn đếm có bao nhiêu số đạt điều kiện, dòng cập nhật nào đúng?",
            a: ["`count = count + 1`", "`count = count + number`", "`count = number`"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Dạng bài cuối là bảng nhân nhỏ. Không có phép mới: chỉ cho vòng lặp đi qua 1, 2, 3, 4 rồi in `n * number` mỗi vòng.",
    },
    {
      code: `from old_computer import say_num

n = 3
for number in range(1, 5):
    say_num(n * number)
`,
      label: "small_table_demo.py",
      note: "RUN KIỂM CHỨNG\n`n = 3`, vòng lặp in lần lượt `3 * 1`, `3 * 2`, `3 * 3`, `3 * 4`.",
      expectOut: { all: [{ minLines: 4 }, /^3$/, /^6$/, /^9$/, /^12$/] },
      solution: `from old_computer import say_num

n = 3
for number in range(1, 5):
    say_num(n * number)
`,
    },
    {
      code: `from old_computer import say_num

n = 4
for number in range(1, 5):
    say_num(number)
`,
      label: "small_table_fix.py",
      note: "ĐỀ BÀI\nBài cần in bảng nhân 4 từ `4 * 1` đến `4 * 4`, tức là 4, 8, 12, 16. Sửa dòng in để dùng `n * number`.",
      expectOut: { all: [{ minLines: 4 }, /^4$/, /^8$/, /^12$/, /^16$/] },
      solution: `from old_computer import say_num

n = 4
for number in range(1, 5):
    say_num(n * number)
`,
    },
    {
      quiz: {
        title: "Bảng nhân nhỏ",
        questions: [
          {
            q: "`n = 5`. Vòng `for number in range(1, 4): say_num(n * number)` in những số nào?",
            a: ["5, 10, 15", "1, 2, 3", "5, 10, 15, 20"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Các dạng bài vòng lặp dễ gặp đều có chung khung: đặt biến trước vòng lặp, cập nhật biến trong từng vòng, rồi in kết quả sau vòng lặp. Khi tính tổng, biến kết quả bắt đầu từ 0; khi tính tích, biến kết quả bắt đầu từ 1; khi đếm, biến kết quả tăng thêm 1 nếu điều kiện đúng; còn bảng nhân in trực tiếp `n * number` trong mỗi vòng.",
    },
  ],
};
