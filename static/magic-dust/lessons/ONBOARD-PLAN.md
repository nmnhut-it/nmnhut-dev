# Onboard mới — "CODE!" — Implementation Plan

Kịch bản/lore chuẩn: `STORY.md` §7 (canon). File này là plan THI CÔNG —
chia phase nhỏ, mỗi phase một commit, duyệt được từng bước (workflow chuẩn
của dự án). Trạng thái: **Phase C ĐÃ BUILD PHẦN LỚN (2026-07-03)** — xem
checklist dưới; Phase A (Pip sheet) + B (clip mới) + C6 (sound) còn lại.

**Đã build (2026-07-03):**
- `engine/chant-match.js` + `test-chant-match.mjs` (23 asserts pass) — khẩu
  quyết một từ "CODE!" nên khớp THEO TỪ: fold dấu, tách từ, pass nếu có từ
  trong bộ chấp nhận (`code/cod/kho/khau/cốt…`) hoặc cách "code" ≤1 ký tự;
  cố tình KHÔNG nhận "co"/"cho" (fold của "có"/"cho" quá phổ biến). (Bản
  matcher chuỗi-nguyên-âm cho khẩu quyết dài nằm trong git history.)
- `onboard.js` viết lại thành module `Onboard.mount({force,onDone})` với
  đủ 3 hồi: cutscene (tạm dùng 3 clip cũ, caption mới kể chuyện rơi vào
  Kotopia) → gate CODE! (chữ sáng từng ký tự theo charge, palm trần
  70% + SpeechRecognition en-US-only, chant grace 1.5s; fallback:
  không mic = giữ 1.6s, không camera = chạm-GIỮ dòng chữ) → blast + Pip
  hiện hình từ bụi + 3 bubble intro theo giọng chuẩn. Map vẫn auto-mount
  qua flag như cũ (script `data-manual` để harness tự mount).
- `onboard.html` — dev harness: force-replay không đụng flag/cache, nút
  replay / to-gate / five / chant + probe thử transcript sống.
- **Phase B ĐÃ VÀO GAME (2026-07-04):** clip one-shot 10s
  (`assets/cutscenes/act1-oneshot.mp4`, Veo, user cung cấp: phòng ngủ →
  vòng tròn phép → đường hầm → trời Kotopia → lóa trắng) thay 3 clip cũ;
  act 1 giờ chạy MỘT video với caption theo mốc thời gian (0.3s/3.6s/7s),
  kết thúc bằng white-out của chính clip nối vào flash của gate. 3 clip
  shot1/2/3 cũ còn trong assets — xoá sau khi user duyệt bản mới.
- **Pip reveal nâng cấp (2026-07-04, user: "chưa ấn tượng, thoại bị lặp"):**
  sau blast có nhịp tối 0.4s → avatar pop + vòng sóng xung kích
  (`.obavatar.arrive::after`) + bảng tên **✦ PIP ✦** flare → bubble vào sau
  0.9s. Thoại viết lại CHỈ chứa beat mới (phản ứng vụ nổ → Pip là ai + hook
  "đôi tay" → hook về nhà/học Mật Ngữ) — không kể lại những gì caption
  cutscene đã nói (bài học cũ: intro lặp đọc như độn trang).
- **Mic debug/feedback (2026-07-04, user-directed):** gate hiện **waveform
  âm lượng mic** (`#obmeter`, AnalyserNode trên stream audio riêng — sống
  chung ổn với capture nội bộ của SR) + **dòng transcript sống** (`.obhear`:
  "🎤 đang lắng nghe (vi-VN)…" → "🎤 nghe: …" → xanh "✦ TRÚNG!"; lỗi mic/
  dịch vụ ghi rõ lý do). SR downgrade về palm-only sau 3 lỗi `network`
  liên tiếp (hết kẹt trần 70%). **en-US ONLY (2026-07-04)**: Chrome chỉ cho
  một phiên SR mỗi lúc → không nghe 2 ngôn ngữ song song được; phiên thật
  cho thấy vi-VN ép "code" thành "không" còn en-US bắt phát một → bỏ xen kẽ,
  nghe en-US 100% thời gian, phiên tái tạo mỗi 7s. `obDev.heard` = log
  transcript/lỗi gần nhất để soi bằng console.
- **Matcher tầng ngữ âm + n-best (2026-07-04, từ log giọng thật):** phiên
  thật cho "got"/"count"/"cold" khi hô "CODE!" → thêm `phoneMatch` trong
  `chant-match.js` (mini-Metaphone cho đúng 1 từ: gộp lớp phụ âm c/k/g/q→K,
  d/t→T, h câm; nhận khung K[l/n/r]T + lõi nguyên âm o/u — got/cold/count/
  goat/could ✓, cat/gate/kit ✗) + `sr.maxAlternatives=5` và quét MỌI
  phương án n-best (transcript "cold" thường giấu "code" ở alt dưới).
  35 asserts pass.
- **Magic circle v2 (2026-07-04, user chê vòng cũ xấu + tam giác xoay
  lệch, đưa ảnh mẫu anime):** `ritual-vortex.js#drawCircle` viết lại —
  vòng đôi ngoài + vành 18 rune + 6 medallion glyph cưỡi vòng, vòng đôi
  trong + vành 12 rune quay NGƯỢC chiều, LỤC GIÁC TINH 2 tam giác đối xoay
  chậm; mọi band tốc độ HẰNG SỐ (đều), charge tăng tốc cả mâm cùng nhau.
  **Thắp sáng tuần tự theo charge** (`ign` ease + ngưỡng riêng từng phần
  tử): vòng tự khắc thành cung, rune sáng TỪNG CHỮ lan quanh vành, tam giác
  tự vẽ nét đỉnh-nối-đỉnh, lõi bừng cuối (~P .82) — "thần chú tự viết".
  Ghost mờ luôn hiện khi idle; pop trắng khi mỗi phần tử vừa cháy.
  Sửa tiếp theo phản hồi live: lục giác tinh phải là MỘT KHỐI CỨNG (hai tam
  giác cùng góc `thT`, lệch cố định 60° — bản đối-xoay bị "cắt kéo" theo
  thời gian, screenshot tĩnh không lộ); và **bụi ambient = GLYPH trôi nổi**
  thay vì chấm/pixel (user: "các kí tự nổi trôi") — atlas 12 ký tự rune
  retint theo màu frame, bụi tuôn từ lòng bàn tay (mode 1) vẫn là tia sáng;
  lore khớp: ngôn từ Mật Ngữ bị hút vào thần chú.
- Verified headless (Playwright): gate + chữ sáng + five→Pip + replay +
  map auto-mount/flag/reonboard + circle v2 chụp ở charge .4/.92.
  **Chưa verify sống giọng nói thật sau tầng ngữ âm** (D3).

**Mục tiêu:** onboard phải là phần ấn tượng nhất game. Thay 3 clip rời hiện
tại (`assets/cutscenes/shot1-portal / shot2-pip / shot3-montage`) bằng một
mạch liền 3 hồi: **CUỐN VÀO → CODE! (✋ + giọng nói) → BLAST + Pip
ra mắt**. Khẩu quyết "CODE!" đã chốt (lần 3) (xem STORY.md §7 — thần chú
nâng cổng riêng của Kotopia, không dính IP Harry Potter).

**Giữ nguyên (không đụng):** localStorage `magicdust.onboard`,
`saga.reonboard()`, luật "không ngõ cụt" (mọi hồi tap-để-skip, hard-cap
WATCH_MS — không bao giờ chờ `ended` đơn độc, bài học đã ghi trong
`onboard.js`), palm-gate math + RitualVortex đã có.

---

## Phase A — Pip visual canon (asset, làm TRƯỚC mọi thứ)

Vấn đề gốc: Pip mỗi nơi một hình (clip Veo ≠ portrait). Mọi asset sau này
phải sinh từ MỘT reference.

- **A1. Chốt thiết kế Pip** (checkpoint với user bằng ảnh): tinh linh bụi
  cỡ lòng bàn tay — lõi cầu phát sáng + vệt bụi xoáy như đuôi sao chổi, mắt
  to, KHÔNG có tay (lore: vì thế cần tay học trò). Lấy `assets/pip.webp`
  hiện tại làm mốc thẩm mỹ hay vẽ lại — user chọn.
- **A2. Sinh reference sheet** qua Gemini (cùng một chat để giữ style —
  pipeline chuẩn trong README): chính diện / nghiêng / 4 biểu cảm (vui ·
  lo · hoảng · chiến thắng). Lưu `assets/pip-sheet.png` (+ crop từng biểu
  cảm nếu cần), PIL optimize.
- **A3. Đồng bộ 2 portrait theme** (`pip.webp` SPARK cyan/tím,
  `pip-bloom.webp` hồng/vàng) từ đúng sheet — cùng dáng, chỉ đổi màu.
- **Deliverable:** sheet + 2 portrait khớp nhau; user duyệt ảnh trước khi
  sang Phase B.

## Phase B — Cutscene HỒI 1 (video "bị cuốn vào Kotopia")

Thiết kế như MỘT cú máy liền (mỗi shot kết thúc bằng chuyển động lao tới mà
shot sau tiếp nối); Pip KHÔNG xuất hiện trong hồi này (né luôn vấn đề đồng
nhất trong video — Pip chỉ ra mắt ở hồi 3 bằng particle engine).

- **B1. Storyboard + prompt Veo** (3 shot, góc nhìn thứ nhất):
  - Shot A (~5s): phòng ngủ ban đêm → màn hình máy tính nhấp nháy → vòng
    tròn phép nở ra khỏi màn hình, bụi cyan/tím tràn vào phòng, camera bị
    hút về phía cổng.
  - Shot B (~4s): lao xuyên đường hầm ánh sáng (tunnel dive).
  - Shot C (~5s): bung ra giữa trời Kotopia — đảo nổi, dãy hải đăng TẮT dọc
    một con đường, tòa tháp đen xa xa — bổ nhào xuống đất → lóa trắng.
- **B2. Generate qua Veo** (Chrome control, cùng chat), tải về theo đúng
  gotcha blob-URL trong README, đặt `assets/cutscenes/` (tên mới:
  `act1-room.mp4` / `act1-tunnel.mp4` / `act1-arrive.mp4`), re-roll shot
  nào lệch mạch. Clip cũ giữ tới khi Phase C chạy ổn rồi xoá.
- **Deliverable:** 3 clip nối liền mắt thường xem như một cú máy; user duyệt.

## Phase C — `onboard.js` viết lại theo 3 hồi (code chính)

- **C1. Khung 3 acts** — refactor `onboard.js`: `act1Cutscene()` →
  `act2Gate()` → `act3Reveal()`; captions tối giản (không giới thiệu Pip ở
  act 1); chuyển cảnh giữa clip bằng white-flash/crossfade ngắn cho liền
  mạch; cuối act 1 màn lóa trắng TAN RA thành camera thật (white overlay
  fade). Giữ `obDev` + thêm hook mới (xem D1).
- **C2. Act 2 — sân khấu vòng tròn phép:** camera live mờ sau **magic
  circle lớn** — tái dùng RitualVortex (đã có rings + triangles + runes),
  mount tâm màn hình; chữ **CODE!** lớn giữa màn hình, độ sáng từng
  ký tự chạy theo charge (`--obc` đã có). Caption lời Pip (chỉ tiếng, chưa
  lộ mặt): "Cậu đang kẹt giữa hai thế giới đó! Giơ ✋ lên trước vòng tròn,
  và hô thật to: CODE!" (thoại chuẩn giọng Pip, STORY.md §6).
- **C3. Gate kép tay + giọng:**
  - Palm hold (logic sẵn có) nạp charge nhưng **trần 70%** khi chưa có giọng.
  - **Module thuần `engine/chant-match.js`** (làm TRƯỚC, có test riêng
    `test-chant-match.mjs` theo lệ gesture-math): `matchChant(transcript)` —
    fold dấu → tách từ → pass nếu có từ trong bộ chấp nhận
    (`code/cod/kho/khau/cốt…`) hoặc Levenshtein ≤1 so với "code" (bắt
    "codes"/"mode" của en-US). Test tối thiểu: "code", "khô", "khâu" pass;
    "có ạ", "cho em với", "xin chào" fail.
  - `SpeechRecognition` `interimResults:true`, **xen kẽ 2 ngôn ngữ — trúng
    1 trong 2 là đậu**: Chrome chỉ cho một phiên SR sống mỗi lúc → đổi
    `lang` `'vi-VN'` ↔ `'en-US'` ở mỗi chu kỳ `onend`-restart (vài giây một
    lần); mọi transcript (final + interim) đều qua `matchChant`.
  - Match đến trong lúc palm-charge ≥ 0.3 → **surge 70→100%** → blast.
    Khởi động SR khi act 2 hiện (sau tap đầu tiên của user → còn trong
    user-gesture chain).
  - Nice-to-have (làm nếu còn thời gian): volume-spike fallback bằng
    AnalyserNode khi SR không bắt được chữ (hét to cũng tính).
- **C4. Fallback đầy đủ (không ngõ cụt):**
  - Không mic / SR không hỗ trợ (Safari/Firefox) → palm-only giữ 1.6s lên
    thẳng 100%; caption vẫn rủ hô to ("hô to lên cho oách — Pip tin là cậu
    đang hô đó!").
  - Không camera → chạm-giữ vòng tròn (thay tap hand cũ).
  - Clip lỗi/nghẽn → `onerror` + WATCH_MS cap như cũ; skip mọi lúc.
- **C5. Act 3 — blast + Pip ra mắt:** full charge → `burst()` + flash +
  shake (sẵn có) + circle flare-out → **bụi tụ lại thành Pip**: ember burst
  của engine crossfade sang portrait Pip (scale-in + dust settle, CSS) —
  không cần video. Pip nói 2–3 bubble intro MỚI (viết lại theo giọng chuẩn,
  nhắc 4 nhiệm vụ của lore: học Mật Ngữ · săn bảo bối · hạ Chúa tể Vô Định ·
  mở Cổng Thời Không) → ✦ LET'S GO → map (trail sáng chạy tới node 0 —
  arrival fanfare sẵn có).
- **C6. Âm thanh (mở màn Phase 6 sound — STRETCH, tách commit riêng):**
  whoosh khi bị hút (act 1), ù trầm khi vòng tròn chờ, chime leo theo
  charge, BOOM khi blast. WebAudio, lazy AudioContext sau tương tác đầu.
- **Deliverable từng bước:** C1 chạy được với clip cũ → C2–C4 gate mới →
  C5 reveal → C6 sound. Mỗi bước một commit.

## Phase D — Test & verify

- **D1. Dev hooks:** mở rộng `obDev`: `five()` (giữ), `chant()` (giả giọng
  nói — bơm transcript giả vào handler), `act(n)` (nhảy hồi). Cheat `pip`
  trên map thêm nút "replay onboarding" (đã có `saga.reonboard()`).
- **D2. Headless drive-through** (Playwright): đủ 4 đường — (1) đủ cam+mic,
  (2) cam không mic, (3) không cam, (4) skip hết; kiểm tra không đường nào
  kẹt (luật một-run/không-ngõ-cụt). Console dump ra file rồi grep (quy ước
  test của dự án).
- **D3. Verify sống 2 lần** bằng palm + giọng thật (quy ước "verified live
  twice"). Sau đó xoá 3 clip cũ, cập nhật docs: `README.md` (mục onboarding),
  `SAGA-DESIGN.md` checklist, memory.

---

## Quyết định còn mở (cần user chốt trước/trong Phase C)

1. ~~**Khẩu quyết**~~ — ĐÃ CHỐT (2026-07-03): **"CODE!"**.
2. **Sound C6:** làm luôn trong đợt này hay để Phase 6 chung?
3. **Pip reveal:** crossfade engine→portrait (rẻ, chắc ăn — đề xuất) hay
   generate thêm video "bụi tụ thành Pip" (đẹp hơn, rủi ro lệch style)?

## Thứ tự & ước lượng phiên làm việc

A (duyệt ảnh) → B (duyệt clip) song song với C1 → C2–C5 → D. Code gói gọn
trong `onboard.js` + vài dòng CSS (`saga.css`), không đụng node shell.
