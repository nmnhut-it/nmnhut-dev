// islandAR2.js — ĐẢO PHÉP CAMERA II, a bonus side-island (island.js, not
// node.js): a pure playground for the 5 NEW camera_charm screen filters
// (sepia/invert/grayscale/flip_mirror/shake_screen — added post-node07,
// pure-CSS "webcam filter" recipes, see casting.js's screenFx) — no new
// concept, just "chạy đi rồi xem màn hình đổi màu" with lightweight
// expectOut checks where the emitted effect name is stable.
// Gated unlockAt:8 (after node07 — while loop — is done) so the mini-project
// cell can reuse `while` + `watch()` exactly like node07's wait_high_five.py
// (a condition-based loop, NOT while-True/break — break is never taught).
// NOT part of the main saga trail (no `boss`, no `gift`, no `ritual`). Per
// PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary.
export default {
  index: -1,
  sideIslandId: "islandAR2",
  title: "ĐẢO PHÉP CAMERA II",
  subtitle: "5 hiệu ứng màn hình mới — sepia(), invert(), grayscale(), flip_mirror(), shake_screen() — ghép với vòng lặp while",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI HIỆU ỨNG MÁY ẢNH" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY HIỆU ỨNG SỐ 2",
    blurb: "một cỗ máy phụ chuyên đổi màu màn hình — không có quái lỗi nào ở đây cả",
  },
  modules: {
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO PHÉP CAMERA II ✦",
        hook: "Một hòn đảo nhỏ chỉ để CHƠI — không có quái lỗi, không bắt buộc phải ghé. camera_charm vừa có thêm 5 hiệu ứng màn hình mới toanh — đem ra chạy thử rồi ghép với vòng lặp while bạn mới học ở Vực Xoáy!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn quay lại! camera_charm vừa có thêm 5 lệnh đổi màu màn hình: sepia() làm màu vàng như ảnh cũ, invert() đảo ngược màu, grayscale() chuyển sang đen trắng, flip_mirror() bỏ chế độ soi gương, còn shake_screen() rung màn hình một cái. Chạy thử từng hiệu ứng nhé!",
    },

    // ── 5 hiệu ứng — mỗi cái một cell riêng, y hệt nhịp ar_watch.py/ar_fire.py cũ ──
    {
      code: "from camera_charm import sepia\n\nsepia()   # màn hình ngả vàng như ảnh cũ\n",
      label: "ar2_sepia.py",
      note: "CHẠY THỬ\nBấm ▶ RUN và xem màn hình ngả vàng như ảnh cũ.",
      expectOut: /sepia/i,
    },
    {
      code: "from camera_charm import invert\n\ninvert()   # mọi màu trên màn hình đảo ngược hết\n",
      label: "ar2_invert.py",
      note: "CHẠY THỬ\nBấm ▶ RUN — màu nào cũng bị đảo ngược, xanh hóa cam, đen hóa trắng.",
      expectOut: /invert/i,
    },
    {
      code: "from camera_charm import grayscale\n\ngrayscale()   # màn hình về đen trắng\n",
      label: "ar2_grayscale.py",
      note: "CHẠY THỬ\nBấm ▶ RUN — màn hình mất hết màu, chỉ còn đen trắng xám.",
      expectOut: /grayscale/i,
    },
    {
      code: "from camera_charm import flip_mirror\n\nflip_mirror()   # bỏ chế độ soi gương: tay phải hiện ở bên phải màn hình\n",
      label: "ar2_mirror.py",
      note: "CHẠY THỬ\nCamera đang để kiểu soi gương — bấm ▶ RUN để tay phải hiện đúng bên phải màn hình.",
      expectOut: /mirror/i,
    },
    {
      code: "from camera_charm import shake_screen\n\nshake_screen()   # rung một cái rồi thôi\n",
      label: "ar2_shake.py",
      note: "CHẠY THỬ\nBấm ▶ RUN — màn hình rung nhẹ một cái như động đất tí xíu, rồi đứng yên lại ngay.",
      expectOut: /shake/i,
    },

    {
      checkpoint: {
        text: "5 hiệu ứng mới (sepia/invert/grayscale/flip_mirror/shake_screen) đều là OUTPUT không cần input gì thêm — gọi lệnh là hiệu ứng chạy ngay, y như fire_vortex(). Hiệu ứng nào bật lúc nào là do luật mình viết, không phải camera tự chọn.",
      },
    },
    {
      quiz: {
        title: "5 hiệu ứng mới",
        questions: [
          {
            q: "Muốn màn hình về đen trắng, gọi lệnh nào?",
            a: ["`grayscale()`", "`invert()`", "`sepia()`"],
            correct: 0,
          },
          {
            q: "Muốn trả màn hình khỏi kiểu lật gương để bên phải thật nằm bên phải, gọi lệnh nào?",
            a: ["`flip_mirror()`", "`shake_screen()`", "`sepia()`"],
            correct: 0,
          },
        ],
      },
    },

    // ── mini-project: ghép while + watch() + if/elif để chọn hiệu ứng theo số ngón ──
    {
      npc: "Giờ ghép phép LẶP bạn học ở Vực Xoáy vào đây: một cỗ máy đổi màu liên tục. Cứ giơ tay là máy đổi hiệu ứng ngay, tới khi giơ ✋ 5 ngón thì vòng lặp mới dừng. Y hệt bài đợi dấu high-five ✋ ở node 7, chỉ khác là mỗi vòng còn đổi màu màn hình nữa!",
    },
    {
      code: 'from camera_charm import watch, sepia, invert, grayscale, flip_mirror, display\n\nfinger = watch()\nwhile finger < 5:\n    if finger == 1:\n        sepia()\n    elif finger == 3:\n        invert()\n    elif finger == 4:\n        grayscale()\n    finger = watch()\n\nflip_mirror()\ndisplay("XONG!")\n',
      label: "ar2_loop.py",
      note: "CHẠY THỬ\nGiơ 1 ngón (sepia), 3 ngón (invert), hoặc 4 ngón (grayscale) — máy đổi hiệu ứng ngay rồi hỏi lại. Giơ ✋ 5 ngón để máy dừng vòng lặp, trả màn hình về đúng chiều thật và hô XONG!",
      expectOut: /xong/i,
    },
    {
      checkpoint: {
        text: "`while finger < 5:` lặp lại chừng nào `finger` còn nhỏ hơn 5 — mỗi vòng gọi `watch()` một lần để đọc số ngón tay bạn vừa giơ, y hệt bài đợi dấu high-five ở node 7, chỉ thêm if/elif để chọn hiệu ứng theo số ngón.",
      },
    },
    {
      quiz: {
        title: "Vòng lặp đổi hiệu ứng",
        questions: [
          {
            q: "Trong ar2_loop.py, bạn giơ 3 ngón rồi 5 ngón. Máy làm gì theo đúng thứ tự?",
            a: [
              "`invert()` chạy trước, rồi vòng lặp dừng vì `finger = 5` không còn nhỏ hơn 5",
              "Máy dừng ngay từ ngón đầu tiên",
              "`invert()` và `flip_mirror()` chạy cùng lúc",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── xưởng sáng tạo tự do ──
    {
      npc: "Tới XƯỞNG SÁNG TẠO! Ô lệnh dưới đây đã có sẵn máy đổi màu — bạn tự thêm luật cho ngón còn lại, đổi thứ tự hiệu ứng, hoặc chế một máy đổi màu CỦA RIÊNG BẠN.",
    },
    {
      code: 'from camera_charm import watch, sepia, invert, grayscale, flip_mirror, shake_screen, display\n\nfinger = watch()\nwhile finger < 5:\n    if finger == 1:\n        sepia()\n    elif finger == 3:\n        invert()\n    elif finger == 4:\n        grayscale()\n    # xưởng của bạn — thêm luật riêng, hoặc gọi shake_screen() ở đâu đó cho vui\n    finger = watch()\n\nflip_mirror()\ndisplay("XONG!")\n',
      label: "ar2_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm, thử bao nhiêu lần cũng được. Vài gợi ý:\n" +
        "• THÊM SHAKE — gọi shake_screen() ngay khi đổi hiệu ứng, cho có cảm giác \"cạch\" đổi máy ảnh.\n" +
        "• ĐỔI MỐC DỪNG — thay `finger < 5` bằng mốc khác, xem máy phản ứng ra sao.\n" +
        "• BIỂU DIỄN LIÊN HOÀN — giơ tay lần lượt 1 → 3 → 4 → 1 → 5 để đổi màu liên tục như một màn trình diễn.",
    },

    {
      remember:
        "5 hiệu ứng mới (sepia/invert/grayscale/flip_mirror/shake_screen) chỉ là các OUTPUT gọi thẳng, không cần input — ghép chúng với `while` + `watch()` + if/elif là chế được một cỗ máy đổi màu sống động, giống bài đợi dấu high-five ✋ ở node 7.",
    },
  ],
};
