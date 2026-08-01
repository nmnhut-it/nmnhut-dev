import { pythonKidsPractice } from "./python-kids-builders.js?v=20260801-exercises";

const starter = `from python_kids import say

parts = ["Magic", "Dust"]
message = parts[0]
say(message)
`;
const solution = `from python_kids import say

parts = ["Magic", "Dust"]
message = parts[0] + " " + parts[1]
say(message)
`;

export default pythonKidsPractice({
  id: "islandPYKIDSWORDS",
  title: "Word Mixer Lab",
  subtitle: "turn a list of words into a complete message",
  machineName: "WORD MIXER",
  machineBlurb: "a small text machine that combines words in order",
  cells: [
    { intro: { title: "✦ Word Mixer Lab ✦", hook: "Use list indexing and string joining to build a message from separate pieces.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: the preset list of two words. PROCESS: select both words and join them with one space. OUTPUT: `Magic Dust`." },
    { code: starter, solution, label: "word_mixer.py", note: "Change the message expression so it uses both list items and a space. OUTPUT: `Magic Dust`.", expectOut: /^Magic Dust$/ },
    { code: `from python_kids import say\n\nparts = [\"Bright\", \"Pixel\"]\nmessage = parts[0] + parts[1]\nsay(message)\n`, solution: `from python_kids import say\n\nparts = [\"Bright\", \"Pixel\"]\nmessage = parts[0] + \" \" + parts[1]\nsay(message)\n`, label: "word_mixer_repair.py", note: "Add the missing space between the two list items. OUTPUT: `Bright Pixel`.", expectOut: /^Bright Pixel$/ },
    { quiz: { title: "Build the message", questions: [{ q: "Which expression joins `\"Magic\"` and `\"Dust\"` with a space?", a: ["`\"Magic\" + \" \" + \"Dust\"`", "`\"MagicDust\"`", "`\"Magic\" - \"Dust\"`"], correct: 0 }] } },
    { remember: "A message can be built from collection values. Select the pieces, choose the separator, then inspect the complete output." },
  ],
});
