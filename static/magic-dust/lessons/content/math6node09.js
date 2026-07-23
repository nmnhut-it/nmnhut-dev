import { math6Lesson } from "./math6-builders.js";

const cells = [
  { intro: { title: "✦ PHÒNG XÚC XẮC ✦", hook: "Phòng thí nghiệm đã ghi sẵn kết quả của nhiều lần gieo xúc xắc. Bạn sẽ quét dữ liệu, đếm sự kiện và tính xác suất thực nghiệm.", art: "assets/old-computer.webp" } },
  { quiz: { title: "Ôn quét list", questions: [
    { q: "Cho `results = [2, 5, 4]`. Đoạn `for value in results:` chạy mấy lượt?", a: ["2 lượt", "5 lượt", "3 lượt, vì list có ba phần tử"], correct: 2 },
  ] } },
  { npc: "Vòng `for` lấy lần lượt từng kết quả trong list, từ trái sang phải. Bài này gọi thao tác đó là quét list." },
  { npc: "Xác suất thực nghiệm bằng số lần sự kiện xảy ra chia cho tổng số lần thử. Ví dụ: gieo 10 lần, có 4 lần ra số chẵn thì xác suất thực nghiệm là `4 / 10 = 0.4`." },
  { code: `from old_computer import say_num

results = [1, 4, 6, 3, 2, 6, 5, 2, 4, 1]
even_count = 0

for value in results:
    if value % 2 == 0:
        even_count = even_count + 1

say_num(even_count)
`, label: "math6_probability_count_demo.py", note: "RUN KIỂM CHỨNG\nCho sẵn list của 10 lần gieo; không có INPUT. PROCESS: quét list và đếm kết quả chẵn. OUTPUT đúng là `6`.", expectOut: /^6$/, solution: `from old_computer import say_num

results = [1, 4, 6, 3, 2, 6, 5, 2, 4, 1]
even_count = 0

for value in results:
    if value % 2 == 0:
        even_count = even_count + 1

say_num(even_count)
` },
  { code: `from old_computer import say_num

results = [1, 4, 6, 3, 2, 6, 5, 2, 4, 1]
six_count = 0

for value in results:
    if value == 5:
        six_count = six_count + 1

probability = six_count + len(results)
say_num(probability)
`, label: "math6_probability_fix.py", note: "ĐỀ BÀI\nCho sẵn 10 kết quả; không có INPUT. Bài cần tính xác suất thực nghiệm của sự kiện ra mặt 6. Sửa điều kiện và phép tính. OUTPUT đúng là `0.2`.", expectOut: /^0\.2$/, solution: `from old_computer import say_num

results = [1, 4, 6, 3, 2, 6, 5, 2, 4, 1]
six_count = 0

for value in results:
    if value == 6:
        six_count = six_count + 1

probability = six_count / len(results)
say_num(probability)
` },
  { checkpoint: { text: "Xác suất thực nghiệm bằng `event_count / len(results)`: số lần sự kiện xảy ra chia cho tổng số lần thử đã ghi trong list." } },
  { quiz: { title: "Từ số lần đến xác suất", questions: [
    { q: "Một đồng xu được tung 20 lần và xuất hiện mặt ngửa 9 lần. Xác suất thực nghiệm của mặt ngửa là bao nhiêu?", a: ["`20 / 9`", "`9 / 20 = 0.45`", "`9 + 20 = 29`"], correct: 1 },
    { q: "Cho `results = [2, 2, 5, 6]`. Sự kiện “ra số chẵn” xảy ra bao nhiêu lần?", a: ["3 lần", "2 lần", "4 lần"], correct: 0 },
  ] } },
  { code: `from old_computer import say_num

results = [3, 1, 3, 2, 3, 6, 4, 3]
event_count = 0

for value in results:
    if value == 3:
        event_count = event_count + 1

probability = event_count / len(results)
say_num(event_count)
say_num(probability)
`, label: "math6_probability_apply.py", note: "RUN KIỂM CHỨNG\nCho sẵn 8 lần gieo; không có INPUT. PROCESS: đếm số lần ra mặt 3 rồi chia cho tổng số lần thử. OUTPUT gồm `4` rồi `0.5`.", expectOut: { all: [{ minLines: 2 }, /^4$/, /^0\.5$/] }, solution: `from old_computer import say_num

results = [3, 1, 3, 2, 3, 6, 4, 3]
event_count = 0

for value in results:
    if value == 3:
        event_count = event_count + 1

probability = event_count / len(results)
say_num(event_count)
say_num(probability)
` },
  { remember: "Xác suất thực nghiệm chỉ mô tả dữ liệu đã quan sát. Thay list kết quả có thể làm tỉ lệ thay đổi, nhưng PROCESS vẫn là đếm sự kiện rồi chia cho số lần thử." },
];

export default math6Lesson(9, { subtitle: "đếm sự kiện trong dữ liệu gieo xúc xắc và tính xác suất thực nghiệm", machineName: "MÁY ĐẾM SỰ KIỆN", machineBlurb: "quét kết quả thí nghiệm, đếm số lần sự kiện xảy ra và tính tỉ lệ", cells });
