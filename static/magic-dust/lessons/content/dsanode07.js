import { dsaNode } from "./dsa-builders.js";

export default dsaNode(7, {
  subtitle: "dùng set để loại dữ liệu trùng và dict để lập bảng tần suất",
  machineName: "CON DẤU KHÔNG TRÙNG",
  machineBlurb: "đánh dấu giá trị đã gặp và đếm số lần từng giá trị xuất hiện",
  cells: [
    { quiz: { title: "Ôn queue", questions: [
      { q: "Cho `queue = [\"A\", \"B\", \"C\"]`, `head = 0`. Sau hai lần dequeue đúng cách, `head` bằng bao nhiêu và ai còn chờ?", a: ["`head = 2`, còn `C`", "`head = 0`, còn cả ba", "`head = 1`, còn `A`"], correct: 0 },
      { q: "Máy in phải xử lý tài liệu theo thứ tự gửi. Nếu `first.pdf` đến trước `second.pdf`, cấu trúc nào giữ đúng yêu cầu?", a: ["Queue FIFO", "Stack vào sau ra trước", "Set xóa thứ tự"], correct: 0 },
    ] } },
    { npc: "Một danh sách lượt ghé có thể chứa cùng một tên nhiều lần. Set giúp trả lời ai đã xuất hiện, còn dict giúp trả lời mỗi người xuất hiện bao nhiêu lần." },
    { npc: "`set` chỉ giữ mỗi giá trị một lần và hỗ trợ kiểm tra `value in seen`. `dict` nối mỗi khóa với một giá trị; bảng tần suất dùng phần tử làm khóa và số lần xuất hiện làm giá trị." },
    { code: `visits = ["An", "Binh", "An", "Chi", "Binh"]
seen = set()

for name in visits:
    seen.add(name)

print("UNIQUE", len(seen))
print("HAS CHI", "Chi" in seen)
`, label: "unique_set.py", note: "RUN KIỂM CHỨNG\nCho sẵn năm lượt ghé; không có INPUT. PROCESS: thêm tên vào set để chỉ giữ mỗi tên một lần, rồi kiểm tra `Chi`. OUTPUT là `UNIQUE 3` và `HAS CHI True`.", expectOut: { all: [{ minLines: 2 }, /^UNIQUE 3$/, /^HAS CHI True$/] }, solution: `visits = ["An", "Binh", "An", "Chi", "Binh"]
seen = set()

for name in visits:
    seen.add(name)

print("UNIQUE", len(seen))
print("HAS CHI", "Chi" in seen)
` },
    { npc: "Khi tăng tần suất, khóa có thể chưa tồn tại trong dict. Phải tạo giá trị 1 ở lần gặp đầu; những lần sau mới cộng thêm 1." },
    { code: `items = ["gem", "key", "gem"]
counts = {}

for item in items:
    counts[item] = counts[item] + 1

print(counts["gem"])
`, label: "frequency_first_fix.py", note: "ĐỀ BÀI\nCho sẵn ba món; không có INPUT. Đoạn code hiện tra khóa trước khi khóa được tạo. Sửa vòng lặp để lần gặp đầu gán 1, lần sau cộng thêm 1. OUTPUT đúng là `2`.", expectOut: /^2$/, solution: `items = ["gem", "key", "gem"]
counts = {}

for item in items:
    if item in counts:
        counts[item] = counts[item] + 1
    else:
        counts[item] = 1

print(counts["gem"])
` },
    { checkpoint: { text: "Set trả lời một giá trị đã xuất hiện hay chưa và chỉ giữ mỗi giá trị một lần. Bảng tần suất dùng dict: phần tử là khóa, số lần xuất hiện là giá trị; lần gặp đầu tạo khóa với 1, những lần sau cộng thêm 1." } },
    { quiz: { title: "Đọc dữ liệu không trùng và tần suất", questions: [
      { q: "Cho `codes = [\"A\", \"B\", \"A\", \"A\"]`. Sau khi thêm mọi mã vào set, `len(seen)` bằng bao nhiêu?", a: ["2", "4", "3"], correct: 0 },
      { q: "Bảng tần suất của `[\"red\", \"blue\", \"red\"]` phải lưu cặp nào?", a: ["`\"red\": 2`", "`\"red\": 1`", "`2: \"red\"`"], correct: 0 },
    ] } },
    { npc: "Từ bảng tần suất, mình có thể tìm phần tử xuất hiện nhiều nhất bằng cách duyệt các khóa và giữ lại khóa có số đếm lớn nhất." },
    { code: `votes = ["moon", "sun", "moon", "star", "moon", "sun"]
counts = {}

for vote in votes:
    if vote in counts:
        counts[vote] = counts[vote] + 1
    else:
        counts[vote] = 1

best_name = ""
best_count = 0

# Tìm tên có số phiếu lớn nhất rồi in tên và số phiếu.
`, label: "most_frequent.py", note: "XƯỞNG PHÉP\nCho sẵn sáu phiếu; không có INPUT. PROCESS: lập bảng tần suất rồi tìm lựa chọn có số phiếu lớn nhất. OUTPUT đúng là `moon 3`.", expectOut: /^moon 3$/, solution: `votes = ["moon", "sun", "moon", "star", "moon", "sun"]
counts = {}

for vote in votes:
    if vote in counts:
        counts[vote] = counts[vote] + 1
    else:
        counts[vote] = 1

best_name = ""
best_count = 0

for name in counts:
    if counts[name] > best_count:
        best_name = name
        best_count = counts[name]

print(best_name, best_count)
` },
    { checkpoint: { text: "Dùng set khi chỉ cần biết các giá trị khác nhau hoặc đã gặp một giá trị. Dùng dict khi cần giữ thêm thông tin cho từng giá trị, chẳng hạn số lần xuất hiện." } },
    { quiz: { title: "Chọn set hay dict", questions: [
      { q: "Một cổng chỉ cần biết mã `K7` đã được dùng chưa, không cần biết dùng mấy lần. Cấu trúc phù hợp nhất là gì?", a: ["Set các mã đã dùng", "Dict tần suất dù không cần số đếm", "Queue theo thứ tự đến"], correct: 0 },
      { q: "Một bảng thống kê phải in `moon 3`, `sun 2` từ các từ đã đọc. Chọn cấu trúc lưu được số lần của từng từ.", a: ["Dict nối mỗi từ với số lần xuất hiện", "Set chỉ giữ từ không trùng", "Stack chỉ giữ từ mới nhất"], correct: 0 },
    ] } },
  ],
});
