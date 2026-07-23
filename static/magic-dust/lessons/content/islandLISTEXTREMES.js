import { listPracticeIsland } from "./list-practice-builders.js";

const cells = [
  { npc: "Với list không rỗng, hãy bắt đầu bằng một giá trị thật trong list: `largest = values[0]` hoặc `smallest = values[0]`. Sau đó chỉ gán lại khi gặp giá trị phù hợp hơn." },
  { code: `from old_computer import say_num

values = [12, 5, 18, 9]
largest = values[0]
for value in values:
    if value > largest:
        largest = value

say_num(largest)
`, label: "list_largest_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list không rỗng; không có INPUT. PROCESS: giữ giá trị lớn nhất đã gặp. OUTPUT đúng là `18`.", expectOut: /^18$/, solution: `from old_computer import say_num

values = [12, 5, 18, 9]
largest = values[0]
for value in values:
    if value > largest:
        largest = value

say_num(largest)
` },
  { code: `from old_computer import say_num

values = [-8, -3, -5]
largest = 0
for value in values:
    if value > largest:
        largest = value

say_num(largest)
`, label: "list_negative_largest_fix.py", note: "ĐỀ BÀI\nList toàn số âm và không có INPUT. Giá trị 0 không nằm trong list nên không được dùng làm mốc. Sửa giá trị bắt đầu để OUTPUT là `-3`.", expectOut: /^-3$/, solution: `from old_computer import say_num

values = [-8, -3, -5]
largest = values[0]
for value in values:
    if value > largest:
        largest = value

say_num(largest)
` },
  { quiz: { title: "Đổi điều kiện để tìm nhỏ nhất", questions: [{ q: "Đang có `smallest = values[0]`. Điều kiện nào giúp gán lại khi gặp một số nhỏ hơn?", a: ["`value < smallest`", "`value > smallest`", "`value == 0`"], correct: 0 }] } },
  { code: `from old_computer import say_num

values = [14, 6, 21, 9]
largest = values[0]
smallest = values[0]
# Duyệt một lần để tìm cả largest và smallest.

say_num(largest)
say_num(smallest)
say_num(largest - smallest)
`, label: "list_range_apply.py", note: "ĐỀ BÀI\nCho sẵn list không rỗng; không có INPUT. Trong một vòng `for`, tìm số lớn nhất và nhỏ nhất. OUTPUT phải là `21`, `6`, rồi độ chênh lệch `15`.", expectOut: { all: [{ minLines: 3 }, /^21$/, /^6$/, /^15$/] }, solution: `from old_computer import say_num

values = [14, 6, 21, 9]
largest = values[0]
smallest = values[0]
for value in values:
    if value > largest:
        largest = value
    if value < smallest:
        smallest = value

say_num(largest)
say_num(smallest)
say_num(largest - smallest)
` },
  { checkpoint: { text: "Tìm lớn nhất hoặc nhỏ nhất trong list không rỗng: bắt đầu bằng `values[0]`. Gán lại `largest` khi `value > largest`; gán lại `smallest` khi `value < smallest`." } },
  { quiz: { title: "Hai mốc trong một list", questions: [{ q: "Cho `values = [-4, -9, -2]`. Nếu bắt đầu từ `values[0]`, cặp `(largest, smallest)` đúng là gì?", a: ["(-2, -9)", "(0, -9)", "(-9, -2)"], correct: 0 }] } },
];

export default listPracticeIsland({ id: "islandLISTEXTREMES", title: "ĐẢO MỐC CAO THẤP", subtitle: "tìm giá trị lớn nhất, nhỏ nhất và độ chênh lệch", machineName: "MÁY GIỮ MỐC", machineBlurb: "so từng số với mốc tốt nhất đã gặp", hook: "Các cột đá cao thấp khác nhau. Bạn sẽ cho máy ghi lại mốc lớn nhất và nhỏ nhất mà không giả sử list chỉ chứa số dương.", cells });
