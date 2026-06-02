+++
date = '2026-04-16'
draft = false
title = 'Machine Learning Exam Review — Interactive Study Guide'
description = 'Ôn thi Machine Learning: SVM, Reinforcement Learning, HMM, Bayesian Learning, Clustering, Tensor — có tool tính toán tương tác.'
tags = ['machine-learning', 'study', 'interactive', 'exam']
aliases = ['/posts/ml-exam-review/']
+++

Trang ôn thi Machine Learning tương tác — tổng hợp từ buổi review của thầy. Mỗi bài có lý thuyết tóm tắt + công cụ tính toán chạy trực tiếp trên trình duyệt.

**Nội dung thi:** Bài 5 → Bài 10 (từ sau Tết). Bài 1–4 (giới thiệu, Neural Network, Ensemble) không thi.

<style>
.ml-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:1.2em 0 0.5em}
.ml-tab{padding:8px 18px;border:2px solid #888;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.95em;background:transparent;transition:all .2s}
.ml-tab:hover{border-color:#4a90d9;color:#4a90d9}
.ml-tab.active{background:#4a90d9;color:#fff;border-color:#4a90d9}
.ml-section{display:none;border:1px solid #ddd;border-radius:10px;padding:1.5em;margin:0.5em 0 1.5em;background:var(--entry,#fff)}
.ml-section.active{display:block}
.ml-calc{background:var(--code-bg,#f6f6f6);border:1px solid #ccc;border-radius:8px;padding:1.2em;margin:1em 0}
.ml-calc h4{margin:0 0 0.8em;color:#4a90d9}
.ml-calc label{display:block;margin:0.4em 0 0.2em;font-weight:600;font-size:0.9em}
.ml-calc input,.ml-calc select{padding:6px 10px;border:1px solid #aaa;border-radius:5px;font-size:0.9em;width:100%;max-width:320px;margin-bottom:0.3em;background:var(--entry,#fff);color:var(--primary,#333)}
.ml-calc textarea{padding:6px 10px;border:1px solid #aaa;border-radius:5px;font-size:0.85em;width:100%;font-family:monospace;background:var(--entry,#fff);color:var(--primary,#333);resize:vertical}
.ml-btn{padding:8px 20px;border:none;border-radius:6px;background:#4a90d9;color:#fff;font-weight:600;cursor:pointer;font-size:0.9em;margin:0.5em 4px 0.5em 0;transition:background .2s}
.ml-btn:hover{background:#357abd}
.ml-btn.secondary{background:#6c757d}
.ml-btn.secondary:hover{background:#545b62}
.ml-result{background:var(--entry,#fff);border:1px solid #4a90d9;border-radius:8px;padding:1em;margin:0.8em 0;font-family:monospace;font-size:0.88em;white-space:pre-wrap;line-height:1.6;max-height:600px;overflow-y:auto}
.ml-grid{display:grid;grid-template-columns:1fr 1fr;gap:1em}
@media(max-width:700px){.ml-grid{grid-template-columns:1fr}}
.ml-note{background:#fff3cd;border-left:4px solid #ffc107;padding:0.8em 1em;margin:0.8em 0;border-radius:0 6px 6px 0;font-size:0.92em}
.ml-note.exam{background:#d4edda;border-left-color:#28a745}
.ml-formula{background:var(--code-bg,#f6f6f6);padding:0.6em 1em;border-radius:6px;font-family:monospace;margin:0.5em 0;overflow-x:auto;font-size:0.9em}
.ml-compare{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #ccc;border-radius:8px;overflow:hidden;margin:0.8em 0}
.ml-compare>div{padding:0.8em 1em}
.ml-compare>div:first-child{border-right:1px solid #ccc}
.ml-compare h5{margin:0 0 0.5em;text-align:center}
table.ml-tbl{width:100%;border-collapse:collapse;margin:0.8em 0;font-size:0.9em}
table.ml-tbl th,table.ml-tbl td{border:1px solid #ccc;padding:6px 10px;text-align:center}
table.ml-tbl th{background:var(--code-bg,#f0f0f0);font-weight:600}
</style>

<div class="ml-tabs" id="mainTabs">
<button class="ml-tab active" onclick="showSection('svm')">Bài 5: SVM</button>
<button class="ml-tab" onclick="showSection('rl')">Bài 6: RL</button>
<button class="ml-tab" onclick="showSection('hmm')">Bài 7: Markov & HMM</button>
<button class="ml-tab" onclick="showSection('bayes')">Bài 8: Bayesian</button>
<button class="ml-tab" onclick="showSection('cluster')">Bài 9: Clustering</button>
<button class="ml-tab" onclick="showSection('tensor')">Bài 10: Tensor</button>
</div>

<!-- ==================== BÀI 5: SVM ==================== -->
<div class="ml-section active" id="sec-svm">

### Bài 5 — Support Vector Machine (SVM)

<div class="ml-note exam">
<strong>Thầy dặn 3 câu hỏi quan trọng:</strong><br>
1. Siêu phẳng (hyperplane) là gì?<br>
2. Support vector là gì?<br>
3. Tiêu chí để chọn siêu phẳng tối ưu là gì?<br>
+ Ý nghĩa hàm Lagrange + Tại sao cần soft margin (slack variable)?
</div>

**Siêu phẳng (Hyperplane):** Đường biên quyết định phân tách 2 lớp. Phương trình: `w·x + b = 0`
- 2D → đường thẳng, 3D → mặt phẳng, nD → không gian (n−1) chiều

**Support Vector:** Những điểm dữ liệu nằm đúng trên margin boundary (`w·x + b = ±1`). Xóa bất kỳ điểm nào không phải SV → siêu phẳng không đổi.

**Tiêu chí tối ưu:** Tối đa hóa margin = `2/||w||` ↔ Minimize `||w||²/2`

<div class="ml-formula">
Điều kiện: yᵢ·(w·xᵢ + b) ≥ 1  với mọi điểm i
- yᵢ = nhãn (+1 hoặc −1), w·xᵢ + b = giá trị dự đoán thô
- Tích yᵢ·(w·xᵢ + b) ≥ 1 → đúng phía VÀ đủ xa siêu phẳng
</div>

**Hàm Lagrange** — gom mục tiêu tối ưu + điều kiện vào chung 1 hàm số, giải đạo hàm = 0 để tìm nghiệm:

<div class="ml-formula">
L(w,b,α) = ||w||²/2 − Σ αᵢ·[yᵢ·(w·xᵢ+b) − 1]

Giải ∂L/∂w = 0 → w = Σ αᵢ·yᵢ·xᵢ
Giải ∂L/∂b = 0 → Σ αᵢ·yᵢ = 0
→ Chuyển sang Dual Problem (chỉ còn biến α)
→ Giải bằng Quadratic Programming (SMO)
→ Điểm có αᵢ > 0 chính là Support Vector
</div>

**Soft Margin (Slack Variable ξᵢ)** — Tại sao cần?

<div class="ml-note">
<strong>Thầy nhấn mạnh:</strong> Nếu không có slack variable, bài toán có thể KHÔNG CÓ NGHIỆM (tìm hoài không có siêu phẳng thoả tất cả điều kiện). Thêm ξᵢ để relaxation → đảm bảo bài toán luôn có nghiệm.
</div>

<div class="ml-formula">
Minimize: ||w||²/2 + C·Σξᵢ
Subject to: yᵢ·(w·xᵢ+b) ≥ 1 − ξᵢ,  ξᵢ ≥ 0

C lớn → phạt nặng → margin nhỏ, ít lỗi
C nhỏ → chấp nhận lỗi → margin rộng hơn
ξᵢ = 0: đúng chỗ | 0 < ξᵢ ≤ 1: trong margin | ξᵢ > 1: phân loại sai
</div>

<div class="ml-calc">
<h4>SVM Margin Calculator</h4>
<p>Cho 2 lớp dữ liệu 2D, tính margin và kiểm tra support vector.</p>
<div class="ml-grid">
<div>
<label>Nhóm +1 (mỗi dòng: x1,x2)</label>
<textarea id="svm-pos" rows="3" placeholder="2,3&#10;3,3&#10;4,5">2,3
3,3
4,5</textarea>
<label>Nhóm −1 (mỗi dòng: x1,x2)</label>
<textarea id="svm-neg" rows="3" placeholder="0,1&#10;1,0&#10;1,1">0,1
1,0
1,1</textarea>
</div>
<div>
<label>w₁ (trọng số thứ 1)</label>
<input type="number" id="svm-w1" value="1" step="0.1">
<label>w₂ (trọng số thứ 2)</label>
<input type="number" id="svm-w2" value="1" step="0.1">
<label>b (bias)</label>
<input type="number" id="svm-b" value="-3" step="0.1">
</div>
</div>
<button class="ml-btn" onclick="calcSVM()">Tính Margin & Kiểm tra</button>
<div class="ml-result" id="svm-result" style="display:none"></div>
</div>

</div>

<!-- ==================== BÀI 6: REINFORCEMENT LEARNING ==================== -->
<div class="ml-section" id="sec-rl">

### Bài 6 — Reinforcement Learning (Học tăng cường)

<div class="ml-note exam">
<strong>Thầy dặn sẽ hỏi:</strong><br>
1. RL dựa trên phương trình gì? → Bellman<br>
2. Trong 5 yếu tố (Agent, Environment, State, Action, Reward) — cái nào lưu trữ kiến thức? → Reward<br>
3. Quá trình học dựa trên nguyên lý gì? → Thử và sai (Trial & Error)<br>
4. RL có cần dữ liệu học không? → Không<br>
5. Policy là gì? → Ánh xạ State → Action
</div>

**5 thành phần:** Agent (ra quyết định), Environment (môi trường), State s (trạng thái), Action a (hành động), Reward r (điểm thưởng — **lưu trữ kiến thức**)

**Phương trình Bellman:**

<div class="ml-formula">
V(s) = max_a [ R(s,a) + γ · V(s') ]

"Giá trị state hiện tại = reward ngay + γ × giá trị state tiếp theo"
γ (gamma) = discount factor (0→1): γ gần 1 → quan tâm tương lai
</div>

**Cơ chế lan truyền Reward** (thầy nhấn mạnh):
- Khi đạt Goal → Reward nhảy lên rất lớn
- Reward đó **lan truyền ngược** (estimation) cho các trạng thái lân cận
- Trạng thái lân cận cũng được cập nhật reward lớn theo
- Lặp đi lặp lại → bản đồ reward phủ hết map → tại bất kỳ vị trí nào đều biết hướng đi tốt nhất

**Policy (π):** Tập hợp các cặp (trạng thái → hành động tương ứng)

**Q-Learning:**

<div class="ml-formula">
Q(s,a) = R(s,a) + γ · max_a' Q(s', a')

Cập nhật: Q(s,a) ← Q(s,a) + α·[r + γ·max Q(s',a') − Q(s,a)]
                                   ↑ TD Error

α = learning rate | ε-greedy: ε% khám phá, (1−ε)% khai thác
</div>

<div class="ml-note">
<strong>Thầy giải thích:</strong> RL không cần dữ liệu học. Đó là lý do các mô hình AI (AlphaGo, ChatGPT) dùng RL — tự sinh dữ liệu, tự đánh giá qua reward, rồi reward lan truyền ngược để cải thiện.
</div>

<div class="ml-calc">
<h4>Q-Learning Step-by-Step Calculator</h4>
<p>Mô phỏng Q-Learning trên grid world. Tính từng bước cập nhật Q-table.</p>
<div class="ml-grid">
<div>
<label>Số states</label>
<input type="number" id="ql-states" value="4" min="2" max="8">
<label>Số actions</label>
<input type="number" id="ql-actions" value="4" min="2" max="6">
<label>Goal state (0-indexed)</label>
<input type="number" id="ql-goal" value="3" min="0">
<label>Reward khi đạt Goal</label>
<input type="number" id="ql-reward" value="10" step="1">
</div>
<div>
<label>α (learning rate)</label>
<input type="number" id="ql-alpha" value="0.5" min="0" max="1" step="0.1">
<label>γ (discount factor)</label>
<input type="number" id="ql-gamma" value="0.9" min="0" max="1" step="0.1">
<label>Transitions (mỗi dòng: s,a,s')</label>
<textarea id="ql-trans" rows="4" placeholder="0,1,1&#10;1,1,3&#10;0,3,2&#10;2,1,3">0,1,1
1,1,3
0,3,2
2,1,3</textarea>
</div>
</div>
<button class="ml-btn" onclick="calcQL()">Chạy Q-Learning</button>
<button class="ml-btn secondary" onclick="calcBellman()">Tính Bellman Value</button>
<div class="ml-result" id="ql-result" style="display:none"></div>
</div>

</div>

<!-- ==================== BÀI 7: MARKOV & HMM ==================== -->
<div class="ml-section" id="sec-hmm">

### Bài 7 — Markov & Hidden Markov Model

<div class="ml-note exam">
<strong>Thầy dặn:</strong><br>
1. Phân biệt Markov vs HMM → HMM thêm ma trận B (emission), state bị ẩn<br>
2. Cho dữ liệu → tính xác suất Markov (công thức 4 trong slide)<br>
3. Mỗi chuỗi observation → sinh 1 mô hình HMM (khác Neural Network: N chuỗi → 1 mô hình)<br>
4. HMM có tính Forward/Backward — KHÁC với Neural Network backpropagation!
</div>

<div class="ml-compare">
<div>
<h5>Markov Model</h5>
- State <strong>quan sát trực tiếp</strong> được<br>
- Tham số: <strong>A, π</strong><br>
- A = ma trận chuyển trạng thái<br>
- π = phân phối ban đầu<br>
- S với observation là 1-1
</div>
<div>
<h5>Hidden Markov Model</h5>
- State <strong>bị ẩn</strong> — chỉ thấy observation<br>
- Tham số: <strong>A, B, π</strong><br>
- B = ma trận emission P(o|s)<br>
- Tính xác suất từ S qua observation<br>
- 1 chuỗi obs → 1 bộ (A,B,π) riêng
</div>
</div>

**Markov Property:** Trạng thái hiện tại chỉ phụ thuộc trạng thái ngay trước đó.

<div class="ml-formula">
P(sₜ | sₜ₋₁, sₜ₋₂, ...) = P(sₜ | sₜ₋₁)

Ví dụ: Hôm nay Nắng → Mai: 70% Nắng, 30% Mưa
        Hôm nay Mưa  → Mai: 40% Nắng, 60% Mưa
</div>

**3 bài toán HMM:**

| Bài toán | Câu hỏi | Thuật toán |
|----------|---------|------------|
| Evaluation | P(O\|HMM) = ? | Forward Algorithm |
| Decoding | Chuỗi state nào tốt nhất? | Viterbi |
| Learning | Tìm A, B, π tốt nhất | Baum-Welch (Forward-Backward) |

<div class="ml-note">
<strong>Thầy nhấn mạnh điểm khác NN:</strong> Neural Network: N chuỗi dữ liệu → train → 1 mô hình. HMM: mỗi chuỗi observation train → 1 bộ tham số riêng. N chuỗi → N mô hình HMM. Forward-Backward trong HMM KHÔNG giống backpropagation trong Neural Network.
</div>

<div class="ml-calc">
<h4>Markov Chain Calculator</h4>
<p>Tính xác suất chuỗi trạng thái trong Markov Model.</p>
<div class="ml-grid">
<div>
<label>States (phân cách bởi dấu phẩy)</label>
<input type="text" id="mc-states" value="Nắng,Mưa">
<label>Ma trận A (mỗi dòng = 1 hàng, phân cách bởi dấu phẩy)</label>
<textarea id="mc-A" rows="2" placeholder="0.7,0.3&#10;0.4,0.6">0.7,0.3
0.4,0.6</textarea>
<label>π (phân phối ban đầu)</label>
<input type="text" id="mc-pi" value="0.6,0.4">
</div>
<div>
<label>Chuỗi trạng thái cần tính (tên state)</label>
<input type="text" id="mc-seq" value="Nắng,Nắng,Mưa" placeholder="Nắng,Nắng,Mưa">
</div>
</div>
<button class="ml-btn" onclick="calcMarkov()">Tính xác suất Markov</button>
<div class="ml-result" id="mc-result" style="display:none"></div>
</div>

<div class="ml-calc">
<h4>HMM Forward Algorithm Calculator</h4>
<p>Tính P(O|HMM) — xác suất sinh ra chuỗi observation.</p>
<div class="ml-grid">
<div>
<label>Hidden States (phân cách bởi dấu phẩy)</label>
<input type="text" id="hmm-states" value="Nắng,Mưa">
<label>Observations (phân cách bởi dấu phẩy)</label>
<input type="text" id="hmm-obs" value="Áo thun,Áo mưa">
<label>π (phân phối ban đầu)</label>
<input type="text" id="hmm-pi" value="0.6,0.4">
</div>
<div>
<label>Ma trận A (chuyển trạng thái)</label>
<textarea id="hmm-A" rows="2">0.7,0.3
0.4,0.6</textarea>
<label>Ma trận B (emission)</label>
<textarea id="hmm-B" rows="2">0.8,0.2
0.3,0.7</textarea>
<label>Chuỗi observation cần tính</label>
<input type="text" id="hmm-seq" value="Áo thun,Áo mưa,Áo thun">
</div>
</div>
<button class="ml-btn" onclick="calcForward()">Forward Algorithm</button>
<button class="ml-btn secondary" onclick="calcViterbi()">Viterbi Algorithm</button>
<div class="ml-result" id="hmm-result" style="display:none"></div>
</div>

</div>

<!-- ==================== BÀI 8: BAYESIAN LEARNING ==================== -->
<div class="ml-section" id="sec-bayes">

### Bài 8 — Bayesian Learning

<div class="ml-note exam">
<strong>Thầy dặn:</strong><br>
1. Phân biệt MLE (Maximum Likelihood Estimation) vs MAP (Maximum A Posteriori) — 2 bài toán KHÁC NHAU<br>
2. MLE: chi phí tính toán LỚN hơn nhiều so với MAP (phải khảo sát toàn bộ không gian dữ liệu)<br>
3. Biết tính Naive Bayes — bỏ số vào công thức, đổ số tính thôi<br>
</div>

<div class="ml-compare">
<div>
<h5>MLE — Maximum Likelihood</h5>
- Tìm θ tối đa P(D|θ)<br>
- "Dữ liệu nào sinh ra bởi tham số nào với xác suất cao nhất?"<br>
- <strong>Khảo sát toàn bộ</strong> không gian dữ liệu có thể có<br>
- Chi phí tính toán <strong>RẤT LỚN</strong>
</div>
<div>
<h5>MAP — Maximum A Posteriori</h5>
- Tìm θ tối đa P(θ|D) ∝ P(D|θ)·P(θ)<br>
- Giả sử dữ liệu có tính chất này → áp vào giải<br>
- Giống như <strong>"chiếu xuống"</strong> không gian nhỏ hơn<br>
- Chi phí tính toán <strong>nhỏ hơn nhiều</strong>
</div>
</div>

<div class="ml-formula">
MLE:  θ* = argmax_θ  P(D|θ)           → khảo sát toàn bộ
MAP:  θ* = argmax_θ  P(D|θ) · P(θ)   → giả sử prior, thu hẹp không gian

Bayes' Theorem:
P(θ|D) = P(D|θ) · P(θ) / P(D)
</div>

<div class="ml-note">
<strong>Thầy giải thích:</strong> Tại sao không giải MLE trực tiếp mà chuyển sang MAP? Vì không gian dữ liệu quá lớn, không duyệt hết được. MAP giả sử dữ liệu có tính chất (prior) rồi "chiếu xuống" không gian nhỏ hơn — giống như biết có 2 chiều thì chỉ cần khảo sát trên 2 chiều đó.
</div>

**Naive Bayes:** Giả sử các feature độc lập với nhau.

<div class="ml-formula">
P(C|x₁,x₂,...,xₙ) ∝ P(C) · ∏ P(xᵢ|C)

Bước 1: Tính P(C) cho mỗi class (đếm / tổng)
Bước 2: Tính P(xᵢ|C) cho mỗi feature trong mỗi class
Bước 3: Nhân tất cả lại, so sánh → class nào lớn hơn thì chọn
</div>

<div class="ml-calc">
<h4>Naive Bayes Calculator</h4>
<p>Tính xác suất phân loại theo Naive Bayes. Nhập bảng đếm tần suất.</p>
<div class="ml-grid">
<div>
<label>Classes (phân cách bởi dấu phẩy)</label>
<input type="text" id="nb-classes" value="Yes,No">
<label>Số mẫu mỗi class</label>
<input type="text" id="nb-counts" value="9,5" placeholder="9,5">
<label>Features (phân cách bởi dấu phẩy)</label>
<input type="text" id="nb-features" value="Outlook,Temp,Humidity">
</div>
<div>
<label>Giá trị feature cần phân loại</label>
<input type="text" id="nb-query" value="Sunny,Hot,High" placeholder="Sunny,Hot,High">
<label>P(feature|class) mỗi dòng: feature_val,class,count</label>
<textarea id="nb-data" rows="8" placeholder="Sunny,Yes,2&#10;Sunny,No,3&#10;Hot,Yes,2&#10;Hot,No,2&#10;High,Yes,3&#10;High,No,4">Sunny,Yes,2
Sunny,No,3
Hot,Yes,2
Hot,No,2
High,Yes,3
High,No,4</textarea>
</div>
</div>
<button class="ml-btn" onclick="calcNaiveBayes()">Tính Naive Bayes</button>
<div class="ml-result" id="nb-result" style="display:none"></div>
</div>

</div>

<!-- ==================== BÀI 9: CLUSTERING ==================== -->
<div class="ml-section" id="sec-cluster">

### Bài 9 — Clustering (Phân cụm)

<div class="ml-note exam">
<strong>Thầy dặn:</strong><br>
1. Tại sao phải tính nhiều độ đo khoảng cách? → Bản chất dữ liệu có nhiều yếu tố không khảo sát hết, phải thử và sai<br>
2. Nguyên lý phân cụm: trong cùng nhóm → gần nhau nhất, giữa các nhóm → xa nhau nhất<br>
3. K-Means: mỗi lần khởi tạo khác nhau → centroid khác nhau (không ổn định)<br>
4. Hierarchical Clustering: không bị lỗi khởi tạo như K-Means → ổn định hơn
</div>

**Nguyên lý phân cụm:**

<div class="ml-formula">
Intra-cluster distance (trong nhóm):  càng NHỎ càng tốt
Inter-cluster distance (giữa nhóm):  càng LỚN càng tốt
</div>

**Tại sao cần nhiều độ đo?** Bản chất dữ liệu có nhiều yếu tố không khảo sát hết được → phải thử và sai nhiều loại khoảng cách để tìm cái phù hợp nhất.

**K-Means:**
1. Chọn ngẫu nhiên K centroids
2. Gán mỗi điểm vào centroid gần nhất
3. Tính lại centroid = trung bình các điểm trong cụm
4. Lặp lại bước 2-3 đến khi hội tụ

<div class="ml-note">
<strong>Thầy nhấn mạnh:</strong> K-Means mỗi lần khởi tạo centroid ban đầu khác → kết quả khác. Hierarchical Clustering không bị vấn đề này vì không cần khởi tạo ngẫu nhiên.
</div>

**Hierarchical Clustering:**
- Agglomerative (bottom-up): Bắt đầu mỗi điểm là 1 cụm, merge dần
- Divisive (top-down): Bắt đầu 1 cụm lớn, chia dần

<div class="ml-calc">
<h4>K-Means Calculator</h4>
<p>Chạy K-Means step-by-step trên dữ liệu 2D.</p>
<div class="ml-grid">
<div>
<label>Dữ liệu (mỗi dòng: x1,x2)</label>
<textarea id="km-data" rows="6">1,1
1.5,2
3,4
5,7
3.5,5
4.5,5
3.5,4.5</textarea>
</div>
<div>
<label>K (số cụm)</label>
<input type="number" id="km-k" value="2" min="2" max="5">
<label>Centroids ban đầu (mỗi dòng: x1,x2, để trống = random)</label>
<textarea id="km-centroids" rows="2" placeholder="1,1&#10;5,7">1,1
5,7</textarea>
</div>
</div>
<button class="ml-btn" onclick="calcKMeans()">Chạy K-Means</button>
<div class="ml-result" id="km-result" style="display:none"></div>
</div>

<div class="ml-calc">
<h4>Distance Calculator</h4>
<p>So sánh các độ đo khoảng cách giữa 2 vector.</p>
<div class="ml-grid">
<div>
<label>Vector A</label>
<input type="text" id="dist-a" value="1,2,3" placeholder="1,2,3">
</div>
<div>
<label>Vector B</label>
<input type="text" id="dist-b" value="4,5,6" placeholder="4,5,6">
</div>
</div>
<button class="ml-btn" onclick="calcDistance()">Tính khoảng cách</button>
<div class="ml-result" id="dist-result" style="display:none"></div>
</div>

</div>

<!-- ==================== BÀI 10: TENSOR ==================== -->
<div class="ml-section" id="sec-tensor">

### Bài 10 — Tensor & SVD

<div class="ml-note exam">
<strong>Thầy dặn:</strong><br>
1. Ưu điểm của Tensor: là mảng nhiều chiều, nhiều bậc<br>
2. Phân rã tensor → giảm số biến, NHƯNG tăng tính toán<br>
3. Tuy nhiên tính toán song song được → đáp ứng thời gian thực<br>
4. Hỏi liên quan tới SVD (Singular Value Decomposition)
</div>

**Tensor:** Mảng nhiều chiều, nhiều bậc (scalar → vector → matrix → tensor bậc 3, 4...)

<div class="ml-formula">
Scalar (bậc 0): 5
Vector (bậc 1): [1, 2, 3]
Matrix (bậc 2): [[1,2],[3,4]]
Tensor bậc 3:   [[[1,2],[3,4]], [[5,6],[7,8]]]
</div>

**Phân rã Tensor:**

<div class="ml-compare">
<div>
<h5>Ưu điểm</h5>
- Giảm số biến (dimensionality reduction)<br>
- Tính toán song song được<br>
- Đáp ứng thời gian thực
</div>
<div>
<h5>Nhược điểm</h5>
- Tăng tính toán (chi phí phân rã)<br>
- Cần thuật toán phân rã phù hợp
</div>
</div>

**SVD (Singular Value Decomposition):**

<div class="ml-formula">
A = U · Σ · Vᵀ

A: ma trận gốc (m×n)
U: ma trận trực giao trái (m×m)
Σ: ma trận đường chéo chứa singular values (m×n)
V: ma trận trực giao phải (n×n)

Giảm chiều: giữ lại k singular values lớn nhất
A ≈ Uₖ · Σₖ · Vₖᵀ
</div>

<div class="ml-calc">
<h4>SVD Calculator (Ma trận 2×2)</h4>
<p>Tính SVD cho ma trận 2×2.</p>
<div class="ml-grid">
<div>
<label>Ma trận A (mỗi dòng = 1 hàng)</label>
<textarea id="svd-A" rows="2">3,2
2,3</textarea>
</div>
<div>
<label>Giữ lại k singular values</label>
<input type="number" id="svd-k" value="2" min="1" max="2">
</div>
</div>
<button class="ml-btn" onclick="calcSVD()">Tính SVD</button>
<div class="ml-result" id="svd-result" style="display:none"></div>
</div>

</div>

<!-- ==================== JAVASCRIPT ==================== -->

<script>
function showSection(id){
  document.querySelectorAll('.ml-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ml-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  event.target.classList.add('active');
}

/* ===== SVM ===== */
function calcSVM(){
  const parsePoints=(txt)=>txt.trim().split('\n').map(l=>l.split(',').map(Number));
  const pos=parsePoints(document.getElementById('svm-pos').value);
  const neg=parsePoints(document.getElementById('svm-neg').value);
  const w1=+document.getElementById('svm-w1').value;
  const w2=+document.getElementById('svm-w2').value;
  const b=+document.getElementById('svm-b').value;
  const normW=Math.sqrt(w1*w1+w2*w2);
  const margin=2/normW;
  let out=`=== SVM Analysis ===\n`;
  out+=`w = [${w1}, ${w2}], b = ${b}\n`;
  out+=`||w|| = ${normW.toFixed(4)}\n`;
  out+=`Margin = 2/||w|| = ${margin.toFixed(4)}\n\n`;
  out+=`--- Nhóm +1 ---\n`;
  let minDistPos=Infinity,minDistNeg=Infinity;
  pos.forEach(p=>{
    const val=w1*p[0]+w2*p[1]+b;
    const dist=Math.abs(val)/normW;
    const correct=val>0;
    if(dist<minDistPos)minDistPos=dist;
    out+=`  (${p}) → w·x+b = ${val.toFixed(3)}, dist = ${dist.toFixed(4)}, ${correct?'✓ đúng phía':'✗ SAI PHÍA'}\n`;
  });
  out+=`\n--- Nhóm -1 ---\n`;
  neg.forEach(p=>{
    const val=w1*p[0]+w2*p[1]+b;
    const dist=Math.abs(val)/normW;
    const correct=val<0;
    if(dist<minDistNeg)minDistNeg=dist;
    out+=`  (${p}) → w·x+b = ${val.toFixed(3)}, dist = ${dist.toFixed(4)}, ${correct?'✓ đúng phía':'✗ SAI PHÍA'}\n`;
  });
  out+=`\n--- Support Vectors ---\n`;
  out+=`Khoảng cách nhỏ nhất nhóm +1: ${minDistPos.toFixed(4)}\n`;
  out+=`Khoảng cách nhỏ nhất nhóm -1: ${minDistNeg.toFixed(4)}\n`;
  out+=`Actual margin (min_pos + min_neg): ${(minDistPos+minDistNeg).toFixed(4)}\n`;
  out+=`Theoretical margin (2/||w||): ${margin.toFixed(4)}\n`;
  const el=document.getElementById('svm-result');el.textContent=out;el.style.display='block';
}

/* ===== Q-Learning ===== */
function calcQL(){
  const nS=+document.getElementById('ql-states').value;
  const nA=+document.getElementById('ql-actions').value;
  const goal=+document.getElementById('ql-goal').value;
  const goalR=+document.getElementById('ql-reward').value;
  const alpha=+document.getElementById('ql-alpha').value;
  const gamma=+document.getElementById('ql-gamma').value;
  const trans=document.getElementById('ql-trans').value.trim().split('\n').map(l=>l.split(',').map(Number));
  const Q=Array.from({length:nS},()=>Array(nA).fill(0));
  let out=`=== Q-Learning Step-by-Step ===\n`;
  out+=`States: ${nS}, Actions: ${nA}, Goal: S${goal}, Reward: ${goalR}\n`;
  out+=`α = ${alpha}, γ = ${gamma}\n\n`;
  trans.forEach((t,i)=>{
    const[s,a,sp]=t;
    const r=(sp===goal)?goalR:0;
    const maxQ=Math.max(...Q[sp]);
    const td=r+gamma*maxQ-Q[s][a];
    const oldQ=Q[s][a];
    Q[s][a]=Q[s][a]+alpha*td;
    out+=`Step ${i+1}: S${s} --a${a}--> S${sp}, r=${r}\n`;
    out+=`  TD Error = ${r} + ${gamma}×max(Q[S${sp}]) − Q[S${s}][a${a}]\n`;
    out+=`         = ${r} + ${gamma}×${maxQ.toFixed(4)} − ${oldQ.toFixed(4)} = ${td.toFixed(4)}\n`;
    out+=`  Q[S${s}][a${a}] ← ${oldQ.toFixed(4)} + ${alpha}×${td.toFixed(4)} = ${Q[s][a].toFixed(4)}\n\n`;
  });
  out+=`=== Q-Table Final ===\n`;
  out+=`       `+Array.from({length:nA},(_, i)=>`  a${i}   `).join('')+`\n`;
  Q.forEach((row,i)=>{
    out+=`S${i}:  `+row.map(v=>v.toFixed(3).padStart(7)).join('')+`\n`;
  });
  out+=`\n=== Policy (Best Action per State) ===\n`;
  Q.forEach((row,i)=>{
    const best=row.indexOf(Math.max(...row));
    out+=`S${i} → a${best} (Q=${row[best].toFixed(4)})\n`;
  });
  const el=document.getElementById('ql-result');el.textContent=out;el.style.display='block';
}

function calcBellman(){
  const nS=+document.getElementById('ql-states').value;
  const goal=+document.getElementById('ql-goal').value;
  const goalR=+document.getElementById('ql-reward').value;
  const gamma=+document.getElementById('ql-gamma').value;
  const trans=document.getElementById('ql-trans').value.trim().split('\n').map(l=>l.split(',').map(Number));
  const adj={};
  trans.forEach(([s,a,sp])=>{
    if(!adj[s])adj[s]=[];
    adj[s].push({a,sp,r:sp===goal?goalR:0});
  });
  const V=Array(nS).fill(0);
  let out=`=== Bellman Value Iteration ===\n`;
  out+=`V(s) = max_a [ R(s,a) + γ·V(s') ]\nγ = ${gamma}\n\n`;
  for(let iter=0;iter<10;iter++){
    const Vnew=[...V];
    for(let s=0;s<nS;s++){
      if(!adj[s]){Vnew[s]=0;continue;}
      let best=-Infinity;
      adj[s].forEach(({r,sp})=>{const v=r+gamma*V[sp];if(v>best)best=v;});
      Vnew[s]=best;
    }
    const diff=Vnew.reduce((acc,v,i)=>acc+Math.abs(v-V[i]),0);
    for(let i=0;i<nS;i++)V[i]=Vnew[i];
    out+=`Iter ${iter+1}: V = [${V.map(v=>v.toFixed(4)).join(', ')}]  (Δ=${diff.toFixed(6)})\n`;
    if(diff<0.0001)break;
  }
  out+=`\nFinal Values:\n`;
  V.forEach((v,i)=>out+=`  V(S${i}) = ${v.toFixed(4)}\n`);
  const el=document.getElementById('ql-result');el.textContent=out;el.style.display='block';
}

/* ===== Markov Chain ===== */
function calcMarkov(){
  const states=document.getElementById('mc-states').value.split(',').map(s=>s.trim());
  const A=document.getElementById('mc-A').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const pi=document.getElementById('mc-pi').value.split(',').map(Number);
  const seq=document.getElementById('mc-seq').value.split(',').map(s=>s.trim());
  const idx=s=>states.indexOf(s);
  let prob=pi[idx(seq[0])];
  let out=`=== Markov Chain Probability ===\n`;
  out+=`States: ${states.join(', ')}\n`;
  out+=`Chuỗi: ${seq.join(' → ')}\n\n`;
  out+=`P(${seq[0]}) = π[${seq[0]}] = ${pi[idx(seq[0])]}\n`;
  let formula=`P = ${pi[idx(seq[0])]}`;
  for(let t=1;t<seq.length;t++){
    const from=idx(seq[t-1]),to=idx(seq[t]);
    const p=A[from][to];
    out+=`P(${seq[t]}|${seq[t-1]}) = A[${seq[t-1]}→${seq[t]}] = ${p}\n`;
    formula+=` × ${p}`;
    prob*=p;
  }
  out+=`\n${formula} = ${prob.toFixed(6)}\n`;
  out+=`\n→ Xác suất chuỗi ${seq.join('→')} = ${(prob*100).toFixed(4)}%`;
  const el=document.getElementById('mc-result');el.textContent=out;el.style.display='block';
}

/* ===== HMM Forward ===== */
function calcForward(){
  const states=document.getElementById('hmm-states').value.split(',').map(s=>s.trim());
  const obs=document.getElementById('hmm-obs').value.split(',').map(s=>s.trim());
  const pi=document.getElementById('hmm-pi').value.split(',').map(Number);
  const A=document.getElementById('hmm-A').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const B=document.getElementById('hmm-B').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const seq=document.getElementById('hmm-seq').value.split(',').map(s=>s.trim());
  const N=states.length,T=seq.length;
  const oIdx=o=>obs.indexOf(o);
  const alpha=Array.from({length:T},()=>Array(N).fill(0));
  let out=`=== HMM Forward Algorithm ===\n`;
  out+=`Hidden States: ${states.join(', ')}\n`;
  out+=`Observations: ${obs.join(', ')}\n`;
  out+=`Chuỗi: ${seq.join(' → ')}\n\n`;
  // Init
  out+=`--- Bước 1: Khởi tạo (t=1, o₁=${seq[0]}) ---\n`;
  for(let i=0;i<N;i++){
    alpha[0][i]=pi[i]*B[i][oIdx(seq[0])];
    out+=`α₁(${states[i]}) = π(${states[i]}) × B(${states[i]},${seq[0]}) = ${pi[i]} × ${B[i][oIdx(seq[0])]} = ${alpha[0][i].toFixed(4)}\n`;
  }
  // Recursion
  for(let t=1;t<T;t++){
    out+=`\n--- Bước ${t+1}: Lan truyền (t=${t+1}, o=${seq[t]}) ---\n`;
    for(let j=0;j<N;j++){
      let sum=0;
      let sumStr=[];
      for(let i=0;i<N;i++){
        const v=alpha[t-1][i]*A[i][j];
        sum+=v;
        sumStr.push(`α${t}(${states[i]})×A(${states[i]},${states[j]})=${alpha[t-1][i].toFixed(4)}×${A[i][j]}=${v.toFixed(4)}`);
      }
      alpha[t][j]=B[j][oIdx(seq[t])]*sum;
      out+=`α${t+1}(${states[j]}) = B(${states[j]},${seq[t]}) × [${sumStr.join(' + ')}]\n`;
      out+=`         = ${B[j][oIdx(seq[t])]} × ${sum.toFixed(4)} = ${alpha[t][j].toFixed(4)}\n`;
    }
  }
  const total=alpha[T-1].reduce((a,b)=>a+b,0);
  out+=`\n=== Kết quả ===\n`;
  out+=`P(O|HMM) = Σ α${T}(s) = ${alpha[T-1].map(v=>v.toFixed(4)).join(' + ')} = ${total.toFixed(6)}\n`;
  out+=`→ Xác suất quan sát chuỗi [${seq.join(', ')}] = ${(total*100).toFixed(4)}%`;
  const el=document.getElementById('hmm-result');el.textContent=out;el.style.display='block';
}

/* ===== HMM Viterbi ===== */
function calcViterbi(){
  const states=document.getElementById('hmm-states').value.split(',').map(s=>s.trim());
  const obs=document.getElementById('hmm-obs').value.split(',').map(s=>s.trim());
  const pi=document.getElementById('hmm-pi').value.split(',').map(Number);
  const A=document.getElementById('hmm-A').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const B=document.getElementById('hmm-B').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const seq=document.getElementById('hmm-seq').value.split(',').map(s=>s.trim());
  const N=states.length,T=seq.length;
  const oIdx=o=>obs.indexOf(o);
  const delta=Array.from({length:T},()=>Array(N).fill(0));
  const psi=Array.from({length:T},()=>Array(N).fill(0));
  let out=`=== HMM Viterbi Algorithm ===\n`;
  out+=`Tìm chuỗi hidden state có xác suất cao nhất\n\n`;
  // Init
  out+=`--- Bước 1: Khởi tạo (t=1, o₁=${seq[0]}) ---\n`;
  for(let i=0;i<N;i++){
    delta[0][i]=pi[i]*B[i][oIdx(seq[0])];
    out+=`δ₁(${states[i]}) = π(${states[i]}) × B(${states[i]},${seq[0]}) = ${pi[i]} × ${B[i][oIdx(seq[0])]} = ${delta[0][i].toFixed(4)}\n`;
  }
  // Recursion
  for(let t=1;t<T;t++){
    out+=`\n--- Bước ${t+1}: (t=${t+1}, o=${seq[t]}) ---\n`;
    for(let j=0;j<N;j++){
      let bestVal=-1,bestI=0;
      let details=[];
      for(let i=0;i<N;i++){
        const v=delta[t-1][i]*A[i][j];
        details.push(`từ ${states[i]}: δ${t}(${states[i]})×A(${states[i]},${states[j]})=${delta[t-1][i].toFixed(4)}×${A[i][j]}=${v.toFixed(4)}`);
        if(v>bestVal){bestVal=v;bestI=i;}
      }
      delta[t][j]=B[j][oIdx(seq[t])]*bestVal;
      psi[t][j]=bestI;
      out+=details.join('\n')+'\n';
      out+=`max = ${bestVal.toFixed(4)} ← từ ${states[bestI]}\n`;
      out+=`δ${t+1}(${states[j]}) = B(${states[j]},${seq[t]}) × ${bestVal.toFixed(4)} = ${B[j][oIdx(seq[t])]} × ${bestVal.toFixed(4)} = ${delta[t][j].toFixed(4)}\n`;
      out+=`ψ${t+1}(${states[j]}) = ${states[bestI]}\n\n`;
    }
  }
  // Backtrack
  out+=`--- Backtrack ---\n`;
  let bestEnd=0;
  for(let i=1;i<N;i++)if(delta[T-1][i]>delta[T-1][bestEnd])bestEnd=i;
  const path=[bestEnd];
  for(let t=T-1;t>0;t--)path.unshift(psi[t][path[0]]);
  out+=`t=${T}: max(${delta[T-1].map((v,i)=>`δ${T}(${states[i]})=${v.toFixed(4)}`).join(', ')}) → ${states[bestEnd]}\n`;
  for(let t=T-1;t>0;t--)out+=`t=${t}: ψ${t+1}(${states[path[t]]}) = ${states[path[t-1]]}\n`;
  out+=`\n=== Kết quả ===\n`;
  out+=`Chuỗi observation:       ${seq.join(' → ')}\n`;
  out+=`Chuỗi state tốt nhất:   ${path.map(i=>states[i]).join(' → ')}\n`;
  out+=`Xác suất: ${delta[T-1][bestEnd].toFixed(6)}`;
  const el=document.getElementById('hmm-result');el.textContent=out;el.style.display='block';
}

/* ===== Naive Bayes ===== */
function calcNaiveBayes(){
  const classes=document.getElementById('nb-classes').value.split(',').map(s=>s.trim());
  const counts=document.getElementById('nb-counts').value.split(',').map(Number);
  const features=document.getElementById('nb-features').value.split(',').map(s=>s.trim());
  const query=document.getElementById('nb-query').value.split(',').map(s=>s.trim());
  const data=document.getElementById('nb-data').value.trim().split('\n').map(l=>{
    const p=l.split(',').map(s=>s.trim());
    return{val:p[0],cls:p[1],count:+p[2]};
  });
  const total=counts.reduce((a,b)=>a+b,0);
  let out=`=== Naive Bayes Calculation ===\n`;
  out+=`Classes: ${classes.join(', ')}\n`;
  out+=`Query: ${query.join(', ')}\n`;
  out+=`Total samples: ${total}\n\n`;
  const results=[];
  classes.forEach((cls,ci)=>{
    const pC=counts[ci]/total;
    out+=`--- Class: ${cls} ---\n`;
    out+=`P(${cls}) = ${counts[ci]}/${total} = ${pC.toFixed(4)}\n`;
    let prod=pC;
    let formula=`P(${cls})`;
    query.forEach((q,fi)=>{
      const entry=data.find(d=>d.val===q&&d.cls===cls);
      const pFeat=entry?(entry.count/counts[ci]):0;
      out+=`P(${q}|${cls}) = ${entry?entry.count:0}/${counts[ci]} = ${pFeat.toFixed(4)}\n`;
      prod*=pFeat;
      formula+=` × P(${q}|${cls})`;
    });
    out+=`${formula} = ${prod.toFixed(6)}\n\n`;
    results.push({cls,prob:prod});
  });
  const sumP=results.reduce((a,r)=>a+r.prob,0);
  out+=`=== Kết quả ===\n`;
  results.forEach(r=>{
    out+=`P(${r.cls}|query) ∝ ${r.prob.toFixed(6)}`;
    if(sumP>0)out+=`  → normalized: ${(r.prob/sumP*100).toFixed(2)}%`;
    out+='\n';
  });
  const best=results.reduce((a,b)=>a.prob>b.prob?a:b);
  out+=`\n→ Phân loại: ${best.cls}`;
  const el=document.getElementById('nb-result');el.textContent=out;el.style.display='block';
}

/* ===== K-Means ===== */
function calcKMeans(){
  const data=document.getElementById('km-data').value.trim().split('\n').map(l=>l.split(',').map(Number));
  const k=+document.getElementById('km-k').value;
  const centTxt=document.getElementById('km-centroids').value.trim();
  let centroids=centTxt?centTxt.split('\n').map(l=>l.split(',').map(Number)):[];
  if(centroids.length<k){
    const shuffled=[...data].sort(()=>Math.random()-0.5);
    centroids=shuffled.slice(0,k).map(p=>[...p]);
  }
  const dist=(a,b)=>Math.sqrt(a.reduce((s,v,i)=>s+(v-b[i])**2,0));
  let out=`=== K-Means Step-by-Step ===\n`;
  out+=`K = ${k}, N = ${data.length} points\n\n`;
  for(let iter=0;iter<10;iter++){
    out+=`--- Iteration ${iter+1} ---\n`;
    out+=`Centroids: ${centroids.map((c,i)=>`C${i}=(${c.map(v=>v.toFixed(2)).join(',')})`).join(', ')}\n\n`;
    const clusters=Array.from({length:k},()=>[]);
    data.forEach(p=>{
      let best=0,bestD=Infinity;
      centroids.forEach((c,ci)=>{const d=dist(p,c);if(d<bestD){bestD=d;best=ci;}});
      clusters[best].push(p);
      out+=`  (${p}) → C${best} (d=${bestD.toFixed(4)})\n`;
    });
    out+='\n';
    const newCentroids=clusters.map(cl=>{
      if(cl.length===0)return[0,0];
      return cl[0].map((_,d)=>cl.reduce((s,p)=>s+p[d],0)/cl.length);
    });
    let moved=false;
    newCentroids.forEach((nc,i)=>{
      if(dist(nc,centroids[i])>0.0001)moved=true;
    });
    out+=`New centroids: ${newCentroids.map((c,i)=>`C${i}=(${c.map(v=>v.toFixed(2)).join(',')})`).join(', ')}\n`;
    centroids=newCentroids;
    if(!moved){out+=`\n✓ Hội tụ tại iteration ${iter+1}!\n`;break;}
    out+='\n';
  }
  out+=`\n=== Kết quả cuối ===\n`;
  const clusters=Array.from({length:k},()=>[]);
  data.forEach(p=>{
    let best=0,bestD=Infinity;
    centroids.forEach((c,ci)=>{const d=dist(p,c);if(d<bestD){bestD=d;best=ci;}});
    clusters[best].push(p);
  });
  clusters.forEach((cl,i)=>{
    out+=`Cluster ${i} (centroid=${centroids[i].map(v=>v.toFixed(2))}): ${cl.map(p=>`(${p})`).join(', ')}\n`;
  });
  const el=document.getElementById('km-result');el.textContent=out;el.style.display='block';
}

/* ===== Distance ===== */
function calcDistance(){
  const a=document.getElementById('dist-a').value.split(',').map(Number);
  const b=document.getElementById('dist-b').value.split(',').map(Number);
  const euclidean=Math.sqrt(a.reduce((s,v,i)=>s+(v-b[i])**2,0));
  const manhattan=a.reduce((s,v,i)=>s+Math.abs(v-b[i]),0);
  const dot=a.reduce((s,v,i)=>s+v*b[i],0);
  const normA=Math.sqrt(a.reduce((s,v)=>s+v*v,0));
  const normB=Math.sqrt(b.reduce((s,v)=>s+v*v,0));
  const cosine=dot/(normA*normB);
  const chebyshev=Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
  let out=`=== Distance Metrics ===\n`;
  out+=`A = [${a}]\nB = [${b}]\n\n`;
  out+=`Euclidean:  √(Σ(aᵢ−bᵢ)²) = ${euclidean.toFixed(6)}\n`;
  out+=`Manhattan:  Σ|aᵢ−bᵢ| = ${manhattan.toFixed(6)}\n`;
  out+=`Cosine Sim: (A·B)/(||A||·||B||) = ${cosine.toFixed(6)}\n`;
  out+=`Cosine Dist: 1 − cosine_sim = ${(1-cosine).toFixed(6)}\n`;
  out+=`Chebyshev:  max|aᵢ−bᵢ| = ${chebyshev.toFixed(6)}\n`;
  out+=`\nChi tiết:\n`;
  a.forEach((v,i)=>out+=`  dim ${i}: |${v}−${b[i]}| = ${Math.abs(v-b[i])}, (${v}−${b[i]})² = ${((v-b[i])**2).toFixed(4)}\n`);
  const el=document.getElementById('dist-result');el.textContent=out;el.style.display='block';
}

/* ===== SVD 2x2 ===== */
function calcSVD(){
  const rows=document.getElementById('svd-A').value.trim().split('\n').map(r=>r.split(',').map(Number));
  const a=rows[0][0],b=rows[0][1],c=rows[1][0],d=rows[1][1];
  const k=+document.getElementById('svd-k').value;
  // AᵀA
  const ata=[[a*a+c*c,a*b+c*d],[a*b+c*d,b*b+d*d]];
  // eigenvalues of AᵀA
  const trace=ata[0][0]+ata[1][1];
  const det=ata[0][0]*ata[1][1]-ata[0][1]*ata[1][0];
  const disc=Math.sqrt(Math.max(trace*trace-4*det,0));
  const l1=(trace+disc)/2,l2=(trace-disc)/2;
  const s1=Math.sqrt(Math.max(l1,0)),s2=Math.sqrt(Math.max(l2,0));
  let out=`=== SVD of 2×2 Matrix ===\n`;
  out+=`A = [[${a},${b}],[${c},${d}]]\n\n`;
  out+=`AᵀA = [[${ata[0][0].toFixed(4)},${ata[0][1].toFixed(4)}],\n`;
  out+=`       [${ata[1][0].toFixed(4)},${ata[1][1].toFixed(4)}]]\n\n`;
  out+=`Eigenvalues of AᵀA:\n`;
  out+=`  λ₁ = ${l1.toFixed(6)}\n  λ₂ = ${l2.toFixed(6)}\n\n`;
  out+=`Singular Values:\n`;
  out+=`  σ₁ = √λ₁ = ${s1.toFixed(6)}\n`;
  out+=`  σ₂ = √λ₂ = ${s2.toFixed(6)}\n\n`;
  out+=`Σ = [[${s1.toFixed(4)}, 0],\n     [0, ${s2.toFixed(4)}]]\n\n`;
  // eigenvectors for V
  const computeEigvec=(lambda)=>{
    const m00=ata[0][0]-lambda,m01=ata[0][1];
    if(Math.abs(m01)>1e-10){
      const v=[-m01,m00];const n=Math.sqrt(v[0]*v[0]+v[1]*v[1]);
      return[v[0]/n,v[1]/n];
    }
    const m10=ata[1][0],m11=ata[1][1]-lambda;
    if(Math.abs(m10)>1e-10){
      const v=[-m11,m10];const n=Math.sqrt(v[0]*v[0]+v[1]*v[1]);
      return[v[0]/n,v[1]/n];
    }
    return[1,0];
  };
  const v1=computeEigvec(l1),v2=computeEigvec(l2);
  out+=`V (right singular vectors):\n`;
  out+=`  v₁ = [${v1.map(x=>x.toFixed(4))}]\n`;
  out+=`  v₂ = [${v2.map(x=>x.toFixed(4))}]\n\n`;
  if(s1>1e-10){
    const u1=[(a*v1[0]+b*v1[1])/s1,(c*v1[0]+d*v1[1])/s1];
    out+=`U (left singular vectors):\n`;
    out+=`  u₁ = A·v₁/σ₁ = [${u1.map(x=>x.toFixed(4))}]\n`;
    if(s2>1e-10){
      const u2=[(a*v2[0]+b*v2[1])/s2,(c*v2[0]+d*v2[1])/s2];
      out+=`  u₂ = A·v₂/σ₂ = [${u2.map(x=>x.toFixed(4))}]\n`;
    }
  }
  if(k===1){
    out+=`\n=== Rank-1 Approximation (k=1) ===\n`;
    out+=`Giữ lại σ₁ = ${s1.toFixed(4)}, bỏ σ₂\n`;
    out+=`Giảm từ ${2*2}=4 tham số → ${2+1+2}=5... nhưng rank-1 chỉ cần 2+1+2=5 số\n`;
    out+=`(Với ma trận lớn m×n, rank-k cần k(m+n+1) thay vì m×n tham số)\n`;
  }
  const el=document.getElementById('svd-result');el.textContent=out;el.style.display='block';
}
</script>
