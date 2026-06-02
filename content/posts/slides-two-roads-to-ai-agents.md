+++
date = '2026-03-23'
draft = true
title = 'Slides: Two Roads to AI Agents — Code or Markdown?'
description = 'Presentation slides with Vietnamese speaker notes. Hook framework: concrete examples first, then deep dive into SDK vs Skills.'
tags = ['ai', 'llm', 'agents', 'skills', 'sdk', 'slides']
+++

---

## Slide 1: HOOK

**"You need an AI agent. Do you write code... or markdown?"**

*Visual: Split screen — VS Code with Python on left, text editor with SKILL.md on right*

> **Notes:** Chào mọi người. Hôm nay mình sẽ nói về một câu hỏi mà ai làm AI agent đều phải đối mặt: bạn nên viết code để điều khiển LLM, hay viết markdown để dạy nó? Hai hướng đi, cùng một đích đến. Và câu trả lời đúng có thể không phải là chọn một trong hai.

---

## Slide 2: HOOK — The SDK Version

**"Send an email when a customer churns."**

```python
from agents import Agent, Runner

churn_agent = Agent(
    name="ChurnHandler",
    instructions="When notified of churn, draft a retention email.",
    tools=[lookup_customer, draft_email, send_email],
)

# YOUR server runs this loop
while True:
    event = queue.get()
    result = Runner.run(churn_agent, messages=[
        {"role": "user", "content": f"Customer {event.id} churned"}
    ])
```

**Who executes:** Your code calls the LLM API. Your server runs the loop. Your infrastructure retries on failure.

> **Notes:** Đây là SDK approach. Bạn viết Python. Code chạy trên server của bạn. Runner.run() gọi LLM API, nhận tool call, thực thi function lookup_customer, send_email trên máy bạn, rồi gửi kết quả lại LLM. Vòng lặp do code bạn điều khiển. Nếu email fail, code bạn quyết định retry hay không. Bạn own toàn bộ execution.

---

## Slide 3: HOOK — The Skill Version

**Same task. Zero code.**

```markdown
---
name: churn-handler
description: Handle customer churn events with retention emails
---
1. Look up the customer in CRM using their ID
2. Check their usage history for the last 90 days
3. Draft a personalized retention email based on their usage
4. Send via the email tool
5. Log the action to #customer-success Slack channel
```

**Who executes:** The AI agent reads this, decides what to do, calls tools on *its* host machine.

> **Notes:** Đây là skill approach. Bạn viết markdown. Không có code. Khi agent nhận event "customer X churned", nó đọc skill này và tự quyết định: gọi tool nào, theo thứ tự nào, với argument gì. Agent chạy trên máy host của nó — có thể là Claude Code trên laptop dev, hoặc Codex trên cloud. Bạn không viết loop. Bạn không viết retry logic. Agent tự xử lý.

---

## Slide 4: HOOK — Same Result, Different Everything

| | SDK | Skill |
|---|---|---|
| **You write** | Python/TypeScript | Markdown |
| **Loop runs on** | Your server | Agent's host |
| **Who calls tools** | Your code | The agent |
| **Error handling** | Your try/catch | Agent's judgment |
| **To change behavior** | Redeploy code | Edit a text file |
| **Who can modify** | Developers | Anyone |
| **Tested with** | Unit tests, CI | Prompt iteration |

> **Notes:** Nhìn bảng này. Cùng kết quả — customer nhận email. Nhưng ai viết, cái gì chạy, ở đâu, ai xử lý lỗi — hoàn toàn khác. SDK: bạn own execution. Skill: agent own execution. Đây là fundamental difference. Và nó quyết định khi nào dùng cái nào.

---

## Slide 5: HOOK — One More Example

**"Review this PR and post comments"**

```python
# SDK: 40 lines of orchestration
diff = github.get_diff(pr_id)
files = parse_diff(diff)
for file in files:
    review = Runner.run(review_agent,
        messages=[{"role": "user", "content": file.patch}])
    if review.issues:
        github.post_comment(pr_id, file.path, review.format())
```

```markdown
# Skill: 8 lines of instruction
1. Fetch the PR diff using gh CLI
2. For each changed file, review for bugs and style issues
3. Post inline comments on specific lines
4. If no issues found, approve the PR with a short summary
```

**SDK:** You decide to loop per-file. You format the comment. You call the API.
**Skill:** Agent decides how to chunk the work. Agent formats. Agent calls `gh`.

> **Notes:** Thêm một ví dụ. Review PR. SDK: bạn viết loop qua từng file, bạn quyết định format comment, bạn gọi GitHub API. 40 dòng code. Skill: bạn nói "review PR, post comment." Agent tự quyết định review từng file hay cả diff, tự format, tự chạy `gh pr review`. 8 dòng markdown. Kết quả giống nhau. Nhưng ai ra quyết định thì khác.

---

## Slide 6: PROBLEM — So Why Not Just Use Skills?

**Skills fail when you need guarantees**

- ❌ No retry logic — agent might give up after one failure
- ❌ No state machine — can't enforce "step 3 must happen before step 4"
- ❌ No observability — when it breaks, you don't know which step failed
- ❌ Non-deterministic — same input, different execution path each run
- ❌ Debugging is opaque — "why did it skip step 2?"

> **Notes:** Nếu skill dễ hơn, sao không dùng skill cho mọi thứ? Vì skill không có guarantee. Agent có thể skip bước. Có thể retry hoặc không. Có thể chọn path khác mỗi lần chạy. Khi nó fail, bạn không biết fail ở đâu. Không có log, không có trace, không có unit test. Đối với production system cần reliability — đây là dealbreaker.

---

## Slide 7: PROBLEM — And SDKs Have Their Cost

**SDKs fail when you need speed and accessibility**

- ❌ Only developers can modify agent behavior
- ❌ Changing "ask about language first" → code change → PR → deploy
- ❌ Framework lock-in (LangGraph ≠ CrewAI ≠ OpenAI SDK)
- ❌ Over-engineering simple workflows with state graphs
- ❌ Latency: multi-agent handoffs add round-trips

> **Notes:** Và SDK cũng có cost. Khi product manager muốn thay đổi thứ tự câu hỏi agent hỏi — đó là code change, PR, review, deploy. Một việc lẽ ra mất 30 giây edit markdown thì mất nửa ngày. Và code SDK không portable — viết bằng LangGraph thì không chạy được trên CrewAI. Skill thì write once, chạy trên Claude Code, Copilot, Codex, Cursor.

---

## Slide 8: SOLUTION — The Execution Model

**Where does code actually run?**

```
┌─────────────────────────────────────────────┐
│  SDK Approach                                │
│                                              │
│  Your Server ──→ LLM API ──→ Your Server     │
│  (runs loop)    (thinks)    (runs tools)     │
│                                              │
│  You control everything.                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Skill Approach                              │
│                                              │
│  Agent Host ──→ LLM ──→ Agent Host           │
│  (reads skill)  (decides) (runs tools)       │
│                                              │
│  Agent controls everything.                  │
│  Could be your laptop. Could be cloud.       │
└─────────────────────────────────────────────┘
```

> **Notes:** Đây là câu hỏi quan trọng nhất: code chạy ở đâu? SDK: server bạn gọi LLM API, nhận kết quả, chạy tool trên server bạn, gửi lại. Bạn own cả loop. Skill: agent host đọc skill, gọi LLM, LLM quyết định tool nào, agent host thực thi. Agent own loop. Nếu agent là Claude Code trên laptop — tool chạy trên laptop. Nếu agent là Codex trên cloud — tool chạy trên cloud sandbox.

---

## Slide 9: SOLUTION — The Tool Layer

**SDK tools: code functions. Skill tools: CLI commands.**

```python
# SDK: tool is a Python function you register
@tool
def lookup_customer(customer_id: str) -> dict:
    return db.query("SELECT * FROM customers WHERE id = ?", customer_id)
```

```markdown
# Skill: tool is whatever's on the PATH
1. Run `psql -c "SELECT * FROM customers WHERE id = '{id}'"`
```

**Terminal-native agents don't need MCP — the shell IS the tool layer**

> **Notes:** Tool cũng khác nhau. SDK: bạn viết function Python, register với framework, có type checking, error handling. Skill: agent dùng bất kỳ CLI tool nào có trên machine. psql, gh, kubectl, curl — tất cả đều là "tool." Trong môi trường có terminal, MCP server trở thành overhead. Tại sao wrap psql trong MCP khi agent chạy psql trực tiếp?

---

## Slide 10: DEEP DIVE — When SDK Wins

**Use case: Multi-step payment processing**

```python
async def process_refund(order_id: str):
    order = await get_order(order_id)
    if order.status != "delivered":
        raise InvalidStateError("Cannot refund")

    result = await payment_api.refund(order)
    if result.failed:
        await retry_with_backoff(
            payment_api.refund, order, max_retries=3
        )

    await notify_customer(order, result)
    await update_inventory(order)
    await audit_log.record(order, result)  # must always run
```

**You can't express "retry 3 times with exponential backoff" in markdown.**

> **Notes:** Payment processing. Bạn CẦN step 2 thành công trước step 3. Bạn CẦN retry với backoff. Bạn CẦN audit log chạy dù refund fail. Skill không express được những guarantee này. Agent có thể retry, có thể không. Có thể skip audit log. Trong payment, "có thể" là không đủ. SDK cho bạn deterministic control flow.

---

## Slide 11: DEEP DIVE — When Skill Wins

**Use case: Onboarding flow for a developer tool**

```markdown
---
name: onboarding
description: Guide new users through project setup
---
1. Check if Node.js is installed, guide installation if not
2. Check if API key exists in .env, help them get one if not
3. Ask what language they prefer for narration
4. Ask light or dark theme
5. Show a preview of what the tool can do
6. Offer to run a sample project
```

*Last week this was 4 steps. Added 2 more by editing the file. No PR needed.*

> **Notes:** Onboarding flow. Tuần trước có 4 bước. Product nói "thêm hỏi language và show preview." Mình edit file markdown, done. Không cần PR, không cần deploy, không cần developer. Nếu dùng SDK, đó là code change, test, review, deploy. Cho một flow mà thay đổi hàng tuần, skill nhanh hơn 100 lần.

---

## Slide 12: DEEP DIVE — Same Pipeline, Both Paradigms

**Educational Video Pipeline — real production system**

| Layer | Paradigm | Why |
|-------|----------|-----|
| Remotion rendering | **SDK** | Frame-exact timing, React components |
| ElevenLabs API calls | **SDK** | Rate limiting, retry, file I/O |
| TypeScript types | **SDK** | Compile-time validation |
| "What to ask the user" | **Skill** | Changes weekly |
| "How to generate the script" | **Skill** | Prompt iteration |
| Running `npx`, `node` | **Terminal** | No MCP wrapper needed |

**SDK parts: unchanged for months. Skill: edited weekly.**

> **Notes:** Pipeline thật. Biến blog thành video. SDK xử lý rendering, audio API, type checking — những thứ cần deterministic, không đổi. Skill xử lý workflow — hỏi gì, thứ tự nào, format preview ra sao — thay đổi liên tục. Terminal thay thế MCP cho tool execution. Đây là pattern production: stability in code, iteration in markdown.

---

## Slide 13: PROOF — The Convergence

**They're merging in 2026**

- OpenAI Agents SDK now loads `SKILL.md` natively
- Skills can include `scripts/` directories with executable code
- SKILL.md adopted as open standard across Claude, Copilot, Codex, Cursor

**The layered architecture:**

```
Skills     → what the agent knows        (markdown)
Shell/MCP  → what actions it can take    (CLI tools)
SDKs       → how it coordinates          (code)
```

> **Notes:** Tin tốt: bạn không cần chọn. Cả hai đang merge. OpenAI SDK load skill natively. Skill có thể include script. Production system dùng SDK cho orchestration layer, skill cho domain knowledge. Ba layer: knowledge là markdown, actions là shell hoặc MCP, orchestration là code. Hiểu cả ba layer — đó là competitive advantage.

---

## Slide 14: CTA — Decision Framework

| Need | Use |
|------|-----|
| Non-devs modify behavior | **Skill** |
| Fast iteration (<1 min) | **Skill** |
| Cross-platform portable | **Skill** |
| Deterministic control flow | **SDK** |
| Error recovery with retries | **SDK** |
| Multi-agent coordination | **SDK** |
| Production with SLAs | **SDK** |
| Real product | **Both** |

> **Notes:** Framework quyết định đơn giản. Nếu cần người không biết code thay đổi behavior → skill. Cần guarantee và reliability → SDK. Cần cả hai → dùng cả hai. Hầu hết production system sẽ dùng cả hai.

---

## Slide 15: CTA — One Line to Remember

### **"Put stability in code. Put iteration in markdown."**

*The developer who understands both layers builds better agents than the one who only knows one.*

> **Notes:** Một câu duy nhất: "Đặt sự ổn định trong code. Đặt sự thay đổi trong markdown." Cảm ơn mọi người.
