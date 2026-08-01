import assert from 'node:assert/strict';

const lessonNames = [
  'node22',
  'node23',
  'node24',
  'node25',
  'islandEMITTERLAB',
  'islandEFFECTSTAGE',
];

const visualCall = /\b(?:draw_particle_frame|present_image_frame|display|fire_vortex|lighten|darken|freeze|photo_booth)\s*\(/;

for (const lessonName of lessonNames) {
  const lesson = (await import(`./content/${lessonName}.js`)).default;
  const codeCells = lesson.cells.filter(cell => typeof cell.code === 'string');

  assert.ok(codeCells.length > 0, `${lessonName} must contain code cells`);
  for (const cell of codeCells) {
    assert.match(cell.code, visualCall, `${lessonName}/${cell.label} starter code must render a visual frame`);
    if (cell.solution) {
      assert.match(cell.solution, visualCall, `${lessonName}/${cell.label} solution must render a visual frame`);
    }
    assert.notEqual(cell.expectOut, null, `${lessonName}/${cell.label} must verify real output events`);
  }

  console.log(`  ok — ${lessonName}: ${codeCells.length} visual code cells`);
}

const node23 = (await import('./content/node23.js')).default;
const handOverlay = node23.cells.find(cell => cell.label === 'hand_rgba_overlay.py');
assert.match(handOverlay.code, /start_studio\s*\(/, 'hand overlay must start the camera studio before reading landmarks');
assert.match(handOverlay.solution, /start_studio\s*\(/, 'hand overlay solution must start the camera studio');

const node25 = (await import('./content/node25.js')).default;
const finalProject = node25.cells.find(cell => cell.label === 'final_interactive_broadcast.py');
const frameContract = finalProject.expectOut.all.find(expectation => expectation?.kind === 'image_frame');
assert.equal(frameContract?.minCount, 8, 'final project must require eight image-frame events');
assert.ok(frameContract?.text instanceof RegExp, 'final project must reject invalid/null frame payloads');
const stickerMask = node25.cells.find(cell => cell.label === 'project_sticker_mask.py');
assert.match(stickerMask.code, /mask\[mask_row\]\[mask_col\]\s*==\s*0/, 'sticker starter must retain the condition bug for the learner to fix');
assert.match(stickerMask.solution, /mask\[mask_row\]\[mask_col\]\s*==\s*1/, 'sticker solution must paint only mask cells equal to one');

console.log('\nparticle visual contract: ok');
