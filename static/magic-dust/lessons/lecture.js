import { getLecture } from './content/lecture-manifest.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[char]);
const display = value => typeof value === 'object' ? JSON.stringify(value) : value;
const list = values => (values || []).map(value => `<span>${escapeHtml(value)}</span>`).join('');

function pipeline(slide) {
  const stages = slide.stages || [];
  return `<div class="stage-row" style="--count:${stages.length}">${stages.map((stage, index) => `<article class="stage fragment" data-fragment-index="${index}"><div><b>${escapeHtml(stage.label || stage.title)}</b><small>${escapeHtml(stage.detail || stage.body)}</small></div></article>`).join('')}</div>`;
}

function cards(slide) {
  return `<div class="concept-cards">${(slide.items || slide.cards || []).map((item, index) => `<article class="fragment" data-fragment-index="${index}"><strong>${escapeHtml(item.label || item.title)}</strong><p>${escapeHtml(item.detail || item.body || item.value)}</p></article>`).join('')}</div>`;
}

function trace(slide) {
  const lines = slide.code || slide.lines || [];
  const states = slide.states || slide.steps || slide.trace || slide.frames || slide.items || [];
  return `<div class="trace-board"><div class="code-lines">${lines.map((line, index) => `<code class="fragment" data-fragment-index="${index}">${escapeHtml(line)}</code>`).join('')}</div><div class="trace-state">${states.map((item, index) => `<div>STEP ${index + 1} = <b>${escapeHtml(display(item.value ?? item.detail ?? item))}</b></div>`).join('')}</div></div>`;
}

function tests(slide) {
  return `<div class="test-list">${(slide.tests || slide.checks || slide.cases || []).map((test, index) => `<div class="fragment ${test.pass === false ? 'fail' : ''}" data-fragment-index="${index}"><b>${test.pass === false ? 'FAIL' : 'PASS'}</b><span>${escapeHtml(test.name || display(test.input))}</span><span>${escapeHtml(display(test.expected ?? test.output ?? ''))}</span></div>`).join('')}</div>`;
}

function grid(slide) {
  let rows = Array.isArray(slide.grid) ? slide.grid : (Array.isArray(slide.rows) ? slide.rows : []);
  if (!rows.length && Number.isInteger(slide.rows) && Number.isInteger(slide.cols)) {
    rows = Array.from({ length:slide.rows }, () => Array(slide.cols).fill('0'));
    (slide.highlights || []).forEach(cell => { if (rows[cell.row]?.[cell.col] !== undefined) rows[cell.row][cell.col] = 'x'; });
  }
  if (!rows.length && slide.neighbors) {
    rows = [[0, slide.neighbors.up === 'outside' ? 0 : slide.neighbors.up, 0], [slide.neighbors.left, slide.center?.value || 'x', slide.neighbors.right], [0, slide.neighbors.down, 0]];
  }
  const cols = Math.max(1, ...rows.map(row => Array.isArray(row) ? row.length : String(row).length));
  const focusCells = slide.focus || slide.fingertipCells || (slide.center ? [[1,1]] : []);
  const focus = new Set(focusCells.map(cell => Array.isArray(cell) ? `${cell[0]}:${cell[1]}` : String(cell)));
  return `<div class="visual-grid" style="--cols:${cols}">${rows.flatMap((row, r) => [...row].map((value, c) => `<i class="${value === 'x' || value === 1 ? 'on' : ''} ${focus.has(`${r}:${c}`) ? 'focus fragment' : ''}">${escapeHtml(value)}</i>`)).join('')}</div>`;
}

function loop(slide) {
  const stages = (slide.stages || ['INPUT','UPDATE','RENDER']).slice(0, 3);
  return `<div class="loop-ring"><svg viewBox="0 0 520 360" aria-hidden="true"><path d="M145 205 C160 90 250 45 335 75 C445 110 465 240 370 290 C270 345 145 300 95 235"/></svg>${stages.map((stage, index) => `<article class="stage fragment" data-fragment-index="${index}"><div><b>${escapeHtml(stage.label || stage)}</b><small>${escapeHtml(stage.detail || '')}</small></div></article>`).join('')}</div>`;
}

function renderBody(slide) {
  if (slide.type === 'scene' && slide.image) return `<figure class="scene-image"><img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.title)}"></figure>`;
  if (slide.type === 'pipeline') return pipeline(slide);
  if (['trace','walkthrough','state-frames','timeline','emitter'].includes(slide.type)) return trace(slide);
  if (['image-grid','pixel-zoom','neighbors','scan'].includes(slide.type)) return grid(slide);
  if (slide.type === 'loop') return loop(slide);
  if (slide.type === 'tests') return tests(slide);
  if (slide.type === 'counterexample') return `<div class="counterexample"><strong>${escapeHtml(slide.label || 'Điểm dễ nhầm')}</strong><p>${escapeHtml(slide.body)}</p></div>`;
  return cards(slide);
}

function section(slide, index) {
  const body = slide.body || slide.lead || slide.prompt || '';
  return `<section data-background-gradient="radial-gradient(circle at 50% 35%,${index % 2 ? '#183957' : '#263b62'},#080d1d 72%)"><p class="eyebrow">${escapeHtml(slide.eyebrow || `${index + 1} · BÀI GIẢNG`)}</p><h2>${escapeHtml(slide.title)}</h2>${body ? `<p class="lead">${escapeHtml(body)}</p>` : ''}${renderBody(slide)}${slide.notes ? `<aside class="notes">${escapeHtml(slide.notes)}</aside>` : ''}</section>`;
}

async function boot() {
  const lecture = getLecture(id);
  if (!lecture) throw new Error(`Chưa có bài giảng cho địa điểm “${id || '(thiếu id)'}”.`);
  const practicePage = lecture.practicePage;
  const slides = document.getElementById('lectureSlides');
  slides.innerHTML = `<section data-background-gradient="radial-gradient(circle at 50% 30%,#263b62,#080d1d 72%)"><p class="eyebrow">KOTOPIA · BÀI GIẢNG TRƯỚC ĐẢO</p><h1>${escapeHtml(lecture.title)}</h1><p class="lead">${escapeHtml(lecture.objective)}</p><div class="concept-cards"><article><strong>DỮ LIỆU ĐÃ CÓ</strong><p>${escapeHtml(lecture.given)}</p></article><article><strong>ĐÍCH ĐẾN</strong><p>${escapeHtml(lecture.output)}</p></article></div></section>${lecture.slides.map(section).join('')}<section data-background-gradient="radial-gradient(circle at 50% 40%,#193f4c,#080d1d 72%)"><p class="eyebrow">ĐẾN LƯỢT BẠN</p><h2>${escapeHtml(lecture.learnerDoes)}</h2><div class="ready-list">${list([`Máy làm sẵn: ${lecture.machineDoes}`,`Dữ liệu bạn nhận: ${lecture.given}`,`OUTPUT đúng: ${lecture.output}`])}</div><a class="challenge-link" id="practiceLink" href="${escapeHtml(practicePage)}">VÀO THỰC HÀNH →</a></section>`;
  const deck = new Reveal({ hash:true, history:true, controls:true, progress:true, center:true, transition:'slide', backgroundTransition:'fade', touch:true, plugins:[RevealNotes] });
  window.magicDustLecture = { deck, lecture };
  await deck.initialize();
  const markSeen = () => localStorage.setItem(`magicdust.lecture.${lecture.id}.v1`, '1');
  deck.on('slidechanged', event => {
    if (event.indexh === deck.getHorizontalSlides().length - 1) markSeen();
  });
  document.getElementById('practiceLink').addEventListener('click', markSeen);
}

boot().catch(error => { const box = document.getElementById('lectureError'); box.hidden = false; box.textContent = error.message; console.error(error); });
