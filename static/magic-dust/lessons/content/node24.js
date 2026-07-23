export default {
  index: 24,
  title: "Vòng Lặp Tương Tác: Từ Cử Chỉ Đến Pháo Hoa",
  subtitle: "tự phát hạt liên tục hoặc theo đợt, cập nhật trạng thái và ghép lớp RGBA lên camera",
  bundle: { art: "assets/future-packet.webp", name: "INTERACTION PIPELINE PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "BÀN ĐIỀU KHIỂN HIỆU ỨNG",
    blurb: "một bàn điều khiển nối dữ liệu quà tặng và bàn tay với bộ phát hạt do bạn tự viết",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      quiz: {
        title: "Ôn đường đi của hình ảnh",
        questions: [
          {
            q: "Muốn một hạt chuyển động trên nhiều frame, chương trình phải làm gì?",
            a: ["Cập nhật trạng thái rồi raster hóa lại mỗi frame", "Chỉ gọi lệnh hiển thị nhiều lần", "Chỉ tăng alpha nền"],
            correct: 0,
          },
          {
            q: "Một lớp ảnh RGBA có alpha 0 ở nền được dùng để làm gì?",
            a: ["Giữ hình camera nhìn xuyên qua nền", "Xóa dữ liệu bàn tay", "Tự tạo quà tặng"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Một hệ thống tương tác chạy theo vòng lặp INPUT–UPDATE–RENDER. INPUT đọc bàn tay và cử chỉ. UPDATE tạo hoặc thay đổi hạt. RENDER biến trạng thái hiện tại thành framebuffer rồi đưa frame lên màn hình.",
    },
    {
      npc: "Bộ phát liên tục thêm ít hạt ở mỗi frame, giống tia lửa đang phun. Bộ phát theo đợt thêm nhiều hạt khi có sự kiện mới, giống một quả pháo hoa nổ.",
    },
    {
      npc: "Cả hai kiểu bộ phát đều tạo các đối tượng `Particle`. Mỗi đối tượng tự giữ vị trí, vận tốc, tuổi thọ, kích thước và màu.",
    },
    {
      npc: "Vòng lặp quyết định cần tạo bao nhiêu hạt và mỗi hạt bay theo hướng nào.",
    },
    {
      code: `from camera_charm import Particle, start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

directions = [[0, -3], [2, -2], [3, 0], [2, 2], [0, 3], [-2, 2], [-3, 0], [-2, -2]]

def emit_burst(x, y, count, color):
    new_particles = []
    for index in range(count):
        direction = directions[index % len(directions)]
        new_particles.append(Particle(
            x=x,
            y=y,
            vx=direction[0],
            vy=direction[1],
            life=60,
            size=3,
            color=color,
        ))
    return new_particles

particles = emit_burst(50, 40, 8, "#ff64c8")
say_num(len(particles))
say_num(particles[0].vy)
say_num(particles[4].vy)

start_particle_stage("Một đợt phát hạt")
for frame in range(5):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle.update()
`,
      label: "burst_emitter_demo.py",
      note: "RUN KIỂM CHỨNG\nĐiểm phát (50, 40), tám hướng và màu được gán sẵn; bài này không đọc INPUT bên ngoài. Vòng lặp tạo tám đối tượng `Particle` tại cùng điểm phát và lấy hướng theo `index`. Mỗi lần gọi `update()` làm hạt đi thêm một bước. OUTPUT gồm `8`, `-3.0`, `3.0`, rồi năm frame cho thấy tám hạt cùng xuất hiện và tỏa ra quanh tâm.",
      expectOut: { all: [/particle_frame/i, /^8$/, /^-3\.0$/, /^3\.0$/] },
      solution: `from camera_charm import Particle, start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

directions = [[0, -3], [2, -2], [3, 0], [2, 2], [0, 3], [-2, 2], [-3, 0], [-2, -2]]
def emit_burst(x, y, count, color):
    new_particles = []
    for index in range(count):
        direction = directions[index % len(directions)]
        new_particles.append(Particle(
            x=x,
            y=y,
            vx=direction[0],
            vy=direction[1],
            life=60,
            size=3,
            color=color,
        ))
    return new_particles
particles = emit_burst(50, 40, 8, "#ff64c8")
say_num(len(particles))
say_num(particles[0].vy)
say_num(particles[4].vy)
start_particle_stage("Một đợt phát hạt")
for frame in range(5):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle.update()
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(x, y, frame):
    new_particles = []
    for index in range(2):
        vx = index * 2 - 1
        new_particles.append({
            "x": x,
            "y": y,
            "vx": vx,
            "vy": -2,
            "life": 4,
            "size": 2,
            "symbol": "·",
            "alpha": 255,
            "color": "#50dcff",
        })
    return new_particles

particles = []
start_particle_stage("Hai hạt mới trong mỗi frame")
for frame in range(5):
    particles = particles + emit_continuous(40, 60, frame)
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"] * 3
        particle["y"] = particle["y"] + particle["vy"] * 3

say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[1]["vx"])
`,
      label: "continuous_emitter_rate.py",
      note: "ĐỀ BÀI\nĐiểm phát và năm frame được gán sẵn; bài này không có INPUT bên ngoài. Hàm phải phát hai hạt mỗi frame, một hạt có vx = -1 và một hạt có vx = 1. Hoàn thiện phép tính `vx = index * 2 - 1`. OUTPUT chính là năm frame cho thấy dòng hạt được bổ sung liên tục; 10, -1 và 1 dùng để kiểm chứng số hạt và hai hướng ngang.",
      expectOut: { all: [/particle_frame/i, /^10$/, /^-1$/, /^1$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(x, y, frame):
    new_particles = []
    for index in range(2):
        vx = index * 2 - 1
        new_particles.append({"x": x, "y": y, "vx": vx, "vy": -2, "life": 4, "size": 2, "symbol": "·", "alpha": 255, "color": "#50dcff"})
    return new_particles
particles = []
start_particle_stage("Hai hạt mới trong mỗi frame")
for frame in range(5):
    particles = particles + emit_continuous(40, 60, frame)
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"] * 3
        particle["y"] = particle["y"] + particle["vy"] * 3
say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[1]["vx"])
`,
    },
    {
      checkpoint: {
        text: "Bộ phát liên tục chạy ở nhiều frame và tạo ít hạt mỗi lần. Bộ phát theo đợt chạy một lần khi sự kiện xuất hiện và tạo nhiều hạt. Cả hai đều dùng vòng lặp để tự tạo trạng thái `x/y/vx/vy/life/size/color`.",
      },
    },
    {
      quiz: {
        title: "Chọn kiểu phát hạt",
        questions: [
          {
            q: "Muốn tạo vệt sáng bám theo bàn tay trong lúc tay còn hiện, kiểu nào phù hợp?",
            a: ["Mỗi frame, phát thêm một ít hạt khi bàn tay còn hiện", "Chỉ phát một đợt khi mở chương trình", "Không tạo hạt mới"],
            correct: 0,
          },
          {
            q: "Muốn quà Crown làm pháo hoa nổ một lần, kiểu nào phù hợp?",
            a: ["Phát một đợt nhiều hướng khi nhận sự kiện", "Phát mãi dù không có sự kiện", "Chỉ đổi alpha nền"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Sau khi phát, UPDATE làm mỗi hạt thay đổi: `x/y` cộng vận tốc, `life` giảm, `size` và màu có thể nhỏ hoặc nhạt dần. Nhiều hướng khác nhau khiến các điểm ảnh tách ra như pháo hoa.",
    },
    {
      npc: "Rotation là phép quay hướng. Quay một vận tốc 90 độ trên màn hình có thể viết `new_vx = -vy`, `new_vy = vx`. Lặp phép tính này tạo bốn hướng mà không cần gõ sẵn từng cặp số.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

vx = 0
vy = -4
directions = []

for turn in range(4):
    directions.append([vx, vy])
    old_vx = vx
    vx = -vy
    vy = old_vx

say_num(directions[0][0])
say_num(directions[0][1])
say_num(directions[1][0])
say_num(directions[1][1])

start_particle_stage("Bốn hướng sau mỗi lần quay")
markers = []
for direction in directions:
    markers.append({"symbol": "✦", "x": 50 + direction[0] * 8, "y": 50 + direction[1] * 8, "size": 2, "color": "#ffd45c", "alpha": 255})
    draw_particle_frame(markers)
    delay(0.35)
`,
      label: "rotate_direction_demo.py",
      note: "RUN KIỂM CHỨNG\nHướng đầu (0, -4) và bốn lượt quay được gán sẵn; bài này không có INPUT bên ngoài. Mỗi lượt giữ vx cũ rồi tính hướng quay 90 độ. OUTPUT chính là bốn điểm sáng lần lượt xuất hiện quanh tâm; các số 0, -4, 4, 0 kiểm chứng hai hướng đầu.",
      expectOut: { all: [/particle_frame/i, /^0$/, /^-4$/, /^4$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

vx = 0
vy = -4
directions = []
for turn in range(4):
    directions.append([vx, vy])
    old_vx = vx
    vx = -vy
    vy = old_vx
say_num(directions[0][0])
say_num(directions[0][1])
say_num(directions[1][0])
say_num(directions[1][1])
start_particle_stage("Bốn hướng sau mỗi lần quay")
markers = []
for direction in directions:
    markers.append({"symbol": "✦", "x": 50 + direction[0] * 8, "y": 50 + direction[1] * 8, "size": 2, "color": "#ffd45c", "alpha": 255})
    draw_particle_frame(markers)
    delay(0.35)
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    red = particle["color"][0]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(" + str(red) + ",80,255)", "alpha": 255}

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        particle["size"] = particle["size"] - 1
        particle["color"][0] = particle["color"][0] - 30
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["color"][0] < 0:
            particle["color"][0] = 0
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles

particles = [{"x": 20, "y": 30, "vx": 3, "vy": -2, "life": 2, "size": 3, "color": [200, 80, 255]}]
start_particle_stage("Trước và sau UPDATE")
draw_particle_frame([display_particle(particles[0])])
delay(0.6)
particles = update_particles(particles)
draw_particle_frame([display_particle(particles[0])])
delay(0.8)
say_num(particles[0]["x"])
say_num(particles[0]["y"])
say_num(particles[0]["life"])
say_num(particles[0]["size"])
say_num(particles[0]["color"][0])
`,
      label: "update_size_color.py",
      note: "ĐỀ BÀI\nMột hạt được gán sẵn; bài này không có INPUT bên ngoài. Hoàn thiện UPDATE để x/y cộng vận tốc, life và size giảm 1, kênh đỏ giảm 30, rồi clamp size tối thiểu 1 và màu tối thiểu 0. OUTPUT chính là hai frame cho thấy hạt đi lên-phải, nhỏ đi và bớt đỏ; 23, 28, 1, 2, 170 dùng để kiểm chứng trạng thái mới.",
      expectOut: { all: [/particle_frame/i, /^23$/, /^28$/, /^1$/, /^2$/, /^170$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def display_particle(particle):
    red = particle["color"][0]
    return {"symbol": "✦", "x": particle["x"], "y": particle["y"], "size": particle["size"], "color": "rgb(" + str(red) + ",80,255)", "alpha": 255}

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        particle["size"] = particle["size"] - 1
        particle["color"][0] = particle["color"][0] - 30
        if particle["size"] < 1:
            particle["size"] = 1
        if particle["color"][0] < 0:
            particle["color"][0] = 0
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles
particles = [{"x": 20, "y": 30, "vx": 3, "vy": -2, "life": 2, "size": 3, "color": [200, 80, 255]}]
start_particle_stage("Trước và sau UPDATE")
draw_particle_frame([display_particle(particles[0])])
delay(0.6)
particles = update_particles(particles)
draw_particle_frame([display_particle(particles[0])])
delay(0.8)
say_num(particles[0]["x"])
say_num(particles[0]["y"])
say_num(particles[0]["life"])
say_num(particles[0]["size"])
say_num(particles[0]["color"][0])
`,
    },
    {
      checkpoint: {
        text: "UPDATE thay đổi trạng thái chứ không vẽ: cộng vận tốc vào vị trí, giảm life, thay đổi size hoặc màu, clamp các giá trị và chỉ giữ hạt có `life > 0`. Rotation 90 độ dùng cặp phép tính `new_vx = -vy`, `new_vy = vx`.",
      },
    },
    {
      quiz: {
        title: "Đọc chuyển động và vòng đời",
        questions: [
          {
            q: "Hạt có `vx = 2`, `vy = -3`. Sau phép quay 90 độ `(-vy, vx)`, hướng mới là gì?",
            a: ["`(3, 2)`", "`(-2, 3)`", "`(2, -3)`"],
            correct: 0,
          },
          {
            q: "Vì sao phải loại hạt có `life = 0`?",
            a: ["Để hiệu ứng kết thúc và danh sách hạt không tăng mãi", "Để camera tự đổi cử chỉ", "Để alpha nền thành 255"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "RENDER tạo một framebuffer mới, rồi tự tô mỗi hạt thành một hình vuông nhỏ. Khi lớp RGBA được đặt lên camera, alpha quyết định mức che phủ. Cách ghép này gọi là compositing.",
    },
    {
      npc: "Nếu alpha của lớp phủ là 128, màu nhìn thấy là sự pha trộn giữa màu hiệu ứng và màu camera phía sau. Python tạo lớp phủ; hệ thống hiển thị thực hiện phép pha cho từng điểm ảnh.",
    },
    {
      code: `from camera_charm import present_image_frame
from old_computer import say_num

camera_red = 40
overlay_red = 240
alpha = 128
mixed_red = (overlay_red * alpha + camera_red * (255 - alpha)) // 255

say_num(mixed_red)

image = []
for row in range(5):
    image_row = []
    for col in range(12):
        if col < 4:
            image_row.append([camera_red, 40, 80, 255])
        elif col < 8:
            image_row.append([overlay_red, 40, 80, alpha])
        else:
            image_row.append([mixed_red, 40, 80, 255])
    image.append(image_row)
present_image_frame(image)
`,
      label: "alpha_compositing_demo.py",
      note: "RUN KIỂM CHỨNG\nKênh đỏ của camera 40, lớp phủ 240 và alpha 128 được gán sẵn; bài này không có INPUT bên ngoài. Công thức lấy một phần từ lớp phủ và phần còn lại từ camera. OUTPUT chính là ba dải màu: màu camera, màu lớp phủ bán trong suốt và màu đã trộn; số 140 kiểm chứng rằng kết quả nằm giữa 40 và 240.",
      expectOut: { all: [/^140$/, /image_frame/i] },
      solution: `from camera_charm import present_image_frame
from old_computer import say_num

camera_red = 40
overlay_red = 240
alpha = 128
mixed_red = (overlay_red * alpha + camera_red * (255 - alpha)) // 255
say_num(mixed_red)
image = []
for row in range(5):
    image_row = []
    for col in range(12):
        if col < 4:
            image_row.append([camera_red, 40, 80, 255])
        elif col < 8:
            image_row.append([overlay_red, 40, 80, alpha])
        else:
            image_row.append([mixed_red, 40, 80, 255])
    image.append(image_row)
present_image_frame(image)
`,
    },
    {
      npc: "Bây giờ dữ liệu quà tặng chọn màu và kiểu phát. `watch()` cùng `read_hand_position()` là INPUT thật. Dictionary quà chỉ là dữ liệu gán sẵn; vòng lặp của bạn mới là phần biến dữ liệu đó thành hình ảnh.",
    },
    {
      code: `from camera_charm import watch, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image

def emit_burst(x, y, count, color):
    particles = []
    vx = 0
    vy = -4
    for index in range(count):
        particles.append({"x": x, "y": y, "vx": vx, "vy": vy, "life": 6, "size": 3, "color": color[:]})
        old_vx = vx
        vx = -vy
        vy = old_vx
    return particles

def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        if particle["life"] > 0:
            alive.append(particle)
    return alive

def render_particles(particles, height, width):
    image = blank_image(height, width)
    for particle in particles:
        center_col = particle["x"] * (width - 1) // 100
        center_row = particle["y"] * (height - 1) // 100
        radius = particle["size"] // 2
        for row in range(center_row - radius, center_row + radius + 1):
            for col in range(center_col - radius, center_col + radius + 1):
                if 0 <= row < height and 0 <= col < width:
                    color = particle["color"]
                    image[row][col] = [color[0], color[1], color[2], 220]
    return image

gifts = {
    1: {"name": "Star", "color": [80, 220, 255], "count": 4},
    3: {"name": "Heart", "color": [255, 90, 180], "count": 8},
}

finger = watch()
point = read_hand_position("palm")
particles = []
if finger in gifts and point["visible"] == True:
    gift = gifts[finger]
    particles = emit_burst(point["x"], point["y"], gift["count"], gift["color"])

for frame in range(6):
    particles = update_particles(particles)
    image = render_particles(particles, 32, 48)
    present_image_frame(image)
    delay(0.3)
`,
      label: "gift_hand_particle_pipeline.py",
      note: "THỬ THÁCH TÍCH HỢP\nINPUT thật là số ngón tay và vị trí lòng bàn tay. Dữ liệu cho sẵn gồm hai gift dictionaries. PROCESS tự ánh xạ cử chỉ, phát hạt tại tay, cập nhật trạng thái và raster hóa từng hạt vào framebuffer RGBA. `delay(0.3)` giữ từng frame đủ lâu để bạn nhìn thấy đường bay. OUTPUT là sáu `image_frame` tạo một đợt pháo hoa. Hãy đổi màu, số hạt hoặc phép quay để tạo kiểu riêng.",
      expectOut: { all: [/hand_position/i, /image_frame/i, { minLines: 6 }] },
      solution: `from camera_charm import watch, read_hand_position, present_image_frame, delay

def blank_image(height, width):
    image = []
    for row in range(height):
        image_row = []
        for col in range(width):
            image_row.append([0, 0, 0, 0])
        image.append(image_row)
    return image
def emit_burst(x, y, count, color):
    particles = []
    vx = 0
    vy = -4
    for index in range(count):
        particles.append({"x": x, "y": y, "vx": vx, "vy": vy, "life": 6, "size": 3, "color": color[:]})
        old_vx = vx
        vx = -vy
        vy = old_vx
    return particles
def update_particles(particles):
    alive = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        if particle["life"] > 0:
            alive.append(particle)
    return alive
def render_particles(particles, height, width):
    image = blank_image(height, width)
    for particle in particles:
        center_col = particle["x"] * (width - 1) // 100
        center_row = particle["y"] * (height - 1) // 100
        radius = particle["size"] // 2
        for row in range(center_row - radius, center_row + radius + 1):
            for col in range(center_col - radius, center_col + radius + 1):
                if 0 <= row < height and 0 <= col < width:
                    color = particle["color"]
                    image[row][col] = [color[0], color[1], color[2], 220]
    return image
gifts = {1: {"name": "Star", "color": [80, 220, 255], "count": 4}, 3: {"name": "Heart", "color": [255, 90, 180], "count": 8}}
finger = watch()
point = read_hand_position("palm")
particles = []
if finger in gifts and point["visible"] == True:
    gift = gifts[finger]
    particles = emit_burst(point["x"], point["y"], gift["count"], gift["color"])
for frame in range(6):
    particles = update_particles(particles)
    image = render_particles(particles, 32, 48)
    present_image_frame(image)
    delay(0.3)
`,
    },
    {
      checkpoint: {
        text: "Vòng lặp tương tác nối bốn phần: INPUT thật từ camera; dictionary quà được gán sẵn; UPDATE do học sinh tự viết; RENDER tự tô framebuffer RGBA. Compositing dùng alpha để trộn lớp hiệu ứng với hình camera.",
      },
    },
    {
      quiz: {
        title: "Kiểm tra toàn bộ pipeline",
        questions: [
          {
            q: "Đổi `gifts[3][\"count\"]` từ 8 thành 4 tác động trực tiếp đến phần nào?",
            a: ["Số dictionary mà emitter theo đợt tạo", "Tọa độ camera trả về", "Kích thước framebuffer"],
            correct: 0,
          },
          {
            q: "Chương trình gọi `present_image_frame` sáu lần nhưng không UPDATE hạt. Điều gì xảy ra?",
            a: ["Các điểm ảnh của hạt đứng yên", "Hạt tự quay", "Camera tự giảm life"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "FX",
        name: "HUY HIỆU KỸ SƯ PIPELINE",
        blurb: "tự nối cử chỉ, dữ liệu quà, bộ phát hạt, UPDATE, RENDER và ghép lớp ảnh thành một hiệu ứng hoàn chỉnh",
        badge: true,
        badgeId: "huy_hieu_ky_su_pipeline",
      },
    },
    {
      forge: {
        quiz: [
          { q: "Pháo hoa nổ một lần cần kiểu bộ phát nào?", a: ["Bộ phát theo đợt", "Bộ phát liên tục", "Không cần bộ phát"], correct: 0 },
          { q: "Vệt sáng theo tay cần kiểu bộ phát nào?", a: ["Bộ phát liên tục", "Chỉ một đợt lúc bắt đầu", "Chỉ framebuffer rỗng"], correct: 0 },
          { q: "Rotation 90 độ đổi `(vx, vy)` thành gì?", a: ["`(-vy, vx)`", "`(vy, vx)`", "`(-vx, -vy)`"], correct: 0 },
          { q: "RENDER đọc dữ liệu nào?", a: ["Trạng thái hạt sau UPDATE", "Tên người gửi duy nhất", "Camera không qua xử lý"], correct: 0 },
          { q: "Alpha dùng trong bước nào?", a: ["Compositing lớp hiệu ứng với camera", "Đếm ngón tay", "Tạo key quà"], correct: 0 },
        ],
      },
    },
    { boss: { name: "THE PREMADE EFFECT", art: "assets/mirror-wraith.webp", glyph: "FX", ko: true } },
    {
      npc: "Bạn đã tự làm việc của một particle engine: phát, cập nhật, loại hạt, raster hóa và ghép lớp ảnh. Dự án cuối sẽ để bạn hoàn thiện các hàm này và giải thích từng bước.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG INTERACTION PIPELINE PACKET",
    theme: {
      motion: "comet",
      palette: { core: "#d69a20", dust: "#78b2a5", rune: "#f4c85a" },
      glyphs: "input update render emit rotate alpha gift",
    },
  },
};
