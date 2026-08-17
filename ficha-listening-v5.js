(()=>{
  'use strict';
  const VERSION='ficha-listening-v6';

  const css=document.createElement('style');
  css.textContent=`
    .fichaSaveMsgV5{display:inline-block;margin-left:9px;font-size:.85rem;color:#88e6b2;vertical-align:middle}
    .fichaSaveMsgV5.error{color:#ffb7c0}
  `;
  document.head.appendChild(css);

  function localDateV5(){
    const d=new Date(),p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }
  function persistAndVerify(rid,entry){
    localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
    const stored=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};
    const notes=stored?.[rid]?.notes;
    if(!Array.isArray(notes))throw new Error('No se ha creado la lista de escuchas');
    const ok=notes.some(n=>n&&((entry.id&&n.id===entry.id)||(n.createdAt===entry.createdAt&&String(n.text||'')===String(entry.text||''))));
    if(!ok)throw new Error('El navegador no confirmó el guardado del comentario');
    personal=stored;
  }
  function setMsg(root,text,error=false){
    if(!root)return;
    let msg=root.querySelector('.fichaSaveMsgV5');
    if(!msg){msg=document.createElement('span');msg.className='fichaSaveMsgV5';const btn=root.querySelector('#saveNoteBtn');if(btn)btn.insertAdjacentElement('afterend',msg);}
    if(msg){msg.textContent=text;msg.classList.toggle('error',error);}
  }

  function bindFichaListeningV5(r){
    const root=document.querySelector(`[data-editor="${r.id}"]`);if(!root)return;
    const date=root.querySelector('#noteDate');if(date&&!date.value)date.value=localDateV5();
    const btn=root.querySelector('#saveNoteBtn');
    if(btn){
      btn.type='button';
      btn.onclick=(ev)=>{
        ev.preventDefault();ev.stopPropagation();
        const text=(root.querySelector('#noteText')?.value||'').trim();
        const when=root.querySelector('#noteDate')?.value||localDateV5();
        try{
          const p=ensurePersonal(r.id);if(!Array.isArray(p.notes))p.notes=[];
          const createdAt=new Date().toISOString();
          const entry={id:`listen-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,date:when,text,rating:Number(p.rating)||0,createdAt};
          p.notes.push(entry);persistAndVerify(r.id,entry);
          openDetail(r.id);
          const fresh=document.querySelector(`[data-editor="${r.id}"]`);setMsg(fresh,text?'Comentario guardado ✓':'Escucha guardada ✓');
          try{renderDiary();}catch(e){console.warn('renderDiary',e);}try{renderFavorites();}catch(e){console.warn('renderFavorites',e);}
        }catch(e){console.error('No se pudo guardar la escucha desde la ficha',e);setMsg(root,'No se pudo guardar: '+(e?.message||e),true);}
      };
    }
    root.querySelectorAll('.star[data-rate]').forEach(star=>{
      star.onclick=(ev)=>{
        ev.preventDefault();ev.stopPropagation();
        try{
          const p=ensurePersonal(r.id);p.rating=Number(star.dataset.rate)||0;
          localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
          const stored=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};
          if(Number(stored?.[r.id]?.rating)!==Number(p.rating))throw new Error('No se confirmó el guardado');
          personal=stored;root.querySelectorAll('.star[data-rate]').forEach(s=>s.classList.toggle('on',Number(s.dataset.rate)<=p.rating));setMsg(root,'Valoración guardada ✓');
        }catch(e){console.error(e);setMsg(root,'No se pudo guardar la valoración',true);}
      };
    });
  }

  const openBeforeV5=openDetail;
  openDetail=function(id){openBeforeV5(id);const r=data.find(x=>x.id===id);if(r)bindFichaListeningV5(r);};
  const opened=document.querySelector('[data-editor]');if(opened){const r=data.find(x=>x.id===opened.dataset.editor);if(r)bindFichaListeningV5(r);}
  document.documentElement.dataset.fichaListening=VERSION;
})();

(()=>{
  'use strict';
  const VERSION='artist-context-v1';
  const CACHE_KEY='juan_music_artist_context_v1';
  const css=document.createElement('style');
  css.textContent=`
    .artistContextBox{margin:18px 0 4px;padding:15px 16px;border:1px solid #36506b;background:linear-gradient(180deg,#121c29,#0e151f);border-radius:13px}
    .artistContextBox b{color:#9fd2ff}.artistContextText{line-height:1.55;color:#dfe6f1;margin-top:7px}
    .artistContextGrid{display:grid;grid-template-columns:140px 1fr;gap:7px 12px;margin-top:11px;font-size:.9rem}
    .artistContextGrid dt{color:#8fa0b8;font-weight:700}.artistContextGrid dd{margin:0;color:#e8edf5}
    .artistMembers{margin:0;padding-left:18px}.artistMembers li{margin:4px 0}.artistLoading{color:#9eabc0;font-size:.9rem;margin-top:7px}
    .artistSource{display:inline-block;margin-top:11px;font-size:.78rem;color:#9fd2ff;text-decoration:none;border:1px solid #31445c;border-radius:999px;padding:5px 8px}
    @media(max-width:620px){.artistContextGrid{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  const esc=s=>typeof escapeHTML==='function'?escapeHTML(s):String(s??'');
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  let cache={};try{cache=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')||{};}catch(e){}
  let queue=Promise.resolve(),last=0;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function mb(url){const run=async()=>{const w=Math.max(0,1100-(Date.now()-last));if(w)await sleep(w);try{const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('MusicBrainz '+r.status);return r.json();}finally{last=Date.now();}};const p=queue.then(run,run);queue=p.catch(()=>{});return p;}
  function score(name,a){const q=norm(name),n=norm(a?.name),s=norm(a?.['sort-name']);if(q===n)return 100;if(q===s)return 96;return (n.includes(q)||q.includes(n))?60:0;}
  async function getInfo(name){
    const k=norm(name);if(cache[k])return cache[k];
    if(!k||/^(varios artistas|various artists|pendiente|desconocido|unknown)$/.test(k))return {description:'Este registro reúne varios artistas o todavía no tiene un intérprete único identificado.'};
    const q='artist:"'+String(name).replace(/["\\]/g,' ')+'"';
    const sr=await mb('https://musicbrainz.org/ws/2/artist/?fmt=json&limit=8&query='+encodeURIComponent(q));
    const best=(sr.artists||[]).map(a=>({a,s:score(name,a)})).sort((x,y)=>y.s-x.s)[0];
    if(!best||best.s<80)return {description:'No se ha encontrado una coincidencia suficientemente segura para completar automáticamente esta ficha del artista.'};
    const a=await mb('https://musicbrainz.org/ws/2/artist/'+best.a.id+'?fmt=json&inc=artist-rels+instrument-rels+tags+genres');
    const origin=a['begin-area']?.name||a.area?.name||'';
    const begin=String(a['life-span']?.begin||'').slice(0,4),end=String(a['life-span']?.end||'').slice(0,4);
    const tags=[...(a.genres||[]),...(a.tags||[])].sort((x,y)=>(y.count||0)-(x.count||0)).map(x=>x.name).filter(Boolean);
    const genres=[...new Set(tags)].slice(0,5);
    const members=(a.relations||[]).filter(r=>r['target-type']==='artist'&&/member of band|founder/i.test(String(r.type||''))).map(r=>({name:r.artist?.name||'',role:(r.attributes||[]).join(', ')})).filter(x=>x.name).slice(0,10);
    const instruments=[...new Set((a.relations||[]).filter(r=>r['target-type']==='instrument').map(r=>r.instrument?.name||r['target-credit']||'').filter(Boolean))].slice(0,8);
    const type=/group/i.test(a.type||'')?'grupo':/person/i.test(a.type||'')?'artista':'proyecto musical';
    let description=`${name} es un ${type}`;if(origin)description+=` de ${origin}`;if(begin)description+=`, activo desde ${begin}`;if(end)description+=` hasta ${end}`;description+='.';if(genres.length)description+=` Se asocia principalmente con ${genres.slice(0,4).join(', ')}.`;
    const info={description,origin,begin,end,genres,members,instruments,mbid:a.id};cache[k]=info;try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache));}catch(e){}return info;
  }
  function paint(box,info){
    const members=info.members||[];
    box.innerHTML=`<b>🎸 Sobre el artista / grupo</b><div class="artistContextText">${esc(info.description||'')}</div><dl class="artistContextGrid">${info.origin?`<dt>Origen</dt><dd>${esc(info.origin)}</dd>`:''}${info.begin?`<dt>Inicio / formación</dt><dd>${esc(info.begin)}${info.end?` — ${esc(info.end)}`:''}</dd>`:''}${(info.genres||[]).length?`<dt>Contexto / estilos</dt><dd>${esc(info.genres.join(' · '))}</dd>`:''}${(info.instruments||[]).length?`<dt>Instrumentos</dt><dd>${esc(info.instruments.join(' · '))}</dd>`:''}${members.length?`<dt>Miembros</dt><dd><ul class="artistMembers">${members.map(m=>`<li>${esc(m.name)}${m.role?` — ${esc(m.role)}`:''}</li>`).join('')}</ul></dd>`:''}</dl>${info.mbid?`<a class="artistSource" href="https://musicbrainz.org/artist/${encodeURIComponent(info.mbid)}" target="_blank" rel="noopener">MusicBrainz ↗</a>`:''}`;
  }
  function add(r){
    const detail=document.getElementById('detail');if(!detail)return;detail.querySelector('.artistContextBox')?.remove();
    const box=document.createElement('div');box.className='artistContextBox';box.innerHTML='<b>🎸 Sobre el artista / grupo</b><div class="artistLoading">Buscando origen, miembros, instrumentos y contexto…</div>';
    const curiosity=detail.querySelector('.curiosityBox'),editor=detail.querySelector('.editorBox');if(curiosity)curiosity.insertAdjacentElement('afterend',box);else if(editor)editor.parentNode.insertBefore(box,editor);else detail.appendChild(box);
    getInfo(r.artist).then(i=>{if(document.body.contains(box))paint(box,i);}).catch(e=>{console.warn(e);if(document.body.contains(box))box.innerHTML='<b>🎸 Sobre el artista / grupo</b><div class="artistLoading">No se pudo completar esta ficha ahora.</div>';});
  }
  const before=openDetail;openDetail=function(id){before(id);const r=data.find(x=>x.id===id);if(r)add(r);};
  const opened=document.querySelector('[data-editor]');if(opened){const r=data.find(x=>x.id===opened.dataset.editor);if(r)add(r);}
  document.documentElement.dataset.artistContext=VERSION;
})();
