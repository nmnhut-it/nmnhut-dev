// islandBRANCH.js — ĐẢO NHÁNH RẼ, a bonus side-island (island.js, not node.js):
// extra reps for node04/node05's vocabulary (if/elif/else with camera_charm's
// watch()/fire_vortex()/lighten()/darken()/freeze()/display()). Written after
// review-nodes.txt flagged that if/elif/else gets INTRODUCED across node04/05
// but never gets enough "predict the branch → run → confirm" reps for a kid
// to use it flexibly — this island is that missing drill set, not new
// content. Per PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary
// (no new concept — pure retrieval + practice). Gated unlockAt:6 (after
// node05 — else — is done, since drills need if/elif/else all three).
export default {
  index: -1,
  sideIslandId: "islandBRANCH",
  title: "ĐẢO NHÁNH RẼ",
  subtitle: "luyện thêm if/elif/else — đoán nhánh nào chạy trước khi RUN",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ CHỌN NHÁNH" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY LUYỆN NHÁNH RẼ",
    blurb: "một cỗ máy phụ để luyện if/elif/else — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO NHÁNH RẼ ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Ai muốn luyện tay cho quen if/elif/else, đoán trước nhánh nào chạy, thì cứ ghé qua!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Nhánh Rẽ! Bạn đã học if, elif, else rồi — ở đây mình sẽ luyện thêm: đọc luật, ĐOÁN xem nhánh nào chạy, rồi mới RUN kiểm tra lại. Làm xong lúc nào bạn cũng về được bản đồ.",
    },

    // ── bài 1: đoán nhánh khớp elif, KHÔNG rơi xuống else ──
    {
      quiz: {
        title: "Đoán nhánh — branch1.py",
        questions: [
          {
            q: 'Đọc kỹ luật sau (chưa RUN):\n```python\nfinger = 3\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n```\n`finger` đang là 3 — máy hiện gì?',
            a: ["LỬA", "SÁNG", "BĂNG"],
            correct: 1,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import display\n\nfinger = 3\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
      label: "branch1.py",
      note: "RUN KIỂM CHỨNG\nBấm ▶ RUN xem có đúng như bạn vừa đoán không.",
      expectOut: /sáng/i,
      solution: 'from camera_charm import display\n\nfinger = 3\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
    },

    // ── bài 2: input không khớp if/elif nào → rơi xuống else ──
    {
      quiz: {
        title: "Rơi xuống else — branch2.py",
        questions: [
          {
            q: 'Cùng luật đó, nhưng lần này `finger = 5`:\n```python\nfinger = 5\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n```\nMáy hiện gì?',
            a: ["LỬA", "SÁNG", "BĂNG — vì 5 không khớp if hay elif nào, nên rơi xuống else"],
            correct: 2,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import display\n\nfinger = 5\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
      label: "branch2.py",
      note: "RUN KIỂM CHỨNG\nBấm ▶ RUN xem `finger = 5` có rơi xuống else như bạn đoán không.",
      expectOut: /băng/i,
      solution: 'from camera_charm import display\n\nfinger = 5\nif finger == 1:\n    display("LỬA")\nelif finger == 3:\n    display("SÁNG")\nelse:\n    display("BĂNG")\n',
    },
    {
      checkpoint: {
        text: "Máy kiểm tra từng nhánh `if`/`elif` theo thứ tự; hễ điều kiện nào đúng trước, máy chạy nhánh đó rồi dừng, bỏ qua hết các nhánh phía dưới. Chỉ khi không nhánh `if`/`elif` nào khớp, máy mới rơi xuống `else`.",
      },
    },
    {
      quiz: {
        title: "Máy dừng ở nhánh đúng đầu tiên",
        questions: [
          {
            q: 'Có `if finger == 5:` rồi `elif finger == 5:` — nếu `finger = 5`, nhánh nào chạy?',
            a: ["Nhánh if — máy dừng ngay khi gặp điều kiện khớp đầu tiên, không xét elif phía dưới nữa", "Nhánh elif", "Cả hai nhánh cùng chạy"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 3: sửa lỗi — elif finger == 5 nhầm tưởng là "còn lại", thật ra else mới đúng ──
    {
      quiz: {
        title: "Soi lỗi trước khi RUN — branch_fix1.py",
        questions: [
          {
            q: 'Luật MUỐN VIẾT: "1 ngón phóng lửa, còn lại đều đóng băng". Code lại viết:\n```python\nif finger == 1:\n    fire_vortex()\nelif finger == 5:\n    freeze()\n```\nNếu giơ 4 ngón (không phải 1 và không phải 5), chuyện gì xảy ra?',
            a: [
              "Không luật nào khớp — máy im ru, dù luật MUỐN nói \"còn lại đều đóng băng\"",
              "Máy tự hiểu 4 gần 5 nên vẫn đóng băng",
              "Máy báo lỗi vì thiếu luật cho số 4",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import fire_vortex, freeze\n\nfinger = 4\n\n# LUẬT MUỐN: 1 ngón phóng lửa, CÒN LẠI đều đóng băng\nif finger == 1:\n    fire_vortex()\nelif finger == 5:\n    freeze()   # sai — chỉ bắt đúng số 5, không bắt "còn lại"\n',
      label: "branch_fix1.py",
      note: "ĐỀ BÀI (sửa lỗi)\nLuật muốn nói \"còn lại đều đóng băng\" nhưng `elif finger == 5:` chỉ bắt đúng số 5. Sửa dòng đó thành `else:` để bắt HẾT các trường hợp còn lại.",
      expectOut: /freeze/i,
      solution: 'from camera_charm import fire_vortex, freeze\n\nfinger = 4\n\nif finger == 1:\n    fire_vortex()\nelse:\n    freeze()\n',
    },
    {
      checkpoint: {
        text: "`elif finger == 5:` CHỈ bắt đúng số 5 — nó vẫn là một điều kiện riêng, không phải \"mọi trường hợp còn lại\". Muốn bắt HẾT phần còn lại (bất kể số nào), phải dùng `else:` không kèm điều kiện.",
      },
    },
    {
      quiz: {
        title: "elif == 5 khác với else",
        questions: [
          {
            q: 'Vì sao `elif finger == 5:` không thể thay cho `else:` nếu muốn bắt "mọi trường hợp còn lại"?',
            a: [
              "Vì `elif finger == 5:` chỉ đúng khi finger đúng bằng 5 — các số khác (2, 4, 6...) vẫn không khớp và bị bỏ qua",
              "Vì elif và else là một, viết gì cũng được",
              "Vì elif luôn chạy trước else nên không cần else nữa",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 4: tự viết luật 3 nhánh, camera thật ──
    {
      code: 'from camera_charm import watch, fire_vortex, lighten, darken\n\n# lượt của bạn — viết luật: 1 ngón phóng lửa, 3 ngón sáng đèn, còn lại tối đèn\nfinger = watch()\n',
      label: "branch_write1.py",
      note: "ĐỀ BÀI (tự làm, camera thật)\nGiơ tay và viết luật: 1 ngón → fire_vortex(), 3 ngón → lighten(), còn lại (mọi số khác) → darken(). Dùng if/elif/else.",
      expectOut: { 1: /fire/i, 2: /darken/i, 3: /lighten/i, 4: /darken/i, 5: /darken/i },
      solution: 'from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelse:\n    darken()\n',
    },

    // ── bài 5: dùng display() để tự soi kết quả nhánh nào chạy ──
    {
      npc: "Mẹo hay khi luyện nhánh rẽ: thêm `display(...)` vào MỖI nhánh để tự mắt thấy nhánh nào vừa chạy — không cần đoán mò nữa!",
    },
    {
      code: 'from camera_charm import watch, display, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    display("NHÁNH IF")\n    fire_vortex()\nelif finger == 3:\n    display("NHÁNH ELIF")\n    lighten()\nelse:\n    display("NHÁNH ELSE")\n    darken()\n',
      label: "branch_show.py",
      note: "CHẠY THỬ\nGiơ tay đủ 3 lần khác nhau (1 ngón, 3 ngón, số khác) — nhìn chữ hiện lên để biết chắc mình vừa rơi vào nhánh nào.",
      expectOut: { 1: /NHÁNH IF/i, 2: /NHÁNH ELSE/i, 3: /NHÁNH ELIF/i, 4: /NHÁNH ELSE/i, 5: /NHÁNH ELSE/i },
      solution: 'from camera_charm import watch, display, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    display("NHÁNH IF")\n    fire_vortex()\nelif finger == 3:\n    display("NHÁNH ELIF")\n    lighten()\nelse:\n    display("NHÁNH ELSE")\n    darken()\n',
    },
    {
      checkpoint: {
        text: "Thêm `display(...)` (hoặc `say(...)`) đầu mỗi nhánh là cách tự kiểm tra logic if/elif/else của mình — chạy xong nhìn chữ hiện lên là biết ngay nhánh nào vừa được chọn, không cần đoán mò.",
      },
    },
    {
      quiz: {
        title: "Tự soi nhánh bằng display()",
        questions: [
          {
            q: 'Đọc luật sau:\n```python\nfinger = 4\nif finger == 1:\n    display("NHÁNH IF")\nelif finger == 3:\n    display("NHÁNH ELIF")\nelse:\n    display("NHÁNH ELSE")\n```\nVì 4 không khớp 1 hay 3, màn hình hiện chữ gì?',
            a: ["NHÁNH IF", "NHÁNH ELIF", "NHÁNH ELSE"],
            correct: 2,
          },
        ],
      },
    },

    {
      remember:
        "Với `if`/`elif`/`else`, nhớ ba luật: máy kiểm tra các nhánh từ trên xuống; gặp điều kiện đúng đầu tiên thì chạy nhánh đó rồi bỏ phần còn lại; nếu không có `if`/`elif` nào khớp, máy mới chạy `else`. `else` không có điều kiện riêng.",
    },
  ],
};
