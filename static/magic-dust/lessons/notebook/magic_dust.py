"""magic_dust — offline stand-ins for the Gương Vô Cực charms.

In the browser lesson these calls go through a bridge to the camera, the
microphone and a WebGL stage. A notebook has none of that, so this module
re-implements the parts that are PURE DATA — an image is a grid of numbers, and
every effect is light added to what is underneath — and is honest about the
parts that are not.

Runs here, exactly as in the lesson:
    say / say_num            print
    load_plate(name, size)   read a plate into image[row][col] = [r, g, b]
    blank_grid(rows, cols)   a 2D list to write into
    compare_frames(...)      side-by-side viewer, with the brightness digits
    show_photos / show_numbers

Needs a camera or a microphone, so it explains itself instead of pretending:
    play_effect, play_my_effect, find_human, listen, watch

The point of the split: the maths a learner writes — flip, add-and-clamp,
paint a region — is the same code in both places. Only the input and the stage
differ. Requires pillow; display is via IPython when present, else it saves a
PNG next to the notebook.
"""

import os

from PIL import Image

PLATES = {
    "dragon": "assets/fx-dragon.webp",
    "stag": "assets/fx-stag.webp",
    "boss": "assets/fx-boss.webp",
    "scene": "assets/bg-lighthouse.webp",
    "goal": "assets/goal-dragon-over-boss.webp",
    "frame0": "assets/frame-dragon-0.webp",
    "frame1": "assets/frame-dragon-1.webp",
    "frame2": "assets/frame-dragon-2.webp",
    "frame3": "assets/frame-dragon-3.webp",
}
_HERE = os.path.dirname(os.path.abspath(__file__))
CELL_PX = 26          # a grid cell on screen
NUMBER_LIMIT = 16     # past this, digits are too small to read
MAX_SIDE = 24


def say(value):
    print(value)


def say_num(value):
    print(value)


def blank_grid(rows, cols, value=0):
    return [[value for _ in range(int(cols))] for _ in range(int(rows))]


def _open(name):
    path = os.path.join(_HERE, PLATES.get(str(name), PLATES["dragon"]))
    if not os.path.exists(path):
        raise FileNotFoundError(
            "Missing plate %r. Keep the assets/ folder next to this notebook." % path
        )
    return Image.open(path).convert("RGB")


def load_plate(name="dragon", size=16):
    """Read a named plate into a 2D RGB list — the same numbers the lesson uses."""
    side = max(8, min(MAX_SIDE, int(size)))
    small = _open(name).resize((side, side), Image.NEAREST)
    pixels = small.load()
    return [[list(pixels[col, row]) for col in range(side)] for row in range(side)]


def _light(pixel):
    return (pixel[0] + pixel[1] + pixel[2]) // 3


def _grid_image(grid, cell=CELL_PX, numbers=False):
    """Render a grid as an upscaled picture, optionally with its digits on top."""
    rows, cols = len(grid), len(grid[0])
    img = Image.new("RGB", (cols, rows))
    img.putdata([tuple(grid[r][c][:3]) for r in range(rows) for c in range(cols)])
    img = img.resize((cols * cell, rows * cell), Image.NEAREST)
    if numbers and cols <= NUMBER_LIMIT:
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        for r in range(rows):
            for c in range(cols):
                value = _light(grid[r][c])
                ink = (11, 15, 24) if value >= 128 else (234, 244, 255)
                draw.text((c * cell + 4, r * cell + cell // 3), str(value), fill=ink)
    return img


def _row(images, labels, title):
    """Stack labelled panels left to right into one strip and show it."""
    pad, top = 14, 22
    width = sum(i.width for i in images) + pad * (len(images) + 1)
    height = max(i.height for i in images) + top + pad
    strip = Image.new("RGB", (width, height), (14, 22, 28))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(strip)
    if title:
        draw.text((pad, 5), str(title), fill=(159, 227, 210))
    x = pad
    for img, label in zip(images, labels):
        strip.paste(img, (x, top))
        draw.text((x, top - 12), str(label), fill=(124, 196, 182))
        x += img.width + pad
    _show(strip)
    return True


def _show(image):
    try:
        from IPython.display import display
        display(image)
    except Exception:
        out = os.path.join(_HERE, "_preview.png")
        image.save(out)
        print("saved", out)


def compare_frames(labelled, title="", numbers=True):
    """Put frames side by side. Entries are (label, grid) or (label, plate_name),
    and a third item names the plate a grid came from so the artwork sits beside
    its cells — a coarse grid on its own looks nothing like the picture."""
    images, labels = [], []
    for entry in labelled:
        label, image = entry[0], entry[1]
        plate = entry[2] if len(entry) > 2 else (image if isinstance(image, str) else None)
        if plate is not None:
            images.append(_open(plate).resize((260, 260), Image.LANCZOS))
            labels.append("%s · anh goc" % label)
        if not isinstance(image, str):
            images.append(_grid_image(image, numbers=numbers))
            labels.append("%s · luoi %dx%d" % (label, len(image), len(image[0])))
    return _row(images, labels, title)


def show_photos(labelled, title=""):
    return compare_frames(labelled, title)


def show_numbers(image, title=""):
    return compare_frames([(title or "ANH", image)], title, True)


def _browser_only(name, why):
    print("[%s] %s" % (name, why))
    print("      Mo bai hoc trong trinh duyet de chay phan nay:")
    print("      lessons/islandFXFORGE.html")
    return False


def play_effect(name="dragon"):
    return _browser_only("play_effect", "can mot khung hinh camera that de chieu len.")


def play_my_effect():
    return _browser_only("play_my_effect", "can trinh duyet de chon va chieu tep video.")


def find_human(scene=None, behind=None, front=None):
    return _browser_only("find_human", "can camera va bua tim nguoi (MediaPipe).")


def listen(words, seconds=8):
    print("[listen] can micro. Trong notebook, go tay mot tu de thu:")
    try:
        heard = input("Goi ten than chu %s: " % list(words))
    except EOFError:
        return ""
    return heard if heard in list(words) else ""


def watch(prompt="show fingers: "):
    print("[watch] can camera. Trong notebook, go so ngon tay de thu:")
    try:
        return int(input(prompt) or 0)
    except (EOFError, ValueError):
        return 0
