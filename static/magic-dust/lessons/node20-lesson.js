(() => {
  const data = [
    ["name", "Pip"],
    ["power", "7"],
    ["color", "cyan"],
  ];
  const render = (host, values = data) => {
    host.innerHTML =
      '<div class="column-labels"><span>TÊN THÔNG TIN</span><span>DỮ LIỆU</span></div>';
    values.forEach(([key, value]) => {
      const row = document.createElement("div");
      row.className = "data-row";
      row.dataset.key = key;
      row.innerHTML = `<b>${key}</b><span>${value}</span>`;
      host.appendChild(row);
    });
  };
  document.querySelectorAll("[data-card]").forEach((host) => render(host));
  const activate = (card, key) =>
    card
      .querySelectorAll(".data-row")
      .forEach((row) =>
        row.classList.toggle("active", row.dataset.key === key),
      );

  document.getElementById("showPowerPair").onclick = () => {
    activate(document.querySelector('[data-card="intro"]'), "power");
    document
      .querySelector(".dictionary-intro pre")
      .classList.add("power-linked");
    document.getElementById("pairMessage").innerHTML =
      'Dòng <code>"power": 7</code> lưu một cặp: <code>power</code> là tên thông tin, còn <code>7</code> là dữ liệu của thông tin đó.';
  };
  document.getElementById("lookupPower").onclick = () => {
    activate(document.querySelector('[data-card="lookup"]'), "power");
    document.getElementById("lookupResult").textContent = "7";
    document.getElementById("lookupMessage").innerHTML =
      "Python tìm tên <code>power</code> và trả lại dữ liệu <code>7</code>. Cách viết ngắn cho tên thông tin là <code>key</code>; dữ liệu đi cùng nó là <code>value</code>.";
  };
  document.getElementById("updatePower").onclick = () => {
    const card = document.querySelector('[data-card="update"]');
    render(card, [
      ["name", "Pip"],
      ["power", "10"],
      ["color", "cyan"],
    ]);
    activate(card, "power");
    document.getElementById("updateMessage").innerHTML =
      "Chỉ dữ liệu của <code>power</code> đổi từ <code>7</code> thành <code>10</code>. <code>name</code> và <code>color</code> không đổi.";
  };
  const compact = window.innerWidth < 700;
  const deck = new Reveal({
    hash: true,
    transition: "fade",
    width: compact ? 390 : 960,
    height: compact ? 760 : 700,
    margin: compact ? 0.02 : 0.04,
  });
  deck.initialize();
  window.node20Lesson = { deck };
  window.node20Deck = deck;
})();
