import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = code(["from python_kids import say", "", "say(\"Hello from my tiny machine!\")"]);
const solution = code(["from python_kids import say", "", "say(\"Hello from my Python machine!\")"]);

export default pythonKidsLesson(0, {
  subtitle: "make a program speak",
  machineName: "THE TINY MACHINE",
  machineBlurb: "a small browser machine that follows one Python command at a time",
  cells: [
    { intro: { title: "✦ Meet the Tiny Machine ✦", hook: "A program is a set of instructions. Run this first program and watch the machine report its output.", art: "assets/old-computer.webp" } },
    { npc: "Before changing code, predict the exact sentence you expect to see. Then press RUN and compare your prediction with the output." },
    { code: starter, label: "kids_hello_demo.py", note: "INPUT: none. PROCESS: call `say()` with one message. OUTPUT: the machine prints the message.", expectOut: /^Hello from my tiny machine!$/ },
    { code: starter, solution, label: "kids_hello_edit.py", note: "Change only the message inside `say()`. INPUT: none. PROCESS: send the new message. OUTPUT: `Hello from my Python machine!`.", expectOut: /^Hello from my Python machine!$/ },
    { checkpoint: { text: "`say(value)` sends one value to the machine's output. It does not silently change the value." } },
    { quiz: { title: "Check the command", questions: [{ q: "What does `say(\"Hi\")` do?", a: ["It prints `Hi`.", "It creates a list.", "It repeats forever."], correct: 0 }] } },
    { remember: "A program gives the machine instructions. RUN is how you collect evidence about what those instructions do." },
  ],
});
