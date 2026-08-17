(()=>{
  'use strict';
  const VERSION='listened-badge-v1';

  const css=document.createElement('style');
  css.textContent=`
    .listenedBadgeV1{
      position:absolute;top:9px;right:9px;z-index:6;
      display:inline-flex;align-items:center;gap:5px;
      padding:5px 8px;border-radius:999px;
      border:1px solid rgba(157,226,195,.48);
      background:rgba(8,18,16,.88);color:#a9efd0;
      font-size:.72rem;font-weight:800;line-height:1;
      box-shadow:0 4px 12px rgba(0,0,0,.28);
      backdrop-filter:blur(5px);pointer-events:none
    }
    .album.hasListensV1 .cover{border-color:#365f54}
  `;
  document.head.appendChild(css);

  function personalState(){
    try{return JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};}
    catch(e){return typeof personal==='object'&&personal?personal:{};}
  }
  function listenInfo(id,state){
    const notes=state?.[id]?.notes;
    if(!Array.isArray(notes)||!notes.length)return null;
    const valid=notes.filter(Boolean);
    if(!valid.length)return null;
    const latest=valid.map(n=>String(n.date||'')).filter(Boolean).sort().reverse()[0]||'';
    return {count:valid.length,latest};
  }
  function refreshListenedBadgesV1(){
    const state=personalState();
    document.querySelectorAll('#grid .album[data-id]').forEach(card=>{
      const cover=card.querySelector('.cover');if(!cover)return;
      cover.querySelector('.listenedBadgeV1')?.remove();
      card.classList.remove('hasListensV1');
      const info=listenInfo(card.dataset.id,state);if(!info)return;
      card.classList.add('hasListensV1');
      const badge=document.createElement('span');badge.className='listenedBadgeV1';
      badge.textContent=`🎧 ${info.count}`;
      badge.title=info.count===1?`Escuchado 1 vez${info.latest?' · '+info.latest:''}`:`Escuchado ${info.count} veces${info.latest?' · última: '+info.latest:''}`;
      cover.appendChild(badge);
    });
  }

  if(typeof render==='function'){
    const beforeRender=render;
    render=function(){const out=beforeRender.apply(this,arguments);requestAnimationFrame(refreshListenedBadgesV1);return out;};
  }
  if(typeof renderDiary==='function'){
    const beforeDiary=renderDiary;
    renderDiary=function(){const out=beforeDiary.apply(this,arguments);requestAnimationFrame(refreshListenedBadgesV1);return out;};
  }

  window.refreshListenedBadgesV1=refreshListenedBadgesV1;
  refreshListenedBadgesV1();
  document.documentElement.dataset.listenedBadge=VERSION;
})();
