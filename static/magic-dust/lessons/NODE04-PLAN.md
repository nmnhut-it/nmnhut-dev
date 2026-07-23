# Node 4 — plan (BUILT — see `content/node04.js`, `lesson04.html`, registered in `saga.js`)

Status (2026-07-03): all 3 challenges shipped, using `else` + the `freeze()`/
`display()` unlocks below, plus a boss (THE PARADOX SPHINX). Kept as a
design-rationale reference — content may still evolve.

## Why this node is different from 0-3

Nodes 0-3 each taught exactly one new concept (I/O → words/variables →
numbers/arithmetic → if/elif on camera). Node 4 teaches **at most one** new
concept too (see below) — but its main job is **combination**: throw
everything already learned (read_num/say_num, +-*/, variables, accumulation
`x = x + 1`, watch()/fire_vortex()/lighten()/darken(), if/elif) into a few fun,
game-like puzzles that use the gesture+AR toolkit, not just drill one thing
at a time. This matches your ask: "if và + - và biến đã tổ hợp được nhiều
bài toán hay."

## The one new concept: `else`

Only `if`/`elif` exist so far — no catch-all branch. `else` is the natural,
tiny next step (no new symbol beyond a keyword), and it unlocks much richer
puzzles (a fortune-teller machine, a calculator with a fallback case) without
introducing comparison operators (`>`, `<`) yet — those stay for a LATER
node, since adding a new operator AND recombining everything at once would
break the "one new thing" rule (a genuinely different building block, not
just more branches on `==`).

## Core principle: camera (`watch()`) is the input, not `read_num()`

The whole point of node04 is combining what's taught with the gesture/AR
toolkit itself — so every number that feeds the math/logic below should
come from a REAL finger-count read via `watch()` (camera_charm), not a
typed `read_num()` (old_computer). Typing numbers already got its own
lesson (node02); node04's job is to prove the SAME arithmetic/if-elif-else
logic works when the input is your own hand held up to the camera —
consistent with the whole saga's "logic stays, machine changes" idea. This
also means every challenge below is naturally a small unlock/reward beat:
show the right sequence of fingers, get the right computed reaction
(fire/light/dark/a spoken result) — the camera IS the puzzle interface,
not just a flavor detail on top of typed-number math.

## A cheap new unlock: `freeze()` (the ❄ FROST spell)

Checked what's left to unlock beyond `watch()`: `fire_vortex`/`lighten`/`darken`/
`photo_booth` are ALL already given out in node03 — nothing left unused
there. But the ENGINE already fully defines a `freeze` FX (`constants.js`
`FX.freeze` — color `#7ce7ff`, bloom 2.6) and `castSpell('freeze')` already
works end-to-end (`casting.js` looks it up by name) — it's just never
triggered, because `camera_charm.py` never exposes a `freeze()` function
(only `machines.py`'s unrelated legacy `future_machine_freeze()` calls it,
for the old odd/even lesson). So node04 can add a REAL new unlock at near-
zero engine cost: `freeze()` in `camera_charm/__init__.py`
(`bridge.tell("spell","freeze")`) + a "SCROLL OF FROST" gift cell — a
natural twin to `fire_vortex()` (fire), the same "twin gift" pattern node03
used for `lighten()`/`darken()`. Suggested theme: "lửa hay băng?" — if/elif/
else on a COMPUTED value (from real watch() reads + arithmetic) decides
fire_vortex() vs freeze().

## Proposed challenges (recombination, not new teaching)

1. **"Máy tiên tri" (fortune machine)** — `if/elif/else` on `watch()`'s
   finger count (1-5), each branch does a DIFFERENT combo of things already
   known: say() a message, say_num() a computed value, fire_vortex()/lighten()/
   darken(). The `else` branch is the "no rule matched" catch-all —
   demonstrated by deliberately giving 4 rules but 5 possible finger counts.
2. **"Máy tính có phép cho sẵn"** — TWO real `watch()` reads (show fingers
   twice — e.g. 3 then 2), an operator symbol given IN THE STORY (not
   typed, so no new syntax), student writes the if/elif/else chain
   matching the given symbol to the right arithmetic op and say_num()s the
   result — e.g. "phép + " → 3 ngón rồi 2 ngón → 5.
3. **"Đoán kết quả"** — inverse of #2: TWO real `watch()` reads plus a
   target result already computed/spoken by the machine, use if/elif/else
   to figure out WHICH operator (+, -, *) must have produced it, entirely
   with values already known (== comparisons only, no new operator).
4. **Combined finale (boss-adjacent or the boss itself)** — a short program
   using accumulation (`score = score + ...`) across several if/elif/else
   branches driven by sequential real camera reads (watch() calls in a
   row, like node03's finisher), landing on a fire/light/dark bogus based
   on the accumulated total.

## Open questions for you to confirm before I write content/node04.js

1. Does `else` sound right as node04's one new concept, or did you have a
   different single addition in mind (e.g. comparison operators, a new
   camera_charm word)?
2. Which of the 4 challenge ideas above do you want, in what order — all
   4, or trim to 2-3 so the node doesn't run long?
3. Boss fight theme/name for node04 (matches Bug Wraith / Syntax Serpent
   pattern) — any preference, or should I propose one?
4. Should node04 pilot any of the NEW gesture verbs (swipe/track) inside
   its own quiz/boss content, or keep those experimental and stay with
   finger-count holds for this node's own quizzes?
