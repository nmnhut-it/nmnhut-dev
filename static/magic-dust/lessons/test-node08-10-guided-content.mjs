import assert from 'node:assert/strict';

const specs = {
  node08v2: {
    execution: ['types_first_steps', 'bool_value_steps', 'str_conversion_steps'],
    restored: ['mimic_age.py', 'mimic_sum.py', 'mimic_final.py'],
    minimumCode: 11,
    quizQuestions: 12,
  },
  node09v2: {
    execution: ['and_or_truth_steps', 'not_not_equal_steps', 'parentheses_logic_steps'],
    restored: ['shade_too_easy.py', 'shade_too_strict.py', 'shade_final_lock.py'],
    minimumCode: 15,
    quizQuestions: 5,
  },
  node10v2: {
    execution: ['for_smallest_steps', 'range_stop_steps'],
    restored: ['shade_missing_last.py', 'shade_unindented_ray.py', 'shade_final_count.py'],
    minimumCode: 11,
    quizQuestions: 6,
  },
};

for (const [name, spec] of Object.entries(specs)) {
  const lesson = (await import(`./content/${name}.js?guided=${Date.now()}-${name}`)).default;
  const labels = lesson.cells.map(cell => cell.label).filter(Boolean);
  assert.equal(new Set(labels).size, labels.length, `${name}: labels must stay unique`);

  const codeCells = lesson.cells.filter(cell => cell.code !== undefined);
  assert.ok(codeCells.length >= spec.minimumCode, `${name}: restored practice cells were removed`);
  const quizQuestions = lesson.cells.flatMap(cell => cell.quiz?.questions || []);
  assert.equal(quizQuestions.length, spec.quizQuestions, `${name}: original notebook quiz questions changed`);

  for (const label of spec.restored) {
    const cell = lesson.cells.find(candidate => candidate.label === label);
    assert.ok(cell?.code, `${name}: missing restored practice ${label}`);
    assert.ok(cell.note && cell.solution && cell.expectOut, `${name}/${label}: restored practice needs task, solution and success evidence`);
  }

  for (const label of spec.execution) {
    const cell = lesson.cells.find(candidate => candidate.label === label);
    assert.ok(cell?.execution, `${name}: missing guided observation ${label}`);
    const { code, frames } = cell.execution;
    assert.ok(Array.isArray(code) && code.length > 0, `${name}/${label}: full code must stay visible`);
    assert.ok(Array.isArray(frames) && frames.length >= 4, `${name}/${label}: needs a readable line progression`);
    for (const frame of frames) {
      assert.ok(code[frame.line - 1]?.trim(), `${name}/${label}: frame must point to a real Python line`);
      assert.ok(frame.observeMs >= 1200, `${name}/${label}: observation pause is too short`);
      assert.equal(frame.state?.visual?.kind, 'value', `${name}/${label}: unsupported visual kind`);
      assert.ok(typeof frame.explain === 'string' && frame.explain.trim().length >= 24, `${name}/${label}: Pip must explain the current line concretely`);
    }
  }
}

console.log('node08-10 guided content: additive traces, legacy practice and notebook quizzes retained');
