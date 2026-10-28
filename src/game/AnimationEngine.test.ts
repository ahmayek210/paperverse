import { describe, expect, it } from 'vitest';
import { AnimationEngine } from './AnimationEngine';
import type { Creature } from '../types';

const creature=(species_id:string,seed=42):Creature=>({id:species_id,world_id:'w',biome_id:'ocean',species_id,name:'Test',creator_id:'u',sprite_path:'x',strokes:{schemaVersion:1,width:512,height:512,strokes:[]},x:800,y:400,scale:1,rotation:0,motion_seed:seed,created_at:'2026-01-01T00:00:00Z',updated_at:'2026-01-01T00:00:00Z',deleted_at:null});
describe('AnimationEngine',()=>{
  it('aynı seed ve zamanda deterministik poz üretir',()=>{const e=new AnimationEngine();expect(e.pose(creature('fish'),123456)).toEqual(e.pose(creature('fish'),123456));});
  it('farklı hareket profilleri gözle görülür farklı poz üretir',()=>{const e=new AnimationEngine();const a=e.pose(creature('jellyfish'),555555),b=e.pose(creature('robot'),555555);expect(Math.abs(a.scaleY-b.scaleY)+Math.abs(a.rotation-b.rotation)).toBeGreaterThan(.05);});
});
