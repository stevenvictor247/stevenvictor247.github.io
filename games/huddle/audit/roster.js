(async(TEAM)=>{await new Promise(r=>setTimeout(r,2000));
const nm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\b(jr|sr|ii|iii|iv|v)\b/g,'').replace(/[^a-z]/g,'');
const H=s=>{const m=String(s||'').match(/(\d)\s*['′’-]\s*(\d{1,2})/);return m?(+m[1]*12+ +m[2]):null};
const RAW=new Set();
const C=s=>{const raw=String(s||'').trim();const t=raw.toLowerCase().replace(/redshirt|\br-|\brs-|\(rs\)/g,' ').replace(/\s+/g,' ').trim();
  let m=t.match(/(freshman|sophomore|junior|senior|graduate|grad|fifth|sixth|([1-6])(?:st|nd|rd|th)|\b(fr|so|jr|sr|gr)\b)/);
  if(!m){if(raw)RAW.add(raw);return null}
  const w=m[1]; if(m[2])return Math.min(5,+m[2]); if(/^(fifth|sixth|grad|gr)/.test(w))return 5;
  return {freshman:1,fr:1,sophomore:2,so:2,junior:3,jr:3,senior:4,sr:4}[w]||null};
let off=[], how='';
const t=document.body.innerText;
let re=/Jersey Number\n(\d+)\n([^\n]+)\nPosition\n([^\n]+)\nAcademic Year\n([^\n]+)\nHeight\n([^\n]+)/g, m;
while(m=re.exec(t)) off.push({j:+m[1],n:m[2].trim(),p:m[3].trim(),c:C(m[4]),h:H(m[5])});
if(off.length) how='card';
if(!off.length){document.querySelectorAll('.sidearm-roster-player').forEach(e=>{const q=s=>{const x=e.querySelector(s);return x?x.innerText.trim():''};
  off.push({j:+q('.sidearm-roster-player-jersey-number')||null,n:q('.sidearm-roster-player-name h3, .sidearm-roster-player-name p, .sidearm-roster-player-name'),p:q('.sidearm-roster-player-position-long-short, .sidearm-roster-player-position'),c:C(q('.sidearm-roster-player-academic-year')),h:H(q('.sidearm-roster-player-height'))})}); if(off.length)how='old'}
if(!off.length){for(const tb of document.querySelectorAll('table')){const hs=[...tb.querySelectorAll('thead th, tr:first-child th')].map(x=>x.innerText.trim().toLowerCase());
  const f=k=>hs.findIndex(h=>k.some(z=>h===z||h.startsWith(z)));
  const iN=f(['name','full name','player']),iJ=f(['#','no','jersey','number']),iH=f(['ht','height']),iC=f(['cl','class','yr','year','academic','elig']),iP=f(['pos','position']);
  if(iN<0||iH<0)continue;
  tb.querySelectorAll('tbody tr').forEach(tr=>{const td=[...tr.children].map(x=>x.innerText.trim());if(td.length<hs.length-1)return;
   off.push({j:iJ>=0?(+td[iJ]||(td[iJ]==='0'?0:null)):null,n:td[iN].split('\n')[0],p:iP>=0?td[iP]:'',c:iC>=0?C(td[iC]):null,h:H(td[iH])})}); if(off.length>40){how='table';break} else off=[]}}
off=off.filter(o=>o.n&&o.n.length>2&&!/team impact/i.test(o.p||''));
if(off.length<40) return TEAM+' FAIL off'+off.length+' '+document.title;
const D=window.__D||(window.__D=await (await fetch('https://stevenvictor247.github.io/games/huddle/data.json')).json());
const ours=D.cfb.p.filter(x=>x[1]===TEAM); const by={}; off.forEach(o=>{by[nm(o.n)]=o; const parts=o.n.split(' '); if(parts.length>1) by['L'+nm(parts.slice(1).join(''))+'|'+o.j]=o});
const upd=[], miss=[]; const used=new Set();
for(const x of ours){let o=by[nm(x[0])]||(x[9]?x[9].split('|').map(a=>by[nm(a)]).find(Boolean):null)||by['L'+nm(x[0].split(' ').slice(1).join(''))+'|'+x[6]];
 if(!o){miss.push(x[7]);continue} used.add(o); const u=[];
 if(o.j!=null&&o.j!==x[6])u.push('j'+o.j); if(o.h&&o.h!==x[4])u.push('h'+o.h); if(o.c&&o.c!==x[5])u.push('c'+o.c); if(o.n!==x[0]&&o.n!==o.n.toUpperCase())u.push('n'+o.n+'^');
 if(u.length)upd.push(x[7]+':'+u.join(''));}
const extra=off.filter(o=>!used.has(o)).map(o=>[o.j,o.n,o.p,o.c,o.h].join('|'));
return TEAM+' '+how+' off'+off.length+' ours'+ours.length+'\nM '+miss.join(',')+'\nU '+upd.join(';')+'\nX '+extra.join(';')+'\nR '+[...RAW].slice(0,8).join('|');})
