(() => {
  const values = [[7, 8, 9], [10, 11, 12]];
  const grids = {};

  document.querySelectorAll('[data-grid]').forEach((host) => {
    const name = host.dataset.grid;
    grids[name] = [];
    values.forEach((row, rowIndex) => row.forEach((value, colIndex) => {
      const cell = document.createElement('i');
      cell.className = 'cell';
      cell.textContent = String(value);
      cell.dataset.row = String(rowIndex);
      cell.dataset.col = String(colIndex);
      cell.setAttribute('aria-label', `hàng ${rowIndex}, cột ${colIndex}, giá trị ${value}`);
      host.appendChild(cell);
      grids[name].push(cell);
    }));
  });

  const rowCells = (name, row) => grids[name].filter(cell => Number(cell.dataset.row) === row);
  const oneCell = (name, row, col) => grids[name].find(cell => Number(cell.dataset.row) === row && Number(cell.dataset.col) === col);
  const clear = (name) => grids[name].forEach(cell => cell.classList.remove('row-active', 'cell-active'));

  let rowsStep = 0;
  document.getElementById('rowsNext').addEventListener('click', () => {
    rowsStep = (rowsStep + 1) % 3;
    clear('rows');
    const message = document.getElementById('rowsMessage');
    if (rowsStep === 1) {
      rowCells('rows', 0).forEach(cell => cell.classList.add('row-active'));
      message.innerHTML = '<code>grid[0]</code> là cả hàng <code>[7, 8, 9]</code>.';
    } else if (rowsStep === 2) {
      rowCells('rows', 1).forEach(cell => cell.classList.add('row-active'));
      message.innerHTML = '<code>grid[1]</code> là cả hàng <code>[10, 11, 12]</code>.';
    } else message.innerHTML = 'Mỗi phần tử của <code>grid</code> là một hàng.';
  });

  let addressStep = 0;
  document.getElementById('addressNext').addEventListener('click', (event) => {
    addressStep = (addressStep + 1) % 3;
    clear('address');
    document.getElementById('rowToken').classList.toggle('active', addressStep === 1);
    document.getElementById('colToken').classList.toggle('active', addressStep === 2);
    document.getElementById('addressValue').classList.toggle('visible', addressStep === 2);
    if (addressStep === 1) {
      rowCells('address', 1).forEach(cell => cell.classList.add('row-active'));
      document.getElementById('addressMessage').innerHTML = '<code>grid[1]</code> chọn cả hàng <code>[10, 11, 12]</code>.';
      event.currentTarget.textContent = 'CHỌN CỘT 0';
    } else if (addressStep === 2) {
      rowCells('address', 1).forEach(cell => cell.classList.add('row-active'));
      oneCell('address', 1, 0).classList.add('cell-active');
      document.getElementById('addressValue').textContent = '→ 10';
      document.getElementById('addressMessage').innerHTML = 'Trong hàng vừa chọn, <code>[0]</code> lấy ô đầu tiên: <code>10</code>.';
      event.currentTarget.textContent = 'XEM LẠI';
    } else {
      document.getElementById('addressMessage').innerHTML = '<code>[1]</code> đầu tiên sẽ chọn cả một hàng.';
      event.currentTarget.textContent = 'CHỌN HÀNG 1';
    }
  });

  let taskStep = 0;
  document.getElementById('taskNext').addEventListener('click', (event) => {
    taskStep = (taskStep + 1) % 4;
    clear('task');
    const message = document.getElementById('taskMessage');
    if (taskStep === 1) {
      rowCells('task', 1).forEach(cell => cell.classList.add('row-active'));
      message.innerHTML = 'Bước 1: đề nói <strong>hàng 1</strong>, nên chọn hàng <code>[10, 11, 12]</code>.';
      event.currentTarget.textContent = 'CHỌN CỘT 0';
    } else if (taskStep === 2) {
      rowCells('task', 1).forEach(cell => cell.classList.add('row-active'));
      oneCell('task', 1, 0).classList.add('cell-active');
      message.innerHTML = 'Bước 2: trong hàng đó, <strong>cột 0</strong> giữ giá trị <code>10</code>.';
      event.currentTarget.textContent = 'SỬA CODE';
    } else if (taskStep === 3) {
      oneCell('task', 1, 0).classList.add('cell-active');
      document.getElementById('taskAddress').textContent = '[1][0]';
      message.innerHTML = 'Đúng: <code>grid[1][0]</code> tạo OUTPUT <code>10</code>.';
      event.currentTarget.textContent = 'XEM LẠI';
    } else {
      document.getElementById('taskAddress').textContent = '[0][1]';
      message.textContent = 'Đề cho hàng trước, rồi mới cho cột.';
      event.currentTarget.textContent = 'TÌM Ô CẦN ĐỌC';
    }
  });

  const deck = new Reveal({ hash: true, controls: true, progress: true, center: true, transition: 'fade' });
  deck.initialize();
  window.node15Lesson = { deck, grids };
  window.node15Deck = deck;
})();
