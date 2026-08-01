import { pythonKidsPractice } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = `from python_kids import show_value

score = 7
bonus = 2
show_value(score - bonus)
`;
const solution = `from python_kids import show_value

score = 7
bonus = 2
show_value(score + bonus)
`;

export default pythonKidsPractice({
  id: "islandPYKIDSNUMBERS",
  title: "Number Beat Lab",
  subtitle: "change counters with visible arithmetic",
  machineName: "NUMBER BEAT LAB",
  machineBlurb: "a score machine that makes each calculation visible",
  cells: [
    { intro: { title: "✦ Number Beat Lab ✦", hook: "Use named values to build a score and a bonus. Predict the result before the machine shows it.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: the given score and bonus. PROCESS: choose the arithmetic operation. OUTPUT: one number on the stage." },
    { code: starter, solution, label: "number_beat.py", note: "Change subtraction to addition. INPUT: 7 and 2. PROCESS: calculate `7 + 2`. OUTPUT: `9`.", expectOut: /^9$/ },
    { code: `from python_kids import show_value\n\nenergy = 3\ncharge = 4\nshow_value(energy * charge)\n`, solution: `from python_kids import show_value\n\nenergy = 3\ncharge = 4\nshow_value(energy + charge)\n`, label: "number_beat_repair.py", note: "Repair the operation so energy and charge are added. OUTPUT: `7`.", expectOut: /^7$/ },
    { quiz: { title: "Predict the score", questions: [{ q: "What is `12 - 5`?", a: ["7", "17", "60"], correct: 0 }] } },
    { remember: "Name each value and operation before you run a calculation." },
  ],
});
