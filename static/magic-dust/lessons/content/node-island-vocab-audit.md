# Node/Island Vocabulary Audit

Method: Vietnamese lexicon + left-to-right Forward Maximum Matching + right-to-left Backward Maximum Matching + curated suspicious phrase patterns. Rows are review hints, not final proof of bad wording.

Vocabulary: RDRsegmenter VnVocab extracted to lessons/tools/nlp/RDRsegmenter-VnVocab.words.txt (32728 entries).

| Type | # / unlock | Title | Teaches | Language flags |
|---|---:|---|---|---|
| node | 0 | Old Computer: Anatomy of a Machine | mọi cỗ máy, mọi bài chú: INPUT → PROCESS → OUTPUT \| quiz: Ba phần của mọi chương trình; say() là gì; Chọn đáp án \| practice: first_say.py | term: INPUT, PROCESS, OUTPUT, RUN, MẬT NGỮ, Pip, thần chú, bài chú, biến, chuỗi \| OOV: xử(4), anatomy, bundle, chuỗi, game, machine, node, robot, rookie, suỵt |
| node | 1 | Old Computer: Words | học read(), say(), chuỗi, và ghép chữ bằng dấu + \| quiz: Ôn OUTPUT ở trạm trước; Chuỗi hợp lệ; Nghe nói; Ghép chữ \| practice: strings_zoo.py, my_strings.py, echo.py, greet.py, greet_again.py | term: INPUT, PROCESS, OUTPUT, RUN, Pip, bài chú, biến, chuỗi \| OOV: chuỗi(33), mood(11), name(8), viền(7), full(5), xâu(4), animal(3), first(3), greeting(3), hello(3) \| FMM/BMM lệch: 2 |
| node | 2 | Old Computer: Numbers | đếm, tính toán, và đọc thông báo lỗi \| quiz: Ôn chữ trước khi học số; Số thật; Ký hiệu phép tính; Dấu nháy khớp \| practice: calc.py, calc_full.py, quote.py, indent.py, 🔧 XƯỞNG PHÉP: Máy tính tuổi \| forge quiz \| boss/KO | term: INPUT, PROCESS, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, chuỗi \| OOV: num(6), python(4), chuỗi(2), node(2), numbers(2), bundle, calc, chặng, hãy, name \| FMM/BMM lệch: 2 |
| node | 3 | Input and Output | INPUT biết thay đổi — cỗ máy này NHÌN thấy tay bạn \| quiz: Ôn lại bài cũ; Vẫn chỉ là một cái hộp; Tay thật; Hiện lên màn hình \| practice: finger_var.py, finger_practice.py, watch_print.py, display_finger.py, always_fire.py \| forge quiz \| boss/KO | term: INPUT, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, biến, chuỗi, điều kiện, AR \| OOV: console(9), mirror(3), charm(2), chuỗi(2), fire(2), future(2), vortex(2), chặng, finger, machine |
| node | 4 | Rules: if & elif | một cỗ máy, NHIỀU luật — if rồi elif rồi elif \| quiz: Ôn camera thật; Đúng mới chạy; Cuối dòng if; Lửa có điều kiện \| practice: rule_on_paper.py, make_it_true.py, real_rule.py, cracked_rule.py, two_rules.py \| forge quiz \| boss/KO | term: INPUT, PROCESS, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, biến, điều kiện, AR \| OOV: finger(6), xoáy(4), hãy(3), lighten(3), node(3), fire(2), vortex(2), booth, charm, comment \| FMM/BMM lệch: 2 |
| node | 5 | Choices: Else and Everything Else | if/elif/else + phép tính + camera thật — mọi thứ hợp lại \| quiz: Ôn ba luật; Else là gì; Display khác Say; Đoán trước khi chạy \| practice: gap_in_rules.py, first_else.py, fortune_machine.py, fortune_machine_display.py, branch_drill.py \| forge quiz \| boss/KO | term: RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, biến, chuỗi, điều kiện, AR, camera, if \| OOV: console(7), finger(5), paradox(4), sphinx(4), chuỗi(3), freeze(2), xử(2), choices, dãy, everything \| FMM/BMM lệch: 6 |
| node | 6 | Boundaries: More or Less | dấu so sánh > < >= <= — và con bug trốn ngay tại mốc \| quiz: Ôn luật đầy đủ; Đoán trước khi chạy; Bắt bug ranh giới; Bằng chứng của pháp sư \| practice: gate_equal.py, gate_greater.py, gate_boundary.py, gate_at_least.py, boundary_table.py \| forge quiz \| boss/KO | term: RUN, MẬT NGỮ, BOM MẬT NGỮ, Kotopia, Pip, chuỗi, điều kiện, AR, camera, if \| OOV: hãy(12), xếp(6), golem(5), measure(3), chuỗi(2), console(2), suc(2), tùy(2), boundaries, boundary \| FMM/BMM lệch: 1 |
| node | 7 | Repeat: The While Loop | viết luật một lần, máy lặp ngàn lần — và luật DỪNG \| quiz: Ôn cổng ranh giới; Chép tay tới bao giờ; Lần theo vòng lặp; If một lần, while nhiều lần \| practice: charge_loop.py, if_vs_while.py, charge_loop_12.py, countdown.py, cracked_countdown.py \| forge quiz \| boss/KO | term: RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, biến, điều kiện, vòng lặp, camera, while, if \| OOV: hãy(9), suc(4), five(3), high(3), loop(3), xoáy(3), node(2), repeat(2), booth, cell \| FMM/BMM lệch: 2 |
| node | 8 | Old Computer: Types | str/int/bool, type(), và bí mật cũ của mọi giá trị \| quiz: Ôn máy lấy chữ và lấy số; Dấu vết trong máy cổ; Soi nhãn giá trị; Một dấu, hai việc \| practice: type_probe.py, string_sum_bug.py, number_sum_fix.py, bool_value_demo.py, bool_string_fix.py \| forge quiz \| boss/KO | term: OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, chuỗi, while, True \| OOV: chuỗi(13), type(7), bool(4), mimic(3), node(2), num(2), archive, bundle, hãy, hóa |
| node | 9 | Logic Gates: and or not | ghép điều kiện bằng and, or, not — và dấu != \| quiz: Ôn đường cũ; Cổng cần cả hai; Cổng chọn một trong hai; Đảo ngược điều kiện \| practice: two_lock_old_way.py, and_four_cases.py, and_guard.py, and_or_same_fingers.py, or_gate_fix.py \| forge quiz \| boss/KO | term: RUN, MẬT NGỮ, BOM MẬT NGỮ, Kotopia, Pip, Chúa tể Vô Định, Vô Định, bài chú, hải đăng, biến \| OOV: finger(14), hãy(10), shade(3), suc(3), both, either, flip, future, gates, machine |
| node | 10 | Repeat: for / range() | lặp theo số lượt biết trước, khác với while lặp theo điều kiện \| quiz: Ôn Vực Xoáy; Cuộn chú đếm lượt; Đếm từ số không; Dừng trước mốc cuối \| practice: while_five_beats.py, range_zero_demo.py, range_zero_beats.py, range_start_stop_demo.py, range_start_stop.py \| forge quiz \| boss/KO | term: OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, cuộn chú, biến, điều kiện, vòng lặp \| OOV: count(5), hãy(5), shade(3), thắp(2), counted, future, loop, machine, packet, repeat \| FMM/BMM lệch: 1 |
| node | 11 | Super Old Computer: GOTO | mở máy rất cũ: program counter, nhảy dòng, rồi viết lại for và while bằng bước nhỏ \| quiz: Ôn for / while; Dòng tiếp theo; Lần theo cú nhảy; Đọc đích nhảy \| practice: pc_first_jump.py, fix_jump_target.py, while_as_pc.py, pc_loop_guard.py, for_unwrapped_to_while.py \| forge quiz \| boss/KO | term: RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, điều kiện, vòng lặp, while, for \| OOV: jump(4), ghost(3), stop(3), counter(2), hãy(2), program(2), super(2), boot, done, goto |
| node | 12 | Đảo Ô Nhớ | biến là tên dán lên ô nhớ; gán là ghi giá trị mới vào ô \| quiz: Ôn máy nhảy và biến; Ô nhớ đầu tiên; Cập nhật ô nhớ; Lần theo input/output \| practice: memory_overwrite_demo.py, copy_value_demo.py, print_current_box.py, cp_sum_two_boxes.py, swap_with_temp_demo.py \| forge quiz \| boss/KO | term: INPUT, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, điều kiện, list \| OOV: memory(7), xử(4), hãy(3), leaker(3), damage(2), heal(2), box, island, list, mana \| FMM/BMM lệch: 4 |
| node | 13 | Lists: Hàng Ô Nhớ | list là nhiều ô nhớ đứng cạnh nhau; index chọn đúng ô cần đọc hoặc sửa \| quiz: Ôn ô nhớ; Ô số mấy; Bắt đầu từ 0; Sửa một ô \| practice: list_three_boxes.py, first_index_fix.py, list_update_one_box.py, update_last_box.py, cp_print_index.py \| forge quiz \| boss/KO | term: INPUT, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, list, index \| OOV: index(22), list(19), imp(4), hãy(3), dãy, lists, memory, packet, row |
| node | 14 | List Scan Patterns | đi qua từng ô một lần: cộng tổng, đếm, tìm lớn nhất, tìm mục tiêu \| quiz: Ôn list và index; Mẫu tổng; Mẫu đếm; Mẫu lớn nhất \| practice: scan_sum_demo.py, sum_start_fix.py, count_big_demo.py, count_big_fix.py, max_scan_demo.py \| forge quiz \| boss/KO | term: INPUT, OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, bài chú, biến, điều kiện, vòng lặp, list \| OOV: list(19), scan(8), shade(3), bool(2), hãy(2), index(2), packet, patterns, xương |
| node | 15 | Grid Memory: Hàng và Cột | list trong list: đọc bảng bằng grid[hang][cot], rồi quét bằng vòng lặp lồng nhau \| quiz: Ôn quét list; Bảng ô nhớ; Hàng trước, cột sau; Sửa một ô trong bảng \| practice: grid_read_demo.py, row_col_fix.py, grid_update_demo.py, grid_update_fix.py, row_sum_demo.py \| forge quiz \| boss/KO | term: OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Pip, bài chú, biến, điều kiện, vòng lặp, list \| OOV: list(12), index(7), shade(4), chặng, memory, packet, python, scan \| FMM/BMM lệch: 3 |
| node | 16 | Search & Sort: Dò Tìm và Sắp Xếp | tự viết dò tìm tuần tự và sắp xếp nổi bọt bằng while, for, if — không dùng lệnh có sẵn \| quiz: Ôn quét tìm lớn nhất; Dò tìm bằng cờ; Dò vị trí và báo vắng; Đổi chỗ và hướng xếp \| practice: linear_search_demo.py, linear_search_fix.py, find_position_demo.py, find_position_fix.py, bubble_sort_demo.py \| forge quiz \| boss/KO | term: OUTPUT, RUN, MẬT NGỮ, BOM MẬT NGỮ, Kotopia, Pip, bài chú, biến, điều kiện, vòng lặp \| cụm lạ: cờ bật/hạ cờ \| OOV: xếp(26), list(22), chaos(4), index(4), shuffler(4), xóa(2), bubble, chặng, packet, xây \| FMM/BMM lệch: 4 |
| node | 17 | ? ? ? | chưa có content/page | không nổi bật theo heuristic |
| island | island01 @2 | ĐẢO LUYỆN CHỮ | luyện thêm read(), say(), chuỗi, và ghép chữ bằng dấu + \| quiz: Đoán output; read() với say(); Input không dùng tới vẫn hợp lệ; Ghép nhiều mảnh \| practice: island_predict1.py, island_fix1.py, island_write1.py, island_read1.py, island_write2.py | term: INPUT, PROCESS, OUTPUT, RUN, MẬT NGỮ, biến, chuỗi \| OOV: chuỗi(7), favorite(3), color(2), pet(2), xanh(2), city, drink, food |
| island | island02 @3 | ĐẢO LUYỆN SỐ | luyện thêm read_num(), say_num(), và bốn phép tính + - * / \| quiz: Đoán kết quả; Chọn đúng phép tính; Tổng hợp \| practice: island_predict2.py, island_fix2.py, island_write3.py, island_write4.py | term: INPUT, PROCESS, OUTPUT, RUN \| OOV: num(8), diem(2) \| FMM/BMM lệch: 1 |
| island | islandIO @2 | ĐẢO INPUT/OUTPUT | nhìn Mật Ngữ, chỉ ra dòng nào là INPUT, dòng nào là OUTPUT, đoán xem máy in ra gì — và vẽ ASCII ART bằng say() \| quiz: Soi INPUT/OUTPUT — io_spot1.py; read() cũng hiện chữ lên màn hình — có phải OUTPUT không?; Đếm input/output — io_spot2.py; INPUT và OUTPUT không nhất định bằng nhau \| practice: io_run1.py, io_onlyask.py, io_run2.py, io_run3.py, io_ascii1.py | term: INPUT, OUTPUT, RUN, MẬT NGỮ, bài chú, biến \| OOV: art(5), ascii(5), name(3), pet(2), xếp(2), enter, onlyask, xanh \| FMM/BMM lệch: 1 |
| island | islandVARHOSP @2 | BỆNH VIỆN TÊN BIẾN | chữa các vết nứt do gõ sai tên biến, thiếu dấu +, hoặc dùng nhầm biến \| quiz: Tên biến phải khớp; Soi vết nứt; Biến chưa được tạo \| practice: var_check_ok.py, var_fix_spelling.py, var_fix_plus.py, var_write_twice.py, var_fix_input_name.py | term: INPUT, OUTPUT, RUN, MẬT NGỮ, Kotopia, Pip, thần chú, bài chú, biến, chuỗi \| OOV: chuỗi(3) |
| island | islandSTRINGLAB @2 | PHÒNG THÍ NGHIỆM CHUỖI | thử dấu nháy, dấu cách, thứ tự ghép chữ, và output nhiều dòng \| quiz: Chuỗi có gì bên trong; Thứ tự ghép; Dấu nháy và dấu cộng; Dấu cách trong chuỗi \| practice: string_samples.py, string_order.py, string_fix_quote.py, string_fix_join.py, string_sign.py | term: INPUT, OUTPUT, RUN, MẬT NGỮ, Pip, biến, chuỗi \| OOV: chuỗi(21) \| FMM/BMM lệch: 1 |
| island | islandMARKET @3 | CHỢ BỤI PHÉP | tính giá, số lượng, tiền thừa, và tổng nhiều món bằng read_num()/say_num() \| quiz: Giá nhân số lượng; Chọn phép tính ở quầy; Tiền thừa; Hóa đơn nhiều món \| practice: market_total_sample.py, market_fix_total.py, market_write_total.py, market_change_sample.py, market_write_change.py | term: OUTPUT, RUN, MẬT NGỮ, Kotopia, Pip, bài chú, biến \| OOV: hóa(6), num(3), tien(2), hãy, luong, thủy \| FMM/BMM lệch: 3 |
| island | islandEFFECTSTAGE @4 | RẠP NỐI HIỆU ỨNG | xếp nhiều output camera chạy theo thứ tự: display(), fire_vortex(), display() \| quiz: Máy chạy từ trên xuống; Input không phải output; Gọi đủ lệnh; Một input, nhiều output nối tiếp \| practice: stage_three_beats.py, stage_watch_then_show.py, stage_fix_call.py, stage_write_ending.py, stage_full_show.py | term: INPUT, OUTPUT, RUN, MẬT NGỮ, Pip, điều kiện, camera, if \| OOV: fire(2), vortex(2), xếp(2) |
| island | islandAR @5 | ĐẢO PHÉP CAMERA | chơi lại mọi lệnh của camera_charm — watch(), display(), fire_vortex(), lighten(), darken(), photo_booth() \| quiz: Một input, nhiều output; Đọc bảng luật; Không có luật khớp \| practice: ar_watch.py, ar_fire.py, ar_screen.py, ar_combo.py, ar_recipe1.py | term: INPUT, OUTPUT, RUN, MẬT NGỮ, Pip, bài chú, chuỗi, điều kiện, AR, camera \| OOV: darken(6), lighten(6), charm(5), ๑(4), fire(4), vortex(4), xoáy(4), booth(2), ᴗ(2), photo(2) \| FMM/BMM lệch: 2 |
| island | islandBRANCH @6 | ĐẢO NHÁNH RẼ | luyện thêm if/elif/else — đoán nhánh nào chạy trước khi RUN \| quiz: Đoán nhánh — branch1.py; Rơi xuống else — branch2.py; Máy dừng ở nhánh đúng đầu tiên; Soi lỗi trước khi RUN — branch_fix1.py \| practice: branch1.py, branch2.py, branch_fix1.py, branch_write1.py, branch_show.py | term: RUN, điều kiện, camera, if, elif, else \| OOV: darken, finger, fire, lighten, vortex, xét \| FMM/BMM lệch: 1 |
| island | islandCOMPARE @7 | ĐẢO SO SÁNH | luyện thêm > < >= <= và bắt lỗi ranh giới đúng tại mốc \| quiz: Đúng tại mốc — compare1.py; Vì sao phải thử tại mốc; Đúng tại mốc — compare2.py; Chọn đúng dấu so sánh \| practice: compare1.py, compare_fix1.py, compare2.py, compare_fix2.py, compare_write1.py | term: RUN, điều kiện, camera, if, elif, else \| OOV: xếp(5), darken, fire, lighten, vortex |
| island | islandWHILE @8 | ĐẢO VÒNG LẶP | luyện thêm while — đoán số vòng, sửa vòng vô tận, gom sức mạnh bằng watch() \| quiz: Đếm vòng trước khi RUN — while_count4.py; Lần theo biến điều kiện; Soi vòng vô tận — loop_no_update.py; Dòng nào chặn vòng vô tận \| practice: while_count4.py, while_write_count.py, loop_fix_update.py, loop_fix_boundary.py, while_charge_watch.py | term: INPUT, RUN, Pip, bài chú, biến, điều kiện, vòng lặp, camera, while \| OOV: sạc(2), suc(2), hãy, node, num |
| island | islandTYPES @9 | ĐẢO KIỂU DỮ LIỆU | luyện thêm type(), str/int/bool, và lỗi ghép chữ với số \| quiz: Soi kiểu trước khi RUN — types1.py; type() của biến mới; Chữ 5 khác số 5; Dự đoán + theo kiểu \| practice: types1.py, types_write1.py, string_vs_int.py, int_fix_sum.py, bool_pairs.py | term: RUN, Pip, bài chú, biến, chuỗi, if, True, False, str \| OOV: bool(10), chuỗi(4), type(3), ket(2), suc(2), xử \| FMM/BMM lệch: 2 |
| island | islandPROJECT1 @9 | ĐẢO GÁC CỔNG KOTOPIA | xưởng tổng hợp: while + if/elif/else + type()/str/int/bool \| quiz: Bool giữ luật dừng — gate_bool.py; Cập nhật bool trong vòng lặp; Soi kiểu trước khi mở cổng; Chặn sai kiểu trước vòng lặp \| practice: gate_bool.py, gate_bool_write.py, gate_type_fix.py, gate_branch_loop.py, kotopia_gate.py | term: INPUT, RUN, Kotopia, bài chú, biến, chuỗi, vòng lặp, camera, while, if \| OOV: bool(6), suc(2), chuỗi, gate, hãy, muc, python, type, xóa |
| island | islandRPS @10 | ĐẢO OẲN TÙ TÌ | ghép watch(), machine_move(), and/elif/else để đấu oẳn tù tì với máy \| quiz: Ôn luật and trước khi đấu; Một cách tạo input mới; Đoán ai thắng \| practice: rps_machine.py, rps_watch.py, rps_hoa.py, rps_recipe.py, rps_sangtao.py | term: INPUT, RUN, Pip, biến, điều kiện, AR, camera, if, elif, else \| OOV: oẳn(10), hòa(6), machine(2), move(2), xắc(2), xúc(2) |
| island | islandAR2 @8 | ĐẢO PHÉP CAMERA II | 5 hiệu ứng màn hình mới — sepia(), invert(), grayscale(), flip_mirror(), shake_screen() — ghép với vòng lặp while \| quiz: 5 hiệu ứng mới; Vòng lặp đổi hiệu ứng \| practice: ar2_sepia.py, ar2_invert.py, ar2_grayscale.py, ar2_mirror.py, ar2_shake.py | term: INPUT, OUTPUT, RUN, vòng lặp, mốc dừng, AR, camera, while, if, elif \| OOV: shake(7), screen(6), grayscale(5), invert(5), sepia(5), flip(4), mirror(4), five(3), high(3), node(3) |
| island | islandPATTERN @11 | ĐẢO HỌA TIẾT VÒNG LẶP | vẽ hình bằng hàng/cột, đảo chiều, in số theo quy luật, cộng dồn \| quiz: Soi hàng trước khi RUN; Vòng trong chạy mấy lần; Đảo số ký tự mỗi hàng; Quy luật số trong hàng \| practice: draw_triangle.py, reverse_triangle.py, number_stairs.py, sum_one_to_n.py, star_lighthouse.py | term: INPUT, RUN, bài chú, biến, chuỗi, vòng lặp, camera, for, range, if \| OOV: xây(5), họa(3), hãy(2), chuỗi, cot, python |
| island | islandNESTEDFOR @11 | ĐẢO VÒNG LỒNG | giải bài toán hàng-cột, bảng nhân, bản đồ tọa độ, và mã khóa hai số \| quiz: Ôn một vòng `for`; Đếm số lượt thật; Đọc một ô trong bảng; Tọa độ trong lưới \| practice: seat_labels_demo.py, shelf_boxes.py, multiplication_grid.py, treasure_map.py, two_digit_lock.py | term: RUN, bài chú, biến, điều kiện, for, range, if, and \| OOV: tọa(5), xử(2), xếp \| FMM/BMM lệch: 2 |
| island | islandGRIDBASIC @16 | ĐẢO BẢNG SỐ | luyện quét cả bảng: dựng bảng từ công thức, tính tổng, đếm, trung bình, lớn nhất, tổng một hàng và một cột \| quiz: Ôn đọc một ô; Dựng bảng từ công thức; Tổng cả bảng; Đếm ô theo điều kiện \| practice: grid_warmup_demo.py, grid_warmup_fix.py, grid_build_demo.py, grid_build_fix.py, grid_sum_demo.py | term: OUTPUT, RUN, Pip, biến, điều kiện, vòng lặp, list, grid, for, range \| OOV: list(6), cot, muc, tieu, xét, xử \| FMM/BMM lệch: 1 |
| island | islandGRIDOPS @16 | ĐẢO PHÉP TOÁN BẢNG | cộng bảng, nhân bảng, chuyển vị, đổi hàng/cột, đường chéo, đối xứng và viền bảng — tất cả bằng cùng một kiểu quét lồng nhau \| quiz: Ôn dựng bảng trống; Bảng mới hay bảng cũ?; Đổi hàng thành cột; Đổi hàng và đổi cột \| practice: grid_add_demo.py, grid_add_fix.py, grid_scale_demo.py, grid_scale_fix.py, grid_transpose_demo.py | term: OUTPUT, RUN, Pip, biến, điều kiện, vòng lặp, list, grid, for, range \| OOV: viền(14), xứng(10), list(5), python(2), xoay(2), memory, xử \| FMM/BMM lệch: 4 |
| island | islandGRIDQUEST @16 | ĐẢO TRUY TÌM & BIẾN HÌNH | truy tìm tọa độ, xoay lưới, và kiểm tra ô vuông thần kỳ — vẫn chỉ là vòng lồng nhau \| quiz: Ôn đọc lưới; Truy tìm tọa độ; Xoay lưới 90 độ; Ô vuông thần kỳ \| practice: grid_search_demo.py, grid_search_fix.py, rotate_90_demo.py, rotate_90_fix.py, magic_square_demo.py | term: OUTPUT, RUN, Pip, biến, vòng lặp, index, grid, for, else, True \| OOV: xoay(19), tọa(5), index(2) \| FMM/BMM lệch: 2 |
| island | islandPIXELART @16 | ĐẢO TRANH ĐIỂM ẢNH | một bức tranh chỉ là một bảng số 0 và 1 — vẽ, đếm, đảo, lật, rồi thử chính những phép đó lên camera thật \| quiz: Đọc một hàng điểm ảnh; Đếm ô sáng; Bật sáng đúng ô; Đảo một điểm ảnh \| practice: in_tranh_demo.py, in_tranh_fix.py, dem_sang_demo.py, dem_sang_fix.py, ve_mat_cuoi_demo.py | term: RUN, Pip, biến, chuỗi, điều kiện, vòng lặp, grid, camera, for, range \| OOV: charm(7), chuỗi(4), hóa(3), xứng(3), tùy, xây, xoay, xử \| FMM/BMM lệch: 1 |
| island | islandEDGE @16 | ĐẢO DỰ ÁN: TÁCH VIỀN ẢNH | dự án tổng hợp: ghép tranh điểm ảnh 0/1 với một ý mới — soi hàng xóm của từng điểm — để tìm đường viền của một hình \| quiz: Đọc hàng xóm của một ô; Đọc hàng xóm ở mép bảng; Nhận ra điểm viền \| practice: hang_xom_demo.py, mep_bang_demo.py, mep_bang_fix.py, tach_vien_demo.py, tach_vien_fix.py | term: RUN, Pip, bài chú, chuỗi, điều kiện, vòng lặp, grid, pixel, AR, camera \| OOV: viền(38), xóm(33), xét(6), vien(3), xử(2), chuỗi, dem \| FMM/BMM lệch: 4 |
| tower | tower @5 | THÁP VÔ ĐỊNH | leo càng cao, thử thách càng nặng — 3 mạng, xem bạn trụ tới tầng mấy \| quiz: Thần chú isupper/islower; Chỉ số và độ dài chuỗi; Thần chú in và +=; Thần chú ord() \| practice: floor01_can_so.py, floor02_dem_so_le.py, floor03_guong_ba_chu_so.py, floor04_so_hoan_hao.py, floor06_so_xau_xi.py \| forge quiz \| boss/KO | term: INPUT, PROCESS, OUTPUT, MẬT NGỮ, BOM MẬT NGỮ, Kotopia, Pip, Vô Định, thần chú, biến \| OOV: chuỗi(18), ket(11), cur(8), lech(7), best(6), num(6), bat(5), dau(5), doi(5), donvi(5) \| FMM/BMM lệch: 5 |

## Suspicious Phrase Examples

### node 16: Search & Sort: Dò Tìm và Sắp Xếp
- Phrase: cờ bật/hạ cờ
  - Sentence: List có số 7 nên cờ   bật lên, vòng lặp dừng sớm, output là CO.
  - Note: nên nêu giá trị bool cụ thể: "đổi thành True" hoặc "gán ... = False"

## FMM/BMM Examples

### node 1: Old Computer: Words
- Sentence: Một CHUỖI là nhiều ký tự (chữ, số, dấu cách, ký hiệu) viết LIÊN TIẾP nhau — nối nhau như xâu hạt nên mới gọi là "chuỗi".
  - FMM: một chuỗi là nhiều ký_tự chữ_số dấu cách ký_hiệu viết liên_tiếp nối như xâu hạt nên mới gọi_là chuỗi
  - BMM: một chuỗi là nhiều ký_tự chữ_số dấu cách ký_hiệu viết liên tiếp_nối như xâu hạt nên mới gọi_là chuỗi
- Sentence: có giá trị gì?
  - FMM: có_giá trị gì
  - BMM: có giá_trị gì

### node 2: Old Computer: Numbers
- Sentence: thay cho dấu chấm câu
  - FMM: dấu_chấm câu
  - BMM: dấu chấm_câu
- Sentence: OUTPUT: 4 dòng — dòng chữ "Chu vi:", số chu vi, dòng chữ "Diện tích:", số diện tích
  - FMM: dòng dòng chữ_số dòng chữ diện_tích số diện_tích
  - BMM: dòng dòng chữ_số dòng chữ diện tích_số diện_tích

### node 4: Rules: if & elif
- Sentence: Lửa có điều kiện
  - FMM: lửa có_điều kiện
  - BMM: lửa có điều_kiện
- Sentence: Muốn nối thêm một luật CÓ ĐIỀU KIỆN mới vào sau  , dùng từ khóa nào?
  - FMM: muốn nối thêm một luật có_điều kiện mới vào dùng từ khóa nào
  - BMM: muốn nối thêm một luật có điều_kiện mới vào dùng từ khóa nào

### node 5: Choices: Else and Everything Else
- Sentence: Nó không có điều kiện riêng và luôn đứng cuối dãy  / / .
  - FMM: nó không có_điều kiện riêng và luôn đứng cuối dãy
  - BMM: nó không có điều_kiện riêng và luôn đứng cuối dãy
- Sentence: không có điều kiện riêng; nó chạy khi các nhánh trên đều không khớp.
  - FMM: không có_điều kiện riêng nó chạy các nhánh trên đều không khớp
  - BMM: không có điều_kiện riêng nó chạy các nhánh trên đều không khớp
- Sentence: phần thưởng cho việc làm chủ if/elif/else — biết else bắt MỌI trường hợp còn lại, và máy luôn dừng ở nhánh ĐÚNG ĐẦU TIÊN.
  - FMM: phần_thưởng việc_làm chủ biết bắt mọi trường_hợp còn lại và máy luôn dừng ở nhánh đúng đầu_tiên
  - BMM: phần_thưởng việc làm_chủ biết bắt mọi trường_hợp còn lại và máy luôn dừng ở nhánh đúng đầu_tiên

### node 6: Boundaries: More or Less
- Sentence: Luật ghi "đủ 100 vàng TRỞ LÊN thì được giảm giá" mà code viết  .
  - FMM: luật đủ vàng trở lên thì được giảm_giá mà viết
  - BMM: luật đủ vàng trở lên thì được giảm giá_mà viết

### node 7: Repeat: The While Loop
- Sentence: Máy sẽ kiểm tra điều kiện — còn đúng thì chạy hết khối thụt lề — rồi quay lên kiểm tra lại — đến khi điều kiện đó sai thì DỪNG và đi tiếp xuống dưới.
  - FMM: máy sẽ kiểm điều_kiện còn đúng thì chạy hết khối thụt lề rồi lên kiểm lại đến_điều kiện đó thì dừng và đi tiếp xuống dưới
  - BMM: máy sẽ kiểm điều_kiện còn đúng thì chạy hết khối thụt lề rồi lên kiểm lại đến điều_kiện đó thì dừng và đi tiếp xuống dưới
- Sentence: Máy nói gì?
  - FMM: máy_nói gì
  - BMM: máy nói_gì

### node 10: Repeat: for / range()
- Sentence: RUN để thấy bản ĐÚNG trước:   cho bốn lượt, và biến   lần lượt là 0, 1, 2, 3.
  - FMM: để thấy bản đúng trước bốn lượt và biến lần_lượt là
  - BMM: để thấy bản đúng trước bốn lượt và biến lần lượt_là

### node 12: Đảo Ô Nhớ
- Sentence: dòng   ghi   vào ô nhớ có tên  ; nếu ô đó đã có giá trị cũ, giá trị mới sẽ thay giá trị cũ
  - FMM: dòng vào ô nhớ có tên nếu ô đó đã có_giá trị cũ giá_trị mới sẽ giá_trị cũ
  - BMM: dòng vào ô nhớ có tên nếu ô đó đã có giá_trị cũ giá_trị mới sẽ giá_trị cũ
- Sentence: Input lần lượt là 5 rồi 6:
  - FMM: lần_lượt là rồi
  - BMM: lần lượt_là rồi
- Sentence: Bài này muốn đổi chỗ để in 7 rồi 3, nhưng đang làm mất giá trị cũ của  .
  - FMM: bài này muốn đổi chỗ để rồi nhưng đang làm mất_giá trị cũ của
  - BMM: bài này muốn đổi chỗ để rồi nhưng đang làm mất giá_trị cũ của

### node 15: Grid Memory: Hàng và Cột
- Sentence: Đến lượt của bạn: đề cần đếm số ô có giá trị 1
  - FMM: đến lượt của bạn đề cần đếm số ô có_giá trị
  - BMM: đến lượt của bạn đề cần đếm số ô có giá_trị
- Sentence: Trong  , biến   lần lượt là gì?
  - FMM: biến lần_lượt là gì
  - BMM: biến lần lượt_là gì
- Sentence: Đếm mọi ô có giá trị 1 trong toàn bảng thì kết quả là bao nhiêu?
  - FMM: đếm mọi ô có_giá trị toàn bảng thì kết_quả là nhiêu
  - BMM: đếm mọi ô có giá_trị toàn bảng thì kết_quả là nhiêu

### node 16: Search & Sort: Dò Tìm và Sắp Xếp
- Sentence: Làm đi làm lại vài lượt, số lớn cứ 'nổi' dần về cuối như bọt khí nổi lên mặt nước.
  - FMM: làm_đi_làm_lại vài lượt số lớn cứ nổi dần về cuối như bọt khí nổi lên_mặt nước
  - BMM: làm_đi_làm_lại vài lượt số lớn cứ nổi dần về cuối như bọt khí nổi lên mặt_nước
- Sentence: Muốn đổi chỗ hai ô mà không mất giá trị nào, mình giữ tạm giá trị cũ của   trong  :  , rồi  , rồi  .
  - FMM: muốn đổi chỗ ô mà không mất_giá trị nào mình giữ tạm giá_trị cũ của rồi rồi
  - BMM: muốn đổi chỗ ô mà không mất giá_trị nào mình giữ tạm giá_trị cũ của rồi rồi
- Sentence: Muốn đổi chỗ   và   mà không mất giá trị nào, cần gì?
  - FMM: muốn đổi chỗ và mà không mất_giá trị nào cần gì
  - BMM: muốn đổi chỗ và mà không mất giá_trị nào cần gì

### island island02: ĐẢO LUYỆN SỐ
- Sentence: SAI phép tính — tổng tiền phải là GIÁ NHÂN SỐ LƯỢNG, không phải cộng
  - FMM: phép_tính tổng tiền phải là giá nhân_số lượng không phải cộng
  - BMM: phép_tính tổng tiền phải là giá nhân số_lượng không phải cộng

### island islandIO: ĐẢO INPUT/OUTPUT
- Sentence: Muốn biết dòng nào làm việc gì thì phải đọc từng dòng.
  - FMM: muốn biết dòng nào làm_việc gì thì_phải đọc từng dòng
  - BMM: muốn biết dòng nào làm việc_gì thì_phải đọc từng dòng

### island islandSTRINGLAB: PHÒNG THÍ NGHIỆM CHUỖI
- Sentence: Máy tự cộng các chữ số thành
  - FMM: máy tự cộng các chữ_số thành
  - BMM: máy tự cộng các chữ số_thành

### island islandMARKET: CHỢ BỤI PHÉP
- Sentence: Giá nhân số lượng
  - FMM: giá nhân_số lượng
  - BMM: giá nhân số_lượng
- Sentence: sai phép tính: tổng tiền phải là giá nhân số lượng
  - FMM: phép_tính tổng tiền phải là giá nhân_số lượng
  - BMM: phép_tính tổng tiền phải là giá nhân số_lượng
- Sentence: trả về số nên mình có thể nhân, cộng, trừ, hoặc chia trực tiếp.
  - FMM: trả về số nên mình có_thể nhân cộng trừ hoặc trực_tiếp
  - BMM: trả về số nên mình có thể_nhân cộng trừ hoặc trực_tiếp

### island islandAR: ĐẢO PHÉP CAMERA
- Sentence: Vì   là điều kiện đúng đầu tiên máy gặp, nên darken() được chọn — watch() chỉ đọc số, không tự quyết định output
  - FMM: vì là điều_kiện đúng đầu_tiên máy gặp nên darken được chọn chỉ đọc số_không tự_quyết định
  - BMM: vì là điều_kiện đúng đầu_tiên máy gặp nên darken được chọn chỉ đọc số_không tự quyết_định
- Sentence: Một chuỗi  /  chỉ chạy nhánh có điều kiện khớp.
  - FMM: một chuỗi chỉ chạy nhánh có_điều kiện khớp
  - BMM: một chuỗi chỉ chạy nhánh có điều_kiện khớp

### island islandBRANCH: ĐẢO NHÁNH RẼ
- Sentence: không có điều kiện riêng.
  - FMM: không có_điều kiện riêng
  - BMM: không có điều_kiện riêng

### island islandTYPES: ĐẢO KIỂU DỮ LIỆU
- Sentence: Sửa dòng cuối thành   để đổi hai chữ số thành số nguyên trước khi cộng.
  - FMM: sửa dòng cuối thành để đổi chữ_số thành số_nguyên trước cộng
  - BMM: sửa dòng cuối thành để đổi chữ số_thành số_nguyên trước cộng
- Sentence: Dùng   để soi kiểu,   để đổi chữ số thành số, và   để đổi số thành chữ khi cần ghép câu.
  - FMM: dùng để kiểu để đổi chữ_số thành số và để đổi số_thành chữ cần ghép câu
  - BMM: dùng để kiểu để đổi chữ số_thành số và để đổi số_thành chữ cần ghép câu

### island islandNESTEDFOR: ĐẢO VÒNG LỒNG
- Sentence: giải bài toán hàng-cột, bảng nhân, bản đồ tọa độ, và mã khóa hai số
  - FMM: giải bài_toán hàng cột bảng nhân_bản đồ tọa độ và mã khóa số
  - BMM: giải bài_toán hàng cột bảng nhân bản_đồ tọa độ và mã khóa số
- Sentence: chạy khối thụt lề đúng ba lần, với   lần lượt là 0, 1, 2.
  - FMM: chạy khối thụt lề đúng lần với lần_lượt là
  - BMM: chạy khối thụt lề đúng lần với lần lượt_là

### island islandGRIDBASIC: ĐẢO BẢNG SỐ
- Sentence: Đề cần đếm số ô có giá trị đúng bằng   (là 2).
  - FMM: đề cần đếm số ô có_giá trị đúng bằng là
  - BMM: đề cần đếm số ô có giá_trị đúng bằng là

### island islandGRIDOPS: ĐẢO PHÉP TOÁN BẢNG
- Sentence: Đổi hai CỘT cần vòng lặp quét từng hàng, và tại mỗi hàng phải dùng một biến tạm để không mất giá trị cũ khi ghi đè.
  - FMM: đổi cột cần vòng lặp quét từng hàng và tại mỗi hàng phải dùng một biến tạm để không mất_giá trị cũ đè
  - BMM: đổi cột cần vòng lặp quét từng hàng và tại mỗi hàng phải dùng một biến tạm để không mất giá_trị cũ đè
- Sentence: Ô nằm ở mép ngoài — hàng đầu, hàng cuối, cột đầu, hoặc cột cuối — mang số 1; mọi ô bên trong mang số 0.
  - FMM: ô nằm ở mép ngoài hàng_đầu hàng cuối cột đầu hoặc cột cuối số mọi ô bên số
  - BMM: ô nằm ở mép ngoài hàng đầu_hàng cuối cột đầu hoặc cột cuối số mọi ô bên số
- Sentence: Một ô là viền nếu ở hàng đầu ( ), hàng cuối ( ), cột đầu ( ), hoặc cột cuối ( ).
  - FMM: một ô là viền nếu ở hàng_đầu hàng cuối cột đầu hoặc cột cuối
  - BMM: một ô là viền nếu ở hàng đầu_hàng cuối cột đầu hoặc cột cuối

### island islandGRIDQUEST: ĐẢO TRUY TÌM & BIẾN HÌNH
- Sentence: Nếu quét xong   vẫn  , nghĩa là không có giá trị đó.
  - FMM: nếu quét vẫn nghĩa_là không có_giá trị đó
  - BMM: nếu quét vẫn nghĩa_là không có giá_trị đó
- Sentence: • TRUY TÌM — đổi   sang một số không có trong lưới để thấy nhánh   chạy.
  - FMM: tìm đổi một_số không có lưới để thấy nhánh chạy
  - BMM: tìm đổi một số_không có lưới để thấy nhánh chạy

### island islandPIXELART: ĐẢO TRANH ĐIỂM ẢNH
- Sentence: Trên đảo này, mỗi điểm chỉ mang một trong hai số: 1 là điểm sáng, 0 là điểm tắt.
  - FMM: trên đảo này mỗi điểm_chỉ một_số là điểm sáng là điểm tắt
  - BMM: trên đảo này mỗi điểm_chỉ một số_là điểm sáng là điểm tắt

### island islandEDGE: ĐẢO DỰ ÁN: TÁCH VIỀN ẢNH
- Sentence: Bốn hàng xóm lần lượt là trên  , dưới  , trái  , phải   — máy in ra 0, 1, 0, 1.
  - FMM: bốn hàng xóm lần_lượt là trên_dưới trái phải máy
  - BMM: bốn hàng xóm lần lượt_là trên_dưới trái phải máy
- Sentence: Với chỉ số âm như  , máy không báo lỗi mà lặng lẽ đọc nhầm sang hàng cuối bảng — kết quả sai nhưng không có thông báo lỗi.
  - FMM: với chỉ_số âm như máy không báo lỗi mà lặng_lẽ đọc nhầm hàng cuối bảng kết_quả nhưng không có thông_báo lỗi
  - BMM: với chỉ số_âm như máy không báo lỗi mà lặng_lẽ đọc nhầm hàng cuối bảng kết_quả nhưng không có thông_báo lỗi
- Sentence: Chỉ số thành  , nên máy đọc nhầm sang hàng cuối bảng chứ không phải một hàng xóm thật
  - FMM: chỉ_số thành nên máy đọc nhầm hàng cuối bảng chứ không phải một hàng xóm thật
  - BMM: chỉ số_thành nên máy đọc nhầm hàng cuối bảng chứ không phải một hàng xóm thật

### tower tower: THÁP VÔ ĐỊNH
- Sentence: Dùng   đi qua từng số từ   tới  ; số lẻ là số có  .
  - FMM: dùng đi từng số_từ tới_số lẻ là số có
  - BMM: dùng đi từng số_từ tới số_lẻ là số có
- Sentence: Người gác chỉ mở đường cho SỐ HOÀN HẢO: một số có tổng các ước số, không tính chính nó, đúng bằng chính số đó.
  - FMM: người gác chỉ mở_đường số hoàn_hảo một_số có tổng các ước_số không tính chính nó đúng bằng chính số đó
  - BMM: người gác chỉ mở_đường số hoàn_hảo một_số có tổng các ước số_không tính chính nó đúng bằng chính số đó
- Sentence: (Python đếm chỉ số từ 0!)
  - FMM: python đếm chỉ_số từ
  - BMM: python đếm chỉ số_từ

