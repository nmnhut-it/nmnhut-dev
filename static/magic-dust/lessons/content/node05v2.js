// node05v2.js — PEDAGOGY V2 CLONE of node05.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson05v2.html, also reachable via dev-test.html?src=node05v2.
// `index` matches node05.js (5) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node05.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file started as the narrower badge-only clone. It is
// now polished for the live V2 track: review gate, display reuse, and graded
// camera-calculator practice.
export default {
  index: 5,
  title: "Choices: Else and Everything Else",
  subtitle: "if/elif/else + phép tính + camera thật — mọi thứ hợp lại",
  bundle: {
    art: "assets/future-packet.webp",
    name: "LOGIC PACKET",
  },
  machine: {
    art: "assets/future-machine.webp",
    name: "ELSE + DISPLAY MODULE",
    blurb: "module gắn thêm cho FUTURE MACHINE — else bắt hết phần còn lại, display() hiện kết quả ngay trên màn hình AR",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      npc: "Cỗ máy đã có `if` và `elif`: 1 ngón gọi lửa, 3 ngón bật sáng, 4 ngón làm tối. Trước khi thêm từ mới, Pip ôn lại ba luật đó đã.",
    },
    {
      quiz: {
        title: "Ôn ba luật",
        questions: [
          {
            q: "Máy có ba luật:\n```python\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n```\nGiơ 3 ngón thì nhánh nào chạy?",
            a: [
              "`fire_vortex()`",
              "`lighten()`",
              "`darken()`",
            ],
            correct: 1,
          },
          {
            q: "`elif` dùng để làm gì sau một nhánh `if`?",
            a: [
              "Thêm một luật \"hoặc nếu\" khác",
              "Bắt mọi trường hợp còn lại",
              "In chữ ra console",
            ],
            correct: 0,
          },
          {
            q: "Dòng lệnh nằm bên trong `if` hoặc `elif` phải được viết thế nào?",
            a: [
              "Thụt vào bên phải",
              "Viết sát lề trái",
              "Viết trên cùng dòng với `if`",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ xem lỗ hổng còn lại nhé. Nếu tay bạn không khớp luật nào thì máy sẽ làm gì? RUN rồi giơ ✋ 5 ngón.",
    },
    {
      code: `from camera_charm import watch, fire_vortex, lighten, darken

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
`,
      label: "gap_in_rules.py",
      note: `ĐỀ BÀI
RUN rồi giơ ✋ (5 ngón) — không luật nào khớp cả, xem cỗ máy có phản ứng gì không`,
      expect: 5,
      expectOut: { minLines: 0 },
      solution: `from camera_charm import watch, fire_vortex, lighten, darken

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
`,
    },
    {
      npc: "Im ru luôn đúng không? Máy không biết làm gì khi KHÔNG luật nào khớp cả — nó chỉ đứng im.",
    },
    {
      npc: "Học thêm 1 từ nữa để vá lỗ hổng này: else — nghĩa là *nếu không cái nào đúng thì làm việc này*. Thêm else vào cuối chuỗi if/elif, rồi RUN lại, vẫn giơ ✋ (5 ngón).",
    },
    {
      code: `from camera_charm import watch, fire_vortex, lighten, darken
from old_computer import say

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
else:
    say("Không luật nào khớp -- đây là else!")
`,
      label: "first_else.py",
      note: `ĐỀ BÀI (bài mẫu)
else đã được thêm sẵn ở cuối — bạn chỉ cần RUN rồi giơ ✋ (5 ngón), lần này else sẽ xử lý phần còn lại.`,
      expect: 5,
      expectOut: /else/i,
      solution: `from camera_charm import watch, fire_vortex, lighten, darken
from old_computer import say

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
else:
    say("Không luật nào khớp -- đây là else!")
`,
    },
    {
      remember: "`else` = nếu KHÔNG luật nào ở trên đúng, thì làm việc này. Không cần điều kiện — else luôn đứng cuối chuỗi if/elif.",
    },
    {
      checkpoint: {
        text: "`else` xử lý mọi trường hợp mà các luật `if`/`elif` phía trên không khớp. Nó không có điều kiện riêng và luôn đứng cuối dãy `if`/`elif`/`else`.",
      },
    },
    {
      quiz: {
        title: "Else là gì",
        questions: [
          {
            q: "Có `if finger == 1` và `elif finger == 3`, giơ 5 ngón thì chạy nhánh nào?",
            a: [
              "nhánh if",
              "nhánh elif",
              "không nhánh nào — trừ khi có else",
            ],
            correct: 2,
          },
          {
            q: "`else` cần điều kiện riêng của nó (như `else finger == 5:`) không?",
            a: [
              "Có, luôn cần",
              "Không. `else` không có điều kiện riêng; nó chạy khi các nhánh trên đều không khớp.",
              "Chỉ cần khi dùng camera",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Vá xong lỗ hổng rồi! Học được từ mới thì cỗ máy thưởng liền — nhận quà nè:",
    },
    {
      gift: {
        art: "assets/scroll-of-frost.webp",
        glyph: "❄",
        name: "SCROLL OF FROST",
        blurb: "lệnh mới: `freeze()` — bụi phép đóng băng thành BĂNG thay vì lửa",
      },
    },
    {
      npc: "freeze() là của bạn rồi! Giờ thay vì để else chỉ nói suông, cho nó làm phép luôn: else sẽ gọi freeze() — máy tiên tri giờ có đủ 4 kết quả: lửa, sáng, tối, và băng.",
    },
    {
      code: `from camera_charm import watch, fire_vortex, lighten, darken, freeze

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
else:
    freeze()
`,
      label: "fortune_machine.py",
      note: `ĐỀ BÀI
RUN rồi giơ ✋ (5 ngón) — else giờ đóng băng luôn thay vì chỉ in chữ`,
      expect: 5,
      expectOut: /freeze/i,
      solution: `from camera_charm import watch, fire_vortex, lighten, darken, freeze

finger = watch()

if finger == 1:
    fire_vortex()
elif finger == 3:
    lighten()
elif finger == 4:
    darken()
else:
    freeze()
`,
    },
    {
      npc: "Máy tiên tri của bạn giờ phản ứng với MỌI số ngón rồi — không còn im ru nữa. Còn một món quà nữa, hợp với việc hiện kết quả lên màn hình luôn:",
    },
    {
      gift: {
        art: "assets/scroll-of-display.webp",
        glyph: "🔤",
        name: "DISPLAY REMINDER",
        blurb: "nhắc lại display(v) từ cỗ máy tương lai — chữ nổi ngay trên màn hình AR, không chỉ nằm trong console như say()",
      },
    },
    {
      npc: "Mình dùng lại `display()` từ Node 03. `say(v)` chỉ in vào console; `display(v)` vẽ chữ nổi ngay trên camera. Máy tiên tri sẽ vừa làm phép, vừa hiện kết quả bằng `display()`.",
    },
    {
      code: `from camera_charm import watch, fire_vortex, lighten, darken, freeze, display

finger = watch()

if finger == 1:
    display("LỬA!")
    fire_vortex()
elif finger == 3:
    display("SÁNG!")
    lighten()
elif finger == 4:
    display("TỐI!")
    darken()
else:
    display("BĂNG!")
    freeze()
`,
      label: "fortune_machine_display.py",
      note: `ĐỀ BÀI
RUN rồi thử BẤT KỲ số ngón nào (1, 3, 4, hoặc ✋) — display() sẽ hiện đúng kết quả lên màn hình`,
      expect: [
        1,
        3,
        4,
        5,
      ],
      expectOut: {
        "1": /lửa!/i,
        "3": /sáng!/i,
        "4": /tối!/i,
        "5": /băng!/i,
      },
      solution: `from camera_charm import watch, fire_vortex, lighten, darken, freeze, display

finger = watch()

if finger == 1:
    display("LỬA!")
    fire_vortex()
elif finger == 3:
    display("SÁNG!")
    lighten()
elif finger == 4:
    display("TỐI!")
    darken()
else:
    display("BĂNG!")
    freeze()
`,
    },
    {
      checkpoint: {
        text: "`display(v)` hiện chữ đè lên hình camera (AR), còn `say(v)` chỉ in vào console — cùng nhận một giá trị, khác chỗ chữ hiện ra ở đâu.",
      },
    },
    {
      quiz: {
        title: "Display khác Say",
        questions: [
          {
            q: "Giơ 3 ngón (finger = 3). Gọi `display(finger)` thì số 3 hiện ở đâu?",
            a: [
              "Nổi ngay trên màn hình, đè lên hình camera",
              "Chỉ in vào console, không thấy trên camera",
              "Không hiện ở đâu cả, chỉ lưu vào biến",
            ],
            correct: 0,
          },
          {
            q: "Cùng finger = 3, đổi `display(finger)` thành `say(finger)` — trên camera có còn thấy số 3 không?",
            a: [
              "Còn, say() cũng vẽ lên camera như display()",
              "Không — say() chỉ in vào console, camera không đổi gì cả",
              "Còn, nhưng chữ nhỏ hơn display()",
            ],
            correct: 1,
          },
          {
            q: "Trong `fortune_machine_display.py`, nếu bạn giơ 5 ngón thì các nhánh 1/3/4 đều sai. Nhánh `else` chạy `display(\"BĂNG!\")`. Trên camera hiện gì?",
            a: [
              "BĂNG!",
              "LỬA!",
              "Không hiện gì, vì else không được display",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Trước khi luyện PHÉP TÍNH, mình dừng lại luyện thêm if/elif/else cho thật chắc tay đã — bấy nhiêu luật vẫn còn mới lắm.",
    },
    {
      npc: "Đoán trước khi RUN nhé: với luật if finger == 1 / elif finger == 3 / else bên dưới, giơ 3 ngón thì máy hiện gì?",
    },
    {
      quiz: {
        title: "Đoán trước khi chạy",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n```\nGiơ 3 ngón, máy hiện gì?',
            a: [
              "LỬA",
              "SÁNG",
              "BĂNG",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      code: `from camera_charm import watch, display

finger = watch()

if finger == 1:
    display("LỬA")
elif finger == 3:
    display("SÁNG")
else:
    display("BĂNG")
`,
      label: "branch_drill.py",
      note: `ĐỀ BÀI
RUN 3 lần để kiểm chứng lời đoán:
- giơ 1 ngón → LỬA
- giơ 3 ngón → SÁNG
- giơ 5 ngón → BĂNG
Để ý: else chỉ chạy khi các luật if/elif phía trên đều sai.`,
      expect: [
        1,
        3,
        5,
      ],
      expectOut: {
        "1": /lửa/i,
        "3": /sáng/i,
        "5": /băng/i,
      },
      solution: `from camera_charm import watch, display

finger = watch()

if finger == 1:
    display("LỬA")
elif finger == 3:
    display("SÁNG")
else:
    display("BĂNG")
`,
    },
    {

      npc: "Giờ thử một luật dễ gây nhầm: có bạn tưởng `elif finger == 5` nghĩa là \"mọi trường hợp còn lại\", nhưng nhánh `elif finger == 5` chỉ đúng khi giơ ĐÚNG 5 ngón thôi.",

    },

    {

      npc: "Giơ 4 ngón thử xem máy có im ru không.",

    },
    {
      code: `from camera_charm import watch, display

finger = watch()

# LUẬT: 1 ngón là LỬA, còn lại đều là BĂNG
if finger == 1:
    display("LỬA")
elif finger == 5:
    display("BĂNG")
`,
      label: "too_narrow_rule.py",
      note: "ĐỀ BÀI\nGiơ 4 ngón sẽ im ru, dù luật ghi \"còn lại đều BĂNG\" — vì elif finger == 5 chỉ bắt đúng 5 thôi. Sửa `elif finger == 5:` thành `else:`, rồi RUN và giơ 4 ngón.",
      expect: 4,
      expectOut: /băng/i,
      solution: `from camera_charm import watch, display

finger = watch()

# LUẬT: 1 ngón là LỬA, còn lại đều là BĂNG
if finger == 1:
    display("LỬA")
else:
    display("BĂNG")
`,
    },
    {
      checkpoint: {
        text: "`elif finger == 5:` chỉ bắt đúng trường hợp 5 — muốn bắt MỌI trường hợp còn lại (4, 2, 0, ...) phải đổi thành `else:` không điều kiện, vì else không kén chọn giá trị nào cả.",
      },
    },
    {
      quiz: {
        title: "Nhánh đúng đầu tiên",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nif finger == 5:\n    display("ĐẬP TAY")\nelif finger == 5:\n    display("BĂNG")\nelse:\n    display("KHÁC")\n```\nGiơ 5 ngón, máy hiện gì?',
            a: [
              "ĐẬP TAY",
              "BĂNG",
              "Cả hai",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "🧩",
        name: "HUY HIỆU LUẬT ĐẦY ĐỦ",
        blurb: "phần thưởng cho việc làm chủ if/elif/else — biết else bắt MỌI trường hợp còn lại, và máy luôn dừng ở nhánh ĐÚNG ĐẦU TIÊN.",
        badge: true,
        badgeId: "huy_hieu_luat_day_du",
      },
    },
    {

      npc: "Máy tiên tri hoàn chỉnh rồi — 1 ngón, 3 ngón, 4 ngón, hay bất cứ gì khác, cỗ máy đều có phản ứng VÀ hiện kết quả lên màn hình.",

    },

    {

      npc: "Giờ kết hợp với PHÉP TÍNH bạn đã học ở Old Computer: Numbers.",

    },
    {

      npc: "Máy đã được cho sẵn phép tính rồi đây: nó cho bạn phép + (cộng), rồi bạn giơ tay HAI LẦN để nhập 2 số — số đầu, rồi số hai. Máy cộng lại và display() kết quả.",

    },

    {

      npc: "Giơ tay lần 1, đợi máy đọc xong, rồi giơ tay lần 2 nhé.",

    },
    {
      code: `from camera_charm import watch, display
from old_computer import say, say_num

say("Phép tính: +")
a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2
result = a + b
display(result)
say_num(result)
`,
      label: "calc_with_given_op.py",
      note: `ĐỀ BÀI
Máy đã cho biết phép tính là +. Giơ 4 ngón cho cả hai lần nhập a và b — máy cộng thành 8 rồi display() + say_num() kết quả.`,
      expect: 4,
      expectOut: /^8$/,
      solution: `from camera_charm import watch, display
from old_computer import say, say_num

say("Phép tính: +")
a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2
result = a + b
display(result)
say_num(result)
`,
    },
    {
      npc: "Ngon lành. Giờ đến phần của bạn: đổi phép tính. Đề bài cho phép TRỪ (-) lần này — sửa `result = a + b` thành phép trừ, rồi RUN, giơ tay 2 lần.",
    },
    {
      code: `from camera_charm import watch, display
from old_computer import say, say_num

say("Phép tính: -")
a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2

# lượt của bạn — đổi dòng dưới thành phép TRỪ (a - b)
result = a + b
display(result)
say_num(result)
`,
      label: "calc_fix_operator.py",
      note: "ĐỀ BÀI\nĐổi `a + b` thành `a - b` cho đúng phép tính đã cho. Giơ 4 ngón cho cả hai lần nhập a và b; kết quả đúng là 0.",
      expect: 4,
      expectOut: /^0$/,
      solution: `from camera_charm import watch, display
from old_computer import say, say_num

say("Phép tính: -")
a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2

result = a - b
display(result)
say_num(result)
`,
    },
    {
      quiz: {
        title: "Máy tính có phép cho sẵn",
        questions: [
          {
            q: "Giơ 3 ngón rồi 4 ngón, đề bài cho phép +. `result` sẽ là bao nhiêu?",
            a: [
              "7",
              "1",
              "12",
            ],
            correct: 0,
          },
          {
            q: "Đoạn này không có `if` nào cả, chỉ có `result = a + b` rồi `display(...)` — máy có chạy được không?",
            a: [
              "Không, thiếu `if` là lỗi",
              "Có — không phải dòng nào cũng cần `if`, chỉ khi nào cần RẼ NHÁNH mới cần",
              "Chỉ chạy được nếu a bằng b",
            ],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Cộng trừ theo phép cho sẵn — quá ngon!",

    },

    {

      npc: "Giờ học cách VIẾT LUẬT đoán ngược: cho một kết quả đã tính sẵn, so sánh nó với `a + b` và `a - b` để tìm xem đúng là phép nào.",

    },

    {

      npc: "Thử bản mẫu này trước — máy tính sẵn bằng phép CỘNG, RUN xem luật đoán có ra đúng không.",

    },
    {
      code: `from camera_charm import watch, display
from old_computer import say_num

a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2
machine_result = a + b   # máy đã tính sẵn bằng phép CỘNG

if machine_result == a + b:
    display("Đây là phép CỘNG (+)")
elif machine_result == a - b:
    display("Đây là phép TRỪ (-)")
else:
    display("Không đoán được")
say_num(machine_result)
`,
      label: "guess_the_operator.py",
      note: `ĐỀ BÀI
RUN mẫu này trước, giơ tay 2 lần (chọn 1, 3, hoặc 4 ngón cho CẢ HAI lần — đừng nắm tay ✊ 0 ngón) — luật if/elif/else so sánh kết quả với a+b và a-b để đoán đúng phép CỘNG`,
      expectOut: /phép cộng/i,
      solution: `from camera_charm import watch, display
from old_computer import say_num

a = watch()   # giơ tay lần 1
b = watch()   # giơ tay lần 2
machine_result = a + b   # máy đã tính sẵn bằng phép CỘNG

if machine_result == a + b:
    display("Đây là phép CỘNG (+)")
elif machine_result == a - b:
    display("Đây là phép TRỪ (-)")
else:
    display("Không đoán được")
say_num(machine_result)
`,
    },
    {
      remember: "So sánh bằng `==` không chỉ dùng cho số cố định — có thể so sánh CẢ MỘT PHÉP TÍNH với một giá trị khác, như `if machine_result == a - b:`.",
    },
    {
      checkpoint: {
        text: "`==` so sánh được cả một phép tính với một giá trị khác, không chỉ số cố định: `if machine_result == a - b:` là hợp lệ y như so với một số.",
      },
    },
    {
      quiz: {
        title: "Đoán kết quả",
        questions: [
          {
            q: "a = 4, b = 1. Máy cho kết quả là 3. Đó là phép tính nào?",
            a: [
              "Cộng (4+1=5, sai)",
              "Trừ (4-1=3, đúng)",
              "Không đoán được",
            ],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Đoán trúng phong phóc! Trước khi ra trận, ghé LÒ RÈN với HUY HIỆU LUẬT ĐẦY ĐỦ đã nhé — ghép đủ là Pip rèn cho bạn một quả BOM MẬT NGỮ.",

    },

    {

      npc: "Rèn kịp thì khi PARADOX SPHINX lộ sơ hở, bạn ném bom kết liễu ngay!",

    },
    // BOSS CONCEPT V2 migration (FORGE-PLAN.md "FINALIZED"): the forge cell
    // switches from the legacy badge-cost/practice-gacha shape to a
    // quiz-driven trial — every round question from the old rounds[] (below)
    // moves IN HERE as `forge.quiz`; code-fix rounds become "what's the bug"
    // multiple-choice (forge.quiz has no live code execution); the old
    // gesture finisher round (final_choice.py, hold 1 finger ×3) is RETIRED —
    // the new KO boss replaces it with its own ☝ aim → ✋ unleash gesture.
    {
      forge: {
        quiz: [
          {
            q: "Có `if` và `elif` nhưng KHÔNG có `else`, giơ tay không khớp luật nào — chuyện gì xảy ra?",
            a: ["Máy báo lỗi", "Không luật nào chạy, máy im lặng", "Máy tự chạy elif đầu tiên"],
            correct: 1,
          },
          {
            q: "`else` cần viết điều kiện gì?",
            a: ["`else finger == 5:`", "Không cần điều kiện — chỉ `else:`"],
            correct: 1,
          },
          {
            q: "Luật `else` (không có dấu gì ở cuối dòng) khiến máy báo lỗi cú pháp. Thiếu gì?",
            a: ["Thiếu dấu hai chấm `:` sau else", "Thiếu chữ HOA", "Thiếu dấu chấm than"],
            correct: 0,
          },
          {
            q: "Muốn cỗ máy hiện chữ NGAY TRÊN camera (không phải console), dùng từ nào?",
            a: ["`say()`", "`display()`", "`watch()`"],
            correct: 1,
          },
          {
            q: "Máy báo lỗi `name 'fingerr' is not defined`. Vết nứt nằm ở đâu?",
            a: ["Gõ sai tên biến (`fingerr` thay vì `finger`)", "Máy đang ngáp ngủ", "`display()` bị hỏng"],
            correct: 0,
          },
          {
            q: "Với `a = 5` và `b = 2`, điều kiện `a - b == a - b` là đúng hay sai?",
            a: ["Đúng, vì hai vế giống hệt nhau", "Sai", "Không thể so sánh phép tính"],
            correct: 0,
          },
          {
            q: "Chuỗi `if/elif` chỉ đoán CỘNG/TRỪ, không có `else` — khi kết quả thật ra là phép NHÂN thì chuyện gì xảy ra?",
            a: ["Không luật nào chạy — thiếu else để bắt các trường hợp còn lại", "Máy tự thêm else", "Máy báo lỗi ngay"],
            correct: 0,
          },
          {
            q: "Trong điều kiện `x == y`, dấu `==` khác dấu `=` ở điểm nào?",
            a: ["== hỏi có bằng nhau không, = dùng để gán giá trị", "Chúng giống hệt nhau", "== chỉ dùng cho số, = chỉ dùng cho chữ"],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Rèn xong BOM MẬT NGỮ chưa nào? PARADOX SPHINX không cần qua từng câu hỏi nữa — bạn chỉ cần GIƠ NGÓN TRỎ ☝ ngắm thẳng vào nó cho chắc tay, rồi ĐẬP TAY ✋ để phóng bom.",

    },

    {

      npc: "Một phát là phong ấn nó luôn! (Chưa có bom thì quay lại LÒ RÈN rèn thêm đã nhé. )",

    },
    {
      boss: {
        name: "THE PARADOX SPHINX",
        sheet: {
          src: "assets/paradox-sphinx-sheet.webp",
        },
        art: "assets/paradox-sphinx.webp",
        glyph: "🗿",
        ko: true,
      },
    },
    {
      npc: "THE PARADOX SPHINX tan biến rồi — if/elif/else, phép tính, và camera thật đã hợp thành một cỗ máy hoàn chỉnh trong tay bạn. Phong ấn đã khắc xong; chương tiếp theo đang mở ra.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG GIAO KÈO",
    theme: {
      motion: "rain",
      palette: {
        core: "#d69a20",
        dust: "#f4c85a",
        rune: "#f4c85a",
      },
      glyphs: "else",
    },
  },
};
