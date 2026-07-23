export default {
    index: 3,
    title: 'Input and Output',
    subtitle: 'INPUT biết thay đổi — cỗ máy này NHÌN thấy tay bạn',
    bundle:  { art: 'assets/future-packet.webp', name: 'FUTURE PACKET' },
    machine: { art: 'assets/future-machine.webp', name: 'FUTURE MACHINE', blurb: 'camera vào · phép hiện ra' },
    modules: { old_computer: '../py/old_computer/__init__.py', camera_charm: '../py/camera_charm/__init__.py' },
    cells: [
      { npc: "Chào mừng tới cỗ máy tương lai! Nó chẳng có bàn phím đâu — thay vào đó, nó có một con MẮT (camera) nhìn tay bạn và ĐẾM xem bạn đang giơ mấy ngón tay." },
      { npc: "Con số đó cần một chỗ để CẤT — mình sẽ dùng một biến tên là `finger`, y hệt mấy cái hộp bạn từng dùng ở hai bài trước." },
      { quiz: { title: 'Ôn lại bài cũ', questions: [
        { q: 'Biến `weather = "nắng"`, sau đó bạn gán lại `weather = "mưa"` — giá trị của `weather` bây giờ là gì?', a: ['nắng', 'mưa', 'cả hai'], correct: 1 },
        { q: 'Muốn hỏi rồi nhận một SỐ để tính toán (không phải chuỗi), dùng lệnh nào?', a: ['`read()`', '`read_num()`', '`say()`'], correct: 1 },
        { q: '`say_num(9)` sẽ làm gì?', a: ['In ra số 9', 'Hỏi người dùng nhập số 9', 'Cộng thêm 9 vào biến'], correct: 0 },
      ] } },
      { npc: "Mắt máy còn đang ngủ, nên mình tập trước với một con số GIẢ đã — cứ coi `finger` như bao biến khác thôi, không có gì mới ngoài cái TÊN." },
      { npc: "Bấm RUN, rồi thử đổi số 3 thành số khác và RUN lại xem." },
      { code: 'from old_computer import say_num\n\nfinger = 3      # ← số giả, chưa có camera — đổi thử số khác rồi RUN lại\nsay_num(finger)\n',
        label: 'finger_var.py', note: 'ĐỀ BÀI (bài mẫu)\nBấm RUN xem máy in ra 3 trước đã — rồi thử đổi 3 thành số khác và RUN lại, số in ra sẽ đổi theo.', expectOut: /^\d+$/,
        solution: 'from old_computer import say_num\n\nfinger = 3\nsay_num(finger)\n' },
      { checkpoint: { text: '`finger` là một biến bình thường — gán số vào, đổi số, rồi `say_num(finger)` in ra giá trị hiện tại, y hệt mọi biến bạn đã dùng, chỉ khác cái TÊN.' } },
      { quiz: { title: 'Vẫn chỉ là một cái hộp', questions: [
        { q: '`finger = 4`, rồi chạy `say_num(finger)` — máy in ra gì?', a: ['finger', '4', 'báo lỗi'], correct: 1 }
      ] } },
      { npc: "Tập trên giấy xong rồi — giờ đánh thức con mắt thật của cỗ máy nào. Tặng bạn nè —" },
      { gift: { art: 'assets/photo-charm.webp', name: 'CAMERA CHARM', blurb: "con mắt của cỗ máy — dùng để đếm số ngón tay của bạn" } },
      { npc: "CAMERA CHARM — mắt máy đã tỉnh giấc rồi! Lệnh của nó là watch(): nó nhìn cho tới khi tay bạn đứng yên, rồi cho mình số ngón tay — y hệt cách `finger = 3` gán một số," },
      { npc: "chỉ khác ở chỗ lần này con số đến từ CAMERA thật. Bấm RUN, giơ vài số ngón tay khác nhau và giữ yên mỗi lần để xem số đổi theo tay bạn." },
      { code: 'from old_computer import say_num\nfrom camera_charm import watch\n\nfinger = watch()      # input — máy NHÌN camera, trả về số ngón tay THẬT\nsay_num(finger)        # output — in đúng số đó ra\n',
        label: 'watch_print.py', note: 'giơ 1, rồi 3, rồi 5 ngón tay — mỗi lần giữ yên rồi RUN', expect: [1, 3, 5], expectOut: { 1: /^1$/, 3: /^3$/, 5: /^5$/ },
        solution: 'from old_computer import say_num\nfrom camera_charm import watch\n\nfinger = watch()\nsay_num(finger)\n' },
      { checkpoint: { text: '`watch()` là INPUT thật — gọi nó sẽ TRẢ VỀ số ngón tay đếm được qua camera; chương trình chỉ IN nó ra bằng `say_num()`, chưa cần quyết định gì thêm.' } },
      { quiz: { title: 'Tay thật', questions: [
        { q: 'Khi bạn giơ 2 ngón tay trước camera — cỗ máy dùng lệnh nào để đọc camera?', a: ['`watch()`', '`say()`', '`fire_vortex()`'], correct: 0 }
      ] } },
      { npc: "OUTPUT của cỗ máy tương lai không chỉ là chữ trên console đâu. fire_vortex() phóng LỬA thật — chạy nó là bụi phép tụ lại, xoáy thành vòng, rồi phóng ra ngay, không cần hỏi gì cả." },
      { npc: "display(v) thì hiện con số v ngay trên màn hình AR, y như say_num() nhưng hiện lên bằng hình chứ không phải chữ." },
      { code: 'from camera_charm import fire_vortex\n\nfire_vortex()   # output — chạy dòng này là phóng lửa NGAY, không cần điều kiện gì\n',
        label: 'always_fire.py', note: 'RUN xem — không cần giơ tay gì cả, máy phóng lửa liền', expectOut: /fire/i,
        solution: 'from camera_charm import fire_vortex\n\nfire_vortex()\n' },
      { code: 'from camera_charm import watch, display\n\nfinger = watch()       # input\ndisplay(finger)         # output — hiện số ngón tay ngay trên màn hình AR\n',
        label: 'display_finger.py', note: 'giơ 1, rồi 4 ngón tay, giữ yên rồi RUN', expect: [1, 4], expectOut: { 1: /^1$/, 4: /^4$/ },
        solution: 'from camera_charm import watch, display\n\nfinger = watch()\ndisplay(finger)\n' },
      { checkpoint: { text: 'OUTPUT không chỉ là chữ: `fire_vortex()` phóng lửa, `display(v)` hiện số ngay trên màn hình AR — cả hai chạy là làm NGAY, không cần hỏi han gì cả.' } },
      { quiz: { title: 'Hiện lên màn hình', questions: [
        { q: 'Muốn số ngón tay hiện NGAY trên màn hình AR (không phải chỉ in ra console), dùng lệnh nào?', a: ['`say_num()`', '`display()`', '`watch()`'], correct: 1 }
      ] } },
      { npc: "INPUT: tay bạn qua watch(). OUTPUT: số hiện lên bằng display(), hoặc lửa phun ra bằng fire_vortex()." },
      { npc: "Con quái giữ cổng phía trước chuyên bắt bẻ ai lẫn lộn INPUT/OUTPUT — trả lời đúng và đoạn code chạy đúng thì nó mới chịu tan. Hạ được nó rồi đập tay ✋ ăn mừng nha!" },
      { boss: { name: 'THE MIRROR WRAITH', sheet: { src: 'assets/mirror-wraith-sheet.webp' }, art: 'assets/mirror-wraith.webp', glyph: '🪞',
        hp: 500, // generously high so every round is reachable regardless of streak play — mat_ngu_ket_lieu is a `finisher` round (see boss-fight.js#strike) that ALWAYS ends the fight on a clean hit, so exact HP tuning against cumulative damage no longer matters, just "enough to not die before getting there"
        baseDmg: 20, streakMul: [1, 1.5, 2], heal: 10, hearts: 3,
        rounds: [
          { q: 'Muốn hỏi rồi nhận một CHUỖI (không tính toán được), dùng lệnh nào?', a: ['`read()`', '`read_num()`', '`watch()`'], correct: 0 },
          { q: 'Muốn hỏi rồi nhận một SỐ để tính toán, dùng lệnh nào?', a: ['`read()`', '`read_num()`', '`say()`'], correct: 1 },
          { code: 'from old_computer import say_num\n\nsay_num(7\n', label: 'strike.py', note: 'thiếu gì đó ở cuối dòng — chữa rồi RUN', dmg: 30, expectOut: /^7$/, solution: 'from old_computer import say_num\n\nsay_num(7)\n' },
          { q: 'Muốn máy đọc camera và đếm số ngón tay bạn đang giơ, dùng lệnh nào?', a: ['`read_num()`', '`watch()`', '`say()`'], correct: 1 },
          { code: 'from camera_charm import watch\nfrom old_computer import say_num\n\nfinger = watch()\nsay_num(finger)\n', label: 'watch_strike.py', note: 'giơ 2 ngón tay, giữ yên, RUN để STRIKE', dmg: 30, expect: 2, expectOut: /^2$/, solution: 'from camera_charm import watch\nfrom old_computer import say_num\n\nfinger = watch()\nsay_num(finger)\n' },
          { q: '`display(finger)` khác `say_num(finger)` ở chỗ nào?', a: ['display() hiện lên màn hình AR, say_num() in ra console', 'giống hệt nhau, đổi tên thôi', 'display() chỉ dùng cho chữ, không dùng cho số'], correct: 0 },
          {
            code: 'from camera_charm import watch, display, fire_vortex\n\nfinger = watch()       # input — giơ ✋ 5 ngón, giữ yên cho máy đếm\ndisplay(finger)         # output — hiện số ngón tay trên màn hình AR\nfire_vortex()           # output — và phóng lửa luôn, không cần hỏi gì thêm\n',
            label: 'mat_ngu_ket_lieu.py',
            note: 'MẬT NGỮ KẾT LIỄU: giơ ✋ 5 ngón, giữ yên cho máy đếm — watch() đọc số, display() hiện lên, fire_vortex() phóng lửa, cả ba chạy liền một mạch. Đây là ĐÒN KẾT LIỄU, hạ gục con quái ngay!',
            dmg: 50,
            finisher: true,
            expect: 5,
            expectOut: { all: [/5/, /fire/i] },
            solution: 'from camera_charm import watch, display, fire_vortex\n\nfinger = watch()\ndisplay(finger)\nfire_vortex()\n',
          },
        ] } },
      { npc: "Con quái tan sạch thành bụi — cổng mở rồi.\nTay bạn là INPUT thật, lửa và con số hiện lên là OUTPUT thật. Niêm phong giao kèo nào!" }
    ],
    ritual: { gesture: '✋', prompt: 'Đập tay với camera để niêm phong giao kèo',
      choice: { q: 'Cỗ máy tương lai ĐẾM số ngón tay bạn giơ bằng lệnh nào?', a: ['watch', 'say', 'read'], correct: 0 },
      theme: { motion: 'orbit', palette: { core: '#78b2a5', dust: '#d9eee5', rune: '#f4c85a' }, glyphs: 'watch' } }
  }
