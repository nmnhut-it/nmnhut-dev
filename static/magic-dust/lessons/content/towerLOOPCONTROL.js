import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut, sampleInput) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut, sampleInput });
const tasks = [
  t(1, "Dừng Ở Mốc", "loop01.py", "for number in range(1, 10):\n    # In đến 4 rồi dừng.\n", "ĐỀ BÀI\nKhông có INPUT. PROCESS: in mỗi số; sau khi in 4 thì `break`. OUTPUT có đúng bốn dòng 1, 2, 3, 4.", "for number in range(1, 10):\n    print(number)\n    if number == 4:\n        break\n", { all: [{ minLines: 4 }, /^1$/, /^2$/, /^3$/, /^4$/] }),
  t(2, "Bỏ Qua Ký Tự X", "loop02.py", "for letter in \"AXXBXC\":\n    # Bỏ X, in các ký tự còn lại.\n", "ĐỀ BÀI\nCho sẵn chuỗi `AXXBXC`; không có INPUT. PROCESS: khi ký tự là X thì `continue`. OUTPUT là A, B, C.", "for letter in \"AXXBXC\":\n    if letter == \"X\":\n        continue\n    print(letter)\n", { all: [{ minLines: 3 }, /^A$/, /^B$/, /^C$/] }),
  t(3, "Vòng Đếm Không Ghi Điều Kiện", "loop03.py", "count = 1\nwhile True:\n    # In 1 tới 5 rồi thoát.\n", "ĐỀ BÀI\nCho sẵn count 1; không có INPUT. PROCESS: dùng `while True`, tăng count, `break` sau khi in 5. OUTPUT có năm dòng 1 đến 5.", "count = 1\nwhile True:\n    print(count)\n    if count == 5:\n        break\n    count += 1\n", { all: [{ minLines: 5 }, /^1$/, /^2$/, /^3$/, /^4$/, /^5$/] }),
  t(4, "Break Chỉ Thoát Vòng Gần Nhất", "loop04.py", "for row in range(1, 4):\n    for col in range(1, 5):\n        # Chỉ in col 1 và 2 của mỗi row.\n", "ĐỀ BÀI\nKhông có INPUT. PROCESS: vòng trong `break` khi col bằng 3; vòng ngoài vẫn chạy đủ ba row. OUTPUT là `1 1`, `1 2`, `2 1`, `2 2`, `3 1`, `3 2`.", "for row in range(1, 4):\n    for col in range(1, 5):\n        if col == 3:\n            break\n        print(row, col)\n", { all: [{ minLines: 6 }, /^1 1$/, /^1 2$/, /^2 1$/, /^2 2$/, /^3 1$/, /^3 2$/] }),
  t(6, "Hỏi Cho Tới Khi YES", "loop06.py", "while True:\n    answer = input(\"YES? \" )\n    # Sai thì in RETRY; đúng thì thoát.\n", "ĐỀ BÀI\nHai INPUT thật là `NO`, `YES`. PROCESS: `while True`, nếu chưa đúng in RETRY và tiếp tục; đúng thì break. Sau vòng in ACCEPT. OUTPUT là RETRY rồi ACCEPT.", "while True:\n    answer = input(\"YES? \" )\n    if answer == \"YES\":\n        break\n    print(\"RETRY\")\nprint(\"ACCEPT\")\n", { all: [{ minLines: 2 }, /^RETRY$/, /^ACCEPT$/] }, ["NO", "YES"]),
  t(7, "Bỏ Hai Mốc", "loop07.py", "for number in range(1, 8):\n    # Không in 3 và 6.\n", "ĐỀ BÀI\nKhông có INPUT. PROCESS: dùng một điều kiện với `or` và `continue` để bỏ 3, 6. OUTPUT là 1, 2, 4, 5, 7.", "for number in range(1, 8):\n    if number == 3 or number == 6:\n        continue\n    print(number)\n", { all: [{ minLines: 5 }, /^1$/, /^2$/, /^4$/, /^5$/, /^7$/] }),
  t(8, "Tìm Ký Tự Đầu Tiên", "loop08.py", "text = \"KOTOPIA\"\nfor letter in text:\n    # Gặp T thì in FOUND và dừng.\n", "ĐỀ BÀI\nCho sẵn KOTOPIA; không có INPUT. PROCESS: duyệt ký tự, khi gặp T in FOUND và break. OUTPUT chỉ là FOUND.", "text = \"KOTOPIA\"\nfor letter in text:\n    if letter == \"T\":\n        print(\"FOUND\")\n        break\n", /^FOUND$/),
  t(9, "Bộ Lọc Có Giới Hạn", "loop09.py", "printed = 0\nfor number in range(1, 20):\n    # Bỏ số 2, dừng sau khi đã in ba số khác.\n", "ĐỀ BÀI\nKhông có INPUT. PROCESS: bỏ số 2 bằng continue, đếm số dòng đã in, break khi đủ ba dòng. OUTPUT là 1, 3, 4.", "printed = 0\nfor number in range(1, 20):\n    if number == 2:\n        continue\n    print(number)\n    printed += 1\n    if printed == 3:\n        break\n", { all: [{ minLines: 3 }, /^1$/, /^3$/, /^4$/] }),
];
const explanations = {
  1: [
    { match: "for number", text: "Vòng `for` chuẩn bị đưa `number` qua 1 đến 9, nhưng `break` có thể kết thúc trước khi dùng hết khoảng này." },
    { match: "print(number)", text: "In số hiện tại trước khi kiểm tra mốc, vì đề yêu cầu số 4 vẫn phải xuất hiện." },
    { match: "if number ==", text: "Sau mỗi lần in, kiểm tra xem số hiện tại đã chạm mốc 4 chưa." },
    { match: "break", text: "Khi `number` là 4, `break` kết thúc vòng lặp; vì vậy 5 đến 9 không được in." },
  ],
  2: [
    { match: "for letter", text: "Duyệt từng ký tự của chuỗi theo đúng thứ tự A, X, X, B, X, C." },
    { match: "if letter", text: "Mỗi lượt kiểm tra ký tự hiện tại có đúng là `X` cần bỏ hay không." },
    { match: "continue", text: "Với `X`, bỏ phần còn lại của lượt đó và chuyển sang ký tự kế tiếp, nên dòng print bên dưới không chạy." },
    { match: "print(letter)", text: "Chỉ A, B và C đi tới dòng này, tạo đúng ba dòng OUTPUT." },
  ],
  3: [
    { match: "count =", text: "Bắt đầu biến đếm ở 1, là số đầu tiên cần in." },
    { match: "while True", text: "Tạo vòng lặp không có điều kiện dừng ở đầu; đường thoát phải nằm trong thân vòng." },
    { match: "print(count)", text: "In giá trị hiện tại trước khi quyết định dừng, nên số 5 vẫn xuất hiện." },
    { match: "if count", text: "Kiểm tra mốc 5 ngay sau khi in nó." },
    { match: "break", text: "Khi đạt 5, thoát vòng trước khi chạy dòng tăng bên dưới." },
    { match: "count +=", text: "Ở các lượt 1 đến 4, tăng `count` để lần sau tiến tới số kế tiếp; dòng này không chạy sau mốc 5." },
  ],
  4: [
    { match: "for row", text: "Vòng ngoài tạo ba hàng với `row` là 1, 2, 3." },
    { match: "for col", text: "Với mỗi hàng, vòng trong bắt đầu duyệt cột từ 1." },
    { match: "if col", text: "Khi cột tiến tới 3, điều kiện đúng trước khi dòng in được chạy." },
    { match: "break", text: "`break` chỉ kết thúc vòng `for col` gần nhất; vòng `for row` vẫn chuyển sang hàng tiếp theo." },
    { match: "print(row", text: "Chỉ các cột 1 và 2 đi tới đây, nên mỗi hàng tạo đúng hai cặp OUTPUT." },
  ],
  6: [
    { match: "while True", text: "Vì chưa biết người dùng sẽ trả lời đúng ở lần thứ mấy, chương trình lặp cho tới khi tự gọi `break`." },
    { match: "answer = input", text: "Mỗi lượt đọc một INPUT mới; lần đầu là `NO`, lần sau là `YES`." },
    { match: "if answer", text: "So sánh nguyên chuỗi vừa đọc với mật hiệu chính xác `YES`." },
    { match: "break", text: "Lần thứ hai điều kiện đúng, nên thoát vòng và không hỏi thêm." },
    { match: "print(\"RETRY", text: "Dòng này chỉ chạy sau một câu trả lời sai; với dữ liệu mẫu, nó chạy đúng một lần cho `NO`." },
    { match: "print(\"ACCEPT", text: "Dòng ngoài vòng lặp chỉ chạy sau khi đã nhận `YES`, xác nhận kết quả cuối cùng." },
  ],
  7: [
    { match: "for number", text: "Duyệt đầy đủ các số từ 1 đến 7; việc bỏ số xảy ra bên trong vòng." },
    { match: "if number", text: "Điều kiện dùng `or` để nhận hai mốc riêng biệt: 3 hoặc 6." },
    { match: "continue", text: "Khi gặp một trong hai mốc, chuyển ngay sang lượt kế tiếp nên không in số đó." },
    { match: "print(number)", text: "Các số còn lại 1, 2, 4, 5, 7 đi tới dòng này theo thứ tự ban đầu." },
  ],
  8: [
    { match: "text =", text: "`text` giữ chuỗi KOTOPIA cần dò từ trái sang phải." },
    { match: "for letter", text: "`letter` lần lượt nhận K, O, rồi T; vòng không cần đọc các ký tự sau khi tìm thấy." },
    { match: "if letter", text: "Kiểm tra ký tự hiện tại có phải chữ T đang tìm hay không." },
    { match: "print(\"FOUND", text: "Chỉ khi gặp T mới in thông báo tìm thấy." },
    { match: "break", text: "Thoát ngay sau kết quả đầu tiên, nên chương trình không tiếp tục duyệt OPIA." },
  ],
  9: [
    { match: "printed =", text: "`printed` đếm số dòng thật sự đã in, không đếm các lượt bị bỏ qua." },
    { match: "for number", text: "Khoảng đến 19 đủ dài; vòng sẽ được kết thúc sớm khi đạt đủ ba kết quả." },
    { match: "if number == 2", text: "Nhận riêng số 2 là giá trị không được phép in." },
    { match: "continue", text: "Bỏ số 2 và cả phần tăng `printed` của lượt đó, vì chưa tạo OUTPUT." },
    { match: "print(number)", text: "In các số hợp lệ theo thứ tự; ba số đầu tiên là 1, 3, 4." },
    { match: "printed +=", text: "Chỉ tăng bộ đếm sau khi đã in thành công một dòng." },
    { match: "if printed", text: "Kiểm tra đã đủ ba dòng yêu cầu hay chưa." },
    { match: "break", text: "Sau dòng thứ ba, thoát vòng để không in thêm 5, 6 và các số sau." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });
const bosses = {
  5: { name: "KẺ GIỮ VÒNG", glyph: "↻", quiz: [
    { q: "Từ khóa nào kết thúc toàn bộ vòng lặp gần nhất?", a: ["`break`", "`continue`", "`elif`"], correct: 0 },
    { q: "Từ khóa nào chỉ bỏ phần còn lại của lượt hiện tại?", a: ["`continue`", "`break`", "`return`"], correct: 0 },
    { q: "`while True` cần gì để không lặp mãi?", a: ["Một đường đi tới `break`", "Một dòng `continue`", "Một nhánh `else`"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP VÒNG LẶP", glyph: "∞", quiz: [
    { q: "Trong hai vòng lồng nhau, `break` nằm trong vòng trong sẽ làm gì?", a: ["Chỉ thoát vòng trong", "Thoát cả hai vòng", "Khởi động lại vòng ngoài"], correct: 0 },
    { q: "Chương trình phải hỏi lại khi INPUT là `NO` và dừng hỏi khi INPUT là `YES`. Mẫu nào thực hiện đúng hành vi đó?", a: ["`while True` và `break` khi câu trả lời là `YES`", "Một `if` chạy đúng một lần", "`continue` đặt ngoài mọi vòng lặp"], correct: 0 },
    { q: "Sau `continue`, các dòng còn lại trong lượt hiện tại có chạy không?", a: ["Không", "Có, luôn luôn", "Chỉ chạy với for"], correct: 0 },
  ] },
};
export default makeTower({ id: "towerLOOPCONTROL", title: "THÁP ĐIỀU KHIỂN VÒNG", subtitle: "10 tầng break, continue và while True", intro: "Tòa tháp này dùng lại đúng ba công cụ của NHÁNH ĐIỀU KHIỂN VÒNG LẶP. Bài tập buộc bạn phân biệt thoát cả vòng với bỏ một lượt.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
