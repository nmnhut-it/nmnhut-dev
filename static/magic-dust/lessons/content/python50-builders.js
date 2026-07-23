import { PYTHON50_NODES, python50CompletionKey, python50Reward } from "./python50-curriculum.js";

function formatSourceExercises(exerciseIds) {
  return exerciseIds.map(exerciseId => `Bài ${exerciseId}`).join(", ");
}

export function python50Lesson(id, { subtitle, machineName, machineBlurb, cells }) {
  const meta = PYTHON50_NODES.find(node => node.id === id);
  if (!meta) throw new Error(`Không có metadata cho thử thách Python số ${id}`);
  const sourceLabel = formatSourceExercises(meta.sourceExercises);
  return {
    index: -1,
    pageLabel: `14 THỬ THÁCH TUYỂN CHỌN · CHẶNG ${String(id).padStart(2, "0")}`,
    sideIslandId: `python50-${String(id).padStart(2, "0")}`,
    completionKey: python50CompletionKey(id),
    justSolvedKey: "magicdust.python50.justSolved",
    returnPage: "./python50.html",
    kind: "python-challenge-saga",
    cameraFree: true,
    mainRequired: meta.mainRequired,
    reward: python50Reward(meta),
    title: meta.title,
    subtitle: `${subtitle} · chuyển thể từ ${sourceLabel} của TICA`,
    source: {
      exerciseIds: meta.sourceExercises,
      note: meta.sourceNote,
    },
    bundle: { art: "assets/rookie-bundle.webp", name: "TÚI THỬ THÁCH PYTHON" },
    machine: { art: "assets/old-computer.webp", name: machineName, blurb: machineBlurb },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    cells,
  };
}
