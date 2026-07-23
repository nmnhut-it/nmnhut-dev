// islandEFFECTSTAGE.js — RAP NOI HIEU UNG, a bonus side-island.
// Extra reps for node03/node03v2 camera I/O: watch(), display(), fire_vortex().
// No if/elif/else here; those open later on the main trail.
export default {
  index: -1,
  sideIslandId: "islandEFFECTSTAGE",
  title: "RẠP NỐI HIỆU ỨNG",
  subtitle: "xếp nhiều output camera chạy theo thứ tự: display(), fire_vortex(), display()",
  bundle: { art: "assets/rookie-bundle.webp", name: "HỘP ĐÈN SÂN KHẤU CAMERA" },
  machine: {
    art: "assets/future-machine.webp",
    name: "RẠP HIỆU ỨNG NHỎ",
    blurb: "một sân khấu phụ để nối các output camera đã học",
  },
  modules: {
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ RẠP NỐI HIỆU ỨNG ✦",
        hook: "Sân khấu này không dạy luật mới. Nó chỉ hỏi một chuyện: nếu nhiều lệnh output đứng nối nhau, máy chạy theo thứ tự nào?",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Chào mừng tới rạp nhỏ của Pip. Bạn đã có `display()` để hiện chữ trên camera và `fire_vortex()` để phóng lửa. Bây giờ tụi mình xếp chúng thành một màn diễn có mở màn, cao trào, rồi kết thúc.",
    },
    {
      code: 'from camera_charm import display, fire_vortex, delay\n\ndisplay("MỞ MÀN")\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("HẾT MÀN")\ndelay(0.8)\n',
      label: "stage_three_beats.py",
      note: "RUN KIỂM CHỨNG: Máy hiện `MỞ MÀN`, giữ chữ 0,8 giây, phóng lửa, chờ 1,2 giây rồi mới hiện `HẾT MÀN`. Các khoảng chờ giúp bạn nhìn rõ ba nhịp thay vì chỉ thấy dòng cuối.",
      expectOut: { all: [/MỞ MÀN/i, /fire/i, /HẾT MÀN/i] },
      solution: 'from camera_charm import display, fire_vortex, delay\n\ndisplay("MỞ MÀN")\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("HẾT MÀN")\ndelay(0.8)\n',
    },
    {
      quiz: {
        title: "Máy chạy từ trên xuống",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\ndisplay("A")\nfire_vortex()\ndisplay("B")\n```\nThứ tự output đúng là gì?',
            a: ['Hiện `A`, phóng lửa, rồi hiện `B`', 'Phóng lửa trước, rồi hiện `A` và `B` cùng lúc', 'Hiện `B` trước vì đó là dòng cuối'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import watch, display, fire_vortex, delay\n\nfinger = watch()\ndisplay("Số ngón tay: " + str(finger))\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("XONG")\ndelay(0.8)\n',
      label: "stage_watch_then_show.py",
      note: "RUN KIỂM CHỨNG: INPUT thật là số ngón tay do `watch()` đọc. OUTPUT lần lượt là nhãn ghi rõ số ngón tay, hiệu ứng lửa và chữ `XONG`; mỗi phần được giữ đủ lâu để bạn nhìn thấy thứ tự.",
      expectOut: { all: [/fire/i, /XONG/i] },
      solution: 'from camera_charm import watch, display, fire_vortex, delay\n\nfinger = watch()\ndisplay("Số ngón tay: " + str(finger))\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("XONG")\ndelay(0.8)\n',
    },
    {
      quiz: {
        title: "Input không phải output",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nfinger = watch()\ndisplay(finger)\nfire_vortex()\n```\nDòng nào là INPUT camera?',
            a: ['`finger = watch()`', '`display(finger)`', '`fire_vortex()`'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import display, fire_vortex, delay\n\ndisplay("Lửa chuẩn bị tới")\ndelay(0.8)\nfire_vortex       # thiếu dấu () nên lệnh chưa được gọi\ndelay(1.2)\ndisplay("Màn diễn xong")\ndelay(0.8)\n',
      label: "stage_fix_call.py",
      note: "ĐỀ BÀI: Dòng `fire_vortex` đang thiếu dấu ngoặc `()`, nên lửa không chạy. Sửa thành `fire_vortex()` rồi RUN lại.",
      expectOut: { all: [/Lửa chuẩn bị tới/i, /fire/i, /Màn diễn xong/i] },
      solution: 'from camera_charm import display, fire_vortex, delay\n\ndisplay("Lửa chuẩn bị tới")\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("Màn diễn xong")\ndelay(0.8)\n',
    },
    {
      checkpoint: {
        text: 'Một lệnh camera chỉ chạy khi mình gọi đủ tên và dấu ngoặc, như `fire_vortex()`. Máy đọc các dòng từ trên xuống, nên thứ tự dòng quyết định thứ tự hiệu ứng.',
      },
    },
    {
      quiz: {
        title: "Gọi đủ lệnh",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\ndisplay("Bắt đầu")\nfire_vortex\ndisplay("Kết thúc")\n```\nVì sao lửa không chạy?',
            a: ['Dòng `fire_vortex` thiếu dấu ngoặc `()` nên lệnh chưa được gọi', '`display("Bắt đầu")` chặn lửa lại', 'Máy chỉ chạy dòng cuối cùng'],
            correct: 0,
          },
          {
            q: 'Muốn máy phóng lửa giữa hai dòng chữ, đoạn nào đúng?',
            a: ['`display("A")` rồi `fire_vortex()` rồi `display("B")`', '`display("A")` rồi `fire_vortex` rồi `display("B")`', '`fire_vortex("A", "B")`'],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from camera_charm import display, fire_vortex, delay\n\n# Thêm phần hạ màn sau khi lửa đã hiện đủ lâu\ndisplay("MỞ MÀN")\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\n',
      label: "stage_write_ending.py",
      note: "ĐỀ BÀI: Mở màn và hiệu ứng lửa đã cho sẵn; bài này không có INPUT. Sau `delay(1.2)`, thêm `display(\"HẠ MÀN\")` rồi giữ chữ bằng `delay(0.8)`. OUTPUT phải cho thấy rõ ba nhịp: mở màn, lửa, hạ màn.",
      expectOut: { all: [/MỞ MÀN/i, /fire/i, /HẠ MÀN/i] },
      solution: 'from camera_charm import display, fire_vortex, delay\n\ndisplay("MỞ MÀN")\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("HẠ MÀN")\ndelay(0.8)\n',
    },
    {
      code: 'from camera_charm import watch, display, fire_vortex, delay\n\nfinger = watch()\ndisplay("Số ngón tay: " + str(finger))\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("CẢM ƠN KHÁN GIẢ")\ndelay(0.8)\n',
      label: "stage_full_show.py",
      note: "RUN DỰ ÁN: INPUT thật là một lần đọc tay bằng `watch()`. OUTPUT lần lượt hiện nhãn kèm số ngón tay, giữ 0,8 giây, phóng lửa, rồi mới chào khán giả. Không có `if`; thứ tự dòng và `delay` quyết định nhịp màn diễn.",
      expectOut: { all: [/Số ngón tay:/i, /fire/i, /CẢM ƠN KHÁN GIẢ/i] },
      solution: 'from camera_charm import watch, display, fire_vortex, delay\n\nfinger = watch()\ndisplay("Số ngón tay: " + str(finger))\ndelay(0.8)\nfire_vortex()\ndelay(1.2)\ndisplay("CẢM ƠN KHÁN GIẢ")\ndelay(0.8)\n',
    },
    {
      checkpoint: {
        text: '`watch()` là INPUT vì nó đọc tay và trả về một số. `display(...)` và `fire_vortex()` là OUTPUT vì chúng làm chữ hoặc hiệu ứng hiện ra trên camera.',
      },
    },
    {
      quiz: {
        title: "Một input, nhiều output nối tiếp",
        questions: [
          {
            q: 'Đọc đoạn Mật Ngữ này:\n```python\nfinger = watch()\ndisplay("Số ngón tay:")\ndisplay(finger)\nfire_vortex()\n```\nĐoạn này có bao nhiêu lần đọc INPUT bằng camera?',
            a: ['Một lần, ở dòng `finger = watch()`', 'Hai lần, vì có hai dòng `display(...)`', 'Không lần nào, vì chỉ có output'],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Rạp Nối Hiệu Ứng cho bạn một luật rất đơn giản: viết output theo thứ tự nào, máy chạy theo thứ tự đó. Khi cần chọn output theo điều kiện, tụi mình sẽ dùng `if` ở bài chính sau.",
    },
  ],
};
