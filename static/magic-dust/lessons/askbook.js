/* Ask Book UI — two views over the same 40 prompts.
   COURSE (default): the ordered path. A flat deck gives a beginner no idea
   what matters first, so runs 1-8 (askbook-course.js) each hand over one
   experiment to perform in a chat window, with a field per step for what came
   back. Those fields ARE the capstone prompt log — "Export my log" writes them
   out as markdown.
   DECK: all 40 cards, searchable by symptom, for once they know the path.
   State (knows / tried / log) persists in localStorage magicdust.askbook.
   No Pip, no cells, no Pyodide — this is a reference, not a lesson node. */
const D=window.ASKBOOK,C=window.ASKBOOK_COURSE,KEY="magicdust.askbook",$=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
let st={knows:{},tried:{},log:{}},view="course",fam="",q="",cur=null,curRun=null;
try{const raw=localStorage.getItem(KEY);if(raw)st=Object.assign(st,JSON.parse(raw))}catch(e){}
if(!st.log)st.log={};
if(!Object.keys(st.knows).length)D.KNOWS.forEach(k=>st.knows[k.k]=!!k.on);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
const famOf=k=>D.FAMS.find(f=>f.k===k),cardOf=n=>D.CARDS.find(c=>c.n===n);

/* The one line that makes every prompt personal — and the reason answers stop
   running ahead of the learner (card 5). Injected into <blanks> on copy. */
const knownLabels=()=>D.KNOWS.filter(k=>st.knows[k.k]).map(k=>k.label);
function knowLine(){const on=knownLabels();return "I am a beginner learning Python. I only know: "+(on.length?on.join(", "):"print()")+". Use only those in your answers."}
function fullPrompt(c){return knowLine()+"\n\n"+c.prompt.replace(/<your allowed features>/g,knownLabels().join(", ")||"print()")}
async function copy(text,btn,label){try{await navigator.clipboard.writeText(text)}
  catch(e){const a=document.createElement("textarea");a.value=text;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove()}
  const old=btn.textContent;btn.textContent="Copied — paste it in your chat";btn.classList.add("ok");
  setTimeout(()=>{btn.textContent=label||old;btn.classList.remove("ok")},2200)}

/* ---------- course progress ---------- */
const runLog=n=>(st.log[n]=st.log[n]||{steps:{}});
const stepsDone=n=>{const r=st.log[n];if(!r)return 0;return C.find(x=>x.n===n).steps.filter((s,i)=>r.steps[i]&&r.steps[i].done).length};
const runDone=n=>stepsDone(n)===C.find(x=>x.n===n).steps.length;
const currentRun=()=>{const first=C.find(r=>!runDone(r.n));return first?first.n:C.length};

/* ---------- deck search ---------- */
const hayOf=c=>[c.title,c.moment,c.prompt,c.reply,c.act,c.trap,c.code,famOf(c.fam).name].join(" ").toLowerCase();
/* Students search by symptom ("infinite loop"), not by card name. Strict
   all-words matching answers that too narrowly — one hit where three cards
   apply — so anything under MIN_HITS falls back to any-word matching, ranked
   by hits and weighted toward the title. */
const MIN_HITS=3;
function score(c,words){const hay=hayOf(c),title=(c.title+" "+c.moment).toLowerCase();
  return words.reduce((s,w)=>s+(hay.includes(w)?1:0)+(title.includes(w)?2:0),0)}
function results(){let list=D.CARDS.filter(c=>!fam||c.fam===fam);if(!q.trim())return list;
  const words=q.toLowerCase().trim().split(/\s+/),strict=list.filter(c=>words.every(w=>hayOf(c).includes(w)));
  if(strict.length>=MIN_HITS||words.length===1)return strict;
  const scored=list.map(c=>[c,score(c,words)]).filter(p=>p[1]>0).sort((a,b)=>b[1]-a[1]||a[0].n-b[0].n).map(p=>p[0]);
  return scored.length?scored:strict}

/* ---------- shell ---------- */
function shell(){document.body.innerHTML=`
<header class="top"><div class="bar">
  <div class="brand">Ask Book<small>40 ways to use AI while you learn to code — none of them "write my program"</small></div>
  <span class="count" id="count"></span>
  <button class="btn" id="rulesBtn">The 5 rules</button>
  <button class="btn" id="verifyBtn">Is it true?</button>
</div>
<div class="bar tabs">
  <button class="tab" data-v="course">The course · 8 runs</button>
  <button class="tab" data-v="deck">All 40 cards</button>
  <span class="tabhint" id="tabhint"></span>
</div></header>
<section class="ctrl" id="ctrl"></section>
<main id="main"></main>
<footer class="foot">Teacher's course, session plans and the capstone rubric: <a href="../ai-course/README.md">ai-course/</a> ·
Press <b>/</b> to search the deck, <b>Esc</b> to close.</footer>
<div class="scrim" id="scrim"></div>
<aside class="sheet" id="sheet" aria-hidden="true"></aside>
<div class="poster" id="poster"><div class="inner" id="posterIn"></div></div>`;
  $(".tabs").onclick=e=>{const b=e.target.closest(".tab");if(!b)return;view=b.dataset.v;close();render()};
  $("#scrim").onclick=close;$("#poster").onclick=e=>{if(e.target.id==="poster")$("#poster").classList.remove("open")};
  $("#rulesBtn").onclick=()=>poster("rules");$("#verifyBtn").onclick=()=>poster("verify");
  document.onkeydown=e=>{if(e.key==="Escape"){close();$("#poster").classList.remove("open")}
    else if(e.key==="/"&&$("#q")&&document.activeElement!==$("#q")){e.preventDefault();$("#q").focus()}}}

function knowBox(){return `<div class="knowbox"><h3>What I know so far</h3>
  <p>Tick what you've learned. Every prompt you copy starts with this line, so answers stop running ahead of you.</p>
  <div class="knows" id="knows">${D.KNOWS.map(k=>`<button class="know${st.knows[k.k]?" on":""}" data-k="${k.k}">${esc(k.label)}</button>`).join("")}</div></div>`}
function wireKnows(){const el=$("#knows");if(!el)return;
  el.onclick=e=>{const b=e.target.closest(".know");if(!b)return;st.knows[b.dataset.k]=!st.knows[b.dataset.k];save();
    render();if(cur)openCard(cur);else if(curRun)openRun(curRun)}}

function render(){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.v===view));
  view==="course"?renderCourse():renderDeck();
  wireKnows()}

/* ---------- COURSE view ---------- */
function renderCourse(){
  const now=currentRun(),total=C.reduce((s,r)=>s+r.steps.length,0),
        done=C.reduce((s,r)=>s+stepsDone(r.n),0);
  $("#tabhint").textContent="Start at run 1 and work down. Each run is one experiment you do in a chat window.";
  $("#count").textContent=`${done} of ${total} steps done`;
  $("#ctrl").innerHTML=`<div class="intro">
      <h2>Do these eight in order.</h2>
      <p>Each run gives you an experiment and a place to write what came back. Fill those in as you go —
         they are your <b>prompt log</b>, which is what your work is actually graded on.</p>
      <!-- Name the thing once, up front. A learner who meets "it" or "the AI"
           with no introduction spends the first run quietly unsure. -->
      <p class="whatis"><b>“The AI” here means a chat AI</b> — ChatGPT, Claude or Gemini, whichever you have open.
         Different companies, same kind of thing: you type, it writes back.</p>
      <div class="introbtns"><button class="btn" id="exportBtn">Export my log</button>
        <button class="btn" id="resetBtn">Reset progress</button></div>
    </div>${knowBox()}`;
  $("#exportBtn").onclick=exportLog;
  $("#resetBtn").onclick=()=>{if(confirm("Clear every tick and every note you've written? This cannot be undone."))
    {st.log={};st.tried={};save();render()}};
  $("#main").className="path";
  $("#main").innerHTML=C.map(r=>{const f=famOf(r.fam),d=stepsDone(r.n),n=r.steps.length,fin=runDone(r.n);
    return `<button class="run${fin?" done":""}${r.n===now?" now":""}" data-r="${r.n}" style="--fam:${f.hue}">
      <span class="runno">${fin?"✓":r.n}</span>
      <span class="runbody"><b>${esc(r.title)}</b><i>${esc(r.aim)}</i>
        <span class="runmeta">${r.steps.length} steps · cards ${r.cards.join(", ")}${r.n===now?" · <b>start here</b>":""}
          · <a class="slidelink" href="askbook-slides.html?run=${r.n}">slides first →</a></span>
        <span class="bar"><span style="width:${Math.round(d/n*100)}%"></span></span></span></button>`}).join("");
  /* The slide link sits inside the run button, so let it navigate instead of
     opening the sheet underneath it. */
  $("#main").onclick=e=>{if(e.target.closest(".slidelink"))return;
    const b=e.target.closest(".run");if(b)openRun(+b.dataset.r)}}

function openRun(n){
  const r=C.find(x=>x.n===n);if(!r)return;curRun=n;cur=null;const f=famOf(r.fam),lg=runLog(n),s=$("#sheet");
  s.style.setProperty("--fam",f.hue);
  s.innerHTML=`<div class="head"><div style="flex:1"><div class="no">RUN ${r.n} · ${esc(f.name)}</div>
      <h2>${esc(r.title)}</h2></div><button class="x" id="closeX" aria-label="close">×</button></div>
    <div class="body">
      <a class="mini ghost" href="askbook-slides.html?run=${r.n}">Teach me this first (slides) →</a>
      <div class="sec"><h5>What you're doing</h5><p>${esc(r.aim)}</p></div>
      <div class="sec"><h5>Why it matters</h5><p class="why">${esc(r.why)}</p></div>
      <ol class="steps">${r.steps.map((sp,i)=>{const done=!!(lg.steps[i]&&lg.steps[i].done),val=(lg.steps[i]&&lg.steps[i].text)||"";
        return `<li class="step${done?" done":""}" data-i="${i}">
          <label class="tick"><input type="checkbox" data-i="${i}"${done?" checked":""}><span>${esc(sp.do).replace(/\n/g,"<br>")}</span></label>
          ${sp.code?`<pre class="steppre">${esc(sp.code)}</pre>`:""}
          ${sp.ask?`<button class="mini" data-ask="${sp.ask}">Copy the card ${sp.ask} prompt</button>
                    <button class="mini ghost" data-open="${sp.ask}">See card ${sp.ask}</button>`:""}
          ${sp.record?`<label class="rec"><span>${esc(sp.record)}</span>
            <textarea data-i="${i}" rows="2" placeholder="write what happened…">${esc(val)}</textarea></label>`:""}
        </li>`}).join("")}</ol>
      <div class="sec"><h5>You've done it when</h5><p class="act">${esc(r.win)}</p></div>
      <div class="sec"><h5>Cards used in this run</h5><div class="chips">${r.cards.map(cn=>{const c=cardOf(cn);
        return `<button class="chip" data-open="${cn}">${c.fam}${cn} · ${esc(c.title)}</button>`}).join("")}</div></div>
      ${r.extras&&r.extras.length?sec("If you want more of this",`<div class="chips">${r.extras.map(cn=>{const c=cardOf(cn);
        return `<button class="chip ghost" data-open="${cn}">${c.fam}${cn} · ${esc(c.title)}</button>`}).join("")}</div>`):""}
    </div>`;
  s.classList.add("open");s.setAttribute("aria-hidden","false");$("#scrim").classList.add("open");s.scrollTop=0;
  $("#closeX").onclick=close;
  s.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.onchange=()=>{
    const i=cb.dataset.i;lg.steps[i]=Object.assign({},lg.steps[i],{done:cb.checked});save();
    cb.closest(".step").classList.toggle("done",cb.checked);renderCourse()});
  s.querySelectorAll(".rec textarea").forEach(ta=>ta.oninput=()=>{
    const i=ta.dataset.i;lg.steps[i]=Object.assign({},lg.steps[i],{text:ta.value});save()});
  s.querySelectorAll("[data-ask]").forEach(b=>b.onclick=()=>copy(fullPrompt(cardOf(+b.dataset.ask)),b,b.textContent));
  s.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openCard(+b.dataset.open,n))}

/* The log is the deliverable, so it leaves the browser as a file the learner
   can hand in — localStorage alone is one cleared cache away from gone. */
function logMarkdown(){
  const lines=["# My prompt log — Ask Book","","What I know: "+(knownLabels().join(", ")||"print()"),""];
  C.forEach(r=>{const lg=st.log[r.n];if(!lg||!Object.keys(lg.steps).length)return;
    lines.push(`## Run ${r.n} — ${r.title}`,"",`Goal: ${r.aim}`,"");
    r.steps.forEach((sp,i)=>{const e=lg.steps[i];if(!e||(!e.done&&!e.text))return;
      lines.push(`### Step ${i+1}${e.done?" ✓":""}`,sp.do.replace(/\n/g,"  \n"),"");
      if(sp.code)lines.push("```python",sp.code,"```","");
      if(sp.record)lines.push(`**${sp.record}**`,"",e.text?e.text:"_(not written yet)_","")});
    lines.push(runDone(r.n)?`**Done:** ${r.win}`:"_(run not finished)_","")});
  if(lines.length<=4)lines.push("_Nothing written yet — open run 1 and start._");
  return lines.join("\n")}
window.askbookLog=logMarkdown;   /* so a teacher (or a test) can read the log without downloading */
function exportLog(){
  const blob=new Blob([logMarkdown()],{type:"text/markdown"}),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="my-prompt-log.md";a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),4000)}

/* ---------- DECK view ---------- */
function renderDeck(){
  $("#tabhint").textContent="Already know the path? Search by what's happening to you right now.";
  $("#ctrl").innerHTML=`<input class="search" id="q" value="${esc(q)}" autocomplete="off"
      placeholder="What's happening? e.g. red error, infinite loop, wrong answer, nothing to practise…">
    <div class="fams" id="fams">${D.FAMS.map(f=>`<button class="fam${f.k===fam?" on":""}" data-f="${f.k}" style="--fam:${f.hue}">
      <span class="dot"></span>${f.k}. ${esc(f.name)}</button>`).join("")}</div>${knowBox()}`;
  $("#q").oninput=e=>{q=e.target.value;renderDeck();wireKnows()};
  $("#fams").onclick=e=>{const b=e.target.closest(".fam");if(!b)return;fam=fam===b.dataset.f?"":b.dataset.f;renderDeck();wireKnows()};
  const list=results();
  $("#main").className="grid";
  /* Every card says where it sits in the course, so the deck never reads as
     40 equally-urgent options — "extra" means: useful, but not on the path. */
  $("#main").innerHTML=list.length?list.map(c=>{const f=famOf(c.fam),
    run=C.find(r=>r.cards.includes(c.n)),ex=run?null:C.find(r=>(r.extras||[]).includes(c.n));return `
    <button class="card${st.tried[c.n]?" done":""}" data-n="${c.n}" style="--fam:${f.hue}">
      <div class="no">${c.fam}${c.n} · ${esc(f.name)}</div>
      <h4>${esc(c.title)}</h4><p>${esc(c.moment)}</p>
      ${run?`<span class="runtag">run ${run.n}</span>`:ex?`<span class="runtag extra">run ${ex.n} extra</span>`:""}</button>`}).join("")
    :`<div class="empty">Nothing matches “${esc(q)}”.<br>Try a word from your problem: <b>error</b>, <b>loop</b>, <b>stuck</b>, <b>practice</b>, <b>slow</b>, <b>messy</b>.</div>`;
  $("#main").onclick=e=>{const b=e.target.closest(".card");if(b)openCard(+b.dataset.n)};
  const done=Object.values(st.tried).filter(Boolean).length;
  $("#count").textContent=`${list.length} of ${D.CARDS.length} shown · ${done} tried`}

function sec(h,b){return `<div class="sec"><h5>${h}</h5>${b}</div>`}
function openCard(n,backTo){
  const c=cardOf(n);if(!c)return;cur=n;const f=famOf(c.fam),run=C.find(r=>r.cards.includes(n)),s=$("#sheet");
  s.style.setProperty("--fam",f.hue);
  s.innerHTML=`<div class="head"><div style="flex:1"><div class="no">${c.fam}${c.n} · ${esc(f.name)}</div>
      <h2>${esc(c.title)}</h2></div><button class="x" id="closeX" aria-label="close">×</button></div>
    <div class="body">
      ${backTo?`<button class="mini ghost" id="backRun">← back to run ${backTo}</button>`:
        run?`<button class="mini ghost" id="backRun" data-r="${run.n}">used in run ${run.n} — open it</button>`:""}
      ${sec("The moment",`<p>${esc(c.moment)}</p>`)}
      ${sec("Copy this",`<div class="promptbox"><pre id="pbox">${esc(fullPrompt(c))}</pre></div>
        <button class="copy" id="copyBtn">Copy prompt</button>`)}
      ${c.code?sec("Example",`<pre>${esc(c.code)}</pre>`):""}
      ${sec("What comes back",`<p>${esc(c.reply)}</p>`)}
      ${sec("What you do with it",`<p class="act">${esc(c.act)}</p>`)}
      ${sec("Trap",`<p class="trap">${esc(c.trap)}</p>`)}
      <button class="tried${st.tried[n]?" on":""}" id="triedBtn">${st.tried[n]?"✓ Tried this one":"Mark as tried"}</button>
    </div>`;
  s.classList.add("open");s.setAttribute("aria-hidden","false");$("#scrim").classList.add("open");s.scrollTop=0;
  $("#closeX").onclick=close;
  const back=$("#backRun");if(back)back.onclick=()=>openRun(backTo||+back.dataset.r);
  $("#copyBtn").onclick=e=>copy(fullPrompt(c),e.target,"Copy prompt");
  $("#triedBtn").onclick=()=>{st.tried[n]=!st.tried[n];save();openCard(n,backTo);if(view==="deck")renderDeck()}}

function close(){cur=null;curRun=null;$("#sheet").classList.remove("open");
  $("#sheet").setAttribute("aria-hidden","true");$("#scrim").classList.remove("open")}

function poster(kind){
  $("#posterIn").innerHTML=kind==="rules"
    ?`<h2>The five rules of the room</h2><p class="lead">An AI can make you look like you can code long before you can.
       These five are how you get the help without paying that price.</p><ol>${
       D.RULES.map(r=>`<li><b>${esc(r)}</b></li>`).join("")}</ol>`
    :`<h2>Is this answer true?</h2><p class="lead">It sounds equally confident when it is right and when it is wrong,
       so you cannot decide by how it feels. Do these instead — about a minute.</p><ol>${
       D.VERIFY.map(v=>`<li><b>${esc(v.step)}</b><span>${esc(v.body)}</span></li>`).join("")}</ol>`;
  /* Esc and the scrim both close it, but a phone has no Esc and the scrim
     strip is thin — the button is the only reliable exit there. */
  $("#posterIn").insertAdjacentHTML("beforeend",`<button class="copy" id="posterClose">Close</button>`);
  $("#posterClose").onclick=()=>$("#poster").classList.remove("open");
  $("#poster").classList.add("open")}

shell();render();
/* The slides' last card links here as askbook.html#run3 — land straight in
   that run rather than dropping the learner on the path to hunt for it. */
(function fromHash(){const m=/^#run(\d+)$/.exec(location.hash);if(m)openRun(+m[1])})();
window.addEventListener("hashchange",()=>{const m=/^#run(\d+)$/.exec(location.hash);if(m)openRun(+m[1])});
