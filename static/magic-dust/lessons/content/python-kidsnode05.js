import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import show_value", "", "energy = 8", "", "if energy >= 10:", "    show_value(\"full\")", "else:", "    show_value(\"recharge\")"]);
const solution = code(["from python_kids import show_value", "", "energy = 12", "", "if energy >= 10:", "    show_value(\"full\")", "else:", "    show_value(\"recharge\")"]);

export default pythonKidsLesson(5, {
  subtitle: "make the machine choose between two paths",
  machineName: "THE PATHFINDER",
  machineBlurb: "a decision machine that checks a rule before choosing an output",
  cells: [
    { intro: { title: "✦ Choose a Path ✦", hook: "A condition is a question with a Boolean answer: True or False. `if` chooses one block; `else` handles the other result.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: the given energy value. PROCESS: compare it with 10. OUTPUT: either `full` or `recharge`." },
    { code: starter, label: "kids_path_demo.py", note: "INPUT: the preset value `energy = 8`. PROCESS: test `energy >= 10`. OUTPUT: `recharge`.", expectOut: /^recharge$/ },
    { code: starter, solution, label: "kids_path_edit.py", note: "Change the given energy to 12. PROCESS: test the same condition. OUTPUT: `full`.", expectOut: /^full$/ },
    { checkpoint: { text: "Python checks the `if` condition first. If it is True, Python runs that indented block; otherwise it runs the indented `else` block." } },
    { quiz: { title: "Check the boundary", questions: [{ q: "With `if energy >= 10`, which path runs when `energy` is exactly 10?", a: ["The `if` path.", "The `else` path.", "Neither path."], correct: 0 }] } },
    { remember: "Write the condition as a complete question, then test a value below, at, and above the boundary." },
  ],
});
