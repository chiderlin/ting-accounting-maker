"use client";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { StudioController } from "./motion/core";
import { plate } from "./geometry";

export type ExhibitId = "002" | "003" | "004";
type Vec = [number, number, number];
function Block({p,s,color,r=.06,metal=0,rough=.55,name}: {p:Vec;s:Vec;color:string;r?:number;metal?:number;rough?:number;name?:string}) {
  return <RoundedBox name={name} position={p} args={s} radius={r} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={color} metalness={metal} roughness={rough}/></RoundedBox>;
}
function Disc({p,r,h,color,metal=0,rotation=[0,0,0]}:{p:Vec;r:number;h:number;color:string;metal?:number;rotation?:Vec}) {
  return <mesh position={p} rotation={rotation} castShadow receiveShadow><cylinderGeometry args={[r,r,h,48]}/><meshStandardMaterial color={color} metalness={metal} roughness={.32}/></mesh>;
}
function Mark({text,p,w,color="#36372e",rotation=[-Math.PI/2,0,0]}:{text:string;p:Vec;w:number;color?:string;rotation?:Vec}) {
  const texture=useMemo(()=>{const c=document.createElement("canvas");c.width=512;c.height=128;const ctx=c.getContext("2d")!;ctx.clearRect(0,0,512,128);ctx.font="600 52px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle=color;ctx.fillText(text,256,64,490);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;},[text,color]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={p} rotation={rotation}><planeGeometry args={[w,w/4]}/><meshBasicMaterial map={texture} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1}/></mesh>;
}
function Moving({controller,offset=[0,0,0],angle=0,position=[0,0,0],children,name}:{controller:StudioController;offset?:Vec;angle?:number;position?:Vec;children:ReactNode;name:string}) {
  const ref=useRef<THREE.Group>(null); const invalidate=useThree(s=>s.invalidate);
  const [x,y,z]=position,[dx,dy,dz]=offset;
  useEffect(()=>{const update=()=>{const p=controller.getSnapshot().progress;const t=p*p*(3-2*p);if(ref.current){ref.current.position.set(x+dx*t,y+dy*t,z+dz*t);ref.current.rotation.z=angle*t;}invalidate();};update();return controller.subscribe(update);},[controller,x,y,z,dx,dy,dz,angle,invalidate]);
  return <group ref={ref} name={name}>{children}</group>;
}
function Handheld({controller}:{controller:StudioController}) {
  const shell=useMemo(()=>plate(3.2,5.25,.25,.25,[
    {x:0,z:-1.45,w:2.5,h:1.68,r:.16},
    {x:-.81,z:.35,w:1.05,h:1.05,r:.15},
    {x:.84,z:.22,w:1.12,h:.9,r:.22},
    {x:0,z:1.45,w:1.2,h:.38,r:.14}
  ]),[]);
  useEffect(()=>()=>shell.dispose(),[shell]);
  return <group name="Game Boy — handheld study">
    <Block p={[0,.25,0]} s={[3.2,.5,5.25]} color="#c8c2b1" r={.22} name="rear housing"/>
    <Block p={[0,.01,.95]} s={[2.05,.05,2.0]} color="#b0ab99" r={.12} name="battery door"/>
    <Block p={[0,.01,-1.85]} s={[2.45,.06,.9]} color="#9e9e8f" r={.08} name="cartridge"/>
    <Moving controller={controller} name="circuit assembly" offset={[0,.8,0]}>
      <Block p={[0,.51,0]} s={[2.87,.08,4.88]} color="#405b47" r={.14}/>
      {Array.from({length:12},(_,i)=><Block key={i} p={[-1.2+i*.21,.565,.4+(i%3)*.4]} s={[.045,.014,1.35]} color="#b6a263" r={.005} metal={.6}/>)}
      <Block p={[0,.6,-.1]} s={[.8,.15,.7]} color="#252a29" r={.03}/>
      {Array.from({length:8},(_,i)=><Block key={i} p={[-.48+i*.135,.58,-.49]} s={[.065,.035,.17]} color="#bebdb4" metal={.8} r={.008}/>)}
    </Moving>
    <Moving controller={controller} name="front enclosure" offset={[0,2.05,0]}>
      <mesh geometry={shell} position={[0,.75,0]} castShadow receiveShadow><meshStandardMaterial color="#e1dccc" roughness={.44}/></mesh>
      <Mark text="POCKET / 89" p={[0,.89,-2.38]} w={1.5}/>
      {Array.from({length:6},(_,i)=><Block key={i} p={[.77+i*.115,.89,1.92-i*.055]} s={[.065,.018,.42]} color="#757568" r={.027}/>)}
    </Moving>
    <Moving controller={controller} name="LCD and bezel" offset={[0,1.4,0]}>
      <Block p={[0,.77,-1.45]} s={[2.45,.28,1.63]} color="#686b61" r={.14}/>
      <Block p={[0,.924,-1.47]} s={[1.84,.035,1.24]} color="#87996c" r={.06} rough={.23}/>
      {Array.from({length:18},(_,i)=><Block key={i} p={[-.66+(i%6)*.25,.945,-1.81+Math.floor(i/6)*.2]} s={[.11,.006,.11]} color={i%4===0?"#536344":"#99a87a"} r={.005}/>)}
      <Mark text="DOT MATRIX" p={[0,.925,-.76]} w={1.3} color="#e3dfce"/>
    </Moving>
    <Moving controller={controller} name="controls" offset={[0,3.1,0]}>
      <Block p={[-.81,.88,.35]} s={[.94,.22,.32]} color="#373c38" r={.065}/>
      <Block p={[-.81,.88,.35]} s={[.32,.22,.94]} color="#373c38" r={.065}/>
      <Disc p={[.53,.89,.38]} r={.245} h={.23} color="#a25c50"/>
      <Disc p={[1.04,.89,.08]} r={.245} h={.23} color="#a25c50"/>
      <Mark text="B" p={[.53,1.01,.38]} w={.29} color="#f2e9db"/><Mark text="A" p={[1.04,1.01,.08]} w={.29} color="#f2e9db"/>
      {[-.32,.32].map(x=><Block key={x} p={[x,.87,1.45]} s={[.43,.14,.19]} color="#797e73" r={.08}/>)}
    </Moving>
  </group>;
}
function Journal({controller}:{controller:StudioController}) {
  const bump=useMemo(()=>{const c=document.createElement("canvas");c.width=c.height=128;const ctx=c.getContext("2d")!;const im=ctx.createImageData(128,128);for(let i=0;i<128*128;i++){const n=128+Math.round(35*Math.sin(i*12.9898)*Math.cos(i*78.233));im.data.set([n,n,n,255],i*4);}ctx.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,5);return t;},[]);
  useEffect(()=>()=>bump.dispose(),[bump]);
  const leather="#985c37";
  return <group name="Leather journal" rotation={[0,.12,0]}>
    <Block p={[0,.09,0]} s={[3.65,.18,4.75]} color={leather} r={.13}/>
    <Block p={[.02,.39,0]} s={[3.4,.49,4.46]} color="#e9dfc6" r={.06}/>
    {Array.from({length:28},(_,i)=><group key={i}><Block p={[1.725,.16+i*.016,0]} s={[.012,.005,4.37]} color={i%3===0?"#b9a98b":"#d3c5aa"} r={.002}/><Block p={[.03,.16+i*.016,2.235]} s={[3.31,.005,.012]} color="#c8b99c" r={.002}/></group>)}
    <Block p={[-1.78,.39,0]} s={[.23,.7,4.67]} color="#79492c" r={.11}/>
    <Moving controller={controller} name="hinged leather cover" position={[-1.77,.69,0]} angle={2.35}>
      <RoundedBox position={[1.77,.07,0]} args={[3.65,.17,4.75]} radius={.13} smoothness={4} castShadow receiveShadow><meshStandardMaterial color={leather} roughness={.83} bumpMap={bump} bumpScale={.045}/></RoundedBox>
      {Array.from({length:24},(_,i)=><group key={i}>{[.18,3.36].map(x=><Block key={x} p={[x,.167,-2.15+i*.186]} s={[.025,.018,.095]} color="#d4a97a" r={.008}/>)}</group>)}
      {Array.from({length:18},(_,i)=><group key={i}>{[-2.15,2.15].map(z=><Block key={z} p={[.23+i*.18,.167,z]} s={[.095,.018,.025]} color="#d4a97a" r={.008}/>)}</group>)}
      <Mark text="FIELD NOTES" p={[1.77,.164,-.5]} w={1.6} color="#e3b98a"/>
      <Block p={[3.43,.17,.2]} s={[.5,.12,.64]} color="#78472e" r={.08}/>
      <Disc p={[3.45,.25,.2]} r={.105} h={.055} color="#b89a60" metal={.85}/>
    </Moving>
    <Block p={[.4,.25,2.38]} s={[.16,.025,.55]} color="#657351" r={.01}/>
  </group>;
}
function CameraModel({controller}:{controller:StudioController}) {
  const forward:Vec=[Math.PI/2,0,0];
  return <group name="Film camera">
    <Block p={[0,1.13,0]} s={[4.4,2.2,1.35]} color="#333633" r={.19} rough={.8}/>
    <Block p={[0,.17,0]} s={[4.36,.28,1.4]} color="#b7b9b4" r={.09} metal={.8}/>
    <Moving controller={controller} name="top deck" offset={[0,1.2,0]}>
      <Block p={[0,2.08,0]} s={[4.4,.51,1.4]} color="#c4c5bd" r={.12} metal={.82} rough={.36}/>
      <Disc p={[1.38,2.43,0]} r={.34} h={.21} color="#a3a59e" metal={.8}/>
      {Array.from({length:24},(_,i)=><Block key={i} p={[1.38+.335*Math.cos(i*Math.PI/12),2.43,.335*Math.sin(i*Math.PI/12)]} s={[.04,.19,.04]} color="#686b66" r={.01} metal={.6}/>)}
      <Disc p={[1.38,2.58,0]} r={.15} h={.09} color="#333633" metal={.4}/>
      <Disc p={[-1.55,2.43,0]} r={.28} h={.19} color="#666964" metal={.8}/>
      <Block p={[-1.23,2.55,0]} s={[.7,.09,.18]} color="#b7b9b4" metal={.8} r={.04}/>
      <Block p={[0,2.39,0]} s={[.58,.12,.44]} color="#777a75" metal={.8}/>
    </Moving>
    <Block p={[-1.42,2.04,.72]} s={[.66,.32,.1]} color="#252c2b" r={.04}/>
    <Block p={[-1.42,2.04,.785]} s={[.46,.19,.025]} color="#68827b" r={.02} rough={.18}/>
    <Block p={[1.48,2.04,.72]} s={[.45,.3,.1]} color="#2e3634" r={.04}/>
    <Mark text="ANALOG / 35" p={[1.35,1.66,.706]} w={1.25} color="#d2d1c5" rotation={[0,0,0]}/>
    {Array.from({length:13},(_,i)=><Block key={i} p={[-1.98+i*.32,.72,-.687]} s={[.25,1.35,.018]} color="#3e403b" r={.008} rough={.9}/>)}
    <Moving controller={controller} name="lens mount" offset={[0,0,.55]}>
      <Disc p={[0,1.05,.78]} r={.92} h={.27} color="#bfc1b9" metal={.85} rotation={forward}/>
    </Moving>
    <Moving controller={controller} name="focus barrel" offset={[0,0,1.55]}>
      <Disc p={[0,1.05,1.2]} r={.78} h={.64} color="#292d2b" rotation={forward}/>
      {Array.from({length:36},(_,i)=><Block key={i} p={[.77*Math.cos(i*Math.PI/18),1.05+.77*Math.sin(i*Math.PI/18),1.24]} s={[.05,.05,.43]} color="#494c46" r={.015}/>)}
      <Disc p={[0,1.05,1.54]} r={.79} h={.12} color="#a3a69f" metal={.85} rotation={forward}/>
    </Moving>
    <Moving controller={controller} name="optical element" offset={[0,0,2.6]}>
      <Disc p={[0,1.05,1.63]} r={.65} h={.15} color="#202b2c" metal={.5} rotation={forward}/>
      <mesh position={[0,1.05,1.72]} scale={[.49,.49,.12]}><sphereGeometry args={[1,48,24]}/><meshPhysicalMaterial color="#496f6b" metalness={.35} roughness={.12} clearcoat={1}/></mesh>
      <Mark text="35 mm" p={[0,.5,1.715]} w={.55} color="#d3d5cb" rotation={[0,0,0]}/>
    </Moving>
  </group>;
}
export default function CollectionModel({id,controller}:{id:ExhibitId;controller:StudioController}) {
  return id==="002"?<Handheld controller={controller}/>:id==="003"?<Journal controller={controller}/>:<CameraModel controller={controller}/>;
}
