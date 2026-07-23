import { VISION_NODES, visionCompletionKey } from "./content/vision-curriculum.js?v=20260714-101425";

export function completedVisionIds(storage) {
  return new Set(VISION_NODES
    .filter(node => storage.getItem(visionCompletionKey(node.id)) === "1")
    .map(node => node.id));
}

export function previousReadyVisionNode(nodeId) {
  return VISION_NODES.filter(node => node.ready && node.id < nodeId).at(-1) || null;
}

export function visionStatus(node, mainProgress, completed) {
  if (!node) return "planned";
  if (completed.has(node.id)) return "done";
  if (!node.ready) return "planned";
  if (mainProgress < node.mainRequired) return "locked";
  const previous = previousReadyVisionNode(node.id);
  return !previous || completed.has(previous.id) ? "current" : "locked";
}
