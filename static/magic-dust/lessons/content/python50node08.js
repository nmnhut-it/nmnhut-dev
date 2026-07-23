import { code, makePython50Lesson } from "./python50-template.js";
export default makePython50Lesson(8, {
  subtitle: "quét list không rỗng để tính tổng và cực trị",
  machineName: "MÁY QUÉT LIST", machineBlurb: "đi qua từng phần tử đúng một lần",
  intro: "Một vòng quét có thể trả lời nhiều câu hỏi về cùng một list. Bạn sẽ luyện ba việc khác nhau: tính tổng, đếm số chẵn và tìm số lớn nhất.",
  prior: ["Cho `values = [4, 7, 2]`. Vòng `for value in values` đọc các giá trị theo thứ tự nào?", ["`4, 7, 2`", "`2, 7, 4`", "`0, 1, 2`"]],
  teach: "Với list không rỗng, đặt `largest = values[0]` rồi so từng phần tử. Tổng bắt đầu từ 0; số chẵn thỏa `value % 2 == 0`.",
  demo: { starter: code(["from old_computer import say_num","","values = [4, 7, 2, 9]","total = 0","","for value in values:","    total = total + value","","say_num(total)"]), label: "p50_list_total_demo.py", note: "Bạn bấm RUN để kiểm chứng đoạn code. Cho sẵn list `[4, 7, 2, 9]`; bài này không đọc INPUT. Chương trình cộng từng `value` vào `total`, nên OUTPUT đúng là `22`.", expectOut: /^22$/ },
  fix: { starter: code(["from old_computer import say_num","","values = [4, 7, 2, 9]","even_count = 0","","for value in values:","    if value % 2 == 1:","        even_count = even_count + 1","","say_num(even_count)"]), solution: code(["from old_computer import say_num","","values = [4, 7, 2, 9]","even_count = 0","","for value in values:","    if value % 2 == 0:","        even_count = even_count + 1","","say_num(even_count)"]), label: "p50_even_count_fix.py", note: "ĐỀ BÀI: Cho sẵn list `[4, 7, 2, 9]`; bài này không đọc INPUT. Sửa điều kiện để đếm hai số chẵn 4 và 2. OUTPUT đúng là `2`.", expectOut: /^2$/ },
  check: "List của bài được cho sẵn và không rỗng. Tổng bắt đầu từ 0; cực trị bắt đầu từ phần tử đầu, không bắt đầu từ một số đoán trước.",
  quiz: ["Cho `values = [-5, -2, -9]`. Vì sao nên đặt `largest = values[0]` thay vì `largest = 0`?", ["Vì mọi số trong list đều nhỏ hơn 0", "Vì list có ba phần tử", "Vì 0 là số chẵn"]],
  apply: { starter: code(["from old_computer import say_num","","values = [-5, -2, -9]","largest = 0","","for value in values:","    if value > largest:","        largest = value","","say_num(largest)"]), solution: code(["from old_computer import say_num","","values = [-5, -2, -9]","largest = values[0]","","for value in values:","    if value > largest:","        largest = value","","say_num(largest)"]), label: "p50_list_largest.py", note: "ĐỀ BÀI: Cho sẵn list không rỗng `[-5, -2, -9]`; bài này không đọc INPUT. Sửa giá trị khởi tạo của `largest` để vòng quét tìm đúng số lớn nhất. OUTPUT đúng là `-2`.", expectOut: /^-2$/ },
  remember: "Một vòng quét có thể tích lũy tổng, đếm phần tử đạt điều kiện hoặc cập nhật giá trị lớn nhất."
});
