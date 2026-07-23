(function () {
  const hand = [
    '000000000',
    '0x00x00x0',
    '0x00x00x0',
    '0xxxxxxx0',
    '0xxxxxxx0',
  ];
  const peaks = new Set(['1:1', '1:4', '1:7']);

  document.querySelectorAll('.mask-matrix').forEach(matrix => {
    const mode = matrix.dataset.mode;
    hand.forEach((row, rowIndex) => [...row].forEach((value, colIndex) => {
      const cell = document.createElement('i');
      const key = `${rowIndex}:${colIndex}`;
      cell.textContent = value;
      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;
      cell.className = value === 'x' ? 'hand-cell' : 'empty-cell';
      if (mode === 'peaks' && peaks.has(key)) {
        cell.classList.add('peak-cell', 'fragment');
        cell.dataset.fragmentIndex = String([...peaks].indexOf(key));
      }
      matrix.appendChild(cell);
    }));
  });

  const deck = new Reveal({ hash: true, history: true, controls: true, progress: true, center: true, transition: 'slide', backgroundTransition: 'fade', touch: true, plugins: [RevealNotes] });
  window.fingertipsDeck = deck;
  deck.initialize();

  const scanSteps = [
    { row: 0, col: 0, count: 0, text: 'Ô 0 là nền — bỏ qua.' },
    { row: 1, col: 1, count: 1, text: 'Ba phía là nền, phía dưới là x — tìm thấy đỉnh thứ nhất.' },
    { row: 1, col: 2, count: 1, text: 'Ô 0 là nền — bỏ qua.' },
    { row: 1, col: 4, count: 2, text: 'Đủ bốn điều kiện — tìm thấy đỉnh thứ hai.' },
    { row: 1, col: 7, count: 3, text: 'Đủ bốn điều kiện — tìm thấy đỉnh thứ ba.' },
    { row: 4, col: 8, count: 3, text: 'Quét xong ma trận. Kết quả là 3.' },
  ];
  let scanIndex = -1;
  const scanMatrix = document.getElementById('scanMatrix');
  const scanButton = document.getElementById('scanNext');
  const renderScan = () => {
    const step = scanSteps[scanIndex];
    scanMatrix.querySelectorAll('i').forEach(cell => cell.classList.remove('scanning', 'found'));
    const cell = scanMatrix.querySelector(`[data-row="${step.row}"][data-col="${step.col}"]`);
    cell.classList.add('scanning');
    scanSteps.slice(0, scanIndex + 1).filter(item => item.count > 0).forEach(item => {
      const found = scanMatrix.querySelector(`[data-row="${item.row}"][data-col="${item.col}"]`);
      if (peaks.has(`${item.row}:${item.col}`)) found.classList.add('found');
    });
    document.getElementById('scanPosition').textContent = `[${step.row}, ${step.col}]`;
    document.getElementById('scanReason').textContent = step.text;
    document.getElementById('scanCount').textContent = step.count;
    scanButton.textContent = scanIndex === scanSteps.length - 1 ? 'CHẠY LẠI ↺' : 'CHẠY BƯỚC TIẾP →';
  };
  scanButton.addEventListener('click', () => { scanIndex = (scanIndex + 1) % scanSteps.length; renderScan(); });

  deck.on('slidechanged', () => { if (deck.isLastSlide()) localStorage.setItem('magicdust.fingertips.lecture.v1', '1'); });
  document.getElementById('challengeLink').addEventListener('click', () => localStorage.setItem('magicdust.fingertips.lecture.v1', '1'));
})();
