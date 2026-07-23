// node03v2.js — PEDAGOGY V2 CLONE of node03.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson03v2.html, also reachable via dev-test.html?src=node03v2.
// `index` matches node03.js (3) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node03.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file started as the narrower badge-only clone. It is
// now the live map target and has been polished for shorter setup, stronger
// practice, and a small mini-project before the forge/boss arc.
export default {
  index: 3,
  title: "Input and Output",
  subtitle: "INPUT biết thay đổi — cỗ máy này NHÌN thấy tay bạn",
  bundle: {
    art: "assets/future-packet.webp",
    name: "FUTURE PACKET",
  },
  machine: {
    art: "assets/future-machine.webp",
    name: "FUTURE MACHINE",
    blurb: "camera vào · phép hiện ra",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      npc: "Chào mừng tới cỗ máy tương lai! Trước khi đánh thức camera, Pip kiểm tra lại mấy thứ bạn đã biết: biến, số, và lệnh in số ra màn hình.",
    },
    {
      quiz: {
        title: "Ôn lại bài cũ",
        questions: [
          {
            q: "Biến `weather = \"nắng\"`, sau đó bạn gán lại `weather = \"mưa\"` — giá trị của `weather` bây giờ là gì?",
            a: [
              "nắng",
              "mưa",
              "cả hai",
            ],
            correct: 1,
          },
          {
            q: "Muốn hỏi rồi nhận một SỐ để tính toán (không phải chuỗi), dùng lệnh nào?",
            a: [
              "`read()`",
              "`read_num()`",
              "`say()`",
            ],
            correct: 1,
          },
          {
            q: "`say_num(9)` sẽ làm gì?",
            a: [
              "In ra số 9",
              "Hỏi người dùng nhập số 9",
              "Cộng thêm 9 vào biến",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Mắt máy còn đang ngủ, nên mình tập trước bằng một con số GIẢ. `finger` chỉ là một biến bình thường: cất một số, rồi đưa số đó cho `say_num()` in ra.",
    },
    {
      code: `from old_computer import say_num

finger = 3      # ← số giả, chưa có camera — đổi thử số khác rồi RUN lại
say_num(finger)
`,
      label: "finger_var.py",
      note: `ĐỀ BÀI (bài mẫu)
Bấm RUN xem máy in ra 3 trước đã — rồi thử đổi 3 thành số khác và RUN lại, số in ra sẽ đổi theo.`,
      expectOut: /^\d+$/,
      solution: 'from old_computer import say_num\n\nfinger = 3\nsay_num(finger)\n',
    },
    {
      code: `from old_computer import say_num

finger = 3      # lượt của bạn — đổi thành 4
say_num(finger)
`,
      label: "finger_practice.py",
      note: "ĐỀ BÀI\nĐổi số 3 thành 4 rồi RUN. Máy phải in ra 4, vì `say_num(finger)` lấy giá trị hiện tại trong biến.",
      expectOut: /^4$/,
      solution: 'from old_computer import say_num\n\nfinger = 4\nsay_num(finger)\n',
    },
    {
      checkpoint: {
        text: "`finger` là một biến bình thường — gán số vào, đổi số, rồi `say_num(finger)` in ra giá trị hiện tại, y hệt mọi biến bạn đã dùng, chỉ khác cái TÊN.",
      },
    },
    {
      quiz: {
        title: "Vẫn chỉ là một cái hộp",
        questions: [
          {
            q: "`finger = 4`, rồi chạy `say_num(finger)` — máy in ra gì?",
            a: [
              "finger",
              "4",
              "báo lỗi",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Tập trên giấy xong rồi — giờ đánh thức con mắt thật của cỗ máy nào. Tặng bạn nè —",
    },
    {
      gift: {
        art: "assets/photo-charm.webp",
        name: "CAMERA CHARM",
        blurb: "con mắt của cỗ máy — dùng để đếm số ngón tay của bạn",
      },
    },
    {
      npc: "CAMERA CHARM — mắt máy đã tỉnh giấc rồi! Lệnh mới là `watch()`: nó chờ tay bạn đứng yên, đếm số ngón tay, rồi trả về con số đó.",
    },
    {
      npc: "Vì `watch()` trả về một số, mình cất số đó vào `finger` y hệt `finger = 3`. Khác ở chỗ lần này con số đến từ camera thật.",
    },
    {
      code: `from old_computer import say_num
from camera_charm import watch

finger = watch()      # input — máy NHÌN camera, trả về số ngón tay THẬT
say_num(finger)        # output — in đúng số đó ra
`,
      label: "watch_print.py",
      note: "giơ 1, rồi 3, rồi 5 ngón tay — mỗi lần giữ yên rồi RUN",
      expect: [
        1,
        3,
        5,
      ],
      expectOut: {
        "1": /^1$/,
        "3": /^3$/,
        "5": /^5$/,
      },
      solution: 'from old_computer import say_num\nfrom camera_charm import watch\n\nfinger = watch()\nsay_num(finger)\n',
    },
    {
      checkpoint: {
        text: "`watch()` là INPUT thật — gọi nó sẽ TRẢ VỀ số ngón tay đếm được qua camera; chương trình chỉ IN nó ra bằng `say_num()`, chưa cần quyết định gì thêm.",
      },
    },
    {
      quiz: {
        title: "Tay thật",
        questions: [
          {
            q: "Khi bạn giơ 2 ngón tay trước camera — cỗ máy dùng lệnh nào để đọc camera?",
            a: [
              "`watch()`",
              "`say()`",
              "`fire_vortex()`",
            ],
            correct: 0,
          },
          {
            q: "Trong bài `watch_print.py`, nếu `watch()` đọc được 3 rồi dòng `say_num(finger)` chạy, máy in ra gì?",
            a: [
              "3",
              "finger",
              "fire",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ đổi OUTPUT từ console sang màn hình AR. `display(finger)` hiện giá trị của `finger` ngay trên camera — giống `say_num(finger)`, nhưng không nằm trong console.",
    },
    {
      code: `from camera_charm import watch, display

finger = watch()       # input
display(finger)         # output — hiện số ngón tay ngay trên màn hình AR
`,
      label: "display_finger.py",
      note: "giơ 1, rồi 4 ngón tay, giữ yên rồi RUN",
      expect: [
        1,
        4,
      ],
      expectOut: {
        "1": /^1$/,
        "4": /^4$/,
      },
      solution: 'from camera_charm import watch, display\n\nfinger = watch()\ndisplay(finger)\n',
    },
    {
      npc: "`fire_vortex()` là một OUTPUT khác: chạy tới dòng đó là bụi phép tụ lại và phóng lửa ngay, không cần đọc thêm input.",
    },
    {
      code: `from camera_charm import fire_vortex

fire_vortex()   # output — chạy dòng này là phóng lửa NGAY, không cần điều kiện gì
`,
      label: "always_fire.py",
      note: "RUN xem — không cần giơ tay gì cả, máy phóng lửa liền",
      expectOut: /fire/i,
      solution: 'from camera_charm import fire_vortex\n\nfire_vortex()\n',
    },
    {
      checkpoint: {
        text: "OUTPUT không chỉ là chữ trong console: `display(finger)` hiện số lên màn hình AR, còn `fire_vortex()` tạo hiệu ứng lửa ngay khi dòng đó chạy.",
      },
    },
    {
      quiz: {
        title: "Hiện lên màn hình",
        questions: [
          {
            q: "Muốn số ngón tay hiện NGAY trên màn hình AR (không phải chỉ in ra console), dùng lệnh nào?",
            a: [
              "`say_num()`",
              "`display()`",
              "`watch()`",
            ],
            correct: 1,
          },
          {
            q: "Nếu `finger = 4` rồi chạy `display(finger)`, số 4 xuất hiện ở đâu?",
            a: [
              "Trên màn hình AR/camera",
              "Trong tên biến `finger`",
              "Trong câu hỏi của `read()`",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "🖥️",
        name: "HUY HIỆU HIỆN HÌNH",
        blurb: "phần thưởng cho việc hiểu OUTPUT của cỗ máy tương lai: `display()` hiện chữ/số ngay trên màn hình AR, không chỉ trong console.",
        badge: true,
        badgeId: "huy_hieu_hien_hinh",
      },
    },
    {
      npc: "XƯỞNG PHÉP nhỏ: làm một bảng tay AR. Máy đọc số ngón bằng camera, in nhãn trong console, rồi bạn tự hiện con số lên màn hình.",
    },
    {
      code: `from camera_charm import watch, display
from old_computer import say

finger = watch()
say("BẢNG TAY:")
# lượt của bạn — hiện giá trị của finger lên màn hình AR
`,
      label: "xuong_phep_bang_tay.py",
      note: "ĐỀ BÀI\nGiơ 4 ngón tay, giữ yên, rồi hoàn thành dòng cuối bằng `display(finger)`. Kết quả cần có nhãn BẢNG TAY và số 4 hiện lên.",
      expect: 4,
      expectOut: { all: [/BẢNG TAY/i, /^4$/] },
      solution: 'from camera_charm import watch, display\nfrom old_computer import say\n\nfinger = watch()\nsay("BẢNG TAY:")\ndisplay(finger)\n',
    },
    {
      npc: "Máy tương lai còn biết PHÓNG LỬA nữa! Thử bài MẬT NGỮ này: watch() đọc số ngón tay, display() hiện số đó lên màn hình AR, rồi fire_vortex() phóng lửa luôn — cả ba chạy liền một mạch.",
    },
    {
      code: `from camera_charm import watch, display, fire_vortex

finger = watch()       # input — giơ ✋ 5 ngón, giữ yên cho máy đếm
display(finger)         # output — hiện số ngón tay trên màn hình AR
fire_vortex()           # output — và phóng lửa luôn, không cần hỏi gì thêm
`,
      label: "mat_ngu_ket_lieu.py",
      note: `ĐỀ BÀI (bài mẫu)
Giơ ✋ 5 ngón, giữ yên cho máy đếm — không cần sửa gì, chỉ cần RUN.
INPUT: watch() đọc số ngón tay
OUTPUT: display() hiện số lên màn hình AR, fire_vortex() phóng lửa`,
      expect: 5,
      expectOut: {
        all: [
          /5/,
          /fire/i,
        ],
      },
      solution: 'from camera_charm import watch, display, fire_vortex\n\nfinger = watch()\ndisplay(finger)\nfire_vortex()\n',
    },
    {
      checkpoint: {
        text: "`watch()` là INPUT thật từ camera (đếm ngón tay), còn `display()`/`fire_vortex()` là OUTPUT thật lên màn hình AR — khác `say()`/`say_num()` vốn chỉ in ra console.",
      },
    },
    {
      quiz: {
        title: "Input/Output camera",
        questions: [
          {
            q: "`display(finger)` khác `say_num(finger)` ở chỗ nào?",
            a: [
              "`display()` hiện lên màn hình AR, `say_num()` in ra console",
              "giống hệt nhau, đổi tên thôi",
              "`display()` chỉ dùng cho chữ, không dùng cho số",
            ],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Trước khi vào cổng, ghé LÒ RÈN với huy hiệu vừa nhận nào — ghép đủ là Pip rèn được một quả BOM MẬT NGỮ cho bạn.",

    },

    {

      npc: "MIRROR WRAITH giữ cổng phía trước chuyên bắt bẻ ai lẫn lộn INPUT/OUTPUT — rèn cho khéo để có bom dứt điểm nó!",

    },
    {
      forge: {
        quiz: [
          {
            q: "Muốn hỏi rồi nhận một CHUỖI (không tính toán được), dùng lệnh nào?",
            a: [
              "`read()`",
              "`read_num()`",
              "`watch()`",
            ],
            correct: 0,
          },
          {
            q: "Muốn hỏi rồi nhận một SỐ để tính toán, dùng lệnh nào?",
            a: [
              "`read()`",
              "`read_num()`",
              "`say()`",
            ],
            correct: 1,
          },
          {
            q: "Dòng `say_num(7` chạy thì máy báo lỗi. Nó thiếu cái gì?",
            a: [
              "Thiếu dấu `)` đóng lại",
              "Thiếu một dấu chấm",
              "Thiếu chữ viết HOA",
            ],
            correct: 0,
          },
          {
            q: "Muốn máy đọc camera và đếm số ngón tay bạn đang giơ, dùng lệnh nào?",
            a: [
              "`read_num()`",
              "`watch()`",
              "`say()`",
            ],
            correct: 1,
          },
          {
            q: "`display(finger)` khác `say_num(finger)` ở chỗ nào?",
            a: [
              "`display()` hiện lên màn hình AR, `say_num()` in ra console",
              "giống hệt nhau, đổi tên thôi",
              "`display()` chỉ dùng cho chữ, không dùng cho số",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Rèn xong BOM MẬT NGỮ chưa nào? MIRROR WRAITH kia không cần qua từng câu hỏi nữa đâu — bạn chỉ cần GIƠ NGÓN TRỎ ☝ ngắm thẳng vào nó cho chắc tay, rồi ĐẬP TAY ✋ để phóng bom.",
    },
    {
      npc: "Một phát là phong ấn nó luôn! (Chưa có bom thì quay lại LÒ RÈN rèn thêm đã nhé. )",
    },
    {
      boss: {
        name: "THE MIRROR WRAITH",
        sheet: {
          src: "assets/mirror-wraith-sheet.webp",
        },
        art: "assets/mirror-wraith.webp",
        glyph: "🪞",
        ko: true,
      },
    },
    {
      npc: `Con quái tan sạch thành bụi — cổng mở rồi.
Tay bạn là INPUT thật, lửa và con số hiện lên là OUTPUT thật. Phong ấn đã khắc xong; đường tới chặng sau đang sáng lên!`,
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "Đập tay với camera để niêm phong giao kèo",
    choice: {
      q: "Cỗ máy tương lai ĐẾM số ngón tay bạn giơ bằng lệnh nào?",
      a: [
        "watch",
        "say",
        "read",
      ],
      correct: 0,
    },
    theme: {
      motion: "orbit",
      palette: {
        core: "#78b2a5",
        dust: "#d9eee5",
        rune: "#f4c85a",
      },
      glyphs: "watch",
    },
  },
};
