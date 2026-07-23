# Playtest loop 2026-07-06: post-node7 + new islands

Scope: active V2 nodes after node 7 (`node08v2`, `node09v2`, `node10v2`) plus new side islands generated today (`islandWHILE`, `islandTYPES`, `islandPROJECT1`, `islandRPS`, `islandAR2`).

## Persona loop

1. **Learner A: weak foundation, presses RUN early**
   - Watches for: too many terms before action, runnable infinite loops, unclear "what do I edit?"
   - Finding: `islandWHILE` had an infinite-loop starter if RUN was pressed before adding the update line.
   - Fix: changed the starter to a safe-but-wrong update (`x = x + 5`) so it exits, then asks the learner to repair it to `x = x + 1`.

2. **Learner B: likes game feel, gets bored by dense lists**
   - Watches for: long term dumps, optional islands feeling like tests instead of toys.
   - Finding: `islandPROJECT1` opened with a dense list of every reused term.
   - Fix: split the opener into two smaller NPC beats: "three groups" first, then the project purpose.

3. **Learner C: fast learner, checks logic/vocab consistency**
   - Watches for: syntax used before it is taught, hidden new vocabulary, inconsistent unlocks.
   - Finding: `islandRPS` used `and` before node09 unlocked, and used `in (...)`, which is not taught.
   - Fix: moved RPS unlock to after node09 (`unlockAt: 10`) and replaced `in (...)` with plain `else:`.

4. **Learner D: reads Vietnamese wording closely**
   - Watches for: translated phrasing, overloaded terms, adult-sounding terminology.
   - Finding: `str` was used both as a type name and as `str(...)` without explicitly naming the mode switch.
   - Fix: node08 now says that `str` with parentheses is a command that converts a value to a string.
   - Finding: `node09` moved from `and/or` to `not/!=` without a pause.
   - Fix: added one bridge sentence before `not`: `and/or` connect conditions; `not` flips an existing true/false result.

## Round 1 result

- Safety improved: no newly identified runnable infinite-loop starter in the reviewed new islands.
- Sequencing improved: RPS now waits until the logic-gate node is complete.
- Vocab improved: removed untaught `in (...)` from learner-facing RPS code.
- Wording improved: reduced one dense project intro and clarified `str(...)`.

Next round should focus on actual click-through timing and whether node09 feels too long with `and`, `or`, `not`, `!=`, and parentheses in one sitting.

## Round 2: voice and natural Vietnamese

Held as natural:

- "vết nứt", "thông báo lỗi", "soi kiểu", "luật dừng": clear, playful, and tied to the existing game voice.
- "quá dễ dãi" / "quá khó tính": natural way to describe `or` too broad and `and` too strict.
- "may rủi": natural for the RPS machine opponent, as long as the gift is not named "vận rủi".

Changed:

- `ấn tay` -> `số ngón` / `1 ngón hoặc 3 ngón`: `ấn tay` sounded translated and unclear.
- `tự chăm biến đếm` -> `tự giữ rồi tự tăng biến đếm`: clearer and more natural.
- `VẬN RỦI ĐẤU TRƯỜNG` -> `XÚC XẮC ĐẤU TRƯỜNG`: "vận rủi" implies bad luck, not neutral randomness.
- `TRẢ VỀ một số ngẫu nhiên` -> `máy tự chọn 1, 3, hoặc 4`: less adult/technical for a side island.
- `phin` / `đổi phin` -> `hiệu ứng` / `đổi màu màn hình`: "phin" was ambiguous in Vietnamese.
- `câu phép` in learner-facing quiz -> `lệnh`: matches the authoring rule that callable things are "lệnh" before functions are taught.
