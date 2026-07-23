import { dsaNode } from "./dsa-builders.js";

export default dsaNode(0, {
  subtitle: "chọn list, set hoặc dict theo việc chương trình cần làm",
  machineName: "MÁY CHỌN KHO DỮ LIỆU",
  machineBlurb: "giúp chọn cách lưu dữ liệu theo thứ tự, tính duy nhất hoặc khóa tra cứu",
  cells: [
    { quiz: { title: "Ôn cách cất dữ liệu", questions: [
      { q: "Một chương trình cần giữ ba điểm `8, 6, 9` đúng thứ tự nhập để đọc lại bằng index. Cách cất nào phù hợp nhất?", a: ["List `[8, 6, 9]`", "Một biến chỉ giữ `9`", "Ba lệnh `print()` không lưu dữ liệu"], correct: 0 },
      { q: "Cho `prices = {\"pen\": 5, \"book\": 12}`. Biểu thức nào lấy giá của `book`?", a: ["`prices[\"book\"]`", "`prices[1]`", "`prices[12]`"], correct: 0 },
    ] } },
    { npc: "Cùng một nhóm dữ liệu có thể được cất theo nhiều cách. Muốn chọn đúng, mình phải nhìn vào thao tác chương trình cần làm với dữ liệu đó." },
    { npc: "`list` giữ thứ tự và cho phép giá trị trùng. `set` chỉ giữ mỗi giá trị một lần. `dict` nối từng khóa duy nhất với một giá trị để tra cứu bằng khóa." },
    { code: `playlist = ["Dawn", "Rain", "Dawn"]
visitors = {"An", "Binh", "An"}
prices = {"pen": 5, "book": 12}

print(playlist)
print(len(visitors))
print(prices["book"])
`, label: "three_collections.py", note: "RUN KIỂM CHỨNG\nCho sẵn một playlist, một set tên khách và một dict giá; không có INPUT. PROCESS: giữ thứ tự bằng list, loại tên trùng bằng set và tra giá bằng khóa trong dict. OUTPUT lần lượt là `['Dawn', 'Rain', 'Dawn']`, `2`, `12`.", expectOut: { all: [{ minLines: 3 }, /^\['Dawn', 'Rain', 'Dawn'\]$/, /^2$/, /^12$/] }, solution: `playlist = ["Dawn", "Rain", "Dawn"]
visitors = {"An", "Binh", "An"}
prices = {"pen": 5, "book": 12}

print(playlist)
print(len(visitors))
print(prices["book"])
` },
    { npc: "List không tự bỏ dữ liệu trùng. Nếu dùng list để đếm người khác nhau, một người ghé hai lần sẽ bị tính hai lần." },
    { code: `visitors = ["An", "Binh", "An", "Chi"]
unique_visitors = visitors
print(len(unique_visitors))
`, label: "unique_visitors_fix.py", note: "ĐỀ BÀI\nCho sẵn bốn lượt ghé, trong đó `An` xuất hiện hai lần; không có INPUT. Sửa cách tạo `unique_visitors` để dùng set. PROCESS: mỗi tên chỉ được giữ một lần. OUTPUT đúng là `3`.", expectOut: /^3$/, solution: `visitors = ["An", "Binh", "An", "Chi"]
unique_visitors = set(visitors)
print(len(unique_visitors))
` },
    { checkpoint: { text: "Chọn cấu trúc theo thao tác cần làm: `list` giữ thứ tự và dữ liệu trùng; `set` giữ các giá trị không trùng; `dict` lưu các cặp khóa–giá trị để tra cứu bằng khóa." } },
    { quiz: { title: "Chọn theo việc cần làm", questions: [
      { q: "Một trò chơi cần lưu thứ tự năm lượt bấm, kể cả khi người chơi bấm cùng nút nhiều lần. Cấu trúc nào phù hợp nhất?", a: ["`list`, vì nó giữ thứ tự và cho phép giá trị trùng", "`set`, vì nó xóa mọi lượt trùng", "`dict`, dù chương trình không có khóa để tra"], correct: 0 },
      { q: "Thư viện cần kiểm tra nhanh một mã sách đã được mượn hay chưa, không quan tâm thứ tự và không lưu mã trùng. Cấu trúc nào phù hợp nhất?", a: ["`set` các mã sách", "`list` có thể chứa nhiều mã giống nhau", "Một số nguyên duy nhất"], correct: 0 },
    ] } },
    { npc: "Bây giờ bạn hãy cất bảng giá. Mỗi tên món là một khóa, còn số tiền là giá trị gắn với khóa đó." },
    { code: `prices = {
    "potion": 7,
    "map": 11,
}

# In giá của potion và map, mỗi giá trên một dòng.
`, label: "price_lookup.py", note: "XƯỞNG PHÉP\nCho sẵn dict `prices`; không có INPUT. PROCESS: tra hai giá trị bằng khóa tương ứng. OUTPUT đúng là `7` rồi `11`, mỗi số trên một dòng.", expectOut: { all: [{ minLines: 2 }, /^7$/, /^11$/] }, solution: `prices = {
    "potion": 7,
    "map": 11,
}

print(prices["potion"])
print(prices["map"])
` },
    { checkpoint: { text: "Không có một cấu trúc luôn tốt nhất. Hãy xác định chương trình cần giữ thứ tự, loại dữ liệu trùng hay tra một giá trị bằng khóa rồi mới chọn `list`, `set` hoặc `dict`." } },
    { quiz: { title: "Thiết kế kho dữ liệu", questions: [
      { q: "Một ứng dụng cần lưu số điện thoại theo tên, rồi tra số của `Lan` bằng chính tên `Lan`. Dữ liệu nào phục vụ thao tác đó trực tiếp nhất?", a: ["`{\"Lan\": \"0901\", \"Minh\": \"0902\"}`", "`[\"0901\", \"0902\"]`", "`{\"0901\", \"0902\"}`"], correct: 0 },
    ] } },
  ],
});
