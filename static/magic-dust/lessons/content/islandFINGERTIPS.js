const starter = `from fingertip_lab import test

def count_fingertips(grid):
    # Viết lời giải trong hàm này.
    return 0

test(count_fingertips)
`;

const solution = `from fingertip_lab import test

def count_fingertips(grid):
    fingertip_count = 0

    for row in range(len(grid) - 1):
        for col in range(len(grid[row])):
            if grid[row][col] != "x":
                continue

            left_is_empty = col == 0 or grid[row][col - 1] == "0"
            right_is_empty = col == len(grid[row]) - 1 or grid[row][col + 1] == "0"
            above_is_empty = row == 0 or col >= len(grid[row - 1]) or grid[row - 1][col] == "0"
            continues_below = col < len(grid[row + 1]) and grid[row + 1][col] == "x"

            if left_is_empty and right_is_empty and above_is_empty and continues_below:
                fingertip_count = fingertip_count + 1

    return fingertip_count

test(count_fingertips)
`;

const allTestsPass = { all: [
  /^PASS empty$/,
  /^PASS one_finger$/,
  /^PASS three_fingers$/,
  /^PASS finger_at_edge$/,
  /^PASS isolated_pixel_is_not_a_finger$/,
  /^RESULT 5\/5$/,
] };

export default {
  index: -1,
  pageLabel: "ĐẢO THỰC HÀNH",
  cameraFree: true,
  sideIslandId: "islandFINGERTIPS",
  title: "ĐẢO ĐẦU NGÓN TAY",
  subtitle: "từ ảnh bàn tay đến ma trận x và 0",
  bundle: { art: "assets/rookie-bundle.webp", name: "HỒ SƠ ẢNH CAMERA" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY PHÂN TÍCH BÀN TAY",
    blurb: "robot tự đưa năm ma trận bàn tay vào hàm của bạn",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    fingertip_lab: "../py/fingertip_lab/__init__.py",
  },
  cells: [
    { intro: {
      title: "✦ TỪ ẢNH CAMERA ĐẾN BÀI TOÁN ✦",
      hook: "Camera chụp được hình một bàn tay. Một thuật toán xử lý ảnh đã đổi hình đó thành bảng ô vuông: ô thuộc bàn tay được ghi là x, ô nền được ghi là 0. Phần nhận diện ảnh đã làm xong. Việc của bạn là đếm các đầu ngón tay trong bảng.",
      art: "assets/old-computer.webp",
    } },
    { npc: "Có nhiều thuật toán để tách bàn tay khỏi nền: so màu, so độ sáng hoặc dùng mô hình học máy. Bài này nhận sẵn ma trận `x` và `0`." },
    { remember: "QUY ƯỚC CỦA BÀI\n• `x`: pixel thuộc bàn tay\n• `0`: pixel nền\n• Đỉnh mỗi ngón được làm mảnh còn đúng một ô `x`.\n• Phía trên, bên trái và bên phải ô đỉnh đều là nền `0` hoặc nằm ngoài ảnh.\n• Ngay bên dưới là `x`, vì ngón tay còn kéo dài xuống bàn tay." },
    { remember: "MỘT BÀN TAY ĐÃ ĐƯỢC ĐƠN GIẢN HÓA\n`0 x 0 0 x 0 0 x 0`\n`0 x 0 0 x 0 0 x 0`\n`0 x x x x x x x 0`\n`0 x x x x x x x 0`\n\nHàng đầu có ba ô `x`. Mỗi ô đều có `0` ở hai bên và có `x` ngay bên dưới. Vì vậy bảng này có 3 đầu ngón tay." },
    { npc: "Trên đường viền thật, đầu ngón là nơi đường viền đổi hướng mạnh, tức là có độ cong lớn. Bài này làm đỉnh mảnh thành một ô `x`: ba phía là nền, phía dưới tiếp tục là ngón." },
    {
      code: starter,
      label: "fingertip_peak_challenge.py",
      note: "VIỆC CỦA BẠN\nHàm nhận một ma trận bàn tay đã được đổi thành `x` và `0`. Hãy quét các ô và đếm ô đỉnh: phía trên, bên trái và bên phải là nền; phía dưới thuộc bàn tay. Không sửa dòng `test(count_fingertips)`. Bấm RUN để robot tự chấm năm ma trận.",
      expectOut: null,
      solution,
    },
    { remember: "GỢI Ý 1 · Với ô ở mép trái, hãy xem phía ngoài bảng giống như `0`. Tương tự với ô ở mép phải. Chỉ xét đến hàng áp chót vì ô đỉnh phải có một hàng nằm bên dưới." },
    { quiz: { title: "Nhìn mẫu trước khi viết code", questions: [
      { q: "Trong hàng `0 x 0`, ô `x` có `x` ngay bên dưới. Ô đó có phải đỉnh ngón tay không?", a: ["Có", "Không", "Chưa đủ dữ liệu"], correct: 0 },
      { q: "Trong hàng `0 x x 0`, hai ô `x` đứng cạnh nhau. Theo quy ước đầu ngón chỉ rộng một ô, ta đếm được bao nhiêu đỉnh?", a: ["0", "1", "2"], correct: 0 },
    ] } },
    { remember: "GỢI Ý 2 · Với mỗi ô `x`, kiểm tra bốn hướng bằng các tên rõ nghĩa: `left_is_empty`, `right_is_empty`, `above_is_empty`, `continues_below`. Chỉ tăng số đếm khi cả bốn giá trị đều đúng." },
    {
      code: starter,
      label: "fingertip_final_tests.py",
      note: "BÀI NỘP CUỐI\nRobot kiểm tra bảng rỗng, một ngón, ba ngón, ngón nằm sát mép và một pixel đứng riêng không nối xuống bàn tay. Bài đạt khi có năm dòng PASS và dòng cuối là `RESULT 5/5`.",
      expectOut: allTestsPass,
      solution,
      solutionExplanation: [
        { line: 6, text: "Không quét hàng cuối vì một đỉnh ngón tay phải có ô `x` tiếp tục ở hàng bên dưới." },
        { line: 11, text: "Nếu đang ở cột đầu, phía bên trái được xem là ngoài ảnh và tương đương nền `0`." },
        { line: 12, text: "Cách kiểm tra phía bên phải tương tự, kể cả khi ô đang nằm ở mép phải." },
        { line: 13, text: "Phía trên phải là nền hoặc nằm ngoài ảnh; điều kiện này ngăn chương trình đếm lại các ô nằm dọc thân ngón." },
        { line: 14, text: "Ô bên dưới phải tồn tại và mang giá trị `x`; nhờ vậy một pixel nhiễu đứng riêng không bị tính là ngón tay." },
        { line: 16, text: "Chỉ khi ba phía là nền và phía dưới tiếp tục là bàn tay, số đầu ngón mới tăng một." },
      ],
    },
    { gift: { glyph: "✣", name: "HUY HIỆU ĐỈNH NGÓN", blurb: "phần thưởng cho lời giải nhận ra mẫu đỉnh ngón trong ảnh bàn tay đã được đơn giản hóa", badge: true, badgeId: "huy_hieu_dau_ngon_tay" } },
    { remember: "Camera tạo ảnh từ pixel. Thuật toán xử lý ảnh đổi các pixel thành mặt nạ bàn tay `x/0`. Bài này nhận mặt nạ đó và đếm ô đỉnh: ba phía là nền, còn phía dưới tiếp tục bằng `x`." },
  ],
};
