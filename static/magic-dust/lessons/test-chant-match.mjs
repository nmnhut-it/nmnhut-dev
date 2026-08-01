// node lessons/test-chant-match.mjs — asserts for engine/chant-match.js
// (the pure word-level matcher behind the onboarding "CODE!" gate).
import assert from 'node:assert';
import { levenshtein, chantHits, matchChant, CHANT_WORD, matchWord, wordHits, SHORT_TARGET_LEN } from './engine/chant-match.js';

let n = 0; const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

ok(CHANT_WORD === 'code', 'canon chant word');
ok(levenshtein('code', 'code') === 0, 'lev exact');
ok(levenshtein('codes', 'code') === 1, 'lev one insert');
ok(levenshtein('cho', 'code') > 1, 'lev cho > 1 (must NOT pass)');

// positives — however SR hears the yell, one word carries it
for (const t of [
  'code', 'CODE!', 'Code đi',
  'khô',                      // vi hearing of "code"
  'khâu',                     // vi hearing, user's expected reading
  'kho', 'cốt',
  'tôi hô code nè',           // chant embedded in chatter
  'codes', 'mode',            // en-US near-mishearings (edit distance 1)
  'koda', 'coda',             // en-US hearing a Vietnamese-accented "khô-đơ"
  'got', 'count', 'cold',     // REAL en-US captures of the yell (2026-07-04) — phonetic tier
  'goat', 'could', 'quote',
]) ok(matchChant(t), 'should match: ' + t);

// negatives — ordinary Vietnamese speech must not open the portal
for (const t of [
  '', 'ô', 'xin chào',
  'có ạ',                     // "có" folds to co — deliberately NOT accepted
  'cho em với',               // "cho" — deliberately NOT accepted
  'một hai ba bốn năm',
  'con cá không đâu',
  'mở cửa ra đi mà',
  'cat', 'gate', 'kit',       // K…T skeleton but the vowel core is not "o"-ish
  'want to go',
]) ok(!matchChant(t), 'should NOT match: ' + t);

// the probe helper reports WHICH word hit
ok(chantHits('ờ ờ khô nha').join() === 'kho', 'chantHits names the word');

// ── matchWord — generalized target-parameterized matcher ──
ok(SHORT_TARGET_LEN === 3, 'short-target threshold documented');

// short target 'say' (3 chars, at the threshold): exact fold-match plus a
// hand-tuned accept list is how real vi-VN/en-US hearings pass — no lev/
// phonetic looseness. "sây"/"xây" fold their diacritics off to "say"/"xay"
// directly (no accept entry needed for the diacritic-only case).
ok(matchWord('say', 'say'), 'matchWord exact');
ok(matchWord('SAY!', 'say'), 'matchWord fold case/punct');
ok(matchWord('cậu ơi sây đi', 'say'), 'matchWord diacritic-fold "sây" -> "say"');
ok(matchWord('xây nhà đi', 'say', ['xay']), 'matchWord accept-set "xây" -> "xay"');
ok(matchWord('sei there', 'say', ['sei']), 'matchWord accept-set "sei"');
ok(matchWord('nó kêu sê sê', 'say', ['se']), 'matchWord accept-set "sê" -> "se"');
ok(!matchWord('xin chào', 'say', ['xay', 'sei', 'se']), 'matchWord rejects unrelated Vietnamese chatter');
ok(!matchWord('code đi', 'say', ['xay', 'sei', 'se']), 'matchWord rejects the ONBOARDING chant word');

// custom accept list — a completely different target/list pair
ok(matchWord('read to me', 'read', ['rit']), 'matchWord custom target "read" exact fold-match');
ok(matchWord('rít cái coi', 'read', ['rit']), 'matchWord custom target "read" via custom accept "rit"');
ok(!matchWord('tao không biết', 'read', ['rit']), 'matchWord custom target "read" rejects unrelated');

// short-target strictness: 'say' is length 3 (== SHORT_TARGET_LEN), so the
// levenshtein/phonetic tiers are OFF even though "sat" is edit-distance 1
// from "say" — proves the loose tiers are deliberately not applied here.
ok(levenshtein('sat', 'say') === 1, 'lev("sat","say") is 1 (the loose distance exists)');
ok(!matchWord('sat', 'say'), 'matchWord "sat" vs "say" must NOT pass (short-target strictness)');
ok(!matchWord('sao the nhi', 'say'), 'matchWord "sao" (common vi word) vs "say" must NOT pass');

// long target (≥4 chars, above SHORT_TARGET_LEN) DOES get the loose tiers
ok(levenshtein('reed', 'read') === 1, 'lev("reed","read") is 1');
ok(matchWord('reed it', 'read'), 'matchWord long target "read" via levenshtein tier (no accept needed)');
ok(matchWord('ret it', 'read'), 'matchWord long target "read" via phonetic skeleton tier (rt vs rt)');
ok(!matchWord('xin chào', 'read'), 'matchWord long target still rejects unrelated chatter');

ok(wordHits('say say', 'say').length === 2, 'wordHits reports every matching word');

console.log(`chant-match: ${n} assertions passed`);
