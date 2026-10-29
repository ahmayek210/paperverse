import type { Creature } from '../types';
import { speciesById } from './SpeciesRegistry';
export interface Pose{x:number;y:number;rotation:number;scaleX:number;scaleY:number;alpha:number;trail:string;shadow:number;vx:number}
const frac=(n:number)=>n-Math.floor(n); const hash=(a:number,b:number)=>frac(Math.sin(a*91.17+b*412.31)*43758.5453); const smooth=(n:number)=>n*n*(3-2*n);
export class AnimationEngine{
 private reactions=new Map<string,{kind:string;at:number}>();
 react(id:string,kind:string,now=performance.now()){this.reactions.set(id,{kind,at:now});}
 pose(c:Creature,nowMs:number):Pose{const s=speciesById.get(c.species_id);if(!s)return{x:c.x,y:c.y,rotation:0,scaleX:1,scaleY:1,alpha:1,trail:'none',shadow:1,vx:0};const t=nowMs/1000+c.motion_seed%997,seed=c.motion_seed;const cycle=4+s.pause[0]+hash(seed,4)*(s.pause[1]-s.pause[0]+5);const q=t/cycle,k=Math.floor(q),u=smooth(frac(q));const range=s.id==='starfish'?68:s.id==='seahorse'?105:175;const a={x:(hash(seed,k*2)-.5)*range*2,y:(hash(seed,k*2+1)-.5)*(s.id==='starfish'?20:range)};const b={x:(hash(seed,(k+1)*2)-.5)*range*2,y:(hash(seed,(k+1)*2+1)-.5)*(s.id==='starfish'?20:range)};let x=c.x+a.x+(b.x-a.x)*u,y=c.y+a.y+(b.y-a.y)*u;let vx=(b.x-a.x)*(6*u*(1-u))/cycle;let sx=1,sy=1,rotation=0,alpha=1;const beat=t*(s.speed[0]+s.speed[1])*.027;
 if(s.id==='fish'){y+=Math.sin(beat)*13;rotation=Math.sin(beat*.6)*.08;sx+=Math.sin(beat*2)*.025}
 else if(s.id==='seahorse'){x+=Math.sin(beat*.42)*24;y+=Math.sin(beat*.85)*37;rotation=Math.sin(beat*.5)*.13}
 else if(s.id==='jellyfish'){y-=frac(beat*.17)*38;sy=.9+.14*(.5+.5*Math.sin(beat*2.3));sx=1.06-(sy-1)*.45;alpha=.86+.14*Math.sin(beat)**2}
 else {y=Math.max(775,y)+Math.sin(beat*.7)*3;rotation=Math.sin(beat*.3)*.08;vx*=.25}
 const r=this.reactions.get(c.id);if(r){const age=nowMs-r.at;if(age>1250)this.reactions.delete(c.id);else{const p=1-age/1250;if(r.kind==='flee'){x+=(vx>=0?1:-1)*110*p;vx+=(vx>=0?1:-1)*150*p}else if(r.kind==='pulse'){sx+=.2*p;sy+=.2*p}else rotation+=Math.sin(age*.015)*.25*p;}}
 return{x:Math.max(45,Math.min(2355,x)),y:Math.max(s.id==='starfish'?760:80,Math.min(850,y)),rotation:rotation+c.rotation,scaleX:sx,scaleY:sy,alpha,trail:s.trail,shadow:s.id==='jellyfish'?.55:1,vx};
 }
}
