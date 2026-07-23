// islandSTRINGLAB.js — PHONG THI NGHIEM CHUOI, a bonus side-island.
// Extra reps for node01/node01v2 strings, quotes, spaces, punctuation, and + order.
export default {
  index: -1,
  sideIslandId: "islandSTRINGLAB",
  title: "PHÒNG THÍ NGHIỆM CHUỖI",
  subtitle: "thử dấu nháy, dấu cách, thứ tự ghép chữ, và output nhiều dòng",
  bundle: { art: "assets/rookie-bundle.webp", name: "HỘP KÍNH THÍ NGHIỆM CHỮ" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI CHUỖI",
    blurb: "một bàn thí nghiệm nhỏ để nhìn từng mảnh chữ trước khi ghép",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ PHÒNG THÍ NGHIỆM CHUỖI ✦",
        hook: "Ở đây, một dấu cách cũng là vật liệu thí nghiệm. Pip đặt kính lúp xuống rồi đó; tụi mình soi xem chuỗi được ghép ra sao nhé.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chuỗi là phần chữ nằm trong dấu nháy. Chữ, số, dấu cách, dấu chấm, dấu hỏi... nếu nằm trong dấu nháy thì máy in ra y như vậy.",
    },
    {
      code: 'from old_computer import say\n\nsay("abc 123 !?")\nsay("   ")\nsay("Kotopia")\n',
      label: "string_samples.py",
      note: "ĐỀ BÀI: Bạn bấm RUN và nhìn kỹ ba dòng output. Dòng thứ hai chỉ có dấu cách, nhưng nó vẫn là một chuỗi hợp lệ.",
      expectOut: { all: [/abc 123 !\?/i, /Kotopia/i], minLines: 3 },
      solution: 'from old_computer import say\n\nsay("abc 123 !?")\nsay("   ")\nsay("Kotopia")\n',
    },
    {
      quiz: {
        title: "Chuỗi có gì bên trong",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nsay("2026")\n```\nMáy in ra gì?',
            a: ['Máy in đúng chữ `2026`, vì nó nằm trong dấu nháy', 'Máy báo lỗi vì số không được nằm trong chuỗi', 'Máy tự cộng các chữ số thành `10`'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\nleft = "Pip"\ngiua = " gặp "\nright = "bạn"\nsay(left + giua + right)\n',
      label: "string_order.py",
      note: "ĐỀ BÀI: Đoán output trước khi RUN. Máy ghép các mảnh theo đúng thứ tự từ trái sang phải trong dòng `say(...)`.",
      expectOut: /Pip gặp bạn/i,
      solution: 'from old_computer import say\n\nleft = "Pip"\ngiua = " gặp "\nright = "bạn"\nsay(left + giua + right)\n',
    },
    {
      quiz: {
        title: "Thứ tự ghép",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\na = "bụi"\nb = "phép"\nsay(a + " " + b)\n```\nDòng `say(...)` in ra gì?',
            a: ['`bụi phép`', '`phépbụi`', '`a b`'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\nsay("Cửa phòng thí nghiệm mở rồi)\n',
      label: "string_fix_quote.py",
      note: "ĐỀ BÀI: Dòng này thiếu dấu nháy đóng chuỗi, nên máy báo lỗi. Thêm dấu nháy còn thiếu ở cuối phần chữ, rồi RUN lại.",
      expectOut: /Cửa phòng thí nghiệm mở rồi/i,
      solution: 'from old_computer import say\n\nsay("Cửa phòng thí nghiệm mở rồi")\n',
    },
    {
      code: 'from old_computer import say\n\nname = "Mira"\nsay("Nhà thí nghiệm của " name)   # thiếu dấu + để nối chuỗi với biến\n',
      label: "string_fix_join.py",
      note: "ĐỀ BÀI: Chuỗi `" + '"Nhà thí nghiệm của "' + "` và biến `name` đang đứng sát nhau. Thêm dấu `+` ở giữa để nối chúng lại.",
      expectOut: /Nhà thí nghiệm của Mira/i,
      solution: 'from old_computer import say\n\nname = "Mira"\nsay("Nhà thí nghiệm của " + name)\n',
    },
    {
      checkpoint: {
        text: 'Dấu nháy mở và đóng chuỗi phải đi thành cặp. Khi ghép chuỗi với biến hoặc chuỗi khác, dấu `+` nối từng mảnh theo đúng thứ tự mình viết.',
      },
    },
    {
      quiz: {
        title: "Dấu nháy và dấu cộng",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nname = "Mira"\nsay("Nhà thí nghiệm của " name)\n```\nMuốn output là `Nhà thí nghiệm của Mira`, cần sửa dòng cuối thế nào?',
            a: ['`say("Nhà thí nghiệm của " + name)`', '`say("Nhà thí nghiệm của name")`', '`say(name + Nhà thí nghiệm của)`'],
            correct: 0,
          },
          {
            q: 'Đọc dòng này:\n```python\nsay("Cửa mở rồi)\n```\nVì sao máy báo lỗi?',
            a: ['Chuỗi thiếu dấu nháy đóng ở cuối phần chữ', 'Dòng này thiếu biến tên `Cửa`', 'Chuỗi không được có dấu cách'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\n# Phần của bạn: đổi chữ trong ba dòng say(...) để làm bảng hiệu riêng.\nsay("========")\nsay("PHÒNG CHUỖI")\nsay("========")\n',
      label: "string_sign.py",
      note: "ĐỀ BÀI: Tạo một bảng hiệu bằng ít nhất ba dòng `say(...)`. Bạn có thể đổi chữ ở dòng giữa, nhưng vẫn giữ ba dòng output.",
      expectOut: { minLines: 3 },
      solution: 'from old_computer import say\n\nsay("========")\nsay("BÀN THÍ NGHIỆM CỦA PIP")\nsay("========")\n',
    },
    {
      code: 'from old_computer import read, say\n\nmau = read("Màu bụi phép? ")\nshape = read("Hình trang trí? ")\nsay("Mẫu thử: " + mau + " " + shape)\n',
      label: "string_lab_card.py",
      note: "ĐỀ BÀI: Bài này ghép hai INPUT và một dấu cách nằm trong chuỗi `" + '" "' + "`. Bạn RUN thử, gõ hai mảnh chữ, rồi nhìn xem output có đủ khoảng cách không.",
      expectOut: /Mẫu thử:/i,
      solution: 'from old_computer import read, say\n\nmau = read("Màu bụi phép? ")\nshape = read("Hình trang trí? ")\nsay("Mẫu thử: " + mau + " " + shape)\n',
    },
    {
      checkpoint: {
        text: 'Dấu cách cũng là ký tự trong chuỗi. Nếu muốn hai biến cách nhau khi ghép, mình phải đặt một chuỗi dấu cách như `" "` ở giữa.',
      },
    },
    {
      quiz: {
        title: "Dấu cách trong chuỗi",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nmau = "xanh"\nshape = "star"\nsay(mau + " " + shape)\n```\nOutput nào đúng?',
            a: ['`xanh star`', '`xanhsao`', '`mau shape`'],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Phòng thí nghiệm chuỗi chỉ nhắc một điều: máy không tự thêm dấu cách, dấu nháy, hay dấu `+` cho mình. Muốn output có gì, mình viết rõ thứ đó trong Mật Ngữ.",
    },
  ],
};
