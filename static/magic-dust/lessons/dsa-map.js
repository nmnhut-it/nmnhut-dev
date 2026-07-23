import { DSA_CHAPTERS, DSA_ISLANDS, DSA_MAIN_REQUIRED, DSA_NODES, DSA_TOWERS, dsaLessonPage } from "./content/dsa-curriculum.js";
import { completedDsaIslandIds, completedDsaNodeIds, completedDsaTowerIds, dsaNodeStatus, dsaSupportStatus } from "./dsa-state.js";

const mainProgress = Math.max(0, Number.parseInt(localStorage.getItem("magicdust.saga"), 10) || 0);
const doneNodes = completedDsaNodeIds(localStorage);
const doneIslands = completedDsaIslandIds(localStorage);
const doneTowers = completedDsaTowerIds(localStorage);

document.body.innerHTML = `<header class="dsahdr"><a href="./learning-portal.html">← CỔNG SAGA</a><div><b>CẤU TRÚC DỮ LIỆU VÀ THUẬT TOÁN</b><small>chọn cách lưu · tự viết cách xử lý · kiểm thử · so sánh số bước</small></div><span>${doneNodes.size} / ${DSA_NODES.length}</span></header><main class="dsaworld"><section class="dsaintro"><p>Saga này mở sau Node 20 của đường Python chính.</p><strong>${mainProgress >= DSA_MAIN_REQUIRED ? "Cổng DSA đã mở. Bắt đầu từ Node 00." : "Bạn cần hoàn thành Node 20 về dictionary trước khi vào cổng DSA."}</strong></section><div id="dsachapters"></div></main><div class="dsatoast" role="status"></div>`;

const host = document.getElementById("dsachapters");
const toast = document.querySelector(".dsatoast"); let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2800); }
function openCard(type, meta, status) {
  if (status === "locked") { showToast(type === "node" ? "Hoàn thành node ngay trước đó để mở." : `Hoàn thành Node ${String(meta.unlockAfter).padStart(2, "0")} để mở.`); return; }
  location.href = dsaLessonPage(type, meta.id);
}

for (const chapter of DSA_CHAPTERS) {
  const nodes = DSA_NODES.filter(item => item.chapterId === chapter.id);
  const islands = DSA_ISLANDS.filter(item => item.chapterId === chapter.id);
  const towers = DSA_TOWERS.filter(item => item.chapterId === chapter.id);
  const section = document.createElement("section"); section.className = "dsachapter";
  section.innerHTML = `<div class="chapterhead"><span>CHƯƠNG ${chapter.id + 1}</span><div><h1>${chapter.title}</h1><p>${chapter.subtitle}</p></div></div><div class="dsanodes"></div><div class="supportlabel">ĐẢO LUYỆN TẬP VÀ THÁP ÔN TẬP</div><div class="dsasupport"></div>`;
  const nodeHost = section.querySelector(".dsanodes");
  for (const meta of nodes) {
    const status = dsaNodeStatus(meta.id, mainProgress, doneNodes); const button = document.createElement("button");
    button.className = `dsacard node ${status}`; button.innerHTML = `<span class="number">${status === "done" ? "✓" : String(meta.id).padStart(2, "0")}</span><span><b>${meta.title}</b><small>${meta.short}</small></span>`;
    button.onclick = () => openCard("node", meta, status); nodeHost.appendChild(button);
  }
  const supportHost = section.querySelector(".dsasupport");
  for (const meta of [...islands, ...towers]) {
    const type = islands.includes(meta) ? "island" : "tower"; const done = type === "island" ? doneIslands : doneTowers;
    const status = dsaSupportStatus(meta, mainProgress, doneNodes, done); const button = document.createElement("button");
    button.className = `dsacard support ${type} ${status}`; button.innerHTML = `<span class="glyph">${status === "done" ? "✓" : meta.glyph}</span><span><b>${meta.title}</b><small>${meta.short}</small></span>`;
    button.onclick = () => openCard(type, meta, status); supportHost.appendChild(button);
  }
  host.appendChild(section);
}

const justSolved = sessionStorage.getItem("magicdust.dsa.justSolved");
if (justSolved) { sessionStorage.removeItem("magicdust.dsa.justSolved"); showToast("Nội dung vừa hoàn thành đã được ghi lại trên bản đồ DSA."); }

