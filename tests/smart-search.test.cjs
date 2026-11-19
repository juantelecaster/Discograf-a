'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const a=html.indexOf('const data=')+11,b=html.indexOf(';\n',a);
assert(a>10&&b>a,'No se encontraron los datos del catalogo');
const data=JSON.parse(html.slice(a,b));
const disc=data.find(x=>x.id==='R0249');
assert(disc,'Falta Grooveland');
disc.year='2017';disc.genre='Jazz / Funk / Jazz fusion';
disc.tags=['Bajo','Bajista','Contrabajo','Malaga'];
disc.artist_context='Bajista de Malaga';disc.artist_members='Miguel Angel Gil - bajo electrico';
const other=[
{id:'JP',artist:'Osamu Kitajima',title:'Prueba japonesa',year:'1974',genre:'Psychedelic rock / Japanese folk',tags:['Musica japonesa']},
{id:'KANJI',artist:'Shakuhachi Sanbon-kai',title:'現代尺八楽・三本のひびき',year:'1970',genre:'Shakuhachi',tags:['Shakuhachi']},
{id:'NO-BASS',artist:'Prueba editorial',title:'Disco editorial',year:'1982',genre:'Ambient',notes:'Publicado bajo el sello original.'}
];data.push(...other);
const fold=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function el(id,v=''){const x={id,value:v,options:[],append(o){this.options.push(o)},appendChild(o){this.append(o)},classList:{add(){},remove(){}},dataset:{},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},insertAdjacentElement(){}};Object.defineProperty(x,'innerHTML',{get(){return this._html||''},set(v){this._html=v;this.options=[]}});return x}
const els=Object.fromEntries(['q','sort','location','genre','support','status','tag','queryInfo'].map(id=>[id,el(id)]));
els.sort.value='relevance';
const document={getElementById(id){return els[id]||null},querySelector(){return null},createElement(t){return el(t)},head:{appendChild(){}},documentElement:{dataset:{}}};
const patch=fs.readFileSync('smart-search-v2.js','utf8');
const run=new Function('data','fold','document','filtered','render','personalSearchText',patch+';return filtered');
const filtered=run(data,fold,document,()=>[[],[]],()=>{},()=> '');
function search(q,opt={}){els.q.value=q;els.sort.value=opt.sort||'relevance';els.tag.value=opt.tag||'';els.location.value=opt.location||'';return filtered()[0]}
function contains(q,id){return search(q).some(r=>r.id===id)}
for(const q of ['bajo','bajista','bajo electrico','bass','contrabajo','malaga jazz','jazz bajo 2017','discos de jazz bajo'])
 assert(contains(q,'R0249'),'Grooveland no se encuentra por '+q);
assert(!contains('jazz bajo 2016','R0249'));
assert(!contains('bajo','NO-BASS'));
assert(contains('psicodelia japonesa','JP'));
assert(contains('尺八','KANJI'));
assert(contains('flauta japonesa','KANJI'));
assert(search('beatls').some(x=>/Beatles/.test(x.artist)));
assert(search('',{tag:'Bajo'}).some(x=>x.id==='R0249'));
const yearSorted=search('',{sort:'year_desc'}).map(x=>(String(x.year||'').match(/(?:18|19|20)\d{2}/)||[])[0]).filter(Boolean).map(Number);
assert(yearSorted.every((v,i)=>!i||yearSorted[i-1]>=v));
assert(search('1968-1975').every(x=>{const y=Number((String(x.year||'').match(/(?:18|19|20)\d{2}/)||[])[0]);return y>=1968&&y<=1975}));
console.log('OK: sinonimos, etiquetas, AND, japon, años, relevancia y filtros');
