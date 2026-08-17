(()=>{
  const VERSION='4.1';
  const style=document.createElement('style');
  style.textContent=`
    .favActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
    .favEdit{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}
    .favEdit .editorGrid{margin-top:4px}
    .favEditActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .favSource{display:inline-block;margin-left:7px;padding:2px 7px;border:1px solid var(--line);border-radius:999px;font-size:.72rem;color:var(--muted)}
  `;
  document.head.appendChild(style);

  function favState(id){
    const p=ensurePersonal(id);
    if(!Array.isArray(p.hiddenCatalogFavorites))p.hiddenCatalogFavorites=[];
    if(!p.catalogFavoriteEdits||typeof p.catalogFavoriteEdits!=='object')p.catalogFavoriteEdits={};
    return p;
  }
  function favoriteEntry(r,source,index){
    const p=favState(r.id);
    if(source==='personal')return p.favorites[index]||null;
    const base=(r.favorite_tracks||[])[index];
    if(!base)return null;
    return {...base,...(p.catalogFavoriteEdits[String(index)]||{})};
  }
  function hiddenTotal(){
    return data.reduce((n,r)=>n+favState(r.id).hiddenCatalogFavorites.length,0);
  }

  let restoreBtn=document.getElementById('restoreHiddenFavsBtn');
  if(!restoreBtn){
    const feed=document.getElementById('favoritesFeed');
    if(feed){
      const wrap=document.createElement('div');
      wrap.className='chatActions';
      restoreBtn=document.createElement('button');
      restoreBtn.id='restoreHiddenFavsBtn';
      restoreBtn.className='smallbtn';
      restoreBtn.style.display='none';
      wrap.appendChild(restoreBtn);
      feed.parentNode.insertBefore(wrap,feed);
    }
  }

  renderFavorites=function(){
    const box=$('#favoritesFeed');if(!box)return;
    const items=[];
    let hidden=0;
    data.forEach(r=>{
      const p=favState(r.id);
      (r.favorite_tracks||[]).forEach((base,index)=>{
        if(p.hiddenCatalogFavorites.includes(index)){hidden++;return;}
        items.push({r,x:{...base,...(p.catalogFavoriteEdits[String(index)]||{})},source:'catalog',index});
      });
      (p.favorites||[]).forEach((x,index)=>items.push({r,x,source:'personal',index}));
    });
    if(restoreBtn){
      restoreBtn.style.display=hidden?'inline-block':'none';
      restoreBtn.textContent=hidden===1?'↶ Restaurar 1 destacada oculta':`↶ Restaurar ${hidden} destacadas ocultas`;
    }
    box.innerHTML=items.length?items.map(({r,x,source,index})=>`<div class="feedItem favoriteTrack" data-fav-card="${r.id}|${source}|${index}">
      <h4 style="cursor:pointer" data-action="open">${escapeHTML(x.title||('Pista '+(x.track||'?')))}<span class="favSource">${source==='personal'?'Tuya':'Catálogo'}</span></h4>
      <div class="feedMeta">${escapeHTML(x.artist||'Artista pendiente')} · ${escapeHTML(r.artist)} — ${escapeHTML(r.title)} · ${escapeHTML(r.location)}</div>
      ${x.rating?`<div class="feedMeta" style="margin-top:5px">${'★'.repeat(Math.max(0,Math.min(5,+x.rating||0)))}</div>`:''}
      ${x.note?`<div style="margin-top:7px">${escapeHTML(x.note)}</div>`:''}
      <div class="favActions">
        <button class="smallbtn" data-action="edit">✏️ Editar</button>
        <button class="smallbtn ${source==='personal'?'dangerbtn':''}" data-action="delete">${source==='personal'?'🗑️ Borrar':'🙈 Ocultar'}</button>
        <button class="smallbtn" data-action="open">💿 Ver disco</button>
      </div>
    </div>`).join(''):'<div class="feedItem">Todavía no hay canciones destacadas.</div>';

    box.querySelectorAll('[data-fav-card]').forEach(card=>{
      const [rid,source,indexRaw]=card.dataset.favCard.split('|');
      const index=Number(indexRaw);
      card.querySelectorAll('[data-action="open"]').forEach(el=>el.onclick=()=>openDetail(rid));
      const edit=card.querySelector('[data-action="edit"]');
      if(edit)edit.onclick=()=>showFavoriteEditor(card,rid,source,index);
      const del=card.querySelector('[data-action="delete"]');
      if(del)del.onclick=()=>deleteFavorite(rid,source,index);
    });
  };

  function showFavoriteEditor(card,rid,source,index){
    const r=data.find(x=>x.id===rid);if(!r)return;
    const x=favoriteEntry(r,source,index);if(!x)return;
    const prev=card.querySelector('.favEdit');if(prev)prev.remove();
    const div=document.createElement('div');div.className='favEdit';
    div.innerHTML=`<div class="editorGrid">
      <label>Nº pista<input data-field="track" value="${escapeHTML(x.track??'')}"></label>
      <label>Artista<input data-field="artist" value="${escapeHTML(x.artist||'')}"></label>
      <label>Título<input data-field="title" value="${escapeHTML(x.title||'')}"></label>
      <label>Valoración (0–5)<input data-field="rating" type="number" min="0" max="5" value="${escapeHTML(x.rating??'')}"></label>
    </div>
    <label style="display:block;margin-top:9px">Comentario<textarea data-field="note" rows="2">${escapeHTML(x.note||'')}</textarea></label>
    <div class="favEditActions"><button class="smallbtn primarybtn" data-save>Guardar cambios</button><button class="smallbtn" data-cancel>Cancelar</button></div>`;
    card.appendChild(div);
    div.querySelector('[data-cancel]').onclick=()=>div.remove();
    div.querySelector('[data-save]').onclick=()=>{
      const value=name=>div.querySelector(`[data-field="${name}"]`).value.trim();
      const edited={track:value('track'),artist:value('artist'),title:value('title'),note:value('note')};
      const rating=value('rating');if(rating!=='')edited.rating=Math.max(0,Math.min(5,Number(rating)||0));
      const p=favState(rid);
      if(source==='personal')p.favorites[index]=edited;
      else p.catalogFavoriteEdits[String(index)]=edited;
      savePersonal();
    };
  }

  function deleteFavorite(rid,source,index){
    const r=data.find(x=>x.id===rid);if(!r)return;
    const x=favoriteEntry(r,source,index);if(!x)return;
    if(source==='personal'){
      if(!confirm(`¿Borrar de destacadas “${x.title||('Pista '+(x.track||'?'))}”?`))return;
      favState(rid).favorites.splice(index,1);
    }else{
      if(!confirm('Esta destacada forma parte del catálogo base. ¿Quieres ocultarla de tu lista? Podrás restaurarla después.'))return;
      const p=favState(rid);if(!p.hiddenCatalogFavorites.includes(index))p.hiddenCatalogFavorites.push(index);
    }
    savePersonal();
  }

  function restoreHiddenFavorites(){
    if(!hiddenTotal())return;
    if(!confirm('¿Restaurar todas las destacadas del catálogo que has ocultado?'))return;
    Object.keys(personal).forEach(id=>{const p=favState(id);p.hiddenCatalogFavorites=[];});
    savePersonal();
  }
  if(restoreBtn)restoreBtn.onclick=restoreHiddenFavorites;

  const hint=document.querySelector('#favoritesView .hint');
  if(hint)hint.textContent='Puedes editar o borrar tus propias destacadas. Las incluidas en el catálogo se pueden editar u ocultar y restaurar después.';
  document.title=document.title.replace(/\s·\sv\d+(\.\d+)?$/,'')+` · v${VERSION}`;
  renderFavorites();
})();
