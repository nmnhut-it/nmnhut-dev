export default {
  index: 18,
  title: "Function: Đóng Gói Các Bước",
  subtitle: "gom việc lặp lại bằng def, gọi lại nhiều lần, truyền dữ liệu bằng tham số, và hiểu vì sao import dùng được đồ người khác đóng gói",
  bundle: { art: "assets/future-packet.webp", name: "FUNCTION PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY ĐÚC HÀM",
    blurb: "một xưởng nhỏ biến nhiều dòng lặp lại thành một lời gọi gọn",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn chuỗi và list trước khi vào hàm",
        questions: [
          {
            q: '`text = "KOTOPIA"`. Dòng `say(text[-1])` in gì?',
            a: ["A", "K", "I"],
            correct: 0,
          },
          {
            q: "`a = [1, 2, 3, 4]`. Dòng `say(a[1:3])` in gì?",
            a: ["[2, 3]", "[1, 2, 3]", "[3, 4]"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Trước giờ bạn đã dùng nhiều thứ có dấu ngoặc như `say(...)`, `len(...)`, `range(...)`, `int(...)`, `str(...)`. Tới node này mình gọi đúng tên của chúng: HÀM. Hàm là một khối việc được đặt tên để gọi lại khi cần.",
    },
    {
      npc: "Bắt đầu bằng một nỗi phiền thật: muốn in hai cái thẻ giống nhau, mình phải copy cùng ba dòng nhiều lần. Nếu đổi kiểu viền, mình phải sửa từng dòng viền.",
    },
    {
      npc: "Dễ sót, dễ lệch, và càng nhiều thẻ càng mệt.",
    },
    {
      code: `from old_computer import say

say("====")
say("PIP")
say("====")

say("====")
say("KOTO")
say("====")
`,
      label: "copy_paste_demo.py",
      note: "RUN KIỂM CHỨNG\nBấm RUN để thấy cùng một mẫu ba dòng bị viết lặp lại hai lần. Code chạy được, nhưng chưa gọn.",
      expectOut: { all: [{ minLines: 6 }, /^====$/, /^PIP$/, /^KOTO$/] },
      solution: `from old_computer import say

say("====")
say("PIP")
say("====")

say("====")
say("KOTO")
say("====")
`,
    },
    {
      code: `from old_computer import say

say("====")      # Sửa tất cả viền thành ****
say("PIP")
say("====")

say("====")
say("KOTO")
say("====")
`,
      label: "copy_paste_pain.py",
      note: "ĐỀ BÀI\nĐổi cả bốn dòng viền từ `====` thành `****`. Bài này cố tình hơi chán: đó chính là lý do mình cần hàm.",
      expectOut: { all: [{ minLines: 6 }, /^\*\*\*\*$/, /^PIP$/, /^KOTO$/] },
      solution: `from old_computer import say

say("****")
say("PIP")
say("****")

say("****")
say("KOTO")
say("****")
`,
    },
    {
      npc: "Hàm giải nỗi phiền đó bằng cách gom một khối việc vào sau `def`. Dòng `def dong_khung_pip():` nghĩa là đặt tên cho một khối việc. Các dòng thụt vào bên dưới là thân hàm.",
    },
    {
      npc: "Khi viết `dong_khung_pip()`, Python mới chạy khối đó.",
    },
    {
      code: `from old_computer import say

def dong_khung_pip():
    say("====")
    say("PIP")
    say("====")

dong_khung_pip()
dong_khung_pip()
`,
      label: "first_function_demo.py",
      note: "RUN KIỂM CHỨNG\nĐịnh nghĩa hàm một lần, rồi gọi hai lần. Mỗi lần gọi chạy lại toàn bộ thân hàm.",
      expectOut: { all: [{ minLines: 6 }, /^PIP$/] },
      solution: `from old_computer import say

def dong_khung_pip():
    say("====")
    say("PIP")
    say("====")

dong_khung_pip()
dong_khung_pip()
`,
    },
    {
      code: `from old_computer import say

def dong_khung_pip():
    say("====")
    say("PIP")
    say("====")

# Thêm lời gọi hàm ở dưới dòng này để máy in thẻ PIP
`,
      label: "call_function_fix.py",
      note: "ĐỀ BÀI\nBài đã có định nghĩa hàm, nhưng chưa gọi nên chưa in gì. Thêm `dong_khung_pip()` ở cuối để output có PIP.",
      expectOut: /PIP/,
      solution: `from old_computer import say

def dong_khung_pip():
    say("====")
    say("PIP")
    say("====")

dong_khung_pip()
`,
    },
    {
      checkpoint: {
        text: "Mẫu hàm đầu tiên: `def ten_ham():` rồi thụt vào các dòng thân hàm. Định nghĩa hàm chưa chạy thân hàm ngay; phải gọi bằng `ten_ham()` thì Python mới chạy các dòng bên trong.",
      },
    },
    {
      quiz: {
        title: "Định nghĩa và gọi hàm",
        questions: [
          {
            q: "Dòng `def dong_khung_pip():` làm gì?",
            a: ["Đặt tên cho một khối việc để gọi sau", "In chữ PIP ngay lập tức", "Xóa toàn bộ code phía dưới"],
            correct: 0,
          },
          {
            q: "Muốn chạy thân hàm `dong_khung_pip`, dòng nào đúng?",
            a: ["`dong_khung_pip()`", "`def dong_khung_pip():`", "`say(dong_khung_pip)`"],
            correct: 0,
          },
          {
            q: "Nếu chỉ định nghĩa hàm mà không gọi hàm, chuyện gì xảy ra?",
            a: ["Thân hàm chưa chạy", "Thân hàm tự chạy ba lần", "Python tự đoán lúc cần gọi"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Hàm vừa rồi chỉ in được PIP. Muốn cùng một mẫu dùng được cho nhiều tên, mình thêm THAM SỐ. Tham số là ô nhận dữ liệu khi hàm được gọi: `def dong_khung(text):` tạo ô `text`;",
    },
    {
      npc: "gọi `dong_khung(\"KOTO\")` thì trong lần gọi đó, `text` giữ chuỗi KOTO.",
    },
    {
      code: `from old_computer import say

def dong_khung(text):
    say("====")
    say(text)
    say("====")

dong_khung("PIP")
dong_khung("KOTOPIA")
`,
      label: "parameter_demo.py",
      note: "RUN KIỂM CHỨNG\nMột hàm, hai lần gọi, hai dữ liệu khác nhau. Tham số `text` nhận giá trị mới ở từng lần gọi.",
      expectOut: { all: [{ minLines: 6 }, /^PIP$/, /^KOTOPIA$/] },
      solution: `from old_computer import say

def dong_khung(text):
    say("====")
    say(text)
    say("====")

dong_khung("PIP")
dong_khung("KOTOPIA")
`,
    },
    {
      code: `from old_computer import say

def dong_khung(text):
    say("====")
    say(text)
    say("====")

dong_khung()      # Sửa lời gọi để truyền chuỗi "MIRA"
`,
      label: "parameter_fix.py",
      note: "ĐỀ BÀI\nHàm cần một tham số `text`, nhưng lời gọi đang không truyền gì nên sẽ lỗi. Sửa lời gọi để output có MIRA.",
      expectOut: /MIRA/,
      solution: `from old_computer import say

def dong_khung(text):
    say("====")
    say(text)
    say("====")

dong_khung("MIRA")
`,
    },
    {
      checkpoint: {
        text: "Tham số giúp một hàm dùng lại được với nhiều dữ liệu. Trong `def dong_khung(text):`, `text` là tên ô nhận dữ liệu. Khi gọi `dong_khung(\"PIP\")`, ô `text` giữ chuỗi PIP trong lần gọi đó.",
      },
    },
    {
      quiz: {
        title: "Tham số",
        questions: [
          {
            q: 'Với `def chao(name):`, lời gọi nào truyền chuỗi `"Pip"` vào tham số `name`?',
            a: ['`chao("Pip")`', "`def chao(Pip):`", "`chao()`"],
            correct: 0,
          },
          {
            q: "Vì sao tham số hữu ích?",
            a: ["Vì cùng một hàm có thể chạy với dữ liệu khác nhau", "Vì nó làm Python bỏ qua lỗi", "Vì nó thay thế toàn bộ biến trong chương trình"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Hàm cũng giúp đóng gói một chuỗi thao tác đã học. Ví dụ: lần nào nhận chữ thô cũng phải `strip()` rồi `lower()` rồi `say(... )`, mình có thể gom các bước đó thành một hàm.",
    },
    {
      npc: "Node này chưa học `return`; hàm của mình sẽ làm việc bằng cách gọi `say(... )` bên trong.",
    },
    {
      code: `from old_computer import say

def say_clean(text):
    clean = text.strip().lower()
    say(clean)

say_clean("  CODE  ")
say_clean("  KOTOPIA  ")
`,
      label: "clean_function_demo.py",
      note: "RUN KIỂM CHỨNG\nHàm `say_clean` gọt khoảng trắng, đổi chữ thường, rồi in kết quả. Hai lần gọi dùng hai chuỗi khác nhau.",
      expectOut: { all: [{ minLines: 2 }, /^code$/, /^kotopia$/] },
      solution: `from old_computer import say

def say_clean(text):
    clean = text.strip().lower()
    say(clean)

say_clean("  CODE  ")
say_clean("  KOTOPIA  ")
`,
    },
    {
      code: `from old_computer import say

def say_clean(text)
    clean = text.strip().lower()
    say(clean)

say_clean("  DUST  ")
`,
      label: "colon_fix.py",
      note: "ĐỀ BÀI\nDòng `def` đang thiếu dấu `:` nên Python không biết thân hàm bắt đầu ở đâu. Thêm `:` để output là dust.",
      expectOut: /^dust$/,
      solution: `from old_computer import say

def say_clean(text):
    clean = text.strip().lower()
    say(clean)

say_clean("  DUST  ")
`,
    },
    {
      checkpoint: {
        text: "Hàm có thể đóng gói nhiều bước: nhận dữ liệu qua tham số, xử lý bằng các dòng thụt vào bên trong, rồi làm một việc cụ thể như `say(clean)`. Dòng `def ...:` cần dấu hai chấm, và thân hàm cần thụt vào.",
      },
    },
    {
      quiz: {
        title: "Đóng gói thao tác",
        questions: [
          {
            q: "Đọc đoạn code này:\n```python\ndef say_clean(text):\n    clean = text.strip().lower()\n    say(clean)\n\nsay_clean(\"  CODE  \")\n```\nOutput là gì?",
            a: ["code", "  CODE  ", "clean"],
            correct: 0,
          },
          {
            q: "Trong node này, hàm `say_clean` trả dữ liệu bằng `return` chưa?",
            a: ["Chưa; nó làm việc bằng cách gọi `say(clean)` bên trong", "Có; `say` chính là `return`", "Có; mọi hàm đều tự return ra màn hình"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Hàm không chỉ dành cho một người. Người khác có thể viết hàm, đóng gói trong một file, rồi bạn import để dùng. Dòng `from old_computer import say` nghĩa là lấy hàm `say` đã được đóng gói trong module `old_computer`.",
    },
    {
      npc: "Vì vậy sau này một `future_computer` cũng có thể cung cấp hàm `say` khác: cùng tên `say(\"xin chào\")`, nhưng bên trong có thể phát âm bằng text to speech thay vì chỉ hiện chữ.",
    },
    {
      npc: "Người dùng hàm không cần biết toàn bộ dây điện phía sau; họ chỉ cần biết cách gọi hàm đúng.",
    },
    {
      code: `from old_computer import say

def say_twice(text):
    say(text)
    say(text)

say_twice("OLD COMPUTER")
`,
      label: "imported_function_demo.py",
      note: "RUN KIỂM CHỨNG\nỞ đây `say` là hàm được import từ `old_computer`. Bạn tự viết thêm hàm `say_twice` để dùng lại `say` hai lần.",
      expectOut: { all: [{ minLines: 2 }, /^OLD COMPUTER$/, /^OLD COMPUTER$/] },
      solution: `from old_computer import say

def say_twice(text):
    say(text)
    say(text)

say_twice("OLD COMPUTER")
`,
    },
    {
      code: `from old_computer import say

def badge(name, power):
    say("[" + name + "]")
    say("power=" + str(power))

badge("Pip", 7)
badge("Bo", 3)
`,
      label: "badge_function.py",
      note: "THỬ THÁCH NHỎ\nBấm RUN để xem một hàm có hai tham số. `name` nhận chữ, `power` nhận số, rồi `str(power)` đổi số thành chữ để ghép vào câu.",
      expectOut: { all: [{ minLines: 4 }, /^\[Pip\]$/, /^power=7$/, /^\[Bo\]$/, /^power=3$/] },
      solution: `from old_computer import say

def badge(name, power):
    say("[" + name + "]")
    say("power=" + str(power))

badge("Pip", 7)
badge("Bo", 3)
`,
    },
    {
      gift: {
        glyph: "fn",
        name: "HUY HIỆU HÀM",
        blurb: "gom việc lặp lại bằng `def`, gọi hàm bằng `ten_ham()`, truyền dữ liệu qua tham số, và dùng hàm người khác đóng gói qua import",
        badge: true,
        badgeId: "huy_hieu_ham",
      },
    },
    {
      npc: "Trước khi niêm phong MÁY ĐÚC HÀM, ghé LÒ RÈN một nhịp. Lò chỉ hỏi những thứ cốt lõi: vì sao cần hàm, cách định nghĩa, cách gọi, tham số, và ý nghĩa của import.",
    },
    {
      forge: {
        quiz: [
          {
            q: "Vì sao mình dùng hàm thay vì copy-paste cùng một khối code nhiều lần?",
            a: ["Để đặt tên cho khối việc, gọi lại nhiều lần, và sửa một chỗ khi cần đổi", "Để Python tự viết code còn thiếu", "Để mọi biến biến mất sau khi chạy"],
            correct: 0,
          },
          {
            q: "Dòng nào định nghĩa một hàm không có tham số?",
            a: ["`def chao():`", "`chao(): def`", "`say def chao()`"],
            correct: 0,
          },
          {
            q: "Dòng nào gọi hàm `chao`?",
            a: ["`chao()`", "`def chao():`", "`call def chao`"],
            correct: 0,
          },
          {
            q: 'Với `def chao(name):`, lời gọi `chao("Pip")` làm gì?',
            a: ['Cho tham số `name` giữ chuỗi `"Pip"` trong lần gọi đó', "Đổi tên hàm thành Pip", "Xóa tham số name"],
            correct: 0,
          },
          {
            q: "`from old_computer import say` nghĩa là gì?",
            a: ["Lấy hàm `say` đã được đóng gói trong module `old_computer` để dùng", "Tự tạo một biến tên old_computer", "Chỉ mở hình ảnh old computer"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "THE COPY-PASTE WRAITH chỉ mạnh khi bạn phải sửa cùng một lỗi ở mười nơi. Giờ bạn có `def`: gom việc lại một chỗ, đặt tên, gọi lại khi cần.",
    },
    {
      boss: { name: "THE COPY-PASTE WRAITH", art: "assets/mirror-wraith.webp", glyph: "fn", ko: true },
    },
    {
      npc: "Node hàm đầu tiên dừng ở đây: hàm để làm việc lặp lại, nhận dữ liệu qua tham số, và che phần phức tạp bên trong một cái tên dễ gọi.",
    },
    {
      npc: "Node sau mình mới mở tiếp phần hàm tính ra giá trị và đưa kết quả ra ngoài bằng `return`.",
    },
  ],
  ritual: {
    gesture: "☝",
    prompt: "GIƠ NGÓN TAY NIÊM PHONG FUNCTION PACKET",
    theme: {
      motion: "orbit",
      palette: { core: "#d9eee5", dust: "#78b2a5", rune: "#f4c85a" },
      glyphs: "def call parameter import function",
    },
  },
};
