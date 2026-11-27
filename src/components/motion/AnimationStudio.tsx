"use client";
import { useSyncExternalStore } from "react";
import type { StudioController, MotionId, Easing } from "./core";
import { makerProfile } from "./makerProfile";
const options: [MotionId,string][]=[["explode","M01 / Exploded view"],["reassemble","M02 / Reassembly"],["turntable","M03 / Turntable"],["keyPress","M04 / Key press"],["rotary","M05 / Rotary"],["lcdBoot","M06 / LCD boot"]];
export default function AnimationStudio({controller:c}:{controller:StudioController}) {
  const s=useSyncExternalStore(c.subscribe,c.getSnapshot,c.getSnapshot);
  const assembly=s.id==="explode"||s.id==="reassemble";
  return <section className="animation-studio">
    <h2>04 / Animation Studio</h2>
    <label className="studio-field">Animation<select value={s.id} onChange={e=>c.select(e.target.value as MotionId)}>{options.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
    <label className="studio-field">Key target<select disabled={s.id!=="keyPress"} value={s.targetId} onChange={e=>c.configure({targetId:e.target.value})}>{makerProfile.keys.map(k=><option key={k} value={k}>{k.replace("keycap-","")}</option>)}</select></label>
    <div className="views">
      <button className={s.direction===1?"active":""} onClick={()=>c.play()}>Play</button>
      <button onClick={()=>c.pause()}>Pause</button>
      <button className={s.direction===-1?"active":""} onClick={()=>c.reverse()}>Reverse</button>
      <button onClick={()=>c.replay()}>Replay</button>
      <button onClick={()=>c.reset()}>Reset</button>
    </div>
    <label className="slider"><span>Timeline <output>{Math.round(s.progress*100)}%</output></span><input type="range" min="0" max="100" step=".1" value={s.progress*100} onChange={e=>c.setProgress(Number(e.target.value)/100)}/></label>
    <label className="studio-field">Duration (s)<input type="number" min=".1" max="30" step=".1" value={s.duration} onChange={e=>{const n=Number(e.target.value);if(n>=.1&&n<=30)c.configure({duration:n});}}/></label>
    <label className="studio-field">Easing<select value={s.easing} onChange={e=>c.configure({easing:e.target.value as Easing})}>{["Linear","Power In Out","Power Out"].map(e=><option key={e}>{e}</option>)}</select></label>
    <label className="slider"><span>Explode distance <output>{s.distance.toFixed(2)}×</output></span><input disabled={!assembly} type="range" min=".75" max="1.5" step=".05" value={s.distance} onChange={e=>c.configure({distance:Number(e.target.value)})}/></label>
    <label className="slider"><span>Component stagger <output>{Math.round(s.stagger*100)}%</output></span><input disabled={!assembly} type="range" min="0" max=".75" step=".05" value={s.stagger} onChange={e=>c.configure({stagger:Number(e.target.value)})}/></label>
    <p className="subtle">Scrub to inspect any frame. Zoom out for the full assembly.</p>
  </section>;
}
