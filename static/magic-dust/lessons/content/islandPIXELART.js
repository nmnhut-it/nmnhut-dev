// islandPIXELART.js — polished pixel art as a small color grid, not a 5x5
// binary toy. Learners inspect a generated asset, derive a binary pattern,
// map that pattern through a palette, then transform the full 16x16 artwork.
export default {
  index: -1,
  sideIslandId: "islandPIXELART",
  title: "ĐẢO TRANH ĐIỂM ẢNH",
  subtitle: "mổ xẻ một tác phẩm pixel art 16×16, tách pattern khỏi palette, đổi màu và lật cả bức tranh bằng hàng-cột",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ PIXEL ART" },
  machine: {
    art: "assets/pixel-art-magic-owl.webp",
    name: "XƯỞNG PIXEL ART",
    blurb: "một xưởng dùng mảng hai chiều để giữ vị trí từng ô màu, rồi thay palette mà không phải vẽ lại hình từ đầu",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO TRANH ĐIỂM ẢNH ✦",
        hook: "Pixel art không bắt đầu từ vài ô vuông rời rạc. Một tác phẩm đẹp vẫn có dáng, ánh sáng và bảng màu; điểm khác là họa sĩ cố ý làm việc trên một lưới nhỏ, nên từng ô màu đều có vai trò rõ ràng.",
        art: "assets/pixel-art-magic-owl.webp",
      },
    },
    {
      npc: "Đây là Cú Ánh Trăng, tranh mẫu của đảo. Máy sẽ thu nó về 16×16 để bạn nhìn đúng cấu trúc: 16 hàng, 16 cột, và mỗi ô giữ màu `[red, green, blue]`.",
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, present_image_frame\n\n# INPUT là tệp pixel art được tạo riêng cho bài học\nimage = load_sample_image(16)\n\nsay_num(len(image))\nsay_num(len(image[0]))\nsay_num(len(image[0][0]))\npresent_image_frame(image)\n',
      label: "mo_tranh_cu.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tệp pixel art Cú Ánh Trăng có sẵn. Máy đọc tệp thành `image` 16 hàng × 16 cột; mỗi ô có ba kênh màu. OUTPUT là `16`, `16`, `3` và tác phẩm được phóng lớn bằng cạnh ô sắc nét.",
      expectOut: { all: [/^16$/, /^3$/] },
      solution: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, present_image_frame\n\nimage = load_sample_image(16)\n\nsay_num(len(image))\nsay_num(len(image[0]))\nsay_num(len(image[0][0]))\npresent_image_frame(image)\n',
    },
    {
      checkpoint: {
        text: "Pixel art là ảnh màu được thiết kế có chủ ý trên một lưới nhỏ. Sau khi đọc tệp, `image[row][col]` vẫn là một điểm ảnh RGB; kích thước nhỏ và cạnh ô rõ giúp họa sĩ kiểm soát từng điểm.",
      },
    },
    {
      quiz: {
        title: "Đọc tác phẩm như dữ liệu",
        questions: [
          {
            q: "Tệp Cú Ánh Trăng được đọc thành `image` 16×16. Mỗi ô là `[red, green, blue]`. Biểu thức nào lấy toàn bộ màu của ô ở hàng 7, cột 10?",
            a: ["`image[7][10]`", "`image[10][7][0]`", "`image[7]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Ta có thể tách thiết kế thành hai phần: `pattern` giữ dáng bằng 0 và 1; `palette` chọn màu cho mỗi số. Giữ pattern, đổi palette là có phiên bản màu mới.",
    },
    {
      code: 'from camera_charm import load_sample_image, blank_grid, pixel_display\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n        else:\n            pattern[row][col] = 0\n\npixel_display(pattern)\n',
      label: "tach_pattern.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tranh màu 16×16. PROCESS dùng ngưỡng 110 để giữ phần sáng thành 1 và nền tối thành 0. OUTPUT là `pattern`: bản khung nhị phân vẫn nhận ra cú cùng vầng trăng. Bài này cho thấy 0/1 là một lớp thiết kế hữu ích, không phải toàn bộ màu của tác phẩm gốc.",
      expectOut: null,
      solution: 'from camera_charm import load_sample_image, blank_grid, pixel_display\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n        else:\n            pattern[row][col] = 0\n\npixel_display(pattern)\n',
    },
    {
      npc: "Giờ mình tô lại cùng pattern bằng hai màu RGB. Mọi ô 0 lấy `dark_color`; mọi ô 1 lấy `light_color`. Không đổi một vị trí nào, nhưng cảm giác của tranh đổi hẳn theo palette.",
    },
    {
      code: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n\ndark_color = [18, 12, 45]\nlight_color = [255, 198, 74]\nart = blank_grid(len(pattern), len(pattern[0]), dark_color)\n\nfor row in range(len(pattern)):\n    for col in range(len(pattern[row])):\n        if pattern[row][col] == 1:\n            art[row][col] = light_color\n        else:\n            art[row][col] = dark_color\n\npresent_image_frame(art)\n',
      label: "doi_palette_demo.py",
      note: "RUN KIỂM CHỨNG\n`pattern` được tạo từ tranh cú và giữ nguyên vị trí 0/1. PROCESS ánh xạ 0 sang tím đậm `[18, 12, 45]`, 1 sang vàng `[255, 198, 74]`. OUTPUT là cùng một dáng cú-trăng với palette tím-vàng mới.",
      expectOut: null,
      solution: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n\ndark_color = [18, 12, 45]\nlight_color = [255, 198, 74]\nart = blank_grid(len(pattern), len(pattern[0]), dark_color)\nfor row in range(len(pattern)):\n    for col in range(len(pattern[row])):\n        if pattern[row][col] == 1:\n            art[row][col] = light_color\n        else:\n            art[row][col] = dark_color\npresent_image_frame(art)\n',
    },
    {
      code: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n\ndark_color = [8, 35, 48]\nlight_color = [126, 231, 255]\nart = blank_grid(len(pattern), len(pattern[0]), dark_color)\nfor row in range(len(pattern)):\n    for col in range(len(pattern[row])):\n        if pattern[row][col] == 0:  # lượt của bạn: phần sáng phải lấy light_color\n            art[row][col] = light_color\n        else:\n            art[row][col] = dark_color\n\npresent_image_frame(art)\n',
      label: "sua_palette.py",
      note: "ĐỀ BÀI\nINPUT là `pattern` của Cú Ánh Trăng. Hai màu xanh đậm và xanh sáng đã cho sẵn. Điều kiện đang tô `light_color` vào ô 0 nên nền và chủ thể đổi chỗ. Hãy sửa để ô 1 lấy màu sáng, ô 0 lấy màu nền. OUTPUT là dáng cú-trăng màu xanh trên nền tối.",
      expectOut: null,
      solution: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 110:\n            pattern[row][col] = 1\n\ndark_color = [8, 35, 48]\nlight_color = [126, 231, 255]\nart = blank_grid(len(pattern), len(pattern[0]), dark_color)\nfor row in range(len(pattern)):\n    for col in range(len(pattern[row])):\n        if pattern[row][col] == 1:\n            art[row][col] = light_color\n        else:\n            art[row][col] = dark_color\npresent_image_frame(art)\n',
    },
    {
      checkpoint: {
        text: "Tách `pattern` và `palette` giúp chỉnh tranh có hệ thống: `pattern[row][col]` quyết định ô thuộc nền hay chủ thể; `dark_color` và `light_color` quyết định hai nhóm đó hiện bằng màu RGB nào.",
      },
    },
    {
      quiz: {
        title: "Giữ dáng, đổi bảng màu",
        questions: [
          {
            q: "Một `pattern` 16×16 đã giữ đúng dáng nhân vật bằng 0 và 1. Muốn tạo phiên bản màu mới nhưng không làm nhân vật đổi hình, cách nào đúng?",
            a: ["Giữ nguyên `pattern`, đổi `dark_color` và `light_color`", "Đổi mọi chỉ số `row` thành `col`", "Xóa bớt tám hàng của `pattern`"],
            correct: 0,
          },
          {
            q: "Đoạn tô màu dùng luật: ô 1 lấy `light_color`, ô 0 lấy `dark_color`. Nếu `pattern[4][6] == 1`, dòng nào gán đúng màu cho `art[4][6]`?",
            a: ["`art[4][6] = light_color`", "`art[6][4] = dark_color`", "`pattern[4][6] = light_color`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Pattern đẹp rồi thì phép biến đổi cũng phải chạy trên cả 16×16. Lật ngang giữ nguyên hàng, nhưng ô ở cột mới lấy dữ liệu từ cột đối xứng `col_count - 1 - col`.",
    },
    {
      code: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\ncol_count = len(image[0])\nflipped = blank_grid(len(image), col_count, [0, 0, 0])\n\nfor row in range(len(image)):\n    for col in range(col_count):\n        flipped[row][col] = image[row][col_count - 1 - col]\n\npresent_image_frame(flipped)\n',
      label: "lat_tac_pham.py",
      note: "RUN KIỂM CHỨNG\nINPUT là toàn bộ tranh màu Cú Ánh Trăng 16×16. PROCESS chép mỗi ô từ cột đối xứng sang `flipped`; hàng không đổi. OUTPUT là tác phẩm màu được soi gương trái-phải, không phải một ví dụ 3×3 thay thế cho tác phẩm.",
      expectOut: null,
      solution: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\ncol_count = len(image[0])\nflipped = blank_grid(len(image), col_count, [0, 0, 0])\nfor row in range(len(image)):\n    for col in range(col_count):\n        flipped[row][col] = image[row][col_count - 1 - col]\npresent_image_frame(flipped)\n',
    },
    {
      code: 'from camera_charm import load_sample_image, blank_grid, present_image_frame\n\nimage = load_sample_image(16)\npattern = blank_grid(len(image), len(image[0]))\nthreshold = 110\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= threshold:\n            pattern[row][col] = 1\n\n# XƯỞNG CỦA BẠN: đổi ba dòng dưới để tạo palette riêng\ndark_color = [20, 12, 46]\nlight_color = [255, 202, 82]\nart = blank_grid(len(pattern), len(pattern[0]), dark_color)\nfor row in range(len(pattern)):\n    for col in range(len(pattern[row])):\n        if pattern[row][col] == 1:\n            art[row][col] = light_color\n\npresent_image_frame(art)\n',
      label: "pixel_art_cua_ban.py",
      note: "XƯỞNG PIXEL ART — không chấm điểm. INPUT là tác phẩm cú 16×16. PROCESS tạo `pattern` bằng `threshold`, rồi tô lại bằng hai màu bạn chọn. OUTPUT là phiên bản của riêng bạn. Thử đổi `threshold`, `dark_color`, `light_color`; mỗi lần chỉ đổi một phần để nhìn rõ tác động.",
      expectOut: null,
    },
    {
      gift: {
        glyph: "▧",
        name: "HUY HIỆU NGHỆ NHÂN PIXEL",
        blurb: "phần thưởng cho việc đọc một tác phẩm 16×16 như dữ liệu, tách pattern khỏi palette, đổi màu và biến đổi toàn bộ ảnh",
        badge: true,
        badgeId: "huy_hieu_tranh_diem_anh",
      },
    },
    {
      remember: "Một tác phẩm pixel art là ảnh màu trên lưới nhỏ, không chỉ là bảng 0/1. Ta có thể lấy một `pattern` binary để giữ dáng, dùng `palette` để tô màu, rồi áp dụng cùng luật hàng-cột cho toàn bộ tác phẩm.",
    },
  ],
};
