export default {
  index: 0,
  title: "Old Computer: Anatomy of a Machine",
  subtitle: "mọi cỗ máy, mọi đoạn code: INPUT → PROCESS → OUTPUT",
  bundle: { art: "assets/rookie-bundle.webp", name: "ROOKIE BUNDLE" },
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
    { widget: "anatomy" },
    {

      npc: "INPUT → PROCESS → OUTPUT — nhớ kỹ ba phần này nha, vì chương trình nào, cỗ máy nào cũng đi qua đúng ba phần đó thôi. Điện thoại? Camera nhận vào, bộ não xử lý, màn hình hiện ra.",

    },

    {

      npc: "Game? Nút bấm đi vào, luật xử lý, hình ảnh hiện ra. Robot? Cảm biến đưa tín hiệu vào, bộ não tính toán, động cơ chạy. Vẫn là 3 phần. Nhớ kỹ đó — lát nữa Pip hỏi thật đấy.",

    },
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
      code: 'from old_computer import say\n\nsay("Xin chào, phù thủy!")   # OUTPUT — máy nói ra màn hình\n',
      label: "first_say.py",
      note: "ĐỀ BÀI\n(chưa có INPUT ở bài này — thử say() một mình trước)\nOUTPUT: máy in ra đúng câu bạn thấy trong code",
      expectOut: /xin chào, phù thủy!/i,
      solution: 'from old_computer import say\n\nsay("Xin chào, phù thủy!")   # OUTPUT — máy nói ra màn hình\n',
    },
    {
      remember:
        "`say(...)` = ra lệnh cho máy NÓI (in) ra màn hình — đây là phần OUTPUT.",
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
            q: '`say("Xin chào")` làm máy...',
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
      npc: "Một câu hỏi nữa, nhưng lần này chữ không đứng yên đâu — giơ số ngón tay ứng với đáp án đúng nhé!",
    },
    {
      quiz: {
        title: "Chọn đáp án",
        questions: [
          {
            q: "Từ nào ra lệnh cho máy NÓI (in ra màn hình)? Giơ ngón tay chọn đáp án đúng!",
            a: ["`say()`", "`shout()`"],
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
    // concept-chant pilot (RITUAL-VARIANTS-PLAN.md Part B): node00 taught
    // say() — chant its name to surge the seal. "say" is a SHORT target (3
    // letters, at chant-match.js's SHORT_TARGET_LEN), so matching leans on
    // this hand-tuned accept list, not the loose edit-distance/phonetic
    // tiers. Included (real vi-VN/en-US hearings): "sây"/"xây" (folds to
    // "say"/"xay" — a Vietnamese kid reading the English word), "sei" (an
    // en-US ear hearing the Vietnamese vowel), "sê"/"se" (a clipped,
    // Vietnamese-accented reading). Deliberately EXCLUDED even though they
    // sound close: "sao" (= "why/how", one of the commonest Vietnamese
    // words — would false-positive on ordinary chatter), "sa"/"xa" (=
    // "fall"/"far", also common standalone words).
    chant: "say",
    chantAccept: ["say", "xay", "sei", "se"],
    // ritual word-choice pilot (KICKOFF-PLAN.md Part B): a pre-seal
    // knowledge check — hold up N fingers (or tap) to pick option N.
    // "print" is a real programming word the kids will meet later (not a
    // made-up distractor) — this is a recognition check against node00's
    // taught word "say", so it's exempt from the made-up-distractor rule
    // used in track quizzes (see validate-content.mjs's validateRitualChoice).
    choice: { q: "Lệnh nào làm máy NÓI?", a: ["say", "print"], correct: 0 },
    theme: { motion: "orbit", palette: { core: "#78b2a5", dust: "#d9eee5", rune: "#f4c85a" }, glyphs: "say" },
  },
};
