import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ CHỢ TOÁN KOTOPIA ✦", hook: "Ba quầy hàng dùng ba mã khác nhau. Bạn sẽ dùng `if/elif` để chọn đúng đơn giá, rồi tính số tiền cần trả.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn chuỗi if/elif", questions: [
    { q: "Đọc đoạn code:\n```python\nitem = 2\nif item == 1:\n    price = 5\nelif item == 2:\n    price = 8\n```\nSau khi chạy, `price` bằng bao nhiêu?", a: ["8", "5", "2"], correct: 0 },
  ] } },
  { npc: "Chuỗi `if/elif` kiểm tra từ trên xuống và chạy nhánh đúng đầu tiên. Ở chợ này, mã 1 có giá 5 đồng, mã 2 có giá 8 đồng và mã 3 có giá 12 đồng." },
  { code: `from old_computer import say_num

item = 2

if item == 1:
    price = 5
elif item == 2:
    price = 8
elif item == 3:
    price = 12

say_num(price)
`, label: "math6_market_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn mã món `item = 2`; không có INPUT. PROCESS: chuỗi `if/elif` chọn giá của mã 2. OUTPUT đúng là `8`.", expectOut: /^8$/, solution: `from old_computer import say_num

item = 2

if item == 1:
    price = 5
elif item == 2:
    price = 8
elif item == 3:
    price = 12

say_num(price)
` },
  { code: `from old_computer import say_num

item = 3
count = 4

if item == 1:
    price = 5
elif item == 2:
    price = 12
elif item == 3:
    price = 8

total = price * count
say_num(total)
`, label: "math6_market_fix.py", note: "ĐỀ BÀI\nCho sẵn mã món 3 và số lượng 4; không có INPUT. Mã 3 có giá 12 đồng. Sửa các giá bị đặt nhầm để OUTPUT tổng tiền là `48`.", expectOut: /^48$/, solution: `from old_computer import say_num

item = 3
count = 4

if item == 1:
    price = 5
elif item == 2:
    price = 8
elif item == 3:
    price = 12

total = price * count
say_num(total)
` },
  { checkpoint: { text: "Chuỗi `if/elif` kiểm tra các mã từ trên xuống và chỉ chạy nhánh đúng đầu tiên. Sau khi chọn `price`, tổng tiền của các món giống nhau là `price * count`." } },
  { quiz: { title: "Chọn giá rồi tính tổng", questions: [
    { q: "Mã 1 giá 5 đồng, mã 2 giá 8 đồng. Với `item = 2` và `count = 3`, chương trình chọn giá 8 rồi tính `price * count`. Tổng tiền là bao nhiêu?", a: ["24", "15", "11"], correct: 0 },
    { q: "Trong chuỗi `if item == 1` rồi `elif item == 2`, nếu `item = 1` thì nhánh nào chạy?", a: ["Nhánh `if` đầu tiên", "Nhánh `elif`", "Cả hai nhánh"], correct: 0 },
  ] } },
  { code: `from old_computer import read_num, say_num

item = read_num("Ma mon 1-3: ")
count = read_num("So luong: ")

if item == 1:
    price = 5
elif item == 2:
    price = 8
elif item == 3:
    price = 12

total = price + count
say_num(total)
`, label: "math6_market_input.py", note: "ĐỀ BÀI\nINPUT mẫu là mã món 2 và số lượng 3. Các mã INPUT ở bài này luôn thuộc 1, 2, 3. Sửa phép tính tổng tiền. OUTPUT đúng là `24`.", sampleInput: ["2", "3"], expectOut: /^24$/, solution: `from old_computer import read_num, say_num

item = read_num("Ma mon 1-3: ")
count = read_num("So luong: ")

if item == 1:
    price = 5
elif item == 2:
    price = 8
elif item == 3:
    price = 12

total = price * count
say_num(total)
` },
  { remember: "Bài chọn công thức hoặc đơn giá theo mã có hai bước: dùng `if/elif` để gán đúng giá trị, rồi dùng giá trị đó trong phép tính tiếp theo." },
];

export default math6Lesson(2, { subtitle: "dùng if/elif để chọn đơn giá rồi tính tổng tiền", machineName: "MÁY TÍNH TIỀN", machineBlurb: "đọc mã món, chọn đúng giá và tính số tiền cho nhiều món giống nhau", cells });
