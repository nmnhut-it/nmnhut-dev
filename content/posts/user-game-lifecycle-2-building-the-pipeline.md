+++
date = '2026-06-07'
draft = false
title = "User Game Lifecycle (Phần 2): Dựng thử pipeline"
description = "Cách biến ý tưởng UGL của Tencent thành một hệ thống chạy được — cấu trúc dữ liệu, bộ dựng lifecycle, một embedder năm trường, một encoder kiểu BERT, và phần train hai giai đoạn. Toàn lời lẽ dễ hiểu và pseudocode, không cần framework."
tags = ['ai', 'machine-learning', 'recommendation', 'games', 'research']
+++

Phần 1 là ý tưởng. Phần này là dây chuyền lắp ráp — tám khối nhỏ biến mấy cú click thô thành một biểu diễn người chơi mà một model production xài được.

---

*Bài viết song ngữ Anh-Việt. [Phiên bản tiếng Việt ở bên dưới.](#tiếng-việt)*

*Đây là Phần 2 của series 2 phần. [Phần 1 giải thích phương pháp.](/posts/user-game-lifecycle-1-learning-from-absence/)*

---

## English

[Part 1](/posts/user-game-lifecycle-1-learning-from-absence/) was about *why* Tencent's User Game Lifecycle works: fill out a too-short history by gathering behavior from four places and adding in *going quiet* (lost and silence actions), then keep the long-tail from being ignored with Inverse Probability Masking. This part is the *how* — the shape of a pipeline that turns those ideas into something you can train. We'll keep it gentle: pseudocode and data shapes, no real framework code, so the structure stays easy to see.

### The pipeline at a glance

Eight steps, each feeding the next. Raw actions go in on the left; a player vector comes out on the right.

```
raw logs
   │
   ▼
[1] BasicAction            (type, game, date) triples
   │
   ▼
[2] UGLBuilder             group + add lost/silence  →  AggregatedAction tokens
   │
   ▼
[3] UGLDataset             pad, tokenize  →  tensors
   │
   ▼
[4] SequenceEmbedder       5 fields → one vector per token
   │
   ▼
[5] UGLEncoder             Transformer (BERT-style) + positions
   │
   ├──► [6] IPM            the hiding task (training only)
   │
   ▼
[7] UGLModel               embedder + encoder + prediction head
   │
   ▼
[8] DownstreamHead         MLP → ad CVR / item ranking
```

Two data structures, a builder, a dataset wrapper, an embedder, an encoder, the hiding strategy, the assembled model, and a small head at the end. Let's stroll through them.

### [1] Two data structures: before and after

Everything starts as a **BasicAction** — the raw triple from Part 1:

```
BasicAction = { type, game, date }
```

The builder turns runs of those into an **AggregatedAction**, which is the actual token the model sees — five fields, the same ones grouping gave us:

```
AggregatedAction = { type, game, start_date, end_date, frequency }
```

That `frequency` field is quietly useful: it's how "logged in once" and "logged in every day for a week" end up as *different* tokens instead of the same one. Everything downstream is built to read these five fields.

### [2] The lifecycle builder: where the idea lives

`UGLBuilder` is the one place that carries the paper's actual *insight*; everything after it is fairly ordinary deep-learning plumbing. It does three small things, in order, over a user's sorted actions:

```
function build(user_actions):
    tokens = []
    for each run of repeated (type, game) inside a time window:
        tokens.append(aggregate(run))            # → AggregatedAction with freq

    for each (game, action_type) the user did:
        if gap since the last time > 7 days:
            tokens.append(LOST_ACTION token)      # a thread cooling off

    if the user did nothing on any game for > 7 days:
        tokens.append(SILENCE_ACTION token)       # gone quiet

    return in_time_order(tokens)
```

Three passes, three of Part 1's ideas: **grouping** (short-term interest), **lost actions** (one thread cooling off), **silence actions** (fully quiet). Notice what's going on — the builder *adds tokens that were never in the log.* Going quiet isn't something the model has to guess later; it's written right into the sequence as a plain token. That's the little trick that lets an ordinary sequence encoder learn from people leaving.

### [3] Dataset: padding and tokenizing

`UGLDataset` is mechanical but needed. Sequences come in different lengths, and a Transformer likes fixed-size batches, so this step pads every sequence to a common length, maps each field to an integer id, and hands back tensors plus a padding mask (so the model knows to skip the filler spots). Nothing deep here — just the bridge from objects to numbers.

### [4] The embedder: five fields, one vector

A token has five fields, but the encoder wants a single vector per token. `SequenceEmbedder` embeds each field on its own and adds them up:

```
token_vector =  embed_type_game(type, game)     # together: "what action on what game"
              + embed_start_date(start_date)
              + embed_end_date(end_date)
              + embed_frequency(frequency)
```

One little detail: `type` and `game` are embedded **together**, not separately. "Login on game A" and "purchase on game A" should really be different vectors, not the same game embedding pushed two ways. The dates and frequency add the "when" and "how much" on top.

### [5] The encoder: a BERT for player behavior

Once each token is a vector, the sequence looks a lot like a sentence — so the encoder is a regular **BERT-style Transformer**: add positional embeddings (order matters — *played then quit* isn't *quit then played*), then run self-attention layers so each token's vector is shaped by every other token in the lifecycle. Out comes one vector per token, plus a pooled vector for the whole user.

If you've seen a text Transformer, you've basically seen this. The new part isn't the encoder; it's the *vocabulary* it reads — grouped actions and "went quiet" tokens instead of words.

### [6] IPM: the training task that's fair to the long-tail

An encoder needs something to learn from on its own. UGL uses **Masked Action Modeling**: hide some tokens, guess them back — fill-in-the-blank, for behavior. The twist from Part 1 is *which* tokens get hidden. Instead of hiding evenly, **Inverse Probability Masking** weighs each token by how rare its game is:

```
fit step:   count how often each game appears in the training data
hide step:  hide_prob(token) ∝ 1 / frequency(token's game)
            keep it in a sane range, e.g. [0.05, 0.40]
```

Popular games get hidden rarely (the model already knows them); quiet games get hidden a lot (nudging the model to actually learn them). This is the one spot where the lopsided-mix problem gets handled, and it's handled by changing a single probability, not the architecture.

### [7] & [8] Putting it together, and the head at the end

`UGLModel` bolts the pieces together — embedder, encoder, and a prediction head used during pretraining to guess the hidden tokens. After pretraining, the encoder's pooled output *is* the user representation. `DownstreamHead` is a small MLP that takes that representation and does the real production job: guessing ad conversion, or ranking in-game items.

### Two-stage training

The whole thing trains in two stages, and the split is kind of the whole point:

```
Stage 1 — Pretrain (self-supervised, no labels)
    task:    Masked Action Modeling with IPM
    result:  a general-purpose UGL encoder

Stage 2 — Finetune (supervised, with task labels)
    freeze or fine-tune the encoder
    train DownstreamHead on ad / recommendation labels
```

Stage 1 learns *who the player is* from raw behavior — cheap, at big scale, without a single label. Stage 2 then spends your scarce labeled data only on the final task-specific layer. It's the usual transfer-learning move — pretrain broad, finetune narrow — just applied to player lifecycles instead of language.

### What a run actually looks like

The reference code that reproduces these ideas is small — around 350 lines across the eight modules — and a toy run makes the moving parts feel real:

```
Users: 200      Avg sequence length after UGL: 92.7
IPM hide-prob range: [0.050, 0.400]   ← quiet games hidden ~8× more than hits
Pretrain loss: 6.52 → 6.00            ← the encoder is learning
User representation shape: [16, 64]   ← 16 users in a batch, 64-dim vectors
```

Two numbers tell the story. **92.7** is the average sequence length *after* UGL fills things out — remember a raw player history is only 3–4 games. Gathering from four places, plus grouping and the "went quiet" tokens, turned a nearly-empty sequence into something a Transformer can work with. And the **[0.05, 0.40]** hide-range is IPM doing its thing: the rarest games really do get hidden about 8× more than the hits.

### Wrapping up

So the architecture, end to end, is mostly familiar — a Transformer with a hide-and-guess task and a two-stage train. What makes it UGL lives in two small spots you could lift out and reuse:

- **The builder ([2])**, which writes *going quiet* into the sequence as real tokens.
- **The hiding step ([6])**, which lets rare games matter as much as popular ones.

Everything else is plumbing you probably already know. If you take just one thing to your own behavior models, take those two — represent what the user *stopped* doing, and don't let your most common events drown out your rarest ones. The dataset stayed inside Tencent; the ideas didn't have to.

---

## Tiếng Việt

[Phần 1](/posts/user-game-lifecycle-1-learning-from-absence/) nói về *vì sao* User Game Lifecycle của Tencent chạy tốt: làm đầy một lịch sử quá ngắn bằng cách gom hành vi từ bốn nơi và thêm vào chuyện *im lặng* (lost và silence action), rồi giữ cho cái đuôi dài không bị bỏ quên bằng Inverse Probability Masking. Phần này là *làm thế nào* — hình hài một pipeline biến mấy ý đó thành thứ train được. Mình giữ nhẹ nhàng thôi: pseudocode và hình dạng dữ liệu, không có code framework thật, để cấu trúc luôn dễ nhìn.

### Nhìn nhanh toàn bộ pipeline

Tám bước, mỗi bước nuôi bước sau. Action thô vào bên trái; một vector người chơi ra bên phải.

```
log thô
   │
   ▼
[1] BasicAction            triple (type, game, date)
   │
   ▼
[2] UGLBuilder             gom + thêm lost/silence  →  token AggregatedAction
   │
   ▼
[3] UGLDataset             pad, tokenize  →  tensor
   │
   ▼
[4] SequenceEmbedder       5 trường → một vector mỗi token
   │
   ▼
[5] UGLEncoder             Transformer (kiểu BERT) + vị trí
   │
   ├──► [6] IPM            phần "giấu rồi đoán" (chỉ lúc train)
   │
   ▼
[7] UGLModel               embedder + encoder + prediction head
   │
   ▼
[8] DownstreamHead         MLP → CVR quảng cáo / xếp hạng item
```

Hai cấu trúc dữ liệu, một builder, một lớp bọc dataset, một embedder, một encoder, cách giấu token, model lắp ráp, và một cái head nhỏ ở cuối. Đi dạo qua từng cái nhé.

### [1] Hai cấu trúc dữ liệu: trước và sau

Mọi thứ bắt đầu là một **BasicAction** — triple thô từ Phần 1:

```
BasicAction = { type, game, date }
```

Builder biến các chuỗi liên tiếp của chúng thành một **AggregatedAction**, đây mới là token thật mà model nhìn thấy — năm trường, đúng mấy trường mà việc gom tạo ra:

```
AggregatedAction = { type, game, start_date, end_date, frequency }
```

Trường `frequency` âm thầm hữu ích: nhờ nó mà "login một lần" và "login mỗi ngày suốt một tuần" thành hai token *khác nhau* chứ không phải y hệt. Mọi thứ phía sau đều được dựng để đọc năm trường này.

### [2] Bộ dựng lifecycle: nơi ý tưởng nằm

`UGLBuilder` là chỗ duy nhất mang theo *cái hay* thực sự của bài báo; mọi thứ sau nó khá là đường ống deep-learning bình thường. Nó làm ba việc nhỏ, theo thứ tự, trên chuỗi action đã sắp xếp của một user:

```
function build(user_actions):
    tokens = []
    for mỗi chuỗi (type, game) lặp lại trong một time window:
        tokens.append(aggregate(run))            # → AggregatedAction có freq

    for mỗi (game, action_type) mà user đã làm:
        if khoảng cách từ lần cuối > 7 ngày:
            tokens.append(token LOST_ACTION)      # một mạch đang nguội

    if user không làm gì trên mọi game quá 7 ngày:
        tokens.append(token SILENCE_ACTION)       # đã im lặng

    return theo_thứ_tự_thời_gian(tokens)
```

Ba lượt, ba ý của Phần 1: **gom** (sở thích ngắn hạn), **lost action** (một mạch đang nguội), **silence action** (im hẳn). Để ý điều đang xảy ra — builder *thêm vào những token chưa từng có trong log.* Chuyện im lặng không phải để model đoán sau; nó được viết thẳng vào chuỗi như một token bình thường. Đó là mẹo nhỏ cho phép một sequence encoder bình thường học được từ chuyện người ta rời đi.

### [3] Dataset: padding và tokenize

`UGLDataset` mang tính cơ khí nhưng cần. Các chuỗi dài ngắn khác nhau, mà Transformer thích batch cùng kích thước, nên bước này pad mọi chuỗi về một độ dài chung, ánh xạ mỗi trường thành một id số nguyên, và trả về tensor cùng một padding mask (để model biết bỏ qua mấy chỗ độn). Không có gì sâu xa ở đây — chỉ là cây cầu từ object sang số.

### [4] Embedder: năm trường, một vector

Một token có năm trường, nhưng encoder muốn một vector duy nhất mỗi token. `SequenceEmbedder` embed từng trường riêng rồi cộng lại:

```
token_vector =  embed_type_game(type, game)     # chung: "hành động gì trên game nào"
              + embed_start_date(start_date)
              + embed_end_date(end_date)
              + embed_frequency(frequency)
```

Một chi tiết nhỏ: `type` và `game` được embed **chung**, không tách. "Login ở game A" và "mua đồ ở game A" nên là hai vector khác nhau thật sự, chứ không phải cùng một embedding game bị đẩy theo hai hướng. Ngày tháng và frequency thêm phần "khi nào" và "nhiều cỡ nào" lên trên.

### [5] Encoder: một BERT cho hành vi người chơi

Khi mỗi token đã thành một vector, chuỗi này nhìn khá giống một câu — nên encoder là một **Transformer kiểu BERT** bình thường: thêm positional embedding (thứ tự có nghĩa — *chơi rồi nghỉ* khác *nghỉ rồi chơi*), rồi chạy các lớp self-attention để vector của mỗi token được nhào nặn bởi mọi token khác trong lifecycle. Ra được một vector mỗi token, cộng thêm một vector pool cho cả user.

Nếu bạn từng thấy một text Transformer, thì về cơ bản bạn thấy cái này rồi. Phần mới không phải encoder; mà là *từ vựng* nó đọc — action đã gom và token "đã im lặng" thay cho từ ngữ.

### [6] IPM: task huấn luyện công bằng với cái đuôi dài

Encoder cần thứ gì đó để tự học. UGL dùng **Masked Action Modeling**: giấu vài token, đoán lại — điền vào chỗ trống, cho hành vi. Cú twist từ Phần 1 là *token nào* bị giấu. Thay vì giấu đều, **Inverse Probability Masking** cân mỗi token theo độ hiếm của game:

```
bước fit:    đếm mỗi game xuất hiện bao nhiêu lần trong training data
bước giấu:   hide_prob(token) ∝ 1 / frequency(game của token)
             giữ trong một dải hợp lý, vd [0.05, 0.40]
```

Game phổ biến hiếm khi bị giấu (model biết rồi); game ít chơi bị giấu nhiều (đẩy model học chúng cho thật). Đây là chỗ duy nhất chuyện cơ cấu lệch được xử lý, và nó được xử lý bằng cách đổi một xác suất, chứ không phải kiến trúc.

### [7] & [8] Ghép lại, và cái head ở cuối

`UGLModel` bắt vít các mảnh lại — embedder, encoder, và một prediction head dùng lúc pretraining để đoán mấy token bị giấu. Sau pretraining, đầu ra pool của encoder *chính là* biểu diễn user. `DownstreamHead` là một MLP nhỏ, nhận biểu diễn đó và làm việc production thật: đoán chuyển đổi quảng cáo, hoặc xếp hạng item in-game.

### Train hai giai đoạn

Toàn bộ train trong hai giai đoạn, và cách chia chính là điểm mấu chốt:

```
Giai đoạn 1 — Pretrain (tự giám sát, không nhãn)
    task:    Masked Action Modeling với IPM
    kết quả: một UGL encoder dùng chung

Giai đoạn 2 — Finetune (có giám sát, có nhãn task)
    đóng băng hoặc fine-tune encoder
    train DownstreamHead trên nhãn quảng cáo / gợi ý
```

Giai đoạn 1 học *người chơi là ai* từ hành vi thô — rẻ, quy mô lớn, không cần một nhãn nào. Giai đoạn 2 mới tiêu lượng data có nhãn ít ỏi của bạn, chỉ cho lớp cuối cùng theo task. Đó là nước đi transfer learning quen thuộc — pretrain rộng, finetune hẹp — chỉ là áp lên lifecycle người chơi thay cho ngôn ngữ.

### Một lần chạy thật trông như thế nào

Code tham chiếu tái hiện mấy ý này khá nhỏ — chừng 350 dòng trải trên tám module — và một lần chạy đồ chơi làm các bộ phận chuyển động thành cụ thể:

```
Users: 200      Độ dài chuỗi trung bình sau UGL: 92.7
Dải hide-prob IPM: [0.050, 0.400]     ← game ít chơi bị giấu nhiều hơn game hot ~8×
Pretrain loss: 6.52 → 6.00            ← encoder đang học
Shape biểu diễn user: [16, 64]        ← 16 user một batch, vector 64 chiều
```

Hai con số kể trọn câu chuyện. **92.7** là độ dài chuỗi trung bình *sau* khi UGL làm đầy — nhớ là một lịch sử người chơi thô chỉ có 3–4 game. Gom từ bốn nơi, cộng việc gom và mấy token "đã im lặng", đã biến một chuỗi gần như rỗng thành thứ Transformer làm việc được. Còn dải giấu **[0.05, 0.40]** là IPM đang làm việc của nó: mấy game hiếm nhất quả thật bị giấu nhiều hơn game hot chừng 8 lần.

### Khép lại

Vậy kiến trúc, từ đầu đến cuối, phần lớn là quen thuộc — một Transformer với task giấu-rồi-đoán và train hai giai đoạn. Thứ làm nên UGL nằm ở hai chỗ nhỏ mà bạn có thể nhấc ra dùng lại:

- **Builder ([2])**, nơi viết chuyện *im lặng* vào chuỗi thành token thật.
- **Bước giấu ([6])**, nơi cho game hiếm quan trọng ngang game phổ biến.

Mọi thứ còn lại là đường ống chắc bạn đã biết. Nếu chỉ mang một điều về cho model hành vi của riêng mình, hãy mang hai điều đó — biểu diễn những gì user đã *ngừng* làm, và đừng để các sự kiện phổ biến nhất nhấn chìm các sự kiện hiếm nhất. Dataset thì ở lại trong Tencent; còn ý tưởng thì không buộc phải ở lại.
