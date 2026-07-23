const rgba = (red, green, blue, alpha = 255) => [red, green, blue, alpha];

const pipeline = (stages, learnerStage) => ({
  type: "pipeline",
  title: "Dữ liệu đi qua đâu?",
  stages,
  learnerStage,
});

const tests = (cases) => ({
  type: "tests",
  title: "Pip sẽ kiểm tra như thế nào?",
  cases,
});

export const VISUAL_LECTURES = {
  node22: {
    id: "node22",
    title: "Từ Điểm Ảnh Đến Pháo Hoa",
    practicePage: "lesson22v2.html",
    objective: "Tạo một khung hình RGBA, tô đúng điểm ảnh và biến trạng thái hạt thành nhiều khung hình liên tiếp.",
    given: "Kích thước khung hình, vị trí cần tô và màu RGBA mẫu.",
    machineDoes: "Máy đưa framebuffer đã tính lên màn hình; camera chỉ là lớp nền có sẵn.",
    learnerDoes: "Tạo bảng điểm ảnh, kiểm tra biên, tô ô và cập nhật dữ liệu hạt qua từng frame.",
    output: "Khung hình đúng kích thước và chuỗi frame cho thấy các điểm sáng chuyển động.",
    slides: [
      { type: "scene", title: "Một pháo hoa được tạo từ nhiều điểm sáng", scene: "firework", layers: ["camera", "transparent-overlay", "particles"], prompt: "Nếu đóng băng đúng một frame, em nhìn thấy những gì?" },
      pipeline(["Cảnh camera", "Framebuffer trong suốt", "Tô điểm ảnh", "Hiện frame"], 2),
      { type: "image-grid", title: "Máy đã chuẩn bị một bảng điểm ảnh", rows: 6, cols: 8, defaultValue: rgba(0, 0, 0, 0), highlights: [{ row: 3, col: 4, value: rgba(255, 80, 40, 255) }], caption: "Mỗi ô giữ [red, green, blue, alpha]." },
      { type: "pixel-zoom", title: "Một phép gán làm thay đổi đúng một ô", source: { row: 3, col: 4 }, before: rgba(0, 0, 0, 0), after: rgba(255, 80, 40, 255), channels: ["red", "green", "blue", "alpha"] },
      { type: "loop", title: "Hai vòng lặp tạo cả framebuffer", cursors: ["row", "col"], ranges: [{ name: "row", start: 0, stop: 6 }, { name: "col", start: 0, stop: 8 }], action: "frame[row][col] = [0, 0, 0, 0]", frames: [[0, 0], [0, 1], [0, 2], [1, 0], [5, 7]] },
      { type: "walkthrough", title: "Từ trạng thái hạt đến frame tiếp theo", states: [{ x: 4, y: 3, vx: 1, vy: -1, life: 3 }, { x: 5, y: 2, vx: 1, vy: -1, life: 2 }, { x: 6, y: 1, vx: 1, vy: -1, life: 1 }], codeMap: ["x = x + vx", "y = y + vy", "life = life - 1"] },
      tests([{ name: "Khung 6×8", input: { rows: 6, cols: 8 }, expected: [6, 8] }, { name: "Một điểm hợp lệ", input: [3, 4], expected: rgba(255, 80, 40, 255) }, { name: "Ngoài biên", input: [6, 8], expected: "không ghi dữ liệu" }]),
      { type: "summary", title: "Bài toán của em", facts: ["Framebuffer là bảng RGBA.", "row chọn hàng; col chọn cột.", "Nhiều frame có trạng thái khác nhau tạo chuyển động."], action: "Vào node 22" },
    ],
  },

  node23: {
    id: "node23", title: "AR Bàn Tay: Tự Vẽ Lớp Ảnh", practicePage: "lesson23v2.html",
    objective: "Vẽ một mask lên framebuffer trong suốt, phóng to nó và đặt đúng tại tọa độ bàn tay.",
    given: "Mask 0/1, màu RGBA, hệ số phóng to và tọa độ bàn tay.",
    machineDoes: "Máy đọc tọa độ bàn tay, giữ hình camera và ghép lớp ảnh trong suốt lên trên.",
    learnerDoes: "Duyệt mask, bỏ ô 0, phóng mỗi ô 1 thành một khối và chặn phần vượt biên.",
    output: "Sticker có đúng hình, đúng kích thước và bám vào vị trí bàn tay.",
    slides: [
      { type: "scene", title: "Một sticker bám theo bàn tay", scene: "hand-sticker", layers: ["camera", "hand-anchor", "sticker"], prompt: "Sticker phải đổi vị trí nào khi bàn tay di chuyển?" },
      pipeline(["Camera và tọa độ tay", "Mask 0/1", "Framebuffer RGBA", "Ghép lên camera"], 2),
      { type: "image-grid", title: "Nền trong suốt không che camera", rows: 5, cols: 7, defaultValue: rgba(0, 0, 0, 0), highlights: [{ row: 2, col: 3, value: rgba(255, 90, 180, 255) }] },
      { type: "pixel-zoom", title: "Alpha quyết định có nhìn xuyên qua hay không", source: { row: 0, col: 0 }, before: rgba(0, 0, 0, 255), after: rgba(0, 0, 0, 0), labels: ["che camera", "để lộ camera"] },
      { type: "image-grid", title: "Mask chỉ giữ hình dạng", grid: [[0,1,0],[1,1,1],[0,1,0]], palette: { 0: "transparent", 1: "paint" }, anchor: { x: 4, y: 3 }, scale: 2 },
      { type: "loop", title: "Một ô mask thành một khối scale × scale", cursors: ["mask_row", "mask_col", "dy", "dx"], ranges: [{ name: "mask_row", start: 0, stop: 3 }, { name: "mask_col", start: 0, stop: 3 }, { name: "dy", start: 0, stop: 2 }, { name: "dx", start: 0, stop: 2 }], action: "frame[target_y][target_x] = color" },
      tests([{ name: "Nền trong suốt", expected: { alpha: 0 } }, { name: "Scale 2", input: { maskCell: 1, scale: 2 }, expected: "khối 2×2" }, { name: "Sát mép", input: { x: 6, y: 4 }, expected: "chỉ tô ô còn trong ảnh" }]),
      { type: "summary", title: "Phần việc của em", facts: ["Camera và tọa độ đã có sẵn.", "Mask 1 mới được tô.", "Luôn kiểm tra target_x và target_y trước khi ghi."], action: "Vào node 23" },
    ],
  },

  node24: {
    id: "node24", title: "Từ Cử Chỉ Đến Pháo Hoa", practicePage: "lesson24v2.html",
    objective: "Ghép INPUT, phát hạt, UPDATE và RENDER thành một vòng lặp tương tác.",
    given: "Chuỗi cử chỉ mô phỏng, điểm phát và trạng thái hạt ban đầu.",
    machineDoes: "Máy nhận diện cử chỉ và hiển thị framebuffer đã hoàn thành.",
    learnerDoes: "Chọn kiểu phát, tạo vận tốc, cập nhật hạt và dựng mỗi frame.",
    output: "Hiệu ứng liên tục hoặc theo đợt phản ứng đúng với từng cử chỉ.",
    slides: [
      { type: "scene", title: "Một cử chỉ làm pháo hoa xuất hiện", scene: "gesture-firework", timeline: ["raise-hand", "burst", "fade"] },
      pipeline(["INPUT: cử chỉ", "EMIT: tạo hạt", "UPDATE: đổi trạng thái", "RENDER: dựng frame"], 1),
      { type: "counterexample", title: "Phát liên tục khác phát theo đợt", examples: [{ label: "liên tục", frames: [2,4,6,8] }, { label: "theo đợt", frames: [8,8,8,8] }], question: "Kiểu nào phù hợp với một sự kiện vừa xảy ra?", answer: "theo đợt" },
      { type: "walkthrough", title: "Một hạt thay đổi ở mỗi frame", states: [{ frame: 0, x: 50, y: 40, vx: 2, vy: -3, life: 3, size: 4 }, { frame: 1, x: 52, y: 37, vx: 2, vy: -3, life: 2, size: 3 }, { frame: 2, x: 54, y: 34, vx: 2, vy: -3, life: 1, size: 2 }], codeMap: ["x += vx", "y += vy", "life -= 1"] },
      { type: "loop", title: "Vòng lặp xử lý một frame", cursors: ["frame", "particle"], ranges: [{ name: "frame", start: 0, stop: 5 }, { name: "particle", start: 0, stop: "len(particles)" }], action: "input → emit → update → render" },
      { type: "counterexample", title: "Không UPDATE thì không có chuyển động", examples: [{ update: false, positions: [[50,40],[50,40],[50,40]] }, { update: true, positions: [[50,40],[52,37],[54,34]] }], answer: "Vòng lặp chỉ lặp; chính phép gán mới đổi trạng thái." },
      tests([{ name: "Burst tám hướng", expected: { count: 8 } }, { name: "Hai hạt mỗi frame", input: { frames: 5, rate: 2 }, expected: { count: 10 } }, { name: "UPDATE", input: { x: 50, vx: 2 }, expected: { x: 52 } }]),
      { type: "summary", title: "Bốn việc trong mỗi frame", facts: ["Đọc input.", "Phát hạt khi luật cho phép.", "Cập nhật mọi hạt.", "Dựng và hiện frame."], action: "Vào node 24" },
    ],
  },

  node25: {
    id: "node25", title: "Phòng Phát Sóng Tương Tác", practicePage: "lesson25v2.html",
    objective: "Tự nối các cơ chế đã học thành một dự án AR hoàn chỉnh.",
    given: "Cử chỉ, quà mô phỏng, mask, màu và các kịch bản kiểm thử cục bộ.",
    machineDoes: "Máy mô phỏng sự kiện, đọc bàn tay và đưa frame cuối lên màn hình; không gửi dữ liệu ra ngoài.",
    learnerDoes: "Viết emitter, UPDATE, tạo framebuffer, đóng mask và luật nối sự kiện với hiệu ứng.",
    output: "Một phòng phát cục bộ tạo đúng sticker và hiệu ứng hạt theo từng sự kiện.",
    slides: [
      { type: "scene", title: "Sản phẩm cuối khóa", scene: "interactive-studio", events: ["gesture", "simulated-gift"], outputs: ["sticker", "particles"] },
      pipeline(["Cử chỉ/quà mô phỏng", "Luật chọn hiệu ứng", "Emitter + UPDATE", "Mask + framebuffer", "AR output"], 1),
      { type: "image-grid", title: "Năm phần em phải tự nối", grid: [["event","rule","particles"],["mask","frame","output"]], learnerCells: ["rule","particles","mask","frame"], preparedCells: ["event","output"] },
      { type: "walkthrough", title: "Theo dấu một sự kiện", states: [{ step: "input", gift: "star", hand: [42,30] }, { step: "rule", effect: "fan-burst" }, { step: "emit", count: 5, vx: [-4,-2,0,2,4] }, { step: "render", stickerAt: [42,30], particleCount: 5 }] },
      { type: "loop", title: "Tính hướng thay vì chép sẵn", cursors: ["index"], ranges: [{ name: "index", start: 0, stop: 5 }], action: "vx = (index - count // 2) * spread", steps: [{ index: 0, vx: -4 }, { index: 2, vx: 0 }, { index: 4, vx: 4 }] },
      { type: "counterexample", title: "Gọi hàm tiện ích không chứng minh cơ chế", examples: [{ label: "chưa đạt", code: "particle_burst(...)" }, { label: "đạt", code: "emit → update → render" }], answer: "Rubric kiểm tra dữ liệu và các bước em tự viết." },
      tests([{ name: "Emitter hình quạt", expected: { count: 5, vx: [-4,0,4] } }, { name: "UPDATE", expected: "vị trí đổi và life giảm" }, { name: "Mask", expected: "nền alpha 0" }, { name: "Kịch bản đầy đủ", expected: "sự kiện đúng → hiệu ứng đúng" }]),
      { type: "summary", title: "Ranh giới dự án", facts: ["Input và present_image_frame đã có sẵn.", "Em tự tính hạt, pixel và luật phản ứng.", "OUTPUT nhìn thấy phải khớp dữ liệu kiểm thử."], action: "Vào node 25" },
    ],
  },

  islandAR: {
    id: "islandAR", title: "Đảo Phép Camera", practicePage: "islandAR.html",
    objective: "Dùng số ngón tay camera đã nhận ra để chọn một phản ứng nhìn thấy được.",
    given: "Một số nguyên do watch() trả về.", machineDoes: "Nhận diện bàn tay và đổi hình camera thành số ngón tay.",
    learnerDoes: "Lưu số, kiểm tra điều kiện và gọi đúng hiệu ứng.", output: "Số hoặc hiệu ứng đúng xuất hiện trên lớp AR.",
    slides: [
      { type: "scene", title: "Giơ tay, màn hình phản ứng", scene: "camera-hand", input: { fingers: 3 }, output: "lighten" },
      pipeline(["Ảnh bàn tay", "Nhận diện có sẵn", "watch() trả số", "Code chọn hiệu ứng"], 3),
      { type: "walkthrough", title: "Một INPUT có thể dẫn tới nhiều OUTPUT", states: [{ fingers: 1, action: "darken" }, { fingers: 3, action: "lighten" }, { fingers: 5, action: "fire_vortex" }] },
      { type: "counterexample", title: "display và say hiện ở hai nơi khác nhau", examples: [{ call: "display(3)", place: "trên hình camera" }, { call: "say_num(3)", place: "console" }], question: "Muốn số nổi trên camera thì dùng lệnh nào?", answer: "display(3)" },
      { type: "loop", title: "Đọc rồi chọn", cursors: ["power"], ranges: [{ name: "power", values: [1,3,5] }], action: "if / elif / else → effect" },
      tests([{ name: "Một ngón", input: 1, expected: "darken" }, { name: "Ba ngón", input: 3, expected: "lighten" }, { name: "Năm ngón", input: 5, expected: "fire_vortex" }]),
      { type: "summary", title: "Phần camera đã có sẵn", facts: ["watch() trả INPUT dạng số.", "Code của em chọn OUTPUT.", "Không cần tự nhận diện bàn tay."], action: "Vào đảo thực hành" },
    ],
  },

  islandAR2: {
    id: "islandAR2", title: "Đảo Phép Camera II", practicePage: "islandAR2.html",
    objective: "Chọn, sắp thứ tự và lặp các bộ lọc camera có sẵn.", given: "Khung camera và các hàm filter.",
    machineDoes: "Từng hàm đã biết cách biến đổi điểm ảnh.", learnerDoes: "Gọi đúng filter, đúng thứ tự và đúng số lần.",
    output: "Khung camera có màu, hướng hoặc độ rung đúng yêu cầu.",
    slides: [
      { type: "scene", title: "Cùng một ảnh, nhiều cách nhìn", scene: "filter-strip", variants: ["original","sepia","invert","grayscale"] },
      pipeline(["Frame camera", "Chọn filter", "Filter xử lý sẵn", "Frame kết quả"], 1),
      { type: "pixel-zoom", title: "Filter làm đổi giá trị điểm ảnh", before: [30,120,220], transformations: [{ name: "grayscale", after: [123,123,123] }, { name: "invert", after: [225,135,35] }], note: "Em không phải tự viết công thức trong đảo này." },
      { type: "counterexample", title: "Thứ tự lệnh có thể đổi kết quả", examples: [{ calls: ["invert()","grayscale()"] }, { calls: ["grayscale()","invert()"] }], question: "Code chạy lệnh nào trước?", answer: "Lệnh nằm trên chạy trước." },
      { type: "loop", title: "while gọi lại hiệu ứng", cursors: ["turn"], ranges: [{ name: "turn", start: 0, stop: 3 }], action: "shake_screen(); turn += 1", frames: ["left","right","left"] },
      tests([{ name: "Sepia", expected: "màu ảnh cũ" }, { name: "Mirror", expected: "trái-phải đổi vị trí" }, { name: "Ba lần rung", expected: { calls: 3 } }]),
      { type: "summary", title: "Việc của em là điều khiển filter", facts: ["Frame camera đã có.", "Công thức filter đã có.", "Em chọn lệnh, thứ tự và số lần gọi."], action: "Vào đảo thực hành" },
    ],
  },

  islandPHOTOLIGHTS: {
    id: "islandPHOTOLIGHTS", title: "Xưởng Bảng Đèn", practicePage: "islandPHOTOLIGHTS.html",
    objective: "Đặt bóng theo tọa độ rồi dùng list và vòng lặp tạo bảng đèn.", given: "Kích thước sân khấu, danh sách vị trí và màu bóng.",
    machineDoes: "place_bulb vẽ một bóng tại tọa độ được giao.", learnerDoes: "Tính hoặc đọc x/y và gọi place_bulb cho từng vị trí.", output: "Đủ bóng, đúng tọa độ, đúng màu và đúng mẫu.",
    slides: [
      { type: "scene", title: "Một bảng đèn được ghép từ từng bóng", scene: "photo-light-frame", layers: ["blank-frame","bulbs"] },
      pipeline(["Danh sách vị trí", "Vòng lặp lấy từng vị trí", "place_bulb(x,y,color)", "Bảng đèn"], 1),
      { type: "image-grid", title: "x đi ngang, y đi dọc", rows: 3, cols: 3, coordinateLabels: true, highlights: [{ row: 1, col: 0, value: "red" }, { row: 1, col: 2, value: "blue" }, { row: 0, col: 1, value: "green" }] },
      { type: "walkthrough", title: "Một lời gọi tạo một bóng", states: [{ call: "place_bulb(35, 50, 'red')", point: [35,50] }, { call: "place_bulb(65, 50, 'blue')", point: [65,50] }, { call: "place_bulb(50, 25, 'green')", point: [50,25] }] },
      { type: "loop", title: "Con trỏ đi qua list vị trí", cursors: ["position"], ranges: [{ name: "position", values: [[20,20],[50,20],[80,20]] }], action: "place_bulb(position[0], position[1], color)" },
      { type: "counterexample", title: "Đổi nhầm x và y làm lệch mẫu", examples: [{ input: [35,50], output: [35,50], label: "đúng" }, { input: [35,50], output: [50,35], label: "đổi chỗ" }], answer: "Đọc x trước, y sau." },
      tests([{ name: "Ba bóng", expected: { count: 3 } }, { name: "Bóng xanh", expected: { x: 50, y: 25 } }, { name: "Grid", expected: "mọi vị trí xuất hiện đúng một lần" }]),
      { type: "summary", title: "Từ một bóng tới cả bảng", facts: ["Mỗi lời gọi đặt một bóng.", "List giữ các vị trí.", "Vòng lặp dùng cùng một thao tác cho mọi vị trí."], action: "Vào xưởng" },
    ],
  },

  islandPIXELART: {
    id: "islandPIXELART", title: "Đảo Tranh Điểm Ảnh", practicePage: "islandPIXELART.html",
    objective: "Đọc tranh 16×16 như dữ liệu, tách pattern khỏi palette, đổi màu và lật tranh.", given: "Ảnh Cú Ánh Trăng 16×16 và các palette mẫu.",
    machineDoes: "Máy đọc tệp ảnh thành bảng RGB và phóng ô để dễ quan sát.", learnerDoes: "Tạo pattern 0/1, ánh xạ màu và đổi vị trí cột khi lật.", output: "Tranh vẫn giữ đúng hình nhưng có palette hoặc hướng mới.",
    slides: [
      { type: "scene", title: "Cú Ánh Trăng vẫn là một tác phẩm hoàn chỉnh", scene: "moon-owl", zoomFrom: "full-image", zoomTo: "16x16-grid" },
      pipeline(["Tệp ảnh", "Bảng RGB 16×16", "Pattern 0/1", "Palette hoặc phép lật", "Ảnh mới"], 2),
      { type: "pixel-zoom", title: "Mỗi ô giữ ba kênh màu", source: { row: 7, col: 8 }, value: [255,198,74], channels: ["red","green","blue"] },
      { type: "image-grid", title: "Pattern giữ dáng, palette giữ màu", grid: [[0,1,0],[1,1,1],[0,1,0]], palettes: [{ 0: [18,12,45], 1: [255,198,74] }, { 0: [5,50,65], 1: [80,240,210] }] },
      { type: "loop", title: "Quét từng ô để đổi palette", cursors: ["row","col"], ranges: [{ name: "row", start: 0, stop: 16 }, { name: "col", start: 0, stop: 16 }], action: "output[row][col] = palette[pattern[row][col]]" },
      { type: "walkthrough", title: "Lật ngang bằng cách đổi cột nguồn", states: [{ destCol: 0, sourceCol: 15 }, { destCol: 1, sourceCol: 14 }, { destCol: 15, sourceCol: 0 }], formula: "source_col = width - 1 - col" },
      tests([{ name: "Kích thước", expected: [16,16,3] }, { name: "Đổi palette", expected: "pattern không đổi" }, { name: "Lật hai lần", expected: "trở lại ảnh ban đầu" }]),
      { type: "summary", title: "Dáng và màu là hai lớp dữ liệu", facts: ["Pattern cho biết ô nào thuộc hình.", "Palette quyết định màu.", "Phép lật đổi vị trí, không đổi màu ô."], action: "Vào đảo thực hành" },
    ],
  },

  islandEDGE: {
    id: "islandEDGE", title: "Đảo Viền Ảnh", practicePage: "islandEDGE.html",
    objective: "Tìm các ô nằm trên ranh giới của một ảnh binary.", given: "Bảng 0/1 đã được tạo từ ảnh màu.",
    machineDoes: "Máy đọc ảnh, thu nhỏ và tạo bảng binary trước phần tìm viền.", learnerDoes: "Kiểm tra biên và bốn hàng xóm của từng ô 1.", output: "Bảng edge chỉ giữ những ô 1 có ít nhất một phía chạm nền hoặc ngoài ảnh.",
    slides: [
      { type: "scene", title: "Từ hình đầy tới đường viền", scene: "owl-silhouette-edge", stages: ["binary-fill","outline"] },
      pipeline(["Ảnh màu", "Bảng 0/1 có sẵn", "Kiểm tra bốn hàng xóm", "Bảng viền"], 2),
      { type: "neighbors", title: "Một ô có bốn hàng xóm qua cạnh", center: { row: 1, col: 1, value: 1 }, neighbors: { up: 0, down: 1, left: 0, right: 1 }, order: ["up","down","left","right"] },
      { type: "counterexample", title: "Ô trong lòng hình không phải viền", examples: [{ label: "bên trong", center: 1, neighbors: [1,1,1,1], edge: 0 }, { label: "trên viền", center: 1, neighbors: [1,0,1,1], edge: 1 }], answer: "Chỉ cần một phía là nền thì ô thuộc viền." },
      { type: "neighbors", title: "Kiểm tra biên trước khi đọc", center: { row: 0, col: 2, value: 1 }, neighbors: { up: "outside", down: 1, left: 1, right: 1 }, outsideValue: 0 },
      { type: "loop", title: "Con trỏ quét toàn bộ ảnh", cursors: ["row","col"], ranges: [{ name: "row", start: 0, stop: "height" }, { name: "col", start: 0, stop: "width" }], action: "nếu image[row][col] == 1 thì kiểm tra bốn phía" },
      tests([{ name: "Ô trong lòng", input: [1,1,1,1], expected: 0 }, { name: "Một phía nền", input: [1,0,1,1], expected: 1 }, { name: "Ô sát mép", input: { row: 0 }, expected: 1 }]),
      { type: "summary", title: "Luật tìm viền", facts: ["Chỉ xét ô sáng 1.", "Ngoài ảnh được xem là nền 0.", "Có ít nhất một phía nền thì chép ô sang edge."], action: "Vào đảo thực hành" },
    ],
  },

  islandIMAGEOPS: {
    id: "islandIMAGEOPS", title: "Đảo Xử Lý Ảnh RGB", practicePage: "islandIMAGEOPS.html",
    objective: "Chuyển từng điểm ảnh RGB thành 0 hoặc 1 bằng độ sáng và một ngưỡng.", given: "Ảnh Cú Ánh Trăng đã được đọc thành bảng RGB 16×16.",
    machineDoes: "Máy giải mã tệp, thu nhỏ ảnh và trả bảng [red, green, blue].", learnerDoes: "Quét bảng, tính brightness và phân loại mỗi ô.",
    output: "Ảnh binary 16×16: vùng sáng là 1, vùng tối là 0.",
    slides: [
      { type: "scene", title: "Một ảnh màu có thể trở thành ảnh hai mức", scene: "moon-owl-threshold", stages: ["rgb","binary"] },
      pipeline(["Tệp ảnh", "Bảng RGB 16×16", "Tính brightness", "So với 128", "Bảng 0/1"], 2),
      { type: "image-grid", title: "Đây là dữ liệu em nhận", rows: 16, cols: 16, sampleCells: [{ row: 0, col: 0, value: [18,12,45] }, { row: 7, col: 8, value: [255,198,74] }] },
      { type: "pixel-zoom", title: "Một pixel đi qua phép phân loại", value: [255,198,74], operations: [{ expression: "255 + 198 + 74", result: 527 }, { expression: "527 // 3", result: 175 }, { expression: "175 >= 128", result: true }, { expression: "output", result: 1 }] },
      { type: "counterexample", title: "Mốc 128 thuộc phía sáng", examples: [{ rgb: [127,127,127], brightness: 127, output: 0 }, { rgb: [128,128,128], brightness: 128, output: 1 }], answer: "Điều kiện phải là brightness >= 128." },
      { type: "loop", title: "Cùng một luật cho mọi pixel", cursors: ["row","col"], ranges: [{ name: "row", start: 0, stop: 16 }, { name: "col", start: 0, stop: 16 }], action: "brightness → 0 hoặc 1", sweep: "left-to-right-top-to-bottom" },
      tests([{ name: "Pixel tối", input: [18,12,45], expected: 0 }, { name: "Đúng ngưỡng", input: [128,128,128], expected: 1 }, { name: "Pixel sáng", input: [255,198,74], expected: 1 }, { name: "Cả ảnh", expected: [16,16] }]),
      { type: "summary", title: "Bài toán bắt đầu sau khi ảnh đã được đọc", facts: ["Mỗi ô là một RGB.", "Tính brightness bằng tổng chia 3.", "Từ 128 trở lên thành 1."], action: "Vào đảo thực hành" },
    ],
  },

  islandFINGERTIPS: {
    id: "islandFINGERTIPS", title: "Từ Ảnh Bàn Tay Đến Đầu Ngón", practicePage: "islandFINGERTIPS.html",
    objective: "Đếm các đỉnh ngón trong ma trận x/0 đã được chuẩn bị từ ảnh bàn tay.",
    given: "Ma trận gồm x cho phần bàn tay và 0 cho nền; mỗi đỉnh được làm mảnh còn một ô x.",
    machineDoes: "Thu ảnh camera, tách nền và số hóa bàn tay thành ma trận x/0.",
    learnerDoes: "Quét ma trận và kiểm tra trên, trái, phải, dưới của mỗi ô x.",
    output: "Số đầu ngón tay; bộ chấm cuối phải hiện RESULT 5/5.",
    slides: [
      { type: "scene", title: "Camera chụp được một bàn tay", scene: "camera-hand", image: "assets/fingertips-lecture/camera-to-binary-matrix-colored.webp", crop: "camera", prompt: "Em nhìn thấy những đầu ngón nào?" },
      { type: "pipeline", title: "Ba bước máy đã làm sẵn", image: "assets/fingertips-lecture/camera-to-binary-matrix-colored.webp", stages: ["Ảnh camera", "Tách nền và chia pixel", "Phân loại pixel", "Ma trận x/0"], learnerStage: 3, revealRegions: ["camera","pixel-grid","classifier","matrix"] },
      { type: "image-grid", title: "Dữ liệu chương trình nhận được", grid: [[0,"x",0,0,"x",0,0,"x",0],[0,"x",0,0,"x",0,0,"x",0],[0,"x","x","x","x","x","x","x",0],[0,"x","x","x","x","x","x","x",0]], palette: { 0: "navy", x: "cyan" }, fingertipCells: [[0,1],[0,4],[0,7]], prompt: "Từ bảng này, làm sao đếm được các đầu ngón?" },
      { type: "neighbors", title: "Phóng lớn một đỉnh ngón", center: { row: 0, col: 4, value: "x" }, neighbors: { up: "outside", left: 0, right: 0, down: "x" }, outsideValue: 0, revealOrder: ["center","up","left","right","down"], colors: { center: "yellow", empty: "navy", hand: "cyan" } },
      { type: "counterexample", title: "Một pixel đứng riêng không phải đầu ngón", examples: [{ label: "đỉnh ngón", pattern: [[0,0,0],[0,"x",0],[0,"x",0]], valid: true }, { label: "pixel đứng riêng", pattern: [[0,0,0],[0,"x",0],[0,0,0]], valid: false }], question: "Vì sao phải kiểm tra phía dưới?", answer: "Phía dưới phải là x để đỉnh còn nối với bàn tay." },
      { type: "loop", title: "Con trỏ quét và tăng số đếm", grid: [[0,"x",0,0,"x",0,0,"x",0],[0,"x",0,0,"x",0,0,"x",0],[0,"x","x","x","x","x","x","x",0]], cursors: ["row","col"], hits: [{ row: 0, col: 1, count: 1 }, { row: 0, col: 4, count: 2 }, { row: 0, col: 7, count: 3 }], action: "trên 0 · trái 0 · phải 0 · dưới x → count += 1" },
      { type: "walkthrough", title: "Từ bốn phía sang code", conditions: [{ name: "above_is_empty", direction: "up", expected: 0 }, { name: "left_is_empty", direction: "left", expected: 0 }, { name: "right_is_empty", direction: "right", expected: 0 }, { name: "continues_below", direction: "down", expected: "x" }], combine: "above_is_empty and left_is_empty and right_is_empty and continues_below" },
      tests([{ name: "empty", expected: 0 }, { name: "one_finger", expected: 1 }, { name: "three_fingers", expected: 3 }, { name: "finger_at_edge", expected: 1 }, { name: "isolated_pixel_is_not_a_finger", expected: 0 }]),
      { type: "summary", title: "Bài toán của em bắt đầu ở ma trận", facts: ["Ảnh, tách nền và số hóa đã làm sẵn.", "x thuộc bàn tay; 0 là nền.", "Đếm ô x có ba phía nền và phía dưới tiếp tục là x."], action: "Vào đảo thực hành" },
    ],
  },
};

export default VISUAL_LECTURES;
