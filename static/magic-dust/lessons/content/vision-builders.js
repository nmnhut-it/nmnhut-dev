import {
  VISION_NODES,
  visionCompletionKey,
  visionReward,
} from "./vision-curriculum.js?v=20260714-101425";
import {
  VISION_PROJECTS,
  deckForVisionProject,
} from "./vision-projects.js?v=20260714-101425";

const VISION_SOURCE_URL = "https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html";
const DEFAULT_MACHINE_ART = "assets/storybook/side-islands/storybook-island-camera-lit.webp";

export function visionLesson(id, {
  subtitle,
  machineName,
  machineBlurb,
  cells,
  sourceTitle = "OpenCV · Camera Calibration and 3D Reconstruction",
  sourceUrl = VISION_SOURCE_URL,
  pythonPackages = [],
}) {
  const meta = VISION_NODES.find(node => node.id === id);
  if (!meta?.ready) throw new Error(`Bài Mắt Máy số ${id} chưa sẵn sàng`);
  return {
    index: -1,
    pageLabel: `MẮT MÁY KOTOPIA · TRẠM ${String(id).padStart(2, "0")}`,
    sideIslandId: `vision-${String(id).padStart(2, "0")}`,
    completionKey: visionCompletionKey(id),
    justSolvedKey: "magicdust.vision.justSolved",
    returnPage: "./vision.html",
    kind: "vision-saga",
    cameraFree: true,
    mainRequired: meta.mainRequired,
    reward: visionReward(meta),
    title: meta.title,
    subtitle,
    source: {
      title: sourceTitle,
      url: sourceUrl,
    },
    bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ QUANG HỌC" },
    machine: {
      art: meta.art || DEFAULT_MACHINE_ART,
      name: machineName,
      blurb: machineBlurb,
    },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    pythonPackages,
    cells,
  };
}

export function buildVisionProjectLesson(id) {
  const config = VISION_PROJECTS[id];
  if (!config) throw new Error(`Vision project ${id} is not defined`);
  const cells = [
    {
      intro: {
        title: `VISION LAB ${String(id).padStart(2, "0")} · ${VISION_NODES[id].title.toUpperCase()}`,
        hook: `Nhiệm vụ nghiên cứu: ${config.subtitle}.`,
        art: VISION_NODES[id].art || DEFAULT_MACHINE_ART,
      },
    },
    { npc: config.premise },
    { widget: "vision-lab", deck: deckForVisionProject(id) },
    { npc: "Ba slide đã nối mô hình với tiêu chí kiểm chứng. Bây giờ bạn dùng Python hoàn thành phép đo và bảo vệ kết luận bằng kết quả in ra." },
    {
      code: config.starter,
      label: config.label,
      note: config.note,
      expectOut: config.expectOut,
      solution: config.solution,
    },
    { checkpoint: { text: config.checkpoint } },
    { quiz: { title: `Kiểm tra dự án ${String(id).padStart(2, "0")}`, questions: config.questions } },
    { remember: config.remember },
  ];
  return visionLesson(id, {
    subtitle: config.subtitle,
    machineName: config.machineName,
    machineBlurb: config.machineBlurb,
    sourceTitle: config.sourceTitle,
    sourceUrl: config.sourceUrl,
    pythonPackages: config.pythonPackages,
    cells,
  });
}
