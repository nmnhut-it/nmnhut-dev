import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const lessonsDir = path.resolve(here, '..', '..');
const repoRoot = path.resolve(lessonsDir, '..');
const sagaPath = path.join(lessonsDir, 'saga.js');
const vocabPath = path.join(here, 'RDRsegmenter-VnVocab.words.txt');

const SKIP_TEXT_KEYS = new Set([
  'art', 'litArt', 'unlit', 'page', 'id', 'sideIslandId', 'badgeId',
  'glyph', 'glyphs', 'chant', 'chantAccept', 'gesture', 'palette',
  'modules', 'solution', 'expectOut', 'label', 'correct',
]);

const SUSPICIOUS_PHRASES = [
  {
    label: 'số lật',
    pattern: /(^|[^\p{L}])số\s+lật(?=[^\p{L}]|$)/iu,
    note: 'nên viết "số sau khi lật ngược" hoặc "số đảo ngược"',
  },
  {
    label: 'số gốc',
    pattern: /(^|[^\p{L}])số\s+gốc(?=[^\p{L}]|$)/iu,
    note: 'nên viết "số ban đầu" cho học sinh',
  },
  {
    label: 'thành một số mới',
    pattern: /(^|[^\p{L}])thành\s+một\s+số\s+mới(?=[^\p{L}]|$)/iu,
    note: 'nên nói rõ số đó là số đảo ngược, tổng mới, hay giá trị nào',
  },
  {
    label: 'lật luật',
    pattern: /(^|[^\p{L}])lật(?:\s+ngược)?\s+luật(?=[^\p{L}]|$)/iu,
    note: 'nên viết "đổi luật" hoặc "đổi điều kiện"',
  },
  {
    label: 'chữ số mới',
    pattern: /(^|[^\p{L}])chữ\s+số\s+mới(?=[^\p{L}]|$)/iu,
    note: 'nên viết "chữ số vừa bóc ra" hoặc "phần dư vừa lấy"',
  },
  {
    label: 'đổ ... sang ...',
    pattern: /(^|[^\p{L}])đổ\s+[^\n.!?]{1,40}\s+sang\s+[^\n.!?]{1,40}/iu,
    note: 'nếu là assignment, nên viết "gán", "chép giá trị", hoặc nêu giá trị nào bị ghi đè',
  },
  {
    label: 'biến con',
    pattern: /(^|[^\p{L}])biến\s+con(?=[^\p{L}]|$)/iu,
    note: 'nên viết "một ô/phần tử trong list" hoặc "một chỗ nhớ riêng có index"',
  },
  {
    label: 'bẻ hàng',
    pattern: /(^|[^\p{L}])bẻ\s+hàng(?=[^\p{L}]|$)/iu,
    note: 'nên viết "mở rộng hàng ô thành bảng" hoặc mô tả bảng nhiều hàng/cột',
  },
  {
    label: 'cờ bật/hạ cờ',
    pattern: /(^|[^\p{L}])(?:cờ\s+bật|hạ\s+cờ|hạ\s+(?:nó\s+)?xuống\s+`?False`?)(?=[^\p{L}]|$)/iu,
    note: 'nên nêu giá trị bool cụ thể: "đổi thành True" hoặc "gán ... = False"',
  },
  {
    label: 'tháo while/for',
    pattern: /(^|[^\p{L}])tháo\s+`?(?:while|for)`?(?=[^\p{L}]|$)/iu,
    note: 'nên viết "viết lại while/for bằng các bước nhỏ"',
  },
  {
    label: 'lật chéo bảng/ô lấy gương',
    pattern: /(^|[^\p{L}])(?:lật\s+chéo\s+bảng|ô\s+lấy\s+gương)(?=[^\p{L}]|$)/iu,
    note: 'nên nêu mapping hàng/cột cụ thể, ví dụ grid[cot][hang]',
  },
];

const DOMAIN_TERMS = [
  'INPUT', 'PROCESS', 'OUTPUT', 'RUN', 'MẬT NGỮ', 'BOM MẬT NGỮ',
  'Kotopia', 'Pip', 'Chúa tể Vô Định', 'Vô Định',
  'thần chú', 'đoạn code', 'đoạn mã', 'niệm chú', 'cuộn chú', 'hải đăng',
  'biến', 'chuỗi', 'điều kiện', 'vòng lặp', 'mốc dừng',
  'list', 'index', 'grid', 'pixel', 'AR', 'camera',
  'while', 'for', 'range', 'if', 'elif', 'else', 'and', 'or', 'not',
  'True', 'False', 'len', 'str', 'random', 'sort', 'search',
];

const IGNORE_SYLLABLES = new Set([
  'pip', 'kotopia', 'run', 'input', 'output', 'process', 'magic', 'dust',
  'old', 'computer', 'bug', 'wraith', 'syntax', 'serpent', 'boss', 'scroll',
  'module', 'search', 'sort', 'grid', 'pixel', 'camera', 'ar', 'rps',
  'true', 'false', 'none', 'while', 'for', 'range', 'if', 'elif', 'else',
  'and', 'or', 'not', 'len', 'str', 'say', 'read', 'watch', 'display',
  'random', 'int', 'code', 'ko', 'co', 'khong',
  'nhe', 'nha', 'ne', 'xem', 'xong', 'hay', 'tui', 'tụi', 'nhé', 'nha',
  'nè', 'hễ', 'xíu', 'xíu', 'xảy', 'xuống', 'xuất', 'xác', 'xin', 'xen',
  'xưởng', 'thỏa', 'giùm', 'đà', 'huế', 'nẵng',
]);

function readUtf8(file) {
  return fs.readFileSync(file, 'utf8');
}

function extractConstArray(source, name) {
  const start = source.indexOf(`const ${name} =`);
  if (start < 0) throw new Error(`Missing const ${name}`);
  const open = source.indexOf('[', start);
  if (open < 0) throw new Error(`Missing array opener for ${name}`);
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];
    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') { blockComment = false; i++; }
      continue;
    }
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) return source.slice(open, i + 1);
    }
  }
  throw new Error(`Unclosed array for ${name}`);
}

function loadMap() {
  const source = readUtf8(sagaPath);
  return {
    nodes: vm.runInNewContext(`(${extractConstArray(source, 'NODES')})`),
    islands: vm.runInNewContext(`(${extractConstArray(source, 'SIDE_ISLANDS')})`),
  };
}

function contentFileForPage(page) {
  if (!page) return null;
  const htmlPath = path.join(lessonsDir, page);
  if (!fs.existsSync(htmlPath)) return null;
  const html = readUtf8(htmlPath);
  const match = html.match(/import\s+N\s+from\s+['"]\.\/content\/([^'"]+)['"]/);
  return match ? path.join(lessonsDir, 'content', match[1]) : null;
}

function collectText(value, out = [], key = '') {
  if (value == null) return out;
  if (typeof value === 'string') {
    if (key === 'code') {
      out.push(...extractCodeComments(value));
      return out;
    }
    if (!SKIP_TEXT_KEYS.has(key) && !looksLikeAsset(value)) out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, out, key);
    return out;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) collectText(v, out, k);
  }
  return out;
}

function looksLikeAsset(text) {
  return /^assets\//.test(text) || /^\.\.\//.test(text) || /\.(png|jpg|jpeg|mp4|py|html)$/i.test(text);
}

function extractCodeComments(code) {
  const comments = [];
  for (const line of code.split(/\r?\n/)) {
    const hash = line.indexOf('#');
    if (hash < 0) continue;
    const comment = line.slice(hash + 1).trim();
    if (comment) comments.push(comment);
  }
  return comments;
}

function stripCode(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ');
}

function sentences(text) {
  return stripCode(text)
    .split(/(?<=[.!?…])\s+|\n+/u)
    .map(s => s.trim())
    .filter(s => s.length >= 8);
}

function syllables(text) {
  return stripCode(text)
    .toLowerCase()
    .normalize('NFC')
    .match(/[a-zà-ỹđ]+/gu) || [];
}

function loadVocabulary() {
  const words = new Set();
  const components = new Set();
  let maxLen = 1;
  for (const line of readUtf8(vocabPath).split(/\r?\n/)) {
    const w = line.trim().toLowerCase().normalize('NFC');
    if (!w) continue;
    words.add(w);
    const parts = w.split(/\s+/);
    maxLen = Math.max(maxLen, parts.length);
    for (const part of parts) components.add(part);
  }
  return { words, components, maxLen: Math.min(maxLen, 8) };
}

function maxMatch(tokens, vocab, backward = false) {
  const out = [];
  if (!backward) {
    for (let i = 0; i < tokens.length;) {
      let best = null;
      const upto = Math.min(vocab.maxLen, tokens.length - i);
      for (let len = upto; len >= 1; len--) {
        const phrase = tokens.slice(i, i + len).join(' ');
        if (vocab.words.has(phrase)) { best = tokens.slice(i, i + len); break; }
      }
      out.push(best || [tokens[i]]);
      i += best ? best.length : 1;
    }
    return out;
  }
  for (let i = tokens.length; i > 0;) {
    let best = null;
    const upto = Math.min(vocab.maxLen, i);
    for (let len = upto; len >= 1; len--) {
      const phrase = tokens.slice(i - len, i).join(' ');
      if (vocab.words.has(phrase)) { best = tokens.slice(i - len, i); break; }
    }
    out.unshift(best || [tokens[i - 1]]);
    i -= best ? best.length : 1;
  }
  return out;
}

function segmentationKey(parts) {
  return parts.map(p => p.join('_')).join(' ');
}

function isIgnoredToken(token, vocab) {
  if (IGNORE_SYLLABLES.has(token)) return true;
  if (vocab.words.has(token) || vocab.components.has(token)) return true;
  if (/^[a-z]+$/.test(token) && token.length <= 2) return true;
  return false;
}

function analyzeText(texts, vocab) {
  const oov = new Map();
  const ambiguous = [];
  const allText = texts.join('\n');
  const domain = DOMAIN_TERMS.filter(t => new RegExp(`(^|[^\\p{L}])${escapeRegex(t)}([^\\p{L}]|$)`, 'iu').test(allText));
  const suspicious = findSuspiciousPhrases(allText);
  for (const sentence of sentences(allText)) {
    const toks = syllables(sentence).filter(t => !isIgnoredToken(t, vocab) || !/^[a-z]+$/.test(t));
    if (!toks.length) continue;
    const fmm = maxMatch(toks, vocab, false);
    const bmm = maxMatch(toks, vocab, true);
    if (segmentationKey(fmm) !== segmentationKey(bmm) && ambiguous.length < 6) {
      ambiguous.push({
        sentence,
        fmm: segmentationKey(fmm),
        bmm: segmentationKey(bmm),
      });
    }
    for (const part of fmm) {
      if (part.length !== 1) continue;
      const token = part[0];
      if (!isIgnoredToken(token, vocab)) oov.set(token, (oov.get(token) || 0) + 1);
    }
  }
  const oovTerms = [...oov.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'vi'))
    .slice(0, 10)
    .map(([term, count]) => count > 1 ? `${term}(${count})` : term);
  return { domain, oovTerms, ambiguous, suspicious };
}

function findSuspiciousPhrases(text) {
  const found = new Map();
  for (const sentence of sentences(text)) {
    for (const rule of SUSPICIOUS_PHRASES) {
      if (!rule.pattern.test(sentence)) continue;
      if (!found.has(rule.label)) {
        found.set(rule.label, { phrase: rule.label, sentence, note: rule.note });
      }
    }
  }
  return [...found.values()];
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cellKinds(cells = []) {
  const kinds = new Set();
  for (const cell of cells) {
    for (const key of Object.keys(cell)) {
      if (!['label', 'note', 'expectOut', 'solution'].includes(key)) kinds.add(key);
    }
  }
  return [...kinds];
}

function inferTeaching(data) {
  const parts = [];
  if (data.subtitle) parts.push(cleanInline(data.subtitle));
  const quizTitles = (data.cells || []).filter(c => c.quiz).map(c => c.quiz.title).slice(0, 4);
  if (quizTitles.length) parts.push(`quiz: ${quizTitles.join('; ')}`);
  const codeLabels = (data.cells || []).filter(c => c.code).map(c => c.label).filter(Boolean).slice(0, 5);
  if (codeLabels.length) parts.push(`practice: ${codeLabels.join(', ')}`);
  if (data.forge || (data.cells || []).some(c => c.forge)) parts.push('forge quiz');
  if (data.boss || (data.cells || []).some(c => c.boss)) parts.push('boss/KO');
  return parts.join(' | ');
}

function cleanInline(text) {
  return text.replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function md(text) {
  return String(text ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function difficultySummary(analysis) {
  const chunks = [];
  if (analysis.domain.length) chunks.push(`term: ${analysis.domain.slice(0, 10).join(', ')}`);
  if (analysis.suspicious.length) chunks.push(`cụm lạ: ${analysis.suspicious.map(s => s.phrase).join(', ')}`);
  if (analysis.oovTerms.length) chunks.push(`OOV: ${analysis.oovTerms.join(', ')}`);
  if (analysis.ambiguous.length) chunks.push(`FMM/BMM lệch: ${analysis.ambiguous.length}`);
  return chunks.join(' | ') || 'không nổi bật theo heuristic';
}

async function loadContent(file) {
  const mod = await import(`${pathToFileURL(file).href}?audit=${Date.now()}-${Math.random()}`);
  return mod.default;
}

async function main() {
  const outFlag = process.argv.indexOf('--out');
  const outPath = outFlag >= 0 ? path.resolve(process.argv[outFlag + 1]) : null;
  const vocab = loadVocabulary();
  const { nodes, islands } = loadMap();
  const rows = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const file = contentFileForPage(n.page);
    const data = file ? await loadContent(file) : null;
    const texts = data ? collectText(data) : [n.title || ''];
    const analysis = analyzeText(texts, vocab);
    rows.push({
      kind: 'node',
      order: i,
      unlock: '',
      title: data?.title || n.title || '(missing title)',
      page: n.page || '',
      file: file ? path.relative(repoRoot, file).replaceAll('\\', '/') : '',
      cells: data?.cells?.length || 0,
      kinds: data ? cellKinds(data.cells).join(', ') : '',
      teaching: data ? inferTeaching(data) : 'chưa có content/page',
      difficulty: difficultySummary(analysis),
      ambiguous: analysis.ambiguous,
      suspicious: analysis.suspicious,
    });
  }
  for (const s of islands) {
    const file = contentFileForPage(s.page);
    const data = file ? await loadContent(file) : null;
    const texts = data ? collectText(data) : [s.title || ''];
    const analysis = analyzeText(texts, vocab);
    rows.push({
      kind: s.id === 'tower' ? 'tower' : 'island',
      order: s.id,
      unlock: s.unlockAt,
      title: data?.title || s.title || '(missing title)',
      page: s.page || '',
      file: file ? path.relative(repoRoot, file).replaceAll('\\', '/') : '',
      cells: data?.cells?.length || 0,
      kinds: data ? cellKinds(data.cells).join(', ') : '',
      teaching: data ? inferTeaching(data) : 'chưa có content/page',
      difficulty: difficultySummary(analysis),
      ambiguous: analysis.ambiguous,
      suspicious: analysis.suspicious,
    });
  }

  const lines = [];
  lines.push('# Node/Island Vocabulary Audit');
  lines.push('');
  lines.push('Method: Vietnamese lexicon + left-to-right Forward Maximum Matching + right-to-left Backward Maximum Matching + curated suspicious phrase patterns. Rows are review hints, not final proof of bad wording.');
  lines.push('');
  lines.push(`Vocabulary: RDRsegmenter VnVocab extracted to ${path.relative(repoRoot, vocabPath).replaceAll('\\', '/')} (${vocab.words.size} entries).`);
  lines.push('');
  lines.push('| Type | # / unlock | Title | Teaches | Language flags |');
  lines.push('|---|---:|---|---|---|');
  for (const r of rows) {
    const index = r.kind === 'node' ? r.order : `${r.order} @${r.unlock}`;
    lines.push(`| ${md(r.kind)} | ${md(index)} | ${md(r.title)} | ${md(r.teaching)} | ${md(r.difficulty)} |`);
  }
  lines.push('');
  lines.push('## Suspicious Phrase Examples');
  lines.push('');
  for (const r of rows) {
    if (!r.suspicious.length) continue;
    lines.push(`### ${r.kind} ${r.order}: ${r.title}`);
    for (const ex of r.suspicious.slice(0, 5)) {
      lines.push(`- Phrase: ${ex.phrase}`);
      lines.push(`  - Sentence: ${ex.sentence}`);
      lines.push(`  - Note: ${ex.note}`);
    }
    lines.push('');
  }
  lines.push('## FMM/BMM Examples');
  lines.push('');
  for (const r of rows) {
    if (!r.ambiguous.length) continue;
    lines.push(`### ${r.kind} ${r.order}: ${r.title}`);
    for (const ex of r.ambiguous.slice(0, 3)) {
      lines.push(`- Sentence: ${ex.sentence}`);
      lines.push(`  - FMM: ${ex.fmm}`);
      lines.push(`  - BMM: ${ex.bmm}`);
    }
    lines.push('');
  }
  const report = `${lines.join('\n')}\n`;
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, report, 'utf8');
  } else {
    process.stdout.write(report);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
