// Spell VFX — the ROOT app's tuned WebGL mote engine (src/main.js), embedded
// in a lesson panel. This is the REAL thing, not the canvas-2D replica: the
// same pooled dust motes, the same summon→gather→whirlpool→burst constants,
// the same additive point shader (soft round glow / fx-pixel hard squares) and
// the real UnrealBloomPass. No camera, no MediaPipe — node.js calls cast() and
// the engine runs the root arc at the panel centre: dust pours in (summon),
// the vortex grabs and funnels it (charge), full charge detonates (burst).
// ES module (lesson pages carry the same three.js import map as the root app).
// API: mount(host) → { cast(hex, bloomStrength) → Promise, stop(), canvas }.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const TAU = Math.PI * 2;
// Perf tier — same formula as the root app.
const mob = (/Mobi|Android|iPhone|iPad/i).test(navigator.userAgent);
const cores = navigator.hardwareConcurrency || 2;
const tier = mob ? 0 : cores <= 2 ? 0 : cores <= 4 ? 1 : 2;
// Half the root pool: motes keep their ABSOLUTE size (see SCALE_MIN) but the
// panel is ~¼ the screen area — root density would white-out the collapsed
// core into a structureless blob (no spiral arms, just glare).
const MOTES = [800, 1400, 2100][tier], PR = [1, 1.2, Math.min(devicePixelRatio, 2)][tier];
// Tuned constants — verbatim from src/main.js (do NOT retune here; the root app is the source of truth).
const GRAV = 7;
const EMIT_RATE = 2600, PALM_JIT = 7, MOTE_LIFE = 1.6, MOTE_LIFE_SPAN = 2.6, MIN_BURST = 420;
const EMIT_SPEED_MIN = 44, EMIT_SPEED_MAX = 108, BIRTH_SIZE_MIN = 1.8, BIRTH_SIZE_MAX = 3.6, SUMMON_RAMP_SEC = 2.2;
const BIRTH_SEC = .4, BIRTH_GLOW = .9, DEATH_FRAC = .3;
const VORTEX_AT = .4, OMEGA = 6.2, SWIRL_K = 150, RMIN = 5.5;
const SPIN_JIT = .5, SPIN_FLOOR = .12, BACK = 1.3, GATHER_SWELL = 2, CORE_TIGHTEN = .6;
// Mote size must stay near the root's ABSOLUTE pixel footprint (~4-9px soft
// sprites): the look depends on overlap + tripping the bloom threshold, and
// scaling proportionally to a small panel shrinks motes to dim single pixels
// with nothing for UnrealBloom to bleed. Floor the height scaling at .85.
const MOTE_PX = 165, SCALE_REF = 940, SCALE_MIN = .85;
const NEUTRAL_BLOOM = 1.0, STILL_I = .14;             // bloom baseline + the root "steadying" pre-charge intensity
// FINE-GRAINED FIRE VORTEX — the root cast timeline cloned EXACTLY
// (src/main.js updateCasting): pour → GATHERING settle (STILL_SEC, intensity
// eases 0→STILL_I, near-zero spin) → LINEAR charge climb at 1/CHARGE_SEC
// (NOT smoothstep — easing rushes the c≈.3–.7 window where the whirlpool
// winds its spiral arms; the linear ramp is what the root was tuned on).
const POUR_MS = 1200, STILL_SEC = .22, CHARGE_SEC = 1.0;  // STILL_SEC/CHARGE_SEC verbatim from the root

export function mount(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: tier >= 2, alpha: true, powerPreference: tier === 0 ? 'low-power' : 'high-performance' });
  const scene = new THREE.Scene();
  const cam3 = new THREE.PerspectiveCamera(70, 1, .1, 1000); cam3.position.z = 55;
  renderer.setPixelRatio(PR); renderer.domElement.id = 'svfx';
  host.appendChild(renderer.domElement); host.classList.add('pvx');
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, cam3));
  const bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 1.4, .4, .85);
  composer.addPass(bloom);
  const baseScale = () => MOTE_PX * PR * Math.max(SCALE_MIN, (host.clientHeight || SCALE_REF) / SCALE_REF);
  const size = () => { const w = host.clientWidth || 2, h = host.clientHeight || 2;
    renderer.setSize(w, h); composer.setSize(w, h); cam3.aspect = w / h; cam3.updateProjectionMatrix();
    motesMat.uniforms.uScale.value = baseScale(); };

  const pixel = document.documentElement.classList.contains('fx-pixel');   // theme.js: BLOOM = hard pixel squares
  const AMB = pixel ? [1, .6, .84] : [.5, .72, 1];
  const [AMB_R, AMB_G, AMB_B] = AMB;

  // ── mote pool — verbatim buffers + shader from src/main.js ──
  const mGeo = new THREE.BufferGeometry();
  const mPos = new Float32Array(MOTES * 3), mCol = new Float32Array(MOTES * 3), mSize = new Float32Array(MOTES);
  const mVel = new Float32Array(MOTES * 2), mDir = new Float32Array(MOTES), mRad = new Float32Array(MOTES), mPhase = new Float32Array(MOTES), mBri = new Float32Array(MOTES), mLife = new Float32Array(MOTES), mMax = new Float32Array(MOTES), mSpin = new Float32Array(MOTES), mBase = new Float32Array(MOTES);
  for (let i = 0; i < MOTES; i++) { mPhase[i] = Math.random() * TAU; mBri[i] = .7 + Math.random() * .6; mBase[i] = mSize[i] = 0.55 + Math.random() * 1.55; mMax[i] = 1; mLife[i] = 1; }
  mGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));
  mGeo.setAttribute('color', new THREE.BufferAttribute(mCol, 3));
  mGeo.setAttribute('size', new THREE.BufferAttribute(mSize, 1));
  const motesMat = new THREE.ShaderMaterial({
    uniforms: { uScale: { value: MOTE_PX * PR } },
    vertexShader: `attribute float size;attribute vec3 color;varying vec3 vC;uniform float uScale;
      void main(){vC=color;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*uScale/(-mv.z);gl_Position=projectionMatrix*mv;}`,
    // Pixel (BLOOM) squares carry far more alpha energy than the soft sprite
    // (flat fill vs quadratic falloff) — at panel density they saturate to a
    // white sheet, so the PANEL port dims them (~45%); the root app keeps its
    // own full-strength shader.
    fragmentShader: pixel
      ? `varying vec3 vC;
      void main(){vec2 p=abs(gl_PointCoord-vec2(0.5));if(max(p.x,p.y)>0.5)discard;float a=max(p.x,p.y)<0.27?0.55:0.28;gl_FragColor=vec4(vC,1.0)*a;}`
      : `varying vec3 vC;
      void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>0.5)discard;float a=1.0-2.0*d;a*=a;gl_FragColor=vec4(vC,1.0)*a;}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(mGeo, motesMat));
  size(); addEventListener('resize', size);

  function hexToRgb01(hex) { const n = parseInt(hex.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }

  let motesBurst = 0, chargeCaptured = false, emitAccum = 0, emitPtr = 0, summonRamp = 0;
  let gColor = '#78b2a5', summoning = false, charging = false, chargeI = 0, focus = 0;
  let liveCount = 0, idleCleared = false;              // idle guard: when the pool is dead, clear once and stop presenting

  function emitMote(i, cx, cy) {
    const a = Math.random() * TAU, rr = Math.random() * PALM_JIT, spBase = EMIT_SPEED_MIN + (EMIT_SPEED_MAX - EMIT_SPEED_MIN) * summonRamp, sp = spBase * (.75 + .25 * Math.random());
    mPos[i * 3] = cx + Math.cos(a) * rr; mPos[i * 3 + 1] = cy + Math.sin(a) * rr; mPos[i * 3 + 2] = (Math.random() - .5) * 14;
    mVel[i * 2] = Math.cos(a) * sp + (Math.random() - .5) * 6; mVel[i * 2 + 1] = Math.sin(a) * sp + (Math.random() - .5) * 6;
    mLife[i] = 0; mMax[i] = MOTE_LIFE + Math.random() * MOTE_LIFE_SPAN; mBri[i] = .7 + Math.random() * .6; mBase[i] = mSize[i] = 0.55 + Math.random() * 1.55; mPhase[i] = Math.random() * TAU;
  }
  function burstMotes(cx, cy) {
    motesBurst = 1; let alive = 0;
    for (let i = 0; i < MOTES; i++) {
      if (mLife[i] >= mMax[i]) continue;
      alive++;
      const dx = mPos[i * 3] - cx, dy = mPos[i * 3 + 1] - cy, d = Math.hypot(dx, dy);
      const a = (d < 1 ? Math.random() * TAU : Math.atan2(dy, dx)) + (Math.random() - .5) * 1.4, sp = 25 + Math.random() * 100;
      mVel[i * 2] = Math.cos(a) * sp; mVel[i * 2 + 1] = Math.sin(a) * sp;
      mBase[i] = mSize[i] = 0.55 + Math.random() * 1.55; mMax[i] = 1.1 + Math.random() * 2.1; mLife[i] = Math.random() * mMax[i];
    }
    for (let i = 0; i < MOTES && alive < MIN_BURST; i++) {
      if (mLife[i] < mMax[i]) continue; alive++;
      const a = Math.random() * TAU, sp = 25 + Math.random() * 100;
      mPos[i * 3] = cx + (Math.random() - .5) * 8; mPos[i * 3 + 1] = cy + (Math.random() - .5) * 8; mPos[i * 3 + 2] = (Math.random() - .5) * 14;
      mVel[i * 2] = Math.cos(a) * sp; mVel[i * 2 + 1] = Math.sin(a) * sp;
      mBri[i] = .7 + Math.random() * .6; mBase[i] = mSize[i] = 0.55 + Math.random() * 1.55; mMax[i] = 1.1 + Math.random() * 2.1; mLife[i] = Math.random() * mMax[i]; mPhase[i] = Math.random() * TAU;
    }
  }
  // updateMotes — verbatim behaviour blend from src/main.js. The attract point
  // sways gently: the root's anchor is a LIVE fingertip, and that tiny organic
  // wander is part of why its funnel feels alive (a fixed centre reads rigid).
  function updateMotes(dt, time) {
    const cx = Math.sin(time * .8) * 1.6 + Math.sin(time * 1.7) * .6, cy = Math.cos(time * .6) * 1.2, [ir, ig, ib] = hexToRgb01(gColor);
    const doCharge = charging; if (!doCharge) chargeCaptured = false;
    const emitting = summoning && !doCharge && motesBurst <= 0;
    summonRamp = Math.max(0, Math.min(1, summonRamp + (emitting ? 1 : -1.4) * dt / SUMMON_RAMP_SEC));
    if (emitting) {
      emitAccum += EMIT_RATE * dt;
      while (emitAccum >= 1) { emitAccum--;
        let tries = 0; while (mLife[emitPtr] < mMax[emitPtr] && tries < MOTES) { emitPtr = (emitPtr + 1) % MOTES; tries++; }
        if (tries >= MOTES) { emitAccum = 0; break; }
        emitMote(emitPtr, cx, cy); emitPtr = (emitPtr + 1) % MOTES;
      }
    }
    const birthSize = BIRTH_SIZE_MIN + (BIRTH_SIZE_MAX - BIRTH_SIZE_MIN) * summonRamp;
    const c = chargeI, gather = Math.min(1, c / VORTEX_AT), tt = Math.max(0, (c - VORTEX_AT) / (1 - VORTEX_AT)), coll = tt * tt * ((BACK + 1) * tt - BACK), spinEnv = SPIN_FLOOR + (1 - SPIN_FLOOR) * c * c;
    const gS = gather * gather * (3 - 2 * gather);
    motesMat.uniforms.uScale.value = baseScale() * (1 + (doCharge ? GATHER_SWELL * gS - CORE_TIGHTEN * Math.max(0, coll) : 0) + (motesBurst > 0 ? .7 * motesBurst : 0));
    liveCount = 0;
    for (let i = 0; i < MOTES; i++) {
      let x = mPos[i * 3], y = mPos[i * 3 + 1], r, g, b;
      if (mLife[i] >= mMax[i]) { mCol[i * 3] = mCol[i * 3 + 1] = mCol[i * 3 + 2] = 0; continue; }
      liveCount++;
      if (motesBurst > 0) {
        mVel[i * 2 + 1] -= GRAV * 1.6 * dt;
        x += mVel[i * 2] * dt; y += mVel[i * 2 + 1] * dt; mVel[i * 2] *= .94; mVel[i * 2 + 1] *= .94;
        const f = motesBurst, hot = f * f * .8;
        r = Math.min(2, (ir * (.5 + 1.3 * f) + hot) * mBri[i]); g = Math.min(2, (ig * (.5 + 1.3 * f) + hot) * mBri[i]); b = Math.min(2, (ib * (.5 + 1.3 * f) + hot) * mBri[i]);
      } else if (doCharge) {
        if (!chargeCaptured) { const dx0 = mPos[i * 3] - cx, dy0 = mPos[i * 3 + 1] - cy; mDir[i] = Math.atan2(dy0, dx0); mRad[i] = Math.max(RMIN, Math.hypot(dx0, dy0)); mSpin[i] = 1 + (Math.random() - .5) * SPIN_JIT; }
        const rt = mRad[i] * (1 - coll);
        mDir[i] += OMEGA * mSpin[i] * spinEnv * (1 + SWIRL_K / Math.max(rt, RMIN)) * dt;
        x = cx + Math.cos(mDir[i]) * rt; y = cy + Math.sin(mDir[i]) * rt; mPos[i * 3 + 2] *= .93;
        const mix = Math.min(1, c / .4), tw = .8 + .2 * Math.sin(time * 5 + mPhase[i] * 7), br = (.5 + .7 * c) * mBri[i] * tw;
        r = (AMB_R + (ir - AMB_R) * mix) * br; g = (AMB_G + (ig - AMB_G) * mix) * br; b = (AMB_B + (ib - AMB_B) * mix) * br;
      } else {
        mLife[i] += dt;
        const ax = Math.sin(y * .05 + time * .4 + mPhase[i]) * 6, ay = Math.cos(x * .05 + time * .3 + mPhase[i]) * 6 - GRAV * .4;
        mVel[i * 2] += ax * dt; mVel[i * 2 + 1] += ay * dt; mVel[i * 2] *= .972; mVel[i * 2 + 1] *= .972; x += mVel[i * 2] * dt; y += mVel[i * 2 + 1] * dt;
        const lf = mLife[i] / mMax[i], fresh = Math.max(0, 1 - mLife[i] / BIRTH_SEC), flash = fresh * fresh;
        const rise = Math.min(1, mLife[i] / .05), fade = Math.min(1, (1 - lf) / DEATH_FRAC);
        const tw = .65 + .35 * Math.sin(time * 3.5 + mPhase[i] * 5), br = (.5 + .4 * focus) * (1 + BIRTH_GLOW * flash) * rise * fade * tw * mBri[i];
        mSize[i] = mBase[i] * (1 + birthSize * flash);
        r = AMB_R * br; g = AMB_G * br; b = AMB_B * br;
      }
      mPos[i * 3] = x; mPos[i * 3 + 1] = y;
      mCol[i * 3] = Math.min(2, r); mCol[i * 3 + 1] = Math.min(2, g); mCol[i * 3 + 2] = Math.min(2, b);
    }
    if (doCharge) chargeCaptured = true;
    if (motesBurst > 0) motesBurst = Math.max(0, motesBurst - dt / 1.1);
    mGeo.attributes.position.needsUpdate = true; mGeo.attributes.color.needsUpdate = true; mGeo.attributes.size.needsUpdate = true;
  }

  let raf = 0, time = 0, lastTs = 0;
  const FPS = tier === 0 ? 30 : 60, FMS = 1000 / FPS;
  function animate(ts) {
    raf = requestAnimationFrame(animate); if (ts - lastTs < FMS * .85) return; lastTs = ts; time += .016;
    focus += ((summoning || charging || motesBurst > 0 ? 1 : 0) - focus) * .06;
    updateMotes(.016, time);
    if (summoning || charging || motesBurst > 0 || liveCount > 0) { composer.render(); idleCleared = false; }
    else if (!idleCleared) { renderer.clear(); idleCleared = true; }  // dead pool: blank the canvas once so no last frame lingers, then stop presenting
  }
  raf = requestAnimationFrame(animate);

  // The FINE-GRAINED FIRE VORTEX timeline — resolves AT the detonation so
  // the page can sync its flash/freeze-frame to the burst.
  function cast(hex, bloomStrength = 2.8) {
    gColor = hex || '#78b2a5';
    return new Promise(res => {
      summoning = true; charging = false; chargeI = 0;
      summonRamp = 1;                                  // pour at FULL power (root: a held palm ramps to this) — fast, big, bright birth flashes worth collapsing
      const t0 = performance.now();
      const step = () => {
        const el = (performance.now() - t0) / 1000;
        if (el < POUR_MS / 1000) { bloom.strength = NEUTRAL_BLOOM; requestAnimationFrame(step); return; }
        summoning = false; charging = true;
        const t = el - POUR_MS / 1000;
        chargeI = t < STILL_SEC ? STILL_I * (t / STILL_SEC)                       // GATHERING: settle + faint glow, near-zero spin (root steady window)
                                : Math.min(1, STILL_I + (t - STILL_SEC) / CHARGE_SEC); // CHARGE: linear climb at 1/CHARGE_SEC — the arms wind in real time
        bloom.strength = NEUTRAL_BLOOM + (bloomStrength - NEUTRAL_BLOOM) * chargeI;
        if (chargeI < 1) { requestAnimationFrame(step); return; }
        charging = false; chargeI = 0; burstMotes(0, 0); res();
      };
      requestAnimationFrame(step);
    });
  }

  return {
    cast,
    summon(on = true) { summoning = !!on; if (on) summonRamp = 1; },        // root-parity manual controls (booth-style driving + dev)
    setCharge(c) { charging = c > 0; chargeI = Math.max(0, Math.min(1, c)); },
    burst() { charging = false; chargeI = 0; burstMotes(0, 0); },
    setColor(hex) { gColor = hex || '#78b2a5'; },
    stop() { cancelAnimationFrame(raf); removeEventListener('resize', size); renderer.dispose(); renderer.domElement.remove(); },
    get canvas() { return renderer.domElement; },
  };
}
