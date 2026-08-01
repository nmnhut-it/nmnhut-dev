import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = code(["from python_kids import show_value", "", "crystals = 3", "new_crystals = crystals + 2", "", "show_value(new_crystals)"]);
const solution = code(["from python_kids import show_value", "", "crystals = 3", "new_crystals = crystals + 4", "", "show_value(new_crystals)"]);

export default pythonKidsLesson(2, {
  subtitle: "store and change a number",
  machineName: "THE NUMBER CHARM",
  machineBlurb: "a visible counter that shows how values change through a program",
  cells: [
    { intro: { title: "✦ Number Charms ✦", hook: "A variable gives a value a name. When the value changes, the next command can use the new value.", art: "assets/old-computer.webp" } },
    { npc: "Follow the two assignments: first `crystals` is 3, then the machine computes a new value from it." },
    { code: starter, label: "kids_number_demo.py", note: "INPUT: the given value `crystals = 3`. PROCESS: add 2 and store the result. OUTPUT: `5`.", expectOut: /^5$/ },
    { code: starter, solution, label: "kids_number_edit.py", note: "Change the addition from 2 to 4. INPUT: the given value 3. PROCESS: calculate 3 + 4. OUTPUT: `7`.", expectOut: /^7$/ },
    { checkpoint: { text: "After each assignment, name the current value before you RUN. This makes it possible to compare your prediction with the machine's output." } },
    { quiz: { title: "Follow the value", questions: [{ q: "After `score = 8` and `score = score + 2`, what is `score`?", a: ["10", "8", "2"], correct: 0 }] } },
    { remember: "A variable is a named place for a value. Follow the value after each assignment before you RUN." },
  ],
});
