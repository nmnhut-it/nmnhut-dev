"""Autonomous tests for counting fingertip peaks in a binary hand mask."""

from old_computer import say


TESTS = [
    ("empty", [["0", "0"], ["0", "0"]], 0),
    ("one_finger", [["0", "x", "0"], ["0", "x", "0"], ["x", "x", "x"]], 1),
    (
        "three_fingers",
        [
            ["0", "x", "0", "0", "x", "0", "0", "x", "0"],
            ["0", "x", "0", "0", "x", "0", "0", "x", "0"],
            ["0", "x", "x", "x", "x", "x", "x", "x", "0"],
            ["0", "x", "x", "x", "x", "x", "x", "x", "0"],
        ],
        3,
    ),
    ("finger_at_edge", [["x", "0", "0"], ["x", "0", "0"], ["x", "x", "x"]], 1),
    ("isolated_pixel_is_not_a_finger", [["0", "x", "0"], ["0", "0", "0"]], 0),
]


def test(count_fingertips):
    passed = 0
    for name, grid, expected in TESTS:
        try:
            actual = count_fingertips(grid)
            if actual == expected:
                say("PASS " + name)
                passed += 1
            else:
                say("FAIL " + name + ": got " + str(actual) + ", expected " + str(expected))
        except Exception as error:
            say("ERROR " + name + ": " + str(error))

    say("RESULT " + str(passed) + "/" + str(len(TESTS)))
    return passed
