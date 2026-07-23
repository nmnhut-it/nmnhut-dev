(() => {
  document.getElementById("cleanText").onclick = () => {
    document.getElementById("cleanValue").textContent = "FLOWER";
    document.getElementById("cleanObservation").textContent =
      'Quan sát: "  flower  " đã trở thành "FLOWER".';
  };
  document.getElementById("buildRecord").onclick = () => {
    document.getElementById("rSender").textContent = "BINH";
    document.getElementById("rGift").textContent = "FLOWER";
    document.getElementById("rPoints").textContent = "9";
    document.getElementById("rEffect").textContent = "BURST";
    document.getElementById("recordObservation").textContent =
      "Quan sát: dictionary giữ ba kết quả và số điểm 9 trong bốn khóa.";
  };
  document.getElementById("fixReturn").onclick = () => {
    document.getElementById("returnLine").textContent = "return item";
    document.getElementById("taskOutput").textContent = "LAN:GLOW";
    document.getElementById("taskObservation").textContent =
      "Đúng: return item đưa dictionary có sender LAN và effect GLOW ra ngoài hàm.";
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
  window.node21Lesson = deck;
})();
