(()=>{
  'use strict';
  const VERSION='catalog-additions-v3';
  if(!Array.isArray(data))return;

  const additions=[
    {
      id:'R0259',
      location:'Maletín 2',
      artist:'Flower Travellin’ Band',
      title:'Anywhere',
      format:'CD',
      supports:1,
      type:'Álbum',
      year:'1970',
      genre:'Psychedelic rock / Hard rock / Heavy psych / Proto-metal',
      label:'USM Japan',
      recording:'Primer álbum publicado como Flower Travellin’ Band tras la etapa previa de The Flowers. Con Joe Yamanaka ya como vocalista, el grupo reinterpretó material de Muddy Waters, Black Sabbath, King Crimson y el tradicional “House of the Rising Sun”, llevándolo hacia improvisaciones largas, guitarras pesadas y una psicodelia mucho más agresiva que la de la escena pop japonesa del momento.',
      edition:'Reedición japonesa en CD de 2007, USM Japan, catálogo UPCY-6343, código 4988005461315. La fotografía aportada muestra la edición con obi y reproducción de la célebre portada del grupo desnudo sobre motocicletas.',
      notes:'Edición identificada a partir de la portada aportada y contrastada con MusicBrainz. La imagen anterior parecía mostrar UPCY-6343; ese catálogo corresponde efectivamente a esta reedición japonesa de Anywhere.',
      confidence:'Alta',
      metadata_status:'Edición física identificada',
      support_kind:'CD comercial',
      musicbrainz_search:'https://musicbrainz.org/search?query=UPCY-6343&type=release&method=indexed',
      discogs_search:'https://www.discogs.com/search/?q=Flower+Travellin+Band+Anywhere+UPCY-6343&type=release',
      artist_context:'Flower Travellin’ Band fue un grupo japonés formado en Tokio a finales de los años sesenta. Su sonido unió hard rock, blues, psicodelia y una temprana pesadez proto-metal, pero con un enfoque muy propio en la voz aguda de Joe Yamanaka y la guitarra de Hideki Ishima. Tras Anywhere, el grupo abandonó casi por completo las versiones y desarrolló una identidad mucho más original en Satori.',
      artist_members:'Joe Yamanaka — voz y armónica · Hideki Ishima — guitarra · Jun Kozuki — bajo / guitarra · Joji “George” Wada — batería',
      curiosity:'La fotografía de portada de Anywhere, con los miembros desnudos sobre motocicletas, convirtió el álbum en una de las imágenes más reconocibles del rock japonés de comienzos de los setenta. Musicalmente es también el puente entre la etapa de versiones del grupo y el lenguaje completamente propio que cristalizaría en Satori.',
      reference_tracklist:[
        {track:1,title:'Anywhere',duration:'0:51'},
        {track:2,title:'Louisiana Blues',duration:'15:54'},
        {track:3,title:'Black Sabbath',duration:'8:59'},
        {track:4,title:'House of the Rising Sun',duration:'7:45'},
        {track:5,title:'Twenty First Century Schizoid Man',duration:'13:27'},
        {track:6,title:'Anywhere',duration:''}
      ]
    },
    {
      id:'R0260',
      location:'Maletín 2',
      artist:'Flower Travellin’ Band',
      title:'Satori',
      format:'CD',
      supports:1,
      type:'Álbum',
      year:'1971',
      genre:'Psychedelic rock / Hard rock / Heavy psych / Progressive rock / Proto-metal',
      label:'Atlantic / Warner-Pioneer (obra original)',
      recording:'Segundo álbum de Flower Travellin’ Band y el primero construido íntegramente con material original del grupo. Publicado en Japón en 1971, Satori se organiza como una suite en cinco partes: riffs muy pesados, percusión expansiva, improvisación psicodélica y giros melódicos con un marcado carácter oriental. Es la obra que definió la identidad del grupo y uno de los discos fundamentales del heavy psych japonés.',
      edition:'Edición física concreta pendiente de verificar. El álbum está identificado con seguridad; para fijar sello, año de reedición, catálogo, matriz y portada exacta del ejemplar hace falta una fotografía del CD, obi, contraportada o lomo.',
      notes:'La obra original japonesa apareció en 1971 con catálogo P-8056A. Existen numerosas reediciones en CD, entre ellas WEA Japan, Phoenix, Strange Days y Warner Music Japan; no se asigna una de ellas a tu ejemplar sin fotografía.',
      confidence:'Alta',
      metadata_status:'Obra identificada · edición física pendiente',
      support_kind:'CD comercial / edición por verificar',
      cover_url:'https://coverartarchive.org/release/b50361c4-f5c1-4452-b77f-6bced6ce2ecd/front-500',
      musicbrainz_search:'https://musicbrainz.org/search?query=Flower+Travellin+Band+Satori&type=release_group&method=indexed',
      discogs_search:'https://www.discogs.com/search/?q=Flower+Travellin+Band+Satori&type=release',
      artist_context:'Flower Travellin’ Band fue uno de los grupos más singulares del rock japonés de comienzos de los setenta. Formado en Tokio, desarrolló una mezcla de psicodelia, hard rock, blues y proto-metal que se alejaba de la simple imitación angloamericana. En Satori, la guitarra de Hideki Ishima, la voz de Joe Yamanaka, el bajo de Jun Kozuki y la batería de George Wada funcionan como una unidad mucho más experimental y pesada que en Anywhere.',
      artist_members:'Joe Yamanaka — voz y armónica · Hideki Ishima — guitarra · Jun Kozuki — bajo / guitarra · Joji “George” Wada — batería · producción: Ikuzo Orita y Yuya Uchida · mezclas: Norio Yoshizawa',
      curiosity:'Satori está concebido como cinco movimientos de una misma obra, no como una colección convencional de canciones. Décadas después siguió siendo el álbum de referencia del grupo y terminó entrando en numerosas selecciones de los discos esenciales del rock japonés.',
      reference_tracklist:[
        {track:1,title:'Satori, Part 1',duration:'5:25'},
        {track:2,title:'Satori, Part 2',duration:'7:06'},
        {track:3,title:'Satori, Part 3',duration:'10:44'},
        {track:4,title:'Satori, Part 4',duration:'11:01'},
        {track:5,title:'Satori, Part 5',duration:'7:58'}
      ]
    }
  ];

  additions.forEach(r=>{
    r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,r.artist_context,r.artist_members].filter(Boolean).join(' ');
    if(!data.some(x=>x.id===r.id))data.push(r);
    try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}
    try{
      if(r.cover_url&&typeof coverKey==='function'&&typeof coverCache==='object')coverCache[coverKey(r)]=r.cover_url;
    }catch(e){}
  });
  try{if(typeof saveCoverCache==='function')saveCoverCache();}catch(e){}

  if(typeof fetchCover==='function'){
    const priorFetch=fetchCover;
    fetchCover=async function(rec,force=false){
      if(rec&&rec.id==='R0260'&&!force)return additions[1].cover_url;
      return priorFetch(rec,force);
    };
  }

  const priorOpen=openDetail;
  openDetail=function(id){
    priorOpen(id);
    const r=additions.find(x=>x.id===id);if(!r)return;
    const detail=document.getElementById('detail');if(!detail)return;
    const artistBox=detail.querySelector('.artistContextBox');
    if(artistBox){
      artistBox.innerHTML=`<b>🎸 Sobre el artista / grupo</b><div class="artistContextText">${escapeHTML(r.artist_context)}</div><dl class="artistContextGrid"><dt>Origen</dt><dd>Tokio, Japón</dd><dt>Periodo</dt><dd>Finales de los 60 — primeros 70</dd><dt>Estilo</dt><dd>${escapeHTML(r.genre)}</dd><dt>Miembros / instrumentos</dt><dd>${escapeHTML(r.artist_members)}</dd></dl>`;
    }
    const curiosity=detail.querySelector('.curiosityBox .curiosityText');if(curiosity)curiosity.textContent=r.curiosity;
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
    legend.innerHTML=legend.innerHTML.replace('Maletín 2 = 95','Maletín 2 = 97').replace('Maletín 2 = 96','Maletín 2 = 97');
  }

  try{render();}catch(e){console.warn('catalog additions v3 render',e);}
  document.documentElement.dataset.catalogAdditionsV3=VERSION;
})();
