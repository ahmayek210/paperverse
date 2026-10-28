export class Camera {
  x = 0; y = 0; zoom = 1;
  constructor(public worldWidth = 2400, public worldHeight = 900) {}
  clamp(viewWidth: number, viewHeight: number) {
    const visibleW=viewWidth/this.zoom, visibleH=viewHeight/this.zoom;
    this.x=Math.max(0,Math.min(this.worldWidth-visibleW,this.x));
    this.y=Math.max(0,Math.min(this.worldHeight-visibleH,this.y));
  }
  screenToWorld(sx:number,sy:number){return {x:sx/this.zoom+this.x,y:sy/this.zoom+this.y};}
  apply(ctx:CanvasRenderingContext2D){ctx.scale(this.zoom,this.zoom);ctx.translate(-this.x,-this.y);}
}
