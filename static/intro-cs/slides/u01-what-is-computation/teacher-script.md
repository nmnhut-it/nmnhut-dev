# Unit 1 — What is Computation? · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Hook-first: learners run real Python on the slides before we
define anything. Friendly, ~20–35 seconds per block.

## Slide 001: What is Computation? (id: s01)
Narration: Forget slides for a second. In the next two minutes you're going to write and run real Python — right here in the browser, nothing to install. That's the deal in this unit: you do it first, we explain after. Let's go.

## Slide 002: Predict, then Run (id: s02)
Narration: Before you press Run, guess what each line prints. Really guess — say it out loud. First line glues two sevens as text. Second adds two sevens as numbers. Third repeats "ha" twenty times. Now press Run. The first time takes a few seconds while Python loads. Did the answers match your guesses?

## Slide 003: Why Two Answers? (id: s03)
Narration: Here's the surprise. "Seven" in quotes is text — the machine just sees a symbol, so plus glues it into seventy-seven. Seven with no quotes is a number, so plus adds it to fourteen. Same key on your keyboard, two totally different kinds of data. Choosing how to store something as data is the whole game of this course.

## Slide 004: Make It Talk to You (id: s04)
Narration: Now make the computer talk to you. Run this — a box pops up asking your name, type it in. The machine greets you by name, then prints it three times. That word "name" is a variable: a box holding the text you typed. Try it — then change the message, or make it print your name a hundred times.

## Slide 005: The One Big Rule (id: s05)
Narration: You've now run several programs, so here's the one big rule. A computer does exactly what you tell it — no more, no less. It's fast, but it is not smart, and it cannot guess what you meant. So when the output is wrong, it's the instructions that were wrong, not you. Finding and fixing that is the normal, everyday job of programming.

## Slide 006: Draw With a Loop (id: s06)
Narration: Let's make a picture. Run this and a little triangle of stars appears. Now change the star to a fire emoji, and change the six to eleven, and run again. Watch the shape grow. That "for" line is a loop — it repeats. You'll learn loops properly in Unit 2; for now, just tinker and watch what changes.

## Slide 007: Numbers Are Data (id: s07)
Narration: Python does math with the operators you'd expect, plus a couple of handy ones. A single slash always gives a decimal — so seven divided by two is three point five. Double slash keeps just the whole part. Percent gives the remainder — that one matters a lot later. Double star is power. Predict each one, then run, then change the numbers and run again.

## Slide 008: Names for Values (id: s08)
Narration: The equals sign stores a value under a name so you can reuse it. Here we store a price and a quantity, then compute a total from them. Change the price or the quantity and run again — the total updates because you recomputed it. Think of a variable as a labeled box in memory, and remember: equals means "store this," not math equality.

## Slide 009: It Only Does What You Say (id: s09)
Narration: Watch this closely. We compute an area from the radius. Then we change the radius. What happens to the area? Run it. Nothing — the area keeps its old value, because we only told the computer to compute it once. It never goes back and re-figures things for you. This one idea prevents a huge amount of beginner confusion.

## Slide 010: Types, and Switching Between Them (id: s10)
Narration: Every value has a type, and the type decides what you can do with it — int for whole numbers, float for decimals, str for text. You can convert between them. One trap to remember: turning a decimal into an int chops off the fraction — three point nine becomes three, it does not round up. Run it and see.

## Slide 011: Everything Is Data (id: s11)
Narration: Step back. In Unit 0, a triangle was a grid of zeros and ones. A number is just the simplest representation. All year long we keep asking one question: how is this thing stored as data? Numbers today; text, lists, and key-value maps are coming.

## Slide 012: A Game You Own (id: s12)
Narration: Here's a whole game in about twelve lines. Run it and play — it picks a secret number and tells you higher or lower. Once you've won, change one thing: make it one to a hundred, or give yourself fewer tries, or make it tease you on a wrong guess. You didn't write it yet, but you can already bend it to your will — and it quietly uses everything from this unit.

## Slide 013: Quick Check (id: s13)
Narration: Quick check. What does nine divided by two give in Python? Take a second. It's four point five — a float — because a single slash always makes a decimal, even when the numbers divide evenly. For whole-number division you'd use the double slash.

## Slide 014: You Already Did It (id: s14)
Narration: Look what you just did: you ran real Python — you printed, did math, used a variable, and played a game you modified. You saw that a computer only does what you tell it, and that every value has a type. And you met the question we'll ask all year: how is this stored as data? Next unit, we hand you the controls for choices and repetition. Try the exercises first.
