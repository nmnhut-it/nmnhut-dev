"""Small browser-native devices for the Python for Kids Magic Dust track."""
import json
from js import bridge

_robot_memory = {}


def say(value):
    bridge.tell("terminal", str(value))


def show_value(value):
    bridge.tell("label", str(value))


def show_pixels(grid):
    """Render a small 0/1 grid as a visible pixel picture."""
    rows = []
    for row in list(grid)[:16]:
        cells = list(row)[:16]
        rows.append("".join("██" if int(cell) else "  " for cell in cells))
    bridge.tell("pixels", "\n".join(rows))


def read_num(prompt="Enter a number: "):
    return int(bridge.ask("keyboard", prompt))


def read_text(prompt="Enter text: "):
    return str(bridge.ask("keyboard", prompt))


def device_reset():
    bridge.tell("studio", json.dumps({"action": "studio_frame_clear"}))


def play_note(note):
    """Show a deterministic visual note; audio can be added by the stage later."""
    bridge.tell("label", f"♪ {note}")


def robot_say(message):
    bridge.tell("terminal", f"Robot: {message}")


def robot_set_mood(mood):
    bridge.tell("label", f"mood: {mood}")


def robot_remember(key, value):
    _robot_memory[str(key)] = value


def robot_recall(key, default=""):
    return _robot_memory.get(str(key), default)
