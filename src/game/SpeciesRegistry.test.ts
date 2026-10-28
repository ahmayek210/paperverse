import { describe,expect,it } from 'vitest';
import { biomes } from './Biomes';
import { speciesForBiome,speciesRegistry } from './SpeciesRegistry';
describe('SpeciesRegistry',()=>{
  it('tam 40 benzersiz tür içerir',()=>{expect(speciesRegistry).toHaveLength(40);expect(new Set(speciesRegistry.map(s=>s.id)).size).toBe(40);});
  it('sekiz biyomun her birinde beş tür vardır',()=>{for(const biome of biomes)expect(speciesForBiome(biome.id),biome.id).toHaveLength(5);});
  it('hareket motorunda en az on farklı davranış kullanır',()=>{expect(new Set(speciesRegistry.map(s=>s.movement)).size).toBeGreaterThanOrEqual(10);});
});
