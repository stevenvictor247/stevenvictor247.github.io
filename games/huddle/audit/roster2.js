(async(TEAM)=>{await new Promise(r=>setTimeout(r,3000));
const nm=s=>(s||'').replace(/["“”][^"“”]*["“”]/g,' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/g,'').replace(/[^a-z]/g,'');
const H=s=>{const m=String(s||'').match(/(?:^|[^\d])([4-7])\s*(?:['′’]\s*|-)\s*(\d{1,2})(?!\d)/);return m&&+m[2]<12?(+m[1]*12+ +m[2]):null};
const CR=/(freshman|sophomore|junior|senior|graduate|fifth[- ]year|sixth[- ]year|([1-6])(?:st|nd|rd|th)(?:\s*year)?\b|(fr|so|jr|sr|gr)\.|\b(fr|so|jr|sr|gr)\b)/i;
const CM={freshman:1,sophomore:2,junior:3,senior:4,graduate:5,fr:1,so:2,jr:3,sr:4,gr:5};
const C=s=>{const m=s.match(CR);if(!m)return null;const w=m[1].toLowerCase().replace(/\.$/,'');if(/^(fifth|sixth)/.test(w))return 5;if(m[2])return Math.min(5,+m[2]);return CM[m[3]?m[3].toLowerCase():m[4]?m[4].toLowerCase():w]||null};
const L=document.body.innerText.split(/\n|\t/).map(s=>s.trim()).filter(Boolean);
const LN=L.map(nm); const isH=L.map(H);
const nh=isH.filter(Boolean).length;
const D=window.__D||(window.__D=await (await fetch('https://stevenvictor247.github.io/games/huddle/data.json')).json());
const ours=D.cfb.p.filter(x=>x[1]===TEAM);
const upd=[],miss=[];const jn=s=>{const m=s.match(/^#?(\d{1,2})$/);return m?+m[1]:null};
for(const x of ours){const keys=[x[0],...(x[9]?x[9].split('|'):[])].map(nm);let idx=-1;
 for(let i=0;i<L.length&&idx<0;i++){if(keys.includes(LN[i])){for(let k=i+1;k<Math.min(L.length,i+16);k++){if(isH[k]){idx=i;break} if(k>i+1&&keys.includes(LN[k]))continue;}}}
 if(idx<0){miss.push(x[7]);continue}
 let hk=idx+1;while(!isH[hk])hk++;
 const h=isH[hk];
 let j=jn(L[idx-1]||'');if(j==null)j=jn(L[idx+1]||'');
 const win=L.slice(idx+1,hk).concat([L[hk].replace(/^.*?[″"]/,'')]).concat(L.slice(hk+1,hk+4)).filter((s,ii)=>!keys.includes(nm(s))).join('\n');
 const c=C(win.slice(0,400));
 const u=[];if(j!=null&&j!==x[6])u.push('j'+j);if(h&&h!==x[4])u.push('h'+h);if(c&&c!==x[5])u.push('c'+c);
 const pn=L[idx];if(pn!==x[0]&&pn!==pn.toUpperCase())u.push('n'+pn+'^');
 if(u.length)upd.push(x[7]+':'+u.join(''));}
return TEAM+' stream heights'+nh+' ours'+ours.length+'\nM '+miss.join(',')+'\nU '+upd.join(';');})
