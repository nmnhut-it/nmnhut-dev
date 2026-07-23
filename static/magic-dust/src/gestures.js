// Thumb, index, middle, ring, pinky tip landmark indices (MediaPipe Hands topology).
export const FINGERTIPS=[4,8,12,16,20];

// Hand size: wrist(0) to mid-MCP(9) — normalizes finger metrics and doubles as
// a rough proxy for how close the hand is to the camera.
export function handSize(lm){return Math.hypot(lm[0].x-lm[9].x,lm[0].y-lm[9].y)||.001;}

// Finger extension: PIP vs TIP, normalized by hand size.
// In image coords Y increases downward, so an extended finger has tip above pip.
function ext(lm,pip,tip){const h=handSize(lm),dy=(lm[pip].y-lm[tip].y)/h;return Math.max(0,Math.min(1,dy*4.5));}

const EXT_THRESHOLD=0.55,THUMB_EXT_RATIO=1.12;

// Counts how many of index/middle/ring/pinky are clearly extended. Thumb is
// excluded here on purpose — its extension needs a different axis, and keeping
// it out means the 1-finger / 2-finger spell gestures aren't disturbed by a
// stray thumb. (Thumb is handled separately for the open-palm summon below.)
export function countExtendedFingers(lm){
  const idx=ext(lm,6,8)>EXT_THRESHOLD,mid=ext(lm,10,12)>EXT_THRESHOLD,rng=ext(lm,14,16)>EXT_THRESHOLD,pnk=ext(lm,18,20)>EXT_THRESHOLD;
  return[idx,mid,rng,pnk].filter(Boolean).length;
}

// Thumb abducts sideways rather than curling along a finger axis, so measure it
// across the palm: compare how far the tip(4) sits from the far side of the palm
// (pinky MCP, 17) versus its own MCP(2). Splayed out → tip is farther than its
// base; folded across the palm → the tip pulls in closer. Orientation-free.
function thumbExtended(lm){
  const px=lm[17].x,py=lm[17].y;
  const dTip=Math.hypot(lm[4].x-px,lm[4].y-py),dMcp=Math.hypot(lm[2].x-px,lm[2].y-py);
  return dTip>dMcp*THUMB_EXT_RATIO;
}

// Open palm = all four fingers extended AND the thumb splayed → the "true 5"
// summon gesture, kept distinct from the thumb-excluded spell count above.
export function isOpenPalm(lm){return countExtendedFingers(lm)===4&&thumbExtended(lm);}
