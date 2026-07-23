// islandPASSWORD.js - bonus side-island after node09 for password checks and
// retry loops. It combines exact string comparison, !=, while, and and.
export default {
  index: -1,
  sideIslandId: "islandPASSWORD",
  title: "ĐẢO MẬT KHẨU",
  subtitle: "kiểm tra đúng mật khẩu, báo sai, rồi hỏi lại tới khi đúng",
  bundle: { art: "assets/rookie-bundle.webp", name: "Ổ KHÓA MẬT NGỮ" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY GÁC MẬT KHẨU",
    blurb: "một máy phụ để luyện so sánh chuỗi và vòng lặp hỏi lại",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO MẬT KHẨU ✦",
        hook: "Một cánh cổng phụ cần mật khẩu. Không cần phép mới: chỉ cần đọc chữ bằng `read()`, so sánh bằng `==` hoặc `!=`, rồi dùng `while` để hỏi lại khi chưa đúng.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Mật khẩu khác số điểm ở một chỗ quan trọng: chữ phải khớp đúng từng ký tự. `\"KOTO\"` và `\"koto\"` không giống nhau, vì chữ hoa và chữ thường khác nhau.",
    },
    {
      quiz: {
        title: "Khớp đúng từng chữ",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\nsecret = \"KOTO\"\nguess = \"KOTO\"\nif guess == secret:\n    say(\"MO\")\nelse:\n    say(\"SAI\")\n```\nMáy in gì?",
            a: ["MO", "SAI", "KOTO"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say

secret = "KOTO"
guess = "KOTO"

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
      label: "password_match_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `secret = \"KOTO\"`, `guess = \"KOTO\"`. Không có INPUT từ ngoài chương trình.\nPROCESS: dùng `==` để kiểm tra hai chuỗi có giống hệt nhau không.\nOUTPUT đúng là `MO`.",
      expectOut: /^MO$/,
      solution: `from old_computer import say

secret = "KOTO"
guess = "KOTO"

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
    },
    {
      code: `from old_computer import say

secret = "KOTO"
guess = "koto"

# Đến lượt của bạn: mật khẩu phải khớp đúng chữ hoa.
if guess == secret:
    say("MO")
else:
    say("MO")
`,
      label: "password_case_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `secret = \"KOTO\"`, `guess = \"koto\"`. Không có INPUT từ ngoài chương trình.\nVì chữ hoa và chữ thường khác nhau, mật khẩu này phải bị báo `SAI`. Sửa nhánh `else` để output đúng là `SAI`.",
      expectOut: /^SAI$/,
      solution: `from old_computer import say

secret = "KOTO"
guess = "koto"

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
    },
    {
      checkpoint: {
        text: "Kiểm tra mật khẩu dùng `guess == secret`. Hai chuỗi chỉ bằng nhau khi khớp đúng từng ký tự, kể cả chữ hoa và chữ thường.",
      },
    },
    {
      quiz: {
        title: "Đúng mật khẩu hay chưa",
        questions: [
          {
            q: "`secret = \"KOTO\"`, `guess = \"koto\"`. Điều kiện `guess == secret` đúng hay sai?",
            a: ["Sai, vì chữ hoa và chữ thường khác nhau", "Đúng, vì đọc giống nhau", "Đúng, vì đều có 4 chữ"],
            correct: 0,
          },
          {
            q: "Dòng nào mở cổng khi người dùng gõ đúng mật khẩu?",
            a: ["`if guess == secret:`", "`if guess = secret:`", "`if guess + secret:`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ dùng INPUT thật. `read()` đọc phần bạn gõ vào biến `guess`; sau đó máy mới so sánh với mật khẩu cho sẵn.",
    },
    {
      code: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
      label: "password_input_demo.py",
      note: "ĐỀ BÀI\nINPUT thật: `read(...)` đọc mật khẩu bạn gõ vào `guess`.\nPROCESS: so sánh `guess` với `secret` bằng `==`.\nVới input mẫu `KOTO`, OUTPUT đúng là `MO`.",
      sampleInput: "KOTO",
      expectOut: /^MO$/,
      solution: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
    },
    {
      code: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

# Đến lượt của bạn: sửa hai nhánh để đúng thì mở, sai thì báo sai.
if guess == secret:
    say("SAI")
else:
    say("MO")
`,
      label: "password_branch_fix.py",
      note: "ĐỀ BÀI\nINPUT thật: máy đọc mật khẩu vào `guess`.\nPROCESS đúng: nếu `guess == secret` thì in `MO`; nếu không khớp thì in `SAI`.\nVới input mẫu `KOTO`, OUTPUT đúng là `MO`.",
      sampleInput: "KOTO",
      expectOut: /^MO$/,
      solution: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

if guess == secret:
    say("MO")
else:
    say("SAI")
`,
    },
    {
      checkpoint: {
        text: "Mật khẩu nhập từ ngoài chương trình là INPUT thật: `guess = read(...)`. Sau đó dùng `if guess == secret:` để chọn nhánh mở hoặc nhánh báo sai.",
      },
    },
    {
      quiz: {
        title: "INPUT rồi mới so sánh",
        questions: [
          {
            q: "Đoạn này đọc mật khẩu thật từ người dùng:\n```python\nguess = read(\"Mật khẩu: \")\n```\nSau đó dòng nào kiểm tra đúng mật khẩu?",
            a: ["`if guess == secret:`", "`if secret == \"guess\":`", "`if read == secret:`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Cổng tốt không chỉ báo sai một lần rồi bỏ cuộc. Nếu mật khẩu chưa đúng, mình dùng `while guess != secret:` để hỏi lại. `!=` nghĩa là chưa bằng.",
    },
    {
      code: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

while guess != secret:
    say("SAI")
    guess = read("Mật khẩu: ")

say("MO")
`,
      label: "password_retry_demo.py",
      note: "ĐỀ BÀI\nINPUT thật: máy đọc mật khẩu, nếu chưa đúng thì đọc lại.\nPROCESS: `while guess != secret` chạy khi mật khẩu hiện tại chưa khớp.\nVới input mẫu `SAI`, rồi `KOTO`, OUTPUT cần có `SAI` trước, sau đó `MO`.",
      sampleInput: ["SAI", "KOTO"],
      expectOut: { all: [/SAI/i, /MO/i] },
      solution: `from old_computer import read, say

secret = "KOTO"
guess = read("Mật khẩu: ")

while guess != secret:
    say("SAI")
    guess = read("Mật khẩu: ")

say("MO")
`,
    },
    {
      code: `from old_computer import read, say

secret = "KOTO"
tries = 1
guess = read("Mật khẩu: ")

# Đến lượt của bạn: cho người chơi thử tối đa 3 lần.
while guess != secret and tries < 2:
    say("SAI")
    guess = read("Mật khẩu: ")
    tries = tries + 1

if guess == secret:
    say("MO")
else:
    say("KHOA")
`,
      label: "password_three_tries_fix.py",
      note: "ĐỀ BÀI\nINPUT thật: máy đọc mật khẩu nhiều lần.\nPROCESS đúng: người chơi được thử tối đa 3 lần, nên điều kiện vòng lặp phải cho `tries < 3`.\nVới input mẫu `SAI`, `SAI`, rồi `KOTO`, OUTPUT cuối cùng phải là `MO`.",
      sampleInput: ["SAI", "SAI", "KOTO"],
      expectOut: /MO/i,
      solution: `from old_computer import read, say

secret = "KOTO"
tries = 1
guess = read("Mật khẩu: ")

while guess != secret and tries < 3:
    say("SAI")
    guess = read("Mật khẩu: ")
    tries = tries + 1

if guess == secret:
    say("MO")
else:
    say("KHOA")
`,
    },
    {
      checkpoint: {
        text: "`while guess != secret:` hỏi lại khi mật khẩu chưa đúng. Nếu cần giới hạn số lần thử, ghép thêm điều kiện như `tries < 3` bằng `and`.",
      },
    },
    {
      quiz: {
        title: "Hỏi lại tới khi đúng",
        questions: [
          {
            q: "`secret = \"KOTO\"`, `guess = \"SAI\"`. Điều kiện `guess != secret` đúng hay sai?",
            a: ["Đúng, vì hai chuỗi chưa bằng nhau", "Sai, vì đều là chuỗi", "Sai, vì `!=` giống `==`"],
            correct: 0,
          },
          {
            q: "Trong vòng lặp hỏi mật khẩu, vì sao phải có dòng `guess = read(\"Mật khẩu: \")` ở bên trong vòng lặp?",
            a: ["Để người dùng có cơ hội nhập lại mật khẩu mới", "Để máy in nhiều dòng hơn", "Để `secret` tự đổi"],
            correct: 0,
          },
          {
            q: "`while guess != secret and tries < 3:` chạy khi nào?",
            a: ["Khi mật khẩu chưa đúng và vẫn còn lượt thử", "Khi mật khẩu đúng", "Khi hết lượt thử"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember:
        "Mẫu mật khẩu có ba bước: đọc INPUT bằng `read()`, so sánh bằng `guess == secret`, và nếu cần hỏi lại thì dùng `while guess != secret:`. Khi có giới hạn lượt thử, thêm biến `tries` và điều kiện `tries < 3`.",
    },
  ],
};
