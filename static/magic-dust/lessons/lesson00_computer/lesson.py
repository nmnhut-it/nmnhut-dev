# Lesson 0 — What is a computer?
#
# Every program a computer runs does three things, in order:
#
#     1) INPUT    — it takes something in
#     2) PROCESS  — it does something with it
#     3) OUTPUT   — it gives something back
#
# Run this one. Then try changing the PROCESS line — make it "+ 10", or
# "* number" (the number times itself). Input and output don't move; only the
# middle — the thinking — changes.

from machines import old_computer_ask, old_computer_tell

number = old_computer_ask("Give me a number: ")   # 1) INPUT

answer = number * 2                                # 2) PROCESS  (here: double it)

old_computer_tell(answer)                          # 3) OUTPUT
