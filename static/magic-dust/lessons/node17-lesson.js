(function () {
  const indexed = "KOTOPIA";
  const sliced = "MAGICDUST";

  function ribbon(text, className = "") {
    const row = document.createElement("div");
    row.className = `char-ribbon ${className}`;
    [...text].forEach((char, index) => {
      const cell = document.createElement("i");
      cell.textContent = char;
      cell.dataset.index = index;
      row.appendChild(cell);
    });
    return row;
  }

  function ribbonLeft(stage, length) {
    const cell = innerWidth <= 700 ? 43 : 82;
    return stage.clientWidth / 2 - length * cell / 2;
  }

  function buildIndex() {
    const stage = document.getElementById("indexStage");
    stage.appendChild(ribbon(indexed));
    const needle = document.createElement("div");
    needle.className = "needle";
    stage.appendChild(needle);
    [...indexed].forEach((_, index) => {
      [[index, "top"], [index - indexed.length, "bottom"]].forEach(([value, side]) => {
        const label = document.createElement("span");
        label.className = `index-label ${side}`;
        label.textContent = value;
        label.dataset.index = index;
        stage.appendChild(label);
      });
    });
    const positions = [0, 3, indexed.length - 1];
    const expressions = ['text[0] → "K"', 'text[3] → "O"', 'text[-1] → "A"'];
    let current = 0;
    const render = () => {
      const cell = innerWidth <= 700 ? 43 : 82;
      const left = ribbonLeft(stage, indexed.length);
      stage.querySelectorAll(".index-label").forEach(label => { label.style.left = `${left + (Number(label.dataset.index) + .5) * cell}px`; });
      needle.style.left = `${left + (positions[current] + .5) * cell}px`;
      document.getElementById("indexReadout").textContent = expressions[current];
    };
    stage.addEventListener("click", () => { current = (current + 1) % positions.length; render(); });
    addEventListener("resize", render); render();
  }

  function buildSlice() {
    const stage = document.getElementById("sliceStage");
    const row = ribbon(sliced);
    [...row.children].forEach((cell, index) => cell.classList.add(index < 5 ? "selected" : "remainder"));
    stage.appendChild(row);
    const cutters = [0, 5].map(value => {
      const cutter = document.createElement("div");
      cutter.className = "cutter fragment";
      cutter.dataset.fragmentIndex = value === 0 ? "0" : "1";
      cutter.innerHTML = `<span>${value}</span>`;
      stage.appendChild(cutter); return { cutter, value };
    });
    const render = () => {
      const cell = innerWidth <= 700 ? 43 : 82;
      const left = ribbonLeft(stage, sliced.length);
      cutters.forEach(({ cutter, value }) => { cutter.style.left = `${left + value * cell}px`; });
    };
    addEventListener("resize", render); render();
  }

  buildIndex(); buildSlice();
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: "fade",
    touch: true,
    width: innerWidth,
    height: innerHeight,
    margin: 0,
    plugins: [RevealNotes]
  });
  window.node17Deck = deck;
  deck.initialize();
})();
