(()=>{
  'use strict';
  const VERSION='maletin4-fichas-v1';
  if(!Array.isArray(data))return;
  const esc = s => typeof escapeHTML === 'function'
    ? escapeHTML(String(s??''))
    : String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const EDITS = {
    R0262: {
      recording: 'Esta antología ofrece una perspectiva poco habitual sobre Hozan Yamamoto: más que reunir sus solos célebres de shakuhachi, presenta al músico como compositor para distintas combinaciones de instrumentos japoneses. Las cinco primeras pistas fueron grabadas en 1979; las dos últimas, en 1991. El programa abre con los dos movimientos de «Shion», diálogo entre shakuhachi y koto de diecisiete cuerdas, y pasa a «Taiko», una obra concertante de gran formato donde la percusión, varios shakuhachi y un conjunto de cuerda tradicional amplían la paleta sonora. «Gen no shirabe» vuelve a un formato íntimo de koto y shakuhachi, mientras «Banka» desarrolla una escritura colectiva. Dos solos cierran el recorrido: «Yuzuriha», para shamisen solo a cargo de Honjō Hidetarō, y «Kari», interpretada por Yamamoto al shakuhachi. Es importante distinguir las fechas de grabación (1979 y 1991) de la publicación de esta edición japonesa en 2006.',
      artist_context: 'Hozan Yamamoto (1937–2014) fue intérprete, compositor y docente japonés, ligado a la escuela Tozan de shakuhachi. Se convirtió en una figura decisiva para el desarrollo moderno de esta flauta de bambú: dominó el repertorio tradicional y, al mismo tiempo, exploró su integración en agrupaciones de koto, nuevas composiciones y encuentros con el jazz. Su actividad pedagógica y su extenso catálogo ayudaron a consolidar la presencia del shakuhachi en la vida musical japonesa contemporánea. En 2002 fue designado Tesoro Nacional Viviente de Japón por su maestría interpretativa. Este volumen es especialmente revelador porque, frente a sus colaboraciones jazzísticas más conocidas, pone en primer plano su faceta de creador y su atención a la escritura para cuerdas japonesas y conjuntos.',
      artist_members: 'Hozan Yamamoto — composición y shakuhachi (pistas 1, 2, 4 y 7) · Yasuko Nakashima — koto de 17 cuerdas (1–2) · Masatoki Miyamoto — koto (4) · Hidetarō Honjō — shamisen solo (6) · Seiji Gochō — dirección (3 y 5) · Kisaku Katada — gran tambor (3) · Yoshiyuki Okada — timbales (3) · Seiha Ensemble y otros intérpretes de koto, shamisen, percusión y shakuhachi (3 y 5).',
      curiosity: 'Las ocho entregas de «Hozan Yamamoto’s Music» recuperaron grabaciones de una etapa anterior a su edición en CD. Esta primera entrega permite descubrir un detalle poco evidente: «Yuzuriha» no es una pieza solista de shakuhachi, sino una composición de Yamamoto interpretada al shamisen por Hidetarō Honjō. El valor del disco está tanto en las obras como en mostrar los múltiples papeles de Yamamoto: solista, compositor y autor de repertorio de cámara y conjunto.',
      listeningIntro: 'Escucha cómo cambia el papel del shakuhachi: unas veces dialoga con el koto, otras queda integrado en una masa instrumental y al final recupera el primer plano solista. No todas las pistas incluyen al propio Yamamoto como intérprete.',
      listeningPoints: [
        ['1–2 · Shion', 'Dos movimientos para shakuhachi y koto de 17 cuerdas. Compara el fraseo de aire de la flauta con la resonancia pulsada del instrumento de cuerda.'],
        ['3 · Taiko', 'El contraste entre tambores, timbales, varios shakuhachi y conjunto de instrumentos tradicionales produce un cambio de escala respecto al dúo inicial.'],
        ['4–5 · Gen no shirabe / Banka', 'Del formato camerístico del dúo se pasa de nuevo a una escritura para conjunto. Observa los relevos de timbre y la densidad de la textura.'],
        ['6–7 · Yuzuriha / Kari', 'Un solo de shamisen, interpretado por Honjō, precede al solo final de shakuhachi de Yamamoto: dos maneras muy distintas de articular el discurso musical.']
      ],
      historicalContext: 'Una grabación particularmente útil para comprender la transformación del hōgaku —la música japonesa de tradición instrumental— durante el siglo XX. El koto de diecisiete cuerdas, el shamisen y el shakuhachi participan aquí de una escritura de concierto que mantiene sus timbres característicos sin limitarse a reproducir repertorio antiguo.',
      sources: [
        ['Ficha oficial de la edición', 'https://s.jtcf.jp/item.php?id=VZCG-570'],
        ['Biografía y discografía especializada', 'https://www.shakuhachi.com/R-Shaku-Yamamoto.html']
      ]
    },
    R0263: {
      recording: 'Cuatro obras fundamentales del honkyoku de la escuela Kinko-ryū, interpretadas por Gorō Yamaguchi sin acompañamiento: solamente un shakuhachi y el espacio acústico que lo rodea. El término honkyoku designa un repertorio ligado históricamente a la tradición espiritual de los monjes komusō, cuya interpretación concede una importancia central a la respiración, el silencio, la inflexión de la altura y el color del sonido. La sucesión comienza con «Hifumi Hachigaeshi no Shirabe», continúa con la extensa «Sōkaku Reibo», alcanza su mayor duración en «Mukaiji Reibo» y concluye con «Shika no Tōne», obra asociada a la evocación de llamadas de ciervos. No es un disco de melodías acompañadas ni de virtuosismo rápido: su expresividad nace de variaciones mínimas de ataque, intensidad, afinación y timbre. La edición forma parte de la colección cooperativa «Masters of Japan», dedicada a intérpretes de referencia de la música tradicional japonesa.',
      artist_context: 'Gorō Yamaguchi (1933–1999) fue una autoridad de la escuela Kinko-ryū de shakuhachi y uno de los intérpretes japoneses más influyentes del siglo XX. Dirigió la asociación Chikumeisha y ejerció la docencia en la Universidad de las Artes de Tokio, además de contribuir a la difusión internacional del instrumento: desde 1967 impartió enseñanzas como profesor invitado en la Universidad Wesleyan de Estados Unidos. Su estilo fue especialmente apreciado por la sutileza de los matices de aire, la flexibilidad de la afinación y la manera de convertir cada nota en un gesto expresivo. En 1992 recibió la distinción de Tesoro Nacional Viviente. Mientras otros intérpretes de su generación tendieron puentes hacia lenguajes modernos, Yamaguchi destacó por la profundidad de su lectura del repertorio clásico Kinko.',
      artist_members: 'Gorō Yamaguchi — shakuhachi solo en las cuatro pistas. No intervienen acompañantes: toda la arquitectura musical depende de su respiración, sus cambios de emisión y el fraseo.',
      curiosity: 'La NASA seleccionó una interpretación de Yamaguchi de «Tsuru no Sugomori» («El nido de la grulla») para el disco de oro de las sondas Voyager de 1977. El sello japonés relaciona esa célebre selección con el repertorio de «Sōkaku Reibo» que figura en este CD. Conviene no confundir las ediciones: NASA especifica un fragmento de 4:51, mientras que la segunda pista de este álbum dura 20:50; no se ha verificado que sean la misma toma completa.',
      listeningIntro: 'Escucha con atención los silencios, las respiraciones audibles y la flexión de las notas. El shakuhachi puede producir sonidos aireados, casi sin altura definida, y timbres más centrados y resonantes; esos contrastes forman parte del discurso musical.',
      listeningPoints: [
        ['1 · Hifumi Hachigaeshi no Shirabe', 'Una introducción al lenguaje del honkyoku: observa cómo una sola nota puede evolucionar gracias al aire, el vibrato y el modo de atacar el sonido.'],
        ['2 · Sōkaku Reibo', 'La pieza de la grulla desarrolla frases amplias y contrastes de intensidad. Atiende a la respiración que separa y organiza las ideas musicales.'],
        ['3 · Mukaiji Reibo', 'La obra más extensa del disco invita a seguir una forma de gran aliento sin pulso regular ni armonía de acompañamiento.'],
        ['4 · Shika no Tōne', 'Su título suele traducirse como «Sonido distante de los ciervos». Busca los motivos que recuerdan llamadas y respuestas a distintas distancias.']
      ],
      historicalContext: 'La escuela Kinko-ryū procede de una tradición de piezas solistas que se consolidó en el periodo Edo. Este disco ofrece un contraste muy interesante con el de Hozan Yamamoto del mismo maletín: aquí se preserva el repertorio clásico del shakuhachi sin acompañamiento; en Yamamoto se escucha una escritura más reciente, camerística y concertante.',
      sources: [
        ['Ficha oficial de la edición', 'https://s.jtcf.jp/item.php?id=VZCG-505'],
        ['Biografía especializada', 'https://www.shakuhachi.com/R-Shaku-Yamaguchi.html'],
        ['Selección musical de NASA Voyager', 'https://science.nasa.gov/mission/voyager/golden-record-contents/sounds/']
      ]
    }
  };

  // Renombrar la ubicación en los registros y en el índice de búsqueda, sin
  // modificar los ID ni las valoraciones y escuchas personales guardadas.
  data.forEach(r=>{
    if(r.location==='Estuche 4')r.location='Maletín 4';
    if(EDITS[r.id])Object.assign(r,EDITS[r.id]);
    if(r.location==='Maletín 4'){
      r.search_text=[
        r.id,r.location,r.artist,r.title,r.format,r.type,r.year,r.genre,r.label,
        r.recording,r.edition,r.notes,r.support_kind,r.metadata_status,
        r.artist_context,r.artist_members,...(Array.isArray(r.tags)?r.tags:[])
      ].filter(Boolean).join(' ');
      try{searchIndex.set(r.id,fold(r.search_text));}catch(e){}
    }
  });

  // Mostrar el nombre actualizado en el selector, los botones de maletines y el recuento.
  const select=document.getElementById('location');
  if(select){
    [...select.options].forEach(o=>{if(o.value==='Estuche 4'){o.value='Maletín 4';o.textContent='Maletín 4';}});
    if(select.value==='Estuche 4')select.value='Maletín 4';
    if(![...select.options].some(o=>o.value==='Maletín 4')){
      const o=document.createElement('option');o.value='Maletín 4';o.textContent='Maletín 4';select.append(o);
    }
  }
  const tabs=document.getElementById('tabs');
  if(tabs){
    [...tabs.querySelectorAll('.tab')].forEach(b=>{
      if(b.dataset.loc==='Estuche 4'){b.dataset.loc='Maletín 4';b.textContent='Maletín 4';}
    });
    if(![...tabs.querySelectorAll('.tab')].some(b=>b.dataset.loc==='Maletín 4')){
      const b=document.createElement('button');b.className='tab';b.dataset.loc='Maletín 4';b.textContent='Maletín 4';tabs.append(b);
    }
  }
  const legend=document.querySelector('.legend');
  if(legend){
    legend.innerHTML=legend.innerHTML.replace(/Estuche 4/g,'Maletín 4');
    const n=data.filter(r=>r.location==='Maletín 4').reduce((sum,r)=>sum+(Number(r.supports)||1),0);
    if(/Maletín 4\s*=\s*\d+/.test(legend.textContent||'')){
      legend.innerHTML=legend.innerHTML.replace(/Maletín 4\s*=\s*\d+/,'Maletín 4 = '+n);
    }else{
      legend.insertAdjacentText('beforeend',' · Maletín 4 = '+n);
    }
  }

  // Información editorial nueva, separada de fecha, edición y controles personales.
  const style=document.createElement('style');
  style.textContent=`
    .maletin4Editorial{margin:18px 0 22px;border:1px solid #34495d;background:#101a27;border-radius:13px;padding:17px 19px;line-height:1.65}
    .maletin4Editorial h3{color:#c8e2ff;font-size:1.03rem;margin:0 0 8px}
    .maletin4Editorial p{color:#e2e9f1;margin:0 0 12px}
    .maletin4Editorial .guideEntry{border-top:1px solid #2c3d4d;padding:10px 0}
    .maletin4Editorial .guideEntry strong{color:#f0d694;display:block;margin-bottom:2px}
    .maletin4Editorial .guideEntry span{color:#d3dde8;display:block}
    .maletin4Editorial .guideIntro{color:#cbdcec}
    .maletin4Editorial .editorialSources{border-top:1px solid #2c3d4d;padding-top:10px;margin-top:12px;font-size:.83rem;color:#a5b9cb}
    .maletin4Editorial .editorialSources a{color:#b9dbff;display:inline-block;margin:2px 10px 2px 0}
  `;
  document.head.append(style);

  const priorOpen=openDetail;
  openDetail=function(id){
    priorOpen(id);
    const rec=data.find(x=>x.id===id),info=EDITS[id];if(!rec||!info)return;
    const detail=document.getElementById('detail');if(!detail)return;
    detail.querySelector('.maletin4Editorial')?.remove();
    const dl=detail.querySelector('dl.detailgrid');
    if(!dl)return;
    const section=document.createElement('section');
    section.className='maletin4Editorial';
    const entries=info.listeningPoints.map(([title,note])=>`<div class="guideEntry"><strong>${esc(title)}</strong><span>${esc(note)}</span></div>`).join('');
    const sources=info.sources.map(([title,url])=>`<a target="_blank" rel="noopener" href="${esc(url)}">${esc(title)} ↗</a>`).join('');
    section.innerHTML=`
      <h3>Contexto e importancia de la grabación</h3>
      <p>${esc(info.historicalContext)}</p>
      <h3>Mientras lo escuchas</h3>
      <p class="guideIntro">${esc(info.listeningIntro)}</p>
      ${entries}
      <div class="editorialSources"><strong>Fuentes contrastadas:</strong> ${sources}</div>`;
    dl.insertAdjacentElement('afterend',section);
  };

  try{render();}catch(e){console.warn('maletin 4 editoriales',e);}
  document.documentElement.dataset.maletin4Editorial=VERSION;
})();