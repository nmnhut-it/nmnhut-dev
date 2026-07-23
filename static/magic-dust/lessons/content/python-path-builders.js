// Shared data builders for optional Python learning branches and their
// practice towers. The browser and validators both receive ordinary content
// objects; these helpers only remove repeated scaffolding from authored data.

export function codeTask({ floorNum, title, label, starter, note, solution, expectOut, sampleInput, explanation }) {
  const cell = {
    code: starter,
    label,
    note,
    solution,
    expectOut,
  };
  if (floorNum != null) cell.floorNum = floorNum;
  if (sampleInput != null) cell.sampleInput = sampleInput;
  if (floorNum != null && !Array.isArray(explanation)) {
    throw new Error(`${label} thiếu lời giải thích viết tay cho từng dòng`);
  }
  if (Array.isArray(explanation)) {
    const lines = solution.replace(/\r/g, "").split("\n");
    cell.solutionExplanation = explanation.map(({ match, text }) => {
      const line = lines.findIndex(sourceLine => sourceLine.includes(match));
      if (line < 0) throw new Error(`Không tìm thấy dòng giải thích "${match}" trong ${label}`);
      return { line: line + 1, text };
    });
    const explained = new Set(cell.solutionExplanation.map(item => item.line));
    const missing = lines
      .map((source, index) => ({ source: source.trim(), line: index + 1 }))
      .filter(item => item.source && !explained.has(item.line));
    if (missing.length) throw new Error(`${label} chưa giải thích các dòng: ${missing.map(item => item.line).join(", ")}`);
  }
  return title ? [{ npc: title }, cell] : [cell];
}

function bossCells(floor, boss, quiz) {
  return [
    { npc: `TẦNG ${floor} — ${boss.name} đang giữ cầu thang. Ba câu hỏi dưới đây dùng dữ liệu mới; hãy đọc code rồi mới chọn.` },
    { forge: { quiz } },
    {
      boss: {
        name: boss.name,
        sheet: { src: boss.sheet || "assets/tower-warden-10-sheet.webp" },
        art: boss.art || "assets/tower-warden-10.webp",
        glyph: boss.glyph || "◆",
        ko: true,
      },
      floorNum: floor,
    },
  ];
}

export function makeTower({ id, title, subtitle, intro, review, tasks, bosses }) {
  const cells = [
    { npc: intro },
    { npc: "Tháp có 10 tầng và 3 mạng. Tầng code chỉ cho dữ kiện, yêu cầu PROCESS và OUTPUT; sau khi xem đáp án, nút GIẢI THÍCH TỪNG DÒNG sẽ chỉ rõ công việc của từng dòng." },
    { quiz: { title: `Kiểm tra hành trang — ${title}`, questions: review } },
  ];

  for (let floor = 1; floor <= 10; floor += 1) {
    if (floor === 5 || floor === 10) {
      const boss = bosses[floor];
      cells.push(...bossCells(floor, boss, boss.quiz));
      continue;
    }
    const task = tasks.find(item => item.floorNum === floor);
    if (!task) throw new Error(`${id} thiếu dữ liệu tầng ${floor}`);
    cells.push(...codeTask(task));
  }

  return {
    index: -1,
    pageLabel: "THÁP LUYỆN",
    sideIslandId: id,
    title,
    subtitle,
    bundle: { art: "assets/rookie-bundle.webp", name: "CHÌA KHÓA LUYỆN TẬP" },
    machine: {
      art: "assets/old-computer.webp",
      name: "BÀN LUYỆN PHẢN XẠ",
      blurb: "mỗi tầng yêu cầu tự viết PROCESS, chạy đúng OUTPUT rồi mới mở đường đi tiếp",
    },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    cells,
  };
}

export function learningBranch({ id, title, subtitle, machineName, machineBlurb, cells }) {
  return {
    index: -1,
    pageLabel: "NHÁNH HỌC",
    sideIslandId: id,
    kind: "learning-branch",
    title,
    subtitle,
    bundle: { art: "assets/rookie-bundle.webp", name: "CUỘN CHÚ PYTHON" },
    machine: {
      art: "assets/old-computer.webp",
      name: machineName,
      blurb: machineBlurb,
    },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    cells,
  };
}
