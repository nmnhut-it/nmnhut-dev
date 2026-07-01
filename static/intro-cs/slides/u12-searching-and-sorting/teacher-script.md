# Unit 12 — Searching & Sorting · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Searching & Sorting (id: s01)
Narration: Welcome to the last unit. It ties everything together. All year we turned problems into data, wrote exact rules over that data, and asked how fast those rules run. Today's problem is one you use constantly: finding a thing in a list. And we'll discover a neat twist — putting the list in order first is the secret to searching fast.

## Slide 002: The Problem: Find It in a List (id: s02)
Narration: Here's the setup. You have a list and a target, and you want to know: is it in there, and where? Your phone does this every time you look up a contact, a song, or a message. To keep it concrete, we'll search for a number inside a list of numbers. Simple problem, but the way you solve it matters a lot.

## Slide 003: Linear Search — Check One by One (id: s03)
Narration: The obvious way is linear search. Just walk down the list, checking each spot: is this the target? The moment you find it, return where it is. If you reach the end without a match, it isn't there. This works on any list — sorted or a total jumble. But in the worst case, when the item is missing, you check every single element. That's O(n).

## Slide 004: A Smarter Way: The Phone-Book Trick (id: s04)
Narration: There's a smarter way. Imagine looking up "Nguyen" in a thick paper phone book. You don't start at page one. You flip to the middle, see whether you've gone too far or not far enough, and throw away half the book. Then you repeat on what's left. Each look cuts the problem in half. But notice — this only works because the phone book is already in alphabetical order.

## Slide 005: Binary Search — Only on a Sorted List (id: s05)
Narration: That trick has a name: binary search. We track two ends, lo and hi. We check the middle. If it's the target, done. If the middle is too small, keep the upper half; if it's too big, keep the lower half. Each step throws away half the list. The one rule you cannot break: the list must be sorted. Hand binary search a jumbled list and its left-or-right guesses are meaningless — it returns garbage.

## Slide 006: Why It's So Fast: O(log n) (id: s06)
Narration: Why is this so fast? A list of a thousand items shrinks: a thousand, five hundred, two-fifty, and so on down to one — in only about ten steps. That repeated halving is exactly what O(log n) means. Compare: linear search might check all thousand; binary search checks about ten. And if the list grows to a million, binary search needs only about twenty steps. That's an enormous win.

## Slide 007: Order Is a Representation Choice (id: s07)
Narration: Here's the big insight of the unit. On an unsorted list, only linear search works — O(n). But if the list is sorted, binary search is unlocked — O(log n). Same numbers, same data. The only difference is that you chose to keep them in order. Order is a representation choice, and it directly buys you speed. So the natural next question is: how do we actually sort a list?

## Slide 008: Sorting: Put the List in Order (id: s08)
Narration: Let's sort. One of the easiest methods is selection sort. The idea is: find the smallest value that isn't sorted yet, swap it to the front of the unsorted part, and repeat with the rest. It's like picking players shortest-first and lining them up one at a time. A sorted section grows on the left while the messy part shrinks on the right.

## Slide 009: Trace It: Sort [5, 2, 8, 1] (id: s09)
Narration: Let's trace it on a real list: five, two, eight, one. The smallest is one, so swap it to the front. Now the smallest of what's left is two — it's already in place. Next, the smallest of the rest is five, so swap it with eight. Now everything's in order: one, two, five, eight. Your turn — trace the list three, one, two the same way and write down each step.

## Slide 010: How Long Does Sorting Take? (id: s10)
Narration: Here's selection sort in code. We copy the list so we don't wreck the original, then for each position we scan the rest to find the smallest and swap it in. Notice the loop inside a loop — that's the giveaway. Roughly n times n steps, so O(n-squared). That's slower than searching. But here's the thing: you only have to sort once.

## Slide 011: The Big Idea: Sort Once, Search Many (id: s11)
Narration: And that's the payoff. If you only ever search once, sorting isn't worth it — the sort costs more than a single linear scan. But if you search again and again, you sort one time and then every lookup is a cheap O(log n). Think of your contacts app: it keeps your names sorted once, then answers thousands of lightning-fast searches. The sort pays for itself many times over.

## Slide 012: One More Trick: Merge Sort (optional) (id: s12)
Narration: One optional bonus. For really big lists there's a faster sort called merge sort, built on divide and conquer: split the list in half, sort each half, then merge the two sorted halves back together. It reaches O(n log n), which beats O(n-squared) by a lot when lists get large. Don't worry about the details now — just know that clever structure beats brute force yet again.

## Slide 013: Quick Check (id: s13)
Narration: Quick check. You run binary search on the list five, two, nine, one, seven, looking for nine. What's the problem? Take a second. The answer: the list isn't sorted, so the result can't be trusted. Binary search's go-left, go-right decisions are only valid on a sorted list — otherwise it may hand you a wrong position or say not found. That precondition is the heart of this whole unit.

## Slide 014: Recap & The Whole Course (id: s14)
Narration: To recap: linear search checks one by one, O(n), and works on any list. Binary search halves each time, O(log n), but needs a sorted list. And sorting, like selection sort, puts the list in order so fast search becomes possible. Here's the whole course in one line: turn a problem into data, write exact rules over it, and care how fast those rules run. Representation, rules, efficiency. You can do all three now. Well done.
