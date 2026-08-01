"""leet_judge — bộ chấm tự động cho các bài thuật toán kiểu LeetCode.

Cách chấm cũ của saga DSA là so khớp stdout với MỘT input cố định, nên một lời
giải hard-code (`print(5)`) vẫn qua bài. Ở đây mỗi bài có ba lớp kiểm tra:

    1. `cases`  — các ca biên do người soạn viết tay (rỗng, một phần tử, trùng…)
    2. random   — input sinh ngẫu nhiên với seed cố định, đối chiếu với `oracle`
                  (lời giải brute-force, chậm nhưng chắc đúng)
    3. `big`    — thang input lớn dần, để đo thời gian: bài nào cấm O(n^2) thì
                  lời giải chậm sẽ vượt `seconds` và trượt

Thang kích thước (thay vì một ca cực lớn) là có chủ ý: một lời giải O(n^3) gặp
ngay ca n = 60000 sẽ chạy hàng giờ và treo cả tiết học. Đi từ nhỏ lên, cách làm
càng chậm càng bị chặn ở bậc càng sớm, nên thời gian chấm luôn có biên trên.

Người soạn bài đăng ký bằng `problem(...)`, học sinh gọi `check(pid, fn)`.

    problem(pid, title=…, gen=…, oracle=…, cases=…, capture=…, normalize=…,
            count=…, big=…, fast_oracle=…, seconds=…)

    gen(rng, size)  -> tuple đối số truyền vào hàm của học sinh
    big(size)       -> tuple đối số cho ca đo giờ, gọi lại theo `sizes`
    probe(fn)       -> None nếu đạt, hoặc lời giải thích vì sao cách làm sai.
                     Dùng khi đo giờ không phân biệt được: tìm kiếm nhị phân
                     trên 12000 phần tử và quét tuyến tính đều xong tức thì,
                     nên bài nhị phân đếm SỐ LẦN ĐỌC mảng thay vì đếm giây.
    oracle(*args)   -> đáp án đúng (brute-force)
    capture(args, ret) -> giá trị đem so sánh; mặc định là `ret`. Bài sửa
                     tại chỗ (in-place) dùng hook này để đọc list đã bị sửa,
                     vì mỗi lần gọi đều nhận một bản deepcopy riêng.
    normalize(value) -> dạng chuẩn hoá khi bài có nhiều đáp án đúng
                     (3Sum, Permutations…): sắp xếp trước khi so.

`check` in ra verdict IN HOA cho lesson `expectOut` bắt, và in ca sai nhỏ nhất
bằng lời để học sinh tự sửa. Trả về True/False.

Liên quan: py/leet_arrays/__init__.py (đăng ký bài), lessons/content/leet*.js
(cell gọi check), lessons/test-leet-judge.mjs (kiểm tra chính bộ chấm này).
"""

import copy
import random
import time

PASS_PREFIX = "ALL TESTS PASSED"
FAIL_PREFIX = "TESTS FAILED"
TIMEOUT_PREFIX = "TOO SLOW"
PROBE_PREFIX = "WRONG APPROACH"

DEFAULT_COUNT = 120
DEFAULT_SECONDS = 2.0  # rộng tay vì Pyodide chạy chậm hơn CPython vài lần
# Bậc thang đo giờ. O(n^2) qua được 1000 nhưng chết ở 4000; O(n^3) chết ngay ở
# bậc đầu, nên không có cách làm nào treo máy quá vài giây mỗi bậc.
DEFAULT_SIZES = (250, 1000, 4000)
SEED = 20260801
MAX_SHOWN = 120  # cắt bớt khi in ca sai, tránh đổ nghìn số ra terminal

_PROBLEMS = {}


class Problem:
    """Một bài kèm đủ dữ liệu để chấm. Xem docstring module cho từng field."""

    def __init__(self, pid, title, gen, oracle, cases, capture, normalize,
                 count, big, fast_oracle, seconds, sizes, probe):
        self.pid = pid
        self.title = title
        self.gen = gen
        self.oracle = oracle
        self.cases = list(cases or [])
        self.capture = capture or (lambda args, ret: ret)
        self.normalize = normalize or (lambda value: value)
        self.count = count
        self.big = big
        self.fast_oracle = fast_oracle
        self.seconds = seconds
        self.sizes = tuple(sizes)
        self.probe = probe


def problem(pid, title="", gen=None, oracle=None, cases=None, capture=None,
            normalize=None, count=DEFAULT_COUNT, big=None, fast_oracle=None,
            seconds=DEFAULT_SECONDS, sizes=DEFAULT_SIZES, probe=None):
    """Đăng ký một bài. Gọi lại cùng `pid` sẽ ghi đè bài cũ."""
    _PROBLEMS[pid] = Problem(pid, title or pid, gen, oracle, cases, capture,
                             normalize, count, big, fast_oracle, seconds, sizes,
                             probe)
    return _PROBLEMS[pid]


def list_problems():
    """Danh sách (pid, title) đã đăng ký, theo thứ tự đăng ký."""
    return [(p.pid, p.title) for p in _PROBLEMS.values()]


def _short(value):
    text = repr(value)
    if len(text) <= MAX_SHOWN:
        return text
    return text[:MAX_SHOWN] + " …"


def _answer(task, fn, args):
    """Gọi `fn` trên một bản sao riêng của args rồi lấy giá trị cần so sánh."""
    fresh = copy.deepcopy(args)
    returned = fn(*fresh)
    return task.normalize(task.capture(fresh, returned))


def _size_ladder(task):
    """Kích thước input tăng dần: ca nhỏ chạy trước nên ca sai in ra cũng nhỏ."""
    return [1 + index * 12 // max(1, task.count) for index in range(task.count)]


def _run_case(task, fn, args):
    """So một ca. Trả về None nếu đúng, hoặc chuỗi mô tả chỗ sai."""
    want = _answer(task, task.oracle, args)
    try:
        got = _answer(task, fn, args)
    except Exception as error:
        return "hàm của bạn báo lỗi " + type(error).__name__ + ": " + str(error)
    if got == want:
        return None
    return "đáp án là " + _short(want) + " nhưng hàm trả về " + _short(got)


def _report_failure(task, args, reason, index):
    print(FAIL_PREFIX + " · " + task.pid)
    print("ca thứ " + str(index) + " với input " + _short(args))
    print(reason)


def _check_size(task, fn, size):
    """Một bậc thang đo giờ. Trả về None nếu đạt, hoặc chuỗi lý do trượt."""
    args = task.big(size)
    started = time.perf_counter()
    try:
        got = _answer(task, fn, args)
    except Exception as error:
        return ("ca " + str(size) + " phần tử làm hàm báo lỗi "
                + type(error).__name__ + ": " + str(error))
    elapsed = time.perf_counter() - started
    if elapsed > task.seconds:
        return ("ca " + str(size) + " phần tử chạy mất " + str(round(elapsed, 2))
                + " giây, quá " + str(task.seconds)
                + " giây cho phép — cách làm này còn chậm với dữ liệu lớn")
    if task.fast_oracle is not None and got != _answer(task, task.fast_oracle, args):
        return "ca " + str(size) + " phần tử cho đáp án sai"
    return None


def _check_speed(task, fn):
    """Leo thang kích thước, dừng ngay ở bậc đầu tiên không đạt."""
    for size in task.sizes:
        reason = _check_size(task, fn, size)
        if reason is not None:
            return reason
    return None


def _all_cases(task):
    """Ca biên viết tay trước, rồi ca ngẫu nhiên với seed cố định."""
    for args in task.cases:
        yield args
    rng = random.Random(SEED)
    for size in _size_ladder(task):
        yield task.gen(rng, size)


def check(pid, fn):
    """Chấm `fn` cho bài `pid`. In verdict, trả về True nếu qua hết."""
    task = _PROBLEMS.get(pid)
    if task is None:
        print(FAIL_PREFIX + " · không có bài tên " + repr(pid))
        return False
    if not callable(fn):
        print(FAIL_PREFIX + " · " + pid + " · cần truyền vào một hàm")
        return False
    total = 0
    for args in _all_cases(task):
        total += 1
        reason = _run_case(task, fn, args)
        if reason is not None:
            _report_failure(task, args, reason, total)
            return False
    if task.big is not None:
        slow = _check_speed(task, fn)
        if slow is not None:
            print(TIMEOUT_PREFIX + " · " + task.pid)
            print(slow)
            return False
        total += len(task.sizes)
    if task.probe is not None:
        reason = task.probe(fn)
        if reason is not None:
            print(PROBE_PREFIX + " · " + task.pid)
            print(reason)
            return False
        total += 1
    print(PASS_PREFIX + " · " + task.pid + " · " + str(total) + " ca")
    return True
