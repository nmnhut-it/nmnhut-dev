// islandPHOTOLIGHTS.js — a grade-6 project taught from one observable line at a time.
export default {
  index: -1,
  sideIslandId: "islandPHOTOLIGHTS",
  cameraFree: true,
  stickyCodeOutput: true,
  title: "ĐẢO DỰ ÁN: XƯỞNG BẢNG ĐÈN",
  subtitle: "chạy từng dòng, nhìn từng bóng, rồi mới ghép thành vòng lặp và grid",
  bundle: { art: "assets/electronic-marquee-board.webp", name: "BẢNG ĐÈN KOTOPIA" },
  machine: {
    art: "assets/electronic-marquee-board.webp",
    name: "BẢNG ĐÈN KOTOPIA",
    blurb: "một bảng đèn để bạn lắp từng bóng và nhìn rõ máy làm gì sau mỗi dòng code",
  },
  modules: { light_board: "../py/light_board/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ XƯỞNG BẢNG ĐÈN ✦",
        hook: "Hôm nay không cần đọc cả chương trình một lúc. Mỗi lần bạn chỉ chạy một dòng, nghe Pip giải thích, rồi nhìn bảng đèn thay đổi.",
        art: "assets/electronic-marquee-board.webp",
      },
    },
    {
      npc: "Tụi mình bắt đầu bằng đúng một bóng. Bạn chưa cần tính khoảng cách, chưa cần `%`, cũng chưa cần nhớ vòng lặp. Mục tiêu đầu tiên chỉ là hiểu một lời gọi `place_bulb()`.",
    },
    {
      label: "walk_mot_bong",
      walkthrough: {
        title: "BƯỚC 1 — MỘT DÒNG TẠO MỘT BÓNG",
        intro: "Dòng màu vàng là dòng sắp chạy. Hãy đọc lời Pip trước, rồi mới bấm nút.",
        code: [
          "from light_board import start_board, place_bulb",
          "start_board()",
          'place_bulb(35, 50, "yellow")',
        ],
        steps: [
          {
            line: 1,
            explain: "Dòng 1 lấy hai công cụ từ hộp `light_board`. Chưa có bóng nào xuất hiện, vì dòng này chỉ chuẩn bị công cụ.",
            memory: "Máy đã nhớ hai tên: start_board và place_bulb.",
          },
          {
            line: 2,
            explain: "Dòng 2 mở bảng đèn. Chương trình sẽ đứng chờ cho đến khi chính bạn bấm BẮT ĐẦU trên bảng.",
            action: { action: "light_board_start" },
            memory: "Bảng đã mở. Chương trình được phép chạy tiếp.",
          },
          {
            line: 3,
            explain: "Dòng 3 lắp một bóng. `35` đặt bóng về phía trái, `50` đặt nó giữa chiều cao, còn `yellow` chọn màu vàng.",
            action: { action: "light_board_bulb", x: 35, y: 50, color: "yellow" },
            observeMs: 1600,
            memory: "Kết quả: một bóng vàng tại x = 35, y = 50.",
          },
        ],
      },
    },
    {
      npc: "Trong `place_bulb(x, y, color)`, `x` cho biết vị trí từ trái sang phải; `y` cho biết vị trí từ trên xuống dưới. Bây giờ tụi mình giữ nguyên `y = 50` và lắp thêm một bóng ở bên phải.",
    },
    {
      label: "walk_ba_bong",
      walkthrough: {
        title: "BƯỚC 2 — THÊM MỘT BÓNG THỨ HAI",
        intro: "Bóng đầu tiên vẫn còn trên bảng. Dòng mới chỉ thêm một bóng nữa; hãy nhìn xem vị trí nào thay đổi.",
        executedNote: "Dòng 1–3 đã được chạy ở cell trước.",
        executedLines: [1, 2, 3],
        continueScene: true,
        code: [
          "from light_board import start_board, place_bulb",
          "start_board()",
          'place_bulb(35, 50, "yellow")',
          'place_bulb(65, 50, "blue")',
        ],
        steps: [
          {
            line: 4,
            explain: "Dòng này lắp bóng xanh dương tại `x = 65`, `y = 50`. Hai bóng có cùng `y`, nên chúng nằm trên cùng một hàng. `x` khác nhau làm một bóng ở trái và một bóng ở phải.",
            action: { action: "light_board_bulb", x: 65, y: 50, color: "blue" },
            observeMs: 1800,
            memory: "Bảng có 2 bóng cùng hàng: (35, 50) và (65, 50).",
          },
        ],
      },
    },
    {
      code: 'from light_board import start_board, place_bulb, delay\n\nstart_board()\nplace_bulb(35, 50, "yellow")\nplace_bulb(65, 50, "blue")\n\n# Hãy đổi số 50 thứ hai thành 25 hoặc 75\nplace_bulb(50, 50, "green")\ndelay(2)\n',
      label: "tu_dat_bong_thu_ba.py",
      note: "BÀI TẬP ĐẦU TIÊN — ĐẶT BÓNG THỨ BA\nKhông có INPUT thật. Hai bóng cho sẵn nằm tại `(35, 50)` và `(65, 50)`. Hãy giữ `x = 50` cho bóng xanh lá và đổi `y` thành `25` hoặc `75`. PROCESS chỉ sửa đối số `y` trong lời gọi thứ ba. OUTPUT đúng có ba bóng; bóng xanh lá không nằm cùng hàng `y = 50` với hai bóng kia.",
      expectOut: { all: [/light_board_start/i, /light_board_bulb/i, /"x"\s*:\s*50/i, /"y"\s*:\s*(25|75)/i, /delay/i, { minLines: 5 }] },
      solution: 'from light_board import start_board, place_bulb, delay\n\nstart_board()\nplace_bulb(35, 50, "yellow")\nplace_bulb(65, 50, "blue")\nplace_bulb(50, 25, "green")\ndelay(2)\n',
    },
    {
      checkpoint: {
        text: "Mỗi lời gọi `place_bulb(x, y, color)` lắp một bóng. Đổi `x` làm bóng dịch trái hoặc phải; đổi `y` làm bóng dịch lên hoặc xuống; đổi `color` làm bóng đổi màu.",
      },
    },
    {
      quiz: {
        title: "Đọc một lời gọi place_bulb",
        questions: [
          {
            q: "Hai bóng đang ở `(35, 50)` và `(65, 50)`. Muốn thêm bóng thứ ba ở phía dưới và nằm giữa hai bóng đó, lời gọi nào phù hợp?",
            a: ["`place_bulb(50, 75, \"green\")`", "`place_bulb(75, 50, \"green\")`", "`place_bulb(50, 25, \"green\")`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nếu cần sáu bóng, mình không muốn viết sáu lời gọi giống nhau. Pip sẽ ghi sẵn sáu vị trí vào một list; `for` lấy từng vị trí trong list đó.",
    },
    {
      label: "walk_for_positions",
      walkthrough: {
        title: "BƯỚC 3 — FOR LẤY TỪNG VỊ TRÍ TRONG LIST",
        intro: "Không có phép chia và không có `%`. Sáu vị trí đã được viết sẵn để mình chỉ tập trung vào cách `for` làm việc.",
        executedNote: "Dòng 1–2 là phần mở bảng đã chạy ở các cell trước.",
        executedLines: [1, 2],
        continueScene: true,
        code: [
          "from light_board import start_board, place_bulb, clear_lights",
          "start_board()",
          "positions = [15, 30, 45, 60, 75, 90]",
          "clear_lights()",
          "for x in positions:",
          '    place_bulb(x, 20, "yellow")',
        ],
        steps: [
          {
            line: 3,
            explain: "Dòng 3 tạo list gồm sáu vị trí. Máy giữ nguyên cả list trong tên `positions`; dòng này chưa lắp bóng.",
            memory: "positions = [15, 30, 45, 60, 75, 90]",
          },
          {
            line: 4,
            explain: "Dòng 4 xóa bảng để chuẩn bị cho một lần lắp mới.",
            action: { action: "light_board_clear" },
            observeMs: 800,
            memory: "Bảng hiện có 0 bóng.",
          },
          {
            line: 5,
            explain: "Lượt đầu của `for`: máy lấy số đầu tiên trong list và đặt `x = 15`. Sau đó máy đi vào dòng thụt lề.",
            memory: "Lượt 1: x = 15.",
          },
          {
            line: 6,
            explain: "Dòng thụt lề dùng giá trị đang có trong `x`, nên bóng đầu tiên được lắp tại `x = 15`.",
            action: { action: "light_board_bulb", x: 15, y: 20, color: "yellow" },
            observeMs: 1200,
            memory: "Lượt 1 xong: bảng có 1 bóng.",
          },
          {
            line: 5,
            explain: "`for` quay lại và lấy số tiếp theo. Lần này máy đặt `x = 30`.",
            memory: "Lượt 2: x = 30.",
          },
          {
            line: 6,
            explain: "Cùng một dòng thụt lề chạy lại, nhưng `x` đã đổi thành 30. Bóng thứ hai xuất hiện ở vị trí mới.",
            action: { action: "light_board_bulb", x: 30, y: 20, color: "yellow" },
            observeMs: 1200,
            memory: "Lượt 2 xong: bảng có 2 bóng.",
          },
          {
            line: 5,
            explain: "Các lượt còn lại cũng làm đúng hai việc: lấy số kế tiếp trong list, rồi chạy dòng thụt lề. Bây giờ `x = 45`.",
            memory: "Lượt 3: x = 45.",
          },
          {
            line: 6,
            explain: "Dòng lắp bóng chạy với `x = 45`.",
            action: { action: "light_board_bulb", x: 45, y: 20, color: "yellow" },
            observeMs: 1000,
            memory: "Lượt 3 xong: bảng có 3 bóng.",
          },
          {
            line: 6,
            explain: "Máy tiếp tục cùng dòng này với `x = 60`.",
            action: { action: "light_board_bulb", x: 60, y: 20, color: "yellow" },
            observeMs: 1000,
            memory: "Lượt 4 xong: bảng có 4 bóng.",
          },
          {
            line: 6,
            explain: "Máy tiếp tục cùng dòng này với `x = 75`.",
            action: { action: "light_board_bulb", x: 75, y: 20, color: "yellow" },
            observeMs: 1000,
            memory: "Lượt 5 xong: bảng có 5 bóng.",
          },
          {
            line: 6,
            explain: "Lượt cuối dùng `x = 90`. Sau đó list không còn số nào, nên `for` kết thúc.",
            action: { action: "light_board_bulb", x: 90, y: 20, color: "yellow" },
            observeMs: 1600,
            memory: "Lượt 6 xong: bảng có 6 bóng; for kết thúc.",
          },
        ],
      },
    },
    {
      code: 'from light_board import start_board, place_bulb, clear_lights, delay\n\nstart_board()\npositions = [15, 30, 45, 60, 75, 90]\nclear_lights()\n\nfor x in positions:\n    place_bulb(x, 20, "yellow")\n    delay(0.5)\n',
      label: "tu_lap_day_bong.py",
      note: "THỬ LẠI CẢ CHƯƠNG TRÌNH\nKhông có INPUT thật; list `positions` và màu vàng đã được gán sẵn. Hãy RUN, bấm BẮT ĐẦU và nhìn từng lượt. PROCESS lấy từng `x` trong list rồi lắp một bóng. OUTPUT đúng là sáu bóng xuất hiện lần lượt, cách nhau 0,5 giây.",
      expectOut: { all: [/light_board_start/i, /light_board_clear/i, /light_board_bulb/i, /delay/i, { minLines: 14 }] },
      solution: 'from light_board import start_board, place_bulb, clear_lights, delay\n\nstart_board()\npositions = [15, 30, 45, 60, 75, 90]\nclear_lights()\n\nfor x in positions:\n    place_bulb(x, 20, "yellow")\n    delay(0.5)\n',
    },
    {
      checkpoint: {
        text: "Trong `for x in positions:`, mỗi lượt lấy một số từ list và gán số đó vào `x`. Mọi dòng thụt lề bên dưới chạy một lần với giá trị `x` đang có.",
      },
    },
    {
      quiz: {
        title: "Theo dõi từng lượt của for",
        questions: [
          {
            q: "Đoạn code dùng `positions = [20, 50, 80]` rồi chạy `for x in positions:`. Ở lượt thứ hai, `x` mang giá trị nào và bóng được đặt ở đâu?",
            a: ["x = 50, bóng ở giữa chiều ngang", "x = 2, bóng ở mép trái", "x = 80, bóng ở bên phải"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ tụi mình tạo một chu kỳ chớp. Cơ chế chỉ gồm bốn việc nhìn thấy được: lắp dãy bóng, chờ để thấy sáng, xóa bóng, rồi chờ để thấy tối.",
    },
    {
      label: "walk_blink",
      walkthrough: {
        title: "BƯỚC 4 — MỘT CHU KỲ SÁNG VÀ TỐI",
        intro: "Đèn không tự biết chớp. Chính thứ tự các dòng tạo ra một frame sáng và một frame tối.",
        executedNote: "Dòng 1–3 đã có từ phần lắp dãy bóng.",
        executedLines: [1, 2, 3],
        continueScene: true,
        code: [
          "from light_board import start_board, place_bulb, clear_lights, delay",
          "start_board()",
          "positions = [15, 30, 45, 60, 75, 90]",
          "for x in positions:",
          '    place_bulb(x, 20, "cyan")',
          "delay(1.5)",
          "clear_lights()",
          "delay(1.5)",
        ],
        steps: [
          { line: 4, explain: "`for` chuẩn bị đi qua list vị trí. Mỗi lượt sẽ lắp một bóng màu cyan.", memory: "Bắt đầu tạo frame sáng." },
          { line: 5, explain: "Các lượt của dòng thụt lề lắp đủ sáu bóng. Pip cho chúng xuất hiện cùng lúc để mình tập trung vào chu kỳ.", action: { action: "light_board_clear" }, memory: "Bảng được dọn trước khi tạo frame sáng." },
          { line: 5, explain: "Lượt 1: lắp bóng tại x = 15.", action: { action: "light_board_bulb", x: 15, y: 20, color: "cyan" }, observeMs: 500, memory: "Frame sáng: 1 bóng." },
          { line: 5, explain: "Lượt 2: lắp bóng tại x = 30.", action: { action: "light_board_bulb", x: 30, y: 20, color: "cyan" }, observeMs: 500, memory: "Frame sáng: 2 bóng." },
          { line: 5, explain: "Bốn lượt còn lại hoàn thành cả dãy.", action: { action: "light_board_bulb", x: 45, y: 20, color: "cyan" }, observeMs: 250, memory: "Frame sáng đang được tạo." },
          { line: 5, explain: "Lắp bóng tại x = 60.", action: { action: "light_board_bulb", x: 60, y: 20, color: "cyan" }, observeMs: 250, memory: "Frame sáng đang được tạo." },
          { line: 5, explain: "Lắp bóng tại x = 75.", action: { action: "light_board_bulb", x: 75, y: 20, color: "cyan" }, observeMs: 250, memory: "Frame sáng đang được tạo." },
          { line: 5, explain: "Lắp bóng cuối tại x = 90. Frame sáng đã hoàn chỉnh.", action: { action: "light_board_bulb", x: 90, y: 20, color: "cyan" }, observeMs: 700, memory: "Frame sáng: 6 bóng." },
          { line: 6, explain: "`delay(1.5)` giữ nguyên frame sáng trong 1,5 giây. Nếu bỏ dòng này, mắt mình gần như không kịp thấy đèn sáng.", action: { action: "delay", seconds: 1.5 }, memory: "Frame sáng được giữ trong 1,5 giây." },
          { line: 7, explain: "`clear_lights()` xóa tất cả bóng đang sáng. Đây là lúc chương trình tạo frame tối.", action: { action: "light_board_clear" }, observeMs: 1000, memory: "Frame tối: 0 bóng." },
          { line: 8, explain: "`delay(1.5)` giữ frame tối. Một lần sáng rồi tối như vậy tạo thành một chu kỳ.", action: { action: "delay", seconds: 1.5 }, memory: "Một chu kỳ = sáng 1,5 giây + tối 1,5 giây." },
        ],
      },
    },
    {
      code: 'from light_board import start_board, place_bulb, clear_lights, delay\n\nstart_board()\npositions = [15, 30, 45, 60, 75, 90]\n\nfor cycle in range(3):\n    for x in positions:\n        place_bulb(x, 20, "cyan")\n    delay(0.8)\n    clear_lights()\n    delay(0.6)\n',
      label: "ba_chu_ky_chop.py",
      note: "GHÉP THÀNH BA CHU KỲ\nKhông có INPUT thật; vị trí, màu và ba chu kỳ đã được gán sẵn. Vòng `for x` tạo một frame sáng; hai lần `delay()` giữ frame sáng và tối. Vòng `for cycle` lặp toàn bộ chu kỳ ba lần. OUTPUT đúng là ba lần sáng–tối nhìn thấy rõ.",
      expectOut: { all: [/light_board_start/i, /light_board_bulb/i, /light_board_clear/i, /"seconds"\s*:\s*0\.8/i, /"seconds"\s*:\s*0\.6/i, { minLines: 28 }] },
      solution: 'from light_board import start_board, place_bulb, clear_lights, delay\n\nstart_board()\npositions = [15, 30, 45, 60, 75, 90]\n\nfor cycle in range(3):\n    for x in positions:\n        place_bulb(x, 20, "cyan")\n    delay(0.8)\n    clear_lights()\n    delay(0.6)\n',
    },
    {
      npc: "Một dãy bóng chỉ có một hàng. Muốn tạo hình hoặc chữ, mình cần nhiều hàng và nhiều cột. Đó là `grid`: số 1 là bóng sáng, số 0 là vị trí để trống.",
    },
    {
      label: "walk_grid",
      walkthrough: {
        title: "BƯỚC 5 — ĐỌC GRID THEO HÀNG VÀ CỘT",
        intro: "Grid nhỏ này có 3 hàng và 3 cột. Tụi mình đọc từng hàng trước khi đưa nó lên bảng.",
        executedNote: "Dòng 1–2 tiếp tục dùng bảng đèn đã mở.",
        executedLines: [1, 2],
        continueScene: true,
        code: [
          "from light_board import start_board, show_grid",
          "start_board()",
          "picture = [",
          "    [1, 0, 1],",
          "    [0, 0, 0],",
          "    [1, 1, 1]",
          "]",
          'show_grid(picture, color="yellow")',
        ],
        steps: [
          { line: 3, explain: "Dòng 3 bắt đầu một list lớn tên `picture`. List lớn này sẽ chứa các hàng của grid.", memory: "picture: đang chờ các hàng." },
          { line: 4, explain: "Dòng 4 là hàng đầu. Hai số 1 bật hai bóng ở hai bên; số 0 ở giữa để trống.", memory: "Hàng 0: sáng, tắt, sáng." },
          { line: 5, explain: "Dòng 5 là hàng giữa. Cả ba số đều bằng 0, nên hàng này không có bóng sáng.", memory: "Hàng 1: tắt, tắt, tắt." },
          { line: 6, explain: "Dòng 6 là hàng cuối. Ba số 1 làm cả ba bóng trong hàng cùng sáng.", memory: "Hàng 2: sáng, sáng, sáng." },
          { line: 7, explain: "Dòng 7 đóng list lớn. Bây giờ `picture` đã là một grid 3 hàng × 3 cột.", memory: "picture có 3 hàng; mỗi hàng có 3 cột." },
          { line: 8, explain: "Dòng 8 đưa toàn bộ grid lên bảng. Máy đọc từng ô: gặp 1 thì bật bóng, gặp 0 thì để trống.", action: { action: "light_board_grid", grid: [[1, 0, 1], [0, 0, 0], [1, 1, 1]], offset: 24, color: "yellow" }, observeMs: 2200, memory: "OUTPUT: hình mặt cười đơn giản bằng 5 bóng." },
        ],
      },
    },
    {
      checkpoint: {
        text: "Grid là một list gồm nhiều hàng. `grid[row][col]` chọn một ô: số đầu chọn hàng, số sau chọn cột. Trong bảng đèn, 1 nghĩa là sáng và 0 nghĩa là tắt.",
      },
    },
    {
      quiz: {
        title: "Đọc một hàng trong grid",
        questions: [
          {
            q: "Một hàng của grid là `[1, 0, 1, 1]`. Khi bảng đọc hàng này từ trái sang phải, trạng thái bốn bóng là gì?",
            a: ["Sáng, tắt, sáng, sáng", "Tắt, sáng, tắt, tắt", "Cả bốn bóng đều sáng"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Chữ chạy cũng chỉ là nhiều frame. Tụi mình giữ nguyên grid chữ `HI`, rồi thay đổi `offset`. Mỗi giá trị `offset` cho bảng nhìn chữ ở một vị trí hơi lệch sang trái.",
    },
    {
      label: "walk_text",
      walkthrough: {
        title: "BƯỚC 6 — BA FRAME LÀM CHỮ DỊCH CHUYỂN",
        intro: "Trước khi dùng `for`, hãy xem ba vị trí riêng biệt. Cùng một grid chữ, chỉ có `offset` thay đổi.",
        executedNote: "Dòng 1–2 là phần chuẩn bị bảng đèn đã quen thuộc.",
        executedLines: [1, 2],
        continueScene: true,
        code: [
          "from light_board import start_board, text_grid, show_grid",
          "start_board()",
          'message = text_grid("HI")',
          'show_grid(message, offset=20, color="cyan")',
          'show_grid(message, offset=24, color="cyan")',
          'show_grid(message, offset=28, color="cyan")',
        ],
        steps: [
          { line: 3, explain: "Dòng 3 đổi chữ `HI` thành một grid gồm số 1 và số 0. Chưa có gì hiện lên cho đến khi gọi `show_grid()`.", memory: "message đang giữ grid của hai chữ H và I." },
          { line: 4, explain: "Dòng 4 hiển thị grid với `offset = 20`. Chữ bắt đầu đi vào từ phía bên phải.", action: { action: "light_board_grid", grid: [[1,0,1,0,1,1,1],[1,0,1,0,0,1,0],[1,1,1,0,0,1,0],[1,0,1,0,0,1,0],[1,0,1,0,1,1,1]], offset: 20, color: "cyan" }, observeMs: 1800, memory: "Frame 1: chữ ở gần bên phải." },
          { line: 5, explain: "Dòng 5 tăng `offset` lên 24. Grid không đổi, nhưng vị trí nhìn đã dịch sang trái.", action: { action: "light_board_grid", grid: [[1,0,1,0,1,1,1],[1,0,1,0,0,1,0],[1,1,1,0,0,1,0],[1,0,1,0,0,1,0],[1,0,1,0,1,1,1]], offset: 24, color: "cyan" }, observeMs: 1800, memory: "Frame 2: chữ dịch sang trái." },
          { line: 6, explain: "Dòng 6 dùng `offset = 28`. Khi ba frame được xem nối tiếp, mắt mình cảm thấy chữ đang chạy.", action: { action: "light_board_grid", grid: [[1,0,1,0,1,1,1],[1,0,1,0,0,1,0],[1,1,1,0,0,1,0],[1,0,1,0,0,1,0],[1,0,1,0,1,1,1]], offset: 28, color: "cyan" }, observeMs: 2200, memory: "Frame 3: chữ tiếp tục dịch sang trái." },
        ],
      },
    },
    {
      code: 'from light_board import start_board, text_grid, show_grid, delay\n\nstart_board()\nmessage = text_grid("HI")\noffsets = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]\n\nfor offset in offsets:\n    show_grid(message, offset=offset, color="cyan")\n    delay(0.35)\n',
      label: "bang_chu_chay.py",
      note: "DỰ ÁN CUỐI — GHÉP CÁC FRAME BẰNG FOR\nKhông có INPUT thật; chữ HI, list vị trí và màu cyan đã được gán sẵn. `for` lấy từng `offset`, hiển thị một frame rồi dừng 0,35 giây. Hãy đổi chữ hoặc màu. OUTPUT cần cho thấy toàn bộ chữ dịch từ phải sang trái và từng frame nhìn thấy rõ.",
      expectOut: { all: [/light_board_start/i, /light_board_grid/i, /delay/i, { minLines: 25 }] },
      solution: 'from light_board import start_board, text_grid, show_grid, delay\n\nstart_board()\nmessage = text_grid("MAGIC")\noffsets = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]\n\nfor offset in offsets:\n    show_grid(message, offset=offset, color="magenta")\n    delay(0.35)\n',
    },
    {
      remember: [
        "Một lời gọi `place_bulb()` lắp một bóng.",
        "`for x in positions` lấy từng vị trí trong list và chạy lại dòng thụt lề.",
        "Đèn chớp là chuỗi frame sáng–chờ–tối–chờ.",
        "Grid gồm hàng và cột; nhiều frame có `offset` khác nhau tạo thành chữ chạy.",
      ],
    },
  ],
};
