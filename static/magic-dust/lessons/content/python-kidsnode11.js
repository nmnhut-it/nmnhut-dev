import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import show_value", "", "def double(value):", "    return value + value", "", "result = double(4)", "show_value(result)"]);
const solution = code(["from python_kids import show_value", "", "def double(value):", "    return value * 2", "", "result = double(4)", "show_value(result)"]);

export default pythonKidsLesson(11, {
  subtitle: "package repeated work into a function",
  machineName: "THE FUNCTION FORGE",
  machineBlurb: "a recipe machine that accepts a value and returns a result",
  cells: [
    { intro: { title: "✦ Spell Recipes ✦", hook: "A function packages a process under a name. A parameter receives input, and `return` sends a result back to the caller.", art: "assets/old-computer.webp" } },
    { npc: "Follow the value: `double(4)` sends 4 into `value`; the function processes it; `return` sends the result back into `result`." },
    { code: starter, label: "kids_function_demo.py", note: "INPUT: the argument `4`. PROCESS: add `value` to itself. OUTPUT: `8` returned to the caller.", expectOut: /^8$/ },
    { code: starter, solution, label: "kids_function_edit.py", note: "Change the function process to multiplication by 2. INPUT: 4. PROCESS: calculate `4 * 2`. OUTPUT: `8`.", expectOut: /^8$/ },
    { checkpoint: { text: "A parameter is the function's input name. `return` sends a value back to the line that called the function; `show_value()` displays it afterward." } },
    { quiz: { title: "Follow the return", questions: [{ q: "What value does `double(5)` return when the function body is `return value + value`?", a: ["10", "5", "25"], correct: 0 }] } },
    { remember: "Name the function's input, process, and returned result before writing a new recipe." },
  ],
});
