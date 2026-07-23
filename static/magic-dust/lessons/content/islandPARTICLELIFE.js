// Bonus practice after node22. Learners first animate one visible shape,
// then name its state as a particle and finally combine particles into a burst.
export default {
  index: -1,
  sideIslandId: "islandPARTICLELIFE",
  title: "Đảo Vòng Đời Hạt",
  subtitle: "tự làm một hình di chuyển, thu nhỏ và mờ dần trước khi ghép thành pháo hoa",
  bundle: { art: "assets/future-packet.webp", name: "BỘ DỤNG CỤ VÒNG ĐỜI HẠT" },
  machine: {
    art: "assets/future-machine.webp",
    name: "SÂN KHẤU HẠT ÁNH SÁNG",
    blurb: "một sân khấu xem trước từng frame để mỗi dòng move, scale và fade đều tạo ra thay đổi nhìn thấy được",
  },
  modules: { camera_charm: "../py/camera_charm/__init__.py", old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO VÒNG ĐỜI HẠT ✦",
        hook: "Tạm thời chưa cần nhớ định nghĩa particle. Bạn sẽ bắt đầu với đúng một hình, tự thêm từng dòng làm hình chuyển động, thu nhỏ và mờ đi. Khi mọi phần đã chạy, tụi mình mới đặt tên cho cơ chế vừa tạo.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Trước hết, hãy nhìn từng dòng tạo ra điều gì. Dictionary `image` chỉ giữ hình ngôi sao, vị trí, kích thước và màu. Nó chưa chuyển động.",
    },
    {
      label: "walk_one_shape",
      walkthrough: {
        title: "BƯỚC 1 — ĐẶT MỘT HÌNH LÊN SÂN KHẤU",
        intro: "Bấm từng bước. Chỉ khi dòng vẽ chạy, dictionary mới trở thành một hình nhìn thấy được.",
        code: [
          "from camera_charm import start_particle_stage, draw_particle_frame, delay",
          'start_particle_stage("Hình đầu tiên")',
          'image = {"symbol": "✦", "x": 50, "y": 50, "size": 2, "color": "#7ce7ff", "alpha": 255}',
          "draw_particle_frame([image])",
          "delay(1)",
        ],
        steps: [
          { line: 1, explain: "Dòng import lấy ba công cụ: mở sân khấu, vẽ một frame và giữ frame đủ lâu để mắt nhìn thấy.", memory: "Đã lấy ba công cụ hiển thị." },
          { line: 2, explain: "`start_particle_stage(...)` mở vùng xem trước. Bài này không mở camera và không đọc INPUT bên ngoài.", action: { action: "particle_stage_start", title: "Hình đầu tiên" }, memory: "Sân khấu xem trước đã mở." },
          { line: 3, explain: "Dictionary lưu ngôi sao tại `(50, 50)`, size 2, màu xanh và alpha 255. Dòng này mới tạo dữ liệu, chưa vẽ hình.", memory: "Đã có dữ liệu của một hình." },
          { line: 4, explain: "`draw_particle_frame([image])` nhận một list có đúng một hình. Bây giờ ngôi sao mới xuất hiện ở giữa sân khấu.", action: { action: "particle_frame", particles: [{ symbol: "✦", x: 50, y: 50, size: 2, color: "#7ce7ff", alpha: 255 }] }, observeMs: 900, memory: "Frame hiện có một ngôi sao." },
          { line: 5, explain: "`delay(1)` giữ nguyên frame trong một giây. Không có delay, chương trình có thể đổi frame quá nhanh để mình quan sát.", action: { action: "delay", seconds: 1 }, memory: "Frame được giữ trong một giây." },
        ],
      },
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay

start_particle_stage("Hình đầu tiên")

image = {
    "symbol": "✦",
    "x": 50,
    "y": 50,
    "size": 2,
    "color": "#7ce7ff",
    "alpha": 255,
}

# Gọi hàm để vẽ list chỉ chứa image
delay(1)
`,
      label: "show_one_shape.py",
      note: "ĐỀ BÀI\nHình, vị trí, size, màu và alpha được gán sẵn; không có INPUT từ camera. Thêm một lời gọi `draw_particle_frame(...)` để vẽ list chứa đúng `image`, rồi giữ frame trong một giây. OUTPUT phải có một `particle_frame` với ngôi sao ở giữa sân khấu.",
      expectOut: { all: [/particle_stage_start/i, /particle_frame/i] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay

start_particle_stage("Hình đầu tiên")
image = {"symbol": "✦", "x": 50, "y": 50, "size": 2, "color": "#7ce7ff", "alpha": 255}
draw_particle_frame([image])
delay(1)
`,
    },
    {
      checkpoint: {
        text: "Dictionary chỉ lưu dữ liệu của hình. `draw_particle_frame([image])` biến dữ liệu hiện tại thành một frame nhìn thấy được. `delay(seconds)` giữ frame trên sân khấu để mắt kịp quan sát.",
      },
    },
    {
      quiz: {
        title: "Dữ liệu hay hình nhìn thấy?",
        questions: [
          {
            q: "Chương trình đã tạo `image = {\"x\": 50, \"y\": 50, ...}` nhưng chưa gọi `draw_particle_frame`. Trên sân khấu có gì?",
            a: ["Chưa có hình nào được vẽ", "Một hình tự xuất hiện ở giữa", "Năm frame giống nhau"],
            correct: 0,
          },
          {
            q: "Vì sao bài dùng `delay(1)` sau khi vẽ frame?",
            a: ["Để giữ frame đủ lâu cho mắt quan sát", "Để tự đổi vị trí của hình", "Để tạo thêm bốn hình"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ dùng `for` để tạo nhiều frame. Nếu mỗi lượt chỉ vẽ lại cùng dữ liệu, hình vẫn đứng yên. Vòng lặp không tự tạo chuyển động.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

start_particle_stage("Năm frame đứng yên")
image = {"symbol": "✦", "x": 30, "y": 60, "size": 2, "color": "#7ce7ff", "alpha": 255}

for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)

say_num(image["x"])
`,
      label: "repeat_same_frame.py",
      note: "RUN KIỂM CHỨNG\nMột hình và năm lượt lặp được gán sẵn; không có INPUT từ bên ngoài. Ở lượt nào, chương trình cũng vẽ hình tại `x = 30`, nên hình đứng yên trong cả năm frame. OUTPUT số vẫn là 30. Đây là bằng chứng rằng `for` và `delay` chưa đủ tạo chuyển động.",
      expectOut: { all: [/particle_frame/i, /^30$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

start_particle_stage("Năm frame đứng yên")
image = {"symbol": "✦", "x": 30, "y": 60, "size": 2, "color": "#7ce7ff", "alpha": 255}
for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)
say_num(image["x"])
`,
    },
    {
      npc: "Muốn frame sau khác frame trước, code phải sửa dữ liệu giữa hai lần vẽ. Hàm `move_image` cộng `dx/dy` vào vị trí hiện tại của hình.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

start_particle_stage("Thêm một dòng move")
image = {"symbol": "✦", "x": 25, "y": 70, "size": 2, "color": "#7ce7ff", "alpha": 255}

for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)
    # Thêm move_image(image, 5, -3) ở đây

say_num(image["x"])
say_num(image["y"])
`,
      label: "add_move_line.py",
      note: "ĐỀ BÀI\nVị trí đầu `(25, 70)`, năm frame và hàm `move_image` được cho sẵn; không có INPUT từ camera. Trong vòng `for`, mỗi lần vẽ xong, gọi hàm để x tăng 5 và y giảm 3. Bạn phải nhìn thấy ngôi sao đi lên về bên phải. OUTPUT cuối là 50 rồi 55.",
      expectOut: { all: [/particle_frame/i, /^50$/, /^55$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

start_particle_stage("Thêm một dòng move")
image = {"symbol": "✦", "x": 25, "y": 70, "size": 2, "color": "#7ce7ff", "alpha": 255}
for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)
    move_image(image, 5, -3)
say_num(image["x"])
say_num(image["y"])
`,
    },
    {
      checkpoint: {
        text: "Một hoạt ảnh cần nhiều frame và dữ liệu khác nhau giữa các frame. `move_image(image, dx, dy)` sửa `x/y` sau mỗi lần vẽ, nên lần vẽ tiếp theo đặt hình ở vị trí mới.",
      },
    },
    {
      quiz: {
        title: "Dòng nào tạo chuyển động?",
        questions: [
          {
            q: "Trong vòng lặp, code gọi `draw_particle_frame`, `delay`, rồi `move_image(image, 4, 0)`. Sau mỗi frame, hình thay đổi thế nào?",
            a: ["Đi sang phải 4 đơn vị", "Đi xuống 4 đơn vị", "Tự nhỏ đi 4 lần"],
            correct: 0,
          },
          {
            q: "Nếu đưa `move_image(...)` ra ngoài, sau toàn bộ vòng `for`, điều gì xảy ra?",
            a: ["Hình đứng yên trong cả năm frame, rồi vị trí chỉ đổi một lần sau cùng", "Mỗi frame đi nhanh gấp đôi", "Vòng lặp tự gọi move"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Hình đã chuyển động. Tiếp theo, hàm `scale_image` gán lại `size`. Size nhỏ hơn làm cùng một hình được vẽ nhỏ hơn ở frame kế tiếp.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

def scale_image(image, amount):
    image["size"] = max(0.25, image["size"] + amount)

start_particle_stage("Thêm một dòng scale")
image = {"symbol": "✦", "x": 25, "y": 70, "size": 2, "color": "#7ce7ff", "alpha": 255}

for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)
    move_image(image, 5, -3)
    # Thêm scale_image(image, -0.2) ở đây

say_num(round(image["size"] * 10))
`,
      label: "add_scale_line.py",
      note: "ĐỀ BÀI\nHình chuyển động, size ban đầu bằng 2 và năm frame được gán sẵn; không có INPUT bên ngoài. Mỗi lần vẽ xong, gọi `scale_image` để giảm size 0,2. Bạn phải nhìn thấy ngôi sao vừa bay vừa nhỏ dần. OUTPUT cuối là 10, tức size còn 1,0.",
      expectOut: { all: [/particle_frame/i, /^10$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

def scale_image(image, amount):
    image["size"] = max(0.25, image["size"] + amount)

start_particle_stage("Thêm một dòng scale")
image = {"symbol": "✦", "x": 25, "y": 70, "size": 2, "color": "#7ce7ff", "alpha": 255}
for frame in range(5):
    draw_particle_frame([image])
    delay(0.35)
    move_image(image, 5, -3)
    scale_image(image, -0.2)
say_num(round(image["size"] * 10))
`,
    },
    {
      npc: "Alpha điều khiển độ rõ: 255 là rõ hoàn toàn, 0 là trong suốt. Hàm `fade_image` giảm alpha để hình mờ dần thay vì biến mất đột ngột.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

def scale_image(image, amount):
    image["size"] = max(0.25, image["size"] + amount)

def fade_image(image, amount):
    image["alpha"] = max(0, image["alpha"] - amount)

start_particle_stage("Move, scale và fade")
image = {"symbol": "✦", "x": 30, "y": 70, "size": 2, "color": "#ff72d2", "alpha": 255, "life": 5}

for frame in range(image["life"]):
    draw_particle_frame([image])
    delay(0.35)
    move_image(image, 3, -4)
    scale_image(image, -0.2)
    # Thêm fade_image(image, 50) ở đây

say_num(image["x"])
say_num(image["y"])
say_num(round(image["size"] * 10))
say_num(image["alpha"])
`,
      label: "add_fade_and_life.py",
      note: "ĐỀ BÀI\nHình có `life = 5`, nghĩa là được vẽ trong năm frame; không có INPUT từ camera. Mỗi lần vẽ xong, gọi `fade_image` để giảm alpha 50. Hình phải bay lên, nhỏ dần và mờ dần. OUTPUT cuối là 45, 50, 10 và 5.",
      expectOut: { all: [/particle_frame/i, /^45$/, /^50$/, /^10$/, /^5$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def move_image(image, dx, dy):
    image["x"] = image["x"] + dx
    image["y"] = image["y"] + dy

def scale_image(image, amount):
    image["size"] = max(0.25, image["size"] + amount)

def fade_image(image, amount):
    image["alpha"] = max(0, image["alpha"] - amount)

start_particle_stage("Move, scale và fade")
image = {"symbol": "✦", "x": 30, "y": 70, "size": 2, "color": "#ff72d2", "alpha": 255, "life": 5}
for frame in range(image["life"]):
    draw_particle_frame([image])
    delay(0.35)
    move_image(image, 3, -4)
    scale_image(image, -0.2)
    fade_image(image, 50)
say_num(image["x"])
say_num(image["y"])
say_num(round(image["size"] * 10))
say_num(image["alpha"])
`,
    },
    {
      npc: "Bạn vừa tự tạo một particle, hay hạt: một hình nhỏ có trạng thái riêng và thay đổi qua nhiều frame. Nó không phải một điểm ảnh đứng yên và cũng không phải hiệu ứng có sẵn.",
    },
    {
      npc: "Trong dictionary của hạt, `x/y` là vị trí; `vx/vy` là số được cộng vào vị trí; `size` là scale; `alpha` là độ rõ; `life` là số frame hạt tồn tại.",
    },
    {
      checkpoint: {
        text: "Một particle hình thành từ bốn phần nhìn thấy được: vẽ trạng thái hiện tại, chờ bằng `delay`, sửa vị trí bằng move, rồi sửa size và alpha. `life` giới hạn số frame của quá trình đó.",
      },
    },
    {
      quiz: {
        title: "Bây giờ particle là gì?",
        questions: [
          {
            q: "Một ngôi sao có dictionary trạng thái nhưng chỉ được vẽ đúng một lần. Phần nào còn thiếu để nó trở thành hoạt ảnh hạt?",
            a: ["Một vòng lặp tạo nhiều frame và các dòng code sửa trạng thái", "Đổi tên biến thành particle", "Mở camera"],
            correct: 0,
          },
          {
            q: "Muốn hình giữ nguyên đường bay nhưng không thu nhỏ, cần bỏ lời gọi nào?",
            a: ["`scale_image(...)`", "`move_image(...)`", "`draw_particle_frame(...)`"],
            correct: 0,
          },
          {
            q: "`life = 8` được dùng làm giới hạn của `range`. Giá trị này quyết định trực tiếp điều gì?",
            a: ["Hạt được cập nhật và vẽ bao nhiêu lần", "Màu của hạt", "Vị trí x ban đầu"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Pháo hoa không phải một hạt khổng lồ. Nó là nhiều hạt bắt đầu tại cùng một điểm nhưng có `vx/vy` khác nhau. Mỗi frame, chương trình vẽ cả list rồi cập nhật từng hạt.",
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_particle(vx, vy, color):
    return {
        "symbol": "✦",
        "x": 50,
        "y": 55,
        "vx": vx,
        "vy": vy,
        "size": 2,
        "color": color,
        "alpha": 255,
        "life": 6,
    }

directions = [[0, -5], [4, -3], [5, 0], [4, 3], [0, 5], [-4, 3], [-5, 0], [-4, -3]]
particles = []

for direction in directions:
    # Tạo một hạt từ direction rồi append vào particles
    pass

start_particle_stage("Tám hướng pháo hoa")
draw_particle_frame(particles)
delay(1)
say_num(len(particles))
`,
      label: "make_eight_particles.py",
      note: "ĐỀ BÀI\nĐiểm phát, tám hướng, màu và hàm `make_particle` được gán sẵn; không có INPUT bên ngoài. Trong vòng `for`, gọi hàm với `direction[0]`, `direction[1]`, màu `#ffd45c`, rồi append kết quả vào `particles`. OUTPUT đúng là một frame có tám ngôi sao và số 8.",
      expectOut: { all: [/particle_frame/i, /^8$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_particle(vx, vy, color):
    return {"symbol": "✦", "x": 50, "y": 55, "vx": vx, "vy": vy, "size": 2, "color": color, "alpha": 255, "life": 6}

directions = [[0, -5], [4, -3], [5, 0], [4, 3], [0, 5], [-4, 3], [-5, 0], [-4, -3]]
particles = []
for direction in directions:
    particle = make_particle(direction[0], direction[1], "#ffd45c")
    particles.append(particle)
start_particle_stage("Tám hướng pháo hoa")
draw_particle_frame(particles)
delay(1)
say_num(len(particles))
`,
    },
    {
      code: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_particle(vx, vy, color):
    return {"symbol": "✦", "x": 50, "y": 55, "vx": vx, "vy": vy, "size": 2, "color": color, "alpha": 255, "life": 6}

def update_particle(particle):
    particle["x"] = particle["x"] + particle["vx"]
    particle["y"] = particle["y"] + particle["vy"]
    particle["size"] = max(0.25, particle["size"] - 0.2)
    particle["alpha"] = max(0, particle["alpha"] - 40)
    particle["life"] = particle["life"] - 1

directions = [[0, -5], [4, -3], [5, 0], [4, 3], [0, 5], [-4, 3], [-5, 0], [-4, -3]]
particles = []
for direction in directions:
    particles.append(make_particle(direction[0], direction[1], "#ffd45c"))

start_particle_stage("Pháo hoa hoàn chỉnh")
for frame in range(6):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        # Gọi hàm cập nhật từng particle
        pass

say_num(particles[0]["life"])
`,
      label: "animate_firework.py",
      note: "ĐỀ BÀI MỞ\nTám hạt, sáu frame và hàm cập nhật được gán sẵn; không có INPUT từ camera. Trong vòng lặp bên trong, gọi `update_particle(particle)`. Mỗi frame phải cho thấy tám hạt tách ra, nhỏ đi và mờ dần. OUTPUT cuối là 0. Khi chạy đúng, hãy đổi list `directions`, màu hoặc mức giảm size để tạo pháo hoa riêng.",
      expectOut: { all: [/particle_frame/i, /^0$/] },
      solution: `from camera_charm import start_particle_stage, draw_particle_frame, delay
from old_computer import say_num

def make_particle(vx, vy, color):
    return {"symbol": "✦", "x": 50, "y": 55, "vx": vx, "vy": vy, "size": 2, "color": color, "alpha": 255, "life": 6}

def update_particle(particle):
    particle["x"] = particle["x"] + particle["vx"]
    particle["y"] = particle["y"] + particle["vy"]
    particle["size"] = max(0.25, particle["size"] - 0.2)
    particle["alpha"] = max(0, particle["alpha"] - 40)
    particle["life"] = particle["life"] - 1

directions = [[0, -5], [4, -3], [5, 0], [4, 3], [0, 5], [-4, 3], [-5, 0], [-4, -3]]
particles = []
for direction in directions:
    particles.append(make_particle(direction[0], direction[1], "#ffd45c"))
start_particle_stage("Pháo hoa hoàn chỉnh")
for frame in range(6):
    draw_particle_frame(particles)
    delay(0.3)
    for particle in particles:
        update_particle(particle)
say_num(particles[0]["life"])
`,
    },
    {
      checkpoint: {
        text: "Pháo hoa là một list particle. Hàm tạo hạt gán cùng điểm bắt đầu nhưng vận tốc khác nhau. Vòng lặp bên ngoài tạo từng frame; vòng bên trong gọi UPDATE cho từng hạt.",
      },
    },
    {
      quiz: {
        title: "Từ một hạt đến pháo hoa",
        questions: [
          {
            q: "Tám hạt bắt đầu cùng `(50, 55)` nhưng có tám cặp `vx/vy` khác nhau. Sau một UPDATE, điều gì xuất hiện?",
            a: ["Các hạt tách ra theo tám hướng", "Tất cả vẫn nằm chồng lên nhau tại một chỗ", "Tám hạt tự ghép lại thành một ảnh"],
            correct: 0,
          },
          {
            q: "Chương trình vẽ sáu frame nhưng quên vòng `for particle in particles`. Kết quả nào đúng?",
            a: ["Tám hạt hiện ra nhưng đứng yên", "Pháo hoa vẫn tự nổ", "Danh sách tự thêm hạt mới"],
            correct: 0,
          },
          {
            q: "Muốn pháo hoa tỏa rộng hơn mà vẫn có tám hạt, nên đổi phần nào?",
            a: ["Tăng độ lớn của các `vx/vy` trong `directions`", "Chỉ tăng `life`, không đổi các vận tốc", "Bỏ `draw_particle_frame`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Bạn đã hình thành particle từ trải nghiệm: một dictionary tạo một hình; vòng `for` tạo nhiều frame; `delay` giúp nhìn thấy từng frame; move đổi `x/y`; scale đổi `size`; fade đổi `alpha`; `life` giới hạn thời gian tồn tại. Nhiều particle có vận tốc khác nhau tạo thành pháo hoa.",
    },
  ],
};
