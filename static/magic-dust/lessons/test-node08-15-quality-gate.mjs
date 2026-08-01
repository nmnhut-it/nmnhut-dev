import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { GUIDED_NODE_CONTRACTS } from './node08-15-quality-contract.mjs';
import { normalizeCodeTrace } from './engine/code-trace-cell.js';
import { deriveProgramCounterPrediction, traceProgramCounter } from './engine/program-counter-cell.js';

const args = process.argv.slice(2);
const baselineOnly = args.includes('--baseline');
const requestedNode = args.includes('--node') ? args[args.indexOf('--node') + 1] : null;
const contracts = Object.entries(GUIDED_NODE_CONTRACTS).filter(([name]) => !requestedNode || name === requestedNode);
assert.ok(contracts.length, requestedNode ? `unknown node contract: ${requestedNode}` : 'no node contracts');

const flattenText = value => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(flattenText).join('\n');
  if (value && typeof value === 'object') return Object.values(value).map(flattenText).join('\n');
  return '';
};
const concreteQuestion = text => /`[^`]+`|\d|OUTPUT|INPUT|cho sẵn|giá trị|dòng|đoạn code|chương trình|nếu|với dữ liệu/i.test(text);
const dependentQuestion = text => /ở trên|vừa rồi|như trên|đoạn trước|bài trước/i.test(text);

for (const [name, contract] of contracts) {
  const url = `${pathToFileURL(resolve(contract.file)).href}?quality=${Date.now()}-${name}`;
  const lesson = (await import(url)).default;
  const cells = Array.isArray(lesson.cells) ? lesson.cells : [];
  const codeCells = cells.filter(cell => cell.code !== undefined);
  const quizQuestions = cells.flatMap(cell => cell.quiz?.questions || []);
  const checkpoints = cells.filter(cell => cell.checkpoint).length;
  const labels = new Set(cells.map(cell => cell.label).filter(Boolean));
  const lessonText = flattenText(lesson);

  assert.ok(cells.length >= contract.minimum.cells, `${name}: removed lesson cells (${cells.length} < ${contract.minimum.cells})`);
  assert.ok(codeCells.length >= contract.minimum.code, `${name}: removed code exercises (${codeCells.length} < ${contract.minimum.code})`);
  assert.ok(quizQuestions.length >= contract.minimum.quizQuestions, `${name}: removed quiz questions (${quizQuestions.length} < ${contract.minimum.quizQuestions})`);
  assert.ok(checkpoints >= contract.minimum.checkpoints, `${name}: removed checkpoints (${checkpoints} < ${contract.minimum.checkpoints})`);
  for (const label of contract.labels) assert.ok(labels.has(label), `${name}: missing existing lesson/practice label ${label}`);
  for (const source of contract.concepts) assert.match(lessonText, new RegExp(source, 'i'), `${name}: missing required concept /${source}/i`);

  for (const cell of codeCells) {
    const id = cell.label || '(unlabelled code cell)';
    assert.ok(typeof cell.note === 'string' && cell.note.trim(), `${name}/${id}: exercise needs an explicit task`);
    assert.ok(typeof cell.solution === 'string' && cell.solution.trim(), `${name}/${id}: exercise needs a retained solution`);
    assert.ok(cell.expectOut && typeof cell.expectOut === 'object', `${name}/${id}: exercise needs exact success evidence in expectOut`);
  }

  const questionTexts = quizQuestions.map(question => flattenText(question));
  for (const text of questionTexts) assert.ok(!dependentQuestion(text), `${name}: quiz depends on earlier content: ${text}`);
  const concreteCount = questionTexts.filter(concreteQuestion).length;
  assert.ok(concreteCount / Math.max(1, questionTexts.length) >= 0.65, `${name}: fewer than 65% of quiz questions are concrete level-2+ checks`);

  if (!baselineOnly) {
    const guidedCells = cells.filter(cell => cell.execution || cell.walkthrough || cell.programCounter);
    assert.ok(guidedCells.length >= 1, `${name}: needs at least one guided line-by-line observation cell`);
    for (const cell of cells.filter(cell => cell.execution)) {
      const frames = normalizeCodeTrace(cell.execution).frames;
      const predictions = frames.filter(frame => frame.predict);
      assert.ok(predictions.length >= 1, `${name}/${cell.label || 'execution'}: needs an active-recall prediction before a state-changing line`);
      assert.ok(predictions.length / Math.max(1, frames.length) >= 0.5, `${name}/${cell.label || 'execution'}: fewer than half of the observed lines ask the learner to predict`);
    }
    for (const cell of cells.filter(cell => cell.programCounter)) {
      const { cfg, steps } = traceProgramCounter(cell.programCounter);
      const predictions = steps.map((step, index) => deriveProgramCounterPrediction(step, steps[index - 1], cfg)).filter(Boolean);
      assert.ok(predictions.length / Math.max(1, steps.length) >= 0.5, `${name}/${cell.label || 'programCounter'}: fewer than half of the machine steps ask the learner to predict`);
    }
    for (const source of contract.guidedConcepts || []) assert.match(lessonText, new RegExp(source, 'i'), `${name}: guided redesign is missing /${source}/i`);
  }

  console.log(`${name}: ${cells.length} cells, ${codeCells.length} code tasks, ${quizQuestions.length} quiz questions, ${checkpoints} checkpoints — coverage retained`);
}

console.log(baselineOnly ? 'node08-15 baseline quality gate: pass' : 'node08-15 guided quality gate: pass');
