# Unit 3 — Strings & Clever Loops · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Strings & Clever Loops (id: s01)
Narration: Welcome to Unit 3. So far we've worked with numbers and made programs choose and repeat. Now we point loops at text. Here's the big idea to hold onto: to a computer, a word is just a row of symbols in order. It checks the symbols, never the meaning. Then we'll learn a genuinely clever trick for searching fast — cutting the range in half.

## Slide 002: Text Is a Sequence of Symbols (id: s02)
Narration: When you read "cat," you picture a fuzzy animal. The computer sees something much plainer: the character 'c', then 'a', then 't', in that exact order. That's all a string is — symbols in a row. The machine can compare those symbols, but it has no idea what the word means. Keep that picture in mind for the whole unit.

## Slide 003: How Long Is It? len() (id: s03)
Narration: Our first tool is len. A string lives inside quotation marks, and len counts how many characters are inside. Careful — spaces count too, so "hi you" has a length of six, not five. And the empty string, just two quotes with nothing between, has a length of zero. len gives back a value, so you can print it or store it.

## Slide 004: Reach One Character — Indexing (id: s04)
Narration: To grab a single character, put its position in square brackets. The catch that trips everyone: counting starts at zero. So s at zero is 'P', not 'Y'. Predict s at two before you run it — it's 'T'. Negative numbers count from the other end, so minus one is the last character. Reach past the end and Python simply tells you: IndexError.

## Slide 005: Grab a Piece — Slicing s[a:b] (id: s05)
Narration: To grab a whole chunk, use a slice: s from a to b. The important rule is that the stop is not included. So s from two to five gives c, d, e — and stops before f. Leave the start blank and Python begins at zero; leave the stop blank and it runs to the end. When you're unsure, just type it in and look at what comes back.

## Slide 006: Glue Strings Together — + (id: s06)
Narration: The plus sign joins two strings into a new one. Watch the classic mistake: if you forget the space in the middle, you get "AdaLovelace" squished together. So we add a little " " string between them. And the star repeats a string — "ha" times three gives "hahaha." Notice plus adds numbers but joins strings; the type decides what the symbol does.

## Slide 007: Walk Through Each Character (id: s07)
Narration: Because a string is a sequence, a for loop can walk right through it. Each time around, char becomes the next character — b, then a, then n, and so on. Here we count the a's in "banana." Trace it in your head: what is char on each pass, and what does count end up as? Three. This "for char in s" reads almost like plain English.

## Slide 008: Strings Can't Be Edited — Immutable (id: s08)
Narration: Here's a surprise. You cannot change one character of a string in place — trying s at zero equals "y" is an error. Strings are what we call immutable, meaning frozen. To "change" one, you build a brand-new string — "y" plus the rest of s — and give it the same name. The old "hello" isn't edited; it's just left behind.

## Slide 009: A Slow Way to Search: Guess & Check (id: s09)
Narration: Now, searching. Suppose we want the cube root of eight. The simplest plan: try zero, one, two, and so on, in order, until one fits. Two cubed is eight, so we stop at two. This always works and it's easy to understand. But if the answer were huge, we'd crawl through a mountain of numbers one at a time. Surely we can be cleverer.

## Slide 010: A Clever Way: Halve the Range (id: s10)
Narration: You already know the clever way — it's the guessing game. I think of a number from one to a hundred; you guess, I say higher or lower. The smart move is always to guess the middle, because each answer throws away half the numbers still left. A hundred possibilities shrink to one in about seven guesses. That halving trick is called bisection.

## Slide 011: Bisection in Code (id: s11)
Narration: Here's that game as code. We keep two markers, low and high, that bracket the answer, and we test the middle. If our guess is too low, we raise the floor; too high, we lower the ceiling; then we compute a new middle. Don't stress about the exact lines — the point is the strategy: halving the range beats crawling through it, especially when the range is big.

## Slide 012: Quick Check (id: s12)
Narration: Quick check. With s equal to "abcdefgh", what is s from three to six? Take a second. The answer is "def" — indices three, four, and five — because the stop is not included, so we stop before index six and never reach g. Slicing always goes up to, but not including, the stop.

## Slide 013: Recap & Next (id: s13)
Narration: To recap: a string is a sequence of symbols. You can measure it with len, reach one character with an index starting at zero, grab a piece with a slice, join with plus, and walk it with a for loop. Strings are immutable — you build new ones rather than editing. And bisection halves the range to search fast. Next unit: functions — naming a rule once so you can reuse it.
