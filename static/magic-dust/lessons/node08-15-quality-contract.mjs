export const GUIDED_NODE_CONTRACTS = {
  node08v2: {
    file: 'lessons/content/node08v2.js',
    minimum: { cells: 45, code: 11, quizQuestions: 12, checkpoints: 3 },
    labels: ['types_first_steps', 'bool_value_steps', 'str_conversion_steps', 'type_probe.py', 'string_sum_bug.py', 'number_sum_fix.py', 'bool_value_demo.py', 'bool_string_fix.py', 'str_conversion_demo.py', 'age_label_fix.py', 'mimic_age.py', 'mimic_sum.py', 'mimic_final.py', '🔧 XƯỞNG PHÉP: Thẻ kiểu giá trị'],
    concepts: ['type\\(', '\\bstr\\b', '\\bint\\b', '\\bbool\\b', 'read_num\\(', 'str\\('],
  },
  node09v2: {
    file: 'lessons/content/node09v2.js',
    minimum: { cells: 48, code: 15, quizQuestions: 5, checkpoints: 4 },
    labels: ['and_or_truth_steps', 'not_not_equal_steps', 'parentheses_logic_steps', 'two_lock_old_way.py', 'and_four_cases.py', 'and_guard.py', 'and_or_same_fingers.py', 'or_gate_fix.py', 'not_flip.py', 'not_equal_demo.py', 'not_equal_shortcut.py', 'too_lenient_or.py', 'too_strict_and.py', 'parentheses_sample.py', 'parentheses_guard.py', 'shade_too_easy.py', 'shade_too_strict.py', 'shade_final_lock.py'],
    concepts: ['\\band\\b', '\\bor\\b', '\\bnot\\b', '!=', 'ngoặc'],
  },
  node10v2: {
    file: 'lessons/content/node10v2.js',
    minimum: { cells: 36, code: 11, quizQuestions: 6, checkpoints: 3 },
    labels: ['for_smallest_steps', 'range_stop_steps', 'while_five_beats.py', 'range_zero_demo.py', 'range_zero_beats.py', 'range_start_stop_demo.py', 'range_start_stop.py', 'for_four_sparks_demo.py', 'portal_four_sparks.py', 'for_indent_fix.py', 'shade_missing_last.py', 'shade_unindented_ray.py', 'shade_final_count.py'],
    concepts: ['\\bwhile\\b', '\\bfor\\b', 'range\\(', 'thụt lề', 'dừng trước'],
  },
  node11: {
    file: 'lessons/content/node11.js',
    minimum: { cells: 45, code: 11, quizQuestions: 24, checkpoints: 4 },
    labels: ['one_card_machine', 'two_card_machine', 'connect_two_cards.py', 'three_card_machine', 'add_third_card.py', 'pc_order_machine', 'repair_route.py', 'repair_missing_card.py', 'if_to_goto_machine', 'while_to_goto_machine', 'cards_first_jump.py', 'fix_goto_target.py', 'route_spark_gate.py', 'three_card_gate.py', 'build_missing_card.py', 'skip_trap_card.py', 'final_route_repair.py'],
    concepts: ['GOTO', '99', 'END', '\\bpc\\b', 'if', 'while'],
    guidedConcepts: ['program counter|bộ đếm chương trình'],
  },
  node12: {
    file: 'lessons/content/node12.js',
    minimum: { cells: 28, code: 7, quizQuestions: 12, checkpoints: 2 },
    labels: ['memory_overwrite_steps', 'copy_value_steps', 'swap_with_temp_steps', 'memory_overwrite_demo.py', 'copy_value_demo.py', 'print_current_box.py', 'cp_sum_two_boxes.py', 'swap_with_temp_demo.py', 'broken_swap.py', 'cp_update_hp.py'],
    concepts: ['gán', 'ghi đè', 'temp', 'đổi chỗ', 'ô nhớ'],
  },
  node13: {
    file: 'lessons/content/node13.js',
    minimum: { cells: 34, code: 10, quizQuestions: 12, checkpoints: 3 },
    labels: ['list_build_first_boxes', 'list_update_one_box_steps', 'list_last_index_steps', 'list_three_boxes.py', 'first_index_fix.py', 'list_update_one_box.py', 'update_last_box.py', 'cp_print_index.py', 'last_by_length_demo.py', 'last_by_length.py', 'imp_first_box.py', 'imp_wrong_update.py', 'imp_final_last.py'],
    concepts: ['list', 'index', 'len\\(', '\\[0\\]', 'len\\(a\\) - 1'],
  },
  node14: {
    file: 'lessons/content/node14.js',
    minimum: { cells: 44, code: 15, quizQuestions: 14, checkpoints: 4 },
    labels: ['scan_total_steps', 'scan_count_steps', 'scan_best_steps', 'scan_found_steps', 'scan_sum_demo.py', 'sum_start_fix.py', 'count_big_demo.py', 'count_big_fix.py', 'count_even_demo.py', 'count_even_fix.py', 'max_scan_demo.py', 'max_scan_fix.py', 'find_target_demo.py', 'find_target_fix.py', 'cp_sum_n_numbers.py', 'cp_sum_n_numbers_fix.py', 'shade_sum_start.py', 'shade_max_sign.py', 'shade_final_count_even.py'],
    concepts: ['total', 'count', 'best', 'found', 'quét'],
  },
  node15: {
    file: 'lessons/content/node15.js',
    minimum: { cells: 36, code: 11, quizQuestions: 12, checkpoints: 4 },
    labels: ['grid_from_one_cell_steps', 'grid_row_column_steps', 'grid_nested_loop_steps', 'grid_read_demo.py', 'row_col_fix.py', 'grid_update_demo.py', 'grid_update_fix.py', 'row_sum_demo.py', 'row_sum_fix.py', 'grid_total_demo.py', 'grid_count_ones_fix.py', 'shade_row_col.py', 'shade_wrong_row_sum.py', 'shade_final_count_grid.py'],
    concepts: ['grid', 'hàng', 'cột', 'vòng lặp lồng nhau', '\\[row\\]\\[col\\]|\\[0\\]\\[0\\]'],
  },
};
