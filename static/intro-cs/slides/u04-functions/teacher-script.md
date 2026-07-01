# Unit 4 — Functions · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Functions (id: s01)
Narration: Welcome to Unit 4. So far you've written code line by line, from top to bottom. Today we learn to bundle a useful chunk of code, give it a name, and reuse it whenever we want. That bundle is called a function. The whole idea in one line: a function names a rule — data goes in, a value comes out.

## Slide 002: Why Bother With Functions? (id: s02)
Narration: Imagine you check "is this number even?" in three different spots. If you copy-paste that code three times, then every time you fix a bug you have to fix it in three places, and you'll miss one. Instead, write it once, give it a name, and reuse it. Fix the one copy and it's fixed everywhere. A good program is measured by what it does, not by how many lines you typed.

## Slide 003: A Function Is a Black Box (id: s03)
Narration: Here's the mental picture. Think of a microwave. You press a button, food comes out hot — and you never needed to know how the wiring works inside. A function is exactly that kind of box. You feed it an input and take the output, trusting it to do its job, without re-reading the details every time. Data in, value out.

## Slide 004: Your First Function (id: s04)
Narration: Let's write one. The word def tells Python "a definition is coming." The indented lines underneath belong to the function — that's its body. But notice: defining a function does not run it. Nothing happens until you call it, by writing its name followed by empty parentheses. Predict what greet does, then run it.

## Slide 005: Give It an Input (id: s05)
Narration: Functions get powerful when you feed them inputs. The name in the def line — here, name — is a parameter. Think of it as an empty slot. When you call greet with "Mai", that slot gets filled with "Mai." Call it again with "Tan," and now the slot holds "Tan." Same function, different input, different result. That's reuse.

## Slide 006: return: Hand a Value Back (id: s06)
Narration: Most functions don't just print — they compute an answer and hand it back. That's what return does. When you write double of 5, the call gets replaced by its answer, 10. So you can store that 10 in a variable, print it, or keep doing math with it, like adding one to get 11. Return ships one value out of the box.

## Slide 007: return vs print — the None Trap (id: s07)
Narration: Here's the trap that catches everyone once. print only shows a value on the screen. return actually gives the value back so the rest of your program can use it. Look: double_return hands back 10, so a becomes 10. But double_print only shows 10 — it hands nothing back, so b becomes None. None is Python's word for "no value." If you ever see None leak out, you probably printed inside when you meant to return.

## Slide 008: A Real One: is_even (id: s08)
Narration: Let's build a real, useful function. is_even takes a number and returns True when it's even, using the remainder trick from Unit 1: a number is even when it divides by two with no remainder. The text in triple quotes at the top is a docstring — a short note saying what goes in and what comes out. Once it's written, anyone can use is_even without ever reading the inside.

## Slide 009: Names Inside Stay Inside (id: s09)
Narration: One more thing to know. A name you create inside a function — here, tax — is local. It lives only while the function runs, then it disappears. Try to use tax outside and Python says it doesn't exist. That's actually a good thing: a function keeps its private names to itself, so it can't accidentally mess up the rest of your code. Only the returned value comes out.

## Slide 010: Predict, Then Run (id: s10)
Narration: Your turn to trace. area_of_square returns side times side. We call it twice — once with 3, once with 10. Before you run it, predict: what does side become in each call, and what are small and big? Then run it and check. Notice each call is its own separate run, with its own value for side.

## Slide 011: Bonus: A Function Can Take a Function (id: s11)
Narration: Here's a fun bonus. In Python, a function is just another kind of value — so you can hand one function to another function. do_twice takes an action and runs it two times. Pass it wave, and it waves twice. You'll use this idea more later; for now, just enjoy that it works. If we're short on time, don't worry about this one.

## Slide 012: Quick Check (id: s12)
Narration: Quick check. Inside f, we write x equals x plus one. But that only changes f's private, local x to 4. The moment f finishes, that local x vanishes. The outside x was never touched, so it's still 3. z did become 4, but we printed x — so the answer is 3. This is the local-names idea in action.

## Slide 013: Recap & Next (id: s13)
Narration: To recap: a function names a rule so you can reuse it — data in, value out. You define it with def, and you run it by calling it with parentheses. return hands a value back; print only shows it, and forgetting return leaks None. And names made inside a function are local and private. Next unit: lists and tuples — ways to store whole collections of data, not just one value at a time. Try the Unit 4 exercises first.
