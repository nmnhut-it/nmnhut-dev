// islandMODCHECKS.js - side island that intentionally teaches `%` as a small
// interview-practice tool before using it for divisibility and leap years.
export default {
  index: -1,
  sideIslandId: "islandMODCHECKS",
  title: "ĐẢO CHIA HẾT",
  subtitle: "học dấu % rồi dùng cho số chẵn, số lẻ và năm nhuận",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI ĐỒ NGHỀ PHẦN DƯ" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY SOI PHẦN DƯ",
    blurb: "một trạm phụ dạy dấu `%`, rồi dùng nó để kiểm tra chia hết và năm nhuận",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO CHIA HẾT ✦",
        hook: "Có nhiều bài điều kiện rất nhỏ nhưng gặp hoài: số này có chia hết không, số này chẵn hay lẻ, năm này có phải năm nhuận không. Đảo này dạy riêng dấu `%` trước, rồi dùng nó vào từng bài.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Pip bày một túi kẹo lên bàn nhé. Có 14 viên kẹo, chia mỗi nhóm 3 viên thì còn dư 2 viên. Python có một dấu rất hợp cho việc đó: `%` lấy phần dư sau khi chia.",
    },
    {
      code: `from old_computer import say_num

candies = 14
group_size = 3

say_num(candies % group_size)
`,
      label: "phan_du_demo.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `candies = 14`, `group_size = 3`. Không có INPUT từ ngoài chương trình.\nBấm RUN để xem `candies % group_size` cho ra phần còn dư sau khi chia 14 viên thành các nhóm 3.",
      expectOut: /^2$/,
      solution: `from old_computer import say_num

candies = 14
group_size = 3

say_num(candies % group_size)
`,
    },
    {
      npc: "`a % b` nghĩa là lấy phần dư khi chia `a` cho `b`. Nếu phần dư bằng 0, số đó chia hết cho `b`. Ví dụ: `12 % 3` bằng 0 nên 12 chia hết cho 3; `11 % 2` bằng 1 nên 11 là số lẻ. Tụi mình thử ngay với một số chia hết cho 3 nhé.",
    },
    {
      code: `from old_computer import say

number = 12

if number % 3 == 0:
    say("CHIA HET")
else:
    say("KHONG CHIA HET")
`,
      label: "chia_het_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `number = 12`. `number % 3` bằng 0, nên 12 chia hết cho 3 và máy sẽ in `CHIA HET`.",
      expectOut: /^CHIA HET$/,
      solution: `from old_computer import say

number = 12

if number % 3 == 0:
    say("CHIA HET")
else:
    say("KHONG CHIA HET")
`,
    },
    {
      code: `from old_computer import say

number = 9

# Đến lượt của bạn: số lẻ có phần dư 1 khi chia cho 2.
if number % 2 == 0:
    say("LE")
else:
    say("KHONG LE")
`,
      label: "so_le_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `number = 9`. Không có INPUT từ ngoài chương trình.\n`number` là số đang được kiểm tra. Sửa điều kiện trong dòng `if` thành kiểm tra phần dư bằng 1 khi chia cho 2, rồi in `LE`.",
      expectOut: /^LE$/,
      solution: `from old_computer import say

number = 9

if number % 2 == 1:
    say("LE")
else:
    say("KHONG LE")
`,
    },
    {
      checkpoint: {
        text: "`number % m` lấy phần dư khi chia `number` cho `m`. Nếu `number % m == 0` thì `number` chia hết cho `m`; nếu `number % 2 == 1` thì `number` là số lẻ.",
      },
    },
    {
      quiz: {
        title: "Phần dư nói gì",
        questions: [
          {
            q: "Đoạn này in ra gì?\n```python\nnumber = 10\nif number % 5 == 0:\n    say(\"CHIA HET\")\nelse:\n    say(\"KHONG CHIA HET\")\n```",
            a: ["CHIA HET", "KHONG CHIA HET", "5"],
            correct: 0,
          },
          {
            q: "`number = 11`. Điều kiện nào đúng để nhận ra 11 là số lẻ?",
            a: ["`number % 2 == 1`", "`number % 2 == 0`", "`number / 2 == 1`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ tới bài năm nhuận. Luật hơi có thứ tự: chia hết cho 400 thì nhuận; nếu không, chia hết cho 100 thì không nhuận; nếu không, chia hết cho 4 thì nhuận. Máy sẽ hỏi từ trên xuống, nên thứ tự nhánh rất quan trọng.",
    },
    {
      code: `from old_computer import say

year = 2024

if year % 400 == 0:
    say("NHUAN")
elif year % 100 == 0:
    say("KHONG NHUAN")
elif year % 4 == 0:
    say("NHUAN")
else:
    say("KHONG NHUAN")
`,
      label: "nam_nhuan_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `year = 2024`. Năm 2024 không chia hết cho 400 hay 100, nhưng chia hết cho 4, nên máy in `NHUAN`.",
      expectOut: /^NHUAN$/,
      solution: `from old_computer import say

year = 2024

if year % 400 == 0:
    say("NHUAN")
elif year % 100 == 0:
    say("KHONG NHUAN")
elif year % 4 == 0:
    say("NHUAN")
else:
    say("KHONG NHUAN")
`,
    },
    {
      code: `from old_computer import say

year = 1900

# Đến lượt của bạn: năm chia hết cho 100 nhưng không chia hết cho 400 thì không nhuận.
if year % 4 == 0:
    say("NHUAN")
elif year % 100 == 0:
    say("KHONG NHUAN")
elif year % 400 == 0:
    say("NHUAN")
else:
    say("KHONG NHUAN")
`,
      label: "nam_nhuan_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `year = 1900`. Không có INPUT từ ngoài chương trình.\nNăm 1900 chia hết cho 4, nhưng cũng chia hết cho 100 và không chia hết cho 400, nên kết quả đúng là `KHONG NHUAN`. Sắp xếp lại các nhánh để máy hỏi mốc 400, rồi 100, rồi 4.",
      expectOut: /^KHONG NHUAN$/,
      solution: `from old_computer import say

year = 1900

if year % 400 == 0:
    say("NHUAN")
elif year % 100 == 0:
    say("KHONG NHUAN")
elif year % 4 == 0:
    say("NHUAN")
else:
    say("KHONG NHUAN")
`,
    },
    {
      checkpoint: {
        text: "Bài năm nhuận dùng `%` để kiểm tra chia hết. Hỏi `year % 400 == 0` trước, rồi `year % 100 == 0`, rồi `year % 4 == 0`; thứ tự này giữ cho các năm như 1900 và 2000 được xử lý đúng.",
      },
    },
    {
      quiz: {
        title: "Năm nhuận",
        questions: [
          {
            q: "Với luật:\n```python\nif year % 400 == 0:\n    say(\"NHUAN\")\nelif year % 100 == 0:\n    say(\"KHONG NHUAN\")\nelif year % 4 == 0:\n    say(\"NHUAN\")\nelse:\n    say(\"KHONG NHUAN\")\n```\nNếu `year = 2000`, máy in gì?",
            a: ["NHUAN", "KHONG NHUAN", "2000"],
            correct: 0,
          },
          {
            q: "Vì sao `year = 1900` không nên được xử lý bằng nhánh `year % 4 == 0` trước?",
            a: ["Vì 1900 chia hết cho 100 nhưng không chia hết cho 400, nên phải bị loại trước nhánh chia hết cho 4", "Vì 1900 không chia hết cho 4", "Vì `%` không dùng được với năm"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "`%` lấy phần dư. Phần dư bằng 0 nghĩa là chia hết; phần dư 1 khi chia cho 2 nghĩa là số lẻ; bài năm nhuận cần đặt nhánh 400 trước 100 trước 4.",
    },
  ],
};
