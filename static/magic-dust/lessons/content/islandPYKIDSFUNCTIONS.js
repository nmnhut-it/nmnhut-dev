import { pythonKidsPractice } from "./python-kids-builders.js";

const starter = `from python_kids import show_value

def badge_name(word):
    return word

show_value(badge_name("pixel"))
`;
const solution = `from python_kids import show_value

def badge_name(word):
    return "Bright " + word + " badge"

show_value(badge_name("pixel"))
`;

export default pythonKidsPractice({
  id: "islandPYKIDSFUNCTIONS",
  title: "Function Forge",
  subtitle: "turn a small process into a reusable recipe",
  machineName: "FUNCTION FORGE",
  machineBlurb: "a practice bench for parameters and returned values",
  cells: [
    { intro: { title: "✦ Function Forge ✦", hook: "A function is useful when it hides a repeatable process behind a clear name.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: the word `pixel`. PROCESS: add a prefix and suffix inside the function. OUTPUT: `Bright pixel badge`." },
    { code: starter, solution, label: "function_forge.py", note: "Change the returned expression so the parameter is inside `Bright ` and ` badge`. OUTPUT: `Bright pixel badge`.", expectOut: /^Bright pixel badge$/ },
    { code: `from python_kids import show_value\n\ndef add_prefix(word):\n    return word\n\nshow_value(add_prefix(\"star\"))\n`, solution: `from python_kids import show_value\n\ndef add_prefix(word):\n    return \"Super \" + word\n\nshow_value(add_prefix(\"star\"))\n`, label: "function_forge_repair.py", note: "Return the prefix together with the parameter. OUTPUT: `Super star`.", expectOut: /^Super star$/ },
    { quiz: { title: "Find the result", questions: [{ q: "Where does the value from `return` go in `show_value(badge_name(\"pixel\"))`?", a: ["Into `show_value()`.", "Into the function name.", "It disappears."], correct: 0 }] } },
    { remember: "A good function has a clear input, a clear process, and a returned result that another line can use." },
  ],
});
