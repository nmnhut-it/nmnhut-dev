# Ritual variants + concept-chant rituals — design plan

From the 2026-07-04 conversation: make lessons more visceral — (1) when a
node teaches a word (`say`, `read_num`, `if`…), its RITUAL should require
SPEAKING that word out loud (chant) on top of the hand-sign; (2) every
node's ritual should look/feel unique — variants over color, circle
geometry, glyphs, brightness, size, and how the light MOVES.

Building blocks already shipped: `engine/chant-match.js` (word-level
transcript matcher built for onboarding's "CODE!" chant — accept-set +
edit-distance + phonetic sound-skeleton tiers, pure & tested),
`ritual-vortex.js` (magic circle v2 + glyph dust), `engine/voice-*` modules
(mic meter + SpeechRecognition wrapper extracted from onboarding),
onboarding's C4 fallback rules (no mic → hold longer; never a dead end).

## A. Ritual theme system (visual variants)

**Declarative per-node theme** consumed by `ritual-vortex.js`; content
carries only a config object (CONTENT layer stays data-only):

```js
ritual: { sign: 2, theme: {
  palette: { core:'#7ce7ff', dust:'#a98bff', rune:'#ffd36b' },  // màu sắc
  circle:  { rings: 3, poly: 'triangle'|'square'|'penta'|'none', spin: 1 }, // vòng tròn
  glyphs:  'say',            // kí tự trên vòng — the node's TAUGHT WORD spelled
                             // out as runes (pedagogy: the circle IS the word)
  glow:    0.8,              // độ sáng (bloom/brightness scalar)
  scale:   1.2,              // to nhỏ
  motion:  'orbit'|'spiral-in'|'rain'|'pulse'|'comet',  // cách ánh sáng hoạt động
}}
```

- Defaults = today's look; every key optional (full backward compat).
- A THEMES preset table lives in the engine (one entry per motion style);
  content may name a preset or override keys.
- Validator: schema for `ritual.theme` (unknown keys/motion names = ERROR).
- Per-node assignment idea (tune hands-on): node00 calm `orbit` cyan →
  node02 `pulse` gold (numbers/heartbeat) → node03 `spiral-in` violet →
  node05 `comet` two-tone (comparison = two streams) → node06 `rain`
  (loop = repetition). Distinct silhouette per node so kids notice.

## B. Concept-chant rituals (nói + làm)

- Generalize `chant-match.js`: `matchWord(transcript, target, accept=[])`
  — same 3 tiers (fold/word-split → accept set → edit-distance ≤1 →
  phonetic skeleton), target-parameterized. `matchChant` stays as the
  "code" special case (onboarding untouched).
- Content: `ritual: { sign: N, chant: 'say', chantAccept: [...] }` —
  optional. With `chant`, the ritual gate becomes sign-hold + spoken word
  (same surge model as onboarding: hold charges to 70%, chant match →
  surge 100% → seal). Reuse the extracted voice engine modules.
- **Fallbacks (no dead ends, same as onboarding C4):** no mic/SR
  unsupported → hold-only charges to 100% over a longer hold; caption
  still invites yelling for flavor. No camera → tap-hold as today.
- **Word choice constraint:** 1-syllable English targets are noisy — every
  target ships a hand-tuned `chantAccept` list of likely vi-VN/en-US
  mishearings (like CHANT_ACCEPT for "code"); tune with the SR-log
  harness before rollout.
- **Pilot-first (like swipe/track):** wire node00 (`say`) only; verify
  live twice per the project convention; then roll out per-node words
  (node02 `read`, node03 `if`→"íp"?, node06 `while` — pick after tuning;
  short/ambiguous words may stay chant-less).
- Dev hooks: `ritual.forceChant()` (inject fake transcript) alongside the
  existing `ritual.forceFingerCount(n)`; cheat-panel button.

## Execution status

| Item | Status |
|---|---|
| A theme system + per-node themes | done 2026-07-04 — `engine/ritual-theme.js` (resolveTheme/themeIssues, tested by `test-ritual-theme.mjs`) + 5 motion behaviors in `ritual-vortex.js` + node00–06 themed + validator schema + README table |
| B chant-match generalization + node00 pilot | done 2026-07-04 (Sonnet, worktree) — `matchWord` + node00 `chant:'say'` wired; LIVE mic verification (real voice, "verified live twice") still pending |
| Rollout to all nodes, live tuning | pending pilots |
