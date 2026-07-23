export default {
  index: 23,
  title: "AR Bàn Tay: Tự Vẽ Lớp Ảnh Trong Suốt",
  subtitle: "hiểu điểm ảnh RGBA, tự phóng to sprite bằng vòng lặp và đặt hình theo tọa độ bàn tay",
  bundle: { art: "assets/future-packet.webp", name: "RGBA OVERLAY PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "XƯỞNG ĐIỂM ẢNH AR",
    blurb: "một xưởng cho phép bạn tự tạo từng điểm ảnh trước khi ghép chúng lên hình camera",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      quiz: {
        title: "Từ hạt đến điểm ảnh",
        questions: [
          {
            q: "Một hạt có `x = 50`, `y = 50`. Muốn nhìn thấy hạt trên màn hình, chương trình còn phải làm gì?",
            a: ["Đổi tọa độ thành hàng-cột rồi tô các điểm ảnh", "Chỉ giảm life", "Chỉ đổi vx"],
            correct: 0,
          },
          {
            q: "Trong ảnh 8 hàng và 12 cột, `image[2][5]` chỉ đến đâu?",
            a: ["Điểm ảnh ở hàng 2, cột 5", "Cả hàng 5", "Tọa độ phần trăm (2, 5)"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Màn hình là một lưới điểm ảnh. Chương trình lưu ảnh thành một list gồm nhiều hàng; mỗi hàng lại là một list gồm nhiều điểm ảnh. Muốn tạo hình, code phải tính màu của từng ô trong lưới đó.",
    },
    {
      npc: "Trong bài này, một điểm ảnh là `[red, green, blue, alpha]`. Ba số màu nằm từ 0 đến 255. `alpha = 0` nghĩa là trong suốt; `alpha = 255` nghĩa là lớp ảnh che kín hình phía sau.",
    },
    {
      npc: "Lớp ảnh AR là một framebuffer trong suốt. Python tự tạo bảng RGBA và sửa các điểm ảnh cần vẽ. `present_image_frame(image)` chỉ đưa bảng đã tính lên màn hình; lệnh này không tự tạo sticker hay chọn màu.",
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

height = 6
width = 8
image = []

for row in range(height):
    image_row = []
    for col in range(width):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)

image[2][3] = [255, 80, 180, 255]

say_num(len(image))
say_num(len(image[0]))
say_num(image[2][3][3])
present_image_frame(image)
`,
      label: "rgba_framebuffer_demo.py",
      note: "RUN KIỂM CHỨNG\nChiều cao 6, chiều rộng 8 và màu hồng được gán sẵn; bài này không đọc INPUT bên ngoài. Hai vòng lặp tạo 48 điểm ảnh trong suốt, rồi code tô điểm ảnh ở hàng 2, cột 3. OUTPUT là 6, 8, alpha 255 và một `image_frame` có một điểm màu.",
      expectOut: { all: [/^6$/, /^8$/, /^255$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

height = 6
width = 8
image = []
for row in range(height):
    image_row = []
    for col in range(width):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)
image[2][3] = [255, 80, 180, 255]
say_num(len(image))
say_num(len(image[0]))
say_num(image[2][3][3])
present_image_frame(image)
`,
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

image = []
for row in range(5):
    image_row = []
    for col in range(7):
        image_row.append([0, 0, 0, 255])
    image.append(image_row)

image[2][3] = [80, 220, 255, 255]
say_num(image[0][0][3])
present_image_frame(image)
`,
      label: "transparent_background_fix.py",
      note: "ĐỀ BÀI\nKích thước 5×7 và một điểm màu được gán sẵn; bài này không có INPUT bên ngoài. Nền đang có alpha 255 nên che camera bằng màu đen. Đổi alpha của các điểm nền thành 0. OUTPUT đúng là số 0 và một `image_frame` trong suốt, chỉ giữ lại điểm màu.",
      expectOut: { all: [/^0$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

image = []
for row in range(5):
    image_row = []
    for col in range(7):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)
image[2][3] = [80, 220, 255, 255]
say_num(image[0][0][3])
present_image_frame(image)
`,
    },
    {
      checkpoint: {
        text: "Framebuffer là list hai chiều gồm các điểm ảnh RGBA. Ba kênh màu và alpha nằm trong khoảng 0–255; alpha 0 giữ nền trong suốt, còn alpha 255 làm điểm ảnh hiện rõ.",
      },
    },
    {
      quiz: {
        title: "Đọc một điểm ảnh RGBA",
        questions: [
          {
            q: "Điểm ảnh `[255, 0, 0, 0]` có ba kênh màu đỏ nhưng alpha bằng 0. Khi ghép lên camera, kết quả nào đúng?",
            a: ["Điểm đó trong suốt", "Điểm đó đỏ kín", "Cả ảnh biến thành đỏ"],
            correct: 0,
          },
          {
            q: "Vì sao phải tạo một list mới cho từng hàng?",
            a: ["Để mỗi hàng giữ các điểm ảnh riêng", "Để camera tự tìm tay", "Để bỏ chỉ số cột"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Sticker nhỏ có thể được lưu thành mask. Số 1 là chỗ cần tô, số 0 là chỗ bỏ qua. Ví dụ, mask chữ thập `[[0,1,0], [1,1,1], [0,1,0]]` chỉ mô tả hình dạng, còn màu được chọn khi vẽ.",
    },
    {
      npc: "Để phóng to, mỗi ô mask được lặp thành một khối `scale × scale`. Bốn vòng lặp duyệt mask và các điểm trong khối. Trước khi tô, code phải kiểm tra hàng-cột đích còn nằm trong ảnh.",
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def stamp_mask(image, mask, center_row, center_col, scale, color):
    height = len(image)
    width = len(image[0])
    start_row = center_row - len(mask) * scale // 2
    start_col = center_col - len(mask[0]) * scale // 2
    for mask_row in range(len(mask)):
        for mask_col in range(len(mask[0])):
            if mask[mask_row][mask_col] == 1:
                for small_row in range(scale):
                    for small_col in range(scale):
                        row = start_row + mask_row * scale + small_row
                        col = start_col + mask_col * scale + small_col
                        if 0 <= row < height and 0 <= col < width:
                            image[row][col] = color

mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
image = blank_image(14, 18)
stamp_mask(image, mask, 7, 9, 2, [255, 210, 40, 255])

colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1

say_num(colored)
present_image_frame(image)
`,
      label: "stamp_scaled_mask_demo.py",
      note: "RUN KIỂM CHỨNG\nMask chữ thập, scale 2 và màu vàng được gán sẵn; bài này không có INPUT bên ngoài. Mỗi số 1 tạo một khối 2×2, nên 5 ô mask tạo 20 điểm ảnh màu. OUTPUT là 20 và một `image_frame` có chữ thập phóng to.",
      expectOut: { all: [/^20$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def stamp_mask(image, mask, center_row, center_col, scale, color):
    height = len(image)
    width = len(image[0])
    start_row = center_row - len(mask) * scale // 2
    start_col = center_col - len(mask[0]) * scale // 2
    for mask_row in range(len(mask)):
        for mask_col in range(len(mask[0])):
            if mask[mask_row][mask_col] == 1:
                for small_row in range(scale):
                    for small_col in range(scale):
                        row = start_row + mask_row * scale + small_row
                        col = start_col + mask_col * scale + small_col
                        if 0 <= row < height and 0 <= col < width:
                            image[row][col] = color

mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
image = blank_image(14, 18)
stamp_mask(image, mask, 7, 9, 2, [255, 210, 40, 255])
colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1
say_num(colored)
present_image_frame(image)
`,
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

image = []
for row in range(8):
    image_row = []
    for col in range(10):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)

mask = [[1, 0], [0, 1]]
for mask_row in range(2):
    for mask_col in range(2):
        row = 6 + mask_row
        col = 8 + mask_col
        image[row][col] = [120, 240, 255, 255]

colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1
say_num(colored)
present_image_frame(image)
`,
      label: "respect_mask_fix.py",
      note: "ĐỀ BÀI\nẢnh 8×10, mask chéo và vị trí bắt đầu (6, 8) được gán sẵn; bài này không có INPUT bên ngoài. Vòng lặp đang tô cả ô 0. Thêm điều kiện chỉ tô khi `mask[mask_row][mask_col] == 1`. OUTPUT đúng là 2 và một `image_frame` có hai điểm màu chéo nhau.",
      expectOut: { all: [/^2$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

image = []
for row in range(8):
    image_row = []
    for col in range(10):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)
mask = [[1, 0], [0, 1]]
for mask_row in range(2):
    for mask_col in range(2):
        if mask[mask_row][mask_col] == 1:
            row = 6 + mask_row
            col = 8 + mask_col
            if 0 <= row < 8 and 0 <= col < 10:
                image[row][col] = [120, 240, 255, 255]
colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1
say_num(colored)
present_image_frame(image)
`,
    },
    {
      checkpoint: {
        text: "Raster hóa sprite bằng mask gồm bốn vòng lặp: duyệt hàng-cột của mask rồi duyệt khối scale. Chỉ tô ô mask bằng 1 và luôn kiểm tra `0 <= row < height`, `0 <= col < width` trước khi sửa framebuffer.",
      },
    },
    {
      quiz: {
        title: "Phóng to và giữ hình trong khung",
        questions: [
          {
            q: "Mask có 4 ô bằng 1 và `scale = 3`. Nếu không bị cắt ở biên, bao nhiêu điểm ảnh sẽ được tô?",
            a: ["36", "12", "7"],
            correct: 0,
          },
          {
            q: "Sticker nằm sát mép phải. Vì sao phải kiểm tra `col < width`?",
            a: ["Để không ghi vào cột nằm ngoài framebuffer", "Để tự đổi màu", "Để tăng scale"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Camera trả tọa độ phần trăm để dùng được với nhiều kích thước ảnh. Code đổi sang chỉ số bằng `col = x * (width - 1) // 100` và `row = y * (height - 1) // 100`.",
    },
    {
      npc: "Đường đi của dữ liệu AR là INPUT–PROCESS–OUTPUT. `read_hand_position` cung cấp INPUT thật; code đổi tọa độ, tạo framebuffer và đóng dấu mask; `present_image_frame` đưa OUTPUT RGBA lên lớp ảnh phủ camera.",
    },
    {
      code: `from camera_charm import start_studio, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def stamp_mask(image, mask, center_row, center_col, scale, color):
    start_row = center_row - len(mask) * scale // 2
    start_col = center_col - len(mask[0]) * scale // 2
    for mask_row in range(len(mask)):
        for mask_col in range(len(mask[0])):
            if mask[mask_row][mask_col] == 1:
                for small_row in range(scale):
                    for small_col in range(scale):
                        row = start_row + mask_row * scale + small_row
                        col = start_col + mask_col * scale + small_col
                        if 0 <= row < len(image) and 0 <= col < len(image[0]):
                            image[row][col] = color

height = 24
width = 32
star_mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]

start_studio("Sticker theo đầu ngón tay")
for frame in range(8):
    point = read_hand_position("index_tip")
    image = blank_image(height, width)
    if point["visible"] == True:
        col = point["x"] * (width - 1) // 100
        row = point["y"] * (height - 1) // 100
        stamp_mask(image, star_mask, row, col, 2, [255, 100, 210, 220])
    present_image_frame(image)
    delay(0.3)
`,
      label: "hand_rgba_overlay.py",
      note: "THỬ THÁCH SÁNG TẠO\nINPUT thật là tám vị trí đầu ngón trỏ từ camera. PROCESS tự đổi x/y sang hàng-cột, tạo framebuffer trong suốt và đóng dấu mask bằng các vòng lặp. `delay(0.3)` giữ từng frame đủ lâu để mắt theo kịp. OUTPUT là tám `image_frame`; di chuyển tay để quan sát hình đi theo. Hãy tự đổi mask, scale và màu RGBA, nhưng giữ phần kiểm tra biên.",
      expectOut: { all: [/hand_position/i, { kind: "image_frame", minCount: 8, text: /"image"\s*:\s*\[\[/ }] },
      solution: `from camera_charm import start_studio, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def stamp_mask(image, mask, center_row, center_col, scale, color):
    start_row = center_row - len(mask) * scale // 2
    start_col = center_col - len(mask[0]) * scale // 2
    for mask_row in range(len(mask)):
        for mask_col in range(len(mask[0])):
            if mask[mask_row][mask_col] == 1:
                for small_row in range(scale):
                    for small_col in range(scale):
                        row = start_row + mask_row * scale + small_row
                        col = start_col + mask_col * scale + small_col
                        if 0 <= row < len(image) and 0 <= col < len(image[0]):
                            image[row][col] = color

height = 24
width = 32
star_mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
start_studio("Sticker theo đầu ngón tay")
for frame in range(8):
    point = read_hand_position("index_tip")
    image = blank_image(height, width)
    if point["visible"] == True:
        col = point["x"] * (width - 1) // 100
        row = point["y"] * (height - 1) // 100
        stamp_mask(image, star_mask, row, col, 2, [255, 100, 210, 220])
    present_image_frame(image)
    delay(0.3)
`,
    },
    {
      checkpoint: {
        text: "AR không tự gắn hình vào tay. Mỗi frame, chương trình đọc INPUT `visible/x/y`, đổi phần trăm thành hàng-cột, tự raster hóa mask vào framebuffer RGBA rồi mới gửi OUTPUT bằng `present_image_frame`.",
      },
    },
    {
      quiz: {
        title: "Theo dõi đường đi của dữ liệu AR",
        questions: [
          {
            q: "Ảnh rộng 21 cột và `x = 75`. Công thức `x * (width - 1) // 100` chọn cột nào?",
            a: ["15", "75", "20"],
            correct: 0,
          },
          {
            q: "Khi `visible` là False, frame hợp lý nên chứa gì?",
            a: ["Framebuffer trong suốt, không dùng tọa độ tay không đáng tin", "Sticker ở vị trí bất kỳ", "Mask được tô kín toàn màn hình"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "RGBA",
        name: "HUY HIỆU THỢ RASTER AR",
        blurb: "tự tạo framebuffer trong suốt, phóng to mask bằng vòng lặp và đặt sprite theo tọa độ camera",
        badge: true,
        badgeId: "huy_hieu_tho_raster_ar",
      },
    },
    {
      forge: {
        quiz: [
          { q: "Alpha 0 có tác dụng gì?", a: ["Giữ điểm ảnh trong suốt", "Tô điểm ảnh trắng", "Tăng scale"], correct: 0 },
          { q: "Phần nào quyết định hình dạng sticker?", a: ["Các ô 0 và 1 trong mask", "Camera tự chọn", "Tên file"], correct: 0 },
          { q: "Phần nào thực sự phóng to sprite?", a: ["Hai vòng lặp `small_row/small_col`", "Alpha", "visible"], correct: 0 },
          { q: "Vì sao cần kiểm tra biên?", a: ["Để không truy cập hàng-cột ngoài ảnh", "Để đổi anchor", "Để tăng màu đỏ"], correct: 0 },
          { q: "`present_image_frame` làm việc gì?", a: ["Hiển thị framebuffer đã được Python tính", "Tự viết mask", "Tự theo dõi tay"], correct: 0 },
        ],
      },
    },
    { boss: { name: "THE OPAQUE WALL", art: "assets/mirror-wraith.webp", glyph: "A", ko: true } },
    {
      npc: "Bạn đã tự dựng lớp ảnh AR từ những con số nhỏ nhất: từng điểm ảnh, từng ô mask và từng phép đổi tọa độ. Node tiếp theo sẽ dùng cùng framebuffer này để vẽ nhiều hạt đang chuyển động.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG RGBA OVERLAY PACKET",
    theme: {
      motion: "comet",
      palette: { core: "#78b2a5", dust: "#d69a20", rune: "#f4c85a" },
      glyphs: "pixel rgba alpha mask scale row col",
    },
  },
};
