// islandMARKET.js — CHO BUI PHEP, a bonus side-island.
// Extra reps for node02/node02v2 read_num(), say_num(), and + - * / in shop contexts.
export default {
  index: -1,
  sideIslandId: "islandMARKET",
  title: "CHỢ BỤI PHÉP",
  subtitle: "tính giá, số lượng, tiền thừa, và tổng nhiều món bằng read_num()/say_num()",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI TIỀN CHỢ BỤI" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY TÍNH QUẦY HÀNG",
    blurb: "một cỗ máy phụ để tính toán ở chợ Kotopia",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ CHỢ BỤI PHÉP ✦",
        hook: "Chợ Kotopia mở rồi. Người bán cân bụi phép, đếm lọ thủy tinh, tính tiền nhanh như gió. Pip giữ sổ, còn bạn viết Mật Ngữ cho quầy hàng nhé.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Ở chợ, mỗi phép tính đều có ý nghĩa rõ ràng: nhân giá với số lượng để ra tổng tiền, lấy tiền khách đưa trừ hóa đơn để ra tiền thừa, rồi cộng tiền các món để thành hóa đơn.",
    },
    {
      code: `from old_computer import say, say_num

price = 3000
quantity = 4
total = price * quantity
say("Tổng tiền:")
say_num(total)
`,
      label: "market_total_sample.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `price = 3000`, `quantity = 4`. Không có INPUT từ ngoài chương trình.\nKhái niệm: `tổng tiền` là giá một món nhân với số lượng. Ví dụ: một món giá 3000, mua 4 món thì tổng tiền là 12000.\nViệc cần làm: đọc code và đoán output trước khi RUN.\nOUTPUT: máy in nhãn `Tổng tiền:` rồi in 12000.",
      expectOut: { all: [/Tổng tiền:/i, /^\s*12000\s*$/m] },
      solution: `from old_computer import say, say_num

price = 3000
quantity = 4
total = price * quantity
say("Tổng tiền:")
say_num(total)
`,
    },
    {
      quiz: {
        title: "Giá nhân số lượng",
        questions: [
          {
            q: "Một món giá `5000`, mua `3` món. Đoạn Mật Ngữ nào tính đúng tổng tiền?",
            a: ["`say_num(5000 * 3)`", "`say_num(5000 + 3)`", "`say_num(5000 - 3)`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

price = 7000
quantity = 5
say_num(price + quantity)   # sai phép tính: tổng tiền phải là giá nhân số lượng
`,
      label: "market_fix_total.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `price = 7000`, `quantity = 5`. Không có INPUT từ ngoài chương trình.\nĐoạn code này chạy được nhưng tính sai. Hãy sửa dấu `+` thành phép nhân để tổng tiền của 5 món giá 7000 là 35000.\nOUTPUT: `say_num(...)` phải in 35000.",
      expectOut: /^\s*35000\s*$/m,
      solution: `from old_computer import say_num

price = 7000
quantity = 5
say_num(price * quantity)
`,
    },
    {
      code: `from old_computer import read_num, say, say_num

price = read_num("Giá một món: ")
quantity = read_num("Số lượng: ")
say("Tổng tiền:")
# Phần của bạn: in ra price * quantity bằng say_num(...)
`,
      label: "market_write_total.py",
      note: "ĐỀ BÀI\nINPUT thật: hai dòng `read_num(...)` đọc giá vào `price` và số lượng vào `quantity`.\nViệc cần làm: thêm dòng `say_num(price * quantity)`.\nOUTPUT: máy in nhãn `Tổng tiền:` rồi in tổng tiền theo hai số vừa nhập.",
      expectOut: { minLines: 2 },
      solution: `from old_computer import read_num, say, say_num

price = read_num("Giá một món: ")
quantity = read_num("Số lượng: ")
say("Tổng tiền:")
say_num(price * quantity)
`,
    },
    {
      checkpoint: {
        text: "Tổng tiền của nhiều món giống nhau dùng phép nhân: `total = price * quantity`. `read_num()` trả về số nên mình có thể nhân, cộng, trừ, hoặc chia trực tiếp.",
      },
    },
    {
      quiz: {
        title: "Chọn phép tính ở quầy",
        questions: [
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\nprice = 7000\nquantity = 5\nsay_num(price * quantity)\n```\nMáy in ra số nào?",
            a: ["`35000`", "`7005`", "`6995`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say, say_num

cash = 50000
total_price = 35000
change = cash - total_price
say("Tiền thừa:")
say_num(change)
`,
      label: "market_change_sample.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `cash = 50000`, `total_price = 35000`. Không có INPUT từ ngoài chương trình.\nKhái niệm: `tiền thừa` là tiền khách đưa trừ hóa đơn. Ví dụ: khách đưa 50000, hóa đơn 35000, tiền thừa là 15000.\nOUTPUT: máy in nhãn `Tiền thừa:` rồi in 15000.",
      expectOut: { all: [/Tiền thừa:/i, /^\s*15000\s*$/m] },
      solution: `from old_computer import say, say_num

cash = 50000
total_price = 35000
change = cash - total_price
say("Tiền thừa:")
say_num(change)
`,
    },
    {
      code: `from old_computer import read_num, say, say_num

cash = read_num("Khách đưa bao nhiêu? ")
total_price = read_num("Tổng tiền là bao nhiêu? ")
# Phần của bạn: in nhãn "Tiền thừa:" rồi in cash - total_price
`,
      label: "market_write_change.py",
      note: "ĐỀ BÀI\nINPUT thật: hai dòng `read_num(...)` đọc tiền khách đưa vào `cash` và tổng tiền vào `total_price`.\nViệc cần làm: viết hai dòng output: trước hết `say(\"Tiền thừa:\")`, sau đó `say_num(cash - total_price)`.\nOUTPUT: máy in tiền thừa theo hai số vừa nhập.",
      expectOut: { minLines: 2 },
      solution: `from old_computer import read_num, say, say_num

cash = read_num("Khách đưa bao nhiêu? ")
total_price = read_num("Tổng tiền là bao nhiêu? ")
say("Tiền thừa:")
say_num(cash - total_price)
`,
    },
    {
      quiz: {
        title: "Tiền thừa",
        questions: [
          {
            q: "Khách đưa `50000`, hóa đơn là `35000`. Biểu thức nào tính tiền thừa đúng?",
            a: ["`50000 - 35000`", "`35000 - 50000`", "`50000 + 35000`"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say, say_num

dust_price = 4000
dust_qty = 3
jar_price = 6000
jar_qty = 2

dust_total = dust_price * dust_qty
jar_total = jar_price * jar_qty
total = dust_total + jar_total
say("Hóa đơn hai món:")
say_num(total)
`,
      label: "market_two_items.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: giá và số lượng của hai loại hàng. Không có INPUT từ ngoài chương trình.\nViệc cần làm: đọc hai bước tính tiền từng loại, rồi cộng hai kết quả thành hóa đơn chung.\nOUTPUT: máy in nhãn `Hóa đơn hai món:` rồi in 24000.",
      expectOut: { all: [/Hóa đơn hai món:/i, /^\s*24000\s*$/m] },
      solution: `from old_computer import say, say_num

dust_price = 4000
dust_qty = 3
jar_price = 6000
jar_qty = 2

dust_total = dust_price * dust_qty
jar_total = jar_price * jar_qty
total = dust_total + jar_total
say("Hóa đơn hai món:")
say_num(total)
`,
    },
    {
      checkpoint: {
        text: "Một hóa đơn có thể tách thành nhiều bước: tính tiền từng món bằng `*`, cất vào biến riêng, rồi cộng các biến đó bằng `+` để ra tổng cuối cùng.",
      },
    },
    {
      quiz: {
        title: "Hóa đơn nhiều món",
        questions: [
          {
            q: "Đọc đoạn Mật Ngữ này:\n```python\ndust_total = 4000 * 3\njar_total = 6000 * 2\ntotal = dust_total + jar_total\nsay_num(total)\n```\nMáy in ra số nào?",
            a: ["`24000`", "`10000`", "`15000`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Ở Chợ Bụi Phép, phép tính không nằm riêng lẻ: mỗi dấu `+ - * /` trả lời một câu hỏi thật của quầy hàng. Đọc bài toán trước, rồi mới chọn dấu.",
    },
  ],
};
