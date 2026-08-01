import { PYTHON_KIDS_NODES, pythonKidsLessonPage } from "./content/python-kids-curriculum.js";
import { completedPythonKidsIds, pythonKidsStatus } from "./python-kids-state.js";

const completed = completedPythonKidsIds(localStorage);
const islandArt = ["island-lighthouse-lit.webp", "island-pancake-lit.webp", "island-rocklets-lit.webp", "island-spire-lit.webp"];
const practice = [
  ["islandPYKIDPIXELS.html", "Pixel Pattern Lab", "Paint a tiny screen", "island-lighthouse-lit.webp"],
  ["islandPYKIDSNUMBERS.html", "Number Beat Lab", "Make values move", "island-rocklets-lit.webp"],
  ["islandPYKIDSWORDS.html", "Word Mixer Lab", "Shape a message", "island-pancake-lit.webp"],
  ["islandPYKIDSCHOICE.html", "Choice Maze", "Give the machine a path", "island-spire-lit.webp"],
  ["islandPYKIDSLOOPS.html", "Loop Lab", "Repeat a spell", "island-lighthouse-lit.webp"],
  ["islandPYKIDSROBOT.html", "Talking Robot Lab", "Teach a tiny robot", "island-lighthouse-lit.webp"],
  ["islandPYKIDSFUNCTIONS.html", "Function Forge", "Build reusable spells", "island-rocklets-lit.webp"],
  ["islandPYKIDSTESTS.html", "Test Detective Lab", "Hunt and fix bugs", "island-boss-mystery.webp"]
];

document.body.innerHTML = `<main class="kids-map"><div class="kids-cloud cloud-one"></div><div class="kids-cloud cloud-two"></div><header class="kids-hud"><a class="kids-back" href="./learning-portal.html">← Main Saga</a><div class="kids-brand"><span class="kids-eyebrow">KOTOPIA • NEW EXPEDITION</span><b>Python for Kids</b><small>Build tiny machines in the browser</small></div><div class="kids-progress"><strong>${completed.size}/${PYTHON_KIDS_NODES.length}</strong><span>islands explored</span></div></header><section class="kids-hero"><p class="kids-kicker">THE TINY MACHINE TRAIL</p><h1>Make a little computer come alive.</h1><p>Follow the islands, run every spell, and collect the skills to build your own talking machine.</p></section><section class="kids-world" aria-label="Python for Kids learning map"><svg class="kids-trail" viewBox="0 0 1000 3400" preserveAspectRatio="none" aria-hidden="true"><path d="M500 70 C180 230 820 350 500 540 S180 850 500 1030 S820 1340 500 1510 S180 1830 500 2010 S820 2310 500 2490 S180 2820 500 3020 S760 3250 500 3370" /></svg><div class="kids-path" id="kids-path"></div></section><section class="kids-practice"><div class="kids-section-heading"><p class="kids-kicker">SIDE ISLANDS</p><h2>Practice islands</h2><p>Take a detour whenever you want extra hands-on practice.</p></div><div class="kids-islands">${practice.map(([href, title, text, art]) => `<a class="kids-island" href="./${href}"><img src="./assets/world/islands/${art}" alt=""><span><b>${title}</b><small>${text}</small></span><strong>→</strong></a>`).join("")}</div></section><footer>Inspired by <a href="https://github.com/mytechnotalent/Python-For-Kids" target="_blank" rel="noreferrer">Python for Kids</a>. Made for the Magic Dust browser world — no micro:bit required.</footer></main>`;

const host = document.querySelector("#kids-path");
for (const node of PYTHON_KIDS_NODES) {
  const status = pythonKidsStatus(node.id, completed);
  const card = document.createElement("button");
  card.className = `kids-node ${status}`;
  card.disabled = status === "locked";
  const art = islandArt[node.id % islandArt.length];
  card.innerHTML = `<span class="kids-island-art"><img src="./assets/world/islands/${art}" alt=""></span><span class="kids-pin">${status === "done" ? "✓" : String(node.id + 1).padStart(2, "0")}</span><span class="kids-node-copy"><b>${node.title}</b><small>${node.short}</small><em>${status === "done" ? "Explored" : status === "current" ? "Your next island" : "Locked island"}</em></span>`;
  card.onclick = () => { if (status !== "locked") location.href = pythonKidsLessonPage(node.id); };
  host.append(card);
}
