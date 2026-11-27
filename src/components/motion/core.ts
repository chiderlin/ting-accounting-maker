import * as THREE from "three";

export type MotionId = "explode" | "reassemble" | "turntable" | "keyPress" | "rotary" | "lcdBoot";
export type Easing = "Linear" | "Power In Out" | "Power Out";
export interface MotionController {
  select(id: MotionId, targetId?: string): void;
  play(): void; pause(): void; reverse(): void; replay(): void; reset(): void;
  setProgress(progress: number): void;
}
export type MotionState = {
  id: MotionId; targetId: string; progress: number; direction: -1 | 0 | 1;
  duration: number; easing: Easing; distance: number; stagger: number; assembled: boolean;
};
export type MotionProfile = {
  durations: Record<MotionId, number>;
  assembly: { id: string; offset: number; order: number }[];
  root: string; rotary: string; keys: string[]; lcd: string[]; keyTravel: number;
};
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function ease(p: number, mode: Easing) {
  return mode === "Linear" ? p : mode === "Power Out" ? 1 - (1-p)**3 : p < .5 ? 4*p**3 : 1-(-2*p+2)**3/2;
}
export class StudioController implements MotionController {
  private listeners = new Set<() => void>();
  private state: MotionState;
  constructor(private profile: MotionProfile) {
    this.state = {id:"explode", targetId:profile.keys[0], progress:0, direction:0, duration:profile.durations.explode, easing:"Power In Out", distance:1, stagger:.45, assembled:true};
  }
  getSnapshot = () => this.state;
  subscribe = (fn: () => void) => { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; };
  private patch(p: Partial<MotionState>) { this.state = {...this.state,...p}; this.listeners.forEach(fn => fn()); }
  select(id: MotionId, targetId = this.state.targetId) {
    this.patch({id,targetId,progress:0,direction:0,assembled:false,duration:this.profile.durations[id],easing:id==="turntable"?"Linear":id==="keyPress"?"Power Out":"Power In Out"});
  }
  configure(p: Partial<Pick<MotionState,"duration"|"easing"|"distance"|"stagger"|"targetId">>) { this.patch(p); }
  play() { this.patch({direction:1,assembled:false,progress:this.state.assembled && this.state.id==="reassemble"?1:this.state.progress}); }
  pause() { this.patch({direction:0}); }
  reverse() { this.patch({direction:-1,assembled:false,progress:this.state.assembled && this.state.id==="reassemble"?1:this.state.progress}); }
  replay() { this.patch({progress:0,direction:1,assembled:false}); }
  reset() { this.patch({progress:this.state.id==="reassemble"?1:0,direction:0,assembled:true}); }
  setProgress(progress: number) { this.patch({progress:clamp(progress),direction:0,assembled:false}); }
  tick(dt: number) {
    const s=this.state; if (!s.direction) return;
    const progress=clamp(s.progress+Math.min(dt,.1)*s.direction/Math.max(.05,s.duration));
    this.patch({progress,direction:progress===0||progress===1?0:s.direction});
  }
}
type Entry = { object: THREE.Object3D; position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3; visible: boolean; axis: THREE.Vector3; role: string };
export class ComponentRegistry {
  private entries = new Map<string,Entry>();
  constructor(root: THREE.Object3D, profile: MotionProfile) {
    const roles = new Map<string,string>([[profile.root,"presentation"],[profile.rotary,"rotary"],...profile.keys.map(id=>[id,"key"] as [string,string]),...profile.lcd.map(id=>[id,"lcd"] as [string,string]),...profile.assembly.map(a=>[a.id,"assembly"] as [string,string])]);
    root.traverse(object => {
      const role=roles.get(object.name); if (!role) return;
      this.entries.set(object.name,{object,position:object.position.clone(),quaternion:object.quaternion.clone(),scale:object.scale.clone(),visible:object.visible,axis:new THREE.Vector3(0,1,0),role});
    });
  }
  restore() {
    for (const e of this.entries.values()) {
      e.object.position.copy(e.position); e.object.quaternion.copy(e.quaternion); e.object.scale.copy(e.scale);
      if(e.role==="lcd") e.object.visible=e.visible;
    }
  }
  move(id:string, amount:number) { const e=this.entries.get(id); if(e) e.object.position.addScaledVector(e.axis,amount); }
  rotate(id:string, angle:number) { const e=this.entries.get(id); if(e) e.object.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(e.axis,angle)); }
  show(id:string,visible:boolean) { const e=this.entries.get(id); if(e) e.object.visible=visible; }
}
export function applyTimeline(registry: ComponentRegistry, profile: MotionProfile, s: MotionState) {
  registry.restore();
  if(s.assembled) return;
  const p=s.progress, t=ease(p,s.easing);
  if(s.id==="explode"||s.id==="reassemble") {
    const q=s.id==="reassemble"?1-p:p;
    for(const a of profile.assembly) {
      const start=a.order*s.stagger;
      registry.move(a.id,a.offset*s.distance*ease(clamp((q-start)/(1-s.stagger)),s.easing));
    }
  } else if(s.id==="turntable") registry.rotate(profile.root,t*Math.PI*2);
  else if(s.id==="keyPress") registry.move(s.targetId,-profile.keyTravel*ease(1-Math.abs(2*p-1),s.easing));
  else if(s.id==="rotary") registry.rotate(profile.rotary,t*Math.PI*2);
  else if(s.id==="lcdBoot") {
    const index=p<.3?0:p<.75?1:2;
    profile.lcd.forEach((id,i)=>registry.show(id,i===index));
  }
}
