// node lessons/test-inventory.mjs — pins inventory.js: badge idempotency,
// forge-insufficient/sufficient, no-double-spend, bomb-spend floor.
import assert from 'node:assert';
import { Inventory } from './engine/inventory.js';
import { FORGE_SUCCESS_BASE, FORGE_SUCCESS_BONUS_PER_PRACTICE, FORGE_SUCCESS_CAP } from './engine/constants.js';

let passed = 0, failed = 0;
function t(name, fn) {
  try { fn(); passed++; console.log(`  ok — ${name}`); }
  catch (e) { failed++; console.log(`  FAIL — ${name}: ${e.stack || e.message}`); }
}
function fakeStore() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v), _m: m };
}

t('addBadge is idempotent — re-claiming the same id does not dupe', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('a'); inv.addBadge('a');
  assert.strictEqual(inv.badgeCount(), 1);
  assert.strictEqual(inv.hasBadge('a'), true);
  assert.strictEqual(inv.hasBadge('b'), false);
});

t('addBadge(null/undefined) is a no-op', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge(null); inv.addBadge(undefined);
  assert.strictEqual(inv.badgeCount(), 0);
});

t('distinct badge ids each count', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b'); inv.addBadge('c');
  assert.strictEqual(inv.badgeCount(), 3);
});

// rand shims: force the roll deterministically. forgeBomb succeeds when
// rand() < chance, so rand=()=>0 always succeeds and rand=()=>0.999 always
// fails (chance is always < 1 unless bonus pushes it to the cap).
const alwaysSucceed = () => 0;
const alwaysFail = () => 0.999;

t('forgeBomb fails with reason "insufficient" (no state change) when badges are short — no roll attempted', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a');
  const r = inv.forgeBomb(2, { rand: alwaysSucceed }); // even a guaranteed-success roll can't skip the badge requirement
  assert.deepStrictEqual(r, { ok: false, reason: 'insufficient', success: false });
  assert.strictEqual(inv.bombCount(), 0);
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 1); // untouched
});

t('forgeBomb SUCCESS (forced roll): spends exactly `cost` badges, +1 bomb', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  const r = inv.forgeBomb(2, { rand: alwaysSucceed });
  assert.strictEqual(r.ok, true); assert.strictEqual(r.success, true);
  assert.strictEqual(inv.bombCount(), 1);
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 0);
  assert.strictEqual(inv.badgeCount(), 2); // still earned, just spent
});

t('forgeBomb FAIL ("rèn hụt", forced roll): badges are NOT spent, no bomb — failing never costs progress', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  const r = inv.forgeBomb(2, { rand: alwaysFail });
  assert.strictEqual(r.ok, true); assert.strictEqual(r.success, false);
  assert.strictEqual(inv.bombCount(), 0);
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 2); // fully untouched — can retry with the same badges
});

t('forgeBomb default success rate uses FORGE_SUCCESS_BASE with no bonus', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  // roll just under the base rate succeeds; just at/over it fails
  const r1 = inv.forgeBomb(2, { rand: () => FORGE_SUCCESS_BASE - 0.001 });
  assert.strictEqual(r1.chance, FORGE_SUCCESS_BASE);
  assert.strictEqual(r1.success, true);
});

t('forgeBomb succeeds (rèn hụt retry) at higher odds once a bonus is supplied — escalation math', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  const roll = FORGE_SUCCESS_BASE + 0.05; // would FAIL at base rate…
  const r0 = inv.forgeBomb(2, { rand: () => roll });
  assert.strictEqual(r0.success, false);
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 2); // untouched, retry with same badges
  // …but succeeds once one practice's worth of bonus is added (forge-cell.js
  // accumulates this across cleared practices; here we simulate 1 cleared)
  const r1 = inv.forgeBomb(2, { rand: () => roll, bonus: FORGE_SUCCESS_BONUS_PER_PRACTICE });
  assert.strictEqual(r1.chance, FORGE_SUCCESS_BASE + FORGE_SUCCESS_BONUS_PER_PRACTICE);
  assert.strictEqual(r1.success, true);
  assert.strictEqual(inv.bombCount(), 1);
});

t('forgeBomb bonus caps at FORGE_SUCCESS_CAP — enough cleared practices GUARANTEE a forge', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  // a huge bonus (many practices cleared) must clamp to the cap, not exceed 1
  const r = inv.forgeBomb(2, { rand: () => 0.9999999, bonus: 10 });
  assert.strictEqual(r.chance, FORGE_SUCCESS_CAP);
  assert.strictEqual(r.success, true); // guaranteed — even a near-1.0 roll succeeds once capped at 1.0
});

t('forgeBomb spends the OLDEST unspent badges first (earn order)', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b'); inv.addBadge('c');
  inv.forgeBomb(2, { rand: alwaysSucceed });
  assert.strictEqual(inv.hasBadge('a'), true);   // still "known", just spent
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 1);
  // the remaining unspent badge must be 'c' (a, b were the oldest two)
  inv.addBadge('d');
  assert.strictEqual(inv.forgeBomb(2, { rand: alwaysSucceed }).success, true); // c + d forge fine
  assert.strictEqual(inv.badgeCount({ unspentOnly: true }), 0);
});

t('forgeBomb never double-spends a badge — forging twice needs new badges', () => {
  const inv = new Inventory(fakeStore());
  inv.addBadge('a'); inv.addBadge('b');
  assert.strictEqual(inv.forgeBomb(2, { rand: alwaysSucceed }).success, true);
  const r = inv.forgeBomb(2, { rand: alwaysSucceed });
  assert.strictEqual(r.ok, false); assert.strictEqual(r.reason, 'insufficient'); // a,b already spent — no more unspent badges
  assert.strictEqual(inv.bombCount(), 1);
});

t('spendBomb decrements and floors at 0; returns false when empty', () => {
  const inv = new Inventory(fakeStore());
  assert.strictEqual(inv.spendBomb(), false);
  assert.strictEqual(inv.bombCount(), 0);
  inv.addBadge('a'); inv.addBadge('b'); inv.forgeBomb(2, { rand: alwaysSucceed });
  assert.strictEqual(inv.bombCount(), 1);
  assert.strictEqual(inv.spendBomb(), true);
  assert.strictEqual(inv.bombCount(), 0);
  assert.strictEqual(inv.spendBomb(), false);    // already 0 — floors, doesn't go negative
  assert.strictEqual(inv.bombCount(), 0);
});

t('addBomb grants bombs directly (quiz-driven forge path) without touching badges', () => {
  const inv = new Inventory(fakeStore());
  assert.strictEqual(inv.addBomb(), 1);            // default +1
  assert.strictEqual(inv.bombCount(), 1);
  assert.strictEqual(inv.badgeCount(), 0);         // no badge economy involved
  inv.addBomb(2); assert.strictEqual(inv.bombCount(), 3);
  inv.addBomb(-5); assert.strictEqual(inv.bombCount(), 3);   // negative is floored to a no-op, never decrements
});

t('state persists across separate Inventory instances over the same store', () => {
  const store = fakeStore();
  const inv1 = new Inventory(store);
  inv1.addBadge('x'); inv1.addBadge('y'); inv1.forgeBomb(2, { rand: alwaysSucceed });
  const inv2 = new Inventory(store);
  assert.strictEqual(inv2.bombCount(), 1);
  assert.strictEqual(inv2.hasBadge('x'), true);
});

t('a corrupted/garbage store value falls back to empty state instead of throwing', () => {
  const store = fakeStore();
  store.setItem('magicdust.badges', '{not json');
  store.setItem('magicdust.bombs', 'not-a-number');
  const inv = new Inventory(store);
  assert.strictEqual(inv.badgeCount(), 0);
  assert.strictEqual(inv.bombCount(), 0);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
