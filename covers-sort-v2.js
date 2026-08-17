(()=>{
  const VERSION='covers-sort-v2';
  const WEB_CACHE_KEY='juan_music_inventory_cover_web_v2';
  const SOURCE_KEY='juan_music_inventory_cover_source_v2';
  const coverSources=(()=>{try{return JSON.parse(localStorage.getItem(SOURCE_KEY)||'{}')||{}}catch(e){return {}}})();

  function loadWebCache(){try{return JSON.parse(localStorage.getItem(WEB_CACHE_KEY)||'{}')||{}}catch(e){return {}}}
  try{ coverCache=loadWebCache(); }catch(e){}
  try{ saveCoverCache=function(){localStorage.setItem(WEB_CACHE_KEY,JSON.stringify(coverCache));localStorage.setItem(SOURCE_KEY,JSON.stringify(coverSources));}; }catch(e){}

  function normalized(s){return fold(String(s||'')).replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim()}
  function usefulTitle(r){
    const s=normalized(r.title);
    return s && !/^(titulo por confirmar|pendiente|sin identificar|soporte visible|seleccion|progresivo|varios)$/.test(s);
  }
  shouldFetchCover=function(r){
    const kind=normalized(`${r.format||''} ${r.support_kind||''} ${r.type||''}`);
    if(/cd rom|software|dvd video|dvd de datos|no musical/.test(kind))return false;
    if(/^Pendiente/i.test(r.artist||'') || !usefulTitle(r))return false;
    if(r.confidence==='Baja')return false;
    return true;
  };

  function yearOf(v){const m=String(v||'').match(/(18|19|20)\d{2}/);return m?Number(m[0]):null}
  function scoreAlbum(r,x){
    const ra=normalized(r.artist), rt=normalized(r.title);
    const xa=normalized(x.artistName), xt=normalized(x.collectionName);
    let s=0;
    if(xa===ra)s+=80; else if(xa.includes(ra)||ra.includes(xa))s+=45;
    const rwords=rt.split(' ').filter(w=>w.length>2), xwords=new Set(xt.split(' '));
    const overlap=rwords.filter(w=>xwords.has(w)).length;
    if(xt===rt)s+=100;
    else if(xt.includes(rt)||rt.includes(xt))s+=65;
    s+=overlap*10;
    const ry=yearOf(r.year), xy=yearOf(x.releaseDate);
    if(ry&&xy){const d=Math.abs(ry-xy); if(d===0)s+=15; else if(d<=2)s+=7; else if(d>10)s-=8;}
    return s;
  }
  function upscaleApple(url){return String(url||'').replace(/\d+x\d+bb/g,'600x600bb').replace(/\d+x\d+/g,'600x600')}
  async function appleCover(r){
    const term=`${r.artist} ${r.title}`;
    const url='https://itunes.apple.com/search?media=music&entity=album&limit=12&term='+encodeURIComponent(term);
    const res=await fetch(url,{cache:'force-cache'}); if(!res.ok)throw new Error('Apple '+res.status);
    const items=(await res.json()).results||[];
    const ranked=items.map(x=>({x,s:scoreAlbum(r,x)})).sort((a,b)=>b.s-a.s);
    if(!ranked.length || ranked[0].s<45)return '';
    return upscaleApple(ranked[0].x.artworkUrl100||ranked[0].x.artworkUrl60||'');
  }

  let mbChain=Promise.resolve();
  let lastMb=0;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function queueMusicBrainz(task){
    const run=async()=>{
      const wait=Math.max(0,1100-(Date.now()-lastMb));
      if(wait)await sleep(wait);
      try{return await task();}finally{lastMb=Date.now();}
    };
    const p=mbChain.then(run,run); mbChain=p.catch(()=>{}); return p;
  }
  function mbEscape(s){return String(s||'').replace(/["\\]/g,' ')}
  function scoreReleaseGroup(r,g){
    const rt=normalized(r.title), gt=normalized(g.title);
    let s=0;
    if(gt===rt)s+=100; else if(gt.includes(rt)||rt.includes(gt))s+=65;
    const rwords=rt.split(' ').filter(w=>w.length>2), gwords=new Set(gt.split(' '));
    s+=rwords.filter(w=>gwords.has(w)).length*10;
    const ry=yearOf(r.year), gy=yearOf(g['first-release-date']);
    if(ry&&gy){const d=Math.abs(ry-gy); if(d===0)s+=15; else if(d<=2)s+=7;}
    return s;
  }
  function canLoadImage(url,timeout=7000){
    return new Promise(resolve=>{
      const img=new Image(); let done=false;
      const finish=v=>{if(done)return;done=true;clearTimeout(t);img.onload=img.onerror=null;resolve(v)};
      const t=setTimeout(()=>finish(false),timeout);
      img.onload=()=>finish(true); img.onerror=()=>finish(false); img.src=url;
    });
  }
  async function musicBrainzCover(r){
    return queueMusicBrainz(async()=>{
      const query=`artist:${mbEscape(r.artist)} AND releasegroup:${mbEscape(r.title)}`;
      const url='https://musicbrainz.org/ws/2/release-group/?fmt=json&limit=6&query='+encodeURIComponent(query);
      const res=await fetch(url,{headers:{'Accept':'application/json'}}); if(!res.ok)throw new Error('MusicBrainz '+res.status);
      const groups=(await res.json())['release-groups']||[];
      const ranked=groups.map(g=>({g,s:scoreReleaseGroup(r,g)})).sort((a,b)=>b.s-a.s).filter(x=>x.s>=45).slice(0,3);
      for(const {g} of ranked){
        const art=`https://coverartarchive.org/release-group/${g.id}/front-500`;
        if(await canLoadImage(art))return art;
      }
      return '';
    });
  }

  fetchCover=async function(r,force=false){
    const key=coverKey(r);
    if(force){delete coverCache[key]; delete coverSources[key]; saveCoverCache();}
    if(key in coverCache)return coverCache[key];
    if(!shouldFetchCover(r)){coverCache[key]='';coverSources[key]='';saveCoverCache();return ''}
    let art='';
    try{art=await appleCover(r); if(art)coverSources[key]='Apple Music';}catch(e){}
    if(!art){try{art=await musicBrainzCover(r); if(art)coverSources[key]='MusicBrainz / Cover Art Archive';}catch(e){}}
    coverCache[key]=art||''; saveCoverCache(); return coverCache[key];
  };

  let observer=null;
  function loadOne(el){
    if(el.dataset.coverLoading==='1')return;
    const r=data.find(x=>x.id===el.dataset.id); if(!r)return;
    el.dataset.coverLoading='1';
    el.innerHTML=coverMarkup(r,el.classList.contains('detailCover')?'detail':'card');
    if(!shouldFetchCover(r)){el.dataset.coverLoading='0';return;}
    fetchCover(r).then(art=>{
      if(art){document.querySelectorAll(`.cover[data-id="${r.id}"],.detailCover[data-id="${r.id}"]`).forEach(x=>x.innerHTML=coverMarkup(r,x.classList.contains('detailCover')?'detail':'card'));}
    }).finally(()=>{el.dataset.coverLoading='0'});
  }
  hydrateVisibleCovers=function(scope=document){
    const nodes=[...scope.querySelectorAll('.cover[data-id],.detailCover[data-id]')];
    if(!nodes.length)return;
    nodes.forEach(el=>{const r=data.find(x=>x.id===el.dataset.id);if(r)el.innerHTML=coverMarkup(r,el.classList.contains('detailCover')?'detail':'card');});
    nodes.filter(el=>el.classList.contains('detailCover')).forEach(loadOne);
    const cards=nodes.filter(el=>el.classList.contains('cover'));
    if('IntersectionObserver' in window){
      if(!observer)observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);loadOne(entry.target)}}),{rootMargin:'700px 0px'});
      cards.forEach(el=>observer.observe(el));
    }else cards.forEach(loadOne);
  };

  const baseOpenDetail=openDetail;
  openDetail=function(id){
    baseOpenDetail(id);
    const r=data.find(x=>x.id===id); if(!r)return;
    const hint=document.querySelector('#detail .coverHint');
    if(hint){
      const source=coverSources[coverKey(r)]||'';
      hint.innerHTML=`Las carátulas se buscan automáticamente en la web${source?` · Fuente actual: <b>${escapeHTML(source)}</b>`:''}. <button class="smallbtn" id="retryCoverBtn" style="margin-left:7px">🔎 Buscar de nuevo</button>`;
      const btn=document.getElementById('retryCoverBtn');
      if(btn)btn.onclick=async()=>{
        btn.disabled=true;btn.textContent='Buscando…';
        const art=await fetchCover(r,true);
        const dc=document.querySelector(`.detailCover[data-id="${r.id}"]`);
        if(dc)dc.innerHTML=coverMarkup(r,'detail');
        document.querySelectorAll(`.cover[data-id="${r.id}"]`).forEach(x=>x.innerHTML=coverMarkup(r,'card'));
        btn.disabled=false;btn.textContent=art?'✓ Encontrada':'Sin resultado · reintentar';
      };
    }
  };

  const sort=document.getElementById('sort');
  if(sort){
    const y=[...sort.options].find(o=>o.value==='year');
    if(y)y.textContent='Año: más antiguo primero';
    if(![...sort.options].some(o=>o.value==='year_desc')){
      const o=document.createElement('option');o.value='year_desc';o.textContent='Año: más reciente primero';sort.appendChild(o);
    }
  }
  const baseFiltered=filtered;
  filtered=function(){
    const sel=document.getElementById('sort');
    if(!sel||sel.value!=='year_desc')return baseFiltered();
    sel.value='year';
    const out=baseFiltered();
    sel.value='year_desc';
    out[0].sort((a,b)=>{
      const ay=yearOf(a.year),by=yearOf(b.year);
      if(ay==null&&by==null)return String(a.artist||'').localeCompare(String(b.artist||''),'es');
      if(ay==null)return 1;if(by==null)return -1;
      return by-ay||String(a.artist||'').localeCompare(String(b.artist||''),'es');
    });
    return out;
  };

  try{localStorage.removeItem('juan_music_inventory_cover_cache_v1');}catch(e){}
  try{render();}catch(e){}
  document.documentElement.dataset.coverPatch=VERSION;
})();
