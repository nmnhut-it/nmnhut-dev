// islandEDGE.js — capstone for the image pipeline: RGB file -> binary grid ->
// four-neighbour edge detection. Small grids scaffold the neighbour rule; the
// assessed project runs it on the generated 16x16 pixel-art asset.
export default {
  index: -1,
  sideIslandId: "islandEDGE",
  title: "ĐẢO DỰ ÁN: TÁCH VIỀN ẢNH",
  subtitle: "lấy ảnh màu, chuyển thành mảng 0/1, rồi xét bốn hàng xóm của từng điểm để tìm đường viền thật của chủ thể",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ TÁCH VIỀN" },
  machine: {
    art: "assets/pixel-art-magic-owl.webp",
    name: "MÁY TÁCH VIỀN ẢNH",
    blurb: "một cỗ máy nối ba bước: đọc tệp ảnh, tạo bảng binary, rồi giữ lại những điểm sáng nằm sát nền tối",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO DỰ ÁN: TÁCH VIỀN ẢNH ✦",
        hook: "Đường viền không xuất hiện từ một hình thoi được gõ sẵn. Dự án này bắt đầu bằng tệp Cú Ánh Trăng, chuyển ảnh màu thành bảng 0/1, rồi tìm ranh giới giữa chủ thể sáng và nền tối.",
        art: "assets/pixel-art-magic-owl.webp",
      },
    },
    {
      npc: "Luật viền cần đọc bốn ô nằm sát điểm đang xét: trên là `image[row - 1][col]`, dưới là `image[row + 1][col]`, trái là `image[row][col - 1]`, phải là `image[row][col + 1]`.",
    },
    {
      code: 'from old_computer import say_num\n\n# Bảng nhỏ chỉ dùng để nhìn rõ bốn địa chỉ hàng xóm\nimage = [\n    [1, 0, 1],\n    [0, 1, 1],\n    [1, 1, 0]\n]\nrow = 1\ncol = 1\n\nsay_num(image[row - 1][col])\nsay_num(image[row + 1][col])\nsay_num(image[row][col - 1])\nsay_num(image[row][col + 1])\n',
      label: "bon_hang_xom.py",
      note: "RUN KIỂM CHỨNG\nBảng 3×3 là kính phóng đại để đọc địa chỉ, không phải sản phẩm cuối. Ô đang xét là hàng 1 cột 1. PROCESS đọc lần lượt hàng xóm trên, dưới, trái, phải. OUTPUT là `0`, `1`, `0`, `1`.",
      expectOut: { all: [/^0$/, /^1$/] },
      solution: 'from old_computer import say_num\n\nimage = [\n    [1, 0, 1],\n    [0, 1, 1],\n    [1, 1, 0]\n]\nrow = 1\ncol = 1\nsay_num(image[row - 1][col])\nsay_num(image[row + 1][col])\nsay_num(image[row][col - 1])\nsay_num(image[row][col + 1])\n',
    },
    {
      quiz: {
        title: "Đọc hàng xóm",
        questions: [
          {
            q: "Cho `image = [[1,0,1],[0,1,1],[1,1,0]]` và ô đang xét ở `row = 1`, `col = 1`. Biểu thức nào đọc hàng xóm bên phải của ô đó?",
            a: ["`image[row][col + 1]`", "`image[row + 1][col]`", "`image[col][row - 1]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Ô ở mép ảnh có thể thiếu hàng xóm. Với hàng 0, `row - 1` đọc nhầm hàng cuối; ở mép dưới hoặc phải, chỉ số lớn làm máy báo lỗi. Vì vậy phải kiểm tra biên trước khi đọc.",
    },
    {
      code: 'from old_computer import say_num\n\nimage = [\n    [1, 1, 0],\n    [0, 1, 1],\n    [1, 0, 1]\n]\nrow_count = len(image)\nrow = 2\ncol = 1\n\nif row + 1 <= row_count:  # lượt của bạn: chỉ đọc khi hàng bên dưới còn trong bảng\n    down = image[row + 1][col]\nelse:\n    down = 0\n\nsay_num(down)\n',
      label: "sua_chan_mep_anh.py",
      note: "ĐỀ BÀI\nBảng có ba hàng, nên index hợp lệ là 0, 1, 2. Ô đang xét ở hàng 2 và không có hàng xóm bên dưới. Điều kiện hiện tại vẫn cho phép index 3 nên máy báo lỗi. Hãy đổi mốc chặn để ngoài bảng thì `down = 0`. OUTPUT đúng là `0`.",
      expectOut: /^0$/,
      solution: 'from old_computer import say_num\n\nimage = [\n    [1, 1, 0],\n    [0, 1, 1],\n    [1, 0, 1]\n]\nrow_count = len(image)\nrow = 2\ncol = 1\n\nif row + 1 <= row_count - 1:\n    down = image[row + 1][col]\nelse:\n    down = 0\n\nsay_num(down)\n',
    },
    {
      checkpoint: {
        text: "Trước khi đọc hàng xóm, phải biết chỉ số đó còn trong bảng. Ngoài bảng được coi là 0. Cách này tránh cả việc index `-1` đọc nhầm hàng cuối lẫn việc index quá lớn làm máy báo lỗi.",
      },
    },
    {
      quiz: {
        title: "Chặn mép ảnh",
        questions: [
          {
            q: "Bảng có 3 hàng với index 0, 1, 2. Ô đang xét ở `row = 2`. Điều kiện nào cho phép đọc hàng xóm bên dưới chỉ khi index đó còn trong bảng?",
            a: ["`row + 1 <= row_count - 1`", "`row + 1 <= row_count`", "`row - 1 < 0`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Một ô sáng là điểm viền khi ít nhất một hàng xóm nằm ngoài bảng hoặc mang số 0. Ô có đủ bốn hàng xóm đều bằng 1 nằm bên trong chủ thể, nên không được chép sang `edge`.",
    },
    {
      quiz: {
        title: "Nhận ra điểm viền",
        questions: [
          {
            q: "Luật: ô sáng là điểm viền nếu có ít nhất một hàng xóm ngoài bảng hoặc bằng 0. Trong hình vuông đặc `image = [[1,1,1],[1,1,1],[1,1,1]]`, ô nào không phải điểm viền?",
            a: ["Ô giữa `image[1][1]`", "Ô góc `image[0][0]`", "Ô mép trên `image[0][1]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đây là dự án thật: INPUT là tệp Cú Ánh Trăng. Chương trình đọc nó thành RGB, tạo `binary` bằng ngưỡng sáng, rồi chạy luật bốn hàng xóm trên toàn bộ 16×16 để tạo `edge`.",
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, present_image_frame, pixel_display\n\n# INPUT: tệp ảnh màu Cú Ánh Trăng\nimage = load_sample_image(16)\npresent_image_frame(image)\nrow_count = len(image)\ncol_count = len(image[0])\n\n# PROCESS 1: RGB -> binary\nbinary = blank_grid(row_count, col_count)\nfor row in range(row_count):\n    for col in range(col_count):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            binary[row][col] = 1\n\n# PROCESS 2: binary -> edge\nedge = blank_grid(row_count, col_count)\nedge_count = 0\nfor row in range(row_count):\n    for col in range(col_count):\n        if binary[row][col] == 1:\n            is_edge = False\n            if row - 1 < 0 or binary[row - 1][col] == 0:\n                is_edge = True\n            if row + 1 > row_count - 1 or binary[row + 1][col] == 0:\n                is_edge = True\n            if col - 1 < 0 or binary[row][col - 1] == 0:\n                is_edge = True\n            if col + 1 > col_count - 1 or binary[row][col + 1] == 0:\n                is_edge = True\n            if is_edge == True:\n                edge[row][col] = 1\n                edge_count = edge_count + 1\n\n# OUTPUT: số điểm viền và hình viền 0/1\nsay_num(edge_count)\npixel_display(edge)\n',
      label: "tach_vien_cu_anh_trang.py",
      note: "RUN DỰ ÁN\nINPUT là tệp ảnh màu có sẵn. PROCESS 1 tạo `binary` bằng ngưỡng 110. PROCESS 2 xét bốn hàng xóm của mọi ô sáng và ghi điểm rìa vào `edge`. OUTPUT là số điểm viền lớn hơn 0 và hình viền 16×16 của cú cùng vầng trăng. Bảng nhỏ ở đầu bài chỉ giúp học luật; sản phẩm này chạy trên tác phẩm thật.",
      expectOut: /^[1-9][0-9]*$/,
      solution: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, present_image_frame, pixel_display\n\nimage = load_sample_image(16)\npresent_image_frame(image)\nrow_count = len(image)\ncol_count = len(image[0])\nbinary = blank_grid(row_count, col_count)\nfor row in range(row_count):\n    for col in range(col_count):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            binary[row][col] = 1\nedge = blank_grid(row_count, col_count)\nedge_count = 0\nfor row in range(row_count):\n    for col in range(col_count):\n        if binary[row][col] == 1:\n            is_edge = False\n            if row - 1 < 0 or binary[row - 1][col] == 0:\n                is_edge = True\n            if row + 1 > row_count - 1 or binary[row + 1][col] == 0:\n                is_edge = True\n            if col - 1 < 0 or binary[row][col - 1] == 0:\n                is_edge = True\n            if col + 1 > col_count - 1 or binary[row][col + 1] == 0:\n                is_edge = True\n            if is_edge == True:\n                edge[row][col] = 1\n                edge_count = edge_count + 1\nsay_num(edge_count)\npixel_display(edge)\n',
    },
    {
      checkpoint: {
        text: "Quy trình tách viền gồm hai phép biến đổi mảng: `image` RGB → `binary` bằng ngưỡng sáng → `edge` bằng luật bốn hàng xóm. Mỗi bảng giữ cùng số hàng-cột; chỉ ý nghĩa của giá trị trong từng ô thay đổi.",
      },
    },
    {
      quiz: {
        title: "Lần theo quy trình tách viền",
        questions: [
          {
            q: "Một chương trình tách viền bắt đầu từ tệp ảnh màu. Thứ tự dữ liệu nào đúng để tạo OUTPUT là đường viền 0/1?",
            a: ["Tệp ảnh → `image` RGB → `binary` → `edge`", "Tệp ảnh → `edge` → `image` RGB → `binary`", "`binary` → tệp ảnh → `image` RGB → `edge`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import choose_image, blank_grid, present_image_frame, pixel_display\n\n# INPUT thật: chọn một ảnh từ thiết bị; bấm hủy để dùng ảnh mẫu\nimage = choose_image(16)\npresent_image_frame(image)\nrow_count = len(image)\ncol_count = len(image[0])\nthreshold = 128\n\nbinary = blank_grid(row_count, col_count)\nfor row in range(row_count):\n    for col in range(col_count):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= threshold:\n            binary[row][col] = 1\n\nedge = blank_grid(row_count, col_count)\nfor row in range(row_count):\n    for col in range(col_count):\n        if binary[row][col] == 1:\n            is_edge = False\n            if row - 1 < 0 or binary[row - 1][col] == 0:\n                is_edge = True\n            if row + 1 > row_count - 1 or binary[row + 1][col] == 0:\n                is_edge = True\n            if col - 1 < 0 or binary[row][col - 1] == 0:\n                is_edge = True\n            if col + 1 > col_count - 1 or binary[row][col + 1] == 0:\n                is_edge = True\n            if is_edge == True:\n                edge[row][col] = 1\n\npixel_display(edge)\n',
      label: "tach_vien_anh_cua_ban.py",
      note: "XƯỞNG TÁCH VIỀN — không chấm điểm. INPUT là tệp ảnh bạn chọn. PROCESS thu ảnh về 16×16, tạo binary theo `threshold`, rồi tìm viền. OUTPUT là đường viền 0/1. Ảnh có nền và chủ thể tương phản rõ sẽ cho kết quả dễ nhận ra; thử đổi ngưỡng 80, 128, 180.",
      expectOut: null,
    },
    {
      gift: {
        glyph: "◈",
        name: "HUY HIỆU TÁCH VIỀN",
        blurb: "phần thưởng cho việc nối tệp ảnh thật với mảng RGB, ảnh binary và luật bốn hàng xóm để tìm đường viền",
        badge: true,
        badgeId: "huy_hieu_tach_vien",
      },
    },
    {
      remember: "Tách viền không bắt đầu từ một hình được gõ sẵn. Ta chọn ảnh → đọc thành mảng RGB → chuyển thành binary → xét bốn hàng xóm của từng ô sáng → ghi các điểm rìa vào `edge` → hiện kết quả.",
    },
  ],
};
