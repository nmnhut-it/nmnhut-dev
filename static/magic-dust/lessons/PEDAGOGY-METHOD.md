# Phương pháp thiết kế bài giảng — Magic Dust

Đây là phương pháp (không phải nội dung cụ thể) dùng để thiết kế MỌI node
bài học trong Magic Dust. Đọc file này TRƯỚC khi viết/sửa một node mới. Mọi
luật ở đây đã được rút ra qua nhiều vòng chơi thử thật với người dùng
(2026-07); phần lớn đã được **cơ chế hóa thành heuristic trong
`validate-content.mjs`** — luật sống trong code, không chỉ trong văn bản.

Canon liên quan: `STORY.md` (cốt truyện + giọng Pip), `AUTHORING.md`
(checklist viết node), `CLAUDE.md` §"Lesson-content sequencing rules"
(luật gọn để tra nhanh), `PEDAGOGY-V2-PLAN.md` / `FORGE-PLAN.md`
(hai hệ mới nhất). File này là bản TỔNG HỢP phương pháp.

## 1. Triết lý cốt lõi

- **"Logic ở lại, cỗ máy đổi."** Bài học là một chương trình Python nhỏ,
  chạy-một-lần. Đổi "cỗ máy" (module) thì cùng một logic cho ra thế giới
  I/O khác — từ console sang camera/AR — mà không đổi logic. Đây là trục
  xuyên suốt.
- **Gesture-first.** Học sinh LÀM bằng tay (giơ ngón, ✋ niêm phong) chứ
  không chỉ bấm nút. Mọi cổng cử chỉ PHẢI có fallback tap/phím — **không
  bao giờ ngõ cụt**. Một đứa không webcam vẫn chơi hết được.
- **Game là động lực, gắn với HIỂU.** Phần thưởng (huy hiệu → bom) chỉ
  nhận được khi vượt quiz kiểm tra — thưởng cho hiểu bài, không cày.
- **Tiến độ = thế giới sáng lên.** Học xong node → hải đăng trên đảo thắp
  sáng. Lore và cơ chế trùng nhau.

## 2. Cung bài của một node (node arc)

```
ENTER (giơ 1 ngón / bấm)
 → mở BUNDLE (loot reveal, tặng "cỗ máy")
 → HỌC qua các cell notebook (Pip kể + code chạy được + quiz)
 → MINI-PROJECT ("XƯỞNG PHÉP": chế máy nhỏ để thấy CÁCH DÙNG)
 → THỢ RÈN (rèn huy hiệu / quiz thành BOM MẬT NGỮ)
 → BOSS nếu có (☝ ngắm + ✋ kích hoạt BOM, 1-hit KO + phong ấn)
 → RITUAL nếu không có boss (✋ niêm phong) → node sáng → node kế mở
```

### Arc V2 cho node có boss

- **Forge là bài kiểm tra, boss là payoff.** Câu hỏi dùng để kiểm tra hiểu
  bài nằm trong `forge.quiz`, không nằm trong boss. Trả lời đúng → rèn được
  BOM MẬT NGỮ; trả lời sai → vòng "rèn hụt" cho thêm luyện tập, tăng cơ hội
  tới chắc chắn.
- **Boss không dạy kiến thức mới.** Boss V2 không có quiz/code round, không
  grind HP. Boss chỉ kiểm tra cử chỉ: giữ ☝ để ngắm/khóa, rồi ✋ để kích hoạt
  BOM, hạ boss một hit và phong ấn node.
- **KO boss thay ritual riêng.** Với node có boss KO, khoảnh khắc nổ BOM +
  phong ấn chính là nghi lễ mở node kế. Node không có boss vẫn dùng ritual
  ✋ riêng.

### Arc cho đảo phụ (side island)

- **Đảo phụ là luyện thêm, không phải node dạy mới.** Nội dung chỉ dùng vốn từ
  đã mở trước `unlockAt`; nếu cần nhắc khái niệm mới thì đảo đó phải mở sau
  node đã dạy khái niệm ấy.
- **Được dạy một MẪU GHÉP từ vốn cũ.** Đảo phụ có thể giới thiệu pattern nâng
  cao như "đặt một `for` bên trong một `for` khác" nếu mọi mảnh cú pháp
  (`for`, `range`, biến, `if`, phép tính, `str`) đã được học trước. Pattern đó
  phải là luyện mở rộng, không thành gate bắt buộc của đường chính.
- **Không boss/forge/ritual chính.** Đảo phụ dùng `island.js`: splash → bundle
  → notebook practice → finish card ✋ về bản đồ. Không ghi tiến độ main saga,
  không dùng boss/forge để gate kiến thức.
- **Mật độ phải đáng ghé.** Mỗi đảo nên có nhiều bài chạy thật, ít nhất vài
  quiz tự đủ ngữ cảnh, và xen dạng bài: đoán output → sửa lỗi → tự viết →
  mini-project nhỏ. Đảo phụ không nên chỉ là narration hoặc một bài tập đơn.
- **Reward là độ vững, không loot chính.** Có thể có lời khen/finish card, nhưng
  không làm người học tưởng đây là đường bắt buộc để mở node chính.

### Arc cho nhánh học Python (learning branch)

- **Nhánh học khác đảo phụ.** Nhánh học được phép dạy cú pháp Python mới và phải
  mang `kind: "learning-branch"`; đảo phụ vẫn chỉ dùng vốn từ đã mở trước đó.
- **Thứ tự bắt buộc là học rồi mới luyện.** Mỗi nhánh đi theo nhịp V2: kiểm tra
  bài cũ → định nghĩa trực tiếp → ví dụ chạy đúng → ví dụ sai và sửa → tự làm →
  checkpoint → quiz. Tháp của nhánh chỉ hiện sau khi nhánh học đã hoàn thành.
- **Không chặn đường truyện chính.** Nhánh học bổ sung kiến thức Python chuẩn,
  có cờ hoàn thành riêng và không ghi vào `magicdust.saga`. Nội dung dự án chính
  không được âm thầm đòi cú pháp của một nhánh chưa học.
- **Tháp chỉ luyện lại.** Tháp nối sau nhánh có 10–15 tầng, không giới thiệu cú
  pháp mới, dùng đề bài nêu rõ dữ kiện/INPUT, PROCESS và OUTPUT. Mỗi đáp án code
  phải có phần giải thích từng dòng.

## 3. Luật trình tự (sequencing) — quan trọng nhất

Mỗi luật đều có lý do rút ra từ lỗi thật:

1. **Một khái niệm mới mỗi bước.** Một cell/step giới thiệu tối đa MỘT thứ
   Python mới. Trước khi ship một `{code}` cell, diff vốn từ của nó với mọi
   thứ đã dạy — không lén dùng hàm/keyword chưa dạy (kể cả boss round).
2. **Mở node bằng KIỂM-TRA-BÀI-CŨ.** Nếu node xây trên node trước, mở đầu
   bằng một quiz ôn kiến thức cũ (câu mới, không copy).
3. **TRẢI NGHIỆM trước KHÁI NIỆM.** Học sinh phải dùng kiến thức cũ chạm vào
   ngữ cảnh mới TRƯỚC khi khái niệm mới xuất hiện. Ví dụ: cho `finger = 3;
   say_num(finger)` (biến thường, in giá trị) trước khi dạy `if`. Khái niệm
   mới chỉ xuất hiện khi bài toán vừa trải nghiệm ĐÒI nó ("máy làm mọi thứ
   mỗi lần chạy — muốn nó chỉ chạy KHI 1 ngón? Cần một LUẬT" → `if`).
   *(Lỗi gốc: node03 cũ nhét finger+camera+if cùng lúc, chưa giới thiệu đã
   dùng — chơi thấy "gượng ép".)*
4. **ĐƯỜNG CHÍNH trước, ANALOGY sau (V2).** Dạy thẳng kỹ thuật trước (định
   nghĩa chính xác + cú pháp + ví dụ chạy), RỒI mới ví von để KHẮC SÂU
   ("Pip kể cách khác nè — biến giống cái hộp…"). Analogy củng cố, không
   thay thế. *(Lỗi gốc: node01 cũ dạy "cái hộp" TRƯỚC định nghĩa → nhớ hình
   ảnh mà không nắm bản chất.)*
5. **Không dùng THUẬT NGỮ trước khi định nghĩa.** "biến", "chuỗi", "mật
   ngữ", "INPUT" phải được định nghĩa ở đúng cell trước lần dùng đầu tiên.
   Cơ chế hóa: bảng `GLOSSARY` trong validator (term → node/cell giới thiệu)
   + heuristic bắn WARN nếu prose dùng term trước điểm giới thiệu.
6. **Thuật ngữ CHUẨN trong cell tham chiếu.** `remember`/`checkpoint` là
   phát biểu học sinh ghi nhớ — dùng đúng tên khái niệm Python (biến/gán/
   chuỗi/điều kiện/khối thụt lề/trả về), không diễn nôm lỏng lẻo. NHƯNG:
   gọi `say()`/`read()`/`watch()` là **"lệnh"** chứ không phải **"hàm"** —
   khái niệm hàm chưa dạy. ("ghép chữ" được ở thoại Pip; text tham chiếu
   nói "nối chuỗi bằng `+`".)
7. **Tên biến học sinh thấy phải bằng tiếng Anh.** Trong starter code,
   solution code, quiz snippet, và comment hướng dẫn nằm trong code, đặt tên
   biến bằng tiếng Anh ASCII như `score`, `count`, `total`, `digit`, `result`.
   Lời giải thích bên ngoài code vẫn viết tiếng Việt; không dùng tên biến
   tiếng Việt như `tong`, `dem`, `chu_so`, `ket_qua` trong bài mới.
8. **Định nghĩa và bài tập phải có hợp đồng rõ.** Mỗi định nghĩa/bài tập cần
   nêu đủ: học sinh phải làm gì; INPUT đã cho hay được đọc từ đâu; PROCESS/mẫu
   chính cần dùng; OUTPUT đúng phải hiện ra gì. Nếu thiếu một trong bốn phần
   này, học sinh lớp 7 sẽ đoán ý tác giả thay vì luyện khái niệm.
   Với bài số học, được dạy `%` và `//`, nhưng phải nói rõ con số đó là gì
   (số đang kiểm tra, số ban đầu, chữ số cuối, thương sau khi chia...). Giá trị
   gán sẵn trong starter code là "cho sẵn/gán sẵn"; chỉ gọi là INPUT khi máy
   thật sự đọc từ người học, camera, hoặc nguồn nhập liệu khác.
   Nếu bài đặt tên một khái niệm riêng như "số tự hào", "hợp lệ", hay
   "ô vuông thần kỳ", định nghĩa phải có ngay một `Ví dụ:` cụ thể. Nếu khái
   niệm dễ nhầm, thêm một phản ví dụ ngắn. Ví dụ chỉ minh họa nghĩa của khái
   niệm, không được biến thành thuật toán giải từng bước.
9. **Đề bài không được lộ thuật toán giải.** `note`, lời dẫn, checkpoint, và
   comment trong starter code chỉ được nêu khái niệm, dữ kiện cho sẵn/INPUT
   thật, yêu cầu cần đạt, công cụ chính có thể dùng, và OUTPUT đúng. Không viết
   sẵn trình tự giải từng bước như: tạo biến nào trước, thân vòng lặp cập nhật
   ra sao, nhánh nào đứng trước nhánh nào, hay biểu thức đầy đủ cần gõ. Phần
   giải thích thuật toán chi tiết chỉ nằm trong `solution`/đáp án của tác giả.
   Nếu cần gợi ý, chỉ nhắc một công cụ hoặc một tiêu chí kiểm tra, không đưa
   luôn cả lời giải.
10. **V2 là lớp chỉnh trên nền V1.** V1 giữ các luật nền: mở bằng bài cũ,
   trải nghiệm trước khái niệm, có đúng/có sai, checkpoint rồi quiz, project
   để thấy cách dùng. V2 thêm nhịp rõ hơn cho mỗi cụm: bài toán/kinh nghiệm
   → định nghĩa kỹ thuật trực tiếp → ví dụ chạy → analogy củng cố → tự làm
   → checkpoint → quiz/huy hiệu. Analogy không được đi trước định nghĩa, và
   game reward không được thay thế phần hiểu kỹ thuật.

## 4. Checkpoint doctrine

- Trình tự cụm: **bài mẫu → tự làm (generalize) → CHECKPOINT → QUIZ hỏi lại
  NGAY**. High-five ✋ chốt kiến thức, quiz kiểm tra retrieval liền.
- **Remember/checkpoint chỉ đến SAU chuỗi học thật.** Trước khi chốt một
  khái niệm bằng checkpoint/remember, cụm đó phải đi qua đủ nhịp:
  `lý thuyết/giới thiệu → bài tập hoặc bài mẫu → bản ĐÚNG → bản SAI → sửa
  bản SAI → CHECKPOINT/remember`. Không hỏi quiz, không bắt sửa boss, và
  không chốt "hãy nhớ" khi học sinh chưa từng thấy khái niệm chạy đúng rồi
  hỏng sai ở đâu. Nếu thiếu bản sai/sửa, checkpoint chỉ là lời dặn, chưa phải
  học qua trải nghiệm.
- **Text checkpoint = phát biểu kỹ thuật CHÍNH XÁC, KHÔNG gamification.**
  Có cú pháp trong backtick, nêu luật + hệ quả. Không "giỏi quá 🎉" (ăn mừng
  là hiệu ứng high-five; chữ là kỹ thuật). Mẫu: *"Biến có thể gán thẳng bằng
  một chuỗi: `mood = "vui"`. Máy giữ giá trị đó cho tới khi gán lại."*
- **Tối đa 2-4 checkpoint/node.** Quá nhiều thì phần thưởng mất giá. Validator
  WARN nếu >4, WARN nếu checkpoint không có quiz ngay sau, WARN nếu text có
  fluff (`giỏi quá|tuyệt vời|🎉|!!`).

## 5. Thiết kế thực hành

- **Bài mẫu → generalize → predict-output.** Cho ví dụ chạy được, rồi bảo
  học sinh mở rộng pattern; quiz "đoán output" với LITERAL MỚI (suy luận,
  không nhớ lần chạy trước).
- **Mỗi bài tập code có INPUT/PROCESS/OUTPUT.** Phần `note` hoặc lời dẫn phải
  nói rõ dữ liệu ban đầu, thao tác cần viết, và output đúng. Ví dụ tốt:
  "Cho sẵn `word = \"Koto\"`; dùng `word.lower()` để đổi chữ; OUTPUT đúng là
  `koto`." Nếu dùng `read()`/`read_num()`/`watch()` thì mới gọi phần đó là
  INPUT. Không giao bài bằng câu mơ hồ như "sửa cho đúng" nếu chưa nói đúng là
  đúng theo tiêu chí nào.
- **Nhưng không đưa sẵn thuật toán trong đề.** `PROCESS` ở đây là mẫu/công cụ
  cần dùng ở mức vừa đủ để học sinh hiểu đề, ví dụ "dùng `while` để duyệt các
  chữ số" hoặc "dùng `%` để kiểm tra phần dư". Không viết trong `note` hay
  comment starter toàn bộ lời giải như "mỗi vòng lấy `digit`, cộng vào `total`,
  rồi cập nhật `left`". Trình tự giải chi tiết thuộc về `solution`.
- **Phân biệt cho sẵn với INPUT.** Nếu code có `number = 153`, viết "Cho sẵn
  `number = 153`" hoặc "`number` được gán sẵn để luyện"; đừng gọi đó là INPUT.
  Nếu dùng `read_num()` hoặc `watch()` thì mới nói INPUT. Khi dùng `%`/`//`,
  nêu thao tác cụ thể: `% 10` lấy chữ số cuối, `// 10` bỏ chữ số cuối, `% 2`
  kiểm tra phần dư khi chia cho 2.
- **Có đúng có sai (sửa lỗi).** Giữ bài đọc-lỗi-để-sửa — nhưng feedback
  phải ĐỌC ĐƯỢC: khi sai `expectOut`, thông báo nêu rõ lý do
  (`{minLines:2}` → "cần 2 dòng, mới có 1 — viết thêm say() nữa"). Lỗi
  Python tiếng Anh cần Pip dịch lại tiếng Việt (rào cản với trẻ Việt).
- **Đi từ ĐÚNG → SAI khi dạy lỗi.** Với một lỗi quan trọng, đừng chỉ dặn
  "đừng làm thế". Cho học sinh chạy/trace một bản ĐÚNG trước, rồi đưa một
  bản SAI có cấu trúc gần giống để học sinh tự cảm nhận kết quả lệch, thông
  báo lỗi, hoặc dữ liệu mất ở đâu. Sau đó mới yêu cầu sửa. Mẫu tốt:
  `bài mẫu đúng → dự đoán output → bản sai cùng pattern → sửa lỗi`.
- **Mini-project ("XƯỞNG PHÉP").** Sau khi dạy cơ chế, cho chế một MÁY nhỏ
  (thẻ tên, máy tính tuổi…) để thấy CÁCH DÙNG — bài tập dạy cơ chế, project
  dạy "để làm gì". 3-5 cell, có lý do câu chuyện, không "bài tập số 7".

## 6. Đánh giá (quiz)

- **Mức 2+ theo thang nhận thức 4 mức** (Nhận biết / Thông hiểu / Vận dụng /
  Vận dụng cao). Mặc định ≥ mức 2: ví dụ cụ thể, không hỏi định nghĩa khan.
  Xem skill `quiz-design`.
- **Mỗi câu quiz phải tự đủ ngữ cảnh.** Học sinh có thể chỉ nhìn đúng câu
  hỏi hiện tại, không dòm được câu trước, title, hay lời Pip ngay trên đó.
  Vì vậy câu hỏi phải nhắc lại luật cần dùng, dữ liệu đầu vào, đoạn code đầy
  đủ, và hỏi output/hành vi cụ thể. Không viết câu kiểu "trong bài trên",
  "đó là gì", hoặc dựa vào một ví dụ vừa kể mà không chép lại phần cần đọc.
- **Từ vựng trong quiz phải cùng chuẩn với skill `quiz-design`.** Dùng
  `thông báo lỗi`, `máy báo lỗi`, `lệnh`, `dòng`, `khối if`, `nhánh if/elif`,
  `chuỗi if/elif`, `mốc dừng`, `điều kiện đúng/sai`. Tránh `máy than`,
  `than phiền`, `câu lệnh`, `câu if`, `các câu if/elif`, `mốc dừng trước`,
  và nhãn cụt như `lượt bạn`. Đáp án nhiễu phải là hiểu lầm có thật, không
  phải câu đùa kiểu "Python đói bụng".
- **Quiz prose also gets a collocation pass.** Do not accept a phrase only
  because all words exist in a dictionary. If an answer choice or explanation
  uses a compact algorithm phrase, generate three Vietnamese rewrites and keep
  the one that states the exact code action. Bad patterns include `số lật`,
  `đổ a sang b`, `biến con`, `bẻ hàng`, `cờ bật`, `hạ xuống False`, and
  physical verbs attached to abstract rules. Use concrete forms like `gán`,
  `đổi điều kiện`, `giá trị trong biến`, `ô ở hàng/cột`, `đổi thành True/False`.
- **Code trong quiz phải render như code.** `renderProse()` hỗ trợ backtick
  inline và fenced block. Dùng inline backtick cho mẩu ngắn như `x > 3`,
  `a[0]`, `say()`. Nếu học sinh phải đọc nhiều dòng, thụt lề, `if/for/while`,
  hoặc một lệnh dài, dùng block mở bằng ```` ```python ```` và đóng bằng
  ```` ``` ````. Không viết code trần trong `q`/`a`, không ép nhiều nhánh
  vào một dòng bằng dấu `·`; đáp án là code cũng phải bọc backtick. Luật này
  áp dụng cả `{quiz}`, `forge.quiz`, và boss question rounds.
- **Chấm bằng `expectOut`.** Chạy sạch mà output SAI ≠ đậu. Mọi `{code}` có
  output xác định phải mang `expectOut` (chuỗi/RegExp/`{minLines}`/
  `{heldCount}`/`{all}` — xem `cell-validation.js`). Bỏ qua chỉ khi output
  vốn mở (camera/tự do).
- **Cử chỉ trả lời = giơ N ngón** (1..4 = đáp án 1..4). Đây là quy ước ổn
  định, muscle memory. *(swipe/track từng thử nhưng chưa ổn định → 2026-07
  rút hết về giơ ngón; engine verb còn trong code để bật lại sau.)*

## 7. Vòng kinh tế phần thưởng (reward economy)

- **HỌC → RÈN → HẠ BOSS (V2 hiện hành).** Vượt quiz retrieval của một cụm →
  nhận HUY HIỆU. Tới THỢ RÈN: huy hiệu + `forge.quiz` rèn thành BOM MẬT NGỮ.
  Rèn hụt KHÔNG mất huy hiệu — làm thêm bài luyện, mỗi bài đúng tăng cơ hội
  tới chắc chắn.
- **Forge kiểm tra, boss thưởng.** Học/đánh giá nằm ở notebook và
  `forge.quiz`. Boss không có quiz/code round; boss là khoảnh khắc dùng BOM:
  ☝ ngắm/khóa → ✋ kích hoạt → 1-hit KO → phong ấn.
- **Không ngõ cụt, nhưng được gate bằng BOM nếu rèn chắc chắn.** Node có
  boss V2 có thể yêu cầu có BOM mới đánh boss, vì forge luôn dẫn tới thành
  công sau luyện tập. Không webcam vẫn phải có fallback tap/phím cho cử chỉ.
- **Thưởng gate trên HIỂU, không cày.** Huy hiệu và BOM đến từ quiz/luyện tập
  đúng trọng tâm, không từ bấm lặp. Tỉ lệ badge→bom phải giữ có ý nghĩa:
  một BOM đại diện cho những khái niệm thật sự nắm.

## 8. Giọng & ngôn ngữ

- Pip: tiếng Việt trẻ con TỰ NHIÊN, ≤40 chữ/bong bóng, không dịch ngược từ
  tiếng Anh, không câu cụt telegraph. Xưng "Pip", gọi **"bạn"**, chung "tụi
  mình". Mọi thứ HỌC SINH THẤY (prompt/output/comment trong code) đều Việt
  hóa; keyword Python giữ tiếng Anh (bắt buộc).

## 9. Cơ chế hóa: validator là người gác luật

Mọi luật cơ-chế-hóa-được đều là heuristic trong `validate-content.mjs` —
để luật tự enforce, không cần nhắc lại đời đời:
- Schema cell type + field bắt buộc (ERROR).
- `expectOut` shape hợp lệ; `{code}` thiếu expectOut (WARN).
- GLOSSARY forward-reference (dùng term trước khi giới thiệu — WARN).
- Checkpoint không có quiz ngay sau / >4 checkpoint/node / text fluff (WARN).
- Vốn từ chưa dạy trong boss code round (WARN).
- Quiz "…là gì?" trần (mùi mức-1 — WARN).
**Nguyên tắc: bắt được một lỗi sư phạm ⇒ thêm heuristic để không tái phạm.**

## 10. Kiến trúc & quy trình (để phương pháp thực thi được)

- **3 tầng**: CONTENT (`content/node*.js`, DATA thuần) / PLATFORM (node
  shell, boss, ritual, forge) / ENGINE ("Dust Engine": camera, gesture,
  Pyodide). Enforce bằng `check-layers.mjs`.
- **Content sửa TAY qua `editor.html`** (chủ dự án chỉnh chữ nghĩa; agent lo
  cấu trúc/engine). Save từ editor mất comment — commit trước khi sửa lớn.
- **Track V1/V2** cho A/B sư phạm: `nodeNN.js` vs `nodeNNv2.js`, trang
  riêng, map chọn track nào bằng `saga.js` NODES. (2026-07: map phục vụ V2.)
- **Deploy**: snapshot copy → nmnhut.dev/magic-dust/ (xem
  memory `deploy-nmnhut-dev.md`), loại file dev/test khỏi bản production.
- **Workflow**: bước nhỏ, commit sau mỗi thay đổi được duyệt, checkpoint
  thiết kế trước khi build lớn, verify bằng chơi thật (webcam/tap). Chơi
  thử người-thật là cách tìm lỗi tốt nhất — nhiều bug sư phạm/UX chỉ lộ ra
  khi chơi (feedback `minLines`, camera đứng hình giữa quiz…).

## Lịch sử rút gọn (vì sao có luật)

| Luật | Rút từ lỗi |
|---|---|
| Trải nghiệm-trước-khái-niệm | node03 nhét if+camera+finger cùng lúc, "gượng ép" |
| Đường-chính-trước-analogy | node01 dạy "cái hộp" trước định nghĩa biến |
| Không-dùng-term-trước-định-nghĩa | "mật ngữ"/"biến" dùng trước khi giới thiệu |
| Feedback chấm phải cụ thể | `my_strings.py` báo "check your edit" mù mờ |
| "lệnh" không "hàm" | khái niệm hàm chưa dạy |
| Rút swipe/track về giơ ngón | cử chỉ chưa ổn định, camera một nơi chữ một nơi |
| Checkpoint không gamification | phần thưởng phải chốt KỸ THUẬT, ăn mừng để cho FX |
## Thuật ngữ và giới hạn gamification

- Tên khái niệm kỹ thuật phải xuất hiện trước tên địa điểm hoặc vật phẩm trong tiêu đề học tập.
- Định nghĩa, checkpoint, quiz và đề bài dùng ngôn ngữ lớp học trực tiếp. Không đổi tên một thao tác kỹ thuật thành thuật ngữ fantasy.
- Gamification chỉ giữ ở hook mở bài, hình minh họa, tiến độ, collectible và phần thưởng. Nó không được chen vào câu mô tả INPUT, PROCESS, OUTPUT hoặc tiêu chí làm đúng.
- Khi dùng thuật ngữ tiếng Anh lần đầu, viết theo mẫu ``term` (nghĩa tiếng Việt cụ thể)`, rồi mô tả thao tác mà code thực hiện. Không bắt học sinh ghi nhớ một chuỗi từ Anh trước khi thấy hành vi.
- Tình huống Kotopia được phép làm ngữ cảnh bài toán, nhưng tên nhân vật và địa điểm không được che dữ kiện, phép tính hay cấu trúc dữ liệu cần học.
