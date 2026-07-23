import { DSA_ISLANDS, DSA_MAIN_REQUIRED, DSA_NODES, DSA_TOWERS, dsaIslandCompletionKey, dsaNodeCompletionKey, dsaTowerCompletionKey } from "./content/dsa-curriculum.js";

const completed = (items, keyFor, storage) => new Set(items.filter(item => storage.getItem(keyFor(item.id)) === "1").map(item => item.id));
export const completedDsaNodeIds = storage => completed(DSA_NODES, dsaNodeCompletionKey, storage);
export const completedDsaIslandIds = storage => completed(DSA_ISLANDS, dsaIslandCompletionKey, storage);
export const completedDsaTowerIds = storage => completed(DSA_TOWERS, dsaTowerCompletionKey, storage);

export function isDsaNodeUnlocked(id, mainProgress, doneNodes) {
  return mainProgress >= DSA_MAIN_REQUIRED && Boolean(DSA_NODES[id]) && (id === 0 || doneNodes.has(id - 1));
}

export function dsaNodeStatus(id, mainProgress, doneNodes) {
  if (doneNodes.has(id)) return "done";
  return isDsaNodeUnlocked(id, mainProgress, doneNodes) ? "current" : "locked";
}

export function isDsaSupportUnlocked(meta, mainProgress, doneNodes) {
  return mainProgress >= DSA_MAIN_REQUIRED && doneNodes.has(meta.unlockAfter);
}

export function dsaSupportStatus(meta, mainProgress, doneNodes, doneSupport) {
  if (doneSupport.has(meta.id)) return "done";
  return isDsaSupportUnlocked(meta, mainProgress, doneNodes) ? "current" : "locked";
}

