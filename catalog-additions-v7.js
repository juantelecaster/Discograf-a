(()=>{
 'use strict';
 if(!Array.isArray(data))return;
 const additions=[
  {
   id:'R0264',location:'Maletín 4',artist:'Kōhachiro Miyata',
   title:'Japan: Shakuhachi – The Japanese Flute',
   format:'CD',supports:1,type:'Álbum',year:'1977',
   genre:'Shakuhachi / Honkyoku / Música tradicional japonesa',
   label:'Nonesuch Explorer Series / Elektra Nonesuch',
   recording:'Una grabación solista de cinco piezas tradicionales para shakuhachi realizada durante la primera gira norteamericana de Ensemble Nipponia en 1976. Produjo David Lewiston, con ingeniería de Lewiston y Larry Mericka y masterización de Robert C. Ludwig. Apareció en LP en 1977; la edición en CD Elektra Nonesuch 7559-72076-2 está documentada en 1991.',
   edition:'Álbum original Nonesuch H-72076 (1977), reeditado en CD en 1991. La carátula corresponde a Japan: Shakuhachi – The Japanese Flute; la referencia exacta del CD físico queda por cotejar con disco y contraportada.',
   notes:'La grabación se centra únicamente en el shakuhachi de Kōhachiro Miyata. La portada fue aportada por el propietario; la identificación del álbum está respaldada por Nonesuch.',
   confidence:'Alta',metadata_status:'Obra identificada; edición física pendiente',
   support_kind:'CD / edición concreta por verificar',
   cover_url:'https://www.nonesuch.com/sites/g/files/g2000014771/files/2022-07/EXPLORER%2520SERIES%2520EAST%2520ASIA%2520Japan_Shakuhachi%2520The%2520Japanese%2520Flute%2520sq.jpg',
   official_reference:'https://www.nonesuch.com/albums/japan-shakuhachi-japanese-flute',
   discogs_search:'https://www.discogs.com/search/?q=Kohachiro+Miyata+Shakuhachi+The+Japanese+Flute&type=release',
   artist_context:'Kōhachiro Miyata es un intérprete japonés de shakuhachi vinculado a Ensemble Nipponia. Su trabajo ayudó a presentar el repertorio solista tradicional a las audiencias occidentales durante las giras de este conjunto por Norteamérica.',
   artist_members:'Kōhachiro Miyata — shakuhachi solo; sin acompañamiento instrumental en este álbum.',
   curiosity:'La toma se realizó en directo durante la primera gira norteamericana de Ensemble Nipponia, en 1976. Nonesuch conservó ese carácter de interpretación acústica directa en su serie Explorer.',
   tags:['Shakuhachi','Música japonesa','Honkyoku'],
   reference_tracklist:[
    {track:1,title:'Honshirabe',duration:'3:50'},
    {track:2,title:'Sanya',duration:'6:17'},
    {track:3,title:'Tsuru no Sugomori',duration:'6:08'},
    {track:4,title:'Shika no Tone',duration:'7:32'},
    {track:5,title:'Akita Sugagaki',duration:'9:30'}
   ]
  },
  {
   id:'R0265',location:'Maletín 4',artist:'Shakuhachi Sanbon-kai (Aoki, Yamamoto y Yokoyama)',
   title:'Gendai Shakuhachi-gaku: Sanbon no Hibiki / 現代尺八楽・三本のひびき',
   format:'CD / copia por verificar',supports:1,type:'Álbum',year:'1970',
   genre:'Shakuhachi / Hōgaku contemporáneo / Música japonesa del siglo XX',
   label:'Toshiba Records (edición original LP TH-7072)',
   recording:'Programa de cinco composiciones contemporáneas para trío de shakuhachi interpretadas por Shizuo Aoki (Reibo Aoki II), Hozan Yamamoto y Katsuya Yokoyama, integrantes de Shakuhachi Sanbon-kai. La propia carpeta se identifica como participación en el Festival de las Artes de Japón del año Shōwa 45 (1970). Los tres músicos exploran tramas, contrapuntos y contrastes de registro con flautas de distintas longitudes.',
   edition:'La portada y contraportada aportadas corresponden al LP japonés Toshiba Records TH-7072, catalogado por la biblioteca universitaria CiNii con fecha aproximada de 1970. El tipo y referencia del soporte de la colección personal todavía no están identificados a partir de estas imágenes de la carpeta de vinilo.',
   notes:'No confundir la edición de portada TH-7072 con otra referencia TH-9063 recogida para el mismo repertorio en ciertas discografías. Cinco obras, duración total aproximada 51:23.',
   confidence:'Alta',metadata_status:'Obra y LP original identificados; soporte personal pendiente',
   support_kind:'Soporte musical por verificar',
   cover_url:'https://juantelecaster.github.io/Discograf-a/assets/sanbon-no-hibiki-cover.jpg',
   official_reference:'https://ci.nii.ac.jp/ncid/BA67369361',
   discogs_search:'https://www.discogs.com/search/?q=Sanbon+No+Hibiki+TH-7072&type=release',
   artist_context:'Shakuhachi Sanbon-kai fue un trío de referencia de la música japonesa moderna, formado por intérpretes procedentes de distintas tradiciones del shakuhachi. Su actividad durante los años sesenta y setenta contribuyó a sacar la flauta de bambú del contexto exclusivamente solista y ampliar su lenguaje con nuevas obras de cámara.',
   artist_members:'Shizuo Aoki / Reibo Aoki II — shakuhachi · Hozan Yamamoto — shakuhachi · Katsuya Yokoyama — shakuhachi. La contraportada especifica diferentes medidas de tubo, aproximadamente 1 shaku 6 sun, 1 shaku 8 sun y 2 shaku 3 sun.',
   curiosity:'La portada indica «participación en el Festival de las Artes, año Shōwa 45», que corresponde a 1970. El trío no combina tres instrumentos distintos: aprovecha tres shakuhachi, cuyas diferentes longitudes proporcionan registros y colores complementarios.',
   tags:['Shakuhachi','Música japonesa','Hōgaku contemporáneo'],
   reference_tracklist:[
    {track:1,title:'尺八三重奏曲「鼎」 (Kanae) — Masao Matsumoto',duration:'12:24'},
    {track:2,title:'尺八三重奏曲 — Toshio Funakawa',duration:'13:22'},
    {track:3,title:'竹風第三番 (Takefū dai san-ban) — Shizuo Aoki',duration:'10:04'},
    {track:4,title:'音句 (Onku) — Katsuya Yokoyama',duration:'5:46'},
    {track:5,title:'生地 (Shōchi) — Hozan Yamamoto',duration:'9:47'}
   ]
  }
 ];
 const fresh=[];
 for(const r of additions){
   if(data.some(x=>x.id===r.id||(
       String(x.artist||'').toLowerCase()===r.artist.toLowerCase()&&String(x.title||'').toLowerCase()===r.title.toLowerCase()
     )))continue;
   r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.artist_context,r.artist_members].filter(Boolean).join(' ');
   data.push(r);fresh.push(r);
   try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}
 }
 const overrides=new Map(additions.map(r=>[r.id,r.cover_url]));
 try{
  for(const r of additions){
   if(typeof coverKey!=='function'||typeof coverCache!=='object')continue;
   coverCache[coverKey(r)]=r.cover_url;
  }
  if(typeof saveCoverCache==='function')saveCoverCache();
 }catch(e){}
 if(typeof fetchCover==='function'){
  const prior=fetchCover;
  fetchCover=async function(r,force=false){
   if(r&&overrides.has(r.id))return overrides.get(r.id);
   return prior(r,force);
  };
 }
 function updateCounts(){
  const map=[['statSupports',data.reduce((a,r)=>a+(Number(r.supports)||1),0)],
    ['statRecords',data.length],['statKnown',data.filter(r=>r.confidence==='Alta').length],
    ['statPending',data.filter(r=>r.confidence!=='Alta'||/pendiente/i.test(r.metadata_status||'')).length]];
  for(const [id,n] of map){const el=document.getElementById(id);if(el)el.textContent=n;}
  const legend=document.querySelector('.legend');
  if(legend){
   const n=data.filter(r=>r.location==='Maletín 4').reduce((sum,r)=>sum+(Number(r.supports)||1),0);
   if(/Maletín 4\s*=\s*\d+/.test(legend.textContent||''))legend.innerHTML=legend.innerHTML.replace(/Maletín 4\s*=\s*\d+/,'Maletín 4 = '+n);
   else legend.insertAdjacentText('beforeend',' · Maletín 4 = '+n);
  }
  for(const r of fresh){
   for(const [id,val] of [['support',r.support_kind],['genre',r.genre],['status',r.metadata_status]]){
    const e=document.getElementById(id);
    if(e&&val&&![...e.options].some(o=>o.value===val)){
      const option=document.createElement('option');option.value=val;option.textContent=val;e.append(option);
    }
   }
  }
 }
 const esc=s=>typeof escapeHTML==='function'?escapeHTML(String(s??'')):String(s??'');
 const before=openDetail;
 openDetail=function(id){
  before(id);
  const r=additions.find(x=>x.id===id);
  if(!r)return;
  const detail=document.getElementById('detail');if(!detail)return;
  const curios=detail.querySelector('.curiosityBox .curiosityText');
  if(curios)curios.textContent=r.curiosity;
  if(detail.querySelector('.shakuhachiGuide'))return;
  const guide=document.createElement('section');
  guide.className='shakuhachiGuide';
  guide.style.cssText='margin:15px 0 20px;padding:16px 18px;border:1px solid #34506a;background:#101a27;border-radius:14px;line-height:1.6';
  const extra=id==='R0265'
   ?'Escucha cómo cambia el color al alternar las flautas y cómo se entrelazan las tres líneas. «Kanae» presenta una larga construcción de cámara; en «Takefū» se pueden seguir los contrastes de articulación y registro; «Onku» explora frases más breves y gestos concentrados.'
   :'Fíjate en el papel del silencio y del aire al inicio de cada frase, en los ataques aspirados y en los cambios de timbre. «Tsuru no Sugomori» evoca el movimiento de las grullas; «Shika no Tone» utiliza llamadas y respuestas entre motivos.';
  guide.innerHTML='<h3 style="color:#c8e2ff;margin:0 0 6px">Contexto y escucha guiada</h3><p>'+esc(r.recording)+'</p><h4 style="color:#f0d694;margin:12px 0 5px">Mientras lo escuchas</h4><p>'+esc(extra)+'</p><div style="font-size:.83rem;color:#9bbad2">Fuente: <a target="_blank" rel="noopener" href="'+esc(r.official_reference)+'">'+esc(id==='R0265'?'Catálogo japonés CiNii':'Nonesuch Records')+'</a></div>';
  const dl=detail.querySelector('dl.detailgrid');
  if(dl)dl.insertAdjacentElement('afterend',guide);else detail.append(guide);
 };
 updateCounts();
 try{render();}catch(e){console.warn('Nuevas fichas de shakuhachi',e);}
 document.documentElement.dataset.shakuhachiAdditions='v7';
})();