import { dsaNode } from "./dsa-builders.js";

export default dsaNode(1, {
  subtitle: "ghi lại trạng thái sau từng lượt để hiểu thuật toán",
  machineName: "KÍNH LẦN THEO",
  machineBlurb: "cho thấy index, giá trị đang đọc và kết quả tạm sau mỗi bước",
  cells: [
    { quiz: { title: "Ôn chọn cấu trúc", questions: [
      { q: "Cần lưu thứ tự các điểm `4, 9, 4` và đọc từng điểm bằng index. Cấu trúc nào phù hợp?", a: ["List `[4, 9, 4]`", "Set `{4, 9}`", "Dict chỉ có một khóa"], correct: 0 },
      { q: "Cần đếm số mã khách khác nhau, không quan tâm thứ tự. Với `codes = [\"A\", \"B\", \"A\"]`, biểu thức nào cho kết quả 2?", a: ["`len(set(codes))`", "`len(codes)`", "`codes[2]`"], correct: 0 },
    ] } },
    { npc: "Một thuật toán thay đổi dữ liệu qua nhiều bước. Nếu chỉ nhìn OUTPUT cuối, mình khó biết kết quả bắt đầu sai ở lượt nào." },
    { npc: "Trạng thái là các giá trị quan trọng tại một thời điểm. Bảng trạng thái ghi lại `index`, phần tử đang đọc và kết quả tạm sau mỗi lượt của thuật toán." },
    { code: `scores = [4, 7, 2]
total = 0

for index in range(len(scores)):
    total = total + scores[index]
    print(index, scores[index], total)
`, label: "state_total.py", note: "RUN KIỂM CHỨNG\nCho sẵn `scores = [4, 7, 2]`; không có INPUT. PROCESS: cộng từng điểm và in trạng thái `index value total` sau mỗi lượt. OUTPUT là `0 4 4`, `1 7 11`, `2 2 13`.", expectOut: { all: [{ minLines: 3 }, /^0 4 4$/, /^1 7 11$/, /^2 2 13$/] }, solution: `scores = [4, 7, 2]
total = 0

for index in range(len(scores)):
    total = total + scores[index]
    print(index, scores[index], total)
` },
    { npc: "Dòng trạng thái phải được in sau khi cập nhật kết quả tạm. Nếu in trước, bảng sẽ mô tả giá trị của lượt trước và khiến người đọc hiểu sai." },
    { code: `scores = [4, 7, 2]
total = 0

for index in range(len(scores)):
    print(index, scores[index], total)
    total = total + scores[index]
`, label: "state_order_fix.py", note: "ĐỀ BÀI\nCho sẵn ba điểm; không có INPUT. Bảng hiện in `total` trước khi cộng điểm đang đọc. Sửa vị trí hai dòng trong vòng `for` để trạng thái được ghi sau khi cập nhật. OUTPUT đúng là `0 4 4`, `1 7 11`, `2 2 13`.", expectOut: { all: [{ minLines: 3 }, /^0 4 4$/, /^1 7 11$/, /^2 2 13$/] }, solution: `scores = [4, 7, 2]
total = 0

for index in range(len(scores)):
    total = total + scores[index]
    print(index, scores[index], total)
` },
    { checkpoint: { text: "Bảng trạng thái ghi các giá trị quan trọng sau từng lượt, chẳng hạn `index`, phần tử đang đọc và `total`. Nó giúp xác định chính xác lượt đầu tiên kết quả khác với điều mong đợi." } },
    { quiz: { title: "Đọc bảng trạng thái", questions: [
      { q: "Cho `values = [3, 5]`, `total = 0`. Sau mỗi lượt, máy cộng phần tử hiện tại vào `total`. Dòng trạng thái sau lượt có `index = 1` là gì?", a: ["`1 5 8`", "`1 5 5`", "`0 3 8`"], correct: 0 },
      { q: "Một bảng tính tổng đúng ở dòng `0 6 6` nhưng dòng kế tiếp là `1 4 4` thay vì `1 4 10`. Lỗi xuất hiện lần đầu ở lượt nào?", a: ["Lượt có `index = 1`", "Lượt có `index = 0`", "Không thể xác định từ bảng"], correct: 0 },
    ] } },
    { npc: "Bảng trạng thái cũng giúp theo dõi giá trị lớn nhất đã gặp. Sau mỗi lượt, `best` phải bằng số lớn nhất trong phần list đã đọc." },
    { code: `scores = [5, 8, 3, 9]
best = scores[0]

for index in range(len(scores)):
    if scores[index] > best:
        best = scores[index]
    print(index, scores[index], best)
`, label: "state_best.py", note: "ĐỀ BÀI\nCho sẵn bốn điểm; không có INPUT. PROCESS: giữ điểm lớn nhất đã gặp và in `index value best` sau mỗi lượt. OUTPUT phải kết thúc bằng dòng `3 9 9`.", expectOut: { all: [{ minLines: 4 }, /^0 5 5$/, /^1 8 8$/, /^2 3 8$/, /^3 9 9$/] }, solution: `scores = [5, 8, 3, 9]
best = scores[0]

for index in range(len(scores)):
    if scores[index] > best:
        best = scores[index]
    print(index, scores[index], best)
` },
    { checkpoint: { text: "Khi lần theo thuật toán, hãy chọn đúng biến trạng thái và ghi chúng theo cùng một thời điểm ở mọi lượt. Với bài tìm lớn nhất, `best` sau mỗi lượt phải là giá trị lớn nhất trong phần dữ liệu đã đọc." } },
    { quiz: { title: "Theo dõi giá trị lớn nhất", questions: [
      { q: "Cho `scores = [6, 2, 8]` và `best = scores[0]`. Sau khi thuật toán đã đọc hai phần tử đầu, `best` bằng bao nhiêu?", a: ["6", "2", "8"], correct: 0 },
      { q: "Khi lần theo bài tìm lớn nhất trên `[7, 4, 9]`, bảng ghi `best` lần lượt là `7, 4, 9`. Dòng nào cho thấy quy tắc cập nhật đã sai?", a: ["Dòng thứ hai, vì đọc 4 không được làm `best` giảm từ 7 xuống 4", "Dòng đầu, vì `best` không được là 7", "Dòng cuối, vì 9 lớn hơn 7"], correct: 0 },
    ] } },
  ],
});
