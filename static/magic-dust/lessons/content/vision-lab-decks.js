const matrix = (rows, { label = "", highlight = [] } = {}) => {
  const marked = new Set(highlight.map(([row, column]) => `${row}:${column}`));
  return `<figure class="vl-matrix"><figcaption>${label}</figcaption><div style="--vl-cols:${rows[0].length}">${rows.flatMap((row, rowIndex) => row.map((value, columnIndex) => `<span class="${marked.has(`${rowIndex}:${columnIndex}`) ? "marked" : ""}">${value}</span>`)).join("")}</div></figure>`;
};

const formula = (title, expression, note) => `<aside class="vision-formula-card"><span>${title}</span><code>${expression}</code><p>${note}</p></aside>`;

const flow = steps => `<div class="vl-flow">${steps.map((step, index) => `${index ? '<i aria-hidden="true">→</i>' : ""}<strong>${step}</strong>`).join("")}</div>`;

const brief = items => `<div class="vision-design-brief">${items.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</div>`;

const projectionSvg = `<svg class="vl-svg" viewBox="0 0 720 330" role="img" aria-label="Điểm ba chiều được chiếu qua tâm camera lên mặt phẳng ảnh">
  <line class="vl-axis" x1="72" y1="260" x2="660" y2="260"/><line class="vl-axis" x1="210" y1="294" x2="210" y2="45"/>
  <polygon class="vl-plane" points="520,70 650,112 650,282 520,240"/><line class="vl-ray" x1="210" y1="260" x2="610" y2="148"/>
  <circle class="vl-point camera" cx="210" cy="260" r="10"/><circle class="vl-point world" cx="430" cy="198" r="12"/><circle class="vl-point image" cx="610" cy="148" r="11"/>
  <text x="188" y="318">C = (0,0,0)</text><text x="395" y="186">P = (X,Y,Z)</text><text x="584" y="134">p = (u,v)</text><text x="590" y="306">Z = f</text>
</svg>`;

const boxesSvg = `<svg class="vl-svg" viewBox="0 0 720 310" role="img" aria-label="Nhiều hộp ứng viên chồng lên cùng một vật và hộp tốt nhất được giữ lại">
  <rect class="vl-scene" x="48" y="40" width="624" height="230" rx="18"/><circle class="vl-target" cx="360" cy="155" r="48"/>
  <rect class="vl-box weak" x="270" y="78" width="170" height="150"/><rect class="vl-box weak" x="304" y="90" width="158" height="142"/><rect class="vl-box strong" x="288" y="76" width="158" height="158"/>
  <text x="72" y="74">0.71</text><text x="472" y="106">0.79</text><text x="456" y="242">0.94 · GIỮ</text>
</svg>`;

const perspectiveSvg = `<svg class="vl-svg" viewBox="0 0 720 310" role="img" aria-label="Bốn điểm trên tứ giác xiên được ánh xạ sang bốn góc hình chữ nhật">
  <polygon class="vl-quad" points="70,78 285,42 258,258 105,225"/><text x="138" y="286">MẶT PHẲNG XIÊN</text>
  <path class="vl-map-arrow" d="M318 150 H405"/><polygon class="vl-arrow-head" points="405,150 383,137 383,163"/>
  <rect class="vl-rectified" x="442" y="55" width="215" height="190"/><text x="484" y="286">ẢNH NẮN THẲNG</text>
  <g class="vl-corners"><circle cx="70" cy="78" r="8"/><circle cx="285" cy="42" r="8"/><circle cx="258" cy="258" r="8"/><circle cx="105" cy="225" r="8"/><circle cx="442" cy="55" r="8"/><circle cx="657" cy="55" r="8"/><circle cx="657" cy="245" r="8"/><circle cx="442" cy="245" r="8"/></g>
</svg>`;

const motionSvg = `<svg class="vl-svg" viewBox="0 0 720 300" role="img" aria-label="Tâm của vật được tìm trong bốn frame rồi nối thành quỹ đạo">
  <g class="vl-frames"><rect x="32" y="55" width="145" height="160"/><rect x="202" y="55" width="145" height="160"/><rect x="372" y="55" width="145" height="160"/><rect x="542" y="55" width="145" height="160"/></g>
  <g class="vl-moving"><circle cx="82" cy="168" r="18"/><circle cx="260" cy="142" r="18"/><circle cx="442" cy="115" r="18"/><circle cx="631" cy="88" r="18"/></g>
  <polyline class="vl-track" points="82,168 260,142 442,115 631,88"/><g class="vl-frame-labels"><text x="86" y="244">t0</text><text x="256" y="244">t1</text><text x="426" y="244">t2</text><text x="596" y="244">t3</text></g>
</svg>`;

export const VISION_LAB_DECKS = Object.freeze({
  projection: [
    { tab: "Mô hình", title: "Từ tọa độ không gian đến mặt phẳng ảnh", lead: "Chọn tâm camera làm gốc. Điểm P = (X, Y, Z) nằm trước camera; mặt phẳng ảnh cách tâm một tiêu cự f.", visual: projectionSvg },
    { tab: "Suy ra", title: "Chia cho độ sâu tạo ra phối cảnh", lead: "Tam giác đồng dạng theo hai phương cho cùng một mẫu tính. Z càng lớn thì điểm ảnh càng tiến gần tâm ảnh.", visual: `<div class="vl-two">${formula("PHÉP CHIẾU", "u = f × X / Z", "Tọa độ ngang trên mặt phẳng ảnh.")}${formula("PHÉP CHIẾU", "v = f × Y / Z", "Tọa độ dọc trên mặt phẳng ảnh.")}</div>` },
    { tab: "Project", title: "Hiệu chỉnh một máy chiếu điểm 3D", lead: "Chương trình nhận ba điểm đã đo sẵn, chiếu từng điểm và kiểm tra điểm nào nằm trong khung ảnh.", visual: brief([["ĐÃ CHO", "f = 120 px · khung ±80 × ±60"], ["DỮ LIỆU", "A(2,1,4) · B(-3,1,6) · C(1,-2,8)"], ["CẦN TÍNH", "(u,v) của A, B, C"], ["KẾT LUẬN", "điểm nào còn nằm trong khung"]]) },
  ],
  rgb: [
    { tab: "Mô hình", title: "Ảnh số là một lưới số có cấu trúc", lead: "Mỗi vị trí hàng-cột chứa ba cường độ R, G, B. Cùng tọa độ nhưng ba kênh đo ba thành phần màu khác nhau.", visual: `<div class="vl-grid-row">${matrix([[255,40],[30,10]],{label:"KÊNH R",highlight:[[0,0]]})}${matrix([[20,210],[60,20]],{label:"KÊNH G",highlight:[[0,1]]})}${matrix([[30,40],[220,20]],{label:"KÊNH B",highlight:[[1,0]]})}</div>` },
    { tab: "Độ sáng", title: "Ảnh xám giữ độ sáng, bỏ thông tin màu", lead: "Công thức có trọng số phản ánh việc mắt người nhạy với màu lục hơn màu lam.", visual: `<div class="vl-two">${formula("LUMINANCE", "gray = 0.299R + 0.587G + 0.114B", "Làm tròn về số nguyên sau khi cộng ba thành phần.")}${matrix([[91,139],[69,20]],{label:"MA TRẬN XÁM"})}</div>` },
    { tab: "Project", title: "Xây bộ chuyển đổi RGB → grayscale", lead: "Duyệt toàn bộ ảnh 3×3, tạo một ma trận xám mới rồi tìm pixel sáng nhất.", visual: brief([["ĐÃ CHO", "ảnh RGB 3×3 trong starter code"], ["CẦN TẠO", "ma trận gray 3×3"], ["CẦN ĐO", "giá trị sáng nhất và tọa độ"], ["BẰNG CHỨNG", "in ba hàng xám và kết luận"]]) },
  ],
  kernel: [
    { tab: "Cửa sổ", title: "Kernel chỉ nhìn một lân cận nhỏ tại mỗi lần tính", lead: "Tâm kernel đặt lên một pixel. Cửa sổ 3×3 chọn đúng chín giá trị quanh tâm đó.", visual: `<div class="vl-grid-row">${matrix([[2,3,4,1,0],[1,8,6,2,1],[0,4,9,5,2],[1,3,7,6,1],[0,2,3,4,2]],{label:"ẢNH",highlight:[[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]})}${matrix([[0,-1,0],[-1,4,-1],[0,-1,0]],{label:"KERNEL"})}</div>` },
    { tab: "Nhân-cộng", title: "Một đầu ra là tổng của chín tích", lead: "Nhân từng ô trong cửa sổ với ô kernel cùng vị trí, rồi cộng tất cả kết quả.", visual: formula("TẠI (r,c)", "out[r][c] = Σ image[r+i][c+j] × kernel[i][j]", "Với kernel 3×3, i và j chạy từ -1 đến 1 quanh tâm.") },
    { tab: "Project", title: "Viết máy quét kernel 3×3", lead: "Chỉ tính các vị trí mà cửa sổ nằm trọn trong ảnh 5×5; đầu ra vì thế có kích thước 3×3.", visual: brief([["ĐÃ CHO", "ảnh 5×5 và kernel phát hiện điểm nổi"], ["CẦN TẠO", "response 3×3"], ["CẦN TÌM", "giá trị lớn nhất và tọa độ tâm"], ["BẰNG CHỨNG", "in response và BEST"]]) },
  ],
  blur: [
    { tab: "Nhiễu", title: "Nhiễu tạo biến thiên cục bộ không thuộc về vật", lead: "Một pixel quá sáng giữa vùng gần như đồng nhất có thể là nhiễu xung, không phải chi tiết thật.", visual: `<div class="vl-grid-row">${matrix([[10,11,10,10,9],[10,12,11,9,10],[11,10,90,11,10],[9,11,10,12,11],[10,10,9,11,10]],{label:"ẢNH NHIỄU",highlight:[[2,2]]})}${matrix([[10,11,10],[11,18,11],[10,11,11]],{label:"SAU BOX BLUR"})}</div>` },
    { tab: "Bộ lọc", title: "Box blur thay pixel bằng trung bình lân cận", lead: "Kernel trung bình có tổng trọng số bằng 1, nên vùng phẳng gần như giữ nguyên mức sáng chung.", visual: `<div class="vl-two">${matrix([["1/9","1/9","1/9"],["1/9","1/9","1/9"],["1/9","1/9","1/9"]],{label:"BOX KERNEL"})}${formula("TRUNG BÌNH", "blur = sum(window) / 9", "Đổi lại, biên sắc nét cũng bị làm mềm.")}</div>` },
    { tab: "Project", title: "Đo thỏa hiệp giữa khử nhiễu và mất chi tiết", lead: "Tự blur ảnh 5×5, rồi so biên độ max-min trước và sau lọc thay vì chỉ nói ảnh 'đẹp hơn'.", visual: brief([["ĐÃ CHO", "ảnh 5×5 có một điểm nhiễu"], ["CẦN TẠO", "ảnh blur phần trong 3×3"], ["CẦN ĐO", "range trước và sau"], ["KẾT LUẬN", "nhiễu giảm bao nhiêu"]]) },
  ],
  edge: [
    { tab: "Gradient", title: "Viền là nơi cường độ thay đổi nhanh", lead: "Đạo hàm rời rạc được ước lượng bằng hiệu giữa các pixel ở hai phía.", visual: `<div class="vl-signal"><span style="--vl-h:18%">10</span><span style="--vl-h:20%">12</span><span style="--vl-h:22%">14</span><span style="--vl-h:78%">80</span><span style="--vl-h:82%">84</span><span style="--vl-h:80%">82</span></div>` },
    { tab: "Hai hướng", title: "Gradient ngang và dọc tạo thành một vector", lead: "Gx đo thay đổi trái-phải; Gy đo thay đổi trên-dưới. Độ lớn cho biết viền mạnh đến đâu.", visual: `<div class="vl-two">${formula("SOBEL", "magnitude ≈ |Gx| + |Gy|", "Bản đơn giản tránh căn bậc hai nhưng vẫn xếp hạng được viền.")}${flow(["ảnh xám","Gx, Gy","độ lớn","edge map"])}</div>` },
    { tab: "Project", title: "Dựng máy tìm viền trên ma trận nhỏ", lead: "Áp hai kernel Sobel ở phần trong ảnh, tính độ lớn và tìm tọa độ viền mạnh nhất.", visual: brief([["ĐÃ CHO", "ảnh 5×5 có một đường sáng"], ["CẦN TẠO", "magnitude 3×3"], ["CẦN TÌM", "MAX EDGE và tọa độ"], ["BẰNG CHỨNG", "in bản đồ độ lớn"]]) },
  ],
  threshold: [
    { tab: "Quy tắc", title: "Threshold biến phép đo liên tục thành quyết định", lead: "Mỗi pixel được so với ngưỡng T để tạo mask nhị phân.", visual: `<div class="vl-grid-row">${matrix([[12,18,64,81],[10,22,70,90],[9,17,58,88]],{label:"ẢNH XÁM"})}${matrix([[0,0,1,1],[0,0,1,1],[0,0,1,1]],{label:"MASK T = 50",highlight:[[0,2],[0,3],[1,2],[1,3],[2,2],[2,3]]})}</div>` },
    { tab: "Đánh giá", title: "Ngưỡng là một giả thuyết về dữ liệu", lead: "T quá thấp nhận thêm nền; T quá cao làm mất vật. Vì vậy phải đo số pixel và vùng kết nối tạo ra.", visual: formula("MASK", "mask[r][c] = 1 if gray[r][c] >= T else 0", "Foreground là các ô 1; background là các ô 0.") },
    { tab: "Project", title: "Phân đoạn một vật sáng và tìm bounding box", lead: "Tạo mask, đếm pixel foreground, rồi lấy hàng-cột nhỏ nhất/lớn nhất của các ô 1.", visual: brief([["ĐÃ CHO", "ảnh xám 6×6 · T = 50"], ["CẦN TẠO", "mask 0/1"], ["CẦN ĐO", "AREA và BBOX"], ["CA THẤT BẠI", "thử T = 85 và giải thích"]]) },
  ],
  sad: [
    { tab: "Trượt mẫu", title: "Template matching kiểm tra mọi vị trí hợp lệ", lead: "Template 2×2 trượt trên scene 5×6. Mỗi vị trí tạo ra một điểm sai khác.", visual: `<div class="vl-grid-row">${matrix([[3,3,8,8,1,1],[3,3,8,8,1,1],[2,2,7,9,0,0],[4,4,6,6,2,2],[4,4,6,6,2,2]],{label:"SCENE",highlight:[[1,2],[1,3],[2,2],[2,3]]})}${matrix([[8,8],[7,9]],{label:"TEMPLATE"})}</div>` },
    { tab: "Điểm lỗi", title: "SAD và SSD đo sai khác theo hai cách", lead: "Cả hai đều tốt nhất khi bằng 0. SSD phạt sai số lớn mạnh hơn vì bình phương từng hiệu.", visual: `<div class="vl-two">${formula("SAD", "Σ |scene - template|", "Điểm thấp hơn là khớp tốt hơn.")}${formula("SSD", "Σ (scene - template)²", "Nhạy hơn với một sai số rất lớn.")}</div>` },
    { tab: "Project", title: "Tự viết bộ định vị template bằng SAD", lead: "Tạo response map đầy đủ, giữ điểm nhỏ nhất và trả về góc trên-trái của mẫu.", visual: brief([["ĐÃ CHO", "scene 5×6 · template 2×2"], ["CẦN TẠO", "response 4×5"], ["CẦN TÌM", "BEST SCORE"], ["BẰNG CHỨNG", "LOCATION = row,column"]]) },
  ],
  ncc: [
    { tab: "Vấn đề", title: "SAD thay đổi khi toàn cảnh sáng lên", lead: "Cùng một cấu trúc có thể cộng thêm một mức sáng ở mọi pixel. So trực tiếp sẽ báo sai khác dù hình dạng vẫn giống.", visual: `<div class="vl-grid-row">${matrix([[10,20],[30,40]],{label:"TEMPLATE"})}${matrix([[40,50],[60,70]],{label:"CÙNG MẪU +30"})}</div>` },
    { tab: "Chuẩn hóa", title: "NCC so độ lệch quanh trung bình", lead: "Trừ mean loại bỏ dịch sáng; chia cho độ lớn vector đưa hai vùng về cùng thang đo.", visual: formula("ZNCC", "Σ((I-Ī)(T-T̄)) / √(Σ(I-Ī)² Σ(T-T̄)²)", "Giá trị gần 1 biểu thị cấu trúc biến thiên cùng hướng.") },
    { tab: "Project", title: "Dựng response map chịu được đổi sáng", lead: "Tự tính ZNCC cho từng cửa sổ 2×2 và chứng minh vị trí đúng vẫn có điểm gần 1 khi scene sáng hơn.", visual: brief([["ĐÃ CHO", "scene và template 2×2"], ["CẦN TẠO", "response ZNCC"], ["CẦN TÌM", "điểm cao nhất"], ["BẰNG CHỨNG", "vị trí đúng và score 1.00"]]) },
  ],
  nms: [
    { tab: "Ứng viên", title: "Một vật có thể tạo ra nhiều box gần nhau", lead: "Các vị trí lân cận thường đều đạt ngưỡng, nên response map chưa phải danh sách phát hiện cuối cùng.", visual: boxesSvg },
    { tab: "IoU", title: "NMS giữ box mạnh và loại box chồng quá nhiều", lead: "Sắp box theo score giảm dần; giữ box đầu tiên rồi bỏ box có IoU vượt ngưỡng.", visual: `<div class="vl-two">${formula("INTERSECTION OVER UNION", "IoU = area(intersection) / area(union)", "IoU = 0 khi không chồng; IoU = 1 khi trùng nhau.")}${flow(["sort score","giữ box tốt","tính IoU","loại box trùng"])}</div>` },
    { tab: "Project", title: "Viết NMS cho danh sách phát hiện", lead: "Tính IoU, thực hiện NMS và kiểm tra rằng hai cụm vật khác nhau vẫn được giữ.", visual: brief([["ĐÃ CHO", "5 box kèm score"], ["NGƯỠNG", "IoU > 0.30 thì loại"], ["CẦN TẠO", "danh sách kept"], ["BẰNG CHỨNG", "giữ đúng 2 detection"]]) },
  ],
  opencv: [
    { tab: "Đối chiếu", title: "Thư viện chỉ đóng gói cơ chế đã học", lead: "Cùng scene và template phải đi qua hai đường: vòng lặp tự viết và cv2.matchTemplate.", visual: `<div class="vl-compare">${flow(["scene","vòng lặp SAD","best row,col"])}${flow(["scene","TM_SQDIFF","minLoc x,y"])}</div>` },
    { tab: "Quy ước", title: "Đọc đúng chiều của điểm và tọa độ", lead: "TM_SQDIFF chọn giá trị nhỏ nhất. OpenCV trả tọa độ theo (x,y), tương ứng (column,row) trong ma trận Python.", visual: `<div class="vl-two">${formula("PURE PYTHON", "best = (row, column)", "Duyệt hàng trước, cột sau.")}${formula("OPENCV", "minLoc = (x, y)", "Đổi thành (y, x) để đối chiếu.")}</div>` },
    { tab: "Project", title: "Kiểm chứng OpenCV bằng phép đo độc lập", lead: "Chạy hai cách trên cùng dữ liệu, so vị trí và điểm; fallback thuần Python vẫn cho phép hoàn thành khi package không tải được.", visual: brief([["ĐÃ CHO", "scene 5×6 · template 2×2"], ["ĐƯỜNG A", "hàm ssd_match tự viết"], ["ĐƯỜNG B", "cv2.matchTemplate"], ["TIÊU CHÍ", "MATCH = True"]]) },
  ],
  perspective: [
    { tab: "Hình học", title: "Phép chiếu phối cảnh bảo toàn đường thẳng", lead: "Bốn góc trên mặt phẳng xiên xác định một homography đưa chúng tới bốn góc đích.", visual: perspectiveSvg },
    { tab: "Ma trận H", title: "Một homography có tám bậc tự do", lead: "Tọa độ đồng nhất cho phép biểu diễn phép biến đổi bằng ma trận 3×3, sau đó chia cho thành phần w.", visual: formula("HOMOGRAPHY", "[x', y', w']ᵀ = H [x, y, 1]ᵀ; u=x'/w', v=y'/w'", "Bốn cặp điểm cung cấp tám phương trình để tìm tám tỉ lệ độc lập.") },
    { tab: "Project", title: "Nắn một bảng 4×4 bằng ánh xạ song tuyến tính", lead: "Với tứ giác đã căn theo hàng trong dữ liệu nhỏ, tính vị trí nguồn cho từng pixel đích và lấy mẫu gần nhất; sau đó đối chiếu nguyên lý với homography tổng quát.", visual: brief([["ĐÃ CHO", "bảng xiên 6×6 và bốn góc"], ["CẦN TẠO", "ảnh đích 4×4"], ["LẤY MẪU", "nearest neighbor"], ["BẰNG CHỨNG", "bốn góc đích đúng"]]) },
  ],
  motion: [
    { tab: "Chuỗi frame", title: "Chuyển động là thay đổi có cấu trúc theo thời gian", lead: "Mỗi frame riêng lẻ chỉ cho vị trí; chuỗi tâm theo thời gian mới cho quỹ đạo.", visual: motionSvg },
    { tab: "Frame diff", title: "Trừ hai frame làm nổi vùng vừa thay đổi", lead: "Lấy trị tuyệt đối của hiệu, threshold thành mask rồi tính tâm của các pixel đổi.", visual: `<div class="vl-two">${formula("SAI KHÁC", "diff = |frame[t] - frame[t-1]|", "Pixel tĩnh gần 0; vùng vật cũ và mới có giá trị lớn.")}${flow(["frame diff","threshold","mask","centroid"])}</div>` },
    { tab: "Project", title: "Theo dõi tâm vật qua bốn frame", lead: "Với nền biết trước, threshold vật sáng ở từng frame, tính centroid và suy ra hướng chuyển động tổng thể.", visual: brief([["ĐÃ CHO", "4 frame 6×8"], ["CẦN TÌM", "centroid mỗi frame"], ["CẦN ĐO", "dx, dy toàn quãng"], ["KẾT LUẬN", "RIGHT-UP / RIGHT-DOWN / ..."]]) },
  ],
  capstone: [
    { tab: "Pipeline", title: "Một hệ thị giác là chuỗi giả thuyết có thể kiểm tra", lead: "Mỗi bước biến đổi dữ liệu và phải để lại bằng chứng: ma trận trung gian, điểm số hoặc box.", visual: flow(["grayscale","blur","response","threshold","NMS","track"]) },
    { tab: "Confidence", title: "Hệ thống phải biết khi nào chưa đủ chắc chắn", lead: "Điểm tốt nhất chỉ có ý nghĩa khi tách đủ xa điểm thứ hai và vượt ngưỡng đã hiệu chỉnh.", visual: `<div class="vl-two">${formula("MARGIN", "confidence = best - second_best", "Với NCC, khoảng cách lớn hơn thường đáng tin hơn.")}${formula("FAIL-SAFE", "if best < T: NO DETECTION", "Không ép hệ thống luôn phải đưa ra một box.")}</div>` },
    { tab: "Project", title: "Trạm săn ấn cổ: báo cáo cả thành công lẫn thất bại", lead: "Ghép grayscale, blur, ZNCC, threshold và NMS trên ba frame; xuất track, confidence và một ca ánh sáng làm hệ thống từ chối.", visual: brief([["ĐÃ CHO", "3 frame RGB nhỏ · 1 template"], ["PIPELINE", "gray → blur → ZNCC → NMS"], ["BÁO CÁO", "box · track · confidence"], ["AN TOÀN", "NO DETECTION khi dưới ngưỡng"]]) },
  ],
});
