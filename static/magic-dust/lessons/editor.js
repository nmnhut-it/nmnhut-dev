// editor.js — the hand-editing workbench logic. TEACHER-ONLY tool, fresh
// page (does not import node.js / the lesson runtime), so none of the
// game's global keyboard traps (Space/1/2 test hooks, camera gestures)
// exist here — safe for a form-heavy page.
import { serializeNode } from './editor-serializer.mjs';

const NODES = ['node00', 'node01', 'node02', 'node03', 'node04', 'node05', 'node06', 'node07',
  'node08', 'node09', 'node10', 'node11', 'node12', 'node13', 'node14', 'node15',
  'node00v2', 'node01v2', 'node02v2', 'node03v2', 'node04v2', 'node05v2', 'node06v2', 'node07v2',
  'node08v2', 'node09v2', 'node10v2',
  'TEMPLATE'];   // v2 = pedagogy experiment clones (PEDAGOGY-V2-PLAN.md)
const GESTURE_VERBS_FOR_QUIZ = [['', '(mặc định — giơ ngón tay/tap)'], ['track', 'track (đuổi theo)']];
const GESTURE_VERBS_FOR_BOSS = [['', '(mặc định — giơ ngón tay/tap)'], ['swipe', 'swipe (quẹt trái/phải)'], ['track', 'track (đuổi theo)']];

const $app = document.getElementById('app');
const $picker = document.getElementById('nodePicker');
const $ping = document.getElementById('pingStatus');
const $save = document.getElementById('saveBtn');
const $reload = document.getElementById('reloadBtn');

let state = { file: null, node: null, dirty: false };
let serverCanSave = false;

// ── bootstrap ──
NODES.forEach(n => { const o = document.createElement('option'); o.value = n; o.textContent = n; $picker.appendChild(o); });
$picker.addEventListener('change', () => loadNode($picker.value));
$reload.addEventListener('click', () => loadNode(state.file, true));
$save.addEventListener('click', onSave);

pingServer();
loadNode(NODES[0]);

async function pingServer() {
  try {
    const r = await fetch('/api/editor-ping', { cache: 'no-store' });
    const j = await r.json();
    serverCanSave = !!(r.ok && j && j.ok);
  } catch { serverCanSave = false; }
  $ping.textContent = serverCanSave ? 'server: có thể lưu trực tiếp' : 'server: KHÔNG có API lưu — Save sẽ tải file xuống';
  $ping.className = 'status ' + (serverCanSave ? 'ok' : 'err');
}

async function loadNode(file, force) {
  if (state.dirty && !force && !confirm('Có thay đổi chưa lưu — tải lại và bỏ chúng?')) return;
  $picker.value = file;
  const mod = await import(`./content/${file}.js?t=${Date.now()}`);
  state = { file, node: structuredClone(mod.default), dirty: false };
  render();
}

function markDirty() { state.dirty = true; }

// ── small DOM helpers ──
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null) el.setAttribute(k, v);
  }
  kids.flat().forEach(k => { if (k == null) return; el.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
  return el;
}
function field(labelText, inputEl, hint) {
  const wrap = h('div', {});
  wrap.appendChild(h('label', {}, labelText));
  wrap.appendChild(inputEl);
  if (hint) wrap.appendChild(h('small', { class: 'hint' }, hint));
  return wrap;
}
function textInput(value, onInput, placeholder) {
  const i = h('input', { type: 'text', value: value ?? '', placeholder: placeholder || '' });
  i.addEventListener('input', () => { onInput(i.value); markDirty(); });
  return i;
}
function numberInput(value, onInput, placeholder) {
  const i = h('input', { type: 'number', value: value ?? '', placeholder: placeholder || '' });
  i.addEventListener('input', () => { onInput(i.value === '' ? undefined : Number(i.value)); markDirty(); });
  return i;
}
function textArea(value, onInput, rows, mono) {
  const t = h('textarea', { rows: rows || 3 }, value ?? '');
  t.value = value ?? '';
  if (mono) t.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); const s = t.selectionStart, en = t.selectionEnd;
      t.value = t.value.slice(0, s) + '  ' + t.value.slice(en); t.selectionStart = t.selectionEnd = s + 2; onInput(t.value); markDirty(); }
  });
  t.addEventListener('input', () => { onInput(t.value); markDirty(); });
  return t;
}
function select(options, value, onChange) {
  const s = h('select', {});
  options.forEach(([v, label]) => { const o = h('option', { value: v }, label); if (v === (value ?? '')) o.selected = true; s.appendChild(o); });
  s.addEventListener('change', () => { onChange(s.value); markDirty(); });
  return s;
}
function checkbox(checked, onChange) {
  const c = h('input', { type: 'checkbox' });
  c.checked = !!checked;
  c.addEventListener('change', () => { onChange(c.checked); markDirty(); });
  return c;
}

// ── header form ──
function renderHeader() {
  const N = state.node;
  const box = h('fieldset', {}, h('legend', {}, 'Node header'));
  box.appendChild(field('index (số node, 0-based)', numberInput(N.index, v => N.index = v)));
  box.appendChild(field('title', textInput(N.title, v => N.title = v)));
  box.appendChild(field('subtitle', textInput(N.subtitle, v => N.subtitle = v)));

  N.bundle = N.bundle || {};
  const bundleRow = h('div', { class: 'grid2' });
  bundleRow.appendChild(field('bundle.art', textInput(N.bundle.art, v => N.bundle.art = v)));
  bundleRow.appendChild(field('bundle.name', textInput(N.bundle.name, v => N.bundle.name = v)));
  box.appendChild(bundleRow);

  N.machine = N.machine || {};
  const machineRow = h('div', { class: 'grid3' });
  machineRow.appendChild(field('machine.art', textInput(N.machine.art, v => N.machine.art = v)));
  machineRow.appendChild(field('machine.name', textInput(N.machine.name, v => N.machine.name = v)));
  machineRow.appendChild(field('machine.blurb', textInput(N.machine.blurb, v => N.machine.blurb = v)));
  box.appendChild(machineRow);

  box.appendChild(field('modules (JSON: {name: "../py/xxx/__init__.py"})',
    textArea(JSON.stringify(N.modules || {}, null, 2), v => {
      try { N.modules = JSON.parse(v); box._modulesErr.textContent = ''; }
      catch (e) { box._modulesErr.textContent = 'JSON lỗi: ' + e.message; }
    }, 3, true)));
  box._modulesErr = h('small', { class: 'hint', style: 'color:#d69a20' });
  box.appendChild(box._modulesErr);

  box.appendChild(renderRitual());
  return box;
}

function renderRitual() {
  const N = state.node;
  N.ritual = N.ritual || {};
  const R = N.ritual;
  const box = h('fieldset', {}, h('legend', {}, 'Ritual'));
  const row = h('div', { class: 'grid2' });
  row.appendChild(field('gesture (emoji, vd ✋)', textInput(R.gesture, v => R.gesture = v)));
  row.appendChild(field('prompt', textInput(R.prompt, v => R.prompt = v)));
  box.appendChild(row);
  box.appendChild(field('chant (từ niệm — để trống nếu không dùng)', textInput(R.chant, v => R.chant = v || undefined)));
  box.appendChild(field('chantAccept (các cách nghe, phân tách bởi dấu phẩy)',
    textInput((R.chantAccept || []).join(', '), v => {
      const arr = v.split(',').map(s => s.trim()).filter(Boolean);
      R.chantAccept = arr.length ? arr : undefined;
    })));

  // choice: {q,a,correct}
  const hasChoice = h('input', { type: 'checkbox' });
  hasChoice.checked = !!R.choice;
  const choiceBox = h('div', {});
  function renderChoice() {
    choiceBox.innerHTML = '';
    if (!R.choice) return;
    choiceBox.appendChild(field('choice.q', textInput(R.choice.q, v => R.choice.q = v)));
    R.choice.a = R.choice.a || ['', ''];
    const ansWrap = h('div', {});
    R.choice.a.forEach((a, i) => {
      const rowEl = h('div', { class: 'qq-answer-row' });
      const radio = h('input', { type: 'radio', name: 'choice-correct' });
      radio.checked = R.choice.correct === i;
      radio.addEventListener('change', () => { R.choice.correct = i; markDirty(); });
      rowEl.appendChild(radio);
      rowEl.appendChild(textInput(a, v => R.choice.a[i] = v));
      const rm = h('button', { onclick: () => { R.choice.a.splice(i, 1); if (R.choice.correct >= R.choice.a.length) R.choice.correct = 0; renderChoice(); } }, '✕');
      rowEl.appendChild(rm);
      ansWrap.appendChild(rowEl);
    });
    choiceBox.appendChild(ansWrap);
    choiceBox.appendChild(h('button', { onclick: () => { R.choice.a.push(''); renderChoice(); } }, '+ đáp án'));
  }
  hasChoice.addEventListener('change', () => { R.choice = hasChoice.checked ? (R.choice || { q: '', a: ['', ''], correct: 0 }) : undefined; markDirty(); renderChoice(); });
  box.appendChild(field('ritual.choice (kiểm tra trước khi niêm phong)', hasChoice));
  box.appendChild(choiceBox);
  renderChoice();

  box.appendChild(field('theme (raw JSON — xem ritual-theme.js cho các khóa hợp lệ)',
    textArea(R.theme !== undefined ? JSON.stringify(R.theme, null, 2) : '', v => {
      if (!v.trim()) { R.theme = undefined; box._themeErr.textContent = ''; return; }
      try { R.theme = JSON.parse(v); box._themeErr.textContent = ''; }
      catch (e) { box._themeErr.textContent = 'JSON lỗi: ' + e.message; }
    }, 4, true),
    'preset string ("comet") HOẶC object {motion,palette,circle,glyphs,glow,scale}'));
  box._themeErr = h('small', { class: 'hint', style: 'color:#d69a20' });
  box.appendChild(box._themeErr);

  return box;
}

// ── cell type registry ──
const CELL_TYPES = ['npc', 'code', 'remember', 'checkpoint', 'quiz', 'gift', 'widget', 'cameo', 'boss'];

function cellType(c) { return CELL_TYPES.find(t => c[t] !== undefined) || 'npc'; }

function cellPreview(c) {
  const t = cellType(c);
  const firstLine = s => (s || '').toString().split('\n')[0].slice(0, 90);
  switch (t) {
    case 'npc': return firstLine(c.npc);
    case 'code': return `${c.label || '(no label)'} — ${firstLine(c.code)}`;
    case 'remember': return firstLine([].concat(c.remember)[0]);
    case 'checkpoint': return firstLine(c.checkpoint && c.checkpoint.text);
    case 'quiz': return `"${c.quiz && c.quiz.title}" (${(c.quiz && c.quiz.questions || []).length} câu)`;
    case 'gift': return `${c.gift && c.gift.name}`;
    case 'widget': return `widget: ${c.widget}`;
    case 'cameo': return firstLine(c.cameo && c.cameo.caption);
    case 'boss': return `${c.boss && c.boss.name} (${(c.boss && c.boss.rounds || []).length} rounds)`;
  }
  return '';
}

function newCellOfType(t) {
  switch (t) {
    case 'npc': return { npc: '' };
    case 'code': return { code: '', label: 'new_cell.py', note: '', expectOut: undefined };
    case 'remember': return { remember: '' };
    case 'checkpoint': return { checkpoint: { text: '' } };
    case 'quiz': return { quiz: { title: '', questions: [{ q: '', a: ['', ''], correct: 0 }] } };
    case 'gift': return { gift: { glyph: '✦', name: '', blurb: '' } };
    case 'widget': return { widget: 'anatomy' };
    case 'cameo': return { cameo: { art: '', caption: '' } };
    case 'boss': return { boss: { name: '', glyph: '👾', hp: 100, baseDmg: 20, streakMul: [1, 1.5, 2], heal: 10, hearts: 3, rounds: [] } };
  }
}

// ── expectOut structured editor ──
// Supported shapes: none | string (text-contains) | RegExp | {minLines:N} |
// {all:[...]} of the above atomics | held-count map {N: atomic}.
// Anything else (deeper nesting) is shown read-only — known v1 gap, see README.
function classifyExpectOut(v) {
  if (v === undefined) return 'none';
  if (v instanceof RegExp) return 'regex';
  if (typeof v === 'string') return 'text';
  if (v && typeof v === 'object' && Array.isArray(v.all)) return 'all';
  if (v && typeof v === 'object' && typeof v.minLines === 'number') return 'minLines';
  if (v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).every(k => /^\d+$/.test(k))) return 'heldCount';
  return 'unsupported';
}
function atomicEditor(value, onChange) {
  // an atomic expectOut entry: text-contains | regex | minLines
  const kind = value instanceof RegExp ? 'regex' : (value && typeof value === 'object' && typeof value.minLines === 'number') ? 'minLines' : 'text';
  const wrap = h('div', { class: 'eo-item' });
  const typeSel = select([['text', 'text-contains'], ['regex', 'regex'], ['minLines', 'minLines']], kind, t => {
    if (t === 'text') onChange('');
    else if (t === 'regex') onChange(new RegExp(''));
    else onChange({ minLines: 1 });
    rebuild();
  });
  wrap.appendChild(typeSel);
  const body = h('div', {});
  wrap.appendChild(body);
  function rebuild() {
    body.innerHTML = '';
    const cur = valueRef();
    if (cur instanceof RegExp) {
      const row = h('div', { class: 'grid2' });
      row.appendChild(field('pattern', textInput(cur.source, v => onChange(new RegExp(v, cur.flags)))));
      row.appendChild(field('flags', textInput(cur.flags, v => onChange(new RegExp(cur.source, v)))));
      body.appendChild(row);
    } else if (cur && typeof cur === 'object' && typeof cur.minLines === 'number') {
      body.appendChild(field('minLines', numberInput(cur.minLines, v => onChange({ minLines: v || 0 }))));
    } else {
      body.appendChild(field('chuỗi cần có trong output (không phân biệt hoa/thường)', textInput(cur || '', v => onChange(v))));
    }
  }
  let latest = value;
  function valueRef() { return latest; }
  const origOnChange = onChange;
  onChange = v => { latest = v; origOnChange(v); };
  rebuild();
  return wrap;
}
function renderExpectOutEditor(cell, key) {
  key = key || 'expectOut';
  const box = h('div', { class: 'expectout-editor' });
  const kind = classifyExpectOut(cell[key]);
  if (kind === 'unsupported') {
    box.appendChild(h('div', { class: 'status' }, '(dạng expectOut phức tạp — giữ nguyên, không chỉnh trong editor v1)'));
    box.appendChild(h('pre', { style: 'font-size:11px;color:#78b2a5;white-space:pre-wrap' }, JSON.stringify(cell[key], (k, v) => v instanceof RegExp ? v.toString() : v, 1)));
    return box;
  }
  const typeSel = select([
    ['none', 'none'], ['text', 'text-contains'], ['regex', 'regex'],
    ['minLines', 'minLines'], ['heldCount', 'heldCount (map)'], ['all', 'all-of'],
  ], kind, t => {
    if (t === 'none') cell[key] = undefined;
    else if (t === 'text') cell[key] = '';
    else if (t === 'regex') cell[key] = new RegExp('');
    else if (t === 'minLines') cell[key] = { minLines: 1 };
    else if (t === 'heldCount') cell[key] = {};
    else if (t === 'all') cell[key] = { all: [] };
    rerenderBody();
  });
  box.appendChild(field('expectOut type', typeSel));
  const body = h('div', {});
  box.appendChild(body);
  function rerenderBody() {
    body.innerHTML = '';
    const k = classifyExpectOut(cell[key]);
    if (k === 'none') return;
    if (k === 'text' || k === 'regex' || k === 'minLines') {
      body.appendChild(atomicEditor(cell[key], v => { cell[key] = v; }));
      return;
    }
    if (k === 'all') {
      cell[key].all.forEach((sub, i) => {
        const row = h('div', {});
        row.appendChild(atomicEditor(sub, v => { cell[key].all[i] = v; }));
        row.appendChild(h('button', { onclick: () => { cell[key].all.splice(i, 1); rerenderBody(); } }, '✕ xóa mục này'));
        body.appendChild(row);
      });
      body.appendChild(h('button', { onclick: () => { cell[key].all.push(''); rerenderBody(); } }, '+ thêm điều kiện'));
      return;
    }
    if (k === 'heldCount') {
      Object.keys(cell[key]).sort().forEach(count => {
        const row = h('div', { class: 'grid2' });
        row.appendChild(field('số ngón tay', numberInput(Number(count), v => {
          const val = cell[key][count]; delete cell[key][count]; cell[key][String(v)] = val; rerenderBody();
        })));
        const sub = h('div', {});
        sub.appendChild(atomicEditor(cell[key][count], v => { cell[key][count] = v; }));
        row.appendChild(sub);
        row.appendChild(h('button', { onclick: () => { delete cell[key][count]; rerenderBody(); } }, '✕'));
        body.appendChild(row);
      });
      body.appendChild(h('button', { onclick: () => { const n = Object.keys(cell[key]).length; cell[key][String(n)] = ''; rerenderBody(); } }, '+ thêm số ngón tay'));
      return;
    }
  }
  rerenderBody();
  return box;
}

// ── per-type body renderers ──
function renderQaBlock(q, onRemove, gestureOptions) {
  const box = h('div', { class: 'qq-block' });
  box.appendChild(field('câu hỏi (q)', textArea(q.q, v => q.q = v, 2)));
  q.a = q.a || ['', ''];
  const ansWrap = h('div', {});
  function rebuildAnswers() {
    ansWrap.innerHTML = '';
    q.a.forEach((a, i) => {
      const row = h('div', { class: 'qq-answer-row' });
      const radio = h('input', { type: 'radio', name: 'correct-' + Math.random().toString(36).slice(2) });
      radio.checked = q.correct === i;
      radio.addEventListener('change', () => { q.correct = i; markDirty(); });
      row.appendChild(radio);
      row.appendChild(textInput(a, v => q.a[i] = v));
      row.appendChild(h('button', { onclick: () => { q.a.splice(i, 1); if (q.correct >= q.a.length) q.correct = 0; rebuildAnswers(); } }, '✕'));
      ansWrap.appendChild(row);
    });
  }
  rebuildAnswers();
  box.appendChild(field('đáp án (chọn nút tròn = đáp án đúng)', ansWrap));
  box.appendChild(h('button', { onclick: () => { q.a.push(''); rebuildAnswers(); } }, '+ đáp án'));
  if (gestureOptions) box.appendChild(field('gesture', select(gestureOptions, q.gesture || '', v => q.gesture = v || undefined)));
  if (onRemove) box.appendChild(h('div', { style: 'margin-top:6px' }, h('button', { class: 'danger', onclick: onRemove }, '✕ xóa câu hỏi này')));
  return box;
}

function renderCodeFields(c, opts) {
  opts = opts || {};
  const box = h('div', {});
  box.appendChild(field('label' + (opts.roundLabel ? ' (round label)' : ''), textInput(c.label, v => c.label = v)));
  box.appendChild(field('code (Python)', textArea(c.code, v => c.code = v, 8, true)));
  box.appendChild(field('note (ĐỀ BÀI)', textArea(c.note, v => c.note = v, 3)));
  if (opts.dmg) box.appendChild(field('dmg (sát thương khi đúng)', numberInput(c.dmg, v => c.dmg = v)));
  if (opts.finisher) {
    const cb = checkbox(c.finisher, v => c.finisher = v || undefined);
    box.appendChild(field('finisher (đòn kết liễu — luôn hạ gục boss)', cb));
  }
  box.appendChild(field('expect (số ngón tay khóa camera — nếu có, cách nhau dấu phẩy)',
    textInput((c.expect === undefined ? [] : [].concat(c.expect)).join(', '), v => {
      const nums = v.split(',').map(s => s.trim()).filter(Boolean).map(Number);
      c.expect = nums.length === 0 ? undefined : nums.length === 1 ? nums[0] : nums;
    })));
  box.appendChild(field('expectOut', renderExpectOutEditor(c)));
  return box;
}

function renderCellBody(c) {
  const t = cellType(c);
  const box = h('div', {});
  if (t === 'npc') { box.appendChild(field('npc (lời Pip nói)', textArea(c.npc, v => c.npc = v, 4))); return box; }
  if (t === 'code') { box.appendChild(renderCodeFields(c)); return box; }
  if (t === 'remember') {
    const isArr = Array.isArray(c.remember);
    const cb = checkbox(isArr, on => {
      const cur = [].concat(c.remember || '').filter(Boolean);
      c.remember = on ? cur : cur.join('\n');
    });
    box.appendChild(field('nhiều dòng (array)', cb));
    box.appendChild(field('remember', textArea([].concat(c.remember || '').join('\n'), v => {
      const lines = v.split('\n');
      c.remember = Array.isArray(c.remember) ? lines.filter(l => l.trim()) : v;
    }, 3)));
    return box;
  }
  if (t === 'checkpoint') {
    c.checkpoint = c.checkpoint || {};
    box.appendChild(field('text', textArea(c.checkpoint.text, v => c.checkpoint.text = v, 3)));
    box.appendChild(field('sign (số ngón tay — để trống = mặc định 5)', numberInput(c.checkpoint.sign, v => c.checkpoint.sign = v)));
    return box;
  }
  if (t === 'quiz') {
    c.quiz = c.quiz || { questions: [] };
    box.appendChild(field('title', textInput(c.quiz.title, v => c.quiz.title = v)));
    const qWrap = h('div', {});
    function rebuild() {
      qWrap.innerHTML = '';
      (c.quiz.questions || []).forEach((q, i) => qWrap.appendChild(renderQaBlock(q, () => { c.quiz.questions.splice(i, 1); rebuild(); }, GESTURE_VERBS_FOR_QUIZ)));
    }
    rebuild();
    box.appendChild(qWrap);
    box.appendChild(h('button', { onclick: () => { c.quiz.questions.push({ q: '', a: ['', ''], correct: 0 }); rebuild(); } }, '+ câu hỏi'));
    return box;
  }
  if (t === 'gift') {
    c.gift = c.gift || {};
    box.appendChild(field('glyph (emoji) hoặc art (đường dẫn ảnh)', textInput(c.gift.glyph, v => c.gift.glyph = v || undefined)));
    box.appendChild(field('art', textInput(c.gift.art, v => c.gift.art = v || undefined)));
    box.appendChild(field('name', textInput(c.gift.name, v => c.gift.name = v)));
    box.appendChild(field('blurb', textArea(c.gift.blurb, v => c.gift.blurb = v, 2)));
    return box;
  }
  if (t === 'widget') {
    box.appendChild(field('widget name (vd "anatomy")', textInput(c.widget, v => c.widget = v)));
    return box;
  }
  if (t === 'cameo') {
    c.cameo = c.cameo || {};
    box.appendChild(field('art', textInput(c.cameo.art, v => c.cameo.art = v)));
    box.appendChild(field('caption', textArea(c.cameo.caption, v => c.cameo.caption = v, 3)));
    return box;
  }
  if (t === 'boss') {
    c.boss = c.boss || { rounds: [] };
    const b = c.boss;
    const row1 = h('div', { class: 'grid3' });
    row1.appendChild(field('name', textInput(b.name, v => b.name = v)));
    row1.appendChild(field('glyph', textInput(b.glyph, v => b.glyph = v)));
    row1.appendChild(field('art', textInput(b.art, v => b.art = v || undefined)));
    box.appendChild(row1);
    const row2 = h('div', { class: 'grid3' });
    row2.appendChild(field('hp', numberInput(b.hp, v => b.hp = v)));
    row2.appendChild(field('baseDmg', numberInput(b.baseDmg, v => b.baseDmg = v)));
    row2.appendChild(field('heal', numberInput(b.heal, v => b.heal = v)));
    box.appendChild(row2);
    const row3 = h('div', { class: 'grid2' });
    row3.appendChild(field('hearts', numberInput(b.hearts, v => b.hearts = v)));
    row3.appendChild(field('streakMul (vd 1, 1.5, 2)', textInput((b.streakMul || []).join(', '), v => b.streakMul = v.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n)))));
    box.appendChild(row3);

    const roundsWrap = h('div', {});
    function rebuildRounds() {
      roundsWrap.innerHTML = '';
      (b.rounds || []).forEach((r, i) => {
        const isQuestion = r.q !== undefined;
        const card = h('div', { class: 'qq-block' });
        card.appendChild(h('div', { style: 'display:flex;justify-content:space-between;align-items:center' },
          h('strong', {}, `Round ${i + 1} — ${isQuestion ? 'question' : 'code'}`),
          h('button', { onclick: () => { b.rounds.splice(i, 1); rebuildRounds(); } }, '✕ xóa round')));
        if (isQuestion) card.appendChild(renderQaBlock(r, null, GESTURE_VERBS_FOR_BOSS));
        else card.appendChild(renderCodeFields(r, { roundLabel: true, dmg: true, finisher: true }));
        roundsWrap.appendChild(card);
      });
    }
    rebuildRounds();
    box.appendChild(field('rounds', roundsWrap));
    const addRow = h('div', {});
    addRow.appendChild(h('button', { onclick: () => { b.rounds.push({ q: '', a: ['', ''], correct: 0 }); rebuildRounds(); } }, '+ question round'));
    addRow.appendChild(h('button', { onclick: () => { b.rounds.push({ code: '', label: 'round.py', note: '', dmg: 30 }); rebuildRounds(); } }, '+ code round'));
    box.appendChild(addRow);
    return box;
  }
  return box;
}

// ── cell list (card, collapsed by default) ──
function renderCellCard(c, i) {
  const t = cellType(c);
  const card = h('div', { class: 'cell-card' });
  const body = h('div', { class: 'cell-body', hidden: '' });
  const head = h('div', { class: 'cell-head' },
    h('span', { class: 'cell-idx' }, String(i)),
    h('span', { class: 'badge ' + t }, t),
    h('span', { class: 'cell-preview' }, cellPreview(c)),
    h('span', { class: 'cell-ops' },
      h('button', { title: 'Preview trong dev-test.html', onclick: e => { e.stopPropagation(); previewCell(c); } }, '👁'),
      h('button', { title: 'Lên', onclick: e => { e.stopPropagation(); moveCell(i, -1); } }, '↑'),
      h('button', { title: 'Xuống', onclick: e => { e.stopPropagation(); moveCell(i, 1); } }, '↓'),
      h('button', { title: 'Nhân bản', onclick: e => { e.stopPropagation(); duplicateCell(i); } }, '⧉'),
      h('button', { class: 'danger', title: 'Xóa', onclick: e => { e.stopPropagation(); deleteCell(i); } }, '✕'),
    ));
  head.addEventListener('click', () => {
    const wasHidden = body.hasAttribute('hidden');
    if (wasHidden && !body._built) { body.appendChild(renderCellBody(c)); body._built = true; }
    if (wasHidden) body.removeAttribute('hidden'); else body.setAttribute('hidden', '');
  });
  card.appendChild(head);
  card.appendChild(body);
  return card;
}

function insertRow(index) {
  const row = h('div', { class: 'insert-row' });
  const sel = h('select', {});
  CELL_TYPES.forEach(t => sel.appendChild(h('option', { value: t }, t)));
  const btn = h('button', { onclick: () => { state.node.cells.splice(index, 0, newCellOfType(sel.value)); markDirty(); renderCells(); } }, '+ chèn cell tại đây');
  row.appendChild(sel); row.appendChild(btn);
  return row;
}

function moveCell(i, dir) {
  const cells = state.node.cells;
  const j = i + dir;
  if (j < 0 || j >= cells.length) return;
  [cells[i], cells[j]] = [cells[j], cells[i]];
  markDirty(); renderCells();
}
function duplicateCell(i) {
  const cells = state.node.cells;
  cells.splice(i + 1, 0, structuredClone(cells[i]));
  markDirty(); renderCells();
}
function deleteCell(i) {
  if (!confirm(`Xóa cell #${i} (${cellType(state.node.cells[i])})?`)) return;
  state.node.cells.splice(i, 1);
  markDirty(); renderCells();
}
function previewCell(c) {
  const t = cellType(c);
  let only = '';
  if (t === 'boss') only = 'boss';
  else if (t === 'widget') only = 'widget';
  else if (t === 'cameo') only = 'cameo';
  else if (t === 'checkpoint') only = 'checkpoint';
  else if (t === 'quiz') only = 'quiz:' + encodeURIComponent(c.quiz.title || '');
  else if (t === 'code') only = 'code:' + encodeURIComponent(c.label || '');
  else { alert('Loại cell này (npc/remember/gift) không có ?only= riêng trong dev-test.html — mở cả node để xem.'); only = ''; }
  const url = `dev-test.html?src=${state.file}${only ? '&only=' + only : ''}`;
  window.open(url, '_blank');
}

let $cellsRoot = null;
function renderCells() {
  if (!$cellsRoot) return;
  $cellsRoot.innerHTML = '';
  $cellsRoot.appendChild(insertRow(0));
  (state.node.cells || []).forEach((c, i) => {
    $cellsRoot.appendChild(renderCellCard(c, i));
    $cellsRoot.appendChild(insertRow(i + 1));
  });
}

function render() {
  $app.innerHTML = '';
  $app.appendChild(renderHeader());
  const cellsBox = h('fieldset', {}, h('legend', {}, `Cells (${(state.node.cells || []).length})`));
  $cellsRoot = h('div', {});
  cellsBox.appendChild($cellsRoot);
  $app.appendChild(cellsBox);
  renderCells();
}

// ── save flow ──
async function onSave() {
  // collect any pending JSON-textarea errors from header (modules/theme) before serializing
  let source;
  try {
    source = serializeNode(state.node);
  } catch (e) {
    alert('Không thể serialize node: ' + e.message);
    return;
  }
  const filename = (state.file === 'TEMPLATE' ? 'TEMPLATE' : state.file) + '.js';

  if (serverCanSave) {
    try {
      const r = await fetch('/api/save-node', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: filename, source }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) { alert('Lưu thất bại: ' + (j.error || r.status)); return; }
      state.dirty = false;
      const v = j.validate || {};
      const msg = `Đã lưu ${filename} (backup: ${j.backup}).\n\nValidator exit code: ${v.exitCode}\n\n${v.output || ''}`;
      showSaveResult(msg, v.exitCode === 0);
      return;
    } catch (e) {
      alert('Không gọi được server (' + e.message + ') — sẽ tải file xuống thay thế.');
    }
  }
  downloadFile(filename, source);
  state.dirty = false;
}

function showSaveResult(text, ok) {
  const pre = document.createElement('pre');
  pre.style.cssText = 'white-space:pre-wrap;background:#183f49;border:1px solid ' + (ok ? '#d9eee5' : '#f4c85a') + ';border-radius:8px;padding:10px;margin-top:10px;font-size:12px;max-height:300px;overflow:auto';
  pre.textContent = text;
  $app.insertBefore(pre, $app.firstChild);
}

function downloadFile(filename, source) {
  const blob = new Blob([source], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

window.addEventListener('beforeunload', e => { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });
