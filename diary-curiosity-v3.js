(()=>{
  const VERSION='diary-curiosity-v3';

  const style=document.createElement('style');
  style.textContent=`
    .diaryToolbar{display:grid;grid-template-columns:minmax(220px,2fr) 150px 130px;gap:9px;margin:14px 0 8px}
    .diaryToolbar textarea{grid-column:1/-1;width:100%;box-sizing:border-box;background:#090e16;color:var(--text);border:1px solid #344055;border-radius:10px;padding:10px;min-height:82px;resize:vertical}
    .diaryActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
    .diaryEdit{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
    .diaryEdit textarea{width:100%;box-sizing:border-box;background:#090e16;color:var(--text);border:1px solid #344055;border-radius:10px;padding:10px;min-height:70px}
    .curiosityBox{margin:18px 0 4px;padding:14px 15px;border:1px solid #40506a;background:linear-gradient(180deg,#151d2a,#111722);border-radius:13px}
    .curiosityBox b{color:#ffd777}.curiosityBox .curiosityText{margin-top:6px;line-height:1.55;color:#dfe6f1}
    @media(max-width:720px){.diaryToolbar{grid-template-columns:1fr}.diaryToolbar textarea{grid-column:1}.diaryToolbar select,.diaryToolbar input{width:100%}}
  `;
  document.head.appendChild(style);

  function localDate(){
    const d=new Date(),pad=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  function ensureDiaryComposer(){
    const view=document.getElementById('diaryView');
    const feed=document.getElementById('diaryFeed');
    if(!view||!feed||document.getElementById('diaryComposer'))return;
    const wrap=document.createElement('div');
    wrap.id='diaryComposer';
    wrap.className='editorBox';
    const options=data.slice().sort((a,b)=>`${a.artist} ${a.title}`.localeCompare(`${b.artist} ${b.title}`,'es')).map(r=>`<option value="${escapeHTML(r.id)}">${escapeHTML(r.artist)} — ${escapeHTML(r.title)}</option>`).join('');
    wrap.innerHTML=`<div class="eyebrow">Nueva entrada</div><div class="diaryToolbar">
      <select id="diaryAlbum"><option value="">Selecciona un disco…</option>${options}</select>
      <input id="diaryDate" type="date" value="${localDate()}">
      <select id="diaryRating"><option value="0">Sin valoración</option><option value="1">★</option><option value="2">★★</option><option value="3">★★★</option><option value="4">★★★★</option><option value="5">★★★★★</option></select>
      <textarea id="diaryText" placeholder="¿Qué has escuchado? ¿Qué te ha llamado la atención? ¿Cómo te ha sonado hoy?"></textarea>
    </div><button class="smallbtn primarybtn" id="diarySave">Guardar en el diario</button><span class="saved" id="diarySaved"></span>`;
    feed.parentNode.insertBefore(wrap,feed);
    document.getElementById('diarySave').onclick=()=>{
      const rid=document.getElementById('diaryAlbum').value;
      const text=document.getElementById('diaryText').value.trim();
      if(!rid){document.getElementById('diarySaved').textContent='Selecciona un disco';return;}
      if(!text){document.getElementById('diarySaved').textContent='Escribe un comentario';return;}
      const p=ensurePersonal(rid);
      const rating=Math.max(0,Math.min(5,Number(document.getElementById('diaryRating').value)||0));
      p.notes.push({date:document.getElementById('diaryDate').value||localDate(),text,rating});
      if(rating)p.rating=rating;
      savePersonal();
      document.getElementById('diaryText').value='';
      document.getElementById('diarySaved').textContent='Guardado ✓';
      setTimeout(()=>{const x=document.getElementById('diarySaved');if(x)x.textContent='';},1600);
    };
  }

  function diaryEntries(){
    const items=[];
    data.forEach(r=>{
      const p=ensurePersonal(r.id);
      (p.notes||[]).forEach((n,index)=>items.push({r,n,index}));
    });
    items.sort((a,b)=>(b.n.date||'').localeCompare(a.n.date||'') || b.index-a.index);
    return items;
  }

  renderDiary=function(){
    const box=document.getElementById('diaryFeed');if(!box)return;
    ensureDiaryComposer();
    const items=diaryEntries();
    box.innerHTML=items.length?items.map(({r,n,index})=>`<div class="feedItem" data-diary="${r.id}|${index}">
      <h4 style="cursor:pointer" data-diary-open>${escapeHTML(r.artist)} — ${escapeHTML(r.title)}</h4>
      <div class="feedMeta">${escapeHTML(n.date||'Sin fecha')} ${n.rating?`· ${'★'.repeat(Math.max(0,Math.min(5,+n.rating||0)))}`:''}</div>
      <div style="margin-top:7px;white-space:pre-wrap">${escapeHTML(n.text||'')}</div>
      <div class="diaryActions"><button class="smallbtn" data-diary-edit>✏️ Editar</button><button class="smallbtn dangerbtn" data-diary-delete>🗑️ Borrar</button><button class="smallbtn" data-diary-open>💿 Ver disco</button></div>
    </div>`).join(''):'<div class="feedItem">Todavía no has añadido comentarios de escucha. Puedes crear la primera entrada arriba.</div>';

    box.querySelectorAll('[data-diary]').forEach(card=>{
      const [rid,idxRaw]=card.dataset.diary.split('|');const index=Number(idxRaw);
      card.querySelectorAll('[data-diary-open]').forEach(b=>b.onclick=()=>openDetail(rid));
      card.querySelector('[data-diary-delete]').onclick=()=>{
        const r=data.find(x=>x.id===rid),p=ensurePersonal(rid),n=p.notes[index];if(!n)return;
        if(!confirm(`¿Borrar esta entrada del diario de ${r?r.artist+' — '+r.title:'este disco'}?`))return;
        p.notes.splice(index,1);savePersonal();
      };
      card.querySelector('[data-diary-edit]').onclick=()=>showDiaryEditor(card,rid,index);
    });
  };

  function showDiaryEditor(card,rid,index){
    const p=ensurePersonal(rid),n=p.notes[index];if(!n)return;
    const old=card.querySelector('.diaryEdit');if(old)old.remove();
    const div=document.createElement('div');div.className='diaryEdit';
    div.innerHTML=`<div class="editorGrid"><label>Fecha<input data-dd="date" type="date" value="${escapeHTML(n.date||localDate())}"></label><label>Valoración<select data-dd="rating"><option value="0">Sin valoración</option>${[1,2,3,4,5].map(x=>`<option value="${x}" ${Number(n.rating)===x?'selected':''}>${'★'.repeat(x)}</option>`).join('')}</select></label></div><label style="display:block;margin-top:9px">Comentario<textarea data-dd="text">${escapeHTML(n.text||'')}</textarea></label><div class="diaryActions"><button class="smallbtn primarybtn" data-dd-save>Guardar cambios</button><button class="smallbtn" data-dd-cancel>Cancelar</button></div>`;
    card.appendChild(div);
    div.querySelector('[data-dd-cancel]').onclick=()=>div.remove();
    div.querySelector('[data-dd-save]').onclick=()=>{
      const text=div.querySelector('[data-dd="text"]').value.trim();if(!text)return;
      n.date=div.querySelector('[data-dd="date"]').value||localDate();
      n.rating=Math.max(0,Math.min(5,Number(div.querySelector('[data-dd="rating"]').value)||0));
      n.text=text;savePersonal();
    };
  }

  // En Destacadas, “borrar” elimina la entrada de tu lista. Las del catálogo base se conservan internamente solo para permitir restaurarlas.
  const priorRenderFavorites=renderFavorites;
  renderFavorites=function(){
    priorRenderFavorites();
    const box=document.getElementById('favoritesFeed');if(!box)return;
    box.querySelectorAll('[data-fav-card]').forEach(card=>{
      const parts=card.dataset.favCard.split('|');
      const source=parts[1];
      const btn=card.querySelector('[data-action="delete"]');
      if(btn){btn.textContent='🗑️ Borrar';btn.classList.add('dangerbtn');btn.title=source==='catalog'?'Se quitará de tu lista; puede restaurarse después.':'Eliminar definitivamente de tus destacadas';}
    });
    const hint=document.querySelector('#favoritesView .hint');
    if(hint)hint.textContent='Puedes editar y borrar cualquier destacada de tu lista. Si era una destacada del catálogo base, queda apartada para que puedas restaurarla si te arrepientes.';
  };

  const CURIOSITIES={
    'Eric Clapton|Journeyman':'Fue uno de los discos que consolidaron el regreso comercial de Clapton a finales de los 80; “Bad Love” le dio un Grammy a la mejor interpretación vocal de rock masculina.',
    'AC/DC|Highway to Hell':'Fue el último álbum de AC/DC publicado en vida de Bon Scott y el primero del grupo producido por Robert John “Mutt” Lange.',
    'Pink Floyd|The Dark Side of the Moon':'El álbum permaneció durante años en la lista estadounidense Billboard 200, convirtiéndose en uno de los casos de longevidad comercial más célebres de la historia del rock.',
    'Pink Floyd|Wish You Were Here':'En las sesiones apareció inesperadamente Syd Barrett en Abbey Road; su aspecto había cambiado tanto que varios miembros del grupo tardaron en reconocerlo.',
    'Pink Floyd|The Wall':'La idea inicial de Roger Waters surgió tras sentirse cada vez más separado del público durante la gira de Animals; de ahí la metáfora del “muro” entre artista y audiencia.',
    'Pink Floyd|Animals':'La famosa fotografía de la central eléctrica de Battersea se realizó con un cerdo inflable gigante; durante la sesión el globo llegó a soltarse y provocó problemas en el tráfico aéreo.',
    'Pink Floyd|A Saucerful of Secrets':'Es el único álbum de estudio de Pink Floyd en el que aparecen acreditados los cinco miembros históricos de la transición Barrett–Gilmour.',
    'Led Zeppelin|Physical Graffiti':'Fue el primer lanzamiento de Led Zeppelin en su propio sello, Swan Song, y mezcló nuevas grabaciones con material recuperado de sesiones anteriores.',
    'The Doors|L.A. Woman':'Para lograr un sonido más directo, el grupo abandonó el estudio convencional y grabó gran parte del álbum en su propio local de ensayo de Los Ángeles.',
    'The Doors|Strange Days':'Fue uno de los primeros álbumes de rock en aprovechar de forma destacada el sintetizador Moog, utilizado en “Strange Days”.',
    'The Doors|Waiting for the Sun':'Aunque el álbum se titula Waiting for the Sun, la canción con ese nombre no apareció hasta el siguiente LP del grupo, The Soft Parade.',
    'The Beatles|1967–1970':'La recopilación es conocida popularmente como el “Blue Album” y fue publicada a la vez que 1962–1966, el “Red Album”.',
    'John Lennon|Imagine':'La fotografía de portada fue tomada por Yoko Ono con una Polaroid; su sencillez contrasta con la enorme fama posterior de la imagen.',
    'John Lennon|Plastic Ono Band':'Lennon grabó el álbum tras someterse a terapia primal con Arthur Janov, circunstancia que influyó en el carácter confesional y desnudo de muchas canciones.',
    'Love|Forever Changes':'Aunque hoy se considera un clásico de la psicodelia, en su lanzamiento inicial tuvo un éxito comercial bastante modesto en Estados Unidos.',
    'Muddy Waters|Electric Mud':'Chess intentó acercar a Muddy Waters al público joven del rock psicodélico; Waters acabaría mostrando poco entusiasmo por el resultado.',
    'Daft Punk|Random Access Memories':'Daft Punk redujo deliberadamente el uso de samples y recurrió a numerosos músicos de sesión para recrear la textura de las grabaciones disco y funk de los años 70 y 80.',
    'Guns N’ Roses|Appetite for Destruction':'La portada original fue sustituida tras generar controversia; el diseño de la cruz con las calaveras de los miembros terminó convirtiéndose en la imagen más asociada al álbum.',
    'Beastie Boys|Paul’s Boutique':'Su densísimo uso de samples fue posible en una época anterior a que la industria fijara los procedimientos actuales de autorización y coste para cada fragmento utilizado.',
    'Deep Purple|The Book of Taliesyn':'El título procede del Libro de Taliesin, manuscrito medieval galés que reúne poemas atribuidos al bardo Taliesin.',
    'Joaquín Sabina|Vinagre y rosas':'Varias letras nacieron de la colaboración de Sabina con el poeta Benjamín Prado, con quien compartió un intenso proceso de escritura para el disco.',
    'La Mala Rodríguez|Lujo ibérico':'El título juega con una expresión asociada al jamón ibérico y la transforma en una declaración de identidad y actitud para su debut.',
    'Nach|Ars Magna / Miradas':'El proyecto se publicó como dos discos conceptualmente diferenciados: Ars Magna con una mirada más personal y Miradas centrado en perspectivas y personajes sociales.',
    'Charles Mingus|Changes One':'Changes One y Changes Two proceden de las mismas sesiones de diciembre de 1974 y funcionan como dos partes complementarias de una misma etapa creativa.'
  };

  function curiosityFor(r){
    const key=`${r.artist}|${r.title}`;
    if(CURIOSITIES[key])return CURIOSITIES[key];
    const rec=String(r.recording||'').trim();
    if(rec && !/^Pendiente|^No aplica|^Contenido exacto|^No hay datos/i.test(rec)){
      const first=rec.split(/(?<=[.!?])\s+/)[0];
      if(first.length>25)return `Dato de contexto: ${first}`;
    }
    if(/CD-R|DVD-R|grabado|Copia/i.test(`${r.format||''} ${r.support_kind||''} ${r.edition||''}`))return 'Este ejemplar forma parte de tu archivo grabado personal: la ficha separa deliberadamente el soporte físico de la obra o recopilación que contiene.';
    if(/Caja|multidisco|2 CD|4 CD|5 CD/i.test(`${r.type||''} ${r.format||''} ${r.support_kind||''}`))return `Es una edición multidisco: en el inventario se distingue una sola obra o edición de los ${r.supports||1} soportes físicos que ocupa.`;
    return 'Esta ficha todavía no tiene una anécdota histórica documentada con suficiente seguridad. Se mantiene así para no inventar datos y se podrá completar cuando contrastemos la edición.';
  }

  const priorOpenDetail=openDetail;
  openDetail=function(id){
    priorOpenDetail(id);
    const r=data.find(x=>x.id===id);if(!r)return;
    const detail=document.getElementById('detail');if(!detail)return;
    const editor=detail.querySelector('.editorBox');
    const box=document.createElement('div');box.className='curiosityBox';
    box.innerHTML=`<b>💡 Curiosidad</b><div class="curiosityText">${escapeHTML(curiosityFor(r))}</div>`;
    if(editor)editor.parentNode.insertBefore(box,editor);else detail.appendChild(box);
    const dateField=detail.querySelector('#noteDate');if(dateField&&!dateField.value)dateField.value=localDate();
  };

  ensureDiaryComposer();
  renderDiary();
  renderFavorites();
  document.documentElement.dataset.diaryCuriosityPatch=VERSION;
})();
