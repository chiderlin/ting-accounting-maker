"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { OrbitControls as Controls } from "three-stdlib";
import CollectionModel, { type ExhibitId } from "./CollectionModels";
import MotionRig from "./motion/MotionRig";
import { makerProfile } from "./motion/makerProfile";
import type { StudioController } from "./motion/core";
import { cameraPresets, studioPreset } from "./presets";
import MakerConsole, { type Settings } from "./MakerConsole";
function Snapshot({onCapture}:{onCapture:(image:string)=>void}) {
  const frames=useRef(0);
  const pending=useRef<number|null>(null);
  useEffect(()=>()=>{if(pending.current!==null)cancelAnimationFrame(pending.current);},[]);
  useFrame(({gl,scene,camera,invalidate})=>{
    gl.render(scene,camera);
    if(frames.current++<4){invalidate();return;}
    if(frames.current!==5)return;
    try {
      const image=gl.domElement.toDataURL("image/png");
      pending.current=requestAnimationFrame(()=>onCapture(image));
    } catch { /* Keep the accessible text fallback if capture is unavailable. */ }
  },1);
  return null;
}
function Camera({ view, exhibition, controller, exhibit }: { view: { name: string; id: number }; exhibition: boolean; controller: StudioController; exhibit?: ExhibitId }) {
  const { camera, invalidate, size } = useThree();
  const ref = useRef<Controls>(null);
  useEffect(() => {
    const positions = cameraPresets;
    camera.position.set(...(exhibit === "004" ? [7, 5, 10] as const : positions[view.name]));
    ref.current?.target.set(0, 0.65, 0);
    ref.current?.update();
    invalidate();
  }, [view, camera, invalidate, exhibit]);
  useEffect(() => {
    if (!exhibition) return;
    const orbit = ref.current;
    if (!orbit) return;
    const frame = () => {
      const progress = controller.getSnapshot().progress;
      const blend = progress * progress * (3 - 2 * progress);
      const aspect = size.width / Math.max(1, size.height);
      const aspectFit = Math.max(1, 1 / Math.max(.5, aspect));
      const radius = (exhibit ? 12.5 + (exhibit === "003" ? 4 : 5) * blend : Math.hypot(...cameraPresets[view.name]) * (.84 + .43 * blend)) * aspectFit;
      const direction = camera.position.clone().sub(orbit.target).normalize();
      orbit.target.set(exhibit === "003" ? -.8 * blend : 0, exhibit === "004" ? 1.2 + .4 * blend : .65 + 1.8 * blend, exhibit === "004" ? 1.1 * blend : 0);
      camera.position.copy(orbit.target).addScaledVector(direction, Math.min(radius, 29));
      orbit.update();
      invalidate();
    };
    frame();
    return controller.subscribe(frame);
  }, [camera, controller, exhibition, invalidate, size.width, size.height, view, exhibit]);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      minDistance={5}
      maxDistance={30}
      enablePan={false}
      enableZoom={!exhibition}
    />
  );
}
export default function Scene({
  settings,
  view,
  controller,
  exhibition = false,
  exhibit,
  onCapture,
}: {
  settings: Settings;
  exhibition?: boolean;
  exhibit?: ExhibitId;
  onCapture?: (image:string)=>void;
  controller: StudioController;
  view: { name: string; id: number };
}) {
  return (
    <Canvas
      shadows
      dpr={onCapture ? 1 : [1, 1.75]}
      camera={{ position: [7, 8, 9], fov: 40 }}
      frameloop="demand"
      gl={{ antialias: true }}
      fallback={
        <p className="loading">
          WebGL is unavailable. Please enable hardware acceleration to inspect
          this 3D model.
        </p>
      }
    >
      <color attach="background" args={[exhibition ? "#F4F3EE" : "#eeece5"]} />
      <ambientLight intensity={studioPreset.ambient * settings.light} />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={studioPreset.key * settings.light}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[5,4,1]} intensity={studioPreset.fill * settings.light} />
      <directionalLight position={[0,5,-6]} intensity={studioPreset.rim * settings.light} />
      <Environment resolution={256}>
        <Lightformer
          position={[-5, 5, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 7, 1]}
          intensity={3 * settings.light}
        />
        <Lightformer
          position={[3, 5, -4]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[4, 4, 1]}
          intensity={2 * settings.light}
        />
        <Lightformer
          position={[0, 7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={7}
          intensity={settings.light}
        />
      </Environment>
      {exhibit ? <CollectionModel key={exhibit} id={exhibit} controller={controller}/> : <MotionRig controller={controller} profile={makerProfile}>
        <MakerConsole settings={settings} />
      </MotionRig>}
      <ContactShadows
        position={[0, -0.03, 0]}
        opacity={0.38}
        scale={15}
        blur={2.8}
        far={5}
        frames={1}
      />
      <Camera view={view} exhibition={exhibition} controller={controller} exhibit={exhibit} />
      {onCapture && <Snapshot onCapture={onCapture}/>}
    </Canvas>
  );
}
