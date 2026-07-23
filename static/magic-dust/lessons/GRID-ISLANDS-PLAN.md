# Grid Islands Plan — 3 bonus "mảng hai chiều" islands (2026-07-07)

Raw research: `lessons/research/2d-array-exercises-raw.md` (88 prompts, 11 sources).
This doc curates that raw haul into 3 buildable side-islands, gated after
node15 ("Grid Memory: Hàng và Cột").

## Taught-vocabulary ceiling (verified against content/node00–node15.js)

Available: `list` literals, `grid[hang][cot]` read/write, `row = grid[i]`,
`len()`, `range()`, `for`/`while`, `if/elif/else`, `and/or/not`, `==`/`!=`/
comparisons, arithmetic, `str()`, string concat, nested `for`.

**NOT taught anywhere yet — do not use:** `def` (no user functions),
`.append()`, `.sort()`/`sorted()`, slicing (`a[1:3]`), list comprehensions,
recursion, NumPy. Any grid that needs to be "built" must be a pre-sized
literal (e.g. `grid = [[0,0,0],[0,0,0],[0,0,0]]`) filled via index
assignment in a nested loop — the same pattern node15 already uses.

## Island 1 — "ĐẢO BẢNG SỐ" (`islandGRIDBASIC`, unlockAt: 16) — basic

Reinforces node15 grid reading before adding scan patterns over a full grid.
- Read/print specific cells; build a grid from a formula (`grid[i][j] = i*j`,
  from w3resource + Snakify's shared example) via nested loop + pre-sized literal.
- Sum of all elements in a grid (Vietnamese-source basic).
- Count positive/zero/target-value elements in a grid.
- Average of all elements (sum / (hàng × cột)).
- Max element of the whole grid; max element of a single row.
- Sum of one row / one column (column = walk `grid[hang][cot_co_dinh]` across hàng).
- Find the maximum element of each row (GfG basic, adapted: print each row's max).

## Island 2 — "ĐẢO PHÉP TOÁN BẢNG" (`islandGRIDOPS`, unlockAt: 16) — intermediate

- Add two same-size grids element-wise into a new pre-sized grid (GfG).
- Scalar multiply every element by a constant (GfG/Snakify).
- Transpose via nested loop into a new grid (`GfG` transpose-by-loop, not `.transpose()`).
- Swap two rows / two columns of a grid (PYnative rotate-adjacent idea, Snakify swap-columns).
- Sum of the main diagonal and the anti-diagonal (GfG); difference between the two sums.
- Check whether a grid is symmetric (`grid[i][j] == grid[j][i]` for all cells).
- Build a bordered grid: 1 on the border, 0 inside (NumPy source's idea, ported to plain loops with `if hang==0 or hang==last or cot==0 or cot==last`).

## Island 3 — "ĐẢO TRUY TÌM & BIẾN HÌNH" (`islandGRIDQUEST`, unlockAt: 16) — advanced

- Search a target value's (hàng, cột) position in a grid; report "not found" if absent.
- Multiply two small fixed-size grids (2×2 or 2×3, triple nested loop, GfG/w3resource/quantrimang "phép nhân ma trận" — no `numpy.dot`).
- Rotate a grid 90° into a new pre-sized grid (`new[cot][n-1-hang] = old[hang][cot]`, GfG "rotate matrix").
- Hourglass max sum on a small fixed board (HackerRank "2D Array - DS", scaled down from 6×6 to a size that keeps the loop count sane by hand-checking, still same shape logic).
- Magic-square check: every row sum, column sum, and both diagonal sums equal (GfG "check magic square").

Difficulty step-up across the 3 islands mirrors node13→14→15's own ramp
(read/index → scan patterns → whole-grid nested loop), just one level up.

## Naming / registration (not yet done)

Follow `islandNESTEDFOR.js`'s structural template (intro cell → npc → demo
code w/ `expectOut` → quiz → gift → checkpoint → more demo/fix-it pairs →
closing sandbox cell → badge gift → `remember` cell; no boss, matching
`islandNESTEDFOR`/`islandPATTERN`'s no-boss pattern for skill-drill bonus
islands). Each island needs a `saga.js` map entry (`unlockAt: 16`, art
paths under `assets/world/side-islands/island-grid-*-{lit,unlit}.png` —
**art not yet generated**, use the `gemini-art` skill in a follow-up pass)
and an `islandGRIDBASIC.html`/`islandGRIDOPS.html`/`islandGRIDQUEST.html`
page cloned from `islandNESTEDFOR.html`'s structure.
