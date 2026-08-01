// Gemini-chat driver — paste-and-run via the claude-in-chrome javascript_tool,
// in the tab of an OPEN Gemini chat (gemini.google.com/app/<id>) that already
// has the style anchor established (see .claude/skills/gemini-art/SKILL.md).
// Automates the manual loop a human does by hand: type prompt → send → wait
// for the image → save with a real filename.
//
// API IS NON-BLOCKING BY DESIGN — read this before "fixing" it into one
// blocking genOne() call. The claude-in-chrome javascript_tool's underlying
// CDP call (Runtime.evaluate) has its OWN ~45s timeout, independent of any
// timeout you write in JS. Gemini image gen regularly takes 45-90s. A
// single `await`-everything call gets killed by the CDP timeout before the
// image ever finishes, and — confirmed live — killing the tool call also
// kills the in-page async execution, so the image is never saved. There is
// no workaround inside one call; the caller MUST poll across several
// separate javascript_tool invocations:
//   1. submit(prompt)              — one short call, returns immediately
//   2. checkReady()  (repeat)      — short calls, ~2s apart, until ready:true
//   3. saveLast(filename)          — one short call once ready
// Driving code (the agent, not this file) does the polling loop.
//
// WHY THE REST OF THIS SHAPE (learned live 2026-07-04 driving gemini.google.com):
// - The composer is a contenteditable div (`.ql-editor`), not an <input>;
//   text must go in via document.execCommand('insertText', ...) + a
//   dispatched 'input' event, or Angular's model never sees the change.
// - The submit control is `button[aria-label="Send message"]` — found by
//   aria-label, not by class (classes are Angular Material hashes, they
//   rot fast; aria-label is the stable surface).
// - Generated images arrive as SAME-ORIGIN blob: URLs. A raw <img> for a
//   just-finished generation briefly has width>0 in its bounding rect but
//   complete===false/naturalWidth===0 while still decoding — poll on BOTH
//   complete && naturalWidth>0, not just element presence.
// - CRITICAL: blob: URLs are revoked once you navigate away and back to
//   the chat (confirmed: a prior generation's <img> was still in the DOM
//   after a reload, visible-sized, but complete:false/naturalWidth:0 — its
//   blob had been revoked). Extract EVERY image in the same navigation you
//   generated it in — don't queue a "come back later and download" step.
// - The canvas-toBlob-download path (not fetch(blobURL), which breaks the
//   instant the img is replaced) works because the <canvas> just needs one
//   drawImage() call while the blob is still alive; toBlob() then gives you
//   a fresh, stable blob you control, downloadable via a synthetic <a>.
//
// If Gemini's UI changes and these selectors stop matching: open devtools,
// generate one image by hand, and in the console run
//   [...document.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>50)
// to re-find the visible generated-image <img>, then re-check the Send
// button via
//   [...document.querySelectorAll('button')].map(b=>b.getAttribute('aria-label'))
// after focusing the composer with text in it (the Send button is hidden
// until the composer is non-empty).

(function (global) {
  const SEL_EDITOR = '.ql-editor';
  const SEND_ARIA = 'Send message';

  function findEditor() {
    const el = document.querySelector(SEL_EDITOR);
    if (!el) throw new Error('gemini-drive: composer (.ql-editor) not found — is a chat open?');
    return el;
  }

  function findSendButton() {
    return [...document.querySelectorAll('button')].find(
      b => (b.getAttribute('aria-label') || '') === SEND_ARIA
    );
  }

  // "Loaded" = the generated-image <img> as it actually renders on screen —
  // filters out stale/revoked blob <img>s left over from a prior page load.
  function loadedImages() {
    return [...document.querySelectorAll('img')].filter(i => {
      const r = i.getBoundingClientRect();
      return r.width > 50 && i.complete && i.naturalWidth > 0 && i.src.startsWith('blob:');
    });
  }

  // submit(promptText) — fills the composer and clicks Send. Returns
  // immediately (does NOT wait for the image); records the pre-submit
  // image count on window.__geminiDriveBefore for checkReady() to compare
  // against.
  function submit(promptText) {
    global.__geminiDriveBefore = loadedImages().length;
    const editor = findEditor();
    editor.focus();
    document.execCommand('selectAll');
    document.execCommand('delete');
    document.execCommand('insertText', false, promptText);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    const btn = findSendButton();
    if (!btn) throw new Error('gemini-drive: Send message button not found (composer may be empty)');
    btn.click();
    return 'submitted';
  }

  // checkReady() — call repeatedly (every ~2s) from OUTSIDE (separate
  // javascript_tool calls) after submit(). Returns {ready, count, before}.
  function checkReady() {
    const before = global.__geminiDriveBefore || 0;
    const count = loadedImages().length;
    return { ready: count > before, count, before };
  }

  // saveLast(filename) — once checkReady().ready is true, call this to
  // extract the newest image and download it as `filename` (lands in the
  // browser's Downloads folder; move it into the repo yourself after).
  function saveLast(filename) {
    const imgs = loadedImages();
    const img = imgs[imgs.length - 1];
    if (!img) throw new Error('gemini-drive: no loaded image to save — did checkReady() ever return ready:true?');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      global.__geminiDriveLastSave = { filename, size: blob.size, width: canvas.width, height: canvas.height };
    }, 'image/png'), 'save-pending — re-check window.__geminiDriveLastSave shortly';
  }

  global.geminiDrive = { submit, checkReady, saveLast };
})(window);

console.info('%cgemini-drive loaded — window.geminiDrive.submit(prompt) then poll checkReady() then saveLast(filename). See file header: do NOT await the whole flow in one call.', 'color:#78b2a5');
