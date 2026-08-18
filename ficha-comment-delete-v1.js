(()=>{
  'use strict';
  const VERSION='ficha-comment-edit-v2';

  const css=document.createElement('style');
  css.textContent=`
    .commentDeleteRow{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-top:6px}
    .commentDeleteText{flex:1;min-width:0;white-space:pre-wrap}
    .commentDeleteEmpty{color:var(--muted);font-style:italic}
    .commentActionBtns{display:flex;gap:6px;flex:0 0 auto;flex-wrap:wrap;justify-content:flex-end}
    .editCommentBtn,.deleteCommentBtn{border-radius:8px;padding:5px 8px;cursor:pointer;font-size:.74rem;font-weight:800}
    .editCommentBtn{border:1px solid #3f5f83;background:#132033;color:#c8e2ff}
    .editCommentBtn:hover{background:#1a2c44}
    .deleteCommentBtn{border:1px solid #6a3840;background:#241317;color:#ffc3ca}
    .deleteCommentBtn:hover{background:#351920}
    .commentEditBox{flex:1;min-width:0}
    .commentEditArea{width:100%;box-sizing:border-box;min-height:82px;resize:vertical;background:#090e16;color:var(--text);border:1px solid #49617f;border-radius:9px;padding:9px 10px;font:inherit;line-height:1.45}
    .commentEditActions{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap}
    .commentSaveMsg{font-size:.76rem;color:#8ce1b4;align-self:center}
    @media(max-width:620px){.commentDeleteRow{flex-direction:column}.commentActionBtns{justify-content:flex-start}.commentEditBox{width:100%}}
  `;
  document.head.appendChild(css);

  function persist(){
    localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
    try{personal=JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||personal;}catch(e){}
  }

  function refreshAfterChange(rid){
    openDetail(rid);
    try{renderDiary();}catch(e){}
    try{window.refreshListenedBadgesV1?.();}catch(e){}
  }

  function beginEdit(r,originalIndex,wrap,textBox,buttons){
    const fresh=ensurePersonal(r.id);
    const note=fresh?.notes?.[originalIndex];
    if(!note)return;

    const oldText=String(note.text||'');
    const edit=document.createElement('div');
    edit.className='commentEditBox';
    const area=document.createElement('textarea');
    area.className='commentEditArea';
    area.value=oldText;
    area.setAttribute('aria-label','Editar comentario de escucha');
    const actions=document.createElement('div');
    actions.className='commentEditActions';

    const save=document.createElement('button');
    save.type='button';save.className='smallbtn primarybtn';save.textContent='Guardar cambios';
    const cancel=document.createElement('button');
    cancel.type='button';cancel.className='smallbtn';cancel.textContent='Cancelar';
    const msg=document.createElement('span');msg.className='commentSaveMsg';
    actions.append(save,cancel,msg);edit.append(area,actions);

    textBox.replaceWith(edit);
    buttons.style.display='none';
    area.focus();area.setSelectionRange(area.value.length,area.value.length);

    cancel.onclick=(ev)=>{ev.preventDefault();ev.stopPropagation();edit.replaceWith(textBox);buttons.style.display='flex';};
    save.onclick=(ev)=>{
      ev.preventDefault();ev.stopPropagation();
      try{
        const p=ensurePersonal(r.id);
        if(!Array.isArray(p.notes)||!p.notes[originalIndex])throw new Error('No se encontró la escucha');
        p.notes[originalIndex].text=area.value.trim();
        persist();
        msg.textContent='Guardado ✓';
        setTimeout(()=>refreshAfterChange(r.id),180);
      }catch(e){
        console.error('No se pudo editar el comentario',e);
        msg.textContent='Error al guardar';
        msg.style.color='#ffb7c0';
      }
    };
  }

  function enhanceComments(r){
    const root=document.querySelector(`[data-editor="${r.id}"]`);
    if(!root)return;
    const p=ensurePersonal(r.id);
    const notes=Array.isArray(p.notes)?p.notes:[];
    const rows=[...root.querySelectorAll('.trackrow')].slice(0,notes.length);
    rows.forEach((row,reverseIndex)=>{
      if(row.dataset.commentDeleteReady==='2')return;
      const originalIndex=notes.length-1-reverseIndex;
      const note=notes[originalIndex];
      if(!note)return;
      const divs=row.querySelectorAll(':scope > div');
      const textDiv=divs[0];
      if(!textDiv)return;
      const text=String(note.text||'').trim();
      const wrap=document.createElement('div');
      wrap.className='commentDeleteRow';
      const textBox=document.createElement('div');
      textBox.className='commentDeleteText'+(text?'':' commentDeleteEmpty');
      textBox.textContent=text||'Sin comentario';
      const buttons=document.createElement('div');buttons.className='commentActionBtns';

      const editBtn=document.createElement('button');
      editBtn.type='button';editBtn.className='editCommentBtn';editBtn.textContent='✏️ Editar';
      editBtn.title='Editar el comentario de esta escucha';
      editBtn.onclick=(ev)=>{ev.preventDefault();ev.stopPropagation();beginEdit(r,originalIndex,wrap,textBox,buttons);};
      buttons.appendChild(editBtn);

      if(text){
        const delBtn=document.createElement('button');
        delBtn.type='button';delBtn.className='deleteCommentBtn';delBtn.textContent='🗑️ Borrar comentario';
        delBtn.title='Borra solo el comentario; conserva la escucha, fecha y valoración';
        delBtn.onclick=(ev)=>{
          ev.preventDefault();ev.stopPropagation();
          if(!confirm('¿Borrar este comentario? La escucha, la fecha y la valoración se conservarán.'))return;
          try{
            const fresh=ensurePersonal(r.id);
            if(!Array.isArray(fresh.notes)||!fresh.notes[originalIndex])throw new Error('No se encontró la escucha');
            fresh.notes[originalIndex].text='';
            persist();
            refreshAfterChange(r.id);
          }catch(e){
            console.error('No se pudo borrar el comentario',e);
            alert('No se pudo borrar el comentario: '+(e?.message||e));
          }
        };
        buttons.appendChild(delBtn);
      }

      wrap.append(textBox,buttons);
      textDiv.replaceWith(wrap);
      row.dataset.commentDeleteReady='2';
    });
  }

  const before=openDetail;
  openDetail=function(id){
    before(id);
    const r=data.find(x=>x.id===id);
    if(r)enhanceComments(r);
  };

  const opened=document.querySelector('[data-editor]');
  if(opened){
    const r=data.find(x=>x.id===opened.dataset.editor);
    if(r)enhanceComments(r);
  }

  document.documentElement.dataset.commentDelete=VERSION;
})();
