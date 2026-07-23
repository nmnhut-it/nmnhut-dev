// tower-state.js — pure, DOM-free lives/floor/score bookkeeping for THÁP VÔ
// ĐỊNH (tower-climb mode). Loaded as a bare global via <script> before
// tower.js (same convention as cell-validation.js/progress-versioning.js —
// see those files' headers), and require()-able from a plain Node test.
// Owns: the TowerState class (mutation rules only — no DOM, no localStorage
// side effects inside the class itself) + persistence helpers keyed by a
// contentVersion string (reuses progress-versioning.js's contentVersion(),
// already a bare global by the time this loads) so an edited floor list
// resets an in-progress climb instead of resuming stale, same doctrine as
// in-node progress.
const TOWER_KEY = 'magicdust.tower.progress';
const START_LIVES = 3;
const FLOOR_SCORE = 100;

class TowerState {
  constructor({ lives = START_LIVES, floor = 1, score = 0, over = false, won = false } = {}) {
    this.lives = lives; this.floor = floor; this.score = score; this.over = over; this.won = won;
  }
  // recordMiss() — a code cell ran clean but failed expectOut, or crashed.
  // Costs one life; at 0 lives the climb is OVER (not won).
  recordMiss() {
    if (this.over) return this;
    this.lives = Math.max(0, this.lives - 1);
    if (this.lives === 0) this.over = true;
    return this;
  }
  // recordFloorClear(topFloor) — a floor's cell (code or boss) completed.
  // Advances the floor counter and awards points; clearing the top floor
  // ends the climb as a WIN instead of just advancing further.
  recordFloorClear(topFloor) {
    if (this.over) return this;
    this.score += FLOOR_SCORE * this.floor; // higher floors are worth more
    if (this.floor >= topFloor) { this.over = true; this.won = true; return this; }
    this.floor += 1;
    return this;
  }
  toJSON() { return { lives: this.lives, floor: this.floor, score: this.score, over: this.over, won: this.won }; }
  static fromJSON(o) { return new TowerState(o || {}); }
}

// loadTowerState(version) -> TowerState. A version mismatch (content edited
// since the save) or corrupt/missing storage both fall back to a fresh run —
// mirrors progress-versioning.js's decideResume()'s "reset on mismatch" rule.
function towerStorageKey(towerId = 'tower') {
  const safeId = String(towerId || 'tower').replace(/[^a-zA-Z0-9_-]/g, '-');
  return safeId === 'tower' ? TOWER_KEY : `${TOWER_KEY}.${safeId}`;
}
function loadTowerState(version, towerId = 'tower') {
  try {
    const raw = localStorage.getItem(towerStorageKey(towerId));
    if (!raw) return new TowerState();
    const blob = JSON.parse(raw);
    if (!blob || blob.version !== version) return new TowerState();
    return TowerState.fromJSON(blob.state);
  } catch { return new TowerState(); }
}
function saveTowerState(state, version, towerId = 'tower') {
  try { localStorage.setItem(towerStorageKey(towerId), JSON.stringify({ version, state: state.toJSON() })); } catch { /* storage may be unavailable */ }
}
function clearTowerState(towerId = 'tower') { try { localStorage.removeItem(towerStorageKey(towerId)); } catch { /* ignore */ } }

if (typeof module !== 'undefined') module.exports = { TowerState, loadTowerState, saveTowerState, clearTowerState, towerStorageKey, TOWER_KEY, START_LIVES, FLOOR_SCORE };
