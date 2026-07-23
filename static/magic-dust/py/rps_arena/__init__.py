"""rps_arena — an oẳn tù tì (rock-paper-scissors) opponent that picks by itself.

    machine_move() -> returns 1, 3, or 4 at random — the SAME numbers
                       watch() returns from your own hand, but this one
                       the machine picks on its own, no camera involved
    show(value)    -> writes value as floating AR text over the camera view,
                       exactly like camera_charm's display()

Numbers follow camera_charm's convention: 1 ngón = BÚA, 3 ngón = BAO,
4 ngón = KÉO (2 và 5 ngón ở ngoài luật, y như watch()).

Runs inside the lesson worker; `bridge` is the page's I/O channel (worker.js).
"""
from js import bridge
import random


def machine_move():
    return random.choice([1, 3, 4])


def show(value):
    bridge.tell("label", str(value))
