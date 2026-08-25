(()=>{
  'use strict';
  const VERSION='catalog-additions-v2';
  if(!Array.isArray(data))return;

  const r={
    id:'R0258',
    location:'Maletín 2',
    artist:'Morgen',
    title:'Morgen',
    format:'CD',
    supports:1,
    type:'Álbum',
    year:'1969',
    genre:'Psychedelic rock / Acid rock / Heavy psych',
    label:'Phoenix Records',
    recording:'Único álbum de Morgen. La banda nació en Nueva York a finales de los sesenta como Morgen’s Dreame Spectrum. El disco fue grabado en 1968 y no apareció hasta diciembre de 1969 en Probe Records. Su sonido combina fuzz muy cargado, psicodelia oscura, hard rock y pasajes más oníricos, con Steve Morgen como principal compositor y vocalista.',
    edition:'Reedición británica en CD de Phoenix Records, 2008. Catálogo ASHCD3014, código de barras 5051125301416, presentación gatefold de cartón y edición limitada numerada de 1000 copias. Ejemplar de la colección: nº 0434/1000.',
    notes:'La portada reproduce una versión de El grito de Edvard Munch. La edición física ha sido identificada directamente a partir de las fotografías del disco y la carpeta aportadas.',
    confidence:'Alta',
    metadata_status:'Edición física identificada',
    support_kind:'CD comercial',
    cover_url:'assets/morgen-morgen-phoenix-2008.jpg',
    official_reference:'https://morgenband.bandcamp.com/album/morgen',
    discogs_search:'https://www.discogs.com/search/?q=Morgen+Morgen+ASHCD3014&type=release',
    musicbrainz_search:'https://musicbrainz.org/search?query=barcode%3A5051125301416&type=release&method=indexed',
    artist_context:'Morgen fue un grupo estadounidense de rock psicodélico surgido en Nueva York a finales de los años sesenta. La formación se articuló alrededor del cantante, guitarrista y compositor Steve Morgen. Su único LP quedó como una obra de culto del heavy psych estadounidense por la intensidad de las guitarras fuzz, la batería pesada y unas letras de imaginería psicodélica y fantástica.',
    artist_members:'Steve Morgen — voz y guitarra · Barry Stock — guitarra · Rennie Genossa — bajo · Bob Maiman — batería · Murray Shiffrin — colaborador, guitarrista y coproductor asociado a la etapa del grupo',
    curiosity:'El álbum se grabó en 1968 pero permaneció aproximadamente un año sin publicar y finalmente apareció en diciembre de 1969. Su portada utilizó El grito de Edvard Munch, una imagen que terminó convirtiéndose en uno de los rasgos más reconocibles de este oscuro clásico psicodélico.',
    reference_tracklist:[
      {track:1,title:'Welcome To The Void',duration:'4:48'},
      {track:2,title:'Of Dreams',duration:'5:37'},
      {track:3,title:"Beggin’ Your Pardon (Miss Joan)",duration:'4:49'},
      {track:4,title:'Eternity In Between',duration:'5:07'},
      {track:5,title:'Purple',duration:'4:12'},
      {track:6,title:"She’s The Nitetime",duration:'3:30'},
      {track:7,title:'Love',duration:'10:54'}
    ]
  };

  r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,r.artist_context,r.artist_members].filter(Boolean).join(' ');
  if(!data.some(x=>x.id===r.id))data.push(r);
  try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}

  // Fijar la carátula fotografiada para que el buscador web no la sustituya por otra edición.
  try{
    if(typeof coverKey==='function'&&typeof coverCache==='object'){
      coverCache[coverKey(r)]=r.cover_url;
      if(typeof saveCoverCache==='function')saveCoverCache();
    }
  }catch(e){}
  if(typeof fetchCover==='function'){
    const priorFetch=fetchCover;
    fetchCover=async function(rec,force=false){
      if(rec&&rec.id==='R0258')return r.cover_url;
      return priorFetch(rec,force);
    };
  }

  // Integrar la información curada del artista y la curiosidad en las cajas ya existentes.
  const priorOpen=openDetail;
  openDetail=function(id){
    priorOpen(id);
    if(id!=='R0258')return;
    const detail=document.getElementById('detail');if(!detail)return;
    const artistBox=detail.querySelector('.artistContextBox');
    if(artistBox){
      artistBox.innerHTML=`<b>🎸 Sobre el artista / grupo</b><div class="artistContextText">${escapeHTML(r.artist_context)}</div><dl class="artistContextGrid"><dt>Origen</dt><dd>Nueva York, Estados Unidos</dd><dt>Periodo</dt><dd>Finales de los años 60</dd><dt>Estilo</dt><dd>Psychedelic rock · Acid rock · Heavy psych</dd><dt>Miembros / instrumentos</dt><dd>${escapeHTML(r.artist_members)}</dd></dl>`;
    }
    const curiosity=detail.querySelector('.curiosityBox .curiosityText');if(curiosity)curiosity.textContent=r.curiosity;
  };

  // Recalcular estadísticas y actualizar la leyenda del Maletín 2.
  const supports=document.getElementById('statSupports');
  const records=document.getElementById('statRecords');
  const known=document.getElementById('statKnown');
  const pending=document.getElementById('statPending');
  if(supports)supports.textContent=data.reduce((a,x)=>a+(+x.supports||1),0);
  if(records)records.textContent=data.length;
  if(known)known.textContent=data.filter(x=>x.confidence==='Alta').length;
  if(pending)pending.textContent=data.filter(x=>x.confidence!=='Alta'||String(x.metadata_status||'').toLowerCase().includes('pendiente')).length;
  const legend=document.querySelector('.legend');
  if(legend){legend.innerHTML=legend.innerHTML.replace('Maletín 2 = 94','Maletín 2 = 95');}

  try{render();}catch(e){console.warn('catalog additions v2 render',e);}
  document.documentElement.dataset.catalogAdditionsV2=VERSION;
})();
