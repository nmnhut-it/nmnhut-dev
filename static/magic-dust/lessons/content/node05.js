export default {
  index: 5,
  title: "Choices: Else and Everything Else",
  subtitle: "if/elif/else + phép tính + camera thật — mọi thứ hợp lại",
  bundle: { art: "assets/future-packet.webp", name: "LOGIC PACKET" },
  machine: { art: "assets/future-machine.webp", name: "ELSE + DISPLAY MODULE", blurb: "module gắn thêm cho FUTURE MACHINE — else bắt hết phần còn lại, display() hiện kết quả ngay trên màn hình AR" },
  modules: { old_computer: "../py/old_computer/__init__.py", camera_charm: "../py/camera_charm/__init__.py" },
  cells: [
    {
      npc: "Nhớ luật if/elif chứ? 1 ngón gọi lửa, 3 ngón sáng, 4 ngón tối. Nhưng nếu giơ tay khác đi thì sao? Thử xem — RUN rồi giơ ✋ (5 ngón) nào.",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n',
      label: "gap_in_rules.py",
      note: "ĐỀ BÀI\nRUN rồi giơ ✋ (5 ngón) — không luật nào khớp cả, xem cỗ máy có phản ứng gì không",
      expect: 5,
      expectOut: { minLines: 0 },
    },
    {

      npc: "Im ru luôn đúng không? Máy không biết làm gì khi KHÔNG luật nào khớp cả — nó chỉ đứng im.",

    },

    {

      npc: "Học thêm 1 từ nữa để vá lỗ hổng này: else — nghĩa là *nếu không cái nào đúng thì làm việc này*. Thêm else vào cuối chuỗi if/elif, rồi RUN lại, vẫn giơ ✋ (5 ngón).",

    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\nelse:\n    say("Không luật nào khớp -- đây là else!")\n',
      label: "first_else.py",
      note: "ĐỀ BÀI\nRUN rồi giơ ✋ (5 ngón) — lần này else sẽ xử lý phần còn lại",
      expect: 5,
      expectOut: /else/i,
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\nelse:\n    say("Không luật nào khớp -- đây là else!")\n',
    },
    {
      remember: "`else` = nếu KHÔNG luật nào ở trên đúng, thì làm việc này. Không cần điều kiện — else luôn đứng cuối chuỗi if/elif.",
    },
    {
      checkpoint: {
        text: "`else` bắt hết những trường hợp không luật `if`/`elif` nào ở trên khớp — nó không có điều kiện riêng và luôn đứng cuối chuỗi.",
      },
    },
    {
      quiz: {
        title: "Else là gì",
        questions: [
          {
            q: "Có `if finger == 1` và `elif finger == 3`, giơ 5 ngón thì chạy nhánh nào?",
            a: ["nhánh if", "nhánh elif", "không nhánh nào — trừ khi có else"],
            correct: 2,
          },
          {
            q: "`else` cần điều kiện riêng của nó (như `else finger == 5:`) không?",
            a: ["Có, luôn cần", "Không — else không có điều kiện, bắt hết phần còn lại", "Chỉ cần khi dùng camera"],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Vá xong lỗ hổng rồi! Học được từ mới thì cỗ máy thưởng liền — nhận quà nè:",
    },
    { gift: { glyph: "❄", name: "SCROLL OF FROST", blurb: "lệnh mới: freeze() — bụi phép đóng băng thành BĂNG thay vì lửa" } },
    {
      npc: "freeze() là của bạn rồi! Giờ thay vì để else chỉ nói suông, cho nó làm phép luôn: else sẽ gọi freeze() — máy tiên tri giờ có đủ 4 kết quả: lửa, sáng, tối, và băng.",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\nelse:\n    freeze()\n',
      label: "fortune_machine.py",
      note: "ĐỀ BÀI\nRUN rồi giơ ✋ (5 ngón) — else giờ đóng băng luôn thay vì chỉ in chữ",
      expect: 5,
      expectOut: /freeze/i,
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\nelse:\n    freeze()\n',
    },
    {
      npc: "Máy tiên tri của bạn giờ phản ứng với MỌI số ngón rồi — không còn im ru nữa. Còn một món quà nữa, hợp với việc hiện kết quả lên màn hình luôn:",
    },
    { gift: { glyph: "🔤", name: "SCROLL OF DISPLAY", blurb: "lệnh mới: display(v) — chữ NỔI ngay trên màn hình AR, không chỉ nằm trong console như say()" } },
    {
      npc: "display() khác say() ở chỗ: say() chỉ in vào console (như máy cổ), còn display() hiện chữ NGAY TRÊN màn hình, đè lên hình camera — đúng chất cỗ máy tương lai.",
    },
    {
      npc: "Thử cho máy tiên tri KHOE luôn nó vừa làm gì bằng display().",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze, display\n\nfinger = watch()\n\nif finger == 1:\n    display("LỬA!")\n    fire_vortex()\nelif finger == 3:\n    display("SÁNG!")\n    lighten()\nelif finger == 4:\n    display("TỐI!")\n    darken()\nelse:\n    display("BĂNG!")\n    freeze()\n',
      label: "fortune_machine_display.py",
      note: "ĐỀ BÀI\nRUN rồi thử BẤT KỲ số ngón nào (1, 3, 4, hoặc ✋) — display() sẽ hiện đúng kết quả lên màn hình",
      expectOut: { 1: /lửa!/i, 3: /sáng!/i, 4: /tối!/i, 5: /băng!/i },
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze, display\n\nfinger = watch()\n\nif finger == 1:\n    display("LỬA!")\n    fire_vortex()\nelif finger == 3:\n    display("SÁNG!")\n    lighten()\nelif finger == 4:\n    display("TỐI!")\n    darken()\nelse:\n    display("BĂNG!")\n    freeze()\n',
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
            q: "`say(v)` và `display(v)` khác nhau chỗ nào?",
            a: [
              "`say()` hiện chữ đè lên camera, `display()` chỉ in console",
              "`display()` hiện chữ đè lên camera (AR), `say()` chỉ in vào console",
              "Chúng giống hệt nhau, chỉ đổi tên",
            ],
            correct: 1,
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
            a: ["LỬA", "SÁNG", "BĂNG"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import watch, display\n\nfinger = watch()\n\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
      label: "branch_drill.py",
      note: "ĐỀ BÀI\nRUN 3 lần để kiểm chứng lời đoán:\n- giơ 1 ngón → LỬA\n- giơ 3 ngón → SÁNG\n- giơ 5 ngón → BĂNG\nĐể ý: else chỉ chạy khi các luật if/elif phía trên đều sai.",
      expect: [1, 3, 5],
      expectOut: { 1: /lửa/i, 3: /sáng/i, 5: /băng/i },
      solution: 'from camera_charm import watch, display\n\nfinger = watch()\n\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
    },
    {
      npc: 'Nhánh `elif finger == 5` chỉ chạy khi `finger` đúng bằng 5; nó không đại diện cho mọi trường hợp còn lại. Giơ 4 ngón để kiểm tra: máy sẽ không chạy nhánh nào.',
    },
    {
      code: 'from camera_charm import watch, display\n\nfinger = watch()\n\n# LUẬT: 1 ngón là LỬA, còn lại đều là BĂNG\nif finger == 1:\n    display("LỬA")\nelif finger == 5:\n    display("BĂNG")\n',
      label: "too_narrow_rule.py",
      note: 'ĐỀ BÀI\nGiơ 4 ngón sẽ im ru, dù luật ghi "còn lại đều BĂNG" — vì elif finger == 5 chỉ bắt đúng 5 thôi. Sửa `elif finger == 5:` thành `else:`, rồi RUN và giơ 4 ngón.',
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
            a: ["ĐẬP TAY", "BĂNG", "Cả hai"],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Máy tiên tri hoàn chỉnh rồi — 1 ngón, 3 ngón, 4 ngón, hay bất cứ gì khác, cỗ máy đều có phản ứng VÀ hiện kết quả lên màn hình.",

    },

    {

      npc: "Giờ thử thách khó hơn: kết hợp với PHÉP TÍNH bạn học ở node trước.",

    },
    {

      npc: "Máy đã được cho sẵn phép tính rồi đây: nó cho bạn phép + (cộng), rồi bạn giơ tay HAI LẦN để nhập 2 số — số đầu, rồi số hai. Máy cộng lại và display() kết quả.",

    },

    {

      npc: "Giơ tay lần 1, đợi máy đọc xong, rồi giơ tay lần 2 nhé.",

    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say, say_num\n\nsay("Phép tính: +")\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nresult = a + b\ndisplay(result)\nsay_num(result)\n',
      label: "calc_with_given_op.py",
      note: 'ĐỀ BÀI\nMáy cho sẵn phép cộng. Giơ 4 ngón ở cả hai lần để nhập a và b. Máy phải cộng thành 8 rồi hiện kết quả.',
      expect: 4,
      expectOut: /^8$/,
    },
    {
      npc: "Ngon lành. Giờ đến phần của bạn: đổi phép tính. Đề bài cho phép TRỪ (-) lần này — sửa `result = a + b` thành phép trừ, rồi RUN, giơ tay 2 lần.",
    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say, say_num\n\nsay("Phép tính: -")\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\n\n# lượt của bạn — đổi dòng dưới thành phép TRỪ (a - b)\nresult = a + b\ndisplay(result)\nsay_num(result)\n',
      label: "calc_fix_operator.py",
      note: "ĐỀ BÀI\nĐổi `a + b` thành `a - b`. Giơ 4 ngón ở cả hai lần để nhập a và b. Kết quả đúng là 0.",
      expect: 4,
      expectOut: /^0$/,
    },
    {
      quiz: {
        title: "Máy tính có phép cho sẵn",
        questions: [
          {
            q: "Giơ 3 ngón rồi 4 ngón, đề bài cho phép +. `result` sẽ là bao nhiêu?",
            a: ["7", "1", "12"],
            correct: 0,
          },
          {
            q: "Code không có `if` nào cả, chỉ có `result = a + b` rồi `display(...)` — máy có chạy được không?",
            a: ["Không, thiếu if là lỗi", "Có — không phải dòng nào cũng cần if, chỉ khi nào cần RẼ NHÁNH mới cần", "Chỉ chạy được nếu a bằng b"],
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
      code: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nmachine_result = a + b   # máy đã tính sẵn bằng phép CỘNG\n\nif machine_result == a + b:\n    display("Đây là phép CỘNG (+)")\nelif machine_result == a - b:\n    display("Đây là phép TRỪ (-)")\nelse:\n    display("Không đoán được")\nsay_num(machine_result)\n',
      label: "guess_the_operator.py",
      note: "ĐỀ BÀI\nRUN mẫu này trước, giơ tay 2 lần (chọn 1, 3, hoặc 4 ngón cho CẢ HAI lần — đừng nắm tay ✊ 0 ngón) — luật if/elif/else so sánh kết quả với a+b và a-b để đoán đúng phép CỘNG",
      expectOut: /phép cộng/i,
      solution: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nmachine_result = a + b   # máy đã tính sẵn bằng phép CỘNG\n\nif machine_result == a + b:\n    display("Đây là phép CỘNG (+)")\nelif machine_result == a - b:\n    display("Đây là phép TRỪ (-)")\nelse:\n    display("Không đoán được")\nsay_num(machine_result)\n',
    },
    {

      npc: "Đoán đúng phép cộng rồi! Giờ tự bạn thử: đổi dòng tính sẵn của máy sang phép TRỪ (`a - b` thay vì `a + b`) — luật if/elif/else giữ nguyên, không cần sửa gì thêm —",

    },

    {

      npc: "rồi RUN xem nó vẫn tự đoán đúng không.",

    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nmachine_result = a + b   # lượt của bạn — đổi thành phép TRỪ (a - b)\n\nif machine_result == a + b:\n    display("Đây là phép CỘNG (+)")\nelif machine_result == a - b:\n    display("Đây là phép TRỪ (-)")\nelse:\n    display("Không đoán được")\nsay_num(machine_result)\n',
      label: "guess_the_operator_real.py",
      note: "ĐỀ BÀI\nĐổi `machine_result = a + b` thành `a - b`, rồi RUN, giơ tay 2 lần (chọn 1, 3, hoặc 4 ngón cho CẢ HAI lần — đừng nắm tay ✊ 0 ngón) — display() phải tự đoán đúng là phép TRỪ",
      expectOut: /phép trừ/i,
      solution: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nmachine_result = a - b   # đổi thành phép TRỪ\n\nif machine_result == a + b:\n    display("Đây là phép CỘNG (+)")\nelif machine_result == a - b:\n    display("Đây là phép TRỪ (-)")\nelse:\n    display("Không đoán được")\nsay_num(machine_result)\n',
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
            a: ["Cộng (4+1=5, sai)", "Trừ (4-1=3, đúng)", "Không đoán được"],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Đoán trúng phong phóc! Giờ dồn hết mọi thứ đã học — if/elif/else, phép tính, camera thật — vào một trận cuối. Giữ chắc tay nhé.",
    },
    {
      boss: {
        name: "THE PARADOX SPHINX",
        sheet: { src: "assets/paradox-sphinx-sheet.webp" },
        art: "assets/paradox-sphinx.webp",
        glyph: "🗿",
        hp: 900,
        baseDmg: 20,
        streakMul: [1, 1.5, 2],
        heal: 10,
        hearts: 3,
        rounds: [
          {
            q: "Có if và elif nhưng KHÔNG có else, giơ tay không khớp luật nào — chuyện gì xảy ra?",
            a: ["Máy báo lỗi", "Không luật nào chạy, máy im lặng", "Máy tự chạy elif đầu tiên"],
            correct: 1,
          },
          {
            q: "`else` cần viết điều kiện gì? Giơ ngón tay chọn đáp án đúng!",
            a: ["else finger == 5:", "Không cần điều kiện — chỉ `else:`"],
            correct: 1,
          },
          {
            code: 'from camera_charm import watch, fire_vortex, freeze\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelse\n    freeze()\n',
            label: "missing_colon.py",
            note: "thiếu dấu hai chấm sau else — vá lại rồi RUN, giơ ✋ (5 ngón) để STRIKE",
            dmg: 30,
            expect: 5,
            expectOut: /freeze/i,
            solution: 'from camera_charm import watch, fire_vortex, freeze\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelse:\n    freeze()\n',
          },
          {
            q: "Muốn cỗ máy hiện chữ NGAY TRÊN camera (không phải console), dùng từ nào?",
            a: ["`say()`", "`display()`", "`watch()`"],
            correct: 1,
          },
          {
            code: 'from camera_charm import watch, display\n\nfinger = watch()\ndisplay(fingerr)\n',
            label: "typo_var.py",
            note: "gõ sai tên biến `fingerr` — sửa lại đúng `finger`, rồi RUN, giơ tay bất kỳ",
            dmg: 30,
            expectOut: /^[0-9]+$/,
            solution: 'from camera_charm import watch, display\n\nfinger = watch()\ndisplay(finger)\n',
          },
          {
            q: "a = 5, b = 2. `if a - b == a - b:` có đúng không?",
            a: ["Đúng, vì hai vế giống hệt nhau", "Sai", "Không thể so sánh phép tính"],
            correct: 0,
          },
          {
            code: 'from camera_charm import watch, display\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nresult = a * b + 100   # máy đã tính sẵn bằng phép NHÂN (luôn lớn hơn a+b và a-b)\n\nif result == a + b:\n    display("CỘNG")\nelif result == a - b:\n    display("TRỪ")\n',
            label: "no_catchall.py",
            note: 'chuỗi if/elif này chỉ đoán CỘNG/TRỪ — nhưng máy tính sẵn bằng phép NHÂN, nên thường không luật nào khớp cả. Thêm `else:` với `display("đây là phép NHÂN")` vào cuối rồi RUN, giơ tay 2 lần bất kỳ',
            dmg: 30,
            expectOut: /phép nhân/i,
            solution: 'from camera_charm import watch, display\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\nresult = a * b + 100   # máy đã tính sẵn bằng phép NHÂN (luôn lớn hơn a+b và a-b)\n\nif result == a + b:\n    display("CỘNG")\nelif result == a - b:\n    display("TRỪ")\nelse:\n    display("đây là phép NHÂN")\n',
          },
          {
            q: "Trong `if x == y:`, dấu `==` khác dấu `=` ở điểm nào?",
            a: ["== hỏi có bằng nhau không, = dùng để gán giá trị", "Chúng giống hệt nhau", "== chỉ dùng cho số, = chỉ dùng cho chữ"],
            correct: 0,
          },
          {
            code: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze, display\nfrom old_computer import say_num\n\nscore = 0\n\nfinger = watch()          # input — giơ lần 1\nif finger == 1:\n    score = score + 1\n\nfinger = watch()          # input — giơ lần 2\nif finger == 1:\n    score = score + 1\n\nfinger = watch()          # input — giơ lần 3\nif finger == 1:\n    score = score + 1\n\ndisplay(score)\nsay_num(score)            # output — kích hoạt MẬT NGỮ nếu score = 3\n\nif score == 3:\n    fire_vortex()\nelse:\n    freeze()\n',
            label: "final_choice.py",
            note: "ĐÒN KẾT LIỄU: giơ ☝ (1 ngón) đúng cả 3 lần liên tiếp để score = 3, kích hoạt fire_vortex() — bất kỳ lần nào giơ khác 1 ngón, score < 3 và máy sẽ freeze() thay vào đó",
            dmg: 50,
            finisher: true,
            expectOut: /^3$/,
            solution: 'from camera_charm import watch, fire_vortex, lighten, darken, freeze, display\nfrom old_computer import say_num\n\nscore = 0\n\nfinger = watch()          # input — giơ lần 1\nif finger == 1:\n    score = score + 1\n\nfinger = watch()          # input — giơ lần 2\nif finger == 1:\n    score = score + 1\n\nfinger = watch()          # input — giơ lần 3\nif finger == 1:\n    score = score + 1\n\ndisplay(score)\nsay_num(score)            # output — kích hoạt MẬT NGỮ nếu score = 3\n\nif score == 3:\n    fire_vortex()\nelse:\n    freeze()\n',
          },
        ],
      },
    },
    {
      npc: "THE PARADOX SPHINX tan biến rồi — if/elif/else, phép tính, và camera thật đã hợp thành một cỗ máy hoàn chỉnh trong tay bạn. Niêm phong giao kèo để bước sang chương tiếp theo nào!",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG GIAO KÈO",
    theme: { motion: "rain", palette: { core: "#d69a20", dust: "#f4c85a", rune: "#f4c85a" }, glyphs: "else" },
  },
};
