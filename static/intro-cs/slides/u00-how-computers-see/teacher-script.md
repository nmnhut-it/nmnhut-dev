# Unit 0 — How Computers See · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: How Computers See (id: s01)
Narration: Welcome to Unit 0 — this is where the whole course starts. Here's the big idea: a machine sees the world as data, and it does that very differently from you. Before we write a single line of Python, I want you to feel that difference. Turn a problem into data the machine can hold, then write exact rules over it. That's the game we'll play all year.

## Slide 002: You Just Knew (id: s02)
Narration: Look at this shape. Triangle, right? You knew it instantly — you didn't measure anything, you just saw it. Now try to explain how you knew. It's weirdly hard, because your brain did it for free. Here's the catch: a machine can't do that. So what does the machine actually get handed instead of the word "triangle"? That empty middle box is our whole job.

## Slide 003: The Machine Gets No "Triangle" (id: s03)
Narration: A machine has no eyes and no idea what a shape even is. When a camera takes a picture, it doesn't send over "triangle." Light bounces off the shape, the camera chops the scene into tiny squares, and each square reports a single number: one if there's shape there, zero if it's background. So "see" is really the wrong word. The machine measures. That's all it ever gets.

## Slide 004: A Picture Is a Grid of 0s and 1s (id: s04)
Narration: Here's the same triangle the way the machine holds it — a grid of zeros and ones. One means shape, zero means background. Read it row by row and you can find the triangle with your eyes. But notice: nowhere in this grid does it say "triangle." It's just numbers. And look at that slanted edge — it's already turning into a little staircase of ones. Remember that.

## Slide 005: Our Job: Turn Seeing Into a Rule (id: s05)
Narration: Our job is to turn "I can just tell" into an exact rule the machine can run on that grid. We only allow two answers, triangle or rectangle, so we use the thing that separates them: corners. A triangle has three, a rectangle has four. So the plan is simple to say — find every corner, then count them. But "count the corners" is still a human sentence. Next we have to make "corner" something a machine can check.

## Slide 006: What Is a Corner, to the Machine? (id: s06)
Narration: You'd just point at a corner. The machine can't point — it can only look at one cell and its neighbours. So we spell it out exactly: a corner is a filled cell that has empty space on two sides that meet at a right angle, an L-shape of emptiness. Look at the red cell: empty above, empty to the left — two perpendicular sides. That makes it a corner. We just turned a fuzzy word into a precise rule.

## Slide 007: Run the Rule: Rectangle (id: s07)
Narration: Let's run our rule on a rectangle. Check each filled cell. A cell in the middle of an edge is only empty on one side, so it fails. But the four cells at the corners are each empty on two perpendicular sides — they pass. Count them: four. Four corners means rectangle. The machine got it exactly right, using nothing but our little rule. That feels great — so let's try the triangle.

## Slide 008: Same Rule, Now the Triangle (id: s08)
Narration: Same rule, no changes, now on the triangle. The three real corners pass, in red — good. But watch the slanted edge. It's a staircase of ones, and every single step is a filled cell with empty space above and to the side — two perpendicular directions. So by our own definition, each step is a corner too. The rule honestly counts six. Six corners? Now the machine isn't sure what shape this is.

## Slide 009: Quick Check (id: s09)
Narration: Quick check — why did the machine count six corners on the triangle? Take a second and think about what we actually saw. It's not a bug, and the camera wasn't blurry. The answer is the third one: the slanted edge is a staircase, and every stair-step passes our corner test fairly. The rule did exactly what we told it. Our model was just too simple.

## Slide 010: That Gap Is the Whole Point (id: s10)
Narration: This gap is the entire reason this course exists. You see a smooth slanted line. The machine sees stairs, and every stair-step looks like a tiny corner. Same picture, totally different perception. Nobody's at fault — the rule was honest, the machine did its job, our model was just naive. The machine doesn't see what you see, and closing that gap, turning what you notice into rules a machine can run, is what we'll practice all year.

## Slide 011: The Modeling Loop (id: s11)
Narration: We just ran a loop you'll use over and over. First, represent — hold the input as data, here a grid of zeros and ones. Second, rule — write exact steps from that data to an answer, like counting corners. Third, break and refine — find the edge case, our staircase, and improve the model. We did all three with a picture today. Soon we'll run the same loop on numbers, text, lists, and maps.

## Slide 012: Recap & Next (id: s12)
Narration: To recap: a machine is handed data — a grid of numbers — never meaning. To make it decide anything, you turn what you notice into an exact rule. And rules always meet edge cases, so you break them and refine. That's the instinct this whole unit was built to give you. Next unit, we stop pointing at grids and start writing the rules ourselves — in real Python.
