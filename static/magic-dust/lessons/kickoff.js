// lessons/kickoff.js — the concrete kick-off presentation: STAGE is pure
// data (per KICKOFF-PLAN.md §A), engine/stage-player.js does the driving.
// Not reachable by students (same stance as dev-test.html — no link from
// the saga map; this is the teacher's URL, typed directly).
//
// v2 (owner feedback, 2026-07-04): "vui đấy nhưng nhìn chưa ok, chưa khoe
// được phần gesture của mình, không đủ ít thao tác — chỉ cần 1 dòng
// 'Kotopia chờ bạn', xong ritual phát là được, tự động luôn không cần gì
// hết." The default STAGE is now ONE gesture, ZERO keyboard: a single
// gesture-title screen (camera auto-starts at mount, fingertip FX + vortex
// charge, auto-seals on full charge) → the act1 clip (autoNext) → the map.
// The v1 multi-scene deck (title/ritual-showcase/embed/...) is reachable
// via ?deck=full — decks are data, this is exactly the reuse the player was
// built for (→/Space/Esc keyboard + the corner ⏭ still work everywhere, as
// a silent fallback if the camera fails at an event).
import { mount } from './engine/stage-player.js';

const FULL_DECK = [
  { kind: 'title', title: 'MAGIC DUST', subtitle: 'Kotopia đang chờ bạn' },
  { kind: 'ritual', theme: 'pulse' },                                   // the ritual showcase — ↑/↓ cycles motion presets live while the owner talks
  { kind: 'embed', src: '/index.html' },                                // the ROOT VFX app — teacher performs the live open-palm dust summon
  { kind: 'video', src: './assets/cutscenes/act1-oneshot.mp4', capMs: 11500 },   // the portal dive into Kotopia (same hard-cap discipline as onboard.js's ACT1)
  { kind: 'go', href: 'index.html?noentry' },                           // the saga map — ?noentry: the kickoff WAS the entrance; without it a flagless machine chains into onboarding and replays a cutscene right after the kickoff's own clip (owner-reported dupe)
];

const DEFAULT_STAGE = [
  { kind: 'gesture-title', title: 'Kotopia đang chờ bạn', hint: 'giơ ✋ lên nào', theme: 'pulse', next: 'auto' },
  { kind: 'video', src: './assets/cutscenes/act1-oneshot.mp4', capMs: 11500, autoNext: true },   // the portal dive into Kotopia — plays and cuts to the map with zero taps
  { kind: 'go', href: 'index.html?noentry' },                           // the saga map — ?noentry: the kickoff WAS the entrance; without it a flagless machine chains into onboarding and replays a cutscene right after the kickoff's own clip (owner-reported dupe)
];

const STAGE = new URLSearchParams(location.search).get('deck') === 'full' ? FULL_DECK : DEFAULT_STAGE;

const host = document.getElementById('stage');
mount(STAGE, host, {
  onDone: scene => { location.href = scene.href; },
});
