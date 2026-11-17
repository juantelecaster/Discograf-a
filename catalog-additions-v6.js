(()=>{
  'use strict';
  const VERSION='catalog-additions-v6-tags';
  if(!Array.isArray(data))return;

  const r={
    id:'R0263',
    location:'Estuche 4',
    artist:'Gorō Yamaguchi',
    title:'Masters of Japan: Kinkoryū Shakuhachi / 琴古流尺八 — 山口五郎',
    format:'CD',
    supports:1,
    type:'Álbum / antología',
    year:'2005',
    genre:'Shakuhachi / Kinkoryū / Honkyoku / Música tradicional japonesa',
    label:'Japan Traditional Cultures Foundation / Victor Entertainment',
    recording:'Antología de cuatro honkyoku fundamentales de la escuela Kinko-ryū interpretados únicamente al shakuhachi por Gorō Yamaguchi. La selección se centra en el repertorio clásico de la tradición: Hifumi Hachigaeshi no Shirabe, Sōkaku Reibo, Mukaiji Reibo y Shika no Tōne. La edición forma parte de la serie “Masters of Japan”, concebida para reunir interpretaciones de referencia de grandes maestros de la música tradicional japonesa.',
    edition:'Edición japonesa en CD publicada el 06/04/2005. Catálogo VZCG-505. Publicada por Japan Traditional Cultures Foundation y distribuida por Victor Entertainment. La edición física coincide con las fotografías aportadas: diseño “Masters of Japan”, cuatro pistas y precio original de ¥2.500 indicado en la contraportada.',
    notes:'Edición física identificada directamente a partir de las fotografías aportadas y de la ficha oficial del sello. Duración total aproximada: 70 minutos.',
    confidence:'Alta',
    metadata_status:'Edición física identificada',
    support_kind:'CD comercial',
    cover_url:'https://search.japo-net.or.jp/jacket/vzcg-505.jpg',
    official_reference:'https://s.jtcf.jp/item.php?id=VZCG-505',
    musicbrainz_search:'https://musicbrainz.org/search?query=Goro+Yamaguchi+VZCG-505&type=release&method=indexed',
    discogs_search:'https://www.discogs.com/search/?q=Goro+Yamaguchi+VZCG-505&type=release',
    tags:['Shakuhachi','Música japonesa','Kinko-ryū','Honkyoku'],
    artist_context:'Gorō Yamaguchi (1933–1999) fue uno de los grandes maestros japoneses del shakuhachi del siglo XX y una figura central de la escuela Kinko-ryū. Fue profesor de la Universidad de las Artes de Tokio y alcanzó reconocimiento internacional por una interpretación de enorme control tímbrico, respiración y refinamiento expresivo. En 1992 fue designado Tesoro Nacional Viviente de Japón por su arte del shakuhachi. Su influencia se extendió también fuera de Japón mediante conciertos, enseñanza y residencias académicas en Estados Unidos.',
    artist_members:'Gorō Yamaguchi — shakuhachi. En este CD las cuatro piezas están interpretadas como solos de shakuhachi.',
    curiosity:'Una interpretación de Gorō Yamaguchi, “Tsuru no Sugomori” (“Crane’s Nest”), fue seleccionada para el Golden Record que viaja a bordo de las sondas Voyager 1 y Voyager 2, lanzadas por la NASA en 1977. Es una de las muestras de música japonesa enviadas al espacio interestelar.',
    reference_tracklist:[
      {track:1,title:'Hifumi Hachigaeshi no Shirabe / 一二三鉢返調',duration:'10:47'},
      {track:2,title:'Sōkaku Reibo / 巣鶴鈴慕',duration:'20:50'},
      {track:3,title:'Mukaiji Reibo / 霧海箎鈴慕',duration:'28:26'},
      {track:4,title:'Shika no Tōne / 鹿の遠音',duration:'10:04'}
    ]
  };

  r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,r.artist_context,r.artist_members,...r.tags].filter(Boolean).join(' ');
  if(!data.some(x=>x.id===r.id))data.push(r);

  // Etiquetas conservadoras: se asigna Shakuhachi cuando el género/título ya lo identifica,
  // no por una aparición incidental del instrumento en los créditos de un álbum.
  data.forEach(rec=>{
    if(!Array.isArray(rec.tags))rec.tags=[];
    const core=[rec.title,rec.genre].filter(Boolean).join(' ');
    if(/shakuhachi|尺八/i.test(core) && !rec.tags.includes('Shakuhachi'))rec.tags.push('Shakuhachi');
    if(rec.id==='R0262'){
      ['Shakuhachi','Música japonesa','Hōgaku contemporáneo'].forEach(t=>{if(!rec.tags.includes(t))rec.tags.push(t)});
    }
    rec.search_text=[rec.search_text||'',...(rec.tags||[])].filter(Boolean).join(' ');
    try{searchIndex.set(rec.id,fold(rec.search_text));}catch(e){}
  });

  // Portada concreta del nuevo CD.
  try{
    if(typeof coverKey==='function'&&typeof coverCache==='object'){
      coverCache[coverKey(r)]=r.cover_url;
      if(typeof saveCoverCache==='function')saveCoverCache();
    }
  }catch(e){}
  if(typeof fetchCover==='function'){
    const priorFetch=fetchCover;
    fetchCover=async function(rec,force=false){
      if(rec&&rec.id==='R0263'&&!force)return r.cover_url;
      return priorFetch(rec,force);
    };
  }

  // Selector de etiquetas dentro del buscador.
  const genre=document.getElementById('genre');
  let tag=document.getElementById('tag');
  if(genre&&!tag){
    tag=document.createElement('select');
    tag.id='tag';
    tag.innerHTML='<option value="">Todas las etiquetas</option>';
    genre.insertAdjacentElement('afterend',tag);
  }
  if(tag){
    const tags=[...new Set(data.flatMap(x=>Array.isArray(x.tags)?x.tags:[]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
    tag.innerHTML='<option value="">Todas las etiquetas</option>'+tags.map(t=>`<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join('');
    tag.addEventListener('change',()=>render());
  }

  if(typeof filtered==='function'){
    const filteredBeforeTags=filtered;
    filtered=function(){
      let [arr,tokens]=filteredBeforeTags();
      const wanted=document.getElementById('tag')?.value||'';
      if(wanted)arr=arr.filter(x=>Array.isArray(x.tags)&&x.tags.includes(wanted));
      return [arr,tokens];
    };
  }

  if(typeof reset==='function'){
    const resetBeforeTags=reset;
    reset=function(){
      const el=document.getElementById('tag');if(el)el.value='';
      return resetBeforeTags();
    };
  }

  const css=document.createElement('style');
  css.textContent=`
    .pill.tagPill{border-color:#466b86;background:#102432;color:#9edcff}
    .tagFilterHint{display:inline-flex;align-items:center;gap:5px;margin-left:8px;color:#9edcff;font-size:.82rem}
  `;
  document.head.appendChild(css);

  function paintTags(){
    document.querySelectorAll('.album[data-id]').forEach(card=>{
      const rec=data.find(x=>x.id===card.dataset.id);if(!rec||!Array.isArray(rec.tags)||!rec.tags.length)return;
      const meta=card.querySelector('.meta');if(!meta)return;
      rec.tags.forEach(t=>{
        if(meta.querySelector(`[data-tag="${CSS.escape(t)}"]`))return;
        const span=document.createElement('span');
        span.className='pill tagPill';span.dataset.tag=t;span.textContent='🏷 '+t;
        span.title='Filtrar por '+t;
        span.onclick=e=>{e.stopPropagation();const sel=document.getElementById('tag');if(sel){sel.value=t;render();window.scrollTo({top:0,behavior:'smooth'});}};
        meta.appendChild(span);
      });
    });
  }

  if(typeof render==='function'){
    const renderBeforeTags=render;
    render=function(){const out=renderBeforeTags();paintTags();return out;};
  }

  const openBeforeTags=openDetail;
  openDetail=function(id){
    openBeforeTags(id);
    const rec=data.find(x=>x.id===id);if(!rec)return;
    const meta=document.querySelector('#detail .detailBody .meta');
    if(meta&&Array.isArray(rec.tags)){
      rec.tags.forEach(t=>{
        const span=document.createElement('span');span.className='pill tagPill';span.textContent='🏷 '+t;meta.appendChild(span);
      });
    }
    if(id==='R0263'){
      const curiosity=document.querySelector('#detail .curiosityBox .curiosityText');
      if(curiosity)curiosity.textContent=r.curiosity;
    }
  };

  // Estuche 4: segundo disco. La colección tiene ahora una quinta ubicación física.
  const legend=document.querySelector('.legend');
  if(legend){
    if(/Estuche 4\s*=\s*1/.test(legend.textContent||''))legend.innerHTML=legend.innerHTML.replace(/Estuche 4\s*=\s*1/,'Estuche 4 = 2');
    else if(!/Estuche 4\s*=/.test(legend.textContent||''))legend.insertAdjacentHTML('beforeend',' · <span>Estuche 4 = 2</span>');
  }
  const statLabels=[...document.querySelectorAll('.stats .stat span')];
  const locLabel=statLabels.find(x=>/ubicaciones físicas/i.test(x.textContent||''));
  if(locLabel){
    const b=locLabel.parentElement?.querySelector('b');if(b)b.textContent='5';
  }
  const supports=document.getElementById('statSupports');
  const records=document.getElementById('statRecords');
  const known=document.getElementById('statKnown');
  const pending=document.getElementById('statPending');
  if(supports)supports.textContent=data.reduce((a,x)=>a+(+x.supports||1),0);
  if(records)records.textContent=data.length;
  if(known)known.textContent=data.filter(x=>x.confidence==='Alta').length;
  if(pending)pending.textContent=data.filter(x=>x.confidence!=='Alta'||String(x.metadata_status||'').toLowerCase().includes('pendiente')).length;

  try{render();}catch(e){console.warn('catalog additions v6 render',e);}
  document.documentElement.dataset.catalogAdditionsV6=VERSION;
})();