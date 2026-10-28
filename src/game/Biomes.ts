import type { BiomeId } from '../types';

export interface Biome { id: BiomeId; name: string; short: string; sky: string; ground: string; accent: string; emoji: string; description: string }
export const biomes: Biome[] = [
  { id:'ocean', name:'Okyanus', short:'Mercan Koyu', sky:'#8dcbd0', ground:'#d9b66f', accent:'#e56b5d', emoji:'≈', description:'Mercanların arasından geçen serin kâğıt akıntıları.' },
  { id:'forest', name:'Orman', short:'Mantar Korusu', sky:'#bad8b0', ground:'#7e9b63', accent:'#ef846a', emoji:'♧', description:'Dere sesli, kat kat kesilmiş bir orman.' },
  { id:'desert', name:'Çöl', short:'Karton Kumlar', sky:'#efbd7c', ground:'#c98352', accent:'#5b9279', emoji:'⌁', description:'Kaktüs gölgeleri ve sıcak karton tepeler.' },
  { id:'sky', name:'Gökyüzü', short:'Bulut Adaları', sky:'#a9d8e7', ground:'#e9f0e7', accent:'#b68acb', emoji:'☁', description:'Rüzgâr şeritleri arasında yüzen bulut adaları.' },
  { id:'city', name:'Karton Şehir', short:'Makas Mahallesi', sky:'#d8c5ab', ground:'#849193', accent:'#e06452', emoji:'▥', description:'Kâğıt evler, küçük park ve kıvrılan yollar.' },
  { id:'space', name:'Uzay', short:'Lavanta Galaksisi', sky:'#272340', ground:'#41375e', accent:'#f1ba63', emoji:'✦', description:'Kesilmiş gezegenler ve sessiz yıldız yolları.' },
  { id:'polar', name:'Kutup', short:'Buz Kâğıdı', sky:'#cbe3e4', ground:'#eef4ed', accent:'#5893a8', emoji:'△', description:'Katmanlı buzullar, iglo ve yumuşak kar.' },
  { id:'cave', name:'Mağara', short:'Kristal Oyuk', sky:'#332e39', ground:'#55414a', accent:'#82c5bd', emoji:'◇', description:'Koyu kaya katları ve parlayan kristaller.' },
];
export const biomeById = new Map(biomes.map((item) => [item.id, item]));

const poly = (ctx: CanvasRenderingContext2D, pts: number[][], fill: string, stroke='#423f3a') => { ctx.beginPath(); pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=stroke; ctx.lineWidth=3; ctx.stroke(); };
export function drawBiome(ctx: CanvasRenderingContext2D, biomeId: BiomeId, width: number, height: number, t: number) {
  const b = biomeById.get(biomeId)!; const horizon=height*.66;
  const grad=ctx.createLinearGradient(0,0,0,height); grad.addColorStop(0,b.sky); grad.addColorStop(1,b.ground); ctx.fillStyle=grad; ctx.fillRect(0,0,width,height);
  ctx.save(); ctx.globalAlpha=.18; ctx.strokeStyle='#fffdf2'; ctx.lineWidth=2;
  for(let x=-80;x<width+80;x+=64){ctx.beginPath();ctx.moveTo(x+(t*.004)%64,0);ctx.lineTo(x-120+(t*.004)%64,height);ctx.stroke();}
  ctx.restore();
  if (biomeId==='ocean') { for(let i=0;i<14;i++){const x=(i*173+90)%width; ctx.fillStyle=i%2?'#5d9b82':'#de745f'; ctx.beginPath();ctx.arc(x,horizon+60+(i%3)*32,20+(i%4)*8,Math.PI,0);ctx.fill();} for(let i=0;i<18;i++){ctx.strokeStyle='#f9f2c2';ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(i*110,0);ctx.lineTo(i*110-180,horizon);ctx.stroke();} ctx.globalAlpha=1; }
  if (biomeId==='forest') { for(let i=0;i<11;i++){const x=(i*197+50)%width; poly(ctx,[[x,horizon],[x+55,horizon-160-(i%3)*35],[x+110,horizon]],i%2?'#50785c':'#6f9362');ctx.fillStyle='#79563d';ctx.fillRect(x+48,horizon,16,90);} ctx.fillStyle='#72a6a1';ctx.beginPath();ctx.moveTo(0,horizon+105);ctx.bezierCurveTo(width*.3,horizon+45,width*.7,horizon+170,width,horizon+90);ctx.lineWidth=24;ctx.strokeStyle='#72a6a1';ctx.stroke(); }
  if (biomeId==='desert') { poly(ctx,[[0,height],[0,horizon+80],[width*.25,horizon-20],[width*.48,horizon+90],[width*.72,horizon],[width,horizon+75],[width,height]],'#cf8b55','#a36843'); for(let i=0;i<7;i++){const x=130+i*260;ctx.strokeStyle='#4f8068';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(x,horizon+100);ctx.lineTo(x,horizon-35);ctx.moveTo(x,horizon+18);ctx.lineTo(x-30,horizon-5);ctx.moveTo(x,horizon-2);ctx.lineTo(x+28,horizon-25);ctx.stroke();} }
  if (biomeId==='sky') { for(let i=0;i<11;i++){const x=(i*211+(t*.008*(i%2?1:-1)))%(width+240)-120,y=80+(i%4)*110;ctx.fillStyle='#f4f0df';ctx.beginPath();ctx.ellipse(x,y,100,35,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#79736b';ctx.stroke();} }
  if (biomeId==='city') { ctx.fillStyle='#747f80';ctx.fillRect(0,horizon+70,width,height-horizon);ctx.strokeStyle='#f5e1a5';ctx.setLineDash([42,32]);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,horizon+155);ctx.lineTo(width,horizon+155);ctx.stroke();ctx.setLineDash([]); for(let i=0;i<12;i++){const x=i*170, bh=100+(i%4)*36;ctx.fillStyle=i%3===0?'#df826b':i%3===1?'#e2c680':'#8fa99b';ctx.fillRect(x,horizon-bh,130,bh+65);ctx.strokeRect(x,horizon-bh,130,bh+65);for(let w=0;w<3;w++){ctx.fillStyle='#f7e8ad';ctx.fillRect(x+18+w*36,horizon-bh+25,20,26);}} }
  if (biomeId==='space') { for(let i=0;i<70;i++){const x=(i*83)%width,y=(i*137)%height;ctx.fillStyle=i%5?'#eee4c5':'#efbd70';ctx.fillRect(x,y,2+(i%3),2+(i%3));} for(let i=0;i<5;i++){const x=180+i*360,y=130+(i%3)*130;ctx.fillStyle=['#c06d70','#72a9aa','#d4a35b','#8d78a6','#6589b1'][i];ctx.beginPath();ctx.arc(x,y,42+i*6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#eee4c5';ctx.stroke();} }
  if (biomeId==='polar') { poly(ctx,[[0,horizon+80],[width*.15,horizon-40],[width*.28,horizon+50],[width*.44,horizon-100],[width*.62,horizon+55],[width*.78,horizon-50],[width,horizon+70],[width,height],[0,height]],'#e9f2ed','#7ea4ad');ctx.fillStyle='#dbe8e5';ctx.beginPath();ctx.arc(width*.75,horizon+40,80,Math.PI,0);ctx.fill();ctx.stroke();ctx.fillStyle='#5b7880';ctx.fillRect(width*.72,horizon+35,45,45); }
  if (biomeId==='cave') { poly(ctx,[[0,0],[width,0],[width,height*.18],[width*.82,height*.1],[width*.7,height*.23],[width*.55,height*.12],[width*.36,height*.25],[width*.2,height*.1],[0,height*.22]],'#47343e','#211b23');for(let i=0;i<16;i++){const x=60+i*130,h=30+(i%5)*18;poly(ctx,[[x,horizon+120],[x+20,horizon+120-h],[x+42,horizon+120]],i%2?'#83bdb4':'#9677ad','#312a32');} }
  ctx.fillStyle='rgba(55,43,35,.08)'; for(let y=0;y<height;y+=18)ctx.fillRect(0,y,width,1);
}
