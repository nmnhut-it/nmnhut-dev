"""Camera-free electronic board helpers for the Photo Lights side island."""
import json
from js import bridge

_FONT = {
    "A": ["010", "101", "111", "101", "101"], "B": ["110", "101", "110", "101", "110"],
    "C": ["011", "100", "100", "100", "011"], "D": ["110", "101", "101", "101", "110"],
    "E": ["111", "100", "110", "100", "111"], "F": ["111", "100", "110", "100", "100"],
    "G": ["011", "100", "101", "101", "011"], "H": ["101", "101", "111", "101", "101"],
    "I": ["111", "010", "010", "010", "111"], "J": ["001", "001", "001", "101", "010"],
    "K": ["101", "101", "110", "101", "101"], "L": ["100", "100", "100", "100", "111"],
    "M": ["101", "111", "111", "101", "101"], "N": ["101", "111", "111", "111", "101"],
    "O": ["010", "101", "101", "101", "010"], "P": ["110", "101", "110", "100", "100"],
    "Q": ["010", "101", "101", "111", "011"], "R": ["110", "101", "110", "101", "101"],
    "S": ["011", "100", "010", "001", "110"], "T": ["111", "010", "010", "010", "010"],
    "U": ["101", "101", "101", "101", "111"], "V": ["101", "101", "101", "101", "010"],
    "W": ["101", "101", "111", "111", "101"], "X": ["101", "101", "010", "101", "101"],
    "Y": ["101", "101", "010", "010", "010"], "Z": ["111", "001", "010", "100", "111"],
    " ": ["000", "000", "000", "000", "000"],
}


def _ask(payload):
    return bridge.ask("studio_start", json.dumps(payload, ensure_ascii=False))


def start_board():
    """Show the generated board and wait for the learner to press BẮT ĐẦU."""
    return _ask({"action": "light_board_start"}) == "started"


def clear_lights():
    return _ask({"action": "light_board_clear"}) == "cleared"


def place_bulb(x, y, color):
    """Place one bulb at x/y percentages inside the board screen."""
    return _ask({"action": "light_board_bulb", "x": float(x), "y": float(y), "color": str(color)}) == "drawn"


def show_grid(grid, offset=24, color="yellow"):
    """Render a 0/1 grid, shifted left by offset columns, on a 24-column board."""
    safe_grid = []
    if isinstance(grid, list):
        for row in grid[:12]:
            safe_grid.append([1 if value else 0 for value in row[:80]] if isinstance(row, list) else [])
    return _ask({"action": "light_board_grid", "grid": safe_grid, "offset": int(offset), "color": str(color)}) == "drawn"


def delay(seconds=0.5):
    return _ask({"action": "delay", "seconds": float(seconds)}) == "waited"


def text_grid(text):
    """Convert A-Z text into a five-row 0/1 grid with one blank column between letters."""
    letters = [_FONT.get(char, _FONT[" "]) for char in str(text).upper()]
    grid = [[] for _ in range(5)]
    for index, letter in enumerate(letters):
        for row in range(5):
            grid[row].extend(int(value) for value in letter[row])
            if index < len(letters) - 1:
                grid[row].append(0)
    return grid
