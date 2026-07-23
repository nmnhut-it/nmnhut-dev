// tower.js (content) — THÁP VÔ ĐỊNH tower-climb mode: 30 floors, floors
// 5/10/15/20/25/30 are gesture-KO boss checkpoints (`boss:{ko:true}`), the rest are
// `{code:...}` challenge cells with `expectOut` grading. Consumed by
// lessons/tower.js (a side-composition root modeled on island.js — NOT
// node.js, so a run here never touches the main 'magicdust.saga' counter).
// Every floor cell/boss cell carries an extra `floorNum` property (ignored by
// notebook-runner.js's buildCells(), which only reads its own known keys) —
// lessons/tower.js scans for it to map notebookRunner.seq indices -> floor
// numbers for the lives/score/floor-counter HUD (see TOWER-CLIMB-PLAN.md).
// Provenance: floors are ORIGINAL Vietnamese prose in Pip's voice, shaped
// after (not translated from) LeetCode Easy problems — see
// TOWER-FLOOR-CANDIDATES.md's licensing note. Every expectOut below has been
// verified against a real `python3` run of the reference solution (not a
// drafted guess) — see the tower's status entry in TOWER-CLIMB-PLAN.md.
export default {
  index: -1,
  sideIslandId: "tower",
  title: "THÁP VÔ ĐỊNH",
  subtitle: "leo càng cao, thử thách càng nặng — 3 mạng, xem bạn trụ tới tầng mấy",
  bundle: { art: "assets/rookie-bundle.webp", name: "CHÌA KHÓA THÁP VÔ ĐỊNH" },
  machine: { art: "assets/old-computer.webp", name: "CHÌA KHÓA THÁP", blurb: "mở tầng 1 của THÁP VÔ ĐỊNH — leo tới khi hết mạng hoặc chạm đỉnh" },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    { npc: "THÁP VÔ ĐỊNH sừng sững trước mặt tụi mình. 30 tầng, mỗi tầng một câu đố Mật Ngữ khó dần. Bạn có 3 MẠNG. Sai ba lần thì rớt khỏi tháp, nhưng leo càng cao, điểm càng lớn. Pip ở cạnh bạn; tầng đầu mở rồi." },
    { npc: "Pip thấy các tầng trong tháp dùng nhiều bài số học, nên trước mỗi câu đố tụi mình sẽ mở một ô luyện nhỏ. Ô luyện chỉ chỉ ra công cụ cần dùng; câu đố chính vẫn để bạn tự viết. Hai dấu `%` và `//` sẽ được luyện riêng trước khi dùng trong câu đố." },
    { npc: "Hai dấu sẽ gặp nhiều trong tháp: `%` lấy phần dư sau khi chia; `//` lấy thương nguyên, tức phần nguyên của kết quả chia. Ví dụ 17 chia 5 được 3 và còn dư 2." },
    { code: `from old_computer import say_num

number = 17
group_size = 5

remainder = number % group_size
quotient = number // group_size

say_num(remainder)
say_num(quotient)
`,
      label: "prep00_phan_du_thuong_nguyen.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 17`, `group_size = 5`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `17 % 5` in 2 vì còn dư 2; `17 // 5` in 3 vì có 3 nhóm đủ 5.",
      expectOut: { all: [/^2$/, /^3$/, { minLines: 2 }] },
      solution: `from old_computer import say_num

number = 17
group_size = 5

remainder = number % group_size
quotient = number // group_size

say_num(remainder)
say_num(quotient)
` },
    { npc: "Khi số chia là 10, hai dấu này giúp xử lý chữ số: `% 10` lấy chữ số cuối bên phải; `// 10` bỏ chữ số cuối bên phải và giữ phần còn lại." },
    { code: `from old_computer import say_num

number = 472

last_digit = number % 10
rest = number // 10

say_num(last_digit)
say_num(rest)
`,
      label: "prep00_tach_chu_so_cuoi.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 472`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `% 10` lấy chữ số cuối là 2; `// 10` bỏ chữ số cuối nên phần còn lại là 47.",
      expectOut: { all: [/^2$/, /^47$/, { minLines: 2 }] },
      solution: `from old_computer import say_num

number = 472

last_digit = number % 10
rest = number // 10

say_num(last_digit)
say_num(rest)
` },

    // ═══ TẦNG 1 — Cân Số Vô Định ═══
    { npc: "TẦNG 1: Cân Số Vô Định. Cửa tầng cho sẵn ba số `first`, `second`, `third`. Tính tích của ba số, tính tổng của ba số, rồi lấy tích trừ tổng." },
    { npc: "Kiến thức cần dùng: Python tính nhân bằng `*`, cộng bằng `+`. Nếu muốn tính tổng trước khi trừ, mình đặt tổng trong ngoặc để máy không hiểu nhầm thứ tự." },
    { code: `from old_computer import say_num

first = 2
second = 3
third = 4

product = first * second * third
total = first + second + third
answer = product - total

say_num(product)
say_num(total)
say_num(answer)
`,
      label: "prep01_tich_tong.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `first = 2`, `second = 3`, `third = 4`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy ba bước riêng: tích là 24, tổng là 9, tích trừ tổng là 15.",
      expectOut: { all: [/^24$/, /^9$/, /^15$/, { minLines: 3 }] },
      solution: `from old_computer import say_num

first = 2
second = 3
third = 4

product = first * second * third
total = first + second + third
answer = product - total

say_num(product)
say_num(total)
say_num(answer)
` },
    { code: `from old_computer import say_num

first = 2
second = 3
third = 4
# lượt của bạn: tính tích trừ tổng rồi in kết quả
`,
      label: "floor01_can_so.py", floorNum: 1,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `first = 2`, `second = 3`, `third = 4`. Không có INPUT từ ngoài chương trình ở tầng này.\nViệc cần làm: tính tích của ba số, tính tổng của ba số, rồi lấy tích trừ tổng.\nOUTPUT: dùng `say_num(...)` để in kết quả 15.',
      expectOut: /\b15\b/,
      solution: `from old_computer import say_num

first = 2
second = 3
third = 4
say_num(first * second * third - (first + second + third))
` },

    // ═══ TẦNG 2 — Đếm Số Lẻ Trong Vòng Vây ═══
    { npc: "TẦNG 2: Đếm Số Lẻ Trong Vòng Vây. Cửa tầng cho sẵn `low = 3` và `high = 7`. Tụi mình đi qua từng số từ 3 tới 7, tính cả hai đầu, rồi đếm số nào là số lẻ." },
    { npc: "Kiến thức cần dùng: `% 2` cho biết phần dư khi chia cho 2. Số lẻ có phần dư 1. Vòng `while` sẽ đưa `current` đi từng bước từ `low` tới `high`." },
    { code: `from old_computer import say_num

number = 5
remainder = number % 2
say_num(remainder)
`,
      label: "prep02_so_le.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 5`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `5 % 2` cho phần dư 1, nên 5 là số lẻ.",
      expectOut: /^1$/,
      solution: `from old_computer import say_num

number = 5
remainder = number % 2
say_num(remainder)
` },
    { code: `from old_computer import say_num

low = 3
high = 7
count = 0
current = low
while current <= high:
    # lượt của bạn: hoàn thành phần đếm số lẻ
    current = current + 1
say_num(count)
`,
      label: "floor02_dem_so_le.py", floorNum: 2,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `low = 3`, `high = 7`. Không có INPUT từ ngoài chương trình.\nKhái niệm: số lẻ là số có phần dư 1 khi chia cho 2. Ví dụ: 3 và 5 là số lẻ vì chia cho 2 dư 1; 4 không phải số lẻ vì chia cho 2 dư 0. `current` là số đang được xét trong vòng lặp.\nViệc cần làm: đếm các số lẻ từ `low` tới `high`, tính cả hai đầu.\nOUTPUT: sau vòng lặp, `say_num(count)` phải in 3.',
      expectOut: /\b3\b/,
      solution: `from old_computer import say_num

low = 3
high = 7
count = 0
current = low
while current <= high:
    if current % 2 == 1:
        count = count + 1
    current = current + 1
say_num(count)
` },

    // ═══ TẦNG 3 — Gương Ba Chữ Số ═══
    { npc: "TẦNG 3: Gương Ba Chữ Số. Cửa tầng cho sẵn ba chữ số của số 121: `hundreds`, `tens`, `ones`. Số này đối xứng khi chữ số hàng trăm bằng chữ số hàng đơn vị." },
    { npc: "Kiến thức cần dùng: với số có 3 chữ số, hàng trăm ở bên trái, hàng đơn vị ở bên phải. Để kiểm tra đối xứng, chỉ cần so sánh hai chữ số ngoài cùng." },
    { code: `from old_computer import say

hundreds = 3
tens = 8
ones = 3

if hundreds == ones:
    say("DOI XUNG")
else:
    say("LECH")
`,
      label: "prep03_so_doi_xung.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `hundreds = 3`, `tens = 8`, `ones = 3`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy máy chỉ so hàng trăm với hàng đơn vị. Hai bên đều là 3 nên output là `DOI XUNG`.",
      expectOut: /^DOI XUNG$/,
      solution: `from old_computer import say

hundreds = 3
tens = 8
ones = 3

if hundreds == ones:
    say("DOI XUNG")
else:
    say("LECH")
` },
    { code: `from old_computer import say

hundreds = 1
tens = 2
ones = 1
# lượt của bạn: xác định số này đối xứng hay lệch
`,
      label: "floor03_guong_ba_chu_so.py", floorNum: 3,
      note: 'ĐỀ BÀI\nKhái niệm: số 3 chữ số được gọi là `đối xứng` nếu chữ số hàng trăm bằng chữ số hàng đơn vị. Nếu hai chữ số đó khác nhau thì gọi là `lệch`. Ví dụ: 121 đối xứng vì hàng trăm và hàng đơn vị đều là 1; 123 lệch vì 1 khác 3.\nGiá trị cho sẵn: `hundreds = 1`, `tens = 2`, `ones = 1`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: xác định số 121 thuộc trường hợp nào.\nOUTPUT: in `DOI XUNG` hoặc `LECH`.',
      expectOut: /doi xung/i,
      solution: `from old_computer import say

hundreds = 1
tens = 2
ones = 1
if hundreds == ones:
    say("DOI XUNG")
else:
    say("LECH")
` },

    { checkpoint: { text: "Ba tầng đầu luyện ba kiểu việc nhỏ: tính biểu thức, dùng `while` để đi qua nhiều số, và dùng `if` để chọn một kết quả. Các số trong starter code đều là giá trị cho sẵn, chưa phải INPUT thật từ người dùng hay camera." } },
    { quiz: { title: "Tầng 1-3 cần làm gì", questions: [
        { q: "Trong tầng 2, `current = low` rồi `while current <= high:` dùng để làm gì?", a: ["Đi qua từng số từ `low` tới `high`", "Đọc INPUT từ bàn phím", "In luôn đáp án"], correct: 0 },
        { q: "`first = 2` trong tầng 1 là gì?", a: ["Giá trị cho sẵn trong code", "INPUT do người chơi nhập", "OUTPUT của chương trình"], correct: 0 },
      ] } },

    // ═══ TẦNG 4 — Số Hoàn Hảo ═══
    { npc: "TẦNG 4: Số Hoàn Hảo. Một số được gọi là `số hoàn hảo` nếu tổng các ước số nhỏ hơn nó đúng bằng chính số đó. Ví dụ với 28, các ước số nhỏ hơn 28 là 1, 2, 4, 7, 14." },
    { npc: "Kiến thức cần dùng: `number % factor == 0` nghĩa là chia `number` cho `factor` không dư, nên `factor` là một ước của `number`. Đặt `total = 0`, rồi cộng từng ước số tìm được vào `total`." },
    { code: `from old_computer import say_num

number = 6
factor = 1
total = 0
while factor < number:
    if number % factor == 0:
        total = total + factor
    factor = factor + 1

say_num(total)
`,
      label: "prep04_uoc_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 6`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy tổng các ước số nhỏ hơn 6 là 1 + 2 + 3 = 6.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

number = 6
factor = 1
total = 0
while factor < number:
    if number % factor == 0:
        total = total + factor
    factor = factor + 1

say_num(total)
` },
    { code: `from old_computer import say

number = 28
factor = 1
total = 0
while factor < number:
    # lượt của bạn: hoàn thành phần cộng các ước số
    factor = factor + 1
# lượt của bạn: in kết luận cho number
`,
      label: "floor04_so_hoan_hao.py", floorNum: 4,
      note: 'ĐỀ BÀI\nKhái niệm: `số hoàn hảo` là số có tổng các ước số nhỏ hơn nó bằng chính nó. Ví dụ: 6 là số hoàn hảo vì 1 + 2 + 3 = 6; 10 không phải vì 1 + 2 + 5 = 8.\nGiá trị cho sẵn: `number = 28`. Không có INPUT từ ngoài chương trình.\n`factor` là số đang thử làm ước. `number % factor == 0` nghĩa là `number` chia hết cho `factor`.\nViệc cần làm: kiểm tra các ước số nhỏ hơn `number`, rồi kết luận 28 có phải số hoàn hảo không.\nOUTPUT: in `HOAN HAO` hoặc `KHONG HOAN HAO`. Với 28, output đúng là `HOAN HAO`.',
      expectOut: /\bhoan hao\b/i,
      solution: `from old_computer import say

number = 28
factor = 1
total = 0
while factor < number:
    if number % factor == 0:
        total = total + factor
    factor = factor + 1
if total == number:
    say("HOAN HAO")
else:
    say("KHONG HOAN HAO")
` },

    // ═══ TẦNG 5 — BOSS ═══
    { npc: "TẦNG 5: một con TRÙNG GÁC CỬA hiện ra, cản đường lên tầng 6. Ôn lại 4 tầng vừa leo để rèn BOM MẬT NGỮ, rồi giơ tay phóng bom khống chế nó." },
    { forge: { quiz: [
        { q: "Với `first = 2`, `second = 3`, `third = 4`, biểu thức nào tính tích trừ tổng?", a: ["first * second * third - (first + second + third)", "first + second + third - first * second * third", "first * (second + third)"], correct: 0 },
        { q: "Muốn biết `current` là số lẻ, điều kiện nào đúng?", a: ["current % 2 == 1", "current / 2 == 1", "current == 2"], correct: 0 },
        { q: "`while factor < number:` dừng khi nào?", a: ["Khi `factor < number` trở thành sai", "Khi `factor` vẫn nhỏ hơn `number`", "Không bao giờ dừng"], correct: 0 },
      ] } },
    { boss: { name: "TRÙNG GÁC CỬA TẦNG 5", sheet: { src: "assets/tower-warden-05-sheet.webp" }, art: "assets/tower-warden-05.webp", glyph: "🐛", ko: true }, floorNum: 5 },

    // ═══ TẦNG 6 — Số Hợp Lệ 2-3-5 ═══
    { npc: "TẦNG 6: Số Hợp Lệ 2-3-5. Trong tầng này, một số được gọi là `hợp lệ` nếu sau khi chia hết mức cho 2, 3, và 5, phần còn lại là 1. Cửa cho sẵn `number = 6`." },
    { npc: "Kiến thức cần dùng: khi `left % 2 == 0`, `left` còn chia hết cho 2. Dòng `left = left // 2` lấy thương nguyên, tức là bỏ một lần nhân 2 khỏi `left`." },
    { code: `from old_computer import say_num

left = 12
while left % 2 == 0:
    left = left // 2

say_num(left)
`,
      label: "prep06_chia_het_muc.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `left = 12`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy vòng `while` chia 12 cho 2 hết mức: 12 thành 6, rồi 3. Khi còn 3 thì không chia hết cho 2 nữa.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

left = 12
while left % 2 == 0:
    left = left // 2

say_num(left)
` },
    { code: `from old_computer import say

number = 6
left = number
# lượt của bạn: kiểm tra number theo luật hợp lệ 2-3-5
`,
      label: "floor06_chi_con_235.py", floorNum: 6,
      note: 'ĐỀ BÀI\nKhái niệm: trong tầng này, `HOP LE` nghĩa là số ban đầu chỉ còn lại 1 sau khi chia hết mức cho 2, 3, và 5. Nếu còn lại số khác 1 thì in `KHONG HOP LE`. Ví dụ: 6 là `HOP LE` vì chia hết mức cho 2 và 3 thì còn 1; 14 không hợp lệ vì sau khi chia cho 2 vẫn còn 7.\nGiá trị cho sẵn: `number = 6`. Không có INPUT từ ngoài chương trình.\n`left` là phần còn lại trong lúc kiểm tra. Có thể dùng `%` để biết còn chia hết không và `//` để lấy thương nguyên.\nViệc cần làm: kiểm tra `number` theo luật trên.\nOUTPUT: in `HOP LE` hoặc `KHONG HOP LE`. Với 6, output đúng là `HOP LE`.',
      expectOut: /hop le/i,
      solution: `from old_computer import say

number = 6
left = number
while left % 2 == 0:
    left = left // 2
while left % 3 == 0:
    left = left // 3
while left % 5 == 0:
    left = left // 5
if left == 1:
    say("HOP LE")
else:
    say("KHONG HOP LE")
` },

    // ═══ TẦNG 7 — Số Tự Hào ═══
    { npc: "TẦNG 7: Số Tự Hào. Một số có 3 chữ số được gọi là `số tự hào` nếu lấy từng chữ số lập phương rồi cộng lại, kết quả đúng bằng số ban đầu. Cửa tầng cho sẵn `number = 153`." },
    { npc: "Kiến thức cần dùng: `% 10` lấy chữ số cuối của `left`; `// 10` bỏ chữ số cuối vừa xử lý. Lập phương một chữ số nghĩa là nhân chữ số đó với chính nó ba lần." },
    { code: `from old_computer import say_num

left = 153
digit = left % 10
cube = digit * digit * digit

say_num(digit)
say_num(cube)
`,
      label: "prep07_lap_phuong_chu_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `left = 153`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `% 10` lấy chữ số cuối là 3, rồi `3 * 3 * 3` bằng 27.",
      expectOut: { all: [/^3$/, /^27$/, { minLines: 2 }] },
      solution: `from old_computer import say_num

left = 153
digit = left % 10
cube = digit * digit * digit

say_num(digit)
say_num(cube)
` },
    { code: `from old_computer import say

number = 153
left = number
total = 0
while left > 0:
    # lượt của bạn: xử lý một chữ số của left
    left = left // 10
`,
      label: "floor07_so_tu_hao.py", floorNum: 7,
      note: 'ĐỀ BÀI\nKhái niệm: `số tự hào` là số có 3 chữ số mà tổng lập phương các chữ số bằng chính số đó. Ví dụ: 153 là số tự hào vì 1*1*1 + 5*5*5 + 3*3*3 = 153; 154 không phải vì tổng lập phương các chữ số là 190.\nGiá trị cho sẵn: `number = 153`. Không có INPUT từ ngoài chương trình.\n`left` là phần số còn lại cần xét. `% 10` giúp lấy chữ số cuối; `// 10` giúp bỏ chữ số cuối.\nViệc cần làm: tính tổng lập phương các chữ số của `number`, rồi kết luận.\nOUTPUT: in `TU HAO` hoặc `KHONG TU HAO`. Với 153, output đúng là `TU HAO`.',
      expectOut: /\btu hao\b/i,
      solution: `from old_computer import say

number = 153
left = number
total = 0
while left > 0:
    digit = left % 10
    total = total + digit * digit * digit
    left = left // 10
if total == number:
    say("TU HAO")
else:
    say("KHONG TU HAO")
` },

    // ═══ TẦNG 8 — Tổng Chữ Số Theo Cơ Số ═══
    { npc: "TẦNG 8 nói bằng cơ số khác hệ 10 quen thuộc. Cửa tầng cho sẵn `number = 34` và `base = 6`; nhiệm vụ là cộng các chữ số của 34 khi viết theo cơ số 6." },
    { npc: "Kiến thức cần dùng: với cơ số `base`, phép `% base` lấy chữ số cuối theo cơ số đó, còn `// base` bỏ chữ số vừa lấy. Đây là cùng mẫu với `% 10` và `// 10`, chỉ đổi 10 thành `base`." },
    { code: `from old_computer import say_num

number = 34
base = 6

last_digit = number % base
rest = number // base

say_num(last_digit)
say_num(rest)
`,
      label: "prep08_co_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 34`, `base = 6`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 34 chia cho 6 được 5 dư 4. Vì vậy chữ số cuối theo cơ số 6 là 4, phần còn lại là 5.",
      expectOut: { all: [/^4$/, /^5$/, { minLines: 2 }] },
      solution: `from old_computer import say_num

number = 34
base = 6

last_digit = number % base
rest = number // base

say_num(last_digit)
say_num(rest)
` },
    { code: `from old_computer import say_num

number = 34
base = 6
left = number
total = 0
# lượt của bạn: tính tổng chữ số của number trong cơ số base
`,
      label: "floor08_tong_chu_so_co_so.py", floorNum: 8,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `number = 34`, `base = 6`. Không có INPUT từ ngoài chương trình.\nKhái niệm: khi xét một số theo cơ số `base`, `% base` giúp lấy chữ số cuối và `// base` giúp bỏ chữ số đó. Ví dụ: 34 ở hệ 10 viết theo cơ số 6 là `54`, nên tổng chữ số là 5 + 4 = 9.\nViệc cần làm: tính tổng các chữ số của 34 khi viết theo cơ số 6.\nOUTPUT: `say_num(total)` phải in 9.',
      expectOut: /\b9\b/,
      solution: `from old_computer import say_num

number = 34
base = 6
left = number
total = 0
while left > 0:
    total = total + left % base
    left = left // base
say_num(total)
` },

    // ═══ TẦNG 9 — Gương Vô Tận ═══
    { npc: "TẦNG 9 nâng cấp tầng 3: lần này số có thể dài hơn 3 chữ số. Cửa tầng cho sẵn `number = 12321`; tạo `reversed_number` rồi so sánh với giá trị ban đầu." },
    { npc: "Kiến thức cần dùng: `reversed_number = reversed_number * 10 + digit` đưa chữ số vừa lấy vào bên phải của kết quả đang tạo. Mỗi vòng chỉ xử lý một chữ số." },
    { code: `from old_computer import say_num

left = 123
reversed_number = 0

digit = left % 10
reversed_number = reversed_number * 10 + digit
left = left // 10

say_num(digit)
say_num(reversed_number)
say_num(left)
`,
      label: "prep09_tao_so_dao.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `left = 123`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy một vòng xử lý: lấy chữ số cuối 3, ghi 3 vào `reversed_number`, rồi bỏ chữ số cuối khỏi `left` để còn 12.",
      expectOut: { all: [/^3$/, /^12$/, { minLines: 3 }] },
      solution: `from old_computer import say_num

left = 123
reversed_number = 0

digit = left % 10
reversed_number = reversed_number * 10 + digit
left = left // 10

say_num(digit)
say_num(reversed_number)
say_num(left)
` },
    { code: `from old_computer import say

number = 12321
left = number
reversed_number = 0
while left > 0:
    # lượt của bạn: đưa một chữ số sang reversed_number
    left = left // 10
`,
      label: "floor09_guong_vo_tan.py", floorNum: 9,
      note: 'ĐỀ BÀI\nKhái niệm: một số được gọi là `đối xứng` nếu đọc từ trái sang phải hay từ phải sang trái đều ra cùng một số. Ví dụ: 1221 đối xứng vì đọc ngược vẫn là 1221; 1231 không đối xứng vì đọc ngược thành 1321.\nGiá trị cho sẵn: `number = 12321`. Không có INPUT từ ngoài chương trình.\n`left` là phần số còn lại; `reversed_number` là số đang được tạo theo thứ tự ngược.\nViệc cần làm: tạo số đảo chiều của `number`, rồi kết luận số ban đầu có đối xứng không.\nOUTPUT: in `DOI XUNG` hoặc `KHONG DOI XUNG`.',
      expectOut: /doi xung/i,
      solution: `from old_computer import say

number = 12321
left = number
reversed_number = 0
while left > 0:
    digit = left % 10
    reversed_number = reversed_number * 10 + digit
    left = left // 10
if reversed_number == number:
    say("DOI XUNG")
else:
    say("KHONG DOI XUNG")
` },

    { checkpoint: { text: "Tầng 6-9 dùng cùng một mẫu với số: giữ một biến `left`, lấy phần cần dùng bằng `%`, bỏ phần vừa xử lý bằng `//`, và dừng khi `left` về 0 hoặc 1. `number` là giá trị ban đầu để so sánh lại, không phải INPUT mới." } },
    { quiz: { title: "Mẫu `%` và `//`", questions: [
        { q: "Trong tầng 7, `digit = left % 10` lấy gì?", a: ["Chữ số cuối của `left`", "Chữ số đầu của `left`", "Tổng các chữ số"], correct: 0 },
        { q: "Sau khi lấy chữ số cuối, `left = left // 10` làm gì?", a: ["Bỏ chữ số cuối khỏi `left`", "Thêm một chữ số vào `left`", "Đọc INPUT mới"], correct: 0 },
      ] } },

    // ═══ TẦNG 10 — BOSS ═══
    { npc: "TẦNG 10: TRÙNG GÁC CỬA thứ hai đang canh giữa tháp. Ôn lại bốn tầng về `%`, `//`, `left`, `total`, rồi rèn bom và hạ nó." },
    { forge: { quiz: [
        { q: "Muốn lấy chữ số cuối của `left = 153`, phép tính nào đúng?", a: ["left % 10", "left // 10", "left * 10"], correct: 0 },
        { q: "Muốn bỏ chữ số cuối khỏi `left`, dòng nào đúng?", a: ["left = left // 10", "left = left % 10", "left = left - 10"], correct: 0 },
        { q: "Trong tầng 9, vì sao cần giữ `number` riêng với `left`?", a: ["Để cuối bài còn so sánh với giá trị ban đầu", "Để đọc thêm INPUT", "Để in nhiều dòng hơn"], correct: 0 },
      ] } },
    { boss: { name: "TRÙNG GÁC CỬA TẦNG 10", sheet: { src: "assets/tower-warden-10-sheet.webp" }, art: "assets/tower-warden-10.webp", glyph: "🐜", ko: true }, floorNum: 10 },

    // ═══ TẦNG 11 — Chữ Số Hàng Chục ═══
    { npc: "TẦNG 11 quay lại với số. Cửa tầng cho sẵn `number = 472`; nhiệm vụ là lấy chữ số hàng chục, tức là chữ số 7 trong số này." },
    { npc: "Kiến thức cần dùng: muốn lấy hàng chục, mình bỏ hàng đơn vị trước bằng `number // 10`, rồi lấy phần dư khi chia cho 10." },
    { code: `from old_computer import say_num

number = 472
without_ones = number // 10
tens_digit = without_ones % 10

say_num(without_ones)
say_num(tens_digit)
`,
      label: "prep11_hang_chuc.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 472`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `472 // 10` thành 47, rồi `47 % 10` lấy hàng chục là 7.",
      expectOut: { all: [/^47$/, /^7$/, { minLines: 2 }] },
      solution: `from old_computer import say_num

number = 472
without_ones = number // 10
tens_digit = without_ones % 10

say_num(without_ones)
say_num(tens_digit)
` },
    { quiz: { title: "Hàng đơn vị và hàng chục", questions: [
        { q: "Trong số `472`, chữ số hàng đơn vị là chữ số nào?", a: ["2", "7", "4"], correct: 0 },
        { q: "Trong số `472`, chữ số hàng chục là chữ số nào?", a: ["7", "2", "4"], correct: 0 },
      ] } },
    { code: `from old_computer import say_num

number = 472
tens_digit = 0
# lượt của bạn: gán chữ số hàng chục của number vào tens_digit
say_num(tens_digit)
`,
      label: "floor11_hang_chuc.py", floorNum: 11,
      note: 'ĐỀ BÀI\nKhái niệm: chữ số hàng chục là chữ số đứng ngay bên trái hàng đơn vị. Ví dụ: trong 472, hàng đơn vị là 2, hàng chục là 7, hàng trăm là 4.\nGiá trị cho sẵn: `number = 472`. Không có INPUT từ ngoài chương trình.\nCông cụ có thể dùng: `//` để bỏ bớt phần bên phải của số, và `%` để lấy phần dư.\nViệc cần làm: gán chữ số hàng chục của `number` vào `tens_digit`.\nOUTPUT: `say_num(tens_digit)` phải in 7.',
      expectOut: /\b7\b/,
      solution: `from old_computer import say_num

number = 472
tens_digit = (number // 10) % 10
say_num(tens_digit)
` },

    // ═══ TẦNG 12 — Tổng Ba Chữ Số ═══
    { npc: "TẦNG 12 cho sẵn `number = 583`. Tầng này cần tách ba chữ số của số đó rồi cộng lại: hàng trăm, hàng chục, và hàng đơn vị." },
    { npc: "Kiến thức cần dùng: với số có 3 chữ số, `// 100` lấy hàng trăm, `% 10` lấy hàng đơn vị, còn hàng chục dùng mẫu của tầng trước." },
    { code: `from old_computer import say_num

number = 583
hundreds = number // 100
tens = (number // 10) % 10
ones = number % 10

say_num(hundreds)
say_num(tens)
say_num(ones)
`,
      label: "prep12_tach_ba_chu_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 583`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 583 tách thành hàng trăm 5, hàng chục 8, hàng đơn vị 3.",
      expectOut: { all: [/^5$/, /^8$/, /^3$/, { minLines: 3 }] },
      solution: `from old_computer import say_num

number = 583
hundreds = number // 100
tens = (number // 10) % 10
ones = number % 10

say_num(hundreds)
say_num(tens)
say_num(ones)
` },
    { code: `from old_computer import say_num

number = 583
digit_sum = 0
# lượt của bạn: tính tổng ba chữ số của number
say_num(digit_sum)
`,
      label: "floor12_tong_ba_chu_so.py", floorNum: 12,
      note: 'ĐỀ BÀI\nKhái niệm: một số có 3 chữ số gồm hàng trăm, hàng chục, và hàng đơn vị. Ví dụ: 583 gồm 5 trăm, 8 chục, 3 đơn vị; tổng ba chữ số là 16.\nGiá trị cho sẵn: `number = 583`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: tính tổng ba chữ số của `number`.\nOUTPUT: `say_num(digit_sum)` phải in 16.',
      expectOut: /\b16\b/,
      solution: `from old_computer import say_num

number = 583
hundreds = number // 100
tens = (number // 10) % 10
ones = number % 10
digit_sum = hundreds + tens + ones
say_num(digit_sum)
` },

    // ═══ TẦNG 13 — Đếm Chữ Số ═══
    { npc: "TẦNG 13 cho sẵn `number = 9042`. Mục tiêu là đếm xem số này có bao nhiêu chữ số." },
    { npc: "Kiến thức cần dùng: mỗi lần `left = left // 10`, số đang xét mất một chữ số ở bên phải. Vậy mỗi vòng bỏ một chữ số thì `count` tăng thêm 1." },
    { code: `from old_computer import say_num

number = 51
left = number
count = 0
while left > 0:
    count = count + 1
    left = left // 10

say_num(count)
`,
      label: "prep13_dem_chu_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 51`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 51 có 2 chữ số. Vòng lặp bỏ 1, rồi bỏ 5, nên `count` thành 2.",
      expectOut: /^2$/,
      solution: `from old_computer import say_num

number = 51
left = number
count = 0
while left > 0:
    count = count + 1
    left = left // 10

say_num(count)
` },
    { code: `from old_computer import say_num

number = 9042
left = number
count = 0
# lượt của bạn: đếm số chữ số của number
say_num(count)
`,
      label: "floor13_dem_chu_so.py", floorNum: 13,
      note: 'ĐỀ BÀI\nKhái niệm: đếm chữ số là đếm số ký tự số tạo nên một số. Ví dụ: 9042 có bốn chữ số là 9, 0, 4, 2.\nGiá trị cho sẵn: `number = 9042`. Không có INPUT từ ngoài chương trình.\n`left` là phần số còn lại trong lúc xử lý.\nViệc cần làm: đếm số chữ số của `number`.\nOUTPUT: `say_num(count)` phải in 4.',
      expectOut: /\b4\b/,
      solution: `from old_computer import say_num

number = 9042
left = number
count = 0
while left > 0:
    count = count + 1
    left = left // 10
say_num(count)
` },

    // ═══ TẦNG 14 — Đảo Chữ Số ═══
    { npc: "TẦNG 14 cho sẵn `number = 407`. Đảo chữ số nghĩa là đổi thứ tự chữ số từ phải sang trái thành trái sang phải, nên 407 trở thành 704." },
    { npc: "Kiến thức cần dùng: để tạo số đảo, mỗi vòng lấy chữ số cuối bằng `% 10`, rồi đưa chữ số đó vào bên phải của `reversed_number` bằng `* 10 + digit`." },
    { code: `from old_computer import say_num

number = 23
left = number
reversed_number = 0
while left > 0:
    digit = left % 10
    reversed_number = reversed_number * 10 + digit
    left = left // 10

say_num(reversed_number)
`,
      label: "prep14_dao_chu_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 23`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy mẫu tạo số đảo: 23 trở thành 32.",
      expectOut: /^32$/,
      solution: `from old_computer import say_num

number = 23
left = number
reversed_number = 0
while left > 0:
    digit = left % 10
    reversed_number = reversed_number * 10 + digit
    left = left // 10

say_num(reversed_number)
` },
    { code: `from old_computer import say_num

number = 407
left = number
reversed_number = 0
# lượt của bạn: tạo số đảo chữ số của number
say_num(reversed_number)
`,
      label: "floor14_dao_chu_so.py", floorNum: 14,
      note: 'ĐỀ BÀI\nKhái niệm: số đảo chữ số của một số là số tạo được khi đọc các chữ số theo chiều ngược lại. Ví dụ: 407 đọc ngược thành 704; 351 đọc ngược thành 153.\nGiá trị cho sẵn: `number = 407`. Không có INPUT từ ngoài chương trình.\n`left` là phần số còn lại trong lúc xử lý; `reversed_number` là số đảo đang được tạo.\nViệc cần làm: tạo số đảo chữ số của `number`.\nOUTPUT: `say_num(reversed_number)` phải in 704.',
      expectOut: /\b704\b/,
      solution: `from old_computer import say_num

number = 407
left = number
reversed_number = 0
while left > 0:
    digit = left % 10
    reversed_number = reversed_number * 10 + digit
    left = left // 10
say_num(reversed_number)
` },

    { checkpoint: { text: "Tầng 11-14 luyện tách và xử lý chữ số: dùng `//` để bỏ bớt phần bên phải, dùng `%` để lấy phần dư, và giữ một biến như `left` hoặc `reversed_number` để theo dõi số đang xử lý." } },
    { quiz: { title: "Tách chữ số", questions: [
        { q: "Trong số `583`, tổng ba chữ số là bao nhiêu?", a: ["16", "15", "583"], correct: 0 },
        { q: "Số đảo chữ số của `407` là số nào?", a: ["704", "470", "407"], correct: 0 },
      ] } },

    // ═══ TẦNG 15 — BOSS ═══
    { npc: "TẦNG 15: TRÙNG GÁC CỬA thứ ba chắn nửa đường lên đỉnh. Ôn lại tách chữ số, đếm chữ số, và đảo chữ số rồi rèn bom." },
    { forge: { quiz: [
        { q: "Trong số `472`, chữ số hàng chục là chữ số nào?", a: ["7", "2", "4"], correct: 0 },
        { q: "Muốn đếm chữ số của `9042`, kết quả đúng là bao nhiêu?", a: ["4", "3", "9042"], correct: 0 },
        { q: "Số đảo chữ số của `407` là số nào?", a: ["704", "470", "407"], correct: 0 },
      ] } },
    { boss: { name: "TRÙNG GÁC CỬA TẦNG 15", sheet: { src: "assets/tower-warden-15-sheet.webp" }, art: "assets/tower-warden-15.webp", glyph: "🦂", ko: true }, floorNum: 15 },

    // ═══ TẦNG 16 — Đếm Mảnh Chữ ═══
    { npc: "TẦNG 16: Cửa tầng cho sẵn một câu có nhiều mảnh chữ tách bởi khoảng trắng. Mục tiêu là đếm mảnh chữ, không đếm khoảng trắng." },
    { npc: "Kiến thức cần dùng: `text[index]` lấy ký tự tại vị trí `index`. Một mảnh chữ bắt đầu khi ký tự hiện tại không phải khoảng trắng và ký tự ngay trước nó là khoảng trắng. Riêng vị trí 0 cũng có thể là đầu mảnh chữ." },
    { code: `from old_computer import say

text = "hi Pip"
index = 3

if text[index] != " " and text[index - 1] == " ":
    say("BAT DAU")
else:
    say("KHONG PHAI")
`,
      label: "prep16_dau_manh_chu.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `text = \"hi Pip\"`, `index = 3`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `text[3]` là chữ `P`, còn `text[2]` là khoảng trắng. Vì vậy vị trí 3 là đầu một mảnh chữ.",
      expectOut: /^BAT DAU$/,
      solution: `from old_computer import say

text = "hi Pip"
index = 3

if text[index] != " " and text[index - 1] == " ":
    say("BAT DAU")
else:
    say("KHONG PHAI")
` },
    { code: `from old_computer import say_num

text = "Hello, my name is John"
index = 0
count = 0
while index < len(text):
    # lượt của bạn: nhận ra đầu mỗi mảnh chữ
    index = index + 1
`,
      label: "floor16_dem_manh_chu.py", floorNum: 16,
      note: 'ĐỀ BÀI\nKhái niệm: `mảnh chữ` là một đoạn ký tự không có khoảng trắng ở giữa. Ví dụ: câu `"Hello, my name is John"` có 5 mảnh chữ.\nGiá trị cho sẵn: `text = "Hello, my name is John"`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: đếm số mảnh chữ trong câu, không đếm khoảng trắng.\nOUTPUT: `say_num(count)` phải in 5.',
      expectOut: /\b5\b/,
      solution: `from old_computer import say_num

text = "Hello, my name is John"
index = 0
count = 0
while index < len(text):
    if text[index] != " " and (index == 0 or text[index - 1] == " "):
        count = count + 1
    index = index + 1
say_num(count)
` },

    // ═══ TẦNG 17 — Rút Nguyên Âm ═══
    { npc: "TẦNG 17 thêm phép hỏi `in`: `letter in \"aeiou\"` kiểm tra ký tự có nằm trong nhóm nguyên âm không. Cửa tầng cho sẵn `text = \"kotopia\"`; cần giữ lại các ký tự không phải nguyên âm." },
    { code: `from old_computer import say

letter = "e"

if letter in "aeiou":
    say("NGUYEN AM")
else:
    say("KHAC")
`,
      label: "prep17_in_nguyen_am.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `letter = \"e\"`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `letter in \"aeiou\"` đúng vì `e` nằm trong nhóm a/e/i/o/u.",
      expectOut: /^NGUYEN AM$/,
      solution: `from old_computer import say

letter = "e"

if letter in "aeiou":
    say("NGUYEN AM")
else:
    say("KHAC")
` },
    { quiz: { title: "Phép hỏi in", questions: [
        { q: '`letter = "e"`. `letter in "aeiou"` trả về gì?', a: ["True", "False", "Lỗi"], correct: 0 },
        { q: '`result = "k"`. Muốn nối thêm `"t"` vào cuối, cách nào đúng?', a: ['result = result + "t"', 'result = "t" + result', 'result = result - "t"'], correct: 0 },
      ] } },
    { code: `from old_computer import say

text = "kotopia"
index = 0
result = ""
while index < len(text):
    # lượt của bạn: giữ lại các ký tự không phải nguyên âm
    index = index + 1
say(result)
`,
      label: "floor17_rut_nguyen_am.py", floorNum: 17,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `text = "kotopia"`. Không có INPUT từ ngoài chương trình.\n`text[index] not in "aeiou"` nghĩa là ký tự hiện tại không phải a/e/i/o/u.\nViệc cần làm: tạo chuỗi mới chỉ gồm các ký tự không phải nguyên âm.\nOUTPUT: `say(result)` phải in `ktp`.',
      expectOut: /ktp/i,
      solution: `from old_computer import say

text = "kotopia"
index = 0
result = ""
while index < len(text):
    if text[index] not in "aeiou":
        result = result + text[index]
    index = index + 1
say(result)
` },

    // ═══ TẦNG 18 — Chữ Thành Số ═══
    { npc: "TẦNG 18 dạy `ord(letter)`: Python cho biết mã số của một ký tự. Với chữ cái in hoa, công thức `ord(letter) - ord(\"A\") + 1` đổi A thành 1, B thành 2, tới Z thành 26." },
    { code: `from old_computer import say_num

letter = "C"
value = ord(letter) - ord("A") + 1

say_num(value)
`,
      label: "prep18_ord.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `letter = \"C\"`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy công thức đếm từ A: A là 1, B là 2, C là 3.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

letter = "C"
value = ord(letter) - ord("A") + 1

say_num(value)
` },
    { quiz: { title: "ord()", questions: [
        { q: '`ord("A") - ord("A") + 1` bằng bao nhiêu?', a: ["1", "0", "65"], correct: 0 },
        { q: '`ord("B") - ord("A") + 1` bằng bao nhiêu?', a: ["2", "1", "66"], correct: 0 },
      ] } },
    { code: `from old_computer import say_num

text = "AB"
first_value = ord(text[0]) - ord("A") + 1
second_value = ord(text[1]) - ord("A") + 1
# lượt của bạn: tính số cột tương ứng với text
`,
      label: "floor18_chu_thanh_so.py", floorNum: 18,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `text = "AB"`. Không có INPUT từ ngoài chương trình.\n`first_value` là giá trị của chữ đầu, `second_value` là giá trị của chữ thứ hai. Với cách đánh số cột kiểu Excel, sau `Z` mới tới `AA`, rồi `AB`.\nViệc cần làm: tính số cột tương ứng với `text`.\nOUTPUT: `say_num(...)` phải in 28.',
      expectOut: /\b28\b/,
      solution: `from old_computer import say_num

text = "AB"
first_value = ord(text[0]) - ord("A") + 1
second_value = ord(text[1]) - ord("A") + 1
say_num(first_value * 26 + second_value)
` },

    // ═══ TẦNG 19 — Đổi Sang Cơ Số 7 ═══
    { npc: "TẦNG 19 cho sẵn `number = 100` ở hệ 10. Nhiệm vụ là viết số đó theo cơ số 7 bằng cách lấy phần dư nhiều lần và ghép phần dư vừa lấy vào đầu chuỗi kết quả." },
    { npc: "Kiến thức cần dùng: khi đổi sang cơ số 7, mỗi vòng lấy `left % 7` để biết chữ số bên phải, rồi dùng `left = left // 7` để bỏ phần vừa xử lý. Vì chữ số bên phải được lấy trước, mình nối nó vào đầu `result`." },
    { code: `from old_computer import say

number = 15
left = number
result = ""

while left > 0:
    remainder = left % 7
    result = str(remainder) + result
    left = left // 7

say(result)
`,
      label: "prep19_doi_co_so.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 15`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 15 viết theo cơ số 7 là `21`: 15 chia 7 được 2 dư 1, nên hàng bên phải là 1 và phần còn lại là 2.",
      expectOut: /^21$/,
      solution: `from old_computer import say

number = 15
left = number
result = ""

while left > 0:
    remainder = left % 7
    result = str(remainder) + result
    left = left // 7

say(result)
` },
    { code: `from old_computer import say

number = 100
left = number
result = ""
while left > 0:
    remainder = left % 7
    # lượt của bạn: ghép chữ số cơ số 7 vào result
    left = left // 7
say(result)
`,
      label: "floor19_doi_co_so_7.py", floorNum: 19,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `number = 100`. Không có INPUT từ ngoài chương trình.\n`remainder = left % 7` là chữ số đang lấy ra khi đổi sang cơ số 7; `str(remainder)` đổi số dư thành chữ để nối chuỗi.\nViệc cần làm: hoàn thành chuỗi biểu diễn `number` trong cơ số 7.\nOUTPUT: `say(result)` phải in `202`.',
      expectOut: /202/,
      solution: `from old_computer import say

number = 100
left = number
result = ""
while left > 0:
    remainder = left % 7
    result = str(remainder) + result
    left = left // 7
say(result)
` },

    // ═══ TẦNG 20 — BOSS ═══
    { npc: "TẦNG 20: TRÙNG GÁC CỬA HẮC DIỆN chặn lối lên mười tầng cao nhất. Ôn lại các công cụ chuỗi và số vừa dùng, rèn BOM MẬT NGỮ, rồi mở khóa cầu thang phía trên." },
    { forge: { quiz: [
        { q: 'Trong tầng 17, `text[index] not in "aeiou"` kiểm tra điều gì?', a: ["Ký tự hiện tại không nằm trong nhóm nguyên âm", "Ký tự hiện tại là số", "Chuỗi đã hết"], correct: 0 },
        { q: '`ord("A")` cho biết điều gì?', a: ["Mã số của ký tự A", "Độ dài chữ A", "Không có nghĩa gì"], correct: 0 },
        { q: 'Trong tầng 19, muốn ghép `remainder` vào ĐẦU chuỗi `result`, biểu thức nào đúng?', a: ["result = str(remainder) + result", "result = result + str(remainder)", "result = result + remainder"], correct: 0 },
      ] } },
    { boss: { name: "TRÙNG GÁC CỬA HẮC DIỆN", sheet: { src: "assets/tower-warden-15-sheet.webp" }, art: "assets/tower-warden-15.webp", glyph: "🦂", ko: true }, floorNum: 20 },

    // ═══ TẦNG 21 — Tìm Số Nhỏ Nhất ═══
    { npc: "TẦNG 21: cửa cho sẵn một danh sách số. Muốn tìm số nhỏ nhất, mình lấy số đầu làm kết quả tạm, rồi so từng số còn lại với kết quả đó." },
    { code: `from old_computer import say_num

numbers = [8, 3, 6]
smallest = numbers[0]
index = 1
while index < len(numbers):
    if numbers[index] < smallest:
        smallest = numbers[index]
    index = index + 1

say_num(smallest)
`,
      label: "prep21_tim_nho_nhat.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `numbers = [8, 3, 6]`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy `smallest` bắt đầu là 8, rồi được gán lại thành 3 khi máy gặp số nhỏ hơn.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

numbers = [8, 3, 6]
smallest = numbers[0]
index = 1
while index < len(numbers):
    if numbers[index] < smallest:
        smallest = numbers[index]
    index = index + 1

say_num(smallest)
` },
    { code: `from old_computer import say_num

numbers = [12, 7, 19, 4, 9]
smallest = numbers[0]
index = 1
while index < len(numbers):
    # lượt của bạn: so số hiện tại với smallest
    index = index + 1
say_num(smallest)
`,
      label: "floor21_tim_nho_nhat.py", floorNum: 21,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `numbers = [12, 7, 19, 4, 9]`. Không có INPUT từ ngoài chương trình.\n`smallest` giữ số nhỏ nhất đã gặp; `numbers[index]` là số đang được xét.\nViệc cần làm: đi qua danh sách, gán lại `smallest` khi gặp số nhỏ hơn.\nOUTPUT: `say_num(smallest)` phải in 4.',
      expectOut: /^4$/,
      solution: `from old_computer import say_num

numbers = [12, 7, 19, 4, 9]
smallest = numbers[0]
index = 1
while index < len(numbers):
    if numbers[index] < smallest:
        smallest = numbers[index]
    index = index + 1
say_num(smallest)
` },

    // ═══ TẦNG 22 — Đếm Số Lần Xuất Hiện ═══
    { npc: "TẦNG 22: cửa cho sẵn danh sách và `target`. Mỗi khi số đang xét bằng `target`, biến `count` tăng thêm 1." },
    { code: `from old_computer import say_num

numbers = [2, 5, 2]
target = 2
count = 0
index = 0
while index < len(numbers):
    if numbers[index] == target:
        count = count + 1
    index = index + 1

say_num(count)
`,
      label: "prep22_dem_target.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `numbers = [2, 5, 2]`, `target = 2`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy máy gặp số 2 hai lần, nên `count` là 2.",
      expectOut: /^2$/,
      solution: `from old_computer import say_num

numbers = [2, 5, 2]
target = 2
count = 0
index = 0
while index < len(numbers):
    if numbers[index] == target:
        count = count + 1
    index = index + 1

say_num(count)
` },
    { code: `from old_computer import say_num

numbers = [4, 7, 4, 2, 4, 9]
target = 4
count = 0
index = 0
while index < len(numbers):
    # lượt của bạn: tăng count khi gặp target
    index = index + 1
say_num(count)
`,
      label: "floor22_dem_so_lan.py", floorNum: 22,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `numbers = [4, 7, 4, 2, 4, 9]`, `target = 4`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: đi qua toàn bộ danh sách và đếm số lần `target` xuất hiện.\nOUTPUT: `say_num(count)` phải in 3.',
      expectOut: /^3$/,
      solution: `from old_computer import say_num

numbers = [4, 7, 4, 2, 4, 9]
target = 4
count = 0
index = 0
while index < len(numbers):
    if numbers[index] == target:
        count = count + 1
    index = index + 1
say_num(count)
` },

    // ═══ TẦNG 23 — Vị Trí Đầu Tiên ═══
    { npc: "TẦNG 23: lần này cần tìm vị trí đầu tiên của `target`. Biến `position` bắt đầu là -1, nghĩa là chưa tìm thấy. Khi gặp `target` lần đầu, mình lưu `index` vào `position`." },
    { code: `from old_computer import say_num

numbers = [6, 8, 6]
target = 6
position = -1
index = 0
while index < len(numbers):
    if numbers[index] == target and position == -1:
        position = index
    index = index + 1

say_num(position)
`,
      label: "prep23_vi_tri_dau.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `numbers = [6, 8, 6]`, `target = 6`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy lần xuất hiện đầu tiên nằm ở chỉ số 0. Điều kiện `position == -1` ngăn lần xuất hiện sau ghi đè kết quả.",
      expectOut: /^0$/,
      solution: `from old_computer import say_num

numbers = [6, 8, 6]
target = 6
position = -1
index = 0
while index < len(numbers):
    if numbers[index] == target and position == -1:
        position = index
    index = index + 1

say_num(position)
` },
    { code: `from old_computer import say_num

numbers = [5, 9, 12, 9, 20]
target = 9
position = -1
index = 0
while index < len(numbers):
    # lượt của bạn: chỉ lưu index khi gặp target lần đầu
    index = index + 1
say_num(position)
`,
      label: "floor23_vi_tri_dau_tien.py", floorNum: 23,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `numbers = [5, 9, 12, 9, 20]`, `target = 9`. Không có INPUT từ ngoài chương trình.\nChỉ số của danh sách bắt đầu từ 0. `position = -1` biểu thị chưa tìm thấy.\nViệc cần làm: lưu chỉ số của lần xuất hiện đầu tiên của `target`; không để lần xuất hiện sau ghi đè.\nOUTPUT: `say_num(position)` phải in 1.',
      expectOut: /^1$/,
      solution: `from old_computer import say_num

numbers = [5, 9, 12, 9, 20]
target = 9
position = -1
index = 0
while index < len(numbers):
    if numbers[index] == target and position == -1:
        position = index
    index = index + 1
say_num(position)
` },

    // ═══ TẦNG 24 — Số Lớn Thứ Hai ═══
    { npc: "TẦNG 24: cửa yêu cầu số lớn thứ hai khác số lớn nhất. Danh sách có thể lặp lại số lớn nhất, nên mình chỉ nhận `value` làm số thứ hai khi `value < largest`." },
    { code: `from old_computer import say_num

numbers = [3, 8, 5]
largest = numbers[0]
second = numbers[0]
index = 1
while index < len(numbers):
    value = numbers[index]
    if value > largest:
        second = largest
        largest = value
    elif value < largest and (second == largest or value > second):
        second = value
    index = index + 1

say_num(second)
`,
      label: "prep24_lon_thu_hai.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `numbers = [3, 8, 5]`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 8 là số lớn nhất và 5 là số lớn thứ hai.",
      expectOut: /^5$/,
      solution: `from old_computer import say_num

numbers = [3, 8, 5]
largest = numbers[0]
second = numbers[0]
index = 1
while index < len(numbers):
    value = numbers[index]
    if value > largest:
        second = largest
        largest = value
    elif value < largest and (second == largest or value > second):
        second = value
    index = index + 1

say_num(second)
` },
    { code: `from old_computer import say_num

numbers = [5, 9, 3, 9, 7]
largest = numbers[0]
second = numbers[0]
index = 1
while index < len(numbers):
    value = numbers[index]
    # lượt của bạn: cập nhật largest và second
    index = index + 1
say_num(second)
`,
      label: "floor24_so_lon_thu_hai.py", floorNum: 24,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: `numbers = [5, 9, 3, 9, 7]`. Không có INPUT từ ngoài chương trình.\n`largest` giữ số lớn nhất; `second` giữ số lớn nhất nhưng phải khác `largest`. Hai số 9 chỉ tính là cùng một giá trị lớn nhất.\nViệc cần làm: đi qua danh sách và cập nhật hai biến trên.\nOUTPUT: `say_num(second)` phải in 7.',
      expectOut: /^7$/,
      solution: `from old_computer import say_num

numbers = [5, 9, 3, 9, 7]
largest = numbers[0]
second = numbers[0]
index = 1
while index < len(numbers):
    value = numbers[index]
    if value > largest:
        second = largest
        largest = value
    elif value < largest and (second == largest or value > second):
        second = value
    index = index + 1
say_num(second)
` },

    { quiz: { title: "Quét danh sách", questions: [
        { q: "Với `numbers = [8, 3, 6]`, sau khi máy xét số 3 thì `smallest` cần mang giá trị nào?", a: ["3", "8", "6"], correct: 0 },
        { q: "Với `numbers = [5, 9, 12, 9]`, vì sao điều kiện `position == -1` cần được kiểm tra trước khi gán?", a: ["Để lần gặp 9 sau không ghi đè vị trí đầu tiên", "Để danh sách tự sắp xếp", "Để đổi chỉ số thành số âm"], correct: 0 },
      ] } },

    // ═══ TẦNG 25 — BOSS ═══
    { npc: "TẦNG 25: TRÙNG GÁC CỬA BĂNG TINH khóa năm tầng cuối. Ôn lại cách quét danh sách và giữ kết quả tạm, rồi rèn bom phá khóa." },
    { forge: { quiz: [
        { q: "Khi tìm số nhỏ nhất, lúc nào cần gán lại `smallest`?", a: ["Khi số hiện tại nhỏ hơn `smallest`", "Sau mọi vòng lặp", "Chỉ khi số hiện tại bằng 0"], correct: 0 },
        { q: "Với danh sách `[4, 7, 4, 4]` và `target = 4`, `count` cuối cùng là bao nhiêu?", a: ["3", "2", "4"], correct: 0 },
        { q: "Trong danh sách `[5, 9, 3, 9, 7]`, số lớn thứ hai khác số lớn nhất là số nào?", a: ["7", "9", "5"], correct: 0 },
      ] } },
    { boss: { name: "TRÙNG GÁC CỬA BĂNG TINH", sheet: { src: "assets/tower-warden-10-sheet.webp" }, art: "assets/tower-warden-10.webp", glyph: "🐜", ko: true }, floorNum: 25 },

    // ═══ TẦNG 26 — Ước Chung Lớn Nhất ═══
    { npc: "TẦNG 26: tìm ước chung lớn nhất bằng thuật toán Euclid. Mỗi vòng lấy phần dư của `a` khi chia cho `b`, rồi chuyển `b` và phần dư sang lượt kế tiếp. Khi `b` bằng 0, `a` là kết quả." },
    { code: `from old_computer import say_num

a = 18
b = 12
while b != 0:
    remainder = a % b
    a = b
    b = remainder

say_num(a)
`,
      label: "prep26_euclid.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `a = 18`, `b = 12`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy các số dư lần lượt là 6 rồi 0. Khi vòng lặp dừng, `a` là 6.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

a = 18
b = 12
while b != 0:
    remainder = a % b
    a = b
    b = remainder

say_num(a)
` },
    { code: `from old_computer import say_num

a = 48
b = 18
while b != 0:
    # lượt của bạn: tính phần dư rồi gán lại a và b
    pass
say_num(a)
`,
      label: "floor26_uoc_chung_lon_nhat.py", floorNum: 26,
      note: 'ĐỀ BÀI\nKhái niệm: ước chung lớn nhất là số lớn nhất chia hết cả hai số. Ví dụ, 6 là ước chung lớn nhất của 18 và 12.\nGiá trị cho sẵn: `a = 48`, `b = 18`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: trong mỗi vòng, tính `remainder = a % b`, rồi gán `a = b` và `b = remainder`.\nOUTPUT: khi `b` bằng 0, `say_num(a)` phải in 6.',
      expectOut: /^6$/,
      solution: `from old_computer import say_num

a = 48
b = 18
while b != 0:
    remainder = a % b
    a = b
    b = remainder
say_num(a)
` },

    // ═══ TẦNG 27 — Kiểm Tra Số Nguyên Tố ═══
    { npc: "TẦNG 27: số nguyên tố lớn hơn 1 và chỉ chia hết cho 1 cùng chính nó. Mình thử các `factor` từ 2; nếu `number` chia hết cho một `factor`, thì `number` không phải là số nguyên tố." },
    { code: `from old_computer import say

number = 15
factor = 2
is_prime = True
while factor < number:
    if number % factor == 0:
        is_prime = False
    factor = factor + 1

if is_prime:
    say("NGUYEN TO")
else:
    say("KHONG NGUYEN TO")
`,
      label: "prep27_nguyen_to.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `number = 15`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy 15 chia hết cho 3, nên `is_prime` được gán lại thành `False` và output là `KHONG NGUYEN TO`.",
      expectOut: /^KHONG NGUYEN TO$/,
      solution: `from old_computer import say

number = 15
factor = 2
is_prime = True
while factor < number:
    if number % factor == 0:
        is_prime = False
    factor = factor + 1

if is_prime:
    say("NGUYEN TO")
else:
    say("KHONG NGUYEN TO")
` },
    { code: `from old_computer import say

number = 29
factor = 2
is_prime = number > 1
while factor < number:
    # lượt của bạn: nếu number chia hết cho factor, gán lại is_prime
    factor = factor + 1

# lượt của bạn: in kết luận
`,
      label: "floor27_kiem_tra_nguyen_to.py", floorNum: 27,
      note: 'ĐỀ BÀI\nKhái niệm: số nguyên tố là số lớn hơn 1 và không chia hết cho số nào từ 2 tới ngay trước nó.\nGiá trị cho sẵn: `number = 29`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: thử từng `factor`; nếu `number % factor == 0`, gán `is_prime = False`. Sau vòng lặp, in kết luận.\nOUTPUT: in `NGUYEN TO` hoặc `KHONG NGUYEN TO`. Với 29, output đúng là `NGUYEN TO`.',
      expectOut: /^NGUYEN TO$/,
      solution: `from old_computer import say

number = 29
factor = 2
is_prime = number > 1
while factor < number:
    if number % factor == 0:
        is_prime = False
    factor = factor + 1

if is_prime:
    say("NGUYEN TO")
else:
    say("KHONG NGUYEN TO")
` },

    // ═══ TẦNG 28 — Kiểm Tra Thứ Tự ═══
    { npc: "TẦNG 28: danh sách tăng dần khi số đứng sau không nhỏ hơn số đứng trước. Mình so từng cặp liền nhau; chỉ cần một cặp sai là cả danh sách không tăng dần." },
    { code: `from old_computer import say

numbers = [2, 4, 3]
is_sorted = True
index = 1
while index < len(numbers):
    if numbers[index] < numbers[index - 1]:
        is_sorted = False
    index = index + 1

if is_sorted:
    say("TANG DAN")
else:
    say("CHUA TANG DAN")
`,
      label: "prep28_kiem_tra_thu_tu.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: `numbers = [2, 4, 3]`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy cặp 4 rồi 3 sai thứ tự, nên output là `CHUA TANG DAN`.",
      expectOut: /^CHUA TANG DAN$/,
      solution: `from old_computer import say

numbers = [2, 4, 3]
is_sorted = True
index = 1
while index < len(numbers):
    if numbers[index] < numbers[index - 1]:
        is_sorted = False
    index = index + 1

if is_sorted:
    say("TANG DAN")
else:
    say("CHUA TANG DAN")
` },
    { code: `from old_computer import say

numbers = [2, 2, 5, 9]
is_sorted = True
index = 1
while index < len(numbers):
    # lượt của bạn: so số hiện tại với số ngay trước
    index = index + 1

# lượt của bạn: in kết luận
`,
      label: "floor28_danh_sach_tang_dan.py", floorNum: 28,
      note: 'ĐỀ BÀI\nTrong tầng này, `tăng dần` cho phép hai số liền nhau bằng nhau; số đứng sau chỉ không được nhỏ hơn số đứng trước.\nGiá trị cho sẵn: `numbers = [2, 2, 5, 9]`. Không có INPUT từ ngoài chương trình.\nViệc cần làm: so từng cặp liền nhau và gán `is_sorted = False` nếu số sau nhỏ hơn số trước.\nOUTPUT: in `TANG DAN` hoặc `CHUA TANG DAN`. Với danh sách đã cho, output đúng là `TANG DAN`.',
      expectOut: /^TANG DAN$/,
      solution: `from old_computer import say

numbers = [2, 2, 5, 9]
is_sorted = True
index = 1
while index < len(numbers):
    if numbers[index] < numbers[index - 1]:
        is_sorted = False
    index = index + 1

if is_sorted:
    say("TANG DAN")
else:
    say("CHUA TANG DAN")
` },

    // ═══ TẦNG 29 — Tìm Kiếm Nhị Phân ═══
    { npc: "TẦNG 29: danh sách đã tăng dần, nên mình tìm ở giữa. Nếu số giữa nhỏ hơn `target`, bỏ nửa bên trái; nếu lớn hơn, bỏ nửa bên phải. Mỗi vòng vùng cần tìm nhỏ đi gần một nửa." },
    { code: `from old_computer import say_num

numbers = [2, 5, 8, 12, 16]
target = 12
low = 0
high = len(numbers) - 1
position = -1
while low <= high:
    middle = (low + high) // 2
    if numbers[middle] == target:
        position = middle
        low = high + 1
    elif numbers[middle] < target:
        low = middle + 1
    else:
        high = middle - 1

say_num(position)
`,
      label: "prep29_tim_kiem_nhi_phan.py",
      note: "Ô LUYỆN NỀN\nGiá trị cho sẵn: danh sách tăng dần `[2, 5, 8, 12, 16]`, `target = 12`. Không có INPUT từ ngoài chương trình.\nBấm RUN để thấy máy thu hẹp vùng từ `low` tới `high` và tìm được 12 ở chỉ số 3.",
      expectOut: /^3$/,
      solution: `from old_computer import say_num

numbers = [2, 5, 8, 12, 16]
target = 12
low = 0
high = len(numbers) - 1
position = -1
while low <= high:
    middle = (low + high) // 2
    if numbers[middle] == target:
        position = middle
        low = high + 1
    elif numbers[middle] < target:
        low = middle + 1
    else:
        high = middle - 1

say_num(position)
` },
    { code: `from old_computer import say_num

numbers = [3, 7, 11, 18, 24, 31, 45]
target = 24
low = 0
high = len(numbers) - 1
position = -1
while low <= high:
    middle = (low + high) // 2
    # lượt của bạn: so numbers[middle] với target và thu hẹp vùng tìm
say_num(position)
`,
      label: "floor29_tim_kiem_nhi_phan.py", floorNum: 29,
      note: 'ĐỀ BÀI\nGiá trị cho sẵn: danh sách tăng dần `numbers = [3, 7, 11, 18, 24, 31, 45]`, `target = 24`. Không có INPUT từ ngoài chương trình.\n`low` và `high` là hai đầu vùng còn cần tìm; `middle = (low + high) // 2` là chỉ số giữa.\nViệc cần làm: nếu số giữa bằng `target`, lưu `middle` vào `position` và kết thúc tìm; nếu nhỏ hơn, dời `low`; nếu lớn hơn, dời `high`.\nOUTPUT: `say_num(position)` phải in 4.',
      expectOut: /^4$/,
      solution: `from old_computer import say_num

numbers = [3, 7, 11, 18, 24, 31, 45]
target = 24
low = 0
high = len(numbers) - 1
position = -1
while low <= high:
    middle = (low + high) // 2
    if numbers[middle] == target:
        position = middle
        low = high + 1
    elif numbers[middle] < target:
        low = middle + 1
    else:
        high = middle - 1
say_num(position)
` },

    { checkpoint: { text: "Bốn tầng cuối dùng những thuật toán quen thuộc: Euclid rút gọn hai số bằng phần dư; kiểm tra nguyên tố thử các ước; kiểm tra thứ tự so từng cặp liền nhau; tìm kiếm nhị phân chỉ dùng được khi danh sách đã tăng dần." } },
    { quiz: { title: "Chọn đúng thuật toán", questions: [
        { q: "Danh sách `[3, 7, 11, 18, 24, 31, 45]` đã tăng dần. Muốn tìm 24 nhanh bằng tìm kiếm nhị phân, vị trí nào được kiểm tra đầu tiên?", a: ["Vị trí giữa, chỉ số 3", "Vị trí cuối, chỉ số 6", "Mọi vị trí cùng lúc"], correct: 0 },
        { q: "Khi kiểm tra `[2, 2, 5, 9]`, cặp `2, 2` có làm danh sách sai thứ tự tăng dần của tầng 28 không?", a: ["Không, vì số sau không nhỏ hơn số trước", "Có, vì hai số bằng nhau", "Có, vì danh sách bắt đầu bằng 2"], correct: 0 },
      ] } },

    // ═══ TẦNG 30 — BOSS CUỐI ═══
    { npc: "TẦNG 30 — ĐỈNH THÁP VÔ ĐỊNH! Chúa tể Vô Định đang chờ. Ôn lại cách quét danh sách, kiểm tra điều kiện và thu hẹp bài toán, rèn BOM MẬT NGỮ mạnh nhất, rồi phong ấn nó." },
    { forge: { quiz: [
        { q: "Trong thuật toán Euclid, khi `b` bằng 0 thì biến nào giữ ước chung lớn nhất?", a: ["a", "b", "remainder"], correct: 0 },
        { q: "Nếu tìm thấy một `factor` từ 2 sao cho `number` chia hết cho `factor`, cần gán gì?", a: ["is_prime = False", "is_prime = True", "factor = 0"], correct: 0 },
        { q: "Tìm kiếm nhị phân cần điều kiện nào ở danh sách?", a: ["Danh sách đã tăng dần", "Danh sách có đúng 7 số", "Mọi số đều khác nhau"], correct: 0 },
      ] } },
    { boss: { name: "CHÚA TỂ VÔ ĐỊNH", sheet: { src: "assets/lord-null-sheet.webp" }, art: "assets/lord-null.webp", glyph: "👹", ko: true }, floorNum: 30 },

    { npc: "THÁP VÔ ĐỊNH đã được phong ấn. Mật Ngữ của bạn giờ đủ chắc để đọc đề khó mà vẫn biết: giá trị nào cho sẵn, bước nào cần viết, và OUTPUT nào phải in ra. Về bản đồ nghỉ ngơi đã nhé." },
  ],
};
