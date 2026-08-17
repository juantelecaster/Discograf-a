(()=>{
  'use strict';
  if(!Array.isArray(window.data||data))return;

  const fixes={
    R0050:{
      year:'1975',
      genre:'Hard rock / Blues rock / Psychedelic rock',
      label:'Fantasy',
      recording:'Álbum de la etapa final de Frijid Pink, publicado en 1975. El material fue grabado en Fantasy Studios, Berkeley, con una formación distinta a la de sus primeros discos.',
      metadata_status:'Verificado a nivel de obra/lanzamiento',
      confidence:'Alta',
      cover_url:'https://coverartarchive.org/release/3888e2d8-9177-47c0-8fe9-9499cfdf7e68/front-500'
    },
    R0099:{
      year:'1976',
      genre:'Clásica / Flauta',
      label:'RCA Red Seal',
      recording:'Primeros años de la carrera solista internacional de James Galway. Grabación con la National Philharmonic Orchestra dirigida por Charles Gerhardt.',
      metadata_status:'Verificado a nivel de obra/lanzamiento',
      confidence:'Alta'
    },
    R0253:{
      year:'2014',
      genre:'Folk / Infantil / Tradición oral',
      label:'Warner Music',
      recording:'Edición moderna de la colección infantil de Joaquín Díaz, basada en repertorio tradicional español de canciones y cuentos. La edición titulada 100 Canciones y Cuentos Infantiles fue publicada por Warner Music en 2014.',
      metadata_status:'Verificado a nivel de obra/lanzamiento',
      confidence:'Alta'
    },
    R0048:{
      genre:'Rock / Hard rock / Rock psicodélico',
      metadata_status:'Artista identificado · álbum pendiente de identificar',
      notes:'Golden Earring está identificado con seguridad, pero en el soporte fotografiado no consta un título de álbum legible. No se asigna un año ni una portada concreta hasta identificar el álbum mediante una foto más cercana, una pista o un listado de canciones.',
      confidence:'Media'
    }
  };

  Object.entries(fixes).forEach(([id,patch])=>{
    const r=data.find(x=>x.id===id);if(!r)return;
    Object.assign(r,patch);
    if(typeof r.search_text==='string'){
      r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status].filter(Boolean).join(' ');
    }
  });

  // Explicación más clara en la ficha concreta de Golden Earring.
  const beforeOpen=openDetail;
  openDetail=function(id){
    beforeOpen(id);
    if(id==='R0048'){
      const detail=document.getElementById('detail');
      if(detail&&!detail.querySelector('.idPendingNotice')){
        const box=document.createElement('div');
        box.className='idPendingNotice';
        box.style.cssText='margin:16px 0;padding:14px 15px;border:1px solid #725d2f;background:#211c12;border-radius:12px;line-height:1.5;color:#eadfbd';
        box.innerHTML='<b style="color:#ffd37a">🔎 Identificación del álbum pendiente</b><div style="margin-top:6px">El artista sí está identificado. Para poner <b>año y portada exactos</b> falta saber qué álbum de Golden Earring contiene este CD-R. Con una foto cercana del disco/caratula o con el título de una sola pista se puede completar sin inventar datos.</div>';
        const grid=detail.querySelector('.detailgrid');
        if(grid)grid.insertAdjacentElement('afterend',box);else detail.appendChild(box);
      }
    }
  };

  try{render();}catch(e){console.warn('catalog enrichment render',e);}
  document.documentElement.dataset.catalogEnrichment='v1';
})();
