import { MATH6_NODES, math6LessonPage, mainLessonBeforeMathNode } from "./content/math6-curriculum.js";
import { completedMath6Ids, math6Status } from "./math6-state.js";

const mainProgress = Math.max(0, Number.parseInt(localStorage.getItem("magicdust.saga"), 10) || 0);
const completed = completedMath6Ids(localStorage);
const positions = MATH6_NODES.map((node, index) => ({ x: index % 2 ? 72 : 28, y: 6 + index * (88 / Math.max(1, MATH6_NODES.length - 1)) }));
const path = positions.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");

document.body.innerHTML = `
  <div class="mathbg"><img src="assets/storybook/kotopia-world-v2.webp?v=20260713-224338" alt="" decoding="async" fetchpriority="high"></div>
  <header class="mathhdr"><a href="./learning-portal.html">← CỔNG SAGA</a><div><b>TOÁN 6 × PYTHON</b><small>luyện Toán bằng những công cụ đã học</small></div><span>${completed.size} / ${MATH6_NODES.length}</span></header>
  <main class="mathworld">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${path}"></path></svg>
    <div id="mathnodes"></div>
  </main>
  <div class="mathtoast" role="status"></div>`;

const host = document.getElementById("mathnodes");
const toast = document.querySelector(".mathtoast");
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600); }

MATH6_NODES.forEach((node, index) => {
  const status = math6Status(index, mainProgress, completed);
  const el = document.createElement("article");
  el.className = `mathnode ${status}`;
  el.dataset.id = String(node.id);
  el.style.left = `${positions[index].x}%`;
  el.style.top = `${positions[index].y}%`;
  const gateText = mainProgress < node.mainRequired
    ? `Học xong Node ${String(mainLessonBeforeMathNode(node)).padStart(2, "0")} ở saga chính để mở`
    : index > 0 && !completed.has(index - 1) ? "Hoàn thành bài Toán ngay trước đó để mở" : "Bấm để bắt đầu";
  el.innerHTML = `<img src="${node.art}" alt=""><div class="mathpin">${status === "done" ? "✓" : String(index).padStart(2, "0")}</div><h2>${node.title}</h2><p>${node.short}</p><small>${gateText}</small>`;
  el.onclick = () => {
    if (status === "locked") { showToast(gateText); return; }
    location.href = math6LessonPage(node.id);
  };
  host.appendChild(el);
});

const justSolved = sessionStorage.getItem("magicdust.math6.justSolved");
const justAwarded = sessionStorage.getItem("magicdust.collectible.justAwarded");
if (justSolved) {
  sessionStorage.removeItem("magicdust.math6.justSolved");
  sessionStorage.removeItem("magicdust.collectible.justAwarded");
  let message = "Bài Toán vừa hoàn thành đã sáng lên trên bản đồ.";
  try {
    const award = JSON.parse(justAwarded || "null");
    if (award?.track === "math6") message = `+${award.xp} XP · +${award.dust} Bụi thưởng · nhận ${award.collectible?.name || "một vật phẩm"}`;
  } catch { /* keep the completion message */ }
  showToast(message);
}
