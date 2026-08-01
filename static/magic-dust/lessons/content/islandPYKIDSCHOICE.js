import { pythonKidsPractice } from "./python-kids-builders.js?v=20260801-exercises";

const starter = `from python_kids import show_value

temperature = 20
if temperature > 20:
    show_value("warm")
else:
    show_value("cool")
`;
const solution = `from python_kids import show_value

temperature = 20
if temperature >= 20:
    show_value("warm")
else:
    show_value("cool")
`;

export default pythonKidsPractice({
  id: "islandPYKIDSCHOICE",
  title: "Choice Maze",
  subtitle: "probe the boundary of a condition",
  machineName: "CHOICE MAZE",
  machineBlurb: "a decision machine that reveals which rule matched",
  cells: [
    { intro: { title: "✦ Choice Maze ✦", hook: "A boundary value is where a rule can make a surprising choice. Test the exact boundary, not only easy values.", art: "assets/old-computer.webp" } },
    { npc: "The requirement says 20 counts as warm. The starter uses `>`, which excludes 20. Change the comparison to include the boundary." },
    { code: starter, solution, label: "choice_maze.py", note: "Change `>` to `>=`. INPUT: the given temperature 20. PROCESS: include the boundary. OUTPUT: `warm`.", expectOut: /^warm$/ },
    { code: `from python_kids import show_value\n\nlevel = 10\nif level > 10:\n    show_value(\"high\")\nelse:\n    show_value(\"low\")\n`, solution: `from python_kids import show_value\n\nlevel = 10\nif level >= 10:\n    show_value(\"high\")\nelse:\n    show_value(\"low\")\n`, label: "choice_maze_boundary.py", note: "Include level 10 in the high path. OUTPUT: `high`.", expectOut: /^high$/ },
    { quiz: { title: "Test the edge", questions: [{ q: "With `points >= 5`, what happens when points is 5?", a: ["The condition is True.", "The condition is False.", "Python skips the condition."], correct: 0 }] } },
    { remember: "Test below, exactly at, and above every important boundary." },
  ],
});
