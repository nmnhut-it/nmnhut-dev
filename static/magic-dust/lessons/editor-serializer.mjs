// editor-serializer.mjs — turns a plain-data NODE object (as loaded from
// lessons/content/nodeNN.js's `export default {...}`) back into ES-module
// source text. Shared between the browser editor (lessons/editor.js) and the
// round-trip test (lessons/test-editor-serializer.mjs) so there is exactly
// one place that defines "how a value becomes source text".
//
// Contract: load(original) -> serialize(original) -> write -> load(that) ->
// must be deep-equal to `original` (RegExp compared by .source/.flags, not
// identity). This is a data serializer, NOT a source-preserving formatter —
// comments in the original file are lost; callers must warn about that
// (the editor UI does; see lessons/editor.html header note).
//
// Supported value shapes (matches everything actually used by
// lessons/content/node*.js + TEMPLATE.js): plain object, array, string,
// number, boolean, null, RegExp. `undefined` object values are OMITTED (not
// emitted as `key: undefined`) so re-import naturally produces `undefined`
// for that key again (object equality check must skip undefined keys, same
// as JS's own `key in obj` semantics used loosely here).

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function indent(n) { return '  '.repeat(n); }

function serializeKey(k) {
  return IDENT_RE.test(k) ? k : JSON.stringify(k);
}

// A string becomes a template literal only when it contains a newline AND no
// backtick/`${` (those would need escaping that defeats the point of using a
// template literal for readability) — otherwise a JSON string literal, which
// already handles \n via the printable \n escape.
function serializeString(s) {
  const hasNewline = s.includes('\n');
  const hasBacktickOrInterp = s.includes('`') || s.includes('${');
  if (hasNewline && !hasBacktickOrInterp) {
    // escape backslashes only (no backtick/${ present by the guard above)
    const escaped = s.replace(/\\/g, '\\\\');
    return '`' + escaped + '`';
  }
  return JSON.stringify(s);
}

function serializeRegExp(re) {
  return re.toString(); // /source/flags — exactly what a RegExp literal needs
}

function serializeValue(v, depth) {
  if (v === null) return 'null';
  if (v instanceof RegExp) return serializeRegExp(v);
  if (Array.isArray(v)) return serializeArray(v, depth);
  if (typeof v === 'object') return serializeObject(v, depth);
  if (typeof v === 'string') return serializeString(v);
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  // undefined shouldn't reach here for object values (filtered by caller),
  // but guard anyway.
  return 'null';
}

function serializeArray(arr, depth) {
  if (!arr.length) return '[]';
  const inner = arr.map(item => `${indent(depth + 1)}${serializeValue(item, depth + 1)}`).join(',\n');
  return `[\n${inner},\n${indent(depth)}]`;
}

function serializeObject(obj, depth) {
  const keys = Object.keys(obj).filter(k => obj[k] !== undefined);
  if (!keys.length) return '{}';
  const inner = keys
    .map(k => `${indent(depth + 1)}${serializeKey(k)}: ${serializeValue(obj[k], depth + 1)}`)
    .join(',\n');
  return `{\n${inner},\n${indent(depth)}}`;
}

// serializeNode(nodeObj) -> full ES-module source text, `export default {...};`
export function serializeNode(nodeObj) {
  return `export default ${serializeObject(nodeObj, 0)};\n`;
}

export function serializeValueForTest(v) { return serializeValue(v, 0); }
