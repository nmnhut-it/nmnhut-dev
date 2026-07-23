export default {
  index: 1,
  title: "Old Computer: Words",
  subtitle: "học read(), say(), chuỗi, và ghép chữ bằng dấu +",
  bundle: { art: "assets/rookie-bundle.webp", name: "APPRENTICE BUNDLE" },
  machine: {
    art: "assets/old-computer.webp",
    name: "OLD COMPUTER: WORDS",
    blurb: "giờ máy nói bằng chữ",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    // ═══ STRING ARC: chuỗi là gì — trước read() và trước biến ═══
    {

      npc: "say() bạn đã biết rồi — nhưng mấy đoạn chữ nằm trong dấu nháy \"...\" có tên riêng đó nha: CHUỖI.",

    },

    {

      npc: "Một CHUỖI là nhiều ký tự (chữ, số, dấu cách, ký hiệu) viết LIÊN TIẾP nhau — nối nhau như xâu hạt nên mới gọi là \"chuỗi\".",

    },

    {

      npc: "Hai dấu nháy cho máy biết chuỗi bắt đầu và kết thúc ở đâu. RUN thử đủ kiểu chuỗi nè:",

    },
    {
      code: 'from old_computer import say\n\nsay("xin chào")       # chữ có dấu — là chuỗi\nsay("abc 123 !?")     # chữ + số + dấu cách + ký hiệu — vẫn là chuỗi\nsay("   ")            # ba dấu cách — dấu cách cũng là ký tự!\nsay("2026")           # số nằm trong dấu nháy thì vẫn là CHUỖI\n',
      label: "strings_zoo.py",
      note: "ĐỀ BÀI (bài mẫu)\nINPUT: không có\nPROCESS: không có — chỉ nói ra 4 CHUỖI đủ kiểu\nOUTPUT: 4 dòng, mỗi dòng một chuỗi (dòng thứ ba nhìn như trống — nhưng dấu cách cũng là ký tự đó!)",
      expectOut: { all: [{ minLines: 4 }, /xin chào/i, /abc 123 !\?/, /2026/] },
      solution: 'from old_computer import say\n\nsay("xin chào")\nsay("abc 123 !?")\nsay("   ")\nsay("2026")\n',
    },
    {
      code: 'from old_computer import say\n\n# lượt của bạn: viết 2-3 CHUỖI của riêng bạn rồi say() từng chuỗi\n# ví dụ: say("tôi thích mèo")  hay  say("sinh nhật 12/3 🎂")\nsay("...")\nsay("...")\n',
      label: "my_strings.py",
      note: "ĐỀ BÀI (tự làm)\nViết ít nhất 2 dòng say(...) với chuỗi CỦA RIÊNG BẠN — trộn chữ, số, dấu cách, ký hiệu tùy thích, miễn là nằm giữa hai dấu nháy.",
      expectOut: { minLines: 2 },
      solution: "from old_computer import say\n\nsay(\"tôi thích mèo\")\nsay(\"sinh nhật 12/3 🎂\")\n",
    },
    {
      checkpoint: {
        text: 'Một CHUỖI (string) là nhiều ký tự — chữ, số, dấu cách, ký hiệu — viết liên tiếp nhau như xâu hạt; trong Python chuỗi đặt giữa hai dấu nháy `"..."` để máy biết đâu là đầu, đâu là cuối. `"2026"` trong nháy vẫn là chuỗi, không phải con số.',
      },
    },
    {
      quiz: {
        title: "Chuỗi hợp lệ",
        questions: [
          {
            q: "Cái nào viết đúng một CHUỖI trong Python?",
            a: ['"mèo con"', "mèo con (không có dấu nháy)", "<mèo con>"],
            correct: 0,
          },
          {
            q: 'Vì sao `"2026"` (nằm trong dấu nháy) vẫn là CHUỖI chứ không phải con số?',
            a: [
              "Vì nằm giữa hai dấu nháy — máy coi nó là các ký tự nối nhau, không phải số để tính",
              "Vì 2026 là một năm trong tương lai",
              "Sai rồi — trong nháy nó vẫn là số tính được",
            ],
            correct: 0,
          },
        ],
      },
    },

    {


      npc: "Giờ học nốt từ còn thiếu: read() — máy HỎI rồi nhận đúng phần chữ bạn gõ, đó là INPUT. Đây là chương trình ECHO: bạn gõ gì, nó nhắc lại y chang.",


    },


    {


      npc: "Bấm ▶ RUN, rồi nhập thử gì đó vào ô hiện ra.",


    },
    {
      code: 'from old_computer import read, say\n\ntext = read("Nói gì đó đi: ")   # INPUT  — máy lắng nghe\nsay(text)                        # OUTPUT — máy lặp lại\n',
      label: "echo.py",
      note: "ĐỀ BÀI\nINPUT: gõ gì cũng được\nPROCESS: không đổi gì cả\nOUTPUT: máy lặp lại y chang",
      expectOut: { minLines: 1 },
    },
    {
      remember:
        "`read()` là một lệnh — gọi nó thì máy hỏi rồi TRẢ VỀ đúng chuỗi bạn gõ (INPUT) · `say()` nhận một chuỗi và in nó ra màn hình (OUTPUT).",
    },
    {
      quiz: {
        title: "Nghe nói",
        questions: [
          {
            q: "Máy HỎI rồi nhận đúng những gì bạn vừa gõ — đó là lúc dùng từ nào?",
            a: ["`read()`", "`say()`", "cả hai"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đầu vào INPUT thế nào thì đầu ra OUTPUT lặp lại như thế. Giờ đến phần của bạn: dạy máy chào đúng TÊN của bạn. Bấm RUN rồi gõ cho máy biết bạn là ai nào.",
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")   # input\nsay("Xin chào, " + name + "!")          # process (ghép chữ) + output\n',
      label: "greet.py",
      note: 'ĐỀ BÀI\nINPUT: tên bạn\nPROCESS: ghép "Xin chào, " + tên + "!"\nOUTPUT: câu chào đầy đủ',
      expectOut: /xin chào, .+!/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")\nsay("Xin chào, " + name + "!")\n',
    },
    {
      npc: 'Dấu `+` ghép các chuỗi theo thứ tự từ trái sang phải. Đoạn code nối chuỗi "Xin chào, ", phần chữ đang được gọi là `name`, rồi chuỗi "!".',
    },
    {
      npc: "Bạn thấy chữ `name` không? Hãy tưởng tượng nó như một chiếc HỘP để cất đồ vậy. Khi dùng lệnh say(...), chúng ta đang LẤY RA nội dung được cất trong chiếc hộp đó.",
    },
    {
      npc: 'Bây giờ thử đổi nội dung xem sao — bạn bấm RUN lại lần nữa nha, nhưng lần này hãy nhập "Tiểu hoàng tử" (hoặc "Tiểu công chúa") rồi xem kết quả nhé!',
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")   # input — lần này nhập khác đi!\nsay("Xin chào, " + name + "!")          # process + output\n',
      label: "greet_again.py",
      note: 'ĐỀ BÀI\nINPUT: nhập "Tiểu hoàng tử" hoặc "Tiểu công chúa"\nPROCESS: ghép "Xin chào, " + tên + "!" (không đổi code, chỉ đổi INPUT)\nOUTPUT: xem name đổi thì output đổi theo y chang',
      expectOut: /xin chào, (tiểu hoàng tử|tiểu công chúa)!/i,
      sampleInput: "Tiểu hoàng tử",
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")\nsay("Xin chào, " + name + "!")\n',
    },
    {
      npc: "Nội dung của `name` THAY ĐỔI được, tùy bạn gõ gì vào. Vậy nên chúng ta gọi nó là BIẾN — vì nó biến đổi được, y như cái tên vậy!",
    },
    {
      quiz: {
        title: "Ghép chữ",
        questions: [
          {
            q: 'Nếu tên bạn là "Lan", tức name = "Lan", `say("Hello, " + name + "!")` sẽ in ra gì?',
            a: ["Hello, Lan!", "Hello, + name + !", "Lan Hello"],
            correct: 0,
          },
        ],
      },
    },
    {
      quiz: {
        title: "Vì sao gọi là biến",
        questions: [
          {
            q: "Tại sao chúng ta gọi 'cái hộp' như `name` là 'biến'?",
            a: [
              "Vì nó luôn chứa đúng một giá trị, không đổi",
              "Vì nội dung có thể thay đổi được, tùy thuộc vào input",
              "Vì máy tự đặt tên vậy thôi",
            ],
            correct: 1,
          },
        ],
      },
    },

    // ═══ PRACTICE ARC 1: gán biến từ LITERAL (không cần read()) ═══
    {
      npc: "Biến không nhất thiết phải lấy từ read() đâu! Bạn có thể GÁN THẲNG một đoạn chữ vào biến luôn, không cần hỏi ai cả. Xem Pip làm mẫu trước nhé.",
    },
    {
      code: 'from old_computer import say\n\nmood = "vui vẻ"                      # gán THẲNG — không cần read()\nsay("Hôm nay Pip cảm thấy " + mood + "!")\n',
      label: "mood.py",
      note: 'ĐỀ BÀI (bài mẫu)\nINPUT: không có — mood được GÁN THẲNG\nPROCESS: ghép "Hôm nay Pip cảm thấy " + mood + "!"\nOUTPUT: câu cảm xúc của Pip',
      expectOut: /hôm nay pip cảm thấy vui vẻ!/i,
      solution: 'from old_computer import say\n\nmood = "vui vẻ"\nsay("Hôm nay Pip cảm thấy " + mood + "!")\n',
    },
    {
      code: 'from old_computer import say\n\nmood = "vui vẻ"        # lượt của bạn: đổi thành chuỗi KHÁC, ví dụ "hào hứng 🎉" hay "vui như Tết 2026"\nsay("Hôm nay tôi cảm thấy " + mood + "!")\n',
      label: "my_mood.py",
      note: "ĐỀ BÀI (tự làm)\nINPUT: không có\nPROCESS: đổi mood thành một từ RIÊNG của bạn — giữ nguyên phần ghép chữ\nOUTPUT: câu cảm xúc dùng từ bạn chọn",
      expectOut: /hôm nay tôi cảm thấy .+!/i,
      solution: "from old_computer import say\n\nmood = \"hào hứng 🎉\"\nsay(\"Hôm nay tôi cảm thấy \" + mood + \"!\")\n",
    },
    {
      checkpoint: {
        text: 'Biến có thể được gán thẳng bằng một chuỗi, không cần `read()`: `mood = "vui vẻ"`. Sau đó dùng biến đó trong `say()` y như biến lấy từ `read()`.',
      },
    },
    {
      quiz: {
        title: "Gán thẳng chữ",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nmood = "buồn ngủ"\nsay("Hôm nay tôi cảm thấy " + mood + "!")\n```\nMáy in ra gì?',
            a: ["Hôm nay tôi cảm thấy buồn ngủ!", "mood", "buồn ngủ"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: "Giờ bạn tự xử lý rồi đó — lần này Pip chỉ đứng cạnh nhắc thôi nhé. Thử thách số một: đoạn code này đang lỗi. Bấm RUN, đọc xem máy báo lỗi gì, rồi sửa giúp Pip với!",
    },
    {
      code: 'from old_computer import read, say\n\nwish = read("Ước một điều: ")   # input\nsay("Điều ước được chấp nhận: " + wsh)         # process + output\n',
      label: "wish.py",
      note: 'ĐỀ BÀI\nINPUT: điều ước bạn gõ\nPROCESS: ghép "Điều ước được chấp nhận: " + điều ước\nOUTPUT: câu đó — nhưng code đang gõ SAI tên biến (wsh), sửa lại thành wish trước đã',
      expectOut: /điều ước được chấp nhận:/i,
      solution: 'from old_computer import read, say\n\nwish = read("Ước một điều: ")\nsay("Điều ước được chấp nhận: " + wish)\n',
    },
    {
      quiz: {
        title: "Đọc lỗi",
        questions: [
          {
            q: "Biến tên là `wish` nhưng lại gõ nhầm thành `wsh`, thì đó là lỗi gì?",
            a: ["thiếu dấu `+`", "gõ sai tên biến", "quên nhập tên"],
            correct: 1,
          },
        ],
      },
    },

    // ═══ PRACTICE ARC 2: say() CÙNG MỘT biến hai lần — nội dung không đổi ═══
    {

      npc: "Sửa lỗi ngon lành! Giờ để ý điều này: biến GIỮ NGUYÊN nội dung cho tới khi bạn gán lại.",

    },

    {

      npc: "Pip sẽ say() CÙNG một biến hai lần liên tiếp — xem nội dung của biến lúc này có đổi giữa hai lần không nhé.",

    },
    {
      code: 'from old_computer import say\n\nmood = "vui vẻ"\nsay(mood)   # lần 1: nội dung của mood lúc này là "vui vẻ"\nsay(mood)   # lần 2: mood chưa hề bị đổi — nội dung vẫn y chang\n',
      label: "same_twice.py",
      note: "ĐỀ BÀI (bài mẫu)\nINPUT: không có\nPROCESS: không đổi mood giữa hai lần say\nOUTPUT: 2 dòng — y CHANG nhau, vì biến không đổi",
      expectOut: { all: [{ minLines: 2 }, /vui vẻ/i] },
      solution: 'from old_computer import say\n\nmood = "vui vẻ"\nsay(mood)\nsay(mood)\n',
    },
    {
      code: 'from old_computer import say\n\nmood = "hào hứng"   # lượt của bạn: đổi thành chuỗi RIÊNG của bạn\nsay(mood)\nsay(mood)             # dòng say(mood) thứ hai — y hệt dòng trên\n',
      label: "my_same_twice.py",
      note: "ĐỀ BÀI (tự làm)\nINPUT: không có\nPROCESS: đổi mood thành từ của bạn, giữ ĐỦ 2 dòng say(mood)\nOUTPUT: 2 dòng giống hệt nhau",
      expectOut: { minLines: 2 },
      solution: "from old_computer import say\n\nmood = \"hào hứng\"\nsay(mood)\nsay(mood)\n",
    },
    {
      checkpoint: {
        text: "Biến giữ nguyên giá trị cho tới khi được gán lại: gọi `say(mood)` hai lần liên tiếp mà không gán lại `mood` thì hai dòng in ra y hệt nhau.",
      },
    },
    {
      quiz: {
        title: "Nội dung của biến",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nmood = "tự tin"\nsay(mood)\nsay(mood)\n```\nMáy in ra gì?',
            a: ['"tự tin" một lần rồi dừng', '"tự tin" hai dòng, y hệt nhau', '"tự tin" rồi đến "mood"'],
            correct: 1,
          },
        ],
      },
    },

    // ═══ PRACTICE ARC 3: ghép biến+chữ vào biến MỚI, rồi ghép NHIỀU biến ═══
    {
      npc: "Bạn đã biết ghép chữ bằng dấu + trong say() rồi. Giờ học thêm: kết quả ghép đó CÓ THỂ cất vào một biến MỚI trước, rồi đưa biến đó vào say() sau — không cần ghép ngay trong say().",
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")            # input\ngreeting = "Xin chào, " + name + "!"  # ghép rồi CẤT vào biến MỚI: greeting\nsay(greeting)                         # say biến đó — không ghép lại\n',
      label: "greeting_var.py",
      note: 'ĐỀ BÀI (bài mẫu)\nINPUT: tên bạn\nPROCESS: ghép "Xin chào, "+name+"!" rồi CẤT vào biến MỚI greeting\nOUTPUT: say(greeting) in ra câu chào',
      expectOut: /xin chào, .+!/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")\ngreeting = "Xin chào, " + name + "!"\nsay(greeting)\n',
    },
    {
      npc: "Ghép hai biến với nhau cũng được luôn — không nhất thiết phải có chữ cố định ở giữa, cứ nối biến với biến bằng dấu + là xong. Thử ghép HỌ và TÊN thành một biến full nhé.",
    },
    {
      code: 'from old_computer import read, say\n\nfirst = read("Tên? ")   # input\nlast = read("Họ? ")     # input\n# lượt của bạn: tạo một biến mới chứa họ tên đầy đủ\n# rồi in câu chào dùng biến đó\n',
      label: "full_name.py",
      note: "ĐỀ BÀI (tự làm)\nINPUT: tên + họ\nPROCESS: ghép hai biến đã đọc vào một biến mới\nOUTPUT: câu chào dùng họ tên đầy đủ",
      expectOut: /xin chào,\s+\S+.*\S+!/i,
      solution: "from old_computer import read, say\n\nfirst = read(\"Tên? \")\nlast = read(\"Họ? \")\nfull = first + \" \" + last\nsay(\"Xin chào, \" + full + \"!\")\n",
    },
    {
      checkpoint: {
        text: 'Kết quả nối chuỗi bằng `+` có thể gán vào một biến mới trước khi `say()`, và nhiều biến nối được với nhau: `full = first + " " + last`.',
      },
    },
    {
      quiz: {
        title: "Ghép nhiều biến",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nfirst = "Mai"\nlast = "Ly"\nfull = first + " " + last\n```\n`full` có giá trị gì?',
            a: ["Mai Ly", "first last", "MaiLy"],
            correct: 0,
          },
        ],
      },
    },

    {
      npc: 'Giờ ghép NHIỀU MẢNH cùng lúc cũng vậy thôi — cứ nối tiếp bằng dấu + là được. Thử thách cuối: hỏi tên và con vật yêu thích, rồi in ra: "Xin chào, tôi là <name> và tôi thích <animal>!"',
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")            # input\nanimal = read("Con vật bạn thích là gì? ")    # input\n# lượt của bạn: in câu giới thiệu dùng cả name và animal\n# câu cần có dạng: Xin chào, tôi là <name> và tôi thích <animal>!\n',
      label: "intro.py",
      note: "ĐỀ BÀI\nINPUT: tên + con vật yêu thích\nPROCESS: ghép NHIỀU mảnh chữ lại bằng dấu +\nOUTPUT: câu giới thiệu đầy đủ",
      expectOut: /xin chào.*và tôi thích/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn là gì? ")\nanimal = read("Con vật bạn thích là gì? ")\nsay("Xin chào, tôi là " + name + " và tôi thích " + animal + "!")\n',
    },
    {
      quiz: {
        title: "Ghép nhiều mảnh",
        questions: [
          {
            q: 'Đọc dòng code này:\n```python\nsay("Xin chào, tôi là " + name + " và tôi thích " + animal + "!")\n```\nCâu này ghép TẤT CẢ mấy mảnh chữ lại?',
            a: ["1 mảnh", "2 mảnh", "5 mảnh"],
            correct: 2,
          },
        ],
      },
    },
    // ═══ XƯỞNG PHÉP 1: Máy làm thẻ tên ═══
    {

      npc: "Trước khi qua SỐ, ghé XƯỞNG PHÉP chế hai cái máy chơi thật nha!",

    },

    {

      npc: "Máy đầu tiên: THẺ TÊN — hỏi tên và lớp của bạn, rồi in ra một cái thẻ có viền hẳn hoi, như thẻ đeo ở cổng trường vậy đó.",

    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")   # input\nclass_name = read("Lớp bạn? ")    # input\nsay("==========")           # viền trên (output)\nsay("Tên: " + name)         # process (ghép) + output\nsay("Lớp: " + class_name)          # process (ghép) + output\nsay("==========")           # viền dưới (output)\n',
      label: "🔧 XƯỞNG PHÉP: Thẻ tên",
      note: "ĐỀ BÀI\nINPUT: tên + lớp\nPROCESS: ghép nhãn với từng biến\nOUTPUT: thẻ 4 dòng — viền trên, tên, lớp, viền dưới",
      expectOut: { all: [{ minLines: 4 }, /==========/] },
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nclass_name = read("Lớp bạn? ")\nsay("==========")\nsay("Tên: " + name)\nsay("Lớp: " + class_name)\nsay("==========")\n',
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")   # input\nclass_name = read("Lớp bạn? ")    # input\nsay("==========")\nsay("Tên: " + name)\nsay("Lớp: " + class_name)\n# nâng cấp máy — lượt của bạn: thêm MỘT dòng thông tin tự chọn (ví dụ say("Thích: cầu vồng"))\nsay("==========")\n',
      label: "🔧 nâng cấp máy: Thẻ tên",
      note: "ĐỀ BÀI (nâng cấp, tự chọn)\nThêm một dòng say(...) thông tin RIÊNG của bạn vào giữa hai dòng Lớp và viền dưới — nội dung tùy bạn.",
      expectOut: { minLines: 5 },
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nclass_name = read("Lớp bạn? ")\nsay("==========")\nsay("Tên: " + name)\nsay("Lớp: " + class_name)\nsay("Thích: cầu vồng")\nsay("==========")\n',
    },
    {
      remember:
        "Máy THẺ TÊN vừa ghép được: nhiều biến (name, lop) cùng những dòng say() cố định (viền `==========`) thành một khối OUTPUT nhiều dòng có bố cục hẳn hoi.",
    },
    {
      quiz: {
        title: "Thẻ tên",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nname = "Bo"\nclass_name = "3A2"\nsay("Tên: " + name)\n```\nMáy in ra gì?',
            a: ["Tên: Bo", "name: Bo", "Bo: Tên"],
            correct: 0,
          },
        ],
      },
    },
    // ═══ XƯỞNG PHÉP 2: Máy kể chuyện (mad-libs) ═══
    {
      npc: "Máy thứ hai: MÁY KỂ CHUYỆN! Hỏi ba thứ — tên, một con vật, một món ăn — rồi tự ghép thành một câu chuyện vui. Cùng một mảnh ghép, thay input là ra chuyện khác liền!",
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")            # input\nanimal = read("Con vật bạn thích? ")   # input\nfood = read("Món ăn bạn thích? ")     # input\nsay("Ngày xưa, " + name + " nuôi một con " + animal + ".")            # process (ghép) + output\nsay("Mỗi sáng, " + name + " cho " + animal + " ăn " + food + ".")   # process (ghép) + output\n',
      label: "🔧 XƯỞNG PHÉP: Máy kể chuyện",
      note: "ĐỀ BÀI\nINPUT: tên + con vật + món ăn\nPROCESS: ghép 3 biến vào khung câu chuyện có sẵn\nOUTPUT: 2 câu chuyện dùng lại cùng 3 biến",
      expectOut: { all: [{ minLines: 2 }, /ngày xưa,/i, /mỗi sáng,/i] },
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nanimal = read("Con vật bạn thích? ")\nfood = read("Món ăn bạn thích? ")\nsay("Ngày xưa, " + name + " nuôi một con " + animal + ".")\nsay("Mỗi sáng, " + name + " cho " + animal + " ăn " + food + ".")\n',
    },
    {
      remember:
        "Máy KỂ CHUYỆN dùng LẠI cùng ba biến (ten, con_vat, mon_an) ở nhiều câu khác nhau — đổi input một lần, cả câu chuyện đổi theo.",
    },
    {
      quiz: {
        title: "Kể chuyện",
        questions: [
          {
            q: 'Đọc đoạn code này:\n```python\nname = "Su"\nanimal = "mèo"\nsay("Ngày xưa, " + name + " nuôi một con " + animal + ".")\n```\nMáy in ra gì?',
            a: ["Ngày xưa, Su nuôi một con mèo.", "Ngày xưa, ten nuôi một con con_vat.", "Su mèo Ngày xưa"],
            correct: 0,
          },
        ],
      },
    },
    {

      npc: "Giới thiệu bản thân xong xuôi rồi, lại vừa chế được hai cái máy chơi thiệt!",

    },

    {

      npc: "Sức mạnh của chữ nghĩa đã nằm gọn trong lòng bàn tay bạn, cùng giơ tay niêm phong giao kèo để tụi mình học tiếp về SỐ nào!",

    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG GIAO KÈO",
    theme: { motion: "comet", palette: { core: "#78b2a5", dust: "#d9eee5", rune: "#f4c85a" }, glyphs: "say" },
  },
};
