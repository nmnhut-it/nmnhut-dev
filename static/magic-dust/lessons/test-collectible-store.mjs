import assert from "node:assert/strict";
import {
  COLLECTIBLE_GIFTS,
  awardSagaXp,
  claimCollectibleGift,
  collectibleSnapshot,
  momentumDust,
  syncCompletedRewards,
} from "./engine/collectible-store.js";

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
}
const DAY = 86_400_000;
const storage = memoryStorage();
const reward = { track: "math6", nodeId: 0, xp: 100, collectible: { name: "La bàn" }, completionKey: "magicdust.math6.node.0" };

assert.deepEqual(momentumDust(storage, 10 * DAY).dust, 20, "Lần đầu nhận 20 Bụi thưởng");
let result = awardSagaXp(storage, reward, { now: 10 * DAY });
assert.equal(result.awarded, true);
assert.equal(result.dust, 20);
assert.equal(awardSagaXp(storage, reward, { now: 11 * DAY }).awarded, false, "Không farm XP bằng cách học lại");

const next = { ...reward, nodeId: 1, completionKey: "magicdust.math6.node.1" };
assert.equal(awardSagaXp(storage, next, { now: 12 * DAY }).dust, 30);
assert.equal(momentumDust(storage, 20 * DAY).dust, 10);
assert.equal(momentumDust(storage, 28 * DAY).dust, 0, "Nghỉ lâu chỉ mất bonus tương lai");

const snapshot = collectibleSnapshot(storage, [reward, next]);
assert.equal(snapshot.totalXp, 200);
assert.equal(snapshot.totalDust, 50);

const retro = { ...reward, track: "python50", nodeId: 0, completionKey: "magicdust.python50.node.0" };
storage.setItem(retro.completionKey, "1");
assert.equal(syncCompletedRewards(storage, [retro]).length, 1);
assert.equal(collectibleSnapshot(storage, [reward, next, retro]).totalXp, 300);

const cryptoSource = { getRandomValues(bytes) { bytes.set([1, 2, 3]); return bytes; } };
result = claimCollectibleGift(storage, COLLECTIBLE_GIFTS[0].id, 300, cryptoSource);
assert.equal(result.claimed, true);
assert.match(result.code, /^KOTO-START-/);
assert.equal(claimCollectibleGift(storage, "start", 300, cryptoSource).reason, "already-claimed");
assert.equal(claimCollectibleGift(storage, "bronze", 300, cryptoSource).reason, "not-enough-xp");

console.log("✓ Collectible: XP một lần, bonus theo nhịp học, đồng bộ cũ và phiếu quà đều hợp lệ");
