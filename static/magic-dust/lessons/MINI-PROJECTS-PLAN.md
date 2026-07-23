# Mini-projects ("XƯỞNG PHÉP") — practice-by-building plan

Owner ask (2026-07-04): students need MANY small mini-projects to
internalize the USES of input/output/variables — "ví dụ làm các phép
tính…". Exercises teach the mechanic; projects teach what it's FOR.

## Shape of one mini-project (no new engine needed)

A project is a short cell run using ONLY existing cell kinds:

1. `npc` — Pip states the BUILD GOAL in one line (what machine we're
   making, for whom — a story reason, not "bài tập 7").
2. `code` — starter skeleton with a labeled gap ("🔧 XƯỞNG PHÉP: <tên máy>"
   label prefix; comment khung tiếng Việt). Student completes it.
   `expectOut` = the loosest correct check (regex on the essential line;
   `{all:[...]}` for multi-line; open-ended ONLY when output truly varies).
3. Optional second `code` — "nâng cấp máy": one extension idea (add a
   variable, a second output line). Same machine, one step further —
   this is the generalize beat.
4. `checkpoint` — the technique the machine proved, stated in precise
   Python terms (per the checkpoint doctrine) → retrieval `quiz` follows.

Budget: one project ≈ 3-5 cells ≈ 3-4 min. Two projects per node max,
placed AFTER the node's teaching arcs, BEFORE the boss/ritual (they're
consolidation, and the ritual stays the finale).

## Project catalog (vocab-gated — nothing untaught, per CLAUDE.md rules)

### After node01 (read/say/biến/nối chuỗi `+`)
| Project | Build | Practices |
|---|---|---|
| **Máy làm thẻ tên** | hỏi tên + lớp → in thẻ 3 dòng (viền `say("=====")`) | read ×2, biến ×2, say nhiều dòng |
| **Máy kể chuyện** (mad-libs) | hỏi tên + con vật + món ăn → ghép thành 2 câu chuyện vui | read ×3, nối chuỗi nhiều mảnh, biến tái dùng |

### After node02 (read_num/say_num/`+ - * /`)
| Project | Build | Practices |
|---|---|---|
| **Máy tính tuổi** | hỏi năm sinh → `2026 - nam_sinh` → nói tuổi | read_num, phép trừ với literal, say_num |
| **Máy đo hình chữ nhật** | hỏi dài + rộng → nói CHU VI và DIỆN TÍCH | read_num ×2, 2 công thức, say_num ×2 |
| (chọn 2/3) **Máy đổi kẹo** | hỏi số gói × số kẹo mỗi gói → tổng | nhân, biến trung gian |

### After node04-05 (watch/if/elif/else) — đợt sau, pilot 2 node đầu trước
| Project | Build | Practices |
|---|---|---|
| **Máy chào theo dấu tay** | 1/3/5 ngón → ba lời chào khác nhau, else = "dấu lạ!" | watch, if/elif/else, display |
| **Oẳn tù tì với máy** | máy cố định một thế, tay bạn ra thế → if so sánh thắng/thua | watch, so sánh, nhánh |

Node06/07 đã dài (~14-17 phút) — KHÔNG thêm project ở đó đợt này; while
projects (đếm ngược, lũy tích) để dành cho đợt sau khi node07 được rà nhịp.

## Rollout

1. **Đợt 1 (build ngay khi content files rảnh):** 2 project node01 +
   2 project node02, theo đúng shape trên + validator sạch. Thêm mục
   "Mini-projects" vào AUTHORING.md (shape + catalog pointer).
2. **Đợt 2:** node04/05 projects, sau khi anh duyệt cảm giác đợt 1.
3. **Ý tưởng để sau:** project = "đảo phụ" trên map (side-island rẽ nhánh
   khỏi đường chính — map giờ là thế giới cuộn nên chỗ có sẵn); huy hiệu
   sưu tầm cho mỗi máy đã chế.

## Status
| Đợt | Trạng thái |
|---|---|
| Plan | doc này |
| Đợt 1 (node01+02) | chờ review-nodes agent trả content files |
| Đợt 2 (node04/05) | sau duyệt đợt 1 |
