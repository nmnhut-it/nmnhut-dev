// node04v2.js — PEDAGOGY V2 PILOT CLONE of node04.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson04v2.html, also reachable via dev-test.html?src=node04v2.
// `index` matches node04.js (4) — this is an alternate for the SAME map stop,
// not a new node.
export default {
    index: 4,
    title: 'Rules: if & elif',
    subtitle: 'một cỗ máy, NHIỀU luật — if rồi elif rồi elif',
    bundle:  { art: 'assets/future-packet.webp', name: 'RULE PACKET' },
    machine: { art: 'assets/future-machine.webp', name: 'ELIF MODULE', blurb: 'module gắn thêm cho FUTURE MACHINE — nhiều luật if/elif nối tiếp nhau, chọn đúng nhánh đầu tiên khớp' },
    modules: { old_computer: '../py/old_computer/__init__.py', camera_charm: '../py/camera_charm/__init__.py' },
    cells: [
      { npc: "Cỗ máy tương lai đã biết đọc tay và tạo OUTPUT thật. Trước khi dạy nó biết chờ đúng số ngón, Pip kiểm tra lại Node 03 một chút nhé." },
      { quiz: { title: 'Ôn camera thật', questions: [
        { q: 'Trong Node 03, lệnh nào đọc camera và trả về số ngón tay bạn đang giơ?', a: ['`watch()`', '`display()`', '`say_num()`'], correct: 0 },
        { q: 'Nếu `finger = 4` rồi chạy `display(finger)`, số 4 xuất hiện ở đâu?', a: ['Trên màn hình AR/camera', 'Trong ô nhập bàn phím', 'Trong tên biến `finger`'], correct: 0 },
        { q: '`fire_vortex()` là loại gì trong bài trước?', a: ['OUTPUT tạo hiệu ứng lửa ngay khi chạy', 'INPUT đọc số ngón tay', 'Lệnh hỏi chữ từ bàn phím'], correct: 0 },
      ] } },
      { npc: "Máy giờ đã thấy tay bạn và làm phép NGAY mỗi lần chạy — nhưng nó làm MỌI THỨ, mọi lúc. Muốn nó CHỈ phóng lửa KHI bạn giơ đúng 1 ngón thôi? Cần dạy máy một LUẬT." },
      { npc: "Trước khi gắn luật vào camera thật, mình tập trên GIẤY đã — dùng `finger` GIẢ thay cho mắt máy. Một luật dùng `if` nghĩa là: nếu điều kiện này đúng, thì làm việc kia." },
      { code: 'from old_computer import say\n\nfinger = 0            # ← finger giả (chưa có camera)\n\nif finger == 1:\n    say("✨ LỬA!")\n',
        label: 'rule_on_paper.py', note: 'RUN nguyên như vậy trước. Code này chưa in gì vì `finger` đang là 0, còn luật chỉ chạy khi `finger == 1`.', expectOut: { minLines: 0 },
        solution: 'from old_computer import say\n\nfinger = 0\n\nif finger == 1:\n    say("✨ LỬA!")\n' },
      { npc: "Nó im re luôn. Chuẩn rồi! Luật đã được kiểm tra — nhưng finger đang là 0, nên điều kiện finger == 1 là FALSE (sai). Luật chỉ chạy khi if của nó là TRUE (đúng) thôi." },
      { npc: "Vẫn là luật đó đây. Lần này bạn hãy biến nó thành TRUE nhé: đổi 0 thành 1, rồi bấm RUN nào." },
      { code: 'from old_computer import say\n\nfinger = 0            # ← đổi finger từ 0 thành 1 — điều kiện sẽ TRUE\n\nif finger == 1:\n    say("✨ LỬA!")\n',
        label: 'make_it_true.py', note: 'đổi 0 thành 1, rồi RUN', expectOut: /lửa/i,
        solution: 'from old_computer import say\n\nfinger = 1\n\nif finger == 1:\n    say("✨ LỬA!")\n' },
      { checkpoint: { text: 'Một `if` chỉ chạy phần bên trong khi điều kiện của nó là TRUE — đổi `finger` từ 0 thành 1 làm `finger == 1` chuyển từ FALSE sang TRUE, và luật mới chạy.' } },
      { quiz: { title: 'Đúng mới chạy', questions: [
        { q: '`finger = 1` và điều kiện của luật là `finger == 1` — luật này có chạy không?', a: ['Có, vì 1 == 1 đúng', 'Không', 'Không biết được'], correct: 0 }
      ] } },
      { npc: "✨ LỬA! — luật đã chạy rồi, vì bạn vừa làm cho ĐIỀU KIỆN if trở thành đúng đấy. Soi kỹ điều kiện của luật nhé: if finger == 1 — dấu == là để hỏi *có bằng nhau không?" },
      { npc: "*, khác với MỘT dấu = là để gán giá trị vào biến nha. Còn hai chi tiết bé xíu nữa mà Python cực kỳ kỹ tính: dòng điều kiện luôn kết thúc bằng dấu hai chấm :," },
      { npc: "và dòng bên trong phải thụt sang PHẢI, tạo thành khối thụt lề nằm BÊN TRONG luật. Nhớ kỹ những dấu này nhé!" },
      { remember: [
        'if đặt một ĐIỀU KIỆN — chỉ chạy khi điều kiện là TRUE',
        'dòng điều kiện kết thúc bằng dấu hai chấm :',
        'dòng bên trong thụt PHẢI — tạo thành khối thụt lề',
        '== dùng để hỏi *có bằng nhau không?* · = dùng để gán giá trị',
      ] },
      { checkpoint: { text: 'Dòng `if ...` luôn kết thúc bằng dấu hai chấm `:`, dòng bên trong phải thụt sang phải (khối thụt lề), và `==` (hỏi điều kiện bằng nhau) khác với `=` (gán giá trị).' } },
      { quiz: { title: 'Cuối dòng if', questions: [
        { q: 'Dòng `if finger == 1` còn thiếu gì ở cuối?', a: ['dấu chấm `.`', 'dấu hai chấm `:`', 'dấu cộng `+`'], correct: 1 }
      ] } },
      { npc: "Luật chỉ đơn giản vậy thôi: một điều kiện, và việc sẽ làm khi điều kiện đó đúng. Giờ gắn luật này vào camera THẬT nhé — bạn đã có CAMERA CHARM rồi, watch() và fire_vortex() cũng học rồi." },
      { npc: "Bấm RUN, giơ MỘT ngón tay lên và giữ yên nào." },
      { code: 'from camera_charm import watch, fire_vortex\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()         # ✨ bụi phép xoáy lại rồi phóng LỬA\n',
        label: 'real_rule.py', note: 'giơ 1 ngón tay ☝', expect: 1, expectOut: /fire/i,
        solution: 'from camera_charm import watch, fire_vortex\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\n' },
      { quiz: { title: 'Lửa có điều kiện', questions: [
        { q: 'watch() trả về 1. Máy chạy đoạn này:\n```python\nif finger == 1:\n    fire_vortex()\n```\nMáy có phóng lửa không?', a: ['Có, vì `finger == 1` là TRUE', 'Không', 'Không biết được'], correct: 0 }
      ] } },
      { npc: "Nhớ nè: viết sai mật ngữ là dễ bị thương lắm đó! Mỗi lần bấm RUN mà lệnh chưa chuẩn, máy sẽ BÁO LỖI ngay — hãy đọc thật kỹ để sửa chứ đừng đoán mò nha." },
      { npc: "Giờ Pip sẽ hướng dẫn bạn xử lý một lỗi rất quen thuộc: có một luật đang bị nứt. Nhấn RUN đi, máy sẽ chỉ cho bạn chỗ bị nứt ngay." },
      { npc: "Gợi ý nè: điều kiện của luật luôn luôn kết thúc bằng một dấu nhỏ xíu." },
      { code: 'from camera_charm import watch, fire_vortex\n\nfinger = watch()\n\nif finger == 1\n    fire_vortex()\n',
        label: 'cracked_rule.py', note: 'chữa luật rồi RUN', expect: 1, expectOut: /fire/i,
        solution: 'from camera_charm import watch, fire_vortex\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\n' },
      { npc: "Chính là dấu hai chấm : — luật nào cũng phải kết thúc bằng nó. Bạn vá vết nứt gọn ghê! Bạn vừa dạy cỗ máy MỘT luật: một ngón tay thì phóng lửa." },
      { npc: "Nhưng cỗ máy tương lai thừa sức nhớ NHIỀU luật cùng lúc đấy! Mở gói quà mới ra đã, rồi mình dạy nó thêm những luật kế tiếp nhé." },
      { gift: { art: 'assets/scroll-of-light.webp', name: 'SCROLL OF LIGHT', blurb: 'lệnh mới cho luật của bạn: `lighten()` — làm màn hình sáng bừng lên' } },
      { npc: "lighten() là của bạn rồi đó — một lệnh mới tinh mà máy sẽ nghe theo. Có từ mới thì cần luật mới; chúng mình thêm một nhánh `elif` nữa nhé." },
      { npc: "`elif` nghĩa là: nếu luật phía trên chưa đúng, máy thử thêm điều kiện này." },
      { npc: "Hãy làm cho BA ngón tay khiến màn hình SÁNG lên — bỏ comment ở hai dòng đó (bằng cách xóa các dấu #), bấm RUN hai lần và thử cả hai số ngón xem sao." },
      { npc: "(Bạn thắc mắc sao không dùng hai ngón à? ✌ là để dành cho tiếng chụp của bùa chú rồi — một kiểu giơ tay chỉ nên dùng cho một việc thôi. )" },
      { code: 'from camera_charm import watch, fire_vortex, lighten\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\n# lượt của bạn: thêm nhánh cho 3 ngón tay\n# trong nhánh đó, gọi lệnh làm sáng màn hình\n',
        label: 'two_rules.py', note: 'làm cho 3 ngón tay khiến màn hình sáng lên', expect: [1, 3], expectOut: { 1: /fire/i, 3: /light/i },
        solution: 'from camera_charm import watch, fire_vortex, lighten\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\n' },
      { remember: "`elif` = thử thêm một ĐIỀU KIỆN khi các luật phía trên chưa khớp. Dòng luật luôn kết thúc bằng `:` và khối lệnh bên trong thụt sang PHẢI." },
      { checkpoint: { text: "`elif` gắn thêm một luật ngay sau `if`: nếu nhánh `if` phía trên sai, máy thử điều kiện trong `elif`. Mỗi nhánh vẫn kết thúc bằng `:` và có khối lệnh thụt vào riêng." } },
      { quiz: { title: 'Thêm luật bằng elif', questions: [
        { q: 'Đã có `if finger == 1`, giờ muốn thêm luật cho `finger == 3` mà không viết `if` lần nữa — dùng từ nào?', a: ['and', '`elif`', '`if`'], correct: 1 }
      ] } },
      { npc: "Một ngón gọi lửa, ba ngón bật sáng — luật nào TRUE thì cỗ máy sẽ làm theo luật đó. Hai luật chạy ngon ơ rồi… giờ là lúc người anh em song sinh xuất hiện —" },
      { gift: { art: 'assets/scroll-of-dark.webp', name: 'SCROLL OF DARK', blurb: 'lệnh song sinh: `darken()` — làm màn hình tối đi' } },
      { npc: "Giờ thử tự xây dựng từ đầu nhé: BA luật, bạn toàn quyền quyết định luôn. Một ngón gọi lửa, ba ngón làm sáng màn hình, bốn ngón làm màn hình tối đi." },
      { npc: "(Nhớ là hai ngón đang để dành cho tiếng ✌ chụp nha. )" },
      { code: 'from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\n# lượt của bạn — viết đủ ba luật:\n#   1 ngón  -> fire_vortex()\n#   3 ngón -> lighten()\n#   4 ngón -> darken()\n',
        label: 'three_rules.py', note: 'viết đủ ba luật', expect: [1, 3, 4], expectOut: { 1: /fire/i, 3: /light/i, 4: /dark/i },
        solution: 'from camera_charm import watch, fire_vortex, lighten, darken\n\nfinger = watch()\n\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n' },
      // ═══ V2 TIMING FIX: this cluster (if/elif/elif covering 1/3/4 ngón)
      // had NO retrieval quiz in v1 before moving on to photo_booth.py — a
      // gap under "new knowledge needs a verifying quiz" (first time the
      // student writes a full 3-branch if/elif/elif unassisted). Added
      // here, right after the exercise it tests. ═══
      { quiz: { title: 'Ba luật cùng lúc', questions: [
        { q: 'Máy có ba luật:\n```python\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\nelif finger == 4:\n    darken()\n```\nBạn giơ 4 ngón tay — máy làm gì?', a: ['`fire_vortex()` chạy, vì luật đầu tiên luôn được ưu tiên', '`darken()` chạy, vì máy gặp luật đúng `finger == 4` trước', 'Không luật nào chạy, vì 4 không phải là 1'], correct: 1 }
      ] } },
      // ═══ V2 BADGE: reward for the multi-rule cluster just verified above
      // (task brief said "after the else catch-all cluster" — node04 never
      // teaches `else` (that's node05's GLOSSARY entry); this is the closest
      // equivalent, the catch-all-of-rules if/elif/elif cluster in THIS
      // node — see PEDAGOGY-V2-PLAN.md's note on this reinterpretation). ═══
      { gift: { glyph: '📜', name: 'HUY HIỆU BA LUẬT', blurb: 'phần thưởng cho việc tự viết được `if`/`elif`/`elif` đủ ba luật, mỗi luật ứng với một điều kiện riêng.', badge: true, badgeId: 'huy_hieu_ba_luat' } },
      { npc: "Ba luật, một bàn tay, không nứt chỗ nào. Có quà đây: bùa này giấu một PHOTO BOOTH. Rải bụi bằng ✋, xoáy bụi bằng ☝, rồi ✌ để chụp ảnh." },
      { npc: "Nó sẽ đọc camera liên tục tới khi bạn chụp — cái phép làm nó *lặp đi lặp lại* việc đọc camera, node sau bạn sẽ tự viết. Còn bây giờ, chỉ cần một từ để đánh thức nó:" },
      { code: 'from camera_charm import photo_booth\n\nphoto_booth()         # ✋ rải · ☝ xoáy · ✌ chụp!\n',
        label: 'photo_booth.py', note: 'tạo dáng đi nào — ✋ rải bụi, ☝ xoáy bụi, rồi ✌ chụp để kết thúc', expectOut: /capture/i,
        solution: 'from camera_charm import photo_booth\n\nphoto_booth()\n' },
      { npc: "Nhìn bạn kìa — phù thủy trong ảnh, phủ đầy bụi phép do chính tay mình rải. Lưu lại đi!" },
      { npc: "Nãy giờ mỗi số ngón chỉ tạo hiệu ứng — giờ mình thử để mỗi lần làm đúng thì TÍCH ĐIỂM vào một biến nhé." },
      { npc: "Đó là mẹo cuối trước khi ra trận: biến có thể tự CỘNG DỒN vào CHÍNH NÓ. `damage = damage + 1` nghĩa là: LẤY giá trị `damage` hiện tại, CỘNG thêm 1, rồi gán lại vào chính `damage`." },
      { npc: "Nghe hơi vòng vòng (tự nhắc tới chính mình) — nhưng chạy từng dòng một là hiểu liền. RUN thử xem." },
      { code: 'from old_computer import say_num\n\ndamage = 0              # input — điểm khởi đầu\ndamage = damage + 1     # process — cộng dồn\ndamage = damage + 1     # process — cộng dồn tiếp\ndamage = damage + 1     # process — và tiếp nữa\nsay_num(damage)          # output\n',
        label: 'cong_don.py', note: 'RUN xem damage cộng dồn tới bao nhiêu', expectOut: /^3$/,
        solution: 'from old_computer import say_num\n\ndamage = 0\ndamage = damage + 1\ndamage = damage + 1\ndamage = damage + 1\nsay_num(damage)\n' },
      { remember: '`damage = damage + 1` = LẤY giá trị cũ, CỘNG thêm, rồi gán lại vào chính biến đó.' },
      { checkpoint: { text: '`damage = damage + 1` lấy giá trị hiện tại của `damage`, cộng thêm 1, rồi gán lại cho chính `damage` — chạy dòng đó N lần thì `damage` tăng thêm N.' } },
      { quiz: { title: 'Cộng dồn', questions: [
        { q: '`damage = 0`, rồi chạy `damage = damage + 1` hai lần liên tiếp — `damage` bây giờ là bao nhiêu?', a: ['0', '1', '2'], correct: 2 }
      ] } },
      { npc: "Trước khi vào cổng, ghé LÒ RÈN với HUY HIỆU BA LUẬT đã nhận nào — Pip sẽ hỏi lại vài câu về if/elif, trả lời đúng là lửa đủ nóng để rèn ra một quả BOM MẬT NGỮ." },
      { npc: "Chính quả bom ấy mới hạ được RẮN CÚ PHÁP đó!" },
      // BOSS CONCEPT V2 migration (FORGE-PLAN.md "FINALIZED"): the legacy
      // rounds[] quiz/code checks move IN HERE as the forge trial — code-fix
      // rounds (if_crack/flat_rule/elif_crack) become "what's the bug"
      // multiple-choice (forge.quiz only supports q/a/correct, no live code
      // execution); the old gesture finisher round (mat_ngu_ket_lieu, 1→2→
      // 3→4→5 combo) is RETIRED — the new KO boss replaces it outright with
      // its own ☝ aim → ✋ unleash gesture (boss-fight.js#buildKoDom).
      { forge: { quiz: [
        { q: 'Trong một luật, `==` dùng để…', a: ['hỏi có bằng nhau không?', 'gán cho bằng', 'thêm phép'], correct: 0 },
        { q: 'Luật `if finger == 3` (thiếu gì đó ở cuối dòng) khiến máy báo lỗi cú pháp. Thiếu gì?', a: ['Thiếu dấu hai chấm `:` ở cuối dòng `if`', 'Thiếu dấu chấm than', 'Thiếu chữ HOA'], correct: 0 },
        { q: 'Đọc đoạn bị nứt này:\n```python\nif finger == 3:\nsay("TẤN CÔNG!")\n```\nDòng `say("TẤN CÔNG!")` đang sát lề trái, không thụt vào. Máy báo lỗi gì?', a: ['Dòng này phải thụt lề vào BÊN TRONG luật `if`', 'Dòng này bị thiếu dấu nháy', 'Không có gì sai cả'], correct: 0 },
        { q: '`elif` nghĩa là…', a: ['kết thúc luật', 'hoặc nếu — hỏi tiếp', 'luôn làm việc này'], correct: 1 },
        { q: 'Nhánh `elif finger == 3` cũng báo lỗi cú pháp y như `if` — vì sao?', a: ['`elif` cũng phải kết thúc bằng dấu hai chấm `:`', '`elif` không được dùng sau `if`', '`elif` phải viết HOA'], correct: 0 },
        { q: 'Máy có hai luật:\n```python\nif finger == 1:\n    fire_vortex()\nelif finger == 3:\n    lighten()\n```\nGiơ ✋ 5 ngón thì máy làm gì?', a: ['Không luật nào chạy — 5 đâu khớp 1 hay 3', 'Máy tự phun lửa'], correct: 0 },
        { q: '`damage = 0`, rồi chạy `damage = damage + 1` BA lần liên tiếp — `damage` bằng bao nhiêu?', a: ['0', '1', '3'], correct: 2 },
      ] } },
      { npc: "Phong ấn phía trước đang cuộn chặt." },
      { npc: "RẮN CÚ PHÁP không cần qua từng câu hỏi nữa — bạn chỉ cần GIƠ NGÓN TRỎ ☝ ngắm thẳng vào nó cho chắc tay, rồi ĐẬP TAY ✋ để phóng BOM MẬT NGỮ." },
      { npc: "Một phát là phong ấn nó luôn! (Chưa có bom thì quay lại LÒ RÈN rèn thêm đã nhé. )" },
      { boss: { name: 'THE SYNTAX SERPENT', sheet: { src: 'assets/syntax-serpent-sheet.webp' }, art: 'assets/syntax-serpent.webp', glyph: '🐍', ko: true } },
      { npc: "Con rắn tan sạch thành bụi — cổng mở rồi.\nĐường phía trước còn đang hiện ra, và phong ấn đã khắc xong trong cú nổ BOM MẬT NGỮ." }
    ],
    ritual: { gesture: '✋', prompt: 'Đập tay với camera để niêm phong giao kèo',
      choice: { q: 'Muốn nối thêm một luật CÓ ĐIỀU KIỆN mới vào sau `if`, dùng từ khóa nào?', a: ['else', '`elif`', 'and'], correct: 1 },
      theme: { motion: 'spiral-in', palette: { core: '#78b2a5', dust: '#78b2a5', rune: '#f4c85a' }, glyphs: '`if`' } }
  }
