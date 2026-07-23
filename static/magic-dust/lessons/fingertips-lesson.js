import { HAND_GRID, FINGERTIP_CELLS, SCAN_STEPS, TEST_CASES } from './fingertips-lesson-data.js';

const tipKeys = new Set(FINGERTIP_CELLS.map(([row, col]) => `${row}:${col}`));

function renderGrid(element) {
  HAND_GRID.forEach((line, row) => [...line].forEach((value, col) => {
    const cell = document.createElement('i');
    cell.textContent = value;
    cell.className = value === 'x' ? 'x' : 'zero';
    cell.dataset.row = row;
    cell.dataset.col = col;
    element.appendChild(cell);
  }));
}

document.querySelectorAll('.hand-grid').forEach(renderGrid);

const loupePattern = [
  0,0,0,0,
  0,1,1,0,
  0,1,1,0,
  0,1,1,0,
];
loupePattern.forEach(value => {
  const pixel = document.createElement('i');
  pixel.className = value ? 'hand' : 'empty';
  document.getElementById('pixelLoupe').appendChild(pixel);
});

document.querySelectorAll('.tip-chips .fragment').forEach((chip, index) => {
  chip.addEventListener('transitionend', () => {});
  const revealTip = () => {
    if (!chip.classList.contains('visible')) return;
    const [row, col] = chip.dataset.tip.split(':');
    document.querySelector(`[data-grid="find"] [data-row="${row}"][data-col="${col}"]`)?.classList.add('tip');
    document.getElementById('tipCounter').textContent = index + 1;
  };
  new MutationObserver(revealTip).observe(chip, { attributes:true, attributeFilter:['class'] });
});

function renderPattern(element, below) {
  const values = ['0','0','0','0','x','0','0',below,'0'];
  values.forEach(value => {
    const cell = document.createElement('i');
    cell.textContent = value;
    cell.className = value === 'x' ? 'x' : '';
    element.appendChild(cell);
  });
}
renderPattern(document.querySelector('.valid-pattern'), 'x');
renderPattern(document.querySelector('.noise-pattern'), '0');

document.querySelectorAll('[data-choice]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-choice]').forEach(item => item.classList.remove('correct', 'wrong'));
    const correct = button.dataset.choice === 'valid';
    button.classList.add(correct ? 'correct' : 'wrong');
    const feedback = document.getElementById('choiceFeedback');
    feedback.className = `choice-feedback ${correct ? 'good' : 'bad'}`;
    feedback.textContent = correct
      ? 'Đúng. Phía dưới vẫn là x, nên ô giữa còn nối với bàn tay.'
      : 'Nhìn ô phía dưới: mẫu B có 0, nên x ở giữa đang đứng riêng.';
  });
});

const colLabels = document.getElementById('colLabels');
const rowLabels = document.getElementById('rowLabels');
for (let col = 0; col < 9; col += 1) colLabels.insertAdjacentHTML('beforeend', `<b>${col}</b>`);
for (let row = 0; row < 5; row += 1) rowLabels.insertAdjacentHTML('beforeend', `<b>${row}</b>`);

function valueAt(row, col) {
  if (row < 0 || col < 0 || row >= HAND_GRID.length || col >= HAND_GRID[0].length) return 'ngoài ảnh';
  return HAND_GRID[row][col];
}

let scanIndex = -1;
function renderScan() {
  const step = SCAN_STEPS[scanIndex];
  const grid = document.getElementById('scanGrid');
  grid.querySelectorAll('i').forEach(cell => cell.classList.remove('cursor', 'read-neighbor'));
  FINGERTIP_CELLS.forEach(([row, col]) => {
    const foundAt = SCAN_STEPS.findIndex(item => item.row === row && item.col === col);
    if (foundAt <= scanIndex) grid.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add('found');
  });
  const current = grid.querySelector(`[data-row="${step.row}"][data-col="${step.col}"]`);
  current?.classList.add('cursor');
  const neighbors = [
    ['trên', step.row - 1, step.col], ['trái', step.row, step.col - 1],
    ['phải', step.row, step.col + 1], ['dưới', step.row + 1, step.col],
  ];
  const readout = document.getElementById('neighborReadout');
  readout.innerHTML = '';
  if (HAND_GRID[step.row][step.col] === 'x') {
    neighbors.forEach(([label, row, col]) => {
      const value = valueAt(row, col);
      readout.insertAdjacentHTML('beforeend', `<span>${label}: <b>${value}</b></span>`);
      grid.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add('read-neighbor');
    });
  } else {
    readout.innerHTML = '<span>giá trị: <b>0</b></span><span>không đọc hàng xóm</span>';
  }
  document.getElementById('scanPos').textContent = `[${step.row}, ${step.col}]`;
  document.getElementById('scanVerdict').textContent = step.verdict;
  document.getElementById('scanReason').textContent = step.reason;
  document.getElementById('scanCount').textContent = step.count;
  document.getElementById('scanNext').textContent = scanIndex === SCAN_STEPS.length - 1 ? 'CHẠY LẠI ↺' : 'BƯỚC TIẾP →';
}
document.getElementById('scanNext').addEventListener('click', () => {
  scanIndex = (scanIndex + 1) % SCAN_STEPS.length;
  renderScan();
});

const pipTests = document.getElementById('pipTests');
TEST_CASES.forEach(test => {
  const card = document.createElement('div');
  card.className = 'test-card';
  card.innerHTML = `<span>${test.name}</span><span>expected ${test.expected}</span><b>CHỜ</b>`;
  pipTests.appendChild(card);
});

let testIndex = -1;
document.getElementById('runTests').addEventListener('click', () => {
  const cards = [...pipTests.querySelectorAll('.test-card')];
  if (testIndex === cards.length - 1) {
    cards.forEach(card => { card.classList.remove('pass', 'running'); card.querySelector('b').textContent = 'CHỜ'; });
    testIndex = -1;
    document.getElementById('testResult').textContent = 'Pip sẽ gọi cùng một hàm với nhiều ma trận.';
  }
  cards.forEach(card => card.classList.remove('running'));
  testIndex += 1;
  const card = cards[testIndex];
  card.classList.add('running', 'pass');
  card.querySelector('b').textContent = 'PASS';
  document.getElementById('testResult').textContent = testIndex === cards.length - 1 ? 'RESULT 5/5' : `Pip đang chạy: ${testIndex + 1}/5`;
  document.getElementById('runTests').textContent = testIndex === cards.length - 1 ? 'CHẠY LẠI ↺' : 'TEST TIẾP →';
});

const deck = new Reveal({ hash:true, history:true, controls:true, progress:true, center:true, transition:'slide', backgroundTransition:'fade', touch:true, plugins:[RevealNotes] });
window.fingertipsDeck = deck;
await deck.initialize();
const markSeen = () => localStorage.setItem('magicdust.fingertips.lecture.v2', '1');
document.getElementById('challengeLink').addEventListener('click', markSeen);
deck.on('slidechanged', event => { if (event.indexh === deck.getHorizontalSlides().length - 1) markSeen(); });
window.fingertipsLesson = { HAND_GRID, FINGERTIP_CELLS, SCAN_STEPS, TEST_CASES, deck };
