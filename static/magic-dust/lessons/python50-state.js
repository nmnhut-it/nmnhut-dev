import { PYTHON50_NODES, python50CompletionKey } from "./content/python50-curriculum.js?v=20260713-233255";

export function completedPython50Ids(storage) {
  return new Set(PYTHON50_NODES.filter(node => storage.getItem(python50CompletionKey(node.id)) === "1").map(node => node.id));
}

export function isPython50Unlocked(id, mainProgress, completed) {
  const node = PYTHON50_NODES[id];
  return Boolean(node) && mainProgress >= node.mainRequired && (id === 0 || completed.has(id - 1));
}

export function python50Status(id, mainProgress, completed) {
  if (completed.has(id)) return "done";
  return isPython50Unlocked(id, mainProgress, completed) ? "current" : "locked";
}
