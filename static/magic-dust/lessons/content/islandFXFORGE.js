export default {
  index: 25,
  sideIslandId: "islandFXFORGE",
  sealsSagaNode: 25,
  title: "GƯƠNG VÔ CỰC",
  subtitle: "Vũ khí cổ xưa dùng để phong ấn Lord Null",
  bundle: {
    art: "assets/rookie-bundle.webp",
    name: "TÚI SOI GƯƠNG",
  },
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
    {
      npc: "Đầu tiên, hãy quan sát hình ảnh trước đã. ",
    },
    {
      code: `# dùng show_photos trong camera_charm để hiển thị ảnh
from camera_charm import show_photos

# Hai lớp ảnh rời nhau, chưa dính gì tới nhau

show_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss")], "TWO SEPARATE LAYERS")
`,
      label: "xem_hai_tam_anh.py",
      note: `RUN KIỂM CHỨNG
INPUT là hai tấm ảnh có sẵn trong bài. OUTPUT là cửa sổ lớn đặt hai tấm cạnh nhau ở đúng kích thước gốc: con hươu ánh sáng trên nền đen, và con quái khói tím cũng trên nền đen. Cửa sổ đứng yên tới khi bạn bấm TIẾP TỤC.`,
      expectOut: {
        kind: "studio_start",
        minCount: 1,
      },
      solution: `from camera_charm import show_photos

show_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss")], "TWO SEPARATE LAYERS")
`,
    },
    {
      npc: "Đây là câu đố Pip đặt ra cho bạn: làm sao đưa con hươu lao thẳng vào con quái trong CÙNG một khung hình? Bạn đoán thử xem gương phải làm gì với hai hình đó.",
    },
    {
      code: `from camera_charm import show_photos

# Đây là mục tiêu: 
show_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss"), ("STAG OVER BEAST", "goal")], "THE GOAL: ONE SINGLE FRAME")
`,
      label: "xem_dich_toi.py",
      note: `RUN KIỂM CHỨNG
INPUT vẫn là hai tấm ảnh cũ, cộng thêm tấm kết quả đã dựng sẵn. OUTPUT là cửa sổ ba tấm: con hươu, con quái, và khung hình cuối cùng có con hươu lao qua làn khói tím. Tấm thứ ba chính là thứ bạn sẽ tự dựng được ở cuối đảo — nhìn kỹ xem chỗ nào sáng lên, chỗ nào giữ nguyên.`,
      expectOut: {
        kind: "studio_start",
        minCount: 1,
      },
      solution: `from camera_charm import show_photos

show_photos([("SPIRIT STAG", "stag"), ("ERROR BEAST", "boss"), ("STAG OVER BEAST", "goal")], "THE GOAL: ONE SINGLE FRAME")
`,
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
      npc: "Đúng hướng rồi đó. Nhưng muốn chồng được hai hình thì trước hết phải biết cách đã. Chúng ta không thể làm như hai tờ giấy chồng nhau hoàn toàn. Điều đó sẽ làm nền đen  hình này che mất hình kia đúng không? ",
    },
    {
      npc: "Trong lòng gương, một hình chỉ là bảng số: mỗi ô ghi ánh sáng ở chỗ đó mạnh hay yếu. Mình đọc cùng một hình ở hai độ mịn để thấy bảng số đó thô hay mịn ra sao.",
    },
    {
      code: `from camera_charm import load_plate, compare_frames

# Ảnh gốc, rồi chính nó đọc thành lưới ở hai độ mịn
fine = load_plate("stag", 24)
coarse = load_plate("stag", 8)

compare_frames([("GRID 24", fine, "stag"), ("GRID 8", coarse, "stag")], "FROM PICTURE TO NUMBERS", False)
`,
      label: "so_anh_that_voi_luoi.py",
      note: `RUN KIỂM CHỨNG
INPUT là tấm hiệu ứng con hươu có sẵn trong bài. OUTPUT là cửa sổ hai khung, mỗi khung đặt ảnh gốc sắc nét ngay cạnh lưới ô của chính nó: một khung chia 24 ô mỗi chiều, một khung chỉ còn 8 ô. Càng ít ô thì mỗi ô càng phải gánh một mảng rộng, nên lưới càng thô so với ảnh gốc bên cạnh — nhưng lưới mới là dạng mà vòng lặp Python duyệt được.`,
      expectOut: {
        kind: "studio_start",
        minCount: 3,
      },
      solution: `from camera_charm import load_plate, compare_frames

fine = load_plate("stag", 24)
coarse = load_plate("stag", 8)

compare_frames([("GRID 24", fine, "stag"), ("GRID 8", coarse, "stag")], "FROM PICTURE TO NUMBERS", False)
`,
    },
    {
      npc: "Số ô càng nhiều thì mỗi ô càng nhỏ và hình càng rõ; số ô càng ít thì mỗi ô phải gánh một mảng rộng nên hình nhòe đi. Giờ mình mở luôn phần số nằm sau bức tranh.",
    },
    {
      code: `from camera_charm import load_plate, compare_frames

# Lưới 8 ô để con số còn đọc được bằng mắt
small = load_plate("stag", 8)
compare_frames([("GRID 8", small, "stag")], "BRIGHTNESS OF EACH CELL", True)
`,
      label: "xem_con_so.py",
      note: `RUN KIỂM CHỨNG
INPUT là tấm hiệu ứng đọc ở lưới 8×8 cho con số còn đủ to. OUTPUT là cửa sổ hiện đúng bức tranh đó kèm bảng số: mỗi ô ghi độ sáng của chính nó và được tô đúng màu của nó. Ô càng sáng thì số càng lớn; ô nền tối có số gần 0.`,
      expectOut: {
        kind: "studio_start",
        minCount: 2,
      },
      solution: `from camera_charm import load_plate, compare_frames

small = load_plate("stag", 8)
compare_frames([("GRID 8", small, "stag")], "BRIGHTNESS OF EACH CELL", True)
`,
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
            a: [
              "`90`",
              "`270`",
              "`120`",
            ],
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
    {
      npc: "Đã đọc được bảng số thì bạn ghi vào đó được luôn. Ghi đè giá trị lên một vùng ô, và hình trong gương phải đổi ngay đúng chỗ đó.",
    },
    {
      code: `from old_computer import say_num
from camera_charm import load_plate, compare_frames

before = load_plate("stag", 8)

# Chép sang một lưới mới để vẫn giữ được ảnh gốc mà so sánh
after = []
for row in range(len(before)):
    line = []
    for col in range(len(before[row])):
        line.append(before[row][col])
    after.append(line)

# lượt của bạn: tô trắng vùng từ hàng 2 tới hàng 5 và từ cột 2 tới cột 5
for row in range(2, 6):
    for col in range(2, 6):
        after[row][col] = before[row][col]

painted = 0
for row in range(len(after)):
    for col in range(len(after[row])):
        if after[row][col] == [255, 255, 255]:
            painted = painted + 1
say_num(painted)

compare_frames([("BEFORE", before, "stag"), ("AFTER", after)], "PAINT A REGION BY HAND", True)
`,
      label: "tu_to_mot_vung.py",
      note: "ĐỀ BÀI\nINPUT là tấm hiệu ứng đọc ở lưới 8×8; `after` là bản chép của nó để bạn sửa mà vẫn giữ được ảnh gốc. Dòng gán trong vòng lặp đang chép lại đúng giá trị cũ nên chưa có gì đổi. Hãy gán `[255, 255, 255]` cho mỗi ô trong vùng đó để tô trắng. OUTPUT đúng là số `16` (vùng 4 hàng × 4 cột) và cửa sổ so sánh cho thấy một khối trắng vuông vắn xuất hiện giữa ảnh AFTER, kèm bảng số đổi thành 255.",
      expectOut: {
        all: [
          /^16$/,
        ],
      },
      solution: `from old_computer import say_num
from camera_charm import load_plate, compare_frames

before = load_plate("stag", 8)

after = []
for row in range(len(before)):
    line = []
    for col in range(len(before[row])):
        line.append(before[row][col])
    after.append(line)

for row in range(2, 6):
    for col in range(2, 6):
        after[row][col] = [255, 255, 255]

painted = 0
for row in range(len(after)):
    for col in range(len(after[row])):
        if after[row][col] == [255, 255, 255]:
            painted = painted + 1
say_num(painted)

compare_frames([("BEFORE", before, "stag"), ("AFTER", after)], "PAINT A REGION BY HAND", True)
`,
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
            a: [
              "`16` ô, vì 4 hàng nhân 4 cột",
              "`8` ô, vì 4 hàng cộng 4 cột",
              "`4` ô, vì mỗi vòng lặp chạy 4 lần",
            ],
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
    {
      npc: "Thần chú đầu tiên của gương là lật hình theo chiều ngang — đúng việc một tấm gương vẫn làm. Gương không xoay hình trong không gian đâu; nó chỉ đọc lại từng hàng theo thứ tự cột ngược lại.",
    },
    {
      npc: "Trong một hàng có `n` cột, cột cuối cùng mang chỉ số `n - 1`. Ô mới ở cột `col` nhận giá trị của ô cũ ở cột `n - 1 - col`.",
    },
    {
      code: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

fx = load_plate("stag", 16)
flipped = blank_grid(len(fx), len(fx[0]))

for row in range(len(fx)):
    last = len(fx[row]) - 1
    for col in range(len(fx[row])):
        flipped[row][col] = fx[row][col]  # lượt của bạn: đổi thành ô đối xứng

# Bài tự kiểm tra: lật hai lần phải ra đúng ảnh gốc, và lật một lần phải đổi ảnh
back = blank_grid(len(flipped), len(flipped[0]))
for row in range(len(flipped)):
    last = len(flipped[row]) - 1
    for col in range(len(flipped[row])):
        back[row][col] = flipped[row][last - col]

changed = 0
broken = 0
for row in range(len(fx)):
    for col in range(len(fx[row])):
        if flipped[row][col] != fx[row][col]:
            changed = changed + 1
        if back[row][col] != fx[row][col]:
            broken = broken + 1

if changed > 0:
    say("IMAGE CHANGED SIDES")
if broken == 0:
    say("TWO FLIPS RESTORE THE SOURCE")

compare_frames([("BEFORE FLIP", fx, "stag"), ("AFTER FLIP", flipped, "flipped")], "MIRROR THE IMAGE")
`,
      label: "viet_lenh_lat_anh.py",
      note: "ĐỀ BÀI\nINPUT là tấm hiệu ứng con hươu 16×16. Dòng gán trong vòng lặp đang chép y nguyên từng ô nên ảnh không hề lật. Hãy sửa dòng đó để ô ở cột `col` nhận giá trị của ô đối xứng trong cùng hàng; biến `last` đã giữ sẵn chỉ số cột cuối cùng. OUTPUT đúng phải in cả hai dòng `IMAGE CHANGED SIDES` và `TWO FLIPS RESTORE THE SOURCE`, rồi mở cửa sổ đặt ảnh trước và ảnh sau cạnh nhau — con hươu phải quay đầu sang phía ngược lại.",
      expectOut: {
        all: [
          /IMAGE CHANGED SIDES/,
          /TWO FLIPS RESTORE THE SOURCE/,
        ],
      },
      solution: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

fx = load_plate("stag", 16)
flipped = blank_grid(len(fx), len(fx[0]))

for row in range(len(fx)):
    last = len(fx[row]) - 1
    for col in range(len(fx[row])):
        flipped[row][col] = fx[row][last - col]

back = blank_grid(len(flipped), len(flipped[0]))
for row in range(len(flipped)):
    last = len(flipped[row]) - 1
    for col in range(len(flipped[row])):
        back[row][col] = flipped[row][last - col]

changed = 0
broken = 0
for row in range(len(fx)):
    for col in range(len(fx[row])):
        if flipped[row][col] != fx[row][col]:
            changed = changed + 1
        if back[row][col] != fx[row][col]:
            broken = broken + 1

if changed > 0:
    say("IMAGE CHANGED SIDES")
if broken == 0:
    say("TWO FLIPS RESTORE THE SOURCE")

compare_frames([("BEFORE FLIP", fx, "stag"), ("AFTER FLIP", flipped, "flipped")], "MIRROR THE IMAGE")
`,
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
            a: [
              "Cột 5",
              "Cột 2",
              "Cột 6",
            ],
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
      code: `from old_computer import say, say_num

# Hai ô cùng vị trí: một ô của nền, một ô của lớp hiệu ứng
scene_pixel = [40, 52, 70]
fx_dark = [0, 0, 0]
fx_glow = [230, 240, 250]

say_num(min(255, scene_pixel[0] + fx_dark[0]))
say_num(min(255, scene_pixel[0] + fx_glow[0]))
say("Adding a black cell keeps the base")
`,
      label: "cong_hai_o.py",
      note: "RUN KIỂM CHỨNG\nBài này không có INPUT; ba ô đã được gán sẵn để bạn nhìn rõ phép cộng. PROCESS cộng kênh đỏ của nền với kênh đỏ của lớp hiệu ứng rồi kẹp bằng `min(255, ...)`. OUTPUT là `40` khi cộng với ô đen, `255` khi cộng với ô sáng (vì 40 + 230 = 270 đã vượt mức 255), và dòng nhắc lại luật.",
      expectOut: {
        all: [
          /^40$/,
          /^255$/,
          /Adding a black cell keeps the base/,
        ],
      },
      solution: `from old_computer import say, say_num

scene_pixel = [40, 52, 70]
fx_dark = [0, 0, 0]
fx_glow = [230, 240, 250]

say_num(min(255, scene_pixel[0] + fx_dark[0]))
say_num(min(255, scene_pixel[0] + fx_glow[0]))
say("Adding a black cell keeps the base")
`,
    },
    {
      code: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

scene = load_plate("scene", 16)
fx = load_plate("stag", 16)
result = blank_grid(len(scene), len(scene[0]))

for row in range(len(scene)):
    for col in range(len(scene[row])):
        base = scene[row][col]
        layer = fx[row][col]
        red = base[0]  # lượt của bạn: cộng thêm layer[0] rồi kẹp bằng min(255, ...)
        green = base[1]  # lượt của bạn: làm tương tự với kênh xanh lá
        blue = base[2]  # lượt của bạn: làm tương tự với kênh xanh dương
        result[row][col] = [red, green, blue]

# Bài tự kiểm tra: không kênh nào được vượt 255, và không chỗ nào được tối đi
too_big = 0
darker = 0
brighter = 0
for row in range(len(result)):
    for col in range(len(result[row])):
        for channel in range(3):
            if result[row][col][channel] > 255:
                too_big = too_big + 1
            if result[row][col][channel] < scene[row][col][channel]:
                darker = darker + 1
            if result[row][col][channel] > scene[row][col][channel]:
                brighter = brighter + 1

if too_big == 0:
    say("ALL CHANNELS WITHIN 255")
if darker == 0:
    say("NOTHING GOT DARKER")
if brighter > 0:
    say("EFFECT AREA GOT BRIGHTER")

compare_frames([("BASE", scene, "scene"), ("EFFECT LAYER", fx, "stag"), ("AFTER ADD", result, "stagscene")], "LAYER ONTO A BASE")
`,
      label: "viet_lenh_cong_hai_lop.py",
      note: "ĐỀ BÀI\nINPUT là hai tấm ảnh có sẵn: `scene` là nền ngọn hải đăng ban đêm, `fx` là lớp con hươu quay trên nền đen. Ba dòng gán `red`, `green`, `blue` đang chép nguyên nền nên lớp hiệu ứng chưa hiện ra. Hãy cộng thêm kênh tương ứng của `layer` vào từng dòng và kẹp kết quả bằng `min(255, ...)`. OUTPUT đúng phải in đủ ba dòng `ALL CHANNELS WITHIN 255`, `NOTHING GOT DARKER`, `EFFECT AREA GOT BRIGHTER`, rồi mở cửa sổ đặt nền, lớp hiệu ứng và kết quả cạnh nhau.",
      expectOut: {
        all: [
          /ALL CHANNELS WITHIN 255/,
          /NOTHING GOT DARKER/,
          /EFFECT AREA GOT BRIGHTER/,
        ],
      },
      solution: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

scene = load_plate("scene", 16)
fx = load_plate("stag", 16)
result = blank_grid(len(scene), len(scene[0]))

for row in range(len(scene)):
    for col in range(len(scene[row])):
        base = scene[row][col]
        layer = fx[row][col]
        red = min(255, base[0] + layer[0])
        green = min(255, base[1] + layer[1])
        blue = min(255, base[2] + layer[2])
        result[row][col] = [red, green, blue]

too_big = 0
darker = 0
brighter = 0
for row in range(len(result)):
    for col in range(len(result[row])):
        for channel in range(3):
            if result[row][col][channel] > 255:
                too_big = too_big + 1
            if result[row][col][channel] < scene[row][col][channel]:
                darker = darker + 1
            if result[row][col][channel] > scene[row][col][channel]:
                brighter = brighter + 1

if too_big == 0:
    say("ALL CHANNELS WITHIN 255")
if darker == 0:
    say("NOTHING GOT DARKER")
if brighter > 0:
    say("EFFECT AREA GOT BRIGHTER")

compare_frames([("BASE", scene, "scene"), ("EFFECT LAYER", fx, "stag"), ("AFTER ADD", result, "stagscene")], "LAYER ONTO A BASE")
`,
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
            a: [
              "`[200, 180, 160]`",
              "`[0, 0, 0]`",
              "`[255, 255, 255]`",
            ],
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
    {
      npc: "Giờ quay lại câu đố gương đặt ra lúc đầu. Vẫn đúng phép cộng đó, chỉ đổi hai lớp mang vào thành con hươu và con quái — chính là hình bạn được xem ngay từ đầu.",
    },
    {
      code: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

stag = load_plate("stag", 16)
boss = load_plate("boss", 16)

result = blank_grid(len(stag), len(stag[0]))
for row in range(len(stag)):
    for col in range(len(stag[row])):
        a = stag[row][col]
        b = boss[row][col]
        result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]

lit = 0
for row in range(len(result)):
    for col in range(len(result[row])):
        if result[row][col][0] > stag[row][col][0]:
            lit = lit + 1
if lit > 0:
    say("STAG IS OVER THE BEAST")

compare_frames([("SPIRIT STAG", stag, "stag"), ("ERROR BEAST", boss, "boss"), ("YOU BUILT THIS", result, "goal"), ("GOAL", "goal")], "THE OPENING PUZZLE, SOLVED")
`,
      label: "giai_cau_do_mo_man.py",
      note: "RUN KIỂM CHỨNG\nINPUT là hai lớp ảnh con hươu và con quái, cùng đọc ở lưới 16 ô. PROCESS dùng lại đúng phép cộng kèm `min(255, ...)` bạn vừa viết, không đổi một dòng nào. OUTPUT là dòng `STAG IS OVER THE BEAST` và cửa sổ bốn tấm: hai lớp rời, khung hình do chính bạn dựng, và tấm đích đã xem ở đầu đảo để bạn đối chiếu.",
      expectOut: {
        all: [
          /STAG IS OVER THE BEAST/,
        ],
      },
      solution: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

stag = load_plate("stag", 16)
boss = load_plate("boss", 16)

result = blank_grid(len(stag), len(stag[0]))
for row in range(len(stag)):
    for col in range(len(stag[row])):
        a = stag[row][col]
        b = boss[row][col]
        result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]

lit = 0
for row in range(len(result)):
    for col in range(len(result[row])):
        if result[row][col][0] > stag[row][col][0]:
            lit = lit + 1
if lit > 0:
    say("STAG IS OVER THE BEAST")

compare_frames([("SPIRIT STAG", stag, "stag"), ("ERROR BEAST", boss, "boss"), ("YOU BUILT THIS", result, "goal"), ("GOAL", "goal")], "THE OPENING PUZZLE, SOLVED")
`,
    },
    {
      remember: "Một khung hình trong gương luôn được dựng từ hai thứ rời nhau: tấm nền và hình phản chiếu nằm trên nền đen. Gương giữ chúng riêng, rồi cộng lại đúng lúc cần hiện.",
    },
    {
      npc: "Ngoài kia bạn không gõ tên thần chú. Bạn niệm nó thành tiếng, và gương phải tự nghe lấy. Pip vừa mở cho bạn một cái bùa nghe tên là `voice_charm`.",
    },
    {
      npc: "`listen(spells)` mở micro và chờ. Bạn phát âm trong các từ trong `spells` thì nó trả về đúng từ đó; gương không nghe ra từ nào thì nó trả về chuỗi rỗng `\"\"`.",
    },
    {
      code: `from old_computer import say
from voice_charm import listen

# INPUT thật: từ bạn niệm ra tiếng. Gương chỉ nhận ba từ trong danh sách này.
spells = ["koto", "boss", "flip"]
command = listen(spells)

say("Guong nghe duoc:")
say(command)
`,
      label: "nghe_than_chu.py",
      note: "RUN KIỂM CHỨNG\nINPUT là giọng của bạn. Khi chạy, gương mở micro và chờ vài giây — hãy niệm to một từ trong `spells`. Nếu micro chưa bật được thì gương hiện sẵn ba từ đó thành nút bấm, bạn chạm một nút cũng được. OUTPUT là dòng `Guong nghe duoc:` rồi tới đúng từ gương bắt được; không nghe ra từ nào thì dòng thứ hai trống.",
      expectOut: {
        all: [
          /Guong nghe duoc:/,
        ],
      },
      solution: `from old_computer import say
from voice_charm import listen

spells = ["koto", "boss", "flip"]
command = listen(spells)

say("Guong nghe duoc:")
say(command)
`,
    },
    {
      npc: "Chọn theo điều kiện thì dùng `if`, `elif` và `else`. Nhánh `else` lo phần quan trọng: khi gương nghe ra một từ lạ, hoặc không nghe được gì, nó vẫn phải xử sự tử tế.",
    },
    {
      code: `from old_computer import say
from voice_charm import listen
from camera_charm import load_plate, compare_frames

spells = ["koto", "boss"]
command = listen(spells)
scene = load_plate("scene", 16)

if command == "koto":
    say("SPIRIT STAG SUMMONED")
    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("stag", 16), "stag")], "KOTO")
elif command == "boss":
    say("ERROR BEAST SUMMONED")
    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("boss", 16), "bossscene")], "BOSS")
else:
    say("UNKNOWN WORD")
`,
      label: "chon_hieu_ung_theo_loi.py",
      note: "RUN KIỂM CHỨNG\nINPUT là từ bạn niệm ra tiếng, do `listen(spells)` bắt được. PROCESS so từ đó với từng mốc bằng `if` và `elif`. OUTPUT phụ thuộc vào từ bạn niệm: `koto` cho ra dòng `SPIRIT STAG SUMMONED` kèm cửa sổ đặt nền cạnh hình con hươu, `boss` cho ra con quái, còn im lặng cho hết giờ thì nhánh `else` chạy. Nhánh nào chạy cũng được tính là xong — điều cần thấy là bộ chọn đưa đúng từ tới đúng nhánh.",
      expectOut: [
        /SPIRIT STAG SUMMONED/,
        /ERROR BEAST SUMMONED/,
        /UNKNOWN WORD/,
      ],
      solution: `from old_computer import say
from voice_charm import listen
from camera_charm import load_plate, compare_frames

spells = ["koto", "boss"]
command = listen(spells)
scene = load_plate("scene", 16)

if command == "koto":
    say("SPIRIT STAG SUMMONED")
    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("stag", 16), "stag")], "KOTO")
elif command == "boss":
    say("ERROR BEAST SUMMONED")
    compare_frames([("BASE", scene, "scene"), ("SUMMONED LAYER", load_plate("boss", 16), "bossscene")], "BOSS")
else:
    say("UNKNOWN WORD")
`,
    },
    {
      npc: "Gương còn nghe được thần chú `flip`, và từ đó không gọi hình phản chiếu nào cả — nó lật chính khung hình đang chiếu. Bạn hãy thêm nhánh cho nó.",
    },
    {
      code: `from old_computer import say

# Bốn từ này lần lượt được đưa vào bộ chọn, thay cho bốn lần nghe micro
heard = ["koto", "boss", "flip", "meo meo"]

for command in heard:
    if command == "koto":
        say("SPIRIT STAG SUMMONED")
    elif command == "boss":
        say("ERROR BEAST SUMMONED")
    else:
        say("UNKNOWN WORD")
`,
      label: "them_nhanh_lat_hinh.py",
      note: "ĐỀ BÀI\nINPUT là bốn từ đã gán sẵn trong `heard`, chạy lần lượt qua bộ chọn. Bộ chọn hiện chưa biết từ `flip` nên nó rơi xuống nhánh `else`. Hãy thêm một nhánh `elif` cho `flip` in ra `MIRROR THE FRAME`, đặt trước `else`. OUTPUT đúng gồm bốn dòng theo thứ tự: `SPIRIT STAG SUMMONED`, `ERROR BEAST SUMMONED`, `MIRROR THE FRAME`, `UNKNOWN WORD`.",
      expectOut: {
        all: [
          /SPIRIT STAG SUMMONED/,
          /ERROR BEAST SUMMONED/,
          /MIRROR THE FRAME/,
          /UNKNOWN WORD/,
        ],
      },
      solution: `from old_computer import say

heard = ["koto", "boss", "flip", "meo meo"]

for command in heard:
    if command == "koto":
        say("SPIRIT STAG SUMMONED")
    elif command == "boss":
        say("ERROR BEAST SUMMONED")
    elif command == "flip":
        say("MIRROR THE FRAME")
    else:
        say("UNKNOWN WORD")
`,
    },
    {
      quiz: {
        title: "Bộ chọn hiệu ứng",
        questions: [
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\nif command == \"koto\":\n    say(\"HUOU\")\nelif command == \"boss\":\n    say(\"QUAI\")\nelse:\n    say(\"LA\")\n```\nVới `command = \"boss\"`, máy in ra gì?",
            a: [
              "`QUAI`",
              "`HUOU`",
              "`QUAI` rồi `LA`",
            ],
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
      code: `from old_computer import say
from voice_charm import listen
from camera_charm import play_effect

spells = ["phoenix", "butterfly", "sakura"]
command = listen(spells)

if command == "phoenix":
    say("PHOENIX RISES")
    play_effect("phoenix")
elif command == "butterfly":
    say("BUTTERFLY SWARM")
    play_effect("butterfly")
elif command == "sakura":
    say("SAKURA BLOOM")
    play_effect("sakura")
else:
    say("UNKNOWN WORD")
`,
      label: "tha_than_chu_co_that.py",
      note: "RUN KIỂM CHỨNG\nINPUT là thần chú bạn niệm ra tiếng. PROCESS vẫn là chuỗi `if`/`elif`/`else` quen thuộc. OUTPUT lần này là lớp hiệu ứng cỡ thật chiếu đè lên hình camera của bạn, đúng theo từ bạn niệm: phượng hoàng bung cánh, đàn bướm pha lê, hoặc trận mưa hoa anh đào. Niệm từ nào cũng được tính là xong; gương không nghe ra từ nào thì nhánh `else` chạy, và như vậy cũng là đúng. Chỗ nào lớp hiệu ứng tối thì hình bạn giữ nguyên, chỗ nào nó sáng thì sáng bừng lên — đúng luật cộng ánh sáng bạn vừa viết.",
      expectOut: { all: [[
        /PHOENIX RISES/,
        /BUTTERFLY SWARM/,
        /SAKURA BLOOM/,
        /UNKNOWN WORD/,
      ], { kind: 'studio_start', text: /effect_play/, minCount: 1 }] },
      solution: `from old_computer import say
from voice_charm import listen
from camera_charm import play_effect

spells = ["phoenix", "butterfly", "sakura"]
command = listen(spells)

if command == "phoenix":
    say("PHOENIX RISES")
    play_effect("phoenix")
elif command == "butterfly":
    say("BUTTERFLY SWARM")
    play_effect("butterfly")
elif command == "sakura":
    say("SAKURA BLOOM")
    play_effect("sakura")
else:
    say("UNKNOWN WORD")
`,
    },
    {
      npc: "Trước khi đi tiếp, Pip nói thật cho bạn nghe `play_effect` là gì. Nó không có phép màu nào cả: nó chỉ mở một tệp video rồi đè lên khung hình.",
    },
    {
      code: `from old_computer import say
from camera_charm import show_effect_source

# Xem thang tep hieu ung: khong camera, khong pha tron
say("DAY LA TEP GOC")
show_effect_source("stag")
show_effect_source("phoenix")
`,
      label: "xem_tep_goc.py",
      note: `RUN KIỂM CHỨNG
INPUT là hai tệp hiệu ứng có sẵn. OUTPUT là chính hai tệp đó chiếu một mình: không có camera bên dưới, cũng không pha trộn gì. Nhìn kỹ mà xem — mỗi tệp chỉ là ánh sáng nằm trên một hình chữ nhật ĐEN, đúng thứ bạn đã cộng bằng tay ở lưới 16 ô.`,
      expectOut: {
        all: [
          /DAY LA TEP GOC/,
        ,
          { kind: 'studio_start', text: /effect_play/, minCount: 2 },
        ],
      },
      solution: `from old_computer import say
from camera_charm import show_effect_source

# Xem thang tep hieu ung: khong camera, khong pha tron
say("DAY LA TEP GOC")
show_effect_source("stag")
show_effect_source("phoenix")
`,
    },
    {
      npc: "Và một đoạn video cũng không phải thứ gì lạ: nó là một DANH SÁCH ảnh, chiếu nối nhau thật nhanh. Mình lấy thử bốn khung hình ra khỏi đoạn con hươu.",
    },
    {
      code: `from old_computer import say, say_num
from camera_charm import load_plate, compare_frames

# Bon khung hinh that, lay ra tu chinh doan video con huou
frames = [load_plate("frame0", 16), load_plate("frame1", 16),
          load_plate("frame2", 16), load_plate("frame3", 16)]

say("SO KHUNG HINH:")
say_num(len(frames))
compare_frames([("KHUNG 0", frames[0], "frame0"), ("KHUNG 1", frames[1], "frame1"),
                ("KHUNG 2", frames[2], "frame2"), ("KHUNG 3", frames[3], "frame3")],
               "A VIDEO IS A LIST OF PICTURES", False)
`,
      label: "video_la_danh_sach_anh.py",
      note: "RUN KIỂM CHỨNG\nINPUT là bốn khung hình được cắt ra từ chính đoạn video con hươu. OUTPUT là số `4` và cửa sổ đặt bốn khung cạnh nhau. Chúng chỉ khác nhau chút ít, vì chúng là bốn thời điểm liền nhau của cùng một chuyển động — chiếu nối tiếp đủ nhanh thì mắt thấy con hươu đang chạy.",
      expectOut: {
        all: [
          /^4$/,
        ],
      },
      solution: `from old_computer import say, say_num
from camera_charm import load_plate, compare_frames

# Bon khung hinh that, lay ra tu chinh doan video con huou
frames = [load_plate("frame0", 16), load_plate("frame1", 16),
          load_plate("frame2", 16), load_plate("frame3", 16)]

say("SO KHUNG HINH:")
say_num(len(frames))
compare_frames([("KHUNG 0", frames[0], "frame0"), ("KHUNG 1", frames[1], "frame1"),
                ("KHUNG 2", frames[2], "frame2"), ("KHUNG 3", frames[3], "frame3")],
               "A VIDEO IS A LIST OF PICTURES", False)
`,
    },
    {
      npc: "Giờ ghép hai điều đó lại. Bạn đã biết cộng hai lưới thành một khung hình. Một đoạn video chỉ là nhiều khung hình. Vậy làm một khung trước đã.",
    },
    {
      code: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

# play_effect chi la phep cong nay, chay tren MOT khung hinh.
def play_effect_myself(base, layer):
    result = blank_grid(len(base), len(base[0]))
    for row in range(len(base)):
        for col in range(len(base[row])):
            a = base[row][col]
            b = layer[row][col]
            result[row][col] = a  # luot cua ban: cong a voi b roi kep bang min(255, ...)
    return result

scene = load_plate("scene", 16)
fx = load_plate("frame1", 16)
shot = play_effect_myself(scene, fx)

lit = 0
for row in range(len(shot)):
    for col in range(len(shot[row])):
        if shot[row][col][0] > scene[row][col][0]:
            lit = lit + 1
if lit > 0:
    say("ONE FRAME DONE")

compare_frames([("NEN", scene, "scene"), ("MOT KHUNG FX", fx, "frame1"), ("DA GHEP", shot)], "BLEND ONE FRAME")
`,
      label: "tu_viet_play_effect.py",
      note: "ĐỀ BÀI\nINPUT là tấm nền và MỘT khung hình của lớp con hươu. Hãy hoàn thiện lệnh `play_effect_myself`: dòng gán trong vòng lặp đang chép nguyên ô nền, bạn sửa nó thành cộng `a` với `b` từng kênh rồi kẹp bằng `min(255, ...)`. OUTPUT đúng phải in `ONE FRAME DONE` và mở cửa sổ có khung hình đã ghép.",
      expectOut: {
        all: [
          /ONE FRAME DONE/,
        ],
      },
      solution: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

# play_effect chi la phep cong nay, chay tren MOT khung hinh.
def play_effect_myself(base, layer):
    result = blank_grid(len(base), len(base[0]))
    for row in range(len(base)):
        for col in range(len(base[row])):
            a = base[row][col]
            b = layer[row][col]
            result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]
    return result

scene = load_plate("scene", 16)
fx = load_plate("frame1", 16)
shot = play_effect_myself(scene, fx)

lit = 0
for row in range(len(shot)):
    for col in range(len(shot[row])):
        if shot[row][col][0] > scene[row][col][0]:
            lit = lit + 1
if lit > 0:
    say("ONE FRAME DONE")

compare_frames([("NEN", scene, "scene"), ("MOT KHUNG FX", fx, "frame1"), ("DA GHEP", shot)], "BLEND ONE FRAME")
`,
    },
    {
      npc: "Xong một khung rồi. Mà bốn khung thì cũng chỉ là làm lại việc đó bốn lần — đúng chỗ để `for` ra tay.",
    },
    {
      code: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

def play_effect_myself(base, layer):
    result = blank_grid(len(base), len(base[0]))
    for row in range(len(base)):
        for col in range(len(base[row])):
            a = base[row][col]
            b = layer[row][col]
            result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]
    return result

scene = load_plate("scene", 16)
frames = [load_plate("frame0", 16), load_plate("frame1", 16),
          load_plate("frame2", 16), load_plate("frame3", 16)]

# lot cua ban: cho for chay qua tung khung hinh, ghep tung cai roi cat vao shots
shots = []
say("DA GHEP XONG CA DOAN")

labels = []
for i in range(len(shots)):
    labels.append(("KHUNG " + str(i), shots[i]))
compare_frames(labels, "A FOR LOOP MAKES IT A VIDEO", False)
`,
      label: "for_noi_thanh_video.py",
      note: "ĐỀ BÀI\nINPUT là tấm nền `scene` và danh sách `frames` gồm bốn khung hình của lớp con hươu; lệnh `play_effect_myself(base, layer)` đã hoàn chỉnh sẵn trong ô này và trả về một khung hình đã ghép. Hãy dùng `for` chạy qua từng khung trong `frames`, gọi lệnh đó với `scene`, rồi `append` kết quả vào danh sách `shots`. OUTPUT đúng phải in `DA GHEP XONG CA DOAN` và mở cửa sổ có đủ bốn khung hình đã ghép — đó chính là một đoạn video do bạn dựng.",
      expectOut: {
        all: [
          /DA GHEP XONG CA DOAN/,
        ],
      },
      solution: `from old_computer import say
from camera_charm import load_plate, blank_grid, compare_frames

def play_effect_myself(base, layer):
    result = blank_grid(len(base), len(base[0]))
    for row in range(len(base)):
        for col in range(len(base[row])):
            a = base[row][col]
            b = layer[row][col]
            result[row][col] = [min(255, a[0] + b[0]), min(255, a[1] + b[1]), min(255, a[2] + b[2])]
    return result

scene = load_plate("scene", 16)
frames = [load_plate("frame0", 16), load_plate("frame1", 16),
          load_plate("frame2", 16), load_plate("frame3", 16)]

shots = []
for frame in frames:
    shots.append(play_effect_myself(scene, frame))
say("DA GHEP XONG CA DOAN")

labels = []
for i in range(len(shots)):
    labels.append(("KHUNG " + str(i), shots[i]))
compare_frames(labels, "A FOR LOOP MAKES IT A VIDEO", False)
`,
    },
    {
      remember: "`play_effect` không phải phép màu. Một đoạn video là một danh sách khung hình; ghép hiệu ứng vào video là cộng `min(255, base + layer)` cho MỘT khung, rồi để `for` lặp lại đúng việc đó trên mọi khung. Cái bạn viết trên lưới 16 ô và cái máy chạy trên khung 1280 ô là cùng một phép tính.",
    },
    {
      quiz: {
        title: "Một khung hình, rồi cả đoạn video",
        questions: [
          {
            q: "Bạn đã viết được lệnh ghép MỘT khung hình lên nền. Muốn ghép cả đoạn video 240 khung thì cần thêm gì?",
            a: [
              "Một vòng `for` chạy qua danh sách khung hình, gọi lại đúng lệnh đó cho từng khung",
              "Một phép tính hoàn toàn khác, vì video không giống ảnh",
              "Không cần gì thêm, vì lệnh tự chạy hết cả đoạn video",
            ],
            correct: 0,
          },
          {
            q: "Đoạn video hiệu ứng được quay trên nền đen. Vì sao chi tiết đó lại quan trọng khi ghép?",
            a: [
              "Vì ô đen có giá trị màu gần `0`, cộng vào nền thì nền gần như không đổi — chỉ phần sáng mới hiện lên",
              "Vì nền đen giúp tệp video nhẹ hơn khi tải về",
              "Vì máy chỉ đọc được video có nền đen",
            ],
            correct: 0,
          },
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\nshots = []\nfor frame in frames:\n    shots.append(play_effect_myself(scene, frame))\n```\nSau khi chạy, `shots` chứa gì?",
            a: [
              "Mỗi khung hình đã được ghép hiệu ứng lên nền, xếp theo đúng thứ tự cũ",
              "Chỉ khung hình cuối cùng, vì mỗi vòng lặp ghi đè lần trước",
              "Danh sách `frames` ban đầu, chưa ghép gì",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nhưng để ý mà xem: lớp hiệu ứng đang phủ đè lên cả mặt bạn. Tới giờ gương mới chỉ biết chồng phẳng, nó chưa biết trong khung hình đâu là người.",
    },
    {
      npc: "Đây là lá bùa cuối cùng. `find_human()` đi hỏi TỪNG Ô một câu duy nhất: ô này có nằm trên người không? Trả lời xong cả lưới là ra viền người.",
    },
    {
      npc: "Có viền người rồi thì gương kẹp bạn vào GIỮA: nền và hiệu ứng `behind` vẽ trước, tới lượt các ô thuộc về người, rồi hiệu ứng `front` vẽ sau cùng.",
    },
    {
      code: `from old_computer import say
from camera_charm import find_human

# scene: nen thay han can phong - behind: hieu ung sau lung ban
# front: hieu ung bay truoc mat ban, sat ong kinh
say("STACKING FOUR LAYERS")
find_human(scene="forest", behind="stag", front="sakura")
say("A FRAME WITH REAL DEPTH")
`,
      label: "bua_tim_nguoi.py",
      note: "RUN KIỂM CHỨNG\nINPUT là hình camera của bạn. PROCESS: `find_human` xét từng ô trong khung hình và hỏi ô đó có thuộc về người hay không; các ô trả lời CÓ gộp lại thành viền người. Sau đó gương xếp bốn lớp — rừng phép thay cho căn phòng, con hươu đi phía SAU lưng bạn, bạn ở giữa, cánh hoa rơi phía TRƯỚC mặt bạn. OUTPUT là khung hình có chiều sâu thật: con hươu bị bạn che bớt, còn cánh hoa thì phủ lên bạn. Vẫn đúng luật cộng ánh sáng cũ, chỉ khác chỗ đứng trong chồng lớp.",
      expectOut: {
        all: [
          /A FRAME WITH REAL DEPTH/,
        ,
          { kind: 'studio_start', text: /human_layers/, minCount: 1 },
        ],
      },
      solution: `from old_computer import say
from camera_charm import find_human

# scene: nen thay han can phong - behind: hieu ung sau lung ban
# front: hieu ung bay truoc mat ban, sat ong kinh
say("STACKING FOUR LAYERS")
find_human(scene="forest", behind="stag", front="sakura")
say("A FRAME WITH REAL DEPTH")
`,
    },
    {
      code: `from old_computer import say
from camera_charm import find_human

# luot cua ban: doi ba lop nay thanh man dien cua rieng ban
# behind: stag / phoenix / butterfly / smoke / lightning
# front: sakura / flower
say("YOUR OWN SHOW")
find_human(scene="forest", behind="phoenix", front="flower")
`,
      label: "man_dien_cua_ban.py",
      note: "XƯỞNG CỦA BẠN — không chấm điểm. Đổi `behind` và `front` để dựng màn diễn của riêng bạn, rồi chạy lại. Thử đặt cùng một hiệu ứng vào `behind` rồi vào `front` để thấy rõ khác biệt: ở `behind` nó bị bạn che, ở `front` nó phủ lên bạn.",
      expectOut: null,
      solution: `from old_computer import say
from camera_charm import find_human

# luot cua ban: doi ba lop nay thanh man dien cua rieng ban
# behind: stag / phoenix / butterfly / smoke / lightning
# front: sakura / flower
say("YOUR OWN SHOW")
find_human(scene="forest", behind="phoenix", front="flower")
`,
    },
    {
      quiz: {
        title: "Thứ tự xa gần",
        questions: [
          {
            q: "Bạn gọi `find_human(scene=\"forest\", behind=\"stag\", front=\"sakura\")`. Trong khung hình kết quả, con hươu và cánh hoa nằm ở đâu so với bạn?",
            a: [
              "Con hươu ở sau lưng nên bị bạn che bớt; cánh hoa ở trước mặt nên phủ lên bạn",
              "Cả hai đều phủ lên bạn, vì hiệu ứng luôn nằm trên cùng",
              "Cả hai đều bị bạn che, vì người luôn nằm trên cùng",
            ],
            correct: 0,
          },
          {
            q: "`find_human` phải trả lời câu hỏi nào cho TỪNG ô của khung hình?",
            a: [
              "Ô này có nằm trên người hay không",
              "Ô này sáng hơn hay tối hơn ô bên cạnh",
              "Ô này nên đổi sang màu gì",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Và bạn không bị bó trong mấy lớp Pip đưa đâu. Tự làm một đoạn video sáng trên nền đen — vẽ, quay, hay nhờ máy dựng đều được — rồi `play_my_effect()` sẽ chiếu chính nó lên hình bạn. Bạn có thể dùng Gemini để tạo video nhé, nhớ hỏi chú Nhựt để lấy prompt :D ",
    },
    {
      code: `from old_computer import say
from camera_charm import play_my_effect

# Chọn một tệp video từ máy của bạn; tệp chỉ được đọc trong trình duyệt
say("CHON MOT DOAN VIDEO")
play_my_effect()
say("DA CHIEU XONG")
`,
      label: "lop_hieu_ung_cua_ban.py",
      note: "XƯỞNG CỦA BẠN — không chấm điểm. INPUT là một tệp video bạn chọn từ thiết bị; nếu bấm hủy thì bài dùng lớp có sẵn để không bị ngắt. Đoạn video càng đúng kiểu SÁNG TRÊN NỀN ĐEN thì ghép càng đẹp, vì phép cộng giữ phần sáng và bỏ qua phần đen. OUTPUT là chính đoạn video đó nằm trên hình camera của bạn.",
      expectOut: null,
      solution: `from old_computer import say
from camera_charm import play_my_effect

say("CHON MOT DOAN VIDEO")
play_my_effect()
say("DA CHIEU XONG")
`,
    },
    {
      npc: "Một mình giọng nói thì chưa đủ. Gương còn nhìn được bàn tay bạn nữa: `listen()` chọn thần chú nào, còn `watch()` đếm số ngón tay để biết niệm mạnh tới đâu.",
    },
    {
      code: `from old_computer import say, say_num
from voice_charm import listen
from camera_charm import watch

# Hai INPUT thật cùng lúc: một từ miệng bạn, một từ bàn tay bạn
spells = ["koto", "boss"]
command = listen(spells)
power = watch()

say(command)
say_num(power)

if power >= 3:
    say("FULL POWER CAST")
else:
    say("WEAK CAST")
`,
      label: "giong_noi_va_ban_tay.py",
      note: "ĐỀ BÀI\nBài này có HAI input thật. `listen(spells)` nghe thần chú bạn niệm; `watch()` đợi bàn tay bạn giơ lên và trả về số ngón tay đang mở. Hãy chạy thử vài lần: đổi thần chú, và đổi số ngón tay giơ lên. OUTPUT là từ nghe được, số ngón tay đếm được, rồi `FULL POWER CAST` khi bạn giơ từ 3 ngón trở lên, ngược lại là `WEAK CAST`. Giơ mấy ngón cũng được tính là xong; hãy chạy hai lần với số ngón khác nhau để thấy cả hai nhánh.",
      expectOut: [
        /FULL POWER CAST/,
        /WEAK CAST/,
      ],
      solution: `from old_computer import say, say_num
from voice_charm import listen
from camera_charm import watch

spells = ["koto", "boss"]
command = listen(spells)
power = watch()

say(command)
say_num(power)

if power >= 3:
    say("FULL POWER CAST")
else:
    say("WEAK CAST")
`,
    },
    {
      npc: "Bạn có đủ mảnh rồi đấy: nghe được lời, đếm được ngón tay, tìm được người, xếp được lớp. Giờ Pip đưa bạn khung sườn, bạn ghép chúng thành một màn diễn hoàn chỉnh.",
    },
    {
      npc: "Mảnh đầu là hai lệnh nhỏ chỉ lo VIỆC NGHĨ. Chúng không chạm vào camera hay micro, nên bạn thử được ngay bằng giá trị tự đặt.",
    },
    {
      code: 'from old_computer import say\n\n# Hai lenh nay la bo nao cua man dien. Chung khong goi camera hay micro,\n# chi nhan mot gia tri vao va tra ve mot quyet dinh.\n\ndef pick_effect(command):\n    """Tra ve ten lop hieu ung ung voi tu nghe duoc."""\n    # luot cua ban: koto -> "stag", boss -> "boss", con lai -> "sakura"\n    return "sakura"\n\ndef pick_depth(power):\n    """Tu 3 ngon tro len thi hieu ung bay TRUOC mat, it hon thi o SAU lung."""\n    # luot cua ban: tra ve "front" hoac "behind"\n    return "behind"\n\n# Thu lai bang cac gia tri co dinh, khong can micro hay camera\nsay(pick_effect("koto"))\nsay(pick_effect("boss"))\nsay(pick_depth(4))\nsay(pick_depth(1))\n',
      label: "du_an_1_bo_nao.py",
      note: "ĐỀ BÀI\nBài này không có INPUT thật; bạn tự đưa giá trị vào để thử. Hãy hoàn thiện hai lệnh: `pick_effect(command)` trả về `\"stag\"` khi nghe `koto`, `\"boss\"` khi nghe `boss`, còn lại trả về `\"sakura\"`; `pick_depth(power)` trả về `\"front\"` khi số ngón từ 3 trở lên, ngược lại `\"behind\"`. OUTPUT đúng gồm bốn dòng theo thứ tự: `stag`, `boss`, `front`, `behind`.",
      expectOut: { all: [/^stag$/m, /^boss$/m, /^front$/m, /^behind$/m] },
      solution: 'from old_computer import say\n\n# Hai lenh nay la bo nao cua man dien. Chung khong goi camera hay micro,\n# chi nhan mot gia tri vao va tra ve mot quyet dinh.\n\ndef pick_effect(command):\n    """Tra ve ten lop hieu ung ung voi tu nghe duoc."""\n    if command == "koto":\n        return "stag"\n    elif command == "boss":\n        return "boss"\n    else:\n        return "sakura"\n\ndef pick_depth(power):\n    """Tu 3 ngon tro len thi hieu ung bay TRUOC mat, it hon thi o SAU lung."""\n    if power >= 3:\n        return "front"\n    else:\n        return "behind"\n\n# Thu lai bang cac gia tri co dinh, khong can micro hay camera\nsay(pick_effect("koto"))\nsay(pick_effect("boss"))\nsay(pick_depth(4))\nsay(pick_depth(1))\n',
    },
    {
      npc: "Mảnh thứ hai là phần CHẠY THẬT. `run_show` đọc hai input thật, hỏi hai lệnh vừa viết, rồi mới xếp lớp — mỗi lệnh lo đúng một việc.",
    },
    {
      code: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import watch, find_human, play_effect, display\n\ndef pick_effect(command):\n    if command == "koto":\n        return "stag"\n    elif command == "boss":\n        return "boss"\n    else:\n        return "sakura"\n\ndef pick_depth(power):\n    if power >= 3:\n        return "front"\n    else:\n        return "behind"\n\ndef run_show():\n    """Doc hai INPUT that, hoi hai lenh tren, roi xep lop."""\n    command = listen(["koto", "boss", "sakura"])\n    power = watch()\n    effect = pick_effect(command)\n    depth = pick_depth(power)\n    say("SPELL: " + effect)\n    display("SPELL: " + effect)\n    say("DEPTH: " + depth)\n    # luot cua ban: goi find_human voi scene="forest" va dat effect vao\n    # dung cho — behind hay front, tuy depth\n    say("SHOW DONE")\n\nrun_show()\n',
      label: "du_an_2_man_dien.py",
      note: "ĐỀ BÀI\nINPUT là giọng nói và bàn tay của bạn. Hai lệnh `pick_effect` và `pick_depth` đã có sẵn đầy đủ trong ô này. Trong `run_show`, hãy gọi `find_human(scene=\"forest\", ...)` và đặt `effect` vào đúng chỗ: nếu `depth` là `\"front\"` thì truyền qua tham số `front`, ngược lại truyền qua `behind`. OUTPUT đúng in `SPELL:`, `DEPTH:` rồi `SHOW DONE`, và dựng đúng màn diễn bạn vừa gọi ra.",
      expectOut: { all: [/SPELL: /, /DEPTH: /, /SHOW DONE/, { kind: 'studio_start', text: /human_layers/, minCount: 1 }] },
      solution: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import watch, find_human, play_effect, display\n\ndef pick_effect(command):\n    if command == "koto":\n        return "stag"\n    elif command == "boss":\n        return "boss"\n    else:\n        return "sakura"\n\ndef pick_depth(power):\n    if power >= 3:\n        return "front"\n    else:\n        return "behind"\n\ndef run_show():\n    """Doc hai INPUT that, hoi hai lenh tren, roi xep lop."""\n    command = listen(["koto", "boss", "sakura"])\n    power = watch()\n    effect = pick_effect(command)\n    depth = pick_depth(power)\n    say("SPELL: " + effect)\n    display("SPELL: " + effect)\n    say("DEPTH: " + depth)\n    if depth == "front":\n        find_human(scene="forest", front=effect)\n    else:\n        find_human(scene="forest", behind=effect)\n    say("SHOW DONE")\n\nrun_show()\n',
    },
    {
      remember: "Một chương trình lớn được ghép từ nhiều lệnh nhỏ, mỗi lệnh lo đúng một việc: `pick_effect` và `pick_depth` chỉ NGHĨ nên thử được bằng giá trị tự đặt, còn `run_show` mới đọc INPUT thật và gọi chúng. Tách như vậy thì hỏng chỗ nào biết ngay chỗ đó.",
    },
    {
      quiz: {
        title: "Ghép các mảnh thành một chương trình",
        questions: [
          {
            q: "Vì sao `pick_depth(power)` thử được ngay mà không cần camera?",
            a: [
              "Vì nó chỉ nhận một con số rồi trả về một chuỗi — nó không tự đi đọc bàn tay",
              "Vì camera luôn trả về 3 ngón nếu không thấy tay",
              "Vì mọi lệnh trong Python đều chạy được khi không có camera",
            ],
            correct: 0,
          },
          {
            q: "Trong `run_show`, thứ tự nào đúng?",
            a: [
              "Đọc INPUT thật trước, hỏi `pick_effect`/`pick_depth` để quyết định, rồi mới xếp lớp",
              "Xếp lớp trước, rồi mới đọc INPUT để xem có hợp không",
              "Gọi `pick_effect` trước khi có `command`, vì lệnh tự biết phải chờ",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Còn một chuyện nữa. Màn diễn vừa rồi chỉ nghe được ĐÚNG MỘT lần rồi tắt. Một sân khấu thật thì phải nghe mãi: niệm xong một thần chú, gương chờ bạn niệm tiếp.",
    },
    {
      npc: "Muốn làm mãi thì dùng `while True`. Nó lặp không có điểm dừng sẵn, nên chính bạn phải đặt cửa ra: nghe thấy `stop` thì `break`.",
    },
    {
      code: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import watch, find_human, play_effect, display\n\ndef pick_effect(command):\n    if command == "koto":\n        return "stag"\n    elif command == "boss":\n        return "boss"\n    else:\n        return "sakura"\n\ndef pick_depth(power):\n    if power >= 3:\n        return "front"\n    else:\n        return "behind"\n\ndef cast_once(command, power):\n    """Dien mot lan: chon lop, chon cho dung, roi xep lop."""\n    effect = pick_effect(command)\n    depth = pick_depth(power)\n    say("CAST: " + effect + " (" + depth + ")")\n    display("CAST: " + effect)\n    if depth == "front":\n        find_human(scene="forest", front=effect)\n    else:\n        play_effect(effect)\n\nspells = ["koto", "boss", "stop"]\n\n# luot cua ban: cho guong nghe MAI, moi lan nghe duoc thi dien mot lan.\n# Nghe thay "stop" thi noi SHOW OVER roi break de thoat vong lap.\nwhile True:\n    command = listen(spells)\n    break\n',
      label: "du_an_3_san_khau_mo.py",
      note: "ĐỀ BÀI\nINPUT là giọng nói và bàn tay bạn, lặp lại bao nhiêu lần tùy bạn. Các lệnh `pick_effect`, `pick_depth` và `cast_once` đã có sẵn đầy đủ trong ô này. Hãy hoàn thiện vòng `while True`: mỗi lần nghe được một từ, nếu đó là `stop` thì nói `SHOW OVER` bằng cả `say` lẫn `display` rồi `break`; nếu không thì đọc số ngón tay bằng `watch()` và gọi `cast_once(command, power)`. Giơ ít ngón thì lớp hiệu ứng chồng phẳng lên cả khung hình; giơ từ 3 ngón trở lên thì nó được xếp quanh người bạn. OUTPUT đúng in một dòng `CAST: ...` cho mỗi thần chú bạn niệm, và kết thúc bằng `SHOW OVER` khi bạn nói `stop`.",
      expectOut: { all: [/CAST: stag/, /CAST: boss/, /SHOW OVER/, { kind: 'studio_start', text: /human_layers|effect_play/, minCount: 2 }] },
      solution: 'from old_computer import say\nfrom voice_charm import listen\nfrom camera_charm import watch, find_human, play_effect, display\n\ndef pick_effect(command):\n    if command == "koto":\n        return "stag"\n    elif command == "boss":\n        return "boss"\n    else:\n        return "sakura"\n\ndef pick_depth(power):\n    if power >= 3:\n        return "front"\n    else:\n        return "behind"\n\ndef cast_once(command, power):\n    """Dien mot lan: chon lop, chon cho dung, roi xep lop."""\n    effect = pick_effect(command)\n    depth = pick_depth(power)\n    say("CAST: " + effect + " (" + depth + ")")\n    display("CAST: " + effect)\n    if depth == "front":\n        find_human(scene="forest", front=effect)\n    else:\n        play_effect(effect)\n\nspells = ["koto", "boss", "stop"]\n\nwhile True:\n    command = listen(spells)\n    if command == "stop":\n        say("SHOW OVER")\n        display("SHOW OVER")\n        break\n    power = watch()\n    cast_once(command, power)\n',
    },
    {
      checkpoint: {
        text: "`while True` lặp mãi vì điều kiện của nó không bao giờ sai, nên vòng lặp kiểu này BẮT BUỘC phải có `break` ở bên trong — nếu không thì chương trình không bao giờ dừng. Ở đây cửa ra là từ `stop`: nghe thấy nó thì thoát, còn mọi từ khác đều đi diễn thêm một lần nữa.",
      },
    },
    {
      quiz: {
        title: "Sân khấu mở mãi",
        questions: [
          {
            q: "Vì sao vòng `while True` trong bài này bắt buộc phải có `break`?",
            a: [
              "Vì điều kiện `True` không bao giờ sai, nên không có `break` thì vòng lặp chạy mãi không dừng",
              "Vì `while` chỉ chạy đúng một lần nếu thiếu `break`",
              "Vì `break` là cách duy nhất để đọc được thần chú tiếp theo",
            ],
            correct: 0,
          },
          {
            q: "Bạn niệm lần lượt `koto`, rồi `boss`, rồi `stop`. Máy in ra gì?",
            a: [
              "`CAST: stag`, rồi `CAST: boss`, rồi `SHOW OVER`",
              "Chỉ `SHOW OVER`, vì vòng lặp chỉ xét từ cuối cùng",
              "Chỉ `CAST: stag`, vì `break` chạy ngay sau lần đầu",
            ],
            correct: 0,
          },
          {
            q: "Nếu bỏ hẳn nhánh `if command == \"stop\"` đi thì chuyện gì xảy ra?",
            a: [
              "Gương nghe và diễn mãi, không có cách nào thoát khỏi vòng lặp",
              "Vòng lặp tự dừng sau khi hết danh sách `spells`",
              "Máy báo lỗi ngay khi chạy dòng `while True`",
            ],
            correct: 0,
          },
        ],
      },
    },
  ],
  ritual: {},
};
