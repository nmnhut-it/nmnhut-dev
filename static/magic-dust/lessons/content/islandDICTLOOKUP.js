// Bonus practice after node20. This side island only reuses dictionary
// reads, updates, key membership checks, functions, and return values.
export default {
  index: -1,
  sideIslandId: "islandDICTLOOKUP",
  title: "Trạm Tra Cứu Dữ Liệu",
  subtitle: "luyện đọc đúng key, cập nhật value và kiểm tra key trước khi dùng",
  bundle: { art: "assets/rookie-bundle.webp", name: "BỘ THẺ TRA CỨU" },
  machine: {
    art: "assets/future-machine.webp",
    name: "MÁY TRA CỨU",
    blurb: "một trạm phụ để tìm và cập nhật đúng dữ liệu bằng key",
  },
  modules: { old_computer: "../py/old_computer/__init__.py" },
  cells: [
    {
      intro: {
        title: "✦ TRẠM TRA CỨU DỮ LIỆU ✦",
        hook: "Mỗi dictionary giống một phiếu dữ liệu có nhiều mục. Bạn sẽ dùng đúng key để đọc, cập nhật và kiểm tra từng mục.",
        art: "assets/future-machine.webp",
      },
    },
    {
      npc: "Key cho máy biết chính xác value nào cần đọc. Nếu cần trạng thái của cổng, mình đọc key `status`, không đọc key `name` chỉ vì nó đứng trước.",
    },
    {
      code: `from old_computer import say

portal = {
    "name": "Moon Gate",
    "status": "OPEN",
    "color": "blue"
}

say(portal["name"])  # Đổi key để đọc trạng thái
`,
      label: "read_status_key.py",
      note: "ĐỀ BÀI\nDictionary `portal` được cho sẵn; không có INPUT từ ngoài chương trình. Đổi key trong `portal[...]` để đọc value đi cùng key `status`. OUTPUT đúng là `OPEN`.",
      expectOut: /^OPEN$/,
      solution: `from old_computer import say

portal = {
    "name": "Moon Gate",
    "status": "OPEN",
    "color": "blue"
}

say(portal["status"])
`,
    },
    {
      checkpoint: {
        text: "Mẫu `data[key]` đọc value đi cùng key. Trong `portal[\"status\"]`, key `status` dẫn máy tới value `OPEN`.",
      },
    },
    {
      quiz: {
        title: "Đọc đúng mục dữ liệu",
        questions: [
          {
            q: "Với `gift = {\"name\": \"STAR\", \"points\": 5}`, dòng nào đọc số điểm của món quà?",
            a: ["`gift[\"points\"]`", "`gift[\"name\"]`", "`gift[5]`"],
            correct: 0,
          },
          {
            q: "Đọc đoạn code:\n```python\nuser = {\"name\": \"Mira\", \"role\": \"HOST\"}\nsay(user[\"role\"])\n```\nOUTPUT là gì?",
            a: ["HOST", "Mira", "role"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Muốn thay đổi một value đã có, mình gán giá trị mới vào đúng key. Các cặp dữ liệu khác vẫn giữ nguyên.",
    },
    {
      code: `from old_computer import say, say_num

gift = {
    "name": "COMET",
    "points": 4,
    "status": "WAIT"
}

gift["name"] = 9  # Sửa để cập nhật đúng key

say(gift["name"])
say_num(gift["points"])
`,
      label: "update_points_key.py",
      note: "ĐỀ BÀI\nDictionary `gift` được cho sẵn; không có INPUT từ ngoài chương trình. Quà COMET cần đổi điểm từ 4 thành 9. Sửa key ở dòng gán để PROCESS chỉ cập nhật `points`. OUTPUT phải là `COMET` rồi `9` trên hai dòng.",
      expectOut: { all: [{ minLines: 2 }, /^COMET$/, /^9$/] },
      solution: `from old_computer import say, say_num

gift = {
    "name": "COMET",
    "points": 4,
    "status": "WAIT"
}

gift["points"] = 9

say(gift["name"])
say_num(gift["points"])
`,
    },
    {
      checkpoint: {
        text: "Dòng `data[key] = new_value` cập nhật value của đúng key đó. Ví dụ, `gift[\"points\"] = 9` đổi điểm nhưng không đổi tên quà.",
      },
    },
    {
      quiz: {
        title: "Cập nhật đúng key",
        questions: [
          {
            q: "Với `card = {\"name\": \"Pip\", \"power\": 3}`, cần đổi sức mạnh thành 7 mà vẫn giữ tên Pip. Dòng nào đúng?",
            a: ["`card[\"power\"] = 7`", "`card[\"name\"] = 7`", "`card[\"Pip\"] = 7`"],
            correct: 0,
          },
          {
            q: "Sau `door = {\"status\": \"CLOSED\", \"color\": \"gold\"}` và `door[\"status\"] = \"OPEN\"`, value của key `color` là gì?",
            a: ["gold", "OPEN", "CLOSED"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Nếu chưa chắc dictionary có một key, hãy kiểm tra bằng `in` trước khi đọc. Cách này giúp chương trình chọn OUTPUT phù hợp thay vì đọc một key không tồn tại.",
    },
    {
      code: `from old_computer import say

profile = {
    "name": "Bo",
    "sticker": "STAR"
}

if "effect" in profile:  # Đổi key cần kiểm tra
    say(profile["sticker"])
else:
    say("CHUA CO")
`,
      label: "check_key_before_read.py",
      note: "ĐỀ BÀI\nDictionary `profile` được cho sẵn; không có INPUT từ ngoài chương trình. Đổi key trong điều kiện để kiểm tra key `sticker`. Nếu key có mặt, PROCESS đọc value của key đó. OUTPUT đúng là `STAR`.",
      expectOut: /^STAR$/,
      solution: `from old_computer import say

profile = {
    "name": "Bo",
    "sticker": "STAR"
}

if "sticker" in profile:
    say(profile["sticker"])
else:
    say("CHUA CO")
`,
    },
    {
      checkpoint: {
        text: "Biểu thức `key in data` cho kết quả `True` khi dictionary có key đó. Mình có thể kiểm tra trong `if` rồi mới dùng `data[key]`.",
      },
    },
    {
      quiz: {
        title: "Kiểm tra trước khi đọc",
        questions: [
          {
            q: "Với `gift = {\"name\": \"HEART\"}`, biểu thức `\"color\" in gift` cho kết quả nào?",
            a: ["False", "True", "HEART"],
            correct: 0,
          },
          {
            q: "Một hồ sơ có thể thiếu key `effect`. Mẫu nào kiểm tra an toàn trước khi đọc `profile[\"effect\"]`?",
            a: ["`if \"effect\" in profile:`", "`if profile == \"effect\":`", "`if \"profile\" in effect:`"],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Dictionary cũng có thể là kết quả của một hàm. Hàm nhận các giá trị qua tham số, tạo dictionary rồi `return` cả nhóm dữ liệu về chỗ gọi.",
    },
    {
      code: `from old_computer import say, say_num

def make_gift(name, points):
    gift = {
        "name": name,
        "points": 0  # Sửa value để dùng tham số points
    }
    return gift

result = make_gift("HEART", 6)
say(result["name"])
say_num(result["points"])
`,
      label: "return_gift_dictionary.py",
      note: "ĐỀ BÀI\nTên `HEART` và điểm `6` được cho sẵn qua hai đối số; không có INPUT từ ngoài chương trình. Trong hàm, gán tham số `points` làm value của key `points`, rồi trả dictionary về chỗ gọi. OUTPUT phải là `HEART` rồi `6`.",
      expectOut: { all: [{ minLines: 2 }, /^HEART$/, /^6$/] },
      solution: `from old_computer import say, say_num

def make_gift(name, points):
    gift = {
        "name": name,
        "points": points
    }
    return gift

result = make_gift("HEART", 6)
say(result["name"])
say_num(result["points"])
`,
    },
    {
      checkpoint: {
        text: "Một hàm có thể tạo rồi `return` cả dictionary. Chỗ gọi lưu dictionary vào biến và tiếp tục đọc từng value bằng key.",
      },
    },
    {
      quiz: {
        title: "Dictionary được trả về",
        questions: [
          {
            q: "Đọc đoạn code:\n```python\ndef make_card(name):\n    return {\"name\": name, \"ready\": True}\n\ncard = make_card(\"Mira\")\n```\nBiểu thức nào đọc value `True` từ `card`?",
            a: ["`card[\"ready\"]`", "`card[\"Mira\"]`", "`card[True]`"],
            correct: 0,
          },
          {
            q: "Một hàm nhận `name` và `points`, rồi cần trả cả hai trong một dictionary. Phần thân nào dùng đúng hai tham số?",
            a: ["`return {\"name\": name, \"points\": points}`", "`return {name: \"name\", points: \"points\"}`", "`say({\"name\": name})`"],
            correct: 0,
          },
        ],
      },
    },
    {
      remember: "Dictionary giữ các cặp key-value. Dùng `data[key]` để đọc, `data[key] = value` để cập nhật và `key in data` để kiểm tra trước khi đọc. Một hàm cũng có thể tạo rồi trả về cả dictionary.",
    },
  ],
};
