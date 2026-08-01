"""Kiểm tra bộ chấm leet_judge: lời giải đúng phải QUA, lời giải sai phải TRƯỢT.

Chạy: python py/test_leet_judge.py

Mỗi module bài mang theo bảng `SAMPLES`, mỗi bài bốn ô:

    good        lời giải đúng                       -> phải QUA
    hardcoded   viết sẵn đáp án của ví dụ trong đề  -> phải TRƯỢT
    wrong       sai logic kiểu lỗi biên thường gặp  -> phải TRƯỢT
    slow        đúng nhưng chậm (chỉ bài có `big`)  -> phải TRƯỢT vì quá giờ
    linear      đúng nhưng quét tuyến tính (bài có   -> phải TRƯỢT vì đọc mảng
                `probe`, tức bài đòi nhị phân)          quá nhiều lần

Thiếu một ô là test đỏ. Ràng buộc đó là có chủ ý: điểm yếu của cách chấm cũ là
`print(6)` vẫn qua bài, nên bài mới nào cũng phải chứng minh được rằng bản
hard-code của chính nó bị chặn.
"""

import io
import os
import sys
import contextlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import leet_arrays  # noqa: E402  (import là đăng ký bài vào leet_judge)
import leet_pointers  # noqa: E402
import leet_search  # noqa: E402
import leet_matrix  # noqa: E402
import leet_backtrack  # noqa: E402
import leet_dp  # noqa: E402
import leet_dphard  # noqa: E402
import leet_hash  # noqa: E402
import leet_greedy  # noqa: E402
import leet_stack  # noqa: E402
import leet_tree  # noqa: E402
import leet_design  # noqa: E402
from leet_judge import PASS_PREFIX, check  # noqa: E402

MODULES = [leet_arrays, leet_pointers, leet_search, leet_matrix, leet_backtrack,
           leet_dp, leet_dphard, leet_hash,
           leet_greedy, leet_stack, leet_tree,
           leet_design]
MUST_PASS = ("good",)
MUST_FAIL = ("hardcoded", "wrong", "slow", "linear")
# Ô nào chỉ bắt buộc khi bài có khai báo tương ứng.
GATED = {"slow": "big", "linear": "probe"}

failures = []
counted = 0


def run(pid, fn):
    """Chấm im lặng, trả về (đậu?, log) để test tự kiểm tra verdict."""
    buffer = io.StringIO()
    with contextlib.redirect_stdout(buffer):
        passed = check(pid, fn)
    text = buffer.getvalue()
    assert passed == (PASS_PREFIX in text), "verdict in ra không khớp giá trị trả về"
    return passed, text


def expect(pid, label, fn, should_pass):
    global counted
    counted += 1
    passed, text = run(pid, fn)
    if passed != should_pass:
        want = "QUA" if should_pass else "TRƯỢT"
        failures.append(pid + " · " + label + " · lẽ ra phải " + want + "\n" + text.strip())


def check_samples(module):
    """Mỗi ô mẫu của module phải cho đúng kết quả.

    `list_problems()` trả về mọi bài đã đăng ký chứ không riêng của module này —
    các module dùng chung một sổ đăng ký trong leet_judge — nên ở đây chỉ duyệt
    `SAMPLES` của module, còn chuyện bài nào bị bỏ quên thì kiểm ở dưới.
    """
    from leet_judge import _PROBLEMS
    for pid, samples in module.SAMPLES.items():
        if pid not in _PROBLEMS:
            failures.append(pid + " · có lời giải mẫu nhưng chưa đăng ký bài")
            continue
        for label in MUST_PASS:
            if label not in samples:
                failures.append(pid + " · thiếu lời giải mẫu " + repr(label))
                continue
            expect(pid, label, samples[label], True)
        for label in MUST_FAIL:
            gate = GATED.get(label)
            if gate is not None and getattr(_PROBLEMS[pid], gate) is None:
                continue
            if label not in samples:
                failures.append(pid + " · thiếu lời giải mẫu " + repr(label))
                continue
            expect(pid, label, samples[label], False)


for module in MODULES:
    check_samples(module)

# Không bài nào được đăng ký mà không có lời giải mẫu — nếu không thì thêm bài
# rồi quên kiểm tra bộ chấm sẽ trôi qua lặng lẽ.
covered = set()
for module in MODULES:
    covered.update(module.SAMPLES)
from leet_judge import _PROBLEMS  # noqa: E402
for pid in _PROBLEMS:
    if pid not in covered:
        failures.append(pid + " · chưa có lời giải mẫu trong SAMPLES của module nào")

# Bộ chấm phải từ chối tử tế thay vì báo lỗi Python.
expect("khong-co-bai-nay", "pid lạ", lambda: None, False)
expect("two-sum", "không phải hàm", 42, False)

print(str(len(_PROBLEMS)) + " bài · " + str(counted) + " lượt chấm")
if failures:
    print("TEST FAILED")
    for line in failures:
        print("- " + line)
    sys.exit(1)
print("TEST OK")
