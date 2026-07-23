import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ CẦU THANG HÀM TỰ GỌI ✦", hook: "Mỗi lần gọi tạo một việc đang chờ trên call stack. Chỉ khi chạm điểm dừng, máy mới quay lại hoàn thành từng việc.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn insertion sort", questions: [
    { q: "Phần bên trái là `[1, 4, 8]` và `key = 6`. Sau một lượt chèn đúng, bốn giá trị có thứ tự nào?", a: ["`[1, 4, 6, 8]`", "`[6, 1, 4, 8]`", "`[1, 4, 8, 6]`"], correct: 0 },
  ] } },
  { npc: "Recursion là khi một hàm gọi lại chính nó với bài toán nhỏ hơn. Hàm cần base case để trả kết quả mà không gọi tiếp. Call stack giữ các lần gọi chưa hoàn thành để máy quay lại." },
  { code: `def count_down(number):
    if number == 0:
        print("GO")
        return
    print(number)
    count_down(number - 1)

count_down(3)
`, label: "recursion_countdown_demo.py", note: "RUN KIỂM CHỨNG\nGiá trị `3` được cho sẵn khi gọi hàm; không có INPUT từ ngoài chương trình. PROCESS: mỗi lần gọi giảm `number` một đơn vị; base case tại 0 dừng lời gọi tiếp theo. OUTPUT là `3`, `2`, `1`, `GO`.", expectOut: { all: [{ minLines: 4 }, /^3$/, /^2$/, /^1$/, /^GO$/] }, solution: `def count_down(number):
    if number == 0:
        print("GO")
        return
    print(number)
    count_down(number - 1)

count_down(3)
` },
  { npc: "Base case không chỉ giúp hàm dừng; nó còn phải trả đúng kết quả nhỏ nhất. Với tổng từ 1 đến `number`, trường hợp `number == 1` phải trả về 1. Trả về 0 sẽ làm tổng bị thiếu." },
  { code: `def sum_to(number):
    if number == 1:
        return 0
    return number + sum_to(number - 1)

print(sum_to(5))
`, label: "recursion_base_fix.py", note: "ĐỀ BÀI\nHàm nhận giá trị gán sẵn `number = 5`; không có INPUT từ ngoài chương trình. PROCESS: cộng các số từ 1 đến 5 bằng recursion. Base case đang trả sai giá trị. Sửa nó để OUTPUT là `15`.", expectOut: /^15$/, solution: `def sum_to(number):
    if number == 1:
        return 1
    return number + sum_to(number - 1)

print(sum_to(5))
` },
  { code: `def sum_list(values, index):
    if index == len(values):
        return 0
    return values[index] + sum_list(values, index + 1)

numbers = [3, 4, 5]
print(sum_list(numbers, 0))
`, label: "recursive_list_sum.py", note: "RUN THỰC HÀNH\nList `[3, 4, 5]` và index bắt đầu 0 được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: hàm tự gọi với index kế tiếp và dừng khi index bằng độ dài list. OUTPUT đúng là `12`.", expectOut: /^12$/, solution: `def sum_list(values, index):
    if index == len(values):
        return 0
    return values[index] + sum_list(values, index + 1)

numbers = [3, 4, 5]
print(sum_list(numbers, 0))
` },
  { checkpoint: { text: "Một hàm recursion cần base case không gọi tiếp và một lời gọi mới tiến gần base case. Call stack giữ các lần gọi đang chờ; khi base case trả kết quả, máy hoàn thành các lần gọi theo thứ tự ngược." } },
  { quiz: { title: "Theo dõi điểm dừng và call stack", questions: [
    { q: "Hàm gọi `count_down(number - 1)` và bắt đầu với `number = 2`. Base case nào dừng đúng sau khi xử lý 2 rồi 1?", a: ["`if number == 0: return`", "`if number == 3: return`", "Không cần base case"], correct: 0 },
    { q: "Đọc đoạn code:\n```python\ndef power_of_two(number):\n    if number == 0:\n        return 1\n    return 2 * power_of_two(number - 1)\n\nprint(power_of_two(3))\n```\nOUTPUT là gì?", a: ["8", "6", "1"], correct: 0 },
  ] } },
];

export default dsaNode(12, { subtitle: "dừng đúng bằng base case và theo dõi call stack", machineName: "CHUÔNG ĐIỂM DỪNG", machineBlurb: "báo lúc hàm ngừng gọi tiếp và bắt đầu trả kết quả", cells });
