(()=>{
  'use strict';
  const VERSION='ficha-listening-v5';

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
  function persistV5(){
    localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
  }
  function setMsg(root,text,error=false){
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

    // Guardar una escucha desde la propia ficha. El comentario es opcional:
    // una fecha sola también constituye una entrada válida del diario.
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
          p.notes.push({date:when,text,rating:Number(p.rating)||0,createdAt:new Date().toISOString()});
          persistV5();
          const ta=root.querySelector('#noteText');if(ta)ta.value='';
          setMsg(root,'Escucha guardada ✓');
          try{renderDiary();}catch(e){console.warn('renderDiary',e);}
          try{renderFavorites();}catch(e){console.warn('renderFavorites',e);}
        }catch(e){
          console.error('No se pudo guardar la escucha desde la ficha',e);
          setMsg(root,'No se pudo guardar: '+(e?.message||e),true);
        }
      };
    }

    // También hacemos robusta la valoración de estrellas para que no dependa
    // de savePersonal(), que vuelve a renderizar otras vistas.
    root.querySelectorAll('.star[data-rate]').forEach(star=>{
      star.onclick=(ev)=>{
        ev.preventDefault();
        try{
          const p=ensurePersonal(r.id);
          p.rating=Number(star.dataset.rate)||0;
          persistV5();
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

  // Si una ficha ya estaba abierta al cargar este parche, la re-enlazamos.
  const opened=document.querySelector('[data-editor]');
  if(opened){const r=data.find(x=>x.id===opened.dataset.editor);if(r)bindFichaListeningV5(r);}

  document.documentElement.dataset.fichaListening=VERSION;
})();
