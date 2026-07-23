// islandVARHOSP.js — BENH VIEN TEN BIEN, a bonus side-island (island.js, not node.js):
// extra reps for node01/node01v2 variable names, spelling, and reading error messages.
// No new syntax; this island is pure debugging practice after read()/say()/variables.
export default {
  index: -1,
  sideIslandId: "islandVARHOSP",
  title: "BỆNH VIỆN TÊN BIẾN",
  subtitle: "chữa các vết nứt do gõ sai tên biến, thiếu dấu +, hoặc dùng nhầm biến",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ BÁC SĨ BIẾN" },
  machine: {
    art: "assets/old-computer.webp",
    name: "BÀN KHÁM TÊN BIẾN",
    blurb: "một góc luyện đọc thông báo lỗi và chữa tên biến cho khớp",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ BỆNH VIỆN TÊN BIẾN ✦",
        hook: "Ở Kotopia, nhiều thần chú không hỏng vì khó đâu. Chúng chỉ bị đau do tên biến viết lệch một chữ. Ghé bệnh viện này để tập nhìn đúng chỗ nứt nhé.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn, Pip mở bàn khám rồi đây. Hôm nay tụi mình không học từ mới; chỉ chữa những đoạn code dùng lại biến sai tên, sai dấu, hoặc gọi nhầm một biến chưa từng được tạo.",
    },
    {
      code: 'from old_computer import say\n\nfood = "bánh mì"\nsay("Phiếu khám: " + food)\n',
      label: "var_check_ok.py",
      note: "ĐỀ BÀI: Đây là một đoạn code lành lặn. Giá trị `food = \"bánh mì\"` được gán sẵn trong code, không phải INPUT. Bạn đọc trước xem biến `food` được tạo ở đâu, rồi bấm RUN để kiểm tra output.",
      expectOut: /Phiếu khám: bánh mì/i,
      solution: 'from old_computer import say\n\nfood = "bánh mì"\nsay("Phiếu khám: " + food)\n',
    },
    {
      quiz: {
        title: "Tên biến phải khớp",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nfood = "bánh mì"\nsay("Phiếu khám: " + food)\n```\nVì star dòng `say(...)` dùng được biến `food`?',
            a: ["Vì `food` đã được tạo đúng tên ở dòng trên", "Vì máy tự đoán `food` nghĩa là món ăn", "Vì mọi chữ trong dấu nháy đều thành biến"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\nfruit = "xoài"\nsay("Bệnh nhân thích " + frut)   # sai một chữ trong tên biến\n',
      label: "var_fix_spelling.py",
      note: "ĐỀ BÀI: Đoạn code này bị nứt vì `frut` chưa từng được tạo. Giá trị cho sẵn đúng là `fruit = \"xoài\"`. Sửa tên biến ở dòng `say(...)` cho khớp với `fruit`, rồi bấm RUN.",
      expectOut: /Bệnh nhân thích xoài/i,
      solution: 'from old_computer import say\n\nfruit = "xoài"\nsay("Bệnh nhân thích " + fruit)\n',
    },
    {
      code: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " name "!")   # thiếu dấu + giữa các mảnh chuỗi\n',
      label: "var_fix_plus.py",
      note: "ĐỀ BÀI: Thông báo lỗi sẽ chỉ vào dòng `say(...)`, vì các mảnh chuỗi chưa được nối bằng dấu `+`. Thêm đúng hai dấu `+` còn thiếu, rồi bấm RUN.",
      expectOut: /Xin chào/i,
      solution: 'from old_computer import read, say\n\nname = read("Tên bạn? ")\nsay("Xin chào, " + name + "!")\n',
    },
    {
      checkpoint: {
        text: 'Tên biến phải được viết giống y nguyên ở nơi tạo và nơi dùng: `fruit` khác `frut`. Khi ghép chuỗi, mỗi mảnh đứng cạnh nhau phải được nối bằng dấu `+`.',
      },
    },
    {
      quiz: {
        title: "Soi vết nứt",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\npet = "mèo"\nsay("Bạn chọn " + pett)\n```\nDòng nào làm máy báo lỗi?',
            a: ["Dòng `say(...)`, vì dùng `pett` nhưng chỉ có biến `pet` được tạo", "Dòng `pet = \"mèo\"`, vì biến không được chứa chữ có dấu", "Không dòng nào, máy tự sửa `pett` thành `pet`"],
            correct: 0,
          },
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nname = "An"\nsay("Chào, " name "!")\n```\nMuốn nối ba mảnh `"Chào, "`, `name`, và `"!"`, cần sửa thế nào?',
            a: ['Viết `say("Chào, " + name + "!")`', 'Viết `say("Chào, name!")`', 'Viết `say(name "Chào, " "!")`'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say\n\n# Phần của bạn: tạo biến color chứa một màu bạn thích.\n# Sau đó dùng đúng tên biến color trong cả hai dòng say(...).\ncolor = "..."\nsay("Màu khám bệnh: " + color)\nsay("Màu băng cứu thương: " + color)\n',
      label: "var_write_twice.py",
      note: "ĐỀ BÀI: Tạo biến `color`, rồi dùng lại đúng tên `color` trong hai dòng `say(...)`. Nếu đổi tên biến ở một chỗ, nhớ đổi cho khớp ở mọi chỗ dùng.",
      expectOut: { minLines: 2 },
      solution: 'from old_computer import say\n\ncolor = "xanh lá"\nsay("Màu khám bệnh: " + color)\nsay("Màu băng cứu thương: " + color)\n',
    },
    {
      code: 'from old_computer import read, say\n\nperson = read("Tên người nhận? ")\ngift = read("Món quà? ")\nsay(person + " nhận được " + gfit)   # sai tên biến ở mảnh cuối\n',
      label: "var_fix_input_name.py",
      note: "ĐỀ BÀI: Hai INPUT thật là hai dòng `read(...)`; máy cất chúng vào `person` và `gift`. Dòng output đang gọi nhầm `gfit`; bạn sửa lại đúng tên biến `gift` rồi RUN.",
      expectOut: /nhận được/i,
      solution: 'from old_computer import read, say\n\nperson = read("Tên người nhận? ")\ngift = read("Món quà? ")\nsay(person + " nhận được " + gift)\n',
    },
    {
      checkpoint: {
        text: 'Khi một biến lấy dữ liệu từ `read(...)`, tên biến vẫn phải khớp y nguyên lúc dùng lại. Thông báo lỗi kiểu `name ... is not defined` thường nghĩa là mình đang gọi một tên biến chưa từng được tạo.',
      },
    },
    {
      quiz: {
        title: "Biến chưa được tạo",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nperson = read("Tên người nhận? ")\ngift = read("Món quà? ")\nsay(person + " nhận được " + gfit)\n```\nThông báo lỗi kiểu `name \'gfit\' is not defined` đang chỉ về vết nứt nào?',
            a: ["Dòng cuối gọi `gfit`, nhưng biến đúng tên là `gift`", "Dòng `read(...)` không được dùng với tiếng Việt", "Dòng cuối có quá nhiều dấu `+`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Bệnh viện này chỉ có một mẹo chính: đặt tên biến rõ ràng, rồi dùng lại đúng từng chữ. Nếu máy báo lỗi tên chưa được tạo, Pip sẽ nhìn ngay vào tên biến trước.",
    },
  ],
};
