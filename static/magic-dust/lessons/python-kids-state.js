import { PYTHON_KIDS_NODES, pythonKidsCompletionKey } from "./content/python-kids-curriculum.js";

export function completedPythonKidsIds(storage) {
  return new Set(PYTHON_KIDS_NODES.filter(node => storage.getItem(pythonKidsCompletionKey(node.id)) === "1").map(node => node.id));
}

export function isPythonKidsUnlocked(id, completed) {
  return Boolean(PYTHON_KIDS_NODES[id]) && (id === 0 || completed.has(id - 1));
}

export function pythonKidsStatus(id, completed) {
  if (completed.has(id)) return "done";
  return isPythonKidsUnlocked(id, completed) ? "current" : "locked";
}
