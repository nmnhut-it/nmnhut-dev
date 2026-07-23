const modules = { old_computer: "../py/old_computer/__init__.py" };

export function listPracticeIsland({ id, title, subtitle, machineName, machineBlurb, hook, cells }) {
  return {
    index: -1,
    sideIslandId: id,
    title,
    subtitle,
    bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ QUÉT LIST" },
    machine: { art: "assets/future-machine.webp", name: machineName, blurb: machineBlurb },
    modules,
    cells: [
      { intro: { title: `✦ ${title} ✦`, hook, art: "assets/future-machine.webp" } },
      ...cells,
    ],
  };
}
