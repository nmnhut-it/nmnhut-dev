// islandFXFORGE.js — XƯỞNG GHÉP HIỆU ỨNG.
// The bridge between the Python saga and the root camera app (../index.html):
// an image is a grid of light, flipping is reordering columns, and a glowing
// FX plate shot on black composites onto a scene by ADDING light. The last
// stage rebuilds that app's spoken-command router with if/elif/else, and the
// finish card hands the learner the real app instead of the map.
//
// Every visual beat goes through camera_charm.compare_frames (engine/
// image-lab.js): a full-screen BEFORE/AFTER viewer that blocks until the
// learner dismisses it, so nothing scrolls past unseen and the numbers behind
// a picture are readable next to the picture itself.
export default {
  index: 25,
  sideIslandId: "islandFXFORGE",
  // Main-trail final project: island.js seals node 25 on the finish card (see
  // island.js#finishFactory), because this capstone ends by opening the real
  // AR fight instead of the vortex/seal ritual every other node ends with.
  sealsSagaNode: 25,
  title: "GƯƠNG VÔ CỰC",
  subtitle: "bước vào tấm gương giữ mọi hình phản chiếu: đọc một hình thành lưới ánh sáng, tự sửa từng ô, tự viết thần chú lật hình và thần chú chồng hai lớp",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI SOI GƯƠNG" },
  machine: {
    art: "assets/future-machine.webp",
    name: "KHUNG GƯƠNG VÔ CỰC",
    blurb: "một tấm gương giữ được nhiều hình phản chiếu cùng lúc và chồng chúng lại thành một khung hình duy nhất",
  },
  finish: {
    title: "✦ GƯƠNG ĐÃ NHẬN BẠN! ✦",
    sub: "Bạn vừa tự viết thần chú lật hình, thần chú chồng hai lớp và bộ chọn thần chú theo lời gọi. Ba thần chú đó chính là vũ khí trục xuất Chúa tể Vô Định. Bước qua gương là vào thẳng trận cuối: gọi tên thần chú bằng giọng nói, giơ tay lên camera để định sức mạnh, và đánh cho tới khi hắn tan khỏi khung hình.",
    button: "BƯỚC QUA GƯƠNG",
    page: "../ar-boss/index.html",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
    voice_charm: "../py/voice_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ GƯƠNG VÔ CỰC ✦",
        hook: "Trước mặt bạn là Gương Vô Cực, chặng cuối của cả hành trình. Chúa tể Vô Định đang trốn trong lòng gương, vì trong gương mọi hình phản chiếu đều chỉ là ánh sáng xếp thành lưới và hắn tưởng không ai đọc nổi lưới đó. Hôm nay bạn tự viết những thần chú đọc được nó, rồi dùng chính chúng để trục xuất hắn.",
        art: "assets/future-machine.webp",
      },
    },

    // ── CHẶNG 0 · câu đố mở màn: nhìn thấy đích trước khi học cách tới ──
    {
      npc: "Gương đang giữ hai hình phản chiếu tách rời: một con hươu ánh sáng, và một con quái khói tím. Bạn nhìn kỹ hai hình đó trước đã nhé.",
    },
    {
      code: 'from camera_charm import show_photos\n\n# Hai lớp ảnh rời nhau, chưa dính gì tới nhau\nshow_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss")], "TWO SEPARATE LAYERS")\n',
      label: "xem_hai_tam_anh.py",
      note: "RUN KIỂM CHỨNG\nINPUT là hai tấm ảnh có sẵn trong bài. OUTPUT là cửa sổ lớn đặt hai tấm cạnh nhau ở đúng kích thước gốc: con hươu ánh sáng trên nền đen, và con quái khói tím cũng trên nền đen. Cửa sổ đứng yên tới khi bạn bấm TIẾP TỤC.",
      expectOut: { kind: "studio_start", minCount: 1 },
      solution: 'from camera_charm import show_photos\n\nshow_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss")], "TWO SEPARATE LAYERS")\n',
    },
    {
      npc: "Đây là câu đố gương đặt ra cho bạn: làm sao đưa con hươu lao thẳng vào con quái trong CÙNG một khung hình? Bạn đoán thử xem gương phải làm gì với hai hình đó.",
    },
    {
      code: 'from camera_charm import show_photos\n\n# Đây là đích tới của cả hòn đảo này\nshow_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss"), ("STAG OVER BEAST", "goal")], "THE GOAL: ONE SINGLE FRAME")\n',
      label: "xem_dich_toi.py",
      note: "RUN KIỂM CHỨNG\nINPUT vẫn là hai tấm ảnh cũ, cộng thêm tấm kết quả đã dựng sẵn. OUTPUT là cửa sổ ba tấm: con hươu, con quái, và khung hình cuối cùng có con hươu lao qua làn khói tím. Tấm thứ ba chính là thứ bạn sẽ tự dựng được ở cuối đảo — nhìn kỹ xem chỗ nào sáng lên, chỗ nào giữ nguyên.",
      expectOut: { kind: "studio_start", minCount: 1 },
      solution: 'from camera_charm import show_photos\n\nshow_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss"), ("STAG OVER BEAST", "goal")], "THE GOAL: ONE SINGLE FRAME")\n',
    },
    {
      quiz: {
        title: "Đoán cách đè hai tấm ảnh",
        questions: [
          {
            q: "Cả hai tấm ảnh đều được quay trên nền đen, và trong khung hình cuối cùng bạn thấy CẢ con hươu lẫn làn khói tím, không tấm nào che mất tấm nào. Cách xử lý nào hợp lý nhất?",
            a: [
              "Cộng ánh sáng của hai tấm tại từng ô, vì nền đen cộng vào gần như không thêm gì",
              "Lấy tấm thứ hai đặt chồng lên và xóa hẳn tấm thứ nhất",
              "Cắt đôi khung hình, để con hươu một nửa và con quái một nửa",
            ],
            correct: 0,
          },
          {
            q: "Trong khung hình cuối cùng, vùng nền đen của cả hai tấm vẫn tối. Điều đó gợi ý giá trị màu của vùng nền đen gần bằng bao nhiêu?",
            a: [
              "Gần bằng `0`, nên cộng vào chỗ nào cũng gần như không đổi chỗ đó",
              "Gần bằng `255`, nên nó luôn thắng mọi giá trị khác",
              "Bằng `-1`, nên nó trừ bớt ánh sáng của tấm kia",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đúng hướng rồi đó. Nhưng muốn chồng được hai hình thì trước hết phải biết một hình phản chiếu gồm những gì. Mình mở lòng gương ra xem nhé.",
    },

    // ── CHẶNG 1 · ảnh là một lưới độ sáng ──
    {
      npc: "Trong lòng gương, một hình chỉ là bảng số: mỗi ô ghi ánh sáng ở chỗ đó mạnh hay yếu. Mình đọc cùng một hình ở hai độ mịn để thấy bảng số đó thô hay mịn ra sao.",
    },
    {
      code: 'from camera_charm import load_plate, compare_frames\n\n# Ảnh gốc, rồi chính nó đọc thành lưới ở hai độ mịn\nfine = load_plate("stag", 24)\ncoarse = load_plate("stag", 8)\n\ncompare_frames([("GRID 24", fine, "stag"), ("GRID 8", coarse, "stag")], "FROM PICTURE TO NUMBERS", False)\n',
      label: "so_anh_that_voi_luoi.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tấm hiệu ứng con hươu có sẵn trong bài. OUTPUT là cửa sổ hai khung, mỗi khung đặt ảnh gốc sắc nét ngay cạnh lưới ô của chính nó: một khung chia 24 ô mỗi chiều, một khung chỉ còn 8 ô. Càng ít ô thì mỗi ô càng phải gánh một mảng rộng, nên lưới càng thô so với ảnh gốc bên cạnh — nhưng lưới mới là dạng mà vòng lặp Python duyệt được.",
      expectOut: { kind: "studio_start", minCount: 3 },
      solution: 'from camera_charm import load_plate, compare_frames\n\nfine = load_plate("stag", 24)\ncoarse = load_plate("stag", 8)\n\ncompare_frames([("GRID 24", fine, "stag"), ("GRID 8", coarse, "stag")], "FROM PICTURE TO NUMBERS", False)\n',
    },
    {
      npc: "Số ô càng nhiều thì mỗi ô càng nhỏ và hình càng rõ; số ô càng ít thì mỗi ô phải gánh một mảng rộng nên hình nhòe đi. Giờ mình mở luôn phần số nằm sau bức tranh.",
    },
    {
      code: 'from camera_charm import load_plate, compare_frames\n\n# Lưới 8 ô để con số còn đọc được bằng mắt\nsmall = load_plate("stag", 8)\ncompare_frames([("GRID 8", small, "stag")], "BRIGHTNESS OF EACH CELL", True)\n',
      label: "xem_con_so.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tấm hiệu ứng đọc ở lưới 8×8 cho con số còn đủ to. OUTPUT là cửa sổ hiện đúng bức tranh đó kèm bảng số: mỗi ô ghi độ sáng của chính nó và được tô đúng màu của nó. Ô càng sáng thì số càng lớn; ô nền tối có số gần 0.",
      expectOut: { kind: "studio_start", minCount: 2 },
      solution: 'from camera_charm import load_plate, compare_frames\n\nsmall = load_plate("stag", 8)\ncompare_frames([("GRID 8", small, "stag")], "BRIGHTNESS OF EACH CELL", True)\n',
    },
    {
      quiz: {
        title: "Đọc lưới độ sáng",
        questions: [
          {
            q: "Một tấm hiệu ứng được đọc thành `fx` có 16 hàng và 16 cột, mỗi ô là `[red, green, blue]`. Hai ô có giá trị `fx[2][2] = [10, 12, 8]` và `fx[7][11] = [230, 240, 250]`. Ô nào nằm ở vùng sáng của tấm ảnh?",
            a: [
              "`fx[7][11]`, vì ba giá trị màu đều lớn nên độ sáng trung bình cao",
              "`fx[2][2]`, vì nó đứng ở hàng và cột nhỏ hơn",
              "Không xác định được, vì phải biết kích thước ảnh trước",
            ],
            correct: 0,
          },
          {
            q: "Với `pixel = [60, 90, 120]`, máy tính `light = (60 + 90 + 120) // 3`. Giá trị `light` là bao nhiêu?",
            a: ["`90`", "`270`", "`120`"],
            correct: 0,
          },
          {
            q: "Cùng một tấm ảnh được đọc thành lưới 8×8 rồi lưới 24×24. So với lưới 24×24, lưới 8×8 khác ở chỗ nào?",
            a: [
              "Ít ô hơn nên mỗi ô gánh một mảng rộng hơn, hình vì thế thô hơn",
              "Nhiều ô hơn nên hình rõ hơn",
              "Số ô giữ nguyên, chỉ màu của từng ô đổi",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── CHẶNG 2 · tự tay sửa một vùng ô ──
    {
      npc: "Đã đọc được bảng số thì bạn ghi vào đó được luôn. Ghi đè giá trị lên một vùng ô, và hình trong gương phải đổi ngay đúng chỗ đó.",
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_plate, compare_frames\n\nbefore = load_plate("stag", 8)\n\n# Chép sang một lưới mới để vẫn giữ được ảnh gốc mà so sánh\nafter = []\nfor row in range(len(before)):\n    line = []\n    for col in range(len(before[row])):\n        line.append(before[row][col])\n    after.append(line)\n\n# lượt của bạn: tô trắng vùng từ hàng 2 tới hàng 5 và từ cột 2 tới cột 5\nfor row in range(2, 6):\n    for col in range(2, 6):\n        after[row][col] = before[row][col]\n\npainted = 0\nfor row in range(len(after)):\n    for col in range(len(after[row])):\n        if after[row][col] == [255, 255, 255]:\n            painted = painted + 1\nsay_num(painted)\n\ncompare_frames([("BEFORE", before, "stag"), ("AFTER", after)], "PAINT A REGION BY HAND", True)\n',
      label: "tu_to_mot_vung.py",
      note: "ĐỀ BÀI\nINPUT là tấm hiệu ứng đọc ở lưới 8×8; `after` là bản chép của nó để bạn sửa mà vẫn giữ được ảnh gốc. Dòng gán trong vòng lặp đang chép lại đúng giá trị cũ nên chưa có gì đổi. Hãy gán `[255, 255, 255]` cho mỗi ô trong vùng đó để tô trắng. OUTPUT đúng là số `16` (vùng 4 hàng × 4 cột) và cửa sổ so sánh cho thấy một khối trắng vuông vắn xuất hiện giữa ảnh AFTER, kèm bảng số đổi thành 255.",
      expectOut: { all: [/^16$/] },
      solution: 'from old_computer import say_num\nfrom camera_charm import load_plate, compare_frames\n\nbefore = load_plate("stag", 8)\n\nafter = []\nfor row in range(len(before)):\n    line = []\n    for col in range(len(before[row])):\n        line.append(before[row][col])\n    after.append(line)\n\nfor row in range(2, 6):\n    for col in range(2, 6):\n        after[row][col] = [255, 255, 255]\n\npainted = 0\nfor row in range(len(after)):\n    for col in range(len(after[row])):\n        if after[row][col] == [255, 255, 255]:\n            painted = painted + 1\nsay_num(painted)\n\ncompare_frames([("BEFORE", before, "stag"), ("AFTER", after)], "PAINT A REGION BY HAND", True)\n',
    },
    {
      checkpoint: {
        text: "Một tấm ảnh là lưới hai chiều: `image[row][col]` là một ô giữ `[red, green, blue]`, và độ sáng của ô tính bằng `(red + green + blue) // 3`. Lưới đó ghi được: `image[row][col] = [255, 255, 255]` làm ô đó trắng. Muốn sửa cả một vùng thì cho hai vòng lặp chạy trên khoảng hàng và khoảng cột của vùng, ví dụ `range(2, 6)` đi qua các hàng 2, 3, 4 và 5.",
      },
    },
    {
      quiz: {
        title: "Ghi đè một vùng ô",
        questions: [
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\nfor row in range(2, 6):\n    for col in range(2, 6):\n        after[row][col] = [255, 255, 255]\n```\nĐoạn này ghi đè bao nhiêu ô?",
            a: ["`16` ô, vì 4 hàng nhân 4 cột", "`8` ô, vì 4 hàng cộng 4 cột", "`4` ô, vì mỗi vòng lặp chạy 4 lần"],
            correct: 0,
          },
          {
            q: "Vẫn đoạn trên, nhưng đổi thành `after[row][col] = [0, 0, 0]`. Vùng đó trông thế nào trong ảnh kết quả?",
            a: [
              "Thành một khối đen, vì cả ba giá trị màu đều bằng 0",
              "Thành một khối trắng, vì 0 nghĩa là sáng nhất",
              "Không đổi, vì phải gán đủ ba lần cho ba kênh màu",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── CHẶNG 3 · lật ảnh ──
    {
      npc: "Thần chú đầu tiên của gương là lật hình theo chiều ngang — đúng việc một tấm gương vẫn làm. Gương không xoay hình trong không gian đâu; nó chỉ đọc lại từng hàng theo thứ tự cột ngược lại.",
    },
    {
      npc: "Trong một hàng có `n` cột, cột cuối cùng mang chỉ số `n - 1`. Ô mới ở cột `col` nhận giá trị của ô cũ ở cột `n - 1 - col`.",
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nfx = load_plate("stag", 16)\nflipped = blank_grid(len(fx), len(fx[0]))\n\nfor row in range(len(fx)):\n    last = len(fx[row]) - 1\n    for col in range(len(fx[row])):\n        flipped[row][col] = fx[row][col]  # lượt của bạn: đổi thành ô đối xứng\n\n# Bài tự kiểm tra: lật hai lần phải ra đúng ảnh gốc, và lật một lần phải đổi ảnh\nback = blank_grid(len(flipped), len(flipped[0]))\nfor row in range(len(flipped)):\n    last = len(flipped[row]) - 1\n    for col in range(len(flipped[row])):\n        back[row][col] = flipped[row][last - col]\n\nchanged = 0\nbroken = 0\nfor row in range(len(fx)):\n    for col in range(len(fx[row])):\n        if flipped[row][col] != fx[row][col]:\n            changed = changed + 1\n        if back[row][col] != fx[row][col]:\n            broken = broken + 1\n\nif changed > 0:\n    say("IMAGE CHANGED SIDES")\nif broken == 0:\n    say("TWO FLIPS RESTORE THE SOURCE")\n\ncompare_frames([("BEFORE FLIP", fx, "stag"), ("AFTER FLIP", flipped, "flipped")], "MIRROR THE IMAGE")\n',
      label: "viet_lenh_lat_anh.py",
      note: "ĐỀ BÀI\nINPUT là tấm hiệu ứng con hươu 16×16. Dòng gán trong vòng lặp đang chép y nguyên từng ô nên ảnh không hề lật. Hãy sửa dòng đó để ô ở cột `col` nhận giá trị của ô đối xứng trong cùng hàng; biến `last` đã giữ sẵn chỉ số cột cuối cùng. OUTPUT đúng phải in cả hai dòng `IMAGE CHANGED SIDES` và `TWO FLIPS RESTORE THE SOURCE`, rồi mở cửa sổ đặt ảnh trước và ảnh sau cạnh nhau — con hươu phải quay đầu sang phía ngược lại.",
      expectOut: { all: [/IMAGE CHANGED SIDES/, /TWO FLIPS RESTORE THE SOURCE/] },
      solution: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nfx = load_plate("stag", 16)\nflipped = blank_grid(len(fx), len(fx[0]))\n\nfor row in range(len(fx)):\n    last = len(fx[row]) - 1\n    for col in range(len(fx[row])):\n        flipped[row][col] = fx[row][last - col]\n\nback = blank_grid(len(flipped), len(flipped[0]))\nfor row in range(len(flipped)):\n    last = len(flipped[row]) - 1\n    for col in range(len(flipped[row])):\n        back[row][col] = flipped[row][last - col]\n\nchanged = 0\nbroken = 0\nfor row in range(len(fx)):\n    for col in range(len(fx[row])):\n        if flipped[row][col] != fx[row][col]:\n            changed = changed + 1\n        if back[row][col] != fx[row][col]:\n            broken = broken + 1\n\nif changed > 0:\n    say("IMAGE CHANGED SIDES")\nif broken == 0:\n    say("TWO FLIPS RESTORE THE SOURCE")\n\ncompare_frames([("BEFORE FLIP", fx, "stag"), ("AFTER FLIP", flipped, "flipped")], "MIRROR THE IMAGE")\n',
    },
    {
      checkpoint: {
        text: "Lật ngang một tấm ảnh là ghi lại từng hàng theo thứ tự cột ngược lại: `flipped[row][col] = image[row][last - col]`, với `last = len(image[row]) - 1`. Số hàng và số cột không đổi; chỉ vị trí của từng ô trong hàng đổi chỗ.",
      },
    },
    {
      quiz: {
        title: "Lật theo chiều ngang",
        questions: [
          {
            q: "Một hàng ảnh có 8 cột, đánh số từ 0 đến 7. Sau khi lật ngang, ô ở cột 2 của ảnh mới nhận giá trị của ô nào trong ảnh cũ?",
            a: ["Cột 5", "Cột 2", "Cột 6"],
            correct: 0,
          },
          {
            q: "Bạn viết `flipped[row][col] = image[row][col]` trong vòng lặp lật ảnh. Kết quả nhận được là gì?",
            a: [
              "Ảnh mới giống hệt ảnh cũ, vì mỗi ô được chép đúng vị trí cũ",
              "Ảnh mới bị lật theo chiều dọc thay vì chiều ngang",
              "Máy báo lỗi vì thiếu biến `last`",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── CHẶNG 4 · cộng hai lớp ──
    {
      npc: "Thần chú thứ hai là chồng lớp. Mỗi hình phản chiếu đều nằm trên nền đen, mà đen nghĩa là các giá trị màu gần bằng 0. Cộng số 0 vào nền thì nền giữ nguyên.",
    },
    {
      npc: "Nên chồng một hình phản chiếu lên nền chỉ là cộng từng ô: chỗ nào hình sáng thì nền sáng lên, chỗ nào hình đen thì nền không đổi.",
    },
    {
      npc: "Một điều nữa: mỗi giá trị màu chỉ chạy tới 255. Cộng ra 300 thì phải kẹp lại còn 255, và `min(255, tong)` làm đúng việc đó.",
    },
    {
      code: 'from old_computer import say, say_num\n\n# Hai ô cùng vị trí: một ô của nền, một ô của lớp hiệu ứng\nscene_pixel = [40, 52, 70]\nfx_dark = [0, 0, 0]\nfx_glow = [230, 240, 250]\n\nsay_num(min(255, scene_pixel[0] + fx_dark[0]))\nsay_num(min(255, scene_pixel[0] + fx_glow[0]))\nsay("Adding a black cell keeps the base")\n',
      label: "cong_hai_o.py",
      note: "RUN KIỂM CHỨNG\nBài này không có INPUT; ba ô đã được gán sẵn để bạn nhìn rõ phép cộng. PROCESS cộng kênh đỏ của nền với kênh đỏ của lớp hiệu ứng rồi kẹp bằng `min(255, ...)`. OUTPUT là `40` khi cộng với ô đen, `255` khi cộng với ô sáng (vì 40 + 230 = 270 đã vượt mức 255), và dòng nhắc lại luật.",
      expectOut: { all: [/^40$/, /^255$/, /Adding a black cell keeps the base/] },
      solution: 'from old_computer import say, say_num\n\nscene_pixel = [40, 52, 70]\nfx_dark = [0, 0, 0]\nfx_glow = [230, 240, 250]\n\nsay_num(min(255, scene_pixel[0] + fx_dark[0]))\nsay_num(min(255, scene_pixel[0] + fx_glow[0]))\nsay("Adding a black cell keeps the base")\n',
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nscene = load_plate("scene", 16)\nfx = load_plate("stag", 16)\nresult = blank_grid(len(scene), len(scene[0]))\n\nfor row in range(len(scene)):\n    for col in range(len(scene[row])):\n        base = scene[row][col]\n        layer = fx[row][col]\n        red = base[0]  # lượt của bạn: cộng thêm layer[0] rồi kẹp bằng min(255, ...)\n        green = base[1]  # lượt của bạn: làm tương tự với kênh xanh lá\n        blue = base[2]  # lượt của bạn: làm tương tự với kênh xanh dương\n        result[row][col] = [red, green, blue]\n\n# Bài tự kiểm tra: không kênh nào được vượt 255, và không chỗ nào được tối đi\ntoo_big = 0\ndarker = 0\nbrighter = 0\nfor row in range(len(result)):\n    for col in range(len(result[row])):\n        for channel in range(3):\n            if result[row][col][channel] > 255:\n                too_big = too_big + 1\n            if result[row][col][channel] < scene[row][col][channel]:\n                darker = darker + 1\n            if result[row][col][channel] > scene[row][col][channel]:\n                brighter = brighter + 1\n\nif too_big == 0:\n    say("ALL CHANNELS WITHIN 255")\nif darker == 0:\n    say("NOTHING GOT DARKER")\nif brighter > 0:\n    say("EFFECT AREA GOT BRIGHTER")\n\ncompare_frames([("BASE", scene), ("EFFECT LAYER", fx), ("AFTER ADD", result, "stagscene")], "LAYER ONTO A BASE")\n',
      label: "viet_lenh_cong_hai_lop.py",
      note: "ĐỀ BÀI\nINPUT là hai tấm ảnh có sẵn: `scene` là nền ngọn hải đăng ban đêm, `fx` là lớp con hươu quay trên nền đen. Ba dòng gán `red`, `green`, `blue` đang chép nguyên nền nên lớp hiệu ứng chưa hiện ra. Hãy cộng thêm kênh tương ứng của `layer` vào từng dòng và kẹp kết quả bằng `min(255, ...)`. OUTPUT đúng phải in đủ ba dòng `ALL CHANNELS WITHIN 255`, `NOTHING GOT DARKER`, `EFFECT AREA GOT BRIGHTER`, rồi mở cửa sổ đặt nền, lớp hiệu ứng và kết quả cạnh nhau.",
      expectOut: { all: [/ALL CHANNELS WITHIN 255/, /NOTHING GOT DARKER/, /EFFECT AREA GOT BRIGHTER/] },
      solution: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nscene = load_plate("scene", 16)\nfx = load_plate("stag", 16)\nresult = blank_grid(len(scene), len(scene[0]))\n\nfor row in range(len(scene)):\n    for col in range(len(scene[row])):\n        base = scene[row][col]\n        layer = fx[row][col]\n        red = min(255, base[0] + layer[0])\n        green = min(255, base[1] + layer[1])\n        blue = min(255, base[2] + layer[2])\n        result[row][col] = [red, green, blue]\n\ntoo_big = 0\ndarker = 0\nbrighter = 0\nfor row in range(len(result)):\n    for col in range(len(result[row])):\n        for channel in range(3):\n            if result[row][col][channel] > 255:\n                too_big = too_big + 1\n            if result[row][col][channel] < scene[row][col][channel]:\n                darker = darker + 1\n            if result[row][col][channel] > scene[row][col][channel]:\n                brighter = brighter + 1\n\nif too_big == 0:\n    say("ALL CHANNELS WITHIN 255")\nif darker == 0:\n    say("NOTHING GOT DARKER")\nif brighter > 0:\n    say("EFFECT AREA GOT BRIGHTER")\n\ncompare_frames([("BASE", scene), ("EFFECT LAYER", fx), ("AFTER ADD", result, "stagscene")], "LAYER ONTO A BASE")\n',
    },
    {
      checkpoint: {
        text: "Ghép một lớp hiệu ứng quay trên nền đen lên nền là cộng từng kênh màu của hai ô cùng vị trí, rồi kẹp bằng `min(255, tong)`. Ô đen của lớp hiệu ứng cộng vào 0 nên nền giữ nguyên; ô sáng đẩy nền lên tới mức tối đa 255.",
      },
    },
    {
      quiz: {
        title: "Cộng hai lớp ảnh",
        questions: [
          {
            q: "Ô nền là `[200, 180, 160]` và ô cùng vị trí của lớp hiệu ứng là `[0, 0, 0]`. Sau phép ghép `min(255, base + layer)` cho từng kênh, ô kết quả là gì?",
            a: ["`[200, 180, 160]`", "`[0, 0, 0]`", "`[255, 255, 255]`"],
            correct: 0,
          },
          {
            q: "Ô nền là `[200, 180, 160]` và ô hiệu ứng là `[100, 100, 100]`. Vì sao kênh đỏ của kết quả là `255` chứ không phải `300`?",
            a: [
              "Vì `min(255, 300)` chọn số nhỏ hơn, mà mỗi kênh màu chỉ chạy tới 255",
              "Vì máy tự chia đôi tổng khi tổng quá lớn",
              "Vì kênh đỏ luôn được gán bằng 255 sau mỗi phép cộng",
            ],
            correct: 0,
          },
          {
            q: "Nếu bỏ hẳn `min(255, ...)` và chỉ viết `red = base[0] + layer[0]`, điều gì có thể xảy ra với vùng sáng nhất của khung hình?",
            a: [
              "Một số ô mang giá trị lớn hơn 255, tức là vượt ra ngoài mức màu hợp lệ",
              "Vùng sáng tự động tối lại cho vừa mức 255",
              "Số hàng và số cột của ảnh kết quả tăng lên",
            ],
            correct: 0,
          },
        ],
      },
    },

    // ── CHẶNG 5 · thành quả: một lớp hiệu ứng ghép vào nền ──
    {
      npc: "Giờ quay lại câu đố gương đặt ra lúc đầu. Vẫn đúng phép cộng đó, chỉ đổi hai lớp mang vào thành con hươu và con quái — chính là hình bạn được xem ngay từ đầu.",
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nstag = load_plate("stag", 16)\nboss = load_plate("boss", 16)\n\nresult = blank_grid(len(stag), len(stag[0]))\nfor row in range(len(stag)):\n    for col in range(len(stag[row])):\n        a = stag[row][col]\n        b = boss[row][col]\n        result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]\n\nlit = 0\nfor row in range(len(result)):\n    for col in range(len(result[row])):\n        if result[row][col][0] > stag[row][col][0]:\n            lit = lit + 1\nif lit > 0:\n    say("STAG IS OVER THE BEAST")\n\ncompare_frames([("SPIRIT STAG", stag, "stag"), ("ERROR BEAST", boss, "boss"), ("YOU BUILT THIS", result, "goal"), ("GOAL", "goal")], "THE OPENING PUZZLE, SOLVED")\n',
      label: "giai_cau_do_mo_man.py",
      note: "RUN KIỂM CHỨNG\nINPUT là hai lớp ảnh con hươu và con quái, cùng đọc ở lưới 16 ô. PROCESS dùng lại đúng phép cộng kèm `min(255, ...)` bạn vừa viết, không đổi một dòng nào. OUTPUT là dòng `STAG IS OVER THE BEAST` và cửa sổ bốn tấm: hai lớp rời, khung hình do chính bạn dựng, và tấm đích đã xem ở đầu đảo để bạn đối chiếu.",
      expectOut: { all: [/STAG IS OVER THE BEAST/] },
      solution: 'from old_computer import say\nfrom camera_charm import load_plate, blank_grid, compare_frames\n\nstag = load_plate("stag", 16)\nboss = load_plate("boss", 16)\n\nresult = blank_grid(len(stag), len(stag[0]))\nfor row in range(len(stag)):\n    for col in range(len(stag[row])):\n        a = stag[row][col]\n        b = boss[row][col]\n        result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]\n\nlit = 0\nfor row in range(len(result)):\n    for col in range(len(result[row])):\n        if result[row][col][0] > stag[row][col][0]:\n            lit = lit + 1\nif lit > 0:\n    say("STAG IS OVER THE BEAST")\n\ncompare_frames([("SPIRIT STAG", stag, "stag"), ("ERROR BEAST", boss, "boss"), ("YOU BUILT THIS", result, "goal"), ("GOAL", "goal")], "THE OPENING PUZZLE, SOLVED")\n',
    },
    {
      remember: "Một khung hình trong gương luôn được dựng từ hai thứ rời nhau: tấm nền và hình phản chiếu nằm trên nền đen. Gương giữ chúng riêng, rồi cộng lại đúng lúc cần hiện.",
    },

    // ── CHẶNG 6 · chọn hiệu ứng theo lời nói ──
    {
      npc: "Ngoài kia bạn không gõ tên thần chú. Bạn niệm nó thành tiếng, và gương phải tự nghe lấy. Pip vừa mở cho bạn một cái bùa nghe tên là `voice_charm`.",
    },
    {
      npc: "`listen(spells)` mở micro và chờ. Bạn niệm một trong các từ trong `spells` thì nó trả về đúng từ đó; gương không nghe ra từ nào thì nó trả về chuỗi rỗng `\"\"`.",
    },
    {
      code: 'from old_computer import say\nfrom voice_charm import listen\n\n# INPUT thật: từ bạn niệm ra tiếng. Gương chỉ nhận ba từ trong danh sách này.\nspells = ["koto", "boss", "flip"]\ncommand = listen(spells)\n\nsay("Guong nghe duoc:")\nsay(command)\n',
      label: "nghe_than_chu.py",
      note: "RUN KIỂM CHỨNG\nINPUT là giọng của bạn. Khi chạy, gương mở micro và chờ vài giây — hãy niệm to một từ trong `spells`. Nếu micro chưa bật được thì gương hiện sẵn ba từ đó thành nút bấm, bạn chạm một nút cũng được. OUTPUT là dòng `Guong nghe duoc:` rồi tới đúng từ gương bắt được; không nghe ra từ nào thì dòng thứ hai trống.",
      expectOut: { all: [/Guong nghe duoc:/] },
      solution: 'from old_computer import say\nfrom voice_charm import listen\n\nspells = ["koto", "boss", "flip"]\ncommand = listen(spells)\n\nsay("Guong nghe duoc:")\nsay(command)\n',
    },
    {
      npc: "Chọn theo điều kiện thì dùng `if`, `elif` và `else`. Nhánh `else` lo phần quan trọng: khi gương nghe ra một từ lạ, hoặc không nghe được gì, nó vẫn phải xử sự tử tế.",
    },
    {
      code: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import load_plate, compare_frames\n\nspells = ["koto", "boss"]\ncommand = listen(spells)\nscene = load_plate("scene", 16)\n\nif command == "koto":\n    say("SPIRIT STAG SUMMONED")\n    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("stag", 16), "stag")], "KOTO")\nelif command == "boss":\n    say("ERROR BEAST SUMMONED")\n    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("boss", 16), "bossscene")], "BOSS")\nelse:\n    say("UNKNOWN WORD")\n',
      label: "chon_hieu_ung_theo_loi.py",
      note: "RUN KIỂM CHỨNG\nINPUT là từ bạn niệm ra tiếng, do `listen(spells)` bắt được. PROCESS so từ đó với từng mốc bằng `if` và `elif`. OUTPUT khi bạn niệm `koto` là dòng `SPIRIT STAG SUMMONED` kèm cửa sổ đặt nền cạnh hình con hươu. Chạy lại và niệm `boss`, rồi thử im lặng cho hết giờ, để xem hai nhánh còn lại chạy.",
      expectOut: { all: [/SPIRIT STAG SUMMONED/] },
      solution: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import load_plate, compare_frames\n\nspells = ["koto", "boss"]\ncommand = listen(spells)\nscene = load_plate("scene", 16)\n\nif command == "koto":\n    say("SPIRIT STAG SUMMONED")\n    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("stag", 16), "stag")], "KOTO")\nelif command == "boss":\n    say("ERROR BEAST SUMMONED")\n    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("boss", 16), "bossscene")], "BOSS")\nelse:\n    say("UNKNOWN WORD")\n',
    },
    {
      npc: "Gương còn nghe được thần chú `flip`, và từ đó không gọi hình phản chiếu nào cả — nó lật chính khung hình đang chiếu. Bạn hãy thêm nhánh cho nó.",
    },
    {
      code: 'from old_computer import say\n\n# Bốn từ này lần lượt được đưa vào bộ chọn, thay cho bốn lần nghe micro\nheard = ["koto", "boss", "flip", "meo meo"]\n\nfor command in heard:\n    if command == "koto":\n        say("SPIRIT STAG SUMMONED")\n    elif command == "boss":\n        say("ERROR BEAST SUMMONED")\n    else:\n        say("UNKNOWN WORD")\n',
      label: "them_nhanh_lat_hinh.py",
      note: "ĐỀ BÀI\nINPUT là bốn từ đã gán sẵn trong `heard`, chạy lần lượt qua bộ chọn. Bộ chọn hiện chưa biết từ `flip` nên nó rơi xuống nhánh `else`. Hãy thêm một nhánh `elif` cho `flip` in ra `MIRROR THE FRAME`, đặt trước `else`. OUTPUT đúng gồm bốn dòng theo thứ tự: `SPIRIT STAG SUMMONED`, `ERROR BEAST SUMMONED`, `MIRROR THE FRAME`, `UNKNOWN WORD`.",
      expectOut: { all: [/SPIRIT STAG SUMMONED/, /ERROR BEAST SUMMONED/, /MIRROR THE FRAME/, /UNKNOWN WORD/] },
      solution: 'from old_computer import say\n\nheard = ["koto", "boss", "flip", "meo meo"]\n\nfor command in heard:\n    if command == "koto":\n        say("SPIRIT STAG SUMMONED")\n    elif command == "boss":\n        say("ERROR BEAST SUMMONED")\n    elif command == "flip":\n        say("MIRROR THE FRAME")\n    else:\n        say("UNKNOWN WORD")\n',
    },
    {
      checkpoint: {
        text: "Bộ chọn hiệu ứng là một chuỗi `if` / `elif` / `else` so từ nghe được với từng mốc. Máy xét các nhánh từ trên xuống và chỉ chạy nhánh khớp đầu tiên; nhánh `else` nhận mọi từ không khớp mốc nào.",
      },
    },
    {
      quiz: {
        title: "Bộ chọn hiệu ứng",
        questions: [
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\nif command == \"koto\":\n    say(\"HUOU\")\nelif command == \"boss\":\n    say(\"QUAI\")\nelse:\n    say(\"LA\")\n```\nVới `command = \"boss\"`, máy in ra gì?",
            a: ["`QUAI`", "`HUOU`", "`QUAI` rồi `LA`"],
            correct: 0,
          },
          {
            q: "Vẫn đoạn Mật Ngữ trên, nhưng lần này `command = \"rain\"`. Máy in ra gì?",
            a: [
              "`LA`, vì không mốc nào khớp nên nhánh `else` chạy",
              "Không in gì, vì `rain` không có trong chuỗi điều kiện",
              "`HUOU`, vì máy chạy nhánh đầu tiên khi không tìm được mốc khớp",
            ],
            correct: 0,
          },
          {
            q: "Bạn muốn thêm từ `flip` vào bộ chọn đã có `koto`, `boss` và một nhánh `else`. Đặt nhánh mới ở đâu thì đúng?",
            a: [
              "Thêm một nhánh `elif command == \"flip\":` đứng trước `else`",
              "Thêm sau `else`, vì `else` chỉ lo các từ đứng trước nó",
              "Thay `else` thành `elif command == \"flip\":` và bỏ hẳn nhánh cuối",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Tới lúc thả thần chú ra khỏi lưới 16 ô rồi. `play_effect(name)` chiếu lớp hiệu ứng cỡ thật lên hình bạn trong camera, vẫn bằng đúng phép cộng ánh sáng bạn vừa viết.",
    },
    {
      code: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import play_effect\n\nspells = ["phoenix", "butterfly", "sakura"]\ncommand = listen(spells)\n\nif command == "phoenix":\n    say("PHOENIX RISES")\n    play_effect("phoenix")\nelif command == "butterfly":\n    say("BUTTERFLY SWARM")\n    play_effect("butterfly")\nelif command == "sakura":\n    say("SAKURA BLOOM")\n    play_effect("sakura")\nelse:\n    say("UNKNOWN WORD")\n',
      label: "tha_than_chu_co_that.py",
      note: "RUN KIỂM CHỨNG\nINPUT là thần chú bạn niệm ra tiếng. PROCESS vẫn là chuỗi `if`/`elif`/`else` quen thuộc. OUTPUT lần này là lớp hiệu ứng cỡ thật chiếu đè lên hình camera của bạn: phượng hoàng bung cánh, đàn bướm pha lê, hoặc trận mưa hoa anh đào. Chỗ nào lớp hiệu ứng tối thì hình bạn giữ nguyên, chỗ nào nó sáng thì sáng bừng lên — đúng luật cộng ánh sáng bạn vừa viết.",
      expectOut: { all: [/PHOENIX RISES/] },
      solution: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import play_effect\n\nspells = ["phoenix", "butterfly", "sakura"]\ncommand = listen(spells)\n\nif command == "phoenix":\n    say("PHOENIX RISES")\n    play_effect("phoenix")\nelif command == "butterfly":\n    say("BUTTERFLY SWARM")\n    play_effect("butterfly")\nelif command == "sakura":\n    say("SAKURA BLOOM")\n    play_effect("sakura")\nelse:\n    say("UNKNOWN WORD")\n',
    },
    {
      npc: "Và bạn không bị bó trong mấy lớp Pip đưa đâu. Tự làm một đoạn video sáng trên nền đen — vẽ, quay, hay nhờ máy dựng đều được — rồi `play_my_effect()` sẽ chiếu chính nó lên hình bạn.",
    },
    {
      code: 'from old_computer import say\nfrom camera_charm import play_my_effect\n\n# Chọn một tệp video từ máy của bạn; tệp chỉ được đọc trong trình duyệt\nsay("CHON MOT DOAN VIDEO")\nplay_my_effect()\nsay("DA CHIEU XONG")\n',
      label: "lop_hieu_ung_cua_ban.py",
      note: "XƯỞNG CỦA BẠN — không chấm điểm. INPUT là một tệp video bạn chọn từ thiết bị; nếu bấm hủy thì bài dùng lớp có sẵn để không bị ngắt. Đoạn video càng đúng kiểu SÁNG TRÊN NỀN ĐEN thì ghép càng đẹp, vì phép cộng giữ phần sáng và bỏ qua phần đen. OUTPUT là chính đoạn video đó nằm trên hình camera của bạn.",
      expectOut: null,
      solution: 'from old_computer import say\nfrom camera_charm import play_my_effect\n\nsay("CHON MOT DOAN VIDEO")\nplay_my_effect()\nsay("DA CHIEU XONG")\n',
    },
    {
      npc: "Một mình giọng nói thì chưa đủ. Gương còn nhìn được bàn tay bạn nữa: `listen()` chọn thần chú nào, còn `watch()` đếm số ngón tay để biết niệm mạnh tới đâu.",
    },
    {
      code: 'from old_computer import say, say_num\nfrom voice_charm import listen\nfrom camera_charm import watch\n\n# Hai INPUT thật cùng lúc: một từ miệng bạn, một từ bàn tay bạn\nspells = ["koto", "boss"]\ncommand = listen(spells)\npower = watch()\n\nsay(command)\nsay_num(power)\n\nif power >= 3:\n    say("FULL POWER CAST")\nelse:\n    say("WEAK CAST")\n',
      label: "giong_noi_va_ban_tay.py",
      note: "ĐỀ BÀI\nBài này có HAI input thật. `listen(spells)` nghe thần chú bạn niệm; `watch()` đợi bàn tay bạn giơ lên và trả về số ngón tay đang mở. Hãy chạy thử vài lần: đổi thần chú, và đổi số ngón tay giơ lên. OUTPUT là từ nghe được, số ngón tay đếm được, rồi `FULL POWER CAST` khi bạn giơ từ 3 ngón trở lên, ngược lại là `WEAK CAST`.",
      expectOut: { all: [/FULL POWER CAST/] },
      solution: 'from old_computer import say, say_num\nfrom voice_charm import listen\nfrom camera_charm import watch\n\nspells = ["koto", "boss"]\ncommand = listen(spells)\npower = watch()\n\nsay(command)\nsay_num(power)\n\nif power >= 3:\n    say("FULL POWER CAST")\nelse:\n    say("WEAK CAST")\n',
    },
    {
      remember: "Gương Vô Cực nhận hai loại INPUT thật: `listen(spells)` lấy từ giọng nói, `watch()` lấy từ bàn tay. Cả hai đều do người ngoài quyết định chứ không phải code bạn, nên chuỗi `if`/`elif`/`else` luôn phải có nhánh lo cho trường hợp không như ý.",
    },
    {
      gift: {
        glyph: "◈",
        name: "HUY HIỆU GƯƠNG VÔ CỰC",
        blurb: "phần thưởng cho việc tự sửa một vùng ô, tự viết lệnh lật ảnh, lệnh cộng hai lớp và bộ chọn hiệu ứng theo lời nói",
        badge: true,
        badgeId: "huy_hieu_ghep_hieu_ung",
      },
    },
    {
      remember: "Gương Vô Cực chạy đúng ba việc bạn vừa viết: đọc khung hình thành lưới số, lật lưới đó khi nghe `flip`, và cộng một hình phản chiếu vào nền khi nghe tên thần chú. Chúa tể Vô Định cũng chỉ là một lưới số như thế, nên ba thần chú này chạm được vào hắn. Giờ tới lượt bạn đứng trước gương thật.",
    },
  ],
};
