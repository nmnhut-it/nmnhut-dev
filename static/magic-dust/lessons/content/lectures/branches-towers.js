const freezeSlides = slides => Object.freeze(slides.map(slide => Object.freeze(slide)));

const branchLecture = config => Object.freeze({
  id: config.id,
  title: config.title,
  practicePage: config.practicePage,
  objective: config.objective,
  given: config.given,
  machineDoes: "Python chạy từng dòng và tạo OUTPUT từ dữ liệu đã cho hoặc INPUT thật.",
  learnerDoes: config.learnerDoes,
  output: config.output,
  slides: freezeSlides([
    {
      type: "scene",
      title: config.sceneTitle,
      body: config.sceneBody,
      before: config.before,
      after: config.after,
      prompt: config.prompt,
    },
    {
      type: "pipeline",
      title: "Dữ liệu đi qua chương trình như thế nào?",
      body: "Nhánh này dạy cú pháp mới. Mỗi ký hiệu mới phải gắn với một thay đổi nhìn thấy được trong OUTPUT.",
      stages: config.pipeline,
    },
    {
      type: "walkthrough",
      title: config.walkthroughTitle,
      body: config.walkthroughBody,
      code: config.code,
      steps: config.steps,
    },
    {
      type: "counterexample",
      title: "Phân biệt hai cách viết dễ nhầm",
      body: config.counterBody,
      cases: config.cases,
    },
    {
      type: "tests",
      title: "Pip kiểm tra điều gì?",
      body: "Pip dùng đúng dữ liệu nêu trong đề, chạy code rồi so OUTPUT theo từng dòng.",
      tests: config.tests.map(test => ({ ...test, pass: true })),
    },
    {
      type: "summary",
      title: "Cú pháp mới bạn sẽ dùng",
      body: config.summary,
      points: config.points,
      action: "VÀO NHÁNH HỌC",
    },
  ]),
});

const towerLecture = config => Object.freeze({
  id: config.id,
  title: config.title,
  practicePage: config.practicePage,
  objective: config.objective,
  given: "Mỗi tầng cho sẵn dữ liệu hoặc ghi rõ INPUT; đề bài nêu PROCESS và OUTPUT cần đạt.",
  machineDoes: "Pip chạy code với dữ liệu của tầng và ghi lại OUTPUT để chấm.",
  learnerDoes: "Dùng lại kiến thức đã học để hoàn thành từng tầng; tháp không giới thiệu cú pháp mới.",
  output: config.output,
  slides: freezeSlides([
    {
      type: "scene",
      title: config.sceneTitle,
      body: config.sceneBody,
      floors: config.floors,
    },
    {
      type: "pipeline",
      title: "Một tầng được chấm theo cùng một đường đi",
      body: "Đọc dữ liệu → viết PROCESS → RUN → Pip so OUTPUT. Nếu sai, xem đúng dòng khác biệt rồi sửa.",
      stages: [
        { id: "given", label: "ĐÃ CHO", detail: "giá trị hoặc INPUT của tầng", owner: "lesson" },
        { id: "process", label: "PROCESS", detail: "code bạn hoàn thành", owner: "learner" },
        { id: "run", label: "RUN", detail: "Python thực hiện code", owner: "machine" },
        { id: "compare", label: "PIP SO SÁNH", detail: "actual với expected", owner: "machine" },
      ],
    },
    {
      type: "walkthrough",
      title: config.walkthroughTitle,
      body: "Đây là một lượt ôn mẫu. Tháp sẽ đổi dữ liệu hoặc ghép thêm bước, nhưng không thêm lệnh mới.",
      given: config.example.given,
      code: config.example.code,
      steps: config.example.steps,
      expected: config.example.expected,
    },
    {
      type: "walkthrough",
      title: "Pip đọc kết quả kiểm thử",
      body: "Pip không đoán ý định. Pip kiểm tra bằng chứng xuất hiện trong OUTPUT.",
      steps: [
        { label: "1. Chạy", detail: config.testDemo.run },
        { label: "2. Nhận", detail: `actual = ${config.testDemo.actual}` },
        { label: "3. So", detail: `expected = ${config.testDemo.expected}` },
        { label: "4. Kết luận", detail: config.testDemo.result },
      ],
    },
    {
      type: "tests",
      title: "Các bằng chứng Pip sẽ tìm",
      tests: config.tests.map(test => ({ ...test, pass: true })),
    },
    {
      type: "summary",
      title: "Sẵn sàng leo tháp",
      body: "Đọc trọn đề của mỗi tầng: dữ liệu nào được cho, PROCESS nào phải tự viết và OUTPUT nào chứng minh kết quả.",
      points: ["Không có cú pháp mới.", "RUN sớm để xem OUTPUT thật.", "Sai test nào thì đối chiếu đúng test đó.", "Giữ mạng bằng cách sửa từ bằng chứng."],
      action: "VÀO THÁP LUYỆN TẬP",
    },
  ]),
});

const branches = [
  branchLecture({
    id: "branchSTANDARDIO", title: "Nhánh Python Chuẩn", practicePage: "branch.html?course=standardio",
    objective: "Đọc INPUT bằng input(), đổi sang int hoặc float và trình bày OUTPUT bằng print hoặc f-string.",
    given: "Người học nhập chuỗi thật; đề bài ghi rõ giá trị cần gõ.", learnerDoes: "Chọn kiểu số đúng, thực hiện phép tính rồi in đúng câu.", output: "INPUT 12 cho OUTPUT 13; dự án hóa đơn in 4 bút: 10.0.",
    sceneTitle: "Bàn phím gửi chữ, phép tính cần số", sceneBody: "input() luôn trả về chuỗi. Muốn cộng hoặc nhân theo nghĩa số học, chương trình phải đổi kiểu trước.",
    before: { input: "12", type: "str", operation: '"12" + 1', result: "TypeError" }, after: { input: "12", type: "int", operation: "12 + 1", result: 13 }, prompt: "Giá trị 12 cần đi qua lệnh nào trước khi cộng 1?",
    pipeline: [{ id: "input", label: "INPUT", detail: 'input() → "12"' }, { id: "convert", label: "ĐỔI KIỂU", detail: "int(...) → 12" }, { id: "process", label: "PROCESS", detail: "12 + 1 → 13" }, { id: "output", label: "OUTPUT", detail: "print(13)" }],
    walkthroughTitle: "Đọc tuổi rồi tính tuổi năm sau", walkthroughBody: "Theo dõi giá trị và kiểu dữ liệu sau từng dòng.", code: ['age = int(input("Tuổi: "))', "next_age = age + 1", "print(next_age)"],
    steps: [{ line: 1, input: "12", memory: "age = 12 (int)" }, { line: 2, memory: "next_age = 13" }, { line: 3, output: "13" }],
    counterBody: "int dành cho số nguyên; float giữ phần thập phân.", cases: [{ code: 'int("3.5")', result: "ValueError", valid: false }, { code: 'float("3.5")', result: 3.5, valid: true }],
    tests: [{ name: "int input", input: "12", expected: "13" }, { name: "float input", input: "12.5", expected: "25.0" }, { name: "f-string", expected: "Có 3 quyển sách" }, { name: "receipt", input: ["bút", "2.5", "4"], expected: "4 bút: 10.0" }],
    summary: "Đổi kiểu ngay nơi đọc INPUT để các dòng sau làm việc với đúng loại dữ liệu.", points: ["int(input(...))", "float(input(...))", "print(a, b)", 'print(f"...{value}...")'],
  }),
  branchLecture({
    id: "branchOPERATORS", title: "Nhánh Toán Tử", practicePage: "branch.html?course=operators",
    objective: "Dùng //, %, **, dấu ngoặc, phép gán rút gọn, in và not in.", given: "Các số và chuỗi được gán sẵn trong code.", learnerDoes: "Chọn phép toán đúng với câu hỏi và kiểm soát thứ tự tính.", output: "17 món chia hộp cho 3 hộp đầy, dư 2; các bài khác in đúng kết quả số hoặc kết quả kiểm tra.",
    sceneTitle: "Chia 17 món vào hộp năm món", sceneBody: "Bài toán cần hai câu trả lời khác nhau: có bao nhiêu hộp đầy và còn dư bao nhiêu món.", before: { items: 17, boxSize: 5 }, after: { fullBoxes: 3, remaining: 2 }, prompt: "Phép toán nào trả thương nguyên, phép toán nào trả phần dư?",
    pipeline: [{ id: "values", label: "ĐÃ CHO", detail: "17 và 5" }, { id: "quotient", label: "HỘP ĐẦY", detail: "17 // 5 = 3" }, { id: "remainder", label: "CÒN DƯ", detail: "17 % 5 = 2" }, { id: "output", label: "OUTPUT", detail: "3 rồi 2" }],
    walkthroughTitle: "Một phép chia, hai kết quả", walkthroughBody: "// bỏ phần lẻ của thương; % trả phần không xếp đủ nhóm.", code: ["items = 17", "box_size = 5", "print(items // box_size)", "print(items % box_size)"], steps: [{ line: 3, calculation: "17 // 5", output: 3 }, { line: 4, calculation: "17 % 5", output: 2 }],
    counterBody: "/, // và % trả lời ba câu hỏi khác nhau.", cases: [{ code: "17 / 5", result: 3.4 }, { code: "17 // 5", result: 3 }, { code: "17 % 5", result: 2 }],
    tests: [{ name: "division", expected: [3, 2] }, { name: "minutes", expected: "2 15" }, { name: "power precedence", expected: [8, 14, 20] }, { name: "membership", expected: ["FOUND", "SAFE"] }],
    summary: "Tên câu hỏi quyết định toán tử; dấu ngoặc quyết định nhóm phép tính cần làm trước.", points: ["// lấy thương nguyên", "% lấy phần dư", "** tính lũy thừa", "+=, -=, *= cập nhật biến", "in và not in kiểm tra sự có mặt"],
  }),
  branchLecture({
    id: "branchLOOPCONTROL", title: "Nhánh Điều Khiển Vòng", practicePage: "branch.html?course=loopcontrol",
    objective: "Dùng break để thoát vòng, continue để bỏ một lượt và while True để hỏi lại.", given: "Dãy số, chuỗi hoặc chuỗi INPUT thử được ghi rõ trong đề.", learnerDoes: "Đặt điều kiện dừng hoặc bỏ qua đúng vị trí trong vòng lặp.", output: "Vòng lặp dừng đúng mốc hoặc chỉ bỏ đúng phần tử, không chạy thừa.",
    sceneTitle: "Dừng cả vòng hay bỏ một lượt?", sceneBody: "Hai hành động này khác nhau: break rời khỏi vòng; continue chuyển ngay sang lượt tiếp theo.", before: [1, 2, 3, 4, 5], after: { breakAt3: [1, 2, 3], continueAt3: [1, 2, 4, 5] }, prompt: "Muốn bỏ số 3 nhưng vẫn in 4 và 5 thì dùng lệnh nào?",
    pipeline: [{ id: "item", label: "LƯỢT HIỆN TẠI", detail: "number" }, { id: "check", label: "KIỂM TRA", detail: "number == 3?" }, { id: "control", label: "ĐIỀU KHIỂN", detail: "break hoặc continue" }, { id: "next", label: "KẾT QUẢ", detail: "dừng hoặc sang lượt mới" }],
    walkthroughTitle: "Continue bỏ riêng lượt số 3", walkthroughBody: "Khi continue chạy, print phía dưới không chạy trong lượt đó.", code: ["for number in range(1, 6):", "    if number == 3:", "        continue", "    print(number)"], steps: [{ number: 1, output: 1 }, { number: 2, output: 2 }, { number: 3, action: "continue", output: null }, { number: 4, output: 4 }, { number: 5, output: 5 }],
    counterBody: "Đặt break trước hoặc sau print làm thay đổi việc mốc dừng có xuất hiện hay không.", cases: [{ order: ["if number == 4: break", "print(number)"], output: [1, 2, 3] }, { order: ["print(number)", "if number == 4: break"], output: [1, 2, 3, 4] }],
    tests: [{ name: "break", expected: [1, 2, 3, "DONE"] }, { name: "continue", expected: [1, 2, 4, 5] }, { name: "skip O", expected: ["K", "T"] }, { name: "retry password", input: ["SAI", "KOTO"], expected: "OPEN" }],
    summary: "Chọn lệnh theo phạm vi muốn điều khiển: một lượt hay toàn bộ vòng.", points: ["break thoát vòng", "continue bỏ phần còn lại của một lượt", "while True cần đường dẫn tới break"],
  }),
  branchLecture({
    id: "branchCOLLECTIONS", title: "Nhánh Dụng Cụ Collection", practicePage: "branch.html?course=collections",
    objective: "Thêm, xóa, sao chép, sắp xếp, tổng hợp list và kiểm tra chuỗi.", given: "Các list và chuỗi mẫu được gán sẵn.", learnerDoes: "Chọn đúng công cụ theo việc muốn thay đổi hoặc đo dữ liệu.", output: "List hoặc giá trị tổng hợp sau thao tác phải giống OUTPUT được nêu trong đề bài.",
    sceneTitle: "Thêm một món hay mở cả túi vào list?", sceneBody: "append thêm đối số thành một phần tử; extend lấy từng phần tử của collection mới.", before: ["key"], after: { append: ["key", ["gem", "coin"]], extend: ["key", "gem", "coin"] }, prompt: "Muốn list phẳng có ba chuỗi thì dùng công cụ nào?",
    pipeline: [{ id: "collection", label: "LIST BAN ĐẦU", detail: '["key"]' }, { id: "tool", label: "CÔNG CỤ", detail: "append, extend, insert, pop..." }, { id: "change", label: "LIST SAU LỆNH", detail: "kiểm tra cấu trúc mới" }, { id: "output", label: "OUTPUT", detail: "print hoặc số đo" }],
    walkthroughTitle: "Extend thêm từng phần tử", walkthroughBody: "List mới có ba chuỗi cùng cấp, không có list lồng bên trong.", code: ['bag = ["key"]', 'bag.extend(["gem", "coin"])', "print(bag)"], steps: [{ line: 1, memory: ['key'] }, { line: 2, memory: ["key", "gem", "coin"] }, { line: 3, output: "['key', 'gem', 'coin']" }],
    counterBody: "remove nhận giá trị; pop nhận index và đồng thời trả phần tử đã lấy.", cases: [{ code: 'colors.remove("red")', result: "xóa lần xuất hiện đầu tiên", valid: true }, { code: 'colors.pop("red")', result: "TypeError vì pop cần index", valid: false }],
    tests: [{ name: "extend", expected: "['key', 'gem', 'coin']" }, { name: "pop ends", expected: ["Chi", "An", "['Bình']"] }, { name: "copy", expected: ["[1, 2, 3]", "[1, 2, 3, 4]"] }, { name: "aggregates", expected: [30, 6, 9] }, { name: "code validator", expected: "VALID" }],
    summary: "Trước khi gọi hàm, nói rõ muốn thay list gốc, tạo list mới hay chỉ lấy một số đo.", points: ["append, extend, insert", "pop, remove, clear", "copy, sort, sorted, reverse", "sum, min, max, enumerate", "isdigit, isalpha, startswith, endswith"],
  }),
  branchLecture({
    id: "branchDICTIONARIES", title: "Nhánh Từ Điển Nâng Cao", practicePage: "branch.html?course=dictionaries",
    objective: "Tra khóa an toàn bằng get và duyệt keys, values hoặc items.", given: "Dictionary mẫu được gán sẵn, trong đó có cả trường hợp thiếu khóa.", learnerDoes: "Chọn cách tra hoặc duyệt phù hợp rồi xử lý None rõ ràng.", output: "Chương trình không dừng khi thiếu khóa và in đúng các cặp hoặc tổng cần tìm.",
    sceneTitle: "Tra một khóa không có trong sổ", sceneBody: "Dấu ngoặc yêu cầu khóa phải tồn tại. get cho phép nhận None hoặc một giá trị mặc định.", before: { dictionary: { name: "Pip" }, lookup: 'hero["power"]', result: "KeyError" }, after: { lookup: 'hero.get("power", 0)', result: 0 }, prompt: "Khi khóa có thể vắng mặt, cách tra nào giữ chương trình tiếp tục?",
    pipeline: [{ id: "dict", label: "DICTIONARY", detail: "các cặp key-value" }, { id: "lookup", label: "TRA CỨU", detail: "get(key, default)" }, { id: "decision", label: "KIỂM TRA", detail: "value is None?" }, { id: "output", label: "OUTPUT", detail: "giá trị hoặc MISSING" }],
    walkthroughTitle: "Items đưa khóa và giá trị vào cùng một lượt", walkthroughBody: "Mỗi lượt gán một cặp vào hai biến English ASCII.", code: ['prices = {"pen": 5, "book": 12}', "for item, price in prices.items():", "    print(item, price)"], steps: [{ iteration: 1, item: "pen", price: 5, output: "pen 5" }, { iteration: 2, item: "book", price: 12, output: "book 12" }],
    counterBody: "Duyệt dictionary trực tiếp chỉ nhận khóa; items nhận cả khóa và giá trị.", cases: [{ code: "for item in prices", variables: ["item"], value: "pen" }, { code: "for item, price in prices.items()", variables: ["item", "price"], value: ["pen", 5] }],
    tests: [{ name: "get missing", expected: [3, "None"] }, { name: "get default", expected: 0 }, { name: "items", expected: ["pen 5", "book 12"] }, { name: "None check", expected: "MISSING" }, { name: "inventory", expected: ["pen 3", "book 2", "TOTAL 5"] }],
    summary: "Chọn view theo dữ liệu cần dùng trong mỗi lượt và luôn quyết định cách xử lý khóa vắng mặt.", points: ["get(key)", "get(key, default)", "keys(), values(), items()", "is None"],
  }),
  branchLecture({
    id: "branchERRORS", title: "Nhánh Xử Lý Lỗi", practicePage: "branch.html?course=errors",
    objective: "Đọc loại lỗi, bắt ValueError dự kiến và cho người dùng nhập lại an toàn.", given: "Chuỗi thử hoặc INPUT thật có cả giá trị không đổi được thành số.", learnerDoes: "Đặt phép chuyển kiểu trong try và phản ứng cụ thể trong except ValueError.", output: "Dữ liệu sai tạo thông báo rõ ràng; chương trình tiếp tục hoặc hỏi lại tới khi nhận số hợp lệ.",
    sceneTitle: "Dữ liệu sai không cần làm cả chương trình dừng", sceneBody: "try chạy phép chuyển số. Nếu đúng ValueError xảy ra, except xử lý riêng trường hợp đó rồi chương trình tiếp tục.", before: { text: "abc", operation: "int(text)", result: "chương trình dừng" }, after: { result: ["NOT A NUMBER", "DONE"] }, prompt: "Dòng có khả năng tạo ValueError cần nằm trong khối nào?",
    pipeline: [{ id: "input", label: "CHUỖI", detail: '"abc" hoặc "12"' }, { id: "try", label: "TRY", detail: "thử int(text)" }, { id: "branch", label: "KẾT QUẢ", detail: "thành công hoặc ValueError" }, { id: "except", label: "EXCEPT", detail: "báo lỗi dự kiến" }, { id: "continue", label: "TIẾP TỤC", detail: "chạy dòng sau khối" }],
    walkthroughTitle: "Một lượt sai rồi một lượt đúng", walkthroughBody: "while True hỏi lại; break chỉ chạy sau khi int chuyển thành công.", code: ["while True:", '    text = input("Số nguyên: ")', "    try:", "        number = int(text)", "        break", "    except ValueError:", '        print("RETRY")', 'print("VALUE", number)'], steps: [{ input: "abc", path: "except ValueError", output: "RETRY", continue: true }, { input: "12", path: "try thành công", number: 12, action: "break" }, { output: "VALUE 12" }],
    counterBody: "Không dùng except trống để giấu mọi lỗi; chỉ bắt lỗi mà chương trình biết cách xử lý.", cases: [{ code: "except:", result: "che cả lỗi lập trình không dự kiến", valid: false }, { code: "except ValueError:", result: "chỉ xử lý chuỗi không đổi được thành số", valid: true }],
    tests: [{ name: "known errors", expected: ["NameError", "TypeError", "ValueError"] }, { name: "try except", expected: ["NOT A NUMBER", "DONE"] }, { name: "retry", input: ["abc", "12"], expected: ["RETRY", "VALUE 12"] }, { name: "narrow try", expected: "7.0" }],
    summary: "try chỉ bao phần có thể phát sinh lỗi dự kiến; except nêu đúng loại lỗi và hành động khôi phục.", points: ["try", "except ValueError", "while True để hỏi lại", "break sau khi chuyển kiểu thành công"],
  }),
];

const towerConfigs = [
  { id: "towerSTANDARDIO", title: "Tháp Nhập Xuất", practicePage: "tower.html?course=standardio", objective: "Ôn 10 tầng đọc đúng kiểu và trình bày OUTPUT.", output: "Mỗi tầng in đúng giá trị hoặc câu được yêu cầu.", sceneTitle: "Mười tầng INPUT → PROCESS → OUTPUT", sceneBody: "Các tầng ghép input, int, float, print và f-string đã học.", floors: 10, walkthroughTitle: "Ôn một hóa đơn", example: { given: ["bút", "2.5", "4"], code: ["price = float(input())", "count = int(input())", "total = price * count", 'print(f"{count} bút: {total}")'], steps: [{ price: 2.5 }, { count: 4 }, { total: 10.0 }], expected: "4 bút: 10.0" }, testDemo: { run: "gõ đúng ba INPUT", actual: "4 bút: 10.0", expected: "4 bút: 10.0", result: "PASS" }, tests: [{ name: "input type", expected: "số tính được" }, { name: "output format", expected: "đúng khoảng trắng và thứ tự" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerOPERATORS", title: "Tháp Toán Tử", practicePage: "tower.html?course=operators", objective: "Ôn 10 tầng thương, dư, lũy thừa, thứ tự tính và cập nhật biến.", output: "Mỗi biểu thức trả đúng số hoặc kết quả kiểm tra.", sceneTitle: "Mười tầng chọn đúng phép toán", sceneBody: "Tháp trộn các toán tử đã học thành bài nhiều bước.", floors: 10, walkthroughTitle: "Ôn 135 phút", example: { given: "minutes = 135", code: ["hours = minutes // 60", "left = minutes % 60", "print(hours, left)"], steps: [{ expression: "135 // 60", value: 2 }, { expression: "135 % 60", value: 15 }], expected: "2 15" }, testDemo: { run: "chạy biểu thức", actual: "2 15", expected: "2 15", result: "PASS" }, tests: [{ name: "quotient remainder", expected: "đúng cả hai số" }, { name: "precedence", expected: "đúng nhóm phép tính" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerLOOPCONTROL", title: "Tháp Điều Khiển Vòng", practicePage: "tower.html?course=loopcontrol", objective: "Ôn 10 tầng break, continue và while True.", output: "Mỗi vòng dừng hoặc bỏ lượt đúng theo đề.", sceneTitle: "Mười tầng kiểm soát đường chạy", sceneBody: "Không có lệnh mới; mỗi tầng yêu cầu phân biệt dừng cả vòng và bỏ một lượt.", floors: 10, walkthroughTitle: "Ôn bỏ số 3", example: { given: "range(1, 6)", code: ["for number in range(1, 6):", "    if number == 3: continue", "    print(number)"], steps: [{ number: 1, print: true }, { number: 3, print: false }, { number: 5, print: true }], expected: [1, 2, 4, 5] }, testDemo: { run: "duyệt đủ năm lượt", actual: "1 2 4 5", expected: "1 2 4 5", result: "PASS" }, tests: [{ name: "break boundary", expected: "không có lượt sau mốc" }, { name: "continue boundary", expected: "chỉ thiếu lượt cần bỏ" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerCOLLECTIONS", title: "Tháp Collection", practicePage: "tower.html?course=collections", objective: "Ôn 10 tầng list, tổng hợp và kiểm tra chuỗi.", output: "List, số đo hoặc kết quả kiểm tra khớp đề từng tầng.", sceneTitle: "Mười tầng xử lý kho dữ liệu", sceneBody: "Tháp trộn công cụ list với vòng lặp và phép kiểm tra chuỗi.", floors: 10, walkthroughTitle: "Ôn bản copy độc lập", example: { given: "original = [1, 2, 3]", code: ["changed = original.copy()", "changed.append(4)", "print(original)", "print(changed)"], steps: [{ original: [1, 2, 3], changed: [1, 2, 3] }, { original: [1, 2, 3], changed: [1, 2, 3, 4] }], expected: ["[1, 2, 3]", "[1, 2, 3, 4]"] }, testDemo: { run: "tạo copy rồi sửa copy", actual: "hai list khác nhau", expected: "list gốc không đổi", result: "PASS" }, tests: [{ name: "list shape", expected: "không lồng nhầm" }, { name: "mutation", expected: "đúng list cần sửa" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerDICTIONARIES", title: "Tháp Từ Điển", practicePage: "tower.html?course=dictionaries", objective: "Ôn 10 tầng tra cứu, duyệt và tổng hợp dictionary.", output: "Khóa thiếu được xử lý; các cặp và tổng được in đúng.", sceneTitle: "Mười tầng tra sổ an toàn", sceneBody: "Mỗi tầng dùng lại get, keys, values, items hoặc None.", floors: 10, walkthroughTitle: "Ôn tổng kho hàng", example: { given: '{"pen": 3, "book": 2, "eraser": 0}', code: ["total = 0", "for name, amount in stock.items():", "    if amount > 0: total += amount", 'print("TOTAL", total)'], steps: [{ name: "pen", total: 3 }, { name: "book", total: 5 }, { name: "eraser", total: 5 }], expected: "TOTAL 5" }, testDemo: { run: "duyệt ba cặp", actual: "TOTAL 5", expected: "TOTAL 5", result: "PASS" }, tests: [{ name: "missing key", expected: "không dừng chương trình" }, { name: "pair iteration", expected: "đúng key và value" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerERRORS", title: "Tháp Xử Lý Lỗi", practicePage: "tower.html?course=errors", objective: "Ôn 10 tầng try, except và nhập lại an toàn.", output: "Dữ liệu xấu được xử lý đúng, dữ liệu tốt vẫn tạo kết quả.", sceneTitle: "Mười tầng có dữ liệu xấu chủ đích", sceneBody: "Pip kiểm tra cả đường thành công và đường ValueError.", floors: 10, walkthroughTitle: "Ôn một lượt sai rồi đúng", example: { given: ["abc", "12"], code: ["while True:", "    try: number = int(input())", "    except ValueError: print('RETRY'); continue", "    break"], steps: [{ input: "abc", output: "RETRY" }, { input: "12", number: 12, action: "break" }], expected: ["RETRY", "VALUE 12"] }, testDemo: { run: "thử cả dữ liệu xấu và tốt", actual: "RETRY rồi VALUE 12", expected: "RETRY rồi VALUE 12", result: "PASS" }, tests: [{ name: "error path", expected: "đúng thông báo" }, { name: "success path", expected: "đúng giá trị" }, { name: "all floors", expected: "10/10" }] },
  { id: "towerINFERNO", title: "Tháp Luyện Ngục", practicePage: "tower.html?course=inferno", objective: "Ôn tổng hợp 15 tầng PROCESS, điều kiện và vòng lặp với ba mạng.", output: "Mỗi tầng tạo đúng OUTPUT từ dữ liệu cho sẵn.", sceneTitle: "Mười lăm tầng luyện phản xạ", sceneBody: "Từ phép tính cơ bản tới vòng lặp lồng nhau; tháp chỉ ôn kiến thức trước node 10.", floors: 15, walkthroughTitle: "Ôn tầng đếm ngược", example: { given: "count = 4", code: ["while count > 0:", "    print(count)", "    count -= 1", 'print("DONE")'], steps: [{ count: 4, output: 4 }, { count: 3, output: 3 }, { count: 2, output: 2 }, { count: 1, output: 1 }, { count: 0, output: "DONE" }], expected: [4, 3, 2, 1, "DONE"] }, testDemo: { run: "chạy đến count = 0", actual: "4 3 2 1 DONE", expected: "4 3 2 1 DONE", result: "PASS, giữ mạng" }, tests: [{ name: "exact lines", expected: "đúng thứ tự" }, { name: "no extra output", expected: "không in 0" }, { name: "all floors", expected: "15/15" }] },
  { id: "tower", title: "Tháp Vô Định", practicePage: "tower.html", objective: "Ôn tổng hợp cuối hành trình qua các bài toán số, điều kiện, vòng lặp và dữ liệu.", output: "Mỗi tầng in chính xác kết luận hoặc số mà đề yêu cầu.", sceneTitle: "Tháp cuối kết hợp mọi công cụ", sceneBody: "Các ô luyện nền nhắc lại cơ chế; tầng thử thách yêu cầu tự ghép PROCESS.", floors: "endgame", walkthroughTitle: "Ôn cách lấy và bỏ chữ số cuối", example: { given: "number = 472", code: ["digit = number % 10", "rest = number // 10", "print(digit)", "print(rest)"], steps: [{ expression: "472 % 10", value: 2 }, { expression: "472 // 10", value: 47 }], expected: [2, 47] }, testDemo: { run: "chạy hai phép toán", actual: "2 rồi 47", expected: "2 rồi 47", result: "PASS" }, tests: [{ name: "foundation cell", expected: "hiểu phép toán trước tầng" }, { name: "challenge output", expected: "đúng kết luận" }, { name: "tower progress", expected: "lưu tầng và số mạng" }] },
];

export const BRANCH_TOWER_LECTURES = Object.freeze([...branches, ...towerConfigs.map(towerLecture)]);

export default BRANCH_TOWER_LECTURES;
