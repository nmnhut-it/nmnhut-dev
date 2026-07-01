# Unit 7 — Testing &amp; Debugging · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Testing & Debugging (id: s01)
Narration: Welcome to Unit 7. You can now write real programs — functions, lists, dictionaries, the works. This unit adds a professional skill: proving your code actually does what you claim, and tracking down the reason when it doesn't. Every real programmer spends more time testing and debugging than writing new code, so this is time well spent.

## Slide 002: "It runs" is not "it works" (id: s02)
Narration: Here's a trap. Your code runs, no red error appears, and you assume it's correct. But running and being right are two different things. So how do we check? We test. And testing is just one simple move: compare the expected answer — what you say should happen — with the actual answer — what the program really does. Same as always: turn a fuzzy question into two values you can line up.

## Slide 003: What a Test Really Is (id: s03)
Narration: A test has four little steps. Pick an input. Say out loud, or in a comment, what answer you expect. Run it. Then compare. Notice the order: you decide the expected answer before you run, otherwise you'll just nod along with whatever the screen shows. If double of five prints ten, great. If it prints seven, you've found a bug — and now the hunt begins.

## Slide 004: Three Kinds of Test Cases (id: s04)
Narration: One test is never enough, because bugs hide in the corners. So try three kinds. A normal case — an everyday input. A boundary case — the smallest or most extreme input, like a list with a single item. And an edge case — the weird one, like an empty list. Averaging an empty list means dividing by zero. Always ask yourself: what's the emptiest, biggest, or strangest input I could throw at this?

## Slide 005: A Buggy Discount Calculator (id: s05)
Narration: Let's catch a real bug. This function takes a price and a discount percent and tries to give the final price. We test it with one hundred and twenty percent off, and it prints eighty. Looks perfect! But that passed by luck. Now try fifty dollars, twenty percent off. You expect forty. The code gives thirty, because it subtracts twenty as if it were dollars, not a percent. One extra test exposed a bug the first test happily hid.

## Slide 006: Step 1 of Debugging: Read the Error (id: s06)
Narration: When Python does crash, don't panic at the red text — read it. This block of text is called a traceback, and it's a free clue. It tells you the file, the exact line, and the kind of error. Read it from the bottom up: the last line names the error — here, IndexError, list index out of range — and the line above points right at the code that broke. The computer is telling you where to look.

## Slide 007: A Few Errors You'll Meet (id: s07)
Narration: You don't need to memorize a giant list, just recognize a handful. IndexError: you asked for a list spot that doesn't exist. KeyError: a missing dictionary key. TypeError: mixing types that don't mix, like text plus a number. ValueError: the right type but a nonsense value, like turning the word "twelve" into an int. And ZeroDivisionError. The sneakiest problem, though, gives no error at all — a logic bug that runs fine and quietly returns the wrong answer.

## Slide 008: Step 2: Shrink It and Print (id: s08)
Narration: For a logic bug with no message, become a detective. First, shrink the problem to the smallest example that still breaks — less code, fewer distractions. Then check a value in the middle of your code by printing it. If it's right there, the bug is later; if it's already wrong, the bug is earlier. Each check cuts the search in half. print is your flashlight: it shows what the machine truly holds, not what you assumed it holds.

## Slide 009: try / except: Catch a Crash (id: s09)
Narration: Sometimes you know a line might blow up — especially when a human is typing input. Wrap the risky lines in a try block. If they raise an error, Python jumps down to the matching except block instead of crashing the whole program. Here, if someone enters zero people we catch the divide-by-zero, and if they type "banana" we catch the value error. A scary traceback becomes a friendly, helpful message.

## Slide 010: assert: A Sanity Check (id: s10)
Narration: An assert is a quick sanity check you write into your own code. It says "this had better be true." Here we assert the score list isn't empty before averaging. If that's false, the program stops right there with a clear message — before the bad value sneaks deeper and causes a confusing crash somewhere else. Rule of thumb: use try and except for messy data coming from outside, and use assert to guard your own assumptions inside.

## Slide 011: Quick Check (id: s11)
Narration: Quick check. Which error does Python raise for the list one, two, three, indexed at position five? Take a second. The answer is IndexError — the list only has spots zero, one, and two, so five is out of range. KeyError is the dictionary cousin, for a missing key. Whenever you reach past the end of a list, expect an IndexError.

## Slide 012: Recap & Next (id: s12)
Narration: To recap: testing means comparing expected against actual, using normal, boundary, and edge cases. Debug like a detective — read the traceback, shrink the example, and print to see the real values. Use try and except to catch crashes, and assert to guard your assumptions. Next unit we meet objects, where data and behavior get bundled together. First, go fix that discount calculator in the Unit 7 exercises.
