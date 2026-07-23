(() => {
  document.getElementById("computeInside").onclick = () => {
    document.getElementById("insideValue").textContent = "12";
    document.getElementById("insideMessage").textContent =
      "Số 12 đang ở bên trong hàm. result bên ngoài vẫn chưa nhận được nó.";
  };
  document.getElementById("sendReturn").onclick = () => {
    document.querySelector(".sending").classList.add("sent");
    document.getElementById("callToken").textContent = "12";
    document.getElementById("resultState").textContent = "result = 12";
  };
  document.getElementById("repairReturn").onclick = () => {
    document.getElementById("repairLine").textContent = "return total";
    document.getElementById("repairResult").textContent = "result = 11";
    document.getElementById("repairMessage").textContent =
      "Đúng: return total gửi số 11 về chỗ gọi add_bonus(8, 3).";
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
  window.node19Lecture = deck;
})();
