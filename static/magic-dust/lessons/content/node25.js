export default {
  index: 25,
  title: "Dự Án Cuối Khóa: Phòng Phát Sóng Tương Tác",
  subtitle: "tự viết bộ phát hạt, phần dựng ảnh và lớp AR để biến cử chỉ cùng quà tặng thành hiệu ứng mang dấu ấn riêng",
  bundle: { art: "assets/future-packet.webp", name: "CREATOR BROADCAST PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "PHÒNG PHÁT SÓNG CỦA BẠN",
    blurb: "một phòng phát sóng cục bộ, nơi mọi điểm ảnh và chuyển động đều do code của bạn tính",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      quiz: {
        title: "Kiểm tra trước khi dựng dự án",
        questions: [
          {
            q: "Phần nào tạo dictionary mới cho từng hạt?",
            a: ["Emitter do học sinh viết", "Lệnh hiển thị framebuffer", "Camera"],
            correct: 0,
          },
          {
            q: "Phần nào biến `x/y/size/color` thành các điểm ảnh RGBA?",
            a: ["Rasterizer do học sinh viết", "Dictionary quà", "watch()"],
            correct: 0,
          },
          {
            q: "Chương trình đổi màu khi giơ ba ngón và đặt hiệu ứng tại lòng bàn tay. Dữ liệu nào là INPUT thật?",
            a: ["Số ngón và vị trí bàn tay từ camera", "Các màu gán sẵn", "Tên studio"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Dự án cuối là một phòng phát sóng tương tác chạy cục bộ. Quà tặng là dữ liệu mô phỏng; chương trình không đăng video, không dùng tiền thật và không gửi dữ liệu đến nền tảng bên ngoài.",
    },
    {
      npc: "Rubric chấm cơ chế, không chấm việc gọi hàm tiện ích có sẵn. Bạn không được dùng `draw_particle_frame`, `particle_burst`, `draw_sticker_at` hay `attach_sticker` để thay phần tự tính và tự vẽ.",
    },
    {
      npc: "Chương trình cuối có năm phần bạn phải viết: bộ phát hạt, UPDATE, hàm tạo điểm ảnh, hàm đặt sticker theo mask và luật nối cử chỉ với quà. `present_image_frame` chỉ hiển thị OUTPUT.",
    },

    {
      npc: "Bước một là bộ phát hạt. Dùng `index`, `count` và `spread` để tính hướng thay vì chép sẵn vận tốc. Ví dụ: `vx = (index - count // 2) * spread` tạo các hướng từ trái sang phải.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_fan(x, y, count, spread, color):
    particles = []
    for index in range(count):
        vx = (index - count // 2) * spread
        vy = -5 + abs(vx) // 2
        particles.append({
            "x": x,
            "y": y,
            "vx": vx,
            "vy": vy,
            "life": 7,
            "size": 3,
            "color": color[:],
        })
    return particles

particles = emit_fan(50, 60, 5, 2, [255, 100, 200])
say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])

start_particle_stage("Năm hướng của bộ phát hình quạt")
for frame in range(5):
    display = []
    for particle in particles:
        display.append({"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "#ff64c8", "alpha": 255})
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
    draw_particle_frame(display)
    delay(0.3)
`,
      label: "project_emitter_demo.py",
      note: "RUN KIỂM CHỨNG\nĐiểm phát (50, 60), count 5, spread 2 và màu được gán sẵn; bài này không có INPUT bên ngoài. Vòng lặp tự tính năm hướng. OUTPUT chính là năm frame cho thấy các hạt mở thành hình quạt; 5, -4, 0 và 4 dùng để kiểm chứng dải vận tốc từ trái qua phải.",
      expectOut: { all: [/particle_frame/i, /^5$/, /^-4$/, /^0$/, /^4$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_fan(x, y, count, spread, color):
    particles = []
    for index in range(count):
        vx = (index - count // 2) * spread
        vy = -5 + abs(vx) // 2
        particles.append({"x": x, "y": y, "vx": vx, "vy": vy, "life": 7, "size": 3, "color": color[:]})
    return particles
particles = emit_fan(50, 60, 5, 2, [255, 100, 200])
say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])
start_particle_stage("Năm hướng của bộ phát hình quạt")
for frame in range(5):
    display = []
    for particle in particles:
        display.append({"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "#ff64c8", "alpha": 255})
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
    draw_particle_frame(display)
    delay(0.3)
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_fan(x, y, count, spread, color):
    particles = []
    for index in range(count):
        vx = 0
        vy = -5
        particles.append({
            "x": x, "y": y,
            "vx": vx, "vy": vy,
            "life": 6, "size": 3,
            "color": color[:],
        })
    return particles

particles = emit_fan(40, 70, 5, 3, [80, 220, 255])
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])

start_particle_stage("Spread mở rộng hình quạt")
for frame in range(5):
    display = []
    for particle in particles:
        display.append({"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "#50dcff", "alpha": 255})
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
    draw_particle_frame(display)
    delay(0.3)
`,
      label: "project_emitter_spread.py",
      note: "ĐỀ BÀI\nĐiểm phát, count 5 và spread 3 được gán sẵn; bài này không có INPUT bên ngoài. Mọi hạt đang có vx = 0 nên chồng lên nhau. Viết `vx = (index - count // 2) * spread` và `vy = -5 + abs(vx) // 3`. OUTPUT chính là năm frame cho thấy hình quạt mở rộng; -6, 0 và 6 dùng để kiểm chứng ba vận tốc ngang.",
      expectOut: { all: [/particle_frame/i, /^-6$/, /^0$/, /^6$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_fan(x, y, count, spread, color):
    particles = []
    for index in range(count):
        vx = (index - count // 2) * spread
        vy = -5 + abs(vx) // 3
        particles.append({"x": x, "y": y, "vx": vx, "vy": vy, "life": 6, "size": 3, "color": color[:]})
    return particles
particles = emit_fan(40, 70, 5, 3, [80, 220, 255])
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])
start_particle_stage("Spread mở rộng hình quạt")
for frame in range(5):
    display = []
    for particle in particles:
        display.append({"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "#50dcff", "alpha": 255})
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
    draw_particle_frame(display)
    delay(0.3)
`,
    },
    {
      checkpoint: {
        text: "Emitter phải dùng vòng lặp để tạo `count` dictionary. `index - count // 2` cho vị trí tương đối quanh tâm; nhân với `spread` tạo dải vx; mỗi hạt còn cần x/y/vy/life/size/color để UPDATE và RENDER sử dụng.",
      },
    },
    {
      quiz: {
        title: "Giải thích bộ phát hạt",
        questions: [
          {
            q: "Với `count = 5`, giá trị `index - count // 2` lần lượt là gì?",
            a: ["-2, -1, 0, 1, 2", "0, 1, 2, 3, 4", "-5, 0, 5"],
            correct: 0,
          },
          {
            q: "Tăng `spread` từ 1 lên 3 làm thay đổi điều gì?",
            a: ["Các vận tốc ngang cách xa nhau hơn", "Camera đọc thêm tay", "Framebuffer có thêm hàng"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bước hai là UPDATE. Chuyển động xuất hiện khi code cộng vận tốc vào vị trí ở mỗi frame. Theo thời gian, size và một kênh màu có thể giảm; alpha được tính từ life.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    green = particle["color"][1]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(255," + str(green) + ",80)", "alpha": particle["alpha"]}

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["vy"] = particle["vy"] + 1
        particle["life"] = particle["life"] - 1
        particle["size"] = particle["size"] - 1
        particle["color"][1] = particle["color"][1] - 20
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["color"][1] < 0:
            particle["color"][1] = 0
        particle["alpha"] = particle["life"] * 40
        if particle["alpha"] > 255:
            particle["alpha"] = 255
        if particle["life"] > 0:
            alive.append(particle)
    return alive

particles = [{"x": 40, "y": 50, "vx": 2, "vy": -3, "life": 3, "size": 3, "color": [255, 180, 80], "alpha": 255}]
start_particle_stage("Trước và sau UPDATE")
draw_particle_frame([display_particle(particles[0])])
delay(0.6)
particles = update_particles(particles)
draw_particle_frame([display_particle(particles[0])])
delay(0.8)
say_num(particles[0]["x"])
say_num(particles[0]["y"])
say_num(particles[0]["vy"])
say_num(particles[0]["size"])
say_num(particles[0]["alpha"])
`,
      label: "project_update_demo.py",
      note: "RUN KIỂM CHỨNG\nMột hạt được gán sẵn; bài này không có INPUT bên ngoài. UPDATE cộng vận tốc, tăng vy để đường bay cong xuống, giảm life/size/màu và tính alpha. OUTPUT chính là hai frame cho thấy hạt đổi vị trí, nhỏ đi, đổi màu và mờ hơn; 42, 47, -2, 2, 80 dùng để kiểm chứng trạng thái mới.",
      expectOut: { all: [/particle_frame/i, /^42$/, /^47$/, /^-2$/, /^2$/, /^80$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    green = particle["color"][1]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(255," + str(green) + ",80)", "alpha": particle["alpha"]}

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["vy"] = particle["vy"] + 1
        particle["life"] = particle["life"] - 1
        particle["size"] = particle["size"] - 1
        particle["color"][1] = particle["color"][1] - 20
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["color"][1] < 0:
            particle["color"][1] = 0
        particle["alpha"] = particle["life"] * 40
        if particle["alpha"] > 255:
            particle["alpha"] = 255
        if particle["life"] > 0:
            alive.append(particle)
    return alive
particles = [{"x": 40, "y": 50, "vx": 2, "vy": -3, "life": 3, "size": 3, "color": [255, 180, 80], "alpha": 255}]
start_particle_stage("Trước và sau UPDATE")
draw_particle_frame([display_particle(particles[0])])
delay(0.6)
particles = update_particles(particles)
draw_particle_frame([display_particle(particles[0])])
delay(0.8)
say_num(particles[0]["x"])
say_num(particles[0]["y"])
say_num(particles[0]["vy"])
say_num(particles[0]["size"])
say_num(particles[0]["alpha"])
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] + 1
        particle["size"] = particle["size"] - 1
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["life"] >= 0:
            alive.append(particle)
    return alive

particles = [
    {"symbol": "✦", "color": "#ffd45c", "alpha": 255, "x": 10, "y": 20, "vx": 1, "vy": -1, "life": 1, "size": 2},
    {"symbol": "✦", "color": "#7ce7ff", "alpha": 255, "x": 30, "y": 40, "vx": 2, "vy": 1, "life": 3, "size": 2},
]
start_particle_stage("Hạt hết life biến mất")
draw_particle_frame(particles)
delay(0.7)
particles = update_particles(particles)
draw_particle_frame(particles)
delay(0.8)
say_num(len(particles))
say_num(particles[0]["life"])
`,
      label: "project_lifetime_fix.py",
      note: "ĐỀ BÀI\nHai hạt có life 1 và 3 được gán sẵn; bài này không có INPUT bên ngoài. Hàm đang tăng life và giữ hạt có life bằng 0. Đổi thành giảm life một đơn vị và chỉ append khi `life > 0`. OUTPUT chính là hai frame: frame đầu có hai hạt, frame sau chỉ còn một hạt; 1 và 2 kiểm chứng số hạt còn sống cùng life của nó.",
      expectOut: { all: [/particle_frame/i, /^1$/, /^2$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        particle["size"] = particle["size"] - 1
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["life"] > 0:
            alive.append(particle)
    return alive
particles = [{"symbol": "✦", "color": "#ffd45c", "alpha": 255, "x": 10, "y": 20, "vx": 1, "vy": -1, "life": 1, "size": 2}, {"symbol": "✦", "color": "#7ce7ff", "alpha": 255, "x": 30, "y": 40, "vx": 2, "vy": 1, "life": 3, "size": 2}]
start_particle_stage("Hạt hết life biến mất")
draw_particle_frame(particles)
delay(0.7)
particles = update_particles(particles)
draw_particle_frame(particles)
delay(0.8)
say_num(len(particles))
say_num(particles[0]["life"])
`,
    },
    {
      checkpoint: {
        text: "UPDATE tự tính chuyển động và hình thức qua thời gian: x/y cộng vận tốc, vy có thể thay đổi để bẻ cong đường bay, life giảm, size và màu thay đổi, alpha được clamp trong 0–255, hạt có `life <= 0` bị loại.",
      },
    },
    {
      quiz: {
        title: "Đọc một frame UPDATE",
        questions: [
          {
            q: "Mỗi frame chạy `vy = vy + 1`. Đường bay thay đổi thế nào?",
            a: ["Hạt dần bị kéo xuống trên hệ tọa độ màn hình", "Hạt đứng yên", "Hạt tự đổi cử chỉ"],
            correct: 0,
          },
          {
            q: "Vì sao clamp size tối thiểu bằng 1?",
            a: ["Để hạt còn sống vẫn có ít nhất một điểm ảnh để vẽ", "Để tăng count", "Để camera thấy tay"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Bước ba là RENDER. Mỗi frame bắt đầu bằng ảnh trong suốt. Rasterizer đổi x/y thành hàng-cột và dùng size để tô điểm ảnh. Hàm sticker cũng phải tự duyệt mask, scale và kiểm tra biên.",
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

def raster_particle(image, particle):
    height = len(image)
    width = len(image[0])
    center_col = particle["x"] * (width - 1) // 100
    center_row = particle["y"] * (height - 1) // 100
    radius = particle["size"] // 2
    for row in range(center_row - radius, center_row + radius + 1):
        for col in range(center_col - radius, center_col + radius + 1):
            if 0 <= row < height and 0 <= col < width:
                color = particle["color"]
                image[row][col] = [color[0], color[1], color[2], particle["alpha"]]

image = blank_image(12, 16)
particle = {"x": 50, "y": 50, "size": 3, "color": [255, 100, 200], "alpha": 180}
raster_particle(image, particle)

colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1
say_num(colored)
present_image_frame(image)
`,
      label: "project_rasterizer_demo.py",
      note: "RUN KIỂM CHỨNG\nẢnh 12×16 và một hạt size 3 được gán sẵn; bài này không có INPUT bên ngoài. Rasterizer tô khối 3×3 quanh tâm sau khi đổi phần trăm thành hàng-cột. OUTPUT là 9 và một `image_frame` có chín điểm ảnh màu.",
      expectOut: { all: [/^9$/, /image_frame/i] },
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
def raster_particle(image, particle):
    height = len(image)
    width = len(image[0])
    center_col = particle["x"] * (width - 1) // 100
    center_row = particle["y"] * (height - 1) // 100
    radius = particle["size"] // 2
    for row in range(center_row - radius, center_row + radius + 1):
        for col in range(center_col - radius, center_col + radius + 1):
            if 0 <= row < height and 0 <= col < width:
                color = particle["color"]
                image[row][col] = [color[0], color[1], color[2], particle["alpha"]]
image = blank_image(12, 16)
particle = {"x": 50, "y": 50, "size": 3, "color": [255, 100, 200], "alpha": 180}
raster_particle(image, particle)
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

def stamp_mask(image, mask, center_row, center_col, scale, color):
    start_row = center_row - len(mask) * scale // 2
    start_col = center_col - len(mask[0]) * scale // 2
    for mask_row in range(len(mask)):
        for mask_col in range(len(mask[0])):
            if mask[mask_row][mask_col] == 0:  # lượt của bạn: chỉ tô ô mask có giá trị 1
                for small_row in range(scale):
                    for small_col in range(scale):
                        row = start_row + mask_row * scale + small_row
                        col = start_col + mask_col * scale + small_col
                        if 0 <= row < len(image) and 0 <= col < len(image[0]):
                            image[row][col] = color

image = []
for row in range(10):
    image_row = []
    for col in range(12):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)

mask = [[1, 0, 0], [0, 1, 0]]
stamp_mask(image, mask, 5, 6, 2, [255, 220, 80, 255])

colored = 0
for row in image:
    for pixel in row:
        if pixel[3] > 0:
            colored = colored + 1
say_num(colored)
present_image_frame(image)
`,
      label: "project_sticker_mask.py",
      note: "ĐỀ BÀI\nẢnh 10×12, mask chéo và scale 2 được gán sẵn; bài này không có INPUT bên ngoài. Điều kiện đang tô nhầm các ô 0. Hãy đổi điều kiện để chỉ tô ô mask có giá trị 1; giữ phần phóng mỗi ô thành khối scale×scale và kiểm tra biên. OUTPUT chính là `image_frame` có sticker chéo màu vàng; số 8 kiểm chứng số điểm ảnh đã tô.",
      expectOut: { all: [/^8$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

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
image = []
for row in range(10):
    image_row = []
    for col in range(12):
        image_row.append([0, 0, 0, 0])
    image.append(image_row)
mask = [[1, 0, 0], [0, 1, 0]]
stamp_mask(image, mask, 5, 6, 2, [255, 220, 80, 255])
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
        text: "RENDER bắt đầu bằng framebuffer RGBA trong suốt. Rasterizer đổi x/y thành hàng-cột và tô khối theo size. Sticker rasterizer duyệt mask, lặp khối theo scale, bỏ ô 0 và kiểm tra biên trước khi tô.",
      },
    },
    {
      quiz: {
        title: "Kiểm tra rasterizer",
        questions: [
          {
            q: "Một hạt size 5 nằm hoàn toàn trong ảnh. Rasterizer hình vuông tô bao nhiêu điểm ảnh?",
            a: ["25", "10", "5"],
            correct: 0,
          },
          {
            q: "Vì sao tạo framebuffer mới ở mỗi frame?",
            a: ["Để điểm ảnh cũ không lưu lại ngoài ý muốn", "Để watch() đổi cử chỉ", "Để tăng life"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Khung dự án dưới đây cố ý chưa hoàn chỉnh. Bạn phải điền các hàm cốt lõi và luật chọn quà. Sau đó, hãy đổi chủ đề, mask, màu và chuyển động để thể hiện câu chuyện của bạn.",
    },
    {
      code: `from camera_charm import start_studio, watch, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    # TODO: dùng hai vòng lặp để tạo framebuffer RGBA trong suốt
    pass

def emit_particles(x, y, gift):
    # TODO: dùng count, spread và vòng lặp để tự tính hướng cho từng hạt
    pass

def update_particles(particles):
    # TODO: cập nhật x/y/vy/life/size/color/alpha và chỉ giữ hạt còn sống
    pass

def stamp_mask(image, mask, center_row, center_col, scale, color):
    # TODO: duyệt mask, scale từng ô, kiểm tra biên rồi tô RGBA
    pass

def render_scene(particles, point, mask, sticker_color, height, width):
    # TODO: tạo frame, raster hóa mọi hạt và đóng dấu sticker tại bàn tay
    pass

title = "MY LIGHT FESTIVAL"
sticker_mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
sticker_color = [255, 230, 80, 230]
gifts = {
    1: {"name": "Star", "message": "Ánh sáng bắt đầu!", "count": 5, "spread": 2, "color": [80, 220, 255]},
    3: {"name": "Heart", "message": "Cảm ơn bạn!", "count": 7, "spread": 2, "color": [255, 90, 180]},
    4: {"name": "Crown", "message": "Khoảnh khắc đặc biệt!", "count": 9, "spread": 1, "color": [255, 200, 60]},
}

particles = []
start_studio(title)
finger = watch()
point = read_hand_position("palm")

# TODO: nếu finger có trong gifts và tay hiện rõ, chọn gift rồi gọi bộ phát hạt

for frame in range(8):
    point = read_hand_position("palm")
    particles = update_particles(particles)
    image = render_scene(particles, point, sticker_mask, sticker_color, 24, 32)
    present_image_frame(image)
    delay(0.3)
`,
      label: "final_interactive_broadcast.py",
      note: "DỰ ÁN SÁNG TẠO\nINPUT thật: số ngón tay và vị trí lòng bàn tay từ camera. Dữ liệu gán sẵn: ba quà mẫu, tên studio, mask và màu sticker.\nPROCESS bắt buộc: tự hoàn thiện framebuffer; bộ phát dùng vòng lặp cùng count/spread; UPDATE thay đổi x/y/vy/life/size/color/alpha; phần RENDER tự tô hạt; hàm mask tự phóng hình và kiểm tra biên; luật cử chỉ chọn ít nhất ba quà. Không dùng hàm hiệu ứng cấp cao.\nOUTPUT: ít nhất tám `image_frame` được giữ 0,3 giây mỗi frame, sticker theo tay và đợt hạt phù hợp với cử chỉ.\nCÁ NHÂN HÓA: đổi tên, mask, ba quà, bảng màu, lời nhắn và ít nhất một công thức chuyển động. Viết hai câu giải thích lựa chọn của bạn cho giáo viên.",
      expectOut: { all: [/hand_position/i, { kind: "image_frame", minCount: 8, text: /"image"\s*:\s*\[\[/ }] },
      solution: `from camera_charm import start_studio, watch, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def emit_particles(x, y, gift):
    particles = []
    for index in range(gift["count"]):
        vx = (index - gift["count"] // 2) * gift["spread"]
        vy = -6 + abs(vx) // 2
        particles.append({"x": x, "y": y, "vx": vx, "vy": vy, "life": 8, "size": 3, "color": gift["color"][:], "alpha": 255})
    return particles

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["vy"] = particle["vy"] + 1
        particle["life"] = particle["life"] - 1
        if particle["life"] % 2 == 0:
            particle["size"] = particle["size"] - 1
        if particle["size"] < 1:
            particle["size"] = 1
        particle["color"][2] = particle["color"][2] - 15
        if particle["color"][2] < 0:
            particle["color"][2] = 0
        particle["alpha"] = particle["life"] * 32
        if particle["alpha"] > 255:
            particle["alpha"] = 255
        if particle["life"] > 0:
            alive.append(particle)
    return alive

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
                            image[row][col] = color[:]

def render_scene(particles, point, mask, sticker_color, height, width):
    image = blank_image(height, width)
    for particle in particles:
        center_col = particle["x"] * (width - 1) // 100
        center_row = particle["y"] * (height - 1) // 100
        radius = particle["size"] // 2
        for row in range(center_row - radius, center_row + radius + 1):
            for col in range(center_col - radius, center_col + radius + 1):
                if 0 <= row < height and 0 <= col < width:
                    color = particle["color"]
                    image[row][col] = [color[0], color[1], color[2], particle["alpha"]]
    if point["visible"] == True:
        hand_col = point["x"] * (width - 1) // 100
        hand_row = point["y"] * (height - 1) // 100
        stamp_mask(image, mask, hand_row - 4, hand_col, 2, sticker_color)
    return image

title = "MY LIGHT FESTIVAL"
sticker_mask = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
sticker_color = [255, 230, 80, 230]
gifts = {
    1: {"name": "Star", "message": "Ánh sáng bắt đầu!", "count": 5, "spread": 2, "color": [80, 220, 255]},
    3: {"name": "Heart", "message": "Cảm ơn bạn!", "count": 7, "spread": 2, "color": [255, 90, 180]},
    4: {"name": "Crown", "message": "Khoảnh khắc đặc biệt!", "count": 9, "spread": 1, "color": [255, 200, 60]},
}
particles = []
start_studio(title)
finger = watch()
point = read_hand_position("palm")
if finger in gifts and point["visible"] == True:
    selected_gift = gifts[finger]
    particles = particles + emit_particles(point["x"], point["y"], selected_gift)
for frame in range(8):
    point = read_hand_position("palm")
    particles = update_particles(particles)
    image = render_scene(particles, point, sticker_mask, sticker_color, 24, 32)
    present_image_frame(image)
    delay(0.3)
`,
    },
    {
      remember: [
        "Emitter phải tự tính hướng bằng vòng lặp, count và spread; mỗi hạt là một dictionary có đủ trạng thái.",
        "UPDATE phải thay đổi vị trí, vận tốc, life, size, color hoặc alpha và loại hạt đã hết tuổi thọ.",
        "RENDER phải tự tạo framebuffer RGBA, raster hóa hạt và đóng dấu mask bằng vòng lặp có kiểm tra biên.",
        "INPUT thật đến từ camera; dictionary quà là dữ liệu gán sẵn; `present_image_frame` chỉ đưa OUTPUT đã tính lên màn hình.",
      ],
    },
    {
      gift: {
        glyph: "LIVE",
        name: "HUY HIỆU NHÀ SÁNG TẠO ĐỒ HỌA TƯƠNG TÁC",
        blurb: "tự viết toàn bộ các bước từ cử chỉ và dữ liệu quà đến bộ phát hạt, framebuffer và lớp ảnh AR mang dấu ấn riêng",
        badge: true,
        badgeId: "huy_hieu_nha_sang_tao_do_hoa_tuong_tac",
      },
    },
    {
      forge: {
        quiz: [
          { q: "Dùng `particle_burst(...)` thay bộ phát tự viết có đạt rubric không?", a: ["Không, vì thiếu vòng lặp và phép tính tạo từng hạt", "Có, hàm tiện ích thay mọi cơ chế", "Có nếu đổi màu"], correct: 0 },
          { q: "Dùng `draw_sticker_at(...)` thay rasterizer mask có đạt rubric không?", a: ["Không, vì thiếu phần tự đổi tọa độ và tô điểm ảnh", "Có, vì mask không quan trọng", "Có nếu scale bằng 2"], correct: 0 },
          { q: "Phần nào chứng minh hạt chuyển động?", a: ["x/y thay đổi qua nhiều frame do UPDATE", "Tên quà thay đổi", "Framebuffer có kích thước cố định"], correct: 0 },
          { q: "Phần nào chứng minh dự án có AR?", a: ["Framebuffer và sticker dùng vị trí tay thật từ camera", "Màu được gán sẵn", "Tên studio có chữ AR"], correct: 0 },
          { q: "Dấu ấn cá nhân nên xuất hiện ở đâu?", a: ["Chủ đề, mask, màu, quà, lời nhắn và công thức chuyển động có chủ ý", "Chỉ đổi tên file", "Giữ nguyên toàn bộ mẫu"], correct: 0 },
        ],
      },
    },
    {
      npc: "THE COPY-PASTE BROADCAST chỉ biết gọi hiệu ứng có sẵn. Để đánh bại nó, bạn phải chỉ ra từng vòng lặp và phép tính đã tạo hướng bay, vòng đời, điểm ảnh, sticker và phản hồi cho cử chỉ.",
    },
    { boss: { name: "THE COPY-PASTE BROADCAST", art: "assets/mirror-wraith.webp", glyph: "LIVE", ko: true } },
    {
      npc: "Phòng phát sóng đã mang lựa chọn của bạn. Quan trọng hơn, bạn giải thích được cơ chế đồ họa bên dưới: dữ liệu đi vào, trạng thái thay đổi, điểm ảnh được tính và hình ảnh xuất hiện.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG CREATOR BROADCAST PACKET",
    theme: {
      motion: "comet",
      palette: { core: "#d69a20", dust: "#78b2a5", rune: "#f4c85a" },
      glyphs: "emit update raster mask rgba gesture creator",
    },
  },
};
