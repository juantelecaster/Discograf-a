(()=>{
  'use strict';
  const VERSION='ficha-comment-delete-v1';

  const css=document.createElement('style');
  css.textContent=`
    .commentDeleteRow{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-top:6px}
    .commentDeleteText{flex:1;min-width:0;white-space:pre-wrap}
    .commentDeleteEmpty{color:var(--muted);font-style:italic}
    .deleteCommentBtn{flex:0 0 auto;border:1px solid #6a3840;background:#241317;color:#ffc3ca;border-radius:8px;padding:5px 8px;cursor:pointer;font-size:.74rem;font-weight:800}
    .deleteCommentBtn:hover{background:#351920}
  `;
  document.head.appendChild(css);

  function persist(){
    localStorage.setItem(PERSONAL_KEY,JSON.stringify(personal));
  }

  function enhanceComments(r){
    const root=document.querySelector(`[data-editor="${r.id}"]`);
    if(!root)return;
    const p=ensurePersonal(r.id);
    const notes=Array.isArray(p.notes)?p.notes:[];
    const rows=[...root.querySelectorAll('.trackrow')].slice(0,notes.length);
    rows.forEach((row,reverseIndex)=>{
      if(row.dataset.commentDeleteReady==='1')return;
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
      wrap.appendChild(textBox);
      if(text){
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='deleteCommentBtn';
        btn.textContent='🗑️ Borrar comentario';
        btn.title='Borra solo el comentario; conserva la escucha, fecha y valoración';
        btn.onclick=(ev)=>{
          ev.preventDefault();
          ev.stopPropagation();
          if(!confirm('¿Borrar este comentario? La escucha, la fecha y la valoración se conservarán.'))return;
          try{
            const fresh=ensurePersonal(r.id);
            if(!Array.isArray(fresh.notes)||!fresh.notes[originalIndex])throw new Error('No se encontró la escucha');
            fresh.notes[originalIndex].text='';
            persist();
            openDetail(r.id);
            try{renderDiary();}catch(e){}
            try{window.refreshListenedBadgesV1?.();}catch(e){}
          }catch(e){
            console.error('No se pudo borrar el comentario',e);
            alert('No se pudo borrar el comentario: '+(e?.message||e));
          }
        };
        wrap.appendChild(btn);
      }
      textDiv.replaceWith(wrap);
      row.dataset.commentDeleteReady='1';
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
