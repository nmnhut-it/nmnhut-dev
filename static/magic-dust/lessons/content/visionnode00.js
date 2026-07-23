import { visionLesson } from "./vision-builders.js?v=20260714-101425";
import { VISION_PINHOLE_LAB_ART } from "./vision-curriculum.js?v=20260714-101425";

const projectStarter = `from old_computer import say, say_num

object_height = 18
screen_height = 4
screen_distance = 12

near_distance = 36
middle_distance = 72
far_distance = 108

near_size = object_height * screen_distance / near_distance
middle_size = 0
far_size = 0

say_num(near_size)
say_num(middle_size)
say_num(far_size)

if near_size <= screen_height:
    say("CHON GAN")
elif False:
    say("CHON GIUA")
elif False:
    say("CHON XA")
else:
    say("KHONG CO VI TRI")
`;

const projectSolution = `from old_computer import say, say_num

object_height = 18
screen_height = 4
screen_distance = 12

near_distance = 36
middle_distance = 72
far_distance = 108

near_size = object_height * screen_distance / near_distance
middle_size = object_height * screen_distance / middle_distance
far_size = object_height * screen_distance / far_distance

say_num(near_size)
say_num(middle_size)
say_num(far_size)

if near_size <= screen_height:
    say("CHON GAN")
elif middle_size <= screen_height:
    say("CHON GIUA")
elif far_size <= screen_height:
    say("CHON XA")
else:
    say("KHONG CO VI TRI")
`;

const cells = [
  {
    intro: {
      title: "VISION LAB 00 · CAMERA LỖ KIM",
      hook: "Nhiệm vụ nghiên cứu: dựng mô hình hình học, suy ra tỉ lệ và viết một chương trình chọn vị trí đặt vật cho camera.",
      art: VISION_PINHOLE_LAB_ART,
    },
  },
  {
    npc: "Trong phòng lab này, tụi mình dùng một mô hình lý tưởng: lỗ kim không có kích thước, ánh sáng truyền thẳng và màn hứng phẳng. Mô hình chưa tính nhiễu xạ hoặc méo do thấu kính.",
  },
  { widget: "pinhole" },
  {
    npc: "Giờ bạn là người thiết kế. Hãy chọn một trong ba vị trí sao cho ảnh không vượt quá màn cao 4 cm nhưng vẫn lớn nhất có thể. Python sẽ lập bảng tính và đưa ra quyết định.",
  },
  {
    code: projectStarter,
    label: "vision_pinhole_design_project.py",
    note: "PROJECT 00 · CHỌN VỊ TRÍ ĐẶT VẬT\nCamera quan sát một vật cao 18 cm; màn cao 4 cm và cách lỗ 12 cm. Ba vị trí thử cách lỗ 36, 72 và 108 cm. Chương trình không hỏi người dùng nhập dữ liệu. Hãy hoàn thành `middle_size`, `far_size` và thay hai điều kiện `False` để chương trình chọn vị trí gần nhất mà ảnh vẫn vừa màn. Khi đúng, máy in bốn dòng: `6.0`, `3.0`, `2.0` và `CHON GIUA`.",
    expectOut: {
      all: [
        { minLines: 4 },
        /^6(?:\.0)?$/,
        /^3(?:\.0)?$/,
        /^2(?:\.0)?$/,
        /^CHON GIUA$/,
      ],
    },
    solution: projectSolution,
  },
  {
    checkpoint: {
      text: "Gọi `H` là chiều cao vật, `D` là khoảng cách từ vật tới lỗ, `d` là khoảng cách từ lỗ tới màn và `h` là chiều cao ảnh. Hai tam giác đồng dạng cho `h / H = d / D`, nên `h = H * d / D`. Nếu xét hướng trên trục ảnh, dấu âm trong `y_image = -y_object * d / D` biểu thị ảnh bị đảo chiều.",
    },
  },
  {
    quiz: {
      title: "Bảo vệ phương án thiết kế",
      questions: [
        {
          q: "Một nhóm giữ `object_height = 18` và `object_distance = 72`, nhưng tăng `screen_distance` từ 12 cm lên 24 cm. Theo `image_size = object_height * screen_distance / object_distance`, ảnh mới cao bao nhiêu?",
          a: ["6 cm", "3 cm", "1.5 cm"],
          correct: 0,
        },
        {
          q: "Một camera khác có màn cao tối đa 4 cm. Ba vị trí tạo ảnh cao lần lượt 5 cm, 3.5 cm và 2 cm. Nếu cần ảnh vừa màn và lớn nhất có thể, nên chọn vị trí nào?",
          a: ["Vị trí tạo ảnh 3.5 cm", "Vị trí tạo ảnh 5 cm", "Vị trí tạo ảnh 2 cm"],
          correct: 0,
        },
      ],
    },
  },
  {
    remember: [
      "Camera lỗ kim là mô hình chiếu phối cảnh đơn giản nhất: mỗi tia đi qua một tâm chiếu.",
      "Tam giác đồng dạng cho `h = H * d / D`; tăng `D` làm ảnh nhỏ đi, còn tăng `d` làm ảnh lớn lên.",
      "Một phương án kỹ thuật phải thỏa mãn ràng buộc trước, rồi mới tối ưu mục tiêu.",
    ],
  },
];

export default visionLesson(0, {
  subtitle: "mô hình hóa phép chiếu phối cảnh và hoàn thành project thiết kế camera lỗ kim",
  machineName: "MÔ HÌNH CAMERA LỖ KIM",
  machineBlurb: "một tâm chiếu, một màn hứng và các tia sáng truyền thẳng",
  cells,
});
