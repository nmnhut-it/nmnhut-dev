/* Ask Book — the guided track. The 40 cards are a reference; a beginner
   opening a flat deck has no idea which card matters first, so this is the
   ordered path: 8 runs, each one experiment you actually perform in a chat
   window, with fields for what came back. Those fields ARE the prompt log the
   capstone is graded on (ai-course/rubrics/capstone-rubric.md), so filling
   them in as you go means the capstone is already written.
   Shape: {n, fam, title, aim, why, cards[], steps[{do, ask?, record?}], win}
   - step.ask  = a card number whose prompt the step hands you
   - step.record = label for a text field the learner fills in (saved locally)
   - win = the one sentence that means "you did it", not "you finished it" */
window.ASKBOOK_COURSE=[
{n:1,fam:"A",title:"Find out what it actually is",
 aim:"Prove to yourself that the AI is predicting, not remembering — then make it explain an error at your level.",
 why:"Everything else in this book rests on knowing what you're talking to. If you think it looked the answer up, you'll believe it when it's wrong.",
 cards:[1,5,6],extras:[2,3,4],
 steps:[
  {do:"Open THREE fresh chats. Paste the same question in each: \"Explain in 3 sentences what a while loop does.\"",record:"Were the three answers the same? Write one difference you noticed."},
  {do:"Break a program on purpose: take something that works and delete one quote mark. Run it. Copy the WHOLE error, all the lines.",record:"Paste the last line of the error here."},
  {do:"Use the card prompt to get that error explained — and do not read past the explanation to the fix.",ask:1,record:"In your own words, what did the error mean?"},
  {do:"Fix the program yourself, without copying anything. Run it again.",record:"Did it work? If not, what did you try?"},
  {do:"Ask any question that gets an answer using something you haven't learned, then send the \"simpler, I'm 13\" prompt.",ask:5,record:"What did it use that you haven't learned yet?"}],
 win:"You explained an error in your own words and fixed it yourself."},

{n:2,fam:"B",title:"Read code before you run it",
 aim:"Predict what a program prints, then check yourself with a trace — and find out which line you misread.",
 why:"Being able to run code is not the same as being able to read it. Most beginner bugs are reading mistakes, and only a prediction exposes them.",
 cards:[7,8,9,10],extras:[11],
 steps:[
  {do:"Take this program and DO NOT run it yet:",code:"count = 5\nwhile count > 0:\n    print(count)\n    count = count - 2",record:"Write every line you think it prints. Guess before you go on."},
  {do:"Now run it.",record:"What did it actually print?"},
  {do:"If you were wrong, get the turn-by-turn table and find the row where your idea and the program part ways.",ask:8,record:"Which turn surprised you, and why?"},
  {do:"Take a program you did NOT write (a classmate's, or one from an earlier lesson) and get it walked line by line — cover the last row before you read it.",ask:7,record:"What did you predict it prints, and were you right?"},
  {do:"Pick the line in it you think matters most. Predict what breaks if it's gone, then delete it and run it — on a COPY.",ask:10,record:"What actually broke?"}],
 win:"You made a prediction, were wrong at least once, and can name the line you misread."},

{n:3,fam:"C",title:"Get unstuck without taking the answer",
 aim:"Solve something you're stuck on using hints only — no code from the AI, the whole run.",
 why:"This is the run the whole course exists for. Every time you take a finished answer you skip the two minutes where you would have learned something.",
 cards:[12,13,15,17],extras:[14,16],
 steps:[
  {do:"Find something you are ACTUALLY stuck on. If nothing, use this broken program:",code:"number = 1\nwhile number <= 5:\n    print(number)",record:"What is it supposed to do, and what does it do instead?"},
  {do:"Ask for ONE hint — no code. Then put the phone down and sit with it for two full minutes. Time it.",ask:12,record:"What was the hint?"},
  {do:"After the two minutes: did you get it?",record:"Yes/no — and what was the fix?"},
  {do:"Still stuck? Get the 3-things-to-check list and do all three, in order.",ask:15,record:"What did each of the three checks show?"},
  {do:"Now take a task you haven't started and split it into 3 runnable steps. Build STEP 1 ONLY and run it.",ask:17,record:"What are your three steps? Did step 1 run?"}],
 win:"You solved something from a hint, and you can say what the hint made you notice."},

{n:4,fam:"D",title:"Make the AI test you",
 aim:"Generate your own worksheet at your own level, get graded, and catch the case where your answer fails.",
 why:"This is the highest-value thing in the book and almost nobody finds it alone. You'll never again be stuck because you have nothing to practise on.",
 cards:[18,19,21,23],extras:[20,22],
 steps:[
  {do:"Pick the topic you personally find hardest right now.",record:"Which topic?"},
  {do:"Generate 5 exercises on it, easy to hard, answers hidden. Make sure your \"what I know\" ticks are right first.",ask:18,record:"Paste exercise 1 and exercise 5."},
  {do:"Do exercise 1 in a file, yourself. Then get it graded — and demand a case where it FAILS.",ask:19,record:"What failing case did it name? Did you run that case?"},
  {do:"Ask what edge cases would break your program, then TYPE IN every input on the list.",ask:21,record:"Which edge case actually broke it?"},
  {do:"Now the trap: ask it to act as the Python interpreter on a program you know has a bug, and compare with the real run.",ask:23,record:"Did it report the output you MEANT or the output you GOT?"}],
 win:"You found a failing case in your own working code."},

{n:5,fam:"E",title:"Judge a rewrite instead of accepting it",
 aim:"Get suggestions on your own code, and say NO to at least one of them with a reason.",
 why:"A rewrite you can't explain teaches nothing and hides a bug you'll meet later. Rejecting a suggestion is a skill, not rudeness.",
 cards:[24,25,26],extras:[27],
 steps:[
  {do:"Bring code you wrote and are happy with.",record:"What does it do, in one sentence?"},
  {do:"Ask for a simpler version — and for WHY it's simpler to READ, not shorter to type.",ask:24,record:"What did it change?"},
  {do:"Close the chat. Now write, from memory, what changed and why it's better. If you can't, keep your original — that is a correct answer here.",record:"Your explanation (or: \"couldn't explain it, kept mine\")."},
  {do:"Get the strict-teacher list, then ask the follow-up: which of these actually change whether the program is CORRECT?",ask:25,record:"Which items were real, and which were just style?"},
  {do:"Check your own comments for lies.",ask:26,record:"Did any comment no longer match the code?"}],
 win:"You rejected at least one AI suggestion and can say why."},

{n:6,fam:"F",title:"Choose something you can actually finish",
 aim:"Pick a project buildable with what you know today, and turn it into three steps.",
 why:"Most abandoned projects were never possible with what the learner had. One line in a prompt fixes that.",
 cards:[29,28,17,30],
 steps:[
  {do:"Get 5 project ideas that use ONLY what you've ticked. If item 4 or 5 drifts past your list, make it rewrite them.",ask:29,record:"Paste the 5. Which one do you want?"},
  {do:"Check your pick: what do you still need to learn, basic vs fancy?",ask:28,record:"What's marked \"basic\" and still missing?"},
  {do:"If more than one basic item is missing, pick a different project. That decision is the skill.",record:"Final project choice:"},
  {do:"Split it into 3 runnable steps and build step 1.",ask:17,record:"Your 3 steps, and whether step 1 runs."},
  {do:"Pick two words you've been nodding along to without knowing, and get the programming meaning.",ask:30,record:"The two words and what they mean."}],
 win:"You have a project you can finish and step 1 already runs."},

{n:7,fam:"G",title:"Debug with evidence, not vibes",
 aim:"Find a bug yourself with the print ladder, THEN ask — and see how much better the answer gets.",
 why:"A prompt without the error, the input and the expected output is a request for a guess. You produce the evidence; the AI reads it.",
 cards:[31,32,33,34],extras:[35],
 steps:[
  {do:"First, the wrong way, so you see it: paste a broken program and say \"this doesn't work, fix it.\"",record:"Was its answer right? Copy its first sentence."},
  {do:"Now the ladder, rung 1 and 2: print(\"reached the loop\") and print(\"count =\", count).",record:"Did it get there? Was the value what you expected?"},
  {do:"Rung 3: move that print INSIDE the loop so it runs every turn.",record:"On which turn did the value stop being right?"},
  {do:"Rung 4: print before and after the line you suspect. Now paste your evidence and ask what it means — not for a fix.",ask:31,record:"What was the actual cause?"},
  {do:"Mark all your debug prints with a DEBUG switch, flip it to False, and check the program's real output is clean.",ask:33,record:"How many debug prints did you have?"},
  {do:"On a longer program, find a bug by halving instead of reading. Count your checks.",ask:34,record:"How many checks did it take?"}],
 win:"You pointed at the broken line yourself, before the AI did."},

{n:8,fam:"H",title:"Clean it up and hand it in",
 aim:"Run the five clean-code rules over your project in order, then assemble your prompt log.",
 why:"The computer doesn't care what your code looks like. The next person to read it does — and next month that person is you.",
 cards:[36,37,38,39,40],
 steps:[
  {do:"Rule 1 — names. Judge ONLY the names, then rename and re-run to prove the output is identical.",ask:36,record:"Which name changed the most for the better?"},
  {do:"Rule 2 — one chunk, one job. Find where one job ends and the next begins.",ask:37,record:"How many jobs was your longest block doing?"},
  {do:"Rule 3 — no mystery numbers. Name the ones a reader couldn't guess; put them at the top in CAPITALS.",ask:38,record:"Which numbers became constants?"},
  {do:"Rule 4 — delete dead code, leftover debug prints, and comments that lie. Run after EVERY deletion.",ask:39,record:"What did you delete?"},
  {do:"Rule 5 — shape. Fastest pass, least important rule.",ask:40,record:"Anything left inconsistent?"},
  {do:"Export your prompt log (button at the top of the Course tab) and read it back. That is your capstone, plus a 3-minute walk through your own code with no chat open.",record:"One thing your log shows you learned that a finished program wouldn't."}],
 win:"Your log shows a wrong prediction you caught and an AI answer you refused."}
];
