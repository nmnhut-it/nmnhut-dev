export default {
  index: -1,
  sideIslandId: "junior-camera-project",
  completionKey: "magicdust.junior.camera.project",
  returnPage: "./learning-portal.html",
  title: "XƯỞNG CAMERA NHÍ",
  subtitle: "một project Python ngắn dành cho học sinh lớp 5–6",
  bundle: {
    art: "assets/rookie-bundle.webp",
    name: "HỘP DỤNG CỤ CAMERA NHÍ",
  },
  machine: {
    art: "assets/old-computer.webp",
    name: "GƯƠNG CẢM XÚC",
    blurb: "camera đọc bàn tay, còn đoạn code của bạn quyết định điều xuất hiện",
  },
  modules: {
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "XƯỞNG CAMERA NHÍ",
        hook: "Bạn sẽ tự làm một chiếc gương biết nhìn bàn tay và trả lời bằng chữ, màu sắc, hiệu ứng.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn! Project có năm chặng ngắn. Mỗi chặng chỉ đổi vài dòng code. Hãy bấm RUN, thử bằng tay thật, rồi mới sửa tiếp. Nếu camera không mở được, máy sẽ cho bạn nhập số ngón tay.",
    },
    {
      code: `from camera_charm import watch, display

finger = watch()
display("Camera thấy " + str(finger) + " ngón tay")`,
      label: "01_camera_thay_gi.py",
      note: "CHẶNG 1 · CHẠY LẦN ĐẦU\nINPUT thật: `watch()` đọc số ngón tay bạn đang giơ trước camera.\nPROCESS: giá trị được lưu trong `finger`, rồi ghép vào một dòng chữ.\nOUTPUT: màn hình hiện đúng câu `Camera thấy ... ngón tay` với số vừa đọc.\n\nBấm RUN, cho phép dùng camera, giơ từ 1 đến 5 ngón tay và giữ yên.",
      expectOut: {
        1: /Camera thấy 1 ngón tay/,
        2: /Camera thấy 2 ngón tay/,
        3: /Camera thấy 3 ngón tay/,
        4: /Camera thấy 4 ngón tay/,
        5: /Camera thấy 5 ngón tay/,
      },
      solution: `from camera_charm import watch, display

finger = watch()
display("Camera thấy " + str(finger) + " ngón tay")`,
    },
    {
      checkpoint: {
        text: "`watch()` lấy INPUT thật từ camera. Biến `finger` giữ con số để các dòng phía sau dùng lại.",
      },
    },
    {
      quiz: {
        title: "Camera đưa gì cho code?",
        questions: [
          {
            q: "Sau dòng `finger = watch()`, biến `finger` đang giữ giá trị nào?",
            a: [
              "Số ngón tay camera vừa đọc được",
              "Một tấm ảnh chụp bàn tay",
              "Tên của người đứng trước camera",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from camera_charm import watch, display

finger = watch()

if finger <= 2:
    display("ĐỘI TIA CHỚP")
else:
    display("ĐỘI CẦU VỒNG")`,
      label: "02_chia_doi.py",
      note: "CHẶNG 2 · CAMERA CHỌN ĐỘI\nINPUT thật: camera đọc số ngón tay và lưu vào `finger`.\nPROCESS: nếu `finger` từ 2 trở xuống, máy chọn ĐỘI TIA CHỚP; các số còn lại chọn ĐỘI CẦU VỒNG.\nOUTPUT: màn hình hiện đúng một tên đội.\n\nChạy ít nhất hai lần: một lần giơ 1 hoặc 2 ngón, một lần giơ 3, 4 hoặc 5 ngón.",
      expectOut: {
        1: /ĐỘI TIA CHỚP/,
        2: /ĐỘI TIA CHỚP/,
        3: /ĐỘI CẦU VỒNG/,
        4: /ĐỘI CẦU VỒNG/,
        5: /ĐỘI CẦU VỒNG/,
      },
      solution: `from camera_charm import watch, display

finger = watch()

if finger <= 2:
    display("ĐỘI TIA CHỚP")
else:
    display("ĐỘI CẦU VỒNG")`,
    },
    {
      quiz: {
        title: "Đọc luật trước khi chạy",
        questions: [
          {
            q: "Nếu camera đọc được 4 ngón tay, đoạn code chia đội sẽ hiện kết quả nào?",
            a: [
              "ĐỘI CẦU VỒNG, vì 4 không thỏa điều kiện `finger <= 2`",
              "ĐỘI TIA CHỚP, vì nhánh `if` luôn chạy trước",
              "Cả hai đội, vì máy chạy mọi nhánh",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from camera_charm import watch, display, lighten, darken

finger = watch()

# Việc của bạn:
# 1 hoặc 2 ngón: hiện "NHẸ NHÀNG" và làm tối màn hình.
# 3 hoặc 4 ngón: hiện "RỰC RỠ" và làm sáng màn hình.
# 5 ngón: hiện "SIÊU NĂNG LƯỢNG" và làm sáng màn hình.

if finger <= 2:
    display("NHẸ NHÀNG")
    darken()
elif finger <= 4:
    display("...")
else:
    display("...")`,
      label: "03_sua_luat_cam_xuc.py",
      note: "CHẶNG 3 · TỰ HOÀN THÀNH LUẬT\nINPUT thật: số ngón tay từ camera đã được lưu trong `finger`.\nPROCESS: sửa hai dòng `display(\"...\")`, rồi thêm `lighten()` vào hai nhánh cuối.\nOUTPUT: 1–2 ngón hiện `NHẸ NHÀNG`; 3–4 ngón hiện `RỰC RỠ`; 5 ngón hiện `SIÊU NĂNG LƯỢNG`. Màn hình tối ở nhóm đầu và sáng ở hai nhóm sau.",
      expectOut: {
        1: { all: [/NHẸ NHÀNG/, /darken/i] },
        2: { all: [/NHẸ NHÀNG/, /darken/i] },
        3: { all: [/RỰC RỠ/, /lighten/i] },
        4: { all: [/RỰC RỠ/, /lighten/i] },
        5: { all: [/SIÊU NĂNG LƯỢNG/, /lighten/i] },
      },
      solution: `from camera_charm import watch, display, lighten, darken

finger = watch()

if finger <= 2:
    display("NHẸ NHÀNG")
    darken()
elif finger <= 4:
    display("RỰC RỠ")
    lighten()
else:
    display("SIÊU NĂNG LƯỢNG")
    lighten()`,
    },
    {
      checkpoint: {
        text: "Camera chỉ đưa cho chương trình một con số. Chính các điều kiện `if`, `elif`, `else` do bạn viết mới quyết định phản ứng của chiếc gương.",
      },
    },
    {
      quiz: {
        title: "Ai quyết định phản ứng?",
        questions: [
          {
            q: "Muốn 5 ngón tay làm màn hình sáng lên, bạn cần thay đổi phần nào?",
            a: [
              "Thêm `lighten()` vào nhánh nhận giá trị 5",
              "Đổi camera sang một chiếc máy khác",
              "Giơ tay gần camera hơn",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from camera_charm import watch, display, fire_vortex

finger = watch()
score = finger * 20

display("Năng lượng: " + str(score))

# Việc của bạn: nếu score bằng 100,
# hãy gọi fire_vortex() ở bên trong nhánh if.
if score == 100:
    pass`,
      label: "04_nap_nang_luong.py",
      note: "CHẶNG 4 · BIẾN INPUT THÀNH ĐIỂM\nINPUT thật: camera đọc từ 1 đến 5 ngón tay.\nPROCESS: `score = finger * 20` đổi số ngón tay thành điểm năng lượng. Thay `pass` bằng `fire_vortex()`.\nOUTPUT: màn hình hiện số điểm. Khi giơ 5 ngón, điểm bằng 100 và vòng lửa xuất hiện.",
      expectOut: {
        1: /Năng lượng: 20/,
        2: /Năng lượng: 40/,
        3: /Năng lượng: 60/,
        4: /Năng lượng: 80/,
        5: { all: [/Năng lượng: 100/, /fire/i] },
      },
      solution: `from camera_charm import watch, display, fire_vortex

finger = watch()
score = finger * 20

display("Năng lượng: " + str(score))

if score == 100:
    fire_vortex()`,
    },
    {
      npc: "Chặng cuối không có một đáp án duy nhất. Bạn sẽ đặt ba phản ứng riêng cho chiếc gương. Hãy viết bảng luật của mình ra giấy trước, rồi mới chuyển từng dòng sang code.",
    },
    {
      code: `from camera_charm import watch, display, blur, sharpen, flip_mirror, rotate_with_hand, fire_vortex

finger = watch()

# BẢNG LUẬT CỦA BẠN
# 1 ngón -> làm mờ
# 2 ngón -> làm nét
# 3 ngón -> lật ảnh
# 4 ngón -> xoay ảnh theo bàn tay
# 5 ngón -> triệu hồi particle

if finger == 1:
    display("LÀM MỜ")
    blur()
# Việc của bạn: thêm bốn nhánh elif còn lại.`,
      label: "05_guong_cua_toi.py",
      note: "MINI-PROJECT · XƯỞNG LIVESTREAM\nINPUT thật: `watch()` đọc số ngón tay từ camera.\nPROCESS: hoàn thành bảng luật bằng `if/elif`: 1 ngón gọi `blur()`, 2 ngón gọi `sharpen()`, 3 ngón gọi `flip_mirror()`, 4 ngón gọi `rotate_with_hand()`, 5 ngón gọi `fire_vortex()`.\nOUTPUT: chạy lại cell với từng ký hiệu. Camera phải lần lượt mờ, nét hơn, lật, xoay theo hướng bàn tay và phát particle.\n\nRotate dùng kiến thức mới: camera nối cổ tay với gốc ngón giữa thành một vector, tính góc bằng `atan2`, rồi làm mượt góc trước khi xoay ảnh.",
      expectOut: null,
      solution: `from camera_charm import watch, display, blur, sharpen, flip_mirror, rotate_with_hand, fire_vortex

finger = watch()

if finger == 1:
    display("LÀM MỜ")
    blur()
elif finger == 2:
    display("LÀM NÉT")
    sharpen()
elif finger == 3:
    display("LẬT ẢNH")
    flip_mirror()
elif finger == 4:
    display("XOAY THEO TAY")
    rotate_with_hand()
elif finger == 5:
    display("PARTICLE")
    fire_vortex()`,
    },
    {
      remember: "Bạn vừa tạo một project có đủ ba phần: camera cung cấp INPUT thật, đoạn code dùng biến và điều kiện để PROCESS, còn chữ và hiệu ứng là OUTPUT nhìn thấy được. Tuyến Mắt Máy nâng cao vẫn ở nguyên để bạn học tiếp khi đã sẵn sàng.",
    },
  ],
};
