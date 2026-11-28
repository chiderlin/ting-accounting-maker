"use client";
import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { plate, capGeometry } from "./geometry";
import { materialPreset } from "./presets";
import { defaultMakerEdition, makerEdition, type MakerEditionId } from "./editions";
import { surfaceTexture } from "./surfaceTextures";
export const PARTS = [
  "Bottom Case",
  "PCB",
  "Electronic Components",
  "Top Case",
  "LCD",
  "Mechanical Switches",
  "Keycaps",
  "Rotary Encoder",
  "Screws",
] as const;
export type Part = (typeof PARTS)[number];
export type Settings = {
  wire: boolean;
  roughness: number;
  transmission: number;
  light: number;
  hidden: Part[];
};
const keys = ["ACC", "AI", "RPA", "DATA", "FLOW", "RUN"];
export default function MakerConsole({ settings: s, edition = defaultMakerEdition }: { settings: Settings; edition?: MakerEditionId }) {
  const design = makerEdition(edition);
  const textures = useMemo(() => ({ brushed: surfaceTexture(true), grain: surfaceTexture(false) }), []);
  useEffect(() => () => Object.values(textures).forEach(texture => texture.dispose()), [textures]);
  const geo = useMemo(
    () => ({
      bottom: plate(4.4, 4.5, 0.2, design.radius),
      wall: plate(4.4, 4.5, 0.55, design.radius, [
        { x: 0, z: 0, w: 4.02, h: 4.12, r: 0.27 },
      ]),
      top: plate(4.4, 4.5, 0.13, design.radius, [
        ...keys.map((_, i) => ({
          x: ((i % 3) - 1) * 1.12,
          z: 0.15 + Math.floor(i / 3) * 1.16,
          w: 1.04,
          h: 1.04,
          r: 0.12,
        })),
        { x: -0.64, z: -1.38, w: 2.05, h: 0.85, r: 0.12 },
        { x: 1.25, z: -1.38, w: 0.85, h: 0.85, r: 0.42 },
      ]),
      seam: plate(4.34, 4.44, .025, design.radius, [
        { x: 0, z: 0, w: 4.02, h: 4.12, r: .2 },
      ]),
      pcb: plate(3.97, 4.04, 0.055, 0.65),
      cap: capGeometry(),
    }),
    [design.radius],
  );
  const mats = useMemo(
    () => ({
      shell: new THREE.MeshPhysicalMaterial({
        color: design.shell,
        roughness: design.roughness,
        metalness: design.metalness,
        anisotropy: design.anisotropy,
        anisotropyRotation: 0,
        bumpMap: edition === "aluminium" ? textures.brushed : textures.grain,
        bumpScale: edition === "aluminium" ? .008 : .003,
        transmission: edition === "frosted" ? s.transmission : 0,
        thickness: .19,
        ior: 1.58,
        attenuationColor: "#eee7d5",
        attenuationDistance: 5,
        wireframe: s.wire,
      }),
      pcb: new THREE.MeshStandardMaterial({
        color: materialPreset.pcb,
        roughness: 0.78,
        wireframe: s.wire,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#242b25",
        roughness: 0.75,
        wireframe: s.wire,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: materialPreset.metal,
        metalness: 0.95,
        roughness: materialPreset.metalRoughness,
        wireframe: s.wire,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: "#bca36c",
        metalness: 0.75,
        roughness: 0.45,
        wireframe: s.wire,
      }),
      lcd: new THREE.MeshPhysicalMaterial({color:"#8b9b70",roughness:.28,clearcoat:.65,wireframe:s.wire}),
      frost: new THREE.MeshPhysicalMaterial({
        color: materialPreset.frost,
        roughness: materialPreset.frostRoughness,
        transmission: s.transmission,
        thickness: 0.18,
        ior: 1.46,
        opacity: 1,
        wireframe: s.wire,
      }),
    }),
    [s.wire, s.transmission, design, edition, textures],
  );
  useEffect(() => () => { Object.values(geo).forEach(g => g.dispose()); }, [geo]);
  useEffect(() => () => { Object.values(mats).forEach(m => m.dispose()); }, [mats]);
  function box(
    name: string,
    p: [number, number, number],
    size: [number, number, number],
    mat: THREE.Material,
    r = 0.03,
  ) {
    return (
      <RoundedBox
        key={name}
        name={name}
        position={p}
        args={size}
        radius={Math.min(r, Math.min(...size) / 2 - .001)}
        smoothness={4}
        material={mat}
        castShadow
        receiveShadow
      />
    );
  }
  function label(
    text: string,
    p: [number, number, number],
    w: number,
    color = "#253024",
    bg = "transparent",
  ) {
    return (
      <Label
        key={text}
        text={text}
        position={p}
        width={w}
        color={color}
        bg={bg}
      />
    );
  }
  const group = (name: Part, children: React.ReactNode) => (
    <group
      key={name}
      name={name}
      visible={!s.hidden.includes(name)}
      userData={{ assemblyAxis: [0, 1, 0], independentlyControllable: true }}
    >
      {children}
    </group>
  );
  return (
    <group name="Maker Console 01">
      {group(
        "Bottom Case",
        <>
          <mesh
            geometry={geo.bottom}
            material={mats.shell}
            position={[0, 0.24, 0]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={geo.wall}
            material={mats.shell}
            position={[0, 0.61, 0]}
            castShadow
            receiveShadow
          />
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) =>
              box(
                `rubber-foot-${x}-${z}`,
                [x * 1.65, 0.08, z * 1.68],
                [0.55, 0.16, 0.45],
                mats.dark,
                0.07,
              ),
            ),
          )}
          {box(
            "USB-C surround",
            [0, 0.61, -2.26],
            [0.6, 0.23, 0.07],
            mats.metal,
            0.06,
          )}
          {box(
            "USB-C socket",
            [0, 0.61, -2.305],
            [0.44, 0.12, 0.025],
            mats.dark,
            0.04,
          )}
          {[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`boss-${x}-${z}`} position={[x * 1.92, .64, z * 1.95]} material={mats.shell}>
            <cylinderGeometry args={[.13, .15, .55, 24]} />
          </mesh>))}
          {label("MAKER / 01", [0, 0.345, 1.94], 1.2)}
        </>,
      )}
      {group(
        "PCB",
        <>
          <mesh
            geometry={geo.pcb}
            position={[0, 0.48, 0]}
            material={mats.pcb}
            receiveShadow
          />
          {Array.from({length:18},(_,i)=>{
            const x=-1.55+i*.17, z=-1.55+(i%5)*.23;
            const points=[new THREE.Vector3(x,.54,-1.7),new THREE.Vector3(x,.54,z),new THREE.Vector3(x+.13,.54,z+.13),new THREE.Vector3(x+.13,.54,1.6)];
            return <group key={i}>
              {points.slice(1).map((end,j)=>{
                const start=points[j], mid=start.clone().add(end).multiplyScalar(.5);
                return <mesh key={j} position={mid} rotation={[0,Math.atan2(end.x-start.x,end.z-start.z),0]} material={mats.gold}><boxGeometry args={[.012,.006,start.distanceTo(end)]}/></mesh>;
              })}
              <mesh position={points[3]} material={mats.gold}><cylinderGeometry args={[.035,.035,.012,16]}/></mesh>
            </group>;
          })}
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <mesh
                key={`${x}${z}`}
                position={[x * 1.6, 0.54, z * 1.65]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={mats.gold}
              >
                <torusGeometry args={[0.08, 0.015, 8, 24]} />
              </mesh>
            )),
          )}
        </>,
      )}
      {group(
        "Electronic Components",
        <>
          {box(
            "microcontroller",
            [-0.65, 0.59, -0.8],
            [0.65, 0.14, 0.4],
            mats.dark,
          )}
          {Array.from({ length: 12 }, (_, i) =>
            box(
              `resistor-${i}`,
              [-1.6 + (i % 6) * 0.57, 0.57, -1.96 + Math.floor(i / 6) * 0.3],
              [0.17, 0.07, 0.08],
              i % 2 ? mats.dark : mats.metal,
              0.01,
            ),
          )}
          {[-1, 1].map((x) => (
            <mesh key={x} position={[x * 1.75, 0.65, 0.7]} material={mats.dark}>
              <cylinderGeometry args={[0.12, 0.12, 0.25, 24]} />
            </mesh>
          ))}
        </>,
      )}
      {group(
        "Top Case",
        <>
          <mesh
            geometry={geo.top}
            material={mats.shell}
            position={[0, 0.98, 0]}
            castShadow
            receiveShadow
          />
          <mesh geometry={geo.seam} material={edition === "graphite" ? mats.metal : mats.dark} position={[0, .912, 0]} />
          {label("M A K E R   C O N S O L E   /   0 1", [0, 1.08, -1.99], 2.8, design.shellLegend)}
          {label(edition === "frosted" ? "POLYCARBONATE / 01" : edition === "aluminium" ? "CNC ALUMINIUM / 02" : "ANODISED / 03", [0, 1.08, 2], 1.8, design.shellLegend)}
        </>,
      )}
      {group(
        "LCD",
        <>
          {box(
            "LCD housing",
            [-0.64, 0.85, -1.38],
            [2.02, 0.32, 0.82],
            mats.dark,
            0.09,
          )}
          {box(
            "LCD glass",
            [-0.64, 1.02, -1.38],
            [1.83, 0.025, 0.63],
            mats.lcd,
            0.04,
          )}
          <group name="lcd-ready">{label("READY_   01", [-0.64, 1.04, -1.45], 1.5)}</group>
          <group name="lcd-test" visible={false}>{label("8888 / TEST", [-0.64, 1.04, -1.45], 1.5)}</group>
          <group name="lcd-start" visible={false}>{label("BOOTING...", [-0.64, 1.04, -1.45], 1.5)}</group>
          {label("AI / AUTOMATION", [-0.64, 1.04, -1.22], 1.44)}
        </>,
      )}
      {group(
        "Mechanical Switches",
        <>
          {keys.map((k, i) => (
            <group
              key={k}
              name={`switch-${k}`}
              position={[
                ((i % 3) - 1) * 1.12,
                0.69,
                0.15 + Math.floor(i / 3) * 1.16,
              ]}
            >
              {box("housing", [0, 0, 0], [0.65, 0.23, 0.65], mats.frost)}
              {box("stem", [0, 0.19, 0], [0.22, 0.24, 0.22], mats.dark)}
              <mesh material={mats.metal} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.16, 0.025, 8, 20]} />
              </mesh>
            </group>
          ))}
        </>,
      )}
      {group(
        "Keycaps",
        <>
          {keys.map((k, i) => (
            <group
              key={k}
              name={`keycap-${k}`}
              position={[
                ((i % 3) - 1) * 1.12,
                1.03,
                0.15 + Math.floor(i / 3) * 1.16,
              ]}
            >
              <mesh geometry={geo.cap} castShadow receiveShadow>
                <meshStandardMaterial
                  color={i === 5 ? "#af6145" : i === 1 ? "#717b50" : design.key}
                  roughness={s.roughness}
                  wireframe={s.wire}
                />
              </mesh>
              {label(
                k,
                [0, 0.39, 0.03],
                0.53,
                i === 1 || i === 5 ? "#f1e8d4" : design.legend,
              )}
            </group>
          ))}
        </>,
      )}
      {group(
        "Rotary Encoder",
        <group name="encoder-axis" position={[1.25, 0.83, -1.38]}>
          <mesh material={mats.dark}>
            <cylinderGeometry args={[0.43, 0.43, 0.2, 64]} />
          </mesh>
          <group name="rotary-cap">
          <mesh material={mats.metal} position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.38, 0.4, 96]} />
          </mesh>
          {Array.from({ length: 64 }, (_, i) => {
            const a = (i / 64) * Math.PI * 2;
            return (
              <mesh
                key={i}
                material={mats.metal}
                position={[Math.sin(a) * 0.37, 0.25, Math.cos(a) * 0.37]}
              >
                <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
              </mesh>
            );
          })}
          <mesh material={mats.metal} position={[0, 0.46, 0]}>
            <cylinderGeometry args={[0.33, 0.33, 0.018, 96]} />
          </mesh>
          {box(
            "indicator",
            [0, 0.48, -0.2],
            [0.035, 0.012, 0.13],
            mats.dark,
            0.005,
          )}
          </group>
        </group>,
      )}
      {group(
        "Screws",
        <>
          {[-1, 1].flatMap((x) =>
            [-1, 1].map((z) => (
              <group
                key={`${x}${z}`}
                name={`screw-${x}-${z}`}
                position={[x * 1.92, 1.08, z * 1.95]}
              >
                <mesh material={mats.metal} castShadow>
                  <cylinderGeometry args={[0.085, 0.085, 0.04, 32]} />
                </mesh>
                {box(
                  "slot",
                  [0, 0.025, 0],
                  [0.1, 0.01, 0.017],
                  mats.dark,
                  0.004,
                )}
                <mesh position={[0, -0.22, 0]} material={mats.metal}>
                  <cylinderGeometry args={[0.035, 0.035, 0.42, 16]} />
                </mesh>
              </group>
            )),
          )}
        </>,
      )}
    </group>
  );
}
function Label({
  text,
  position,
  width,
  color,
  bg,
}: {
  text: string;
  position: [number, number, number];
  width: number;
  color: string;
  bg: string;
}) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = Math.max(256, text.length * 72);
    c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (bg !== "transparent") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.fillStyle = color;
    ctx.font = 'bold 100px monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width / 2, 80, c.width - 16);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, color, bg]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, (width * 160) / Math.max(256, text.length * 72)]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}
