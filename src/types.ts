export type BiomeId = 'ocean' | 'forest' | 'desert' | 'sky' | 'city' | 'space' | 'polar' | 'cave';
export type MovementId = 'swim' | 'hover' | 'pulse' | 'jet' | 'walk' | 'hop' | 'flutter' | 'sprint' | 'glide' | 'patrol' | 'orbit' | 'slide';
export type BoundsMode = 'water' | 'ground' | 'air' | 'road' | 'space' | 'wall';

export interface Species {
  id: string; name: string; biomeId: BiomeId; movement: MovementId; speed: [number, number]; pause: [number, number]; size: [number, number]; bounds: BoundsMode; facing: 'horizontal' | 'velocity' | 'none'; trail: string; reaction: string; motionDescription: string;
}

export interface Profile { id: string; display_name: string; created_at: string; updated_at: string }
export interface World { id: string; title: string; owner_id: string; created_at: string; settings_json: Record<string, unknown> }
export interface Member { world_id: string; user_id: string; role: 'owner' | 'member'; joined_at: string; profile?: Profile }
export interface Point { x: number; y: number; p: number; t: number }
export interface Stroke { color: string; size: number; eraser: boolean; points: Point[] }
export interface StrokeDocument { schemaVersion: 1; width: number; height: number; strokes: Stroke[] }
export interface Creature {
  id: string; world_id: string; biome_id: BiomeId; species_id: string; name: string; creator_id: string; sprite_path: string; strokes: StrokeDocument; x: number; y: number; scale: number; rotation: number; motion_seed: number; created_at: string; updated_at: string; deleted_at: string | null; creator?: Profile; spriteUrl?: string;
}
