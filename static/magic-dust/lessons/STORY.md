# Magic Dust — KOTOPIA STORY BIBLE (`STORY.md`)

Đây là **canon** cho mọi nội dung truyện/lời thoại của saga. Luật dùng file này:

- Mọi lời thoại Pip, caption, tên boss, tên bảo bối trong `lessons/content/node*.js`
  phải khớp lore ở đây và viết theo **Giọng Pip** (mục 6).
- Sửa canon (tên nhân vật, twist, kết) = checkpoint với người dùng trước.
- Cơ chế game KHÔNG đổi theo truyện — truyện được thiết kế để **đặt tên cho cơ chế
  đã có**, không phải ngược lại.

---

## 1. Lore chính (do người dùng đặt — 2026-07-03)

> Bạn nhỏ vô tình lạc vào **Vương quốc Kotopia** — nơi phép thuật và dòng lệnh
> lập trình là một. **Pip** xuất hiện làm bạn đồng hành/bảo vệ. Hành trình:
> **học thần chú** (code) → **săn bảo bối** (trang bị/cuộn chú) → **đánh bại
> Chúa tể hắc ám** → **mở Cổng Thời Không** để về nhà.

Bốn nhiệm vụ đó ánh xạ 1-1 vào game: học = notebook cells · săn bảo bối =
bundle/gift · đánh kẻ ác = boss fights · mở cổng = ritual từng node, dồn về
node cuối (node 10 "Studio: The Portal").

## 2. Nhân vật

### Học trò (người chơi)
Một bạn nhỏ bình thường, bị màn hình máy tính "nuốt" vào Kotopia trong một
đêm cổng nhấp nháy. Không có phép — chỉ có **đôi bàn tay** (thứ quý nhất ở
Kotopia, xem Ấn tay) và trí tò mò. Lớn dần qua từng node: từ người lạ →
học trò → **Phù thủy Mật Ngữ**.

### Pip — tinh linh bụi phép
- **Là ai:** nhúm bụi phép có hồn, xưa là người đưa thư của Người Giữ Cổng.
  Khi Chúa tể Vô Định xóa Mật Ngữ khỏi trí nhớ muôn dân, Pip nhỏ quá nên bị
  bỏ sót — thành sinh linh duy nhất còn nhớ *cách học* Mật Ngữ.
- **Giới hạn (lý do truyện cho cơ chế):** Pip nhớ lỗ chỗ nên chỉ **dạy**
  được, không **làm hộ** được; và Pip **không có tay** — bụi phép chỉ tuân
  theo ấn tay con người → học trò phải tự gõ code, tự giơ tay.
- **Tính cách:** nhí nhảnh, hay "suỵt", tự hào vặt ("hữu ích thật đó"),
  nhưng che một nỗi áy náy (xem Twist, mục 5).
- Xưng hô: xưng **"Pip"**, gọi học trò là **"bạn"** (đổi từ "bạn", quyết định 2026-07-04 theo review ngôn ngữ), làm chung là **"tụi mình"**.

### Chúa tể VÔ ĐỊNH (Lord Null) — kẻ ác cuối
Không đốt phá gì cả — hắn làm điều thâm hiểm hơn: **xóa dần Mật Ngữ khỏi trí
nhớ của muôn dân Kotopia**. Không ai đọc nổi thần chú → máy móc ngủ lịm →
hải đăng tắt → **Cổng Thời Không đóng băng**. Một vương quốc không biết
"đọc máy" thì không chống lại hắn được — đó là kế hoạch. Đánh bại hắn =
học lại toàn bộ Mật Ngữ và thắp lại con đường.
*(Đổi tên hắn = sửa đúng mục này; các node chỉ gọi "Chúa tể Vô Định".)*

### Tam Tướng Lỗi (tay sai — chính là 3 boss đã build)
| Boss | Vai | Ăn gì để hồi máu (cơ chế "error heals boss") |
|---|---|---|
| **BUG WRAITH** 👾 | Tướng tiên phong, sinh từ chữ gõ sai | Lỗi chính tả, dấu nháy bỏ quên |
| **SYNTAX SERPENT** 🐍 | Con rắn quấn nát LUẬT của Mật Ngữ | Quên `:`, sai thụt lề, `=` thay `==` |
| **PARADOX SPHINX** | Quân sư đánh đố logic | Rẽ nhánh sai, điều kiện mâu thuẫn |

Lore cho cơ chế đã có: lũ này **ăn lỗi sai để lớn** (chạy sai → boss hồi
máu); chuỗi đúng liên tiếp làm bụi phép **cộng hưởng** (streak ×1.5/×2);
3 trái tim = 3 **hạt bụi hộ mệnh** Pip tặng; hết tim → quái no bụng hồi đầy
máu nhưng không nuốt được bạn (soft-fail). Node 5–9 khi cần boss mới thì
thêm tướng theo cùng khuôn: *một kiểu lỗi → một con quái* (ví dụ node 5:
quái ranh giới "OFF-BY-ONE OGRE"; node 6: "VÒNG XOÁY VĨNH VIỄN" — vòng lặp
không có luật dừng).

## 3. Thế giới Kotopia

- **Bụi phép** — "máu" của Kotopia, chính là particle vortex khắp game.
  Không nghe lời nói suông; chỉ nghe **Mật Ngữ** (code chạy đúng) và **Ấn tay**.
- **Ngôn ngữ Ấn tay** (lore cho gesture-first — khớp gesture language đã khóa):
  - ☝ **Ấn Khai Lộ** — mở đường, bắt đầu (start node / begin ritual)
  - ✋ **Ấn Chào Đón** — high-five: mở bảo vật, kết thân với máy (bundle/gift)
  - ✋ giữ vững = **Ấn Phong Ấn** — niêm phong trạm đá (seal ritual)
  - 1/2/3 ngón — **Ấn Số**: cách "nói số" với bụi phép (quiz/anatomy/`watch()`)
  - ✌ **Ấn Lưu Ảnh** — dành riêng cho gương chụp hình (booth SNAP; vì thế
    2 ngón không bao giờ là rule bài học)
- **Con Đường Hải Đăng** (bản đồ saga) — mỗi node là một **Trạm Đá** cổ mang
  ngọn hải đăng bụi phép, nối về Cổng Thời Không. Chúa tể đã dập tắt tất cả.
  Ritual cuối node = **thắp lại hải đăng**: bụi cuộn thành xoáy, vòng tròn
  phép bừng sáng, ánh sáng chạy dọc đường soi tới trạm kế (lit-trail +
  arrival fanfare đã có).
- **Bảo bối:**
  - **Bọc cổ vật** (bundle) — hành trang dân Kotopia chôn giấu trước khi
    quên Mật Ngữ (MÁY TÍNH CỔ, BÙA CAMERA…).
  - **Cuộn Chú** (gift ☀🌙❄…) — từ mới là chiến lợi phẩm ("new words are LOOT").
  - **Trang Sổ Phù Thủy** (remember ✦) — trang rách từ *Đại Thư Mật Ngữ* bị
    Chúa tể xé; mỗi node nhặt ~3 trang. Hook: gom đủ = trang tổng ôn/bonus.
- **Bệnh Viện Thần Chú** (spell hospital) — thần chú bị thương thì để lại
  **thông báo lỗi**. Phù thủy giỏi là người biết **đọc thông báo lỗi**, không
  phải người không bao giờ sai.
- **Cổng Thời Không** — cửa về nhà, node cuối (node 10). Mở được khi mọi hải
  đăng sáng + Chúa tể bị đánh bại. Sau khi mở: **cổng luôn mở** — bạn về nhà
  nhưng quay lại chơi lúc nào cũng được → cớ truyện mở khóa **sân phép tự do**
  (app VFX gốc ở root) làm phần thưởng hậu game.

## 4. Beat truyện từng node

Nguyên tắc: mỗi node = một Trạm Đá; beat truyện chỉ là **lớp áo** trên nội
dung dạy đã có — không thêm cell dạy vì truyện.

| Node | Bài dạy (đã build/plan) | Beat truyện |
|---|---|---|
| **Onboard** | — | Bị cuốn vào Kotopia + hô thần chú "CODE!" (mục 7) — ấn tượng nhất game |
| **0** Anatomy | input→process→output, `say()` | Trạm đầu tiên: đánh thức MÁY TÍNH CỔ. Cameo BUG WRAITH gầm gừ trong máy (đã có) — *lời hăm dọa đầu tiên của Chúa tể*; chưa đánh, chỉ thấy |
| **1** Words | `read()`, biến, ghép chữ | Máy cổ bắt đầu *nói chuyện lại* — dân Kotopia từng tán gẫu với máy cả ngày. Bug Wraith lởn vởn phá chữ (các bài đọc-lỗi) |
| **2** Numbers | `read_num`, `+−×÷` | Kho thóc trạm đá tính toán sai bét vì Bug Wraith gặm số. **Boss: BUG WRAITH** — trận trả thù cho lời hăm dọa từ node 0 |
| **3** Input & Output | `watch()`, if/elif, camera | BÙA CAMERA cho máy **con mắt** — máy đầu tiên NHÌN thấy ấn tay. **Boss: SYNTAX SERPENT** quấn quanh trạm, phá luật `:`/thụt lề |
| **4** Else | `else`, tổ hợp | Ngã ba sương mù — mọi con đường phải có lối "còn lại thì sao". **Boss: PARADOX SPHINX** ra câu đố nghịch lý |
| **5** Boundaries | `>` `<` `>=` `<=` | **Cầu Cân Đo** ở biên giới vương quốc — lính gác chỉ cho qua đúng "mốc"; con bug trốn ngay tại ranh giới |
| **6** While | vòng lặp + luật DỪNG | **Thung Lũng Vọng Âm** — nói một lần, vọng ngàn lần; ai quên luật dừng sẽ bị vọng âm giữ lại mãi |
| **7** Remainder (plan) | `%`, chẵn/lẻ | **Hội Chợ Đổi Máy** — chỗ trả bài odd/even machine-swap ("logic giữ nguyên, máy đổi") |
| **8** Def (plan) | `def` | **Lò Rèn Cuộn Chú** — tự đúc thần chú mang tên mình; cũng là chỗ trả bài "import abstraction reveal" |
| **9** In/Out fn (plan) | tham số/return | Lò rèn nâng cao — cuộn chú biết *nhận nguyên liệu, trả thành phẩm* |
| **10** The Portal (plan) | capstone | **CỔNG THỜI KHÔNG**. Chúa tể Vô Định lộ diện. Trận cuối không dạy gì mới: chữa đúng **Đại Thần Chú Mở Cổng** bằng tất cả đã học. Twist của Pip (mục 5) thổ lộ ở đây. Cổng mở → về nhà → cổng luôn mở (sân phép tự do) |

## 5. TWIST (spoiler — chỉ dùng ở node 10, đừng nhắc sớm)

Cổng hút bạn vào **không phải tình cờ**: chính Pip đã dồn chút bụi phép cuối
cùng của mình gọi "một người còn học được Mật Ngữ" xuyên qua cổng — canh bạc
tuyệt vọng để cứu Kotopia. Pip áy náy suốt hành trình vì đã kéo bạn xa nhà
(được phép *gợi* rất nhẹ ở giữa game: Pip thỉnh thoảng lảng tránh câu hỏi
"sao bạn biết mình sẽ tới?"). Trước cửa cổng, Pip thú nhận và xin lỗi —
học trò tha thứ bằng chính hành động **mở cổng cho cả hai thế giới**, không
phải chỉ cho mình.

## 6. Giọng Pip (voice guide — áp cho MỌI chuỗi npc/note/caption)

Phản hồi gốc của người dùng: văn hiện tại như *dịch ngược từ tiếng Anh*, hay
*nói tắt khó hiểu*, nhiều *từ cộc lốc*. Chuẩn:

1. **Nhân xưng cố định:** Pip xưng "Pip", gọi "bạn", chung là "tụi mình".
2. **Câu trọn vẹn có chủ ngữ** — mỗi bubble 1–3 câu, không cụt lủn. Không
   mệnh lệnh trống ("RUN thử xem") — luôn bọc trong câu ("Bạn bấm RUN thử
   xem điều gì xảy ra nhé!").
3. **Thuật ngữ giữ tiếng Anh** (INPUT, `say()`, RUN…) nhưng lần đầu xuất
   hiện phải nằm trong một câu tiếng Việt giải nghĩa nó.
4. **Thán từ Việt:** Ơ kìa! · Chà! · Suỵt… · Hì hì · Tuyệt cú mèo! —
   không dùng câu cảm dịch từ tiếng Anh.
5. **`note:`/đề bài là câu hướng dẫn đầy đủ**, không telegraph.
6. **Mỗi bubble một ý**; ý mới → bubble mới (hợp cơ chế typewriter).
7. Truyện hoá nhẹ: nhắc Kotopia/Chúa tể/bảo bối khi tự nhiên, không nhồi.

### 6a. Thuật ngữ thống nhất — "MẬT NGỮ" (quy ước canon)

Trong thoại/đề bài **không gọi "code" / "lệnh" / "câu lệnh"** — dùng bộ từ
trong thế giới truyện, cố định như sau:

| Khái niệm ngoài đời | Gọi trong game | Ví dụ dùng |
|---|---|---|
| code / lập trình nói chung | **Mật Ngữ** | "học Mật Ngữ", "viết Mật Ngữ" |
| một lệnh/hàm cụ thể (`say()`…) | **thần chú** | "thần chú `say()`" |
| một chương trình hoàn chỉnh / đoạn code cần đọc hoặc sửa | **đoạn code** / **đoạn mã** | "đoạn code echo của bạn" |
| chạy chương trình (RUN) | **niệm chú** | "bấm RUN để niệm chú" |
| lỗi / bug | **vết nứt** (trong thần chú) / **quái lỗi** (khi thành boss) | "thần chú bị nứt rồi" |
| error message | **thông báo lỗi** | "đọc thông báo lỗi xem máy đang vướng ở đâu" |
| sửa lỗi / debug | **chữa thần chú** | Bệnh Viện Thần Chú |
| từ khóa/hàm mới được dạy | **cuộn chú** (khi là gift) | "cuộn chú `lighten()`" |

Từ kỹ thuật tiếng Anh (INPUT/OUTPUT, RUN, tên hàm, `if`/`else`…) vẫn giữ
nguyên dạng — chúng là "chữ khắc trên máy", không dịch; nhưng luôn được bọc
trong câu tiếng Việt (rule 3). KHÔNG bịa thêm từ lóng mới ngoài bảng này —
từ vựng truyện ít mà lặp lại đều thì trẻ mới thuộc.

Trong quiz, `forge.quiz`, và boss question rounds, vẫn dùng cùng bảng này.
Nếu nói về error message, viết `thông báo lỗi` hoặc `máy báo lỗi gì`; không
viết `máy than`, `tiếng máy than`, hay `than phiền`.

### 6b. Chống AI-slop (rà mọi bubble trước khi ship)

Danh sách cấm — đọc thấy là viết lại:

1. **Cấm khen rỗng lặp máy móc:** không "Tuyệt vời!", "Chính xác!", "Làm
   tốt lắm!" đứng một mình. Khen phải **chỉ vào đúng việc vừa làm**: "Ơ,
   bạn sửa đúng chỗ dấu nháy rồi nè!" — và đảo mẫu liên tục (xem 6c).
2. **Cấm khuôn văn mẫu dịch:** "Hãy cùng nhau…", "Không chỉ… mà còn…",
   "hành trình đầy thú vị", "khám phá thế giới kỳ diệu", "Bạn đã sẵn sàng
   chưa?" mở đầu mọi bài. Mỗi node mở một kiểu khác nhau.
3. **Cấm bộ-ba-liệt-kê mọi câu** ("nhanh, gọn và chính xác") — nhịp câu
   phải đa dạng: câu ngắn xen câu dài, có câu chỉ hai chữ ("Nghe kìa.").
4. **Cấm emoji trong lời thoại Pip** — emoji chỉ sống ở HUD/ấn tay/tên
   boss (✋ ☝ ✌ 👾 🐍 ☀ 🌙 ❄ là ký hiệu hệ thống, không phải trang trí câu).
5. **Cấm giải thích lại điều vừa nói** bằng cách khác ngay câu sau —
   một ý nói một lần; nếu quan trọng thì để dành cho thẻ ✦ REMEMBER.
6. **Cấm câu hỏi tu từ dồn dập** ("Thú vị phải không nào?") — tối đa một
   câu hỏi thật sự cần trả lời trong một bubble.
7. **Tật riêng của Pip dùng tiết chế:** "Suỵt…", "Hì hì", tự hào vặt —
   mỗi thứ vài lần một node là đủ mặn; nhồi mỗi bubble là thành slop.
8. **Kiểm tra bằng tai:** đọc to lên — nếu không hình dung được một đứa
   trẻ 9 tuổi nói câu đó với bạn nó, viết lại.
9. **Kiểm tra bằng 3 cách nói:** nếu một cụm nghe gọn nhưng lạ, viết ba cách
   nói khác nhau rồi bỏ cách giống dịch máy nhất. Giữ câu nêu rõ thao tác:
   `gán`, `đổi điều kiện`, `đọc hàng/cột nào`, `biến đổi thành True/False`.
   Tránh đặt tên tắt cho trạng thái thuật toán như `số lật`, `biến con`,
   `bẻ hàng`, `cờ bật`, `hạ xuống False`, hoặc `lật ngược so`.

### 6c. Ngân hàng mẫu câu (đảo vòng, đừng dùng một mẫu 2 lần liền nhau)

**Mở đầu node / tới trạm mới:**
- "Ơ kìa, tới Trạm [X] rồi! Bạn có nghe thấy tiếng [máy rì rầm / gió hú] không?"
- "Suỵt… đứng yên đã. Trạm này có gì đó là lạ."
- "Chà, hải đăng ở đây tắt ngóm luôn rồi. Tụi mình có việc để làm đây."

**Giới thiệu thần chú mới:**
- "Đây là thần chú `X` — nó bảo cỗ máy [việc cụ thể]."
- "Dân Kotopia ngày xưa dùng `X` mỗi khi muốn [việc]. Giờ tới lượt bạn."
- "Pip chỉ nhớ mang máng thần chú này thôi… `X`, hình như là để [việc]. Bạn niệm thử xem đúng không!"

**Giao đề (`note:`):**
- "ĐỀ BÀI: [việc cần làm, câu đầy đủ]. Nếu đúng, máy sẽ [kết quả thấy được]."
- "ĐỀ BÀI: Sửa lại đoạn code cho [điều kiện]. Xong thì bấm RUN nhé."

**Khen khi làm đúng (khen VÀO việc):**
- "Bạn [việc vừa làm đúng] rồi nè — máy nghe lời bạn răm rắp luôn!"
- "Đó! Thấy chưa, [kết quả] hiện ra đúng như bạn viết."
- "Ngon lành. Trang Sổ Phù Thủy này là của bạn."
- "Hì hì, Pip chưa kịp nhắc mà bạn làm xong rồi."

**Khi thần chú nứt (error):**
- "Thông báo lỗi hiện ra rồi nè: *[trích lỗi]*. Bạn đọc thử xem vết nứt nằm ở đâu."
- "Đừng hoảng — thần chú nứt thì mình chữa. Máy báo lỗi gì thì bệnh thường nằm ngay đó."
- "Quái lỗi khoái nhất là lúc này đó! Đọc kỹ thông báo lỗi rồi vá lại cho nó cụt hứng."

**Trước boss:**
- "Nó tới rồi. [TÊN BOSS] — tay sai của Chúa tể Vô Định, chuyên ăn [loại lỗi]."
- "Nhớ nè: mình niệm đúng thì nó đau, mình niệm sai thì nó no. Đừng cho nó ăn!"

**Nhận bảo bối / cuộn chú:**
- "Mở ra xem nào… [TÊN]! Dân Kotopia giấu kỹ ghê."
- "Cuộn chú này dạy bạn thần chú `X`. Cất vào túi, lát dùng liền đó."

**Trước ritual:**
- "Hải đăng chờ bạn đó. Giơ ✋ Ấn Phong Ấn lên — giữ thật vững nhé."

Ví dụ chuẩn (viết lại từ node00 thật):

> ❌ "Trả lời ngon lành! Giờ thử làm OUTPUT thật xem sao. Từ đầu tiên của mọi
> phù thủy: say() — ra lệnh cho máy NÓI (in) ra màn hình. RUN thử xem."
>
> ✅ "Bạn trả lời đúng rồi, giỏi lắm! Giờ tụi mình tự tạo ra một OUTPUT thật
> nhé. Thần chú đầu tiên mà phù thủy nào ở Kotopia cũng học là `say()` — nó
> ra lệnh cho cỗ máy NÓI một câu lên màn hình. Bạn bấm RUN xem cỗ máy nói gì nè!"

> ❌ "ĐỀ BÀI\n(chưa có INPUT ở bài này — thử say() một mình trước)"
>
> ✅ "ĐỀ BÀI: Bài này chưa cần INPUT đâu — tụi mình thử dùng `say()` một mình
> trước. Nếu bạn làm đúng, máy sẽ in lên màn hình đúng câu chữ nằm trong dấu ngoặc."

## 7. ONBOARD MỚI — hô "CODE!" (thiết kế; thay 3 clip rời hiện tại)

**Mục tiêu người dùng đặt:** onboard phải là **phần ấn tượng nhất game**.
Vấn đề hiện tại: 3 clip Veo (`shot1-portal/shot2-pip/shot3-montage`) rời
rạc, Pip trong clip không giống Pip portrait, gate high-five xuất hiện khô.

### Kịch bản 3 hồi (một mạch liền, ~30–40s tổng)

**HỒI 1 — CUỐN VÀO (video, ~12–15s, góc nhìn thứ nhất, MỘT chuyển động liền):**
căn phòng bình thường ban đêm → màn hình máy tính nhấp nháy → một **vòng
tròn phép** nở ra khỏi màn hình, bụi phép tràn vào phòng → camera bị HÚT
xuyên qua cổng — đường hầm ánh sáng — thoáng thấy Kotopia (đảo nổi, hải
đăng tắt, tòa tháp đen của Chúa tể xa xa) → rơi về phía mặt đất, màn hình
lóa trắng. *(Có thể ghép 2–3 clip Veo nhưng phải thiết kế như MỘT cú máy:
mỗi shot kết thúc bằng chuyển động lao tới mà shot sau tiếp nối; caption
tối giản, không giới thiệu Pip ở hồi này.)*

**HỒI 2 — THẦN CHÚ ĐẦU TIÊN (tương tác — khoảnh khắc "wow"):**
màn lóa trắng tan ra thành… **camera thật của học trò** mờ sau một **vòng
tròn phép khổng lồ** (RitualVortex + magic circle ĐÃ CÓ — dựng ngay trên
overlay). Caption/giọng Pip (chưa lộ mặt, chỉ tiếng): *"Bạn đang kẹt giữa
hai thế giới đó! Mau lên — giơ ✋ bàn tay lên trước vòng tròn, và hô thật
to: CODE!"* Chữ **CODE** hiện to giữa màn hình, phát sáng dần
theo lực giữ.
- **Gate kép (tay + giọng CÙNG LÚC):** giữ ✋ open palm nạp vòng xoáy tới
  **trần 70%** (bụi cuộn quanh vòng tròn, rune sáng dần); trong lúc palm
  đang giữ, mic bắt được tiếng hô "CODE" → **surge 70%→100%** ngay lập tức.
- **HỒI 3 — BLAST:** full charge → flash trắng + shockwave + burst ember +
  rung màn hình (đều đã có trong engine) → vòng tròn phép **vỡ thành bụi,
  và đám bụi tụ lại thành PIP** ngay trước mặt (màn ra mắt của Pip — sửa
  luôn lỗi "Pip xuất hiện lãng xẹt"). Pip nói 2–3 bubble intro (giọng
  chuẩn mục 6, nhắc 4 nhiệm vụ của lore chính) → ✦ LET'S GO → đáp xuống
  bản đồ, trail sáng chạy tới node 0.

### Kỹ thuật

- **Voice:** Web Speech API `SpeechRecognition` (đã dùng ở app gốc cho lệnh
  "cast" — `#voicestat`), interim results, **chỉ `en-US`**: Chrome chỉ cho
  MỘT phiên SR sống mỗi lúc (không nghe 2 ngôn ngữ song song được), và phiên
  thật cho thấy vi-VN ép "code" thành "không" trong khi en-US bắt phát một —
  thần chú là từ tiếng Anh thì nghe bằng model Anh 100% thời gian, hết cảnh
  xen kẽ đậu nhầm làn. Phiên tự tái tạo mỗi ~7s (SR chạy liên tục lâu bị ì).
  Khẩu quyết một âm tiết nên khớp **theo TỪ**: fold dấu, tách từ, pass nếu
  có từ trong bộ chấp nhận (`code/cod/kho/khau/koda/cốt…`) hoặc cách "code"
  ≤ 1 ký tự (bắt "codes"/"mode"/"coda"). CỐ TÌNH không nhận "co"/"cho"
  (fold của "có"/"cho" — hai từ phổ biến nhất tiếng Việt, nhận là cháy gate
  với câu nói thường). Logic thuần → `engine/chant-match.js` +
  `test-chant-match.mjs` (theo lệ gesture-math). Cân nhắc thêm fallback
  "hét cũng tính": AnalyserNode đo volume spike khi transcript không bắt được.
- **Đồng thời:** cửa sổ hợp lệ = keyword đến trong lúc palm-charge ≥ 0.3.
- **Fallbacks (luật "không ngõ cụt" giữ nguyên):** không mic / không
  SpeechRecognition → giữ ✋ lâu hơn (1.6s) tự lên 100%, caption vẫn rủ hô
  to ("hô to lên cho oách — Pip tin là bạn đang hô đó!"); không camera →
  chạm-giữ vòng tròn; clip hỏng/chậm → hard-cap WATCH_MS như bài học cũ
  trong `onboard.js` (không bao giờ chờ `ended` đơn độc); tap-to-skip mọi hồi.
- **Âm thanh (mở màn Phase 6 sound):** whoosh khi bị hút, ù trầm khi vòng
  tròn chờ, chime leo thang theo charge, BOOM + chuông ngân khi blast.
- **Khẩu quyết (chốt lần 3, 2026-07-04): "CODE!"** — đọc "khô"/"khâu(-đơ)".
  Lịch sử: Alohomora → loại (Harry Potter); Koto-ascentio → loại (Ascendio
  cũng là chú HP, và dài khó nghe — SR phiên thành "count a Sense"). Chốt
  bản tối giản: khẩu quyết cổ nhất Kotopia chính là **gọi đúng TÊN của phép
  thuật**. Một từ, trẻ nào cũng hô được, và tự nó là bài học đầu tiên:
  phép thuật ở đây tên là CODE.
  (Kotopia luôn là tên vương quốc, không phải tên người.)

### Assets cần làm lại (pipeline Gemini/Veo, cùng một chat để đồng nhất)

1. **Pip visual canon — làm TRƯỚC tiên:** chốt MỘT thiết kế Pip (đề xuất:
   tinh linh bụi cỡ lòng bàn tay — lõi cầu phát sáng + vệt bụi xoáy như
   đuôi sao chổi, mắt to, không tay; SPARK = cyan/tím, BLOOM = hồng/vàng
   **cùng một dáng**, chỉ đổi màu). Sinh **reference sheet** (chính diện /
   nghiêng / biểu cảm: vui · lo · hoảng · chiến thắng) rồi MỌI asset sau
   (clip Veo, portrait, sprite) đều generate từ đúng reference đó
   (image-to-video / image-conditioning) — đây là chỗ sửa lỗi "Pip mỗi nơi
   một hình".
2. Clip HỒI 1 (1–3 shot nối liền như một cú máy, xem trên).
3. (Tuỳ chọn) frame "bụi tụ thành Pip" cho HỒI 3 — hoặc làm bằng chính
   particle engine + crossfade sang portrait, không cần video.

### Việc code (khi build — sau khi duyệt thiết kế này)

`onboard.js` viết lại theo 3 hồi: cutscene một mạch → gate kép
palm+voice (tái dùng palm-gate + RitualVortex sẵn có, thêm SpeechRecognition)
→ blast + Pip reveal → intro → map. Giữ: localStorage `magicdust.onboard`,
`saga.reonboard()`, `obDev` hooks, mọi fallback/skip.

## 8. Danh sách asset truyện (ngoài onboard)

- Chân dung **Chúa tể Vô Định** (chỉ cần từ node ~5 trở đi: bóng đen xa xa
  trong vài cameo; lộ mặt ở node 10).
- Boss mới node 5/6 (nếu content muốn boss riêng) theo khuôn Tam Tướng.
- Cameo "hải đăng sáng lại" — có thể làm bằng chính map trail, không cần art.
