const TAU=Math.PI*2,R=Math.random;
function sph(rad){const t=R()*TAU,p=Math.acos(2*R()-1);return[rad*Math.sin(p)*Math.cos(t),rad*Math.sin(p)*Math.sin(t),rad*Math.cos(p)];}

// Each generator receives (index, particleCount, stamp) and calls
// stamp(i, x, y, z, r, g, b, size) to place one particle's target state.

function genNeutral(i,n,st){if(i<n*.05){const[x,y,z]=sph(14+R()*20);st(i,x,y,z,.05,.09,.14,.35);}else st(i,0,0,0,0,0,0,0);}

// Fireball and Lightning are rendered by dedicated real effect libraries
// instead of this shared point-cloud system (see main.js: `three-particle-fire`
// for the flame, the vendored official three.js `LightningStrike` geometry for
// the bolt) — actual shader-driven fire and a real fractal voltaic arc, not a
// hand-shaped particle cluster. Their generator here is a no-op so the shared
// Points system stays invisible for these two spells.
function genNone(i,n,st){st(i,0,0,0,0,0,0,0);}

function genFrost(i,n,st){
  const f=i/n,spike=i%16,a=spike*(TAU/16),r=2+f*45,jitter=(R()-.5)*2,cold=f<.1?3:.8;
  st(i,r*Math.cos(a)+jitter,r*Math.sin(a)*.3+jitter*.5,(R()-.5)*r*.2,.3*cold,.7*cold,1.0*cold,cold>1.5?2.5:.9);
}

function genShield(i,n,st){
  const f=i/n;
  if(f<.12){const a=R()*TAU,r=26+(R()-.5)*1.5;st(i,r*Math.cos(a),r*Math.sin(a),(R()-.5)*.8,.15,.6,1.1,2.8);}
  else if(f<.24){const a=R()*TAU,r=16+(R()-.5);st(i,r*Math.cos(a),r*Math.sin(a),(R()-.5)*.5,.1,.4,.9,1.2);}
  else{const[x,y,z]=sph(35+R()*80);st(i,x,y,z,.05,.2,.4,.5);}
}

function genPortal(i,n,st){
  const f=i/n;
  if(f<.5){const[x,y,z]=sph(20+R()*4);st(i,x,y,z,.5,.1,.9,2.5);}
  else st(i,(R()-.5)*110,(R()-.5)*110,(R()-.5)*110,.4,.05,.7,.7);
}

function genHeal(i,n,st){
  const f=i/n,[x,y,z]=sph(7+f*55),d=Math.sqrt(x*x+y*y+z*z),b=d<18?2.8:.7;
  st(i,x+(R()-.5)*4,y+(R()-.5)*4,z+(R()-.5)*4,.1*b,1.2*b,.5*b,b>1?2.5:.85);
}

export const ENERGY={neutral:0,fireball:70,frost:65,lightning:80,shield:60,portal:90,heal:55};

export const SPELLS={
  neutral:  {n:'ARCANE ENERGY DORMANT', color:'#78b2a5', bloom:1.0, fn:genNeutral},
  fireball: {n:'Fireball',              color:'#d69a20', bloom:2.8, fn:genNone, sprite:'flame'},
  frost:    {n:'Frost Spike',           color:'#78b2a5', bloom:2.6, fn:genFrost},
  lightning:{n:'Chain Lightning',       color:'#78b2a5', bloom:3.2, fn:genNone, sprite:'bolt'},
  shield:   {n:'Arcane Shield',         color:'#78b2a5', bloom:2.2, fn:genShield},
  portal:   {n:'Portal',                color:'#9b3845', bloom:3.6, fn:genPortal},
  heal:     {n:'Healing Aura',          color:'#78b2a5', bloom:2.4, fn:genHeal},
};

// Live gesture input: hold up N fingers to charge the matching spell.
export const FINGER_TO_SPELL={1:'fireball',2:'lightning'};

// Order here also defines the on-screen gesture-guide list order.
export const GUIDE=[
  {key:'fireball',  label:'1 Finger',  desc:'Hold up your index finger and wait for it to charge'},
  {key:'lightning', label:'2 Fingers', desc:'Hold up index + middle finger and wait for it to charge'},
];

export const ROT={
  neutral:{y:.004,x:.001,z:0}, fireball:{y:0,x:0,z:-.11}, frost:{y:.025,x:.01,z:.015},
  lightning:{y:0,x:0,z:-.11}, shield:{y:.006,x:.002,z:0}, portal:{y:.06,x:.01,z:.22}, heal:{y:.065,x:.022,z:.03},
};
