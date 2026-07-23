// islandWHILE.js — ĐẢO VÒNG LẶP, a bonus side-island (island.js, not node.js):
// extra reps for node07's vocabulary (`while`, loop condition, updating the
// condition variable, and watch()-driven accumulation). review-nodes.txt
// flagged that node07 introduces the while loop but needs more follow-up
// reps: predict the iteration count, fix the infinite-loop bug, fix the
// boundary condition bug, then write the camera charge loop again. Per
// PEDAGOGY-METHOD.md this reuses ONLY already-taught vocabulary (no new
// concept — pure retrieval + practice). Gated unlockAt:8 (after node07 —
// while loop — is done).
export default {
  index: -1,
  sideIslandId: "islandWHILE",
  title: "ĐẢO VÒNG LẶP",
  subtitle: "luyện thêm while — đoán số vòng, sửa vòng vô tận, gom sức mạnh bằng watch()",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ LUẬT DỪNG" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY LUYỆN VÒNG LẶP",
    blurb: "một cỗ máy phụ để luyện while và luật dừng — không có quái lỗi nào ở đây cả",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO VÒNG LẶP ✦",
        hook: "Một hòn đảo nhỏ lơ lửng ngoài đường chính — không có quái lỗi, không bắt buộc phải ghé. Ai muốn luyện tay cho chắc while, biết vòng chạy mấy lần và dừng ở đâu, thì cứ ghé qua!",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Chào bạn ghé Đảo Vòng Lặp! Ở đây Pip không dạy từ mới đâu. Tụi mình chỉ luyện đúng một việc: đọc `while`, đoán trước vòng lặp chạy mấy lần, rồi mới bấm RUN để kiểm tra.",
    },

    // ── bài 1: đoán số vòng trước khi RUN ──
    {
      quiz: {
        title: "Đếm vòng trước khi RUN — while_count4.py",
        questions: [
          {
            q: 'Đọc đoạn code này trước khi RUN:\n```python\nx = 0\nwhile x < 4:\n    x = x + 1\n    say_num(x)\nsay("XONG")\n```\nMáy sẽ in những số nào?',
            a: ["1, 2, 3, 4, rồi XONG", "0, 1, 2, 3, rồi XONG", "1, 2, 3, 4, 5, rồi XONG"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say, say_num\n\nx = 0\nwhile x < 4:\n    x = x + 1\n    say_num(x)\n\nsay("XONG")\n',
      label: "while_count4.py",
      note: "RUN KIỂM CHỨNG\nBấm ▶ RUN xem vòng lặp có in đúng 1, 2, 3, 4 rồi mới hô XONG như bạn vừa đoán không.",
      expectOut: { all: [/^1$/, /^2$/, /^3$/, /^4$/, /xong/i] },
      solution: 'from old_computer import say, say_num\n\nx = 0\nwhile x < 4:\n    x = x + 1\n    say_num(x)\n\nsay("XONG")\n',
    },
    {
      code: 'from old_computer import say, say_num\n\n# lượt của bạn — viết vòng lặp đếm 1, 2, 3 rồi hô XONG\ncount = 1\n',
      label: "while_write_count.py",
      note: "ĐỀ BÀI (tự viết)\nGiá trị cho sẵn: `count = 1`. Không có INPUT từ ngoài chương trình.\nViết một vòng `while` để máy in lần lượt 1, 2, 3. Sau khi vòng lặp dừng, in thêm `XONG`.",
      expectOut: { all: [/^1$/, /^2$/, /^3$/, /xong/i] },
      solution: 'from old_computer import say, say_num\n\ncount = 1\nwhile count <= 3:\n    say_num(count)\n    count = count + 1\n\nsay("XONG")\n',
    },
    {
      checkpoint: {
        text: "Muốn đoán số vòng của `while`, lần theo biến điều kiện sau MỖI vòng: điều kiện còn đúng thì lặp tiếp, vừa sai thì dừng và đi xuống dòng sau vòng lặp.",
      },
    },
    {
      quiz: {
        title: "Lần theo biến điều kiện",
        questions: [
          {
            q: "`x = 2`, `while x < 5:` với thân `x = x + 1` rồi `say_num(x)`. Máy in những số nào trước khi dừng?",
            a: ["3, 4, 5", "2, 3, 4", "3, 4, 5, 6"],
            correct: 0,
          },
        ],
      },
    },

    // ── bài 2: quên cập nhật biến điều kiện → vòng lặp vô tận ──
    {
      npc: "Giờ tới vết nứt nguy hiểm nhất: thân vòng lặp quên làm biến đổi dần. Nếu biến đứng yên, điều kiện cứ đúng hoài, và máy mắc trong vòng lặp vô tận.",
    },
    {
      quiz: {
        title: "Soi vòng vô tận — loop_no_update.py",
        questions: [
          {
            q: 'Đoạn code đang lỗi như sau:\n```python\nx = 0\nwhile x < 5:\n    say_num(x)\n```\nVì sao nó không tự dừng?',
            a: [
              "`x` không bao giờ đổi, nên `x < 5` cứ đúng mãi và máy cứ in 0 mãi",
              "Vì `say_num(x)` chỉ in được số chẵn",
              "Vì `while` chỉ dùng được với camera",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say, say_num\n\nx = 0\nwhile x < 5:\n    say_num(x)\n    # bản lỗi an toàn: x có đổi, nhưng nhảy thẳng từ 0 lên 5\n    x = x + 5\n\nsay("THOÁT")\n',
      label: "loop_fix_update.py",
      note: "ĐỀ BÀI (sửa lỗi)\nBản này đã được Pip chặn an toàn nên không mắc kẹt, nhưng nó nhảy từ 0 thẳng lên 5. Hãy sửa mức tăng trong thân vòng lặp để máy in 0, 1, 2, 3, 4 rồi hô THOÁT.",
      expectOut: { all: [/^0$/, /^1$/, /^2$/, /^3$/, /^4$/, /thoát/i] },
      solution: 'from old_computer import say, say_num\n\nx = 0\nwhile x < 5:\n    say_num(x)\n    x = x + 1\n\nsay("THOÁT")\n',
    },
    {
      checkpoint: {
        text: "Trong thân vòng lặp phải có dòng làm điều kiện đổi dần, ví dụ `x = x + 1`; nếu biến trong điều kiện không đổi, điều kiện có thể đúng mãi và tạo vòng lặp vô tận.",
      },
    },
    {
      quiz: {
        title: "Dòng nào chặn vòng vô tận",
        questions: [
          {
            q: "`x = 0`, `while x < 3:`. Dòng nào phải nằm TRONG thân vòng lặp để máy không in 0 mãi?",
            a: ['`say("XONG")`', "`x = x + 1`", "`while x < 3:` thêm lần nữa"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 3: lỗi ranh giới — dùng == khiến vòng không chạy ──
    {
      npc: "Một vết nứt khác nằm ngay ở luật dừng: dùng nhầm `==` thay vì dấu so sánh cho nhiều giá trị đi qua. Máy có thể dừng quá sớm, hoặc thậm chí không bước vào vòng lặp lần nào.",
    },
    {
      quiz: {
        title: "Dùng nhầm == — loop_boundary.py",
        questions: [
          {
            q: 'Luật muốn nhặt 3 viên đá, bắt đầu `stones = 0`. Nhưng đoạn code viết:\n```python\nwhile stones == 3:\n    stones = stones + 1\n    say_num(stones)\n```\nVòng lặp chạy mấy lần?',
            a: ["0 lần — vì ngay từ đầu 0 == 3 là sai", "3 lần", "Chạy mãi mãi"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: 'from old_computer import say, say_num\n\nstones = 0\n\n# LUẬT MUỐN: nhặt 3 viên đá, hô 1, 2, 3\nwhile stones == 3:\n    stones = stones + 1\n    say_num(stones)\n\nsay("ĐỦ ĐÁ")\n',
      label: "loop_fix_boundary.py",
      note: "ĐỀ BÀI (sửa lỗi)\nGiá trị cho sẵn: `stones = 0`. Không có INPUT từ ngoài chương trình.\nĐiều kiện hiện tại làm vòng lặp không chạy lần nào. Hãy sửa điều kiện để máy nhặt và hô đủ 1, 2, 3.",
      expectOut: { all: [/^1$/, /^2$/, /^3$/, /đủ đá/i] },
      solution: 'from old_computer import say, say_num\n\nstones = 0\n\nwhile stones < 3:\n    stones = stones + 1\n    say_num(stones)\n\nsay("ĐỦ ĐÁ")\n',
    },
    {
      checkpoint: {
        text: "`while stones == 3:` chỉ chạy khi `stones` ĐÚNG BẰNG 3 ngay lúc kiểm tra; nếu muốn đi từ 0 lên 3, điều kiện phải là `stones < 3` để mở đường cho 0, 1, 2.",
      },
    },
    {
      quiz: {
        title: "Chọn điều kiện cho đường đi",
        questions: [
          {
            q: "Bắt đầu `pin = 0`, muốn sạc tới khi pin chạm 5. Điều kiện nào đúng cho vòng lặp sạc?",
            a: ["`while pin == 5:`", "`while pin < 5:`", "`while pin > 5:`"],
            correct: 1,
          },
        ],
      },
    },

    // ── bài 4: camera-driven accumulate-with-watch() loop ──
    {
      npc: "Cuối đảo là bài gom sức mạnh bằng camera thật. Đây chính là mẫu `charge_loop.py` của node 7, nhưng lần này bạn tự viết lại để tay nhớ luôn: mỗi vòng hỏi `watch()`, cộng vào tổng, đọc tổng mới, tới đủ mốc thì mở cổng.",
    },
    {
      code: 'from camera_charm import watch, display, fire_vortex\nfrom old_computer import say_num\n\npower = 0\n# lượt của bạn: dùng while để gom sức mạnh từ watch()\n',
      label: "while_charge_watch.py",
      note: "ĐỀ BÀI (tự viết, camera thật)\nINPUT thật ở bài này là `watch()`: mỗi vòng đọc số ngón tay bạn đang giơ. Giá trị cho sẵn ban đầu là `power = 0`.\nHãy gom sức mạnh cho tới khi đạt mốc 10. Mỗi lần gom xong cần in tổng hiện tại. Khi đủ mốc, hiện `MỞ CỔNG` và gọi hiệu ứng mở cổng.",
      expectOut: /mở cổng/i,
      solution: 'from camera_charm import watch, display, fire_vortex\nfrom old_computer import say_num\n\npower = 0\nwhile power < 10:\n    power = power + watch()\n    say_num(power)\n\ndisplay("MỞ CỔNG")\nfire_vortex()\n',
    },
    {
      checkpoint: {
        text: "Mẫu gom dữ liệu bằng camera là `while power < target:` rồi trong thân vòng lặp cập nhật `power = power + watch()`. `watch()` là INPUT thật; `power` là tổng đang được cập nhật cho tới khi điều kiện `power < target` sai.",
      },
    },
    {
      quiz: {
        title: "Gom sức mạnh bằng watch()",
        questions: [
          {
            q: "`power = 0`, `while power < 10:`. Bạn giơ 4, rồi 4, rồi 4. Vòng lặp dừng sau lần nào?",
            a: ["Sau lần 1, vì 4 gần 10", "Sau lần 2, vì 8 gần 10 nên coi như đủ", "Sau lần 3, vì tổng thành 12 và 12 < 10 sai"],
            correct: 2,
          },
        ],
      },
    },

    {
      remember:
        "Luyện `while` là luyện ba câu hỏi: điều kiện đang đúng hay sai, thân vòng lặp có làm biến điều kiện đổi dần không, và dấu ranh giới (`<`, `<=`, `>`, `>=`, `==`) có mở đúng đường cho các giá trị cần đi qua không.",
    },
  ],
};
