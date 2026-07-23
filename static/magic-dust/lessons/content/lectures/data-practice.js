const makeDeck = ({ id, title, practicePage, objective, given, machineDoes, learnerDoes, output, slides }) => ({
  id, title, practicePage, objective, given, machineDoes, learnerDoes, output, slides,
});

const testSlide = (items) => ({ type: "tests", title: "Pip kiểm tra kết quả", tests: items });

export const DATA_PRACTICE_LECTURES = [
  makeDeck({
    id: "islandRETURNLAB", title: "Xưởng Hàm Trả Kết Quả", practicePage: "islandRETURNLAB.html",
    objective: "Đưa giá trị từ trong hàm về chỗ gọi, lưu lại rồi dùng tiếp.",
    given: "Các đối số và thân hàm ngắn đã được chuẩn bị.", machineDoes: "Máy gọi hàm và tiếp tục chạy từ chỗ gọi.",
    learnerDoes: "Chọn giá trị cần return, gán kết quả cho biến và tạo OUTPUT ở bên ngoài hàm.", output: "Giá trị trả về được lưu và in đúng yêu cầu.",
    slides: [
      { type: "scene", title: "Hàm làm xong phải giao kết quả", diagram: { caller: "score_result", function: "add_score(7, 5)", returned: 12 } },
      { type: "pipeline", title: "Đường đi của giá trị", stages: ["Chỗ gọi gửi 7 và 5", "Hàm tính total = 12", "return gửi 12 về", "score_result giữ 12", "say_num tạo OUTPUT"], learnerStage: 2 },
      { type: "concept", title: "return không tự in", pairs: [{ operation: "return label", result: "giao label về chỗ gọi" }, { operation: "say(label)", result: "hiện label thành OUTPUT" }] },
      { type: "walkthrough", title: "Theo dõi một lần gọi", steps: [{ line: "result = add_score(7, 5)", memory: { score: 7, bonus: 5 } }, { line: "total = score + bonus", memory: { total: 12 } }, { line: "return total", moves: "12 → result" }, { line: "say_num(result)", output: 12 }] },
      { type: "counterexample", title: "Tính được nhưng chưa giao về", examples: [{ code: "total = score + bonus", result: "chỗ gọi chưa nhận 12" }, { code: "return total", result: "chỗ gọi nhận 12" }] },
      testSlide([{ name: "Cộng điểm", input: [7,5], expected: 12 }, { name: "Chuỗi nhãn", input: "PIP", expected: "[PIP]" }, { name: "Dùng tiếp kết quả", input: 4, expected: "giá trị được gán vào biến ngoài hàm" }]),
      { type: "summary", title: "Ba việc tách biệt", facts: ["Hàm tính giá trị.", "return giao giá trị về.", "Lệnh bên ngoài dùng hoặc in giá trị."], action: "Vào xưởng" },
    ],
  }),

  makeDeck({
    id: "islandDICTLOOKUP", title: "Trạm Tra Cứu Dữ Liệu", practicePage: "islandDICTLOOKUP.html",
    objective: "Đọc, cập nhật và kiểm tra đúng key trong dictionary.", given: "Các dictionary portal và gift đã có key/value.",
    machineDoes: "Dictionary giữ quan hệ giữa mỗi key và value.", learnerDoes: "Chọn đúng key, gán value mới và kiểm tra key trước khi đọc.",
    output: "Đúng value xuất hiện; các mục không liên quan giữ nguyên.",
    slides: [
      { type: "scene", title: "Một phiếu có nhiều mục", record: { name: "MOON GATE", status: "OPEN", points: 9 } },
      { type: "concept", title: "Key chỉ đúng value", links: [{ key: "name", value: "MOON GATE" }, { key: "status", value: "OPEN" }, { key: "points", value: 9 }] },
      { type: "walkthrough", title: "Đọc trạng thái", steps: [{ expression: "portal['status']", focus: "status" }, { lookup: "status → OPEN" }, { output: "OPEN" }] },
      { type: "decision", title: "Kiểm tra trước khi đọc", question: "'effect' có trong gift?", yes: "đọc gift['effect']", no: "dùng giá trị dự phòng" },
      { type: "counterexample", title: "Gán sai key làm đổi sai mục", examples: [{ assignment: "gift['points'] = 9", after: { name: "COMET", points: 9 } }, { assignment: "gift['name'] = 9", after: { name: 9, points: 4 } }] },
      testSlide([{ name: "Đọc status", expected: "OPEN" }, { name: "Đổi points", expected: { name: "COMET", points: 9 } }, { name: "Thiếu key", expected: "không đọc key chưa có" }]),
      { type: "summary", title: "Tra cứu bằng tên mục", facts: ["Key và value đi thành cặp.", "Gán vào một key chỉ đổi mục đó.", "Kiểm tra key trước khi dùng khi key có thể vắng."], action: "Vào trạm" },
    ],
  }),

  makeDeck({
    id: "islandGIFTSETUP", title: "Xưởng Chuẩn Bị Quà Tặng", practicePage: "islandGIFTSETUP.html",
    objective: "Làm sạch tên, chọn hiệu ứng theo điểm và chuẩn bị hồ sơ quà.", given: "Tên người gửi, điểm quà và các mốc hiệu ứng.",
    machineDoes: "Máy chuyển từng hồ sơ đã chuẩn bị sang phần phát sóng.", learnerDoes: "Gọi các công cụ chuỗi, viết nhánh chọn hiệu ứng và return hồ sơ đúng.",
    output: "Tên sạch, hiệu ứng đúng mốc và hồ sơ có đủ dữ liệu.",
    slides: [
      { type: "scene", title: "Dữ liệu thô chưa sẵn sàng", before: { sender: "  mira  ", points: 7 }, after: { sender: "MIRA", points: 7, effect: "GLOW" } },
      { type: "pipeline", title: "Chuẩn bị một hồ sơ", stages: ["Tên và điểm", "strip + upper", "chọn hiệu ứng", "return hồ sơ", "danh sách sẵn sàng"], learnerStage: 1 },
      { type: "walkthrough", title: "Tên đi qua hai bước", steps: [{ value: "  mira  " }, { operation: "strip()", value: "mira" }, { operation: "upper()", value: "MIRA" }] },
      { type: "decision", title: "Chọn hiệu ứng theo điểm", branches: [{ condition: "points >= 10", result: "BURST" }, { condition: "points >= 5", result: "GLOW" }, { condition: "còn lại", result: "SPARK" }], samples: [{ points: 3, result: "SPARK" }, { points: 7, result: "GLOW" }, { points: 12, result: "BURST" }] },
      { type: "concept", title: "Hồ sơ ghép các kết quả", record: { sender: "MIRA", points: 7, effect: "GLOW" }, sources: { sender: "clean_sender_name", effect: "choose_gift_effect" } },
      testSlide([{ name: "Làm sạch tên", input: "  mira  ", expected: "MIRA" }, { name: "Quà 7 điểm", expected: "GLOW" }, { name: "Quà 10 điểm", expected: "BURST" }]),
      { type: "summary", title: "Mỗi hàm chuẩn bị một phần", facts: ["Tên được làm sạch trước.", "Điểm quyết định hiệu ứng.", "Hồ sơ cuối giữ các kết quả đã chuẩn bị."], action: "Vào xưởng" },
    ],
  }),

  makeDeck({
    id: "islandLISTSUM", title: "Đảo Cộng Dồn List", practicePage: "islandLISTSUM.html",
    objective: "Tính tổng cả list hoặc tổng các giá trị đạt điều kiện.", given: "Một list số và điều kiện nếu bài yêu cầu.", machineDoes: "Vòng for đưa từng value tới code của em.",
    learnerDoes: "Đặt total = 0 và gán lại total bằng tổng cũ cộng value phù hợp.", output: "Một tổng số đúng.",
    slides: [
      { type: "scene", title: "Gom số từ một hàng dữ liệu", values: [3,5,2,4], accumulator: 0 },
      { type: "scan", title: "total giữ phần đã cộng", values: [3,5,2,4], cursor: "value", states: [{ value: 3, before: 0, after: 3 }, { value: 5, before: 3, after: 8 }, { value: 2, before: 8, after: 10 }, { value: 4, before: 10, after: 14 }] },
      { type: "counterexample", title: "Ghi đè làm mất tổng cũ", examples: [{ update: "total = value", states: [3,5,2,4], final: 4 }, { update: "total = total + value", states: [3,8,10,14], final: 14 }] },
      { type: "decision", title: "Chỉ cộng số chẵn", question: "value % 2 == 0?", yes: "total = total + value", no: "giữ nguyên total", samples: [{ value: 3, total: 0 }, { value: 4, total: 4 }, { value: 8, total: 12 }] },
      testSlide([{ name: "Tổng list", input: [3,5,2,4], expected: 14 }, { name: "Chỉ số chẵn", input: [3,4,5,8], expected: 12 }, { name: "List không có số đạt", input: [1,3], expected: 0 }]),
      { type: "summary", title: "Công thức cộng dồn", facts: ["Bắt đầu total = 0.", "Mỗi lượt giữ tổng cũ rồi cộng thêm.", "Nếu có điều kiện, chỉ cập nhật khi điều kiện đúng."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandLISTCOUNT", title: "Đảo Máy Đếm", practicePage: "islandLISTCOUNT.html",
    objective: "Đếm số lần một điều kiện xuất hiện trong list.", given: "List và điều kiện cần đếm.", machineDoes: "Vòng for đưa lần lượt từng value.",
    learnerDoes: "Tăng count thêm 1 khi value đạt điều kiện.", output: "Số lần xuất hiện, không phải tổng giá trị.",
    slides: [
      { type: "scene", title: "Mỗi lần đạt điều kiện thêm một dấu", values: [5,2,5,8,5], marks: [0,2,4] },
      { type: "scan", title: "Con trỏ và count", values: [5,2,5,8,5], condition: "value == 5", states: [{ index: 0, count: 1 }, { index: 1, count: 1 }, { index: 2, count: 2 }, { index: 3, count: 2 }, { index: 4, count: 3 }] },
      { type: "counterexample", title: "Đếm khác tính tổng", examples: [{ update: "count = count + value", final: 15, meaning: "tổng các số 5" }, { update: "count = count + 1", final: 3, meaning: "ba lần xuất hiện" }] },
      { type: "decision", title: "Đếm số đạt mốc", question: "value >= 7?", yes: "count tăng 1", no: "count giữ nguyên", samples: [{ value: 3 }, { value: 7 }, { value: 8 }, { value: 2 }], expected: 2 },
      testSlide([{ name: "Đếm số 5", input: [5,2,5,8,5], expected: 3 }, { name: "Đếm số chẵn", input: [2,6,4,7], expected: 3 }, { name: "Đếm từ 7", input: [3,7,8,2], expected: 2 }]),
      { type: "summary", title: "count ghi số lần", facts: ["Bắt đầu count = 0.", "Mỗi lần đạt điều kiện chỉ cộng 1.", "Không cộng chính value vào count."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandLISTEXTREMES", title: "Đảo Mốc Cao Thấp", practicePage: "islandLISTEXTREMES.html",
    objective: "Tìm số lớn nhất, nhỏ nhất và độ chênh lệch trong list không rỗng.", given: "Một list có ít nhất một số.", machineDoes: "Vòng for đưa từng value để so sánh.",
    learnerDoes: "Bắt đầu bằng values[0] và chỉ gán lại mốc khi gặp số phù hợp hơn.", output: "largest, smallest và largest - smallest.",
    slides: [
      { type: "scene", title: "Giữ mốc tốt nhất đã gặp", values: [-8,-3,-12,-5], markers: ["largest","smallest"] },
      { type: "scan", title: "Tìm largest", values: [-8,-3,-12,-5], initial: -8, states: [{ value: -8, largest: -8 }, { value: -3, largest: -3 }, { value: -12, largest: -3 }, { value: -5, largest: -3 }] },
      { type: "counterexample", title: "Không bắt đầu bằng 0", examples: [{ initial: 0, values: [-8,-3,-12], final: 0, valid: false }, { initial: -8, values: [-8,-3,-12], final: -3, valid: true }] },
      { type: "decision", title: "Hai mốc dùng hai điều kiện", branches: [{ condition: "value > largest", action: "largest = value" }, { condition: "value < smallest", action: "smallest = value" }] },
      { type: "walkthrough", title: "Tính độ chênh lệch", values: [21,6,13], result: { largest: 21, smallest: 6, difference: 15 } },
      testSlide([{ name: "Toàn số âm", input: [-8,-3,-12], expected: { largest: -3 } }, { name: "Hai mốc", input: [21,6,13], expected: { largest: 21, smallest: 6, difference: 15 } }]),
      { type: "summary", title: "Mốc phải đến từ dữ liệu thật", facts: ["List không rỗng nên dùng values[0].", "Chỉ gán lại khi tìm thấy mốc tốt hơn.", "Độ chênh lệch bằng largest - smallest."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandLISTREVERSE", title: "Đảo Thứ Tự Ngược", practicePage: "islandLISTREVERSE.html",
    objective: "Đọc list từ cuối về đầu và tạo list kết quả riêng.", given: "List ban đầu và list result rỗng.", machineDoes: "range cung cấp index giảm dần.",
    learnerDoes: "Đọc values[index] rồi append vào result.", output: "result có thứ tự ngược; values giữ nguyên.",
    slides: [
      { type: "scene", title: "Đọc thông điệp từ phải sang trái", values: ["START","CHECK","OPEN"], direction: "right-to-left" },
      { type: "scan", title: "Index đi từ cuối về đầu", values: [2,4,6,8], indexes: [3,2,1,0], resultStates: [[8],[8,6],[8,6,4],[8,6,4,2]] },
      { type: "concept", title: "Mốc bắt đầu và mốc dừng", formula: "range(len(values) - 1, -1, -1)", example: { length: 4, indexes: [3,2,1,0] } },
      { type: "counterexample", title: "Không sửa list ban đầu", examples: [{ values: [2,5,8], result: [8,5,2], valid: true }, { values: [8,5,2], result: [], valid: false }] },
      { type: "walkthrough", title: "Mỗi lượt append một giá trị", steps: [{ index: 2, value: "OPEN" }, { index: 1, value: "CHECK" }, { index: 0, value: "START" }], result: ["OPEN","CHECK","START"] },
      testSlide([{ name: "Bốn số", input: [2,4,6,8], expected: [8,6,4,2] }, { name: "Ba từ", expected: ["OPEN","CHECK","START"] }, { name: "Giữ list cũ", expected: ["START","CHECK","OPEN"] }]),
      { type: "summary", title: "Đọc ngược, không phá dữ liệu", facts: ["Index cuối là len(values) - 1.", "Mỗi lượt index giảm 1.", "append vào result mới."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandLISTFILTER", title: "Đảo Chọn Lọc", practicePage: "islandLISTFILTER.html",
    objective: "Tạo list mới chỉ chứa giá trị đạt điều kiện.", given: "List ban đầu, list selected rỗng và điều kiện.", machineDoes: "Vòng for đưa từng value tới phép kiểm tra.",
    learnerDoes: "Append value vào selected khi điều kiện đúng.", output: "selected đúng thứ tự; list ban đầu giữ nguyên.",
    slides: [
      { type: "scene", title: "Một luồng dữ liệu, hai lối đi", values: [3,8,2,9,6], threshold: 6 },
      { type: "pipeline", title: "Đường đi của từng value", stages: ["Đọc value", "Kiểm tra value >= 6", "Đúng: append", "Sai: đi tiếp", "selected"], learnerStage: 1 },
      { type: "scan", title: "Lọc mà vẫn giữ thứ tự", values: [3,8,2,9,6], states: [{ value: 3, selected: [] }, { value: 8, selected: [8] }, { value: 2, selected: [8] }, { value: 9, selected: [8,9] }, { value: 6, selected: [8,9,6] }] },
      { type: "counterexample", title: "Không xóa khỏi list đang quét", examples: [{ original: [3,8,2,9,6], selected: [8,9,6], valid: true }, { original: [8,9,6], selected: [], valid: false }] },
      { type: "decision", title: "Giữ số chẵn", question: "value % 2 == 0?", yes: "selected.append(value)", no: "không append", input: [4,3,2,8], expected: [4,2,8] },
      testSlide([{ name: "Từ 6 trở lên", input: [3,8,2,9,6], expected: [8,9,6] }, { name: "Số chẵn", input: [4,3,2,8], expected: [4,2,8] }, { name: "Không âm", input: [-2,4,-1,7,0], expected: [4,7,0] }]),
      { type: "summary", title: "Lọc tạo một list mới", facts: ["selected bắt đầu rỗng.", "Chỉ append khi điều kiện đúng.", "Không thay đổi list ban đầu."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandINPUTLIST", title: "Đảo Nhập List", practicePage: "islandINPUTLIST.html",
    objective: "Gom nhiều INPUT số vào list rồi quét lại list.", given: "Số lượng cần đọc và hàm read_num().", machineDoes: "Mỗi lần gọi read_num() nhận một INPUT từ bên ngoài chương trình.",
    learnerDoes: "Tạo list rỗng, đọc đúng số lần, append từng giá trị rồi xử lý list.", output: "List có đủ giá trị theo đúng thứ tự nhập và kết quả quét đúng.",
    slides: [
      { type: "scene", title: "Mỗi INPUT thêm một ô vào cuối list", inputs: [4,7,2], listStates: [[],[4],[4,7],[4,7,2]] },
      { type: "concept", title: "append thêm vào cuối", before: [4,7], operation: "scores.append(2)", after: [4,7,2] },
      { type: "pipeline", title: "Đọc rồi cất", stages: ["read_num()", "score giữ một số", "scores.append(score)", "lặp đủ lượt", "quét scores"], learnerStage: 1 },
      { type: "scan", title: "Vòng nhập có trạng thái thay đổi", count: 3, states: [{ turn: 0, input: 4, scores: [4] }, { turn: 1, input: 7, scores: [4,7] }, { turn: 2, input: 2, scores: [4,7,2] }] },
      { type: "counterexample", title: "Gán lại làm mất số cũ", examples: [{ operation: "scores = [score]", states: [[4],[7],[2]], final: [2] }, { operation: "scores.append(score)", final: [4,7,2] }] },
      testSlide([{ name: "Hai giá trị cho sẵn", input: [5,8], expected: [5,8] }, { name: "Ba INPUT", input: [4,7,2], expected: [4,7,2] }, { name: "Độ dài", expected: 3 }]),
      { type: "summary", title: "INPUT thật xảy ra ở read_num", facts: ["scores = [] chuẩn bị chỗ chứa.", "Mỗi lần đọc chỉ có một score.", "append giữ cả dữ liệu đã đọc trước đó."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandGRIDBASIC", title: "Đảo Bảng Số", practicePage: "islandGRIDBASIC.html",
    objective: "Quét toàn bộ grid để dựng bảng, tính tổng, đếm và tìm mốc.", given: "Grid chữ nhật và yêu cầu xử lý từng ô.", machineDoes: "Vòng ngoài chọn hàng; vòng trong đưa con trỏ qua các cột.",
    learnerDoes: "Đọc grid[row][col] và cập nhật đúng kết quả.", output: "Bảng mới hoặc một giá trị tổng hợp đúng.",
    slides: [
      { type: "image-grid", title: "Grid là list gồm nhiều hàng", grid: [[2,4,6],[7,9,1]], labels: { rows: [0,1], cols: [0,1,2] }, highlights: [{ row: 1, col: 0, value: 7 }] },
      { type: "scan", title: "Con trỏ quét từng hàng", grid: [[2,4,6],[7,9,1]], order: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]] },
      { type: "walkthrough", title: "Tính tổng cả bảng", states: [{ cell: [0,0], total: 2 }, { cell: [0,1], total: 6 }, { cell: [0,2], total: 12 }, { cell: [1,0], total: 19 }, { cell: [1,1], total: 28 }, { cell: [1,2], total: 29 }] },
      { type: "concept", title: "Cùng cách quét, đổi việc làm", operations: [{ task: "tổng", update: "total = total + value" }, { task: "đếm", update: "count = count + 1 khi đạt điều kiện" }, { task: "lớn nhất", update: "gán lại largest khi value lớn hơn" }] },
      { type: "counterexample", title: "Không đổi row và col", examples: [{ address: "grid[1][0]", value: 7 }, { address: "grid[0][1]", value: 4 }] },
      testSlide([{ name: "Đọc ô", input: [1,0], expected: 7 }, { name: "Tổng bảng", expected: 29 }, { name: "Số ô", expected: 6 }, { name: "Lớn nhất", expected: 9 }]),
      { type: "summary", title: "Một mẫu quét dùng cho nhiều bài", facts: ["row chọn hàng.", "col chọn ô trong hàng.", "Thay việc làm ở mỗi ô để đổi bài toán."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandGRIDOPS", title: "Đảo Phép Toán Bảng", practicePage: "islandGRIDOPS.html",
    objective: "Biến đổi cả grid bằng cùng một kiểu quét hàng-cột.", given: "Một hoặc hai bảng cùng kích thước và phép biến đổi.", machineDoes: "Con trỏ lồng nhau đi qua từng tọa độ.",
    learnerDoes: "Chọn ô nguồn đúng và ghi giá trị vào ô đích đúng.", output: "Grid kết quả cho phép cộng, nhân, chuyển vị hoặc viền.",
    slides: [
      { type: "scene", title: "Mỗi ô đầu ra có nguồn rõ ràng", a: [[1,2],[3,4]], b: [[10,20],[30,40]], result: [[11,22],[33,44]] },
      { type: "pipeline", title: "Cùng tọa độ đi qua phép toán", stages: ["chọn row,col", "đọc ô nguồn", "tính giá trị mới", "ghi result[row][col]"], learnerStage: 1 },
      { type: "walkthrough", title: "Cộng hai bảng", cells: [{ at: [0,0], expression: "1 + 10", result: 11 }, { at: [0,1], expression: "2 + 20", result: 22 }, { at: [1,0], expression: "3 + 30", result: 33 }, { at: [1,1], expression: "4 + 40", result: 44 }] },
      { type: "image-grid", title: "Chuyển vị đổi hàng thành cột", before: [[1,2,3],[4,5,6]], after: [[1,4],[2,5],[3,6]], mappings: [{ from: [0,2], to: [2,0] }, { from: [1,0], to: [0,1] }] },
      { type: "counterexample", title: "Chép a không phải cộng a và b", examples: [{ assignment: "result[row][col] = a[row][col]", result: [[1,2],[3,4]] }, { assignment: "result[row][col] = a[row][col] + b[row][col]", result: [[11,22],[33,44]] }] },
      testSlide([{ name: "Cộng 2×2", expected: [[11,22],[33,44]] }, { name: "Nhân mọi ô", input: { factor: 3 }, expected: "mỗi ô gấp 3" }, { name: "Chuyển vị 2×3", expected: [[1,4],[2,5],[3,6]] }]),
      { type: "summary", title: "Giữ cách quét, đổi công thức", facts: ["Mỗi ô đích có tọa độ.", "Đọc đúng ô nguồn trước khi tính.", "Chuyển vị ghi result[col][row]."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandGRIDQUEST", title: "Đảo Truy Tìm và Biến Hình", practicePage: "islandGRIDQUEST.html",
    objective: "Tìm tọa độ, xoay grid và kiểm tra tính chất bằng vòng lặp lồng nhau.", given: "Grid, target và bảng kết quả trống khi cần biến đổi.", machineDoes: "Con trỏ quét mọi tọa độ row,col.",
    learnerDoes: "Ghi đúng tọa độ khi gặp target và ánh xạ ô nguồn sang ô đích.", output: "Tọa độ đúng, grid xoay đúng hoặc kết luận kiểm tra đúng.",
    slides: [
      { type: "image-grid", title: "Tìm một số trong lưới", grid: [[2,4,6],[1,5,9],[3,7,8]], target: 9, targetCell: [1,2] },
      { type: "scan", title: "found đổi khi con trỏ gặp target", order: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2]], states: [{ cell: [0,0], found: false }, { cell: [1,2], found: true, found_row: 1, found_col: 2 }] },
      { type: "counterexample", title: "Hàng và cột không đổi chỗ", examples: [{ targetCell: [2,1], assignment: { found_row: 2, found_col: 1 }, valid: true }, { targetCell: [2,1], assignment: { found_row: 1, found_col: 2 }, valid: false }] },
      { type: "image-grid", title: "Xoay là ánh xạ tọa độ", before: [[1,2,3],[4,5,6],[7,8,9]], after: [[7,4,1],[8,5,2],[9,6,3]], mappings: [{ from: [2,0], to: [0,0] }, { from: [0,2], to: [2,2] }] },
      { type: "decision", title: "Kiểm tra một tính chất", question: "Mọi tổng cần so có bằng nhau?", yes: "valid giữ True", no: "valid = False", note: "Một biến đánh dấu giữ kết quả trong lúc quét." },
      testSlide([{ name: "Tìm 9", expected: { row: 1, col: 2 } }, { name: "Tìm 7", expected: { row: 2, col: 1 } }, { name: "Xoay 3×3", expected: [[7,4,1],[8,5,2],[9,6,3]] }]),
      { type: "summary", title: "Câu đố vẫn dùng dữ liệu hàng-cột", facts: ["Quét để tìm target.", "Ghi row và col đúng biến.", "Biến hình bằng ánh xạ ô nguồn sang ô đích."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandLISTTOOLS", title: "Đảo Dụng Cụ List", practicePage: "islandLISTTOOLS.html",
    objective: "Dùng index, slice và các công cụ list đã học để đọc hoặc tạo kết quả đúng.", given: "Một list và yêu cầu lấy, thêm, xóa, sắp xếp hoặc tìm.", machineDoes: "Mỗi phương thức thực hiện đúng thao tác đã định nghĩa.",
    learnerDoes: "Chọn đúng công cụ và kiểm tra list nào bị thay đổi.", output: "Giá trị hoặc list sau thao tác đúng yêu cầu.",
    slides: [
      { type: "scene", title: "Một túi đồ, nhiều thao tác", values: [2,4,6,8], tools: ["index","slice","copy","append","pop","sort"] },
      { type: "concept", title: "Index âm đọc từ cuối", values: [2,4,6,8], pointers: [{ expression: "a[-1]", index: 3, value: 8 }, { expression: "a[-2]", index: 2, value: 6 }] },
      { type: "walkthrough", title: "Slice tạo list mới", source: [10,20,30,40,50], expression: "a[1:4]", selectedIndexes: [1,2,3], result: [20,30,40] },
      { type: "counterexample", title: "copy và cùng một list khác nhau", examples: [{ operation: "b = a.copy()", relation: "hai list riêng" }, { operation: "b = a", relation: "hai tên cùng giữ một list" }] },
      { type: "decision", title: "Chọn đúng công cụ", branches: [{ need: "lấy và xóa theo index", tool: "pop(index)" }, { need: "xóa theo value", tool: "remove(value)" }, { need: "xếp tăng dần", tool: "sort()" }, { need: "tìm vị trí", tool: "index(value)" }] },
      testSlide([{ name: "Phần tử cuối", input: [2,4,6,8], expected: 8 }, { name: "Slice", expected: [20,30,40] }, { name: "pop(1)", input: [10,20,30], expected: { picked: 20, list: [10,30] } }]),
      { type: "summary", title: "Hỏi hai câu trước khi chọn lệnh", facts: ["Cần một giá trị hay một list mới?", "List ban đầu có được phép thay đổi không?", "Sau đó mới chọn công cụ."], action: "Vào đảo" },
    ],
  }),

  makeDeck({
    id: "islandSTRINGCHECKS", title: "Đảo Soi Chuỗi", practicePage: "islandSTRINGCHECKS.html",
    objective: "Chuẩn hóa, đếm, tìm, thay và kiểm tra chuỗi đối xứng bằng công cụ đã học.", given: "Chuỗi đầu vào và yêu cầu kiểm tra.",
    machineDoes: "Các phương thức chuỗi trả về giá trị hoặc chuỗi mới.", learnerDoes: "Ghép các bước đúng thứ tự và giữ kết quả sau mỗi bước.",
    output: "Chuỗi sạch, số đếm, vị trí, chuỗi thay thế hoặc kết luận đối xứng đúng.",
    slides: [
      { type: "scene", title: "Chuỗi là một hàng ký tự", text: "  KoTo  ", cells: [" "," ","K","o","T","o"," "," "] },
      { type: "pipeline", title: "Làm sạch theo đúng thứ tự", stages: ["'  KoTo  '", "strip() → 'KoTo'", "lower() → 'koto'", "dùng kết quả"], learnerStage: 1 },
      { type: "walkthrough", title: "Đếm và tìm trả về số", operations: [{ expression: "'banana'.count('a')", result: 3 }, { expression: "'banana'.find('na')", result: 2 }] },
      { type: "concept", title: "replace trả về chuỗi mới", before: "red moon", operation: "replace('red', 'blue')", after: "blue moon", original: "red moon" },
      { type: "counterexample", title: "So đối xứng sau khi làm sạch", examples: [{ raw: "  Level ", clean: "level", reversed: "level", palindrome: true }, { raw: "Koto", clean: "koto", reversed: "otok", palindrome: false }] },
      testSlide([{ name: "Chuẩn hóa", input: "  MAGIC ", expected: "magic" }, { name: "Đếm a", input: "banana", expected: 3 }, { name: "Tìm na", input: "banana", expected: 2 }, { name: "Đối xứng", input: " Level ", expected: true }]),
      { type: "summary", title: "Giữ kết quả của từng bước", facts: ["strip bỏ khoảng trắng hai đầu.", "lower tạo chuỗi chữ thường.", "count và find trả số; replace trả chuỗi mới."], action: "Vào đảo" },
    ],
  }),
];

export default DATA_PRACTICE_LECTURES;
