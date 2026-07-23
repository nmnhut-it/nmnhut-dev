import { code, makePython50Lesson } from "./python50-template.js";
const solution = code(["from old_computer import say","","year = 1900","","if year % 400 == 0:","    say(\"NHUẬN\")","elif year % 100 == 0:","    say(\"KHÔNG NHUẬN\")","elif year % 4 == 0:","    say(\"NHUẬN\")","else:","    say(\"KHÔNG NHUẬN\")"]);
export default makePython50Lesson(5, {
  subtitle: "kết hợp các quy tắc chia hết",
  machineName: "LỊCH BỐN MÙA", machineBlurb: "xét các trường hợp năm nhuận theo đúng thứ tự",
  intro: "Năm nhuận không chỉ là năm chia hết cho 4. Ví dụ: 2024 và 2000 là năm nhuận, nhưng năm tròn thế kỷ 1900 không nhuận.",
  prior: ["Năm 2024 chia hết cho 4 nhưng không chia hết cho 100. Kết luận nào đúng?", ["Năm nhuận", "Không nhuận", "Chưa đủ dữ kiện"]],
  teach: "Chia hết cho 400: nhuận. Nếu không, chia hết cho 100: không nhuận. Các năm còn lại chia hết cho 4: nhuận.",
  demo: { starter: solution.replace("1900", "2000"), label: "p50_leap_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn năm 2000; bài này không đọc INPUT. Năm 2000 chia hết cho 400 nên vào nhánh đầu, và OUTPUT đúng là `NHUẬN`.", expectOut: /^NHUẬN$/ },
  fix: { starter: code(["from old_computer import say","","year = 1900","","if year % 4 == 0:","    say(\"NHUẬN\")","elif year % 100 == 0:","    say(\"KHÔNG NHUẬN\")"]), solution, label: "p50_leap_order_fix.py", note: "ĐỀ BÀI: Cho sẵn năm 1900; bài này không đọc INPUT. Viết lại các nhánh để xử lý năm tròn thế kỷ trước khi xét chia hết cho 4. OUTPUT đúng là `KHÔNG NHUẬN`.", expectOut: /^KHÔNG NHUẬN$/ },
  check: "Phải xét chia hết cho 400 và 100 trước khi xét chia hết cho 4, vì năm tròn thế kỷ là trường hợp đặc biệt.",
  quiz: ["Một năm nhuận nếu chia hết cho 400, hoặc chia hết cho 4 nhưng không chia hết cho 100. Theo quy tắc này, năm 2100 thuộc trường hợp nào?", ["Chia hết cho 100 nhưng không chia hết cho 400, nên không nhuận", "Chia hết cho 4 nên luôn nhuận", "Không chia hết cho 4"]],
  apply: { starter: code(["from old_computer import read_num, say","","year = read_num(\"Năm: \")","","if year % 400 == 0:","    say(\"NHUẬN\")","elif year % 100 == 0:","    say(\"KHÔNG NHUẬN\")","elif year % 4 == 1:","    say(\"NHUẬN\")","else:","    say(\"KHÔNG NHUẬN\")"]), solution: code(["from old_computer import read_num, say","","year = read_num(\"Năm: \")","","if year % 400 == 0:","    say(\"NHUẬN\")","elif year % 100 == 0:","    say(\"KHÔNG NHUẬN\")","elif year % 4 == 0:","    say(\"NHUẬN\")","else:","    say(\"KHÔNG NHUẬN\")"]), label: "p50_leap_input.py", note: "ĐỀ BÀI: Chương trình đọc INPUT mẫu là năm 2028. Sửa điều kiện của nhánh xét chia hết cho 4 để OUTPUT đúng là `NHUẬN`.", sampleInput: "2028", expectOut: /^NHUẬN$/ },
  remember: "Khi nhiều điều kiện có quan hệ bao gồm nhau, đặt trường hợp đặc biệt hơn ở phía trước."
});
