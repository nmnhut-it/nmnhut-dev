"""rules — the logic. This never changes, no matter which machine you use.

    is_even(number) -> bool
    is_odd(number)  -> bool
"""


def is_even(number):
    return number % 2 == 0


def is_odd(number):
    return not is_even(number)
