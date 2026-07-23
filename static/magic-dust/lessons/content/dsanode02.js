import { dsaNode } from "./dsa-builders.js";

export default dsaNode(2, {
  subtitle: "thiết kế test thường, test biên và trường hợp dễ bị bỏ sót",
  machineName: "HỘP CA KIỂM THỬ",
  machineBlurb: "chạy cùng một thuật toán với nhiều dữ liệu để tìm lỗi trước khi người dùng gặp phải",
  cells: [
    { quiz: { title: "Ôn bảng trạng thái", questions: [
      { q: "Cho `values = [2, 6, 1]`. Thuật toán cộng dồn in `index value total` sau mỗi lượt. Dòng cuối là gì?", a: ["`2 1 9`", "`2 1 1`", "`1 6 8`"], correct: 0 },
      { q: "Một thuật toán tìm lớn nhất trên `[5, 3, 8]` ghi `best` là `5, 3, 8`. Bảng cho thấy lỗi đầu tiên ở đâu?", a: ["Lượt đọc số 3", "Lượt đọc số 5", "Lượt đọc số 8"], correct: 0 },
    ] } },
    { npc: "Một ví dụ chạy đúng chưa chứng minh chương trình luôn đúng. Lỗi thường xuất hiện khi dữ liệu rỗng, chỉ có một phần tử, có giá trị trùng hoặc không có kết quả cần tìm." },
    { npc: "Ca kiểm thử gồm dữ liệu dùng để chạy chương trình và kết quả mong đợi. Một bộ test có hệ thống kết hợp ca thường, ca sát ranh giới và trường hợp đặc biệt." },
    { code: `def contains(values, target):
    for value in values:
        if value == target:
            return True
    return False

print(contains([3, 7, 9], 7))
print(contains([3, 7, 9], 4))
print(contains([], 4))
`, label: "search_tests.py", note: "RUN KIỂM CHỨNG\nCho sẵn ba ca kiểm thử; không có INPUT. PROCESS: cùng hàm `contains` phải xử lý ca tìm thấy, không tìm thấy và list rỗng. OUTPUT là `True`, `False`, `False`.", expectOut: { all: [{ minLines: 3 }, /^True$/, /^False$/] }, solution: `def contains(values, target):
    for value in values:
        if value == target:
            return True
    return False

print(contains([3, 7, 9], 7))
print(contains([3, 7, 9], 4))
print(contains([], 4))
` },
    { npc: "Nếu đặt `return False` bên trong vòng lặp, hàm sẽ bỏ cuộc ngay sau phần tử đầu tiên. Test chỉ tìm phần tử đầu sẽ không phát hiện lỗi này; cần thêm ca mà đáp án nằm ở cuối list." },
    { code: `def contains(values, target):
    for value in values:
        if value == target:
            return True
        return False

print(contains([2, 5, 8], 8))
`, label: "late_match_fix.py", note: "ĐỀ BÀI\nCho sẵn list `[2, 5, 8]` và mục tiêu 8; không có INPUT. Chương trình đang kết luận quá sớm. Sửa vị trí `return False` để PROCESS kiểm tra hết list trước khi kết luận không tìm thấy. OUTPUT đúng là `True`.", expectOut: /^True$/, solution: `def contains(values, target):
    for value in values:
        if value == target:
            return True
    return False

print(contains([2, 5, 8], 8))
` },
    { checkpoint: { text: "Một bộ test cần nhiều loại ca: ca thường, dữ liệu rỗng hoặc chỉ có một phần tử, dữ liệu trùng, mục tiêu vắng mặt và giá trị nằm ở đầu hoặc cuối. Mỗi ca phải có kết quả mong đợi cụ thể." } },
    { quiz: { title: "Chọn ca có sức phát hiện lỗi", questions: [
      { q: "Một hàm tìm số 9 đang được thử bằng `[9, 2, 4]`. Muốn phát hiện lỗi hàm chỉ kiểm tra phần tử đầu rồi dừng, nên thêm ca nào?", a: ["Tìm 9 trong `[2, 4, 9]` và mong đợi `True`", "Tìm 9 trong `[9]` và mong đợi `True`", "Chạy lại đúng `[9, 2, 4]`"], correct: 0 },
      { q: "Hàm đếm số lần xuất hiện đã qua test `[1, 2, 3]` với mục tiêu 2. Ca nào kiểm tra trực tiếp việc xử lý dữ liệu trùng?", a: ["Đếm 2 trong `[2, 1, 2, 2]` và mong đợi 3", "Đếm 4 trong `[1, 2, 3]` và mong đợi 0", "Đếm 2 trong `[2]` và mong đợi 1"], correct: 0 },
    ] } },
    { npc: "Test ranh giới dùng chính giá trị ở mốc và các giá trị ngay hai bên. Với luật từ 10 điểm thì đậu, ba điểm cần thử là 9, 10 và 11." },
    { code: `def result(score):
    if score >= 10:
        return "PASS"
    return "TRY AGAIN"

tests = [9, 10, 11]
for score in tests:
    print(score, result(score))
`, label: "boundary_tests.py", note: "XƯỞNG PHÉP\nCho sẵn luật đạt từ 10 điểm và ba điểm sát mốc; không có INPUT. PROCESS: chạy hàm với 9, 10, 11. OUTPUT là `9 TRY AGAIN`, `10 PASS`, `11 PASS`.", expectOut: { all: [{ minLines: 3 }, /^9 TRY AGAIN$/, /^10 PASS$/, /^11 PASS$/] }, solution: `def result(score):
    if score >= 10:
        return "PASS"
    return "TRY AGAIN"

tests = [9, 10, 11]
for score in tests:
    print(score, result(score))
` },
    { checkpoint: { text: "Với một mốc quyết định, hãy thử giá trị ngay dưới mốc, đúng bằng mốc và ngay trên mốc. Ba ca này phân biệt rõ lỗi dùng `>` thay cho `>=` hoặc ngược lại." } },
    { quiz: { title: "Kiểm tra đúng ranh giới", questions: [
      { q: "Luật miễn phí vận chuyển là `total >= 100`. Bộ ba nào kiểm tra sát ranh giới nhất?", a: ["99, 100, 101", "1, 50, 500", "100, 200, 300"], correct: 0 },
      { q: "Chương trình dùng `age > 12` cho luật \"từ 12 tuổi được vào\". Ca nào trực tiếp chứng minh điều kiện đang sai?", a: ["`age = 12` phải được vào nhưng chương trình từ chối", "`age = 20` được vào", "`age = 5` bị từ chối"], correct: 0 },
    ] } },
  ],
});
