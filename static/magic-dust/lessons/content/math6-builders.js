import { MATH6_NODES, math6CompletionKey, math6Reward } from "./math6-curriculum.js";

export function math6Lesson(id, { subtitle, machineName, machineBlurb, cells }) {
  const meta = MATH6_NODES.find(node => node.id === id);
  if (!meta) throw new Error(`Không có metadata cho bài Toán 6 số ${id}`);
  return {
    index: -1,
    pageLabel: `TOÁN 6 · BÀI ${String(id).padStart(2, "0")}`,
    sideIslandId: `math6-${String(id).padStart(2, "0")}`,
    completionKey: math6CompletionKey(id),
    justSolvedKey: "magicdust.math6.justSolved",
    returnPage: "./math6.html",
    kind: "math-saga",
    cameraFree: true,
    mainRequired: meta.mainRequired,
    reward: math6Reward(meta),
    title: meta.title,
    subtitle,
    bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ TOÁN" },
    machine: { art: "assets/old-computer.webp", name: machineName, blurb: machineBlurb },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    cells,
  };
}
