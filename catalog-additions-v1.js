(()=>{
  'use strict';
  const VERSION='catalog-additions-v1';
  if(!Array.isArray(data))return;

  const additions=[
    {
      id:'R0256',location:'Maletín 2',artist:'AAA Battery',title:'Corrosion Of Buddha',
      format:'CD / CD-R',supports:1,type:'Álbum',year:'2017',
      genre:'Alternative rock / Art rock',label:'Rescord / edición por verificar',
      recording:'Segundo álbum de AAA Battery, publicado el 17 de noviembre de 2017. La edición oficial reúne diez canciones y el propio grupo lo sitúa dentro de su vertiente alternative / alternative rock.',
      edition:'Incorporado a partir de la portada aportada. El álbum está identificado con seguridad; queda por verificar si tu soporte es el CD comercial, un CD-R u otra edición física concreta.',
      notes:'AAA Battery es un proyecto de San Francisco. La ficha del álbum se completa a nivel de obra; catálogo, matriz y SID del ejemplar físico requieren foto del disco o contraportada.',
      confidence:'Alta',metadata_status:'Verificado a nivel de obra/lanzamiento',support_kind:'Soporte físico por verificar',
      cover_url:'https://f4.bcbits.com/img/a2597660036_10.jpg',
      official_reference:'https://aaabattery.bandcamp.com/album/corrosion-of-buddha',
      discogs_search:'https://www.discogs.com/search/?q=AAA+Battery+Corrosion+Of+Buddha&type=release',
      musicbrainz_search:'https://musicbrainz.org/search?query=AAA+Battery+Corrosion+Of+Buddha&type=release_group&method=indexed',
      reference_tracklist:[
        {track:1,title:'Runaway With The Gold',duration:'4:26'},{track:2,title:'Taxi Heart',duration:'3:54'},
        {track:3,title:'Corrosion Of Buddha',duration:'4:14'},{track:4,title:'Victim Of My Life',duration:'3:32'},
        {track:5,title:'Invisible',duration:'5:12'},{track:6,title:'Techno And The Man',duration:'3:55'},
        {track:7,title:'Sunshine Flies',duration:'2:15'},{track:8,title:'August Blade',duration:'3:22'},
        {track:9,title:'Landfills, A Meditation',duration:'5:49'},{track:10,title:'Medicine Box',duration:'4:04'}
      ]
    },
    {
      id:'R0257',location:'Maletín 2',artist:'Overworld Dreams',title:'Under The Covers I',
      format:'CD / CD-R',supports:1,type:'Álbum de versiones',year:'2020',
      genre:'Progressive rock / Art rock',label:'OD Music / edición por verificar',
      recording:'Primera entrega de la serie Under The Covers de Overworld Dreams, publicada en 2020. Son versiones que el grupo había grabado originalmente con la idea de utilizarlas como material extra para ediciones ampliadas de Voyage y Gateway.',
      edition:'Incorporado a partir de la portada aportada. El álbum está identificado con seguridad; queda por verificar la edición física concreta de tu soporte.',
      notes:'Grupo de rock progresivo de Nueva Jersey. La discografía oficial acredita como invitado a Dylan Mays, con solo de guitarra en “In The Dead Of Night”.',
      confidence:'Alta',metadata_status:'Verificado a nivel de obra/lanzamiento',support_kind:'Soporte físico por verificar',
      cover_url:'https://img1.wsimg.com/isteam/ip/1a764625-82cd-4f6f-aeae-41323d4db5e5/8B6FADC1-BE09-46D1-81BE-77B3D26BD102.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:388,h:388,cg:true',
      official_reference:'https://overworlddreams.com/discography',
      discogs_search:'https://www.discogs.com/search/?q=Overworld+Dreams+Under+The+Covers+I&type=release',
      musicbrainz_search:'https://musicbrainz.org/search?query=Overworld+Dreams+Under+The+Covers+I&type=release_group&method=indexed',
      reference_tracklist:[
        {track:1,title:'In The Dead Of Night',duration:'5:13'},{track:2,title:'Children Of The Sun',duration:'5:54'},
        {track:3,title:'Caravan',duration:'6:36'},{track:4,title:'Man Of Our Times',duration:'5:28'},
        {track:5,title:'Snowblind',duration:'4:35'},{track:6,title:'Burden',duration:'6:24'},
        {track:7,title:'Feeling That Way',duration:'3:31'},{track:8,title:'Blackest Eyes',duration:'4:24'},
        {track:9,title:'Just A Job To Do',duration:'4:36'},{track:10,title:'Subdivisions',duration:'5:33'}
      ]
    }
  ];

  additions.forEach(r=>{
    r.search_text=[r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,r.recording,r.edition,r.notes,r.support_kind,r.metadata_status].filter(Boolean).join(' ');
    if(!data.some(x=>x.id===r.id))data.push(r);
    try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}
    try{
      if(typeof coverKey==='function'&&typeof coverCache==='object'){
        coverCache[coverKey(r)]=r.cover_url;
      }
    }catch(e){}
  });
  try{if(typeof saveCoverCache==='function')saveCoverCache();}catch(e){}

  // Actualiza el recuento físico tras incorporar dos soportes al Maletín 2.
  const supports=document.getElementById('statSupports');
  const records=document.getElementById('statRecords');
  const known=document.getElementById('statKnown');
  const pending=document.getElementById('statPending');
  if(supports)supports.textContent=data.reduce((a,r)=>a+(+r.supports||1),0);
  if(records)records.textContent=data.length;
  if(known)known.textContent=data.filter(r=>r.confidence==='Alta').length;
  if(pending)pending.textContent=data.filter(r=>r.confidence!=='Alta'||String(r.metadata_status||'').includes('Pendiente')).length;
  const legend=document.querySelector('.legend');
  if(legend)legend.innerHTML=legend.innerHTML.replace('Maletín 2 = 92','Maletín 2 = 94');

  // Añade nuevos valores a filtros sin reconstruir ni duplicar el resto del selector.
  function addOption(id,value){const el=document.getElementById(id);if(!el||!value)return;if([...el.options].some(o=>o.value===value))return;const o=document.createElement('option');o.value=value;o.textContent=value;el.appendChild(o);}
  additions.forEach(r=>{addOption('genre',r.genre);addOption('support',r.support_kind);addOption('status',r.metadata_status);});

  try{render();}catch(e){console.warn('No se pudo redibujar tras añadir discos',e);}
  document.documentElement.dataset.catalogAdditions=VERSION;
})();
