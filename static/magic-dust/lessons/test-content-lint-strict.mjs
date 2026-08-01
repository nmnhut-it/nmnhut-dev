import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const lessonsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(lessonsDir);
const tempDir = await mkdtemp(path.join(os.tmpdir(), 'magic-dust-content-lint-'));

function run(script, ...args) {
  return spawnSync(process.execPath, [path.join(lessonsDir, script), ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

try {
  const validatorFixture = path.join(tempDir, 'node99v2.js');
  await writeFile(validatorFixture, `export default {
    index: 99,
    cells: [
      { npc: "Pip đang nói một bong bóng cố tình dài hơn bốn mươi từ để bộ kiểm tra nhận ra rằng lời thoại này đã chứa quá nhiều ý, khiến học sinh phải đọc một đoạn dài thay vì theo dõi từng bước ngắn và rõ ràng trong bài học." },
      { quiz: { questions: [{ q: "Trong máy ở trên, nhánh nào chạy?", a: ["Nhánh một", "Nhánh hai"], correct: 0 }] } },
      { checkpoint: { text: "Hãy xếp các mốc từ thấp lên cao trong mọi chuỗi điều kiện." } },
      { code: "tuoi = 10\\n", note: "Bạn hãy kiểm chứng lời đoán vừa rồi.", expectOut: "10" }
    ]
  };\n`, 'utf8');

  const validator = run('validate-content.mjs', '--strict', validatorFixture);
  assert.equal(validator.status, 1, validator.stdout + validator.stderr);
  assert.match(validator.stdout, /Pip bubble has \d+ words/);
  assert.match(validator.stdout, /quiz depends on nearby content/);
  assert.match(validator.stdout, /threshold order is stated without its comparison direction/);
  assert.match(validator.stdout, /student-visible variable "tuoi" looks Vietnamese/);
  assert.match(validator.stdout, /code task depends on nearby content/);

  const voiceFixture = path.join(tempDir, 'voice-fixture.js');
  await writeFile(voiceFixture, 'const text = "Bạn sửa một đoạn thật. Câu `score > 3` cho kết quả gì?";\n', 'utf8');
  const voice = run('check-voice-terms.mjs', '--strict', voiceFixture);
  assert.equal(voice.status, 1, voice.stdout + voice.stderr);
  assert.match(voice.stdout, /sửa một đoạn thật/);
  assert.match(voice.stdout, /câu\/câu hỏi \+ điều kiện code/);

  const cleanVoiceFixture = path.join(tempDir, 'clean-voice-fixture.js');
  await writeFile(cleanVoiceFixture, 'const text = "OUTPUT: in đúng câu `Bữa mơ ước: <food> và <drink>!`.";\n', 'utf8');
  const cleanVoice = run('check-voice-terms.mjs', '--strict', cleanVoiceFixture);
  assert.equal(cleanVoice.status, 0, cleanVoice.stdout + cleanVoice.stderr);

  console.log('content lint strict checks: ok');
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
