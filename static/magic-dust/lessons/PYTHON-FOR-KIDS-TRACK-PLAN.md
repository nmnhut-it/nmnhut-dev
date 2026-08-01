# Python for Kids — Magic Dust Track Plan

## 1. Purpose

Create a new English-language Magic Dust learning track inspired by
`mytechnotalent/Python-For-Kids`.

The track should preserve the source course's central idea — children learn
Python by making a small machine do visible, playful things — while adapting
the experience to Magic Dust's browser runtime, notebook cells, visual stages,
quests, and gesture rituals.

This is a new track. It must not replace or duplicate the existing Python50
track.

## 2. Source and adaptation boundary

Source repository:

- https://github.com/mytechnotalent/Python-For-Kids
- License shown by the repository: Apache License 2.0

The source describes a 15-chapter MicroPython course for the BBC micro:bit.
Its chapters cover goals, Hello World, images, numbers, words, word lists,
music, talking robots, basic I/O, data types, conditional logic, collections
and loops, functions, classes, and unittest.

Magic Dust will use the source as curriculum inspiration and attribution, not
as a text or exercise-copying source. We will write original explanations,
examples, story, code cells, quizzes, art direction, and projects.

Hardware-dependent features are translated as follows:

| Source idea | Magic Dust adaptation |
| --- | --- |
| micro:bit display | Image grids, pixel boards, and visual effect stages |
| micro:bit buttons/sensors | Preset inputs first, then browser/camera input where useful |
| micro:bit music | Browser sound or visual rhythm patterns |
| talking robot | Pip / stage character responds to learner-created data |
| MicroPython device loop | Browser notebook execution and observable state |
| physical board project | A visual spell, toy, or small interactive stage |

## 3. Learner profile and promise

- Intended learner: roughly ages 10–14, beginner Python level.
- Language: English learner-facing content.
- Prerequisite: can read short instructions and edit a small code cell.
- Runtime: browser, no micro:bit required.
- Main promise: “You will learn Python by giving a tiny machine data,
  decisions, memory, and reusable instructions — then watching your creation
  respond.”

The track should teach computational habits as well as syntax:

1. predict before running;
2. name the input, process, and output;
3. change one thing at a time;
4. use visible evidence to debug;
5. explain why the code works.

## 4. Proposed track shape

### Main saga: 15 nodes

The 15 nodes mirror the source chapter rhythm but are rewritten for Magic
Dust's visual runtime.

| Node | Title | Core ideas | Signature output |
| ---: | --- | --- | --- |
| 0 | Meet the Tiny Machine | program, command, run, output | first message from the stage |
| 1 | Paint with Pixels | rows, columns, image data | a learner-built pixel face |
| 2 | Number Charms | values, variables, arithmetic | a live score or energy meter |
| 3 | Word Charms | strings, joining, formatting | a personalized stage message |
| 4 | The Input Gate | input, conversion, validation | a stage that reacts to a value |
| 5 | Choose a Path | Boolean values, comparisons, `if`/`else` | a two-path visual effect |
| 6 | Many Paths | `elif`, ordered rules, boundaries | a three-level meter |
| 7 | The Memory Chest | lists, indexing, changing a list | a collection of effects |
| 8 | The Name Cabinet | dictionaries, keys, lookup | a character/effect data card |
| 9 | Repeat the Spell | `for`, `range`, accumulation | repeated particles or tiles |
| 10 | Keep Trying | `while`, stop conditions, counters | a bounded animation or search |
| 11 | Spell Recipes | functions, parameters, return values | reusable effect functions |
| 12 | Build a Creature | classes, attributes, methods | a small interactive creature |
| 13 | The Bug Laboratory | assertions, test cases, debugging | a repaired broken program |
| 14 | Final Project: The Talking Machine | integration and explanation | an original visual Python project |

### Practice islands

Short optional islands should reinforce the main path without delaying core
progress:

- Pixel Face Lab
- Number Beat Lab
- Word Mixer Lab
- Choice Maze
- List Sorting Room
- Particle Loop Lab
- Function Forge
- Test Detective Lab

Each island should contain several short cells with one concept per cell,
followed by a checkpoint and a small creative variation.

## 5. Lesson contract

Every learner-facing node must include:

1. a concrete scene or object to observe;
2. a direct definition before any analogy;
3. a runnable example;
4. a guided edit where the learner changes code;
5. an explicit INPUT / PROCESS / OUTPUT description;
6. a prediction prompt before execution;
7. a broken or incomplete example for diagnosis;
8. a checkpoint that tests the concept, not memorized wording;
9. a small creative extension;
10. a final ritual or reward with no new technical concept.

Starter code and solution code must differ meaningfully. Student-visible
identifiers must use English ASCII names such as `score`, `count`, `word`,
`items`, `result`, and `pixel_grid`.

## 6. Pedagogical sequence

Each node follows this rhythm:

1. **See it** — the stage shows a concrete phenomenon.
2. **Name it** — the learner gets the exact Python rule.
3. **Trace it** — the learner predicts a small example.
4. **Change it** — the learner edits one bounded part.
5. **Break it** — the learner diagnoses a purposeful bug.
6. **Use it** — the learner applies the rule in a new scene.
7. **Explain it** — the learner answers a self-contained checkpoint.
8. **Seal it** — the ritual rewards completion without teaching new material.

Avoid introducing classes, randomness, device APIs, or large projects before
the learner has a stable model of values, control flow, collections, and
functions.

## 7. Final project options

The final node should offer three equivalent project routes so learners can
choose a theme without changing the learning goals:

- **Talking Machine** — stores words and responds with a generated message.
- **Pixel Creature** — uses image data and rules to change its appearance.
- **Particle Conductor** — uses lists, loops, and functions to create a visual
  effect.

All projects must demonstrate:

- at least two data types;
- one conditional decision;
- one collection;
- one loop;
- at least two learner-written functions;
- one test or explicit verification checklist;
- a short explanation of INPUT, PROCESS, and OUTPUT.

## 8. Implementation phases

### Phase 0 — curriculum design

- Confirm the track name, visual theme, and relationship to Python50.
- Add this plan to the course index.
- Define the authoritative curriculum metadata and unlock rules.
- Decide which existing visual engines can be reused.

### Phase 1 — vertical slice

Build Nodes 0–2 and one practice island:

- track shell and map entry;
- one complete notebook lesson;
- one image/pixel stage;
- one numeric visual stage;
- progress and reward integration;
- focused browser smoke test.

The vertical slice must prove that the track feels distinct from Python50
before the remaining nodes are authored.

### Phase 2 — core language path

Build Nodes 3–10 and their focused tests. Keep each node small enough to
finish in one sitting and keep the visual output observable.

### Phase 3 — abstraction and quality

Build Nodes 11–13, including functions, classes, testing, and debugging.
Add adversarial content checks for ambiguous prompts, copied source wording,
non-ASCII identifiers, and starter/solution equality.

### Phase 4 — final project and polish

Build Node 14, project choice flow, completion state, attribution, responsive
layout, visual assets, and end-to-end playthrough coverage.

## 9. Expected implementation surface

Names are provisional and must be confirmed against the current repo before
creation:

- `lessons/python-kids.html`
- `lessons/python-kids-map.js`
- `lessons/python-kids-state.js`
- `lessons/python-kids.css`
- `lessons/content/python-kids-curriculum.js`
- `lessons/content/python-kidsnode00.js` through `python-kidsnode14.js`
- `lessons/content/islandPYKIDS*.js` for optional islands
- `lessons/test-python-kids-saga.mjs`
- `lessons/test-python-kids-map.mjs`
- `lessons/PYTHON-KIDS-SOURCES.md`

Do not create these files until the vertical-slice design is approved by the
existing runtime contracts and a clean file-boundary review.

## 10. Validation gates

For every changed content file:

```bash
node lessons/check-voice-terms.mjs <changed-file>
node lessons/validate-content.mjs <changed-file>
```

For the track:

```bash
node lessons/test-python-kids-saga.mjs
node lessons/test-python-kids-map.mjs
node lessons/test-content-solutions.mjs
node lessons/test-prose-render.mjs
```

Before declaring the track complete, also verify the real browser path on
desktop and a short mobile viewport, including first load, resume, unlocks,
code execution, visual output, quiz behavior, and final project completion.

## 11. Attribution and release notes

The track should credit the source repository and clearly state that Magic
Dust is an original browser adaptation inspired by its topic sequence. Do not
present the Magic Dust lessons as the original author's chapters or imply
that micro:bit hardware is required.

If any source text, artwork, code, or exercise wording is reused beyond ideas
and topic ordering, review the Apache-2.0 requirements and preserve the
appropriate notices.

## 12. First execution task

The next implementation task is not the full course. It is to inspect the
current Python50 shell, the image/pixel stage, the notebook cell contract, and
the map/state patterns, then produce a Phase 1 file-level implementation plan
for Nodes 0–2 and the first practice island.

## 13. Kit and framework inventory

The kit layer is a first-class deliverable. Each kit has a learner-facing
Python API, a browser adapter, a renderer, resettable state, and a test surface.

### Device and stage foundation

**Virtual Device Kit**: reset, status, wait, simulated buttons, deterministic
event replay, and a stable replacement for the physical micro:bit.

**Stage Kit**: clear/reset the stage, show text/images/grids/effects, update
state visibly, and expose deterministic snapshots for grading and browser tests.

### Visual kits

**Pixel and Image Kit**: create images from rows or named patterns, read/change
pixels by row and column, draw, erase, mirror, shift, and animate images.

**Shape and Scene Kit**: place shapes or characters and change position, size,
color, visibility, and mood.

**Particle and Effect Kit**: create bounded particles, update one at a time,
render repeated output from loops, and support deterministic test seeds.

### Data and interaction kits

**Number and Measurement Kit**: score, energy, timers, counters, levels,
arithmetic visualizations, and boundary probes.

**Word and Dialogue Kit**: display messages, join words, format responses, and
show speaker, mood, and message as separate values.

**Input Kit**: deterministic preset input, simulated button/choice/number/text
input, and optional camera/gesture bridges where useful.

**Collection Kit**: named lists, tuples for fixed records, dictionaries for
lookup, inventory views, empty-list cases, and missing-key cases.

### Behavior and abstraction kits

**Control-Flow Kit**: branch previews, rule ordering, boundary probes, loop
counters, stop-condition traces, and infinite-loop protection.

**Music and Rhythm Kit**: notes, rests, tempo, short patterns, visual fallback,
and deterministic rhythm previews when audio is unavailable.

**Robot and Character Kit**: `robot.say(text)`, `robot.ask(prompt)`,
`robot.set_mood(name)`, `robot.remember(key, value)`, and `robot.recall(key)`.

**Function Kit**: named recipes, parameters, return-value visualization, call
traces, and composition of visual, sound, and character actions.

**Creature/Object Kit**: minimal classes, visible attributes and methods,
multiple instances, reset, and snapshots.

### Quality and project kits

**Test and Debug Kit**: expected-output checks, assertions, input/output tables,
deliberate bugs, learner-friendly errors, and execution traces.

**Flowchart and Planning Kit**: input/process/output cards, branches, loops,
stop conditions, and code-cell scaffolds.

**Project Builder Kit**: project templates, named state, reset behavior,
milestones, final explanations, and replayable demos.

## 14. Runtime architecture requirements

The student-facing API must remain pure Python. Kit implementations may use
the existing Python bridge and browser engine internally, but learner code must
not import JavaScript, access the DOM, or depend on a specific browser.

Every kit must define a public API, bridge serialization format, reset operation,
deterministic test mode, maximum state/output size, and a fallback when audio,
camera, or advanced effects are unavailable.

The vertical slice must prove that Python calls produce visible results, those
results can be asserted by content tests and observed in a browser, and
reset/rerun/resume do not leak stale kit state.

## 15. Source-to-Magic-Dust mapping

| Source family | Magic Dust layer | Learning arc |
| --- | --- | --- |
| Goals / Hello World | Device + Stage | command, run, output, prediction |
| Images | Pixel + Image | rows, columns, image data, transformation |
| Numbers | Number | values, variables, arithmetic, counters |
| Words | Word + Dialogue | strings, joining, formatting, messages |
| Word Lists | Collection | list operations, search, selection, display |
| Music | Music + Rhythm | sequence, repetition, timing, fallback output |
| Talking Robots | Robot + Input | state, lookup, response, memory |
| Basic I/O | Input + Stage | input contract, conversion, validation |
| Data Types | Number, Word, Collection | representation and type choices |
| Conditional Logic | Control Flow | rules, branches, boundaries |
| Lists/Tuples/Dictionaries/Loops | Collection + Control Flow | data plus repeated processing |
| Functions | Function | decomposition, parameters, return values |
| Classes | Creature/Object | stateful objects and methods |
| Unittest | Test + Debug | evidence, regression, repair |

The mapping is many-to-many: playful source projects become integrated kit
demonstrations while the underlying concepts remain sequenced for beginners.

## 16. Definition of done for the kit layer

The kit layer is complete only when each public API has a runnable learner cell,
a repair cell, a deterministic contract test, useful learner-facing failures,
correct reset/resume behavior, and desktop plus narrow-mobile browser proof.
The final project must combine at least four kits, and attribution plus the
original-adaptation boundary must be documented.

The next implementation task is not the full course. It is to inspect the
current Python50 shell, the image/pixel stage, the notebook cell contract, and
the map/state patterns, then produce a Phase 1 file-level implementation plan
for Nodes 0–2 and the first practice island.
