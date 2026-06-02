+++
date = '2026-03-27'
draft = false
title = 'LLM Cost Optimization — Implementation Guide for Teams'
description = 'Practical guidelines for implementing 7 cost-optimization levers. Written for mixed teams.'
tags = ['ai', 'llm', 'optimization', 'routing', 'cost', 'guide']
aliases = ['/posts/llm-cost-optimization-implementation-guide/']
+++

Companion to [7 Levers That Cut Our LLM Costs by 80%](/posts/your-llm-bill-is-80-percent-waste/). That post covers *what* and *why*. This one covers *what good looks like* for each lever.

<div style="margin:1.2em 0;">
<button id="copy-md-btn" onclick="(async()=>{const b=document.getElementById('copy-md-btn');try{const r=await fetch('/md/llm-cost-optimization-implementation-guide.md');const t=await r.text();await navigator.clipboard.writeText(t);b.innerHTML='&#9989; Copied!';setTimeout(()=>b.innerHTML='&#128203; Copy as Markdown',2000)}catch(e){b.innerHTML='&#10060; Failed';setTimeout(()=>b.innerHTML='&#128203; Copy as Markdown',2000)}})()" style="cursor:pointer;padding:0.45em 1.1em;font-size:0.92em;border:1px solid #ccc;border-radius:8px;background:#fafafa;color:#333;transition:all 0.2s ease;" onmouseover="this.style.background='#eee';this.style.borderColor='#999'" onmouseout="this.style.background='#fafafa';this.style.borderColor='#ccc'">&#128203; Copy as Markdown</button>
</div>

## Tasks

1. **Read and follow the guidelines below** for every lever you touch
2. **Log every LLM call** and test on lower models with LLM-as-judge for loss function
3. **"Important task" pass** — allow flagged tasks to bypass routing and go directly to the best model
4. **Thread-based context management** — fork, summarize, retrieve
5. **Router:** cap output per task type, check model tier, implement semantic matching for routing
6. **LoRA:** train on Cocos2dx JS and the team's database schema

---

## Guidelines

### Log Everything

- Log every LLM call at the client layer — prompt, output, model, tokens, latency, user accept/reject signal
- Replay logged prompts through cheaper models, score against the expensive model's accepted output using LLM-as-judge
- Accepted pairs double as LoRA training data — logging and fine-tuning work best as one initiative

### Route by Difficulty

- 2 tiers (cheap/strong) is a good starting point — add more only when misroute data supports it
- Classify 1,000+ real queries before building the router
- Keyword overrides for high-confidence terms first, semantic matching for the fuzzy middle
- **"Important task" pass:** some tasks (production incidents, security reviews) benefit from always going to the best model — a simple flag or keyword override handles this cleanly
- Shadow mode for 1 week before going live; misroute rates below 5% tend to give the best ROI
- Passing context by reference (file paths) rather than inline keeps orchestrator costs down

### Manage Context

- Track context utilization (`tokens_used / context_window`), alert at 60%
- Thread-based: one task per thread, fork subtopics into sub-threads with only the relevant context
- Summarize at milestones (~10 turns) with a cheap model; replace history with summary + last 2 messages
- Keep full transcripts in storage — summaries serve the window, originals serve everything else

### Cache at Every Layer

- Static content first in prompts, dynamic last — this alone enables prefix caching (50-90% off)
- No timestamps or session IDs in system prompts — they break the cache
- Semantic caching: start with cosine > 0.95, lower gradually after validating quality
- TTLs on every entry; skip caching for non-deterministic queries

### Cap the Output

- Per-task-type caps, not global — classification (30 tokens) and analysis (600 tokens) are different tasks
- Prompt instructions ("category name only, no explanation") produce better output than hard truncation
- `max_tokens` at 1.5x P90 output length works well as a safety net
- "Answer directly, do not deliberate" reduces hidden thinking tokens on simple tasks

### Materialize Known Solutions

- Good candidates: output is near-deterministic, process stable 4+ weeks, no reasoning needed
- Let the LLM write its own replacement from 50 representative examples
- Shadow mode 1-2 weeks (>95% equivalence), keep LLM as fallback, review quarterly

### Fine-Tune with LoRA

- 500+ accepted pairs per category before starting — LoRA benefits from patience
- **Our priority domains:** Cocos2dx JS (lifecycle hooks, scene transitions, component patterns) and the team's database schema (table relationships, query patterns, migration conventions)
- Quality gate: within 5% of the expensive model on held-out test set
- Canary rollout: 5% → 25% → 50% → 100% over 2 weeks
- Monthly retraining, weekly drift checks
- Fix prompts first if the expensive model underperforms — LoRA amplifies quality, not fixes it

### Batch Async Work

- Tag every call as `realtime` or `async` — most teams find 20-40% qualify for batching
- Provider batch APIs (Anthropic, OpenAI, Google) give 50% off, same quality
- Fallback to synchronous for urgent requests; keep fallback rate below 5%
