# Tower floor candidates — sourced from LeetCodeDataset (staging, not shipped)

Staging doc only — **not loaded by the app**. Feeds `TOWER-CLIMB-PLAN.md`'s
Build order step 1/3 (difficulty pool + adapted floors).

## Provenance & licensing note

- Source: HF dataset [`newfacade/LeetCodeDataset`](https://huggingface.co/datasets/newfacade/LeetCodeDataset)
  (2641 train + 228 test rows; fields include `question_id`, `difficulty`,
  `tags`, `problem_description`, `starter_code`, `entry_point`, `test`).
- **LeetCode problem statements are copyrighted.** Per this task's brief
  (owner override of `TOWER-CLIMB-PLAN.md`'s earlier LeetCode-is-off-limits
  stance — see that file's "Problem sources" section, now superseded for
  this dataset specifically), the dataset is used **only to identify
  problem shapes/ideas**. Every "Đề gốc" row below is an internal
  attribution note (question_id + entry_point), kept for our own tracking —
  it must **never** be copied into shipped content. Every "Đề bài (Pip)" is
  freshly written Vietnamese prose in Pip's voice/Kotopia lore, describing
  the underlying task in our own words, not a translation of LeetCode's
  wording. Test cases below are freshly authored to fit our `expectOut`
  grader, not copied from the dataset's `test`/`input_output` fields.
- If any of these floors ship, add the same CREDITS line pattern used for
  MBPP: *"Một số thử thách phỏng theo các bài toán lập trình phổ biến
  (LeetCode Easy), viết lại hoàn toàn bằng tiếng Việt."*

## Filtering method

From the 2641-row train split: 638 rows are `difficulty == "Easy"`. Of
those, 77 have `tags` ⊆ `{String, Math}` **and** a starter signature with no
`List[`/`Dict[`/`Optional[` params — i.e. no lists/dicts/OOP, matching what
node00–07 has taught (print/say, variables, if/elif, comparison operators,
`while`). From that 77, the candidates below were hand-picked for concept
fit and diversity. `def` isn't taught until node08 (per `NODE-EXPANSION-PLAN.md`
/ node roadmap memory), so **every floor is written as a straight-line
script** (given variables → `say()`/`say_num()` output), not a function
definition — matching how node07's `while` teaching cells are already
written (`from old_computer import say, say_num`), not a LeetCode-style
`def solve(...)`.

Per `TOWER-CLIMB-PLAN.md`'s tiering table, boss floors (gesture-KO, reusing
`boss-fight.js`'s `boss:{ko:true}` mode) sit at every 5th floor and are
**not** dataset-derived — they're listed as placeholders only, so the
numbering here matches the plan doc's real floor sequence.

---

## Floors 1–3 — warmup (if / biến / == only, no loop)

### Floor 1 — "Cân Số Vô Định"
- **Đề gốc:** LC 1281 `subtractProductAndSum` (Math) — digit product minus digit sum.
- **Đề bài (Pip):** "Tầng đầu THÁP VÔ ĐỊNH khóa bằng một câu đố số học. Cỗ máy
  cho bạn ba con số lẻ của một mật mã: `d1`, `d2`, `d3` (mỗi số từ 0-9). Cửa
  chỉ mở khi bạn tính đúng: lấy TÍCH của ba số trừ đi TỔNG của ba số, rồi
  `say_num()` kết quả đó ra."
- **Starter vars:** `d1 = 4; d2 = 4; d3 = 2` (LC example 4421 shortened to 3
  digits so it's `if`-tier arithmetic, no digit-extraction loop needed).
- **expectOut:** `/\b21\b/` — tích 4*4*2=32, tổng 4+4+2=10, 32-10=22... (use
  d1=2,d2=3,d3=4 → tích 24, tổng 9, kết quả 15, matching the dataset's own
  example so the arithmetic is pre-verified: `expectOut: /\b15\b/`).

### Floor 2 — "Đếm Số Lẻ Trong Vòng Vây"
- **Đề gốc:** LC 1523 `countOdds` (Math) — count odds in `[low, high]`.
- **Đề bài (Pip):** "Hai cây cột đá ở tầng 2 khắc hai con số `thap` và
  `cao` (biên dưới/trên). Bạn phải đếm xem có bao nhiêu SỐ LẺ nằm giữa hai
  cây cột đó, tính cả hai đầu, rồi hô ra bằng `say_num()`."
- **Starter vars:** `thap = 3; cao = 7` (dataset's own example — an
  if/arithmetic formula suffices: no loop needed, since count = (cao-thap)//2
  + (1 if thap%2==1 or cao%2==1 else 0), taught as a single arithmetic line
  the floor pre-fills, only the final comparison/adjustment is student-written).
- **expectOut:** `/\b3\b/` (odds between 3 and 7 = {3,5,7}).

### Floor 3 — "Gương Ba Chữ Số"
- **Đề gốc:** LC 9 `isPalindrome` (Math) — palindrome check, restricted to
  a fixed 3-digit shape so it needs no string ops / no loop.
- **Đề bài (Pip):** "Một tấm bia đá 3 chữ số đứng chắn cửa: `tram`, `chuc`,
  `donvi` (chữ số hàng trăm/chục/đơn vị). Bia chỉ vỡ nếu chữ số hàng TRĂM
  bằng chữ số hàng ĐƠN VỊ — soi gương đối xứng. Dùng `if`/`==` rồi
  `say()` ra `"DOI XUNG"` hoặc `"LECH"`."
- **Starter vars:** `tram = 1; chuc = 2; donvi = 1` (121, dataset's own example).
- **expectOut:** `/doi xung/i` (for the 121 case; the floor's hidden second
  test flips to `tram=1,donvi=0` expecting `/lech/i` — mirrors
  `cell-validation.js`'s array-of-regex OR shape: `expectOut: [/doi xung/i, /lech/i]` is too loose for grading two distinct runs, so recommend the tower runner run each floor with 2 fixed seeds and check the matching regex per seed, not a single OR).

---

## Floors 4, 6–9 — need `while` (floor 5/10/15/20 reserved for boss, see below)

### Floor 4 — "Số Hoàn Hảo"
- **Đề gốc:** LC 507 `checkPerfectNumber` (Math) — sum of proper divisors == n.
- **Đề bài (Pip):** "Người gác tầng 4 chỉ mở đường cho SỐ HOÀN HẢO — số mà
  tổng các ước số (trừ chính nó) cộng lại đúng bằng chính nó. Cho `so = 28`.
  Dùng `while` duyệt từ 1 tới `so - 1`, cộng dồn các số chia hết `so`, rồi
  so sánh tổng với `so`."
- **Starter vars:** `so = 28`.
- **expectOut:** `/hoan hao/i` for `so=28` (divisors 1+2+4+7+14=28); floor's
  second seed `so=7` should print `/khong hoan hao/i`.

### Floor 6 — "Số Xấu Xí"
- **Đề gốc:** LC 263 `isUgly` (Math) — only prime factors 2, 3, 5.
- **Đề bài (Pip):** "Chỉ những con số CHỈ chia hết cho 2, 3 hoặc 5 (không
  dính số nguyên tố lạ nào khác) mới bước tiếp được. Cho `so = 6`. Dùng
  `while` chia `so` cho 2 rồi 3 rồi 5 hết mức có thể; nếu cuối cùng còn lại
  1 thì đó là số hợp lệ."
- **Starter vars:** `so = 6` (→ hợp lệ); second seed `so = 14` (→ dính 7, loại).
- **expectOut:** `/hop le/i` / `/khong hop le/i` per seed.

### Floor 7 — "Số Tự Hào"
- **Đề gốc:** LC 1134 `isArmstrong` (Math) — sum of cubed digits == n (3-digit case).
- **Đề bài (Pip):** "Một con số 3 chữ số tự hào khi lập phương từng chữ số
  rồi cộng lại đúng bằng chính nó. Cho `so = 153`. Dùng `while` bóc từng
  chữ số bằng `so % 10` và `so // 10`, cộng dồn lập phương."
- **Starter vars:** `so = 153` (→ tự hào, 1+125+27=153); second seed
  `so = 123` (→ không, 1+8+27=36).
- **expectOut:** `/tu hao/i` / `/khong tu hao/i` per seed.

### Floor 8 — "Đổi Cơ Số"
- **Đề gốc:** LC 1837 `sumBase` (Math) — convert to base k, sum digits.
- **Đề bài (Pip):** "Tầng 8 nói bằng một thứ tiếng lạ: hệ cơ số `k` thay vì
  hệ 10 quen thuộc. Cho `n = 34`, `k = 6`. Dùng `while` chia `n` liên tục
  cho `k`, cộng dồn phần dư, tới khi `n` về 0."
- **Starter vars:** `n = 34; k = 6` (34 base-6 = "54" → 5+4=9).
- **expectOut:** `/\b9\b/`.

### Floor 9 — "Gương Vô Tận"
- **Đề gốc:** LC 9 `isPalindrome`, general n-digit version (arithmetic
  reversal via `while`, no string conversion — matches the dataset's own
  "Follow up: without converting to a string").
- **Đề bài (Pip):** "Nâng cấp tầng 3: giờ số không chỉ có 3 chữ số. Cho
  `so = 12321`. Dùng `while` lật ngược `so` thành một số mới bằng phép chia
  lấy dư/lấy nguyên, rồi so sánh số lật với số gốc."
- **Starter vars:** `so = 12321` (→ đối xứng); second seed `so = 123` (→ không).
- **expectOut:** `/doi xung/i` / `/khong doi xung/i` per seed — deliberately
  reuses floor 3's output vocabulary so the tower reads as an escalation,
  not a new lesson.

---

## Floors 11, 12, 13, 14 — escalating, each introduces ONE new mini-tool inline

Per `TOWER-CLIMB-PLAN.md`'s "9+ / advanced side nodes" tier and this
project's own sequencing rule ("one new concept per teaching step" —
`CLAUDE.md`), each floor below needs one small new piece of vocabulary
beyond node0–7 (string indexing `s[i]`, `len(s)`, the `in` operator, or
`.isupper()`/`.islower()`). Per doctrine, these should NOT be dropped
silently inside a challenge cell — the floor's intro card must teach the
one new tool first (a 2–3 line Pip explainer), same as any node's `{note:}`
step, before the challenge cell.

### Floor 11 — "Chữ Hoa Đúng Luật" (new tool: `.isupper()` / `.islower()`)
- **Đề gốc:** LC 520 `detectCapitalUse` (String).
- **Đề bài (Pip):** "Một từ chỉ được xem là ĐÚNG LUẬT viết hoa nếu: cả từ
  viết hoa hết (`"USA"`), hoặc cả từ viết thường hết (`"pip"`), hoặc chỉ
  chữ cái đầu viết hoa (`"Kotopia"`). Cho `tu = "FlaG"`. Pip dạy thêm hai
  câu thần chú nhỏ: `tu.isupper()` và `tu.islower()` hỏi máy 'cả từ này có
  toàn hoa/toàn thường không?'. Dùng `while` + chỉ số `i` duyệt từng ký tự
  `tu[i]` để kiểm tra riêng chữ cái đầu khi cần."
- **expectOut:** `/khong dung luat/i` for `"FlaG"`; second seed `"Kotopia"` → `/dung luat/i`.

### Floor 12 — "A Trước, B Sau" (new tool: string indexing `s[i]`, `len(s)`)
- **Đề gốc:** LC 2124 `checkString` (String) — every 'a' before every 'b'.
- **Đề bài (Pip):** "Chuỗi bùa `s` chỉ gồm 'a' và 'b'. Luật tầng 12: mọi 'a'
  phải đứng trước mọi 'b' — hễ đã thấy 'b' một lần thì không được có 'a'
  nào sau đó nữa. Cho `s = "aaabbb"`. Dùng `while i < len(s):` duyệt
  `s[i]`, một biến cờ `da_thay_b` bật lên khi gặp 'b' đầu tiên."
- **expectOut:** `/dung luat/i` for `"aaabbb"`; second seed `"abab"` → `/sai luat/i`.

### Floor 13 — "Dải Dài Nhất" (reuses floor 12's indexing tool)
- **Đề gốc:** LC 1869 `checkZeroOnes` (String) — longest run of 1s vs 0s.
- **Đề bài (Pip):** "Chuỗi nhị phân `s` toàn '0' và '1'. So xem dải liên
  tiếp các '1' dài nhất, hay dải liên tiếp các '0' dài nhất, ai thắng. Cho
  `s = "1101"`. Dùng `while` + `s[i]`, hai biến đếm chạy + hai biến giữ kỷ lục."
- **expectOut:** `/^1 thang|so 1 thang/i` (phrase TBD by implementer) for
  `"1101"` (1s max run 2 > 0s max run 1 → 1 wins); second seed
  `"110100010"` → 0s win (run of 3 > run of 2).

### Floor 14 — "Xen Kẽ 0-1" (reuses indexing; introduces `%` on index parity)
- **Đề gốc:** LC 1758 `minOperations` (String) — min flips to alternate.
- **Đề bài (Pip):** "Chuỗi `s` toàn '0'/'1' phải trở thành XEN KẼ (không hai
  ký tự liền kề giống nhau) bằng ÍT PHÉP ĐỔI nhất. Cho `s = "0100"`. Dùng
  `while` + `s[i]`, so ký tự tại vị trí chẵn/lẻ (`i % 2`) với mẫu mong đợi,
  đếm số lệch — đáp án là số nhỏ hơn giữa 'đếm lệch với mẫu bắt đầu bằng 0'
  và 'đếm lệch với mẫu bắt đầu bằng 1'."
- **expectOut:** `/\b1\b/` for `"0100"`; second seed `"1111"` → `/\b2\b/`.

---

## Floors 16–19 — pre-boss-20 capstones (endless-tier flavor)

### Floor 16 — "Đếm Mảnh Ghép"
- **Đề gốc:** LC 434 `countSegments` (String) — count space-separated segments.
- **Đề bài (Pip):** "Câu thần chú `s` bị đứt thành nhiều mảnh bởi khoảng
  trắng. Đếm xem có bao nhiêu MẢNH chữ (không tính mảnh trắng). Cho
  `s = "Hello, my name is John"`. Dùng `while` + `s[i]`, phát hiện mỗi lần
  chuyển từ khoảng trắng sang chữ là bắt đầu một mảnh mới."
- **expectOut:** `/\b5\b/`.

### Floor 17 — "Rút Nguyên Âm"
- **Đề gốc:** LC 1119 `removeVowels` (String) — strip aeiou (new tool: `in`, string concat with `+=`).
- **Đề bài (Pip):** "Rút hết các nguyên âm a/e/i/o/u khỏi câu bùa `s`, ghép
  phần còn lại thành chuỗi mới rồi hô ra. Cho `s = "kotopia"`. Pip dạy thêm
  `if ky_tu in "aeiou":` (hỏi 'ký tự này có phải nguyên âm không') và cách
  nối chuỗi dần bằng `+=`."
- **expectOut:** `/ktp/i` (kotopia → ktp, minus vowels o,o,i,a... actually "kotopia" vowels o,o,i,a leave k,t,p → "ktp"; verify against student's own run before shipping).

### Floor 18 — "Chữ Thành Số" (new tool: `ord()`)
- **Đề gốc:** LC 171 `titleToNumber` (Math+String) — Excel column letters → number.
- **Đề bài (Pip):** "Cột bùa được đánh dấu bằng chữ cái kiểu Excel: A=1,
  B=2… Z=26, AA=27… Cho `s = "AB"` (2 ký tự cố định để tránh vòng lặp lồng
  phức tạp — mở rộng n ký tự để dành cho tầng cao hơn). Pip dạy `ord(ky_tu)
  - ord('A') + 1` để đổi 1 chữ cái thành số hạng vị trí, rồi công thức
  `hang_chuc * 26 + hang_don_vi`."
- **expectOut:** `/\b28\b/` (AB → 1*26+2=28).

### Floor 19 — "Đổi Cơ Số 7"
- **Đề gốc:** LC 504 `convertToBase7` (Math) — convert to base-7 string, handle negative sign.
- **Đề bài (Pip):** "Tầng áp chót nói tiếng cơ số 7. Cho `so = 100`. Dùng
  `while` chia lấy dư cho 7, GHÉP các chữ số dư THÀNH CHUỖI theo đúng thứ
  tự (chữ số cuối cùng tính ra phải nằm ĐẦU chuỗi kết quả — nối bằng
  `str(du) + ket_qua`, không phải `+=` xuôi) tới khi `so` về 0."
- **expectOut:** `/202/` (100 base 7 = 202).

---

## Floors reserved for boss (gesture-KO, not dataset-derived)

This staging document describes the first 20-floor build. In the current
30-floor tower, floors **5, 10, 15, 20, 25, 30** are boss floors — reuse
`boss-fight.js`'s `boss:{ko:true}` gesture-KO mode (☝ AIM → ✋ UNLEASH),
gated on the player having survived the 4 code floors before it. No
LeetCode-derived content needed there; listed here only so the floor
numbering above lines up with the original 20-floor sequence. Floors 21–30
were authored later directly in `content/tower.js`.

## Summary

- Dataset: 2641 train rows (+228 test), full LeetCodeDataset from HF.
- Easy difficulty: 638 rows.
- Passed concept filter (`tags ⊆ {String, Math}`, no List/Dict/Optional
  params in `starter_code`): **77 rows**.
- Hand-picked into this staging doc: **19 code floors** (floors 1, 2, 3, 4,
  6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19 — one per dataset problem —
  plus floor 1/9 and floor 3/9 deliberately pair two tiers of the same
  underlying idea) + 4 reserved boss-floor slots (5, 10, 15, 20), for a
  original 20-floor tower, later expanded to 30 floors.
- Every `expectOut` above is a **draft** regex sketch, not verified against
  a real Pyodide run — before shipping, an implementer must actually run
  each reference solution through the lesson engine and confirm the
  regex/output text matches, then follow this doc's "one new concept per
  step" flags (floors 11–19) by adding the matching mini `{note:}`
  teaching cards ahead of each challenge cell, per `CLAUDE.md`'s
  lesson-content sequencing rules.
