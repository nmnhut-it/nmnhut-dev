// interactive-studio.js — hand-tracked sticker, gift, and particle output for
// camera_charm's JSON bridge. Python chooses the design; this class owns the
// camera/landmark loop and keeps raw MediaPipe data out of learner code.
import { CAPTURE_W, CAPTURE_H } from './camera-engine.js';
import { coverMap } from './gesture-math.js';
import { alignWalkthrough } from './walkthrough-cell.js';

const MOTIONS = new Set(['orbit', 'spiral-in', 'rain', 'pulse', 'comet']);
const PHOTO_LIGHT_MODES = new Set(['steady', 'off', 'shift']);
const PHOTO_LIGHT_COLORS = { green: '#78b2a5', red: '#9b3845', yellow: '#f4c85a', blue: '#78b2a5', white: '#fffdf5', purple: '#78b2a5' };
const PHOTO_LIGHT_LABELS = { green: 'XANH LÁ', red: 'ĐỎ', yellow: 'VÀNG', blue: 'XANH DƯƠNG', white: 'TRẮNG', purple: 'TÍM' };
const ANCHOR_INDEX = { wrist: 0, palm: 9, index_tip: 8 };
const DEFAULT_STYLE = { color: '#78b2a5', symbols: '', motion: 'orbit', size: 1, density: 1, glow: 1 };
const CAMERA_START_MS = 6000;
const HAND_READ_MS = 1500, PARTICLE_FRAME_CAP = 120, IMAGE_FRAME_MAX_W = 64, IMAGE_FRAME_MAX_H = 48;
const IMAGE_GRID_MIN = 8, IMAGE_GRID_MAX = 24, IMAGE_GRID_SAMPLE = 'assets/pixel-art-magic-owl.webp';

const clamp = (value, min, max, fallback) => { const n = Number(value); return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback; };
const shortText = (value, max, fallback = '') => { const chars = [...String(value ?? fallback)]; return chars.slice(0, max).join(''); };
const safeColor = value => {
  const color = String(value || '');
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const rgb = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  return rgb && rgb.slice(1).every(channel => Number(channel) <= 255) ? color : DEFAULT_STYLE.color;
};
const parsePayload = raw => { try { const v = JSON.parse(String(raw || '{}')); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch { return {}; } };
const imageChannel = value => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(255, Math.trunc(value))) : 0;

function mountParticleGuide(host, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return;
  host.classList.add('guided');
  const guide = document.createElement('aside'); guide.className = 'studio-particle-guide';
  const action = document.createElement('b'); action.textContent = shortText(raw.action, 28, 'QUAN SÁT');
  const title = document.createElement('strong'); title.textContent = shortText(raw.title, 70, 'Trạng thái của particle');
  guide.append(action, title);
  if (raw.formula) { const formula = document.createElement('code'); formula.textContent = shortText(raw.formula, 80); guide.appendChild(formula); }
  const fields = Array.isArray(raw.fields) ? raw.fields.slice(0, 5) : [];
  if (fields.length) {
    const state = document.createElement('div'); state.className = 'studio-particle-state';
    fields.forEach(field => { const item = document.createElement('span'); item.textContent = `${shortText(field?.label, 16, 'value')} ${shortText(field?.value, 18, '—')}`; state.appendChild(item); });
    guide.appendChild(state);
  }
  if (raw.caption) { const caption = document.createElement('p'); caption.textContent = shortText(raw.caption, 150); guide.appendChild(caption); }
  host.appendChild(guide);
}

export function normalizePhotoLightColors(input) {
  const source = Array.isArray(input) ? input.slice(0, 12) : [];
  const colors = source.map(value => PHOTO_LIGHT_COLORS[String(value || '').toLowerCase()] || safeColor(value)).filter(Boolean);
  return colors.length ? colors : [PHOTO_LIGHT_COLORS.green, PHOTO_LIGHT_COLORS.red, PHOTO_LIGHT_COLORS.yellow];
}

export function photoLightSlots() {
  const slots = [];
  for (let i = 0; i < 9; i++) slots.push({ x: 8 + i * 10.5, y: 5 });
  for (let i = 1; i < 6; i++) slots.push({ x: 92, y: 5 + i * 15 });
  for (let i = 8; i >= 0; i--) slots.push({ x: 8 + i * 10.5, y: 95 });
  for (let i = 5; i >= 1; i--) slots.push({ x: 8, y: 5 + i * 15 });
  return slots;
}

export function photoLightFrame(input, mode = 'steady', step = 0) {
  const colors = normalizePhotoLightColors(input), safeMode = PHOTO_LIGHT_MODES.has(mode) ? mode : 'steady';
  const phase = Number.isFinite(Number(step)) ? Math.max(0, Math.trunc(Number(step))) : 0;
  return photoLightSlots().map((position, index) => ({
    ...position,
    color: colors[(index + (safeMode === 'shift' ? phase : 0)) % colors.length],
    on: safeMode !== 'off',
  }));
}

export function pickLocalPhoto() {
  if (typeof document === 'undefined' || typeof FileReader === 'undefined') return Promise.resolve(null);
  return new Promise(resolve => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    let settled = false; const finish = value => { if (settled) return; settled = true; clearTimeout(timer); resolve(value); };
    const timer = setTimeout(() => finish(null), 120000);
    input.addEventListener('cancel', () => finish(null), { once: true });
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file || !String(file.type || '').startsWith('image/') || file.size > 12 * 1024 * 1024) { finish(null); return; }
      const reader = new FileReader(); reader.onload = () => finish(typeof reader.result === 'string' ? reader.result : null); reader.onerror = () => finish(null); reader.readAsDataURL(file);
    }, { once: true });
    input.click();
  });
}

export function normalizeImageFrame(input) {
  if (!Array.isArray(input) || !input.length || !Array.isArray(input[0]) || !input[0].length) return null;
  const height = Math.min(input.length, IMAGE_FRAME_MAX_H), width = Math.min(input[0].length, IMAGE_FRAME_MAX_W);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < height; row++) {
    const sourceRow = Array.isArray(input[row]) ? input[row] : [];
    for (let col = 0; col < width; col++) {
      const pixel = sourceRow[col], offset = (row * width + col) * 4;
      if (!Array.isArray(pixel) || (pixel.length !== 3 && pixel.length !== 4)) continue;
      data[offset] = imageChannel(pixel[0]); data[offset + 1] = imageChannel(pixel[1]); data[offset + 2] = imageChannel(pixel[2]);
      data[offset + 3] = pixel.length === 4 ? imageChannel(pixel[3]) : 255;
    }
  }
  return { width, height, data };
}

export function rgbaToImageGrid(data, width, height) {
  const safeWidth = Math.max(0, Math.trunc(Number(width) || 0)), safeHeight = Math.max(0, Math.trunc(Number(height) || 0));
  if (!data || data.length < safeWidth * safeHeight * 4 || !safeWidth || !safeHeight) return [];
  const grid = [];
  for (let row = 0; row < safeHeight; row++) {
    const line = [];
    for (let col = 0; col < safeWidth; col++) {
      const offset = (row * safeWidth + col) * 4;
      line.push([imageChannel(data[offset]), imageChannel(data[offset + 1]), imageChannel(data[offset + 2])]);
    }
    grid.push(line);
  }
  return grid;
}

export function decodeImageGrid(source, size = 16) {
  if (typeof document === 'undefined' || !source) return Promise.resolve([]);
  const side = Math.round(clamp(size, IMAGE_GRID_MIN, IMAGE_GRID_MAX, 16));
  return new Promise(resolve => {
    const image = document.createElement('img');
    image.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = side; canvas.height = side;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx || typeof ctx.drawImage !== 'function' || typeof ctx.getImageData !== 'function') { resolve([]); return; }
      ctx.imageSmoothingEnabled = false; ctx.drawImage(image, 0, 0, side, side);
      resolve(rgbaToImageGrid(ctx.getImageData(0, 0, side, side).data, side, side));
    };
    image.onerror = () => resolve([]);
    image.src = source;
  });
}

export function normalizeStudioStyle(input = {}) {
  return {
    color: safeColor(input.color),
    symbols: shortText(input.symbols, 12),
    motion: MOTIONS.has(input.motion) ? input.motion : DEFAULT_STYLE.motion,
    size: clamp(input.size, .5, 2, DEFAULT_STYLE.size),
    density: clamp(input.density, .15, 1, DEFAULT_STYLE.density),
    glow: clamp(input.glow, .5, 2, DEFAULT_STYLE.glow),
  };
}

export function studioAnchorPoint(lm, anchor = 'palm') {
  const idx = ANCHOR_INDEX[anchor] ?? ANCHOR_INDEX.palm;
  const p = lm && lm[idx];
  return p ? { x: 1 - p.x, y: p.y } : { x: .5, y: .5 };
}

export class InteractiveStudio {
  #scenePanel; #cameraEngine; #gestureDispatcher; #loadVortex; #getVortex; #outLine;
  #pickPhoto; #decodePhoto; #wait;
  #active = false; #cameraAvailable = false; #style = { ...DEFAULT_STYLE }; #vfx = null; #lastLm = null;
  #stickers = []; #staticStickers = []; #particleFrame = null; #photoProject = null; #photoLampHost = null; #photoStartEl = null; #photoStartResolve = null; #photoSrc = null; #photoManualColors = [];
  #lightBoard = null; #lightBulbs = null; #lightGrid = null; #lightStartEl = null; #lightStartResolve = null;
  #gifts = new Set(); #bursts = new Set(); #titleEl = null; #off = null; #stopTimer = null; #pendingHand = null;
  constructor(scenePanel, { cameraEngine, gestureDispatcher, loadVortex, outLine, getVortex, pickPhoto, decodePhoto, wait } = {}) {
    this.#scenePanel = scenePanel; this.#cameraEngine = cameraEngine; this.#gestureDispatcher = gestureDispatcher;
    this.#loadVortex = loadVortex || (() => Promise.resolve()); this.#outLine = outLine || (() => {});
    this.#getVortex = getVortex || (() => globalThis.RitualVortex);
    this.#pickPhoto = pickPhoto || pickLocalPhoto; this.#decodePhoto = decodePhoto || decodeImageGrid; this.#wait = wait || (ms => new Promise(resolve => setTimeout(resolve, ms)));
    this.#off = this.#gestureDispatcher.onLandmarks((lm, has) => this.#onLandmarks(lm, has));
  }
  get isActive() { return this.#active; }
  get cameraAvailable() { return this.#cameraAvailable; }

  async start(raw) {
    const cfg = parsePayload(raw);
    if (cfg.action === 'photo_upload') return this.#uploadPhoto();
    if (cfg.action === 'image_pick_grid') return this.#readImageGrid(cfg, true);
    if (cfg.action === 'image_sample_grid') return this.#readImageGrid(cfg, false);
    if (cfg.action === 'light_board_start') return this.#startLightBoard();
    if (cfg.action === 'light_board_clear') return this.#clearLightBulbs();
    if (cfg.action === 'light_board_bulb') return this.#placeLightBulb(cfg);
    if (cfg.action === 'light_board_grid') return this.#showLightGrid(cfg);
    if (cfg.action === 'photo_start') return this.#startPhotoLights();
    if (cfg.action === 'delay') return this.#delay(cfg);
    if (cfg.action === 'photo_lights') return this.#showPhotoLights(cfg);
    if (cfg.action === 'photo_light') return this.#setPhotoLight(cfg);
    if (cfg.action === 'particle_stage_start') return this.#startParticleStage(cfg);
    if (cfg.action === 'particle_frame') return this.drawParticleFrame(JSON.stringify(cfg));
    this.stop();
    this.#active = true; this.#renderTitle(shortText(cfg.title, 40, 'My Live Studio'));
    await this.#ensureVfx();
    let timeout = null;
    try {
      const opened = this.#cameraEngine.ensure().then(() => true, () => false);
      this.#cameraAvailable = await Promise.race([opened, new Promise(resolve => { timeout = setTimeout(() => resolve(false), CAMERA_START_MS); })]);
    } catch { this.#cameraAvailable = false; }
    if (timeout) clearTimeout(timeout);
    if (!this.#active) return 'unavailable';
    const stat = this.#scenePanel.querySelector('#scstat');
    if (this.#cameraAvailable) { if (stat) stat.textContent = 'studio đang theo dõi bàn tay'; return 'ready'; }
    if (stat) stat.textContent = 'studio đang ở chế độ xem trước';
    this.#outLine('không mở được camera — studio chuyển sang chế độ xem trước');
    this.#positionAll();
    return 'unavailable';
  }

  handle(raw) {
    const cfg = parsePayload(raw);
    if (cfg.action === 'particle_style') { this.#style = normalizeStudioStyle(cfg); if (this.#active) this.#mountVfx(); }
    else if (cfg.action === 'sticker_attach') this.#attachSticker(cfg);
    else if (cfg.action === 'sticker_clear') this.clearStickers();
    else if (cfg.action === 'sticker_at') this.#drawStickerAt(cfg);
    else if (cfg.action === 'studio_frame_clear') this.clearStudioFrame();
    else if (cfg.action === 'gift') this.#sendGift(cfg);
    else if (cfg.action === 'particle_burst') this.#particleBurst(cfg.anchor);
    else if (cfg.action === 'studio_stop') this.stop();
  }

  clearStickers() { this.#stickers.forEach(s => s.el.remove()); this.#stickers = []; }
  clearStudioFrame() {
    this.#staticStickers.forEach(el => el.remove()); this.#staticStickers = [];
    if (this.#particleFrame) this.#particleFrame.remove(); this.#particleFrame = null;
  }
  async #uploadPhoto() {
    this.stop(); this.#active = true;
    const src = await this.#pickPhoto(); this.#photoSrc = typeof src === 'string' && src ? src : null;
    this.#mountPhotoProject();
    const stat = this.#scenePanel.querySelector('#scstat');
    if (this.#photoSrc) { if (stat) stat.textContent = 'đã đặt ảnh vào khung'; return 'uploaded'; }
    if (stat) stat.textContent = 'đang dùng ảnh mẫu';
    this.#outLine('bạn chưa chọn ảnh hoặc ảnh lớn hơn 12 MB — máy dùng nền mẫu để tiếp tục');
    return 'demo';
  }
  async #readImageGrid(cfg, shouldPick) {
    this.stop(); this.#active = true;
    const picked = shouldPick ? await this.#pickPhoto() : null;
    this.#photoSrc = typeof picked === 'string' && picked ? picked : IMAGE_GRID_SAMPLE;
    const side = Math.round(clamp(cfg.size, IMAGE_GRID_MIN, IMAGE_GRID_MAX, 16));
    const grid = await this.#decodePhoto(this.#photoSrc, side);
    this.#mountPhotoProject();
    const stat = this.#scenePanel.querySelector('#scstat');
    if (stat) stat.textContent = picked ? `đã đọc ảnh thành bảng ${side}×${side}` : `đang dùng ảnh mẫu ${side}×${side}`;
    if (shouldPick && !picked) this.#outLine('bạn chưa chọn ảnh — máy dùng tranh cú phép thuật để bài vẫn chạy được');
    return JSON.stringify(Array.isArray(grid) ? grid : []);
  }
  #finishPhotoStart(result) {
    if (this.#photoStartEl) this.#photoStartEl.remove(); this.#photoStartEl = null;
    const resolve = this.#photoStartResolve; this.#photoStartResolve = null; if (resolve) resolve(result);
  }
  async #startPhotoLights() {
    if (!this.#active) this.#active = true;
    if (!this.#photoProject) this.#mountPhotoProject();
    this.#finishPhotoStart('cancelled');
    const overlay = document.createElement('div'); overlay.className = 'photo-light-start';
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'BẮT ĐẦU'; overlay.appendChild(button);
    this.#photoProject.appendChild(overlay); this.#photoStartEl = overlay;
    const stat = this.#scenePanel.querySelector('#scstat'); if (stat) stat.textContent = 'bấm BẮT ĐẦU để chạy đèn';
    const count = this.#scenePanel.querySelector('#sccount'); if (count) count.textContent = '▶';
    this.#outLine('chương trình đang chờ — bấm BẮT ĐẦU trên khung ảnh');
    setTimeout(() => this.#scenePanel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
    return new Promise(resolve => { this.#photoStartResolve = resolve; button.onclick = () => { if (stat) stat.textContent = 'đã bắt đầu'; if (count) count.textContent = '1'; this.#outLine('đã bấm BẮT ĐẦU — chu kỳ 1 chạy'); this.#finishPhotoStart('started'); }; });
  }
  async #delay(cfg) { await this.#wait(clamp(cfg.seconds, .05, 3, .5) * 1000); return 'waited'; }
  async #startParticleStage(cfg) {
    this.stop(); this.#active = true; this.#cameraAvailable = false;
    this.#renderTitle(shortText(cfg.title, 40, 'Xưởng Hạt Ánh Sáng'));
    const stat = this.#scenePanel.querySelector('#scstat');
    if (stat) stat.textContent = 'xưởng đang hiển thị từng frame';
    this.#positionAll();
    return 'started';
  }
  #finishLightStart(result) {
    if (this.#lightStartEl) this.#lightStartEl.remove(); this.#lightStartEl = null;
    const resolve = this.#lightStartResolve; this.#lightStartResolve = null; if (resolve) resolve(result);
  }
  #mountLightBoard() {
    if (this.#lightBoard) this.#lightBoard.remove();
    const board = document.createElement('div'); board.className = 'light-board-project';
    const image = document.createElement('img'); image.className = 'light-board-art'; image.src = 'assets/electronic-marquee-board.webp'; image.alt = '';
    const bulbs = document.createElement('div'); bulbs.className = 'light-board-bulbs';
    const grid = document.createElement('div'); grid.className = 'light-board-grid';
    board.appendChild(image); board.appendChild(bulbs); board.appendChild(grid); this.#scenePanel.appendChild(board);
    this.#lightBoard = board; this.#lightBulbs = bulbs; this.#lightGrid = grid; this.#scenePanel.classList.add('light-board-live');
  }
  async #startLightBoard() {
    if (!this.#active) this.#active = true; if (!this.#lightBoard) this.#mountLightBoard(); this.#finishLightStart('cancelled');
    const overlay = document.createElement('div'); overlay.className = 'light-board-start'; const button = document.createElement('button'); button.type = 'button'; button.textContent = 'BẮT ĐẦU';
    overlay.appendChild(button); this.#lightBoard.appendChild(overlay); this.#lightStartEl = overlay;
    const stat = this.#scenePanel.querySelector('#scstat'); if (stat) stat.textContent = 'BẢNG ĐÈN ĐANG CHỜ';
    this.#outLine('bảng điện tử đã sẵn sàng — bấm BẮT ĐẦU');
    setTimeout(() => {
      const walkthrough = typeof this.#scenePanel.closest === 'function' ? this.#scenePanel.closest('.walkthrough') : null;
      if (walkthrough) alignWalkthrough(walkthrough);
      else this.#scenePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 40);
    return new Promise(resolve => { this.#lightStartResolve = resolve; button.onclick = () => { if (stat) stat.textContent = 'BẮT ĐẦU LẮP BÓNG'; this.#finishLightStart('started'); }; });
  }
  async #clearLightBulbs() { if (!this.#lightBoard) this.#mountLightBoard(); this.#lightBulbs.replaceChildren(); return 'cleared'; }
  async #placeLightBulb(cfg) {
    if (!this.#lightBoard) this.#mountLightBoard(); const bulb = document.createElement('i'), color = normalizePhotoLightColors([cfg.color])[0];
    bulb.className = 'light-board-bulb'; bulb.style.left = `${clamp(cfg.x, 0, 100, 50)}%`; bulb.style.top = `${clamp(cfg.y, 0, 100, 10)}%`; bulb.style.backgroundColor = color; bulb.style.setProperty('--lamp', color);
    this.#lightBulbs.appendChild(bulb); const stat = this.#scenePanel.querySelector('#scstat'); if (stat) stat.textContent = `ĐÃ LẮP ${this.#lightBulbs.children.length} BÓNG`;
    await this.#wait(20); return 'drawn';
  }
  async #showLightGrid(cfg) {
    if (!this.#lightBoard) this.#mountLightBoard(); this.#lightGrid.replaceChildren();
    const source = Array.isArray(cfg.grid) ? cfg.grid.slice(0, 12) : [], rows = Math.max(1, source.length), visibleCols = 24, offset = Math.max(0, Math.trunc(Number(cfg.offset) || 0));
    const color = normalizePhotoLightColors([cfg.color])[0];
    source.forEach((row, rowIndex) => { if (!Array.isArray(row)) return; row.slice(0, 80).forEach((value, colIndex) => {
      const screenCol = colIndex + visibleCols - offset; if (!value || screenCol < 0 || screenCol >= visibleCols) return;
      const pixel = document.createElement('i'); pixel.style.left = `${(screenCol + .5) / visibleCols * 100}%`; pixel.style.top = `${(rowIndex + .5) / rows * 100}%`; pixel.style.backgroundColor = color; pixel.style.setProperty('--lamp', color); this.#lightGrid.appendChild(pixel);
    }); });
    const stat = this.#scenePanel.querySelector('#scstat'); if (stat) stat.textContent = `GRID · FRAME ${offset}`; await this.#wait(20); return 'drawn';
  }
  async #showPhotoLights(cfg) {
    if (!this.#active) this.#active = true;
    if (!this.#photoProject) this.#mountPhotoProject();
    if (this.#photoLampHost) this.#photoLampHost.remove();
    const mode = PHOTO_LIGHT_MODES.has(cfg.mode) ? cfg.mode : 'steady', frame = photoLightFrame(cfg.colors, mode, cfg.step);
    const step = Math.max(0, Math.trunc(Number(cfg.step) || 0)), host = document.createElement('div'); host.className = 'photo-light-ring'; host.dataset.mode = mode; host.dataset.step = String(step);
    for (const lamp of frame) { const el = document.createElement('i'); el.className = lamp.on ? 'on' : 'off';
      el.style.left = `${lamp.x}%`; el.style.top = `${lamp.y}%`; el.style.backgroundColor = lamp.color; el.style.setProperty('--lamp', lamp.color); host.appendChild(el); }
    this.#photoProject.appendChild(host); this.#photoLampHost = host;
    this.#photoProject.classList.toggle('is-lit', mode !== 'off'); this.#photoProject.classList.toggle('is-off', mode === 'off');
    const rawColors = Array.isArray(cfg.colors) && cfg.colors.length ? cfg.colors : ['green'], color = String(rawColors[step % rawColors.length] || 'green').toLowerCase();
    const stat = this.#scenePanel.querySelector('#scstat'); if (stat) stat.textContent = mode === 'off' ? `CHU KỲ ${step + 1} · ĐÈN TẮT` : `CHU KỲ ${step + 1} · ĐÈN SÁNG · ${PHOTO_LIGHT_LABELS[color] || color.toUpperCase()}`;
    const count = this.#scenePanel.querySelector('#sccount'); if (count) count.textContent = String(step + 1);
    await this.#wait(20); return 'drawn';
  }
  async #setPhotoLight(cfg) {
    const index = Math.max(0, Math.min(27, Math.trunc(Number(cfg.index) || 0)));
    this.#photoManualColors[index] = normalizePhotoLightColors([cfg.color])[0];
    return this.#showPhotoLights({ colors: this.#photoManualColors.filter(Boolean), mode: 'steady', step: 0 });
  }
  #mountPhotoProject() {
    if (this.#photoProject) this.#photoProject.remove();
    const host = document.createElement('div'); host.className = 'photo-light-project';
    if (this.#photoSrc) { const img = document.createElement('img'); img.className = 'photo-light-picture'; img.src = this.#photoSrc; img.alt = ''; host.appendChild(img); }
    else { const sample = document.createElement('div'); sample.className = 'photo-light-placeholder'; host.appendChild(sample); }
    this.#scenePanel.appendChild(host); this.#photoProject = host; this.#photoLampHost = null; this.#scenePanel.classList.add('photo-lights-live');
  }
  async readHandPosition(raw) {
    const anchor = ANCHOR_INDEX[parsePayload(raw).anchor] === undefined ? 'palm' : parsePayload(raw).anchor;
    if (this.#lastLm) return JSON.stringify(this.#handResult(anchor, true));
    if (!this.#active || !this.#cameraAvailable) return JSON.stringify(this.#handResult(anchor, false));
    if (this.#pendingHand) { clearTimeout(this.#pendingHand.timer); this.#pendingHand.resolve(JSON.stringify(this.#handResult(this.#pendingHand.anchor, false))); }
    return new Promise(resolve => { const pending = { anchor, resolve, timer: null }; pending.timer = setTimeout(() => {
      if (this.#pendingHand === pending) this.#pendingHand = null; resolve(JSON.stringify(this.#handResult(anchor, false)));
    }, HAND_READ_MS); this.#pendingHand = pending; });
  }
  drawParticleFrame(raw) {
    const cfg = parsePayload(raw), particles = Array.isArray(cfg.particles) ? cfg.particles.slice(0, PARTICLE_FRAME_CAP) : [];
    if (this.#particleFrame) this.#particleFrame.remove();
    const host = document.createElement('div'); host.className = 'studio-particle-frame';
    for (const particle of particles) { const p = particle && typeof particle === 'object' ? particle : {}, el = document.createElement('i');
      el.textContent = shortText(p.symbol, 4, '.'); el.style.left = `${clamp(p.x, 0, 100, 50)}%`; el.style.top = `${clamp(p.y, 0, 100, 50)}%`;
      el.style.color = safeColor(p.color); el.style.fontSize = `${Math.round(14 * clamp(p.size, .25, 3, 1))}px`;
      el.style.opacity = String(clamp(p.alpha, 0, 255, 255) / 255); host.appendChild(el); }
    mountParticleGuide(host, cfg.guide);
    this.#scenePanel.appendChild(host); this.#particleFrame = host; return 'drawn';
  }
  presentImageFrame(raw) {
    const frame = normalizeImageFrame(parsePayload(raw).image);
    if (this.#particleFrame) this.#particleFrame.remove(); this.#particleFrame = null;
    if (!frame) return 'invalid';
    const canvas = document.createElement('canvas'); canvas.className = 'studio-image-frame'; canvas.width = frame.width; canvas.height = frame.height;
    canvas.style.position = 'absolute'; canvas.style.inset = '0'; canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.zIndex = '3'; canvas.style.pointerEvents = 'none'; canvas.style.imageRendering = 'pixelated';
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return 'invalid';
    const imageData = ctx.createImageData(frame.width, frame.height); imageData.data.set(frame.data); ctx.imageSmoothingEnabled = false; ctx.putImageData(imageData, 0, 0);
    this.#scenePanel.appendChild(canvas); this.#particleFrame = canvas; return 'drawn';
  }
  stopAfter(ms) { clearTimeout(this.#stopTimer); if (this.#active) this.#stopTimer = setTimeout(() => this.stop(), Math.max(0, ms || 0)); }
  stop() {
    clearTimeout(this.#stopTimer); this.#stopTimer = null; this.#active = false; this.#cameraAvailable = false; this.#lastLm = null;
    this.#finishPhotoStart('cancelled');
    this.#finishLightStart('cancelled');
    this.clearStickers(); this.clearStudioFrame(); this.#gifts.forEach(el => el.remove()); this.#gifts.clear(); this.#bursts.forEach(el => el.remove()); this.#bursts.clear();
    if (this.#pendingHand) { clearTimeout(this.#pendingHand.timer); this.#pendingHand.resolve(JSON.stringify(this.#handResult(this.#pendingHand.anchor, false))); this.#pendingHand = null; }
    if (this.#titleEl) this.#titleEl.remove(); this.#titleEl = null;
    if (this.#photoProject) this.#photoProject.remove(); this.#photoProject = null; this.#photoLampHost = null; this.#photoManualColors = [];
    if (this.#lightBoard) this.#lightBoard.remove(); this.#lightBoard = null; this.#lightBulbs = null; this.#lightGrid = null;
    if (this.#vfx) this.#vfx.stop(); this.#vfx = null;
    this.#scenePanel.classList.remove('studio-live', 'photo-lights-live', 'light-board-live');
  }
  dispose() { this.stop(); this.#photoSrc = null; if (this.#off) this.#off(); this.#off = null; }

  async #ensureVfx() { await this.#loadVortex().catch(() => {}); if (this.#active) this.#mountVfx(); }
  #mountVfx() {
    const factory = this.#getVortex(); if (!factory || typeof factory.mount !== 'function') return;
    if (this.#vfx) this.#vfx.stop();
    this.#scenePanel.style.setProperty('--c', this.#style.color);
    this.#vfx = factory.mount(this.#scenePanel, { circle: false, ambient: 0, density: this.#style.density, theme: {
      palette: { core: this.#style.color, dust: this.#style.color, rune: this.#style.color }, glyphs: this.#style.symbols,
      motion: this.#style.motion, scale: this.#style.size, glow: this.#style.glow,
    } });
  }
  #renderTitle(title) {
    const el = document.createElement('div'); el.className = 'studio-title'; el.textContent = title;
    this.#scenePanel.appendChild(el); this.#titleEl = el; this.#scenePanel.classList.add('studio-live');
  }
  #attachSticker(cfg) {
    if (!this.#active) return;
    const el = document.createElement('span'); el.className = 'ar-sticker'; el.textContent = shortText(cfg.symbol, 6, '*');
    const sticker = { el, anchor: ANCHOR_INDEX[cfg.anchor] === undefined ? 'palm' : cfg.anchor, size: clamp(cfg.size, .5, 2.5, 1) };
    el.style.fontSize = `${Math.round(42 * sticker.size)}px`; this.#scenePanel.appendChild(el); this.#stickers.push(sticker);
    if (this.#stickers.length > 6) this.#stickers.shift().el.remove(); this.#positionSticker(sticker);
  }
  #drawStickerAt(cfg) {
    if (!this.#active) return;
    const el = document.createElement('span'); el.className = 'studio-static-sticker'; el.textContent = shortText(cfg.symbol, 6, '*');
    el.style.left = `${clamp(cfg.x, 0, 100, 50)}%`; el.style.top = `${clamp(cfg.y, 0, 100, 50)}%`; el.style.fontSize = `${Math.round(42 * clamp(cfg.size, .5, 2.5, 1))}px`;
    this.#scenePanel.appendChild(el); this.#staticStickers.push(el); if (this.#staticStickers.length > 12) this.#staticStickers.shift().remove();
  }
  #sendGift(cfg) {
    if (!this.#active) return;
    const el = document.createElement('div'); el.className = 'studio-gift';
    const symbol = document.createElement('b'); symbol.textContent = shortText(cfg.symbol, 6, '*');
    const copy = document.createElement('span'); const sender = shortText(cfg.sender, 24, 'Guest'), gift = shortText(cfg.gift, 24, 'Gift'), message = shortText(cfg.message, 60);
    copy.textContent = `${sender} sent ${gift}${message ? ` · ${message}` : ''}`; el.appendChild(symbol); el.appendChild(copy);
    this.#scenePanel.appendChild(el); this.#gifts.add(el); setTimeout(() => { this.#gifts.delete(el); el.remove(); }, 2400);
    this.#particleBurst('palm');
  }
  #particleBurst(anchor = 'palm') {
    if (!this.#active) return;
    const p = studioAnchorPoint(this.#lastLm, anchor); this.#symbolBurst(p);
    if (!this.#vfx) return;
    const vfx = this.#vfx; vfx.emit(p.x, p.y, Math.round(35 + 85 * this.#style.density)); setTimeout(() => { if (this.#active && this.#vfx === vfx) vfx.burst(); }, 60);
  }
  #symbolBurst(p) {
    const w = this.#scenePanel.clientWidth || CAPTURE_W, h = this.#scenePanel.clientHeight || CAPTURE_H, q = coverMap(p.x, p.y, w, h, CAPTURE_W, CAPTURE_H);
    const host = document.createElement('div'); host.className = `studio-particles motion-${this.#style.motion}`; host.style.left = `${q.x}px`; host.style.top = `${q.y}px`;
    const symbols = [...(this.#style.symbols || '✦')], count = Math.round(8 + 18 * this.#style.density);
    for (let i = 0; i < count; i++) { const el = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 28 + Math.random() * 78 * this.#style.size;
      el.textContent = symbols[i % symbols.length]; el.style.setProperty('--dx', `${Math.cos(a) * d}px`); el.style.setProperty('--dy', `${Math.sin(a) * d}px`);
      el.style.setProperty('--delay', `${Math.random() * .12}s`); el.style.color = this.#style.color; el.style.fontSize = `${Math.round(12 * this.#style.size)}px`;
      el.style.textShadow = `0 0 ${Math.round(8 * this.#style.glow)}px ${this.#style.color}`; host.appendChild(el); }
    this.#scenePanel.appendChild(host); this.#bursts.add(host); setTimeout(() => { this.#bursts.delete(host); host.remove(); }, 1300);
  }
  #onLandmarks(lm, has) {
    this.#lastLm = has && lm ? lm : null;
    if (this.#pendingHand && this.#lastLm) { const pending = this.#pendingHand; this.#pendingHand = null; clearTimeout(pending.timer); pending.resolve(JSON.stringify(this.#handResult(pending.anchor, true))); }
    if (this.#active) this.#positionAll();
  }
  #handResult(anchor, visible) {
    if (!visible || !this.#lastLm) return { visible: false, x: 50, y: 50 };
    const p = studioAnchorPoint(this.#lastLm, anchor), w = this.#scenePanel.clientWidth || CAPTURE_W, h = this.#scenePanel.clientHeight || CAPTURE_H;
    const q = coverMap(p.x, p.y, w, h, CAPTURE_W, CAPTURE_H);
    return { visible: true, x: Math.round(clamp(q.x / w * 100, 0, 100, 50)), y: Math.round(clamp(q.y / h * 100, 0, 100, 50)) };
  }
  #positionAll() { this.#stickers.forEach(s => this.#positionSticker(s)); }
  #positionSticker(sticker) {
    const p = studioAnchorPoint(this.#lastLm, sticker.anchor); const w = this.#scenePanel.clientWidth || CAPTURE_W, h = this.#scenePanel.clientHeight || CAPTURE_H;
    const q = coverMap(p.x, p.y, w, h, CAPTURE_W, CAPTURE_H); sticker.el.style.left = `${q.x}px`; sticker.el.style.top = `${q.y}px`;
  }
}
