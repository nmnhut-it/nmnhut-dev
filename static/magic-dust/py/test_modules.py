"""python py/test_modules.py — plain assert-based tests for the py/ modules
that run inside the lesson Pyodide worker (see worker.js). No pytest/build
step, matching this repo's "no test framework" convention (mirrors the
lessons/test-*.mjs style: self-contained, node/python runnable directly).

`rules` is pure Python — imported and tested directly. `old_computer`,
`camera_charm`, and `machines` all do `from js import bridge` at module
level (a Pyodide-only global) — outside Pyodide that import fails, so a
fake `js` module with a recording `bridge` is installed into sys.modules
BEFORE importing them, letting these run under plain CPython.
"""
import sys
import types
import importlib
import builtins

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # Windows' cp1252 default console can't print the emoji/arrows in test names

passed = 0
failed = 0


def t(name, fn):
    global passed, failed
    try:
        fn()
        passed += 1
        print(f"  ok — {name}")
    except Exception as e:  # noqa: BLE001 - test harness, want to report any failure
        failed += 1
        print(f"  FAIL — {name}: {e}")


class FakeBridge:
    """Records every tell()/ask() call; ask() returns whatever was queued."""

    def __init__(self):
        self.told = []       # list of (kind, value) tuples
        self.answers = []    # queue of values ask() returns, in order

    def tell(self, kind, value):
        self.told.append((kind, value))

    def ask(self, kind, prompt):
        self.told.append(("ask:" + kind, prompt))
        if not self.answers:
            raise AssertionError(f"ask({kind!r}, {prompt!r}) called with no queued answer")
        return self.answers.pop(0)


def load_with_fake_bridge(module_name):
    """Fresh import of `module_name` with sys.modules['js'].bridge swapped for
    a FakeBridge — each call gets an independent bridge so tests don't leak
    call history into each other."""
    fake_bridge = FakeBridge()
    js_module = types.ModuleType("js")
    js_module.bridge = fake_bridge
    sys.modules["js"] = js_module
    sys.modules.pop(module_name, None)  # force re-import so it re-binds `from js import bridge`
    mod = importlib.import_module(module_name)
    return mod, fake_bridge


def assert_true(cond):
    assert cond


# ── rules — pure Python, no bridge needed ──
sys.path.insert(0, "py")
import rules  # noqa: E402 - path must be set up first

t("is_even — 0 is even", lambda: assert_true(rules.is_even(0)))
t("is_even — 4 is even", lambda: assert_true(rules.is_even(4)))
t("is_even — -2 is even (negative)", lambda: assert_true(rules.is_even(-2)))
t("is_even — 3 is not even", lambda: assert_true(not rules.is_even(3)))
t("is_odd — 3 is odd", lambda: assert_true(rules.is_odd(3)))
t("is_odd — -1 is odd (negative)", lambda: assert_true(rules.is_odd(-1)))
t("is_odd — 0 is not odd", lambda: assert_true(not rules.is_odd(0)))
t("is_odd — always the exact opposite of is_even, for a spread of inputs",
  lambda: assert_true(all(rules.is_odd(n) == (not rules.is_even(n)) for n in range(-5, 6))))


# ── old_computer — read/say/read_num/say_num ──
def test_old_computer():
    mod, bridge = load_with_fake_bridge("old_computer")
    bridge.answers = ["Xin chao"]
    result = mod.read("Say something: ")
    assert result == "Xin chao", result
    assert bridge.told[-1] == ("ask:keyboard", "Say something: "), bridge.told

    mod.say("hello")
    assert bridge.told[-1] == ("terminal", "hello"), bridge.told

    mod.say(42)  # say() must str()-convert non-string values too
    assert bridge.told[-1] == ("terminal", "42"), bridge.told

    bridge.answers = ["7"]  # ask() always returns a string; read_num must int() it
    n = mod.read_num("Số: ")
    assert n == 7 and isinstance(n, int), n

    mod.say_num(3.5)
    assert bridge.told[-1] == ("terminal", "3.5"), bridge.told


t("old_computer.read() returns the raw string and forwards prompt via bridge.ask", test_old_computer)


def test_old_computer_defaults():
    mod, bridge = load_with_fake_bridge("old_computer")
    bridge.answers = ["anything"]
    mod.read()  # default prompt path
    assert bridge.told[-1] == ("ask:keyboard", "Say something: "), bridge.told


t("old_computer.read() uses its default prompt when called with no args", test_old_computer_defaults)


def test_old_computer_standard_io():
    mod, bridge = load_with_fake_bridge("old_computer")
    original_input = builtins.input
    original_stdout = sys.stdout
    try:
        bridge.answers = ["Lan"]
        mod.install_standard_io()
        name = input("Tên bạn? ")
        print("Xin chào,", name)
        sys.stdout.flush()
        assert name == "Lan", name
        assert bridge.told == [
            ("ask:keyboard", "Tên bạn? "),
            ("terminal", "Xin chào, Lan"),
        ], bridge.told
    finally:
        builtins.input = original_input
        sys.stdout = original_stdout


t("old_computer installs standard input()/print() on the lesson terminal", test_old_computer_standard_io)


def test_old_computer_numbered_cards():
    mod, bridge = load_with_fake_bridge("old_computer")
    stopped_at = mod.run_cards(
        mod.card(10, "BOOT", goto=30),
        mod.card(20, "SKIP", goto=99),
        mod.card(30, "OPEN", goto=99),
    )
    assert stopped_at == 99, stopped_at
    told = [x for x in bridge.told if x[0] == "terminal"]
    assert told == [("terminal", "BOOT"), ("terminal", "OPEN")], told


t("old_computer.run_cards() follows numbered cards by goto target", test_old_computer_numbered_cards)


def test_old_computer_missing_card_error():
    mod, _bridge = load_with_fake_bridge("old_computer")
    try:
        mod.run_cards(mod.card(10, "START", goto=30))
        raise AssertionError("expected run_cards() to fail when the goto target is missing")
    except RuntimeError as e:
        assert "không có thẻ 30" in str(e), e


t("old_computer.run_cards() reports a missing goto target", test_old_computer_missing_card_error)


def test_old_computer_legacy_line_aliases():
    mod, bridge = load_with_fake_bridge("old_computer")
    assert mod.run_lines(mod.line(10, "OLD", goto=99)) == 99
    assert ("terminal", "OLD") in bridge.told


t("old_computer keeps line/run_lines aliases for saved code", test_old_computer_legacy_line_aliases)


# ── camera_charm — watch/fire_vortex/freeze/lighten/darken/display/photo_booth ──
def test_camera_charm_watch():
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["3"]  # ask() always returns a string; watch() must int() it
    count = mod.watch("show fingers: ")
    assert count == 3 and isinstance(count, int), count
    assert bridge.told[-1] == ("ask:fingers", "show fingers: "), bridge.told


t("camera_charm.watch() int()-converts the fingers-ask result", test_camera_charm_watch)


def test_camera_charm_fx():
    mod, bridge = load_with_fake_bridge("camera_charm")
    mod.fire_vortex()
    assert bridge.told[-1] == ("spell", "fire"), bridge.told
    mod.freeze()
    assert bridge.told[-1] == ("spell", "freeze"), bridge.told
    mod.lighten()
    assert bridge.told[-1] == ("screen", "lighten"), bridge.told
    mod.darken()
    assert bridge.told[-1] == ("screen", "darken"), bridge.told


t("camera_charm.fire_vortex()/freeze()/lighten()/darken() tell the right (kind, value) pairs", test_camera_charm_fx)


def test_camera_charm_display():
    mod, bridge = load_with_fake_bridge("camera_charm")
    mod.display("Hello!")
    assert bridge.told[-1] == ("label", "Hello!"), bridge.told
    mod.display(7)  # display() must str()-convert non-string values too, like say()/say_num() do
    assert bridge.told[-1] == ("label", "7"), bridge.told


t("camera_charm.display() writes AR label text and str()-converts non-string values", test_camera_charm_display)


def test_photo_booth_full_sequence():
    # exercises every branch of the loop: pour (5) -> whirl (1) -> snap (2) -> break
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["5", "1", "2"]
    mod.photo_booth()
    told = [x for x in bridge.told if x[0] == "booth"]
    assert told == [("booth", "conjure"), ("booth", "vortex"), ("booth", "capture")], told


t("photo_booth() pours→whirls→captures in order, then stops (loop terminates on snap)", test_photo_booth_full_sequence)


def test_photo_booth_ignores_unknown_signs_until_snap():
    # a sign that isn't 5/1/2 (e.g. 3 or 4) should be silently ignored — the
    # loop just keeps asking — not crash and not emit a spurious booth event
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["3", "4", "2"]
    mod.photo_booth()
    told = [x for x in bridge.told if x[0] == "booth"]
    assert told == [("booth", "capture")], told


t("photo_booth() ignores signs other than 5/1/2 and still stops cleanly on snap", test_photo_booth_ignores_unknown_signs_until_snap)


def test_photo_booth_never_snapping_would_hang():
    # documents the (expected) infinite-loop shape if snap (2) never comes —
    # verified with a bounded answer queue that runs out, raising instead of
    # looping forever, so THIS TEST doesn't hang the suite
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["5", "1", "5", "1"]  # never sends 2
    try:
        mod.photo_booth()
        raise AssertionError("expected photo_booth() to keep asking (and exhaust the fake queue) without a snap")
    except AssertionError as e:
        if "no queued answer" not in str(e):
            raise


t("photo_booth() truly loops until a snap (2) — never returns on its own otherwise", test_photo_booth_never_snapping_would_hang)


def test_camera_charm_studio_api():
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["ready"]
    assert mod.start_studio("Linh Live") is True
    kind, raw = bridge.told[-1]
    assert kind == "ask:studio_start", bridge.told
    assert __import__("json").loads(raw) == {"action": "studio_start", "title": "Linh Live"}

    bridge.answers = ["uploaded"]
    assert mod.upload_photo() is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "photo_upload"}

    sample = [[[10, 20, 30], [40, 50, 60]]]
    bridge.answers = [__import__("json").dumps(sample)]
    assert mod.load_sample_image(16) == sample
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "image_sample_grid", "size": 16}

    bridge.answers = [__import__("json").dumps(sample)]
    assert mod.choose_image(99) == sample
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "image_pick_grid", "size": 24}
    assert mod.blank_grid(2, 3) == [[0, 0, 0], [0, 0, 0]]
    assert mod.blank_grid(1, 2, [9, 8, 7]) == [[[9, 8, 7], [9, 8, 7]]]

    bridge.answers = ["started"]
    assert mod.start_photo_lights() is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "photo_start"}

    bridge.answers = ["waited"]
    assert mod.delay(0.7) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "delay", "seconds": 0.7}

    bridge.answers = ["drawn"]
    assert mod.show_photo_lights(["green", "red", "yellow"], "shift", 4) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "photo_lights", "colors": ["green", "red", "yellow"], "mode": "shift", "step": 4,
    }
    bridge.answers = ["started"]
    assert mod.start_particle_stage("Particle Lab") is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "particle_stage_start", "title": "Particle Lab"}
    bridge.answers = ["drawn"]
    assert mod.set_photo_light(2, "yellow") is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "photo_light", "index": 2, "color": "yellow"}

    mod.set_particle_style({
        "color": "#ff4fa3", "symbols": "LINH", "motion": "comet",
        "size": 1.2, "density": 0.75, "glow": 1.3,
    })
    kind, raw = bridge.told[-1]
    payload = __import__("json").loads(raw)
    assert kind == "studio" and payload == {
        "action": "particle_style", "color": "#ff4fa3", "symbols": "LINH",
        "motion": "comet", "size": 1.2, "density": 0.75, "glow": 1.3,
    }, (kind, payload)

    mod.attach_sticker({"symbol": "⭐", "anchor": "index_tip", "size": 1.4})
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "sticker_attach", "symbol": "⭐", "anchor": "index_tip", "size": 1.4,
    }
    mod.clear_stickers()
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "sticker_clear"}
    mod.send_gift({"sender": "An", "gift": "Heart", "symbol": "💖", "message": "Cảm ơn!"})
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "gift", "sender": "An", "gift": "Heart", "symbol": "💖", "message": "Cảm ơn!",
    }
    mod.particle_burst("wrist")
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "particle_burst", "anchor": "wrist"}
    bridge.answers = ['{"visible": true, "x": 23, "y": 71}']
    assert mod.read_hand_position("index_tip") == {"visible": True, "x": 23, "y": 71}
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "hand_position", "anchor": "index_tip"}
    mod.draw_sticker_at({"symbol": "S", "x": 25, "y": 75, "size": 1.5})
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "sticker_at", "symbol": "S", "x": 25.0, "y": 75.0, "size": 1.5}
    particles = [{"x": 10, "y": 20, "symbol": ".", "color": "#ff0000", "size": 1.2}]
    bridge.answers = ["drawn"]
    assert mod.draw_particle_frame(particles) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "particle_frame", "particles": particles}
    image = [[[255, 0, 17], [0, 128, 255, 64]], [[300, -5, 12, 999], None]]
    bridge.answers = ["drawn"]
    assert mod.present_image_frame(image) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "image_frame",
        "image": [[[255, 0, 17, 255], [0, 128, 255, 64]], [[255, 0, 12, 255], [0, 0, 0, 0]]],
    }
    mod.clear_studio_frame()
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "studio_frame_clear"}
    mod.stop_studio()
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "studio_stop"}


t("camera_charm studio helpers keep the JSON ask/tell contract", test_camera_charm_studio_api)


def test_camera_charm_studio_unavailable():
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["unavailable"]
    assert mod.start_studio() is False


t("camera_charm.start_studio() reports unavailable camera without raising", test_camera_charm_studio_unavailable)


def test_camera_charm_photo_project_fallbacks():
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["demo"]
    assert mod.upload_photo() is False
    bridge.answers = ["drawn"]
    assert mod.show_photo_lights("not a list", "unknown", 0) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "photo_lights", "colors": [], "mode": "unknown", "step": 0,
    }


t("camera_charm photo project keeps upload cancellation and bad color input safe", test_camera_charm_photo_project_fallbacks)


def test_camera_charm_hand_position_fallbacks():
    mod, bridge = load_with_fake_bridge("camera_charm")
    bridge.answers = ["not json"]
    assert mod.read_hand_position() == {"visible": False, "x": 50, "y": 50}
    bridge.answers = ["skipped"]
    assert mod.draw_particle_frame("not a list") is False
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "particle_frame", "particles": []}
    bridge.answers = ["invalid"]
    assert mod.present_image_frame("not an image") is False
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "image_frame", "image": []}

    oversized = [[[row, col, 999] for col in range(70)] for row in range(60)]
    bridge.answers = ["drawn"]
    assert mod.present_image_frame(oversized) is True
    capped = __import__("json").loads(bridge.told[-1][1])["image"]
    assert len(capped) == 48 and len(capped[0]) == 64
    assert capped[47][63] == [47, 63, 255, 255]

    bridge.answers = ["not json"]
    assert mod.choose_image() == []


t("camera_charm low-level studio APIs degrade to bounded neutral data", test_camera_charm_hand_position_fallbacks)


# ── machines — old_computer_*/future_machine_* (parallel ask/fire/freeze APIs) ──
# ── light_board — camera-free bulb, timing, and grid project ──
def test_light_board_bridge_contract():
    mod, bridge = load_with_fake_bridge("light_board")
    bridge.answers = ["started", "drawn", "waited", "cleared"]
    assert mod.start_board() is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "light_board_start"}
    assert mod.place_bulb(25, 15, "red") is True
    assert __import__("json").loads(bridge.told[-1][1]) == {
        "action": "light_board_bulb", "x": 25.0, "y": 15.0, "color": "red"
    }
    assert mod.delay(0.6) is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "delay", "seconds": 0.6}
    assert mod.clear_lights() is True
    assert __import__("json").loads(bridge.told[-1][1]) == {"action": "light_board_clear"}


t("light_board helpers keep the start, bulb, delay, and clear bridge contract", test_light_board_bridge_contract)


def test_light_board_grid_and_font():
    mod, bridge = load_with_fake_bridge("light_board")
    assert mod.text_grid("A") == [[0, 1, 0], [1, 0, 1], [1, 1, 1], [1, 0, 1], [1, 0, 1]]
    grid = mod.text_grid("A B")
    assert len(grid) == 5 and len(grid[0]) == 11
    bridge.answers = ["drawn"]
    assert mod.show_grid([[0, 2, ""], [1, 0, 1]], color="cyan") is True
    payload = __import__("json").loads(bridge.told[-1][1])
    assert payload == {"action": "light_board_grid", "grid": [[0, 1, 0], [1, 0, 1]], "offset": 24, "color": "cyan"}


t("light_board builds a five-row font grid and sends a safe visible frame", test_light_board_grid_and_font)


def test_machines_old_computer():
    mod, bridge = load_with_fake_bridge("machines")
    bridge.answers = ["5"]
    n = mod.old_computer_ask("Enter a number: ")
    assert n == 5 and isinstance(n, int), n
    assert bridge.told[-1] == ("ask:keyboard", "Enter a number: "), bridge.told

    mod.old_computer_tell(9)
    assert bridge.told[-1] == ("terminal", "9"), bridge.told

    mod.old_computer_fire()
    assert bridge.told[-1] == ("terminal", "FIRE  🔥"), bridge.told

    mod.old_computer_freeze()
    assert bridge.told[-1] == ("terminal", "FREEZE  ❄"), bridge.told


t("machines.old_computer_* asks via keyboard and tells via terminal", test_machines_old_computer)


def test_machines_future_machine():
    mod, bridge = load_with_fake_bridge("machines")
    bridge.answers = ["8"]
    n = mod.future_machine_ask("Enter a number: ")
    assert n == 8 and isinstance(n, int), n
    assert bridge.told[-1] == ("ask:fingers", "Enter a number: "), bridge.told

    mod.future_machine_tell(2)
    assert bridge.told[-1] == ("label", "2"), bridge.told

    mod.future_machine_fire()
    assert bridge.told[-1] == ("spell", "fire"), bridge.told

    mod.future_machine_freeze()
    assert bridge.told[-1] == ("spell", "freeze"), bridge.told


t("machines.future_machine_* asks via fingers and tells via spell/label (the 'machine changes, logic doesn't' contract)",
  test_machines_future_machine)


def test_machines_same_shape_different_channel():
    # the whole node01_odd_even lesson point: identical call SHAPE across
    # both machines, only the (kind) channel differs — verify that contract
    # holds structurally, not just per-function
    mod, bridge = load_with_fake_bridge("machines")
    bridge.answers = ["1", "1"]
    old_kind = mod.old_computer_ask("n? ")
    bridge.answers = ["1"]
    new_kind = mod.future_machine_ask("n? ")
    assert type(old_kind) is type(new_kind) is int


t("machines.*_ask both return plain ints regardless of channel (old_computer vs future_machine)",
  test_machines_same_shape_different_channel)


print(f"\n{passed} passed, {failed} failed")
if failed:
    sys.exit(1)
