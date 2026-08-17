(()=>{
  'use strict';
  const VERSION='listening-history-v1';
  const view=document.getElementById('assistantView');
  const tab=document.querySelector('.navtab[data-view="assistantView"]');
  if(!view||!tab||!Array.isArray(data))return;

  tab.textContent='🎧 Escuchados';
  tab.title='Historial de discos escuchados y sugerencia para la próxima escucha';

  const css=document.createElement('style');
  css.textContent=`
    .listenDash{display:grid;gap:14px}
    .listenStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .listenStat{padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:#101722}
    .listenStat b{display:block;font-size:1.45rem;color:#f4f7fb}.listenStat span{font-size:.78rem;color:var(--muted)}
    .nextListen{padding:16px;border:1px solid #506337;border-radius:14px;background:linear-gradient(180deg,#172015,#10170f)}
    .nextListenTitle{font-size:1.2rem;font-weight:850;margin:5px 0 2px}.nextListenArtist{color:#a8d9ff;font-weight:750}
    .nextListenReason{margin-top:8px;line-height:1.5;color:#d6decf}.nextListenMeta{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
    .listenToolbar{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.listenToolbar .smallbtn{margin:0}
    .heardList{display:grid;gap:9px;margin-top:12px}.heardRow{display:grid;grid-template-columns:110px 1fr auto;gap:12px;align-items:start;padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:#0f151f}
    .heardDate{font-weight:800;color:#ffd37a;white-space:nowrap}.heardAlbum{font-weight:800}.heardArtist{color:#9db8dd;font-size:.86rem;margin-top:2px}.heardComment{margin-top:7px;white-space:pre-wrap;line-height:1.4;color:#dce3ed}.heardMeta{color:var(--muted);font-size:.8rem;margin-top:4px}
    .heardEmpty{padding:18px;border:1px dashed #39485e;border-radius:12px;color:var(--muted)}
    @media(max-width:720px){.listenStats{grid-template-columns:1fr}.heardRow{grid-template-columns:1fr}.heardRow .smallbtn{justify-self:start}}
  `;
  document.head.appendChild(css);

  const esc=s=>typeof escapeHTML==='function'?escapeHTML(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const yearOf=v=>{const m=String(v||'').match(/(?:18|19|20)\d{2}/);return m?Number(m[0]):null;};
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const genreWords=r=>new Set(norm(r?.genre||'').split(' ').filter(w=>w.length>3&&!['rock','music','musica','varios','various'].includes(w)));
  const dateKey=n=>String(n?.date||n?.createdAt||'');
  function fmtDate(v){
    if(!v)return 'Sin fecha';
    const m=String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(!m)return esc(v);
    return `${m[3]}/${m[2]}/${m[1]}`;
  }
  function entries(){
    const out=[];
    data.forEach(r=>{
      const p=typeof ensurePersonal==='function'?ensurePersonal(r.id):(personal?.[r.id]||{});
      (Array.isArray(p?.notes)?p.notes:[]).forEach((n,index)=>out.push({r,n,index}));
    });
    out.sort((a,b)=>dateKey(b.n).localeCompare(dateKey(a.n)));
    return out;
  }
  function usable(r){
    if(!r||r.confidence==='Baja')return false;
    const all=norm(`${r.artist} ${r.title} ${r.format} ${r.support_kind} ${r.type}`);
    if(/pendiente|sin identificar|no musical|software|dvd de datos|cd rom/.test(all))return false;
    return true;
  }
  function recommendationPool(evts){
    const listened=new Set(evts.map(x=>x.r.id));
    const last=evts[0]?.r||null;
    const lastGenres=genreWords(last);
    const lastYear=yearOf(last?.year);
    const candidates=data.filter(usable).map(r=>{
      let score=0;const reasons=[];
      const unseen=!listened.has(r.id);
      if(unseen){score+=45;reasons.push('aún no lo has registrado como escuchado');}else score-=12;
      if(last&&r.id!==last.id){
        const g=genreWords(r);let overlap=0;g.forEach(w=>{if(lastGenres.has(w))overlap++;});
        if(overlap){score+=overlap*16;reasons.push(`comparte el entorno de ${esc(r.genre||'género')} con tu última escucha`);}
        const y=yearOf(r.year);if(lastYear&&y){const d=Math.abs(lastYear-y);if(d<=2){score+=13;reasons.push('es prácticamente de la misma época');}else if(d<=7){score+=8;reasons.push('está muy cerca cronológicamente');}else if(d<=15)score+=3;}
        if(norm(r.artist)!==norm(last.artist))score+=5;else score-=5;
      }
      if(r.confidence==='Alta')score+=8;
      if(/album|álbum|lp|cd/i.test(`${r.type} ${r.format}`))score+=3;
      return {r,score,reasons};
    }).filter(x=>!last||x.r.id!==last.id).sort((a,b)=>b.score-a.score||String(a.r.artist).localeCompare(String(b.r.artist),'es'));
    return candidates;
  }
  let recOffset=0;
  function renderRecommendation(evts){
    const holder=document.getElementById('nextListenHolder');if(!holder)return;
    const pool=recommendationPool(evts);
    if(!pool.length){holder.innerHTML='<div class="heardEmpty">No hay suficientes fichas identificadas para recomendar otra escucha.</div>';return;}
    const pick=pool[recOffset%Math.min(pool.length,12)];const r=pick.r;
    let reason='Una opción sólida para seguir recorriendo tu propia colección.';
    if(pick.reasons.length)reason='Te lo propongo porque '+pick.reasons.slice(0,2).join(' y ')+'.';
    const p=typeof ensurePersonal==='function'?ensurePersonal(r.id):(personal?.[r.id]||{});
    holder.innerHTML=`<div class="nextListen"><div class="eyebrow">Qué escuchar ahora</div><div class="nextListenArtist">${esc(r.artist)}</div><div class="nextListenTitle">${esc(r.title)}</div><div class="nextListenReason">${reason}</div><div class="nextListenMeta"><span class="pill">${esc(r.year||'Año pendiente')}</span><span class="pill">${esc(r.genre||'Género pendiente')}</span>${Number(p?.rating)?`<span class="pill">${'★'.repeat(Math.max(0,Math.min(5,Number(p.rating))))}</span>`:''}</div><div class="listenToolbar"><button class="smallbtn primarybtn" id="openRecommendation">💿 Abrir ficha</button><button class="smallbtn" id="anotherRecommendation">↻ Otra recomendación</button></div></div>`;
    document.getElementById('openRecommendation').onclick=()=>openDetail(r.id);
    document.getElementById('anotherRecommendation').onclick=()=>{recOffset++;renderRecommendation(evts);};
  }
  function renderHistory(){
    const evts=entries();
    const unique=new Set(evts.map(x=>x.r.id));
    const last=evts[0];
    view.innerHTML=`<section class="card assistantPanel listenDash"><div><div class="eyebrow">Tu recorrido por la colección</div><h2 style="margin:6px 0">🎧 Discos escuchados</h2><div class="hint">Historial construido a partir de tus entradas del diario. La recomendación se calcula únicamente con los discos de tu propia colección.</div></div><div class="listenStats"><div class="listenStat"><b>${evts.length}</b><span>escuchas registradas</span></div><div class="listenStat"><b>${unique.size}</b><span>discos distintos escuchados</span></div><div class="listenStat"><b>${last?fmtDate(last.n.date):'—'}</b><span>última escucha</span></div></div><div id="nextListenHolder"></div><div><div class="eyebrow">Historial cronológico</div><div id="heardList" class="heardList"></div></div></section>`;
    renderRecommendation(evts);
    const list=document.getElementById('heardList');
    if(!evts.length){list.innerHTML='<div class="heardEmpty">Todavía no hay escuchas registradas. Cuando añadas una desde la ficha de un disco o desde 📓 Diario, aparecerá aquí.</div>';return;}
    list.innerHTML=evts.map(({r,n})=>`<article class="heardRow"><div><div class="heardDate">${fmtDate(n.date)}</div>${Number(n.rating)?`<div class="heardMeta">${'★'.repeat(Math.max(0,Math.min(5,Number(n.rating))))}</div>`:''}</div><div><div class="heardAlbum">${esc(r.title)}</div><div class="heardArtist">${esc(r.artist)}</div>${String(n.text||'').trim()?`<div class="heardComment">${esc(n.text)}</div>`:'<div class="heardMeta">Sin comentario</div>'}</div><button class="smallbtn" data-open-heard="${esc(r.id)}">Ver disco</button></article>`).join('');
    list.querySelectorAll('[data-open-heard]').forEach(b=>b.onclick=()=>openDetail(b.dataset.openHeard));
  }

  tab.addEventListener('click',()=>setTimeout(renderHistory,0));
  if(typeof renderDiary==='function'){
    const beforeDiary=renderDiary;
    renderDiary=function(){const out=beforeDiary.apply(this,arguments);if(view.classList.contains('active'))renderHistory();return out;};
  }
  window.addEventListener('storage',e=>{if(e.key===PERSONAL_KEY&&view.classList.contains('active'))renderHistory();});

  renderHistory();
  document.documentElement.dataset.listeningHistory=VERSION;
})();
