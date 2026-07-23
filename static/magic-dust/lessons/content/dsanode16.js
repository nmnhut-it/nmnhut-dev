import { dsaNode } from "./dsa-builders.js";

export default dsaNode(16, {
  subtitle: "đọc list đã sắp xếp từ hai phía",
  machineName: "CẶP KIM CHỈ HƯỚNG",
  machineBlurb: "giữ hai vị trí đang đọc để thu hẹp phần dữ liệu cần xét",
  cells: [
    { quiz: { title: "Ôn bảng xếp hạng", questions: [
      { q: "Cho list đã sắp xếp `scores = [4, 7, 10, 13]`. Muốn tìm điểm 10 bằng binary search, sau lần so sánh với 7 thì nên giữ lại phần nào?", a: ["Phần bên phải chứa 10 và 13", "Phần bên trái chỉ chứa 4", "Giữ nguyên cả list"], correct: 0 },
    ] } },
    { npc: "Một list đã sắp xếp cho tụi mình thêm một lợi thế: nhìn giá trị ở hai đầu là biết nên bỏ đầu nào khỏi lần xét tiếp theo." },
    { npc: "Hai con trỏ là hai biến giữ hai index đang đọc. Với list tăng dần, `left` ở đầu và `right` ở cuối. Khi tìm một cặp có tổng cho trước, tổng nhỏ thì tăng `left`; tổng lớn thì giảm `right`." },
    { code: `numbers = [1, 3, 4, 7, 9]
target = 10
left = 0
right = len(numbers) - 1

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        print(numbers[left], numbers[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1
`, label: "two_pointers_demo.py", note: "RUN KIỂM CHỨNG: Cho sẵn list tăng dần `[1, 3, 4, 7, 9]` và tổng cần tìm là 10. Đoạn code dùng hai index ở hai phía để tìm một cặp. OUTPUT đúng là `1 9`.", expectOut: /^1 9$/, solution: `numbers = [1, 3, 4, 7, 9]
target = 10
left = 0
right = len(numbers) - 1

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        print(numbers[left], numbers[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1
` },
    { npc: "Bản đúng vừa rồi luôn làm khoảng đang xét nhỏ lại. Bản dưới gặp tổng 13 lớn hơn 10 nhưng lại tăng `left`, nên tổng còn lớn hơn và cặp `1, 9` bị bỏ qua." },
    { code: `numbers = [1, 3, 4, 7, 9]
target = 10
left = 0
right = len(numbers) - 1

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        print(numbers[left], numbers[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        left = left + 1
`, label: "two_pointers_fix.py", note: "ĐỀ BÀI: List và `target` đã cho sẵn. Hãy sửa nhánh xử lý khi tổng quá lớn để khoảng đang xét thu hẹp đúng phía. PROCESS dùng hai con trỏ; OUTPUT phải là `1 9`.", expectOut: /^1 9$/, solution: `numbers = [1, 3, 4, 7, 9]
target = 10
left = 0
right = len(numbers) - 1

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        print(numbers[left], numbers[right])
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1
` },
    { npc: "Hai con trỏ cũng có thể so hai đầu của một chuỗi. Mỗi lần hai ký tự bằng nhau, cả hai index cùng tiến vào giữa. Chỉ một cặp khác nhau là chuỗi không đối xứng." },
    { code: `text = "level"
left = 0
right = len(text) - 1
is_palindrome = True

# Viết vòng lặp dùng hai con trỏ để kiểm tra text.

print(is_palindrome)
`, label: "palindrome_task.py", note: "ĐỀ BÀI: Cho sẵn `text = \"level\"`. Hãy dùng hai index từ hai phía để kiểm tra các cặp ký tự. Nếu mọi cặp đều bằng nhau, OUTPUT phải là `True`. Bài này không đọc dữ liệu từ bên ngoài.", expectOut: /^True$/, solution: `text = "level"
left = 0
right = len(text) - 1
is_palindrome = True

while left < right:
    if text[left] != text[right]:
        is_palindrome = False
        break
    left = left + 1
    right = right - 1

print(is_palindrome)
` },
    { code: `numbers = [2, 5, 8, 12, 14]
target = 20
left = 0
right = len(numbers) - 1
found = False

# Hoàn thành phần tìm cặp có tổng bằng target.

print(found)
`, label: "pair_sum_task.py", note: "ĐỀ BÀI: Cho sẵn list tăng dần và `target = 20`. Hãy dùng hai con trỏ để xác định có cặp số nào đạt tổng đó hay không. OUTPUT đúng là `True`. Không cần in chính cặp số.", expectOut: /^True$/, solution: `numbers = [2, 5, 8, 12, 14]
target = 20
left = 0
right = len(numbers) - 1
found = False

while left < right:
    current_sum = numbers[left] + numbers[right]
    if current_sum == target:
        found = True
        break
    elif current_sum < target:
        left = left + 1
    else:
        right = right - 1

print(found)
` },
    { checkpoint: { text: "Với list tăng dần, hai con trỏ `left` và `right` giới hạn phần đang xét. Tổng quá nhỏ thì tăng `left`; tổng quá lớn thì giảm `right`; mỗi lần lặp phải làm khoảng này nhỏ lại." } },
    { quiz: { title: "Thu hẹp đúng phía", questions: [
      { q: "Cho `numbers = [2, 4, 7, 11]`, `target = 9`, `left = 0`, `right = 3`. Tổng hiện tại là 13. Để còn cơ hội tìm được cặp 2 và 7, cần đổi index nào?", a: ["Giảm `right`", "Tăng `left`", "Tăng cả hai index"], correct: 0 },
      { q: "Đoạn kiểm tra chuỗi đang có `text[left] != text[right]`. Nếu điều kiện này đúng, kết luận nào phù hợp?", a: ["Chuỗi không đối xứng", "Chuỗi chắc chắn đối xứng", "Cần sắp xếp chuỗi trước"], correct: 0 },
    ] } },
  ],
});
