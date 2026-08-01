import { code, pythonKidsLesson } from "./python-kids-builders.js?v=20260801-exercises";

const starter = code(["from python_kids import robot_say, robot_set_mood", "", "mood = \"calm\"", "robot_set_mood(mood)", "robot_say(\"I am ready.\")"]);
const solution = code(["from python_kids import robot_say, robot_set_mood", "", "mood = \"excited\"", "robot_set_mood(mood)", "robot_say(\"I am ready to explore!\")"]);

export default pythonKidsLesson(10, {
  subtitle: "give a character state and a response",
  machineName: "THE TALKING ROBOT",
  machineBlurb: "a character that can show a mood and speak a message",
  cells: [
    { intro: { title: "✦ The Talking Robot ✦", hook: "A robot becomes more interesting when its data describes a state. Change the state, then choose what it says.", art: "assets/old-computer.webp" } },
    { npc: "The mood is a value stored in `mood`. The kit displays that value and sends the message to the robot output." },
    { code: starter, label: "kids_robot_demo.py", note: "INPUT: the given mood `calm`. PROCESS: show the mood and send one message. OUTPUT: `mood: calm` and `Robot: I am ready.`.", expectOut: { all: [/^mood: calm$/, /^Robot: I am ready\.$/] } },
    { code: starter, solution, label: "kids_robot_edit.py", note: "Change the mood and message to the excited versions in the solution contract. OUTPUT includes `mood: excited` and `Robot: I am ready to explore!`.", expectOut: { all: [/^mood: excited$/, /^Robot: I am ready to explore!$/] } },
    { checkpoint: { text: "A character's mood is just data until a command uses it. Store the value, then pass it to a kit function that makes the state visible." } },
    { quiz: { title: "Find the state", questions: [{ q: "Which value is the robot's current mood in `mood = \"sleepy\"`?", a: ["sleepy", "mood", "robot"], correct: 0 }] } },
    { remember: "A talking character needs both state data and an action that turns the data into visible behavior." },
  ],
});
