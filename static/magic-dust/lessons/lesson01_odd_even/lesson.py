# Lesson 1 — Odd or Even.  This program runs ONCE, top to bottom, then stops.
#
# Look at the names: old_computer_ask, old_computer_fire, old_computer_freeze.
# They all talk to the OLD-TIME COMPUTER — a terminal. Type a number: odd
# numbers "fire", even numbers "freeze" (printed as text).
#
# Step 2:  Change every  old_computer  to  future_machine.
#          The SAME logic now runs on the camera — hold up a number of fingers,
#          and fire/freeze become real spells on the scene. The rule doesn't move.

from machines import old_computer_ask, old_computer_fire, old_computer_freeze
from rules import is_odd

number = old_computer_ask("Enter a number: ")

if is_odd(number):
    old_computer_fire()
else:
    old_computer_freeze()
