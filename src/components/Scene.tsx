"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { Component, useEffect, useRef, type ReactNode } from "react";
import type { OrbitControls as Controls } from "three-stdlib";
import CollectionModel, { type ExhibitId } from "./CollectionModels";
import MotionRig from "./motion/MotionRig";
import { makerProfile } from "./motion/makerProfile";
import type { StudioController } from "./motion/core";
import { cameraPresets, studioPreset } from "./presets";
import { BackSide, PCFShadowMap } from "three";
import { defaultMakerEdition, defaultGameBoyEdition, type MakerEditionId, type GameBoyEditionId, defaultJournalEdition, type JournalEditionId } from "./editions";
import MakerConsole, { type Settings } from "./MakerConsole";
function RenderingFallback() {
  return <p className="loading" role="status">3D preview unavailable. Enable WebGL hardware acceleration to inspect the model. Object details remain available below.</p>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <RenderingFallback/> : this.props.children; }
}
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
    const [x, y, z] = exhibit === "004" ? [7, 5, 10] : positions[view.name];
    camera.position.set(x, y, z);
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
      enableDamping={!exhibition}
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
  edition = defaultMakerEdition,
  gameBoyEdition = defaultGameBoyEdition,
  journalEdition = defaultJournalEdition,
}: {
  settings: Settings;
  edition?: MakerEditionId;
  gameBoyEdition?: GameBoyEditionId;
  journalEdition?: JournalEditionId;
  exhibition?: boolean;
  exhibit?: ExhibitId;
  onCapture?: (image:string)=>void;
  controller: StudioController;
  view: { name: string; id: number };
}) {
  return (
    <SceneBoundary><Canvas
      shadows={{ type: PCFShadowMap }}
      dpr={onCapture ? 1 : [1, 1.75]}
      camera={{ position: [7, 8, 9], fov: 40 }}
      frameloop="demand"
      gl={{ antialias: true }}
      fallback={<RenderingFallback/>}
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
      {exhibit === "003" && <directionalLight position={[-5,1,3]} intensity={.85 * settings.light} />}
      <Environment resolution={256}>
        {(!exhibit || exhibit === "002") && <>
          <mesh><sphereGeometry args={[30, 24, 16]}/><meshBasicMaterial color="#b7b5ae" side={BackSide}/></mesh>
          <Lightformer position={[1, 3, 6]} rotation={[0, Math.PI, 0]} scale={[8, 4, 1]} intensity={2 * settings.light}/>
        </>}
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
      {exhibit ? <CollectionModel key={exhibit} id={exhibit} controller={controller} gameBoyEdition={gameBoyEdition} journalEdition={journalEdition}/> : <MotionRig controller={controller} profile={makerProfile}>
        <MakerConsole settings={settings} edition={edition} />
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
    </Canvas></SceneBoundary>
  );
}
