(()=>{
  'use strict';
  const VERSION='catalog-additions-v2.1';
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
    recording:'Único álbum de Morgen. El grupo se formó en Nueva York como Morgen’s Dreame Spectrum y fue uno de los primeros fichajes de Probe, subsello psicodélico de ABC. Las sesiones originales se realizaron en Studio 3, Manhattan, en 1968; el material fue remezclado en 1969 y el LP no apareció hasta diciembre de ese año. Musicalmente combina guitarras fuzz muy agresivas, psicodelia oscura, hard rock y momentos más oníricos.',
    edition:'Reedición británica en CD de Phoenix Records, 2008. Catálogo ASHCD3014, código de barras 5051125301416, presentación gatefold de cartón y edición limitada numerada de 1000 copias. Ejemplar de la colección: nº 0434/1000.',
    notes:'Edición física identificada directamente a partir de las fotografías aportadas del disco y la carpeta. La portada reproduce The Scream (1895) de Edvard Munch.',
    confidence:'Alta',
    metadata_status:'Edición física identificada',
    support_kind:'CD comercial',
    cover_url:'https://coverartarchive.org/release/c64ce2cc-7cfc-4cb5-aaf1-ed99c3a28d95/front-500',
    official_reference:'https://morgenband.bandcamp.com/album/morgen',
    discogs_search:'https://www.discogs.com/search/?q=Morgen+Morgen+ASHCD3014&type=release',
    musicbrainz_search:'https://musicbrainz.org/release/c64ce2cc-7cfc-4cb5-aaf1-ed99c3a28d95',
    artist_context:'Morgen fue un grupo estadounidense de heavy psych surgido en Nueva York a finales de los sesenta. El proyecto giró alrededor de Steve Morgen, cantante, guitarrista y autor de todas las canciones del álbum. Su único LP se ha convertido en una obra de culto por el choque entre letras de imaginería fantástica, una base rítmica muy pesada y guitarras saturadas que lo sitúan entre la psicodelia tardía y el hard rock naciente.',
    artist_members:'Steve Morgen — voz y guitarra rítmica · Murray Shiffrin — guitarra solista · Barry Stock — guitarra rítmica y coros · Bobby Rizzo — bajo · Michael Ratti — batería',
    curiosity:'El disco se grabó en 1968, pero el grupo tuvo que esperar hasta diciembre de 1969 para verlo publicado. Steve Morgen pidió expresamente utilizar The Scream (1895) de Edvard Munch en la portada; con el tiempo esa imagen terminó siendo inseparable de uno de los álbumes de culto más buscados del heavy psych estadounidense.',
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

  // Fijar la carátula de la edición Phoenix 2008 para evitar que el buscador web la sustituya.
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
      artistBox.innerHTML=`<b>🎸 Sobre el artista / grupo</b><div class="artistContextText">${escapeHTML(r.artist_context)}</div><dl class="artistContextGrid"><dt>Origen</dt><dd>Nueva York, Estados Unidos</dd><dt>Periodo</dt><dd>1967–1969 aprox.</dd><dt>Estilo</dt><dd>Psychedelic rock · Acid rock · Heavy psych</dd><dt>Miembros / instrumentos</dt><dd>${escapeHTML(r.artist_members)}</dd></dl>`;
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
