import { codeTask, learningBranch } from "./python-path-builders.js";

const task = config => codeTask(config);
const cells = [
  { intro: { title: "✦ NHÁNH XỬ LÝ LỖI ✦", hook: "Bệnh Viện Thần Chú không xóa lỗi khỏi thế giới. Nó dạy chương trình nhận một lỗi dự kiến, báo rõ cho người dùng và tiếp tục an toàn.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Đọc thông báo lỗi", questions: [
    { q: "Thông báo `ValueError: invalid literal for int()` xuất hiện khi chạy `int(\"abc\")`. Phần nào cho biết loại lỗi?", a: ["`ValueError`", "`int`", "`abc`"], correct: 0 },
  ] } },
  { npc: "Thông báo lỗi thường cho biết loại lỗi và dòng gây lỗi. `NameError` thường là tên chưa tồn tại; `TypeError` là thao tác không hợp kiểu; `ValueError` là kiểu chuyển đổi đúng nhưng giá trị không hợp lệ, như `int(\"abc\")`." },
  ...task({ label: "errors_read_types.py", starter: "samples = [\"NameError\", \"TypeError\", \"ValueError\"]\nfor error_name in samples:\n    print(error_name)\n", note: "RUN KIỂM CHỨNG\nCho sẵn ba tên lỗi; không có INPUT. PROCESS: đọc và in từng tên để nhận diện đúng chính tả. OUTPUT gồm `NameError`, `TypeError`, `ValueError`.", expectOut: { all: [{ minLines: 3 }, /^NameError$/, /^TypeError$/, /^ValueError$/] }, solution: "samples = [\"NameError\", \"TypeError\", \"ValueError\"]\nfor error_name in samples:\n    print(error_name)\n" }),
  { npc: "Khối `try` chứa đoạn code có thể gặp lỗi. `except ValueError:` chỉ chạy khi một `ValueError` xuất hiện trong `try`; sau đó chương trình tiếp tục từ dòng nằm sau toàn bộ khối." },
  ...task({ label: "errors_try_except_demo.py", starter: "text = \"abc\"\ntry:\n    number = int(text)\n    print(number)\nexcept ValueError:\n    print(\"NOT A NUMBER\")\nprint(\"DONE\")\n", note: "RUN KIỂM CHỨNG\nCho sẵn chuỗi `abc`; không có INPUT. PROCESS: thử đổi thành int, bắt riêng `ValueError`, rồi tiếp tục. OUTPUT là `NOT A NUMBER` và `DONE`.", expectOut: { all: [{ minLines: 2 }, /^NOT A NUMBER$/, /^DONE$/] }, solution: "text = \"abc\"\ntry:\n    number = int(text)\n    print(number)\nexcept ValueError:\n    print(\"NOT A NUMBER\")\nprint(\"DONE\")\n" }),
  ...task({ label: "errors_try_except_fix.py", starter: "text = \"12x\"\nnumber = int(text)\nprint(number)\n", note: "ĐỀ BÀI\nCho sẵn chuỗi `12x`; không có INPUT. Bọc phép chuyển số trong `try`; khi gặp `ValueError`, in `INVALID`. OUTPUT phải là `INVALID` và chương trình không dừng vì lỗi.", expectOut: /^INVALID$/, solution: "text = \"12x\"\ntry:\n    number = int(text)\n    print(number)\nexcept ValueError:\n    print(\"INVALID\")\n" }),
  { checkpoint: { text: "`try` chạy đoạn code có thể lỗi. `except ValueError` xử lý riêng lỗi giá trị không hợp lệ; chỉ nên bắt loại lỗi mà chương trình biết cách giải quyết." } },
  { quiz: { title: "Bắt đúng loại lỗi", questions: [
    { q: "Đoạn code nào in `INVALID` thay vì dừng khi `text = \"abc\"`?", a: ["```python\ntry:\n    print(int(text))\nexcept ValueError:\n    print(\"INVALID\")\n```", "```python\nprint(int(text))\n```", "```python\ntry:\n    print(text)\nexcept NameError:\n    print(\"INVALID\")\n```"], correct: 0 },
  ] } },
  { npc: "Mẫu nhập lại kết hợp `while True`, `try`, `except` và `break`: thử chuyển INPUT thành số; nếu thành công thì `break`, nếu có `ValueError` thì báo lỗi và vòng lặp hỏi lại." },
  ...task({ label: "errors_retry_number.py", starter: "while True:\n    text = input(\"Số nguyên: \" )\n    # Thử đổi text thành int; sai thì in RETRY, đúng thì thoát.\n", note: "XƯỞNG PHÉP\nHai INPUT thật lần lượt là `abc` và `12`. PROCESS: dùng `while True`; trong `try`, chuyển bằng `int()` và `break`; trong `except ValueError`, in `RETRY`. Sau vòng lặp in `VALUE 12`. OUTPUT là `RETRY` rồi `VALUE 12`.", sampleInput: ["abc", "12"], expectOut: { all: [{ minLines: 2 }, /^RETRY$/, /^VALUE 12$/] }, solution: "while True:\n    text = input(\"Số nguyên: \" )\n    try:\n        number = int(text)\n        break\n    except ValueError:\n        print(\"RETRY\")\nprint(\"VALUE\", number)\n" }),
  { npc: "Không đặt cả chương trình vào một khối `try` lớn. Chỉ đặt thao tác dự kiến có thể lỗi vào `try`, để một lỗi khác không bị che mất và thông báo vẫn chỉ đúng chỗ cần sửa." },
  ...task({ label: "errors_narrow_try.py", starter: "text = \"3.5\"\ntry:\n    value = float(text)\nexcept ValueError:\n    print(\"INVALID\")\nprint(value * 2)\n", note: "RUN KIỂM CHỨNG\nCho sẵn chuỗi `3.5`; không có INPUT. PROCESS: chỉ đặt phép chuyển float trong `try`, rồi nhân ngoài khối. OUTPUT phải là `7.0`.", expectOut: /^7\.0$/, solution: "text = \"3.5\"\ntry:\n    value = float(text)\nexcept ValueError:\n    print(\"INVALID\")\nprint(value * 2)\n" }),
  { checkpoint: { text: "Với INPUT số, mẫu an toàn là hỏi trong `while True`, thử `int()` hoặc `float()` trong `try`, báo lại trong `except ValueError`, và `break` khi chuyển đổi thành công." } },
  { quiz: { title: "Nhập lại tới khi hợp lệ", questions: [
    { q: "Trong vòng nhập lại, `break` nên chạy ở trường hợp nào?", a: ["Sau khi `int(text)` chuyển đổi thành công", "Ngay sau mọi lần gọi `input()`", "Trong `except ValueError` trước khi báo `RETRY`"], correct: 0 },
  ] } },
];

export default learningBranch({ id: "branchERRORS", title: "NHÁNH XỬ LÝ LỖI", subtitle: "đọc thông báo lỗi, try/except và nhập lại an toàn", machineName: "BỆNH VIỆN THẦN CHÚ", machineBlurb: "nhận lỗi dự kiến, giải thích cho người dùng và giữ chương trình tiếp tục đúng cách", cells });
