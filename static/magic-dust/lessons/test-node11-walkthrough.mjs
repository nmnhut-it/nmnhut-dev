import assert from 'node:assert/strict';
import N from './content/node11.js';
import { traceProgramCounter } from './engine/program-counter-cell.js';

const byLabel = label => N.cells.find(cell => cell.label === label);
const machineLabels = ['one_card_machine', 'two_card_machine', 'three_card_machine', 'pc_order_machine', 'if_to_goto_machine', 'while_to_goto_machine'];
const machines = machineLabels.map(label => byLabel(label)?.programCounter);
const firstMachineIndex = N.cells.findIndex(cell => cell.label === 'one_card_machine');
assert.ok(machines.every(Boolean), 'node11 must contain the basic, if, and while program-counter cells');

assert.equal(N.cells.some(cell => cell.walkthrough), false, 'node11 must not use the line-by-line Python walkthrough cell');
assert.equal(JSON.stringify(N.cells).includes('run_lines'), false, 'learner-facing node11 must not use run_lines');
assert.equal(JSON.stringify(N.cells).includes('line('), false, 'learner-facing node11 must use cards, not numbered Python lines');

const [one, two, three, order, ifMachine, whileMachine] = machines;
assert.equal(one.cards.length, 1, 'the first machine experience must contain one card only');
assert.equal(one.history, true, 'the first machine must introduce the punch-card artifact');
assert.ok(N.cells.slice(0, firstMachineIndex).some(cell => cell.remember?.some(text => /Punch card.*thẻ bìa.*bấm lỗ/i.test(text))), 'punch cards must be defined before program-counter mechanics');
assert.ok(N.cells.slice(0, firstMachineIndex).some(cell => cell.remember?.some(text => /mô hình đơn giản hóa/i.test(text))), 'lesson must distinguish the teaching model from historical machines');
assert.deepEqual(traceProgramCounter(one).steps.map(step => step.phase), ['start', 'select', 'output', 'goto']);
assert.deepEqual(traceProgramCounter(two).steps.map(step => step.pc), [10, 10, 10, 20, 20, 20, 99]);
assert.deepEqual(traceProgramCounter(three).steps.at(-1).output, ['START', 'CHECK', 'OPEN']);
assert.deepEqual(traceProgramCounter(order).steps.filter(step => step.phase === 'select').map(step => step.card), [10, 40, 20], 'machine must follow pc instead of visual card order');
assert.deepEqual(traceProgramCounter(ifMachine).steps.filter(step => step.phase === 'select').map(step => step.card), [10, 20, 30], 'true IF path must choose YES and rejoin after the branch');
assert.deepEqual(traceProgramCounter(whileMachine).steps.at(-1), {
  phase: 'test', pc: 99, card: 10, output: ['2', '1'], memory: 'count = 0; count > 0 → SAI',
  message: 'Lần này count > 0 sai. Máy chọn NO, gán pc = 99 và kết thúc vòng lặp.',
});

for (const machine of machines) {
  assert.ok(machine.observeMs >= 1200, 'each machine action must leave observation time');
  assert.equal(machine.end, 99);
}

const openingQuizzes = N.cells.slice(0, firstMachineIndex).filter(cell => cell.quiz);
assert.deepEqual(openingQuizzes.map(cell => cell.quiz.title), ['Ôn thứ tự chạy'], 'only the retained prior-knowledge review may appear before the one-card experience');
assert.doesNotMatch(JSON.stringify(openingQuizzes), /GOTO|program counter|\bpc\b|END 99/i, 'the opening review must not test GOTO concepts before students experience the card machine');
assert.ok(N.cells.slice(0, firstMachineIndex).some(cell => cell.remember?.some(text => /99.*END.*không có thẻ 99/i.test(text))), '99 must be defined as END before the first machine starts');

const twoMachineIndex = N.cells.findIndex(cell => cell.label === 'two_card_machine');
const firstCodeIndex = N.cells.findIndex(cell => cell.code !== undefined);
const connectTwoIndex = N.cells.findIndex(cell => cell.label === 'connect_two_cards.py');
const threeMachineIndex = N.cells.findIndex(cell => cell.label === 'three_card_machine');
const addThirdIndex = N.cells.findIndex(cell => cell.label === 'add_third_card.py');
const orderMachineIndex = N.cells.findIndex(cell => cell.label === 'pc_order_machine');
const repairIndex = N.cells.findIndex(cell => cell.label === 'repair_route.py');
assert.ok(firstCodeIndex > firstMachineIndex, 'students must see the one-card machine before the restored first card exercise');
assert.ok(connectTwoIndex > twoMachineIndex, 'students must see two cards run before editing the two-card connection');
assert.ok(addThirdIndex > threeMachineIndex, 'students must see a correct three-card machine before adding a card');
assert.ok(repairIndex > orderMachineIndex, 'students must see pc override visual order before repairing that pattern');
assert.ok(N.cells.findIndex(cell => cell.label === 'if_to_goto_machine') > repairIndex, 'IF translation must follow unconditional GOTO foundations');
assert.ok(N.cells.findIndex(cell => cell.label === 'while_to_goto_machine') > N.cells.findIndex(cell => cell.label === 'if_to_goto_machine'), 'WHILE translation must follow IF branching');
assert.equal(N.cells.filter(cell => cell.checkpoint).length, 4, 'expanded lesson must keep checkpoint density within the project cap');
assert.ok(N.cells.some(cell => cell.remember?.some(text => /`if`.*TEST.*YES.*NO/i.test(text))), 'lesson must retain IF ↔ GOTO translation');
assert.ok(N.cells.some(cell => cell.remember?.some(text => /`while`.*GOTO.*quay lại/i.test(text))), 'lesson must retain WHILE ↔ GOTO translation');

for (const label of ['connect_two_cards.py', 'add_third_card.py', 'repair_route.py', 'repair_missing_card.py']) {
  const cell = byLabel(label);
  assert.match(cell.code, /from old_computer import card, run_cards/);
  assert.match(cell.note, /không có INPUT từ bên ngoài/i);
  assert.match(cell.note, /PROCESS:/);
  assert.match(cell.note, /OUTPUT đúng/);
}

assert.ok(N.cells.some(cell => /RUN không dừng sau từng thẻ/i.test(cell.npc || '')), 'lesson must explicitly distinguish full RUN from the slow machine model');
console.log('node11 pedagogy: card machine first, full-program RUN second, no fake Python line stepping');
