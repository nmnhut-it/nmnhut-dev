import { code, pythonKidsLesson } from "./python-kids-builders.js";

const starter = code(["from python_kids import robot_say, show_pixels", "", "# Build a machine that uses at least four Python for Kids kits.", "# It needs data, a decision, a loop, and a reusable function.", "", "robot_say(\"My machine is ready.\")"]);
const solution = code(["from python_kids import robot_say, show_pixels", "", "def make_badge(name, points):", "    if points >= 5:", "        return \"bright \" + name", "    return \"small \" + name", "", "badges = [\"pixel\", \"number\", \"robot\"]", "points = 6", "for badge in badges:", "    robot_say(make_badge(badge, points))", "", "show_pixels([[1, 1, 1], [1, 0, 1], [1, 1, 1]])"]);

export default pythonKidsLesson(14, {
  subtitle: "combine the kits in an original machine",
  machineName: "THE TALKING MACHINE",
  machineBlurb: "a final project where data, decisions, loops, functions, and visuals work together",
  cells: [
    { intro: { title: "✦ The Talking Machine ✦", hook: "Now build a machine that combines the ideas from the whole track. Choose a theme, make a plan, then test the behavior you can observe.", art: "assets/old-computer.webp" } },
    { npc: "Choose one route: Talking Machine uses words and robot memory; Pixel Creature uses image data and visual rules; Particle Conductor uses lists, loops, and effect frames." },
    { npc: "Every route must include two data types, one collection, one decision, one loop, two learner-written functions, and one visible output stage." },
    { code: starter, label: "kids_final_project.py", note: "PROJECT INPUT: your chosen data and theme. PROCESS: design the machine in small steps. OUTPUT: a visible response that you can explain and test.", expectOut: /Robot: My machine is ready\./ },
    { code: starter, solution, label: "kids_final_project_example.py", note: "Use the example as a starting point or replace it with your own project. It combines a list, loop, function, condition, robot output, and pixel output.", expectOut: /Robot: bright pixel/ },
    { checkpoint: { text: "Before calling the project complete, write its INPUT, PROCESS, OUTPUT, one test case, and one change you would make next." } },
    { quiz: { title: "Project contract", questions: [{ q: "Which item proves that a project was tested?", a: ["A named test case with an expected result.", "A longer title.", "More comments without a check."], correct: 0 }] } },
    { remember: "A finished project is not only code that runs. It is a small machine whose behavior you can demonstrate and explain." },
  ],
});
