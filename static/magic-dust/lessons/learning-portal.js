import { MATH6_NODES, math6Reward } from "./content/math6-curriculum.js?v=20260713-233255";
import { PYTHON50_NODES, python50Reward } from "./content/python50-curriculum.js?v=20260713-233255";
import { VISION_BATCHES, VISION_NODES, visionReward } from "./content/vision-curriculum.js?v=20260714-101425";
import { DSA_ISLANDS, DSA_NODES, DSA_TOWERS, dsaReward } from "./content/dsa-curriculum.js";
import {
  claimCollectibleGift,
  collectibleSnapshot,
  momentumDust,
  syncCompletedRewards,
} from "./engine/collectible-store.js?v=20260713-233255";

const PORTAL_ROOT_ID = "portal";
const MAIN_PROGRESS_KEY = "magicdust.saga";
const MIN_PORTAL_PROGRESS = 5;
const TOAST_DURATION_MS = 4_200;
const MODAL_IDS = Object.freeze({
  album: "album-modal",
  gifts: "gift-modal",
});
const PORTAL_CONFIGS = Object.freeze([
  {
    track: "math6",
    title: "Toán 6 × Python",
    subtitle: "Số, hình, dữ liệu và đối xứng",
    href: "./math6.html",
    total: MATH6_NODES.length,
    tone: "math",
    position: "first",
  },
  {
    track: "python50",
    title: "Đường Đua Python",
    subtitle: "14 chặng chuyển thể từ bộ 50 bài TICA",
    href: "./python50.html",
    total: PYTHON50_NODES.length,
    tone: "challenge",
    position: "second",
  },
  {
    track: "vision",
    title: "Mắt Máy Kotopia",
    subtitle: `${VISION_NODES.length} chặng từ pinhole tới OpenCV`,
    href: "./vision.html",
    total: VISION_NODES.length,
    readyTotal: VISION_NODES.filter(node => node.ready).length,
    tone: "vision",
    position: "third",
    batchLabel: `Lộ trình ${VISION_BATCHES.length} batch`,
  },
  {
    track: "dsa",
    title: "Cấu trúc Dữ liệu và Thuật toán",
    subtitle: `${DSA_NODES.length} node · ${DSA_ISLANDS.length} đảo · ${DSA_TOWERS.length} tháp`,
    href: "./dsa.html",
    total: DSA_NODES.length + DSA_ISLANDS.length + DSA_TOWERS.length,
    tone: "dsa",
    position: "fourth",
    requiresMain: 21,
  },
]);
const REWARD_RECORDS = Object.freeze([
  ...MATH6_NODES.map(math6Reward),
  ...PYTHON50_NODES.map(python50Reward),
  ...VISION_NODES.filter(node => node.ready).map(visionReward),
  ...DSA_NODES.map(meta => dsaReward("node", meta)),
  ...DSA_ISLANDS.map(meta => dsaReward("island", meta)),
  ...DSA_TOWERS.map(meta => dsaReward("tower", meta)),
]);

let toastTimer;

function getMainProgress() {
  return Math.max(0, Number.parseInt(localStorage.getItem(MAIN_PROGRESS_KEY), 10) || 0);
}

function countCompletedNodes(track) {
  return REWARD_RECORDS.filter(record => (
    record.track === track && localStorage.getItem(record.completionKey) === "1"
  )).length;
}

function getProgressPercent(done, total) {
  return total > 0 ? Math.round(done / total * 100) : 0;
}

function renderPortal(config) {
  const isVision = config.track === "vision";
  const isLocked = getMainProgress() < (config.requiresMain || 0);
  const done = countCompletedNodes(config.track);
  const actionLabel = done > 0 ? "Đi tiếp" : "Bắt đầu";
  const progressTotal = isVision ? config.readyTotal : config.total;
  const progressPercent = getProgressPercent(done, progressTotal);
  const portalLabel = isLocked ? "Xem điều kiện mở" : isVision ? (done > 0 ? "Đi tiếp bản đồ" : "Mở bản đồ") : actionLabel;
  return `<a class="saga-card world-portal ${config.tone} ${config.position}" href="${config.href}" aria-label="${portalLabel}: ${config.title}">
    <span class="portal-vortex" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="portal-level">${isVision ? `${done}/${config.readyTotal} lab` : `${done}/${config.total}`}</span>
    <span class="portal-plaque">
      <small>${isLocked ? "MỞ SAU NODE 20" : isVision ? "14 PHÒNG LAB ĐÃ SẴN SÀNG" : "CỔNG ĐANG MỞ"}</small>
      <h2>${config.title}</h2>
      <p>${config.subtitle}</p>
      <span class="rune-progress" aria-label="Đã hoàn thành ${done} trên ${progressTotal} bài đang mở"><i style="width:${progressPercent}%"></i></span>
      <span class="portal-cta">${portalLabel} <span aria-hidden="true">→</span></span>
    </span>
  </a>`;
}

function renderAlbumItems(snapshot) {
  const earnedKeys = new Set(snapshot.earned.map(record => `${record.track}.${record.nodeId}`));
  return REWARD_RECORDS.map(record => {
    const earned = earnedKeys.has(`${record.track}.${record.nodeId}`);
    const glyph = earned ? record.collectible.glyph : "?";
    const name = earned ? record.collectible.name : "Chưa khám phá";
    return `<article class="collectible ${earned ? "" : "locked"}">
      <b aria-hidden="true">${glyph}</b><small>${name}</small>
    </article>`;
  }).join("");
}

function renderGiftItems(snapshot) {
  return snapshot.gifts.map(gift => {
    const claimAction = gift.code
      ? `<code>${gift.code}</code>`
      : gift.unlocked
        ? `<button type="button" data-gift="${gift.id}">Mở phiếu</button>`
        : "";
    return `<article class="gift ${gift.unlocked ? "" : "locked"}">
      <div class="glyph" aria-hidden="true">${gift.glyph}</div>
      <strong>${gift.name}</strong><small>${gift.requiredXp} XP</small>${claimAction}
    </article>`;
  }).join("");
}

function getNextGiftLabel(snapshot) {
  const nextGift = snapshot.gifts.find(gift => !gift.unlocked);
  if (!nextGift) return "Đã mở mọi mốc quà";
  const remainingXp = Math.max(0, nextGift.requiredXp - snapshot.totalXp);
  return `Còn ${remainingXp} XP tới mốc mới`;
}

function renderGameRoom(snapshot, momentum) {
  const unlockedGiftCount = snapshot.gifts.filter(gift => gift.unlocked).length;
  return `<div class="game-room">
    <div class="ambient" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <header class="game-hud">
      <a class="hud-back" href="./index.html"><span aria-hidden="true">←</span><span>Saga chính</span></a>
      <div class="wallet" aria-label="Ví phần thưởng">
        <span class="wallet-orb"><span class="orb-icon" aria-hidden="true">✦</span><b>${snapshot.totalXp} XP</b></span>
        <span class="wallet-orb dust"><span class="orb-icon" aria-hidden="true">◆</span><b>${snapshot.totalDust} Bụi</b></span>
      </div>
    </header>
    <div class="room-heading"><span>ĐẠI SẢNH KOTOPIA</span><h1>Bước vào một cánh cổng</h1></div>
    <section class="portal-stage" aria-label="Các saga có thể khám phá">
      <div class="portal-panorama">
        <img class="kotopia-seal" src="assets/storybook/kotopia-seal-v1.webp?v=20260722-1305" alt="" aria-hidden="true" decoding="async" fetchpriority="high">
        <div class="portal-lane">${PORTAL_CONFIGS.map(renderPortal).join("")}</div>
        <div class="swipe-hint" aria-hidden="true">← vuốt để đi dọc đại sảnh →</div>
      </div>
    </section>
    <aside class="pip-guide" aria-label="Pip hướng dẫn">
      <img src="assets/storybook/pip-storybook-v2.webp?v=20260713-224338" alt="Pip" decoding="async">
      <p class="pip-speech">Mỗi bài hoàn thành sẽ đánh thức một bảo bối. Chọn cổng mà bạn muốn khám phá!</p>
    </aside>
    <aside class="momentum-totem" aria-label="Thưởng nhịp học">
      <b>${momentum.label}</b><small>Bài tiếp theo: +${momentum.dust} Bụi thưởng</small>
    </aside>
    <nav class="room-dock" aria-label="Kho phần thưởng">
      <button class="dock-button" type="button" data-open-modal="${MODAL_IDS.album}"><span class="dock-icon" aria-hidden="true">◇</span><span>Bảo bối<small>${snapshot.earned.length}/${REWARD_RECORDS.length} đã tìm thấy</small></span><b class="dock-badge">${snapshot.earned.length}</b></button>
      <button class="dock-button" type="button" data-open-modal="${MODAL_IDS.gifts}"><span class="dock-icon" aria-hidden="true">▣</span><span>Rương quà<small>${getNextGiftLabel(snapshot)}</small></span><b class="dock-badge">${unlockedGiftCount}</b></button>
    </nav>
  </div>`;
}

function renderAlbumModal(snapshot, isOpen) {
  return `<section class="game-modal ${isOpen ? "open" : ""}" id="${MODAL_IDS.album}" role="dialog" aria-modal="true" aria-labelledby="album-title">
    <div class="modal-panel">
      <button class="modal-close" type="button" data-close-modal aria-label="Đóng">×</button>
      <h2 id="album-title">Bộ sưu tập bảo bối</h2>
      <p>Mỗi node chỉ trao XP và bảo bối một lần. Bạn đã tìm thấy ${snapshot.earned.length}/${REWARD_RECORDS.length} món.</p>
      <div class="album-grid">${renderAlbumItems(snapshot)}</div>
    </div>
  </section>`;
}

function renderGiftModal(snapshot, isOpen) {
  return `<section class="game-modal ${isOpen ? "open" : ""}" id="${MODAL_IDS.gifts}" role="dialog" aria-modal="true" aria-labelledby="gift-title">
    <div class="modal-panel">
      <button class="modal-close" type="button" data-close-modal aria-label="Đóng">×</button>
      <h2 id="gift-title">Rương quà Kotopia</h2>
      <p>Đủ XP thì mở phiếu quà. Mở phiếu không trừ XP; mã được lưu trên máy này.</p>
      <div class="gift-grid">${renderGiftItems(snapshot)}</div>
    </div>
  </section>`;
}

function showModal(modalId) {
  closeModals();
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModals() {
  document.querySelectorAll(".game-modal.open").forEach(modal => modal.classList.remove("open"));
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), TOAST_DURATION_MS);
}

function bindModalActions() {
  document.querySelectorAll("[data-open-modal]").forEach(button => {
    button.addEventListener("click", () => showModal(button.dataset.openModal));
  });
  document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeModals);
  });
  document.querySelectorAll(".game-modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModals();
    });
  });
}

function bindGiftActions(snapshot) {
  document.querySelectorAll("[data-gift]").forEach(button => {
    button.addEventListener("click", () => {
      const result = claimCollectibleGift(localStorage, button.dataset.gift, snapshot.totalXp);
      if (!result.claimed) return;
      render(MODAL_IDS.gifts);
      showToast(`Đã mở ${result.gift.name}: ${result.code}`);
    });
  });
}

function render(openModalId = null) {
  const snapshot = collectibleSnapshot(localStorage, REWARD_RECORDS);
  const momentum = momentumDust(localStorage);
  document.getElementById(PORTAL_ROOT_ID).innerHTML = `${renderGameRoom(snapshot, momentum)}
    ${renderAlbumModal(snapshot, openModalId === MODAL_IDS.album)}
    ${renderGiftModal(snapshot, openModalId === MODAL_IDS.gifts)}
    <div class="toast" role="status" aria-live="polite"></div>`;
  bindModalActions();
  bindGiftActions(snapshot);
}

syncCompletedRewards(localStorage, REWARD_RECORDS);
if (getMainProgress() < MIN_PORTAL_PROGRESS) {
  location.replace("./index.html");
} else {
  render();
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModals();
});
