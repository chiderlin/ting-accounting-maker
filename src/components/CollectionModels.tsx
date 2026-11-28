"use client";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { StudioController } from "./motion/core";
import { plate } from "./geometry";
import { defaultGameBoyEdition, gameBoyEdition, type GameBoyEditionId } from "./editions";
import { surfaceTexture } from "./surfaceTextures";

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
function Handheld({controller,edition=defaultGameBoyEdition}:{controller:StudioController;edition?:GameBoyEditionId}) {
  const spec=gameBoyEdition(edition);
  const speakerHoles=Array.from({length:6},(_,i)=>({x:.73+i*.12,z:1.95-i*.045,w:.065,h:.39,r:.03}));
  const geometry=useMemo(()=>({
    front:plate(3.2,5.25,.16,spec.radius,[
      {x:0,z:-1.45,w:2.5,h:1.68,r:.16},
      {x:-.81,z:.35,w:1.04,h:1.04,r:.13},
      {x:.53,z:.38,w:.53,h:.53,r:.25},
      {x:1.04,z:.08,w:.53,h:.53,r:.25},
      {x:-.32,z:1.45,w:.46,h:.22,r:.1},
      {x:.32,z:1.45,w:.46,h:.22,r:.1},
      ...Array.from({length:6},(_,i)=>({x:.73+i*.12,z:1.95-i*.045,w:.065,h:.39,r:.03}))
    ]),
    wall:plate(3.2,5.25,.51,spec.radius,[{x:0,z:0,w:2.89,h:4.94,r:Math.max(.06,spec.radius-.09)}]),
    back:plate(3.2,5.25,.14,spec.radius,[
      {x:0,z:.98,w:1.95,h:1.91,r:.12},
      {x:0,z:-1.83,w:2.43,h:.94,r:.09}
    ])
  }),[spec.radius]);
  useEffect(()=>()=>Object.values(geometry).forEach(g=>g.dispose()),[geometry]);
  const bump=useMemo(()=>surfaceTexture(edition==="machined"),[edition]);
  useEffect(()=>()=>bump.dispose(),[bump]);
  const shellMat=useMemo(()=>new THREE.MeshPhysicalMaterial({
    color:spec.shell,roughness:spec.roughness,metalness:spec.metalness,
    anisotropy:spec.anisotropy,transmission:spec.transmission,ior:1.58,
    thickness:.16,clearcoat:edition==="transparent"?.35:.08,
    bumpMap:bump,bumpScale:edition==="machined"?.017:edition==="transparent"?.003:.009,
    attenuationColor:new THREE.Color("#9676d2"),attenuationDistance:2.8,
    envMapIntensity:1.15
  }),[spec,bump,edition]);
  useEffect(()=>()=>shellMat.dispose(),[shellMat]);
  const shellPart=(name:string,p:Vec,g:THREE.BufferGeometry)=><mesh name={name} position={p} geometry={g} material={shellMat} castShadow receiveShadow/>;
  const screw=(x:number,z:number,y:number)=><group key={x+":"+z} position={[x,y,z]}><Disc p={[0,0,0]} r={.082} h={.045} color="#b0b3b2" metal={.9}/><Block p={[0,.025,0]} s={[.09,.008,.019]} color="#414548" r={.003}/><Block p={[0,.026,0]} s={[.019,.008,.09]} color="#414548" r={.003}/></group>;
  return <group name="Game Boy — handheld study">
    <group name="rear housing">
      {shellPart("rear shell plate",[0,.09,0],geometry.back)}
      {shellPart("perimeter shell wall",[0,.405,0],geometry.wall)}
      {[-1,1].flatMap(x=>[-1,1].map(z=><group key={x+":"+z}>
        <mesh position={[x*1.27,.30,z*2.16]} material={shellMat}><cylinderGeometry args={[.12,.14,.31,24]}/></mesh>
        {screw(x*1.27,z*2.16,.48)}
      </group>))}
      {[-1,1].map(x=><Block key={x} p={[x*1.55,.64,0]} s={[.032,.035,4.64]} color={spec.seam} r={.01}/>)}
      <Block p={[0,.075,.98]} s={[1.92,.13,1.88]} color={spec.seam} r={.09} name="battery door"/>
      {Array.from({length:7},(_,i)=><Block key={i} p={[-.66+i*.22,.005,1.45]} s={[.08,.018,.34]} color={spec.shell} r={.018}/>)}
      <Block p={[0,.07,-1.83]} s={[2.38,.13,.89]} color="#777b78" r={.07} name="cartridge"/>
      {Array.from({length:12},(_,i)=><Block key={i} p={[-.87+i*.158,.15,-1.68]} s={[.08,.018,.27]} color="#bda36c" metal={.8} r={.006}/>)}
      <Block p={[0,.36,-2.63]} s={[1.62,.10,.045]} color="#343638" r={.025} name="cartridge slot"/>
      <Block p={[-.88,.60,-2.58]} s={[.42,.12,.15]} color={spec.dpad} r={.035} name="power switch"/>
      <Block p={[1.6,.35,-1.1]} s={[.035,.18,.42]} color="#343638" r={.02} name="link port"/>
    </group>
    <Moving controller={controller} name="circuit assembly" offset={[0,.8,0]}>
      <Block p={[0,.49,0]} s={[2.76,.08,4.70]} color="#365e49" r={.12} rough={.75}/>
      {Array.from({length:18},(_,i)=><Block key={i} p={[-1.15+i*.135,.54,.35+(i%4)*.36]} s={[.026,.009,1.25]} color="#b6a263" r={.003} metal={.72}/>)}
      <Block p={[0,.57,-.18]} s={[.87,.12,.71]} color="#262a29" r={.025}/>
      <Mark text="DM / CPU" p={[0,.635,-.18]} w={.58} color="#b8c1b6"/>
      {Array.from({length:10},(_,i)=><group key={i}>{[-1,1].map(z=><Block key={z} p={[-.39+i*.087,.55,-.18+z*.39]} s={[.045,.032,.15]} color="#bebdb4" metal={.8} r={.004}/>)}</group>)}
      {[-.95,.95].map(x=><group key={x}><Block p={[x,.57,-.55]} s={[.33,.12,.46]} color="#343938" r={.024}/><Disc p={[x,.56,1.2]} r={.15} h={.14} color="#aeb8b6" metal={.8}/></group>)}
      {Array.from({length:14},(_,i)=><Block key={i} p={[-1.12+(i%7)*.35,.55,-2.05+Math.floor(i/7)*.24]} s={[.14,.045,.08]} color={i%3===0?"#b8ab85":"#555f55"} r={.007}/>)}
      <Disc p={[.97,.55,1.8]} r={.33} h={.06} color="#323c3b" metal={.3}/>
    </Moving>
    <Moving controller={controller} name="front enclosure" offset={[0,2.05,0]}>
      {shellPart("front face",[0,.76,0],geometry.front)}
      <Mark text="POCKET / 89" p={[0,.87,-2.39]} w={1.45} color={spec.legend}/>
      <Mark text="SELECT       START" p={[0,.87,1.72]} w={1.35} color={spec.legend}/>
      <Mark text="B" p={[.53,.87,.73]} w={.24} color={spec.legend}/>
      <Mark text="A" p={[1.04,.87,.43]} w={.24} color={spec.legend}/>
      {speakerHoles.map((h,i)=><Block key={i} p={[h.x,.66,h.z]} s={[.058,.025,.36]} color="#292d30" r={.015}/>)}
    </Moving>
    <Moving controller={controller} name="LCD and bezel" offset={[0,1.4,0]}>
      <Block p={[0,.76,-1.45]} s={[2.45,.23,1.63]} color={spec.bezel} r={.12} rough={.43}/>
      <Block p={[0,.89,-1.47]} s={[1.87,.035,1.23]} color="#819568" r={.047} rough={.26}/>
      {Array.from({length:18},(_,i)=><Block key={i} p={[-.66+(i%6)*.25,.91,-1.81+Math.floor(i/6)*.2]} s={[.11,.005,.11]} color={i%4===0?"#4c6041":"#98a778"} r={.002}/>)}
      <RoundedBox position={[0,.93,-1.47]} args={[1.89,.026,1.25]} radius={.012} smoothness={3}><meshPhysicalMaterial color="#eff6e0" transmission={.96} thickness={.025} ior={1.48} roughness={.065}/></RoundedBox>
      <Mark text="DOT MATRIX" p={[0,.885,-.75]} w={1.15} color="#e3dfce"/>
      <Disc p={[-1.04,.89,-1.93]} r={.04} h={.018} color="#b94b46"/>
    </Moving>
    <Moving controller={controller} name="controls" offset={[0,3.1,0]}>
      <Block p={[-.81,.85,.35]} s={[.96,.19,.34]} color={spec.dpad} r={.06}/>
      <Block p={[-.81,.855,.35]} s={[.34,.20,.96]} color={spec.dpad} r={.06}/>
      {[-1,1].map(n=><group key={n}><Block p={[-.81+n*.33,.955,.35]} s={[.12,.012,.055]} color="#797c7b" r={.006}/><Block p={[-.81,.96,.35+n*.33]} s={[.055,.012,.12]} color="#797c7b" r={.006}/></group>)}
      <Disc p={[-.81,.96,.35]} r={.095} h={.012} color="#282b2a"/>
      {[[.53,.38],[1.04,.08]].map(([x,z])=><group key={x}><Disc p={[x,.86,z]} r={.245} h={.21} color={spec.button}/><Disc p={[x,.969,z]} r={.205} h={.025} color={spec.button}/></group>)}
      {[-.32,.32].map(x=><Block key={x} p={[x,.86,1.45]} s={[.43,.14,.19]} color="#666b68" r={.065}/>)}
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
export default function CollectionModel({id,controller,gameBoyEdition=defaultGameBoyEdition}:{id:ExhibitId;controller:StudioController;gameBoyEdition?:GameBoyEditionId}) {
  return id==="002"?<Handheld controller={controller} edition={gameBoyEdition}/>:id==="003"?<Journal controller={controller}/>:<CameraModel controller={controller}/>;
}
