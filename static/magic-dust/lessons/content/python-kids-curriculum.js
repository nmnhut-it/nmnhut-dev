export const PYTHON_KIDS_NODES = [
  { id: 0, title: "Meet the Tiny Machine", short: "commands, running code, and output", mainRequired: 0, collectibleName: "Tiny Machine Badge" },
  { id: 1, title: "Paint with Pixels", short: "lists, rows, columns, and image data", mainRequired: 0, collectibleName: "Pixel Painter Badge" },
  { id: 2, title: "Number Charms", short: "values, variables, and arithmetic", mainRequired: 0, collectibleName: "Number Charmer Badge" },
  { id: 3, title: "Word Charms", short: "strings, joining, and messages", mainRequired: 0, collectibleName: "Word Charmer Badge" },
  { id: 4, title: "The Input Gate", short: "real input, conversion, and validation", mainRequired: 0, collectibleName: "Input Gate Badge" },
  { id: 5, title: "Choose a Path", short: "comparisons and if/else decisions", mainRequired: 0, collectibleName: "Pathfinder Badge" },
  { id: 6, title: "The Memory Chest", short: "lists, indexing, and changing collections", mainRequired: 0, collectibleName: "Memory Chest Badge" },
  { id: 7, title: "The Name Cabinet", short: "dictionaries, keys, and lookup", mainRequired: 0, collectibleName: "Name Cabinet Badge" },
  { id: 8, title: "Repeat the Spell", short: "for loops, range, and accumulation", mainRequired: 0, collectibleName: "Loop Caster Badge" },
  { id: 9, title: "The Rhythm Room", short: "notes, sequences, and musical patterns", mainRequired: 0, collectibleName: "Rhythm Room Badge" },
  { id: 10, title: "The Talking Robot", short: "state, mood, memory, and responses", mainRequired: 0, collectibleName: "Talking Robot Badge" },
  { id: 11, title: "Spell Recipes", short: "functions, parameters, and return values", mainRequired: 0, collectibleName: "Function Forge Badge" },
  { id: 12, title: "Build a Creature", short: "classes, attributes, and methods", mainRequired: 0, collectibleName: "Creature Builder Badge" },
  { id: 13, title: "The Bug Laboratory", short: "assertions, tests, and repair", mainRequired: 0, collectibleName: "Bug Lab Badge" },
  { id: 14, title: "The Talking Machine", short: "combine kits in an original project", mainRequired: 0, collectibleName: "Maker Badge" },
];

export const pythonKidsCompletionKey = id => `magicdust.pythonKids.node.${id}`;
export const pythonKidsLessonPage = id => `python-kids-lesson.html?node=${id}`;

export const pythonKidsReward = node => ({
  track: "pythonKids",
  nodeId: node.id,
  xp: 100,
  collectible: { name: node.collectibleName, glyph: ["✦", "◆", "◇"][node.id % 3] },
  completionKey: pythonKidsCompletionKey(node.id),
});
