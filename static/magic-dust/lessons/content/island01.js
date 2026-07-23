// island01.js — ĐẢO LUYỆN CHỮ, a bonus side-island (island.js, not node.js):
// extra reps for node01/node01v2's vocabulary (say/read/chuỗi/biến/ghép +).
// NOT part of the main saga trail (no `boss`, no `gift`, no `ritual` — the
// closing act is island.js's plain finish card). Optional for a kid who
// wants more practice before moving on; per PEDAGOGY-METHOD.md this reuses
// ONLY already-taught vocabulary (no new concept — pure retrieval + practice).
export default {
  index: -1,
  sideIslandId: "island01",
  title: "ĐẢO LUYỆN CHỮ",
  subtitle: "luyện thêm read(), say(), chuỗi, và ghép chữ bằng dấu +",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ LUYỆN TẬP" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY LUYỆN CHỮ",
    blurb: "một cỗ máy phụ để luyện thêm — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO LUYỆN CHỮ ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Nhưng ai thích luyện tay cho quen `read()`, `say()`, chuỗi và dấu `+` thì cứ ghé qua, càng luyện càng chắc!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Luyện Chữ! Ở đây không có quái lỗi để đánh đâu — chỉ có vài bài tập nhỏ để tay bạn quen với `read()`, `say()` và ghép chuỗi bằng dấu `+`. Làm xong lúc nào bạn cũng về được bản đồ, không ép buộc.",
    },

    // ── bài 1: đọc-đoán-output (dùng biến + ghép chữ, y hệt vốn từ node01) ──
    {
      code: 'from old_computer import say\n\ncity = "Đà Lạt"\nsay("Mình đang ở " + city + " nè!")\n',
      label: "island_predict1.py",
      note: "ĐỀ BÀI (đoán trước khi RUN)\nĐoán xem máy sẽ in ra CÂU GÌ trước, rồi bấm ▶ RUN kiểm tra lại.",
      expectOut: /mình đang ở đà lạt nè/i,
      solution: 'from old_computer import say\n\ncity = "Đà Lạt"\nsay("Mình đang ở " + city + " nè!")\n',
    },
    {
      quiz: {
        title: "Đoán output",
        questions: [
          {
            q: 'Nếu đổi `city = "Đà Lạt"` thành `city = "Huế"`, dòng `say("Mình đang ở " + city + " nè!")` sẽ in ra gì?',
            a: ["Mình đang ở Huế nè!", "Mình đang ở city nè!", "Mình đang ở Đà Lạt nè!"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: sửa lỗi (biến gõ sai tên — lỗi thật hay gặp) ──
    {
      code: 'from old_computer import say\n\nfruit = "xoài"\nsay("Tôi thích ăn " + frut + "!")   # đang gõ SAI tên biến — sửa lại cho đúng\n',
      label: "island_fix1.py",
      note: 'ĐỀ BÀI (sửa lỗi)\nĐoạn này đang gõ sai tên biến (`frut` thay vì `fruit`) nên máy sẽ báo lỗi. Sửa lại đúng tên biến rồi RUN lại.',
      expectOut: /tôi thích ăn xoài/i,
      solution: 'from old_computer import say\n\nfruit = "xoài"\nsay("Tôi thích ăn " + fruit + "!")\n',
    },

    // ── bài 3: tự viết — ghép biến do bạn tạo ──
    {
      code: 'from old_computer import say\n\n# lượt của bạn: tạo 1 biến pet chứa tên con vật bạn thích, rồi say() một câu ghép có dùng pet\npet = "..."\nsay("...")\n',
      label: "island_write1.py",
      note: "ĐỀ BÀI (tự làm)\nTạo biến `pet` (tên con vật bạn thích), rồi `say(...)` một câu có ghép biến `pet` vào bằng dấu +.",
      expectOut: { minLines: 1 },
      solution: 'from old_computer import say\n\npet = "mèo"\nsay("Con vật mình thích là " + pet + "!")\n',
    },

    // ── bài 4: read() + ghép nhiều biến (thẻ tên mini, khác input node01) ──
    {
      code: 'from old_computer import read, say\n\ncolor = read("Màu bạn thích? ")   # input\nsay("Màu " + color + " nhìn đẹp thiệt đó!")   # process (ghép) + output\n',
      label: "island_read1.py",
      note: "ĐỀ BÀI\nINPUT thật: dòng `color = read(...)` đọc màu bạn nhập và gán vào biến `color`.\nViệc cần làm: ghép \"Màu \" + color + \" nhìn đẹp thiệt đó!\".\nOUTPUT: máy in câu khen có dùng đúng màu vừa nhập.",
      expectOut: /màu\s+\S+.*đẹp thiệt đó/i,
      solution: 'from old_computer import read, say\n\ncolor = read("Màu bạn thích? ")\nsay("Màu " + color + " nhìn đẹp thiệt đó!")\n',
    },
    {
      quiz: {
        title: "read() với say()",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\ncolor = read("Màu bạn thích? ")\nsay("Màu " + color + " nhìn đẹp thiệt đó!")\n```\nNếu bạn gõ "xanh lá" khi máy hỏi, OUTPUT là gì?',
            a: ["Màu xanh lá nhìn đẹp thiệt đó!", "Màu color nhìn đẹp thiệt đó!", "xanh lá"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 5: ghép nhiều mảnh cùng lúc (2 biến input, giống node01 nhưng đề khác) ──
    {
      code: 'from old_computer import read, say\n\nfood = read("Món ăn bạn thích? ")       # input\ndrink = read("Nước uống bạn thích? ")   # input\n# lượt của bạn: say  "Bữa mơ ước: <food> và <drink>!"\n# gợi ý: ghép các mảnh chữ bằng dấu +\n',
      label: "island_write2.py",
      note: "ĐỀ BÀI\nINPUT thật: hai dòng `read(...)` đọc món ăn vào `food` và nước uống vào `drink`.\nViệc cần làm: ghép nhiều mảnh chữ bằng dấu `+`.\nOUTPUT: in đúng câu `Bữa mơ ước: <food> và <drink>!` với hai giá trị vừa nhập.",
      expectOut: /bữa mơ ước/i,
      solution: 'from old_computer import read, say\n\nfood = read("Món ăn bạn thích? ")       # input\ndrink = read("Nước uống bạn thích? ")   # input\nsay("Bữa mơ ước: " + food + " và " + drink + "!")\n',
    },

    // ── bài 6: sửa lỗi (thiếu dấu + giữa hai mảnh chuỗi — lỗi thật hay gặp) ──
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " name "!")   # đang THIẾU dấu + giữa các mảnh\n',
      label: "island_fix2.py",
      note: "ĐỀ BÀI (sửa lỗi)\nĐoạn này đang thiếu dấu `+` để nối các mảnh chuỗi lại — máy sẽ báo lỗi ngay khi RUN. Thêm đúng 2 dấu `+` còn thiếu rồi RUN lại.",
      expectOut: /xin chào/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " + name + "!")\n',
    },

    // ── bài 7: input không dùng tới — dễ nhầm "input nào cũng phải xuất hiện ở output" ──
    {
      code: 'from old_computer import read, say\n\nfavorite = read("Món ăn bạn thích nhất? ")   # input — nhưng CHƯA CHẮC dùng tới\nsay("Cảm ơn bạn đã ghé Đảo Luyện Chữ!")        # output — không hề nhắc tới favorite\n',
      label: "island_predict2.py",
      note: 'ĐỀ BÀI (đoán trước khi RUN)\nDù bạn gõ gì vào ô hỏi "Món ăn bạn thích nhất?", máy sẽ in ra CÂU GÌ? (Để ý: biến favorite có được dùng trong say() không?)',
      expectOut: /cảm ơn bạn đã ghé đảo luyện chữ/i,
      solution: 'from old_computer import read, say\n\nfavorite = read("Món ăn bạn thích nhất? ")\nsay("Cảm ơn bạn đã ghé Đảo Luyện Chữ!")\n',
    },
    {
      quiz: {
        title: "Input không dùng tới vẫn hợp lệ",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nfavorite = read("Món ăn bạn thích nhất? ")\nsay("Cảm ơn bạn đã ghé Đảo Luyện Chữ!")\n```\nĐoạn này có đọc INPUT không, và OUTPUT có thay đổi theo INPUT đó không?',
            a: [
              "Có đọc INPUT, nhưng OUTPUT luôn giống nhau vì `say()` không hề dùng biến `favorite`",
              "Không đọc INPUT vì `read()` không xuất hiện trong đoạn Mật Ngữ",
              "OUTPUT sẽ đổi theo favorite vì mọi INPUT đều phải ảnh hưởng tới OUTPUT",
            ],
            correct: 0,
          },
        ],
      },
    },

    {
      checkpoint: {
        text: 'Ghép chuỗi bằng dấu `+` hoạt động với BAO NHIÊU mảnh cũng được, và các mảnh có thể là chữ cố định `"..."` xen với biến — máy chỉ nối chúng lại theo đúng thứ tự viết trong đoạn Mật Ngữ. Và một biến từ INPUT không BẮT BUỘC phải xuất hiện trong OUTPUT — máy vẫn chạy đúng, chỉ là biến đó không được dùng tới.',
      },
    },
    {
      quiz: {
        title: "Ghép nhiều mảnh",
        questions: [
          {
            q: 'Cho `a = "A"`, `b = "B"`. Dòng `say(a + "-" + b)` in ra gì?',
            a: ["A-B", "a-b", "ab"],
            correct: 0,
          },
          {
            q: "Ghép chuỗi bằng dấu + có giới hạn số mảnh được ghép không?",
            a: ["Không — ghép bao nhiêu mảnh cũng được, miễn viết đúng thứ tự", "Có, tối đa 2 mảnh", "Có, tối đa 3 mảnh"],
            correct: 0,
          },
        ],
      },
    },

    {
      remember:
        "Luyện thêm không bắt buộc — nhưng mỗi lần ghép chuỗi thành thạo hơn, `read()`, `say()` và dấu `+` sẽ càng quen tay hơn ở những đảo tiếp theo.",
    },
  ],
};
