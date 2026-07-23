export default {
  index: 20,
  title: "Dictionaries: Dữ Liệu Có Tên",
  subtitle: "gom dữ liệu theo cặp key-value, đọc và cập nhật bằng key, rồi kiểm tra key bằng in",
  bundle: { art: "assets/future-packet.webp", name: "KEY-VALUE PACKET" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY GẮN NHÃN DỮ LIỆU",
    blurb: "một cỗ máy cho mỗi giá trị một key rõ ràng để gọi đúng dữ liệu khi cần",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    camera_charm: "../py/camera_charm/__init__.py",
  },
  cells: [
    {
      quiz: {
        title: "Ôn return trước khi mở gói dữ liệu",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef double(number):\n    return number * 2\n\nresult = double(4)\nsay_num(result)\n```\nMáy in gì?",
            a: ["8", "4", "number * 2"],
            correct: 0,
          },
          {
            q: "Trong đoạn code này, dòng nào đưa kết quả của hàm ra chỗ gọi?\n```python\ndef make_name(text):\n    clean = text.strip()\n    return clean\n```",
            a: ["`return clean`", "`clean = text.strip()`", "`def make_name(text):`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Một list giữ dữ liệu theo vị trí: `card[0]`, `card[1]`, `card[2]`. Khi thẻ có tên, sức mạnh và màu, các chỉ số này khó đọc. Dictionary giúp mỗi giá trị đi cùng một khóa có ý nghĩa.",
    },
    {
      npc: "Dictionary gồm các cặp khóa và giá trị. Trong `card = {\"name\": \"Pip\", \"power\": 7}`, `\"name\"` là khóa, còn `\"Pip\"` là giá trị. Dấu `:` ngăn hai phần của mỗi cặp.",
    },
    {
      code: `from old_computer import say, say_num

card = {
    "name": "Pip",
    "power": 7,
    "color": "cyan"
}

say(card["name"])
say_num(card["power"])
say(card["color"])
`,
      label: "dictionary_read_demo.py",
      note: "RUN KIỂM CHỨNG\nDữ liệu cho sẵn là dictionary `card`; không có INPUT từ ngoài chương trình. Mỗi cặp gồm một key và value. Đoạn code đọc ba value bằng đúng key. OUTPUT lần lượt là `Pip`, `7`, `cyan`.",
      expectOut: { all: [{ minLines: 3 }, /^Pip$/, /^7$/, /^cyan$/] },
      solution: `from old_computer import say, say_num

card = {
    "name": "Pip",
    "power": 7,
    "color": "cyan"
}

say(card["name"])
say_num(card["power"])
say(card["color"])
`,
    },
    {
      code: `from old_computer import say

portal = {
    "name": "North Gate",
    "status": "OPEN"
}

say(portal["name"])   # Đổi key để đọc trạng thái của cổng
`,
      label: "read_key_fix.py",
      note: "ĐỀ BÀI\nDictionary `portal` được cho sẵn; không có INPUT từ ngoài chương trình. Đổi key trong lệnh `say(...)` để đọc value đi cùng key `status`. OUTPUT phải là `OPEN`.",
      expectOut: /^OPEN$/,
      solution: `from old_computer import say

portal = {
    "name": "North Gate",
    "status": "OPEN"
}

say(portal["status"])
`,
    },
    {
      checkpoint: {
        text: "Dictionary giữ các cặp key-value trong `{}`. Mẫu `data[key]` đọc value đi cùng key đó; ví dụ `card[\"name\"]` đọc value của key `name`.",
      },
    },
    {
      quiz: {
        title: "Đọc dữ liệu bằng key",
        questions: [
          {
            q: "Với `pet = {\"name\": \"Mira\", \"level\": 3}`, dòng `say(pet[\"name\"])` in gì?",
            a: ["Mira", "name", "3"],
            correct: 0,
          },
          {
            q: "Với `door = {\"color\": \"gold\", \"open\": True}`, dòng nào đọc value `gold`?",
            a: ['`door["color"]`', '`door["gold"]`', '`door[0]`'],
            correct: 0,
          },
          {
            q: "Trong `spell = {\"power\": 9}`, phần nào là key?",
            a: ['`"power"`', "`9`", "Toàn bộ dictionary"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Đọc một giá trị không làm dictionary thay đổi. Muốn cập nhật, gán giá trị mới vào đúng khóa: `card[\"power\"] = 10`. Khóa `power` vẫn còn, còn giá trị của nó đổi từ 7 thành 10.",
    },
    {
      code: `from old_computer import say_num

card = {
    "name": "Pip",
    "power": 7
}

say_num(card["power"])
card["power"] = 10
say_num(card["power"])
`,
      label: "dictionary_update_demo.py",
      note: "RUN KIỂM CHỨNG\nDictionary `card` được cho sẵn với `power` bằng 7; không có INPUT từ ngoài chương trình. Đoạn code đọc value cũ, gán value 10 vào cùng key, rồi đọc lại. OUTPUT là `7` và `10` trên hai dòng.",
      expectOut: { all: [{ minLines: 2 }, /^7$/, /^10$/] },
      solution: `from old_computer import say_num

card = {
    "name": "Pip",
    "power": 7
}

say_num(card["power"])
card["power"] = 10
say_num(card["power"])
`,
    },
    {
      code: `from old_computer import say

door = {
    "name": "Moon Gate",
    "status": "LOCKED"
}

door["name"] = "OPEN"   # Đổi key để cập nhật đúng value
say(door["status"])
`,
      label: "update_value_fix.py",
      note: "ĐỀ BÀI\nDictionary `door` được cho sẵn; không có INPUT từ ngoài chương trình. Cổng cần đổi trạng thái, vì vậy hãy gán `OPEN` vào key `status` thay vì key `name`. OUTPUT phải là `OPEN`.",
      expectOut: /^OPEN$/,
      solution: `from old_computer import say

door = {
    "name": "Moon Gate",
    "status": "LOCKED"
}

door["status"] = "OPEN"
say(door["status"])
`,
    },
    {
      checkpoint: {
        text: "Gán `data[key] = new_value` cập nhật value đi cùng key đó. Các cặp dùng key khác không tự thay đổi.",
      },
    },
    {
      quiz: {
        title: "Cập nhật đúng cặp dữ liệu",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\nplayer = {\"score\": 4, \"lives\": 3}\nplayer[\"score\"] = 9\nsay_num(player[\"score\"])\n```\nMáy in gì?",
            a: ["9", "4", "3"],
            correct: 0,
          },
          {
            q: "Với `lamp = {\"color\": \"blue\", \"status\": \"off\"}`, dòng nào chỉ đổi trạng thái thành `on`?",
            a: ['`lamp["status"] = "on"`', '`lamp["color"] = "on"`', '`lamp = "on"`'],
            correct: 0,
          },
          {
            q: "Sau `player[\"score\"] = 12`, điều gì xảy ra với value của key `lives` trong cùng dictionary?",
            a: ["Không đổi", "Tự đổi thành 12", "Bị xóa"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nếu đọc một key không tồn tại bằng `data[key]`, Python sẽ báo lỗi. Trước khi đọc, mình có thể hỏi `\"key\" in data`. Kết quả là `True` khi dictionary có key đó và `False` khi không có.",
    },
    {
      code: `from old_computer import say

chest = {
    "key": "silver",
    "coins": 12
}

say("key" in chest)
say("map" in chest)

if "key" in chest:
    say(chest["key"])
`,
      label: "key_membership_demo.py",
      note: "RUN KIỂM CHỨNG\nDictionary `chest` được cho sẵn; không có INPUT từ ngoài chương trình. `in` kiểm tra key trước khi nhánh `if` đọc value. OUTPUT lần lượt có `True`, `False`, rồi `silver`.",
      expectOut: { all: [{ minLines: 3 }, /^True$/, /^False$/, /^silver$/] },
      solution: `from old_computer import say

chest = {
    "key": "silver",
    "coins": 12
}

say("key" in chest)
say("map" in chest)

if "key" in chest:
    say(chest["key"])
`,
    },
    {
      code: `from old_computer import say

bag = {
    "map": "north",
    "torch": "ready"
}

if "key" in bag:   # Đổi key cần kiểm tra
    say(bag["map"])
else:
    say("missing")
`,
      label: "membership_fix.py",
      note: "ĐỀ BÀI\nDictionary `bag` được cho sẵn và không có INPUT từ ngoài chương trình. Đổi key trong điều kiện để kiểm tra key `map`; nếu key có mặt, nhánh đúng đọc value của nó. OUTPUT phải là `north`.",
      expectOut: /^north$/,
      solution: `from old_computer import say

bag = {
    "map": "north",
    "torch": "ready"
}

if "map" in bag:
    say(bag["map"])
else:
    say("missing")
`,
    },
    {
      checkpoint: {
        text: "Mẫu `key in data` kiểm tra dictionary có key đó hay không. Kết quả là `True` hoặc `False`, nên có thể dùng trong `if` trước khi đọc `data[key]`.",
      },
    },
    {
      quiz: {
        title: "Kiểm tra key trước khi đọc",
        questions: [
          {
            q: "Với `box = {\"gem\": \"red\"}`, biểu thức `\"gem\" in box` cho kết quả nào?",
            a: ["`True`", "`False`", '`"red"`'],
            correct: 0,
          },
          {
            q: "Với `box = {\"gem\": \"red\"}`, biểu thức `\"red\" in box` cho kết quả nào?",
            a: ["`False`, vì `red` là value chứ không phải key", "`True`, vì `red` xuất hiện trong dictionary", "Máy đổi `red` thành key"],
            correct: 0,
          },
          {
            q: "Đoạn nào kiểm tra an toàn trước khi đọc key `spell`?",
            a: [
              '```python\nif "spell" in book:\n    say(book["spell"])\n```',
              '```python\nif book["spell"]:\n    say("spell")\n```',
              '```python\nif "book" in spell:\n    say(book)\n```',
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Giờ ghép với `return` từ node trước. Một hàm có thể tạo dictionary rồi đưa cả nhóm dữ liệu ra chỗ gọi. Người gọi giữ dictionary trong một biến, sau đó đọc hoặc cập nhật từng value bằng key.",
    },
    {
      code: `from old_computer import say, say_num

def make_card(name, power):
    card = {
        "name": name,
        "power": power
    }
    return card

hero = make_card("Mira", 5)
hero["power"] = 8

say(hero["name"])
say_num(hero["power"])
`,
      label: "return_dictionary_demo.py",
      note: "RUN KIỂM CHỨNG\nHai giá trị `Mira` và `5` được cho sẵn khi gọi hàm; không có INPUT từ ngoài chương trình. Hàm trả về một dictionary, rồi code cập nhật key `power`. OUTPUT là `Mira` và `8` trên hai dòng.",
      expectOut: { all: [{ minLines: 2 }, /^Mira$/, /^8$/] },
      solution: `from old_computer import say, say_num

def make_card(name, power):
    card = {
        "name": name,
        "power": power
    }
    return card

hero = make_card("Mira", 5)
hero["power"] = 8

say(hero["name"])
say_num(hero["power"])
`,
    },
    {
      code: `from old_computer import say, say_num

def make_portal(name, level):
    portal = {
        "name": name,
        "level": 0
    }
    return portal

gate = make_portal("Sun Gate", 6)
say(gate["level"])   # Đổi lệnh in để dùng đúng kiểu dữ liệu
`,
      label: "build_portal_record.py",
      note: "ĐỀ BÀI\nTên `Sun Gate` và level `6` được cho sẵn khi gọi hàm; không có INPUT từ ngoài chương trình. Sửa value của key `level` trong dictionary để lấy tham số `level`, rồi dùng `say_num(...)` đọc level từ `gate`. OUTPUT phải là `6`.",
      expectOut: /^6$/,
      solution: `from old_computer import say_num

def make_portal(name, level):
    portal = {
        "name": name,
        "level": level
    }
    return portal

gate = make_portal("Sun Gate", 6)
say_num(gate["level"])
`,
    },
    {
      checkpoint: {
        text: "Hàm có thể `return` một dictionary. Chỗ gọi nhận cả nhóm key-value trong một biến, rồi dùng `data[key]` để đọc hoặc cập nhật từng value.",
      },
    },
    {
      quiz: {
        title: "Dictionary đi qua return",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef make_pet():\n    return {\"name\": \"Bo\", \"level\": 2}\n\npet = make_pet()\nsay(pet[\"name\"])\n```\nMáy in gì?",
            a: ["Bo", "name", "2"],
            correct: 0,
          },
          {
            q: "Sau `card = make_card(\"Pip\", 4)`, dòng nào cập nhật key `power` thành 7?",
            a: ['`card["power"] = 7`', '`card[7] = "power"`', '`power["card"] = 7`'],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "{k:v}",
        name: "HUY HIỆU KEY-VALUE",
        blurb: "tạo dictionary bằng các cặp key-value, đọc và cập nhật bằng key, kiểm tra key với `in`, rồi dùng `return` để đưa dictionary ra chỗ gọi",
        badge: true,
        badgeId: "huy_hieu_key_value",
      },
    },
    {
      npc: "Trước khi đối mặt THE LOST KEY WRAITH, ghé LÒ RÈN nhé. Các câu hỏi chỉ dùng những thao tác bạn vừa luyện: đọc, cập nhật, kiểm tra key, và nhận dictionary từ một hàm.",
    },
    {
      forge: {
        quiz: [
          {
            q: "Với `hero = {\"name\": \"Mira\", \"power\": 8}`, dòng nào đọc tên của nhân vật?",
            a: ['`hero["name"]`', '`hero["Mira"]`', "`hero[0]`"],
            correct: 0,
          },
          {
            q: "Với `door = {\"status\": \"locked\"}`, dòng nào cập nhật trạng thái thành `open`?",
            a: ['`door["status"] = "open"`', '`door["open"] = "status"`', '`door = "status"`'],
            correct: 0,
          },
          {
            q: "Với `bag = {\"map\": \"north\"}`, biểu thức nào cho kết quả `True`?",
            a: ['`"map" in bag`', '`"north" in bag`', '`"bag" in map`'],
            correct: 0,
          },
          {
            q: "Tại sao nên kiểm tra `\"spell\" in book` trước khi đọc `book[\"spell\"]`?",
            a: ["Để biết key có tồn tại và tránh đọc một key không có", "Để biến value thành key", "Để dictionary tự sắp xếp"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\ndata = {\"score\": 3}\ndata[\"score\"] = 5\nsay_num(data[\"score\"])\n```\nOUTPUT là gì?",
            a: ["5", "3", "score"],
            correct: 0,
          },
          {
            q: "Một hàm `return {\"name\": name, \"level\": level}`. Sau khi gọi `player = make_player(\"Bo\", 2)`, dòng nào đọc level?",
            a: ['`player["level"]`', '`player["2"]`', '`level["player"]`'],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "THE LOST KEY WRAITH giấu value sau những key sai. Bạn đã biết đọc đúng key, cập nhật đúng cặp, và kiểm tra key trước khi dùng. Rèn BOM MẬT NGỮ rồi kết thúc nó nhé.",
    },
    {
      boss: { name: "THE LOST KEY WRAITH", art: "assets/mirror-wraith.webp", glyph: "{k:v}", ko: true },
    },
    {
      npc: "MÁY GẮN NHÃN DỮ LIỆU đã hoạt động. Một nhân vật, cánh cổng hay món đồ có thể giữ nhiều thông tin trong một dictionary. Mỗi giá trị được tìm bằng một khóa có ý nghĩa rõ ràng.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "GIƠ TAY NIÊM PHONG KEY-VALUE PACKET",
    theme: {
      motion: "orbit",
      palette: { core: "#78b2a5", dust: "#d9eee5", rune: "#f4c85a" },
      glyphs: "dictionary key value return",
    },
  },
};
