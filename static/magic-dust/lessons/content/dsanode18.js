import { dsaNode } from "./dsa-builders.js";

export default dsaNode(18, {
  subtitle: "chuẩn bị trước để trả lời nhiều truy vấn đoạn",
  machineName: "DẢI TỔNG TÍCH LŨY",
  machineBlurb: "ghi tổng từ đầu list tới từng mốc để lấy tổng một đoạn nhanh",
  cells: [
    { quiz: { title: "Ôn cửa sổ cố định", questions: [
      { q: "Cửa sổ dài 3 đang phủ `[4, 1, 6]` với tổng 11. Nó dịch sang phải và phủ `[1, 6, 2]`. Tổng mới được tính thế nào?", a: ["`11 - 4 + 2`", "`11 + 2`", "`11 - 1 + 2`"], correct: 0 },
    ] } },
    { npc: "Cửa sổ trượt hợp với các đoạn cùng độ dài. Nhưng trạm này liên tục hỏi tổng của nhiều đoạn có điểm đầu và điểm cuối khác nhau." },
    { npc: "List tổng cộng dồn `prefix` được tạo sao cho `prefix[i]` là tổng của `i` phần tử đầu tiên. Vì chưa lấy phần tử nào thì tổng bằng 0, `prefix` luôn bắt đầu bằng `prefix[0] = 0`." },
    { code: `values = [3, 5, 2, 6]
prefix = [0]

for value in values:
    prefix.append(prefix[-1] + value)

print(prefix)
left = 1
right = 3
range_sum = prefix[right + 1] - prefix[left]
print(range_sum)
`, label: "prefix_demo.py", note: "RUN KIỂM CHỨNG: Cho sẵn `values`. Đoạn code tạo `prefix = [0, 3, 8, 10, 16]`, rồi lấy tổng từ index 1 đến index 3, tính cả hai đầu. OUTPUT cuối là `13`.", expectOut: { all: [/\[0, 3, 8, 10, 16\]/, /^13$/m], minLines: 2 }, solution: `values = [3, 5, 2, 6]
prefix = [0]

for value in values:
    prefix.append(prefix[-1] + value)

print(prefix)
left = 1
right = 3
range_sum = prefix[right + 1] - prefix[left]
print(range_sum)
` },
    { npc: "Truy vấn dưới muốn lấy các index từ 1 đến 3, nhưng lại dùng `prefix[right]`. Giá trị đó mới ghi tổng trước index 3, nên số 6 ở cuối đoạn bị bỏ quên." },
    { code: `values = [3, 5, 2, 6]
prefix = [0, 3, 8, 10, 16]
left = 1
right = 3

range_sum = prefix[right] - prefix[left]
print(range_sum)
`, label: "prefix_query_fix.py", note: "ĐỀ BÀI: `prefix` đã cho sẵn. Hãy sửa phép lấy tổng để đoạn tính cả index `left = 1` và `right = 3`. OUTPUT đúng là `13`.", expectOut: /^13$/, solution: `values = [3, 5, 2, 6]
prefix = [0, 3, 8, 10, 16]
left = 1
right = 3

range_sum = prefix[right + 1] - prefix[left]
print(range_sum)
` },
    { code: `energy = [2, 4, 1, 3, 5]
prefix = [0]

# Tạo list prefix cho energy.

print(prefix)
`, label: "build_prefix_task.py", note: "ĐỀ BÀI: Cho sẵn năm mức năng lượng. Hãy tạo list tổng cộng dồn bắt đầu bằng 0, trong đó mỗi phần tử tiếp theo giữ tổng từ đầu dữ liệu. OUTPUT đúng là `[0, 2, 6, 7, 10, 15]`.", expectOut: /^\[0, 2, 6, 7, 10, 15\]$/, solution: `energy = [2, 4, 1, 3, 5]
prefix = [0]

for value in energy:
    prefix.append(prefix[-1] + value)

print(prefix)
` },
    { code: `energy = [2, 4, 1, 3, 5]
prefix = [0, 2, 6, 7, 10, 15]
queries = [(0, 2), (2, 4)]

# In tổng của từng đoạn, tính cả left và right.
`, label: "range_queries_task.py", note: "ĐỀ BÀI: `energy`, `prefix` và hai truy vấn đã cho sẵn. Mỗi cặp là `(left, right)` và tính cả hai đầu. Hãy dùng `prefix` để in tổng từng đoạn. OUTPUT phải gồm `7` rồi `9` trên hai dòng.", expectOut: { all: [/^7$/m, /^9$/m], minLines: 2 }, solution: `energy = [2, 4, 1, 3, 5]
prefix = [0, 2, 6, 7, 10, 15]
queries = [(0, 2), (2, 4)]

for left, right in queries:
    range_sum = prefix[right + 1] - prefix[left]
    print(range_sum)
` },
    { checkpoint: { text: "Nếu `prefix[i]` giữ tổng của `i` phần tử đầu tiên và `prefix[0] = 0`, tổng đoạn từ index `left` đến `right`, tính cả hai đầu, là `prefix[right + 1] - prefix[left]`." } },
    { quiz: { title: "Lấy tổng đúng đoạn", questions: [
      { q: "Cho `values = [4, 2, 7]` và `prefix = [0, 4, 6, 13]`. Tổng từ index 1 đến index 2, tính cả hai đầu, là biểu thức nào?", a: ["`prefix[3] - prefix[1]`", "`prefix[2] - prefix[1]`", "`prefix[3] - prefix[2]`"], correct: 0 },
      { q: "Vì sao `prefix` bắt đầu bằng số 0?", a: ["Để biểu diễn tổng trước phần tử đầu tiên và lấy được đoạn bắt đầu ở index 0", "Để mọi tổng đều tăng thêm 0", "Vì list Python luôn phải bắt đầu bằng 0"], correct: 0 },
    ] } },
  ],
});
