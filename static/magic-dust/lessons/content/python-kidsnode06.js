import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import show_value", "", "effects = [\"spark\", \"rain\", \"glow\"]", "show_value(effects[1])"]);
const solution = code(["from python_kids import show_value", "", "effects = [\"spark\", \"rain\", \"glow\"]", "effects[1] = \"comet\"", "show_value(effects[1])"]);

export default pythonKidsLesson(6, {
  subtitle: "store several values in one ordered list",
  machineName: "THE MEMORY CHEST",
  machineBlurb: "a collection that keeps several effects in a known order",
  cells: [
    { intro: { title: "✦ The Memory Chest ✦", hook: "A list stores several values in order. An index selects one position, and an assignment can replace that item.", art: "assets/old-computer.webp" } },
    { npc: "The list has three items. Python indexes from 0, so index 1 selects the second item. Run the program before changing the list." },
    { code: starter, label: "kids_list_demo.py", note: "INPUT: the preset list. PROCESS: read `effects[1]`. OUTPUT: `rain`.", expectOut: /^rain$/ },
    { code: starter, solution, label: "kids_list_edit.py", note: "Change the second list item by assigning `effects[1] = \"comet\"`. OUTPUT: `comet`.", expectOut: /^comet$/ },
    { checkpoint: { text: "A list keeps items in order. Index 0 is the first item, index 1 is the second item, and assignment changes the selected item." } },
    { quiz: { title: "Select a list item", questions: [{ q: "For `colors = [\"red\", \"blue\", \"gold\"]`, what does `colors[2]` produce?", a: ["gold", "blue", "red"], correct: 0 }] } },
    { remember: "When a collection changes, name the list, the index, the old value, and the new value." },
  ],
});
