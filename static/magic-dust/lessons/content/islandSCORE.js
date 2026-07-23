// islandSCORE.js - bonus side-island after node02 for score and resource
// updates. It teaches reassignment as a practical arithmetic pattern.
export default {
  index: -1,
  sideIslandId: "islandSCORE",
  title: "ĐẢO BẢNG ĐIỂM",
  subtitle: "cộng điểm, trừ phạt, nhân thưởng, và cập nhật giá trị cũ",
  bundle: { art: "assets/rookie-bundle.webp", name: "BẢNG ĐIỂM GỖ" },
  machine: {
    art: "assets/old-computer.webp",
    name: "MÁY GHI ĐIỂM",
    blurb: "một máy phụ để luyện mẫu gán lại: lấy giá trị cũ, tính giá trị mới, rồi in ra",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      intro: {
        title: "✦ ĐẢO BẢNG ĐIỂM ✦",
        hook: "Điểm trong game không đứng yên. Đúng thì cộng, sai thì trừ, gặp kho báu thì nhân thưởng. Đảo này luyện mẫu rất hay dùng: cập nhật một biến từ giá trị cũ của chính nó.",
        art: "assets/old-computer.webp",
      },
    },
    {
      npc: "Biến có thể được gán lại. Dòng `score = score + points` nghĩa là máy đọc điểm cũ trong `score`, cộng thêm `points`, rồi ghi kết quả mới trở lại vào `score`.",
    },
    {
      quiz: {
        title: "Cộng vào điểm cũ",
        questions: [
          {
            q: "`score = 10`, `points = 5`, rồi chạy `score = score + points`. Sau đó `score` giữ số nào?",
            a: ["15", "5", "10"],
            correct: 0,
          },
        ],
      },
    },
    {
      code: `from old_computer import say_num

score = 10
points = 5
score = score + points
say_num(score)
`,
      label: "score_add_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `score = 10`, `points = 5`. Không có INPUT từ ngoài chương trình.\nPROCESS: lấy điểm cũ, cộng điểm mới, rồi gán lại vào `score`.\nOUTPUT đúng là 15.",
      expectOut: /^15$/,
      solution: `from old_computer import say_num

score = 10
points = 5
score = score + points
say_num(score)
`,
    },
    {
      code: `from old_computer import say_num

score = 7
bonus = 3

# Đến lượt của bạn: cộng bonus vào điểm cũ, không thay điểm bằng riêng bonus.
score = bonus
say_num(score)
`,
      label: "score_add_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `score = 7`, `bonus = 3`.\nPROCESS đúng: điểm mới phải là điểm cũ cộng bonus.\nOUTPUT đúng là 10.",
      expectOut: /^10$/,
      solution: `from old_computer import say_num

score = 7
bonus = 3

score = score + bonus
say_num(score)
`,
    },
    {
      checkpoint: {
        text: "`score = score + points` là mẫu cập nhật biến: vế phải đọc giá trị cũ, tính ra giá trị mới; vế trái ghi kết quả mới vào cùng biến.",
      },
    },
    {
      quiz: {
        title: "Vế phải đọc điểm cũ",
        questions: [
          {
            q: "`score = 4`; chạy `score = score + 6`; rồi `say_num(score)`. Máy in gì?",
            a: ["10", "6", "4"],
            correct: 0,
          },
          {
            q: "`score = 4`; chạy `score = 6`; rồi `say_num(score)`. Máy in gì?",
            a: ["6", "10", "4"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Điểm cũng có thể bị trừ. Cách đọc vẫn y như trước: lấy giá trị cũ, trừ phần phạt, rồi gán lại.",
    },
    {
      code: `from old_computer import say_num

score = 20
penalty = 4
score = score - penalty
say_num(score)
`,
      label: "score_penalty_demo.py",
      note: "RUN KIỂM CHỨNG\nGiá trị cho sẵn: `score = 20`, `penalty = 4`.\nPROCESS: điểm mới bằng điểm cũ trừ điểm phạt.\nOUTPUT đúng là 16.",
      expectOut: /^16$/,
      solution: `from old_computer import say_num

score = 20
penalty = 4
score = score - penalty
say_num(score)
`,
    },
    {
      code: `from old_computer import say_num

hp = 12
heal = 5
damage = 8

# Đến lượt của bạn: hồi máu trước, rồi trừ sát thương.
hp = hp + heal
hp = hp + damage
say_num(hp)
`,
      label: "hp_update_fix.py",
      note: "ĐỀ BÀI\nGiá trị cho sẵn: `hp = 12`, `heal = 5`, `damage = 8`.\nPROCESS đúng: hồi máu bằng `hp = hp + heal`, sau đó trừ sát thương bằng `hp = hp - damage`.\nOUTPUT đúng là 9.",
      expectOut: /^9$/,
      solution: `from old_computer import say_num

hp = 12
heal = 5
damage = 8

hp = hp + heal
hp = hp - damage
say_num(hp)
`,
    },
    {
      checkpoint: {
        text: "Cập nhật nhiều lần thì máy chạy từ trên xuống: sau mỗi dòng gán, biến giữ giá trị mới cho dòng tiếp theo dùng.",
      },
    },
    {
      quiz: {
        title: "Cập nhật theo thứ tự",
        questions: [
          {
            q: "`hp = 10`; chạy `hp = hp + 4`; rồi `hp = hp - 7`. Cuối cùng `hp` bằng bao nhiêu?",
            a: ["7", "21", "3"],
            correct: 0,
          },
          {
            q: "`score = 8`; chạy `score = score * 2`. `score` giữ gì?",
            a: ["16", "10", "8"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ dùng INPUT thật. Máy sẽ đọc điểm cũ, điểm cộng, điểm phạt; nhiệm vụ của bạn là in điểm cuối cùng.",
    },
    {
      code: `from old_computer import read_num, say_num

score = read_num("Điểm cũ: ")
points = read_num("Điểm cộng: ")
penalty = read_num("Điểm phạt: ")

# Đến lượt của bạn: tính điểm cuối cùng.
final_score = score
say_num(final_score)
`,
      label: "final_score_write.py",
      note: "ĐỀ BÀI\nINPUT thật: máy đọc `score`, `points`, `penalty` từ người dùng.\nPROCESS cần dùng: điểm cuối cùng bằng điểm cũ cộng điểm thưởng rồi trừ điểm phạt.\nVới input mẫu 10, 5, 3, OUTPUT đúng là 12.",
      sampleInput: ["10", "5", "3"],
      expectOut: /^12$/,
      solution: `from old_computer import read_num, say_num

score = read_num("Điểm cũ: ")
points = read_num("Điểm cộng: ")
penalty = read_num("Điểm phạt: ")

final_score = score + points - penalty
say_num(final_score)
`,
    },
    {
      code: `from old_computer import say_num

score = 6
score = score + 4
score = score * 2
score = score - 3

say_num(score)
`,
      label: "score_chain_demo.py",
      note: "THỬ THÁCH NHỎ\nBấm RUN để lần theo một chuỗi cập nhật: bắt đầu 6, cộng 4 thành 10, nhân đôi thành 20, trừ 3 còn 17.",
      expectOut: /^17$/,
      solution: `from old_computer import say_num

score = 6
score = score + 4
score = score * 2
score = score - 3

say_num(score)
`,
    },
    {
      remember:
        "Mẫu bảng điểm nằm ở nhiều bài thật: `score = score + points`, `hp = hp - damage`, hoặc `score = score * 2`. Mỗi lần gán lại, máy dùng giá trị cũ để tạo giá trị mới.",
    },
  ],
};
