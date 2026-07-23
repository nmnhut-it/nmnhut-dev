import { dsaNode } from "./dsa-builders.js";

const cells = [
  { intro: { title: "✦ DỰ ÁN BẢNG XẾP HẠNG ✦", hook: "Một bảng xếp hạng thật phải xếp điểm cao trước, xử lý điểm bằng nhau theo luật rõ ràng và trả lời được cả tên có mặt lẫn tên vắng mặt.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn merge sort", questions: [
    { q: "Merge sort đã trả hai nửa tăng dần `[2, 8]` và `[3, 5]`. Kết quả merge nào đúng?", a: ["`[2, 3, 5, 8]`", "`[2, 8, 3, 5]`", "`[3, 5, 2, 8]`"], correct: 0 },
    { q: "Vì sao base case `len(values) <= 1` cũng cần nhận list rỗng?", a: ["Để list rỗng trả ngay và không gọi recursion mãi", "Để thêm một số 0 vào list", "Để binary search tự chạy"], correct: 0 },
  ] } },
  { npc: "Dự án dùng luật xếp đầy đủ: điểm cao đứng trước; nếu điểm bằng nhau, tên theo thứ tự chữ cái. Hàm so sánh phải xử lý cả hai phần để kết quả không phụ thuộc dữ liệu ban đầu." },
  { code: `def comes_before(left, right):
    if left["score"] != right["score"]:
        return left["score"] > right["score"]
    return left["name"] < right["name"]

an = {"name": "An", "score": 10}
bo = {"name": "Bo", "score": 10}
mira = {"name": "Mira", "score": 8}

print(comes_before(an, bo))
print(comes_before(an, mira))
print(comes_before(mira, bo))
`, label: "ranking_rule_demo.py", note: "RUN KIỂM CHỨNG\nBa hồ sơ người chơi được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: so sánh theo điểm giảm dần, rồi theo tên tăng dần khi điểm bằng nhau. OUTPUT là `True`, `True`, `False`.", expectOut: { all: [{ minLines: 3 }, /^True$/, /^True$/, /^False$/] }, solution: `def comes_before(left, right):
    if left["score"] != right["score"]:
        return left["score"] > right["score"]
    return left["name"] < right["name"]

an = {"name": "An", "score": 10}
bo = {"name": "Bo", "score": 10}
mira = {"name": "Mira", "score": 8}

print(comes_before(an, bo))
print(comes_before(an, mira))
print(comes_before(mira, bo))
` },
  { npc: "Bản sai chỉ so sánh điểm nên hai người cùng điểm giữ nguyên thứ tự cũ. Muốn luật luôn rõ ràng, điều kiện của insertion sort phải xét thêm tên khi hai điểm bằng nhau." },
  { code: `players = [
    {"name": "Bo", "score": 10},
    {"name": "Mira", "score": 8},
    {"name": "An", "score": 10},
    {"name": "Pip", "score": 7}
]

for start in range(1, len(players)):
    current = players[start]
    position = start - 1
    while position >= 0 and players[position]["score"] < current["score"]:
        players[position + 1] = players[position]
        position -= 1
    players[position + 1] = current

for player in players:
    print(player["name"] + ":" + str(player["score"]))
`, label: "ranking_tie_fix.py", note: "ĐỀ BÀI\nBốn hồ sơ được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: insertion sort theo điểm giảm dần và theo tên tăng dần khi điểm bằng nhau. Sửa điều kiện xếp. OUTPUT lần lượt là `An:10`, `Bo:10`, `Mira:8`, `Pip:7`.", expectOut: { all: [{ minLines: 4 }, /^An:10$/, /^Bo:10$/, /^Mira:8$/, /^Pip:7$/] }, solution: `players = [
    {"name": "Bo", "score": 10},
    {"name": "Mira", "score": 8},
    {"name": "An", "score": 10},
    {"name": "Pip", "score": 7}
]

for start in range(1, len(players)):
    current = players[start]
    position = start - 1
    while position >= 0 and (
        players[position]["score"] < current["score"]
        or (
            players[position]["score"] == current["score"]
            and players[position]["name"] > current["name"]
        )
    ):
        players[position + 1] = players[position]
        position -= 1
    players[position + 1] = current

for player in players:
    print(player["name"] + ":" + str(player["score"]))
` },
  { npc: "Bảng được xếp theo điểm, không phải theo tên, nên không thể binary search theo tên. Linear search đọc từng hồ sơ, trả hạng khi gặp tên cần tìm và trả `NOT FOUND` nếu xem hết bảng." },
  { code: `ranking = [
    {"name": "An", "score": 10},
    {"name": "Bo", "score": 10},
    {"name": "Mira", "score": 8},
    {"name": "Pip", "score": 7}
]

def find_rank(players, target):
    for index in range(len(players)):
        if players[index]["name"] == target:
            return index + 1
    return "NOT FOUND"

print(find_rank(ranking, "Mira"))
print(find_rank(ranking, "Kai"))
`, label: "ranking_find_name.py", note: "RUN DỰ ÁN\nBảng đã xếp theo điểm và hai tên cần tìm được cho sẵn; không có INPUT từ ngoài chương trình. PROCESS: tìm tên trong đúng thứ tự hiện có, trả hạng bắt đầu từ 1 hoặc thông báo khi tên vắng mặt. OUTPUT là `3`, rồi `NOT FOUND`.", expectOut: { all: [{ minLines: 2 }, /^3$/, /^NOT FOUND$/] }, solution: `ranking = [
    {"name": "An", "score": 10},
    {"name": "Bo", "score": 10},
    {"name": "Mira", "score": 8},
    {"name": "Pip", "score": 7}
]

def find_rank(players, target):
    for index in range(len(players)):
        if players[index]["name"] == target:
            return index + 1
    return "NOT FOUND"

print(find_rank(ranking, "Mira"))
print(find_rank(ranking, "Kai"))
` },
  { checkpoint: { text: "Bảng xếp hạng cần một luật đầy đủ cho trường hợp điểm bằng nhau. Sau khi xếp theo điểm, tên không còn chắc chắn tăng dần, nên tìm tên bằng linear search; hàm tìm kiếm phải xử lý cả trường hợp có hạng và trường hợp trả `NOT FOUND`." } },
  { quiz: { title: "Chọn luật xếp và cách tìm", questions: [
    { q: "Ba hồ sơ là `Bo:10`, `An:10`, `Mira:8`. Luật là điểm giảm dần, rồi tên tăng dần khi bằng điểm. Thứ tự đúng là gì?", a: ["An:10, Bo:10, Mira:8", "Bo:10, An:10, Mira:8", "Mira:8, An:10, Bo:10"], correct: 0 },
    { q: "Bảng `[Zed:12, An:9, Mira:8, Bo:7]` được xếp theo điểm giảm dần. Muốn tìm tên `Bo` mà không xếp lại bảng, cách nào phù hợp?", a: ["Linear search theo từng hồ sơ", "Binary search theo tên", "Chỉ xem hồ sơ giữa"], correct: 0 },
  ] } },
];

export default dsaNode(15, { subtitle: "xếp điểm, xử lý điểm bằng nhau và tìm tên", machineName: "BẢNG XẾP HẠNG KOTOPIA", machineBlurb: "áp dụng luật xếp rõ ràng rồi trả hạng hoặc báo không tìm thấy", cells });
