export default {
  index: 2,
  title: "Old Computer: Numbers",
  subtitle: "đếm, tính toán, và đọc thông báo lỗi",
  bundle: { art: "assets/rookie-bundle.webp", name: "CALC BUNDLE" },
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

      npc: "Máy tính có thể tính hàng tỉ phép tính mỗi giây!",

    },

    {

      npc: "Có hai từ mới: read_num() để hỏi rồi nhận một SỐ (nhớ nha — read() nhận CHUỖI, còn read_num() nhận SỐ thật để tính được), còn say_num() để nói ra một SỐ. Bạn thử nhấn RUN xem nào!",

    },
    {
      code: 'from old_computer import read_num, say_num, say\n\na = read_num("Số thứ nhất: ")   # input\nb = read_num("Số thứ hai: ")    # input\nsay("Tổng:")                    # output (nhãn)\nsay_num(a + b)                  # process (a + b) + output\n',
      label: "calc.py",
      note: 'ĐỀ BÀI\nINPUT: hai số\nPROCESS: cộng a + b\nOUTPUT: in nhãn "Tổng:" rồi in kết quả',
      expectOut: /tổng/i,
      solution: 'from old_computer import read_num, say_num, say\n\na = read_num("Số thứ nhất: ")\nb = read_num("Số thứ hai: ")\nsay("Tổng:")\nsay_num(a + b)\n',
    },
    {
      remember:
        "`read_num()` là lệnh hỏi rồi nhận một SỐ · `say_num()` in ra một SỐ.",
    },
    {
      checkpoint: {
        text: "`read_num()` nhận một SỐ (không phải CHUỖI), `say_num()` in ra một SỐ — khác với `read()`/`say()` vốn làm việc với CHUỖI.",
      },
    },
    {
      quiz: {
        title: "Số thật",
        questions: [
          {
            q: "Muốn cộng 3 và 5 rồi in ra kết quả là 8, chúng mình cần dùng cặp từ nào nhỉ?",
            a: ["`read()/say()`", "`read_num()/say_num()`", "`calc()/result()`"],
            correct: 1,
          },
        ],
      },
    },
    {
      npc: "Làm phép cộng được rồi thì trừ, nhân, chia cũng dễ ợt! Bạn thử thêm ba dòng nữa: phép trừ dùng dấu -, phép nhân dùng dấu *, phép chia dùng dấu / nhé.",
    },
    {
      code: 'from old_computer import read_num, say_num, say\n\na = read_num("Số thứ nhất: ")   # input\nb = read_num("Số thứ hai: ")    # input\nsay("Tổng:")                    # output (nhãn)\nsay_num(a + b)                  # process (a + b) + output\n# lượt của bạn: thêm phần hiệu, tích, thương\n# mỗi phần cần có nhãn riêng rồi in kết quả tương ứng\n',
      label: "calc_full.py",
      note: "ĐỀ BÀI\nINPUT: hai số (đã có)\nPROCESS: thêm phép trừ (-), nhân (*), chia (/)\nOUTPUT: in đủ 4 nhãn (Tổng/Hiệu/Tích/Thương) + 4 kết quả",
      expectOut: { all: [/tổng/i, /hiệu/i, /tích/i, /thương/i] },
      solution: 'from old_computer import read_num, say_num, say\n\na = read_num("Số thứ nhất: ")\nb = read_num("Số thứ hai: ")\nsay("Tổng:")\nsay_num(a + b)\nsay("Hiệu:")\nsay_num(a - b)\nsay("Tích:")\nsay_num(a * b)\nsay("Thương:")\nsay_num(a / b)\n',
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
            a: ["-, x, :", "+, =, /", "-, *, /"],
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
      remember:
        "Mỗi lần RUN mà lệnh chưa chuẩn, máy sẽ BÁO LỖI ngay — đọc thật kĩ lỗi đó để sửa, đừng đoán mò. Python chỉ báo MỘT lỗi mỗi lần RUN, nên phải sửa và RUN lại nhiều lần.",
    },
    {
      code: 'from old_computer import say\n\nsay("Bụi phép sống dậy!)\nsay("Hai dòng chú, hai lỗi"):\n',
      label: "quote.py",
      note: "ĐỀ BÀI\nCó 2 LỖI trong đoạn này — bạn hãy sửa lỗi 1, nhấn RUN, đọc lỗi tiếp theo rồi sửa nốt, và nhấn RUN lần nữa nhé.\nLỗi 1: bị thiếu dấu ngoặc kép đóng.\nLỗi 2: bị dư một dấu hai chấm : ở cuối dòng.",
      expectOut: { all: [/bụi phép sống dậy!/i, /hai dòng chú, hai lỗi/i] },
      solution: 'from old_computer import say\n\nsay("Bụi phép sống dậy!")\nsay("Hai dòng chú, hai lỗi")\n',
    },
    {
      checkpoint: {
        text: 'Mỗi dấu nháy kép `"` mở phải có một dấu nháy kép đóng, và dấu hai chấm `:` chỉ dành cho vài câu đặc biệt bạn sẽ học ở node sau — một dòng lệnh thường không được kết thúc bằng nó; thiếu hoặc thừa đều làm máy báo lỗi ngay lần RUN đó.',
      },
    },
    {
      quiz: {
        title: "Dấu nháy khớp",
        questions: [
          {
            q: '`say("Chào bạn)` — máy báo lỗi. Thiếu gì?',
            a: ["dấu nháy đóng ở cuối", "dấu +", "chữ hoa"],
            correct: 0,
          },
          {
            q: '`say("Niệm xong"):` — dòng này là một lệnh bình thường, vậy dấu : ở cuối là gì?',
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
      code: 'from old_computer import say\n\nsay("bước một - khuấy bụi phép")\n    say("bước hai - thắp sáng nó")\n',
      label: "indent.py",
      note: "ĐỀ BÀI\nDòng thứ hai đang bị thụt vào vô cớ. Kéo nó sát về bên trái, rồi RUN lại.",
      expectOut: { all: [/bước một/i, /bước hai/i] },
      solution: 'from old_computer import say\n\nsay("bước một - khuấy bụi phép")\nsay("bước hai - thắp sáng nó")\n',
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
            q: '`say("A")` rồi dòng dưới thụt vào `    say("B")` — vì sao máy báo lỗi?',
            a: ["thụt vào vô cớ", "thiếu dấu ngoặc", "tên biến sai"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Máy báo lỗi rất có ích: đọc lỗi → tìm chỗ nứt → sửa đoạn code.",
    },
    // ═══ XƯỞNG PHÉP 3: Máy tính tuổi ═══
    {
      npc: "Trước khi đấu BUG WRAITH, ghé XƯỞNG PHÉP chế hai máy TÍNH nữa! Máy đầu: TÍNH TUỔI — hỏi năm sinh, trừ cho năm nay, ra tuổi liền.",
    },
    {
      code: 'from old_computer import read_num, say_num, say\n\nbirth_year = read_num("Bạn sinh năm nào? ")   # input\nage = 2026 - birth_year                        # process (phép trừ)\nsay("Tuổi của bạn là:")                       # output (nhãn)\nsay_num(age)                                 # output\n',
      label: "🔧 XƯỞNG PHÉP: Máy tính tuổi",
      note: "ĐỀ BÀI\nINPUT: năm sinh\nPROCESS: 2026 - nam_sinh\nOUTPUT: nhãn \"Tuổi của bạn là:\" rồi số tuổi",
      expectOut: { all: [/tuổi/i, { minLines: 2 }] },
      solution: 'from old_computer import read_num, say_num, say\n\nbirth_year = read_num("Bạn sinh năm nào? ")\nage = 2026 - birth_year\nsay("Tuổi của bạn là:")\nsay_num(age)\n',
    },
    {
      remember:
        "Máy TÍNH TUỔI dùng `read_num()` lấy năm sinh, trừ cho một SỐ cố định trong code (`2026 - birth_year`), rồi `say_num()` in kết quả — phép tính có thể trộn một biến với một con số viết thẳng.",
    },
    {
      quiz: {
        title: "Tính tuổi",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nbirth_year = 2016\nage = 2026 - birth_year\n```\n`age` bằng bao nhiêu?",
            a: ["10", "2016", "4042"],
            correct: 0,
          },
        ],
      },
    },
    // ═══ XƯỞNG PHÉP 4: Máy đo hình chữ nhật ═══
    {
      npc: "Máy thứ hai: ĐO HÌNH CHỮ NHẬT — hỏi chiều dài, chiều rộng, rồi tính luôn CHU VI và DIỆN TÍCH bằng hai công thức khác nhau.",
    },
    {
      code: 'from old_computer import read_num, say_num, say\n\nlength = read_num("Chiều dài? ")    # input\nwidth = read_num("Chiều rộng? ")  # input\nsay("Chu vi:")                    # output (nhãn)\nsay_num((length + width) * 2)         # process (chu vi) + output\nsay("Diện tích:")                 # output (nhãn)\nsay_num(length * width)               # process (diện tích) + output\n',
      label: "🔧 XƯỞNG PHÉP: Máy đo hình chữ nhật",
      note: "ĐỀ BÀI\nINPUT: chiều dài + chiều rộng\nPROCESS: chu vi = (dài + rộng) * 2, diện tích = dài * rộng\nOUTPUT: 4 dòng — nhãn Chu vi, số, nhãn Diện tích, số",
      expectOut: { all: [/chu vi/i, /diện tích/i, { minLines: 4 }] },
      solution: 'from old_computer import read_num, say_num, say\n\nlength = read_num("Chiều dài? ")\nwidth = read_num("Chiều rộng? ")\nsay("Chu vi:")\nsay_num((length + width) * 2)\nsay("Diện tích:")\nsay_num(length * width)\n',
    },
    {
      remember:
        "Máy ĐO HÌNH CHỮ NHẬT dùng CÙNG hai biến (dai, rong) cho HAI công thức khác nhau — `(length + width) * 2` cho chu vi, `length * width` cho diện tích — mỗi kết quả có nhãn say() riêng đứng trước.",
    },
    {
      quiz: {
        title: "Đo hình chữ nhật",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\nlength = 5\nwidth = 3\nsay_num(length * width)\n```\nMáy in ra số nào?",
            a: ["15", "8", "16"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đã tới lúc dùng MẬT NGỮ để tấn công BUG WRAITH rồi ♥. Cẩn thận nhé — mất cả ba tim thì quái vật hồi đầy máu đấy! Hạ gục nó, rồi đập tay ✋ ăn mừng nào!",
    },
    {
      boss: {
        name: "THE BUG WRAITH",
        sheet: { src: "assets/bug-wraith-sheet.webp" },
        art: "assets/bug-wraith.webp",
        glyph: "👾",
        hp: 900, // generously high so every round is reachable regardless of streak play — complete_circle is a `finisher` round (see boss-fight.js#strike) that ALWAYS ends the fight on a clean hit, so exact HP tuning against cumulative damage no longer matters, just "enough to not die before getting there"
        baseDmg: 20,
        streakMul: [1, 1.5, 2],
        heal: 10,
        hearts: 3,
        rounds: [
          // numeric options must sit on their matching button (answer "3" = button 3 = 3 fingers)
          {
            code: 'from old_computer import say\n\nsay("biến đi, ma quái!\n',
            label: "banish.py",
            note: "Chữa đoạn code rồi RUN để STRIKE",
            dmg: 30,
            expectOut: /biến đi, ma quái!/i,
            solution: 'from old_computer import say\n\nsay("biến đi, ma quái!")\n',
          },
          {
            q: "`say(...)` thuộc phần nào? Giơ ngón tay chọn đáp án đúng!",
            a: ["INPUT", "OUTPUT"],
            correct: 1,
          },
          {
            q: "Máy báo:  name 'sey' is not defined.  Vậy lỗi là gì?",
            a: ["gõ nhầm say", "máy đang ngáp", "Python thèm trà sữa"],
            correct: 0,
          },
          {
            code: "from old_computer import say\n\nsay(begone)\n",
            label: "word_trap.py",
            note: "Chữ thường phải đặt trong dấu nháy thì máy mới nói được — chữa lỗi đi",
            dmg: 30,
            expectOut: /begone/i,
            solution: 'from old_computer import say\n\nsay("begone")\n',
          },
          {
            q: 'say("bụi phép  — máy không chạy dòng này. Thiếu gì?',
            a: ["mật khẩu phép", 'dấu đóng " và )', "máy to hơn"],
            correct: 1,
          },
          {
            code: 'from old_computer import say\n\nsay("bão bụi phép"\n',
            label: "open_claw.py",
            note: "có gì đó mở ra mà chưa đóng lại — chữa lỗi đi",
            dmg: 30,
            expectOut: /bão bụi phép/i,
            solution: 'from old_computer import say\n\nsay("bão bụi phép")\n',
          },
          {
            code: 'from old_computer import say\n\nsay("bụi phép, tụ lại")\n    say("tấn công ma quái!")\n',
            label: "strike.py",
            note: "kéo dòng thứ hai về sát lề trái, rồi RUN",
            dmg: 30,
            expectOut: { all: [/bụi phép, tụ lại/i, /tấn công ma quái/i] },
            solution: 'from old_computer import say\n\nsay("bụi phép, tụ lại")\nsay("tấn công ma quái!")\n',
          },
          {
            code: 'from old_computer import say\n\nsay("BIẾN ĐI!")\n',
            label: "big_letter.py",
            note: "máy phân biệt chữ hoa và chữ thường — chữa lỗi đi",
            dmg: 30,
            expectOut: /biến đi!/i,
            solution: 'from old_computer import say\n\nsay("BIẾN ĐI!")\n',
          },
          {
            code: 'from old_computer import read_num, say_num\n\nn = read_num("Nhập một số bất kì: ")   # input\n# HOÀN THÀNH VÒNG TRÒN PHÉP THUẬT — in bảng cửu chương của SỐ BẠN VỪA NHẬP, từ x1 đến x9.\n# Ví dụ: nhập 3 thì in ra: 3 6 9 12 15 18 21 24 27 (mỗi dòng say_num một kết quả)\nsay_num(n * 1)    # process (n * 1) + output\n# lượt của bạn — viết tiếp 8 dòng say_num(...) còn lại (x 2 đến x 9), đổi số nhân mỗi dòng\n',
            label: "complete_circle.py",
            note: "HOÀN THÀNH VÒNG TRÒN PHÉP THUẬT: Nhập một số bất kì, sau đó in ra bảng cửu chương từ x1 đến x9 của số đó. Đây chính là ĐÒN KẾT LIỄU, code đúng là hạ gục được BUG WRAITH ngay!",
            dmg: 40,
            finisher: true,
            expectOut: { minLines: 9 },
            solution: 'from old_computer import read_num, say_num\n\nn = read_num("Nhập một số bất kì: ")\nsay_num(n * 1)\nsay_num(n * 2)\nsay_num(n * 3)\nsay_num(n * 4)\nsay_num(n * 5)\nsay_num(n * 6)\nsay_num(n * 7)\nsay_num(n * 8)\nsay_num(n * 9)\n',
          },
        ],
      },
    },
    {
      npc: "VÒNG TRÒN PHÉP THUẬT đã hoàn thành, Ma quái đã tan rồi! INPUT → PROCESS → OUTPUT giờ nằm gọn trong đầu bạn rồi. Chỉ còn một việc cuối: KÍCH HOẠT vòng tròn để niêm phong giao kèo!",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY KÍCH HOẠT VÒNG TRÒN PHÉP THUẬT ✦",
    theme: { motion: "pulse", palette: { core: "#f4c85a", dust: "#ffe6a0", rune: "#d69a20" }, glyphs: "read" },
  },
};
