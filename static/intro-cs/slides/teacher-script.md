# Teacher Script And Narration

Use this with `web/slides/index.html`. Each slide has a short narration for classroom playback and a teacher action for live delivery.

The narration text is intentionally simple. It is written for learners ages 10-14 and avoids starting with technical vocabulary.

## Slide 001: Title

Narration:
Today we will learn one big idea. People can notice patterns quickly. A machine cannot use that feeling. A machine needs an exact rule it can follow.

Teacher action:
Ask learners to name one pattern they already know, such as even numbers, colors, or a classroom routine.

## Slide 002: One Shape For Every Program

Narration:
Every program in this course has the same shape. Information goes in. Exact rules happen in the middle. Then an answer comes out, or something changes.

Teacher action:
Point to each box. Ask learners to explain odd or even using the three boxes.

## Slide 003: Model A Problem

Narration:
Computer science starts by modeling a problem. We decide what information goes in, what exact rule happens, and what answer comes out.

Teacher action:
Use one familiar problem and ask for the input, the process, and the output.

## Slide 004: People And Machines Work Differently

Narration:
People can recognize patterns from experience. A machine only gets encoded information and follows the exact rule we give it.

Teacher action:
Ask for something students can recognize quickly. Then ask what a machine would actually receive.

## Slide 005: Odd Or Even

Narration:
For odd or even, the input is one number and the output is odd or even. The missing part is the process the machine can follow.

Teacher action:
Ask learners to identify the input and output before discussing the rule.

## Slide 006: Teach Divisibility

Narration:
Even means divisible by two. For the machine, divisible by two becomes this equivalent check: the remainder after dividing by two is zero.

Teacher action:
Have learners say the equivalence aloud both ways.

## Slide 007: Run The Machine Rule

Narration:
Now run the rule. The number goes in. The machine checks the remainder after dividing by two. If the remainder is zero, the answer is even. Otherwise the answer is odd.

Teacher action:
Have learners predict first, then say the remainder and the answer.

## Slide 008: Now Model Other Problems

Narration:
Now try the same thinking on other problems. Name the input and output. Then ask what a human notices that the machine may not receive.

Teacher action:
Use two or three examples from the slide and discuss where the model is too simple.

## Slide 009: Check

Narration:
Choose the rule the machine can use for even. The correct rule is the remainder check: if the remainder after dividing by two is zero, say even.

Teacher action:
Click the selected answer and ask learners to say the full model: number in, remainder rule, odd or even out.

## Slide 010: Module 2 Opening

Narration:
The machine only works with the information it is given right now. If the finger is touching one card, the machine uses that card, not a hidden guess.

Teacher action:
Point to one card. Ask learners to read only the touched card.

## Slide 011: Five Tiny Actions

Narration:
In this course, our tiny machine can do five things. It can look, check, change, move, and stop. Bigger programs are built from these small actions.

Teacher action:
Have learners act out each verb with one hand and a card row.

## Slide 012: Wrong Rule, Right Following

Narration:
The machine may follow a wrong rule perfectly. If the rule says every red thing goes in the red bin, a red car goes there too, even if that was not the goal.

Teacher action:
Ask learners to fix one word in the rule, not the whole activity.

## Slide 013: Module 2 Program Model

Narration:
Now the rule makes a change. The machine looks at one card, checks whether it says sad, changes sad to happy, moves to the next card, and stops after the last card.

Teacher action:
Have learners run the sad-to-happy row with a finger before saying the program model.

## Slide 014: Module 2 Python Bridge

Narration:
This tiny Python preview keeps the same shape. Card is the information in. Return gives the answer out. We are reading the shape, not starting with code.

Teacher action:
Do not code yet. Have learners point to card and then to return.

## Slide 015: Module 2 Quick Check

Narration:
The toy is hidden, but the card says blue ball. What can the machine use? It can use the clear words on the card, not a guess about the hidden toy.

Teacher action:
After the click, ask learners why the other choices are hidden or guessing.

## Slide 016: Module 2 Exercise

Narration:
Now be the tiny machine and say the whole shape. Information goes in, exact rules happen, and an answer comes out or something changes. The later word for what the machine knows right now is state.

Teacher action:
Require look, check, change, move, and stop. Then let a partner act out the rule and fix one unclear word.

## Slide 017: Module 3 Opening

Narration:
Now we name the whole shape. A program takes information in, follows exact rules, and gives an answer or makes a change.

Teacher action:
Give each group three labels and have them place cards in the right boxes.

## Slide 018: Classroom Helper

Narration:
A classroom helper needs clear information. For a review helper, topic names and scores are useful. Vague feelings are harder for the machine to check.

Teacher action:
Ask which parts of the cards are useful and which are too fuzzy.

## Slide 019: Rule In The Middle

Narration:
The rule in the middle is simple. Choose the topic with the lowest score. The answer must come from the rule, not from a guess.

Teacher action:
Have learners sort the three topic cards from lowest to highest score.

## Slide 020: Module 3 Program Model

Narration:
Here is the review helper as a program. Topic scores go in. The exact rule chooses the lowest score. The topic name comes out.

Teacher action:
Ask what tricky case is missing. Guide learners toward no cards or tied scores.

## Slide 021: Module 3 Python Bridge

Narration:
In Python, information goes into the function. The rule happens inside. Return sends the answer back out.

Teacher action:
Have learners circle or point to the return line.

## Slide 022: Module 3 Quick Check

Narration:
Choose the answer that shows the whole program model. Look for information in, exact rules, and answer or change out.

Teacher action:
Ask learners why the other choices are not complete enough.

## Slide 023: Module 3 Exercise

Narration:
Build your own helper. The example helper chooses a review topic from topic scores. Your helper needs a problem, cards that go in, a rule in the middle, and an answer that comes out.

Teacher action:
Give examples only after learners try their own helper first.

## Slide 024: Module 4 Opening

Narration:
The machine does not receive meaning directly. A real thing becomes a source, then bits and bytes, then an interpretation, then a representation and features a program can check.

Teacher action:
Walk through the chain once before using any examples.

## Slide 025: Triangle Example

Narration:
A person may see a triangle. A program may receive image bytes, interpret them as an image, represent the image as pixels or lines, then check features like corners and closed edges.

Teacher action:
Ask where the word triangle enters the chain.

## Slide 026: Traffic Light Example

Narration:
A traffic-light program may receive bytes from a camera, sensor, or API. Those bytes become a color or state value. But light color alone may miss other important context.

Teacher action:
Ask what extra input could make crossing decisions safer.

## Slide 027: Smiley Example

Narration:
A smiley-face program does not receive happiness. It receives encoded image data. A program can represent that as pixels and features such as dark spots, curves, and a mouth-like shape.

Teacher action:
Ask learners to separate raw data words from meaning words.

## Slide 028: Feature Rule

Narration:
After the representation is chosen, a simple rule can check features. In this simplified triangle rule, three corners and a closed boundary means triangle.

Teacher action:
Sort the three feature cards before revealing the answer.

## Slide 029: Triangle Python Bridge

Narration:
This function does not receive the full picture. It receives selected features: corners and whether the edges close. Both checks must pass.

Teacher action:
Ask learners to predict what three and false returns.

## Slide 030: Module 4 Quick Check

Narration:
Does a machine directly receive the meaning this is a smiley face? No. It receives encoded data that a program must interpret and represent.

Teacher action:
Ask learners to explain the difference between bytes, representation, and features.

## Slide 031: Module 4 Exercise

Narration:
Now build the chain yourself. Choose a shape, smiley face, message, or traffic light. Name the source, bytes, representation, features, and answer out.

Teacher action:
Require source, representation, and features before any answer.

## Slide 032: Module 5 Opening

Narration:
Decision rules need exact boundaries. If the rule says twenty or more, the number twenty goes on the yes path.

Teacher action:
Have learners physically stand on yes or no before the reveal.

## Slide 033: Boundary Words

Narration:
Small words change the path. Under twenty does not include twenty. Twenty or less does include twenty. More than twenty does not include twenty. Twenty or more does.

Teacher action:
Use the 20 card four times and ask learners to place it under yes or no.

## Slide 034: Two Checks

Narration:
Some decisions need more than one check. A triangle needs three corners and closed edges. If one check fails, the answer is not triangle.

Teacher action:
Ask if one good clue is enough. Require learners to explain both checks.

## Slide 035: Module 5 Program Model

Narration:
For a decision, one card comes in. The exact rule checks a boundary or a clue. The answer is the yes path or the no path.

Teacher action:
Ask learners to mark the edge card in their own rule.

## Slide 036: Decision Python Bridge

Narration:
In Python, if means check this yes or no rule. Greater than or equal means seventy or more. Return gives the path answer.

Teacher action:
Ask whether 70 passes and why the equal part matters.

## Slide 037: Module 5 Quick Check

Narration:
The rule says at least five. Does five pass? Use the boundary word, not a guess.

Teacher action:
Ask learners to replace at least with more than and compare.

## Slide 038: Module 5 Exercise

Narration:
Make a yes or no gate. The example uses the rule twenty or more. Your gate needs a yes rule, a no path, and an edge card that proves the boundary.

Teacher action:
Check that every rule has a visible boundary or exact clue.

## Slide 039: Module 6 Opening

Narration:
A repeat means using the same rule for each item. First, predict whether any card appears more than once.

Teacher action:
Let learners vote yes or no before using the seen pile.

## Slide 040: Seen Pile

Narration:
The seen pile remembers cards we already checked. Before adding the next card, the machine asks, have I seen this before?

Teacher action:
Point to the old star and the next star. Ask what the rule should answer.

## Slide 041: Stop Rules

Narration:
The repeat rule has two ways to stop. If the card is already seen, stop and say true. If the row ends, stop and say false.

Teacher action:
Place a stop card at the second star, then try a row with no repeat.

## Slide 042: Module 6 Program Model

Narration:
For the repeat finder, the item row goes in. The rule checks each item and updates the seen pile. The answer out is true or false.

Teacher action:
Ask what changes after each card. Listen for the seen pile.

## Slide 043: Repeat Python Bridge

Narration:
This function makes an empty seen pile. For each item, it checks if the item is already seen. If yes, it returns true. If the row ends, it returns false.

Teacher action:
Trace star, moon, star line by line with the class.

## Slide 044: Module 6 Quick Check

Narration:
The row is cat, dog, bird. No item appears twice. What should the repeat rule answer?

Teacher action:
Ask learners why the answer happens only after the row ends.

## Slide 045: Module 6 Exercise

Narration:
Trace the seen pile. The example stops at the second star because star is already in the seen pile. Your trace must show what is seen before each card and why the rule stops.

Teacher action:
Require the words repeat found or end of row as the stop reason.

## Slide 046: Module 7 Opening

Narration:
Now we write the rule in Python. The parameter is information in. The if line is a check. The return line is the answer out.

Teacher action:
Have learners match rule-card parts to Python line cards.

## Slide 047: Read Before Run

Narration:
Before running code, predict the answer. If the number is nine, the remainder after dividing by two is one, so the function should return odd.

Teacher action:
Ask learners to write the prediction before saying it aloud.

## Slide 048: Four Small Rules

Narration:
These four functions come from activities we already acted out: odd and even, triangle check, repeat finder, and review-topic helper.

Teacher action:
Ask learners to match each function name to its unplugged activity.

## Slide 049: Module 7 Program Model

Narration:
In Python, parameters are the information in. The indented lines are the exact rules. Return values are the answers out.

Teacher action:
Ask where the answer out appears in one function.

## Slide 050: Run Checks

Narration:
Checks are examples with expected answers. Before running a check, predict what should happen. Then use the result as evidence.

Teacher action:
Run only one check or discuss one expected answer first.

## Slide 051: Module 7 Quick Check

Narration:
Which line gives the answer out? Look for the line that sends a value back from the function.

Teacher action:
Ask why the if line is a check, not the final answer.

## Slide 052: Module 7 Exercise

Narration:
Explain one function like a rule card. The example function is odd_or_even. For your function, point to the information in, point to the rule line, and point to the return line.

Teacher action:
Use two-person teams: one learner explains, one learner asks for evidence.

## Slide 053: Module 8 Opening

Narration:
A strong beginner project is small and checked. It shows a clear rule, a normal example, a tricky example, and one improvement.

Teacher action:
Ask learners to vote between small and checked or huge and unclear.

## Slide 054: Review Topic Helper

Narration:
The review helper chooses the topic with the lowest score. Here, graphs has the lowest score, so graphs is the answer.

Teacher action:
Have learners sort the score cards before saying the answer.

## Slide 055: Tricky Case

Narration:
What if there are no score cards? The helper should not guess. It should give a safe answer: no scores, add review data.

Teacher action:
Ask learners to write the safe answer before revealing it.

## Slide 056: Module 8 Program Model

Narration:
For the review helper, topic scores go in. The exact rule finds the lowest score. The answer out is a topic or a safe message.

Teacher action:
Ask which box changes when the input is empty.

## Slide 057: Review Topic Python Bridge

Narration:
The first check handles the empty case. Then the function keeps the best topic seen so far and updates it when it finds a lower score.

Teacher action:
Trace the scores one card at a time.

## Slide 058: Module 8 Quick Check

Narration:
Use the rule. Fractions is eighty, graphs is sixty-two, and vocabulary is seventy-four. Which score is lowest?

Teacher action:
Ask learners to justify the answer with the score, not preference.

## Slide 059: Module 8 Exercise

Narration:
Prepare a two-minute demo. Show the problem, the rule, one normal case, one tricky case, and one thing you improved after trying it.

Teacher action:
Give each learner a peer check card with those six boxes.

## Slide 060: Wrap

Narration:
You can now explain a program without guessing. Say what information goes in, what exact rule is followed, and what answer or change comes out.

Teacher action:
Have learners explain one function or unplugged rule to a partner.
