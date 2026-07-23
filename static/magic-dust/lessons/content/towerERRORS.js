import { makeTower } from "./python-path-builders.js";

const t = (floorNum, title, label, starter, note, solution, expectOut, sampleInput) => ({ floorNum, title: `TẦNG ${floorNum} — ${title}`, label, starter, note, solution, expectOut, sampleInput });
const tasks = [
  t(1, "Chuỗi Không Phải Số", "err01.py", "text = \"abc\"\n# Thử int; lỗi thì in INVALID.\n", "ĐỀ BÀI\nCho sẵn abc; không có INPUT. PROCESS: `try` đổi int, `except ValueError` in INVALID. OUTPUT phải là INVALID.", "text = \"abc\"\ntry:\n    number = int(text)\n    print(number)\nexcept ValueError:\n    print(\"INVALID\")\n", /^INVALID$/),
  t(2, "Float Hợp Lệ", "err02.py", "text = \"3.25\"\n# Chuyển float trong try, nhân 2 ngoài khối.\n", "ĐỀ BÀI\nCho sẵn 3.25; không có INPUT. PROCESS: bắt ValueError cho phép chuyển float, sau đó nhân 2. OUTPUT phải là 6.5.", "text = \"3.25\"\ntry:\n    value = float(text)\nexcept ValueError:\n    print(\"INVALID\")\nprint(value * 2)\n", /^6\.5$/),
  t(3, "Chương Trình Vẫn Tiếp Tục", "err03.py", "text = \"7x\"\n# Bắt lỗi rồi luôn in DONE sau khối.\n", "ĐỀ BÀI\nCho sẵn 7x; không có INPUT. PROCESS: bắt ValueError, in RETRY; sau khối in DONE. OUTPUT là RETRY rồi DONE.", "text = \"7x\"\ntry:\n    print(int(text))\nexcept ValueError:\n    print(\"RETRY\")\nprint(\"DONE\")\n", { all: [{ minLines: 2 }, /^RETRY$/, /^DONE$/] }),
  t(4, "Hai Giá Trị Một Lỗi", "err04.py", "texts = [\"12\", \"bad\"]\n# Duyệt, mỗi giá trị thử đổi int.\n", "ĐỀ BÀI\nCho sẵn hai chuỗi; không có INPUT. PROCESS: trong mỗi lượt thử int, lỗi thì in INVALID. OUTPUT là 12 rồi INVALID.", "texts = [\"12\", \"bad\"]\nfor text in texts:\n    try:\n        print(int(text))\n    except ValueError:\n        print(\"INVALID\")\n", { all: [{ minLines: 2 }, /^12$/, /^INVALID$/] }),
  t(6, "Nhập Lại Số Nguyên", "err06.py", "while True:\n    text = input(\"Số: \" )\n    # Sai in RETRY; đúng thoát và in số.\n", "ĐỀ BÀI\nHai INPUT thật là x, 9. PROCESS: while True + try/except; break khi int thành công. OUTPUT là RETRY rồi VALUE 9.", "while True:\n    text = input(\"Số: \" )\n    try:\n        number = int(text)\n        break\n    except ValueError:\n        print(\"RETRY\")\nprint(\"VALUE\", number)\n", { all: [{ minLines: 2 }, /^RETRY$/, /^VALUE 9$/] }, ["x", "9"]),
  t(7, "Nhập Lại Số Thập Phân", "err07.py", "while True:\n    text = input(\"Giá: \" )\n    # Sai in BAD; đúng thoát rồi nhân 2.\n", "ĐỀ BÀI\nHai INPUT thật là no, 2.5. PROCESS: thử float, bắt ValueError, break khi đúng. OUTPUT là BAD rồi TOTAL 5.0.", "while True:\n    text = input(\"Giá: \" )\n    try:\n        price = float(text)\n        break\n    except ValueError:\n        print(\"BAD\")\nprint(\"TOTAL\", price * 2)\n", { all: [{ minLines: 2 }, /^BAD$/, /^TOTAL 5\.0$/] }, ["no", "2.5"]),
  t(8, "Đếm Dữ Liệu Hợp Lệ", "err08.py", "texts = [\"3\", \"x\", \"5\", \"?\"]\nvalid = 0\n# Thử int từng chuỗi; lỗi thì bỏ qua.\n", "ĐỀ BÀI\nCho sẵn bốn chuỗi; không có INPUT. PROCESS: try int, ValueError thì continue, đúng thì tăng valid. OUTPUT phải là 2.", "texts = [\"3\", \"x\", \"5\", \"?\"]\nvalid = 0\nfor text in texts:\n    try:\n        number = int(text)\n    except ValueError:\n        continue\n    valid += 1\nprint(valid)\n", /^2$/),
  t(9, "Tổng Các Số Hợp Lệ", "err09.py", "texts = [\"4\", \"bad\", \"6\"]\ntotal = 0\n# Chỉ cộng chuỗi đổi int thành công.\n", "ĐỀ BÀI\nCho sẵn ba chuỗi; không có INPUT. PROCESS: duyệt, try int, lỗi continue, đúng cộng vào total. OUTPUT phải là 10.", "texts = [\"4\", \"bad\", \"6\"]\ntotal = 0\nfor text in texts:\n    try:\n        number = int(text)\n    except ValueError:\n        continue\n    total += number\nprint(total)\n", /^10$/),
];
const explanations = {
  1: [
    { match: "text =", text: "`text` giữ chuỗi `abc`, một dữ liệu không thể biểu diễn số nguyên." },
    { match: "try:", text: "Chỉ đặt thao tác chuyển kiểu có nguy cơ lỗi vào khối `try`." },
    { match: "number =", text: "`int(text)` thử đổi `abc`; thao tác này phát sinh ValueError trước khi có giá trị gán cho `number`." },
    { match: "print(number)", text: "Dòng này chỉ chạy nếu chuyển đổi thành công; với `abc`, Python bỏ qua nó để tới `except`." },
    { match: "except ValueError", text: "Bắt đúng loại lỗi do giá trị không hợp lệ, thay vì che mọi loại lỗi khác." },
    { match: "print(\"INVALID", text: "Biến lỗi kỹ thuật thành OUTPUT dễ hiểu cho người dùng: dữ liệu hiện tại không phải số nguyên." },
  ],
  2: [
    { match: "text =", text: "Chuỗi `3.25` là một biểu diễn hợp lệ của số thập phân." },
    { match: "try:", text: "Khối `try` giới hạn vùng cần theo dõi lỗi ở đúng phép chuyển kiểu." },
    { match: "value =", text: "`float(text)` chuyển thành công chuỗi `3.25`, nên `value` nhận số 3.25." },
    { match: "except ValueError", text: "Nhánh này chỉ dùng nếu chuỗi không đổi được thành float; lần chạy hiện tại không đi vào đây." },
    { match: "print(\"INVALID", text: "Thông báo này bị bỏ qua vì phép chuyển kiểu không phát sinh ValueError." },
    { match: "print(value", text: "Sau khối xử lý lỗi, dùng giá trị đã chuyển để nhân 2 và in kết quả 6.5." },
  ],
  3: [
    { match: "text =", text: "`7x` có chữ x nên không phải dạng số nguyên hợp lệ." },
    { match: "try:", text: "Bắt đầu thử thao tác có thể thất bại." },
    { match: "print(int", text: "Python thử chuyển `7x` trước khi print; ValueError xảy ra nên chưa có số nào được in." },
    { match: "except ValueError", text: "Luồng chạy chuyển tới đây vì đúng loại ValueError đã được dự kiến." },
    { match: "print(\"RETRY", text: "In `RETRY` để cho biết dữ liệu cần được nhập hoặc sửa lại." },
    { match: "print(\"DONE", text: "Dòng nằm sau toàn bộ khối vẫn chạy, chứng minh chương trình đã xử lý lỗi thay vì bị dừng." },
  ],
  4: [
    { match: "texts =", text: "List cố ý trộn một chuỗi hợp lệ `12` và một chuỗi sai `bad`." },
    { match: "for text", text: "Xử lý độc lập từng chuỗi để một giá trị sai không làm mất kết quả của giá trị khác." },
    { match: "try:", text: "Mỗi lượt đều thử phép chuyển số của riêng `text` hiện tại." },
    { match: "print(int", text: "Với `12`, chuyển đổi thành công và in 12; với `bad`, lỗi xảy ra trước khi print." },
    { match: "except ValueError", text: "Chỉ lượt chứa `bad` đi vào nhánh xử lý này." },
    { match: "print(\"INVALID", text: "Thay vị trí dữ liệu sai bằng một dòng `INVALID`, nên OUTPUT vẫn có một dòng cho mỗi phần tử đầu vào." },
  ],
  6: [
    { match: "while True", text: "Số lần nhập chưa biết trước, nên lặp cho tới khi phép chuyển kiểu thành công." },
    { match: "text = input", text: "Mỗi lượt đọc một INPUT mới: lượt đầu `x`, lượt sau `9`." },
    { match: "try:", text: "Thử chuyển đúng INPUT của lượt hiện tại." },
    { match: "number = int", text: "Với `x` dòng này gây ValueError; với `9` nó gán số nguyên 9 vào `number`." },
    { match: "break", text: "Dòng chỉ được chạm tới sau một lần chuyển thành công, nên đây là vị trí an toàn để thoát vòng." },
    { match: "except ValueError", text: "Nhận lần nhập `x` không hợp lệ và giữ chương trình ở trong vòng lặp." },
    { match: "print(\"RETRY", text: "Báo cho người dùng biết cần thử lại; sau dòng này vòng tự quay về `input()`." },
    { match: "print(\"VALUE", text: "Chỉ chạy sau khi vòng đã thoát với một số hợp lệ, nên chắc chắn `number` đang giữ 9." },
  ],
  7: [
    { match: "while True", text: "Lặp vì người dùng có thể nhập sai nhiều lần trước khi đưa một giá hợp lệ." },
    { match: "text = input", text: "Đọc lần lượt `no` rồi `2.5` dưới dạng chuỗi." },
    { match: "try:", text: "Giới hạn phần có thể gây ValueError vào phép chuyển float." },
    { match: "price = float", text: "`no` thất bại; `2.5` chuyển thành số float và được giữ trong `price`." },
    { match: "break", text: "Thoát ngay sau khi `price` đã tồn tại với kiểu đúng." },
    { match: "except ValueError", text: "Bắt lần nhập `no` để chương trình không dừng." },
    { match: "print(\"BAD", text: "In một thông báo cho lần sai, rồi để vòng hỏi lại." },
    { match: "print(\"TOTAL", text: "Sau khi có giá 2.5, nhân 2 và in tổng 5.0; phép tính nằm ngoài except nên chỉ dùng dữ liệu hợp lệ." },
  ],
  8: [
    { match: "texts =", text: "List gồm hai chuỗi số và hai chuỗi không đổi được thành int." },
    { match: "valid =", text: "Bắt đầu số lượng hợp lệ ở 0." },
    { match: "for text", text: "Thử từng phần tử riêng, giữ cho một lỗi chỉ ảnh hưởng đúng lượt hiện tại." },
    { match: "try:", text: "Mỗi lượt đặt phép chuyển int trong vùng có xử lý lỗi." },
    { match: "number = int", text: "Chuỗi `3` và `5` tạo số; `x` và `?` phát sinh ValueError." },
    { match: "except ValueError", text: "Nhận hai phần tử sai mà không kết thúc cả vòng lặp." },
    { match: "continue", text: "Với dữ liệu sai, bỏ dòng tăng `valid` và chuyển sang phần tử kế tiếp." },
    { match: "valid +=", text: "Chỉ dữ liệu đã chuyển thành công mới đi tới đây, nên bộ đếm tăng đúng hai lần." },
    { match: "print(valid)", text: "In số lượng cuối cùng sau khi đã xét toàn bộ list: 2." },
  ],
  9: [
    { match: "texts =", text: "Ba chuỗi chứa hai số hợp lệ 4, 6 và một dữ liệu sai ở giữa." },
    { match: "total =", text: "Khởi tạo tổng ở 0 trước khi có số hợp lệ nào." },
    { match: "for text", text: "Duyệt theo thứ tự để thử chuyển từng chuỗi." },
    { match: "try:", text: "Bao đúng phép chuyển kiểu có khả năng phát sinh ValueError." },
    { match: "number = int", text: "Khi thành công, giữ số đã chuyển trong `number` để dùng ở phép cộng bên dưới." },
    { match: "except ValueError", text: "Nhận riêng chuỗi `bad`, không ảnh hưởng hai số còn lại." },
    { match: "continue", text: "Bỏ lượt sai trước khi `number` cũ có thể bị cộng nhầm vào tổng." },
    { match: "total +=", text: "Chỉ cộng 4 và 6, nên tổng tiến từ 0 tới 4 rồi 10." },
    { match: "print(total)", text: "In sau khi duyệt hết, cho kết quả tổng của mọi dữ liệu hợp lệ là 10." },
  ],
};
tasks.forEach(item => { item.explanation = explanations[item.floorNum]; });
const bosses = {
  5: { name: "QUÁI VALUEERROR", glyph: "!", quiz: [
    { q: "`int(\"abc\")` tạo loại lỗi nào?", a: ["ValueError", "NameError", "Không có lỗi"], correct: 0 },
    { q: "Đoạn code có thể chuyển số nên nằm trong khối nào?", a: ["`try`", "`else`", "`continue`"], correct: 0 },
    { q: "Khối nào xử lý riêng giá trị nhập không đổi được thành int?", a: ["`except ValueError:`", "`except NameError:`", "`if ValueError:`"], correct: 0 },
  ] },
  10: { name: "CHÚA THÁP LỖI", glyph: "⚠", quiz: [
    { q: "Trong vòng nhập lại, khi nào nên chạy break?", a: ["Sau khi chuyển kiểu thành công", "Trong except ValueError", "Trước khi gọi input"], correct: 0 },
    { q: "Vì sao không nên bọc cả chương trình trong một try lớn?", a: ["Có thể che vị trí và loại lỗi không dự kiến", "Python cấm nhiều dòng trong try", "print không chạy trong try"], correct: 0 },
    { q: "Sau khi except xử lý xong, chương trình có thể làm gì?", a: ["Tiếp tục ở dòng sau toàn bộ khối", "Luôn phải dừng", "Tự quay về đầu file"], correct: 0 },
  ] },
};
export default makeTower({ id: "towerERRORS", title: "THÁP XỬ LÝ LỖI", subtitle: "10 tầng try, except và nhập lại an toàn", intro: "THÁP XỬ LÝ LỖI dùng dữ liệu xấu có chủ đích. Bạn phải bắt đúng ValueError, giữ chương trình tiếp tục và chỉ bỏ qua dữ liệu thật sự không hợp lệ.", review: bosses[5].quiz.slice(0, 2), tasks, bosses });
