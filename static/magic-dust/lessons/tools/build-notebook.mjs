// node lessons/tools/build-notebook.mjs
//
// Converts a lesson's content file into a Jupyter notebook, so the same arc can
// be worked through offline. Generated, never hand-edited: the browser lesson
// is the source of truth and this keeps the notebook from drifting away from it.
//
// The split it makes, and why: the grid half of Gương Vô Cực is pure data —
// flip, add-and-clamp, paint a region — and runs anywhere with pillow. The
// camera/voice half needs a webcam, a microphone and a WebGL stage. Those cells
// are still emitted (the code is the lesson) but marked browser-only, and
// magic_dust.py's stand-ins say so at runtime rather than failing obscurely.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const lessons = path.dirname(here);
const OUT_DIR = path.join(lessons, 'notebook');
const BROWSER_ONLY = /play_effect|play_my_effect|find_human|listen\(|watch\(/;

const md = source => ({ cell_type: 'markdown', metadata: {}, source: source.split('\n').map((l, i, a) => i === a.length - 1 ? l : l + '\n') });
const code = source => ({ cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: source.replace(/\n$/, '').split('\n').map((l, i, a) => i === a.length - 1 ? l : l + '\n') });

// Pip speaks in the lesson; in a notebook that voice reads better as a quote.
const pip = text => md(`> **Pip** — ${text}`);

function quizMd(q) {
  const lines = [`### ✦ ${q.title}`, ''];
  q.questions.forEach((item, n) => {
    lines.push(`**${n + 1}. ${item.q}**`, '');
    item.a.forEach((opt, i) => lines.push(`- ${String.fromCharCode(65 + i)}. ${opt}`));
    lines.push('', `<details><summary>Đáp án</summary>\n\n${String.fromCharCode(65 + item.correct)}. ${item.a[item.correct]}\n\n</details>`, '');
  });
  return md(lines.join('\n'));
}

export function buildNotebook(node) {
  const cells = [md([
    `# ${node.title}`, '',
    `*${node.subtitle}*`, '',
    '---', '',
    'Sổ tay này là bản offline của bài học chạy trong trình duyệt.',
    '',
    '**Chạy được ngay ở đây:** đọc ảnh thành lưới số, tự sửa một vùng ô, viết lệnh lật ảnh,',
    'viết lệnh cộng hai lớp, và dựng lại tấm ảnh đích. Đó là toàn bộ phần Python thuần.',
    '',
    '**Cần trình duyệt:** những ô có nhãn 🎥 dùng camera, micro hoặc sân khấu thật.',
    'Code vẫn ở đây để đọc; muốn chạy thật thì mở `lessons/islandFXFORGE.html`.',
    '',
    '```bash',
    'pip install pillow',
    'jupyter notebook guong-vo-cuc.ipynb',
    '```',
  ].join('\n')),
  code('# Mọi ô bên dưới dùng chung dòng này.\n# magic_dust thay cho old_computer / camera_charm / voice_charm khi chạy ngoài trình duyệt.\nfrom magic_dust import *')];

  for (const cell of node.cells) {
    if (cell.intro) cells.push(md(`## ${cell.intro.title}\n\n${cell.intro.hook}`));
    else if (cell.npc) cells.push(pip(cell.npc));
    else if (cell.checkpoint) cells.push(md(`> ### ✋ GHI NHỚ\n>\n> ${cell.checkpoint.text}`));
    else if (cell.remember) cells.push(md(`> ### ✦ NHỚ LẤY\n>\n> ${cell.remember}`));
    else if (cell.quiz) cells.push(quizMd(cell.quiz));
    else if (cell.gift) cells.push(md(`## 🏅 ${cell.gift.name}\n\n${cell.gift.blurb}`));
    else if (cell.code) {
      const browser = BROWSER_ONLY.test(cell.code);
      const task = /^ĐỀ BÀI/.test(cell.note || '') ? '✍️ ĐỀ BÀI' : /XƯỞNG/.test(cell.note || '') ? '🎨 TỰ DO' : '▶️ CHẠY THỬ';
      cells.push(md(`### ${task}${browser ? ' · 🎥 cần trình duyệt' : ''} — \`${cell.label || ''}\`\n\n${(cell.note || '').replace(/\n/g, '\n\n')}`));
      cells.push(code(cell.code));
      if (cell.solution && cell.solution !== cell.code)
        cells.push(md(`<details><summary>Đáp án</summary>\n\n\`\`\`python\n${cell.solution.replace(/\n$/, '')}\n\`\`\`\n\n</details>`));
    }
  }

  return {
    cells,
    metadata: {
      kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
      language_info: { name: 'python', version: '3.10' },
    },
    nbformat: 4, nbformat_minor: 5,
  };
}

const [, , contentArg = 'islandFXFORGE', outArg = 'guong-vo-cuc.ipynb'] = process.argv;
const mod = await import(path.join(lessons, 'content', `${contentArg}.js`).replace(/\\/g, '/').replace(/^([A-Za-z]):/, 'file:///$1:'));
const nb = buildNotebook(mod.default);
fs.mkdirSync(OUT_DIR, { recursive: true });
const out = path.join(OUT_DIR, outArg);
fs.writeFileSync(out, JSON.stringify(nb, null, 1));
const runnable = nb.cells.filter(c => c.cell_type === 'code').length;
console.log(`${out} — ${nb.cells.length} cells (${runnable} code)`);
