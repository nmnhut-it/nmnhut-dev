# Tower-climb mode + side nodes — "THÁP VÔ ĐỊNH"

Owner idea (2026-07-05): add a **tower-climb mode** (mode leo tháp) and **side
nodes** (node phụ) — extra, optional challenge content beyond the main story
path, seeded partly from an open coding-problems dataset.

## Fits the lore for free

Kotopia's finale is the Dark Lord's **black tower** (node08, `CUTSCENE-PLAN.md`).
So the tower-climb IS that tower as a **challenge mode**: "leo THÁP VÔ ĐỊNH" —
climb the Dark Lord's tower floor by floor, each floor a coding trial / mini-boss,
difficulty ramping, climb as high as you can (score = floor reached + turns).
Side nodes = optional off-path islands on the map (bonus practice + rewards).

## Problem sources — LICENSING (decided)

- ✅ **MBPP** (Mostly Basic Python Problems) — 974 entry-level Python problems,
  **CC-BY-4.0** (usable WITH attribution). Each: prompt + reference solution + 3
  tests. The main seed for the ADVANCED tower floors.
- ✅ **HumanEval** (OpenAI) — 164 problems, **MIT**. Secondary seed.
- ⚠️ **LeetCode / HackerRank** — proprietary, copyrighted problem statements.
  Do NOT scrape/redistribute problem TEXT verbatim (copyright/ToS). **Update
  2026-07-06 (owner override):** using `newfacade/LeetCodeDataset` (HF) as an
  idea/shape source is approved — see `TOWER-FLOOR-CANDIDATES.md` for the
  curated floor list. Every floor's Vietnamese problem statement is freshly
  written in Pip's voice, not translated from LeetCode; internal "Đề gốc"
  attribution (question_id) is kept for tracking only, never shipped.
- **Attribution:** if we ship MBPP-derived floors, add a CREDITS line
  ("Một số thử thách phỏng theo bộ MBPP, CC-BY-4.0") + keep the license note.

**Pedagogy caveat:** even MBPP assumes `def` / lists / loops — ABOVE the early
main-path nodes (node04 has only just met `if`). So dataset problems feed the
HIGHER tower floors / advanced side nodes, NOT floor 1. They also need
**translation to Vietnamese + difficulty tiering + wrapping in our expectOut
grader**; we don't drop raw English specs on a grade-9 kid.

## Tower structure (tiered by what's been taught)

| Floors | Source | Level |
|---|---|---|
| 1–3 (warmup) | AUTHORED, reuse main-path concepts (say/if/biến/==) | matches node0-4 |
| 4–8 | authored + lightly-adapted MBPP (the simplest: string/number ops) | needs while/loops (node07+) |
| 9+ (endless) | MBPP / HumanEval adapted, escalating | advanced / for fast finishers |
| Boss floors (every 5th) | a gesture-KO mini-boss (reuse boss-fight ko-mode) | milestone |

Each non-boss floor = a `{code:...}` challenge cell with `expectOut` grading
(reuse the existing code-cell + Pyodide infra) — the harness already runs +
grades student code. A tower is just a sequence of challenge cells + boss floors,
with HP/lives + a floor counter, persisted in localStorage.

## Side nodes (node phụ)

Optional islands on the saga map (off the main lighthouse path), each a short
extra-practice node or a single challenge, granting badges/bombs (ties into the
forge economy, `FORGE-PLAN.md`). Unlocked but skippable — never gate the main
story. Good home for "one more rep" of a concept a kid struggled with.

## Engine reuse (mostly existing pieces)

- Challenge cells = `{code:...}` cells (`code-cells.js` + `notebook-runner.js`)
  with `expectOut` (`cell-validation.js`) — already built.
- Boss floors = `boss:{ko:true}` gesture-KO (`boss-fight.js`) — already built.
- New: a **tower runner** (floor sequence + lives + floor counter + score +
  persistence) — a thin orchestrator over the existing cell factories, plus a
  tower entry point on the map (`saga.js`) and a results/leaderboard screen.
- Difficulty scaling + a pool of graded challenges (authored + adapted MBPP).

## Doctrine

- Optional & additive: the tower/side nodes NEVER block the main story path.
- No-dead-end inside a floor (retry; expectOut hints).
- Pip voice + Kotopia lore (the tower = the Dark Lord's tower).
- Tiered to what's taught; dataset problems only where the prereqs are met.
- Attribution for CC-BY (MBPP).

## Build order (checkpoint-first)

1. **Fetch + inspect MBPP** (CC-BY-4.0) — pull the dataset, look at real problem
   difficulty/shape, pick the subset whose prereqs match our taught concepts.
   (HumanEval/MIT as secondary.) Stage under a data/ dir, NOT shipped raw.
2. **Prototype: a 3-floor tower** (2 authored warmup floors + 1 gesture-KO boss
   floor) with a minimal tower-runner + map entry — owner review.
3. Then: difficulty pool, adapted MBPP floors, side nodes, results screen.

## Status
| Piece | Status |
|---|---|
| This plan | drafted 2026-07-05 — awaiting owner review |
| MBPP/HumanEval fetch + license note | not started (superseded — LeetCodeDataset-shaped floors shipped instead, see below) |
| Tower-runner engine (floors/lives/score/persist) | **built 2026-07-06** — `lessons/tower-state.js` (pure `TowerState`, tested by `test-tower-state.mjs`, 13/13 passing) + `lessons/tower.js` (HUD/results-screen composition root, a fork of `island.js`) |
| Map entry + side nodes (saga.js) | **built 2026-07-06** — `tower` entry in `saga.js`'s `SIDE_ISLANDS`, `unlockAt: 5`, pos `{x:95,y:60}` |
| 30-floor build (all floors, not just a 3-floor prototype) | **expanded 2026-07-13** — 30 floors in `lessons/content/tower.js`; floors 21-29 add list scanning, Euclid, prime checking, order checking, and binary search; every `expectOut` is verified by `test-content-solutions.mjs` against the reference solution |
| Problem adaptation (translate + tier + expectOut) | **done for the shipped floors** — see `TOWER-FLOOR-CANDIDATES.md`'s per-floor prose (unchanged) + the verified `expectOut` table below |
| In-browser QA (camera/gesture boss floors, HUD wiring, map pin) | **NOT verified** — no headless camera harness in this repo; a human must open `tower.html` via `serve.py` (port 8123) and play through |

### Verified expectOut (2026-07-06, `python3 -c "..."` against each reference solution)

| Floor | Seed | Correct output | Ships as |
|---|---|---|---|
| 1 | d1=2,d2=3,d3=4 | 15 | `/\b15\b/` |
| 2 | thap=3,cao=7 | 3 | `/\b3\b/` |
| 3 | 121 (tram=1,donvi=1) | DOI XUNG | `/doi xung/i` |
| 4 | so=28 | HOAN HAO | `/\bhoan hao\b/i` |
| 6 | so=6 | HOP LE | `/hop le/i` |
| 7 | so=153 | TU HAO | `/\btu hao\b/i` |
| 8 | n=34,k=6 | 9 | `/\b9\b/` |
| 9 | so=12321 | DOI XUNG | `/doi xung/i` |
| 11 | "FlaG" | KHONG DUNG LUAT | `/khong dung luat/i` |
| 12 | "aaabbb" | DUNG LUAT | `/dung luat/i` |
| 13 | "1101" | 1 THANG | `/1 thang/i` |
| 14 | "0100" | 1 | `/\b1\b/` |
| 16 | "Hello, my name is John" | 5 | `/\b5\b/` |
| 17 | "kotopia" | ktp | `/ktp/i` |
| 18 | "AB" | 28 | `/\b28\b/` |
| 19 | so=100 | 202 | `/202/` |
| 5, 10, 15, 20 | — | gesture-KO boss (no expectOut) | `boss:{ko:true}` |

All 20 floor slots are filled (16 code floors + 4 boss floors) — none stubbed.

### CREDITS line (owner-approved wording, per licensing note)

Shipped nowhere yet as a visible in-app "About/Credits" screen (this repo has
none) — the line is recorded here and in `lessons/README.md`'s tower section
for whenever such a screen exists: *"Một số thử thách phỏng theo các bài
toán lập trình phổ biến (LeetCode Easy), viết lại hoàn toàn bằng tiếng
Việt."*
