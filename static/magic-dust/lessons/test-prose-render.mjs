#!/usr/bin/env node
import assert from 'node:assert/strict';
import { highlightCode, rawSegmentsOf, renderProse, segmentsOf } from './engine/prose.js';

const quizHtml = renderProse(`Read this:
\`\`\`
x = 0
while x < 4:
    say_num(x) # output
\`\`\`
Which line stops the loop?`);

assert.match(quizHtml, /<pre class="cb"><code>/);
assert.match(quizHtml, /class="tok-kw">while/);
assert.match(quizHtml, /class="tok-builtin">say_num/);
assert.match(quizHtml, /class="tok-com"># output/);
assert.match(quizHtml, /&lt;/);
assert.doesNotMatch(quizHtml, /x < 4/);

const langBlock = rawSegmentsOf('```python\nsay("hi")\n```')[0];
assert.equal(langBlock.type, 'block');
assert.equal(langBlock.lang, 'python');
assert.equal(segmentsOf('```python\nsay("hi")\n```')[0].lang, 'python');

assert.match(highlightCode('say("x") # note'), /tok-str/);
assert.equal(highlightCode('<tag>', 'text'), '&lt;tag&gt;');

console.log('test-prose-render: 12 assertions passed');
