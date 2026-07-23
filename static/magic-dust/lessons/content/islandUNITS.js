// islandUNITS.js - bonus side-island after node02 for unit-conversion
// arithmetic. Uses only read_num(), say_num(), variables, and + - * /.
export default {
  index: -1,
  sideIslandId: "islandUNITS",
  title: "ĐẢO ĐỔI ĐƠN VỊ",
  subtitle: "đổi phút, giây, mét, xăng-ti-mét bằng phép tính quen thuộc",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI THƯỚC ĐO KOTOPIA" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY ĐỔI ĐƠN VỊ",
    blurb: "một máy phụ để luyện chọn phép tính đúng trước khi in kết quả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO ĐỔI ĐƠN VỊ ✦",
        hook: "Đảo này dành cho các phép tính rất hay gặp: đổi phút ra giây, xăng-ti-mét ra mi-li-mét, mét ra xăng-ti-mét, rồi ghép giờ và phút thành tổng số phút.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Ở đây Pip không thêm cú pháp mới. Mình chỉ đọc đề thật chậm: đơn vị nào đang có, đơn vị nào cần in ra, và phải nhân hay chia với con số nào.",
    },
    {
      quiz: {
        title: "Phút đổi ra giây",
        questions: [
          {
            q: "Một phút có 60 giây. Nếu `minutes = 3`, biểu thức nào đổi phút ra giây đúng?",
            a: ["`minutes * 60`", "`minutes + 60`", "`minutes / 60`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

minutes = 3
seconds = minutes * 60
say_num(seconds)
`,
      label: "minutes_to_seconds_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `minutes = 3`. Không có INPUT từ ngoài chương trình.\nPROCESS: mỗi phút có 60 giây, nên máy tính `minutes * 60`.\nOUTPUT đúng là 180.",
      expectOut: /^180$/,
      solution: `from old_computer import say_num

minutes = 3
seconds = minutes * 60
say_num(seconds)
`,
    },
    {
      code: `from old_computer import say_num

cm = 7
mm = cm + 10      # Đến lượt của bạn: 1 cm = 10 mm, cần nhân chứ không cộng.
say_num(mm)
`,
      label: "cm_to_mm_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `cm = 7`. Không có INPUT từ ngoài chương trình.\nPROCESS đúng: đổi xăng-ti-mét ra mi-li-mét bằng `cm * 10`.\nOUTPUT đúng là 70.",
      expectOut: /^70$/,
      solution: `from old_computer import say_num

cm = 7
mm = cm * 10
say_num(mm)
`,
    },
    {
      checkpoint: {
        text: "Đổi từ đơn vị lớn sang đơn vị nhỏ thường dùng phép nhân: phút ra giây dùng `minutes * 60`; xăng-ti-mét ra mi-li-mét dùng `cm * 10`.",
      },
    },
    {
      quiz: {
        title: "Nhân theo hệ số đổi",
        questions: [
          {
            q: "`cm = 12`. Muốn đổi xăng-ti-mét ra mi-li-mét, dòng nào đúng?",
            a: ["`say_num(cm * 10)`", "`say_num(cm + 10)`", "`say_num(cm / 10)`"],
            correct: 0,
          },
          {
            q: "`minutes = 5`. `say_num(minutes * 60)` in số nào?",
            a: ["300", "65", "55"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đổi ngược lại thì thường chia. Nếu có 250 xăng-ti-mét, muốn biết bằng bao nhiêu mét, mình chia cho 100.",
    },
    {
      code: `from old_computer import say_num

cm = 250
meters = cm / 100
say_num(meters)
`,
      label: "cm_to_meters_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `cm = 250`.\nPROCESS: 1 mét có 100 xăng-ti-mét, nên đổi ngược lại bằng `cm / 100`.\nOUTPUT đúng là 2.5.",
      expectOut: /^2\.5$/,
      solution: `from old_computer import say_num

cm = 250
meters = cm / 100
say_num(meters)
`,
    },
    {
      code: `from old_computer import read_num, say_num

hours = read_num("Số giờ: ")
minutes = read_num("Số phút lẻ: ")

# Đến lượt của bạn: đổi giờ ra phút rồi cộng phút lẻ.
total_minutes = hours + minutes
say_num(total_minutes)
`,
      label: "hours_minutes_fix.py",
      note: "ĐỀ BÀI\nINPUT thật: `read_num(...)` đọc số giờ vào `hours` và số phút lẻ vào `minutes`.\nPROCESS đúng: đổi giờ ra phút bằng `hours * 60`, rồi cộng `minutes`.\nVới input mẫu 2 và 15, OUTPUT đúng là 135.",
      sampleInput: ["2", "15"],
      expectOut: /^135$/,
      solution: `from old_computer import read_num, say_num

hours = read_num("Số giờ: ")
minutes = read_num("Số phút lẻ: ")

total_minutes = hours * 60 + minutes
say_num(total_minutes)
`,
    },
    {
      checkpoint: {
        text: "Khi một bài có hai đơn vị, đổi về cùng một đơn vị trước rồi mới cộng. Ví dụ: `hours * 60 + minutes` đổi giờ và phút thành tổng số phút.",
      },
    },
    {
      quiz: {
        title: "Cùng một đơn vị trước khi cộng",
        questions: [
          {
            q: "Bạn có 1 giờ 30 phút. Muốn đổi thành tổng số phút, biểu thức nào đúng?",
            a: ["`1 * 60 + 30`", "`1 + 60 + 30`", "`1 * 30 + 60`"],
            correct: 0,
          },
          {
            q: "Input là 3 phút 20 giây. Muốn đổi thành tổng số giây, biểu thức nào đúng?",
            a: ["`3 * 60 + 20`", "`3 + 60 + 20`", "`3 * 20`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import read_num, say_num

minutes = read_num("Số phút: ")
seconds = read_num("Số giây lẻ: ")

# Đến lượt của bạn: in tổng số giây.
say_num(minutes + seconds)
`,
      label: "total_seconds_write.py",
      note: "ĐỀ BÀI\nINPUT thật: máy đọc `minutes` và `seconds` từ người dùng.\nPROCESS cần dùng: đổi phút ra giây bằng `minutes * 60`, rồi cộng số giây lẻ.\nVới input mẫu 3 và 20, OUTPUT đúng là 200.",
      sampleInput: ["3", "20"],
      expectOut: /^200$/,
      solution: `from old_computer import read_num, say_num

minutes = read_num("Số phút: ")
seconds = read_num("Số giây lẻ: ")

say_num(minutes * 60 + seconds)
`,
    },
    {
      remember:
        "Đổi đơn vị luôn bắt đầu bằng câu hỏi rất cụ thể: đang có đơn vị gì, cần in đơn vị gì, và hệ số đổi là bao nhiêu. Từ đó mới chọn `*`, `/`, rồi cộng phần lẻ nếu đề có hai đơn vị.",
    },
  ],
};
