(() => {
  const compact = window.innerWidth < 700;
  const deck = new Reveal({
    hash: true,
    transition: "none",
    width: compact ? 390 : 960,
    height: compact ? 760 : 700,
    margin: compact ? 0.02 : 0.04,
  });
  deck.initialize();
  window.particleLifeLecture = {
    deck,
    getTotalSlides: () => deck.getTotalSlides(),
    isReady: () => deck.isReady(),
    slide: (index) => deck.slide(index),
  };
  document.getElementById("renderOne").onclick = () => {
    document.getElementById("renderedParticle").classList.add("drawn");
    document.getElementById("renderProof").innerHTML =
      "Dictionary chỉ lưu dữ liệu. Hình chỉ xuất hiện khi hàm vẽ <code>draw_particle_frame([particle])</code> chạy.";
  };
  document.getElementById("runMove").onclick = async () => {
    const frames = [...document.querySelectorAll("#moveStrip .frame")],
      lines = [...document.querySelectorAll("#moveCode code")];
    for (let index = 1; index < frames.length; index++) {
      for (const line of lines) {
        lines.forEach((item) => item.classList.toggle("active", item === line));
        await wait(180);
      }
      frames[index].classList.add("visible");
    }
    lines.forEach((line) => line.classList.remove("active"));
    document.getElementById("moveProof").innerHTML =
      "Mỗi UPDATE cộng <code>vx = 3</code> và <code>vy = -4</code>. Sau hai lần, vị trí là <code>(36, 62)</code>.";
  };
  const states = Array.from({ length: 6 }, (_, index) => ({
    size: (2 - 0.2 * index).toFixed(1),
    alpha: 255 - 50 * index,
    life: 5 - index,
  }));
  document.getElementById("lifeStrip").innerHTML = states
    .map(
      (state, index) =>
        `<div class="frame${index === 0 ? " visible" : ""}"><small>F${index}</small><i style="--x:${28 + index * 8}%;--y:${72 - index * 7}%;--size:${state.size};--alpha:${state.alpha / 255}"></i><b>size ${state.size}<br>alpha ${state.alpha}<br>life ${state.life}</b></div>`,
    )
    .join("");
  document.getElementById("runLife").onclick = async () => {
    const frames = [...document.getElementById("lifeStrip").children],
      lines = [...document.getElementById("lifeCode").children];
    for (let index = 1; index < frames.length; index++) {
      for (const line of lines) {
        lines.forEach((item) => item.classList.toggle("active", item === line));
        await wait(90);
      }
      frames[index].classList.add("visible");
    }
    lines.forEach((line) => line.classList.remove("active"));
    document.getElementById("lifeProof").innerHTML =
      "Sau năm UPDATE: <code>size = 1.0</code>, <code>alpha = 5</code>, <code>life = 0</code>. Hình nhỏ và mờ dần qua từng frame.";
  };
  document.getElementById("runPractice").onclick = () => {
    document.getElementById("practiceLine").textContent =
      "update_particle(particle)";
    document.querySelector(".burst").classList.add("ran");
    document.getElementById("practiceOutput").textContent =
      "OUTPUT sau khi chạy: 0";
    document.getElementById("practiceProof").innerHTML =
      "Mỗi particle được UPDATE sáu lần, nên <code>life</code> giảm từ 6 xuống 0. OUTPUT đúng là <code>0</code>.";
  };
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
