// onboard-bye.js — the farewell bookend to onboard.js's "CODE!" gate.
// ACT 1 — the gate: ✋ open palm, HELD (same MediaPipe Hands five-finger
// detection as onboard.js's CODE! gate) charges the vortex; once fully
// charged a 3-2-1 COUNTDOWN plays (big on-screen numbers) before detonating
// — a beat to let go of the pose and just watch, not a hold-through-zero
// race. No camera → press-and-HOLD anywhere on the gate panel instead (same
// fallback pattern as onboard.js). Voice/chant was tried here (2026-07-30)
// and dropped — SpeechRecognition added ceremony without adding reliability,
// the hold+countdown is enough on its own.
// ACT 2 — the vortex `burst()`s live, THEN (not before) ONE photo is
// captured from the camera and sent to an AI image model (bytedance-seed/
// seedream-4.5 via OpenRouter — google/gemini-3-pro-image and, intermittently,
// gemini-2.5-flash-image 400 with a Google AI Studio geo-block on this
// account, confirmed live; seedream-4.5 doesn't hit it and its "open
// storybook page" framing fits this app better anyway — see serve.py's
// /api/restyle-photo docstring) to be restyled into the Kotopia storybook
// art in one coherent pass. This replaced an
// earlier live-compositing attempt (MediaPipe selfie segmentation cutting
// the learner out of the camera feed and layering them over a static
// backdrop, engine/human-layers.js) — that approach shipped and WORKED, but
// looked like a rough sticker cutout stamped over a painting: hard mask
// edges, mismatched lighting/color, and the vortex's rune-glyph dust reading
// as "random letters raining" against a bright painted sky rather than the
// dark rune-circle gate it was designed for. A single AI-restyled image
// sidesteps all of that by regenerating the whole picture in one consistent
// style instead of trying to blend live video into a painting in real time.
// The restyle call takes ~10-20s, so a spirit-animal video plate (one of the
// bundled screen-blended overlay clips — engine/interactive-studio.js's
// EFFECT_CLIPS family, e.g. koto-stag/spirit-phoenix/spirit-rose) plays over
// the live camera as a "casting" fill, same visual language as the node
// booth's play_effect(). It stops the moment the restyled photo lands.
//
// The restyled photo then HOLDS — no auto-timeout to Pip (2026-07-30, owner:
// "pause at the picture, it's good enough") — with the spirit-animal clip
// looping small in a bottom-right corner circle as a "someone's still here"
// beat, until the player taps to continue. A download link (bakeCorner())
// bakes ONE frame of that same corner clip into the photo (screen-blended,
// same position) and auto-downloads it — a still PNG can't hold the live
// animation, so this is the closest static match to what's on screen.
//
// DEV/LOCAL ONLY: this calls POST /api/restyle-photo, a proxy endpoint added
// to serve.py that holds the OpenRouter key server-side (see serve.py's
// docstring). The client never sees the key. This endpoint does not exist on
// the deployed static site — this scene will fail closed (falls straight to
// Pip, see the catch in playKotopiaScene) if served from anywhere but
// `python serve.py`. Do NOT embed the key client-side to make this work
// live without adding a real backend (e.g. a Cloudflare Worker) first.
// ACT 3 — Pip's goodbye line + a close button.
// Mountable module (`OnboardBye.mount`); lessons/onboard-bye.html is the dev
// harness. obDevBye exposes trigger()/act(n)/hold(p) for testing without a
// camera.
window.OnboardBye = (() => {
  const TYPE_MS = 16, PAUSE_MS = 460, PAUSE_CH = '.!?…:';
  const LINES = [
    'Tạm biệt bạn nhé! Pip sẽ đợi ở Kotopia, chờ ngày bạn quay lại.',
    'Nhớ mang theo Mật Ngữ mình vừa học — lần sau gặp lại, mình học tiếp!',
  ];
  // the AI-restyled Kotopia portrait, shown AFTER the live ritual burst — the
  // vortex is the trigger's payoff, this scene is a short beat between the
  // burst and Pip's reveal, not the gate. Landscape (2026-07-30, owner: "size
  // ảnh là size ngang") — the camera itself is captured wide (CAM_W×CAM_H)
  // and the prompt reinforces the orientation so the model doesn't crop back
  // to a square "book cover" the way it did in earlier square-source tests.
  const CAM_W = 960, CAM_H = 540; // 16:9
  // Color direction (2026-07-30, owner: "green and good vibes, not so
  // yellowish") — lush green/emerald palette, not the warm golden-hour tone
  // the first version defaulted to.
  const RESTYLE_PROMPT = 'Restyle this photo into a painterly children\'s storybook illustration, '
    + 'wide landscape orientation (16:9), set in a magical floating-island kingdom called Kotopia — lush '
    + 'green and emerald tones, fresh spring daylight, verdant floating islands covered in trees and moss, '
    + 'a lighthouse, gentle glowing dust motes drifting in the air. Good, uplifting vibes — NOT a warm '
    + 'golden/yellow/sunset color grade. Keep the person\'s face, hairstyle, and pose clearly recognizable '
    + '— do not change their identity — but give them a warm, joyful, cheerful smiling expression, '
    + 'genuinely happy. Cohesive fantasy storybook art style matching a children\'s picture book, no text, '
    + 'no watermark, no border.';
  const PIP_IMG = 'assets/storybook/pip-storybook-v2.webp';
  const PIPFLY_AT = 1200;
  const HOLD_MS = 1400, HOLD_NOVOICE_MS = 1400; // open-palm hold (camera) / press-and-hold (no camera) — same pace, no voice cap anymore
  const COUNT_STEP_MS = 700; // 3→2→1→(burst), one step per tick
  // spirit-animal video plates — same bundled clips engine/interactive-studio.js's
  // EFFECT_CLIPS plays for students, glowing light on black, screen-blended.
  // One is picked at random per playthrough as the "casting" fill. Owner
  // preference (2026-07-30): stag + phoenix only, not the rose.
  const SPIRIT_CLIPS = [
    'assets/camera-effects/overlays/koto-stag.mp4',
    'assets/camera-effects/overlays/spirit-phoenix.mp4',
  ];
  // shared with onboard.js — same landmark math, same MediaPipe script keys
  const loadScript = (src) => {
    self.__mdScriptLoads ||= {};
    return (self.__mdScriptLoads[src] ||= new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    }));
  };
  const FT_EXT = 0.55, TH_RATIO = 1.12;
  const handSize = (lm) => Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || 0.001;
  const ext = (lm, pip, tip) => Math.max(0, Math.min(1, ((lm[pip].y - lm[tip].y) / handSize(lm)) * 4.5));
  const thumbUp = (lm) => Math.hypot(lm[4].x - lm[17].x, lm[4].y - lm[17].y) > Math.hypot(lm[2].x - lm[17].x, lm[2].y - lm[17].y) * TH_RATIO;
  const countFingers = (lm) => (ext(lm, 6, 8) > FT_EXT) + (ext(lm, 10, 12) > FT_EXT) + (ext(lm, 14, 16) > FT_EXT) + (ext(lm, 18, 20) > FT_EXT) + thumbUp(lm);

  function mount({ onDone } = {}) {
    const ob = document.createElement('div');
    ob.id = 'ob';
    ob.innerHTML = `
      <video id="obcam" playsinline muted></video>
      <video id="obbspirit" class="obb-spirit" playsinline muted loop></video>
      <div class="obin" id="obbgate">
        <div class="obsub" id="obbstat">…</div>
        <div class="obgauge"><i id="obbfill"></i></div>
        <div class="obalt" id="obbalt">✋ giơ bàn tay mở lên và giữ yên</div>
        <div class="obb-count gone" id="obbcount"></div>
      </div>
      <div class="obin gone" id="obkoto"></div>
      <div class="obin gone" id="obbpip">
        <div class="obavatar gone" id="obbav"></div>
        <div class="obavname gone" id="obbavname">✦ PIP ✦</div>
        <div class="obbubble gone" id="obbbub"><b>Pip</b><span id="obbtxt"></span></div>
        <button class="start obgo gone" id="obbgo">✦ HẸN GẶP LẠI</button>
      </div>
      <div class="obflash" id="obbflash"></div>`;
    document.body.appendChild(ob);
    const $ = (id) => ob.querySelector('#' + id);

    let done = false, dead = false, cam = null, obVfx = null;
    let held = 0, fiveNow = false, pressing = false, lastTick = 0, raf = 0, counting = false;

    loadScript('./ritual-vortex.js').then(() => { if (!dead) obVfx = RitualVortex.mount(ob, { cy: 0.45 }); }).catch(() => {});

    startCam();
    async function startCam() {
      try {
        if (!(self.Hands && self.Camera)) {
          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
          await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
        }
        if (dead) return;
        const hands = new self.Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}` });
        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.6, selfieMode: false });
        hands.onResults(onHands);
        const v = $('obcam');
        cam = new self.Camera(v, { onFrame: async () => { await hands.send({ image: v }); }, width: CAM_W, height: CAM_H });
        await cam.start();
        ob.classList.add('live');
      } catch { $('obbstat').textContent = 'không thấy camera — chạm và GIỮ dòng chữ phép nhé!'; }
    }
    function onHands(res) {
      if (done || dead || counting) return;
      const lm = res.multiHandLandmarks && res.multiHandLandmarks[0];
      fiveNow = !!lm && countFingers(lm) === 5;
      $('obbstat').textContent = !lm ? 'giơ ✋ bàn tay mở lên…' : !fiveNow ? 'xoè cả năm ngón tay ra nào ✋' : 'đúng rồi — giữ vững tay nhé…';
    }
    function paintHold(p) {
      p = Math.min(1, p);
      $('obbfill').style.width = p * 100 + '%';
      ob.style.setProperty('--obc', p);
      if (obVfx) obVfx.setCharge(p * 0.95);
    }
    function tick(now) {
      if (done || dead || counting) return;
      const dt = Math.min(100, now - lastTick);
      lastTick = now;
      const camOn = !!cam;
      const holdMs = camOn ? HOLD_MS : HOLD_NOVOICE_MS;
      const active = camOn ? fiveNow : pressing;
      held = active ? Math.min(held + dt, holdMs) : Math.max(0, held - dt * 2.2);
      paintHold(held / holdMs);
      if (held >= holdMs) { startCountdown(); return; }
      raf = requestAnimationFrame(tick);
    }
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
    const gatePanel = $('obbgate');
    gatePanel.onpointerdown = (e) => { pressing = true; gatePanel.setPointerCapture(e.pointerId); };
    gatePanel.onpointerup = gatePanel.onpointercancel = () => { pressing = false; };

    // ── 3-2-1 countdown → detonate: real vortex burst → auto-composited Kotopia scene → Pip's goodbye ──
    function flash() { const f = $('obbflash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
    // the CAMERA STREAM stays alive on purpose past trigger() — the Kotopia
    // scene captures one photo from the same live <video id="obcam"> right
    // before restyling it. Hands inference itself is abandoned once done=true
    // but its MediaPipe Camera wrapper keeps pumping frames into the video
    // element, which is all the capture needs.
    function stopCam() { if (cam) { try { cam.stop(); } catch {} cam = null; } }
    function startCountdown() {
      if (counting || done || dead) return;
      counting = true;
      paintHold(1);
      $('obbalt').classList.add('gone');
      const el = $('obbcount');
      el.classList.remove('gone');
      let n = 3;
      const step = () => {
        if (dead) return;
        if (n <= 0) { el.classList.add('gone'); trigger(); return; }
        el.textContent = String(n);
        el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
        n--;
        setTimeout(step, COUNT_STEP_MS);
      };
      step();
    }
    function trigger() {
      if (done || dead) return;
      done = true;
      cancelAnimationFrame(raf);
      if (obVfx) obVfx.burst();
      flash();
      setTimeout(playKotopiaScene, 350);
    }
    async function playKotopiaScene() {
      $('obbgate').classList.add('gone');
      const panel = $('obkoto');
      panel.classList.remove('gone');
      ob.classList.add('obb-koto-live'); // camera reads at full presence for this scene, not the gate's dim rune-circle backdrop
      const stat = document.createElement('div');
      stat.className = 'obb-kotostat';
      stat.id = 'obbkotostat';
      stat.textContent = '✦ Pip đang hoá phép cho tấm ảnh của bạn…';
      panel.appendChild(stat);
      let finished = false;
      const finishScene = () => {
        if (finished) return;
        finished = true;
        const sp = $('obbspirit'); sp.pause(); sp.classList.remove('on', 'corner');
        ob.classList.remove('obb-koto-live');
        stopCam();
        showPip();
      };
      ob._clipNext = finishScene; // obDevBye.act(1) skips straight to Pip

      // spirit-animal plate fills the wait — same screen-blended video
      // language as the node booth's play_effect(), full-bleed while casting
      const spirit = $('obbspirit');
      spirit.src = SPIRIT_CLIPS[Math.random() * SPIRIT_CLIPS.length | 0];
      spirit.play().catch(() => {});
      spirit.classList.add('on');

      try {
        const forced = window.__obbForceDataUrl; // dev hook: obDevBye.previewSpirit() sets this to skip the paid call entirely
        window.__obbForceDataUrl = null; // one-shot — a later real trigger this mount must hit the real API
        const dataUrl = forced || capturePhoto();
        // PRESERVE the original camera capture — every downstream step (crop,
        // corner-bake) works off copies, this stays untouched. Kept both
        // in-memory (obDevBye.lastCapture) and downloaded, so a paid restyle
        // call never has to be repeated just to recover the source photo.
        window.__obbLastCapture = dataUrl;
        downloadDataUrl(dataUrl, 'kotopia-goc-camera.jpg');
        let b64, mediaType;
        if (forced) {
          await new Promise((r) => setTimeout(r, 900)); // fake a brief "casting" beat so the spirit clip is visible in preview too
          [mediaType, b64] = [dataUrl.slice(5, dataUrl.indexOf(';')), dataUrl.slice(dataUrl.indexOf(',') + 1)];
        } else {
          const res = await fetch('/api/restyle-photo', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            // aspect_ratio is NOT optional here — seedream-4.5's image-to-image
            // defaults to a square output regardless of the source photo's
            // aspect or prose like "landscape" in the prompt (confirmed live,
            // 2026-07-30: a 16:9-captured photo still came back square without
            // this param). serve.py forwards it straight through if present.
            body: JSON.stringify({ image: dataUrl, prompt: RESTYLE_PROMPT, aspect_ratio: '16:9' }),
          });
          const j = await res.json();
          if (dead || finished) return;
          if (!j.ok) throw new Error(j.error || 'restyle failed');
          b64 = j.b64; mediaType = j.mediaType || 'image/png';
        }
        if (dead || finished) return;
        const raw = new Image();
        const rawDataUrl = `data:${mediaType};base64,${b64}`;
        await new Promise((res, rej) => { raw.onload = res; raw.onerror = rej; raw.src = rawDataUrl; });
        if (dead || finished) return;
        // PRESERVE the model's original response too, BEFORE cropLandscape
        // trims it — same reasoning as the camera capture above.
        window.__obbLastRestyleRaw = rawDataUrl;
        downloadDataUrl(rawDataUrl, 'kotopia-ai-goc-vuong.png');
        // seedream-4.5 ignores aspect_ratio for edits and always returns a
        // square (confirmed live, 2026-07-30: a landscape source + explicit
        // aspect_ratio:'16:9' still came back 2048x2048) — crop to 16:9
        // ourselves rather than depend on an API flag that doesn't work here.
        const img = cropLandscape(raw);
        img.className = 'obb-kotoimg';
        stat.remove();
        panel.appendChild(img);
        spirit.classList.add('corner'); // shrink to a small looping accent — stays alive, doesn't vanish (z-index above the photo, see saga.css)
        setTimeout(() => { if (!finished) spawnPipFly(panel); }, PIPFLY_AT);

        // Bake ONE frame of the spirit clip into the same bottom-right corner
        // circle as the on-screen live accent (2026-07-30, owner: "spirit
        // animal should be in the corner") — the corner video keeps animating
        // live on screen, but a still PNG can't hold that, so the download
        // gets a single screen-blended frame in the same spot instead.
        const dlUrl = bakeCorner(img, spirit);
        const actions = document.createElement('div');
        actions.className = 'obb-kotoactions';
        // HOLD on the picture (2026-07-30, owner: "pause at the picture, it's
        // good enough") — no auto-timeout; the player taps to continue.
        const go = document.createElement('button');
        go.className = 'obb-kotogo';
        go.textContent = '✦ chạm để tiếp tục';
        go.onclick = finishScene;
        const dl = document.createElement('a');
        dl.className = 'obb-kotogo obb-kotodl';
        dl.textContent = '⬇ tải ảnh';
        dl.href = dlUrl;
        dl.download = 'kotopia-tam-biet.png';
        actions.append(dl, go);
        panel.appendChild(actions);
        dl.click(); // auto-download too (owner: "tự động down cũng được") — the explicit link stays for a manual re-download
      } catch (e) {
        console.warn('[onboard-bye] Kotopia restyle failed, skipping to Pip:', e);
        finishScene();
        return;
      }
    }
    // Crops an arbitrary-aspect image down to CAM_W:CAM_H (16:9). Vertical
    // crops (the square-source case) bias toward keeping the TOP — a selfie-
    // style capture usually has the face+sky in the upper 2/3 and safely
    // croppable torso/background below — trimming 35% of the excess off the
    // top and 65% off the bottom. Returns a canvas (already the right size,
    // so a plain 100%-stretch in CSS shows it undistorted).
    function cropLandscape(img) {
      const targetAR = CAM_W / CAM_H;
      const iw = img.naturalWidth, ih = img.naturalHeight, curAR = iw / ih;
      let sx = 0, sy = 0, sw = iw, sh = ih;
      if (curAR > targetAR) { sw = ih * targetAR; sx = (iw - sw) / 2; }
      else if (curAR < targetAR) { sh = iw / targetAR; sy = (ih - sh) * 0.35; }
      const c = document.createElement('canvas');
      c.width = Math.round(sw); c.height = Math.round(sh);
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
      return c;
    }
    // Composite the restyled photo + one screen-blended frame of the spirit
    // clip into a bottom-right circle — same position/size as the CSS
    // .obb-spirit.corner accent (saga.css), so the still download matches
    // what's on screen. Returns a PNG data URL. `img` is a canvas (from
    // cropLandscape) or an <img> — either works with .width/.height.
    function bakeCorner(img, spiritVideo) {
      const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0, w, h);
      const r = Math.min(w, h) * 0.17;
      const cx = w * (1 - 0.04) - r, cy = h * (1 - 0.05) - r; // mirrors bottom:5%;right:4% + half the 34% diameter
      if (spiritVideo.videoWidth) {
        x.save();
        x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.closePath(); x.clip();
        x.globalCompositeOperation = 'screen';
        const vw = spiritVideo.videoWidth, vh = spiritVideo.videoHeight, d = r * 2;
        const s = Math.max(d / vw, d / vh), dw = vw * s, dh = vh * s;
        x.drawImage(spiritVideo, cx - r - (dw - d) / 2, cy - r - (dh - d) / 2, dw, dh);
        x.restore();
      }
      return c.toDataURL('image/png');
    }
    // Silent auto-download — used to PRESERVE intermediate artifacts (raw
    // camera capture, raw AI response) that would otherwise only exist as
    // in-memory data URLs, gone the moment the mount is destroyed/replayed.
    function downloadDataUrl(dataUrl, filename) {
      const a = document.createElement('a');
      a.href = dataUrl; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
    }
    function capturePhoto() {
      const cam = $('obcam'), w = cam.videoWidth || 640, h = cam.videoHeight || 480;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d');
      x.translate(w, 0); x.scale(-1, 1); // mirror to match what the player sees of themself
      x.filter = 'brightness(1.05) saturate(1.08) contrast(.98)'; // same light beauty pass as photo-booth.js's #capturePhoto
      x.drawImage(cam, 0, 0, w, h);
      return c.toDataURL('image/jpeg', 0.88);
    }
    function spawnPipFly(panel) {
      const p = document.createElement('div');
      p.className = 'obb-pipfly';
      p.style.setProperty('--pipimg', `url(${PIP_IMG})`);
      panel.appendChild(p);
      void p.offsetWidth;
      p.classList.add('go');
      p.addEventListener('animationend', () => p.remove());
    }
    function showPip() {
      if (dead) return;
      flash();
      $('obkoto').classList.add('gone');
      $('obbpip').classList.remove('gone');
      setTimeout(() => {
        $('obbav').classList.remove('gone');
        $('obbav').classList.add('arrive');
        $('obbavname').classList.remove('gone');
        setTimeout(() => { $('obbbub').classList.remove('gone'); speak(0); }, 900);
      }, 420);
    }
    function speak(i) {
      const span = $('obbtxt'), text = LINES[i];
      let n = 0, timer, finished = false;
      const fin = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        span.textContent = text;
        if (i + 1 < LINES.length) setTimeout(() => speak(i + 1), 1700);
        else $('obbgo').classList.remove('gone');
      };
      const tick2 = () => {
        span.textContent = text.slice(0, ++n);
        if (n >= text.length) { fin(); return; }
        const ch = text[n - 1], nx = text[n];
        timer = setTimeout(tick2, ch === '\n' || (PAUSE_CH.includes(ch) && (nx === ' ' || nx === '\n')) ? PAUSE_MS : TYPE_MS);
      };
      timer = setTimeout(tick2, TYPE_MS);
      $('obbpip').onclick = fin;
    }
    $('obbgo').onclick = () => {
      ob.classList.add('bye');
      setTimeout(() => ob.remove(), 600);
      onDone && onDone();
    };

    function destroy() { dead = true; cancelAnimationFrame(raf); stopCam(); ob.remove(); }
    const inst = { destroy, trigger, el: ob };
    window.obDevBye = {
      trigger: startCountdown,
      hold: paintHold,
      act: (n) => { if (n >= 1) ob._clipNext ? ob._clipNext() : trigger(); },
      // FREE preview — verifies the spirit-clip screen-blend over the camera
      // and the corner-accent layering WITHOUT calling the paid restyle API
      // (it reuses the raw camera capture as a stand-in "restyled" photo).
      // Use this to check any blend/layering change before spending real
      // API calls on it.
      previewSpirit: () => { window.__obbForceDataUrl = capturePhoto(); startCountdown(); },
      // PRESERVED intermediates (see downloadDataUrl call sites) — inspect
      // without re-downloading: obDevBye.lastCapture / .lastRestyleRaw
      get lastCapture() { return window.__obbLastCapture || null; },
      get lastRestyleRaw() { return window.__obbLastRestyleRaw || null; },
    };
    return inst;
  }

  return { mount };
})();
