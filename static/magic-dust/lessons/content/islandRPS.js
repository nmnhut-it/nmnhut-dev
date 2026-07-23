// islandRPS.js — ĐẢO OẲN TÙ TÌ, a bonus side-island (island.js, not node.js):
// a mini-game project combining watch() (camera_charm, taught node04) with
// and / if-elif-else logic (taught node09) — student writes the win/lose
// judge for oẳn tù tì against a randomly-picking opponent. machine_move()
// (rps_arena) is a NEW black-box function this island introduces — it's
// handed over via a proper {gift:...} reveal (not silently imported), same
// beat node03.js uses to grant camera_charm: gift cell (flavor blurb) ->
// npc cell (mechanical explanation, analogized to watch(), a function the
// student already knows returns a number) -> a solo demo code cell ->
// checkpoint -> quiz. No new SYNTAX concept — pure application of
// already-taught vocabulary onto a new problem, per PEDAGOGY-METHOD.md's
// side-island rule. Gated unlockAt:10 (after node09 — logic gates — is done,
// since the judge logic needs `and`).
export default {
  index: -1,
  sideIslandId: "islandRPS",
  title: "ĐẢO OẲN TÙ TÌ",
  subtitle: "ghép watch(), machine_move(), and/elif/else để đấu oẳn tù tì với máy",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ ĐẤU TRƯỜNG" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY OẲN TÙ TÌ",
    blurb: "một cỗ máy phụ để chơi oẳn tù tì — không có quái lỗi nào ở đây cả",
  },
  modules: {
    camera_charm: "../py/camera_charm/__init__.py",
    rps_arena: "../py/rps_arena/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO OẲN TÙ TÌ ✦",
        hook: "Một hòn đảo nhỏ để CHƠI — không có quái lỗi, không bắt buộc phải ghé. Mang watch(), machine_move(), và luật and/elif/else vào một trò oẳn tù tì thật, đấu với máy ngay trên camera của bạn!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Oẳn Tù Tì! Luật chơi: 1 ngón là BÚA, 3 ngón là BAO, 4 ngón là KÉO. Búa thắng Kéo, Kéo thắng Bao, Bao thắng Búa. Trước khi đấu với cỗ máy, tụi mình ôn lại luật `and`: một ván thắng thường cần cả hai điều kiện cùng đúng.",
    },
    {
      quiz: {
        title: "Ôn luật and trước khi đấu",
        questions: [
          {
            q: "Trong oẳn tù tì, luật Búa thắng Kéo nghĩa là bạn ra Búa (`player == 1`) VÀ máy ra Kéo (`machine == 4`). Dòng điều kiện nào viết đúng luật đó?",
            a: ["`player == 1 and machine == 4`", "`player == 1 or machine == 4`", "`player == machine`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đủ luật nền rồi. Nhưng đấu oẳn tù tì thì phải có ĐỐI THỦ — mà đối thủ này không giơ tay được. Tặng bạn nè —",
    },
    {
      gift: {
        art: "assets/rps-random-charm.webp",
        glyph: "🎲",
        name: "XÚC XẮC ĐẤU TRƯỜNG",
        blurb: "một lệnh giúp máy tự ra chiêu — không cần camera, không cần giơ tay",
      },
    },
    {
      npc: "`machine_move()` tự chọn 1, 3 hoặc 4 bằng may rủi; nó không đọc camera. Bấm RUN nhiều lần nhé. Khối `if/elif/else` sẽ đổi số máy chọn thành hình Búa, Bao hoặc Kéo để bạn nhận ra ngay.",
    },
    {
      code: 'from camera_charm import display\nfrom rps_arena import machine_move\n\nmachine = machine_move()   # máy tự ra chiêu, không cần camera\nif machine == 1:\n    display("MÁY: ✊ BÚA")\nelif machine == 3:\n    display("MÁY: ✋ BAO")\nelse:\n    display("MÁY: ✌ KÉO")\n',
      label: "rps_machine.py",
      note: "CHẠY THỬ\nBài này không có INPUT camera. Bấm RUN nhiều lần; `machine_move()` tự chọn 1, 3 hoặc 4, còn khối `if/elif/else` đổi số đó thành hình và tên chiêu nhìn thấy được. OUTPUT mỗi lần là `MÁY: ✊ BÚA`, `MÁY: ✋ BAO` hoặc `MÁY: ✌ KÉO`.",
      expectOut: /MÁY:.*(BÚA|BAO|KÉO)/i,
    },
    {
      checkpoint: {
        text: "`machine_move()` là một INPUT không cần camera — mỗi lần gọi nó tự chọn một số trong 1, 3, 4, y như `watch()` cũng cho ra một số; khác nhau ở chỗ `watch()` đọc tay bạn, còn `machine_move()` dùng may rủi.",
      },
    },
    {
      quiz: {
        title: "Một cách tạo input mới",
        questions: [
          {
            q: "Vì sao chạy `display(machine_move())` nhiều lần liên tiếp lại có thể ra số khác nhau, dù bạn không đổi gì cả?",
            a: [
              "Vì `machine_move()` tự chọn một số mỗi lần được gọi, không đọc camera nên không phụ thuộc vào tay bạn",
              "Vì `display()` tự đổi số mỗi lần hiện lên",
              "Vì máy đang đọc lại số ngón tay cũ từ lần RUN trước",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── watch() (mình) + machine_move() (máy) — hai input cùng lúc ──
    {
      code: 'from camera_charm import watch, display\nfrom rps_arena import machine_move\n\nplayer = watch()          # giơ 1/3/4 ngón, giữ yên\nmachine = machine_move()   # máy tự ra chiêu, không cần camera\n\nif player == 1:\n    display("BẠN: ✊ BÚA")\nelif player == 3:\n    display("BẠN: ✋ BAO")\nelse:\n    display("BẠN: ✌ KÉO")\n\nif machine == 1:\n    display("MÁY: ✊ BÚA")\nelif machine == 3:\n    display("MÁY: ✋ BAO")\nelse:\n    display("MÁY: ✌ KÉO")\n',
      label: "rps_watch.py",
      note: "CHẠY THỬ\nINPUT thật là 1, 3 hoặc 4 ngón tay bạn giơ trước camera; máy tự chọn chiêu còn lại. OUTPUT hiện hai chiêu bằng hình và tên, mỗi chiêu có nhãn `BẠN` hoặc `MÁY`, nên bạn không phải tự nhớ ý nghĩa của các số.",
      expectOut: { all: [{ minLines: 2 }, /BẠN:.*(BÚA|BAO|KÉO)/i, /MÁY:.*(BÚA|BAO|KÉO)/i] },
    },
    // ── hòa: == ──
    {
      code: 'from camera_charm import watch, display\n\nplayer = watch()\nmachine = player\n\nif player == 1:\n    display("BẠN + MÁY: ✊ BÚA")\nelif player == 3:\n    display("BẠN + MÁY: ✋ BAO")\nelse:\n    display("BẠN + MÁY: ✌ KÉO")\n\nif player == machine:\n    display("HÒA!")\n',
      label: "rps_hoa.py",
      note: "CHẠY THỬ\nINPUT thật là 1, 3 hoặc 4 ngón tay. `machine = player` tạo một ván hòa chắc chắn. OUTPUT đầu tiên cho thấy cả hai bên đã chọn cùng một hình, sau đó mới hiện `HÒA!`.",
      expectOut: /hòa/i,
    },

    // ── công thức: bảng luật thắng/thua, điền tiếp (mix & match, giống ar_recipe) ──
    {
      npc: "Giờ tới phần chính: bảng luật thắng thua. Búa(1) thắng Kéo(4), Kéo(4) thắng Bao(3), Bao(3) thắng Búa(1). Nếu hai bên trùng số thì HÒA. Pip đã viết sẵn luật Búa thắng Kéo; bạn viết tiếp hai luật thắng còn lại nhé!",
    },
    {
      code: 'from camera_charm import display\n\nplayer = 4\nmachine = 3\ndisplay("BẠN: ✌ KÉO  ·  MÁY: ✋ BAO")\n\n# BẢNG LUẬT (1=búa, 3=bao, 4=kéo):\n# búa thắng kéo, kéo thắng bao, bao thắng búa\n# nếu hai bên giống nhau thì HÒA; còn lại là MÁY THẮNG\nif player == 1 and machine == 4:\n    display("BẠN THẮNG!")\nelif player == machine:\n    display("HÒA!")\n# Viết tiếp các trường hợp BẠN THẮNG còn thiếu\n',
      label: "rps_recipe.py",
      note:
        "ĐỀ BÀI (điền tiếp)\nVán kiểm tra cố định là `player = 4`, `machine = 3`, tức Kéo thắng Bao. Hoàn thành các trường hợp còn thiếu để ván này hiện `BẠN THẮNG!`; nếu không thắng và không hòa thì hiện `MÁY THẮNG!`.",
      expectOut: /bạn thắng/i,
      solution:
        'from camera_charm import display\n\nplayer = 4\nmachine = 3\ndisplay("BẠN: ✌ KÉO  ·  MÁY: ✋ BAO")\n\nif player == 1 and machine == 4:\n    display("BẠN THẮNG!")\nelif player == 4 and machine == 3:\n    display("BẠN THẮNG!")\nelif player == 3 and machine == 1:\n    display("BẠN THẮNG!")\nelif player == machine:\n    display("HÒA!")\nelse:\n    display("MÁY THẮNG!")\n',
    },

    {
      quiz: {
        title: "Đoán ai thắng",
        questions: [
          {
            q: "Bạn giơ 3 ngón (Bao), máy ra `machine_move()` là 1 (Búa). Theo bảng luật, ai thắng?",
            a: [
              "Bạn thắng — vì Bao(3) thắng Búa(1)",
              "Máy thắng — vì Búa luôn thắng",
              "Hòa — vì cả hai đều là số lẻ",
            ],
            correct: 0,
          },
          {
            q: "Bạn giơ 4 ngón (Kéo), máy ra 1 (Búa). Theo luật \"Búa(1) thắng Kéo(4)\", ai thắng?",
            a: ["Máy thắng", "Bạn thắng", "Hòa"],
            correct: 0,
          },
        ],
      },
    },

    // ── xưởng sáng tạo tự do ──
    {
      npc: "Giờ tới XƯỞNG SÁNG TẠO! Ô lệnh dưới đây đã có bảng luật đầy đủ — bạn tự đổi chữ hiện lên (thay \"BẠN THẮNG!\" bằng câu riêng của bạn), hoặc đổi thứ tự kiểm tra luật, rồi RUN thử nhiều lần cho quen tay.",
    },
    {
      code: 'from camera_charm import watch, display\nfrom rps_arena import machine_move\n\nplayer = watch()\nmachine = machine_move()\n\nplayer_name = "✊ BÚA"\nif player == 3:\n    player_name = "✋ BAO"\nelif player == 4:\n    player_name = "✌ KÉO"\n\nmachine_name = "✊ BÚA"\nif machine == 3:\n    machine_name = "✋ BAO"\nelif machine == 4:\n    machine_name = "✌ KÉO"\n\ndisplay("BẠN: " + player_name)\ndisplay("MÁY: " + machine_name)\n\nif player == 1 and machine == 4:\n    display("BẠN THẮNG!")\nelif player == 4 and machine == 3:\n    display("BẠN THẮNG!")\nelif player == 3 and machine == 1:\n    display("BẠN THẮNG!")\nelif player == machine:\n    display("HÒA!")\nelse:\n    display("MÁY THẮNG!")\n\n# Xưởng của bạn: đổi lời kết hoặc thêm luật riêng ở đây\n',
      label: "rps_sangtao.py",
      expectOut: null,
      note:
        "SÁNG TẠO TỰ DO — không chấm điểm. Mỗi lần RUN, OUTPUT phải cho thấy chiêu của BẠN, chiêu của MÁY rồi mới công bố kết quả. Vài gợi ý nếu bí ý tưởng:\n" +
        "• ĐỔI CHỮ THẮNG/THUA — thay \"BẠN THẮNG!\"/\"MÁY THẮNG!\"/\"HÒA!\" bằng câu riêng của bạn (VD: \"BẠN THẮNG RỒI!\").\n" +
        "• ĐẤU 3 VÁN — chạy ô này ba lần liên tiếp (giơ tay lại mỗi lần) và tự đếm xem ai thắng nhiều hơn.\n" +
        "• THÁCH BẠN BÈ — đố người bên cạnh đoán bảng luật của bạn chỉ bằng cách nhìn kết quả hiện lên màn hình.",
    },

    {
      remember:
        "Oẳn tù tì chỉ là một bảng luật if/elif so sánh hai biến (`player == machine`, `player == 1 and machine == 4`, …). Ghép đúng input (`watch()`, `machine_move()`) với đúng luật so sánh là giải được mọi bài toán kiểu \"ai thắng ai\".",
    },
  ],
};
