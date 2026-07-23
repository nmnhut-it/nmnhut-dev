export default {
  index: 6,
  title: "Ranh giới: Lớn hơn hay nhỏ hơn",
  subtitle: "bốn dấu so sánh `>` `<` `>=` `<=` — và lỗi xuất hiện ngay tại giá trị mốc",
  bundle: { art: "assets/future-packet.webp", name: "MEASURE PACKET" },
  machine: { art: "assets/future-machine.webp", name: "MEASURE MODULE", blurb: "module gắn thêm cho FUTURE MACHINE — bốn dấu so sánh > < >= <= để đo sức mạnh, không chỉ hỏi bằng nhau" },
  modules: { old_computer: "../py/old_computer/__init__.py", camera_charm: "../py/camera_charm/__init__.py" },
  cells: [
    {
      npc: "Ơ kìa, phía trước có cánh cổng đá khổng lồ chắn đường! Trên cổng khắc: \"CHỈ PHÁP SƯ ĐỦ MẠNH MỚI ĐƯỢC QUA\". Muốn qua, tụi mình phải học nói chuyện với nó bằng phép SO SÁNH.",
    },
    {

      npc: "Bạn còn nhớ dấu ==? Nó hỏi \"hai bên có BẰNG NHAU không?\" — chỉ gật đầu khi bằng nhau CHÍNH XÁC. Luật dưới đây mở cổng khi sức mạnh bằng đúng 3.",

    },

    {

      npc: "RUN rồi giơ 4 ngón — mạnh hơn 3 hẳn — xem cổng có mở không nhé.",

    },
    {
      code: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power == 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "gate_equal.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi giơ 4 ngón. Sức mạnh 4 lớn hơn 3 hẳn hoi, nhưng thử đoán xem: dấu == có chịu mở cổng cho bạn không?",
      expect: 4,
      expectOut: /vẫn đóng/i,
      sampleInput: "4",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power == 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {

      npc: "Thấy chưa — bạn mạnh HƠN mà cổng vẫn đóng! Vì == chỉ hỏi \"có bằng ĐÚNG 3 không? \", mà 4 đâu bằng 3. Vấn đề nằm ở luật. Muốn hỏi \"có LỚN HƠN không?\"",

    },

    {

      npc: "thì phải dùng dấu khác. Quà đây!",

    },
    { gift: { glyph: "⚖", name: "SCROLL OF MEASURE", blurb: "bốn dấu so sánh của Kotopia: > lớn hơn · < nhỏ hơn · >= trở lên · <= trở xuống" } },
    {

      npc: "Dấu đầu tiên trong cuộn giấy là > — đọc là \"lớn hơn\". Câu power > 3 nghĩa là: \"sức mạnh có lớn hơn 3 không? \".",

    },

    {

      npc: "Bạn hãy sửa dấu == trong luật thành >, rồi RUN và giơ 4 ngón lần nữa xem sao.",

    },
    {
      code: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\n# lượt của bạn — đổi dấu == thành dấu > (lớn hơn)\nif power == 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "gate_greater.py",
      note: "ĐỀ BÀI\nBạn hãy đổi `power == 3` thành `power > 3`, rồi RUN và giơ 4 ngón. Lần này 4 lớn hơn 3, cổng sẽ mở thôi.",
      expect: 4,
      expectOut: /cổng mở/i,
      sampleInput: "4",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {

      npc: "Cổng mở rồi, hoan hô! Nhưng khoan đã — Pip vừa thấy dòng chữ nhỏ trên cổng ghi rõ: \"sức mạnh 3 TRỞ LÊN thì được qua\".",

    },

    {

      npc: "Vậy nếu bạn giơ ĐÚNG 3 ngón, luật power > 3 có mở cổng không? Đừng chạy vội — pháp sư giỏi luôn ĐOÁN TRƯỚC rồi mới chạy!",

    },
    {
      quiz: {
        title: "Đoán trước khi chạy",
        questions: [
          {
            q: "Luật là `if power > 3:`. Bạn giơ đúng 3 ngón. Cổng sẽ thế nào?",
            a: [
              "Mở, vì 3 đạt yêu cầu \"3 trở lên\"",
              "Đóng, vì dấu > nghĩa là phải LỚN HƠN HẲN 3 — mà 3 không lớn hơn 3",
              "Máy báo lỗi vì không so sánh được",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "gate_boundary.py",
      note: "ĐỀ BÀI\nGiờ kiểm chứng lời đoán: bạn hãy RUN rồi giơ ĐÚNG 3 ngón, xem cổng mở hay đóng.",
      expect: 3,
      expectOut: /vẫn đóng/i,
      sampleInput: "3",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      npc: "Cổng đóng dù luật phải nhận cả sức mạnh 3. Đây là LỖI RANH GIỚI: code xử lý sai khi giá trị bằng đúng mốc. Muốn viết \"3 trở lên\", mình dùng `>=`, nghĩa là \"lớn hơn hoặc bằng\".",
    },
    {
      code: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\n# lượt của bạn — đổi dấu > thành dấu >= (trở lên)\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "gate_at_least.py",
      note: "ĐỀ BÀI\nBạn hãy đổi `power > 3` thành `power >= 3`, rồi RUN và giơ đúng 3 ngón. \"3 trở lên\" thì 3 cũng phải được vào chứ!",
      expect: 3,
      expectOut: /cổng mở/i,
      sampleInput: "3",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power >= 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      remember: [
        "`>` là lớn hơn HẲN · `>=` là lớn hơn hoặc bằng (\"trở lên\")",
        "`<` là nhỏ hơn HẲN · `<=` là nhỏ hơn hoặc bằng (\"trở xuống\")",
        "LỖI RANH GIỚI xuất hiện tại giá trị mốc: luật nói \"trở lên\" nhưng code viết `>` sẽ loại chính giá trị đó",
        "Muốn tìm lỗi ranh giới, hãy thử chính giá trị bằng mốc",
      ],
    },
    {
      checkpoint: {
        text: "`>=` và `<=` tính cả trường hợp bằng mốc; `>` và `<` thì không. Để kiểm tra lỗi ranh giới, hãy thử chính giá trị mốc.",
      },
    },
    {
      quiz: {
        title: "Bắt bug ranh giới",
        questions: [
          {
            q: "Tiệm kem ở Kotopia treo bảng: \"bé từ 5 tuổi TRỞ XUỐNG được tặng kem\". Viết luật thế nào cho đúng?",
            a: ["`if age < 5:`", "`if age <= 5:`", "`if age == 5:`"],
            correct: 1,
          },
          {
            q: "Luật nói \"đủ 10 điểm trở lên thì đậu\" nhưng code viết `if score > 10:`. Thử giá trị nào sẽ làm lỗi ranh giới lộ ra ngay?",
            a: [
              "9 — vì 9 rớt là đúng luật rồi",
              "10 — yêu cầu cho phép giá trị 10, nhưng code lại loại giá trị đó",
              "11 — vì 11 đậu là đúng luật rồi",
            ],
            correct: 1,
          },
          {
            q: "`power = 2`. Điều kiện `power < 3` cho kết quả gì?",
            a: ["Đúng (TRUE), vì 2 nhỏ hơn 3", "Sai (FALSE), vì 2 chưa bằng 3", "Máy không trả lời được"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Muốn thấy tận mắt cả bốn dấu cư xử thế nào NGAY TẠI MỐC không? Bảng phép này hỏi cùng một con số x = 3 bằng cả bốn dấu — RUN xem dấu nào gật, dấu nào lắc.",
    },
    {
      code: 'from old_computer import say\n\nx = 3\n\nif x > 3:\n    say("x > 3: ĐÚNG")\nelse:\n    say("x > 3: SAI")\n\nif x >= 3:\n    say("x >= 3: ĐÚNG")\nelse:\n    say("x >= 3: SAI")\n\nif x < 3:\n    say("x < 3: ĐÚNG")\nelse:\n    say("x < 3: SAI")\n\nif x <= 3:\n    say("x <= 3: ĐÚNG")\nelse:\n    say("x <= 3: SAI")\n',
      label: "boundary_table.py",
      note: "ĐỀ BÀI\nBạn hãy RUN và đọc kỹ 4 dòng kết quả: cùng là x = 3, nhưng `>` và `<` nói SAI, còn `>=` và `<=` nói ĐÚNG — vì chỉ hai dấu có \"hoặc bằng\" mới tính con số ĐÚNG BẰNG mốc.",
      expectOut: { all: [/x > 3: SAI/i, /x >= 3: ĐÚNG/i, /x < 3: SAI/i, /x <= 3: ĐÚNG/i] },
      solution: 'from old_computer import say\n\nx = 3\n\nif x > 3:\n    say("x > 3: ĐÚNG")\nelse:\n    say("x > 3: SAI")\n\nif x >= 3:\n    say("x >= 3: ĐÚNG")\nelse:\n    say("x >= 3: SAI")\n\nif x < 3:\n    say("x < 3: ĐÚNG")\nelse:\n    say("x < 3: SAI")\n\nif x <= 3:\n    say("x <= 3: ĐÚNG")\nelse:\n    say("x <= 3: SAI")\n',
    },
    {
      npc: "Giờ bạn thử sửa một đoạn code nhé. MÁY GÁC ĐÊM phải làm màn hình tối đi khi sức mạnh dưới 3, nhưng điều kiện hiện tại dùng sai dấu so sánh.",
    },
    {
      code: 'from camera_charm import watch, lighten, darken\n\npower = watch()\n\n# lượt của bạn — luật đúng là: DƯỚI 3 thì tối đèn. Dấu nào mới là "dưới"?\nif power > 3:\n    darken()\nelse:\n    lighten()\n',
      label: "night_guard.py",
      note: "ĐỀ BÀI\nLuật đúng là: sức mạnh DƯỚI 3 thì màn hình tối đi, còn lại thì sáng lên. Bạn hãy sửa dấu so sánh cho đúng chữ \"dưới\", rồi RUN hai lần: một lần giơ 2 ngón (phải tối đi), một lần giơ 4 ngón (phải sáng lên).",
      expect: [2, 4],
      expectOut: { 2: /dark/i, 4: /light/i },
      sampleInput: "2",
      solution: 'from camera_charm import watch, lighten, darken\n\npower = watch()\n\nif power < 3:\n    darken()\nelse:\n    lighten()\n',
    },
    {
      npc: "Cánh cổng lớn đọc số ngón hai lần rồi cộng lại. Luật ghi: \"Tổng sức mạnh từ 6 trở lên thì cổng phun lửa\". Bạn sẽ thử đúng giá trị mốc 6.",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, freeze\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\npower = a + b\nsay_num(power)\n\nif power >= 6:\n    fire_vortex()\nelse:\n    freeze()\n',
      label: "big_gate.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi giơ 3 ngón cả hai lần. Tổng sức mạnh là 6 — chạm đúng mốc — và dấu >= sẽ tính 6 là \"6 trở lên\", nên lửa phải bùng lên.",
      expect: 3,
      expectOut: { all: [/^6$/, /fire/i] },
      solution: 'from camera_charm import watch, fire_vortex, freeze\nfrom old_computer import say_num\n\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\npower = a + b\nsay_num(power)\n\nif power >= 6:\n    fire_vortex()\nelse:\n    freeze()\n',
    },
    {

      npc: "Suỵt... phía trước có một cánh cổng bị yểm bùa. Dân làng kể: luật trên cổng ghi \"đủ 6 sức mạnh TRỞ LÊN thì mở\", vậy mà bao nhiêu pháp sư gom đúng 6 vẫn bị chặn lại.",

    },

    {

      npc: "Nghe quen quen đúng không? Bạn hãy RUN trước để lấy BẰNG CHỨNG, rồi tìm con bug ranh giới trong luật.",

    },
    {
      code: 'from camera_charm import watch, fire_vortex\nfrom old_computer import say, say_num\n\n# LUẬT TRÊN CỔNG: đủ 6 sức mạnh TRỞ LÊN thì cổng mở\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\npower = a + b\nsay_num(power)\n\nif power > 6:\n    fire_vortex()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "cursed_gate.py",
      note: "ĐỀ BÀI\nBạn hãy giơ 3 ngón cả hai lần cho tổng đúng bằng 6 — cổng sẽ chặn bạn dù luật ghi \"6 trở lên\". Đó là bằng chứng! Giờ tìm dấu sai trong luật, sửa lại, rồi RUN kiểm chứng với đúng 6 sức mạnh.",
      expect: 3,
      expectOut: { all: [/^6$/, /cổng mở/i] },
      sampleInput: ["3", "3"],
      solution: 'from camera_charm import watch, fire_vortex\nfrom old_computer import say, say_num\n\n# LUẬT TRÊN CỔNG: đủ 6 sức mạnh TRỞ LÊN thì cổng mở\na = watch()   # giơ tay lần 1\nb = watch()   # giơ tay lần 2\npower = a + b\nsay_num(power)\n\nif power >= 6:\n    fire_vortex()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      checkpoint: {
        text: "Với luật \"từ `X` trở lên\", hãy thử giá trị bằng đúng `X`. Một giá trị lớn hơn `X` không phân biệt được điều kiện `>` với `>=`.",
      },
    },
    {
      quiz: {
        title: "Bằng chứng của pháp sư",
        questions: [
          {
            q: "Cũng cánh cổng đó, bạn giơ 4 ngón với 3 ngón (tổng 7) và cổng `if power > 6:` mở ngon lành. Vậy kết luận \"luật không có bug\" đúng không?",
            a: [
              "Đúng — chỉ cần cổng mở ở 7 là đủ biết điều kiện không có bug",
              "Chưa chắc — phải thử đúng giá trị mốc 6 mới phân biệt được `>` với `>=`",
              "Sai — cổng không bao giờ được mở khi dùng dấu >",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "MÁY ĐO SỨC MẠNH chia INPUT thành ba bậc. Vì hai điều kiện đều dùng `<=`, máy phải kiểm tra mốc thấp trước. Nếu hỏi `power <= 3` trước, sức mạnh 1 sẽ đi nhầm vào nhánh đó.",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken\n\npower = watch()\n\nif power <= 1:\n    darken()          # yếu: 1 trở xuống\nelif power <= 3:\n    lighten()         # khá: 2 đến 3\nelse:\n    fire_vortex()     # mạnh: 4 trở lên\n',
      label: "power_meter.py",
      note: "ĐỀ BÀI\nBạn hãy RUN rồi giơ tùy thích 1 ngón (tối đi), 3 ngón (sáng lên) hoặc ✋ 5 ngón (bùng lửa) — chạy lại vài lần để thử đủ ba bậc càng vui.",
      expect: [1, 3, 5],
      expectOut: { 1: /dark/i, 3: /light/i, 5: /fire/i },
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken\n\npower = watch()\n\nif power <= 1:\n    darken()          # yếu: 1 trở xuống\nelif power <= 3:\n    lighten()         # khá: 2 đến 3\nelse:\n    fire_vortex()     # mạnh: 4 trở lên\n',
    },
    {
      checkpoint: {
        text: "Trong chuỗi `if`/`elif`/`else`, máy dừng ở nhánh đúng đầu tiên. Với các điều kiện `power <= ...`, phải kiểm tra mốc thấp trước để nhánh rộng hơn không nhận nhầm giá trị.",
      },
    },
    {
      quiz: {
        title: "Máy đo ba bậc",
        questions: [
          {
            q: "Máy dùng đoạn code sau:\n```python\nif power <= 1:\n    darken()\nelif power <= 3:\n    lighten()\nelse:\n    fire_vortex()\n```\nNếu camera đọc được `power = 3`, máy đi vào nhánh nào?",
            a: [
              "Dừng luôn, không làm gì nữa",
              "Hỏi tiếp điều kiện elif `power <= 3` — đúng, nên đèn sáng lên",
              "Nhảy thẳng xuống else để bùng lửa",
            ],
            correct: 1,
          },
          {
            q: "Máy bị xếp sai thứ tự:\n```python\nif power <= 3:\n    lighten()\nelif power <= 1:\n    darken()\n```\nNếu camera đọc được `power = 1`, màn hình sẽ sáng hay tối?",
            a: [
              "Vẫn tối đèn như cũ, thứ tự không quan trọng",
              "Đèn SÁNG lên nhầm — vì 1 <= 3 đúng nên máy dừng ngay điều kiện đầu, không bao giờ tới điều kiện <= 1",
              "Máy báo lỗi vì hai câu bị xếp ngược",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Chuẩn bị nhé... GOLEM GÁC CỔNG đang thức giấc kìa! Nó là lính canh của Chúa tể hắc ám và chuyên ăn lỗi sai để hồi máu. Trả lời đúng rồi sửa đúng điều kiện để hạ nó. Lên nào!",
    },
    {
      boss: {
        name: "THE BOUNDARY GOLEM",
        art: "assets/boundary-golem.webp",
        glyph: "🪨",
        hp: 900,
        baseDmg: 20,
        streakMul: [1, 1.5, 2],
        heal: 10,
        hearts: 3,
        rounds: [
          {
            q: "Trên cổng ghi \"sức mạnh 4 TRỞ LÊN được qua\". Dấu nào viết đúng luật đó?",
            a: ["if power > 4:", "if power >= 4:", "if power == 4:"],
            correct: 1,
          },
          {
            q: "Cho sẵn `a = 2` và `b = 3`. Điều kiện `a + b < 6` cho kết quả gì?",
            a: ["Đúng (TRUE) — vì 5 nhỏ hơn 6", "Sai (FALSE) — vì 5 lớn hơn 6"],
            correct: 0,
          },
          {
            code: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\n# LUẬT: DƯỚI 3 mới là yếu -> báo "yếu quá"\npower = watch()\nif power > 3:\n    say("yếu quá, luyện thêm nhé")\nelse:\n    lighten()\n    say("đủ mạnh!")\n',
            label: "wrong_direction.py",
            note: "Luật dặn: DƯỚI 3 mới là yếu — vậy mà golem lén đổi dấu, ai mạnh cũng bị chê yếu. Bạn hãy sửa dấu so sánh cho đúng chiều, rồi RUN và giơ 4 ngón để STRIKE.",
            dmg: 30,
            expect: 4,
            expectOut: /đủ mạnh/i,
            solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\n# LUẬT: DƯỚI 3 mới là yếu -> báo "yếu quá"\npower = watch()\nif power < 3:\n    say("yếu quá, luyện thêm nhé")\nelse:\n    lighten()\n    say("đủ mạnh!")\n',
          },
          {
            q: "Code viết `if score >= 5:` thì bạn nào được ĐÚNG 5 điểm sẽ thế nào?",
            a: ["Được tính là qua — vì `>=` bao gồm trường hợp bằng", "Không qua — vì 5 không lớn hơn 5", "Tùy hôm đó máy vui hay buồn"],
            correct: 0,
          },
          {
            code: 'from camera_charm import watch, freeze, fire_vortex\n\n# LUẬT: 2 ngón TRỞ XUỐNG -> đóng băng, còn lại -> phun lửa\nfinger = watch()\nif finger < 2:\n    freeze()\nelse:\n    fire_vortex()\n',
            label: "golem_curse.py",
            note: "Luật ghi: 2 ngón TRỞ XUỐNG thì đóng băng. Bạn hãy giơ đúng 2 ngón để lấy bằng chứng nó sai, sửa dấu cho đúng chữ \"trở xuống\", rồi RUN lại với 2 ngón để STRIKE.",
            dmg: 30,
            expect: 2,
            expectOut: /freeze/i,
            solution: 'from camera_charm import watch, freeze, fire_vortex\n\n# LUẬT: 2 ngón TRỞ XUỐNG -> đóng băng, còn lại -> phun lửa\nfinger = watch()\nif finger <= 2:\n    freeze()\nelse:\n    fire_vortex()\n',
          },
          {
            q: "Luật ghi \"đủ 100 vàng trở lên thì được giảm giá\" nhưng code viết `if gold > 100:`. Thử giá trị nào sẽ làm lỗi ranh giới lộ ra?",
            a: ["99", "100", "101"],
            correct: 1,
          },
          {
            code: 'from camera_charm import watch, fire_vortex, lighten, darken\n\n# LUẬT: 1 trở xuống -> tối đèn, 2 đến 3 -> sáng đèn, 4 trở lên -> bùng lửa\npower = watch()\nif power <= 3:\n    lighten()\nelif power <= 1:\n    darken()\nelse:\n    fire_vortex()\n',
            label: "shuffled_meter.py",
            note: "Hai điều kiện đều dùng `<=`, nhưng mốc 3 đang đứng trước mốc 1 nên sức mạnh 1 đi nhầm vào nhánh sáng. Bạn hãy đưa điều kiện `power <= 1` lên trước, rồi RUN với 1 ngón.",
            dmg: 30,
            expect: 1,
            expectOut: /dark/i,
            solution: 'from camera_charm import watch, fire_vortex, lighten, darken\n\n# LUẬT: 1 trở xuống -> tối đèn, 2 đến 3 -> sáng đèn, 4 trở lên -> bùng lửa\npower = watch()\nif power <= 1:\n    darken()\nelif power <= 3:\n    lighten()\nelse:\n    fire_vortex()\n',
          },
          {
            code: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say_num\n\npower = 0\n\npower = power + watch()   # giơ lần 1\npower = power + watch()   # giơ lần 2\npower = power + watch()   # giơ lần 3\nsay_num(power)\n\nif power >= 12:\n    fire_vortex()\nelif power >= 6:\n    lighten()\nelse:\n    darken()\n',
            label: "final_weigh.py",
            note: "ĐÒN KẾT LIỄU: bạn hãy giơ 4 ngón đúng CẢ BA LẦN — tổng sức mạnh là 12, chạm đúng mốc \"12 trở lên\", lửa sẽ bùng lên thiêu golem. Hụt một lần thôi là chỉ còn đèn sáng, golem sẽ cười vào mũi bạn đó.",
            dmg: 50,
            finisher: true,
            expectOut: { all: [/^12$/, /fire/i] },
            solution: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say_num\n\npower = 0\n\npower = power + watch()   # giơ lần 1\npower = power + watch()   # giơ lần 2\npower = power + watch()   # giơ lần 3\nsay_num(power)\n\nif power >= 12:\n    fire_vortex()\nelif power >= 6:\n    lighten()\nelse:\n    darken()\n',
          },
        ],
      },
    },
    {
      npc: "RẦM! Golem Gác Cổng đã hóa thành sỏi. Bạn đã dùng được bốn dấu so sánh và biết kiểm tra chính giá trị mốc để tìm lỗi ranh giới. Niêm phong cột mốc rồi tụi mình đi tiếp nhé!",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG CỘT MỐC",
    theme: { motion: "comet", palette: { core: "#78b2a5", dust: "#d69a20", rune: "#f4c85a" }, glyphs: "==" },
  },
};
