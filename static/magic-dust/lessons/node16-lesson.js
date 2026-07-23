(function () {
  const makeRail = (element, values) => {
    values.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.className = 'rail-cell';
      cell.dataset.index = String(index);
      cell.innerHTML = `<b>${value}</b><small>index ${index}</small>`;
      element.appendChild(cell);
    });
  };

  const searchRail = document.getElementById('searchRail');
  makeRail(searchRail, [4, 7, 2, 9]);
  const searchSteps = [
    { i:0, found:'False', compare:'4 == 7 → False', evidence:'Hai giá trị không bằng nhau. found vẫn là False.', classes:['current','','',''] },
    { i:1, found:'False', compare:'Chuyển sang index 1', evidence:'i tăng từ 0 thành 1.', classes:['checked','current','',''] },
    { i:1, found:'True', compare:'7 == 7 → True', evidence:'Hai giá trị bằng nhau. found đổi thành True.', classes:['checked','hit','uninspected','uninspected'] },
    { i:2, found:'True', compare:'not found → False · DỪNG', evidence:'Máy không kiểm tra index 2 và 3. OUTPUT là CO.', classes:['checked','hit','uninspected','uninspected'] },
  ];
  let searchStep = -1;
  const renderSearch = () => {
    const step = searchSteps[searchStep];
    [...searchRail.children].forEach((cell, index) => { cell.className = `rail-cell ${step.classes[index]}`.trim(); });
    document.getElementById('searchIndex').textContent = step.i;
    document.getElementById('searchFound').textContent = step.found;
    document.getElementById('searchCompare').textContent = step.compare;
    document.getElementById('searchEvidence').textContent = step.evidence;
    document.getElementById('searchNext').textContent = searchStep === searchSteps.length - 1 ? 'CHẠY LẠI ↺' : 'CHẠY BƯỚC TIẾP →';
  };
  document.getElementById('searchNext').addEventListener('click', () => { searchStep = (searchStep + 1) % searchSteps.length; renderSearch(); });

  const sortRail = document.getElementById('sortRail');
  const sortStates = [
    { j:0, values:[2,5,4,1], compare:'5 > 2 → True', evidence:'Hai ô đổi chỗ: [2, 5, 4, 1].' },
    { j:1, values:[2,4,5,1], compare:'5 > 4 → True', evidence:'Hai ô đổi chỗ: [2, 4, 5, 1].' },
    { j:2, values:[2,4,1,5], compare:'5 > 1 → True', evidence:'Hai ô đổi chỗ: [2, 4, 1, 5]. Số 5 đã tới cuối.' },
    { j:0, values:[2,4,1,5], compare:'2 > 4 → False', evidence:'Không đổi chỗ. Cặp đã theo thứ tự tăng dần.', nonSwap:true },
  ];
  makeRail(sortRail, [5, 2, 4, 1]);
  let sortStep = -1;
  const renderSort = () => {
    const step = sortStates[sortStep];
    [...sortRail.children].forEach((cell, index) => {
      cell.querySelector('b').textContent = step.values[index];
      cell.className = `rail-cell ${index === 3 && sortStep >= 2 ? 'locked' : ''}`.trim();
    });
    document.getElementById('compareGate').style.left = `calc(45px + ${step.j} * ((100% - 90px) / 4))`;
    document.getElementById('sortIndex').textContent = step.j;
    document.getElementById('sortCompare').textContent = step.compare;
    document.getElementById('sortEvidence').textContent = step.evidence;
    document.getElementById('sortNext').textContent = sortStep === sortStates.length - 1 ? 'CHẠY LẠI ↺' : 'SO CẶP TIẾP →';
  };
  document.getElementById('sortNext').addEventListener('click', () => { sortStep = (sortStep + 1) % sortStates.length; renderSort(); });

  const deck = new Reveal({ hash:true, controls:true, progress:true, center:true, transition:'slide', touch:true, plugins:[RevealNotes] });
  window.node16Lesson = { deck, searchSteps, sortStates };
  deck.initialize();
})();
