import { PYTHON_KIDS_NODES, pythonKidsCompletionKey, pythonKidsReward } from "./python-kids-curriculum.js";

export const code = lines => `${lines.join("\n")}\n`;

// The source course uses a repeated "FUN With ..." exercise rhythm. Keep the
// main saga readable, but give every island a second, authored challenge so a
// node is not finished after one tiny edit.
const expandedExercises = {
  0: [{ npc: "EXTRA QUEST: change the machine's message, predict it, then run the new command." }, { code: code(["from python_kids import say", "", "message = \"A tiny machine can speak!\"", "say(message)"]), solution: code(["from python_kids import say", "", "message = \"A tiny machine can listen!\"", "say(message)"]), label: "hello_message_challenge.py", note: "INPUT: the given message value. PROCESS: send it to say(). OUTPUT: A tiny machine can listen!", expectOut: /^A tiny machine can listen!$/ }],
  1: [{ npc: "EXTRA QUEST: use image data as a list. Turn the two corner lights on and leave the center dark." }, { code: code(["from python_kids import show_pixels", "", "grid = [[0, 1, 0], [1, 1, 1], [0, 1, 1]]", "show_pixels(grid)"]), solution: code(["from python_kids import show_pixels", "", "grid = [[1, 1, 0], [1, 0, 1], [0, 1, 1]]", "show_pixels(grid)"]), label: "pixel_pattern_challenge.py", note: "INPUT: the given three-by-three grid. PROCESS: edit the grid data. OUTPUT: a new pattern with a dark center.", expectOut: { kind: "pixels", text: /█/ } }],
  2: [{ npc: "EXTRA QUEST: calculate a score from two named values. Predict before RUN." }, { code: code(["from python_kids import show_value", "", "coins = 4", "bonus = 3", "show_value(coins + bonus)"]), solution: code(["from python_kids import show_value", "", "coins = 4", "bonus = 3", "show_value(coins * bonus)"]), label: "number_score_challenge.py", note: "INPUT: the given coins and bonus. PROCESS: multiply them. OUTPUT: 12.", expectOut: /^12$/ }],
  3: [{ npc: "EXTRA QUEST: build a message from three words without losing their spaces." }, { code: code(["from python_kids import say", "", "greeting = \"Hello\"", "name = \"Pip\"", "place = \"Kotopia\"", "say(greeting + \" \" + name)"]), solution: code(["from python_kids import say", "", "greeting = \"Hello\"", "name = \"Pip\"", "place = \"Kotopia\"", "say(greeting + \" \" + name + \" in \" + place)"]), label: "word_message_challenge.py", note: "INPUT: three given words. PROCESS: join the greeting, name, and place. OUTPUT: Hello Pip in Kotopia.", expectOut: /^Hello Pip in Kotopia$/ }],
  4: [{ npc: "EXTRA QUEST: convert a real number input before doing arithmetic." }, { code: code(["from python_kids import read_num, show_value", "", "age = read_num(\"Age: \")", "show_value(age + 1)"]), solution: code(["from python_kids import read_num, show_value", "", "age = read_num(\"Age: \")", "show_value(age * 2)"]), label: "input_conversion_challenge.py", note: "INPUT: the learner types 6. PROCESS: convert it to a number and double it. OUTPUT: 12.", sampleInput: "6", expectOut: /^12$/ }],
  5: [{ npc: "EXTRA QUEST: make a boundary rule. The path opens when energy is exactly 10 or higher." }, { code: code(["from python_kids import show_value", "", "energy = 10", "if energy > 10:", "    show_value(\"open\")", "else:", "    show_value(\"closed\")"]), solution: code(["from python_kids import show_value", "", "energy = 10", "if energy >= 10:", "    show_value(\"open\")", "else:", "    show_value(\"closed\")"]), label: "boundary_path_challenge.py", note: "INPUT: the given energy 10. PROCESS: include the boundary with >=. OUTPUT: open.", expectOut: /^open$/ }],
  6: [{ npc: "EXTRA QUEST: choose among three paths with elif. Check the rules from top to bottom." }, { code: code(["from python_kids import show_value", "", "score = 3", "if score >= 10:", "    show_value(\"gold\")", "elif score >= 5:", "    show_value(\"silver\")", "else:", "    show_value(\"bronze\")"]), solution: code(["from python_kids import show_value", "", "score = 7", "if score >= 10:", "    show_value(\"gold\")", "elif score >= 5:", "    show_value(\"silver\")", "else:", "    show_value(\"bronze\")"]), label: "three_path_challenge.py", note: "INPUT: the given score 7. PROCESS: test the ordered rules. OUTPUT: silver.", expectOut: /^silver$/ }],
  7: [{ npc: "EXTRA QUEST: change one item in a list, then read the changed position." }, { code: code(["from python_kids import show_value", "", "effects = [\"rain\", \"wind\", \"spark\"]", "effects[1] = \"snow\"", "show_value(effects[1])"]), solution: code(["from python_kids import show_value", "", "effects = [\"rain\", \"wind\", \"spark\"]", "effects[1] = \"comet\"", "show_value(effects[1])"]), label: "list_edit_challenge.py", note: "INPUT: the given effects list. PROCESS: replace index 1. OUTPUT: comet.", expectOut: /^comet$/ }],
  8: [{ npc: "EXTRA QUEST: store two named character facts and look up the one the robot needs." }, { code: code(["from python_kids import show_value", "", "character = {\"name\": \"Pip\", \"mood\": \"calm\"}", "show_value(character[\"name\"])" ]), solution: code(["from python_kids import show_value", "", "character = {\"name\": \"Pip\", \"mood\": \"curious\"}", "show_value(character[\"mood\"])" ]), label: "dictionary_fact_challenge.py", note: "INPUT: the given character dictionary. PROCESS: look up the mood key. OUTPUT: curious.", expectOut: /^curious$/ }],
  9: [{ npc: "EXTRA QUEST: use a loop to play a new four-note pattern in order." }, { code: code(["from python_kids import play_note", "", "song = [\"A\", \"B\", \"C\"]", "for note in song:", "    play_note(note)" ]), solution: code(["from python_kids import play_note", "", "song = [\"A\", \"B\", \"C\", \"D\"]", "for note in song:", "    play_note(note)" ]), label: "four_note_challenge.py", note: "INPUT: the given note list. PROCESS: visit every note. OUTPUT: A, B, C, D in order.", expectOut: { sequence: [/A$/, /B$/, /C$/, /D$/] } }],
  10: [{ npc: "EXTRA QUEST: use a bounded while loop. The counter must stop at 3." }, { code: code(["from python_kids import show_value", "", "count = 0", "while count < 2:", "    count = count + 1", "show_value(count)" ]), solution: code(["from python_kids import show_value", "", "count = 0", "while count < 3:", "    count = count + 1", "show_value(count)" ]), label: "bounded_loop_challenge.py", note: "INPUT: counter starts at 0. PROCESS: repeat while count is below 3. OUTPUT: 3.", expectOut: /^3$/ }],
  11: [{ npc: "EXTRA QUEST: write a function that works for more than one input." }, { code: code(["from python_kids import show_value", "", "def double(value):", "    return value", "", "show_value(double(6))" ]), solution: code(["from python_kids import show_value", "", "def double(value):", "    return value * 2", "", "show_value(double(6))" ]), label: "function_reuse_challenge.py", note: "INPUT: the argument 6. PROCESS: return twice the value. OUTPUT: 12.", expectOut: /^12$/ }],
  12: [{ npc: "EXTRA QUEST: give a creature a method that changes its own energy." }, { code: code(["from python_kids import show_value", "", "class Creature:", "    def __init__(self, name):", "        self.name = name", "        self.energy = 1", "    def charge(self, amount):", "        self.energy = self.energy + amount", "", "pip = Creature(\"Pip\")", "pip.charge(2)", "show_value(pip.energy)" ]), solution: code(["from python_kids import show_value", "", "class Creature:", "    def __init__(self, name):", "        self.name = name", "        self.energy = 1", "    def charge(self, amount):", "        self.energy = self.energy + amount * 2", "", "pip = Creature(\"Pip\")", "pip.charge(2)", "show_value(pip.energy)" ]), label: "creature_method_challenge.py", note: "INPUT: Pip starts with energy 1 and receives charge 2. PROCESS: double the charge in the method. OUTPUT: 5.", expectOut: /^5$/ }],
  13: [{ npc: "EXTRA QUEST: add a second assertion for a different input before declaring the function safe." }, { code: code(["from python_kids import show_value", "", "def is_even(value):", "    return value % 2 == 0", "", "assert is_even(4)", "assert is_even(5)", "show_value(\"checked\")" ]), solution: code(["from python_kids import show_value", "", "def is_even(value):", "    return value % 2 == 0", "", "assert is_even(4)", "assert not is_even(5)", "show_value(\"checked\")" ]), label: "second_assertion_challenge.py", note: "INPUT: two test values, 4 and 5. PROCESS: assert the even rule for both. OUTPUT: checked.", expectOut: /^checked$/ }],
  14: [{ npc: "EXTRA QUEST: write the project contract before coding: INPUT, PROCESS, OUTPUT, and one test." }, { code: code(["from python_kids import robot_say", "", "project_name = \"My machine\"", "robot_say(project_name + \" is ready\")" ]), solution: code(["from python_kids import robot_say", "", "project_name = \"Pixel machine\"", "robot_say(project_name + \" is tested and ready\")" ]), label: "project_contract_challenge.py", note: "INPUT: a project name. PROCESS: describe its checked result. OUTPUT: Robot: Pixel machine is tested and ready.", expectOut: /^Robot: Pixel machine is tested and ready$/ }],
};

export function pythonKidsLesson(id, { subtitle, machineName, machineBlurb, cells }) {
  const meta = PYTHON_KIDS_NODES.find(node => node.id === id);
  if (!meta) throw new Error(`No Python for Kids metadata for node ${id}`);
  return {
    index: -1,
    pageLabel: `PYTHON FOR KIDS · NODE ${String(id).padStart(2, "0")}`,
    sideIslandId: `python-kids-${String(id).padStart(2, "0")}`,
    completionKey: pythonKidsCompletionKey(id),
    justSolvedKey: "magicdust.pythonKids.justSolved",
    returnPage: "./python-kids.html",
    kind: "python-kids-saga",
    cameraFree: true,
    mainRequired: meta.mainRequired,
    reward: pythonKidsReward(meta),
    title: meta.title,
    subtitle,
    machine: { art: "assets/old-computer.webp", name: machineName, blurb: machineBlurb },
    modules: { python_kids: "../py/python_kids/__init__.py" },
    cells: [...cells, ...(expandedExercises[id] || [])],
  };
}

export function pythonKidsPractice({ id, title, subtitle, machineName, machineBlurb, cells }) {
  return {
    index: -1,
    pageLabel: "PYTHON FOR KIDS · PRACTICE ISLAND",
    sideIslandId: id,
    completionKey: `magicdust.sideisland.${id}`,
    justSolvedKey: "magicdust.pythonKids.justSolved",
    returnPage: "./python-kids.html",
    kind: "python-kids-practice",
    cameraFree: true,
    title,
    subtitle,
    machine: { art: "assets/old-computer.webp", name: machineName, blurb: machineBlurb },
    modules: { python_kids: "../py/python_kids/__init__.py" },
    cells,
  };
}
