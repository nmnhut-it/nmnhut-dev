// node07v2.js — PEDAGOGY V2 CLONE of node07.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson07v2.html, also reachable via dev-test.html?src=node07v2.
// `index` matches node07.js (7) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node07.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file started as the narrower badge-only clone. It is
// now polished for the live V2 track: review gate and checkpointed wait-loop arc.
export default {
  index: 7,
  title: "Lặp lại với vòng while",
  subtitle: "viết luật một lần, máy lặp ngàn lần — và luật DỪNG",
  bundle: {
    art: "assets/future-packet.webp",
    name: "GÓI VÒNG LẶP",
  },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY VÒNG LẶP",
    blurb: "bộ phận giúp cỗ máy lặp một khối lệnh chừng nào điều kiện còn đúng và dừng khi điều kiện sai",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn cổng ranh giới",
        questions: [
          {
            q: "Luật ghi \"sức mạnh 6 TRỞ LÊN thì mở\". Với `power = 6`, dòng nào mở cổng đúng?",
            a: [
              "`if power > 6:`",
              "`if power >= 6:`",
              "`if power < 6:`",
            ],
            correct: 1,
          },
          {
            q: "Trong máy đo ba bậc, máy đọc `if`/`elif` từ trên xuống. Khi gặp nhánh ĐÚNG đầu tiên, máy làm gì?",
            a: [
              "Dừng ở nhánh đó, không xét các nhánh dưới nữa",
              "Chạy tiếp mọi nhánh còn lại",
              "Luôn nhảy xuống `else`",
            ],
            correct: 0,
          },
          {
            q: "Muốn tìm lỗi ranh giới trong luật \"10 điểm trở lên thì đậu\", nên thử điểm nào trước?",
            a: [
              "9",
              "10",
              "11",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Qua khỏi cổng đá, tụi mình lạc vào VỰC XOÁY. TRÙNG VÔ TẬN đã yểm bùa khiến mọi con đường lặp mãi. Muốn thoát, tụi mình phải học vòng lặp và điều quan trọng nhất: cách làm nó dừng.",
    },
    {
      npc: "Trước đây, muốn máy đọc tay ba lần, tụi mình phải viết `power = power + watch()` ba lần. Nếu cần đọc tay 100 lần thì sao? Pip có một câu đố cho bạn đây.",
    },
    {
      quiz: {
        title: "Chép tay tới bao giờ",
        questions: [
          {
            q: "Muốn máy cộng sức mạnh của 100 lần giơ tay, theo kiểu cũ thì phải chép dòng `power = power + watch()` bao nhiêu lần?",
            a: [
              "1 lần là đủ",
              "100 lần — chép tới mỏi nhừ tay",
              "Không có cách nào làm được",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Viết cùng một dòng 100 lần vừa dài vừa dễ sai. Vòng lặp cho phép mình viết một khối lệnh một lần, rồi để máy tự chạy lại khối đó. Cuộn chú mới tới rồi!",
    },
    {
      gift: {
        art: "assets/scroll-of-repeat.webp",
        glyph: "🔁",
        name: "CUỘN CHÚ WHILE",
        blurb: "từ khóa `while` lặp một khối lệnh chừng nào điều kiện còn đúng",
      },
    },
    {
      npc: "Từ khóa `while` có thể hiểu là \"chừng nào\". Điều kiện `power < 6` còn đúng thì máy chạy khối thụt lề rồi kiểm tra lại. Khi điều kiện sai, vòng lặp dừng.",
    },
    {
      code: `from camera_charm import watch, display
from old_computer import say_num

power = 0
while power < 6:
    power = power + watch()
    say_num(power)

display("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")
`,
      label: "charge_loop.py",
      note: `ĐỀ BÀI
Bạn hãy bấm RUN rồi giơ tay vài lần. Mỗi INPUT từ camera được cộng vào \`power\`, sau đó máy in tổng mới. Vòng lặp phải dừng khi tổng đạt 6 hoặc lớn hơn và hiện dòng \"ĐỦ SỨC MẠNH!\".`,
      expectOut: /thoát vòng lặp/i,
      solution: `from camera_charm import watch, display
from old_computer import say_num

power = 0
while power < 6:
    power = power + watch()
    say_num(power)

display("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")
`,
    },
    {
      npc: "Dòng `watch()` chạy lại ở mỗi vòng. Lần đầu camera đọc 4 ngón, tổng thành 4 nên máy lặp tiếp. Lần sau camera lại đọc 4 ngón, tổng thành 8; `power < 6` sai nên vòng lặp dừng.",
    },
    {
      remember: [
        "`while condition:` — chừng nào điều kiện còn ĐÚNG, máy lặp lại cả khối thụt lề",
        "Trong thân vòng lặp phải có thứ làm điều kiện ĐỔI DẦN (như cộng dồn) — không thì máy lặp mãi mãi",
        "Vòng lặp = viết luật MỘT lần, máy chạy NHIỀU lần",
      ],
    },
    {
      checkpoint: {
        text: "`while condition:` lặp lại khối thụt lề chừng nào `condition` còn đúng và dừng khi nó sai. Thân vòng lặp phải cập nhật dữ liệu để điều kiện có thể đổi, như `power = power + watch()`.",
      },
    },
    {
      quiz: {
        title: "Lần theo vòng lặp",
        questions: [
          {
            q: "`power = 0`, luật `while power < 6:`. Bạn giơ 4 ngón, rồi lại 4 ngón nữa. Vòng lặp chạy mấy lần rồi dừng?",
            a: [
              "1 lần — cộng được 4 là máy dừng",
              "2 lần — tổng thành 4 rồi 8; tới 8 thì điều kiện `8 < 6` sai nên máy dừng",
              "Chạy mãi không dừng",
            ],
            correct: 1,
          },
          {
            q: "Với đoạn này:\n```python\npower = 0\nwhile power < 6:\n    power = power + watch()\n    say_num(power)\n```\nPhần nào là \"luật DỪNG\" của vòng lặp?",
            a: [
              "Dòng `say_num(power)`",
              "Điều kiện `power < 6` — khi nó sai, máy dừng lặp",
              "Dòng `display(...)` ở cuối",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "`if` và `while` đều có điều kiện, dấu `:` và khối thụt lề. Điểm khác là `if` kiểm tra một lần, còn `while` kiểm tra lại sau mỗi vòng. Bạn bấm RUN để so sánh nhé.",
    },
    {
      code: `from old_computer import say, say_num

x = 0
if x < 3:           # if: hỏi MỘT lần
    x = x + 1
    say_num(x)

say("---")

y = 0
while y < 3:        # while: hỏi ĐI HỎI LẠI
    y = y + 1
    say_num(y)
`,
      label: "if_vs_while.py",
      note: `ĐỀ BÀI
Bạn hãy RUN rồi so hai nửa: nửa if chỉ in được 1 (hỏi một lần rồi đi tiếp), nửa while in 1, 2, 3 (hỏi lại tới khi 3 < 3 sai mới dừng). Không camera, không may rủi — số nào cũng đoán trước được.`,
      expectOut: {
        all: [
          {
            minLines: 5,
          },
          /^---$/,
          /^2$/,
          /^3$/,
        ],
      },
      solution: `from old_computer import say, say_num

x = 0
if x < 3:           # if: hỏi MỘT lần
    x = x + 1
    say_num(x)

say("---")

y = 0
while y < 3:        # while: hỏi ĐI HỎI LẠI
    y = y + 1
    say_num(y)
`,
    },
    {
      checkpoint: {
        text: "`if` và `while` cùng nhận một điều kiện và một khối thụt lề, nhưng `if` kiểm tra điều kiện MỘT lần duy nhất, còn `while` kiểm tra lại sau MỖI vòng — nên cùng khối lệnh, `if` chạy tối đa 1 lần, `while` chạy tới khi điều kiện sai.",
      },
    },
    {
      quiz: {
        title: "If một lần, while nhiều lần",
        questions: [
          {
            q: "Nhớ luật: `if` chỉ kiểm tra điều kiện MỘT lần, không tự lặp. Với đoạn này:\n```python\nx = 0\nif x < 3:\n    x = x + 1\n    say_num(x)\n```\nMáy in ra gì?",
            a: [
              "Chỉ 1 dòng: 1",
              "Ba dòng: 1, 2, 3",
              "Không in gì",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Cổng tiếp theo yêu cầu 12 sức mạnh. Điều kiện hiện tại vẫn dùng mốc 6, nên vòng lặp có thể dừng quá sớm. Bạn hãy đổi mốc rồi kiểm tra kết quả.",
    },
    {
      code: `from camera_charm import watch, display
from old_computer import say_num

power = 0
# lượt của bạn — cổng thoát đoạn này đợi 12 sức mạnh, sửa con số mốc trong điều kiện
while power < 6:
    power = power + watch()
    say_num(power)

display("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")
`,
      label: "charge_loop_12.py",
      note: "ĐỀ BÀI\nBạn hãy đổi mốc 6 trong điều kiện `while power < 6:` thành 12 rồi bấm RUN. Mỗi INPUT từ camera được cộng vào `power`; OUTPUT cuối phải có một tổng từ 12 trở lên và dòng \"ĐỦ SỨC MẠNH!\".",
      expectOut: {
        all: [
          /^1[2-6]$/,
          /thoát vòng lặp/i,
        ],
      },
      solution: `from camera_charm import watch, display
from old_computer import say_num

power = 0
while power < 12:
    power = power + watch()
    say_num(power)

display("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")
`,
    },
    {
      npc: "Nếu thân vòng lặp không cập nhật dữ liệu trong điều kiện, điều kiện có thể đúng mãi và máy không tự dừng. Đó là VÒNG LẶP VÔ TẬN. Bạn thử tìm lỗi trong ví dụ sau nhé.",
    },
    {
      checkpoint: {
        text: "Thiếu dòng làm điều kiện đổi dần trong thân vòng lặp (ví dụ quên `power = power + watch()`) làm điều kiện đúng mãi mãi — đó là VÒNG LẶP VÔ TẬN, máy không bao giờ tự dừng.",
      },
    },
    {
      quiz: {
        title: "Bùa vòng lặp vô tận",
        questions: [
          {
            q: "`power = 0` rồi `while power < 6:` nhưng trong thân CHỈ có `say_num(power)`, không có dòng cộng dồn. Máy sẽ làm gì?",
            a: [
              "Chạy đúng 6 lần rồi dừng",
              "In số 0 mãi mãi không dừng — power đứng yên nên điều kiện đúng hoài",
              "Máy báo lỗi ngay từ đầu",
            ],
            correct: 1,
          },
          {
            q: "Đoạn này lặp vô tận vì `power` không đổi:\n```python\npower = 0\nwhile power < 6:\n    say_num(power)\n```\nMuốn máy có cơ hội dừng, phải thêm gì vào THÂN vòng lặp?",
            a: [
              "Thêm một dòng `display()` sau vòng lặp",
              "Thêm thứ làm `power` thay đổi — ví dụ `power = power + 1`",
              "Gán lại `power = 0` trong mỗi vòng",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "🛑",
        name: "HUY HIỆU LUẬT DỪNG",
        blurb: "phần thưởng cho việc hiểu rằng thân vòng lặp phải cập nhật dữ liệu để điều kiện có thể trở thành sai",
        badge: true,
        badgeId: "huy_hieu_luat_dung",
      },
    },
    {
      npc: "Vòng lặp còn dùng để đếm ngược. Cỗ máy bắt đầu với `count = 3`; mỗi vòng in `count` rồi giảm đi 1. Bạn hãy đoán OUTPUT trước khi chạy nhé.",
    },
    {
      quiz: {
        title: "Đoán trước khi chạy",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\ncount = 3\nwhile count > 0:\n    say_num(count)\n    count = count - 1\nsay(\"BÙM!\")\n```\nMáy nói gì?",
            a: [
              "3, 2, 1, rồi BÙM!",
              "1, 2, 3, rồi BÙM!",
              "BÙM! trước, rồi mới đếm 3, 2, 1",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from camera_charm import fire_vortex
from old_computer import say, say_num

count = 3
while count > 0:
    say_num(count)
    count = count - 1

say("BÙM!")
fire_vortex()
`,
      label: "countdown.py",
      note: `ĐỀ BÀI
Bạn hãy bấm RUN. Cho sẵn \`count = 3\`; mỗi vòng máy in \`count\` rồi trừ 1. OUTPUT đúng là 3, 2, 1, sau đó là \"BÙM!\" và hiệu ứng lửa.`,
      expectOut: {
        all: [
          /^3$/,
          /^2$/,
          /^1$/,
          /bùm/i,
        ],
      },
      solution: `from camera_charm import fire_vortex
from old_computer import say, say_num

count = 3
while count > 0:
    say_num(count)
    count = count - 1

say("BÙM!")
fire_vortex()
`,
    },
    {
      npc: "Mỗi vòng, `count = count - 1` làm `count` nhỏ đi 1. Vì vậy, điều kiện `count > 0` cuối cùng sẽ sai. Dù đếm xuôi hay ngược, dữ liệu trong điều kiện vẫn phải thay đổi.",
    },
    {
      npc: "BỆNH VIỆN THẦN CHÚ có một cỗ máy đếm ngược đang lỗi. Bạn hãy bấm RUN, đọc thông báo lỗi rồi sửa dòng `while` để máy đếm được 3, 2, 1.",
    },
    {
      code: `from old_computer import say, say_num

count = 3
while count > 0
    say_num(count)
    count = count - 1

say("XONG!")
`,
      label: "cracked_countdown.py",
      note: "ĐỀ BÀI\nBạn hãy RUN để xem thông báo lỗi chỉ chỗ nào, rồi vá lại vết cắn. Gợi ý nhỏ: dòng `while` cũng cần dấu hai chấm `:` ở cuối, giống `if`. Chữa xong, máy phải đếm 3, 2, 1 rồi hô XONG!",
      expectOut: {
        all: [
          /^3$/,
          /^2$/,
          /^1$/,
          /xong/i,
        ],
      },
      solution: `from old_computer import say, say_num

count = 3
while count > 0:
    say_num(count)
    count = count - 1

say("XONG!")
`,
    },
    {
      npc: "Cỗ máy chụp hình bạn từng dùng cũng cần chờ tín hiệu tay. MÁY ĐỢI HIGH-FIVE dưới đây gọi `watch()` nhiều lần, cho tới khi camera đọc được 5 ngón.",
    },
    {
      code: `from camera_charm import watch, display, fire_vortex

finger = watch()
while finger < 5:
    finger = watch()

display("ĐẬP TAY!")
fire_vortex()
`,
      label: "wait_high_five.py",
      note: `ĐỀ BÀI
Bạn hãy bấm RUN. INPUT đầu tiên là 1 ngón nên \`finger < 5\` còn đúng và máy gọi \`watch()\` lại. Khi INPUT tiếp theo là 5 ngón, vòng lặp dừng; OUTPUT đúng là \"ĐẬP TAY!\" và hiệu ứng lửa.`,
      expect: [
        1,
        5,
      ],
      expectOut: /đập tay/i,
      solution: `from camera_charm import watch, display, fire_vortex

finger = watch()
while finger < 5:
    finger = watch()

display("ĐẬP TAY!")
fire_vortex()
`,
    },
    {
      checkpoint: {
        text: "`while finger < 5:` biến việc \"đợi high-five\" thành vòng lặp: nếu `finger` còn nhỏ hơn 5 thì gọi `watch()` lại; khi `finger` là 5, điều kiện sai và máy thoát vòng.",
      },
    },
    {
      quiz: {
        title: "Máy đang đợi",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nfinger = watch()\nwhile finger < 5:\n    finger = watch()\ndisplay(\"ĐẬP TAY!\")\n```\nNếu lần đầu bạn đã giơ 5 ngón, thân vòng `while` chạy mấy lần?",
            a: [
              "0 lần, vì `5 < 5` sai ngay từ đầu",
              "1 lần",
              "5 lần",
            ],
            correct: 0,
          },
          {
            q: "Đọc đoạn code này:\n```python\nfinger = watch()\nwhile finger < 5:\n    finger = watch()\n```\nDòng nào cập nhật `finger` để điều kiện có thể trở thành sai?",
            a: [
              "`finger = watch()` ở trong thân vòng lặp",
              "`display(\"ĐẬP TAY!\")`",
              "`fire_vortex()`",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Pip nhắc nhỏ: `freeze()` là lệnh đóng băng bạn đã dùng trong bài trước. TRÙNG VÔ TẬN cũng sợ lệnh này lắm.",
    },
    {
      npc: "Trước khi gặp TRÙNG VÔ TẬN, tụi mình ghé LÒ RÈN nhé. HUY HIỆU LUẬT DỪNG sẽ giúp Pip rèn một quả BOM MẬT NGỮ để phá vòng lặp vô tận.",
    },
    // BOSS CONCEPT V2 migration (FORGE-PLAN.md "FINALIZED") — same pattern as
    // node04v2.js/node05v2.js/node06v2.js: legacy rounds[] moves into
    // forge.quiz (code-fix rounds become "what's the bug" text quiz), the
    // gesture finisher round (final_charge.py) is RETIRED for the new KO.
    {
      forge: {
        quiz: [
          {
            q: "Đọc đoạn code này:\n```python\ncount = 2\nwhile count > 0:\n    say_num(count)\n    count = count - 1\n```\nMáy in ra gì?",
            a: ["2, rồi 1", "2, 1, rồi 0", "1, rồi 2"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code này:\n```python\nx = 0\nwhile x < 3:\n    x = x + 1\n    say_num(x)\n```\nMáy in những số nào?",
            a: ["1, 2, 3", "0, 1, 2", "1, 2, 3, 4"],
            correct: 0,
          },
          {
            q: "Vòng `while power < 6:` dừng lại khi nào?",
            a: ["Khi `power` còn nhỏ hơn 6", "Khi điều kiện `power < 6` trở thành sai — tức là `power` đã đạt 6 hoặc hơn", "Ngay sau vòng đầu tiên"],
            correct: 1,
          },
          {
            q: "Đoạn code này không chạy thân vòng lần nào:\n```python\ncount = 3\nwhile count < 0:\n    count = count - 1\n```\nCần sửa điều kiện thế nào để đếm từ 3 xuống 1?",
            a: ["Phải là `while count > 0:` — `count` đang giảm dần từ 3 xuống, không phải tăng lên", "Không sai gì cả", "Phải đổi `count = 3` thành `count = -3`"],
            correct: 0,
          },
          {
            q: "Đoạn code này không thay đổi `power`:\n```python\npower = 0\nwhile power < 6:\n    say_num(power)\n```\nChuyện gì sẽ xảy ra?",
            a: ["Máy tự tăng `power` sau mỗi vòng", "Vòng lặp vô tận — điều kiện luôn đúng nên máy không tự dừng", "Thân vòng chỉ chạy một lần"],
            correct: 1,
          },
          {
            q: "Dòng `say_num(stone_count)` không thụt lề nên nằm ngoài vòng `while stone_count < 3:` và chỉ chạy một lần. Muốn máy in sau mỗi lần nhặt đá, phải sửa gì?",
            a: ["Thụt lề dòng `say_num(stone_count)` để đặt nó trong thân vòng lặp", "Xóa dòng `say_num(stone_count)`", "Đổi `while` thành `if`"],
            correct: 0,
          },
          {
            q: "`finger = watch()` rồi `while finger < 5:` với thân `finger = watch()`. Bạn giơ ✋ 5 ngón ngay lần ĐẦU tiên. Vòng lặp chạy mấy lần?",
            a: ["0 lần — điều kiện `5 < 5` sai ngay từ đầu nên máy đi tiếp", "5 lần"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "BOM MẬT NGỮ sẵn sàng rồi! Bạn giơ ngón trỏ ☝ để ngắm, sau đó giơ bàn tay ✋ để phóng bom và phá vòng lặp của TRÙNG VÔ TẬN. Chưa có bom thì quay lại LÒ RÈN nhé.",
    },
    {
      boss: {
        name: "TRÙNG VÔ TẬN",
        sheet: { src: "assets/endless-wyrm-sheet.webp" },
        art: "assets/endless-wyrm.webp",
        glyph: "🐉",
        ko: true,
      },
    },
    {
      npc: "Trùng Vô Tận đã tan thành bụi sáng! Bạn biết viết vòng `while`, cập nhật dữ liệu trong thân vòng và kiểm tra điều kiện dừng. Cột mốc sáng rồi; tụi mình đi tiếp thôi!",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG CỘT MỐC",
    theme: {
      motion: "rain",
      palette: {
        core: "#d9eee5",
        dust: "#e3f3dc",
        rune: "#f4c85a",
      },
      glyphs: "`while`",
    },
  },
};
