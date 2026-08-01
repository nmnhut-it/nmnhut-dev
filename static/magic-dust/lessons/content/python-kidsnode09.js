import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-exercises";

const starter = code(["from python_kids import play_note", "", "song = [\"C\", \"E\", \"G\"]", "", "for note in song:", "    play_note(note)"]);
const solution = code(["from python_kids import play_note", "", "song = [\"C\", \"E\", \"G\", \"C\"]", "", "for note in song:", "    play_note(note)"]);

export default pythonKidsLesson(9, {
  subtitle: "store and repeat a musical pattern",
  machineName: "THE RHYTHM ROOM",
  machineBlurb: "a visual music machine that plays one named note at a time",
  cells: [
    { intro: { title: "The Rhythm Room", hook: "A song can be data: a list gives the machine a sequence of notes, and a loop visits them in order.", art: "assets/old-computer.webp" } },
    { npc: "This browser kit shows each note clearly so you can test the pattern even when audio is muted. The same list-and-loop idea can later drive sound." },
    { code: starter, label: "kids_rhythm_demo.py", note: "INPUT: the preset note list. PROCESS: visit each note in order. OUTPUT: the visible notes C, E, and G.", expectOut: { sequence: [/C$/, /E$/, /G$/] } },
    { code: starter, solution, label: "kids_rhythm_edit.py", note: "Add one final C to the song list. PROCESS: run the same loop. OUTPUT: the pattern has four notes and ends on C.", expectOut: { sequence: [/C$/, /E$/, /G$/, /C$/] } },
    { checkpoint: { text: "A musical pattern is still ordinary data: a list stores the order, and a loop processes every item." } },
    { quiz: { title: "Read the pattern", questions: [{ q: "What order does `song = [\"A\", \"B\", \"A\"]` give the machine?", a: ["A, then B, then A", "A, then A, then B", "Only B"], correct: 0 }] } },
    { remember: "When audio is unavailable, keep the pattern visible. Data and order should still be testable." },
  ],
});
