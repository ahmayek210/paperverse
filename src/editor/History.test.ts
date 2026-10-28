import { describe,expect,it } from 'vitest';
import { History } from './History';
describe('History',()=>{it('undo ve redo stroke verisini korur',()=>{const h=new History();h.push({color:'#000',size:4,eraser:false,points:[{x:1,y:2,p:1,t:0}]});expect(h.undo()).toHaveLength(0);expect(h.redo()).toHaveLength(1);});});
