// node00v2.js — PEDAGOGY V2 CLONE of node00.js. See lessons/PEDAGOGY-V2-PLAN.md.
// Live map target via lesson00v2.html, also reachable via dev-test.html?src=node00v2.
// `index` matches node00.js (0) — this is an alternate for the SAME map stop,
// not a new node. Restructure: no analogy-first
// violation existed in node00.js (direct-technical throughout, no metaphor language) —
// per the V2 template this file's change is narrower: one earned-milestone badge
// added right after the "say() là gì" quiz cluster (retrieval already verified
// by that quiz), no reordering needed. The ritual uses read() as the distractor
// because print() is valid standard Python and is taught explicitly in node01v2.
export default {
  index: 0,
  title: "Old Computer: Anatomy of a Machine",
  subtitle: "mọi cỗ máy, mọi đoạn code: INPUT → PROCESS → OUTPUT",
  bundle: {
    art: "assets/rookie-bundle.webp",
    name: "ROOKIE BUNDLE",
  },
  machine: {
    art: "assets/old-computer.webp",
    name: "OLD COMPUTER",
    blurb: "bàn phím vào · dòng chữ ra",
  },
  modules: {
    old_computer: "../py/old_computer/__init__.py",
  },
  cells: [
    {
      cameo: {
        art: "assets/bug-wraith.webp",
        caption: "Gừ... Có một bóng đen đang gầm gừ ngay bên trong cỗ máy kìa!",
      },
    },
    {

      npc: "Coi chừng nha! Có một con quái vật BUG WRAITH đang bị VÒNG TRÒN PHÉP THUẬT trói lại. Muốn đánh bại nó, tụi mình phải học đúng thần chú.",

    },

    {

      npc: "Còn cách kích hoạt vòng tròn để khóa nó chắc hơn — lát nữa Pip sẽ dạy mình. Trước tiên, tụi mình cần học những điều cơ bản nhất của MỌI cỗ máy đã!",

    },
    {
      npc: "Suỵt — cứ để Pip lo! Đầu tiên nè, mọi cỗ máy và mọi MẬT NGỮ mình viết cho máy đều có 3 bước cơ bản. Xem Pip lôi chúng ra từ cỗ máy cổ này nhé!",
    },
    {
      widget: "anatomy",
    },
    { npc: "Chương trình nào cũng có ba phần: INPUT đưa dữ liệu vào, PROCESS xử lý dữ liệu, rồi OUTPUT đưa kết quả ra." },
    { npc: "Điện thoại nhận hình từ camera, xử lý rồi hiện lên màn hình. Game nhận nút bấm, áp dụng luật rồi hiện hình ảnh. Robot nhận tín hiệu cảm biến, tính toán rồi chạy động cơ." },
    {
      remember: "INPUT → PROCESS → OUTPUT. Máy nào cũng đi theo đúng vòng này.",
    },
    {
      checkpoint: {
        text: "Mọi cỗ máy đều chạy theo đúng 3 bước: INPUT (nhận vào) → PROCESS (xử lý) → OUTPUT (trả ra) — dù là điện thoại, game hay robot.",
      },
    },
    {
      quiz: {
        title: "Ba phần của mọi chương trình",
        questions: [
          {
            q: "Gõ chữ vào bàn phím → máy xử lý → hiện lên màn hình. Đây là ví dụ của thứ tự nào?",
            a: [
              "OUTPUT → INPUT → PROCESS",
              "PROCESS → OUTPUT → INPUT",
              "INPUT → PROCESS → OUTPUT",
            ],
            correct: 2,
          },
        ],
      },
    },
    {
      npc: "Trả lời ngon lành! Giờ thử làm OUTPUT thật xem sao. Từ đầu tiên của mọi phù thủy: say() — ra lệnh cho máy NÓI (in) ra màn hình. RUN thử xem.",
    },
    {
      code: `from old_computer import say

say("Xin chào, phù thủy!")   # OUTPUT — máy nói ra màn hình
`,
      label: "first_say.py",
      note: `ĐỀ BÀI (bài mẫu)
Chưa có INPUT ở bài này — bạn chỉ cần bấm RUN, máy sẽ in ra đúng câu nằm trong say().
OUTPUT: đúng câu bạn thấy trong dòng say(...)`,
      expectOut: /xin chào, phù thủy!/i,
      solution: 'from old_computer import say\n\nsay("Xin chào, phù thủy!")   # OUTPUT — máy nói ra màn hình\n',
    },
    {
      remember: "`say(...)` = ra lệnh cho máy NÓI (in) ra màn hình — đây là phần OUTPUT.",
    },
    {
      checkpoint: {
        text: "`say(\"...\")` là phần OUTPUT: máy in ra đúng y chang chữ nằm trong dấu ngoặc kép. (Đoạn chữ trong nháy đó có tên riêng — CHUỖI — node sau bạn sẽ học kỹ.)",
      },
    },
    {
      quiz: {
        title: "say() là gì",
        questions: [
          {
            q: "`say(\"Xin chào\")` làm máy...",
            a: [
              "in ra màn hình đúng dòng chữ đó",
              "hỏi lại người dùng một câu",
              "tính một phép cộng",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      gift: {
        glyph: "📢",
        name: "HUY HIỆU NÓI TO",
        blurb: "phần thưởng cho việc hiểu OUTPUT — dùng say() để máy in đúng chữ ra màn hình.",
        badge: true,
        badgeId: "huy_hieu_noi_to",
      },
    },
    {
      npc: "Một câu hỏi nữa, nhưng lần này chữ không đứng yên đâu — giơ số ngón tay ứng với đáp án đúng nhé!",
    },
    {
      quiz: {
        title: "Chọn đáp án",
        questions: [
          {
            q: "Từ nào ra lệnh cho máy NÓI (in ra màn hình)? Giơ ngón tay chọn đáp án đúng!",
            a: [
              "`say()`",
              "`shout()`",
            ],
            correct: 0,
          },
        ],
      },
    },
    {
      npc: "Máy nói được rồi đó! Còn thiếu mỗi vế NGHE nữa là đủ cả ba giai đoạn — niêm phong giao kèo để học nốt nào.",
    },
  ],
  ritual: {
    gesture: "✋",
    prompt: "Đập tay với camera để niêm phong giao kèo nào!",
    chant: "say",
    chantAccept: [
      "say",
      "xay",
      "sei",
      "se",
    ],
    choice: {
      q: "Lệnh nào làm máy NÓI?",
      a: [
        "say",
        "read",
      ],
      correct: 0,
    },
    theme: {
      motion: "orbit",
      palette: {
        core: "#78b2a5",
        dust: "#d9eee5",
        rune: "#f4c85a",
      },
      glyphs: "say",
    },
  },
};
