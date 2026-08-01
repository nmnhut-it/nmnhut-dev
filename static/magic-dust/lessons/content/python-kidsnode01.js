import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-python-kids-full";

const face = ["01110", "10001", "10101", "10001", "01110"];
const faceOutput = "  \u2588\u2588\u2588\u2588\u2588\u2588  \n\u2588\u2588      \u2588\u2588\n\u2588\u2588  \u2588\u2588  \u2588\u2588\n\u2588\u2588      \u2588\u2588\n  \u2588\u2588\u2588\u2588\u2588\u2588  ";
const editedFaceOutput = "  \u2588\u2588\u2588\u2588\u2588\u2588  \n\u2588\u2588      \u2588\u2588\n\u2588\u2588      \u2588\u2588\n\u2588\u2588      \u2588\u2588\n  \u2588\u2588\u2588\u2588\u2588\u2588  ";
const starter = code(["from python_kids import show_pixels", "", "face = [", "    [0, 1, 1, 1, 0],", "    [1, 0, 0, 0, 1],", "    [1, 0, 1, 0, 1],", "    [1, 0, 0, 0, 1],", "    [0, 1, 1, 1, 0],", "]", "", "show_pixels(face)"]);
const solution = code(["from python_kids import show_pixels", "", "face = [", "    [0, 1, 1, 1, 0],", "    [1, 0, 0, 0, 1],", "    [1, 0, 1, 0, 1],", "    [1, 0, 0, 0, 1],", "    [0, 1, 1, 1, 0],", "]", "", "face[2][2] = 0", "show_pixels(face)"]);

export default pythonKidsLesson(1, {
  subtitle: "turn a nested list into a picture",
  machineName: "THE PIXEL PAINTER",
  machineBlurb: "a grid where each number controls one light cell",
  cells: [
    { intro: { title: "Paint with Pixels", hook: "A pixel picture can be stored as rows of numbers. A 1 lights a cell; a 0 leaves it dark.", art: "assets/electronic-marquee-board.webp" } },
    { npc: "The outer list contains rows. Each inner list contains columns. Run the grid before you edit one cell." },
    { code: starter, label: "kids_pixel_face.py", note: "INPUT: the preset face grid. PROCESS: send each row and column to show_pixels(). OUTPUT: a five-by-five face.", expectOut: { kind: "pixels", exact: faceOutput } },
    { code: starter, solution, label: "kids_pixel_edit.py", note: "Change the center cell from 1 to 0. INPUT: the preset face grid. PROCESS: assign face[2][2] = 0. OUTPUT: the center light is dark.", expectOut: { kind: "pixels", exact: editedFaceOutput } },
    { checkpoint: { text: "A nested list is a list whose items are other lists. In this lesson, each inner list represents one row of the picture." } },
    { quiz: { title: "Read the grid", questions: [{ q: "In face[2][2], what does the first 2 select?", a: ["The third row.", "The third column.", "The whole picture."], correct: 0 }] } },
    { remember: "A picture can be data. Lists give the machine a structure it can inspect and change." },
  ],
});
