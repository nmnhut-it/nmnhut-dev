import { pythonKidsPractice } from "./python-kids-builders.js?v=20260801-python-kids-full";

const starter = `from python_kids import robot_remember, robot_recall, robot_say

robot_remember("friend", "Pip")
robot_say("Hello, " + robot_recall("friend"))
`;
const solution = `from python_kids import robot_remember, robot_recall, robot_say

robot_remember("friend", "Pip")
robot_remember("mood", "curious")
robot_say(robot_recall("friend") + " is " + robot_recall("mood"))
`;

export default pythonKidsPractice({
  id: "islandPYKIDSROBOT",
  title: "Talking Robot Lab",
  subtitle: "give a character memory and a response",
  machineName: "ROBOT MEMORY LAB",
  machineBlurb: "a safe place to store, recall, and combine character state",
  cells: [
    { intro: { title: "Talking Robot Lab", hook: "A talking robot needs memory. Store named values, recall them later, and build a response from the recalled data.", art: "assets/old-computer.webp" } },
    { npc: "INPUT: two named values. PROCESS: store them, recall them, and join them into a sentence. OUTPUT: Pip is curious." },
    { code: starter, solution, label: "robot_memory_lab.py", note: "Store the mood under the key mood, then recall both keys to build the final response. OUTPUT: Robot: Pip is curious.", expectOut: /^Robot: Pip is curious$/ },
    { code: `from python_kids import robot_remember, robot_recall, robot_say\n\nrobot_remember("color", "blue")\nrobot_say(robot_recall("missing", "unknown"))\n`, solution: `from python_kids import robot_remember, robot_recall, robot_say\n\nrobot_remember("color", "blue")\nrobot_say(robot_recall("color"))\n`, label: "robot_memory_repair.py", note: "Recall the key that was actually stored. OUTPUT: Robot: blue.", expectOut: /^Robot: blue$/ },
    { quiz: { title: "Read the memory", questions: [{ q: "What does robot_recall(\"friend\") return after storing Pip under that key?", a: ["Pip", "friend", "nothing"], correct: 0 }] } },
    { remember: "Character memory is data with names. A response becomes meaningful when it uses values recalled from that memory." },
  ],
});
