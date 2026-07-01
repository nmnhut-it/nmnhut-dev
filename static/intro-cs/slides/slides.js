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
  plugins: [RevealNotes, RevealHighlight, RevealSearch, RevealZoom]
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
        feedback.textContent = "Correct. Ask a learner to explain why.";
      } else {
        button.classList.add("incorrect");
        buttons[answer].classList.add("correct");
        feedback.textContent = "Not quite. Compare the selected answer with the highlighted one.";
      }
    });
  });
});

const leafSlides = Array.from(document.querySelectorAll(".slides section")).filter((section) => {
  return !Array.from(section.children).some((child) => child.tagName === "SECTION");
});

fetch("tts/manifest.json")
  .then((response) => {
    if (!response.ok) throw new Error("No slide narration manifest");
    return response.json();
  })
  .then((manifest) => {
    const wrapper = document.createElement("div");
    wrapper.className = "tts-control";

    const label = document.createElement("span");
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";

    wrapper.append(label, audio);
    document.body.appendChild(wrapper);

    function updateNarration() {
      const currentSlide = Reveal.getCurrentSlide();
      if (currentSlide.dataset.skipNarration === "true") {
        audio.pause();
        audio.removeAttribute("src");
        wrapper.hidden = true;
        return;
      }

      const index = leafSlides.indexOf(currentSlide);
      const item = manifest.slides[index];
      if (!item) {
        wrapper.hidden = true;
        return;
      }

      wrapper.hidden = false;
      label.textContent = `Narration ${index + 1} of ${manifest.slides.length}`;
      if (!audio.src.endsWith(item.src)) {
        audio.pause();
        audio.src = item.src;
      }
    }

    Reveal.on("slidechanged", updateNarration);
    Reveal.on("ready", updateNarration);
    updateNarration();
  })
  .catch(() => {
    // Audio is optional. The deck works without generated TTS files.
  });
