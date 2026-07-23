// Bonus practice after node21. It combines only the functions, return values,
// dictionaries, lists, strings, conditions, and loops already taught.
export default {
  index: -1,
  sideIslandId: "islandGIFTSETUP",
  title: "Xưởng Chuẩn Bị Quà Tặng Cho Buổi Phát Sóng",
  subtitle: "làm sạch tên, chọn hiệu ứng và chuẩn bị danh sách quà tặng bằng các công cụ đã học",
  bundle: { art: "assets/rookie-bundle.webp", name: "HỘP QUÀ PHÁT SÓNG" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY CHUẨN BỊ QUÀ TẶNG",
    blurb: "một bàn chuẩn bị dữ liệu để mỗi món quà có tên, điểm và hiệu ứng rõ ràng trước giờ phát sóng",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ XƯỞNG CHUẨN BỊ QUÀ TẶNG CHO BUỔI PHÁT SÓNG ✦",
        hook: "Buổi phát sóng sắp bắt đầu. Trước khi hiệu ứng xuất hiện, chương trình phải làm sạch tên người gửi, chọn hiệu ứng theo điểm và chuẩn bị từng hồ sơ quà tặng.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Tên người gửi có thể thừa khoảng trắng hoặc dùng chữ thường. Hàm đầu tiên sẽ chuẩn hóa tên rồi giao kết quả về chỗ gọi.",
    },
    {
      code: `from old_computer import say

def clean_sender(name):
    clean = name.strip()
    clean = clean.upper()
    # Viết dòng return ở đây

sender = clean_sender("  mira  ")
say(sender)
`,
      label: "clean_sender_name.py",
      note: "ĐỀ BÀI\nCho sẵn chuỗi `\"  mira  \"`; không có INPUT từ ngoài chương trình. Hàm đã PROCESS bằng cách bỏ khoảng trắng hai đầu và đổi tên thành chữ hoa. Thêm `return` để chỗ gọi nhận kết quả. OUTPUT đúng là `MIRA`.",
      expectOut: /^MIRA$/,
      solution: `from old_computer import say

def clean_sender(name):
    clean = name.strip()
    clean = clean.upper()
    return clean

sender = clean_sender("  mira  ")
say(sender)
`,
    },
    {
      checkpoint: {
        text: "Hàm `clean_sender(name)` nhận một chuỗi, dùng `strip()` và `upper()` để chuẩn hóa, rồi `return` tên đã xử lý về chỗ gọi.",
      },
    },
    {
      quiz: {
        title: "Chuẩn bị tên người gửi",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef clean_sender(name):\n    return name.strip().upper()\n\nresult = clean_sender(\"  bo  \")\n```\n`result` giữ chuỗi nào?",
            a: ["BO", "bo", "  BO  "],
            correct: 0,
          },
          {
            q: "Chương trình cần so tên `Mira`, `mira` và `  MIRA  ` như cùng một người gửi. Cách xử lý nào phù hợp?",
            a: ["Bỏ khoảng trắng hai đầu rồi đổi về cùng kiểu chữ", "Chỉ lấy ký tự đầu tiên", "Đổi tên thành số"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Tiếp theo, điểm của món quà quyết định hiệu ứng sẽ dùng. Mỗi nhánh điều kiện trả về đúng một tên hiệu ứng.",
    },
    {
      code: `from old_computer import say

def effect_for(points):
    if points >= 10:
        return "BURST"
    elif points >= 5:
        return "BURST"  # Sửa hiệu ứng của mốc này
    else:
        return "SPARK"

say(effect_for(7))
`,
      label: "choose_gift_effect.py",
      note: "ĐỀ BÀI\nCho sẵn `points = 7` khi gọi hàm; không có INPUT từ ngoài chương trình. Hàm kiểm tra các mốc theo thứ tự: từ 10 điểm trả `BURST`, từ 5 đến 9 điểm phải trả `GLOW`, còn lại trả `SPARK`. Sửa giá trị trong nhánh `elif`. OUTPUT đúng là `GLOW`.",
      expectOut: /^GLOW$/,
      solution: `from old_computer import say

def effect_for(points):
    if points >= 10:
        return "BURST"
    elif points >= 5:
        return "GLOW"
    else:
        return "SPARK"

say(effect_for(7))
`,
    },
    {
      checkpoint: {
        text: "Hàm `effect_for(points)` kiểm tra `points >= 10` trước, rồi `points >= 5`. Nhánh đầu tiên có điều kiện đúng sẽ trả tên hiệu ứng về chỗ gọi.",
      },
    },
    {
      quiz: {
        title: "Chọn hiệu ứng theo điểm",
        questions: [
          {
            q: "Với quy tắc từ 10 điểm là `BURST`, từ 5 đến 9 điểm là `GLOW`, còn lại là `SPARK`, lời gọi `effect_for(4)` trả về gì?",
            a: ["SPARK", "GLOW", "BURST"],
            correct: 0,
          },
          {
            q: "Cùng quy tắc đó, vì sao cần kiểm tra `points >= 10` trước `points >= 5`?",
            a: ["Vì 12 cũng thỏa `points >= 5`; kiểm tra mốc cao trước giúp chọn `BURST`", "Vì Python chỉ cho dùng một nhánh", "Vì `return` chỉ dùng được với số 10"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bây giờ mình xử lý cả list quà tặng. Với mỗi dictionary, chương trình đọc điểm, gọi hàm chọn hiệu ứng, rồi ghi kết quả vào key `effect` của chính món quà đó.",
    },
    {
      code: `from old_computer import say

def effect_for(points):
    if points >= 10:
        return "BURST"
    elif points >= 5:
        return "GLOW"
    else:
        return "SPARK"

gifts = [
    {"name": "HEART", "points": 3},
    {"name": "COMET", "points": 8}
]

for gift in gifts:
    gift["effect"] = effect_for(0)  # Sửa đối số để dùng điểm của món quà hiện tại
    say(gift["name"] + ":" + gift["effect"])
`,
      label: "prepare_gift_list.py",
      note: "ĐỀ BÀI\nList `gifts` được cho sẵn; không có INPUT từ ngoài chương trình. Với mỗi dictionary, đọc `gift[\"points\"]`, gọi `effect_for(...)`, rồi gán kết quả vào key `effect` của chính dictionary đó. OUTPUT phải là `HEART:SPARK` rồi `COMET:GLOW`.",
      expectOut: { all: [{ minLines: 2 }, /^HEART:SPARK$/, /^COMET:GLOW$/] },
      solution: `from old_computer import say

def effect_for(points):
    if points >= 10:
        return "BURST"
    elif points >= 5:
        return "GLOW"
    else:
        return "SPARK"

gifts = [
    {"name": "HEART", "points": 3},
    {"name": "COMET", "points": 8}
]

for gift in gifts:
    gift["effect"] = effect_for(gift["points"])
    say(gift["name"] + ":" + gift["effect"])
`,
    },
    {
      checkpoint: {
        text: "Trong `for gift in gifts`, biến `gift` giữ dictionary hiện tại. Đọc `gift[\"points\"]` để tính hiệu ứng rồi gán vào `gift[\"effect\"]` sẽ cập nhật đúng món quà đang được xử lý.",
      },
    },
    {
      quiz: {
        title: "Chuẩn bị từng món quà",
        questions: [
          {
            q: "Trong vòng lặp `for gift in gifts`, dòng nào gán hiệu ứng dựa trên điểm của chính món quà hiện tại?",
            a: ["`gift[\"effect\"] = effect_for(gift[\"points\"])`", "`gifts[\"effect\"] = effect_for(0)`", "`gift[\"points\"] = \"effect\"`"],
            correct: 0,
          },
          {
            q: "List có `[{\"name\": \"STAR\", \"points\": 12}]`. Sau khi xử lý theo quy tắc đã cho, key `effect` của món quà nên giữ value nào?",
            a: ["BURST", "GLOW", "SPARK"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Bộ phận cuối cùng tra cứu một món quà theo tên. Hàm quét list và trả về điểm khi tìm thấy; nếu quét hết mà chưa thấy, hàm trả `-1`.",
    },
    {
      code: `from old_computer import say_num

def find_gift_points(gifts, wanted_name):
    clean_wanted = wanted_name.strip().upper()
    for gift in gifts:
        if gift["name"] == clean_wanted:
            return -1  # Sửa để trả điểm của món quà đang khớp
    return -1

gifts = [
    {"name": "HEART", "points": 3},
    {"name": "COMET", "points": 8}
]

say_num(find_gift_points(gifts, "  comet  "))
`,
      label: "find_gift_points.py",
      note: "ĐỀ BÀI\nList `gifts` và tên cần tìm `\"  comet  \"` được cho sẵn; không có INPUT từ ngoài chương trình. Hàm chuẩn hóa tên, quét từng dictionary và so sánh key `name`. Sửa dòng `return` trong nhánh tìm thấy để trả điểm của món quà đang khớp. OUTPUT đúng là 8.",
      expectOut: /^8$/,
      solution: `from old_computer import say_num

def find_gift_points(gifts, wanted_name):
    clean_wanted = wanted_name.strip().upper()
    for gift in gifts:
        if gift["name"] == clean_wanted:
            return gift["points"]
    return -1

gifts = [
    {"name": "HEART", "points": 3},
    {"name": "COMET", "points": 8}
]

say_num(find_gift_points(gifts, "  comet  "))
`,
    },
    {
      checkpoint: {
        text: "Hàm tra cứu chuẩn hóa tên cần tìm, quét từng dictionary và trả value khi key `name` khớp. Giá trị `-1` báo rằng hàm đã quét hết list nhưng không tìm thấy món quà.",
      },
    },
    {
      quiz: {
        title: "Tra cứu quà tặng",
        questions: [
          {
            q: "Hàm tra cứu trả `-1` khi không tìm thấy. Với list chỉ có HEART và COMET, lời gọi tìm `STAR` nên trả gì?",
            a: ["-1", "0", "STAR"],
            correct: 0,
          },
          {
            q: "Trong nhánh `if gift[\"name\"] == clean_wanted:`, dòng nào trả điểm của đúng dictionary đang khớp?",
            a: ["`return gift[\"points\"]`", "`return gifts[\"points\"]`", "`return clean_wanted`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Để chuẩn bị dữ liệu quà tặng, có thể chia chương trình thành các hàm nhỏ: chuẩn hóa tên, chọn hiệu ứng theo điểm, xử lý từng dictionary trong list và tra cứu một món quà. Mỗi bước có dữ liệu cho sẵn, PROCESS rõ ràng và OUTPUT để kiểm tra.",
    },
  ],
};
