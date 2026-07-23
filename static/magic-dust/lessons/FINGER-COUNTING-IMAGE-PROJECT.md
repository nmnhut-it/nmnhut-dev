# Project Python nhập môn: Đếm đầu ngón tay trong ma trận ảnh

## 1. Bài toán

Một chương trình xử lý ảnh đã đổi ảnh bàn tay thành một bảng gồm `x` và `0`:

- `x` là một ô thuộc bàn tay;
- `0` là một ô thuộc nền ảnh.

Phần đổi ảnh thành ma trận đã được làm sẵn. Bạn không cần tải dataset, mở file ảnh hoặc dùng thư viện xử lý ảnh.

Nhiệm vụ của bạn là viết chương trình Python nhận một ma trận đã cho, đếm số đầu ngón tay trong ma trận và in kết quả.

## 2. INPUT – PROCESS – OUTPUT

### INPUT

Biến `hand` đã được gán sẵn một list hai chiều. Mỗi list bên trong là một hàng của ảnh.

```python
hand = [
    [0, "x", 0, 0, "x", 0, 0, "x", 0],
    [0, "x", 0, 0, "x", 0, 0, "x", 0],
    [0, "x", "x", "x", "x", "x", "x", "x", 0],
    [0, "x", "x", "x", "x", "x", "x", "x", 0],
]
```

Đây là **dữ liệu được gán sẵn**, không phải INPUT đọc từ bàn phím hoặc camera.

### PROCESS

Duyệt từng ô trong ma trận. Một ô là đầu ngón tay khi thỏa mãn tất cả điều kiện sau:

1. Ô hiện tại là `x`.
2. Ô ngay bên dưới là `x`.
3. Ô phía trên là `0` hoặc nằm ngoài ma trận.
4. Ô bên trái là `0` hoặc nằm ngoài ma trận.
5. Ô bên phải là `0` hoặc nằm ngoài ma trận.

Không cần duyệt hàng cuối vì một đầu ngón phải có một ô `x` nằm ngay bên dưới.

### OUTPUT

In đúng một dòng theo mẫu:

```text
Số đầu ngón tay: 3
```

Với ma trận mẫu ở trên, kết quả đúng là `3`.

## 3. Hình ảnh đã được đơn giản hóa như thế nào?

Project dùng các ma trận đã được chuẩn bị theo các quy ước sau:

- mỗi ma trận chỉ có một bàn tay;
- bàn tay hướng các ngón lên trên;
- mỗi đầu ngón chỉ rộng một ô `x`;
- các ngón không chạm vào mép trái hoặc mép phải của ma trận;
- không có các ô nhiễu đứng riêng;
- cổ tay nằm ở phía dưới ma trận.

Các quy ước này giúp project tập trung vào list hai chiều, vòng lặp và điều kiện. Chương trình chưa cần xử lý ảnh bàn tay thật có màu sắc, bóng đổ hoặc hướng đặt tay khác nhau.

## 4. Kiến thức Python cần dùng

- biến và phép gán;
- list hai chiều;
- `len()`;
- vòng lặp `for`;
- `range()`;
- truy cập một ô bằng `hand[row][col]`;
- điều kiện `if`;
- toán tử `and` và `or`;
- biến đếm.

Không cần dùng:

- OpenCV;
- NumPy;
- pandas;
- machine learning;
- đọc file ảnh;
- tải hoặc chia dataset.

## 5. Các bước thực hiện

### Bước 1 — Đọc một ô trong ma trận

Chạy đoạn code sau và quan sát kết quả:

```python
print(hand[0][1])
print(hand[2][2])
```

Giải thích bằng lời:

- số đầu tiên chọn hàng nào;
- số thứ hai chọn cột nào;
- vì sao cả hai dòng trên đều in ra `x`.

### Bước 2 — Duyệt tất cả ô cần kiểm tra

Tạo hai vòng lặp lồng nhau:

```python
row_count = len(hand)
col_count = len(hand[0])

for row in range(row_count - 1):
    for col in range(col_count):
        print(row, col, hand[row][col])
```

Vòng lặp của `row` dừng trước hàng cuối. Vòng lặp của `col` đi qua mọi cột.

### Bước 3 — Chỉ giữ các ô `x`

Trong vòng lặp, dùng `if` để chỉ kiểm tra tiếp khi ô hiện tại là `x`:

```python
if hand[row][col] == "x":
    # kiểm tra các ô xung quanh tại đây
```

### Bước 4 — Kiểm tra ô phía trên

Nếu `row == 0`, ô hiện tại nằm ở hàng đầu nên không có ô phía trên. Trường hợp này được tính là nền.

```python
top_is_clear = row == 0 or hand[row - 1][col] == 0
```

### Bước 5 — Kiểm tra hai bên và phía dưới

Viết thêm ba biến boolean:

```python
left_is_clear = col == 0 or hand[row][col - 1] == 0
right_is_clear = col == col_count - 1 or hand[row][col + 1] == 0
below_is_hand = hand[row + 1][col] == "x"
```

Mỗi biến lưu kết quả `True` hoặc `False` của đúng một điều kiện.

### Bước 6 — Đếm đầu ngón

Tạo `finger_count = 0` trước hai vòng lặp. Khi ô hiện tại là `x` và cả bốn điều kiện đều đúng, tăng `finger_count` thêm `1`.

Sau khi hai vòng lặp kết thúc, in kết quả.

## 6. Starter code

```python
hand = [
    [0, "x", 0, 0, "x", 0, 0, "x", 0],
    [0, "x", 0, 0, "x", 0, 0, "x", 0],
    [0, "x", "x", "x", "x", "x", "x", "x", 0],
    [0, "x", "x", "x", "x", "x", "x", "x", 0],
]

row_count = len(hand)
col_count = len(hand[0])
finger_count = 0

for row in range(row_count - 1):
    for col in range(col_count):
        # Viết các điều kiện kiểm tra tại đây.
        pass

print("Số đầu ngón tay:", finger_count)
```

## 7. Yêu cầu hoàn thành

Chương trình cần:

1. dùng hai vòng lặp để duyệt ma trận;
2. không viết sẵn vị trí của từng đầu ngón;
3. đếm đúng với tất cả ma trận kiểm thử ở phần tiếp theo;
4. không truy cập ra ngoài phạm vi của list;
5. in kết quả theo đúng mẫu `Số đầu ngón tay: N`;
6. dùng tên biến tiếng Anh như `row`, `col`, `finger_count` và `result`.

## 8. Ma trận kiểm thử

Thay giá trị của `hand` bằng từng ma trận dưới đây rồi chạy lại chương trình.

### Trường hợp 1 — Một đầu ngón

```python
hand = [
    [0, "x", 0],
    [0, "x", 0],
    ["x", "x", "x"],
]
```

OUTPUT đúng:

```text
Số đầu ngón tay: 1
```

### Trường hợp 2 — Hai đầu ngón

```python
hand = [
    [0, "x", 0, "x", 0],
    [0, "x", 0, "x", 0],
    [0, "x", "x", "x", 0],
]
```

OUTPUT đúng:

```text
Số đầu ngón tay: 2
```

### Trường hợp 3 — Bốn đầu ngón

```python
hand = [
    [0, "x", 0, "x", 0, "x", 0, "x", 0],
    [0, "x", 0, "x", 0, "x", 0, "x", 0],
    [0, "x", "x", "x", "x", "x", "x", "x", 0],
]
```

OUTPUT đúng:

```text
Số đầu ngón tay: 4
```

### Trường hợp 4 — Ô `x` không phải đầu ngón

```python
hand = [
    [0, 0, 0, 0, 0],
    [0, "x", "x", "x", 0],
    [0, "x", "x", "x", 0],
]
```

OUTPUT đúng:

```text
Số đầu ngón tay: 0
```

Trường hợp này kiểm tra xem chương trình có đếm nhầm một ô nằm trong phần rộng của bàn tay hay không.

## 9. Cách làm bài và nộp bài

1. Mở `finger_counting_project.ipynb` bằng Jupyter Notebook hoặc Google Colab.
2. Đọc lần lượt các ô hướng dẫn.
3. Hoàn thành hàm `count_fingertips(hand)` trong ô có chữ `TODO`.
4. Chạy ô kiểm tra nhanh trong notebook.
5. Chạy toàn bộ test bằng lệnh `python -m unittest -v test_finger_counting.py`.
6. Nộp `student_solution.py` đã hoàn thành.

Học sinh không phải viết báo cáo.

## 10. Tiêu chí đánh giá

| Hạng mục | Tỉ trọng |
|---|---:|
| Duyệt đúng ma trận bằng hai vòng lặp | 25% |
| Viết đúng các điều kiện nhận biết đầu ngón | 30% |
| Chạy đúng bốn trường hợp kiểm thử | 20% |
| Không truy cập ra ngoài phạm vi list | 10% |
| Tên biến rõ ràng, code dễ đọc | 5% |
| Hàm có kết quả ổn định khi chạy lại | 10% |

Project hoàn thành khi chương trình tự đếm từ ma trận. Việc nhìn ma trận rồi gán thẳng `finger_count = 3` không đáp ứng yêu cầu.

## 11. Giới hạn của project

Chương trình không đọc trực tiếp pixel từ ảnh JPG hoặc PNG. Một bước tiền xử lý đã chuyển ảnh thành ma trận đơn giản trước khi chương trình bắt đầu.

Trong một hệ thống hoàn chỉnh, phần tiền xử lý phải xác định ô nào thuộc bàn tay, loại nhiễu và xoay bàn tay về đúng hướng. Những việc đó nằm ngoài phạm vi Python nhập môn. Project này chỉ tập trung vào câu hỏi: **khi đã có ma trận, chương trình duyệt và kiểm tra các ô như thế nào để đếm đầu ngón tay?**
