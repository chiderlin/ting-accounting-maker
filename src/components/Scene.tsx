"use client";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { OrbitControls as Controls } from "three-stdlib";
import MotionRig from "./motion/MotionRig";
import { makerProfile } from "./motion/makerProfile";
import type { StudioController } from "./motion/core";
import { cameraPresets, studioPreset } from "./presets";
import MakerConsole, { type Settings } from "./MakerConsole";
function Camera({ view }: { view: { name: string; id: number } }) {
  const { camera, invalidate } = useThree();
  const ref = useRef<Controls>(null);
  useEffect(() => {
    const positions = cameraPresets;
    camera.position.set(...positions[view.name]);
    ref.current?.target.set(0, 0.65, 0);
    ref.current?.update();
    invalidate();
  }, [view, camera, invalidate]);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      minDistance={5}
      maxDistance={30}
      enablePan={false}
    />
  );
}
export default function Scene({
  settings,
  view,
  controller,
}: {
  settings: Settings;
  controller: StudioController;
  view: { name: string; id: number };
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
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
      <color attach="background" args={["#eeece5"]} />
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
      <MotionRig controller={controller} profile={makerProfile}>
        <MakerConsole settings={settings} />
      </MotionRig>
      <ContactShadows
        position={[0, -0.03, 0]}
        opacity={0.38}
        scale={15}
        blur={2.8}
        far={5}
        frames={1}
      />
      <Camera view={view} />
    </Canvas>
  );
}
