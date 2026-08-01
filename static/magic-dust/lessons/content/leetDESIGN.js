// Đảo luyện tập LeetCode — thiết kế lớp. Học sinh nộp một CLASS, không phải
// một hàm, và máy chấm chạy cả một kịch bản gọi (chế độ `replay` của
// py/leet_judge). Xem py/leet_design.

const CHECK_LINE = pid => new RegExp("ALL TESTS PASSED · " + pid);

const task = (pid, label, note, code, solution) => ({
  label, note, code, solution, expectOut: CHECK_LINE(pid),
});

const cells = [
  { intro: {
    title: "✦ XƯỞNG ĐỒ NGHỀ ✦",
    hook: "Ba bài cuối cùng không hỏi một câu trả lời, chúng hỏi một MÓN ĐỒ NGHỀ. Bạn nộp một class, và máy chấm đem nó ra dùng thật: thêm, tìm, thêm nữa, tìm lại. Cái sai của những bài này không lộ ra ở lần gọi đầu — nó lộ ra ở lần gọi thứ ba.",
    art: "assets/old-computer.webp",
  } },

  { npc: "Máy chấm dựng đối tượng của bạn một lần rồi gọi liên tiếp nhiều phương thức, và so cả DÃY giá trị trả về. Nên thứ đối tượng còn nhớ giữa hai lần gọi mới là thứ đang được chấm." },

  task("two-sum-design", "two_sum_design.py",
    "ĐỀ BÀI\nViết class `TwoSum` với ba phần:\n`__init__(self)` — khởi tạo, chưa có số nào.\n`add(self, number)` — thêm một số vào kho. Không trả về gì. Cùng một giá trị có thể được thêm nhiều lần, và mỗi lần thêm là một số RIÊNG.\n`find(self, value)` — trả về `True` nếu trong kho có HAI số ở hai lần thêm khác nhau, cộng lại đúng bằng `value`; ngược lại trả về `False`.\nOUTPUT: máy chấm gọi `add` và `find` xen kẽ rồi so dãy kết quả của các lần `find`.\nVí dụ: thêm `1`, `3`, `5` thì `find(4)` cho `True` (là `1 + 3`) còn `find(7)` cho `False`.\nBẪY QUAN TRỌNG: chỉ thêm MỘT số `1` thì `find(2)` phải cho `False`, vì không được dùng lại cùng một lần thêm. Nhưng thêm số `1` HAI lần thì `find(2)` cho `True`.",
    `from leet_design import check


class TwoSum:
    def __init__(self):
        # lượt của bạn
        pass

    def add(self, number):
        pass

    def find(self, value):
        return False


check("two-sum-design", TwoSum)
`,
    `from leet_design import check


class TwoSum:
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


check("two-sum-design", TwoSum)
`),

  { checkpoint: { text: "Một bảng đếm `dict` chứ không phải một `set` là thứ phân biệt hai trường hợp dễ lẫn. Khi số cần tìm bằng đúng số đang xét — tức `value` gấp đôi nó — thì phải hỏi số đó đã được thêm ÍT NHẤT HAI lần chưa. Còn khi hai số khác nhau thì chỉ cần cả hai đều có mặt." } },

  { quiz: { title: "Một số hay hai lần thêm", questions: [
    { q: "Chỉ gọi `add(1)` đúng một lần rồi gọi `find(2)`. Kết quả phải là gì?",
      a: ["`False`, vì chỉ có một số `1` mà bài đòi hai lần thêm khác nhau", "`True`, vì `1 + 1` bằng `2`", "`True`, vì `2` chia hết cho `1`", "`False`, vì `2` chưa được thêm"], correct: 0 },
    { q: "Gọi `add(1)` HAI lần rồi gọi `find(2)`. Kết quả phải là gì?",
      a: ["`True`, vì có hai lần thêm khác nhau cùng mang giá trị `1`", "`False`, vì hai số giống nhau", "`False`, vì kho chỉ nhớ mỗi giá trị một lần", "`True` chỉ khi thêm thêm số `2`"], correct: 0 },
    { q: "Vì sao dùng `set` để nhớ các số đã thêm là chưa đủ cho bài này?",
      a: ["Vì `set` không nhớ một giá trị đã được thêm mấy lần, nên không phân biệt được hai trường hợp trên", "Vì `set` không chứa được số âm", "Vì `set` chậm hơn `dict`", "Vì `set` không có phép `in`"], correct: 0 },
  ] } },

  { npc: "Hai bài còn lại dùng chung một món đồ: `reader`, nguồn chữ chỉ đưa ra được mỗi lần nhiều nhất BỐN ký tự. Gọi `reader.read4(buffer)` với `buffer` là list bốn ô." },

  task("read-n-chars", "read_n_chars.py",
    "ĐỀ BÀI\nViết class `Solution` với hai phần:\n`__init__(self, reader)` — nhận nguồn chữ và nhớ lại.\n`read(self, n)` — đọc nhiều nhất `n` ký tự từ nguồn và TRẢ VỀ chuỗi đọc được. Nguồn có thể còn ít hơn `n` ký tự, khi đó trả về đúng phần còn lại.\nCÔNG CỤ DUY NHẤT để lấy chữ là `self.reader.read4(buffer)`: truyền vào một list bốn ô, nó đổ chữ vào và trả về số ký tự đã đổ. Trả về `0` nghĩa là nguồn đã hết.\nOUTPUT: máy chấm gọi `read` MỘT lần rồi so chuỗi trả về.\nVí dụ: nguồn `\"abcdef\"` với `read(5)` cho `\"abcde\"`. Nguồn `\"abc\"` với `read(4)` cho `\"abc\"`. `read(0)` cho chuỗi rỗng.",
    `from leet_design import check


class Solution:
    def __init__(self, reader):
        self.reader = reader

    def read(self, n):
        # lượt của bạn
        return ""


check("read-n-chars", Solution)
`,
    `from leet_design import check


class Solution:
    def __init__(self, reader):
        self.reader = reader

    def read(self, n):
        out = ""
        while len(out) < n:
            buffer = [""] * 4
            count = self.reader.read4(buffer)
            if count == 0:
                break
            out += "".join(buffer[:count])
        return out[:n]


check("read-n-chars", Solution)
`),

  task("read-n-chars-ii", "read_n_chars_ii.py",
    "ĐỀ BÀI\nViết class `Solution` với `__init__(self, reader)` và `read(self, n)` như bài trước, nhưng lần này máy chấm gọi `read` NHIỀU LẦN liên tiếp trên cùng một đối tượng. Mỗi lần gọi phải nối tiếp đúng chỗ lần trước dừng lại.\nOUTPUT: máy chấm so cả DÃY chuỗi của các lần gọi.\nVí dụ: nguồn `\"abc\"` rồi `read(1)`, `read(2)`, `read(1)` cho lần lượt `\"a\"`, `\"bc\"`, `\"\"`.\nBẪY: `read4` luôn lấy ra tới bốn ký tự, nên khi `n` nhỏ hơn số ký tự vừa lấy được thì phần THỪA không được vứt đi — lần gọi sau còn cần nó. Lời giải bài trước chạy đúng ở đây khi chỉ gọi một lần, nhưng sai ngay từ lần gọi thứ hai.",
    `from leet_design import check


class Solution:
    def __init__(self, reader):
        self.reader = reader

    def read(self, n):
        # lượt của bạn
        return ""


check("read-n-chars-ii", Solution)
`,
    `from leet_design import check


class Solution:
    def __init__(self, reader):
        self.reader = reader
        self.spare = ""

    def read(self, n):
        while len(self.spare) < n:
            buffer = [""] * 4
            count = self.reader.read4(buffer)
            if count == 0:
                break
            self.spare += "".join(buffer[:count])
        out = self.spare[:n]
        self.spare = self.spare[n:]
        return out


check("read-n-chars-ii", Solution)
`),

  { checkpoint: { text: "Chỗ khác nhau giữa hai bài đọc chữ chỉ nằm ở MỘT biến: `self.spare`, phần thừa của lần đọc trước. Nó phải nằm trên đối tượng chứ không phải trong hàm, vì nó cần sống qua lời gọi. Một biến khai báo bên trong `read` biến mất ngay khi hàm kết thúc." } },

  { quiz: { title: "Phần thừa sống ở đâu", questions: [
    { q: "Nguồn là `\"abcdef\"`. Gọi `read(2)` rồi `read(2)`. Nếu KHÔNG giữ phần thừa thì hai lần gọi trả về gì?",
      a: ["`\"ab\"` rồi `\"ef\"` — mất hai ký tự `\"cd\"` vì lần đầu đã lấy ra bốn ký tự nhưng chỉ dùng hai", "`\"ab\"` rồi `\"cd\"` — vẫn đúng", "`\"ab\"` rồi `\"ab\"`", "`\"abcd\"` rồi `\"ef\"`"], correct: 0 },
    { q: "Biến giữ phần thừa nên khai báo ở đâu?",
      a: ["Trong `__init__`, gán vào `self`, để nó sống qua các lần gọi `read`", "Bên trong `read`, ngay đầu hàm", "Bên trong vòng `while`", "Không cần biến nào cả"], correct: 0 },
    { q: "Vì sao lời giải bài 157 vẫn được chấm ĐÚNG dù nó vứt phần thừa?",
      a: ["Vì bài đó chỉ gọi `read` một lần, mà phần thừa chỉ gây hại từ lần gọi thứ hai", "Vì bài đó không dùng `read4`", "Vì bài đó luôn có `n` chia hết cho `4`", "Vì bài đó cho phép mất ký tự"], correct: 0 },
  ] } },

  { remember: "Bài thiết kế lớp khác bài viết hàm ở đúng một câu hỏi: giữa hai lần gọi, đối tượng cần NHỚ những gì? Trả lời được câu đó là biết phải đặt biến nào lên `self`. Và hai bài đọc chữ cho thấy vì sao chấm một lần gọi là không đủ — cùng một đoạn code, gọi một lần thì đúng, gọi hai lần thì mất chữ." },
];

export default {
  index: -1,
  pageLabel: "LEETCODE · THIẾT KẾ LỚP",
  sideIslandId: "leet-design",
  completionKey: "magicdust.leet.set.design",
  justSolvedKey: "magicdust.leet.justSolved",
  returnPage: "./leet.html",
  kind: "dsa-island",
  cameraFree: true,
  title: "Xưởng Đồ Nghề",
  subtitle: "ba bài nộp một class, chấm bằng cả một kịch bản gọi",
  bundle: { art: "assets/rookie-bundle.webp", name: "TÚI DỤNG CỤ ĐỒ NGHỀ" },
  machine: { art: "assets/old-computer.webp", name: "MÁY CHẤM TỰ ĐỘNG", blurb: "dựng đối tượng một lần rồi gọi liên tiếp, so cả dãy kết quả" },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
    leet_judge: "../py/leet_judge/__init__.py",
    leet_design: "../py/leet_design/__init__.py",
  },
  cells,
  finish: { title: "XƯỞNG ĐÃ MỞ", sub: "ba món đồ nghề, mỗi món đứng vững qua cả một kịch bản dùng thật", button: "VỀ BẢN ĐỒ", page: "./leet.html" },
};
