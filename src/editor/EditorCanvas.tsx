import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { Point, Stroke } from '../types';
import { drawStroke } from './Brush';
import { History } from './History';

export interface EditorCanvasHandle { undo():void;redo():void;clear():void;getStrokes():Stroke[];isEmpty():boolean }
interface Props { color:string;size:number;eraser:boolean;onChange:(state:{undo:boolean;redo:boolean;empty:boolean})=>void }
export const EditorCanvas=forwardRef<EditorCanvasHandle,Props>(({color,size,eraser,onChange},ref)=>{
  const canvasRef=useRef<HTMLCanvasElement>(null);const history=useRef(new History());const active=useRef<Map<number,Stroke>>(new Map());const gesture=useRef<{distance:number;scale:number;ox:number;oy:number}|null>(null);const view=useRef({scale:1,ox:0,oy:0});
  const redraw=()=>{const c=canvasRef.current;if(!c)return;const ctx=c.getContext('2d')!;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.setTransform(view.current.scale,0,0,view.current.scale,view.current.ox,view.current.oy);for(const s of history.current.value())drawStroke(ctx,s,c.width/512);for(const s of active.current.values())drawStroke(ctx,s,c.width/512);};
  const notify=()=>onChange({undo:history.current.canUndo,redo:history.current.canRedo,empty:history.current.value().length===0});
  useImperativeHandle(ref,()=>({undo(){history.current.undo();redraw();notify();},redo(){history.current.redo();redraw();notify();},clear(){history.current.clear();redraw();notify();},getStrokes(){return history.current.value();},isEmpty(){return history.current.value().length===0;}}));
  useEffect(()=>{const c=canvasRef.current!;const resize=()=>{const s=Math.min(c.clientWidth,c.clientHeight);const dpr=Math.min(devicePixelRatio||1,2);c.width=Math.round(s*dpr);c.height=Math.round(s*dpr);redraw();};resize();const ro=new ResizeObserver(resize);ro.observe(c);return()=>ro.disconnect();},[]);
  const point=(e:React.PointerEvent<HTMLCanvasElement>):Point=>{const c=canvasRef.current!,r=c.getBoundingClientRect(),d=c.width/r.width;return{x:((e.clientX-r.left)*d-view.current.ox)/view.current.scale/(c.width/512),y:((e.clientY-r.top)*d-view.current.oy)/view.current.scale/(c.width/512),p:e.pointerType==='pen'&&e.pressure>0?Math.max(.25,e.pressure):1,t:performance.now()};};
  const down=(e:React.PointerEvent<HTMLCanvasElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);active.current.set(e.pointerId,{color,size,eraser,points:[point(e)]});};
  const move=(e:React.PointerEvent<HTMLCanvasElement>)=>{const s=active.current.get(e.pointerId);if(!s)return;s.points.push(point(e));if(active.current.size===2){const vals=[...active.current.values()].map(v=>v.points.at(-1)!);const d=Math.hypot(vals[0].x-vals[1].x,vals[0].y-vals[1].y);if(!gesture.current)gesture.current={distance:d,scale:view.current.scale,ox:view.current.ox,oy:view.current.oy};else view.current.scale=Math.max(.75,Math.min(2.5,gesture.current.scale*d/gesture.current.distance));}redraw();};
  const up=(e:React.PointerEvent<HTMLCanvasElement>)=>{const s=active.current.get(e.pointerId);if(!s)return;active.current.delete(e.pointerId);if(active.current.size===0)gesture.current=null;if(s.points.length>0&&active.current.size===0)history.current.push(s);redraw();notify();};
  return <canvas ref={canvasRef} className="editor-canvas" aria-label="Şeffaf çizim tuvali" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}/>;
});
EditorCanvas.displayName='EditorCanvas';
