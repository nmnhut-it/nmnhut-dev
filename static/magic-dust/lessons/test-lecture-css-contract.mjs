import assert from "node:assert";
import { readFile } from "node:fs/promises";

const decks = [
  "node19", "node20", "node21", "node22", "node23", "node24", "node25",
  "islandDICTLOOKUP", "islandGIFTSETUP", "islandPARTICLELIFE", "islandEMITTERLAB",
];
const visualCss = [
  "node19-lesson.css", "node20-lesson.css", "node21-lesson.css", "node22-25-concept.css",
  "islandDICTLOOKUP-lesson.css", "islandGIFTSETUP-lesson.css",
  "islandPARTICLELIFE-lesson.css", "islandEMITTERLAB-lesson.css",
];
const palette = await readFile(new URL("lecture-palette.css", import.meta.url), "utf8");
assert(palette.includes('@import url("palette.css")'), "lecture palette must use the project palette");
assert(palette.includes('@import url("fonts.css")'), "lecture palette must use the project font faces");
assert(palette.includes('"Be Vietnam Pro"'), "lecture system must use the project font");
assert(!/#[0-9a-f]{3,8}\b/i.test(palette), "lecture palette must not duplicate project color values");

for (const file of visualCss) {
  const css = await readFile(new URL(file, import.meta.url), "utf8");
  assert(!/#[0-9a-f]{3,8}\b/i.test(css), `${file}: raw color bypasses lecture palette`);
  assert(!/\b(?:Inter|Segoe UI|ui-monospace|Cascadia Code)\b,?/i.test(css), `${file}: raw font bypasses lecture font tokens`);
}

for (const name of decks) {
  const html = await readFile(new URL(`${name}-lesson.html`, import.meta.url), "utf8");
  const deckCss = `${name}-lesson.css`;
  const conceptCss = "node22-25-concept.css";
  assert(
    html.includes(deckCss) || (["node22", "node23", "node24", "node25"].includes(name) && html.includes(conceptCss)),
    `${name}: missing deck or concept CSS`,
  );
  assert(html.includes("lecture-components.css"), `${name}: missing shared lecture CSS`);
  const localCss = html.includes(deckCss) ? deckCss : conceptCss;
  assert(html.indexOf("lecture-components.css") > html.indexOf(localCss), `${name}: shared CSS must load after local CSS`);
}

for (const name of ["islandGIFTSETUP", "islandPARTICLELIFE", "islandEMITTERLAB"]) {
  const html = await readFile(new URL(`${name}-lesson.html`, import.meta.url), "utf8");
  assert(html.includes("lecture-title") || html.includes("<h1") || html.includes("<h2"), `${name}: missing shared title surface`);
  assert(html.includes("lecture-purpose") || html.includes("instruction"), `${name}: missing shared purpose surface`);
  assert(html.includes("predict-box") || html.includes("prediction"), `${name}: missing shared prediction surface`);
  for (const className of ["run-demo", "observation", "concept-visual", "practice-brief"]) {
    assert(html.includes(className), `${name}: missing shared class ${className}`);
  }
}

console.log("lecture CSS contract passed for node19-25 and side lectures");
