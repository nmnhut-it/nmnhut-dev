// onboard.js — the Kotopia cold-open, as a mountable module (`Onboard.mount`).
// ACT 1: fall-into-Kotopia cutscene (clips are hard-capped per shot — never
// wait on `ended` alone; a stalled/missing clip must not strand onboarding).
// ACT 2: the "CODE!" gate — hold ✋ open palm (charges to a 70% ceiling)
// AND chant the spell; SpeechRecognition alternates vi-VN/en-US per restart
// cycle (Chrome allows one live session) and transcripts are word-matched by
// engine/chant-match.js ("code"/"khô"/"khâu" all pass). No mic
// → palm-only (longer hold, no ceiling). No camera → press-and-HOLD the word.
// ACT 3: blast → the circle's dust forms Pip (his reveal) → intro → map.
// The saga map auto-mounts once per player (localStorage 'magicdust.onboard');
// lessons/onboard.html mounts with force:true as the always-replayable dev
// harness (no flag write). Dev: obDev.five()/chant(text)/act(n)/hold(p).
window.Onboard = (() => {
  const KEY = "magicdust.onboard",
    TYPE_MS = 16,
    PAUSE_MS = 460,
    PAUSE_CH = ".!?…:";
  const HOLD_MS = 900,
    HOLD_NOVOICE_MS = 1600,
    VOICE_CAP = 0.7,
    ARM_MIN = 0.3,
    CHANT_GRACE_MS = 1500;
  const CHANT = "CODE"; // the chant IS the name of the magic — yelled "code"/"khô"/"khâu"
  // ACT 1 = ONE continuous 10s fall-in clip (Phase B, Veo one-shot: room →
  // portal → tunnel → Kotopia sky → white flash); captions swap on a clock
  // over the single take. The clip's own ending white-out hands off into the
  // gate's flash, so the cut reads as one motion.
  const ACT1 = {
    src: "assets/cutscenes/act1-oneshot.mp4",
    capMs: 11500,
    caps: [
      { at: 300, text: "Ơ kìa… màn hình vừa nở ra một VÒNG TRÒN PHÉP!" },
      { at: 3600, text: "Bạn đang bị hút giữa hai thế giới — bám chắc nhé!" },
      { at: 7000, text: "Kia là KOTOPIA — nơi Mật Ngữ chính là phép thuật." },
    ],
  };
  // Pip's intro: only NEW beats — the cutscene captions already covered "you
  // fell into Kotopia / Mật Ngữ is magic", so the reveal reacts to the blast
  // the kid just made and lands the partnership + quest hook, nothing more.
  const LINES = [
    "Phù! Hô to dữ ha — nổ tung cả vòng tròn phép luôn kìa!",
    "Pip đây. Bụi phép chính hiệu, thuộc đường khắp Kotopia. Còn bạn có thứ mà cả vương quốc này đang thiếu: ĐÔI TAY.",
    "Muốn về nhà chứ gì? Theo Pip. Vừa đi vừa học Mật Ngữ — đi tới đâu, thắp sáng tới đó!",
  ];
  // Keyed on `self.__mdScriptLoads` — shared page-wide with camera-engine.js's
  // own loadScript (see its comment) so this legacy onboarding flow and the
  // node shell's CameraEngine never both inject the same MediaPipe <script>
  // and crash the AMD loader with "Can only have one anonymous define call".
  const loadScript = (src) => {
    self.__mdScriptLoads ||= {};
    return (self.__mdScriptLoads[src] ||= new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    }));
  };
  // same landmark math as the node shell's camera panel
  const FT_EXT = 0.55,
    TH_RATIO = 1.12;
  const handSize = (lm) =>
    Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || 0.001;
  const ext = (lm, pip, tip) =>
    Math.max(0, Math.min(1, ((lm[pip].y - lm[tip].y) / handSize(lm)) * 4.5));
  const thumbUp = (lm) =>
    Math.hypot(lm[4].x - lm[17].x, lm[4].y - lm[17].y) >
    Math.hypot(lm[2].x - lm[17].x, lm[2].y - lm[17].y) * TH_RATIO;
  const countFingers = (lm) =>
    (ext(lm, 6, 8) > FT_EXT) +
    (ext(lm, 10, 12) > FT_EXT) +
    (ext(lm, 14, 16) > FT_EXT) +
    (ext(lm, 18, 20) > FT_EXT) +
    thumbUp(lm);

  function mount({ force = false, onDone } = {}) {
    const ob = document.createElement("div");
    ob.id = "ob";
    ob.innerHTML = `
      <video id="obcam" playsinline muted></video>
      <div class="obin" id="obcut">
        <video id="obcutvid" playsinline autoplay muted></video>
        <div class="obsub" id="obcutcap"></div>
        <button class="obalt obskip" id="obskip">chạm để tiếp tục ▶</button>
      </div>
      <div class="obin gone" id="obgate">
        <div class="obword" id="obword"></div>
        <div class="obsub" id="obstat">…</div>
        <div class="obgauge"><i id="obfill"></i></div>
        <canvas id="obmeter" width="230" height="26"></canvas>
        <div class="obhear" id="obhear"></div>
        <div class="obalt" id="obalt">✋ giơ bàn tay mở lên trước vòng tròn phép</div>
      </div>
      <div class="obin gone" id="obpip">
        <div class="obavatar gone" id="obav"></div>
        <div class="obavname gone" id="obavname">✦ PIP ✦</div>
        <div class="obbubble gone" id="obbub"><b>Pip</b><span id="obtxt"></span></div>
        <button class="start obgo gone" id="obgo">✦ LET'S GO</button>
      </div>
      <div class="obflash" id="obflash"></div>`;
    document.body.appendChild(ob);
    const $ = (id) => ob.querySelector("#" + id);
    $("obword").innerHTML = CHANT.split("")
      .map((c) => `<span>${c}</span>`)
      .join("");
    const letters = [...$("obword").children];

    let done = false,
      dead = false,
      cam = null,
      voice = null,
      meter = null,
      obVfx = null,
      CM = null;
    let held = 0,
      fiveNow = false,
      pressing = false,
      lastChant = -1e9,
      lastTick = 0,
      raf = 0;
    const voiceOn = () => !!(voice && voice.active);

    // ── ACT 1 — one continuous clip; timed captions; tap/skip/error/`ended`
    // all advance, and a hard cap means a stalled clip never strands onboarding ──
    (function cutscene() {
      const vid = $("obcutvid"),
        cap = $("obcutcap");
      const timers = [];
      const fin = () => {
        timers.forEach(clearTimeout);
        if (!dead) showGate();
      };
      vid.src = ACT1.src;
      vid.onended = fin;
      vid.onerror = fin;
      vid.play().catch(() => {}); // autoplay can still be blocked pre-interaction — the cap timer advances regardless
      for (const c of ACT1.caps)
        timers.push(
          setTimeout(() => {
            cap.textContent = c.text;
          }, c.at),
        );
      timers.push(setTimeout(fin, ACT1.capMs));
      $("obskip").onclick = fin;
      vid.onclick = fin;
      ob._cutNext = fin; // act(2) jumps here
    })();

    // ── ACT 2 — the chant gate ──
    function showGate() {
      if (done || dead || !$("obgate").classList.contains("gone")) return;
      $("obcut").classList.add("gone");
      $("obgate").classList.remove("gone");
      flash(); // the white-out of the fall dissolves into the live camera
      import("./engine/chant-match.js")
        .then((m) => {
          CM = m;
        })
        .catch(() => {});
      loadScript("./ritual-vortex.js")
        .then(() => {
          if (!dead) obVfx = RitualVortex.mount(ob, { cy: 0.45 });
        })
        .catch(() => {});
      startCam();
      // 2026-07-04 (owner): SpeechRecognition removed from the CODE! gate —
      // SR is blocked on the deployment machines (and missed real yells in
      // live tests), so the palm-hold IS the gate now: `voice` is never set,
      // voiceOn() stays false, and tick()'s no-voice path (full hold over
      // HOLD_NOVOICE_MS) is the one true path. The chant plumbing
      // (chanted/lastChant + obDev.chant) is kept for dev/tests only.
      const cvm = $("obmeter");
      if (cvm) cvm.style.display = "none";
      lastTick = performance.now();
      raf = requestAnimationFrame(tick);
      // press-and-hold the word = the no-camera path (same charge, same pace)
      const w = $("obword");
      w.onpointerdown = (e) => {
        pressing = true;
        w.setPointerCapture(e.pointerId);
      };
      w.onpointerup = w.onpointercancel = () => {
        pressing = false;
      };
    }
    function paintHold(p) {
      p = Math.min(1, p);
      $("obfill").style.width = p * 100 + "%";
      ob.style.setProperty("--obc", p);
      letters.forEach((el, i) =>
        el.classList.toggle("lit", i < Math.round(p * letters.length)),
      );
      if (obVfx) obVfx.setCharge(p * 0.95);
    }
    function tick(now) {
      if (done || dead) return;
      const dt = Math.min(100, now - lastTick);
      lastTick = now; // capped dt: a background-tab pause can't dump a huge hold
      const vOn = voiceOn(),
        holdMs = vOn ? HOLD_MS : HOLD_NOVOICE_MS,
        cap = vOn ? VOICE_CAP : 1;
      held =
        fiveNow || pressing
          ? Math.min(held + dt, cap * holdMs)
          : Math.max(0, held - dt * 2.2);
      const p = held / holdMs;
      paintHold(p);
      if (p >= ARM_MIN && now - lastChant < CHANT_GRACE_MS) {
        pass();
        return;
      } // chant lands while the palm is charged
      if (!vOn && held >= holdMs) {
        pass();
        return;
      } // no-voice fallback: a longer full hold
      raf = requestAnimationFrame(tick);
    }
    function onHands(res) {
      if (done || dead) return;
      const lm = res.multiHandLandmarks && res.multiHandLandmarks[0];
      fiveNow = !!lm && countFingers(lm) === 5;
      const vOn = voiceOn(),
        p = held / (vOn ? HOLD_MS : HOLD_NOVOICE_MS);
      $("obstat").textContent = !lm
        ? "giơ ✋ bàn tay mở lên trước vòng tròn phép…"
        : !fiveNow
          ? "xoè cả năm ngón tay ra nào ✋"
          : "đúng rồi — giữ vững tay nhé…";
    }
    async function startCam() {
      try {
        if (!(self.Hands && self.Camera)) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
          );
          await loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
          );
        }
        if (dead) return;
        const hands = new self.Hands({
          locateFile: (f) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
          selfieMode: false,
        });
        hands.onResults(onHands);
        const v = $("obcam");
        cam = new self.Camera(v, {
          onFrame: async () => {
            await hands.send({ image: v });
          },
          width: 480,
          height: 360,
        });
        await cam.start();
        ob.classList.add("live");
      } catch {
        $("obstat").textContent =
          "không thấy camera — chạm và GIỮ dòng chữ phép nhé!";
      }
    }
    // Voice + mic meter are engine/ modules now (voice-gate.js / mic-meter.js
    // — dynamically imported in showGate, reusable by lesson gates). Here we
    // only keep the display feed + event log pipe.
    const heard = []; // running SR event log (obDev.heard)
    function setHear(txt, hit) {
      const h = $("obhear");
      if (h) {
        h.textContent = txt;
        h.classList.toggle("hit", !!hit);
      }
    }
    function srLog(msg) {
      // one pipe for EVERY SR event: log buffer + console + a window event the harness panel listens to
      heard.push(msg);
      if (heard.length > 40) heard.shift();
      console.log("[SR]", msg);
      try {
        window.dispatchEvent(new CustomEvent("ob:sr", { detail: msg }));
      } catch {}
    }
    function chanted() {
      lastChant = performance.now();
    } // consumed by tick() while the palm is charged

    // ── ACT 3 — blast + Pip forms from the dust ──
    function flash() {
      const f = $("obflash");
      f.classList.remove("go");
      void f.offsetWidth;
      f.classList.add("go");
    }
    function pass() {
      if (done || dead) return;
      done = true;
      cancelAnimationFrame(raf);
      stopIO();
      paintHold(1);
      if (obVfx) obVfx.burst(); // the charged circle detonates…
      flash();
      setTimeout(() => {
        $("obgate").classList.add("gone");
        $("obpip").classList.remove("gone");
        setTimeout(() => {
          // dark beat, then the dust settles into Pip:
          $("obav").classList.remove("gone");
          $("obav").classList.add("arrive"); // pop-in + shockwave ring (CSS obpop/obring)
          $("obavname").classList.remove("gone"); // name flare rides the same beat
          setTimeout(() => {
            $("obbub").classList.remove("gone");
            speak(0);
          }, 900);
        }, 420);
      }, 350);
    }
    function stopIO() {
      if (cam) {
        try {
          cam.stop();
        } catch {}
        cam = null;
      }
      if (voice) {
        voice.stop();
        voice = null;
      }
      if (meter) {
        meter.stop();
        meter = null;
      }
    }
    function speak(i) {
      const span = $("obtxt"),
        text = LINES[i];
      let n = 0,
        timer,
        finished = false;
      const fin = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        span.textContent = text;
        if (i + 1 < LINES.length) setTimeout(() => speak(i + 1), 1700);
        else $("obgo").classList.remove("gone");
      };
      const tick = () => {
        span.textContent = text.slice(0, ++n);
        if (n >= text.length) {
          fin();
          return;
        }
        const ch = text[n - 1],
          nx = text[n];
        timer = setTimeout(
          tick,
          ch === "\n" || (PAUSE_CH.includes(ch) && (nx === " " || nx === "\n"))
            ? PAUSE_MS
            : TYPE_MS,
        );
      };
      timer = setTimeout(tick, TYPE_MS);
      $("obpip").onclick = fin;
    }
    function destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      stopIO();
      ob.remove();
    }
    $("obgo").onclick = () => {
      if (!force) localStorage.setItem(KEY, "1");
      ob.classList.add("bye");
      setTimeout(() => ob.remove(), 600);
      onDone && onDone();
    };

    const inst = { destroy, pass, el: ob };
    window.obDev = {
      // test hooks (old five()/hold() kept)
      five: pass,
      hold: paintHold,
      heard, // obDev.heard = last transcripts/errors, for console debugging
      chant: (t) => {
        const s = t == null ? CHANT : t,
          hit = !CM || CM.matchChant(s);
        setHear(`🎤 (giả lập): "${s}"${hit ? " ✦ TRÚNG!" : ""}`, hit);
        if (hit) {
          lastChant = performance.now();
          held = Math.max(
            held,
            ARM_MIN * (voiceOn() ? HOLD_MS : HOLD_NOVOICE_MS) + 1,
          );
        }
      },
      act: (n) => {
        if (n >= 2) ob._cutNext && ob._cutNext();
        if (n >= 3) pass();
      },
    };
    return inst;
  }

  // auto-run on the saga map (onboard.html mounts explicitly via data-manual)
  const manual =
    document.currentScript && document.currentScript.dataset.manual != null;
  if (!manual) {
    if (!localStorage.getItem(KEY)) mount();
  }
  if (window.saga)
    saga.reonboard = () => {
      localStorage.removeItem(KEY);
      location.reload();
    };
  return { mount, KEY };
})();
