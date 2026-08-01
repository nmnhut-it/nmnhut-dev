import { PYTHON_KIDS_NODES, pythonKidsCompletionKey, pythonKidsReward } from "./python-kids-curriculum.js";

export const code = lines => `${lines.join("\n")}\n`;

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
    cells,
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
