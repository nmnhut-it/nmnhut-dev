// islandCOMPARE.js — ĐẢO SO SÁNH, a bonus side-island (island.js, not node.js):
// extra reps for node06's vocabulary (> < >= <= and the boundary-bug idea —
// a rule says "trở lên/trở xuống" but the code uses a strict > or <, so it
// misbehaves EXACTLY at the threshold). review-nodes.txt flagged node06 gives
// good reps for > and >= but comparatively few for < and <= — this island
// drills all four evenly, always testing AT the boundary number. Per
// PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary (watch(),
// fire_vortex()/lighten()/darken()/freeze()/display(), say_num()) — no new
// concept. Gated unlockAt:7 (after node06 — comparison — is done).
export default {
  index: -1,
  sideIslandId: "islandCOMPARE",
  title: "ĐẢO SO SÁNH",
  subtitle: "luyện thêm > < >= <= và bắt lỗi ranh giới đúng tại mốc",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ ĐO MỐC" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY ĐO RANH GIỚI",
    blurb: "một cỗ máy phụ để luyện so sánh và bắt lỗi ranh giới — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO SO SÁNH ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Ai muốn luyện tay cho quen > < >= <= và cách bắt lỗi đúng tại mốc thì cứ ghé qua!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo So Sánh! Ở đây mình luyện bốn dấu > < >= <= — và mẹo quan trọng nhất: muốn biết luật có ĐÚNG không, phải thử NGAY TẠI con số mốc, không phải thử số xa mốc.",
    },

    // ── bài 1: > vs >= đúng tại mốc ──
    {
      quiz: {
        title: "Đúng tại mốc — compare1.py",
        questions: [
          {
            q: 'Luật ghi: "đủ 3 sức mạnh TRỞ LÊN thì cổng mở". Code viết `if power > 3:`. Thử đúng `power = 3` — cổng có mở không?',
            a: [
              "Không mở — vì `>` không tính trường hợp BẰNG, mà luật lại nói TRỞ LÊN (bao gồm cả bằng 3)",
              "Có mở, vì 3 gần với 3",
              "Không xác định được",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\npower = 3\nif power > 3:\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "compare1.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `power = 3`. Đây không phải INPUT.\n`power = 3` đúng tại mốc — bấm ▶ RUN xem cổng có mở như luật \"trở lên\" ghi không.",
      expectOut: /cổng vẫn đóng/i,
      solution: 'from old_computer import say\n\npower = 3\nif power > 3:\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      code: 'from old_computer import say\n\npower = 3\n\n# lượt của bạn — sửa dấu để "3 trở lên" thật sự mở cổng đúng tại mốc\nif power > 3:\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
      label: "compare_fix1.py",
      note: "ĐỀ BÀI (sửa lỗi)\nĐổi `>` thành dấu đúng để \"3 trở lên\" (bao gồm cả đúng 3) mở được cổng.",
      expectOut: /cổng mở/i,
      solution: 'from old_computer import say\n\npower = 3\n\nif power >= 3:\n    say("Cổng mở!")\nelse:\n    say("Cổng vẫn đóng...")\n',
    },
    {
      checkpoint: {
        text: "`>` không tính trường hợp bằng nhau — `power > 3` chỉ đúng khi lớn hơn hẳn 3. Nếu luật nói \"trở lên\" (bao gồm cả đúng mốc), phải dùng `>=`. Muốn bắt lỗi kiểu này, luôn thử ngay tại con số mốc, không thử số xa mốc.",
      },
    },
    {
      quiz: {
        title: "Vì sao phải thử tại mốc",
        questions: [
          {
            q: 'Vì sao thử `power = 3` bắt được lỗi, còn thử `power = 10` thì không?',
            a: [
              "Vì lỗi ranh giới chỉ lộ ra đúng tại con số mốc (3) — số xa mốc như 10 vẫn cho kết quả đúng dù dùng nhầm `>` thay vì `>=`",
              "Vì số 10 quá lớn nên máy tính sai",
              "Vì phải thử số chẵn mới bắt được lỗi",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: < vs <= đúng tại mốc (ít đất diễn hơn > / >= trong node06 — bù thêm ở đây) ──
    {
      quiz: {
        title: "Đúng tại mốc — compare2.py",
        questions: [
          {
            q: 'Luật ghi: "2 sức mạnh TRỞ XUỐNG thì đóng băng". Code viết `if power < 2:`. Thử đúng `power = 2` — có đóng băng không?',
            a: [
              "Không — vì `<` không tính trường hợp BẰNG, mà luật lại nói TRỞ XUỐNG (bao gồm cả bằng 2)",
              "Có, vì 2 là số nhỏ",
              "Không xác định được",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import freeze, fire_vortex\n\npower = 2\nif power < 2:\n    freeze()\nelse:\n    fire_vortex()\n',
      label: "compare2.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `power = 2`. Đây không phải INPUT.\n`power = 2` đúng tại mốc — bấm ▶ RUN xem có đóng băng như luật \"trở xuống\" ghi không.",
      expectOut: /fire/i,
      solution: 'from camera_charm import freeze, fire_vortex\n\npower = 2\nif power < 2:\n    freeze()\nelse:\n    fire_vortex()\n',
    },
    {
      code: 'from camera_charm import freeze, fire_vortex\n\npower = 2\n\n# lượt của bạn — sửa dấu để "2 trở xuống" thật sự đóng băng đúng tại mốc\nif power < 2:\n    freeze()\nelse:\n    fire_vortex()\n',
      label: "compare_fix2.py",
      note: "ĐỀ BÀI (sửa lỗi)\nĐổi `<` thành dấu đúng để \"2 trở xuống\" (bao gồm cả đúng 2) đóng băng đúng.",
      expectOut: /freeze/i,
      solution: 'from camera_charm import freeze, fire_vortex\n\npower = 2\n\nif power <= 2:\n    freeze()\nelse:\n    fire_vortex()\n',
    },
    {
      checkpoint: {
        text: "Y hệt `>` và `>=`, cặp `<` và `<=` cũng khác nhau đúng tại mốc: `<` không tính trường hợp bằng, `<=` (\"trở xuống\") thì có. Bốn dấu > < >= <= luôn phải chọn đúng theo lời luật — \"hẳn\" dùng `>`/`<`, \"trở lên/trở xuống\" dùng `>=`/`<=`.",
      },
    },
    {
      quiz: {
        title: "Chọn đúng dấu so sánh",
        questions: [
          {
            q: 'Luật ghi "điểm PHẢI TRÊN 8 mới được thưởng" (đúng 8 điểm KHÔNG được thưởng). Dấu nào đúng?',
            a: ["`score > 8`", "`score >= 8`", "`score == 8`"],
            correct: 0,
          },
          {
            q: 'Luật ghi "tuổi từ 5 TRỞ XUỐNG được miễn phí" (đúng 5 tuổi CÓ được miễn phí). Dấu nào đúng?',
            a: ["`age < 5`", "`age <= 5`", "`age == 5`"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 3: nhiều mốc — if/elif dùng >= liên tiếp ──
    {
      npc: "Giờ ghép nhiều mốc lại — camera thật, ba bậc sức mạnh khác nhau.",
    },
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say_num\n\npower = watch()\nsay_num(power)\n\n# lượt của bạn: chọn hiệu ứng theo ba mốc sức mạnh\n',
      label: "compare_write1.py",
      note: "ĐỀ BÀI (tự làm, camera thật)\nINPUT thật: `power = watch()` đọc số ngón tay từ camera.\nNếu sức mạnh từ 4 trở lên thì phóng lửa; nếu từ 2 đến 3 thì làm sáng; nếu 1 trở xuống thì làm tối. Dùng `if/elif/else` và chú ý thứ tự kiểm tra khi có nhiều mốc.",
      expectOut: { 1: /darken/i, 2: /lighten/i, 3: /lighten/i, 4: /fire/i, 5: /fire/i },
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken\nfrom old_computer import say_num\n\npower = watch()\nsay_num(power)\n\nif power >= 4:\n    fire_vortex()\nelif power >= 2:\n    lighten()\nelse:\n    darken()\n',
    },
    {
      quiz: {
        title: "Vì sao phải xếp mốc từ cao xuống thấp",
        questions: [
          {
            q: 'Nếu đổi thứ tự thành `if power >= 2:` TRƯỚC rồi mới `elif power >= 4:`, giơ đủ 5 sức mạnh sẽ chạy nhánh nào?',
            a: [
              "Nhánh `power >= 2` — vì máy dừng ở điều kiện khớp đầu tiên, và 5 >= 2 cũng đúng nên không bao giờ chạy tới nhánh >= 4 nữa",
              "Nhánh `power >= 4` — vì đó là mốc cao nhất nên luôn được ưu tiên",
              "Cả hai nhánh cùng chạy",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      checkpoint: {
        text: "Khi có nhiều mốc dùng `>=`/`<=`, phải xếp luật từ mốc cao xuống thấp (hoặc thấp lên cao nếu dùng `<=`) — vì máy dừng ở điều kiện khớp đầu tiên; xếp sai thứ tự sẽ làm mốc cao không bao giờ được chạy tới.",
      },
    },
    {
      quiz: {
        title: "Xếp mốc đúng thứ tự",
        questions: [
          {
            q: 'Luật muốn: 6 trở lên phóng lửa, 3 đến 5 sáng đèn, còn lại tối đèn. Nên viết `if power >= ?` trước — 3 hay 6?',
            a: ["6 — kiểm tra mốc cao trước, vì giá trị 6 cũng khớp mốc 3; nếu viết mốc 3 trước, máy sẽ chạy nhánh đó trước", "3 — vì 3 nhỏ hơn nên kiểm tra trước cho nhanh", "Không quan trọng, viết mốc nào trước cũng ra kết quả giống nhau"],
            correct: 0,
          },
        ],
      },
    },

    {
      remember:
        "So sánh có 4 dấu: `>` `<` (không tính bằng — \"hẳn\"), `>=` `<=` (có tính bằng — \"trở lên/trở xuống\"). Lỗi ranh giới thường nấp đúng tại con số mốc, nên muốn kiểm tra luật, phải thử đúng số đó, không thử số xa mốc. Nhiều mốc if/elif liên tiếp phải xếp đúng thứ tự cao→thấp hoặc thấp→cao.",
    },
  ],
};
