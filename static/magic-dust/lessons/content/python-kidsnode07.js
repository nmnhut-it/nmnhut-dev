import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-exercises";

const starter = code(["from python_kids import show_value", "", "robot = {\"name\": \"Pip\", \"mood\": \"calm\"}", "show_value(robot[\"mood\"])"]);
const solution = code(["from python_kids import show_value", "", "robot = {\"name\": \"Pip\", \"mood\": \"calm\"}", "robot[\"mood\"] = \"excited\"", "show_value(robot[\"mood\"])"]);

export default pythonKidsLesson(7, {
  subtitle: "look up a value by a meaningful key",
  machineName: "THE NAME CABINET",
  machineBlurb: "a dictionary that stores named properties for a character",
  cells: [
    { intro: { title: "✦ The Name Cabinet ✦", hook: "A dictionary stores key-value pairs. Instead of remembering a position, ask for the value by its key.", art: "assets/old-computer.webp" } },
    { npc: "The key `mood` names one property of the robot. The value can be read or replaced without counting positions." },
    { code: starter, label: "kids_dictionary_demo.py", note: "INPUT: the preset dictionary. PROCESS: look up the key `mood`. OUTPUT: `calm`.", expectOut: /^calm$/ },
    { code: starter, solution, label: "kids_dictionary_edit.py", note: "Assign `excited` to the existing `mood` key. OUTPUT: `excited`.", expectOut: /^excited$/ },
    { checkpoint: { text: "A dictionary connects a key to a value. Use `robot[\"mood\"]` to read the value and the same form on the left side of `=` to replace it." } },
    { quiz: { title: "Choose the key", questions: [{ q: "Which expression reads the value stored under the key `name`?", a: ["`robot[\"name\"]`", "`robot[0]`", "`robot.name()`"], correct: 0 }] } },
    { remember: "Use a list when position matters. Use a dictionary when a meaningful key should name the value." },
  ],
});
