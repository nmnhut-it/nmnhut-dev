// Bonus practice after node24. This side island reuses particle lifecycle,
// emit/update/render, loops, functions, lists, dictionaries, and RGBA.
export default {
  index: -1,
  sideIslandId: "islandEMITTERLAB",
  title: "Xưởng Bộ Phát Hạt",
  subtitle: "điều khiển số hạt, nhịp phát, độ tỏa, kiểu phát và giới hạn hạt",
  bundle: { art: "assets/future-packet.webp", name: "BỘ ĐIỀU KHIỂN EMITTER" },
  machine: {
    art: "assets/future-machine.webp",
    name: "BÀN HIỆU CHỈNH BỘ PHÁT",
    blurb: "một bàn thử để đổi từng tham số rồi đo chính xác số hạt và hướng bay được tạo ra",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ XƯỞNG BỘ PHÁT HẠT ✦",
        hook: "UPDATE quyết định một hạt thay đổi ra sao. Emitter quyết định khi nào tạo hạt, tạo bao nhiêu hạt và mỗi hạt bắt đầu với trạng thái nào. Bạn sẽ hiệu chỉnh từng nút trước khi lắp một vệt sáng mô phỏng chuyển động bàn tay.",
        art: "assets/future-machine.webp",
      },
    },
    {
      quiz: {
        title: "EMIT, UPDATE hay RENDER?",
        questions: [
          {
            q: "Một hàm tạo 8 dictionary mới tại cùng điểm `(x, y)` và gán vận tốc khác nhau cho chúng. Hàm đó đang làm phần nào?",
            a: ["EMIT", "UPDATE", "RENDER"],
            correct: 0,
          },
          {
            q: "Với một hạt đã tồn tại, phần nào giảm `life` và cộng `vx/vy` vào vị trí?",
            a: ["UPDATE", "EMIT", "RENDER"],
            correct: 0,
          },
          {
            q: "Hàm đọc `x/y/size/color` rồi tô các điểm ảnh vào framebuffer thuộc phần nào?",
            a: ["RENDER", "UPDATE", "EMIT"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Emitter nhận tham số điều khiển. `count` là số hạt được tạo trong một lần gọi. Mỗi hạt mới nhận tọa độ của điểm phát làm `x/y` ban đầu. `spread` làm các vận tốc gần nhau hoặc cách xa nhau.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_burst(x, y, count, spread):
    particles = []
    for index in range(count):
        offset = index - count // 2
        particles.append({
            "symbol": "✦",
            "x": x,
            "y": y,
            "vx": offset * spread,
            "vy": -3,
            "life": 5,
            "size": 2,
            "color": "#7ce7ff",
            "alpha": 255,
        })
    return particles

particles = emit_burst(40, 30, 5, 2)
start_particle_stage("Count và spread")
for frame in range(4):
    draw_particle_frame(particles)
    delay(0.4)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])
`,
      label: "count_and_spread_demo.py",
      note: "RUN KIỂM CHỨNG\nĐiểm phát, `count = 5` và `spread = 2` được gán sẵn; không có INPUT từ bên ngoài. Năm ngôi sao bắt đầu cùng một điểm rồi tỏa thành năm đường bay. Các số bên dưới chỉ kiểm chứng rằng emitter đã tạo đủ năm hạt với vận tốc ngang -4, 0, 4.",
      expectOut: { all: [/particle_frame/i, /^5$/, /^-4$/, /^0$/, /^4$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_burst(x, y, count, spread):
    particles = []
    for index in range(count):
        offset = index - count // 2
        particles.append({"symbol": "✦", "x": x, "y": y, "vx": offset * spread, "vy": -3, "life": 5, "size": 2, "color": "#7ce7ff", "alpha": 255})
    return particles
particles = emit_burst(40, 30, 5, 2)
start_particle_stage("Count và spread")
for frame in range(4):
    draw_particle_frame(particles)
    delay(0.4)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
say_num(len(particles))
say_num(particles[0]["vx"])
say_num(particles[2]["vx"])
say_num(particles[4]["vx"])
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_burst(x, y, count, spread):
    particles = []
    for index in range(count):
        offset = index - count // 2
        particles.append({
            "symbol": "✦",
            "x": x,
            "y": y,
            "vx": offset + spread,  # sửa phép tính độ tỏa
            "vy": -2,
            "life": 4,
            "size": 2,
            "color": "#ff72d2",
            "alpha": 255,
        })
    return particles

particles = emit_burst(20, 20, 3, 3)
start_particle_stage("Sửa độ tỏa")
for frame in range(4):
    draw_particle_frame(particles)
    delay(0.4)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
say_num(particles[0]["vx"])
say_num(particles[1]["vx"])
say_num(particles[2]["vx"])
`,
      label: "repair_burst_spread.py",
      note: "ĐỀ BÀI\nĐiểm phát, ba hạt và `spread = 3` được gán sẵn; không có INPUT từ bên ngoài. Phép tính hiện tại dồn cả ba hạt sang bên phải. Sửa phép tính `vx` để nhân `offset` với `spread`. OUTPUT nhìn thấy phải là một hạt bay sang trái, một hạt đi thẳng và một hạt bay sang phải; ba số kiểm chứng là -3, 0, 3.",
      expectOut: { all: [/particle_frame/i, /^-3$/, /^0$/, /^3$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_burst(x, y, count, spread):
    particles = []
    for index in range(count):
        offset = index - count // 2
        particles.append({"symbol": "✦", "x": x, "y": y, "vx": offset * spread, "vy": -2, "life": 4, "size": 2, "color": "#ff72d2", "alpha": 255})
    return particles
particles = emit_burst(20, 20, 3, 3)
start_particle_stage("Sửa độ tỏa")
for frame in range(4):
    draw_particle_frame(particles)
    delay(0.4)
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
say_num(particles[0]["vx"])
say_num(particles[1]["vx"])
say_num(particles[2]["vx"])
`,
    },
    {
      checkpoint: {
        text: "Mỗi hạt mới nhận tọa độ của điểm phát làm `x/y` ban đầu. `count` quyết định số lượt lặp và số dictionary được tạo. `spread` tham gia phép tính `vx/vy`; spread lớn làm các vận tốc cách xa nhau hơn, không tự làm hạt lớn hơn.",
      },
    },
    {
      quiz: {
        title: "Hiệu chỉnh một đợt phát",
        questions: [
          {
            q: "Giữ `count = 5` nhưng đổi `spread` từ 1 thành 3. Điều gì thay đổi ngay khi emitter tạo hạt?",
            a: ["Số hạt vẫn là 5, các vận tốc cách xa nhau hơn", "Số hạt tăng thành 15", "Tuổi thọ tự tăng thành 15"],
            correct: 0,
          },
          {
            q: "Một hiệu ứng cần đúng 7 hạt xuất hiện cùng lúc khi có sự kiện. Tham số nào cần nhận giá trị 7?",
            a: ["`count` của emitter theo đợt", "`life` của UPDATE", "`alpha` của RENDER"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Emitter theo đợt được gọi một lần khi sự kiện xảy ra. Emitter liên tục được gọi ở nhiều frame. Trong xưởng này, `rate` là số hạt mới được tạo trong mỗi frame mà emitter liên tục đang hoạt động.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(x, y, rate):
    new_particles = []
    for index in range(rate):
        new_particles.append({
            "symbol": "•",
            "x": x,
            "y": y,
            "vx": index * 2 - 1,
            "vy": -1,
            "life": 4,
            "size": 1.5,
            "color": "#ffd45c",
            "alpha": 255,
        })
    return new_particles

particles = []
start_particle_stage("Rate = 2 hạt mỗi frame")
for frame in range(4):
    particles = particles + emit_continuous(30, 40, 2)
    draw_particle_frame(particles)
    delay(0.45)
    say_num(len(particles))
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
`,
      label: "continuous_rate_demo.py",
      note: "RUN KIỂM CHỨNG\nĐiểm phát, bốn frame và `rate = 2` hạt mỗi frame được gán sẵn; không có INPUT từ bên ngoài. Mỗi frame phải nhìn thấy chùm sáng dày thêm đúng hai hạt. Các số 2, 4, 6, 8 bên dưới là kiểm chứng phụ cho số hạt đang có.",
      expectOut: { all: [/particle_frame/i, { minLines: 4 }, /^2$/, /^4$/, /^6$/, /^8$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(x, y, rate):
    new_particles = []
    for index in range(rate):
        new_particles.append({"symbol": "•", "x": x, "y": y, "vx": index * 2 - 1, "vy": -1, "life": 4, "size": 1.5, "color": "#ffd45c", "alpha": 255})
    return new_particles
particles = []
start_particle_stage("Rate = 2 hạt mỗi frame")
for frame in range(4):
    particles = particles + emit_continuous(30, 40, 2)
    draw_particle_frame(particles)
    delay(0.45)
    say_num(len(particles))
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(rate):
    new_particles = []
    for index in range(1):  # sửa số lượt tạo hạt
        new_particles.append({"symbol": "•", "x": 35 + index * 8, "y": 50, "life": 3, "size": 1.5, "color": "#7ce7ff", "alpha": 255})
    return new_particles

particles = []
start_particle_stage("Sửa rate = 3")
for frame in range(3):
    particles = particles + emit_continuous(3)
    draw_particle_frame(particles)
    delay(0.45)
    for particle in particles:
        particle["y"] = particle["y"] - 6

say_num(len(particles))
`,
      label: "repair_emission_rate.py",
      note: "ĐỀ BÀI\nBa frame và `rate = 3` hạt mỗi frame được gán sẵn; không có INPUT từ bên ngoài. Hàm đang bỏ qua `rate`, nên mỗi frame chỉ thêm một chấm sáng. Sửa giới hạn vòng lặp để mỗi frame thêm đúng ba chấm. OUTPUT nhìn thấy phải dày lên theo nhịp 3 → 6 → 9 hạt; số kiểm chứng cuối là 9.",
      expectOut: { all: [/particle_frame/i, /^9$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def emit_continuous(rate):
    new_particles = []
    for index in range(rate):
        new_particles.append({"symbol": "•", "x": 35 + index * 8, "y": 50, "life": 3, "size": 1.5, "color": "#7ce7ff", "alpha": 255})
    return new_particles
particles = []
start_particle_stage("Sửa rate = 3")
for frame in range(3):
    particles = particles + emit_continuous(3)
    draw_particle_frame(particles)
    delay(0.45)
    for particle in particles:
        particle["y"] = particle["y"] - 6
say_num(len(particles))
`,
    },
    {
      checkpoint: {
        text: "Khi phát theo đợt, chương trình gọi emitter một lần để tạo `count` hạt. Khi phát liên tục, chương trình gọi emitter ở nhiều frame; `rate` cho biết mỗi frame tạo bao nhiêu hạt. UPDATE phải loại hạt đã hết `life`.",
      },
    },
    {
      quiz: {
        title: "Chọn kiểu emitter",
        questions: [
          {
            q: "Hiệu ứng phải tạo vệt sáng trong suốt thời gian bàn tay còn xuất hiện. Cách gọi nào phù hợp?",
            a: ["Ở mỗi frame còn nhìn thấy điểm tay, gọi emitter liên tục với rate nhỏ", "Chỉ gọi emitter một lần khi mở bài", "Chỉ RENDER lại mà không tạo hạt mới"],
            correct: 0,
          },
          {
            q: "Một động tác chạm hai tay cần tạo vòng sáng đúng một lần. Cách gọi nào phù hợp?",
            a: ["Khi sự kiện mới xuất hiện, gọi emitter theo đợt một lần", "Ở mọi frame, tạo một đợt dù không có sự kiện", "Làm cho `life` của mọi hạt tăng mãi"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nếu emitter liên tục tạo hạt mà chương trình không đặt giới hạn, danh sách có thể quá lớn. `max_particles` là ngân sách hạt: số hạt tối đa được phép giữ để hiệu ứng vẫn chạy ổn định.",
    },
    {
      npc: "Trong danh sách, hạt cũ nằm ở đầu và hạt mới nằm ở cuối. Slice `particles[-max_particles:]` lấy `max_particles` ô cuối, nên nó bỏ hạt cũ và giữ hạt mới nhất.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

particles = []
for particle_id in range(1, 9):
    particles.append({"id": particle_id, "symbol": "•", "x": 10 + particle_id * 9, "y": 50, "size": 1.5, "color": "#ff72d2", "alpha": 255})
max_particles = 5

start_particle_stage("Giữ hạt mới nhất")
draw_particle_frame(particles)
delay(0.8)
if len(particles) > max_particles:
    particles = particles[:max_particles]  # sửa phần danh sách được giữ
draw_particle_frame(particles)
delay(1)

say_num(len(particles))
say_num(particles[0]["id"])
say_num(particles[4]["id"])
`,
      label: "keep_particle_budget.py",
      note: "ĐỀ BÀI\nTám hạt theo thứ tự tạo và ngân sách năm hạt được gán sẵn; không có INPUT từ bên ngoài. Frame đầu cho thấy đủ tám hạt. Sửa slice để frame sau bỏ ba hạt cũ ở bên trái và chỉ giữ năm hạt mới nhất. Các số kiểm chứng đúng là 5, 4 và 8.",
      expectOut: { all: [/particle_frame/i, /^5$/, /^4$/, /^8$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

particles = []
for particle_id in range(1, 9):
    particles.append({"id": particle_id, "symbol": "•", "x": 10 + particle_id * 9, "y": 50, "size": 1.5, "color": "#ff72d2", "alpha": 255})
max_particles = 5
start_particle_stage("Giữ hạt mới nhất")
draw_particle_frame(particles)
delay(0.8)
if len(particles) > max_particles:
    particles = particles[-max_particles:]
draw_particle_frame(particles)
delay(1)
say_num(len(particles))
say_num(particles[0]["id"])
say_num(particles[4]["id"])
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["life"] = particle["life"] - 1
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles

particles = [
    {"life": 1, "symbol": "•", "x": 25, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 80},
    {"life": 3, "symbol": "•", "x": 42, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 180},
    {"life": 2, "symbol": "•", "x": 59, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 130},
    {"life": 4, "symbol": "•", "x": 76, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 255},
]
start_particle_stage("Life rồi tới budget")
draw_particle_frame(particles)
delay(0.8)
particles = update_particles(particles)
max_particles = 2
if len(particles) > max_particles:
    particles = particles[-max_particles:]
draw_particle_frame(particles)
delay(1)

say_num(len(particles))
say_num(particles[0]["life"])
say_num(particles[1]["life"])
`,
      label: "life_then_budget_demo.py",
      note: "RUN KIỂM CHỨNG\nBốn hạt có tuổi thọ khác nhau và ngân sách hai hạt được gán sẵn; không có INPUT từ bên ngoài. Frame đầu có bốn chấm. UPDATE loại hạt hết tuổi trước, rồi phép cắt giữ hai hạt mới nhất ở frame sau. Các số 2, 1, 3 là kiểm chứng phụ.",
      expectOut: { all: [/particle_frame/i, /^2$/, /^1$/, /^3$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["life"] = particle["life"] - 1
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles
particles = [
    {"life": 1, "symbol": "•", "x": 25, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 80},
    {"life": 3, "symbol": "•", "x": 42, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 180},
    {"life": 2, "symbol": "•", "x": 59, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 130},
    {"life": 4, "symbol": "•", "x": 76, "y": 50, "size": 1.5, "color": "#7ce7ff", "alpha": 255},
]
start_particle_stage("Life rồi tới budget")
draw_particle_frame(particles)
delay(0.8)
particles = update_particles(particles)
max_particles = 2
if len(particles) > max_particles:
    particles = particles[-max_particles:]
draw_particle_frame(particles)
delay(1)
say_num(len(particles))
say_num(particles[0]["life"])
say_num(particles[1]["life"])
`,
    },
    {
      checkpoint: {
        text: "Mỗi frame nên loại hạt có `life <= 0`, rồi áp dụng `max_particles` nếu danh sách vẫn quá dài. Phép cắt `particles[-max_particles:]` giữ các hạt mới nhất; ngân sách này giới hạn chi phí UPDATE và RENDER.",
      },
    },
    {
      quiz: {
        title: "Giữ hiệu ứng trong ngân sách",
        questions: [
          {
            q: "Emitter tạo 4 hạt mỗi frame trong 10 frame, nhưng `max_particles = 12`. Sau khi áp dụng giới hạn, danh sách có thể giữ nhiều nhất bao nhiêu hạt?",
            a: ["12", "40", "4"],
            correct: 0,
          },
          {
            q: "Trong danh sách, hạt cũ nằm trước và hạt mới nằm sau. Cách nào giữ 20 hạt mới nhất?",
            a: ["`particles = particles[-20:]`", "`particles = particles[:20]`", "`particles = particles + 20`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bài cuối dùng hai list điều khiển: `palette` chứa các màu; `pattern` chứa các cặp `[vx, vy]` chỉ hướng bay. Bạn có thể đổi hai list này để tạo phong cách riêng mà không viết lại pipeline.",
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

def emit_particles(x, y, rate, palette, pattern):
    new_particles = []
    # Vòng lặp chạy rate lượt; mỗi lượt lấy màu và hướng theo index
    return new_particles

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        particle["size"] = max(1, particle["life"] // 2)
        particle["color"][3] = particle["life"] * 255 // particle["max_life"]
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles

def render_particles(particles, width, height):
    frame = make_frame(width, height)
    for particle in particles:
        center_x = round(particle["x"])
        center_y = round(particle["y"])
        for y in range(center_y - particle["size"], center_y + particle["size"] + 1):
            for x in range(center_x - particle["size"], center_x + particle["size"] + 1):
                set_pixel(frame, x, y, particle["color"])
    return frame

hand_path = [[5, 13], [8, 11], [11, 9], [14, 8], [17, 8]]
palette = [[80, 220, 255], [255, 100, 210]]
pattern = [[-1, -2], [1, -2], [0, -3]]
rate = 2
max_particles = 6
particles = []

for point in hand_path:
    particles = particles + emit_particles(point[0], point[1], rate, palette, pattern)
    particles = update_particles(particles)
    if len(particles) > max_particles:
        particles = particles[-max_particles:]
    image = render_particles(particles, 24, 16)
    present_image_frame(image)
    delay(0.35)

say_num(len(particles))
`,
      label: "emitter_hand_trail_studio.py",
      note: "ĐỀ BÀI MỞ\nNăm điểm mô phỏng đường đi của bàn tay, hai màu, ba hướng, `rate = 2`, ngân sách sáu hạt và framebuffer được gán sẵn; bài này không đọc INPUT từ camera. Hoàn thiện `emit_particles`: lặp `rate` lần, lấy màu và hướng theo `index`, rồi tạo dictionary có `x/y`, `vx/vy`, `life = max_life = 5`, `size = 2` và màu RGBA. OUTPUT kỹ thuật phải có năm `image_frame`, rồi số hạt cuối là 6. Khi đã chạy đúng, hãy sửa `palette`, `pattern` hoặc `rate` nhưng vẫn giữ `max_particles` không quá 12.",
      expectOut: { all: [/image_frame/i, /^6$/] },
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

def emit_particles(x, y, rate, palette, pattern):
    new_particles = []
    for index in range(rate):
        direction = pattern[index % len(pattern)]
        color = palette[index % len(palette)]
        particle_color = [color[0], color[1], color[2], 255]
        new_particles.append({"x": x, "y": y, "vx": direction[0], "vy": direction[1], "life": 5, "max_life": 5, "size": 2, "color": particle_color})
    return new_particles

def update_particles(particles):
    alive_particles = []
    for particle in particles:
        particle["x"] = particle["x"] + particle["vx"]
        particle["y"] = particle["y"] + particle["vy"]
        particle["life"] = particle["life"] - 1
        particle["size"] = max(1, particle["life"] // 2)
        particle["color"][3] = particle["life"] * 255 // particle["max_life"]
        if particle["life"] > 0:
            alive_particles.append(particle)
    return alive_particles

def render_particles(particles, width, height):
    frame = make_frame(width, height)
    for particle in particles:
        center_x = round(particle["x"])
        center_y = round(particle["y"])
        for y in range(center_y - particle["size"], center_y + particle["size"] + 1):
            for x in range(center_x - particle["size"], center_x + particle["size"] + 1):
                set_pixel(frame, x, y, particle["color"])
    return frame

hand_path = [[5, 13], [8, 11], [11, 9], [14, 8], [17, 8]]
palette = [[80, 220, 255], [255, 100, 210]]
pattern = [[-1, -2], [1, -2], [0, -3]]
rate = 2
max_particles = 6
particles = []
for point in hand_path:
    particles = particles + emit_particles(point[0], point[1], rate, palette, pattern)
    particles = update_particles(particles)
    if len(particles) > max_particles:
        particles = particles[-max_particles:]
    image = render_particles(particles, 24, 16)
    present_image_frame(image)
    delay(0.35)
say_num(len(particles))
`,
    },
    {
      checkpoint: {
        text: "Một emitter có các nút điều khiển rõ ràng: điểm phát, `count` hoặc `rate`, `spread` hay `pattern`, `palette`, trạng thái ban đầu và `max_particles`. Đổi dữ liệu điều khiển để sáng tạo kiểu hiệu ứng; giữ EMIT, UPDATE và RENDER thành các hàm riêng để dễ kiểm tra.",
      },
    },
    {
      quiz: {
        title: "Thiết kế emitter cho dự án",
        questions: [
          {
            q: "Muốn vệt tay mịn hơn nhưng máy đang chậm. Thay đổi nào nên thử trước mà vẫn giữ ngân sách rõ ràng?",
            a: ["Tăng nhẹ `rate` nhưng giữ `max_particles` ở một giới hạn đo được", "Bỏ kiểm tra `life` và bỏ `max_particles`", "Tăng framebuffer vô hạn"],
            correct: 0,
          },
          {
            q: "Muốn chuyển từ tia sáng hẹp sang chùm sáng tỏa rộng mà không đổi số hạt. Nên đổi dữ liệu nào?",
            a: ["Các cặp vận tốc trong `pattern` hoặc giá trị `spread`", "`count` thành 0", "Xóa alpha khỏi màu"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Emitter tạo trạng thái ban đầu của hạt. `count` điều khiển một đợt phát; `rate` điều khiển số hạt mới mỗi frame khi phát liên tục; `spread` hoặc `pattern` điều khiển hướng; `palette` điều khiển màu; `max_particles` giữ danh sách trong ngân sách. Pipeline hoàn chỉnh luôn tách EMIT → UPDATE → RENDER.",
    },
  ],
};
