import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';
export class WorldRealtime {
  private channel:RealtimeChannel|null=null;
  async connect(worldId:string,displayName:string,onChange:()=>void,onPresence:(names:string[])=>void){const {data:{user}}=await supabase.auth.getUser();if(!user)return;this.disconnect();this.channel=supabase.channel(`paperverse:${worldId}`,{config:{private:true,broadcast:{self:false,ack:true},presence:{key:user.id}}}).on('broadcast',{event:'creatures.changed'},()=>onChange()).on('presence',{event:'sync'},()=>{const state=this.channel?.presenceState()||{};const names=Object.values(state).flat().map((entry:any)=>entry.displayName).filter(Boolean);onPresence(names);}).subscribe(async(status)=>{if(status==='SUBSCRIBED')await this.channel?.track({displayName,onlineAt:new Date().toISOString()});if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')setTimeout(onChange,1200);});}
  async announce(){await this.channel?.send({type:'broadcast',event:'creatures.changed',payload:{at:Date.now()}});}
  disconnect(){if(this.channel){void supabase.removeChannel(this.channel);this.channel=null;}}
}
