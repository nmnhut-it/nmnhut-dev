import { code, makePython50Lesson } from "./python50-template.js";
const primeCode = number => code(["from old_computer import say", "", "number = " + number, "count = 0", "", "for factor in range(1, number + 1):", "    if number % factor == 0:", "        count = count + 1", "", "if number > 1 and count == 2:", "    say(\"SỐ NGUYÊN TỐ\")", "else:", "    say(\"KHÔNG PHẢI\")"]);
export default makePython50Lesson(7, {
  subtitle: "đếm ước để nhận ra số nguyên tố",
  machineName: "KÍNH NGUYÊN TỐ", machineBlurb: "đếm ước rồi kiểm tra đúng hai ước",
  intro: "Số nguyên tố là số nguyên lớn hơn 1 và chỉ có hai ước dương: 1 và chính nó. Ví dụ 7 là nguyên tố; 1 và 9 không phải.",
  prior: ["Đếm các ước dương của 9: 1, 3, 9. Vì sao 9 không nguyên tố?", ["Vì có 3 ước", "Vì là số lẻ", "Vì lớn hơn 1"]],
  teach: "Thử từng `factor`; nếu chia `number` cho `factor` có phần dư 0 thì tăng số ước. Chỉ kết luận nguyên tố khi `number > 1` và có hai ước.",
  demo: { starter: primeCode(7), label: "p50_prime_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn số 7; bài này không đọc INPUT. Chương trình tìm được hai ước 1 và 7, nên OUTPUT đúng là `SỐ NGUYÊN TỐ`.", expectOut: /^SỐ NGUYÊN TỐ$/ },
  fix: { starter: primeCode(1).replace("number > 1 and count == 2", "count == 1"), solution: primeCode(1), label: "p50_prime_one_fix.py", note: "ĐỀ BÀI: Cho sẵn số 1; bài này không đọc INPUT. Sửa điều kiện để 1 không bị nhận nhầm là số nguyên tố. OUTPUT đúng là `KHÔNG PHẢI`.", expectOut: /^KHÔNG PHẢI$/ },
  check: "Số nguyên tố phải đồng thời lớn hơn 1 và có đúng hai ước. Số 1 chỉ có một ước nên không phải số nguyên tố.",
  quiz: ["Số 13 có các ước 1 và 13. Điều kiện `number > 1 and count == 2` cho kết quả gì?", ["`True`, nên 13 là số nguyên tố", "`False`, vì 13 là số lẻ", "`False`, vì 13 có hai chữ số"]],
  apply: { starter: code(["from old_computer import read_num, say","","number = read_num(\"Số nguyên: \")","count = 0","","for factor in range(1, number + 1):","    if number % factor == 0:","        count = count + 1","","if number > 1 and count == 3:","    say(\"SỐ NGUYÊN TỐ\")","else:","    say(\"KHÔNG PHẢI\")"]), solution: code(["from old_computer import read_num, say","","number = read_num(\"Số nguyên: \")","count = 0","","for factor in range(1, number + 1):","    if number % factor == 0:","        count = count + 1","","if number > 1 and count == 2:","    say(\"SỐ NGUYÊN TỐ\")","else:","    say(\"KHÔNG PHẢI\")"]), label: "p50_prime_input.py", note: "ĐỀ BÀI: Chương trình đọc INPUT mẫu là số 13 và đã đếm số ước. Sửa điều kiện phân loại để số nguyên lớn hơn 1 có đúng hai ước tạo OUTPUT `SỐ NGUYÊN TỐ`.", sampleInput: "13", expectOut: /^SỐ NGUYÊN TỐ$/ },
  remember: "Định nghĩa trở thành hai phép kiểm tra cụ thể: giá trị lớn hơn 1 và số lượng ước dương đúng bằng 2."
});
