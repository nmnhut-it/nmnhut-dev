import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = code(["from python_kids import show_value", "", "class Creature:", "    def __init__(self, name):", "        self.name = name", "        self.energy = 3", "", "    def charge(self, amount):", "        self.energy = self.energy + amount", "", "pet = Creature(\"Nova\")", "pet.charge(2)", "show_value(pet.name + \" has \" + str(pet.energy) + \" energy\")"]);
const solution = code(["from python_kids import show_value", "", "class Creature:", "    def __init__(self, name):", "        self.name = name", "        self.energy = 3", "", "    def charge(self, amount):", "        self.energy = self.energy + amount * 2", "", "pet = Creature(\"Nova\")", "pet.charge(2)", "show_value(pet.name + \" has \" + str(pet.energy) + \" energy\")"]);

export default pythonKidsLesson(12, {
  subtitle: "create objects with their own state",
  machineName: "THE CREATURE BUILDER",
  machineBlurb: "a workshop for making independent creatures with attributes and methods",
  cells: [
    { intro: { title: "✦ Build a Creature ✦", hook: "A class describes a kind of object. Each object keeps its own attributes, and methods describe actions that can change them.", art: "assets/old-computer.webp" } },
    { npc: "The class is the recipe. `pet` is one creature made from the recipe. Its `energy` belongs to that object and changes when `charge()` runs." },
    { code: starter, label: "kids_creature_demo.py", note: "INPUT: the name `Nova` and charge amount 2. PROCESS: create one object and add energy. OUTPUT: `Nova has 5 energy`.", expectOut: /^Nova has 5 energy$/ },
    { code: starter, solution, label: "kids_creature_edit.py", note: "Change the method so each charge amount is doubled before it is added. OUTPUT: `Nova has 7 energy`.", expectOut: /^Nova has 7 energy$/ },
    { checkpoint: { text: "A class defines shared structure. An object stores its own attribute values, and a method can read or change those values through `self`." } },
    { quiz: { title: "Find the object state", questions: [{ q: "Where is Nova's current energy stored?", a: ["`pet.energy`", "`Creature.energy()`", "the method name"], correct: 0 }] } },
    { remember: "Use a class when several objects need the same kind of behavior but must keep separate state." },
  ],
});
