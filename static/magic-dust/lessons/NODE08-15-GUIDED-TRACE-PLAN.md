# Kế hoạch dạy từng bước cho node 8–15

## 1. Mục tiêu

Áp dụng mô hình đã hiệu quả ở node 11 cho toàn bộ dải kiến thức muộn, nhưng
không sao chép giao diện punch card sang mọi bài. Mỗi node phải cho học sinh
lớp 6 nhìn thấy đúng trạng thái mà khái niệm đó làm thay đổi:

1. bắt đầu từ trường hợp nhỏ nhất;
2. mỗi lần bấm chỉ quan sát một việc;
3. dòng code đang xét và trạng thái máy phải hiện cùng lúc;
4. có thời gian đọc lời Pip trước bước tiếp theo;
5. xem bản đúng trước, sau đó mới dự đoán, xem bản sai và sửa;
6. code cell vẫn RUN toàn bộ chương trình; trace cell chỉ là mô hình quan sát;
7. mỗi frame nằm trọn viewport, không scrollbar nội bộ, không clipping hay
   overlap, và phải trừ phần gutter của scrollbar trang.

## 2. Scope thật trên saga

| Node | File live | Chủ đề hiện tại |
|---|---|---|
| 8 | `content/node08v2.js` | `str`, `int`, `bool`, `type()`, chuyển kiểu |
| 9 | `content/node09v2.js` | `and`, `or`, `not`, `!=`, ngoặc điều kiện |
| 10 | `content/node10v2.js` | `for`, `range()`, mốc đầu/cuối, thụt lề |
| 11 | `content/node11.js` | punch card, `pc`, GOTO, `if`/`while` ↔ GOTO |
| 12 | `content/node12.js` | gán, ghi đè, sao chép giá trị, swap, cập nhật |
| 13 | `content/node13.js` | list, index từ 0, cập nhật, `len()-1` |
| 14 | `content/node14.js` | quét list: tổng, đếm, lớn nhất, tìm mục tiêu |
| 15 | `content/node15.js` | grid, hàng/cột, cập nhật, vòng lặp lồng nhau |

Không sửa các file V1 `node08.js`, `node09.js`, `node10.js` khi saga không dùng
chúng. Node 8/9/10/12 đang có diff chưa commit; mọi patch phải hẹp và được xem
lại bằng `git diff -- <file>`.

## 3. Refine 2 — một engine chung, nhiều mô hình trạng thái

Tạo cell mới `execution`, không nhét mọi bài vào `programCounter`.

```js
{
  label: "...",
  execution: {
    title: "...",
    intro: "...",
    code: ["..."],
    frames: [{
      line: 1,
      explain: "...",
      observeMs: 1400,
      state: {
        variables: { name: "An", age: 12 },
        output: ["..."],
        visual: { kind: "memory", ... }
      }
    }]
  }
}
```

Phần trái luôn là toàn bộ code. Phần phải có bảng biến + OUTPUT và một renderer
nhỏ theo `visual.kind`:

- `value`: giá trị và nhãn `str`/`int`/`bool`;
- `logic`: hai đầu vào, cổng `and`/`or`/`not`, kết quả True/False;
- `range`: dải số, vị trí hiện tại của biến vòng lặp, mốc stop bị loại;
- `memory`: các ô biến, mũi tên sao chép/ghi đè;
- `list`: hàng ô có index, ô đang đọc hoặc cập nhật;
- `scan`: list + con trỏ + biến tích lũy (`total`, `count`, `largest`);
- `grid`: bảng hàng/cột, ô hiện tại và trạng thái vòng lặp lồng nhau.

Renderer phải dùng DOM/CSS và dữ liệu authored; không chạy Python giả từng dòng.
Mỗi frame là snapshot xác định trước. Nếu một cell cần scale dưới `0.78`, phải
tách thành hai stage/frame thay vì thu chữ nhỏ hơn.

## 4. Ma trận sư phạm từng node

### Node 8 — kiểu dữ liệu

- Trường hợp nhỏ nhất: `value = "12"`, nhìn giá trị và nhãn `str`.
- Trace 1: `read()` tạo `str`; `read_num()` tạo `int`; `type()` chỉ soi nhãn.
- Trace 2: `"5" + "3" → "53"` đối chiếu `5 + 3 → 8`.
- Trace 3: phép so sánh tạo `bool`; `False` khác chuỗi `"False"`.
- Trace 4: `str(age)` tạo giá trị mới để nối chuỗi, không đổi `age` gốc.
- Giữ các bài thực hành hiện có, nhưng đặt demo trace đúng ngay trước bài sửa
  tương ứng. Không quiz kiến thức mới trước trace đầu tiên.

### Node 9 — logic Boolean

- Trường hợp nhỏ nhất: hai điều kiện đã có kết quả True/False.
- `and`: chạy đủ bốn tổ hợp bằng bảng 2×2, mỗi frame sáng một hàng.
- `or`: cùng hai input nhưng đổi cổng, học sinh so sánh kết quả với `and`.
- `not`: một input đi qua cổng đảo; sau đó mới nối sang `!=`.
- Ngoặc: render cây nhóm điều kiện, tô nhóm được tính trước.
- Bài sửa `too_lenient_or`/`too_strict_and` chỉ xuất hiện sau khi học sinh đã
  nhìn cả bảng đúng và một trường hợp sai cụ thể.

### Node 10 — `for` và `range()`

- Trường hợp nhỏ nhất: `for i in range(3)` với dải nhìn thấy `0, 1, 2`.
- Mỗi frame tô dòng `for`, giá trị `i`, lần chạy thân vòng và OUTPUT hiện tại.
- Tách rõ `range(stop)`, `range(start, stop)`, và quy tắc stop không được lấy.
- Cho trace `while` năm lượt rồi trace `for` tương đương để thấy điều gì được
  Python viết gọn, không bắt học sinh thuộc cú pháp trước khi quan sát.
- Trace riêng cho thụt lề: dòng trong khối lặp nhiều lần, dòng ngoài khối chạy
  một lần.

### Node 11 — program counter

- Giữ punch card và `programCounter` chuyên dụng hiện tại.
- Giữ phần `if` ↔ TEST YES/NO và `while` ↔ đường nhảy quay lại.
- Refine mobile nếu frame nào scale dưới `0.78`: tách phần xem bộ thẻ và phần
  chạy máy thành hai stage, không thu nhỏ chữ.
- Node 11 là reference về nhịp quan sát, không phải template hình ảnh cho node khác.

### Node 12 — ô nhớ

- Trường hợp nhỏ nhất: `score = 5`, một ô nhớ nhận giá trị 5.
- Gán lại: giá trị cũ mờ đi, giá trị mới nằm trong cùng ô.
- Sao chép: `b = a` chép giá trị hiện tại; gán lại `a` không tự đổi `b`.
- Swap: trace bản đúng có `temp`, rồi bản sai không có `temp` để thấy giá trị bị mất.
- Cập nhật `hp = hp - damage`: vế phải đọc trạng thái cũ, sau đó mới ghi kết quả.

### Node 13 — list

- Trường hợp nhỏ nhất: list một ô, rồi mở thành ba ô.
- Hiện index `0, 1, 2` cố định dưới các ô; không dùng analogy trước định nghĩa.
- Đọc `items[0]`, cập nhật đúng một ô, index nằm trong biến.
- `len(items)` là số ô; index cuối là `len(items) - 1` và phải được trace thành
  hai bước riêng.
- Cell sau giữ nguyên toàn bộ code của cell trước nếu tiếp nối.

### Node 14 — scan patterns

- Dùng cùng renderer `scan`, đổi duy nhất biến trạng thái và điều kiện.
- Tổng: `total` bắt đầu 0; mỗi frame chỉ thêm một phần tử.
- Đếm: `count` chỉ đổi khi điều kiện đúng; frame sai phải cho thấy con trỏ vẫn đi tiếp.
- Lớn nhất: `largest` bắt đầu từ phần tử đầu, không từ 0.
- Tìm mục tiêu: phân biệt “đã thấy” với “đang ở phần tử nào”.
- Mỗi pattern có trace đúng → dự đoán với list mới → bản sai → sửa.

### Node 15 — grid

- Trường hợp nhỏ nhất: grid 1×2, sau đó 2×2.
- `grid[row][col]`: tô hàng trước, rồi ô trong hàng; hai index bắt đầu từ 0.
- Cập nhật: chỉ một ô đổi, các ô cùng hàng/cột giữ nguyên.
- Quét một hàng: renderer list được tái sử dụng trên `grid[row]`.
- Quét toàn bảng: con trỏ `row` di chuyển chậm, `col` chạy hết một hàng rồi trở về 0.
- Trace tổng và đếm số 1 trước bài sửa vòng lặp lồng nhau.

## 5. Refine 3 — thứ tự triển khai

1. Engine `execution` tối thiểu + renderer `value`.
2. Node 8 hoàn chỉnh; dùng nó để khóa API và visual contract.
3. Renderer `logic` + node 9.
4. Renderer `range` + node 10.
5. Audit node 11 theo cùng test fit/readability.
6. Renderer `memory` + node 12.
7. Renderer `list` + node 13.
8. Renderer `scan` + node 14.
9. Renderer `grid` + node 15.
10. Full sweep node 8–15 và saga wrappers.

Mỗi node hoàn tất riêng trước khi chuyển node tiếp theo; không mở đồng thời tám
file content trong dirty worktree.

## 6. Acceptance tests

### Logic/content

- `execution.frames[*].line` trỏ tới dòng code thật.
- Mỗi frame có giải thích, state và `observeMs >= 1200`.
- Trước ít nhất một nửa số bước có thay đổi trạng thái, học sinh phải chọn một dự đoán rồi mới được chạy bước để kiểm chứng.
- Trace đầu tiên bắt đầu từ ví dụ nhỏ nhất và bản đúng.
- Bản sửa lỗi luôn có demo đúng cùng pattern đứng trước.
- Code nối tiếp phải giữ toàn bộ code trước đó.
- Bài tập có dữ liệu cho sẵn/INPUT thật, PROCESS và OUTPUT cụ thể.
- Quiz mặc định mức 2+, tự đủ ngữ cảnh; checkpoint tối đa 4/node.
- Node 8–10 dùng đúng file V2 mà saga import.

### Visual

Chạy từng frame ở các viewport hiệu dụng tương đương:

- zoom 80%: `1600×1000`;
- zoom 100%: `1280×800`;
- zoom 125%: `1024×640`;
- zoom 150%: `854×534`;
- laptop thấp: `1366×640`;
- mobile: `360×640`, `390×844`.

Mọi frame phải thỏa:

- toàn bộ cell nằm trong `clientWidth × clientHeight`;
- không horizontal overflow;
- không scrollbar nội bộ;
- không overlap lớn hơn `0.5px²`;
- mọi khối bắt buộc có visible ratio `>= 0.995`;
- scale `>= 0.78`, nếu thấp hơn phải chia stage;
- scrollbar gutter của trang không che cell.

### Lệnh kiểm tra mỗi file

```bash
node lessons/check-voice-terms.mjs --strict lessons/content/<file>.js
node lessons/validate-content.mjs --strict lessons/content/<file>.js
node lessons/test-content-lint-strict.mjs
node lessons/test-code-trace-cell.mjs
node lessons/check-node08-15-guided-quality.mjs --node <node-name> --visual
git diff --check
```

Gate giữ nguyên coverage bằng số cell, code task, quiz, checkpoint, label và
concept cũ của từng node. `execution` chỉ được thêm vào; không được dùng nó để
thay hoặc xóa bài tập và quiz đang có.

## 7. Trạng thái triển khai

- [x] Engine `execution` + renderer `value` + test normalization.
- [x] Node 8 — `str`/`int`, `bool`, `str()` và bài luyện legacy.
- [x] Node 9 — `and`, `or`, `not`, `!=`, ngoặc và bài luyện legacy.
- [x] Node 10 — `for`, `range`, thụt lề và bài luyện legacy.
- [x] Node 11 — punch card, END 99, program counter, `if`/`while` → GOTO và toàn bộ bài legacy.
- [x] Node 12 — gán, ghi đè, chép giá trị và đổi chỗ bằng `temp`.
- [x] Node 13 — list, index, cập nhật ô và `len(a) - 1`.
- [x] Node 14 — quét tổng, đếm, tìm lớn nhất, tìm mục tiêu và đếm số chẵn.
- [x] Node 15 — một ô, hàng-cột và vòng lặp lồng nhau trên grid.
- [x] Full visual/content sweep.
- [x] Active recall — 151/168 bước quan sát có dự đoán; các bước import/khởi động không hỏi câu máy móc.
