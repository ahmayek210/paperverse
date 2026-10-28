import type { Stroke } from '../types';
export class History {
  private done:Stroke[]=[]; private undone:Stroke[]=[];
  push(stroke:Stroke){this.done.push(stroke);this.undone=[];}
  undo(){const s=this.done.pop();if(s)this.undone.push(s);return this.value();}
  redo(){const s=this.undone.pop();if(s)this.done.push(s);return this.value();}
  clear(){this.done=[];this.undone=[];}
  value(){return this.done.map((s)=>({...s,points:s.points.map((p)=>({...p}))}));}
  get canUndo(){return this.done.length>0} get canRedo(){return this.undone.length>0}
}
