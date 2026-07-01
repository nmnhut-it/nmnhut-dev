# Unit 5 — Lists &amp; Tuples · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Lists & Tuples (id: s01)
Narration: Welcome to Unit 5. Until now a variable held one value — one number, one word. But real problems come in bunches: a class of test scores, a playlist, a shopping list. Today we meet collections. A list holds many values in order, under a single name. We'll also meet its locked-down cousin, the tuple — and one sneaky bug that catches almost everyone the first time.

## Slide 002: One Name, Many Values (id: s02)
Narration: Here's a list: four scores in square brackets, all under one name. Instead of juggling s1, s2, s3, s4, you keep them together in "scores". A list is an ordered collection — many values in a row. Ordered means position matters: there's a first, a second, a third. This is our representation move for the unit: a bunch of related values is itself data you can hold.

## Slide 003: Reach In by Position (id: s03)
Narration: To grab one item, use its index — its position — in square brackets. And here's the classic surprise: counting starts at zero. So pets at 0 is "cat", the first item. Pets at 2 is "fish". A negative index counts from the back, so minus one is the last item. And len tells you how many items are in the list. Predict pets at 1 before you run it.

## Slide 004: Loop Over Every Item (id: s04)
Narration: The real power of a collection is the loop. A for loop walks through the list, and the variable s becomes each item in turn — 88, then 72, then 95 — no counting, no index needed. Here we add them into total. Trace it in your head: total starts at zero and grows each pass, ending at 255. One loop handles three items or three thousand.

## Slide 005: Growing a List: append (id: s05)
Narration: Lists can grow. Dot-append adds an item to the end. Notice something important: it changes the list you already have — it does not hand you a new one. Being changeable in place like this is called being mutable. So after appending "Cy", the same guests list is now longer, with length three. Hold on to this "changes in place" idea — it comes back soon.

## Slide 006: Sorting: Two Ways (id: s06)
Narration: There are two ways to sort, and mixing them up is a top beginner bug. Dot-sort reorders the list in place and gives back nothing — the special value None. The function sorted, on the other hand, returns a brand-new sorted list and leaves your original untouched. So watch the trap: writing nums equals nums-dot-sort sets nums to None, because sort returns nothing. Use sorted when you want to keep the original too.

## Slide 007: Tuples: Locked Lists (id: s07)
Narration: A tuple is like a list but locked. You write it with round brackets. Indexing works exactly the same — point at 0 is 4. But try to change an item and Python refuses with an error: tuples cannot be changed. We call that immutable. Use a tuple for things that belong together and shouldn't move — like the x and y of a point. One quirk: a one-item tuple needs a comma inside.

## Slide 008: Unpacking & Returning Two Values (id: s08)
Narration: Tuples have a neat trick called unpacking: x, y equals the pair spreads it across two names at once. That even gives you a one-line swap — a, b equals b, a — no temporary variable. And the everyday reason tuples exist: a function returns just one thing, but that thing can be a tuple. So min_max returns min and max together, and the caller unpacks them into low and high. Two values back at once.

## Slide 009: The Empty-List Edge Case (id: s09)
Narration: Always ask: what if the list is empty? An empty list is a real, common case — a search that finds nothing, input that hasn't arrived. Its length is zero. Reaching for position 0 crashes with an IndexError, because there's nothing there. But looping over it is perfectly safe — the loop body just runs zero times. Checking for empty before you index is a habit that prevents a lot of crashes.

## Slide 010: Aliasing: Two Names, One List (id: s10)
Narration: Now the sneaky one. You'd think b equals a makes a copy. It does not. Both names point at the exact same list. So when we append "blue" through b, printing a shows the change too — both are now three items. It's like giving one person two nicknames: change something and every name sees it. Assignment copies the pointer to the list, not the contents. This surprises everyone once.

## Slide 011: Cloning: Make a Real Copy (id: s11)
Narration: So how do you get a genuine copy? Clone it. a with square-bracket-colon builds a brand-new list with the same items; list-of-a does the same thing. Look at the only change from the last slide: b equals a, colon. Now they're two separate lists. Appending "blue" to b leaves a untouched. Alias when you want them linked, clone when you want them independent.

## Slide 012: Gotcha: Passing a List to a Function (id: s12)
Narration: Here's that same aliasing rule biting inside a function. When you pass a list in, the parameter is just another name for your list — an alias. So add_zero appending to items actually changes the caller's list, and my_list ends with a surprise zero. The fix is the same as before: clone at the top with items equals items-colon, work on the copy, and return it. Now the caller's data is safe.

## Slide 013: Quick Check (id: s13)
Narration: Quick check. We set warm to three colors, then hot equals warm, then append "pink" through hot. What are warm and hot now? The answer is the second option: both are the four-item list ending in "pink". Because hot equals warm aliases — there's only one list, changed through hot and seen through warm. If you wanted a copy, you'd write warm with square-bracket-colon.

## Slide 014: Recap & Next (id: s14)
Narration: To recap: a list in square brackets is an ordered collection you can index, measure with len, loop over, and append to. Dot-sort changes it in place and returns None; sorted gives you a new list. A tuple in round brackets is fixed — perfect for pairs and returning two values. And remember: b equals a shares one list, while b equals a-colon makes a real copy — and passing a list to a function shares it too. Next unit: dictionaries, where you look things up by a key you choose instead of by position.
