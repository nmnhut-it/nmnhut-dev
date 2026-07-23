// Shared lesson shell: renders the page, runs the student's Python in a worker,
// and provides the I/O the machines call — terminal (keyboard/text) and the AR
// game (real camera finger-count + scene VFX). Per-lesson content = window.LESSON.
const L = window.LESSON || {};
const TRIG = L.gameTrigger ? new RegExp(L.gameTrigger) : null;

document.title = (L.title || 'Lesson').replace(/<[^>]+>/g,'') + ' — Magic Dust';
document.body.dataset.mode = 'terminal';
document.body.innerHTML = `
  <header>
    <a class="logo" href="./index.html" title="Back to the saga map">✦ MAGIC&nbsp;DUST <small>studio</small></a>
    <div class="title">${L.title || 'Lesson'}</div>
    <div class="steps"><span class="chip" id="subtitle"></span><span class="chip on" id="modebadge">TERMINAL</span></div>
  </header>
  <main>
    <section class="editor" id="paneCode">
      <div class="tabs"><div class="tab"><span class="dot"></span><span id="filename">lesson.py</span></div>
        <button class="panex" id="collapseCode" title="Collapse code — focus the scene">⟨</button></div>
      <div id="code"></div>
      <div class="toolbar">
        <button class="run" id="run" disabled><span class="tri"></span> <span id="runlbl">LOADING…</span></button>
        <button class="btn2" id="reset">Reset</button>
        <div class="hint" id="hint"></div>
      </div>
      <div class="rail" id="railCode" title="Show code"><span>▸ CODE</span></div>
    </section>
    <section class="stage" id="paneStage">
      <button class="panex stagex" id="collapseStage" title="Collapse output — focus the code">⟩</button>
      <div class="rail" id="railStage" title="Show output"><span>▸ OUTPUT</span></div>
      <div id="scene">
        <video id="cam" playsinline muted></video>
        <div class="stagelabel">GAME SCENE</div>
        <div class="vortex"><div class="ring"></div><div class="ring b"></div></div>
        <div class="result" id="result"><div class="big" id="resultBig">—</div><div class="sub" id="resultSub"></div></div>
        <div class="hud">
          <div id="camstat">show your hand ✋</div>
          <div id="fcount">—</div>
          <div id="gatebar"><i></i></div>
          <div id="sceneask"><span>fingers:</span><input id="scenein" type="number" min="0" max="5"></div>
        </div>
      </div>
      <div id="terminal" class="mono">
        <div class="termtitle">TERMINAL</div>
        <div id="termlog"></div>
        <div id="termline"><span id="termprompt"></span><input id="termin" spellcheck="false" autocomplete="off"></div>
      </div>
      <div class="warn" id="warn"></div>
    </section>
  </main>`;

const $=id=>document.getElementById(id);
const runBtn=$('run'),runLbl=$('runlbl');
const termLog=$('termlog'),termLine=$('termline'),termPrompt=$('termprompt'),termIn=$('termin');
const resultEl=$('result'),bigEl=$('resultBig'),subEl=$('resultSub');
const camEl=$('cam'),camStat=$('camstat'),fcountEl=$('fcount'),gateBar=$('gatebar').firstElementChild,sceneAsk=$('sceneask'),sceneIn=$('scenein');

$('subtitle').textContent=L.subtitle||''; $('hint').innerHTML=L.hint||''; $('filename').textContent=L.fileName||'lesson.py';

function tline(cls,txt){const d=document.createElement('div');d.className='r '+cls;d.textContent=txt;termLog.appendChild(d);termLog.scrollTop=termLog.scrollHeight;}
const tsys=t=>tline('t-sys',t);
function setMode(m){ document.body.dataset.mode=m; $('modebadge').textContent=m==='game'?'GAME':'TERMINAL'; }

// ── Monaco editor ──
let editor=null;
const MONACO_VS='https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs';
function makeEditor(code){
  return new Promise(res=>{
    require.config({paths:{vs:MONACO_VS}});
    self.MonacoEnvironment={getWorkerUrl:()=>'data:text/javascript;charset=utf-8,'};
    require(['vs/editor/editor.main'],()=>{
      monaco.editor.defineTheme('magic',{base:'vs-dark',inherit:true,rules:[],colors:{'editor.background':'#183f49','editorLineNumber.foreground':'#183f49'}});
      editor=monaco.editor.create($('code'),{ value:code, language:'python', theme:'magic',
        fontFamily:'Cascadia Code, Consolas, ui-monospace, monospace', fontSize:13.5, lineHeight:22,
        minimap:{enabled:false}, automaticLayout:true, scrollBeyondLastLine:false, padding:{top:12},
        renderLineHighlight:'none', tabSize:4, fixedOverflowWidgets:true });
      res();
    });
  });
}
const getCode=()=>editor?editor.getValue():'';
const setCode=v=>editor&&editor.setValue(v);

if(!self.crossOriginIsolated){
  const w=$('warn'); w.style.display='flex';
  w.innerHTML='<div>This page needs <b>SharedArrayBuffer</b>.<br><br>Serve it with:<br><br><code>python serve.py</code></div>';
}

// ── SharedArrayBuffer bridge to the Python worker ──
let worker=null, header=null, dataU8=null;
const enc=new TextEncoder();
function respond(text){
  const bytes=enc.encode(String(text));
  dataU8.set(bytes.subarray(0,dataU8.length),0);
  Atomics.store(header,1,Math.min(bytes.length,dataU8.length));
  Atomics.store(header,0,1); Atomics.notify(header,0);
}
function terminalAsk(prompt){
  return new Promise(resolve=>{
    termPrompt.textContent=prompt; termLine.style.display='flex'; termIn.value=''; termIn.focus();
    termIn.onkeydown=e=>{ if(e.key==='Enter'){ const v=termIn.value; tline('t-echo',prompt+v);
      termLine.style.display='none'; termIn.onkeydown=null; resolve(v); } };
  });
}

// ── Camera + hand tracking (MediaPipe) — lazily started on the first finger read ──
const FT_EXT=0.55, TH_RATIO=1.12, HOLD_MS=850;
function handSize(lm){return Math.hypot(lm[0].x-lm[9].x,lm[0].y-lm[9].y)||.001;}
function extFinger(lm,pip,tip){const h=handSize(lm);return Math.max(0,Math.min(1,((lm[pip].y-lm[tip].y)/h)*4.5));}
function thumbUp(lm){const px=lm[17].x,py=lm[17].y;
  return Math.hypot(lm[4].x-px,lm[4].y-py) > Math.hypot(lm[2].x-px,lm[2].y-py)*TH_RATIO;}
function countFingers(lm){ let n=0;
  if(extFinger(lm,6,8)>FT_EXT)n++; if(extFinger(lm,10,12)>FT_EXT)n++;
  if(extFinger(lm,14,16)>FT_EXT)n++; if(extFinger(lm,18,20)>FT_EXT)n++;
  if(thumbUp(lm))n++; return n; }

let camReady=false, fingerGate=null;
// Keyed on `self.__mdScriptLoads` — shared page-wide with camera-engine.js's
// own loadScript so no two independent MediaPipe loaders on the same page
// inject the same <script> twice (see that file's comment for the AMD crash
// this prevents). This file isn't referenced by any current lesson HTML, but
// kept consistent in case it's ever revived.
function loadScript(src){self.__mdScriptLoads ||= {}; return self.__mdScriptLoads[src] ||= new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
async function ensureCamera(){
  if(camReady) return;
  if(!(self.Hands&&self.Camera)){
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
  }
  const hands=new self.Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${f}`});
  hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.7,minTrackingConfidence:.6,selfieMode:false});
  hands.onResults(onHands);
  const cam=new self.Camera(camEl,{onFrame:async()=>{await hands.send({image:camEl});},width:480,height:360});
  await cam.start();
  camReady=true;
}
function onHands(res){
  const has=res.multiHandLandmarks&&res.multiHandLandmarks.length>0;
  const count=has?countFingers(res.multiHandLandmarks[0]):0;
  camStat.textContent=has?'hold steady…':'show your hand ✋';
  fcountEl.textContent=has?count:'—';
  if(fingerGate) fingerGate(count,has);
}
// Hold a finger count steady for HOLD_MS, then lock it in.
function fingerAsk(){
  setMode('game');
  return ensureCamera().then(()=>new Promise(resolve=>{
    let target=null,held=0,last=performance.now();
    fingerGate=(count,has)=>{
      const now=performance.now(),dt=now-last; last=now;
      if(!has){ target=null; held=0; gateBar.style.width='0%'; return; }
      if(count!==target){ target=count; held=0; } else held+=dt;
      gateBar.style.width=Math.min(100,held/HOLD_MS*100)+'%';
      if(held>=HOLD_MS){ fingerGate=null; gateBar.style.width='0%'; camStat.textContent='got it: '+count;
        tsys('fingers() → '+count); resolve(String(count)); }
    };
  })).catch(()=>{ tsys('camera unavailable — type the count'); return fingerAskStub(); });
}
function fingerAskStub(){
  return new Promise(resolve=>{ sceneAsk.style.display='flex'; sceneIn.value=''; sceneIn.focus();
    sceneIn.onkeydown=e=>{ if(e.key==='Enter'){ const v=sceneIn.value||'0'; sceneAsk.style.display='none';
      sceneIn.onkeydown=null; tsys('fingers() → '+v+'  [typed]'); resolve(v); } }; });
}

// ── Scene outputs ──
const SPELLS={ fire:{label:'🔥 FIRE',color:'#d69a20'}, freeze:{label:'❄ FREEZE',color:'#78b2a5'} };
function endOnFx(){ const v=document.querySelector('.vortex'); if(v) v.style.opacity='0'; } // fade the swirl → the fx is the final frame
function castSpell(name){
  const s=SPELLS[name]||{label:String(name).toUpperCase(),color:'#78b2a5'};
  $('scene').style.setProperty('--c',s.color); endOnFx();
  bigEl.textContent=s.label; bigEl.style.textShadow=`0 0 30px ${s.color},0 0 70px ${s.color}`;
  subEl.textContent=name+'()';
  resultEl.classList.remove('show'); void resultEl.offsetWidth; resultEl.classList.add('show');
}
function showValue(v){
  $('scene').style.setProperty('--c','#78b2a5'); endOnFx();
  bigEl.textContent=String(v); bigEl.style.textShadow='0 0 30px var(--c),0 0 70px var(--c)';
  subEl.textContent='output';
  resultEl.classList.remove('show'); void resultEl.offsetWidth; resultEl.classList.add('show');
}

async function onWorker(ev){
  const d=ev.data;
  if(d.evt==='ready'){ runBtn.disabled=false; runLbl.textContent='RUN'; tsys('Python ready. Press RUN. ✦'); return; }
  if(d.evt==='done'){ runBtn.disabled=false; runLbl.textContent='RUN'; tsys('— program finished —'); return; }
  if(d.evt==='error'){ runBtn.disabled=false; runLbl.textContent='RUN';
    setMode('terminal');                                 // a crash → show the full terminal so the error is unmissable
    const last=String(d.msg||'').trim().split('\n').pop()||'error';
    tline('t-err','✖ '+last);
    const c=getCode();
    if(/name .* is not defined/i.test(last) && /old_computer_/.test(c) && /future_machine_/.test(c))
      tline('t-sys','↑ your code mixes old_computer_ and future_machine_ — make them ALL the same machine.');
    return; }
  if(d.req==='tell'){
    if(d.kind==='spell'){ setMode('game'); castSpell(d.text); }
    else if(d.kind==='label'){ setMode('game'); showValue(d.text); }
    else { setMode('terminal'); tline('t-out',d.text); }
    return;
  }
  if(d.req==='ask'){
    if(d.kind==='fingers'){ respond(await fingerAsk()); }
    else { setMode('terminal'); respond(await terminalAsk(d.prompt)); }
  }
}

async function fetchText(u){ try{const r=await fetch(u);return r.ok?await r.text():null;}catch{return null;} }
function guessMode(code){
  if(!TRIG) return 'terminal';
  return code.split('\n').some(l=>TRIG.test(l.split('#')[0])) ? 'game' : 'terminal';
}

async function boot(){
  if(!self.crossOriginIsolated) return;
  const code=(await fetchText(L.pyPath))||L.fallback||'';
  await makeEditor(code);
  const sources={}; for(const [name,path] of Object.entries(L.modules||{})) sources[name]=await fetchText(path);
  const sab=new SharedArrayBuffer(8+65536);
  header=new Int32Array(sab,0,2); dataU8=new Uint8Array(sab,8);
  worker=new Worker('./worker.js'); worker.onmessage=onWorker;
  worker.postMessage({cmd:'boot',sab,sources});
  tsys('Loading Python (Pyodide) in a worker…');
}
function runCode(){
  if(!worker) return;
  termLog.innerHTML=''; termLine.style.display='none'; resultEl.classList.remove('show'); sceneAsk.style.display='none'; gateBar.style.width='0%';
  const vx=document.querySelector('.vortex'); if(vx) vx.style.opacity='1';   // swirl back for the next reading
  setMode(guessMode(getCode()));
  runBtn.disabled=true; runLbl.textContent='RUNNING…';
  tsys('running lesson.py …');
  worker.postMessage({cmd:'run',code:getCode()});
}
runBtn.addEventListener('click',runCode);
$('reset').addEventListener('click',()=>{ setCode(L.fallback||''); setMode('terminal'); tsys('editor reset'); });

// ── Collapsible panels (accordion) — maximize whichever side you're using ──
function relayout(){ setTimeout(()=>{ if(editor) editor.layout(); },60); }
$('collapseCode').onclick =()=>{ document.body.classList.remove('stage-collapsed'); document.body.classList.add('code-collapsed'); relayout(); };
$('railCode').onclick     =()=>{ document.body.classList.remove('code-collapsed'); relayout(); };
$('collapseStage').onclick=()=>{ document.body.classList.remove('code-collapsed'); document.body.classList.add('stage-collapsed'); relayout(); };
$('railStage').onclick    =()=>{ document.body.classList.remove('stage-collapsed'); relayout(); };

window.addEventListener('load',boot);
