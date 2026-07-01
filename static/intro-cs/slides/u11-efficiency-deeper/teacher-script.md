# Unit 11 — Efficiency, Deeper · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Efficiency, Deeper (id: s01)
Narration: Welcome to Unit 11. Last unit we learned to judge a program by counting steps instead of timing a stopwatch. Now we give that count a shape. Some programs barely slow down as the input grows, some grow steadily, and some blow up completely. Today we meet all three — logarithmic, linear, and exponential — and we'll feel each one in real code.

## Slide 002: Recap — We Count Steps, Not Seconds (id: s02)
Narration: Quick recap from Unit 10. We stopped timing seconds on a clock, because that depends on the computer, and started counting steps instead. The question that really matters is this: as the input n gets bigger, how fast does the work grow? Three answers keep coming up. Logarithmic, which barely grows. Linear, which grows steadily. And exponential, which explodes. Let's make each one real.

## Slide 003: Guess My Number (id: s03)
Narration: Here's a game. I'm thinking of a number from one to a hundred. Each guess, I tell you higher or lower. What's your best strategy? You could guess one, two, three, in order — but that could take a hundred tries. Or you could guess the middle, fifty, and every answer throws away half the numbers still in play. Play it out: if my number is seventy-three, you guess fifty, I say higher, you guess seventy-five, I say lower. How fast does that close in?

## Slide 004: Halving Is Shockingly Fast (id: s04)
Narration: Watch what halving does. Start with a hundred numbers. Cut in half: fifty, then twenty-five, then thirteen, seven, four, two, one. That's just seven guesses to pin down any number from one to a hundred. The count of how many times you can halve n has a name: O of log n, logarithmic time. And here's the amazing part — if I double the range to two hundred, you need only one more guess. One extra step to handle twice as much.

## Slide 005: Scan Everything vs. Cut in Half (id: s05)
Narration: Let's name the contrast. Linear time, O of n, checks items one by one — a list twice as long takes twice as long. It shrinks the problem by one each step. Logarithmic time, O of log n, jumps to the middle and throws away half — a list twice as long takes just one more step. Cutting the problem by a factor each step is the whole secret of log time. But there's a price: halving only works if the list is sorted, so you know which half to keep.

## Slide 006: Binary Search — The Guessing Game in Code (id: s06)
Narration: Here's the guessing game written as code — it's called binary search. Low and high mark the range still in play. Mid is your middle guess. If the middle equals the target, you found it. If the middle is too small, the answer is higher, so move low up. If it's too big, the answer is lower, so move high down. Low and high squeeze together, halving the range each loop. No copying, so each loop is cheap and it runs about log n times. That's O of log n.

## Slide 007: Log vs. Linear — See the Gap (id: s07)
Narration: Now put numbers on it. For ten items, scanning takes ten steps, halving takes about four. For a thousand, scanning takes a thousand; halving, about ten. For a million items, scanning takes a million checks — but halving takes about twenty. Same job, wildly different cost. Look down the log column: it barely moves even as n explodes. That's why we reach for log time whenever we can.

## Slide 008: The Slow Direction — Doing the Same Work Twice (id: s08)
Narration: Now the opposite of halving. This is Fibonacci the naive way. To get fib of five, it computes fib of four and fib of three — two calls. Each of those splits into two more, and so on. The trouble is the same little answers get computed over and over. Fib of three shows up again and again in the tree. Two calls per step makes the work branch and pile up. That's O of two to the n — exponential.

## Slide 009: Three Speeds, Side by Side (id: s09)
Narration: Here are all three speeds in one table. For n equals five, log is about two, n is five, and two to the n is thirty-two. At n equals ten, two to the n is already over a thousand. At twenty, over a million. At fifty, more than a quadrillion. Log stays tiny. Linear keeps pace with n. Exponential runs right off the page. Computing fib of fifty the naive way would take longer than your whole lifetime. The class you land in matters more than any clever tweak inside a step.

## Slide 010: The Fix — Remember Your Answers (id: s10)
Narration: Here's the fix, and it's beautiful. Keep a dictionary — a map from a number to its answer. Before working out fib of n, check whether you've already solved it. If it's in the dict, just return the stored value instead of redoing all that work. Otherwise compute it once, store it, and return it. Now each value is computed exactly once, and exponential collapses to linear — O of n. This trick is called memoization: same answers, exponentially less work.

## Slide 011: Quick Check (id: s11)
Narration: Quick check. Guessing a number from one to a hundred by always picking the middle — about how many guesses do you need in the worst case? Take a second. The answer is about seven, because you can halve a hundred down to one about seven times. That's log time. Guessing in order could take up to a hundred — that's linear. There are more questions in the unit's quiz file.

## Slide 012: Recap & Next (id: s12)
Narration: To recap the three speeds. Logarithmic cuts the problem in half each step and barely grows — that's binary search and the guessing game. Linear touches everything once and grows steadily. Exponential branches and redoes its own work, so it explodes — and you fix it by remembering answers, memoization. Notice binary search needed a sorted list. That's exactly why sorting matters, and it's where we go next: searching and sorting. Try the Unit 11 exercises first.
