(()=>{
  'use strict';
  if(!Array.isArray(data)||typeof fold!=='function'||typeof render!=='function')return;
  const VERSION='smart-search-v2';
  const norm=v=>String(v??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘]/g,"'").toLowerCase().replace(/[^a-z0-9ñ]+/g,' ').replace(/\s+/g,' ').trim();
  const yearOf=v=>{const m=String(v??'').match(/(?:18|19|20)\d{2}/);return m?Number(m[0]):null;};
  const hasPhrase=(text,phrase)=>!!phrase&&(' '+text+' ').includes(' '+phrase+' ');
  const unique=list=>[...new Set(list.filter(Boolean))];
  const lexGroups=[
    ['bajo',['bajo','bajista','bajo electrico','bass','bass guitar','electric bass','bass player','bassista']],
    ['contrabajo',['contrabajo','contrabajista','double bass','upright bass','acoustic bass']],
    ['saxo',['saxo','saxofon','saxophone','saxofonista','saxophonist','sax']],
    ['hammond',['hammond','organo hammond','hammond organ']],
    ['organo',['organo','organ','organista','organist']],
    ['bateria',['bateria','baterista','drums','drummer','drum kit']],
    ['guitarra',['guitarra','guitar','guitarrista','guitarist']],
    ['flauta',['flauta','flute','flautista','flutist']],
    ['violin',['violin','violinista','violinist','fiddle']],
    ['piano',['piano','pianista','pianist']],
    ['sintetizador',['sintetizador','synthesizer','synth','sintetizadores']],
    ['percusion',['percusion','percussion','percussionist','percusionista']],
    ['psicodelia',['psicodelia','psicodelico','psicodelica','psychedelic','psychedelia','psychedelic rock','rock psicodelico','rock psicodelica','heavy psych','acid rock']],
    ['progresivo',['progresivo','progresiva','rock progresivo','progressive rock','prog rock','prog']],
    ['jazzfusion',['jazz fusion','jazz fusion','fusion jazz','jazz fusión','jazz rock','jazzrock']],
    ['krautrock',['krautrock','kosmische']],
    ['hardrock',['hard rock','hardrock']],
    ['japon',['japon','japones','japonesa','japanese','japan','nipon','nipona']],
    ['malaga',['malaga','malagueno','malaguena','malagueno','malaguena']],
    ['flamenco',['flamenco','flamenca']],
    ['funk',['funk','funky']],
    ['hiphop',['hip hop','hiphop','rap']],
    ['clasica',['musica clasica','classical music','clasica','classical']]
  ];
  const dictionary=new Map();
  for(const [group,variants] of lexGroups){
    const names=unique(variants.map(norm));
    for(const v of names)dictionary.set(v,{group,aliases:names});
  }
  const maxAliasWords=Math.max(...[...dictionary.keys()].map(k=>k.split(' ').length));
  const familyFields=new Set(['artist','title','tags','instruments','genre','members']);
  const fuzzyFields=new Set(['artist','title','tags','genre']);
  const cache=new WeakMap();
  const SOURCE_WEIGHTS={
    artist:230,title:240,tags:165,instruments:160,genre:115,
    members:75,year:105,label:70,location:52,type:43,
    context:38,recording:28,tracks:20,notes:18,edition:14,personal:14
  };
  const explicitTags=r=>Array.isArray(r.tags)?r.tags.filter(x=>typeof x==='string'&&x.trim()):[];
  function derivedTags(r){
    const tags=[];
    const g=norm(r.genre),context=norm(r.artist_context);
    const yr=yearOf(r.year);
    if(/psychedel|psicodel|acid rock|heavy psych/.test(g))tags.push('Rock psicodélico');
    if(/progressive rock|rock progresivo|prog rock|progressive metal/.test(g))tags.push('Rock progresivo');
    if(/\bkrautrock\b/.test(g))tags.push('Krautrock');
    if(/\bjazz\b/.test(g))tags.push('Jazz');
    if(/\bblues\b/.test(g))tags.push('Blues');
    if(/\bfunk\b/.test(g))tags.push('Funk');
    if(/\bflamenc/.test(g))tags.push('Flamenco');
    if(/\bshakuhachi\b/.test(g+' '+norm(r.title)))tags.push('Shakuhachi');
    if(/\b(japones|japonesa|japanese|japan|hogaku)\b/.test(g))tags.push('Música japonesa');
    if(/\b(classical|clasica|barroco)\b/.test(g))tags.push('Música clásica');
    if(/\b(hard rock)\b/.test(g))tags.push('Hard rock');
    if(/\b(soul)\b/.test(g))tags.push('Soul');
    if(/\b(hip hop|hiphop|rap)\b/.test(g))tags.push('Hip hop');
    if(/\bmalaga\b|\bmalagueno\b|\bmalaguena\b/.test(context))tags.push('Málaga');
    if(yr&&yr>=1900&&yr<=2099)tags.push('Años '+String(Math.floor(yr/10)*10));
    return unique([...explicitTags(r),...tags]);
  }
  function sources(r){
    const parts=[];
    const add=(kind,value)=>{
      const values=Array.isArray(value)?value:[value];
      for(const v of values){const text=norm(v);if(text)parts.push({kind,text,weight:SOURCE_WEIGHTS[kind]||10});}
    };
    add('artist',r.artist);add('title',r.title);
    add('tags',derivedTags(r));add('instruments',r.instrument_keywords);
    add('genre',r.genre);add('members',r.artist_members);
    add('year',r.year);add('label',r.label);
    add('location',r.location);add('type',r.type);
    add('context',r.artist_context);add('recording',r.recording);
    add('tracks',[...(r.reference_tracklist||[]).map(x=>x.title||''),...(r.favorite_tracks||[]).map(x=>x.title||'')]);
    add('notes',r.notes);add('edition',r.edition);
    if(typeof personalSearchText==='function'){try{add('personal',personalSearchText(r.id));}catch(e){}}
    return parts;
  }
  function getDoc(r){
    const from=cache.get(r);
    const p=typeof personal==='object'&&personal?personal[r.id]:null;
    const stamp=p?JSON.stringify([p.rating,p.notes?.length,p.favorites?.length,p.customTags]):'';
    if(from&&from.stamp===stamp)return from;
    const extraTags=Array.isArray(p?.customTags)?p.customTags:[];
    const result={fields:sources(r),tags:unique([...derivedTags(r),...extraTags]),stamp};
    extraTags.forEach(t=>{const text=norm(t);if(text)result.fields.push({kind:'tags',text,weight:165});});
    cache.set(r,result);return result;
  }
  function makeTerms(query){
    let raw=String(query||'').trim();
    const quoted=[];
    raw=raw.replace(/["“]([^"”]{1,90})["”]/g,(all,c)=>{const i=quoted.push(norm(c))-1;return ' quotephrase'+i+' ';});
    raw=raw.replace(/\b((?:18|19|20)\d{2})\s*[-–—]\s*((?:18|19|20)\d{2})\b/g,(all,a,b)=>' range'+a+'to'+b+' ');
    raw=raw.replace(/\b(?:a[nñ]os|decada)\s+(?:de\s+)?(?:los\s+)?((?:19|20)?[6-9]0)\b/gi,(all,n)=>' decade'+(n.length===2?'19'+n:n)+' ');
    raw=raw.replace(/\b((?:19|20)\d0)s\b/gi,(all,n)=>' decade'+n+' ');
    raw=raw.replace(/\b([6-9]0)s\b/gi,(all,n)=>' decade19'+n+' ');
    const words=norm(raw).split(' ').filter(Boolean);
    const terms=[];
    for(let i=0;i<words.length;){
      const word=words[i];
      let m;
      if((m=/^range((?:18|19|20)\d{2})to((?:18|19|20)\d{2})$/.exec(word))){
        terms.push({type:'range',min:Math.min(+m[1],+m[2]),max:Math.max(+m[1],+m[2])});i++;continue;
      }
      if((m=/^decade((?:19|20)\d0)$/.exec(word))){
        terms.push({type:'range',min:+m[1],max:+m[1]+9});i++;continue;
      }
      if((m=/^quotephrase(\d+)$/.exec(word))){
        const phrase=quoted[+m[1]];
        if(phrase)terms.push(dictionary.has(phrase)?{type:'alias',...dictionary.get(phrase),original:phrase}:{type:'phrase',value:phrase});
        i++;continue;
      }
      if(/^(?:18|19|20)\d{2}$/.test(word)){terms.push({type:'year',year:+word});i++;continue;}
      let alias,consumed=0;
      for(let n=Math.min(maxAliasWords,words.length-i);n>0;n--){
        const key=words.slice(i,i+n).join(' ');
        if(dictionary.has(key)){alias=dictionary.get(key);consumed=n;break;}
      }
      if(alias){terms.push({type:'alias',...alias,original:words.slice(i,i+consumed).join(' ')});i+=consumed;}
      else{terms.push({type:'text',value:word});i++;}
    }
    return terms;
  }
  function editDistance(a,b,limit){
    if(Math.abs(a.length-b.length)>limit)return limit+1;
    const prev=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++){
      let last=i-1;prev[0]=i;let rowMin=i;
      for(let j=1;j<=b.length;j++){
        const old=prev[j];
        prev[j]=Math.min(prev[j]+1,prev[j-1]+1,last+(a[i-1]===b[j-1]?0:1));
        last=old;rowMin=Math.min(rowMin,prev[j]);
      }
      if(rowMin>limit)return limit+1;
    }
    return prev[b.length];
  }
  function termScore(doc,term,allowFuzzy){
    if(term.type==='year'||term.type==='range'){
      const year=yearOf(doc.record.year);
      if(year==null)return 0;
      return (term.type==='year'&&year===term.year)||(term.type==='range'&&year>=term.min&&year<=term.max)?130:0;
    }
    let best=0;
    const aliases=term.type==='alias'?term.aliases:[term.type==='phrase'?term.value:term.value];
    const isBass=term.type==='alias'&&term.group==='bajo';
    for(const f of doc.fields){
      for(const key of aliases){
        // «Bajo» se interpreta como instrumento, no como la preposición
        // «bajo» en frases de contexto («bajo el sello...»).
        if(isBass&&!familyFields.has(f.kind)&&key==='bajo')continue;
        let quality=0;
        if(f.text===key)quality=1.25;
        else if(hasPhrase(f.text,key))quality=1;
        else if(key.length>=3&&key.indexOf(' ')<0&&f.text.split(' ').some(w=>w.startsWith(key)))quality=.82;
        else if(allowFuzzy&&term.type==='text'&&fuzzyFields.has(f.kind)&&key.length>=5){
          const limit=key.length>=9?2:1;
          if(f.text.split(' ').some(w=>Math.abs(w.length-key.length)<=limit&&editDistance(w,key,limit)<=limit))quality=.48;
        }
        best=Math.max(best,Math.round(f.weight*quality));
      }
    }
    return best;
  }
  function scoreDoc(r,terms,allowFuzzy){
    const doc=getDoc(r);doc.record=r;
    if(!terms.length)return 0;
    let sum=0;
    for(const term of terms){const s=termScore(doc,term,allowFuzzy);if(!s)return -1;sum+=s;}
    if(terms.every(t=>t.type==='text'||t.type==='alias'||t.type==='phrase')){
      const q=norm(terms.map(t=>t.original||t.value).join(' '));
      if(q&&norm(r.title)===q)sum+=260;
      if(q&&norm(r.artist)===q)sum+=250;
    }
    return sum;
  }
  let approximate=false;
  function useFilters(r){
    const value=id=>document.getElementById(id)?.value||'';
    if(value('location')&&r.location!==value('location'))return false;
    if(value('genre')&&r.genre!==value('genre'))return false;
    if(value('support')&&r.support_kind!==value('support'))return false;
    if(value('status')&&r.metadata_status!==value('status'))return false;
    const tag=value('tag');
    if(tag&&!getDoc(r).tags.includes(tag))return false;
    return true;
  }
  function comparator(a,b){
    return String(a.artist||'').localeCompare(String(b.artist||''),'es',{sensitivity:'base'})
      ||String(a.title||'').localeCompare(String(b.title||''),'es',{sensitivity:'base'})
      ||String(a.id||'').localeCompare(String(b.id||''));
  }
  const originalFiltered=filtered;
  filtered=function(){
    const input=document.getElementById('q')?.value||'';
    const tokens=norm(input).split(' ').filter(Boolean);
    const terms=makeTerms(input);
    const base=data.filter(useFilters);
    let scored=base.map(r=>({r,score:scoreDoc(r,terms,false)})).filter(x=>x.score>=0);
    approximate=false;
    if(terms.length&&!scored.length&&terms.some(t=>t.type==='text'&&t.value.length>=5)){
      scored=base.map(r=>({r,score:scoreDoc(r,terms,true)})).filter(x=>x.score>=0);
      approximate=scored.length>0;
    }
    const mode=document.getElementById('sort')?.value||'relevance';
    if(mode==='relevance')scored.sort((a,b)=>terms.length?b.score-a.score||comparator(a.r,b.r):comparator(a.r,b.r));
    else if(mode==='year'||mode==='year_asc'||mode==='year_desc'){
      const descend=mode==='year_desc';
      scored.sort((a,b)=>{
        const ay=yearOf(a.r.year),by=yearOf(b.r.year);
        if(ay===null)return by===null?comparator(a.r,b.r):1;
        if(by===null)return -1;
        return (descend?by-ay:ay-by)||comparator(a.r,b.r);
      });
    }else scored.sort((a,b)=>String(a.r[mode]||'').localeCompare(String(b.r[mode]||''),'es',{numeric:true,sensitivity:'base'})||comparator(a.r,b.r));
    return [scored.map(x=>x.r),tokens];
  };

  // El desplegable utiliza exclusivamente información conocida, sin
  // atribuir un instrumento protagonista a todos los que lo mencionan.
  const tagSelect=document.getElementById('tag');
  if(tagSelect){
    const previous=tagSelect.value;
    const counts=new Map();
    for(const r of data){for(const tag of getDoc(r).tags)counts.set(tag,(counts.get(tag)||0)+1);}
    tagSelect.innerHTML='';
    const head=document.createElement('option');head.value='';head.textContent='Todas las etiquetas';tagSelect.append(head);
    for(const [tag,n] of [...counts].sort((a,b)=>a[0].localeCompare(b[0],'es'))){
      const o=document.createElement('option');o.value=tag;o.textContent=tag+' ('+n+')';tagSelect.append(o);
    }
    if([...tagSelect.options].some(x=>x.value===previous))tagSelect.value=previous;
  }

  const input=document.getElementById('q');
  if(input){
    input.placeholder='Busca artista, disco, instrumento, estilo, lugar, año…';
    const anchor=document.querySelector('.controls .hint');
    if(anchor&&!document.getElementById('smartSearchExamples')){
      const strip=document.createElement('div');strip.id='smartSearchExamples';strip.className='smartSearchExamples';
      const examples=[
        ['🎸 Bajo','bajo'],['🎹 Hammond','hammond'],['🎷 Jazz','jazz'],
        ['🌀 Psicodelia','psicodelia'],['🎋 Shakuhachi','shakuhachi'],
        ['📍 Málaga','malaga'],['📅 Años 70','años 70']
      ];
      for(const [label,query] of examples){
        const b=document.createElement('button');b.type='button';b.className='smallbtn searchChip';b.textContent=label;
        b.title='Buscar '+query;
        b.addEventListener('click',()=>{
          input.value=query;
          if(tagSelect)tagSelect.value='';
          input.dispatchEvent(new Event('input',{bubbles:true}));
          input.focus();
        });
        strip.append(b);
      }
      anchor.insertAdjacentElement('afterend',strip);
    }
    const css=document.createElement('style');
    css.textContent='.smartSearchExamples{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 1px}.smartSearchExamples .searchChip{font-size:.78rem;padding:7px 10px;border:1px solid #344459;background:#121d2a;color:#cce1f5;border-radius:999px;white-space:nowrap;cursor:pointer}.smartSearchExamples .searchChip:hover{border-color:#6ea9da;background:#1a3044}.smartSearchApprox{color:#f0d38e}';
    document.head.appendChild(css);
  }
  if(typeof render==='function'){
    const renderBefore=render;
    render=function(){
      const out=renderBefore();
      const el=document.getElementById('queryInfo');
      if(el&&approximate){
        el.textContent+=' · Coincidencias aproximadas';
        el.classList.add('smartSearchApprox');
      }else el?.classList.remove('smartSearchApprox');
      return out;
    };
  }
  try{render();}catch(e){console.warn('smart search render',e);}
  document.documentElement.dataset.smartSearch=VERSION;
})();