// Learner hub for the high-school course (Unit 0 + Units 1-12, MIT 6.0001 backbone).
// Unit index 0 = Unit 0 (the hook); index N = Unit N. Each unit links to its slide deck.

const modules = [
  {
    title: "How Computers See",
    focus: "A machine gets data, not meaning. A photo becomes a grid of 0s and 1s. That gap — your view vs the machine's — is the hook for the whole course.",
    ideas: ["turn a shape into a 0/1 grid", "count corners as a rule", "watch the rule over-count the staircase edge", "ask: how is this stored as data?"],
    coding: "No code yet — Unit 0 is the hook. Real Python starts in Unit 1.",
    deliverable: "Explain why the corner rule over-counts a triangle.",
    deck: "u00-how-computers-see"
  },
  {
    title: "What Is Computation? + First Python",
    focus: "A number is the simplest data. Computation is exact rules over data — and the computer only does what you tell it.",
    ideas: ["print and do math in Python", "store values in variables", "meet int, float, bool, str", "predict, then run"],
    coding: "Bridge: odd_or_even(number), finished once branching arrives.",
    deliverable: "A tiny program that computes and prints an answer.",
    deck: "u01-what-is-computation"
  },
  {
    title: "Choices & Repetition",
    focus: "A boolean is yes/no data. A loop carries state that changes on every pass.",
    ideas: ["branch with if / elif / else", "combine checks with and / or / not", "repeat with while and for", "find the loop that never stops"],
    coding: "Bridge: finish odd_or_even(number) with % and if.",
    deliverable: "A loop that stops correctly on a boundary case.",
    deck: "u02-choices-and-repetition"
  },
  {
    title: "Strings & Clever Loops",
    focus: "Text is a sequence of symbols. The machine checks symbols, not meaning.",
    ideas: ["index and slice a string", "loop over characters", "count and search in text", "halve a range (bisection)"],
    coding: "Bridge: string checks like counting vowels.",
    deliverable: "A function that scans text and returns a result.",
    deck: "u03-strings-and-clever-loops"
  },
  {
    title: "Functions",
    focus: "A function names a rule: data in, value out. Break a big problem into small named rules.",
    ideas: ["define with def", "pass parameters", "return vs print", "reuse a function"],
    coding: "Bridge: write is_triangle(corners, boundary_closed) as a function.",
    deliverable: "A function with a parameter and a return value, explained.",
    deck: "u04-functions"
  },
  {
    title: "Lists & Tuples",
    focus: "A list is an ordered collection you index and loop. Aliasing shares one list; cloning makes a copy.",
    ideas: ["build and index a list", "loop and use append / sort", "unpack a tuple", "spot the aliasing gotcha"],
    coding: "Bridge: has_repeat(items) over a list.",
    deliverable: "A list function plus a note on the empty-list edge case.",
    deck: "u05-lists-and-tuples"
  },
  {
    title: "Dictionaries (+ gentle recursion)",
    focus: "A dictionary maps keys to values — lookup by name, not position. Recursion is a rule that calls itself, with a base case.",
    ideas: ["make and look up a dict", "count words with a dict", "handle a missing key", "trace a tiny recursion"],
    coding: "Bridge: tally with a dict; a small recursive function.",
    deliverable: "A word-count dict and a base / recursive case.",
    deck: "u06-dictionaries"
  },
  {
    title: "Testing & Debugging",
    focus: "Testing means comparing expected output vs actual. Debug by shrinking to the smallest failing example.",
    ideas: ["write normal / boundary / edge tests", "read a traceback", "bisect a bug", "fix the broken discount calculator"],
    coding: "Bridge: fix broken_discount_calculator.py so debug_discount_checks passes.",
    deliverable: "A bug found and fixed, with the evidence.",
    deck: "u07-testing-and-debugging"
  },
  {
    title: "Objects (OOP)",
    focus: "An object bundles data and behavior into one thing you design.",
    ideas: ["define a class", "write __init__ and self", "add a method", "print with __str__"],
    coding: "Bridge: a small class, e.g. Dog with name / age and a method.",
    deliverable: "A class you built and used.",
    deck: "u08-objects"
  },
  {
    title: "Classes & Inheritance",
    focus: "Inheritance shares structure across related types — so you don't repeat shared code.",
    ideas: ["extend a parent class", "override a method", "call super().__init__", "check with isinstance"],
    coding: "Bridge: a small hierarchy, e.g. Animal -> Cat / Dog.",
    deliverable: "A subclass that overrides one behavior.",
    deck: "u09-classes-and-inheritance"
  },
  {
    title: "How Fast? (efficiency)",
    focus: "Measure work by counting steps, not seconds. Feel constant, linear, and quadratic growth.",
    ideas: ["count steps as n grows", "single loop vs nested loop", "read an n-vs-steps table", "name it with Big-O"],
    coding: "Bridge: compare step counts of two functions.",
    deliverable: "Label three snippets O(1) / O(n) / O(n^2).",
    deck: "u10-how-fast-efficiency"
  },
  {
    title: "Efficiency, Deeper",
    focus: "How work scales: halving (log) beats scanning (linear), and exponential blows up fast.",
    ideas: ["halve a range (binary search)", "compare log vs linear", "watch naive fib explode", "fix it with memoization"],
    coding: "Bridge: binary_search; a memoized fib.",
    deliverable: "Explain why binary search is O(log n).",
    deck: "u11-efficiency-deeper"
  },
  {
    title: "Searching & Sorting",
    focus: "Order is a representation choice — sorted data unlocks fast search.",
    ideas: ["linear vs binary search", "trace a simple sort", "argue sort-once, search-many", "tie the course together"],
    coding: "Bridge: choose_review_topic(scores) over a list.",
    deliverable: "A search or a sort traced step by step.",
    deck: "u12-searching-and-sorting"
  }
];

const quizBank = [
  {
    module: 0,
    question: "The corner rule counts 6 corners on the triangle. Why?",
    answers: [
      "The machine is broken.",
      "The slanted edge is a staircase, and each step passes the corner test.",
      "Triangles really do have 6 corners.",
      "The grid is too small."
    ],
    correct: 1,
    explanation: "To the machine a slope is a staircase; every step looks like a little corner. The rule was honest — the model was too simple."
  },
  {
    module: 1,
    question: "What does 9 / 2 give in Python?",
    answers: ["4 (an int)", "4.5 (a float)", "5 (an int)", "an error"],
    correct: 1,
    explanation: "A single slash always makes a float, even when it divides evenly. Use // for whole-number division."
  },
  {
    module: 2,
    question: "What makes a while loop run forever?",
    answers: [
      "Its condition never becomes False.",
      "It uses a for loop.",
      "It calls print.",
      "It has an if inside."
    ],
    correct: 0,
    explanation: "A while loop needs its condition to eventually become False, or it never stops."
  },
  {
    module: 3,
    question: 'What does "hello"[1:3] give?',
    answers: ['"he"', '"el"', '"ell"', '"llo"'],
    correct: 1,
    explanation: "Slicing starts at index 1 and stops before index 3, so you get characters 1 and 2: 'el'."
  },
  {
    module: 4,
    question: "What does return do in a function?",
    answers: [
      "Prints to the screen.",
      "Hands a value back to the caller.",
      "Defines a new variable.",
      "Starts a loop."
    ],
    correct: 1,
    explanation: "return sends a value back; print only shows text. They are not the same."
  },
  {
    module: 5,
    question: "After a = [1, 2]; b = a; b.append(3), what is a?",
    answers: ["[1, 2]", "[1, 2, 3]", "[3]", "an error"],
    correct: 1,
    explanation: "b = a makes b an alias of the same list, so appending through b changes a too."
  },
  {
    module: 6,
    question: 'How do you read the value for key "cat" in a dict d?',
    answers: ["d(cat)", 'd["cat"]', "d.cat()", 'cat in d'],
    correct: 1,
    explanation: "Square brackets with the key look up its value: d[\"cat\"]."
  },
  {
    module: 7,
    question: "What does testing a function mean?",
    answers: [
      "Running it once and hoping.",
      "Comparing expected output vs actual output.",
      "Deleting the bug.",
      "Adding more print lines only."
    ],
    correct: 1,
    explanation: "A test says what you expect, runs the code, and compares expected vs actual."
  },
  {
    module: 8,
    question: "What does __init__ do in a class?",
    answers: [
      "Prints the object.",
      "Sets up a new object's data.",
      "Deletes the object.",
      "Loops over the data."
    ],
    correct: 1,
    explanation: "__init__ runs when you create an object and sets its starting attributes."
  },
  {
    module: 9,
    question: "What does a subclass get from its parent class?",
    answers: [
      "Nothing.",
      "The parent's methods and attributes.",
      "Only the parent's name.",
      "A copy it must rewrite."
    ],
    correct: 1,
    explanation: "A subclass inherits the parent's methods and attributes for free, then can add or override."
  },
  {
    module: 10,
    question: "A single loop over n items runs in roughly...",
    answers: ["O(1)", "O(n)", "O(n^2)", "O(log n)"],
    correct: 1,
    explanation: "One pass over n items is linear: the work grows in step with n."
  },
  {
    module: 11,
    question: "Binary search on 100 sorted items takes about how many steps?",
    answers: ["about 100", "about 50", "about 7", "about 1"],
    correct: 2,
    explanation: "Halving 100 down to 1 takes about 7 steps — that's O(log n)."
  },
  {
    module: 12,
    question: "Binary search only works if the list is...",
    answers: ["empty", "sorted", "reversed", "all unique"],
    correct: 1,
    explanation: "Binary search relies on order: at each step it can throw away half because the data is sorted."
  }
];

const exercises = {
  oddEven: {
    title: "Odd or Even",
    prompt: "Rule: if the remainder after dividing by 2 is 0, the number is even; otherwise it is odd.",
    rule: "representation: one number (int)\nrule: check number % 2\noutput: \"even\" or \"odd\"",
    input: "8 -> even\n9 -> odd\n0 -> even",
    starter: `def odd_or_even(number):
    if number % 2 == 0:
        return "even"
    return "odd"`,
    walkthrough: [
      "`def` names the rule so you can reuse it.",
      "`number` is the value passed in.",
      "`% 2` is the remainder after dividing by 2.",
      "`return` hands the answer back to whoever called the function."
    ],
    tests: [
      { input: "8", expected: "even" },
      { input: "9", expected: "odd" }
    ]
  },
  triangle: {
    title: "Triangle Check",
    prompt: "The machine doesn't get a triangle — it gets features. Rule: 3 corners and a closed boundary means triangle.",
    rule: "representation: features pulled from the image\nfeatures: corner count, and whether the boundary is closed\nrule: check both features\noutput: \"triangle\" or \"not triangle\"",
    input: "corners=3, boundary_closed=True -> triangle\ncorners=3, boundary_closed=False -> not triangle",
    starter: `def is_triangle(corners, boundary_closed):
    if corners == 3 and boundary_closed:
        return "triangle"
    return "not triangle"`,
    walkthrough: [
      "The function never sees a whole shape — only chosen features.",
      "`corners` and `boundary_closed` are those features.",
      "`== 3` checks the corner count.",
      "`and` means both conditions must be true to say triangle."
    ],
    tests: [
      { input: "3, True", expected: "triangle" },
      { input: "3, False", expected: "not triangle" }
    ]
  },
  repeat: {
    title: "Find a Repeat",
    prompt: "Rule: walk the list once, remembering what you've seen. If an item shows up again, report a repeat.",
    rule: "representation: a list of items\nrule: keep a 'seen' list and check each item against it\noutput: True or False",
    input: "['star', 'moon', 'star'] -> True\n['star', 'moon', 'sun'] -> False\n[] -> False",
    starter: `def has_repeat(items):
    seen = []
    for item in items:
        if item in seen:
            return True
        seen.append(item)
    return False`,
    walkthrough: [
      "`seen = []` starts an empty record of what we've seen.",
      "`for item in items` visits one item at a time.",
      "`if item in seen` checks whether we've met it before.",
      "`seen.append(item)` records the item after checking it."
    ],
    tests: [
      { input: "star, moon, star", expected: "True" },
      { input: "star, moon, sun", expected: "False" }
    ]
  },
  review: {
    title: "Choose a Review Topic",
    prompt: "Rule: pick the topic with the lowest score. If a tie, keep the first. If there are no scores, return a safe message.",
    rule: "representation: a list of (topic, score) pairs\nrule: track the lowest score seen so far\noutput: the topic name, or a safe message when empty",
    input: "[('fractions', 80), ('graphs', 62)] -> graphs\n[] -> no scores: add review data",
    starter: `def choose_review_topic(scores):
    if scores == []:
        return "no scores: add review data"
    best_topic = scores[0][0]
    best_score = scores[0][1]
    for topic, score in scores:
        if score < best_score:
            best_topic = topic
            best_score = score
    return best_topic`,
    walkthrough: [
      "`scores` is a list of (topic, score) pairs.",
      "The empty-list check handles the edge case first.",
      "`for topic, score in scores` unpacks each pair.",
      "`<` (strict) keeps the first topic on a tie.",
      "`return best_topic` hands back the answer."
    ],
    tests: [
      { input: "fractions 80, graphs 62", expected: "graphs" },
      { input: "empty list", expected: "no scores: add review data" }
    ]
  }
};

const state = loadState();

const els = {
  moduleNav: document.getElementById("moduleNav"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  moduleNumber: document.getElementById("moduleNumber"),
  moduleTitle: document.getElementById("moduleTitle"),
  moduleMindset: document.getElementById("moduleMindset"),
  moduleIdeas: document.getElementById("moduleIdeas"),
  moduleCoding: document.getElementById("moduleCoding"),
  moduleDeliverable: document.getElementById("moduleDeliverable"),
  moduleDeck: document.getElementById("moduleDeck"),
  completeModule: document.getElementById("completeModule"),
  buildModel: document.getElementById("buildModel"),
  modelOutput: document.getElementById("modelOutput"),
  quizList: document.getElementById("quizList"),
  quizScore: document.getElementById("quizScore"),
  exerciseSelect: document.getElementById("exerciseSelect"),
  exercisePrompt: document.getElementById("exercisePrompt"),
  exerciseTests: document.getElementById("exerciseTests"),
  codeEditor: document.getElementById("codeEditor"),
  codeInput: document.getElementById("codeInput"),
  codeOutput: document.getElementById("codeOutput"),
  testOutput: document.getElementById("testOutput"),
  runCode: document.getElementById("runCode"),
  resetCode: document.getElementById("resetCode")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("introCsCourseState"));
    return saved || { moduleIndex: 0, completed: {}, quizAnswers: {} };
  } catch {
    return { moduleIndex: 0, completed: {}, quizAnswers: {} };
  }
}

function saveState() {
  localStorage.setItem("introCsCourseState", JSON.stringify(state));
}

function unitLabel(index) {
  return `Unit ${index}`;
}

function renderModules() {
  els.moduleNav.innerHTML = "";
  modules.forEach((module, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "module-button";
    if (index === state.moduleIndex) button.classList.add("active");
    if (state.completed[index]) button.classList.add("done");
    button.innerHTML = `<span>${unitLabel(index)}${state.completed[index] ? " complete" : ""}</span>${module.title}`;
    button.addEventListener("click", () => {
      state.moduleIndex = index;
      saveState();
      render();
    });
    els.moduleNav.appendChild(button);
  });
}

function renderProgress() {
  const completeCount = Object.values(state.completed).filter(Boolean).length;
  const percent = (completeCount / modules.length) * 100;
  els.progressText.textContent = `${completeCount} of ${modules.length} units complete`;
  els.progressFill.style.width = `${percent}%`;
}

function renderCurrentModule() {
  const module = modules[state.moduleIndex];
  els.moduleNumber.textContent = unitLabel(state.moduleIndex);
  els.moduleTitle.textContent = module.title;
  els.moduleMindset.textContent = module.focus;
  els.moduleCoding.textContent = module.coding;
  els.moduleDeliverable.textContent = module.deliverable;
  if (els.moduleDeck) {
    els.moduleDeck.href = `slides/${module.deck}/`;
  }
  els.completeModule.textContent = state.completed[state.moduleIndex] ? "Completed" : "Mark Complete";
  els.moduleIdeas.innerHTML = "";
  module.ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.textContent = idea;
    els.moduleIdeas.appendChild(li);
  });
}

function renderQuiz() {
  const questions = quizBank.filter((item) => item.module === state.moduleIndex);
  const answeredCorrectly = quizBank.filter((item, index) => state.quizAnswers[index] === item.correct).length;
  els.quizScore.textContent = `${answeredCorrectly} correct`;
  els.quizList.innerHTML = "";

  if (questions.length === 0) {
    const empty = document.createElement("p");
    empty.className = "explanation";
    empty.textContent = "No quick check for this unit — open the deck for its slide quiz.";
    els.quizList.appendChild(empty);
    return;
  }

  questions.forEach((item) => {
    const absoluteIndex = quizBank.indexOf(item);
    const card = document.createElement("div");
    card.className = "quiz-card";
    const prompt = document.createElement("p");
    prompt.textContent = item.question;
    const answerGrid = document.createElement("div");
    answerGrid.className = "answer-grid";

    item.answers.forEach((answer, answerIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = answer;
      const selected = state.quizAnswers[absoluteIndex];
      if (selected !== undefined) {
        if (answerIndex === item.correct) button.classList.add("correct");
        if (answerIndex === selected && selected !== item.correct) button.classList.add("incorrect");
      }
      button.addEventListener("click", () => {
        state.quizAnswers[absoluteIndex] = answerIndex;
        saveState();
        renderQuiz();
      });
      answerGrid.appendChild(button);
    });

    card.appendChild(prompt);
    card.appendChild(answerGrid);

    if (state.quizAnswers[absoluteIndex] !== undefined) {
      const explanation = document.createElement("p");
      explanation.className = "explanation";
      explanation.textContent = item.explanation;
      card.appendChild(explanation);
    }

    els.quizList.appendChild(card);
  });
}

function buildModel() {
  const value = (id) => document.getElementById(id).value.trim() || "[not defined]";
  const problem = value("problemInput");
  const inputs = value("inputsInput");
  const outputs = value("outputsInput");
  const rules = value("rulesInput");
  const examples = value("examplesInput");

  els.modelOutput.textContent = [
    "Problem:",
    `  ${problem}`,
    "",
    "The Modeling Loop:",
    `  Represent (how the machine holds the input): ${inputs}`,
    `  Rule (exact steps): ${rules}`,
    `  Output: ${outputs}`,
    "",
    "Examples to test:",
    `  ${examples}`,
    "",
    "Run the loop:",
    "  1. Picture it — name the input and output.",
    "  2. Represent — decide how the input is stored as data.",
    "  3. Rule — write the exact steps.",
    "  4. Run & predict — trace one example; predict before running.",
    "  5. Break & refine — find an edge case that breaks it, then fix it."
  ].join("\n");
}

function setupExercises() {
  Object.entries(exercises).forEach(([key, exercise]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = exercise.title;
    els.exerciseSelect.appendChild(option);
  });
  els.exerciseSelect.addEventListener("change", renderExercise);
  renderExercise();
}

function renderExercise() {
  const exercise = exercises[els.exerciseSelect.value];
  els.exercisePrompt.textContent = exercise.prompt;
  els.codeEditor.value = exercise.starter;
  els.codeInput.value = exercise.input;
  els.codeOutput.textContent = "Press Explain to connect each Python line to the rule.";
  els.testOutput.innerHTML = "";
  els.exerciseTests.innerHTML = "";
  const rule = document.createElement("pre");
  rule.textContent = exercise.rule;
  els.exerciseTests.appendChild(rule);
  exercise.tests.forEach((test, index) => {
    const div = document.createElement("div");
    div.textContent = `Example ${index + 1}: ${test.input} -> ${test.expected}`;
    els.exerciseTests.appendChild(div);
  });
}

function explainPythonBridge() {
  const exercise = exercises[els.exerciseSelect.value];
  els.codeOutput.textContent = [
    "Read the Python from top to bottom:",
    "",
    ...exercise.walkthrough.map((line, index) => `${index + 1}. ${line}`),
    "",
    "The shape: representation -> rule -> output."
  ].join("\n");
  els.testOutput.innerHTML = "";
  exercise.tests.forEach((test, index) => {
    const row = document.createElement("div");
    row.className = "test-pass";
    row.textContent = `Example ${index + 1}: input ${test.input} should give ${test.expected}`;
    els.testOutput.appendChild(row);
  });
}

function render() {
  renderModules();
  renderProgress();
  renderCurrentModule();
  renderQuiz();
}

els.completeModule.addEventListener("click", () => {
  state.completed[state.moduleIndex] = true;
  saveState();
  render();
});

els.buildModel.addEventListener("click", buildModel);
els.runCode.addEventListener("click", explainPythonBridge);
els.resetCode.addEventListener("click", renderExercise);

setupExercises();
render();
