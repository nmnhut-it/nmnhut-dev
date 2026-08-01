# Python for Kids — Source and Adaptation Notes

## Primary source

- Repository: <https://github.com/mytechnotalent/Python-For-Kids>
- Author/organization: `mytechnotalent`
- Repository license: Apache License 2.0
- Format: an online MicroPython course for children using a BBC micro:bit

The source repository presents a 15-chapter sequence covering introductory
goals, Hello World, images, numbers, words, word lists, music, talking robots,
basic I/O, data types, conditional logic, lists/tuples/dictionaries/loops,
functions, classes, and unittest. It also contains playful project variants
such as `FUN With Images`, `FUN With Numbers`, `FUN With Words`, `FUN With Word
Lists`, `FUN With Music`, and `FUN With Talking Robots`.

## What Magic Dust uses

Magic Dust uses the source's topic sequence and project-oriented teaching idea
as curriculum inspiration. The Magic Dust track is an original browser
adaptation with new English explanations, story, examples, code cells, tests,
visual stages, API names, and projects.

The track does not require a BBC micro:bit. Learners run pure Python in the
existing Magic Dust Pyodide notebook runtime.

## Source-to-track mapping

| Source topic | Magic Dust node or kit |
| --- | --- |
| Hello World / basic goals | Node 0 — Meet the Tiny Machine |
| Images | Node 1 — Paint with Pixels; Pixel Pattern Lab |
| Numbers and data types | Node 2 — Number Charms |
| Words | Node 3 — Word Charms; Word Mixer Lab |
| Basic I/O | Node 4 — The Input Gate |
| Conditional logic | Node 5 — Choose a Path |
| Lists | Node 6 — The Memory Chest |
| Dictionaries | Node 7 — The Name Cabinet |
| Loops | Node 8 — Repeat the Spell |
| Music | Node 9 — The Rhythm Room |
| Talking robots | Node 10 — The Talking Robot; Talking Robot Lab |
| Functions | Node 11 — Spell Recipes; Function Forge |
| Classes | Node 12 — Build a Creature |
| Unittest and debugging | Node 13 — The Bug Laboratory |
| Integrated project | Node 14 — The Talking Machine |

## Runtime adaptations

| Physical/source feature | Browser implementation |
| --- | --- |
| micro:bit display | `show_pixels()` and the existing pixel/image stage |
| buttons and sensor input | deterministic notebook input, with future gesture bridges |
| music output | deterministic visual note output through `play_note()`; audio can be layered on later |
| robot speech | `robot_say()` through the lesson terminal |
| robot memory | `robot_remember()` and `robot_recall()` in the Python kit |
| device state | resettable Python kit state and notebook progress state |
| unittest | Python assertions, expected-output contracts, and repair cells |

## Magic Dust implementation surface

- `py/python_kids/__init__.py` — learner-facing browser kit API
- `lessons/content/python-kids-curriculum.js` — authoritative node metadata
- `lessons/content/python-kidsnode00.js` through `python-kidsnode14.js` — core path
- `lessons/content/islandPYKID*.js` — optional practice kits
- `lessons/python-kids*.html`, `python-kids-map.js`, `python-kids-state.js` — track shell
- `lessons/test-python-kids-saga.mjs` — focused structural/content contract test

## Attribution boundary

Magic Dust should describe this track as “an original browser adaptation
inspired by Python for Kids.” It must not imply that the source authors created
the Magic Dust lessons, runtime, visual assets, or story.

If future work copies source code, text, artwork, or substantial exercise
wording, review the Apache-2.0 notice requirements and preserve the relevant
copyright and license notices. The current track intentionally uses original
lesson prose and examples rather than copying source lesson text.
