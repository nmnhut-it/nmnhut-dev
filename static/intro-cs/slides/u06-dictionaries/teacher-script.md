# Unit 6 — Dictionaries (+ gentle recursion) · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Dictionaries (id: s01)
Narration: Welcome to Unit 6. So far, lists have let us look things up by position — item zero, item one, item two. Today we meet a new kind of collection, the dictionary, that lets us look things up by a name we choose instead. Then, near the end, we'll take a gentle first look at recursion — a function that calls itself.

## Slide 002: The Problem: Two Lists That Must Stay in Sync (id: s02)
Narration: Say we want to store students and their grades. With lists, we'd keep two of them — one of names, one of grades — glued together only because the positions line up. To find John's grade we first hunt for where John is, then peek at the matching spot in grades. That's clumsy, and if the two lists ever slip out of sync, everything breaks. There's a better tool.

## Slide 003: A Dictionary: Key to Value (id: s03)
Narration: Here it is. Curly braces, and inside, pairs: a key, a colon, then its value. Ana maps to B, John maps to A-plus. The key is the label we look things up by. This is the big idea of the whole unit: a dictionary maps keys to values. We look things up by name, not by position.

## Slide 004: Lookup by Name (id: s04)
Narration: To get a value, put its key in square brackets — same brackets as a list, but now the thing inside is a name, not a number. grades of John gives A-plus. Predict what grades of Sam gives before you run it. Notice there's no searching or index juggling — the dictionary jumps straight to the value.

## Slide 005: Add and Update (id: s05)
Narration: One line does two jobs. Assign to a brand-new key, like Sam, and it adds a new entry. Assign to a key that's already there, like Ana, and it replaces the old value. There's only ever one value per key — writing Ana again doesn't make a second Ana, it updates her.

## Slide 006: Gotcha: a Missing Key (id: s06)
Narration: Here's the classic surprise. If you ask for a key that was never added — grades of Bob — Python doesn't quietly give you nothing. It crashes with a KeyError. To stay safe, check first with the word "in", which gives True or False, or use dot-get, which hands back None instead of crashing when the key is missing.

## Slide 007: Looking Through a Dictionary (id: s07)
Narration: You can loop over a dictionary. When you do, you get its keys, one at a time — not the values. So we loop over each name, then use that name to fetch its grade. If you want just one side directly, dot-keys gives the keys and dot-values gives the values.

## Slide 008: List or Dictionary? (id: s08)
Narration: So when do you use each? Use a list when order matters and you want a plain sequence — first, second, third. Use a dictionary when you look things up by a label: a name to a grade, a word to a count. Storing each student's grade and finding it by name is a dictionary — the key is the name, and there's no index bookkeeping at all.

## Slide 009: Example: Count the Words (id: s09)
Narration: Here's the classic dictionary example: counting words. Start with an empty dictionary. Split the text into words and walk through them. If we've seen the word before, add one to its count. If it's the first time, start it at one. The dictionary works like a tally sheet — the key is the word, the value is how many times we've seen it. Trace it word by word and watch red climb to three.

## Slide 010: A New Idea: a Function That Calls Itself (id: s10)
Narration: Now something new. A function is allowed to call itself — that's recursion. This countdown prints n, then calls itself with n minus one, smaller each time, until n hits zero and we print Liftoff. Every recursion needs two things: a base case that says when to stop, and a recursive case that shrinks the input toward that stop. Leave out the base case and it never ends — like two mirrors facing each other.

## Slide 011: Tiny Example: Factorial (id: s11)
Narration: One more tiny example: factorial. Four factorial is four times three factorial, which is three times two factorial, and so on. The base case is n equals one, which returns one. So fact of four shrinks down four, three, two, one, hits the base case, then multiplies all the answers back up to twenty-four. Notice how the code mirrors the math almost exactly.

## Slide 012: Quick Check (id: s12)
Narration: Quick check. You run grades of Bob, but Bob was never added. What happens? Take a second. The answer is a KeyError — it crashes. Plain square-bracket lookup on a missing key does not return None and does not add anything. Check with "in" first, or use dot-get to get None safely.

## Slide 013: Recap & Next (id: s13)
Narration: To recap: a dictionary maps keys to values, so you look up by name instead of position. You add or update with bracket-key equals value, and a missing key raises a KeyError. Looping a dictionary gives its keys, and word-counting is the classic use. And recursion needs a base case to stop plus a recursive case that shrinks the input. Next unit: testing and debugging — comparing what you expected with what actually happened. Try the Unit 6 exercises first.
