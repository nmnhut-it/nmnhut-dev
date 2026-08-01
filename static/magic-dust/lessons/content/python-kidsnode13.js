import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-exercises";

const starter = code(["from python_kids import show_value", "", "def total(values):", "    result = 0", "    for value in values:", "        result = value", "    return result", "", "score = total([2, 4, 3])", "assert score == 9", "show_value(\"tests passed\")"]);
const solution = code(["from python_kids import show_value", "", "def total(values):", "    result = 0", "    for value in values:", "        result = result + value", "    return result", "", "score = total([2, 4, 3])", "assert score == 9", "show_value(\"tests passed\")"]);

export default pythonKidsLesson(13, {
  subtitle: "use evidence to find and repair a bug",
  machineName: "THE BUG LABORATORY",
  machineBlurb: "a test bench that checks a claim about a program",
  cells: [
    { intro: { title: "✦ The Bug Laboratory ✦", hook: "A test is a precise claim about expected behavior. When a claim fails, use the input and each step to locate the bug.", art: "assets/old-computer.webp" } },
    { npc: "The function should add every value. The current loop replaces the old result instead, so the assertion is evidence that something is wrong." },
    { code: starter, label: "kids_test_bug.py", note: "INPUT: `[2, 4, 3]`. PROCESS: test whether `total()` returns 9. The starter contains a deliberate bug; inspect the failed assertion before editing.", expectOut: /tests passed/ },
    { code: starter, solution, label: "kids_test_repair.py", note: "Repair the accumulator so it keeps the previous result and adds the current value. OUTPUT: `tests passed`.", expectOut: /^tests passed$/ },
    { checkpoint: { text: "A failing test is evidence, not a verdict about you. Compare the expected result with the function's state after each loop visit." } },
    { quiz: { title: "Read the test", questions: [{ q: "What does `assert score == 9` check?", a: ["That `score` must equal 9.", "That 9 is added to score.", "That the loop runs forever."], correct: 0 }] } },
    { remember: "A good test names an input, an expected result, and a condition that can pass or fail." },
  ],
});
