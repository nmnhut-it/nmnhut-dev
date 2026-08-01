"""leet_design — cụm THIẾT KẾ LỚP: nộp một class, không phải một hàm.

    from leet_design import check

    class TwoSum:
        def __init__(self):
            ...
        def add(self, number):
            ...
        def find(self, value):
            ...

    check("two-sum-design", TwoSum)

Ba bài này không chấm được bằng một lời gọi: cái sai của chúng chỉ lộ ra sau
vài thao tác liên tiếp — thêm rồi tìm rồi lại thêm, hay đọc hai lần liên tiếp
từ cùng một nguồn. Nên bộ chấm dùng chế độ `replay` của leet_judge: mỗi ca thử
là một KỊCH BẢN gọi, và nó so danh sách giá trị trả về của cả kịch bản.

KHÁC LEETCODE MỘT ĐIỂM: hai bài đọc ký tự ở đây cho `read(n)` TRẢ VỀ chuỗi đọc
được, thay vì đổ vào một list truyền sẵn rồi trả về số ký tự. Phần đáng học —
giữ lại phần thừa của lần đọc trước — không đổi, mà đề dễ đọc hơn nhiều.

Bài đang có: two-sum-design · read-n-chars · read-n-chars-ii
"""

from leet_judge import check, list_problems, problem

CHUNK = 4
LETTERS = "abcde"


class Reader:
    """Nguồn chỉ đưa ra được mỗi lần nhiều nhất bốn ký tự — chính là `read4`."""

    def __init__(self, text):
        self.text = text
        self.at = 0

    def read4(self, buffer):
        """Đổ nhiều nhất bốn ký tự vào `buffer`, trả về số ký tự đã đổ."""
        chunk = self.text[self.at:self.at + CHUNK]
        self.at += len(chunk)
        for index, letter in enumerate(chunk):
            buffer[index] = letter
        return len(chunk)


# --- 170. Two Sum III - Data structure design ---------------------------------


def _gen_two_sum_script(rng, size):
    script = [("__init__", ())]
    for _ in range(max(2, size * 2)):
        if rng.random() < 0.5:
            script.append(("add", (rng.randint(-6, 6),)))
        else:
            script.append(("find", (rng.randint(-12, 12),)))
    return (script,)


class _OracleTwoSum:
    """Giữ nguyên danh sách số rồi thử mọi cặp — chậm nhưng không thể sai."""

    def __init__(self):
        self.numbers = []

    def add(self, number):
        self.numbers.append(number)

    def find(self, value):
        for i in range(len(self.numbers)):
            for j in range(i + 1, len(self.numbers)):
                if self.numbers[i] + self.numbers[j] == value:
                    return True
        return False


problem(
    "two-sum-design", title="170. Two Sum III - Data structure design",
    gen=_gen_two_sum_script, oracle=_OracleTwoSum, replay=True,
    cases=[([("__init__", ()), ("find", (0,))],),
           ([("__init__", ()), ("add", (1,)), ("find", (2,))],),
           ([("__init__", ()), ("add", (1,)), ("add", (1,)), ("find", (2,))],),
           ([("__init__", ()), ("add", (1,)), ("add", (3,)), ("add", (5,)),
             ("find", (4,)), ("find", (7,))],)],
)


# --- 157 / 158. Read N Characters Given Read4 ---------------------------------


class _OracleReader:
    """Đọc thẳng từ nguồn, giữ lại phần thừa của lần trước."""

    def __init__(self, reader):
        self.reader = reader
        self.spare = ""

    def read(self, n):
        while len(self.spare) < n:
            buffer = [""] * CHUNK
            count = self.reader.read4(buffer)
            if count == 0:
                break
            self.spare += "".join(buffer[:count])
        out = self.spare[:n]
        self.spare = self.spare[n:]
        return out


def _gen_single_read(rng, size):
    text = "".join(rng.choice(LETTERS) for _ in range(rng.randint(0, 4 * size + 2)))
    return ([("__init__", (Reader(text),)), ("read", (rng.randint(0, 12),))],)


def _gen_many_reads(rng, size):
    text = "".join(rng.choice(LETTERS) for _ in range(rng.randint(0, 4 * size + 2)))
    script = [("__init__", (Reader(text),))]
    for _ in range(max(2, size)):
        script.append(("read", (rng.randint(0, 7),)))
    return (script,)


problem(
    "read-n-chars", title="157. Read N Characters Given Read4",
    gen=_gen_single_read, oracle=_OracleReader, replay=True,
    cases=[([("__init__", (Reader(""),)), ("read", (1,))],),
           ([("__init__", (Reader("abc"),)), ("read", (4,))],),
           ([("__init__", (Reader("abcdef"),)), ("read", (5,))],),
           ([("__init__", (Reader("abc"),)), ("read", (0,))],)],
)

problem(
    "read-n-chars-ii", title="158. Read N Characters Given read4 II - Call Multiple Times",
    gen=_gen_many_reads, oracle=_OracleReader, replay=True,
    cases=[([("__init__", (Reader("abc"),)), ("read", (1,)), ("read", (2,)),
             ("read", (1,))],),
           ([("__init__", (Reader("abcdefghijk"),)), ("read", (5,)), ("read", (5,)),
             ("read", (5,))],),
           ([("__init__", (Reader(""),)), ("read", (3,)), ("read", (3,))],),
           ([("__init__", (Reader("ab"),)), ("read", (0,)), ("read", (9,))],)],
)


# --- lời giải mẫu để tự kiểm tra bộ chấm -------------------------------------


class _GoodTwoSum:
    def __init__(self):
        self.counts = {}

    def add(self, number):
        self.counts[number] = self.counts.get(number, 0) + 1

    def find(self, value):
        for number, times in self.counts.items():
            other = value - number
            if other == number:
                if times >= 2:
                    return True
            elif other in self.counts:
                return True
        return False


class _HardcodedTwoSum:
    def __init__(self):
        pass

    def add(self, number):
        pass

    def find(self, value):
        return True


class _WrongTwoSum:
    """Cho phép dùng LẠI cùng một số, nên `find(2)` đúng dù chỉ thêm một số 1."""

    def __init__(self):
        self.seen = set()

    def add(self, number):
        self.seen.add(number)

    def find(self, value):
        return any(value - number in self.seen for number in self.seen)


class _HardcodedReader:
    def __init__(self, reader):
        pass

    def read(self, n):
        return "abc"


class _WrongReader:
    """Vứt phần thừa của lần đọc trước, nên lần đọc sau nhảy mất ký tự."""

    def __init__(self, reader):
        self.reader = reader

    def read(self, n):
        out = ""
        while len(out) < n:
            buffer = [""] * CHUNK
            count = self.reader.read4(buffer)
            if count == 0:
                break
            out += "".join(buffer[:count])
        return out[:n]


SAMPLES = {
    "two-sum-design": {
        "good": _GoodTwoSum,
        "hardcoded": _HardcodedTwoSum,
        "wrong": _WrongTwoSum,
    },
    "read-n-chars": {
        "good": _OracleReader,
        "hardcoded": _HardcodedReader,
        "wrong": _HardcodedReader,
    },
    "read-n-chars-ii": {
        "good": _OracleReader,
        "hardcoded": _HardcodedReader,
        "wrong": _WrongReader,
    },
}
