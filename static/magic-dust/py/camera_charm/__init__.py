"""camera_charm — the magic camera you win in Node 1.

The charm SEES your hand and does what your rules say:

    watch()       -> waits for a steady hand-sign, returns the finger count
    aim_cell(r,c) -> waits for one pointing finger over an AR grid, returns
                     the 1-based cell number: top-left=1, center of 3x3=5
    cell_row(cell, cols) / cell_col(cell, cols)
                  -> convert that cell number back to row/column numbers
    fire_vortex() -> the dust gathers, whirls into a vortex and casts FIRE
    freeze()      -> the dust crystallizes into FROST instead of fire
    lighten()     -> the machine's screen glows bright
    darken()      -> the machine's screen falls dark
    display(v)    -> writes v as floating AR text over the camera view
                     (unlike say(), which only prints to the console)
    pixel_display(grid) -> draws a grid of 0s and 1s as a small block-picture
                     floating over the camera view (1 = filled, 0 = empty)
    present_image_frame(image) -> displays a small 2D RGB/RGBA framebuffer
                     exactly as supplied; learner code creates every pixel
    upload_photo() -> opens a local image picker and places the chosen photo
                     inside the project frame; the image stays in the browser
    choose_image() -> opens a local image picker and returns a small 2D RGB list;
                      cancelling uses the built-in magic-owl sample
    load_sample_image() -> returns that generated sample as a small 2D RGB list
    blank_grid(rows, cols) -> makes a 2D list filled with one preset value
    start_photo_lights() -> waits for the learner to press the centered start button
    show_photo_lights(colors, mode, step) -> draws a repeated color list
    delay(seconds) -> keeps the current light frame visible before continuing
                     around the photo, either lit, off, or shifted by step
    start_particle_stage() -> opens a camera-free preview for particle lessons
    Particle(...) -> creates one visible particle with position, motion, size,
                     opacity, and lifetime
    draw_particle_frame(particles) -> draws the Particle objects supplied
    set_photo_light(index, color) -> sets one position in the repeated light
                     pattern so a learner loop can build the sequence visibly
    sepia()       -> the screen turns old-photo yellow-brown
    invert()      -> every color on screen flips to its opposite
    grayscale()   -> the screen loses all color, black-and-white only
    flip_mirror() -> un-mirrors the screen back to your TRUE left/right
    shake_screen()-> the screen shakes once, like a small earthquake
    photo_booth() -> a magic photo booth: pour dust with an open palm,
                     whirl it with one finger, SNAP with two. It keeps
                     watching until the snap — the loop that makes that
                     work lives in here; you'll write it yourself in a
                     later node.

Two fingers stay out of the rule set on purpose — the ✌ sign belongs to the
booth's SNAP, and one sign must never mean two things.

Runs inside the lesson worker; `bridge` is the page's I/O channel (worker.js).
"""
import json
import math

from js import bridge


def _studio_tell(action, **values):
    values["action"] = action
    bridge.tell("studio", json.dumps(values, ensure_ascii=False))


def watch(prompt="show fingers: "):
    return int(bridge.ask("fingers", prompt))


def aim_cell(rows=3, cols=3):
    rows = int(rows)
    cols = int(cols)
    return int(bridge.ask("grid", str(rows) + "," + str(cols)))


def cell_row(cell, cols=3):
    return (int(cell) - 1) // int(cols) + 1


def cell_col(cell, cols=3):
    return (int(cell) - 1) % int(cols) + 1


def fire_vortex():
    bridge.tell("spell", "fire")


def freeze():
    bridge.tell("spell", "freeze")


def lighten():
    bridge.tell("screen", "lighten")


def darken():
    bridge.tell("screen", "darken")


def display(value):
    bridge.tell("label", str(value))


def pixel_display(grid):
    lines = []
    for row in grid:
        line = ""
        for cell in row:
            line = line + ("#" if cell == 1 else ".")
        lines.append(line)
    bridge.tell("pixels", "\n".join(lines))


def sepia():
    bridge.tell("screen", "sepia")


def invert():
    bridge.tell("screen", "invert")


def grayscale():
    bridge.tell("screen", "grayscale")


def flip_mirror():
    bridge.tell("screen", "mirror")


def shake_screen():
    bridge.tell("screen", "shake")


def start_studio(title="My Live Studio"):
    payload = json.dumps({"action": "studio_start", "title": str(title)}, ensure_ascii=False)
    return bridge.ask("studio_start", payload) == "ready"


def upload_photo():
    payload = json.dumps({"action": "photo_upload"}, ensure_ascii=False)
    return bridge.ask("studio_start", payload) == "uploaded"


def _read_image_grid(action, size=16):
    side = max(8, min(24, int(size)))
    payload = json.dumps({"action": action, "size": side}, ensure_ascii=False)
    try:
        image = json.loads(bridge.ask("studio_start", payload))
    except (TypeError, ValueError):
        return []
    if not isinstance(image, list):
        return []
    return image


def choose_image(size=16):
    return _read_image_grid("image_pick_grid", size)


def load_sample_image(size=16):
    return _read_image_grid("image_sample_grid", size)


def blank_grid(rows, cols, value=0):
    row_count = max(0, min(48, int(rows)))
    col_count = max(0, min(64, int(cols)))
    return [[value for col in range(col_count)] for row in range(row_count)]


def start_photo_lights():
    payload = json.dumps({"action": "photo_start"}, ensure_ascii=False)
    return bridge.ask("studio_start", payload) == "started"


def delay(seconds=0.5):
    payload = json.dumps({"action": "delay", "seconds": float(seconds)}, ensure_ascii=False)
    return bridge.ask("studio_start", payload) == "waited"


def start_particle_stage(title="Xưởng Hạt Ánh Sáng"):
    payload = json.dumps({"action": "particle_stage_start", "title": str(title)}, ensure_ascii=False)
    return bridge.ask("studio_start", payload) == "started"


class Particle:
    """One small visual object whose state changes from frame to frame."""

    def __init__(
        self,
        x=50,
        y=50,
        vx=0,
        vy=0,
        ax=0,
        ay=0,
        life=60,
        size=1.0,
        scale_speed=0.0,
        alpha=255,
        fade_speed=0,
        color="#7ce7ff",
        symbol="•",
    ):
        self.x = float(x)
        self.y = float(y)
        self.vx = float(vx)
        self.vy = float(vy)
        self.ax = float(ax)
        self.ay = float(ay)
        self.life = float(life)
        self.size = float(size)
        self.scale_speed = float(scale_speed)
        self.alpha = float(alpha)
        self.fade_speed = float(fade_speed)
        self.color = color
        self.symbol = str(symbol)

    def update(self, dt=1.0):
        """Advance velocity, position, size, opacity, and lifetime once."""
        step = float(dt)
        self.vx = self.vx + self.ax * step
        self.vy = self.vy + self.ay * step
        self.x = self.x + self.vx * step
        self.y = self.y + self.vy * step
        self.size = max(0.0, self.size + self.scale_speed * step)
        self.alpha = max(0.0, min(255.0, self.alpha + self.fade_speed * step))
        self.life = self.life - step
        return self

    def is_alive(self):
        return self.life > 0 and self.size > 0 and self.alpha > 0

    def reset(
        self,
        x=None,
        y=None,
        vx=None,
        vy=None,
        ax=None,
        ay=None,
        life=None,
        size=None,
        scale_speed=None,
        alpha=None,
        fade_speed=None,
        color=None,
        symbol=None,
    ):
        """Start the same particle again, replacing only supplied values."""
        changes = (
            ("x", x), ("y", y), ("vx", vx), ("vy", vy),
            ("ax", ax), ("ay", ay), ("life", life), ("size", size),
            ("scale_speed", scale_speed), ("alpha", alpha),
            ("fade_speed", fade_speed), ("color", color), ("symbol", symbol),
        )
        for name, value in changes:
            if value is not None:
                setattr(self, name, str(value) if name == "symbol" else value)
        return self


def show_photo_lights(colors, mode="steady", step=0):
    if not isinstance(colors, list):
        colors = []
    payload = json.dumps(
        {
            "action": "photo_lights",
            "colors": [str(color) for color in colors[:12]],
            "mode": str(mode),
            "step": int(step),
        },
        ensure_ascii=False,
    )
    return bridge.ask("studio_start", payload) == "drawn"


def set_photo_light(index, color):
    payload = json.dumps(
        {"action": "photo_light", "index": int(index), "color": str(color)},
        ensure_ascii=False,
    )
    return bridge.ask("studio_start", payload) == "drawn"


def set_particle_style(style=None, color="#7ce7ff", symbols="", motion="orbit", size=1.0, density=1.0, glow=1.0):
    if isinstance(style, dict):
        color = style.get("color", color)
        symbols = style.get("symbols", symbols)
        motion = style.get("motion", motion)
        size = style.get("size", size)
        density = style.get("density", density)
        glow = style.get("glow", glow)
    elif style is not None:
        color = style
    _studio_tell(
        "particle_style",
        color=str(color),
        symbols=str(symbols),
        motion=str(motion),
        size=float(size),
        density=float(density),
        glow=float(glow),
    )


def attach_sticker(sticker, anchor="palm", size=1.0):
    if isinstance(sticker, dict):
        symbol = sticker.get("symbol", "*")
        anchor = sticker.get("anchor", anchor)
        size = sticker.get("size", size)
    else:
        symbol = sticker
    _studio_tell("sticker_attach", symbol=str(symbol), anchor=str(anchor), size=float(size))


def clear_stickers():
    _studio_tell("sticker_clear")


def send_gift(gift_info, gift="Gift", symbol="🎁", message=""):
    if isinstance(gift_info, dict):
        sender = gift_info.get("sender", "Guest")
        gift = gift_info.get("gift", gift)
        symbol = gift_info.get("symbol", symbol)
        message = gift_info.get("message", message)
    else:
        sender = gift_info
    _studio_tell(
        "gift",
        sender=str(sender),
        gift=str(gift),
        symbol=str(symbol),
        message=str(message),
    )


def particle_burst(anchor="palm"):
    _studio_tell("particle_burst", anchor=str(anchor))


def read_hand_position(anchor="palm"):
    payload = json.dumps({"action": "hand_position", "anchor": str(anchor)}, ensure_ascii=False)
    try:
        result = json.loads(bridge.ask("hand_position", payload))
    except (TypeError, ValueError):
        result = {}
    return {
        "visible": bool(result.get("visible", False)),
        "x": int(result.get("x", 50)),
        "y": int(result.get("y", 50)),
    }


def draw_sticker_at(sticker):
    if not isinstance(sticker, dict):
        sticker = {"symbol": str(sticker), "x": 50, "y": 50, "size": 1.0}
    _studio_tell(
        "sticker_at",
        symbol=str(sticker.get("symbol", "*")),
        x=float(sticker.get("x", 50)),
        y=float(sticker.get("y", 50)),
        size=float(sticker.get("size", 1.0)),
    )


def draw_particle_frame(particles):
    if not isinstance(particles, list):
        particles = []
    frame = []
    for particle in particles:
        if isinstance(particle, Particle):
            color = particle.color
            if isinstance(color, (list, tuple)) and len(color) >= 3:
                color = "rgb(" + ",".join(str(max(0, min(255, int(value)))) for value in color[:3]) + ")"
            frame.append({
                "x": particle.x,
                "y": particle.y,
                "symbol": particle.symbol,
                "color": str(color),
                "size": particle.size,
                "alpha": particle.alpha,
            })
        elif isinstance(particle, dict):
            frame.append(particle)
    payload = json.dumps({"action": "particle_frame", "particles": frame}, ensure_ascii=False)
    return bridge.ask("particle_frame", payload) == "drawn"


def present_image_frame(image):
    max_rows = 48
    max_cols = 64
    if not isinstance(image, list) or not image or not isinstance(image[0], list) or not image[0]:
        normalized = []
    else:
        row_count = min(len(image), max_rows)
        col_count = min(len(image[0]), max_cols)
        normalized = []
        for row_index in range(row_count):
            source_row = image[row_index] if isinstance(image[row_index], list) else []
            output_row = []
            for col_index in range(col_count):
                pixel = source_row[col_index] if col_index < len(source_row) else None
                if not isinstance(pixel, (list, tuple)) or len(pixel) not in (3, 4):
                    output_row.append([0, 0, 0, 0])
                    continue
                channels = []
                for value in pixel:
                    if not isinstance(value, (int, float)) or not math.isfinite(value):
                        channels.append(0)
                    else:
                        channels.append(max(0, min(255, int(value))))
                if len(channels) == 3:
                    channels.append(255)
                output_row.append(channels)
            normalized.append(output_row)
    payload = json.dumps({"action": "image_frame", "image": normalized}, ensure_ascii=False)
    return bridge.ask("image_frame", payload) == "drawn"


def clear_studio_frame():
    _studio_tell("studio_frame_clear")


def stop_studio():
    _studio_tell("studio_stop")


def photo_booth():
    while True:
        sign = int(bridge.ask("gesture", "show a sign: "))
        if sign == 5:
            bridge.tell("booth", "conjure")      # open palm: dust pours out
        elif sign == 1:
            bridge.tell("booth", "vortex")       # one finger: the dust whirls
        elif sign == 2:
            bridge.tell("booth", "capture")      # two fingers: SNAP - done
            break
