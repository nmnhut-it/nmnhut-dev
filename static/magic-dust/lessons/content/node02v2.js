// node02v2.js — PEDAGOGY V2 CLONE of node02.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson02v2.html, also reachable via dev-test.html?src=node02v2.
// `index` matches node02.js (2) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node02.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file's change is narrower: one earned-milestone badge
// added right after the "Tính tuổi" quiz cluster (retrieval already verified
// by that quiz), no reordering needed. Wording/code below is verbatim from node02.js.
export default {
  index: 2,
  title: "Old Computer: Numbers",
  subtitle: "đếm, tính toán, và đọc thông báo lỗi",
  bundle: {
    art: "assets/rookie-bundle.webp",
    name: "CALC BUNDLE",
  },
  machine: {
    art: "assets/old-computer.webp",
    name: "OLD COMPUTER: NUMBERS",
    blurb: "giờ máy biết đếm và tính toán",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn chữ trước khi học số",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nname = \"An\"\nsay(\"Xin chào, \" + name)\n```\nMáy in ra gì?",
            a: [
              "Xin chào, An",
              "Xin chào, name",
              "An Xin chào",
            ],
            correct: 0,
          },
          {
            q: "Trong node trước, `read()` nhận phần chữ người dùng gõ và trả về kiểu gì để ghép với `say()`?",
            a: [
              "CHUỖI",
              "SỐ thật để tính cộng trừ",
              "Một số ngón",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Máy tính có thể tính hàng tỉ phép tính mỗi giây!",
    },
    {
      npc: "Có hai lệnh mới: `read_num()` để hỏi rồi nhận một SỐ (nhớ nha — `read()` nhận CHUỖI, còn `read_num()` nhận SỐ thật để tính được), còn `say_num()` để nói ra một SỐ. Bạn thử nhấn RUN xem nào!",
    },
    {
      code: `from old_computer import read_num, say_num, say

a = read_num("Số thứ nhất: ")   # input
b = read_num("Số thứ hai: ")    # input
say("Tổng:")                    # output (nhãn)
say_num(a + b)                  # process (a + b) + output
`,
      label: "calc.py",
      note: `ĐỀ BÀI (bài mẫu)
Bạn chỉ cần bấm RUN rồi nhập hai số máy hỏi — không phải sửa gì cả.
INPUT: hai số
PROCESS: cộng a + b
OUTPUT: in nhãn "Tổng:" rồi in kết quả`,
      expectOut: /tổng/i,
      solution: `from old_computer import read_num, say_num, say

a = read_num("Số thứ nhất: ")
b = read_num("Số thứ hai: ")
say("Tổng:")
say_num(a + b)
`,
    },
    {
      remember: "`read_num()` là lệnh hỏi rồi nhận một SỐ · `say_num()` in ra một SỐ.",
    },
    {
      checkpoint: {
        text: "`read_num()` hỏi rồi nhận một SỐ; `say_num()` in một SỐ. Còn `read()` và `say()` dùng cho CHUỖI.",
      },
    },
    {
      quiz: {
        title: "Số thật",
        questions: [
          {
            q: "Muốn cộng 3 và 5 rồi in ra kết quả là 8, chúng mình cần dùng cặp lệnh nào nhỉ?",
            a: [
              "`read()/say()`",
              "`read_num()/say_num()`",
              "`calc()/result()`",
            ],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Làm phép cộng được rồi thì trừ, nhân, chia cũng dễ ợt! Bạn thử thêm ba dòng nữa: phép trừ dùng dấu `-`, phép nhân dùng dấu `*`, phép chia dùng dấu `/` nhé.",
    },
    {
      code: `from old_computer import read_num, say_num, say

a = read_num("Số thứ nhất: ")   # input
b = read_num("Số thứ hai: ")    # input
say("Tổng:")                    # output (nhãn)
say_num(a + b)                  # process (a + b) + output
# lượt của bạn: thêm phần hiệu, tích, thương
# mỗi phần cần có nhãn riêng rồi in kết quả tương ứng
`,
      label: "calc_full.py",
      note: `ĐỀ BÀI
INPUT: hai số (đã có)
PROCESS: thêm phép trừ (-), nhân (*), chia (/)
OUTPUT: in đủ 4 nhãn (Tổng/Hiệu/Tích/Thương) + 4 kết quả`,
      expectOut: {
        all: [
          /tổng/i,
          /hiệu/i,
          /tích/i,
          /thương/i,
        ],
      },
      solution: `from old_computer import read_num, say_num, say

a = read_num("Số thứ nhất: ")
b = read_num("Số thứ hai: ")
say("Tổng:")
say_num(a + b)
say("Hiệu:")
say_num(a - b)
say("Tích:")
say_num(a * b)
say("Thương:")
say_num(a / b)
`,
    },
    {
      checkpoint: {
        text: "Bốn phép tính dùng bốn dấu: `+` cộng, `-` trừ, `*` nhân, `/` chia — cùng cú pháp `say_num(a op b)` cho cả bốn.",
      },
    },
    {
      quiz: {
        title: "Ký hiệu phép tính",
        questions: [
          {
            q: "Phép trừ, phép nhân và phép chia được viết bằng những dấu nào nhỉ?",
            a: [
              "-, x, :",
              "+, =, /",
              "-, *, /",
            ],
            correct: 2,
          },
        ],
      },
    },
    {

      npc: "Cỗ máy tính rất nhanh, nhưng chỉ khi đoạn code được viết đúng — sai một dấu nhỏ thôi là nó dừng lại ngay. Bạn còn nhớ VÒNG TRÒN PHÉP THUẬT chứ?",

    },

    {

      npc: "Viết Mật Ngữ sai là vòng tròn vỡ vụn. Đoạn code dưới đây có TỚI HAI lỗi — sửa xong lỗi thứ nhất, RUN lại để tìm lỗi thứ hai nha.",

    },
    {
      remember: "Mỗi lần RUN mà lệnh chưa chuẩn, máy sẽ BÁO LỖI ngay — đọc thật kĩ lỗi đó để sửa, đừng đoán mò. Python chỉ báo MỘT lỗi mỗi lần RUN, nên phải sửa và RUN lại nhiều lần.",
    },
    {
      code: `from old_computer import say

say("Bụi phép sống dậy!)
say("Hai dòng, hai lỗi"):
`,
      label: "quote.py",
      note: `ĐỀ BÀI
Có 2 LỖI trong đoạn này — bạn hãy sửa lỗi 1, nhấn RUN, đọc lỗi tiếp theo rồi sửa nốt, và nhấn RUN lần nữa nhé.
Lỗi 1: bị thiếu dấu ngoặc kép đóng.
Lỗi 2: bị dư một dấu hai chấm : ở cuối dòng.`,
      expectOut: {
        all: [
          /bụi phép sống dậy!/i,
          /hai dòng, hai lỗi/i,
        ],
      },
      solution: `from old_computer import say

say("Bụi phép sống dậy!")
say("Hai dòng, hai lỗi")
`,
    },
    {
      checkpoint: {
        text: "Mỗi dấu nháy kép `\"` mở phải có một dấu nháy kép đóng, và dấu hai chấm `:` chỉ dành cho vài câu đặc biệt bạn sẽ học ở node sau — một dòng lệnh thường không được kết thúc bằng nó; thiếu hoặc thừa đều làm máy báo lỗi ngay lần RUN đó.",
      },
    },
    {
      quiz: {
        title: "Dấu nháy khớp",
        questions: [
          {
            q: "`say(\"Chào bạn)` — máy báo lỗi. Thiếu gì?",
            a: [
              "dấu nháy đóng ở cuối",
              "dấu +",
              "chữ hoa",
            ],
            correct: 0,
          },
          {
            q: "`say(\"Niệm xong\"):` — dòng này là một lệnh bình thường, vậy dấu : ở cuối là gì?",
            a: [
              "bắt buộc phải có",
              "thừa, không nên có ở đây",
              "thay cho dấu chấm câu",
            ],
            correct: 1,
          },
        ],
      },
    },
    {

      npc: "Lỗi quen thuộc thứ hai: khoảng trắng ở ĐẦU dòng RẤT QUAN TRỌNG trong Python. Dòng này tự dưng bị thụt vào vô cớ — máy không chịu đâu!",

    },

    {

      npc: "RUN, đọc lỗi, rồi kéo dòng đó sát về bên trái xem.",

    },
    {
      code: `from old_computer import say

say("bước một - khuấy bụi phép")
    say("bước hai - thắp sáng nó")
`,
      label: "indent.py",
      note: `ĐỀ BÀI
Dòng thứ hai đang bị thụt vào vô cớ. Kéo nó sát về bên trái, rồi RUN lại.`,
      expectOut: {
        all: [
          /bước một/i,
          /bước hai/i,
        ],
      },
      solution: `from old_computer import say

say("bước một - khuấy bụi phép")
say("bước hai - thắp sáng nó")
`,
    },
    {
      checkpoint: {
        text: "Khoảng trắng ở ĐẦU dòng có ý nghĩa trong Python: một dòng lệnh bình thường không được tự dưng thụt vào — thụt vào vô cớ làm máy báo lỗi.",
      },
    },
    {
      quiz: {
        title: "Thụt dòng",
        questions: [
          {
            q: "`say(\"A\")` rồi dòng dưới thụt vào `    say(\"B\")` — vì sao máy báo lỗi?",
            a: [
              "thụt vào vô cớ",
              "thiếu dấu ngoặc",
              "tên biến sai",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Máy báo lỗi rất có ích: đọc lỗi → tìm chỗ nứt → sửa đoạn code.",
    },
    {
      npc: "Trước khi đấu BUG WRAITH, ghé XƯỞNG PHÉP chế hai máy TÍNH nữa! Máy đầu: TÍNH TUỔI — hỏi năm sinh, trừ cho năm nay, ra tuổi liền.",
    },
    {
      code: `from old_computer import read_num, say_num, say

birth_year = read_num("Bạn sinh năm nào? ")   # input
age = 2026 - birth_year                        # process (phép trừ)
say("Tuổi của bạn là:")                       # output (nhãn)
say_num(age)                                 # output
`,
      label: "🔧 XƯỞNG PHÉP: Máy tính tuổi",
      note: `ĐỀ BÀI (bài mẫu)
Bạn chỉ cần bấm RUN rồi nhập năm sinh — máy tự tính, không phải sửa gì cả.
INPUT: năm sinh
PROCESS: 2026 - nam_sinh
OUTPUT: nhãn "Tuổi của bạn là:" rồi số tuổi`,
      expectOut: {
        all: [
          /tuổi/i,
          {
            minLines: 2,
          },
        ],
      },
      solution: `from old_computer import read_num, say_num, say

birth_year = read_num("Bạn sinh năm nào? ")
age = 2026 - birth_year
say("Tuổi của bạn là:")
say_num(age)
`,
    },
    {
      remember: "Máy TÍNH TUỔI dùng `read_num()` lấy năm sinh, trừ cho một SỐ cố định trong code (`2026 - birth_year`), rồi `say_num()` in kết quả — phép tính có thể trộn một biến với một con số viết thẳng.",
    },
    {
      quiz: {
        title: "Tính tuổi",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nbirth_year = 2016\nage = 2026 - birth_year\n```\n`age` bằng bao nhiêu?",
            a: [
              "10",
              "2016",
              "4042",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "🎂",
        name: "HUY HIỆU MÁY TÍNH TUỔI",
        blurb: "phần thưởng cho việc tự chế được máy tính tuổi: read_num() lấy năm sinh, trừ cho một số cố định, rồi say_num() kết quả.",
        badge: true,
        badgeId: "huy_hieu_may_tinh_tuoi",
      },
    },
    {
      npc: "Máy thứ hai: ĐO HÌNH CHỮ NHẬT — hỏi chiều dài, chiều rộng, rồi tính luôn CHU VI và DIỆN TÍCH bằng hai công thức khác nhau.",
    },
    {
      code: `from old_computer import read_num, say_num, say

length = read_num("Chiều dài? ")    # input
width = read_num("Chiều rộng? ")  # input
say("Chu vi:")                    # output (nhãn)
say_num((length + width) * 2)         # process (chu vi) + output
say("Diện tích:")                 # output (nhãn)
say_num(length * width)               # process (diện tích) + output
`,
      label: "🔧 XƯỞNG PHÉP: Máy đo hình chữ nhật",
      note: `ĐỀ BÀI (bài mẫu)
Bạn chỉ cần bấm RUN rồi nhập chiều dài và chiều rộng — máy tự tính, không phải sửa gì cả.
INPUT: chiều dài + chiều rộng
PROCESS: chu vi = (dài + rộng) * 2, diện tích = dài * rộng
OUTPUT: 4 dòng — dòng chữ "Chu vi:", số chu vi, dòng chữ "Diện tích:", số diện tích`,
      expectOut: {
        all: [
          /chu vi/i,
          /diện tích/i,
          {
            minLines: 4,
          },
        ],
      },
      solution: `from old_computer import read_num, say_num, say

length = read_num("Chiều dài? ")
width = read_num("Chiều rộng? ")
say("Chu vi:")
say_num((length + width) * 2)
say("Diện tích:")
say_num(length * width)
`,
    },
    {
      remember: "Máy ĐO HÌNH CHỮ NHẬT dùng CÙNG hai biến (dai, rong) cho HAI công thức khác nhau — `(length + width) * 2` cho chu vi, `length * width` cho diện tích — mỗi kết quả có nhãn say() riêng đứng trước.",
    },
    {
      quiz: {
        title: "Đo hình chữ nhật",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nlength = 5\nwidth = 3\nsay_num(length * width)\n```\nMáy in ra số nào?",
            a: [
              "15",
              "8",
              "16",
            ],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Cầm lấy HUY HIỆU MÁY TÍNH TUỔI này rồi ghé LÒ RÈN với Pip một chút nhé.",

    },

    {

      npc: "Ở đó Pip sẽ hỏi bạn vài câu — trả lời đúng là lửa đủ nóng, mình rèn ra được một quả BOM MẬT NGỮ. Chính quả bom ấy mới hạ được BUG WRAITH đó, nên rèn cho khéo nha!",

    },
    {
      forge: {
        quiz: [
          { q: "Lệnh `say(...)` cho chữ hiện ra trên màn hình. Vậy nó thuộc phần nào của cỗ máy?", a: ["INPUT — máy nghe", "OUTPUT — máy nói"], correct: 1 },
          { q: "Máy báo lỗi: `name 'sey' is not defined`. Vết nứt nằm ở đâu?", a: ["Gõ nhầm tên lệnh `say` thành `sey`", "Máy đang ngáp ngủ", "Python đói bụng"], correct: 0 },
          { q: "Muốn máy NÓI đúng một dòng chữ, dòng chữ đó phải được đặt trong cái gì?", a: ["Trong hai dấu nháy `\"...\"`", "Trong ngoặc nhọn `{...}`", "Chẳng cần gì cả"], correct: 0 },
          { q: "Câu `say(\"bão bụi phép\"` chạy thì máy báo lỗi. Nó thiếu cái gì?", a: ["Thiếu dấu `)` đóng lại", "Thiếu một dấu chấm", "Thiếu chữ viết HOA"], correct: 0 },
          { q: "Dòng thứ hai bị thụt sâu vào trong khiến máy báo lỗi về khoảng trắng. Phải làm gì?", a: ["Kéo dòng đó về sát lề trái", "Xoá luôn dòng đó", "Thêm thật nhiều dấu cách nữa"], correct: 0 },
          { q: "Viết `Say(\"BIẾN ĐI!\")` với `Say` chữ HOA — máy có hiểu không?", a: ["Không — máy phân biệt chữ hoa với chữ thường, phải là `say`", "Có, hoa hay thường đều như nhau", "Có, nhưng máy sẽ nói to gấp đôi"], correct: 0 },
        ],
      },
    },
    {

      npc: "Rèn xong BOM MẬT NGỮ chưa nào? BUG WRAITH kia không cần qua từng câu hỏi nữa đâu — bạn chỉ cần GIƠ NGÓN TRỎ ☝ ngắm thẳng vào nó cho chắc tay, rồi ĐẬP TAY ✋ để phóng bom.",

    },

    {

      npc: "Một phát là phong ấn nó luôn! (Chưa có bom thì quay lại LÒ RÈN rèn thêm đã nhé. )",

    },
    {
      boss: {
        name: "THE BUG WRAITH",
        sheet: {
          src: "assets/bug-wraith-sheet.webp",
        },
        art: "assets/bug-wraith.webp",
        glyph: "👾",
        ko: true,
      },
    },
    {

      npc: "BOM MẬT NGỮ nổ tung, BUG WRAITH bị khống chế và phong ấn ngay trong vòng xoáy rồi! Không cần nghi thức riêng nữa — cú ngắm bằng ngón trỏ rồi đập tay chính là phong ấn.",

    },

    {

      npc: "INPUT → PROCESS → OUTPUT giờ nằm gọn trong đầu bạn; đường sang chặng sau đang mở.",

    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY KÍCH HOẠT VÒNG TRÒN PHÉP THUẬT ✦",
    theme: {
      motion: "pulse",
      palette: {
        core: "#f4c85a",
        dust: "#ffe6a0",
        rune: "#d69a20",
      },
      glyphs: "read",
    },
  },
};
