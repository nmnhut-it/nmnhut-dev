const starter = `from python_kids import show_pixels

pattern = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
]

show_pixels(pattern)
`;

const solution = `from python_kids import show_pixels

pattern = [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1],
]

show_pixels(pattern)
`;

export default {
  index: -1,
  pageLabel: "PYTHON FOR KIDS · PRACTICE ISLAND",
  sideIslandId: "islandPYKIDPIXELS",
  completionKey: "magicdust.sideisland.islandPYKIDPIXELS",
  justSolvedKey: "magicdust.pythonKids.justSolved",
  returnPage: "./python-kids.html",
  kind: "python-kids-practice",
  cameraFree: true,
  title: "Pixel Pattern Lab",
  subtitle: "change a nested list and watch the picture change",
  machine: { art: "assets/electronic-marquee-board.webp", name: "PIXEL PATTERN LAB", blurb: "short experiments with rows and columns" },
  modules: { python_kids: "../py/python_kids/__init__.py" },
  cells: [
    { intro: { title: "✦ Pixel Pattern Lab ✦", hook: "Use the same image kit again. This time, change a pattern without being given the final picture.", art: "assets/electronic-marquee-board.webp" } },
    { npc: "INPUT: the preset nested list. PROCESS: change the middle row so all three cells are lit. OUTPUT: a bright plus shape." },
    { code: starter, solution, label: "pixel_pattern_lab.py", note: "Replace the middle row with `[1, 1, 1]`. The three rows are the INPUT data; `show_pixels()` is the PROCESS that displays them; the plus shape is the OUTPUT.", expectOut: /██/ },
    { code: `from python_kids import show_pixels\n\npattern = [\n    [1, 1, 1],\n    [1, 1, 1],\n    [1, 1, 1],\n]\n\nshow_pixels(pattern)\n`, solution: starter, label: "pixel_pattern_repair.py", note: "The goal is an X pattern: the first and last rows have lit corners, and the middle row is fully lit. Restore the three rows. OUTPUT: the X pattern.", expectOut: /██/ },
    { checkpoint: { text: "To change a picture, change the list data first. The renderer follows the rows and columns it receives." } },
    { quiz: { title: "Read one row", questions: [{ q: "What does the middle inner list represent in this three-row pattern?", a: ["The second row of the picture.", "The second program run.", "The whole image name."], correct: 0 }] } },
    { remember: "The Pixel Pattern Lab is a safe place to try one data change, RUN, and compare the visible result." },
  ],
};
