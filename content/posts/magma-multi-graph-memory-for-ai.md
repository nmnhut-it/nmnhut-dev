+++
date = '2026-04-10'
draft = false
title = 'MAGMA: Teaching AI to Remember Like Humans Do'
description = 'The MAGMA paper proposes a multi-graph memory architecture that separates semantic, temporal, causal, and entity relationships — giving AI agents structured recall instead of keyword matching.'
tags = ['ai', 'llm', 'memory', 'agents', 'research']
+++

Your AI has amnesia, and the fix isn't more memory — it's better memory.

---

*Bài viết song ngữ Anh-Việt. [Phiên bản tiếng Việt ở bên dưới.](#tiếng-việt)*

---

## English

Every time you have a long conversation with an AI assistant, something embarrassing happens behind the scenes. Around the 30-minute mark, the system quietly starts forgetting the beginning of your conversation. Not because it decided that stuff was unimportant — because it ran out of room. These systems don't have memory. They have a sliding window, a fixed-size buffer that moves forward as the conversation grows, dropping older context off the back end. That brilliant setup you laid out in the first five minutes? Gone.

The industry's response so far has been to take everything the AI has seen, chop it into chunks, shove those chunks into a searchable database, and then fish out whichever chunk looks most similar to whatever you just asked. Sometimes you get the right piece. Often you don't. And you have zero ability to follow a chain of reasoning, understand what caused what, or reconstruct a timeline. Similarity search finds things that look alike. It cannot find things that are connected.

This is what a team of researchers set out to fix with [MAGMA](https://github.com/FredJiang0324/MAMGA).

### Memory isn't one thing

Think about remembering a dinner party. You remember what people talked about — the topics, the references, the shared jokes. But you also remember the flow of the evening: appetizers came before the argument about politics, which came before dessert. You remember that Uncle Jerry's comment about taxes is what started the argument — cause and effect. And you remember who said what — Jerry started it, your mother escalated it, your partner tried to change the subject.

That's four different kinds of recall happening at once: topics, sequence, causation, and characters. Your brain maintains all of them simultaneously. Current AI memory systems maintain exactly one — topic similarity. That's why they fall apart on anything beyond surface-level lookups.

MAGMA encodes each piece of conversation into four separate graph structures running in parallel. A semantic graph connecting related concepts. A temporal graph tracking what happened when. A causal graph mapping chains of reasoning — this happened because of that. And an entity graph following who's involved and their roles.

### Different questions need different memory paths

When you ask "what's Sarah's job?", you're pulling up a fact about a person. When you ask "why did Sarah leave her old company?", you're tracing cause and effect. When you ask "what happened after the merger?", you're following a timeline. These are completely different retrieval operations, but a similarity search treats them all the same — scan for matching keywords and hope.

MAGMA reads the intent behind your question first. A "why" question triggers navigation through causal links. A "when" question follows temporal chains. A "who" question hits the entity graph. Instead of searching everything the same way, it routes through the right kind of memory structure for the right kind of question. Less like a search engine, more like a librarian who understands not just what you asked, but what kind of answer you actually need.

### Writing memories: fast and slow

MAGMA also splits how it stores information into two speeds. A fast path records facts immediately as they arrive — names, dates, simple statements. This keeps the system responsive. A slow path runs in the background, doing deeper analysis to figure out relationships. Maybe you mentioned a project deadline at minute five and expressed stress about workload at minute twenty. The slow path connects those dots and builds a causal link between them. A keyword search would never make that connection.

### Structure beats volume

The standard approach to long conversations — make the context window bigger — hits a wall fast. A 100,000-token conversation costs quadratically more to process, and accuracy degrades in the middle anyway (a well-documented problem called "lost in the middle").

MAGMA compresses that 100,000-token history down to roughly 3,000–4,000 tokens of structured graph context. That's about a 95% reduction. And it doesn't trade accuracy for efficiency — it actually scores higher than the full-context approach on retrieval benchmarks (0.700 vs. 0.481 on LoCoMo). Less information going in, better answers coming out. Structure outperforms brute force.

The ablation studies confirm no single component is carrying the weight. Remove the causal graph, performance drops. Remove the temporal backbone, it drops again. Remove entity tracking, same thing. Each dimension captures something the others miss.

### Why this matters

We've spent years scaling raw capability — bigger models, longer contexts, more compute. But the memory problem isn't a scale problem. It's a structure problem. Buying a bigger window doesn't give you memory any more than buying a bigger notebook gives you understanding. What you write in it, how you organize it, and how you look things up — that's what makes the difference.

MAGMA is one of the first systems that treats AI memory the way human memory actually works: as a web of relationships, sequences, causes, and characters. The results suggest that taking structure seriously pays off.

---

## Tiếng Việt

Bạn chat với AI được nửa tiếng, kể hết hoàn cảnh, giải thích rõ ràng mọi thứ. Rồi bạn hỏi một câu liên quan đến đầu cuộc trò chuyện, và nó trả lời như chưa từng nghe bạn nói. Không phải nó hỏng — mà nó được thiết kế như vậy. Mỗi mô hình AI có một "cửa sổ ngữ cảnh," tức lượng văn bản nó nhìn thấy cùng lúc. Cuộc trò chuyện dài ra, những gì ở đầu bị đẩy ra ngoài. Giống đọc sách mà chỉ được giữ 10 trang gần nhất, còn lại phải xé bỏ.

Giải pháp phổ biến hiện tại: cắt nhỏ cuộc hội thoại, nhét vào kho dữ liệu, khi cần thì tìm đoạn nào "giống" câu hỏi nhất rồi đưa lại cho AI. Đôi khi trúng. Thường thì trật. Vì tìm kiếm theo độ giống chỉ tìm được câu có từ khóa trùng, không tìm được mối liên hệ. Nó không biết chuyện gì xảy ra trước chuyện gì, không biết chuyện này gây ra chuyện kia, không biết ai liên quan đến ai.

Đây là cái mà một nhóm nghiên cứu muốn sửa khi họ xây [MAGMA](https://github.com/FredJiang0324/MAMGA).

### Trí nhớ không phải một thứ duy nhất

Nghĩ về cách bạn nhớ một buổi họp. Bạn nhớ nội dung — bàn về chuyện gì, quyết định gì. Bạn nhớ trình tự — sếp nói trước, rồi anh Minh phản đối, rồi chị Lan đề xuất phương án khác. Bạn nhớ nguyên nhân — sếp đổi yêu cầu nên timeline bị dồn lại, nên team bị quá tải, nên deadline bị trễ. Và bạn nhớ ai nói gì — anh Minh phản đối vấn đề A, chị Lan chịu trách nhiệm phần B.

Bốn kiểu nhớ khác nhau, chạy song song trong đầu bạn. Hệ thống bộ nhớ AI hiện tại chỉ có một kiểu: tìm đoạn văn giống nhau về mặt ngữ nghĩa.

MAGMA tách trí nhớ thành bốn đồ thị riêng biệt. Đồ thị ngữ nghĩa nối các khái niệm liên quan — "công việc" nối với "stress", "stress" nối với "mất ngủ". Đồ thị thời gian sắp sự kiện theo trình tự — tháng 1 bắt đầu dự án, tháng 3 bị áp lực, tháng 5 xin nghỉ phép. Đồ thị nhân quả nối nguyên nhân với kết quả — bị phê bình dẫn đến mất dự án, dẫn đến tìm việc mới, dẫn đến nghỉ việc. Đồ thị thực thể theo dõi ai liên quan đến gì — anh Minh cùng team với chị Lan, chị Lan quản lý dự án X.

### Câu hỏi khác nhau, đường đi khác nhau

Khi bạn hỏi "tại sao cô ấy nghỉ việc?", bạn không cần AI tìm những câu có chứa từ "nghỉ việc". Bạn cần nó truy ngược chuỗi sự kiện: bị sếp phê bình → mất dự án quan trọng → nhận offer từ công ty khác → nghỉ. Mỗi sự kiện nằm rải rác ở những chỗ khác nhau trong cuộc hội thoại, không câu nào chứa từ "nghỉ việc" cả. Tìm kiếm theo độ giống sẽ không nối được các điểm lại với nhau.

MAGMA phân loại ý định của câu hỏi trước khi tìm kiếm. Hỏi "tại sao" thì đi theo đồ thị nhân quả. Hỏi "khi nào" thì theo đồ thị thời gian. Hỏi "ai làm việc đó" thì theo đồ thị thực thể. Giống như trong đầu bạn: ai hỏi "hôm qua ăn gì" thì bạn lục trí nhớ theo thời gian, còn hỏi "tại sao chia tay" thì bạn nghĩ theo chuỗi sự kiện.

### Ghi nhớ theo hai luồng

MAGMA tách việc ghi nhớ thành hai tốc độ. Luồng nhanh lưu thông tin ngay lập tức khi nó đến — tên, ngày tháng, sự kiện cơ bản. Giống ghi chú nhanh trong cuộc họp. Luồng chậm chạy nền, phân tích lại để tìm mối liên hệ sâu hơn. Bạn kể về deadline dự án lúc phút thứ 5, rồi kể về stress công việc lúc phút thứ 20. Luồng chậm nối hai chuyện đó lại: deadline gây ra stress. Giống buổi tối bạn ngồi đọc lại ghi chú trong ngày và chợt nhận ra hai chuyện tưởng riêng biệt thực ra liên quan đến nhau.

### Ít thông tin hơn, kết quả tốt hơn

Cách tiếp cận thông thường — mở rộng cửa sổ ngữ cảnh — đụng tường rất nhanh. Cuộc hội thoại 100.000 token tốn gấp bốn lần cuộc hội thoại 50.000 token để xử lý, và AI còn bị mất tập trung ở phần giữa (hiện tượng "lost in the middle" được ghi nhận rõ ràng trong nghiên cứu).

MAGMA nén 100.000 token xuống còn 3.000–4.000 token cho mỗi câu hỏi. Giảm hơn 95%. Và không đánh đổi độ chính xác — trên benchmark LoCoMo, MAGMA đạt 0.700 so với 0.590 của hệ thống tốt nhì và 0.481 của cách nhét nguyên cuộc hội thoại vào cửa sổ. Ít dữ liệu đầu vào hơn, câu trả lời đúng hơn. Cấu trúc thắng số lượng.

Kết quả ablation cũng xác nhận: không có thành phần nào một mình gánh cả hệ thống. Bỏ đồ thị nhân quả, điểm giảm. Bỏ đồ thị thời gian, giảm tiếp. Bỏ đồ thị thực thể, giảm nữa. Mỗi lớp bắt được thứ mà các lớp khác bỏ sót.

### Vấn đề không phải nhớ nhiều, mà là nhớ có tổ chức

Ngành AI đang đổ tiền vào mô hình lớn hơn, cửa sổ dài hơn, tính toán nhiều hơn. Nhưng bài toán trí nhớ không phải bài toán quy mô — nó là bài toán cấu trúc. Mua sổ tay to hơn không giúp bạn nhớ tốt hơn nếu bạn vẫn viết lung tung không tổ chức.

MAGMA là một trong những hệ thống đầu tiên đối xử với trí nhớ AI theo cách mà trí nhớ con người vận hành: có dòng thời gian, có nhân quả, có nhân vật, có mối liên hệ. Và kết quả cho thấy cách tiếp cận này hiệu quả.
