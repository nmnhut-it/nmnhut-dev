+++
date = '2026-06-07'
draft = false
title = "User Game Lifecycle (Phần 1): Học từ những gì người chơi không làm"
description = "Một bài của Tencent về gợi ý game, dựa trên hai chuyện hơi đau đầu — người chơi chỉ động tới 3–4 game, và vài game hot lấn át hết phần còn lại. Cách họ xử lý: gom thêm hành vi từ bốn nơi, và để ý cả lúc người chơi… im lặng."
tags = ['ai', 'machine-learning', 'recommendation', 'games', 'research']
+++

Đa số hệ gợi ý học từ những gì bạn làm. Bài này của Tencent thì còn để ý cả những gì bạn *thôi không làm nữa* — và mình thấy ý đó khá dễ thương.

---

*Bài viết song ngữ Anh-Việt. [Phiên bản tiếng Việt ở bên dưới.](#tiếng-việt)*

*Đây là Phần 1 của series 2 phần. [Phần 2 dựng thử pipeline.](/posts/user-game-lifecycle-2-building-the-pipeline/)*

---

## English

### A small side-quest that led to a paper

This whole thing started as a search for a dataset — logs of people *playing* and *browsing* games, the raw clicks of a session. The search itself is worth a few lines, because it sets up why the paper we ended up at felt interesting.

The public datasets are real, just a bit thin. Kaggle has some friendly tabular ones — *Predict Online Gaming Behavior* (age, hours played, sessions per week, purchases, an engagement label), *Gamelytics* for mobile retention and A/B events, some CS:GO matchmaking telemetry. Academia has the bigger logs: the **ArcheAge** MMORPG dump (81,174 players, 275 million records, 75 action types), the **Pardus** social-game logs (370,000+ players over 1,238 days), and an IEEE bot-detection set with login patterns and trade networks. There's even an AWS package that just *makes up* player sessions when you can't find real ones.

Then you bump into a paper like [arXiv 2510.15412](https://arxiv.org/abs/2510.15412) — *Large-scale User Game Lifecycle Representation Learning*, by Tencent and Yunnan University, October 2025 — and you notice something funny: the most interesting data is exactly the data you'll never get to download. It's Tencent's internal behavior logs across hundreds of millions of users, and it went straight into their production system for game ads and in-game recommendation. No public code, no public data. So the thing worth taking home isn't the dataset. It's just the *idea* of how they shaped it — and that part we can learn from.

### Why game recommendation is a bit awkward

If you've read about recommender systems before, the usual mental picture is online shopping: a user clicks, adds to cart, and buys *thousands* of items, leaving a nice long trail for a model to read. Games don't quite fit that picture, for two reasons.

**Not many games per person.** The average player only touches **3 or 4 games**. That's the whole history. Next to a shopper's thousands of interactions, a game player's record is short and a little repetitive. "Played A, played B, played C" just doesn't carry enough to paint a clear picture of who this person is.

**A few games take over.** The games people actually play follow a heavy long-tail. A handful of big hits — say *Honor of Kings* — show up in almost everyone's history, while thousands of smaller games barely appear. If you train a model without thinking about this, it leans hard on the popular few and more or less stops noticing the quiet ones. That's a shame, because the quiet games are often exactly what a recommender is supposed to help people find.

So the paper is gently wrestling with two things: histories that are **a bit too short**, and a mix that's **a bit too lopsided**. Pretty much every idea in the method is aimed at one or the other.

### Idea #1 — Gather more behavior from four places

If someone's in-game history is too thin, one option is to widen what we count as "behavior." Tencent's **User Game Lifecycle (UGL)** stops looking at a user as only their in-game actions, and instead picks up signals from four places:

| Where | Example behaviors |
|---|---|
| **In-game** | Login, play a match, in-game purchase, join a MOBA tournament |
| **Search** | Search a walkthrough, click an article or video about a game |
| **Ads & recommendations** | Click a game ad, download an app, pre-register for a launch |
| **Social & community** | Share a game, like/dislike a review, post a status |

Each action becomes a small **triple**: `(type, game, date)`. Searching a walkthrough for a game you don't even own yet? That counts now. A pre-registration counts. Liking a review counts. Put the four places together and that 3-or-4-game history fills out into something more like a *lifecycle* — the arc of a person's relationship with a game, from first curiosity, to playing a lot, to slowly drifting away.

### Idea #2 — Tidy up the repeats into "what they're into right now"

Raw triples are still a bit noisy. Logging into the same game five days in a row gives you five almost-identical rows that all say the same thing: *this person is into game A lately.* So UGL **groups** repeated actions inside a time window into one token that just keeps a count:

```
(login, gameA, day1) ┐
(login, gameA, day2) │
(login, gameA, day3) ├──►  (login, gameA, start=day1, end=day5, freq=5)
(login, gameA, day4) │
(login, gameA, day5) ┘
```

One token, five fields: type, game, start date, end date, and how many times. The repetition folds away, and what's left is a tidy read on **short-term interest** — what the player's into right now, and roughly how much.

### Idea #3 — Pay attention when someone goes quiet (the part I liked)

Here's the bit that stuck with me. Grouping captures what people *do*. But a lifecycle is also shaped by what people *stop* doing — and a normal sequence can't see that, because nothing gets logged when a user simply quits. Tencent makes that quiet visible by *adding in* two kinds of "they went quiet" tokens:

- **Lost action.** If a user stops doing one particular action on one particular game for more than 7 days — say they were buying items in game A and then that just stops — UGL drops in a **lost action** token. It's a small note that one thread of interest is cooling off.

- **Silence action.** If a user does *nothing at all*, across *every* game, for more than 7 days, UGL drops in a **silence action** token. That's the person going fully quiet — about the clearest "they might be leaving" signal you can get.

This is the idea I find the most charming in the paper. Most recommenders only learn from what a user did. UGL also tries to learn from what a user *no longer does*. Doing things tells you about interest; stopping tells you about losing interest — and for something like games, where people come and go a lot, the "going quiet" signal is often the more useful one. It's the difference between a model that knows you like a game, and a model that can kind of tell you're slipping away.

### Idea #4 — Don't let the popular games hog all the attention

Now the second thing: the lopsided mix. The pretraining task is BERT-style — hide some tokens in the sequence and ask the model to guess them back (fill-in-the-blank, but for player behavior). The snag is that the usual way of hiding picks tokens with the **same probability** everywhere. When 90% of your tokens are popular games, the model spends 90% of its time re-learning what it already knows about the hits, and barely meets the quiet games.

Tencent's fix is **Inverse Probability Masking (IPM)**: set each token's "chance of being hidden" *opposite* to how often its game shows up.

```
popular game  → low  chance of hiding   (model already knows it; no need to drill)
quiet game    → high chance of hiding   (rare; nudge the model to actually learn it)
```

By hiding rare games much more often, IPM gently pushes the model to learn them instead of letting the long-tail wash out. It's a small tweak to a standard task that points right at the lopsided-mix problem — and in the reference code the hiding chances land somewhere around `[0.05, 0.40]`, so the rarest games get hidden about 8× more than the hits.

### Did it help?

The paper feeds this representation into two real production tasks and reports:

| Task | Metric | Change |
|---|---|---|
| Game ads | AUC (offline) | **+1.83%** |
| Game ads | CVR (online) | **+21.67%** |
| In-game item recommendation | AUC (offline) | **+0.5%** |
| In-game item recommendation | ARPU (online) | **+0.82%** |

The offline AUC numbers look small; the online ones are where it gets interesting. A **+21.67%** lift in conversion rate on game ads is a lot for a system already running at Tencent's size — the kind of result that probably pays for the research on its own.

### What I'd take away

If you set the architecture aside, UGL is basically two simple ideas pointed at two problems:

1. **History too short →** widen what counts as "behavior" across four places, and treat going quiet (lost and silence actions) as real signal too. You're not just writing down what people do; you're sketching the *shape* of their whole relationship with a game, fading and all.
2. **Mix too lopsided →** hide rare games more often than common ones, so the long-tail doesn't get ignored.

Neither idea needs Tencent's data to be useful. The "notice when someone goes quiet" trick especially travels well — to subscriptions, SaaS, content apps, almost anything where people drift in and out. Next time you build a behavior model, maybe ask not just *what did the user do*, but *what did they stop doing, and when did they go quiet.*

[Part 2](/posts/user-game-lifecycle-2-building-the-pipeline/) walks through how all of this fits together as a pipeline — the data structures, the lifecycle builder, the embedder, the encoder, and the two-stage training — in plain language, no framework needed.

---

## Tiếng Việt

### Một chuyến đi lạc nho nhỏ dẫn tới một bài báo

Mọi chuyện bắt đầu từ việc mình đi tìm một dataset — log của người dùng *chơi* và *browse* game, mấy cú click thô của một phiên. Chuyện đi tìm này cũng đáng kể lại vài dòng, vì nó cho thấy vì sao bài báo mình dừng chân lại nghe hay hay.

Đồ public thì có thật, chỉ là hơi mỏng. Kaggle có vài bộ dạng bảng dễ xài — *Predict Online Gaming Behavior* (tuổi, số giờ chơi, số session mỗi tuần, mua đồ, một nhãn engagement), *Gamelytics* cho retention và A/B event trên mobile, ít telemetry matchmaking CS:GO. Giới học thuật thì có mấy bộ log to hơn: bản dump MMORPG **ArcheAge** (81.174 người chơi, 275 triệu bản ghi, 75 loại hành động), log game xã hội **Pardus** (hơn 370.000 người chơi suốt 1.238 ngày), và một bộ bot-detection của IEEE có cả login pattern lẫn mạng giao dịch. Thậm chí AWS còn có package tự *bịa* ra session người chơi khi mình không kiếm được data thật.

Rồi mình gặp một bài như [arXiv 2510.15412](https://arxiv.org/abs/2510.15412) — *Large-scale User Game Lifecycle Representation Learning*, của Tencent và Đại học Vân Nam, tháng 10/2025 — và để ý một điều hơi buồn cười: data thú vị nhất lại đúng là data mình không bao giờ tải được. Đó là log hành vi nội bộ của Tencent trên hàng trăm triệu người dùng, và nó đi thẳng vào hệ thống production cho quảng cáo game với gợi ý in-game. Không code public, không data public. Nên thứ đáng mang về không phải dataset. Mà chỉ là *ý tưởng* họ nhào nặn nó ra sao — và phần đó thì mình học được.

### Vì sao gợi ý game hơi khó nhằn

Nếu bạn từng đọc về recommender system, hình dung quen thuộc thường là mua sắm online: người dùng click, bỏ giỏ, mua *hàng nghìn* món, để lại một vệt dài đẹp đẽ cho model đọc. Game thì hơi lệch khỏi hình dung đó, vì hai lẽ.

**Mỗi người chơi ít game.** Người chơi trung bình chỉ động tới **3–4 game**. Đó là toàn bộ lịch sử. So với hàng nghìn tương tác của một người đi mua sắm, hồ sơ của một game thủ ngắn và hơi lặp đi lặp lại. "Chơi A, chơi B, chơi C" thật sự không đủ để vẽ ra một bức tranh rõ ràng về con người này.

**Vài game chiếm hết.** Mấy game người ta thực sự chơi đi theo một cái đuôi dài khá nặng. Vài game hot — kiểu *Honor of Kings* — xuất hiện trong gần như mọi lịch sử, còn cả nghìn game nhỏ thì hầu như không thấy. Nếu train model mà không để ý chuyện này, nó sẽ dựa hẳn vào nhóm phổ biến và gần như không còn nhìn thấy mấy game ít người chơi. Hơi tiếc, vì mấy game ít người chơi lại thường đúng là thứ một hệ gợi ý nên giúp người ta tìm ra.

Nên bài báo đang nhẹ nhàng vật lộn với hai chuyện: lịch sử **hơi ngắn** và cơ cấu **hơi lệch**. Gần như mọi ý tưởng trong phương pháp đều nhắm vào một trong hai.

### Ý tưởng #1 — Gom thêm hành vi từ bốn nơi

Nếu lịch sử in-game của ai đó quá mỏng, một cách là nới rộng ra: cái gì thì được tính là "hành vi". **User Game Lifecycle (UGL)** của Tencent thôi nhìn một user chỉ qua các in-game action, mà nhặt tín hiệu từ bốn nơi:

| Ở đâu | Ví dụ hành vi |
|---|---|
| **Trong game** | Login, chơi một trận, mua đồ in-game, tham gia giải MOBA |
| **Tìm kiếm** | Tìm walkthrough, click một bài viết/video về game |
| **Quảng cáo & gợi ý** | Click một quảng cáo game, tải app, đặt lịch trước cho game sắp ra |
| **Mạng xã hội & cộng đồng** | Share một game, like/dislike một review, đăng status |

Mỗi hành động thành một **triple** nhỏ: `(type, game, date)`. Tìm walkthrough cho một game còn chưa sở hữu? Giờ cũng được tính. Đặt lịch trước, được tính. Like một review, được tính. Ghép bốn nơi lại, cái lịch sử 3–4 game kia đầy đặn hơn, giống một *lifecycle* — cung đường mối quan hệ của một người với một game, từ lúc mới tò mò, đến lúc chơi nhiều, rồi từ từ trôi đi.

### Ý tưởng #2 — Dọn mấy chỗ lặp lại thành "đang mê cái gì"

Triple thô vẫn còn hơi nhiễu. Login cùng một game năm ngày liền cho ra năm dòng gần như y hệt, đều nói cùng một điều: *dạo này người này mê game A.* Nên UGL **gom** các hành động lặp lại trong một time window thành một token, chỉ giữ lại số lần:

```
(login, gameA, ngày1) ┐
(login, gameA, ngày2) │
(login, gameA, ngày3) ├──►  (login, gameA, start=ngày1, end=ngày5, freq=5)
(login, gameA, ngày4) │
(login, gameA, ngày5) ┘
```

Một token, năm trường: type, game, ngày bắt đầu, ngày kết thúc, và bao nhiêu lần. Phần lặp lại xếp gọn lại, thứ còn lại là một lát cắt gọn gàng về **sở thích ngắn hạn** — người chơi đang mê gì lúc này, và đại khái mê tới đâu.

### Ý tưởng #3 — Để ý lúc người ta im lặng (phần mình thích)

Đây là chỗ đọng lại trong đầu mình. Việc gom nắm bắt cái người ta *làm*. Nhưng một lifecycle còn được tạo hình bởi cái người ta *thôi không làm* — mà một chuỗi bình thường lại không thấy được, vì chẳng có gì được log khi user đơn giản là nghỉ. Tencent làm cho sự im lặng đó hiện ra bằng cách *thêm vào* hai loại token kiểu "đã đi đâu mất":

- **Lost action.** Nếu user ngừng làm một hành động cụ thể trên một game cụ thể quá 7 ngày — ví dụ đang mua đồ ở game A rồi tự dưng ngưng — UGL thả vào một token **lost action**. Như một ghi chú nhỏ rằng một mạch sở thích đang nguội đi.

- **Silence action.** Nếu user *không làm gì cả*, trên *mọi* game, quá 7 ngày, UGL thả vào một token **silence action**. Đó là lúc người ta im hẳn — gần như là tín hiệu "có thể sắp rời đi" rõ nhất bạn có được.

Đây là ý mình thấy đáng yêu nhất trong bài. Đa số recommender chỉ học từ những gì user đã làm. UGL còn cố học từ những gì user *không còn làm nữa*. Làm việc gì đó cho biết về sở thích; ngừng lại cho biết về việc mất sở thích — và với một thứ như game, nơi người ta ra ra vào vào liên tục, tín hiệu "đang im dần" thường lại hữu ích hơn. Đó là khác biệt giữa một model biết bạn thích một game, và một model lờ mờ cảm được là bạn đang tuột dần.

### Ý tưởng #4 — Đừng để game hot ôm hết sự chú ý

Giờ tới chuyện thứ hai: cơ cấu lệch. Task pretraining theo kiểu BERT — giấu vài token trong chuỗi rồi nhờ model đoán lại (điền vào chỗ trống, nhưng cho hành vi người chơi). Vướng ở chỗ cách giấu thường dùng chọn token với **xác suất như nhau** ở mọi chỗ. Khi 90% token là game phổ biến, model dành 90% thời gian học lại thứ nó đã biết về mấy game hot, và gần như không gặp mấy game ít người chơi.

Cách Tencent sửa là **Inverse Probability Masking (IPM)**: đặt "khả năng bị giấu" của mỗi token *ngược* với chuyện game đó hay xuất hiện cỡ nào.

```
game phổ biến → khả năng bị giấu thấp   (model biết rồi; khỏi luyện thêm)
game ít chơi  → khả năng bị giấu cao    (hiếm; đẩy model học nó cho thật)
```

Bằng cách giấu game hiếm thường xuyên hơn nhiều, IPM nhẹ nhàng đẩy model học chúng thay vì để cái đuôi dài bị trôi mất. Một chỉnh sửa nhỏ trên một task tiêu chuẩn, nhắm thẳng vào chuyện cơ cấu lệch — và trong code tham chiếu, khả năng bị giấu rơi vào khoảng `[0.05, 0.40]`, tức game hiếm nhất bị giấu nhiều hơn game hot chừng 8 lần.

### Có giúp được gì không?

Bài báo đưa biểu diễn này vào hai task production thật và báo cáo:

| Task | Metric | Thay đổi |
|---|---|---|
| Quảng cáo game | AUC (offline) | **+1,83%** |
| Quảng cáo game | CVR (online) | **+21,67%** |
| Gợi ý item in-game | AUC (offline) | **+0,5%** |
| Gợi ý item in-game | ARPU (online) | **+0,82%** |

Mấy con số AUC offline trông nhỏ; mấy con số online mới là chỗ thú vị. Tăng **+21,67%** tỉ lệ chuyển đổi cho quảng cáo game là khá nhiều với một hệ thống vốn đã chạy ở quy mô Tencent — kiểu kết quả mà có lẽ tự nó đã trả đủ tiền cho cả nghiên cứu.

### Mình rút ra được gì

Nếu gác kiến trúc qua một bên, UGL về cơ bản là hai ý tưởng đơn giản nhắm vào hai vấn đề:

1. **Lịch sử quá ngắn →** nới rộng cái được tính là "hành vi" qua bốn nơi, và coi việc im lặng (lost và silence action) cũng là tín hiệu thật. Bạn không chỉ ghi lại người ta làm gì; bạn phác ra *hình dáng* cả mối quan hệ của họ với một game, kể cả lúc nhạt dần.
2. **Cơ cấu quá lệch →** giấu game hiếm thường xuyên hơn game phổ biến, để cái đuôi dài không bị bỏ quên.

Cả hai ý đều không cần data của Tencent mới dùng được. Riêng mẹo "để ý lúc người ta im lặng" đi xa được lắm — sang subscription, SaaS, app nội dung, gần như mọi thứ mà người dùng ra vào thất thường. Lần tới khi xây một model hành vi, có lẽ thử hỏi không chỉ *user đã làm gì*, mà còn *họ đã ngừng làm gì, và im lặng từ lúc nào.*

[Phần 2](/posts/user-game-lifecycle-2-building-the-pipeline/) đi qua cách mọi thứ ghép lại thành một pipeline — cấu trúc dữ liệu, bộ dựng lifecycle, embedder, encoder, và phần train hai giai đoạn — bằng lời lẽ dễ hiểu, không cần framework nào.
