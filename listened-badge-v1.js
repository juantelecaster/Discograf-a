(()=>{
  'use strict';
  const VERSION='listened-badge-v3';

  const css=document.createElement('style');
  css.textContent=`
    #grid .album{position:relative}
    .listenedBadgeV1{
      position:absolute;top:10px;left:10px;right:auto;z-index:25;
      display:inline-flex;align-items:center;gap:6px;
      padding:7px 10px;border-radius:999px;
      border:1px solid rgba(178,255,218,.72);
      background:rgba(12,111,79,.97);color:#f4fff9;
      font-size:.75rem;font-weight:950;line-height:1;
      letter-spacing:.025em;text-transform:uppercase;
      box-shadow:0 6px 18px rgba(0,0,0,.4),0 0 0 2px rgba(70,211,153,.14);
      backdrop-filter:blur(6px);pointer-events:none
    }
    .album.hasListensV1{
      border-color:#2e9b73 !important;
      box-shadow:0 0 0 1px rgba(61,207,151,.34),0 10px 26px rgba(0,0,0,.24) !important
    }
    .album.hasListensV1 .cover{
      border-color:#49c896 !important;
      box-shadow:inset 0 0 0 1px rgba(91,226,171,.22)
    }
    .listenedDotV2{
      display:inline-flex;align-items:center;justify-content:center;
      width:17px;height:17px;border-radius:50%;background:#eafff5;color:#08724d;
      font-size:.72rem;font-weight:1000
    }
  `;
  document.head.appendChild(css);

  function personalState(){
    try{return JSON.parse(localStorage.getItem(PERSONAL_KEY)||'{}')||{};}
    catch(e){return typeof personal==='object'&&personal?personal:{};}
  }
  function listenInfo(id,state){
    const notes=state?.[id]?.notes;
    if(!Array.isArray(notes)||!notes.length)return null;
    const valid=notes.filter(n=>n&&typeof n==='object');
    if(!valid.length)return null;
    const latest=valid.map(n=>String(n.date||n.createdAt||'')).filter(Boolean).sort().reverse()[0]||'';
    return {count:valid.length,latest};
  }
  function refreshListenedBadgesV1(){
    const state=personalState();
    document.querySelectorAll('#grid .album[data-id]').forEach(card=>{
      // Versiones anteriores insertaban la etiqueta dentro de .cover. Las carátulas
      // se redibujan de forma asíncrona y podían borrarla. Ahora vive en la tarjeta.
      card.querySelectorAll('.listenedBadgeV1').forEach(x=>x.remove());
      card.classList.remove('hasListensV1');
      const info=listenInfo(card.dataset.id,state);if(!info)return;
      card.classList.add('hasListensV1');
      const badge=document.createElement('span');badge.className='listenedBadgeV1';
      badge.innerHTML=`<span class="listenedDotV2">✓</span><span>Escuchado${info.count>1?' · '+info.count+'×':''}</span>`;
      badge.title=info.count===1?`Escuchado 1 vez${info.latest?' · '+info.latest:''}`:`Escuchado ${info.count} veces${info.latest?' · última: '+info.latest:''}`;
      card.appendChild(badge);
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

  // Cambios hechos en la misma pestaña no disparan el evento storage. Este observer
  // garantiza además que un redibujado posterior de la colección vuelva a aplicar
  // las etiquetas sin depender del orden de carga de otros parches.
  const grid=document.getElementById('grid');
  let timer=0;
  if(grid&&'MutationObserver' in window){
    const observer=new MutationObserver(mutations=>{
      const structural=mutations.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&((n.matches&&n.matches('.album'))||(n.querySelector&&n.querySelector('.album')))));
      if(!structural)return;
      clearTimeout(timer);timer=setTimeout(refreshListenedBadgesV1,20);
    });
    observer.observe(grid,{childList:true,subtree:false});
  }

  window.refreshListenedBadgesV1=refreshListenedBadgesV1;
  refreshListenedBadgesV1();
  document.documentElement.dataset.listenedBadge=VERSION;
})();
