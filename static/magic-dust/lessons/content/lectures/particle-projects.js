const lecture = config => Object.freeze({
  ...config,
  slides: Object.freeze(config.slides.map(slide => Object.freeze(slide))),
});

const particle = (x, y, extras = {}) => ({ x, y, ...extras });

export const PARTICLE_PROJECT_LECTURES = Object.freeze([
  lecture({
    id: "islandPARTICLELIFE",
    title: "Một Hình Trở Thành Particle",
    practicePage: "islandPARTICLELIFE.html",
    objective: "Giải thích và tự viết các bước làm một hình di chuyển, nhỏ dần, mờ dần rồi biến mất.",
    given: "Một dictionary giữ hình, vị trí, vận tốc, kích thước, độ trong suốt và số frame còn sống.",
    machineDoes: "Sân khấu đọc dictionary và vẽ đúng trạng thái hiện tại của hình.",
    learnerDoes: "Thay đổi trạng thái sau mỗi frame và dùng vòng lặp để tạo nhiều hạt từ nhiều hướng.",
    output: "Một pháo hoa tám hạt tỏa ra, nhỏ dần, mờ dần và có life cuối bằng 0.",
    slides: [
      {
        type: "scene",
        title: "Nhìn một ngôi sao bay rồi biến mất",
        body: "Trước khi đọc code, hãy nhìn bốn khoảnh khắc của cùng một ngôi sao.",
        scene: "particle-life",
        frames: [
          { frame: 0, particles: [particle(25, 70, { size: 2, alpha: 255, life: 5 })] },
          { frame: 1, particles: [particle(30, 67, { size: 1.8, alpha: 205, life: 4 })] },
          { frame: 3, particles: [particle(40, 61, { size: 1.4, alpha: 105, life: 2 })] },
          { frame: 5, particles: [] },
        ],
        prompt: "Những giá trị nào phải đổi để tạo ra chuyển động, thu nhỏ và mờ dần?",
      },
      {
        type: "pipeline",
        title: "Từ dữ liệu đến hình chuyển động",
        body: "Máy chỉ vẽ dữ liệu đã có. Phần việc của bạn là cập nhật dữ liệu trước frame tiếp theo.",
        stages: [
          { id: "input", label: "TRẠNG THÁI", detail: "x, y, vx, vy, size, alpha, life", owner: "given" },
          { id: "render", label: "RENDER", detail: "vẽ trạng thái hiện tại", owner: "machine" },
          { id: "update", label: "UPDATE", detail: "đổi x, y, size, alpha, life", owner: "learner" },
          { id: "repeat", label: "FRAME MỚI", detail: "render lại dữ liệu mới", owner: "machine" },
        ],
      },
      {
        type: "state-frames",
        title: "Theo dõi chính xác một hạt",
        body: "Mỗi lần UPDATE dùng lại trạng thái vừa tính được, không quay về số ban đầu.",
        formula: ["x = x + vx", "y = y + vy", "size = size - 0.2", "alpha = alpha - 50", "life = life - 1"],
        frames: [
          { frame: 0, x: 25, y: 70, vx: 5, vy: -3, size: 2, alpha: 255, life: 5 },
          { frame: 1, x: 30, y: 67, vx: 5, vy: -3, size: 1.8, alpha: 205, life: 4 },
          { frame: 2, x: 35, y: 64, vx: 5, vy: -3, size: 1.6, alpha: 155, life: 3 },
          { frame: 3, x: 40, y: 61, vx: 5, vy: -3, size: 1.4, alpha: 105, life: 2 },
          { frame: 4, x: 45, y: 58, vx: 5, vy: -3, size: 1.2, alpha: 55, life: 1 },
          { frame: 5, x: 50, y: 55, vx: 5, vy: -3, size: 1, alpha: 5, life: 0 },
        ],
      },
      {
        type: "counterexample",
        title: "Vòng lặp chưa tự tạo chuyển động",
        body: "Nếu code chỉ vẽ lại mà không đổi dữ liệu, năm frame vẫn chồng đúng một chỗ.",
        cases: [
          { label: "Chỉ RENDER", frames: [{ x: 30 }, { x: 30 }, { x: 30 }], result: "Hình đứng yên", valid: false },
          { label: "RENDER rồi UPDATE", frames: [{ x: 30 }, { x: 35 }, { x: 40 }], result: "Hình chuyển động", valid: true },
        ],
      },
      {
        type: "emitter",
        title: "Một điểm phát tạo tám hạt",
        body: "Emitter tạo tám dictionary cùng vị trí nhưng khác vận tốc.",
        origin: { x: 50, y: 50 },
        directions: [[0, -6], [4, -4], [6, 0], [4, 4], [0, 6], [-4, 4], [-6, 0], [-4, -4]],
        generated: 8,
        animation: "spawn-then-spread",
      },
      {
        type: "loop",
        title: "Từ danh sách hướng sang code",
        body: "Mỗi lượt lấy đúng một cặp vận tốc rồi tạo đúng một dictionary.",
        code: [
          "particles = []",
          "for direction in directions:",
          "    particle = make_particle(direction[0], direction[1], \"#ffd45c\")",
          "    particles.append(particle)",
        ],
        steps: [
          { iteration: 0, direction: [0, -6], count: 1 },
          { iteration: 1, direction: [4, -4], count: 2 },
          { iteration: 7, direction: [-4, -4], count: 8 },
        ],
      },
      {
        type: "tests",
        title: "Pip kiểm tra cả dữ liệu lẫn hình nhìn thấy",
        body: "Pip không chỉ hỏi code có chạy. Các số phải chứng minh đúng từng phép UPDATE.",
        tests: [
          { name: "move", expected: "x = 50, y = 55", reason: "năm lần cộng vận tốc", pass: true },
          { name: "scale", expected: "size = 1.0", reason: "năm lần giảm 0.2", pass: true },
          { name: "fade", expected: "alpha = 5", reason: "năm lần giảm 50", pass: true },
          { name: "life", expected: "life = 0", reason: "hạt đã hết vòng đời", pass: true },
          { name: "firework", expected: "8 particles và particle_frame", reason: "đủ tám hướng và có hình", pass: true },
        ],
      },
      {
        type: "summary",
        title: "Phần việc của bạn trên đảo",
        points: ["Vẽ trạng thái hiện tại.", "Cập nhật x, y, size, alpha và life.", "Lặp lại để tạo chuyển động.", "Tạo tám hạt từ tám hướng."],
        action: "VÀO ĐẢO VÒNG ĐỜI HẠT",
      },
    ],
  }),

  lecture({
    id: "islandEMITTERLAB",
    title: "Điều Khiển Một Bộ Phát Hạt",
    practicePage: "islandEMITTERLAB.html",
    objective: "Điều khiển số hạt, độ tỏa, nhịp phát và giới hạn số hạt còn được giữ.",
    given: "Điểm phát, bảng màu, các hướng mẫu, số frame và giới hạn hạt được gán sẵn.",
    machineDoes: "Sân khấu vẽ các dictionary trong list particles ở mỗi frame.",
    learnerDoes: "Viết emitter tạo đúng trạng thái ban đầu và giữ list trong ngân sách.",
    output: "Một vệt sáng tạo đúng rate hạt mỗi frame, tỏa đúng hướng và không vượt giới hạn.",
    slides: [
      {
        type: "scene",
        title: "Cùng một điểm phát, hai kết quả khác nhau",
        body: "Count quyết định có bao nhiêu hạt. Spread quyết định các vận tốc cách nhau bao xa.",
        comparisons: [
          { count: 3, spread: 1, velocities: [-1, 0, 1] },
          { count: 3, spread: 3, velocities: [-3, 0, 3] },
        ],
      },
      {
        type: "pipeline",
        title: "Emitter chỉ tạo trạng thái ban đầu",
        stages: [
          { id: "parameters", label: "THAM SỐ", detail: "x, y, count, spread hoặc rate", owner: "given" },
          { id: "emit", label: "EMIT", detail: "tạo dictionary mới", owner: "learner" },
          { id: "update", label: "UPDATE", detail: "đổi vị trí và life", owner: "learner" },
          { id: "render", label: "RENDER", detail: "vẽ list particles", owner: "machine" },
        ],
      },
      {
        type: "emitter",
        title: "Count và spread tạo một hình quạt",
        origin: { x: 40, y: 30 },
        parameters: { count: 5, spread: 2 },
        particles: [
          particle(40, 30, { index: 0, offset: -2, vx: -4, vy: -3 }),
          particle(40, 30, { index: 1, offset: -1, vx: -2, vy: -3 }),
          particle(40, 30, { index: 2, offset: 0, vx: 0, vy: -3 }),
          particle(40, 30, { index: 3, offset: 1, vx: 2, vy: -3 }),
          particle(40, 30, { index: 4, offset: 2, vx: 4, vy: -3 }),
        ],
        formula: "vx = offset * spread",
      },
      {
        type: "counterexample",
        title: "Spread không làm tăng số hạt",
        cases: [
          { label: "count = 5, spread = 1", count: 5, velocities: [-2, -1, 0, 1, 2], valid: true },
          { label: "count = 5, spread = 3", count: 5, velocities: [-6, -3, 0, 3, 6], valid: true },
          { label: "Hiểu nhầm", claim: "5 × 3 = 15 hạt", valid: false },
        ],
      },
      {
        type: "timeline",
        title: "Rate tạo thêm hạt ở mỗi frame",
        body: "Với rate = 2, tổng tăng đều 2, 4, 6, 8 nếu chưa có hạt nào bị loại.",
        events: [
          { frame: 1, added: 2, alive: 2 },
          { frame: 2, added: 2, alive: 4 },
          { frame: 3, added: 2, alive: 6 },
          { frame: 4, added: 2, alive: 8 },
        ],
      },
      {
        type: "walkthrough",
        title: "Giữ đúng ngân sách hạt",
        body: "Khi có tám hạt nhưng ngân sách là năm, giữ năm hạt mới nhất.",
        before: [1, 2, 3, 4, 5, 6, 7, 8],
        operation: "particles = particles[-max_particles:]",
        maxParticles: 5,
        after: [4, 5, 6, 7, 8],
        removed: [1, 2, 3],
      },
      {
        type: "tests",
        title: "Pip đo từng nút điều khiển",
        tests: [
          { name: "burst count", expected: 5, pass: true },
          { name: "burst spread", expected: [-4, 0, 4], pass: true },
          { name: "continuous rate", expected: [2, 4, 6, 8], pass: true },
          { name: "repair rate", expected: 9, detail: "3 frame × 3 hạt", pass: true },
          { name: "budget", expected: { count: 5, firstId: 4, lastId: 8 }, pass: true },
          { name: "hand trail", expected: "5 image_frame, cuối cùng 6 hạt", pass: true },
        ],
      },
      {
        type: "summary",
        title: "Phần việc của bạn trên đảo",
        points: ["Dùng count để tạo đúng số hạt.", "Dùng spread trong phép tính vận tốc.", "Dùng rate ở mỗi frame.", "Loại hạt hết life rồi giữ list trong ngân sách."],
        action: "VÀO XƯỞNG BỘ PHÁT HẠT",
      },
    ],
  }),

  lecture({
    id: "islandEFFECTSTAGE",
    title: "Máy Chạy Màn Diễn Theo Thứ Tự Nào?",
    practicePage: "islandEFFECTSTAGE.html",
    objective: "Đọc thứ tự INPUT và OUTPUT, gọi hàm đúng cú pháp và dùng delay để từng nhịp nhìn thấy được.",
    given: "Các hàm watch, display, fire_vortex và delay đã có sẵn.",
    machineDoes: "Thực hiện từng lời gọi từ trên xuống và chờ đúng số giây.",
    learnerDoes: "Sắp xếp các nhịp, gọi đủ hàm và thêm phần kết thúc.",
    output: "Nhãn số ngón tay, hiệu ứng lửa và lời chào xuất hiện lần lượt, không chồng mất nhau.",
    slides: [
      {
        type: "scene",
        title: "Một màn diễn có ba nhịp",
        beats: ["MỞ MÀN", "HIỆU ỨNG LỬA", "HẾT MÀN"],
        prompt: "Nếu cả ba lệnh cùng chạy, điều gì quyết định nhịp nào xuất hiện trước?",
      },
      {
        type: "pipeline",
        title: "INPUT đi vào, OUTPUT đi ra",
        stages: [
          { id: "input", label: "INPUT", detail: "watch() đọc số ngón tay", owner: "machine" },
          { id: "store", label: "LƯU GIÁ TRỊ", detail: "finger nhận kết quả", owner: "learner" },
          { id: "output1", label: "OUTPUT 1", detail: "display nhãn", owner: "learner" },
          { id: "output2", label: "OUTPUT 2", detail: "fire_vortex()", owner: "learner" },
          { id: "output3", label: "OUTPUT 3", detail: "display lời kết", owner: "learner" },
        ],
      },
      {
        type: "timeline",
        title: "Delay giữ mỗi nhịp trên sân khấu",
        events: [
          { at: 0, duration: 0.8, action: "display", value: "MỞ MÀN" },
          { at: 0.8, duration: 1.2, action: "fire_vortex", value: "LỬA" },
          { at: 2.0, duration: 0.8, action: "display", value: "HẾT MÀN" },
        ],
        totalDuration: 2.8,
      },
      {
        type: "walkthrough",
        title: "Con trỏ chạy từ trên xuống",
        code: ["display(\"MỞ MÀN\")", "delay(0.8)", "fire_vortex()", "delay(1.2)", "display(\"HẾT MÀN\")", "delay(0.8)"],
        steps: [
          { line: 1, visible: "MỞ MÀN" },
          { line: 2, wait: 0.8 },
          { line: 3, visible: "fire" },
          { line: 4, wait: 1.2 },
          { line: 5, visible: "HẾT MÀN" },
          { line: 6, wait: 0.8 },
        ],
      },
      {
        type: "counterexample",
        title: "Tên hàm chưa phải là một lời gọi",
        cases: [
          { code: "fire_vortex", result: "Máy chỉ thấy đối tượng hàm; lửa không chạy", valid: false },
          { code: "fire_vortex()", result: "Máy gọi hàm; lửa xuất hiện", valid: true },
        ],
      },
      {
        type: "loop",
        title: "Một INPUT có thể dẫn tới nhiều OUTPUT",
        body: "watch() chạy một lần. Các output phía sau dùng lại giá trị đã lưu trong finger.",
        code: ["finger = watch()", "display(\"Số ngón tay: \" + str(finger))", "delay(0.8)", "fire_vortex()", "delay(1.2)", "display(\"CẢM ƠN KHÁN GIẢ\")"],
        iterations: 1,
      },
      {
        type: "tests",
        title: "Pip kiểm tra dấu vết của cả ba nhịp",
        tests: [
          { name: "opening", expected: "Số ngón tay:", pass: true },
          { name: "effect", expected: "fire", pass: true },
          { name: "ending", expected: "CẢM ƠN KHÁN GIẢ", pass: true },
          { name: "order", expected: ["input label", "fire", "ending"], pass: true },
        ],
      },
      {
        type: "summary",
        title: "Phần việc của bạn trên đảo",
        points: ["Đọc INPUT một lần bằng watch().", "Gọi hàm bằng dấu ngoặc ().", "Viết output theo đúng thứ tự muốn thấy.", "Dùng delay để mỗi nhịp tồn tại đủ lâu."],
        action: "VÀO RẠP NỐI HIỆU ỨNG",
      },
    ],
  }),

  lecture({
    id: "islandPROJECT1",
    title: "Đánh Thức Cổng Bụi Kotopia",
    practicePage: "islandPROJECT1.html",
    objective: "Ghép kiểm tra kiểu, vòng lặp tích lũy và nhánh điều kiện thành một cỗ máy phản ứng với camera.",
    given: "Tên cổng, target và các hàm hiệu ứng được cho sẵn.",
    machineDoes: "watch() đọc số ngón tay thật; các hàm display, lighten, darken và fire_vortex hiển thị kết quả.",
    learnerDoes: "Kiểm tra dữ liệu, cộng power cho tới target rồi chọn phản ứng theo power mới.",
    output: "Các tổng power được in, hiệu ứng thay đổi theo mốc và cuối cùng hiện CỔNG BỤI MỞ.",
    slides: [
      {
        type: "scene",
        title: "Một cổng cần tích đủ sức mạnh",
        body: "Mỗi lần camera đọc bàn tay, số ngón tay được cộng vào power.",
        state: { power: 0, target: 10, gate: "closed" },
        prompt: "Cỗ máy phải làm gì nếu một lần đọc vẫn chưa đủ 10?",
      },
      {
        type: "pipeline",
        title: "Đường đi từ camera tới hiệu ứng",
        stages: [
          { id: "input", label: "INPUT THẬT", detail: "watch() đọc số ngón tay", owner: "machine" },
          { id: "update", label: "UPDATE", detail: "power = power + finger", owner: "learner" },
          { id: "decision", label: "CHỌN NHÁNH", detail: "THẤP, GẦN hay MỞ", owner: "learner" },
          { id: "render", label: "OUTPUT", detail: "darken, lighten hoặc fire_vortex", owner: "machine" },
        ],
      },
      {
        type: "counterexample",
        title: "Kiểm tra kiểu trước khi cộng",
        cases: [
          { target: 10, type: "int", operation: "power >= target", result: "so sánh được", valid: true },
          { target: "10", type: "str", operation: "power >= target", result: "int không so sánh trực tiếp với str", valid: false },
        ],
      },
      {
        type: "loop",
        title: "While đọc lại cho tới khi đủ",
        code: ["power = 0", "enough_power = power >= target", "while enough_power == False:", "    finger = watch()", "    power = power + finger", "    enough_power = power >= target"],
        condition: "enough_power == False",
      },
      {
        type: "walkthrough",
        title: "Theo dõi một lượt chạy cụ thể",
        body: "Giả sử camera lần lượt đọc 2, 3, 1 và 4 ngón.",
        target: 10,
        steps: [
          { read: 2, before: 0, after: 2, branch: "THẤP", effect: "darken", continue: true },
          { read: 3, before: 2, after: 5, branch: "GẦN", effect: "lighten", continue: true },
          { read: 1, before: 5, after: 6, branch: "GẦN", effect: "lighten", continue: true },
          { read: 4, before: 6, after: 10, branch: "MỞ", effect: "fire_vortex", continue: false },
        ],
      },
      {
        type: "counterexample",
        title: "Phải chọn nhánh sau khi cập nhật power",
        cases: [
          { order: ["read", "update", "branch"], before: 6, read: 4, checked: 10, result: "MỞ", valid: true },
          { order: ["branch", "read", "update"], before: 6, read: 4, checked: 6, result: "GẦN thêm một lượt", valid: false },
        ],
      },
      {
        type: "tests",
        title: "Pip kiểm tra từng bộ phận rồi mới kiểm tra dự án",
        tests: [
          { name: "bool loop", input: { power: 0, target: 3, step: 1 }, expected: [1, 2, 3, "MỞ CỔNG"], pass: true },
          { name: "type shield", input: { target: 10 }, expected: "KIỂU ỔN", pass: true },
          { name: "branch loop", input: { target: 6, step: 2 }, expected: [2, "THẤP", 4, "GẦN", 6, "MỞ"], pass: true },
          { name: "camera project", input: "watch() nhiều lượt", expected: "CỔNG BỤI MỞ", pass: true },
        ],
      },
      {
        type: "summary",
        title: "Phần việc của bạn trên đảo",
        points: ["Chặn dữ liệu sai kiểu.", "Đọc camera và cộng vào power.", "Tính lại enough_power sau mỗi lần cộng.", "Chọn hiệu ứng bằng if/elif/else.", "Dừng khi power đạt target."],
        action: "VÀO ĐẢO DỰ ÁN I",
      },
    ],
  }),
]);

export default PARTICLE_PROJECT_LECTURES;
