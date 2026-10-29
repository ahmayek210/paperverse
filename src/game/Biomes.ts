import type { BiomeId } from '../types';

export interface Biome { id: BiomeId; name: string; playable: boolean }
export const biomes: Biome[] = [
  {id:'ocean',name:'Ocean',playable:true},{id:'forest',name:'Forest',playable:false},
  {id:'desert',name:'Desert',playable:false},{id:'sky',name:'Sky',playable:false},
  {id:'city',name:'City',playable:false},{id:'space',name:'Space',playable:false},
  {id:'polar',name:'Polar',playable:false},{id:'cave',name:'Cave',playable:false},
];
export const biomeById=new Map(biomes.map(b=>[b.id,b]));

const hash=(n:number)=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
const wave=(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,c:string)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y+h);for(let i=0;i<=8;i++){const px=x+w*i/8;ctx.lineTo(px,y+Math.sin(i*.95+x*.004)*h*.18)}ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill()};

/** Seeded multi-layer ocean renderer, adapted as application code from the supplied reference environment. */
export function drawOcean(ctx:CanvasRenderingContext2D,width:number,height:number,time:number){
  const t=time*.001; const g=ctx.createLinearGradient(0,0,0,height);g.addColorStop(0,'#78cbd3');g.addColorStop(.2,'#167e99');g.addColorStop(.62,'#07506c');g.addColorStop(1,'#02384e');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
  ctx.save();ctx.globalAlpha=.23;for(let i=0;i<13;i++){const x=(i*260+t*24)%(width+330)-160;const ray=ctx.createLinearGradient(x,0,x-200,height*.72);ray.addColorStop(0,'rgba(229,255,240,.7)');ray.addColorStop(1,'rgba(229,255,240,0)');ctx.fillStyle=ray;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+62,0);ctx.lineTo(x-170,height*.74);ctx.lineTo(x-250,height*.74);ctx.closePath();ctx.fill()}ctx.restore();
  for(let i=0;i<18;i++){const x=i*380-100,y=height*.54+Math.sin(i*1.7)*42;ctx.fillStyle=i%2?'#06465c':'#083d54';ctx.beginPath();ctx.moveTo(x,height);ctx.lineTo(x+100,y-70);ctx.lineTo(x+245,y);ctx.lineTo(x+380,height);ctx.closePath();ctx.fill()}
  for(let i=0;i<82;i++){const x=(hash(i+11)*width+t*(5+hash(i)*9))%width,y=hash(i+62)*height*.84+height*.08;ctx.globalAlpha=.12+hash(i+3)*.28;ctx.fillStyle='#c4f5dc';ctx.beginPath();ctx.arc(x,y,.7+hash(i+9)*2,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  const floor=height*.83;wave(ctx,0,floor,width,height-floor,'#0b6570');wave(ctx,0,floor+35,width,height-floor,'#07515f');
  for(let i=0;i<42;i++){const x=hash(i*17+7)*width,y=floor+hash(i*3)*75,h=48+hash(i*5)*125;ctx.strokeStyle=i%3?'#0a6b5d':'#14786b';ctx.lineWidth=4+hash(i)*7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+Math.sin(t*.85+i)*18,y-h*.38,x+Math.cos(t*.55+i)*25,y-h*.72,x+Math.sin(t*.7+i)*18,y-h);ctx.stroke();}
  for(let i=0;i<27;i++){const x=hash(i*31+2)*width,y=floor+12+hash(i)*55;ctx.fillStyle=['#d66c66','#ee9a68','#bd667e','#e3b36f'][i%4];ctx.beginPath();ctx.arc(x,y,17+hash(i+8)*24,Math.PI,0);ctx.lineTo(x+22,y+27);ctx.lineTo(x-22,y+27);ctx.closePath();ctx.fill();}
  for(let i=0;i<32;i++){const x=hash(i*71+1)*width,y=(height+80)-((t*(10+hash(i)*14)+hash(i+8)*height)%(height+110));ctx.globalAlpha=.25+hash(i)*.45;ctx.strokeStyle='#d4f6ee';ctx.lineWidth=1+hash(i)*2;ctx.beginPath();ctx.arc(x,y,2+hash(i+5)*5,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;
  ctx.fillStyle='rgba(238,223,166,.32)';ctx.fillRect(0,height-18,width,18);
}
