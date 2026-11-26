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
import MakerConsole, { type Settings } from "./MakerConsole";
function Camera({ view }: { view: { name: string; id: number } }) {
  const { camera, invalidate } = useThree();
  const ref = useRef<Controls>(null);
  useEffect(() => {
    const positions: Record<string, [number, number, number]> = {
      "45°": [7, 8, 9],
      Front: [0, 5, 11],
      Side: [11, 3, 0],
      Back: [0, 4, -11],
      Top: [0, 13, 0.01],
      Bottom: [0, -11, 0.01],
    };
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
      maxDistance={20}
      enablePan={false}
    />
  );
}
export default function Scene({
  settings,
  view,
}: {
  settings: Settings;
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
      <ambientLight intensity={0.4 * settings.light} />
      <directionalLight
        position={[-3, 8, 5]}
        intensity={2.5 * settings.light}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
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
      <MakerConsole settings={settings} />
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
