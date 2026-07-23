// lessons/entry.js — the saga homepage's ENTRY FUNNEL (owner: "the beautiful
// one-gesture entry lives off in teacher-only kickoff.html while the homepage
// drops students straight onto the naked map — make it the actual funnel").
//
// Boot order (see lessons/index.html): theme.js applies the theme, saga.js
// renders the map into document.body FIRST (it does `document.body.innerHTML
// = ...` synchronously — anything appended before that would be wiped), THEN
// this file mounts a fullscreen overlay on top of it. onboard.js loads with
// `data-manual` so it does NOT auto-mount itself — we drive its manual
// `Onboard.mount({onDone})` API ourselves, once, at the right point in the
// sequence below.
//
// Flow: fullscreen gesture-title scene (reusing stage-player.js's exported
// `mountGestureTitle` — see that file's comment on why it needed no logic
// changes, just a wider export list) → seal → if this is the very first
// visit (no `magicdust.onboard` flag yet) hand off to the story onboarding
// (`Onboard.mount({onDone: revealMap})`); otherwise go straight to
// `revealMap()`. `revealMap()` tears the entry layer down (releasing the
// camera) and the map underneath is simply revealed.
import { mountGestureTitle } from './engine/stage-player.js';

const ENTRY_EVERY_VISIT = false;     // returning players go straight to the map — no ✋ gate every visit (owner: "high five hoài hơi mệt"). First-ever visit still runs onboarding; flip to true to gate every load.
const ONBOARD_KEY = 'magicdust.onboard';

const params = new URLSearchParams(location.search);
if (params.has('noentry')) revealMap();          // dev escape hatch — documented in lessons/README.md
else if (!localStorage.getItem(ONBOARD_KEY)) mountOnboard();  // FIRST visit: straight into the story — stacking the ✋ entry gate in front of onboarding's own gate read as "bị lặp" (owner, 2026-07-04)
else if (!ENTRY_EVERY_VISIT) revealMap();
else mountEntry();

function mountOnboard() {
  // onboard.js is ALREADY loaded by index.html's classic `<script defer
  // data-manual>` tag — and entry.js (a module) runs after defer scripts, so
  // window.Onboard exists here. NEVER dynamic-import('./onboard.js'): that
  // executes the file a SECOND time as a module, where document.currentScript
  // is null so the data-manual check fails → it auto-mounts a second copy →
  // two MediaPipe Hands instances → the WASM "Module.arguments has been
  // replaced" abort (owner hit this live, 2026-07-04).
  if (window.Onboard) window.Onboard.mount({ onDone: revealMap });
  else revealMap();                               // onboard failed to load — never a dead end
}

function mountEntry() {
  const host = document.createElement('div');
  host.id = 'entry';
  document.body.appendChild(host);

  // mountGestureTitle returns a bare teardown fn (no onKey needed here — the
  // full stage-player only normalizes it into {destroy,onKey} for the
  // ritual scene's live motion-cycling, irrelevant to this single scene).
  let done = false, teardown = () => {};
  const finish = () => {
    if (done) return; done = true;
    document.removeEventListener('keydown', skip);
    teardown();
    host.remove();
    revealMap();                                  // first-visit onboarding is routed BEFORE the entry gate now (see boot above), so sealing here only ever reveals the map
  };

  teardown = mountGestureTitle(
    { title: 'Kotopia đang chờ bạn', hint: 'giơ ✋ lên nào', theme: 'pulse' },
    host,
    finish,                                         // mountGestureTitle already delays its own seal()->advance() call so the flash/burst reads before this fires
  );

  // never a dead end: any tap or Enter/→/Space instantly skips the entry,
  // same soft posture as every other stage-player scene.
  const skip = e => { if (e.type === 'keydown' && !['Enter', ' ', 'ArrowRight'].includes(e.key)) return; finish(); };
  host.addEventListener('click', skip);
  document.addEventListener('keydown', skip);
}

function revealMap() { /* the map (saga.js) already rendered under the overlay — nothing left to do once the entry layer is gone */ }
