import { DSA_ISLANDS, DSA_NODES, DSA_TOWERS, dsaIslandCompletionKey, dsaNodeCompletionKey, dsaReward, dsaTowerCompletionKey } from "./dsa-curriculum.js";

function classroomCells(cells) {
  return cells.map(cell => {
    if (typeof cell.note === "string") {
      return {
        ...cell,
        note: cell.note
          .replace(/^XƯỞNG[^\n:]*/u, "BÀI LUYỆN")
          .replace(/^TẦNG\s+(\d+)\s*·?[^\n]*/u, "BÀI $1"),
      };
    }
    return cell;
  });
}

function base(type, meta, { subtitle, machineName, machineBlurb, cells }) {
  const completionKey = type === "node" ? dsaNodeCompletionKey(meta.id) : type === "island" ? dsaIslandCompletionKey(meta.id) : dsaTowerCompletionKey(meta.id);
  const label = type === "node" ? `DSA · NODE ${String(meta.id).padStart(2, "0")}` : type === "island" ? "DSA · ĐẢO LUYỆN TẬP" : "DSA · THÁP TỔNG HỢP";
  return {
    index: -1,
    pageLabel: label,
    sideIslandId: `dsa-${type}-${meta.id}`,
    completionKey,
    justSolvedKey: "magicdust.dsa.justSolved",
    returnPage: "./dsa.html",
    kind: type === "node" ? "dsa-saga" : type === "island" ? "dsa-island" : "dsa-tower",
    cameraFree: true,
    reward: dsaReward(type, meta),
    title: meta.title,
    subtitle,
    bundle: { art: "assets/rookie-bundle.webp", name: type === "tower" ? "ẤN THÁP THUẬT TOÁN" : "TÚI DỤNG CỤ DSA" },
    machine: { art: "assets/old-computer.webp", name: machineName, blurb: machineBlurb },
    modules: { old_computer: "../py/old_computer/__init__.py" },
    cells: classroomCells(cells),
  };
}

export function dsaNode(id, config) {
  const meta = DSA_NODES.find(item => item.id === id);
  if (!meta) throw new Error(`Không có metadata cho DSA node ${id}`);
  return base("node", meta, config);
}

export function dsaIsland(id, config) {
  const meta = DSA_ISLANDS.find(item => item.id === id);
  if (!meta) throw new Error(`Không có metadata cho DSA island ${id}`);
  return base("island", meta, config);
}

export function dsaTower(id, config) {
  const meta = DSA_TOWERS.find(item => item.id === id);
  if (!meta) throw new Error(`Không có metadata cho DSA tower ${id}`);
  return base("tower", meta, config);
}
