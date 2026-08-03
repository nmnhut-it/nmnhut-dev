/* Ask Book slides — renders one deck (?run=N, default 1) from
   askbook-slides-data.js into reveal.js sections.
   Why a deck at all: the Ask Book hands a learner 40 prompts and 8 runs, and
   for a beginner that is still "here is a tool, good luck". The slides teach
   the same eight runs slowly — one idea per slide, prompts assembled a piece
   at a time so they see WHY each sentence is there, a check question before
   each hands-on. Deck teaches; the run is where they do it. */
const S=window.ASKBOOK_SLIDES,RUNS=window.ASKBOOK_COURSE,
      run=Math.min(8,Math.max(1,parseInt(new URLSearchParams(location.search).get("run"),10)||1));
const esc=s=>String(s==null?"":s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
/* Slide copy carries <b>/<code>/<i> and <br> on purpose (emphasis is teaching,
   not decoration), so text fields are trusted authored markup — everything
   that could ever hold learner input goes through esc() instead. */
const rich=s=>String(s==null?"":s);

const T={
 title:s=>`<div class="kicker">${esc(s.k)}</div><h1>${rich(s.h)}</h1><p class="sub">${rich(s.sub)}</p>`,
 say:s=>`<h2>${rich(s.h)}</h2><ul class="lines">${s.lines.map(l=>`<li class="fragment">${rich(l)}</li>`).join("")}</ul>
        ${s.note?`<p class="note fragment">${rich(s.note)}</p>`:""}`,
 code:s=>`<h2>${rich(s.h)}</h2><pre><code>${esc(s.code)}</code></pre>
        ${s.note?`<p class="note fragment">${rich(s.note)}</p>`:""}`,
 ask:s=>`<h2>${rich(s.h)}</h2><div class="parts">${s.parts.map(p=>
          `<div class="part fragment"><span class="lbl">${rich(p.label)}</span><span class="txt">${esc(p.text)}</span></div>`).join("")}</div>
        ${s.note?`<p class="note fragment">${rich(s.note)}</p>`:""}`,
 reply:s=>`<h2>${rich(s.h)}</h2><div class="replybox">${esc(s.reply)}</div>
        ${s.note?`<p class="note fragment">${rich(s.note)}</p>`:""}`,
 quiz:s=>`<h2>${rich(s.q)}</h2><div class="quiz" data-ans="${s.ans}">${s.opts.map((o,i)=>
          `<button class="opt" data-i="${i}">${rich(o)}</button>`).join("")}</div>
        <div class="why">${rich(s.why)}</div>`,
 do:s=>`<h2>${rich(s.h)}</h2><ol class="steps">${s.steps.map(x=>`<li class="fragment">${rich(x)}</li>`).join("")}</ol>
        <p class="win fragment">${rich(s.win)}</p>`,
 recap:s=>`<h2>${rich(s.h)}</h2><ol class="points">${s.points.map(p=>`<li class="fragment">${rich(p)}</li>`).join("")}</ol>`,
 cta:s=>`<h2>${rich(s.h)}</h2><p>${rich(s.text)}</p>
        <a class="ctabtn" href="askbook.html#run${s.run}">Open run ${s.run} in the Ask Book →</a>`};

document.getElementById("slides").innerHTML=(S[run]||[]).map(s=>`<section>${T[s.t](s)}</section>`).join("");

/* Quiz: answering is the point, so clicking marks right/wrong and always
   explains — a wrong click should teach, not just buzz. */
document.querySelectorAll(".quiz").forEach(q=>{
  q.onclick=e=>{const b=e.target.closest(".opt");if(!b)return;
    const right=+q.dataset.ans,picked=+b.dataset.i;
    q.querySelectorAll(".opt").forEach((o,i)=>{if(i===right)o.classList.add("right");else if(i===picked)o.classList.add("wrong")});
    q.parentElement.querySelector(".why").classList.add("show")}});

const r=RUNS.find(x=>x.n===run)||{title:""};
document.getElementById("decknav").innerHTML=
  `<span class="title">Run ${run} · ${esc(r.title)}</span>`+
  RUNS.map(x=>`<a href="?run=${x.n}"${x.n===run?' class="on"':""} title="${esc(x.title)}">${x.n}</a>`).join("")+
  `<a href="askbook.html">Ask Book</a>`;
document.title=`Run ${run} · ${r.title} — Ask Book slides`;

Reveal.initialize({hash:true,slideNumber:"c/t",controls:true,progress:true,
  width:1180,height:740,margin:.06,minScale:.2,maxScale:1.6,
  transition:"slide",transitionSpeed:"fast"});
