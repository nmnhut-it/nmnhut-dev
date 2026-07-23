import { MATH6_NODES, math6CompletionKey } from "./content/math6-curriculum.js";

export function completedMath6Ids(storage) {
  return new Set(MATH6_NODES.filter(node => storage.getItem(math6CompletionKey(node.id)) === "1").map(node => node.id));
}

export function isMath6Unlocked(index, mainProgress, completed) {
  const node = MATH6_NODES[index];
  if (!node || mainProgress < node.mainRequired) return false;
  return index === 0 || completed.has(MATH6_NODES[index - 1].id);
}

export function math6Status(index, mainProgress, completed) {
  if (completed.has(MATH6_NODES[index]?.id)) return "done";
  return isMath6Unlocked(index, mainProgress, completed) ? "current" : "locked";
}

