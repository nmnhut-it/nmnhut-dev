import { VISION_BATCHES, VISION_NODES, visionLessonPage } from "./content/vision-curriculum.js?v=20260714-101425";
import { completedVisionIds, visionStatus } from "./vision-state.js?v=20260714-101425";

const ROOT_ID = "vision-map";
const MAIN_PROGRESS_KEY = "magicdust.saga";
const FIRST_NODE_TOP_PERCENT = 8;
const NODE_VERTICAL_GAP_PERCENT = 6.65;
const LEFT_NODE_PERCENT = 28;
const RIGHT_NODE_PERCENT = 72;
const JUST_SOLVED_KEY = "magicdust.vision.justSolved";
const JUST_AWARDED_KEY = "magicdust.collectible.justAwarded";

const mainProgress = Math.max(0, Number.parseInt(localStorage.getItem(MAIN_PROGRESS_KEY), 10) || 0);
const completedNodeIds = completedVisionIds(localStorage);
const readyNodeCount = VISION_NODES.filter(node => node.ready).length;
const positions = VISION_NODES.map((_, index) => ({
  x: index % 2 === 0 ? LEFT_NODE_PERCENT : RIGHT_NODE_PERCENT,
  y: FIRST_NODE_TOP_PERCENT + index * NODE_VERTICAL_GAP_PERCENT,
}));

function getBatch(batchId) {
  return VISION_BATCHES.find(batch => batch.id === batchId);
}

function createPathData() {
  return positions.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function renderNode(node, index) {
  const position = positions[index];
  const status = visionStatus(node, mainProgress, completedNodeIds);
  const prerequisite = status === "done"
    ? "Đã hoàn thành · có thể học lại"
    : status === "current"
      ? "Sẵn sàng · project +100 XP"
      : status === "planned"
        ? "Đang xây nội dung và art"
        : `Cần học tới Node ${String(node.mainRequired - 1).padStart(2, "0")} ở saga chính`;
  const marker = node.art
    ? `<span class="vision-location"><img src="${node.art}" alt=""><b>${String(node.id).padStart(2, "0")}</b></span>`
    : `<span class="vision-beacon"><b>${String(node.id).padStart(2, "0")}</b><i></i></span>`;
  return `<button class="vision-node ${status}${node.art ? " has-location-art" : ""}" type="button" data-node="${node.id}" data-status="${status}" style="left:${position.x}%;top:${position.y}%" aria-label="${status === "current" || status === "done" ? "Mở bài" : "Xem lộ trình"} ${node.title}">
    ${marker}
    <span class="vision-label"><small>BATCH ${node.batch} · ${status === "current" ? "MỞ" : status === "done" ? "XONG" : status === "locked" ? "KHÓA" : "ĐANG DỰNG"}</small><strong>${node.title}</strong><em>${prerequisite}</em></span>
  </button>`;
}

function renderShell() {
  document.getElementById(ROOT_ID).innerHTML = `<div class="vision-sky" aria-hidden="true"></div>
    <header class="vision-hud">
      <a href="./learning-portal.html">← Đại sảnh cổng</a>
      <div><b>MẮT MÁY KOTOPIA</b><small>${VISION_NODES.length} trạm · ${VISION_BATCHES.length} batch</small></div>
      <span>VISION ${completedNodeIds.size}/${readyNodeCount}</span>
    </header>
    <section class="vision-intro">
      <small>XƯỞNG QUANG HỌC TRONG TRUYỆN</small>
      <h1>Học nguyên lý trước, mở OpenCV sau</h1>
      <p>Mười bốn phòng lab đã sẵn sàng. Mỗi trạm mở theo công cụ Python bạn học ở saga chính và theo thứ tự nghiên cứu của Mắt Máy.</p>
    </section>
    <section class="vision-world" aria-label="Lộ trình 14 node Computer Vision">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${createPathData()}"></path></svg>
      ${VISION_NODES.map(renderNode).join("")}
    </section>
    <aside class="vision-journal" aria-live="polite">
      <small>CHỌN MỘT TRẠM TRÊN BẢN ĐỒ</small>
      <h2>Máy ảnh không phải hộp đen</h2>
      <p>Từ camera lỗ kim, ma trận pixel và kernel tới template matching, NMS, OpenCV, phối cảnh và chuyển động.</p>
    </aside>`;
}

function showNode(nodeId) {
  const node = VISION_NODES[nodeId];
  const journal = document.querySelector(".vision-journal");
  if (!node || !journal) return;
  const batch = getBatch(node.batch);
  const status = visionStatus(node, mainProgress, completedNodeIds);
  const statusText = status === "locked"
    ? `Trạm này cần tiến độ saga chính tới Node ${String(node.mainRequired - 1).padStart(2, "0")} và hoàn thành trạm Mắt Máy trước đó.`
    : status === "done"
      ? "Bạn đã nhận phần thưởng; project vẫn mở để chạy lại và thử phương án khác."
      : "Project đã sẵn sàng · hoàn thành để nhận 100 XP và collectible của trạm.";
  journal.innerHTML = `<small>BATCH ${batch.id} · ${batch.title}</small><h2>${node.title}</h2><p>${node.mechanism}.</p><b>${statusText}</b>`;
}

function showCompletionReward() {
  if (!sessionStorage.getItem(JUST_SOLVED_KEY)) return;
  sessionStorage.removeItem(JUST_SOLVED_KEY);
  const journal = document.querySelector(".vision-journal");
  try {
    const award = JSON.parse(sessionStorage.getItem(JUST_AWARDED_KEY) || "null");
    if (award?.track === "vision") {
      journal.innerHTML = `<small>TRẠM ${String(award.nodeId).padStart(2, "0")} ĐÃ SÁNG</small><h2>Nhận ${award.collectible?.name || "bảo bối Mắt Máy"}</h2><p>+${award.xp} XP · +${award.dust} Bụi thưởng. Bạn có thể học lại project này bất cứ lúc nào.</p>`;
    }
  } finally {
    sessionStorage.removeItem(JUST_AWARDED_KEY);
  }
}

renderShell();
document.querySelectorAll("[data-node]").forEach(button => {
  button.addEventListener("click", () => {
    const nodeId = Number(button.dataset.node);
    if (button.dataset.status === "current" || button.dataset.status === "done") {
      location.href = visionLessonPage(nodeId);
      return;
    }
    showNode(nodeId);
  });
});
showCompletionReward();
