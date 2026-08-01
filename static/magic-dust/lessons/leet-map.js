// Bản đồ các đảo LeetCode. Dùng lại dsa.css nên không thêm CSS mới.
//
// Khác bản đồ DSA: các đảo ở đây KHÔNG khoá lẫn nhau. Chúng là bài luyện tập
// theo chủ đề, ai muốn luyện nhị phân trước cũng được; chỉ có một cửa chung là
// tiến độ saga chính.
import { LEET_MAIN_REQUIRED, LEET_SETS, leetProblemCount, leetSetCompletionKey, leetSetPage } from "./content/leet-curriculum.js";

const TOAST_MS = 2800;
const mainProgress = Math.max(0, Number.parseInt(localStorage.getItem("magicdust.saga"), 10) || 0);
const unlocked = mainProgress >= LEET_MAIN_REQUIRED;
const done = new Set(LEET_SETS.filter(meta => localStorage.getItem(leetSetCompletionKey(meta.id)) === "1").map(meta => meta.id));

const gateLine = unlocked
  ? "Cổng đã mở. Chọn đảo nào cũng được — các đảo không khoá lẫn nhau."
  : `Bạn cần hoàn thành Node ${LEET_MAIN_REQUIRED - 1} của đường Python chính trước khi vào.`;

document.body.innerHTML = `<header class="dsahdr"><a href="./learning-portal.html">← CỔNG SAGA</a><div><b>ĐẤU TRƯỜNG LEETCODE</b><small>máy chấm dựng hàng trăm ca thử · đáp án viết sẵn không qua được</small></div><span>${done.size} / ${LEET_SETS.length}</span></header><main class="dsaworld"><section class="dsaintro"><p>${leetProblemCount} bài, chia theo chủ đề. Mỗi lần RUN, máy chấm sinh ca biên, ca ngẫu nhiên đối chiếu lời giải chậm mà chắc đúng, rồi ca lớn để đo cách làm.</p><strong>${gateLine}</strong></section><div class="dsachapter"><div class="dsasupport" id="leetsets"></div></div></main><div class="dsatoast" role="status"></div>`;

const host = document.getElementById("leetsets");
const toast = document.querySelector(".dsatoast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), TOAST_MS);
}

for (const meta of LEET_SETS) {
  const status = done.has(meta.id) ? "done" : unlocked ? "current" : "locked";
  const button = document.createElement("button");
  button.className = `dsacard support island ${status}`;
  button.innerHTML = `<span class="glyph">${status === "done" ? "✓" : meta.glyph}</span><span><b>${meta.title}</b><small>${meta.numbers.length} bài · ${meta.short}</small></span>`;
  button.onclick = () => {
    if (status === "locked") { showToast(`Hoàn thành Node ${LEET_MAIN_REQUIRED - 1} của đường Python chính để mở.`); return; }
    location.href = leetSetPage(meta);
  };
  host.appendChild(button);
}

const justSolved = sessionStorage.getItem("magicdust.leet.justSolved");
if (justSolved) {
  sessionStorage.removeItem("magicdust.leet.justSolved");
  showToast("Đảo vừa xong đã được ghi lại trên bản đồ.");
}
