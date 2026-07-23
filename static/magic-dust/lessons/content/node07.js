export default {
  index: 7,
  title: "Repeat: The While Loop",
  subtitle: "viết luật một lần, máy lặp ngàn lần — và luật DỪNG",
  bundle: { art: "assets/future-packet.webp", name: "LOOP PACKET" },
  machine: { art: "assets/future-machine.webp", name: "LOOP MODULE", blurb: "module gắn thêm cho FUTURE MACHINE — lặp một khối lệnh nhiều lần, tới khi luật DỪNG lên tiếng" },
  modules: { old_computer: "../py/old_computer/__init__.py", camera_charm: "../py/camera_charm/__init__.py" },
  cells: [
    {

      npc: "Qua khỏi cổng đá, tụi mình lạc vào VỰC XOÁY.",

    },

    {

      npc: "Nghe kể ai vào đây cũng đi vòng quanh mãi không thoát, vì TRÙNG VÔ TẬN — thuộc hạ của Chúa tể hắc ám — đã yểm bùa \"lặp mãi mãi\" lên cả thung lũng.",

    },

    {

      npc: "Muốn thoát, tụi mình phải học chính phép thuật của nó: phép LẶP. Nhưng kèm theo một thứ mà nó sợ nhất: luật DỪNG.",

    },
    {
      npc: "Bạn nhớ trận đánh golem chứ? Muốn máy đọc tay ba lần, tụi mình phải chép dòng `power = power + watch()` ba lần y hệt nhau. Ba lần thì còn chép nổi... Pip đố bạn câu này nè:",
    },
    {
      quiz: {
        title: "Chép tay tới bao giờ",
        questions: [
          {
            q: "Muốn máy cộng sức mạnh của 100 lần giơ tay, theo kiểu cũ thì phải chép dòng `power = power + watch()` bao nhiêu lần?",
            a: ["1 lần là đủ", "100 lần — chép tới mỏi nhừ tay", "Không có cách nào làm được"],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Chép 100 dòng thì đúng là cực hình! Nhưng nghe nè: máy móc sinh ra là để LẶP. Người viết luật MỘT lần, máy chạy NGÀN lần — máy không biết mỏi tay, người thì có.",

    },

    {

      npc: "Từ khóa mới của tụi mình đây — nhận quà nào!",

    },
    { gift: { glyph: "🔁", name: "SCROLL OF REPEAT", blurb: "từ khóa mới: while — máy tự lặp một khối lệnh, chừng nào câu điều kiện còn ĐÚNG" } },
    {
      npc: "`while` nghĩa là \"chừng nào\". Trước mỗi vòng, dòng `while power < 6:` kiểm tra `power < 6`. Đúng thì máy chạy khối thụt lề; sai thì máy dừng vòng lặp.",
    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\npower = 0\nwhile power < 6:\n    power = power + watch()\n    say_num(power)\n\ndisplay("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")\n',
      label: "charge_loop.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi giơ tay vài lần — mỗi lần máy đọc xong, nó cộng dồn và đọc to tổng mới. Để ý nhé: bạn KHÔNG phải bấm gì thêm, máy tự dừng ngay khi tổng chạm 6.",
      expectOut: /thoát vòng lặp/i,
      solution: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\npower = 0\nwhile power < 6:\n    power = power + watch()\n    say_num(power)\n\ndisplay("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")\n',
    },
    {
      npc: "Dòng `watch()` chạy lại ở mỗi vòng. Lần đầu camera đọc 4 ngón, tổng thành 4 nên máy lặp tiếp. Lần sau camera lại đọc 4 ngón, tổng thành 8; `power < 6` sai nên vòng lặp dừng.",
    },
    {
      remember: [
        "`while dieu_kien:` — chừng nào điều kiện còn ĐÚNG, máy lặp lại cả khối thụt lề",
        "Trong thân vòng lặp phải có thứ làm điều kiện ĐỔI DẦN (như cộng dồn) — không thì máy lặp mãi mãi",
        "Vòng lặp = viết luật MỘT lần, máy chạy NHIỀU lần",
      ],
    },
    {
      checkpoint: {
        text: "`while dieu_kien:` lặp lại khối thụt lề chừng nào `dieu_kien` còn ĐÚNG, và dừng ngay khi nó SAI — thân vòng lặp phải có gì đó làm điều kiện đổi dần, như `power = power + watch()`.",
      },
    },
    {
      quiz: {
        title: "Lần theo vòng lặp",
        questions: [
          {
            q: "`power = 0`, luật `while power < 6:`. Bạn giơ 4 ngón, rồi lại 4 ngón nữa. Vòng lặp chạy mấy lần rồi dừng?",
            a: [
              "1 lần — sau khi cộng được 4, máy dừng",
              "2 lần — tổng thành 4 rồi 8; tới 8 thì câu 8 < 6 sai nên máy dừng",
              "Chạy mãi không dừng",
            ],
            correct: 1,
          },
          {
            q: "Với đoạn này:\n```python\npower = 0\nwhile power < 6:\n    power = power + watch()\n    say_num(power)\n```\nPhần nào là \"luật DỪNG\" của vòng lặp?",
            a: [
              "Dòng `say_num(power)`",
              "Câu điều kiện `power < 6` — nó vừa sai là máy dừng lặp",
              "Dòng `display(...)` ở cuối",
            ],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Khoan — nhìn kỹ thì while giống if ghê ha: cũng có câu điều kiện đúng/sai, cũng dấu hai chấm, cũng khối thụt lề.",

    },

    {

      npc: "Khác nhau đúng MỘT chỗ: if hỏi MỘT lần rồi thôi, còn while hỏi ĐI HỎI LẠI. Bảng phép này chạy cùng một khối lệnh bằng cả hai từ — RUN xem mỗi bên in ra mấy số.",

    },
    {
      code: 'from old_computer import say, say_num\n\nx = 0\nif x < 3:           # if: hỏi MỘT lần\n    x = x + 1\n    say_num(x)\n\nsay("---")\n\ny = 0\nwhile y < 3:        # while: hỏi ĐI HỎI LẠI\n    y = y + 1\n    say_num(y)\n',
      label: "if_vs_while.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi so hai nửa: nửa if chỉ in được 1 (hỏi một lần rồi đi tiếp), nửa while in 1, 2, 3 (hỏi lại tới khi 3 < 3 sai mới dừng). Không camera, không may rủi — số nào cũng đoán trước được.",
      expectOut: { all: [{ minLines: 5 }, /^---$/, /^2$/, /^3$/] },
      solution: 'from old_computer import say, say_num\n\nx = 0\nif x < 3:           # if: hỏi MỘT lần\n    x = x + 1\n    say_num(x)\n\nsay("---")\n\ny = 0\nwhile y < 3:        # while: hỏi ĐI HỎI LẠI\n    y = y + 1\n    say_num(y)\n',
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
            a: ["Chỉ 1 dòng: 1", "Ba dòng: 1, 2, 3", "Không in gì"],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Giờ bạn tự chỉnh máy nhé. Vực Xoáy càng vào sâu thì bùa càng nặng — cổng thoát ở đoạn này đòi tới 12 sức mạnh.",

    },

    {

      npc: "Bạn hãy sửa con số mốc trong câu điều kiện, rồi gom cho tới khi vòng lặp dừng đúng lúc.",

    },
    {
      code: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\npower = 0\n# lượt của bạn — đổi số 6 thành 12 trong điều kiện bên dưới\nwhile power < 6:\n    power = power + watch()\n    say_num(power)\n\ndisplay("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")\n',
      label: "charge_loop_12.py",
      note: "ĐỀ BÀI\nBạn hãy đổi số 6 trong điều kiện `while power < 6:` thành 12, rồi RUN và gom sức mạnh cho đủ. Tổng cuối có thể lố hơn 12 một chút (13, 14...) — không sao, miễn là vòng lặp không dừng TRƯỚC khi chạm 12; nếu nó dừng sớm thì mốc vẫn chưa được sửa đâu.",
      expectOut: { all: [/^1[2-6]$/, /thoát vòng lặp/i] },
      solution: 'from camera_charm import watch, display\nfrom old_computer import say_num\n\npower = 0\nwhile power < 12:\n    power = power + watch()\n    say_num(power)\n\ndisplay("ĐỦ SỨC MẠNH! THOÁT VÒNG LẶP")\n',
    },
    {

      npc: "Giờ Pip kể bạn nghe bí mật đáng sợ nhất của Vực Xoáy nha.",

    },

    {

      npc: "Nếu trong thân vòng lặp KHÔNG có gì làm điều kiện đổi — ví dụ lỡ quên dòng cộng dồn — thì điều kiện đúng mãi, máy lặp mãi, không bao giờ dừng.",

    },

    {

      npc: "Đó chính là bùa VÒNG LẶP VÔ TẬN của Trùng Vô Tận đó. Đoán thử xem:",

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
              "Thêm một dòng say() cho máy đỡ buồn",
              "Thêm thứ làm power thay đổi — ví dụ power = power + 1",
              "Xóa luôn dòng while đi",
            ],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Phép lặp không chỉ để gom — còn để ĐẾM NGƯỢC nữa. Pip có một cỗ máy đếm ngược ở ngay cell dưới, nhưng khoan chạy đã!",

    },

    {

      npc: "Pháp sư giỏi đoán trước: máy đặt `count = 3`, rồi `while count > 0:` với thân là `say_num(count)` và `count = count - 1`, xong vòng lặp thì hô BÙM và phun lửa.",

    },

    {

      npc: "Bạn đoán máy sẽ nói gì, theo đúng thứ tự?",

    },
    {
      quiz: {
        title: "Đoán trước khi chạy",
        questions: [
          {
            q: "`count = 3`, `while count > 0:` (thân: `say_num(count)` rồi `count = count - 1`), hết vòng thì `say(\"BÙM!\")`. Máy nói gì?",
            a: ["3, 2, 1, rồi BÙM!", "1, 2, 3, rồi BÙM!", "BÙM! trước, rồi mới đếm 3, 2, 1"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import fire_vortex\nfrom old_computer import say, say_num\n\ncount = 3\nwhile count > 0:\n    say_num(count)\n    count = count - 1\n\nsay("BÙM!")\nfire_vortex()\n',
      label: "countdown.py",
      note: "ĐỀ BÀI\nINPUT: giá trị cho sẵn `count = 3`. PROCESS: mỗi lượt in `count`, rồi trừ 1 cho đến khi `count == 0`. OUTPUT: lần lượt 3, 2, 1, BÙM và hiệu ứng lửa.",
      expectOut: { all: [/^3$/, /^2$/, /^1$/, /bùm/i] },
      solution: 'from camera_charm import fire_vortex\nfrom old_computer import say, say_num\n\ncount = 3\nwhile count > 0:\n    say_num(count)\n    count = count - 1\n\nsay("BÙM!")\nfire_vortex()\n',
    },
    {
      npc: "Trúng phóc chứ? Bạn vừa gặp `count = count - 1`. Đếm xuôi hay đếm ngược thì luật vẫn vậy thôi: thân vòng phải làm giá trị tiến gần lúc điều kiện sai, máy mới dừng được.",
    },
    {

      npc: "Bệnh viện phép thuật lại có ca mới nè: cỗ máy đếm ngược của một pháp sư đàn anh bị Trùng Vô Tận cắn mất một mẩu.",

    },

    {

      npc: "Bạn hãy RUN để đọc thông báo lỗi, rồi chữa lành cho nó nhé.",

    },
    {
      code: 'from old_computer import say, say_num\n\ncount = 3\nwhile count > 0\n    say_num(count)\n    count = count - 1\n\nsay("XONG!")\n',
      label: "cracked_countdown.py",
      note: "ĐỀ BÀI\nBạn hãy RUN để xem thông báo lỗi chỉ chỗ nào, rồi vá lại vết cắn. Gợi ý nhỏ: dòng `while` cũng cần dấu hai chấm `:` ở cuối, giống `if`. Chữa xong, máy phải đếm 3, 2, 1 rồi hô XONG!",
      expectOut: { all: [/^3$/, /^2$/, /^1$/, /xong/i] },
      solution: 'from old_computer import say, say_num\n\ncount = 3\nwhile count > 0:\n    say_num(count)\n    count = count - 1\n\nsay("XONG!")\n',
    },
    {

      npc: "Trước khi gặp trùm, Pip bật mí một bí mật giấu đã lâu: cái máy chụp hình photo_booth() hồi node 4 ấy — bên trong nó chính là một vòng while đó!",

    },

    {

      npc: "Nó lặp đi lặp lại việc đọc tay bạn, chừng nào chưa thấy ✋ 5 ngón thì chưa chịu thôi. Giờ bạn đã đủ sức tự viết một cỗ máy như vậy rồi: MÁY ĐỢI HIGH-FIVE.",

    },
    {
      code: 'from camera_charm import watch, display, fire_vortex, freeze\n\nfinger = watch()\nwhile finger < 5:\n    finger = watch()\n\nif finger == 5:\n    display("ĐẬP TAY!")\n    fire_vortex()\nelse:\n    freeze()\n',
      label: "wait_high_five.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi thử giơ 1 ngón trước — máy chưa chịu đâu, nó hỏi lại liền. Đến khi bạn giơ ✋ đủ 5 ngón thì vòng lặp mới dừng và lửa mừng bùng lên. Hóa ra máy \"đang đợi\" chính là máy \"đang lặp\" đó!",
      expect: [1, 5],
      expectOut: /đập tay/i,
      solution: 'from camera_charm import watch, display, fire_vortex, freeze\n\nfinger = watch()\nwhile finger < 5:\n    finger = watch()\n\nif finger == 5:\n    display("ĐẬP TAY!")\n    fire_vortex()\nelse:\n    freeze()\n',
    },
    {
      remember: "Máy \"đang đợi\" thật ra là máy \"đang lặp\": while + watch() nghĩa là hỏi lại mãi cho tới khi thấy đúng dấu. Bí mật bấy lâu của photo_booth() là vậy đó.",
    },
    {
      remember: "Đừng quên freeze() — lệnh đóng băng bạn học ở node trước — con trùng này cũng sợ nó lắm đó.",
    },
    {
      npc: "Ầm... ầm... TRÙNG VÔ TẬN trườn ra rồi kìa! Nó là chúa của những vòng lặp không lối thoát, và cũng ăn lỗi sai để hồi máu như đồng bọn của nó. Cho nó nếm mùi luật DỪNG nào!",
    },
    {
      boss: {
        name: "THE ENDLESS WYRM",
        art: "assets/endless-wyrm.webp",
        glyph: "🐉",
        hp: 900,
        baseDmg: 20,
        streakMul: [1, 1.5, 2],
        heal: 10,
        hearts: 3,
        rounds: [
          {
            q: "`x = 0`, vòng `while x < 3:` có thân là `x = x + 1` rồi `say_num(x)`. Máy đọc những số nào?",
            a: ["1, 2, 3", "0, 1, 2", "1, 2, 3, 4"],
            correct: 0,
          },
          {
            q: "Vòng `while power < 6:` dừng lại khi nào?",
            a: [
              "Khi power còn nhỏ hơn 6",
              "Khi câu power < 6 trở thành SAI — tức là power đã lên 6 hoặc hơn",
              "Khi bạn hạ tay xuống",
            ],
            correct: 1,
          },
          {
            code: 'from old_computer import say, say_num\n\n# LUẬT: đếm ngược 3, 2, 1 rồi hô XONG\ncount = 3\nwhile count < 0:\n    say_num(count)\n    count = count - 1\n\nsay("XONG!")\n',
            label: "frozen_loop.py",
            note: "Máy hô XONG mà chẳng đếm được số nào — vòng lặp không chạy nổi lấy một lần! Bạn hãy soi câu điều kiện xem nó bị ngược chỗ nào, sửa lại, rồi RUN để STRIKE.",
            dmg: 30,
            expectOut: { all: [/^3$/, /^2$/, /^1$/, /xong/i] },
            solution: 'from old_computer import say, say_num\n\n# LUẬT: đếm ngược 3, 2, 1 rồi hô XONG\ncount = 3\nwhile count > 0:\n    say_num(count)\n    count = count - 1\n\nsay("XONG!")\n',
          },
          {
            q: "Trong thân vòng lặp không có dòng nào làm biến thay đổi. Chuyện gì sẽ xảy ra?",
            a: [
              "Máy tự thêm giùm cho",
              "Vòng lặp vô tận — điều kiện đúng mãi nên máy không bao giờ dừng",
              "Máy chạy đúng một lần rồi thôi",
            ],
            correct: 1,
          },
          {
            code: 'from old_computer import say, say_num\n\n# LUẬT: nhặt được viên đá nào phải hô to số thứ tự viên đó (1, 2, 3), đủ 3 viên thì khoe\ncount = 0\nwhile count < 3:\n    count = count + 1\nsay_num(count)\nsay("ĐỦ 3 VIÊN!")\n',
            label: "quiet_collector.py",
            note: "Luật dặn: nhặt viên đá nào phải hô to số thứ tự viên đó — 1, 2, 3. Vậy mà máy im re, tới cuối mới hô đúng một tiếng \"3\". Dòng hô số đang đứng NGOÀI vòng lặp kìa — bạn kéo nó vào đúng chỗ (thụt lề vào trong thân) rồi RUN để STRIKE.",
            dmg: 30,
            expectOut: { all: [/^1$/, /^2$/, /^3$/, /đủ 3/i] },
            solution: 'from old_computer import say, say_num\n\n# LUẬT: nhặt được viên đá nào phải hô to số thứ tự viên đó (1, 2, 3), đủ 3 viên thì khoe\ncount = 0\nwhile count < 3:\n    count = count + 1\n    say_num(count)\nsay("ĐỦ 3 VIÊN!")\n',
          },
          {
            q: "Máy đợi high-five: `finger = watch()` rồi `while finger < 5:` với thân `finger = watch()`. Bạn giơ ✋ 5 ngón ngay lần ĐẦU tiên. Vòng lặp chạy mấy lần? Giơ ngón tay chọn đáp án đúng!",
            a: [
              "0 lần — câu 5 < 5 sai ngay từ đầu nên máy khỏi lặp, mở cửa luôn",
              "5 lần",
            ],
            correct: 0,
          },
          {
            code: 'from camera_charm import watch, fire_vortex, freeze\nfrom old_computer import say_num\n\npower = 0\nwhile power < 12:\n    power = power + watch()\n    say_num(power)\n\nif power == 12:\n    fire_vortex()\nelse:\n    freeze()\n',
            label: "final_charge.py",
            note: "ĐÒN KẾT LIỄU: bạn hãy gom sức mạnh sao cho CHẠM ĐÚNG 12 — giơ 4 ngón đủ ba lần là đẹp nhất. Lỡ vượt quá 12 (ví dụ 4 + 4 + 5 = 13) thì chỉ phà ra băng thôi, con trùng sẽ nhởn nhơ. Luật dừng nằm trong tay bạn đó!",
            dmg: 50,
            finisher: true,
            expectOut: { all: [/^12$/, /fire/i] },
            solution: 'from camera_charm import watch, fire_vortex, freeze\nfrom old_computer import say_num\n\npower = 0\nwhile power < 12:\n    power = power + watch()\n    say_num(power)\n\nif power == 12:\n    fire_vortex()\nelse:\n    freeze()\n',
          },
        ],
      },
    },
    {

      npc: "Trùng Vô Tận cuộn mình lại rồi tan thành bụi sáng! Bùa \"lặp mãi mãi\" của nó hết dọa được bạn rồi — vì bạn đã nắm trong tay thứ nó sợ nhất: luật DỪNG.",

    },

    {

      npc: "Chúa tể hắc ám chắc đang run trong lâu đài đó. Niêm phong cột mốc rồi tụi mình đi tiếp thôi!",

    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG CỘT MỐC",
    theme: { motion: "rain", palette: { core: "#d9eee5", dust: "#e3f3dc", rune: "#f4c85a" }, glyphs: "`while`" },
  },
};
