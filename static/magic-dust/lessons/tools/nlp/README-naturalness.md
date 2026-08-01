# Vietnamese naturalness checker

This optional checker uses PhoBERT pseudo-log-likelihood to compare generated
Vietnamese sentences or surface low-scoring lesson sentences for human review.
It complements `check-voice-terms.mjs`; it does not replace hard wording rules.

Requirements: Python 3.11+, `torch`, and `transformers`. The first run downloads
`vinai/phobert-base-v2` to the Hugging Face cache. Later runs can add `--offline`.

```powershell
# Rank rewrites (lower pseudo-perplexity is better)
node lessons/check-vietnamese-naturalness.mjs `
  --candidate "Lấy số lật rồi so với số gốc." `
  --candidate "Đảo thứ tự các chữ số rồi so sánh kết quả với số ban đầu."

# Show the 15 lowest-scoring learner-facing sentences in one lesson
node lessons/check-vietnamese-naturalness.mjs --offline --top 15 lessons/content/node10v2.js

# Use exact one-token-at-a-time PLL for a file when speed is not important
node lessons/check-vietnamese-naturalness.mjs --offline --exact --top 15 lessons/content/node10v2.js

# Existing deterministic gates still run separately
node lessons/check-voice-terms.mjs --strict lessons/content/node10v2.js
node lessons/validate-content.mjs --strict lessons/content/node10v2.js
```

Compare candidates that preserve the same meaning and technical tokens. A high
pseudo-perplexity can also come from character names, code, or rare domain
terms, so never turn a raw score into an automatic rewrite.

File audit mode groups each sentence's tokens into four interleaved masks for
speed. Candidate mode and `--exact` use exact one-token-at-a-time PLL.
