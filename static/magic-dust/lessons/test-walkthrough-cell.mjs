import assert from 'node:assert/strict';
import { normalizeWalkthrough } from './engine/walkthrough-cell.js';

const normalized = normalizeWalkthrough({
  title: 'Từng dòng',
  code: ['a = 1', 'show(a)'],
  steps: [
    { line: 1, label: 'EMIT — TẠO DỮ LIỆU', explain: 'Gán giá trị.', memory: 'a = 1' },
    { line: 9, explain: 'Hiện kết quả.', action: { action: 'light_board_clear' }, observeMs: 9999 },
  ],
});

assert.equal(normalized.title, 'Từng dòng');
assert.deepEqual(normalized.code, ['a = 1', 'show(a)']);
assert.equal(normalized.steps[0].line, 1);
assert.equal(normalized.steps[0].label, 'EMIT — TẠO DỮ LIỆU');
assert.equal(normalized.steps[1].line, 2, 'line numbers clamp to an existing source line');
assert.equal(normalized.steps[1].observeMs, 4000, 'observation time is bounded');
assert.deepEqual(normalized.steps[1].action, { action: 'light_board_clear' });
console.log('  ok — walkthrough normalization keeps every step tied to a visible code line');
