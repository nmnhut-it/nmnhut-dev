// Các đảo LeetCode chạy thật trong Pyodide, không phải CPython.
//
// test-content-solutions.mjs đã chấm các lời giải này dưới CPython, nhưng bộ
// chấm có đo giờ (py/leet_judge, thang kích thước tăng dần) và Pyodide chạy
// chậm hơn CPython vài lần — nên chỉ chạy thật trong trình duyệt mới biết lời
// giải đúng có kịp giờ hay không, và mỗi cell tốn bao lâu của học sinh.
//
// Ca âm bản ở mỗi đảo là lý do cả bộ chấm này tồn tại: một lời giải chạy được
// mà sai cách phải TRƯỢT. Cách chấm cũ (so khớp một dòng output cố định) cho
// cả hai kiểu đi qua — đáp án viết sẵn ở hai đảo đầu, và ở đảo nhị phân là
// `min(nums)`, đúng kết quả nhưng đọc cả mảng thay vì bỏ dần một nửa.
//
// Cần `python serve.py 8123` chạy sẵn. Chạy: node lessons/test-leet-browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert';

const BASE = 'http://localhost:8123/lessons/';
const CELL_BUDGET_MS = 90_000;   // trần cho một lần chấm, gồm cả ca đo giờ
const BOOT_MS = 120_000;

// `hardcoded` là đáp án đúng cho ví dụ trong đề và sai với mọi ca còn lại.
const ISLANDS = [
  {
    page: 'leetARRAYS.html',
    cells: ['two_sum.py', 'remove_duplicates.py', 'remove_element.py', 'merge_sorted_array.py',
      'container_with_most_water.py', 'maximum_subarray.py', 'three_sum.py', 'trapping_rain_water.py'],
    negative: {
      cell: 'maximum_subarray.py',
      source: 'from leet_arrays import check\n\n\ndef max_sub_array(nums):\n    return 6\n\n\ncheck("maximum-subarray", max_sub_array)\n',
    },
  },
  {
    page: 'leetPOINTERS.html',
    cells: ['sort_colors.py', 'remove_duplicates_ii.py', 'two_sum_sorted.py', 'three_sum_closest.py',
      'four_sum.py', 'minimum_size_subarray_sum.py', 'rotate_array.py', 'next_permutation.py',
      'product_except_self.py'],
    negative: {
      cell: 'minimum_size_subarray_sum.py',
      source: 'from leet_pointers import check\n\n\ndef min_sub_array_len(target, nums):\n    return 2\n\n\ncheck("minimum-size-subarray-sum", min_sub_array_len)\n',
    },
  },
  {
    page: 'leetSEARCH.html',
    cells: ['search_insert_position.py', 'search_range.py', 'find_min_rotated.py',
      'search_rotated.py', 'find_peak_element.py', 'search_2d_matrix.py',
      'search_rotated_ii.py', 'find_min_rotated_ii.py', 'median_two_sorted.py'],
    // Đúng đáp án nhưng quét tuyến tính — phải trượt vì đọc mảng quá nhiều lần.
    negative: {
      cell: 'find_min_rotated.py',
      source: 'from leet_search import check\n\n\ndef find_min(nums):\n    return min(nums)\n\n\ncheck("find-min-rotated", find_min)\n',
      expect: /WRONG APPROACH/,
      says: /quá mức .* lần cho phép/,
    },
  },
  {
    page: 'leetMATRIX.html',
    cells: ['spiral_matrix.py', 'spiral_matrix_ii.py', 'rotate_image.py',
      'set_matrix_zeroes.py', 'valid_sudoku.py', 'word_search.py', 'sudoku_solver.py'],
    // Xoá ngay khi gặp số 0 — số 0 mới ghi ra bị đọc nhầm là số 0 có sẵn.
    negative: {
      cell: 'set_matrix_zeroes.py',
      source: 'from leet_matrix import check\n\n\ndef set_zeroes(matrix):\n    for row, line in enumerate(matrix):\n        for col, value in enumerate(line):\n            if value == 0:\n                for other in range(len(line)):\n                    matrix[row][other] = 0\n                for other in range(len(matrix)):\n                    matrix[other][col] = 0\n\n\ncheck("set-matrix-zeroes", set_zeroes)\n',
    },
  },
  {
    page: 'leetBACKTRACK.html',
    cells: ['subsets.py', 'subsets_ii.py', 'permutations.py', 'permutations_ii.py',
      'combination_sum.py', 'combination_sum_ii.py', 'combination_sum_iii.py',
      'n_queens.py', 'word_search_ii.py'],
    // Quên chặn nhánh trùng: ra đủ đáp án nhưng kèm bản sao.
    negative: {
      cell: 'subsets_ii.py',
      source: 'from leet_backtrack import check\n\n\ndef subsets_with_dup(nums):\n    out = [[]]\n    for value in nums:\n        out += [group + [value] for group in out]\n    return out\n\n\ncheck("subsets-ii", subsets_with_dup)\n',
      says: /lời giải bị lặp/,
    },
  },
  {
    page: 'leetDP.html',
    cells: ['pascals_triangle.py', 'pascals_triangle_ii.py',
      'best_time_to_buy_and_sell_stock.py', 'best_time_to_buy_and_sell_stock_ii.py',
      'jump_game.py', 'jump_game_ii.py', 'minimum_path_sum.py',
      'unique_paths_ii.py', 'triangle.py'],
    // Đúng đáp án nhưng đánh dấu từng ô cho từng bước nhảy — quá giờ ở ca lớn.
    negative: {
      cell: 'jump_game.py',
      source: 'from leet_dp import check\n\n\ndef can_jump(nums):\n    reachable = [False] * len(nums)\n    reachable[0] = True\n    for index in range(len(nums)):\n        if reachable[index]:\n            for step in range(1, nums[index] + 1):\n                if index + step < len(nums):\n                    reachable[index + step] = True\n    return reachable[-1]\n\n\ncheck("jump-game", can_jump)\n',
      expect: /TOO SLOW/,
      says: /quá .* giây cho phép/,
    },
  },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.stack || error.message));

async function openCell(label) {
  await page.evaluate(target => window.nodeDev.toCell(target), label);
  await page.waitForFunction(target => {
    const cell = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    const button = cell?.querySelector('.crun');
    return !!(cell?._editor && button && !button.disabled);
  }, label, { timeout: BOOT_MS });
  return page.locator('.codecell').filter({ hasText: label }).first();
}

/** Chạy cell rồi đợi bộ chấm in verdict. Trả về {text, failed, ms}. */
async function runCell(label, cell) {
  const started = Date.now();
  await cell.locator('.crun').click({ force: true });
  await page.waitForFunction(target => {
    const host = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    const out = host?.querySelector('.cout')?.textContent || '';
    return /ALL TESTS PASSED|TESTS FAILED|TOO SLOW|WRONG APPROACH/.test(out) || !!host?.querySelector('.t-fail');
  }, label, { timeout: CELL_BUDGET_MS });
  return {
    text: await cell.locator('.cout').innerText(),
    failed: await cell.locator('.t-fail').count() > 0,
    ms: Date.now() - started,
  };
}

/** Nạp lời giải mẫu của chính content file, để test bám theo bài đã ship. */
async function runShippedSolution(label) {
  const cell = await openCell(label);
  await cell.locator('.csolution').click();
  await page.waitForFunction(target => {
    const host = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    return (host?._editor?.getValue() || '').includes('check(');
  }, label, { timeout: 10_000 });
  return runCell(label, cell);
}

let solved = 0;
const timings = [];
for (const island of ISLANDS) {
  await page.goto(BASE + island.page);
  await page.waitForFunction(() => !!window.nodeDev?.toCell, null, { timeout: BOOT_MS });

  for (const label of island.cells) {
    const { text, failed, ms } = await runShippedSolution(label);
    assert.match(text, /ALL TESTS PASSED/, `${island.page} ${label} — lời giải mẫu phải qua:\n${text}`);
    assert.ok(!failed, `${island.page} ${label} — lời giải mẫu bị đánh trượt`);
    solved += 1;
    timings.push(`${label} ${ms}ms`);
  }

  const cell = await openCell(island.negative.cell);
  await page.evaluate(([target, source]) => {
    const host = [...document.querySelectorAll('.codecell')].find(item => item.textContent.includes(target));
    host._editor.setValue(source);
  }, [island.negative.cell, island.negative.source]);
  const bad = await runCell(island.negative.cell, cell);
  assert.match(bad.text, island.negative.expect || /TESTS FAILED/, `${island.page} — lời giải hỏng lẽ ra phải trượt:\n${bad.text}`);
  assert.match(bad.text, island.negative.says || /đáp án là .* nhưng hàm trả về/, `${island.page} — máy chấm phải nói rõ vì sao trượt`);
  assert.ok(bad.failed, `${island.page} — cell phải bị đánh dấu .t-fail để không tính là hoàn thành`);
}

assert.deepEqual(pageErrors, [], 'trang không được có lỗi JS');
await browser.close();
console.log(`${solved} bài qua + ${ISLANDS.length} ca âm bản trượt đúng`);
console.log(timings.join(' · '));
