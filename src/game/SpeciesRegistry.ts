import type { BiomeId, Species } from '../types';
const item=(id:string,name:string,movement:Species['movement'],speed:[number,number],pause:[number,number],size:[number,number],reaction:string):Species=>({id,name,biomeId:'ocean',movement,bounds:'water',speed,pause,size,trail:'bubble',reaction,motionDescription:name,facing:'horizontal'});
export const speciesRegistry=[item('fish','Fish','swim',[28,55],[.3,1.6],[.75,1.15],'flee'),item('seahorse','Seahorse','hover',[12,25],[.8,2.4],[.6,.9],'turn'),item('jellyfish','Jellyfish','pulse',[8,18],[.3,1.2],[.7,1.15],'pulse'),item('starfish','Starfish','walk',[3,9],[1.5,4],[.65,.95],'turn')];
export const speciesById=new Map(speciesRegistry.map(s=>[s.id,s]));
export const speciesForBiome=(biome:BiomeId)=>biome==='ocean'?speciesRegistry:[];
