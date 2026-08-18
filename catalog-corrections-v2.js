(()=>{
  'use strict';
  const VERSION='catalog-corrections-v3';
  if(!Array.isArray(data))return;

  const PAULS_COVER='https://shopus.beastieboys.com/cdn/shop/products/05099969330025_1.png?v=1599662683&width=1000';

  function rebuildSearch(r){
    r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status].filter(Boolean).join(' ');
    try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}
  }
  function pinCover(r,url){
    if(!r||!url)return;
    r.cover_url=url;
    let key='';
    try{if(typeof coverKey==='function')key=coverKey(r);}catch(e){}
    try{if(key&&typeof coverCache==='object')coverCache[key]=url;}catch(e){}
    // Limpia/actualiza también cachés antiguas para que una portada errónea guardada
    // anteriormente no vuelva a aparecer después de una recarga.
    if(key){
      [
        'juan_music_inventory_cover_cache_v1',
        'juan_music_inventory_cover_web_v2',
        'juan_music_inventory_cover_web_v4'
      ].forEach(storageKey=>{
        try{
          const obj=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};
          obj[key]=url;
          localStorage.setItem(storageKey,JSON.stringify(obj));
        }catch(e){}
      });
    }
  }

  // Paul's Boutique: portada oficial del álbum, fijada para que el buscador
  // automático no pueda sustituirla por samplers u otras ediciones.
  const pauls=data.find(r=>r.id==='R0016');
  if(pauls){
    pinCover(pauls,PAULS_COVER);
    pauls.notes='Carátula oficial de Paul’s Boutique fijada manualmente. Se evita que el buscador automático la sustituya por samplers u otras ediciones.';
    rebuildSearch(pauls);
  }

  // Incluso si el usuario pulsa «Buscar de nuevo», conservar la portada correcta.
  if(typeof fetchCover==='function'){
    const fetchCoverBeforeCorrections=fetchCover;
    fetchCover=async function(r,force=false){
      if(r&&r.id==='R0016'){
        pinCover(r,PAULS_COVER);
        try{if(typeof saveCoverCache==='function')saveCoverCache();}catch(e){}
        return PAULS_COVER;
      }
      return fetchCoverBeforeCorrections(r,force);
    };
  }

  // R0133 estaba transcrito como “Alive”; la lectura correcta es Alice.
  const alice=data.find(r=>r.id==='R0133');
  if(alice){
    Object.assign(alice,{
      artist:'Alice',
      title:'Alice',
      year:'1970',
      genre:'Progressive rock / Psychedelic rock / Jazz rock',
      label:'BYG Records',
      recording:'Debut homónimo de la banda francesa Alice, publicado originalmente por BYG en 1970. El grupo surgió del ambiente experimental francés de finales de los sesenta y mezcló rock progresivo y psicodélico con jazz, música clásica europea y elementos de folk sudamericano.',
      notes:'Formación del álbum de 1970: Jean-Pierre Auffredo (maderas y cuerdas), Sylvain Duplant (bajo), Alain Weiss (batería), Bruno Besse (guitarra, percusión y vibráfono) y Alain Suzan (voz, guitarras, teclados y bajo).',
      confidence:'Alta',
      metadata_status:'Verificado a nivel de obra/lanzamiento',
      discogs_search:'https://www.discogs.com/search/?q=Alice+Alice+1970+BYG&type=release',
      musicbrainz_search:'https://musicbrainz.org/search?query=Alice+Alice+1970+BYG&type=release_group&method=indexed'
    });
    pinCover(alice,'https://f4.bcbits.com/img/a2624319088_10.jpg');
    rebuildSearch(alice);
  }

  // La imagen aportada para Affinity es una fotografía del grupo, no la portada.
  const affinity=data.find(r=>r.id==='R0110');
  if(affinity){
    affinity.artist_photo_url='https://www.progarchives.com/progressive_rock_discography_band/1100.jpg';
    affinity.artist_context='Affinity fue un grupo británico de jazz-rock y rock progresivo formado a finales de los sesenta. Sus raíces se remontan a un trío de jazz universitario en Sussex; la formación clásica tomó forma en 1968 y combinó la voz de Linda Hoyle con órgano Hammond, guitarra, bajo y batería. Firmaron con Vertigo en 1969 y publicaron su único álbum de estudio homónimo en 1970.';
    affinity.artist_members='Linda Hoyle — voz · Lynton Naiff — teclados / órgano Hammond · Mike Jopp — guitarras · Mo Foster — bajo · Grant Serpell — batería y percusión';
    affinity.notes='Único álbum de estudio de la formación clásica. La fotografía de grupo aportada se muestra en la ficha como imagen del artista, no como carátula.';
    rebuildSearch(affinity);
  }

  try{if(typeof saveCoverCache==='function')saveCoverCache();}catch(e){}

  const css=document.createElement('style');
  css.textContent=`
    .artistPhotoCurated{margin:15px 0;padding:12px;border:1px solid #34465f;background:#0e151f;border-radius:13px;display:grid;grid-template-columns:150px 1fr;gap:14px;align-items:start}
    .artistPhotoCurated img{width:150px;aspect-ratio:1/1;object-fit:cover;border-radius:10px;border:1px solid #3a4658}
    .artistPhotoCurated b{color:#9fd2ff}.artistPhotoCurated p{margin:6px 0;line-height:1.5;color:#dfe6f1}.artistPhotoCurated .members{color:#b9c5d6;font-size:.9rem}
    @media(max-width:560px){.artistPhotoCurated{grid-template-columns:1fr}.artistPhotoCurated img{width:100%;max-width:280px}}
  `;
  document.head.appendChild(css);

  const beforeOpen=openDetail;
  openDetail=function(id){
    beforeOpen(id);
    const r=data.find(x=>x.id===id);if(!r)return;
    const detail=document.getElementById('detail');if(!detail)return;
    detail.querySelector('.artistPhotoCurated')?.remove();
    if(r.artist_photo_url&&r.artist_context){
      const box=document.createElement('div');box.className='artistPhotoCurated';
      box.innerHTML=`<img src="${escapeHTML(r.artist_photo_url)}" alt="Fotografía de ${escapeHTML(r.artist)}"><div><b>📷 El grupo</b><p>${escapeHTML(r.artist_context)}</p>${r.artist_members?`<div class="members"><strong>Formación:</strong> ${escapeHTML(r.artist_members)}</div>`:''}</div>`;
      const hero=detail.querySelector('.detailHero');
      if(hero)hero.insertAdjacentElement('afterend',box);else detail.prepend(box);
    }
  };

  try{render();}catch(e){console.warn('catalog corrections render',e);}
  document.documentElement.dataset.catalogCorrections=VERSION;
})();
