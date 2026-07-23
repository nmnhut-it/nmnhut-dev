// islandAR.js — ĐẢO PHÉP CAMERA, a bonus side-island (island.js, not node.js):
// a pure playground for every camera_charm toy taught by node04 (watch/
// display/fire_vortex/lighten/darken/photo_booth) — no new concept; light
// expectOut checks only where the camera effect reports a deterministic value.
// NOT part of the main saga trail (no `boss`, no `gift`, no `ritual` — the
// closing act is island.js's plain finish card). Per PEDAGOGY-METHOD.md this
// reuses ONLY already-taught vocabulary (no new concept — pure retrieval +
// practice); gated unlockAt:5 (after node04 is done) since photo_booth() is
// first used as a black box there (node04v2.js).
export default {
  index: -1,
  sideIslandId: "islandAR",
  title: "ĐẢO PHÉP CAMERA",
  subtitle: "chơi lại mọi lệnh của camera_charm — watch(), display(), fire_vortex(), lighten(), darken(), photo_booth()",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ CAMERA" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY PHÉP CAMERA",
    blurb: "một cỗ máy phụ để chơi lại phép camera — không có quái lỗi nào ở đây cả",
  },
  modules: {
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO PHÉP CAMERA ✦",
        hook: "Một hòn đảo nhỏ chỉ để CHƠI — không có quái lỗi, không bắt buộc phải ghé. Mang các lệnh camera_charm ra chạy lại, giơ tay lên và xem phép thật sự chạy trên máy của bạn!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Phép Camera! Ở đây không chấm điểm, không quái lỗi — chỉ có vài ô lệnh để bạn chạy lại từng lệnh camera_charm đã học và xem nó chạy thật trên camera của mình. Xong lúc nào cũng về được bản đồ.",
    },

    // ── watch() + display() ──
    {
      code: 'from camera_charm import watch, display\n\nfinger = watch()      # giơ tay, giữ yên cho máy đếm\ndisplay(finger)        # hiện số ngay trên màn hình AR\n',
      label: "ar_watch.py",
      note: "CHẠY THỬ\nGiơ vài số ngón tay khác nhau và giữ yên mỗi lần — xem số hiện lên màn hình AR đổi theo tay bạn.",
      expectOut: { 1: /1/, 2: /2/, 3: /3/, 4: /4/, 5: /5/ },
    },

    // ── fire_vortex() ──
    {
      code: "from camera_charm import fire_vortex\n\nfire_vortex()   # bụi phép tụ lại, xoáy thành vòng, rồi phóng lửa ngay\n",
      label: "ar_fire.py",
      note: "CHẠY THỬ\nBấm ▶ RUN và xem vòng xoáy lửa thật sự chạy trên màn hình.",
      expectOut: /fire/i,
    },

    // ── lighten() / darken() theo tay ──
    {
      code: 'from camera_charm import watch, lighten, darken\n\nfinger = watch()\n\nif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n',
      label: "ar_screen.py",
      note: "CHẠY THỬ\nGiơ 3 ngón để màn hình sáng lên, giơ 4 ngón để màn hình tối lại. Đổi số ngón rồi RUN lại để thử cả hai.",
      expectOut: { 3: /lighten/i, 4: /darken/i },
    },

    // ── kết hợp cả ba: input -> hai loại output cùng lúc ──
    {
      code: "from camera_charm import watch, display, fire_vortex\n\nfinger = watch()       # input — camera đọc số ngón tay\ndisplay(finger)         # output — hiện số trên màn hình AR\nfire_vortex()           # output — và phóng lửa luôn\n",
      label: "ar_combo.py",
      note: "TỰ CHỌN\nGiơ tay, giữ yên — máy vừa hiện số vừa phóng lửa cùng lúc. Đổi số ngón tay rồi RUN lại nhiều lần cho quen tay!",
      expectOut: /fire/i,
    },

    {
      checkpoint: {
        text: "Mỗi lệnh camera_charm là một OUTPUT khác nhau chạy từ CÙNG một INPUT `watch()`: display() hiện chữ, fire_vortex() phóng lửa, lighten()/darken() đổi màn hình — máy chọn output nào là do luật if/elif mình viết, không phải do camera.",
      },
    },
    {
      quiz: {
        title: "Một input, nhiều output",
        questions: [
          {
            q: 'Máy có `finger = watch()` rồi `if finger == 3: lighten()` và `elif finger == 4: darken()`. Bạn giơ 4 ngón tay — vì sao darken() chạy chứ không phải lighten()?',
            a: [
              "Vì `finger == 4` là điều kiện đúng đầu tiên máy gặp, nên darken() được chọn — watch() chỉ đọc số, không tự quyết định output",
              "Vì camera luôn ưu tiên darken() hơn lighten()",
              "Vì lighten() chỉ chạy khi không giơ tay nào cả",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── công thức mix & match #1: PHÉP CHỮ (display() chỉ hiện 1 dòng, nên
    // "ascii art" ở đây là chuỗi ký hiệu/mặt chữ ngắn, không phải tranh nhiều dòng) ──
    {
      npc: "Giờ thử vài CÔNG THỨC — mỗi công thức là một bảng luật cố định, việc của bạn là ĐIỀN TIẾP cho đủ luật rồi RUN kiểm tra bằng tay thật. Công thức đầu tiên: PHÉP CHỮ — mỗi số ngón hiện một ký hiệu khác nhau lên màn hình AR.",
    },
    {
      code: 'from camera_charm import watch, display\n\nfinger = watch()\n\n# CÔNG THỨC PHÉP CHỮ:\n#   1 ngón -> hiện "★"\n#   3 ngón -> hiện "♦♦♦"\n#   5 ngón -> hiện "(๑>ᴗ<๑)"\nif finger == 1:\n    display("★")\n# lượt của bạn: viết tiếp elif cho 3 ngón và 5 ngón\n',
      label: "ar_recipe1.py",
      note:
        "CÔNG THỨC PHÉP CHỮ (điền tiếp)\nBảng luật: 1 ngón → ★, 3 ngón → ♦♦♦, 5 ngón → (๑>ᴗ<๑). Mới có luật cho 1 ngón — viết tiếp 2 dòng `elif` còn thiếu cho đủ bảng rồi RUN, giơ tay kiểm tra từng số.",
      expectOut: { 1: /★/, 3: /♦♦♦/, 5: /\(๑>ᴗ<๑\)/ },
      solution:
        'from camera_charm import watch, display\n\nfinger = watch()\n\nif finger == 1:\n    display("★")\nelif finger == 3:\n    display("♦♦♦")\nelif finger == 5:\n    display("(๑>ᴗ<๑)")\n',
    },
    {
      quiz: {
        title: "Đọc bảng luật",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nif finger == 1:\n    display("★")\nelif finger == 3:\n    display("♦♦♦")\nelif finger == 5:\n    display("(๑>ᴗ<๑)")\n```\nNếu `watch()` đọc được 3 ngón, màn hình AR hiện gì?',
            a: ["`♦♦♦`", "`★`", "`(๑>ᴗ<๑)`"],
            correct: 0,
          },
        ],
      },
    },

    // ── công thức mix & match #2: ĐÈN SÂN KHẤU (lighten/darken/fire_vortex) ──
    {
      code: "from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\n# CÔNG THỨC ĐÈN SÂN KHẤU:\n#   1 ngón -> phun lửa\n#   3 ngón -> đèn sáng\n#   4 ngón -> đèn tắt\nif finger == 1:\n    fire_vortex()\n# lượt của bạn: viết tiếp elif cho 3 ngón và 4 ngón\n",
      label: "ar_recipe2.py",
      note:
        "CÔNG THỨC ĐÈN SÂN KHẤU (điền tiếp)\nBảng luật: 1 ngón → lửa, 3 ngón → đèn sáng, 4 ngón → đèn tắt. Viết tiếp 2 dòng `elif` còn thiếu rồi RUN, đổi số ngón nhiều lần để thử cả ba luật.",
      expectOut: { 1: /fire/i, 3: /lighten/i, 4: /darken/i },
      solution:
        "from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n",
    },
    {
      checkpoint: {
        text: "Một chuỗi `if`/`elif` chỉ chạy nhánh có điều kiện khớp. Nếu không có nhánh nào khớp, máy không tự chạy lệnh khác.",
      },
    },
    {
      quiz: {
        title: "Không có luật khớp",
        questions: [
          {
            q: 'Bảng luật là:\n```python\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n```\nNếu `watch()` đọc được 2 ngón, máy làm gì?',
            a: ["Không lệnh nào trong bảng chạy, vì 2 không khớp 1, 3, hay 4", "`fire_vortex()` chạy vì 2 gần 1", "`darken()` chạy vì đó là dòng cuối"],
            correct: 0,
          },
        ],
      },
    },

    // ── finale: photo_booth() ──
    {
      code: "from camera_charm import photo_booth\n\nphoto_booth()         # ✋ rải bụi · ☝ xoáy vòng · ✌ chụp hình!\n",
      label: "ar_booth.py",
      note: "MÁY CHỤP HÌNH\n✋ 5 ngón để bụi phép rải ra, ☝ 1 ngón để bụi xoáy vòng, ✌ 2 ngón để CHỤP một tấm hình phép — tải về giữ làm kỷ niệm luôn!",
      expectOut: /capture/i,
    },

    // ── xưởng sáng tạo tự do: một ô trắng, tự đặt công thức của riêng mình ──
    {
      npc: "Giờ tới XƯỞNG SÁNG TẠO của riêng bạn! Ô lệnh dưới đây trống trơn, không có đáp án đúng-sai — bạn tự ĐẶT một công thức riêng (số ngón nào làm gì) rồi viết luật if/elif cho đúng công thức đó. Nếu bí ý tưởng, đọc mấy gợi ý bên dưới rồi thử xem!",
    },
    {
      code: "from camera_charm import watch, display, fire_vortex, lighten, darken, photo_booth\n\n# xưởng của bạn — tự đặt công thức rồi viết luật ở đây\nfinger = watch()\n",
      label: "ar_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài công thức gợi ý nếu bạn chưa biết bắt đầu từ đâu:\n" +
        "• CÔNG THỨC BÍ MẬT — tự đặt bảng luật riêng (VD: 1 ngón → fire_vortex(), 3 ngón → lighten(), 4 ngón → darken(), 5 ngón → display(\"PIP\")). Đố bạn bè đoán công thức của bạn!\n" +
        "• PHÉP CHỮ CỦA RIÊNG BẠN — tự nghĩ ký hiệu khác cho từng số ngón (VD: 2 ngón → \"^_^\", 4 ngón → \"><>< \"), thay cho ★/♦♦♦ ở công thức mẫu.\n" +
        "• ẢNH CÓ LỬA — gọi fire_vortex() một lần rồi mới photo_booth() trong chính ô này để chụp lúc lửa còn đang cháy nền.\n" +
        "• BIỂU DIỄN CHO BẠN BÈ — ghép nhiều công thức thành một \"đoạn code trình diễn\", giơ tay theo thứ tự để kể một câu chuyện bằng phép.",
    },

    {
      remember:
        "Đảo Phép Camera không có bài chấm điểm — chỉ có chỗ để ghép công thức (bảng luật if/elif) và chơi lại phép camera_charm bao nhiêu lần cũng được, kể cả tự đặt công thức riêng. Càng chơi tay càng quen, càng quen thì tới đảo tiếp theo càng dễ.",
    },
  ],
};
