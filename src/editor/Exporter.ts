import type { Stroke, StrokeDocument } from '../types';
import { drawStroke } from './Brush';

export function renderDocument(canvas:HTMLCanvasElement,strokes:Stroke[]){const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);for(const stroke of strokes)drawStroke(ctx,stroke,canvas.width/512);}
export async function exportSprite(strokes:Stroke[]):Promise<{blob:Blob;document:StrokeDocument}>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;renderDocument(canvas,strokes);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((b)=>b?resolve(b):reject(new Error('Çizim dışa aktarılamadı')),'image/webp',.88));if(blob.size>1_500_000)throw new Error('Çizim dosyası 1,5 MB sınırını aşıyor.');return {blob,document:{schemaVersion:1,width:512,height:512,strokes}};}
