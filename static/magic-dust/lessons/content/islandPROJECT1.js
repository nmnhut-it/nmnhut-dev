// islandPROJECT1.js — ĐẢO GÁC CỔNG KOTOPIA, a bonus side-island
// (island.js, not node.js): a small synthesis project combining node04/05's
// if/elif/else, node07's while loop, and node08's primitive data types
// (`str`/`int`/`bool` + `type()`). node08 may be authored in parallel, so
// this island uses only the handed-off node08 vocabulary list. Per
// PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary (no new
// concept — recombination/capstone practice). Gated unlockAt:9 (after the
// later of node07 and node08 is done; node08 is index 8 in saga.js's current
// NODES array shape).
export default {
  index: -1,
  sideIslandId: "islandPROJECT1",
  title: "ĐẢO DỰ ÁN I: CỔNG BỤI KOTOPIA",
  subtitle: "dựng một cỗ máy thật từ kiểu dữ liệu, vòng lặp và nhánh rẽ",
  bundle: { art: "assets/rookie-bundle.webp", name: "HỘP ĐIỀU KHIỂN CỔNG BỤI" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY GÁC CỔNG KOTOPIA",
    blurb: "cỗ máy canh giữ lối vào Kotopia: kiểm tra dữ liệu, gom sức mạnh từ camera và mở cổng bằng hiệu ứng lửa",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ DỰ ÁN I: ĐÁNH THỨC CỔNG BỤI ✦",
        hook: "Tín hiệu khẩn từ rìa Kotopia: Cổng Bụi đã tắt, còn bóng tối của Chúa tể Vô Định đang tiến gần. Muốn thắp cổng, bạn phải dựng lại cỗ máy điều khiển từ những mảnh Mật Ngữ mình đã học.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Đây là dự án tổng hợp đầu tiên. Bạn không học cú pháp mới; thay vào đó, bạn sẽ dùng kiến thức cũ để tạo một cỗ máy nhận sức mạnh từ camera và mở Cổng Bụi.",
    },
    {
      npc: "Cỗ máy có ba bộ phận. MỐC 1 giữ luật dừng bằng `bool`. MỐC 2 chặn dữ liệu sai kiểu. Qua hai mốc này, cỗ máy sẽ biết lúc nào được phép hoạt động và lúc nào phải dừng.",
    },
    {
      npc: "MỐC 3 dùng `if/elif/else` để đổi hiệu ứng trong lúc `while` đang gom sức mạnh. Khi cả ba bộ phận chạy đúng, bạn sẽ tự nối chúng thành cỗ máy hoàn chỉnh.",
    },

    // ── bài 1: bool điều khiển while ──
    {
      quiz: {
        title: "Mốc 1 — Bộ khóa tự dừng",
        questions: [
          {
            q: 'Đọc đoạn code của bộ khóa:\n```python\npower = 0\ntarget = 3\nenough_power = power >= target\nwhile enough_power == False:\n    power = power + 1\n    enough_power = power >= target\nsay_num(power)\n```\nKhi vòng lặp dừng, máy in số nào?',
            a: ["1", "3", "False"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say, say_num\n\npower = 0\ntarget = 3\nenough_power = power >= target\n\nwhile enough_power == False:\n    power = power + 1\n    say_num(power)\n    enough_power = power >= target\n\nsay("MỞ CỔNG")\n',
      label: "gate_bool.py",
      note: "MỐC 1 — CHẠY THỬ BỘ KHÓA\nCho sẵn `power = 0` và `target = 3`; bài này không đọc INPUT từ bên ngoài. Bạn hãy bấm RUN để quan sát `power` tăng thành 1, 2, 3. Sau mỗi lần tăng, đoạn code tính lại `enough_power`; khi biến này thành `True`, vòng lặp dừng và máy in `MỞ CỔNG`.",
      expectOut: { all: [/^1$/, /^2$/, /^3$/, /mở cổng/i] },
      solution: 'from old_computer import say, say_num\n\npower = 0\ntarget = 3\nenough_power = power >= target\n\nwhile enough_power == False:\n    power = power + 1\n    say_num(power)\n    enough_power = power >= target\n\nsay("MỞ CỔNG")\n',
    },
    {
      code: 'from old_computer import say, say_num\n\npower = 0\ntarget = 5\ncharge_step = 2\nenough_power = power >= target\n\n# Đến lượt của bạn: viết vòng while để gom đủ sức mạnh\n',
      label: "gate_bool_write.py",
      note: "MỐC 1 — TỰ LẮP BỘ KHÓA\nCho sẵn `power = 0`, `target = 5` và mỗi vòng tăng thêm `charge_step = 2`; bài này không đọc INPUT từ bên ngoài. Bạn hãy dùng `while` để cập nhật sức mạnh và trạng thái đủ/chưa đủ. OUTPUT đúng lần lượt có các số `2`, `4`, `6`, rồi dòng `MỞ CỔNG`.",
      expectOut: { all: [/^2$/, /^4$/, /^6$/, /mở cổng/i] },
      solution: 'from old_computer import say, say_num\n\npower = 0\ntarget = 5\ncharge_step = 2\nenough_power = power >= target\n\nwhile enough_power == False:\n    power = power + charge_step\n    say_num(power)\n    enough_power = power >= target\n\nsay("MỞ CỔNG")\n',
    },
    {
      checkpoint: {
        text: "Một biến `bool` như `enough_power = power >= target` có thể làm luật dừng cho `while`; sau mỗi vòng phải gán lại `enough_power` để nó phản ánh tổng mới.",
      },
    },
    {
      quiz: {
        title: "Cập nhật bool trong vòng lặp",
        questions: [
          {
            q: "Cho `power = 0` và `enough_power = power >= 5`. Trong vòng `while enough_power == False`, đoạn code chỉ tăng `power` mà không gán lại `enough_power`. Chuyện gì có thể xảy ra?",
            a: [
              "`enough_power` vẫn giữ False cũ, nên vòng lặp không biết tổng đã đủ và có thể chạy mãi",
              "Python tự cập nhật `enough_power` theo `power`",
              "Máy đổi `enough_power` thành số 5",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: type gate trước khi chạy project ──
    {
      npc: "Bộ khóa đã biết tự dừng. Nhưng nếu `target` là chuỗi `\"10\"`, cỗ máy sẽ lỗi khi so sánh. MỐC 2 kiểm tra dữ liệu: tên cổng phải có kiểu `str`, còn mốc sức mạnh phải có kiểu `int`.",
    },
    {
      quiz: {
        title: "Mốc 2 — Tấm chắn dữ liệu",
        questions: [
          {
            q: 'Cho `gate_name = "Cổng Bụi"` và `target = "10"`. Khi đoạn code kiểm tra `type(target) == int`, nhánh nào phải chạy để ngăn dữ liệu sai đi vào vòng lặp?',
            a: ['Nhánh báo "MỐC SAI KIỂU"', 'Nhánh mở cổng ngay', 'Nhánh nói tên cổng sai kiểu'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\ngate_name = "Cổng Bụi"\ntarget = "10"\n\n# Đến lượt của bạn: sửa mốc sức mạnh cho đúng kiểu\nif type(gate_name) == str:\n    if type(target) == int:\n        say("KIỂU ỔN")\n    else:\n        say("MỐC SAI KIỂU")\nelse:\n    say("TÊN SAI KIỂU")\n',
      label: "gate_type_fix.py",
      note: "MỐC 2 — SỬA TẤM CHẮN\nCho sẵn `gate_name = \"Cổng Bụi\"` và `target = \"10\"`; bài này không đọc INPUT từ bên ngoài. `target` đang có kiểu `str`, nhưng cỗ máy cần một `int` để so sánh sức mạnh. Bạn hãy sửa giá trị được gán cho `target`. OUTPUT đúng là `KIỂU ỔN`.",
      expectOut: /kiểu ổn/i,
      solution: 'from old_computer import say\n\ngate_name = "Cổng Bụi"\ntarget = 10\n\nif type(gate_name) == str:\n    if type(target) == int:\n        say("KIỂU ỔN")\n    else:\n        say("MỐC SAI KIỂU")\nelse:\n    say("TÊN SAI KIỂU")\n',
    },
    {
      checkpoint: {
        text: "`type(x) == str` và `type(x) == int` là cách kiểm tra kiểu trước khi chạy phần chính; dùng if/else để chặn dữ liệu sai kiểu trước khi vòng lặp bắt đầu.",
      },
    },
    {
      quiz: {
        title: "Chặn sai kiểu trước vòng lặp",
        questions: [
          {
            q: 'Nếu `target = "10"` mà đoạn code vẫn chạy `while power < target:`, vấn đề nằm ở đâu?',
            a: [
              "`target` là `str`, còn `power` là `int`; phải sửa kiểu trước khi đem ra so sánh",
              "`while` không được dùng với biến",
              "`power` phải là chữ thì mới so sánh được",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 3: if/elif/else bên trong while ──
    {
      npc: "Hai đèn trên bảng điều khiển đã sáng. MỐC 3 là bộ phản ứng: sau mỗi lần sức mạnh tăng, `if/elif/else` phải chọn đúng một tín hiệu — `THẤP`, `GẦN` hoặc `MỞ`.",
    },
    {
      code: 'from old_computer import say, say_num\n\npower = 0\ntarget = 6\nenough_power = power >= target\n\nwhile enough_power == False:\n    power = power + 2\n    say_num(power)\n    enough_power = power >= target\n    # Đến lượt của bạn: thêm các nhánh phản ứng theo power hiện tại\n',
      label: "gate_branch_loop.py",
      note: "MỐC 3 — LẮP BỘ PHẢN ỨNG\nCho sẵn `power = 0`, `target = 6`; mỗi vòng tăng thêm 2 và bài này không đọc INPUT từ bên ngoài. Bạn hãy dùng `if/elif/else` trong thân `while`: từ 6 trở lên in `MỞ`, từ 4 đến dưới 6 in `GẦN`, còn dưới 4 in `THẤP`. OUTPUT đúng là `2, THẤP, 4, GẦN, 6, MỞ`.",
      expectOut: { all: [/^2$/, /thấp/i, /^4$/, /gần/i, /^6$/, /mở/i] },
      solution: 'from old_computer import say, say_num\n\npower = 0\ntarget = 6\nenough_power = power >= target\n\nwhile enough_power == False:\n    power = power + 2\n    say_num(power)\n    enough_power = power >= target\n    if enough_power == True:\n        say("MỞ")\n    elif power >= 4:\n        say("GẦN")\n    else:\n        say("THẤP")\n',
    },
    {
      checkpoint: {
        text: "Có thể đặt if/elif/else BÊN TRONG thân `while`: mỗi vòng cập nhật dữ liệu trước, rồi dùng nhánh rẽ để phản ứng theo trạng thái mới của dữ liệu đó.",
      },
    },
    {
      quiz: {
        title: "Nhánh rẽ trong vòng lặp",
        questions: [
          {
            q: "`power` vừa tăng lên 4, `target = 6`, `enough_power = power >= target` nên đang là False. Với luật `if enough_power == True` / `elif power >= 4` / `else`, nhánh nào chạy?",
            a: ["Nhánh if mở cổng", "Nhánh elif GẦN", "Nhánh else THẤP"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 4: final camera synthesis project ──
    {
      npc: "Cả ba bộ phận đã hoạt động riêng lẻ. Bây giờ bạn sẽ nối chúng vào MÁY ĐIỀU KHIỂN CỔNG BỤI. Bản này đọc INPUT thật từ camera; khi tổng đạt 10, cổng phải bùng sáng và hiện tên.",
    },
    {
      code: 'from camera_charm import watch, display, fire_vortex, lighten, darken, freeze\nfrom old_computer import say, say_num\n\ngate_name = "CỔNG BỤI"\ntarget = 10\n\nif type(gate_name) == str:\n    if type(target) == int:\n        power = 0\n        enough_power = power >= target\n        # Đến lượt của bạn: gom sức mạnh từ camera và chọn hiệu ứng\n    else:\n        freeze()\n        say("MỐC SAI KIỂU")\nelse:\n    freeze()\n    say("TÊN SAI KIỂU")\n',
      label: "kotopia_gate.py",
      note: "DỰ ÁN CUỐI — ĐÁNH THỨC CỔNG BỤI\nCho sẵn `gate_name = \"CỔNG BỤI\"` và `target = 10`. INPUT thật là số ngón tay mà `watch()` đọc từ camera ở mỗi vòng. Bạn hãy dùng ba bộ phận vừa thử: kiểm tra kiểu trước khi chạy, dùng `while` để cộng dồn sức mạnh, rồi dùng `if/elif/else` để chọn hiệu ứng theo tổng mới. OUTPUT chứng minh dự án hoàn thành gồm các tổng sức mạnh được in ra, hiệu ứng lửa khi tổng đạt ít nhất 10, và dòng `CỔNG BỤI MỞ` trên màn hình.",
      expectOut: /cổng bụi mở/i,
      solution: 'from camera_charm import watch, display, fire_vortex, lighten, darken, freeze\nfrom old_computer import say, say_num\n\ngate_name = "CỔNG BỤI"\ntarget = 10\n\nif type(gate_name) == str:\n    if type(target) == int:\n        power = 0\n        enough_power = power >= target\n        while enough_power == False:\n            power = power + watch()\n            say_num(power)\n            enough_power = power >= target\n            if enough_power == True:\n                fire_vortex()\n            elif power >= 5:\n                lighten()\n            else:\n                darken()\n        display(gate_name + " MỞ")\n    else:\n        freeze()\n        say("MỐC SAI KIỂU")\nelse:\n    freeze()\n    say("TÊN SAI KIỂU")\n',
    },
    {
      checkpoint: {
        text: "Đoạn code tổng hợp có ba lớp: kiểm tra kiểu bằng `type(...)`, gom dữ liệu bằng `while` + `watch()`, rồi dùng if/elif/else trong mỗi vòng để phản ứng theo trạng thái mới.",
      },
    },
    {
      quiz: {
        title: "Ba lớp của máy gác cổng",
        questions: [
          {
            q: "Một cỗ máy cộng INPUT camera bằng `power = power + watch()`. Vì sao sau mỗi lần cộng, máy phải gán lại `enough_power = power >= target`?",
            a: [
              "Vì `enough_power` là bool giữ kết quả cũ; tổng thay đổi thì phải tính lại True/False mới",
              "Vì `watch()` tự xóa biến bool",
              "Vì if/elif/else chỉ chạy khi biến được gán hai lần",
            ],
            correct: 0,
          },
          {
            q: "Cho `target = \"10\"`, nên `type(target) == int` cho kết quả `False`. Đoạn code nên làm gì trước khi tới vòng `while`?",
            a: ["Báo sai kiểu và không gom sức mạnh", "Vẫn chạy while rồi hy vọng đúng", "Đổi `gate_name` thành số"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Cổng Bụi sáng rồi! Những bài luyện tập riêng lẻ giờ thành một cỗ máy đọc camera, kiểm tra dữ liệu và phản ứng theo sức mạnh của bạn. Đây là dự án đầu tiên bạn hoàn thành tại Kotopia.",
    },
    {
      remember:
        "Một dự án lớn có thể được dựng từ các bộ phận nhỏ đã kiểm tra riêng: `type(...)` chặn dữ liệu sai, `while` gom nhiều INPUT, còn `if/elif/else` chọn phản ứng sau mỗi lần dữ liệu thay đổi.",
    },
  ],
};
