import { code, makePython50Lesson } from "./python50-template.js";
export default makePython50Lesson(6, {
  subtitle: "liệt kê ước bằng for, range và %",
  machineName: "XƯỞNG ƯỚC SỐ", machineBlurb: "thử từng ứng viên từ 1 đến số đã cho",
  intro: "Một ước phải chia số đã cho mà không để lại phần dư. Vòng `for` giúp thử mọi ứng viên theo thứ tự.",
  prior: ["Với `number = 18`, ứng viên 6 có phải ước không?", ["Có, vì `18 % 6 == 0`", "Không, vì 6 nhỏ hơn 18", "Không, vì 18 là số chẵn"]],
  teach: "Dùng `range(1, number + 1)` để thử đến chính `number`. Chỉ in `factor` khi `number % factor == 0`.",
  demo: { starter: code(["from old_computer import say_num","","number = 12","","for factor in range(1, number + 1):","    if number % factor == 0:","        say_num(factor)"]), label: "p50_factors_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn số 12; bài này không đọc INPUT. Chương trình thử các giá trị từ 1 đến 12, nên OUTPUT gồm `1, 2, 3, 4, 6, 12`.", expectOut: {all:[{minLines:6},/^1$/, /^2$/, /^3$/, /^4$/, /^6$/, /^12$/]} },
  fix: { starter: code(["from old_computer import say_num","","number = 10","","for factor in range(1, number):","    if number % factor == 1:","        say_num(factor)"]), solution: code(["from old_computer import say_num","","number = 10","","for factor in range(1, number + 1):","    if number % factor == 0:","        say_num(factor)"]), label: "p50_factors_fix.py", note: "ĐỀ BÀI: Cho sẵn số 10; bài này không đọc INPUT. Sửa mốc cuối và điều kiện chia hết để OUTPUT gồm `1, 2, 5, 10`.", expectOut: {all:[{minLines:4},/^1$/, /^2$/, /^5$/, /^10$/]} },
  check: "`range` dừng trước mốc cuối, nên cần `number + 1`. Phần dư bằng 0 là dấu hiệu chia hết.",
  quiz: ["Đoạn code thử `factor` từ 1 đến 15. Điều kiện nào chỉ giữ các ước của 15?", ["`15 % factor == 0`", "`factor % 15 == 0`", "`15 % factor == 1`"]],
  apply: { starter: code(["from old_computer import read_num, say_num","","number = read_num(\"Số nguyên dương: \")","count = 0","","for factor in range(1, number + 1):","    if number % factor == 0:","        count = count + 0","","say_num(count)"]), solution: code(["from old_computer import read_num, say_num","","number = read_num(\"Số nguyên dương: \")","count = 0","","for factor in range(1, number + 1):","    if number % factor == 0:","        count = count + 1","","say_num(count)"]), label: "p50_factor_count_input.py", note: "ĐỀ BÀI: Chương trình đọc INPUT mẫu là số nguyên dương 16. Sửa dòng cập nhật `count` để đếm các ước tìm được. OUTPUT đúng là `5`.", sampleInput: "16", expectOut: /^5$/ },
  remember: "Liệt kê ước là một mẫu quét: tạo dãy ứng viên, kiểm tra chia hết, rồi giữ hoặc đếm ứng viên đạt điều kiện."
});
