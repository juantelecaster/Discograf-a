(()=>{
  'use strict';
  const VERSION='catalog-additions-v4';
  if(!Array.isArray(data))return;

  const r={
    id:'R0261',
    location:'Maletín 2',
    artist:'Osamu Kitajima',
    title:'Benzaiten',
    format:'CD-R',
    supports:1,
    type:'Álbum',
    year:'1974',
    genre:'Psychedelic rock / Progressive rock / Japanese folk / Ethnic fusion',
    label:'Island Records / Antilles (obra original)',
    recording:'Benzaiten fue grabado entre enero y agosto de 1974 en Hit Studio, dentro del Jean Jean Theater de Tokio; “Whoma (Immortality)” procede de una interpretación en directo en Nikkei Hall. Kitajima construyó el álbum como un encuentro entre rock psicodélico y progresivo, electrónica temprana y timbres tradicionales japoneses como biwa, shakuhachi, sho y tsuzumi.',
    edition:'CD-R personal grabado por Juan el 18/10/2026. No se atribuye a una edición comercial concreta: la ficha documenta la obra original y separa deliberadamente esa información del soporte grabado de la colección.',
    notes:'La discografía oficial de Osamu Kitajima sitúa Benzaiten en 1974; algunas ediciones internacionales y bases discográficas lo fechan en 1975–1976. Para la ordenación de la colección se toma 1974 como año de la obra original.',
    confidence:'Alta',
    metadata_status:'Obra identificada · copia personal',
    support_kind:'CD-R personal',
    cover_url:'https://lightintheattic.net/cdn/shop/files/710473184946.jpg?v=1755043039',
    official_reference:'https://www.eastquest.com/works.html',
    musicbrainz_search:'https://musicbrainz.org/search?query=Osamu+Kitajima+Benzaiten&type=release_group&method=indexed',
    discogs_search:'https://www.discogs.com/search/?q=Osamu+Kitajima+Benzaiten&type=release',
    artist_context:'Osamu Kitajima es un compositor y multiinstrumentista japonés que, tras pasar por The Launchers y publicar música psicodélica bajo el seudónimo Justin Heathcliff, desarrolló una obra propia basada en el cruce entre instrumentos tradicionales japoneses, rock, jazz, electrónica y técnicas de estudio occidentales. Benzaiten es uno de los discos que mejor define esa etapa inicial de fusión.',
    artist_members:'Osamu Kitajima — voz, guitarras, biwa, sintetizador, percusión y caja de ritmos · Haruomi Hosono — bajo eléctrico · Tatsuya Sano — shakuhachi · Masako Hirayama — biwa · Kisaku Katada — tsuzumi y narimono · Brian Whitcomb — teclados · George Marinelli — guitarra eléctrica · Dennis Belfield y John Harris — bajo · Kinji Yoshino — tambores africanos, ingeniería y coproducción',
    curiosity:'Benzaiten toma su nombre de la divinidad japonesa asociada a la música, el conocimiento y el agua. El propio concepto del disco se refleja en su instrumentación: instrumentos tradicionales japoneses conviven con sintetizadores, guitarras eléctricas, bajo y caja de ritmos, algo especialmente poco habitual en el rock japonés de comienzos de los setenta.',
    reference_tracklist:[
      {track:1,title:'Benzaiten (God of Music and Water)',duration:'3:38'},
      {track:2,title:'Taiyo (The Sun)',duration:'7:56'},
      {track:3,title:'Tengu (A Long-Nosed Goblin)',duration:'5:38'},
      {track:4,title:'Benzaiten (Reprise)',duration:'11:22'},
      {track:5,title:'Whoma (Immortality)',duration:'10:54'}
    ]
  };

  r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,r.artist_context,r.artist_members].filter(Boolean).join(' ');
  if(!data.some(x=>x.id===r.id))data.push(r);
  try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}

  // Mantener la portada elegida para esta copia personal.
  try{
    if(typeof coverKey==='function'&&typeof coverCache==='object'){
      coverCache[coverKey(r)]=r.cover_url;
      if(typeof saveCoverCache==='function')saveCoverCache();
    }
  }catch(e){}
  if(typeof fetchCover==='function'){
    const priorFetch=fetchCover;
    fetchCover=async function(rec,force=false){
      if(rec&&rec.id==='R0261')return r.cover_url;
      return priorFetch(rec,force);
    };
  }

  const priorOpen=openDetail;
  openDetail=function(id){
    priorOpen(id);
    if(id!=='R0261')return;
    const detail=document.getElementById('detail');if(!detail)return;
    const artistBox=detail.querySelector('.artistContextBox');
    if(artistBox){
      artistBox.innerHTML=`<b>🎸 Sobre el artista</b><div class="artistContextText">${escapeHTML(r.artist_context)}</div><dl class="artistContextGrid"><dt>Origen</dt><dd>Japón</dd><dt>Periodo</dt><dd>Desde finales de los años 60</dd><dt>Estilo</dt><dd>${escapeHTML(r.genre)}</dd><dt>Intérpretes / instrumentos</dt><dd>${escapeHTML(r.artist_members)}</dd></dl>`;
    }
    const curiosity=detail.querySelector('.curiosityBox .curiosityText');
    if(curiosity)curiosity.textContent=r.curiosity;
  };

  const supports=document.getElementById('statSupports');
  const records=document.getElementById('statRecords');
  const known=document.getElementById('statKnown');
  const pending=document.getElementById('statPending');
  if(supports)supports.textContent=data.reduce((a,x)=>a+(+x.supports||1),0);
  if(records)records.textContent=data.length;
  if(known)known.textContent=data.filter(x=>x.confidence==='Alta').length;
  if(pending)pending.textContent=data.filter(x=>x.confidence!=='Alta'||String(x.metadata_status||'').toLowerCase().includes('pendiente')).length;
  const legend=document.querySelector('.legend');
  if(legend){
    legend.innerHTML=legend.innerHTML.replace('Maletín 2 = 97','Maletín 2 = 98');
  }

  try{render();}catch(e){console.warn('catalog additions v4 render',e);}
  document.documentElement.dataset.catalogAdditionsV4=VERSION;
})();