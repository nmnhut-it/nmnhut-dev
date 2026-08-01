import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import read_num, show_value", "", "number = read_num(\"Enter a number: \")", "show_value(number + 1)"]);
const solution = code(["from python_kids import read_num, show_value", "", "number = read_num(\"Enter a number: \")", "show_value(number * 2)"]);

export default pythonKidsLesson(4, {
  subtitle: "let a person give the machine a number",
  machineName: "THE INPUT GATE",
  machineBlurb: "a gate that waits for a real keyboard value before continuing",
  cells: [
    { intro: { title: "✦ The Input Gate ✦", hook: "A preset value is not INPUT. INPUT is data supplied from outside the program while it runs.", art: "assets/old-computer.webp" } },
    { npc: "The machine asks for one number, converts the reply to an integer, then processes it. The browser test supplies the sample input `6`." },
    { code: starter, label: "kids_input_demo.py", note: "INPUT: the person types `6`. PROCESS: add 1. OUTPUT: `7`.", sampleInput: "6", expectOut: /^7$/ },
    { code: starter, solution, label: "kids_input_edit.py", note: "Change the process from adding 1 to multiplying by 2. INPUT: `6`. PROCESS: calculate `6 * 2`. OUTPUT: `12`.", sampleInput: "6", expectOut: /^12$/ },
    { checkpoint: { text: "`read_num()` pauses for outside data and returns an integer. The next line can use that returned value in a calculation." } },
    { quiz: { title: "Find the input", questions: [{ q: "Which line reads a number from outside the program?", a: ["`number = read_num(\"Enter a number: \")`", "`number = 6`", "`show_value(number)`"], correct: 0 }] } },
    { remember: "Always label the source of a value: given in code, or INPUT supplied while the program runs." },
  ],
});
