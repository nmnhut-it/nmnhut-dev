// node06v2.js — PEDAGOGY V2 CLONE of node06.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson06v2.html, also reachable via dev-test.html?src=node06v2.
// `index` matches node06.js (6) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node06.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file started as the narrower badge-only clone. It is
// now polished for the live V2 track: review gate and small content cleanup.
export default {
  index: 6,
  title: "Ranh giới: Lớn hơn hay nhỏ hơn",
  subtitle: "bốn dấu so sánh `>` `<` `>=` `<=` — và lỗi xuất hiện ngay tại giá trị mốc",
  bundle: {
    art: "assets/future-packet.webp",
    name: "GÓI DỤNG CỤ ĐO",
  },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY ĐO SỨC MẠNH",
    blurb: "bộ phận giúp cỗ máy dùng bốn dấu `>` `<` `>=` `<=` để so sánh sức mạnh, thay vì chỉ kiểm tra hai giá trị có bằng nhau",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn luật đầy đủ",
        questions: [
          {
            q: "Máy có luật này:\n```python\nif finger == 1:\n    display(\"LỬA\")\nelif finger == 3:\n    display(\"SÁNG\")\nelse:\n    display(\"BĂNG\")\n```\nGiơ 5 ngón thì nhánh nào chạy?",
            a: [
              "Nhánh `if`",
              "Nhánh `elif`",
              "Nhánh `else`",
            ],
            correct: 2,
          },
          {
            q: "`display(\"BĂNG\")` khác `say(\"BĂNG\")` ở chỗ nào?",
            a: [
              "`display()` hiện chữ trên màn hình AR/camera, `say()` chỉ in console",
              "`say()` hiện chữ trên camera, `display()` chỉ in console",
              "Hai lệnh giống hệt nhau",
            ],
            correct: 0,
          },
          {
            q: "Trong chuỗi `if`/`elif`/`else`, nếu một nhánh phía trên đã đúng thì máy làm gì với các nhánh phía dưới?",
            a: [
              "Vẫn chạy hết mọi nhánh",
              "Dừng ở nhánh đúng đầu tiên",
              "Luôn nhảy xuống `else`",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Ơ kìa, một cánh cổng đá đang chắn đường! Trên cổng khắc: \"CHỈ PHÁP SƯ ĐỦ MẠNH MỚI ĐƯỢC QUA\". Muốn mở cổng, tụi mình cần dùng dấu so sánh.",
    },
    {
      npc: "Bạn còn nhớ dấu `==` không? Dấu này chỉ cho kết quả đúng khi hai giá trị bằng nhau. Đoạn code dưới đây mở cổng khi sức mạnh bằng đúng 3. Bạn bấm RUN rồi giơ 4 ngón nhé.",
    },
    {
      code: `from camera_charm import watch, lighten
from old_computer import say

power = watch()

if power == 3:
    lighten()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
      label: "gate_equal.py",
      note: `ĐỀ BÀI
Bạn hãy bấm RUN rồi giơ 4 ngón. Lệnh \`watch()\` đọc INPUT 4 từ camera; điều kiện \`power == 3\` quyết định cổng mở hay đóng. Hãy quan sát OUTPUT và cho biết cổng có mở không.`,
      expect: 4,
      expectOut: /vẫn đóng/i,
      sampleInput: "4",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power == 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      npc: "Cổng vẫn đóng vì 4 không bằng 3. Điều kiện `power == 3` chỉ kiểm tra trường hợp bằng đúng 3. Muốn kiểm tra sức mạnh lớn hơn 3, tụi mình cần một dấu khác.",
    },
    {
      gift: {
        art: "assets/scroll-of-measure.webp",
        glyph: "⚖",
        name: "CUỘN CHÚ SO SÁNH",
        blurb: "bốn dấu so sánh của Kotopia: > lớn hơn · < nhỏ hơn · >= trở lên · <= trở xuống",
      },
    },
    {
      npc: "Dấu `>` đọc là \"lớn hơn\". Điều kiện `power > 3` kiểm tra sức mạnh có lớn hơn 3 hay không. Bạn đổi `==` thành `>`, rồi bấm RUN và giơ 4 ngón lần nữa nhé.",
    },
    {
      code: `from camera_charm import watch, lighten
from old_computer import say

power = watch()

# lượt của bạn — đổi dấu == thành dấu > (lớn hơn)
if power == 3:
    lighten()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
      label: "gate_greater.py",
      note: "ĐỀ BÀI\nBạn hãy đổi `power == 3` thành `power > 3`, rồi RUN và giơ 4 ngón. Lần này 4 lớn hơn 3, cổng sẽ mở thôi.",
      expect: 4,
      expectOut: /cổng mở/i,
      sampleInput: "4",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      npc: "Cổng mở rồi! Nhưng dòng chữ nhỏ ghi: \"Sức mạnh 3 TRỞ LÊN thì được qua\". Nếu bạn giơ đúng 3 ngón, điều kiện `power > 3` có mở cổng không? Bạn hãy đoán trước khi bấm RUN.",
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
      code: `from camera_charm import watch, lighten
from old_computer import say

power = watch()

if power > 3:
    lighten()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
      label: "gate_boundary.py",
      note: `ĐỀ BÀI
Giờ kiểm chứng lời đoán: bạn hãy RUN rồi giơ ĐÚNG 3 ngón, xem cổng mở hay đóng.`,
      expect: 3,
      expectOut: /vẫn đóng/i,
      sampleInput: "3",
      solution: 'from camera_charm import watch, lighten\nfrom old_computer import say\n\npower = watch()\n\nif power > 3:\n    lighten()\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      npc: "Cổng đóng dù luật phải nhận cả sức mạnh 3. Đây là LỖI RANH GIỚI: code xử lý sai khi giá trị bằng đúng mốc. Muốn viết \"3 trở lên\", mình dùng `>=`, nghĩa là \"lớn hơn hoặc bằng\".",
    },
    {
      code: `from camera_charm import watch, lighten
from old_computer import say

power = watch()

# lượt của bạn — đổi dấu > thành dấu >= (trở lên)
if power > 3:
    lighten()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
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
            a: [
              "`if age < 5:`",
              "`if age <= 5:`",
              "`if age == 5:`",
            ],
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
            a: [
              "Đúng (TRUE), vì 2 nhỏ hơn 3",
              "Sai (FALSE), vì 2 chưa bằng 3",
              "Máy không trả lời được",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "🎯",
        name: "HUY HIỆU RANH GIỚI",
        blurb: "phần thưởng cho việc tìm được LỖI RANH GIỚI — biết `>=` và `<=` tính cả mốc, còn `>` và `<` thì không",
        badge: true,
        badgeId: "huy_hieu_ranh_gioi",
      },
    },
    {
      npc: "Bảng dưới đây dùng cả bốn dấu để so sánh `x = 3` với mốc 3. Bạn bấm RUN và xem điều kiện nào cho kết quả ĐÚNG nhé.",
    },
    {
      code: `from old_computer import say

x = 3

if x > 3:
    say("x > 3: ĐÚNG")
else:
    say("x > 3: SAI")

if x >= 3:
    say("x >= 3: ĐÚNG")
else:
    say("x >= 3: SAI")

if x < 3:
    say("x < 3: ĐÚNG")
else:
    say("x < 3: SAI")

if x <= 3:
    say("x <= 3: ĐÚNG")
else:
    say("x <= 3: SAI")
`,
      label: "boundary_table.py",
      note: "ĐỀ BÀI\nCho sẵn `x = 3`. Bạn hãy bấm RUN và đọc bốn dòng OUTPUT. Hai điều kiện có dấu `>=` hoặc `<=` phải cho kết quả ĐÚNG vì chúng tính cả trường hợp `x` bằng mốc 3.",
      expectOut: {
        all: [
          /x > 3: SAI/i,
          /x >= 3: ĐÚNG/i,
          /x < 3: SAI/i,
          /x <= 3: ĐÚNG/i,
        ],
      },
      solution: 'from old_computer import say\n\nx = 3\n\nif x > 3:\n    say("x > 3: ĐÚNG")\nelse:\n    say("x > 3: SAI")\n\nif x >= 3:\n    say("x >= 3: ĐÚNG")\nelse:\n    say("x >= 3: SAI")\n\nif x < 3:\n    say("x < 3: ĐÚNG")\nelse:\n    say("x < 3: SAI")\n\nif x <= 3:\n    say("x <= 3: ĐÚNG")\nelse:\n    say("x <= 3: SAI")\n',
    },
    {
      npc: "Giờ bạn thử sửa một đoạn code nhé. MÁY GÁC ĐÊM phải làm màn hình tối đi khi sức mạnh dưới 3, nhưng điều kiện hiện tại dùng sai dấu so sánh.",
    },
    {
      code: `from camera_charm import watch, lighten, darken

power = watch()

# lượt của bạn — đổi điều kiện để sức mạnh dưới 3 làm màn hình tối đi
if power > 3:
    darken()
else:
    lighten()
`,
      label: "night_guard.py",
      note: `ĐỀ BÀI
Luật đúng là: sức mạnh DƯỚI 3 thì màn hình tối đi, còn lại thì sáng lên. Bạn hãy sửa dấu so sánh cho đúng chữ "dưới", rồi RUN hai lần: một lần giơ 2 ngón (phải tối đi), một lần giơ 4 ngón (phải sáng lên).`,
      expect: [
        2,
        4,
      ],
      expectOut: {
        "2": /dark/i,
        "4": /light/i,
      },
      sampleInput: "2",
      solution: 'from camera_charm import watch, lighten, darken\n\npower = watch()\n\nif power < 3:\n    darken()\nelse:\n    lighten()\n',
    },
    {
      npc: "Cánh cổng lớn đọc số ngón hai lần rồi cộng lại. Luật ghi: \"Tổng sức mạnh từ 6 trở lên thì cổng phun lửa\". Bạn sẽ thử đúng giá trị mốc 6.",
    },
    {
      code: `from camera_charm import watch, fire_vortex, freeze
from old_computer import say_num

first_power = watch()   # giơ tay lần 1
second_power = watch()  # giơ tay lần 2
total_power = first_power + second_power
say_num(total_power)

if total_power >= 6:
    fire_vortex()
else:
    freeze()
`,
      label: "big_gate.py",
      note: `ĐỀ BÀI
Bạn hãy bấm RUN rồi giơ 3 ngón ở cả hai lần INPUT. Máy cộng thành \`total_power = 6\`; điều kiện \`total_power >= 6\` phải gọi \`fire_vortex()\`. OUTPUT đúng là số 6 và hiệu ứng lửa.`,
      expect: 3,
      expectOut: {
        all: [
          /^6$/,
          /fire/i,
        ],
      },
      solution: 'from camera_charm import watch, fire_vortex, freeze\nfrom old_computer import say_num\n\nfirst_power = watch()   # giơ tay lần 1\nsecond_power = watch()  # giơ tay lần 2\ntotal_power = first_power + second_power\nsay_num(total_power)\n\nif total_power >= 6:\n    fire_vortex()\nelse:\n    freeze()\n',
    },
    {
      npc: "Suỵt... cánh cổng phía trước bị yểm bùa. Luật ghi: \"Tổng sức mạnh từ 6 trở lên thì mở\", nhưng tổng bằng 6 vẫn bị chặn. Bạn hãy tìm lỗi ranh giới trong điều kiện.",
    },
    {
      code: `from camera_charm import watch, fire_vortex
from old_computer import say, say_num

# LUẬT TRÊN CỔNG: đủ 6 sức mạnh TRỞ LÊN thì cổng mở
first_power = watch()   # giơ tay lần 1
second_power = watch()  # giơ tay lần 2
total_power = first_power + second_power
say_num(total_power)

if total_power > 6:
    fire_vortex()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
      label: "cursed_gate.py",
      note: `ĐỀ BÀI
Hai INPUT từ camera đều là 3 ngón, nên \`total_power\` bằng 6. Luật yêu cầu cổng mở từ 6 trở lên. Bạn hãy sửa dấu so sánh; OUTPUT đúng phải in số 6 và \"Cổng mở!\".`,
      expect: 3,
      expectOut: {
        all: [
          /^6$/,
          /cổng mở/i,
        ],
      },
      sampleInput: ["3", "3"],
      solution: `from camera_charm import watch, fire_vortex
from old_computer import say, say_num

# LUẬT TRÊN CỔNG: đủ 6 sức mạnh TRỞ LÊN thì cổng mở
first_power = watch()   # giơ tay lần 1
second_power = watch()  # giơ tay lần 2
total_power = first_power + second_power
say_num(total_power)

if total_power >= 6:
    fire_vortex()
    say("Cổng mở!")
else:
    say("Cổng vẫn đóng...")
`,
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
      code: `from camera_charm import watch, fire_vortex, lighten, darken

power = watch()

if power <= 1:
    darken()          # yếu: 1 trở xuống
elif power <= 3:
    lighten()         # khá: 2 đến 3
else:
    fire_vortex()     # mạnh: 4 trở lên
`,
      label: "power_meter.py",
      note: `ĐỀ BÀI
Bạn hãy RUN rồi giơ tùy thích 1 ngón (tối đi), 3 ngón (sáng lên) hoặc ✋ 5 ngón (bùng lửa) — chạy lại vài lần để thử đủ ba bậc càng vui.`,
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken\n\npower = watch()\n\nif power <= 1:\n    darken()\nelif power <= 3:\n    lighten()\nelse:\n    fire_vortex()\n',
      expect: [
        1,
        3,
        5,
      ],
      expectOut: {
        "1": /dark/i,
        "3": /light/i,
        "5": /fire/i,
      },
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
      npc: "Trước khi gặp golem, tụi mình ghé LÒ RÈN nhé. HUY HIỆU RANH GIỚI sẽ giúp Pip rèn một quả BOM MẬT NGỮ để phong ấn lính gác.",
    },
    // BOSS CONCEPT V2 migration (FORGE-PLAN.md "FINALIZED") — see node04v2.js/
    // node05v2.js's header comments for the pattern: legacy rounds[] moves
    // into forge.quiz (code-fix rounds become "what's the bug" text quiz),
    // the gesture finisher round (final_weigh.py) is RETIRED for the new KO.
    {
      forge: {
        quiz: [
          {
            q: "Cho sẵn `power = 3`. Điều kiện `power >= 3` cho kết quả gì?",
            a: ["Đúng — dấu >= tính cả trường hợp bằng nhau", "Sai — 3 không LỚN HƠN 3", "Máy báo lỗi vì không so được"],
            correct: 0,
          },
          {
            q: "Trên cổng ghi \"sức mạnh 4 TRỞ LÊN được qua\". Dấu nào viết đúng luật đó?",
            a: ["`if power > 4:`", "`if power >= 4:`", "`if power == 4:`"],
            correct: 1,
          },
          {
            q: "Cho sẵn `a = 2` và `b = 3`. Điều kiện `a + b < 6` cho kết quả gì?",
            a: ["Đúng (TRUE) — vì 5 nhỏ hơn 6", "Sai (FALSE) — vì 5 lớn hơn 6"],
            correct: 0,
          },
          {
            q: "Luật ghi DƯỚI 3 mới là yếu, nhưng code lại viết `if power > 3: say(\"yếu quá\")`. Dấu nào mới đúng luật?",
            a: ["`if power < 3:`", "`if power > 3:`", "`if power == 3:`"],
            correct: 0,
          },
          {
            q: "Code viết `if score >= 5:` thì bạn nào được ĐÚNG 5 điểm sẽ thế nào?",
            a: ["Được tính là qua — vì `>=` bao gồm trường hợp bằng", "Không qua — vì 5 không lớn hơn 5", "Tùy hôm đó máy vui hay buồn"],
            correct: 0,
          },
          {
            q: "Luật ghi \"2 ngón TRỞ XUỐNG thì đóng băng\" nhưng code viết `if finger < 2:`. Dấu nào mới đúng luật?",
            a: ["`if finger <= 2:`", "`if finger < 2:`", "`if finger > 2:`"],
            correct: 0,
          },
          {
            q: "Luật ghi \"đủ 100 vàng trở lên thì được giảm giá\" nhưng code viết `if gold > 100:`. Thử giá trị nào sẽ làm lỗi ranh giới lộ ra?",
            a: ["99", "100", "101"],
            correct: 1,
          },
          {
            q: "Một máy viết:\n```python\nif power <= 3:\n    lighten()\nelif power <= 1:\n    darken()\n```\nMuốn `power = 1` gọi `darken()`, cần đổi thứ tự hai điều kiện thế nào?",
            a: ["Với hai điều kiện `<=`, phải kiểm tra `power <= 1` trước `power <= 3`", "Giữ nguyên vì thứ tự không ảnh hưởng", "Luôn phải kiểm tra mốc cao trước"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "BOM MẬT NGỮ sẵn sàng rồi! Bạn giơ ngón trỏ ☝ để ngắm, sau đó giơ bàn tay ✋ để phóng bom và phong ấn GOLEM GÁC CỔNG. Chưa có bom thì bạn quay lại LÒ RÈN nhé.",
    },
    {
      boss: {
        name: "GOLEM RANH GIỚI",
        sheet: { src: "assets/boundary-golem-sheet.webp" },
        art: "assets/boundary-golem.webp",
        glyph: "🪨",
        ko: true,
      },
    },
    {
      npc: "RẦM! Golem Gác Cổng đã hóa thành sỏi. Bạn đã dùng được bốn dấu so sánh và biết kiểm tra chính giá trị mốc để tìm lỗi ranh giới. Cột mốc sáng rồi; tụi mình đi tiếp nhé!",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG CỘT MỐC",
    theme: {
      motion: "comet",
      palette: {
        core: "#78b2a5",
        dust: "#d69a20",
        rune: "#f4c85a",
      },
      glyphs: "==",
    },
  },
};
