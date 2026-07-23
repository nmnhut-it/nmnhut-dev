export function makePracticeCells({ introTitle, introHook, reviewTitle, reviewQuestions, definition, tasks, checkpoint, quizTitle, quizQuestions, remember }) {
  if (!Array.isArray(tasks) || tasks.length < 4) throw new Error("Đảo DSA cần ít nhất bốn bài code");
  return [
    { intro: { title: introTitle, hook: introHook, art: "assets/old-computer.webp" } },
    { quiz: { title: reviewTitle, questions: reviewQuestions } },
    { npc: definition },
    ...tasks.slice(0, 2),
    { checkpoint: { text: checkpoint } },
    { quiz: { title: quizTitle, questions: quizQuestions } },
    ...tasks.slice(2),
    { remember },
  ];
}

export function makeTowerCells({ introTitle, introHook, reviewTitle, reviewQuestions, tasks, checkpoint, quizTitle, quizQuestions, remember }) {
  if (!Array.isArray(tasks) || tasks.length < 8) throw new Error("Tháp DSA cần ít nhất tám tầng code");
  return [
    { intro: { title: introTitle, hook: introHook, art: "assets/old-computer.webp" } },
    { quiz: { title: reviewTitle, questions: reviewQuestions } },
    ...tasks.slice(0, 4),
    { checkpoint: { text: checkpoint } },
    { quiz: { title: quizTitle, questions: quizQuestions } },
    ...tasks.slice(4),
    { remember },
  ];
}
