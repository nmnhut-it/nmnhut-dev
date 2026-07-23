# QUIZ CHECKPOINTS DRAFT - bản chốt

Mini-quiz để xác nhận hiểu ngay sau mỗi mảng kiến thức mới trong Node 0 và Node 1. Mỗi checkpoint chỉ giữ một phiên bản cuối cùng: một câu hỏi ngắn, ba đáp án ngắn, đúng schema hiện tại.

---

## NODE 0

### 1. Ba phần của cỗ máy

Chèn sau cell remember: `INPUT → PROCESS → OUTPUT. Máy nào cũng đi theo đúng vòng này.` (ngay trước `echo.py`).

Từ/cụm từ tự nhiên: cỗ máy, thứ tự, đi vào, xử lý, đi ra.

```js
{ quiz: { title: 'Ba phần máy', questions: [
  { q: 'Cỗ máy nào cũng đi theo thứ tự nào?', a: ['OUTPUT → INPUT → PROCESS', 'PROCESS → OUTPUT → INPUT', 'INPUT → PROCESS → OUTPUT'], correct: 2 }
] } }
```

### 2. `read()` và `say()`

Chèn sau cell remember ngay sau `echo.py`: `` `read()` là lúc máy NGHE · `say()` là lúc máy NÓI. ``

Từ/cụm từ tự nhiên: máy nghe, máy nói, khác nhau chỗ nào.

```js
{ quiz: { title: 'Nghe nói', questions: [
  { q: '`read()` và `say()` khác nhau sao?', a: ['read() nói, say() nghe', 'read() nghe, say() nói', 'cả hai đều tính số'], correct: 1 }
] } }
```

### 3. Nối chuỗi bằng dấu `+`

Chèn sau cell label `greet.py`.

Từ/cụm từ tự nhiên: dấu cộng, ghép chữ, mảnh chữ.

```js
{ quiz: { title: 'Ghép chữ', questions: [
  { q: 'Dấu `+` trong câu chào đang làm gì?', a: ['ghép các mảnh chữ', 'xóa tên đi', 'bắt máy tính toán'], correct: 0 }
] } }
```

### 4. Đọc lỗi tên bị gõ sai

Chèn sau cell label `wish.py`.

Từ/cụm từ tự nhiên: có `wish`, viết nhầm `wsh`, gõ sai tên.

```js
{ quiz: { title: 'Đọc lỗi', questions: [
  { q: 'Có `wish` mà viết `wsh`, lỗi là gì?', a: ['thiếu dấu `+`', 'gõ sai tên', 'quên nhập tên'], correct: 1 }
] } }
```

### 5. `read_num()` và `say_num()`

Chèn sau cell remember ngay sau `calc.py`: `` `read_num()` = hỏi và nhận về một SỐ · `say_num()` = nói ra một SỐ. ``

Từ/cụm từ tự nhiên: hỏi số, nói số, cỗ máy này.

```js
{ quiz: { title: 'Số thật', questions: [
  { q: '`read_num()` và `say_num()` lo chuyện gì?', a: ['hỏi số và nói số', 'chụp ảnh và bật sáng', 'hỏi chữ và nói chữ'], correct: 0 }
] } }
```

### 6. Toán tử `-`, `*`, `/`

Chèn sau cell label `calc_full.py`.

Từ/cụm từ tự nhiên: trừ, nhân, chia, bộ dấu.

```js
{ quiz: { title: 'Dấu phép', questions: [
  { q: 'Trừ, nhân, chia viết bằng bộ dấu nào?', a: ['-, x, :', '+, =, /', '-, *, /'], correct: 2 }
] } }
```

### 7. Dấu nháy phải khớp cặp

Chèn sau cell label `quote.py`.

Từ/cụm từ tự nhiên: dấu nháy, mở, đóng, khớp cùng loại.

```js
{ quiz: { title: 'Dấu nháy khớp', questions: [
  { q: 'Dấu nháy của một câu chữ phải thế nào?', a: ['chỉ cần mở, khỏi đóng', 'mở và đóng khớp cùng loại', 'chỉ đặt ở cuối câu'], correct: 1 }
] } }
```

### 8. Thụt dòng sai chỗ

Chèn sau cell label `indent.py`.

Từ/cụm từ tự nhiên: tự dưng thụt phải, máy báo lỗi, thụt dòng.

```js
{ quiz: { title: 'Thụt dòng', questions: [
  { q: 'Một dòng tự dưng thụt sang phải thì sao?', a: ['máy báo lỗi thụt dòng', 'chạy nhanh hơn', 'tự thành chữ in hoa'], correct: 0 }
] } }
```

---

## NODE 1

### 1. `if` chỉ chạy khi điều kiện đúng

Chèn sau cell label `make_it_true.py`.

Từ/cụm từ tự nhiên: if, bên trong, điều kiện đúng, TRUE.

```js
{ quiz: { title: 'Đúng mới chạy', questions: [
  { q: '`if` chạy phần bên trong khi nào?', a: ['khi điều kiện FALSE', 'khi bấm RUN hai lần', 'khi điều kiện TRUE'], correct: 2 }
] } }
```

### 2. Dấu hai chấm cuối dòng `if`

Chèn sau remember block ngay sau `make_it_true.py`:
`if đặt câu hỏi`, `câu hỏi kết thúc bằng dấu hai chấm :`, `câu phép bên trong thụt PHẢI`, `==` hỏi bằng nhau còn `=` gán giá trị.

Từ/cụm từ tự nhiên: dòng if, cuối dòng, dấu hai chấm.

```js
{ quiz: { title: 'Cuối dòng if', questions: [
  { q: 'Dòng `if finger == 1` còn thiếu gì ở cuối?', a: ['dấu chấm `.`', 'dấu hai chấm `:`', 'dấu cộng `+`'], correct: 1 }
] } }
```

### 3. `watch()` là input thật

Chèn sau cell label `real_input.py`.

Từ/cụm từ tự nhiên: tay thật, đi vào chương trình, bùa nhìn tay.

```js
{ quiz: { title: 'Tay thật', questions: [
  { q: 'Tay thật đi vào chương trình nhờ từ nào?', a: ['watch()', 'say()', 'fire_vortex()'], correct: 0 }
] } }
```

### 4. `fire_vortex()` là output thật

Chèn sau cell label `real_output.py`.

Từ/cụm từ tự nhiên: phóng lửa thật, câu phép, cỗ máy tương lai.

```js
{ quiz: { title: 'Lửa thật', questions: [
  { q: 'Muốn cỗ máy phóng lửa thật, dùng câu phép nào?', a: ['watch()', 'fire_vortex()', 'read_num()'], correct: 1 }
] } }
```

### 5. `elif`

Chèn sau remember cell ngay sau `two_rules.py`: `elif = "hoặc nếu". Luật kết thúc bằng : và câu phép bên trong thụt sang PHẢI.`

Từ/cụm từ tự nhiên: sau if, hoặc nếu, hỏi tiếp trường hợp khác.

```js
{ quiz: { title: 'Hoặc nếu', questions: [
  { q: 'Sau `if`, `elif` dùng để làm gì?', a: ['hỏi tiếp một trường hợp khác', 'đóng máy lại', 'nối chữ lại'], correct: 0 }
] } }
```

---

## Ghi chú phạm vi và kiểm tra chuẩn Python / từ riêng của game

- Tách Node 1 phần `if` thành 2 checkpoint nhỏ: một câu về điều kiện TRUE, một câu về dấu `:` cuối dòng `if`. Hai ý này xuất hiện liền nhau nhưng là hai kiến thức khác nhau.
- Không thêm quiz riêng cho `photo_booth()`: trong `node01.js` nó đang là quà/preview, còn loop được nói là học ở node sau. Quiz lúc này dễ biến thành hỏi thuộc tên hàm riêng của game.
- Đã sửa cách gọi `read()`, `say()`, `read_num()`, `say_num()`: không gọi là Python chuẩn; câu hỏi chỉ đóng khung là từ/câu phép của cỗ máy này.
- Đã sửa cách gọi `watch()`, `fire_vortex()`, `lighten()`, `darken()`, `photo_booth()`: đây là từ riêng của `camera_charm`, nên quiz chỉ nói là từ/câu phép của bùa hoặc cỗ máy tương lai, không gắn nhãn Python chuẩn.
- Giữ quiz như luật Python thật cho các phần thật sự là chuẩn Python: `if` chỉ chạy khi điều kiện TRUE, dấu `:` cuối dòng `if`, thụt dòng có ý nghĩa, `==` khác `=`, dấu `+` nối chuỗi, toán tử `-`, `*`, `/`.
- Checkpoint dấu nháy đã sửa thành "mở và đóng khớp cùng loại", không nói Python bắt buộc dùng dấu ngoặc kép.
