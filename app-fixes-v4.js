(()=>{
  'use strict';
  const VERSION='app-fixes-v4';
  const COVER_CACHE_KEY_V4='juan_music_inventory_cover_web_v4';
  const COVER_SOURCE_KEY_V4='juan_music_inventory_cover_source_v4';

  const css=document.createElement('style');
  css.textContent=`
    .diaryComposerV4{margin:14px 0;padding:14px;border:1px solid var(--line);background:#0d131d;border-radius:14px}
    .diaryGridV4{display:grid;grid-template-columns:minmax(220px,2fr) 150px 130px;gap:9px;margin-top:10px}
    .diaryGridV4 textarea{grid-column:1/-1;width:100%;min-height:90px;resize:vertical;background:#090e16;color:var(--text);border:1px solid #344055;border-radius:10px;padding:10px;box-sizing:border-box}
    .diaryMsgV4{font-size:.85rem;margin-left:8px;color:#88e6b2}
    .diaryMsgV4.error{color:#ffb7c0}
    .diaryActionsV4{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
    .diaryEditV4{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
    .diaryEditV4 textarea{width:100%;min-height:72px;resize:vertical;background:#090e16;color:var(--text);border:1px solid #344055;border-radius:10px;padding:10px;box-sizing:border-box}
    @media(max-width:720px){.diaryGridV4{grid-template-columns:1fr}.diaryGridV4 textarea{grid-column:1}}
  `;
  document.head.appendChild(css);

  const esc=typeof escapeHTML==='function'?escapeHTML:(s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  function todayLocal(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;}
  function yearOf(v){const m=String(v||'').match(/(?:18|19|20)\d{2}/);return m?Number(m[0]):null;}
  function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');}
  function canonTitle(s){return norm(s).replace(/\b(remaster(?:ed)?|deluxe|expanded|anniversary|edition|version|bonus|mono|stereo|digital)\b.*$/,'').trim();}

  // Ordenación por año visible y estable.
  const sortEl=document.getElementById('sort');
  if(sortEl){
    const oldYear=[...sortEl.options].find(o=>o.value==='year');
    if(oldYear){oldYear.value='year_asc';oldYear.textContent='Año: más antiguo primero';}
    if(![...sortEl.options].some(o=>o.value==='year_desc')){
      const o=document.createElement('option');o.value='year_desc';o.textContent='Año: más reciente primero';sortEl.appendChild(o);
    }
  }
  const filteredBeforeV4=typeof filtered==='function'?filtered:null;
  if(filteredBeforeV4){
    filtered=function(){
      const sel=document.getElementById('sort');
      const mode=sel?sel.value:'';
      if(mode!=='year_asc'&&mode!=='year_desc')return filteredBeforeV4();
      const previous=sel.value;sel.value='relevance';let out;
      try{out=filteredBeforeV4();}finally{sel.value=previous;}
      out[0].sort((a,b)=>{
        const ay=yearOf(a.year),by=yearOf(b.year);
        if(ay==null&&by==null)return String(a.artist||'').localeCompare(String(b.artist||''),'es')||String(a.title||'').localeCompare(String(b.title||''),'es');
        if(ay==null)return 1;if(by==null)return -1;
        const d=mode==='year_desc'?by-ay:ay-by;
        return d||String(a.artist||'').localeCompare(String(b.artist||''),'es')||String(a.title||'').localeCompare(String(b.title||''),'es');
      });
      return out;
    };
  }

  // Carátulas: nueva caché y coincidencia estricta de artista+título.
  let sourceCache={};
  try{sourceCache=JSON.parse(localStorage.getItem(COVER_SOURCE_KEY_V4)||'{}')||{};}catch(e){}
  try{coverCache=JSON.parse(localStorage.getItem(COVER_CACHE_KEY_V4)||'{}')||{};}catch(e){coverCache={};}
  function persistCoverCache(){try{localStorage.setItem(COVER_CACHE_KEY_V4,JSON.stringify(coverCache));localStorage.setItem(COVER_SOURCE_KEY_V4,JSON.stringify(sourceCache));}catch(e){}}
  try{saveCoverCache=persistCoverCache;}catch(e){}

  function usableForCover(r){
    const kind=norm(`${r.format||''} ${r.support_kind||''} ${r.type||''}`);
    if(/cd rom|software|dvd video|dvd de datos|no musical/.test(kind))return false;
    if(/^pendiente/.test(norm(r.artist))||/^pendiente/.test(norm(r.title)))return false;
    if(r.confidence==='Baja')return false;
    const t=canonTitle(r.title);return t.length>=3&&!/^(seleccion|varios|progresivo|sin identificar)$/.test(t);
  }
  shouldFetchCover=usableForCover;
  function titleScore(a,b){const x=canonTitle(a),y=canonTitle(b);if(!x||!y)return 0;if(x===y)return 100;if(x.includes(y)||y.includes(x))return Math.min(x.length,y.length)>=6?78:45;const xs=x.split(' ').filter(w=>w.length>2),ys=new Set(y.split(' ').filter(w=>w.length>2));if(!xs.length)return 0;return Math.round((xs.filter(w=>ys.has(w)).length/xs.length)*70);}
  function artistScore(a,b){const x=norm(a),y=norm(b);if(!x||!y)return 0;if(x===y)return 100;if((x==='varios artistas'||x==='varios')&&(y==='various artists'||y==='varios artistas'))return 90;if(x.includes(y)||y.includes(x))return 70;const xs=x.split(' ').filter(w=>w.length>2),ys=new Set(y.split(' ').filter(w=>w.length>2));if(!xs.length)return 0;return Math.round((xs.filter(w=>ys.has(w)).length/xs.length)*60);}
  function upscaleApple(url){return String(url||'').replace(/\d+x\d+bb/g,'700x700bb').replace(/\d+x\d+/g,'700x700');}
  async function appleStrict(r){
    const q=`${r.artist} ${r.title} ${yearOf(r.year)||''}`.trim();
    const res=await fetch('https://itunes.apple.com/search?media=music&entity=album&limit=25&term='+encodeURIComponent(q),{cache:'force-cache'});if(!res.ok)throw new Error('Apple '+res.status);
    const items=(await res.json()).results||[];
    const ranked=items.map(x=>{const ts=titleScore(r.title,x.collectionName),as=artistScore(r.artist,x.artistName);let score=ts*1.4+as;const ry=yearOf(r.year),xy=yearOf(x.releaseDate);if(ry&&xy){const d=Math.abs(ry-xy);if(d===0)score+=18;else if(d<=2)score+=8;else if(d>8)score-=12;}return{x,ts,as,score};}).filter(z=>z.ts>=55&&z.as>=45).sort((a,b)=>b.score-a.score);
    return ranked.length?upscaleApple(ranked[0].x.artworkUrl100||ranked[0].x.artworkUrl60||''):'';
  }
  let mbQueue=Promise.resolve(),lastMB=0;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function queuedMB(fn){const run=async()=>{const w=Math.max(0,1100-(Date.now()-lastMB));if(w)await sleep(w);try{return await fn();}finally{lastMB=Date.now();}};const p=mbQueue.then(run,run);mbQueue=p.catch(()=>{});return p;}
  function imageLoads(url,timeout=6500){return new Promise(resolve=>{const im=new Image();let done=false;const end=v=>{if(done)return;done=true;clearTimeout(t);im.onload=im.onerror=null;resolve(v)};const t=setTimeout(()=>end(false),timeout);im.onload=()=>end(true);im.onerror=()=>end(false);im.src=url;});}
  async function mbStrict(r){return queuedMB(async()=>{const query=`releasegroup:${String(r.title||'').replace(/["\\]/g,' ')} AND artist:${String(r.artist||'').replace(/["\\]/g,' ')}`;const res=await fetch('https://musicbrainz.org/ws/2/release-group/?fmt=json&limit=10&query='+encodeURIComponent(query),{headers:{Accept:'application/json'}});if(!res.ok)throw new Error('MusicBrainz '+res.status);const groups=(await res.json())['release-groups']||[];const ranked=groups.map(g=>({g,ts:titleScore(r.title,g.title),as:Math.max(...((g['artist-credit']||[]).map(ac=>artistScore(r.artist,ac.name||ac.artist?.name||''))),0)})).filter(z=>z.ts>=65&&(z.as>=45||norm(r.artist).startsWith('varios'))).sort((a,b)=>(b.ts+b.as)-(a.ts+a.as));for(const {g} of ranked.slice(0,4)){const art=`https://coverartarchive.org/release-group/${g.id}/front-500`;if(await imageLoads(art))return art;}return '';});}
  fetchCover=async function(r,force=false){const key=coverKey(r);if(force){delete coverCache[key];delete sourceCache[key];persistCoverCache();}if(key in coverCache)return coverCache[key];if(!usableForCover(r)){coverCache[key]='';persistCoverCache();return '';}let art='';try{art=await mbStrict(r);if(art)sourceCache[key]='MusicBrainz / Cover Art Archive';}catch(e){}if(!art){try{art=await appleStrict(r);if(art)sourceCache[key]='Apple Music';}catch(e){}}coverCache[key]=art||'';persistCoverCache();return coverCache[key];};

  // Diario robusto: escritura directa y error visible si el navegador bloquea almacenamiento.
  function ensureNotes(id){const p=ensurePersonal(id);if(!Array.isArray(p.notes))p.notes=[];return p;}
  function persistPersonalV4(){localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));}
  function diaryMsg(text,error=false){const el=document.getElementById('diaryMsgV4');if(el){el.textContent=text;el.classList.toggle('error',error);}}
  function ensureDiaryComposerV4(){
    const feed=document.getElementById('diaryFeed');if(!feed)return;
    document.getElementById('diaryComposer')?.remove();
    if(document.getElementById('diaryComposerV4'))return;
    const box=document.createElement('div');box.id='diaryComposerV4';box.className='diaryComposerV4';
    const opts=data.slice().sort((a,b)=>`${a.artist} ${a.title}`.localeCompare(`${b.artist} ${b.title}`,'es')).map(r=>`<option value="${esc(r.id)}">${esc(r.artist)} — ${esc(r.title)}</option>`).join('');
    box.innerHTML=`<div class="eyebrow">Nueva escucha</div><div class="diaryGridV4"><select id="diaryAlbumV4"><option value="">Selecciona un disco…</option>${opts}</select><input id="diaryDateV4" type="date" value="${todayLocal()}"><select id="diaryRatingV4"><option value="0">Sin valoración</option>${[1,2,3,4,5].map(n=>`<option value="${n}">${'★'.repeat(n)}</option>`).join('')}</select><textarea id="diaryTextV4" placeholder="Escribe aquí tu comentario de escucha…"></textarea></div><button class="smallbtn primarybtn" id="diarySaveV4">Guardar escucha</button><span class="diaryMsgV4" id="diaryMsgV4"></span>`;
    feed.parentNode.insertBefore(box,feed);
    box.querySelector('#diarySaveV4').onclick=()=>{const rid=box.querySelector('#diaryAlbumV4').value,text=box.querySelector('#diaryTextV4').value.trim();if(!rid){diaryMsg('Selecciona un disco',true);return;}if(!text){diaryMsg('Escribe un comentario',true);return;}try{const p=ensureNotes(rid),rating=Math.max(0,Math.min(5,Number(box.querySelector('#diaryRatingV4').value)||0));p.notes.push({date:box.querySelector('#diaryDateV4').value||todayLocal(),text,rating,createdAt:new Date().toISOString()});if(rating)p.rating=rating;persistPersonalV4();box.querySelector('#diaryTextV4').value='';diaryMsg('Guardado ✓');renderDiary();renderFavorites();}catch(e){console.error(e);diaryMsg('No se pudo guardar: '+(e.message||e),true);}};
  }
  function diaryItems(){const out=[];data.forEach(r=>{const p=ensureNotes(r.id);p.notes.forEach((n,index)=>out.push({r,n,index}));});out.sort((a,b)=>(b.n.date||'').localeCompare(a.n.date||'')||String(b.n.createdAt||'').localeCompare(String(a.n.createdAt||'')));return out;}
  renderDiary=function(){const feed=document.getElementById('diaryFeed');if(!feed)return;ensureDiaryComposerV4();const items=diaryItems();feed.innerHTML=items.length?items.map(({r,n,index})=>`<div class="feedItem" data-diary-v4="${esc(r.id)}|${index}"><h4 style="cursor:pointer" data-open>${esc(r.artist)} — ${esc(r.title)}</h4><div class="feedMeta">${esc(n.date||'Sin fecha')} ${n.rating?`· ${'★'.repeat(Math.max(0,Math.min(5,+n.rating||0)))}`:''}</div><div style="margin-top:7px;white-space:pre-wrap">${esc(n.text||'')}</div><div class="diaryActionsV4"><button class="smallbtn" data-edit>✏️ Editar</button><button class="smallbtn dangerbtn" data-delete>🗑️ Borrar</button><button class="smallbtn" data-open>💿 Ver disco</button></div></div>`).join(''):'<div class="feedItem">Todavía no has añadido escuchas. Puedes crear la primera entrada arriba.</div>';feed.querySelectorAll('[data-diary-v4]').forEach(card=>{const [rid,idx]=card.dataset.diaryV4.split('|'),index=Number(idx);card.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>openDetail(rid));card.querySelector('[data-delete]').onclick=()=>{const p=ensureNotes(rid);if(!p.notes[index])return;if(!confirm('¿Borrar esta entrada del diario?'))return;try{p.notes.splice(index,1);persistPersonalV4();renderDiary();}catch(e){alert('No se pudo borrar: '+e.message);}};card.querySelector('[data-edit]').onclick=()=>{const p=ensureNotes(rid),n=p.notes[index];if(!n)return;const text=prompt('Editar comentario:',n.text||'');if(text===null||!text.trim())return;n.text=text.trim();try{persistPersonalV4();renderDiary();}catch(e){alert('No se pudo guardar: '+e.message);}};});};

  // Mantener “Borrar” en destacadas.
  if(typeof renderFavorites==='function'){const favBefore=renderFavorites;renderFavorites=function(){favBefore();document.querySelectorAll('#favoritesFeed [data-action="delete"]').forEach(btn=>{btn.textContent='🗑️ Borrar';btn.classList.add('dangerbtn');});};}

  // Añadir controles de carátula y conservar las curiosidades de la capa anterior.
  const openBefore=openDetail;
  openDetail=function(id){openBefore(id);const r=data.find(x=>x.id===id);if(!r)return;const hint=document.querySelector('#detail .coverHint');if(hint){const src=sourceCache[coverKey(r)]||'';hint.innerHTML=`Carátula buscada en la web${src?` · <b>${esc(src)}</b>`:''}. <button class="smallbtn" id="retryCoverV4">🔎 Buscar de nuevo</button>`;hint.querySelector('#retryCoverV4').onclick=async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Buscando…';await fetchCover(r,true);const dc=document.querySelector(`.detailCover[data-id="${r.id}"]`);if(dc)dc.innerHTML=coverMarkup(r,'detail');document.querySelectorAll(`.cover[data-id="${r.id}"]`).forEach(x=>x.innerHTML=coverMarkup(r,'card'));b.disabled=false;b.textContent=coverCache[coverKey(r)]?'✓ Encontrada':'Sin resultado';};}};

  ensureDiaryComposerV4();renderDiary();renderFavorites();try{render();}catch(e){}
  document.documentElement.dataset.appFixes=VERSION;
})();
