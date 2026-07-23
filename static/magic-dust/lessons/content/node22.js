export default {
  index: 22,
  title: "Từ Điểm Ảnh Đến Pháo Hoa",
  subtitle: "tự tạo khung hình, vẽ từng điểm ảnh và viết bộ phát hạt bằng vòng lặp",
  bundle: { art: "assets/future-packet.webp", name: "PIXEL FIREWORK PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "XƯỞNG ĐỒ HỌA ĐIỂM ẢNH",
    blurb: "một xưởng nhỏ cho phép bạn tự tính từng khung hình trước khi đặt nó lên lớp phủ AR",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "MỘT ĐIỂM SÁNG CŨNG LÀ ĐỒ HỌA",
        hook: "Máy không nhìn thấy pháo hoa. Máy chỉ nhận một bảng màu mới cho mỗi khung hình.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Màn hình được chia thành nhiều ô rất nhỏ. Mỗi ô là một điểm ảnh, hay pixel. Ví dụ: `[255, 0, 0, 255]` bảo một điểm ảnh hiện màu đỏ và hoàn toàn rõ.",
    },
    {
      npc: "Ba số đầu là red, green, blue, từ 0 đến 255. Số cuối là alpha: 0 nghĩa là trong suốt, 255 nghĩa là nhìn rõ. Alpha ở giữa tạo màu bán trong suốt.",
    },
    {
      npc: "Máy chuẩn bị cả bảng điểm ảnh trong bộ nhớ trước khi hiện nó. Bảng đó gọi là framebuffer. Ví dụ: framebuffer 6×8 có 6 hàng, mỗi hàng chứa 8 điểm ảnh.",
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

image[3][4] = [255, 80, 40, 255]

say_num(image[3][4][0])
present_image_frame(image)
`,
      label: "one_pixel_demo.py",
      note: "RUN KIỂM CHỨNG\nKích thước 6×8 và vị trí hàng 3, cột 4 được gán sẵn; không có INPUT từ bên ngoài. Hai vòng lặp tạo framebuffer trong suốt, rồi phép gán sửa đúng một điểm ảnh. OUTPUT là 255 và một điểm màu trên lớp phủ AR.",
      expectOut: { all: [/^255$/, /image_frame/i] },
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

image[3][4] = [255, 80, 40, 255]

say_num(image[3][4][0])
present_image_frame(image)
`,
    },
    {
      npc: "Lớp phủ AR là một framebuffer nằm trên hình camera. Điểm ảnh alpha 0 để lộ camera bên dưới. Điểm ảnh alpha 255 che phần camera đúng tại vị trí đó.",
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

def make_frame(width, height):
    frame = []
    # lượt của bạn: dùng hai vòng lặp để tạo height hàng
    # mỗi hàng có width điểm ảnh [0, 0, 0, 0]
    return frame

def set_pixel(frame, x, y, color):
    # lượt của bạn: chỉ gán color khi x, y nằm trong frame
    pass

image = make_frame(8, 6)
set_pixel(image, 4, 3, [40, 180, 255, 255])

say_num(len(image))
say_num(len(image[0]))
say_num(image[3][4][2])
present_image_frame(image)
`,
      label: "build_frame_tools.py",
      note: "ĐỀ BÀI\nKích thước, tọa độ và màu đã được gán sẵn; không có INPUT từ bên ngoài. Hoàn thiện `make_frame` bằng hai vòng lặp. Sau đó, trong `set_pixel`, kiểm tra biên và gán `frame[y][x] = color`. OUTPUT đúng là 6, 8, 255 và một điểm màu.",
      expectOut: { all: [/^6$/, /^8$/, /^255$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    height = len(frame)
    width = len(frame[0])
    if x >= 0 and x < width and y >= 0 and y < height:
        frame[y][x] = color

image = make_frame(8, 6)
set_pixel(image, 4, 3, [40, 180, 255, 255])

say_num(len(image))
say_num(len(image[0]))
say_num(image[3][4][2])
present_image_frame(image)
`,
    },
    {
      checkpoint: {
        text: "Một framebuffer là bảng 2D chứa màu của từng điểm ảnh. Điểm ảnh RGBA có dạng `[red, green, blue, alpha]`. `present_image_frame(image)` chỉ hiện bảng đã được chương trình tạo; nó không tự vẽ thêm hình.",
      },
    },
    {
      quiz: {
        title: "Đọc một framebuffer",
        questions: [
          {
            q: "Framebuffer có 5 hàng và 7 cột. Dòng nào tạo đúng một hàng trong suốt trước khi append vào framebuffer?",
            a: ["Lặp 7 lần và append `[0, 0, 0, 0]`", "Lặp 5 lần và append số 255", "Gán cả hàng thành `[255, 255]`"],
            correct: 0,
          },
          {
            q: "Camera phải còn nhìn thấy ở điểm ảnh `(2, 3)`. Màu nào phù hợp để điểm đó hoàn toàn trong suốt?",
            a: ["`[0, 0, 0, 0]`", "`[0, 0, 0, 255]`", "`[255, 255, 255, 255]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Máy còn phải đổi hình học thành các điểm ảnh cụ thể. Việc chọn những ô nào sẽ được tô gọi là raster hóa. Ví dụ: hình vuông tâm `(8, 6)`, size 1 sẽ tô 9 ô quanh tâm.",
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    # lượt của bạn: dùng hai vòng lặp để đi qua hình vuông
    # gọi set_pixel cho từng x, y từ center - size đến center + size
    pass

image = make_frame(16, 12)
draw_square(image, 8, 6, 1, [255, 220, 60, 255])

filled = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            filled = filled + 1

say_num(filled)
present_image_frame(image)
`,
      label: "raster_square.py",
      note: "ĐỀ BÀI\nFramebuffer 16×12, tâm `(8, 6)`, size 1 và màu vàng được gán sẵn; không có INPUT từ bên ngoài. Hoàn thiện `draw_square` bằng hai vòng lặp và gọi `set_pixel`. OUTPUT đúng là 9 điểm ảnh được tô và một hình vuông nhỏ.",
      expectOut: { all: [/^9$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    for y in range(center_y - size, center_y + size + 1):
        for x in range(center_x - size, center_x + size + 1):
            set_pixel(frame, x, y, color)

image = make_frame(16, 12)
draw_square(image, 8, 6, 1, [255, 220, 60, 255])

filled = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            filled = filled + 1

say_num(filled)
present_image_frame(image)
`,
    },
    {
      npc: "Một frame là một ảnh hoàn chỉnh tại một thời điểm. Nếu chương trình hiện nhiều frame liên tiếp và mỗi frame hơi khác nhau, mắt mình nối chúng thành chuyển động. Đó là hoạt ảnh theo frame.",
    },
    {
      npc: "Scale cho biết hình lớn hay nhỏ. Với hình vuông này, tụi mình thể hiện scale bằng `size`. Mỗi frame giảm size một đơn vị, rồi raster hóa lại, nên hình thu nhỏ dần thay vì tự biến mất ngay.",
    },
    {
      code: `from camera_charm import present_image_frame, delay
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    for y in range(center_y - size, center_y + size + 1):
        for x in range(center_x - size, center_x + size + 1):
            set_pixel(frame, x, y, color)

particle = {"x": 8, "y": 6, "size": 3, "color": [255, 100, 40, 255]}

for frame_number in range(4):
    image = make_frame(16, 12)
    draw_square(image, particle["x"], particle["y"], particle["size"], particle["color"])
    say_num(particle["size"])
    present_image_frame(image)
    delay(0.35)
    particle["size"] = particle["size"]  # lượt của bạn: giảm size nhưng không cho nhỏ hơn 0
`,
      label: "shrinking_pixel.py",
      note: "ĐỀ BÀI\nVị trí, size ban đầu 3, màu và 4 frame được gán sẵn; không có INPUT từ bên ngoài. Sau khi hiện mỗi frame, gán lại size bằng giá trị nhỏ hơn một đơn vị nhưng không dưới 0. `delay(0.35)` giữ từng frame đủ lâu để bạn nhìn thấy hình vuông thu nhỏ. OUTPUT chính là hoạt ảnh bốn frame; các số 3, 2, 1, 0 chỉ dùng để kiểm chứng size.",
      expectOut: { all: [/^3$/, /^2$/, /^1$/, /^0$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame, delay
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    for y in range(center_y - size, center_y + size + 1):
        for x in range(center_x - size, center_x + size + 1):
            set_pixel(frame, x, y, color)

particle = {"x": 8, "y": 6, "size": 3, "color": [255, 100, 40, 255]}

for frame_number in range(4):
    image = make_frame(16, 12)
    draw_square(image, particle["x"], particle["y"], particle["size"], particle["color"])
    say_num(particle["size"])
    present_image_frame(image)
    delay(0.35)
    particle["size"] = max(0, particle["size"] - 1)
`,
    },
    {
      checkpoint: {
        text: "Raster hóa đổi vị trí, size và màu thành các điểm ảnh trong framebuffer. Hoạt ảnh xuất hiện khi chương trình tạo nhiều framebuffer liên tiếp. Muốn hình nhỏ dần, chương trình giảm size rồi raster hóa lại ở frame kế tiếp.",
      },
    },
    {
      quiz: {
        title: "Dự đoán hoạt ảnh",
        questions: [
          {
            q: "Một hình có `size = 2`. Sau mỗi frame, code chạy `size = max(0, size - 1)`. Ba size được vẽ liên tiếp là gì?",
            a: ["2, 1, 0", "2, 2, 2", "1, 2, 3"],
            correct: 0,
          },
          {
            q: "Một điểm sáng vẫn nằm yên dù chương trình đã hiện 20 frame. Thay đổi nào giúp mắt nhìn thấy nó chuyển động?",
            a: ["Đổi `x` hoặc `y` trước khi raster hóa frame kế tiếp", "Giữ nguyên mọi dữ liệu", "Chỉ đổi tên biến `image`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Một particle là một dictionary giữ trạng thái của một hình nhỏ. `x/y` là vị trí; `vx/vy` là phần vị trí thay đổi mỗi frame; `life` là số frame còn lại; `size` và `color` quyết định cách raster hóa.",
    },
    {
      label: "particle_cycle_walkthrough",
      walkthrough: {
        title: "TỪ MỘT HẠT ĐỨNG YÊN ĐẾN MỘT HẠT ĐANG RƠI",
        intro: "Bắt đầu bằng đúng một hạt. Sau khi nhìn thấy nó đứng yên, tụi mình mới thêm tốc độ rơi và giảm size từng frame. Mỗi nút chỉ thay đổi một ý để bạn nhìn ra nguyên nhân của chuyển động.",
        codeTitle: "CODE — MỘT HẠT, MỘT TỐC ĐỘ, BA FRAME",
        observeTitle: "SÂN KHẤU — TRẠNG THÁI HIỆN TẠI",
        hint: "Bấm BẮT ĐẦU. Sau đó chỉ theo dõi action đang hiện trên nút.",
        placeholder: false,
        code: [
          "from camera_charm import start_particle_stage, draw_particle_frame, delay",
          'start_particle_stage("Một hạt đang rơi")',
          "particle = {",
          '    "symbol": "●", "x": 50, "y": 15,',
          '    "vy": 8, "scale_speed": -0.5,',
          '    "size": 3, "color": "#ffca5a", "alpha": 255',
          "}",
          "draw_particle_frame([particle])",
          "delay(0.6)",
          "for frame in range(3):",
          '    particle["y"] = particle["y"] + particle["vy"]',
          '    particle["size"] = max(0.5, particle["size"] + particle["scale_speed"])',
          "    draw_particle_frame([particle])",
          "    delay(0.6)",
        ],
        steps: [
          { line: 2, label: "BƯỚC 1 — MỞ SÂN KHẤU", explain: "Sân khấu chỉ là vùng để nhìn kết quả. Mở sân khấu chưa tạo ra particle nào.", action: { action: "particle_stage_start", title: "Một hạt đang rơi" }, memory: "Sân khấu đã mở; chưa có particle." },
          { line: 3, label: "BƯỚC 2 — TẠO MỘT PARTICLE", explain: "Dictionary tạo đúng một particle. `x = 50`, `y = 15` đặt nó gần giữa mép trên. `size = 3` quyết định kích thước ban đầu.", memory: "Một particle có x=50, y=15, size=3." },
          { line: 8, label: "BƯỚC 3 — CHO HẠT XUẤT HIỆN", explain: "`draw_particle_frame([particle])` vẽ trạng thái hiện tại. Hạt xuất hiện nhưng chưa chuyển động vì code chưa đổi x, y hay size.", action: { action: "particle_frame", particles: [{ symbol: "●", x: 50, y: 15, size: 3, color: "#ffca5a", alpha: 255 }], guide: { action: "MỘT HẠT", title: "Particle vừa xuất hiện", formula: "x = 50, y = 15", fields: [{ label: "size", value: "3" }, { label: "vy", value: "8" }], caption: "Dictionary đã được vẽ; chưa có UPDATE nên hạt đứng yên." } }, memory: "Frame đầu: một hạt đứng yên tại y=15, size=3." },
          { line: 5, label: "BƯỚC 4 — ĐỌC TỐC ĐỘ RƠI", explain: "`vy = 8` nghĩa là mỗi lần UPDATE, y tăng thêm 8. Trên sân khấu, y tăng theo hướng từ trên xuống dưới; vì vậy hạt sẽ rơi. `vy = 3` rơi chậm hơn, còn `vy = 12` rơi nhanh hơn.", memory: "vy là lượng y thay đổi trong một frame; vy dương làm hạt rơi xuống." },
          { line: 11, label: "BƯỚC 5 — UPDATE VỊ TRÍ", explain: "Máy tính `y = 15 + 8`, nên y mới bằng 23. Chính phép gán lại này tạo chuyển động; vòng `for` tự nó không làm hạt rơi.", memory: "Sau UPDATE đầu tiên: y=23." },
          { line: 12, label: "BƯỚC 6 — SCALE NHỎ XUỐNG", explain: "`scale_speed = -0.5` làm size giảm nửa đơn vị mỗi frame. Size đổi từ 3 thành 2,5. Nếu scale_speed bằng 0, hạt vẫn giữ nguyên kích thước.", memory: "Sau SCALE đầu tiên: size=2.5." },
          { line: 13, label: "BƯỚC 7 — VẼ FRAME MỚI", explain: "RENDER đọc y=23 và size=2,5 rồi vẽ frame mới. Vòng tròn mờ là vị trí cũ; chấm vàng là trạng thái mới.", action: { action: "particle_frame", particles: [{ symbol: "○", x: 50, y: 15, size: 3, color: "#7aa6b8", alpha: 90 }, { symbol: "●", x: 50, y: 23, size: 2.5, color: "#ffca5a", alpha: 255 }], guide: { action: "MOVE + SCALE", title: "Frame 1 → Frame 2", formula: "y = 15 + 8; size = 3 - 0.5", fields: [{ label: "y", value: "15 → 23" }, { label: "size", value: "3 → 2.5" }], caption: "Dữ liệu đổi trước; RENDER chỉ vẽ trạng thái mới." } }, memory: "Frame mới: hạt thấp hơn 8 đơn vị và nhỏ hơn 0,5." },
          { line: 13, label: "BƯỚC 8 — LẶP FRAME TIẾP THEO", explain: "UPDATE chạy lại với cùng quy tắc. y tăng từ 23 lên 31; size giảm từ 2,5 xuống 2. Hạt rơi đều vì vy giữ nguyên bằng 8.", action: { action: "particle_frame", particles: [{ symbol: "○", x: 50, y: 15, size: 3, color: "#7aa6b8", alpha: 45 }, { symbol: "○", x: 50, y: 23, size: 2.5, color: "#7aa6b8", alpha: 80 }, { symbol: "●", x: 50, y: 31, size: 2, color: "#ffca5a", alpha: 255 }], guide: { action: "LẶP UPDATE", title: "Frame 2 → Frame 3", formula: "y = y + vy", fields: [{ label: "vy", value: "8" }, { label: "y", value: "23 → 31" }, { label: "size", value: "2.5 → 2" }], caption: "Cùng một phép tính được lặp lại sau mỗi frame." } }, memory: "Frame tiếp theo: y=31, size=2." },
          { line: 13, label: "BƯỚC 9 — NHÌN CẢ ĐƯỜNG ĐI", explain: "Lượt cuối đưa hạt tới y=39 và size=1,5. Ba vòng tròn mờ giúp bạn so sánh vị trí qua các frame: hạt rơi xuống từng đoạn bằng nhau và nhỏ dần.", action: { action: "particle_frame", particles: [{ symbol: "○", x: 50, y: 15, size: 3, color: "#7aa6b8", alpha: 35 }, { symbol: "○", x: 50, y: 23, size: 2.5, color: "#7aa6b8", alpha: 55 }, { symbol: "○", x: 50, y: 31, size: 2, color: "#7aa6b8", alpha: 80 }, { symbol: "●", x: 50, y: 39, size: 1.5, color: "#ffca5a", alpha: 255 }], guide: { action: "KẾT QUẢ", title: "Một particle đã chuyển động", formula: "UPDATE → RENDER → DELAY", fields: [{ label: "y", value: "15 → 39" }, { label: "size", value: "3 → 1.5" }], caption: "Chuyển động là nhiều trạng thái khác nhau được vẽ liên tiếp." } }, memory: "Một particle rơi nhờ vy và nhỏ dần nhờ scale_speed." },
        ],
      },
    },
    {
      npc: "Ví dụ: hạt ở `(10, 10)` với `vx = 2`, `vy = -3` sẽ đến `(12, 7)` sau một lần cập nhật. Trên framebuffer, y nhỏ hơn nghĩa là hạt đi lên.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    green = particle["color"][1]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(255," + str(green) + ",40)", "alpha": particle["color"][3]}

def update_particle(particle):
    # lượt của bạn: cập nhật x, y, life, size và color
    pass

particle = {
    "symbol": "✦",
    "x": 10,
    "y": 10,
    "vx": 2,
    "vy": -3,
    "life": 4,
    "max_life": 4,
    "size": 3,
    "color": [255, 100, 40, 255]
}

start_particle_stage("Trước và sau một lần UPDATE")
draw_particle_frame([display_particle(particle)])
delay(0.6)
update_particle(particle)
draw_particle_frame([display_particle(particle)])
delay(0.8)
say_num(particle["x"])
say_num(particle["y"])
say_num(particle["life"])
say_num(particle["size"])
say_num(particle["color"][1])
say_num(particle["color"][3])
`,
      label: "update_particle_state.py",
      note: "ĐỀ BÀI\nTrạng thái hạt được gán sẵn; không có INPUT từ bên ngoài. Trong `update_particle`, cộng vận tốc vào vị trí, giảm life và size một đơn vị, tăng kênh green 20 nhưng không quá 255, rồi tính alpha bằng `life * 255 // max_life`. OUTPUT chính là hai frame cho thấy hạt đổi vị trí, nhỏ đi và mờ hơn; các số 12, 7, 3, 2, 120, 191 dùng để kiểm chứng dữ liệu sau UPDATE.",
      expectOut: { all: [/particle_frame/i, /^12$/, /^7$/, /^3$/, /^2$/, /^120$/, /^191$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    green = particle["color"][1]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(255," + str(green) + ",40)", "alpha": particle["color"][3]}

def update_particle(particle):
    particle["x"] = particle["x"] + particle["vx"]
    particle["y"] = particle["y"] + particle["vy"]
    particle["life"] = particle["life"] - 1
    particle["size"] = max(0, particle["size"] - 1)
    particle["color"][1] = min(255, particle["color"][1] + 20)
    particle["color"][3] = particle["life"] * 255 // particle["max_life"]

particle = {
    "symbol": "✦",
    "x": 10,
    "y": 10,
    "vx": 2,
    "vy": -3,
    "life": 4,
    "max_life": 4,
    "size": 3,
    "color": [255, 100, 40, 255]
}

start_particle_stage("Trước và sau một lần UPDATE")
draw_particle_frame([display_particle(particle)])
delay(0.6)
update_particle(particle)
draw_particle_frame([display_particle(particle)])
delay(0.8)
say_num(particle["x"])
say_num(particle["y"])
say_num(particle["life"])
say_num(particle["size"])
say_num(particle["color"][1])
say_num(particle["color"][3])
`,
    },
    {
      npc: "Bộ phát hạt (emitter) là phần code tự tạo dictionary cho từng hạt. Gọi một lần để tạo nhiều hạt là phát theo đợt; gọi ở mỗi frame sẽ tạo dòng hạt liên tục.",
    },
    {
      npc: "Ví dụ: tám cặp `[vx, vy]` chỉ tám hướng bay. Bộ phát tạo tám hạt tại cùng một điểm rồi gán vận tốc khác nhau. Khi chúng tách ra, mắt mình thấy hình pháo hoa.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit(origin_x, origin_y, directions, color):
    particles = []
    # lượt của bạn: lặp qua directions
    # với mỗi direction, tạo dictionary của một hạt rồi thêm vào particles
    return particles

directions = [
    [-3, 0], [-2, -2], [0, -3], [2, -2],
    [3, 0], [2, 2], [0, 3], [-2, 2]
]

particles = emit(50, 50, directions, "#ff5014")
say_num(len(particles))
say_num(particles[2]["vx"])
say_num(particles[2]["vy"])

start_particle_stage("Tám hướng từ cùng một điểm phát")
for frame in range(5):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"] * 2
        particle["y"] = particle["y"] + particle["vy"] * 2
`,
      label: "build_emitter.py",
      note: "ĐỀ BÀI\nĐiểm phát, tám hướng và màu được gán sẵn; không có INPUT từ bên ngoài. Tự viết vòng lặp trong `emit`. Mỗi hạt bắt đầu tại điểm phát, lấy `vx/vy` từ một direction, có life và max_life bằng 10, size 3, cùng màu đã cho. OUTPUT chính là năm frame cho thấy tám hạt tách khỏi cùng một điểm; các số 8, 0, -3 dùng để kiểm chứng số hạt và hướng bay thứ ba.",
      expectOut: { all: [/particle_frame/i, /^8$/, /^0$/, /^-3$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit(origin_x, origin_y, directions, color):
    particles = []
    for direction in directions:
        particle = {
            "x": origin_x,
            "y": origin_y,
            "vx": direction[0],
            "vy": direction[1],
            "life": 10,
            "max_life": 10,
            "size": 3,
            "symbol": "✦",
            "alpha": 255,
            "color": color
        }
        particles.append(particle)
    return particles

directions = [
    [-3, 0], [-2, -2], [0, -3], [2, -2],
    [3, 0], [2, 2], [0, 3], [-2, 2]
]

particles = emit(50, 50, directions, "#ff5014")
say_num(len(particles))
say_num(particles[2]["vx"])
say_num(particles[2]["vy"])

start_particle_stage("Tám hướng từ cùng một điểm phát")
for frame in range(5):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"] * 2
        particle["y"] = particle["y"] + particle["vy"] * 2
`,
    },
    {
      checkpoint: {
        text: "Bộ phát hạt là phần code tạo hạt mới. Điểm phát xác định `x/y` ban đầu; mỗi cặp `vx/vy` xác định một hướng bay; số lượt lặp quyết định số hạt được tạo. Vòng cập nhật phải đổi vị trí, life, size và color của từng hạt.",
      },
    },
    {
      quiz: {
        title: "Tự điều khiển bộ phát hạt",
        questions: [
          {
            q: "Hàm `emit` lặp qua 6 directions và thêm một dictionary của hạt trong mỗi lượt. Một lần gọi hàm tạo bao nhiêu hạt?",
            a: ["6 hạt", "1 hạt", "12 hạt"],
            correct: 0,
          },
          {
            q: "Hạt thứ ba lấy direction `[0, -3]`. Sau một lần cập nhật `x = x + vx * 2` và `y = y + vy * 2`, hạt thay đổi thế nào?",
            a: ["x giữ nguyên, y giảm 6", "x tăng 6, y giữ nguyên", "x và y đều tăng 3"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nhiều particle không cần một loại chuyển động mới. Chương trình chỉ giữ một list gồm nhiều dictionary, rồi dùng cùng vòng lặp UPDATE và RENDER cho từng phần tử trong list.",
    },
    {
      npc: "Tuyết trông tự nhiên hơn khi mỗi bông có `x`, `vy` và `size` khác nhau. `randint(a, b)` chọn một số từ a đến b; nó chỉ tạo trạng thái ban đầu khác nhau, không tự làm bông tuyết rơi.",
    },
    {
      label: "snowfall_principles_walkthrough",
      walkthrough: {
        title: "TỪ MỘT PARTICLE ĐẾN FX TUYẾT RƠI",
        intro: "Một bông tuyết vẫn chỉ là một dictionary. FX tuyết rơi xuất hiện khi list có nhiều dictionary, mỗi dictionary nhận vị trí, tốc độ và kích thước hơi khác nhau, rồi tất cả được UPDATE trong mỗi frame.",
        codeTitle: "CODE — NHIỀU HẠT + RANDOM + UPDATE",
        observeTitle: "SÂN KHẤU — FX TUYẾT RƠI",
        hint: "Bấm BẮT ĐẦU để tạo sáu bông tuyết từ cùng một khuôn dữ liệu.",
        placeholder: false,
        code: [
          "from random import seed, randint",
          "from camera_charm import start_particle_stage, draw_particle_frame, delay",
          "seed(7)",
          "snow = []",
          "for index in range(6):",
          "    flake = {",
          '        "symbol": "❄", "x": randint(5, 95),',
          '        "y": randint(-25, 5), "vx": randint(-1, 1),',
          '        "vy": randint(4, 8), "size": randint(1, 3),',
          '        "color": "#dff7ff", "alpha": 220',
          "    }",
          "    snow.append(flake)",
          "for frame in range(4):",
          "    for flake in snow:",
          '        flake["x"] = flake["x"] + flake["vx"]',
          '        flake["y"] = flake["y"] + flake["vy"]',
          '        if flake["y"] > 100:',
          '            flake["y"] = -5',
          '            flake["x"] = randint(5, 95)',
          "    draw_particle_frame(snow)",
          "    delay(0.35)",
        ],
        steps: [
          { line: 2, label: "BƯỚC 1 — MỞ SÂN KHẤU TUYẾT", explain: "Sân khấu được mở trước. Chưa có bông tuyết vì list `snow` vẫn chưa được tạo.", action: { action: "particle_stage_start", title: "FX tuyết rơi — nhiều particle" }, memory: "Sân khấu đã mở; snow chưa có phần tử." },
          { line: 4, label: "BƯỚC 2 — TẠO LIST NHIỀU HẠT", explain: "`snow = []` chuẩn bị một list. Vòng `for` chạy sáu lần; mỗi lượt tạo một dictionary `flake` rồi append vào list. Sáu bông nghĩa là sáu trạng thái riêng, không phải một hình được nhân bản trên màn hình.", memory: "Sau vòng for, snow có 6 dictionary." },
          { line: 7, label: "BƯỚC 3 — RANDOM VỊ TRÍ", explain: "`randint(5, 95)` cho mỗi bông một x khác nhau. `randint(-25, 5)` đặt chúng ở những độ cao khác nhau gần mép trên. Nếu mọi bông có cùng x, tuyết sẽ rơi thành một cột thẳng.", memory: "Các bông có x và y ban đầu khác nhau." },
          { line: 9, label: "BƯỚC 4 — RANDOM TỐC ĐỘ VÀ SIZE", explain: "Mỗi bông nhận `vy` từ 4 đến 8 và size từ 1 đến 3. Bông có vy 8 rơi nhanh gấp đôi bông có vy 4. Random làm các hạt khác nhau; UPDATE vẫn là phép cộng y với vy.", memory: "Mỗi bông có vy và size riêng." },
          { line: 20, label: "BƯỚC 5 — VẼ NHIỀU HẠT CÙNG LÚC", explain: "RENDER nhận toàn bộ list `snow`. Sáu dictionary trở thành sáu bông tuyết ở các vị trí và kích thước khác nhau.", action: { action: "particle_frame", particles: [{ symbol: "❄", x: 46, y: 5, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 11, y: -23, size: 2, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 79, y: -24, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: -12, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: -8, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 20, y: 5, size: 1, color: "#dff7ff", alpha: 220 }], guide: { action: "MANY PARTICLES", title: "Sáu dictionary → sáu bông tuyết", formula: "snow.append(flake)", fields: [{ label: "count", value: "6" }, { label: "x", value: "random" }, { label: "vy", value: "4..8" }], caption: "Mỗi bông giữ trạng thái riêng trong cùng một list." } }, memory: "Frame đầu có 6 bông tuyết." },
          { line: 16, label: "BƯỚC 6 — UPDATE TẤT CẢ BÔNG", explain: "Vòng lặp đi qua từng dictionary và gán `y = y + vy`. Bông đầu có y 5 và vy 7 nên xuống y 12; bông cuối có y 5 và vy 8 nên xuống y 13.", action: { action: "particle_frame", particles: [{ symbol: "❄", x: 45, y: 12, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 12, y: -19, size: 2, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 80, y: -19, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: -8, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: -4, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 19, y: 13, size: 1, color: "#dff7ff", alpha: 220 }], guide: { action: "UPDATE ALL", title: "Mỗi bông cộng y với vy riêng", formula: "flake['y'] = flake['y'] + flake['vy']", fields: [{ label: "bông 1", value: "5 → 12" }, { label: "bông 6", value: "5 → 13" }], caption: "Cùng một công thức tạo các quãng rơi khác nhau vì vy khác nhau." } }, memory: "Frame 2: cả sáu bông đã rơi theo tốc độ riêng." },
          { line: 20, label: "BƯỚC 7 — LẶP ĐỂ THÀNH TUYẾT RƠI", explain: "UPDATE và RENDER tiếp tục lặp. Mắt nối các vị trí liên tiếp thành chuyển động rơi. Không có lệnh `snow_fall()` bí mật nào; hiệu ứng chỉ là nhiều dictionary được tính lại qua nhiều frame.", action: { action: "particle_frame", particles: [{ symbol: "❄", x: 43, y: 26, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 14, y: -11, size: 2, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 82, y: -9, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: 0, size: 1, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 16, y: 4, size: 3, color: "#dff7ff", alpha: 220 }, { symbol: "❄", x: 17, y: 29, size: 1, color: "#dff7ff", alpha: 220 }], guide: { action: "SNOW FX", title: "Nhiều hạt đơn giản tạo thành một hiệu ứng", formula: "RANDOM START → UPDATE ALL → RENDER", fields: [{ label: "count", value: "6" }, { label: "frame", value: "3" }], caption: "Random tạo sự khác nhau; vòng lặp tạo chuyển động." } }, memory: "FX tuyết rơi = nhiều hạt + trạng thái khác nhau + UPDATE qua nhiều frame." },
          { line: 17, label: "BƯỚC 8 — ĐƯA BÔNG TRỞ LẠI MÉP TRÊN", explain: "Khi y lớn hơn 100, bông đã rơi khỏi đáy. Code gán lại y bằng -5 và chọn x mới. Nhờ vậy số bông giữ nguyên nhưng tuyết có thể rơi liên tục.", memory: "Bông ra khỏi đáy được đặt lại trên mép trên; không cần tạo list vô hạn." },
        ],
      },
    },
    {
      code: `from random import seed, randint
from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_snowflake():
    return {
        "symbol": "❄",
        "x": randint(5, 95),
        "y": randint(-30, 5),
        "vx": randint(-1, 1),
        "vy": randint(4, 8),
        "size": randint(1, 3),
        "color": "#dff7ff",
        "alpha": 220,
    }

seed(7)
snow = []
for index in range(18):
    snow.append(make_snowflake())

start_particle_stage("FX tuyết rơi")
for frame in range(10):
    draw_particle_frame(snow)
    delay(0.35)
    for flake in snow:
        flake["x"] = flake["x"] + flake["vx"]
        flake["y"] = flake["y"] + flake["vy"]
        if flake["y"] > 100:
            flake["y"] = -5
            flake["x"] = randint(5, 95)

say_num(len(snow))
say_num(snow[0]["vy"])
`,
      label: "snowfall_fx.py",
      note: "RUN KIỂM CHỨNG\nSố lượng 18 bông, seed 7 và các khoảng random được gán sẵn; bài này không đọc INPUT bên ngoài. PROCESS: tạo 18 dictionary với x, y, vx, vy và size khác nhau; mỗi frame cộng vận tốc vào vị trí; bông đi qua đáy được đặt lại trên mép trên. OUTPUT chính là mười frame tuyết rơi; số 18 và số 4 kiểm chứng số bông cùng `vy` của bông đầu.",
      expectOut: { all: [/^18$/, /^4$/, { kind: "particle_frame", minCount: 10, text: /"particles"\s*:\s*\[/ }] },
      solution: `from random import seed, randint
from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_snowflake():
    return {"symbol": "❄", "x": randint(5, 95), "y": randint(-30, 5), "vx": randint(-1, 1), "vy": randint(4, 8), "size": randint(1, 3), "color": "#dff7ff", "alpha": 220}

seed(7)
snow = []
for index in range(18):
    snow.append(make_snowflake())
start_particle_stage("FX tuyết rơi")
for frame in range(10):
    draw_particle_frame(snow)
    delay(0.35)
    for flake in snow:
        flake["x"] = flake["x"] + flake["vx"]
        flake["y"] = flake["y"] + flake["vy"]
        if flake["y"] > 100:
            flake["y"] = -5
            flake["x"] = randint(5, 95)
say_num(len(snow))
say_num(snow[0]["vy"])
`,
    },
    {
      remember: "Một particle là một dictionary. Nhiều particle là một list nhiều dictionary. Random chỉ làm trạng thái ban đầu khác nhau; chuyển động vẫn do UPDATE cộng vận tốc vào vị trí. FX tuyết rơi lặp ba việc: cập nhật từng bông, đặt lại bông đã qua đáy, rồi RENDER cả list.",
    },
    {
      npc: "Bây giờ mình cho đường bay uốn cong. Trước tiên hãy nhìn một hướng dễ thấy: vector `(3, 0)` chỉ sang phải. Xoay 90 độ trên framebuffer sẽ cho vector gần `(0, 3)`, tức là chỉ xuống dưới.",
    },
    {
      code: `from math import cos, sin, pi
from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

vx = 3
vy = 0
angle = pi / 2

new_vx = round(vx * cos(angle) - vy * sin(angle))
new_vy = round(vx * sin(angle) + vy * cos(angle))

say_num(new_vx)
say_num(new_vy)

start_particle_stage("Vector quay 90 độ")
marker = {"symbol": "✦", "x": 50, "y": 50, "size": 2, "color": "#7ce7ff", "alpha": 255}
draw_particle_frame([marker])
delay(0.6)
marker["x"] = marker["x"] + new_vx * 8
marker["y"] = marker["y"] + new_vy * 8
draw_particle_frame([marker])
delay(0.8)
`,
      label: "rotate_direction_demo.py",
      note: "RUN KIỂM CHỨNG\nVector `(3, 0)` và góc `pi / 2` được gán sẵn; không có INPUT từ bên ngoài. Hai phép tính xoay vector 90 độ, rồi `round` đưa kết quả rất gần số nguyên về số nguyên. OUTPUT chính là hai frame cho thấy điểm sáng đi theo vector sau khi xoay; 0 và 3 dùng để kiểm chứng hai thành phần của vector mới.",
      expectOut: { all: [/particle_frame/i, /^0$/, /^3$/] },
      solution: `from math import cos, sin, pi
from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

vx = 3
vy = 0
angle = pi / 2

new_vx = round(vx * cos(angle) - vy * sin(angle))
new_vy = round(vx * sin(angle) + vy * cos(angle))

say_num(new_vx)
say_num(new_vy)

start_particle_stage("Vector quay 90 độ")
marker = {"symbol": "✦", "x": 50, "y": 50, "size": 2, "color": "#7ce7ff", "alpha": 255}
draw_particle_frame([marker])
delay(0.6)
marker["x"] = marker["x"] + new_vx * 8
marker["y"] = marker["y"] + new_vy * 8
draw_particle_frame([marker])
delay(0.8)
`,
    },
    {
      npc: "`cos` và `sin` cho biết phần ngang và phần dọc sau khi xoay. Tụi mình giữ `old_vx/old_vy`, tính cặp mới, rồi mới gán lại. Góc nhỏ mỗi frame làm đường bay cong dần.",
    },
    {
      code: `from math import cos, sin
from camera_charm import present_image_frame, delay
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    for y in range(center_y - size, center_y + size + 1):
        for x in range(center_x - size, center_x + size + 1):
            set_pixel(frame, x, y, color)

def emit(origin_x, origin_y, directions, color):
    # lượt của bạn: tạo một particle cho mỗi direction
    pass

def update_particle(particle, angle):
    # lượt của bạn: xoay vận tốc, cập nhật vị trí, life, size và color
    pass

def render(particles, width, height):
    # lượt của bạn: tạo frame, raster hóa mọi particle, rồi trả frame
    pass

directions = [
    [-3, 0], [-2, -2], [0, -3], [2, -2],
    [3, 0], [2, 2], [0, 3], [-2, 2]
]
particles = emit(16, 12, directions, [255, 60, 20, 255])
say_num(len(particles))

for frame_number in range(10):
    image = render(particles, 32, 24)
    present_image_frame(image)
    delay(0.3)

    alive_particles = []
    for particle in particles:
        update_particle(particle, 0.12)
        if particle["life"] > 0:
            alive_particles.append(particle)
    particles = alive_particles
`,
      label: "my_pixel_firework.py",
      note: "ĐỀ BÀI MỞ\nĐiểm phát `(16, 12)`, tám hướng, màu, framebuffer 32×24 và 10 frame được gán sẵn; không có INPUT từ bên ngoài. Tự hoàn thiện `emit`, `update_particle` và `render` bằng các vòng lặp đã học. OUTPUT kỹ thuật là 8 và mười `image_frame`. Sau khi chạy đúng, bạn có thể đổi directions, góc xoay và phép đổi màu để tạo kiểu pháo hoa riêng.",
      expectOut: { all: [/^8$/, /image_frame/i] },
      solution: `from math import cos, sin
from camera_charm import present_image_frame, delay
from old_computer import say_num

def make_frame(width, height):
    frame = []
    for row in range(height):
        frame_row = []
        for col in range(width):
            frame_row.append([0, 0, 0, 0])
        frame.append(frame_row)
    return frame

def set_pixel(frame, x, y, color):
    if x >= 0 and x < len(frame[0]) and y >= 0 and y < len(frame):
        frame[y][x] = color

def draw_square(frame, center_x, center_y, size, color):
    for y in range(center_y - size, center_y + size + 1):
        for x in range(center_x - size, center_x + size + 1):
            set_pixel(frame, x, y, color)

def emit(origin_x, origin_y, directions, color):
    particles = []
    for direction in directions:
        particle = {
            "x": origin_x,
            "y": origin_y,
            "vx": direction[0],
            "vy": direction[1],
            "life": 10,
            "max_life": 10,
            "size": 3,
            "color": [color[0], color[1], color[2], color[3]]
        }
        particles.append(particle)
    return particles

def update_particle(particle, angle):
    old_vx = particle["vx"]
    old_vy = particle["vy"]
    particle["vx"] = old_vx * cos(angle) - old_vy * sin(angle)
    particle["vy"] = old_vx * sin(angle) + old_vy * cos(angle)
    particle["x"] = particle["x"] + particle["vx"]
    particle["y"] = particle["y"] + particle["vy"]
    particle["life"] = particle["life"] - 1
    particle["size"] = max(1, (particle["life"] + 2) // 3)
    particle["color"][0] = max(80, particle["color"][0] - 12)
    particle["color"][1] = min(255, particle["color"][1] + 18)
    particle["color"][2] = min(255, particle["color"][2] + 6)
    particle["color"][3] = particle["life"] * 255 // particle["max_life"]

def render(particles, width, height):
    frame = make_frame(width, height)
    for particle in particles:
        center_x = round(particle["x"])
        center_y = round(particle["y"])
        draw_square(frame, center_x, center_y, particle["size"], particle["color"])
    return frame

directions = [
    [-3, 0], [-2, -2], [0, -3], [2, -2],
    [3, 0], [2, 2], [0, 3], [-2, 2]
]
particles = emit(16, 12, directions, [255, 60, 20, 255])
say_num(len(particles))

for frame_number in range(10):
    image = render(particles, 32, 24)
    present_image_frame(image)
    delay(0.3)

    alive_particles = []
    for particle in particles:
        update_particle(particle, 0.12)
        if particle["life"] > 0:
            alive_particles.append(particle)
    particles = alive_particles
`,
    },
    {
      checkpoint: {
        text: "Một hệ hạt hoàn chỉnh lặp bốn việc: bộ phát tạo dictionary cho từng hạt; UPDATE đổi trạng thái bằng phép tính; RENDER biến trạng thái thành điểm ảnh trong framebuffer; `present_image_frame` đưa framebuffer lên lớp phủ AR. Phép xoay vector làm hướng bay cong dần.",
      },
    },
    {
      quiz: {
        title: "Giải thích một khung pháo hoa",
        questions: [
          {
            q: "Vector `(4, 0)` đang chỉ sang phải. Sau phép xoay 90 độ, vector gần `(0, 4)`. Hạt sẽ đi theo hướng nào trên framebuffer?",
            a: ["Đi xuống vì y tăng", "Đi lên vì y giảm", "Đứng yên vì vx bằng 0"],
            correct: 0,
          },
          {
            q: "Một frame mới vẫn giữ vệt của frame cũ dù không muốn. Bước nào cần sửa?",
            a: ["Tạo framebuffer trong suốt mới trước khi raster hóa", "Cho `life` của mọi hạt tăng mãi, không bao giờ hết", "Gọi bộ phát hai lần nhưng không render"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "✦",
        name: "HUY HIỆU THỢ DỰNG PHÁO HOA",
        blurb: "tự tạo framebuffer, biến trạng thái hạt thành điểm ảnh, cập nhật hạt và viết bộ phát bằng vòng lặp",
        badge: true,
        badgeId: "huy_hieu_tho_dung_phao_hoa",
      },
    },
    {
      forge: {
        quiz: [
          { q: "Framebuffer 10×8 cần trong suốt để đặt lên camera. Giá trị ban đầu phù hợp cho mỗi điểm ảnh là gì?", a: ["`[0, 0, 0, 0]`", "`[255, 255, 255, 255]`", "`[10, 8]`"], correct: 0 },
          { q: "Hình vuông được vẽ với size 2 rồi giảm size sau mỗi frame. Thay đổi nào xuất hiện?", a: ["Hình nhỏ dần khi được raster hóa lại", "Hình tự di chuyển sang phải", "Màu tự đổi thành trắng"], correct: 0 },
          { q: "Hàm `emit` nhận 8 directions. Phần nào thực sự tạo 8 dictionary của hạt?", a: ["Vòng lặp thêm một dictionary cho mỗi direction", "`present_image_frame` tự đoán số hạt", "Alpha tự sinh thêm hạt"], correct: 0 },
          { q: "Một hạt có `(x, y) = (7, 9)` và `(vx, vy) = (2, -1)`. Sau update vị trí là gì?", a: ["`(9, 8)`", "`(5, 10)`", "`(2, -1)`"], correct: 0 },
          { q: "Muốn pháo hoa cong hơn nhưng vẫn giữ cùng bộ phát, thay đổi nào phù hợp?", a: ["Tăng nhẹ góc xoay vận tốc trong mỗi UPDATE", "Xóa vòng RENDER", "Gán mọi alpha bằng 0"], correct: 0 },
        ],
      },
    },
    { boss: { name: "THE BLANK FRAME", art: "assets/mirror-wraith.webp", glyph: "✦", ko: true } },
    {
      npc: "Bạn vừa đi từ một điểm ảnh đến pháo hoa mà không nhờ máy vẽ hộ. Node tiếp theo sẽ lấy tọa độ bàn tay rồi đặt hiệu ứng lên hình camera bằng chính các bước vừa học.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG PIXEL FIREWORK PACKET",
    theme: {
      motion: "comet",
      palette: { core: "#d69a20", dust: "#78b2a5", rune: "#f4c85a" },
      glyphs: "pixel rgba frame emit update render",
    },
  },
};
