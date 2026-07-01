# Unit 9 — Classes & Inheritance · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Classes & Inheritance (id: s01)
Narration: Welcome to Unit 9. Last unit you built a single class that bundled data and behavior together. Now we connect classes into families. When two types are almost the same — like a Cat and a Dog — inheritance lets one class keep everything another already has and just add or change a little. Let's see how.

## Slide 002: Recap: A Class Bundles Two Things (id: s02)
Narration: Quick reminder. A class bundles two things: data, which is what the object is — a name, an age — and behavior, the methods it can do, like speak. Every object built from the class has the same structure, but its own values. Today's question: what happens when two classes would be nearly identical?

## Slide 003: Cats and Dogs Are Both Animals (id: s03)
Narration: Think about a Cat and a Dog. Both have a name. Both can speak. A Cat is an Animal, and so is a Dog. If we wrote the name-handling code separately in each one, we'd be repeating ourselves. Inheritance fixes that: a Cat can reuse all the Animal parts for free, then add just what makes it a cat.

## Slide 004: The Parent Class: Animal (id: s04)
Narration: Here's the parent class, Animal. It's an ordinary class. Its init stores a name. It has a getter, get underscore name, that hands the name back. And it has speak, which for now returns a generic sound. Nothing new yet — but this is the shared structure the children will build on.

## Slide 005: A Child Class Inherits Everything (id: s05)
Narration: Now watch. Class Cat, in parentheses Animal — that says Cat's parent is Animal. The body is just "pass," nothing new. Yet Tom the Cat already has get_name and speak, inherited from Animal, without us re-typing a single line. The name in parentheses is the parent, and the child gets everything it has.

## Slide 006: Overriding: Change One Method (id: s06)
Narration: A generic sound is boring. So Cat redefines speak to return "Meow," and Dog redefines it to return "Woof." Redefining a method the parent already has is called overriding. Notice get_name is untouched — it's still inherited and still works. Overriding changes just the one method you redefine; everything else stays as it was.

## Slide 007: What a Child Class Can Do (id: s07)
Narration: So a child class has three powers. It can inherit — get all the parent's data and methods for free. It can add — give itself brand-new data or methods. And it can override — redefine a method to change its behavior. The short version: whatever an Animal can do, a Cat can do, plus more.

## Slide 008: Adding Data With super().__init__ (id: s08)
Narration: What if a Cat needs its own data — say, nine lives? We give Cat its own init. The first line, super dot init of name, runs Animal's setup for us, storing the name. Then we add self dot lives equals nine. Super means "the parent." So Felix gets his name from Animal and his lives from Cat. Always call the parent first.

## Slide 009: Why Call the Parent? (id: s09)
Narration: Why bother calling the parent instead of just re-typing self dot name equals name in every child? Because copying the same setup into every subclass is duplication waiting to break. Super dot init reuses it once. And if you improve Animal later, every child gets the improvement automatically. That's the real payoff of inheritance: don't repeat yourself. One place holds the shared setup.

## Slide 010: Asking "Is It An Animal?" (id: s10)
Narration: Sometimes you need to ask what type something is. Isinstance of felix and Cat is True. Isinstance of felix and Animal is also True — because a Cat is an Animal. But isinstance of felix and Dog is False. The key idea: isinstance is true for the whole family chain, not just the exact class. It's the "is-a" test.

## Slide 011: Polymorphism: Same Call, Different Result (id: s11)
Narration: Here's the magic trick. We make a list with cats and a dog mixed together, then loop and call speak on each. The loop never asks "is this a cat or a dog?" Each object just runs its own speak — Meow, Woof, Meow. One method name, different behavior per type. That's called polymorphism, and it lets you write one simple loop over a mixed group.

## Slide 012: Quick Check (id: s12)
Narration: Quick check. Both Animal and Cat define speak. When you call speak on a Cat, which one runs? Take a second. The answer is Cat dot speak, the child's version. Python looks in the object's own class first and stops at the first match it finds, so the child's override wins and the parent's version is not run.

## Slide 013: Recap & Next (id: s13)
Narration: To recap: class Child, parent in parentheses, inherits all the parent's data and methods, and can add new ones or override them. Super dot init reuses the parent's setup so you don't repeat yourself. Isinstance answers "is-a" for the whole family, and polymorphism lets the same call do the right thing for each type. That's the unit's big idea: inheritance is shared structure across related types.
