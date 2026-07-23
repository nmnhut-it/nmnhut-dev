import { python50Lesson } from "./python50-builders.js";

export const code = lines => `${lines.join("\n")}\n`;

export function makePython50Lesson(id, spec) {
  const makeQuiz = (title, item) => ({ quiz: { title, questions: [{ q: item[0], a: item[1], correct: item[2] ?? 0 }] } });
  const makeCode = task => ({
    code: task.starter,
    label: task.label,
    note: task.note,
    expectOut: task.expectOut,
    solution: task.solution || task.starter,
    ...(task.sampleInput === undefined ? {} : { sampleInput: task.sampleInput }),
  });
  const cells = [
    { intro: { title: `✦ ${spec.machineName} ✦`, hook: spec.intro, art: "assets/old-computer.webp" } },
    makeQuiz("Mở khóa kiến thức đã học", spec.prior),
    { npc: spec.teach },
    makeCode(spec.demo),
    makeCode(spec.fix),
    { checkpoint: { text: spec.check } },
    makeQuiz("Dùng quy tắc trong tình huống mới", spec.quiz),
    makeCode(spec.apply),
    { remember: spec.remember },
  ];
  return python50Lesson(id, {
    subtitle: spec.subtitle,
    machineName: spec.machineName,
    machineBlurb: spec.machineBlurb,
    cells,
  });
}
