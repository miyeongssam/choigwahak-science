/* 최과학 과학 앱 공통 스크립트 — 모든 하위 앱이 ../common/common.js 로 불러 씀
   CS.store / CS.shuffle / CS.toast / CS.QuizRound(문제 풀이 화면) */
(function(){
"use strict";
const CS = window.CS = {};
const here = document.currentScript ? document.currentScript.src : location.href;

// 서비스워커 등록 (앱 전체를 오프라인에서도 쓰게 함)
if ("serviceWorker" in navigator) {
  const sw = new URL("../sw.js", here), scope = new URL("../", here);
  window.addEventListener("load", () => navigator.serviceWorker.register(sw.href, { scope: scope.href }).catch(() => {}));
}

// 저장 (사파리 개인정보 모드 등에서 실패해도 앱은 그대로 동작)
CS.store = {
  get(k, d){ try{ const v = localStorage.getItem("cs_" + k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("cs_" + k, JSON.stringify(v)); }catch(e){} }
};

CS.shuffle = function(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
CS.randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
CS.pick = a => a[Math.floor(Math.random() * a.length)];
CS.esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const NUM = ["①","②","③","④","⑤","⑥"];
CS.NUM = NUM;

CS.toast = function(msg){
  let t = document.querySelector(".toast");
  if(!t){ t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 1500);
};

/* 문제 풀이 화면
   question 형식:
     { id, q:"문제(html)", fig:"그림(html, 선택)", choices:["보기",...], answer:정답번호(0부터), exp:"해설(html)" }
     { id, type:"ox", q, answer:"O"|"X", exp }
     { id, type:"card", q, a:"정답(html)", exp }   ← 스스로 채점
   opts: { make:(n)=>문제배열, count:10, onResult:(q,맞음여부)=>{}, endButtons:[{label,onClick}] }
   끝나면: 점수 → 「틀린 것만 다시 섞어 풀기」를 다 맞을 때까지 반복 → 「새 문제」 */
CS.QuizRound = function(box, opts){
  const count = opts.count || 10;
  let list = [], i = 0, wrong = [], right = 0, round = 1, total = 0;

  function start(qs, isRetry){
    list = CS.shuffle(qs); i = 0; wrong = []; right = 0; total = list.length;
    if(!isRetry) round = 1;
    show();
  }
  function show(){
    if(i >= list.length) return done();
    const q = list[i];
    let h = `<div class="qz-meta"><span>${round > 1 ? "틀린 문제 다시 · " + round + "회차" : "문제"} ${i+1} / ${total}</span><span>맞힘 ${right}</span></div>
      <div class="qz-prog"><div style="width:${i/total*100}%"></div></div>
      <div class="qz-card">${q.fig ? `<div class="qz-fig">${q.fig}</div>` : ""}<div class="qz-q">${q.q}</div>`;
    if(q.type === "ox"){
      h += `<div class="qz-ch ox"><button data-v="O" style="color:#86efac">O</button><button data-v="X" style="color:#fca5a5">X</button></div>`;
    } else if(q.type === "card"){
      h += `<button class="btn full" id="qzReveal">정답 보기</button>`;
    } else {
      h += `<div class="qz-ch">` + q.choices.map((c, k) => `<button data-v="${k}"><span class="n">${NUM[k]}</span><span>${c}</span></button>`).join("") + `</div>`;
    }
    h += `<div id="qzAfter"></div></div>`;
    box.innerHTML = h;
    box.querySelectorAll(".qz-ch button").forEach(b => b.onclick = () => choose(q, b.dataset.v));
    const rv = box.querySelector("#qzReveal");
    if(rv) rv.onclick = () => {
      rv.remove();
      box.querySelector("#qzAfter").innerHTML = `<div class="qz-exp"><div class="res">정답</div><div style="font-size:17px;font-weight:600;color:#fff;margin-bottom:6px">${q.a}</div>${q.exp ? q.exp : ""}</div>
        <div class="grid2" style="margin-top:12px"><button class="btn ghost" id="qzNo" style="border-color:var(--no)">✕ 모름</button><button class="btn ghost" id="qzYes" style="border-color:var(--ok)">✓ 알았음</button></div>`;
      box.querySelector("#qzNo").onclick = () => { mark(q, false); next(); };
      box.querySelector("#qzYes").onclick = () => { mark(q, true); next(); };
    };
  }
  function choose(q, v){
    const btns = box.querySelectorAll(".qz-ch button");
    if(btns[0].disabled) return;
    btns.forEach(b => b.disabled = true);
    const ans = q.type === "ox" ? q.answer : String(q.answer);
    const ok = v === ans;
    btns.forEach(b => { if(b.dataset.v === ans) b.classList.add("right"); else if(b.dataset.v === v) b.classList.add("wrong"); });
    mark(q, ok);
    const ansTxt = q.type === "ox" ? q.answer : NUM[q.answer];
    box.querySelector("#qzAfter").innerHTML = `<div class="qz-exp"><div class="res ${ok?"ok":"no"}">${ok ? "정답!" : "오답 — 정답은 " + ansTxt}</div>${q.exp || ""}</div>
      <button class="btn full" id="qzNext" style="margin-top:12px">${i+1 < list.length ? "다음 →" : "결과 보기"}</button>`;
    box.querySelector("#qzNext").onclick = next;
    box.querySelector("#qzNext").scrollIntoView({behavior:"smooth", block:"nearest"});
  }
  function mark(q, ok){ if(ok) right++; else wrong.push(q); if(opts.onResult) opts.onResult(q, ok); }
  function next(){ i++; show(); window.scrollTo({top:0}); }
  function done(){
    const pct = Math.round(right / total * 100);
    let h = `<div class="qz-card qz-done"><div class="muted">${round > 1 ? round + "회차 (틀린 문제 다시)" : "결과"}</div>
      <div class="big" style="color:${pct>=80?"var(--ok)":pct>=50?"var(--warn)":"var(--no)"}">${right} / ${total}</div>`;
    if(wrong.length){
      h += `<div class="muted">틀린 문제 ${wrong.length}개 — 다 맞을 때까지 섞어서 다시 풀어 봐요.</div>
        <button class="btn full" id="qzRetry" style="margin-top:14px">🔁 틀린 것만 다시 섞어 풀기 (${wrong.length})</button>`;
    } else {
      h += `<div style="color:var(--ok);font-weight:600">${round > 1 ? "틀렸던 문제를 모두 맞혔어요!" : "모두 맞혔어요!"}</div>`;
    }
    if(opts.make) h += `<button class="btn ${wrong.length?"ghost":""} full" id="qzNew" style="margin-top:8px">🔀 새로 섞어서 ${count}문제</button>`;
    (opts.endButtons || []).forEach((b, k) => h += `<button class="btn ghost full" data-eb="${k}" style="margin-top:8px">${b.label}</button>`);
    h += `</div>`;
    box.innerHTML = h;
    const r = box.querySelector("#qzRetry"); if(r) r.onclick = () => { round++; start(wrong, true); };
    const n = box.querySelector("#qzNew"); if(n) n.onclick = () => { const qs = opts.make(count); if(qs && qs.length) start(qs, false); };
    box.querySelectorAll("[data-eb]").forEach(b => b.onclick = () => opts.endButtons[+b.dataset.eb].onClick());
  }
  return { start: (qs) => start(qs || opts.make(count), false) };
};

/* 5지선다 보기 만들기: 정답 + 오답 후보 → 섞인 보기와 정답 번호 */
CS.makeChoices = function(answer, distractors, n){
  n = n || 5;
  const seen = new Set([String(answer)]), pool = [];
  for(const d of distractors){ const s = String(d); if(!seen.has(s)){ seen.add(s); pool.push(d); } if(pool.length >= n-1) break; }
  const all = CS.shuffle([answer].concat(pool));
  return { choices: all, answer: all.findIndex(x => String(x) === String(answer)) };
};
})();
