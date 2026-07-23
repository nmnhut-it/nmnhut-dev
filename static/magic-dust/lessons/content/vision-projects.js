import { VISION_LAB_DECKS } from "./vision-lab-decks.js?v=20260714-101425";

const project = config => Object.freeze(config);

export const VISION_PROJECTS = Object.freeze({
  1: project({
    deck: "projection",
    subtitle: "mô hình hóa phép chiếu điểm 3D và kiểm tra giới hạn khung ảnh",
    machineName: "BÀN CHIẾU TỌA ĐỘ",
    machineBlurb: "một tâm camera, mặt phẳng ảnh và thước đo độ sâu",
    sourceTitle: "OpenCV · Camera Calibration and 3D Reconstruction",
    sourceUrl: "https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html",
    premise: "Camera trong lab dùng hệ tọa độ lý tưởng: tâm camera ở gốc, trục Z hướng ra trước, chưa có điểm chính hoặc méo thấu kính. Phép chiếu sẽ chia X và Y cho độ sâu Z.",
    label: "vision_project_01_projection.py",
    note: "PROJECT 01 · HIỆU CHỈNH MÁY CHIẾU ĐIỂM\nTiêu cự đã đặt là 120 pixel; khung ảnh chỉ nhận tọa độ ngang từ -80 đến 80 và dọc từ -60 đến 60. Ba điểm A(2,1,4), B(-5,1,6), C(1,-2,8) đã được đo sẵn, chương trình không hỏi dữ liệu bên ngoài. Hãy tính đủ (u,v) bằng `u = f * x / z`, `v = f * y / z`, rồi thay các điều kiện `False`. Bản chạy đúng in ba dòng kết thúc bằng `A 60.0 30.0 INSIDE`, `B -100.0 20.0 OUTSIDE`, `C 15.0 -30.0 INSIDE`.",
    starter: String.raw`f = 120
limit_u = 80
limit_v = 60

ax, ay, az = 2, 1, 4
au = f * ax / az
av = f * ay / az

bx, by, bz = -5, 1, 6
bu = 0
bv = 0

cx, cy, cz = 1, -2, 8
point_c_u = 0
point_c_v = 0

if abs(au) <= limit_u and abs(av) <= limit_v:
    print("A", au, av, "INSIDE")
else:
    print("A", au, av, "OUTSIDE")

if False:
    print("B", bu, bv, "INSIDE")
else:
    print("B", bu, bv, "OUTSIDE")

if False:
    print("C", point_c_u, point_c_v, "INSIDE")
else:
    print("C", point_c_u, point_c_v, "OUTSIDE")`,
    solution: String.raw`f = 120
limit_u = 80
limit_v = 60

ax, ay, az = 2, 1, 4
au = f * ax / az
av = f * ay / az

bx, by, bz = -5, 1, 6
bu = f * bx / bz
bv = f * by / bz

cx, cy, cz = 1, -2, 8
point_c_u = f * cx / cz
point_c_v = f * cy / cz

if abs(au) <= limit_u and abs(av) <= limit_v:
    print("A", au, av, "INSIDE")
else:
    print("A", au, av, "OUTSIDE")

if abs(bu) <= limit_u and abs(bv) <= limit_v:
    print("B", bu, bv, "INSIDE")
else:
    print("B", bu, bv, "OUTSIDE")

if abs(point_c_u) <= limit_u and abs(point_c_v) <= limit_v:
    print("C", point_c_u, point_c_v, "INSIDE")
else:
    print("C", point_c_u, point_c_v, "OUTSIDE")`,
    expectOut: { all: [/^A 60(?:\.0)? 30(?:\.0)? INSIDE$/, /^B -100(?:\.0)? 20(?:\.0)? OUTSIDE$/, /^C 15(?:\.0)? -30(?:\.0)? INSIDE$/] },
    checkpoint: "Trong mô hình camera lý tưởng, `u = f * X / Z` và `v = f * Y / Z`. Hai điểm có cùng X, Y nhưng Z khác nhau sẽ không nằm cùng tọa độ ảnh: điểm có Z lớn hơn được chiếu gần tâm ảnh hơn.",
    questions: [
      { q: "Giữ X = 2 và f = 120. Nếu Z tăng từ 4 lên 8, tọa độ u thay đổi thế nào?", a: ["Giảm từ 60 xuống 30", "Tăng từ 60 lên 120", "Không đổi vì X không đổi"], correct: 0 },
      { q: "Một điểm cho u = 90, v = 20 trong khung giới hạn |u| ≤ 80, |v| ≤ 60. Kết luận nào đúng?", a: ["Điểm nằm ngoài vì tọa độ ngang vượt giới hạn", "Điểm nằm trong vì v vẫn hợp lệ", "Điểm nằm ngoài vì Z chắc chắn âm"], correct: 0 },
    ],
    remember: ["Phép chiếu phối cảnh phải chia cho độ sâu Z.", "Giới hạn khung ảnh phải được kiểm tra trên cả u và v.", "Mô hình lý tưởng là điểm xuất phát; camera thật còn có điểm chính và méo thấu kính."],
  }),
  2: project({
    deck: "rgb",
    subtitle: "biểu diễn ảnh bằng ma trận RGB và tự xây phép đổi sang grayscale",
    machineName: "BÀN TÁCH KÊNH RGB",
    machineBlurb: "một lưới pixel có ba phép đo màu tại mỗi tọa độ",
    sourceTitle: "OpenCV · Color Space Conversions",
    sourceUrl: "https://docs.opencv.org/4.x/d8/d01/group__imgproc__color__conversions.html",
    premise: "Với máy tính, ảnh là dữ liệu có chỉ số hàng, cột và kênh. Ma trận 3×3 đủ nhỏ để bạn kiểm tra từng phép tính nhưng vẫn giữ đúng cấu trúc của một bộ xử lý ảnh.",
    label: "vision_project_02_rgb_to_gray.py",
    note: "PROJECT 02 · BỘ CHUYỂN RGB SANG ẢNH XÁM\nẢnh RGB 3×3 đã nằm trong `image`; mỗi pixel là bộ `(R, G, B)`, không có dữ liệu nhập từ bàn phím hay camera. Hãy duyệt từng hàng, tính `round(0.299 * R + 0.587 * G + 0.114 * B)`, tạo `gray`, rồi tìm pixel sáng nhất. Kết quả đúng in ba hàng `[76, 150, 29]`, `[255, 0, 141]`, `[50, 118, 36]` và dòng `BRIGHTEST 255 AT 1 0`.",
    starter: String.raw`image = [
    [(255, 0, 0), (0, 255, 0), (0, 0, 255)],
    [(255, 255, 255), (0, 0, 0), (100, 150, 200)],
    [(50, 50, 50), (200, 100, 0), (20, 40, 60)],
]

gray = []
for row in image:
    gray_row = []
    for red, green, blue in row:
        value = 0
        gray_row.append(value)
    gray.append(gray_row)

best_value = -1
best_row = -1
best_column = -1
for row_index in range(len(gray)):
    for column_index in range(len(gray[row_index])):
        value = gray[row_index][column_index]
        if value > best_value:
            best_value = value
            best_row = row_index
            best_column = column_index

for row in gray:
    print(row)
print("BRIGHTEST", best_value, "AT", best_row, best_column)`,
    solution: String.raw`image = [
    [(255, 0, 0), (0, 255, 0), (0, 0, 255)],
    [(255, 255, 255), (0, 0, 0), (100, 150, 200)],
    [(50, 50, 50), (200, 100, 0), (20, 40, 60)],
]

gray = []
for row in image:
    gray_row = []
    for red, green, blue in row:
        value = round(0.299 * red + 0.587 * green + 0.114 * blue)
        gray_row.append(value)
    gray.append(gray_row)

best_value = -1
best_row = -1
best_column = -1
for row_index in range(len(gray)):
    for column_index in range(len(gray[row_index])):
        value = gray[row_index][column_index]
        if value > best_value:
            best_value = value
            best_row = row_index
            best_column = column_index

for row in gray:
    print(row)
print("BRIGHTEST", best_value, "AT", best_row, best_column)`,
    expectOut: { all: [/^\[76, 150, 29\]$/, /^\[255, 0, 141\]$/, /^\[50, 118, 36\]$/, /^BRIGHTEST 255 AT 1 0$/] },
    checkpoint: "Pixel RGB chứa ba cường độ tại cùng một tọa độ. Ảnh xám là ma trận hai chiều; phép đổi có trọng số giữ một ước lượng độ sáng và bỏ thông tin màu.",
    questions: [
      { q: "Hai pixel `(255, 0, 0)` và `(0, 255, 0)` có cùng tổng kênh 255. Vì sao công thức trong lab vẫn cho hai mức xám khác nhau?", a: ["Trọng số ba kênh khác nhau, trong đó G lớn hơn R", "Hàm round luôn ưu tiên màu lục", "Ma trận lưu G trước R"], correct: 0 },
      { q: "Sau khi đổi ảnh RGB 3×3 thành grayscale, shape hợp lý nhất là gì?", a: ["3 hàng × 3 cột, mỗi ô là một số", "3 hàng × 3 cột × 3 kênh", "1 hàng gồm 27 số"], correct: 0 },
    ],
    remember: ["Tọa độ pixel thường được đọc theo (row, column).", "RGB có ba kênh; grayscale có một mức sáng tại mỗi pixel.", "Phép đổi grayscale là một mô hình đo độ sáng, không phải cách khôi phục màu."],
  }),
  3: project({
    deck: "kernel",
    subtitle: "suy ra phép nhân-cộng cục bộ và tự viết cửa sổ trượt 3×3",
    machineName: "BÀN TRƯỢT KERNEL",
    machineBlurb: "một khung quan sát nhỏ quét có hệ thống trên ma trận ảnh",
    sourceTitle: "OpenCV · Image Filtering",
    sourceUrl: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html",
    premise: "Kernel không hiểu toàn bộ ảnh cùng lúc. Nó lặp lại một phép đo cục bộ tại mọi vị trí hợp lệ. Chính quy tắc nhỏ này là nền tảng của blur, gradient và nhiều tầng convolution sau này.",
    label: "vision_project_03_kernel_scan.py",
    note: "PROJECT 03 · MÁY QUÉT KERNEL 3×3\n`image` là ảnh 5×5 và `kernel` là bộ lọc làm nổi một điểm khác biệt; cả hai đã có sẵn trong code. Hãy hoàn thành phép nhân-cộng trong bốn vòng lặp. Chỉ quét nơi cửa sổ nằm trọn trong ảnh, nên response có 3×3 ô. Bản chạy đúng in ba hàng response và kết thúc bằng `BEST 28 AT 2 2`, trong đó tọa độ là tâm cửa sổ trên ảnh gốc.",
    starter: String.raw`image = [
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 9, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
]
kernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]]

response = []
best_value = -999
best_row = -1
best_column = -1
for center_row in range(1, 4):
    output_row = []
    for center_column in range(1, 4):
        total = 0
        for kernel_row in range(3):
            for kernel_column in range(3):
                total += 0
        output_row.append(total)
        if total > best_value:
            best_value = total
            best_row = center_row
            best_column = center_column
    response.append(output_row)

for row in response:
    print(row)
print("BEST", best_value, "AT", best_row, best_column)`,
    solution: String.raw`image = [
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 9, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
]
kernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]]

response = []
best_value = -999
best_row = -1
best_column = -1
for center_row in range(1, 4):
    output_row = []
    for center_column in range(1, 4):
        total = 0
        for kernel_row in range(3):
            for kernel_column in range(3):
                image_row = center_row + kernel_row - 1
                image_column = center_column + kernel_column - 1
                total += image[image_row][image_column] * kernel[kernel_row][kernel_column]
        output_row.append(total)
        if total > best_value:
            best_value = total
            best_row = center_row
            best_column = center_column
    response.append(output_row)

for row in response:
    print(row)
print("BEST", best_value, "AT", best_row, best_column)`,
    expectOut: { all: [/^\[0, -7, 0\]$/, /^\[-7, 28, -7\]$/, /^BEST 28 AT 2 2$/] },
    checkpoint: "Đặt tâm kernel tại `(r,c)`, nhân từng pixel trong cửa sổ với trọng số cùng vị trí rồi cộng lại. Ảnh 5×5 quét bằng kernel 3×3 theo kiểu valid tạo response 3×3.",
    questions: [
      { q: "Vì sao response chỉ có 3×3 ô khi ảnh là 5×5 và kernel là 3×3, không đệm biên?", a: ["Tâm kernel chỉ có 3 vị trí hợp lệ theo mỗi chiều", "Kernel bỏ hai hàng có giá trị nhỏ nhất", "Mỗi phép tính gộp ba pixel thành một"], correct: 0 },
      { q: "Nếu đổi mọi trọng số kernel thành 0, response sẽ có dạng nào?", a: ["Mọi ô đều bằng 0", "Giống hệt ảnh gốc", "Chỉ tâm ảnh bằng 0"], correct: 0 },
    ],
    remember: ["Kernel là một ma trận trọng số nhỏ.", "Convolution rời rạc là phép nhân từng ô rồi cộng.", "Quét valid bỏ các vị trí mà cửa sổ vượt ra ngoài ảnh."],
  }),
  4: project({
    deck: "blur",
    subtitle: "tự xây box blur và đo định lượng mức giảm nhiễu",
    machineName: "BUỒNG LỌC NHIỄU",
    machineBlurb: "một bộ lọc trung bình cùng đồng hồ đo phần chi tiết bị mất",
    sourceTitle: "OpenCV · Smoothing Images",
    sourceUrl: "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html",
    premise: "Blur không phải nút 'làm đẹp'. Nó là một phép ước lượng lại pixel từ lân cận, giảm biến thiên nhanh nhưng đồng thời làm mềm chi tiết thật. Project yêu cầu đo cả hai mặt của thỏa hiệp đó.",
    label: "vision_project_04_box_blur.py",
    note: "PROJECT 04 · ĐO HIỆU QUẢ BOX BLUR\nẢnh 5×5 đã có một điểm nhiễu sáng 90 giữa nền quanh 10. Hãy thay dòng `value = 0` bằng trung bình của cửa sổ 3×3 và làm tròn, tạo phần ảnh blur 3×3. Sau đó tính biên độ `max - min` trước và sau lọc. Bản đúng kết thúc bằng `RANGE BEFORE 81`, `RANGE AFTER 1`, `REDUCTION 80`.",
    starter: String.raw`image = [
    [10, 11, 10, 10, 9],
    [10, 12, 11, 9, 10],
    [11, 10, 90, 11, 10],
    [9, 11, 10, 12, 11],
    [10, 10, 9, 11, 10],
]

blurred = []
for center_row in range(1, 4):
    output_row = []
    for center_column in range(1, 4):
        total = 0
        for offset_row in range(-1, 2):
            for offset_column in range(-1, 2):
                total += image[center_row + offset_row][center_column + offset_column]
        value = 0
        output_row.append(value)
    blurred.append(output_row)

for row in blurred:
    print(row)
before = max(max(row) for row in image) - min(min(row) for row in image)
after = max(max(row) for row in blurred) - min(min(row) for row in blurred)
print("RANGE BEFORE", before)
print("RANGE AFTER", after)
print("REDUCTION", before - after)`,
    solution: String.raw`image = [
    [10, 11, 10, 10, 9],
    [10, 12, 11, 9, 10],
    [11, 10, 90, 11, 10],
    [9, 11, 10, 12, 11],
    [10, 10, 9, 11, 10],
]

blurred = []
for center_row in range(1, 4):
    output_row = []
    for center_column in range(1, 4):
        total = 0
        for offset_row in range(-1, 2):
            for offset_column in range(-1, 2):
                total += image[center_row + offset_row][center_column + offset_column]
        value = round(total / 9)
        output_row.append(value)
    blurred.append(output_row)

for row in blurred:
    print(row)
before = max(max(row) for row in image) - min(min(row) for row in image)
after = max(max(row) for row in blurred) - min(min(row) for row in blurred)
print("RANGE BEFORE", before)
print("RANGE AFTER", after)
print("REDUCTION", before - after)`,
    expectOut: { all: [/^RANGE BEFORE 81$/, /^RANGE AFTER 1$/, /^REDUCTION 80$/] },
    checkpoint: "Box blur 3×3 thay mỗi pixel hợp lệ bằng trung bình chín pixel lân cận. Nó giảm biên độ của nhiễu xung, nhưng cũng giảm biên độ của viền thật; vì thế cần đo, không chỉ quan sát cảm tính.",
    questions: [
      { q: "Sau blur, range giảm từ 81 xuống 1. Điều này chứng minh trực tiếp điều gì?", a: ["Biến thiên cực đại trong vùng được giảm", "Mọi cạnh thật đều được giữ nguyên", "Ảnh đã khôi phục đúng cảnh ban đầu"], correct: 0 },
      { q: "Nếu dùng kernel trung bình 5×5 thay vì 3×3 trên cùng ảnh, dự đoán hợp lý nhất là gì?", a: ["Nhiễu thường mượt hơn nhưng chi tiết nhỏ mất nhiều hơn", "Ảnh sắc hơn vì dùng nhiều pixel", "Kết quả luôn giống kernel 3×3"], correct: 0 },
    ],
    remember: ["Kernel box blur có các trọng số bằng nhau và tổng bằng 1.", "Lọc nhiễu luôn có thỏa hiệp với độ sắc nét.", "Range là một phép đo đơn giản, không phải thước đo chất lượng duy nhất."],
  }),
  5: project({
    deck: "edge",
    subtitle: "tính gradient hai hướng và dựng edge map bằng Sobel",
    machineName: "LÒ RÈN GRADIENT",
    machineBlurb: "hai kernel đo thay đổi sáng theo phương ngang và dọc",
    sourceTitle: "OpenCV · Canny Edge Detection",
    sourceUrl: "https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html",
    premise: "Viền không phải một màu đặc biệt. Nó là vị trí mà cường độ thay đổi mạnh. Lab tách phép đo thành hai hướng, rồi ghép chúng thành độ lớn gradient để tìm viền nổi bật nhất.",
    label: "vision_project_05_sobel_edges.py",
    note: "PROJECT 05 · EDGE MAP SOBEL\nẢnh 5×5 có một ranh giới từ vùng tối 10 sang vùng sáng 80. `kernel_x` và `kernel_y` đã có sẵn. Hãy hoàn thành hàm `apply_kernel`, tính `magnitude = abs(gx) + abs(gy)` tại chín tâm hợp lệ và tìm giá trị lớn nhất. Bản đúng in edge map rồi kết thúc bằng `BEST EDGE 280 AT 1 2`.",
    starter: String.raw`image = [
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
]
kernel_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
kernel_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

def apply_kernel(center_row, center_column, kernel):
    total = 0
    for kernel_row in range(3):
        for kernel_column in range(3):
            image_row = center_row + kernel_row - 1
            image_column = center_column + kernel_column - 1
            total += 0
    return total

edge_map = []
best_value = -1
best_row = -1
best_column = -1
for row in range(1, 4):
    edge_row = []
    for column in range(1, 4):
        gx = apply_kernel(row, column, kernel_x)
        gy = apply_kernel(row, column, kernel_y)
        magnitude = abs(gx) + abs(gy)
        edge_row.append(magnitude)
        if magnitude > best_value:
            best_value = magnitude
            best_row = row
            best_column = column
    edge_map.append(edge_row)

for row in edge_map:
    print(row)
print("BEST EDGE", best_value, "AT", best_row, best_column)`,
    solution: String.raw`image = [
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
    [10, 10, 10, 80, 80],
]
kernel_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
kernel_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

def apply_kernel(center_row, center_column, kernel):
    total = 0
    for kernel_row in range(3):
        for kernel_column in range(3):
            image_row = center_row + kernel_row - 1
            image_column = center_column + kernel_column - 1
            total += image[image_row][image_column] * kernel[kernel_row][kernel_column]
    return total

edge_map = []
best_value = -1
best_row = -1
best_column = -1
for row in range(1, 4):
    edge_row = []
    for column in range(1, 4):
        gx = apply_kernel(row, column, kernel_x)
        gy = apply_kernel(row, column, kernel_y)
        magnitude = abs(gx) + abs(gy)
        edge_row.append(magnitude)
        if magnitude > best_value:
            best_value = magnitude
            best_row = row
            best_column = column
    edge_map.append(edge_row)

for row in edge_map:
    print(row)
print("BEST EDGE", best_value, "AT", best_row, best_column)`,
    expectOut: { all: [/^\[0, 280, 280\]$/, /^BEST EDGE 280 AT 1 2$/] },
    checkpoint: "Sobel dùng một kernel cho thay đổi trái-phải và một kernel cho thay đổi trên-dưới. `abs(gx) + abs(gy)` là xấp xỉ đơn giản của độ lớn gradient, đủ để xếp hạng viền trong lab.",
    questions: [
      { q: "Ảnh chỉ đổi độ sáng theo chiều trái-phải. Thành phần nào dự kiến lớn hơn?", a: ["Gx", "Gy", "Cả hai luôn bằng nhau"], correct: 0 },
      { q: "Hai vị trí có `(gx,gy) = (200,0)` và `(120,120)`. Theo độ lớn xấp xỉ `|gx|+|gy|`, vị trí nào mạnh hơn?", a: ["Vị trí (120,120) với tổng 240", "Vị trí (200,0) vì gx lớn hơn", "Hai vị trí bằng nhau"], correct: 0 },
    ],
    remember: ["Viền là biến thiên mạnh của cường độ.", "Gx và Gy mô tả hai hướng thay đổi.", "Edge map phụ thuộc cả bộ lọc lẫn cách đặt ngưỡng sau đó."],
  }),
  6: project({
    deck: "threshold",
    subtitle: "tạo mask nhị phân, đo diện tích và bounding box của tiền cảnh",
    machineName: "CỔNG PHÂN ĐOẠN",
    machineBlurb: "một ngưỡng biến ma trận sáng thành vùng tiền cảnh có thể đo",
    sourceTitle: "OpenCV · Image Thresholding",
    sourceUrl: "https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html",
    premise: "Threshold là quyết định dựa trên một giả thuyết: vật sáng hơn nền. Project không dừng ở mask đẹp mắt; nó biến các ô 1 thành hai phép đo kỹ thuật là diện tích và bounding box.",
    label: "vision_project_06_segmentation.py",
    note: "PROJECT 06 · PHÂN ĐOẠN VẬT SÁNG\nẢnh xám 6×6 và ngưỡng 50 đã được đặt sẵn. Hãy tạo mask bằng `1 if value >= threshold else 0`, đếm foreground và cập nhật bốn biên của bounding box. Kết quả đúng in sáu hàng mask, `AREA 9` và `BBOX 1 2 3 4`. Sau đó code tự thử ngưỡng 85 để in `FAIL AREA 2`, cho thấy ngưỡng quá cao làm mất phần lớn vật.",
    starter: String.raw`image = [
    [8, 10, 12, 9, 11, 10],
    [9, 12, 60, 72, 55, 10],
    [8, 11, 64, 90, 58, 9],
    [10, 13, 57, 88, 62, 8],
    [9, 10, 12, 14, 11, 9],
    [8, 9, 10, 11, 10, 8],
]
threshold = 50
mask = []
area = 0
min_row = len(image)
min_column = len(image[0])
max_row = -1
max_column = -1

for row_index in range(len(image)):
    mask_row = []
    for column_index in range(len(image[row_index])):
        pixel = 0
        mask_row.append(pixel)
        if pixel == 1:
            area += 1
            min_row = min(min_row, row_index)
            min_column = min(min_column, column_index)
            max_row = max(max_row, row_index)
            max_column = max(max_column, column_index)
    mask.append(mask_row)

for row in mask:
    print(row)
print("AREA", area)
print("BBOX", min_row, min_column, max_row, max_column)

fail_area = 0
for row in image:
    for value in row:
        if value >= 85:
            fail_area += 1
print("FAIL AREA", fail_area)`,
    solution: String.raw`image = [
    [8, 10, 12, 9, 11, 10],
    [9, 12, 60, 72, 55, 10],
    [8, 11, 64, 90, 58, 9],
    [10, 13, 57, 88, 62, 8],
    [9, 10, 12, 14, 11, 9],
    [8, 9, 10, 11, 10, 8],
]
threshold = 50
mask = []
area = 0
min_row = len(image)
min_column = len(image[0])
max_row = -1
max_column = -1

for row_index in range(len(image)):
    mask_row = []
    for column_index in range(len(image[row_index])):
        pixel = 1 if image[row_index][column_index] >= threshold else 0
        mask_row.append(pixel)
        if pixel == 1:
            area += 1
            min_row = min(min_row, row_index)
            min_column = min(min_column, column_index)
            max_row = max(max_row, row_index)
            max_column = max(max_column, column_index)
    mask.append(mask_row)

for row in mask:
    print(row)
print("AREA", area)
print("BBOX", min_row, min_column, max_row, max_column)

fail_area = 0
for row in image:
    for value in row:
        if value >= 85:
            fail_area += 1
print("FAIL AREA", fail_area)`,
    expectOut: { all: [/^AREA 9$/, /^BBOX 1 2 3 4$/, /^FAIL AREA 2$/] },
    checkpoint: "Threshold tạo mask theo một điều kiện tại từng pixel. Bounding box của foreground lấy hàng-cột nhỏ nhất và lớn nhất trong các ô 1; nếu không có ô 1, chương trình phải báo không phát hiện thay vì dùng biên rỗng.",
    questions: [
      { q: "Tăng ngưỡng từ 50 lên 85 làm area giảm từ 9 xuống 2. Diễn giải nào đúng nhất?", a: ["Nhiều pixel của vật bị đổi thành background", "Vật thật co lại trong cảnh", "Bounding box luôn chính xác hơn"], correct: 0 },
      { q: "Một mask không có ô 1. Cách xử lý kỹ thuật phù hợp là gì?", a: ["Báo NO DETECTION và không tạo bounding box giả", "Dùng toàn bộ ảnh làm bounding box", "Đặt box tại (0,0,0,0) và coi là vật"], correct: 0 },
    ],
    remember: ["Threshold biến cường độ thành quyết định 0/1.", "Area đếm pixel foreground; bounding box tóm tắt phạm vi của chúng.", "Ngưỡng quá cao gây false negative; ngưỡng quá thấp gây false positive."],
  }),
  7: project({
    deck: "sad",
    subtitle: "tự viết template matching bằng SAD và đọc response map",
    machineName: "BÀN TRUY TÌM MẪU",
    machineBlurb: "một template nhỏ trượt qua scene và để lại điểm sai khác",
    sourceTitle: "OpenCV · Template Matching",
    sourceUrl: "https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html",
    premise: "Template matching trả lời một câu hỏi có thể đo: cửa sổ nào trong scene giống template nhất theo một hàm điểm đã chọn? Trước khi dùng thư viện, bạn sẽ tự dựng toàn bộ response map SAD.",
    label: "vision_project_07_sad_match.py",
    note: "PROJECT 07 · BỘ ĐỊNH VỊ TEMPLATE BẰNG SAD\n`scene` 5×6 và `template` 2×2 đã nằm trong code. Hãy hoàn thành `sad_at` bằng tổng trị tuyệt đối của bốn sai khác, quét mọi góc trên-trái hợp lệ và giữ điểm nhỏ nhất. Bản đúng in response map 4×5 rồi kết thúc bằng `BEST SCORE 0` và `LOCATION 1 2`.",
    starter: String.raw`scene = [
    [3, 3, 1, 1, 4, 4],
    [3, 3, 8, 8, 4, 4],
    [2, 2, 7, 9, 0, 0],
    [4, 4, 6, 6, 2, 2],
    [4, 4, 6, 6, 2, 2],
]
template = [[8, 8], [7, 9]]

def sad_at(top, left):
    score = 0
    for row in range(len(template)):
        for column in range(len(template[0])):
            score += 0
    return score

response = []
best_score = 10 ** 9
best_row = -1
best_column = -1
for top in range(len(scene) - len(template) + 1):
    response_row = []
    for left in range(len(scene[0]) - len(template[0]) + 1):
        score = sad_at(top, left)
        response_row.append(score)
        if score < best_score:
            best_score = score
            best_row = top
            best_column = left
    response.append(response_row)

for row in response:
    print(row)
print("BEST SCORE", best_score)
print("LOCATION", best_row, best_column)`,
    solution: String.raw`scene = [
    [3, 3, 1, 1, 4, 4],
    [3, 3, 8, 8, 4, 4],
    [2, 2, 7, 9, 0, 0],
    [4, 4, 6, 6, 2, 2],
    [4, 4, 6, 6, 2, 2],
]
template = [[8, 8], [7, 9]]

def sad_at(top, left):
    score = 0
    for row in range(len(template)):
        for column in range(len(template[0])):
            score += abs(scene[top + row][left + column] - template[row][column])
    return score

response = []
best_score = 10 ** 9
best_row = -1
best_column = -1
for top in range(len(scene) - len(template) + 1):
    response_row = []
    for left in range(len(scene[0]) - len(template[0]) + 1):
        score = sad_at(top, left)
        response_row.append(score)
        if score < best_score:
            best_score = score
            best_row = top
            best_column = left
    response.append(response_row)

for row in response:
    print(row)
print("BEST SCORE", best_score)
print("LOCATION", best_row, best_column)`,
    expectOut: { all: [/^BEST SCORE 0$/, /^LOCATION 1 2$/] },
    checkpoint: "SAD cộng `abs(scene - template)` trên toàn cửa sổ. Điểm 0 là khớp tuyệt đối; với SAD, điểm thấp hơn tốt hơn. Response map có một ô cho mỗi vị trí góc trên-trái hợp lệ.",
    questions: [
      { q: "Hai vị trí có SAD lần lượt 3 và 12. Nếu mọi thiết lập khác như nhau, chọn vị trí nào?", a: ["Vị trí có SAD = 3", "Vị trí có SAD = 12", "Không thể so vì SAD phải gần 1"], correct: 0 },
      { q: "Scene 5×6 và template 2×2 tạo response map có shape nào khi quét valid?", a: ["4×5", "3×4", "5×6"], correct: 0 },
    ],
    remember: ["Template matching quét mọi vị trí hợp lệ.", "SAD đo tổng sai khác tuyệt đối và cần được tối thiểu hóa.", "Tọa độ kết quả là góc trên-trái của cửa sổ khớp."],
  }),
  8: project({
    deck: "ncc",
    subtitle: "chuẩn hóa độ sáng và dựng response map ZNCC",
    machineName: "ĐÀI QUAN SÁT TƯƠNG QUAN",
    machineBlurb: "một bộ đo hình dạng biến thiên thay vì mức sáng tuyệt đối",
    sourceTitle: "OpenCV · TemplateMatchModes",
    sourceUrl: "https://docs.opencv.org/4.x/df/dfb/group__imgproc__object.html",
    premise: "SAD phù hợp khi mức sáng ổn định. Nếu cả vùng sáng lên cùng một lượng, ta cần bỏ mean và so hình dạng biến thiên. ZNCC chuẩn hóa cả cửa sổ lẫn template để làm việc đó.",
    label: "vision_project_08_zncc.py",
    note: "PROJECT 08 · RESPONSE MAP ZNCC\nScene chứa template 2×2 nhưng sáng hơn template đúng 30 đơn vị. Hãy hoàn thành `zncc`: trừ mean, tính tử số và hai năng lượng, rồi trả `numerator / sqrt(energy_a * energy_b)`. Quét toàn scene và giữ điểm cao nhất. Bản đúng kết thúc bằng `BEST ZNCC 1.00` và `LOCATION 1 2`.",
    starter: String.raw`from math import sqrt

scene = [
    [5, 5, 5, 5, 5],
    [5, 5, 40, 50, 5],
    [5, 5, 60, 70, 5],
    [5, 5, 5, 5, 5],
]
template = [[10, 20], [30, 40]]

def zncc(window, pattern):
    flat_window = [value for row in window for value in row]
    flat_pattern = [value for row in pattern for value in row]
    mean_window = sum(flat_window) / len(flat_window)
    mean_pattern = sum(flat_pattern) / len(flat_pattern)
    numerator = 0
    energy_window = 0
    energy_pattern = 0
    for index in range(len(flat_window)):
        window_delta = 0
        pattern_delta = 0
        numerator += window_delta * pattern_delta
        energy_window += window_delta * window_delta
        energy_pattern += pattern_delta * pattern_delta
    if energy_window == 0 or energy_pattern == 0:
        return 0
    return numerator / sqrt(energy_window * energy_pattern)

best_score = -2
best_row = -1
best_column = -1
for top in range(len(scene) - 1):
    for left in range(len(scene[0]) - 1):
        window = [row[left:left + 2] for row in scene[top:top + 2]]
        score = zncc(window, template)
        if score > best_score:
            best_score = score
            best_row = top
            best_column = left

print("BEST ZNCC", format(best_score, ".2f"))
print("LOCATION", best_row, best_column)`,
    solution: String.raw`from math import sqrt

scene = [
    [5, 5, 5, 5, 5],
    [5, 5, 40, 50, 5],
    [5, 5, 60, 70, 5],
    [5, 5, 5, 5, 5],
]
template = [[10, 20], [30, 40]]

def zncc(window, pattern):
    flat_window = [value for row in window for value in row]
    flat_pattern = [value for row in pattern for value in row]
    mean_window = sum(flat_window) / len(flat_window)
    mean_pattern = sum(flat_pattern) / len(flat_pattern)
    numerator = 0
    energy_window = 0
    energy_pattern = 0
    for index in range(len(flat_window)):
        window_delta = flat_window[index] - mean_window
        pattern_delta = flat_pattern[index] - mean_pattern
        numerator += window_delta * pattern_delta
        energy_window += window_delta * window_delta
        energy_pattern += pattern_delta * pattern_delta
    if energy_window == 0 or energy_pattern == 0:
        return 0
    return numerator / sqrt(energy_window * energy_pattern)

best_score = -2
best_row = -1
best_column = -1
for top in range(len(scene) - 1):
    for left in range(len(scene[0]) - 1):
        window = [row[left:left + 2] for row in scene[top:top + 2]]
        score = zncc(window, template)
        if score > best_score:
            best_score = score
            best_row = top
            best_column = left

print("BEST ZNCC", format(best_score, ".2f"))
print("LOCATION", best_row, best_column)`,
    expectOut: { all: [/^BEST ZNCC 1\.00$/, /^LOCATION 1 2$/] },
    checkpoint: "ZNCC trừ mean khỏi cửa sổ và template trước khi so, rồi chia cho tích độ lớn. Điểm gần 1 cho biết hai mẫu biến thiên cùng hình dạng, kể cả khi một vùng được cộng thêm độ sáng gần như đồng đều.",
    questions: [
      { q: "Template `[10,20,30,40]` và cửa sổ `[40,50,60,70]` khác nhau 30 ở mọi ô. Vì sao ZNCC vẫn có thể bằng 1?", a: ["Sau khi trừ mean, hai vector độ lệch giống nhau", "ZNCC bỏ qua mọi pixel", "ZNCC chỉ so giá trị lớn nhất"], correct: 0 },
      { q: "Một cửa sổ có mọi pixel bằng 20. Vì sao code cần nhánh xử lý năng lượng bằng 0?", a: ["Sau khi trừ mean, vector chỉ còn số 0 nên không thể chia chuẩn", "Mean không tồn tại với pixel bằng nhau", "Template matching không cho phép số 20"], correct: 0 },
    ],
    remember: ["ZNCC so cấu trúc biến thiên quanh mean.", "Với ZNCC, điểm cao hơn tốt hơn.", "Vùng phẳng có năng lượng 0 và cần được xử lý rõ ràng."],
  }),
  9: project({
    deck: "nms",
    subtitle: "tính IoU và loại các detection chồng lặp bằng NMS",
    machineName: "THÁP TÍN HIỆU NMS",
    machineBlurb: "một bộ chọn cực trị giữ bằng chứng mạnh nhất trong mỗi cụm",
    sourceTitle: "OpenCV · Template Matching with Multiple Objects",
    sourceUrl: "https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html",
    premise: "Response map thường tạo nhiều ứng viên quanh cùng một vật. NMS không tìm vật mới; nó biến danh sách ứng viên dày đặc thành các phát hiện riêng biệt bằng score và mức chồng lặp.",
    label: "vision_project_09_nms.py",
    note: "PROJECT 09 · NON-MAXIMUM SUPPRESSION\nNăm box có dạng `(row1, col1, row2, col2, score)` và đã được cho sẵn. Hãy hoàn thành `iou`, sắp box theo score giảm dần, rồi giữ một box chỉ khi IoU với mọi box đã giữ không vượt 0.30. Bản đúng in `KEPT 2`, tiếp theo là `BOX 10 10 30 30 0.95` và `BOX 42 40 60 62 0.91`.",
    starter: String.raw`boxes = [
    (10, 10, 30, 30, 0.95),
    (12, 11, 31, 31, 0.88),
    (9, 13, 29, 33, 0.82),
    (42, 40, 60, 62, 0.91),
    (44, 42, 61, 63, 0.76),
]

def iou(box_a, box_b):
    top = max(box_a[0], box_b[0])
    left = max(box_a[1], box_b[1])
    bottom = min(box_a[2], box_b[2])
    right = min(box_a[3], box_b[3])
    intersection = 0
    area_a = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    area_b = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    return intersection / (area_a + area_b - intersection)

ordered = sorted(boxes, key=lambda box: box[4], reverse=True)
kept = []
for candidate in ordered:
    overlaps = [iou(candidate, chosen) for chosen in kept]
    if all(value <= 0.30 for value in overlaps):
        kept.append(candidate)

print("KEPT", len(kept))
for box in kept:
    print("BOX", *box)`,
    solution: String.raw`boxes = [
    (10, 10, 30, 30, 0.95),
    (12, 11, 31, 31, 0.88),
    (9, 13, 29, 33, 0.82),
    (42, 40, 60, 62, 0.91),
    (44, 42, 61, 63, 0.76),
]

def iou(box_a, box_b):
    top = max(box_a[0], box_b[0])
    left = max(box_a[1], box_b[1])
    bottom = min(box_a[2], box_b[2])
    right = min(box_a[3], box_b[3])
    height = max(0, bottom - top)
    width = max(0, right - left)
    intersection = height * width
    area_a = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    area_b = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    return intersection / (area_a + area_b - intersection)

ordered = sorted(boxes, key=lambda box: box[4], reverse=True)
kept = []
for candidate in ordered:
    overlaps = [iou(candidate, chosen) for chosen in kept]
    if all(value <= 0.30 for value in overlaps):
        kept.append(candidate)

print("KEPT", len(kept))
for box in kept:
    print("BOX", *box)`,
    expectOut: { all: [/^KEPT 2$/, /^BOX 10 10 30 30 0\.95$/, /^BOX 42 40 60 62 0\.91$/] },
    checkpoint: "IoU là diện tích giao chia diện tích hợp của hai box. NMS xét box theo score giảm dần, giữ box mạnh rồi loại ứng viên chồng với box đã giữ quá ngưỡng.",
    questions: [
      { q: "Hai box không chồng nhau có IoU bằng bao nhiêu, và NMS với ngưỡng 0.30 xử lý chúng thế nào?", a: ["IoU = 0; cả hai có thể được giữ", "IoU = 1; chỉ giữ một", "IoU không xác định; loại cả hai"], correct: 0 },
      { q: "Vì sao NMS phải xét box score 0.95 trước box score 0.88 trong cùng cụm?", a: ["Để giữ bằng chứng mạnh nhất làm đại diện", "Vì box score thấp luôn nhỏ hơn", "Để IoU tự động bằng 0"], correct: 0 },
    ],
    remember: ["Threshold tạo ứng viên; NMS loại bản sao chồng lặp.", "IoU đo tỉ lệ chồng lặp của hai box.", "NMS không sửa score và không bảo đảm loại mọi false positive."],
  }),
  10: project({
    deck: "opencv",
    subtitle: "đối chiếu bộ dò tự viết với cv2.matchTemplate trên cùng dữ liệu",
    machineName: "ĐỘNG CƠ OPENCV",
    machineBlurb: "hai đường tính độc lập cùng xác nhận một vị trí khớp",
    sourceTitle: "OpenCV · Template Matching Theory",
    sourceUrl: "https://docs.opencv.org/4.x/de/da9/tutorial_template_matching.html",
    pythonPackages: ["opencv-python"],
    premise: "OpenCV xuất hiện sau khi cơ chế đã được tự viết. Project dùng nó như một phép đối chiếu độc lập: nếu quy ước score và tọa độ được đọc đúng, hai cách phải chỉ cùng một vị trí.",
    label: "vision_project_10_opencv_check.py",
    note: "PROJECT 10 · OPENCV KHÔNG PHẢI HỘP ĐEN\nScene và template giống Project 07. Hàm `ssd_match` thuần Python đã hoàn chỉnh. Hãy dùng `cv2.matchTemplate(..., cv2.TM_SQDIFF)` khi package có sẵn, đổi `minLoc (x,y)` thành `(row,column) = (y,x)`, rồi so với kết quả tự viết. Nếu OpenCV chưa tải được, nhánh fallback vẫn chạy phép đo thuần Python và báo rõ backend. Bản đúng luôn kết thúc bằng `PURE 1 2`, `LIBRARY 1 2`, `MATCH True`.",
    starter: String.raw`scene = [
    [3, 3, 1, 1, 4, 4],
    [3, 3, 8, 8, 4, 4],
    [2, 2, 7, 9, 0, 0],
    [4, 4, 6, 6, 2, 2],
    [4, 4, 6, 6, 2, 2],
]
template = [[8, 8], [7, 9]]

def ssd_match(image, pattern):
    best = None
    for top in range(len(image) - len(pattern) + 1):
        for left in range(len(image[0]) - len(pattern[0]) + 1):
            score = 0
            for row in range(len(pattern)):
                for column in range(len(pattern[0])):
                    difference = image[top + row][left + column] - pattern[row][column]
                    score += difference * difference
            if best is None or score < best[0]:
                best = (score, top, left)
    return best

pure_score, pure_row, pure_column = ssd_match(scene, template)

try:
    import cv2
    import numpy as np
    response = cv2.matchTemplate(
        np.array(scene, dtype=np.float32),
        np.array(template, dtype=np.float32),
        cv2.TM_SQDIFF,
    )
    _, library_score, min_location, _ = cv2.minMaxLoc(response)
    library_column, library_row = min_location
    backend = "OPENCV"
except ImportError:
    library_score, library_row, library_column = ssd_match(scene, template)
    backend = "PURE FALLBACK"

print("BACKEND", backend)
print("PURE", pure_row, pure_column)
print("LIBRARY", library_row, library_column)
print("MATCH", False)`,
    solution: String.raw`scene = [
    [3, 3, 1, 1, 4, 4],
    [3, 3, 8, 8, 4, 4],
    [2, 2, 7, 9, 0, 0],
    [4, 4, 6, 6, 2, 2],
    [4, 4, 6, 6, 2, 2],
]
template = [[8, 8], [7, 9]]

def ssd_match(image, pattern):
    best = None
    for top in range(len(image) - len(pattern) + 1):
        for left in range(len(image[0]) - len(pattern[0]) + 1):
            score = 0
            for row in range(len(pattern)):
                for column in range(len(pattern[0])):
                    difference = image[top + row][left + column] - pattern[row][column]
                    score += difference * difference
            if best is None or score < best[0]:
                best = (score, top, left)
    return best

pure_score, pure_row, pure_column = ssd_match(scene, template)

try:
    import cv2
    import numpy as np
    response = cv2.matchTemplate(
        np.array(scene, dtype=np.float32),
        np.array(template, dtype=np.float32),
        cv2.TM_SQDIFF,
    )
    library_score, _, min_location, _ = cv2.minMaxLoc(response)
    library_column, library_row = min_location
    backend = "OPENCV"
except ImportError:
    library_score, library_row, library_column = ssd_match(scene, template)
    backend = "PURE FALLBACK"

print("BACKEND", backend)
print("PURE", pure_row, pure_column)
print("LIBRARY", library_row, library_column)
print("MATCH", (pure_row, pure_column) == (library_row, library_column))`,
    expectOut: { all: [/^BACKEND (?:OPENCV|PURE FALLBACK)$/, /^PURE 1 2$/, /^LIBRARY 1 2$/, /^MATCH True$/] },
    checkpoint: "`TM_SQDIFF` trả response cần tối thiểu hóa. `minMaxLoc` dùng tọa độ `(x,y)`, tức `(column,row)`; khi so với vòng lặp ma trận phải đổi thứ tự về `(row,column)`.",
    questions: [
      { q: "Bản tự viết trả `(row,column) = (1,2)`, còn OpenCV trả `minLoc = (2,1)`. Hai kết quả có khớp không?", a: ["Có, vì OpenCV trả (x,y) = (column,row)", "Không, vì thứ tự số khác nhau", "Chỉ khớp nếu score bằng 1"], correct: 0 },
      { q: "Với `TM_SQDIFF`, code nên dùng cực trị nào của response?", a: ["Giá trị nhỏ nhất", "Giá trị lớn nhất", "Giá trị gần 1 nhất"], correct: 0 },
    ],
    remember: ["OpenCV được dùng sau khi đã hiểu cơ chế tương ứng.", "TM_SQDIFF cần tối thiểu hóa score.", "Đối chiếu độc lập giúp phát hiện lỗi tọa độ và quy ước cực trị."],
  }),
  11: project({
    deck: "perspective",
    subtitle: "ánh xạ bốn góc và nắn một bảng xiên về lưới chữ nhật",
    machineName: "CẦU NẮN PHỐI CẢNH",
    machineBlurb: "bốn cặp điểm điều khiển cách mặt phẳng xiên trở về chính diện",
    sourceTitle: "OpenCV · Geometric Transformations of Images",
    sourceUrl: "https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html",
    premise: "Homography mô tả một mặt phẳng dưới phối cảnh. Project dùng tứ giác có cấu trúc để bạn tự dựng phép ánh xạ và lấy mẫu; checkpoint sẽ nối phép dựng này với ma trận 3×3 tổng quát.",
    label: "vision_project_11_rectify_board.py",
    note: "PROJECT 11 · NẮN BẢNG XIÊN 4×4\n`source` 6×6 chứa một bảng bị lệch hàng; bốn góc nguồn đã cho theo `(row,column)`. Với mỗi ô đích 4×4, hãy nội suy vị trí nguồn từ bốn góc, làm tròn để lấy mẫu gần nhất và tạo `rectified`. Bản đúng in bốn hàng `[11, 12, 13, 14]` đến `[41, 42, 43, 44]`, rồi in `CORNERS 11 14 41 44`.",
    starter: String.raw`source = [
    [0, 11, 12, 0, 0, 0],
    [0, 21, 0, 13, 14, 0],
    [0, 0, 22, 23, 24, 0],
    [0, 31, 32, 33, 0, 0],
    [0, 41, 42, 0, 34, 0],
    [0, 0, 0, 43, 44, 0],
]
top_left = (0, 1)
top_right = (1, 4)
bottom_left = (4, 1)
bottom_right = (5, 4)
size = 4

rectified = []
for target_row in range(size):
    row_ratio = target_row / (size - 1)
    output_row = []
    for target_column in range(size):
        column_ratio = target_column / (size - 1)
        left_row = top_left[0] * (1 - row_ratio) + bottom_left[0] * row_ratio
        right_row = top_right[0] * (1 - row_ratio) + bottom_right[0] * row_ratio
        source_row = 0
        source_column = 0
        output_row.append(source[source_row][source_column])
    rectified.append(output_row)

for row in rectified:
    print(row)
print("CORNERS", rectified[0][0], rectified[0][-1], rectified[-1][0], rectified[-1][-1])`,
    solution: String.raw`source = [
    [0, 11, 12, 0, 0, 0],
    [0, 21, 0, 13, 14, 0],
    [0, 0, 22, 23, 24, 0],
    [0, 31, 32, 33, 0, 0],
    [0, 41, 42, 0, 34, 0],
    [0, 0, 0, 43, 44, 0],
]
top_left = (0, 1)
top_right = (1, 4)
bottom_left = (4, 1)
bottom_right = (5, 4)
size = 4

rectified = []
for target_row in range(size):
    row_ratio = target_row / (size - 1)
    output_row = []
    for target_column in range(size):
        column_ratio = target_column / (size - 1)
        left_row = top_left[0] * (1 - row_ratio) + bottom_left[0] * row_ratio
        right_row = top_right[0] * (1 - row_ratio) + bottom_right[0] * row_ratio
        source_row = round(left_row * (1 - column_ratio) + right_row * column_ratio)
        source_column = round(top_left[1] * (1 - column_ratio) + top_right[1] * column_ratio)
        output_row.append(source[source_row][source_column])
    rectified.append(output_row)

for row in rectified:
    print(row)
print("CORNERS", rectified[0][0], rectified[0][-1], rectified[-1][0], rectified[-1][-1])`,
    expectOut: { all: [/^\[11, 12, 13, 14\]$/, /^\[21, 22, 23, 24\]$/, /^\[31, 32, 33, 34\]$/, /^\[41, 42, 43, 44\]$/, /^CORNERS 11 14 41 44$/] },
    checkpoint: "Project dùng nội suy song tuyến tính cho một tứ giác có cấu trúc để thấy rõ cách ánh xạ ngược và lấy mẫu. Với phối cảnh tổng quát, bốn cặp điểm xác định homography 3×3; sau phép nhân tọa độ đồng nhất phải chia cho thành phần `w`.",
    questions: [
      { q: "Vì sao warp thường duyệt từng pixel đích rồi tìm vị trí nguồn, thay vì đẩy pixel nguồn sang đích?", a: ["Ánh xạ ngược giúp mọi pixel đích nhận được một mẫu", "Pixel nguồn không có tọa độ", "Homography chỉ hoạt động từ đích về nguồn"], correct: 0 },
      { q: "Sau khi tính `[x', y', w'] = H[x,y,1]`, tọa độ ảnh thực lấy thế nào?", a: ["`u = x'/w'`, `v = y'/w'`", "`u = x'+w'`, `v = y'+w'`", "Giữ nguyên `x', y'` trong mọi trường hợp"], correct: 0 },
    ],
    remember: ["Bốn cặp điểm xác định phép nắn một mặt phẳng.", "Warp cần cả ánh xạ hình học và quy tắc lấy mẫu pixel.", "Nearest neighbor đơn giản nhưng có thể răng cưa; nội suy tốt hơn làm ảnh mượt hơn."],
  }),
  12: project({
    deck: "motion",
    subtitle: "tìm centroid theo từng frame và suy ra quỹ đạo chuyển động",
    machineName: "BẾN THEO DÕI CHUYỂN ĐỘNG",
    machineBlurb: "một chuỗi frame, mask và các tâm nối thành quỹ đạo",
    sourceTitle: "OpenCV · Optical Flow",
    sourceUrl: "https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html",
    premise: "Tracking thêm trục thời gian vào bài toán thị giác. Trước optical flow, project dùng một giả thuyết kiểm soát được: vật sáng hơn nền. Mỗi frame tạo một centroid; chuỗi centroid tạo hướng chuyển động.",
    label: "vision_project_12_motion_track.py",
    note: "PROJECT 12 · THEO DÕI TÂM VẬT QUA BỐN FRAME\nBốn frame 6×8 đã có một khối sáng di chuyển sang phải và lên trên; không đọc camera. Hãy hoàn thành `centroid` bằng cách lấy trung bình hàng và cột của các pixel từ 50 trở lên, rồi tính `dx`, `dy` giữa tâm đầu và cuối. Bản đúng in bốn tâm `(3.5, 1.5)`, `(2.5, 3.5)`, `(1.5, 5.5)`, `(0.5, 6.5)` và kết thúc bằng `MOTION RIGHT-UP`.",
    starter: String.raw`frames = []
positions = [(3, 1), (2, 3), (1, 5), (0, 6)]
for top, left in positions:
    frame = [[10 for column in range(8)] for row in range(6)]
    for row in range(top, top + 2):
        for column in range(left, left + 2):
            frame[row][column] = 90
    frames.append(frame)

def centroid(frame, threshold):
    rows = []
    columns = []
    for row in range(len(frame)):
        for column in range(len(frame[0])):
            if frame[row][column] >= threshold:
                rows.append(0)
                columns.append(0)
    return sum(rows) / len(rows), sum(columns) / len(columns)

track = [centroid(frame, 50) for frame in frames]
for index, center in enumerate(track):
    print("CENTER", index, format(center[0], ".1f"), format(center[1], ".1f"))

dy = track[-1][0] - track[0][0]
dx = track[-1][1] - track[0][1]
if dx > 0 and dy < 0:
    direction = "RIGHT-UP"
else:
    direction = "OTHER"
print("DELTA", format(dy, ".1f"), format(dx, ".1f"))
print("MOTION", direction)`,
    solution: String.raw`frames = []
positions = [(3, 1), (2, 3), (1, 5), (0, 6)]
for top, left in positions:
    frame = [[10 for column in range(8)] for row in range(6)]
    for row in range(top, top + 2):
        for column in range(left, left + 2):
            frame[row][column] = 90
    frames.append(frame)

def centroid(frame, threshold):
    rows = []
    columns = []
    for row in range(len(frame)):
        for column in range(len(frame[0])):
            if frame[row][column] >= threshold:
                rows.append(row)
                columns.append(column)
    return sum(rows) / len(rows), sum(columns) / len(columns)

track = [centroid(frame, 50) for frame in frames]
for index, center in enumerate(track):
    print("CENTER", index, format(center[0], ".1f"), format(center[1], ".1f"))

dy = track[-1][0] - track[0][0]
dx = track[-1][1] - track[0][1]
if dx > 0 and dy < 0:
    direction = "RIGHT-UP"
else:
    direction = "OTHER"
print("DELTA", format(dy, ".1f"), format(dx, ".1f"))
print("MOTION", direction)`,
    expectOut: { all: [/^CENTER 0 3\.5 1\.5$/, /^CENTER 3 0\.5 6\.5$/, /^DELTA -3\.0 5\.0$/, /^MOTION RIGHT-UP$/] },
    checkpoint: "Centroid là trung bình tọa độ của các pixel thuộc vật. Trong tọa độ ảnh, row tăng theo hướng đi xuống; vì vậy `dy < 0` biểu thị vật đi lên. Frame differencing và optical flow mở rộng mô hình khi nền hoặc vật phức tạp hơn.",
    questions: [
      { q: "Tâm đổi từ `(row,column) = (3.5,1.5)` thành `(0.5,6.5)`. Hướng chuyển động là gì?", a: ["Sang phải và lên trên", "Sang trái và xuống dưới", "Chỉ sang phải"], correct: 0 },
      { q: "Vì sao `dy = -3` lại nghĩa là đi lên trong ảnh?", a: ["Chỉ số row tăng từ trên xuống dưới", "Trục x của ảnh bị đảo", "Camera luôn lật ảnh"], correct: 0 },
    ],
    remember: ["Chuỗi centroid là một track đơn giản.", "Tọa độ ảnh dùng row hướng xuống và column hướng sang phải.", "Threshold tracking phụ thuộc giả thuyết vật tách sáng rõ khỏi nền."],
  }),
  13: project({
    deck: "capstone",
    subtitle: "ghép pipeline phát hiện, theo dõi và từ chối khi bằng chứng yếu",
    machineName: "TRẠM SĂN ẤN CỔ",
    machineBlurb: "một pipeline để lại response, box, track và báo cáo ca thất bại",
    sourceTitle: "OpenCV · Template Matching",
    sourceUrl: "https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html",
    premise: "Capstone ghép các mô hình đã học thành một pipeline. Hệ thống phải báo 'không phát hiện' khi bằng chứng dưới ngưỡng; đây là yêu cầu kỹ thuật, không phải một kết quả phụ.",
    label: "vision_project_13_ancient_seal.py",
    note: "PROJECT 13 · TRẠM SĂN ẤN CỔ\nBa frame RGB nhỏ được tạo từ dữ liệu preset: hai frame đầu có cùng một ấn sáng di chuyển sang phải, frame cuối chỉ có nền phẳng. Pipeline phải đổi grayscale, box blur 3×3, tính ZNCC với template đã hiệu chỉnh từ frame đầu, chọn cực đại và từ chối score dưới 0.80. Hãy hoàn thành hai dòng còn thiếu trong `to_gray` và `detect`. Bản đúng in box `(0,0)`, `(0,1)`, `FRAME 2 NO DETECTION`, rồi kết thúc bằng `TRACK RIGHT` và `FAILED CASE REJECTED True`.",
    starter: String.raw`from math import sqrt

def rgb_scene(left=None, brightness=0):
    gray = [[10 + brightness for column in range(7)] for row in range(6)]
    if left is not None:
        pattern = [[20, 80], [80, 20]]
        for row in range(2):
            for column in range(2):
                gray[2 + row][left + column] = pattern[row][column] + brightness
    return [[(value, value, value) for value in row] for row in gray]

frames = [rgb_scene(2, 0), rgb_scene(3, 20), rgb_scene(None, 20)]

def to_gray(rgb_image):
    return [[0 for pixel in row] for row in rgb_image]

def box_blur(image):
    output = []
    for center_row in range(1, len(image) - 1):
        output_row = []
        for center_column in range(1, len(image[0]) - 1):
            total = 0
            for row_offset in range(-1, 2):
                for column_offset in range(-1, 2):
                    total += image[center_row + row_offset][center_column + column_offset]
            output_row.append(total / 9)
        output.append(output_row)
    return output

def zncc(window, template):
    a = [value for row in window for value in row]
    b = [value for row in template for value in row]
    mean_a = sum(a) / len(a)
    mean_b = sum(b) / len(b)
    window_deltas = [value - mean_a for value in a]
    template_deltas = [value - mean_b for value in b]
    energy_a = sum(value * value for value in window_deltas)
    energy_b = sum(value * value for value in template_deltas)
    if energy_a == 0 or energy_b == 0:
        return 0
    return sum(window_deltas[index] * template_deltas[index] for index in range(len(window_deltas))) / sqrt(energy_a * energy_b)

blurred_frames = [box_blur(to_gray(frame)) for frame in frames]
template = [row[0:3] for row in blurred_frames[0][0:3]]

def detect(image, pattern, threshold=0.80):
    best_score = -2
    best_position = None
    for top in range(len(image) - len(pattern) + 1):
        for left in range(len(image[0]) - len(pattern[0]) + 1):
            window = [row[left:left + len(pattern[0])] for row in image[top:top + len(pattern)]]
            score = zncc(window, pattern)
            if score > best_score:
                best_score = score
                best_position = (top, left)
    return None

detections = [detect(frame, template) for frame in blurred_frames]
for index, detection in enumerate(detections):
    if detection is None:
        print("FRAME", index, "NO DETECTION")
    else:
        row, column, score = detection
        print("FRAME", index, "BOX", row, column, "SCORE", format(score, ".2f"))

valid = [detection for detection in detections if detection is not None]
direction = "RIGHT" if valid[-1][1] > valid[0][1] else "OTHER"
print("TRACK", direction)
print("FAILED CASE REJECTED", detections[-1] is None)`,
    solution: String.raw`from math import sqrt

def rgb_scene(left=None, brightness=0):
    gray = [[10 + brightness for column in range(7)] for row in range(6)]
    if left is not None:
        pattern = [[20, 80], [80, 20]]
        for row in range(2):
            for column in range(2):
                gray[2 + row][left + column] = pattern[row][column] + brightness
    return [[(value, value, value) for value in row] for row in gray]

frames = [rgb_scene(2, 0), rgb_scene(3, 20), rgb_scene(None, 20)]

def to_gray(rgb_image):
    return [[round(0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]) for pixel in row] for row in rgb_image]

def box_blur(image):
    output = []
    for center_row in range(1, len(image) - 1):
        output_row = []
        for center_column in range(1, len(image[0]) - 1):
            total = 0
            for row_offset in range(-1, 2):
                for column_offset in range(-1, 2):
                    total += image[center_row + row_offset][center_column + column_offset]
            output_row.append(total / 9)
        output.append(output_row)
    return output

def zncc(window, template):
    a = [value for row in window for value in row]
    b = [value for row in template for value in row]
    mean_a = sum(a) / len(a)
    mean_b = sum(b) / len(b)
    window_deltas = [value - mean_a for value in a]
    template_deltas = [value - mean_b for value in b]
    energy_a = sum(value * value for value in window_deltas)
    energy_b = sum(value * value for value in template_deltas)
    if energy_a == 0 or energy_b == 0:
        return 0
    return sum(window_deltas[index] * template_deltas[index] for index in range(len(window_deltas))) / sqrt(energy_a * energy_b)

blurred_frames = [box_blur(to_gray(frame)) for frame in frames]
template = [row[0:3] for row in blurred_frames[0][0:3]]

def detect(image, pattern, threshold=0.80):
    best_score = -2
    best_position = None
    for top in range(len(image) - len(pattern) + 1):
        for left in range(len(image[0]) - len(pattern[0]) + 1):
            window = [row[left:left + len(pattern[0])] for row in image[top:top + len(pattern)]]
            score = zncc(window, pattern)
            if score > best_score:
                best_score = score
                best_position = (top, left)
    if best_score < threshold:
        return None
    return best_position[0], best_position[1], best_score

detections = [detect(frame, template) for frame in blurred_frames]
for index, detection in enumerate(detections):
    if detection is None:
        print("FRAME", index, "NO DETECTION")
    else:
        row, column, score = detection
        print("FRAME", index, "BOX", row, column, "SCORE", format(score, ".2f"))

valid = [detection for detection in detections if detection is not None]
direction = "RIGHT" if valid[-1][1] > valid[0][1] else "OTHER"
print("TRACK", direction)
print("FAILED CASE REJECTED", detections[-1] is None)`,
    expectOut: { all: [/^FRAME 0 BOX 0 0 SCORE 1\.00$/, /^FRAME 1 BOX 0 1 SCORE 1\.00$/, /^FRAME 2 NO DETECTION$/, /^TRACK RIGHT$/, /^FAILED CASE REJECTED True$/] },
    checkpoint: "Pipeline capstone để lại bằng chứng ở từng bước: grayscale và blur tạo dữ liệu chuẩn hóa; ZNCC tạo response; threshold cho quyền từ chối; detection theo thời gian tạo track. Một hệ thống đáng tin không ép mọi frame phải có vật.",
    questions: [
      { q: "Frame cuối có best ZNCC = 0.00 và ngưỡng là 0.80. Báo cáo nào đúng?", a: ["NO DETECTION", "Vẫn lấy box có score lớn nhất", "Hạ ngưỡng về 0 mà không kiểm tra"], correct: 0 },
      { q: "Hai detection hợp lệ có cột 1 rồi 2, còn hàng giữ nguyên 1. Track nên được tóm tắt thế nào?", a: ["Di chuyển sang phải", "Di chuyển lên trên", "Không chuyển động"], correct: 0 },
      { q: "Một lần chạy cho best = 0.82 và second-best = 0.81 sau khi blur mạnh. Kết luận kỹ thuật phù hợp nhất là gì?", a: ["Độ tin cậy thấp vì vị trí tốt nhất không tách rõ khỏi đối thủ", "Độ tin cậy cao vì best vượt 0.80", "NMS sẽ luôn làm best tăng lên"], correct: 0 },
    ],
    remember: ["Pipeline phải để lại số đo trung gian, không chỉ box cuối.", "Ngưỡng confidence cho phép từ chối khi bằng chứng yếu.", "Ca thất bại là một phần bắt buộc của báo cáo project thị giác."],
  }),
});

export const deckForVisionProject = id => VISION_LAB_DECKS[VISION_PROJECTS[id].deck];
