import { code, makePython50Lesson } from "./python50-template.js";
const scan = values => code(["from old_computer import say_num", "", "values = [" + values + "]", "largest = values[0]", "second = None", "", "for value in values:", "    if value > largest:", "        second = largest", "        largest = value", "    elif value < largest and (second is None or value > second):", "        second = value", "", "if second is None:", "    say_num(-1)", "else:", "    say_num(second)"]);
export default makePython50Lesson(9, {
  subtitle: "tìm giá trị lớn thứ hai không trùng giá trị lớn nhất",
  machineName: "MÁY TRAO HUY CHƯƠNG", machineBlurb: "giữ hai mức điểm cao nhất khác nhau",
  intro: "Máy trao hai huy chương theo hai mức điểm khác nhau. Nếu điểm cao nhất xuất hiện nhiều lần, các bản sao vẫn chỉ tính là một mức điểm.",
  prior: ["Trong các mức điểm 8, 8, 5, nếu hai hạng phải có điểm khác nhau thì số nào đứng hạng nhì?", ["`5`", "`8`", "Không có"]],
  teach: "`largest` giữ mức điểm cao nhất. `second` chỉ nhận giá trị nhỏ hơn `largest` nhưng lớn hơn mức điểm thứ hai đang giữ. Giá trị bằng `largest` bị bỏ qua.",
  demo: { starter: scan("4, 9, 7, 9, 3"), label: "p50_second_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn năm mức điểm; bài này không đọc INPUT. Hạng nhất là 9, còn hạng nhì là 7, nên OUTPUT đúng là `7`.", expectOut: /^7$/ },
  fix: { starter: scan("5, 5, 5").replace("if second is None:", "if second is not None:"), solution: scan("5, 5, 5"), label: "p50_second_equal_fix.py", note: "ĐỀ BÀI: Cho sẵn ba mức điểm đều bằng 5; bài này không đọc INPUT. Sửa điều kiện kiểm tra `second` ở cuối chương trình. Không có mức điểm thứ hai nên OUTPUT là `-1`.", expectOut: /^-1$/ },
  check: "Giá trị lớn thứ hai phải nhỏ hơn giá trị lớn nhất. Nếu mọi phần tử bằng nhau, `second` vẫn là `None` và chương trình in `-1`.",
  quiz: ["Cho list `[10, 6, 10, 8]`. Nếu hai hạng phải có mức điểm khác nhau, giá trị lớn thứ hai là số nào?", ["`8`", "`10`", "`6`"]],
  apply: { starter: scan("-3, -8, -5, -3").replace("value < largest", "value <= largest"), solution: scan("-3, -8, -5, -3"), label: "p50_second_negative.py", note: "ĐỀ BÀI: Cho sẵn list số âm `[-3, -8, -5, -3]`; bài này không đọc INPUT. Sửa phép so sánh để bản sao của hạng nhất không được nhận làm hạng nhì. OUTPUT đúng là `-5`.", expectOut: /^-5$/ },
  remember: "Trước khi viết code, cần xác định các vị trí xếp hạng có được dùng cùng một giá trị hay không. Bài này yêu cầu hai mức điểm khác nhau."
});
