export default {
  index: 21,
  title: "Dữ Liệu Cho Quà Tặng",
  subtitle: "dùng hàm, return, dictionary, list, chuỗi, điều kiện và vòng lặp để chuẩn bị dữ liệu quà tặng mô phỏng",
  bundle: { art: "assets/future-packet.webp", name: "GIFT DATA PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "TRẠM DỮ LIỆU QUÀ TẶNG",
    blurb: "một trạm chuẩn bị tên người gửi, tên quà và nhãn hiệu ứng cho chương trình phát sóng tương tác",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      quiz: {
        title: "Kiểm tra trước khi làm dự án",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef clean(text):\n    return text.strip().upper()\n\nresult = clean(\"  star  \")\n```\nBiến `result` giữ giá trị nào?",
            a: ['Chuỗi `"STAR"`', 'Chuỗi `"  star  "`', "Không giữ giá trị nào"],
            correct: 0,
          },
          {
            q: "Một bản ghi quà tặng là `gift = {\"sender\": \"AN\", \"points\": 6}`. Dòng nào đọc đúng số điểm để dùng trong phép so sánh?",
            a: ['`gift["points"]`', '`gift[6]`', '`points[gift]`'],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Pip đang chuẩn bị một chương trình phát sóng tương tác cho Kotopia. Trước khi làm sticker hay hiệu ứng, tụi mình cần sắp xếp rõ người gửi, tên quà, số điểm và nhãn hiệu ứng.",
    },
    {
      npc: "Node này chỉ dùng dữ liệu mô phỏng được gán sẵn, không đọc INPUT từ người xem và không kết nối nền tảng bên ngoài. OUTPUT chữ giúp kiểm tra dữ liệu trước khi bài sau tạo hình ảnh.",
    },

    // Cụm 1: làm sạch tên người gửi và tên quà.
    {
      npc: "Tên do nhiều nơi gửi tới có thể thừa khoảng trắng hoặc dùng chữ thường. Hàm `clean_text(text)` sẽ bỏ khoảng trắng ở hai đầu, đổi phần còn lại thành chữ hoa, rồi `return` chuỗi đã làm sạch.",
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

sender = clean_text("  mai  ")
gift_name = clean_text(" star  ")
say(sender + ":" + gift_name)
`,
      label: "clean_gift_demo.py",
      note: "RUN KIỂM CHỨNG\nHai chuỗi `\"  mai  \"` và `\" star  \"` được gán sẵn; không có INPUT đọc từ bên ngoài. PROCESS là gọi `clean_text(...)` cho từng chuỗi. OUTPUT đúng là `MAI:STAR`.",
      expectOut: /^MAI:STAR$/,
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

sender = clean_text("  mai  ")
gift_name = clean_text(" star  ")
say(sender + ":" + gift_name)
`,
    },
    {
      code: `from old_computer import say

def clean_text(text):
    cleaned = text.strip().upper()
    # Lượt của bạn: đưa chuỗi trong cleaned ra ngoài hàm

gift_name = clean_text("  flower ")
say(gift_name)
`,
      label: "clean_gift_text.py",
      note: "ĐỀ BÀI\nChuỗi `\"  flower \"` được gán sẵn; không có INPUT đọc từ bên ngoài. Thêm một dòng `return` để hàm đưa chuỗi đã bỏ khoảng trắng và đổi thành chữ hoa ra ngoài. OUTPUT đúng là `FLOWER`.",
      expectOut: /^FLOWER$/,
      solution: `from old_computer import say

def clean_text(text):
    cleaned = text.strip().upper()
    return cleaned

gift_name = clean_text("  flower ")
say(gift_name)
`,
    },
    {
      checkpoint: {
        text: "Hàm `clean_text(text)` nhận một chuỗi qua tham số, dùng `strip().upper()` để tạo chuỗi đã làm sạch, rồi `return` kết quả để phần khác của chương trình tiếp tục sử dụng.",
      },
    },
    {
      quiz: {
        title: "Làm sạch dữ liệu chữ",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef clean_text(text):\n    return text.strip().upper()\n\nsender = clean_text(\"  linh \" )\n```\nBiến `sender` giữ chuỗi nào?",
            a: ['`"LINH"`', '`"  linh "`', '`"linh"`'],
            correct: 0,
          },
          {
            q: "Một hàm tạo `cleaned = text.strip().upper()` nhưng không có `return cleaned`. Khi chương trình gán `gift_name = clean_text(\"star\")`, vì sao `gift_name` không giữ chuỗi đã làm sạch?",
            a: ["Hàm chưa đưa `cleaned` ra ngoài bằng `return`", "Chuỗi không được dùng trong hàm", "Dictionary đang thiếu khóa `gift`"],
            correct: 0,
          },
        ],
      },
    },

    // Cụm 2: đổi điểm quà thành nhãn hiệu ứng.
    {
      npc: "Mỗi quà mẫu có số điểm được gán sẵn. Từ 8 điểm là `BURST`, từ 4 đến 7 điểm là `GLOW`, còn lại là `SPARK`. Bài sau sẽ dùng nhãn này để chọn hiệu ứng.",
    },
    {
      code: `from old_computer import say

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

say(effect_for(9))
say(effect_for(5))
say(effect_for(2))
`,
      label: "effect_rule_demo.py",
      note: "RUN KIỂM CHỨNG\nBa số điểm 9, 5 và 2 được gán sẵn; không có INPUT đọc từ bên ngoài. PROCESS là gọi `effect_for(...)` cho từng số. OUTPUT lần lượt là `BURST`, `GLOW` và `SPARK`.",
      expectOut: { all: [{ minLines: 3 }, /^BURST$/, /^GLOW$/, /^SPARK$/] },
      solution: `from old_computer import say

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

say(effect_for(9))
say(effect_for(5))
say(effect_for(2))
`,
    },
    {
      code: `from old_computer import say

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        # Lượt của bạn: sửa nhãn cho quà từ 4 đến 7 điểm
        return "SPARK"
    else:
        return "SPARK"

say(effect_for(6))
`,
      label: "effect_rule_fix.py",
      note: "ĐỀ BÀI\nSố điểm 6 được gán sẵn; không có INPUT đọc từ bên ngoài. Nhánh dành cho 4 đến 7 điểm đang trả sai nhãn. Sửa giá trị được `return` để OUTPUT đúng là `GLOW`.",
      expectOut: /^GLOW$/,
      solution: `from old_computer import say

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

say(effect_for(6))
`,
    },
    {
      checkpoint: {
        text: "Hàm `effect_for(points)` kiểm tra `points >= 8` trước, rồi `points >= 4`. Nhánh đầu tiên có điều kiện đúng sẽ `return` một nhãn và kết thúc lần gọi hàm.",
      },
    },
    {
      quiz: {
        title: "Chọn nhãn từ số điểm",
        questions: [
          {
            q: "Hàm kiểm tra `points >= 8`, rồi `points >= 4`, còn lại trả `SPARK`. Lời gọi `effect_for(4)` trả nhãn nào?",
            a: ["GLOW", "BURST", "SPARK"],
            correct: 0,
          },
          {
            q: "Nếu đặt điều kiện `points >= 4` trước `points >= 8`, lời gọi `effect_for(10)` sẽ trả kết quả nào và vì sao?",
            a: ["GLOW, vì điều kiện từ 4 trở lên đúng trước", "BURST, vì Python luôn chọn mốc lớn hơn", "Cả GLOW và BURST"],
            correct: 0,
          },
        ],
      },
    },

    // Cụm 3: dựng dictionary và xử lý list quà mẫu.
    {
      npc: "Bây giờ tụi mình gom dữ liệu của một lần gửi quà vào cùng một dictionary. Hàm `make_gift(...)` nhận tên người gửi, tên quà và số điểm, rồi trả một bản ghi có bốn khóa: `sender`, `gift`, `points` và `effect`.",
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    return {
        "sender": clean_text(sender),
        "gift": clean_text(gift_name),
        "points": points,
        "effect": effect_for(points),
    }

record = make_gift("  an", "star  ", 6)
say(record["sender"] + ":" + record["gift"] + ":" + record["effect"])
`,
      label: "make_gift_demo.py",
      note: "RUN KIỂM CHỨNG\nTên người gửi, tên quà và 6 điểm được gán sẵn; không có INPUT đọc từ bên ngoài. PROCESS là gọi `make_gift(...)` để tạo dictionary hoàn chỉnh. OUTPUT đúng là `AN:STAR:GLOW`.",
      expectOut: /^AN:STAR:GLOW$/,
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    return {
        "sender": clean_text(sender),
        "gift": clean_text(gift_name),
        "points": points,
        "effect": effect_for(points),
    }

record = make_gift("  an", "star  ", 6)
say(record["sender"] + ":" + record["gift"] + ":" + record["effect"])
`,
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    # Lượt của bạn: trả một dictionary có đủ bốn khóa của bản ghi quà tặng
    return {"sender": clean_text(sender)}

record = make_gift(" binh ", " flower ", 9)
say(record["sender"] + ":" + record["gift"] + ":" + record["effect"])
`,
      label: "make_gift_record.py",
      note: "ĐỀ BÀI\nBa giá trị `\" binh \"`, `\" flower \"` và 9 điểm được gán sẵn; không có INPUT đọc từ bên ngoài. Hoàn thành dictionary mà `make_gift(...)` trả về: tên người gửi và tên quà phải được làm sạch, điểm được giữ nguyên, nhãn hiệu ứng lấy từ `effect_for(points)`. OUTPUT đúng là `BINH:FLOWER:BURST`.",
      expectOut: /^BINH:FLOWER:BURST$/,
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    return {
        "sender": clean_text(sender),
        "gift": clean_text(gift_name),
        "points": points,
        "effect": effect_for(points),
    }

record = make_gift(" binh ", " flower ", 9)
say(record["sender"] + ":" + record["gift"] + ":" + record["effect"])
`,
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    return {
        "sender": clean_text(sender),
        "gift": clean_text(gift_name),
        "points": points,
        "effect": effect_for(points),
    }

gifts = [
    make_gift("  mai", "star", 2),
    make_gift("nam  ", "flower", 5),
    make_gift("  linh  ", "crown", 9),
]

for item in gifts:
    say(item["sender"] + ":" + item["gift"] + ":" + item["effect"])
`,
      label: "process_gift_list.py",
      note: "RUN KIỂM CHỨNG\nList có ba lần gửi quà được gán sẵn; không có INPUT đọc từ bên ngoài. PROCESS là dùng `for` để đọc từng dictionary đã được `make_gift(...)` chuẩn bị. OUTPUT có ba dòng: `MAI:STAR:SPARK`, `NAM:FLOWER:GLOW`, `LINH:CROWN:BURST`.",
      expectOut: { all: [{ minLines: 3 }, /^MAI:STAR:SPARK$/, /^NAM:FLOWER:GLOW$/, /^LINH:CROWN:BURST$/] },
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def effect_for(points):
    if points >= 8:
        return "BURST"
    elif points >= 4:
        return "GLOW"
    else:
        return "SPARK"

def make_gift(sender, gift_name, points):
    return {
        "sender": clean_text(sender),
        "gift": clean_text(gift_name),
        "points": points,
        "effect": effect_for(points),
    }

gifts = [
    make_gift("  mai", "star", 2),
    make_gift("nam  ", "flower", 5),
    make_gift("  linh  ", "crown", 9),
]

for item in gifts:
    say(item["sender"] + ":" + item["gift"] + ":" + item["effect"])
`,
    },
    {
      checkpoint: {
        text: "Một lần gửi quà có thể được lưu bằng dictionary với các khóa cố định. Hàm `make_gift(...)` tạo từng dictionary; vòng `for` xử lý lần lượt các dictionary trong list.",
      },
    },
    {
      quiz: {
        title: "Tạo và xử lý bản ghi quà tặng",
        questions: [
          {
            q: "Hàm `make_gift(\" AN \" , \"star\", 6)` trả dictionary có khóa `sender` đã qua `clean_text(...)` và khóa `effect` lấy từ `effect_for(6)`. Hai giá trị đó là gì?",
            a: ['`"AN"` và `"GLOW"`', '`" AN "` và `"BURST"`', '`"STAR"` và `6`'],
            correct: 0,
          },
          {
            q: "Trong đoạn `for item in gifts: say(item[\"gift\"])`, vì sao dùng `item[\"gift\"]` thay vì luôn dùng `gifts[0][\"gift\"]`?",
            a: ["Để mỗi lượt đọc tên quà trong dictionary hiện tại", "Để vòng lặp chỉ chạy một lần", "Để mọi dictionary đổi thành phần tử đầu tiên"],
            correct: 0,
          },
        ],
      },
    },

    // Cụm 4: tìm một bản ghi quà tặng.
    {
      npc: "Bộ phận cuối cùng tìm một món quà trong list. Hàm làm sạch tên cần tìm, quét từng dictionary, rồi `return` ngay dictionary có khóa `gift` khớp. Nếu đã quét hết mà chưa thấy, hàm trả `None`.",
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def find_gift(gifts, target):
    wanted = clean_text(target)
    for item in gifts:
        if item["gift"] == wanted:
            return item
    return None

gifts = [
    {"sender": "MAI", "gift": "STAR", "points": 2, "effect": "SPARK"},
    {"sender": "NAM", "gift": "FLOWER", "points": 5, "effect": "GLOW"},
]

found = find_gift(gifts, " flower ")
if found == None:
    say("NOT FOUND")
else:
    say(found["sender"] + ":" + found["effect"])
`,
      label: "find_gift_demo.py",
      note: "RUN KIỂM CHỨNG\nList quà và tên `\" flower \"` được gán sẵn; không có INPUT đọc từ bên ngoài. PROCESS là gọi `find_gift(...)` để tìm dictionary có tên quà khớp. OUTPUT đúng là `NAM:GLOW`.",
      expectOut: /^NAM:GLOW$/,
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def find_gift(gifts, target):
    wanted = clean_text(target)
    for item in gifts:
        if item["gift"] == wanted:
            return item
    return None

gifts = [
    {"sender": "MAI", "gift": "STAR", "points": 2, "effect": "SPARK"},
    {"sender": "NAM", "gift": "FLOWER", "points": 5, "effect": "GLOW"},
]

found = find_gift(gifts, " flower ")
if found == None:
    say("NOT FOUND")
else:
    say(found["sender"] + ":" + found["effect"])
`,
    },
    {
      code: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def find_gift(gifts, target):
    wanted = clean_text(target)
    for item in gifts:
        if item["gift"] == wanted:
            # Lượt của bạn: đưa dictionary đang khớp ra ngoài hàm
            return None
    return None

gifts = [
    {"sender": "LAN", "gift": "FLOWER", "points": 6, "effect": "GLOW"},
    {"sender": "BO", "gift": "CROWN", "points": 9, "effect": "BURST"},
]

found = find_gift(gifts, "flower")
if found == None:
    say("NOT FOUND")
else:
    say(found["sender"] + ":" + found["effect"])
`,
      label: "find_gift_fix.py",
      note: "ĐỀ BÀI\nList quà và tên `\"flower\"` được gán sẵn; không có INPUT đọc từ bên ngoài. Nhánh tìm thấy đang trả sai giá trị. Sửa dòng `return` để hàm đưa dictionary đang khớp ra ngoài. OUTPUT đúng là `LAN:GLOW`.",
      expectOut: /^LAN:GLOW$/,
      solution: `from old_computer import say

def clean_text(text):
    return text.strip().upper()

def find_gift(gifts, target):
    wanted = clean_text(target)
    for item in gifts:
        if item["gift"] == wanted:
            return item
    return None

gifts = [
    {"sender": "LAN", "gift": "FLOWER", "points": 6, "effect": "GLOW"},
    {"sender": "BO", "gift": "CROWN", "points": 9, "effect": "BURST"},
]

found = find_gift(gifts, "flower")
if found == None:
    say("NOT FOUND")
else:
    say(found["sender"] + ":" + found["effect"])
`,
    },
    {
      checkpoint: {
        text: "Hàm tìm kiếm có thể `return` dictionary ngay khi khóa `gift` khớp. Dòng `return None` sau vòng `for` chỉ chạy khi mọi dictionary đều đã được kiểm tra mà chưa tìm thấy món quà.",
      },
    },
    {
      quiz: {
        title: "Tìm một bản ghi trong list",
        questions: [
          {
            q: "Hàm `find_gift(...)` gặp dictionary có `item[\"gift\"] == wanted` ở lượt thứ hai rồi chạy `return item`. Chương trình làm gì tiếp theo?",
            a: ["Trả dictionary đó và kết thúc lần gọi hàm", "Tiếp tục quét rồi trả thêm dictionary khác", "Xóa dictionary khỏi list"],
            correct: 0,
          },
          {
            q: "Một list không có món quà cần tìm. Vì sao `return None` được đặt sau vòng `for`, không đặt trong nhánh `else` của lần so sánh đầu tiên?",
            a: ["Để chỉ báo không thấy sau khi đã kiểm tra mọi dictionary", "Để chỉ kiểm tra dictionary đầu tiên", "Để `None` trở thành tên quà"],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "◆",
        name: "HUY HIỆU NGƯỜI CHUẨN BỊ DỮ LIỆU",
        blurb: "làm sạch tên, chọn nhãn hiệu ứng, tạo dictionary và xử lý list quà tặng mô phỏng",
        badge: true,
        badgeId: "huy_hieu_nguoi_chuan_bi_du_lieu",
      },
    },
    {
      npc: "Trạm đã chuẩn bị xong dữ liệu mẫu. Lò Rèn sẽ kiểm tra xem bạn có lần theo được một bản ghi từ chuỗi ban đầu, qua các hàm xử lý, đến dictionary trong list hay không.",
    },
    {
      forge: {
        quiz: [
          {
            q: "Đọc đoạn code:\n```python\ndef clean_text(text):\n    return text.strip().upper()\n\nresult = clean_text(\"  crown \" )\n```\n`result` giữ giá trị nào?",
            a: ['`"CROWN"`', '`"  crown "`', '`"crown"`'],
            correct: 0,
          },
          {
            q: "Hàm `effect_for` kiểm tra từ 8 điểm trả `BURST`, từ 4 điểm trả `GLOW`, còn lại trả `SPARK`. Lời gọi `effect_for(7)` trả gì?",
            a: ["GLOW", "BURST", "SPARK"],
            correct: 0,
          },
          {
            q: "Dictionary `record` cần giữ nhãn do `effect_for(points)` tính. Dòng gán nào đặt kết quả vào đúng khóa?",
            a: ['`record["effect"] = effect_for(points)`', '`effect_for[record] = points`', '`record[points] == "effect"`'],
            correct: 0,
          },
          {
            q: "Trong `for item in gifts`, biểu thức nào đọc tên người gửi của dictionary đang được xử lý?",
            a: ['`item["sender"]`', '`gifts["sender"]`', '`sender[item]`'],
            correct: 0,
          },
          {
            q: "Hàm tìm thấy món quà có tên khớp và cần trả toàn bộ bản ghi để phần sau đọc cả `sender` lẫn `effect`. Dòng nào phù hợp?",
            a: ["`return item`", '`return item["gift"]`', "`return None`"],
            correct: 0,
          },
          {
            q: "Một chương trình cần đổi mốc `BURST` từ 8 thành 10 điểm. Vì sao đặt quy tắc trong `effect_for(points)` giúp việc sửa an toàn hơn?",
            a: ["Chỉ cần sửa mốc trong một hàm; mọi nơi gọi hàm sẽ dùng quy tắc mới", "Mỗi dictionary tự đổi mốc mà không cần chạy code", "Không cần kiểm tra OUTPUT sau khi sửa"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "THE BROKEN MESSENGER trộn lẫn người gửi, tên quà và nhãn hiệu ứng. Chương trình của bạn tách việc này thành các hàm làm sạch, chọn nhãn, tạo dictionary, xử lý list và tìm bản ghi.",
    },
    {
      boss: { name: "THE BROKEN MESSENGER", art: "assets/mirror-wraith.webp", glyph: "◆", ko: true },
    },
    {
      npc: "Dữ liệu quà tặng mô phỏng đã sẵn sàng. Node này chưa tạo hiệu ứng; nó chuẩn bị dữ liệu để bài sau quyết định nội dung xuất hiện trên màn hình.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG GIFT DATA PACKET",
    theme: {
      motion: "orbit",
      palette: { core: "#f4c85a", dust: "#78b2a5", rune: "#d9eee5" },
      glyphs: "gift sender points effect return dict list",
    },
  },
};
