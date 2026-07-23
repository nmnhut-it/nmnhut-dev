import { dsaNode } from "./dsa-builders.js";

export default dsaNode(19, {
  subtitle: "kết hợp tần suất, cửa sổ và truy vấn đoạn",
  machineName: "TRẠM PHÂN TÍCH DỮ LIỆU",
  machineBlurb: "chọn đúng mẫu xử lý cho từng câu hỏi về cùng một bộ dữ liệu",
  cells: [
    { quiz: { title: "Ôn tổng cộng dồn", questions: [
      { q: "Cho `prefix = [0, 3, 8, 10, 16]`. Muốn lấy tổng từ index 1 đến index 3, tính cả hai đầu, dùng biểu thức nào?", a: ["`prefix[4] - prefix[1]`", "`prefix[3] - prefix[1]`", "`prefix[4] - prefix[3]`"], correct: 0 },
    ] } },
    { npc: "Trạm dữ liệu nhận cùng một dãy tín hiệu nhưng hỏi ba kiểu khác nhau: loại nào xuất hiện nhiều nhất, đoạn ba nhịp nào mạnh nhất, và tổng của một khoảng bất kỳ." },
    { npc: "Mỗi câu hỏi cần một mẫu phù hợp. `dict` tần suất đếm số lần xuất hiện; cửa sổ trượt xét các đoạn dài cố định; tổng cộng dồn trả lời nhiều truy vấn có điểm đầu và cuối khác nhau." },
    { code: `signals = [2, 1, 2, 3, 2, 1]
frequency = {}

for signal in signals:
    frequency[signal] = frequency.get(signal, 0) + 1

most_common = max(frequency, key=frequency.get)
print(most_common)
print(frequency[most_common])
`, label: "frequency_demo.py", note: "RUN KIỂM CHỨNG: Cho sẵn sáu tín hiệu. Đoạn code dùng `dict` để đếm. OUTPUT cho biết tín hiệu `2` xuất hiện nhiều nhất, với `3` lần.", expectOut: { all: [/^2$/m, /^3$/m], minLines: 2 }, solution: `signals = [2, 1, 2, 3, 2, 1]
frequency = {}

for signal in signals:
    frequency[signal] = frequency.get(signal, 0) + 1

most_common = max(frequency, key=frequency.get)
print(most_common)
print(frequency[most_common])
` },
    { npc: "Phần cửa sổ dưới bị lẫn với tổng cộng dồn: nó cộng giá trị mới nhưng không bỏ giá trị đã rời đoạn ba nhịp. Vì vậy máy báo một tổng không thuộc về đoạn nào có độ dài 3." },
    { code: `signals = [2, 1, 2, 3, 2, 1]
size = 3
window_sum = sum(signals[0:size])
best_sum = window_sum

for right in range(size, len(signals)):
    left_out = right - size
    window_sum = window_sum + signals[right]
    if window_sum > best_sum:
        best_sum = window_sum

print(best_sum)
`, label: "monitor_window_fix.py", note: "ĐỀ BÀI: Dữ liệu và cửa sổ dài 3 đã cho sẵn. Hãy sửa phép cập nhật để `best_sum` chỉ so sánh các đoạn đúng ba tín hiệu liên tiếp. OUTPUT đúng là `7`.", expectOut: /^7$/, solution: `signals = [2, 1, 2, 3, 2, 1]
size = 3
window_sum = sum(signals[0:size])
best_sum = window_sum

for right in range(size, len(signals)):
    left_out = right - size
    window_sum = window_sum - signals[left_out] + signals[right]
    if window_sum > best_sum:
        best_sum = window_sum

print(best_sum)
` },
    { code: `signals = [2, 1, 2, 3, 2, 1]
prefix = [0]

for signal in signals:
    prefix.append(prefix[-1] + signal)

queries = [(0, 2), (2, 5)]

# In tổng của từng truy vấn, tính cả hai đầu.
`, label: "monitor_queries_task.py", note: "ĐỀ BÀI: Dữ liệu và hai truy vấn đã cho sẵn. Hãy dùng `prefix` để in tổng của đoạn 0..2 và đoạn 2..5, tính cả hai đầu. OUTPUT phải là `5` rồi `8`.", expectOut: { all: [/^5$/m, /^8$/m], minLines: 2 }, solution: `signals = [2, 1, 2, 3, 2, 1]
prefix = [0]

for signal in signals:
    prefix.append(prefix[-1] + signal)

queries = [(0, 2), (2, 5)]

for left, right in queries:
    print(prefix[right + 1] - prefix[left])
` },
    { code: `signals = [4, 2, 4, 1, 3]
size = 2

# Hoàn thành báo cáo gồm ba dòng theo yêu cầu của đề bài.
`, label: "data_station_capstone.py", note: "XƯỞNG PHÉP: Cho sẵn năm tín hiệu và `size = 2`. Hãy dùng `dict` để tìm số lần tín hiệu 4 xuất hiện, cửa sổ trượt để tìm tổng lớn nhất của hai tín hiệu liên tiếp, và tổng cộng dồn để lấy tổng từ index 1 đến 3. OUTPUT phải lần lượt là `2`, `6`, `7`.", expectOut: { all: [/^2$/m, /^6$/m, /^7$/m], minLines: 3 }, solution: `signals = [4, 2, 4, 1, 3]
size = 2

frequency = {}
for signal in signals:
    frequency[signal] = frequency.get(signal, 0) + 1

window_sum = sum(signals[0:size])
best_sum = window_sum
for right in range(size, len(signals)):
    left_out = right - size
    window_sum = window_sum - signals[left_out] + signals[right]
    if window_sum > best_sum:
        best_sum = window_sum

prefix = [0]
for signal in signals:
    prefix.append(prefix[-1] + signal)

print(frequency[4])
print(best_sum)
print(prefix[4] - prefix[1])
` },
    { checkpoint: { text: "Chọn mẫu theo câu hỏi: dùng `dict` cho số lần xuất hiện, cửa sổ trượt cho đoạn liên tiếp có độ dài cố định, và `prefix[right + 1] - prefix[left]` cho nhiều truy vấn đoạn có hai đầu thay đổi." } },
    { quiz: { title: "Chọn công cụ cho trạm dữ liệu", questions: [
      { q: "Một cảm biến gửi 1.000 mã trạng thái. Trạm cần biết mỗi mã xuất hiện bao nhiêu lần. Cấu trúc nào phù hợp nhất?", a: ["`dict` tần suất", "Cửa sổ dài 3", "Hai con trỏ ở hai đầu"], correct: 0 },
      { q: "Cùng một list phải trả lời 50 câu hỏi tổng, mỗi câu có `left` và `right` khác nhau. Mẫu nào phù hợp nhất sau khi chuẩn bị dữ liệu một lần?", a: ["Tổng cộng dồn", "Đếm tần suất", "Sắp xếp lại trước mỗi câu"], correct: 0 },
    ] } },
  ],
});
