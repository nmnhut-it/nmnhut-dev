import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-exercises";

const starter = code(["from python_kids import show_value", "", "charges = [2, 4, 3]", "total = 0", "", "for charge in charges:", "    total = total + charge", "", "show_value(total)"]);
const solution = code(["from python_kids import show_value", "", "charges = [2, 4, 3]", "total = 0", "", "for charge in charges:", "    total = total + charge * 2", "", "show_value(total)"]);

export default pythonKidsLesson(8, {
  subtitle: "repeat one process for every item",
  machineName: "THE LOOP CASTER",
  machineBlurb: "a machine that visits every item and keeps a running result",
  cells: [
    { intro: { title: "✦ Repeat the Spell ✦", hook: "A `for` loop repeats a block once for each item. The loop variable names the current item.", art: "assets/old-computer.webp" } },
    { npc: "The loop visits 2, then 4, then 3. Each visit adds the current charge to `total`." },
    { code: starter, label: "kids_loop_demo.py", note: "INPUT: the preset list `[2, 4, 3]`. PROCESS: add each item to `total`. OUTPUT: `9`.", expectOut: /^9$/ },
    { code: starter, solution, label: "kids_loop_edit.py", note: "Double each charge before adding it by changing the loop calculation. OUTPUT: `18`.", expectOut: /^18$/ },
    { checkpoint: { text: "A loop variable holds one current item at a time. The indented block runs once per item, so `total` keeps the result from earlier visits." } },
    { quiz: { title: "Count the visits", questions: [{ q: "How many times does `for item in [4, 7, 1, 9]` run its indented block?", a: ["4", "3", "9"], correct: 0 }] } },
    { remember: "Before running a loop, list the values it will visit and predict the result after each visit." },
  ],
});
