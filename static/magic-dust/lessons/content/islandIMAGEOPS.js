// islandIMAGEOPS.js — real image input -> 2D RGB list -> binary grid.
// This island follows node15 and makes the missing representation bridge
// explicit before asking learners to transform an image.
export default {
  index: -1,
  sideIslandId: "islandIMAGEOPS",
  title: "ĐẢO XỬ LÝ ẢNH RGB",
  subtitle: "chọn một tệp ảnh thật, đọc thành mảng hai chiều RGB, rồi tự chuyển từng điểm ảnh thành 0 hoặc 1",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ ĐỌC ẢNH" },
  machine: {
    art: "assets/pixel-art-magic-owl.webp",
    name: "MÁY ĐỌC ĐIỂM ẢNH",
    blurb: "một cỗ máy đọc tệp ảnh thành nhiều hàng và cột; mỗi ô giữ ba giá trị màu đỏ, xanh lá và xanh dương",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO XỬ LÝ ẢNH RGB ✦",
        hook: "Một tệp ảnh không đi thẳng vào vòng lặp. Máy phải đọc tệp, thu nhỏ nó thành các hàng và cột điểm ảnh, rồi mới áp dụng luật của mình cho từng ô. Bạn sẽ tự làm đủ ba bước đó.",
        art: "assets/pixel-art-magic-owl.webp",
      },
    },
    {
      npc: "Nói chính xác nhé: ảnh màu có thể được biểu diễn bằng một list hai chiều. `image[row][col]` lấy một điểm ảnh; điểm đó là `[red, green, blue]`, với mỗi giá trị từ 0 đến 255.",
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, present_image_frame\n\n# INPUT là tệp tranh cú có sẵn trong bài; máy đọc và thu nhỏ tệp thành 16x16 ô\nimage = load_sample_image(16)\n\nsay_num(len(image))\nsay_num(len(image[0]))\nsay_num(len(image[8][8]))\npresent_image_frame(image)\n',
      label: "doc_anh_mau.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tệp tranh cú phép thuật có sẵn trong bài. `load_sample_image(16)` đọc tệp và trả về `image` gồm 16 hàng, mỗi hàng 16 cột. Mỗi ô giữ ba giá trị `[red, green, blue]`. OUTPUT là `16`, `16`, `3` và chính bức tranh màu trong khung xem trước.",
      expectOut: { all: [/^16$/, /^3$/] },
      solution: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, present_image_frame\n\nimage = load_sample_image(16)\n\nsay_num(len(image))\nsay_num(len(image[0]))\nsay_num(len(image[8][8]))\npresent_image_frame(image)\n',
    },
    {
      checkpoint: {
        text: "Sau khi máy đọc tệp ảnh, `image` là một list hai chiều: `len(image)` là số hàng, `len(image[0])` là số cột, và `image[row][col]` là một điểm ảnh `[red, green, blue]`.",
      },
    },
    {
      quiz: {
        title: "Đọc cấu trúc của ảnh",
        questions: [
          {
            q: "Máy đã đọc một tệp ảnh thành `image` có 16 hàng và 16 cột. Mỗi điểm ảnh là `[red, green, blue]`. Biểu thức nào lấy giá trị xanh lá của điểm ảnh ở hàng 5, cột 2?",
            a: ["`image[5][2][1]`", "`image[2][5][1]`", "`image[5][2][2]`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ mình đổi ảnh màu thành ảnh binary. Với mỗi điểm ảnh, máy tính độ sáng trung bình `(red + green + blue) // 3`. Độ sáng từ 128 trở lên thành `1`; thấp hơn 128 thành `0`.",
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, pixel_display\n\n# INPUT là tệp tranh cú; PROCESS là so độ sáng từng điểm với ngưỡng 128\nimage = load_sample_image(16)\nbinary = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 128:\n            binary[row][col] = 1\n        else:\n            binary[row][col] = 0\n\nsay_num(binary[0][0])\nsay_num(binary[7][8])\npixel_display(binary)\n',
      label: "anh_mau_thanh_binary.py",
      note: "RUN KIỂM CHỨNG\nINPUT là tệp tranh cú được đọc thành bảng RGB 16×16. PROCESS quét từng hàng-cột, cộng ba kênh màu, chia nguyên cho 3 để lấy `brightness`, rồi so với ngưỡng 128. OUTPUT là góc nền tối bằng `0`, vùng sáng gần giữa tranh bằng `1`, và một mảng 0/1 vẫn nhận ra hình cú cùng vầng trăng.",
      expectOut: { all: [/^0$/, /^1$/] },
      solution: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, pixel_display\n\nimage = load_sample_image(16)\nbinary = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 128:\n            binary[row][col] = 1\n        else:\n            binary[row][col] = 0\n\nsay_num(binary[0][0])\nsay_num(binary[7][8])\npixel_display(binary)\n',
    },
    {
      code: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, pixel_display\n\nimage = load_sample_image(16)\nbinary = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness < 128:  # lượt của bạn: vùng sáng phải thành 1\n            binary[row][col] = 1\n        else:\n            binary[row][col] = 0\n\nsay_num(binary[0][0])\nsay_num(binary[7][8])\npixel_display(binary)\n',
      label: "sua_dieu_kien_binary.py",
      note: "ĐỀ BÀI\nINPUT vẫn là tệp tranh cú 16×16. Dòng `if` đang biến vùng tối thành 1, nên nền và chủ thể đổi chỗ. Hãy đổi điều kiện để điểm có `brightness` từ 128 trở lên nhận 1. OUTPUT đúng là `0` cho góc nền, `1` cho vùng sáng gần giữa tranh, rồi hiện đúng ảnh binary.",
      expectOut: { all: [/^0$/, /^1$/] },
      solution: 'from old_computer import say_num\nfrom camera_charm import load_sample_image, blank_grid, pixel_display\n\nimage = load_sample_image(16)\nbinary = blank_grid(len(image), len(image[0]))\n\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= 128:\n            binary[row][col] = 1\n        else:\n            binary[row][col] = 0\n\nsay_num(binary[0][0])\nsay_num(binary[7][8])\npixel_display(binary)\n',
    },
    {
      checkpoint: {
        text: "Chuyển ảnh RGB sang binary là tạo một bảng mới cùng số hàng-cột, tính độ sáng của từng điểm ảnh, rồi gán `1` hoặc `0` theo một ngưỡng. Ngưỡng không phải đáp án cố định: đổi ngưỡng sẽ đổi phần nào của ảnh được giữ lại.",
      },
    },
    {
      quiz: {
        title: "Áp dụng ngưỡng sáng",
        questions: [
          {
            q: "Một điểm ảnh có `pixel = [30, 60, 90]`. Chương trình tính `brightness = (30 + 60 + 90) // 3`, rồi gán 1 khi `brightness >= 128`, ngược lại gán 0. Điểm ảnh này thành giá trị nào trong bảng binary?",
            a: ["`0`, vì độ sáng là 60 và thấp hơn 128", "`1`, vì kênh xanh dương là 90", "`1`, vì tổng ba kênh là 180"],
            correct: 0,
          },
          {
            q: "Cùng một ảnh được chuyển sang binary bằng điều kiện `brightness >= threshold`. Nếu tăng `threshold` từ 100 lên 180, thay đổi nào hợp lý nhất?",
            a: ["Ít điểm ảnh đạt ngưỡng hơn, nên bảng thường có ít số 1 hơn", "Mọi điểm ảnh tự đổi thành 1", "Số hàng và cột của ảnh tăng lên"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ tới INPUT thật của bạn. `choose_image(16)` mở bộ chọn ảnh trên máy; ảnh chỉ được đọc trong trình duyệt, không tải lên máy chủ. Nếu bạn bấm hủy, bài tự dùng tranh cú mẫu để không bị ngắt.",
    },
    {
      code: 'from camera_charm import choose_image, blank_grid, present_image_frame, pixel_display\n\n# INPUT thật: bạn chọn một tệp ảnh từ thiết bị\nimage = choose_image(16)\npresent_image_frame(image)\n\nthreshold = 128\nbinary = blank_grid(len(image), len(image[0]))\nfor row in range(len(image)):\n    for col in range(len(image[row])):\n        pixel = image[row][col]\n        brightness = (pixel[0] + pixel[1] + pixel[2]) // 3\n        if brightness >= threshold:\n            binary[row][col] = 1\n        else:\n            binary[row][col] = 0\n\npixel_display(binary)\n',
      label: "chon_anh_bat_ky.py",
      note: "XƯỞNG ẢNH CỦA BẠN — không chấm điểm. INPUT là tệp ảnh bạn chọn từ thiết bị. PROCESS đọc ảnh thành 16×16 điểm RGB rồi dùng `threshold` để tạo bảng 0/1. OUTPUT lần lượt là ảnh màu đã chọn và ảnh binary. Thử các ngưỡng 80, 128, 180 để xem chi tiết nào còn lại.",
      expectOut: null,
    },
    {
      gift: {
        glyph: "▦",
        name: "HUY HIỆU ẢNH THÀNH MẢNG",
        blurb: "phần thưởng cho việc đọc một tệp ảnh thật thành bảng RGB và tự chuyển từng điểm ảnh sang 0 hoặc 1 bằng ngưỡng sáng",
        badge: true,
        badgeId: "huy_hieu_xu_ly_anh_rgb",
      },
    },
    {
      remember: "Pipeline đầy đủ là: chọn hoặc mở TỆP ẢNH → máy đọc thành `image[row][col] = [red, green, blue]` → quét mọi hàng-cột → tính `brightness` → so với `threshold` → ghi 0 hoặc 1 vào bảng `binary` → hiện OUTPUT.",
    },
  ],
};
