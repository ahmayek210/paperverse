import type { Creature, Species } from '../types';
import { speciesById } from './SpeciesRegistry';

export interface Pose { x:number;y:number;rotation:number;scaleX:number;scaleY:number;alpha:number;trail:string;shadow:number }
const frac=(n:number)=>n-Math.floor(n);
const hash=(seed:number,n:number)=>frac(Math.sin(seed*91.17+n*412.31)*43758.5453);
const smooth=(v:number)=>v*v*(3-2*v);

export class AnimationEngine {
  private reactions=new Map<string,{kind:string,at:number}>();
  react(id:string,kind:string){this.reactions.set(id,{kind,at:performance.now()/1000});}
  pose(creature:Creature,nowMs:number):Pose {
    const p=speciesById.get(creature.species_id); if(!p)return {x:creature.x,y:creature.y,rotation:0,scaleX:1,scaleY:1,alpha:1,trail:'none',shadow:1};
    const t=nowMs/1000+new Date(creature.created_at).getTime()/1000%997; const seed=creature.motion_seed; const cycle=5+hash(seed,1)*8; const phase=t/cycle; const k=Math.floor(phase),u=smooth(frac(phase));
    const a=target(seed,k,p),b=target(seed,k+1,p); let x=creature.x+(a.x+(b.x-a.x)*u); let y=creature.y+(a.y+(b.y-a.y)*u);
    const beat=t*(p.speed[0]+p.speed[1])*.035; let rotation=0, sx=1,sy=1,alpha=1;
    switch(p.movement){
      case 'swim': y+=Math.sin(beat)*24;rotation=Math.sin(beat*.55)*.09;sx=1+.025*Math.sin(beat*2);break;
      case 'hover': y+=Math.sin(beat*.7)*34;rotation=Math.sin(beat*.36)*.12;break;
      case 'pulse': y-=frac(beat*.22)*55;sy=.88+.18*(.5+.5*Math.sin(beat*2.2));sx=1.1-(sy-1)*.5;alpha=.82+.18*Math.sin(beat)**2;break;
      case 'jet': {const burst=Math.pow(Math.max(0,Math.sin(beat*.62)),5);x+=burst*90; sx=1+.14*burst;sy=1-.09*burst;rotation=Math.sin(beat*.3)*.16;break;}
      case 'walk': y+=Math.abs(Math.sin(beat*1.8))*-8;rotation=Math.sin(beat*1.8)*.035;break;
      case 'hop': {const h=Math.abs(Math.sin(beat*.88));y-=h*h*65;sy=1-.16*h;sx=1+.1*h;rotation=Math.sin(beat*.44)*.08;break;}
      case 'flutter': y+=Math.sin(beat*1.35)*30+Math.sin(beat*.47)*14;rotation=Math.sin(beat*.9)*.18;sx=.94+.1*Math.sin(beat*3.8);break;
      case 'sprint': {const moving=frac(phase*3)<.56;x+=moving?Math.sin(beat*.2)*40:0;rotation=moving?Math.sin(beat*3)*.06:0;break;}
      case 'glide': y+=Math.sin(beat*.35)*28;rotation=Math.sin(beat*.22)*.18;break;
      case 'patrol': rotation=(Math.floor(phase*4)%2?1:-1)*.025;y+=Math.abs(Math.sin(beat*2))*-4;break;
      case 'orbit': {const r=45+hash(seed,4)*45;x+=Math.cos(beat*.18)*r;y+=Math.sin(beat*.18)*r*.45;rotation+=beat*.08;break;}
      case 'slide': {const slide=Math.max(0,Math.sin(beat*.42));x+=slide*55;rotation=Math.sin(beat*.42)*.08;y-=Math.abs(Math.sin(beat*1.1))*5;break;}
    }
    const react=this.reactions.get(creature.id); if(react){const age=t-react.at;if(age>1.25)this.reactions.delete(creature.id);else{const q=1-age/1.25; if(react.kind==='flee'||react.kind==='boost')x+=130*q;if(react.kind==='hop'||react.kind==='slide')y-=Math.sin(age*Math.PI/1.25)*90;if(react.kind==='pulse'){sx+=.25*q;sy+=.25*q;}if(react.kind==='spin')rotation+=q*Math.PI*2;if(react.kind==='wave'||react.kind==='greet')rotation+=Math.sin(age*18)*.2*q;}}
    return {x,y,rotation:rotation+creature.rotation,scaleX:sx,scaleY:sy,alpha,trail:p.trail,shadow:p.bounds==='air'||p.bounds==='space'?.6:1};
  }
}

function target(seed:number,k:number,p:Species){
  const travel=p.bounds==='ground'||p.bounds==='road'||p.bounds==='wall'?{x:(hash(seed,k*3)-.5)*650,y:0}:{x:(hash(seed,k*3)-.5)*700,y:(hash(seed,k*3+1)-.5)*330};
  if(p.bounds==='road')travel.y=80*Math.sin((hash(seed,k+2)-.5)*Math.PI);
  if(p.bounds==='ground')travel.y=(hash(seed,k+5)-.5)*55;
  return travel;
}
