(()=>{
 'use strict';
 const VERSION='semantic-tags-v1';
 if(!Array.isArray(data))return;
 const r=data.find(x=>x.id==='R0249');
 if(!r)return;
 // Ficha del disco del bajista malagueño, contrastada con su biografía
 // y la programación pública de la Universidad de Málaga.
 r.year='2017';
 r.genre='Jazz / Funk / Jazz fusión';
 r.label='Romero Music Spain (álbum original; edición física por verificar)';
 r.recording='Debut discográfico de Miguel Ángel Gil como compositor. Grabado los días 30 y 31 de agosto de 2016 en PuertoRecords, según el vídeo publicado por el propio músico, y publicado por Romero Music Spain en 2017. El proyecto reúne nueve composiciones propias con influencias de jazz, funk, flamenco, bolero y samba. Conviene distinguir esta primera edición de Grooveland: The Master Session (2019), posterior grabación con Perico Sambeat.';
 r.artist_context='Miguel Ángel Gil Gutiérrez es un bajista y contrabajista nacido en Málaga. Estudió inicialmente saxofón clásico en la escuela municipal de Coín y el conservatorio malagueño; más adelante descubrió el jazz y se formó de manera autodidacta en el bajo eléctrico, antes de estudiar contrabajo. Participó en la escena jazzística malagueña y en el grupo de fusión Altramuz. En 2017 publicó Grooveland como primer álbum propio y fundó su quinteto de jazz, donde el groove del bajo convive con armonías modernas, vibráfono y vientos.';
 r.artist_members='Miguel Ángel Gil — bajo eléctrico y contrabajo · Ernesto Aurignac — saxo alto · Arturo Serra — vibráfono · Juan Galiardo — piano y teclados · Dani Domínguez — batería. Nacho Loring — trompeta, mencionado en el vídeo de las sesiones de 2016 del propio músico.';
 r.notes='El año 2017 y el sello Romero Music Spain están respaldados por la biografía oficial del artista. El detalle de la edición física, su catálogo y matriz sigue pendiente de verificar. La Universidad de Málaga presentó este repertorio en el Ciclo de Jazz de 2018.';
 r.metadata_status='Verificado a nivel de obra; edición física pendiente';
 r.official_reference='https://miguelagil.kolpgroup.com/19-2';
 r.recording_reference='https://www.youtube.com/watch?v=QbNB6Il84jg';
 r.curiosity='Aunque es conocido como bajista, Miguel Ángel Gil empezó estudiando saxofón clásico. Aprendió el bajo eléctrico por su cuenta y después estudió contrabajo. En 2019 volvió a grabar material de Grooveland con el saxofonista Perico Sambeat.';
 r.tags=[...new Set([...(Array.isArray(r.tags)?r.tags:[]),'Bajo','Contrabajo','Bajista','Málaga','Jazz fusión','Funk'])];
 r.instrument_keywords=['bajo','bajista','bajo eléctrico','bass','electric bass','contrabajo','double bass'];
 r.search_text=[
  r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,
  r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,
  r.artist_context,r.artist_members,...r.tags,...r.instrument_keywords,
  'malagueño','malagueña','malaga','coín','coin','groove'
 ].filter(Boolean).join(' ');
 try{searchIndex.set(r.id,fold(r.search_text));}catch(e){console.warn('No se pudo actualizar índice de Grooveland',e);}

 // Mantenimiento general: todas las etiquetas ya existentes son palabras
 // buscables, aunque el disco haya sido incorporado por un parche posterior.
 data.forEach(rec=>{
  if(rec.id===r.id||!Array.isArray(rec.tags)||!rec.tags.length)return;
  const current=searchIndex.get(rec.id)||'';
  const words=fold(rec.tags.join(' '));
  if(words&&!current.includes(words)){
   try{searchIndex.set(rec.id,(current+' '+words).trim());}catch(e){}
  }
 });

 // Añadir etiquetas a la lista existente sin eliminar las demás.
 const dropdown=document.getElementById('tag');
 if(dropdown){
  for(const tag of r.tags){
   if([...dropdown.options].some(o=>o.value===tag))continue;
   const option=document.createElement('option');
   option.value=tag;option.textContent=tag;dropdown.append(option);
  }
  const all=[...dropdown.options].slice(1).sort((a,b)=>a.textContent.localeCompare(b.textContent,'es'));
  all.forEach(o=>dropdown.append(o));
 }

 // Afinidad de los resultados: los instrumentos etiquetados expresamente
 // aparecen antes que las coincidencias secundarias mencionadas en un texto.
 if(typeof filtered==='function'){
  const previous=filtered;
  filtered=function(){
   const result=previous();
   const input=document.getElementById('q');
   const selected=document.getElementById('sort');
   if(!input||!selected||selected.value!=='relevance')return result;
   const tokens=fold(input.value).split(' ').filter(Boolean);
   if(!tokens.length)return result;
   const tagScore=rec=>{
    const tagTokens=(Array.isArray(rec.tags)?rec.tags:[])
      .flatMap(tag=>fold(tag).split(' ').filter(Boolean));
    return tokens.reduce((score,t)=>score+(tagTokens.some(x=>x===t||(t.length>=3&&x.startsWith(t)))?50:0),0);
   };
   result[0].sort((a,b)=>tagScore(b)-tagScore(a));
   return result;
  };
 }

 const q=document.getElementById('q');
 if(q)q.placeholder='Buscar por artista, álbum, instrumento, año o etiqueta: bajo, jazz, Málaga…';
 const hint=document.querySelector('.controls .hint');
 if(hint&&!hint.querySelector('.semanticTagsHint')){
  const tip=document.createElement('span');
  tip.className='semanticTagsHint';
  tip.textContent=' También busca por instrumento y etiquetas: prueba «bajo», «bajista», «contrabajo», «Málaga» o «shakuhachi».';
  hint.append(tip);
 }
 const beforeOpen=openDetail;
 openDetail=function(id){
  beforeOpen(id);
  if(id!=='R0249')return;
  const curiosity=document.querySelector('#detail .curiosityBox .curiosityText');
  if(curiosity)curiosity.textContent=r.curiosity;
  const detail=document.getElementById('detail');
  if(!detail||detail.querySelector('.groovelandExtra'))return;
  const box=document.createElement('section');
  box.className='groovelandExtra';
  box.style.cssText='border:1px solid #334a60;background:#0e1a26;border-radius:13px;padding:15px 17px;margin:16px 0;line-height:1.6';
  const esc=s=>typeof escapeHTML==='function'?escapeHTML(String(s??'')):String(s??'');
  box.innerHTML='<h3 style="color:#c8e2ff;margin:0 0 7px">Contexto de Grooveland</h3><p>'+esc(r.recording)+'</p>'+
    '<h4 style="color:#f1d597;margin:10px 0 5px">Mientras lo escuchas</h4><p>Fíjate en las líneas de bajo y contrabajo como eje rítmico de las composiciones, en el diálogo con el vibráfono y los saxos y en la mezcla de lenguajes del jazz y el funk con ritmos flamencos y latinos.</p>'+
    '<div style="font-size:.84rem;color:#bed1e1"><a target="_blank" rel="noopener" href="'+esc(r.official_reference)+'">Biografía del artista ↗</a> · <a target="_blank" rel="noopener" href="'+esc(r.recording_reference)+'">Vídeo de la grabación de 2016 ↗</a></div>';
  const grid=detail.querySelector('dl.detailgrid');
  if(grid)grid.insertAdjacentElement('afterend',box);else detail.append(box);
 };
 try{render();}catch(e){console.warn('No se pudo actualizar la vista de etiquetas',e);}
 document.documentElement.dataset.semanticTags=VERSION;
})();