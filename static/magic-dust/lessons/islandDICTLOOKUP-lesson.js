(() => {
  const compact = window.innerWidth < 700;
  const deck = new Reveal({ hash: true, controls: true, progress: true, center: true, touch: true, width: compact ? 390 : 960, height: compact ? 760 : 700, margin: compact ? 0.015 : 0.04, plugins: [RevealNotes] });
  window.dictLookupLecture = { deck, getTotalSlides: () => deck.getTotalSlides(), isReady: () => deck.isReady(), slide: index => deck.slide(index) }; deck.initialize();
  openStatus.onclick = () => { document.querySelector('[data-key="status"]').classList.add("open"); drawerReadout.innerHTML = '<code>status</code> khớp với hàng thứ hai, nên value được đọc là <strong>OPEN</strong>.'; };
  updatePoints.onclick = () => { pointsValue.textContent = "9"; document.querySelector('.gift-record [data-key="points"]').classList.add("active"); updateReadout.innerHTML = 'Phép gán chọn nhãn <code>points</code>, nên điểm đổi thành <strong>9</strong>; nhãn <code>name</code> không được chọn nên tên vẫn là <strong>COMET</strong>.'; };
  document.querySelectorAll('[data-check]').forEach(button => button.onclick = () => { const found = button.dataset.check === "sticker"; membershipResult.textContent = found ? "True" : "False"; membershipReadout.innerHTML = found ? '<code>sticker</code> nằm ở phía key, nên kết quả là <strong>True</strong>.' : '<code>STAR</code> nằm ở phía value; <code>in</code> không tìm value nên kết quả là <strong>False</strong>.'; });
  makeGift.onclick = () => { giftResult.innerHTML = 'Hàm đặt tham số vào hai key rồi <code>return</code> dictionary. Chỗ gọi nhận <strong>name = HEART</strong> và <strong>points = 6</strong>.'; };
})();
