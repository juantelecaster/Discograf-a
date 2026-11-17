(()=>{
  'use strict';
  const VERSION='catalog-additions-v5';
  if(!Array.isArray(data))return;

  const r={
    id:'R0262',
    location:'Estuche 4',
    artist:'Hozan Yamamoto',
    title:'Hozan Yamamoto’s Music Vol.1 / 山本邦山作品集成（一）',
    format:'CD',
    supports:1,
    type:'Álbum / recopilación de obras',
    year:'2006',
    genre:'Música tradicional japonesa / Shakuhachi / Koto / Hōgaku contemporáneo',
    label:'Japan Traditional Cultures Foundation / Victor Entertainment',
    recording:'Primero de los ocho volúmenes de la serie dedicada a las composiciones de Hozan Yamamoto. Esta edición recupera repertorio procedente de LP publicados entre 1980 y 1986 y añade material que no había aparecido en aquellos discos. Según la ficha oficial, las pistas 1–5 fueron grabadas en 1979 y las pistas 6–7 en 1991. El programa permite escuchar a Yamamoto no sólo como gran intérprete de shakuhachi, sino como compositor interesado en ampliar el lenguaje tradicional mediante combinaciones de shakuhachi, koto de 17 cuerdas, shamisen, percusión y conjuntos de hōgaku.',
    edition:'Edición japonesa en CD publicada el 22/02/2006 por Japan Traditional Cultures Foundation y distribuida por Victor Entertainment. Catálogo VZCG-570, EAN/JAN 4519239010972, 1 CD, duración aproximada 69:37. La edición física ha sido identificada directamente a partir de las fotografías aportadas de portada/contraportada y coincide con la ficha oficial del sello.',
    notes:'La serie Hozan Yamamoto’s Music consta de ocho volúmenes, VZCG-570 a VZCG-577, publicados simultáneamente el 22/02/2006. Este es el Vol.1. La portada muestra a Yamamoto con shakuhachi y un koto en primer plano.',
    confidence:'Alta',
    metadata_status:'Edición física identificada',
    support_kind:'CD comercial',
    cover_url:'https://search.japo-net.or.jp/jacket/vzcg-570.jpg',
    official_reference:'https://s.jtcf.jp/item.php?id=vzcg-570',
    musicbrainz_search:'https://musicbrainz.org/search?query=Hozan+Yamamoto+VZCG-570&type=release&method=indexed',
    discogs_search:'https://www.discogs.com/search/?q=Hozan+Yamamoto+VZCG-570&type=release',
    artist_context:'Hozan Yamamoto (山本邦山, 1937–2014) fue uno de los grandes renovadores del shakuhachi japonés de la segunda mitad del siglo XX. Intérprete, compositor y pedagogo de la escuela Tozan, combinó un profundo dominio de la tradición con una voluntad constante de llevar el instrumento a otros contextos: música contemporánea, jazz, orquesta, cine y colaboraciones internacionales. Formó el trío Shakuhachi Sanbon-kai con Reibo Aoki y Katsuya Yokoyama, desarrolló una extensa actividad internacional, ejerció como profesor en la Universidad de las Artes de Tokio y en 2002 fue reconocido como Tesoro Nacional Viviente de Japón por su dominio del shakuhachi.',
    artist_members:'Hozan Yamamoto — shakuhachi y composición · 中島靖子 — koto de 17 cuerdas (pistas 1–2) · 堅田喜三久 — taiko (pista 3) · 岡田知之 — timbales (pista 3) · 牛腸征司 — dirección (pistas 3 y 5) · 正派合奏団 — conjunto · 宮本雅都貴 — koto (pista 4) · 本條秀太郎 — shamisen (pista 6) · 都山流邦山会 — shakuhachi',
    curiosity:'Este CD no es una simple antología interpretativa: reúne composiciones del propio Hozan Yamamoto y forma parte de una serie de ocho volúmenes publicada de manera simultánea en 2006. Aunque Yamamoto fue célebre internacionalmente por sus cruces con el jazz —incluidas colaboraciones con Tony Scott y Gary Peacock—, este primer volumen se concentra en su escritura para shakuhachi, koto y conjuntos de música tradicional japonesa.',
    reference_tracklist:[
      {track:1,title:'尺八と十七弦のための二章 紫苑 第一楽章',duration:'7:07'},
      {track:2,title:'尺八と十七弦のための二章 紫苑 第二楽章',duration:'5:04'},
      {track:3,title:'合奏協奏曲 太鼓',duration:'15:26'},
      {track:4,title:'絃のしらべ',duration:'7:12'},
      {track:5,title:'晩夏',duration:'10:49'},
      {track:6,title:'三弦独奏曲 ゆずり木',duration:'14:54'},
      {track:7,title:'尺八独奏曲 雁',duration:'8:55'}
    ]
  };

  r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,r.artist_context,r.artist_members].filter(Boolean).join(' ');
  if(!data.some(x=>x.id===r.id))data.push(r);
  try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}

  try{
    if(typeof coverKey==='function'&&typeof coverCache==='object'){
      coverCache[coverKey(r)]=r.cover_url;
      if(typeof saveCoverCache==='function')saveCoverCache();
    }
  }catch(e){}
  if(typeof fetchCover==='function'){
    const priorFetch=fetchCover;
    fetchCover=async function(rec,force=false){
      if(rec&&rec.id==='R0262')return r.cover_url;
      return priorFetch(rec,force);
    };
  }

  const priorOpen=openDetail;
  openDetail=function(id){
    priorOpen(id);
    if(id!=='R0262')return;
    const detail=document.getElementById('detail');if(!detail)return;
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
  if(legend&&!/Estuche 4\s*=/.test(legend.textContent||'')){
    legend.insertAdjacentHTML('beforeend',' · <span>Estuche 4 = 1</span>');
  }

  try{render();}catch(e){console.warn('catalog additions v5 render',e);}
  document.documentElement.dataset.catalogAdditionsV5=VERSION;
})();