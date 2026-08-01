import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import say", "", "name = \"Mina\"", "message = \"Hello, \" + name", "", "say(message)"]);
const solution = code(["from python_kids import say", "", "name = \"Mina\"", "message = \"Welcome, \" + name + \"!\"", "", "say(message)"]);

export default pythonKidsLesson(3, {
  subtitle: "give words names and build a message",
  machineName: "THE WORD CHARM",
  machineBlurb: "a message machine that joins small pieces of text",
  cells: [
    { intro: { title: "✦ Word Charms ✦", hook: "Text is data too. Give a word a name, join words with `+`, and send the finished message to the machine.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: the given name `Mina`. PROCESS: join text values in order. OUTPUT: one complete message." },
    { code: starter, label: "kids_words_demo.py", note: "INPUT: the preset word `Mina`. PROCESS: join `Hello, ` with `name`. OUTPUT: `Hello, Mina`.", expectOut: /^Hello, Mina$/ },
    { code: starter, solution, label: "kids_words_edit.py", note: "Change the message so it includes `Welcome, ` before the name and `!` after it. OUTPUT: `Welcome, Mina!`.", expectOut: /^Welcome, Mina!$/ },
    { checkpoint: { text: "A string is text inside quotes. The `+` operator joins strings in the order written; it does not add their letters as numbers." } },
    { quiz: { title: "Join the words", questions: [{ q: "What is the output of `\"red\" + \"bird\"`?", a: ["redbird", "red bird bird", "an error because strings cannot join"], correct: 0 }] } },
    { remember: "Words are values. Name them, join them, and inspect the complete message the machine receives." },
  ],
});
