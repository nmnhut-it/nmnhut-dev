import { pythonKidsPractice } from "./python-kids-builders.js";

const starter = `from python_kids import show_value

def double(value):
    return value + 1

result = double(4)
assert result == 8
show_value("passed")
`;
const solution = `from python_kids import show_value

def double(value):
    return value * 2

result = double(4)
assert result == 8
show_value("passed")
`;

export default pythonKidsPractice({
  id: "islandPYKIDSTESTS",
  title: "Test Detective Lab",
  subtitle: "use a failing assertion as evidence",
  machineName: "TEST DETECTIVE LAB",
  machineBlurb: "a repair room where expected behavior guides the investigation",
  cells: [
    { intro: { title: "✦ Test Detective Lab ✦", hook: "A test tells you what the program must do. Use the failing expectation to narrow the search for the bug.", art: "assets/old-computer.webp" } },
    { npc: "The function is named `double`, and the test expects 8 from input 4. The starter adds 1 instead. Repair the process, not the test." },
    { code: starter, solution, label: "test_detective.py", note: "Repair `double()` so input 4 returns 8. OUTPUT after the assertion passes: `passed`.", expectOut: /^passed$/ },
    { code: `from python_kids import show_value\n\nvalue = 3\nassert value > 5\nshow_value(\"passed\")\n`, solution: `from python_kids import show_value\n\nvalue = 6\nassert value > 5\nshow_value(\"passed\")\n`, label: "test_detective_assert.py", note: "Change the given value so the stated test is true. OUTPUT: `passed`.", expectOut: /^passed$/ },
    { quiz: { title: "Respect the evidence", questions: [{ q: "When an assertion fails, what should you inspect first?", a: ["The input, calculation, and expected result.", "The color of the page.", "A random line unrelated to the test."], correct: 0 }] } },
    { remember: "A test is a precise question. Repair the program until the evidence matches the expected behavior." },
  ],
});
