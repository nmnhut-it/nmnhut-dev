# Content Audit — Node00–Node06 (độ nặng & độ hấp dẫn)

Báo cáo này CHỈ đọc dữ liệu (`lessons/content/node00.js`…`node06.js`, `AUTHORING.md`, root `CLAUDE.md`) — không sửa file nào khác. Số liệu được tính bằng script đếm cell/từ chạy trực tiếp trên các file `.js`, không phải ước lượng bằng mắt.

## Phương pháp & giả định (đọc trước khi xem số)

- **Tốc độ đọc**: trẻ ~130 từ/phút tiếng Việt (đọc chậm, có thể vừa đọc vừa nghe Pip).
- **Code cell "chỉ RUN"**: ~25s (đọc đề + bấm RUN + xem kết quả).
- **Code cell "phải sửa/gõ"** (`your turn`, `sửa`, `thêm`, `đổi` xuất hiện trong code/note): ~50s (đọc + gõ + debug + RUN lại).
- **Câu hỏi quiz**: ~18s/câu (đọc + chọn/gesture).
- **Boss round dạng Q&A**: ~15s; **boss round dạng code**: ~35s (ngắn hơn code cell thường vì đã quen bối cảnh).
- **remember / gift / widget / cameo**: ~8s (đọc nhanh / chiêm ngưỡng).
- **ritual**: ~10s.
- **Streak thụ động (passive streak)**: chuỗi liên tiếp các cell KHÔNG cần tương tác (`npc`, `remember`, `gift`, `cameo`) không bị chen bởi cell tương tác (`code`, `quiz`, `widget`, `boss`).
- **Mật độ tương tác (interaction density)** = (số cell/round tương tác: code + câu hỏi quiz + boss round) ÷ số phút hoàn thành ước tính.

## Bảng tổng hợp (summary table)

| Node | Cell count (theo type) | Tổng từ NPC | Passive streak dài nhất | Code: tổng / phải sửa | Quiz: câu hỏi / gesture-biến thể | Boss: round / code-round | Ước tính thời gian | Mật độ tương tác |
|---|---|---|---|---|---|---|---|---|
| **00** | npc 6, code 1, quiz 3, remember 2, widget 1, cameo 1 (14 cell) | 296 | **3** (cameo,npc,npc) | 1 / 0 | 3 / **1** (track) | 0 / 0 | ~4.3 phút | 1.16/phút |
| **01** | npc 10, code 6, quiz 6, remember 1 (23 cell) | 468 | 3 | 6 / 5 | 6 / 0 | 0 / 0 | ~10.3 phút | 1.17/phút |
| **02** | npc 6, code 4, quiz 4, boss 1, remember 2 (17 cell) | 392 | 2 | 4 / 2 | 5 / **1** (swipe, trong boss) | **17** / 6 | ~13.7 phút | **1.90/phút** |
| **03** | npc 17, code 9, quiz 6, boss 1, gift 3, remember 4 (40 cell) | **1231** | **4** (npc,npc,remember,npc) | 9 / 2 | 6 / 0 | 10 / 5 | **~21.1 phút** | 1.18/phút |
| **04** | npc 13, code 8, quiz 4, boss 1, gift 2, remember 2 (30 cell) | 572 | 3 | 8 / 2 | 6 / 0 | 9 / 4 | ~14.65 phút | 1.57/phút |
| **05** | npc 12, code 8, quiz 4, boss 1, gift 1, remember 1 (27 cell) | 821 | 3 | 8 / 4 | 7 / 0 | 8 / 4 | ~17.2 phút | 1.34/phút |
| **06** | npc 13, code 5, quiz 4, boss 1, gift 1, remember 2 (26 cell) | 796 | 3 | 5 / 2 | 6 / 0 | 7 / 3 | ~14.15 phút | 1.27/phút |

**Tổng cả game (Node00–06)**: ~150 cell nội dung, ~4576 từ NPC, ~95 phút cho một học sinh đọc chậm đi từ đầu tới cuối (chưa tính thời gian gõ code thật/loay hoay debug thực tế — con số này gần như chắc chắn là CẬN DƯỚI).

## Vi phạm rõ so với luật đã đề ra (AUTHORING.md / CLAUDE.md)

- **NPC cell > ~40 từ** (ngưỡng gợi ý): Node00 có 2/6 cell vi phạm; Node01 có 5/10; **Node02 có 6/6 — bao gồm 1 cell dài 123 từ** (cell #8, đoạn giới thiệu "MẬT NGỮ lập trình" trước 3 case lỗi liên tiếp); **Node03 có 14/17 cell vi phạm — gần như MỌI cell npc của node đều dài hơn ngưỡng**, đỉnh điểm 124 từ (cell #20) và 109/107/104 từ (cell #9, #24, #38); Node04 6/13; Node05 12/12 (100%); Node06 10/13.
- **>2 cell npc liên tiếp không tương tác xen giữa**: Node03 vi phạm rõ nhất — 4 cell liên tiếp ngay ĐẦU node (`npc → npc → remember → npc`, cell #1–#4, tổng ~166 từ) trước khi học sinh chạm vào bất kỳ tương tác nào.
- **Boss > 8 round**: **Node02 có 17 round** (gấp hơn 2 lần ngưỡng), Node03 có 10, Node04 có 9 — cả ba vượt ngưỡng; Node05 đúng ngưỡng (8); chỉ Node06 (7) và Node00/01 (không có boss riêng — Node00/01 dùng chung 1 boss ở Node02) nằm trong ngưỡng.
- **Quiz lặp cùng một khái niệm ngay sau khi vừa hỏi**: xem phần Node02 bên dưới — nhiều boss round hỏi lại đúng thứ quiz "Số thật" / các quiz INPUT-OUTPUT đã hỏi trước đó trong node hoặc ở Node00/01.

## Phân tích từng node

### Node00 — Anatomy of a Machine (nhẹ nhất, ổn định)
Ngắn, mật độ tương tác thấp vừa phải nhưng chấp nhận được vì đây là node mở màn. Điểm cộng: có 1 câu quiz dùng gesture `track` (đuổi chữ trôi) — điểm sáng hiếm hoi phá vỡ lối "giữ ngón tay" mặc định. Cell #5 (80 từ, giải thích INPUT→PROCESS→OUTPUT qua 3 ví dụ điện thoại/game/robot) hơi dài nhưng có giá trị sư phạm (ví dụ cụ thể). "Wow moment" đầu tiên (chạy code) tới ở cell #9/14 — khá trễ so với tổng độ dài node, và đó cũng chỉ là `say()` in console, chưa có VFX thật.

### Node01 — Words (dài, đơn điệu tương tác)
23 cell, không có boss riêng (dùng chung boss Node02), không có widget/gift, KHÔNG có bất kỳ câu hỏi gesture-biến thể nào — toàn bộ 6 quiz đều là "giữ ngón tay bấm nút" mặc định. 5/6 code cell yêu cầu sửa/gõ thật — tỷ lệ gõ tay cao nhất trong các node đầu. Cell #20 (77 từ) và #14 (58 từ) là các lecture dài về phép ghép chuỗi. Không có VFX/camera nào cả node (đúng vì đây vẫn là "Old Computer") — nên toàn bộ 10.3 phút của node chỉ là console text, không có khoảnh khắc hình ảnh nào.

### Node02 — Numbers (⚠️ NẶNG NHẤT VỀ BOSS, outlier rõ)
Nội dung dạy (11 cell đầu trước boss) khá gọn, nhưng **boss "THE BUG WRAITH" có 17 round** — dài gấp đôi ngưỡng khuyến nghị (8) và gấp đôi các boss khác (7–10 round). Trong 17 round: nhiều round Q&A lặp lại gần y hệt câu hỏi đã hỏi trong quiz "Số thật" ngay phía trên (round 8: "dùng từ nào để hỏi và nhận về một SỐ" — gần như convert 1:1 từ quiz `read_num()/say_num()`), và 3 round liên tiếp (INPUT/OUTPUT của bàn phím/chuột, INPUT của `read()`) đều test lại đúng khái niệm INPUT/PROCESS/OUTPUT đã dạy xong ở Node00 — cảm giác ôn tập kéo dài hơn là thử thách mới. Cell #8 (123 từ, dài nhất toàn bộ 7 node) là đoạn giới thiệu lỗi cú pháp trước khi vào 2 cell sửa lỗi liên tiếp — có thể cắt bớt một nửa. Điểm cộng: có 1 round gesture `swipe` phá được sự đơn điệu.

### Node03 — Input and Output (⚠️ NẶNG NHẤT TOÀN BỘ, outlier rõ nhất)
40 cell, **1231 từ NPC** (gấp 2.6 lần node nặng thứ nhì là Node05), ước tính **~21 phút** hoàn thành — gần gấp đôi các node khác. 14/17 cell npc dài hơn 40 từ (gần như toàn bộ lecture của node vi phạm ngưỡng). Mở đầu bằng 4 cell liên tiếp không tương tác (npc, npc, remember, npc) — vi phạm trực tiếp luật ">2 npc liên tiếp". Đây là node "hợp nhất" nhiều khái niệm lớn cùng lúc (biến, if, ==, gợi ý camera_charm, hai lần gift lồng giữa lecture, elif, `damage = damage + 1`) — nội dung đúng đắn về sư phạm nhưng ôm quá nhiều trong MỘT node, khiến nó dài gần gấp đôi các node còn lại dù interaction density (1.18/phút) không tệ hơn mức trung bình — vấn đề không phải "thiếu tương tác" mà là "quá nhiều nội dung + quá nhiều đọc trước khi được tương tác". Camera/VFX thật (fire_vortex) chỉ xuất hiện ở khoảng giữa node (~cell 20/40) — "wow moment" thật sự tới muộn dù node đã giới thiệu camera_charm từ cell #14 (gift) nhưng vẫn cho học code giả lập một hồi trước khi cho chạm camera thật.

### Node04 — Choices: Else and Everything Else (ổn, VFX sớm)
30 cell, mật độ tương tác cao thứ nhì (1.57/phút) vì thừa hưởng camera_charm sẵn có từ Node03 nên VFX xuất hiện sớm (cell #2 đã gọi camera thật, dù chưa có nhánh khớp). Boss 9 round hơi vượt ngưỡng nhưng không quá đáng. Cấu trúc dạy else → gift → display → phép tính → boss khá mạch lạc, không có streak thụ động nào vượt quá 3.

### Node05 — Boundaries: More or Less (nặng về so sánh, boss đúng ngưỡng)
821 từ NPC (nặng thứ nhì), nhiều lecture về "bug ranh giới" lặp lại cùng một luận điểm qua 3–4 tình huống khác nhau (gate_equal → gate_greater → gate_boundary → gate_at_least là 4 code cell liên tiếp dạy cùng MỘT khái niệm `>` vs `>=`) — về sư phạm là "lặp có chủ đích" (đúng kiểu general → specific → bug → fix) nhưng 4 code cell liên tiếp cùng dạng dễ gây mỏi nếu học sinh đã hiểu từ cell thứ 2. Boss đúng 8 round (chạm ngưỡng, không vượt).

### Node06 — Repeat: The While Loop (nhẹ nhàng nhất trong nhóm 03–06)
796 từ NPC nhưng cấu trúc rải đều hơn, boss chỉ 7 round (trong ngưỡng), code-edit tỷ lệ thấp (2/5) vì phần lớn cell while là "RUN xem điều kỳ diệu" hơn là bắt sửa nhiều. Vẫn toàn bộ tương tác dùng hold-fingers mặc định, không có gesture-biến thể nào trong cả node (giống Node01, 03, 04, 05).

## Rủi ro hấp dẫn xuyên suốt (cross-node)

1. **Đơn điệu động từ tương tác**: trong cả 7 node, chỉ có **2 khoảnh khắc** dùng gesture khác "giữ ngón tay": 1 câu quiz `track` (Node00) và 1 boss round `swipe` (Node02). Node01, 03, 04, 05, 06 — tức 5/7 node — dùng 100% hold-fingers cho mọi tương tác camera. Đây là rủi ro nhàm chán lớn nhất về lâu dài, vì engine đã hỗ trợ sẵn `track`/`swipe` nhưng gần như không được tận dụng thêm.
2. **"Wow moment" tới muộn dần rồi mới sớm lại**: Node00–02 hoàn toàn không có VFX thật (chỉ console text) — "phần thưởng hình ảnh" chỉ tới ở ritual cuối node. Node03 giới thiệu VFX thật nhưng đặt nó ở khoảng giữa node (~cell 20/40). Từ Node04 trở đi VFX xuất hiện sớm hơn nhờ camera_charm có sẵn.
3. **Boss dài không tỷ lệ thuận với node dạy**: Node02 có nội dung dạy ngắn nhất trong nhóm nhưng boss dài nhất (17 round) — lệch pha rõ so với các node khác (nội dung dài thì boss vừa phải).
4. **Node03 là điểm nghẽn rõ ràng**: dài gần gấp đôi mọi node khác về mọi trục (số cell, số từ, thời gian), lại đúng lúc là node giới thiệu nhiều khái niệm nền tảng nhất (biến, if, ==, elif, cộng dồn) — rủi ro học sinh yếu bị quá tải/bỏ cuộc ngay tại node then chốt.

## Đề xuất sửa (tối thiểu, xếp theo impact/effort — CHƯA áp dụng)

| Sửa | Node | Impact | Effort |
|---|---|---|---|
| Tách Node03 thành 2 node (ví dụ: "Node03a: Biến + if/else giả lập" và "Node03b: Camera thật + elif + cộng dồn"), giữ nguyên nội dung, chỉ chia đôi | 03 | Cao — giảm ~21 phút xuống 2×~11 phút, xoá 4-cell passive streak mở đầu bằng cách đặt ritual/gift ở giữa | Trung bình (chia file, không viết nội dung mới) |
| Cắt boss "THE BUG WRAITH" từ 17 round xuống ~8–9: bỏ các round Q&A trùng với quiz "Số thật"/INPUT-OUTPUT đã hỏi ngay phía trên | 02 | Cao — bớt ~5–6 phút lặp, giữ đúng finisher | Thấp (xoá round, không viết mới) |
| Rút ngắn cell #8 (123 từ) của Node02 xuống ~2 câu, tách phần còn lại thành 1 cell `remember` ngắn | 02 | Trung bình | Thấp |
| Thêm 1 câu hỏi `gesture:"track"` hoặc `gesture:"swipe"` vào Node01/04/05/06 (mỗi node ít nhất 1) để phá đơn điệu hold-fingers | 01, 04, 05, 06 | Trung bình (hấp dẫn) | Thấp (đổi field, không cần code engine mới) |
| Gộp bớt 4 code cell liên tiếp cùng dạng `>` vs `>=` (gate_equal→gate_at_least) ở Node05 thành 2–3 cell, giữ nguyên progression sư phạm nhưng bỏ bước lặp yếu nhất | 05 | Thấp–Trung bình | Thấp |
| Chèn 1 widget/gift/mini-VFX ngay sau streak 4-cell mở đầu của Node03 để phá thụt lùi tương tác | 03 | Trung bình | Thấp |

## Top 5 việc nên làm ngay

1. **Tách Node03 làm 2 node** — đây là outlier nặng nhất về mọi chỉ số (1231 từ NPC, 40 cell, ~21 phút, vi phạm streak 4-npc ngay đầu). Impact cao nhất trong toàn bộ audit.
2. **Cắt boss Node02 (BUG WRAITH) từ 17 xuống ~8–9 round**, bỏ các round Q&A trùng lặp với quiz "Số thật"/INPUT-OUTPUT đã hỏi trong cùng node — sửa nhanh (chỉ xoá phần tử mảng), giảm nhàm chán rõ rệt.
3. **Rút ngắn cell #8 của Node02 (123 từ — dài nhất toàn game)** xuống còn ý chính, phần còn lại chuyển thành `remember`.
4. **Thêm gesture-biến thể (`track`/`swipe`) vào ít nhất 1 câu hỏi mỗi Node 01/04/05/06** — hiện 5/7 node dùng 100% hold-fingers, đây là chỗ rẻ nhất (effort thấp) để tăng cảm giác mới mẻ.
5. **Chèn một tương tác (widget/gift/code ngắn) ngay sau streak 4-cell mở đầu của Node03** (trước khi tách node ở mục 1, hoặc như một fix tạm thời nếu chưa tách kịp) để không mở màn node bằng 4 cell đọc liên tục.
