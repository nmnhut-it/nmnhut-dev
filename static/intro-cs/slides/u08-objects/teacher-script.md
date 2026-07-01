# Unit 8 — Objects (OOP) · Narration Script

Spoken narration, one block per slide. The `id` matches each slide's
`data-narration-id`. Aim ~20–35 seconds per block, friendly and clear for ~15-year-olds.

## Slide 001: Objects (OOP) (id: s01)
Narration: Welcome to Unit 8. So far our data and our actions have lived apart — a variable here, a function there. Today we bundle them into one thing, called an object. To keep it real, we'll design our very own kind of thing across this whole lesson: a Dog, with its own name and age, and its own actions. This is your first taste of object-oriented programming.

## Slide 002: What Is an Object? (id: s02)
Narration: So what is an object? It's one thing that carries two parts together. Its data — what it knows, like a name and an age. And its behavior — what it can do, like having a birthday. A real dog knows its own name and can do its own things. An object captures exactly that pairing: data and behavior, packed into one bundle.

## Slide 003: You've Used Objects All Along (id: s03)
Narration: Here's a secret: you've been using objects since Unit 1. A string holds letters, its data, and it comes with actions, like dot-upper to shout in capitals. A list holds items and comes with dot-append to add one. Data plus actions, together. The new power today is that you get to invent your own kind of thing, not just use the ones Python ships with.

## Slide 004: Class vs. Instance (id: s04)
Narration: Two words we'll use a lot. A class is the blueprint — it describes what every dog has and what every dog can do. An instance is one real dog built from that blueprint. Think of a cookie cutter and the cookies. Class Dog is the cutter; Rex, made with Dog of "Rex" and three, is one cookie. One blueprint, as many dogs as you like, each with its own name and age.

## Slide 005: Defining a Class (id: s05)
Narration: Let's write the blueprint. The class keyword names a brand-new kind of thing, and by convention we start the name with a capital letter — Dog. Right now it's nearly empty, just a name and a docstring. Inside, over the next few slides, we'll say what data each dog holds and what actions it can do.

## Slide 006: __init__ and self (id: s06)
Narration: Here's the important part. The method called init, spelled with two underscores on each side, runs automatically every time you make a new dog. Its job is to set up that dog's data. The word self means "this particular dog." So self-dot-name equals name stores the name onto this specific dog, and self-dot-age stores its age. Don't worry if it feels abstract — watch it work on the next slide.

## Slide 007: Making Real Dogs (id: s07)
Narration: Now we make real dogs. Dog of "Rex" and three runs init and builds a dog whose name is Rex and whose age is three. Dog of "Ada" and seven builds a second, completely separate dog. We read each one's data with a dot: rex-dot-name is Rex, ada-dot-age is seven. Notice you passed two values, but init listed three parameters — Python quietly fills self with the new dog for you.

## Slide 008: Each Instance Has Its Own Data (id: s08)
Narration: Each dog keeps its own copy of the data. Watch: we set rex-dot-age to four. Print Rex's age — four. Print Ada's age — still seven. Ada is completely untouched. The blueprint is shared, but the data is per dog. So changing one instance never changes the others. Predict both prints before you run it.

## Slide 009: A Method: birthday() (id: s09)
Narration: Now for behavior. A method is an action that belongs to the class — it's just a function that lives inside it. Our birthday method takes self, so it can reach this dog's own data, and it sets self-dot-age to self-dot-age plus one. In plain words: this dog gets one year older. Notice there's no return here; the method changes the object itself.

## Slide 010: Calling a Method (id: s10)
Narration: Let's call it. Rex starts at age three. We write rex-dot-birthday with empty parentheses. The dog on the left of the dot — Rex — becomes self inside the method, so it's Rex's age that goes up. Print again: four. It's the same dot notation you used for dot-append. Call birthday twice and Rex would be five.

## Slide 011: __str__: a Nice Printout (id: s11)
Narration: One more special method. If you just print a dog, Python shows an ugly default — the word Dog and a memory address. Not helpful. So we define str, again with double underscores, and return a friendly string like "Rex, age four." Now print of rex shows exactly that. One rule: str must return a string, which is why we wrap the age in str. It's fantastic for debugging, because you see real values.

## Slide 012: Put It Together (id: s12)
Narration: Here's the whole class on one slide: init for the data, birthday for the behavior, and str for the printout. That's the shape of nearly every class you'll ever write. Trace it: we make Rex at age three, call birthday, so his age becomes four, and the last line prints "Rex, age four." Run it, then try adding a second dog yourself.

## Slide 013: Quick Check (id: s13)
Narration: Quick check. We make a dog Momo at age three, then call birthday, which runs self-dot-age equals self-dot-age plus one. What is d-dot-age now? Take a second. The answer is four. The method reached into this dog's own data and added one, so three became four. The object changed itself.

## Slide 014: Recap & Next (id: s14)
Narration: To recap: an object bundles data and behavior into one thing. A class is the blueprint, and each instance carries its own data — init and self are what build them. Methods add actions, and str gives a friendly printout. Next unit we go further with classes and inheritance: building new kinds of thing on top of ones you've already made. Try the Unit 8 exercises first.
