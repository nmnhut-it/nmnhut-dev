+++
date = '2026-06-28'
draft = false
title = 'Thiết kế dữ liệu SFT cho LLM: chất, đa dạng, và chống học vẹt'
description = 'Sổ tay về supervised fine-tuning data: SFT thực sự dạy gì, vì sao chất hơn lượng, cách tăng đa dạng/độ khó, trộn data & chống quên, distill reasoning trace, loss masking, và lọc data tổng hợp.'
tags = ['ai', 'llm', 'dataset', 'fine-tuning', 'sft', 'research']
+++

> Sổ tay lưu trữ về **thiết kế dữ liệu cho supervised fine-tuning (SFT)** — bước dạy một LLM nền làm theo chỉ dẫn / một tác vụ cụ thể. Tổng hợp từ các paper công khai 2023–2025. Viết để sau này đọc lại không phải research từ đầu.

---

## 0. Trước hết: SFT thực sự dạy gì?

Hiểu lầm phổ biến nhất: coi SFT như "nhồi kiến thức" vào model. Không phải.

Model nền (Llama, Qwen, Mistral…) đã học **gần hết kiến thức và năng lực ngôn ngữ trong giai đoạn pretraining** — một biển text khổng lồ, mở, đa dạng. SFT đến sau, với lượng data nhỏ hơn nhiều bậc, **chủ yếu dạy HÀNH VI và ĐỊNH DẠNG đầu ra**: trả lời theo phong cách nào, theo cấu trúc nào, ưu tiên cái gì.

Đây là tinh thần của **Superficial Alignment Hypothesis** (LIMA, Zhou et al. 2023): *"gần như toàn bộ kiến thức của LLM học trong pretraining; chỉ cần lượng instruction-tuning hạn chế để dạy model tạo ra output chất lượng cao."*

> ⚠️ Giả thuyết này **đang tranh cãi** — có nghiên cứu cho thấy post-training scale theo power-law và tác vụ reasoning cần nhiều hơn "style", thậm chí fine-tune có thể dạy fact mới (kèm rủi ro hallucinate). Hãy coi nó là **kim chỉ nam tư duy**, không phải định luật: *dữ liệu SFT nên TRÌNH DIỄN hành vi mong muốn, đừng cố nhồi kiến thức.*

Hệ quả thực dụng: nếu bạn muốn model **suy luận**, data phải **trình diễn suy luận**. Nếu muốn nó trả lời **gọn và đúng định dạng**, data phải toàn ví dụ gọn-đúng-định-dạng. Model bắt chước phân phối bạn cho nó thấy.

---

## 1. Chất > lượng

Phát hiện nhất quán nhất across nhiều nguồn: **một khi dataset đã đủ tốt, tăng số mẫu thô giúp ít hơn nhiều so với cải thiện chất lượng từng mẫu.**

- **LIMA** (arXiv 2305.11206): một model 65B fine-tune với **~1,000 cặp prompt-response được tuyển kỹ**, không RLHF, vẫn đạt alignment mạnh — học được cả "định dạng phản hồi phức tạp từ chỉ vài ví dụ". Quality-over-quantity ở dạng cực đoan.
- **IFD / Cherry** (arXiv 2308.12032, NAACL'24): một phương pháp **tự chấm "độ khó instruction-following"** rồi chỉ giữ phần khó nhất — dùng **~5% của Alpaca** mà **thắng full Alpaca**; ~10% data của WizardLM thắng bản full.

Ví von: SFT giống dạy **phong cách làm việc**, không phải nhồi từ điển bách khoa. Vài ví dụ mẫu mực, đa dạng, dạy tốt hơn một đống ví dụ trùng lặp.

**Việc làm được ngay:** đừng chăm chăm "thêm data". Hãy **chấm điểm và prune chính tập của mình** — bỏ mẫu dễ/trùng-lặp-thông-tin, giữ mẫu mang thông tin mới. Nếu mẫu mới giống mẫu cũ, lợi ích phẳng rất nhanh.

> Caveat: LIMA chứng minh ở 65B cho instruction-following chung. Với model nhỏ (1–7B) và tác vụ reasoning/structured-output, nhiều bằng chứng cho thấy **cần nhiều hơn ~1k mẫu** — "ít mà chất" là hướng đi, không phải con số thần thánh.

---

## 2. Đa dạng và độ khó (không chỉ paraphrase bề mặt)

Chất lượng không chỉ là "sạch"; nó còn là **đa dạng kiểu task, phong cách, và ĐỘ KHÓ**. Một tập sạch nhưng đơn điệu vẫn dạy model một hành vi hẹp.

- **Self-Instruct**: dùng chính LLM sinh thêm instruction từ một seed nhỏ, mở rộng độ phủ — nhưng phải **lọc gắt** trùng lặp & sai.
- **Evol-Instruct / WizardLM** (arXiv 2304.12244, ICLR'24): cho LLM **"viết lại từng bước thành instruction phức tạp hơn"** theo hai chiều:
  - *In-depth*: thêm ràng buộc, đào sâu, cụ thể hoá, tăng bước suy luận.
  - *In-breadth*: sinh chủ đề/dạng mới.
  
  Đánh giá cho thấy instruction tiến hoá **thắng instruction người viết** trên test cân-bằng-độ-phức-tạp.
- **Auto Evol-Instruct** (arXiv 2406.00770, EMNLP'24): tự động hoá hoàn toàn — một prompt phổ quát "liệt kê cách làm phức tạp hơn → lên kế hoạch → thực thi", và một Optimizer LLM tự cải thiện phương pháp tiến hoá dựa trên lỗi. Số đo: diversity và complexity tăng thì performance tăng (vd GSM8K 56.9 → 64.4).

> Lưu ý: các so sánh "tiến hoá thắng người viết" thường dựa trên **LLM/GPT-4 chấm** (có bias độ dài/phong cách) và test-bed do chính nhóm tác giả soạn → **độ lớn tuyệt đối là mềm**, nhưng **xu hướng** (đa dạng + độ khó → tổng quát hoá tốt hơn) thì vững.

---

## 3. Trộn data & catastrophic forgetting

Khi nhồi nhiều kỹ năng/miền vào một adapter, rủi ro lớn nhất là **mất cân bằng** và **quên**.

**Chiến lược trộn thực dụng:**
1. Bắt đầu bằng **base human-curated chất lượng cao**.
2. Thêm **synthetic instruction** (Self-Instruct/Evol-Instruct) cho độ phủ — **sau khi lọc gắt** đúng/đa-dạng/không-trùng.
3. Thêm **reasoning trace** một cách **dè dặt**, chỉ khi đã verify.
4. **Đừng để một miền áp đảo** trừ khi use-case thật sự hẹp.

**Catastrophic forgetting:** LoRA **giảm** quên so với full fine-tune nhưng **không loại bỏ**. Quên dễ xảy ra khi tập fine-tune **hẹp, lặp, hoặc ép tối ưu một hành vi duy nhất.** Cách giảm:
- Trộn ít **general instruction data** trong khi tune tác vụ.
- **Đừng over-train** trên tập nhỏ.
- **Learning rate thấp + early stopping.**
- Cân nhắc **replay** (trộn lại data kỹ năng cũ).

> Quy tắc nhớ: một phân phối lệch kéo model ra khỏi năng lực rộng. Một hỗn hợp cân bằng giữ năng lực tổng quát tốt hơn.

---

## 4. Reasoning trace & distillation từ teacher

Nếu tác vụ cần suy luận nhiều bước, **dạy bằng lời giải từng bước (chain-of-thought)** giúp ích — nhưng không miễn phí.

- **Distilling Step-by-Step** (arXiv 2305.02301, ACL'23): trích **rationale của teacher làm tín hiệu supervision PHỤ** trong khung **multi-task** (dự đoán đáp án và rationale là hai task riêng), thay vì chỉ học đáp án cuối. Kết quả: model nhỏ **thắng model lớn với ÍT data hơn**.
- **CoT distillation cho model rất nhỏ** (arXiv 2212.08410): model **125M–1.3B** vẫn làm được CoT khi distill từ teacher — trước đây nghĩ cần >50B.

**Mẹo thiết kế quan trọng:** vì rationale là **task phụ**, bạn **không bắt buộc phải xuất CoT lúc infer**. Có thể dùng nó làm *latent supervision* rồi vẫn để model emit đáp án **gọn**. Quyết định trước: model **xuất** reasoning hay chỉ **dùng nội bộ**? Mask loss cho khớp.

---

## 5. Loss masking trên completion

Một chi tiết kỹ thuật nhỏ nhưng dễ làm sai: với SFT kiểu completion, **chỉ tính loss trên phần phản hồi của assistant**, mask phần prompt.

Lý do: bạn muốn dạy model **tạo ra phản hồi mong muốn**, không phải bắt chước lại câu hỏi đầu vào. Nếu có nhiều lượt (system/user/assistant), giữ target được giám sát **bó chặt vào đúng phần assistant** bạn muốn model học.

> Nếu dataset trộn nhiều format, **giữ quy tắc masking nhất quán**. Masking không nhất quán tạo gradient nhiễu và dạy model sai hành vi.

---

## 6. Chất lượng data tổng hợp: sinh nhiều → lọc GẮT

Khi dùng LLM sinh data, bài học không đổi: **generate lots → aggressively filter.** Với tác vụ có **output kiểm chứng được** (code, SQL, structured output), ba bộ lọc mạnh:

| Bộ lọc | Cơ chế |
|---|---|
| **Execution-guided** | giữ ví dụ mà output **chạy ra đúng kết quả mong đợi**. Data sinh bằng prompt tĩnh, không validate execution, thường nhiễu. |
| **Round-trip consistency** | biểu diễn → text → dịch ngược lại → **khớp** thì giữ. |
| **Back-translation** | model ngược chấm điểm ứng viên, giữ cái nhất-quán-hai-chiều. |

Một cảnh báo: **dùng độ tương đồng bề mặt (semantic similarity) để gán nhãn đúng/sai là không đáng tin** — hai output giống chữ vẫn có thể chạy ra kết quả khác. Hãy dùng **tín hiệu execution**, không phải tín hiệu bề mặt.

---

## 7. Học vẹt vs tổng quát hoá — nỗi lo cốt lõi

Rủi ro nền tảng của mọi data tổng hợp: nếu data do **một bộ sinh hữu hạn** (template + từ điển đồng nghĩa) tạo ra, model có thể học cách **đảo ngược chính bộ sinh đó** thay vì hiểu — to hơn bảng tra cũ một chút, nhưng vẫn là tra cứu. Gặp đầu vào ngoài "vốn từ" của bộ sinh → sập.

Năm cách quản lý rủi ro:

1. **Đừng dạy model NGÔN NGỮ từ bộ sinh của bạn.** Tựa vào ngôn ngữ pretraining; data chỉ dạy *ánh xạ / hành vi*.
2. **Nguồn đa dạng phải là thứ model không đảo ngược được** — ngôn ngữ người thật, hoặc một **teacher LLM mạnh hơn** sinh biến thể mở, rồi **lọc gắt**. Từ điển đồng nghĩa chỉ là xương sống an toàn, không phải nguồn đa dạng chính.
3. **Phá tính trong-suốt input↔output**: làm sao cùng một cách diễn đạt không luôn ánh xạ tới cùng một output, để model buộc phải *xử lý* thay vì *tra*.
4. **Chống over-train:** train loss tụt về ~0 là **cờ đỏ học vẹt**. Epoch ít hơn, **early-stop trên tập out-of-distribution**, LR thấp.
5. **Đa dạng nguồn** (trộn nhiều teacher/phong cách) để khử artifact một-phong-cách.

> **Sự thật phương pháp luận:** không CHỨNG MINH được model "hiểu" một cách tiên nghiệm — bạn chỉ **PHÁT HIỆN** được, bằng một tập test thật-sự-OOD mà bộ sinh chưa hề chạm tới, rồi lặp: sinh → train → test OOD → vá → lặp lại. Một **tập test nhỏ do người viết tay** biến câu hỏi "liệu nó có hiểu?" thành một con số đo được.

---

## 8. Checklist (dán lên tường)

1. **SFT dạy hành vi, không nhồi kiến thức** — data phải *trình diễn* hành vi mong muốn.
2. **Chất > lượng** — prune mẫu dễ/trùng, giữ mẫu mang thông tin mới (IFD-style).
3. **Đa dạng + độ khó**, không chỉ paraphrase bề mặt (Evol-Instruct).
4. **Trộn cân bằng + chống quên** — ít general data, LR thấp, early-stop; đừng để một miền áp đảo.
5. **Reasoning trace là task phụ** — có thể giữ output gọn lúc infer.
6. **Loss chỉ trên completion**, nhất quán mọi format.
7. **Sinh nhiều → lọc gắt** bằng execution / round-trip / back-translation, không phải similarity bề mặt.
8. **Một tập test người-viết nhỏ** + early-stop trên OOD = phòng tuyến chống học vẹt.

---

## Nguồn

LIMA (2305.11206) · IFD/Cherry (2308.12032) · Evol-Instruct/WizardLM (2304.12244) · Auto Evol-Instruct (2406.00770) · Distilling Step-by-Step (2305.02301) · CoT-distillation cho model nhỏ (2212.08410).

*Caveat: phần lớn method được validate ở scale lớn / instruction-following chung (LIMA ở 65B); xuống 1–7B cho structured-output là ngoại suy. Nhiều so sánh dựa trên LLM-chấm (bias độ dài/phong cách) và test-bed tự soạn → độ lớn tuyệt đối mềm, xu hướng thì vững.*
