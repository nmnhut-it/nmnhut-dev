import { PYTHON_KIDS_NODES, pythonKidsLessonPage } from "./content/python-kids-curriculum.js";
import { completedPythonKidsIds, pythonKidsStatus } from "./python-kids-state.js";

const completed = completedPythonKidsIds(localStorage);
document.body.innerHTML = `<main class="kids-map"><header><a href="./learning-portal.html">← Main Saga</a><div><b>PYTHON FOR KIDS</b><small>Build tiny machines in the browser</small></div><span>${completed.size}/${PYTHON_KIDS_NODES.length}</span></header><section class="kids-path" id="kids-path"></section><section class="kids-islands"><a class="kids-island" href="./islandPYKIDPIXELS.html">Pixel Pattern Lab →</a><a class="kids-island" href="./islandPYKIDSNUMBERS.html">Number Beat Lab →</a><a class="kids-island" href="./islandPYKIDSWORDS.html">Word Mixer Lab →</a><a class="kids-island" href="./islandPYKIDSCHOICE.html">Choice Maze →</a><a class="kids-island" href="./islandPYKIDSLOOPS.html">Loop Lab →</a><a class="kids-island" href="./islandPYKIDSROBOT.html">Talking Robot Lab →</a><a class="kids-island" href="./islandPYKIDSFUNCTIONS.html">Function Forge →</a><a class="kids-island" href="./islandPYKIDSTESTS.html">Test Detective Lab →</a></section><footer>Original browser adaptation inspired by <a href="https://github.com/mytechnotalent/Python-For-Kids" target="_blank" rel="noopener noreferrer">Python for Kids</a>. No micro:bit required.</footer></main>`;
const host = document.querySelector("#kids-path");
for (const node of PYTHON_KIDS_NODES) {
  const status = pythonKidsStatus(node.id, completed);
  const card = document.createElement("button");
  card.className = `kids-node ${status}`;
  card.disabled = status === "locked";
  card.innerHTML = `<strong>${status === "done" ? "✓" : String(node.id).padStart(2, "0")}</strong><span><b>${node.title}</b><small>${node.short}</small></span>`;
  card.onclick = () => { if (status !== "locked") location.href = pythonKidsLessonPage(node.id); };
  host.append(card);
}
