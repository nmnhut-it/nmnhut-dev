// Ritual vortex — the REAL particle engine (canvas-2D port of the root app's
// whirlpool motes, src/main.js): the same gather → back-eased collapse → 1/r
// differential-spin funnel math, driven by a charge (0..1). Ambient dust
// drifts while idle; charge winds the field into the vortex (and it breathes
// back out if it decays); burst() flings it outward as dying embers.
// Single engine, remountable: mount(host, opts) moves it (ritual overlay by
// default; Node 1's photo booth mounts it over the camera panel).
// opts: { circle:true, ambient:1, cy:.46, density:1 } — circle=false hides
// the magic circle, ambient fades the idle dust (booth starts at 0 until
// conjure()), density<1 thins the ambient glyph-dust count (fullscreen
// showcases only — the owner-flagged "phèn" glyph storm; burst/summoned
// motes are never thinned).
// API: mount() → { setCharge(c), setAmbient(a), burst(), stop(), canvas }.
window.RitualVortex = (() => {
  const COUNT = 520, TAU = Math.PI * 2, SPRITE = 64;
  // Whirlpool params — identical to src/main.js so the funnel reads the same:
  // VORTEX_AT splits charge into gather/vortex, spin is 1+SWIRL_K/r differential
  // (inner motes whip faster → funnel, not spokes), BACK eases the collapse with
  // an outward anticipation breath before the snap into the core.
  const VORTEX_AT = .4, OMEGA = 6.2, SWIRL_K = 150, RMIN = 6;
  const SPIN_JIT = .5, SPIN_FLOOR = .12, BACK = 1.3, GATHER_SWELL = 2, CORE_TIGHTEN = .6;
  const LIFE_MIN = 3, LIFE_SPAN = 4, BIRTH_SEC = .4, DEATH_FRAC = .25;  // ambient dust cycles: soft in, drift, soft out, respawn at a fresh spot
  const GRAV = 260, EMBER_DRAG = 3.6, BURST_SPEED = [140, 560];         // seal burst, in px/s
  const AMBIENT = [.5, .72, 1];                                         // cool cyan-white, matching the root float phase
  // Magic circle v2 — modeled on the anime summoning-circle reference (user-
  // picked frame, see ONBOARD-PLAN 2026-07-04): outer double ring carrying a
  // rune band + glyph MEDALLIONS, inner counter-rotating rune band, and a
  // HEXAGRAM (two overlapping triangles). Every band spins at a CONSTANT rate
  // (the old drift-and-realign triangles read as janky), all speeding up
  // together with charge. The circle IGNITES sequentially as charge builds —
  // rings inscribe themselves, runes light one by one sweeping around the
  // band, the hexagram strokes itself in, the core blooms last — so holding
  // the sign reads as "the spell writes itself".
  const RUNES = [...'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛉᛊᛏᛒᛖᛗᛟ'], RUNE_FONT = '"Segoe UI Historic","Segoe UI Symbol",serif';
  const RUNE_O = 18, RUNE_I = 12, MEDS = 6;                              // outer band · inner band · glyph medallions
  const W_O = .14, W_I = -.2, W_T = .05;                                 // band spins, rad/s (constant; charge scales them evenly)

  const rad0 = new Float32Array(COUNT), dir = new Float32Array(COUNT), spin = new Float32Array(COUNT);
  const bri = new Float32Array(COUNT), phase = new Float32Array(COUNT), sz = new Float32Array(COUNT);
  const life = new Float32Array(COUNT), max = new Float32Array(COUNT);
  const px = new Float32Array(COUNT), py = new Float32Array(COUNT), vx = new Float32Array(COUNT), vy = new Float32Array(COUNT);
  const mode = new Uint8Array(COUNT);                                   // 0 = orbit dust · 1 = FREE (palm-summoned, root-app style)
  const EMIT_SPEED = [40, 120], SUMMON_LIFE = [2, 4], BIRTH_FLASH = 1.6; // summoned motes: outward pour, finite life, punchy conjure flash
  let emitPtr = 0;

  const sprite = document.createElement('canvas'); sprite.width = sprite.height = SPRITE;
  const sctx = sprite.getContext('2d');
  // Ambient dust = FLOATING GLYPHS (user-directed: "các kí tự nổi trôi", not
  // pixel dots) — thematically the words of Mật Ngữ drifting loose until the
  // charge winds them into the spell. Rendered via a tiny sprite atlas (one
  // small canvas per glyph, retinted with the frame color) so the per-mote
  // cost stays a drawImage. Palm-poured motes (mode 1) remain spark dots.
  const GLY_N = 12, GLY = 40;
  const glyphCv = Array.from({ length: GLY_N }, () => { const c = document.createElement('canvas'); c.width = c.height = GLY; return c; });
  let glyphChars = [];
  const gi = new Uint8Array(COUNT);
  let cv = null, ctx = null, raf = 0, last = 0, t = 0, charge = 0, burstT = 0, burstFired = false, spell = AMBIENT;
  let pixel = false; const PX = 3;                                      // fx-pixel theme: chunky retro squares snapped to a PX grid
  let circleOn = true, cy0 = .46, amb = 1, ambT = 1, spread = 1, dens = 1; // per-mount options: magic circle, funnel centre, ambient dust level, dust radius ×, ambient glyph density ×
  let thO = 0, thI = 0, thT = 0, ign = 0;                                // band angles (integrated so charge can speed them evenly) + ignition progress
  let runeGO = [], runeGI = [], medG = [];                               // fixed glyphs per mount — the bands rotate as one plate, no per-rune orbits

  function hexToRgb01(hex) { const h = hex.replace('#', '').trim(); const n = parseInt(h.length === 3 ? [...h].map(c => c + c).join('') : h, 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
  // One soft round glow dot, retinted per frame (color is global: it depends
  // only on charge/burst, so one sprite serves every mote — cheap additive draw).
  function paintSprite(r, g, b) {
    sctx.clearRect(0, 0, SPRITE, SPRITE);
    const css = a => `rgba(${Math.min(255, r * 255) | 0},${Math.min(255, g * 255) | 0},${Math.min(255, b * 255) | 0},${a})`;
    if (pixel) {                                                        // hard-edged square: colored rim + white core, no gradient
      sctx.fillStyle = css(.8); sctx.fillRect(0, 0, SPRITE, SPRITE);
      sctx.fillStyle = 'rgba(255,253,245,.9)'; sctx.fillRect(SPRITE / 4, SPRITE / 4, SPRITE / 2, SPRITE / 2);
      return;
    }
    const grad = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    grad.addColorStop(0, 'rgba(255,253,245,.9)'); grad.addColorStop(.25, css(.85)); grad.addColorStop(1, css(0));
    sctx.fillStyle = grad; sctx.fillRect(0, 0, SPRITE, SPRITE);
  }
  // Retint the glyph atlas: colored glow pass + white core pass per character.
  function paintGlyphs(r, g, b) {
    const css = a => `rgba(${Math.min(255, r * 255) | 0},${Math.min(255, g * 255) | 0},${Math.min(255, b * 255) | 0},${a})`;
    for (let k = 0; k < GLY_N; k++) {
      const g2 = glyphCv[k].getContext('2d'); g2.clearRect(0, 0, GLY, GLY);
      g2.font = `${Math.round(GLY * .72)}px ${RUNE_FONT}`; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.shadowColor = css(1); g2.shadowBlur = pixel ? 0 : GLY * .22;
      g2.fillStyle = css(.95); g2.fillText(glyphChars[k], GLY / 2, GLY / 2);
      g2.shadowBlur = 0; g2.fillStyle = 'rgba(255,253,245,.55)'; g2.fillText(glyphChars[k], GLY / 2, GLY / 2);
    }
  }
  function seed(i, maxR, fresh) {
    rad0[i] = RMIN + Math.pow(Math.random(), .7) * maxR; dir[i] = Math.random() * TAU;
    spin[i] = 1 + (Math.random() - .5) * SPIN_JIT;                      // per-mote spread desyncs same-radius motes → churn, not rings
    bri[i] = .7 + Math.random() * .6; phase[i] = Math.random() * TAU; sz[i] = 1.4 + Math.random() * 2.6;
    life[i] = fresh ? Math.random() * (LIFE_MIN + LIFE_SPAN) : 0; max[i] = LIFE_MIN + Math.random() * LIFE_SPAN;
    gi[i] = Math.random() * GLY_N | 0;
  }
  // The magic circle: see the v2 layout note above. `ign` eases toward the
  // charge; every element owns an ignition threshold s — its brightness is
  // ghost (faint full structure, always visible) + el(P,s) (its turn to light
  // up), with a white-hot pop as it crosses. Rings and triangles reveal as
  // partial strokes so they read as being INSCRIBED, not faded in.
  const sstep = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
  const el = (P, s, w = .1) => sstep((P - s) / w);
  function drawCircle(cx, cy, dt, c, coll, f, r, g, b) {
    ign += ((burstFired ? 1 : Math.min(1, c * 1.12)) - ign) * Math.min(1, dt * 4.5);
    const P = burstFired ? 1 : ign, ghost = burstFired ? 0 : .13 + .04 * Math.sin(t * .8);
    const master = burstFired ? f * 1.2 : 1; if (master <= .01) return;
    const glowK = theme.glow, R = Math.min(cv.width, cv.height) * .3 * theme.scale * (1 - .12 * Math.max(0, coll)) * (1 + .35 * (burstFired ? 1 - f : 0));
    const col = `rgba(${Math.min(255, r * 255) | 0},${Math.min(255, g * 255) | 0},${Math.min(255, b * 255) | 0},1)`;
    ctx.strokeStyle = ctx.fillStyle = col; ctx.shadowColor = col;
    ctx.shadowBlur = pixel ? 0 : 14 * glowK * (.4 + .6 * P + f); ctx.lineWidth = pixel ? 2 : 1.3; // pixel theme: crisp strokes, no bloom
    const spd = (.25 + 2.2 * c * c) * theme.circle.spin;                 // charge winds every band up TOGETHER — rotation stays even; theme.circle.spin scales the whole plate
    thO += W_O * spd * dt; thI += W_I * spd * dt; thT += W_T * spd * dt;
    const A = e => { ctx.globalAlpha = master * Math.min(1, ghost + (1.02 - ghost) * e + e * (1 - e) * 1.2); }; // e·(1-e) = white-hot pop while crossing
    const ring = (rr, s, dash) => {                                      // ghost full circle + bright arc inscribing itself clockwise from the top
      if (dash) ctx.setLineDash([3, 8]);
      A(0); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke();
      const u = el(P, s, .16); if (u > 0) { A(u); ctx.beginPath(); ctx.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + TAU * u); ctx.stroke(); }
      if (dash) ctx.setLineDash([]);
    };
    const poly = (sides, rot, s) => {                                    // ghost n-gon + bright edges stroking themselves in, vertex to vertex (sides=3 → the original triangle)
      const p = Array.from({ length: sides }, (_, j) => { const a = rot + TAU * j / sides - Math.PI / 2; return [cx + Math.cos(a) * R * .62, cy + Math.sin(a) * R * .62]; });
      A(0); ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (let j = 1; j < sides; j++) ctx.lineTo(p[j][0], p[j][1]); ctx.closePath(); ctx.stroke();
      const u = el(P, s, .18); if (u <= 0) return;
      A(Math.min(1, u * 1.3)); ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      const full = Math.floor(u * sides), frac = u * sides - full;
      for (let j = 1; j <= full; j++) { const q = p[j % sides]; ctx.lineTo(q[0], q[1]); }
      if (full < sides) { const a2 = p[full % sides], b2 = p[(full + 1) % sides]; ctx.lineTo(a2[0] + (b2[0] - a2[0]) * frac, a2[1] + (b2[1] - a2[1]) * frac); }
      ctx.stroke();
    };
    const tri = (rot, s) => poly(3, rot, s);                             // kept as the hexagram's building block (two of these, offset 60°)
    const RINGS = theme.circle.rings;
    if (RINGS === 3) { ring(R, .02); ring(R * .90, .07); ring(R * .62, .14, true); ring(R * .54, .19); } // legacy exact shape (default theme)
    else { ring(R, .02); const n = Math.max(0, RINGS); for (let k = 0; k < n; k++) { const f2 = n === 1 ? 0 : k / (n - 1); ring(R * (.90 - f2 * .36), .07 + f2 * .12, k === Math.floor(n / 2)); } }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `${Math.round(R * .075)}px ${RUNE_FONT}`;
    for (let i = 0; i < RUNE_O; i++) {                                   // outer band: runes light ONE BY ONE, a wave sweeping around the ring
      const a = thO + TAU * i / RUNE_O, e = el(P, .08 + .5 * i / RUNE_O, .05);
      const x = cx + Math.cos(a) * R * .95, y = cy + Math.sin(a) * R * .95;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); A(e * (.85 + .15 * Math.sin(t * 2 + i))); ctx.fillText(runeGO[i], 0, 0); ctx.restore();
    }
    ctx.font = `${Math.round(R * .065)}px ${RUNE_FONT}`;
    for (let i = 0; i < RUNE_I; i++) {                                   // inner band: counter-rotating, its own lighting wave
      const a = thI + TAU * i / RUNE_I, e = el(P, .2 + .45 * i / RUNE_I, .05);
      const x = cx + Math.cos(a) * R * .58, y = cy + Math.sin(a) * R * .58;
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); A(e * (.85 + .15 * Math.sin(t * 2 + i * 2))); ctx.fillText(runeGI[i], 0, 0); ctx.restore();
    }
    for (let i = 0; i < MEDS; i++) {                                     // glyph medallions riding the outer ring
      const a = thO + TAU * i / MEDS, e = el(P, .3 + .45 * i / MEDS, .06);
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, mr = R * .085 * (1 + .25 * e * (1 - e) * 4);
      A(e); ctx.beginPath(); ctx.arc(x, y, mr, 0, TAU); ctx.stroke();
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2); ctx.font = `${Math.round(R * .09)}px ${RUNE_FONT}`; ctx.fillText(medG[i], 0, 0); ctx.restore();
    }
    const POLY = theme.circle.poly;                                     // 'triangle' → today's hexagram (2 triangles); square/penta → one n-gon; 'none' → skip
    if (POLY === 'triangle' || !POLY) { tri(thT, .55); tri(thT + Math.PI / 3, .66); } // the hexagram is RIGID: both triangles ride the same angle, one plate — counter-spinning them scissors the star apart over time (user caught this live)
    else if (POLY === 'square') poly(4, thT, .55);
    else if (POLY === 'penta') poly(5, thT, .55);
    const ce = el(P, .82, .12);                                          // the core blooms last, just before the seal
    A(ce); ctx.beginPath(); ctx.arc(cx, cy, R * .16, 0, TAU); ctx.stroke();
    if (ce > 0) { ctx.globalAlpha = master * ce * (.5 + .5 * Math.sin(t * 5)); ctx.beginPath(); ctx.arc(cx, cy, R * .05, 0, TAU); ctx.fill(); }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;                             // shadows off before the mote sprites (drawImage + shadow is slow)
  }
  function step(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
    amb += (ambT - amb) * Math.min(1, dt * 3);                          // ambient dust fades toward its target (booth: conjure() raises it)
    const w = cv.width, h = cv.height, cx = w * .5, cy = h * cy0, maxR = Math.min(w, h) * .44 * spread;
    ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
    const c = charge, gather = Math.min(1, c / VORTEX_AT), tt = Math.max(0, (c - VORTEX_AT) / (1 - VORTEX_AT));
    const coll = tt * tt * ((BACK + 1) * tt - BACK), spinEnv = SPIN_FLOOR + (1 - SPIN_FLOOR) * c * c;
    const gS = gather * gather * (3 - 2 * gather), swell = 1 + GATHER_SWELL * gS - CORE_TIGHTEN * Math.max(0, coll);
    const mix = Math.min(1, c / .4), f = burstT, hot = f * f * .9;      // ambient → spell colour across the gather; white-hot at burst birth
    const dustBase = theme.palette?.dust ? hexToRgb01(theme.palette.dust) : spell, runeBase = theme.palette?.rune ? hexToRgb01(theme.palette.rune) : spell;
    const cr = AMBIENT[0] + (dustBase[0] - AMBIENT[0]) * mix + hot, cg = AMBIENT[1] + (dustBase[1] - AMBIENT[1]) * mix + hot, cb = AMBIENT[2] + (dustBase[2] - AMBIENT[2]) * mix + hot;
    const rr2 = AMBIENT[0] + (runeBase[0] - AMBIENT[0]) * mix + hot, rg2 = AMBIENT[1] + (runeBase[1] - AMBIENT[1]) * mix + hot, rb2 = AMBIENT[2] + (runeBase[2] - AMBIENT[2]) * mix + hot;
    paintSprite(cr, cg, cb); paintGlyphs(cr, cg, cb);
    if (circleOn) drawCircle(cx, cy, dt, c, coll, f, rr2, rg2, rb2);
    for (let i = 0; i < COUNT; i++) {
      if (dens < 1 && burstT <= 0 && !mode[i] && (i / COUNT) >= dens) continue;   // showcase-only ambient thinning (opts.density) — a full-screen backdrop reads as noise at COUNT's normal density; burst/summoned motes are never thinned
      let x, y, a;
      if (burstT > 0) {                                              // BURST: dying-flame embers — fly out, drop, cool, fade
        vy[i] += GRAV * dt; const drag = Math.exp(-EMBER_DRAG * dt); vx[i] *= drag; vy[i] *= drag;
        px[i] += vx[i] * dt; py[i] += vy[i] * dt; x = px[i]; y = py[i];
        a = f * bri[i] * (.65 + .35 * Math.sin(t * 6 + phase[i] * 5));
      } else if (mode[i]) {                                             // FREE: palm-summoned dust — pours out, drifts, dies (root-app float)
        if (c > .05) {                                                  // a rising charge GRABS the summoned cloud into the funnel
          mode[i] = 0; const dx = px[i] - cx, dy = py[i] - cy;
          rad0[i] = Math.max(RMIN, Math.hypot(dx, dy)); dir[i] = Math.atan2(dy, dx);
          spin[i] = 1 + (Math.random() - .5) * SPIN_JIT; life[i] = 0; max[i] = LIFE_MIN + Math.random() * LIFE_SPAN;
          continue;
        }
        life[i] += dt;
        if (life[i] >= max[i]) { mode[i] = 0; seed(i, maxR, false); life[i] = max[i]; continue; } // died → back to a dormant orbit slot
        vx[i] += Math.sin(py[i] * .05 + t * .4 + phase[i]) * 9 * dt; vy[i] += (Math.cos(px[i] * .05 + t * .3 + phase[i]) * 9 - 14) * dt; // turbulence + slight buoyancy
        const dg = Math.exp(-.9 * dt); vx[i] *= dg; vy[i] *= dg;
        px[i] += vx[i] * dt; py[i] += vy[i] * dt; x = px[i]; y = py[i];
        const lf = life[i] / max[i], flash = Math.max(0, 1 - life[i] / BIRTH_SEC);
        a = (.5 + BIRTH_FLASH * flash * flash) * bri[i] * (.65 + .35 * Math.sin(t * 4 + phase[i] * 5))
          * Math.min(1, (1 - lf) / DEATH_FRAC);                         // conjure flash → settle → fade out at end of life
      } else {                                                          // ORBIT: ambient drift that the charge winds into the funnel
        if (c < .15) { life[i] += dt; if (life[i] >= max[i]) seed(i, maxR, false); } // dust only cycles while idle so the funnel never sheds motes mid-charge
        // Motion themes (§A) only reshape the IDLE drift (tt<=0, before the
        // vortex snap threshold) — once charging past VORTEX_AT every theme
        // converges on the same back-eased collapse, so the seal moment
        // always reads as one consistent funnel regardless of node theme.
        const mo = theme.motion;
        if (mo === 'rain' && tt <= 0) {                                 // idle: glyphs fall like rain, respawn at top
          py[i] += (70 + 90 * bri[i]) * dt;
          if (py[i] > h || py[i] < -20) { py[i] = -20 - Math.random() * h * .3; px[i] = cx + (Math.random() - .5) * maxR * 1.8; }
          x = px[i]; y = py[i];
        } else {
          let rt;
          if (mo === 'spiral-in' && tt <= 0) {                          // idle: dust winds inward continuously (not only at the vortex snap)
            rad0[i] = Math.max(RMIN, rad0[i] - maxR * .06 * dt);
            if (rad0[i] <= RMIN + 2) rad0[i] = maxR * (.5 + Math.random() * .5);
            rt = rad0[i];
          } else if (mo === 'comet' && tt <= 0) {                       // idle: 1-2 tight streams with trailing particles behind a moving head
            const stream = i & 1, head = t * 1.3 + stream * Math.PI;
            dir[i] = head - (i % 40) / 40 * 1.1; rt = maxR * (.3 + .55 * ((i * 53) % 29) / 29);
          } else {
            rt = Math.max(RMIN, rad0[i] * (1 - coll));                  // default/orbit/pulse radius envelope
          }
          dir[i] += OMEGA * spin[i] * spinEnv * (1 + SWIRL_K / rt) * dt; // differential spin: inner motes whip far faster → the whirlpool shear
          if (mo === 'pulse') rt *= 1 + .16 * Math.sin(t * 2.4 + phase[i]); // idle heartbeat: radius breathes on top of the normal envelope
          x = cx + Math.cos(dir[i]) * rt; y = cy + Math.sin(dir[i]) * rt;
        }
        px[i] = x; py[i] = y;
        const lf = life[i] / max[i], soft = Math.min(1, life[i] / BIRTH_SEC) * Math.min(1, (1 - lf) / DEATH_FRAC);
        a = (.28 + .72 * c) * bri[i] * (.7 + .3 * Math.sin(t * 5 + phase[i] * 7)) * soft
          * Math.max(amb, c);                                           // dust honours the ambient level, but a charge always pulls it visible
        if (mo === 'pulse') a *= 1 + .22 * Math.sin(t * 2.4 + phase[i] * .3); // heartbeat brightness on top of the radius breathe
      }
      a = (a || 0) * theme.glow;
      let s = sz[i] * swell * (1 + .7 * f) * theme.scale;
      if (pixel) { x = Math.round(x / PX) * PX; y = Math.round(y / PX) * PX; s = Math.max(PX, Math.round(s / PX) * PX) / 2 * 2; } // snap to the grid → retro shimmer as motes hop cells
      ctx.globalAlpha = Math.min(1, a);
      if (mode[i]) ctx.drawImage(sprite, x - s, y - s, s * 2, s * 2);     // palm-poured sparks stay glow dots
      else { const gs = s * 3; ctx.drawImage(glyphCv[gi[i]], x - gs / 2, y - gs / 2, gs, gs); } // ambient/vortex/burst dust = drifting glyphs
    }
    ctx.globalAlpha = 1;
    if (burstT > 0) burstT = Math.max(0, burstT - dt / 1.1);            // embers die slowly, matching the root cast
    raf = requestAnimationFrame(step);
  }

  // Ritual theme system (RITUAL-VARIANTS-PLAN.md §A): per-node visual
  // variant, resolved by engine/ritual-theme.js (pure, unit-tested there).
  // ritual-vortex.js stays a classic script (loaded via <script src>, not a
  // module) so it pulls the theme module in with a dynamic import() kicked
  // off at file-load time — by the time a ritual is actually opened (well
  // after loadVortex() fires, per node.js) it's long since resolved. `theme`
  // always holds a FULLY-RESOLVED shape (see DEFAULT_THEME there); until the
  // module lands, THEME_FALLBACK (identical to DEFAULT_THEME) keeps today's
  // exact look so there's no flash of different content.
  const THEME_FALLBACK = { palette: null, circle: { rings: 3, poly: 'triangle', spin: 1 }, glyphs: '', glow: 1, scale: 1, motion: 'orbit' };
  let RTHEME = null, theme = THEME_FALLBACK;
  import('./engine/ritual-theme.js').then(m => RTHEME = m).catch(() => {});
  function resolveThemeSafe(input) { return RTHEME ? RTHEME.resolveTheme(input) : THEME_FALLBACK; }

  let unmount = null;
  function mount(host, opts = {}) {
    if (unmount) unmount();                                             // one engine: a new mount MOVES it (booth ↔ ritual) with fresh state
    cv = document.createElement('canvas'); cv.id = 'rvortex'; ctx = cv.getContext('2d');
    pixel = document.documentElement.classList.contains('fx-pixel');    // theme.js sets this (BLOOM = pixel)
    if (pixel) ctx.imageSmoothingEnabled = false;
    theme = resolveThemeSafe(opts.theme);                                // per-node visual variant (§A) — THEME_FALLBACK if absent, pixel-identical to before
    circleOn = opts.circle !== false; cy0 = opts.cy ?? .46; amb = ambT = opts.ambient ?? 1; spread = (opts.spread ?? 1) * theme.scale; dens = Math.max(0, Math.min(1, opts.density ?? 1));
    charge = 0; burstT = 0; burstFired = false; t = 0;
    const actin = host.querySelector('.actin');
    actin ? host.insertBefore(cv, actin) : host.appendChild(cv);
    host.classList.add('pvx');                                          // .pvx hides the CSS placeholder rings — the real vortex replaces them
    const size = () => { cv.width = host.clientWidth; cv.height = host.clientHeight; };
    size(); addEventListener('resize', size);
    spell = theme.palette?.core ? hexToRgb01(theme.palette.core) : hexToRgb01(getComputedStyle(host).getPropertyValue('--c') || '#78b2a5');
    const maxR = Math.min(cv.width, cv.height) * .44 * spread;
    for (let i = 0; i < COUNT; i++) seed(i, maxR, true);
    thO = thI = thT = ign = 0;                                          // fresh plate: bands at rest, nothing ignited yet
    const pick = () => RUNES[Math.random() * RUNES.length | 0];
    const glyphList = theme.glyphs ? [...theme.glyphs] : null;           // node's taught word spelled out on the circle, else random runes as before
    const pickGlyph = i => glyphList ? glyphList[i % glyphList.length] : pick();
    runeGO = Array.from({ length: RUNE_O }, (_, i) => pickGlyph(i)); runeGI = Array.from({ length: RUNE_I }, (_, i) => pickGlyph(i)); medG = Array.from({ length: MEDS }, (_, i) => pickGlyph(i));
    glyphChars = Array.from({ length: GLY_N }, pick);                    // the floating-dust alphabet for this mount (unthemed — only the circle spells the word)
    last = performance.now(); raf = requestAnimationFrame(step);
    const myCv = cv;
    unmount = () => { cancelAnimationFrame(raf); removeEventListener('resize', size); myCv.remove(); unmount = null; };
    return {
      setCharge: c => { charge = Math.max(0, Math.min(1, c)); },
      setAmbient: a => { ambT = Math.max(0, Math.min(1, a)); },
      emit: (nx, ny, n) => {                                            // conjure n motes at normalized (nx,ny) — dust pours from the palm
        for (let k = 0; k < n; k++) {
          const i = emitPtr = (emitPtr + 1) % COUNT;
          mode[i] = 1; const a0 = Math.random() * TAU, sp = EMIT_SPEED[0] + Math.random() * (EMIT_SPEED[1] - EMIT_SPEED[0]);
          px[i] = nx * cv.width + (Math.random() - .5) * 10; py[i] = ny * cv.height + (Math.random() - .5) * 10;
          vx[i] = Math.cos(a0) * sp; vy[i] = Math.sin(a0) * sp - 20;
          life[i] = 0; max[i] = SUMMON_LIFE[0] + Math.random() * (SUMMON_LIFE[1] - SUMMON_LIFE[0]);
          bri[i] = .8 + Math.random() * .6; phase[i] = Math.random() * TAU; sz[i] = 1.6 + Math.random() * 2.8;
        }
      },
      burst: () => {                                                    // fling every mote outward from wherever the funnel left it
        for (let i = 0; i < COUNT; i++) {
          const dx = px[i] - cv.width * .5, dy = py[i] - cv.height * cy0, d = Math.hypot(dx, dy);
          const a = (d < 1 ? Math.random() * TAU : Math.atan2(dy, dx)) + (Math.random() - .5) * 1.4;
          const sp = BURST_SPEED[0] + Math.random() * (BURST_SPEED[1] - BURST_SPEED[0]);
          vx[i] = Math.cos(a) * sp; vy[i] = Math.sin(a) * sp;
        }
        burstT = 1; burstFired = true; charge = 0;
      },
      stop: () => { if (unmount) unmount(); },
      get canvas() { return myCv; },                                    // for the photo booth: burn the fx into the captured frame
    };
  }
  return { mount };
})();
