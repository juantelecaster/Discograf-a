(()=>{
  'use strict';
  const VERSION='listening-history-delete-v3';
  const view=document.getElementById('assistantView');
  const tab=document.querySelector('.navtab[data-view="assistantView"]');
  if(!view||!tab||!Array.isArray(data))return;

  const css=document.createElement('style');
  css.textContent=`
    .heardActionsV2{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
    .heardDeleteV2{border-color:#6c3940!important;color:#ffc1c9!important;background:#231418!important}
    @media(max-width:720px){.heardActionsV2{justify-content:flex-start}}
  `;
  document.head.appendChild(css);

  const dateKey=n=>String(n?.date||n?.createdAt||'');
  function currentEntries(){
    const out=[];
    data.forEach(r=>{
      const p=typeof ensurePersonal==='function'?ensurePersonal(r.id):(personal?.[r.id]||{});
      (Array.isArray(p?.notes)?p.notes:[]).forEach((n,index)=>out.push({r,n,index}));
    });
    out.sort((a,b)=>dateKey(a.n).localeCompare(dateKey(b.n)) || a.index-b.index);
    return out;
  }
  function persist(){localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));}
  function refreshEverything(){
    try{renderDiary();}catch(e){console.warn('renderDiary',e);}
    try{render();}catch(e){console.warn('render',e);}
    try{window.refreshListenedBadgesV1?.();}catch(e){console.warn('badges',e);}
    if(typeof window.renderListeningHistory==='function')setTimeout(()=>window.renderListeningHistory(),0);
    else setTimeout(()=>tab.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})),0);
  }
  function removeListen(entry){
    const title=entry?.r?.title||'este disco';
    const date=entry?.n?.date||'';
    if(!confirm(`¿Borrar esta escucha de ${title}${date?' ('+date+')':''}?\n\nSe eliminarán la fecha, valoración y comentario asociados a esta escucha.`))return;
    try{
      const p=typeof ensurePersonal==='function'?ensurePersonal(entry.r.id):personal?.[entry.r.id];
      if(!p||!Array.isArray(p.notes))throw new Error('No se encontró la escucha');
      let idx=entry.index;
      if(entry.n?.id){const byId=p.notes.findIndex(n=>n?.id===entry.n.id);if(byId>=0)idx=byId;}
      else if(entry.n?.createdAt){const byCreated=p.notes.findIndex(n=>n?.createdAt===entry.n.createdAt);if(byCreated>=0)idx=byCreated;}
      if(idx<0||idx>=p.notes.length)throw new Error('No se pudo localizar la entrada exacta');
      p.notes.splice(idx,1);persist();refreshEverything();
    }catch(e){
      console.error('No se pudo borrar la escucha',e);
      alert('No se pudo borrar la escucha: '+(e?.message||e));
    }
  }
  function enhanceRows(){
    if(!view.classList.contains('active'))return;
    const rows=[...view.querySelectorAll('.heardRow')];
    if(!rows.length)return;
    const evts=currentEntries();
    rows.forEach((row,i)=>{
      const entry=evts[i];if(!entry)return;
      let actions=row.querySelector('.heardActionsV2');
      if(!actions){
        actions=document.createElement('div');actions.className='heardActionsV2';
        const open=row.querySelector('button[data-open-heard]');
        if(open){open.replaceWith(actions);actions.appendChild(open);}else row.appendChild(actions);
      }
      if(actions.querySelector('.heardDeleteV2'))return;
      const del=document.createElement('button');
      del.type='button';del.className='smallbtn heardDeleteV2';del.textContent='🗑️ Borrar escucha';del.title='Eliminar esta escucha completa del historial';
      del.onclick=ev=>{ev.preventDefault();ev.stopPropagation();removeListen(entry);};
      actions.appendChild(del);
    });
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhanceRows));
  observer.observe(view,{childList:true,subtree:true});
  tab.addEventListener('click',()=>setTimeout(enhanceRows,40));
  setTimeout(enhanceRows,0);
  document.documentElement.dataset.listeningHistoryDelete=VERSION;
})();
