"""machines — the two machines you can run your program on.

Each machine has the SAME three actions — ask / fire / freeze — but a different
world behind them. The function name says which machine you're talking to:

    old_computer_ask / _fire / _freeze     → a plain terminal (type; it prints)
    future_machine_ask / _fire / _freeze   → the AR machine (fingers; it casts)

The whole lesson: change every `old_computer` to `future_machine`, and the same
logic runs on the camera instead of the keyboard. The rule (see `rules`) doesn't
move — only the machine does.

Runs inside the lesson worker; `bridge` is the page's I/O channel (see worker.js).
"""
from js import bridge


# ── old-time computer: keyboard in, text out ──
def old_computer_ask(prompt="Enter a number: "):
    return int(bridge.ask("keyboard", prompt))

def old_computer_tell(value):
    bridge.tell("terminal", str(value))

def old_computer_fire():
    bridge.tell("terminal", "FIRE  🔥")

def old_computer_freeze():
    bridge.tell("terminal", "FREEZE  ❄")


# ── future machine: fingers in, spells / VFX out ──
def future_machine_ask(prompt="Enter a number: "):
    return int(bridge.ask("fingers", prompt))

def future_machine_tell(value):
    bridge.tell("label", str(value))

def future_machine_fire():
    bridge.tell("spell", "fire")

def future_machine_freeze():
    bridge.tell("spell", "freeze")
