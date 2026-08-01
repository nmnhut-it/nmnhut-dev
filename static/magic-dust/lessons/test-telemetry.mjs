import assert from 'node:assert/strict';
import { cellKind, cellLabel, courseId } from './engine/telemetry.js';

assert.equal(cellKind({ code: '' }), 'code');
assert.equal(cellKind({ quiz: { title: 'Đố nhanh' } }), 'quiz');
assert.equal(cellKind({ forge: { title: 'Rèn thử' } }), 'forge');
assert.equal(cellKind({ ritual: true }), 'ritual');
assert.equal(cellKind({}), 'unknown');

assert.equal(cellLabel({ label: 'spell.py' }, 4), 'spell.py');
assert.equal(cellLabel({ quiz: { title: 'Đố nhanh' } }, 2), 'Đố nhanh');
assert.equal(cellLabel({ code: '' }, 3), 'code-3');

assert.equal(courseId({ index: 3 }), 'node:3');
assert.equal(courseId({ index: -1, sideIslandId: 'islandLISTTOOLS' }), 'island:islandLISTTOOLS');
assert.equal(courseId({ index: -1, sideIslandId: 'tower', title: 'THÁP VÔ ĐỊNH' }), 'tower:endless');
assert.equal(courseId({ index: -1, title: 'Tower' }), 'tower:endless');

console.log('telemetry helpers ok');
