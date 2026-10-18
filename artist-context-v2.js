(()=>{
  'use strict';
  const VERSION='artist-context-v2';
  const CACHE_KEY='juan_music_artist_context_v2';
  const esc=s=>typeof escapeHTML==='function'?escapeHTML(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();

  const css=document.createElement('style');
  css.textContent=`
    .artistContextV2{margin:18px 0 4px;padding:17px 18px;border:1px solid #3a536f;background:linear-gradient(180deg,#121c29,#0e151f);border-radius:14px}
    .artistContextV2 .artistTitle{font-weight:800;color:#a8d8ff;font-size:1rem;display:flex;align-items:center;gap:8px}
    .artistContextV2 .artistLead{line-height:1.65;color:#e1e8f1;margin:9px 0 13px;font-size:.96rem}
    .artistContextV2 .artistHistorical{line-height:1.55;color:#cdd8e8;margin:9px 0 13px;padding:10px 12px;border-left:3px solid #4d7098;background:#0b121c;border-radius:0 9px 9px 0}
    .artistFactsV2{display:grid;grid-template-columns:145px 1fr;gap:7px 13px;margin:10px 0 0;font-size:.9rem}
    .artistFactsV2 dt{color:#91a4bd;font-weight:700}.artistFactsV2 dd{margin:0;color:#e7edf5}
    .artistCollectionV2{margin-top:13px;padding-top:12px;border-top:1px solid #28384d;color:#c7d2df;font-size:.88rem;line-height:1.5}
    .artistWikiHint{margin-top:10px;color:#9fb0c5;font-size:.82rem;line-height:1.45}
    .artistSourcesV2{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}
    .artistSourcesV2 a{font-size:.78rem;color:#a8d8ff;text-decoration:none;border:1px solid #344a64;border-radius:999px;padding:5px 8px;background:#0b121b}
    .artistLoadingV2{color:#9eabc0;font-size:.9rem;margin-top:9px}
    @media(max-width:620px){.artistFactsV2{grid-template-columns:1fr}.artistFactsV2 dt{margin-top:5px}}
  `;
  document.head.appendChild(css);

  const CURATED={
    'Rare Earth':{
      lead:'Rare Earth fue una banda de Detroit que llevó el soul y el R&B de Motown hacia un formato de rock de gran potencia escénica. Surgieron como The Sunliners y, ya como Rare Earth, se convirtieron en el primer grupo de rock blanco de gran éxito dentro de la órbita Motown. Su repertorio combinó versiones extensas de material soul con órgano, guitarras, sección rítmica muy marcada y una puesta en escena cercana al rock de festival de comienzos de los setenta.',
      context:'Su importancia está en el cruce entre dos mundos que normalmente se cuentan por separado: la tradición de estudio de Motown y la expansión del hard rock, el funk y el jazz-rock. “Get Ready” y “(I Know) I’m Losing You” muestran bien esa transformación de canciones soul en largas piezas de rock.',
      origin:'Detroit, Michigan, Estados Unidos',period:'1960s–2021',
      source:'https://www.motownmuseum.org/artist/rare-earth/'
    },
    'Grand Funk Railroad':{
      lead:'Grand Funk Railroad nació en Flint, Michigan, en 1969 y convirtió el blues-rock en una música mucho más física, repetitiva y contundente. El trío inicial de Mark Farner, Mel Schacher y Don Brewer basó su identidad en riffs masivos, bajo muy presente y conciertos de enorme volumen, una fórmula que anticipó parte del hard rock estadounidense de los setenta.',
      context:'Aunque la crítica de su época fue con frecuencia hostil, el público los convirtió en uno de los grandes fenómenos de directo de Estados Unidos. Su evolución va desde la crudeza casi proto-metal de los primeros discos hasta producciones más pulidas y orientadas al funk, soul y rock de estadios.',
      origin:'Flint, Michigan, Estados Unidos',period:'Desde 1969',source:'https://en.wikipedia.org/wiki/Grand_Funk_Railroad'
    },
    'Pink Floyd':{
      lead:'Pink Floyd surgió en el Londres psicodélico de mediados de los sesenta alrededor de Syd Barrett y, tras su salida, evolucionó hacia una formación estable con David Gilmour, Roger Waters, Richard Wright y Nick Mason. El grupo hizo del estudio de grabación una herramienta compositiva: largas estructuras, diseño sonoro, electrónica, letras conceptuales y una producción especialmente detallada.',
      context:'Su trayectoria conecta la psicodelia británica con el rock progresivo y el concepto de álbum como obra unitaria. En los años setenta desarrollaron una de las secuencias discográficas más influyentes del rock, con discos que exploran tiempo, alienación, industria musical, poder y aislamiento.',
      origin:'Londres, Reino Unido',period:'1965–2014',source:'https://en.wikipedia.org/wiki/Pink_Floyd'
    },
    'The Doors':{
      lead:'The Doors se formaron en Los Ángeles en 1965 y construyeron un sonido inmediatamente reconocible alrededor de la voz y las letras de Jim Morrison, el órgano de Ray Manzarek, la guitarra de Robby Krieger y la batería de John Densmore. Al carecer habitualmente de bajista fijo en directo, Manzarek cubría muchas líneas graves con teclados, una particularidad que contribuyó a su timbre.',
      context:'Su música mezcló blues, psicodelia, jazz, teatro y poesía beat en plena contracultura californiana. El grupo fue capaz de alternar canciones compactas con improvisaciones extensas y piezas de fuerte componente dramático, convirtiéndose en uno de los nombres centrales del rock estadounidense de finales de los sesenta.',
      origin:'Los Ángeles, California, Estados Unidos',period:'1965–1973',source:'https://en.wikipedia.org/wiki/The_Doors'
    },
    'Frijid Pink':{
      lead:'Frijid Pink se formó en Detroit a partir de The Detroit Vibrations y adoptó su nuevo nombre en 1967. Su sonido combinaba la crudeza del circuito de rock de Michigan con guitarras distorsionadas, batería muy pesada y una lectura endurecida del blues y el soul.',
      context:'El grupo alcanzó proyección internacional con su versión de “House of the Rising Sun”, llevada a un terreno mucho más saturado y agresivo que la lectura de The Animals. En su primera etapa llegó a compartir la escena de Detroit con nombres que estaban definiendo el hard rock de finales de los sesenta.',
      origin:'Detroit, Michigan, Estados Unidos',period:'Desde 1967',source:'https://frijidpink.com/'
    },
    'Clark-Hutchinson':{
      lead:'Clark-Hutchinson fue un dúo británico articulado alrededor del guitarrista Mick Hutchinson y el multiinstrumentista Andy Clark. Su música se movió entre la psicodelia, el blues, la improvisación y el rock progresivo temprano, con especial protagonismo de la guitarra de Hutchinson y estructuras abiertas poco convencionales.',
      context:'El proyecto pertenece a esa franja del underground británico de finales de los sesenta en la que jazz, blues psicodélico y experimentación de estudio empezaban a desbordar la forma de canción. Sus discos son especialmente apreciados por coleccionistas de progressive y heavy psych británico.',
      origin:'Reino Unido',period:'Finales de los 60 – primeros 70',source:'https://en.wikipedia.org/wiki/Clark-Hutchinson'
    },
    'Freedom':{
      lead:'Freedom fue un grupo británico formado por antiguos miembros de Procol Harum, inicialmente Ray Royer y Bobby Harrison. Tras una primera etapa psicodélica, la formación cambió y se orientó hacia un hard rock más directo, con Roger Saunders a la guitarra y Walter Monaghan al bajo.',
      context:'Su historia resume bien la transición británica entre la psicodelia de 1967–68 y el hard rock de comienzos de los setenta. Llegaron a compartir giras con Black Sabbath, Jethro Tull y James Gang, pero nunca alcanzaron el reconocimiento masivo de varios de sus contemporáneos.',
      origin:'Inglaterra, Reino Unido',period:'Finales de los 60 – primeros 70',source:'https://en.wikipedia.org/wiki/Freedom_(band)'
    },
    'Faces':{
      lead:'Faces nació de la unión de tres miembros de Small Faces —Ronnie Lane, Ian McLagan y Kenney Jones— con Rod Stewart y Ronnie Wood, procedentes del Jeff Beck Group. Su sonido se apoyó en rock and roll, rhythm & blues y folk británico, con una interpretación deliberadamente suelta y festiva.',
      context:'La banda ocupa un lugar clave entre el rock británico de finales de los sesenta y el pub rock de la década siguiente. Aunque la carrera solista de Rod Stewart terminó eclipsando comercialmente al grupo, Faces dejó una influencia enorme en la manera de entender el rock de guitarras informal, crudo y de directo.',
      origin:'Londres, Reino Unido',period:'1969–1975',source:'https://en.wikipedia.org/wiki/Faces_(band)'
    },
    'Beastie Boys':{
      lead:'Beastie Boys comenzaron como un grupo de hardcore punk neoyorquino y se transformaron durante los años ochenta en uno de los proyectos decisivos para la expansión del hip hop. Mike D, MCA y Ad-Rock combinaron rap, cultura punk, sampling, funk y un sentido muy particular del humor y la producción.',
      context:'Su carrera es especialmente importante por cómo cruzó escenas que entonces parecían separadas. Paul’s Boutique llevó el collage de samples a una densidad extraordinaria; discos posteriores recuperaron instrumentos tocados por el propio trío y ampliaron todavía más su vocabulario sonoro.',
      origin:'Nueva York, Estados Unidos',period:'1981–2012',source:'https://en.wikipedia.org/wiki/Beastie_Boys'
    },
    'Deep Purple':{
      lead:'Deep Purple fue uno de los grupos que definieron la gramática del hard rock británico: guitarra y órgano tratados como instrumentos solistas equivalentes, una sección rítmica poderosa y voces de gran registro. Su formación conocida como Mark II reunió a Ian Gillan, Ritchie Blackmore, Jon Lord, Roger Glover e Ian Paice.',
      context:'Entre finales de los sesenta y comienzos de los setenta, el grupo pasó de una psicodelia con elementos clásicos a un hard rock mucho más compacto y virtuoso. Junto con Led Zeppelin y Black Sabbath, suele situarse en el núcleo de la consolidación del heavy rock británico.',
      origin:'Hertford, Reino Unido',period:'Desde 1968',source:'https://en.wikipedia.org/wiki/Deep_Purple'
    },
    'Golden Earring':{
      lead:'Golden Earring fue una banda neerlandesa formada en La Haya a comienzos de los sesenta. Su trayectoria atravesó beat, psicodelia, hard rock y rock progresivo, manteniendo durante décadas una formación muy estable alrededor de George Kooymans, Rinus Gerritsen, Barry Hay y Cesar Zuiderwijk.',
      context:'El grupo consiguió algo poco común para una banda continental europea de su generación: una carrera internacional prolongada y varios éxitos transatlánticos. “Radar Love” se convirtió en su canción emblemática y en uno de los grandes clásicos del rock europeo de carretera.',
      origin:'La Haya, Países Bajos',period:'1961–2021',source:'https://en.wikipedia.org/wiki/Golden_Earring'
    },
    'Affinity':{
      lead:'Affinity fue una banda británica de jazz-rock y rock progresivo cuya formación clásica tomó forma en 1968. La voz de Linda Hoyle se apoyaba en el órgano Hammond de Lynton Naiff, la guitarra de Mike Jopp, el bajo de Mo Foster y la batería de Grant Serpell.',
      context:'Su único LP de estudio apareció en Vertigo en 1970 y representa muy bien el punto de contacto entre jazz, soul, psicodelia y progressive británico. La corta vida del grupo hizo que su reputación creciera sobre todo después de su separación, especialmente entre coleccionistas del sello Vertigo.',
      origin:'Sussex / Londres, Reino Unido',period:'1968–1972 aprox.',source:'https://en.wikipedia.org/wiki/Affinity_(band)'
    },
    'Alice':{
      lead:'Alice fue un grupo francés de rock progresivo formado en 1970 por músicos procedentes de las escenas blues-rock de Alan Jack Civilization y We Free. Su propuesta incorporó flautas, cuerdas, vibráfono, teclados y guitarras, mezclando rock progresivo con jazz, música clásica europea y elementos de folk sudamericano.',
      context:'El grupo pertenece a la primera oleada del progressive francés, nacida en torno al clima experimental de festivales como Actuel en Amougies. Su debut de 1970 en BYG conserva una sonoridad abierta y ecléctica, anterior a la codificación más sinfónica que dominaría buena parte del género.',
      origin:'Francia',period:'1970–1973',source:'https://bygrecords.bandcamp.com/album/alice/'
    },
    'McKenna Mendelson Mainline':{
      lead:'McKenna Mendelson Mainline fue una banda canadiense de blues-rock formada en Toronto en 1968 alrededor del guitarrista Mike McKenna y el cantante y guitarrista Joe Mendelson. Su enfoque evitaba el blues pulido: prefería guitarras ásperas, boogie pesado y una interpretación muy física.',
      context:'El grupo surgió en la misma escena canadiense que conectaba clubes de blues, psicodelia y hard rock a finales de los sesenta. Su debut Stink se convirtió con el tiempo en una referencia de culto del blues-rock canadiense, aunque la formación cambió repetidamente.',
      origin:'Toronto, Canadá',period:'1968–1975',source:'https://en.wikipedia.org/wiki/McKenna_Mendelson_Mainline'
    },
    'Flower Travellin’ Band':{
      lead:'Flower Travellin’ Band surgió en Tokio a partir del proyecto de Yuya Uchida y terminó asentándose como un cuarteto con Joe Yamanaka, Hideki Ishima, Jun Kozuki y George Wada. Tomaron influencias del acid rock y el heavy británico, pero desarrollaron una identidad propia mediante la voz extrema de Yamanaka, la guitarra de Ishima y una concepción muy abierta de la forma.',
      context:'Anywhere todavía transforma repertorio occidental; Satori, en cambio, está compuesto por cinco movimientos originales y concentra el lenguaje más personal de la banda. Su posterior etapa canadiense convirtió al grupo en uno de los primeros ejemplos realmente internacionales del rock japonés pesado.',
      origin:'Tokio, Japón',period:'1969–1973; reunión 2007–2011',source:'https://en.wikipedia.org/wiki/Flower_Travellin%27_Band'
    },
    'Morgen':{
      lead:'Morgen fue un grupo de heavy psych neoyorquino construido alrededor del cantante y guitarrista Steve Morgen. Su único álbum combina riffs fuzz muy densos con letras de imaginería fantástica, cambios de dinámica y pasajes psicodélicos que lo sitúan en la frontera entre el acid rock y el hard rock naciente.',
      context:'El disco fue grabado en 1968 pero no apareció hasta finales de 1969, un retraso que contribuyó a que el grupo quedara fuera del relato principal de la época. Con el tiempo se convirtió en un álbum de culto muy buscado por coleccionistas de psicodelia estadounidense.',
      origin:'Nueva York, Estados Unidos',period:'Finales de los 60',source:'https://morgen1.bandcamp.com/album/morgen'
    },
    'Osamu Kitajima':{
      lead:'Osamu Kitajima es un compositor y multiinstrumentista japonés que pasó de la psicodelia de finales de los sesenta a una investigación muy personal sobre la convivencia entre rock, jazz, electrónica e instrumentos tradicionales japoneses. Antes de firmar con su propio nombre había grabado música pop psicodélica bajo el seudónimo Justin Heathcliff.',
      context:'En Benzaiten esa búsqueda aparece ya plenamente formulada: biwa, shakuhachi, shō y percusión japonesa conviven con sintetizadores, guitarra eléctrica, bajo y técnicas de producción occidentales. Esa mezcla lo sitúa entre los pioneros de una fusión japonesa que después tendría múltiples desarrollos.',
      origin:'Japón',period:'Desde finales de los 60',source:'https://www.eastquest.com/works.html'
    }
  };

  function artistRecords(name){
    return data.filter(r=>norm(r.artist)===norm(name) && !/^t[ií]tulo por/i.test(String(r.title||'')));
  }
  function localCollectionText(name){
    const rs=artistRecords(name).sort((a,b)=>(Number(String(a.year).match(/\d{4}/)?.[0])||9999)-(Number(String(b.year).match(/\d{4}/)?.[0])||9999));
    if(!rs.length)return '';
    const items=rs.slice(0,8).map(r=>`${r.title}${String(r.year||'').match(/\d{4}/)?` (${String(r.year).match(/\d{4}/)[0]})`:''}`);
    return `En tu colección aparecen ${rs.length===1?'1 título':`${rs.length} títulos`}: ${items.join(' · ')}${rs.length>8?' · …':''}.`;
  }
  function genreContext(genres=[],begin=''){
    const g=norm(genres.join(' '));const y=Number(begin)||0;
    if(/psychedelic|acid rock|heavy psych/.test(g))return y&&y<1972?'Se sitúa en la expansión de la psicodelia de finales de los sesenta y comienzos de los setenta, cuando el rock empezó a endurecer el sonido y a ampliar sus formas.':'Su lenguaje está vinculado a la psicodelia y al uso del estudio, la improvisación y la expansión tímbrica como elementos compositivos.';
    if(/progressive|prog rock/.test(g))return 'Su trayectoria se relaciona con el rock progresivo: estructuras más largas, mayor peso de la instrumentación y una concepción del álbum más cercana a una obra completa que a una simple colección de canciones.';
    if(/blues/.test(g))return 'Su música parte de la tradición del blues y de su electrificación, pero la desplaza hacia el lenguaje del rock mediante mayor volumen, riffs y una sección rítmica más contundente.';
    if(/jazz/.test(g))return 'Su contexto está ligado al jazz y a su evolución moderna, donde la improvisación, el diálogo entre solistas y los cambios de lenguaje armónico tienen un papel central.';
    if(/hip hop|rap/.test(g))return 'Su trayectoria se inscribe en la expansión del hip hop como cultura de producción, sampling, rima y reinterpretación de grabaciones preexistentes.';
    if(/hard rock|heavy metal/.test(g))return 'Su sonido pertenece a la consolidación del rock pesado: riffs dominantes, mayor volumen, baterías contundentes y una relación muy directa entre composición y energía de directo.';
    if(/folk/.test(g))return 'Su música dialoga con tradiciones folk y repertorios populares, trasladándolos a un contexto de grabación y escucha contemporáneo.';
    return '';
  }

  let cache={};try{cache=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')||{};}catch(e){}
  let mbQueue=Promise.resolve(),lastMB=0;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function mbFetch(url){const run=async()=>{const wait=Math.max(0,1100-(Date.now()-lastMB));if(wait)await sleep(wait);try{const res=await fetch(url,{headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`MusicBrainz ${res.status}`);return res.json();}finally{lastMB=Date.now();}};const p=mbQueue.then(run,run);mbQueue=p.catch(()=>{});return p;}
  function scoreArtist(name,a){const q=norm(name),n=norm(a?.name),s=norm(a?.['sort-name']);if(q===n)return 100;if(q===s)return 96;if(n.includes(q)||q.includes(n))return 65;return 0;}
  async function mbInfo(name){
    const key='mb:'+norm(name);if(cache[key])return cache[key];
    if(!name||/varios|pendiente|archivo|material didactico/i.test(norm(name)))return {};
    const q='artist:"'+String(name).replace(/["\\]/g,' ')+'"';
    const sr=await mbFetch('https://musicbrainz.org/ws/2/artist/?fmt=json&limit=8&query='+encodeURIComponent(q));
    const best=(sr.artists||[]).map(a=>({a,s:scoreArtist(name,a)})).sort((x,y)=>y.s-x.s)[0];
    if(!best||best.s<80)return {};
    const a=await mbFetch('https://musicbrainz.org/ws/2/artist/'+best.a.id+'?fmt=json&inc=artist-rels+instrument-rels+genres+tags');
    const genres=[...new Set([...(a.genres||[]),...(a.tags||[])].sort((x,y)=>(y.count||0)-(x.count||0)).map(x=>x.name).filter(Boolean))].slice(0,7);
    const members=(a.relations||[]).filter(x=>x['target-type']==='artist'&&/member of band|founder/i.test(String(x.type||''))).map(x=>x.artist?.name).filter(Boolean);
    const instruments=[...new Set((a.relations||[]).filter(x=>x['target-type']==='instrument').map(x=>x.instrument?.name||x['target-credit']).filter(Boolean))].slice(0,10);
    const info={mbid:a.id,type:a.type||'',origin:a['begin-area']?.name||a.area?.name||'',begin:String(a['life-span']?.begin||'').slice(0,4),end:String(a['life-span']?.end||'').slice(0,4),genres,members:[...new Set(members)].slice(0,12),instruments};
    cache[key]=info;try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache));}catch(e){}return info;
  }

  function shortWords(text,max=24){
    const clean=String(text||'').replace(/\s+/g,' ').trim();if(!clean)return '';
    const sentence=clean.split(/(?<=[.!?])\s+/)[0]||clean;
    const words=sentence.split(' ');return words.length<=max?sentence:words.slice(0,max).join(' ')+'…';
  }
  async function wikiInfo(name){
    const key='wiki:'+norm(name);if(cache[key])return cache[key];
    if(!name||/varios|pendiente|archivo|material didactico/i.test(norm(name)))return {};
    for(const lang of ['es','en']){
      try{
        const api=`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=0&gsrlimit=6&gsrsearch=${encodeURIComponent(name+' music')}&prop=extracts&exintro=1&explaintext=1&exsectionformat=plain`;
        const res=await fetch(api);if(!res.ok)continue;const j=await res.json();
        const pages=Object.values(j?.query?.pages||{});const q=norm(name);
        const ranked=pages.map(p=>{const base=norm(String(p.title||'').replace(/\s*\([^)]*\)\s*$/,''));let s=base===q?100:(base.includes(q)||q.includes(base)?70:0);const e=norm(p.extract);if(/band|banda|group|grupo|singer|cantante|musician|musico|composer|compositor/.test(e))s+=10;return{p,s};}).sort((a,b)=>b.s-a.s);
        if(ranked[0]?.s>=70){const p=ranked[0].p;const info={lang,title:p.title,blurb:shortWords(p.extract,24),url:`https://${lang}.wikipedia.org/wiki/${encodeURIComponent(String(p.title).replace(/ /g,'_'))}`};cache[key]=info;try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache));}catch(e){}return info;}
      }catch(e){}
    }
    return {};
  }

  function synthesis(name,mb,wiki,r){
    const curated=CURATED[name];
    if(curated)return {lead:curated.lead,context:curated.context,origin:curated.origin,period:curated.period,source:curated.source};
    if(r.artist_context)return {lead:r.artist_context,context:genreContext(mb.genres||String(r.genre||'').split('/'),mb.begin),origin:mb.origin||'',period:[mb.begin,mb.end].filter(Boolean).join('–')};
    const type=/group/i.test(mb.type||'')?'grupo':/person/i.test(mb.type||'')?'artista':'proyecto musical';
    let lead=`${name} es un ${type}`;
    if(mb.origin)lead+=` originario de ${mb.origin}`;
    if(mb.begin)lead+=`, activo desde ${mb.begin}`;
    if(mb.end)lead+=` hasta ${mb.end}`;
    lead+='.';
    if((mb.genres||[]).length)lead+=` Su perfil musical se asocia principalmente con ${mb.genres.slice(0,5).join(', ')}.`;
    if(wiki.blurb)lead+=` La referencia enciclopédica lo resume así: «${wiki.blurb}»`;
    return {lead,context:genreContext(mb.genres||String(r.genre||'').split('/'),mb.begin),origin:mb.origin||'',period:[mb.begin,mb.end].filter(Boolean).join('–')};
  }

  function insertBox(){
    const detail=document.getElementById('detail');if(!detail)return null;
    detail.querySelector('.artistContextBox')?.remove();
    detail.querySelector('.artistContextV2')?.remove();
    const box=document.createElement('div');box.className='artistContextV2 artistContextBox';
    const curiosity=detail.querySelector('.curiosityBox'),editor=detail.querySelector('.editorBox');
    if(curiosity)curiosity.insertAdjacentElement('afterend',box);else if(editor)editor.parentNode.insertBefore(box,editor);else detail.appendChild(box);
    return box;
  }
  function paint(box,r,profile,mb,wiki){
    if(!box||!document.body.contains(box))return;
    const collection=localCollectionText(r.artist);
    const members=r.artist_members?String(r.artist_members):((mb.members||[]).join(' · '));
    const instruments=(mb.instruments||[]).join(' · ');
    const genres=(mb.genres||[]).length?mb.genres.join(' · '):String(r.genre||'');
    const sourceLinks=[];
    const primary=profile.source||wiki.url;if(primary)sourceLinks.push(`<a href="${esc(primary)}" target="_blank" rel="noopener">Biografía / contexto ↗</a>`);
    if(mb.mbid)sourceLinks.push(`<a href="https://musicbrainz.org/artist/${encodeURIComponent(mb.mbid)}" target="_blank" rel="noopener">MusicBrainz ↗</a>`);
    if(wiki.url&&wiki.url!==primary)sourceLinks.push(`<a href="${esc(wiki.url)}" target="_blank" rel="noopener">Wikipedia ↗</a>`);
    box.innerHTML=`<div class="artistTitle">🎸 Sobre ${/group/i.test(mb.type||'')?'el grupo':'el artista'}</div>
      <div class="artistLead">${esc(profile.lead||'')}</div>
      ${profile.context?`<div class="artistHistorical"><strong>Contexto:</strong> ${esc(profile.context)}</div>`:''}
      <dl class="artistFactsV2">
        ${(profile.origin||mb.origin)?`<dt>Origen</dt><dd>${esc(profile.origin||mb.origin)}</dd>`:''}
        ${(profile.period||mb.begin||mb.end)?`<dt>Periodo</dt><dd>${esc(profile.period||[mb.begin,mb.end].filter(Boolean).join('–'))}</dd>`:''}
        ${genres?`<dt>Estilos</dt><dd>${esc(genres)}</dd>`:''}
        ${members?`<dt>Miembros / músicos</dt><dd>${esc(members)}</dd>`:''}
        ${instruments?`<dt>Instrumentos asociados</dt><dd>${esc(instruments)}</dd>`:''}
      </dl>
      ${collection?`<div class="artistCollectionV2"><strong>En tu colección:</strong> ${esc(collection.replace(/^En tu colección:\s*/,''))}</div>`:''}
      ${wiki.blurb&&!CURATED[r.artist]?`<div class="artistWikiHint">Referencia breve contrastada con Wikipedia; el resto del perfil se construye con datos estructurados de MusicBrainz y la información de tu catálogo.</div>`:''}
      ${sourceLinks.length?`<div class="artistSourcesV2">${sourceLinks.join('')}</div>`:''}`;
  }

  async function enhanceArtist(r){
    const box=insertBox();if(!box)return;
    box.innerHTML='<div class="artistTitle">🎸 Sobre el artista / grupo</div><div class="artistLoadingV2">Consultando información pública contrastada…</div>';
    let mb={},wiki={};try{[mb,wiki]=await Promise.all([mbInfo(r.artist),wikiInfo(r.artist)]);}catch(e){console.warn('artist-context-v2',e);}
    if(!document.body.contains(box))return;
    const profile=synthesis(r.artist,mb,wiki,r);
    if(!profile.lead||/^\w+ es un proyecto musical\.$/.test(profile.lead))profile.lead=r.artist_context||`No he encontrado todavía una coincidencia pública suficientemente segura para ampliar automáticamente la biografía de ${r.artist}.`;
    paint(box,r,profile,mb,wiki);
  }

  const beforeOpen=openDetail;
  openDetail=function(id){beforeOpen(id);const r=data.find(x=>x.id===id);if(r)enhanceArtist(r);};
  const opened=document.querySelector('[data-editor]');if(opened){const r=data.find(x=>x.id===opened.dataset.editor);if(r)enhanceArtist(r);}
  document.documentElement.dataset.artistContextV2=VERSION;
})();