# Unit 2 — Choices &amp; Repetition · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Choices & Repetition (id: s01)
Narration: Welcome to Unit 2. In Unit 1, your code ran straight down the page — every line, once, in order. That is fine, but real programs need to make decisions and to repeat work. Today we add exactly two powers: choosing which code to run, and repeating code. These two small ideas are enough to build almost anything.

## Slide 002: So Far, Code Just Marched (id: s02)
Narration: Think about how your programs have run so far — like a soldier marching in a straight line, doing each step once. We are about to give the program two choices it never had. First, choose: run this block, or that one, depending on a test. Second, repeat: do a block again and again. That is the whole unit — everything else is detail.

## Slide 003: Booleans: Yes/No Data (id: s03)
Narration: Before a program can choose, it needs a yes-or-no fact to choose on. That is a boolean. When you compare two things, Python answers with a bool: either True or False, nothing in between. Watch the double equals — that asks "are these equal?", while a single equals stores a value. The exclamation-equals means "not equal." A bool is the simplest data there is: one bit, yes or no.

## Slide 004: Combining Tests: and / or / not (id: s04)
Narration: Often one test is not enough, so we combine them with three words that read like English. "and" is picky — it is only True when both sides are True. "or" is easy-going — True if either side is True. And "not" simply flips a value. Predict each of the three results here, then run it. Notice every one of them hands you back another bool.

## Slide 005: if / else: One Decision (id: s05)
Narration: Here is our first real choice. If the condition after "if" is True, Python runs the indented block under it; otherwise it runs the block under "else." Exactly one of them runs, never both. Predict what this prints when temp is 30, then change it to 10 and predict again. And notice that last line — it is not indented, so it always runs. The indentation is not decoration; it is how Python knows what belongs to the choice.

## Slide 006: if / elif / else: First True Wins (id: s06)
Narration: When there are more than two paths, we chain them with "elif," short for "else if." Python checks each condition top to bottom and jumps into the very first one that is True — then skips everything below it. Trace a score of 82: ninety fails, eighty passes, so it prints B and stops, even though seventy would also pass. That is why order matters. What would a score of 95 print?

## Slide 007: The while Loop (id: s07)
Narration: Now repetition. A while loop keeps running its block as long as its condition stays True. A counting while has three parts: a start value before the loop, the condition, and an update inside the loop. That update is the one everyone forgets — and if you forget it, the condition never turns False and the loop runs forever. If that happens, press Control-C to stop it. Watch how n changes each pass; that changing value is what finally ends the loop.

## Slide 008: The for Loop + range() (id: s08)
Narration: A for loop is the friendlier way to repeat a known number of times, because it counts for you — no start or update to forget. The range function makes the numbers. Careful with the edge: range of 3 gives 0, 1, 2 — it stops just before the number you name. With two arguments you set start and stop; with three, the last one is the step size. Predict range 2 to 6, and range 0 to 10 stepping by 2, before you run them.

## Slide 009: Early Exit: break & continue (id: s09)
Narration: Sometimes you want to leave a loop early. "break" quits the loop immediately — here it stops the moment n hits 5, so we only see 0 through 4. "continue" is gentler: it skips the rest of just this one pass and jumps to the next round. In the second loop, when n is even we continue, so only the odd numbers print. Trace both and predict the numbers before revealing.

## Slide 010: Worked Example: Add 1 to n (id: s10)
Narration: Let's put choosing and repeating to work by adding up 1 through n. We start total at zero — an empty running sum. Then the for loop walks k from 1 up to n, and each pass we add k into total. Trace it in a little table: after each pass, what is k and what is total? You will see 1, then 3, then 6, then 10, then 15. The loop is keeping state — a value that changes as it runs — which is the heart of every loop.

## Slide 011: Quick Check (id: s11)
Narration: Quick check. Which of these four expressions is True? Read each one aloud in plain English. The answer is the third: five equals five OR one is greater than nine. That is True-or-False, and "or" only needs one side, so it is True. The first is "not True," which is False; the second is True-and-False, which is False; and the last is False because "a" comes before "b."

## Slide 012: Recap & Next (id: s12)
Narration: To recap: a bool is yes-or-no data, and comparisons plus and, or, not produce it. You choose with if, elif, else — the first true branch wins, and indentation marks each block. You repeat with while, which needs a start and an update, and with for, which uses range; break and continue steer the loop. Next unit we look at strings and clever loops — walking through text one symbol at a time. Try the Unit 2 exercises first.
