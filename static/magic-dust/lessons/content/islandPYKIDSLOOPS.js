import { pythonKidsPractice } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = `from python_kids import show_value

values = [2, 3, 4]
total = 0
for value in values:
    total = value
show_value(total)
`;
const solution = `from python_kids import show_value

values = [2, 3, 4]
total = 0
for value in values:
    total = total + value
show_value(total)
`;

export default pythonKidsPractice({
  id: "islandPYKIDSLOOPS",
  title: "Loop Lab",
  subtitle: "keep old work while processing every item",
  machineName: "LOOP LAB",
  machineBlurb: "a practice bench for current values and running totals",
  cells: [
    { intro: { title: "✦ Loop Lab ✦", hook: "A loop can keep a running result, but only if each step uses the result from the step before it.", art: "assets/old-computer.webp" } },
    { npc: "The starter replaces `total` on every visit. Repair it so the old total is kept and the current value is added." },
    { code: starter, solution, label: "loop_lab.py", note: "Keep the previous `total` and add `value`. INPUT: `[2, 3, 4]`. OUTPUT: `9`.", expectOut: /^9$/ },
    { code: `from python_kids import show_value\n\ncount = 1\nfor item in [\"a\", \"b\", \"c\"]:\n    count = count + 1\nshow_value(count)\n`, solution: `from python_kids import show_value\n\ncount = 0\nfor item in [\"a\", \"b\", \"c\"]:\n    count = count + 1\nshow_value(count)\n`, label: "loop_lab_count.py", note: "Start the counter at 0, then count three visits. OUTPUT: `3`.", expectOut: /^3$/ },
    { quiz: { title: "Keep the total", questions: [{ q: "Why does `total = total + value` use the old total?", a: ["It preserves earlier work before adding the current item.", "It clears the list.", "It stops the loop immediately."], correct: 0 }] } },
    { remember: "Write the value of the running variable after every loop visit when debugging." },
  ],
});
