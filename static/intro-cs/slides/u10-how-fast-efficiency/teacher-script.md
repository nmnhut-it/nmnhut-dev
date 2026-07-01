# Unit 10 — How Fast? (Efficiency) · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: How Fast? (id: s01)
Narration: Welcome to Unit 10. So far we've cared about one thing: does the program give the right answer? Today we add a second question — how much work did it do to get there? Two programs can both be correct, but one finishes in a blink while the other takes all day. Our fair way to measure that work is to count steps, not seconds.

## Slide 002: Same Answer, Different Speed (id: s02)
Narration: Picture finding one name in a class list of size n. Recipe A checks every name, one by one. Recipe B uses a clever shortcut that skips most of them. Both find the name — both are correct. So the interesting question isn't "is it right?" It's "how much work did it do?" For thirty names it hardly matters. For thirty million, it decides everything.

## Slide 003: Why a Stopwatch Lies (id: s03)
Narration: The obvious idea is to time it with a stopwatch — start the clock, run the recipe, see how many seconds. But run the exact same code on a fast gaming PC and you get a small number; run it on an old phone and you get a big one; open some other apps and it changes again. Seconds measure your computer and the moment, not your recipe. We need something fairer.

## Slide 004: Count the Steps, Not the Seconds (id: s04)
Narration: Here's the fair measure: count the little actions the recipe does. Every compare, every add, every store counts as one step. We pretend each step costs the same and just count how many happen. The beauty is that this count is the same whether you run on a supercomputer or a pocket calculator. Steps belong to the recipe; seconds belong to the machine.

## Slide 005: Let's Count One (id: s05)
Narration: Let's actually count a small one. We set result to zero — that's one step. Then a loop runs n times, doing one step each pass. Then we return — one more step. Add it up: one, plus n, plus one, gives n plus two. Notice the count is a formula in n. Bigger list, more steps. If n is 100 that's 102 steps; if n is 1000, it's 1002. The growth is the part we care about.

## Slide 006: Class 1 — Constant (id: s06)
Narration: Our first class is the dream case. This function just grabs the item at position zero and returns it. Whether the list has ten items or ten million, it does the same tiny amount of work — no loop, no growth. We call that constant time, and we write it O of 1, said "order 1." The 1 doesn't mean literally one step; it means a fixed number that never grows with the input.

## Slide 007: Class 2 — Linear (id: s07)
Narration: Second class: one loop over everything. Here we walk through all n people looking for a match, doing one compare each time. That's about n steps. Double the list and you double the work — a straight line. We call this linear time, written O of n. This is exactly Recipe A from earlier: honest, simple, and it scales in step with the input.

## Slide 008: Class 3 — Quadratic (id: s08)
Narration: Third class, and this is where it gets scary. We have a loop inside a loop. For each of the n people in the outer loop, we scan all n people again in the inner loop. That's n times n steps. We call it quadratic time, written O of n squared. A nested loop is the classic warning sign — the work doesn't just grow, it grows like the square of the input.

## Slide 009: Watch It Grow (id: s09)
Narration: Let's make that real with a table. Constant time stays at one step no matter what. Linear keeps pace with n. But look at quadratic. At a hundred items it's ten thousand steps. At a thousand, a million. At a million items, it's a trillion steps — completely hopeless in real time, on any computer. Same answer as the linear version, but you'd wait years for it. The shape of the growth is what matters.

## Slide 010: Big-O: Shorthand for How It Grows (id: s10)
Narration: We counted n plus two steps earlier. But as n gets huge, that plus two stops mattering — a million and two is basically a million. So we simplify. We keep only the fastest-growing part and throw away the constants. n plus two becomes O of n. Five times n is still O of n. And n times n plus some smaller stuff is O of n squared. Big-O names the shape of the growth, not the exact step count.

## Slide 011: There's More (Coming Up) (id: s11)
Narration: Three classes today, but there's a whole ladder. Above linear there are clever recipes that skip most of the work — that's Recipe B, and it's faster than a single loop. Below quadratic there are recipes where the work doubles for every new item, which is even worse. Those two — O of log n and O of two to the n — are the stars of Unit 11. Today we own constant, linear, and quadratic.

## Slide 012: Quick Check (id: s12)
Narration: Quick check. A loop inside a loop, each running n times — how does the number of steps grow? Take a second. The answer is about n times n, which is O of n squared: the outer loop runs n times, and each pass runs the inner loop n times. And watch out for that last option — the step count never depends on which computer you use. That was the whole reason we count steps instead of seconds.

## Slide 013: Recap & Next (id: s13)
Narration: To recap: seconds measure your computer, but counting steps measures the recipe fairly. How that count grows with n gives the class — O of 1 constant, O of n linear, O of n squared quadratic. One loop is linear; a loop inside a loop is quadratic and explodes. And Big-O keeps only the fastest-growing part, the shape rather than the exact number. Next unit, we meet the even-faster and even-slower classes.
