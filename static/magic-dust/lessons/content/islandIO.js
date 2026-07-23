// islandIO.js — ĐẢO INPUT/OUTPUT, a bonus side-island (island.js, not node.js):
// extra reps for node01v2's INPUT/OUTPUT split (read()=INPUT, say()=OUTPUT) —
// look at a snippet, point out which line is INPUT, which is OUTPUT, and
// predict what prints. NOT part of the main saga trail (no `boss`, no `gift`,
// no `ritual` — the closing act is island.js's plain finish card). Per
// PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary (no new
// concept — pure retrieval + practice); gated unlockAt:2 (after node01 is
// done), same gate as island01 since both drill node01's read()/say().
export default {
  index: -1,
  sideIslandId: "islandIO",
  title: "ĐẢO INPUT/OUTPUT",
  subtitle: "nhìn Mật Ngữ, chỉ ra dòng nào là INPUT, dòng nào là OUTPUT, đoán xem máy in ra gì — và vẽ ASCII ART bằng say()",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI BÚT VẼ ASCII ART" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI INPUT/OUTPUT",
    blurb: "một cỗ máy phụ để luyện mắt soi Mật Ngữ và vẽ tranh bằng say() — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO INPUT/OUTPUT ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Ai muốn luyện mắt soi Mật Ngữ cho quen chỗ nào là INPUT, chỗ nào là OUTPUT thì cứ ghé qua!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo INPUT/OUTPUT! Ở đây không chấm điểm gắt — chỉ có vài đoạn Mật Ngữ cho bạn đọc trước (chưa cần RUN vội) rồi chỉ ra: dòng nào là INPUT (máy hỏi và đọc phần bạn gõ), dòng nào là OUTPUT (máy in ra), và đoán xem chạy xong màn hình hiện gì. Làm xong lúc nào bạn cũng về được bản đồ.",
    },

    // ── bài 1: 1 input, 1 output — dạng cơ bản nhất ──
    // (code snippet quoted INSIDE the quiz question via a ``` fenced block —
    // no separate "look, don't run" {code} cell: {code} is a BLOCKING cell
    // type (notebook-runner.js's isBlocking), so a code cell always demands
    // a RUN before the next cell reveals; a quiz cell doesn't, so quoting the
    // snippet in the question is what actually lets you "read before running".)
    {
      quiz: {
        title: "Soi INPUT/OUTPUT — io_spot1.py",
        questions: [
          {
            q: 'Đọc kỹ đoạn Mật Ngữ sau (chưa RUN):\n```python\ncolor = read("Màu bạn thích? ")   # dòng A\nsay("Bạn thích màu " + color)      # dòng B\n```\nDòng nào là INPUT (máy HỎI rồi đọc phần bạn gõ)?',
            a: ["Dòng A — read(...) hỏi và đọc phần bạn gõ", "Dòng B — say(...) in ra màn hình", "Cả hai dòng đều là INPUT"],
            correct: 0,
          },
          {
            q: 'Đọc cùng đoạn Mật Ngữ này:\n```python\ncolor = read("Màu bạn thích? ")   # dòng A\nsay("Bạn thích màu " + color)      # dòng B\n```\nDòng nào là OUTPUT (máy IN kết quả ra màn hình)?',
            a: ["Dòng A", "Dòng B — say(...) in ra màn hình", "Không dòng nào cả"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from old_computer import read, say\n\ncolor = read("Màu bạn thích? ")\nsay("Bạn thích màu " + color)\n',
      label: "io_run1.py",
      note: 'ĐOÁN TRƯỚC KHI RUN\nNếu bạn gõ "xanh dương" khi máy hỏi, máy sẽ in ra CÂU GÌ? Đoán xong rồi bấm ▶ RUN kiểm tra lại.',
      expectOut: /bạn thích màu\s+\S+/i,
      solution: 'from old_computer import read, say\n\ncolor = read("Màu bạn thích? ")\nsay("Bạn thích màu " + color)\n',
    },

    // ── bài 1b: read()'s prompt text ALSO shows on screen — the #1 real
    // confusion this island exists to fix (owner: "các bạn đang bị nhầm lẫn
    // vì read cũng in ra màn hình"). Kids see the question text appear and
    // assume anything visible on screen = OUTPUT; this drills that read()'s
    // prompt is part of ASKING (still INPUT), not something the program
    // "decided" to print — only say() counts as OUTPUT. Experience (RUN a
    // read()-only program, SEE nothing but the question appear) → checkpoint
    // → quiz, same order as every other checkpoint in this file. ──
    {
      code: 'from old_computer import read\n\nname = read("Tên bạn? ")\n# để ý: không có say() nào cả!\n',
      label: "io_onlyask.py",
      note: 'CHẠY THỬ\nBấm ▶ RUN, gõ tên vào ô hỏi "Tên bạn?" rồi Enter. Nhìn kỹ khung kết quả bên dưới — có dòng chữ nào MỚI được IN RA không, ngoài câu hỏi vừa rồi?',
      expectOut: { minLines: 0 },
      solution: 'from old_computer import read\n\nname = read("Tên bạn? ")\n# để ý: không có say() nào cả!\n',
    },
    {
      checkpoint: {
        text: 'Câu hỏi mà read() hiện lên màn hình (vd "Tên bạn?") KHÔNG PHẢI là OUTPUT của chương trình — đó chỉ là lời nhắc để chờ bạn gõ, vẫn thuộc về dòng INPUT đó. OUTPUT thật sự chỉ tính những gì hiện ra từ say() — io_onlyask.py không có say() nào nên không in thêm gì sau khi bạn gõ xong.',
      },
    },
    {
      quiz: {
        title: "read() cũng hiện chữ lên màn hình — có phải OUTPUT không?",
        questions: [
          {
            q: 'Khi RUN `name = read("Tên bạn? ")`, dòng chữ "Tên bạn?" hiện lên màn hình để hỏi bạn, rồi bạn gõ tên vào. Dòng chữ "Tên bạn?" đó có phải là OUTPUT của chương trình không?',
            a: [
              "Không — đó là CÂU HỎI của read() để chờ bạn gõ, không phải điều chương trình \"in ra\" — OUTPUT chỉ tính khi có say()",
              "Có — vì nó hiện lên màn hình nên tính là OUTPUT",
              "Có, nhưng chỉ khi bạn gõ trả lời đúng",
            ],
            correct: 0,
          },
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nname = read("Tên bạn? ")\n```\nNếu chỉ có 1 dòng `read()` và không có `say()` nào cả, chương trình này có OUTPUT thật sự không?',
            a: [
              "Không có OUTPUT nào thật sự — chỉ có 1 dòng INPUT, dù màn hình vẫn hiện câu hỏi để chờ bạn gõ",
              "Có OUTPUT, chính là câu hỏi vừa hiện ra",
              "Không thể xảy ra — chương trình nào cũng phải có ít nhất 1 dòng OUTPUT",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: 2 input, 1 output — nhiều input hơn output ──
    {
      quiz: {
        title: "Đếm input/output — io_spot2.py",
        questions: [
          {
            q: 'Đọc kỹ đoạn Mật Ngữ sau (chưa RUN):\n```python\ncity = read("Bạn ở thành phố nào? ")    # dòng A\nfood = read("Món ăn bạn thích? ")        # dòng B\nsay("Ở " + city + ", món " + food + " ngon lắm!")   # dòng C\n```\nCó BAO NHIÊU dòng INPUT?',
            a: ["1 dòng", "2 dòng — A và B đều là read()", "3 dòng"],
            correct: 1,
          },
          {
            q: 'Đọc cùng đoạn Mật Ngữ này:\n```python\ncity = read("Bạn ở thành phố nào? ")    # dòng A\nfood = read("Món ăn bạn thích? ")        # dòng B\nsay("Ở " + city + ", món " + food + " ngon lắm!")   # dòng C\n```\nCó bao nhiêu dòng OUTPUT?',
            a: ["1 dòng — chỉ dòng C dùng say()", "2 dòng", "0 dòng"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import read, say\n\ncity = read("Bạn ở thành phố nào? ")\nfood = read("Món ăn bạn thích? ")\nsay("Ở " + city + ", món " + food + " ngon lắm!")\n',
      label: "io_run2.py",
      note: 'ĐOÁN TRƯỚC KHI RUN\nNếu bạn gõ "Đà Nẵng" rồi "mì Quảng", máy in ra câu gì? Đoán xong mới RUN.',
      expectOut: /ở\s+\S+.*món\s+\S+.*ngon lắm/i,
      solution: 'from old_computer import read, say\n\ncity = read("Bạn ở thành phố nào? ")\nfood = read("Món ăn bạn thích? ")\nsay("Ở " + city + ", món " + food + " ngon lắm!")\n',
    },

    {
      checkpoint: {
        text: "Số dòng `read()` và `say()` không cần bằng nhau. Một đoạn code có thể có nhiều INPUT hơn OUTPUT, nhiều OUTPUT hơn INPUT, hoặc không có INPUT nào cả. Muốn biết dòng nào làm việc gì thì phải đọc từng dòng.",
      },
    },
    {
      quiz: {
        title: "INPUT và OUTPUT không nhất định bằng nhau",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\na = read("A? ")\nb = read("B? ")\nc = read("C? ")\nsay(a + b + c)\n```\nCó bao nhiêu dòng INPUT và bao nhiêu dòng OUTPUT?',
            a: ["3 INPUT, 1 OUTPUT", "1 INPUT, 3 OUTPUT", "2 INPUT, 2 OUTPUT"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 3: KHÔNG có input — dễ nhầm là "chương trình nào cũng cần input" ──
    {
      quiz: {
        title: "Không phải chương trình nào cũng có input",
        questions: [
          {
            q: 'Đọc kỹ đoạn Mật Ngữ sau (chưa RUN):\n```python\npet = "mèo"                 # dòng A — GÁN THẲNG, không hỏi ai cả\nsay("Mình nuôi một con " + pet)   # dòng B\n```\nCó dòng INPUT nào không?',
            a: [
              "Không — dòng A gán thẳng pet = \"mèo\", không hỏi người dùng gì cả, nên chương trình này không có INPUT",
              "Có — dòng A là INPUT vì nó tạo ra một biến",
              "Có — dòng B là INPUT vì nó dùng biến pet",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\npet = "mèo"\nsay("Mình nuôi một con " + pet)\n',
      label: "io_run3.py",
      note: "ĐOÁN TRƯỚC KHI RUN\nKhông cần gõ gì cả — máy sẽ in ra CÂU GÌ? Đoán xong rồi RUN kiểm tra lại.",
      expectOut: /mình nuôi một con mèo/i,
      solution: 'from old_computer import say\n\npet = "mèo"\nsay("Mình nuôi một con " + pet)\n',
    },

    // ── bài 3b: VẼ CHỮ BẰNG ASCII ART — dùng nhiều lệnh say() liên tiếp
    // để tạo nhiều dòng OUTPUT. Không dạy escape sequence ở đảo phụ sau node01. ──
    {
      npc: "Bật mí một trò hay: mỗi lần gọi `say()` là một dòng OUTPUT mới. Xếp nhiều dòng `say()` liên tiếp, bạn sẽ VẼ được cả một bức tranh bằng chữ luôn (ASCII ART)!",
    },
    {
      code: 'from old_computer import say\n\nsay("  /\\\\_/\\\\")\nsay(" ( o.o )")\nsay("  > ^ <")\n',
      label: "io_ascii1.py",
      note: 'CHẠY THỬ\nBấm ▶ RUN và xem 3 dòng "mèo con" hiện lên trong khung kết quả. Mỗi dòng đến từ một lệnh `say()` riêng.',
      expectOut: { minLines: 3 },
      solution: 'from old_computer import say\n\nsay("  /\\\\_/\\\\")\nsay(" ( o.o )")\nsay("  > ^ <")\n',
    },
    {
      code: 'from old_computer import say\n\nsay("★ ★ ★")\nsay("★ ★ ★")\nsay("★ ★ ★")\n',
      label: "io_ascii2.py",
      note: "CHẠY THỬ\nCách khác để vẽ nhiều dòng: gọi say() 3 LẦN liên tiếp — mỗi lần say() là một dòng MỚI trong khung kết quả. Bấm RUN xem 3 dòng ★ xếp chồng lên nhau.",
      expectOut: { minLines: 3 },
      solution: 'from old_computer import say\n\nsay("★ ★ ★")\nsay("★ ★ ★")\nsay("★ ★ ★")\n',
    },
    {
      checkpoint: {
        text: 'Gọi `say()` NHIỀU LẦN liên tiếp sẽ tạo NHIỀU dòng OUTPUT — mỗi lệnh `say(...)` thêm một dòng mới vào khung kết quả.',
      },
    },
    {
      quiz: {
        title: "say() vẽ nhiều dòng",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nsay("A")\nsay("B")\n```\nMáy in ra mấy dòng, và dòng nào hiện trước?',
            a: ["2 dòng: A trước, rồi B ở dòng dưới", "1 dòng duy nhất: AB", "Không có OUTPUT nào cả"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\n# lượt của bạn: vẽ 1 hình ASCII ART của riêng bạn (3 dòng trở lên)\n# gợi ý: gọi say() nhiều lần liên tiếp, mỗi lần là một dòng\n',
      label: "io_ascii_write.py",
      note: "ĐỀ BÀI (tự làm — không chấm điểm)\nVẽ một hình ASCII ART của riêng bạn, ít nhất 3 dòng — ngôi sao, mặt cười, ngôi nhà, gì cũng được. Gọi `say()` nhiều lần liên tiếp, mỗi lần là một dòng.",
      expectOut: { minLines: 3 },
      solution: 'from old_computer import say\n\nsay("   /\\\\ ")\nsay("  /  \\\\")\nsay(" /____\\\\")\nsay(" |    |")\n',
    },

    // ── bài 4: soi lỗi trước khi RUN — dòng OUTPUT gõ sai tên biến ──
    {
      quiz: {
        title: "Soi lỗi trước khi RUN — io_fix1.py",
        questions: [
          {
            q: 'Đọc kỹ đoạn Mật Ngữ sau (chưa RUN):\n```python\nname = read("Tên bạn? ")   # dòng A — INPUT, lưu vào biến name\nsay("Xin chào, " + nam)     # dòng B — OUTPUT, nhưng gõ nhầm tên biến\n```\nDòng nào sẽ khiến máy báo lỗi khi RUN?',
            a: [
              "Dòng B — vì biến tên là `name` nhưng dòng B lại gọi `nam`, một biến CHƯA TỪNG được tạo",
              "Dòng A — vì read() luôn gây lỗi nếu người dùng gõ sai chính tả",
              "Không dòng nào lỗi cả, máy sẽ tự hiểu nam nghĩa là name",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " + nam)   # đang gõ SAI tên biến (nam thay vì name)\n',
      label: "io_fix1.py",
      note: "ĐỀ BÀI (sửa lỗi)\nSửa lại đúng tên biến ở dòng OUTPUT (nam → name) rồi RUN lại.",
      expectOut: /xin chào/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " + name)\n',
    },

    // ── bài 5: tự soi + tự viết ──
    {
      code: 'from old_computer import read, say\n\n# lượt của bạn: viết 1 dòng INPUT (đặt tên biến tuỳ ý) và 1 dòng OUTPUT dùng biến đó\n',
      label: "io_write1.py",
      note: "ĐỀ BÀI (tự làm)\nViết đúng 1 dòng INPUT (read()) và 1 dòng OUTPUT (say()) — OUTPUT phải dùng lại biến từ INPUT.",
      expectOut: { minLines: 1 },
      solution: 'from old_computer import read, say\n\nanswer = read("Bạn thích gì nhất? ")\nsay("Bạn thích nhất: " + answer)\n',
    },

    {
      remember:
        "Soi Mật Ngữ là tìm INPUT (read() — hiện câu hỏi và đọc phần bạn gõ) và OUTPUT (say() — máy in ra) trên TỪNG dòng, không đoán bừa theo số dòng hay theo thứ tự — một chương trình có thể có nhiều INPUT hơn OUTPUT, ít hơn, hoặc không có INPUT nào cả.",
    },
  ],
};
