(()=>{
  'use strict';
  const VERSION='ficha-listening-v6';

  const css=document.createElement('style');
  css.textContent=`
    .fichaSaveMsgV5{display:inline-block;margin-left:9px;font-size:.85rem;color:#88e6b2;vertical-align:middle}
    .fichaSaveMsgV5.error{color:#ffb7c0}
  `;
  document.head.appendChild(css);

  function localDateV5(){
    const d=new Date(),p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }
  function persistAndVerify(rid,entry){
    localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
    const stored=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};
    const notes=stored?.[rid]?.notes;
    if(!Array.isArray(notes))throw new Error('No se ha creado la lista de escuchas');
    const ok=notes.some(n=>n&&(
      (entry.id&&n.id===entry.id) ||
      (n.createdAt===entry.createdAt && String(n.text||'')===String(entry.text||''))
    ));
    if(!ok)throw new Error('El navegador no confirmó el guardado del comentario');
    // Sincronizamos el estado en memoria con lo que realmente quedó persistido.
    personal=stored;
  }
  function setMsg(root,text,error=false){
    if(!root)return;
    let msg=root.querySelector('.fichaSaveMsgV5');
    if(!msg){
      msg=document.createElement('span');
      msg.className='fichaSaveMsgV5';
      const btn=root.querySelector('#saveNoteBtn');
      if(btn)btn.insertAdjacentElement('afterend',msg);
    }
    if(msg){msg.textContent=text;msg.classList.toggle('error',error);}
  }

  function bindFichaListeningV5(r){
    const root=document.querySelector(`[data-editor="${r.id}"]`);
    if(!root)return;

    const date=root.querySelector('#noteDate');
    if(date&&!date.value)date.value=localDateV5();

    const btn=root.querySelector('#saveNoteBtn');
    if(btn){
      btn.type='button';
      btn.onclick=(ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        const text=(root.querySelector('#noteText')?.value||'').trim();
        const when=root.querySelector('#noteDate')?.value||localDateV5();
        try{
          const p=ensurePersonal(r.id);
          if(!Array.isArray(p.notes))p.notes=[];
          const createdAt=new Date().toISOString();
          const entry={
            id:`listen-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            date:when,
            text,
            rating:Number(p.rating)||0,
            createdAt
          };
          p.notes.push(entry);
          persistAndVerify(r.id,entry);

          // Volvemos a dibujar la ficha para que el comentario aparezca inmediatamente
          // en el historial de escuchas del propio disco. Así el guardado es visible,
          // no solo un cambio silencioso en localStorage.
          openDetail(r.id);
          const fresh=document.querySelector(`[data-editor="${r.id}"]`);
          setMsg(fresh,text?'Comentario guardado ✓':'Escucha guardada ✓');
          try{renderDiary();}catch(e){console.warn('renderDiary',e);}
          try{renderFavorites();}catch(e){console.warn('renderFavorites',e);}
        }catch(e){
          console.error('No se pudo guardar la escucha desde la ficha',e);
          setMsg(root,'No se pudo guardar: '+(e?.message||e),true);
        }
      };
    }

    root.querySelectorAll('.star[data-rate]').forEach(star=>{
      star.onclick=(ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        try{
          const p=ensurePersonal(r.id);
          p.rating=Number(star.dataset.rate)||0;
          localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
          const stored=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};
          if(Number(stored?.[r.id]?.rating)!==Number(p.rating))throw new Error('No se confirmó el guardado');
          personal=stored;
          root.querySelectorAll('.star[data-rate]').forEach(s=>s.classList.toggle('on',Number(s.dataset.rate)<=p.rating));
          setMsg(root,'Valoración guardada ✓');
        }catch(e){
          console.error(e);setMsg(root,'No se pudo guardar la valoración',true);
        }
      };
    });
  }

  const openBeforeV5=openDetail;
  openDetail=function(id){
    openBeforeV5(id);
    const r=data.find(x=>x.id===id);
    if(r)bindFichaListeningV5(r);
  };

  const opened=document.querySelector('[data-editor]');
  if(opened){const r=data.find(x=>x.id===opened.dataset.editor);if(r)bindFichaListeningV5(r);}

  document.documentElement.dataset.fichaListening=VERSION;
})();
