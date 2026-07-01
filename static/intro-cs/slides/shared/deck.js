// Shared engine for the MIT 6.0001 lecture decks.
// - Initializes Reveal with notes + code highlighting.
// - Wires quiz blocks (.quiz[data-answer] + .quiz-feedback).
// - Optional narration: each leaf <section data-narration-id="sNN"> is matched
//   to an entry in tts/manifest.json ({ slides: [{ id, src }] }). If the manifest
//   or audio is absent, the deck works silently.

Reveal.initialize({
  hash: true,
  slideNumber: "c/t",
  controls: true,
  controlsTutorial: false,
  center: false,
  progress: true,
  transition: "slide",
  width: 1280,
  height: 720,
  margin: 0.04,
  plugins: (function () {
    const p = [];
    if (typeof RevealHighlight !== "undefined") p.push(RevealHighlight);
    if (typeof RevealNotes !== "undefined") p.push(RevealNotes);
    return p;
  })()
});

document.querySelectorAll(".quiz").forEach((quiz) => {
  const answer = Number(quiz.dataset.answer);
  const buttons = Array.from(quiz.querySelectorAll("button"));
  const feedback = quiz.querySelector(".quiz-feedback");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.classList.remove("correct", "incorrect");
        item.setAttribute("aria-pressed", "false");
      });
      button.setAttribute("aria-pressed", "true");
      if (index === answer) {
        button.classList.add("correct");
        feedback.textContent = "Correct.";
      } else {
        button.classList.add("incorrect");
        buttons[answer].classList.add("correct");
        feedback.textContent = "Not quite — the highlighted answer is correct.";
      }
    });
  });
});

// Narration keyed by data-narration-id (no positional coupling).
fetch("tts/manifest.json")
  .then((response) => {
    if (!response.ok) throw new Error("no narration manifest");
    return response.json();
  })
  .then((manifest) => {
    const byId = {};
    (manifest.slides || []).forEach((s) => { byId[s.id] = s.src; });

    const wrapper = document.createElement("div");
    wrapper.className = "tts-control";
    const label = document.createElement("span");
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    wrapper.append(label, audio);
    document.body.appendChild(wrapper);

    function update() {
      const current = Reveal.getCurrentSlide();
      const id = current && current.dataset ? current.dataset.narrationId : null;
      const src = id ? byId[id] : null;
      if (!src) { wrapper.hidden = true; audio.pause(); audio.removeAttribute("src"); return; }
      wrapper.hidden = false;
      label.textContent = `Narration ${id}`;
      if (!audio.src.endsWith(src)) { audio.pause(); audio.src = src; }
    }

    Reveal.on("slidechanged", update);
    Reveal.on("ready", update);
    update();
  })
  .catch(() => { /* audio optional */ });
