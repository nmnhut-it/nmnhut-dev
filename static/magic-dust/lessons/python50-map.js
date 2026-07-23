import {
  PYTHON50_NODES,
  PYTHON50_SOURCE_TITLE,
  PYTHON50_SOURCE_URL,
  python50LessonPage,
} from "./content/python50-curriculum.js?v=20260713-233255";
import { completedPython50Ids, python50Status } from "./python50-state.js?v=20260713-233255";

const MAIN_PROGRESS_KEY = "magicdust.saga";
const JUST_SOLVED_KEY = "magicdust.python50.justSolved";
const JUST_AWARDED_KEY = "magicdust.collectible.justAwarded";
const MAP_BACKGROUND_URL = "assets/storybook/kotopia-world-v2.webp?v=20260713-224338";
const LEFT_NODE_PERCENT = 28;
const RIGHT_NODE_PERCENT = 72;
const FIRST_NODE_TOP_PERCENT = 5;
const NODE_VERTICAL_GAP_PERCENT = 6.5;
const TOAST_DURATION_MS = 3000;

const mainProgress = getMainProgress();
const completedNodeIds = completedPython50Ids(localStorage);
const nodePositions = PYTHON50_NODES.map(createNodePosition);

renderMapShell();
renderNodes();
showCompletionReward();

function getMainProgress() {
  return Math.max(0, Number.parseInt(localStorage.getItem(MAIN_PROGRESS_KEY), 10) || 0);
}

function createNodePosition(_, index) {
  return {
    x: index % 2 === 0 ? LEFT_NODE_PERCENT : RIGHT_NODE_PERCENT,
    y: FIRST_NODE_TOP_PERCENT + index * NODE_VERTICAL_GAP_PERCENT,
  };
}

function createPathData(positions) {
  return positions
    .map((position, index) => `${index === 0 ? "M" : "L"} ${position.x} ${position.y}`)
    .join(" ");
}

function renderMapShell() {
  document.title = "14 thử thách Python tuyển chọn · Magic Dust";
  document.body.innerHTML = `
    <div class="p50bg">
      <img src="${MAP_BACKGROUND_URL}" alt="" decoding="async" fetchpriority="high">
    </div>
    <header class="p50hdr">
      <a class="p50back" href="./learning-portal.html">← CỔNG SAGA</a>
      <div>
        <b>ĐƯỜNG ĐUA PYTHON</b>
        <small>14 chặng tuyển chọn từ bộ 50 bài tập</small>
      </div>
      <span>${completedNodeIds.size}/${PYTHON50_NODES.length}</span>
    </header>
    <main class="p50world">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="${createPathData(nodePositions)}"></path>
      </svg>
      <div id="p50nodes"></div>
      <aside class="p50credit">
        Các chặng là bản chuyển thể có hướng dẫn từ
        <a class="p50source" href="${PYTHON50_SOURCE_URL}" target="_blank" rel="noopener noreferrer">${PYTHON50_SOURCE_TITLE} · TICA ↗</a>
      </aside>
    </main>
    <div class="p50toast" role="status" aria-live="polite"></div>
  `;
}

function getGateText(node, index) {
  if (mainProgress < node.mainRequired) {
    return `Học xong Node ${String(node.mainRequired - 1).padStart(2, "0")} ở saga chính để mở`;
  }
  if (index > 0 && !completedNodeIds.has(index - 1)) {
    return "Hoàn thành chặng ngay trước đó để mở";
  }
  return "Bấm để bắt đầu";
}

function formatSourceLabel(sourceExercises) {
  return sourceExercises.map(exerciseId => `Bài ${exerciseId}`).join(", ");
}

function createNodeElement(node, index) {
  const status = python50Status(index, mainProgress, completedNodeIds);
  const position = nodePositions[index];
  const gateText = getGateText(node, index);
  const element = document.createElement("article");

  element.className = `p50node ${status}`;
  element.dataset.id = String(node.id);
  element.style.left = `${position.x}%`;
  element.style.top = `${position.y}%`;
  element.innerHTML = `
    <img src="${node.art}" alt="" loading="lazy" decoding="async">
    <div class="p50pin">${status === "done" ? "✓" : String(index).padStart(2, "0")}</div>
    <h2>${node.title}</h2>
    <p>${node.short}</p>
    <em>Chuyển thể từ ${formatSourceLabel(node.sourceExercises)}</em>
    <small>${gateText}</small>
  `;

  element.addEventListener("click", () => {
    if (status === "locked") {
      showToast(gateText);
      return;
    }
    location.href = python50LessonPage(node.id);
  });

  return element;
}

function renderNodes() {
  const host = document.getElementById("p50nodes");
  PYTHON50_NODES.forEach((node, index) => host.appendChild(createNodeElement(node, index)));
}

let toastTimer;

function showToast(message) {
  const toast = document.querySelector(".p50toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), TOAST_DURATION_MS);
}

function getRewardMessage() {
  const rawAward = sessionStorage.getItem(JUST_AWARDED_KEY);
  try {
    const award = JSON.parse(rawAward || "null");
    if (award?.track === "python50") {
      return `+${award.xp} XP · +${award.dust} Bụi thưởng · nhận ${award.collectible?.name || "một vật phẩm"}`;
    }
  } catch {
    // Dữ liệu thưởng hỏng không được chặn bản đồ; dùng thông báo hoàn thành bên dưới.
  }
  return "Chặng vừa hoàn thành đã sáng lên trên bản đồ.";
}

function showCompletionReward() {
  if (!sessionStorage.getItem(JUST_SOLVED_KEY)) return;
  sessionStorage.removeItem(JUST_SOLVED_KEY);
  showToast(getRewardMessage());
  sessionStorage.removeItem(JUST_AWARDED_KEY);
}
